import type { ChapitreRef } from '../../../engine/types';

export const chapitres: ChapitreRef[] = [
  {
    meta: { id: 'ch1', titre: 'Le marché des changes', titreEn: 'The FX market', ordre: 1 },
    charger: () => import('./chapters/01-le-marche-des-changes.mdx'),
    chargerEn: () => import('./chapters/en/01-the-fx-market.mdx'),
  },
  {
    meta: { id: 'ch2', titre: 'Forwards et parité couverte des taux', titreEn: 'Forwards and covered interest parity', ordre: 2 },
    charger: () => import('./chapters/02-forwards-et-parite-couverte.mdx'),
    chargerEn: () => import('./chapters/en/02-forwards-covered-parity.mdx'),
  },
  {
    meta: { id: 'ch3', titre: 'Parités économiques et carry trade', titreEn: 'Economic parities and the carry trade', ordre: 3 },
    charger: () => import('./chapters/03-parites-economiques-et-carry.mdx'),
    chargerEn: () => import('./chapters/en/03-economic-parities-carry.mdx'),
  },
  {
    meta: { id: 'ch4', titre: 'Régimes de change : du peg à la crise', titreEn: 'Exchange rate regimes: from peg to crisis', ordre: 4 },
    charger: () => import('./chapters/04-regimes-de-change.mdx'),
    chargerEn: () => import('./chapters/en/04-exchange-rate-regimes.mdx'),
  },
  {
    meta: { id: 'ch5', titre: "Matières premières : l'actif qui se stocke", titreEn: 'Commodities: the asset you can store', ordre: 5 },
    charger: () => import('./chapters/05-matieres-premieres.mdx'),
    chargerEn: () => import('./chapters/en/05-commodities.mdx'),
  },
  {
    meta: { id: 'ch6', titre: 'Contango et backwardation', titreEn: 'Contango and backwardation', ordre: 6 },
    charger: () => import('./chapters/06-contango-backwardation.mdx'),
    chargerEn: () => import('./chapters/en/06-contango-backwardation.mdx'),
  },
  {
    meta: { id: 'ch7', titre: 'Crypto et actifs numériques', titreEn: 'Crypto and digital assets', ordre: 7 },
    charger: () => import('./chapters/07-crypto-actifs-numeriques.mdx'),
    chargerEn: () => import('./chapters/en/07-crypto-digital-assets.mdx'),
  },
  {
    meta: { id: 'synthese', titre: 'Synthèse du module', titreEn: 'Module summary', ordre: 8 },
    charger: () => import('./chapters/08-synthese.mdx'),
    chargerEn: () => import('./chapters/en/08-module-summary.mdx'),
  },
];
