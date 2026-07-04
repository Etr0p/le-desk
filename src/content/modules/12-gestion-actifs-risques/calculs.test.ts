import { describe, expect, it } from 'vitest';
import {
  rendementPortefeuille2Actifs,
  volatilitePortefeuille2Actifs,
  betaActif,
  rendementCapm,
  alphaJensen,
  ratioSharpe,
  ratioInformation,
  varParametrique,
  varHorizon,
  perteStressMillions,
  actifsPonderesRisqueMillions,
  ratioCet1Pct,
  lcrPct,
  valeurNetteDeFrais,
} from './calculs';

// Valeurs de référence VÉRIFIÉES À LA MAIN (aucune ne sort de l'implémentation) :
// — Rendement ptf : 0,6×8 + 0,4×3 = 6 %.
// — Vol ptf (60/40, 20/10) : ρ 0,3 ⇒ √(144 + 16 + 28,8) = √188,8 = 13,740451 ;
//   ρ 1 ⇒ 16 exactement (moyenne pondérée) ; ρ −1 ⇒ |12 − 4| = 8 ;
//   ρ 0, 50/50, 20/20 ⇒ 20/√2 = 14,142136.
// — β = 0,8×25/15 = 1,333333 ; CAPM 3 + 1,2×5 = 9 ; alpha 12 − (3 + 1,2×7) = 0,6.
// — Sharpe (8−3)/10 = 0,5 ; IR 2/4 = 0,5.
// — VaR 1 j 95 % (100 M, 20 %) : 100×1,65×0,2×√(1/252) = 2,078805 M ;
//   VaR 10 j 99 % (100, 20, 2,33) = 9,282942 ; 2×√10 = 6,324555.
// — Stress : 100×(−20)×1,2/100 = −24 M.
// — RWA 100×75 % = 75 ; CET1 12/100 = 12 % ; LCR 120/100 = 120 %.
// — Frais : 100×1,07³⁰ = 761,225504 ; 100×1,05³⁰ = 432,194238 (coût
//   329,031266) ; 100×1,068³⁰ = 719,676929 ; 1 an (100, 7, 2) = 105.

describe('rendement et volatilité de portefeuille', () => {
  it('rendementPortefeuille2Actifs(60, 8, 3) = 6 % — le rendement se diversifie linéairement', () => {
    expect(rendementPortefeuille2Actifs(60, 8, 3)).toBeCloseTo(6, 10);
  });

  it('vol ptf (60/40, 20/10, ρ 0,3) = 13,740451 % — moins que la moyenne pondérée', () => {
    expect(volatilitePortefeuille2Actifs(60, 20, 10, 0.3)).toBeCloseTo(13.740451, 5);
  });

  it('à ρ = 1, la vol EST la moyenne pondérée (16 %) : plus aucune diversification', () => {
    expect(volatilitePortefeuille2Actifs(60, 20, 10, 1)).toBeCloseTo(16, 10);
  });

  it('à ρ = −1, (60, 20, 10) tombe à 8 % — la couverture parfaite existe', () => {
    expect(volatilitePortefeuille2Actifs(60, 20, 10, -1)).toBeCloseTo(8, 10);
  });

  it('à ρ = 0, deux actifs identiques en 50/50 divisent la vol par √2 : 14,142136 %', () => {
    expect(volatilitePortefeuille2Actifs(50, 20, 20, 0)).toBeCloseTo(14.142136, 5);
  });

  it('la diversification ne crée jamais de risque : vol ptf ≤ moyenne pondérée pour tout ρ ≤ 1', () => {
    for (const rho of [-1, -0.5, 0, 0.5, 1]) {
      const moyenne = 0.6 * 20 + 0.4 * 10;
      expect(volatilitePortefeuille2Actifs(60, 20, 10, rho)).toBeLessThanOrEqual(moyenne + 1e-9);
    }
  });
});

