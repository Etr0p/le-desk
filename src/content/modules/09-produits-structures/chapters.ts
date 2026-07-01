import type { ChapitreRef } from '../../../engine/types';

// Câblage FR des 7 chapitres — les `chargerEn`/`titreEn` et la synthèse (ordre 8)
// viendront avec la vague de traductions.
export const chapitres: ChapitreRef[] = [
  {
    meta: { id: 'ch1', titre: 'Le structuré : une promesse en briques', ordre: 1 },
    charger: () => import('./chapters/01-la-promesse-en-briques.mdx'),
  },
  {
    meta: { id: 'ch2', titre: 'Le capital garanti et sa participation', ordre: 2 },
    charger: () => import('./chapters/02-le-capital-garanti.mdx'),
  },
  {
    meta: { id: 'ch3', titre: 'Le reverse convertible : vendre un put sans le savoir', ordre: 3 },
    charger: () => import('./chapters/03-le-reverse-convertible.mdx'),
  },
  {
    meta: { id: 'ch4', titre: "L'autocall : la machine à coupons conditionnels", ordre: 4 },
    charger: () => import('./chapters/04-l-autocall.mdx'),
  },
  {
    meta: { id: 'ch5', titre: 'Barrières, worst-of : les ingrédients du rendement', ordre: 5 },
    charger: () => import('./chapters/05-barrieres-worst-of-correlation.mdx'),
  },
  {
    meta: { id: 'ch6', titre: 'Pricer par Monte-Carlo : la machine du desk', ordre: 6 },
    charger: () => import('./chapters/06-pricer-par-monte-carlo.mdx'),
  },
  {
    meta: { id: 'ch7', titre: 'Term sheet, marge et accidents', ordre: 7 },
    charger: () => import('./chapters/07-term-sheet-marge-accidents.mdx'),
  },
];
