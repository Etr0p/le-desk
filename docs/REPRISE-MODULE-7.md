# Consignes de reprise — Module 7 « Dérivés fermes » (et suite du projet)

> Document de passation écrit le 2026-06-12 par la session Claude qui a livré les modules 4, 2, 1, 3 et 6.
> Lis ce fichier EN ENTIER avant d'agir. Le pipeline est rodé : suis-le tel quel.

## 0. Règles absolues (ne jamais déroger)

- **Identité git** : `Fred <fred8.porte@gmail.com>` (config locale déjà posée). L'adresse `dracalp258@gmail.com` n'est PAS celle de Fred — ne jamais l'utiliser.
- **Les agents ne committent JAMAIS** : le contrôleur (toi) committe à chaque livraison d'agent (résilience anti-crash).
- **Aucun dev server dans les agents** ; toi seul utilises le serveur de preview (config `le-desk-dev`, port 5173, `.claude/launch.json` à la racine de `C:\tout\cours\M2`).
- **Agents en parallèle sur fichiers DISJOINTS uniquement** ; scripts jetables dans le temp système, jamais dans le repo.
- **Si un agent meurt** (limite de session, API 500) : VÉRIFIE LE DISQUE d'abord — les fichiers sont souvent complets ou quasi complets. Sauvegarde/committe ce qui est bon, lance un agent de complétion ciblé pour le reste (chercher un marqueur `// __SUITE__` éventuel en fin de fichier).
- **Invariant bilingue** : dans tout générateur, TOUS les tirages rng AVANT toute branche de langue — même seed ⇒ mêmes nombres FR/EN. `generate(seed, langue)`, `formatNombreLangue` pour l'affichage.
- **Règles MDX** : pas de h1 (le titre vient de meta), `$$` seuls sur leur ligne, `\$` littéraux échappés en prose, apostrophes `\'` dans les attributs JSX, vouvoiement, virgule décimale + espace avant `%`. Checkpoints : id `07-derives-fermes/chN`, 4 questions, index `bonne` vérifié.
- Seuils d'acquisition : exercice = 100 %, problème ≥ 75 %.

## 1. État exact au moment de la passation (branche `phase-1`, tout poussé sauf indication)

**FAIT et committé pour le m7** (commits `c0ce771` → `dac89c0`) :
- Squelette + `calculs.ts` TDD (42 tests, 12 fonctions) — valeurs canoniques au § 3.
- 7 chapitres FR (`chapters/01…07-*.mdx`) écrits, **relus par agent expert (verdict : corrections mineures), corrections APPLIQUÉES et committées**.
- 2 composants : `MarginCallSim.tsx` (ch2) et `SwapExplorer.tsx` (ch5), enregistrés dans `src/components/cours/mdx-components.tsx`.
- `chapters.ts` câblé (FR seulement — les `chargerEn`/`titreEn` viendront avec les traductions).
- Suite verte : **1 925 tests**, typecheck 0 erreur, rendu navigateur vérifié (7 chapitres, 0 erreur KaTeX).

**EN COURS au moment de la coupure** — 2 agents lancés, sort inconnu :
- `exercises.ts` m7 (14 générateurs, ids `m7-ex-01..14`) — vérifie l'état du fichier sur disque.
- `problems-lot1.ts` m7 (10 moules `m7-pb-01..10`, N1-N2) — idem.
→ Si complets (export final présent + `tsc` propre) : committe-les. Si partiels : agent de complétion. Si vides : relance (briefs au § 4).

