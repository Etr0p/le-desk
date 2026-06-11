import { describe, expect, it } from 'vitest';
import { qcm } from './qcm';
import {
  commissionTotale, coutTraverseeSpread, executionCarnet, milieuFourchette,
  pnlMarketMaker, slippage, spreadAbsolu, spreadPb,
} from './calculs';

const QUOTAS: Record<string, number> = {
  'fonctions des marchés & tailles': 8,
  'acteurs': 10,
  'salle des marchés & métiers': 8,
  'ordres & exécution': 10,
  'microstructure': 8,
  'régulation': 8,
  'post-marché': 8,
};

const THEMES_EN: Record<string, string> = {
  'fonctions des marchés & tailles': 'market functions & sizes',
  'acteurs': 'players',
  'salle des marchés & métiers': 'trading floor & careers',
  'ordres & exécution': 'orders & execution',
  'microstructure': 'microstructure',
  'régulation': 'regulation',
  'post-marché': 'post-trade',
};

describe('banque QCM module 1 — invariants', () => {
  it('contient au moins 60 questions', () => {
    expect(qcm.length).toBeGreaterThanOrEqual(60);
  });

  it('ids uniques au format m1-qcm-XXX', () => {
    const ids = qcm.map(q => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^m1-qcm-\d{3}$/);
  });

  it('moduleId et difficulté valides partout', () => {
    for (const q of qcm) {
      expect(q.moduleId).toBe('01-panorama-marches');
      expect([1, 2, 3, 4]).toContain(q.difficulte);
    }
  });

  it('chaque question : 4 options, 4 explications non vides, bonneReponse en bornes', () => {
    for (const q of qcm) {
      expect(q.options, q.id).toHaveLength(4);
      expect(q.explications, q.id).toHaveLength(4);
      expect(q.bonneReponse, q.id).toBeGreaterThanOrEqual(0);
      expect(q.bonneReponse, q.id).toBeLessThan(4);
      expect(q.question.trim().length, q.id).toBeGreaterThan(0);
      for (const o of q.options) expect(o.trim().length, q.id).toBeGreaterThan(0);
      for (const e of q.explications) expect(e.trim().length, q.id).toBeGreaterThan(0);
    }
  });

  it('bilingue intégral : questionEn, optionsEn (4), explicationsEn (4), themeEn présents et non vides', () => {
    for (const q of qcm) {
      expect(q.questionEn, q.id).toBeDefined();
      expect((q.questionEn ?? '').trim().length, q.id).toBeGreaterThan(0);
      expect(q.optionsEn, q.id).toHaveLength(4);
      expect(q.explicationsEn, q.id).toHaveLength(4);
      for (const o of q.optionsEn ?? []) expect(o.trim().length, q.id).toBeGreaterThan(0);
      for (const e of q.explicationsEn ?? []) expect(e.trim().length, q.id).toBeGreaterThan(0);
      expect((q.themeEn ?? '').trim().length, q.id).toBeGreaterThan(0);
    }
  });

  it('themeEn cohérent avec le thème FR (traduction unique par thème)', () => {
    for (const q of qcm) {
      expect(Object.keys(QUOTAS), q.id).toContain(q.theme);
      expect(q.themeEn, q.id).toBe(THEMES_EN[q.theme]);
    }
  });

  it('quotas par thème respectés (compte exact)', () => {
    const parTheme = new Map<string, number>();
    for (const q of qcm) parTheme.set(q.theme, (parTheme.get(q.theme) ?? 0) + 1);
    for (const [theme, quota] of Object.entries(QUOTAS)) {
      expect(parTheme.get(theme), theme).toBe(quota);
    }
  });

  it('au moins 4 questions de niveau 4 (boss) et tous les niveaux représentés', () => {
    expect(qcm.filter(q => q.difficulte === 4).length).toBeGreaterThanOrEqual(4);
    for (const n of [1, 2, 3, 4]) {
      expect(qcm.some(q => q.difficulte === n), `niveau ${n}`).toBe(true);
    }
  });

  it('distribution de bonneReponse : aucun index avec plus de 25 occurrences', () => {
    const compte = [0, 0, 0, 0];
    for (const q of qcm) compte[q.bonneReponse] += 1;
    for (const [i, c] of compte.entries()) {
      expect(c, `index ${i} : ${c} occurrences`).toBeLessThanOrEqual(25);
    }
    // chaque index est utilisé au moins une fois
    for (const c of compte) expect(c).toBeGreaterThan(0);
  });

  it('aucune option dupliquée au sein d\'une question (FR et EN)', () => {
    for (const q of qcm) {
      expect(new Set(q.options).size, q.id).toBe(4);
      expect(new Set(q.optionsEn).size, q.id).toBe(4);
    }
  });

  it('aucun marqueur de contenu cassé (undefined/NaN) dans les textes', () => {
    for (const q of qcm) {
      const textes = [
        q.question, q.questionEn ?? '',
        ...q.options, ...(q.optionsEn ?? []),
        ...q.explications, ...(q.explicationsEn ?? []),
      ];
      for (const t of textes) expect(t, q.id).not.toMatch(/undefined|NaN/);
    }
  });
});

