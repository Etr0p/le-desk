import type { ChapitreRef } from '../../../engine/types';

export const chapitres: ChapitreRef[] = [
  {
    meta: { id: 'ch1', titre: "La valeur temps de l'argent", titreEn: 'The Time Value of Money', ordre: 1 },
    charger: () => import('./chapters/01-valeur-temps-argent.mdx'),
    chargerEn: () => import('./chapters/en/01-time-value-of-money.mdx'),
  },
  {
    meta: { id: 'ch2', titre: 'Statistiques descriptives : décrire les rendements', titreEn: 'Descriptive Statistics: Describing Returns', ordre: 2 },
    charger: () => import('./chapters/02-statistiques-descriptives.mdx'),
    chargerEn: () => import('./chapters/en/02-descriptive-statistics.mdx'),
  },
  {
    meta: { id: 'ch3', titre: "Probabilités : l'arme des brainteasers", titreEn: 'Probability: The Brainteaser Weapon', ordre: 3 },
    charger: () => import('./chapters/03-probabilites.mdx'),
    chargerEn: () => import('./chapters/en/03-probability.mdx'),
  },
  {
    meta: { id: 'ch4', titre: 'Distributions : la normale, la lognormale et leurs limites', titreEn: 'Distributions: The Normal, the Lognormal and Their Limits', ordre: 4 },
    charger: () => import('./chapters/04-variables-aleatoires-distributions.mdx'),
    chargerEn: () => import('./chapters/en/04-random-variables-distributions.mdx'),
  },
  {
    meta: { id: 'ch5', titre: 'Échantillonnage : du tirage à la confiance', titreEn: 'Sampling: from one draw to confidence', ordre: 5 },
    charger: () => import('./chapters/05-echantillonnage-intervalles.mdx'),
    chargerEn: () => import('./chapters/en/05-sampling-confidence.mdx'),
  },
  {
    meta: { id: 'ch6', titre: "Tests d'hypothèses : le bruit ou le signal ?", titreEn: 'Hypothesis testing: noise or signal?', ordre: 6 },
    charger: () => import('./chapters/06-tests-hypotheses.mdx'),
    chargerEn: () => import('./chapters/en/06-hypothesis-testing.mdx'),
  },
  {
    meta: { id: 'ch7', titre: 'Régression et Monte-Carlo : les outils du desk', titreEn: "Regression and Monte Carlo: the desk's tools", ordre: 7 },
    charger: () => import('./chapters/07-regression-monte-carlo.mdx'),
    chargerEn: () => import('./chapters/en/07-regression-monte-carlo.mdx'),
  },
  {
    meta: { id: 'synthese', titre: 'Synthèse du module', titreEn: 'Module summary', ordre: 8 },
    charger: () => import('./chapters/08-synthese.mdx'),
    chargerEn: () => import('./chapters/en/08-module-summary.mdx'),
  },
];
