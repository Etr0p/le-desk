# Le Desk — Plan Phase 1B : contenu du module pilote « Taux & obligations »

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rédiger l'intégralité du module 4 (Taux & obligations) : 7 chapitres interactifs, 13 générateurs d'application, 16 moules de problèmes (≈ 50 énoncés via scénarios), 60 QCM, 25 questions jury, 80 flashcards, synthèse, glossaire, formulaire.

**Architecture:** Le contenu remplit les fichiers du module créés en plan 1A. Tous les calculs financiers passent par `calculs.ts`, testé sur des valeurs de référence vérifiées à la main — les générateurs ne contiennent JAMAIS de formule recopiée, ils composent les fonctions de `calculs.ts`.

**Tech Stack:** MDX + KaTeX (chapitres), TypeScript (banques), Vitest (calculs et invariants).

**Prérequis :** plan 1A terminé (app fonctionnelle). **Référence :** spec `docs/superpowers/specs/2026-06-10-le-desk-design.md`.

---

## Conventions rédactionnelles (toutes les tâches de contenu)

- Français soigné, registre professionnel ; tutoiement interdit dans le cours ; jargon anglais entre parenthèses à la première occurrence : « la pension livrée (*repo*) ».
- Chaque notion : intuition d'abord, formule ensuite, exemple chiffré complet systématique.
- Démonstrations et approfondissements UNIQUEMENT dans `<GoFurther>`.
- Encadrés : `<Callout type="definition|exemple|piege|important">`. Au moins un `piege` par chapitre (c'est ce qu'un jury teste).
- Conventions chiffrées : virgule décimale dans le texte, `%` après espace, montants en €. Maths : KaTeX (`$…$`, `$$…$$`), notations cohérentes (prix $P$, taux $r$, rendement $y$, nominal $N$, coupon $C$, maturité $n$).
- Chaque chapitre se termine par `<Checkpoint>` (3 questions qui testent les pièges du chapitre, pas la mémoire brute).
- Ordres de grandeur datés « début 2026 » quand on cite des niveaux de marché.

---

### Task B1 : `calculs.ts` — bibliothèque financière de référence (TDD)

**Files:** Create: `src/content/modules/04-taux-obligations/calculs.ts`, `src/content/modules/04-taux-obligations/calculs.test.ts`

- [ ] **Step 1 : Tests sur valeurs de référence vérifiées à la main**

```ts
import { describe, expect, it } from 'vitest';
import {
  va, prixObligation, durationMacaulay, durationModifiee, convexite,
  prixZeroCoupon, tauxForward, interetMonetaire, couponCouru,
} from './calculs';

describe('calculs obligataires — valeurs de référence', () => {
  // Obligation 1000 €, coupon 5 %, 3 ans, taux 4 % :
  // 50/1,04 + 50/1,04² + 1050/1,04³ = 48,076923 + 46,227811 + 933,446179 = 1027,750913
  it('prix d’une obligation à coupon annuel', () => {
    expect(prixObligation(1000, 5, 3, 4)).toBeCloseTo(1027.7509, 3);
  });
  it('au pair quand coupon = taux', () => {
    expect(prixObligation(1000, 4, 7, 4)).toBeCloseTo(1000, 6);
  });
  it('prix décote quand coupon < taux, surcote sinon', () => {
    expect(prixObligation(1000, 2, 5, 4)).toBeLessThan(1000);
    expect(prixObligation(1000, 6, 5, 4)).toBeGreaterThan(1000);
  });
  // Duration Macaulay du même titre : (1×48,076923 + 2×46,227811 + 3×933,446179)/1027,750913 = 2,861467
  it('duration de Macaulay', () => {
    expect(durationMacaulay(1000, 5, 3, 4)).toBeCloseTo(2.8615, 3);
  });
  it('duration d’un zéro-coupon = sa maturité', () => {
    expect(durationMacaulay(1000, 0, 5, 3)).toBeCloseTo(5, 9);
  });
  it('duration modifiée = DMac/(1+y)', () => {
    expect(durationModifiee(2.8615, 4)).toBeCloseTo(2.7514, 3);
  });
  it('convexité d’un zéro-coupon = n(n+1)/(1+y)²', () => {
    expect(convexite(1000, 0, 3, 4)).toBeCloseTo((3 * 4) / 1.04 ** 2, 6); // 11,0947
  });
  it('prix d’un zéro-coupon', () => {
    expect(prixZeroCoupon(1000, 3, 5)).toBeCloseTo(862.6088, 3); // 1000/1,03⁵
  });
  it('taux forward 1 an dans 1 an : (1,03²/1,02) − 1', () => {
    expect(tauxForward(2, 1, 3, 2)).toBeCloseTo(4.0098, 3); // en %
  });
  it('intérêt monétaire Exact/360 : 1 M€ à 3,5 % sur 90 j = 8 750 €', () => {
    expect(interetMonetaire(1_000_000, 3.5, 90)).toBeCloseTo(8750, 6);
  });
  it('coupon couru : 6 %, 1000 €, 73 j (base 365) = 12 €', () => {
    expect(couponCouru(6, 1000, 73, 365)).toBeCloseTo(12, 6);
  });
  it('va actualise correctement', () => {
    expect(va(1050, 4, 3)).toBeCloseTo(933.4462, 3);
  });
});
```

- [ ] **Step 2 : Run** `npx vitest run src/content/modules/04-taux-obligations/calculs.test.ts` — Expected: FAIL.
- [ ] **Step 3 : Implémenter `calculs.ts`** (taux toujours en %, durées en années, signatures exactes des tests)

