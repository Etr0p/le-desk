import { describe, expect, it } from 'vitest';
import { qcm } from './qcm';
import {
  bayes, combinaisons, correlation, covarianceEchantillon, intervalleConfiance,
  moyenneArithmetique, moyenneGeometrique, normaleCdf, ordonneeRegression,
  penteRegression, perpetuite, probaBinomiale, r2Regression, statT, van,
  vaAnnuite, varianceEchantillon, vfAnnuite, volatiliteAnnualisee, zScore,
} from './calculs';

const QUOTAS: Record<string, number> = {
  'valeur temps & VAN/TRI': 8,
  'statistiques descriptives': 10,
  'probabilités & Bayes': 12,
  'distributions': 8,
  'échantillonnage & intervalles': 8,
  "tests d'hypothèses": 8,
  'régression & Monte-Carlo': 6,
};

const THEMES_EN: Record<string, string> = {
  'valeur temps & VAN/TRI': 'time value & NPV/IRR',
  'statistiques descriptives': 'descriptive statistics',
  'probabilités & Bayes': 'probability & Bayes',
  'distributions': 'distributions',
  'échantillonnage & intervalles': 'sampling & confidence intervals',
  "tests d'hypothèses": 'hypothesis testing',
  'régression & Monte-Carlo': 'regression & Monte Carlo',
};

