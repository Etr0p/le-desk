import { describe, expect, it } from 'vitest';
import {
  vaAnnuite, vfAnnuite, perpetuite, van,
  moyenneArithmetique, moyenneGeometrique, varianceEchantillon, ecartTypeEchantillon,
  volatiliteAnnualisee, covarianceEchantillon, correlation,
  combinaisons, probaBinomiale, esperanceBinomiale, bayes,
  normaleCdf, zScore, intervalleConfiance, statT,
  penteRegression, ordonneeRegression, r2Regression,
  esperancePortefeuille2, variancePortefeuille2,
} from './calculs';

describe('valeur temps de l\'argent — valeurs de référence', () => {
  // 100/1,05 + 100/1,05² + 100/1,05³ = 95,238095 + 90,702948 + 86,383760 = 272,324803
  it('vaAnnuite : VA d\'une annuité constante de fin de période', () => {
    expect(vaAnnuite(100, 5, 3)).toBeCloseTo(272.3248, 3);
  });
  // VF en t=3 d'une annuité de fin de période : 100×1,05² + 100×1,05 + 100 = 110,25 + 105 + 100 = 315,25
  it('vfAnnuite : VF d\'une annuité constante de fin de période', () => {
    expect(vfAnnuite(100, 5, 3)).toBeCloseTo(315.25, 6);
  });
  // VF = VA × (1+r)^n : 272,324803 × 1,05³ = 315,25
  it('cohérence vfAnnuite = vaAnnuite × (1+r)^n', () => {
    expect(vfAnnuite(100, 5, 3)).toBeCloseTo(vaAnnuite(100, 5, 3) * 1.05 ** 3, 9);
  });
  // 50/0,04 = 1250
  it('perpetuite : flux/taux', () => {
    expect(perpetuite(50, 4)).toBeCloseTo(1250, 9);
  });
  // −1000 + 400/1,1 + 400/1,1² + 400/1,1³ = −1000 + 363,636364 + 330,578512 + 300,525920 = −5,259204
  // VAN légèrement NÉGATIVE : trois flux de 400 à 10 % ne remboursent pas tout à fait 1000.
  it('van : VAN avec investissement en t=0 et flux en t=1..n', () => {
    expect(van(1000, [400, 400, 400], 10)).toBeCloseTo(-5.2592, 3);
  });
  it('van à taux nul = somme des flux moins l\'investissement', () => {
    expect(van(1000, [400, 400, 400], 0)).toBeCloseTo(200, 9);
  });
  // Propriété : van(0, flux constants, taux) = vaAnnuite(flux, taux, n)
  it('propriété : van sans investissement = vaAnnuite pour des flux constants', () => {
    expect(van(0, [100, 100, 100], 5)).toBeCloseTo(vaAnnuite(100, 5, 3), 9);
    expect(van(0, [250, 250, 250, 250], 3.7)).toBeCloseTo(vaAnnuite(250, 3.7, 4), 9);
  });
});

describe('statistiques descriptives — valeurs de référence', () => {
  // (2+4+6)/3 = 4
  it('moyenneArithmetique', () => {
    expect(moyenneArithmetique([2, 4, 6])).toBeCloseTo(4, 9);
  });
  // √(1,1×0,9) − 1 = √0,99 − 1 = 0,99498744 − 1 = −0,00501256 → −0,5013 %
  // (et non −0,5038 % : vérifié indépendamment, √0,99 = 0,9949874371)
  it('moyenneGeometrique : composition de +10 % puis −10 %', () => {
    expect(moyenneGeometrique([10, -10])).toBeCloseTo(-0.50126, 4);
  });
  it('moyenneGeometrique de rendements identiques = ce rendement', () => {
    expect(moyenneGeometrique([7, 7, 7])).toBeCloseTo(7, 9);
  });
  // Moyenne 4 ; écarts −2, 0, 2 ; somme des carrés 8 ; / (n−1) = 8/2 = 4
  it('varianceEchantillon (dénominateur n−1)', () => {
    expect(varianceEchantillon([2, 4, 6])).toBeCloseTo(4, 9);
  });
  it('ecartTypeEchantillon = √variance', () => {
    expect(ecartTypeEchantillon([2, 4, 6])).toBeCloseTo(2, 9);
  });
  // 2 × √252 = 2 × 15,874508 = 31,749016
  it('volatiliteAnnualisee : 2 % quotidien sur 252 jours', () => {
    expect(volatiliteAnnualisee(2, 252)).toBeCloseTo(31.7490, 3);
  });
  // xs=[1,2,3] (moy 2), ys=[2,4,6] (moy 4) : ((−1)(−2) + 0×0 + 1×2)/(3−1) = 4/2 = 2
  it('covarianceEchantillon (dénominateur n−1)', () => {
    expect(covarianceEchantillon([1, 2, 3], [2, 4, 6])).toBeCloseTo(2, 9);
  });
  it('correlation parfaite positive = 1, parfaite négative = −1', () => {
    expect(correlation([1, 2, 3], [2, 4, 6])).toBeCloseTo(1, 9);
    expect(correlation([1, 2, 3], [6, 4, 2])).toBeCloseTo(-1, 9);
  });
  // Propriété : |ρ| ≤ 1 sur des données quelconques
  it('propriété : correlation toujours dans [−1, 1]', () => {
    const xs = [1.3, -2.7, 4.1, 0.4, 9.9, -3.2];
    const ys = [0.7, 5.5, -1.1, 8.2, 2.4, -6.6];
    const rho = correlation(xs, ys);
    expect(rho).toBeGreaterThanOrEqual(-1);
    expect(rho).toBeLessThanOrEqual(1);
  });
});

