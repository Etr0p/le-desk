import type { ChapitreRef } from '../../../engine/types';

export const chapitres: ChapitreRef[] = [
  {
    meta: { id: 'ch1', titre: "Le temps, c'est de l'argent : taux et conventions", ordre: 1, titreEn: 'Time Is Money: Rates and Conventions' },
    charger: () => import('./chapters/01-taux-et-conventions.mdx'),
    chargerEn: () => import('./chapters/en/01-rates-and-conventions.mdx'),
  },
  {
    meta: { id: 'ch2', titre: "L'obligation, l'instrument roi", ordre: 2, titreEn: 'The Bond, King of Instruments' },
    charger: () => import('./chapters/02-obligation-instrument-roi.mdx'),
    chargerEn: () => import('./chapters/en/02-bonds-the-king-instrument.mdx'),
  },
  {
    meta: { id: 'ch3', titre: 'Pricer une obligation', ordre: 3, titreEn: 'Pricing a Bond' },
    charger: () => import('./chapters/03-pricer-une-obligation.mdx'),
    chargerEn: () => import('./chapters/en/03-pricing-a-bond.mdx'),
  },
  {
    meta: { id: 'ch4', titre: 'Le rendement', ordre: 4, titreEn: 'Yield' },
    charger: () => import('./chapters/04-le-rendement.mdx'),
    chargerEn: () => import('./chapters/en/04-yield.mdx'),
  },
  {
    meta: { id: 'ch5', titre: 'La courbe des taux', ordre: 5, titreEn: 'The yield curve' },
    charger: () => import('./chapters/05-la-courbe-des-taux.mdx'),
    chargerEn: () => import('./chapters/en/05-the-yield-curve.mdx'),
  },
  {
    meta: { id: 'ch6', titre: 'Duration & convexité', ordre: 6, titreEn: 'Duration & convexity' },
    charger: () => import('./chapters/06-duration-convexite.mdx'),
    chargerEn: () => import('./chapters/en/06-duration-and-convexity.mdx'),
  },
  {
    meta: { id: 'ch7', titre: 'Le marché obligataire en pratique', ordre: 7, titreEn: 'The bond market in practice' },
    charger: () => import('./chapters/07-marche-obligataire-en-pratique.mdx'),
    chargerEn: () => import('./chapters/en/07-the-bond-market-in-practice.mdx'),
  },
  {
    meta: { id: 'synthese', titre: 'Synthèse du module', ordre: 8, titreEn: 'Module summary' },
    charger: () => import('./chapters/08-synthese.mdx'),
    chargerEn: () => import('./chapters/en/08-module-summary.mdx'),
  },
];