```ts
export function va(flux: number, tauxPct: number, t: number): number {
  return flux / (1 + tauxPct / 100) ** t;
}
export function prixObligation(nominal: number, couponPct: number, n: number, tauxPct: number): number {
  const c = (nominal * couponPct) / 100;
  let p = 0;
  for (let t = 1; t <= n; t++) p += va(t < n ? c : c + nominal, tauxPct, t);
  return p;
}
export function durationMacaulay(nominal: number, couponPct: number, n: number, tauxPct: number): number {
  const c = (nominal * couponPct) / 100;
  const p = prixObligation(nominal, couponPct, n, tauxPct);
  let s = 0;
  for (let t = 1; t <= n; t++) s += t * va(t < n ? c : c + nominal, tauxPct, t);
  return s / p;
}
export function durationModifiee(dMac: number, tauxPct: number): number {
  return dMac / (1 + tauxPct / 100);
}
export function convexite(nominal: number, couponPct: number, n: number, tauxPct: number): number {
  const c = (nominal * couponPct) / 100;
  const y = tauxPct / 100;
  const p = prixObligation(nominal, couponPct, n, tauxPct);
  let s = 0;
  for (let t = 1; t <= n; t++) {
    const flux = t < n ? c : c + nominal;
    s += (t * (t + 1) * flux) / (1 + y) ** (t + 2);
  }
  return s / p;
}
export function prixZeroCoupon(nominal: number, tauxPct: number, n: number): number {
  return va(nominal, tauxPct, n);
}
export function tauxForward(z1Pct: number, t1: number, z2Pct: number, t2: number): number {
  const f = ((1 + z2Pct / 100) ** t2 / (1 + z1Pct / 100) ** t1) ** (1 / (t2 - t1)) - 1;
  return f * 100;
}
export function interetMonetaire(nominal: number, tauxPct: number, jours: number, base = 360): number {
  return (nominal * (tauxPct / 100) * jours) / base;
}
export function couponCouru(couponPct: number, nominal: number, joursDepuisCoupon: number, baseJoursAn = 365): number {
  return ((nominal * couponPct) / 100) * (joursDepuisCoupon / baseJoursAn);
}
```

- [ ] **Step 4 : Run** — Expected: PASS (12 tests). **Step 5 : Commit** — `feat(m4): bibliothèque de calculs obligataires testée sur valeurs de référence`.

---

### Task B2 : Chapitres 1 et 2

**Files:** Create: `chapters/01-taux-et-conventions.mdx`, `chapters/02-obligation-instrument-roi.mdx` ; Modify: `chapters.ts`

- [ ] **Step 1 : Chapitre 1 — « Le temps, c'est de l'argent : taux et conventions »** (meta ordre 1). Sections :
  1. *Pourquoi un taux d'intérêt existe* — loyer de l'argent, renoncement, risque, inflation ; les trois composantes d'un taux (taux réel + inflation anticipée + prime de risque).
  2. *Capitalisation et actualisation* — simple vs composé ($VF = VA(1+r)^n$), actualisation comme « machine à remonter le temps », exemple chiffré aller-retour.
  3. *Les conventions de calcul* — Exact/360 (monétaire), 30/360, Exact/Exact ; exemple chiffré : le même placement donne des intérêts différents selon la base (Callout `piege`).
  4. *Taux nominal, taux effectif* — composition infra-annuelle, $(1 + r/m)^m - 1$, exemple semestriel.
  5. *Le marché monétaire* — €STR, Euribor (fixings, panel), T-bills/BTF, certificats de dépôt, billets de trésorerie ; qui prête, qui emprunte ; ordres de grandeur début 2026.
  - `<GoFurther>` : la composition continue $e^{rt}$ (limite de $(1+r/m)^m$), pourquoi elle simplifie les calculs des quants.
  - `<Checkpoint id="m4-ch1">` 3 questions (dont une sur le piège des bases).
- [ ] **Step 2 : Chapitre 2 — « L'obligation, l'instrument roi »** (ordre 2). Sections :
  1. *Anatomie* — nominal, coupon, maturité, prix en % du nominal ; lecture d'une ligne obligataire réelle (OAT fictive réaliste).
  2. *Qui émet et pourquoi* — souverains (OAT, Bund, Treasuries, BTP), agences, corporates ; financement vs bancaire.
  3. *La famille obligataire* — taux fixe, FRN (Euribor + marge), zéro-coupon, indexées inflation (OATi), callable/puttable (une phrase, renvoi module 9).
  4. *Naissance d'une obligation* — primaire : adjudication (AFT, prix multiples) vs syndication ; ce que fait le sell-side.
  5. *La vie au marché secondaire* — cotation en % du pair, bid/ask, liquidité, taille de marché (le marché obligataire mondial > marché actions — ordre de grandeur).
  - `<GoFurther>` : structure du capital et seniorité (senior secured → equity), où se placent les obligations.
  - `<Checkpoint id="m4-ch2">` 3 questions.
