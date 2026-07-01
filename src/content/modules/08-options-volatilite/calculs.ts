/**
 * Bibliothèque de référence du module Options & volatilité.
 *
 * CONVENTIONS (valables pour tout le fichier) :
 * — Taux r et volatilités σ en % (5 = 5 %) ; durées T en années ; aucun arrondi
 *   interne (les appelants arrondissent), sauf actionsDeltaHedge qui retourne
 *   un entier (on ne traite que des actions entières).
 * — Black-Scholes et parité call-put en composition CONTINUE (e^{−rT}) : c'est
 *   la convention du modèle, enseignée comme telle au ch4 — elle DIFFÈRE du
 *   linéaire ≤ 1 an du m4/m7 (différence expliquée en cours, ordre de grandeur
 *   identique sur les horizons courts).
 * — L'arbre binomial à UNE période reste en capitalisation LINÉAIRE sur la
 *   période (cohérent avec interetMonetaire du m4 et le portage du m7) : le
 *   passage au continu est précisément ce que fait Black-Scholes à la limite.
 * — Signes : sens = +1 acheteur (long), −1 vendeur (short). Un P&L négatif est
 *   une perte. L'acheteur risque AU PLUS la prime ; le vendeur encaisse AU PLUS
 *   la prime — l'asymétrie est le cœur du module.
 * — Le delta d'un put est négatif ; gamma et vega sont IDENTIQUES pour le call
 *   et le put de mêmes (K, T) — conséquence directe de la parité.
 * — vegaOption est exprimé PAR POINT DE VOLATILITÉ (σ qui passe de 20 % à
 *   21 %), la convention des desks.
 *
 * Toutes les fonctions sont verrouillées par des valeurs de référence vérifiées
 * par intégration numérique indépendante dans calculs.test.ts (dont l'exemple
 * canonique S=100, K=100, r=5 %, σ=20 %, T=1 : call 10,4506 / put 5,5735, et
 * l'exemple de Hull 42/40). Les générateurs d'exercices DEVRONT composer ces
 * fonctions, jamais recopier une formule.
 */

import { normaleCdf } from '../02-methodes-quantitatives/calculs';

// ───────────────────────── Payoffs & points morts ─────────────────────────

/** Payoff d'un call à l'échéance : max(S_T − K, 0). Ex. (110, 100) = 10 ; (90, 100) = 0. */
export function payoffCall(sT: number, strike: number): number {
  return Math.max(sT - strike, 0);
}

/** Payoff d'un put à l'échéance : max(K − S_T, 0). Ex. (85, 100) = 15 ; (110, 100) = 0. */
export function payoffPut(sT: number, strike: number): number {
  return Math.max(strike - sT, 0);
}

/**
 * P&L d'une position optionnelle à l'échéance : sens × (payoff − prime).
 * Acheteur (+1) : perd au plus la prime, gain illimité côté call.
 * Vendeur (−1) : gagne au plus la prime, perte potentiellement illimitée —
 * vendre une option, c'est vendre de l'assurance.
 */
export function pnlOption(payoff: number, prime: number, sens: number): number {
  return sens * (payoff - prime);
}

/** Point mort de l'acheteur de call : K + prime (le sous-jacent doit monter AU-DELÀ du strike pour rembourser la prime). */
export function pointMortCall(strike: number, prime: number): number {
  return strike + prime;
}

/** Point mort de l'acheteur de put : K − prime. */
export function pointMortPut(strike: number, prime: number): number {
  return strike - prime;
}

/** Points morts d'un straddle acheté au strike K pour un coût total (call + put) : K ± coût. */
export function pointsMortsStraddle(strike: number, coutTotal: number): { bas: number; haut: number } {
  return { bas: strike - coutTotal, haut: strike + coutTotal };
}

// ───────────────────────── Parité call-put ─────────────────────────

/** Facteur d'actualisation CONTINU e^{−rT} (convention Black-Scholes). Ex. (5, 1) = 0,951229. */
export function dfContinu(rPct: number, annees: number): number {
  return Math.exp((-rPct / 100) * annees);
}