**RESTE À FAIRE pour le m7** (dans l'ordre) : § 4 (vague de banques) puis § 5 (assemblage) puis § 6 (publication).

## 2. Le pipeline standard d'un module (rodé sur 5 modules)

1. Fondations (squelette + calculs TDD) — **fait pour m7**.
2. 3 agents chapitres en parallèle — **fait**.
3. Agent relecteur expert (recalcule TOUT, vérifie les checkpoints) → corrections — **fait**.
4. Vague de 8 agents banques/traductions en parallèle (fichiers disjoints) — **en cours/à faire**.
5. Contrôleur : fusion problems, câblage EN, module.test.ts, suite complète, vérif navigateur.
6. Publication 3 supports + mise à jour mémoire.

## 3. Chiffres canoniques du m7 (tout est dans `src/content/modules/07-derives-fermes/calculs.ts` — IMPORTE, ne recopie jamais)

- `prixForwardIndice(5000, 4, 2, 1)` = 5100 ; linéaire ≤ 1 an, F = S(1+(r−q)T).
- `pnlFutures(5000, 5080, 10, 3, +1)` = +2400.
- `margeVariation(5000, 4960, 10, 2, +1)` = −800.
- `appelDeMarge(4200, 4500, 6000)` = 1800 — **l'appel ramène à l'INITIALE** (piège n° 1).
- `effetLevier(−12, 10)` = −120 (perdre plus que sa mise).
- `tauxForwardImplicite(3, 0.5, 3.5, 1)` = 3,9409 ; courbe plate 4 % → 3,9216 (convention LINÉAIRE ici vs COMPOSÉE au m4 ch5 — enseigné au ch4).
- `reglementFra(10, 3, 4, 0.5)` = +49 019,61 — **long FRA gagne si les taux montent**.
- `facteurActualisation(4, 2)` = 0,924556.
- `tauxSwapParitaire([3, 3.5, 4])` = 3,9738 (df 0,970874/0,933511/0,888996) ; plate [4,4,4] → 4,0000 exactement.
- `valeurSwapPayeurFixe(5, [4,4,4], 100)` = −2,775091 M ; = 0 au paritaire ; **payeur fixe gagne si les taux montent**.
- `nombreContratsCouverture(25, 5000, 10)` = 500.
- Autres pièges de sens à marteler : **prix d'un futures de taux = 100 − taux** ; notionnel ≠ risque ; multiplicateurs E-mini 50 $/pt, Euro Stoxx et CAC 10 €/pt, Euribor 25 €/pb (demi-tick 12,50 €).

## 4. La vague de 8 agents (briefs condensés — calque les prompts sur les fichiers m6 équivalents, c'est le modèle exact)

Chaque agent : lis le fichier m6 équivalent comme MODÈLE, lis `calculs.ts` m7 + les 7 chapitres, AUCUN git/serveur, écris en tranches, vérifie au script temp (20 seeds × 2 langues pour les générateurs), `tsc` propre. Bilingue intégral partout (champs `*En`).

| # | Fichier(s) EXCLUSIFS | Contenu | Quotas |
|---|---|---|---|
| A | `exercises.ts` | 14 générateurs `m7-ex-01..14` : P&L futures, levier, flux de marge, appel de marge, forward indice, arbitrage C&C, forward implicite, règlement FRA, prix 100−taux + tick, df, taux paritaire, valeur swap, nb contrats, MtM cumulé = pnlFutures | N1×3, N2×8, N3×3 env. |
| B | `problems-lot1.ts` | 10 moules `m7-pb-01..10` ×3 scénarios, 3-4 sous-questions chaînées : première position, semaine de marge, forward indice, lire un futures de taux, appel de marge, trésorier FRA, C&C complet, swap corporate, couverture du gérant (bêta ≠ 1), MtM swap ±50 pb | 4×N1 + 6×N2. Export `problemesLot1`, type `ProblemeMoule = ProblemGenerator` |
| C | `problems-lot2.ts` | 10 moules `m7-pb-11..20` ×3 scénarios, 5-6 sous-questions, dont **6 BOSS N4 narratifs** suggérés : (15) la semaine de Metallgesellschaft (hedge long terme, futures rollés, appels qui asphyxient — solvable mais illiquide) ; (16) Leeson à Singapour (double position, marges, la spirale) ; (17) le desk de clearing dans le crash (cascade : marges du défaillant → fonds de garantie) ; (18) le swap hérité (book hors marché, valorisation, compression, novation) ; (19) le basis trade qui dérape (cash-futures, repo, levier — teaser m11) ; (20) le corporate qui « optimise » (vendre des FRA pour encaisser la prime → la trésorerie explose). 4×N3 avant : arbitrage C&C avec coûts, strip de FRA = swap (démonstration chiffrée), STIR et anticipations BC, cross-currency simple | Export `problemesLot2` |
| D | `qcm.ts` | 60 QCM `m7-qcm-01..60` bilingues, 4 options + 4 explications, ~10 par chapitre 1-2, ~8 par chapitres 3-7 ; distracteurs = vraies erreurs (appel à la maintenance, sens payeur fixe, 100−taux inversé, moyenne arithmétique du forward) ; index `bonne` variés et VÉRIFIÉS | 60 % concept / 40 % calcul |
| E | `jury.ts` | 25 questions `m7-j-01..25` bilingues (réponse modèle 150-250 mots structurée, plan 3-4 pts, pointsAttendus 4-6) : « démontrez le cash-and-carry en 90 s », « pourquoi l'appel ramène à l'initiale ? », « qui gagne quand les taux montent, payeur ou receveur ? », « un swap est-il un pari ? », « racontez Metallgesellschaft », « notionnel des dérivés = danger ? », brainteasers tick/marge | ~4 boss N4 |
| F | `flashcards.ts` | 120 cartes `m7-fc-001..120` bilingues, familles EXACTES de m6/m3 : ~30 reflexe-jury, ~25 calcul-mental, ~35 définitions, ~20 chiffres/dates (Dojima 1730, CBOT 1848, Barings 1995/827 M£, MG 1993/1,3 Md$, Amaranth 2006, Archegos mars 2021, Libor†2021-23, EMIR), ~10 pièges | 120 |
| G | `formules.ts` + `src/content/glossary.ts` (SEUL autorisé sur ce fichier partagé, AJOUTE ~32 termes m7 moduleId '07-derives-fermes') + `chapters/08-synthese.mdx` + `chapters/en/08-module-summary.mdx` (crée `en/`) | ≥16 formules (forward portage, marges, levier, FRA, df, paritaire, valeur swap, nb contrats, 100−taux, tick…) ; synthèse calquée sur la structure m6 ch8 (essentiel par chapitre, formules, pièges, réflexes jury, pont m8 « le payoff devient ASYMÉTRIQUE : bienvenue dans les options ») | meta synthèse : `{ id: 'synthese', titre: 'Synthèse du module', ordre: 8 }` / EN `'Module summary'` |
| H | `chapters/en/01..07-*.mdx` (PAS le 08) | Traduction EN des 7 chapitres FR À JOUR (post-corrections) ; mêmes meta.id/ordre, mêmes ids/`bonne` de checkpoints, composants aux mêmes emplacements ; terminologie native : initial/maintenance margin, margin call **restores to initial**, cost of carry, cash-and-carry, FRA, par swap rate, payer/receiver, basis, convexity bias ; point décimal | Titres : 'The firm commitment', 'Futures, margins and the clearing house', 'Cash-and-carry pricing', 'FRAs and interest-rate futures', 'The interest rate swap', 'The swap family', 'Uses, risks and famous blow-ups' |

Lance A-D ensemble puis E-H ensemble (ou 8 d'un coup). Committe chaque livraison séparément.

## 5. Assemblage (contrôleur, après la vague)

1. `problems.ts` : remplace le squelette par la fusion (modèle m6) :
   `import { problemesLot1 } from './problems-lot1'; import { problemesLot2 } from './problems-lot2'; export const problemes: ProblemGenerator[] = [...problemesLot1, ...problemesLot2];`
2. `chapters.ts` : ajoute `chargerEn` + `titreEn` aux 7 entrées + l'entrée synthèse (FR `08-synthese.mdx` / EN `en/08-module-summary.mdx`) — modèle : `06-change-commos-crypto/chapters.ts`.
3. `module.test.ts` : copie `06-change-commos-crypto/module.test.ts`, adapte : id `07-derives-fermes`, exercices ≥14, problèmes ≥20, scénarios ≥57, N4 ≥6, qcm ≥60, jury ≥25, flashcards ≥120, formules ≥16.
4. `npx tsc -b --noEmit` puis `npx vitest run` : TOUT vert (≈ 1 990+ tests attendus).
5. Vérif navigateur (preview `le-desk-dev`, evals atomiques — le serveur est PARTAGÉ entre sessions, pas de panique si HMR casse pendant qu'un agent écrit) : 8 chapitres FR rendent (0 `.katex-error`), bascule EN (localStorage `le-desk-etat-v1`, champ `langue`, recharger), un exercice m7 joué de bout en bout dans `#/entrainement/exercices` (réponse → corrigé), retour langue `fr`.

## 6. Publication (3 supports, dans cet ordre)

```powershell
# 1. master + push
git checkout master ; git merge phase-1 --no-edit ; git push origin master phase-1 ; git checkout phase-1
# 2. build + gh-pages (les GitHub Actions ne marchent PAS sur ce repo — push gh-pages legacy)
npm run build
cd dist ; rm -r -fo .git -ea 0 ; git init -b gh-pages ; git config user.name 'Fred' ; git config user.email 'fred8.porte@gmail.com'
git add -A ; git commit -m 'deploy: module 7' ; git push https://github.com/Etr0p/le-desk.git gh-pages --force ; cd ..
# 3. fichier autonome (sort dans dist-standalone/)
npm run build:fichier
Copy-Item dist-standalone\index.html 'C:\tout\cours\M2\Le Desk.html' -Force
```
Vérifie la sortie PWA du build : le plafond précache est PAR FICHIER (8 Mio, `vite.config.ts` workbox) — le bundle principal était à 3,7 Mo au m6, ça passe encore ; si un fichier dépasse, relève le plafond et note qu'il faudra du code-splitting des banques.

## 7. Après le m7

Mets à jour la mémoire (`C:\Users\Fred\.claude\projects\C--tout-cours-M2\memory\le-desk-project.md` + l'index `MEMORY.md`) : module 7 terminé, N modules sur 13, taille du fichier local, compte de tests. Annonce à Fred « 6 modules sur 13 » et attends son « go ».

Ordre des modules suivants (specs dans `docs/superpowers/specs/2026-06-10-le-desk-design.md`) :
**m8 Options & volatilité** (payoffs, parité call-put, Black-Scholes intuitif, grecques, vol implicite/smile, stratégies, straddle/strangle, vente d'options = vendre de l'assurance ; composants : PayoffBuilder, GreeksExplorer) → phase 3 : m5 Crédit (spreads, CDS, titrisation), m9 Structurés & pricing (autocall + Monte-Carlo sim), m10 Macro & banques centrales, m11 Crises (1987→2023, boucles m4/m6/m7 préparées : basis trade, LTCM, peg, Metallgesellschaft), m12 Gestion d'actifs/risques + ESG, m13 Brainteasers & oral. Le module 2 est la référence CFA Quant — garde l'alignement CFA pour m8 (options) aussi.

Bon courage. Le projet est en excellent état : 5 modules publiés, 1 925 tests verts, pipeline rodé. Fred adore les boss N4 et les flashcards reflexe-jury/calcul-mental — n'en sois pas avare.