describe('banque QCM module 1 — valeurs numériques vérifiées via calculs.ts', () => {
  const r2 = (x: number) => Math.round(x * 100) / 100;

  it('m1-qcm-008 : 10 pb sur 2 800 Md€ = 2,8 Md€ par an (et distracteurs 280 M€ / 28 Md€)', () => {
    const dette = 2_800e9;
    expect(dette * 10 / 10_000).toBe(2.8e9);
    expect(dette * 1 / 10_000).toBe(0.28e9); // distracteur : 1 pb au lieu de 10
    expect(dette * 100 / 10_000).toBe(28e9); // distracteur : 10 pb lus comme 1 %
  });

  it('m1-qcm-018 : autopsie des coûts — 800 € d\'exécution contre 3 000 €/an de gestion', () => {
    expect(commissionTotale(1_000_000, 5, 0)).toBe(500); // courtage 5 pb
    // demi-spread de 2 pb sur 1 M€ (10 000 titres à ~100 €, fourchette 99,98/100,02) : 200 €
    expect(coutTraverseeSpread(1_000_000 / 100, 99.98, 100.02, 'achat')).toBeCloseTo(200, 6);
    expect(500 + 200 + 100).toBe(800); // 5 pb + 2 pb + 1 pb = 8 pb
    expect(1_000_000 * 0.003).toBe(3000); // gestion 0,3 %/an
    expect(1_000_000 * 0.015).toBe(15000); // fonds actif grand public à 1,5 %
  });

  it('m1-qcm-032 : fourchette 49,90/50,10 = 40 pb (distracteurs 20 pb et spread 2 € pour 400 pb)', () => {
    expect(r2(spreadPb(49.90, 50.10))).toBe(40);
    expect(r2(spreadPb(49.90, 50.10) / 2)).toBe(20); // distracteur : demi-fourchette
    expect(r2(spreadAbsolu(49.90, 50.10))).toBe(0.2);
    expect(milieuFourchette(49.90, 50.10)).toBe(50);
    expect(r2(400 / 10_000 * 50)).toBe(2); // 400 pb impliqueraient un spread de 2 €
  });

  it('m1-qcm-033 : traverser la fourchette 99,95/100,05 sur 1 000 titres = 50 € (aller-retour 100 €)', () => {
    expect(r2(coutTraverseeSpread(1000, 99.95, 100.05, 'achat'))).toBe(50);
    const allerRetour = coutTraverseeSpread(1000, 99.95, 100.05, 'achat')
      + coutTraverseeSpread(1000, 99.95, 100.05, 'vente');
    expect(r2(allerRetour)).toBe(100); // distracteur : la fourchette entière
    expect(r2(1000 * spreadAbsolu(99.95, 100.05))).toBe(100); // même chiffre, par le spread absolu
  });

  it('m1-qcm-034 : marcher le carnet 200@50,10 / 300@50,20 / 500@50,40 sur 600 titres', () => {
    const resultat = executionCarnet(600, [
      { prix: 50.10, taille: 200 },
      { prix: 50.20, taille: 300 },
      { prix: 50.40, taille: 500 },
    ]);
    expect(r2(resultat.prixMoyen)).toBe(50.20);
    expect(r2(resultat.coutTotal)).toBe(30_120);
    expect(resultat.niveauxConsommes).toBe(3);
    expect(r2((50.10 + 50.20 + 50.40) / 3)).toBe(50.23); // distracteur : moyenne simple
  });

  it('m1-qcm-035 : carnet de référence — 40 € + 45 € + 25 € = 110 € de friction totale', () => {
    const resultat = executionCarnet(800, [
      { prix: 100.05, taille: 300 },
      { prix: 100.10, taille: 300 },
      { prix: 100.20, taille: 500 },
    ]);
    expect(r2(resultat.coutTotal)).toBe(80_085);
    expect(resultat.prixMoyen).toBeCloseTo(100.10625, 6);
    // demi-fourchette : 800 × (ask − milieu) = 40 €
    expect(r2(coutTraverseeSpread(800, 99.95, 100.05, 'achat'))).toBe(40);
    // slippage de profondeur face au meilleur ask : 45 €
    expect(r2(slippage(resultat.prixMoyen, 100.05, 'achat') * 800)).toBe(45);
    // surcoût total face au milieu : 85 €
    expect(r2(slippage(resultat.prixMoyen, 100.00, 'achat') * 800)).toBe(85);
    // commission : le minimum mord (16,02 € < 25 €)
    expect(commissionTotale(resultat.coutTotal, 2, 25)).toBe(25);
    expect(r2(resultat.coutTotal * 2 / 10_000)).toBe(16.02); // distracteur : oubli du minimum
    expect(r2(85 + 16.02)).toBe(101.02); // distracteur complet de l'option B
    expect(40 + 45 + 25).toBe(110);
    // distracteur : fourchette entière au lieu de la demi (80 € au lieu de 40 €)
    expect(r2(800 * spreadAbsolu(99.95, 100.05))).toBe(80);
    expect(80 + 45 + 25).toBe(150);
  });

  it('m1-qcm-036 : commission 3 pb min 30 € sur 60 000 € — le minimum mord', () => {
    expect(commissionTotale(60_000, 3, 30)).toBe(30);
    expect(r2(60_000 * 3 / 10_000)).toBe(18); // distracteur : oubli du minimum
    expect(r2(18 + 30)).toBe(48); // distracteur : addition plancher + proportionnelle
    expect(r2(60_000 * 0.003)).toBe(180); // distracteur : 3 pb lus comme 0,3 %
    // seuil d'indifférence : à 100 000 € la proportionnelle rejoint le minimum
    expect(commissionTotale(100_000, 3, 30)).toBe(30);
    expect(r2(100_000 * 3 / 10_000)).toBe(30);
  });

  it('m1-qcm-038 : sélection adverse — 20 % d\'informés doublent le spread (ask 100,20 contre 100,10)', () => {
    const eVAchat = (pInformes: number) => {
      const pAchatSi101 = pInformes + (1 - pInformes) * 0.5;
      const pAchatSi99 = (1 - pInformes) * 0.5;
      const pHaut = pAchatSi101 / (pAchatSi101 + pAchatSi99);
      return pHaut * 101 + (1 - pHaut) * 99;
    };
    expect(r2(eVAchat(0.20))).toBe(100.20);
    expect(r2(eVAchat(0.10))).toBe(100.10); // distracteur : le modèle du chapitre à 10 %
    // spread complet par symétrie : 2 × (ask − milieu)
    expect(r2(2 * (eVAchat(0.20) - 100))).toBe(0.40);
    expect(r2(2 * (eVAchat(0.10) - 100))).toBe(0.20);
  });

  it('m1-qcm-044 : PnL market maker 50 × 1 000 × (0,04 − 0,01) = 1 500 €', () => {
    expect(r2(pnlMarketMaker(50, 1000, 0.04, 0.01))).toBe(1500);
    expect(r2(pnlMarketMaker(50, 1000, 0.04, 0))).toBe(2000); // distracteur : couverture oubliée
    expect(r2(pnlMarketMaker(50, 1000, 0.02, 0.01))).toBe(500); // distracteur : demi-spread
    expect(r2(pnlMarketMaker(50, 1000, 0.04 + 0.01, 0))).toBe(2500); // distracteur : couverture additionnée
  });
});
