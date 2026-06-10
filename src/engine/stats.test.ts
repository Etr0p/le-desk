import { describe, expect, it } from 'vitest';
import { progressionModule, tauxReussite, pointsFaibles, dernieresSessions } from './stats';
import type { EtatApp, Tentative } from './storage';
import { etatInitial } from './storage';
import type { ModuleContenu } from './types';

/* ─── Fixtures ─── */

function etatAvec(overrides: Partial<EtatApp>): EtatApp {
  return { ...etatInitial(), ...overrides };
}

function makeModule(id: string, nbChapitres: number, nbQcm: number): ModuleContenu {
  return {
    meta: { id, numero: 1, titre: `Module ${id}`, description: '', quantitatif: false },
    chapitres: Array.from({ length: nbChapitres }, (_, i) => ({
      meta: { id: `ch${i}`, titre: `Chapitre ${i}`, ordre: i },
      charger: () => Promise.resolve({ default: () => null as unknown as React.ReactElement }),
    })),
    exercices: [],
    problemes: [],
    qcm: Array.from({ length: nbQcm }, (_, i) => ({
      id: `${id}-q${i}`,
      moduleId: id,
      theme: i < nbQcm / 2 ? 'theme-A' : 'theme-B',
      difficulte: 1 as const,
      question: `Question ${i}`,
      options: ['A', 'B', 'C', 'D'],
      bonneReponse: 0,
      explications: ['', '', '', ''],
    })),
    jury: [],
    flashcards: [],
    formules: [],
  };
}

const MOD = makeModule('mod1', 3, 10);

/* ─── progressionModule ─── */

describe('progressionModule', () => {
  it('renvoie 0/n si aucun checkpoint réussi', () => {
    const etat = etatAvec({});
    const result = progressionModule(MOD, etat);
    expect(result.total).toBe(3);
    expect(result.acquis).toBe(0);
  });

  it('compte les chapitres avec checkpoint réussi', () => {
    const etat = etatAvec({
      checkpointsReussis: {
        'mod1/ch0': true,
        'mod1/ch1': true,
      },
    });
    const result = progressionModule(MOD, etat);
    expect(result.acquis).toBe(2);
    expect(result.total).toBe(3);
  });

  it('ignore les checkpoints d\'autres modules', () => {
    const etat = etatAvec({
      checkpointsReussis: {
        'autre/ch0': true,
        'mod1/ch0': true,
      },
    });
    const result = progressionModule(MOD, etat);
    expect(result.acquis).toBe(1);
  });
});

/* ─── tauxReussite ─── */

describe('tauxReussite', () => {
  const tentatives: Tentative[] = [
    { date: '2026-06-10', type: 'qcm', refId: 'q1', moduleId: 'mod1', reussite: 1 },
    { date: '2026-06-10', type: 'qcm', refId: 'q2', moduleId: 'mod1', reussite: 0 },
    { date: '2026-06-09', type: 'exercice', refId: 'e1', moduleId: 'mod2', reussite: 1 },
    { date: '2026-06-08', type: 'qcm', refId: 'q3', moduleId: 'mod2', reussite: 0.5 },
  ];

  it('retourne null si aucune tentative', () => {
    expect(tauxReussite([])).toBeNull();
  });

  it('calcule la moyenne sans filtre', () => {
    const taux = tauxReussite(tentatives);
    expect(taux).toBeCloseTo((1 + 0 + 1 + 0.5) / 4);
  });

  it('filtre par moduleId', () => {
    const taux = tauxReussite(tentatives, { moduleId: 'mod1' });
    expect(taux).toBeCloseTo((1 + 0) / 2);
  });

  it('filtre par type', () => {
    const taux = tauxReussite(tentatives, { type: 'exercice' });
    expect(taux).toBeCloseTo(1);
  });

  it('retourne null si filtre vide', () => {
    const taux = tauxReussite(tentatives, { moduleId: 'inexistant' });
    expect(taux).toBeNull();
  });

  it('filtre par fenêtre de jours', () => {
    // depuisJours: 2, aujourdHui: 2026-06-10 → addJours(-2) = 2026-06-08
    // → inclut 2026-06-08 (reussite 0.5), 2026-06-09 (reussite 1), 2026-06-10 (reussite 1, 0)
    const taux = tauxReussite(tentatives, { depuisJours: 2, aujourdHui: '2026-06-10' });
    expect(taux).toBeCloseTo((1 + 0 + 1 + 0.5) / 4);
  });

  it('fenêtre exclut les tentatives trop vieilles', () => {
    // depuisJours: 1, aujourdHui: 2026-06-10 → addJours(-1) = 2026-06-09
    // → inclut 2026-06-09 (reussite 1) et 2026-06-10 (reussite 1, 0)
    const taux = tauxReussite(tentatives, { depuisJours: 1, aujourdHui: '2026-06-10' });
    expect(taux).toBeCloseTo((1 + 0 + 1) / 3);
  });

  it('depuisJours sans aujourdHui utilise la date locale et ne lève pas d\'erreur', () => {
    // Une fenêtre de 36 500 j (≈ 100 ans) sans aujourdHui doit inclure les fixtures
    // (qui sont en 2026-06 — passé proche) quel que soit le vrai « aujourd'hui »
    const taux = tauxReussite(tentatives, { depuisJours: 36500 });
    expect(taux).not.toBeNull();
    // La moyenne reste (1+0+1+0.5)/4 = 0.625
    expect(taux).toBeCloseTo((1 + 0 + 1 + 0.5) / 4);
  });

  it('depuisJours sans aujourdHui inclut les tentatives dans une grande fenêtre', () => {
    // depuisJours: 36500 (≈ 100 ans) sans aujourdHui → remonte à ~1926, inclut toutes les tentatives
    const taux = tauxReussite(tentatives, { depuisJours: 36500 });
    expect(taux).not.toBeNull();
    expect(taux).toBeCloseTo((1 + 0 + 1 + 0.5) / 4);
  });
});

