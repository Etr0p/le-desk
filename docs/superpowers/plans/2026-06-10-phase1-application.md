# Le Desk — Plan Phase 1A : l'application

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construire l'application Le Desk complète (design system, 5 espaces, 4 moteurs d'entraînement, examen blanc, sauvegarde/export, PWA hors ligne) prête à recevoir le contenu des modules.

**Architecture:** SPA statique React + TypeScript (Vite), contenu séparé du moteur via un registre de modules typé. Moteurs purs (RNG seedé, SRS, QCM, examen) testés en TDD avec Vitest. Aucune requête réseau au runtime, état dans localStorage avec export/import JSON.

**Tech Stack:** Vite, React 18+, TypeScript, Tailwind CSS v4, MDX (@mdx-js/rollup + remark-math + rehype-katex), KaTeX, react-router-dom (HashRouter), vite-plugin-pwa, Vitest.

**Référence:** spec validée `docs/superpowers/specs/2026-06-10-le-desk-design.md`.

---

## Conventions globales (s'appliquent à toutes les tâches)

- **Langue** : UI et contenu en français, registre professionnel neutre. Nombres au format français dans l'UI (virgule décimale — la saisie accepte virgule ET point). Jargon anglais de salle conservé (« sell-side », « bid/ask »…).
- **TDD pour tout code de calcul** (`src/engine/`, `calculs.ts` des modules) : test d'abord, rouge, implémentation, vert, commit. Les composants UI sont vérifiés par typecheck + `npm run dev` + contrôle visuel.
- **Commits** : un par tâche minimum, messages en français, format `feat: …` / `test: …` / `chore: …`.
- **Identité git** : utiliser `git -c user.name="Fred" -c user.email="dracalp258@gmail.com" commit …` (pas de config globale sur la machine).
- **Commandes** : exécuter depuis `C:\tout\cours\M2\le-desk`. Tests : `npx vitest run` (tout) ou `npx vitest run <fichier>`.
- **Interdits** : appel réseau au runtime, dépendance IA, librairie de charts (SVG maison uniquement), contenu sans corrigé.

## Structure de fichiers cible

```
le-desk/
├── index.html, package.json, vite.config.ts, tsconfig.json
├── public/            icon.svg, icônes PWA générées
└── src/
    ├── main.tsx, App.tsx, index.css
    ├── engine/        rng.ts, types.ts, answers.ts, srs.ts, storage.ts,
    │                  quiz.ts, examen.ts, stats.ts, registry.ts
    ├── components/    ui/ (design system), Math.tsx, charts/ (SVG)
    ├── pages/         Dashboard.tsx, Cours.tsx, Module.tsx, Chapitre.tsx,
    │                  Entrainement.tsx, RunnerExercices.tsx, RunnerQcm.tsx,
    │                  RunnerJury.tsx, RunnerFlashcards.tsx, ExamenBlanc.tsx,
    │                  Glossaire.tsx, Reglages.tsx
    └── content/
        ├── glossary.ts
        └── modules/04-taux-obligations/   (squelette ici, contenu = plan 1B)
            meta.ts, chapters.ts, chapters/*.mdx, calculs.ts,
            exercises.ts, problems.ts, qcm.ts, jury.ts, flashcards.ts, formules.ts
```

---

### Task 1 : Scaffold du projet

**Files:** Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/mdx.d.ts`, `.gitignore`

- [ ] **Step 1 : Vérifier Node** — Run: `node --version`. Expected: v20+. Si absent : STOP, signaler à l'utilisateur.
- [ ] **Step 2 : Écrire `package.json`**

```json
{
  "name": "le-desk",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "typecheck": "tsc -b --noEmit"
  }
}
```

- [ ] **Step 3 : Installer les dépendances**

```powershell
npm install react react-dom react-router-dom katex
npm install -D typescript vite @vitejs/plugin-react @types/react @types/react-dom `
  tailwindcss @tailwindcss/vite @mdx-js/rollup @mdx-js/react @types/mdx `
  remark-math rehype-katex vite-plugin-pwa vitest
```

- [ ] **Step 4 : Écrire `vite.config.ts`**

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@mdx-js/rollup';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    { enforce: 'pre', ...mdx({ remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex], providerImportSource: '@mdx-js/react' }) },
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Le Desk — Finance de marché',
        short_name: 'Le Desk',
        description: 'Cours complet de finance de marché, exercices paramétrés, hors ligne.',
        theme_color: '#0c1118',
        background_color: '#0c1118',
        display: 'standalone',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
});
```

- [ ] **Step 5 : Écrire `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022", "module": "ESNext", "moduleResolution": "bundler",
    "jsx": "react-jsx", "strict": true, "skipLibCheck": true,
    "noEmit": true, "isolatedModules": true, "resolveJsonModule": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"], "types": ["vite/client"]
  },
  "include": ["src", "vite.config.ts"]
}
```

- [ ] **Step 6 : Écrire `index.html`** (racine) — `<html lang="fr">`, `<title>Le Desk</title>`, `<meta name="viewport" content="width=device-width, initial-scale=1">`, `<div id="root"></div>`, `<script type="module" src="/src/main.tsx"></script>`.
- [ ] **Step 7 : Écrire `src/index.css`** — `@import "tailwindcss";` + `@import "katex/dist/katex.min.css";` (les tokens viendront en Task 10).
- [ ] **Step 8 : Écrire `src/main.tsx`** (StrictMode + createRoot + import index.css), `src/App.tsx` (provisoire : `<h1>Le Desk</h1>`), `src/mdx.d.ts` :

```ts
declare module '*.mdx' {
  import type { ComponentType } from 'react';
  export const meta: { id: string; titre: string; ordre: number };
  const MDXComponent: ComponentType<Record<string, unknown>>;
  export default MDXComponent;
}
```

- [ ] **Step 9 : `.gitignore`** — `node_modules/`, `dist/`, `dev-dist/`, `*.local`.
- [ ] **Step 10 : Vérifier** — Run: `npm run typecheck` (Expected: 0 erreur) puis `npm run dev` (Expected: page « Le Desk » sur localhost). Arrêter le serveur.
- [ ] **Step 11 : Commit** — `git add -A` puis commit `chore: scaffold Vite + React + TS + Tailwind + MDX + PWA`.

---

### Task 2 : PRNG seedé (TDD)

**Files:** Create: `src/engine/rng.ts`, `src/engine/rng.test.ts`

- [ ] **Step 1 : Écrire les tests** (`src/engine/rng.test.ts`)

