/**
 * Bibliothèque de référence du module Produits structurés & pricing de structuration.
 *
 * CONVENTIONS (valables pour tout le fichier) :
 * — Taux r et volatilités σ en % (5 = 5 %) ; durées T en années ; aucun arrondi
 *   interne (les appelants arrondissent).
 * — Actualisation CONTINUE e^{−rT} PARTOUT (via dfContinu du m8) : c'est la
 *   convention de Black-Scholes et du desk de structuration — elle DIFFÈRE du
 *   linéaire ≤ 1 an du m4 (interetMonetaire) ; l'écart est du second ordre sur
 *   les horizons courts et expliqué en cours.
 * — Nominal 100 par défaut : tous les prix (zéro-coupon, budget, primes,
 *   coupons, marges, flux d'autocall) s'expriment en % DU NOMINAL. La
 *   participation est un RATIO (0,72 = 72 %).
 * — Les barrières d'autocall et de worst-of s'expriment en % DU NIVEAU INITIAL
 *   du sous-jacent (100 = niveau initial) ; les barrières du down-and-in put
 *   restent en niveau ABSOLU, comme le strike (cohérent avec le m8).
 * — EXCEPTION à la règle des % : la corrélation ρ est en DÉCIMAL (0,7 = 70 %),
 *   car elle entre telle quelle dans la décomposition de Cholesky.
 * — Monte-Carlo : DÉTERMINISTE, seedé par mulberry32 (src/engine/rng.ts),
 *   tirages normaux par Box-Muller, schéma lognormal EXACT sous le drift
 *   risque-neutre r − σ²/2 (aucune erreur de discrétisation sur la loi
 *   marginale ; seul le suivi de barrière est discret — un minimum observé sur
 *   nbPas dates sous-estime le vrai minimum continu, donc sous-estime le DIP).
 * — Les fonctions Black-Scholes viennent du m8 (blackScholesCall/Put, dfContinu),
 *   JAMAIS recopiées : le structureur ACHÈTE ses briques au desk options.
 *
 * Toutes les fonctions sont verrouillées dans calculs.test.ts par des valeurs
 * de référence calculées indépendamment (CDF normale par série de erf) et par
 * des limites analytiques : ZC(5 %, 5 ans) = 77,8801 ; coupon RC à prime nulle
 * = taux capitalisé ; MC → Black-Scholes ; DIP(barrière = strike) = put
 * vanille ; ρ = 1 ⇒ worst-of = mono sous-jacent. Les générateurs d'exercices
 * DEVRONT composer ces fonctions, jamais recopier une formule.
 */

import { mulberry32, type Rng } from '../../../engine/rng';
import { dfContinu } from '../08-options-volatilite/calculs';

// ───────────────────────── Briques du structureur ─────────────────────────

/**
 * Prix du zéro-coupon en % du nominal : 100·e^{−rT}. C'est la brique qui
 * GARANTIT le capital : placer 77,88 aujourd'hui (r = 5 %, T = 5) redonne 100
 * à l'échéance, quoi qu'il arrive au sous-jacent. Ex. (5, 5) = 77,880078.
 */
export function prixZeroCoupon(rPct: number, annees: number): number {
  return 100 * dfContinu(rPct, annees);
}

/**
 * Budget d'options : ce qui reste du nominal une fois le capital garanti et la
 * marge servie, 100 − ZC − marge (tout en % du nominal). C'est LA contrainte
 * du structureur : taux bas ⇒ ZC cher ⇒ budget maigre ⇒ produits moins
 * généreux (ou plus risqués). Ex. (77,880078, 1) = 21,119922.
 */
export function budgetOptions(prixZCPct: number, margePct = 0): number {
  return 100 - prixZCPct - margePct;
}

