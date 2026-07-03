import { describe, expect, it } from 'vitest';
import {
  spreadCreditPb,
  perteAttenduePct,
  spreadTheoriquePb,
  pdImplicitePct,
  probaSurvieCumuleePct,
  probaDefautCumuleePct,
  prixObligationRisquee,
  variationPrixSpreadPct,
  rendementNetDefautsPct,
  primeCdsAnnuelleEur,
  paiementDefautCdsMillions,
  baseCdsPb,
  perteTranchePct,
} from './calculs';

// Valeurs de référence VÉRIFIÉES À LA MAIN (aucune ne sort de l'implémentation) :
// — Spread : (5,5 − 3,5)·100 = 200 pb.
// — EL : 2 × (1 − 0,40) = 1,2 % ⇒ spread théorique 120 pb ; PD implicite
//   (120 pb, R 40 %) = 1,2/0,6 = 2 % ; (300 pb, R 40 %) = 3/0,6 = 5 %.
// — Survie : 0,98^5 = 0,90392080 ⇒ 90,392080 % ; défaut cumulé 9,607920 %
//   (≠ 10 % additif) ; 1 − 0,95^10 = 40,126306 % (≠ 50 %).
// — Prix : coupon 5 à y = 3 + 2 = 5 % ⇒ 100 exactement (coupon = rendement).
//   Coupon 4, y = 5 %, 5 ans : 4×(1−1,05⁻⁵)/0,05 + 100/1,05⁵ =
//   4×4,329477 + 78,352617 = 95,670523 ; sans spread (y = 3 %) : 104,579707 ;
//   écart 8,909184 points.
// — Spread duration : −4,5×50/100 = −2,25 % ; −7×300/100 = −21 %.
// — Rendement net : 7 − 3×0,6 = 5,2 %.
// — CDS : 10 M à 200 pb = 10 000 000 × 0,02 = 200 000 €/an ; paiement défaut
//   10 × 0,6 = 6 M ; base 180 − 200 = −20 pb.
// — Tranche 3-6 % : L = 5 ⇒ (5−3)/(6−3) = 66,666667 % ; L = 2 ⇒ 0 ; L = 8 ⇒ 100.
//   Equity 0-3 % : L = 4 ⇒ 100 ; L = 1,5 ⇒ 50.

describe('spread de crédit et perte attendue', () => {
  it('spreadCreditPb(5,5, 3,5) = 200 pb — l’écart se lit en points de base', () => {
    expect(spreadCreditPb(5.5, 3.5)).toBeCloseTo(200, 10);
  });

  it('un émetteur qui rend moins que le sans-risque a un spread négatif', () => {
    expect(spreadCreditPb(3.2, 3.5)).toBeCloseTo(-30, 10);
  });

  it('perteAttenduePct(2, 40) = 1,2 % — EL = PD × LGD', () => {
    expect(perteAttenduePct(2, 40)).toBeCloseTo(1.2, 10);
  });

  it('recouvrement 100 % ⇒ perte attendue nulle quelle que soit la PD', () => {
    expect(perteAttenduePct(5, 100)).toBeCloseTo(0, 10);
  });

  it('spreadTheoriquePb(2, 40) = 120 pb — l’EL convertie en points de base', () => {
    expect(spreadTheoriquePb(2, 40)).toBeCloseTo(120, 10);
  });

  it('pdImplicitePct : (120 pb, R 40) = 2 % ; (300 pb, R 40) = 5 %', () => {
    expect(pdImplicitePct(120, 40)).toBeCloseTo(2, 10);
    expect(pdImplicitePct(300, 40)).toBeCloseTo(5, 10);
  });

  it('cohérence aller-retour : PD → spread théorique → PD implicite rend la PD initiale', () => {
    for (const pd of [0.5, 2, 5, 12]) {
      expect(pdImplicitePct(spreadTheoriquePb(pd, 40), 40)).toBeCloseTo(pd, 10);
    }
  });
});

describe('survie et défaut cumulés (composition discrète)', () => {
  it('probaSurvieCumuleePct(2, 5) = 90,392080 % — 0,98⁵', () => {
    expect(probaSurvieCumuleePct(2, 5)).toBeCloseTo(90.392080, 5);
  });

  it('probaDefautCumuleePct(2, 5) = 9,607920 % — et PAS 10 % (piège additif)', () => {
    expect(probaDefautCumuleePct(2, 5)).toBeCloseTo(9.607920, 5);
    expect(probaDefautCumuleePct(2, 5)).toBeLessThan(10);
  });

  it('probaDefautCumuleePct(5, 10) = 40,126306 % — loin des 50 % naïfs', () => {
    expect(probaDefautCumuleePct(5, 10)).toBeCloseTo(40.126306, 5);
  });

  it('survie + défaut = 100 % à tout horizon', () => {
    for (const n of [1, 3, 7, 30]) {
      expect(probaSurvieCumuleePct(3, n) + probaDefautCumuleePct(3, n)).toBeCloseTo(100, 10);
    }
  });

  it('à 1 an, le cumul EST la PD annuelle', () => {
    expect(probaDefautCumuleePct(4, 1)).toBeCloseTo(4, 10);
  });
});

