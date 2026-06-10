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
  {
    meta: { id: 'ch5', titre: 'La courbe des taux', ordre: 5 },
    charger: () => import('./chapters/05-la-courbe-des-taux.mdx'),
  },
  {
    meta: { id: 'ch6', titre: 'Duration & convexité', ordre: 6 },
    charger: () => import('./chapters/06-duration-convexite.mdx'),
  },
  {
    meta: { id: 'ch7', titre: 'Le marché obligataire en pratique', ordre: 7 },
    charger: () => import('./chapters/07-marche-obligataire-en-pratique.mdx'),
  },
  {
    meta: { id: 'synthese', titre: 'Synthèse du module', ordre: 8 },
    charger: () => import('./chapters/08-synthese.mdx'),
  },
];
