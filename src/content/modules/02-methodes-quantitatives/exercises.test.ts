/**
 * Invariants et justesse des 14 générateurs d'application du module 2.
 *
 * Deux familles de tests (patron du module 4) :
 * 1. Invariants : validité (réponse/tolérance finies, ≥ 2 étapes, pas de undefined/NaN),
 *    variation (≥ 3 réponses distinctes sur 5 seeds), déterminisme, et invariants
 *    BILINGUES : même seed ⇒ même réponse / même tolérance en FR et EN, textes distincts.
 * 2. Justesse : pour un seed fixe, chaque test REJOUE les tirages du moule avec
 *    mulberry32(seed) (l'ordre des tirages est documenté en commentaire « Tirages »
 *    dans exercises.ts) puis recoupe la réponse avec un calcul direct via calculs.ts.
 */
import { describe, expect, it } from 'vitest';
import { mulberry32, pick, randFloat, randInt } from '../../../engine/rng';
import {
  bayes,
  correlation,
  ecartTypeEchantillon,
  intervalleConfiance,
  moyenneGeometrique,
  normaleCdf,
  ordonneeRegression,
  penteRegression,
  perpetuite,
  probaBinomiale,
  statT,
  vaAnnuite,
  van,
  variancePortefeuille2,
  volatiliteAnnualisee,
  zScore,
} from './calculs';
import { exercices } from './exercises';

const r2 = (v: number) => Math.round(v * 100) / 100;
const r4 = (v: number) => Math.round(v * 10000) / 10000;

const parId = (id: string) => {
  const g = exercices.find((x) => x.id === id);
  if (!g) throw new Error(`générateur manquant : ${id}`);
  return g;
};

/** Les 14 moules du plan, avec leur niveau de difficulté. */
const MOULES_ATTENDUS: Record<string, number> = {
  'm2-app-va-annuite': 1,
  'm2-app-mensualite': 2,
  'm2-app-perpetuite': 1,
  'm2-app-van': 2,
  'm2-app-moyenne-geo': 2,
  'm2-app-vol-annualisee': 1,
  'm2-app-correlation': 3,
  'm2-app-bayes': 3,
  'm2-app-binomiale': 2,
  'm2-app-zscore': 2,
  'm2-app-ic': 2,
  'm2-app-stat-t': 3,
  'm2-app-regression': 3,
  'm2-app-portefeuille2': 3,
};

