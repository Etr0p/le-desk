import { describe, expect, it } from 'vitest';
import {
  spreadAbsolu, spreadPb, milieuFourchette, coutTraverseeSpread,
  executionCarnet, slippage, pnlMarketMaker, commissionTotale,
} from './calculs';

describe('fourchette bid/ask — valeurs de référence', () => {
  // 100,05 − 99,95 = 0,10 €
  it('spreadAbsolu = ask − bid', () => {
    expect(spreadAbsolu(99.95, 100.05)).toBeCloseTo(0.10, 9);
  });
  // (99,95 + 100,05) / 2 = 200,00 / 2 = 100,00
  it('milieuFourchette = (bid + ask) / 2', () => {
    expect(milieuFourchette(99.95, 100.05)).toBeCloseTo(100.0, 9);
  });
  // 0,10 / 100,00 × 10 000 = 0,001 × 10 000 = 10 pb exactement
  it('spreadPb : fourchette de 10 centimes autour de 100 = 10 pb', () => {
    expect(spreadPb(99.95, 100.05)).toBeCloseTo(10, 9);
  });
  // Propriété : le spread en pb est sans dimension — bid/ask ×10 → mêmes pb.
  // Vérification : 1,00 / 1 000,00 × 10 000 = 10 pb aussi.
  it('propriété : spreadPb invariant par changement d\'échelle (×10)', () => {
    expect(spreadPb(999.5, 1000.5)).toBeCloseTo(spreadPb(99.95, 100.05), 9);
  });
});

describe('coût de traversée du spread — valeurs de référence', () => {
  // Milieu 100,00 ; à l'achat on paie l'ask : 1 000 × (100,05 − 100,00) = 1 000 × 0,05 = 50 €
  it('coutTraverseeSpread à l\'achat = quantite × (ask − milieu)', () => {
    expect(coutTraverseeSpread(1000, 99.95, 100.05, 'achat')).toBeCloseTo(50, 6);
  });
  // À la vente on touche le bid : 1 000 × (100,00 − 99,95) = 50 € aussi (fourchette symétrique autour du milieu)
  it('coutTraverseeSpread à la vente = quantite × (milieu − bid)', () => {
    expect(coutTraverseeSpread(1000, 99.95, 100.05, 'vente')).toBeCloseTo(50, 6);
  });
  // Propriété : chaque sens paie la demi-fourchette → coût = quantite × spreadAbsolu / 2.
  // Contrôle sur un autre couple : bid 49,90 / ask 50,10, quantite 250 : 250 × 0,20/2 = 25 €.
  it('propriété : coût de traversée = quantite × spreadAbsolu / 2 (les deux sens)', () => {
    expect(coutTraverseeSpread(250, 49.9, 50.1, 'achat')).toBeCloseTo(250 * spreadAbsolu(49.9, 50.1) / 2, 9);
    expect(coutTraverseeSpread(250, 49.9, 50.1, 'vente')).toBeCloseTo(250 * spreadAbsolu(49.9, 50.1) / 2, 9);
    expect(coutTraverseeSpread(1000, 99.95, 100.05, 'achat')).toBeCloseTo(1000 * spreadAbsolu(99.95, 100.05) / 2, 9);
  });
});

