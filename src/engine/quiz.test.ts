import { describe, expect, it } from 'vitest';
import { composerSession, corrigerSession } from './quiz';
import type { QcmQuestion } from './types';

const banque: QcmQuestion[] = Array.from({ length: 30 }, (_, i) => ({
  id: `q${i}`, moduleId: `m${i % 3}`, theme: `t${i % 5}`, difficulte: ((i % 4) + 1) as 1 | 2 | 3 | 4,
  question: `Q${i} ?`, options: ['A', 'B', 'C', 'D'], bonneReponse: i % 4,
  explications: ['', '', '', ''],
}));

describe('composerSession', () => {
  it('tire sans doublon, déterministe par seed, respecte le filtre module', () => {
    const s = composerSession(banque, { nb: 10, moduleIds: ['m0'], seed: 1 });
    expect(s).toHaveLength(10);
    expect(new Set(s.map(x => x.question.id)).size).toBe(10);
    expect(s.every(x => x.question.moduleId === 'm0')).toBe(true);
    expect(composerSession(banque, { nb: 10, moduleIds: ['m0'], seed: 1 })).toEqual(s);
  });
  it('mélange les options avec remap (ordreOptions = permutation de 0..3)', () => {
    const s = composerSession(banque, { nb: 5, seed: 2 });
    for (const x of s) expect([...x.ordreOptions].sort()).toEqual([0, 1, 2, 3]);
  });
  it('borne nb à la taille du pool', () => {
    expect(composerSession(banque, { nb: 99, moduleIds: ['m1'], seed: 3 })).toHaveLength(10);
  });
  it('filtre par difficulté', () => {
    const s = composerSession(banque, { nb: 99, difficultes: [4], seed: 5 });
    expect(s.length).toBeGreaterThan(0);
    expect(s.every(x => x.question.difficulte === 4)).toBe(true);
  });
  it('anti-identité : au moins une question a ordreOptions ≠ [0,1,2,3]', () => {
    const s = composerSession(banque, { nb: 5, seed: 1 });
    expect(s.some(x => x.ordreOptions.join(',') !== '0,1,2,3')).toBe(true);
  });
  it('stabilité de l\'ordre des options : indépendant de la taille de la banque', () => {
    const seed = 7;
    const s1 = composerSession(banque, { nb: 5, seed });
    const ordres1 = Object.fromEntries(s1.map(x => [x.question.id, x.ordreOptions.slice()]));

    // Banque augmentée d'une question supplémentaire
    const banqueAugmentee = [...banque, {
      id: 'q99', moduleId: 'm0', theme: 't0', difficulte: 1 as 1 | 2 | 3 | 4,
      question: 'Q99 ?', options: ['A', 'B', 'C', 'D'], bonneReponse: 0, explications: ['', '', '', ''],
    }];
    const s2 = composerSession(banqueAugmentee, { nb: 5, seed });
    const ordres2 = Object.fromEntries(s2.map(x => [x.question.id, x.ordreOptions.slice()]));

    // Pour chaque id présent dans les deux sessions, l'ordre doit être identique
    for (const id of Object.keys(ordres1)) {
      if (id in ordres2) {
        expect(ordres2[id]).toEqual(ordres1[id]);
      }
    }
  });
  it('nb négatif retourne []', () => {
    expect(composerSession(banque, { nb: -1, seed: 1 })).toEqual([]);
  });
});
describe('corrigerSession', () => {
  it('score et ventilation par thème ; null = faux', () => {
    const s = composerSession(banque, { nb: 4, seed: 4 });
    const reps = s.map((x, i) => i < 2 ? x.ordreOptions.indexOf(x.question.bonneReponse) : null);
    const r = corrigerSession(s, reps);
    expect(r.bonnes).toBe(2); expect(r.total).toBe(4);
    const sommeThemes = Object.values(r.parTheme).reduce((a, t) => a + t.total, 0);
    expect(sommeThemes).toBe(4);
    expect(r.details).toHaveLength(4);
    expect(r.details[0].correcte).toBe(true);
    expect(r.details[3].reponseDonnee).toBeNull();
    expect(r.details[3].correcte).toBe(false);
  });
});
