import { describe, expect, it } from 'vitest';
import { flashcards } from './flashcards';
import { glossaire } from '../../glossary';
import { formules } from './formules';

describe('flashcards module 4', () => {
  it('contient au moins 120 cartes', () => {
    expect(flashcards.length).toBeGreaterThanOrEqual(120);
  });

  it('a des ids uniques et bien formés couvrant m4-fc-01 à m4-fc-120', () => {
    const ids = flashcards.map(c => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^m4-fc-\d{2,3}$/);
    }
    const attendus = Array.from({ length: 120 }, (_, i) => `m4-fc-${String(i + 1).padStart(2, '0')}`);
    for (const id of attendus) {
      expect(ids, `id manquant : ${id}`).toContain(id);
    }
  });

  it('a le bon moduleId partout', () => {
    for (const c of flashcards) {
      expect(c.moduleId).toBe('04-taux-obligations');
    }
  });

  it('recto ≤ 200 caractères et verso non vide', () => {
    for (const c of flashcards) {
      expect(c.recto.length, `recto trop long : ${c.id}`).toBeLessThanOrEqual(200);
      expect(c.recto.trim().length, `recto vide : ${c.id}`).toBeGreaterThan(0);
      expect(c.verso.trim().length, `verso vide : ${c.id}`).toBeGreaterThan(0);
    }
  });

  it('rectoEn et versoEn présents et non vides sur chaque carte', () => {
    for (const c of flashcards) {
      expect(c.rectoEn, `rectoEn manquant : ${c.id}`).toBeTruthy();
      expect(c.versoEn, `versoEn manquant : ${c.id}`).toBeTruthy();
      expect(c.rectoEn!.trim().length, `rectoEn vide : ${c.id}`).toBeGreaterThan(0);
      expect(c.versoEn!.trim().length, `versoEn vide : ${c.id}`).toBeGreaterThan(0);
    }
  });

  it('respecte les quotas par tag : 30 définitions, 20 formules, 12 ordres de grandeur, 26 pièges, 20 réflexes jury, 12 calculs mentaux', () => {
    const count = (tag: string) => flashcards.filter(c => c.tags.includes(tag)).length;
    expect(count('definition')).toBe(30);
    expect(count('formule')).toBe(20);
    expect(count('ordre-de-grandeur')).toBe(12);
    expect(count('piege')).toBe(26);
    expect(count('reflexe-jury')).toBe(20);
    expect(count('calcul-mental')).toBe(12);
  });

  it('chaque carte porte exactement un tag de type plus au moins un tag de thème', () => {
    const types = ['definition', 'formule', 'ordre-de-grandeur', 'piege', 'reflexe-jury', 'calcul-mental'];
    for (const c of flashcards) {
      const typeTags = c.tags.filter(t => types.includes(t));
      expect(typeTags.length, `tag de type : ${c.id}`).toBe(1);
      expect(c.tags.length, `tag de thème manquant : ${c.id}`).toBeGreaterThanOrEqual(2);
    }
  });
});

describe('champs anglais du glossaire et du formulaire', () => {
  it('toutes les entrées du glossaire ont une definitionEn non vide', () => {
    for (const e of glossaire) {
      expect(e.definitionEn, `definitionEn manquante : ${e.terme}`).toBeTruthy();
      expect(e.definitionEn!.trim().length, `definitionEn vide : ${e.terme}`).toBeGreaterThan(0);
    }
  });

  it('toutes les formules ont un nomEn non vide', () => {
    for (const f of formules) {
      expect(f.nomEn, `nomEn manquant : ${f.id}`).toBeTruthy();
      expect(f.nomEn!.trim().length, `nomEn vide : ${f.id}`).toBeGreaterThan(0);
    }
  });
});
