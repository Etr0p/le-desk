import type { ChapitreRef } from '../../../engine/types';

export const chapitres: ChapitreRef[] = [
  {
    meta: { id: 'ch1', titre: 'Le marché des changes', ordre: 1 },
    charger: () => import('./chapters/01-le-marche-des-changes.mdx'),
  },
  {
    meta: { id: 'ch2', titre: 'Forwards et parité couverte des taux', ordre: 2 },
    charger: () => import('./chapters/02-forwards-et-parite-couverte.mdx'),
  },
  {
    meta: { id: 'ch3', titre: 'Parités économiques et carry trade', ordre: 3 },
    charger: () => import('./chapters/03-parites-economiques-et-carry.mdx'),
  },
  {
    meta: { id: 'ch4', titre: 'Régimes de change : du peg à la crise', ordre: 4 },
    charger: () => import('./chapters/04-regimes-de-change.mdx'),
  },
  {
    meta: { id: 'ch5', titre: "Matières premières : l'actif qui se stocke", ordre: 5 },
    charger: () => import('./chapters/05-matieres-premieres.mdx'),
  },
  {
    meta: { id: 'ch6', titre: 'Contango et backwardation', ordre: 6 },
    charger: () => import('./chapters/06-contango-backwardation.mdx'),
  },
  {
    meta: { id: 'ch7', titre: 'Crypto et actifs numériques', ordre: 7 },
    charger: () => import('./chapters/07-crypto-actifs-numeriques.mdx'),
  },
];
