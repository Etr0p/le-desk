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
