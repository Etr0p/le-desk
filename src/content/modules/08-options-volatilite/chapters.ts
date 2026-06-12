import type { ChapitreRef } from '../../../engine/types';

// Câblage FR des 7 chapitres — les `chargerEn`/`titreEn` et la synthèse (ordre 8)
// viendront avec la vague de traductions.
export const chapitres: ChapitreRef[] = [
  {
    meta: { id: 'ch1', titre: "L'option : le droit sans l'obligation", ordre: 1 },
    charger: () => import('./chapters/01-le-droit-sans-obligation.mdx'),
  },
  {
    meta: { id: 'ch2', titre: 'Payoffs et stratégies', ordre: 2 },
    charger: () => import('./chapters/02-payoffs-et-strategies.mdx'),
  },
  {
    meta: { id: 'ch3', titre: 'La parité call-put', ordre: 3 },
    charger: () => import('./chapters/03-la-parite-call-put.mdx'),
  },
  {
    meta: { id: 'ch4', titre: 'Pricer une option : du binomial à Black-Scholes', ordre: 4 },
    charger: () => import('./chapters/04-du-binomial-a-black-scholes.mdx'),
  },
  {
    meta: { id: 'ch5', titre: 'Les grecques et le delta-hedging', ordre: 5 },
    charger: () => import('./chapters/05-les-grecques-et-le-delta-hedging.mdx'),
  },
  {
    meta: { id: 'ch6', titre: 'La volatilité : implicite, réalisée, smile', ordre: 6 },
    charger: () => import('./chapters/06-la-volatilite-implicite-et-le-smile.mdx'),
  },
  {
    meta: { id: 'ch7', titre: 'Usages, risques et accidents célèbres', ordre: 7 },
    charger: () => import('./chapters/07-usages-risques-accidents.mdx'),
  },
];
