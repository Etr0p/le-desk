import { describe, expect, it } from 'vitest';
import {
  gordon, ddmDeuxEtapes, valeurTerminaleGordon, dcfSimple,
  per, bpa, evSurEbitda, rendementDividende, tauxDistribution,
  prixTheoriqueExDividende, ajustementSplit, valeurDroitSouscription,
  indiceCapiPonderee, poidsDansIndice,
  pnlVenteADecouvert, coutEmprunTitres,
} from './calculs';
import { perpetuite, vaAnnuite } from '../02-methodes-quantitatives/calculs';

// Toutes les valeurs de référence ci-dessous ont été calculées à la main puis
// recoupées par un script node indépendant AVANT l'implémentation (TDD strict).

describe('Gordon-Shapiro — valeurs de référence', () => {
  // P0 = D1/(r−g) = 5/((8−3)/100) = 5/0,05 = 100 exactement
  it('gordon(5, 8, 3) = 100', () => {
    expect(gordon(5, 8, 3)).toBeCloseTo(100, 9);
  });
  it('gordon lance une erreur explicite si r = g', () => {
    expect(() => gordon(5, 5, 5)).toThrow(/r > g/);
  });
  it('gordon lance une erreur explicite si r < g', () => {
    expect(() => gordon(5, 4, 6)).toThrow(/r > g/);
  });
  // Propriété : à g = 0, Gordon dégénère en perpétuité simple D1/r (module 2).
  it('propriété : gordon(d1, r, 0) = perpetuite(d1, r) du module 2', () => {
    expect(gordon(7, 6, 0)).toBeCloseTo(perpetuite(7, 6), 9);
    expect(gordon(3.2, 9.5, 0)).toBeCloseTo(perpetuite(3.2, 9.5), 9);
  });
});

describe('valeur terminale Gordon — valeurs de référence', () => {
  // VT_n = flux_n × (1+g)/(r−g) = 100 × 1,02/0,06 = 102/0,06 = 1700 exactement
  it('valeurTerminaleGordon(100, 2, 8) = 1700', () => {
    expect(valeurTerminaleGordon(100, 2, 8)).toBeCloseTo(1700, 9);
  });
  // Cohérence : VT_n = Gordon appliqué au flux suivant flux_n × (1+g)
  it('cohérence : valeurTerminaleGordon = gordon du flux n+1', () => {
    expect(valeurTerminaleGordon(2.662, 2, 8)).toBeCloseTo(gordon(2.662 * 1.02, 8, 2), 9);
  });
  it('valeurTerminaleGordon lance une erreur si r ≤ g', () => {
    expect(() => valeurTerminaleGordon(100, 8, 8)).toThrow(/r > g/);
  });
});

describe('DDM deux étapes — valeurs de référence', () => {
  // ddmDeuxEtapes(2, 10, 3, 2, 8), étape par étape (script node, sans arrondi intermédiaire) :
  // D1 = 2×1,10 = 2,20 ; D2 = 2,42 ; D3 = 2,662
  // VA(D1) = 2,20/1,08  = 2,037037037
  // VA(D2) = 2,42/1,08² = 2,074759945
  // VA(D3) = 2,662/1,08³ = 2,113181426   → somme des dividendes actualisés = 6,224978408
  // D4 = 2,662×1,02 = 2,71524 ; VT3 = 2,71524/0,06 = 45,254
  // VA(VT3) = 45,254/1,08³ = 35,924084235
  // Total = 6,224978408 + 35,924084235 = 42,149062643
  // (l'énoncé indicatif « ≈ 42,1501 » provenait d'arrondis intermédiaires : la valeur exacte est 42,1491)
  it('ddmDeuxEtapes(2, 10, 3, 2, 8) ≈ 42,149063', () => {
    expect(ddmDeuxEtapes(2, 10, 3, 2, 8)).toBeCloseTo(42.149063, 4);
  });
  // Recoupement par construction : VA des 3 dividendes + VA de la VT, posées séparément.
  it('décomposition : VA des dividendes + VA de la valeur terminale', () => {
    const vaDividendes = 2.2 / 1.08 + 2.42 / 1.08 ** 2 + 2.662 / 1.08 ** 3;
    const vaVT = valeurTerminaleGordon(2.662, 2, 8) / 1.08 ** 3;
    expect(vaDividendes).toBeCloseTo(6.224978, 5);
    expect(vaVT).toBeCloseTo(35.924084, 5);
    expect(ddmDeuxEtapes(2, 10, 3, 2, 8)).toBeCloseTo(vaDividendes + vaVT, 9);
  });
  // Propriété : si g1 = g2 = g, le modèle deux étapes se recolle exactement sur Gordon.
  it('propriété : g1 = g2 ⇒ ddmDeuxEtapes = gordon(D1, r, g)', () => {
    expect(ddmDeuxEtapes(2, 3, 5, 3, 8)).toBeCloseTo(gordon(2 * 1.03, 8, 3), 9);
  });
  it('ddmDeuxEtapes lance une erreur si r ≤ g2 (phase terminale divergente)', () => {
    expect(() => ddmDeuxEtapes(2, 10, 3, 8, 8)).toThrow(/r > g/);
  });
});

