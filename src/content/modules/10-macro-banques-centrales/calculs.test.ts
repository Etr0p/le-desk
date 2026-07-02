import { describe, expect, it } from 'vitest';
import { va, prixObligation, durationMacaulay, durationModifiee } from '../04-taux-obligations/calculs';
import {
  tauxReelFisher,
  tauxReelApproche,
  tauxNominalRequis,
  regleDeTaylor,
  interetsComposesInflation,
  indiceDesPrix,
  inflationAnnualiseeDepuisMensuelle,
  surpriseIndicateur,
  tauxTerminalAnticipe,
  variationPrixObligationDuration,
  ratioSacrifice,
} from './calculs';

// Valeurs de référence VÉRIFIÉES À LA MAIN (aucune ne sort de l'implémentation) :
// — Fisher exact (5, 2) : 1,05/1,02 − 1 = 2,941176 % ; approx 3 % (écart 6 pb).
// — Fisher exact (10, 8) : 1,10/1,08 − 1 = 1,851852 % ; approx 2 % (écart 15 pb :
//   l'approximation se dégrade aux taux élevés).
// — Taylor (r* 2, π 4, π* 2, gap −1) : 2 + 4 + 0,5·2 + 0,5·(−1) = 6,5 %.
// — Érosion (100, 5 %, 10 ans) : 100/1,05^10 = 100/1,628895 = 61,391325.
// — Indice (100, [2, 3, 10]) : 102 → 105,06 → 115,566.
// — Mensuel 0,5 % annualisé : 1,005^12 − 1 = 6,167781 % (≠ 12 × 0,5 = 6 %).
// — Obligation pair 5 %, 10 ans : D_mac = 8,107822, D_mod = 7,721735 ;
//   prix à 6 % = 92,639913 (repricing exact, à comparer à l'approx duration).

describe('équation de Fisher : taux réel exact et approché', () => {
  it('exact (5, 2) = (1,05/1,02 − 1)·100 = 2,941176', () => {
    expect(tauxReelFisher(5, 2)).toBeCloseTo(2.941176, 5);
  });

  it('inflation nulle ⇒ le taux réel EST le taux nominal (exact et approx confondus)', () => {
    expect(tauxReelFisher(2, 0)).toBeCloseTo(2, 10);
    expect(tauxReelApproche(2, 0)).toBeCloseTo(2, 10);
  });

  it('nominal = inflation ⇒ taux réel nul (l’épargnant fait du surplace)', () => {
    expect(tauxReelFisher(3, 3)).toBeCloseTo(0, 10);
  });

  it('taux réel NÉGATIF quand l’inflation dépasse le nominal : (0, 2) = −1,960784 ; (4, 6) = −1,886792', () => {
    expect(tauxReelFisher(0, 2)).toBeCloseTo(-1.960784, 5);
    expect(tauxReelFisher(4, 6)).toBeCloseTo(-1.886792, 5);
  });

  it('l’approximation i − π surestime le réel, et l’écart grandit avec les taux', () => {
    expect(tauxReelApproche(5, 2)).toBeCloseTo(3, 10);
    expect(tauxReelFisher(10, 8)).toBeCloseTo(1.851852, 5);
    expect(tauxReelApproche(10, 8)).toBeCloseTo(2, 10);
    const ecartBas = tauxReelApproche(5, 2) - tauxReelFisher(5, 2); // ≈ 5,9 pb
    const ecartHaut = tauxReelApproche(10, 8) - tauxReelFisher(10, 8); // ≈ 14,8 pb
    expect(ecartBas).toBeGreaterThan(0);
    expect(ecartHaut).toBeGreaterThan(ecartBas);
  });

  it('tauxNominalRequis est l’inverse exact : (3, 2) = 5,06 et l’aller-retour retombe sur 3', () => {
    expect(tauxNominalRequis(3, 2)).toBeCloseTo(5.06, 10);
    expect(tauxReelFisher(tauxNominalRequis(3, 2), 2)).toBeCloseTo(3, 10);
    expect(tauxNominalRequis(0, 2)).toBeCloseTo(2, 10); // préserver le pouvoir d'achat = servir l'inflation
  });
});

