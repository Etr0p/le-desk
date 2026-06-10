import type { ChapitreRef } from '../../../engine/types';

export const chapitres: ChapitreRef[] = [
  {
    meta: { id: 'ch1', titre: "Le temps, c'est de l'argent : taux et conventions", ordre: 1 },
    charger: () => import('./chapters/01-taux-et-conventions.mdx'),
  },
  {
    meta: { id: 'ch2', titre: "L'obligation, l'instrument roi", ordre: 2 },
    charger: () => import('./chapters/02-obligation-instrument-roi.mdx'),
  },
  {
    meta: { id: 'ch3', titre: 'Pricer une obligation', ordre: 3 },
    charger: () => import('./chapters/03-pricer-une-obligation.mdx'),
  },
  {
    meta: { id: 'ch4', titre: 'Le rendement', ordre: 4 },
    charger: () => import('./chapters/04-le-rendement.mdx'),
  },
];
