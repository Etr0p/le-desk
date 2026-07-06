import type { ChapitreRef } from '../../../engine/types';

export const chapitres: ChapitreRef[] = [
  {
    meta: { id: 'ch1', titre: 'Le calcul mental : la boîte à outils du desk', titreEn: 'Mental math: the desk toolbox', ordre: 1 },
    charger: () => import('./chapters/01-le-calcul-mental.mdx'),
    chargerEn: () => import('./chapters/en/01-mental-math.mdx'),
  },
  {
    meta: { id: 'ch2', titre: 'Les estimations de Fermi : compter ce qu\'on ne sait pas', titreEn: 'Fermi estimates: counting what you do not know', ordre: 2 },
    charger: () => import('./chapters/02-les-estimations-de-fermi.mdx'),
    chargerEn: () => import('./chapters/en/02-fermi-estimates.mdx'),
  },
  {
    meta: { id: 'ch3', titre: 'Les probabilités d\'entretien', titreEn: 'Interview probability', ordre: 3 },
    charger: () => import('./chapters/03-les-probabilites-d-entretien.mdx'),
    chargerEn: () => import('./chapters/en/03-interview-probability.mdx'),
  },
  {
    meta: { id: 'ch4', titre: 'Les brainteasers classiques : la méthode avant la réponse', titreEn: 'Classic brainteasers: method before answer', ordre: 4 },
    charger: () => import('./chapters/04-les-brainteasers-classiques.mdx'),
    chargerEn: () => import('./chapters/en/04-classic-brainteasers.mdx'),
  },
  {
    meta: { id: 'ch5', titre: 'Les jeux de marché : cotez-moi ce dé', titreEn: 'Market games: make me a price on this die', ordre: 5 },
    charger: () => import('./chapters/05-les-jeux-de-marche.mdx'),
    chargerEn: () => import('./chapters/en/05-market-games.mdx'),
  },
  {
    meta: { id: 'ch6', titre: 'Défendre son parcours : le pitch et la motivation', titreEn: 'Defending your background: the pitch and motivation', ordre: 6 },
    charger: () => import('./chapters/06-defendre-son-parcours.mdx'),
    chargerEn: () => import('./chapters/en/06-defending-your-background.mdx'),
  },
  {
    meta: { id: 'ch7', titre: 'Le jour J : la méthode devant le jury', titreEn: 'The big day: the method in front of the jury', ordre: 7 },
    charger: () => import('./chapters/07-le-jour-j.mdx'),
    chargerEn: () => import('./chapters/en/07-the-big-day.mdx'),
  },
  {
    meta: { id: 'synthese', titre: 'Synthèse du module', titreEn: 'Module summary', ordre: 8 },
    charger: () => import('./chapters/08-synthese.mdx'),
    chargerEn: () => import('./chapters/en/08-module-summary.mdx'),
  },
];
