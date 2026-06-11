/**
 * Bibliothèque de référence du module Méthodes quantitatives & probabilités.
 * Conventions : taux et rendements en %, probabilités en décimal (0–1),
 * variances de rendements en %². Aucun arrondi interne (les appelants arrondissent).
 * Toutes les fonctions sont verrouillées par des valeurs de référence vérifiées à la main
 * dans calculs.test.ts — les générateurs d'exercices DOIVENT composer ces fonctions,
 * jamais recopier une formule.
 */

// ───────────────────────── Valeur temps de l'argent ─────────────────────────

/** VA d'une annuité constante versée en fin de période, pendant n périodes. */
export function vaAnnuite(flux: number, tauxPct: number, n: number): number {
  const r = 1 + tauxPct / 100;
  let p = 0;
  for (let t = 1; t <= n; t++) p += flux / r ** t;
  return p;
}

/** VF en t = n d'une annuité constante versée en fin de période. */
export function vfAnnuite(flux: number, tauxPct: number, n: number): number {
  const r = 1 + tauxPct / 100;
  let p = 0;
  for (let t = 1; t <= n; t++) p += flux * r ** (n - t);
  return p;
}

/** VA d'une perpétuité (premier flux en t = 1) : flux / taux. */
export function perpetuite(flux: number, tauxPct: number): number {
  return flux / (tauxPct / 100);
}

/** VAN : investissement décaissé en t = 0, flux reçus en t = 1..n. */
export function van(investissement: number, flux: number[], tauxPct: number): number {
  const r = 1 + tauxPct / 100;
  let v = -investissement;
  for (let t = 1; t <= flux.length; t++) v += flux[t - 1] / r ** t;
  return v;
}

// ───────────────────────── Statistiques descriptives ─────────────────────────

export function moyenneArithmetique(xs: number[]): number {
  return xs.reduce((s, x) => s + x, 0) / xs.length;
}

/** Moyenne géométrique de rendements en % : (Π(1 + rᵢ))^(1/n) − 1, en %. */
export function moyenneGeometrique(rendementsPct: number[]): number {
  const produit = rendementsPct.reduce((p, r) => p * (1 + r / 100), 1);
  return (produit ** (1 / rendementsPct.length) - 1) * 100;
}

/** Variance d'échantillon (dénominateur n − 1). */
export function varianceEchantillon(xs: number[]): number {
  const m = moyenneArithmetique(xs);
  return xs.reduce((s, x) => s + (x - m) ** 2, 0) / (xs.length - 1);
}

export function ecartTypeEchantillon(xs: number[]): number {
  return Math.sqrt(varianceEchantillon(xs));
}

/** Annualisation d'une volatilité périodique : × √(périodes par an). */
export function volatiliteAnnualisee(volPeriodiquePct: number, periodesParAn: number): number {
  return volPeriodiquePct * Math.sqrt(periodesParAn);
}

/** Covariance d'échantillon (dénominateur n − 1). */
export function covarianceEchantillon(xs: number[], ys: number[]): number {
  const mx = moyenneArithmetique(xs);
  const my = moyenneArithmetique(ys);
  let s = 0;
  for (let i = 0; i < xs.length; i++) s += (xs[i] - mx) * (ys[i] - my);
  return s / (xs.length - 1);
}

/** Corrélation de Pearson : cov / (σx·σy), dans [−1, 1]. */
export function correlation(xs: number[], ys: number[]): number {
  return covarianceEchantillon(xs, ys) / (ecartTypeEchantillon(xs) * ecartTypeEchantillon(ys));
}

// ───────────────────────── Probabilités ─────────────────────────

/** Coefficient binomial C(n, k) par produit multiplicatif (entier exact). */
export function combinaisons(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  const kk = Math.min(k, n - k);
  let c = 1;
  for (let i = 1; i <= kk; i++) c = (c * (n - kk + i)) / i;
  return Math.round(c); // la valeur vraie est entière : on neutralise l'erreur flottante
}

/** P(X = k) pour X ~ B(n, p), p en décimal. */
export function probaBinomiale(n: number, k: number, p: number): number {
  return combinaisons(n, k) * p ** k * (1 - p) ** (n - k);
}

/** E[X] = n·p pour X ~ B(n, p). */
export function esperanceBinomiale(n: number, p: number): number {
  return n * p;
}

/** Théorème de Bayes : P(A|B) = P(B|A)·P(A) / (P(B|A)·P(A) + P(B|¬A)·P(¬A)). */
export function bayes(pA: number, pBsachantA: number, pBsachantNonA: number): number {
  const num = pBsachantA * pA;
  return num / (num + pBsachantNonA * (1 - pA));
}

// ───────────────────────── Loi normale et inférence ─────────────────────────

/**
 * Φ(z), CDF de la loi normale centrée réduite.
 * Approximation de Zelen & Severo (Abramowitz-Stegun 26.2.17), |erreur| < 7,5e-8.
 * La symétrie Φ(−z) = 1 − Φ(z) est exacte par construction.
 */
export function normaleCdf(z: number): number {
  if (z < 0) return 1 - normaleCdf(-z);
  const t = 1 / (1 + 0.2316419 * z);
  const poly = t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  const densite = Math.exp((-z * z) / 2) / Math.sqrt(2 * Math.PI);
  return 1 - densite * poly;
}

/** z = (x − μ)/σ. */
export function zScore(x: number, mu: number, sigma: number): number {
  return (x - mu) / sigma;
}

/** Intervalle de confiance : moyenne ± z·σ/√n (z = 1,96 pour 95 % par défaut). */
export function intervalleConfiance(moyenne: number, ecartType: number, n: number, z = 1.96): { basse: number; haute: number } {
  const marge = (z * ecartType) / Math.sqrt(n);
  return { basse: moyenne - marge, haute: moyenne + marge };
}

/** Statistique t : (x̄ − μ₀)/(s/√n). */
export function statT(moyenneEch: number, mu0: number, ecartType: number, n: number): number {
  return (moyenneEch - mu0) / (ecartType / Math.sqrt(n));
}

// ───────────────────────── Régression linéaire simple ─────────────────────────

/** Pente MCO : cov(x, y) / var(x). */
export function penteRegression(xs: number[], ys: number[]): number {
  return covarianceEchantillon(xs, ys) / varianceEchantillon(xs);
}

/** Ordonnée à l'origine MCO : ȳ − pente·x̄. */
export function ordonneeRegression(xs: number[], ys: number[]): number {
  return moyenneArithmetique(ys) - penteRegression(xs, ys) * moyenneArithmetique(xs);
}

/** R² de la régression simple = corrélation². */
export function r2Regression(xs: number[], ys: number[]): number {
  return correlation(xs, ys) ** 2;
}

// ───────────────────────── Portefeuille 2 actifs (pont vers le module 12) ─────────────────────────

/** Rendement espéré d'un portefeuille 2 actifs : w1·r1 + (1 − w1)·r2, en %. */
export function esperancePortefeuille2(w1: number, r1Pct: number, r2Pct: number): number {
  return w1 * r1Pct + (1 - w1) * r2Pct;
}

/** Variance d'un portefeuille 2 actifs, en %² : w1²σ1² + w2²σ2² + 2·w1·w2·ρ·σ1·σ2. */
export function variancePortefeuille2(w1: number, sigma1Pct: number, sigma2Pct: number, rho: number): number {
  const w2 = 1 - w1;
  return w1 ** 2 * sigma1Pct ** 2 + w2 ** 2 * sigma2Pct ** 2 + 2 * w1 * w2 * rho * sigma1Pct * sigma2Pct;
}
