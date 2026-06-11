import { describe, expect, it } from 'vitest';
import { bayes, normaleCdf, probaBinomiale, statT, van, vfAnnuite } from './calculs';
import { problemes } from './problems';

const M2 = '02-methodes-quantitatives';
const SEEDS = [1, 2, 3];
const LANGUES = ['fr', 'en'] as const;

// Lot 1 du module 2 : id → niveau de difficulté attendu.
const NIVEAUX_ATTENDUS: Record<string, number> = {
  'm2-pb-plan-epargne': 2,
  'm2-pb-choix-projets': 2,
  'm2-pb-analyse-rendements': 2,
  'm2-pb-portefeuille-2-actifs': 3,
  'm2-pb-bayes-diagnostic': 3,
  'm2-pb-binomiale-trading': 2,
  'm2-pb-objectif-normal': 2,
  'm2-pb-backtest-ic': 3,
  'm2-pb-alpha-significatif': 3,
  'm2-pb-beta-regression': 3,
};

function moule(id: string) {
  const p = problemes.find(x => x.id === id);
  if (!p) throw new Error(`moule manquant : ${id}`);
  return p;
}
/** Nombre anglais éventuellement formaté avec séparateurs de milliers ("120,000"). */
const num = (s: string) => Number(s.replace(/,/g, ''));

