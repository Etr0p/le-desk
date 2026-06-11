import { describe, expect, it } from 'vitest';
import { commissionTotale, executionCarnet, milieuFourchette, pnlMarketMaker, spreadPb } from './calculs';
import type { NiveauCarnet } from './calculs';
import { problemes } from './problems';

const M1 = '01-panorama-marches';
const SEEDS = [1, 2, 3];
const LANGUES = ['fr', 'en'] as const;

// Module 1 : id → niveau de difficulté attendu (4 boss N4).
const NIVEAUX_ATTENDUS: Record<string, number> = {
  'm1-pb-executer-un-ordre': 2,
  'm1-pb-choix-type-ordre': 2,
  'm1-pb-market-maker-journee': 3,
  'm1-pb-chaine-de-couts': 3,
  'm1-pb-frais-gestion-long-terme': 3,
  'm1-pb-selection-adverse': 4,
  'm1-pb-decouper-un-gros-ordre': 4,
  'm1-pb-appels-de-marge-ccp': 4,
  'm1-pb-detection-spoofing': 4,
  'm1-pb-tour-des-acteurs': 2,
};

function moule(id: string) {
  const p = problemes.find(x => x.id === id);
  if (!p) throw new Error(`moule manquant : ${id}`);
  return p;
}
/** Nombre anglais éventuellement formaté avec séparateurs de milliers ("120,000"). */
const num = (s: string) => Number(s.replace(/,/g, ''));

