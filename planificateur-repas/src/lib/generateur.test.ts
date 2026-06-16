import { describe, expect, it } from 'vitest';
import { genererSemaine } from './generateur';
import type { Criteres, Plat, SemaineGeneree } from '../types';

const plats: Plat[] = [
  { id: 'v1', nom: 'Veg 1', categorie: 'vegetarien' },
  { id: 'v2', nom: 'Veg 2', categorie: 'vegetarien' },
  { id: 'v3', nom: 'Veg 3', categorie: 'vegetarien' },
  { id: 'p1', nom: 'Pates 1', categorie: 'pates' },
  { id: 'p2', nom: 'Pates 2', categorie: 'pates' },
  { id: 'm1', nom: 'Viande 1', categorie: 'viande' },
  { id: 'm2', nom: 'Viande 2', categorie: 'viande' },
  { id: 'm3', nom: 'Viande 3', categorie: 'viande' },
  { id: 'o1', nom: 'Oeufs 1', categorie: 'oeufs' },
  { id: 'o2', nom: 'Oeufs 2', categorie: 'oeufs' },
];

// Total égal à la somme des quotas : la composition est alors exacte.
const criteresExacts: Criteres = {
  totalRepas: 6,
  parCategorie: { vegetarien: 2, pates: 1, viande: 2, oeufs: 1 },
  eviterRepetitionSemaines: 1,
};

// Total supérieur à la somme des quotas : un repas « libre » s'ajoute.
const criteresAvecComplement: Criteres = {
  totalRepas: 7,
  parCategorie: { vegetarien: 2, pates: 1, viande: 2, oeufs: 1 },
  eviterRepetitionSemaines: 1,
};

describe('genererSemaine', () => {
  it('respecte exactement les quotas quand le total y est égal', () => {
    const { repas, avertissements } = genererSemaine(plats, criteresExacts, [], 42);
    const compte = (cat: string) => repas.filter((r) => r.categorie === cat).length;
    expect(compte('vegetarien')).toBe(2);
    expect(compte('pates')).toBe(1);
    expect(compte('viande')).toBe(2);
    expect(compte('oeufs')).toBe(1);
    expect(avertissements).toHaveLength(0);
  });

  it('traite les quotas comme des minimums respectés', () => {
    const { repas } = genererSemaine(plats, criteresAvecComplement, [], 42);
    const compte = (cat: string) => repas.filter((r) => r.categorie === cat).length;
    expect(compte('vegetarien')).toBeGreaterThanOrEqual(2);
    expect(compte('pates')).toBeGreaterThanOrEqual(1);
    expect(compte('viande')).toBeGreaterThanOrEqual(2);
    expect(compte('oeufs')).toBeGreaterThanOrEqual(1);
  });

  it('atteint le nombre total de repas', () => {
    const { repas } = genererSemaine(plats, criteresAvecComplement, [], 42);
    expect(repas).toHaveLength(7);
  });

  it('ne place jamais deux fois le même plat dans une semaine', () => {
    const { repas } = genererSemaine(plats, criteresAvecComplement, [], 123);
    const ids = repas.map((r) => r.platId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('est déterministe pour une même graine', () => {
    const a = genererSemaine(plats, criteresAvecComplement, [], 7);
    const b = genererSemaine(plats, criteresAvecComplement, [], 7);
    expect(a.repas).toEqual(b.repas);
  });

  it('évite les plats des semaines récentes quand c’est possible', () => {
    const peuDePlats: Plat[] = [
      { id: 'a', nom: 'A', categorie: 'vegetarien' },
      { id: 'b', nom: 'B', categorie: 'vegetarien' },
    ];
    const criteres: Criteres = {
      totalRepas: 1,
      parCategorie: { vegetarien: 1 },
      eviterRepetitionSemaines: 1,
    };
    const historique: SemaineGeneree[] = [
      {
        id: 's1',
        dateGeneration: '2026-01-01',
        repas: [{ jour: 'Lundi', platId: 'a', nom: 'A', categorie: 'vegetarien' }],
      },
    ];
    // Sur plusieurs graines, le plat « a » (récent) ne doit jamais sortir
    // tant qu'un plat frais (« b ») est disponible.
    for (let g = 0; g < 20; g++) {
      const { repas } = genererSemaine(peuDePlats, criteres, historique, g);
      expect(repas[0].platId).toBe('b');
    }
  });

  it('avertit quand une catégorie manque de plats', () => {
    const criteres: Criteres = {
      totalRepas: 3,
      parCategorie: { poisson: 2 },
      eviterRepetitionSemaines: 0,
    };
    const { avertissements } = genererSemaine(plats, criteres, [], 1);
    expect(avertissements.some((a) => a.includes('Poisson'))).toBe(true);
  });
});
