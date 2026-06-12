import { describe, expect, it } from 'vitest';
import {
  forwardFx, pointsDeTerme,
  tauxPpa, surSousEvaluation,
  pnlCarryTrade,
  forwardCommodity, rollYieldAnnualise, baseFutures,
  coutSpreadFx,
  variationAnnualiseePct,
} from './calculs';

// Toutes les valeurs de référence ci-dessous ont été calculées à la main puis
// recoupées par un script node indépendant AVANT l'implémentation (TDD strict).
//
// Convention FX (documentée en tête de calculs.ts) : une paire s'écrit BASE/COTÉE,
// EUR/USD = 1,10 signifie 1 EUR (base) = 1,10 USD (cotée). La parité couverte
// s'écrit F = S × (1 + r_cotée·T)/(1 + r_base·T) en linéaire actuariel simple
// (convention marché monétaire FX, T en années).

describe('forwardFx — parité des taux d\'intérêt couverte (linéaire)', () => {
  // F = 1,10 × (1 + 0,05×1)/(1 + 0,03×1) = 1,10 × 1,05/1,03 = 1,155/1,03
  //   = 1,121359223300970… (script node : 1.12135922330097)
  // Lecture : la devise au taux le plus bas (base EUR à 3 %) se REVALORISE à terme —
  // le forward compense exactement le différentiel de portage (pas d'arbitrage).
  it('forwardFx(1.10, 5, 3, 1) = 1,10×1,05/1,03 ≈ 1,12135922', () => {
    expect(forwardFx(1.10, 5, 3, 1)).toBeCloseTo(1.12135922330097, 10);
  });
  // Différentiel nul ⇒ F = S exactement : 1,10 × 1,03/1,03 = 1,10.
  it('forwardFx(1.10, 3, 3, 1) = 1,10 exactement (différentiel nul)', () => {
    expect(forwardFx(1.10, 3, 3, 1)).toBeCloseTo(1.10, 12);
  });
  // T fractionnaire : 1,0850 × (1 + 0,045×0,5)/(1 + 0,020×0,5)
  //   = 1,0850 × 1,0225/1,01 = 1,098428217821782 (script node)
  it('forwardFx(1.0850, 4.5, 2.0, 0.5) ≈ 1,09842822 (6 mois)', () => {
    expect(forwardFx(1.0850, 4.5, 2.0, 0.5)).toBeCloseTo(1.09842821782178, 10);
  });
  // Propriété : rCotee = rBase ⇒ F = S, quel que soit l'horizon.
  it('propriété : rCotee = rBase ⇒ F = S (symétrie du portage)', () => {
    expect(forwardFx(1.2345, 4, 4, 0.75)).toBeCloseTo(1.2345, 12);
    expect(forwardFx(0.9, 0, 0, 2)).toBeCloseTo(0.9, 12);
  });
});

describe('pointsDeTerme — points de terme en pips', () => {
  // F − S = 1,121359223300971 − 1,10 = 0,021359223300971 → × 10 000 = 213,5922330… pips.
  // Positif : la base (EUR) cote À TERME plus cher qu'au comptant (report / premium).
  it('pointsDeTerme(1.10, forwardFx(1.10, 5, 3, 1)) ≈ +213,5922 pips', () => {
    expect(pointsDeTerme(1.10, forwardFx(1.10, 5, 3, 1))).toBeCloseTo(213.59223300971, 8);
  });
  // F < S ⇒ points négatifs (déport / discount) : (1,0950 − 1,1000) × 10 000 = −50 pips.
  it('pointsDeTerme(1.10, 1.0950) = −50 pips exactement (déport)', () => {
    expect(pointsDeTerme(1.10, 1.0950)).toBeCloseTo(-50, 9);
  });
  // Propriété : F = S ⇒ 0 pip.
  it('propriété : pointsDeTerme(s, s) = 0', () => {
    expect(pointsDeTerme(1.10, 1.10)).toBeCloseTo(0, 12);
  });
});