describe('executionCarnet — marcher le carnet', () => {
  const niveaux = [
    { prix: 100.05, taille: 300 },
    { prix: 100.10, taille: 300 },
    { prix: 100.20, taille: 500 },
  ];

  // 300×100,05 + 300×100,10 + 200×100,20 = 30 015 + 30 030 + 20 040 = 80 085 €
  // prixMoyen = 80 085 / 800 = 100,10625 ; trois niveaux entamés (le 3e partiellement)
  it('valeur de référence : 800 titres sur trois niveaux', () => {
    const r = executionCarnet(800, niveaux);
    expect(r.coutTotal).toBeCloseTo(80085, 6);
    expect(r.prixMoyen).toBeCloseTo(100.10625, 9);
    expect(r.niveauxConsommes).toBe(3);
  });

  // Propriété : quantité = taille exacte du premier niveau → prix moyen = prix de ce niveau.
  // 300 × 100,05 = 30 015 €, un seul niveau consommé.
  it('propriété : remplissage exact du premier niveau → prixMoyen = prix du niveau', () => {
    const r = executionCarnet(300, niveaux);
    expect(r.prixMoyen).toBeCloseTo(100.05, 9);
    expect(r.coutTotal).toBeCloseTo(30015, 6);
    expect(r.niveauxConsommes).toBe(1);
  });

  // Cas limite : consommer exactement toute la profondeur (1 100) doit passer.
  // 300×100,05 + 300×100,10 + 500×100,20 = 30 015 + 30 030 + 50 100 = 110 145 €
  it('remplissage exact de toute la profondeur disponible', () => {
    const r = executionCarnet(1100, niveaux);
    expect(r.coutTotal).toBeCloseTo(110145, 6);
    expect(r.prixMoyen).toBeCloseTo(110145 / 1100, 9);
    expect(r.niveauxConsommes).toBe(3);
  });

  // 1 200 demandés pour 1 100 disponibles → erreur explicite.
  it('throw si la profondeur du carnet est insuffisante', () => {
    expect(() => executionCarnet(1200, niveaux)).toThrow();
  });
});

describe('slippage — valeurs de référence', () => {
  // À l'achat : prix payé − référence = 100,10625 − 100,00 = 0,10625 €/titre (positif = coût)
  it('slippage à l\'achat = prixMoyenExecution − prixReference', () => {
    expect(slippage(100.10625, 100.0, 'achat')).toBeCloseTo(0.10625, 9);
  });
  // À la vente : référence − prix reçu = 100,00 − 99,90 = 0,10 €/titre (positif = coût)
  it('slippage à la vente = prixReference − prixMoyenExecution', () => {
    expect(slippage(99.90, 100.0, 'vente')).toBeCloseTo(0.10, 9);
  });
  // Signé : exécuter MIEUX que la référence donne un slippage négatif (amélioration).
  it('slippage négatif quand l\'exécution améliore la référence', () => {
    expect(slippage(99.95, 100.0, 'achat')).toBeCloseTo(-0.05, 9);
    expect(slippage(100.05, 100.0, 'vente')).toBeCloseTo(-0.05, 9);
  });
});

describe('pnlMarketMaker — valeurs de référence', () => {
  // 40 allers-retours × 500 titres × (0,04 − 0,01) = 40 × 500 × 0,03 = 600 €
  it('pnlMarketMaker(40, 500, 0,04, 0,01) = 600 €', () => {
    expect(pnlMarketMaker(40, 500, 0.04, 0.01)).toBeCloseTo(600, 6);
  });
  // Propriété : si le coût de couverture mange tout le spread, le PnL est nul.
  it('propriété : coutCouverture = spread → PnL nul', () => {
    expect(pnlMarketMaker(40, 500, 0.04, 0.04)).toBeCloseTo(0, 9);
  });
});

describe('commissionTotale — valeurs de référence', () => {
  // 1 000 000 × 2 / 10 000 = 200 € > minimum 25 € → 200 €
  it('au-dessus du minimum : notionnel × tauxPb / 10 000', () => {
    expect(commissionTotale(1_000_000, 2, 25)).toBeCloseTo(200, 9);
  });
  // 50 000 × 2 / 10 000 = 10 € < 25 € → le minimum mord : 25 €
  it('en dessous du minimum : le minimum mord', () => {
    expect(commissionTotale(50_000, 2, 25)).toBeCloseTo(25, 9);
  });
  // Seuil exact : 125 000 × 2 / 10 000 = 25 € = minimum → 25 €
  it('au seuil exact, commission = minimum', () => {
    expect(commissionTotale(125_000, 2, 25)).toBeCloseTo(25, 9);
  });
});
