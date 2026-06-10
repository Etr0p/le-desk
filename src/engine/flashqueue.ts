import { mulberry32, shuffle } from './rng';
import { cartesDues } from './srs';
import type { EtatApp } from './storage';
import type { Flashcard } from './types';

/**
 * Calcule un aperçu de la file du jour sans construire la file complète.
 * Utile pour l'écran de configuration (compteurs « à réviser » / « nouvelles »).
 */
export function apercuFileDuJour(
  cartes: Flashcard[],
  etat: EtatApp,
  aujourdHui: string,
): { dues: number; nouvelles: number } {
  const idsDues = new Set(cartesDues(etat.cartes, aujourdHui));
  const dues = cartes.filter(c => idsDues.has(c.id)).length;

  const introduitesAujourdhui = Object.values(etat.cartesIntroduites).filter(
    d => d === aujourdHui,
  ).length;
  const capNouvelles = Math.max(
    0,
    etat.reglages.nouvellesCartesParJour - introduitesAujourdhui,
  );

  let nouvelles = 0;
  for (const carte of cartes) {
    if (nouvelles >= capNouvelles) break;
    if (etat.cartesIntroduites[carte.id] !== undefined) continue;
    if (idsDues.has(carte.id)) continue;
    nouvelles++;
  }

  return { dues, nouvelles };
}

/**
 * Construit la file de flashcards du jour :
 * - Toutes les cartes dues (écheance <= aujourd'hui, présentes dans `cartes`)
 * - Plus des nouvelles cartes (jamais introduites) en ordre deck, plafonnées à
 *   (nouvellesCartesParJour − nombre d'introductions déjà faites aujourd'hui)
 * - Résultat mélangé de façon déterministe par seed
 */
export function fileDuJour(
  cartes: Flashcard[],
  etat: EtatApp,
  aujourdHui: string,
  seed: number,
): Flashcard[] {
  const rng = mulberry32(seed);

  // Index deck par id pour intersection rapide
  const deckParId = new Map<string, Flashcard>(cartes.map(c => [c.id, c]));

  // 1. Cartes dues (intersection avec le deck)
  const idsDues = new Set(cartesDues(etat.cartes, aujourdHui));
  const cartesDuesPresentes: Flashcard[] = [];
  for (const id of idsDues) {
    const carte = deckParId.get(id);
    if (carte) cartesDuesPresentes.push(carte);
  }

  // 2. Nouvelles cartes (jamais dans cartesIntroduites)
  //    Réduire le cap par le nombre d'introductions déjà faites aujourd'hui
  const introduitesAujourdhui = Object.values(etat.cartesIntroduites).filter(
    date => date === aujourdHui,
  ).length;
  const capNouvelles = Math.max(
    0,
    etat.reglages.nouvellesCartesParJour - introduitesAujourdhui,
  );

  // Nouvelles = pas dans cartesIntroduites du tout (même hier)
  // ET pas dans les dues (une due peut ne pas être introduite théoriquement,
  //    dans ce cas elle compte comme due, pas comme nouvelle)
  const nouvelles: Flashcard[] = [];
  for (const carte of cartes) {
    if (nouvelles.length >= capNouvelles) break;
    if (etat.cartesIntroduites[carte.id] !== undefined) continue; // déjà introduite
    if (idsDues.has(carte.id)) continue; // due → déjà comptée ci-dessus
    nouvelles.push(carte);
  }

  // 3. Assembler et mélanger
  const file = [...cartesDuesPresentes, ...nouvelles];
  return shuffle(rng, file);
}
