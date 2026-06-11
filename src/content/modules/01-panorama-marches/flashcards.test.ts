import { describe, expect, it } from 'vitest';
import { flashcards } from './flashcards';
import { glossaire } from '../../glossary';

const M1 = '01-panorama-marches';

describe('flashcards module 1', () => {
  it('contient au moins 120 cartes', () => {
    expect(flashcards.length).toBeGreaterThanOrEqual(120);
  });

  it('a des ids uniques et bien formés couvrant m1-fc-001 à m1-fc-120', () => {
    const ids = flashcards.map(c => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^m1-fc-\d{3}$/);
    }
    const attendus = Array.from({ length: 120 }, (_, i) => `m1-fc-${String(i + 1).padStart(3, '0')}`);
    for (const id of attendus) {
      expect(ids, `id manquant : ${id}`).toContain(id);
    }
  });

  it('a le bon moduleId partout', () => {
    for (const c of flashcards) {
      expect(c.moduleId).toBe(M1);
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

  it('respecte les quotas par tag : 32 définitions, 12 formules, 16 ordres de grandeur, 22 pièges, 24 réflexes jury, 14 calculs mentaux', () => {
    const count = (tag: string) => flashcards.filter(c => c.tags.includes(tag)).length;
    expect(count('definition')).toBe(32);
    expect(count('formule')).toBe(12);
    expect(count('ordre-de-grandeur')).toBe(16);
    expect(count('piege')).toBe(22);
    expect(count('reflexe-jury')).toBe(24);
    expect(count('calcul-mental')).toBe(14);
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

describe('glossaire du module 1', () => {
  const entreesM1 = glossaire.filter(e => e.moduleId === M1);

  it('contient au moins 32 entrées pour le module 1', () => {
    expect(entreesM1.length).toBeGreaterThanOrEqual(32);
  });

  it('chaque entrée m1 a un terme, un terme anglais (en) et des définitions FR/EN non vides', () => {
    for (const e of entreesM1) {
      expect(e.terme.trim().length, `terme vide`).toBeGreaterThan(0);
      expect(e.en, `en manquant : ${e.terme}`).toBeTruthy();
      expect(e.en!.trim().length, `en vide : ${e.terme}`).toBeGreaterThan(0);
      expect(e.definition.trim().length, `definition vide : ${e.terme}`).toBeGreaterThan(0);
      expect(e.definitionEn, `definitionEn manquante : ${e.terme}`).toBeTruthy();
      expect(e.definitionEn!.trim().length, `definitionEn vide : ${e.terme}`).toBeGreaterThan(0);
    }
  });

  it('les termes m1 sont uniques et ne dupliquent aucun terme existant d\'un autre module', () => {
    const termesM1 = entreesM1.map(e => e.terme);
    expect(new Set(termesM1).size).toBe(termesM1.length);
    const autresTermes = new Set(glossaire.filter(e => e.moduleId !== M1).map(e => e.terme));
    for (const t of termesM1) {
      expect(autresTermes.has(t), `terme dupliqué entre modules : ${t}`).toBe(false);
    }
  });
});
