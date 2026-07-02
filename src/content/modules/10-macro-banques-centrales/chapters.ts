import type { ChapitreRef } from '../../../engine/types';

export const chapitres: ChapitreRef[] = [
  {
    meta: { id: 'ch1', titre: 'La banque centrale : le mandat et la promesse des 2 %', titreEn: 'The central bank: the mandate and the 2% promise', ordre: 1 },
    charger: () => import('./chapters/01-le-mandat.mdx'),
    chargerEn: () => import('./chapters/en/01-the-mandate.mdx'),
  },
  {
    meta: { id: 'ch2', titre: 'Les taux directeurs : le levier et sa règle', titreEn: 'Policy rates: the lever and its rule', ordre: 2 },
    charger: () => import('./chapters/02-les-taux-directeurs.mdx'),
    chargerEn: () => import('./chapters/en/02-policy-rates.mdx'),
  },
  {
    meta: { id: 'ch3', titre: "La transmission : du taux directeur à l'économie réelle", titreEn: 'Transmission: from the policy rate to the real economy', ordre: 3 },
    charger: () => import('./chapters/03-la-transmission.mdx'),
    chargerEn: () => import('./chapters/en/03-transmission.mdx'),
  },
  {
    meta: { id: 'ch4', titre: "L'inflation : la mesurer, la comprendre, la combattre", titreEn: 'Inflation: measuring it, understanding it, fighting it', ordre: 4 },
    charger: () => import('./chapters/04-l-inflation.mdx'),
    chargerEn: () => import('./chapters/en/04-inflation.mdx'),
  },
  {
    meta: { id: 'ch5', titre: "QE, QT et l'arsenal non conventionnel", titreEn: 'QE, QT and the unconventional arsenal', ordre: 5 },
    charger: () => import('./chapters/05-qe-qt-non-conventionnel.mdx'),
    chargerEn: () => import('./chapters/en/05-qe-qt-unconventional.mdx'),
  },
  {
    meta: { id: 'ch6', titre: 'Les indicateurs : le calendrier qui fait trembler les desks', titreEn: 'The indicators: the calendar that makes desks tremble', ordre: 6 },
    charger: () => import('./chapters/06-les-indicateurs.mdx'),
    chargerEn: () => import('./chapters/en/06-the-indicators.mdx'),
  },
  {
    meta: { id: 'ch7', titre: "Les classes d'actifs sous le cycle — et les jours où tout casse", titreEn: 'Asset classes under the cycle — and the days when everything breaks', ordre: 7 },
    charger: () => import('./chapters/07-classes-d-actifs-episodes.mdx'),
    chargerEn: () => import('./chapters/en/07-asset-classes-episodes.mdx'),
  },
  {
    meta: { id: 'synthese', titre: 'Synthèse du module', titreEn: 'Module summary', ordre: 8 },
    charger: () => import('./chapters/08-synthese.mdx'),
    chargerEn: () => import('./chapters/en/08-module-summary.mdx'),
  },
];