/**
 * Parité call-put : C − P = S − K·e^{−rT}, donc P = C − S + K·e^{−rT}.
 * Relation d'ARBITRAGE (aucun modèle) : call + cash = put + action, même
 * payoff à l'échéance dans tous les états du monde, donc même prix aujourd'hui.
 */
export function putDepuisParite(call: number, spot: number, strike: number, rPct: number, annees: number): number {
  return call - spot + strike * dfContinu(rPct, annees);
}

// ───────────────────────── Arbre binomial à une période ─────────────────────────

/**
 * Probabilité risque-neutre q = ((1 + r·T) − d)/(u − d), capitalisation
 * linéaire sur la période. Ce n'est PAS la probabilité réelle de hausse :
 * c'est le poids qui rend le sous-jacent « équitable » une fois actualisé —
 * l'aversion au risque est déjà dans les prix. Ex. (1.2, 0.8, 4, 1) = 0,6.
 */
export function probaRisqueNeutre(u: number, d: number, rPct: number, annees: number): number {
  return (1 + (rPct / 100) * annees - d) / (u - d);
}

/**
 * Valeur d'un dérivé dans l'arbre à une période : espérance risque-neutre
 * actualisée, [q·V_haut + (1 − q)·V_bas]/(1 + r·T).
 * Ex. call K = 100 sur S = 100, u = 1.2, d = 0.8, r = 4 % : (0,6 × 20)/1,04 = 11,538462.
 */
export function valeurBinomiale(valeurHausse: number, valeurBaisse: number, u: number, d: number, rPct: number, annees: number): number {
  const q = probaRisqueNeutre(u, d, rPct, annees);
  return (q * valeurHausse + (1 - q) * valeurBaisse) / (1 + (rPct / 100) * annees);
}

// ───────────────────────── Black-Scholes ─────────────────────────

/** Densité de la loi normale centrée réduite φ(x) (utilisée par gamma et vega). */
export function densiteNormale(x: number): number {
  return Math.exp((-x * x) / 2) / Math.sqrt(2 * Math.PI);
}

/**
 * d1 = [ln(S/K) + (r + σ²/2)·T]/(σ√T). La « distance » du spot au strike,
 * en unités d'écart-type, vue du monde risque-neutre.
 * Ex. (100, 100, 5, 20, 1) = 0,35.
 */
export function d1BlackScholes(spot: number, strike: number, rPct: number, volPct: number, annees: number): number {
  const r = rPct / 100;
  const sigma = volPct / 100;
  return (Math.log(spot / strike) + (r + (sigma * sigma) / 2) * annees) / (sigma * Math.sqrt(annees));
}

/** d2 = d1 − σ√T. N(d2) est la probabilité risque-neutre de finir dans la monnaie. */
export function d2BlackScholes(spot: number, strike: number, rPct: number, volPct: number, annees: number): number {
  return d1BlackScholes(spot, strike, rPct, volPct, annees) - (volPct / 100) * Math.sqrt(annees);
}

/**
 * Prix Black-Scholes d'un call européen (sans dividende) :
 * C = S·N(d1) − K·e^{−rT}·N(d2).
 * Ex. canonique (100, 100, 5, 20, 1) = 10,450584 ; Hull (42, 40, 10, 20, 0.5) = 4,759422.
 */
export function blackScholesCall(spot: number, strike: number, rPct: number, volPct: number, annees: number): number {
  const d1 = d1BlackScholes(spot, strike, rPct, volPct, annees);
  const d2 = d2BlackScholes(spot, strike, rPct, volPct, annees);
  return spot * normaleCdf(d1) - strike * dfContinu(rPct, annees) * normaleCdf(d2);
}

/**
 * Prix Black-Scholes d'un put européen : P = K·e^{−rT}·N(−d2) − S·N(−d1)
 * (équivaut à la parité appliquée au call). Ex. (100, 100, 5, 20, 1) = 5,573526.
 */
