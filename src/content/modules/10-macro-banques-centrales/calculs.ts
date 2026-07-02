/**
 * Bibliothèque de référence du module Macro & banques centrales.
 *
 * CONVENTIONS (valables pour tout le fichier) :
 * — Taux, inflations et écarts de production en % (5 = 5 %) ; durées en années ;
 *   aucun arrondi interne (les appelants arrondissent).
 * — Les pas de politique monétaire s'expriment en POINTS DE BASE (25 pb =
 *   0,25 %) — la langue des banquiers centraux ; les fonctions qui en reçoivent
 *   (variationPrixObligationDuration, tauxTerminalAnticipe) convertissent
 *   elles-mêmes et RENDENT du % : 100 pb en entrée, 1 % en sortie.
 * — Composition DISCRÈTE annuelle (1 + x)^n partout, alignée sur le m4 (va,
 *   prixObligation) : c'est la convention des indices de prix et des taux
 *   directeurs — PAS l'actualisation continue du m8/m9.
 * — La surprise d'indicateur est SANS UNITÉ (en écarts-types, « en sigmas ») ;
 *   le ratio de sacrifice est en points de production par point de désinflation.
 * — L'actualisation vient du m4 (va), JAMAIS recopiée : l'inflation actualise
 *   le pouvoir d'achat exactement comme un taux actualise un flux.
 *
 * Toutes les fonctions sont verrouillées dans calculs.test.ts par des valeurs
 * de référence vérifiées à la main : Fisher (5, 2) = 2,941176 ; Taylor
 * (2, 4, 2, −1) = 6,5 ; érosion (100, 5 %, 10 ans) = 61,391325 ; annualisation
 * de 0,5 %/mois = 6,167781 % ; et par cohérence croisée avec le m4 (duration,
 * repricing exact). Les générateurs d'exercices DEVRONT composer ces fonctions,
 * jamais recopier une formule.
 */

import { va } from '../04-taux-obligations/calculs';

// ───────────────────────── Fisher : nominal, réel, inflation ─────────────────────────

/**
 * Taux réel EXACT par l'équation de Fisher : ((1 + i)/(1 + π) − 1)·100.
 * C'est ce que rapporte vraiment un placement une fois l'inflation déduite —
 * la variable qui pilote les décisions d'épargne et le « restrictif ou pas »
 * d'une politique monétaire. Peut être négatif (répression financière) quand
 * π > i. Ex. (5, 2) = 2,941176 ; (0, 2) = −1,960784.
 */
export function tauxReelFisher(tauxNominalPct: number, inflationPct: number): number {
  return ((1 + tauxNominalPct / 100) / (1 + inflationPct / 100) - 1) * 100;
}

/**
 * Taux réel APPROCHÉ, r ≈ i − π : l'arithmétique de tête des salles de marché.
 * L'approximation néglige le terme croisé i·π ; elle SURESTIME donc le réel,
 * d'autant plus que les taux sont élevés : (5, 2) donne 3 contre 2,941176
 * exact (6 pb d'écart), mais (10, 8) donne 2 contre 1,851852 (15 pb).
 * Réflexe d'entretien : donner l'approximation PUIS signaler l'écart.
 */
export function tauxReelApproche(tauxNominalPct: number, inflationPct: number): number {
  return tauxNominalPct - inflationPct;
}

/**
 * Fisher inversé : le taux nominal requis pour servir un réel visé sous une
 * inflation donnée, ((1 + r)(1 + π) − 1)·100. Ex. (3, 2) = 5,06 — et
 * l'aller-retour par tauxReelFisher retombe exactement sur 3. Cas limite
 * parlant : viser un réel NUL exige un nominal égal à l'inflation.
 */
export function tauxNominalRequis(tauxReelVisePct: number, inflationPct: number): number {
  return ((1 + tauxReelVisePct / 100) * (1 + inflationPct / 100) - 1) * 100;
}

// ───────────────────────── Règle de Taylor ─────────────────────────

/**
 * Règle de Taylor (1993) : i = r* + π + a·(π − π*) + b·(gap), tout en %.
 * Le taux directeur « prescrit » : taux neutre réel r*, plus l'inflation
 * courante, plus une pénalité sur l'écart d'inflation à la cible, plus une
 * correction d'écart de production (négatif en récession). Coefficients 0,5
 * par défaut (Taylor 1993) ; passer coefInflation = 1,5 pour la variante 1999.
 * Le PRINCIPE de Taylor : a > 0 garantit qu'un point d'inflation en plus
 * relève le taux de PLUS d'un point — le réel monte, la politique mord.
 * La règle peut prescrire un taux négatif (borne zéro) : c'est la motivation
 * historique du QE. Ex. (2, 4, 2, −1) = 2 + 4 + 0,5·2 − 0,5·1 = 6,5.
 */
export function regleDeTaylor(
  tauxNeutrePct: number,
  inflationPct: number,
  cibleInflationPct: number,
  ecartProductionPct: number,
  coefInflation = 0.5,
  coefProduction = 0.5,
): number {
  return tauxNeutrePct + inflationPct + coefInflation * (inflationPct - cibleInflationPct) + coefProduction * ecartProductionPct;
}

