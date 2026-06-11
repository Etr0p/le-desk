/**
 * Invariants et justesse des 7 générateurs d'application du module 1.
 *
 * Deux familles de tests (patron du module 2) :
 * 1. Invariants : validité (réponse/tolérance finies, ≥ 2 étapes, pas de undefined/NaN),
 *    variation (≥ 3 réponses distinctes sur 5 seeds), déterminisme, et invariants
 *    BILINGUES : même seed ⇒ même réponse / même tolérance en FR et EN, textes distincts.
 * 2. Justesse : pour un seed fixe, chaque test REJOUE les tirages du moule avec
 *    mulberry32(seed) (l'ordre des tirages est documenté en commentaire « Tirages »
 *    dans exercises.ts) puis recoupe la réponse avec un calcul direct via calculs.ts.
 *
 * Spécifique au module : m1-app-commission doit faire apparaître les DEUX régimes
 * (minimum qui mord / part proportionnelle qui l'emporte) sur les seeds 1 à 30.
 */
import { describe, expect, it } from 'vitest';
import { mulberry32, pick, randInt } from '../../../engine/rng';
import {
  commissionTotale,
  coutTraverseeSpread,
  executionCarnet,
  milieuFourchette,
  pnlMarketMaker,
  slippage,
  spreadAbsolu,
  spreadPb,
} from './calculs';
import { exercices } from './exercises';

const r2 = (v: number) => Math.round(v * 100) / 100;

const parId = (id: string) => {
  const g = exercices.find((x) => x.id === id);
  if (!g) throw new Error(`générateur manquant : ${id}`);
  return g;
};

/** Les 7 moules du plan, avec leur niveau de difficulté. */
const MOULES_ATTENDUS: Record<string, number> = {
  'm1-app-spread-pb': 1,
  'm1-app-cout-traversee': 1,
  'm1-app-marcher-carnet': 2,
  'm1-app-slippage': 2,
  'm1-app-pnl-market-maker': 2,
  'm1-app-commission': 1,
  'm1-app-cout-total-execution': 3,
};

