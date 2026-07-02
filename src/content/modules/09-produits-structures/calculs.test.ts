import { describe, expect, it } from 'vitest';
import { mulberry32 } from '../../../engine/rng';
import { blackScholesCall, blackScholesPut } from '../08-options-volatilite/calculs';
import {
  prixZeroCoupon,
  budgetOptions,
  participationCapitalGaranti,
  couponReverseConvertible,
  margeCommercialeAnnualisee,
  normaleStandard,
  trajectoireLognormale,
  simulationsFinales,
  prixMonteCarloCall,
  payoffAutocall,
  prixAutocallMC,
  payoffDownAndInPut,
  prixDownAndInPutMC,
  trajectoiresCorrelees,
  payoffWorstOf,
  prixCallWorstOfMC,
} from './calculs';

// Valeurs de référence calculées INDÉPENDAMMENT (CDF normale par série de
// Taylor de erf, script séparé — pas par l'implémentation du projet) :
// — ZC(5 %, 5 ans) = 77,880078 ; budget sans marge = 22,119922.
// — Call ATM (100, 100, 5 %, 20 %, 5 ans) = 29,138620 → participation 0,724809
//   avec 1 % de marge.
// — Put canonique (100, 100, 5 %, 20 %, 1 an) = 5,573526 ; call = 10,450584.
// — Coupon RC prime nulle, r = 5 %, T = 1 : 100·(e^{0,05} − 1) = 5,127110.
// — Coupon RC prime canonique : 10,986396 = call·e^{rT} (parité, voir test).
// Les tests Monte-Carlo sont DÉTERMINISTES (mulberry32 seedé) : les tolérances
// indiquées correspondent à l'erreur statistique attendue (≈ 3 écarts-types de
// l'estimateur) et l'écart réel observé pour la graine choisie est bien dedans.

describe('briques du structureur : zéro-coupon et budget d’options', () => {
  it('prixZeroCoupon(5, 5) = 100·e^{−0,25} = 77,880078', () => {
    expect(prixZeroCoupon(5, 5)).toBeCloseTo(77.880078, 5);
  });

  it('prixZeroCoupon(5, 1) = 95,122942 (cohérent avec dfContinu du m8 × 100)', () => {
    expect(prixZeroCoupon(5, 1)).toBeCloseTo(95.122942, 5);
  });

  it('budgetOptions : 100 − ZC − marge (r = 5 %, T = 5, marge 1 %) = 21,119922', () => {
    expect(budgetOptions(prixZeroCoupon(5, 5), 1)).toBeCloseTo(21.119922, 5);
    expect(budgetOptions(prixZeroCoupon(5, 5))).toBeCloseTo(22.119922, 5); // marge nulle par défaut
  });

  it('taux plus bas ⇒ ZC plus cher ⇒ budget plus maigre (le drame des taux bas)', () => {
    expect(prixZeroCoupon(2, 5)).toBeCloseTo(90.483742, 5);
    expect(budgetOptions(prixZeroCoupon(2, 5), 1)).toBeCloseTo(8.516258, 5);
  });
});

describe('participation d’un capital garanti', () => {
  it('chiffres ronds vérifiés à la main : budget 22,5 / call 15 = 150 %', () => {
    // 22,5 % de nominal disponibles, le call ATM coûte 15 % : on en achète 1,5.
    expect(participationCapitalGaranti(22.5, 15)).toBeCloseTo(1.5, 10);
    expect(participationCapitalGaranti(20, 25)).toBeCloseTo(0.8, 10); // budget < prix du call ⇒ participation < 100 %
  });

  it('composition complète : r = 5 %, T = 5, marge 1 %, call ATM 5 ans à 20 % de vol ⇒ 72,48 %', () => {
    const budget = budgetOptions(prixZeroCoupon(5, 5), 1);
    const call = blackScholesCall(100, 100, 5, 20, 5); // 29,138620 % du nominal (S = K = 100)
    expect(call).toBeCloseTo(29.13862, 4);
    expect(participationCapitalGaranti(budget, call)).toBeCloseTo(0.724809, 5);
  });
});

