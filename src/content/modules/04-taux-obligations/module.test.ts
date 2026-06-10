import { describe, expect, it } from 'vitest';
import { getModule } from '../../../engine/registry';

describe('module 4 — cibles de la spec (phase 1)', () => {
  const m = getModule('04-taux-obligations')!;

  it('est complet', () => {
    expect(m.chapitres.length).toBe(8); // 7 chapitres + synthèse
    expect(m.exercices.length).toBeGreaterThanOrEqual(13);
    expect(m.problemes.length).toBeGreaterThanOrEqual(16);
    expect(m.problemes.reduce((a, p) => a + p.scenarios.length, 0)).toBeGreaterThanOrEqual(45);
    expect(m.qcm.length).toBeGreaterThanOrEqual(60);
    expect(m.jury.length).toBeGreaterThanOrEqual(25);
    expect(m.flashcards.length).toBeGreaterThanOrEqual(80);
    expect(m.formules.length).toBeGreaterThanOrEqual(18);
  });

  it('couvre les 4 niveaux de difficulté en entraînement', () => {
    for (const n of [1, 2, 3, 4] as const) {
      expect([...m.exercices, ...m.problemes].some(x => x.difficulte === n)).toBe(true);
    }
  });

  it('est intégralement bilingue', () => {
    expect(m.chapitres.every(c => c.chargerEn && c.meta.titreEn)).toBe(true);
    expect(m.qcm.every(q => q.questionEn && q.optionsEn?.length === 4 && q.explicationsEn?.length === 4)).toBe(true);
    expect(m.jury.every(j => j.questionEn && j.reponseModeleEn && j.planEn && j.pointsAttendusEn)).toBe(true);
    expect(m.flashcards.every(f => f.rectoEn && f.versoEn)).toBe(true);
    expect(m.formules.every(f => f.nomEn)).toBe(true);
    // Générateurs : même seed ⇒ même réponse dans les deux langues, énoncés distincts
    for (const g of m.exercices) {
      const fr = g.generate(99, 'fr');
      const en = g.generate(99, 'en');
      expect(en.reponse).toBe(fr.reponse);
      expect(en.enonce).not.toBe(fr.enonce);
    }
    for (const p of m.problemes) {
      expect(p.scenariosEn?.length).toBe(p.scenarios.length);
      const fr = p.generate(99, 0, 'fr');
      const en = p.generate(99, 0, 'en');
      expect(en.sousQuestions.map(s => s.reponse)).toEqual(fr.sousQuestions.map(s => s.reponse));
    }
  });
});
