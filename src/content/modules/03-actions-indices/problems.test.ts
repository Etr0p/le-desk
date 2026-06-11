import { describe, expect, it } from 'vitest';
import { statT } from '../02-methodes-quantitatives/calculs';
import {
  coutEmprunTitres, dcfSimple, ddmDeuxEtapes, evSurEbitda, gordon,
  indiceCapiPonderee, pnlVenteADecouvert, poidsDansIndice,
  valeurDroitSouscription, valeurTerminaleGordon,
} from './calculs';
import { problemes } from './problems';

const M3 = '03-actions-indices';
const SEEDS = [1, 2, 3];
const LANGUES = ['fr', 'en'] as const;

// Les 20 moules du module 3 : id → niveau de difficulté attendu (7 N2, 7 N3, 6 boss N4).
const NIVEAUX_ATTENDUS: Record<string, number> = {
  'm3-pb-valorisation-gordon-complete': 2,
  'm3-pb-per-comparables': 2,
  'm3-pb-ev-ebitda-complet': 2,
  'm3-pb-calendrier-dividende': 2,
  'm3-pb-split-et-capi': 2,
  'm3-pb-panier-indice': 2,
  'm3-pb-rendement-total': 2,
  'm3-pb-ddm-deux-etapes-complet': 3,
  'm3-pb-dcf-sensibilite': 3,
  'm3-pb-augmentation-capital-dps': 3,
  'm3-pb-buyback-bpa': 3,
  'm3-pb-ipo-pricing': 3,
  'm3-pb-greenshoe': 3,
  'm3-pb-short-couvert': 3,
  'm3-pb-dcf-complet-sensibilites': 4,
  'm3-pb-valorisation-croisee': 4,
  'm3-pb-short-squeeze': 4,
  'm3-pb-dilution-relution': 4,
  'm3-pb-index-rebalancing': 4,
  'm3-pb-efficience-anomalie': 4,
};

function moule(id: string) {
  const p = problemes.find(x => x.id === id);
  if (!p) throw new Error(`moule manquant : ${id}`);
  return p;
}
/** Nombre anglais éventuellement formaté avec séparateurs de milliers ("120,000"). */
const num = (s: string) => Number(s.replace(/,/g, ''));