describe('coupon d’un reverse convertible', () => {
  it('prime nulle ⇒ coupon = taux sans risque capitalisé : 100·(e^{0,05} − 1) = 5,127110', () => {
    expect(couponReverseConvertible(0, 5, 1)).toBeCloseTo(5.12711, 5);
  });

  it('prime du put canonique (5,573526) ⇒ coupon 10,986396 = call·e^{rT} (parité)', () => {
    // 100 − ZC + P = S − K·e^{−rT} + P = C quand S = K = 100 : le disponible
    // du structureur est EXACTEMENT le prix du call — parité call-put du m8.
    expect(couponReverseConvertible(5.573526, 5, 1)).toBeCloseTo(10.986396, 4);
    expect(couponReverseConvertible(5.573526, 5, 1)).toBeCloseTo(blackScholesCall(100, 100, 5, 20, 1) * Math.exp(0.05), 4);
  });

  it('coupon ANNUEL équivalent : sur 2 ans, le disponible est divisé par 2', () => {
    // prime nulle, r = 5 %, T = 2 : 100·(e^{0,10} − 1)/2 = 5,258546 par an.
    expect(couponReverseConvertible(0, 5, 2)).toBeCloseTo(5.258546, 5);
  });
});

describe('marge commerciale', () => {
  it('margeCommercialeAnnualisee : 5 % sur 5 ans = 1 %/an ; 2 % sur 6 mois = 4 %/an', () => {
    expect(margeCommercialeAnnualisee(5, 5)).toBeCloseTo(1, 10);
    expect(margeCommercialeAnnualisee(2, 0.5)).toBeCloseTo(4, 10);
  });
});

describe('générateur normal (Box-Muller sur mulberry32)', () => {
  it('moments empiriques sur 50 000 tirages : moyenne ≈ 0, écart-type ≈ 1', () => {
    const rng = mulberry32(12345);
    const n = 50000;
    let somme = 0;
    let sommeCarres = 0;
    for (let i = 0; i < n; i++) {
      const z = normaleStandard(rng);
      somme += z;
      sommeCarres += z * z;
    }
    const moyenne = somme / n;
    const ecartType = Math.sqrt(sommeCarres / n - moyenne * moyenne);
    expect(moyenne).toBeCloseTo(0, 1); // erreur-type 1/√50000 ≈ 0,0045
    expect(ecartType).toBeCloseTo(1, 1);
  });

  it('déterminisme : même graine ⇒ mêmes tirages', () => {
    const a = normaleStandard(mulberry32(7));
    const b = normaleStandard(mulberry32(7));
    expect(a).toBe(b);
  });
});

describe('trajectoire lognormale (schéma exact, drift risque-neutre)', () => {
  it('longueur nbPas + 1, part de s0, reste strictement positive', () => {
    const t = trajectoireLognormale(42, 100, 5, 20, 0.25, 8);
    expect(t).toHaveLength(9);
    expect(t[0]).toBe(100);
    for (const s of t) expect(s).toBeGreaterThan(0);
  });

  it('même graine ⇒ même trajectoire ; graine différente ⇒ trajectoire différente', () => {
    expect(trajectoireLognormale(42, 100, 5, 20, 0.25, 4)).toEqual(trajectoireLognormale(42, 100, 5, 20, 0.25, 4));
    expect(trajectoireLognormale(43, 100, 5, 20, 0.25, 4)).not.toEqual(trajectoireLognormale(42, 100, 5, 20, 0.25, 4));
  });

  it('vol nulle ⇒ croissance déterministe au taux sans risque : S_T = 100·e^{0,05} = 105,127110', () => {
    const t = trajectoireLognormale(42, 100, 5, 0, 0.25, 4);
    expect(t[4]).toBeCloseTo(105.12711, 5);
    expect(t[2]).toBeCloseTo(100 * Math.exp(0.05 * 0.5), 8);
  });

  it('simulationsFinales : n prix, martingale risque-neutre (moyenne ≈ S·e^{rT})', () => {
    const finals = simulationsFinales(42, 50000, 100, 5, 20, 1);
    expect(finals).toHaveLength(50000);
    const moyenne = finals.reduce((a, b) => a + b, 0) / finals.length;
    // E[S_T] = 100·e^{0,05} = 105,127 ; erreur-type ≈ 21/√50000 ≈ 0,09.
    expect(moyenne).toBeCloseTo(105.12711, 0);
  });
});