- [ ] **Step 3 : Enregistrer** les deux chapitres dans `chapters.ts` (supprimer `00-test-pipeline.mdx` s'il existe encore). Vérifier le rendu en dev (formules, callouts, checkpoints). `npm run typecheck` + `npx vitest run` PASS.
- [ ] **Step 4 : Commit** — `feat(m4): chapitres 1-2 (taux et conventions, anatomie des obligations)`.

---

### Task B3 : Chapitres 3 et 4

**Files:** Create: `chapters/03-pricer-une-obligation.mdx`, `chapters/04-le-rendement.mdx` ; Modify: `chapters.ts`

- [ ] **Step 1 : Chapitre 3 — « Pricer une obligation »** (ordre 3). Sections :
  1. *Le principe* — le prix = somme des flux actualisés, $$P = \sum_{t=1}^{n} \frac{F_t}{(1+r)^t}$$ ; tableau de flux complet d'un exemple (1 000 €, 5 %, 3 ans, taux 4 % → 1 027,75 € — reprendre EXACTEMENT la valeur de référence de `calculs.test.ts`).
  2. *Pair, surcote, décote* — la règle coupon vs taux de marché, intuition « obligation ancienne vs nouvelles émissions ».
  3. *Pourquoi prix et taux varient en sens inverse* — mécanique (dénominateur) + intuition de marché (concurrence des émissions neuves) — c'est LA question de jury, soigner les deux formulations.
  4. *Coupon couru, prix propre, prix sale* — exemple chiffré complet d'un achat entre deux dates de coupon.
  - `<GoFurther>` : actualisation en date fractionnaire (exposants non entiers).
  - `<Checkpoint id="m4-ch3">`.
- [ ] **Step 2 : Chapitre 4 — « Le rendement »** (ordre 4). Sections :
  1. *Rendement courant* — coupon/prix, pourquoi c'est insuffisant.
  2. *Le rendement actuariel (YTM)* — définition (taux qui égalise prix et flux actualisés), résolution par itération (intuition, pas d'algèbre lourde), exemple : lire un YTM, comparer deux obligations.
  3. *Ce que le YTM suppose* — réinvestissement des coupons au même taux, détention à maturité ; rendement réalisé ≠ YTM (Callout `piege`).
  4. *Prix ↔ rendement en pratique* — la cotation en taux des marchés de dette souveraine.
  - `<GoFurther>` : lien YTM / taux zéro-coupon (le YTM comme moyenne complexe des taux ZC).
  - `<Checkpoint id="m4-ch4">`.
- [ ] **Step 3 : Vérifier** rendu + typecheck + tests. **Step 4 : Commit** — `feat(m4): chapitres 3-4 (pricing, rendement)`.

---

### Task B4 : Chapitre 5 + composant interactif « courbe des taux »

**Files:** Create: `chapters/05-la-courbe-des-taux.mdx`, `src/components/charts/YieldCurveExplorer.tsx`

- [ ] **Step 1 : `YieldCurveExplorer`** — SVG interactif autonome (aucune donnée externe) :
  - Points de maturités [1, 2, 3, 5, 7, 10, 20, 30] ans, taux initiaux d'une courbe normale (≈ 2,2 % → 3,8 %) ;
  - Chaque point glissable verticalement (souris ET tactile, pointer events), plage 0-8 % ; la courbe (polyline lissée) suit ;
  - Étiquette automatique de la forme : normale / inversée / plate / bossée (règles simples sur les pentes 2s10s et 1s2s) ;
  - Affichage dynamique du spread 2s10s en pb, coloré (positif accent, négatif rouge) ;
  - Boutons présets : « Normale », « Inversée (2022-2023 US) », « Plate », « Réinitialiser » ;
  - Axes propres, grille discrète, libellés en français, responsive (viewBox).
- [ ] **Step 2 : Chapitre 5 — « La courbe des taux »** (ordre 5). Sections :
  1. *Qu'est-ce que c'est* — rendement par maturité d'un même émetteur ; la courbe souveraine comme référence ; `<YieldCurveExplorer />` inséré ici avec consigne de manipulation (« inversez la courbe, observez le 2s10s »).
  2. *Lire les formes* — normale, plate, inversée, bossée ; inversion = signal récessif (historique américain, fiabilité et limites).
  3. *Les théories* — anticipations pures, prime de liquidité, habitat préféré ; ce que chaque théorie explique.
  4. *Courbe des rendements vs courbe zéro-coupon* — pourquoi les YTM ne s'additionnent pas, le bootstrapping : exemple chiffré complet à 2 périodes (calculé avec les fonctions de référence).
  5. *Les taux forward* — $$ (1+z_2)^2 = (1+z_1)(1+f_{1,2}) $$, exemple chiffré (reprendre 2 %/3 % → 4,01 %), lecture : ce que le marché anticipe.
  6. *Spreads de courbe* — 2s10s, aplatissement/pentification bull et bear.
  - `<GoFurther>` : démonstration du forward par absence d'arbitrage (deux stratégies équivalentes).
  - `<Checkpoint id="m4-ch5">`.
- [ ] **Step 3 : Vérifier** (drag fluide au tactile via DevTools mobile) + typecheck + tests. **Step 4 : Commit** — `feat(m4): chapitre 5 + explorateur de courbe des taux interactif`.

---

### Task B5 : Chapitre 6 + composant interactif « duration & convexité »

**Files:** Create: `chapters/06-duration-convexite.mdx`, `src/components/charts/DurationConvexityViz.tsx`

- [ ] **Step 1 : `DurationConvexityViz`** — SVG interactif :
  - Courbe prix-taux exacte d'une obligation (par défaut 1 000 €, 5 %, 10 ans), calculée avec `prixObligation` sur y ∈ [0,5 %, 12 %] ;
  - Tangente au point courant (pente = duration modifiée) ; slider du taux courant ; un second curseur « choc de taux » Δy ∈ [-300, +300] pb ;
  - Affiche : prix exact après choc, prix estimé par la duration seule, prix estimé duration + convexité, et l'écart (la zone entre tangente et courbe est ombrée) ;
  - Paramètres modifiables (coupon, maturité) pour voir la duration changer ; valeurs affichées : $D_{Mac}$, $D_{mod}$, convexité, DV01.
- [ ] **Step 2 : Chapitre 6 — « Duration & convexité »** (ordre 6). Sections :
  1. *Mesurer la sensibilité* — pourquoi « maturité » ne suffit pas ; DV01 (la mesure du desk).
  2. *Duration de Macaulay* — barycentre temporel des flux actualisés, $$D = \frac{\sum t \cdot VA(F_t)}{P}$$, calcul complet de l'exemple de référence (2,86 ans), cas limites (ZC : D = n ; coupon ↑ ⇒ D ↓).
  3. *Duration modifiée* — $D_{mod} = D/(1+y)$, $\Delta P \approx -D_{mod} \cdot \Delta y \cdot P$, exemple chiffré +50 pb.
  4. *Convexité* — pourquoi la duration se trompe sur les gros chocs, correction d'ordre 2 $\Delta P/P \approx -D_{mod}\Delta y + \tfrac{1}{2} C (\Delta y)^2$, la convexité est une qualité (Callout `important`) ; `<DurationConvexityViz />` inséré ici.
  5. *S'en servir* — duration de portefeuille (moyenne pondérée), immunisation, couverture (ratio DV01), limites (chocs non parallèles).
  - `<GoFurther>` : dérivation de la duration comme dérivée du prix ($D_{mod} = -\frac{1}{P}\frac{dP}{dy}$).
  - `<Checkpoint id="m4-ch6">`.
- [ ] **Step 3 : Vérifier** + typecheck + tests. **Step 4 : Commit** — `feat(m4): chapitre 6 + visualisation duration/convexité`.

---

### Task B6 : Chapitre 7, synthèse, glossaire, formulaire

**Files:** Create: `chapters/07-marche-obligataire-en-pratique.mdx`, `synthese.mdx` ; Modify: `chapters.ts`, `formules.ts`, `src/content/glossary.ts`, page Module (charger la synthèse)

- [ ] **Step 1 : Chapitre 7 — « Le marché obligataire en pratique »** (ordre 7). Sections :
  1. *Le repo* — mécanique de la pension livrée (schéma SVG statique simple : titres ⇄ cash), haircut, GC vs spécial, rôle vital (financement des desks, transmission monétaire), exemple chiffré d'un repo au jour le jour.
  2. *La dette souveraine en pratique* — AFT et adjudications, ordres de grandeur début 2026 (dette française ≈ 3 300 Md€, OAT 10 ans ~3-3,5 %), qui détient la dette.
  3. *Les spreads souverains* — OAT-Bund, BTP-Bund : lecture politique et crédit, niveaux historiques marquants (2011-2012).
  4. *Souverain vs corporate* — notion de spread de crédit (teaser module 5), IG vs HY en deux phrases.
  5. *Divers de marché* — stripping (OAT démembrées), green bonds souveraines (teaser module 12).
  - `<GoFurther>` : repo et levier — comment LTCM s'est construit (teaser module 11), le repo squeeze de septembre 2019 US.
  - `<Checkpoint id="m4-ch7">`.
- [ ] **Step 2 : `synthese.mdx`** — une page : tableau des formules clés (rendu KaTeX), règles mnémotechniques (prix↔taux, coupon↑⇒D↓…), ordres de grandeur à connaître par cœur, les 5 pièges classiques du module.
- [ ] **Step 3 : `formules.ts`** — 18 formules : VA/VF, simple vs composé, taux effectif, intérêt monétaire E/360, prix obligation, prix ZC, coupon couru, rendement courant, équation YTM, bootstrap ZC, forward, $D_{Mac}$, $D_{mod}$, ΔP par duration, convexité (formule + correction), DV01, duration de portefeuille, ratio de couverture. Chacune : `nom`, `latex`, `commentaire` (quand l'utiliser).
- [ ] **Step 4 : Glossaire module 4** — ≥ 25 entrées dans `glossary.ts` avec `moduleId: '04-taux-obligations'` : obligation, coupon, nominal, maturité, OAT, Bund, Treasury, BTF, FRN, zéro-coupon, OATi, YTM (*yield to maturity*), rendement courant, prix propre (*clean price*), prix sale (*dirty price*), coupon couru, courbe des taux, inversion de courbe, 2s10s, bootstrapping, taux forward, duration, duration modifiée, convexité, DV01, immunisation, repo, haircut, GC/spécial, adjudication, syndication, €STR, Euribor, base Exact/360, spread souverain. Champ `en` rempli quand le terme anglais diffère.
- [ ] **Step 5 : Vérifier** rendu synthèse + glossaire et formulaire peuplés dans l'app. Typecheck + tests. **Step 6 : Commit** — `feat(m4): chapitre 7, synthèse, glossaire, formulaire`.

---

### Task B7 : Générateurs d'application (13)

**Files:** Modify: `exercises.ts` ; Create: `exercises.test.ts`

- [ ] **Step 1 : Implémenter les 2 modèles ci-dessous tels quels** (ils fixent le standard de qualité des étapes) :

```ts
import { mulberry32, pick, randFloat, randInt } from '../../../engine/rng';
import { formatNombre as fn } from '../../../engine/answers';
import type { ExerciseGenerator } from '../../../engine/types';
import { durationMacaulay, prixObligation, va } from './calculs';

const M4 = '04-taux-obligations';

export const genPrixObligation: ExerciseGenerator = {
  id: 'm4-app-prix-obligation', moduleId: M4,
  titre: "Prix d'une obligation à coupon annuel", difficulte: 1,
  generate(seed) {
    const rng = mulberry32(seed);
    const nominal = pick(rng, [100, 1000] as const);
    const coupon = randFloat(rng, 1, 6, 2);
    let taux = randFloat(rng, 0.5, 7, 2);
    if (Math.abs(taux - coupon) < 0.3) taux = Math.round((taux + 0.7) * 100) / 100;
    const n = randInt(rng, 2, 8);
    const c = (nominal * coupon) / 100;
    const prix = prixObligation(nominal, coupon, n, taux);
    const lignes = Array.from({ length: n }, (_, i) => {
      const t = i + 1; const flux = t < n ? c : c + nominal;
      return `- Année ${t} : flux de ${fn(flux)} € → ${fn(flux)} / (1 + ${fn(taux)} %)^${t} = ${fn(va(flux, taux, t))} €`;
    });
    return {
      enonce: `Une obligation de nominal ${fn(nominal)} €, coupon annuel de ${fn(coupon)} %, arrive à maturité dans ${n} ans (prochain coupon dans un an exactement). Le taux de marché pour cette maturité et cette qualité de crédit est de ${fn(taux)} %.\n\n**Quel est le prix de cette obligation, en euros ?**`,
      reponse: Math.round(prix * 100) / 100, tolerance: 0.002, unite: '€',
      etapes: [
        { titre: 'Identifier les flux', contenu: `L'obligation verse un coupon de ${fn(nominal)} × ${fn(coupon)} % = **${fn(c)} €** chaque année pendant ${n} ans, plus le remboursement du nominal (${fn(nominal)} €) la dernière année. Le flux de l'année ${n} est donc ${fn(c)} + ${fn(nominal)} = **${fn(c + nominal)} €**.` },
        { titre: 'Actualiser chaque flux', contenu: `Chaque flux est divisé par $(1+r)^t$ avec $r = ${fn(taux)}\\,\\%$ :\n${lignes.join('\n')}` },
        { titre: 'Sommer', contenu: `Le prix est la somme des valeurs actuelles : $P = ${fn(Math.round(prix * 100) / 100)}$ €. ${prix > nominal ? `Le titre cote **au-dessus du pair** : son coupon (${fn(coupon)} %) est supérieur au taux de marché (${fn(taux)} %).` : `Le titre cote **sous le pair** : son coupon (${fn(coupon)} %) est inférieur au taux de marché (${fn(taux)} %).`}` },
      ],
      pieges: [`Ne pas oublier le remboursement du nominal dans le flux de l'année ${n} — l'erreur classique donne un prix d'environ ${fn(Math.round((prix - va(nominal, taux, n)) * 100) / 100)} €.`],
    };
  },
};