describe('pricing de l’obligation risquée', () => {
  it('coupon 5 %, r 3 %, spread 200 pb, 5 ans ⇒ 100 exactement (coupon = rendement ⇒ pair)', () => {
    expect(prixObligationRisquee(5, 3, 200, 5)).toBeCloseTo(100, 8);
  });

  it('coupon 4 %, r 3 %, spread 200 pb, 5 ans ⇒ 95,670523 (coupon sous le rendement ⇒ décote)', () => {
    expect(prixObligationRisquee(4, 3, 200, 5)).toBeCloseTo(95.670523, 5);
  });

  it('le même titre sans spread vaut 104,579707 — le spread coûte 8,909184 points', () => {
    expect(prixObligationRisquee(4, 3, 0, 5)).toBeCloseTo(104.579707, 5);
    expect(prixObligationRisquee(4, 3, 0, 5) - prixObligationRisquee(4, 3, 200, 5)).toBeCloseTo(8.909184, 5);
  });

  it('un spread plus large fait toujours baisser le prix', () => {
    expect(prixObligationRisquee(4, 3, 500, 5)).toBeLessThan(prixObligationRisquee(4, 3, 200, 5));
  });

  it('variationPrixSpreadPct : (4,5, +50 pb) = −2,25 % ; (7, +300 pb) = −21 %', () => {
    expect(variationPrixSpreadPct(4.5, 50)).toBeCloseTo(-2.25, 10);
    expect(variationPrixSpreadPct(7, 300)).toBeCloseTo(-21, 10);
  });

  it('un resserrement de spread est un GAIN : (4,5, −50 pb) = +2,25 %', () => {
    expect(variationPrixSpreadPct(4.5, -50)).toBeCloseTo(2.25, 10);
  });

  it('rendementNetDefautsPct(7, 3, 40) = 5,2 % — le brut ment, le net compare', () => {
    expect(rendementNetDefautsPct(7, 3, 40)).toBeCloseTo(5.2, 10);
  });

  it('un HY à 7 % avec PD 5 % et R 40 rend 4 % net — battu par une OAT à 4,5 %', () => {
    expect(rendementNetDefautsPct(7, 5, 40)).toBeCloseTo(4, 10);
  });
});

describe('CDS', () => {
  it('primeCdsAnnuelleEur(10, 200) = 200 000 € par an', () => {
    expect(primeCdsAnnuelleEur(10, 200)).toBeCloseTo(200000, 6);
  });

  it('100 pb sur 10 M = 100 000 € — l’ordre de grandeur du desk', () => {
    expect(primeCdsAnnuelleEur(10, 100)).toBeCloseTo(100000, 6);
  });

  it('paiementDefautCdsMillions(10, 40) = 6 M — le vendeur paie la PERTE, pas le notionnel', () => {
    expect(paiementDefautCdsMillions(10, 40)).toBeCloseTo(6, 10);
  });

  it('Lehman : recouvrement d’enchère 8,625 % ⇒ les vendeurs paient 91,375 % du notionnel', () => {
    expect(paiementDefautCdsMillions(100, 8.625)).toBeCloseTo(91.375, 10);
  });

  it('baseCdsPb(180, 200) = −20 pb — base négative, le terrain du negative basis trade', () => {
    expect(baseCdsPb(180, 200)).toBeCloseTo(-20, 10);
  });
});

describe('tranches de titrisation', () => {
  it('mezzanine 3-6 % : 5 % de pertes du pool ⇒ 66,666667 % de la tranche détruite', () => {
    expect(perteTranchePct(5, 3, 6)).toBeCloseTo(66.666667, 5);
  });

  it('mezzanine 3-6 % : intacte à 2 % de pertes, rasée à 8 %', () => {
    expect(perteTranchePct(2, 3, 6)).toBeCloseTo(0, 10);
    expect(perteTranchePct(8, 3, 6)).toBeCloseTo(100, 10);
  });

  it('equity 0-3 % : moitié détruite à 1,5 % de pertes, rasée dès 3 %', () => {
    expect(perteTranchePct(1.5, 0, 3)).toBeCloseTo(50, 10);
    expect(perteTranchePct(4, 0, 3)).toBeCloseTo(100, 10);
  });

  it('senior 6-100 % : encore intacte à 6 % de pertes, entamée au-delà', () => {
    expect(perteTranchePct(6, 6, 100)).toBeCloseTo(0, 10);
    expect(perteTranchePct(12, 6, 100)).toBeCloseTo((6 / 94) * 100, 5);
  });

  it('la perte de tranche est bornée à [0, 100] quel que soit le scénario', () => {
    expect(perteTranchePct(-2, 3, 6)).toBe(0);
    expect(perteTranchePct(150, 3, 6)).toBe(100);
  });
});
