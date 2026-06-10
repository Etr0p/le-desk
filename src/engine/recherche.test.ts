import { describe, expect, it } from 'vitest';
import { normaliser, chercher } from './recherche';

/* ─── normaliser ─── */

describe('normaliser', () => {
  it('convertit en minuscules', () => {
    expect(normaliser('DURATION')).toBe('duration');
  });

  it('supprime les accents', () => {
    expect(normaliser('échéance')).toBe('echeance');
    expect(normaliser('Durée')).toBe('duree');
    expect(normaliser('côté')).toBe('cote');
  });

  it('chaîne vide → chaîne vide', () => {
    expect(normaliser('')).toBe('');
  });

  it('combinaison accents + majuscules', () => {
    expect(normaliser('Convexité')).toBe('convexite');
  });
});

/* ─── chercher ─── */

interface Terme { nom: string; synonyme?: string }

function nomsCles(item: Terme) {
  return item.synonyme ? [item.nom, item.synonyme] : [item.nom];
}

const items: Terme[] = [
  { nom: 'Duration de Macaulay', synonyme: 'Macaulay Duration' },
  { nom: 'Convexité' },
  { nom: 'échéance', synonyme: 'maturity' },
  { nom: 'Couverture taux' },
  { nom: 'Duration modifiée' },
];

describe('chercher', () => {
  it('requête vide → tous les items', () => {
    const res = chercher(items, '', nomsCles);
    expect(res).toHaveLength(items.length);
  });

  it('« duration » trouve « Duration de Macaulay » et « Duration modifiée »', () => {
    const res = chercher(items, 'duration', nomsCles);
    expect(res.some(r => r.nom === 'Duration de Macaulay')).toBe(true);
    expect(res.some(r => r.nom === 'Duration modifiée')).toBe(true);
    expect(res).not.toContainEqual(expect.objectContaining({ nom: 'Convexité' }));
  });

  it('« echeance » trouve « échéance » (strip accents)', () => {
    const res = chercher(items, 'echeance', nomsCles);
    expect(res).toHaveLength(1);
    expect(res[0].nom).toBe('échéance');
  });

  it('recherche par synonyme EN', () => {
    const res = chercher(items, 'maturity', nomsCles);
    expect(res).toHaveLength(1);
    expect(res[0].nom).toBe('échéance');
  });

  it('multi-mots : chaque mot doit être présent dans au moins une clé', () => {
    const res = chercher(items, 'duration modifiee', nomsCles);
    expect(res).toHaveLength(1);
    expect(res[0].nom).toBe('Duration modifiée');
  });

  it('préfixe de la première clé trié en premier', () => {
    // 'dur' est un préfixe de 'Duration de Macaulay' et 'Duration modifiée'
    const res = chercher(items, 'dur', nomsCles);
    expect(res.length).toBeGreaterThanOrEqual(2);
    // Les deux items commençant par 'dur' doivent arriver en premier
    const prefixes = res.filter(r => normaliser(r.nom).startsWith('dur'));
    const nonPrefixes = res.filter(r => !normaliser(r.nom).startsWith('dur'));
    if (prefixes.length > 0 && nonPrefixes.length > 0) {
      const lastPrefixIdx = res.indexOf(prefixes[prefixes.length - 1]);
      const firstNonPrefixIdx = res.indexOf(nonPrefixes[0]);
      expect(lastPrefixIdx).toBeLessThan(firstNonPrefixIdx);
    }
  });

  it('aucun résultat si mot introuvable', () => {
    const res = chercher(items, 'stochastique', nomsCles);
    expect(res).toHaveLength(0);
  });
});