describe('DCF simple — valeurs de référence', () => {
  // dcfSimple([100, 110, 121], 10, 1500), étape par étape (script node) :
  // VA(FCF1) = 100/1,1  = 90,909091
  // VA(FCF2) = 110/1,1² = 90,909091
  // VA(FCF3) = 121/1,1³ = 90,909091   (flux choisis croissant à 10 % : VA identiques)
  // VA(VT)   = 1500/1,331 = 1126,972201
  // Total = 272,727273 + 1126,972201 = 1399,699474
  it('dcfSimple([100, 110, 121], 10, 1500) ≈ 1399,70', () => {
    expect(dcfSimple([100, 110, 121], 10, 1500)).toBeCloseTo(1399.699474, 4);
  });
  it('dcfSimple sans valeur terminale = somme des FCF actualisés', () => {
    expect(dcfSimple([100, 110, 121], 10, 0)).toBeCloseTo(272.727273, 4);
  });
  // Propriété : FCF constants sans VT = annuité du module 2.
  it('propriété : dcfSimple(flux constants, r, 0) = vaAnnuite du module 2', () => {
    expect(dcfSimple([100, 100, 100], 5, 0)).toBeCloseTo(vaAnnuite(100, 5, 3), 9);
  });
});

describe('multiples et ratios — valeurs de référence', () => {
  // PER = prix/BPA = 120/8 = 15
  it('per(120, 8) = 15', () => {
    expect(per(120, 8)).toBeCloseTo(15, 9);
  });
  // BPA = bénéfice net / nombre d'actions = 8 000 000/1 000 000 = 8 €
  it('bpa(8 000 000, 1 000 000) = 8', () => {
    expect(bpa(8_000_000, 1_000_000)).toBeCloseTo(8, 9);
  });
  // Propriété : per × bpa = prix (les deux définitions se recollent).
  it('propriété : per(prix, bpa) × bpa = prix', () => {
    const prix = 87.3, bpaVal = 6.21;
    expect(per(prix, bpaVal) * bpaVal).toBeCloseTo(prix, 9);
  });
  // EV/EBITDA = (capi + dette nette)/EBITDA = (900 + 300)/200 = 6
  it('evSurEbitda(900, 300, 200) = 6', () => {
    expect(evSurEbitda(900, 300, 200)).toBeCloseTo(6, 9);
  });
  // Trésorerie nette (dette nette négative) : EV = 900 − 100 = 800 → 800/200 = 4
  it('evSurEbitda avec trésorerie nette : dette nette négative', () => {
    expect(evSurEbitda(900, -100, 200)).toBeCloseTo(4, 9);
  });
  // Rendement du dividende = 4,50/90 = 5 %
  it('rendementDividende(4,50, 90) = 5 %', () => {
    expect(rendementDividende(4.5, 90)).toBeCloseTo(5, 9);
  });
  // Taux de distribution (payout) = 4,50/9 = 50 %
  it('tauxDistribution(4,50, 9) = 50 %', () => {
    expect(tauxDistribution(4.5, 9)).toBeCloseTo(50, 9);
  });
  // Propriété : rendement = payout / PER (4,50/90 = (4,50/9)/(90/9)).
  it('propriété : rendementDividende = tauxDistribution / per', () => {
    expect(rendementDividende(4.5, 90)).toBeCloseTo(tauxDistribution(4.5, 9) / per(90, 9), 9);
  });
});

