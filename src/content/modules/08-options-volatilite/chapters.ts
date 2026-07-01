import type { ChapitreRef } from '../../../engine/types';

export const chapitres: ChapitreRef[] = [
  {
    meta: { id: 'ch1', titre: "L'option : le droit sans l'obligation", titreEn: 'The option: the right without the obligation', ordre: 1 },
    charger: () => import('./chapters/01-le-droit-sans-obligation.mdx'),
    chargerEn: () => import('./chapters/en/01-the-right-without-the-obligation.mdx'),
  },
  {
    meta: { id: 'ch2', titre: 'Payoffs et stratégies', titreEn: 'Payoffs and strategies', ordre: 2 },
    charger: () => import('./chapters/02-payoffs-et-strategies.mdx'),
    chargerEn: () => import('./chapters/en/02-payoffs-and-strategies.mdx'),
  },
  {
    meta: { id: 'ch3', titre: 'La parité call-put', titreEn: 'Put-call parity', ordre: 3 },
    charger: () => import('./chapters/03-la-parite-call-put.mdx'),
    chargerEn: () => import('./chapters/en/03-put-call-parity.mdx'),
  },
  {
    meta: { id: 'ch4', titre: 'Pricer une option : du binomial à Black-Scholes', titreEn: 'Pricing an option: from binomial to Black-Scholes', ordre: 4 },
    charger: () => import('./chapters/04-du-binomial-a-black-scholes.mdx'),
    chargerEn: () => import('./chapters/en/04-from-binomial-to-black-scholes.mdx'),
  },
  {
    meta: { id: 'ch5', titre: 'Les grecques et le delta-hedging', titreEn: 'The greeks and delta-hedging', ordre: 5 },
    charger: () => import('./chapters/05-les-grecques-et-le-delta-hedging.mdx'),
    chargerEn: () => import('./chapters/en/05-the-greeks-and-delta-hedging.mdx'),
  },
  {
    meta: { id: 'ch6', titre: 'La volatilité : implicite, réalisée, smile', titreEn: 'Volatility: implied, realized, smile', ordre: 6 },
    charger: () => import('./chapters/06-la-volatilite-implicite-et-le-smile.mdx'),
    chargerEn: () => import('./chapters/en/06-implied-volatility-and-the-smile.mdx'),
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
