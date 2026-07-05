import { describe, expect, it } from 'vitest';
import {
  regleDe72,
  anneesDoublementExactes,
  erreurRelativePct,
  probaAuMoinsUnPct,
  probaAnniversairesPct,
  bayesAPosterioriPct,
  combinaisons,
  probaSerieConsecutivePct,
  esperanceLancerDe,
  esperanceJeu,
  coteEquitable,
  estimationFermi,
} from './calculs';

// Valeurs de référence VÉRIFIÉES À LA MAIN (aucune ne sort de l'implémentation) :
// — Règle de 72 : 72/8 = 9 ; 72/6 = 12 ; 72/2 = 36. Exact : ln 2/ln 1,08 =
//   9,006468 ; ln 2/ln 1,06 = 11,895661 ; ln 2/ln 1,02 = 35,002789.
//   Erreur relative à 8 % : (9 − 9,006468)/9,006468 = −0,071819 %.
// — Au moins un : 1 − (5/6)⁴ = 51,774691 % (pari de Méré) ; 1 − 0,5³ = 87,5 %.
// — Anniversaires : n 23 ⇒ 50,729723 % ; n 50 ⇒ 97,037358 % ; n 70 ⇒ 99,915958 %.
// — Bayes : (1 %, 99 %, 5 %) ⇒ 0,0099/(0,0099 + 0,0495) = 16,666667 % ;
//   (0,1 %, 99 %, 1 %) ⇒ 9,016393 % ; (50 %, 90 %, 10 %) ⇒ 90 %.
// — C(52, 5) = 2 598 960 ; C(10, 3) = 120 ; C(6, 2) = 15 ; C(n, 0) = 1.
// — Séries : 0,5⁵ = 3,125 % ; (1/6)³ = 0,462963 %.
// — Espérances : d6 ⇒ 3,5 ; d100 ⇒ 50,5 ; dé en euros ⇒ 3,5 €.
// — Cotes : p 25 % ⇒ 4 ; p 1/6 ⇒ 6.
// — Fermi : √(1 000 × 1 000 000) = 31 622,776602 ; √(10 × 1 000) = 100.

describe('règle de 72 et doublement', () => {
  it('72/8 = 9 ans ; 72/6 = 12 ; 72/2 = 36', () => {
    expect(regleDe72(8)).toBeCloseTo(9, 10);
    expect(regleDe72(6)).toBeCloseTo(12, 10);
    expect(regleDe72(2)).toBeCloseTo(36, 10);
  });

  it('exact : 8 % ⇒ 9,006468 ans ; 6 % ⇒ 11,895661 ; 2 % ⇒ 35,002789', () => {
    expect(anneesDoublementExactes(8)).toBeCloseTo(9.006468, 5);
    expect(anneesDoublementExactes(6)).toBeCloseTo(11.895661, 5);
    expect(anneesDoublementExactes(2)).toBeCloseTo(35.002789, 5);
  });

  it('la règle de 72 est quasi exacte à 8 % : erreur −0,071819 %', () => {
    expect(erreurRelativePct(regleDe72(8), anneesDoublementExactes(8))).toBeCloseTo(-0.071819, 4);
  });

  it('aux taux bas, la règle surestime : 72/2 = 36 contre 35,002789 exacts', () => {
    expect(regleDe72(2)).toBeGreaterThan(anneesDoublementExactes(2));
  });
});

