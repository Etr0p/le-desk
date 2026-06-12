import { describe, expect, it } from 'vitest';
import {
  payoffCall,
  payoffPut,
  pnlOption,
  pointMortCall,
  pointMortPut,
  pointsMortsStraddle,
  dfContinu,
  putDepuisParite,
  probaRisqueNeutre,
  valeurBinomiale,
  densiteNormale,
  d1BlackScholes,
  d2BlackScholes,
  blackScholesCall,
  blackScholesPut,
  deltaCall,
  deltaPut,
  gammaOption,
  vegaOption,
  actionsDeltaHedge,
  volAnnualiseePct,
  volImplicitePct,
} from './calculs';

// Valeurs de référence vérifiées par intégration numérique INDÉPENDANTE de la
// CDF normale (Simpson, 200 000 pas) — pas par l'implémentation elle-même.
// Exemple canonique : S = 100, K = 100, r = 5 %, σ = 20 %, T = 1.
// Exemple de Hull : S = 42, K = 40, r = 10 %, σ = 20 %, T = 0,5.

describe('payoffs et points morts', () => {
  it('payoffCall : max(S_T − K, 0)', () => {
    expect(payoffCall(110, 100)).toBe(10);
    expect(payoffCall(90, 100)).toBe(0);
    expect(payoffCall(100, 100)).toBe(0);
  });

  it('payoffPut : max(K − S_T, 0)', () => {
    expect(payoffPut(85, 100)).toBe(15);
    expect(payoffPut(110, 100)).toBe(0);
  });

  it("pnlOption : l'asymétrie acheteur/vendeur", () => {
    expect(pnlOption(10, 4, 1)).toBe(6); // acheteur exercé au-delà du point mort
    expect(pnlOption(0, 4, 1)).toBe(-4); // l'acheteur perd AU PLUS la prime
    expect(pnlOption(0, 4, -1)).toBe(4); // le vendeur gagne AU PLUS la prime
    expect(pnlOption(25, 4, -1)).toBe(-21); // ... et peut perdre bien davantage
  });

  it('points morts : call K + prime, put K − prime, straddle K ± coût', () => {
    expect(pointMortCall(100, 4)).toBe(104);
    expect(pointMortPut(100, 6)).toBe(94);
    expect(pointsMortsStraddle(100, 10)).toEqual({ bas: 90, haut: 110 });
  });
});

describe('parité call-put (composition continue)', () => {
  it('dfContinu(5, 1) = e^{−0,05} = 0,951229', () => {
    expect(dfContinu(5, 1)).toBeCloseTo(0.95122942, 8);
  });

  it('putDepuisParite retrouve le put canonique : 5,573526', () => {
    expect(putDepuisParite(10.450584, 100, 100, 5, 1)).toBeCloseTo(5.573526, 5);
  });

  it('cohérence interne : P (parité depuis le call BS) = P (formule BS)', () => {
    const call = blackScholesCall(42, 40, 10, 20, 0.5);
    expect(putDepuisParite(call, 42, 40, 10, 0.5)).toBeCloseTo(blackScholesPut(42, 40, 10, 20, 0.5), 10);
  });
});

describe('arbre binomial à une période (capitalisation linéaire)', () => {
  it('probaRisqueNeutre(1.2, 0.8, 4, 1) = 0,6 exactement', () => {
    expect(probaRisqueNeutre(1.2, 0.8, 4, 1)).toBeCloseTo(0.6, 12);
  });

  it('call K = 100 sur S = 100, u = 1.2, d = 0.8, r = 4 % : 11,538462', () => {
    expect(valeurBinomiale(20, 0, 1.2, 0.8, 4, 1)).toBeCloseTo(11.538462, 5);
  });

  it("le sous-jacent actualisé est une martingale sous q (l'arbre est « équitable »)", () => {
    // q·u·S + (1−q)·d·S, actualisé, redonne S : c'est la définition de q.
    expect(valeurBinomiale(120, 80, 1.2, 0.8, 4, 1)).toBeCloseTo(100, 10);
  });
});