export const genDurationMacaulay: ExerciseGenerator = {
  id: 'm4-app-duration-macaulay', moduleId: M4,
  titre: 'Duration de Macaulay', difficulte: 2,
  generate(seed) {
    const rng = mulberry32(seed);
    const nominal = 1000;
    const coupon = randFloat(rng, 2, 6, 1);
    const taux = randFloat(rng, 1, 6, 1);
    const n = randInt(rng, 2, 5);
    const prix = prixObligation(nominal, coupon, n, taux);
    const d = durationMacaulay(nominal, coupon, n, taux);
    const c = (nominal * coupon) / 100;
    const lignes = Array.from({ length: n }, (_, i) => {
      const t = i + 1; const flux = t < n ? c : c + nominal;
      return `- t = ${t} : VA = ${fn(va(flux, taux, t))} € → pondération ${t} × ${fn(va(flux, taux, t))} = ${fn(t * va(flux, taux, t))}`;
    });
    return {
      enonce: `Obligation : nominal ${fn(nominal)} €, coupon annuel ${fn(coupon, 1)} %, maturité ${n} ans, taux de marché ${fn(taux, 1)} %.\n\n**Calculez sa duration de Macaulay (en années).**`,
      reponse: Math.round(d * 100) / 100, tolerance: 0.01, unite: 'années',
      etapes: [
        { titre: 'Calculer le prix', contenu: `Somme des flux actualisés : $P = ${fn(prix)}$ € (coupon ${fn(c)} €/an, dernier flux ${fn(c + nominal)} €).` },
        { titre: 'Pondérer chaque flux par sa date', contenu: `${lignes.join('\n')}\n\nSomme des flux pondérés : **${fn(d * prix)}**.` },
        { titre: 'Diviser par le prix', contenu: `$D_{Mac} = ${fn(d * prix)} / ${fn(prix)} = **${fn(Math.round(d * 100) / 100)}$ années**. C'est le « centre de gravité » temporel des flux : plus le coupon est élevé, plus il est proche, plus la duration est courte.` },
      ],
      pieges: ['Confondre duration de Macaulay (en années) et duration modifiée (sensibilité) : la modifiée s\'obtient en divisant par (1 + y).'],
    };
  },
};
```

- [ ] **Step 2 : Implémenter les 11 autres générateurs** sur le même standard (énoncé contextualisé, 3 étapes minimum, pièges chiffrés quand pertinent), tous via `calculs.ts` :

| id | Titre | N | Tirages | Réponse (via calculs.ts) |
|---|---|---|---|---|
| `m4-app-simple-compose` | Intérêts simples vs composés | 1 | capital 10-500 k€, taux 1-5 %, 2-6 ans | écart VF composé − VF simple ; piège = confondre |
| `m4-app-monetaire-360` | Intérêt d'un placement monétaire | 1 | 0,5-10 M€, 2-4,5 %, 30/60/90/180 j | `interetMonetaire` ; piège = base 365 |
| `m4-app-prix-zc` | Prix d'un zéro-coupon | 1 | nominal 1000, taux 1-5 %, 2-15 ans | `prixZeroCoupon` |
| `m4-app-taux-effectif` | Taux effectif annuel | 2 | nominal 2-8 %, composition 2/4/12 fois | $(1+r/m)^m-1$ (ajouter `tauxEffectif` à calculs.ts + test : 4 % semestriel → 4,04 %) |
| `m4-app-coupon-couru` | Coupon couru et prix sale | 2 | coupon 2-6 %, 30-330 j, prix propre 92-108 % | `couponCouru` + prix sale = propre + couru |
| `m4-app-rendement-courant` | Rendement courant | 1 | coupon 2-6 %, prix 88-112 % | coupon/prix ; piège = ≠ YTM |
| `m4-app-ytm-2ans` | YTM d'une obligation 2 ans | 3 | prix 94-106 %, coupon 2-5 % | résolution exacte (quadratique en $(1+y)$ — ajouter `ytm2Ans` à calculs.ts + test croisé : `prixObligation(1000, c, 2, ytm) ≈ prix`) |
| `m4-app-duration-modifiee` | Duration modifiée et ΔP | 2 | obligation tirée + choc ±25/50/75/100 pb | $\Delta P = -D_{mod}\,\Delta y\,P$ |
| `m4-app-convexite` | Correction de convexité | 3 | obligation tirée + choc ±150-300 pb | écart entre estimation duration seule et duration+convexité |
| `m4-app-forward` | Taux forward implicite | 2 | $z_1, z_2$ 1-5 %, maturités 1-2/2-3/1-3 | `tauxForward` ; piège = moyenne arithmétique |
| `m4-app-repo` | Coût d'un repo | 2 | position 5-50 M€, taux repo 1,5-4 %, 1-30 j, haircut 1-5 % | intérêt sur cash prêté (position × (1−haircut)) |

- [ ] **Step 3 : Tests d'invariants** (`exercises.test.ts`) — pour CHAQUE générateur du module :

```ts
import { describe, expect, it } from 'vitest';
import { exercices } from './exercises';

