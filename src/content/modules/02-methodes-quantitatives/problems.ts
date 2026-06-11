/**
 * Moules de problèmes multi-étapes du module Méthodes quantitatives & probabilités — lot 1.
 * Dix moules : plan d'épargne, VAN/TRI, statistiques de rendements, portefeuille 2 actifs,
 * Bayes, binomiale, loi normale, intervalle de confiance, test d'alpha, régression.
 * Chaque moule : 3 scénarios FR + EN, sous-questions chaînées (les valeurs de a)
 * servent en b), c)…), corrigés calculés via calculs.ts — jamais de texte figé.
 * Les tirages aléatoires ont lieu AVANT toute branche de langue : même seed +
 * même scénario ⇒ mêmes nombres en français et en anglais.
 */
import { formatNombreLangue } from '../../../engine/answers';
import { mulberry32, pick, randFloat, randInt, shuffle } from '../../../engine/rng';
import type { Etape, Langue, ProblemGenerator } from '../../../engine/types';
import {
  bayes, combinaisons, correlation, covarianceEchantillon, ecartTypeEchantillon,
  esperanceBinomiale, esperancePortefeuille2, intervalleConfiance,
  moyenneArithmetique, moyenneGeometrique, normaleCdf, ordonneeRegression,
  penteRegression, probaBinomiale, r2Regression, statT, vaAnnuite, van,
  varianceEchantillon, variancePortefeuille2, vfAnnuite, zScore,
} from './calculs';

const M2 = '02-methodes-quantitatives';
const r1 = (v: number) => Math.round(v * 10) / 10;
const r2 = (v: number) => Math.round(v * 100) / 100;
const r3 = (v: number) => Math.round(v * 1000) / 1000;

/** Petits formateurs liés à la langue (les tirages sont déjà faits quand on les crée). */
function outils(langue: Langue) {
  const en = langue === 'en';
  const f = (v: number, d = 2) => formatNombreLangue(langue, v, d);
  const eur = (v: number, d = 2) => (en ? `€${f(v, d)}` : `${f(v, d)} €`);
  const pct = (v: number, d = 2) => (en ? `${f(v, d)}%` : `${f(v, d)} %`);
  return { en, f, eur, pct };
}

/** Facteur d'actualisation d'une annuité de 1 (VA d'un euro par an pendant n ans). */
const facteurAnnuite = (tauxPct: number, n: number) => vaAnnuite(1, tauxPct, n);

/** P(X ≥ k) pour X ~ B(n, p) : somme des probabilités ponctuelles. */
function probaAuMoins(n: number, k: number, p: number): number {
  let s = 0;
  for (let i = k; i <= n; i++) s += probaBinomiale(n, i, p);
  return s;
}

/** TRI par encadrement entre deux taux entiers puis interpolation linéaire (méthode du chapitre 1). */
function triInterpole(inv: number, flux: number[]) {
  let rBas = 0;
  while (van(inv, flux, rBas + 1) > 0 && rBas < 60) rBas += 1;
  const rHaut = rBas + 1;
  const vanBas = van(inv, flux, rBas);
  const vanHaut = van(inv, flux, rHaut);
  const tri = rBas + vanBas / (vanBas - vanHaut);
  return { tri, rBas, rHaut, vanBas, vanHaut };
}

/** Corrigé complet d'une VAN à flux constants (2 étapes calculées). */
function etapesVan(langue: Langue, lettre: string, inv: number, flux: number, n: number, taux: number): Etape[] {
  const { en, f, eur, pct } = outils(langue);
  const af = facteurAnnuite(taux, n);
  const v = van(inv, Array.from({ length: n }, () => flux), taux);
  if (en) {
    return [
      { titre: `Discount the cash flows of project ${lettre}`, contenu: `The ${n} flows of ${eur(flux)} are worth $F \\times \\frac{1-(1+r)^{-n}}{r}$ = ${f(flux)} × ${f(af, 4)} = **${eur(flux * af)}** today (r = ${pct(taux)}).` },
      { titre: 'Subtract the investment', contenu: `$VAN$ = ${f(flux * af)} − ${f(inv)} = **${eur(r2(v))}**. ${v > 0 ? 'Positive NPV: at this discount rate, the project creates value.' : 'Negative NPV: at this discount rate, the project destroys value.'}` },
    ];
  }
  return [
    { titre: `Actualiser les flux du projet ${lettre}`, contenu: `Les ${n} flux de ${eur(flux)} valent aujourd'hui $F \\times \\frac{1-(1+r)^{-n}}{r}$ = ${f(flux)} × ${f(af, 4)} = **${eur(flux * af)}** (r = ${pct(taux)}).` },
    { titre: "Soustraire l'investissement", contenu: `$VAN$ = ${f(flux * af)} − ${f(inv)} = **${eur(r2(v))}**. ${v > 0 ? 'VAN positive : à ce taux, le projet crée de la valeur.' : 'VAN négative : à ce taux, le projet détruit de la valeur.'}` },
  ];
}

