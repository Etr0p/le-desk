import { describe, expect, it } from 'vitest';
import { jury } from './jury';

const M2 = '02-methodes-quantitatives';

describe('module 2 — questions jury', () => {
  it('contient au moins 25 questions', () => {
    expect(jury.length).toBeGreaterThanOrEqual(25);
  });

  it('ids uniques au format m2-jury-NN', () => {
    const ids = jury.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^m2-jury-\d{2}$/);
  });

  it('au moins 4 questions de difficulté 4', () => {
    expect(jury.filter((q) => q.difficulte === 4).length).toBeGreaterThanOrEqual(4);
  });

  it('couvre les niveaux 1 à 4', () => {
    for (const n of [1, 2, 3, 4]) {
      expect(jury.some((q) => q.difficulte === n)).toBe(true);
    }
  });

  for (const q of jury) {
    describe(q.id, () => {
      it('structure FR complète', () => {
        expect(q.moduleId).toBe(M2);
        expect(q.theme.length).toBeGreaterThan(0);
        expect(q.question.length).toBeGreaterThan(10);
        expect(q.plan.length).toBeGreaterThanOrEqual(3);
        expect(q.plan.length).toBeLessThanOrEqual(4);
        expect(q.pointsAttendus.length).toBeGreaterThanOrEqual(4);
        expect(q.pointsAttendus.length).toBeLessThanOrEqual(6);
        expect(q.reponseModele.length).toBeGreaterThanOrEqual(400);
        expect(q.bonus).toBeDefined();
        expect(q.bonus!.length).toBeGreaterThanOrEqual(1);
        expect(q.bonus!.length).toBeLessThanOrEqual(3);
      });

      it('version EN complète et alignée sur la FR', () => {
        expect(q.questionEn).toBeDefined();
        expect(q.questionEn!.length).toBeGreaterThan(10);
        expect(q.themeEn).toBeDefined();
        expect(q.themeEn!.length).toBeGreaterThan(0);
        expect(q.planEn).toBeDefined();
        expect(q.planEn!.length).toBe(q.plan.length);
        expect(q.pointsAttendusEn).toBeDefined();
        expect(q.pointsAttendusEn!.length).toBe(q.pointsAttendus.length);
        expect(q.bonusEn).toBeDefined();
        expect(q.bonusEn!.length).toBe(q.bonus!.length);
        expect(q.reponseModeleEn).toBeDefined();
        expect(q.reponseModeleEn!.length).toBeGreaterThanOrEqual(400);
      });

      it('aucun contenu cassé ni élément vide', () => {
        const tout = [
          q.question,
          q.questionEn!,
          q.reponseModele,
          q.reponseModeleEn!,
          ...q.plan,
          ...q.planEn!,
          ...q.pointsAttendus,
          ...q.pointsAttendusEn!,
          ...(q.bonus ?? []),
          ...(q.bonusEn ?? []),
        ];
        for (const texte of tout) {
          expect(texte.trim().length).toBeGreaterThan(0);
          expect(texte).not.toMatch(/undefined|NaN|\[object/);
        }
      });
    });
  }
});
