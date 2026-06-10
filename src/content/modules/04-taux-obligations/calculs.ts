/**
 * Bibliothèque de référence du module Taux & obligations.
 * Taux en %, durées en années, aucun arrondi interne (les appelants arrondissent).
 * Toutes les fonctions sont verrouillées par des valeurs de référence vérifiées à la main
 * dans calculs.test.ts — les générateurs d'exercices DOIVENT composer ces fonctions,
 * jamais recopier une formule.
 */

export function va(flux: number, tauxPct: number, t: number): number {
  return flux / (1 + tauxPct / 100) ** t;
}

export function prixObligation(nominal: number, couponPct: number, n: number, tauxPct: number): number {
  const c = (nominal * couponPct) / 100;
  let p = 0;
  for (let t = 1; t <= n; t++) p += va(t < n ? c : c + nominal, tauxPct, t);
  return p;
}

export function durationMacaulay(nominal: number, couponPct: number, n: number, tauxPct: number): number {
  const c = (nominal * couponPct) / 100;
  const p = prixObligation(nominal, couponPct, n, tauxPct);
  let s = 0;
  for (let t = 1; t <= n; t++) s += t * va(t < n ? c : c + nominal, tauxPct, t);
  return s / p;
}

export function durationModifiee(dMac: number, tauxPct: number): number {
  return dMac / (1 + tauxPct / 100);
}

export function convexite(nominal: number, couponPct: number, n: number, tauxPct: number): number {
  const c = (nominal * couponPct) / 100;
  const y = tauxPct / 100;
  const p = prixObligation(nominal, couponPct, n, tauxPct);
  let s = 0;
  for (let t = 1; t <= n; t++) {
    const flux = t < n ? c : c + nominal;
    s += (t * (t + 1) * flux) / (1 + y) ** (t + 2);
  }
  return s / p;
}

export function prixZeroCoupon(nominal: number, tauxPct: number, n: number): number {
  return va(nominal, tauxPct, n);
}

export function tauxForward(z1Pct: number, t1: number, z2Pct: number, t2: number): number {
  const f = ((1 + z2Pct / 100) ** t2 / (1 + z1Pct / 100) ** t1) ** (1 / (t2 - t1)) - 1;
  return f * 100;
}

export function interetMonetaire(nominal: number, tauxPct: number, jours: number, base = 360): number {
  return (nominal * (tauxPct / 100) * jours) / base;
}

// Base par défaut Act/365. Pour la convention Exact/Exact des OAT, passer baseJoursAn = 365 ou 366 selon la durée réelle de la période de coupon (année bissextile).
export function couponCouru(couponPct: number, nominal: number, joursDepuisCoupon: number, baseJoursAn = 365): number {
  return ((nominal * couponPct) / 100) * (joursDepuisCoupon / baseJoursAn);
}

export function tauxEffectif(tauxNominalPct: number, compositionsParAn: number): number {
  return ((1 + tauxNominalPct / 100 / compositionsParAn) ** compositionsParAn - 1) * 100;
}

// YTM exact d'une obligation 2 ans à coupon annuel : résolution de la quadratique en x = 1/(1+y)
// P = c·x + (c+N)·x²  →  x = (−c + √(c² + 4(c+N)P)) / (2(c+N)),  y = 1/x − 1
export function ytm2Ans(nominal: number, couponPct: number, prix: number): number {
  const c = (nominal * couponPct) / 100;
  const a = c + nominal;
  const x = (-c + Math.sqrt(c * c + 4 * a * prix)) / (2 * a);
  return (1 / x - 1) * 100;
}