```ts
import { describe, expect, it } from 'vitest';
import { mulberry32, randInt, randFloat, pick, shuffle } from './rng';

describe('mulberry32', () => {
  it('est déterministe : même seed, même séquence', () => {
    const a = mulberry32(42), b = mulberry32(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });
  it('produit des séquences différentes pour des seeds différents', () => {
    expect(mulberry32(1)()).not.toBe(mulberry32(2)());
  });
  it('reste dans [0, 1)', () => {
    const r = mulberry32(7);
    for (let i = 0; i < 1000; i++) { const v = r(); expect(v).toBeGreaterThanOrEqual(0); expect(v).toBeLessThan(1); }
  });
});
describe('helpers', () => {
  it('randInt couvre les bornes incluses', () => {
    const r = mulberry32(3); const vus = new Set<number>();
    for (let i = 0; i < 500; i++) vus.add(randInt(r, 2, 5));
    expect([...vus].sort()).toEqual([2, 3, 4, 5]);
  });
  it('randFloat respecte bornes et décimales', () => {
    const r = mulberry32(9);
    for (let i = 0; i < 200; i++) {
      const v = randFloat(r, 1, 6, 2);
      expect(v).toBeGreaterThanOrEqual(1); expect(v).toBeLessThanOrEqual(6);
      expect(Math.round(v * 100) / 100).toBe(v);
    }
  });
  it('shuffle est une permutation déterministe', () => {
    const r = mulberry32(5);
    const s = shuffle(r, [1, 2, 3, 4, 5]);
    expect([...s].sort()).toEqual([1, 2, 3, 4, 5]);
    expect(shuffle(mulberry32(5), [1, 2, 3, 4, 5])).toEqual(s);
  });
  it('pick choisit dans la liste', () => {
    expect(['a', 'b']).toContain(pick(mulberry32(1), ['a', 'b']));
  });
});
```

- [ ] **Step 2 : Vérifier l'échec** — Run: `npx vitest run src/engine/rng.test.ts`. Expected: FAIL (module inexistant).
- [ ] **Step 3 : Implémenter `src/engine/rng.ts`**

```ts
export type Rng = () => number;

export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function randInt(rng: Rng, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}
export function randFloat(rng: Rng, min: number, max: number, decimales = 2): number {
  const f = 10 ** decimales;
  return Math.round((rng() * (max - min) + min) * f) / f;
}
export function pick<T>(rng: Rng, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)];
}
export function shuffle<T>(rng: Rng, items: readonly T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export function newSeed(): number {
  return Math.floor(Math.random() * 2 ** 31);
}
```

- [ ] **Step 4 : Vérifier le succès** — Run: `npx vitest run src/engine/rng.test.ts`. Expected: PASS (6 tests).
- [ ] **Step 5 : Commit** — `feat: PRNG seedé mulberry32 + helpers de tirage`.

---

### Task 3 : Types du domaine

**Files:** Create: `src/engine/types.ts`

- [ ] **Step 1 : Écrire `src/engine/types.ts`** (contrats exacts de la spec §5)

```ts
import type { ComponentType } from 'react';

export type Difficulte = 1 | 2 | 3 | 4;
// 1 échauffement · 2 classique · 3 avancé · 4 très difficile (« boss »)

export interface ModuleMeta {
  id: string;          // "04-taux-obligations"
  numero: number;      // 4
  titre: string;
  description: string;
  quantitatif: boolean;
}
export interface ChapitreMeta { id: string; titre: string; ordre: number; }
export interface ChapitreRef { meta: ChapitreMeta; charger: () => Promise<{ default: ComponentType<Record<string, unknown>> }>; }

export interface Etape { titre: string; contenu: string; } // markdown + KaTeX inline ($…$)

export interface GeneratedExercise {
  enonce: string;
  reponse: number;
  tolerance: number;                    // ex. 0.005 = 0,5 %
  toleranceMode?: 'relatif' | 'absolu'; // défaut : relatif
  unite?: string;                       // "€", "%", "années"…
  etapes: Etape[];                      // corrigé pas à pas, valeurs insérées
  pieges?: string[];                    // erreurs classiques explicitées
}
export interface ExerciseGenerator {
  id: string; moduleId: string; titre: string; difficulte: Difficulte;
  generate(seed: number): GeneratedExercise;
}

export interface GeneratedProblem {
  contexte: string; // mise en situation, valeurs insérées
  sousQuestions: (GeneratedExercise & { intitule: string })[]; // 3 à 6, chaînées
}
export interface ProblemGenerator {
  id: string; moduleId: string; titre: string;
  typeDeCas: string;        // taxonomie du module, ex. "couverture"
  difficulte: Difficulte;
  scenarios: string[];      // 2 à 4 variantes de contexte
  generate(seed: number, scenario: number): GeneratedProblem;
}

export interface QcmQuestion {
  id: string; moduleId: string; theme: string; difficulte: Difficulte;
  question: string;
  options: string[];        // 4 options
  bonneReponse: number;     // index dans options
  explications: string[];   // même longueur : pourquoi juste / pourquoi piège
}

export interface JuryQuestion {
  id: string; moduleId: string; theme: string; difficulte: Difficulte;
  question: string;
  plan: string[];           // structure de réponse attendue
  pointsAttendus: string[]; // ce que le jury veut entendre
  bonus?: string[];         // ce qui impressionne
  reponseModele: string;    // réponse rédigée complète (markdown + KaTeX)
}

export interface Flashcard { id: string; moduleId: string; tags: string[]; recto: string; verso: string; }
export interface GlossaireEntree { terme: string; en?: string; definition: string; moduleId?: string; }
export interface Formule { id: string; moduleId: string; nom: string; latex: string; commentaire?: string; }

export interface ModuleContenu {
  meta: ModuleMeta;
  chapitres: ChapitreRef[];
  exercices: ExerciseGenerator[];
  problemes: ProblemGenerator[];
  qcm: QcmQuestion[];
  jury: JuryQuestion[];
  flashcards: Flashcard[];
  formules: Formule[];
}
```

- [ ] **Step 2 : Vérifier** — Run: `npm run typecheck`. Expected: 0 erreur.
- [ ] **Step 3 : Commit** — `feat: types du domaine (générateurs, QCM, jury, flashcards, modules)`.

---

### Task 4 : Validation des réponses & format des nombres (TDD)

**Files:** Create: `src/engine/answers.ts`, `src/engine/answers.test.ts`

- [ ] **Step 1 : Tests** (`answers.test.ts`)

