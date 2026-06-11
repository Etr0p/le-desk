import type { ChapitreRef } from '../../../engine/types';

export const chapitres: ChapitreRef[] = [
  {
    meta: { id: 'ch1', titre: 'À quoi servent les marchés financiers', titreEn: 'What Financial Markets Are For', ordre: 1 },
    charger: () => import('./chapters/01-a-quoi-servent-les-marches.mdx'),
    chargerEn: () => import('./chapters/en/01-what-markets-are-for.mdx'),
  },
  {
    meta: { id: 'ch2', titre: 'La carte des acteurs', titreEn: 'The Map of Players', ordre: 2 },
    charger: () => import('./chapters/02-la-carte-des-acteurs.mdx'),
    chargerEn: () => import('./chapters/en/02-the-map-of-players.mdx'),
  },
  {
    meta: { id: 'ch3', titre: 'Dans une salle des marchés', titreEn: 'Inside a Trading Floor', ordre: 3 },
    charger: () => import('./chapters/03-dans-une-salle-des-marches.mdx'),
    chargerEn: () => import('./chapters/en/03-inside-a-trading-floor.mdx'),
  },
  {
    meta: { id: 'ch4', titre: 'Les ordres et leur exécution', titreEn: 'Orders and Execution', ordre: 4 },
    charger: () => import('./chapters/04-les-ordres-et-leur-execution.mdx'),
    chargerEn: () => import('./chapters/en/04-orders-and-execution.mdx'),
  },
  {
    meta: { id: 'ch5', titre: 'Microstructure : qui fournit la liquidité ?', titreEn: 'Microstructure: who provides liquidity?', ordre: 5 },
    charger: () => import('./chapters/05-microstructure.mdx'),
    chargerEn: () => import('./chapters/en/05-microstructure.mdx'),
  },
  {
    meta: { id: 'ch6', titre: 'La régulation : les règles du jeu', titreEn: 'Regulation: the rules of the game', ordre: 6 },
    charger: () => import('./chapters/06-la-regulation.mdx'),
    chargerEn: () => import('./chapters/en/06-regulation.mdx'),
  },
  {
    meta: { id: 'ch7', titre: 'Le post-marché : la tuyauterie qui tient tout', titreEn: 'Post-trade: the plumbing that holds everything', ordre: 7 },
    charger: () => import('./chapters/07-le-post-marche.mdx'),
    chargerEn: () => import('./chapters/en/07-post-trade.mdx'),
  },
  {
    meta: { id: 'synthese', titre: 'Synthèse du module', titreEn: 'Module summary', ordre: 8 },
    charger: () => import('./chapters/08-synthese.mdx'),
    chargerEn: () => import('./chapters/en/08-module-summary.mdx'),
  },
];
