import type { ChapitreRef } from '../../../engine/types';

export const chapitres: ChapitreRef[] = [
  {
    meta: { id: 'ch1', titre: 'La grammaire des crises : bulle, levier, liquidité, panique', titreEn: 'The grammar of crises: bubble, leverage, liquidity, panic', ordre: 1 },
    charger: () => import('./chapters/01-la-grammaire-des-crises.mdx'),
    chargerEn: () => import('./chapters/en/01-the-grammar-of-crises.mdx'),
  },
  {
    meta: { id: 'ch2', titre: '1929 : le krach qui devint dépression', titreEn: '1929: the crash that became a depression', ordre: 2 },
    charger: () => import('./chapters/02-1929-la-grande-depression.mdx'),
    chargerEn: () => import('./chapters/en/02-1929-the-great-depression.mdx'),
  },
  {
    meta: { id: 'ch3', titre: '1987 et LTCM : quand les modèles cassent le marché', titreEn: '1987 and LTCM: when models break the market', ordre: 3 },
    charger: () => import('./chapters/03-1987-et-ltcm.mdx'),
    chargerEn: () => import('./chapters/en/03-1987-and-ltcm.mdx'),
  },
  {
    meta: { id: 'ch4', titre: 'La bulle dot-com : quand les clics remplacent les profits', titreEn: 'The dot-com bubble: when clicks replace profits', ordre: 4 },
    charger: () => import('./chapters/04-la-bulle-dot-com.mdx'),
    chargerEn: () => import('./chapters/en/04-the-dot-com-bubble.mdx'),
  },
  {
    meta: { id: 'ch5', titre: '2008 : des subprimes au systémique', titreEn: '2008: from subprime to systemic', ordre: 5 },
    charger: () => import('./chapters/05-2008-des-subprimes-au-systemique.mdx'),
    chargerEn: () => import('./chapters/en/05-2008-from-subprime-to-systemic.mdx'),
  },
  {
    meta: { id: 'ch6', titre: 'La crise de la dette souveraine : la doom loop', titreEn: 'The sovereign debt crisis: the doom loop', ordre: 6 },
    charger: () => import('./chapters/06-la-dette-souveraine.mdx'),
    chargerEn: () => import('./chapters/en/06-the-sovereign-debt-crisis.mdx'),
  },
  {
    meta: { id: 'ch7', titre: 'Les crises éclair : COVID, gilts, SVB — la vitesse moderne', titreEn: 'The flash crises: COVID, gilts, SVB — modern speed', ordre: 7 },
    charger: () => import('./chapters/07-les-crises-eclair.mdx'),
    chargerEn: () => import('./chapters/en/07-the-flash-crises.mdx'),
  },
  {
    meta: { id: 'synthese', titre: 'Synthèse du module', titreEn: 'Module summary', ordre: 8 },
    charger: () => import('./chapters/08-synthese.mdx'),
    chargerEn: () => import('./chapters/en/08-module-summary.mdx'),
  },
];