describe('probabilités — valeurs de référence', () => {
  // C(10,3) = 10!/(3!·7!) = (10×9×8)/(3×2×1) = 720/6 = 120
  it('combinaisons(10, 3) = 120', () => {
    expect(combinaisons(10, 3)).toBe(120);
  });
  it('combinaisons : cas limites C(n,0) = C(n,n) = 1', () => {
    expect(combinaisons(8, 0)).toBe(1);
    expect(combinaisons(8, 8)).toBe(1);
  });
  // C(10,3) × 0,5³ × 0,5⁷ = 120/1024 = 0,1171875
  it('probaBinomiale(10, 3, 0.5) = 120/1024', () => {
    expect(probaBinomiale(10, 3, 0.5)).toBeCloseTo(0.1171875, 9);
  });
  // Somme des P(k) sur k=0..n = 1
  it('propriété : la binomiale somme à 1', () => {
    let s = 0;
    for (let k = 0; k <= 10; k++) s += probaBinomiale(10, k, 0.3);
    expect(s).toBeCloseTo(1, 9);
  });
  // E = n×p = 10 × 0,3 = 3
  it('esperanceBinomiale = n·p', () => {
    expect(esperanceBinomiale(10, 0.3)).toBeCloseTo(3, 9);
  });
  // Test médical classique : P(M)=0,01, sensibilité P(+|M)=0,99, faux positifs P(+|¬M)=0,05.
  // P(M|+) = 0,99×0,01 / (0,99×0,01 + 0,05×0,99) = 0,0099/0,0594 = 1/6 ≈ 0,166667 (16,67 %)
  it('bayes : test médical, P(malade|positif) = 1/6', () => {
    expect(bayes(0.01, 0.99, 0.05)).toBeCloseTo(1 / 6, 9);
  });
});

describe('loi normale et inférence — valeurs de référence', () => {
  // Valeurs tabulées (recoupées par intégration numérique de Simpson de la densité) :
  // Φ(0) = 0,5 ; Φ(1) = 0,8413447461 ; Φ(1,96) = 0,9750021049 ; Φ(−1) = 0,1586552539 ; Φ(2) = 0,9772498681
  // Tolérance 1e-7 : la borne d'erreur de l'approximation A&S 26.2.17 est |ε| < 7,5e-8.
  it('normaleCdf : valeurs tabulées à 1e-7', () => {
    const tabulees: [number, number][] = [
      [0, 0.5],
      [1, 0.8413447461],
      [1.96, 0.9750021049],
      [-1, 0.1586552539],
      [2, 0.9772498681],
    ];
    for (const [z, phi] of tabulees) {
      expect(Math.abs(normaleCdf(z) - phi)).toBeLessThan(1e-7);
    }
  });
  it('propriété : normaleCdf strictement croissante', () => {
    const zs = [-3, -2, -1, -0.5, 0, 0.5, 1, 2, 3];
    for (let i = 1; i < zs.length; i++) {
      expect(normaleCdf(zs[i])).toBeGreaterThan(normaleCdf(zs[i - 1]));
    }
  });
  it('propriété : symétrie normaleCdf(−z) = 1 − normaleCdf(z) à 1e-7', () => {
    for (const z of [0.25, 0.5, 1, 1.645, 1.96, 2.575, 3.5]) {
      expect(normaleCdf(-z)).toBeCloseTo(1 - normaleCdf(z), 7);
    }
  });
  // (110 − 100)/8 = 1,25
  it('zScore', () => {
    expect(zScore(110, 100, 8)).toBeCloseTo(1.25, 9);
  });
  // 100 ± 1,96 × 15/√36 = 100 ± 1,96 × 2,5 = 100 ± 4,9 → [95,1 ; 104,9]
  it('intervalleConfiance à 95 % (z = 1,96 par défaut)', () => {
    const ic = intervalleConfiance(100, 15, 36);
    expect(ic.basse).toBeCloseTo(95.1, 6);
    expect(ic.haute).toBeCloseTo(104.9, 6);
  });
  // 100 ± 2,575 × 15/6 = 100 ± 6,4375 → [93,5625 ; 106,4375]
  it('intervalleConfiance avec z explicite (99 %)', () => {
    const ic = intervalleConfiance(100, 15, 36, 2.575);
    expect(ic.basse).toBeCloseTo(93.5625, 6);
    expect(ic.haute).toBeCloseTo(106.4375, 6);
  });
  // (102 − 100)/(5/√25) = 2/1 = 2
  it('statT : moyenne 102, mu0 100, s 5, n 25 → 2', () => {
    expect(statT(102, 100, 5, 25)).toBeCloseTo(2, 9);
  });
});

