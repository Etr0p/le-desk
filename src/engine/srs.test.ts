import { describe, expect, it } from 'vitest';
import { nouvelleCarte, reviser, cartesDues, addJours } from './srs';

describe('srs', () => {
  const J = '2026-07-01';
  it('addJours', () => { expect(addJours('2026-07-01', 3)).toBe('2026-07-04'); });
  it('nouvelle carte due aujourd\'hui', () => {
    expect(nouvelleCarte(J).echeance).toBe(J);
  });
  it('bien : 1 j puis 3 j puis ~ intervalle × ease', () => {
    let c = nouvelleCarte(J);
    c = reviser(c, 'bien', J);
    expect(c.intervalJours).toBe(1); expect(c.echeance).toBe('2026-07-02');
    c = reviser(c, 'bien', '2026-07-02');
    expect(c.intervalJours).toBe(3);
    c = reviser(c, 'bien', '2026-07-05');
    expect(c.intervalJours).toBe(Math.round(3 * 2.5)); // 8
  });
  it('encore : remise à zéro le jour même, ease baisse (plancher 1.3)', () => {
    let c = nouvelleCarte(J);
    c = reviser(c, 'bien', J); c = reviser(c, 'encore', '2026-07-02');
    expect(c.intervalJours).toBe(0); expect(c.echeance).toBe('2026-07-02');
    expect(c.repetitions).toBe(0); expect(c.ease).toBeCloseTo(2.3);
    for (let i = 0; i < 10; i++) c = reviser(c, 'encore', J);
    expect(c.ease).toBeGreaterThanOrEqual(1.3);
  });
  it('facile : ease monte (plafond 3.0), intervalle accéléré', () => {
    let c = nouvelleCarte(J);
    c = reviser(c, 'facile', J);
    expect(c.intervalJours).toBe(2); expect(c.ease).toBeCloseTo(2.65);
  });
  it('cartesDues filtre par échéance', () => {
    const etats = { a: nouvelleCarte('2026-06-30'), b: { ...nouvelleCarte(J), echeance: '2026-07-09' } };
    expect(cartesDues(etats, J)).toEqual(['a']);
  });
});
