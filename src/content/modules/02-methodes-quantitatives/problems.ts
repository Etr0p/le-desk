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

/* ================================================================== */
/* Lot 2 — moules 11 à 20 (dont 6 boss N4).                            */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/* 11. m2-pb-monte-carlo-convergence — N3                              */
/* ------------------------------------------------------------------ */
const monteCarloConvergence: ProblemGenerator = {
  id: 'm2-pb-monte-carlo-convergence', moduleId: M2,
  titre: 'La convergence en 1/√N du Monte Carlo',
  titreEn: 'The 1/√N convergence of Monte Carlo',
  typeDeCas: 'simulation Monte Carlo',
  typeDeCasEn: 'Monte Carlo simulation',
  difficulte: 3,
  scenarios: ["Desk exotiques qui price une option à barrière", "Validation interne d'un modèle de pricing", 'Atelier de formation des juniors'],
  scenariosEn: ['Exotics desk pricing a barrier option', 'Internal validation of a pricing model', 'Training workshop for junior quants'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const pPct = randFloat(rng, 5, 30, 1);
    const N = pick(rng, [40000, 100000, 250000] as const);
    const cible = pick(rng, [0.05, 0.1, 0.2] as const);
    const nPetit = pick(rng, [1000, 2500, 5000] as const);
    const deltaPts = randFloat(rng, 0.6, 2, 1);

    const p = pPct / 100;
    const varBern = p * (1 - p);
    const sePts = Math.sqrt(varBern / N) * 100;
    const nRequis = Math.ceil(varBern / (cible / 100) ** 2);
    const sePetitPts = Math.sqrt(varBern / nPetit) * 100;
    const zEcart = deltaPts / sePetitPts;
    const compatible = zEcart < 2;
    const repSe = r3(sePts);
    const repZ = r2(zEcart);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `the Monte Carlo run estimates the probability at ${pct(pPct, 1)} after ${f(N, 0)} simulations`
      : `le Monte Carlo estime la probabilité à ${pct(pPct, 1)} après ${f(N, 0)} simulations`;
    const contexte = (en
      ? [
        `On the exotics desk, you price a barrier option: everything hinges on the activation probability, and ${desc}. Before the quote goes out, the senior trader wants three numbers — the current precision, the cost of doing better — plus a critical eye on an intern's run.`,
        `In model validation, you audit an in-house pricer: ${desc}. Your report must say whether that precision is sufficient, what the committee's target precision would cost in compute, and settle a suspicious gap between two runs.`,
        `You run the juniors' Monte Carlo workshop: ${desc}. On the whiteboard you unfold the convergence machinery — the standard error, the required N, the ÷10 law — then hand the room a booby-trapped result to dissect.`,
      ]
      : [
        `Sur le desk exotiques, vous pricez une option à barrière : tout repose sur la probabilité d'activation, et ${desc}. Avant d'envoyer la cotation, le trader senior exige trois chiffres — la précision actuelle, le coût d'une précision meilleure — et un œil critique sur le run d'un stagiaire.`,
        `À la validation des modèles, vous auditez un pricer maison : ${desc}. Votre rapport doit dire si cette précision suffit, ce que coûterait en calcul la précision cible du comité, et trancher un écart suspect entre deux runs.`,
        `Vous animez l'atelier Monte Carlo des juniors : ${desc}. Au tableau, vous déroulez la mécanique de la convergence — l'erreur type, le N nécessaire, la loi du ÷10 — puis vous soumettez à la salle un résultat piégé.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The standard error of the estimate' : "a) L'erreur type de l'estimation",
          enonce: en
            ? `What is the standard error of the estimated probability, in points of %?`
            : `Quelle est l'erreur type de la probabilité estimée, en points de % ?`,
          reponse: repSe, tolerance: 0.005, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'A Bernoulli averaged N times' : 'Un Bernoulli moyenné N fois',
              contenu: en
                ? `Each simulation returns 1 (event) or 0: variance $p(1-p)$ = ${f(p, 3)} × ${f(1 - p, 3)} = ${f(varBern, 4)}. Averaging ${f(N, 0)} independent draws divides that variance by N.`
                : `Chaque simulation rend 1 (événement) ou 0 : variance $p(1-p)$ = ${f(p, 3)} × ${f(1 - p, 3)} = ${f(varBern, 4)}. La moyenne de ${f(N, 0)} tirages indépendants divise cette variance par N.`,
            },
            {
              titre: en ? 'Application' : 'Application',
              contenu: en
                ? `$SE = \\sqrt{p(1-p)/N}$ = √(${f(varBern, 4)} / ${f(N, 0)}) = **${f(repSe, 3)} pt**. The 95% band is ±1.96 × ${f(repSe, 3)} ≈ ±${f(r3(1.96 * sePts), 3)} pt around ${pct(pPct, 1)}.`
                : `$SE = \\sqrt{p(1-p)/N}$ = √(${f(varBern, 4)} / ${f(N, 0)}) = **${f(repSe, 3)} pt**. La bande à 95 % vaut ±1,96 × ${f(repSe, 3)} ≈ ±${f(r3(1.96 * sePts), 3)} pt autour de ${pct(pPct, 1)}.`,
            },
          ],
          pieges: [en
            ? `Using p instead of p(1−p) (√(p/N) = ${f(r3(Math.sqrt(p / N) * 100), 3)} pt) forgets that a Bernoulli's variance involves both outcomes.`
            : `Utiliser p au lieu de p(1−p) (√(p/N) = ${f(r3(Math.sqrt(p / N) * 100), 3)} pt) oublie que la variance d'un Bernoulli fait intervenir les deux issues.`],
        },
        {
          intitule: en ? 'b) The N for the target precision' : 'b) Le N de la précision cible',
          enonce: en
            ? `How many simulations would bring the standard error down to ${f(cible, 2)} point?`
            : `Combien de simulations faut-il pour ramener l'erreur type à ${f(cible, 2)} point ?`,
          reponse: nRequis, tolerance: 0.005, unite: 'simulations',
          etapes: [
            {
              titre: en ? 'Invert the formula' : 'Inverser la formule',
              contenu: en
                ? `$N = \\frac{p(1-p)}{SE^2}$ = ${f(varBern, 4)} × (100/${f(cible, 2)})² = ${f(varBern, 4)} × ${f((100 / cible) ** 2, 0)} = **${f(nRequis, 0)}** simulations (rounded up).`
                : `$N = \\frac{p(1-p)}{SE^2}$ = ${f(varBern, 4)} × (100/${f(cible, 2)})² = ${f(varBern, 4)} × ${f((100 / cible) ** 2, 0)} = **${f(nRequis, 0)}** simulations (arrondi au-dessus).`,
            },
            {
              titre: en ? 'Precision is paid squared' : 'La précision se paie au carré',
              contenu: en
                ? `That is ${f(r2(nRequis / N), 2)} times the current run: aiming at an error k times smaller costs k² times more simulations — the square shows up before any 1/√N intuition.`
                : `Soit ${f(r2(nRequis / N), 2)} fois le run actuel : viser une erreur k fois plus petite coûte k² fois plus de simulations — le carré apparaît avant même l'intuition en 1/√N.`,
            },
          ],
        },
        {
          intitule: en ? 'c) Dividing the error by 10' : "c) Diviser l'erreur par 10",
          enonce: en
            ? `By what factor must the number of simulations be multiplied to divide the standard error by 10?`
            : `Par quel facteur faut-il multiplier le nombre de simulations pour diviser l'erreur type par 10 ?`,
          reponse: 100, tolerance: 0.5, toleranceMode: 'absolu',
          etapes: [{
            titre: en ? 'The 1/√N law' : 'La loi en 1/√N',
            contenu: en
              ? `$SE \\propto 1/\\sqrt{N}$: dividing the error by 10 requires multiplying the simulations by 10² = **100**. That is the Monte Carlo curse — every extra decimal of precision costs a hundred times more compute.`
              : `$SE \\propto 1/\\sqrt{N}$ : diviser l'erreur par 10 exige de multiplier les simulations par 10² = **100**. C'est la malédiction du Monte Carlo — chaque décimale de précision supplémentaire coûte cent fois plus de calcul.`,
          }],
          pieges: [en
            ? `Answering ×10 confuses the error scale with the sample scale: ×10 simulations only divides the error by √10 ≈ 3.16.`
            : `Répondre ×10 confond l'échelle de l'erreur et celle de l'échantillon : ×10 simulations ne divise l'erreur que par √10 ≈ 3,16.`],
        },
        {
          intitule: en ? 'd) The critical read' : 'd) La lecture critique',
          enonce: en
            ? `An intern reports a probability ${f(deltaPts, 1)} points above yours, obtained with only ${f(nPetit, 0)} simulations. How many of his own standard errors does the gap represent?`
            : `Un stagiaire annonce une probabilité supérieure de ${f(deltaPts, 1)} point à la vôtre, obtenue avec seulement ${f(nPetit, 0)} simulations. À combien de SES erreurs types l'écart correspond-il ?`,
          reponse: repZ, tolerance: 0.05, toleranceMode: 'absolu',
          etapes: [
            {
              titre: en ? "The small run's standard error" : "L'erreur type du petit run",
              contenu: en
                ? `$SE$ = √(${f(varBern, 4)} / ${f(nPetit, 0)}) = ${f(r3(sePetitPts), 3)} pt. Your run is √(${f(N, 0)}/${f(nPetit, 0)}) ≈ ${f(r1(Math.sqrt(N / nPetit)), 1)} times more precise, so it serves as the reference.`
                : `$SE$ = √(${f(varBern, 4)} / ${f(nPetit, 0)}) = ${f(r3(sePetitPts), 3)} pt. Votre run est √(${f(N, 0)}/${f(nPetit, 0)}) ≈ ${f(r1(Math.sqrt(N / nPetit)), 1)} fois plus précis : il sert de référence.`,
            },
            {
              titre: en ? 'The verdict' : 'Le verdict',
              contenu: en
                ? `z = ${f(deltaPts, 1)} / ${f(r3(sePetitPts), 3)} = **${f(repZ)}** standard errors. ${compatible
                  ? 'Below 2: ordinary simulation noise — no need to suspect the code, just ask for more paths.'
                  : 'Above 2: noise alone struggles to explain the gap — inspect the seed, the payoff code or the discretisation step before publishing anything.'}`
                : `z = ${f(deltaPts, 1)} / ${f(r3(sePetitPts), 3)} = **${f(repZ)}** erreurs types. ${compatible
                  ? 'Moins de 2 : bruit de simulation ordinaire — inutile de suspecter le code, demandez simplement plus de trajectoires.'
                  : "Plus de 2 : le bruit seul explique mal l'écart — inspectez la graine, le code du payoff ou le pas de discrétisation avant de publier quoi que ce soit."}`,
            },
          ],
          pieges: [en
            ? `Comparing raw probabilities without a standard error: a gap of ${f(deltaPts, 1)} pt is neither big nor small in itself — only its ratio to the noise says so.`
            : `Comparer les probabilités brutes sans erreur type : un écart de ${f(deltaPts, 1)} pt n'est ni grand ni petit en soi — seul son rapport au bruit le dit.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 12. m2-pb-esperance-jeu — N3                                        */
/* ------------------------------------------------------------------ */
const esperanceJeu: ProblemGenerator = {
  id: 'm2-pb-esperance-jeu', moduleId: M2,
  titre: "L'espérance ne suffit pas pour jouer",
  titreEn: 'Expected value is not enough to play',
  typeDeCas: "espérance & variance d'un jeu",
  typeDeCasEn: 'expectation & variance of a gamble',
  difficulte: 3,
  scenarios: ['Loterie au tabac du coin', 'Produit à coupon conditionnel en agence', 'Pari entre traders du desk'],
  scenariosEn: ['Lottery at the corner shop', 'Conditional-coupon product at a branch', 'Bet between desk traders'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const invN1 = pick(rng, [500, 1000, 2000] as const);
    const G1 = pick(rng, [5000, 10000, 20000] as const);
    const invN2 = pick(rng, [10, 20, 25] as const);
    const G2 = pick(rng, [50, 100, 200] as const);
    const coef = pick(rng, [1.2, 1.4, 1.6] as const);

    const E = G1 / invN1 + G2 / invN2;
    const C = Math.ceil(E * coef);
    const ex2 = G1 ** 2 / invN1 + G2 ** 2 / invN2;
    const varG = ex2 - E ** 2;
    const sigG = Math.sqrt(varG);
    const surcout = C - E;
    const perte100 = 100 * surcout;
    const pZero = 1 - 1 / invN1 - 1 / invN2;
    const repE = r2(E);
    const repSig = r2(sigG);
    const repSur = r2(surcout);
    const repPerte = r2(perte100);

    const { en, f, eur, pct } = outils(langue);
    const desc = en
      ? `one ticket in ${f(invN1, 0)} wins the €${f(G1, 0)} jackpot, one in ${f(invN2, 0)} wins €${f(G2, 0)}, the rest win nothing — and the ticket costs €${f(C, 0)}`
      : `un billet sur ${f(invN1, 0)} gagne le gros lot de ${f(G1, 0)} €, un sur ${f(invN2, 0)} gagne ${f(G2, 0)} €, les autres ne gagnent rien — et le billet coûte ${f(C, 0)} €`;
    const contexte = (en
      ? [
        `At the corner shop, a scratch game catches your eye: ${desc}. Before feeding the till, you do what almost no buyer does: compute what the ticket is actually worth — and what the game sells beyond its expected value.`,
        `At a bank branch, a salesman pitches a simplified conditional-coupon product, which boils down to a lottery: ${desc}. Your job is to price the "fair" value of that promise, measure its dispersion, and say whether the premium asked is defensible.`,
        `On the desk, a colleague formalises the Friday bet as a ticket: ${desc}. Between traders, the argument will not be settled by intuition: expectation, standard deviation, fair price — then only, decide whether to play.`,
      ]
      : [
        `Au tabac du coin, un jeu de grattage vous fait de l'œil : ${desc}. Avant de nourrir la caisse, vous faites ce que presque aucun acheteur ne fait : calculer ce que vaut réellement le billet — et ce que le jeu vend au-delà de son espérance.`,
        `En agence, un commercial vous présente un produit à coupon conditionnel simplifié, qui se ramène à une loterie : ${desc}. À vous de chiffrer la valeur « juste » de cette promesse, de mesurer sa dispersion, et de dire si la prime demandée se défend.`,
        `Au desk, un collègue formalise le pari du vendredi sous forme de billet : ${desc}. Entre traders, le débat ne se réglera pas à l'intuition : espérance, écart-type, prix juste — et alors seulement, décider de jouer.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The expected payoff' : "a) L'espérance du gain",
          enonce: en
            ? `What is the expected payoff of one ticket (price excluded), in euros?`
            : `Quelle est l'espérance du gain d'un billet (hors prix d'achat), en € ?`,
          reponse: repE, tolerance: 0.02, toleranceMode: 'absolu', unite: '€',
          etapes: [{
            titre: en ? 'Weight each payoff by its probability' : 'Pondérer chaque gain par sa probabilité',
            contenu: en
              ? `$E[X]$ = ${f(G1, 0)} × 1/${f(invN1, 0)} + ${f(G2, 0)} × 1/${f(invN2, 0)} + 0 × ${f(pZero, 4)} = ${f(r2(G1 / invN1))} + ${f(r2(G2 / invN2))} = **${eur(repE)}**. Note: the most likely payoff is 0 (probability ${pct(r2(pZero * 100))}) — the mean is not the typical outcome.`
              : `$E[X]$ = ${f(G1, 0)} × 1/${f(invN1, 0)} + ${f(G2, 0)} × 1/${f(invN2, 0)} + 0 × ${f(pZero, 4)} = ${f(r2(G1 / invN1))} + ${f(r2(G2 / invN2))} = **${eur(repE)}**. Notez : le gain le plus probable est 0 (probabilité ${pct(r2(pZero * 100))}) — la moyenne n'est pas l'issue typique.`,
          }],
          pieges: [en
            ? `Averaging the prizes ((${f(G1, 0)} + ${f(G2, 0)})/2) without their probabilities forgets that almost every ticket wins nothing.`
            : `Moyenner les lots ((${f(G1, 0)} + ${f(G2, 0)})/2) sans leurs probabilités oublie que presque tous les billets ne gagnent rien.`],
        },
        {
          intitule: en ? 'b) The standard deviation' : "b) L'écart-type du gain",
          enonce: en
            ? `What is the standard deviation of the ticket's payoff, in euros?`
            : `Quel est l'écart-type du gain du billet, en € ?`,
          reponse: repSig, tolerance: 0.005, unite: '€',
          etapes: [
            {
              titre: en ? 'E[X²] first' : "E[X²] d'abord",
              contenu: en
                ? `$E[X^2]$ = ${f(G1, 0)}² × 1/${f(invN1, 0)} + ${f(G2, 0)}² × 1/${f(invN2, 0)} = ${f(r2(G1 ** 2 / invN1))} + ${f(r2(G2 ** 2 / invN2))} = ${f(r2(ex2))}.`
                : `$E[X^2]$ = ${f(G1, 0)}² × 1/${f(invN1, 0)} + ${f(G2, 0)}² × 1/${f(invN2, 0)} = ${f(r2(G1 ** 2 / invN1))} + ${f(r2(G2 ** 2 / invN2))} = ${f(r2(ex2))}.`,
            },
            {
              titre: en ? 'Variance, then the root' : 'Variance, puis racine',
              contenu: en
                ? `$Var(X) = E[X^2] - E[X]^2$ = ${f(r2(ex2))} − ${f(r2(E ** 2))} = ${f(r2(varG))}, hence σ = **${eur(repSig)}** — about ${f(Math.round(sigG / E), 0)} times the expectation. The lottery does not sell return, it sells dispersion.`
                : `$Var(X) = E[X^2] - E[X]^2$ = ${f(r2(ex2))} − ${f(r2(E ** 2))} = ${f(r2(varG))}, d'où σ = **${eur(repSig)}** — environ ${f(Math.round(sigG / E), 0)} fois l'espérance. La loterie ne vend pas du rendement, elle vend de la dispersion.`,
            },
          ],
          pieges: [en
            ? `Computing Var as E[(X − E)²] only over the winning tickets: the (0 − ${f(repE)})² of the losing mass carries real weight.`
            : `Calculer la variance seulement sur les billets gagnants : le (0 − ${f(repE)})² de la masse perdante pèse réellement.`],
        },
        {
          intitule: en ? 'c) Fair price vs asked price' : 'c) Prix juste contre prix demandé',
          enonce: en
            ? `The actuarially fair price would be the expectation of a). By how much does the asked price exceed it, in euros?`
            : `Le prix actuariellement « juste » serait l'espérance du a). De combien le prix demandé le dépasse-t-il, en € ?`,
          reponse: repSur, tolerance: 0.02, toleranceMode: 'absolu', unite: '€',
          etapes: [{
            titre: en ? "The organiser's margin" : "La marge de l'organisateur",
            contenu: en
              ? `Margin = ${f(C, 0)} − ${f(repE)} = **${eur(repSur)}**, i.e. ${pct(r1((surcout / C) * 100), 1)} of the ticket price. Every euro of margin is the buyer's expected loss: a lottery is a negative-NPV investment by construction.`
              : `Marge = ${f(C, 0)} − ${f(repE)} = **${eur(repSur)}**, soit ${pct(r1((surcout / C) * 100), 1)} du prix du billet. Chaque euro de marge est la perte espérée de l'acheteur : une loterie est un investissement à VAN négative par construction.`,
          }],
        },
        {
          intitule: en ? 'd) Playing 100 times — and the real lesson' : 'd) Jouer 100 fois — et la vraie leçon',
          enonce: en
            ? `Over 100 tickets, what total loss should be expected on average, in euros?`
            : `Sur 100 billets, quelle perte totale faut-il attendre en moyenne, en € ?`,
          reponse: repPerte, tolerance: 0.005, unite: '€',
          etapes: [
            {
              titre: en ? 'Expectations add up' : "Les espérances s'additionnent",
              contenu: en
                ? `Expected loss = 100 × (${f(C, 0)} − ${f(repE)}) = **${eur(repPerte)}**. But the standard deviation of the total is only √100 × σ = 10 × ${f(repSig)} ≈ ${eur(r2(10 * sigG))}: the dispersion stays huge — a few players will win big while the average bleeds.`
                : `Perte espérée = 100 × (${f(C, 0)} − ${f(repE)}) = **${eur(repPerte)}**. Mais l'écart-type du total ne vaut que √100 × σ = 10 × ${f(repSig)} ≈ ${eur(r2(10 * sigG))} : la dispersion reste énorme — quelques joueurs gagneront gros pendant que la moyenne saigne.`,
            },
            {
              titre: en ? 'Why expectation alone never settles it' : "Pourquoi l'espérance seule ne tranche jamais",
              contenu: en
                ? `Even at a FAIR price (zero margin), a risk-averse agent declines: concave utility penalises dispersion, so bearing risk demands a premium, not just a zero expected cost. Whoever buys anyway is paying for the right tail — a dream, not a return. Expectation ranks gambles; variance and risk aversion decide whether to enter.`
                : `Même à prix JUSTE (marge nulle), un agent averse au risque refuse : l'utilité concave pénalise la dispersion — porter un risque exige une prime, pas seulement un coût espéré nul. Celui qui achète quand même paie la queue droite — un rêve, pas un rendement. L'espérance classe les jeux ; la variance et l'aversion au risque décident d'y entrer.`,
            },
          ],
          pieges: [en
            ? `Believing 100 plays "smooth the game out": the expected loss scales by 100 while the standard deviation only scales by √100 — repetition worsens a bad bet.`
            : `Croire que 100 parties « lissent le jeu » : la perte espérée est multipliée par 100 quand l'écart-type ne l'est que par √100 — la répétition aggrave un mauvais pari.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 13. m2-pb-lognormale-prix — N3                                      */
/* ------------------------------------------------------------------ */
const lognormalePrix: ProblemGenerator = {
  id: 'm2-pb-lognormale-prix', moduleId: M2,
  titre: 'Le prix est lognormal, pas normal',
  titreEn: 'The price is lognormal, not normal',
  typeDeCas: 'loi lognormale',
  typeDeCasEn: 'lognormal distribution',
  difficulte: 3,
  scenarios: ['Gérant qui fixe un objectif de cours', 'Structureur qui place une barrière', 'Risk manager qui chiffre le scénario adverse'],
  scenariosEn: ['Manager setting a price target', 'Structurer placing a barrier', 'Risk manager sizing the adverse scenario'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const s0 = pick(rng, [40, 60, 80, 100, 120] as const);
    const muPct = randFloat(rng, 4, 10, 1);
    const sigmaPct = pick(rng, [30, 40, 50] as const);
    const coefSeuil = pick(rng, [1.25, 1.4, 1.5] as const);
    const seuil = Math.round(s0 * coefSeuil);

    const mu = muPct / 100;
    const sg = sigmaPct / 100;
    const espLog = Math.log(s0) + mu;
    const zSeuil = zScore(Math.log(seuil), espLog, sg);
    const pDep = (1 - normaleCdf(zSeuil)) * 100;
    const q5 = s0 * Math.exp(mu - 1.645 * sg);
    const pNeg = normaleCdf((-100 - muPct) / sigmaPct) * 100;
    const repLog = r3(espLog);
    const repDep = r2(pDep);
    const repQ5 = r2(q5);
    const repNeg = r3(pNeg);

    const { en, f, eur, pct } = outils(langue);
    const desc = en
      ? `the share trades at €${f(s0, 0)} and its one-year log-return is modelled as normal with mean ${pct(muPct, 1)} and volatility ${pct(sigmaPct, 0)}; the level under review is €${f(seuil, 0)}`
      : `l'action cote ${f(s0, 0)} € et son log-rendement à un an est modélisé par une normale de moyenne ${pct(muPct, 1)} et de volatilité ${pct(sigmaPct, 0)} ; le niveau à l'étude est ${f(seuil, 0)} €`;
    const contexte = (en
      ? [
        `As a portfolio manager, you defend a price target before the strategy committee: ${desc}. The committee wants probabilities on the log scale, the 5% downside scenario in euros — and one clean sentence on why the normal law sits in the LOG.`,
        `As a structurer, you place the barrier of a product on a single stock: ${desc}. Pricing needs the probability of crossing, the 5% quantile of the price, and an answer to the sales desk's eternal "why not a plain normal on the price?".`,
        `As a risk manager, you size the adverse scenario on a concentrated line: ${desc}. The risk file requires the expected log-price, the probability of breaching the level, the 5% floor — and the model justification a regulator would accept.`,
      ]
      : [
        `Gérant, vous défendez un objectif de cours devant le comité stratégie : ${desc}. Le comité veut des probabilités sur l'échelle du log, le scénario adverse à 5 % en euros — et une phrase propre sur la raison de loger la normale dans le LOG.`,
        `Structureur, vous placez la barrière d'un produit sur une action : ${desc}. Le pricing exige la probabilité de franchissement, le quantile à 5 % du prix, et une réponse à l'éternel « pourquoi pas une normale sur le prix ? » du desk commercial.`,
        `Risk manager, vous chiffrez le scénario adverse d'une ligne concentrée : ${desc}. Le dossier de risque demande l'espérance du log-prix, la probabilité de franchir le niveau, le plancher à 5 % — et la justification de modèle qu'un régulateur accepterait.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The expected log-price' : "a) L'espérance du log-prix",
          enonce: en
            ? `What is the expected logarithm of the price in one year? (unitless)`
            : `Quelle est l'espérance du logarithme du prix dans un an ? (grandeur sans unité)`,
          reponse: repLog, tolerance: 0.01, toleranceMode: 'absolu',
          etapes: [
            {
              titre: en ? 'The log turns products into sums' : 'Le log transforme les produits en sommes',
              contenu: en
                ? `$\\ln S_T = \\ln S_0 + r_{log}$: the final log-price is the starting log-price plus the log-return. Taking expectations: $E[\\ln S_T] = \\ln S_0 + \\mu$.`
                : `$\\ln S_T = \\ln S_0 + r_{log}$ : le log-prix final est le log-prix de départ plus le log-rendement. En espérance : $E[\\ln S_T] = \\ln S_0 + \\mu$.`,
            },
            {
              titre: en ? 'Application' : 'Application',
              contenu: en
                ? `$E[\\ln S_T]$ = ln(${f(s0, 0)}) + ${f(mu, 3)} = ${f(r3(Math.log(s0)), 3)} + ${f(mu, 3)} = **${f(repLog, 3)}**. Everything that follows — probabilities, quantiles — is computed on this scale, then sent back to euros by the exponential.`
                : `$E[\\ln S_T]$ = ln(${f(s0, 0)}) + ${f(mu, 3)} = ${f(r3(Math.log(s0)), 3)} + ${f(mu, 3)} = **${f(repLog, 3)}**. Tout le reste — probabilités, quantiles — se calcule sur cette échelle, puis l'exponentielle ramène aux euros.`,
            },
          ],
          pieges: [en
            ? `Computing ln E[S_T] = ln S₀ + μ + σ²/2 = ${f(r3(Math.log(s0) + mu + sg ** 2 / 2), 3)} instead: by Jensen's inequality the log of the mean exceeds the mean of the log by σ²/2 — the two scales must never be mixed.`
            : `Calculer ln E[S_T] = ln S₀ + μ + σ²/2 = ${f(r3(Math.log(s0) + mu + sg ** 2 / 2), 3)} à la place : par l'inégalité de Jensen, le log de la moyenne dépasse la moyenne du log de σ²/2 — ne jamais mélanger les deux échelles.`],
        },
        {
          intitule: en ? 'b) The probability of beating the level' : 'b) La probabilité de dépasser le niveau',
          enonce: en
            ? `What is the probability that the price exceeds €${f(seuil, 0)} in one year, in %?`
            : `Quelle est la probabilité que le prix dépasse ${f(seuil, 0)} € dans un an, en % ?`,
          reponse: repDep, tolerance: 0.5, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'Pass the threshold through the log' : 'Faire passer le seuil par le log',
              contenu: en
                ? `$P(S_T > ${f(seuil, 0)}) = P(\\ln S_T > \\ln ${f(seuil, 0)})$. z-score: (${f(r3(Math.log(seuil)), 3)} − ${f(repLog, 3)}) / ${f(sg, 2)} = **${f(r2(zSeuil))}**.`
                : `$P(S_T > ${f(seuil, 0)}) = P(\\ln S_T > \\ln ${f(seuil, 0)})$. z-score : (${f(r3(Math.log(seuil)), 3)} − ${f(repLog, 3)}) / ${f(sg, 2)} = **${f(r2(zSeuil))}**.`,
            },
            {
              titre: en ? 'The upper tail' : 'La queue haute',
              contenu: en
                ? `$P = 1 - \\Phi(${f(r2(zSeuil))})$ = **${pct(repDep)}**. Roughly one path in ${f(Math.max(2, Math.round(100 / pDep)), 0)} ends above the level — a number the sales pitch should quote instead of "the target is ambitious but reachable".`
                : `$P = 1 - \\Phi(${f(r2(zSeuil))})$ = **${pct(repDep)}**. Environ un scénario sur ${f(Math.max(2, Math.round(100 / pDep)), 0)} finit au-dessus du niveau — le chiffre que l'argumentaire devrait citer plutôt que « l'objectif est ambitieux mais atteignable ».`,
            },
          ],
          pieges: [en
            ? `Standardising the PRICE gap ((${f(seuil, 0)} − ${f(s0, 0)})/σ in euros) mixes scales: with a lognormal model, thresholds must be converted to logs before any z-score.`
            : `Centrer-réduire l'écart de PRIX ((${f(seuil, 0)} − ${f(s0, 0)})/σ en euros) mélange les échelles : sous un modèle lognormal, tout seuil se convertit en log avant le moindre z-score.`],
        },
        {
          intitule: en ? 'c) The 5% quantile of the price' : 'c) Le quantile à 5 % du prix',
          enonce: en
            ? `Which price level is only breached downward with a 5% probability, in euros?`
            : `Quel niveau de prix n'est franchi à la baisse qu'avec 5 % de probabilité, en € ?`,
          reponse: repQ5, tolerance: 0.005, unite: '€',
          etapes: [
            {
              titre: en ? 'Quantile on the log scale' : "Quantile sur l'échelle du log",
              contenu: en
                ? `5% quantile of the log-price: ${f(repLog, 3)} − 1.645 × ${f(sg, 2)} = ${f(r3(espLog - 1.645 * sg), 3)}.`
                : `Quantile à 5 % du log-prix : ${f(repLog, 3)} − 1,645 × ${f(sg, 2)} = ${f(r3(espLog - 1.645 * sg), 3)}.`,
            },
            {
              titre: en ? 'Back to euros by the exponential' : "Retour aux euros par l'exponentielle",
              contenu: en
                ? `Price = $e^{${f(r3(espLog - 1.645 * sg), 3)}}$ = ${f(s0, 0)} × e^(${f(mu, 3)} − 1.645 × ${f(sg, 2)}) = **${eur(repQ5)}**. One year in twenty, the share ends below this floor — a Gaussian VaR computed on the right scale.`
                : `Prix = $e^{${f(r3(espLog - 1.645 * sg), 3)}}$ = ${f(s0, 0)} × e^(${f(mu, 3)} − 1,645 × ${f(sg, 2)}) = **${eur(repQ5)}**. Une année sur vingt, l'action finit sous ce plancher — une VaR gaussienne calculée sur la bonne échelle.`,
            },
          ],
          pieges: [en
            ? `The linear shortcut S₀ × (1 + μ − 1.645σ) = ${eur(r2(s0 * (1 + mu - 1.645 * sg)))} looks close here but is wrong in general — and increasingly wrong as σ or the horizon grows.`
            : `Le raccourci linéaire S₀ × (1 + μ − 1,645σ) = ${eur(r2(s0 * (1 + mu - 1.645 * sg)))} paraît proche ici mais est faux en général — et de plus en plus faux quand σ ou l'horizon grandit.`],
        },
        {
          intitule: en ? 'd) Why NOT the plain normal' : 'd) Pourquoi PAS la normale directe',
          enonce: en
            ? `A colleague models the SIMPLE annual return as normal with the same parameters (μ = ${pct(muPct, 1)}, σ = ${pct(sigmaPct, 0)}). What probability does his model assign to a negative final price, in %?`
            : `Un collègue modélise le rendement SIMPLE annuel par une normale de mêmes paramètres (μ = ${pct(muPct, 1)}, σ = ${pct(sigmaPct, 0)}). Quelle probabilité son modèle donne-t-il à un prix final négatif, en % ?`,
          reponse: repNeg, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'A price below zero requires R < −100%' : 'Un prix négatif exige R < −100 %',
              contenu: en
                ? `z = (−100 − ${f(muPct, 1)}) / ${f(sigmaPct, 0)} = ${f(r2((-100 - muPct) / sigmaPct))}, hence $\\Phi(z)$ = **${pct(repNeg, 3)}**.`
                : `z = (−100 − ${f(muPct, 1)}) / ${f(sigmaPct, 0)} = ${f(r2((-100 - muPct) / sigmaPct))}, d'où $\\Phi(z)$ = **${pct(repNeg, 3)}**.`,
            },
            {
              titre: en ? 'The corrected sentence' : 'La phrase corrigée',
              contenu: en
                ? `A price cannot fall below zero: the lognormal forbids it by construction ($e^x > 0$, probability exactly 0), while the normal on the simple return leaves **${pct(repNeg, 3)}** to an impossible event. That is precisely why the normal law is housed in the LOG of the price, not in the price.`
                : `Un prix ne peut pas tomber sous zéro : la lognormale l'interdit par construction ($e^x > 0$, probabilité exactement 0), quand la normale sur le rendement simple laisse **${pct(repNeg, 3)}** à un événement impossible. C'est exactement pour cela qu'on loge la normale dans le LOG du prix, pas dans le prix.`,
            },
          ],
          pieges: [en
            ? `Brushing the number off as "tiny anyway": multiply by an entire book and a long horizon, and the model prices impossible states — a structural flaw, not a rounding issue.`
            : `Balayer le chiffre d'un « négligeable de toute façon » : multipliez par tout un portefeuille et un horizon long, et le modèle valorise des états impossibles — un vice de structure, pas une histoire d'arrondi.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 14. m2-pb-diversification-limite — N3                               */
/* ------------------------------------------------------------------ */
const diversificationLimite: ProblemGenerator = {
  id: 'm2-pb-diversification-limite', moduleId: M2,
  titre: 'La limite de la diversification',
  titreEn: 'The limit of diversification',
  typeDeCas: 'diversification à n actifs',
  typeDeCasEn: 'n-asset diversification',
  difficulte: 3,
  scenarios: ['Fonds actions qui empile les lignes', "Comité ALM d'une banque privée", 'CIO qui arbitre le nombre de lignes'],
  scenariosEn: ['Equity fund stacking positions', 'ALM committee of a private bank', 'CIO sizing the line count'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const sigma = pick(rng, [18, 20, 24, 30] as const);
    const rho = pick(rng, [0.2, 0.3, 0.4, 0.5] as const);
    const n0 = pick(rng, [10, 20, 25, 50] as const);
    const fCible = pick(rng, [0.9, 0.95, 0.96] as const);

    const termeIdio = sigma ** 2 / n0;
    const termeCorr = (1 - 1 / n0) * rho * sigma ** 2;
    const varN0 = termeIdio + termeCorr;
    const varLim = rho * sigma ** 2;
    const volPlancher = sigma * Math.sqrt(rho);
    const nCapte = Math.round(1 / (1 - fCible));
    const var2 = sigma ** 2 / 2 + (1 - 1 / 2) * rho * sigma ** 2;
    const repVar = r2(varN0);
    const repLim = r2(varLim);
    const repPlancher = r2(volPlancher);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `an equally-weighted portfolio of ${f(n0, 0)} identical lines, each with volatility ${pct(sigma, 0)} and a uniform pairwise correlation of ${f(rho, 2)}`
      : `un portefeuille équipondéré de ${f(n0, 0)} lignes identiques, chacune de volatilité ${pct(sigma, 0)}, avec une corrélation uniforme de ${f(rho, 2)} entre lignes`;
    const contexte = (en
      ? [
        `Your equity fund keeps adding names "for safety", and you finally model the book as ${desc}. Before the next purchase, you want the true numbers: the portfolio variance today, the floor no amount of stacking will ever pierce, and where the marginal line stops paying.`,
        `The ALM committee of a private bank reviews the model allocation, summarised as ${desc}. The committee wants the variance as it stands, the incompressible systematic risk in volatility points, and the line count beyond which diversification is mostly décor.`,
        `As CIO, you arbitrate between research costs and risk: the book behaves like ${desc}. Each line costs analyst time — so you quantify the variance now, the n → ∞ limit, and the number of lines that already captures most of the benefit.`,
      ]
      : [
        `Votre fonds actions empile les lignes « par prudence », et vous finissez par modéliser le livre comme ${desc}. Avant le prochain achat, vous voulez les vrais chiffres : la variance actuelle du portefeuille, le plancher qu'aucun empilement ne percera, et le moment où la ligne marginale cesse de payer.`,
        `Le comité ALM d'une banque privée passe en revue l'allocation modèle, résumée par ${desc}. Le comité veut la variance en l'état, le risque systématique incompressible en points de volatilité, et le nombre de lignes au-delà duquel la diversification relève du décor.`,
        `CIO, vous arbitrez entre coût de recherche et risque : le livre se comporte comme ${desc}. Chaque ligne coûte du temps d'analyste — vous chiffrez donc la variance actuelle, la limite quand n tend vers l'infini, et le nombre de lignes qui capte déjà l'essentiel du bénéfice.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The portfolio variance' : 'a) La variance du portefeuille',
          enonce: en
            ? `What is the variance of the equally-weighted portfolio of ${f(n0, 0)} lines, in %²?`
            : `Quelle est la variance du portefeuille équipondéré de ${f(n0, 0)} lignes, en %² ?`,
          reponse: repVar, tolerance: 0.005, unite: '%²',
          etapes: [
            {
              titre: en ? 'Two pockets of variance' : 'Deux poches de variance',
              contenu: en
                ? `For n identical lines, $\\sigma_p^2 = \\frac{\\sigma^2}{n} + (1 - \\frac{1}{n})\\,\\rho\\sigma^2$. Idiosyncratic pocket: ${f(sigma, 0)}²/${f(n0, 0)} = ${f(r2(termeIdio))} — it shrinks in 1/n. Correlated pocket: (1 − 1/${f(n0, 0)}) × ${f(rho, 2)} × ${f(sigma, 0)}² = ${f(r2(termeCorr))} — it stays. At n = 2, the formula gives ${f(sigma, 0)}²/2 + ρ${f(sigma, 0)}²/2 = ${f(r2(var2))} %² — exactly the two-asset mould with w = 1/2: same machinery, generalised.`
                : `Pour n lignes identiques, $\\sigma_p^2 = \\frac{\\sigma^2}{n} + (1 - \\frac{1}{n})\\,\\rho\\sigma^2$. Poche idiosyncratique : ${f(sigma, 0)}²/${f(n0, 0)} = ${f(r2(termeIdio))} — elle s'écrase en 1/n. Poche corrélée : (1 − 1/${f(n0, 0)}) × ${f(rho, 2)} × ${f(sigma, 0)}² = ${f(r2(termeCorr))} — elle reste. À n = 2, la formule redonne ${f(sigma, 0)}²/2 + ρ${f(sigma, 0)}²/2 = ${f(r2(var2))} %² — exactement le moule à deux actifs avec w = 1/2 : même mécanique, généralisée.`,
            },
            {
              titre: en ? 'Sum' : 'Somme',
              contenu: en
                ? `$\\sigma_p^2$ = ${f(r2(termeIdio))} + ${f(r2(termeCorr))} = **${f(repVar)} %²**, i.e. a volatility of ${pct(r2(Math.sqrt(varN0)))} against ${pct(sigma, 0)} for a single line.`
                : `$\\sigma_p^2$ = ${f(r2(termeIdio))} + ${f(r2(termeCorr))} = **${f(repVar)} %²**, soit une volatilité de ${pct(r2(Math.sqrt(varN0)))} contre ${pct(sigma, 0)} pour une ligne seule.`,
            },
          ],
          pieges: [en
            ? `Keeping only σ²/n = ${f(r2(termeIdio))} %² is the ρ = 0 world: with correlated lines, the cross-covariances dominate as soon as n grows.`
            : `Ne garder que σ²/n = ${f(r2(termeIdio))} %², c'est le monde ρ = 0 : avec des lignes corrélées, les covariances croisées dominent dès que n grandit.`],
        },
        {
          intitule: en ? 'b) The n → ∞ limit' : 'b) La limite quand n → ∞',
          enonce: en
            ? `Toward what variance does the portfolio tend as the number of lines grows without bound, in %²?`
            : `Vers quelle variance le portefeuille tend-il quand le nombre de lignes croît sans limite, en %² ?`,
          reponse: repLim, tolerance: 0.005, unite: '%²',
          etapes: [
            {
              titre: en ? 'Let n go to infinity' : "Faire tendre n vers l'infini",
              contenu: en
                ? `σ²/n → 0 and (1 − 1/n) → 1, hence $\\sigma_\\infty^2 = \\rho\\sigma^2$ = ${f(rho, 2)} × ${f(sigma, 0)}² = **${f(repLim)} %²**.`
                : `σ²/n → 0 et (1 − 1/n) → 1, d'où $\\sigma_\\infty^2 = \\rho\\sigma^2$ = ${f(rho, 2)} × ${f(sigma, 0)}² = **${f(repLim)} %²**.`,
            },
            {
              titre: en ? 'What the limit is made of' : 'De quoi la limite est faite',
              contenu: en
                ? `Ten thousand lines would not pierce this floor: it is set by the AVERAGE COVARIANCE between assets, not by their number. Diversification erases what is specific to each line; it is powerless against what they share.`
                : `Dix mille lignes ne perceraient pas ce plancher : il est fixé par la COVARIANCE MOYENNE entre actifs, pas par leur nombre. La diversification efface ce qui est propre à chaque ligne ; elle ne peut rien contre ce qu'elles partagent.`,
            },
          ],
          pieges: [en
            ? `Believing the variance tends to 0: that only holds at ρ = 0 — and a uniform zero correlation across equities does not exist in practice.`
            : `Croire que la variance tend vers 0 : ce n'est vrai qu'à ρ = 0 — et une corrélation uniformément nulle entre actions n'existe pas en pratique.`],
        },
        {
          intitule: en ? 'c) The systematic-risk floor' : 'c) Le plancher de risque systématique',
          enonce: en
            ? `Express the incompressible risk as a volatility, in %.`
            : `Exprimez le risque incompressible en volatilité, en %.`,
          reponse: repPlancher, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The root of the floor' : 'La racine du plancher',
            contenu: en
              ? `$\\sigma_\\infty = \\sqrt{\\rho\\sigma^2} = \\sigma\\sqrt{\\rho}$ = ${f(sigma, 0)} × ${f(r3(Math.sqrt(rho)), 3)} = **${pct(repPlancher)}**. Diversification only erased ${f(r2(sigma - volPlancher))} pts of the initial ${pct(sigma, 0)}: the rest is systematic — the risk the market pays a premium for bearing (module 12).`
              : `$\\sigma_\\infty = \\sqrt{\\rho\\sigma^2} = \\sigma\\sqrt{\\rho}$ = ${f(sigma, 0)} × ${f(r3(Math.sqrt(rho)), 3)} = **${pct(repPlancher)}**. La diversification n'a effacé que ${f(r2(sigma - volPlancher))} pts des ${pct(sigma, 0)} initiaux : le reste est systématique — le risque que le marché rémunère par une prime (module 12).`,
          }],
          pieges: [en
            ? `Writing ρσ = ${f(r2(rho * sigma))}% confuses scales: the limit ρσ² is a VARIANCE, so the volatility is σ√ρ, not ρσ.`
            : `Écrire ρσ = ${f(r2(rho * sigma))} % confond les échelles : la limite ρσ² est une VARIANCE, donc la volatilité vaut σ√ρ, pas ρσ.`],
        },
        {
          intitule: en ? 'd) How many lines for the bulk of the benefit' : "d) Combien de lignes pour l'essentiel du bénéfice",
          enonce: en
            ? `How many lines does it take to capture ${f(fCible * 100, 0)}% of the total diversification benefit (in variance terms)?`
            : `Combien de lignes faut-il pour capter ${f(fCible * 100, 0)} % du bénéfice total de la diversification (en variance) ?`,
          reponse: nCapte, tolerance: 0.5, toleranceMode: 'absolu',
          unite: en ? 'lines' : 'lignes',
          etapes: [
            {
              titre: en ? 'The total benefit' : 'Le bénéfice total',
              contenu: en
                ? `From one line (σ² = ${f(sigma ** 2, 0)}) to the floor (ρσ² = ${f(repLim)}), the total erasable variance is $(1-\\rho)\\sigma^2$ = ${f(r2((1 - rho) * sigma ** 2))} %². At n lines, the erased part is $(1-\\rho)\\sigma^2 (1 - \\frac{1}{n})$.`
                : `D'une ligne (σ² = ${f(sigma ** 2, 0)}) au plancher (ρσ² = ${f(repLim)}), la variance effaçable totale vaut $(1-\\rho)\\sigma^2$ = ${f(r2((1 - rho) * sigma ** 2))} %². À n lignes, la part effacée vaut $(1-\\rho)\\sigma^2 (1 - \\frac{1}{n})$.`,
            },
            {
              titre: en ? 'A fraction that forgets σ and ρ' : 'Une fraction qui oublie σ et ρ',
              contenu: en
                ? `Captured fraction = $1 - \\frac{1}{n}$ — independent of σ AND of ρ! Capturing ${f(fCible * 100, 0)}% requires $n \\geq \\frac{1}{1 - ${f(fCible, 2)}}$ = **${f(nCapte, 0)} lines**. The first few names do almost all the work; beyond, each added line costs more in research and fees than it removes in risk.`
                : `Fraction captée = $1 - \\frac{1}{n}$ — indépendante de σ ET de ρ ! Capter ${f(fCible * 100, 0)} % exige $n \\geq \\frac{1}{1 - ${f(fCible, 2)}}$ = **${f(nCapte, 0)} lignes**. Les premières lignes font presque tout le travail ; au-delà, chaque ligne ajoutée coûte plus en recherche et en frais qu'elle ne retire de risque.`,
            },
          ],
          pieges: [en
            ? `Counting the benefit in volatility rather than variance changes the answer: the 1 − 1/n shortcut only holds on the variance scale, where risks add.`
            : `Compter le bénéfice en volatilité plutôt qu'en variance change la réponse : le raccourci 1 − 1/n ne vaut que sur l'échelle des variances, celle où les risques s'additionnent.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 15. m2-pb-brainteaser-sequentiel — N4, boss 1                       */
/* ------------------------------------------------------------------ */
const brainteaserSequentiel: ProblemGenerator = {
  id: 'm2-pb-brainteaser-sequentiel', moduleId: M2,
  titre: 'Le brainteaser à étages',
  titreEn: 'The multi-stage brainteaser',
  typeDeCas: 'probabilités séquentielles & Bayes',
  typeDeCasEn: 'sequential probability & Bayes',
  difficulte: 4,
  scenarios: ['Entretien dans un fonds quantitatif', 'Grand oral devant le jury', "Finale d'un escape game financier"],
  scenariosEn: ['Interview at a quantitative fund', 'Viva voce before the jury', 'Final of a finance-themed escape game'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const b = pick(rng, [3, 4, 7, 9] as const);
    const G = pick(rng, [80, 100, 120] as const);
    const C = pick(rng, [20, 30, 40] as const);

    const nTot = b + 1;
    const prior = 1 / nTot;
    const pH1 = (b / 2 + 1) / nTot;
    const pHH = (b / 4 + 1) / nTot;
    const pH2s1 = pHH / pH1;
    const postT = bayes(prior, 1, 0.25);
    const espJeu = pHH * G - C;
    const repA = r2(pH1 * 100);
    const repB = r2(pH2s1 * 100);
    const repPost = r2(postT * 100);
    const repJeu = r2(espJeu);
    const fracA = `${b + 2}/${2 * nTot}`;
    const fracHH = `${b + 4}/${4 * nTot}`;
    const fracB = `${b + 4}/${2 * (b + 2)}`;
    const fracPost = `4/${4 + b}`;

    const { en, f, eur, pct } = outils(langue);
    const desc = en
      ? `a bag holds ${b} fair coins and 1 two-headed coin; you draw one at random and will flip it twice. The dealer pays €${f(G, 0)} if both flips land heads, for a stake of €${f(C, 0)}`
      : `un sac contient ${b} pièces équilibrées et 1 pièce truquée à deux faces pile ; vous en tirez une au hasard et la lancerez deux fois. La banque paie ${f(G, 0)} € si les deux lancers donnent pile, pour une mise de ${f(C, 0)} €`;
    const contexte = (en
      ? [
        `Final interview round at a quantitative fund. The partner slides a bag across the table: ${desc}. He expects the full tree, not gut feeling: the probability of the first heads, the second given the first, the coin unmasked by Bayes — and the value of the game.`,
        `Viva voce: the jury pulls out its favourite staged problem. ${desc}. Every link of the chain is graded: total probability, conditioning, Bayesian inversion, then the expected value of the whole game — with clean fractions at every step.`,
        `Final of a finance-themed escape game: the last chest opens only on exact numbers. ${desc}. The four digits of the code are precisely the four answers below — sequential draws, then the inverted probability, then the value of playing.`,
      ]
      : [
        `Dernier tour d'entretien dans un fonds quantitatif. L'associé fait glisser un sac sur la table : ${desc}. Il attend l'arbre complet, pas l'intuition : la probabilité du premier pile, celle du second sachant le premier, la pièce démasquée par Bayes — et la valeur du jeu.`,
        `Grand oral : le jury sort son problème à étages favori. ${desc}. Chaque maillon de la chaîne est noté : probabilités totales, conditionnement, inversion bayésienne, puis l'espérance du jeu complet — fractions propres exigées à chaque étape.`,
        `Finale d'un escape game financier : le dernier coffre ne s'ouvre que sur des chiffres exacts. ${desc}. Les quatre chiffres du code sont précisément les quatre réponses ci-dessous — tirages séquentiels, probabilité inversée, puis valeur du jeu.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The first flip' : 'a) Le premier lancer',
          enonce: en
            ? `What is the probability that the FIRST flip lands heads, in %?`
            : `Quelle est la probabilité que le PREMIER lancer donne pile, en % ?`,
          reponse: repA, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'The tree of coins' : "L'arbre des pièces",
              contenu: en
                ? `Fair coin (probability ${b}/${nTot}): heads with 1/2. Two-headed coin (probability 1/${nTot}): heads for sure.`
                : `Pièce équilibrée (probabilité ${b}/${nTot}) : pile à 1/2. Pièce truquée (probabilité 1/${nTot}) : pile à coup sûr.`,
            },
            {
              titre: en ? 'Total probability' : 'Probabilités totales',
              contenu: en
                ? `$P(P_1)$ = (${b} × 1/2 + 1 × 1) / ${nTot} = ${fracA} = **${pct(repA)}** — above 50%: the rigged coin tilts the whole bag.`
                : `$P(P_1)$ = (${b} × 1/2 + 1 × 1) / ${nTot} = ${fracA} = **${pct(repA)}** — au-dessus de 50 % : la pièce truquée penche tout le sac.`,
            },
          ],
          pieges: [en
            ? `Answering 50% forgets the rigged coin: the flip is fair only CONDITIONALLY on having drawn a fair coin.`
            : `Répondre 50 % oublie la pièce truquée : le lancer n'est équilibré que CONDITIONNELLEMENT au tirage d'une pièce équilibrée.`],
        },
        {
          intitule: en ? 'b) The second flip, given the first' : 'b) Le second lancer, sachant le premier',
          enonce: en
            ? `Given that the first flip landed heads, what is the probability that the second lands heads too, in %?`
            : `Sachant que le premier lancer a donné pile, quelle est la probabilité que le second donne pile aussi, en % ?`,
          reponse: repB, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'The numerator: two heads' : 'Le numérateur : deux piles',
              contenu: en
                ? `$P(P_1 \\cap P_2)$ = (${b} × 1/4 + 1 × 1) / ${nTot} = ${fracHH} = ${pct(r2(pHH * 100))} (the fair coin gives heads-heads with 1/4, the rigged one always).`
                : `$P(P_1 \\cap P_2)$ = (${b} × 1/4 + 1 × 1) / ${nTot} = ${fracHH} = ${pct(r2(pHH * 100))} (la pièce équilibrée donne pile-pile avec 1/4, la truquée toujours).`,
            },
            {
              titre: en ? 'Divide — and read the surprise' : 'Diviser — et lire la surprise',
              contenu: en
                ? `$P(P_2|P_1) = \\frac{P(P_1 \\cap P_2)}{P(P_1)}$ = ${fracHH} ÷ ${fracA} = ${fracB} = **${pct(repB)}** > ${pct(repA)}: the first heads made the rigged coin more credible, which lifts the second flip. The flips are NOT independent as long as the coin stays unknown.`
                : `$P(P_2|P_1) = \\frac{P(P_1 \\cap P_2)}{P(P_1)}$ = ${fracHH} ÷ ${fracA} = ${fracB} = **${pct(repB)}** > ${pct(repA)} : le premier pile a rendu la pièce truquée plus crédible, ce qui dope le second lancer. Les lancers ne sont PAS indépendants tant que la pièce reste inconnue.`,
            },
          ],
          pieges: [en
            ? `Reusing a) (or 50%) assumes independence — exactly what the uncertainty about the coin destroys: information flows from one flip to the next through the coin.`
            : `Reprendre le a) (ou 50 %) suppose l'indépendance — exactement ce que l'incertitude sur la pièce détruit : l'information circule d'un lancer à l'autre via la pièce.`],
        },
        {
          intitule: en ? 'c) Bayes unmasks the coin' : 'c) Bayes démasque la pièce',
          enonce: en
            ? `Both flips landed heads. What is the probability that the coin you drew is the two-headed one, in %?`
            : `Les deux lancers ont donné pile. Quelle est la probabilité que la pièce tirée soit la truquée, en % ?`,
          reponse: repPost, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'Invert with Bayes' : 'Inverser avec Bayes',
              contenu: en
                ? `$P(rigged|PP) = \\frac{1 \\times 1/${nTot}}{${fracHH}}$ = ${fracPost} = **${pct(repPost)}** (likelihoods: 1 for the rigged coin, (1/2)² = 1/4 for a fair one).`
                : `$P(truquée|PP) = \\frac{1 \\times 1/${nTot}}{${fracHH}}$ = ${fracPost} = **${pct(repPost)}** (vraisemblances : 1 pour la truquée, (1/2)² = 1/4 pour une équilibrée).`,
            },
            {
              titre: en ? 'The road from the prior' : 'Le chemin depuis le prior',
              contenu: en
                ? `Prior 1/${nTot} = ${pct(r2(prior * 100))} → after two heads, ${pct(repPost)}: each heads doubles the odds of the rigged coin (likelihood ratio 1 ÷ 1/2 = 2). Evidence compounds multiplicatively on the odds — the engine behind every sequential update.`
                : `Prior 1/${nTot} = ${pct(r2(prior * 100))} → après deux piles, ${pct(repPost)} : chaque pile double les cotes de la pièce truquée (rapport de vraisemblance 1 ÷ 1/2 = 2). L'évidence se compose multiplicativement sur les cotes — le moteur de toute mise à jour séquentielle.`,
            },
          ],
          pieges: [en
            ? `Answering 100% forgets that a fair coin produces heads-heads one time in four: certainty would require infinitely many heads.`
            : `Répondre 100 % oublie qu'une pièce équilibrée produit pile-pile une fois sur quatre : la certitude exigerait une infinité de piles.`],
        },
        {
          intitule: en ? 'd) The value of the full game' : 'd) La valeur du jeu complet',
          enonce: en
            ? `The dealer pays €${f(G, 0)} if both flips land heads, for a stake of €${f(C, 0)}. What is the expected NET gain of the game, in euros?`
            : `La banque paie ${f(G, 0)} € si les deux lancers donnent pile, pour une mise de ${f(C, 0)} €. Quelle est l'espérance de gain NET du jeu, en € ?`,
          reponse: repJeu, tolerance: 0.05, toleranceMode: 'absolu', unite: '€',
          etapes: [
            {
              titre: en ? 'Expected net gain' : 'Espérance nette',
              contenu: en
                ? `$E$ = P(PP) × ${f(G, 0)} − ${f(C, 0)} = ${fracHH} × ${f(G, 0)} − ${f(C, 0)} = ${f(r2(pHH * G))} − ${f(C, 0)} = **${eur(repJeu)}**.`
                : `$E$ = P(PP) × ${f(G, 0)} − ${f(C, 0)} = ${fracHH} × ${f(G, 0)} − ${f(C, 0)} = ${f(r2(pHH * G))} − ${f(C, 0)} = **${eur(repJeu)}**.`,
            },
            {
              titre: en ? 'The verdict — and the grading grid' : 'Le verdict — et la grille du jury',
              contenu: en
                ? `${espJeu > 0 ? `Positive expectation: the game is worth playing for a risk-neutral agent — the bag's tilt finances the stake.` : `Negative expectation: decline — the stake overprices the bag's tilt.`} What the interviewer grades is the TREE: the candidate who reused 1/4 × ${f(G, 0)} (fair-coin reflex) or forgot the prior in c) fails on method, whatever the final number.`
                : `${espJeu > 0 ? `Espérance positive : le jeu vaut d'être joué pour un agent neutre au risque — le biais du sac finance la mise.` : `Espérance négative : on décline — la mise surpaie le biais du sac.`} Ce que l'intervieweur note, c'est l'ARBRE : le candidat qui reprend 1/4 × ${f(G, 0)} (réflexe pièce équilibrée) ou oublie le prior au c) échoue sur la méthode, quel que soit le chiffre final.`,
            },
          ],
          pieges: [en
            ? `Computing P(PP) as a) × a) (${pct(r2(pH1 * pH1 * 100))}) multiplies two non-independent flips: the joint probability goes through the coins, as in b).`
            : `Calculer P(PP) comme a) × a) (${pct(r2(pH1 * pH1 * 100))}) multiplie deux lancers non indépendants : la probabilité jointe passe par les pièces, comme au b).`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 16. m2-pb-data-snooping — N4, boss 2                                */
/* ------------------------------------------------------------------ */
const dataSnooping: ProblemGenerator = {
  id: 'm2-pb-data-snooping', moduleId: M2,
  titre: 'Le data snooping, chiffré',
  titreEn: 'Data snooping, quantified',
  typeDeCas: 'tests multiples & data snooping',
  typeDeCasEn: 'multiple testing & data snooping',
  difficulte: 4,
  scenarios: ['Recruteur qui trie des track records', "Comité d'allocation devant une liasse de backtests", 'Régulateur qui audite une plateforme de signaux'],
  scenariosEn: ['Recruiter screening track records', 'Allocation committee facing a stack of backtests', 'Regulator auditing a signal platform'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const k = randInt(rng, 8, 40);

    const pAuMoinsUn = (1 - 0.95 ** k) * 100;
    const bonf = 5 / k;
    const doublePasse = k * 0.0025;
    const fwerBonf = (1 - (1 - 0.05 / k) ** k) * 100;
    const repUn = r2(pAuMoinsUn);
    const repBonf = r3(bonf);
    const repDouble = r3(doublePasse);
    const repFwer = r2(fwerBonf);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `${f(k, 0)} candidate strategies, none of which has any genuine skill, are each tested at the 5% significance level`
      : `${f(k, 0)} stratégies candidates, dont aucune n'a de talent réel, sont testées chacune au seuil de signification de 5 %`;
    const contexte = (en
      ? [
        `As a recruiter at a quant fund, you sort a pile of applications — and you know the dirty secret of the industry: suppose ${desc}. Before summoning the "best" candidate, you quantify what luck alone would produce, and the protocol that would stop it from getting hired.`,
        `At the allocation committee, a sponsor presents his shelf: in the worst case, ${desc}. The committee wants the sobering numbers: how many "significant" results by pure luck, what corrected threshold to impose, and what an out-of-sample re-test is actually worth.`,
        `As a regulator, you audit a platform selling trading signals; its marketing screens amount to this: ${desc}. Your note must quantify the expected false positives, impose a corrected threshold, and grade the platform's advertised re-testing protocol.`,
      ]
      : [
        `Recruteur dans un fonds quantitatif, vous triez une pile de candidatures — et vous connaissez le secret honteux du métier : supposez que ${desc}. Avant de convoquer le « meilleur », vous chiffrez ce que le hasard seul produirait, et le protocole qui l'empêcherait de signer.`,
        `Au comité d'allocation, un promoteur présente sa gamme : dans le pire des cas, ${desc}. Le comité veut les chiffres qui dégrisent : combien de « significatifs » par pur hasard, quel seuil corrigé imposer, et ce que vaut réellement un re-test out-of-sample.`,
        `Régulateur, vous auditez une plateforme qui vend des signaux ; ses filtres marketing reviennent à ceci : ${desc}. Votre note doit chiffrer les faux positifs attendus, imposer un seuil corrigé et noter le protocole de re-test affiché par la plateforme.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) At least one false positive' : 'a) Au moins un faux positif',
          enonce: en
            ? `If the ${f(k, 0)} null strategies are tested independently at 5%, what is the probability of getting AT LEAST one "significant" result, in %?`
            : `Si les ${f(k, 0)} stratégies nulles sont testées indépendamment à 5 %, quelle est la probabilité d'obtenir AU MOINS un résultat « significatif », en % ?`,
          reponse: repUn, tolerance: 0.1, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'Go through the complement' : 'Passer par le complément',
              contenu: en
                ? `P(no false positive) = 0.95^${f(k, 0)} = ${f(0.95 ** k, 3)}: every single test must stay quiet at once.`
                : `P(aucun faux positif) = 0,95^${f(k, 0)} = ${f(0.95 ** k, 3)} : il faut que tous les tests se taisent en même temps.`,
            },
            {
              titre: en ? 'Flip it' : 'Retourner',
              contenu: en
                ? `P(at least one) = 1 − ${f(0.95 ** k, 3)} = **${pct(repUn)}**. With ${f(k, 0)} attempts, the lucky "discovery" is ${pAuMoinsUn > 50 ? 'more likely than not' : 'anything but rare'} — it is the expected by-product of the search itself.`
                : `P(au moins un) = 1 − ${f(0.95 ** k, 3)} = **${pct(repUn)}**. Avec ${f(k, 0)} essais, la « découverte » chanceuse est ${pAuMoinsUn > 50 ? `plus probable qu'improbable` : 'tout sauf rare'} — c'est le sous-produit attendu de la recherche elle-même.`,
            },
          ],
          pieges: [en
            ? `Adding k × 5% = ${pct(r1(k * 5), 0)} ignores overlaps (and absurdly exceeds 100% past 20 tests): probabilities of unions go through the complement.`
            : `Additionner k × 5 % = ${pct(r1(k * 5), 0)} ignore les recouvrements (et dépasse absurdement 100 % au-delà de 20 tests) : une probabilité d'union passe par le complément.`],
        },
        {
          intitule: en ? 'b) The Bonferroni threshold' : 'b) Le seuil de Bonferroni',
          enonce: en
            ? `What per-test significance level must be imposed to keep the overall risk at about 5%, in %?`
            : `Quel seuil de signification PAR TEST faut-il imposer pour maintenir le risque global à environ 5 %, en % ?`,
          reponse: repBonf, tolerance: 0.01, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'Divide the budget' : 'Diviser le budget',
              contenu: en
                ? `Bonferroni: $\\alpha/k$ = 5% / ${f(k, 0)} = **${pct(repBonf, 3)}** per test. The 5% is a family-wide error budget, split across the ${f(k, 0)} attempts.`
                : `Bonferroni : $\\alpha/k$ = 5 % / ${f(k, 0)} = **${pct(repBonf, 3)}** par test. Le 5 % est un budget d'erreur GLOBAL, réparti entre les ${f(k, 0)} essais.`,
            },
            {
              titre: en ? 'The guarantee and its price' : 'La garantie et son prix',
              contenu: en
                ? `Union bound: P(at least one false positive) ≤ k × α/k = 5%, whatever the dependences between tests. The price: detecting a TRUE talent becomes much harder — the power of each test collapses with the threshold.`
                : `Borne de l'union : P(au moins un faux positif) ≤ k × α/k = 5 %, quelles que soient les dépendances entre tests. Le prix : détecter un VRAI talent devient bien plus dur — la puissance de chaque test s'effondre avec le seuil.`,
            },
          ],
        },
        {
          intitule: en ? 'c) Re-testing the "winner" out of sample' : 'c) Le re-test du « gagnant » hors échantillon',
          enonce: en
            ? `Alternative protocol: every strategy "significant" in-sample is re-tested at 5% on fresh out-of-sample data. On average, how many NULL strategies out of the ${f(k, 0)} clear BOTH hurdles?`
            : `Autre protocole : toute stratégie « significative » in-sample est re-testée à 5 % sur des données out-of-sample neuves. En moyenne, combien de stratégies NULLES sur les ${f(k, 0)} franchissent les DEUX barrières ?`,
          reponse: repDouble, tolerance: 0.005, toleranceMode: 'absolu',
          unite: en ? 'strategies' : 'stratégies',
          etapes: [
            {
              titre: en ? 'Two independent hurdles' : 'Deux barrières indépendantes',
              contenu: en
                ? `A null strategy fools the first test with probability 0.05, then the second — on FRESH data, hence independently — with 0.05 again: 0.05² = 0.25% per strategy.`
                : `Une stratégie nulle trompe le premier test avec une probabilité de 0,05, puis le second — sur données NEUVES, donc indépendamment — avec 0,05 encore : 0,05² = 0,25 % par stratégie.`,
            },
            {
              titre: en ? 'Across the stack' : 'Sur toute la liasse',
              contenu: en
                ? `Expected double-passers = ${f(k, 0)} × 0.0025 = **${f(repDouble, 3)}** strategy(ies), against ${f(r2(k * 0.05))} with a single test: the re-test divides the lucky survivors by 20.`
                : `Doubles passages attendus = ${f(k, 0)} × 0,0025 = **${f(repDouble, 3)}** stratégie(s), contre ${f(r2(k * 0.05))} avec un seul test : le re-test divise les survivants chanceux par 20.`,
            },
          ],
          pieges: [en
            ? `Re-testing on the SAME data divides nothing: the strategy will pass again by construction — the out-of-sample window must be genuinely new.`
            : `Re-tester sur les MÊMES données ne divise rien : la stratégie y repassera par construction — la fenêtre out-of-sample doit être réellement neuve.`],
        },
        {
          intitule: en ? 'd) The quantified decision' : 'd) La décision chiffrée',
          enonce: en
            ? `With the Bonferroni threshold of b) applied to the ${f(k, 0)} tests, what does the probability of at least one false positive become, in %?`
            : `Avec le seuil de Bonferroni du b) appliqué aux ${f(k, 0)} tests, que devient la probabilité d'au moins un faux positif, en % ?`,
          reponse: repFwer, tolerance: 0.1, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'Recompute' : 'Recalculer',
              contenu: en
                ? `1 − (1 − 0.05/${f(k, 0)})^${f(k, 0)} = **${pct(repFwer)}** — back under 5%, against ${pct(repUn)} without correction.`
                : `1 − (1 − 0,05/${f(k, 0)})^${f(k, 0)} = **${pct(repFwer)}** — repassée sous 5 %, contre ${pct(repUn)} sans correction.`,
            },
            {
              titre: en ? 'The decision, in writing' : 'La décision, rédigée',
              contenu: en
                ? `Nothing gets signed on an isolated t > 1.96 drawn from a stack of ${f(k, 0)}: require Bonferroni OR a fresh out-of-sample window, and keep a) in mind — with ${f(k, 0)} attempts, luck supplies a "winner" with probability ${pct(repUn)}. The best backtest of a stack is a product of the sorting, not a proof of skill.`
                : `Rien ne se signe sur un t > 1,96 isolé extrait d'une liasse de ${f(k, 0)} : exiger Bonferroni OU une fenêtre out-of-sample neuve, et garder le a) en tête — avec ${f(k, 0)} essais, le hasard fournit un « gagnant » avec une probabilité de ${pct(repUn)}. Le meilleur backtest d'une liasse est un produit du tri, pas une preuve de talent.`,
            },
          ],
          pieges: [en
            ? `Believing Bonferroni proves the survivors are skilled: it only restores the meaning of "significant" — the burden of proof still lies with fresh data.`
            : `Croire que Bonferroni prouve le talent des survivants : il ne fait que rendre son sens à « significatif » — la charge de la preuve reste aux données neuves.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 17. m2-pb-bayes-double-test — N4, boss 3                            */
/* ------------------------------------------------------------------ */
const bayesDoubleTest: ProblemGenerator = {
  id: 'm2-pb-bayes-double-test', moduleId: M2,
  titre: 'Deux positifs valent-ils preuve ?',
  titreEn: 'Do two positives make a proof?',
  typeDeCas: 'Bayes séquentiel',
  typeDeCasEn: 'sequential Bayes',
  difficulte: 4,
  scenarios: ['Diagnostic confirmé par un second test', 'Double signal sur le desk quantitatif', 'Double alerte à la cellule antifraude'],
  scenariosEn: ['Diagnosis confirmed by a second test', 'Double signal on the quant desk', 'Double alert in the anti-fraud unit'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const prev = randFloat(rng, 1, 5, 1);
    const sens = randInt(rng, 85, 95);
    const fpos = randFloat(rng, 5, 12, 1);

    const p = prev / 100;
    const se = sens / 100;
    const fp = fpos / 100;
    const post1 = bayes(p, se, fp);
    const post2 = bayes(post1, se, fp);
    const unCoup = bayes(p, se * se, fp * fp);
    const lr = se / fp;
    const rep1 = r2(post1 * 100);
    const rep2 = r2(post2 * 100);
    const rep3 = r2(unCoup * 100);
    const repGap = r2(post2 * 100 - post1 * 100);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `the base rate is ${pct(prev, 1)}; each test catches ${pct(sens, 0)} of true cases and rings wrongly on ${pct(fpos, 1)} of clean ones`
      : `le taux de base est de ${pct(prev, 1)} ; chaque test détecte ${pct(sens, 0)} des vrais cas et sonne à tort sur ${pct(fpos, 1)} des cas sains`;
    const contexte = (en
      ? [
        `At the clinic, a patient has just received TWO successive positive results from tests run independently: ${desc}. Your job is to explain what the first alert is worth, what the second truly adds — and what the independence assumption manufactures in silence.`,
        `On the quant desk, two separately designed signals fired on the same day: ${desc}. Before committing capital, you run Bayes twice — and you quantify what the confirmation is worth if the two signals actually share their errors.`,
        `Anti-fraud unit: one file has just tripped two distinct checks: ${desc}. The committee wants to know whether "two alerts" amount to a conviction — or whether the correlation between checks deflates the evidence.`,
      ]
      : [
        `À la clinique, un patient vient de recevoir DEUX résultats positifs successifs issus de tests passés indépendamment : ${desc}. À vous d'expliquer ce que vaut la première alerte, ce que la seconde ajoute vraiment — et ce que l'hypothèse d'indépendance fabrique en silence.`,
        `Sur le desk quantitatif, deux signaux conçus séparément ont sonné le même jour : ${desc}. Avant d'engager le capital, vous déroulez Bayes deux fois — et vous chiffrez ce que vaut la confirmation si les deux signaux partagent en réalité leurs erreurs.`,
        `Cellule antifraude : un dossier vient de déclencher deux contrôles distincts : ${desc}. Le comité veut savoir si « deux alertes » valent condamnation — ou si la corrélation entre contrôles dégonfle la preuve.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The posterior after the first positive' : 'a) Le posterior après le premier positif',
          enonce: en
            ? `After the first positive, what is the probability that the case is genuinely positive, in %?`
            : `Après le premier test positif, quelle est la probabilité que le cas soit réellement positif, en % ?`,
          reponse: rep1, tolerance: 0.1, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'Standard Bayes' : 'Bayes standard',
              contenu: en
                ? `$P(vrai|+) = \\frac{${f(se, 2)} × ${f(p, 3)}}{${f(se, 2)} × ${f(p, 3)} + ${f(fp, 3)} × ${f(1 - p, 3)}}$ = ${f(se * p, 4)} / ${f(se * p + fp * (1 - p), 4)} = **${pct(rep1)}**.`
                : `$P(vrai|+) = \\frac{${f(se, 2)} × ${f(p, 3)}}{${f(se, 2)} × ${f(p, 3)} + ${f(fp, 3)} × ${f(1 - p, 3)}}$ = ${f(se * p, 4)} / ${f(se * p + fp * (1 - p), 4)} = **${pct(rep1)}**.`,
            },
            {
              titre: en ? 'Still far from certainty' : 'Encore loin de la certitude',
              contenu: en
                ? `One positive lifts the case from ${pct(prev, 1)} to ${pct(rep1)} — a big jump, yet ${rep1 < 50 ? 'the case remains MORE LIKELY clean than not' : 'doubt remains material'}: the healthy mass keeps feeding false alarms.`
                : `Un positif fait passer le dossier de ${pct(prev, 1)} à ${pct(rep1)} — un grand bond, et pourtant ${rep1 < 50 ? 'le cas reste PLUS PROBABLEMENT sain que positif' : 'le doute reste substantiel'} : la masse saine continue d'alimenter les fausses alertes.`,
            },
          ],
          pieges: [en
            ? `Answering ${pct(sens, 0)} confuses P(+|true) with P(true|+) — the inversion is the whole point of Bayes.`
            : `Répondre ${pct(sens, 0)} confond P(+|vrai) et P(vrai|+) — l'inversion est précisément l'objet de Bayes.`],
        },
        {
          intitule: en ? 'b) The posterior becomes the prior' : 'b) Le posterior devient le prior',
          enonce: en
            ? `The second test — independent of the first, conditionally on the true state — also comes back positive. What is the updated probability, in %?`
            : `Le second test — indépendant du premier, conditionnellement au vrai état — revient positif aussi. Quelle est la probabilité mise à jour, en % ?`,
          reponse: rep2, tolerance: 0.1, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'Re-inject a) as the prior' : 'Réinjecter le a) comme prior',
              contenu: en
                ? `Same formula, new prior: $P = \\frac{${f(se, 2)} × ${f(post1, 4)}}{${f(se, 2)} × ${f(post1, 4)} + ${f(fp, 3)} × ${f(1 - post1, 4)}}$ = **${pct(rep2)}**.`
                : `Même formule, nouveau prior : $P = \\frac{${f(se, 2)} × ${f(post1, 4)}}{${f(se, 2)} × ${f(post1, 4)} + ${f(fp, 3)} × ${f(1 - post1, 4)}}$ = **${pct(rep2)}**.`,
            },
            {
              titre: en ? 'The update machine' : 'La machine à mises à jour',
              contenu: en
                ? `From ${pct(prev, 1)} to ${pct(rep1)} to **${pct(rep2)}**: each positive multiplies the odds by the same likelihood ratio ${f(se, 2)}/${f(fp, 3)} = ${f(r2(lr))}. Yesterday's posterior is today's prior — the recursion at the heart of every sequential filter.`
                : `De ${pct(prev, 1)} à ${pct(rep1)} puis **${pct(rep2)}** : chaque positif multiplie les cotes par le même rapport de vraisemblance ${f(se, 2)}/${f(fp, 3)} = ${f(r2(lr))}. Le posterior d'hier est le prior d'aujourd'hui — la récurrence au cœur de tout filtre séquentiel.`,
            },
          ],
          pieges: [en
            ? `Restarting from the ${pct(prev, 1)} base rate for the second test throws away the information of the first: the chain must carry the updated prior.`
            : `Repartir du taux de base de ${pct(prev, 1)} pour le second test jette l'information du premier : la chaîne doit transporter le prior mis à jour.`],
        },
        {
          intitule: en ? 'c) Both at once' : "c) Les deux d'un coup",
          enonce: en
            ? `A colleague prefers one single block: likelihoods squared (detection ${f(se, 2)}², false alarm ${f(fp, 3)}²) applied to the original base rate. What probability does he find, in %?`
            : `Un collègue préfère un seul bloc : vraisemblances au carré (détection ${f(se, 2)}², fausse alerte ${f(fp, 3)}²) appliquées au taux de base initial. Quelle probabilité trouve-t-il, en % ?`,
          reponse: rep3, tolerance: 0.1, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'One Bayes, squared likelihoods' : 'Un seul Bayes, vraisemblances au carré',
              contenu: en
                ? `$P = \\frac{${f(se ** 2, 4)} × ${f(p, 3)}}{${f(se ** 2, 4)} × ${f(p, 3)} + ${f(fp ** 2, 4)} × ${f(1 - p, 3)}}$ = **${pct(rep3)}**.`
                : `$P = \\frac{${f(se ** 2, 4)} × ${f(p, 3)}}{${f(se ** 2, 4)} × ${f(p, 3)} + ${f(fp ** 2, 4)} × ${f(1 - p, 3)}}$ = **${pct(rep3)}**.`,
            },
            {
              titre: en ? 'Two roads, one theorem' : 'Deux routes, un seul théorème',
              contenu: en
                ? `Identical to b) to the last decimal: on the odds scale, posterior odds = prior odds × (${f(se, 2)}/${f(fp, 3)})². Chaining two updates or multiplying the likelihoods is one and the same operation — ALWAYS under conditional independence.`
                : `Identique au b) à la dernière décimale : sur l'échelle des cotes, cotes finales = cotes initiales × (${f(se, 2)}/${f(fp, 3)})². Enchaîner deux mises à jour ou multiplier les vraisemblances est une seule et même opération — TOUJOURS sous indépendance conditionnelle.`,
            },
          ],
          pieges: [en
            ? `Believing the order of the tests matters: multiplication is commutative — the posterior only depends on the evidence collected, not on its sequence.`
            : `Croire que l'ordre des tests compte : la multiplication est commutative — le posterior ne dépend que de l'évidence accumulée, pas de sa chronologie.`],
        },
        {
          intitule: en ? 'd) The independence trap, bounded' : "d) Le piège de l'indépendance, borné",
          enonce: en
            ? `If the two tests actually share their errors (perfect correlation: same bias, same machine), the second adds NOTHING and the probability stays at a). How many points of credibility does the independence assumption manufacture on its own?`
            : `Si les deux tests partagent en réalité leurs erreurs (corrélation parfaite : même biais, même machine), le second n'apporte RIEN et la probabilité reste celle du a). Combien de points de crédibilité l'hypothèse d'indépendance fabrique-t-elle à elle seule ?`,
          reponse: repGap, tolerance: 0.2, toleranceMode: 'absolu', unite: 'pts',
          etapes: [
            {
              titre: en ? 'The two bounds' : 'Les deux bornes',
              contenu: en
                ? `Perfect independence → ${pct(rep2)} (the b)). Perfectly correlated errors → ${pct(rep1)} (the a) — the second test is an echo). Gap = ${f(rep2)} − ${f(rep1)} = **${f(repGap)} pts**: that share of the conclusion rests on an ASSUMPTION, not on data. The truth lies between the two bounds, wherever the error correlation does.`
                : `Indépendance parfaite → ${pct(rep2)} (le b)). Erreurs parfaitement corrélées → ${pct(rep1)} (le a) — le second test n'est qu'un écho). Écart = ${f(rep2)} − ${f(rep1)} = **${f(repGap)} pts** : cette part de la conclusion repose sur une HYPOTHÈSE, pas sur une donnée. La vérité vit entre les deux bornes, là où se trouve la corrélation des erreurs.`,
            },
            {
              titre: en ? 'The professional reflex' : 'Le réflexe professionnel',
              contenu: en
                ? `Before celebrating a "confirmation", ask HOW the second test can be wrong: same data vendor, same sensor bias, same backtest window — and the confirmation is an echo chamber. In finance, two momentum signals on the same prices confirm each other by construction; real confirmation requires an INDEPENDENT error channel.`
                : `Avant de fêter une « confirmation », demandez COMMENT le second test peut se tromper : même fournisseur de données, même biais de capteur, même fenêtre de backtest — et la confirmation devient une chambre d'écho. En finance, deux signaux momentum sur les mêmes prix se confirment par construction ; une vraie confirmation exige un canal d'erreur INDÉPENDANT.`,
            },
          ],
          pieges: [en
            ? `Hoping a third test from the same provider would settle it: it inherits the very same error correlation — adding echoes is not adding evidence.`
            : `Espérer qu'un troisième test du même fournisseur tranchera : il hérite exactement de la même corrélation d'erreurs — ajouter des échos n'est pas ajouter de l'évidence.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 18. m2-pb-taille-echantillon-puissance — N4, boss 4                 */
/* ------------------------------------------------------------------ */
const tailleEchantillonPuissance: ProblemGenerator = {
  id: 'm2-pb-taille-echantillon-puissance', moduleId: M2,
  titre: "Combien d'années pour prouver un alpha ?",
  titreEn: 'How many years to prove an alpha?',
  typeDeCas: "taille d'échantillon & puissance",
  typeDeCasEn: 'sample size & statistical power',
  difficulte: 4,
  scenarios: ["Lancement d'une stratégie maison", "Test A/B de deux algorithmes d'exécution", 'Due diligence sur un jeune gérant'],
  scenariosEn: ['Launching an in-house strategy', 'A/B test of two execution algorithms', 'Due diligence on a young manager'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const alphaAn = pick(rng, [2.4, 3, 3.6, 4.8] as const);
    const s = randFloat(rng, 1.5, 3, 1);
    const n0 = pick(rng, [36, 48, 60] as const);

    const am = alphaAn / 12;
    const se0 = s / Math.sqrt(n0);
    const nDetect = Math.ceil((1.96 * s / am) ** 2);
    const lambda0 = statT(am, 0, s, n0);
    const puiss = normaleCdf(lambda0 - 1.96) * 100;
    const n80 = Math.ceil(((1.96 + 0.84) * s / am) ** 2);
    const repSe = r3(se0);
    const repPuiss = r2(puiss);
    const erreurII = r1(100 - puiss);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `a true alpha of ${pct(alphaAn, 1)} a year — ${pct(r2(am))} a month — against a monthly standard deviation of ${pct(s, 1)}; ${f(n0, 0)} months of live track record are on the table`
      : `un alpha réel de ${pct(alphaAn, 1)} par an — ${pct(r2(am))} par mois — contre un écart-type mensuel de ${pct(s, 1)} ; ${f(n0, 0)} mois de track record réel sont sur la table`;
    const contexte = (en
      ? [
        `Your desk wants to launch an in-house strategy supposed to deliver ${desc}. The committee will only fund what is provable: today's standard error, the history a t of 1.96 would require, the power of the test as it stands — and the duration-versus-missed-alpha trade-off, in writing.`,
        `You are A/B testing two execution algorithms; the edge to detect is equivalent to ${desc}. Before promising management an answer, you quantify what the available months can actually detect — and what it would take to conclude cleanly at 80% power.`,
        `In due diligence, a young manager claims ${desc}. Your memo must say whether this history CAN statistically prove anything, how many years a clean proof would need, and which type II error the committee implicitly accepts in the meantime.`,
      ]
      : [
        `Votre desk veut lancer une stratégie maison censée livrer ${desc}. Le comité ne financera que du prouvable : l'erreur standard aujourd'hui, l'historique qu'exigerait un t de 1,96, la puissance du test en l'état — et l'arbitrage durée contre alpha manqué, rédigé.`,
        `Vous menez un test A/B entre deux algorithmes d'exécution ; l'écart à détecter équivaut à ${desc}. Avant de promettre une réponse à la direction, vous chiffrez ce que les mois disponibles peuvent réellement détecter — et ce qu'exigerait une conclusion propre à 80 % de puissance.`,
        `En due diligence, un jeune gérant revendique ${desc}. Votre note doit dire si cet historique PEUT statistiquement prouver quoi que ce soit, combien d'années exigerait une preuve propre, et quelle erreur II le comité accepte implicitement en attendant.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The standard error today' : "a) L'erreur standard aujourd'hui",
          enonce: en
            ? `What is the standard error of the average monthly alpha estimated over the ${f(n0, 0)} available months, in points of %?`
            : `Quelle est l'erreur standard de l'alpha mensuel moyen estimé sur les ${f(n0, 0)} mois disponibles, en points de % ?`,
          reponse: repSe, tolerance: 0.02, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'σ over √n' : 'σ sur √n',
              contenu: en
                ? `$SE = s/\\sqrt{n}$ = ${f(s, 1)} / ${f(Math.sqrt(n0), 3)} = **${f(repSe, 3)} pt**.`
                : `$SE = s/\\sqrt{n}$ = ${f(s, 1)} / ${f(Math.sqrt(n0), 3)} = **${f(repSe, 3)} pt**.`,
            },
            {
              titre: en ? 'Compare signal and noise' : 'Comparer le signal au bruit',
              contenu: en
                ? `The monthly alpha to detect is ${pct(r2(am))} — ${am < se0 ? 'SMALLER than its own standard error' : `only ${f(r2(am / se0), 2)} times its standard error`}. The whole problem is there: a real alpha, drowned in noise that only √n erodes.`
                : `L'alpha mensuel à détecter vaut ${pct(r2(am))} — ${am < se0 ? 'plus PETIT que sa propre erreur standard' : `seulement ${f(r2(am / se0), 2)} fois son erreur standard`}. Tout le problème est là : un alpha réel, noyé dans un bruit que seul √n érode.`,
            },
          ],
          pieges: [en
            ? `Mixing time units — the ANNUAL alpha against a MONTHLY σ: here everything is monthly (${pct(r2(am))} against ${pct(s, 1)}).`
            : `Mélanger les unités de temps — l'alpha ANNUEL contre un σ MENSUEL : ici tout est mensuel (${pct(r2(am))} contre ${pct(s, 1)}).`],
        },
        {
          intitule: en ? 'b) The history needed to clear 1.96' : "b) L'historique pour franchir 1,96",
          enonce: en
            ? `If the alpha is genuinely real, how many months of history are needed for the t-statistic to reach 1.96?`
            : `Si l'alpha est bien réel, combien de mois d'historique faut-il pour que la statistique t atteigne 1,96 ?`,
          reponse: nDetect, tolerance: 1, toleranceMode: 'absolu',
          unite: en ? 'months' : 'mois',
          etapes: [
            {
              titre: en ? 'Invert the t' : 'Inverser le t',
              contenu: en
                ? `$t = \\frac{\\alpha_m}{s/\\sqrt{n}} \\geq 1.96 \\iff n \\geq (1.96\\,s/\\alpha_m)^2$ = (1.96 × ${f(s, 1)} / ${f(r2(am))})² = **${f(nDetect, 0)} months** (rounded up).`
                : `$t = \\frac{\\alpha_m}{s/\\sqrt{n}} \\geq 1.96 \\iff n \\geq (1.96\\,s/\\alpha_m)^2$ = (1,96 × ${f(s, 1)} / ${f(r2(am))})² = **${f(nDetect, 0)} mois** (arrondi au-dessus).`,
            },
            {
              titre: en ? 'In years' : 'En années',
              contenu: en
                ? `That is ${f(r1(nDetect / 12), 1)} YEARS of live track record — a horizon finance almost never grants. Hence the temptation of shortcuts (data snooping, cherry-picked windows) to "accelerate" the proof.`
                : `Soit ${f(r1(nDetect / 12), 1)} ANNÉES de track record réel — un horizon que la finance n'accorde presque jamais. D'où la tentation des raccourcis (data snooping, fenêtres choisies) pour « accélérer » la preuve.`,
            },
          ],
          pieges: [en
            ? `Forgetting the square: 1.96 s/α = ${f(r1(1.96 * s / am), 1)} "months" sounds feasible — but it is √n that must reach that level, so n takes the square.`
            : `Oublier le carré : 1,96 s/α = ${f(r1(1.96 * s / am), 1)} « mois » paraît faisable — mais c'est √n qui doit atteindre ce niveau, donc n prend le carré.`],
        },
        {
          intitule: en ? 'c) The power of the test as it stands' : "c) La puissance du test en l'état",
          enonce: en
            ? `With the ${f(n0, 0)} available months, what is the probability that the test detects the alpha (t > 1.96) if it is real, in %?`
            : `Avec les ${f(n0, 0)} mois disponibles, quelle est la probabilité que le test détecte l'alpha (t > 1,96) s'il est bien réel, en % ?`,
          reponse: repPuiss, tolerance: 0.5, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'Where t sits on average' : 'Où t se trouve en moyenne',
              contenu: en
                ? `Under the alternative (real alpha), t is centred on $\\lambda = \\frac{\\alpha_m}{s/\\sqrt{n_0}}$ = ${f(r2(am))} / ${f(repSe, 3)} = ${f(r2(lambda0))}.`
                : `Sous l'alternative (alpha réel), t est centré sur $\\lambda = \\frac{\\alpha_m}{s/\\sqrt{n_0}}$ = ${f(r2(am))} / ${f(repSe, 3)} = ${f(r2(lambda0))}.`,
            },
            {
              titre: en ? 'The power' : 'La puissance',
              contenu: en
                ? `Power ≈ $\\Phi(\\lambda - 1.96)$ = Φ(${f(r2(lambda0 - 1.96))}) = **${pct(repPuiss)}**. ${puiss < 50 ? 'The test MISSES the real alpha most of the time' : 'The test has decent odds, no more'}: the type II error stands at ${pct(erreurII, 1)}.`
                : `Puissance ≈ $\\Phi(\\lambda - 1.96)$ = Φ(${f(r2(lambda0 - 1.96))}) = **${pct(repPuiss)}**. ${puiss < 50 ? `Le test RATE l'alpha réel la plupart du temps` : 'Le test a des chances correctes, sans plus'} : l'erreur II se monte à ${pct(erreurII, 1)}.`,
            },
          ],
          pieges: [en
            ? `Confusing the 5% (type I error: a NULL alpha wrongly crowned) with the type II error (a REAL alpha missed): the two risks live on opposite sides of the hypothesis.`
            : `Confondre les 5 % (erreur I : un alpha NUL couronné à tort) avec l'erreur II (un alpha RÉEL raté) : les deux risques vivent de part et d'autre de l'hypothèse.`],
        },
        {
          intitule: en ? 'd) The duration / type II trade-off' : "d) L'arbitrage durée / erreur II",
          enonce: en
            ? `How many months are needed to lift the power to 80% (z₀.₈₀ = 0.84)?`
            : `Combien de mois faut-il pour porter la puissance à 80 % (z₀,₈₀ = 0,84) ?`,
          reponse: n80, tolerance: 1, toleranceMode: 'absolu',
          unite: en ? 'months' : 'mois',
          etapes: [
            {
              titre: en ? 'The sample-size formula' : "La formule de taille d'échantillon",
              contenu: en
                ? `$n = \\left(\\frac{(1.96 + 0.84)\\,s}{\\alpha_m}\\right)^2$ = (2.80 × ${f(s, 1)} / ${f(r2(am))})² = **${f(n80, 0)} months** (${f(r1(n80 / 12), 1)} years), against ${f(nDetect, 0)} months in b).`
                : `$n = \\left(\\frac{(1.96 + 0.84)\\,s}{\\alpha_m}\\right)^2$ = (2,80 × ${f(s, 1)} / ${f(r2(am))})² = **${f(n80, 0)} mois** (${f(r1(n80 / 12), 1)} ans), contre ${f(nDetect, 0)} mois au b).`,
            },
            {
              titre: en ? 'The trade-off, in writing' : "L'arbitrage, rédigé",
              contenu: en
                ? `Careful with b): at ${f(nDetect, 0)} months, t reaches 1.96 only ON AVERAGE — one chance in two of concluding, a 50% type II error. Today (${f(n0, 0)} months) it is ${pct(erreurII, 1)}. Deciding means choosing: launch early and risk funding noise (type I), or wait ${f(n80, 0)} months and risk the alpha dying — arbitraged away — before being proven. A serious committee writes that choice down; it does not discover it afterwards.`
                : `Attention au b) : à ${f(nDetect, 0)} mois, t n'atteint 1,96 qu'EN MOYENNE — une chance sur deux de conclure, soit 50 % d'erreur II. Aujourd'hui (${f(n0, 0)} mois), elle vaut ${pct(erreurII, 1)}. Trancher, c'est choisir : lancer tôt et risquer de financer du bruit (erreur I), ou attendre ${f(n80, 0)} mois et risquer que l'alpha meure — arbitré par d'autres — avant d'être prouvé. Un comité sérieux écrit ce choix noir sur blanc ; il ne le découvre pas après coup.`,
            },
          ],
          pieges: [en
            ? `Demanding 100% power: it requires an infinite sample — power is bought in ever more expensive slices, at the 1/√n rate.`
            : `Exiger 100 % de puissance : elle demanderait un échantillon infini — la puissance s'achète par tranches de plus en plus chères, au rythme de 1/√n.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 19. m2-pb-simpson — N4, boss 5                                      */
/* Effectifs contraints (multiples de 10, écart fixe de 10 pts) pour   */
/* garantir l'inversion de Simpson à chaque tirage.                    */
/* ------------------------------------------------------------------ */
const simpson: ProblemGenerator = {
  id: 'm2-pb-simpson', moduleId: M2,
  titre: 'Le paradoxe de Simpson',
  titreEn: "Simpson's paradox",
  typeDeCas: 'agrégation & paradoxe de Simpson',
  typeDeCasEn: "aggregation & Simpson's paradox",
  difficulte: 4,
  scenarios: ['Deux gérants sur deux régimes de marché', "Deux écoles sur deux voies d'admission", "Deux traitements à l'hôpital"],
  scenariosEn: ['Two managers across two market regimes', 'Two schools across two admission routes', 'Two treatments at the hospital'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const nA1 = pick(rng, [10, 20, 30] as const);
    const a1 = pick(rng, [80, 90] as const);
    const a2 = pick(rng, [40, 50] as const);

    const b1 = a1 - 10;
    const b2 = a2 - 10;
    const nA2 = 100 - nA1;
    const nB1 = nA2;
    const nB2 = nA1;
    const sA1 = (a1 * nA1) / 100;
    const sA2 = (a2 * nA2) / 100;
    const sB1 = (b1 * nB1) / 100;
    const sB2 = (b2 * nB2) / 100;
    const globA = sA1 + sA2; // sur 100, donc directement en %
    const globB = sB1 + sB2;
    const ecartGlob = globB - globA;

    const { en, f, pct } = outils(langue);
    const segHaut = (en ? ['the bull regime', 'the file-based route', 'the mild cases'] : ['le régime haussier', 'la voie sur dossier', 'les cas légers'])[sIdx];
    const segBas = (en ? ['the bear regime', 'the written exam', 'the severe cases'] : ['le régime baissier', 'le concours écrit', 'les cas sévères'])[sIdx];
    const actA = (en ? ['manager A', 'school A', 'treatment A'] : ['le gérant A', "l'école A", 'le traitement A'])[sIdx];
    const actB = (en ? ['manager B', 'school B', 'treatment B'] : ['le gérant B', "l'école B", 'le traitement B'])[sIdx];
    const unites = (en ? ['trades', 'applicants', 'patients'] : ['trades', 'candidats', 'patients'])[sIdx];
    const desc = en
      ? `In ${segHaut}, ${actA} won ${f(sA1, 0)} of ${f(nA1, 0)} ${unites} while ${actB} won ${f(sB1, 0)} of ${f(nB1, 0)}; in ${segBas}, A won ${f(sA2, 0)} of ${f(nA2, 0)} while B won ${f(sB2, 0)} of ${f(nB2, 0)} — each handled 100 ${unites} in total`
      : `Dans ${segHaut}, ${actA} a réussi ${f(sA1, 0)} de ses ${f(nA1, 0)} ${unites} quand ${actB} en a réussi ${f(sB1, 0)} sur ${f(nB1, 0)} ; dans ${segBas}, A en a réussi ${f(sA2, 0)} sur ${f(nA2, 0)} quand B en a réussi ${f(sB2, 0)} sur ${f(nB2, 0)} — chacun a traité 100 ${unites} au total`;
    const contexte = (en
      ? [
        `Year-end committee: two managers compete for the same envelope, and the data splits across two market regimes. ${desc}. The CIO wants the rates segment by segment, the overall rates — and an explanation when the ranking flips.`,
        `A families' association compares two schools across their two admission routes. ${desc}. The brochure of school B headlines its overall rate; your counter-analysis goes through the rates route by route — and ends on a ranking that flips.`,
        `A hospital board compares two treatments administered to mild and severe cases. ${desc}. The aggregate report favours one treatment, the case-by-case reading favours the other: the board wants every number, then a recommendation.`,
      ]
      : [
        `Comité de fin d'année : deux gérants se disputent la même enveloppe, et les données se répartissent sur deux régimes de marché. ${desc}. Le CIO veut les taux régime par régime, les taux globaux — et une explication quand le classement s'inverse.`,
        `Une association de familles compare deux écoles sur leurs deux voies d'admission. ${desc}. La plaquette de l'école B met son taux global en avant ; votre contre-analyse passe par les taux voie par voie — et débouche sur un classement qui bascule.`,
        `Le conseil d'un hôpital compare deux traitements administrés à des cas légers et sévères. ${desc}. Le rapport agrégé favorise un traitement, la lecture cas par cas favorise l'autre : le conseil veut tous les chiffres, puis une recommandation.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) A, segment by segment' : 'a) A, segment par segment',
          enonce: en
            ? `What is the success rate of ${actA} in ${segHaut}, in %?`
            : `Quel est le taux de réussite de ${actA} dans ${segHaut}, en % ?`,
          reponse: a1, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Two simple divisions' : 'Deux divisions simples',
            contenu: en
              ? `In ${segHaut}: ${f(sA1, 0)} / ${f(nA1, 0)} = **${pct(a1, 0)}**. In ${segBas}: ${f(sA2, 0)} / ${f(nA2, 0)} = **${pct(a2, 0)}** — the hard segment is hard for everyone.`
              : `Dans ${segHaut} : ${f(sA1, 0)} / ${f(nA1, 0)} = **${pct(a1, 0)}**. Dans ${segBas} : ${f(sA2, 0)} / ${f(nA2, 0)} = **${pct(a2, 0)}** — le segment difficile l'est pour tout le monde.`,
          }],
        },
        {
          intitule: en ? 'b) B, segment by segment' : 'b) B, segment par segment',
          enonce: en
            ? `Same question for ${actB} in ${segHaut}, in %.`
            : `Même question pour ${actB} dans ${segHaut}, en %.`,
          reponse: b1, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'Two more divisions' : 'Deux divisions encore',
              contenu: en
                ? `In ${segHaut}: ${f(sB1, 0)} / ${f(nB1, 0)} = **${pct(b1, 0)}**. In ${segBas}: ${f(sB2, 0)} / ${f(nB2, 0)} = **${pct(b2, 0)}**.`
                : `Dans ${segHaut} : ${f(sB1, 0)} / ${f(nB1, 0)} = **${pct(b1, 0)}**. Dans ${segBas} : ${f(sB2, 0)} / ${f(nB2, 0)} = **${pct(b2, 0)}**.`,
            },
            {
              titre: en ? 'First reading' : 'Première lecture',
              contenu: en
                ? `A beats B by 10 points in EACH segment (${pct(a1, 0)} vs ${pct(b1, 0)}, and ${pct(a2, 0)} vs ${pct(b2, 0)}). Segment by segment, the ranking admits no appeal.`
                : `A bat B de 10 points dans CHAQUE segment (${pct(a1, 0)} contre ${pct(b1, 0)}, et ${pct(a2, 0)} contre ${pct(b2, 0)}). Segment par segment, le classement est sans appel.`,
            },
          ],
        },
        {
          intitule: en ? 'c) The overall rate of A' : 'c) Le taux global de A',
          enonce: en
            ? `Across all 100 ${unites} of ${actA}, what is the overall success rate, in %?`
            : `Sur l'ensemble des 100 ${unites} de ${actA}, quel est le taux global de réussite, en % ?`,
          reponse: globA, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'A weighted average in disguise' : 'Une moyenne pondérée déguisée',
            contenu: en
              ? `(${f(sA1, 0)} + ${f(sA2, 0)}) / 100 = **${pct(globA, 0)}** — equivalently ${pct(a1, 0)} × ${f(nA1 / 100, 2)} + ${pct(a2, 0)} × ${f(nA2 / 100, 2)}: the overall rate weights each segment rate by ITS share of the workload.`
              : `(${f(sA1, 0)} + ${f(sA2, 0)}) / 100 = **${pct(globA, 0)}** — soit ${pct(a1, 0)} × ${f(nA1 / 100, 2)} + ${pct(a2, 0)} × ${f(nA2 / 100, 2)} : le taux global pondère chaque taux de segment par SA part du volume.`,
          }],
        },
        {
          intitule: en ? 'd) The overall rate of B — and the paradox' : 'd) Le taux global de B — et le paradoxe',
          enonce: en
            ? `Same question for ${actB}, in %.`
            : `Même question pour ${actB}, en %.`,
          reponse: globB, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'The flipped ranking' : 'Le classement renversé',
              contenu: en
                ? `(${f(sB1, 0)} + ${f(sB2, 0)}) / 100 = **${pct(globB, 0)}**: B now leads A by ${f(ecartGlob, 0)} points overall, while A wins EVERY segment.`
                : `(${f(sB1, 0)} + ${f(sB2, 0)}) / 100 = **${pct(globB, 0)}** : B devance désormais A de ${f(ecartGlob, 0)} points au global, alors que A gagne dans CHAQUE segment.`,
            },
            {
              titre: en ? 'No arithmetic error anywhere' : "Aucune erreur de calcul nulle part",
              contenu: en
                ? `Every number is correct: this is Simpson's paradox. Aggregates mix two different things — skill within a segment and EXPOSURE to segments — and the mix can overturn the ranking.`
                : `Tous les chiffres sont justes : c'est le paradoxe de Simpson. L'agrégat mélange deux choses distinctes — la compétence à l'intérieur d'un segment et l'EXPOSITION aux segments — et le mélange peut renverser le classement.`,
            },
          ],
          pieges: [en
            ? `Hunting for the computation mistake: there is none — it is the weighting that rigs the average, not the arithmetic.`
            : `Chercher l'erreur de calcul : il n'y en a pas — c'est la pondération qui truque la moyenne, pas l'arithmétique.`],
        },
        {
          intitule: en ? 'e) The key: the weights — and the choice' : 'e) La clé : les pondérations — et le choix',
          enonce: en
            ? `What share of its 100 ${unites} did ${actA} take in ${segBas} (the hard segment), in %?`
            : `Quelle part de ses 100 ${unites} ${actA} a-t-il prise dans ${segBas} (le segment difficile), en % ?`,
          reponse: nA2, tolerance: 0.5, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'Opposite mixes' : 'Des mix opposés',
              contenu: en
                ? `A took **${pct(nA2, 0)}** of its volume in ${segBas}, against only ${pct(nB2, 0)} for B. So A drags its ${pct(a2, 0)} across ${f(nA2, 0)} hard ${unites}, while B parades its ${pct(b1, 0)} across ${f(nB1, 0)} easy ones — that mix, and nothing else, flips the aggregate.`
                : `A a pris **${pct(nA2, 0)}** de son volume dans ${segBas}, contre seulement ${pct(nB2, 0)} pour B. A traîne donc son ${pct(a2, 0)} sur ${f(nA2, 0)} ${unites} difficiles, pendant que B exhibe son ${pct(b1, 0)} sur ${f(nB1, 0)} faciles — ce mix, et rien d'autre, renverse l'agrégat.`,
            },
            {
              titre: en ? 'Who to pick, and why' : 'Qui choisir, et pourquoi',
              contenu: en
                ? `On comparable ground, A is better everywhere: pick A whenever the segments are imposed from outside (market regimes, case severity). The aggregate only regains meaning if CHOOSING the ground is part of the skill (discretionary allocation). The right question is never "what overall rate?" but "who wins at equal conditions?" — and any league table that ignores the mix deserves the same suspicion.`
                : `À terrain comparable, A est meilleur partout : on choisit A dès que les segments s'imposent de l'extérieur (régimes de marché, sévérité des cas). L'agrégat ne retrouve un sens que si le CHOIX du terrain fait partie du talent (allocation discrétionnaire). La bonne question n'est jamais « quel taux global ? » mais « qui gagne à conditions égales ? » — et tout palmarès qui ignore le mix mérite la même méfiance.`,
            },
          ],
          pieges: [en
            ? `Trusting any aggregate ranking without asking what each contender was exposed to: the overall rate of B measures its comfort, not its skill.`
            : `Faire confiance à un palmarès agrégé sans demander à quoi chacun était exposé : le taux global de B mesure son confort, pas son talent.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 20. m2-pb-regression-piegee — N4, boss 6                            */
/* Quatre points de base à bruit orthogonal aux x (pente de base       */
/* contrôlée ≈ mBase, R² de base écrasé) + un point levier contrôlé.   */
/* ------------------------------------------------------------------ */
const regressionPiegee: ProblemGenerator = {
  id: 'm2-pb-regression-piegee', moduleId: M2,
  titre: 'La régression détournée par un point',
  titreEn: 'A regression hijacked by one point',
  typeDeCas: 'régression & point aberrant',
  typeDeCasEn: 'regression & outliers',
  difficulte: 4,
  scenarios: ["Backtest d'un signal sur cinq mois", 'Analyste pressé devant son nuage de points', "Revue des risques d'un modèle maison"],
  scenariosEn: ['Backtesting a signal over five months', 'Hurried analyst over a scatter plot', 'Risk review of an in-house model'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const e = randFloat(rng, 0.2, 0.5, 2);
    const mBase = randFloat(rng, -0.05, 0.05, 2);
    const penteFake = randFloat(rng, 0.7, 0.95, 2);
    const x5 = pick(rng, [8, 9] as const);

    const xsB = [-3, -1, 1, 3];
    const epsSeq = [e, -e, -e, e];
    const ysB = xsB.map((x, i) => r2(mBase * x + epsSeq[i]));
    const y5 = r2(penteFake * x5);
    const xs = [...xsB, x5];
    const ys = [...ysB, y5];

    const penteAvec = penteRegression(xs, ys);
    const ordAvec = ordonneeRegression(xs, ys);
    const r2Avec = r2Regression(xs, ys);
    const penteSans = penteRegression(xsB, ysB);
    const ordSans = ordonneeRegression(xsB, ysB);
    const r2Sans = r2Regression(xsB, ysB);
    const repPenteAvec = r2(penteAvec);
    const repPenteSans = r3(penteSans);
    const repR2Avec = r3(r2Avec);
    const repR2Sans = r3(r2Sans);

    const { en, f, pct } = outils(langue);
    const paires = xs.map((x, i) => (en ? `(${f(x, 1)}%; ${f(ys[i], 2)}%)` : `(${f(x, 1)} % ; ${f(ys[i], 2)} %)`)).join(', ');
    const desc = en
      ? `five (signal; next-month return) pairs: ${paires} — the last one born of a single exceptional month`
      : `cinq paires (signal ; rendement du mois suivant) : ${paires} — la dernière issue d'un unique mois exceptionnel`;
    const contexte = (en
      ? [
        `You backtest a trading signal on the only history available, ${desc}. The fitted line looks glorious; your job is to say whether the signal holds — with the outlier, without it, and with both R² on the table.`,
        `A hurried analyst bursts in with a scatter plot and a triumphant slope, built from ${desc}. Before the idea reaches the morning meeting, you redo the regression — then redo it without the star point that carries the whole story.`,
        `In risk review, you audit an in-house model whose calibration rests on ${desc}. The committee wants the two slopes, the two R², and a written verdict on a model that one single observation can make or unmake.`,
      ]
      : [
        `Vous backtestez un signal de trading sur le seul historique disponible, ${desc}. La droite ajustée a fière allure ; à vous de dire si le signal tient — avec le point extrême, sans lui, et les deux R² sur la table.`,
        `Un analyste pressé débarque avec un nuage de points et une pente triomphante, construite sur ${desc}. Avant que l'idée n'atteigne le morning meeting, vous refaites la régression — puis la refaites sans le point vedette qui porte toute l'histoire.`,
        `En revue des risques, vous auditez un modèle maison dont la calibration repose sur ${desc}. Le comité veut les deux pentes, les deux R², et un verdict écrit sur un modèle qu'une seule observation peut faire ou défaire.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The slope with the extreme point' : 'a) La pente avec le point extrême',
          enonce: en
            ? `Estimate the slope of the regression on the 5 points.`
            : `Estimez la pente de la régression sur les 5 points.`,
          reponse: repPenteAvec, tolerance: 0.02, toleranceMode: 'absolu',
          etapes: [
            {
              titre: en ? 'Covariance over variance' : 'Covariance sur variance',
              contenu: en
                ? `cov(x, y) = ${f(r3(covarianceEchantillon(xs, ys)), 3)} and var(x) = ${f(r3(varianceEchantillon(xs)), 3)}, hence $\\hat{\\beta}$ = **${f(repPenteAvec)}**.`
                : `cov(x, y) = ${f(r3(covarianceEchantillon(xs, ys)), 3)} et var(x) = ${f(r3(varianceEchantillon(xs)), 3)}, d'où $\\hat{\\beta}$ = **${f(repPenteAvec)}**.`,
            },
            {
              titre: en ? 'The line on the slide' : 'La droite du slide',
              contenu: en
                ? `Fitted line: $\\hat{y}$ = ${f(r2(ordAvec))} + ${f(repPenteAvec)} x. On the chart, the backtest "shows" a powerful signal — the whole question is what holds it up.`
                : `Droite ajustée : $\\hat{y}$ = ${f(r2(ordAvec))} + ${f(repPenteAvec)} x. Sur le graphique, le backtest « montre » un signal puissant — toute la question est de savoir ce qui le porte.`,
            },
          ],
        },
        {
          intitule: en ? 'b) The slope without it' : 'b) La pente sans lui',
          enonce: en
            ? `Remove the last point (${f(x5, 1)}%; ${f(y5, 2)}%) and recompute the slope on the 4 remaining points.`
            : `Retirez le dernier point (${f(x5, 1)} % ; ${f(y5, 2)} %) et recalculez la pente sur les 4 points restants.`,
          reponse: repPenteSans, tolerance: 0.02, toleranceMode: 'absolu',
          etapes: [
            {
              titre: en ? 'Same machinery, four points' : 'Même mécanique, quatre points',
              contenu: en
                ? `cov(x, y) = ${f(r3(covarianceEchantillon(xsB, ysB)), 3)} and var(x) = ${f(r3(varianceEchantillon(xsB)), 3)}, hence $\\hat{\\beta}$ = **${f(repPenteSans, 3)}** — next to nothing.`
                : `cov(x, y) = ${f(r3(covarianceEchantillon(xsB, ysB)), 3)} et var(x) = ${f(r3(varianceEchantillon(xsB)), 3)}, d'où $\\hat{\\beta}$ = **${f(repPenteSans, 3)}** — presque rien.`,
            },
            {
              titre: en ? 'One line, two worlds' : 'Une droite, deux mondes',
              contenu: en
                ? `With the point: $\\hat{y}$ = ${f(r2(ordAvec))} + ${f(repPenteAvec)} x. Without it: $\\hat{y}$ = ${f(r2(ordSans))} + ${f(repPenteSans, 3)} x. The four ordinary months tell a flat story; the fifth writes the headline alone.`
                : `Avec le point : $\\hat{y}$ = ${f(r2(ordAvec))} + ${f(repPenteAvec)} x. Sans lui : $\\hat{y}$ = ${f(r2(ordSans))} + ${f(repPenteSans, 3)} x. Les quatre mois ordinaires racontent une histoire plate ; le cinquième écrit le titre à lui seul.`,
            },
          ],
          pieges: [en
            ? `Deleting the point without saying so is the symmetric sin: the honest analysis SHOWS both slopes and lets the committee see what one month does.`
            : `Supprimer le point sans le dire est le péché symétrique : l'analyse honnête MONTRE les deux pentes et laisse le comité voir ce qu'un seul mois fabrique.`],
        },
        {
          intitule: en ? 'c) The R² with the point' : 'c) Le R² avec le point',
          enonce: en
            ? `What is the R² of the 5-point regression? (decimal)`
            : `Quel est le R² de la régression à 5 points ? (en décimal)`,
          reponse: repR2Avec, tolerance: 0.02, toleranceMode: 'absolu',
          etapes: [{
            titre: en ? 'Correlation squared' : 'La corrélation au carré',
            contenu: en
              ? `r = ${f(r3(correlation(xs, ys)), 3)}, hence $R^2$ = **${f(repR2Avec, 3)}**: ${pct(r1(r2Avec * 100), 0)} of the variance "explained" — a number that would adorn any pitch book.`
              : `r = ${f(r3(correlation(xs, ys)), 3)}, d'où $R^2$ = **${f(repR2Avec, 3)}** : ${pct(r1(r2Avec * 100), 0)} de variance « expliquée » — un chiffre qui décorerait n'importe quel argumentaire.`,
          }],
        },
        {
          intitule: en ? 'd) The R² without it — the verdict' : 'd) Le R² sans lui — le verdict',
          enonce: en
            ? `What does the R² become on the 4 remaining points? (decimal)`
            : `Que devient le R² sur les 4 points restants ? (en décimal)`,
          reponse: repR2Sans, tolerance: 0.02, toleranceMode: 'absolu',
          etapes: [
            {
              titre: en ? 'The collapse' : "L'effondrement",
              contenu: en
                ? `On the four ordinary months, $R^2$ = **${f(repR2Sans, 3)}**: the signal explains almost nothing of normal life.`
                : `Sur les quatre mois ordinaires, $R^2$ = **${f(repR2Sans, 3)}** : le signal n'explique presque rien de la vie normale.`,
            },
            {
              titre: en ? 'The verdict' : 'Le verdict',
              contenu: en
                ? `The signal does NOT hold: slope from ${f(repPenteAvec)} to ${f(repPenteSans, 3)} and R² from ${f(repR2Avec, 3)} to ${f(repR2Sans, 3)} the moment ONE point leaves. A result that depends on a single observation is not a result — it is an anecdote with a line drawn through it.`
                : `Le signal ne tient PAS : pente de ${f(repPenteAvec)} à ${f(repPenteSans, 3)} et R² de ${f(repR2Avec, 3)} à ${f(repR2Sans, 3)} dès qu'UN point s'en va. Un résultat qui dépend d'une seule observation n'est pas un résultat — c'est une anecdote avec une droite dessinée dessus.`,
            },
          ],
          pieges: [en
            ? `Reading the big R² of c) as robustness: R² measures fit, not stability — a single leverage point can buy both the slope and the R².`
            : `Lire le gros R² du c) comme de la robustesse : le R² mesure l'ajustement, pas la stabilité — un seul point levier peut acheter la pente ET le R².`],
        },
        {
          intitule: en ? 'e) The lesson' : 'e) La leçon',
          enonce: en
            ? `That single point weighs what percentage of the sample, in %?`
            : `Ce point unique pèse quel pourcentage de l'échantillon, en % ?`,
          reponse: 20, tolerance: 0.5, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'One in five' : 'Un sur cinq',
              contenu: en
                ? `1 point out of 5 = **20%** of the sample — but with its leverage in $(x - \\bar{x})^2$, it commands the slope almost alone: a point's influence grows with the SQUARE of its distance in x, not with its head count.`
                : `1 point sur 5 = **20 %** de l'échantillon — mais avec son levier en $(x - \\bar{x})^2$, il commande la pente presque à lui seul : l'influence d'un point croît avec le CARRÉ de son éloignement en x, pas avec son poids démographique.`,
            },
            {
              titre: en ? 'The reflexes' : 'Les réflexes',
              contenu: en
                ? `Plot the cloud BEFORE regressing; recompute without the extreme point; if the conclusion flips, the cure is more data, not more conviction — five months prove nothing (see the standard-error mould), and a "signal" found this way is data snooping's favourite child.`
                : `Tracer le nuage AVANT de régresser ; recalculer sans le point extrême ; si la conclusion bascule, le remède est plus de données, pas plus de conviction — cinq mois ne prouvent rien (voir le moule sur l'erreur standard), et un « signal » trouvé ainsi est l'enfant chéri du data snooping.`,
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
  monteCarloConvergence,
  esperanceJeu,
  lognormalePrix,
  diversificationLimite,
  brainteaserSequentiel,
  dataSnooping,
  bayesDoubleTest,
  tailleEchantillonPuissance,
  simpson,
  regressionPiegee,
];
