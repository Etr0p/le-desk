import type { ChapitreRef } from '../../../engine/types';

// Câblage FR du module 11 — les `chargerEn`/`titreEn` viendront avec les traductions.
export const chapitres: ChapitreRef[] = [
  {
    meta: { id: 'ch1', titre: 'La grammaire des crises : bulle, levier, liquidité, panique', ordre: 1 },
    charger: () => import('./chapters/01-la-grammaire-des-crises.mdx'),
  },
  {
    meta: { id: 'ch2', titre: '1929 : le krach qui devint dépression', ordre: 2 },
    charger: () => import('./chapters/02-1929-la-grande-depression.mdx'),
  },
  {
    meta: { id: 'ch3', titre: '1987 et LTCM : quand les modèles cassent le marché', ordre: 3 },
    charger: () => import('./chapters/03-1987-et-ltcm.mdx'),
  },
  {
    meta: { id: 'ch4', titre: 'La bulle dot-com : quand les clics remplacent les profits', ordre: 4 },
    charger: () => import('./chapters/04-la-bulle-dot-com.mdx'),
  },
  {
    meta: { id: 'ch5', titre: '2008 : des subprimes au systémique', ordre: 5 },
    charger: () => import('./chapters/05-2008-des-subprimes-au-systemique.mdx'),
  },
  {
    meta: { id: 'ch6', titre: 'La crise de la dette souveraine : la doom loop', ordre: 6 },
    charger: () => import('./chapters/06-la-dette-souveraine.mdx'),
  },
  {
    meta: { id: 'ch7', titre: 'Les crises éclair : COVID, gilts, SVB — la vitesse moderne', ordre: 7 },
    charger: () => import('./chapters/07-les-crises-eclair.mdx'),
  },
];
