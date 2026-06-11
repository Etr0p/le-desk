/**
 * Invariants et justesse des 13 générateurs d'application du module 3
 * (Actions & indices).
 *
 * Deux familles de tests (patron du module 2) :
 * 1. Invariants : validité (réponse/tolérance finies, ≥ 2 étapes, pas de undefined/NaN),
 *    variation (≥ 3 réponses distinctes sur 5 seeds), déterminisme, et invariants
 *    BILINGUES : même seed ⇒ même réponse / même tolérance en FR et EN, textes distincts.
 * 2. Justesse : pour le seed fixe 42, chaque test REJOUE les tirages du moule avec
 *    mulberry32(seed) (l'ordre des tirages est documenté en commentaire « Tirages
 *    (ordre strict) » dans exercises.ts) puis recoupe la réponse avec un calcul
 *    direct via calculs.ts.
 */
import { describe, expect, it } from 'vitest';
import { mulberry32, pick, randFloat, randInt } from '../../../engine/rng';
import {
  ajustementSplit,
  bpa,
  coutEmprunTitres,
  dcfSimple,
  ddmDeuxEtapes,
  evSurEbitda,
  gordon,
  indiceCapiPonderee,
  per,
  pnlVenteADecouvert,
  poidsDansIndice,
  prixTheoriqueExDividende,
  rendementDividende,
  tauxDistribution,
  valeurDroitSouscription,
  valeurTerminaleGordon,
  type ConstituantIndice,
} from './calculs';
import { exercices } from './exercises';

const r2 = (v: number) => Math.round(v * 100) / 100;

const parId = (id: string) => {
  const g = exercices.find((x) => x.id === id);
  if (!g) throw new Error(`générateur manquant : ${id}`);
  return g;
};

/** Les 13 moules du plan, avec leur niveau de difficulté. */
const MOULES_ATTENDUS: Record<string, number> = {
  'm3-app-gordon': 1,
  'm3-app-gordon-croissance': 2,
  'm3-app-ddm-deux-etapes': 3,
  'm3-app-dcf-vt': 3,
  'm3-app-per': 1,
  'm3-app-bpa-per-prix': 2,
  'm3-app-ev-ebitda': 2,
  'm3-app-rendement-payout': 2,
  'm3-app-ex-dividende': 1,
  'm3-app-split': 1,
  'm3-app-dps': 3,
  'm3-app-poids-indice': 2,
  'm3-app-short-pnl': 2,
};

describe('générateurs module 3 — invariants', () => {
  it('le module expose au moins 13 générateurs aux ids uniques', () => {
    expect(exercices.length).toBeGreaterThanOrEqual(13);
    expect(new Set(exercices.map((g) => g.id)).size).toBe(exercices.length);
    for (const g of exercices) expect(g.moduleId).toBe('03-actions-indices');
  });

  it('les 13 moules du plan sont présents, au bon niveau de difficulté', () => {
    const ids = exercices.map((g) => g.id);
    for (const [id, difficulte] of Object.entries(MOULES_ATTENDUS)) {
      expect(ids).toContain(id);
      expect(parId(id).difficulte).toBe(difficulte);
    }
  });

  for (const g of exercices) {
    describe(g.id, () => {
      it('produit des exercices valides et variés', () => {
        const reponses = new Set<number>();
        for (const seed of [1, 2, 3, 4, 5]) {
          const ex = g.generate(seed);
          expect(Number.isFinite(ex.reponse)).toBe(true);
          expect(Number.isFinite(ex.tolerance)).toBe(true);
          expect(ex.etapes.length).toBeGreaterThanOrEqual(2);
          expect(ex.enonce).not.toMatch(/undefined|NaN|null/);
          for (const e of ex.etapes) {
            expect(e.titre).not.toMatch(/undefined|NaN/);
            expect(e.contenu).not.toMatch(/undefined|NaN/);
          }
          for (const p of ex.pieges ?? []) expect(p).not.toMatch(/undefined|NaN/);
          reponses.add(ex.reponse);
        }
        expect(reponses.size).toBeGreaterThanOrEqual(3); // ça varie vraiment
        expect(g.generate(7)).toEqual(g.generate(7)); // déterminisme
      });

      it('est rigoureusement bilingue', () => {
        const fr = g.generate(11, 'fr');
        const en = g.generate(11, 'en');
        // Invariant absolu : la langue ne change ni les nombres ni la correction.
        expect(en.reponse).toBe(fr.reponse);
        expect(en.tolerance).toBe(fr.tolerance);
        expect(en.toleranceMode).toBe(fr.toleranceMode);
        // Mais les textes sont bien traduits, pas recopiés.
        expect(en.enonce).not.toBe(fr.enonce);
        expect(en.enonce).not.toMatch(/undefined|NaN/);
        expect(en.etapes.length).toBe(fr.etapes.length);
        for (let i = 0; i < en.etapes.length; i++) {
          expect(en.etapes[i].titre).not.toMatch(/undefined|NaN/);
          expect(en.etapes[i].contenu).not.toMatch(/undefined|NaN/);
          expect(en.etapes[i].contenu).not.toBe(fr.etapes[i].contenu);
        }
        expect((en.pieges ?? []).length).toBe((fr.pieges ?? []).length);
        for (const p of en.pieges ?? []) expect(p).not.toMatch(/undefined|NaN/);
        // Le titre du générateur est traduit lui aussi.
        expect(g.titreEn).toBeTruthy();
        expect(g.titreEn).not.toBe(g.titre);
        // Même seed ⇒ même réponse quelle que soit la langue, sur plusieurs seeds.
        for (const seed of [1, 2, 3, 4, 5]) {
          expect(g.generate(seed, 'en').reponse).toBe(g.generate(seed, 'fr').reponse);
          expect(g.generate(seed, 'en').tolerance).toBe(g.generate(seed, 'fr').tolerance);
        }
      });

      it('generate sans langue = sortie française (rétrocompatibilité)', () => {
        expect(g.generate(7)).toEqual(g.generate(7, 'fr'));
      });
    });
  }
});

