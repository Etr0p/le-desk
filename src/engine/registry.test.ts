import { describe, expect, it } from 'vitest';
import {
  modules, getModule,
  tousLesExercices, tousLesProblemes, touteLaBanqueQcm,
  toutesLesQuestionsJury, toutesLesFlashcards,
} from './registry';

describe('registry', () => {
  it('contient le module 04-taux-obligations', () => {
    expect(modules.some(m => m.meta.id === '04-taux-obligations')).toBe(true);
  });
  it('contient le module 01-panorama-marches (culture, numero 1)', () => {
    const m1 = getModule('01-panorama-marches')!;
    expect(m1).toBeDefined();
    expect(m1.meta.numero).toBe(1);
    expect(m1.meta.quantitatif).toBe(false);
  });
  it('les modules sont ordonnés par numero croissant', () => {
    const numeros = modules.map(m => m.meta.numero);
    expect(numeros).toEqual([...numeros].sort((a, b) => a - b));
  });
  it('getModule retourne le bon module avec numero 4', () => {
    expect(getModule('04-taux-obligations')!.meta.numero).toBe(4);
  });
  it('getModule retourne undefined pour un id inconnu', () => {
    expect(getModule('zzz')).toBeUndefined();
  });
  it('les helpers flatMap retournent des tableaux', () => {
    expect(Array.isArray(tousLesExercices())).toBe(true);
    expect(Array.isArray(tousLesProblemes())).toBe(true);
    expect(Array.isArray(touteLaBanqueQcm())).toBe(true);
    expect(Array.isArray(toutesLesQuestionsJury())).toBe(true);
    expect(Array.isArray(toutesLesFlashcards())).toBe(true);
  });

  it('tous les ids sont globalement uniques (exercices, problèmes, qcm, jury, flashcards)', () => {
    const ids = modules.flatMap(m => [
      ...m.exercices.map(x => x.id), ...m.problemes.map(x => x.id),
      ...m.qcm.map(x => x.id), ...m.jury.map(x => x.id), ...m.flashcards.map(x => x.id),
    ]);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('chaque moule de problème a entre 2 et 4 scénarios', () => {
    for (const m of modules) for (const p of m.problemes) {
      expect(p.scenarios.length).toBeGreaterThanOrEqual(2);
      expect(p.scenarios.length).toBeLessThanOrEqual(4);
    }
  });

  it('chaque QCM a 4 options, 4 explications, et une bonne réponse en bornes', () => {
    for (const m of modules) for (const q of m.qcm) {
      expect(q.options).toHaveLength(4);
      expect(q.explications).toHaveLength(4);
      expect(q.bonneReponse).toBeGreaterThanOrEqual(0);
      expect(q.bonneReponse).toBeLessThan(4);
    }
  });
});
