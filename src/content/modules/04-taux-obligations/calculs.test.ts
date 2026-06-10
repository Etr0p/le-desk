import { describe, expect, it } from 'vitest';
import {
  va, prixObligation, durationMacaulay, durationModifiee, convexite,
  prixZeroCoupon, tauxForward, interetMonetaire, couponCouru, tauxEffectif, ytm2Ans,
} from './calculs';

describe('calculs obligataires — valeurs de référence', () => {
  // Obligation 1000 €, coupon 5 %, 3 ans, taux 4 % :
  // 50/1,04 + 50/1,04² + 1050/1,04³ = 48,076923 + 46,227811 + 933,446179 = 1027,750913
  it("prix d'une obligation à coupon annuel", () => {
    expect(prixObligation(1000, 5, 3, 4)).toBeCloseTo(1027.7509, 3);
  });
  it('au pair quand coupon = taux', () => {
    expect(prixObligation(1000, 4, 7, 4)).toBeCloseTo(1000, 6);
  });
  it('décote quand coupon < taux, surcote sinon', () => {
    expect(prixObligation(1000, 2, 5, 4)).toBeLessThan(1000);
    expect(prixObligation(1000, 6, 5, 4)).toBeGreaterThan(1000);
  });
  // (1×48,076923 + 2×46,227811 + 3×933,446179)/1027,750913 = 2,861467
  it('duration de Macaulay', () => {
    expect(durationMacaulay(1000, 5, 3, 4)).toBeCloseTo(2.8615, 3);
  });
  it("duration d'un zéro-coupon = sa maturité", () => {
    expect(durationMacaulay(1000, 0, 5, 3)).toBeCloseTo(5, 9);
  });
  it('duration modifiée = DMac/(1+y)', () => {
    expect(durationModifiee(2.8615, 4)).toBeCloseTo(2.7514, 3);
  });
  it("convexité d'un zéro-coupon = n(n+1)/(1+y)²", () => {
    expect(convexite(1000, 0, 3, 4)).toBeCloseTo((3 * 4) / 1.04 ** 2, 6);
  });
  it("prix d'un zéro-coupon", () => {
    expect(prixZeroCoupon(1000, 3, 5)).toBeCloseTo(862.6088, 3);
  });
  it('taux forward 1 an dans 1 an : (1,03²/1,02) − 1', () => {
    expect(tauxForward(2, 1, 3, 2)).toBeCloseTo(4.0098, 3);
  });
  it('intérêt monétaire Exact/360 : 1 M€ à 3,5 % sur 90 j = 8 750 €', () => {
    expect(interetMonetaire(1_000_000, 3.5, 90)).toBeCloseTo(8750, 6);
  });
  it('coupon couru : 6 %, 1000 €, 73 j (base 365) = 12 €', () => {
    expect(couponCouru(6, 1000, 73, 365)).toBeCloseTo(12, 6);
  });
  it('va actualise correctement', () => {
    expect(va(1050, 4, 3)).toBeCloseTo(933.4462, 3);
  });
  it('taux effectif annuel : 4 % semestriel → 4,04 %', () => {
    expect(tauxEffectif(4, 2)).toBeCloseTo(4.04, 2);
  });
  it('ytm2Ans : cohérence aller-retour avec prixObligation', () => {
    // une obligation 2 ans, coupon 4 %, qui cote 990 € : le YTM retrouvé doit re-pricer à 990
    const y = ytm2Ans(1000, 4, 990);
    expect(prixObligation(1000, 4, 2, y)).toBeCloseTo(990, 4);
    // et un YTM connu : prix au pair → YTM = coupon
    expect(ytm2Ans(1000, 3, 1000)).toBeCloseTo(3, 6);
  });
});