describe('Monte-Carlo vs Black-Scholes (test de convergence)', () => {
  it('prixMonteCarloCall (n = 100 000) retrouve le call canonique 10,450584 à 0,5 % près', () => {
    // Erreur-type de l'estimateur ≈ 0,047 ; la tolérance 0,5 % (± 0,052)
    // correspond à ≈ 1,1 écart-type — vérifiée pour la graine 42 (déterministe).
    const mc = prixMonteCarloCall(42, 100000, 100, 100, 5, 20, 1);
    const bs = blackScholesCall(100, 100, 5, 20, 1);
    expect(Math.abs(mc - bs) / bs).toBeLessThan(0.005);
  });

  it('cohérence sur un second jeu de paramètres (Hull 42/40, tolérance 1 %)', () => {
    const mc = prixMonteCarloCall(123, 100000, 42, 40, 10, 20, 0.5);
    const bs = blackScholesCall(42, 40, 10, 20, 0.5);
    expect(Math.abs(mc - bs) / bs).toBeLessThan(0.01);
  });
});

describe('autocall (athena simple)', () => {
  const params = {
    barriereRappelPct: 100,
    couponPct: 6,
    barriereProtectionPct: 60,
    rPct: 3,
    dtAnnees: 1,
    nbPeriodes: 4,
  };

  it('rappel dès la première observation : 100 + 6 versés en t = 1, actualisés e^{−0,03}', () => {
    const res = payoffAutocall([105, 0, 0, 0], 100, params);
    expect(res.periodeRappel).toBe(1);
    expect(res.flux).toBe(106);
    expect(res.dateFlux).toBe(1);
    expect(res.fluxActualise).toBeCloseTo(106 * Math.exp(-0.03), 8);
  });

  it('rappel en période 3 avec effet mémoire : 100 + 3 × 6 = 118 en t = 3', () => {
    const res = payoffAutocall([95, 99.9, 101, 0], 100, params);
    expect(res.periodeRappel).toBe(3);
    expect(res.flux).toBe(118);
    expect(res.fluxActualise).toBeCloseTo(118 * Math.exp(-0.09), 8);
  });

  it('jamais rappelé, protection intacte à maturité (60 ≤ S_N < 100) : capital seul, 100', () => {
    const res = payoffAutocall([90, 85, 80, 70], 100, params);
    expect(res.periodeRappel).toBeNull();
    expect(res.flux).toBe(100);
    expect(res.dateFlux).toBe(4);
  });

  it('barrière de protection enfoncée à maturité : remboursement dégradé S_N/S_0 × 100', () => {
    const res = payoffAutocall([90, 80, 70, 50], 100, params);
    expect(res.periodeRappel).toBeNull();
    expect(res.flux).toBeCloseTo(50, 10);
    expect(res.fluxActualise).toBeCloseTo(50 * Math.exp(-0.12), 8);
  });

  it('la barrière de protection est observée À MATURITÉ seulement (pas américaine)', () => {
    // Le sous-jacent enfonce 60 en cours de vie puis remonte : 100 quand même.
    const res = payoffAutocall([55, 50, 58, 85], 100, params);
    expect(res.flux).toBe(100);
  });

  it('limite analytique vol = 0, r > 0 : rappel certain en période 1, prix = 106·e^{−0,03} = 102,867227', () => {
    expect(prixAutocallMC(42, 10, 100, 0, params)).toBeCloseTo(102.867227, 5);
  });

  it('sensibilités MC (même graine, mêmes trajectoires) : protection plus basse ⇒ prix plus élevé ; vol plus haute ⇒ prix plus bas', () => {
    const prix60 = prixAutocallMC(42, 15000, 100, 25, params);
    const prix50 = prixAutocallMC(42, 15000, 100, 25, { ...params, barriereProtectionPct: 50 });
    expect(prix50).toBeGreaterThan(prix60);
    const prixVol35 = prixAutocallMC(42, 15000, 100, 35, params);
    expect(prixVol35).toBeLessThan(prix60); // l'acheteur d'autocall est vendeur de vol
    expect(prix60).toBeGreaterThan(80);
    expect(prix60).toBeLessThan(106);
  });
});