describe('CAPM, alpha et ratios', () => {
  it('betaActif(0,8, 25, 15) = 1,333333 — le bêta mêle corrélation ET volatilité relative', () => {
    expect(betaActif(0.8, 25, 15)).toBeCloseTo(1.333333, 5);
  });

  it('un actif volatil mais décorrélé a un bêta nul : (0, 40, 15) = 0', () => {
    expect(betaActif(0, 40, 15)).toBeCloseTo(0, 10);
  });

  it('rendementCapm(3, 1,2, 5) = 9 %', () => {
    expect(rendementCapm(3, 1.2, 5)).toBeCloseTo(9, 10);
  });

  it('alphaJensen(12, 3, 1,2, 10) = +0,6 % — battre SON risque, pas le marché', () => {
    expect(alphaJensen(12, 3, 1.2, 10)).toBeCloseTo(0.6, 10);
  });

  it('un fonds qui fait 10 % avec un bêta de 1 sur un marché à 10 % n\'a AUCUN alpha', () => {
    expect(alphaJensen(10, 3, 1, 10)).toBeCloseTo(0, 10);
  });

  it('ratioSharpe(8, 3, 10) = 0,5 ; ratioInformation(2, 4) = 0,5', () => {
    expect(ratioSharpe(8, 3, 10)).toBeCloseTo(0.5, 10);
    expect(ratioInformation(2, 4)).toBeCloseTo(0.5, 10);
  });
});

describe('VaR et stress', () => {
  it('VaR 1 j 95 % (100 M, vol 20 %) = 2,078805 M', () => {
    expect(varParametrique(100, 20, 1.65, 1)).toBeCloseTo(2.078805, 5);
  });

  it('VaR 10 j 99 % (100 M, 20 %, z 2,33) = 9,282942 M', () => {
    expect(varParametrique(100, 20, 2.33, 10)).toBeCloseTo(9.282942, 5);
  });

  it('varHorizon : 2 M/j sur 10 jours = 6,324555 M (racine du temps)', () => {
    expect(varHorizon(2, 10)).toBeCloseTo(6.324555, 5);
  });

  it('cohérence : varParametrique à h jours = varHorizon de la VaR 1 jour', () => {
    expect(varParametrique(100, 20, 2.33, 10)).toBeCloseTo(varHorizon(varParametrique(100, 20, 2.33, 1), 10), 8);
  });

  it('perteStressMillions(100, −20, 1,2) = −24 M — le scénario, pas la probabilité', () => {
    expect(perteStressMillions(100, -20, 1.2)).toBeCloseTo(-24, 10);
  });
});

describe('Bâle III : capital et liquidité', () => {
  it('actifsPonderesRisqueMillions(100, 75) = 75 M', () => {
    expect(actifsPonderesRisqueMillions(100, 75)).toBeCloseTo(75, 10);
  });

  it('ratioCet1Pct(12, 100) = 12 % — le niveau de vie des grandes banques européennes', () => {
    expect(ratioCet1Pct(12, 100)).toBeCloseTo(12, 10);
  });

  it('lcrPct(120, 100) = 120 % — survivre 30 jours de run sans banque centrale', () => {
    expect(lcrPct(120, 100)).toBeCloseTo(120, 10);
  });

  it('une pondération nulle (souverain AAA) ne consomme aucun capital', () => {
    expect(actifsPonderesRisqueMillions(500, 0)).toBe(0);
  });
});

describe('l\'arithmétique des frais', () => {
  it('100 investis 30 ans à 7 % brut = 761,225504', () => {
    expect(valeurNetteDeFrais(100, 7, 0, 30)).toBeCloseTo(761.225504, 5);
  });

  it('avec 2 % de frais annuels : 432,194238 — les frais coûtent 329,031266', () => {
    expect(valeurNetteDeFrais(100, 7, 2, 30)).toBeCloseTo(432.194238, 5);
    expect(valeurNetteDeFrais(100, 7, 0, 30) - valeurNetteDeFrais(100, 7, 2, 30)).toBeCloseTo(329.031266, 4);
  });

  it('un ETF à 0,2 % laisse 719,676929 — l\'argument massue du passif', () => {
    expect(valeurNetteDeFrais(100, 7, 0.2, 30)).toBeCloseTo(719.676929, 5);
  });

  it('sur 1 an, (100, 7, 2) = 105 — aucune année ne semble chère', () => {
    expect(valeurNetteDeFrais(100, 7, 2, 1)).toBeCloseTo(105, 10);
  });
});