describe('module 1 — moules de problèmes', () => {
  it('expose les 10 moules aux niveaux prévus, ids uniques', () => {
    expect(problemes.length).toBeGreaterThanOrEqual(10);
    for (const [id, niveau] of Object.entries(NIVEAUX_ATTENDUS)) {
      const p = problemes.find(x => x.id === id);
      expect(p, `moule absent : ${id}`).toBeDefined();
      expect(p!.difficulte, `niveau de ${id}`).toBe(niveau);
      expect(p!.moduleId).toBe(M1);
      expect(p!.typeDeCas.length).toBeGreaterThan(3);
      expect(p!.titreEn, `titreEn manquant sur ${id}`).toBeDefined();
      expect(p!.typeDeCasEn, `typeDeCasEn manquant sur ${id}`).toBeDefined();
    }
    const ids = problemes.map(p => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('aligne ≥ 4 moules N4 et 30 scénarios au total', () => {
    expect(problemes.filter(p => p.difficulte === 4).length).toBeGreaterThanOrEqual(4);
    expect(problemes.reduce((s, p) => s + p.scenarios.length, 0)).toBeGreaterThanOrEqual(30);
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
    it('executer-un-ordre : a) spread pb recoupé, b) via executionCarnet, c) = Q × (b − milieu), d) recalculée, e) = c) + d)', () => {
      for (const seed of SEEDS) {
        const pb = moule('m1-pb-executer-un-ordre').generate(seed, 0, 'en');
        const [spread, prixMoyen, slip, com, friction] = pb.sousQuestions.map(q => q.reponse);
        // ([\d,]+(?:\.\d+)?) et non [\d,.]+ : un prix en fin de phrase (« €87.42. The order »)
        // ferait capturer le point final → Number(...) = NaN.
        const bid = num(/€([\d,]+(?:\.\d+)?) at the bid/.exec(pb.contexte)![1]);
        const lv = /on the ask side, ([\d,]+) shares at €([\d,]+(?:\.\d+)?), ([\d,]+) at €([\d,]+(?:\.\d+)?) and ([\d,]+) at €([\d,]+(?:\.\d+)?)/.exec(pb.contexte)!;
        const Q = num(/buy ([\d,]+) shares at market/.exec(pb.contexte)![1]);
        const taux = Number(/Brokerage: ([\d.]+) bp/.exec(pb.contexte)![1]);
        const minimum = num(/€([\d,]+) minimum/.exec(pb.contexte)![1]);
        const niveaux: NiveauCarnet[] = [
          { prix: num(lv[2]), taille: num(lv[1]) },
          { prix: num(lv[4]), taille: num(lv[3]) },
          { prix: num(lv[6]), taille: num(lv[5]) },
        ];
        const exec = executionCarnet(Q, niveaux);
        const milieu = milieuFourchette(bid, niveaux[0].prix);
        expect(spread).toBeCloseTo(spreadPb(bid, niveaux[0].prix), 1);
        expect(prixMoyen).toBeCloseTo(exec.prixMoyen, 3);
        expect(slip).toBeCloseTo(Q * (exec.prixMoyen - milieu), 0);
        expect(slip).toBeGreaterThan(0); // marcher le carnet coûte toujours à l'achat
        expect(com).toBeCloseTo(commissionTotale(exec.coutTotal, taux, minimum), 1);
        expect(friction).toBeCloseTo(slip + com, 1); // e) = c) + d)
      }
    });

    it('choix-type-ordre : a) = Q × bid, b) = Q × gap, c) = Q × (gap − glissement), d) = Q × stop − c), hiérarchie a) > b) > c)', () => {
      for (const seed of SEEDS) {
        const pb = moule('m1-pb-choix-type-ordre').generate(seed, 0, 'en');
        const [marche, residuel, stopProd, ecart] = pb.sousQuestions.map(q => q.reponse);
        const Q = num(/hold ([\d,]+) shares/.exec(pb.contexte)![1]);
        const B = num(/bid stands at €([\d,]+(?:\.\d+)?)/.exec(pb.contexte)![1]);
        const G = num(/reopen around €([\d,]+(?:\.\d+)?)/.exec(pb.contexte)![1]);
        const S = num(/stop at €([\d,]+(?:\.\d+)?)/.exec(pb.contexte)![1]);
        const glisse = Number(/€([\d.]+) below the reopening/.exec(pb.contexte)![1]);
        expect(marche).toBeCloseTo(Q * B, 1);
        expect(residuel).toBeCloseTo(Q * G, 1);
        expect(stopProd).toBeCloseTo(Q * (G - glisse), 1);
        expect(ecart).toBeCloseTo(Q * S - stopProd, 1); // d) enchaîne sur c)
        expect(marche).toBeGreaterThan(residuel); // vendre avant le gap bat toutes les issues du gap
        expect(residuel).toBeGreaterThan(stopProd); // le stop déclenché dans le gap fait pire que garder
        expect(S).toBeGreaterThan(G); // le stop « promettait » mieux que l'ouverture
      }
    });

    it('market-maker-journee : a) et b) recalculés, c) = a) − b) − fixes, d) tel que le brut couvre tout, e) = c) − b)', () => {
      for (const seed of SEEDS) {
        const pb = moule('m1-pb-market-maker-journee').generate(seed, 0, 'en');
        const [brut, couv, net, seuil, choc] = pb.sousQuestions.map(q => q.reponse);
        const m = /completes (\d+) round trips of ([\d,]+) shares/.exec(pb.contexte)!;
        const nb = Number(m[1]);
        const taille = num(m[2]);
        const spC = Number(/spread of ([\d.]+) cents/.exec(pb.contexte)![1]);
        const cvC = Number(/hedging costs ([\d.]+) cents/.exec(pb.contexte)![1]);
        const fixes = num(/€([\d,]+) of fixed costs/.exec(pb.contexte)![1]);
        expect(brut).toBeCloseTo(nb * taille * (spC / 100), 0);
        expect(couv).toBeCloseTo(nb * taille * (cvC / 100), 0);
        expect(brut - couv).toBeCloseTo(pnlMarketMaker(nb, taille, spC / 100, cvC / 100), 0);
        expect(net).toBeCloseTo(brut - couv - fixes, 1); // c) = a) − b) − fixes
        expect(choc).toBeCloseTo(net - couv, 1); // doubler la couverture retranche encore b)
        // au seuil d), la marge brute paie exactement couverture + coûts fixes
        expect(Math.abs(nb * taille * (seuil / 100 - cvC / 100) - fixes)).toBeLessThanOrEqual(35);
        expect(seuil).toBeGreaterThan(cvC); // le seuil dépasse toujours le coût de couverture unitaire
      }
    });

    it('chaine-de-couts : les 4 étages recalculés depuis les taux en pb, e) = somme, f) = e) / 100', () => {
      for (const seed of SEEDS) {
        const pb = moule('m1-pb-chaine-de-couts').generate(seed, 0, 'en');
        const [courtage, demiSpread, slip, infra, totalEur, totalPb] = pb.sousQuestions.map(q => q.reponse);
        const N = 1_000_000;
        const co = Number(/brokerage at ([\d.]+) bp/.exec(pb.contexte)![1]);
        const minimum = num(/minimum €([\d,]+)/.exec(pb.contexte)![1]);
        const de = Number(/half-spread of ([\d.]+) bp/.exec(pb.contexte)![1]);
        const sl = Number(/depth slippage of ([\d.]+) bp/.exec(pb.contexte)![1]);
        const inf = Number(/infrastructure fees \(exchange, clearing, settlement\) of ([\d.]+) bp/.exec(pb.contexte)![1]);
        expect(courtage).toBeCloseTo(commissionTotale(N, co, minimum), 1);
        expect(demiSpread).toBeCloseTo((N * de) / 10_000, 1);
        expect(slip).toBeCloseTo((N * sl) / 10_000, 1);
        expect(infra).toBeCloseTo((N * inf) / 10_000, 1);
        expect(totalEur).toBeCloseTo(courtage + demiSpread + slip + infra, 1); // e) = a) + b) + c) + d)
        expect(totalPb).toBeCloseTo(totalEur / 100, 1); // sur 1 M€, 1 pb = 100 €
      }
    });

    it('frais-gestion-long-terme : a) et b) composés via (1 + r − f)^n, c) = a) − b), d) = c) / a) × 100', () => {
      for (const seed of SEEDS) {
        const pb = moule('m1-pb-frais-gestion-long-terme').generate(seed, 0, 'en');
        const [etf, actif, ecart, ecartPct] = pb.sousQuestions.map(q => q.reponse);
        const m = /initial €([\d,]+) invested for (\d+) years/.exec(pb.contexte)!;
        const C = num(m[1]);
        const n = Number(m[2]);
        const r = Number(/gross annual return of ([\d.]+)%/.exec(pb.contexte)![1]);
        const f1 = Number(/index fund charges ([\d.]+)%/.exec(pb.contexte)![1]);
        const f2 = Number(/active fund ([\d.]+)%/.exec(pb.contexte)![1]);
        expect(etf).toBeCloseTo(C * Math.pow(1 + (r - f1) / 100, n), 0);
        expect(actif).toBeCloseTo(C * Math.pow(1 + (r - f2) / 100, n), 0);
        expect(etf).toBeGreaterThan(actif); // moins de frais, plus de capital — toujours
        expect(ecart).toBeCloseTo(etf - actif, 1); // c) = a) − b)
        expect(ecartPct).toBeCloseTo((ecart / etf) * 100, 1); // d) = c) / a) × 100
        expect(ecartPct).toBeGreaterThan(10); // sur 20 ans et plus, l'écart de frais devient massif
      }
    });

    it("selection-adverse : a) et b) recalculés, a) > b) (spread trop serré), c) = 2pδ (Glosten-Milgrom), d) = 2 × c)", () => {
      for (const seed of SEEDS) {
        const pb = moule('m1-pb-selection-adverse').generate(seed, 0, 'en');
        const [perte, gain, spreadEq, spreadDouble] = pb.sousQuestions.map(q => q.reponse);
        const delta = Number(/€([\d.]+) above or below/.exec(pb.contexte)![1]);
        const m = /([\d,]+) orders of ([\d,]+) shares/.exec(pb.contexte)!;
        const N = num(m[1]);
        const T = num(m[2]);
        const p = Number(/([\d.]+)% come from informed/.exec(pb.contexte)![1]) / 100;
        const h = Number(/half-spread of €([\d.]+)/.exec(pb.contexte)![1]);
        expect(perte).toBeCloseTo(N * p * (delta - h) * T, 0);
        expect(gain).toBeCloseTo(N * (1 - p) * h * T, 0);
        expect(perte).toBeGreaterThan(gain); // h < pδ : le spread coté ne couvre pas les informés
        expect(spreadEq).toBeCloseTo(2 * p * delta * 100, 1); // formule GM simplifiée, en centimes
        expect(spreadDouble).toBeCloseTo(2 * spreadEq, 1); // p double ⇒ le spread double
        // au spread d'équilibre h* = pδ, gains et pertes s'annulent exactement
        const hEq = p * delta;
        expect(N * p * (delta - hEq) * T).toBeCloseTo(N * (1 - p) * hEq * T, 6);
      }
    });

    it('decouper-un-gros-ordre : a) brutal via executionCarnet, b) = Q × demi-spread, c) = a) − b) exact, d) en pb, e) = (k − 1) × Δt', () => {
      for (const seed of SEEDS) {
        const pb = moule('m1-pb-decouper-un-gros-ordre').generate(seed, 0, 'en');
        const [brutal, decoupe, economie, economiePb, duree] = pb.sousQuestions.map(q => q.reponse);
        const Q = num(/must buy ([\d,]+) shares/.exec(pb.contexte)![1]);
        const mid = num(/mid stands at €([\d,]+)/.exec(pb.contexte)![1]);
        const n1 = /First ask level: ([\d,]+) shares at €([\d,]+(?:\.\d+)?)/.exec(pb.contexte)!;
        const lv = /deeper levels: ([\d,]+) at €([\d,]+(?:\.\d+)?), ([\d,]+) at €([\d,]+(?:\.\d+)?) and ([\d,]+) at €([\d,]+(?:\.\d+)?)/.exec(pb.contexte)!;
        const k = Number(/(\d+) tranches/.exec(pb.contexte)![1]);
        const dt = Number(/every (\d+) minutes/.exec(pb.contexte)![1]);
        const niveaux: NiveauCarnet[] = [
          { prix: num(n1[2]), taille: num(n1[1]) },
          { prix: num(lv[2]), taille: num(lv[1]) },
          { prix: num(lv[4]), taille: num(lv[3]) },
          { prix: num(lv[6]), taille: num(lv[5]) },
        ];
        const exec = executionCarnet(Q, niveaux);
        expect(brutal).toBeCloseTo(exec.coutTotal - Q * mid, 0);
        expect(decoupe).toBeCloseTo(Q * (niveaux[0].prix - mid), 0);
        expect(Math.abs(economie - (brutal - decoupe))).toBeLessThanOrEqual(0.011); // c) = a) − b) exact
        expect(economie).toBeGreaterThan(0); // découper économise toujours sous l'hypothèse de reconstitution
        expect(economiePb).toBeCloseTo((economie / (Q * mid)) * 10_000, 1);
        expect(duree).toBe((k - 1) * dt); // e) : le prix du découpage se paie en minutes d'exposition
      }
    });

    it('appels-de-marge-ccp : b) = a) × m′/m, c) = b) − a), d) = (b) − enveloppe) / (P × m′), e) = X × P × m′', () => {
      for (const seed of SEEDS) {
        const pb = moule('m1-pb-appels-de-marge-ccp').generate(seed, 0, 'en');
        const [initiale, nouvelle, appel, reduction, surcout] = pb.sousQuestions.map(q => q.reponse);
        const m = /position of ([\d,]+) shares at €([\d,]+)/.exec(pb.contexte)!;
        const Q = num(m[1]);
        const P = num(m[2]);
        const m0 = Number(/margin rate of ([\d.]+)%/.exec(pb.contexte)![1]);
        const m1 = Number(/raised to ([\d.]+)%/.exec(pb.contexte)![1]);
        const E = num(/envelope holds €([\d,]+)/.exec(pb.contexte)![1]);
        const X = num(/([\d,]+) additional shares/.exec(pb.contexte)![1]);
        expect(initiale).toBeCloseTo(Q * P * (m0 / 100), 0);
        expect(nouvelle).toBeCloseTo(Q * P * (m1 / 100), 0);
        expect(nouvelle / initiale).toBeCloseTo(m1 / m0, 2);
        expect(appel).toBeCloseTo(nouvelle - initiale, 0); // c) = b) − a)
        expect(Math.abs(reduction - (nouvelle - E) / (P * (m1 / 100)))).toBeLessThanOrEqual(2); // arrondi au titre
        expect(reduction).toBeLessThan(Q); // on réduit, on ne liquide pas tout
        expect(surcout).toBeCloseTo(X * P * (m1 / 100), 0); // chaque achat AJOUTE de l'exigence — l'asymétrie GameStop
      }
    });

    it("detection-spoofing : a) = (affiché − exécuté) / affiché, b) = affiché / acheté, c) = R × Δ, d) = Δ / P en pb", () => {
      for (const seed of SEEDS) {
        const pb = moule('m1-pb-detection-spoofing').generate(seed, 0, 'en');
        const [annulation, asymetrie, pnl, economiePb] = pb.sousQuestions.map(q => q.reponse);
        const m = /posted (\d+) large sell orders of ([\d,]+) shares/.exec(pb.contexte)!;
        const A = Number(m[1]) * num(m[2]);
        const eV = num(/only ([\d,]+) shares executed/.exec(pb.contexte)![1]);
        const R = num(/bought ([\d,]+) shares/.exec(pb.contexte)![1]);
        const mp = /([\d.]+) cents below the initial price of €([\d,]+)/.exec(pb.contexte)!;
        const deltaEur = Number(mp[1]) / 100;
        const P = num(mp[2]);
        expect(annulation).toBeCloseTo(((A - eV) / A) * 100, 1);
        expect(annulation).toBeGreaterThan(90); // la signature du spoofing : on affiche pour annuler
        expect(asymetrie).toBeCloseTo(A / R, 1);
        expect(asymetrie).toBeGreaterThan(5); // l'affichage écrase l'exécution réelle
        expect(pnl).toBeCloseTo(R * deltaEur, 1); // c) : le gain se fait sur l'autre côté du carnet
        expect(economiePb).toBeCloseTo((deltaEur / P) * 10_000, 1);
      }
    });

    it('tour-des-acteurs : les 4 prélèvements recalculés, e) = somme, la gestion capte le plus gros étage', () => {
      for (const seed of SEEDS) {
        const pb = moule('m1-pb-tour-des-acteurs').generate(seed, 0, 'en');
        const [courtage, spread, gestion, conservation, total] = pb.sousQuestions.map(q => q.reponse);
        const N = num(/€([\d,]+) buy order/.exec(pb.contexte)![1]);
        const co = Number(/brokerage of ([\d.]+) bp/.exec(pb.contexte)![1]);
        const de = Number(/half-spread of ([\d.]+) bp/.exec(pb.contexte)![1]);
        const fg = Number(/management fees of ([\d.]+)%/.exec(pb.contexte)![1]);
        const cu = Number(/custody of ([\d.]+) bp/.exec(pb.contexte)![1]);
        expect(courtage).toBeCloseTo((N * co) / 10_000, 1);
        expect(spread).toBeCloseTo((N * de) / 10_000, 1);
        expect(gestion).toBeCloseTo(N * (fg / 100), 1);
        expect(conservation).toBeCloseTo((N * cu) / 10_000, 1);
        expect(total).toBeCloseTo(courtage + spread + gestion + conservation, 1); // e) = a) + b) + c) + d)
        expect(gestion).toBeGreaterThan(courtage + spread + conservation); // la valeur se capte à l'étage de la gestion (ch. 2)
      }
    });
  });
});
