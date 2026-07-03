import { describe, expect, it } from 'vitest';
import { variationPrixObligationDuration } from '../10-macro-banques-centrales/calculs';
import {
  levierBilan,
  impactLevierSurFondsPropres,
  variationActifsFatale,
  drawdownPct,
  gainRequisPourRecuperer,
  anneesDeRecuperation,
  financementRepo,
  levierMaximalRepo,
  venteForceePourCash,
  tauxCouvertureDepots,
  chargeInteretsDette,
  spreadSouverainPb,
} from './calculs';

// Valeurs de référence VÉRIFIÉES À LA MAIN (aucune ne sort de l'implémentation) :
// — DJIA 381,17 → 41,22 : 41,22/381,17 − 1 = −89,185928 %.
// — Nasdaq 5 048,62 → 1 114,11 : −77,932385 % ; S&P 1 565,15 → 676,53 : −56,775389 % ;
//   COVID 3 386,15 → 2 237,40 : −33,924959 %.
// — Gain requis : −50 % ⇒ 100/50 − 1 = +100 % ; −89 % ⇒ 100/11 − 1 = +809,090909 % ;
//   −22,6 % ⇒ 100/77,4 − 1 = +29,198966 %.
// — Récupération −50 % à 7 %/an : ln 2 / ln 1,07 = 0,693147/0,067659 = 10,244768 ans.
// — Levier : fatale(25) = −4 ; fatale(30) = −3,333333 ; impact(25, −4) = −100.
// — Repo : (100, 2 %) = 98 ; levier max à 2 % de haircut = 50.
// — Vente forcée : lever 95 sous 5 % de décote ⇒ vendre 95/0,95 = 100.
// — Grèce : 180 % de dette à 5 % ⇒ 9 % du PIB ; taux 35 % contre Bund 1,5 % ⇒ 3 350 pb.

describe('levier de bilan et formule du malheur', () => {
  it('levierBilan(2500, 100) = 25 — l’ordre de grandeur de LTCM (125 Md$ pour ~5 Md$)', () => {
    expect(levierBilan(2500, 100)).toBeCloseTo(25, 10);
  });

  it('sans dette, levier 1 : les actifs SONT les fonds propres', () => {
    expect(levierBilan(100, 100)).toBeCloseTo(1, 10);
  });

  it('impact(25, −4) = −100 : au levier 25, −4 % d’actifs effacent tout le capital', () => {
    expect(impactLevierSurFondsPropres(25, -4)).toBeCloseTo(-100, 10);
  });

  it('impact(10, −10) = −100 : le spéculateur de 1929 à 10 % de couverture meurt sur −10 %', () => {
    expect(impactLevierSurFondsPropres(10, -10)).toBeCloseTo(-100, 10);
  });

  it('le levier marche aussi à la hausse — (25, +2) = +50 % : pourquoi on se leviérise', () => {
    expect(impactLevierSurFondsPropres(25, 2)).toBeCloseTo(50, 10);
  });

  it('variationActifsFatale : 25 ⇒ −4 % ; 30 ⇒ −3,333333 % ; 1 ⇒ −100 % (le comptant ne saute jamais)', () => {
    expect(variationActifsFatale(25)).toBeCloseTo(-4, 10);
    expect(variationActifsFatale(30)).toBeCloseTo(-3.333333, 5);
    expect(variationActifsFatale(1)).toBeCloseTo(-100, 10);
  });

  it('cohérence : le choc fatal injecté dans la formule d’impact rend exactement −100 %', () => {
    for (const levier of [2, 10, 25, 30]) {
      expect(impactLevierSurFondsPropres(levier, variationActifsFatale(levier))).toBeCloseTo(-100, 10);
    }
  });
});

describe('drawdowns historiques et asymétrie des pertes', () => {
  it('DJIA 1929-1932 (381,17 → 41,22) = −89,185928 %', () => {
    expect(drawdownPct(381.17, 41.22)).toBeCloseTo(-89.185928, 5);
  });

  it('Nasdaq 2000-2002 (5 048,62 → 1 114,11) = −77,932385 %', () => {
    expect(drawdownPct(5048.62, 1114.11)).toBeCloseTo(-77.932385, 5);
  });

  it('S&P 500 2007-2009 (1 565,15 → 676,53) = −56,775389 %', () => {
    expect(drawdownPct(1565.15, 676.53)).toBeCloseTo(-56.775389, 5);
  });

  it('COVID février-mars 2020 (3 386,15 → 2 237,40) = −33,924959 % en 23 séances', () => {
    expect(drawdownPct(3386.15, 2237.4)).toBeCloseTo(-33.924959, 5);
  });

  it('gain requis : −50 % exige +100 %, −20 % exige +25 %', () => {
    expect(gainRequisPourRecuperer(50)).toBeCloseTo(100, 10);
    expect(gainRequisPourRecuperer(20)).toBeCloseTo(25, 10);
  });

  it('gain requis après le DJIA de 1932 : −89 % ⇒ +809,090909 %', () => {
    expect(gainRequisPourRecuperer(89)).toBeCloseTo(809.090909, 4);
  });

  it('lundi noir 1987 : −22,6 % ⇒ +29,198966 % — brutal mais récupérable en deux ans', () => {
    expect(gainRequisPourRecuperer(22.6)).toBeCloseTo(29.198966, 5);
  });

  it('cohérence drawdown ↔ gain requis : appliquer le gain requis au creux rend le pic', () => {
    const pic = 1565.15;
    const creux = 676.53;
    const gain = gainRequisPourRecuperer(-drawdownPct(pic, creux));
    expect(creux * (1 + gain / 100)).toBeCloseTo(pic, 8);
  });

  it('années de récupération : −50 % à 7 %/an = 10,244768 ans', () => {
    expect(anneesDeRecuperation(50, 7)).toBeCloseTo(10.244768, 5);
  });

  it('−89 % à 7 %/an = 32,623692 ans — l’ordre de grandeur des 25 ans du Dow (1929 → 1954)', () => {
    expect(anneesDeRecuperation(89, 7)).toBeCloseTo(32.623692, 5);
  });

  it('perte nulle ⇒ 0 an ; et la croissance composée sur n années referme exactement la perte', () => {
    expect(anneesDeRecuperation(0, 7)).toBeCloseTo(0, 10);
    const n = anneesDeRecuperation(78, 10);
    expect((1 - 0.78) * (1 + 0.10) ** n).toBeCloseTo(1, 8);
  });
});