describe('générateurs module 2 — invariants', () => {
  it('le module expose au moins 14 générateurs aux ids uniques', () => {
    expect(exercices.length).toBeGreaterThanOrEqual(14);
    expect(new Set(exercices.map((g) => g.id)).size).toBe(exercices.length);
    for (const g of exercices) expect(g.moduleId).toBe('02-methodes-quantitatives');
  });

  it('les 14 moules du plan sont présents, au bon niveau de difficulté', () => {
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
  it('m2-app-va-annuite : VA = vaAnnuite(flux, taux, n)', () => {
    // Tirages : 1. fluxD = randInt(5, 50) (flux = fluxD × 10) · 2. taux = randFloat(1, 8, 2)
    // · 3. n = randInt(3, 15).
    const rng = mulberry32(SEED);
    const fluxD = randInt(rng, 5, 50);
    const taux = randFloat(rng, 1, 8, 2);
    const n = randInt(rng, 3, 15);
    expect(parId('m2-app-va-annuite').generate(SEED).reponse).toBe(
      r2(vaAnnuite(fluxD * 10, taux, n)),
    );
  });

  it('m2-app-mensualite : M = capital / vaAnnuite(1, taux mensuel, n mois)', () => {
    // Tirages : 1. capitalK = randInt(5, 50) (capital = capitalK × 1000)
    // · 2. tauxMensuel = randFloat(0.2, 0.6, 2) · 3. nMois = randInt(12, 120).
    const rng = mulberry32(SEED);
    const capitalK = randInt(rng, 5, 50);
    const tauxMensuel = randFloat(rng, 0.2, 0.6, 2);
    const nMois = randInt(rng, 12, 120);
    const capital = capitalK * 1000;
    const m = parId('m2-app-mensualite').generate(SEED).reponse;
    expect(m).toBe(r2(capital / vaAnnuite(1, tauxMensuel, nMois)));
    // Contre-vérification croisée : la VA des n mensualités redonne bien le capital.
    expect(vaAnnuite(m, tauxMensuel, nMois)).toBeCloseTo(capital, 0);
  });

  it('m2-app-perpetuite : P = perpetuite(flux, taux)', () => {
    // Tirages : 1. type = pick(['dividende', 'loyer']) · 2. fluxBase = randInt(4, 60)
    // · 3. taux = randFloat(2, 8, 1). flux = fluxBase × 100 si loyer, fluxBase sinon.
    const rng = mulberry32(SEED);
    const type = pick(rng, ['dividende', 'loyer'] as const);
    const fluxBase = randInt(rng, 4, 60);
    const taux = randFloat(rng, 2, 8, 1);
    const flux = type === 'loyer' ? fluxBase * 100 : fluxBase;
    expect(parId('m2-app-perpetuite').generate(SEED).reponse).toBe(r2(perpetuite(flux, taux)));
  });

  it('m2-app-van : VAN = van(invest, flux égaux, taux), soit vaAnnuite − invest', () => {
    // Tirages : 1. investK = randInt(1, 10) (invest = investK × 1000) · 2. n = randInt(3, 5)
    // · 3. taux = randFloat(5, 15, 2) · 4. fluxD = randInt(22, 48) (flux = fluxD × investK × 10).
    const rng = mulberry32(SEED);
    const investK = randInt(rng, 1, 10);
    const n = randInt(rng, 3, 5);
    const taux = randFloat(rng, 5, 15, 2);
    const fluxD = randInt(rng, 22, 48);
    const invest = investK * 1000;
    const flux = fluxD * investK * 10;
    const reponse = parId('m2-app-van').generate(SEED).reponse;
    expect(reponse).toBe(r2(van(invest, Array.from({ length: n }, () => flux), taux)));
    // Contre-vérification croisée : pour des flux constants, VAN = vaAnnuite − invest.
    expect(reponse).toBeCloseTo(vaAnnuite(flux, taux, n) - invest, 1);
  });

  it('m2-app-moyenne-geo : rg = moyenneGeometrique(rendements)', () => {
    // Tirages : 1. nAnnees = randInt(2, 3) · 2. rPos1 = randInt(5, 30) · 3. rNegAbs = randInt(5, 25)
    // · 4. rPos2 = randInt(2, 20) (utilisé seulement si nAnnees = 3).
    const rng = mulberry32(SEED);
    const nAnnees = randInt(rng, 2, 3);
    const rPos1 = randInt(rng, 5, 30);
    const rNegAbs = randInt(rng, 5, 25);
    const rPos2 = randInt(rng, 2, 20);
    const rendements = nAnnees === 2 ? [rPos1, -rNegAbs] : [rPos1, -rNegAbs, rPos2];
    expect(parId('m2-app-moyenne-geo').generate(SEED).reponse).toBe(
      r2(moyenneGeometrique(rendements)),
    );
  });

  it('m2-app-vol-annualisee : σ_an = volatiliteAnnualisee(vol, 252 ou 52)', () => {
    // Tirages : 1. freq = pick(['quotidienne', 'hebdomadaire']) · 2. vol = randFloat(0.5, 3, 2).
    const rng = mulberry32(SEED);
    const freq = pick(rng, ['quotidienne', 'hebdomadaire'] as const);
    const vol = randFloat(rng, 0.5, 3, 2);
    expect(parId('m2-app-vol-annualisee').generate(SEED).reponse).toBe(
      r2(volatiliteAnnualisee(vol, freq === 'quotidienne' ? 252 : 52)),
    );
  });

  it('m2-app-correlation : ρ = correlation(xs, ys) sur les séries construites', () => {
    // Tirages : 1. mx = randInt(−1, 2) · 2. my = randInt(−1, 2) · 3. a1 = randInt(1, 3)
    // · 4. a2 = randInt(1, 3) · 5. b1 = randInt(1, 3) · 6. b2 = randInt(1, 3).
    // xs = [mx+a1, mx−a1, mx+a2, mx−a2] ; ys = [my+b1, my−b1, my−b2, my+b2].
    const rng = mulberry32(SEED);
    const mx = randInt(rng, -1, 2);
    const my = randInt(rng, -1, 2);
    const a1 = randInt(rng, 1, 3);
    const a2 = randInt(rng, 1, 3);
    const b1 = randInt(rng, 1, 3);
    const b2 = randInt(rng, 1, 3);
    const xs = [mx + a1, mx - a1, mx + a2, mx - a2];
    const ys = [my + b1, my - b1, my - b2, my + b2];
    expect(parId('m2-app-correlation').generate(SEED).reponse).toBe(r2(correlation(xs, ys)));
    // La construction garantit σ > 0 des deux côtés et |ρ| < 1 strict.
    expect(ecartTypeEchantillon(xs)).toBeGreaterThan(0);
    expect(ecartTypeEchantillon(ys)).toBeGreaterThan(0);
    expect(Math.abs(correlation(xs, ys))).toBeLessThan(1);
  });

  it('m2-app-bayes : P(A|positif) = bayes(pA, sens, fauxPos), recoupé par les effectifs', () => {
    // Tirages : 1. ctx = pick([0, 1, 2]) · 2. pAPct = pick([1, 2, 5, 10, 20])
    // · 3. sensPct = pick([80, 90, 95, 99]) · 4. fpPct = pick([5, 10, 20, 30]).
    const rng = mulberry32(SEED);
    pick(rng, [0, 1, 2] as const); // ctx (ne change que l'habillage)
    const pAPct = pick(rng, [1, 2, 5, 10, 20] as const);
    const sensPct = pick(rng, [80, 90, 95, 99] as const);
    const fpPct = pick(rng, [5, 10, 20, 30] as const);
    const reponse = parId('m2-app-bayes').generate(SEED).reponse;
    expect(reponse).toBe(r2(bayes(pAPct / 100, sensPct / 100, fpPct / 100) * 100));
    // Contre-vérification par la méthode des effectifs sur 10 000 cas (tous entiers).
    const vraisPositifs = pAPct * sensPct;
    const fauxPositifs = (100 - pAPct) * fpPct;
    expect(reponse).toBeCloseTo((100 * vraisPositifs) / (vraisPositifs + fauxPositifs), 2);
  });

  it('m2-app-binomiale : P(X = k) = probaBinomiale(n, k, p)', () => {
    // Tirages : 1. n = randInt(5, 12) · 2. pCinq = randInt(6, 14) (p = pCinq × 5 %)
    // · 3. k = randInt(2, n − 2).
    const rng = mulberry32(SEED);
    const n = randInt(rng, 5, 12);
    const pCinq = randInt(rng, 6, 14);
    const k = randInt(rng, 2, n - 2);
    expect(parId('m2-app-binomiale').generate(SEED).reponse).toBe(
      r4(probaBinomiale(n, k, (pCinq * 5) / 100) * 100),
    );
  });

  it('m2-app-zscore : P(X > seuil) = 1 − normaleCdf(zScore(seuil, μ, σ))', () => {
    // Tirages : 1. mu = randInt(2, 10) · 2. sigma = randInt(10, 25)
    // · 3. zCible = pick([−2, −1.5, −1, −0.5, 0.5, 1, 1.5, 2]). seuil = mu + zCible × sigma.
    const rng = mulberry32(SEED);
    const mu = randInt(rng, 2, 10);
    const sigma = randInt(rng, 10, 25);
    const zCible = pick(rng, [-2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2] as const);
    const seuil = mu + zCible * sigma;
    expect(parId('m2-app-zscore').generate(SEED).reponse).toBe(
      r2((1 - normaleCdf(zScore(seuil, mu, sigma))) * 100),
    );
    // Le seuil est construit pour tomber exactement à zCible écarts-types.
    expect(zScore(seuil, mu, sigma)).toBeCloseTo(zCible, 9);
  });

  it("m2-app-ic : la réponse est la borne HAUTE d'intervalleConfiance(moyenne, s, n)", () => {
    // Tirages : 1. moyenne = randFloat(0.2, 2, 1) · 2. s = randFloat(2, 6, 1)
    // · 3. n = pick([25, 36, 49, 64, 100, 144]).
    const rng = mulberry32(SEED);
    const moyenne = randFloat(rng, 0.2, 2, 1);
    const s = randFloat(rng, 2, 6, 1);
    const n = pick(rng, [25, 36, 49, 64, 100, 144] as const);
    expect(parId('m2-app-ic').generate(SEED).reponse).toBe(
      r2(intervalleConfiance(moyenne, s, n).haute),
    );
  });

  it('m2-app-stat-t : t = statT(alpha, 0, s, n)', () => {
    // Tirages : 1. alpha = randFloat(0.5, 3, 1) · 2. s = randFloat(3, 8, 1)
    // · 3. n = pick([16, 25, 36, 49, 64]).
    const rng = mulberry32(SEED);
    const alpha = randFloat(rng, 0.5, 3, 1);
    const s = randFloat(rng, 3, 8, 1);
    const n = pick(rng, [16, 25, 36, 49, 64] as const);
    expect(parId('m2-app-stat-t').generate(SEED).reponse).toBe(r2(statT(alpha, 0, s, n)));
  });

  it('m2-app-regression : prédiction = ordonneeRegression + penteRegression × x0', () => {
    // Tirages : 1. b = randFloat(0.6, 1.8, 1) · 2. a = pick([−2, −1, 1, 2]) · 3. e = randInt(1, 2)
    // · 4. x0 = randInt(4, 6). xs = [−3, −1, 1, 3] ;
    // ys = [a − 3b − e, a − b + e, a + b + e, a + 3b − e] (résidus orthogonaux à x).
    const rng = mulberry32(SEED);
    const b = randFloat(rng, 0.6, 1.8, 1);
    const a = pick(rng, [-2, -1, 1, 2] as const);
    const e = randInt(rng, 1, 2);
    const x0 = randInt(rng, 4, 6);
    const xs = [-3, -1, 1, 3];
    const ys = [a - 3 * b - e, a - b + e, a + b + e, a + 3 * b - e];
    expect(parId('m2-app-regression').generate(SEED).reponse).toBe(
      r2(ordonneeRegression(xs, ys) + penteRegression(xs, ys) * x0),
    );
    // La construction (résidus de somme nulle, orthogonaux à x) rend la droite MCO exacte.
    expect(penteRegression(xs, ys)).toBeCloseTo(b, 9);
    expect(ordonneeRegression(xs, ys)).toBeCloseTo(a, 9);
  });

  it('m2-app-portefeuille2 : σp = √variancePortefeuille2(w1, σ1, σ2, ρ)', () => {
    // Tirages : 1. w5 = randInt(4, 16) (w1 = w5 × 5 %) · 2. sigma1 = randInt(10, 30)
    // · 3. sigma2 = randInt(5, 25) · 4. rho = pick([−0.6, −0.4, −0.2, 0.2, 0.4, 0.6, 0.8]).
    const rng = mulberry32(SEED);
    const w5 = randInt(rng, 4, 16);
    const sigma1 = randInt(rng, 10, 30);
    const sigma2 = randInt(rng, 5, 25);
    const rho = pick(rng, [-0.6, -0.4, -0.2, 0.2, 0.4, 0.6, 0.8] as const);
    expect(parId('m2-app-portefeuille2').generate(SEED).reponse).toBe(
      r2(Math.sqrt(variancePortefeuille2((w5 * 5) / 100, sigma1, sigma2, rho))),
    );
  });
});