```ts
import { describe, expect, it } from 'vitest';
import { reponseCorrecte, parseSaisie, formatNombre } from './answers';

describe('reponseCorrecte', () => {
  it('accepte dans la tolérance relative', () => {
    expect(reponseCorrecte(1002, 1000, 0.005)).toBe(true);   // 0,2 %
    expect(reponseCorrecte(1006, 1000, 0.005)).toBe(false);  // 0,6 %
  });
  it('mode absolu', () => {
    expect(reponseCorrecte(3.52, 3.5, 0.05, 'absolu')).toBe(true);
    expect(reponseCorrecte(3.6, 3.5, 0.05, 'absolu')).toBe(false);
  });
  it('attendu nul → bascule en absolu', () => {
    expect(reponseCorrecte(0.001, 0, 0.01)).toBe(true);
  });
  it('rejette NaN', () => { expect(reponseCorrecte(NaN, 10, 0.1)).toBe(false); });
});
describe('parseSaisie', () => {
  it('accepte virgule française et espaces', () => {
    expect(parseSaisie(' 1 027,75 ')).toBe(1027.75);
    expect(parseSaisie('1027.75')).toBe(1027.75);
    expect(parseSaisie('-0,5')).toBe(-0.5);
  });
  it('rejette le non-numérique', () => { expect(parseSaisie('abc')).toBeNull(); });
});
describe('formatNombre', () => {
  it('format français', () => {
    expect(formatNombre(1027.75)).toBe('1 027,75');
    expect(formatNombre(2.5, 1)).toBe('2,5');
  });
});
```

- [ ] **Step 2 : Run** `npx vitest run src/engine/answers.test.ts` — Expected: FAIL.
- [ ] **Step 3 : Implémenter `answers.ts`**

```ts
export function reponseCorrecte(saisie: number, attendu: number, tolerance: number, mode: 'relatif' | 'absolu' = 'relatif'): boolean {
  if (!Number.isFinite(saisie)) return false;
  const ecart = Math.abs(saisie - attendu);
  if (mode === 'absolu' || attendu === 0) return ecart <= tolerance;
  return ecart / Math.abs(attendu) <= tolerance;
}
export function parseSaisie(brut: string): number | null {
  const n = Number(brut.trim().replace(/[\s  ]/g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}
export function formatNombre(v: number, maxDecimales = 2): string {
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: maxDecimales }).format(v);
}
```

- [ ] **Step 4 : Run** — Expected: PASS. **Step 5 : Commit** — `feat: validation des réponses (tolérance) + format fr`.

---

### Task 5 : Répétition espacée SM-2 simplifié (TDD)

**Files:** Create: `src/engine/srs.ts`, `src/engine/srs.test.ts`

- [ ] **Step 1 : Tests** (`srs.test.ts`)

```ts
import { describe, expect, it } from 'vitest';
import { nouvelleCarte, reviser, cartesDues, addJours } from './srs';

describe('srs', () => {
  const J = '2026-07-01';
  it('addJours', () => { expect(addJours('2026-07-01', 3)).toBe('2026-07-04'); });
  it('nouvelle carte due aujourd’hui', () => {
    expect(nouvelleCarte(J).echeance).toBe(J);
  });
  it('bien : 1 j puis 3 j puis ~ intervalle × ease', () => {
    let c = nouvelleCarte(J);
    c = reviser(c, 'bien', J);
    expect(c.intervalJours).toBe(1); expect(c.echeance).toBe('2026-07-02');
    c = reviser(c, 'bien', '2026-07-02');
    expect(c.intervalJours).toBe(3);
    c = reviser(c, 'bien', '2026-07-05');
    expect(c.intervalJours).toBe(Math.round(3 * 2.5)); // 8
  });
  it('encore : remise à zéro le jour même, ease baisse (plancher 1.3)', () => {
    let c = nouvelleCarte(J);
    c = reviser(c, 'bien', J); c = reviser(c, 'encore', '2026-07-02');
    expect(c.intervalJours).toBe(0); expect(c.echeance).toBe('2026-07-02');
    expect(c.repetitions).toBe(0); expect(c.ease).toBeCloseTo(2.3);
    for (let i = 0; i < 10; i++) c = reviser(c, 'encore', J);
    expect(c.ease).toBeGreaterThanOrEqual(1.3);
  });
  it('facile : ease monte (plafond 3.0), intervalle accéléré', () => {
    let c = nouvelleCarte(J);
    c = reviser(c, 'facile', J);
    expect(c.intervalJours).toBe(2); expect(c.ease).toBeCloseTo(2.65);
  });
  it('cartesDues filtre par échéance', () => {
    const etats = { a: nouvelleCarte('2026-06-30'), b: { ...nouvelleCarte(J), echeance: '2026-07-09' } };
    expect(cartesDues(etats, J)).toEqual(['a']);
  });
});
```

- [ ] **Step 2 : Run** — Expected: FAIL.
- [ ] **Step 3 : Implémenter `srs.ts`**

```ts
export type Grade = 'encore' | 'difficile' | 'bien' | 'facile';
export interface CardState { ease: number; intervalJours: number; echeance: string; repetitions: number; }

const JOUR_MS = 86_400_000;
export function addJours(dateISO: string, jours: number): string {
  return new Date(new Date(dateISO + 'T00:00:00Z').getTime() + jours * JOUR_MS).toISOString().slice(0, 10);
}
export function nouvelleCarte(aujourdHui: string): CardState {
  return { ease: 2.5, intervalJours: 0, echeance: aujourdHui, repetitions: 0 };
}
export function reviser(etat: CardState, note: Grade, aujourdHui: string): CardState {
  let { ease, intervalJours, repetitions } = etat;
  switch (note) {
    case 'encore':
      return { ease: Math.max(1.3, ease - 0.2), intervalJours: 0, echeance: aujourdHui, repetitions: 0 };
    case 'difficile':
      ease = Math.max(1.3, ease - 0.15);
      intervalJours = Math.max(1, Math.round(intervalJours * 1.2));
      break;
    case 'bien':
      intervalJours = repetitions === 0 ? 1 : repetitions === 1 ? 3 : Math.round(intervalJours * ease);
      break;
    case 'facile':
      ease = Math.min(3.0, ease + 0.15);
      intervalJours = repetitions === 0 ? 2 : Math.max(4, Math.round(intervalJours * ease * 1.3));
      break;
  }
  return { ease, intervalJours, echeance: addJours(aujourdHui, intervalJours), repetitions: repetitions + 1 };
}
export function cartesDues(etats: Record<string, CardState>, aujourdHui: string): string[] {
  return Object.entries(etats).filter(([, e]) => e.echeance <= aujourdHui).map(([id]) => id);
}
```

- [ ] **Step 4 : Run** — Expected: PASS. **Step 5 : Commit** — `feat: moteur de répétition espacée SM-2 simplifié`.

---

### Task 6 : État, sauvegarde, export/import (TDD)

**Files:** Create: `src/engine/storage.ts`, `src/engine/storage.test.ts`

- [ ] **Step 1 : Tests** (`storage.test.ts`)

