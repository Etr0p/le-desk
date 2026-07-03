import type { ChapitreRef } from '../../../engine/types';

// Les chargerEn/titreEn seront ajoutés avec les traductions (assemblage).
export const chapitres: ChapitreRef[] = [
  {
    meta: { id: 'ch1', titre: 'Le portefeuille : le seul repas gratuit', ordre: 1 },
    charger: () => import('./chapters/01-le-portefeuille.mdx'),
  },
  {
    meta: { id: 'ch2', titre: 'La frontière efficiente et le CAPM', ordre: 2 },
    charger: () => import('./chapters/02-la-frontiere-et-le-capm.mdx'),
  },
  {
    meta: { id: 'ch3', titre: 'Mesurer la performance : Sharpe, alpha, tracking error', ordre: 3 },
    charger: () => import('./chapters/03-mesurer-la-performance.mdx'),
  },
  {
    meta: { id: 'ch4', titre: 'Passif contre actif : ETF et l\'arithmétique des frais', ordre: 4 },
    charger: () => import('./chapters/04-passif-actif-etf.mdx'),
  },
  {
    meta: { id: 'ch5', titre: 'La VaR et les stress tests', ordre: 5 },
    charger: () => import('./chapters/05-la-var-et-les-stress-tests.mdx'),
  },
  {
    meta: { id: 'ch6', titre: 'Les quatre risques et Bâle III', ordre: 6 },
    charger: () => import('./chapters/06-les-quatre-risques-et-bale-iii.mdx'),
  },
  {
    meta: { id: 'ch7', titre: 'L\'ESG : green bonds, taxonomie, greenwashing', ordre: 7 },
    charger: () => import('./chapters/07-esg.mdx'),
  },
];
