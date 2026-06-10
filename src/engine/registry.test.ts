import { describe, expect, it } from 'vitest';
import {
  modules, getModule,
  tousLesGenerateurs, tousLesProblemes, touteLaBanqueQcm,
  toutesLesQuestionsJury, toutesLesFlashcards,
} from './registry';

describe('registry', () => {
  it('contient le module 04-taux-obligations', () => {
    expect(modules.some(m => m.meta.id === '04-taux-obligations')).toBe(true);
  });
  it('getModule retourne le bon module avec numero 4', () => {
    expect(getModule('04-taux-obligations')!.meta.numero).toBe(4);
  });
  it('getModule retourne undefined pour un id inconnu', () => {
    expect(getModule('zzz')).toBeUndefined();
  });
  it('les helpers flatMap retournent des tableaux', () => {
    expect(Array.isArray(tousLesGenerateurs())).toBe(true);
    expect(Array.isArray(tousLesProblemes())).toBe(true);
    expect(Array.isArray(touteLaBanqueQcm())).toBe(true);
    expect(Array.isArray(toutesLesQuestionsJury())).toBe(true);
    expect(Array.isArray(toutesLesFlashcards())).toBe(true);
  });
});