describe('banque QCM module 2 — invariants', () => {
  it('contient au moins 60 questions', () => {
    expect(qcm.length).toBeGreaterThanOrEqual(60);
  });

  it('ids uniques au format m2-qcm-XXX', () => {
    const ids = qcm.map(q => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^m2-qcm-\d{3}$/);
  });

  it('moduleId et difficulté valides partout', () => {
    for (const q of qcm) {
      expect(q.moduleId).toBe('02-methodes-quantitatives');
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

describe('banque QCM module 2 — valeurs numériques vérifiées via calculs.ts', () => {
  const r2 = (x: number) => Math.round(x * 100) / 100;
  const r4 = (x: number) => Math.round(x * 10000) / 10000;

  it('m2-qcm-001 : VA de l\'annuité 100 € × 3 ans à 5 % et distracteur VF', () => {
    expect(r2(vaAnnuite(100, 5, 3))).toBe(272.32);
    expect(r2(vfAnnuite(100, 5, 3))).toBe(315.25); // distracteur : valeur future
    expect(r2(300 / 1.05)).toBe(285.71); // distracteur : actualisation en bloc
  });

  it('m2-qcm-002 : perpétuité 50 €/an à 4 % et distracteurs', () => {
    expect(perpetuite(50, 4)).toBe(1250);
    expect(50 + perpetuite(50, 4)).toBe(1300); // distracteur : premier flux aujourd'hui
    expect(perpetuite(50, 10)).toBe(500); // distracteur : taux mal lu
  });

  it('m2-qcm-003 / 008 : VAN à 10 % et 9 % (bornes de l\'interpolation du TRI)', () => {
    expect(r2(van(1000, [400, 400, 400], 10))).toBe(-5.26);
    expect(r2(van(1000, [400, 400, 400], 9))).toBe(12.52);
    // l'interpolation : TRI ≈ 9,70 %, recoupée par une VAN quasi nulle
    const tri = 9 + 12.52 / (12.52 + 5.26);
    expect(r2(tri)).toBe(9.7);
    expect(Math.abs(van(1000, [400, 400, 400], tri))).toBeLessThan(0.1);
  });

  it('m2-qcm-009 / 010 : moyennes géométriques contre arithmétiques', () => {
    expect(r4(moyenneGeometrique([10, -10]))).toBe(-0.5013);
    expect(moyenneArithmetique([10, -10])).toBe(0); // distracteur arithmétique
    expect(r2(moyenneGeometrique([20, -10]))).toBe(3.92);
    expect(moyenneArithmetique([20, -10])).toBe(5); // distracteur arithmétique
  });

  it('m2-qcm-012 / 013 : variance n − 1 et annualisation de la volatilité', () => {
    expect(varianceEchantillon([2, 4, 6])).toBe(4);
    expect(r2(8 / 3)).toBe(2.67); // distracteur : division par n
    expect(r2(volatiliteAnnualisee(1, 252))).toBe(15.87);
    expect(r2(volatiliteAnnualisee(2, 252))).toBe(31.75);
  });

  it('m2-qcm-015 : covariance 2 %² et corrélation 0,60 (distracteurs 1,10 et 0,36)', () => {
    const A = [2, -1, 3, 0];
    const B = [1, 0, 4, 3];
    expect(covarianceEchantillon(A, B)).toBe(2);
    expect(r2(correlation(A, B))).toBe(0.6);
    expect(r2(covarianceEchantillon(A, B) / Math.sqrt(varianceEchantillon(A)))).toBe(1.1); // distracteur : un seul σ
    expect(r2(correlation(A, B) ** 2)).toBe(0.36); // distracteur : R²
  });

  it('m2-qcm-021 / 022 : Bayes — test médical 1/6 et signal de marché 14/38', () => {
    expect(r4(bayes(0.01, 0.99, 0.05))).toBe(0.1667);
    expect(r4(bayes(0.2, 0.7, 0.3))).toBe(0.3684);
    expect(r4(14 / 24)).toBe(0.5833); // distracteur : vrais/faux signaux au lieu de vrais/tous
  });

  it('m2-qcm-023 / 024 / 025 : complémentaire du six et combinatoire', () => {
    expect(r4(1 - (5 / 6) ** 4)).toBe(0.5177);
    expect(combinaisons(10, 3)).toBe(120);
    expect(combinaisons(10, 2)).toBe(45);
    expect(10 * 9 * 8).toBe(720); // distracteur : arrangements ordonnés
  });

  it('m2-qcm-026 / 030 : espérance et variance du dé', () => {
    const faces = [1, 2, 3, 4, 5, 6];
    const e = moyenneArithmetique(faces);
    expect(e).toBe(3.5);
    const e2 = moyenneArithmetique(faces.map(f => f * f));
    expect(r2(e2)).toBe(15.17); // distracteur : E[X²]
    expect(r2(e * e)).toBe(12.25); // distracteur : (E[X])²
    expect(r2(e2 - e * e)).toBe(2.92);
  });

  it('m2-qcm-031 / 038 : binomiale B(10 ; 0,5) — P(X = 3) et P(X ≥ 8)', () => {
    expect(r4(probaBinomiale(10, 3, 0.5) * 100)).toBe(11.7188);
    const tail = probaBinomiale(10, 8, 0.5) + probaBinomiale(10, 9, 0.5) + probaBinomiale(10, 10, 0.5);
    expect(r2(tail * 100)).toBe(5.47);
    expect(r2(probaBinomiale(10, 8, 0.5) * 100)).toBe(4.39); // distracteur : P(X = 8) seul
    expect(r2(combinaisons(10, 8) * 0.5 ** 8 * 100)).toBe(17.58); // distracteur : baisses oubliées
  });

  it('m2-qcm-032 / 033 / 035 : z-scores et queues de la normale', () => {
    expect(zScore(-9, 6, 15)).toBe(-1);
    expect(r4(normaleCdf(-1))).toBe(0.1587);
    expect(r4(2 * normaleCdf(-1))).toBe(0.3173); // les deux queues à ±1σ (m2-qcm-033)
    expect(r2((1 - normaleCdf(1.96)) * 100)).toBe(2.5);
    expect(6 + 1.96 * 15).toBe(35.4); // le seuil μ + 1,96σ de m2-qcm-035
  });

  it('m2-qcm-040 / 041 : erreur standard et bornes de l\'IC à 95 %', () => {
    expect(2 / Math.sqrt(25)).toBe(0.4);
    const ic = intervalleConfiance(0.08, 1.2, 252);
    expect(r2(ic.basse)).toBe(-0.07);
    expect(r2(ic.haute)).toBe(0.23);
    const ic1s = intervalleConfiance(0.08, 1.2, 252, 1); // distracteur : ±1 erreur standard
    expect(r2(ic1s.basse)).toBe(0);
    expect(r2(ic1s.haute)).toBe(0.16);
  });

  it('m2-qcm-045 : ≈ 864 jours pour exclure zéro (et 225 sans le 1,96)', () => {
    expect(r2((1.96 * 1.2 / 0.08) ** 2)).toBe(864.36);
    expect((1.2 / 0.08) ** 2).toBe(225); // distracteur : facteur 1,96 oublié
    // recoupement : à n = 865 l'IC exclut zéro, à n = 864 pas encore
    expect(intervalleConfiance(0.08, 1.2, 865).basse).toBeGreaterThan(0);
    expect(intervalleConfiance(0.08, 1.2, 864).basse).toBeLessThan(0);
  });

  it('m2-qcm-048 / 051 / 054 : t du fonds, p bilatéral 4,55 % et unilatéral 2,28 %', () => {
    expect(statT(2, 0, 5, 25)).toBe(2);
    expect(r2(2 * (1 - normaleCdf(2)) * 100)).toBe(4.55);
    expect(r2((1 - normaleCdf(2)) * 100)).toBe(2.28); // version unilatérale (m2-qcm-054)
    const icFonds = intervalleConfiance(2, 5, 25);
    expect(r2(icFonds.basse)).toBe(0.04); // zéro exclu d'un souffle — cohérent avec p < 5 %
  });

  it('m2-qcm-052 : data snooping — 1 − 0,95¹⁰⁰ et la variante à 20 tests', () => {
    expect(r4(1 - 0.95 ** 100)).toBe(0.9941);
    expect(r4(1 - 0.95 ** 20)).toBe(0.6415);
  });

  it('m2-qcm-055 : la droite parfaite y = 2x', () => {
    const xs = [1, 2, 3];
    const ys = [2, 4, 6];
    expect(penteRegression(xs, ys)).toBe(2);
    expect(ordonneeRegression(xs, ys)).toBe(0);
    expect(r4(r2Regression(xs, ys))).toBe(1);
  });

  it('m2-qcm-056 / 057 / 059 : beta 1,35, corrélation 0,96, et pente 1,66 sans la semaine 5', () => {
    const x5 = [-2, 1, 3, -1, 4];
    const y5 = [-3, 2, 5, -2, 4];
    expect(r2(penteRegression(x5, y5))).toBe(1.35);
    expect(r2(covarianceEchantillon(x5, y5))).toBe(8.75); // = 35/4 : Σproduits = 35 comme dans l'énoncé
    expect(r2(varianceEchantillon(x5))).toBe(6.5); // = 26/4 : Σ(x−x̄)² = 26 comme dans l'énoncé
    expect(r2(correlation(x5, y5))).toBe(0.96); // distracteur de 056
    expect(r2(varianceEchantillon(x5) / covarianceEchantillon(x5, y5))).toBe(0.74); // distracteur inversé
    const x4 = [-2, 1, 3, -1];
    const y4 = [-3, 2, 5, -2];
    expect(r2(penteRegression(x4, y4))).toBe(1.66); // sans la semaine 5 (m2-qcm-059)
    // m2-qcm-057 : R² = ρ²
    expect(r2(Math.sqrt(0.49))).toBe(0.7);
  });
});