describe('tauxPpa & surSousEvaluation — parité des pouvoirs d\'achat (Big Mac)', () => {
  // Le panier coûte 5,80 en devise cotée (USD) et 5,00 en devise de base (EUR) :
  // taux PPA implicite EUR/USD = 5,80/5,00 = 1,16 exactement.
  it('tauxPpa(5.80, 5.00) = 1,16', () => {
    expect(tauxPpa(5.80, 5.00)).toBeCloseTo(1.16, 12);
  });
  // (1,10/1,16 − 1) × 100 = (0,9482758621 − 1) × 100 = −5,172413793103…% (script node).
  // SENS (vérifié à la main, voir calculs.ts) : le résultat mesure la valorisation de la
  // devise de BASE. Spot 1,10 < PPA 1,16 : 1 EUR n'achète que 1,10 USD au lieu des 1,16
  // que la parité justifierait ⇒ l'EUR (base) est SOUS-évalué de 5,17 % — et la devise
  // cotée (USD), symétriquement, est SURévaluée.
  it('surSousEvaluation(1.10, 1.16) ≈ −5,1724 % (base sous-évaluée)', () => {
    expect(surSousEvaluation(1.10, 1.16)).toBeCloseTo(-5.17241379310344, 9);
  });
  // Spot 1,25 > PPA 1,16 : l'EUR achète PLUS de USD que la PPA ⇒ base SURévaluée.
  // (1,25/1,16 − 1) × 100 = (0,09/1,16) × 100 = 7,758620689655…%
  it('surSousEvaluation(1.25, 1.16) ≈ +7,7586 % (base surévaluée)', () => {
    expect(surSousEvaluation(1.25, 1.16)).toBeCloseTo(7.75862068965517, 9);
  });
  // Propriété : spot = PPA ⇒ 0 % (juste valeur).
  it('propriété : surSousEvaluation(x, x) = 0', () => {
    expect(surSousEvaluation(1.16, 1.16)).toBeCloseTo(0, 12);
  });
  // Cohérence : le spot qui annule l'écart est exactement le taux PPA.
  it('cohérence : surSousEvaluation(tauxPpa(a, b), tauxPpa(a, b)) = 0', () => {
    expect(surSousEvaluation(tauxPpa(5.80, 5.00), tauxPpa(5.80, 5.00))).toBeCloseTo(0, 12);
  });
});

describe('pnlCarryTrade — P&L à 1 an d\'un portage de devises', () => {
  // 1 000 000 × [(8 − 2)/100 + 0/100] = 1 000 000 × 0,06 = 60 000 exactement.
  // Le carry pur : on emprunte à 2 %, on place à 8 %, le change ne bouge pas.
  it('pnlCarryTrade(1 000 000, 8, 2, 0) = 60 000', () => {
    expect(pnlCarryTrade(1_000_000, 8, 2, 0)).toBeCloseTo(60_000, 8);
  });
  // 1 000 000 × [0,06 + (−10)/100] = 1 000 000 × (−0,04) = −40 000 : le crash du carry —
  // une dépréciation de 10 % de la devise cible efface 6 points de carry et au-delà.
  it('pnlCarryTrade(1 000 000, 8, 2, −10) = −40 000 (le crash du carry)', () => {
    expect(pnlCarryTrade(1_000_000, 8, 2, -10)).toBeCloseTo(-40_000, 8);
  });
  // Appréciation : 1 000 000 × [0,06 + 0,03] = 90 000 (carry + gain de change).
  it('pnlCarryTrade(1 000 000, 8, 2, +3) = 90 000', () => {
    expect(pnlCarryTrade(1_000_000, 8, 2, 3)).toBeCloseTo(90_000, 8);
  });
  // Propriété : sans différentiel ni variation, P&L nul.
  it('propriété : pnlCarryTrade(n, r, r, 0) = 0', () => {
    expect(pnlCarryTrade(500_000, 4, 4, 0)).toBeCloseTo(0, 8);
  });
});

describe('forwardCommodity — coût de portage linéaire (cash and carry)', () => {
  // 80 × (1 + (4 + 2 − 1)/100 × 1) = 80 × 1,05 = 84 exactement.
  // Financement + stockage renchérissent le terme, le convenience yield le réduit.
  it('forwardCommodity(80, 4, 2, 1, 1) = 84 (contango)', () => {
    expect(forwardCommodity(80, 4, 2, 1, 1)).toBeCloseTo(84, 10);
  });
  // 80 × (1 + (2 + 1 − 6)/100 × 1) = 80 × 0,97 = 77,60 : convenience yield dominant
  // ⇒ F < S, c'est la backwardation (tension sur le physique).
  it('forwardCommodity(80, 2, 1, 6, 1) = 77,60 (backwardation)', () => {
    expect(forwardCommodity(80, 2, 1, 6, 1)).toBeCloseTo(77.60, 10);
  });
  // T fractionnaire : 80 × (1 + 0,05 × 0,5) = 80 × 1,025 = 82 exactement.
  it('forwardCommodity(80, 4, 2, 1, 0.5) = 82 (6 mois)', () => {
    expect(forwardCommodity(80, 4, 2, 1, 0.5)).toBeCloseTo(82, 10);
  });
  // Propriété : tous les coûts à 0 ⇒ F = S.
  it('propriété : forwardCommodity(s, 0, 0, 0, t) = s', () => {
    expect(forwardCommodity(80, 0, 0, 0, 1)).toBeCloseTo(80, 12);
    expect(forwardCommodity(123.45, 0, 0, 0, 3)).toBeCloseTo(123.45, 12);
  });
});

