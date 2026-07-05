import type { ChapitreRef } from '../../../engine/types';

// Les chargerEn/titreEn seront ajoutés avec les traductions (assemblage).
export const chapitres: ChapitreRef[] = [
  {
    meta: { id: 'ch1', titre: 'Le calcul mental : la boîte à outils du desk', ordre: 1 },
    charger: () => import('./chapters/01-le-calcul-mental.mdx'),
  },
  {
    meta: { id: 'ch2', titre: 'Les estimations de Fermi : compter ce qu\'on ne sait pas', ordre: 2 },
    charger: () => import('./chapters/02-les-estimations-de-fermi.mdx'),
  },
  {
    meta: { id: 'ch3', titre: 'Les probabilités d\'entretien', ordre: 3 },
    charger: () => import('./chapters/03-les-probabilites-d-entretien.mdx'),
  },
  {
    meta: { id: 'ch4', titre: 'Les brainteasers classiques : la méthode avant la réponse', ordre: 4 },
    charger: () => import('./chapters/04-les-brainteasers-classiques.mdx'),
  },
  {
    meta: { id: 'ch5', titre: 'Les jeux de marché : cotez-moi ce dé', ordre: 5 },
    charger: () => import('./chapters/05-les-jeux-de-marche.mdx'),
  },
  {
    meta: { id: 'ch6', titre: 'Défendre son parcours : le pitch et la motivation', ordre: 6 },
    charger: () => import('./chapters/06-defendre-son-parcours.mdx'),
  },
  {
    meta: { id: 'ch7', titre: 'Le jour J : la méthode devant le jury', ordre: 7 },
    charger: () => import('./chapters/07-le-jour-j.mdx'),
  },
];