// ───────────────────────── Le coût de l'inflation ─────────────────────────

/**
 * Pouvoir d'achat résiduel d'un montant après n années d'inflation composée :
 * montant/(1 + π)^n — les intérêts composés joués CONTRE l'épargnant.
 * Techniquement une simple actualisation (va du m4) au « taux » d'inflation :
 * même mécanique, autre lecture. Ex. (100, 5, 10) = 61,391325 — à 5 % par an,
 * dix ans suffisent à ronger 38,6 % du billet ; à la cible de 2 %, il en
 * reste 82,03.
 */
export function interetsComposesInflation(montant: number, inflationPct: number, annees: number): number {
  return va(montant, inflationPct, annees);
}

/**
 * Chaînage d'un indice des prix (type CPI) : niveau·Π(1 + π_t), une inflation
 * par année. C'est ainsi que se construisent les indices officiels — et que se
 * lit le piège de l'asymétrie : +10 % puis −10 % ne reviennent pas à 100 mais
 * à 99. Tableau vide ⇒ niveau inchangé. Ex. (100, [2, 3, 10]) = 115,566.
 */
export function indiceDesPrix(niveauInitial: number, inflationsAnnuellesPct: number[]): number {
  return inflationsAnnuellesPct.reduce((niveau, pi) => niveau * (1 + pi / 100), niveauInitial);
}

/**
 * Annualisation d'un chiffre d'inflation MENSUEL : ((1 + m)^12 − 1)·100.
 * LE piège des publications CPI : 0,5 % sur un mois n'est pas « 6 % en rythme
 * annuel » mais 6,167781 % — la composition mord toujours, et l'écart au
 * naïf 12·m grossit avec le chiffre mensuel (1 %/mois = 12,68 %, pas 12 %).
 * Fonctionne aussi en déflation (m < 0).
 */
export function inflationAnnualiseeDepuisMensuelle(inflationMensuellePct: number): number {
  return ((1 + inflationMensuellePct / 100) ** 12 - 1) * 100;
}

// ───────────────────────── Lecture des indicateurs ─────────────────────────

/**
 * Surprise standardisée d'un indicateur : (publié − consensus)/σ, SANS UNITÉ.
 * C'est la lecture « en sigmas » des NFP ou du CPI : seul l'écart AU CONSENSUS
 * bouge les marchés (le consensus est déjà dans les prix), et le même écart
 * brut pèse différemment selon la volatilité historique des surprises σ.
 * Ex. NFP consensus 180k, publié 260k, σ 40k ⇒ +2σ : grosse surprise haussière,
 * mauvaise pour les obligations. Publié = consensus ⇒ 0 : non-événement.
 */
export function surpriseIndicateur(consensus: number, publie: number, ecartTypeSurprises: number): number {
  return (publie - consensus) / ecartTypeSurprises;
}

/**
 * Taux terminal anticipé : taux actuel + nbHausses·pas, PAS en points de base
 * (25 ou 50 pb, la granularité des comités), résultat en %. L'arithmétique
 * des dot plots et des futures Fed funds : depuis 2,50 %, quatre hausses de
 * 50 pb mènent à 4,50 %. Un pas NÉGATIF décrit un cycle de baisse.
 */
export function tauxTerminalAnticipe(tauxActuelPct: number, nbHausses: number, pasPbs: number): number {
  return tauxActuelPct + (nbHausses * pasPbs) / 100;
}

// ───────────────────────── Transmission aux classes d'actifs ─────────────────────────

/**
 * Variation de prix d'une obligation par la duration : ΔP/P ≈ −D_mod·Δy.
 * Δy en POINTS DE BASE, réponse en % : (7, 50) = −3,5 % — le canal de
 * transmission le plus mécanique de la politique monétaire. La duration
 * modifiée vient du m4 (durationModifiee) ; l'approximation est LINÉAIRE et
 * pessimiste pour le porteur : la convexité (m4) rend la vraie perte plus
 * petite et le vrai gain plus grand — vérifié contre le repricing exact du m4
 * dans les tests. Duration nulle (monétaire) ⇒ insensible aux taux.
 */
export function variationPrixObligationDuration(durationModifiee: number, deltaTauxPbs: number): number {
  return -durationModifiee * (deltaTauxPbs / 100);
}

/**
 * Ratio de sacrifice : points de production cumulés perdus PAR point de
 * désinflation, |gap cumulé|/désinflation. Le concept Volcker : ramener
 * l'inflation de 13 % à 4 % a coûté plusieurs points de PIB de récession.
 * Le gap cumulé s'accepte en négatif (−6, la convention des gaps) comme en
 * perte absolue (6) — même ratio. Un ratio nul, c'est la désinflation
 * « immaculée » : l'inflation retombe sans récession. Ex. (3, −6) = 2.
 */
export function ratioSacrifice(desinflationPct: number, cumulEcartProductionPct: number): number {
  return Math.abs(cumulEcartProductionPct) / desinflationPct;
}
