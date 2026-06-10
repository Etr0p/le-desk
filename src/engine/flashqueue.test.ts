import { describe, expect, it } from 'vitest';
import { fileDuJour, apercuFileDuJour } from './flashqueue';
import type { Flashcard } from './types';
import type { EtatApp } from './storage';
import { etatInitial } from './storage';
import { addJours } from './srs';

const AUJOURD = '2026-06-10';

function makeCards(n: number): Flashcard[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `fc${i}`,
    moduleId: 'm1',
    tags: [],
    recto: `Recto ${i}`,
    verso: `Verso ${i}`,
  }));
}

function etatAvec(overrides: Partial<EtatApp>): EtatApp {
  return { ...etatInitial(), ...overrides };
}

describe('fileDuJour', () => {
  it('retourne un tableau vide si pas de cartes due et cap=0', () => {
    const cartes = makeCards(5);
    const etat = etatAvec({ reglages: { nouvellesCartesParJour: 0, theme: 'sombre', langue: 'fr' } });
    const file = fileDuJour(cartes, etat, AUJOURD, 42);
    expect(file).toHaveLength(0);
  });

  it('cap des nouvelles cartes est respecté', () => {
    const cartes = makeCards(10);
    const etat = etatAvec({ reglages: { nouvellesCartesParJour: 3, theme: 'sombre', langue: 'fr' } });
    const file = fileDuJour(cartes, etat, AUJOURD, 1);
    expect(file).toHaveLength(3);
  });

  it('le cap est réduit par les introductions du jour', () => {
    const cartes = makeCards(10);
    // fc0 et fc1 déjà introduites aujourd'hui
    const etat = etatAvec({
      reglages: { nouvellesCartesParJour: 5, theme: 'sombre', langue: 'fr' },
      cartesIntroduites: { fc0: AUJOURD, fc1: AUJOURD },
    });
    const file = fileDuJour(cartes, etat, AUJOURD, 1);
    // 5 - 2 = 3 nouvelles, plus fc0 et fc1 déjà introduites (pas dues sans état SRS)
    // fc0 et fc1 ont été introduites mais n'ont pas d'état SRS → pas dues → pas incluses
    // Donc uniquement 3 nouvelles cartes
    expect(file).toHaveLength(3);
    // aucune de fc0/fc1 dans la file (pas due, et déjà introduites)
    const ids = file.map(c => c.id);
    expect(ids).not.toContain('fc0');
    expect(ids).not.toContain('fc1');
  });

  it('les cartes dues sont toujours incluses, même au-delà du cap', () => {
    const cartes = makeCards(10);
    // fc0..fc4 sont dues (5 cartes), cap = 2 nouvelles
    const cartesEtat: EtatApp['cartes'] = {};
    const cartesIntroduites: EtatApp['cartesIntroduites'] = {};
    for (let i = 0; i < 5; i++) {
      // Carte avec une écheance = aujourd'hui
      cartesEtat[`fc${i}`] = { ease: 2.5, intervalJours: 1, echeance: AUJOURD, repetitions: 1 };
      cartesIntroduites[`fc${i}`] = addJours(AUJOURD, -1);
    }
    const etat = etatAvec({
      reglages: { nouvellesCartesParJour: 2, theme: 'sombre', langue: 'fr' },
      cartes: cartesEtat,
      cartesIntroduites,
    });
    const file = fileDuJour(cartes, etat, AUJOURD, 1);
    // 5 dues + 2 nouvelles = 7
    expect(file.length).toBeGreaterThanOrEqual(5);
    const ids = new Set(file.map(c => c.id));
    for (let i = 0; i < 5; i++) {
      expect(ids.has(`fc${i}`)).toBe(true);
    }
  });

  it('le résultat est déterministe par seed', () => {
    const cartes = makeCards(20);
    const etat = etatAvec({ reglages: { nouvellesCartesParJour: 5, theme: 'sombre', langue: 'fr' } });
    const file1 = fileDuJour(cartes, etat, AUJOURD, 99);
    const file2 = fileDuJour(cartes, etat, AUJOURD, 99);
    expect(file1.map(c => c.id)).toEqual(file2.map(c => c.id));
  });

  it('deux seeds différents donnent des ordres (très probablement) différents', () => {
    const cartes = makeCards(20);
    const etat = etatAvec({ reglages: { nouvellesCartesParJour: 10, theme: 'sombre', langue: 'fr' } });
    const file1 = fileDuJour(cartes, etat, AUJOURD, 1);
    const file2 = fileDuJour(cartes, etat, AUJOURD, 2);
    // pas strictement garanti mais très improbable d'être identiques avec 10 cartes
    expect(file1.map(c => c.id)).not.toEqual(file2.map(c => c.id));
  });

  it('une carte à la fois due ET nouvelle compte comme due (pas contre le cap)', () => {
    const cartes = makeCards(5);
    // fc0 est due mais n'est PAS dans cartesIntroduites → nouvelle ET due
    const cartesEtat: EtatApp['cartes'] = {
      fc0: { ease: 2.5, intervalJours: 1, echeance: AUJOURD, repetitions: 1 },
    };
    // fc0 a un état SRS mais n'est pas dans cartesIntroduites (cas théorique)
    const etat = etatAvec({
      reglages: { nouvellesCartesParJour: 1, theme: 'sombre', langue: 'fr' },
      cartes: cartesEtat,
      cartesIntroduites: {},
    });
    const file = fileDuJour(cartes, etat, AUJOURD, 1);
    const ids = file.map(c => c.id);
    // fc0 est due → toujours incluse
    expect(ids).toContain('fc0');
    // cap = 1 nouvelle, fc0 est due (pas nouvelle), donc 1 autre nouvelle peut s'ajouter
    // total = 1 (due) + 1 (nouvelle) = 2
    expect(file.length).toBe(2);
  });

  it('les cartes présentes dans etat.cartes mais absentes du deck sont ignorées', () => {
    const cartes = makeCards(3); // fc0, fc1, fc2
    // fc99 dans etat mais pas dans le deck
    const cartesEtat: EtatApp['cartes'] = {
      fc99: { ease: 2.5, intervalJours: 1, echeance: AUJOURD, repetitions: 1 },
    };
    const cartesIntroduites: EtatApp['cartesIntroduites'] = {
      fc99: addJours(AUJOURD, -5),
    };
    const etat = etatAvec({
      reglages: { nouvellesCartesParJour: 2, theme: 'sombre', langue: 'fr' },
      cartes: cartesEtat,
      cartesIntroduites,
    });
    const file = fileDuJour(cartes, etat, AUJOURD, 1);
    const ids = file.map(c => c.id);
    expect(ids).not.toContain('fc99');
    // Seules 2 nouvelles cartes (fc0, fc1, fc2 → 2 max)
    expect(file.length).toBeLessThanOrEqual(2);
  });

  it('les cartes introduites un autre jour ne réduisent pas le cap', () => {
    const cartes = makeCards(10);
    // fc0 introduit hier, pas aujourd'hui
    const etat = etatAvec({
      reglages: { nouvellesCartesParJour: 3, theme: 'sombre', langue: 'fr' },
      cartesIntroduites: { fc0: addJours(AUJOURD, -1) },
    });
    const file = fileDuJour(cartes, etat, AUJOURD, 1);
    // Cap plein = 3, fc0 est déjà introduite donc elle n'est plus "nouvelle"
    // Elle n'est pas due non plus (pas dans etat.cartes)
    // → 3 nouvelles parmi fc1..fc9
    expect(file.length).toBe(3);
    const ids = file.map(c => c.id);
    expect(ids).not.toContain('fc0');
  });
});