describe('options à barrière : down-and-in put', () => {
  it('payoffDownAndInPut : activé si le minimum a touché la barrière', () => {
    expect(payoffDownAndInPut(80, 70, 100, 75)).toBe(20); // min 70 ≤ 75 : le put s'active
    expect(payoffDownAndInPut(80, 78, 100, 75)).toBe(0); // jamais touché : rien, là où le put vanille payait 20
    expect(payoffDownAndInPut(110, 70, 100, 75)).toBe(0); // activé mais finit hors de la monnaie
  });

  it('DIP ≤ put vanille : prix MC avec barrière 60 strictement sous le put Black-Scholes', () => {
    const dip = prixDownAndInPutMC(42, 20000, 100, 100, 60, 5, 20, 1, 12);
    expect(dip).toBeGreaterThan(0);
    expect(dip).toBeLessThan(blackScholesPut(100, 100, 5, 20, 1));
  });

  it('barrière = strike ⇒ DIP = put vanille (payoff > 0 ⇒ min ≤ S_T < K = barrière : toujours activé)', () => {
    // Égalité EXACTE des payoffs trajectoire par trajectoire, donc l'écart au
    // put Black-Scholes est la seule erreur Monte-Carlo (≈ 3 erreurs-types).
    const dip = prixDownAndInPutMC(42, 40000, 100, 100, 100, 5, 20, 1, 12);
    expect(dip).toBeCloseTo(blackScholesPut(100, 100, 5, 20, 1), 0);
    expect(Math.abs(dip - blackScholesPut(100, 100, 5, 20, 1))).toBeLessThan(0.2);
  });

  it('plus la barrière est basse, moins le DIP vaut cher (même graine)', () => {
    const dip70 = prixDownAndInPutMC(42, 20000, 100, 100, 70, 5, 20, 1, 12);
    const dip55 = prixDownAndInPutMC(42, 20000, 100, 100, 55, 5, 20, 1, 12);
    expect(dip55).toBeLessThan(dip70);
  });
});

describe('worst-of multi-sous-jacents (corrélation)', () => {
  it('trajectoiresCorrelees : ρ = 1, mêmes paramètres ⇒ trajectoires identiques (Cholesky : z2 = z1)', () => {
    const { t1, t2 } = trajectoiresCorrelees(42, 1, 100, 100, 5, 20, 20, 0.25, 8);
    expect(t1).toHaveLength(9);
    for (let i = 0; i < t1.length; i++) expect(t2[i]).toBeCloseTo(t1[i], 10);
  });

  it('la première trajectoire ne dépend pas de ρ (z1 inchangé par Cholesky)', () => {
    const a = trajectoiresCorrelees(42, 0.9, 100, 100, 5, 20, 20, 0.25, 4);
    const b = trajectoiresCorrelees(42, 0.2, 100, 100, 5, 20, 20, 0.25, 4);
    expect(a.t1).toEqual(b.t1);
    expect(a.t2).not.toEqual(b.t2);
  });

  it('payoffWorstOf : call sur la PIRE performance, en % du nominal', () => {
    expect(payoffWorstOf(120, 110, 100, 100, 100)).toBeCloseTo(10, 10); // le pire fait +10 %
    expect(payoffWorstOf(120, 95, 100, 100, 100)).toBe(0); // le pire fait −5 % : rien
    expect(payoffWorstOf(60, 220, 50, 200, 100)).toBeCloseTo(10, 10); // perfs 1,20 et 1,10 : niveaux initiaux différents
  });

  it('ρ = 1, actifs jumeaux ⇒ le worst-of EST le mono sous-jacent : prix ≈ call BS canonique', () => {
    const prix = prixCallWorstOfMC(42, 40000, 1, 100, 100, 5, 20, 20, 100, 1);
    // Erreur-type ≈ 15/√40000 ≈ 0,075 ; tolérance ± 0,25 ≈ 3,3 erreurs-types.
    expect(Math.abs(prix - blackScholesCall(100, 100, 5, 20, 1))).toBeLessThan(0.25);
  });

  it('le prix du worst-of DÉCROÎT quand la corrélation baisse (le pire devient pire)', () => {
    const prixCorrHaute = prixCallWorstOfMC(42, 30000, 0.9, 100, 100, 5, 20, 20, 100, 1);
    const prixCorrBasse = prixCallWorstOfMC(42, 30000, 0.3, 100, 100, 5, 20, 20, 100, 1);
    expect(prixCorrBasse).toBeLessThan(prixCorrHaute);
  });
});