/* ─── pointsFaibles ─── */

describe('pointsFaibles', () => {
  const mod = makeModule('m1', 1, 10);
  // q0..q4 = theme-A (indices 0..4), q5..q9 = theme-B (indices 5..9)

  function tent(refId: string, reussite: number, date = '2026-06-10'): Tentative {
    return { date, type: 'qcm', refId, moduleId: 'm1', reussite };
  }

  it('retourne [] si pas assez de tentatives', () => {
    const etat = etatAvec({
      tentatives: [tent('m1-q0', 0), tent('m1-q1', 0), tent('m1-q2', 0)],
    });
    expect(pointsFaibles([mod], etat, 5)).toHaveLength(0);
  });

  it('retourne les groupes ayant >= minTentatives, triés croissant par taux', () => {
    const etat = etatAvec({
      tentatives: [
        // theme-A : 5 tentatives, 1 bonne → taux 0.2
        tent('m1-q0', 1), tent('m1-q0', 0), tent('m1-q1', 0), tent('m1-q2', 0), tent('m1-q3', 0),
        // theme-B : 5 tentatives, 4 bonnes → taux 0.8
        tent('m1-q5', 1), tent('m1-q6', 1), tent('m1-q7', 1), tent('m1-q8', 1), tent('m1-q9', 0),
      ],
    });
    const pf = pointsFaibles([mod], etat, 5);
    expect(pf.length).toBe(2);
    // tri croissant : theme-A (0.2) avant theme-B (0.8)
    expect(pf[0].theme).toBe('theme-A');
    expect(pf[0].taux).toBeCloseTo(0.2);
    expect(pf[1].theme).toBe('theme-B');
    expect(pf[1].taux).toBeCloseTo(0.8);
  });

  it('max 5 résultats', () => {
    const mod2 = makeModule('m2', 1, 30);
    // Créer 6 thèmes distincts pour tester la limite
    const modAvecThemes: ModuleContenu = {
      ...mod2,
      qcm: Array.from({ length: 30 }, (_, i) => ({
        id: `m2-q${i}`,
        moduleId: 'm2',
        theme: `theme-${i % 6}`,
        difficulte: 1 as const,
        question: `Q${i}`,
        options: ['A', 'B', 'C', 'D'],
        bonneReponse: 0,
        explications: ['', '', '', ''],
      })),
    };
    const etat = etatAvec({
      tentatives: Array.from({ length: 30 }, (_, i) => ({
        date: '2026-06-10',
        type: 'qcm' as const,
        refId: `m2-q${i}`,
        moduleId: 'm2',
        reussite: 0,
      })),
    });
    const pf = pointsFaibles([modAvecThemes], etat, 5);
    expect(pf.length).toBeLessThanOrEqual(5);
  });

  it('ignore les tentatives qui ne sont pas de type qcm', () => {
    const etat = etatAvec({
      tentatives: [
        { date: '2026-06-10', type: 'exercice', refId: 'm1-q0', moduleId: 'm1', reussite: 0 },
        { date: '2026-06-10', type: 'exercice', refId: 'm1-q1', moduleId: 'm1', reussite: 0 },
        { date: '2026-06-10', type: 'exercice', refId: 'm1-q2', moduleId: 'm1', reussite: 0 },
        { date: '2026-06-10', type: 'exercice', refId: 'm1-q3', moduleId: 'm1', reussite: 0 },
        { date: '2026-06-10', type: 'exercice', refId: 'm1-q4', moduleId: 'm1', reussite: 0 },
      ],
    });
    expect(pointsFaibles([mod], etat, 5)).toHaveLength(0);
  });
});

/* ─── dernieresSessions ─── */

describe('dernieresSessions', () => {
  const tentatives: Tentative[] = [
    { date: '2026-06-10', type: 'qcm', refId: 'q1', moduleId: 'm1', reussite: 1 },
    { date: '2026-06-10', type: 'qcm', refId: 'q2', moduleId: 'm1', reussite: 0 },
    { date: '2026-06-09', type: 'exercice', refId: 'e1', moduleId: 'm1', reussite: 1 },
    { date: '2026-06-08', type: 'qcm', refId: 'q3', moduleId: 'm1', reussite: 0.5 },
    { date: '2026-06-07', type: 'jury', refId: 'j1', moduleId: 'm1', reussite: 1 },
    { date: '2026-06-06', type: 'examen', refId: 'ex1', moduleId: 'm1', reussite: 0.75 },
  ];

  it('regroupe par (date, type) et trie par date décroissante', () => {
    const sessions = dernieresSessions(tentatives);
    expect(sessions.length).toBeLessThanOrEqual(5);
    // Première = plus récent
    expect(sessions[0].date).toBe('2026-06-10');
    expect(sessions[0].type).toBe('qcm');
  });

  it('calcule nb et taux correctement', () => {
    const sessions = dernieresSessions(tentatives);
    const qcm10 = sessions.find(s => s.date === '2026-06-10' && s.type === 'qcm');
    expect(qcm10).toBeDefined();
    expect(qcm10!.nb).toBe(2);
    expect(qcm10!.taux).toBeCloseTo(0.5);
  });

  it('respecte le paramètre n', () => {
    const sessions = dernieresSessions(tentatives, 3);
    expect(sessions.length).toBeLessThanOrEqual(3);
  });

  it('retourne [] si pas de tentatives', () => {
    expect(dernieresSessions([])).toHaveLength(0);
  });
});
