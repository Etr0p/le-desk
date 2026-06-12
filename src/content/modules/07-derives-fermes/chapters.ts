import type { ChapitreRef } from '../../../engine/types';

export const chapitres: ChapitreRef[] = [
  {
    meta: { id: 'ch1', titre: "L'engagement ferme : la logique du dérivé", titreEn: 'The firm commitment', ordre: 1 },
    charger: () => import('./chapters/01-l-engagement-ferme.mdx'),
    chargerEn: () => import('./chapters/en/01-the-firm-commitment.mdx'),
  },
  {
    meta: { id: 'ch2', titre: 'Futures, marges et chambre de compensation', titreEn: 'Futures, margins and the clearing house', ordre: 2 },
    charger: () => import('./chapters/02-futures-marges-et-chambre.mdx'),
    chargerEn: () => import('./chapters/en/02-futures-margins-clearing-house.mdx'),
  },
  {
    meta: { id: 'ch3', titre: 'Le pricing par cash-and-carry', titreEn: 'Cash-and-carry pricing', ordre: 3 },
    charger: () => import('./chapters/03-pricing-cash-and-carry.mdx'),
    chargerEn: () => import('./chapters/en/03-cash-and-carry-pricing.mdx'),
  },
  {
    meta: { id: 'ch4', titre: 'FRA et futures de taux', titreEn: 'FRAs and interest-rate futures', ordre: 4 },
    charger: () => import('./chapters/04-fra-et-futures-de-taux.mdx'),
    chargerEn: () => import('./chapters/en/04-fras-and-interest-rate-futures.mdx'),
  },
  {
    meta: { id: 'ch5', titre: 'Le swap de taux', titreEn: 'The interest rate swap', ordre: 5 },
    charger: () => import('./chapters/05-le-swap-de-taux.mdx'),
    chargerEn: () => import('./chapters/en/05-the-interest-rate-swap.mdx'),
  },
  {
    meta: { id: 'ch6', titre: 'La famille des swaps', titreEn: 'The swap family', ordre: 6 },
    charger: () => import('./chapters/06-la-famille-des-swaps.mdx'),
    chargerEn: () => import('./chapters/en/06-the-swap-family.mdx'),
  },
  {
    meta: { id: 'ch7', titre: 'Usages, risques et accidents célèbres', titreEn: 'Uses, risks and famous blow-ups', ordre: 7 },
    charger: () => import('./chapters/07-usages-risques-accidents.mdx'),
    chargerEn: () => import('./chapters/en/07-uses-risks-blow-ups.mdx'),
  },
  {
    meta: { id: 'synthese', titre: 'Synthèse du module', titreEn: 'Module summary', ordre: 8 },
    charger: () => import('./chapters/08-synthese.mdx'),
    chargerEn: () => import('./chapters/en/08-module-summary.mdx'),
  },
];
