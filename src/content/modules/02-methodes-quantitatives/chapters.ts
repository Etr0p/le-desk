import type { ChapitreRef } from '../../../engine/types';

// Versions anglaises : à brancher (chargerEn + titreEn) quand la traduction
// du module 2 sera produite — même mécanique que le module 4.
export const chapitres: ChapitreRef[] = [
  {
    meta: { id: 'ch1', titre: "La valeur temps de l'argent", ordre: 1 },
    charger: () => import('./chapters/01-valeur-temps-argent.mdx'),
  },
  {
    meta: { id: 'ch2', titre: 'Statistiques descriptives : décrire les rendements', ordre: 2 },
    charger: () => import('./chapters/02-statistiques-descriptives.mdx'),
  },
  {
    meta: { id: 'ch3', titre: "Probabilités : l'arme des brainteasers", ordre: 3 },
    charger: () => import('./chapters/03-probabilites.mdx'),
  },
  {
    meta: { id: 'ch4', titre: 'Distributions : la normale, la lognormale et leurs limites', ordre: 4 },
    charger: () => import('./chapters/04-variables-aleatoires-distributions.mdx'),
  },
  {
    meta: { id: 'ch5', titre: 'Échantillonnage : du tirage à la confiance', ordre: 5 },
    charger: () => import('./chapters/05-echantillonnage-intervalles.mdx'),
  },
  {
    meta: { id: 'ch6', titre: "Tests d'hypothèses : le bruit ou le signal ?", ordre: 6 },
    charger: () => import('./chapters/06-tests-hypotheses.mdx'),
  },
  {
    meta: { id: 'ch7', titre: 'Régression et Monte-Carlo : les outils du desk', ordre: 7 },
    charger: () => import('./chapters/07-regression-monte-carlo.mdx'),
  },
];