describe('Black-Scholes — exemple canonique (100, 100, 5, 20, 1)', () => {
  it('d1 = 0,35 et d2 = 0,15 exactement (ln(1) = 0)', () => {
    expect(d1BlackScholes(100, 100, 5, 20, 1)).toBeCloseTo(0.35, 10);
    expect(d2BlackScholes(100, 100, 5, 20, 1)).toBeCloseTo(0.15, 10);
  });

  it('call = 10,450584', () => {
    expect(blackScholesCall(100, 100, 5, 20, 1)).toBeCloseTo(10.450584, 4);
  });

  it('put = 5,573526', () => {
    expect(blackScholesPut(100, 100, 5, 20, 1)).toBeCloseTo(5.573526, 4);
  });

  it('parité vérifiée : C − P = S − K·e^{−rT} = 4,877058', () => {
    const ecart = blackScholesCall(100, 100, 5, 20, 1) - blackScholesPut(100, 100, 5, 20, 1);
    expect(ecart).toBeCloseTo(4.877058, 5);
  });
});

describe('Black-Scholes — exemple de Hull (42, 40, 10, 20, 0.5)', () => {
  it('d1 = 0,769263, d2 = 0,627841', () => {
    expect(d1BlackScholes(42, 40, 10, 20, 0.5)).toBeCloseTo(0.769263, 5);
    expect(d2BlackScholes(42, 40, 10, 20, 0.5)).toBeCloseTo(0.627841, 5);
  });

  it('call = 4,759422 et put = 0,808599', () => {
    expect(blackScholesCall(42, 40, 10, 20, 0.5)).toBeCloseTo(4.759422, 4);
    expect(blackScholesPut(42, 40, 10, 20, 0.5)).toBeCloseTo(0.808599, 4);
  });
});

describe('grecques', () => {
  it('deltaCall canonique = 0,636831 ; deltaPut = −0,363169', () => {
    expect(deltaCall(100, 100, 5, 20, 1)).toBeCloseTo(0.636831, 5);
    expect(deltaPut(100, 100, 5, 20, 1)).toBeCloseTo(-0.363169, 5);
  });

  it('relation exacte deltaCall − deltaPut = 1', () => {
    expect(deltaCall(42, 40, 10, 20, 0.5) - deltaPut(42, 40, 10, 20, 0.5)).toBeCloseTo(1, 12);
  });

  it('les bornes du delta : ITM profond → 1, OTM profond → 0', () => {
    expect(deltaCall(300, 100, 5, 20, 1)).toBeCloseTo(1, 3);
    expect(deltaCall(30, 100, 5, 20, 1)).toBeCloseTo(0, 3);
  });

  it('gamma canonique = 0,018762 (φ(0,35) = 0,375240)', () => {
    expect(densiteNormale(0.35)).toBeCloseTo(0.37524035, 7);
    expect(gammaOption(100, 100, 5, 20, 1)).toBeCloseTo(0.018762, 6);
  });

  it('vega canonique = 0,375240 par point de volatilité', () => {
    expect(vegaOption(100, 100, 5, 20, 1)).toBeCloseTo(0.37524, 5);
  });

  it('vega cohérent avec une vraie bosse de +1 pt de vol (différence finie)', () => {
    const bosse = blackScholesCall(100, 100, 5, 21, 1) - blackScholesCall(100, 100, 5, 20, 1);
    expect(bosse).toBeCloseTo(vegaOption(100, 100, 5, 20.5, 1), 4);
  });

  it('actionsDeltaHedge(0.636831, 10, 100) = 637 (arrondi standard)', () => {
    expect(actionsDeltaHedge(0.636831, 10, 100)).toBe(637);
    expect(actionsDeltaHedge(-0.363169, 10, 100)).toBe(363); // un put : |delta|
  });
});

describe('volatilité', () => {
  it('volAnnualiseePct(1.2) = 1,2 × √252 = 19,0494 %', () => {
    expect(volAnnualiseePct(1.2)).toBeCloseTo(19.049409, 5);
  });

  it('volImplicitePct inverse exactement le prix canonique : 20 %', () => {
    expect(volImplicitePct(10.450584, 100, 100, 5, 1)).toBeCloseTo(20, 3);
  });

  it('volImplicitePct retrouve une vol cible quelconque (aller-retour)', () => {
    const prime = blackScholesCall(95, 100, 3, 27.5, 0.75);
    expect(volImplicitePct(prime, 95, 100, 3, 0.75)).toBeCloseTo(27.5, 4);
  });
});