describe('probabilités d\'entretien', () => {
  it('au moins un 6 en 4 lancers = 51,774691 % — le pari de Méré, favorable de justesse', () => {
    expect(probaAuMoinsUnPct(100 / 6, 4)).toBeCloseTo(51.774691, 5);
  });

  it('au moins un pile en 3 lancers = 87,5 % — et PAS 150 % (piège additif n×p)', () => {
    expect(probaAuMoinsUnPct(50, 3)).toBeCloseTo(87.5, 10);
  });

  it('anniversaires : 23 personnes suffisent pour dépasser 50 % (50,729723 %)', () => {
    expect(probaAnniversairesPct(23)).toBeCloseTo(50.729723, 5);
    expect(probaAnniversairesPct(22)).toBeLessThan(50);
  });

  it('anniversaires : 50 personnes ⇒ 97,037358 % ; 70 ⇒ 99,915958 %', () => {
    expect(probaAnniversairesPct(50)).toBeCloseTo(97.037358, 5);
    expect(probaAnniversairesPct(70)).toBeCloseTo(99.915958, 5);
  });

  it('Bayes, LE classique : prévalence 1 %, sensibilité 99 %, faux positifs 5 % ⇒ 16,666667 %', () => {
    expect(bayesAPosterioriPct(1, 99, 5)).toBeCloseTo(16.666667, 5);
  });

  it('Bayes : maladie plus rare (0,1 %, 99 %, 1 %) ⇒ 9,016393 % — les faux positifs noient tout', () => {
    expect(bayesAPosterioriPct(0.1, 99, 1)).toBeCloseTo(9.016393, 5);
  });

  it('Bayes : à prévalence 50 %, le test domine : (50, 90, 10) ⇒ 90 %', () => {
    expect(bayesAPosterioriPct(50, 90, 10)).toBeCloseTo(90, 10);
  });

  it('combinaisons : C(52, 5) = 2 598 960 ; C(10, 3) = 120 ; C(6, 2) = 15 ; C(7, 0) = 1', () => {
    expect(combinaisons(52, 5)).toBe(2598960);
    expect(combinaisons(10, 3)).toBe(120);
    expect(combinaisons(6, 2)).toBe(15);
    expect(combinaisons(7, 0)).toBe(1);
  });

  it('séries consécutives : cinq piles = 3,125 % ; trois 6 = 0,462963 %', () => {
    expect(probaSerieConsecutivePct(50, 5)).toBeCloseTo(3.125, 10);
    expect(probaSerieConsecutivePct(100 / 6, 3)).toBeCloseTo(0.462963, 5);
  });
});

describe('jeux, cotes et espérances', () => {
  it('espérance d\'un dé : E[d6] = 3,5 ; E[d100] = 50,5', () => {
    expect(esperanceLancerDe(6)).toBeCloseTo(3.5, 10);
    expect(esperanceLancerDe(100)).toBeCloseTo(50.5, 10);
  });

  it('espérance d\'un jeu : gagner la face d\'un d6 en euros vaut 3,5 €', () => {
    const probas = [100 / 6, 100 / 6, 100 / 6, 100 / 6, 100 / 6, 100 / 6];
    expect(esperanceJeu(probas, [1, 2, 3, 4, 5, 6])).toBeCloseTo(3.5, 8);
  });

  it('cohérence : l\'espérance du jeu « face en euros » égale esperanceLancerDe(6)', () => {
    const probas = Array.from({ length: 6 }, () => 100 / 6);
    expect(esperanceJeu(probas, [1, 2, 3, 4, 5, 6])).toBeCloseTo(esperanceLancerDe(6), 8);
  });

  it('cote équitable : p 25 % ⇒ 4 pour 1 ; p un sixième ⇒ 6 pour 1', () => {
    expect(coteEquitable(25)).toBeCloseTo(4, 10);
    expect(coteEquitable(100 / 6)).toBeCloseTo(6, 10);
  });

  it('à la cote équitable, l\'espérance du pari est nulle', () => {
    const p = 25;
    const cote = coteEquitable(p);
    expect(esperanceJeu([p, 100 - p], [cote - 1, -1])).toBeCloseTo(0, 10);
  });
});

describe('estimations de Fermi', () => {
  it('Fermi(1 000, 1 000 000) = 31 622,776602 — le milieu multiplicatif, pas 500 000', () => {
    expect(estimationFermi(1000, 1000000)).toBeCloseTo(31622.776602, 4);
  });

  it('Fermi(10, 1 000) = 100 — une décade de chaque côté', () => {
    expect(estimationFermi(10, 1000)).toBeCloseTo(100, 10);
  });

  it('la moyenne géométrique est toujours sous la moyenne arithmétique (bornes distinctes)', () => {
    expect(estimationFermi(1000, 1000000)).toBeLessThan((1000 + 1000000) / 2);
  });
});
