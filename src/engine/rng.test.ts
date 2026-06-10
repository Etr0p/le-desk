import { describe, expect, it } from 'vitest';
import { mulberry32, randInt, randFloat, pick, shuffle } from './rng';

describe('mulberry32', () => {
  it('est déterministe : même seed, même séquence', () => {
    const a = mulberry32(42), b = mulberry32(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });
  it('produit des séquences différentes pour des seeds différents', () => {
    expect(mulberry32(1)()).not.toBe(mulberry32(2)());
  });
  it('reste dans [0, 1)', () => {
    const r = mulberry32(7);
    for (let i = 0; i < 1000; i++) { const v = r(); expect(v).toBeGreaterThanOrEqual(0); expect(v).toBeLessThan(1); }
  });
});
describe('helpers', () => {
  it('randInt couvre les bornes incluses', () => {
    const r = mulberry32(3); const vus = new Set<number>();
    for (let i = 0; i < 500; i++) vus.add(randInt(r, 2, 5));
    expect([...vus].sort()).toEqual([2, 3, 4, 5]);
  });
  it('randFloat respecte bornes et décimales', () => {
    const r = mulberry32(9);
    for (let i = 0; i < 200; i++) {
      const v = randFloat(r, 1, 6, 2);
      expect(v).toBeGreaterThanOrEqual(1); expect(v).toBeLessThanOrEqual(6);
      expect(Math.round(v * 100) / 100).toBe(v);
    }
  });
  it('shuffle est une permutation déterministe', () => {
    const r = mulberry32(5);
    const s = shuffle(r, [1, 2, 3, 4, 5]);
    expect([...s].sort()).toEqual([1, 2, 3, 4, 5]);
    expect(shuffle(mulberry32(5), [1, 2, 3, 4, 5])).toEqual(s);
  });
  it('pick choisit dans la liste', () => {
    expect(['a', 'b']).toContain(pick(mulberry32(1), ['a', 'b']));
  });
});
