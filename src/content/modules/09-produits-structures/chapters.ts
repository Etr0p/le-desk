import type { ChapitreRef } from '../../../engine/types';

export const chapitres: ChapitreRef[] = [
  {
    meta: { id: 'ch1', titre: 'Le structuré : une promesse en briques', titreEn: 'The structured product: a promise made of bricks', ordre: 1 },
    charger: () => import('./chapters/01-la-promesse-en-briques.mdx'),
    chargerEn: () => import('./chapters/en/01-a-promise-made-of-bricks.mdx'),
  },
  {
    meta: { id: 'ch2', titre: 'Le capital garanti et sa participation', titreEn: 'The capital guarantee and its participation', ordre: 2 },
    charger: () => import('./chapters/02-le-capital-garanti.mdx'),
    chargerEn: () => import('./chapters/en/02-capital-protection.mdx'),
  },
  {
    meta: { id: 'ch3', titre: 'Le reverse convertible : vendre un put sans le savoir', titreEn: 'The reverse convertible: selling a put without knowing it', ordre: 3 },
    charger: () => import('./chapters/03-le-reverse-convertible.mdx'),
    chargerEn: () => import('./chapters/en/03-the-reverse-convertible.mdx'),
  },
  {
    meta: { id: 'ch4', titre: "L'autocall : la machine à coupons conditionnels", titreEn: 'The autocall: the conditional-coupon machine', ordre: 4 },
    charger: () => import('./chapters/04-l-autocall.mdx'),
    chargerEn: () => import('./chapters/en/04-the-autocall.mdx'),
  },
  {
    meta: { id: 'ch5', titre: 'Barrières, worst-of : les ingrédients du rendement', titreEn: 'Barriers, worst-of: the ingredients of yield', ordre: 5 },
    charger: () => import('./chapters/05-barrieres-worst-of-correlation.mdx'),
    chargerEn: () => import('./chapters/en/05-barriers-worst-of-correlation.mdx'),
  },
  {
    meta: { id: 'ch6', titre: 'Pricer par Monte-Carlo : la machine du desk', titreEn: "Pricing with Monte Carlo: the desk's machine", ordre: 6 },
    charger: () => import('./chapters/06-pricer-par-monte-carlo.mdx'),
    chargerEn: () => import('./chapters/en/06-pricing-with-monte-carlo.mdx'),
  },
  {
    meta: { id: 'ch7', titre: 'Term sheet, marge et accidents', titreEn: 'Term sheets, margin and blow-ups', ordre: 7 },
    charger: () => import('./chapters/07-term-sheet-marge-accidents.mdx'),
    chargerEn: () => import('./chapters/en/07-term-sheets-margin-blow-ups.mdx'),
  },
  {
    meta: { id: 'synthese', titre: 'Synthèse du module', titreEn: 'Module summary', ordre: 8 },
    charger: () => import('./chapters/08-synthese.mdx'),
    chargerEn: () => import('./chapters/en/08-module-summary.mdx'),
  },
];