```ts
import { describe, expect, it } from 'vitest';
import { etatInitial, charger, sauver, exporter, importer, toucherStreak, type StorageLike } from './storage';

function fauxBackend(): StorageLike {
  const m = new Map<string, string>();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v) };
}

describe('storage', () => {
  it('charge l’état initial si vide ou corrompu', () => {
    expect(charger(fauxBackend()).version).toBe(1);
    const b = fauxBackend(); b.setItem('le-desk-etat-v1', '{pas du json');
    expect(charger(b).version).toBe(1);
  });
  it('aller-retour sauver/charger', () => {
    const b = fauxBackend(); const e = etatInitial();
    e.chapitresLus['04/ch1'] = true; sauver(e, b);
    expect(charger(b).chapitresLus['04/ch1']).toBe(true);
  });
  it('aller-retour export/import', () => {
    const e = etatInitial(); e.streak.serie = 5;
    expect(importer(exporter(e)).streak.serie).toBe(5);
  });
  it('import rejette une sauvegarde invalide', () => {
    expect(() => importer('{"version":99}')).toThrow();
    expect(() => importer('quoi')).toThrow();
  });
  it('streak : incrémente si hier, conserve si même jour, repart sinon', () => {
    const e = etatInitial();
    toucherStreak(e, '2026-07-01'); expect(e.streak.serie).toBe(1);
    toucherStreak(e, '2026-07-01'); expect(e.streak.serie).toBe(1);
    toucherStreak(e, '2026-07-02'); expect(e.streak.serie).toBe(2);
    toucherStreak(e, '2026-07-10'); expect(e.streak.serie).toBe(1);
  });
});
```

- [ ] **Step 2 : Run** — Expected: FAIL.
- [ ] **Step 3 : Implémenter `storage.ts`**

```ts
import type { CardState } from './srs';
import { addJours } from './srs';

export interface StorageLike { getItem(k: string): string | null; setItem(k: string, v: string): void; }

export interface Tentative {
  date: string; type: 'exercice' | 'probleme' | 'qcm' | 'jury' | 'examen';
  refId: string; moduleId: string; difficulte?: number;
  reussite: number; // 0..1
}
export interface EtatApp {
  version: 1;
  cartes: Record<string, CardState>;
  cartesIntroduites: Record<string, string>; // id → date d’introduction
  chapitresLus: Record<string, true>;
  checkpointsReussis: Record<string, true>;
  tentatives: Tentative[];
  reglages: { nouvellesCartesParJour: number; theme: 'sombre' | 'clair' };
  streak: { dernierJour: string; serie: number };
  reprise?: { chemin: string; libelle: string };
}

const CLE = 'le-desk-etat-v1';

export function etatInitial(): EtatApp {
  return {
    version: 1, cartes: {}, cartesIntroduites: {}, chapitresLus: {}, checkpointsReussis: {},
    tentatives: [], reglages: { nouvellesCartesParJour: 20, theme: 'sombre' },
    streak: { dernierJour: '', serie: 0 },
  };
}
export function charger(backend: StorageLike): EtatApp {
  try {
    const brut = backend.getItem(CLE);
    if (!brut) return etatInitial();
    return valider(JSON.parse(brut));
  } catch { return etatInitial(); }
}
export function sauver(etat: EtatApp, backend: StorageLike): void {
  backend.setItem(CLE, JSON.stringify(etat));
}
export function exporter(etat: EtatApp): string { return JSON.stringify(etat, null, 2); }
export function importer(json: string): EtatApp { return valider(JSON.parse(json)); }

function valider(e: unknown): EtatApp {
  const x = e as EtatApp;
  if (!x || x.version !== 1 || typeof x.cartes !== 'object' || !Array.isArray(x.tentatives)) {
    throw new Error('Sauvegarde invalide ou version inconnue');
  }
  return { ...etatInitial(), ...x };
}
export function toucherStreak(etat: EtatApp, aujourdHui: string): void {
  const { dernierJour } = etat.streak;
  if (dernierJour === aujourdHui) return;
  etat.streak.serie = dernierJour === addJours(aujourdHui, -1) ? etat.streak.serie + 1 : 1;
  etat.streak.dernierJour = aujourdHui;
}
```

- [ ] **Step 4 : Run** — Expected: PASS.
- [ ] **Step 5 : Hook React** — Create `src/engine/useEtat.tsx` : contexte React `EtatProvider` qui charge l'état au montage (`charger(localStorage)`), expose `{ etat, modifier(fn: (e: EtatApp) => void) }` (modifier = mutation + `sauver` + re-render via useState sur un compteur ou copie). Typecheck.
- [ ] **Step 6 : Commit** — `feat: état applicatif, sauvegarde locale, export/import, streak`.

---

### Task 7 : Moteur QCM (TDD)

**Files:** Create: `src/engine/quiz.ts`, `src/engine/quiz.test.ts`

- [ ] **Step 1 : Tests** — banque factice de 30 questions (3 modules × 10, thèmes variés, `bonneReponse` connue) construite dans le test. Cas testés :

```ts
import { describe, expect, it } from 'vitest';
import { composerSession, corrigerSession } from './quiz';
import type { QcmQuestion } from './types';

const banque: QcmQuestion[] = Array.from({ length: 30 }, (_, i) => ({
  id: `q${i}`, moduleId: `m${i % 3}`, theme: `t${i % 5}`, difficulte: ((i % 4) + 1) as 1 | 2 | 3 | 4,
  question: `Q${i} ?`, options: ['A', 'B', 'C', 'D'], bonneReponse: i % 4,
  explications: ['', '', '', ''],
}));

describe('composerSession', () => {
  it('tire sans doublon, déterministe par seed, respecte le filtre module', () => {
    const s = composerSession(banque, { nb: 10, moduleIds: ['m0'], seed: 1 });
    expect(s).toHaveLength(10);
    expect(new Set(s.map(x => x.question.id)).size).toBe(10);
    expect(s.every(x => x.question.moduleId === 'm0')).toBe(true);
    expect(composerSession(banque, { nb: 10, moduleIds: ['m0'], seed: 1 })).toEqual(s);
  });
  it('mélange les options avec remap (ordreOptions = permutation de 0..3)', () => {
    const s = composerSession(banque, { nb: 5, seed: 2 });
    for (const x of s) expect([...x.ordreOptions].sort()).toEqual([0, 1, 2, 3]);
  });
  it('borne nb à la taille du pool', () => {
    expect(composerSession(banque, { nb: 99, moduleIds: ['m1'], seed: 3 })).toHaveLength(10);
  });
});
describe('corrigerSession', () => {
  it('score et ventilation par thème ; null = faux', () => {
    const s = composerSession(banque, { nb: 4, seed: 4 });
    // répondre juste aux 2 premières : retrouver l’index affiché de la bonne réponse
    const reps = s.map((x, i) => i < 2 ? x.ordreOptions.indexOf(x.question.bonneReponse) : null);
    const r = corrigerSession(s, reps);
    expect(r.bonnes).toBe(2); expect(r.total).toBe(4);
    const sommeThemes = Object.values(r.parTheme).reduce((a, t) => a + t.total, 0);
    expect(sommeThemes).toBe(4);
  });
});
```