describe('repo, haircuts et ventes forcées', () => {
  it('financementRepo(100, 2) = 98 : le prêteur garde 2 de coussin', () => {
    expect(financementRepo(100, 2)).toBeCloseTo(98, 10);
  });

  it('le run de 2008 en un calcul : haircut 2 % → 25 % sur 100 de titres = 23 de financement évaporé', () => {
    expect(financementRepo(100, 2) - financementRepo(100, 25)).toBeCloseTo(23, 10);
  });

  it('levier maximal : haircut 2 % ⇒ 50 ; 10 % ⇒ 10 ; 50 % ⇒ 2', () => {
    expect(levierMaximalRepo(2)).toBeCloseTo(50, 10);
    expect(levierMaximalRepo(10)).toBeCloseTo(10, 10);
    expect(levierMaximalRepo(50)).toBeCloseTo(2, 10);
  });

  it('venteForceePourCash(95, 5) = 100 : lever 95 sous 5 % de décote oblige à vendre 100', () => {
    expect(venteForceePourCash(95, 5)).toBeCloseTo(100, 10);
  });

  it('décote nulle ⇒ on vend exactement le besoin ; la décote qui monte fait vendre PLUS', () => {
    expect(venteForceePourCash(42, 0)).toBeCloseTo(42, 10);
    expect(venteForceePourCash(42, 10)).toBeCloseTo(46.666667, 5);
    expect(venteForceePourCash(42, 10)).toBeGreaterThan(venteForceePourCash(42, 5));
  });

  it('cohérence : la vente forcée est l’inverse exact du financement repo à même décote', () => {
    expect(financementRepo(venteForceePourCash(95, 5), 5)).toBeCloseTo(95, 10);
    expect(financementRepo(venteForceePourCash(230, 12), 12)).toBeCloseTo(230, 8);
  });
});

describe('runs bancaires et dette souveraine', () => {
  it('tauxCouvertureDepots(25, 100) = 25 % : un run d’un quart des dépôts est fatal', () => {
    expect(tauxCouvertureDepots(25, 100)).toBeCloseTo(25, 10);
  });

  it('SVB, 9 mars 2023 : 42 Md$ sortis en un jour sur ~173 Md$ de dépôts ≈ 24,3 %', () => {
    expect((42 / 173) * 100).toBeCloseTo(24.277457, 5);
    expect(tauxCouvertureDepots(120, 100)).toBeCloseTo(120, 10); // la narrow bank survit à tout
  });

  it('chargeInteretsDette(180, 5) = 9 % du PIB — la Grèce de 2011 avant le premier euro de dépense', () => {
    expect(chargeInteretsDette(180, 5)).toBeCloseTo(9, 10);
  });

  it('la même dette à taux QE devient soutenable : (120, 1,5) = 1,8 % du PIB', () => {
    expect(chargeInteretsDette(120, 1.5)).toBeCloseTo(1.8, 10);
  });

  it('spreadSouverainPb(35, 1,5) = 3 350 pb : la Grèce de 2012, un niveau qui EST le défaut anticipé', () => {
    expect(spreadSouverainPb(35, 1.5)).toBeCloseTo(3350, 10);
  });

  it('spread usuel OAT-Bund : (3, 2,5) = 50 pb ; négatif si le pays emprunte sous la référence', () => {
    expect(spreadSouverainPb(3, 2.5)).toBeCloseTo(50, 10);
    expect(spreadSouverainPb(2, 2.5)).toBeCloseTo(-50, 10);
  });
});

describe('cohérence croisée avec le m10 — l’anatomie chiffrée de SVB', () => {
  it('duration 5,7 × +200 pb = −11,4 % sur le portefeuille obligataire (fonction du m10, jamais recopiée)', () => {
    expect(variationPrixObligationDuration(5.7, 200)).toBeCloseTo(-11.4, 10);
  });

  it('−11,4 % sur ~140 Md$ de titres ≈ −15,96 Md$ : l’ordre de grandeur des fonds propres — la banque était morte en silence', () => {
    const perte = (variationPrixObligationDuration(5.7, 200) / 100) * 140;
    expect(perte).toBeCloseTo(-15.96, 6);
    expect(Math.abs(perte)).toBeGreaterThan(15); // ≈ CET1 de SVB (~16 Md$)
  });
});
