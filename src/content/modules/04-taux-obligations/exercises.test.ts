/**
 * Invariants et justesse des 13 générateurs d'application du module 4.
 *
 * Deux familles de tests :
 * 1. Invariants (plan Task B7 Step 3) + invariants BILINGUES : même seed ⇒ même
 *    réponse / même tolérance en FR et EN, textes distincts, jamais de undefined/NaN.
 * 2. Justesse : pour un seed fixe, chaque test REJOUE les tirages du moule avec
 *    mulberry32(seed) (l'ordre des tirages est documenté en commentaire « Tirages »
 *    dans exercises.ts) puis recoupe la réponse avec un calcul direct via calculs.ts.
 */
import { describe, expect, it } from 'vitest';
import { mulberry32, pick, randFloat, randInt } from '../../../engine/rng';
import {
  convexite,
  couponCouru,
  durationMacaulay,
  durationModifiee,
  interetMonetaire,
  prixObligation,
  prixZeroCoupon,
  tauxEffectif,
  tauxForward,
  va,
  ytm2Ans,
} from './calculs';
import { exercices } from './exercises';

const r2 = (v: number) => Math.round(v * 100) / 100;
const r3 = (v: number) => Math.round(v * 1000) / 1000;
const r4 = (v: number) => Math.round(v * 10000) / 10000;

const parId = (id: string) => {
  const g = exercices.find((x) => x.id === id);
  if (!g) throw new Error(`générateur manquant : ${id}`);
  return g;
};

const IDS_ATTENDUS = [
  'm4-app-prix-obligation',
  'm4-app-duration-macaulay',
  'm4-app-simple-compose',
  'm4-app-monetaire-360',
  'm4-app-prix-zc',
  'm4-app-taux-effectif',
  'm4-app-coupon-couru',
  'm4-app-rendement-courant',
  'm4-app-ytm-2ans',
  'm4-app-duration-modifiee',
  'm4-app-convexite',
  'm4-app-forward',
  'm4-app-repo',
];