describe('rollYieldAnnualise — rendement de roulement annualisé', () => {
  // SENS (vérifié, voir calculs.ts) : un investisseur LONG roule sa position en vendant le
  // contrat proche et en achetant le lointain. En contango (proche < lointain), il vend
  // 80 et rachète 84 : (80/84 − 1)/1 × 100 = (−4/84) × 100 = −4,761904761905…% — NÉGATIF.
  it('rollYieldAnnualise(80, 84, 1) ≈ −4,7619 % (contango : roll yield négatif)', () => {
    expect(rollYieldAnnualise(80, 84, 1)).toBeCloseTo(-4.76190476190476, 9);
  });
  // En backwardation (proche > lointain), il vend 80 et rachète 77,60 :
  // (80/77,60 − 1) × 100 = (2,40/77,60) × 100 = +3,092783505155…% — POSITIF.
  it('rollYieldAnnualise(80, 77.60, 1) ≈ +3,0928 % (backwardation : roll yield positif)', () => {
    expect(rollYieldAnnualise(80, 77.60, 1)).toBeCloseTo(3.09278350515464, 9);
  });
  // Annualisation linéaire : même écart sur 0,25 an ⇒ taux × 4.
  // (80/84 − 1)/0,25 × 100 = −19,047619047619…%
  it('rollYieldAnnualise(80, 84, 0.25) ≈ −19,0476 % (écart trimestriel annualisé)', () => {
    expect(rollYieldAnnualise(80, 84, 0.25)).toBeCloseTo(-19.0476190476190, 8);
  });
  // Propriété : courbe plate ⇒ roll yield nul.
  it('propriété : rollYieldAnnualise(x, x, t) = 0', () => {
    expect(rollYieldAnnualise(80, 80, 1)).toBeCloseTo(0, 12);
  });
});

describe('baseFutures — base spot − futures', () => {
  // 80 − 84 = −4 : base négative, signature du contango.
  it('baseFutures(80, 84) = −4 (contango)', () => {
    expect(baseFutures(80, 84)).toBeCloseTo(-4, 12);
  });
  // 80 − 77,60 = +2,40 : base positive, signature de la backwardation.
  it('baseFutures(80, 77.60) = +2,40 (backwardation)', () => {
    expect(baseFutures(80, 77.60)).toBeCloseTo(2.40, 12);
  });
  // Propriété : à l'échéance, futures = spot ⇒ base nulle (convergence).
  it('propriété : baseFutures(x, x) = 0 (convergence à l\'échéance)', () => {
    expect(baseFutures(80, 80)).toBeCloseTo(0, 12);
  });
});

describe('coutSpreadFx — coût d\'un aller-retour au spread bid/ask', () => {
  // milieu = (1,0998 + 1,1002)/2 = 1,1000 exactement ; spread = 0,0004 (4 pips).
  // 1 000 000 × 0,0004/1,1000 = 400/1,1 = 363,636363… (= 4000/11, script node).
  // (La valeur indicative « ≈ 363,57 » de la spec correspondait à une division par
  // l'ask 1,1002 ; la formule au MILIEU, recalculée exactement, donne 363,6364.)
  it('coutSpreadFx(1 000 000, 1.0998, 1.1002) = 400/1,1 ≈ 363,6364', () => {
    expect(coutSpreadFx(1_000_000, 1.0998, 1.1002)).toBeCloseTo(4000 / 11, 8);
  });
  // Spread doublé (8 pips) ⇒ coût doublé : 800/1,1 = 727,272727…
  it('coutSpreadFx est linéaire dans le spread : 8 pips ⇒ 727,2727', () => {
    expect(coutSpreadFx(1_000_000, 1.0996, 1.1004)).toBeCloseTo(8000 / 11, 8);
  });
  // Propriété : bid = ask ⇒ coût nul (marché sans friction).
  it('propriété : coutSpreadFx(m, x, x) = 0', () => {
    expect(coutSpreadFx(1_000_000, 1.10, 1.10)).toBeCloseTo(0, 12);
  });
});

describe('variationAnnualiseePct — taux composé annualisé', () => {
  // (121/100)^(1/2) − 1 = 1,1 − 1 = 0,10 ⇒ 10 % exactement (121 = 100 × 1,1²).
  it('variationAnnualiseePct(100, 121, 2) = 10 exactement', () => {
    expect(variationAnnualiseePct(100, 121, 2)).toBeCloseTo(10, 10);
  });
  // (100/80)^(1/4) − 1 = 1,25^0,25 − 1 = 0,0573712634405641 ⇒ 5,7371 % (script node).
  it('variationAnnualiseePct(80, 100, 4) ≈ 5,7371 %', () => {
    expect(variationAnnualiseePct(80, 100, 4)).toBeCloseTo(5.73712634405641, 9);
  });
  // Baisse : (50/100)^(1/1) − 1 = −50 % sur un an.
  it('variationAnnualiseePct(100, 50, 1) = −50', () => {
    expect(variationAnnualiseePct(100, 50, 1)).toBeCloseTo(-50, 10);
  });
  // Propriété : valeur inchangée ⇒ 0 %, quel que soit l'horizon.
  it('propriété : variationAnnualiseePct(x, x, n) = 0', () => {
    expect(variationAnnualiseePct(100, 100, 7)).toBeCloseTo(0, 12);
    expect(variationAnnualiseePct(42.5, 42.5, 0.5)).toBeCloseTo(0, 12);
  });
});
