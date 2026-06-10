import { describe, expect, it } from 'vitest';
import { qcm } from './qcm';
import {
  couponCouru, durationMacaulay, durationModifiee, interetMonetaire,
  prixObligation, prixZeroCoupon, tauxEffectif, tauxForward, ytm2Ans,
} from './calculs';

const QUOTAS: Record<string, number> = {
  'conventions & monétaire': 8,
  'anatomie & types': 8,
  'pricing & coupon couru': 10,
  'duration & convexité': 10,
  'rendements': 8,
  'courbe & forwards': 10,
  'repo & pratique': 6,
};

const THEMES_EN: Record<string, string> = {
  'conventions & monétaire': 'conventions & money market',
  'anatomie & types': 'anatomy & bond types',
  'pricing & coupon couru': 'pricing & accrued interest',
  'duration & convexité': 'duration & convexity',
  'rendements': 'yields',
  'courbe & forwards': 'curve & forwards',
  'repo & pratique': 'repo & market practice',
};

describe('banque QCM module 4 — invariants', () => {
  it('contient au moins 60 questions', () => {
    expect(qcm.length).toBeGreaterThanOrEqual(60);
  });

  it('ids uniques au format m4-qcm-XXX', () => {
    const ids = qcm.map(q => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^m4-qcm-\d{3}$/);
  });

  it('moduleId et difficulté valides partout', () => {
    for (const q of qcm) {
      expect(q.moduleId).toBe('04-taux-obligations');
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

describe('banque QCM module 4 — valeurs numériques vérifiées via calculs.ts', () => {
  const r2 = (x: number) => Math.round(x * 100) / 100;

  it('m4-qcm-001 : intérêt monétaire Exact/360', () => {
    expect(r2(interetMonetaire(2_000_000, 3.5, 120))).toBe(23333.33);
    expect(r2(interetMonetaire(2_000_000, 3.5, 120, 365))).toBe(23013.7); // distracteur base 365
  });

  it('m4-qcm-003 : taux effectif trimestriel et semestriel', () => {
    expect(r2(tauxEffectif(8, 4))).toBe(8.24);
    expect(r2(tauxEffectif(8, 2))).toBe(8.16); // distracteur semestriel
  });

  it('m4-qcm-012 : coupon FRN Euribor + marge en Exact/360', () => {
    expect(r2(interetMonetaire(100_000, 3.05, 91))).toBe(770.97);
    expect(r2(interetMonetaire(100_000, 3.05, 91, 365))).toBe(760.41); // distracteur base 365
    expect(r2(interetMonetaire(100_000, 2.2, 91))).toBe(556.11); // distracteur sans marge
  });

  it('m4-qcm-013 : prix du zéro-coupon 8 ans à 3,5 %', () => {
    expect(r2(prixZeroCoupon(1000, 3.5, 8))).toBe(759.41);
  });

  it('m4-qcm-017 / 022 / 025 : prix de l\'obligation fil rouge et variantes', () => {
    expect(r2(prixObligation(1000, 5, 3, 4))).toBe(1027.75);
    expect(r2(prixObligation(1000, 5, 3, 3))).toBe(1056.57);
    expect(r2(prixObligation(1000, 2, 5, 4))).toBe(910.96);
    expect(r2(prixObligation(1000, 6, 5, 4))).toBe(1089.04); // distracteur inversé de 025
  });

  it('m4-qcm-019 / 020 / 024 / 026 : coupons courus', () => {
    expect(r2(couponCouru(4, 1000, 200, 365))).toBe(21.92);
    expect(r2(couponCouru(3.5, 10_000, 120, 365))).toBe(115.07);
    expect(r2(couponCouru(2.5, 100_000, 73, 365))).toBe(500);
    expect(r2(couponCouru(3.2, 1000, 175, 366))).toBe(15.3); // année bissextile
    expect(r2(couponCouru(3.2, 1000, 175, 365))).toBe(15.34); // distracteur 365
  });

  it('m4-qcm-030 / 032 : durations de Macaulay et modifiée', () => {
    expect(r2(durationMacaulay(1000, 5, 3, 4))).toBe(2.86);
    expect(r2(durationModifiee(durationMacaulay(1000, 5, 3, 4), 4))).toBe(2.75);
    expect(r2(durationModifiee(6.5, 4))).toBe(6.25);
  });

  it('m4-qcm-031 : la variation standard −10,29 €', () => {
    expect(r2(-4.2 * 0.0025 * 980)).toBe(-10.29);
    expect(r2(-4.2 * 0.01 * 980)).toBe(-41.16); // distracteur 100 pb
  });

  it('m4-qcm-039 : YTM 2 ans, recoupé par re-pricing', () => {
    const y = ytm2Ans(1000, 3, 985);
    expect(r2(y)).toBe(3.79);
    expect(prixObligation(1000, 3, 2, y)).toBeCloseTo(985, 6);
  });

  it('m4-qcm-043 : rendement du zéro-coupon 2 ans', () => {
    expect(r2((Math.sqrt(100 / 95.18) - 1) * 100)).toBe(2.5);
  });

  it('m4-qcm-047 / 048 : taux forward', () => {
    expect(r2(tauxForward(1.8, 1, 3.0, 2))).toBe(4.21);
    expect(r2(tauxForward(2, 1, 3, 3))).toBe(3.5);
  });

  it('m4-qcm-050 : bootstrapping du taux 2 ans', () => {
    const z1 = (100 / 96.15 - 1) * 100;
    expect(r2(z1)).toBe(4);
    const pvCoupon = 5 / (1 + z1 / 100);
    const z2 = (Math.sqrt(105 / (100 - pvCoupon)) - 1) * 100;
    expect(r2(z2)).toBe(5.03);
  });

  it('m4-qcm-054 : coût du chemin 1 an + forward = 3,00 %', () => {
    expect(r2((Math.sqrt(1.02 * 1.0401) - 1) * 100)).toBe(3);
  });

  it('m4-qcm-056 / 057 : repo, haircut et intérêts Exact/360', () => {
    expect(20_000_000 * (1 - 0.03)).toBe(19_400_000);
    expect(r2(interetMonetaire(19_400_000, 2.5, 14))).toBe(18861.11);
    expect(r2(interetMonetaire(19_400_000, 2.5, 14, 365))).toBe(18602.74); // distracteur base 365
  });
});