describe('générateurs module 4 — invariants', () => {
  for (const g of exercices) {
    describe(g.id, () => {
      it('produit des exercices valides et variés', () => {
        const reponses = new Set<number>();
        for (const seed of [1, 2, 3, 4, 5]) {
          const ex = g.generate(seed);
          expect(Number.isFinite(ex.reponse)).toBe(true);
          expect(ex.etapes.length).toBeGreaterThanOrEqual(2);
          expect(ex.enonce).not.toMatch(/undefined|NaN|null/);
          for (const e of ex.etapes) expect(e.contenu).not.toMatch(/undefined|NaN/);
          reponses.add(ex.reponse);
        }
        expect(reponses.size).toBeGreaterThanOrEqual(3); // ça varie vraiment
        expect(g.generate(7)).toEqual(g.generate(7));    // déterminisme
      });
    });
  }
  it('le module expose au moins 13 générateurs', () => {
    expect(exercices.length).toBeGreaterThanOrEqual(13);
  });
});
```

- [ ] **Step 4 : Run** — PASS. Jouer 3 exercices en dev (rendu Markdown/KaTeX des étapes propre). **Step 5 : Commit** — `feat(m4): 13 générateurs d'exercices d'application`.

---

### Task B8 : Moules de problèmes — lot 1 (8 moules)

**Files:** Modify: `problems.ts` ; Create: `problems.test.ts`

- [ ] **Step 1 : Implémenter le modèle ci-dessous tel quel** (standard de qualité des problèmes) :

`m4-pb-analyse-ligne` — typeDeCas « analyse d'une ligne obligataire », N2, scénarios : `['Gérant assurantiel (passif long)', 'Desk trading souverain', 'Trésorier d\'entreprise']`. Le contexte plante le décor selon le scénario (qui détient le titre et pourquoi la question se pose), tire une obligation (nominal 1 000 €, coupon 1,5-6 %, maturité 3-10 ans, taux 1-6 %) et enchaîne :
  a) **Prix** (formule complète, étapes type `genPrixObligation`) ;
  b) **Duration de Macaulay** (étapes type `genDurationMacaulay`) ;
  c) **Duration modifiée** ($D_{Mac}/(1+y)$) ;
  d) **Impact d'une hausse de 50 pb** ($\Delta P \approx -D_{mod} \times 0{,}005 \times P$, signe et interprétation selon le scénario : l'assureur s'inquiète, le desk se couvre, le trésorier arbitre).
Chaque sous-question : `intitule` court (« a) Le prix »), corrigé complet, tolérance 0,5 %.

- [ ] **Step 2 : Implémenter les 7 autres moules du lot 1** (sous-questions chaînées, scénarios × 3 en moyenne, corrigés étape par étape via `calculs.ts`) :

| id | Type de cas | N | Scénarios (résumé) | Sous-questions (réponses numériques) |
|---|---|---|---|---|
| `m4-pb-coupon-couru-transaction` | achat en cours de coupon | 2 | particulier / desk / back-office qui vérifie | a) coupon couru b) prix sale c) montant réglé pour Q titres |
| `m4-pb-comparaison-deux-obligations` | choix d'investissement | 2 | gérant prudent / pari directionnel / comité d'investissement | a) prix oblig. A b) prix oblig. B c) duration A d) duration B → laquelle si baisse des taux anticipée (QCM numérique : ΔP de la gagnante) |
| `m4-pb-zc-vs-coupon` | sensibilité comparée | 2 | épargne long terme / desk / ALM | a) prix ZC b) prix couponnée même maturité c) durations des deux d) ΔP des deux pour +100 pb |
| `m4-pb-nouvelle-emission` | primaire | 2 | syndication corporate / adjudication / origination | a) prix de l'émission au taux de marché b) coupon pour émettre au pair c) prix si le marché exige +30 pb de prime |
| `m4-pb-bootstrap-courbe` | construction de courbe | 3 | desk dérivés qui a besoin de ZC / contrôle des risques / pricing interne | a) ZC 1 an (depuis un BTF) b) ZC 2 ans (bootstrap depuis une couponnée 2 ans) c) forward 1a-2a |
| `m4-pb-frn-vs-fixe` | anticipation de taux | 3 | trésorier emprunteur / investisseur / ALM banque | a) coupon FRN au fixing actuel b) intérêts annuels des deux instruments c) point mort de hausse de l'Euribor qui égalise les deux |
| `m4-pb-spread-souverain` | analyse de spread | 2 | analyste / gérant / journaliste à briefer | a) spread OAT-Bund en pb b) prix de l'OAT si le spread s'écarte de X pb (Bund inchangé) c) perte sur une position de Y M€ |

- [ ] **Step 3 : Tests d'invariants** (`problems.test.ts`) — même esprit que B7 : pour chaque moule × chaque scénario × seeds [1, 2, 3] : 3 ≤ sousQuestions ≤ 6, réponses finies, étapes ≥ 2 par sous-question, contexte sans `undefined/NaN`, déterminisme, variation des réponses entre seeds. Run : PASS.
- [ ] **Step 4 : Commit** — `feat(m4): 8 moules de problèmes (lot 1)`.

---

### Task B9 : Moules de problèmes — lot 2 (8 moules, dont les « boss »)

**Files:** Modify: `problems.ts`, `problems.test.ts`

- [ ] **Step 1 : Implémenter les 8 moules :**

| id | Type de cas | N | Scénarios | Sous-questions |
|---|---|---|---|---|
| `m4-pb-portefeuille-duration` | gestion de portefeuille | 3 | fonds obligataire / assureur / mandat | a-b) prix des 2-3 lignes c) duration du portefeuille (pondérée) d) ΔP du portefeuille pour +75 pb e) quelle ligne vendre pour réduire la duration d'un montant cible |
| `m4-pb-couverture-futures` | couverture | 3 | desk / gérant avant la BCE / corporate | a) DV01 du portefeuille b) DV01 du contrat future (donné via son notionnel et sa duration) c) nombre de contrats à vendre d) P&L net si +40 pb (couverture imparfaite chiffrée) |
| `m4-pb-ytm-realise` | rendement réalisé | 3 | investisseur à terme / audit de perf / formation client | a) prix d'achat b) valeur acquise des coupons réinvestis à un taux différent c) rendement annualisé réalisé d) écart vs YTM initial (le piège du réinvestissement, chiffré) |
| `m4-pb-obligation-indexee` | inflation | 3 | OATi / épargnant vs livret / gérant réel | a) coupon réel versé (nominal indexé) b) nominal remboursé après n années d'inflation c) point mort d'inflation (breakeven) vs nominale |
| `m4-pb-repo-financement` | financement | 3 | desk levier / trésorerie titres / prime broker | a) cash levé (haircut) b) coût du repo sur la période c) carry net de la position (coupon couru gagné − coût repo) d) seuil de taux repo qui annule le carry |
| `m4-pb-immunisation` | **boss** — immunisation | 4 | assureur avec passif à 7 ans / fonds de pension / mandat dédié | a) valeur actuelle du passif b) duration du passif (ZC) c) poids des 2 obligations (système 2×2 : VA et duration matchées) d) vérification : ΔP actif vs passif pour ±100 pb |
| `m4-pb-strategie-courbe` | **boss** — trade de courbe | 4 | hedge fund steepener / desk prop / club d'investissement averti | a) durations des 2 pattes (2 ans, 10 ans) b) tailles pour être duration-neutre c) P&L si pentification de X pb (long 2a gagne, short 10a gagne) d) P&L si translation parallèle (≈ 0, c'est le but — le démontrer chiffré) |
| `m4-pb-convexite-gros-choc` | **boss** — limites de la duration | 4 | risk manager après −250 pb / stress test / post-mortem 2022 | a) prix initial b) prix estimé duration seule c) prix estimé duration+convexité d) prix exact recalculé e) hiérarchie des erreurs (l'estimation s'améliore, chiffré) |

- [ ] **Step 2 : Vérifier la cible « ~50 énoncés »** — ajouter au test : `problemes.reduce((a, p) => a + p.scenarios.length, 0) >= 45` et `problemes.filter(p => p.difficulte === 4).length >= 3`. Run : PASS.
- [ ] **Step 3 : Jouer en dev** un problème de chaque niveau, dont un boss complet (corrigés lisibles, sous-questions cohérentes entre elles : les valeurs s'enchaînent).
- [ ] **Step 4 : Commit** — `feat(m4): 8 moules de problèmes (lot 2, dont 3 boss N4)`.

---

### Task B10 : Banque QCM (60 questions)

**Files:** Modify: `qcm.ts` ; Create: `qcm.test.ts`

- [ ] **Step 1 : Quotas par thème** (60 au total, niveaux mélangés ~ 15 N1 / 25 N2 / 15 N3 / 5 N4) : conventions & monétaire 8 · anatomie & types d'obligations 8 · pricing & coupon couru 10 · rendements 8 · courbe & forwards 10 · duration & convexité 10 · repo & marché en pratique 6.
- [ ] **Step 2 : Standard de qualité** — 4 options plausibles ; pour les questions numériques, distracteurs = erreurs types RECALCULÉES (oubli du nominal, mauvaise base, confusion Macaulay/modifiée…) ; `explications[i]` rédigée pour CHAQUE option (la bonne : pourquoi ; chaque piège : quelle erreur y mène). Exemple du standard :

```ts
{
  id: 'm4-qcm-031', moduleId: M4, theme: 'duration & convexité', difficulte: 2,
  question: 'Une obligation a une duration modifiée de 4,2 et cote 980 €. Les taux montent de 25 pb. Variation de prix approximative ?',
  options: ['−10,29 €', '+10,29 €', '−41,16 €', '−2,45 €'],
  bonneReponse: 0,
  explications: [
    'ΔP ≈ −D_mod × Δy × P = −4,2 × 0,0025 × 980 = −10,29 €. Hausse des taux ⇒ baisse du prix.',
    'Le signe est faux : quand les taux montent, le prix baisse — c\'est la relation inverse fondamentale.',
    'Erreur classique : Δy pris à 1 % (100 pb) au lieu de 25 pb.',
    'Erreur classique : duration appliquée au nominal divisé… ce montant ne correspond à aucun calcul correct — vérifiez la formule ΔP = −D_mod × Δy × P.',
  ],
}
```

- [ ] **Step 3 : Rédiger les 60 questions** (2 sous-lots de 30, commit après chacun). Couvrir explicitement les pièges des 7 chapitres et les questions « culture » (pourquoi le marché obligataire est plus gros que les actions, qui fixe l'Euribor, ce que signifie une adjudication mal couverte…).
- [ ] **Step 4 : Tests** (`qcm.test.ts`) — ≥ 60 questions ; ids uniques ; chaque question : 4 options, `bonneReponse` ∈ [0,3], 4 explications non vides ; chaque thème du quota ≥ son minimum ; au moins 4 questions N4. Run : PASS.
- [ ] **Step 5 : Commit final** — `feat(m4): banque de 60 QCM avec explications par option`.

---

### Task B11 : Questions jury (25)

**Files:** Modify: `jury.ts` ; Create: `jury.test.ts`

- [ ] **Step 1 : Les 25 questions à rédiger** (thème · niveau) :
  1. Pourquoi le prix d'une obligation baisse-t-il quand les taux montent ? (pricing · N1)
  2. Expliquez la duration à quelqu'un qui n'a jamais fait de finance. (duration · N2)
  3. Différence entre duration de Macaulay, duration modifiée et DV01 ? (duration · N2)
  4. Que nous dit une courbe des taux inversée ? Est-ce un signal fiable ? (courbe · N2)
  5. Pourquoi une obligation à faible coupon est-elle plus sensible aux taux ? (duration · N2)
  6. Qu'est-ce que le repo et pourquoi est-il vital pour les marchés ? (repo · N2)
  7. Comment couvririez-vous un portefeuille obligataire contre une hausse des taux ? (couverture · N3)
  8. Qu'est-ce que le bootstrapping et pourquoi en a-t-on besoin ? (courbe · N3)
  9. Parlez-moi du spread OAT-Bund. Que reflète-t-il ? (spreads · N2)
  10. Le QE de la banque centrale : quel effet sur la courbe des taux ? (courbe/macro · N3)
  11. YTM : définition, hypothèses, limites. (rendement · N2)
  12. Prix propre vs prix sale : pourquoi cette distinction ? (pricing · N1)
  13. Qu'est-ce que la convexité et pourquoi dit-on que c'est une qualité ? (convexité · N3)
  14. Adjudication vs syndication : différences et quand utilise-t-on chacune ? (primaire · N2)
  15. Pourquoi le marché obligataire est-il plus gros que le marché actions ? (culture · N1)
  16. Une entreprise hésite entre émettre à taux fixe ou variable. Que lui dites-vous ? (FRN · N3)
  17. Qu'est-ce qu'une OATi et quand est-elle intéressante ? (inflation · N2)
  18. Expliquez le taux forward. Le forward est-il une prévision ? (courbe · N3)
  19. Qu'est-ce que l'immunisation d'un portefeuille ? (gestion · N3)
  20. La hiérarchie des créanciers : où se situent les obligations ? (crédit · N2)
  21. Que s'est-il passé sur les marchés de taux en 2022 et pourquoi est-ce historique ? (culture · N3)
  22. Qu'est-ce que le 2s10s et comment le tradez-vous ? (courbe · N4)
  23. Le repo squeeze de septembre 2019 aux États-Unis : que s'est-il passé ? (repo · N4)
  24. On vous donne 10 M€ à placer en obligations avec une vue de baisse des taux. Votre stratégie ? (synthèse · N4)
  25. Convainquez-moi en 60 secondes que la duration de mon fonds est trop élevée. (jeu de rôle · N4)
- [ ] **Step 2 : Standard de rédaction** — `plan` : 3-4 points numérotés (la structure d'une réponse d'oral) ; `pointsAttendus` : 4-6 éléments précis et cochables ; `bonus` : 1-3 éléments qui marquent (chiffre de marché, anecdote historique, formule citée de tête) ; `reponseModele` : 150-300 mots rédigés, parlables en ~2 min, ton oral propre.
- [ ] **Step 3 : Tests** (`jury.test.ts`) — ≥ 25 ; ids uniques ; chaque question a plan ≥ 3, pointsAttendus ≥ 4, reponseModele ≥ 400 caractères ; ≥ 4 questions N4. Run : PASS.
- [ ] **Step 4 : Commit** — `feat(m4): 25 questions jury avec réponses modèles structurées`.

---

### Task B12 : Flashcards (80)

**Files:** Modify: `flashcards.ts` ; Create: `flashcards.test.ts`

- [ ] **Step 1 : Quotas** — définitions 30 · formules 20 · ordres de grandeur 12 · pièges & réflexes 18. Tags parmi : `definition`, `formule`, `ordre-de-grandeur`, `piege`, + thème (`duration`, `courbe`…).
- [ ] **Step 2 : Standard** — recto : question courte et précise ; verso : réponse en ≤ 3 lignes + mini-exemple chiffré quand utile. Exemples du standard :
  - recto « Formule de la variation de prix par la duration ? » / verso « $\Delta P \approx -D_{mod} \times \Delta y \times P$. Ex. : $D_{mod}$ 5, +100 pb, 1 000 € → −50 €. » (tags : formule, duration)
  - recto « Un BTF, c'est quoi ? » / verso « Bon du Trésor français à taux fixe < 1 an, zéro-coupon, émis par adjudication (base Exact/360). » (tags : definition)
  - recto « Coupon ↑ ⇒ duration ? » / verso « Duration ↓ : les flux sont rapatriés plus tôt, le barycentre temporel se rapproche. » (tags : piege, duration)
- [ ] **Step 3 : Rédiger les 80 cartes** (couvrir les 7 chapitres ; chaque formule du formulaire a sa carte).
- [ ] **Step 4 : Tests** (`flashcards.test.ts`) — ≥ 80 ; ids uniques ; recto ≤ 200 caractères ; verso non vide ; chaque quota respecté (compter par tag). Run : PASS.
- [ ] **Step 5 : Commit** — `feat(m4): 80 flashcards taguées`.

---

### Task B13 : Vérification finale du module pilote

**Files:** Create: `src/content/modules/04-taux-obligations/module.test.ts`

- [ ] **Step 1 : Test de complétude**

```ts
import { describe, expect, it } from 'vitest';
import { getModule } from '../../../engine/registry';