- [ ] **Step 2 : Run** — Expected: FAIL.
- [ ] **Step 3 : Implémenter `quiz.ts`**

```ts
import { mulberry32, shuffle } from './rng';
import type { Difficulte, QcmQuestion } from './types';

export interface QcmSessionQuestion { question: QcmQuestion; ordreOptions: number[]; }
export interface ResultatQcm {
  bonnes: number; total: number;
  parTheme: Record<string, { bonnes: number; total: number }>;
  details: { questionId: string; reponseDonnee: number | null; correcte: boolean }[];
}

export function composerSession(
  banque: QcmQuestion[],
  opts: { nb: number; moduleIds?: string[]; difficultes?: Difficulte[]; seed: number },
): QcmSessionQuestion[] {
  const rng = mulberry32(opts.seed);
  const pool = banque.filter(q =>
    (!opts.moduleIds || opts.moduleIds.includes(q.moduleId)) &&
    (!opts.difficultes || opts.difficultes.includes(q.difficulte)));
  return shuffle(rng, pool).slice(0, opts.nb).map(question => ({
    question,
    ordreOptions: shuffle(rng, question.options.map((_, i) => i)),
  }));
}
export function corrigerSession(session: QcmSessionQuestion[], reponses: (number | null)[]): ResultatQcm {
  const parTheme: ResultatQcm['parTheme'] = {};
  const details: ResultatQcm['details'] = [];
  let bonnes = 0;
  session.forEach((x, i) => {
    const rep = reponses[i];
    const correcte = rep !== null && x.ordreOptions[rep] === x.question.bonneReponse;
    if (correcte) bonnes++;
    const t = (parTheme[x.question.theme] ??= { bonnes: 0, total: 0 });
    t.total++; if (correcte) t.bonnes++;
    details.push({ questionId: x.question.id, reponseDonnee: rep, correcte });
  });
  return { bonnes, total: session.length, parTheme, details };
}
```

- [ ] **Step 4 : Run** — Expected: PASS. **Step 5 : Commit** — `feat: moteur QCM (composition seedée, correction, ventilation par thème)`.

---

### Task 8 : Registre de modules + squelette du module 4

**Files:** Create: `src/engine/registry.ts`, `src/content/modules/04-taux-obligations/{meta.ts, chapters.ts, exercises.ts, problems.ts, qcm.ts, jury.ts, flashcards.ts, formules.ts}`, `src/content/glossary.ts`, `src/engine/registry.test.ts`

- [ ] **Step 1 : Squelette module 4** — `meta.ts` :

```ts
import type { ModuleMeta } from '../../../engine/types';
export const meta: ModuleMeta = {
  id: '04-taux-obligations', numero: 4, titre: 'Taux & obligations',
  description: 'Courbe des taux, pricing obligataire, duration, convexité, repo et marché monétaire.',
  quantitatif: true,
};
```

Chaque autre fichier exporte un tableau vide typé (`export const exercices: ExerciseGenerator[] = [];` etc.), `chapters.ts` exporte `export const chapitres: ChapitreRef[] = [];`. `glossary.ts` : `export const glossaire: GlossaireEntree[] = [];`

- [ ] **Step 2 : `registry.ts`**

```ts
import type { ModuleContenu } from './types';
import { meta as m4 } from '../content/modules/04-taux-obligations/meta';
import { chapitres as c4 } from '../content/modules/04-taux-obligations/chapters';
import { exercices as e4 } from '../content/modules/04-taux-obligations/exercises';
import { problemes as p4 } from '../content/modules/04-taux-obligations/problems';
import { qcm as q4 } from '../content/modules/04-taux-obligations/qcm';
import { jury as j4 } from '../content/modules/04-taux-obligations/jury';
import { flashcards as f4 } from '../content/modules/04-taux-obligations/flashcards';
import { formules as fo4 } from '../content/modules/04-taux-obligations/formules';

export const modules: ModuleContenu[] = [
  { meta: m4, chapitres: c4, exercices: e4, problemes: p4, qcm: q4, jury: j4, flashcards: f4, formules: fo4 },
];
export function getModule(id: string): ModuleContenu | undefined {
  return modules.find(m => m.meta.id === id);
}
export function tousLesGenerateurs() { return modules.flatMap(m => m.exercices); }
export function tousLesProblemes() { return modules.flatMap(m => m.problemes); }
export function touteLaBanqueQcm() { return modules.flatMap(m => m.qcm); }
export function toutesLesQuestionsJury() { return modules.flatMap(m => m.jury); }
export function toutesLesFlashcards() { return modules.flatMap(m => m.flashcards); }
```

- [ ] **Step 3 : Test** (`registry.test.ts`) — le registre contient le module `04-taux-obligations`, `getModule('04-taux-obligations')!.meta.numero === 4`, `getModule('zzz')` undefined. Run: PASS.
- [ ] **Step 4 : Commit** — `feat: registre de modules + squelette module 4`.

---

### Task 9 : Moteur examen blanc (TDD)

**Files:** Create: `src/engine/examen.ts`, `src/engine/examen.test.ts`

- [ ] **Step 1 : Tests** — avec banques factices (40 QCM, 8 ProblemGenerators de difficultés variées, 6 JuryQuestions répartis sur 2 modules) :
  - `composerExamen(contenus, seed)` retourne exactement 20 QCM (ou tout le pool si moins), 4 problèmes, 2 questions jury ;
  - les 4 problèmes incluent au moins un N3+ et pas deux fois le même moule ;
  - les 2 questions jury viennent de modules différents quand c'est possible ;
  - déterminisme par seed.
- [ ] **Step 2 : Run** — FAIL. **Step 3 : Implémenter** `composerExamen(modules: ModuleContenu[], seed: number): ExamenCompose` — tirage via `mulberry32` + `shuffle` ; structure retournée `{ qcm: QcmSessionQuestion[]; problemes: { generateur: ProblemGenerator; seed: number; scenario: number }[]; jury: JuryQuestion[] }` ; QCM via `composerSession` ; problèmes : shuffle des générateurs, prendre 4 en garantissant `difficulte >= 3` pour au moins un (sinon remplacer le dernier par le premier N3+ disponible) ; jury : shuffle puis déduplication par moduleId d'abord.
- [ ] **Step 4 : Run** — PASS. **Step 5 : Commit** — `feat: composition d'examen blanc (20 QCM + 4 problèmes + 2 jury)`.

---

### Task 10 : Design system, AppShell et navigation