describe('module 3 — moules de problèmes', () => {
  it('expose les 20 moules aux niveaux prévus, ids uniques, bilingue déclaré', () => {
    expect(problemes.length).toBeGreaterThanOrEqual(20);
    for (const [id, niveau] of Object.entries(NIVEAUX_ATTENDUS)) {
      const p = problemes.find(x => x.id === id);
      expect(p, `moule absent : ${id}`).toBeDefined();
      expect(p!.difficulte, `niveau de ${id}`).toBe(niveau);
      expect(p!.moduleId).toBe(M3);
      expect(p!.typeDeCas.length).toBeGreaterThan(3);
      expect(p!.titreEn, `titreEn manquant sur ${id}`).toBeDefined();
      expect(p!.typeDeCasEn, `typeDeCasEn manquant sur ${id}`).toBeDefined();
    }
    const ids = problemes.map(p => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('aligne ≥ 6 boss N4 et ≥ 57 scénarios au total', () => {
    expect(problemes.filter(p => p.difficulte === 4).length).toBeGreaterThanOrEqual(6);
    expect(problemes.reduce((s, p) => s + p.scenarios.length, 0)).toBeGreaterThanOrEqual(57);
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
    it('valorisation-gordon-complete : a) g = ROE×b, b) D₁, c) Gordon recalculé, d) écart signé selon cours vs valeur', () => {
      for (const seed of SEEDS) {
        const pb = moule('m3-pb-valorisation-gordon-complete').generate(seed, 0, 'en');
        const [g, d1, v, ecart] = pb.sousQuestions.map(q => q.reponse);
        const roe = Number(/an ROE of ([\d.]+)%/.exec(pb.contexte)![1]);
        const payout = Number(/payout ratio of (\d+)%/.exec(pb.contexte)![1]);
        // num() et pas Number() : un BPA entier est suivi de la virgule de la phrase
        // (« EPS of €7, a required return… ») que [\d,]+ avale — Number(« 7, ») = NaN.
        const eps = num(/EPS of €([\d,]+(?:\.\d+)?)/.exec(pb.contexte)![1]);
        const r = Number(/required return of ([\d.]+)%/.exec(pb.contexte)![1]);
        const cours = num(/share price of €([\d,]+(?:\.\d+)?)/.exec(pb.contexte)![1]);
        const gCalc = (roe * (100 - payout)) / 100;
        expect(g).toBeCloseTo(gCalc, 1);
        expect(r).toBeGreaterThan(g); // Gordon exige r > g
        const d1Calc = ((eps * payout) / 100) * (1 + gCalc / 100);
        expect(d1).toBeCloseTo(d1Calc, 1);
        const vCalc = gordon(d1Calc, r, gCalc);
        expect(v).toBeCloseTo(vCalc, 1);
        expect(ecart).toBeCloseTo((cours / vCalc - 1) * 100, 1);
        expect(ecart > 0).toBe(cours > vCalc); // cher ssi le cours dépasse la valeur intrinsèque
      }
    });

    it('per-comparables : a) médiane des trois PER, b) = a)×BPA, c) PER actuel, d) décote > 0 recoupée par b)', () => {
      for (const seed of SEEDS) {
        const pb = moule('m3-pb-per-comparables').generate(seed, 0, 'en');
        const [med, implicite, perAct, decote] = pb.sousQuestions.map(q => q.reponse);
        const m = /P\/E ratios of ([\d,]+(?:\.\d+)?), ([\d,]+(?:\.\d+)?) and ([\d,]+(?:\.\d+)?)/.exec(pb.contexte)!;
        const pers = [num(m[1]), num(m[2]), num(m[3])].sort((a, b) => a - b);
        const eps = Number(/EPS of €([\d,]+(?:\.\d+)?)/.exec(pb.contexte)![1]);
        const cours = num(/share trades at €([\d,]+(?:\.\d+)?)/.exec(pb.contexte)![1]);
        expect(med).toBeCloseTo(pers[1], 2);
        expect(implicite).toBeCloseTo(pers[1] * eps, 1);
        expect(perAct).toBeCloseTo(cours / eps, 1);
        expect(decote).toBeCloseTo((1 - cours / (pers[1] * eps)) * 100, 1);
        expect(decote).toBeGreaterThan(0); // la cible cote sous le prix des comparables
      }
    });

    it('ev-ebitda-complet : a) capi, b) EV, c) multiple via evSurEbitda, d) prix au multiple sectoriel, e) écart signé', () => {
      for (const seed of SEEDS) {
        const pb = moule('m3-pb-ev-ebitda-complet').generate(seed, 0, 'en');
        const [capi, ev, multAct, prixImp, ecart] = pb.sousQuestions.map(q => q.reponse);
        const m = /([\d,]+) million shares at €([\d,]+(?:\.\d+)?)/.exec(pb.contexte)!;
        const nb = num(m[1]);
        const prix = num(m[2]);
        const dette = num(/net debt of €(-?[\d,]+) million/.exec(pb.contexte)![1]);
        const ebitda = num(/EBITDA of €([\d,]+) million/.exec(pb.contexte)![1]);
        const mult = Number(/sector multiple of ([\d.]+)x/.exec(pb.contexte)![1]);
        expect(capi).toBeCloseTo(nb * prix, 1);
        expect(ev).toBeCloseTo(nb * prix + dette, 1);
        expect(multAct).toBeCloseTo(evSurEbitda(nb * prix, dette, ebitda), 1);
        const prixCible = (mult * ebitda - dette) / nb;
        expect(prixImp).toBeCloseTo(prixCible, 1);
        expect(ecart).toBeCloseTo((prix / prixCible - 1) * 100, 1);
        expect(ecart > 0).toBe(prix > prixCible);
      }
    });

    it('calendrier-dividende : a) = P − D, b) = q×P (neutralité), c) = 0 avant frais, d) = − les frais des deux jambes', () => {
      for (const seed of SEEDS) {
        const pb = moule('m3-pb-calendrier-dividende').generate(seed, 0, 'en');
        const [pex, richesse, avantFrais, apresFrais] = pb.sousQuestions.map(q => q.reponse);
        const m = /(\d+) shares of a stock trading at €([\d,]+(?:\.\d+)?)/.exec(pb.contexte)!;
        const q = Number(m[1]);
        const P = num(m[2]);
        const D = Number(/dividend of €([\d,]+(?:\.\d+)?)/.exec(pb.contexte)![1]);
        const frais = Number(/fees of ([\d.]+)% on each leg/.exec(pb.contexte)![1]);
        expect(pex).toBeCloseTo(P - D, 1);
        expect(richesse).toBeCloseTo(q * P, 1); // cash du dividende + titre ex : la richesse ne bouge pas
        expect(avantFrais).toBe(0); // le dividend capture ne crée rien
        expect(apresFrais).toBeCloseTo(-(frais / 100) * q * (2 * P - D), 1);
        expect(apresFrais).toBeLessThan(0); // après frais, il détruit
      }
    });

    it('split-et-capi : a) prix divisé, b) titres multipliés, c) capi inchangée = a)×b), d) position client inchangée', () => {
      for (const seed of SEEDS) {
        const pb = moule('m3-pb-split-et-capi').generate(seed, 0, 'en');
        const [pNew, nbNew, capi, position] = pb.sousQuestions.map(q => q.reponse);
        const P = num(/share trades at €([\d,]+(?:\.\d+)?)/.exec(pb.contexte)![1]);
        const ratio = Number(/(\d+)-for-1 split/.exec(pb.contexte)![1]);
        const nb = num(/([\d,]+) million shares are outstanding/.exec(pb.contexte)![1]);
        const q = num(/holds ([\d,]+) shares/.exec(pb.contexte)![1]);
        expect(pNew).toBeCloseTo(P / ratio, 1);
        expect(nbNew).toBeCloseTo(nb * ratio, 1);
        expect(capi).toBeCloseTo(P * nb, 1); // la capitalisation ne bouge pas…
        expect(capi).toBeCloseTo(pNew * nbNew, 0); // …et se recompose depuis a)×b)
        expect(position).toBeCloseTo(q * P, 1); // le client n'est ni plus riche ni plus pauvre
      }
    });

    it('panier-indice : a) capi flottante via indiceCapiPonderee, b) poids max, c) = b)×x/100, d) = niveau recomposé', () => {
      for (const seed of SEEDS) {
        const pb = moule('m3-pb-panier-indice').generate(seed, 0, 'en');
        const [capi, poidsMax, varPct, niveau] = pb.sousQuestions.map(q => q.reponse);
        const cells = [...pb.contexte.matchAll(/\(price €([\d,]+), ([\d,]+) million shares, (\d+)% free float\)/g)]
          .map(x => ({ prix: num(x[1]), nbTitres: num(x[2]), flottantPct: Number(x[3]) }));
        expect(cells).toHaveLength(3);
        expect(capi).toBeCloseTo(indiceCapiPonderee(cells), 1);
        const poids = poidsDansIndice(cells);
        expect(poidsMax).toBeCloseTo(Math.max(...poids), 1);
        const x = Number(/gains ([\d.]+)%/.exec(pb.contexte)![1]);
        const L0 = num(/stands at ([\d,]+) points/.exec(pb.contexte)![1]);
        expect(varPct).toBeCloseTo((Math.max(...poids) * x) / 100, 1);
        expect(niveau).toBeCloseTo(L0 * (1 + varPct / 100), 0);
        expect(niveau).toBeGreaterThan(L0); // une hausse du poids lourd tire l'indice
      }
    });

    it('rendement-total : prix recomposé, total > prix (les dividendes comptent), annualisé recoupé par d)', () => {
      for (const seed of SEEDS) {
        const pb = moule('m3-pb-rendement-total').generate(seed, 0, 'en');
        const [p2, rPrix, richesse, rTot, ann] = pb.sousQuestions.map(q => q.reponse);
        const m = /bought (\d+) shares at €([\d,]+(?:\.\d+)?)/.exec(pb.contexte)!;
        const q = Number(m[1]);
        const p0 = num(m[2]);
        const y = /returned ([+-]?[\d.]+)% in year 1 and ([+-]?[\d.]+)% in year 2/.exec(pb.contexte)!;
        const y1 = Number(y[1]);
        const y2 = Number(y[2]);
        const D = Number(/dividend of €([\d,]+(?:\.\d+)?)/.exec(pb.contexte)![1]);
        const p1 = p0 * (1 + y1 / 100);
        const p2Calc = p1 * (1 + y2 / 100);
        expect(p2).toBeCloseTo(p2Calc, 1);
        expect(rPrix).toBeCloseTo((p2Calc / p0 - 1) * 100, 1);
        const fTot = (1 + D / p1) * (1 + D / p2Calc);
        expect(richesse).toBeCloseTo(q * fTot * p2Calc, 1);
        const rTotCalc = (fTot * p2Calc / p0 - 1) * 100;
        expect(rTot).toBeCloseTo(rTotCalc, 1);
        expect(rTot).toBeGreaterThan(rPrix); // dividendes réinvestis : le total bat toujours le prix
        expect(ann).toBeCloseTo((Math.sqrt(1 + rTotCalc / 100) - 1) * 100, 1); // composé, pas divisé par 2
      }
    });

    it('ddm-deux-etapes-complet : a) Dₙ, b) VT Gordon, d) = c) + VT actualisée = ddmDeuxEtapes, e) écart signé', () => {
      for (const seed of SEEDS) {
        const pb = moule('m3-pb-ddm-deux-etapes-complet').generate(seed, 0, 'en');
        const [dn, vt, vaPhase1, v0, ecart] = pb.sousQuestions.map(q => q.reponse);
        const d0 = Number(/paid €([\d,]+(?:\.\d+)?) per share/.exec(pb.contexte)![1]);
        const m = /grow by ([\d.]+)% a year for (\d+) years, then by ([\d.]+)% forever/.exec(pb.contexte)!;
        const g1 = Number(m[1]);
        const n1 = Number(m[2]);
        const g2 = Number(m[3]);
        const r = Number(/required return is ([\d.]+)%/.exec(pb.contexte)![1]);
        const cours = num(/share trades at €([\d,]+(?:\.\d+)?)/.exec(pb.contexte)![1]);
        const dnCalc = d0 * (1 + g1 / 100) ** n1;
        expect(dn).toBeCloseTo(dnCalc, 1);
        expect(vt).toBeCloseTo(valeurTerminaleGordon(dnCalc, g2, r), 1);
        const v0Calc = ddmDeuxEtapes(d0, g1, n1, g2, r);
        expect(v0).toBeCloseTo(v0Calc, 1);
        expect(vaPhase1 + vt / (1 + r / 100) ** n1).toBeCloseTo(v0, 1); // le recollage des deux blocs
        expect(ecart).toBeCloseTo((cours / v0Calc - 1) * 100, 1);
      }
    });

    it('dcf-sensibilite : VT et EV recalculés via calculs.ts, et la fourchette d) < c) < e) à WACC ±1 pt', () => {
      for (const seed of SEEDS) {
        const pb = moule('m3-pb-dcf-sensibilite').generate(seed, 0, 'en');
        const [vt, ev, vpa, vpaHaut, vpaBas] = pb.sousQuestions.map(q => q.reponse);
        const m = /free cash flows of €([\d,]+) million, €([\d,]+) million and €([\d,]+) million/.exec(pb.contexte)!;
        const fcfs = [num(m[1]), num(m[2]), num(m[3])];
        const r = Number(/WACC of ([\d.]+)%/.exec(pb.contexte)![1]);
        const g = Number(/perpetual growth of ([\d.]+)%/.exec(pb.contexte)![1]);
        const dette = num(/net debt of €([\d,]+) million/.exec(pb.contexte)![1]);
        const nb = num(/([\d,]+) million shares/.exec(pb.contexte)![1]);
        const vtCalc = valeurTerminaleGordon(fcfs[2], g, r);
        expect(vt).toBeCloseTo(vtCalc, 1);
        const evCalc = dcfSimple(fcfs, r, vtCalc);
        expect(ev).toBeCloseTo(evCalc, 1);
        expect(vpa).toBeCloseTo((evCalc - dette) / nb, 1);
        expect(vpaHaut).toBeCloseTo((dcfSimple(fcfs, r + 1, valeurTerminaleGordon(fcfs[2], g, r + 1)) - dette) / nb, 1);
        expect(vpaBas).toBeCloseTo((dcfSimple(fcfs, r - 1, valeurTerminaleGordon(fcfs[2], g, r - 1)) - dette) / nb, 1);
        expect(vpaHaut).toBeLessThan(vpa); // WACC + 1 pt écrase la valeur…
        expect(vpaBas).toBeGreaterThan(vpa); // …WACC − 1 pt la gonfle : la fourchette
      }
    });

    it('augmentation-capital-dps : a) DPS, b) TERP = P − a), c) = q×P + m×E (souscrire), d) = q×P (vendre), e) = q×a)', () => {
      for (const seed of SEEDS) {
        const pb = moule('m3-pb-augmentation-capital-dps').generate(seed, 0, 'en');
        const [dps, terp, posApres, richesseVente, perte] = pb.sousQuestions.map(q => q.reponse);
        const P = num(/share trades at €([\d,]+(?:\.\d+)?)/.exec(pb.contexte)![1]);
        const m = /one new share for every (\d+) existing shares at €([\d,]+(?:\.\d+)?)/.exec(pb.contexte)!;
        const k = Number(m[1]);
        const E = num(m[2]);
        const q = num(/holds ([\d,]+) shares/.exec(pb.contexte)![1]);
        const dpsCalc = valeurDroitSouscription(P, E, k);
        expect(dps).toBeCloseTo(dpsCalc, 2);
        expect(terp).toBeCloseTo(P - dpsCalc, 1);
        expect(posApres).toBeCloseTo((q + q / k) * (P - dpsCalc), 1); // (q+m) titres au TERP…
        expect(posApres).toBeCloseTo(q * P + (q / k) * E, 0); // …= richesse initiale + cash injecté
        expect(richesseVente).toBeCloseTo(q * P, 1); // vendre ses droits laisse la richesse intacte
        expect(perte).toBeCloseTo(q * dpsCalc, 1); // ne rien faire = perdre la valeur des droits
      }
    });

    it('buyback-bpa : b) = montant/P, c) = B/(N−b)), d) relution > 0 recoupée, e) la capi baisse du montant (pas de magie)', () => {
      for (const seed of SEEDS) {
        const pb = moule('m3-pb-buyback-bpa').generate(seed, 0, 'en');
        const [bpaAv, nRach, bpaAp, relution, capiAp] = pb.sousQuestions.map(q => q.reponse);
        const B = num(/net income of €([\d,]+) million/.exec(pb.contexte)![1]);
        const N = num(/([\d,]+) million shares outstanding/.exec(pb.contexte)![1]);
        const P = num(/share price of €([\d,]+(?:\.\d+)?)/.exec(pb.contexte)![1]);
        const montant = num(/€([\d,]+) million buyback/.exec(pb.contexte)![1]);
        expect(bpaAv).toBeCloseTo(B / N, 2);
        const nR = montant / P;
        expect(nRach).toBeCloseTo(nR, 2);
        expect(bpaAp).toBeCloseTo(B / (N - nR), 2);
        expect(relution).toBeCloseTo((N / (N - nR) - 1) * 100, 1);
        expect(relution).toBeGreaterThan(0); // moins d'actions, même bénéfice : le BPA monte mécaniquement
        expect(capiAp).toBeCloseTo(N * P - montant, 1); // le cash est sorti : la valeur n'apparaît pas par magie
      }
    });

    it('ipo-pricing : a) = n×prix, b) pop > 0, c) = n×(close−prix), e) = c) + d) — le coût complet de l\'IPO', () => {
      for (const seed of SEEDS) {
        const pb = moule('m3-pb-ipo-pricing').generate(seed, 0, 'en');
        const [levee, pop, mlott, fraisM, coutTot] = pb.sousQuestions.map(q => q.reponse);
        const prix = Number(/finally priced at €([\d.]+)/.exec(pb.contexte)![1]);
        const n = num(/([\d,]+) million shares are sold/.exec(pb.contexte)![1]);
        const close = num(/closes at €([\d,]+(?:\.\d+)?)/.exec(pb.contexte)![1]);
        const fee = Number(/fees run at ([\d.]+)%/.exec(pb.contexte)![1]);
        expect(levee).toBeCloseTo(n * prix, 1);
        expect(pop).toBeCloseTo((close / prix - 1) * 100, 1);
        expect(pop).toBeGreaterThan(0); // la décote d'introduction se paie le premier jour
        expect(mlott).toBeCloseTo(n * (close - prix), 1);
        expect(fraisM).toBeCloseTo((n * prix * fee) / 100, 1);
        expect(coutTot).toBeCloseTo(mlott + fraisM, 1); // money left + frais : la vraie facture
      }
    });

    it('greenshoe : a) = 15 % de l\'offre, b) = a)×(P−Pd) en baisse, c) = a)×P en hausse, d) = n×P + c)', () => {
      for (const seed of SEEDS) {
        const pb = moule('m3-pb-greenshoe').generate(seed, 0, 'en');
        const [surAlloc, profitBaisse, leveeSupp, leveeTotale] = pb.sousQuestions.map(q => q.reponse);
        const m = /([\d,]+) million shares at €([\d,]+(?:\.\d+)?) with a 15% over-allotment/.exec(pb.contexte)!;
        const n = num(m[1]);
        const P = num(m[2]);
        const Pd = num(/slips to €([\d,]+(?:\.\d+)?)/.exec(pb.contexte)![1]);
        const s = 0.15 * n;
        expect(surAlloc).toBeCloseTo(s, 2);
        expect(profitBaisse).toBeCloseTo(s * (P - Pd), 1); // le syndicat rachète sous son prix de vente
        expect(profitBaisse).toBeGreaterThan(0); // …et gagne dans le scénario de baisse
        expect(leveeSupp).toBeCloseTo(s * P, 1); // en hausse : l'émetteur lève 15 % de plus
        expect(leveeTotale).toBeCloseTo(n * P + leveeSupp, 1); // dans les deux cas, la banque est couverte
      }
    });

    it('short-couvert : d) = a) − b) − c) = pnlVenteADecouvert − dividende, b) recoupé Exact/360, e) le point mort', () => {
      for (const seed of SEEDS) {
        const pb = moule('m3-pb-short-couvert').generate(seed, 0, 'en');
        const [brut, fraisE, divDu, net, seuil] = pb.sousQuestions.map(q => q.reponse);
        const m = /shorts ([\d,]+) shares at €([\d,]+(?:\.\d+)?)/.exec(pb.contexte)!;
        const q = num(m[1]);
        const Pv = num(m[2]);
        const j = Number(/(\d+) days later at €/.exec(pb.contexte)![1]);
        const Pr = num(/days later at €([\d,]+(?:\.\d+)?)/.exec(pb.contexte)![1]);
        const fEmp = Number(/borrow fee of ([\d.]+)%/.exec(pb.contexte)![1]);
        const D = Number(/dividend of €([\d,]+(?:\.\d+)?)/.exec(pb.contexte)![1]);
        expect(brut).toBeCloseTo((Pv - Pr) * q, 1);
        expect(fraisE).toBeCloseTo(coutEmprunTitres(Pv * q, fEmp, j), 1);
        expect(divDu).toBeCloseTo(q * D, 1);
        expect(net).toBeCloseTo(pnlVenteADecouvert(Pv, Pr, q, fEmp, j) - q * D, 1);
        expect(net).toBeCloseTo(brut - fraisE - divDu, 1); // les deux routes se recoupent
        expect(net).toBeGreaterThan(0);
        expect(net).toBeLessThan(brut); // le coût caché mord toujours
        expect(seuil).toBeCloseTo(((coutEmprunTitres(Pv * q, fEmp, j) + q * D) / (q * Pv)) * 100, 1);
      }
    });

    it('dcf-complet-sensibilites : la cellule centrale de la matrice = la valeur de base, d) < c) < e), f) = largeur', () => {
      for (const seed of SEEDS) {
        const pb = moule('m3-pb-dcf-complet-sensibilites').generate(seed, 0, 'en');
        const [vt, ev, vpaBase, vpaPess, vpaOpt, fourchette] = pb.sousQuestions.map(q => q.reponse);
        const m = /free cash flows of €([\d,]+) million, €([\d,]+) million and €([\d,]+) million/.exec(pb.contexte)!;
        const fcfs = [num(m[1]), num(m[2]), num(m[3])];
        const r = Number(/WACC of ([\d.]+)%/.exec(pb.contexte)![1]);
        const g = Number(/perpetual growth of ([\d.]+)%/.exec(pb.contexte)![1]);
        const dette = num(/net debt of €([\d,]+) million/.exec(pb.contexte)![1]);
        const nb = num(/([\d,]+) million shares/.exec(pb.contexte)![1]);
        const vtCalc = valeurTerminaleGordon(fcfs[2], g, r);
        expect(vt).toBeCloseTo(vtCalc, 1);
        const evCalc = dcfSimple(fcfs, r, vtCalc);
        expect(ev).toBeCloseTo(evCalc, 1);
        expect(vpaBase).toBeCloseTo((evCalc - dette) / nb, 1); // LA cellule centrale : le cas de base
        const cellule = (rr: number, gg: number) =>
          (dcfSimple(fcfs, rr, valeurTerminaleGordon(fcfs[2], gg, rr)) - dette) / nb;
        expect(vpaPess).toBeCloseTo(cellule(r + 0.5, g - 0.5), 1);
        expect(vpaOpt).toBeCloseTo(cellule(r - 0.5, g + 0.5), 1);
        expect(vpaPess).toBeLessThan(vpaBase);
        expect(vpaOpt).toBeGreaterThan(vpaBase);
        expect(fourchette).toBeCloseTo(((vpaOpt - vpaPess) / vpaBase) * 100, 1);
      }
    });

    it('valorisation-croisee : Gordon recalculé, b) = a)/BPA (le PER implicite), e) = écart max−min de la triangulation', () => {
      for (const seed of SEEDS) {
        const pb = moule('m3-pb-valorisation-croisee').generate(seed, 0, 'en');
        const [vGordon, perImp, vPer, vEv, spread] = pb.sousQuestions.map(q => q.reponse);
        const eps = Number(/EPS of €([\d,]+(?:\.\d+)?)/.exec(pb.contexte)![1]);
        const payout = Number(/payout of (\d+)%/.exec(pb.contexte)![1]);
        const g = Number(/growth of ([\d.]+)%/.exec(pb.contexte)![1]);
        const r = Number(/required return of ([\d.]+)%/.exec(pb.contexte)![1]);
        const persect = Number(/peers trade at ([\d.]+) times/.exec(pb.contexte)![1]);
        const ebps = Number(/EBITDA of €([\d,]+(?:\.\d+)?) per share/.exec(pb.contexte)![1]);
        const dnet = Number(/net debt of €([\d,]+(?:\.\d+)?) per share/.exec(pb.contexte)![1]);
        const mult = Number(/EV\/EBITDA of ([\d.]+)x/.exec(pb.contexte)![1]);
        const vG = gordon(((eps * payout) / 100) * (1 + g / 100), r, g);
        expect(vGordon).toBeCloseTo(vG, 1);
        expect(perImp).toBeCloseTo(vG / eps, 1); // le multiple est un DCF compressé
        expect(vPer).toBeCloseTo(persect * eps, 1);
        expect(vEv).toBeCloseTo(mult * ebps - dnet, 1);
        const vals = [vG, persect * eps, mult * ebps - dnet];
        expect(spread).toBeCloseTo(((Math.max(...vals) - Math.min(...vals)) / Math.min(...vals)) * 100, 1);
      }
    });

    it('short-squeeze : a) l\'encours peut dépasser le flottant, c) l\'appel de marge, d) le prix de capitulation > P1, e) days-to-cover', () => {
      for (const seed of SEEDS) {
        const pb = moule('m3-pb-short-squeeze').generate(seed, 0, 'en');
        const [encours, perte, appel, pStar, dtc] = pb.sousQuestions.map(q => q.reponse);
        const F = num(/float counts ([\d,]+) million shares/.exec(pb.contexte)![1]);
        const SI = Number(/short interest reaches (\d+)%/.exec(pb.contexte)![1]);
        const m = /short ([\d.]+) million shares sold at €([\d,]+(?:\.\d+)?)/.exec(pb.contexte)!;
        const q = Number(m[1]);
        const P0 = num(m[2]);
        const P1 = num(/spikes to €([\d,]+(?:\.\d+)?)/.exec(pb.contexte)![1]);
        const C = num(/raise at most €([\d,]+) million/.exec(pb.contexte)![1]);
        const V = num(/volume runs at ([\d,]+) million shares/.exec(pb.contexte)![1]);
        expect(encours).toBeCloseTo((F * SI) / 100, 1);
        if (SI > 100) expect(encours).toBeGreaterThan(F); // la chaîne de réemprunt compte double
        expect(perte).toBeCloseTo(q * (P1 - P0), 1);
        expect(appel).toBeCloseTo(1.3 * q * P1 - 1.5 * q * P0, 1);
        expect(appel).toBeGreaterThan(0); // la hausse force à remettre du cash
        expect(1.3 * q * pStar).toBeCloseTo(1.5 * q * P0 + C, 0); // au prix de capitulation, le collatéral est épuisé
        expect(pStar).toBeGreaterThan(P1); // le fonds tient encore… jusqu'à pStar
        expect(dtc).toBeCloseTo(encours / V, 1);
      }
    });

    it('dilution-relution : BPA pro forma recalculé, relutif ssi PER payé < PER de l\'acquéreur (le critère du banquier)', () => {
      for (const seed of SEEDS) {
        const pb = moule('m3-pb-dilution-relution').generate(seed, 0, 'en');
        const [bpaAv, prixPaye, nNew, bpaPro, relution, ecartPer] = pb.sousQuestions.map(q => q.reponse);
        const a = /acquirer earns €([\d,]+) million with ([\d,]+) million shares and trades at ([\d.]+) times/.exec(pb.contexte)!;
        const Ba = num(a[1]);
        const Na = num(a[2]);
        const perA = Number(a[3]);
        const b = /target earns €([\d,]+) million and is paid ([\d.]+) times/.exec(pb.contexte)!;
        const Bb = num(b[1]);
        const perB = Number(b[2]);
        expect(bpaAv).toBeCloseTo(Ba / Na, 2);
        expect(prixPaye).toBeCloseTo(perB * Bb, 1);
        const Pa = (perA * Ba) / Na;
        const nN = (perB * Bb) / Pa;
        expect(nNew).toBeCloseTo(nN, 2);
        const pro = (Ba + Bb) / (Na + nN);
        expect(bpaPro).toBeCloseTo(pro, 2);
        expect(relution).toBeCloseTo((pro / (Ba / Na) - 1) * 100, 1);
        expect(relution > 0).toBe(perB < perA); // LE critère : relutif ssi on paie un PER plus bas que le sien
        expect(ecartPer).toBeCloseTo(perA - perB, 2);
      }
    });

    it('index-rebalancing : a) flux = AUM×poids, b) jours de volume, c) impact en √, d) gain du front-runner, e) coût des fonds', () => {
      for (const seed of SEEDS) {
        const pb = moule('m3-pb-index-rebalancing').generate(seed, 0, 'en');
        const [flux, jours, impact, gain, coutFonds] = pb.sousQuestions.map(q => q.reponse);
        const T = num(/€([\d,]+) billion of index money/.exec(pb.contexte)![1]);
        const w = Number(/will weigh ([\d.]+)%/.exec(pb.contexte)![1]);
        const V = num(/trades €([\d,]+) million a day/.exec(pb.contexte)![1]);
        const theta = Number(/scaled at ([\d.]+)%/.exec(pb.contexte)![1]);
        const pos = num(/a €([\d,]+) million position/.exec(pb.contexte)![1]);
        const fCapt = Number(/capturing (\d+)%/.exec(pb.contexte)![1]);
        const fluxCalc = 10 * T * w; // T Md€ × w % → M€
        expect(flux).toBeCloseTo(fluxCalc, 1);
        const joursCalc = fluxCalc / V;
        expect(jours).toBeCloseTo(joursCalc, 1);
        const impactCalc = theta * Math.sqrt(joursCalc);
        expect(impact).toBeCloseTo(impactCalc, 1); // la règle en racine : l'impact croît moins vite que la taille
        expect(gain).toBeCloseTo((pos * impactCalc * fCapt) / 10, 1); // M€ × % × % → k€
        expect(coutFonds).toBeCloseTo((fluxCalc * impactCalc) / 100, 1); // les fonds indiciels paient l'impact
      }
    });

    it('efficience-anomalie : frictions m1, t-stat m2 recoupée via statT, le verdict = marge de la t-stat nette sur 1,96', () => {
      for (const seed of SEEDS) {
        const pb = moule('m3-pb-efficience-anomalie').generate(seed, 0, 'en');
        const [drag, netM, netAnn, tBrut, tNet, marge] = pb.sousQuestions.map(q => q.reponse);
        const mBrut = Number(/gross excess return of ([\d.]+)% a month/.exec(pb.contexte)![1]);
        const m = /standard deviation of ([\d.]+)% over (\d+) months/.exec(pb.contexte)!;
        const sigma = Number(m[1]);
        const n = Number(m[2]);
        const tau = Number(/turns over (\d+)% a month/.exec(pb.contexte)![1]);
        const cbps = Number(/costs (\d+) basis points/.exec(pb.contexte)![1]);
        const dragCalc = (tau * cbps) / 10000; // τ % × c bps → % mensuel
        expect(Math.abs(drag - dragCalc)).toBeLessThanOrEqual(0.0051);
        const netCalc = mBrut - dragCalc;
        expect(Math.abs(netM - netCalc)).toBeLessThanOrEqual(0.0051);
        expect(netAnn).toBeCloseTo(((1 + netCalc / 100) ** 12 - 1) * 100, 1);
        expect(tBrut).toBeCloseTo(statT(mBrut, 0, sigma, n), 1); // recoupé via le statT du module 2
        expect(tNet).toBeCloseTo(statT(netCalc, 0, sigma, n), 1);
        expect(tBrut).toBeGreaterThan(tNet); // les frictions rabotent la significativité
        expect(marge).toBeCloseTo(statT(netCalc, 0, sigma, n) - 1.96, 1); // l'anomalie survit ssi marge > 0
      }
    });
  });
});