describe('générateurs module 1 — invariants', () => {
  it('le module expose au moins 7 générateurs aux ids uniques', () => {
    expect(exercices.length).toBeGreaterThanOrEqual(7);
    expect(new Set(exercices.map((g) => g.id)).size).toBe(exercices.length);
    for (const g of exercices) expect(g.moduleId).toBe('01-panorama-marches');
  });

  it('les 7 moules du plan sont présents, au bon niveau de difficulté', () => {
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
// Rejoue des tirages partagés par plusieurs moules (mêmes ordres stricts que
// dans exercises.ts) — voir les commentaires « Tirages » de chaque moule.
// ---------------------------------------------------------------------------

/** Tirages de m1-app-marcher-carnet : carnet à la vente seul (sans bid). */
function tiragesMarcherCarnet(seed: number) {
  // Tirages : 1. prixBase = randInt(20, 200) · 2. askCents = randInt(5, 95)
  // · 3. tickCents = pick([5, 10, 20]) · 4. t1c = randInt(2, 6) · 5. t2c = randInt(2, 6)
  // · 6. t3c = randInt(3, 8) · 7. qExtraC = randInt(1, t2c + t3c − 1).
  const rng = mulberry32(seed);
  const prixBase = randInt(rng, 20, 200);
  const askCents = randInt(rng, 5, 95);
  const tickCents = pick(rng, [5, 10, 20] as const);
  const t1c = randInt(rng, 2, 6);
  const t2c = randInt(rng, 2, 6);
  const t3c = randInt(rng, 3, 8);
  const qExtraC = randInt(rng, 1, t2c + t3c - 1);
  const niveaux = [
    { prix: prixBase + askCents / 100, taille: t1c * 100 },
    { prix: prixBase + (askCents + tickCents) / 100, taille: t2c * 100 },
    { prix: prixBase + (askCents + 2 * tickCents) / 100, taille: t3c * 100 },
  ];
  return { niveaux, quantite: (t1c + qExtraC) * 100 };
}

/** Tirages communs à m1-app-slippage et m1-app-cout-total-execution (fourchette + carnet). */
function tiragesFourchetteCarnet(seed: number) {
  // Tirages : 1. prixBase = randInt(20, 200) · 2. demiCents = randInt(2, 10)
  // · 3. tickCents = pick([5, 10, 20]) · 4. t1c = randInt(2, 6) · 5. t2c = randInt(2, 6)
  // · 6. t3c = randInt(3, 8) · 7. qExtraC = randInt(1, t2c + t3c − 1).
  const rng = mulberry32(seed);
  const prixBase = randInt(rng, 20, 200);
  const demiCents = randInt(rng, 2, 10);
  const tickCents = pick(rng, [5, 10, 20] as const);
  const t1c = randInt(rng, 2, 6);
  const t2c = randInt(rng, 2, 6);
  const t3c = randInt(rng, 3, 8);
  const qExtraC = randInt(rng, 1, t2c + t3c - 1);
  const bid = prixBase - demiCents / 100;
  const niveaux = [
    { prix: prixBase + demiCents / 100, taille: t1c * 100 },
    { prix: prixBase + (demiCents + tickCents) / 100, taille: t2c * 100 },
    { prix: prixBase + (demiCents + 2 * tickCents) / 100, taille: t3c * 100 },
  ];
  return { bid, ask1: niveaux[0].prix, niveaux, quantite: (t1c + qExtraC) * 100, rng };
}

/** Tirages de m1-app-commission (le régime est TIRÉ pour forcer l'alternance). */
function tiragesCommission(seed: number) {
  // Tirages : 1. regime = pick(['minimum', 'proportionnel']) · 2. tauxPb = pick([1, 2, 3, 5])
  // · 3. minimum = pick([15, 20, 25, 30]) · 4. notionnelK = randInt(borné selon le régime).
  const rng = mulberry32(seed);
  const regime = pick(rng, ['minimum', 'proportionnel'] as const);
  const tauxPb = pick(rng, [1, 2, 3, 5] as const);
  const minimum = pick(rng, [15, 20, 25, 30] as const);
  const seuilK = (minimum * 10) / tauxPb; // notionnel (en k€) où proportionnelle = minimum
  const notionnelK =
    regime === 'minimum'
      ? randInt(rng, 5, Math.floor(seuilK) - 5)
      : randInt(rng, Math.ceil(seuilK) + 10, Math.ceil(seuilK) + 400);
  return { regime, tauxPb, minimum, notionnel: notionnelK * 1000 };
}

// ---------------------------------------------------------------------------
// Justesse : pour le seed fixe ci-dessous, on rejoue les tirages de chaque moule
// dans le MÊME ordre (documenté en commentaire « Tirages » du moule), puis on
// recoupe la réponse avec le calcul direct via calculs.ts.
// ---------------------------------------------------------------------------
const SEED = 42;

describe('justesse des réponses — recoupement direct via calculs.ts', () => {
  it('m1-app-spread-pb : réponse = spreadPb(bid, ask)', () => {
    // Tirages : 1. prixBase = randInt(25, 250) · 2. demiCents = randInt(1, 25).
    // bid = prixBase − demiCents/100 ; ask = prixBase + demiCents/100.
    const rng = mulberry32(SEED);
    const prixBase = randInt(rng, 25, 250);
    const demiCents = randInt(rng, 1, 25);
    const bid = prixBase - demiCents / 100;
    const ask = prixBase + demiCents / 100;
    const reponse = parId('m1-app-spread-pb').generate(SEED).reponse;
    expect(reponse).toBe(r2(spreadPb(bid, ask)));
    // Contre-vérification : reconstruire pb = spread absolu / milieu × 10 000.
    expect(reponse).toBeCloseTo((spreadAbsolu(bid, ask) / milieuFourchette(bid, ask)) * 10_000, 2);
    expect(reponse).toBeGreaterThan(0);
  });

  it('m1-app-cout-traversee : réponse = coutTraverseeSpread(quantite, bid, ask, sens)', () => {
    // Tirages : 1. prixBase = randInt(25, 250) · 2. demiCents = randInt(2, 20)
    // · 3. qCent = randInt(2, 20) (quantite = qCent × 100) · 4. sens = pick(['achat', 'vente']).
    const rng = mulberry32(SEED);
    const prixBase = randInt(rng, 25, 250);
    const demiCents = randInt(rng, 2, 20);
    const qCent = randInt(rng, 2, 20);
    const sens = pick(rng, ['achat', 'vente'] as const);
    const bid = prixBase - demiCents / 100;
    const ask = prixBase + demiCents / 100;
    const quantite = qCent * 100;
    const reponse = parId('m1-app-cout-traversee').generate(SEED).reponse;
    expect(reponse).toBe(r2(coutTraverseeSpread(quantite, bid, ask, sens)));
    // Contre-vérification : chaque jambe paie la demi-fourchette, quel que soit le sens.
    expect(reponse).toBeCloseTo((quantite * spreadAbsolu(bid, ask)) / 2, 2);
  });

  it('m1-app-marcher-carnet : réponse = executionCarnet(quantite, niveaux).prixMoyen', () => {
    const { niveaux, quantite } = tiragesMarcherCarnet(SEED);
    const exec = executionCarnet(quantite, niveaux);
    const reponse = parId('m1-app-marcher-carnet').generate(SEED).reponse;
    expect(reponse).toBe(r2(exec.prixMoyen));
    // La construction garantit qu'on traverse 2 ou 3 niveaux, jamais 1, jamais au-delà.
    expect(exec.niveauxConsommes).toBeGreaterThanOrEqual(2);
    expect(exec.niveauxConsommes).toBeLessThanOrEqual(3);
    // Le prix moyen vit strictement entre le meilleur ask et le dernier niveau.
    expect(exec.prixMoyen).toBeGreaterThan(niveaux[0].prix);
    expect(exec.prixMoyen).toBeLessThan(niveaux[2].prix);
  });

  it('m1-app-slippage : réponse = quantite × slippage(prixMoyen, milieu, achat)', () => {
    const { bid, ask1, niveaux, quantite } = tiragesFourchetteCarnet(SEED);
    const milieu = milieuFourchette(bid, ask1);
    const exec = executionCarnet(quantite, niveaux);
    const total = quantite * slippage(exec.prixMoyen, milieu, 'achat');
    const reponse = parId('m1-app-slippage').generate(SEED).reponse;
    expect(reponse).toBe(r2(total));
    // Contre-vérification : décomposition demi-fourchette + profondeur (cohérente ch4).
    const demiFourchette = coutTraverseeSpread(quantite, bid, ask1, 'achat');
    const profondeur = quantite * slippage(exec.prixMoyen, ask1, 'achat');
    expect(reponse).toBeCloseTo(demiFourchette + profondeur, 2);
    expect(demiFourchette).toBeGreaterThan(0);
    expect(profondeur).toBeGreaterThan(0); // on traverse toujours ≥ 2 niveaux
  });

  it('m1-app-pnl-market-maker : réponse = pnlMarketMaker(nbAR, taille, spread, couverture)', () => {
    // Tirages : 1. nbAR = randInt(20, 80) · 2. tailleC = randInt(2, 10) (taille = tailleC × 100)
    // · 3. spreadCents = randInt(2, 10) · 4. couvCents = randInt(1, spreadCents − 1).
    const rng = mulberry32(SEED);
    const nbAR = randInt(rng, 20, 80);
    const tailleC = randInt(rng, 2, 10);
    const spreadCents = randInt(rng, 2, 10);
    const couvCents = randInt(rng, 1, spreadCents - 1);
    const reponse = parId('m1-app-pnl-market-maker').generate(SEED).reponse;
    expect(reponse).toBe(r2(pnlMarketMaker(nbAR, tailleC * 100, spreadCents / 100, couvCents / 100)));
    // Contre-vérification : brut − coût de couverture total, et marge nette positive.
    const brut = pnlMarketMaker(nbAR, tailleC * 100, spreadCents / 100, 0);
    const couvTotale = nbAR * tailleC * 100 * (couvCents / 100);
    expect(reponse).toBeCloseTo(brut - couvTotale, 2);
    expect(reponse).toBeGreaterThan(0); // couvCents < spreadCents par construction
  });

  it('m1-app-commission : réponse = commissionTotale(notionnel, tauxPb, minimum)', () => {
    const { notionnel, tauxPb, minimum } = tiragesCommission(SEED);
    const reponse = parId('m1-app-commission').generate(SEED).reponse;
    expect(reponse).toBe(r2(commissionTotale(notionnel, tauxPb, minimum)));
    // Contre-vérification : c'est bien max(proportionnelle, minimum).
    expect(reponse).toBeCloseTo(Math.max((notionnel * tauxPb) / 10_000, minimum), 2);
  });

  it('m1-app-commission : les DEUX régimes apparaissent sur les seeds 1 à 30', () => {
    const g = parId('m1-app-commission');
    let nbMinimumMord = 0;
    let nbProportionnel = 0;
    for (let seed = 1; seed <= 30; seed++) {
      const { regime, notionnel, tauxPb, minimum } = tiragesCommission(seed);
      const reponse = g.generate(seed).reponse;
      // Chaque seed reste recoupé par calculs.ts.
      expect(reponse).toBe(r2(commissionTotale(notionnel, tauxPb, minimum)));
      if (regime === 'minimum') {
        // Le tirage force le régime : la proportionnelle est STRICTEMENT sous le minimum.
        expect((notionnel * tauxPb) / 10_000).toBeLessThan(minimum);
        expect(reponse).toBe(minimum);
        nbMinimumMord++;
      } else {
        expect((notionnel * tauxPb) / 10_000).toBeGreaterThan(minimum);
        expect(reponse).toBeGreaterThan(minimum);
        nbProportionnel++;
      }
    }
    expect(nbMinimumMord).toBeGreaterThan(0);
    expect(nbProportionnel).toBeGreaterThan(0);
  });

  it('m1-app-cout-total-execution : réponse = slippage total + commissionTotale (composition)', () => {
    // Tirages : les 7 de tiragesFourchetteCarnet, puis 8. tauxPb = pick([1, 2, 3, 5])
    // · 9. minimum = pick([15, 20, 25, 30]).
    const { bid, ask1, niveaux, quantite, rng } = tiragesFourchetteCarnet(SEED);
    const tauxPb = pick(rng, [1, 2, 3, 5] as const);
    const minimum = pick(rng, [15, 20, 25, 30] as const);
    const milieu = milieuFourchette(bid, ask1);
    const exec = executionCarnet(quantite, niveaux);
    const slippageTotal = quantite * slippage(exec.prixMoyen, milieu, 'achat');
    const commission = commissionTotale(exec.coutTotal, tauxPb, minimum);
    const reponse = parId('m1-app-cout-total-execution').generate(SEED).reponse;
    expect(reponse).toBe(r2(slippageTotal + commission));
    // Contre-vérification : les trois étages du ch4 (demi-fourchette + profondeur + commission).
    const demiFourchette = coutTraverseeSpread(quantite, bid, ask1, 'achat');
    const profondeur = quantite * slippage(exec.prixMoyen, ask1, 'achat');
    expect(reponse).toBeCloseTo(demiFourchette + profondeur + commission, 2);
    // Et le total dépasse le slippage seul : la commission n'est jamais oubliée.
    expect(reponse).toBeGreaterThan(r2(slippageTotal));
  });
});