**Files:** Create: `src/components/Math.tsx`, `src/components/Markdown.tsx`, `src/components/ui/*.tsx`, `src/components/AppShell.tsx` ; Modify: `src/App.tsx`, `src/index.css`

**Directive : utiliser le skill `frontend-design` pour cette tâche.** Identité visuelle « terminal financier élégant » : sombre par défaut (fond `#0c1118` environ, surfaces légèrement bleutées, accent unique type vert marché ou ambre, rouge réservé aux erreurs/baisses), mode clair complet, chiffres en tabular-nums, hiérarchie typographique nette, micro-transitions sobres (150-200 ms), AUCUN emoji décoratif dans l'UI, pas de confettis.

- [ ] **Step 1 : Tokens** — dans `index.css`, définir les variables (`--bg`, `--surface`, `--surface-2`, `--border`, `--text`, `--text-muted`, `--accent`, `--accent-muted`, `--ok`, `--err`, `--warn`) pour `:root` (sombre) et `[data-theme="clair"]`, mappées dans `@theme` Tailwind v4. Le thème est appliqué via `data-theme` sur `<html>` depuis `reglages.theme`.
- [ ] **Step 2 : `Math.tsx`** — rendu KaTeX hors MDX (pour énoncés/corrigés générés) :

```tsx
import katex from 'katex';
export function MathInline({ tex }: { tex: string }) {
  return <span dangerouslySetInnerHTML={{ __html: katex.renderToString(tex, { throwOnError: false }) }} />;
}
export function MathBlock({ tex }: { tex: string }) {
  return <div className="my-3 overflow-x-auto" dangerouslySetInnerHTML={{ __html: katex.renderToString(tex, { displayMode: true, throwOnError: false }) }} />;
}
```

- [ ] **Step 3 : `Markdown.tsx`** — mini-rendu pour les chaînes générées (énoncés, étapes) : gras `**…**`, italique `*…*`, listes `- `, sauts de ligne, et maths `$…$` / `$$…$$` via `Math`. Implémentation par découpage regex (pas de dépendance markdown complète). Doit être testé : Create `src/components/markdown.test.ts` sur la fonction pure de tokenisation (segments texte/gras/math correctement découpés, `$` non fermé rendu tel quel).
- [ ] **Step 4 : Composants UI** (`src/components/ui/`) — `Button` (variantes primaire/secondaire/fantôme, tailles), `Card`, `Badge` (dont variantes par niveau N1-N4 : N1 neutre → N4 accent fort), `ProgressBar`, `Tabs`, `Collapsible` (utilisé pour « Pour aller plus loin », animation hauteur), `Modal`, `NumericInput` (saisie libre, validation à la soumission via `parseSaisie`), `Timer` (affichage mm:ss, props `secondes`, `onFin`, pause), `EmptyState`. Props typées strictes, pas de logique métier dedans.
- [ ] **Step 5 : `AppShell.tsx` + routage** — `HashRouter` ; navigation latérale (desktop ≥ 1024 px) / barre d'onglets basse (mobile) avec 5 entrées : Tableau de bord `/`, Cours `/cours`, Entraînement `/entrainement`, Examen `/examen`, Glossaire `/glossaire` ; lien Réglages discret. Routes déclarées vers des pages provisoires (`<h1>` + description) pour : `/`, `/cours`, `/cours/:moduleId`, `/cours/:moduleId/:chapitreId`, `/entrainement`, `/entrainement/exercices`, `/entrainement/qcm`, `/entrainement/jury`, `/entrainement/flashcards`, `/examen`, `/glossaire`, `/reglages`. Envelopper dans `EtatProvider`.
- [ ] **Step 6 : Vérifier** — `npm run typecheck` (0 erreur), `npx vitest run` (tout PASS), `npm run dev` : naviguer sur les 5 espaces, basculer sombre/clair dans Réglages (page provisoire avec le toggle fonctionnel), vérifier le responsive (DevTools 360 px : barre basse ; desktop : latérale).
- [ ] **Step 7 : Commit** — `feat: design system, AppShell, navigation 5 espaces, thème sombre/clair`.

---

### Task 11 : Espace Cours (MDX, chapitres, checkpoints)

**Files:** Create: `src/components/cours/{Callout.tsx, GoFurther.tsx, Checkpoint.tsx, FicheSynthese.tsx}`, `src/components/cours/mdx-components.tsx`, `src/content/modules/04-taux-obligations/chapters/00-test-pipeline.mdx` (temporaire) ; Modify: `src/pages/{Cours,Module,Chapitre}.tsx`, `chapters.ts` du module 4

- [ ] **Step 1 : Composants de cours** —
  - `Callout` : encadrés `type: 'definition' | 'exemple' | 'piege' | 'important'` (styles distincts, titre optionnel) ;
  - `GoFurther` : wrapper de `Collapsible` titré « Pour aller plus loin » (démonstrations) ;
  - `Checkpoint` : props `{ id: string; questions: { q: string; options: string[]; bonne: number; explication: string }[] }` — QCM inline séquentiel ; à 100 % de bonnes réponses (re-tentatives permises), enregistre `checkpointsReussis[id]` via `useEtat` et affiche l'état acquis.
- [ ] **Step 2 : `mdx-components.tsx`** — mapping MDXProvider : `Callout`, `GoFurther`, `Checkpoint` + styles de `h2/h3/p/ul/table/blockquote` cohérents avec le design system.
- [ ] **Step 3 : Chapitre de test pipeline** — `00-test-pipeline.mdx` avec `export const meta = { id: 'ch0', titre: 'Test', ordre: 0 }`, du texte, une formule `$$P = \sum_{t=1}^{n} \frac{F_t}{(1+r)^t}$$`, un `<Callout type="definition">`, un `<GoFurther>`, un `<Checkpoint>` 2 questions. L'enregistrer dans `chapters.ts` (import lazy : `charger: () => import('./chapters/00-test-pipeline.mdx')`).
- [ ] **Step 4 : Pages** —
  - `Cours.tsx` : grille des modules du registre (numéro, titre, description, barre de progression = chapitres avec checkpoint réussi / total) ;
  - `Module.tsx` : liste ordonnée des chapitres (état : non lu / lu / acquis), accès synthèse (onglet, rendu MDX `synthese.mdx` si présent) ;
  - `Chapitre.tsx` : chargement lazy du MDX (`React.lazy` + `Suspense`), marque `chapitresLus` au montage, navigation précédent/suivant, largeur de lecture confortable (~70ch), KaTeX rendu.
- [ ] **Step 5 : Vérifier** — dev : le chapitre de test s'affiche (formule KaTeX propre, callout, dépliable, checkpoint qui enregistre), la progression du module bouge après checkpoint réussi. Typecheck + tests OK.
- [ ] **Step 6 : Commit** — `feat: espace Cours (pipeline MDX, callouts, checkpoints, progression)`.

---

