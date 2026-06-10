# Le Desk — Design

**Date** : 2026-06-10
**Statut** : validé par l'utilisateur (programme, application, technique)
**Localisation du projet** : `C:\tout\cours\M2\le-desk\`

## 1. Contexte et objectif

L'utilisateur est étudiant en finance (fin de M1 → M2). Pendant ses vacances, il veut maîtriser la finance de marché en profondeur, avec pour objectif concret d'être prêt à affronter un jury de compétition étudiante type **The Financial Game** (oraux devant professionnels : questions techniques, culture financière, brainteasers).

**Le produit** : une application web statique (PWA) contenant un cours complet de finance de marché, des exercices qui changent à chaque session, et quatre modes d'entraînement — le tout fonctionnant **sans IA, sans serveur et hors connexion**.

### Critères de succès

1. L'app s'installe et fonctionne hors connexion sur PC et téléphone (PWA).
2. Aucune requête réseau au runtime après le chargement initial ; aucune dépendance à une IA ou un service externe.
3. Deux lancements successifs d'un même exercice numérique produisent des valeurs différentes, avec une correction pas à pas recalculée juste à chaque fois.
4. Le cours est rédigé en français soigné, à deux niveaux de lecture (intuition + démonstrations dépliables), avec formules KaTeX propres et composants interactifs.
5. Fin de phase 1 : le module pilote (Taux & obligations) est complet et toute la chaîne (cours → checkpoints → 4 modes d'entraînement → examen blanc) fonctionne.
6. Design sobre et professionnel, responsive de 360 px (mobile) au grand écran.
7. **Aucun élément d'entraînement sans corrigé complet intégré** : chaque exercice généré affiche une correction pas à pas recalculée avec ses valeurs ; chaque QCM explique la bonne réponse et le piège derrière chaque mauvaise réponse ; chaque question jury a sa réponse modèle structurée ; chaque flashcard et checkpoint a sa réponse détaillée.

### Non-objectifs

- Pas de backend, pas de comptes utilisateurs, pas de synchronisation cloud automatique (l'export/import manuel suffit).
- Pas d'IA au runtime (ni génération de texte, ni correction par modèle).
- Pas de données de marché en direct : tous les exemples sont pédagogiques et statiques.
- Pas de multi-utilisateur ni de classement en ligne.
- Pas d'application native (ni Electron, ni stores).

## 2. Programme du cours — 13 modules

Ordonnés du socle vers l'avancé. Chaque module suit la même structure (voir §3).

| # | Module | Contenu principal |
|---|--------|-------------------|
| 1 | Panorama des marchés & acteurs | Rôle des marchés, sell-side/buy-side, métiers d'une salle de marchés (front/middle/back), régulateurs (AMF, ESMA, SEC), MiFID, types d'ordres, microstructure, carnet d'ordres |
| 2 | Méthodes quantitatives & probabilités | Valeur temps de l'argent (actualisation, capitalisation, annuités, perpétuités, conventions de taux, composition continue), statistiques descriptives (moyennes arithmétique/géométrique, volatilité, covariance/corrélation, skewness/kurtosis), probabilités (conditionnelles, Bayes, variables aléatoires, espérance/variance), distributions (binomiale, normale, lognormale — pourquoi la lognormale pour les prix), intervalles de confiance, tests d'hypothèses (p-value, t-test), régression linéaire, Monte-Carlo (intuition) |
| 3 | Actions & indices | Valorisation (DCF, multiples), dividendes, opérations sur titres, IPO, construction des indices (prix vs capitalisation), short selling |
| 4 | Taux & obligations *(module pilote)* | Courbe des taux (formes, théories), pricing obligataire, rendement actuariel, duration de Macaulay/modifiée, convexité, marché monétaire, repo, OAT/Bund/Treasuries vs corporate |
| 5 | Crédit | Spreads de crédit, agences de notation, probabilité de défaut & recouvrement, CDS, titrisation (ABS, MBS, CDO), cycle du crédit |
| 6 | Change, matières premières & crypto | FX spot/forward, cotations, parités (PPA, parité couverte des taux), carry trade, or/pétrole, contango & backwardation, **chapitre crypto** (Bitcoin, stablecoins, ETF spot, tokenisation) |
| 7 | Dérivés fermes | Forwards, futures (marges, appels de marge, base), swaps de taux (IRS), cross-currency swaps, caps/floors/swaptions (introduction), couverture |
| 8 | Options & volatilité | Payoffs, parité call-put, modèle binomial, Black-Scholes, Greeks (delta, gamma, vega, theta, rho), delta-hedging, vol implicite vs réalisée, smile/skew, stratégies (straddle, strangle, collar, spreads) |
| 9 | Produits structurés | Briques (zéro-coupon + options), capital garanti, reverse convertibles, autocalls, options à barrière, lecture d'un term sheet |
| 10 | Macro & banques centrales | Mandats et outils BCE/Fed, transmission de la politique monétaire, QE/QT, indicateurs (CPI, NFP, PMI, PIB…), inflation, taux directeurs, impact sur les classes d'actifs |
| 11 | Histoire & crises financières | 1929, 1987, LTCM, dot-com, 2008 (mécanique complète subprimes → systémique), crise de la dette souveraine, COVID 2020, SVB 2023 |
| 12 | Gestion d'actifs & risques | CAPM, frontière efficiente, Sharpe/alpha/bêta, gestion passive vs active, ETF, VaR, stress tests, Bâle III, risques (marché, crédit, liquidité, opérationnel), **chapitre ESG** (green bonds, taxonomie, greenwashing) |
| 13 | Brainteasers & oral | Méthodes de calcul mental, brainteasers classiques, estimations de Fermi, probabilités d'entretien, conseils de passage devant jury, questions de motivation type compétition |

Le module 2 couvre la matière *Quantitative Methods* du CFA Level I (TVM, stats, proba, distributions, tests, régression) — exigence explicite de l'utilisateur — et alimente directement les brainteasers probabilistes du module 13.

### Niveau quantitatif : deux niveaux de lecture

- **Corps du cours** : intuition, mécanismes, formules appliquées avec exemples chiffrés — le niveau attendu à l'oral.
- **Sections dépliables « Pour aller plus loin »** : démonstrations (binomial → Black-Scholes, dérivation de la duration, lemme d'Itô en survol…), pour la profondeur M2.

## 3. Structure d'un module

Chaque module contient :

1. **Chapitres de cours** (5 à 8 par module) : explications progressives, exemples chiffrés, 2 à 4 composants interactifs par module, sections dépliables, et un **checkpoint** (2-3 questions rapides) en fin de chapitre.
2. **Fiche de synthèse** : formules et ordres de grandeur du module sur une page.
3. **Banque d'entraînement** alimentant les quatre modes :
   - **Problèmes de cas** (multi-étapes) : ≈ 50 énoncés distincts par module quantitatif (2, 3, 4, 5, 6, 7, 8, 9, 12) et ≈ 25 par module de culture (1, 10, 11, 13). Obtenus par 15-20 moules multi-étapes × 2-4 variantes de scénario chacun ; un filtre « par type de cas » permet de balayer systématiquement toute la taxonomie du module ;
   - **Exercices d'application** (mono-concept, rapides) : ~10-15 moules pour les modules quantitatifs, ~5 pour les autres ;
   - **QCM** : 50-80 questions par module ;
   - **Questions jury** : 20-30 questions ouvertes par module, avec réponse modèle structurée et points attendus ;
   - **Flashcards** : 60-100 cartes par module (définitions, formules, ordres de grandeur).

Cibles totales à terme : ≈ 550 problèmes de cas, ≈ 130 moules d'application, ≈ 850 QCM, ≈ 1 100 flashcards, ≈ 320 questions jury. Tous les problèmes et exercices restent paramétrés : valeurs tirées au sort à chaque session, corrigé recalculé.

## 4. L'application — cinq espaces

### 4.1 Tableau de bord (accueil)
- Progression globale et par module, série de jours travaillés (streak discret).
- « Révisions du jour » : nombre de flashcards arrivées à échéance, accès direct.
- « Reprendre » : dernier chapitre/mode utilisé.
- Statistiques : scores par mode et par module, points faibles détectés (taux d'erreur par thème).

### 4.2 Cours
- Liste des 13 modules avec progression ; chapitres ordonnés ; navigation précédent/suivant.
- Rendu riche : texte, KaTeX, schémas SVG, composants interactifs, encadrés (définition, piège, exemple, « pour aller plus loin » dépliable).
- Checkpoint en fin de chapitre → marque le chapitre comme acquis.
- Fiche de synthèse accessible depuis le module.

### 4.3 Entraînement — quatre modes
Sélection du périmètre (un module, plusieurs, tout) puis :

1. **Exercices & problèmes** — deux formats :
   - *Application* : un concept, une réponse. Énoncé à valeurs aléatoires, saisie de la réponse (tolérance définie par exercice), correction pas à pas recalculée, bouton « Rejouer avec d'autres valeurs ». Difficulté 1-3 affichée.
   - *Problèmes de cas* : mise en situation réaliste (desk, portefeuille, opération) déclinée en 3 à 6 sous-questions chaînées ; chaque sous-question est validée séparément avec son corrigé détaillé, score partiel en fin de problème ; filtre par type de cas et par difficulté.
2. **QCM** : session de N questions (10/20/40), chrono optionnel (ex. 30 s/question), mélange questions + ordre des réponses, explication de la bonne réponse et de chaque piège, score final par thème.
3. **Mode jury** : question ouverte tirée au sort ; chrono de préparation (30 s) puis de réponse (2 min, à voix haute) ; affichage de la réponse modèle structurée (plan + points clés attendus + bonus qui impressionne) ; auto-évaluation (raté / moyen / bon) intégrée aux statistiques.
4. **Flashcards** : file du jour en répétition espacée (algorithme type SM-2 simplifié), boutons Encore / Difficile / Bien / Facile, cartes nouvelles limitées par jour (paramétrable).

### 4.4 Examen blanc
Simulation type Financial Game, score détaillé par thème et corrigé complet à la fin. Format par défaut (paramétrable) : 20 QCM chronométrés + 4 exercices numériques + 2 questions jury.

### 4.5 Glossaire & formulaire
- Glossaire global : recherche instantanée (français/anglais), chaque terme lié à son module.
- Formulaire : toutes les formules du cours par module, rendu KaTeX, recherche.

### Progression et sauvegarde
- Tout est stocké en local (`localStorage`) : progression cours, états SRS, historique des sessions, statistiques.
- **Export/import JSON en un clic** pour transférer PC ↔ téléphone. Pas de compte, pas de réseau.

### Design
- Sobre, professionnel, esprit « terminal financier élégant » : mode sombre par défaut, mode clair disponible.
- Typographie soignée (titres/texte/chiffres tabulaires), micro-animations discrètes, conventions typographiques françaises.
- Responsive 360 px → grand écran ; cibles tactiles correctes sur mobile.
- Gamification légère uniquement : streak, scores, progression. Pas de confettis.
- Langue : français, jargon anglais de salle des marchés assumé (chaque terme au glossaire).

## 5. Architecture technique

### Stack
- **React + TypeScript + Vite** ; **Tailwind CSS** ; **MDX** pour les chapitres (texte riche + composants interactifs insérés) ; **KaTeX** pour les maths (polices embarquées) ; graphiques **SVG sur mesure** (pas de librairie de charts lourde) ; **vite-plugin-pwa** (service worker, manifest, hors ligne) ; routeur en mode hash (compatibilité maximale en statique).
- État : store léger (hooks + localStorage) ; pas de backend.

### Séparation moteur / contenu
```
le-desk/
├── docs/superpowers/specs/        ← ce document
├── src/
│   ├── engine/                    ← moteurs : SRS, sessions QCM, runner d'exercices,
│   │                                 mode jury, examen blanc, stats, sauvegarde
│   ├── components/                ← design system + composants interactifs de cours
│   ├── content/
│   │   ├── modules/01-panorama/   ← un dossier par module :
│   │   │   ├── meta.ts            ←   métadonnées (id, titre, ordre, description)
│   │   │   ├── chapters/*.mdx     ←   chapitres de cours
│   │   │   ├── exercises.ts       ←   générateurs paramétrés
│   │   │   ├── qcm.ts             ←   banque QCM
│   │   │   ├── jury.ts            ←   questions ouvertes + réponses modèles
│   │   │   ├── flashcards.ts      ←   cartes
│   │   │   └── synthese.mdx       ←   fiche de synthèse
│   │   └── glossary.ts            ← glossaire global
│   └── pages/                     ← les cinq espaces
└── public/                        ← manifest, icônes
```
**Règle d'or** : ajouter un module ne modifie jamais le moteur. Les modules sont découverts par un registre central typé.

### Contrat d'un générateur d'exercice
```ts
interface ExerciseGenerator {
  id: string;            // "bond-pricing-1"
  moduleId: string;
  titre: string;
  difficulte: 1 | 2 | 3;
  generate(seed: number): GeneratedExercise;
}

interface GeneratedExercise {
  enonce: string;            // markdown + KaTeX, valeurs insérées
  reponse: number;           // valeur exacte
  tolerance: number;         // tolérance relative ou absolue
  unite?: string;            // "%", "€", "années"…
  etapes: { titre: string; contenu: string }[];  // correction pas à pas
  pieges?: string[];         // erreurs classiques explicitées dans la correction
}
```
Pour les problèmes de cas multi-étapes :
```ts
interface ProblemGenerator {
  id: string;            // "bond-portfolio-hedge-1"
  moduleId: string;
  titre: string;
  typeDeCas: string;     // taxonomie du module, ex. "couverture de duration"
  difficulte: 1 | 2 | 3;
  scenarios: string[];   // variantes de contexte du même moule (2 à 4)
  generate(seed: number, scenario: number): GeneratedProblem;
}

interface GeneratedProblem {
  contexte: string;      // mise en situation (markdown + KaTeX), valeurs insérées
  sousQuestions: (GeneratedExercise & { intitule: string })[];  // 3 à 6, chaînées
}
```
- PRNG **seedé** (mulberry32) : tirages reproductibles — un exercice peut être rejoué à l'identique (même seed) ou varié (nouveau seed).
- Les paramètres sont tirés dans des plages réalistes définies par moule (ex. coupon 1-6 %, maturité 2-10 ans) ; les étapes de correction sont calculées, jamais rédigées en dur avec des valeurs figées.
- Les QCM numériques utilisent des distracteurs **calculés** à partir des erreurs typiques (oubli du remboursement final, confusion Macaulay/modifiée, capitalisation simple vs composée…).

### Répétition espacée (flashcards)
SM-2 simplifié : 4 réponses (Encore / Difficile / Bien / Facile) → intervalles croissants (≈ 1 j, 3 j, puis facteur de facilité borné). État par carte dans la sauvegarde locale. File du jour = cartes échues + nouvelles (plafond quotidien paramétrable, défaut 20).

### Déploiement
- **GitHub Pages** (repo de l'utilisateur, build automatique ou push du dossier `dist/`).
- Sur téléphone : ouvrir l'URL → « Ajouter à l'écran d'accueil » → utilisable hors connexion ensuite (service worker).
- Secours local : `npm run build` produit un site statique ouvrable en local (et possibilité de build mono-fichier si besoin).

## 6. Plan de construction en trois phases

Chaque phase se termine par une app complète et utilisable.

- **Phase 1 — Fondations** : design system, les cinq espaces, les quatre moteurs d'entraînement, l'examen blanc, la sauvegarde/export, la PWA, et le **module 4 (Taux & obligations) intégralement rédigé** (chapitres, interactifs — dont courbe des taux manipulable et visualisation duration/convexité —, problèmes de cas, exercices d'application, QCM, jury, flashcards, synthèse). Le pilote valide toute la chaîne.
- **Phase 2 — Le socle** : modules 2, 1, 3, 6, 7, 8 — dans cet ordre : les méthodes quantitatives d'abord (socle de tout le pricing), puis panorama, actions, FX/commos/crypto, dérivés fermes, options & volatilité (avec constructeur de payoff et simulateur Black-Scholes/Greeks).
- **Phase 3 — La profondeur** : modules 5, 9, 10, 11, 12, 13 (crédit, structurés, macro, crises, gestion/risques+ESG, brainteasers), calibrage de l'examen blanc façon Financial Game, glossaire/formulaire complets, polissage final (perf, accessibilité, responsive).

Le contenu est rédigé par Claude module par module, sur plusieurs sessions ; l'utilisateur peut faire corriger n'importe quel passage. Chaque module terminé est committé.

## 7. Risques et parades

| Risque | Parade |
|--------|--------|
| Volume de contenu sous-estimé | Phasage strict ; le pilote (phase 1) donne la mesure réelle de l'effort par module ; cibles chiffrées par module |
| Erreurs dans les corrections calculées | Tests unitaires sur chaque générateur (valeurs de référence vérifiées) ; tolérances explicites |
| Dérive du design (incohérence visuelle) | Design system défini en phase 1, composants réutilisés partout |
| localStorage effacé par le navigateur | Export JSON mis en avant (rappel discret après chaque grosse session) |
| MDX/KaTeX alourdissent le bundle | Découpage par route/module (lazy loading), polices KaTeX embarquées une fois |