/**
 * Participation d'un capital garanti : budget / prix du call ATM (tous deux en
 * % du nominal) — la formule phare du chapitre. Avec 21,12 de budget et un
 * call ATM 5 ans à 29,14, on n'offre que 72,5 % de la hausse ; si le budget
 * dépassait le prix du call, la participation dépasserait 100 %.
 * Retourne un RATIO (0,724809 = 72,48 %). Ex. (22.5, 15) = 1,5.
 */
export function participationCapitalGaranti(budgetPct: number, prixCallPct: number): number {
  return budgetPct / prixCallPct;
}

/**
 * Coupon ANNUEL équivalent d'un reverse convertible, en % du nominal par an.
 * Décomposition exacte : le client apporte 100 ; le structureur place le
 * zéro-coupon (100·e^{−rT}, qui redonnera le nominal) et VEND un put sur le
 * sous-jacent (prime encaissée aujourd'hui). Le disponible aujourd'hui,
 * 100 − ZC + prime, est capitalisé jusqu'à maturité (÷ e^{−rT}) puis réparti
 * par année : coupon = (100 − ZC + prime)/e^{−rT}/T.
 * — prime = 0 ⇒ coupon = 100·(e^{rT} − 1)/T : le simple taux sans risque
 *   capitalisé — tout coupon AU-DESSUS du taux est le prix du risque vendu.
 * — S = K = 100 : 100 − ZC + P = C par parité (m8) — le disponible du
 *   structureur est exactement le prix du call abandonné par le client.
 * Ex. (5.573526, 5, 1) = 10,986396.
 */
export function couponReverseConvertible(primePutPct: number, rPct: number, annees: number): number {
  const disponible = 100 - prixZeroCoupon(rPct, annees) + primePutPct;
  return disponible / dfContinu(rPct, annees) / annees;
}

/**
 * Marge commerciale annualisée : marge totale (en % du nominal) répartie
 * LINÉAIREMENT sur la durée, marge/T — la convention d'affichage des desks
 * (une marge de 5 % sur 5 ans « coûte » 1 % par an au client). Ex. (5, 5) = 1.
 */
export function margeCommercialeAnnualisee(margePct: number, annees: number): number {
  return margePct / annees;
}

// ───────────────────────── Monte-Carlo seedé ─────────────────────────

/**
 * Tirage d'une normale centrée réduite par Box-Muller : z = √(−2·ln u1)·cos(2π·u2).
 * Consomme DEUX uniformes du générateur (on ne garde que la branche cosinus,
 * sans état caché : même graine ⇒ même suite, la reproductibilité prime).
 * u1 est pris comme 1 − rng() ∈ (0, 1] pour éviter ln(0).
 */