### Task 12 : Runner exercices d'application & problèmes de cas

**Files:** Create: `src/pages/RunnerExercices.tsx`, `src/components/entrainement/{ExerciceCard.tsx, ProblemeCard.tsx, Etapes.tsx, SelecteurPerimetre.tsx}` ; Modify: `src/pages/Entrainement.tsx`

- [ ] **Step 1 : `Entrainement.tsx`** — hub : 4 cartes (Exercices & problèmes, QCM, Jury, Flashcards) + `SelecteurPerimetre` réutilisable (multi-sélection de modules — par défaut tous ceux ayant du contenu — et de niveaux 1-4).
- [ ] **Step 2 : Flux exercice d'application** (`ExerciceCard`) — état machine : `enonce → repondu`. Tirage `seed = newSeed()` ; affiche énoncé (Markdown), `NumericInput` + unité ; à la soumission : verdict (tolérance), affichage réponse exacte formatée, `Etapes` (corrigé déroulé étape par étape, chaque étape dans une carte numérotée, pièges en `Callout piege`), boutons « Rejouer avec d'autres valeurs » (nouveau seed, même moule) / « Exercice suivant » ; enregistre une `Tentative` (`reussite` 1 ou 0) + `toucherStreak`.
- [ ] **Step 3 : Flux problème de cas** (`ProblemeCard`) — choix scenario : `scenario = randInt(rng, 0, scenarios.length - 1)` ; affiche contexte puis sous-questions UNE PAR UNE (la n+1 n'apparaît qu'après validation de la n) ; chaque sous-question = même mécanique que Step 2 (saisie, verdict, corrigé de l'étape) ; en fin de problème : score x/n, récapitulatif, « Rejouer (autres valeurs) », « Problème suivant ». Tentative enregistrée avec `reussite = bonnes/n`.
- [ ] **Step 4 : Parcours du module** — quand le périmètre = 1 module et aucun filtre de niveau : proposer l'onglet « Parcours » (par défaut) : items du module ordonnés N1 → N4 (exercices d'application puis problèmes par niveau), position mémorisée dans `reprise`, progression par palier visible (4 segments). Onglet « Libre » : filtres niveau/type de cas + liste des moules avec badge de difficulté.
- [ ] **Step 5 : Vérifier** — créer dans `exercises.ts` du module 4 UN générateur factice temporaire (« addition de marché » : a+b, 2 étapes) pour tester le flux complet ; dev : jouer 3 fois, valeurs différentes à chaque fois, corrigé recalculé, tentative enregistrée. Le supprimer ensuite (le vrai contenu arrive au plan 1B). Typecheck + tests.
- [ ] **Step 6 : Commit** — `feat: runner exercices & problèmes (parcours par paliers, corrigés pas à pas)`.

---

### Task 13 : Runner QCM

**Files:** Create: `src/pages/RunnerQcm.tsx`

- [ ] **Step 1 : Configuration de session** — périmètre (modules/niveaux), nombre (10/20/40), chrono par question (aucun / 30 s / 60 s).
- [ ] **Step 2 : Déroulé** — question k/N, options dans l'ordre `ordreOptions`, sélection → verrouillage immédiat avec verdict + LES 4 explications affichées (la bonne mise en avant, chaque piège expliqué) ; chrono : à expiration, compte « sans réponse » (= faux) et révèle la correction ; bouton suivant.
- [ ] **Step 3 : Écran de fin** — score, temps moyen, ventilation par thème (`corrigerSession`), liste des questions ratées repliables (avec leurs explications), bouton « Refaire une session ». Tentatives enregistrées (une par question, type `qcm`).
- [ ] **Step 4 : Vérifier** — 3 QCM factices temporaires dans `qcm.ts` module 4 → session jouable, mélange visible entre deux sessions (seeds différents), explications OK. Supprimer les factices. Typecheck + tests.
- [ ] **Step 5 : Commit** — `feat: runner QCM (chrono, explications par option, ventilation par thème)`.

---

### Task 14 : Mode jury

**Files:** Create: `src/pages/RunnerJury.tsx`

