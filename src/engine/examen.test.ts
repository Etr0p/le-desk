import { describe, expect, it } from 'vitest';
import { composerExamen } from './examen';
import type { ModuleContenu, QcmQuestion, ProblemGenerator, JuryQuestion, GeneratedProblem, GeneratedExercise } from './types';

// --- Fake banks ---

const makeQcm = (moduleId: string, count: number, offset = 0): QcmQuestion[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `qcm-${moduleId}-${i + offset}`,
    moduleId,
    theme: `t${(i + offset) % 5}`,
    difficulte: (((i + offset) % 4) + 1) as 1 | 2 | 3 | 4,
    question: `Q ${moduleId} ${i + offset} ?`,
    options: ['A', 'B', 'C', 'D'],
    bonneReponse: (i + offset) % 4,
    explications: ['', '', '', ''],
  }));

const fakeExercise: GeneratedExercise = {
  enonce: 'x', reponse: 0, tolerance: 0.01, etapes: [],
};
const fakeGenerated = (moduleId: string): GeneratedProblem => ({
  contexte: `ctx ${moduleId}`,
  sousQuestions: [{ ...fakeExercise, intitule: 'q1' }],
});

// 8 generators: difficulties 1,2,2,3,3,4,2,1
const difficultes: (1|2|3|4)[] = [1, 2, 2, 3, 3, 4, 2, 1];
const makeGenerators = (moduleId: string): ProblemGenerator[] =>
  difficultes.map((d, i) => ({
    id: `gen-${moduleId}-${i}`,
    moduleId,
    titre: `Gen ${i}`,
    typeDeCas: 'couverture',
    difficulte: d,
    scenarios: ['scen-A', 'scen-B', 'scen-C'].slice(0, 2 + (i % 2)),
    generate: (_seed: number, _scenario: number) => fakeGenerated(moduleId),
  }));

const makeJury = (moduleId: string, count: number): JuryQuestion[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `jury-${moduleId}-${i}`,
    moduleId,
    theme: `t${i % 3}`,
    difficulte: ((i % 4) + 1) as 1 | 2 | 3 | 4,
    question: `Jury ${moduleId} ${i} ?`,
    plan: [],
    pointsAttendus: [],
    reponseModele: '',
  }));

// Two modules: 20 QCM each, 4 generators each (split 8), 3 jury each
const mod1: ModuleContenu = {
  meta: { id: 'mod1', numero: 1, titre: 'Mod 1', description: '', quantitatif: true },
  chapitres: [],
  exercices: [],
  problemes: makeGenerators('mod1').slice(0, 4),
  qcm: makeQcm('mod1', 20),
  jury: makeJury('mod1', 3),
  flashcards: [],
  formules: [],
};
const mod2: ModuleContenu = {
  meta: { id: 'mod2', numero: 2, titre: 'Mod 2', description: '', quantitatif: true },
  chapitres: [],
  exercices: [],
  problemes: makeGenerators('mod2').slice(4),
  qcm: makeQcm('mod2', 20, 20),
  jury: makeJury('mod2', 3),
  flashcards: [],
  formules: [],
};

const contenus = [mod1, mod2];

describe('composerExamen', () => {
  it('retourne exactement 20 QCM, 4 problèmes, 2 jury sur le pool complet', () => {
    const e = composerExamen(contenus, 42);
    expect(e.qcm).toHaveLength(20);
    expect(e.problemes).toHaveLength(4);
    expect(e.jury).toHaveLength(2);
  });

  it('les 4 ids de problèmes sont distincts et au moins un a difficulté ≥ 3', () => {
    const e = composerExamen(contenus, 42);
    const ids = e.problemes.map(p => p.generateur.id);
    expect(new Set(ids).size).toBe(4);
    expect(e.problemes.some(p => p.generateur.difficulte >= 3)).toBe(true);
  });

  it('les 2 questions jury viennent de moduleIds différents', () => {
    const e = composerExamen(contenus, 42);
    const mods = e.jury.map(j => j.moduleId);
    expect(new Set(mods).size).toBe(2);
  });

  it('déterminisme: même seed = même résultat, seeds différents = résultats différents', () => {
    const e1 = composerExamen(contenus, 42);
    const e2 = composerExamen(contenus, 42);
    expect(e1).toEqual(e2);
    const e3 = composerExamen(contenus, 43);
    const ids1 = e1.qcm.map(q => q.question.id);
    const ids3 = e3.qcm.map(q => q.question.id);
    expect(ids1).not.toEqual(ids3);
  });

  it('petit pool : 3 QCM, 1 générateur, 1 jury → 3/1/1 sans exception', () => {
    const small: ModuleContenu = {
      meta: { id: 'small', numero: 99, titre: 'Small', description: '', quantitatif: false },
      chapitres: [], exercices: [],
      problemes: [makeGenerators('small')[2]], // difficulte 2
      qcm: makeQcm('small', 3),
      jury: makeJury('small', 1),
      flashcards: [], formules: [],
    };
    const e = composerExamen([small], 7);
    expect(e.qcm).toHaveLength(3);
    expect(e.problemes).toHaveLength(1);
    expect(e.jury).toHaveLength(1);
  });

  it('chaque problème a un scenario dans [0, scenarios.length-1] et seed ≥ 1', () => {
    const e = composerExamen(contenus, 42);
    for (const p of e.problemes) {
      expect(p.seed).toBeGreaterThanOrEqual(1);
      expect(p.scenario).toBeGreaterThanOrEqual(0);
      expect(p.scenario).toBeLessThanOrEqual(p.generateur.scenarios.length - 1);
    }
  });
});