describe('régression linéaire — valeurs de référence', () => {
  // {(1,2),(2,4),(3,6)} : y = 2x exactement → pente 2, ordonnée 0, R² = 1
  it('pente, ordonnée et R² sur des points parfaitement alignés', () => {
    expect(penteRegression([1, 2, 3], [2, 4, 6])).toBeCloseTo(2, 9);
    expect(ordonneeRegression([1, 2, 3], [2, 4, 6])).toBeCloseTo(0, 9);
    expect(r2Regression([1, 2, 3], [2, 4, 6])).toBeCloseTo(1, 9);
  });
  // {(1,3),(2,5),(3,7)} : y = 2x + 1 → pente 2, ordonnée 1
  it('ordonnée non nulle : y = 2x + 1', () => {
    expect(penteRegression([1, 2, 3], [3, 5, 7])).toBeCloseTo(2, 9);
    expect(ordonneeRegression([1, 2, 3], [3, 5, 7])).toBeCloseTo(1, 9);
  });
  // Cohérence : pente = cov/var ; R² = ρ²
  it('cohérence pente = cov/var et R² = corrélation²', () => {
    const xs = [1, 2, 4, 5, 7];
    const ys = [2, 3, 5, 4, 8];
    expect(penteRegression(xs, ys)).toBeCloseTo(covarianceEchantillon(xs, ys) / varianceEchantillon(xs), 9);
    expect(r2Regression(xs, ys)).toBeCloseTo(correlation(xs, ys) ** 2, 9);
  });
});

describe('portefeuille 2 actifs — pont vers le module 12', () => {
  // 0,6 × 8 + 0,4 × 3 = 4,8 + 1,2 = 6 %
  it('esperancePortefeuille2 : moyenne pondérée des rendements', () => {
    expect(esperancePortefeuille2(0.6, 8, 3)).toBeCloseTo(6, 9);
  });
  // w1²σ1² + w2²σ2² + 2w1w2ρσ1σ2 = 0,25×400 + 0,25×100 + 0 = 125 %² → σ = √125 ≈ 11,18 %
  it('variancePortefeuille2(0.5, 20, 10, 0) = 125 %²', () => {
    expect(variancePortefeuille2(0.5, 20, 10, 0)).toBeCloseTo(125, 9);
    expect(Math.sqrt(variancePortefeuille2(0.5, 20, 10, 0))).toBeCloseTo(11.1803, 3);
  });
  // ρ = 1 : σ = w1σ1 + w2σ2 = 15 → variance 225 %²
  it('variancePortefeuille2 avec ρ = 1 : pas de diversification', () => {
    expect(variancePortefeuille2(0.5, 20, 10, 1)).toBeCloseTo(225, 9);
  });
  // ρ = −1 : σ = |w1σ1 − w2σ2| = 5 → variance 25 %²
  it('variancePortefeuille2 avec ρ = −1 : couverture maximale', () => {
    expect(variancePortefeuille2(0.5, 20, 10, -1)).toBeCloseTo(25, 9);
  });
});