- [ ] **Step 1 : Déroulé** — tirage aléatoire dans le périmètre (sans répéter avant épuisement : mémoriser les ids vus dans l'état de session) ; phase 1 « Préparation » : question affichée + Timer 30 s ; phase 2 « Réponse à voix haute » : Timer 2 min (bouton « J'ai fini » pour passer avant) ; phase 3 « Correction » : affichage `plan` (numéroté), `pointsAttendus` (cases cochables pour s'auto-vérifier), `bonus`, puis `reponseModele` rédigée (repliée par défaut) ; phase 4 : auto-évaluation 3 boutons (Raté 0 / Moyen 0,5 / Bon 1) → `Tentative` type `jury`.
- [ ] **Step 2 : Réglage des chronos** — présets modifiables avant session (préparation 0/30/60 s, réponse 1/2/3 min).
- [ ] **Step 3 : Vérifier** — 2 questions jury factices temporaires, dérouler les 4 phases, timers OK (pause incluse), auto-éval enregistrée. Supprimer les factices. Typecheck + tests.
- [ ] **Step 4 : Commit** — `feat: mode jury (chrono préparation/réponse, grille de correction, auto-évaluation)`.

---

### Task 15 : Flashcards

**Files:** Create: `src/pages/RunnerFlashcards.tsx`, `src/engine/flashqueue.ts`, `src/engine/flashqueue.test.ts`

- [ ] **Step 1 : TDD file du jour** (`flashqueue.ts`) — `fileDuJour(cartes: Flashcard[], etat: EtatApp, aujourdHui: string, seed: number): Flashcard[]` : toutes les cartes dues (`cartesDues`) + les nouvelles (jamais introduites, dans l'ordre du module, plafonnées à `nouvellesCartesParJour` moins celles déjà introduites aujourd'hui via `cartesIntroduites`), mélangées (seed). Tests : plafond respecté, cartes dues toujours incluses, déterminisme, une carte introduite aujourd'hui n'est pas réintroduite.
- [ ] **Step 2 : UI** — compteur restantes ; carte recto (Markdown) → clic/espace pour retourner → verso + 4 boutons `Encore / Difficile / Bien / Facile` (avec l'intervalle prévisionnel affiché sous chaque bouton, ex. « 3 j ») ; `reviser` + sauvegarde après chaque note ; les « Encore » reviennent en fin de file ; écran de fin (compte, répartition des notes).
- [ ] **Step 3 : Vérifier** — 5 cartes factices temporaires : dérouler, vérifier les intervalles affichés et `cartes` dans l'état (localStorage inspecté). Supprimer les factices. Typecheck + tests.
- [ ] **Step 4 : Commit** — `feat: flashcards (file du jour SRS, intervalles prévisionnels)`.

---

### Task 16 : Tableau de bord, statistiques, réglages

**Files:** Create: `src/engine/stats.ts`, `src/engine/stats.test.ts`, `src/pages/Reglages.tsx` (final) ; Modify: `src/pages/Dashboard.tsx`

- [ ] **Step 1 : TDD `stats.ts`** —
  - `progressionModule(m: ModuleContenu, etat): { acquis: number; total: number }` (checkpoints réussis / chapitres) ;
  - `tauxReussite(tentatives, filtre?: { moduleId?, type?, depuisJours? }): number | null` (null si aucune donnée) ;
  - `pointsFaibles(modules, etat, minTentatives = 5): { moduleId, theme, taux }[]` trié croissant sur les tentatives QCM/exercices par thème/module ;
  - `dues(modules, etat, aujourdHui): number`.
  Tests avec données factices : calculs exacts, filtre par date, seuil minTentatives respecté.
- [ ] **Step 2 : Dashboard** — cartes : « Révisions du jour » (n cartes dues → lien flashcards), « Reprendre » (`etat.reprise`), série de jours, progression globale (modules), points faibles (top 3 avec lien direct vers l'entraînement filtré), derniers scores (5 dernières sessions QCM/examens).
- [ ] **Step 3 : Réglages** — thème sombre/clair, nouvelles cartes/jour (5-50), **Exporter ma progression** (téléchargement `le-desk-sauvegarde-AAAA-MM-JJ.json` via Blob) , **Importer** (file input → `importer` → confirmation modale avant remplacement, message d'erreur propre si invalide), bouton « Réinitialiser » (double confirmation).
- [ ] **Step 4 : Vérifier** — dev : export → fichier téléchargé ; modifier l'état ; import → état restauré. Typecheck + tests PASS.
- [ ] **Step 5 : Commit** — `feat: tableau de bord, stats points faibles, réglages export/import`.

---

### Task 17 : Examen blanc (UI)

**Files:** Create: `src/pages/ExamenBlanc.tsx` ; Modify: routes si besoin

- [ ] **Step 1 : Écran d'accueil** — explication du format (20 QCM chronométrés 30 s + 4 problèmes + 2 questions jury), périmètre = tout le contenu disponible, bouton « Commencer » (avertissement : ~45-60 min).
- [ ] **Step 2 : Déroulé séquentiel** — Section A : 20 QCM enchaînés SANS correction intermédiaire (chrono/question, réponses stockées) ; Section B : 4 problèmes (mécanique du runner problèmes, mais correction différée : saisies stockées, pas de verdict) ; Section C : 2 questions jury (préparation 30 s + réponse 2 min chacune, auto-éval immédiate car subjective).
- [ ] **Step 3 : Rapport final** — score global pondéré (QCM 40 %, problèmes 40 %, jury 20 %), détail par section, ventilation par thème/module, corrigé complet déroulable de TOUT (chaque QCM avec explications, chaque sous-question avec étapes), enregistrement `Tentative` type `examen`, comparaison avec les examens précédents (liste des scores passés).
- [ ] **Step 4 : Vérifier** — avec contenu factice minimal temporaire, dérouler un examen complet de bout en bout. Typecheck + tests.
- [ ] **Step 5 : Commit** — `feat: examen blanc complet (3 sections, correction différée, rapport)`.

---

### Task 18 : Glossaire & formulaire

**Files:** Create: `src/pages/Glossaire.tsx`, `src/engine/recherche.ts`, `src/engine/recherche.test.ts`

- [ ] **Step 1 : TDD `recherche.ts`** — `normaliser(s)` (minuscules + suppression des accents via `normalize('NFD')`) et `chercher<T>(items, requete, cles)` (inclusion sur champs normalisés, résultats triés : préfixe d'abord). Tests : « duration » trouve « Duration de Macaulay », « echeance » trouve « échéance », requête vide → tout.
- [ ] **Step 2 : UI deux onglets** — Glossaire : barre de recherche instantanée, entrées (terme, terme EN en badge, définition, lien module) groupées alphabétiquement. Formulaire : par module, chaque formule en KaTeX block avec nom + commentaire, recherche par nom.
- [ ] **Step 3 : Vérifier** — avec 3 entrées factices temporaires (à conserver si utiles, sinon supprimer). Typecheck + tests.
- [ ] **Step 4 : Commit** — `feat: glossaire et formulaire avec recherche normalisée`.

---

### Task 19 : PWA, icônes, build final

**Files:** Create: `public/icon.svg` ; Modify: `vite.config.ts` si besoin

- [ ] **Step 1 : Icône** — `public/icon.svg` : monogramme « LD » ou pictogramme courbe stylisée, fond `#0c1118`, accent du design system, lisible en petit.
- [ ] **Step 2 : Icônes PWA** — Run: `npx @vite-pwa/assets-generator --preset minimal-2023 public/icon.svg` (génère les PNG dans `public/`). Ajuster le manifest si les noms diffèrent.
- [ ] **Step 3 : Build** — Run: `npm run build`. Expected: succès, dossier `dist/`. Vérifier la taille (< 5 Mo hors polices acceptable).
- [ ] **Step 4 : Test hors ligne** — Run: `npm run preview` ; ouvrir, naviguer partout (cache rempli), puis DevTools → Network → Offline → recharger : l'app fonctionne. Vérifier zéro requête externe (onglet Network : aucun domaine tiers).
- [ ] **Step 5 : Commit + tag** — `chore: PWA installable hors ligne, icônes, build de production` puis `git tag v0.1-app`.

---

### Task 20 : Publication GitHub Pages (BLOQUANT UTILISATEUR — à faire en dernier, après le plan 1B)

- [ ] **Step 1 :** Run `gh auth status`. Si non connecté : **STOP — demander à l'utilisateur** de créer un compte GitHub et de lancer `gh auth login` (le guider pas à pas, c'est un non-développeur).
- [ ] **Step 2 :** Créer le repo (`gh repo create le-desk --public --source . --push`), ajouter un workflow `.github/workflows/deploy.yml` standard (build Node 20 + upload `dist/` + deploy-pages, déclenché sur push `master`), activer Pages via `gh api`.
- [ ] **Step 3 :** Vérifier l'URL publiée sur téléphone, « Ajouter à l'écran d'accueil », mode avion → l'app fonctionne. Donner l'URL à l'utilisateur.

---

## Auto-vérification finale (plan A)

- [ ] `npx vitest run` : tout PASS. `npm run typecheck` : 0 erreur. `npm run build` : succès.
- [ ] Aucun contenu factice restant (`rg -i "factice|test-pipeline" src/` → rien, hors fichiers de test `.test.ts`).
- [ ] Les 5 espaces navigables sur 360 px et desktop, sombre et clair.
- [ ] Export → import : état restauré à l'identique.