export function normaleStandard(rng: Rng): number {
  const u1 = 1 - rng();
  const u2 = rng();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

/** Un pas lognormal exact : S·exp[(r − σ²/2)·dt + σ√dt·z] (drift risque-neutre). */
function pasLognormal(s: number, rPct: number, volPct: number, dtAnnees: number, z: number): number {
  const r = rPct / 100;
  const sigma = volPct / 100;
  return s * Math.exp((r - (sigma * sigma) / 2) * dtAnnees + sigma * Math.sqrt(dtAnnees) * z);
}

/** Trajectoire depuis un Rng déjà ouvert (partagé entre les trajectoires d'un même pricing MC). */
function trajectoireDepuis(rng: Rng, s0: number, rPct: number, volPct: number, dtAnnees: number, nbPas: number): number[] {
  const t = [s0];
  for (let i = 1; i <= nbPas; i++) {
    t.push(pasLognormal(t[i - 1], rPct, volPct, dtAnnees, normaleStandard(rng)));
  }
  return t;
}

/**
 * Trajectoire lognormale seedée : nbPas pas de durée dtAnnees, schéma EXACT
 * S_{i+1} = S_i·exp[(r − σ²/2)·dt + σ√dt·z]. Retourne nbPas + 1 niveaux,
 * [s0, S_1, …, S_nbPas]. Même graine ⇒ même trajectoire (mulberry32).
 * Cas limite σ = 0 : croissance déterministe au taux sans risque, S_t = s0·e^{rt}.
 */
export function trajectoireLognormale(seed: number, s0: number, rPct: number, volPct: number, dtAnnees: number, nbPas: number): number[] {
  return trajectoireDepuis(mulberry32(seed), s0, rPct, volPct, dtAnnees, nbPas);
}

/**
 * n prix terminaux S_T simulés en UN pas exact chacun (la loi de S_T est
 * connue : pas besoin de discrétiser quand seul le niveau final compte).
 * Sous le drift risque-neutre, la moyenne empirique tend vers S·e^{rT}.
 */
export function simulationsFinales(seed: number, n: number, s0: number, rPct: number, volPct: number, annees: number): number[] {
  const rng = mulberry32(seed);
  const finals: number[] = [];
  for (let i = 0; i < n; i++) {
    finals.push(pasLognormal(s0, rPct, volPct, annees, normaleStandard(rng)));
  }
  return finals;
}

/**
 * Prix Monte-Carlo d'un call européen : moyenne des payoffs max(S_T − K, 0)
 * actualisée en continu — l'espérance risque-neutre estimée par la loi des
 * grands nombres. Converge vers blackScholesCall en 1/√n (erreur-type ≈ 0,05
 * pour n = 100 000 sur le call canonique à 10,45) : le test de cohérence MC ↔
 * formule fermée est LE réflexe de validation d'un moteur de pricing.
 */
export function prixMonteCarloCall(seed: number, n: number, s0: number, strike: number, rPct: number, volPct: number, annees: number): number {
  const finals = simulationsFinales(seed, n, s0, rPct, volPct, annees);
  let somme = 0;
  for (const sT of finals) somme += Math.max(sT - strike, 0);
  return (somme / n) * dfContinu(rPct, annees);
}

// ───────────────────────── Autocall (athena simple) ─────────────────────────

/**
 * Paramètres d'un autocall « athena » : barrières en % du NIVEAU INITIAL,
 * coupon PAR PÉRIODE en % du nominal, observations tous les dtAnnees.
 */
export interface ParamsAutocall {
  /** Barrière de rappel anticipé (ex. 100 = le niveau initial). */
  barriereRappelPct: number;
  /** Coupon par période d'observation, en % du nominal (ex. 6). */
  couponPct: number;
  /** Barrière de protection du capital, observée À MATURITÉ seulement (ex. 60). */
  barriereProtectionPct: number;
  /** Taux sans risque en % (actualisation continue des flux). */
  rPct: number;
  /** Durée entre deux observations, en années (ex. 1). */
  dtAnnees: number;
  /** Nombre de dates d'observation (la dernière est la maturité). */
  nbPeriodes: number;
}

export interface ResultatAutocall {
  /** Période du rappel anticipé (1 à nbPeriodes), ou null si le produit va à maturité sans rappel. */
  periodeRappel: number | null;
  /** Flux unique versé, en % du nominal. */
  flux: number;
  /** Date du flux, en années. */
  dateFlux: number;
  /** Flux actualisé en continu : flux·e^{−r·dateFlux}. */
  fluxActualise: number;
}

/**
 * Mécanique de l'autocall « athena » retenue (documentée ici une fois pour toutes) :
 * — À chaque date d'observation i = 1…N : si S_i ≥ barrière de rappel × S_0,
 *   RAPPEL anticipé, flux unique 100 + coupon × i versé en i·dt (effet
 *   mémoire : les coupons des périodes passées sont rattrapés au rappel).
 * — Jamais rappelé (donc S_N < barrière de rappel à maturité) : si
 *   S_N ≥ barrière de protection × S_0, remboursement du capital seul (100,
 *   pas de coupon) ; sinon remboursement DÉGRADÉ S_N/S_0 × 100 — le client a
 *   implicitement VENDU un down-and-in put à maturité, c'est là que loge le
 *   rendement du coupon.
 * `observations` : niveaux ABSOLUS du sous-jacent aux dates 1…N (au moins
 * nbPeriodes valeurs ; celles après un rappel sont ignorées).
 */
export function payoffAutocall(observations: number[], s0: number, params: ParamsAutocall): ResultatAutocall {
  const { barriereRappelPct, couponPct, barriereProtectionPct, rPct, dtAnnees, nbPeriodes } = params;
  const rappel = (s0 * barriereRappelPct) / 100;
  const protection = (s0 * barriereProtectionPct) / 100;
  for (let i = 1; i <= nbPeriodes; i++) {
    if (observations[i - 1] >= rappel) {
      const flux = 100 + couponPct * i;
      const dateFlux = i * dtAnnees;
      return { periodeRappel: i, flux, dateFlux, fluxActualise: flux * dfContinu(rPct, dateFlux) };
    }
  }
  const sN = observations[nbPeriodes - 1];
  const flux = sN >= protection ? 100 : (sN / s0) * 100;
  const dateFlux = nbPeriodes * dtAnnees;
  return { periodeRappel: null, flux, dateFlux, fluxActualise: flux * dfContinu(rPct, dateFlux) };
}

/**
 * Prix Monte-Carlo de l'autocall : moyenne des flux actualisés sur n
 * trajectoires seedées (une observation par période, pas de dtAnnees).
 * Limite analytique σ = 0, r > 0 : rappel certain dès la première observation
 * (S_1 = S_0·e^{r·dt} ≥ S_0), prix = (100 + coupon)·e^{−r·dt}.
 * Sensibilités attendues (testées) : prix DÉCROISSANT en volatilité
 * (l'acheteur d'autocall est vendeur de vol via le put down-and-in) et
 * CROISSANT quand la barrière de protection baisse.
 */
export function prixAutocallMC(seed: number, n: number, s0: number, volPct: number, params: ParamsAutocall): number {
  const rng = mulberry32(seed);
  let somme = 0;
  for (let i = 0; i < n; i++) {
    const trajectoire = trajectoireDepuis(rng, s0, params.rPct, volPct, params.dtAnnees, params.nbPeriodes);
    somme += payoffAutocall(trajectoire.slice(1), s0, params).fluxActualise;
  }
  return somme / n;
}

// ───────────────────────── Options à barrière ─────────────────────────

/**
 * Payoff d'un down-and-in put : le put vanille max(K − S_T, 0) SI le minimum
 * de la trajectoire a touché la barrière (min ≤ B), zéro sinon. Toujours
 * ≤ put vanille — c'est pour ça qu'il est moins cher, et c'est LUI que vend
 * implicitement l'acheteur d'autocall. Cas remarquable barrière ≥ strike :
 * payoff > 0 exige S_T < K ≤ B, or min ≤ S_T, donc l'option est toujours
 * activée quand elle paie — le DIP redevient le put vanille.
 */
export function payoffDownAndInPut(sT: number, minTrajectoire: number, strike: number, barriere: number): number {
  return minTrajectoire <= barriere ? Math.max(strike - sT, 0) : 0;
}

/**
 * Prix Monte-Carlo du down-and-in put : trajectoires de nbPas pas, barrière
 * suivie sur le minimum DISCRET des dates simulées (sous-estime le vrai
 * minimum continu, donc le prix — biais classique, réduit en augmentant
 * nbPas). Vérifié : barrière = strike ⇒ prix = put vanille Black-Scholes
 * (à l'erreur MC près), et prix décroissant quand la barrière descend.
 */
export function prixDownAndInPutMC(seed: number, n: number, s0: number, strike: number, barriere: number, rPct: number, volPct: number, annees: number, nbPas: number): number {
  const rng = mulberry32(seed);
  const dt = annees / nbPas;
  let somme = 0;
  for (let i = 0; i < n; i++) {
    const t = trajectoireDepuis(rng, s0, rPct, volPct, dt, nbPas);
    somme += payoffDownAndInPut(t[nbPas], Math.min(...t), strike, barriere);
  }
  return (somme / n) * dfContinu(rPct, annees);
}

// ───────────────────────── Worst-of multi-sous-jacents ─────────────────────────

/**
 * Deux trajectoires lognormales CORRÉLÉES par Cholesky 2D : à chaque pas,
 * z1 ~ N(0,1) et z2 = ρ·z1 + √(1 − ρ²)·ε avec ε indépendant — corr(z1, z2) = ρ.
 * ρ en DÉCIMAL (0,7 = 70 %). ρ = 1 avec mêmes paramètres ⇒ trajectoires
 * identiques (le panier redevient mono sous-jacent) ; la première trajectoire
 * ne dépend jamais de ρ. Retourne deux tableaux de nbPas + 1 niveaux.
 */
export function trajectoiresCorrelees(seed: number, rho: number, s01: number, s02: number, rPct: number, vol1Pct: number, vol2Pct: number, dtAnnees: number, nbPas: number): { t1: number[]; t2: number[] } {
  const rng = mulberry32(seed);
  const t1 = [s01];
  const t2 = [s02];
  for (let i = 1; i <= nbPas; i++) {
    const z1 = normaleStandard(rng);
    const eps = normaleStandard(rng);
    const z2 = rho * z1 + Math.sqrt(1 - rho * rho) * eps;
    t1.push(pasLognormal(t1[i - 1], rPct, vol1Pct, dtAnnees, z1));
    t2.push(pasLognormal(t2[i - 1], rPct, vol2Pct, dtAnnees, z2));
  }
  return { t1, t2 };
}

/**
 * Payoff (en % du nominal) d'un call sur la PIRE performance :
 * 100·max(min(S_T1/S_01, S_T2/S_02) − K %, 0), strike en % du niveau initial
 * (100 = ATM). C'est la brique de participation des produits worst-of : le
 * client ne touche que la performance du moins bon des sous-jacents.
 * Ex. (120, 110, 100, 100, 100) = 10 : le pire fait +10 %.
 */
export function payoffWorstOf(sT1: number, sT2: number, s01: number, s02: number, strikePct: number): number {
  const pire = Math.min(sT1 / s01, sT2 / s02);
  return 100 * Math.max(pire - strikePct / 100, 0);
}

/**
 * Prix Monte-Carlo du call worst-of (en % du nominal) : prix terminaux
 * corrélés en UN pas exact (Cholesky), payoffs actualisés en continu.
 * Propriétés vérifiées par les tests : ρ = 1 et actifs jumeaux ⇒ prix du call
 * vanille Black-Scholes ; le prix DÉCROÎT quand ρ baisse (plus de dispersion
 * ⇒ le pire est pire) — c'est pourquoi le vendeur de worst-of est ACHETEUR de
 * corrélation, et le client vendeur sans le savoir.
 */
export function prixCallWorstOfMC(seed: number, n: number, rho: number, s01: number, s02: number, rPct: number, vol1Pct: number, vol2Pct: number, strikePct: number, annees: number): number {
  const rng = mulberry32(seed);
  let somme = 0;
  for (let i = 0; i < n; i++) {
    const z1 = normaleStandard(rng);
    const eps = normaleStandard(rng);
    const z2 = rho * z1 + Math.sqrt(1 - rho * rho) * eps;
    const sT1 = pasLognormal(s01, rPct, vol1Pct, annees, z1);
    const sT2 = pasLognormal(s02, rPct, vol2Pct, annees, z2);
    somme += payoffWorstOf(sT1, sT2, s01, s02, strikePct);
  }
  return (somme / n) * dfContinu(rPct, annees);
}
