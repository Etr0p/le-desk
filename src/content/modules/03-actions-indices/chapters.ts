import type { ChapitreRef } from '../../../engine/types';

// Versions anglaises : chargerEn + titreEn seront branchés avec la vague de
// traduction du module (même mécanique que les modules 1, 2 et 4).
export const chapitres: ChapitreRef[] = [
  {
    meta: { id: 'ch1', titre: "L'action, part de propriété", ordre: 1 },
    charger: () => import('./chapters/01-l-action-part-de-propriete.mdx'),
  },
  {
    meta: { id: 'ch2', titre: 'Valoriser par les flux : DDM et DCF', ordre: 2 },
    charger: () => import('./chapters/02-valoriser-par-les-flux.mdx'),
  },
  {
    meta: { id: 'ch3', titre: 'Valoriser par les multiples', ordre: 3 },
    charger: () => import('./chapters/03-valoriser-par-les-multiples.mdx'),
  },
  {
    meta: { id: 'ch4', titre: 'Les indices : thermomètres et produits', ordre: 4 },
    charger: () => import('./chapters/04-les-indices.mdx'),
  },
  {
    meta: { id: 'ch5', titre: 'La vie du titre : dividendes, splits, opérations', ordre: 5 },
    charger: () => import('./chapters/05-la-vie-du-titre.mdx'),
  },
  {
    meta: { id: 'ch6', titre: "IPO : l'entrée en bourse", ordre: 6 },
    charger: () => import('./chapters/06-ipo-et-marche-primaire.mdx'),
  },
  {
    meta: { id: 'ch7', titre: 'Short selling et efficience', ordre: 7 },
    charger: () => import('./chapters/07-short-selling-et-efficience.mdx'),
  },
];