describe('règle de Taylor', () => {
  it('cas de référence vérifié à la main : r* 2, π 4, cible 2, gap −1 ⇒ 2 + 4 + 0,5·2 − 0,5·1 = 6,5', () => {
    expect(regleDeTaylor(2, 4, 2, -1)).toBeCloseTo(6.5, 10);
  });

  it('à l’équilibre (π = π*, gap nul), le taux directeur = r* + π* (le taux neutre nominal)', () => {
    expect(regleDeTaylor(2, 2, 2, 0)).toBeCloseTo(4, 10);
  });

  it('déflation + récession poussent la règle vers zéro : (2, 0, 2, −2) = 0', () => {
    expect(regleDeTaylor(2, 0, 2, -2)).toBeCloseTo(0, 10);
  });

  it('la règle peut prescrire un taux NÉGATIF — la motivation du QE à la borne zéro : (0,5, 0, 2, −4) = −2,5', () => {
    expect(regleDeTaylor(0.5, 0, 2, -4)).toBeCloseTo(-2.5, 10);
  });

  it('coefficients paramétrables (variante Taylor 1999) : coefInflation 1,5 ⇒ (2, 5, 2, 0) = 11,5', () => {
    expect(regleDeTaylor(2, 5, 2, 0, 1.5, 0.5)).toBeCloseTo(11.5, 10);
  });

  it('principe de Taylor : 1 point d’inflation en plus ⇒ le taux prescrit monte de PLUS d’un point (1,5 avec coef 0,5)', () => {
    const avant = regleDeTaylor(2, 3, 2, 0);
    const apres = regleDeTaylor(2, 4, 2, 0);
    expect(apres - avant).toBeCloseTo(1.5, 10);
  });
});

describe('le coût de l’inflation : pouvoir d’achat et indice des prix', () => {
  it('100 à 5 % d’inflation sur 10 ans ⇒ 61,391325 de pouvoir d’achat (−38,6 %)', () => {
    expect(interetsComposesInflation(100, 5, 10)).toBeCloseTo(61.391325, 5);
  });

  it('à 2 % (la cible) sur 10 ans, l’érosion reste douce : 82,034830', () => {
    expect(interetsComposesInflation(100, 2, 10)).toBeCloseTo(82.03483, 4);
  });

  it('1 000 à 8 % sur 5 ans = 680,583197 ; inflation nulle ⇒ rien ne bouge', () => {
    expect(interetsComposesInflation(1000, 8, 5)).toBeCloseTo(680.583197, 4);
    expect(interetsComposesInflation(100, 0, 20)).toBeCloseTo(100, 10);
  });

  it('identité avec le m4 : l’inflation actualise le pouvoir d’achat comme un taux actualise un flux (va)', () => {
    expect(interetsComposesInflation(100, 5, 10)).toBeCloseTo(va(100, 5, 10), 10);
  });

  it('indiceDesPrix chaîne les inflations : (100, [2, 3, 10]) = 115,566', () => {
    expect(indiceDesPrix(100, [2, 3, 10])).toBeCloseTo(115.566, 6);
  });

  it('sans inflation à chaîner, l’indice reste au niveau initial', () => {
    expect(indiceDesPrix(100, [])).toBe(100);
  });

  it('piège de l’asymétrie : +10 % puis −10 % ne reviennent PAS à 100 mais à 99', () => {
    expect(indiceDesPrix(100, [10, -10])).toBeCloseTo(99, 10);
  });

  it('cinq années à la cible de 2 % = 100·1,02^5 = 110,408080', () => {
    expect(indiceDesPrix(100, [2, 2, 2, 2, 2])).toBeCloseTo(110.40808, 5);
  });
});

describe('annualisation d’une inflation mensuelle', () => {
  it('0,5 %/mois = 1,005^12 − 1 = 6,167781 %/an — PAS 12 × 0,5 = 6 %', () => {
    expect(inflationAnnualiseeDepuisMensuelle(0.5)).toBeCloseTo(6.167781, 5);
    expect(inflationAnnualiseeDepuisMensuelle(0.5)).toBeGreaterThan(6); // la composition mord toujours
  });

  it('1 %/mois = 12,682503 % — le piège s’élargit quand le chiffre mensuel grossit', () => {
    expect(inflationAnnualiseeDepuisMensuelle(1)).toBeCloseTo(12.682503, 5);
  });

  it('cas limites : 0 %/mois = 0 %/an ; déflation mensuelle −0,5 % = −5,837719 %/an', () => {
    expect(inflationAnnualiseeDepuisMensuelle(0)).toBeCloseTo(0, 10);
    // 0,995^12 vérifié par carrés successifs : 0,995² = 0,990025 ;
    // ^4 = 0,980150 ; ^8 = 0,960693 ; ^12 = 0,960693·0,980150 = 0,941623.
    // NB : la déflation annualisée (−5,84 %) est MOINS que 12 × 0,5 = 6 % —
    // l'asymétrie de la composition joue dans les deux sens.
    expect(inflationAnnualiseeDepuisMensuelle(-0.5)).toBeCloseTo(-5.837719, 4);
  });
});

