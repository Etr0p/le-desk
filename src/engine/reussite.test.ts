import { describe, expect, it } from 'vitest';
import { tentativeReussie } from './reussite';
import type { Tentative } from './storage';

const base: Omit<Tentative, 'type' | 'reussite'> = {
  date: '2026-01-01',
  refId: 'test-id',
  moduleId: 'test-module',
};

describe('tentativeReussie', () => {
  it('exercice à 1 (réussi) => true', () => {
    const t: Tentative = { ...base, type: 'exercice', reussite: 1 };
    expect(tentativeReussie(t)).toBe(true);
  });

  it('exercice à 0 (raté) => false', () => {
    const t: Tentative = { ...base, type: 'exercice', reussite: 0 };
    expect(tentativeReussie(t)).toBe(false);
  });

  it('problème à 0.75 (seuil exact) => true', () => {
    const t: Tentative = { ...base, type: 'probleme', reussite: 0.75 };
    expect(tentativeReussie(t)).toBe(true);
  });

  it('problème à 0.5 (sous le seuil) => false', () => {
    const t: Tentative = { ...base, type: 'probleme', reussite: 0.5 };
    expect(tentativeReussie(t)).toBe(false);
  });
});