/* ------------------------------------------------------------------ */
/* 1. m2-pb-plan-epargne — N2                                          */
/* ------------------------------------------------------------------ */
const planEpargne: ProblemGenerator = {
  id: 'm2-pb-plan-epargne', moduleId: M2,
  titre: "Construire un plan d'épargne",
  titreEn: 'Building a savings plan',
  typeDeCas: 'épargne programmée',
  typeDeCasEn: 'scheduled savings plan',
  difficulte: 2,
  scenarios: ['Particulier qui prépare un apport immobilier', 'Conseiller en gestion de patrimoine', 'Trésorier qui provisionne une échéance'],
  scenariosEn: ['Individual building a home down payment', 'Wealth-management adviser', 'Treasurer pre-funding a known liability'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const flux = pick(rng, [1200, 1800, 2400, 3000, 3600, 4800] as const);
    const n = randInt(rng, 6, 12);
    const taux = randFloat(rng, 2, 5, 2);

    const vf = vfAnnuite(flux, taux, n);
    const vaEq = vaAnnuite(flux, taux, n);
    const verse = flux * n;
    const interets = vf - verse;
    const vfPlus = vfAnnuite(flux, taux + 1, n);
    const repVf = r2(vf);
    const repVa = r2(vaEq);
    const repInterets = r2(interets);
    const repVfPlus = r2(vfPlus);
    const facteurVf = ((1 + taux / 100) ** n - 1) / (taux / 100);
    const facteurVfPlus = ((1 + (taux + 1) / 100) ** n - 1) / ((taux + 1) / 100);

    const { en, f, eur, pct } = outils(langue);
    const desc = en
      ? `${eur(flux)} at the end of each year for ${n} years, at an annual rate of ${pct(taux)}`
      : `${eur(flux)} à la fin de chaque année pendant ${n} ans, à un taux annuel de ${pct(taux)}`;
    const contexte = (en
      ? [
        `You are saving toward a home down payment: your bank offers a plan in which you set aside ${desc}, with interest compounded annually. Before signing, you want to know where the plan really lands — and what one extra point of rate would change.`,
        `As a wealth-management adviser, you size a scheduled savings plan for a client who would set aside ${desc}, interest compounded annually. The client wants three numbers before deciding: the final capital, its value in today's euros, and the share interest takes in it.`,
        `As the treasurer of a mid-cap, you pre-fund a bullet loan repayment by setting aside ${desc} in a remunerated account. Management wants proof the pot will be large enough — and a figure for what one extra point of yield would bring.`,
      ]
      : [
        `Vous préparez un apport immobilier : votre banque vous propose un plan dans lequel vous versez ${desc}, intérêts capitalisés chaque année. Avant de signer, vous voulez savoir où ce plan vous mène réellement — et ce que changerait un point de taux de mieux.`,
        `Conseiller en gestion de patrimoine, vous chiffrez pour un client un plan d'épargne programmée : ${desc}, intérêts capitalisés chaque année. Le client veut trois chiffres pour décider : le capital final, sa valeur en euros d'aujourd'hui, et la part que les intérêts y prennent.`,
        `Trésorier d'une PME, vous provisionnez le remboursement d'un crédit in fine en versant ${desc} sur un compte rémunéré. La direction veut valider que la cagnotte suffira — et mesurer ce que rapporterait un point de rémunération de mieux.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The final capital' : 'a) Le capital final',
          enonce: en ? `What capital will be accumulated right after the last payment, in euros?` : `Quel capital sera accumulé juste après le dernier versement, en euros ?`,
          reponse: repVf, tolerance: 0.002, unite: '€',
          etapes: [
            {
              titre: en ? 'A future-value annuity' : "La valeur acquise d'une annuité",
              contenu: en
                ? `Each payment of ${eur(flux)} compounds until year ${n}: $VF = F \\times \\frac{(1+r)^n - 1}{r}$ with $F$ = ${f(flux)}, $r$ = ${pct(taux)} and $n$ = ${n}. The first payment compounds for ${n - 1} years, the last one not at all (end-of-year payments).`
                : `Chaque versement de ${eur(flux)} capitalise jusqu'à l'année ${n} : $VF = F \\times \\frac{(1+r)^n - 1}{r}$ avec $F$ = ${f(flux)}, $r$ = ${pct(taux)} et $n$ = ${n}. Le premier versement capitalise ${n - 1} ans, le dernier pas du tout (versements en fin d'année).`,
            },
            {
              titre: en ? 'Application' : 'Application',
              contenu: en
                ? `$VF$ = ${f(flux)} × ${f(facteurVf, 4)} = **${eur(repVf)}**.`
                : `$VF$ = ${f(flux)} × ${f(facteurVf, 4)} = **${eur(repVf)}**.`,
            },
          ],
          pieges: [en
            ? `Multiplying ${f(flux)} by ${n} ignores compounding: that gives ${eur(verse)} — the sum paid in, not the final capital.`
            : `Multiplier ${f(flux)} par ${n} ignore la capitalisation : cela donne ${eur(verse)} — la somme versée, pas le capital final.`],
        },
        {
          intitule: en ? 'b) The equivalent lump sum today' : "b) Le capital équivalent aujourd'hui",
          enonce: en
            ? `What single amount, invested today at the same rate, would produce exactly the same final capital, in euros?`
            : `Quel capital unique, placé aujourd'hui au même taux, produirait exactement la même somme finale, en euros ?`,
          reponse: repVa, tolerance: 0.002, unite: '€',
          etapes: [
            {
              titre: en ? 'Discount the final capital' : 'Actualiser le capital final',
              contenu: en
                ? `The lump sum is the present value of a): $VA$ = ${f(repVf)} / (1 + ${pct(taux)})^${n} = **${eur(repVa)}**.`
                : `Le capital unique est la valeur actuelle du a) : $VA$ = ${f(repVf)} / (1 + ${pct(taux)})^${n} = **${eur(repVa)}**.`,
            },
            {
              titre: en ? 'Cross-check with the annuity formula' : "Recouper avec la formule d'annuité",
              contenu: en
                ? `Directly: $VA = F \\times \\frac{1-(1+r)^{-n}}{r}$ = ${f(flux)} × ${f(facteurAnnuite(taux, n), 4)} = **${eur(repVa)}**. Same number: discounting the future value or discounting each payment is one and the same operation.`
                : `En direct : $VA = F \\times \\frac{1-(1+r)^{-n}}{r}$ = ${f(flux)} × ${f(facteurAnnuite(taux, n), 4)} = **${eur(repVa)}**. Même chiffre : actualiser la valeur finale ou actualiser chaque versement est une seule et même opération.`,
            },
          ],
        },
        {
          intitule: en ? 'c) The share earned by interest' : 'c) La part des intérêts',
          enonce: en
            ? `Out of the final capital, how much comes from interest, in euros?`
            : `Sur le capital final, combien proviennent des intérêts, en euros ?`,
          reponse: repInterets, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'Final capital minus payments' : 'Capital final moins versements',
            contenu: en
              ? `Total paid in: ${n} × ${f(flux)} = ${eur(verse)}. Interest = ${f(repVf)} − ${f(verse)} = **${eur(repInterets)}**, i.e. ${pct(r2((interets / vf) * 100))} of the final capital — the part compounding earned for you.`
              : `Total versé : ${n} × ${f(flux)} = ${eur(verse)}. Intérêts = ${f(repVf)} − ${f(verse)} = **${eur(repInterets)}**, soit ${pct(r2((interets / vf) * 100))} du capital final — la part que la capitalisation a gagnée pour vous.`,
          }],
        },
        {
          intitule: en ? 'd) One extra point of rate' : "d) Le recalcul à taux + 1 point",
          enonce: en
            ? `The rate moves from ${pct(taux)} to ${pct(taux + 1)}. What would the new final capital be, in euros?`
            : `Le taux passe de ${pct(taux)} à ${pct(taux + 1)}. Quel serait le nouveau capital final, en euros ?`,
          reponse: repVfPlus, tolerance: 0.002, unite: '€',
          etapes: [
            {
              titre: en ? 'Same formula, new rate' : 'Même formule, nouveau taux',
              contenu: en
                ? `$VF$ = ${f(flux)} × ${f(facteurVfPlus, 4)} = **${eur(repVfPlus)}**.`
                : `$VF$ = ${f(flux)} × ${f(facteurVfPlus, 4)} = **${eur(repVfPlus)}**.`,
            },
            {
              titre: en ? 'Measure the sensitivity' : 'Mesurer la sensibilité',
              contenu: en
                ? `Gain over a): ${f(repVfPlus)} − ${f(repVf)} = **${eur(r2(vfPlus - vf))}**, a ${pct(r2((vfPlus / vf - 1) * 100))} jump in the final capital for a single point of rate — compounding amplifies every basis point, and all the more as the horizon stretches.`
                : `Gain par rapport au a) : ${f(repVfPlus)} − ${f(repVf)} = **${eur(r2(vfPlus - vf))}**, soit ${pct(r2((vfPlus / vf - 1) * 100))} de capital final en plus pour un seul point de taux — la capitalisation amplifie chaque point, et d'autant plus que l'horizon s'allonge.`,
            },
          ],
          pieges: [en
            ? `Adding 1% of a) (${eur(r2(vf * 1.01))}) misreads the mechanics: the extra point applies to every yearly balance, not once to the total.`
            : `Ajouter 1 % au a) (${eur(r2(vf * 1.01))}) rate la mécanique : le point de taux s'applique chaque année au solde, pas une seule fois au total.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 2. m2-pb-choix-projets — N2                                         */
/* ------------------------------------------------------------------ */
const choixProjets: ProblemGenerator = {
  id: 'm2-pb-choix-projets', moduleId: M2,
  titre: "Choisir entre deux projets d'investissement",
  titreEn: 'Choosing between two investment projects',
  typeDeCas: "choix d'investissement (VAN/TRI)",
  typeDeCasEn: 'capital budgeting (NPV/IRR)',
  difficulte: 2,
  scenarios: ["Directeur financier d'une ETI", "Comité d'investissement", 'Analyste qui prépare la note de synthèse'],
  scenariosEn: ['CFO of a mid-cap company', 'Investment committee', 'Analyst drafting the decision memo'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const n = randInt(rng, 4, 6);
    const taux = randFloat(rng, 6, 10, 1);
    const invA = randInt(rng, 80, 150) * 1000;
    const invB = randInt(rng, 80, 150) * 1000;
    const exA = randFloat(rng, 2.5, 5, 1);
    const exB = randFloat(rng, 0.8, 2, 1);

    const fluxConstant = (fx: number) => Array.from({ length: n }, () => fx);
    let fluxA = Math.ceil(invA / facteurAnnuite(taux + exA, n) / 100) * 100;
    const fluxB = Math.ceil(invB / facteurAnnuite(taux + exB, n) / 100) * 100;
    let vanA = van(invA, fluxConstant(fluxA), taux);
    const vanB = van(invB, fluxConstant(fluxB), taux);
    let garde = 0;
    while (Math.abs(vanA - vanB) < 2000 && garde < 60) {
      fluxA += 200;
      vanA = van(invA, fluxConstant(fluxA), taux);
      garde += 1;
    }
    const aGagne = vanA > vanB;
    const invG = aGagne ? invA : invB;
    const fluxG = aGagne ? fluxA : fluxB;
    const triG = triInterpole(invG, fluxConstant(fluxG));
    const triP = triInterpole(aGagne ? invB : invA, fluxConstant(aGagne ? fluxB : fluxA));
    const repVanA = r2(vanA);
    const repVanB = r2(vanB);
    const repEcart = r2(Math.abs(vanA - vanB));
    const repTri = r2(triG.tri);

    const { en, f, eur, pct } = outils(langue);
    const lettreG = aGagne ? 'A' : 'B';
    const lettreP = aGagne ? 'B' : 'A';
    const desc = en
      ? `project A costs ${eur(invA)} upfront and then pays ${eur(fluxA)} at the end of each year for ${n} years; project B costs ${eur(invB)} upfront and then pays ${eur(fluxB)} over the same horizon. The discount rate is ${pct(taux)}`
      : `le projet A coûte ${eur(invA)} aujourd'hui puis rapporte ${eur(fluxA)} à la fin de chaque année pendant ${n} ans ; le projet B coûte ${eur(invB)} puis rapporte ${eur(fluxB)} sur le même horizon. Le coût du capital est de ${pct(taux)}`;
    const contexte = (en
      ? [
        `As CFO of a mid-cap company, you must pick one of two mutually exclusive investments: ${desc}. The board expects a numbers-backed choice, not a preference: both NPVs, the gap between them, and the internal rate of return of the winner.`,
        `The investment committee reviews two competing files for the same envelope: ${desc}. You present the analysis: the two NPVs, the gap separating them, and the IRR of the chosen project to answer the eternal "so how much does it yield?".`,
        `As an analyst, you draft the decision memo for management: ${desc}. The memo must quantify the value created by each project, recommend one of the two, and give its approximate internal rate of return.`,
      ]
      : [
        `Directeur financier d'une ETI, vous devez trancher entre deux investissements exclusifs : ${desc}. Le conseil attend un choix chiffré, pas une préférence : les deux VAN, l'écart entre elles, et le taux de rentabilité interne du gagnant.`,
        `Le comité d'investissement examine deux dossiers concurrents pour la même enveloppe : ${desc}. Vous présentez l'analyse : les deux VAN, l'écart qui les sépare, et le TRI du projet retenu pour répondre à l'éternel « ça rapporte du combien ? ».`,
        `Analyste, vous préparez la note de synthèse pour la direction : ${desc}. La note doit chiffrer la valeur créée par chaque projet, recommander l'un des deux et donner son taux de rentabilité interne approché.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The NPV of project A' : 'a) La VAN du projet A',
          enonce: en ? `What is the NPV of project A, in euros?` : `Quelle est la VAN du projet A, en euros ?`,
          reponse: repVanA, tolerance: 0.005, unite: '€',
          etapes: etapesVan(langue, 'A', invA, fluxA, n, taux),
          pieges: [en
            ? `Summing the raw flows (${eur(fluxA * n - invA)} net) skips discounting: a euro in year ${n} is not a euro today.`
            : `Sommer les flux bruts (${eur(fluxA * n - invA)} nets) oublie l'actualisation : un euro de l'année ${n} ne vaut pas un euro d'aujourd'hui.`],
        },
        {
          intitule: en ? 'b) The NPV of project B' : 'b) La VAN du projet B',
          enonce: en ? `Same question for project B.` : `Même question pour le projet B.`,
          reponse: repVanB, tolerance: 0.005, unite: '€',
          etapes: etapesVan(langue, 'B', invB, fluxB, n, taux),
        },
        {
          intitule: en ? 'c) The choice, in euros' : 'c) Le choix, en euros',
          enonce: en
            ? `Which project should be chosen? Give the NPV gap between winner and loser, in euros.`
            : `Lequel choisir ? Donnez l'écart de VAN entre le gagnant et le perdant, en euros.`,
          reponse: repEcart, tolerance: 50, toleranceMode: 'absolu', unite: '€',
          etapes: [
            {
              titre: en ? 'NPV decides' : 'La VAN tranche',
              contenu: en
                ? `Project ${lettreG} creates ${eur(aGagne ? repVanA : repVanB)} of value against ${eur(aGagne ? repVanB : repVanA)} for project ${lettreP}: choose **${lettreG}**, with a gap of **${eur(repEcart)}**. NPV measures euros of wealth created — the only directly comparable yardstick.`
                : `Le projet ${lettreG} crée ${eur(aGagne ? repVanA : repVanB)} de valeur contre ${eur(aGagne ? repVanB : repVanA)} pour le projet ${lettreP} : on choisit **${lettreG}**, avec un écart de **${eur(repEcart)}**. La VAN mesure des euros de richesse créés — le seul étalon directement comparable.`,
            },
            {
              titre: en ? 'What about the IRRs?' : 'Et les TRI dans tout ça ?',
              contenu: en
                ? (aGagne
                  ? `Here both criteria agree: project A also carries the higher IRR (≈ ${pct(r2(triG.tri))} against ≈ ${pct(r2(triP.tri))} for B). No conflict — but had there been one, NPV would still decide.`
                  : `Attention au réflexe « meilleur pourcentage » : project A shows the higher IRR (≈ ${pct(r2(triP.tri))} against ≈ ${pct(r2(triG.tri))} for B), yet B creates more euros. When NPV and IRR clash, **NPV decides** — a big rate on a small base buys less than a fair rate on a large one.`)
                : (aGagne
                  ? `Ici les deux critères concordent : le projet A affiche aussi le TRI le plus élevé (≈ ${pct(r2(triG.tri))} contre ≈ ${pct(r2(triP.tri))} pour B). Pas de conflit — mais s'il y en avait un, la VAN trancherait quand même.`
                  : `Attention au réflexe « meilleur pourcentage » : le projet A affiche le TRI le plus élevé (≈ ${pct(r2(triP.tri))} contre ≈ ${pct(r2(triG.tri))} pour B), et pourtant B crée plus d'euros. En cas de conflit entre VAN et TRI, c'est la **VAN qui tranche** — un gros taux sur une petite base rapporte moins qu'un taux correct sur une grosse.`),
            },
          ],
          pieges: [en
            ? `Choosing on IRR alone ignores project size: a percentage says nothing about euros created when the bases differ.`
            : `Choisir au seul TRI ignore la taille des projets : un pourcentage ne dit rien des euros créés quand les bases diffèrent.`],
        },
        {
          intitule: en ? `d) The approximate IRR of project ${lettreG}` : `d) Le TRI approché du projet ${lettreG}`,
          enonce: en
            ? `By bracketing between two whole rates then interpolating linearly, estimate the IRR of project ${lettreG}, in %.`
            : `Par encadrement entre deux taux entiers puis interpolation linéaire, estimez le TRI du projet ${lettreG}, en %.`,
          reponse: repTri, tolerance: 0.15, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'Bracket the sign change' : 'Encadrer le changement de signe',
              contenu: en
                ? `At ${pct(triG.rBas, 0)}, the NPV is still **+${eur(r2(triG.vanBas))}**; at ${pct(triG.rHaut, 0)} it turns to **${eur(r2(triG.vanHaut))}**. The IRR — the rate that zeroes the NPV — lies between the two.`
                : `À ${pct(triG.rBas, 0)}, la VAN vaut encore **+${eur(r2(triG.vanBas))}** ; à ${pct(triG.rHaut, 0)} elle devient **${eur(r2(triG.vanHaut))}**. Le TRI — le taux qui annule la VAN — est entre les deux.`,
            },
            {
              titre: en ? 'Interpolate linearly' : 'Interpoler linéairement',
              contenu: en
                ? `$TRI \\approx ${triG.rBas} + \\frac{${f(r2(triG.vanBas))}}{${f(r2(triG.vanBas))} + ${f(r2(-triG.vanHaut))}}$ = **${pct(repTri)}**. Above the ${pct(taux)} cost of capital — consistent with the positive NPV of ${lettreG}.`
                : `$TRI \\approx ${triG.rBas} + \\frac{${f(r2(triG.vanBas))}}{${f(r2(triG.vanBas))} + ${f(r2(-triG.vanHaut))}}$ = **${pct(repTri)}**. Au-dessus du coût du capital de ${pct(taux)} — cohérent avec la VAN positive de ${lettreG}.`,
            },
          ],
          pieges: [en
            ? `Comparing the IRR to zero is meaningless: almost every project has a positive IRR. The benchmark is the ${pct(taux)} cost of capital.`
            : `Comparer le TRI à zéro n'a pas de sens : presque tous les projets ont un TRI positif. La référence, c'est le coût du capital de ${pct(taux)}.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 3. m2-pb-analyse-rendements — N2                                    */
/* ------------------------------------------------------------------ */
const analyseRendements: ProblemGenerator = {
  id: 'm2-pb-analyse-rendements', moduleId: M2,
  titre: 'Analyser une série de rendements',
  titreEn: 'Dissecting a return history',
  typeDeCas: 'statistiques de rendements',
  typeDeCasEn: 'return statistics',
  difficulte: 2,
  scenarios: ['Gérant qui présente son track record', 'Contrôleur des risques', 'Client qui vérifie la plaquette commerciale'],
  scenariosEn: ['Manager presenting a track record', 'Risk controller', 'Client fact-checking the marketing deck'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const nbAnnees = randInt(rng, 4, 5);
    const capital = pick(rng, [10000, 25000, 50000, 100000] as const);
    const positifs = Array.from({ length: nbAnnees - 1 }, () => randFloat(rng, 3, 16, 1));
    const negatif = randFloat(rng, -16, -5, 1);
    const rendements = shuffle(rng, [...positifs, negatif]);

    const moyA = moyenneArithmetique(rendements);
    const moyG = moyenneGeometrique(rendements);
    const varE = varianceEchantillon(rendements);
    const sigma = ecartTypeEchantillon(rendements);
    const facteurTotal = rendements.reduce((p, r) => p * (1 + r / 100), 1);
    const richesse = capital * facteurTotal;
    const naive = capital * (1 + moyA / 100) ** nbAnnees;
    const repMoyA = r2(moyA);
    const repMoyG = r2(moyG);
    const repSigma = r2(sigma);
    const repRichesse = r2(richesse);

    const { en, f, eur, pct } = outils(langue);
    const liste = rendements.map(r => `${r > 0 ? '+' : ''}${pct(r, 1)}`).join(', ');
    const contexte = (en
      ? [
        `As a portfolio manager, you walk a prospect through your track record: an initial ${eur(capital)} invested over ${nbAnnees} years produced annual returns of ${liste}. The prospect asks for the average — but which one? Your credibility rides on the difference.`,
        `In risk control, you audit an in-house fund sheet: an initial ${eur(capital)} invested over ${nbAnnees} years went through annual returns of ${liste}. The deck headlines the arithmetic mean; your job is to measure what the investor actually earned, and how bumpy the ride was.`,
        `As the client of an asset manager, you fact-check the brochure: an initial ${eur(capital)} invested over ${nbAnnees} years rode the returns ${liste}. The document touts a flattering "average return" — you redo the maths before the annual review.`,
      ]
      : [
        `Gérant, vous présentez votre track record à un prospect : un capital initial de ${eur(capital)} investi pendant ${nbAnnees} ans a connu les rendements annuels suivants : ${liste}. Le prospect demande la moyenne — mais laquelle ? Votre crédibilité se joue sur la différence.`,
        `Au contrôle des risques, vous auditez la fiche d'un fonds maison : un capital initial de ${eur(capital)} investi pendant ${nbAnnees} ans a traversé les rendements annuels ${liste}. La plaquette met la moyenne arithmétique en gros caractères ; à vous de mesurer ce que l'investisseur a réellement gagné, et la volatilité du parcours.`,
        `Client d'une société de gestion, vous vérifiez la plaquette : votre versement initial de ${eur(capital)}, placé pendant ${nbAnnees} ans, a connu les rendements ${liste}. Le document vante un « rendement moyen » flatteur — vous refaites les comptes avant l'entretien annuel.`,
      ])[sIdx];

    const lignesEcarts = rendements.map(r =>
      en
        ? `- (${f(r, 1)} − ${f(repMoyA)})² = ${f((r - moyA) ** 2, 3)}`
        : `- (${f(r, 1)} − ${f(repMoyA)})² = ${f((r - moyA) ** 2, 3)}`,
    ).join('\n');
    const sommeCarres = varE * (nbAnnees - 1);

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The arithmetic mean' : 'a) La moyenne arithmétique',
          enonce: en ? `What is the arithmetic mean of the annual returns, in %?` : `Quelle est la moyenne arithmétique des rendements annuels, en % ?`,
          reponse: repMoyA, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Sum and divide' : 'Sommer et diviser',
            contenu: en
              ? `Sum of the returns: ${f(rendements.reduce((s, r) => s + r, 0), 1)} pts, divided by ${nbAnnees}: **${pct(repMoyA)}**. This is the right answer to "what does a typical year look like?" — not to "what did the capital do?".`
              : `Somme des rendements : ${f(rendements.reduce((s, r) => s + r, 0), 1)} pts, divisée par ${nbAnnees} : **${pct(repMoyA)}**. C'est la bonne réponse à « à quoi ressemble une année typique ? » — pas à « qu'a fait le capital ? ».`,
          }],
        },
        {
          intitule: en ? 'b) The geometric mean' : 'b) La moyenne géométrique',
          enonce: en ? `What is the annualised geometric mean, in %?` : `Quelle est la moyenne géométrique annualisée, en % ?`,
          reponse: repMoyG, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'Chain the growth factors' : 'Chaîner les facteurs de croissance',
              contenu: en
                ? `Product of the (1 + r): ${rendements.map(r => f(1 + r / 100, 3)).join(' × ')} = **${f(facteurTotal, 4)}**.`
                : `Produit des (1 + r) : ${rendements.map(r => f(1 + r / 100, 3)).join(' × ')} = **${f(facteurTotal, 4)}**.`,
            },
            {
              titre: en ? 'Take the n-th root' : 'Prendre la racine n-ième',
              contenu: en
                ? `$(${f(facteurTotal, 4)})^{1/${nbAnnees}} - 1$ = **${pct(repMoyG)}** per year. Always below the arithmetic mean (${pct(repMoyA)}): the gap — roughly $\\sigma^2/2$ — is the price volatility charges on compounding.`
                : `$(${f(facteurTotal, 4)})^{1/${nbAnnees}} - 1$ = **${pct(repMoyG)}** par an. Toujours sous la moyenne arithmétique (${pct(repMoyA)}) : l'écart — environ $\\sigma^2/2$ — est le prix que la volatilité fait payer à la capitalisation.`,
            },
          ],
          pieges: [en
            ? `Averaging the (1 + r) then subtracting 1 just rebuilds the arithmetic mean: the geometric mean needs the product, not the sum.`
            : `Moyenner les (1 + r) puis retrancher 1 reconstruit la moyenne arithmétique : la géométrique exige le produit, pas la somme.`],
        },
        {
          intitule: en ? 'c) The sample standard deviation' : "c) L'écart-type (n − 1)",
          enonce: en
            ? `Compute the standard deviation of the returns (sample convention, n − 1 denominator), in points of %.`
            : `Calculez l'écart-type des rendements (convention d'échantillon, dénominateur n − 1), en points de %.`,
          reponse: repSigma, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'Squared deviations from the mean' : 'Les écarts à la moyenne, au carré',
              contenu: en
                ? `${lignesEcarts}\n\nSum of squares: **${f(sommeCarres, 2)}**.`
                : `${lignesEcarts}\n\nSomme des carrés : **${f(sommeCarres, 2)}**.`,
            },
            {
              titre: en ? 'Divide by n − 1, then take the root' : 'Diviser par n − 1, puis prendre la racine',
              contenu: en
                ? `Variance = ${f(sommeCarres, 2)} / ${nbAnnees - 1} = ${f(varE, 2)} %², hence σ = **${f(repSigma)} pts**. A high σ is precisely what will pull b) away from a).`
                : `Variance = ${f(sommeCarres, 2)} / ${nbAnnees - 1} = ${f(varE, 2)} %², d'où σ = **${f(repSigma)} pts**. Un σ élevé est exactement ce qui éloigne le b) du a).`,
            },
          ],
          pieges: [en
            ? `Dividing by n gives ${f(r2(Math.sqrt(sommeCarres / nbAnnees)))}: on a sample of ${nbAnnees} observations, the n − 1 convention corrects the small-sample bias.`
            : `Diviser par n donnerait ${f(r2(Math.sqrt(sommeCarres / nbAnnees)))} : sur un échantillon de ${nbAnnees} observations, la convention n − 1 corrige le biais de petit échantillon.`],
        },
        {
          intitule: en ? 'd) The wealth that actually materialised' : 'd) La richesse finale réelle',
          enonce: en
            ? `What final capital does the investor actually hold, in euros? Compare with what the arithmetic mean seemed to promise.`
            : `Quel capital final l'investisseur détient-il réellement, en euros ? Comparez à ce que la moyenne arithmétique laissait espérer.`,
          reponse: repRichesse, tolerance: 0.005, unite: '€',
          etapes: [
            {
              titre: en ? 'Chain the actual factors' : 'Chaîner les facteurs réels',
              contenu: en
                ? `${f(capital)} × ${f(facteurTotal, 4)} = **${eur(repRichesse)}**. Equivalently: ${f(capital)} × (1 + ${pct(repMoyG)})^${nbAnnees} — the geometric mean recomposes the actual wealth exactly.`
                : `${f(capital)} × ${f(facteurTotal, 4)} = **${eur(repRichesse)}**. De façon équivalente : ${f(capital)} × (1 + ${pct(repMoyG)})^${nbAnnees} — la moyenne géométrique recompose exactement la richesse réelle.`,
            },
            {
              titre: en ? 'The naive-mean mirage' : 'Le mirage de la moyenne naïve',
              contenu: en
                ? `Compounding the arithmetic mean would promise ${f(capital)} × (1 + ${pct(repMoyA)})^${nbAnnees} = **${eur(r2(naive))}**, i.e. ${eur(r2(naive - richesse))} too much. That gap is the volatility drag: −50% then +50% does not bring you back to par.`
                : `Composer la moyenne arithmétique promettrait ${f(capital)} × (1 + ${pct(repMoyA)})^${nbAnnees} = **${eur(r2(naive))}**, soit ${eur(r2(naive - richesse))} de trop. Cet écart est le « volatility drag » : −50 % puis +50 % ne ramènent pas au point de départ.`,
            },
          ],
          pieges: [en
            ? `Using the arithmetic mean to compound wealth always overstates it as soon as returns fluctuate — the right compounding rate is b).`
            : `Composer la richesse avec la moyenne arithmétique la surestime toujours dès que les rendements fluctuent — le bon taux de composition est le b).`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 4. m2-pb-portefeuille-2-actifs — N3                                 */
/* ------------------------------------------------------------------ */
const portefeuille2Actifs: ProblemGenerator = {
  id: 'm2-pb-portefeuille-2-actifs', moduleId: M2,
  titre: 'Diversifier un portefeuille à deux actifs',
  titreEn: 'Diversifying a two-asset portfolio',
  typeDeCas: 'portefeuille 2 actifs',
  typeDeCasEn: 'two-asset portfolio',
  difficulte: 3,
  scenarios: ["Allocataire d'actifs qui dose actions/obligations", 'Candidat CFA qui automatise la formule', 'Banquier privé face à un client sceptique'],
  scenariosEn: ['Asset allocator sizing an equity/bond mix', 'CFA candidate drilling the formula', 'Private banker facing a sceptical client'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const w1 = pick(rng, [0.3, 0.4, 0.5, 0.6, 0.7] as const);
    const rA = randFloat(rng, 6, 10, 1);
    const rB = randFloat(rng, 1.5, 4, 1);
    const sA = randFloat(rng, 12, 24, 1);
    const sB = randFloat(rng, 4, 9, 1);
    const rho = randFloat(rng, -0.3, 0.6, 1);

    const w2 = 1 - w1;
    const esp = esperancePortefeuille2(w1, rA, rB);
    const varP = variancePortefeuille2(w1, sA, sB, rho);
    const sig = Math.sqrt(varP);
    const sigRho1 = w1 * sA + w2 * sB;
    const gain = sigRho1 - sig;
    const terme1 = w1 ** 2 * sA ** 2;
    const terme2 = w2 ** 2 * sB ** 2;
    const termeCroise = 2 * w1 * w2 * rho * sA * sB;
    const repEsp = r2(esp);
    const repVar = r2(varP);
    const repSig = r2(sig);
    const repGain = r2(gain);
    const repSigRho1 = r2(sigRho1);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `${f(w1 * 100)}% in an equity fund (expected return ${pct(rA)}, volatility ${pct(sA)}) and ${f(w2 * 100)}% in a bond fund (expected return ${pct(rB)}, volatility ${pct(sB)}), with a correlation of ${f(rho, 1)} between the two`
      : `${f(w1 * 100)} % dans un fonds actions (rendement espéré ${pct(rA)}, volatilité ${pct(sA)}) et ${f(w2 * 100)} % dans un fonds obligataire (rendement espéré ${pct(rB)}, volatilité ${pct(sB)}), avec une corrélation de ${f(rho, 1)} entre les deux`;
    const contexte = (en
      ? [
        `As the house asset allocator, you calibrate the model portfolio: ${desc}. The allocation committee wants the full set of numbers — expected return, variance, volatility — and above all hard proof that diversification is working.`,
        `You are drilling the two-asset formula before the exam: ${desc}. The standard question asks for the expected return, the variance, the volatility, then the diversification gain — exactly the machinery to automate.`,
        `As a private banker, you present a cautious client with an allocation of ${desc}. The client does not believe in diversification: "mixing two risks means more risk". You are about to show him, numbers in hand, that the blend is calmer than its ingredients' average.`,
      ]
      : [
        `Allocataire d'actifs, vous calibrez le portefeuille modèle de la maison : ${desc}. Le comité d'allocation veut les chiffres complets — espérance, variance, volatilité — et surtout la preuve chiffrée que la diversification travaille.`,
        `Vous automatisez la formule du portefeuille à deux actifs avant l'examen : ${desc}. La question type demande l'espérance, la variance, la volatilité, puis le gain de diversification — exactement la mécanique à dérouler.`,
        `Banquier privé, vous présentez à un client prudent une allocation : ${desc}. Le client ne croit pas à la diversification : « mélanger deux risques, c'est plus de risque ». Vous allez lui montrer, chiffres à l'appui, que le mélange est plus calme que la moyenne de ses ingrédients.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The expected return' : "a) L'espérance de rendement",
          enonce: en ? `What is the portfolio's expected return, in %?` : `Quelle est l'espérance de rendement du portefeuille, en % ?`,
          reponse: repEsp, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'A simple weighted average' : 'Une simple moyenne pondérée',
            contenu: en
              ? `$E(R_p) = w_1 r_1 + w_2 r_2$ = ${f(w1, 2)} × ${f(rA, 1)} + ${f(w2, 2)} × ${f(rB, 1)} = **${pct(repEsp)}**. Expected returns blend linearly — correlation plays no role here.`
              : `$E(R_p) = w_1 r_1 + w_2 r_2$ = ${f(w1, 2)} × ${f(rA, 1)} + ${f(w2, 2)} × ${f(rB, 1)} = **${pct(repEsp)}**. Les espérances se mélangent linéairement — la corrélation n'y joue aucun rôle.`,
          }],
        },
        {
          intitule: en ? 'b) The portfolio variance' : 'b) La variance du portefeuille',
          enonce: en ? `Compute the portfolio variance, in %².` : `Calculez la variance du portefeuille, en %².`,
          reponse: repVar, tolerance: 0.01, unite: '%²',
          etapes: [
            {
              titre: en ? 'Three terms, not two' : 'Trois termes, pas deux',
              contenu: en
                ? `$\\sigma_p^2 = w_1^2\\sigma_1^2 + w_2^2\\sigma_2^2 + 2 w_1 w_2 \\rho \\sigma_1 \\sigma_2$:\n- $w_1^2\\sigma_1^2$ = ${f(terme1)}\n- $w_2^2\\sigma_2^2$ = ${f(terme2)}\n- cross term: 2 × ${f(w1, 2)} × ${f(w2, 2)} × ${f(rho, 1)} × ${f(sA, 1)} × ${f(sB, 1)} = ${f(termeCroise)}`
                : `$\\sigma_p^2 = w_1^2\\sigma_1^2 + w_2^2\\sigma_2^2 + 2 w_1 w_2 \\rho \\sigma_1 \\sigma_2$ :\n- $w_1^2\\sigma_1^2$ = ${f(terme1)}\n- $w_2^2\\sigma_2^2$ = ${f(terme2)}\n- terme croisé : 2 × ${f(w1, 2)} × ${f(w2, 2)} × ${f(rho, 1)} × ${f(sA, 1)} × ${f(sB, 1)} = ${f(termeCroise)}`,
            },
            {
              titre: en ? 'Sum' : 'Somme',
              contenu: en
                ? `$\\sigma_p^2$ = ${f(terme1)} + ${f(terme2)} ${termeCroise >= 0 ? '+' : '−'} ${f(Math.abs(termeCroise))} = **${f(repVar)} %²**. The whole game of diversification sits in the cross term.`
                : `$\\sigma_p^2$ = ${f(terme1)} + ${f(terme2)} ${termeCroise >= 0 ? '+' : '−'} ${f(Math.abs(termeCroise))} = **${f(repVar)} %²**. Tout l'enjeu de la diversification tient dans le terme croisé.`,
            },
          ],
          pieges: [en
            ? `Dropping the cross term gives ${f(r2(terme1 + terme2))} %²: that is the ρ = 0 case, not this portfolio.`
            : `Oublier le terme croisé donne ${f(r2(terme1 + terme2))} %² : c'est le cas ρ = 0, pas ce portefeuille.`],
        },
        {
          intitule: en ? 'c) The volatility' : 'c) La volatilité',
          enonce: en ? `Deduce the portfolio volatility, in %.` : `Déduisez-en la volatilité du portefeuille, en %.`,
          reponse: repSig, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Back to the right unit' : 'Revenir à la bonne unité',
            contenu: en
              ? `$\\sigma_p = \\sqrt{${f(repVar)}}$ = **${pct(repSig)}**. Variance is in %² — an unreadable unit; risk is always quoted as the standard deviation.`
              : `$\\sigma_p = \\sqrt{${f(repVar)}}$ = **${pct(repSig)}**. La variance est en %² — unité illisible ; le risque se cite toujours en écart-type.`,
          }],
        },
        {
          intitule: en ? 'd) The diversification gain' : 'd) Le gain de diversification',
          enonce: en
            ? `By how many points is the portfolio volatility below the weighted average of the two volatilities?`
            : `De combien de points la volatilité du portefeuille est-elle inférieure à la moyenne pondérée des deux volatilités ?`,
          reponse: repGain, tolerance: 0.05, toleranceMode: 'absolu', unite: 'pts',
          etapes: [
            {
              titre: en ? 'The no-diversification benchmark' : 'La référence sans diversification',
              contenu: en
                ? `Weighted average of the volatilities: ${f(w1, 2)} × ${f(sA, 1)} + ${f(w2, 2)} × ${f(sB, 1)} = **${pct(repSigRho1)}** — what the portfolio would risk if the two funds moved in lockstep.`
                : `Moyenne pondérée des volatilités : ${f(w1, 2)} × ${f(sA, 1)} + ${f(w2, 2)} × ${f(sB, 1)} = **${pct(repSigRho1)}** — le risque qu'aurait le portefeuille si les deux fonds bougeaient d'un seul bloc.`,
            },
            {
              titre: en ? 'The free lunch, measured' : 'Le repas gratuit, mesuré',
              contenu: en
                ? `Gain = ${f(repSigRho1)} − ${f(repSig)} = **${f(repGain)} pts** of volatility, given away by a correlation of ${f(rho, 1)} < 1. Markowitz's "only free lunch in finance" — module 12 builds an entire frontier on it.`
                : `Gain = ${f(repSigRho1)} − ${f(repSig)} = **${f(repGain)} pts** de volatilité, offerts par une corrélation de ${f(rho, 1)} < 1. Le « seul repas gratuit de la finance » selon Markowitz — le module 12 en fera toute une frontière.`,
            },
          ],
          pieges: [en
            ? `Comparing variances instead of volatilities inflates the story: the gain is quoted in points of σ, the unit risk is actually priced in.`
            : `Comparer des variances plutôt que des volatilités gonfle l'histoire : le gain se mesure en points de σ, l'unité dans laquelle le risque se paie réellement.`],
        },
        {
          intitule: en ? 'e) The ρ = 1 check' : 'e) Le recalcul à ρ = 1',
          enonce: en
            ? `If the correlation rose to 1, what would the portfolio volatility become, in %?`
            : `Si la corrélation montait à 1, que deviendrait la volatilité du portefeuille, en % ?`,
          reponse: repSigRho1, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'A perfect square' : 'Une identité remarquable',
            contenu: en
              ? `At ρ = 1, the variance becomes $(w_1\\sigma_1 + w_2\\sigma_2)^2$, so $\\sigma_p$ = ${f(w1, 2)} × ${f(sA, 1)} + ${f(w2, 2)} × ${f(sB, 1)} = **${pct(repSigRho1)}** — exactly the weighted average of d). With ρ = 1, the diversification gain vanishes to the last decimal: no offsetting moves, no free lunch.`
              : `À ρ = 1, la variance devient $(w_1\\sigma_1 + w_2\\sigma_2)^2$, donc $\\sigma_p$ = ${f(w1, 2)} × ${f(sA, 1)} + ${f(w2, 2)} × ${f(sB, 1)} = **${pct(repSigRho1)}** — exactement la moyenne pondérée du d). À ρ = 1, le gain de diversification disparaît à la décimale près : plus de compensations, plus de repas gratuit.`,
          }],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 5. m2-pb-bayes-diagnostic — N3                                      */