// ---------------------------------------------------------------------------
// Justesse : pour le seed fixe ci-dessous, on rejoue les tirages de chaque moule
// dans le MÊME ordre (documenté en commentaire « Tirages » du moule), puis on
// recoupe la réponse avec le calcul direct via calculs.ts.
// ---------------------------------------------------------------------------
const SEED = 42;

describe('justesse des réponses — recoupement direct via calculs.ts', () => {
  it('m3-app-gordon : P0 = gordon(D0 × (1+g), r, g), zone saine r − g ≥ 1,5 pt', () => {
    // Tirages : 1. d0 = randFloat(1, 6, 2) · 2. g = randFloat(0.5, 5, 1)
    // · 3. ecart = randFloat(1.5, 5, 1). r = r2(g + ecart) ; D1 = d0 × (1 + g/100).
    const rng = mulberry32(SEED);
    const d0 = randFloat(rng, 1, 6, 2);
    const g = randFloat(rng, 0.5, 5, 1);
    const ecart = randFloat(rng, 1.5, 5, 1);
    const r = r2(g + ecart);
    expect(ecart).toBeGreaterThanOrEqual(1.5); // zone saine par construction
    expect(parId('m3-app-gordon').generate(SEED).reponse).toBe(
      r2(gordon(d0 * (1 + g / 100), r, g)),
    );
  });

  it('m3-app-gordon : jamais de throw (r > g garanti) sur les seeds 1 à 50', () => {
    for (let seed = 1; seed <= 50; seed++) {
      expect(() => parId('m3-app-gordon').generate(seed)).not.toThrow();
    }
  });

  it('m3-app-gordon-croissance : réponse = gordon(d1, r, g) − gordon(d1, r, 0) > 0', () => {
    // Tirages : 1. d1 = randFloat(1.5, 6, 2) · 2. g = randFloat(1, 4, 1)
    // · 3. ecart = randFloat(2, 6, 1). r = r2(g + ecart).
    const rng = mulberry32(SEED);
    const d1 = randFloat(rng, 1.5, 6, 2);
    const g = randFloat(rng, 1, 4, 1);
    const ecart = randFloat(rng, 2, 6, 1);
    const r = r2(g + ecart);
    const reponse = parId('m3-app-gordon-croissance').generate(SEED).reponse;
    expect(reponse).toBe(r2(gordon(d1, r, g) - gordon(d1, r, 0)));
    expect(reponse).toBeGreaterThan(0); // la croissance vaut toujours quelque chose
  });

  it('m3-app-ddm-deux-etapes : P0 = ddmDeuxEtapes(d0, g1, n1, g2, r), recoupé par décomposition', () => {
    // Tirages : 1. d0 = randFloat(1, 4, 2) · 2. g1 = randInt(8, 15) · 3. n1 = randInt(2, 4)
    // · 4. g2 = randFloat(1.5, 3, 1) · 5. r = randFloat(7, 11, 1).
    const rng = mulberry32(SEED);
    const d0 = randFloat(rng, 1, 4, 2);
    const g1 = randInt(rng, 8, 15);
    const n1 = randInt(rng, 2, 4);
    const g2 = randFloat(rng, 1.5, 3, 1);
    const r = randFloat(rng, 7, 11, 1);
    const reponse = parId('m3-app-ddm-deux-etapes').generate(SEED).reponse;
    expect(reponse).toBe(r2(ddmDeuxEtapes(d0, g1, n1, g2, r)));
    // Contre-vérification par décomposition : VA des dividendes + VA de la VT Gordon.
    let div = d0;
    let vaDivs = 0;
    for (let t = 1; t <= n1; t++) {
      div *= 1 + g1 / 100;
      vaDivs += div / (1 + r / 100) ** t;
    }
    const vaVT = valeurTerminaleGordon(div, g2, r) / (1 + r / 100) ** n1;
    expect(reponse).toBeCloseTo(vaDivs + vaVT, 2);
  });

  it('m3-app-dcf-vt : valeur = dcfSimple(fcfs, r, vt) = VA(FCF) + VA(VT)', () => {
    // Tirages : 1. fcf1 = randInt(40, 120) · 2. g = randInt(3, 8) · 3. n = randInt(3, 5)
    // · 4. r = randFloat(7, 12, 1) · 5. vtC = randInt(10, 25) (vt = vtC × 100).
    // fcfs[t] = r2(fcf1 × (1 + g/100)^t), t = 0..n−1.
    const rng = mulberry32(SEED);
    const fcf1 = randInt(rng, 40, 120);
    const g = randInt(rng, 3, 8);
    const n = randInt(rng, 3, 5);
    const r = randFloat(rng, 7, 12, 1);
    const vtC = randInt(rng, 10, 25);
    const vt = vtC * 100;
    const fcfs = Array.from({ length: n }, (_, t) => r2(fcf1 * (1 + g / 100) ** t));
    const reponse = parId('m3-app-dcf-vt').generate(SEED).reponse;
    expect(reponse).toBe(r2(dcfSimple(fcfs, r, vt)));
    // Contre-vérification croisée : la valeur se décompose en VA(FCF) + VA(VT).
    const zeros = fcfs.map(() => 0);
    expect(reponse).toBe(r2(dcfSimple(fcfs, r, 0) + dcfSimple(zeros, r, vt)));
  });

  it('m3-app-per : PER = per(prix, bpa)', () => {
    // Tirages : 1. bpaV = randFloat(2, 12, 2) · 2. perCible = randFloat(7, 30, 1).
    // prix = r2(bpaV × perCible).
    const rng = mulberry32(SEED);
    const bpaV = randFloat(rng, 2, 12, 2);
    const perCible = randFloat(rng, 7, 30, 1);
    const prix = r2(bpaV * perCible);
    const reponse = parId('m3-app-per').generate(SEED).reponse;
    expect(reponse).toBe(r2(per(prix, bpaV)));
    expect(reponse).toBeCloseTo(perCible, 1); // le prix a été construit pour ça
  });

  it('m3-app-bpa-per-prix : prix implicite = bpa(benef, nbActions) × PER sectoriel', () => {
    // Tirages : 1. nbActionsM = randInt(20, 200) · 2. bpaCible = randFloat(1, 10, 1)
    // · 3. perSect = randFloat(8, 25, 1). benefM = r2(nbActionsM × bpaCible).
    const rng = mulberry32(SEED);
    const nbActionsM = randInt(rng, 20, 200);
    const bpaCible = randFloat(rng, 1, 10, 1);
    const perSect = randFloat(rng, 8, 25, 1);
    const benefM = r2(nbActionsM * bpaCible);
    const reponse = parId('m3-app-bpa-per-prix').generate(SEED).reponse;
    expect(reponse).toBe(r2(bpa(benefM, nbActionsM) * perSect));
    // Contre-vérification croisée : le PER du prix implicite redonne le PER sectoriel.
    expect(per(reponse, bpa(benefM, nbActionsM))).toBeCloseTo(perSect, 2);
  });

  it('m3-app-ev-ebitda : multiple = evSurEbitda(capi, dette nette, EBITDA)', () => {
    // Tirages : 1. capiC = randInt(6, 40) (capi = capiC × 100) · 2. detteC = randInt(2, 20)
    // (dette = detteC × 50) · 3. mult = randFloat(4, 12, 1).
    // ebitda = Math.round((capi + dette)/mult).
    const rng = mulberry32(SEED);
    const capiC = randInt(rng, 6, 40);
    const detteC = randInt(rng, 2, 20);
    const mult = randFloat(rng, 4, 12, 1);
    const capi = capiC * 100;
    const detteNette = detteC * 50;
    const ebitda = Math.round((capi + detteNette) / mult);
    const reponse = parId('m3-app-ev-ebitda').generate(SEED).reponse;
    expect(reponse).toBe(r2(evSurEbitda(capi, detteNette, ebitda)));
    // Le piège « capi/EBITDA » donne forcément moins (la dette nette est positive ici).
    expect(evSurEbitda(capi, 0, ebitda)).toBeLessThan(reponse);
  });

  it('m3-app-rendement-payout : rendement = rendementDividende(div, prix), payout cohérent', () => {
    // Tirages : 1. prix = randInt(20, 150) · 2. rdtCible = randFloat(1, 6, 1)
    // · 3. payoutCible = randInt(25, 75). div = r2(prix × rdtCible/100) ;
    // bpaV = r2(div × 100/payoutCible).
    const rng = mulberry32(SEED);
    const prix = randInt(rng, 20, 150);
    const rdtCible = randFloat(rng, 1, 6, 1);
    const payoutCible = randInt(rng, 25, 75);
    const div = r2((prix * rdtCible) / 100);
    const bpaV = r2((div * 100) / payoutCible);
    const reponse = parId('m3-app-rendement-payout').generate(SEED).reponse;
    expect(reponse).toBe(r2(rendementDividende(div, prix)));
    // Identité de contrôle : rendement = payout / PER (exacte, les arrondis se compensent).
    expect(reponse).toBeCloseTo(tauxDistribution(div, bpaV) / per(prix, bpaV), 2);
  });

  it('m3-app-ex-dividende : prix ex = prixTheoriqueExDividende(prix, dividende)', () => {
    // Tirages : 1. prix = randFloat(20, 150, 1) · 2. div = randFloat(0.5, 5, 2).
    const rng = mulberry32(SEED);
    const prix = randFloat(rng, 20, 150, 1);
    const div = randFloat(rng, 0.5, 5, 2);
    expect(parId('m3-app-ex-dividende').generate(SEED).reponse).toBe(
      r2(prixTheoriqueExDividende(prix, div)),
    );
  });

  it('m3-app-split : prix post-split = ajustementSplit(prix, ratio), capi inchangée', () => {
    // Tirages : 1. ratio = pick([2, 3, 4, 5, 10]) · 2. prixU = randInt(30, 180)
    // (prix = prixU × ratio, divisible exactement) · 3. nbActionsM = randInt(10, 200).
    const rng = mulberry32(SEED);
    const ratio = pick(rng, [2, 3, 4, 5, 10] as const);
    const prixU = randInt(rng, 30, 180);
    const nbActionsM = randInt(rng, 10, 200);
    const prix = prixU * ratio;
    const reponse = parId('m3-app-split').generate(SEED).reponse;
    expect(reponse).toBe(r2(ajustementSplit(prix, ratio)));
    // La capitalisation est rigoureusement inchangée (prix construit divisible).
    expect(reponse * nbActionsM * ratio).toBeCloseTo(prix * nbActionsM, 9);
  });

  it('m3-app-dps : droit = valeurDroitSouscription(cote, émission, droits), TERP cohérent', () => {
    // Tirages : 1. prixCote = randInt(30, 120) · 2. decote = randInt(15, 40)
    // · 3. nbDroits = randInt(2, 8). prixEmission = r2(prixCote × (100 − decote)/100).
    const rng = mulberry32(SEED);
    const prixCote = randInt(rng, 30, 120);
    const decote = randInt(rng, 15, 40);
    const nbDroits = randInt(rng, 2, 8);
    const prixEmission = r2((prixCote * (100 - decote)) / 100);
    const reponse = parId('m3-app-dps').generate(SEED).reponse;
    expect(reponse).toBe(r2(valeurDroitSouscription(prixCote, prixEmission, nbDroits)));
    // Contre-vérification par le panier : TERP = (n × cote + émission)/(n + 1),
    // et le droit vaut exactement cote − TERP (les deux routes concordent).
    const terp = (nbDroits * prixCote + prixEmission) / (nbDroits + 1);
    expect(valeurDroitSouscription(prixCote, prixEmission, nbDroits)).toBeCloseTo(
      prixCote - terp,
      9,
    );
  });

  it('m3-app-poids-indice : poids = poidsDansIndice(constituants)[cible], somme = 100', () => {
    // Tirages : 1. nb = randInt(3, 4) · 2. pour chaque constituant i (i = 0..nb−1), dans
    // cet ordre : prix = randInt(10, 200), titresM = randInt(5, 100),
    // flottant = pick([40, 50, 60, 70, 80, 90, 100]) · 3. cible = randInt(0, nb − 1).
    const rng = mulberry32(SEED);
    const nb = randInt(rng, 3, 4);
    const constituants: ConstituantIndice[] = [];
    for (let i = 0; i < nb; i++) {
      const prix = randInt(rng, 10, 200);
      const titresM = randInt(rng, 5, 100);
      const flottant = pick(rng, [40, 50, 60, 70, 80, 90, 100] as const);
      constituants.push({ prix, nbTitres: titresM, flottantPct: flottant });
    }
    const cible = randInt(rng, 0, nb - 1);
    const reponse = parId('m3-app-poids-indice').generate(SEED).reponse;
    expect(reponse).toBe(r2(poidsDansIndice(constituants)[cible]));
    // Contre-vérification par le ratio direct capi flottante cible / capi flottante totale.
    const c = constituants[cible];
    const capiCible = c.prix * c.nbTitres * (c.flottantPct / 100);
    expect(reponse).toBeCloseTo((capiCible / indiceCapiPonderee(constituants)) * 100, 2);
    // Les poids somment à 100 %.
    expect(poidsDansIndice(constituants).reduce((a, b) => a + b, 0)).toBeCloseTo(100, 9);
  });

  it('m3-app-short-pnl : P&L net = pnlVenteADecouvert(...) = brut − coutEmprunTitres', () => {
    // Tirages : 1. prixVente = randInt(20, 120) · 2. sens = pick(['gain', 'perte'])
    // · 3. mouvPct = randFloat(3, 15, 1) · 4. qC = randInt(1, 20) (quantite = qC × 100)
    // · 5. frais = randFloat(0.5, 4, 1) · 6. jours = pick([30, 45, 60, 90, 180]).
    // prixRachat = r2(prixVente × (1 ± mouvPct/100)) : − si gain, + si perte.
    const rng = mulberry32(SEED);
    const prixVente = randInt(rng, 20, 120);
    const sens = pick(rng, ['gain', 'perte'] as const);
    const mouvPct = randFloat(rng, 3, 15, 1);
    const qC = randInt(rng, 1, 20);
    const frais = randFloat(rng, 0.5, 4, 1);
    const jours = pick(rng, [30, 45, 60, 90, 180] as const);
    const quantite = qC * 100;
    const prixRachat = r2(prixVente * (1 + ((sens === 'perte' ? 1 : -1) * mouvPct) / 100));
    const reponse = parId('m3-app-short-pnl').generate(SEED).reponse;
    expect(reponse).toBe(r2(pnlVenteADecouvert(prixVente, prixRachat, quantite, frais, jours)));
    // Contre-vérification croisée : net = brut − frais d'emprunt sur le notionnel vendu.
    const brut = (prixVente - prixRachat) * quantite;
    expect(reponse).toBe(r2(brut - coutEmprunTitres(prixVente * quantite, frais, jours)));
    // Le signe du P&L suit le sens tiré : les frais ne peuvent pas le retourner
    // (mouvement ≥ 3 % du notionnel, frais ≤ 4 % × 180/360 = 2 %).
    expect(Math.sign(reponse)).toBe(sens === 'gain' ? 1 : -1);
  });

  it('m3-app-short-pnl : les deux signes (gain ET perte) apparaissent sur les seeds 1 à 30', () => {
    const signes = new Set<number>();
    for (let seed = 1; seed <= 30; seed++) {
      signes.add(Math.sign(parId('m3-app-short-pnl').generate(seed).reponse));
    }
    expect(signes.has(1)).toBe(true);
    expect(signes.has(-1)).toBe(true);
  });
});
