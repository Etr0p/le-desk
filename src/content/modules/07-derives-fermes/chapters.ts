import type { ChapitreRef } from '../../../engine/types';

export const chapitres: ChapitreRef[] = [
  {
    meta: { id: 'ch1', titre: "L'engagement ferme : la logique du dérivé", ordre: 1 },
    charger: () => import('./chapters/01-l-engagement-ferme.mdx'),
  },
  {
    meta: { id: 'ch2', titre: 'Futures, marges et chambre de compensation', ordre: 2 },
    charger: () => import('./chapters/02-futures-marges-et-chambre.mdx'),
  },
  {
    meta: { id: 'ch3', titre: 'Le pricing par cash-and-carry', ordre: 3 },
    charger: () => import('./chapters/03-pricing-cash-and-carry.mdx'),
  },
  {
    meta: { id: 'ch4', titre: 'FRA et futures de taux', ordre: 4 },
    charger: () => import('./chapters/04-fra-et-futures-de-taux.mdx'),
  },
  {
    meta: { id: 'ch5', titre: 'Le swap de taux', ordre: 5 },
    charger: () => import('./chapters/05-le-swap-de-taux.mdx'),
  },
  {
    meta: { id: 'ch6', titre: 'La famille des swaps', ordre: 6 },
    charger: () => import('./chapters/06-la-famille-des-swaps.mdx'),
  },
  {
    meta: { id: 'ch7', titre: 'Usages, risques et accidents célèbres', ordre: 7 },
    charger: () => import('./chapters/07-usages-risques-accidents.mdx'),
  },
];
