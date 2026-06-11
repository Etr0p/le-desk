import type { ChapitreRef } from '../../../engine/types';

export const chapitres: ChapitreRef[] = [
  {
    meta: { id: 'ch1', titre: "L'action, part de propriété", titreEn: 'The Share: A Slice of Ownership', ordre: 1 },
    charger: () => import('./chapters/01-l-action-part-de-propriete.mdx'),
    chargerEn: () => import('./chapters/en/01-shares-ownership.mdx'),
  },
  {
    meta: { id: 'ch2', titre: 'Valoriser par les flux : DDM et DCF', titreEn: 'Valuing with Cash Flows: DDM and DCF', ordre: 2 },
    charger: () => import('./chapters/02-valoriser-par-les-flux.mdx'),
    chargerEn: () => import('./chapters/en/02-valuing-with-cash-flows.mdx'),
  },
  {
    meta: { id: 'ch3', titre: 'Valoriser par les multiples', titreEn: 'Valuing with Multiples', ordre: 3 },
    charger: () => import('./chapters/03-valoriser-par-les-multiples.mdx'),
    chargerEn: () => import('./chapters/en/03-valuing-with-multiples.mdx'),
  },
  {
    meta: { id: 'ch4', titre: 'Les indices : thermomètres et produits', titreEn: 'Indices: Thermometers and Products', ordre: 4 },
    charger: () => import('./chapters/04-les-indices.mdx'),
    chargerEn: () => import('./chapters/en/04-indices.mdx'),
  },
  {
    meta: { id: 'ch5', titre: 'La vie du titre : dividendes, splits, opérations', titreEn: 'Corporate actions: dividends, splits and rights', ordre: 5 },
    charger: () => import('./chapters/05-la-vie-du-titre.mdx'),
    chargerEn: () => import('./chapters/en/05-corporate-actions.mdx'),
  },
  {
    meta: { id: 'ch6', titre: "IPO : l'entrée en bourse", titreEn: 'IPOs: going public', ordre: 6 },
    charger: () => import('./chapters/06-ipo-et-marche-primaire.mdx'),
    chargerEn: () => import('./chapters/en/06-ipos.mdx'),
  },
  {
    meta: { id: 'ch7', titre: 'Short selling et efficience', titreEn: 'Short selling and market efficiency', ordre: 7 },
    charger: () => import('./chapters/07-short-selling-et-efficience.mdx'),
    chargerEn: () => import('./chapters/en/07-short-selling-efficiency.mdx'),
  },
  {
    meta: { id: 'synthese', titre: 'Synthèse du module', titreEn: 'Module summary', ordre: 8 },
    charger: () => import('./chapters/08-synthese.mdx'),
    chargerEn: () => import('./chapters/en/08-module-summary.mdx'),
  },
];
