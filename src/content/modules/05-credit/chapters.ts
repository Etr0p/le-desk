import type { ChapitreRef } from '../../../engine/types';

export const chapitres: ChapitreRef[] = [
  {
    meta: { id: 'ch1', titre: 'Le risque de crédit : le prix de la promesse', titreEn: 'Credit risk: the price of a promise', ordre: 1 },
    charger: () => import('./chapters/01-le-prix-du-risque-de-credit.mdx'),
    chargerEn: () => import('./chapters/en/01-the-price-of-a-promise.mdx'),
  },
  {
    meta: { id: 'ch2', titre: 'La notation : l\'alphabet du risque', titreEn: 'Ratings: the alphabet of risk', ordre: 2 },
    charger: () => import('./chapters/02-la-notation.mdx'),
    chargerEn: () => import('./chapters/en/02-the-rating-alphabet.mdx'),
  },
  {
    meta: { id: 'ch3', titre: 'PD × LGD : la perte attendue', titreEn: 'PD × LGD: expected loss', ordre: 3 },
    charger: () => import('./chapters/03-la-perte-attendue.mdx'),
    chargerEn: () => import('./chapters/en/03-expected-loss.mdx'),
  },
  {
    meta: { id: 'ch4', titre: 'Pricer une obligation risquée', titreEn: 'Pricing a risky bond', ordre: 4 },
    charger: () => import('./chapters/04-pricer-une-obligation-risquee.mdx'),
    chargerEn: () => import('./chapters/en/04-pricing-a-risky-bond.mdx'),
  },
  {
    meta: { id: 'ch5', titre: 'Les CDS : le risque de crédit détaché de l\'obligation', titreEn: 'CDS: credit risk detached from the bond', ordre: 5 },
    charger: () => import('./chapters/05-les-cds.mdx'),
    chargerEn: () => import('./chapters/en/05-the-cds.mdx'),
  },
  {
    meta: { id: 'ch6', titre: 'La titrisation : ABS, MBS, CDO', titreEn: 'Securitisation: ABS, MBS, CDOs', ordre: 6 },
    charger: () => import('./chapters/06-la-titrisation.mdx'),
    chargerEn: () => import('./chapters/en/06-securitisation.mdx'),
  },
  {
    meta: { id: 'ch7', titre: 'Le cycle du crédit et le desk', titreEn: 'The credit cycle and the desk', ordre: 7 },
    charger: () => import('./chapters/07-le-cycle-du-credit-et-le-desk.mdx'),
    chargerEn: () => import('./chapters/en/07-the-credit-cycle-and-the-desk.mdx'),
  },
  {
    meta: { id: 'synthese', titre: 'Synthèse du module', titreEn: 'Module summary', ordre: 8 },
    charger: () => import('./chapters/08-synthese.mdx'),
    chargerEn: () => import('./chapters/en/08-module-summary.mdx'),
  },
];
