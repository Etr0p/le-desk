import { describe, expect, it } from 'vitest';
import { prixObligation, tauxForward } from './calculs';
import { problemes } from './problems';

const M4 = '04-taux-obligations';
const SEEDS = [1, 2, 3];

// Lot 1 du plan B8 : id → niveau de difficulté attendu.
const NIVEAUX_ATTENDUS: Record<string, number> = {
  'm4-pb-analyse-ligne': 2,
  'm4-pb-coupon-couru-transaction': 2,
  'm4-pb-comparaison-deux-obligations': 2,
  'm4-pb-zc-vs-coupon': 2,
  'm4-pb-nouvelle-emission': 2,
  'm4-pb-bootstrap-courbe': 3,
  'm4-pb-frn-vs-fixe': 3,
  'm4-pb-spread-souverain': 2,
};

function moule(id: string) {
  const p = problemes.find(x => x.id === id);
  if (!p) throw new Error(`moule manquant : ${id}`);
  return p;
}
function reponses(id: string, seed: number, scenario = 0): number[] {
  return moule(id).generate(seed, scenario).sousQuestions.map(q => q.reponse);
}

describe('module 4 — moules de problèmes (lot 1)', () => {
  it('expose les 8 moules du lot 1, niveaux conformes au plan, ids uniques', () => {
    expect(problemes.length).toBeGreaterThanOrEqual(8);
    for (const [id, niveau] of Object.entries(NIVEAUX_ATTENDUS)) {
      const p = problemes.find(x => x.id === id);
      expect(p, `moule absent : ${id}`).toBeDefined();
      expect(p!.difficulte, `niveau de ${id}`).toBe(niveau);
      expect(p!.moduleId).toBe(M4);
      expect(p!.typeDeCas.length).toBeGreaterThan(3);
    }
    const ids = problemes.map(p => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  for (const p of problemes) {
    describe(p.id, () => {
      it('a 2 à 4 scénarios, traduits en anglais (même longueur)', () => {
        expect(p.scenarios.length).toBeGreaterThanOrEqual(2);
        expect(p.scenarios.length).toBeLessThanOrEqual(4);
        expect(p.scenariosEn, `scenariosEn manquant sur ${p.id}`).toBeDefined();
        expect(p.scenariosEn).toHaveLength(p.scenarios.length);
        p.scenariosEn!.forEach((libelle, i) => {
          expect(libelle.length).toBeGreaterThan(3);
          expect(libelle).not.toBe(p.scenarios[i]); // vraie traduction, pas une copie
        });
      });

      p.scenarios.forEach((libelle, s) => {
        describe(`scénario ${s} — ${libelle}`, () => {
          it('génère 3 à 6 sous-questions valides pour les seeds 1, 2, 3', () => {
            for (const seed of SEEDS) {
              const pb = p.generate(seed, s);
              expect(pb.contexte).not.toMatch(/undefined|NaN/);
              expect(pb.contexte.length).toBeGreaterThan(80); // un vrai décor, pas une ligne
              expect(pb.sousQuestions.length).toBeGreaterThanOrEqual(3);
              expect(pb.sousQuestions.length).toBeLessThanOrEqual(6);
              for (const sq of pb.sousQuestions) {
                expect(sq.intitule.length).toBeGreaterThan(2);
                expect(sq.enonce).not.toMatch(/undefined|NaN/);
                expect(Number.isFinite(sq.reponse)).toBe(true);
                expect(sq.tolerance).toBeGreaterThan(0);
                expect(sq.tolerance).toBeLessThanOrEqual(0.01);
                expect(sq.etapes.length).toBeGreaterThanOrEqual(1);
                for (const e of sq.etapes) {
                  expect(e.titre.length).toBeGreaterThan(0);
                  expect(e.contenu).not.toMatch(/undefined|NaN/);
                }
                for (const piege of sq.pieges ?? []) expect(piege).not.toMatch(/undefined|NaN/);
              }
            }
          });

          it('est déterministe à seed et scénario fixés (dans les deux langues)', () => {
            expect(p.generate(5, s)).toEqual(p.generate(5, s));
            expect(p.generate(5, s, 'en')).toEqual(p.generate(5, s, 'en'));
          });

          it('varie entre les seeds', () => {
            const signatures = SEEDS.map(seed =>
              p.generate(seed, s).sousQuestions.map(q => q.reponse).join('|'),
            );
            expect(new Set(signatures).size).toBeGreaterThanOrEqual(2);
          });

          it('bilingue : mêmes nombres en anglais, contexte réellement traduit', () => {
            const fr = p.generate(7, s, 'fr');
            const en = p.generate(7, s, 'en');
            expect(en.sousQuestions).toHaveLength(fr.sousQuestions.length);
            fr.sousQuestions.forEach((sq, i) => {
              expect(en.sousQuestions[i].reponse).toBe(sq.reponse);
              expect(en.sousQuestions[i].tolerance).toBe(sq.tolerance);
              expect(en.sousQuestions[i].etapes.length).toBe(sq.etapes.length);
            });
            expect(en.contexte).not.toBe(fr.contexte);
            expect(en.contexte).not.toMatch(/undefined|NaN/);
          });
        });
      });
    });
  }

  describe('cohérence des enchaînements (scénario 0, seeds 1-3)', () => {
    it('analyse-ligne : d) retrouve ΔP ≈ −D_mod c) × 50 pb × prix a)', () => {
      for (const seed of SEEDS) {
        const [prix, , dMod, dP] = reponses('m4-pb-analyse-ligne', seed);
        const attendu = -dMod * 0.005 * prix;
        expect(dP).toBeLessThan(0);
        expect(Math.abs((dP - attendu) / attendu)).toBeLessThan(0.01);
      }
    });

    it('coupon-couru-transaction : c) = quantité entière × prix sale b), et b) − a) retombe sur un prix propre plausible', () => {
      for (const seed of SEEDS) {
        const [couru, sale, montant] = reponses('m4-pb-coupon-couru-transaction', seed);
        expect(sale).toBeGreaterThan(couru);
        const q = montant / sale;
        expect(Math.abs(q - Math.round(q))).toBeLessThan(0.01);
        expect(Math.round(q)).toBeGreaterThanOrEqual(10);
        const propre = sale - couru; // 92-108 % d'un nominal de 1 000 €
        expect(propre).toBeGreaterThan(900);
        expect(propre).toBeLessThan(1100);
      }
    });

    it('comparaison-deux-obligations : B plus sensible que A, gain e) cohérent avec d) et b)', () => {
      for (const seed of SEEDS) {
        const [, prixB, dA, dB, gain] = reponses('m4-pb-comparaison-deux-obligations', seed);
        expect(dB).toBeGreaterThan(dA);
        expect(gain).toBeGreaterThan(0);
        const plafond = dB * 0.005 * prixB; // Macaulay non convertie = borne haute
        expect(gain).toBeLessThan(plafond * 1.001); // D_mod < D_Mac
        expect(gain).toBeGreaterThan(plafond / 1.07); // y ≤ 5 % ⇒ division par au plus ~1,05
      }
    });

    it('zc-vs-coupon : pertes d) et e) négatives, cohérentes avec c), le ZC perd plus en %', () => {
      for (const seed of SEEDS) {
        const [pZC, pC, dC, dPZC, dPC] = reponses('m4-pb-zc-vs-coupon', seed);
        expect(dPZC).toBeLessThan(0);
        expect(dPC).toBeLessThan(0);
        const plafond = dC * 0.01 * pC;
        expect(Math.abs(dPC)).toBeLessThan(plafond * 1.001);
        expect(Math.abs(dPC)).toBeGreaterThan(plafond / 1.07);
        expect(Math.abs(dPZC) / pZC).toBeGreaterThan(Math.abs(dPC) / pC);
      }
    });

    it("nouvelle-emission : c) se recalcule depuis le coupon b), la maturité du contexte et la prime de l'énoncé", () => {
      for (const seed of SEEDS) {
        const pb = moule('m4-pb-nouvelle-emission').generate(seed, 0);
        const [pInitial, couponPair, pPrime] = pb.sousQuestions.map(q => q.reponse);
        const n = Number(/maturité (\d+) ans/.exec(pb.contexte)![1]);
        const prime = Number(/\+(\d+) pb/.exec(pb.sousQuestions[2].enonce)![1]);
        expect(pInitial).toBeLessThan(1000); // coupon envisagé < taux ⇒ sous le pair
        expect(pPrime).toBeLessThan(1000); // prime exigée ⇒ sous le pair
        expect(pPrime).toBeCloseTo(prixObligation(1000, couponPair, n, couponPair + prime / 100), 1);
      }
    });

    it('bootstrap-courbe : le forward c) se recalcule exactement depuis a) et b)', () => {
      for (const seed of SEEDS) {
        const [z1, z2, fwd] = reponses('m4-pb-bootstrap-courbe', seed);
        expect(z2).toBeGreaterThan(z1);
        expect(fwd).toBeGreaterThan(z2); // courbe croissante ⇒ forward au-dessus du 2 ans
        expect(fwd).toBeCloseTo(tauxForward(z1, 1, z2, 2), 2);
      }
    });

    it('frn-vs-fixe : écart c) = b) − a), et c)/d) retombe sur un notionnel du tirage', () => {
      for (const seed of SEEDS) {
        const [frn, fixe, ecart, pointMort] = reponses('m4-pb-frn-vs-fixe', seed);
        expect(fixe).toBeGreaterThan(frn);
        expect(Math.abs(ecart - (fixe - frn))).toBeLessThanOrEqual(0.03);
        expect(pointMort).toBeGreaterThan(10);
        expect(pointMort).toBeLessThan(100);
        const ratio = ecart / pointMort; // = notionnel / 10 000
        expect([500, 1000, 2000, 5000].some(v => Math.abs(ratio - v) / v < 0.01)).toBe(true);
      }
    });

    it('spread-souverain : c) < b), perte d) = (b − c) × nombre de titres de la position', () => {
      for (const seed of SEEDS) {
        const [spread, p0, p1, perte] = reponses('m4-pb-spread-souverain', seed);
        expect(spread).toBeGreaterThanOrEqual(45);
        expect(spread).toBeLessThanOrEqual(95);
        expect(p1).toBeLessThan(p0);
        expect(perte).toBeGreaterThan(0);
        const ratio = perte / (p0 - p1); // = nombre de titres (position M€ / nominal 1 000 €)
        expect([5000, 10000, 20000, 50000].some(v => Math.abs(ratio - v) / v < 0.02)).toBe(true);
      }
    });
  });
});
