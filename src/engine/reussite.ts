import type { Tentative } from './storage';

// Seuil d'acquisition : un exercice est acquis à 100 %, un problème à ≥ 75 %
// de sous-questions justes (les corrigés restent consultables dans tous les cas).
export const SEUIL_PROBLEME = 0.75;

export function tentativeReussie(t: Tentative): boolean {
  return t.type === 'probleme' ? t.reussite >= SEUIL_PROBLEME : t.reussite >= 1;
}