/* ------------------------------------------------------------------ */
const bayesDiagnostic: ProblemGenerator = {
  id: 'm2-pb-bayes-diagnostic', moduleId: M2,
  titre: 'Lire un test au travers de Bayes',
  titreEn: 'Reading a test through Bayes',
  typeDeCas: 'probabilités conditionnelles & Bayes',
  typeDeCasEn: 'conditional probability & Bayes',
  difficulte: 3,
  scenarios: ['Dépistage médical en population générale', 'Signal quantitatif sur actions', "Détection de fraude à l'audit"],
  scenariosEn: ['Medical screening in the general population', 'Quantitative equity signal', 'Fraud detection in an audit'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const prevalence = randFloat(rng, 0.5, 4, 1);
    const sensibilite = randInt(rng, 86, 99);
    const fauxPos = randFloat(rng, 3, 10, 1);
    const population = pick(rng, [10000, 100000] as const);

    const p = prevalence / 100;
    const se = sensibilite / 100;
    const fp = fauxPos / 100;
    const pPositif = se * p + fp * (1 - p);
    const ppv = bayes(p, se, fp);
    const malades = population * p;
    const sains = population * (1 - p);
    const vrais = Math.round(malades * se);
    const fauxEff = Math.round(sains * fp);
    const ppvDouble = bayes(2 * p, se, fp);
    const repPPos = r2(pPositif * 100);
    const repPpv = r2(ppv * 100);
    const repPpvDouble = r2(ppvDouble * 100);

    const { en, f, pct } = outils(langue);
    const contexte = (en
      ? [
        `Public-health authorities screen for a disease with a prevalence of ${pct(prevalence)} in the general population. The test detects ${pct(sensibilite)} of true cases, but also rings on healthy patients with a false-positive rate of ${pct(fauxPos)}. The campaign will cover ${f(population)} people — and your job is to tell every positive patient what the result actually means.`,
        `Your quant desk built a buy signal: historically, ${pct(prevalence)} of trading days carry a genuine opportunity; the signal detects ${pct(sensibilite)} of them, but also fires wrongly on a false-positive rate of ${pct(fauxPos)} of ordinary days. Over the ${f(population)} observations of the backtest, you must say what a triggered signal is really worth.`,
        `In the anti-fraud unit of an audit firm, a prevalence of ${pct(prevalence)} of the files reviewed are fraudulent. The detection model detects ${pct(sensibilite)} of frauds, at the cost of a false-positive rate of ${pct(fauxPos)} on clean files. This year's book counts ${f(population)} people and files to review — the committee wants to know how many alerts will be true frauds.`,
      ]
      : [
        `Les autorités sanitaires dépistent une maladie dont la prévalence est de ${pct(prevalence)} en population générale. Le test détecte ${pct(sensibilite)} des vrais malades, mais sonne aussi chez les bien-portants avec un taux de faux positifs de ${pct(fauxPos)}. La campagne couvrira ${f(population)} personnes — et c'est à vous d'expliquer à chaque patient positif ce que son résultat veut vraiment dire.`,
        `Votre desk quantitatif a construit un signal d'achat : sur l'historique, ${pct(prevalence)} des journées portent une vraie opportunité ; le signal en détecte ${pct(sensibilite)}, mais se déclenche aussi à tort sur ${pct(fauxPos)} des journées ordinaires. Sur les ${f(population)} observations du backtest, vous devez dire ce que vaut réellement un signal qui sonne.`,
        `Cellule antifraude d'un cabinet d'audit : ${pct(prevalence)} des dossiers contrôlés sont frauduleux. Le modèle de détection repère ${pct(sensibilite)} des fraudes, au prix d'alertes à tort sur ${pct(fauxPos)} des dossiers sains. Le portefeuille de l'année compte ${f(population)} dossiers — le comité veut savoir combien d'alertes seront de vraies fraudes.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The total probability of a positive' : "a) La probabilité totale d'un positif",
          enonce: en
            ? `What is the overall probability that a randomly chosen case turns out positive, in %?`
            : `Quelle est la probabilité totale qu'un cas pris au hasard ressorte positif, en % ?`,
          reponse: repPPos, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Two paths lead to a positive' : 'Deux chemins mènent au positif',
            contenu: en
              ? `Total probability: $P(+) = P(+|vrai) P(vrai) + P(+|sain) P(sain)$ = ${f(se, 2)} × ${f(p, 3)} + ${f(fp, 3)} × ${f(1 - p, 3)} = ${f(se * p, 4)} + ${f(fp * (1 - p), 4)} = **${pct(repPPos)}**. The second path — false alarms on the healthy mass — usually dominates.`
              : `Probabilités totales : $P(+) = P(+|vrai) P(vrai) + P(+|sain) P(sain)$ = ${f(se, 2)} × ${f(p, 3)} + ${f(fp, 3)} × ${f(1 - p, 3)} = ${f(se * p, 4)} + ${f(fp * (1 - p), 4)} = **${pct(repPPos)}**. Le second chemin — les fausses alertes sur la masse des cas sains — domine le plus souvent.`,
          }],
          pieges: [en
            ? `Keeping only the first branch (${pct(r2(se * p * 100))}) forgets that healthy cases can also ring the bell.`
            : `Ne garder que la première branche (${pct(r2(se * p * 100))}) oublie que les cas sains peuvent aussi déclencher l'alerte.`],
        },
        {
          intitule: en ? 'b) Bayes: what a positive is worth' : "b) Bayes : ce que vaut un positif",
          enonce: en
            ? `Given a positive result, what is the probability it is a true positive, in %?`
            : `Sachant un résultat positif, quelle est la probabilité qu'il soit un vrai positif, en % ?`,
          reponse: repPpv, tolerance: 0.1, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'Invert with Bayes' : 'Inverser avec Bayes',
              contenu: en
                ? `$P(vrai|+) = \\frac{P(+|vrai) P(vrai)}{P(+)}$ = ${f(se * p, 4)} / ${f(pPositif, 4)} = **${pct(repPpv)}**.`
                : `$P(vrai|+) = \\frac{P(+|vrai) P(vrai)}{P(+)}$ = ${f(se * p, 4)} / ${f(pPositif, 4)} = **${pct(repPpv)}**.`,
            },
            {
              titre: en ? 'Why so low?' : 'Pourquoi si peu ?',
              contenu: en
                ? `A test that "detects ${pct(sensibilite)} of cases" still leaves a positive only **${pct(repPpv)}** credible — because the phenomenon is rare (${pct(prevalence)}). The ${pct(fauxPos)} of false alarms applies to the huge healthy mass and drowns the true positives.`
                : `Un test qui « détecte ${pct(sensibilite)} des cas » ne rend pourtant un positif crédible qu'à **${pct(repPpv)}** — parce que le phénomène est rare (${pct(prevalence)}). Les ${pct(fauxPos)} de fausses alertes s'appliquent à la masse énorme des cas sains et noient les vrais positifs.`,
            },
          ],
          pieges: [en
            ? `Answering ${pct(sensibilite)} confuses P(+|true) with P(true|+): inverting the conditioning is precisely the exam trap.`
            : `Répondre ${pct(sensibilite)} confond P(+|vrai) et P(vrai|+) : l'inversion du conditionnement est exactement le piège d'examen.`],
        },
        {
          intitule: en ? 'c) The head-count reading' : 'c) La lecture en effectifs',
          enonce: en
            ? `Out of the ${f(population)} cases reviewed, how many positives will be true positives? (round to the unit)`
            : `Sur les ${f(population)} cas examinés, combien de positifs seront de vrais positifs ? (arrondissez à l'unité)`,
          reponse: vrais, tolerance: 1, toleranceMode: 'absolu',
          etapes: [
            {
              titre: en ? 'Build the 2 × 2 table' : 'Construire le tableau 2 × 2',
              contenu: en
                ? `True cases: ${f(population)} × ${f(p, 3)} = ${f(malades, 0)}, of which ${f(malades, 0)} × ${f(se, 2)} = **${f(vrais, 0)}** are detected. Healthy cases: ${f(sains, 0)}, of which ${f(sains, 0)} × ${f(fp, 3)} = **${f(fauxEff, 0)}** ring wrongly.`
                : `Vrais cas : ${f(population)} × ${f(p, 3)} = ${f(malades, 0)}, dont ${f(malades, 0)} × ${f(se, 2)} = **${f(vrais, 0)}** détectés. Cas sains : ${f(sains, 0)}, dont ${f(sains, 0)} × ${f(fp, 3)} = **${f(fauxEff, 0)}** sonnent à tort.`,
            },
            {
              titre: en ? 'Cross-check Bayes' : 'Recouper Bayes',
              contenu: en
                ? `Total positives ≈ ${f(vrais + fauxEff, 0)}; share of true ones: ${f(vrais, 0)} / ${f(vrais + fauxEff, 0)} ≈ **${pct(repPpv)}** — b) again. Head counts make Bayes obvious: the formula only divides one cell of the table by its column.`
                : `Total des positifs ≈ ${f(vrais + fauxEff, 0)} ; part des vrais : ${f(vrais, 0)} / ${f(vrais + fauxEff, 0)} ≈ **${pct(repPpv)}** — on retrouve le b). Les effectifs rendent Bayes évident : la formule ne fait que diviser une case du tableau par sa colonne.`,
            },
          ],
        },
        {
          intitule: en ? 'd) Doubling the prevalence' : 'd) La sensibilité à la prévalence',
          enonce: en
            ? `The prevalence doubles (${pct(prevalence)} → ${pct(r1(2 * prevalence))}), the test unchanged. What does the probability of b) become, in %?`
            : `La prévalence double (${pct(prevalence)} → ${pct(r1(2 * prevalence))}), le test restant identique. Que devient la probabilité du b), en % ?`,
          reponse: repPpvDouble, tolerance: 0.1, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'Same Bayes, new prior' : 'Même Bayes, nouveau prior',
              contenu: en
                ? `$P(vrai|+)$ = ${f(se * 2 * p, 4)} / (${f(se * 2 * p, 4)} + ${f(fp * (1 - 2 * p), 4)}) = **${pct(repPpvDouble)}**, against ${pct(repPpv)} before.`
                : `$P(vrai|+)$ = ${f(se * 2 * p, 4)} / (${f(se * 2 * p, 4)} + ${f(fp * (1 - 2 * p), 4)}) = **${pct(repPpvDouble)}**, contre ${pct(repPpv)} auparavant.`,
            },
            {
              titre: en ? 'The terrain matters as much as the tool' : "Le terrain compte autant que l'outil",
              contenu: en
                ? `The test did not change, yet a positive became markedly more credible (×${f(r2(ppvDouble / ppv), 2)}, and less than ×2: Bayes is not linear in the prior). The value of a signal depends on the base rate of what it hunts — screening rich terrain first beats sharpening the tool.`
                : `Le test n'a pas changé, et pourtant un positif est devenu nettement plus crédible (×${f(r2(ppvDouble / ppv), 2)}, et moins que ×2 : Bayes n'est pas linéaire dans le prior). La valeur d'un signal dépend du taux de base de ce qu'il traque — cibler un terrain riche vaut mieux qu'affûter l'outil.`,
            },
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 6. m2-pb-binomiale-trading — N2                                     */
/* ------------------------------------------------------------------ */
const binomialeTrading: ProblemGenerator = {
  id: 'm2-pb-binomiale-trading', moduleId: M2,
  titre: 'Compter les succès : la binomiale',
  titreEn: 'Counting successes: the binomial',
  typeDeCas: 'loi binomiale',
  typeDeCasEn: 'binomial distribution',
  difficulte: 2,
  scenarios: ['Desk de prop trading', 'Campagne de recrutement', "Backtest d'une stratégie mensuelle"],
  scenariosEn: ['Proprietary trading desk', 'Recruitment campaign', 'Backtest of a monthly strategy'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const n = randInt(rng, 8, 12);
    const p = pick(rng, [0.4, 0.45, 0.5, 0.55, 0.6] as const);
    const k = Math.min(n, Math.round(n * p) + randInt(rng, 1, 2));

    const pExact = probaBinomiale(n, k, p);
    const pAuMoinsV = probaAuMoins(n, k, p);
    const esper = esperanceBinomiale(n, p);
    const varB = n * p * (1 - p);
    const sigB = Math.sqrt(varB);
    const cnk = combinaisons(n, k);
    const repExact = r2(pExact * 100);
    const repAuMoins = r2(pAuMoinsV * 100);
    const repEsper = r2(esper);
    const repSig = r2(sigB);

    const { en, f, pct } = outils(langue);
    const contexte = (en
      ? [
        `On a prop desk, you frame the month ahead: you will take ${n} independent trades, and each one has a ${pct(p * 100)} probability of closing at a profit. Before risking capital, you want the full picture: the odds of exactly ${k} winners, of at least ${k}, and the expected spread around the average.`,
        `You run a recruitment campaign: ${n} independent trades of luck for the candidates, so to speak — each of the ${n} applicants passes the screening test with a ${pct(p * 100)} probability, independently of the others. Management wants to anticipate the headcount: exactly ${k} hires, at least ${k}, and the reasonable range around the mean.`,
        `You backtest a monthly strategy: over ${n} independent trades — one per month — the strategy beats its index with a ${pct(p * 100)} probability each time. Before presenting the backtest, you quantify: exactly ${k} winning months, at least ${k}, and the standard deviation of the success count.`,
      ]
      : [
        `Sur un desk de prop trading, vous cadrez le mois à venir : ${n} trades indépendants, chacun ayant une probabilité de ${pct(p * 100)} de finir gagnant. Avant d'engager le capital, vous voulez le tableau complet : la probabilité d'exactement ${k} gagnants, celle d'en avoir au moins ${k}, et la dispersion attendue autour de la moyenne.`,
        `Vous pilotez une campagne de recrutement : ${n} candidats passent un test de sélection que chacun réussit avec une probabilité de ${pct(p * 100)}, indépendamment des autres. La direction veut anticiper le nombre d'admis : exactement ${k}, au moins ${k}, et la fourchette raisonnable autour de la moyenne.`,
        `Vous backtestez une stratégie mensuelle : sur ${n} mois, la stratégie bat son indice avec une probabilité de ${pct(p * 100)} chaque mois, les mois étant supposés indépendants. Avant de présenter le backtest, vous chiffrez : exactement ${k} mois gagnants, au moins ${k}, et l'écart-type du nombre de succès.`,
      ])[sIdx];

    const lignesSomme = Array.from({ length: n - k + 1 }, (_, j) => {
      const i = k + j;
      return `- P(X = ${i}) = ${pct(r2(probaBinomiale(n, i, p) * 100))}`;
    }).join('\n');

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? `a) Exactly ${k} successes` : `a) Exactement ${k} succès`,
          enonce: en
            ? `What is the probability of exactly ${k} successes out of ${n}, in %?`
            : `Quelle est la probabilité d'obtenir exactement ${k} succès sur ${n}, en % ?`,
          reponse: repExact, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'Count the paths' : 'Compter les chemins',
              contenu: en
                ? `$C(${n}, ${k})$ = **${f(cnk, 0)}** orderings lead to ${k} successes out of ${n} — the binomial coefficient counts them all.`
                : `$C(${n}, ${k})$ = **${f(cnk, 0)}** ordonnancements mènent à ${k} succès sur ${n} — le coefficient binomial les compte tous.`,
            },
            {
              titre: en ? 'Weight each path' : 'Pondérer chaque chemin',
              contenu: en
                ? `Each path has probability $p^{${k}}(1-p)^{${n - k}}$ = ${f(p ** k * (1 - p) ** (n - k), 6)}. Hence $P(X = ${k})$ = ${f(cnk, 0)} × ${f(p ** k * (1 - p) ** (n - k), 6)} = **${pct(repExact)}**.`
                : `Chaque chemin a pour probabilité $p^{${k}}(1-p)^{${n - k}}$ = ${f(p ** k * (1 - p) ** (n - k), 6)}. D'où $P(X = ${k})$ = ${f(cnk, 0)} × ${f(p ** k * (1 - p) ** (n - k), 6)} = **${pct(repExact)}**.`,
            },
          ],
          pieges: [en
            ? `Forgetting the coefficient gives ${pct(r2(p ** k * (1 - p) ** (n - k) * 100))}: that is the probability of ONE specific ordering, not of the event.`
            : `Oublier le coefficient donne ${pct(r2(p ** k * (1 - p) ** (n - k) * 100))} : c'est la probabilité d'UN ordonnancement précis, pas de l'événement.`],
        },
        {
          intitule: en ? `b) At least ${k} successes` : `b) Au moins ${k} succès`,
          enonce: en
            ? `What is the probability of at least ${k} successes, in %?`
            : `Quelle est la probabilité d'obtenir au moins ${k} succès, en % ?`,
          reponse: repAuMoins, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Sum the upper tail' : 'Sommer la queue haute',
            contenu: en
              ? `"At least ${k}" stacks every count from ${k} to ${n}:\n${lignesSomme}\n\nTotal: **${pct(repAuMoins)}** — necessarily ≥ a), which is just its first term.`
              : `« Au moins ${k} » additionne tous les comptes de ${k} à ${n} :\n${lignesSomme}\n\nTotal : **${pct(repAuMoins)}** — nécessairement ≥ a), qui n'en est que le premier terme.`,
          }],
          pieges: [en
            ? `Mixing up "exactly" and "at least" is the classic slip: the difference here is ${pct(r2((pAuMoinsV - pExact) * 100))}, the weight of the counts above ${k}.`
            : `Confondre « exactement » et « au moins » est l'erreur classique : la différence vaut ici ${pct(r2((pAuMoinsV - pExact) * 100))}, le poids des comptes au-delà de ${k}.`],
        },
        {
          intitule: en ? 'c) The expected count' : "c) L'espérance",
          enonce: en ? `How many successes do you expect on average?` : `Combien de succès attend-on en moyenne ?`,
          reponse: repEsper, tolerance: 0.02, toleranceMode: 'absolu',
          unite: en ? 'successes' : 'succès',
          etapes: [{
            titre: en ? 'E[X] = np' : 'E[X] = np',
            contenu: en
              ? `$E[X] = n p$ = ${n} × ${f(p, 2)} = **${f(repEsper)}** successes. No combinatorics needed: expectations add up, even for dependent draws.`
              : `$E[X] = n p$ = ${n} × ${f(p, 2)} = **${f(repEsper)}** succès. Aucune combinatoire nécessaire : les espérances s'additionnent, même pour des tirages dépendants.`,
          }],
        },
        {
          intitule: en ? 'd) The standard deviation' : "d) L'écart-type",
          enonce: en ? `What is the standard deviation of the success count?` : `Quel est l'écart-type du nombre de succès ?`,
          reponse: repSig, tolerance: 0.02, toleranceMode: 'absolu',
          unite: en ? 'successes' : 'succès',
          etapes: [
            {
              titre: en ? 'Variance, then root' : 'Variance, puis racine',
              contenu: en
                ? `$Var(X) = n p (1-p)$ = ${n} × ${f(p, 2)} × ${f(1 - p, 2)} = ${f(varB, 2)}, hence $\\sigma$ = **${f(repSig)}**.`
                : `$Var(X) = n p (1-p)$ = ${n} × ${f(p, 2)} × ${f(1 - p, 2)} = ${f(varB, 2)}, d'où $\\sigma$ = **${f(repSig)}**.`,
            },
            {
              titre: en ? 'Read the range' : 'Lire la fourchette',
              contenu: en
                ? `The "mean ± 2σ" band, ${f(r2(esper - 2 * sigB))} to ${f(r2(esper + 2 * sigB))} successes, covers the vast majority of scenarios: anything outside deserves an explanation other than luck.`
                : `La fourchette « moyenne ± 2σ », de ${f(r2(esper - 2 * sigB))} à ${f(r2(esper + 2 * sigB))} succès, couvre l'immense majorité des scénarios : tout résultat en dehors mérite une autre explication que la chance.`,
            },
          ],
          pieges: [en
            ? `Reporting the variance ${f(r2(varB))} instead of its root: the question asks for a spread in number of successes, not in successes squared.`
            : `Rendre la variance ${f(r2(varB))} au lieu de sa racine : la question demande une dispersion en nombre de succès, pas en succès au carré.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 7. m2-pb-objectif-normal — N2                                       */
/* ------------------------------------------------------------------ */
const objectifNormal: ProblemGenerator = {
  id: 'm2-pb-objectif-normal', moduleId: M2,
  titre: "Atteindre l'objectif sous la loi normale",
  titreEn: 'Hitting a target under the normal law',
  typeDeCas: 'loi normale',
  typeDeCasEn: 'normal distribution',
  difficulte: 2,
  scenarios: ['Épargnant avec un objectif annuel', 'Assureur qui borne un rendement', 'Gérant face à son budget de risque'],
  scenariosEn: ['Saver with an annual target', 'Insurer bounding a return', 'Manager against a risk budget'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const mu = randFloat(rng, 4, 8, 1);
    const sigma = randFloat(rng, 9, 18, 1);
    const objectif = r1(mu + randFloat(rng, 3, 9, 1));

    const zObj = zScore(objectif, mu, sigma);
    const pAtteinte = (1 - normaleCdf(zObj)) * 100;
    const zPerte = zScore(0, mu, sigma);
    const pPerte = normaleCdf(zPerte) * 100;
    const q5 = mu - 1.645 * sigma;
    const repZ = r2(zObj);
    const repAtteinte = r2(pAtteinte);
    const repPerte = r2(pPerte);
    const repQ5 = r2(q5);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `the annual return is modelled as a normal law with a mean of ${pct(mu)} and a standard deviation of ${pct(sigma)}. The target for the year is ${pct(objectif)}`
      : `le rendement annuel est modélisé par une loi normale de moyenne ${pct(mu)} et d'écart-type ${pct(sigma)}. L'objectif de l'année est de ${pct(objectif)}`;
    const contexte = (en
      ? [
        `You have entrusted your savings to a diversified fund: ${desc}, set with your adviser to fund a project. Before committing, you want probabilities, not promises: is the target reachable? Is a loss plausible? What does the dark scenario look like?`,
        `As an actuary at an insurer, you frame a product with an annual window: ${desc}, the level beyond which the product pays a bonus. The risk committee demands exact probabilities — bonus, loss, and the level the return only breaches downward one year in twenty.`,
        `As a portfolio manager, you defend your risk budget before the committee: ${desc}, the figure displayed in the mandate. You are asked for the probability of reaching it, the probability of ending the year in the red, and the 5% quantile that will serve as the adverse scenario.`,
      ]
      : [
        `Vous avez confié votre épargne à un fonds diversifié : ${desc}, fixé avec votre conseiller pour financer un projet. Avant de vous engager, vous voulez des probabilités, pas des promesses : objectif atteignable ? perte plausible ? à quoi ressemble le scénario noir ?`,
        `Actuaire chez un assureur, vous cadrez un produit à fenêtre annuelle : ${desc}, le niveau au-delà duquel le produit verse un bonus. Le comité des risques exige des probabilités exactes — bonus, perte, et le niveau que le rendement ne franchit à la baisse qu'une année sur vingt.`,
        `Gérant, vous défendez votre budget de risque devant le comité : ${desc}, la cible affichée au mandat. On vous demande la probabilité de l'atteindre, celle de finir l'année en perte, et le quantile à 5 % qui servira de scénario adverse.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The z-score of the target' : "a) Le z-score de l'objectif",
          enonce: en
            ? `How many standard deviations does the target sit above the mean? (z-score)`
            : `À combien d'écarts-types l'objectif se situe-t-il au-dessus de la moyenne ? (z-score)`,
          reponse: repZ, tolerance: 0.02, toleranceMode: 'absolu',
          etapes: [{
            titre: en ? 'Standardise' : 'Centrer-réduire',
            contenu: en
              ? `$z = \\frac{x - \\mu}{\\sigma}$ = (${f(objectif, 1)} − ${f(mu, 1)}) / ${f(sigma, 1)} = **${f(repZ)}**. The z-score converts any normal question into a single table — that is its whole point.`
              : `$z = \\frac{x - \\mu}{\\sigma}$ = (${f(objectif, 1)} − ${f(mu, 1)}) / ${f(sigma, 1)} = **${f(repZ)}**. Le z-score ramène toute question normale à une seule table — c'est tout son intérêt.`,
          }],
          pieges: [en
            ? `Forgetting to divide by σ leaves ${f(r1(objectif - mu), 1)} — a gap in points, not in standard deviations.`
            : `Oublier de diviser par σ laisse ${f(r1(objectif - mu), 1)} — un écart en points, pas en écarts-types.`],
        },
        {
          intitule: en ? 'b) The probability of reaching the target' : "b) La probabilité d'atteindre l'objectif",
          enonce: en
            ? `What is the probability that the year's return reaches or beats ${pct(objectif)}, in %?`
            : `Quelle est la probabilité que le rendement de l'année atteigne ou dépasse ${pct(objectif)}, en % ?`,
          reponse: repAtteinte, tolerance: 0.5, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The upper tail' : 'La queue haute',
            contenu: en
              ? `$P(X \\geq ${f(objectif, 1)}) = 1 - \\Phi(${f(repZ)})$ = 1 − ${f(normaleCdf(zObj), 4)} = **${pct(repAtteinte)}**. Roughly one year in ${f(Math.round(100 / pAtteinte), 0)} clears the bar — the target is an ambition, not a baseline.`
              : `$P(X \\geq ${f(objectif, 1)}) = 1 - \\Phi(${f(repZ)})$ = 1 − ${f(normaleCdf(zObj), 4)} = **${pct(repAtteinte)}**. Environ une année sur ${f(Math.round(100 / pAtteinte), 0)} franchit la barre — l'objectif est une ambition, pas un scénario central.`,
          }],
          pieges: [en
            ? `Answering Φ(z) = ${pct(r2(normaleCdf(zObj) * 100))} gives the probability of staying BELOW the target — the exact complement.`
            : `Répondre Φ(z) = ${pct(r2(normaleCdf(zObj) * 100))} donne la probabilité de rester SOUS l'objectif — le complément exact.`],
        },
        {
          intitule: en ? 'c) The probability of a loss' : 'c) La probabilité de perte',
          enonce: en
            ? `What is the probability that the return ends the year negative, in %?`
            : `Quelle est la probabilité que le rendement finisse l'année en territoire négatif, en % ?`,
          reponse: repPerte, tolerance: 0.5, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Standardise zero' : 'Centrer-réduire le zéro',
            contenu: en
              ? `z of the 0% threshold: (0 − ${f(mu, 1)}) / ${f(sigma, 1)} = ${f(r2(zPerte))}. By symmetry, $\\Phi(${f(r2(zPerte))}) = 1 - \\Phi(${f(r2(-zPerte))})$ = **${pct(repPerte)}**. Despite a positive expected return, the volatility keeps a loss on the table roughly one year in ${f(Math.round(100 / pPerte), 0)}.`
              : `z du seuil 0 % : (0 − ${f(mu, 1)}) / ${f(sigma, 1)} = ${f(r2(zPerte))}. Par symétrie, $\\Phi(${f(r2(zPerte))}) = 1 - \\Phi(${f(r2(-zPerte))})$ = **${pct(repPerte)}**. Malgré une espérance positive, la volatilité maintient la perte au menu environ une année sur ${f(Math.round(100 / pPerte), 0)}.`,
          }],
        },
        {
          intitule: en ? 'd) The 5% quantile' : 'd) Le quantile à 5 %',
          enonce: en
            ? `Which return level is only breached downward with a 5% probability? (in %)`
            : `Quel niveau de rendement n'est franchi à la baisse qu'avec 5 % de probabilité ? (en %)`,
          reponse: repQ5, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'Invert the table at 5%' : 'Inverser la table à 5 %',
              contenu: en
                ? `The 5% quantile of the standard normal is z = −1.645, so $x = \\mu - 1.645\\,\\sigma$ = ${f(mu, 1)} − 1.645 × ${f(sigma, 1)} = **${pct(repQ5)}**.`
                : `Le quantile à 5 % de la normale centrée réduite est z = −1,645, donc $x = \\mu - 1{,}645\\,\\sigma$ = ${f(mu, 1)} − 1,645 × ${f(sigma, 1)} = **${pct(repQ5)}**.`,
            },
            {
              titre: en ? 'A VaR before its name' : 'Une VaR avant la lettre',
              contenu: en
                ? `Read aloud: "one year in twenty, the return falls below ${pct(repQ5)}". That number IS a one-year Gaussian VaR at 95% — module 12 will turn it into a central risk tool, and warn that fat tails make the Gaussian version optimistic.`
                : `Lu à voix haute : « une année sur vingt, le rendement tombe sous ${pct(repQ5)} ». Ce chiffre EST une VaR gaussienne à 95 % à horizon un an — le module 12 en fera un outil central du risque, et préviendra que les queues épaisses rendent la version gaussienne optimiste.`,
            },
          ],
          pieges: [en
            ? `Using 1.96 instead of 1.645 gives ${pct(r2(mu - 1.96 * sigma))}: that is the 2.5% quantile — the two-sided habit applied to a one-sided question.`
            : `Utiliser 1,96 au lieu de 1,645 donne ${pct(r2(mu - 1.96 * sigma))} : c'est le quantile à 2,5 % — le réflexe bilatéral appliqué à une question unilatérale.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 8. m2-pb-backtest-ic — N3                                           */
/* ------------------------------------------------------------------ */
const backtestIc: ProblemGenerator = {
  id: 'm2-pb-backtest-ic', moduleId: M2,
  titre: "L'intervalle de confiance d'un backtest",
  titreEn: 'Confidence interval on a backtest',
  typeDeCas: 'inférence statistique',
  typeDeCasEn: 'statistical inference',
  difficulte: 3,
  scenarios: ['Quant qui documente sa stratégie', 'Allocateur qui challenge un gérant', "Investisseur sceptique face à un argumentaire"],
  scenariosEn: ['Quant documenting a strategy', 'Allocator challenging a manager', 'Sceptical investor probing a pitch'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const m = randFloat(rng, 0.3, 1.1, 2);
    const s = randFloat(rng, 2, 5, 1);
    const n = pick(rng, [36, 48, 64, 100] as const);

    const se = s / Math.sqrt(n);
    const ic = intervalleConfiance(m, s, n);
    const significatif = ic.basse > 0;
    const repSe = r3(se);
    const repBasse = r2(ic.basse);
    const repHaute = r2(ic.haute);
    const repN = 4 * n;

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `an average monthly excess return of ${pct(m)} with a standard deviation of ${pct(s)}, over ${n} months of backtest`
      : `un rendement mensuel excédentaire moyen de ${pct(m)}, avec un écart-type de ${pct(s)}, sur ${n} mois de backtest`;
    const contexte = (en
      ? [
        `As a quant, you document your strategy ahead of the committee: the backtest shows ${desc}. The average is positive — but the committee will only sign if sampling luck is not enough to explain it.`,
        `As an allocator, you challenge a manager presenting ${desc}. His pitch stops at the mean; yours starts at the standard error: how fragile is that number, and how much more history would firm it up?`,
        `An adviser pitches you a strategy showing ${desc}. Before investing, you run the only computation that matters: the interval that has a 95% chance of containing the true performance — and whether it contains zero.`,
      ]
      : [
        `Quant, vous documentez votre stratégie avant le comité : le backtest affiche ${desc}. La moyenne est positive — mais le comité ne signera que si le hasard d'échantillonnage ne suffit pas à l'expliquer.`,
        `Allocateur, vous challengez un gérant qui présente ${desc}. Son argumentaire s'arrête à la moyenne ; le vôtre commence à l'erreur standard : à quel point ce chiffre est-il fragile, et combien d'historique le consoliderait ?`,
        `Un conseiller vous vante une stratégie affichant ${desc}. Avant d'investir, vous faites le seul calcul qui compte : l'intervalle qui a 95 % de chances de contenir la vraie performance — et la question de savoir s'il contient zéro.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The standard error' : "a) L'erreur standard",
          enonce: en
            ? `What is the standard error of the monthly mean, in points of %?`
            : `Quelle est l'erreur standard de la moyenne mensuelle, en points de % ?`,
          reponse: repSe, tolerance: 0.02, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'σ over √n' : 'σ sur √n',
            contenu: en
              ? `$SE = \\frac{s}{\\sqrt{n}}$ = ${f(s, 1)} / ${f(Math.sqrt(n), 3)} = **${f(repSe, 3)} pts**. The mean of ${n} noisy months is far steadier than any single month — but only √n times, not n times.`
              : `$SE = \\frac{s}{\\sqrt{n}}$ = ${f(s, 1)} / ${f(Math.sqrt(n), 3)} = **${f(repSe, 3)} pts**. La moyenne de ${n} mois bruités est bien plus stable qu'un mois isolé — mais seulement √n fois, pas n fois.`,
          }],
          pieges: [en
            ? `Dividing by n instead of √n gives ${f(r3(s / n), 3)}: the error would look implausibly small.`
            : `Diviser par n au lieu de √n donne ${f(r3(s / n), 3)} : l'erreur paraîtrait invraisemblablement petite.`],
        },
        {
          intitule: en ? 'b) The lower bound of the 95% CI' : "b) La borne basse de l'IC à 95 %",
          enonce: en
            ? `What is the lower bound of the 95% confidence interval around the mean, in %?`
            : `Quelle est la borne basse de l'intervalle de confiance à 95 % autour de la moyenne, en % ?`,
          reponse: repBasse, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Mean minus 1.96 SE' : 'Moyenne moins 1,96 SE',
            contenu: en
              ? `Lower bound = ${f(m)} − 1.96 × ${f(repSe, 3)} = **${pct(repBasse)}**. The 1.96 comes straight from the normal law: 95% of the probability lies within ±1.96 standard errors.`
              : `Borne basse = ${f(m)} − 1,96 × ${f(repSe, 3)} = **${pct(repBasse)}**. Le 1,96 sort tout droit de la loi normale : 95 % de la probabilité tient dans ±1,96 erreur standard.`,
          }],
        },
        {
          intitule: en ? 'c) The upper bound — and the verdict' : 'c) La borne haute — et le verdict',
          enonce: en
            ? `What is the upper bound, in %? Does the interval contain 0?`
            : `Quelle est la borne haute, en % ? L'intervalle contient-il 0 ?`,
          reponse: repHaute, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'Mean plus 1.96 SE' : 'Moyenne plus 1,96 SE',
              contenu: en
                ? `Upper bound = ${f(m)} + 1.96 × ${f(repSe, 3)} = **${pct(repHaute)}**.`
                : `Borne haute = ${f(m)} + 1,96 × ${f(repSe, 3)} = **${pct(repHaute)}**.`,
            },
            {
              titre: en ? 'Read the interval' : "Lire l'intervalle",
              contenu: en
                ? (significatif
                  ? `The interval [${f(repBasse)} ; ${f(repHaute)}] does **not** contain 0: at the 5% level, the average outperformance is significantly positive. Luck alone struggles to produce such a track record.`
                  : `The interval [${f(repBasse)} ; ${f(repHaute)}] **contains 0**: at the 5% level, one cannot rule out that the true performance is nil. The displayed mean may be nothing but noise — more history, or more humility.`)
                : (significatif
                  ? `L'intervalle [${f(repBasse)} ; ${f(repHaute)}] ne contient **pas** 0 : au seuil de 5 %, la surperformance moyenne est significativement positive. La chance seule produit difficilement un tel historique.`
                  : `L'intervalle [${f(repBasse)} ; ${f(repHaute)}] **contient 0** : au seuil de 5 %, impossible d'exclure que la vraie performance soit nulle. La moyenne affichée peut n'être que du bruit — plus d'historique, ou plus d'humilité.`),
            },
          ],
          pieges: [en
            ? `Concluding from the sign of the mean alone: a positive average says nothing until it is compared with its own sampling noise.`
            : `Conclure sur le seul signe de la moyenne : une moyenne positive ne dit rien tant qu'elle n'est pas comparée à son propre bruit d'échantillonnage.`],
        },
        {
          intitule: en ? 'd) Halving the error' : "d) Diviser l'erreur par deux",
          enonce: en
            ? `How many months of history would be needed to halve the standard error?`
            : `Combien de mois d'historique faudrait-il pour diviser l'erreur standard par deux ?`,
          reponse: repN, tolerance: 1, toleranceMode: 'absolu',
          unite: en ? 'months' : 'mois',
          etapes: [{
            titre: en ? 'The square-root law' : 'La loi de la racine carrée',
            contenu: en
              ? `$SE \\propto 1/\\sqrt{n}$: halving the error requires **quadrupling** the sample, i.e. 4 × ${n} = **${f(repN, 0)} months** (about ${f(r1(repN / 12), 1)} years). Statistical precision is bought at an exorbitant price in data — which is why managers are judged over decades, not quarters.`
              : `$SE \\propto 1/\\sqrt{n}$ : diviser l'erreur par deux exige de **quadrupler** l'échantillon, soit 4 × ${n} = **${f(repN, 0)} mois** (environ ${f(r1(repN / 12), 1)} ans). La précision statistique s'achète à un prix exorbitant en données — c'est pourquoi un gérant se juge sur des décennies, pas des trimestres.`,
          }],
          pieges: [en
            ? `Doubling the sample (${f(2 * n, 0)} months) only divides the error by √2 ≈ 1.41 — the square root is unforgiving.`
            : `Doubler l'échantillon (${f(2 * n, 0)} mois) ne divise l'erreur que par √2 ≈ 1,41 — la racine carrée est sans pitié.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 9. m2-pb-alpha-significatif — N3                                    */
/* ------------------------------------------------------------------ */
const alphaSignificatif: ProblemGenerator = {
  id: 'm2-pb-alpha-significatif', moduleId: M2,
  titre: "L'alpha est-il significatif ?",
  titreEn: 'Is the alpha significant?',
  typeDeCas: "test d'hypothèse",
  typeDeCasEn: 'hypothesis testing',
  difficulte: 3,
  scenarios: ['Sélectionneur de fonds', 'Contrôle des risques face au star manager', 'CIO qui filtre une liste de fonds'],
  scenariosEn: ['Fund selector', 'Risk control vetting the star manager', 'CIO screening a fund list'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const alphaM = randFloat(rng, 0.15, 0.6, 2);
    const s = randFloat(rng, 1.2, 3, 1);
    const n = pick(rng, [24, 36, 48, 60] as const);
    const nbFonds = pick(rng, [20, 40, 60, 80] as const);

    const seM = s / Math.sqrt(n);
    const t = statT(alphaM, 0, s, n);
    const pval = (1 - normaleCdf(t)) * 100;
    const marge = t - 1.645;
    const rejette = marge > 0;
    const fauxPosAttendus = nbFonds * 0.05;
    const repT = r2(t);
    const repPval = r2(pval);
    const repMarge = r2(marge);
    const repFauxPos = r2(fauxPosAttendus);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `an average monthly alpha of ${pct(alphaM)} with a standard deviation of ${pct(s)}, over ${n} months`
      : `un alpha mensuel moyen de ${pct(alphaM)}, avec un écart-type de ${pct(s)}, sur ${n} mois`;
    const contexte = (en
      ? [
        `As a fund selector, you examine a buy candidate showing ${desc}. The fund's sales team talks of "demonstrated skill"; your process demands a formal test: is the alpha significantly positive at the 5% level (one-sided test)?`,
        `In risk control, you are handed the file of the house star manager: ${desc}. Before management raises his envelope, you must say whether this track record proves anything — or whether luck alone explains it.`,
        `As CIO, you screen a fund list; today's candidate shows ${desc}. The test never changes — t-statistic, p-value, 5% verdict — but the real question comes last: what are these tests worth when repeated across a whole list?`,
      ]
      : [
        `Sélectionneur de fonds, vous examinez un candidat à l'achat affichant ${desc}. L'équipe commerciale du fonds parle de « talent démontré » ; votre process exige un test formel : l'alpha est-il significativement positif au seuil de 5 % (test unilatéral) ?`,
        `Au contrôle des risques, on vous confie le dossier du gérant vedette de la maison : ${desc}. Avant que la direction n'augmente son enveloppe, vous devez dire si ce track record prouve quoi que ce soit — ou si la chance suffit à l'expliquer.`,
        `CIO, vous filtrez une liste de fonds ; le candidat du jour affiche ${desc}. Le test ne change jamais — statistique t, p-value, verdict à 5 % — mais la vraie question arrive en dernier : que valent ces tests répétés sur toute une liste ?`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The t-statistic' : 'a) La statistique t',
          enonce: en
            ? `Compute the t-statistic of the alpha against the "zero alpha" hypothesis.`
            : `Calculez la statistique t de l'alpha contre l'hypothèse « alpha nul ».`,
          reponse: repT, tolerance: 0.02, toleranceMode: 'absolu',
          etapes: [
            {
              titre: en ? 'The standard error first' : "L'erreur standard d'abord",
              contenu: en
                ? `$SE = s/\\sqrt{n}$ = ${f(s, 1)} / ${f(Math.sqrt(n), 3)} = ${f(r3(seM), 3)} pts: the noise level of the average alpha.`
                : `$SE = s/\\sqrt{n}$ = ${f(s, 1)} / ${f(Math.sqrt(n), 3)} = ${f(r3(seM), 3)} pts : le niveau de bruit de l'alpha moyen.`,
            },
            {
              titre: en ? 'Signal over noise' : 'Le signal sur le bruit',
              contenu: en
                ? `$t = \\frac{\\bar{\\alpha} - 0}{SE}$ = ${f(alphaM)} / ${f(r3(seM), 3)} = **${f(repT)}**: the alpha sits ${f(repT)} standard errors away from zero.`
                : `$t = \\frac{\\bar{\\alpha} - 0}{SE}$ = ${f(alphaM)} / ${f(r3(seM), 3)} = **${f(repT)}** : l'alpha se tient à ${f(repT)} erreurs standards de zéro.`,
            },
          ],
          pieges: [en
            ? `Dividing by s instead of s/√n gives ${f(r2(alphaM / s))}: it ignores that ${n} months of averaging already crushed the noise.`
            : `Diviser par s au lieu de s/√n donne ${f(r2(alphaM / s))} : c'est ignorer que la moyenne sur ${n} mois a déjà écrasé le bruit.`],
        },
        {
          intitule: en ? 'b) The p-value' : 'b) La p-value',
          enonce: en
            ? `What is the p-value of the one-sided test (alpha > 0), in %? (normal approximation)`
            : `Quelle est la p-value du test unilatéral (alpha > 0), en % ? (approximation normale)`,
          reponse: repPval, tolerance: 0.2, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'The upper tail beyond t' : 'La queue au-delà de t',
              contenu: en
                ? `$p = 1 - \\Phi(${f(repT)})$ = 1 − ${f(normaleCdf(t), 4)} = **${pct(repPval)}**: the probability of observing such an alpha if the true alpha were nil.`
                : `$p = 1 - \\Phi(${f(repT)})$ = 1 − ${f(normaleCdf(t), 4)} = **${pct(repPval)}** : la probabilité d'observer un tel alpha si le vrai alpha était nul.`,
            },
            {
              titre: en ? 'The Student nuance' : 'La nuance de Student',
              contenu: en
                ? (n < 30
                  ? `With only ${n} observations, the strict reference is Student's t with ${n - 1} degrees of freedom, whose tails are fatter: the normal p-value slightly understates the uncertainty. Near the threshold, Student can flip the verdict.`
                  : `With ${n} observations, the normal approximation of Student's law is comfortable: both references give the same verdict except in razor-thin cases.`)
                : (n < 30
                  ? `À ${n} observations seulement, la référence stricte est la loi de Student à ${n - 1} degrés de liberté, aux queues plus épaisses : la p-value normale sous-estime légèrement l'incertitude. Près du seuil, Student peut renverser le verdict.`
                  : `À ${n} observations, l'approximation normale de la loi de Student est confortable : les deux références donnent le même verdict hors cas limite.`),
            },
          ],
          pieges: [en
            ? `Reading the p-value as "the probability that the alpha is zero" inverts the conditioning: it is P(data this extreme | zero alpha), not the reverse.`
            : `Lire la p-value comme « la probabilité que l'alpha soit nul » inverse le conditionnement : c'est P(données aussi extrêmes | alpha nul), pas l'inverse.`],
        },
        {
          intitule: en ? 'c) The 5% verdict' : 'c) Le verdict à 5 %',
          enonce: en
            ? `By how much does the t-statistic clear (or miss) the one-sided 5% threshold of 1.645? (signed answer)`
            : `De combien la statistique t dépasse-t-elle (ou manque-t-elle) le seuil unilatéral à 5 %, soit 1,645 ? (réponse signée)`,
          reponse: repMarge, tolerance: 0.02, toleranceMode: 'absolu',
          etapes: [{
            titre: en ? 'Distance to the threshold' : 'La distance au seuil',
            contenu: en
              ? `t − 1.645 = ${f(repT)} − 1.645 = **${f(repMarge)}**. ${rejette
                ? `Positive margin: reject "zero alpha" at the 5% level — the track record is statistically significant.`
                : `Negative margin: impossible to reject "zero alpha" — at the 5% level, this track record proves nothing yet.`} (Two-sided habit alert: 1.96 is the two-sided threshold; the one-sided test at 5% uses 1.645.)`
              : `t − 1,645 = ${f(repT)} − 1,645 = **${f(repMarge)}**. ${rejette
                ? `Marge positive : on rejette « alpha nul » au seuil de 5 % — le track record est statistiquement significatif.`
                : `Marge négative : impossible de rejeter « alpha nul » — au seuil de 5 %, ce track record ne prouve encore rien.`} (Gare au réflexe bilatéral : 1,96 est le seuil bilatéral ; le test unilatéral à 5 % utilise 1,645.)`,
          }],
        },
        {
          intitule: en ? 'd) The list effect' : "d) L'effet de liste",
          enonce: en
            ? `Your firm runs the same test on ${nbFonds} funds with no genuine skill. How many "significant at 5%" results do you expect from luck alone?`
            : `Votre maison applique le même test à ${nbFonds} fonds sans aucun talent réel. Combien de « significatifs à 5 % » attend-on par pur hasard ?`,
          reponse: repFauxPos, tolerance: 0.02, toleranceMode: 'absolu',
          unite: en ? 'funds' : 'fonds',
          etapes: [
            {
              titre: en ? 'Five percent of the list' : 'Cinq pour cent de la liste',
              contenu: en
                ? `Each test on a skill-less fund still rings wrongly with probability 5%: expected false positives = ${f(nbFonds, 0)} × 5% = **${f(repFauxPos)}** funds.`
                : `Chaque test sur un fonds sans talent sonne quand même à tort avec une probabilité de 5 % : faux positifs attendus = ${f(nbFonds, 0)} × 5 % = **${f(repFauxPos)}** fonds.`,
            },
            {
              titre: en ? 'The multiple-testing lesson' : 'La leçon des tests multiples',
              contenu: en
                ? `A "significant" fund found by combing a list of ${f(nbFonds, 0)} is not a discovery — it is the expected by-product of the search. This is the root of data mining: thresholds must tighten as tests multiply.`
                : `Un fonds « significatif » trouvé en peignant une liste de ${f(nbFonds, 0)} n'est pas une découverte — c'est le sous-produit attendu de la recherche. C'est la racine du data mining : les seuils doivent se durcir quand les tests se multiplient.`,
            },
          ],
          pieges: [en
            ? `Believing the 5% level guarantees zero false alarms: it calibrates the rate of false alarms, it does not abolish them.`
            : `Croire que le seuil de 5 % garantit zéro fausse alerte : il calibre le taux de fausses alertes, il ne les abolit pas.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 10. m2-pb-beta-regression — N3                                      */
/* ------------------------------------------------------------------ */
const betaRegression: ProblemGenerator = {
  id: 'm2-pb-beta-regression', moduleId: M2,
  titre: 'Estimer le bêta par régression',
  titreEn: 'Estimating beta by regression',
  typeDeCas: 'régression linéaire',
  typeDeCasEn: 'linear regression',
  difficulte: 3,
  scenarios: ['Analyste actions qui calibre un bêta', 'Candidat CFA sur table de régression', 'Risk manager qui prépare un stress test'],
  scenariosEn: ['Equity analyst calibrating a beta', 'CFA candidate on a regression table', 'Risk manager preparing a stress test'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const nObs = randInt(rng, 4, 5);
    const betaVrai = randFloat(rng, 0.6, 1.5, 1);
    const alphaVrai = randFloat(rng, -0.6, 0.8, 1);
    const bases = nObs === 4 ? [-6, -2, 3, 7] : [-6, -2, 1, 4, 8];
    const xs = bases.map(b => r1(b + randFloat(rng, -1.5, 1.5, 1)));
    const ys = xs.map(x => r1(alphaVrai + betaVrai * x + pick(rng, [-1, 1] as const) * randFloat(rng, 0.2, 0.9, 1)));
    const xPred = pick(rng, [-8, -5, 6, 10] as const);

    const beta = penteRegression(xs, ys);
    const alphaHat = ordonneeRegression(xs, ys);
    const r2v = r2Regression(xs, ys);
    const yPred = alphaHat + beta * xPred;
    const mx = moyenneArithmetique(xs);
    const my = moyenneArithmetique(ys);
    const cov = covarianceEchantillon(xs, ys);
    const vx = varianceEchantillon(xs);
    const vy = varianceEchantillon(ys);
    const corr = correlation(xs, ys);
    const repBeta = r2(beta);
    const repAlpha = r2(alphaHat);
    const repR2 = r3(r2v);
    const repPred = r2(yPred);

    const { en, f, pct } = outils(langue);
    const paires = xs.map((x, i) => (en ? `(${f(x, 1)}%; ${f(ys[i], 1)}%)` : `(${f(x, 1)} % ; ${f(ys[i], 1)} %)`)).join(', ');
    const contexte = (en
      ? [
        `As an equity analyst, you calibrate a stock's beta from ${nObs} months of history, as (market return; stock return) pairs: ${paires}. The market model reads $R_{titre} = \\alpha + \\beta R_{marché} + \\varepsilon$ — your job is to estimate every piece of it.`,
        `Exam table, regression by hand: ${nObs} (market return; fund return) pairs: ${paires}. Expected: the slope, the intercept, the R² — then a numbered prediction.`,
        `As a risk manager, you want to stress one line of the book: its behaviour against the market lies in ${nObs} monthly observations (market; stock): ${paires}. Before the stress test, you need a beta, an alpha, and a measure of how well the line fits.`,
      ]
      : [
        `Analyste actions, vous calibrez le bêta d'une valeur à partir de ${nObs} mois d'historique, en paires (rendement du marché ; rendement du titre) : ${paires}. Le modèle de marché s'écrit $R_{titre} = \\alpha + \\beta R_{marché} + \\varepsilon$ — à vous d'en estimer chaque pièce.`,
        `Table d'examen, régression à la main : ${nObs} paires (rendement du marché ; rendement du fonds) : ${paires}. Attendus : la pente, l'ordonnée à l'origine, le R² — puis une prédiction chiffrée.`,
        `Risk manager, vous voulez stresser une ligne du portefeuille : son comportement face au marché tient dans ${nObs} observations mensuelles (marché ; titre) : ${paires}. Avant le stress test, il faut un bêta, un alpha et une mesure de la qualité de l'ajustement.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The beta (the slope)' : 'a) Le bêta (la pente)',
          enonce: en
            ? `Estimate the slope of the regression — the stock's beta.`
            : `Estimez la pente de la régression — le bêta du titre.`,
          reponse: repBeta, tolerance: 0.03, toleranceMode: 'absolu',
          etapes: [
            {
              titre: en ? 'The two means' : 'Les deux moyennes',
              contenu: en
                ? `$\\bar{x}$ = ${f(r3(mx), 3)} and $\\bar{y}$ = ${f(r3(my), 3)}: every deviation in the next step is measured from these.`
                : `$\\bar{x}$ = ${f(r3(mx), 3)} et $\\bar{y}$ = ${f(r3(my), 3)} : tous les écarts de l'étape suivante se mesurent depuis ces deux points.`,
            },
            {
              titre: en ? 'Covariance over variance' : 'Covariance sur variance',
              contenu: en
                ? `cov(x, y) = ${f(r3(cov), 3)} and var(x) = ${f(r3(vx), 3)} (both with the n − 1 denominator — the ratio does not depend on that choice). $\\hat{\\beta}$ = ${f(r3(cov), 3)} / ${f(r3(vx), 3)} = **${f(repBeta)}**: the stock amplifies market moves by that factor.`
                : `cov(x, y) = ${f(r3(cov), 3)} et var(x) = ${f(r3(vx), 3)} (toutes deux en dénominateur n − 1 — le ratio n'en dépend pas). $\\hat{\\beta}$ = ${f(r3(cov), 3)} / ${f(r3(vx), 3)} = **${f(repBeta)}** : le titre amplifie les mouvements du marché de ce facteur.`,
            },
          ],
          pieges: [en
            ? `Dividing by var(y) instead of var(x) gives ${f(r2(cov / vy))}: the regression of y on x always divides by the variance of the explanatory variable.`
            : `Diviser par var(y) au lieu de var(x) donne ${f(r2(cov / vy))} : la régression de y sur x divise toujours par la variance de la variable explicative.`],
        },
        {
          intitule: en ? 'b) The alpha (the intercept)' : "b) L'alpha (l'ordonnée à l'origine)",
          enonce: en
            ? `Estimate the intercept — the monthly alpha, in %.`
            : `Estimez l'ordonnée à l'origine — l'alpha mensuel, en %.`,
          reponse: repAlpha, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The line passes through the means' : 'La droite passe par les moyennes',
            contenu: en
              ? `$\\hat{\\alpha} = \\bar{y} - \\hat{\\beta}\\,\\bar{x}$ = ${f(r3(my), 3)} − ${f(repBeta)} × ${f(r3(mx), 3)} = **${pct(repAlpha)}** per month: what the stock delivers when the market does nothing. ${alphaHat >= 0 ? 'A positive alpha — to be tested for significance before celebrating (see the hypothesis-testing mould).' : 'A negative alpha: market exposure aside, the stock destroyed value over the window.'}`
              : `$\\hat{\\alpha} = \\bar{y} - \\hat{\\beta}\\,\\bar{x}$ = ${f(r3(my), 3)} − ${f(repBeta)} × ${f(r3(mx), 3)} = **${pct(repAlpha)}** par mois : ce que le titre livre quand le marché ne fait rien. ${alphaHat >= 0 ? "Un alpha positif — à tester pour sa significativité avant de s'en réjouir (voir le moule sur les tests)." : 'Un alpha négatif : exposition au marché mise à part, le titre a détruit de la valeur sur la fenêtre.'}`,
          }],
        },
        {
          intitule: en ? 'c) The R²' : 'c) Le R²',
          enonce: en
            ? `What share of the stock's variance does the market explain? (R², as a decimal)`
            : `Quelle part de la variance du titre le marché explique-t-il ? (R², en décimal)`,
          reponse: repR2, tolerance: 0.02, toleranceMode: 'absolu',
          etapes: [
            {
              titre: en ? 'Square the correlation' : 'Élever la corrélation au carré',
              contenu: en
                ? `r = cov / (σx σy) = ${f(r3(corr), 3)}, hence $R^2 = r^2$ = **${f(repR2, 3)}**.`
                : `r = cov / (σx σy) = ${f(r3(corr), 3)}, d'où $R^2 = r^2$ = **${f(repR2, 3)}**.`,
            },
            {
              titre: en ? 'Read it as a split' : 'Le lire comme un partage',
              contenu: en
                ? `${pct(r1(r2v * 100), 1)} of the stock's variance is market-driven (systematic); the remaining ${pct(r1((1 - r2v) * 100), 1)} is specific — the part diversification can erase, and the part that blurs any beta-based prediction.`
                : `${pct(r1(r2v * 100), 1)} de la variance du titre vient du marché (risque systématique) ; les ${pct(r1((1 - r2v) * 100), 1)} restants sont spécifiques — la part que la diversification peut gommer, et celle qui brouille toute prédiction fondée sur le bêta.`,
            },
          ],
          pieges: [en
            ? `Reporting the correlation ${f(r3(corr), 3)} instead of its square: R² is the share of variance, r is not.`
            : `Rendre la corrélation ${f(r3(corr), 3)} au lieu de son carré : le R² est la part de variance expliquée, pas r.`],
        },
        {
          intitule: en ? 'd) The prediction' : 'd) La prédiction',
          enonce: en
            ? `The strategist pencils in a market return of ${pct(xPred)} for next month. What return does the regression predict for the stock, in %?`
            : `Le stratège retient un scénario de rendement de marché de ${pct(xPred)} pour le mois prochain. Quel rendement du titre la régression prédit-elle, en % ?`,
          reponse: repPred, tolerance: 0.15, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'Plug into the fitted line' : 'Injecter dans la droite estimée',
              contenu: en
                ? `$\\hat{y} = \\hat{\\alpha} + \\hat{\\beta}\\,x$ = ${f(repAlpha)} + ${f(repBeta)} × ${f(xPred, 1)} = **${pct(repPred)}**.`
                : `$\\hat{y} = \\hat{\\alpha} + \\hat{\\beta}\\,x$ = ${f(repAlpha)} + ${f(repBeta)} × ${f(xPred, 1)} = **${pct(repPred)}**.`,
            },
            {
              titre: en ? 'A conditional estimate, not a promise' : 'Une estimation conditionnelle, pas une promesse',
              contenu: en
                ? `The ε term has not vanished: with an R² of ${f(repR2, 3)}, ${pct(r1((1 - r2v) * 100), 1)} of the stock's variance remains outside the model. And everything rests on the beta staying stable out of sample — the standard caveat of every stress test.`
                : `Le terme ε n'a pas disparu : avec un R² de ${f(repR2, 3)}, ${pct(r1((1 - r2v) * 100), 1)} de la variance du titre reste hors modèle. Et tout repose sur la stabilité du bêta hors échantillon — la réserve standard de tout stress test.`,
            },
          ],
        },
      ],
    };
  },
};

export const problemes: ProblemGenerator[] = [
  planEpargne,
  choixProjets,
  analyseRendements,
  portefeuille2Actifs,
  bayesDiagnostic,
  binomialeTrading,
  objectifNormal,
  backtestIc,
  alphaSignificatif,
  betaRegression,
];