describe('générateurs module 4 — invariants', () => {
  it('le module expose au moins 13 générateurs aux ids uniques', () => {
    expect(exercices.length).toBeGreaterThanOrEqual(13);
    expect(new Set(exercices.map((g) => g.id)).size).toBe(exercices.length);
    for (const g of exercices) expect(g.moduleId).toBe('04-taux-obligations');
  });

  it('les 13 moules du plan sont tous présents', () => {
    const ids = exercices.map((g) => g.id);
    for (const id of IDS_ATTENDUS) expect(ids).toContain(id);
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
  it('m4-app-prix-obligation : prix = prixObligation(nominal, coupon, n, taux)', () => {
    const rng = mulberry32(SEED);
    const nominal = pick(rng, [100, 1000] as const);
    const coupon = randFloat(rng, 1, 6, 2);
    let taux = randFloat(rng, 0.5, 7, 2);
    if (Math.abs(taux - coupon) < 0.3) taux = Math.round((taux + 0.7) * 100) / 100;
    const n = randInt(rng, 2, 8);
    expect(parId('m4-app-prix-obligation').generate(SEED).reponse).toBe(
      r2(prixObligation(nominal, coupon, n, taux)),
    );
  });

  it('m4-app-duration-macaulay : D = durationMacaulay(1000, coupon, n, taux)', () => {
    const rng = mulberry32(SEED);
    const coupon = randFloat(rng, 2, 6, 1);
    const taux = randFloat(rng, 1, 6, 1);
    const n = randInt(rng, 2, 5);
    expect(parId('m4-app-duration-macaulay').generate(SEED).reponse).toBe(
      r2(durationMacaulay(1000, coupon, n, taux)),
    );
  });

  it('m4-app-simple-compose : écart = VF composé − VF simple', () => {
    const rng = mulberry32(SEED);
    const capitalK = randInt(rng, 10, 500);
    const taux = randFloat(rng, 1, 5, 1);
    const n = randInt(rng, 2, 6);
    const capital = capitalK * 1000;
    // n années d'intérêts simples = prorata Exact/360 sur n × 360 jours.
    const vfSimple = capital + interetMonetaire(capital, taux, n * 360, 360);
    // Capitaliser est l'inverse d'actualiser : VF = capital / VA(1).
    const vfCompose = capital / va(1, taux, n);
    expect(parId('m4-app-simple-compose').generate(SEED).reponse).toBe(r2(vfCompose - vfSimple));
  });

  it('m4-app-monetaire-360 : intérêt = interetMonetaire(montant, taux, jours)', () => {
    const rng = mulberry32(SEED);
    const montantM = randFloat(rng, 0.5, 10, 1);
    const taux = randFloat(rng, 2, 4.5, 2);
    const jours = pick(rng, [30, 60, 90, 180] as const);
    expect(parId('m4-app-monetaire-360').generate(SEED).reponse).toBe(
      r2(interetMonetaire(montantM * 1e6, taux, jours)),
    );
  });

  it('m4-app-prix-zc : prix = prixZeroCoupon(1000, taux, n)', () => {
    const rng = mulberry32(SEED);
    const taux = randFloat(rng, 1, 5, 2);
    const n = randInt(rng, 2, 15);
    expect(parId('m4-app-prix-zc').generate(SEED).reponse).toBe(r2(prixZeroCoupon(1000, taux, n)));
  });

  it('m4-app-taux-effectif : TEA = tauxEffectif(nominal, m)', () => {
    const rng = mulberry32(SEED);
    const tauxNominal = randFloat(rng, 2, 8, 2);
    const m = pick(rng, [2, 4, 12] as const);
    expect(parId('m4-app-taux-effectif').generate(SEED).reponse).toBe(r4(tauxEffectif(tauxNominal, m)));
  });

  it('m4-app-coupon-couru : prix sale = prix propre + couponCouru(...)', () => {
    const rng = mulberry32(SEED);
    const coupon = randFloat(rng, 2, 6, 2);
    const jours = randInt(rng, 30, 330);
    const prixProprePct = randFloat(rng, 92, 108, 2);
    const prixPropre = (1000 * prixProprePct) / 100;
    expect(parId('m4-app-coupon-couru').generate(SEED).reponse).toBe(
      r2(prixPropre + couponCouru(coupon, 1000, jours, 365)),
    );
  });

  it('m4-app-rendement-courant : RC = coupon € / prix €', () => {
    const rng = mulberry32(SEED);
    const coupon = randFloat(rng, 2, 6, 2);
    const prixPct = randFloat(rng, 88, 112, 2);
    const c = (1000 * coupon) / 100;
    const prix = (1000 * prixPct) / 100;
    expect(parId('m4-app-rendement-courant').generate(SEED).reponse).toBe(r3((c / prix) * 100));
  });

  it('m4-app-ytm-2ans : y = ytm2Ans(1000, coupon, prix), et re-pricer redonne le prix', () => {
    const rng = mulberry32(SEED);
    const coupon = randFloat(rng, 2, 5, 2);
    const prixPct = randFloat(rng, 94, 106, 2);
    const prix = (1000 * prixPct) / 100;
    const y = ytm2Ans(1000, coupon, prix);
    expect(parId('m4-app-ytm-2ans').generate(SEED).reponse).toBe(r3(y));
    // Contre-vérification croisée : le YTM re-price bien l'obligation.
    expect(prixObligation(1000, coupon, 2, y)).toBeCloseTo(prix, 6);
  });

  it('m4-app-duration-modifiee : ΔP = −Dmod × Δy × P', () => {
    const rng = mulberry32(SEED);
    const coupon = randFloat(rng, 2, 6, 1);
    const taux = randFloat(rng, 1, 6, 1);
    const n = randInt(rng, 3, 8);
    const choc = pick(rng, [-100, -75, -50, -25, 25, 50, 75, 100] as const);
    const prix = prixObligation(1000, coupon, n, taux);
    const dMod = durationModifiee(durationMacaulay(1000, coupon, n, taux), taux);
    const deltaY = choc / 10000;
    expect(parId('m4-app-duration-modifiee').generate(SEED).reponse).toBe(r2(-dMod * deltaY * prix));
  });

  it('m4-app-convexite : correction = ½ × C × Δy² × P', () => {
    const rng = mulberry32(SEED);
    const coupon = randFloat(rng, 2, 6, 1);
    const taux = randFloat(rng, 2, 6, 1);
    const n = randInt(rng, 5, 12);
    const choc = pick(rng, [-300, -250, -200, -150, 150, 200, 250, 300] as const);
    const prix = prixObligation(1000, coupon, n, taux);
    const conv = convexite(1000, coupon, n, taux);
    const deltaY = choc / 10000;
    expect(parId('m4-app-convexite').generate(SEED).reponse).toBe(
      r2(0.5 * conv * deltaY * deltaY * prix),
    );
  });

  it('m4-app-forward : f = tauxForward(z1, t1, z2, t2)', () => {
    const rng = mulberry32(SEED);
    const z1 = randFloat(rng, 1, 4, 2);
    const pente = randFloat(rng, 0.1, 1.2, 2);
    const z2 = r2(z1 + pente);
    const paire = pick(rng, [[1, 2], [2, 3], [1, 3]] as const);
    const [t1, t2] = paire;
    expect(parId('m4-app-forward').generate(SEED).reponse).toBe(r3(tauxForward(z1, t1, z2, t2)));
  });

  it('m4-app-repo : coût = interetMonetaire(position × (1 − haircut), taux repo, jours)', () => {
    const rng = mulberry32(SEED);
    const positionM = randInt(rng, 5, 50);
    const tauxRepo = randFloat(rng, 1.5, 4, 2);
    const jours = randInt(rng, 1, 30);
    const haircut = randInt(rng, 1, 5);
    const cash = positionM * 1e6 * (1 - haircut / 100);
    expect(parId('m4-app-repo').generate(SEED).reponse).toBe(
      r2(interetMonetaire(cash, tauxRepo, jours)),
    );
  });
});
