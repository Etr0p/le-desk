import { describe, expect, it } from 'vitest';
import { nouvelleCarte, reviser, cartesDues, addJours, aujourdHuiLocal } from './srs';

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

  // Fix 1a — date locale
  it('aujourdHuiLocal retourne la date locale (pas UTC)', () => {
    // month index 6 = July; this would fail with toISOString in TZ east of UTC before ~1-2 am
    expect(aujourdHuiLocal(new Date(2026, 6, 1, 0, 30))).toBe('2026-07-01');
  });

  // Fix 1b — difficile progresse toujours d'au moins 1 jour
  it('difficile : ease baisse, l\'intervalle progresse toujours d\'au moins 1 jour', () => {
    let c = nouvelleCarte('2026-07-01');
    c = reviser(c, 'bien', '2026-07-01');      // interval 1
    c = reviser(c, 'difficile', '2026-07-02');
    expect(c.ease).toBeCloseTo(2.35);
    expect(c.intervalJours).toBe(2);            // max(1+1, round(1×1.2)=1) = 2
    expect(c.repetitions).toBe(2);
  });

  // Fix 1c — plafond 3650 jours
  it('l\'intervalle est plafonné à 3650 jours', () => {
    let c = nouvelleCarte('2026-07-01');
    for (let i = 0; i < 60; i++) c = reviser(c, 'facile', '2026-07-01');
    expect(c.intervalJours).toBeLessThanOrEqual(3650);
    expect(() => reviser(c, 'facile', '2026-07-01')).not.toThrow();
  });

  // cartesDues inclut l'échéance du jour même
  it('cartesDues inclut l\'échéance du jour même', () => {
    const etats = { a: { ...nouvelleCarte('2026-07-01') } };
    expect(cartesDues(etats, '2026-07-01')).toEqual(['a']);
  });

  // addJours passage de mois et jours négatifs
  it('addJours gère les passages de mois et les jours négatifs', () => {
    expect(addJours('2026-03-01', -1)).toBe('2026-02-28');
    expect(addJours('2026-12-31', 1)).toBe('2027-01-01');
  });
});
