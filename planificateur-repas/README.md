# 🍽️ Planificateur de repas

Application web qui génère ta **liste de plats de la semaine** selon des
critères que tu choisis (nombre de plats végétariens, de pâtes, de viande, de
poisson, d'œufs…), tout en apportant de la **variété d'une semaine à l'autre**.

Les plats proviennent d'une base intégrée que tu peux enrichir, modifier ou
réduire. Tout est sauvegardé localement dans ton navigateur — aucun compte,
aucun serveur.

## ✨ Fonctionnalités

- **Génération hebdomadaire** selon des quotas par catégorie + un nombre total de repas.
- **Variété garantie** : jamais deux fois le même plat dans une semaine, et on
  évite les plats déjà servis lors des N dernières semaines (réglable).
- **Re-tirage par repas** : pas convaincu par un plat ? Change-le sans tout regénérer.
- **Base de plats éditable** : ajoute / supprime tes propres recettes par catégorie.
- **Historique** des semaines générées, conservé localement.
- 100 % côté navigateur (localStorage), aucun back-end.

## 🧠 Logique de génération

1. On satisfait d'abord les **quotas par catégorie** (ex. 2 végétariens, 1 pâtes…).
2. On **complète** ensuite jusqu'au nombre total de repas avec des plats variés.
3. On **évite les doublons** dans la semaine et on **privilégie les plats non
   utilisés** lors des dernières semaines (paramètre « éviter les répétitions »).

Le moteur (`src/lib/generateur.ts`) utilise un générateur pseudo-aléatoire
déterministe, ce qui le rend testable (`src/lib/generateur.test.ts`).

## 🚀 Démarrage

```bash
npm install
npm run dev        # serveur de développement
npm run build      # build de production dans dist/
npm run preview    # prévisualiser le build
npm test           # lancer les tests unitaires
npm run typecheck  # vérifier les types TypeScript
```

## 🛠️ Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) (build & dev server)
- [Vitest](https://vitest.dev/) (tests unitaires)
- CSS « maison », sans dépendance de style.

## 📦 Déploiement

Un workflow GitHub Actions (`.github/workflows/deploy.yml`) construit et publie
automatiquement le site sur **GitHub Pages** à chaque push sur `main`.
Pour l'activer : dans les *Settings* du dépôt → *Pages* → *Source* → **GitHub Actions**.

## 📁 Structure

```
src/
  data/plats.ts          # base de plats par défaut
  lib/
    generateur.ts        # moteur de génération de la semaine
    generateur.test.ts   # tests du moteur
    rng.ts               # aléatoire déterministe
    stockage.ts          # persistance localStorage
  components/
    Planificateur.tsx    # onglet de génération
    MesPlats.tsx         # gestion de la base de plats
    Historique.tsx       # semaines passées
  App.tsx                # coquille + onglets + état
  types.ts               # types partagés
```
