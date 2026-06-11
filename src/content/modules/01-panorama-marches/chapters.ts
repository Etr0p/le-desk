import type { ChapitreRef } from '../../../engine/types';

// Versions anglaises : chargerEn + titreEn seront branchés avec la vague de
// traduction du module (même mécanique que les modules 2 et 4).
export const chapitres: ChapitreRef[] = [
  {
    meta: { id: 'ch1', titre: 'À quoi servent les marchés financiers', ordre: 1 },
    charger: () => import('./chapters/01-a-quoi-servent-les-marches.mdx'),
  },
  {
    meta: { id: 'ch2', titre: 'La carte des acteurs', ordre: 2 },
    charger: () => import('./chapters/02-la-carte-des-acteurs.mdx'),
  },
  {
    meta: { id: 'ch3', titre: 'Dans une salle des marchés', ordre: 3 },
    charger: () => import('./chapters/03-dans-une-salle-des-marches.mdx'),
  },
  {
    meta: { id: 'ch4', titre: 'Les ordres et leur exécution', ordre: 4 },
    charger: () => import('./chapters/04-les-ordres-et-leur-execution.mdx'),
  },
  {
    meta: { id: 'ch5', titre: 'Microstructure : qui fournit la liquidité ?', ordre: 5 },
    charger: () => import('./chapters/05-microstructure.mdx'),
  },
  {
    meta: { id: 'ch6', titre: 'La régulation : les règles du jeu', ordre: 6 },
    charger: () => import('./chapters/06-la-regulation.mdx'),
  },
  {
    meta: { id: 'ch7', titre: 'Le post-marché : la tuyauterie qui tient tout', ordre: 7 },
    charger: () => import('./chapters/07-le-post-marche.mdx'),
  },
];