describe('apercuFileDuJour', () => {
  it('renvoie des compteurs cohérents avec fileDuJour', () => {
    const cartes = makeCards(10);
    const etat = etatAvec({ reglages: { nouvellesCartesParJour: 3, theme: 'sombre', langue: 'fr' } });
    const apercu = apercuFileDuJour(cartes, etat, AUJOURD);
    const file = fileDuJour(cartes, etat, AUJOURD, 1);
    expect(apercu.dues).toBe(0);
    expect(apercu.nouvelles).toBe(3);
    expect(apercu.dues + apercu.nouvelles).toBe(file.length);
  });

  it('les cartes dues sont comptées séparément des nouvelles', () => {
    const cartes = makeCards(10);
    const cartesEtat: EtatApp['cartes'] = {};
    const cartesIntroduites: EtatApp['cartesIntroduites'] = {};
    for (let i = 0; i < 4; i++) {
      cartesEtat[`fc${i}`] = { ease: 2.5, intervalJours: 1, echeance: AUJOURD, repetitions: 1 };
      cartesIntroduites[`fc${i}`] = addJours(AUJOURD, -1);
    }
    const etat = etatAvec({
      reglages: { nouvellesCartesParJour: 2, theme: 'sombre', langue: 'fr' },
      cartes: cartesEtat,
      cartesIntroduites,
    });
    const apercu = apercuFileDuJour(cartes, etat, AUJOURD);
    expect(apercu.dues).toBe(4);
    expect(apercu.nouvelles).toBe(2);
  });
});