describe('module 2 — moules de problèmes (lot 1)', () => {
  it('expose les 10 moules du lot 1, niveaux conformes au plan, ids uniques', () => {
    expect(problemes.length).toBeGreaterThanOrEqual(10);
    for (const [id, niveau] of Object.entries(NIVEAUX_ATTENDUS)) {
      const p = problemes.find(x => x.id === id);
      expect(p, `moule absent : ${id}`).toBeDefined();
      expect(p!.difficulte, `niveau de ${id}`).toBe(niveau);
      expect(p!.moduleId).toBe(M2);
      expect(p!.typeDeCas.length).toBeGreaterThan(3);
      expect(p!.titreEn, `titreEn manquant sur ${id}`).toBeDefined();
      expect(p!.typeDeCasEn, `typeDeCasEn manquant sur ${id}`).toBeDefined();
    }
    const ids = problemes.map(p => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('chaque moule offre 3 scénarios FR traduits en anglais (même longueur, vraies traductions)', () => {
    for (const p of problemes) {
      expect(p.scenarios, `scénarios de ${p.id}`).toHaveLength(3);
      expect(p.scenariosEn, `scenariosEn manquant sur ${p.id}`).toBeDefined();
      expect(p.scenariosEn).toHaveLength(p.scenarios.length);
      p.scenariosEn!.forEach((libelle, i) => {
        expect(libelle.length).toBeGreaterThan(3);
        expect(libelle).not.toBe(p.scenarios[i]); // vraie traduction, pas une copie
      });
    }
  });

  for (const p of problemes) {
    describe(p.id, () => {
      p.scenarios.forEach((libelle, s) => {
        describe(`scénario ${s} — ${libelle}`, () => {
          it('génère 3 à 6 sous-questions valides pour les seeds 1-3, dans les deux langues', () => {
            for (const seed of SEEDS) {
              for (const langue of LANGUES) {
                const pb = p.generate(seed, s, langue);
                expect(pb.contexte).not.toMatch(/undefined|NaN/);
                expect(pb.contexte.length).toBeGreaterThan(80); // un vrai décor, pas une ligne
                expect(pb.sousQuestions.length).toBeGreaterThanOrEqual(3);
                expect(pb.sousQuestions.length).toBeLessThanOrEqual(6);
                for (const sq of pb.sousQuestions) {
                  expect(sq.intitule.length).toBeGreaterThan(2);
                  expect(sq.enonce).not.toMatch(/undefined|NaN/);
                  expect(Number.isFinite(sq.reponse)).toBe(true);
                  expect(sq.tolerance).toBeGreaterThan(0);
                  if (sq.toleranceMode === 'absolu') {
                    expect(sq.tolerance).toBeLessThanOrEqual(1000);
                  } else {
                    expect(sq.tolerance).toBeLessThanOrEqual(0.01);
                  }
                  expect(sq.etapes.length).toBeGreaterThanOrEqual(1);
                  for (const e of sq.etapes) {
                    expect(e.titre.length).toBeGreaterThan(0);
                    expect(e.contenu).not.toMatch(/undefined|NaN/);
                  }
                  for (const piege of sq.pieges ?? []) expect(piege).not.toMatch(/undefined|NaN/);
                }
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
    it('plan-epargne : a) = VF de l\'annuité, b) = a) actualisée, c) = a) − versements, d) = recalcul à taux + 1 pt', () => {
      for (const seed of SEEDS) {
        const pb = moule('m2-pb-plan-epargne').generate(seed, 0, 'en');
        const [vf, vaEq, interets, vfPlus] = pb.sousQuestions.map(q => q.reponse);
        const m = /€([\d,]+) at the end of each year for (\d+) years/.exec(pb.contexte)!;
        const flux = num(m[1]);
        const n = Number(m[2]);
        const taux = Number(/annual rate of ([\d.]+)%/.exec(pb.contexte)![1]);
        expect(vf).toBeCloseTo(vfAnnuite(flux, taux, n), 1);
        expect(vaEq).toBeCloseTo(vf / (1 + taux / 100) ** n, 0);
        expect(interets).toBeCloseTo(vf - flux * n, 1);
        expect(interets).toBeGreaterThan(0);
        expect(vfPlus).toBeCloseTo(vfAnnuite(flux, taux + 1, n), 1);
        expect(vfPlus).toBeGreaterThan(vf);
      }
    });

    it('choix-projets : VAN a) et b) recalculées depuis le contexte, c) = |a) − b)|, la VAN s\'annule au TRI d)', () => {
      for (const seed of SEEDS) {
        const pb = moule('m2-pb-choix-projets').generate(seed, 0, 'en');
        const [vanA, vanB, ecart, tri] = pb.sousQuestions.map(q => q.reponse);
        const a = /project A costs €([\d,]+) upfront and then pays €([\d,]+) at the end of each year for (\d+) years/.exec(pb.contexte)!;
        const b = /project B costs €([\d,]+) upfront and then pays €([\d,]+)/.exec(pb.contexte)!;
        const n = Number(a[3]);
        const taux = Number(/discount rate is ([\d.]+)%/.exec(pb.contexte)![1]);
        const fluxA = Array.from({ length: n }, () => num(a[2]));
        const fluxB = Array.from({ length: n }, () => num(b[2]));
        expect(vanA).toBeCloseTo(van(num(a[1]), fluxA, taux), 1);
        expect(vanB).toBeCloseTo(van(num(b[1]), fluxB, taux), 1);
        expect(vanA).toBeGreaterThan(0);
        expect(vanB).toBeGreaterThan(0);
        expect(ecart).toBeCloseTo(Math.abs(vanA - vanB), 1);
        expect(ecart).toBeGreaterThanOrEqual(1999); // les deux projets restent discernables
        const gagnantA = vanA > vanB;
        const invG = gagnantA ? num(a[1]) : num(b[1]);
        expect(tri).toBeGreaterThan(taux); // VAN > 0 ⇒ TRI au-dessus du coût du capital
        expect(Math.abs(van(invG, gagnantA ? fluxA : fluxB, tri))).toBeLessThan(0.02 * invG); // la VAN s'annule (quasi) au TRI
      }
    });

    it('analyse-rendements : géométrique b) < arithmétique a), d) recomposée par b), la moyenne naïve surestime', () => {
      for (const seed of SEEDS) {
        const pb = moule('m2-pb-analyse-rendements').generate(seed, 0, 'en');
        const [moyA, moyG, sigma, richesse] = pb.sousQuestions.map(q => q.reponse);
        const cap = num(/€([\d,]+)/.exec(pb.contexte)![1]);
        const n = Number(/over (\d+) years/.exec(pb.contexte)![1]);
        expect(moyG).toBeLessThan(moyA);
        expect(sigma).toBeGreaterThan(0);
        expect(Math.abs(richesse - cap * (1 + moyG / 100) ** n) / richesse).toBeLessThan(0.01); // la géométrique recompose la richesse
        expect(cap * (1 + moyA / 100) ** n).toBeGreaterThan(richesse); // la moyenne naïve promet trop
      }
    });

    it('portefeuille-2-actifs : b) = c)², e) = moyenne pondérée des σ, d) = e) − c) > 0', () => {
      for (const seed of SEEDS) {
        const pb = moule('m2-pb-portefeuille-2-actifs').generate(seed, 0, 'en');
        const [esp, varP, sig, gain, sigRho1] = pb.sousQuestions.map(q => q.reponse);
        const w = Number(/([\d.]+)% in an equity fund/.exec(pb.contexte)![1]) / 100;
        const me = /equity fund \(expected return ([\d.]+)%, volatility ([\d.]+)%\)/.exec(pb.contexte)!;
        const mb = /bond fund \(expected return ([\d.]+)%, volatility ([\d.]+)%\)/.exec(pb.contexte)!;
        expect(esp).toBeCloseTo(w * Number(me[1]) + (1 - w) * Number(mb[1]), 1);
        expect(varP).toBeCloseTo(sig ** 2, 0);
        expect(sigRho1).toBeCloseTo(w * Number(me[2]) + (1 - w) * Number(mb[2]), 1);
        expect(gain).toBeCloseTo(sigRho1 - sig, 1);
        expect(gain).toBeGreaterThan(0); // ρ < 1 ⇒ la diversification travaille
      }
    });

    it('bayes-diagnostic : a) et b) recalculés depuis le contexte, c) en effectifs recoupe b), d) > b)', () => {
      for (const seed of SEEDS) {
        const pb = moule('m2-pb-bayes-diagnostic').generate(seed, 0, 'en');
        const [pPos, ppv, vrais, ppv2] = pb.sousQuestions.map(q => q.reponse);
        const p = Number(/prevalence of ([\d.]+)%/.exec(pb.contexte)![1]) / 100;
        const se = Number(/detects ([\d.]+)%/.exec(pb.contexte)![1]) / 100;
        const fp = Number(/false-positive rate of ([\d.]+)%/.exec(pb.contexte)![1]) / 100;
        const N = num(/([\d,]+) people/.exec(pb.contexte)![1]);
        expect(pPos).toBeCloseTo((se * p + fp * (1 - p)) * 100, 1);
        expect(ppv).toBeCloseTo(bayes(p, se, fp) * 100, 1);
        expect(Math.abs(vrais - N * p * se)).toBeLessThanOrEqual(0.51); // arrondi à l'unité
        expect(Math.abs(vrais / (N * pPos / 100) - ppv / 100)).toBeLessThan(0.03); // vrais / total positifs ≈ Bayes
        expect(ppv2).toBeGreaterThan(ppv); // prévalence doublée ⇒ positif plus crédible
      }
    });

    it('binomiale-trading : a) et b) recalculés depuis n, p, k du tirage, b) ≥ a), c) = np, d) = √(np(1−p))', () => {
      for (const seed of SEEDS) {
        const pb = moule('m2-pb-binomiale-trading').generate(seed, 0, 'en');
        const [pk, pAuMoins, esper, et] = pb.sousQuestions.map(q => q.reponse);
        const n = Number(/(\d+) independent trades/.exec(pb.contexte)![1]);
        const p = Number(/a ([\d.]+)% probability/.exec(pb.contexte)![1]) / 100;
        const k = Number(/exactly (\d+)/.exec(pb.sousQuestions[0].enonce)![1]);
        expect(pk).toBeCloseTo(probaBinomiale(n, k, p) * 100, 1);
        let somme = 0;
        for (let i = k; i <= n; i++) somme += probaBinomiale(n, i, p);
        expect(pAuMoins).toBeCloseTo(somme * 100, 1);
        expect(pAuMoins).toBeGreaterThanOrEqual(pk);
        expect(esper).toBeCloseTo(n * p, 1);
        expect(et).toBeCloseTo(Math.sqrt(n * p * (1 - p)), 1);
      }
    });

    it('objectif-normal : b) = 1 − Φ(a)), c) et d) recalculés depuis μ et σ du contexte, d) < 0', () => {
      for (const seed of SEEDS) {
        const pb = moule('m2-pb-objectif-normal').generate(seed, 0, 'en');
        const [z, pAtt, pPerte, q5] = pb.sousQuestions.map(q => q.reponse);
        const mu = Number(/mean of ([\d.]+)%/.exec(pb.contexte)![1]);
        const sg = Number(/standard deviation of ([\d.]+)%/.exec(pb.contexte)![1]);
        const obj = Number(/target for the year is ([\d.]+)%/.exec(pb.contexte)![1]);
        expect(z).toBeCloseTo((obj - mu) / sg, 1);
        expect(pAtt).toBeCloseTo((1 - normaleCdf((obj - mu) / sg)) * 100, 0);
        expect(pAtt + pPerte).toBeLessThan(100); // l'objectif est au-dessus de 0 : les deux queues ne se recouvrent pas
        expect(pPerte).toBeCloseTo(normaleCdf((0 - mu) / sg) * 100, 0);
        expect(q5).toBeCloseTo(mu - 1.645 * sg, 1);
        expect(q5).toBeLessThan(0); // le teaser VaR : le quantile à 5 % est une perte
      }
    });

    it('backtest-ic : a) = s/√n, b) et c) = m ∓ 1,96·a), d) = 4n', () => {
      for (const seed of SEEDS) {
        const pb = moule('m2-pb-backtest-ic').generate(seed, 0, 'en');
        const [se, basse, haute, nQuadruple] = pb.sousQuestions.map(q => q.reponse);
        const m = Number(/excess return of ([\d.]+)%/.exec(pb.contexte)![1]);
        const s = Number(/standard deviation of ([\d.]+)%/.exec(pb.contexte)![1]);
        const n = Number(/over (\d+) months/.exec(pb.contexte)![1]);
        expect(se).toBeCloseTo(s / Math.sqrt(n), 2);
        expect(basse).toBeCloseTo(m - 1.96 * se, 1);
        expect(haute).toBeCloseTo(m + 1.96 * se, 1);
        expect(haute - basse).toBeCloseTo(2 * 1.96 * se, 1);
        expect(nQuadruple).toBe(4 * n); // diviser l'erreur par 2 = quadrupler l'échantillon
      }
    });

    it('alpha-significatif : a) = stat t, b) = p-value normale de a), c) = a) − 1,645, d) = 5 % des fonds testés', () => {
      for (const seed of SEEDS) {
        const pb = moule('m2-pb-alpha-significatif').generate(seed, 0, 'en');
        const [t, pval, marge, fauxPos] = pb.sousQuestions.map(q => q.reponse);
        const a = Number(/alpha of ([\d.]+)%/.exec(pb.contexte)![1]);
        const s = Number(/standard deviation of ([\d.]+)%/.exec(pb.contexte)![1]);
        const n = Number(/over (\d+) months/.exec(pb.contexte)![1]);
        expect(t).toBeCloseTo(statT(a, 0, s, n), 1);
        expect(pval).toBeCloseTo((1 - normaleCdf(statT(a, 0, s, n))) * 100, 0);
        expect(marge).toBeCloseTo(t - 1.645, 1);
        const nf = Number(/(\d+) funds/.exec(pb.sousQuestions[3].enonce)![1]);
        expect(fauxPos).toBeCloseTo(nf * 0.05, 5);
      }
    });

    it('beta-regression : d) = b) + a) × scénario de marché, R² c) dans ]0 ; 1], bêta a) plausible', () => {
      for (const seed of SEEDS) {
        const pb = moule('m2-pb-beta-regression').generate(seed, 0, 'en');
        const [beta, alphaHat, r2v, yPred] = pb.sousQuestions.map(q => q.reponse);
        const xPred = Number(/return of (-?[\d.]+)%/.exec(pb.sousQuestions[3].enonce)![1]);
        expect(Math.abs(yPred - (alphaHat + beta * xPred))).toBeLessThan(0.2);
        expect(r2v).toBeGreaterThan(0);
        expect(r2v).toBeLessThanOrEqual(1);
        expect(beta).toBeGreaterThan(0.2);
        expect(beta).toBeLessThan(2);
      }
    });
  });
});
