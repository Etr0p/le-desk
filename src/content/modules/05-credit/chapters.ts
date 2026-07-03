import type { ChapitreRef } from '../../../engine/types';

// Les chargerEn/titreEn seront ajoutés avec les traductions (assemblage).
export const chapitres: ChapitreRef[] = [
  {
    meta: { id: 'ch1', titre: 'Le risque de crédit : le prix de la promesse', ordre: 1 },
    charger: () => import('./chapters/01-le-prix-du-risque-de-credit.mdx'),
  },
  {
    meta: { id: 'ch2', titre: 'La notation : l\'alphabet du risque', ordre: 2 },
    charger: () => import('./chapters/02-la-notation.mdx'),
  },
  {
    meta: { id: 'ch3', titre: 'PD × LGD : la perte attendue', ordre: 3 },
    charger: () => import('./chapters/03-la-perte-attendue.mdx'),
  },
  {
    meta: { id: 'ch4', titre: 'Pricer une obligation risquée', ordre: 4 },
    charger: () => import('./chapters/04-pricer-une-obligation-risquee.mdx'),
  },
  {
    meta: { id: 'ch5', titre: 'Les CDS : le risque de crédit détaché de l\'obligation', ordre: 5 },
    charger: () => import('./chapters/05-les-cds.mdx'),
  },
  {
    meta: { id: 'ch6', titre: 'La titrisation : ABS, MBS, CDO', ordre: 6 },
    charger: () => import('./chapters/06-la-titrisation.mdx'),
  },
  {
    meta: { id: 'ch7', titre: 'Le cycle du crédit et le desk', ordre: 7 },
    charger: () => import('./chapters/07-le-cycle-du-credit-et-le-desk.mdx'),
  },
];