export function blackScholesPut(spot: number, strike: number, rPct: number, volPct: number, annees: number): number {
  const d1 = d1BlackScholes(spot, strike, rPct, volPct, annees);
  const d2 = d2BlackScholes(spot, strike, rPct, volPct, annees);
  return strike * dfContinu(rPct, annees) * normaleCdf(-d2) - spot * normaleCdf(-d1);
}

// ───────────────────────── Grecques ─────────────────────────

/** Delta d'un call : N(d1) ∈ (0, 1). ATM ≈ 0,5 (un peu plus) ; ITM profond → 1 ; OTM profond → 0. */
export function deltaCall(spot: number, strike: number, rPct: number, volPct: number, annees: number): number {
  return normaleCdf(d1BlackScholes(spot, strike, rPct, volPct, annees));
}

/** Delta d'un put : N(d1) − 1 ∈ (−1, 0). Relation exacte : deltaCall − deltaPut = 1. */
export function deltaPut(spot: number, strike: number, rPct: number, volPct: number, annees: number): number {
  return deltaCall(spot, strike, rPct, volPct, annees) - 1;
}

/**
 * Gamma (identique call/put) : φ(d1)/(S·σ√T). La convexité du delta —
 * maximal ATM près de l'échéance : c'est là que le delta-hedging coûte cher.
 * Ex. (100, 100, 5, 20, 1) = 0,018762.
 */
export function gammaOption(spot: number, strike: number, rPct: number, volPct: number, annees: number): number {
  const d1 = d1BlackScholes(spot, strike, rPct, volPct, annees);
  return densiteNormale(d1) / (spot * (volPct / 100) * Math.sqrt(annees));
}

/**
 * Vega (identique call/put), PAR POINT DE VOLATILITÉ : S·φ(d1)·√T / 100.
 * Ex. (100, 100, 5, 20, 1) = 0,375240 : si σ passe de 20 % à 21 %, le call
 * prend ≈ 0,38. Maximal ATM et croissant avec la maturité.
 */
export function vegaOption(spot: number, strike: number, rPct: number, volPct: number, annees: number): number {
  const d1 = d1BlackScholes(spot, strike, rPct, volPct, annees);
  return (spot * densiteNormale(d1) * Math.sqrt(annees)) / 100;
}

/**
 * Nombre d'actions pour delta-hedger nbContrats d'options (quotité d'actions
 * par contrat, 100 par défaut) : |delta| × nbContrats × quotité, ARRONDI
 * STANDARD — on ne traite que des actions entières. Le vendeur d'un call
 * ACHÈTE ce nombre d'actions ; il devra réajuster quand le delta bougera
 * (c'est le gamma qui décide de la fréquence).
 * Ex. (0.636831, 10, 100) = 637.
 */
export function actionsDeltaHedge(delta: number, nbContrats: number, quotite = 100): number {
  return Math.round(Math.abs(delta) * nbContrats * quotite);
}

// ───────────────────────── Volatilité ─────────────────────────

/** Annualisation d'une volatilité quotidienne : σ_an = σ_jour × √252. Ex. (1.2) = 19,0494 %. */
export function volAnnualiseePct(volQuotidiennePct: number, joursParAn = 252): number {
  return volQuotidiennePct * Math.sqrt(joursParAn);
}

/**
 * Volatilité implicite (en %) d'un call : l'unique σ tel que
 * blackScholesCall(S, K, r, σ, T) = prime — le prix se lit en vol.
 * Inversion par dichotomie sur [0,01 %, 300 %] (le prix BS est strictement
 * croissant en σ), précision 1e-7 sur la prime.
 * Ex. (10.450584, 100, 100, 5, 1) = 20,0000.
 */
export function volImplicitePct(primeCall: number, spot: number, strike: number, rPct: number, annees: number): number {
  let basse = 0.01;
  let haute = 300;
  for (let i = 0; i < 200; i++) {
    const milieu = (basse + haute) / 2;
    const prix = blackScholesCall(spot, strike, rPct, milieu, annees);
    if (Math.abs(prix - primeCall) < 1e-7) return milieu;
    if (prix < primeCall) basse = milieu;
    else haute = milieu;
  }
  return (basse + haute) / 2;
}
