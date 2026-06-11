import { describe, expect, it } from 'vitest';
import { qcm } from './qcm';
import {
  ajustementSplit, ddmDeuxEtapes, evSurEbitda, gordon, per, pnlVenteADecouvert,
  poidsDansIndice, prixTheoriqueExDividende, rendementDividende, tauxDistribution,
  valeurDroitSouscription, valeurTerminaleGordon,
} from './calculs';

const QUOTAS: Record<string, number> = {
  "l'action & ses droits": 8,
  'valorisation par les flux': 10,
  'multiples': 10,
  'indices': 10,
  'vie du titre': 8,
  'IPO': 6,
  'short & efficience': 8,
};

const THEMES_EN: Record<string, string> = {
  "l'action & ses droits": 'the share & its rights',
  'valorisation par les flux': 'cash-flow valuation',
  'multiples': 'multiples',
  'indices': 'indices',
  'vie du titre': 'corporate actions',
  'IPO': 'IPOs',
  'short & efficience': 'short selling & efficiency',
};

describe('banque QCM module 3 — invariants', () => {
  it('contient au moins 60 questions', () => {
    expect(qcm.length).toBeGreaterThanOrEqual(60);
  });

  it('ids uniques au format m3-qcm-XXX', () => {
    const ids = qcm.map(q => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^m3-qcm-\d{3}$/);
  });

  it('moduleId et difficulté valides partout', () => {
    for (const q of qcm) {
      expect(q.moduleId).toBe('03-actions-indices');
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

describe('banque QCM module 3 — valeurs numériques vérifiées via calculs.ts', () => {
  const r1 = (x: number) => Math.round(x * 10) / 10;
  const r2 = (x: number) => Math.round(x * 100) / 100;

  it('m3-qcm-008 : rendement 3 %, payout 45 %, PER 15 — la ligne de cote est cohérente', () => {
    expect(r2(rendementDividende(2.7, 90))).toBe(3);
    expect(r2(tauxDistribution(2.7, 6))).toBe(45);
    expect(per(90, 6)).toBe(15);
    expect(r2(tauxDistribution(2.7, 6) / per(90, 6))).toBe(3); // rendement = payout/PER
    expect(r2((6 / 90) * 100)).toBe(6.67); // distracteur : rendement bénéficiaire
  });

  it('m3-qcm-009 / 010 : Gordon canonique 100 €, sensibilité +25 %/−17 % et distracteurs', () => {
    expect(gordon(5, 8, 3)).toBe(100);
    expect(gordon(5, 8, 4)).toBe(125); // +25 % pour 1 point de croissance
    expect(r2(gordon(5, 9, 3))).toBe(83.33); // −17 % pour 1 point de taux
    expect(r2(gordon(5, 8, 0) ?? 0)).toBe(62.5); // distracteur : perpétuité sans croissance
    expect(r2((5 * 1.03) / 0.05)).toBe(103); // distracteur : D₁ crû une fois de trop
    expect(r2((5 * 1.04) / 0.04)).toBe(130); // distracteur de 010 : D₁ re-crû
    expect(r2(5 / 0.03)).toBe(166.67); // distracteur : division par g
  });

  it('m3-qcm-013 : DDM deux étapes 42,15 € et les trois pièges recalculés', () => {
    expect(r2(ddmDeuxEtapes(2, 10, 3, 2, 8))).toBe(42.15);
    const vaDividendes = 2.2 / 1.08 + 2.42 / 1.08 ** 2 + 2.662 / 1.08 ** 3;
    expect(r2(vaDividendes)).toBe(6.22);
    const vt = valeurTerminaleGordon(2.662, 2, 8); // 45,254 € en valeur d'année 3
    expect(r2(vt)).toBe(45.25);
    expect(r2(vaDividendes + gordon(2.662, 8, 2) / 1.08 ** 3)).toBe(41.44); // VT sur D₃
    expect(r2(vaDividendes + vt)).toBe(51.48); // VT non actualisée
    expect(r2(vt / 1.08 ** 3)).toBe(35.92); // VT seule, dividendes oubliés
  });

  it('m3-qcm-015 : de l\'EV à la valeur par action — 20 € et les trois erreurs', () => {
    expect((1400 - (600 - 200)) / 50).toBe(20);
    expect(1400 / 50).toBe(28); // dette oubliée
    expect((1400 - 600) / 50).toBe(16); // trésorerie oubliée
    expect((1400 + 400) / 50).toBe(36); // dette ajoutée
  });

  it('m3-qcm-018 : Gordon avec D₀ — 91,11 € et les trois oublis', () => {
    expect(r2(gordon(4 * 1.025, 7, 2.5))).toBe(91.11);
    expect(r2(gordon(4, 7, 2.5))).toBe(88.89); // D₀ actualisé tel quel
    expect(r2((4 * 1.025) / 0.07)).toBe(58.57); // croissance absente du dénominateur
    expect(r2(4 / 0.07)).toBe(57.14); // double oubli
  });

  it('m3-qcm-019 : PER 15 et distracteurs inverse/produit', () => {
    expect(per(120, 8)).toBe(15);
    expect(r2(per(8, 120))).toBe(0.07); // ratio inversé
    expect(120 * 8).toBe(960); // multiplication
    expect(r1((8 / 120) * 100)).toBe(6.7); // rendement bénéficiaire
  });

  it('m3-qcm-022 / 023 : EV/EBITDA 4,4 (dette nette) et 5,0 (trésorerie nette)', () => {
    expect(r2(evSurEbitda(800, 500 - 200, 250))).toBe(4.4);
    expect(r2(800 / 250)).toBe(3.2); // dette oubliée
    expect(r2((800 + 500) / 250)).toBe(5.2); // dette brute (trésorerie oubliée)
    expect(r2((800 - 300) / 250)).toBe(2); // dette soustraite
    expect(evSurEbitda(600, -100, 100)).toBe(5); // dette nette négative
    expect((600 + 100) / 100).toBe(7); // trésorerie ajoutée comme une dette
  });

  it('m3-qcm-026 / 027 : PER théorique d(1+g)/(r−g) via Gordon (BPA = 1)', () => {
    expect(r2(gordon(0.6 * 1.03, 8, 3))).toBe(12.36);
    expect(r2(gordon(0.6, 8, 3))).toBe(12); // (1+g) oublié
    expect(r2((0.6 * 1.03) / 0.04)).toBe(15.45); // dénominateur à 4 points
    expect(gordon(1, 8, 3)).toBe(20); // payout oublié : multiple de dividende
    // 027 : b = 35 %, d = 65 %, g = ROE × b = 3,5 %
    expect(r2(gordon(0.65 * 1.035, 8, 3.5))).toBe(14.95);
    expect(r2(gordon(0.35 * 1.035, 8, 3.5))).toBe(8.05); // d confondu avec b
    expect(r2(gordon(0.65 * 1.065, 8, 6.5))).toBe(46.15); // g calculé avec d
    expect(r2(0.65 / 0.045)).toBe(14.44); // (1+g) oublié
  });

  it('m3-qcm-030 : poids price-weighted 55,6 % via poidsDansIndice (1 titre, 100 % flottant)', () => {
    const poids = poidsDansIndice([
      { prix: 100, nbTitres: 1, flottantPct: 100 },
      { prix: 50, nbTitres: 1, flottantPct: 100 },
      { prix: 30, nbTitres: 1, flottantPct: 100 },
    ]);
    expect(r1(poids[0])).toBe(55.6);
    expect(r1(poids[1])).toBe(27.8); // distracteur : poids de B
  });

  it('m3-qcm-031 : poids capi flottante 22,1 % et les deux erreurs de flottant', () => {
    const poids = poidsDansIndice([
      { prix: 50, nbTitres: 2000, flottantPct: 100 },  // MegaCorp : 100 Md€
      { prix: 120, nbTitres: 500, flottantPct: 55 },   // IndusGroupe : 33 Md€ flottants
      { prix: 800, nbTitres: 20, flottantPct: 100 },   // PetiteTech : 16 Md€
    ]);
    expect(r1(poids[1])).toBe(22.1);
    expect(r1(poids[0])).toBe(67.1);
    expect(r1(poids[2])).toBe(10.7);
    expect(r1((60000 / 149000) * 100)).toBe(40.3); // flottant oublié au numérateur
    expect(r1((60000 / 176000) * 100)).toBe(34.1); // capi totale partout
  });

  it('m3-qcm-032 / 037 : diviseur 2,17 après split, continuité du niveau et poids 38,5 %', () => {
    const dApres = 3 * (130 / 180);
    expect(r2(dApres)).toBe(2.17);
    expect(r2(130 / dApres)).toBe(60); // le niveau ne saute pas
    expect(r2(3 * (180 / 130))).toBe(4.15); // distracteur : rapport inversé
    expect(r2(130 / 1.5)).toBe(86.67); // distracteur : diviseur divisé par le ratio
    expect(r1((100 / 180) * 100)).toBe(55.6); // poids de A avant split
    expect(r1((50 / 130) * 100)).toBe(38.5); // poids de A après split
  });

  it('m3-qcm-039 : prix ex-dividende 62,40 € via prixTheoriqueExDividende', () => {
    expect(r2(prixTheoriqueExDividende(64, 1.6))).toBe(62.4);
    expect(r2(64 + 1.6)).toBe(65.6); // distracteur : dividende ajouté
    expect(r2(64 - 2 * 1.6)).toBe(60.8); // distracteur : retranché deux fois
  });

  it('m3-qcm-042 : split 4:1 — 120 € via ajustementSplit, capitalisation inchangée', () => {
    expect(ajustementSplit(480, 4)).toBe(120);
    expect(ajustementSplit(480, 5)).toBe(96); // distracteur : mauvais ratio
    expect(120 * 4).toBe(480); // la capitalisation par bloc de 4 titres est inchangée
  });

  it('m3-qcm-044 / 045 : DPS 3 € via valeurDroitSouscription et TERP 57 €', () => {
    expect(valeurDroitSouscription(60, 48, 3)).toBe(3);
    const terp = (3 * 60 + 48) / 4;
    expect(r2(terp)).toBe(57);
    expect(r2(60 - terp)).toBe(3); // le droit = la décote du cours
    expect((60 - 48) / 3).toBe(4); // distracteur : +1 oublié
    expect(terp - 48).toBe(9); // distracteur : avantage par action neuve
  });

  it('m3-qcm-046 : rachat relutif — BPA 11,11 € (+11,1 %), pas +10 %', () => {
    expect(r2(200 / 18)).toBe(11.11);
    expect(r1((200 / 18 / 10 - 1) * 100)).toBe(11.1);
    expect(r2(10 * 1.1)).toBe(11); // distracteur : prorata naïf
  });

  it('m3-qcm-048 : pop de 15 % sur 800 M€ = 120 M€ laissés sur la table', () => {
    expect(0.15 * 800).toBe(120);
    expect(r2(25 * 1.15)).toBe(28.75);
  });

  it('m3-qcm-054 : P&L net 3 800 € via pnlVenteADecouvert et distracteur base 365', () => {
    expect(pnlVenteADecouvert(80, 72, 500, 3, 60)).toBe(3800);
    expect((80 - 72) * 500).toBe(4000); // gain brut, frais oubliés
    expect(r2(4000 - 40000 * 0.03 * (60 / 365))).toBe(3802.74); // mauvaise convention 365
    expect(4000 - 40000 * 0.03).toBe(2800); // année pleine de frais
  });

  it('m3-qcm-055 : short sur ex-date — 8 000 € nets, dividende remboursé au prêteur', () => {
    expect(pnlVenteADecouvert(100, 90, 1000, 2, 90)).toBe(9500);
    expect(pnlVenteADecouvert(100, 90, 1000, 2, 90) - 1.5 * 1000).toBe(8000);
    expect(Math.round(10000 - 100000 * 0.02 * (90 / 365))).toBe(9507); // distracteur 365 + dividende oublié
    expect(9500 + 1500).toBe(11000); // distracteur : dividende encaissé au lieu de remboursé
  });

  it('m3-qcm-060 : stub 3Com/Palm = 82 − 1,5 × 95 = −60,50 $', () => {
    expect(r2(82 - 1.5 * 95)).toBe(-60.5);
    expect(82 - 95).toBe(-13); // distracteur : ratio de 1,5 oublié
  });
});