describe('module 4 — cibles de la spec', () => {
  const m = getModule('04-taux-obligations')!;
  it('est complet', () => {
    expect(m.chapitres.length).toBe(7);
    expect(m.exercices.length).toBeGreaterThanOrEqual(13);
    expect(m.problemes.length).toBeGreaterThanOrEqual(16);
    expect(m.problemes.reduce((a, p) => a + p.scenarios.length, 0)).toBeGreaterThanOrEqual(45);
    expect(m.qcm.length).toBeGreaterThanOrEqual(60);
    expect(m.jury.length).toBeGreaterThanOrEqual(25);
    expect(m.flashcards.length).toBeGreaterThanOrEqual(80);
    expect(m.formules.length).toBeGreaterThanOrEqual(18);
  });
  it('couvre les 4 niveaux de difficulté en problèmes', () => {
    for (const n of [1, 2, 3, 4]) {
      expect([...m.exercices, ...m.problemes].some(x => x.difficulte === n)).toBe(true);
    }
  });
});
```

- [ ] **Step 2 : Run** `npx vitest run` (TOUT le projet) — Expected: PASS intégral. `npm run typecheck` : 0 erreur. `npm run build` : succès.
- [ ] **Step 3 : Revue d'usage complète en dev** — lire le chapitre 6 de bout en bout (qualité de la prose, formules, interactif), faire le Parcours du module jusqu'à un boss, une session QCM 10, une question jury complète, 10 flashcards, un examen blanc entier, un export/import. Corriger ce qui accroche.
- [ ] **Step 4 : Vérification PWA mobile** — `npm run preview`, DevTools mobile 360 px : chapitres lisibles, interactifs manipulables au doigt, runners utilisables.
- [ ] **Step 5 : Commit + tag** — `feat: module pilote Taux & obligations complet (phase 1 terminée)` puis `git tag v0.2-phase1`.
- [ ] **Step 6 : Annoncer à l'utilisateur** que la phase 1 est prête, avec le bilan chiffré et la marche à suivre pour l'installer sur son téléphone (Task 20 du plan 1A si pas encore faite).