describe('surprise d’indicateur en écarts-types (la lecture des NFP/CPI)', () => {
  it('NFP : consensus 180k, publié 260k, σ 40k ⇒ surprise +2σ', () => {
    expect(surpriseIndicateur(180, 260, 40)).toBeCloseTo(2, 10);
  });

  it('CPI sous le consensus : (3,2, 3,0, 0,1) = −2σ — bon pour les obligations', () => {
    expect(surpriseIndicateur(3.2, 3.0, 0.1)).toBeCloseTo(-2, 10);
  });

  it('publié = consensus ⇒ surprise nulle, non-événement de marché', () => {
    expect(surpriseIndicateur(100, 100, 10)).toBe(0);
  });
});

describe('taux terminal anticipé (l’arithmétique des dot plots)', () => {
  it('2,50 % + 4 hausses de 50 pb = 4,50 %', () => {
    expect(tauxTerminalAnticipe(2.5, 4, 50)).toBeCloseTo(4.5, 10);
  });

  it('depuis zéro, dix hausses de 25 pb = 2,50 %', () => {
    expect(tauxTerminalAnticipe(0, 10, 25)).toBeCloseTo(2.5, 10);
  });

  it('un pas négatif décrit un cycle de BAISSE : 4 % puis 2 baisses de 25 pb = 3,50 %', () => {
    expect(tauxTerminalAnticipe(4, 2, -25)).toBeCloseTo(3.5, 10);
  });

  it('aucune hausse ⇒ statu quo', () => {
    expect(tauxTerminalAnticipe(5.25, 0, 25)).toBeCloseTo(5.25, 10);
  });
});

describe('impact des taux sur les obligations : approximation par la duration', () => {
  it('D_mod 7, +50 pb ⇒ −3,5 % ; D_mod 5, −100 pb ⇒ +5 %', () => {
    expect(variationPrixObligationDuration(7, 50)).toBeCloseTo(-3.5, 10);
    expect(variationPrixObligationDuration(5, -100)).toBeCloseTo(5, 10);
  });

  it('duration nulle (monétaire) ⇒ insensible aux taux', () => {
    expect(variationPrixObligationDuration(0, 200)).toBeCloseTo(0, 15); // −0 en IEEE 754, égal à 0 à toute tolérance
  });

  it('cohérence m4 sur l’obligation au pair 5 %, 10 ans : D_mod = 7,721735 et l’approx colle au repricing exact à 0,5 pt près', () => {
    const dMod = durationModifiee(durationMacaulay(100, 5, 10, 5), 5);
    expect(dMod).toBeCloseTo(7.721735, 5);
    const approx = variationPrixObligationDuration(dMod, 100); // +100 pb
    const exact = ((prixObligation(100, 5, 10, 6) - 100) / 100) * 100; // −7,360087 % (prix 92,639913)
    expect(exact).toBeCloseTo(-7.360087, 5);
    expect(Math.abs(approx - exact)).toBeLessThan(0.5);
    expect(approx).toBeLessThan(exact); // la convexité (m4) joue TOUJOURS en faveur du porteur
  });
});

describe('ratio de sacrifice (le prix d’une désinflation à la Volcker)', () => {
  it('3 points de désinflation au prix de −6 % de production cumulée ⇒ ratio 2', () => {
    expect(ratioSacrifice(3, -6)).toBeCloseTo(2, 10);
  });

  it('accepte la perte en valeur absolue comme en gap négatif : (5, −5) = (5, 5) = 1', () => {
    expect(ratioSacrifice(5, -5)).toBeCloseTo(1, 10);
    expect(ratioSacrifice(5, 5)).toBeCloseTo(1, 10);
  });

  it('désinflation indolore (gap cumulé nul) ⇒ ratio 0 — le scénario « immaculé » de 2023-24', () => {
    expect(ratioSacrifice(4, 0)).toBe(0);
  });
});