describe('opérations sur titres — valeurs de référence', () => {
  // Au détachement, le prix baisse mécaniquement du dividende : 100 − 2,50 = 97,50
  it('prixTheoriqueExDividende(100, 2,5) = 97,50', () => {
    expect(prixTheoriqueExDividende(100, 2.5)).toBeCloseTo(97.5, 9);
  });
  // Split 5:1 : 750/5 = 150 (la capitalisation est inchangée : 5× plus de titres)
  it('ajustementSplit(750, 5) = 150', () => {
    expect(ajustementSplit(750, 5)).toBeCloseTo(150, 9);
  });
  // DPS : (cote − émission)/(droits + 1) = (50 − 40)/(4 + 1) = 10/5 = 2 exactement.
  // Vérification d'équilibre : 4 anciennes à 50 + 1 neuve à 40 = 240 pour 5 titres
  // → cours théorique ex-droit 48 ; le droit vaut 50 − 48 = 2. Les deux routes concordent.
  it('valeurDroitSouscription(50, 40, 4) = 2', () => {
    expect(valeurDroitSouscription(50, 40, 4)).toBeCloseTo(2, 9);
  });
});

describe('indices pondérés par la capitalisation — valeurs de référence', () => {
  // Trois titres conçus pour des capis flottantes rondes 60/30/10 :
  // A : 10 € × 10 titres × 60 % = 60 ; B : 20 € × 5 × 30 % = 30 ; C : 50 € × 2 × 10 % = 10.
  const constituants = [
    { prix: 10, nbTitres: 10, flottantPct: 60 },
    { prix: 20, nbTitres: 5, flottantPct: 30 },
    { prix: 50, nbTitres: 2, flottantPct: 10 },
  ];
  it('indiceCapiPonderee : capi flottante totale = 60 + 30 + 10 = 100', () => {
    expect(indiceCapiPonderee(constituants)).toBeCloseTo(100, 9);
  });
  it('indiceCapiPonderee à flottant 100 % = capi boursière pleine', () => {
    expect(indiceCapiPonderee([
      { prix: 10, nbTitres: 100, flottantPct: 100 },
      { prix: 50, nbTitres: 4, flottantPct: 100 },
    ])).toBeCloseTo(1200, 9);
  });
  it('poidsDansIndice : poids ronds 60 % / 30 % / 10 %', () => {
    const poids = poidsDansIndice(constituants);
    expect(poids[0]).toBeCloseTo(60, 9);
    expect(poids[1]).toBeCloseTo(30, 9);
    expect(poids[2]).toBeCloseTo(10, 9);
  });
  // Propriété : les poids somment à 100 % quelles que soient les données.
  it('propriété : les poids somment à 100 %', () => {
    const quelconques = [
      { prix: 123.4, nbTitres: 7_000_000, flottantPct: 83 },
      { prix: 41.7, nbTitres: 22_500_000, flottantPct: 64 },
      { prix: 880.05, nbTitres: 950_000, flottantPct: 41 },
      { prix: 9.99, nbTitres: 150_000_000, flottantPct: 95 },
    ];
    const somme = poidsDansIndice(quelconques).reduce((a, b) => a + b, 0);
    expect(somme).toBeCloseTo(100, 9);
  });
});

describe('vente à découvert — valeurs de référence', () => {
  // Frais d'emprunt = notionnel × taux × jours/360 = 100 000 × 0,02 × 90/360 = 500
  it('coutEmprunTitres(100 000, 2, 90) = 500', () => {
    expect(coutEmprunTitres(100_000, 2, 90)).toBeCloseTo(500, 9);
  });
  // P&L brut = (100 − 90) × 1000 = 10 000 ; frais sur notionnel vendu 100 × 1000 = 100 000
  // → 100 000 × 0,02 × 90/360 = 500 ; P&L net = 10 000 − 500 = 9 500
  it('pnlVenteADecouvert(100, 90, 1000, 2, 90) = 9 500', () => {
    expect(pnlVenteADecouvert(100, 90, 1000, 2, 90)).toBeCloseTo(9500, 9);
  });
  // Short perdant : rachat au-dessus de la vente → P&L brut −10 000, frais toujours dus → −10 500
  it('pnlVenteADecouvert perdant : (100, 110, 1000, 2, 90) = −10 500', () => {
    expect(pnlVenteADecouvert(100, 110, 1000, 2, 90)).toBeCloseTo(-10_500, 9);
  });
  // Cohérence : le P&L net = brut − coutEmprunTitres sur le notionnel vendu.
  it('cohérence : pnl = brut − coutEmprunTitres(prixVente × quantité)', () => {
    const brut = (87 - 80.5) * 320;
    expect(pnlVenteADecouvert(87, 80.5, 320, 1.5, 45))
      .toBeCloseTo(brut - coutEmprunTitres(87 * 320, 1.5, 45), 9);
  });
});
