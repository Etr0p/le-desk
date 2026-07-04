import type { ChapitreRef } from '../../../engine/types';

export const chapitres: ChapitreRef[] = [
  {
    meta: { id: 'ch1', titre: 'Le portefeuille : le seul repas gratuit', titreEn: 'The portfolio: the only free lunch', ordre: 1 },
    charger: () => import('./chapters/01-le-portefeuille.mdx'),
    chargerEn: () => import('./chapters/en/01-the-portfolio.mdx'),
  },
  {
    meta: { id: 'ch2', titre: 'La frontière efficiente et le CAPM', titreEn: 'The efficient frontier and the CAPM', ordre: 2 },
    charger: () => import('./chapters/02-la-frontiere-et-le-capm.mdx'),
    chargerEn: () => import('./chapters/en/02-the-frontier-and-the-capm.mdx'),
  },
  {
    meta: { id: 'ch3', titre: 'Mesurer la performance : Sharpe, alpha, tracking error', titreEn: 'Measuring performance: Sharpe, alpha, tracking error', ordre: 3 },
    charger: () => import('./chapters/03-mesurer-la-performance.mdx'),
    chargerEn: () => import('./chapters/en/03-measuring-performance.mdx'),
  },
  {
    meta: { id: 'ch4', titre: 'Passif contre actif : ETF et l\'arithmétique des frais', titreEn: 'Passive vs active: ETFs and the arithmetic of fees', ordre: 4 },
    charger: () => import('./chapters/04-passif-actif-etf.mdx'),
    chargerEn: () => import('./chapters/en/04-passive-vs-active-etfs.mdx'),
  },
  {
    meta: { id: 'ch5', titre: 'La VaR et les stress tests', titreEn: 'VaR and stress tests', ordre: 5 },
    charger: () => import('./chapters/05-la-var-et-les-stress-tests.mdx'),
    chargerEn: () => import('./chapters/en/05-var-and-stress-tests.mdx'),
  },
  {
    meta: { id: 'ch6', titre: 'Les quatre risques et Bâle III', titreEn: 'The four risks and Basel III', ordre: 6 },
    charger: () => import('./chapters/06-les-quatre-risques-et-bale-iii.mdx'),
    chargerEn: () => import('./chapters/en/06-the-four-risks-and-basel-iii.mdx'),
  },
  {
    meta: { id: 'ch7', titre: 'L\'ESG : green bonds, taxonomie, greenwashing', titreEn: 'ESG: green bonds, taxonomy, greenwashing', ordre: 7 },
    charger: () => import('./chapters/07-esg.mdx'),
    chargerEn: () => import('./chapters/en/07-esg.mdx'),
  },
  {
    meta: { id: 'synthese', titre: 'Synthèse du module', titreEn: 'Module summary', ordre: 8 },
    charger: () => import('./chapters/08-synthese.mdx'),
    chargerEn: () => import('./chapters/en/08-module-summary.mdx'),
  },
];
