/**
 * Moules de problèmes multi-étapes du module Crédit — LOT 1 : les 10 moules
 * N1/N2 (m5-pb-01 à m5-pb-10). 4 N1 (lire un spread, l'analyste et la note,
 * le premier CDS, la tranche simple) et 6 N2 (pricer le corporate,
 * l'écartement de crise, le gérant high yield, l'enchère de règlement,
 * la base négative, le portefeuille titrisé).
 * Chaque moule : 3 scénarios FR + EN (habillages ET bornes de tirage
 * différents), sous-questions chaînées (la sortie de a) nourrit b), c)…),
 * corrigés calculés via calculs.ts — jamais de texte figé.
 * INVARIANT BILINGUE : tous les tirages aléatoires ont lieu AVANT toute branche
 * de langue — même seed + même scénario ⇒ mêmes nombres en français et en anglais.
 * Conventions (en-tête de calculs.ts) : les spreads se passent et se rendent en
 * POINTS DE BASE ; R est un % du NOMINAL (LGD = 100 − R) ; PD annuelles en %,
 * survie composée discrète (1 − PD)^n ; notionnels CDS en MILLIONS, prime
 * annuelle en EUROS, paiement contingent en MILLIONS ; tranches par points
 * d'attache/détachement en % du pool, perte de tranche en % de SON notionnel,
 * bornée à [0, 100]. Les chaînages s'appuient sur les valeurs ARRONDIES (r2)
 * des sous-questions précédentes, pour que le corrigé affiché soit recomposable
 * à la calculatrice. Les ancres des habillages (IG 80-150 pb, HY 300-500 pb,
 * iTraxx Main ~50-80, Crossover ~250-400, Lehman R = 8,625 %, la mezzanine 3-6
 * aux deux tiers détruite à L = 5 %) sont celles des chapitres 1 à 7 du module.
 */
import { formatNombreLangue } from '../../../engine/answers';
import { mulberry32, randFloat, randInt } from '../../../engine/rng';
import type { Langue, ProblemGenerator } from '../../../engine/types';
import {
  baseCdsPb, paiementDefautCdsMillions, pdImplicitePct, perteAttenduePct,
  perteTranchePct, primeCdsAnnuelleEur, prixObligationRisquee,
  probaDefautCumuleePct, probaSurvieCumuleePct, spreadCreditPb,
  variationPrixSpreadPct,
} from './calculs';

/** Un « moule » de problème est un ProblemGenerator de l'engine (alias local). */
export type ProblemeMoule = ProblemGenerator;

const M5 = '05-credit';
const r2 = (v: number) => Math.round(v * 100) / 100;

/** Petits formateurs liés à la langue (les tirages sont déjà faits quand on les crée). */
function outils(langue: Langue) {
  const en = langue === 'en';
  const f = (v: number, d = 2) => formatNombreLangue(langue, v, d);
  const pct = (v: number, d = 2) => (en ? `${f(v, d)}%` : `${f(v, d)} %`);
  /** Points de base : « 200 pb » / "200 bp". */
  const pb = (v: number, d = 0) => (en ? `${f(v, d)} bp` : `${f(v, d)} pb`);
  /** Euros pleins : « 200 000 € » / "€200,000". */
  const eur = (v: number, d = 0) => (en ? `€${f(v, d)}` : `${f(v, d)} €`);
  /** Millions d'euros : « 6 M€ » / "€6m". */
  const mEur = (v: number, d = 2) => (en ? `€${f(v, d)}m` : `${f(v, d)} M€`);
  return { en, f, pct, pb, eur, mEur };
}

/* ------------------------------------------------------------------ */
/* 1. m5-pb-01 — Lire un spread — N1                                   */
/* ------------------------------------------------------------------ */
const lireUnSpread: ProblemeMoule = {
  id: 'm5-pb-01', moduleId: M5,
  titre: 'Lire un spread : du rendement affiché au doute chiffré',
  titreEn: 'Reading a spread: from quoted yield to priced doubt',
  typeDeCas: 'lecture de marché',
  typeDeCasEn: 'market reading',
  difficulte: 1,
  scenarios: ["L'écran du matin : une corporate IG euro face à sa référence d'État", 'Le nom high yield : un BB qui paie pour son doute', "L'ange déchu : rétrogradé la semaine dernière, repricé ce matin"],
  scenariosEn: ['The morning screen: a euro IG corporate against its government benchmark', 'The high yield name: a BB that pays for its doubt', 'The fallen angel: downgraded last week, repriced this morning'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : spread, recouvrement, PD historique de la note.
    const cfg = ([
      { sMin: 90, sMax: 150, recMin: 38, recMax: 45, pdhMin: 0.5, pdhMax: 0.9 },
      { sMin: 300, sMax: 500, recMin: 30, recMax: 42, pdhMin: 1.5, pdhMax: 3.5 },
      { sMin: 180, sMax: 350, recMin: 35, recMax: 48, pdhMin: 0.8, pdhMax: 2 },
    ] as const)[sIdx];
    const rf = randFloat(rng, 2, 3.5, 1);
    const sTire = randInt(rng, cfg.sMin, cfg.sMax);
    const rec = randInt(rng, cfg.recMin, cfg.recMax);
    const pdHist = randFloat(rng, cfg.pdhMin, cfg.pdhMax, 1);
    const mat = randInt(rng, 3, 7);
    const yRisque = r2(rf + sTire / 100);
    const spread = r2(spreadCreditPb(yRisque, rf));
    const pdImpl = r2(pdImplicitePct(spread, rec));
    const elHist = r2(perteAttenduePct(pdHist, rec));
    // Chaîné sur l'EL arrondie du c) pour un corrigé recomposable à la calculatrice.
    const spreadAct = r2(elHist * 100);
    const prime = r2(spread - spreadAct);

    const { en, f, pct, pb } = outils(langue);
    const desc = en
      ? `the ${f(mat, 0)}-year corporate bond yields ${pct(yRisque)}, the government bond of the same maturity ${pct(rf, 1)}; desk convention for senior unsecured recovery: ${pct(rec, 0)}; historical default frequency of the rating: about ${pct(pdHist, 1)} per year`
      : `l'obligation corporate à ${f(mat, 0)} ans rend ${pct(yRisque)}, l'emprunt d'État de même maturité ${pct(rf, 1)} ; convention de recouvrement senior unsecured du desk : ${pct(rec, 0)} ; fréquence de défaut historique de la note : environ ${pct(pdHist, 1)} par an`;
    const contexte = (en
      ? [
        `First morning on the credit desk. The senior swivels his screen towards you: ${desc}. "Before you tell me anything about the name, tell me what the market says about it." Your worksheet: the spread, the PD the market is pricing, the actual expected loss, and what the rest of the spread pays for.`,
        `The salesman on the line is pushing BB paper — high yield, the assumed doubt: ${desc}. Before answering him, calibrate the name against the chapter's landmarks (IG 80-150 bp, HY 300-500 bp, distressed above 1,000): spread, implied PD, expected loss, risk premium.`,
        `Downgraded to BB+ on Tuesday, expelled from the IG indices, dumped by every "IG only" mandate: the fallen angel reprices this morning, and forced sellers rarely sell at fair value. The screen: ${desc}. Run the full reading — the desk wants to know what is default and what is premium.`,
      ]
      : [
        `Premier matin sur le desk crédit. Le senior fait pivoter son écran vers vous : ${desc}. « Avant de me parler du nom, dites-moi ce que le marché en dit. » Votre feuille : le spread, la PD que le marché price, la perte attendue réelle, et ce que paie le reste du spread.`,
        `Le vendeur au téléphone pousse du papier BB — le high yield, le doute assumé : ${desc}. Avant de lui répondre, étalonnez le nom contre les repères du chapitre (IG 80-150 pb, HY 300-500 pb, distressed au-delà de 1 000) : spread, PD implicite, perte attendue, prime de risque.`,
        `Rétrogradé BB+ mardi, expulsé des indices IG, vendu par tous les mandats « IG only » : l'ange déchu se reprice ce matin, et les vendeurs forcés vendent rarement au juste prix. L'écran : ${desc}. Faites la lecture complète — le desk veut savoir ce qui est du défaut et ce qui est de la prime.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The thermometer: the spread' : 'a) Le thermomètre : le spread',
          enonce: en
            ? `The bond yields ${pct(yRisque)}, the risk-free benchmark ${pct(rf, 1)}. What is the credit spread, in bp?`
            : `L'obligation rend ${pct(yRisque)}, la référence sans risque ${pct(rf, 1)}. Quel est le spread de crédit, en pb ?`,
          reponse: spread, tolerance: 0.005, unite: en ? 'bp' : 'pb',
          etapes: [{
            titre: en ? 'Spread = (risky yield − risk-free) × 100' : 'Spread = (rendement risqué − sans risque) × 100',
            contenu: en
              ? `(${f(yRisque)} − ${f(rf, 1)}) × 100 = **${pb(spread)}** — the price of the promise, quoted continuously. Calibrate it against the chapter's scale: euro IG corporate 80-150 bp in calm times, high yield 300-500 bp, distressed above 1,000 bp (the market is no longer pricing a yield but a recovery); on CDS indices, iTraxx Main ~50-80 bp, Crossover ~250-400 bp. Knowing how to read 60 bp is how you understand what 600 means.`
              : `(${f(yRisque)} − ${f(rf, 1)}) × 100 = **${pb(spread)}** — le prix de la promesse, affiché en continu. Étalonnez-le contre l'échelle du chapitre : corporate IG euro 80-150 pb en temps calme, high yield 300-500 pb, distressed au-delà de 1 000 pb (le marché ne price plus un rendement mais un recouvrement) ; sur les indices de CDS, iTraxx Main ~50-80 pb, Crossover ~250-400 pb. C'est en sachant lire 60 pb qu'on comprend ce que 600 signifie.`,
          }],
          pieges: [en
            ? `Answering ${f(r2(yRisque - rf))}: that is percentage POINTS. The credit desk quotes in BASIS points — multiply by 100. Mixing the two units is the fastest way to be wrong by a factor of one hundred.`
            : `Répondre ${f(r2(yRisque - rf))} : ce sont des points de POURCENTAGE. Le desk crédit cote en points de BASE — multipliez par 100. Confondre les deux unités est la façon la plus rapide de se tromper d'un facteur cent.`],
        },
        {
          intitule: en ? 'b) The inverse reading: the implied PD' : 'b) La lecture inverse : la PD implicite',
          enonce: en
            ? `With the ${pct(rec, 0)} recovery convention, what annual default probability is the market pricing into the spread of a), in %?`
            : `Avec la convention de recouvrement de ${pct(rec, 0)}, quelle probabilité de défaut annuelle le marché price-t-il dans le spread du a), en % ?`,
          reponse: pdImpl, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'PD = (spread/100)/(1 − R/100): dividing by the LGD' : 'PD = (spread/100)/(1 − R/100) : on divise par la LGD',
            contenu: en
              ? `(${f(spread, 0)}/100)/(1 − ${f(rec, 0)}/100) = **${pct(pdImpl)}** per year — the reference example: 300 bp with R = 40% prices 5%/yr. This is a RISK-NEUTRAL PD: it systematically overstates the historical default frequency, precisely because the spread contains a risk premium and a liquidity premium on top of the average default. It answers "what is the market pricing?", never "what will happen?".`
              : `(${f(spread, 0)}/100)/(1 − ${f(rec, 0)}/100) = **${pct(pdImpl)}** par an — l'exemple de référence : 300 pb avec R = 40 % pricent 5 %/an. C'est une PD RISQUE-NEUTRE : elle surestime systématiquement la fréquence historique des défauts, précisément parce que le spread contient une prime de risque et une prime de liquidité au-dessus du défaut moyen. Elle répond à « que price le marché ? », jamais à « que va-t-il se passer ? ».`,
          }],
          pieges: [en
            ? `Stopping at spread/100 = ${pct(r2(spread / 100))}: that assumes you lose EVERYTHING at default. With ${pct(rec, 0)} recovered, only the LGD of ${pct(r2(100 - rec), 0)} is lost — the PD must be grossed up by dividing by (1 − R).`
            : `S'arrêter à spread/100 = ${pct(r2(spread / 100))} : c'est supposer qu'on perd TOUT au défaut. Avec ${pct(rec, 0)} récupérés, on ne perd que la LGD de ${pct(r2(100 - rec), 0)} — la PD doit être regonflée en divisant par (1 − R).`],
        },
        {
          intitule: en ? 'c) The reality: the historical expected loss' : 'c) La réalité : la perte attendue historique',
          enonce: en
            ? `The HISTORICAL default frequency of the rating is about ${pct(pdHist, 1)} per year. With R = ${pct(rec, 0)}, what is the annual expected loss, in % of nominal?`
            : `La fréquence de défaut HISTORIQUE de la note est d'environ ${pct(pdHist, 1)} par an. Avec R = ${pct(rec, 0)}, quelle est la perte attendue annuelle, en % du nominal ?`,
          reponse: elHist, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'EL = PD × LGD: the module in three letters' : 'EL = PD × LGD : le module en trois lettres',
            contenu: en
              ? `${f(pdHist, 1)} × (1 − ${f(rec, 0)}/100) = **${pct(elHist)}** of nominal per year — the central formula (PD 2%, R 40% ⇒ EL 1.2%). Remember it is an EXPECTATION: the actual year delivers 0 or −${f(r2(100 - rec), 0)}, never −${f(elHist)} — which is exactly why observed spreads sit ABOVE the expected loss.`
              : `${f(pdHist, 1)} × (1 − ${f(rec, 0)}/100) = **${pct(elHist)}** du nominal par an — la formule centrale (PD 2 %, R 40 % ⇒ EL 1,2 %). Souvenez-vous que c'est une ESPÉRANCE : l'année réelle donne 0 ou −${f(r2(100 - rec), 0)}, jamais −${f(elHist)} — et c'est exactement pourquoi les spreads observés vivent AU-DESSUS de la perte attendue.`,
          }],
          pieges: [en
            ? `Using the implied PD of b) (${pct(pdImpl)}) here: that is circular — by construction it gives back the spread. The expected loss is computed on the HISTORICAL frequency; the gap between the two is the whole point of question d).`
            : `Utiliser ici la PD implicite du b) (${pct(pdImpl)}) : c'est circulaire — par construction elle redonne le spread. La perte attendue se calcule sur la fréquence HISTORIQUE ; l'écart entre les deux est tout l'objet de la question d).`],
        },
        {
          intitule: en ? 'd) The bill: the risk premium in the spread' : "d) La facture : la prime de risque dans le spread",
          enonce: en
            ? `Convert the expected loss of c) into an actuarial spread, and deduce how many bp of the market spread of a) do NOT pay for the average default, in bp.`
            : `Convertissez la perte attendue du c) en spread actuariel, et déduisez combien de pb du spread de marché du a) ne rémunèrent PAS le défaut moyen, en pb.`,
          reponse: prime, tolerance: 0.005, unite: en ? 'bp' : 'pb',
          etapes: [
            {
              titre: en ? 'Premium = market spread − actuarial spread' : 'Prime = spread de marché − spread actuariel',
              contenu: en
                ? `Actuarial spread = ${f(elHist)} × 100 = ${pb(spreadAct)}; premium = ${f(spread, 0)} − ${f(spreadAct)} = **${pb(prime)}**. The market pays ${f(r2(spread / spreadAct), 1)} times the average default — the credit spread puzzle: a BBB with ~0.3%/yr historical PD carries an 18 bp expected loss yet trades at 120-150 bp.`
                : `Spread actuariel = ${f(elHist)} × 100 = ${pb(spreadAct)} ; prime = ${f(spread, 0)} − ${f(spreadAct)} = **${pb(prime)}**. Le marché paie ${f(r2(spread / spreadAct), 1)} fois le défaut moyen — le credit spread puzzle : une BBB à ~0,3 %/an de PD historique porte 18 pb de perte attendue et traite pourtant à 120-150 pb.`,
            },
            {
              titre: en ? 'What those bp actually buy' : 'Ce que ces pb achètent vraiment',
              contenu: en
                ? `Two things, itemised in chapter 1. The risk premium: defaults arrive in CLUSTERS, in recessions, exactly when the rest of the portfolio bleeds — carrying credit is selling insurance against the bad state of the world, and that insurance trades above its actuarial value. And the liquidity premium: corporate paper resells badly — wide bid-offers, days without a trade — roughly half of the IG spread by transaction-data studies. The premium is not a market error: it is the invoice, line by line.`
                : `Deux choses, détaillées au chapitre 1. La prime de risque : les défauts arrivent en GRAPPES, dans les récessions, exactement quand le reste du portefeuille saigne — porter du crédit, c'est vendre de l'assurance contre le mauvais état du monde, et cette assurance se paie au-dessus de sa valeur actuarielle. Et la prime de liquidité : le papier corporate se revend mal — fourchettes larges, des jours sans échange — environ la moitié du spread IG selon les études sur données de transactions. La prime n'est pas une erreur de marché : c'est la facture, ligne à ligne.`,
            },
          ],
          pieges: [en
            ? `Believing spread = expected loss ("the market prices the default, full stop"): the observed spread is SYSTEMATICALLY above EL — here by ${pb(prime)}. Selling protection at the actuarial spread is working for free in the bad state of the world.`
            : `Croire que spread = perte attendue (« le marché price le défaut, point ») : le spread observé est SYSTÉMATIQUEMENT au-dessus de l'EL — ici de ${pb(prime)}. Vendre de la protection au spread actuariel, c'est travailler gratuitement dans le mauvais état du monde.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 2. m5-pb-02 — L'analyste et la note — N1                            */
/* ------------------------------------------------------------------ */
const analysteNote: ProblemeMoule = {
  id: 'm5-pb-02', moduleId: M5,
  titre: "L'analyste et la note : de la lettre à la probabilité",
  titreEn: 'The analyst and the rating: from letter to probability',
  typeDeCas: 'notation',
  typeDeCasEn: 'rating',
  difficulte: 1,
  scenarios: ['Le dossier BB : le premier étage du high yield', 'Le dossier B : la signature qui vit du cycle', "L'ange déchu : BB+ depuis mardi, et un comité qui veut des chiffres"],
  scenariosEn: ['The BB file: the first floor of high yield', 'The B file: the signature that lives off the cycle', 'The fallen angel: BB+ since Tuesday, and a committee that wants numbers'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : PD annuelle de la note, horizon, recouvrement.
    const cfg = ([
      { pdMin: 1.2, pdMax: 3, nMin: 5, nMax: 5, recMin: 32, recMax: 45, note: 'BB' },
      { pdMin: 4, pdMax: 6.5, nMin: 4, nMax: 6, recMin: 30, recMax: 42, note: 'B' },
      { pdMin: 0.8, pdMax: 1.6, nMin: 5, nMax: 7, recMin: 35, recMax: 45, note: 'BB+' },
    ] as const)[sIdx];
    const pd = randFloat(rng, cfg.pdMin, cfg.pdMax, 1);
    const n = randInt(rng, cfg.nMin, cfg.nMax);
    const rec = randInt(rng, cfg.recMin, cfg.recMax);
    const survie = r2(probaSurvieCumuleePct(pd, n));
    const defautCum = r2(probaDefautCumuleePct(pd, n));
    const naif = r2(n * pd);
    const ecart = r2(naif - defautCum);
    const elHorizon = r2(perteAttenduePct(defautCum, rec));
    const note = cfg.note;

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `a ${note}-rated issuer, annual default probability of the rating class about ${pct(pd, 1)}; the bond under review matures in ${f(n, 0)} years; recovery convention ${pct(rec, 0)}`
      : `un émetteur noté ${note}, probabilité de défaut annuelle de la classe de notation d'environ ${pct(pd, 1)} ; l'obligation étudiée arrive à échéance dans ${f(n, 0)} ans ; convention de recouvrement ${pct(rec, 0)}`;
    const contexte = (en
      ? [
        `Credit committee, Tuesday morning. The file on the table is a ${note} — the first floor of high yield, just below the sacred BBB−/BB+ frontier that separates the investors, the indices and the regulatory weights: ${desc}. The head of research hands you the calculator: "The letter is an opinion. Turn it into probabilities over the LIFE of the bond — and show me why n × PD is wrong."`,
        `A single-B name: the signature that lives and dies with the cycle — chapter 2's table gives such issuers roughly 15-20% cumulative default at 5 years. Your file: ${desc}. The portfolio manager wants the survival arithmetic before the coupon talk: over the bond's life, what are the odds — and what does the additive shortcut hide?`,
        `Downgraded from BBB− to BB+ on Tuesday: one notch, and a change of world — out of the IG indices, out of the "IG only" mandates. The committee reconvenes on the fallen angel: ${desc}. Before discussing the forced sellers, quantify the letter itself: survival, cumulative default, the additive trap, and the expected loss over the horizon.`,
      ]
      : [
        `Comité crédit, mardi matin. Le dossier sur la table est un ${note} — le premier étage du high yield, juste sous la frontière sacrée BBB−/BB+ qui sépare les investisseurs, les indices et les pondérations réglementaires : ${desc}. Le chef de la recherche vous tend la calculatrice : « La lettre est une opinion. Transformez-la en probabilités sur la VIE de l'obligation — et montrez-moi pourquoi n × PD est faux. »`,
        `Un nom single B : la signature qui vit et meurt avec le cycle — le tableau du chapitre 2 donne à ces émetteurs environ 15-20 % de défaut cumulé à 5 ans. Votre dossier : ${desc}. Le gérant veut l'arithmétique de survie avant de parler coupon : sur la vie de l'obligation, quelles sont les chances — et que cache le raccourci additif ?`,
        `Rétrogradé de BBB− à BB+ mardi : un cran, et un changement de monde — sorti des indices IG, sorti des mandats « IG only ». Le comité se réunit à nouveau sur l'ange déchu : ${desc}. Avant de discuter des vendeurs forcés, chiffrez la lettre elle-même : survie, défaut cumulé, le piège additif, et la perte attendue à l'horizon.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? `a) Staying alive: survival over ${f(n, 0)} years` : `a) Rester en vie : la survie sur ${f(n, 0)} ans`,
          enonce: en
            ? `With an annual PD of ${pct(pd, 1)}, what is the probability that the issuer survives the full ${f(n, 0)} years, in %?`
            : `Avec une PD annuelle de ${pct(pd, 1)}, quelle est la probabilité que l'émetteur survive les ${f(n, 0)} ans, en % ?`,
          reponse: survie, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'Survival = 100 × (1 − PD)^n: discrete annual compounding' : 'Survie = 100 × (1 − PD)^n : composition discrète annuelle',
            contenu: en
              ? `100 × (1 − ${f(pd, 1)}/100)^${f(n, 0)} = **${pct(survie)}**. Each year is a coin toss the issuer must win AGAIN: surviving year 5 requires having survived years 1 to 4. The module's benchmark: PD 2% over 5 years gives 90.39% — and survival does NOT decay linearly: 10 years at PD 5% leaves 59.87%, nothing like a "50/50".`
              : `100 × (1 − ${f(pd, 1)}/100)^${f(n, 0)} = **${pct(survie)}**. Chaque année est un tirage que l'émetteur doit gagner À NOUVEAU : survivre à l'année 5 suppose d'avoir survécu aux années 1 à 4. L'étalon du module : PD 2 % sur 5 ans donne 90,39 % — et la survie ne décroît PAS linéairement : 10 ans à PD 5 % laissent 59,87 %, rien d'un « 50/50 ».`,
          }],
          pieges: [en
            ? `Computing 100 − ${f(n, 0)} × ${f(pd, 1)} = ${pct(r2(100 - naif))}: that subtracts defaults as if they added up. Probabilities of surviving MULTIPLY — (1 − PD)^n, never 1 − n·PD.`
            : `Calculer 100 − ${f(n, 0)} × ${f(pd, 1)} = ${pct(r2(100 - naif))} : c'est soustraire les défauts comme s'ils s'additionnaient. Les probabilités de survie se MULTIPLIENT — (1 − PD)^n, jamais 1 − n·PD.`],
        },
        {
          intitule: en ? 'b) The complement: cumulative default' : 'b) Le complément : le défaut cumulé',
          enonce: en
            ? `From the survival of a), what is the probability of at least one default over the ${f(n, 0)} years, in %?`
            : `À partir de la survie du a), quelle est la probabilité d'au moins un défaut sur les ${f(n, 0)} ans, en % ?`,
          reponse: defautCum, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'Cumulative default = 100 − survival' : 'Défaut cumulé = 100 − survie',
            contenu: en
              ? `100 − ${f(survie)} = **${pct(defautCum)}**. Check it against chapter 2's historical table (5-year cumulative): BBB ~1.5%, BB ~6-8%, B ~15-20%, CCC ~40-50% — the scale is violently non-linear: fifteen times the risk from AAA to BBB, ten times again from BBB to B. The letters classify correctly; the spacing between them is anything but even.`
              : `100 − ${f(survie)} = **${pct(defautCum)}**. Vérifiez contre le tableau historique du chapitre 2 (cumulé à 5 ans) : BBB ~1,5 %, BB ~6-8 %, B ~15-20 %, CCC ~40-50 % — l'échelle est violemment non linéaire : quinze fois le risque de AAA à BBB, dix fois encore de BBB à B. Les lettres classent correctement ; l'espacement entre elles n'a rien d'uniforme.`,
          }],
          pieges: [en
            ? `Forgetting that this is "AT LEAST one default over ${f(n, 0)} years", not the PD of year ${f(n, 0)}: the annual PD stays ${pct(pd, 1)} each year — it is the accumulation of exposures that builds ${pct(defautCum)}.`
            : `Oublier que c'est « AU MOINS un défaut sur ${f(n, 0)} ans », pas la PD de l'année ${f(n, 0)} : la PD annuelle reste ${pct(pd, 1)} chaque année — c'est l'accumulation des expositions qui construit ${pct(defautCum)}.`],
        },
        {
          intitule: en ? 'c) The additive trap, measured' : 'c) Le piège additif, mesuré',
          enonce: en
            ? `The intern's shortcut says ${f(n, 0)} × ${f(pd, 1)} = ${pct(naif)}. By how many percentage points does this additive estimate OVERSTATE the true cumulative default of b)?`
            : `Le raccourci du stagiaire dit ${f(n, 0)} × ${f(pd, 1)} = ${pct(naif)}. De combien de points de pourcentage cette estimation additive SURESTIME-t-elle le vrai défaut cumulé du b) ?`,
          reponse: ecart, tolerance: 0.05, toleranceMode: 'absolu', unite: en ? 'points' : 'points',
          etapes: [{
            titre: en ? 'Gap = n × PD − cumulative default' : 'Écart = n × PD − défaut cumulé',
            contenu: en
              ? `${f(naif)} − ${f(defautCum)} = **${f(ecart)} points**. Why does the additive always overstate? Because dying twice is impossible: n × PD counts the default of year 3 even in scenarios where the issuer already died in year 1. The compounding removes those ghosts — you must be alive to die. The gap grows with the horizon AND with the PD: reference values, PD 2% over 5 years, 10 vs 9.61; PD 5% over 10 years, 50 vs 40.13.`
              : `${f(naif)} − ${f(defautCum)} = **${f(ecart)} points**. Pourquoi l'additif surestime-t-il toujours ? Parce que mourir deux fois est impossible : n × PD compte le défaut de l'année 3 même dans les scénarios où l'émetteur est déjà mort en année 1. La composition retire ces fantômes — il faut être vivant pour mourir. L'écart grandit avec l'horizon ET avec la PD : valeurs de référence, PD 2 % sur 5 ans, 10 contre 9,61 ; PD 5 % sur 10 ans, 50 contre 40,13.`,
          }],
          pieges: [en
            ? `Dismissing the gap as negligible: at ${pct(pd, 1)} over ${f(n, 0)} years it is ${f(ecart)} points, but at PD 5% over 10 years it reaches almost 10 points — the shortcut degrades exactly where credit risk matters most, low ratings and long horizons.`
            : `Balayer l'écart comme négligeable : à ${pct(pd, 1)} sur ${f(n, 0)} ans il vaut ${f(ecart)} points, mais à PD 5 % sur 10 ans il approche 10 points — le raccourci se dégrade exactement là où le risque de crédit compte le plus, notes basses et horizons longs.`],
        },
        {
          intitule: en ? 'd) The money: expected loss over the horizon' : "d) L'argent : la perte attendue à l'horizon",
          enonce: en
            ? `With a ${pct(rec, 0)} recovery, what expected loss does the cumulative default of b) represent over the bond's life, in % of nominal (desk first-order approximation)?`
            : `Avec un recouvrement de ${pct(rec, 0)}, quelle perte attendue le défaut cumulé du b) représente-t-il sur la vie de l'obligation, en % du nominal (approximation de desk au premier ordre) ?`,
          reponse: elHorizon, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'EL(horizon) ≈ cumulative default × LGD' : 'EL(horizon) ≈ défaut cumulé × LGD',
            contenu: en
              ? `${f(defautCum)} × (1 − ${f(rec, 0)}/100) = **${pct(elHorizon)}** of nominal over ${f(n, 0)} years — the chapter-3 EL formula fed with the CUMULATIVE probability instead of the annual one (first-order: it ignores default timing and discounting, which is how a desk sizes a limit in thirty seconds). This is the number to weigh against the extra yield the ${note} pays over those same years.`
              : `${f(defautCum)} × (1 − ${f(rec, 0)}/100) = **${pct(elHorizon)}** du nominal sur ${f(n, 0)} ans — la formule EL du chapitre 3 nourrie avec la probabilité CUMULÉE au lieu de l'annuelle (premier ordre : on ignore la date du défaut et l'actualisation, la façon dont un desk dimensionne une limite en trente secondes). C'est le nombre à peser contre le supplément de rendement que le ${note} paie sur ces mêmes années.`,
          }],
          pieges: [en
            ? `Forgetting the recovery and answering ${pct(defautCum)}: default is not total loss — the queue of chapter 1 gives senior unsecured about ${pct(rec, 0)} back here. EL = PD × LGD, always both factors.`
            : `Oublier le recouvrement et répondre ${pct(defautCum)} : le défaut n'est pas la perte totale — la file d'attente du chapitre 1 rend ici environ ${pct(rec, 0)} au senior unsecured. EL = PD × LGD, toujours les deux facteurs.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 3. m5-pb-03 — Le premier CDS — N1                                   */
/* ------------------------------------------------------------------ */
const premierCds: ProblemeMoule = {
  id: 'm5-pb-03', moduleId: M5,
  titre: 'Le premier CDS : deux jambes, quatre dates et un sinistre',
  titreEn: 'The first CDS: two legs, four dates and one credit event',
  typeDeCas: 'couverture',
  typeDeCasEn: 'hedging',
  difficulte: 1,
  scenarios: ['Couvrir la ligne : le gérant achète sa première protection', 'Assurer le high yield : le hedge du desk sur un BB sous pression', "De l'autre côté du contrat : le desk vend la protection et encaisse"],
  scenariosEn: ['Hedging the line: the portfolio manager buys his first protection', 'Insuring high yield: the desk hedge on a BB under pressure', 'The other side of the contract: the desk sells protection and clips the premium'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : notionnel (M€), spread CDS, recouvrement, années avant défaut.
    const cfg = ([
      { nMin: 10, nMax: 25, sMin: 100, sMax: 250, recMin: 38, recMax: 45, tMin: 2, tMax: 4 },
      { nMin: 5, nMax: 15, sMin: 300, sMax: 500, recMin: 25, recMax: 40, tMin: 1, tMax: 3 },
      { nMin: 20, nMax: 50, sMin: 80, sMax: 180, recMin: 40, recMax: 55, tMin: 2, tMax: 4 },
    ] as const)[sIdx];
    const notionnel = randInt(rng, cfg.nMin, cfg.nMax);
    const sCds = randInt(rng, cfg.sMin, cfg.sMax);
    const rec = randInt(rng, cfg.recMin, cfg.recMax);
    const tDef = randInt(rng, cfg.tMin, cfg.tMax);
    const primeAnn = r2(primeCdsAnnuelleEur(notionnel, sCds));
    const primeTrim = r2(primeAnn / 4);
    const paiement = r2(paiementDefautCdsMillions(notionnel, rec));
    const primesVersees = r2(tDef * primeAnn);
    const pnlAcheteur = r2(paiement - primesVersees / 1e6);

    const { en, f, pct, pb, eur, mEur } = outils(langue);
    const desc = en
      ? `5-year CDS on the reference entity, notional ${mEur(notionnel, 0)}, quoted spread ${pb(sCds)}, recovery convention ${pct(rec, 0)}; stress scenario: a credit event certified by the ISDA determination committee after ${f(tDef, 0)} full years of premiums`
      : `CDS à 5 ans sur l'entité de référence, notionnel ${mEur(notionnel, 0)}, spread coté ${pb(sCds)}, convention de recouvrement ${pct(rec, 0)} ; scénario de stress : un événement de crédit constaté par le comité de détermination ISDA après ${f(tDef, 0)} années pleines de primes`;
    const contexte = (en
      ? [
        `The portfolio manager holds the bond and cannot sell it — the line is too big for the secondary market. Solution invented by JPMorgan in 1994: keep the bond, detach the credit risk, buy protection. The trade: ${desc}. Before signing, he wants the four numbers every CDS carries: annual leg, quarterly instalment, contingent payment, and the net P&L if the worst happens.`,
        `A BB under pressure: the primary market has closed for the name and the desk wants insurance without touching the position. The trade: ${desc} — high yield protection is expensive, which is precisely the information. Compute both legs and the stress scenario before the risk committee at noon.`,
        `Today the desk is on the OTHER side: it sells the protection and clips the premium — small, regular income against a rare, massive payout, the option seller's profile from module 8. The contract: ${desc}. Sizing the worst case BEFORE collecting the first coupon is what separates an insurer from AIG in 2008.`,
      ]
      : [
        `Le gérant détient l'obligation et ne peut pas la vendre — la ligne est trop grosse pour le marché secondaire. Solution inventée par JPMorgan en 1994 : garder l'obligation, détacher le risque de crédit, acheter de la protection. Le trade : ${desc}. Avant de signer, il veut les quatre nombres que porte tout CDS : jambe annuelle, versement trimestriel, paiement contingent, et le P&L net si le pire arrive.`,
        `Un BB sous pression : le primaire s'est fermé pour le nom et le desk veut une assurance sans toucher à la position. Le trade : ${desc} — la protection high yield coûte cher, et c'est précisément l'information. Calculez les deux jambes et le scénario de stress avant le comité des risques de midi.`,
        `Aujourd'hui le desk est de l'AUTRE côté : il vend la protection et encaisse la prime — un revenu petit et régulier contre un décaissement rare et massif, le profil du vendeur d'options du module 8. Le contrat : ${desc}. Dimensionner le pire AVANT d'encaisser le premier coupon, c'est ce qui sépare un assureur d'AIG en 2008.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The fixed leg: the annual premium' : 'a) La jambe fixe : la prime annuelle',
          enonce: en
            ? `Notional ${mEur(notionnel, 0)}, spread ${pb(sCds)}. What annual premium does the protection buyer pay, in €?`
            : `Notionnel ${mEur(notionnel, 0)}, spread ${pb(sCds)}. Quelle prime annuelle l'acheteur de protection paie-t-il, en € ?`,
          reponse: primeAnn, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'Premium = notional × spread/10,000' : 'Prime = notionnel × spread/10 000',
            contenu: en
              ? `${f(notionnel, 0)}m × ${f(sCds, 0)}/10,000 = **${eur(primeAnn)}** per year. The anchor to keep in mind: €10m at 200 bp is €200,000 a year — 100 bp cost €0.1m per year per €10m of notional; protection is counted in tenths of a percent. Note what the buyer does NOT need: to own the bond. No insurable interest — the freedom that makes the instrument useful, and that made 2008 possible.`
              : `${f(notionnel, 0)} M × ${f(sCds, 0)}/10 000 = **${eur(primeAnn)}** par an. L'ancre à garder : 10 M€ à 200 pb, c'est 200 000 € par an — 100 pb coûtent 0,1 M€ par an pour 10 M€ de notionnel ; la protection se compte en dixièmes de pour cent. Notez ce dont l'acheteur n'a PAS besoin : détenir l'obligation. Aucun intérêt assurable — la liberté qui rend l'instrument utile, et qui a rendu 2008 possible.`,
          }],
          pieges: [en
            ? `Treating ${f(sCds, 0)} bp as ${f(sCds, 0)}%: the spread is in BASIS points — divide by 10,000, not by 100. The error produces a premium one hundred times too large.`
            : `Traiter ${f(sCds, 0)} pb comme ${f(sCds, 0)} % : le spread est en points de BASE — on divise par 10 000, pas par 100. L'erreur produit une prime cent fois trop grosse.`],
        },
        {
          intitule: en ? 'b) The calendar: the quarterly instalment' : 'b) Le calendrier : le versement trimestriel',
          enonce: en
            ? `The premium of a) is paid in quarterly instalments on the standard dates (March 20, June 20, September 20, December 20). How much is each instalment, in €?`
            : `La prime du a) se verse par quarts trimestriels aux dates standardisées (20 mars, 20 juin, 20 septembre, 20 décembre). Combien vaut chaque versement, en € ?`,
          reponse: primeTrim, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'Instalment = annual premium / 4' : 'Versement = prime annuelle / 4',
            contenu: en
              ? `${f(primeAnn, 0)}/4 = **${eur(primeTrim)}** every quarter, for as long as the entity survives — and the payments stop at the credit event, prorated to the accrued quarter. The standardised dates are not a detail: they make every 5-year CDS in the market fungible, which is what turned an insurance contract into a TRADED instrument with a live quote.`
              : `${f(primeAnn, 0)}/4 = **${eur(primeTrim)}** chaque trimestre, tant que l'entité survit — et les versements s'arrêtent à l'événement de crédit, au prorata du trimestre couru. Les dates standardisées ne sont pas un détail : elles rendent fongibles tous les CDS 5 ans du marché, ce qui a transformé un contrat d'assurance en instrument COTÉ, avec un prix en continu.`,
          }],
          pieges: [en
            ? `Believing the contractual premium moves with the market quote: the ${pb(sCds)} are FIXED at inception for this contract. If the market spread doubles tomorrow, your instalments do not change — the VALUE of your contract does.`
            : `Croire que la prime contractuelle bouge avec la cote de marché : les ${pb(sCds)} sont FIGÉS à l'origine pour ce contrat. Si le spread de marché double demain, vos versements ne changent pas — c'est la VALEUR de votre contrat qui change.`],
        },
        {
          intitule: en ? 'c) The protection leg: the payment at default' : 'c) La jambe de protection : le paiement au défaut',
          enonce: en
            ? `The credit event hits and the auction sets the recovery at ${pct(rec, 0)}. How much does the protection seller pay, in €m?`
            : `L'événement de crédit frappe et l'enchère fixe le recouvrement à ${pct(rec, 0)}. Combien le vendeur de protection paie-t-il, en M€ ?`,
          reponse: paiement, tolerance: 0.005, unite: en ? '€m' : 'M€',
          etapes: [{
            titre: en ? 'Payment = notional × (1 − R): the loss, never the notional' : 'Paiement = notionnel × (1 − R) : la perte, jamais le notionnel',
            contenu: en
              ? `${f(notionnel, 0)} × (1 − ${f(rec, 0)}/100) = **${mEur(paiement)}**. The seller compensates the LOSS, not the face value — the anchor: €10m with R = 40% pays €6m. The CDS puts the buyer back in the position of an indemnified creditor, not of a lottery winner. And remember the auction's role: one recovery figure, set weeks after the event, binding for EVERY contract on the name at once — Lehman 2008: 8.625%.`
              : `${f(notionnel, 0)} × (1 − ${f(rec, 0)}/100) = **${mEur(paiement)}**. Le vendeur compense la PERTE, pas le nominal — l'ancre : 10 M€ avec R = 40 % paient 6 M€. Le CDS remet l'acheteur dans la situation d'un créancier indemnisé, pas dans celle d'un gagnant au loto. Et retenez le rôle de l'enchère : un chiffre de recouvrement unique, fixé quelques semaines après l'événement, opposable à TOUS les contrats du nom en même temps — Lehman 2008 : 8,625 %.`,
          }],
          pieges: [en
            ? `Paying the full ${mEur(notionnel, 0)}: the recovery belongs to the creditor — the seller only covers the ${pct(r2(100 - rec), 0)} that is actually lost. Answering the notional is THE classic CDS error at the oral.`
            : `Payer les ${mEur(notionnel, 0)} entiers : le recouvrement appartient au créancier — le vendeur ne couvre que les ${pct(r2(100 - rec), 0)} réellement perdus. Répondre le notionnel est LE grand classique de l'erreur CDS à l'oral.`],
        },
        {
          intitule: en ? `d) The full picture: the buyer's net P&L` : "d) L'image complète : le P&L net de l'acheteur",
          enonce: en
            ? `The credit event arrives after ${f(tDef, 0)} full years of premiums (no prorated quarter). Netting the payment of c) against all premiums paid, what is the protection buyer's P&L, in €m?`
            : `L'événement de crédit survient après ${f(tDef, 0)} années pleines de primes (pas de trimestre au prorata). En nettant le paiement du c) contre toutes les primes versées, quel est le P&L de l'acheteur de protection, en M€ ?`,
          reponse: pnlAcheteur, tolerance: 0.005, unite: en ? '€m' : 'M€',
          etapes: [
            {
              titre: en ? 'P&L = payment − premiums paid' : 'P&L = paiement − primes versées',
              contenu: en
                ? `Premiums paid = ${f(tDef, 0)} × ${f(primeAnn, 0)} = ${eur(primesVersees)}; P&L = ${f(paiement)} − ${f(r2(primesVersees / 1e6))} = **${mEur(pnlAcheteur)}**. The insurance profile in one line: a small, certain outflow against a rare, massive inflow. The seller's P&L is the exact mirror, ${mEur(r2(-pnlAcheteur))} — collected ${eur(primesVersees)} over ${f(tDef, 0)} years, then repaid it many times over in one settlement.`
                : `Primes versées = ${f(tDef, 0)} × ${f(primeAnn, 0)} = ${eur(primesVersees)} ; P&L = ${f(paiement)} − ${f(r2(primesVersees / 1e6))} = **${mEur(pnlAcheteur)}**. Le profil d'assurance en une ligne : un décaissement petit et certain contre un encaissement rare et massif. Le P&L du vendeur est le miroir exact, ${mEur(r2(-pnlAcheteur))} — ${eur(primesVersees)} encaissés en ${f(tDef, 0)} ans, puis rendus plusieurs fois dans un seul règlement.`,
            },
            {
              titre: en ? 'Why this asymmetry is the psychology of the market' : "Pourquoi cette asymétrie est la psychologie du marché",
              contenu: en
                ? `Selling protection "earns" every quarter — until the quarter where it gives everything back. That is exactly the option seller's profile of module 8, and the trap AIG fell into: collecting premiums on hundreds of billions of super-senior notionals, booked as almost-free money, until one settlement season asked for it all back at once. If the buyer also HOLDS the bond, this P&L is not a win: it offsets the loss on the position — a hedge, not a bet.`
                : `Vendre de la protection « rapporte » chaque trimestre — jusqu'au trimestre où elle rend tout. C'est exactement le profil du vendeur d'options du module 8, et le piège où AIG est tombée : encaisser des primes sur des centaines de milliards de notionnels super-senior, comptabilisées comme de l'argent presque gratuit, jusqu'à la saison de règlement qui redemande tout d'un coup. Si l'acheteur DÉTIENT aussi l'obligation, ce P&L n'est pas un gain : il compense la perte de la position — une couverture, pas un pari.`,
            },
          ],
          pieges: [en
            ? `Forgetting the premiums already paid and answering ${mEur(paiement)}: the protection was never free — ${f(tDef, 0)} years at ${eur(primeAnn)} must be netted off before calling it a profit.`
            : `Oublier les primes déjà versées et répondre ${mEur(paiement)} : la protection n'a jamais été gratuite — ${f(tDef, 0)} ans à ${eur(primeAnn)} doivent être nettés avant de parler de gain.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 4. m5-pb-04 — La tranche simple — N1                                */
/* ------------------------------------------------------------------ */
const trancheSimple: ProblemeMoule = {
  id: 'm5-pb-04', moduleId: M5,
  titre: 'La tranche simple : la falaise dans le pool',
  titreEn: 'The simple tranche: the cliff inside the pool',
  typeDeCas: 'titrisation',
  typeDeCasEn: 'securitisation',
  difficulte: 1,
  scenarios: ['Le pool de crédits auto : la première titrisation du desk', 'Le RMBS : des hypothèques par milliers', 'Le CLO : des leveraged loans en couches'],
  scenariosEn: ["The auto-loan pool: the desk's first securitisation", 'The RMBS: mortgages by the thousand', 'The CLO: leveraged loans in layers'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : attache, largeur de la mezzanine, recouvrement du pool, ligne détenue.
    const cfg = ([
      { aMin: 2, aMax: 3, wMin: 3, wMax: 3, recMin: 35, recMax: 50, xMin: 2, xMax: 6 },
      { aMin: 3, aMax: 4, wMin: 3, wMax: 4, recMin: 40, recMax: 60, xMin: 5, xMax: 15 },
      { aMin: 3, aMax: 3, wMin: 3, wMax: 4, recMin: 50, recMax: 60, xMin: 5, xMax: 10 },
    ] as const)[sIdx];
    const attache = randInt(rng, cfg.aMin, cfg.aMax);
    const largeur = randInt(rng, cfg.wMin, cfg.wMax);
    const detach = attache + largeur;
    const rec = randInt(rng, cfg.recMin, cfg.recMax);
    const ligne = randInt(rng, cfg.xMin, cfg.xMax);
    // Le taux de défaut est tiré pour que L tombe STRICTEMENT dans la mezzanine (30-80 % de sa largeur).
    const lgd = 1 - rec / 100;
    const defauts = randFloat(rng, (attache + 0.3 * largeur) / lgd, (attache + 0.8 * largeur) / lgd, 1);
    const pertePool = r2(defauts * lgd);
    const perteEq = r2(perteTranchePct(pertePool, 0, attache));
    const perteMezz = r2(perteTranchePct(pertePool, attache, detach));
    const perteLigne = r2((ligne * perteMezz) / 100);

    const { en, f, pct, mEur } = outils(langue);
    const desc = en
      ? `cumulative default rate of the pool over the deal's life: ${pct(defauts, 1)} of loans, recovery on defaulted loans ${pct(rec, 0)}; capital structure: equity 0-${f(attache, 0)}%, mezzanine ${f(attache, 0)}-${f(detach, 0)}%, senior ${f(detach, 0)}-100%; the desk holds ${mEur(ligne, 0)} of the mezzanine`
      : `taux de défaut cumulé du pool sur la vie de l'opération : ${pct(defauts, 1)} des prêts, recouvrement sur les prêts en défaut ${pct(rec, 0)} ; structure du passif : equity 0-${f(attache, 0)} %, mezzanine ${f(attache, 0)}-${f(detach, 0)} %, senior ${f(detach, 0)}-100 % ; le desk détient ${mEur(ligne, 0)} de la mezzanine`;
    const contexte = (en
      ? [
        `Fifty thousand auto loans, none of which any investor would analyse alone, pooled into a statistical object and sliced into layers — the desk's first securitisation, and yours: ${desc}. The structurer wants the loss waterfall computed by hand before trusting any model: pool, equity, mezzanine, and your own line.`,
        `An RMBS: thousands of mortgages ceded to the SPV in a true sale — the investor no longer holds a bank's signature, only the statistics of the pool. The vintage turned bad: ${desc}. Compute where the losses land, layer by layer, and what is left of the desk's mezzanine line.`,
        `A CLO: leveraged loans in layers — higher recoveries than bonds (secured paper), but a pool where defaults arrive in clusters. The stress case on the table: ${desc}. The committee wants the tranche arithmetic before the rating discussion: the cliff, not the average.`,
      ]
      : [
        `Cinquante mille crédits auto qu'aucun investisseur n'analyserait un par un, mis en pool pour devenir un objet statistique et découpés en couches — la première titrisation du desk, et la vôtre : ${desc}. Le structureur veut la cascade des pertes calculée à la main avant de faire confiance au moindre modèle : pool, equity, mezzanine, et votre propre ligne.`,
        `Un RMBS : des milliers d'hypothèques cédées au véhicule en true sale — l'investisseur ne porte plus la signature d'une banque, seulement la statistique du pool. Le millésime a mal tourné : ${desc}. Calculez où atterrissent les pertes, couche par couche, et ce qui reste de la ligne mezzanine du desk.`,
        `Un CLO : des leveraged loans en couches — des recouvrements plus hauts que les obligations (du papier sécurisé), mais un pool où les défauts arrivent en grappes. Le cas de stress sur la table : ${desc}. Le comité veut l'arithmétique des tranches avant la discussion de notation : la falaise, pas la moyenne.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The pool: from defaults to losses' : 'a) Le pool : des défauts aux pertes',
          enonce: en
            ? `${pct(defauts, 1)} of the loans default, with ${pct(rec, 0)} recovered on each. What is the cumulative loss L of the pool, in % of the pool?`
            : `${pct(defauts, 1)} des prêts font défaut, avec ${pct(rec, 0)} récupérés sur chacun. Quelle est la perte cumulée L du pool, en % du pool ?`,
          reponse: pertePool, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'L = default rate × LGD' : 'L = taux de défaut × LGD',
            contenu: en
              ? `${f(defauts, 1)} × (1 − ${f(rec, 0)}/100) = **${pct(pertePool)}** of the pool — the chapter-3 formula applied to a portfolio: defaults are not losses, recoveries cut them down. This single number L is the only input the whole capital structure reacts to: everything that follows is geometry around it.`
              : `${f(defauts, 1)} × (1 − ${f(rec, 0)}/100) = **${pct(pertePool)}** du pool — la formule du chapitre 3 appliquée à un portefeuille : les défauts ne sont pas des pertes, le recouvrement les ampute. Ce seul nombre L est la seule entrée à laquelle toute la structure réagit : la suite n'est que de la géométrie autour de lui.`,
          }],
          pieges: [en
            ? `Taking the default rate ${pct(defauts, 1)} as the loss: with ${pct(rec, 0)} recovered, the pool only loses ${pct(pertePool)} — confusing PD and EL at the pool level shifts every tranche result that follows.`
            : `Prendre le taux de défaut ${pct(defauts, 1)} comme la perte : avec ${pct(rec, 0)} récupérés, le pool ne perd que ${pct(pertePool)} — confondre PD et EL au niveau du pool décale tous les résultats de tranche qui suivent.`],
        },
        {
          intitule: en ? `b) The first loss: the 0-${f(attache, 0)}% equity` : `b) La première perte : l'equity 0-${f(attache, 0)} %`,
          enonce: en
            ? `With the pool loss L of a), what fraction of the equity tranche (0-${f(attache, 0)}%) is destroyed, in % of ITS notional?`
            : `Avec la perte de pool L du a), quelle fraction de la tranche equity (0-${f(attache, 0)} %) est détruite, en % de SON notionnel ?`,
          reponse: perteEq, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'Tranche loss = clamp((L − A)/(D − A)) × 100' : 'Perte de tranche = clamp((L − A)/(D − A)) × 100',
            contenu: en
              ? `(${f(pertePool)} − 0)/(${f(attache, 0)} − 0) capped at 1 gives **${pct(perteEq, 0)}**: the pool lost ${pct(pertePool)}, more than the ${pct(attache, 0)} detachment point — the first-loss tranche is wiped out entirely. That is its JOB: the equity is the shock absorber sold to whoever wants leverage without borrowing, and it was already half-destroyed when L crossed ${pct(r2(attache / 2), 1)}.`
              : `(${f(pertePool)} − 0)/(${f(attache, 0)} − 0) plafonné à 1 donne **${pct(perteEq, 0)}** : le pool a perdu ${pct(pertePool)}, plus que le point de détachement de ${pct(attache, 0)} — la tranche de première perte est intégralement rasée. C'est son MÉTIER : l'equity est l'amortisseur vendu à qui veut du levier sans emprunt, et elle était déjà à moitié détruite quand L a franchi ${pct(r2(attache / 2), 1)}.`,
          }],
          pieges: [en
            ? `Answering ${pct(pertePool)} — the pool's loss: a tranche never loses like the pool. The equity concentrates the FIRST ${pct(attache, 0)} of pool losses on a sliver of capital: at L = ${pct(pertePool)}, it is long dead.`
            : `Répondre ${pct(pertePool)} — la perte du pool : une tranche ne perd jamais comme le pool. L'equity concentre les ${pct(attache, 0)} PREMIERS points de perte du pool sur une mince couche de capital : à L = ${pct(pertePool)}, elle est morte depuis longtemps.`],
        },
        {
          intitule: en ? `c) The cliff: the ${f(attache, 0)}-${f(detach, 0)}% mezzanine` : `c) La falaise : la mezzanine ${f(attache, 0)}-${f(detach, 0)} %`,
          enonce: en
            ? `Same pool loss L. What fraction of the mezzanine (${f(attache, 0)}-${f(detach, 0)}%) is destroyed, in % of ITS notional?`
            : `Même perte de pool L. Quelle fraction de la mezzanine (${f(attache, 0)}-${f(detach, 0)} %) est détruite, en % de SON notionnel ?`,
          reponse: perteMezz, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'Loss = (L − A)/(D − A) × 100 between attach and detach' : "Perte = (L − A)/(D − A) × 100 entre attache et détachement",
            contenu: en
              ? `(${f(pertePool)} − ${f(attache, 0)})/(${f(detach, 0)} − ${f(attache, 0)}) × 100 = **${pct(perteMezz)}**. The module's anchor: the 3-6% mezzanine with L = 5% loses 66.67% — two thirds of the tranche for "only" 5% of pool losses. Look at the sensitivity: between ${pct(attache, 0)} and ${pct(detach, 0)}, each additional point of pool loss destroys ${pct(r2(100 / largeur), 1)} of the tranche — a continuous pool loss becomes a CLIFF for the tranche holder. Leverage without borrowing, invisible in every classical ratio.`
              : `(${f(pertePool)} − ${f(attache, 0)})/(${f(detach, 0)} − ${f(attache, 0)}) × 100 = **${pct(perteMezz)}**. L'ancre du module : la mezzanine 3-6 % avec L = 5 % perd 66,67 % — les deux tiers de la tranche pour « seulement » 5 % de pertes du pool. Regardez la sensibilité : entre ${pct(attache, 0)} et ${pct(detach, 0)}, chaque point de perte du pool supplémentaire détruit ${pct(r2(100 / largeur), 1)} de la tranche — une perte continue du pool devient une FALAISE pour le porteur de tranche. Du levier sans emprunt, invisible dans tous les ratios classiques.`,
          }],
          pieges: [en
            ? `Answering L − A = ${pct(r2(pertePool - attache), 1)}: that is the loss in % of the POOL. The tranche's loss is measured against its own thickness of ${pct(largeur, 0)} — divide by (D − A) before multiplying by 100.`
            : `Répondre L − A = ${pct(r2(pertePool - attache), 1)} : c'est la perte en % du POOL. La perte de la tranche se mesure contre sa propre épaisseur de ${pct(largeur, 0)} — divisez par (D − A) avant de multiplier par 100.`],
        },
        {
          intitule: en ? `d) Your line: ${mEur(ligne, 0)} of mezzanine` : `d) Votre ligne : ${mEur(ligne, 0)} de mezzanine`,
          enonce: en
            ? `The desk holds ${mEur(ligne, 0)} of the mezzanine tranche. Using c), what is the loss on the line, in €m?`
            : `Le desk détient ${mEur(ligne, 0)} de la tranche mezzanine. Avec le c), quelle est la perte sur la ligne, en M€ ?`,
          reponse: perteLigne, tolerance: 0.005, unite: en ? '€m' : 'M€',
          etapes: [{
            titre: en ? 'Loss = holding × tranche loss %' : 'Perte = ligne × perte de tranche %',
            contenu: en
              ? `${f(ligne, 0)} × ${f(perteMezz)}/100 = **${mEur(perteLigne)}** gone, on a pool that lost ${pct(pertePool)}. This multiplication is where the 2008 lesson lives: the buyer saw a diversified pool and a comfortable attachment point; the structure saw to it that a few points of pool losses would be concentrated on exactly his layer. The tranche loss %, not the pool loss %, is what hits the book.`
              : `${f(ligne, 0)} × ${f(perteMezz)}/100 = **${mEur(perteLigne)}** envolés, sur un pool qui a perdu ${pct(pertePool)}. Cette multiplication est là où vit la leçon de 2008 : l'acheteur voyait un pool diversifié et un point d'attache confortable ; la structure s'est chargée de concentrer quelques points de pertes du pool exactement sur sa couche. C'est la perte de tranche en %, pas celle du pool, qui frappe le book.`,
          }],
          pieges: [en
            ? `Applying the POOL loss to the line (${f(ligne, 0)} × ${f(pertePool)}/100 = ${mEur(r2((ligne * pertePool) / 100))}): the desk does not hold the pool, it holds the tranche — the subordination multiplies the hit to ${mEur(perteLigne)}.`
            : `Appliquer la perte du POOL à la ligne (${f(ligne, 0)} × ${f(pertePool)}/100 = ${mEur(r2((ligne * pertePool) / 100))}) : le desk ne détient pas le pool, il détient la tranche — la subordination multiplie le coup jusqu'à ${mEur(perteLigne)}.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 5. m5-pb-05 — Pricer le corporate — N2                              */
/* ------------------------------------------------------------------ */
const pricerCorporate: ProblemeMoule = {
  id: 'm5-pb-05', moduleId: M5,
  titre: 'Pricer le corporate : le spread entre dans le taux',
  titreEn: 'Pricing the corporate: the spread enters the discount rate',
  typeDeCas: 'pricing',
  typeDeCasEn: 'pricing',
  difficulte: 2,
  scenarios: ["La nouvelle émission : le pricing d'avant book-building", "L'ange déchu à repricer : le carnet réclame un prix", 'Le secondaire high yield : coter un nom sous pression'],
  scenariosEn: ['The new issue: pricing ahead of book-building', 'The fallen angel to reprice: the order book wants a price', 'The high yield secondary: quoting a name under pressure'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : coupon, spread, maturité, recouvrement.
    const cfg = ([
      { cMin: 2.5, cMax: 4.5, sMin: 100, sMax: 200, mMin: 5, mMax: 8, recMin: 38, recMax: 45 },
      { cMin: 3, cMax: 5.5, sMin: 200, sMax: 350, mMin: 4, mMax: 7, recMin: 35, recMax: 45 },
      { cMin: 5, cMax: 7, sMin: 350, sMax: 600, mMin: 4, mMax: 6, recMin: 25, recMax: 40 },
    ] as const)[sIdx];
    const coupon = randFloat(rng, cfg.cMin, cfg.cMax, 1);
    const rf = randFloat(rng, 2, 3.5, 1);
    const sPb = randInt(rng, cfg.sMin, cfg.sMax);
    const mat = randInt(rng, cfg.mMin, cfg.mMax);
    const rec = randInt(rng, cfg.recMin, cfg.recMax);
    const prixSans = r2(prixObligationRisquee(coupon, rf, 0, mat));
    const prixAvec = r2(prixObligationRisquee(coupon, rf, sPb, mat));
    const ecart = r2(prixSans - prixAvec);
    const pdImpl = r2(pdImplicitePct(sPb, rec));
    const yTotal = r2(rf + sPb / 100);

    const { en, f, pct, pb } = outils(langue);
    const desc = en
      ? `annual coupon ${pct(coupon, 1)}, redemption at par 100 in ${f(mat, 0)} years; risk-free curve at ${pct(rf, 1)}, credit spread of the name ${pb(sPb)}, recovery convention ${pct(rec, 0)}`
      : `coupon annuel ${pct(coupon, 1)}, remboursement au pair 100 dans ${f(mat, 0)} ans ; courbe sans risque à ${pct(rf, 1)}, spread de crédit du nom ${pb(sPb)}, convention de recouvrement ${pct(rec, 0)}`;
    const contexte = (en
      ? [
        `The syndicate desk preps tomorrow's new issue and the book-building will move fast — you need the anchor prices before the first order lands: ${desc}. The method is the desk's "spread on the curve": the default lives in the DISCOUNT RATE, not in the cash flows. Price it without doubt, price it with, and read what the gap says.`,
        `The fallen angel again — and this time the order book wants a PRICE, not a story: ${desc}. The IG funds must sell, the HY funds bid at their level, and between the two sits your quote. Same discipline: risk-free price, risky price, cost of the spread in points, and the PD the market is implying.`,
        `The HY secondary in a nervous tape: a client asks for a two-way quote on a name whose spread just gapped: ${desc}. Before showing anything, rebuild the price from the curve — the trader who cannot decompose his price into rate and spread is quoting blind.`,
      ]
      : [
        `Le desk de syndication prépare l'émission de demain et le book-building ira vite — il vous faut les prix d'ancrage avant le premier ordre : ${desc}. La méthode est le « spread sur la courbe » du desk : le défaut vit dans le TAUX D'ACTUALISATION, pas dans les flux. Pricez sans le doute, pricez avec, et lisez ce que dit l'écart.`,
        `L'ange déchu encore — et cette fois le carnet d'ordres réclame un PRIX, pas une histoire : ${desc}. Les fonds IG doivent vendre, les fonds HY enchérissent à leur niveau, et entre les deux se tient votre cote. Même discipline : prix sans risque, prix risqué, coût du spread en points, et la PD que le marché implique.`,
        `Le secondaire HY par marché nerveux : un client demande une fourchette sur un nom dont le spread vient de sauter : ${desc}. Avant de montrer quoi que ce soit, reconstruisez le prix depuis la courbe — le trader qui ne sait pas décomposer son prix en taux et en spread cote à l'aveugle.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The doubt-free world: price without spread' : 'a) Le monde sans doute : le prix sans spread',
          enonce: en
            ? `Discounting all cash flows (coupon ${pct(coupon, 1)}, par 100 at ${f(mat, 0)} years) at the risk-free rate ${pct(rf, 1)} alone, what is the bond's price, in points?`
            : `En actualisant tous les flux (coupon ${pct(coupon, 1)}, pair 100 à ${f(mat, 0)} ans) au seul taux sans risque ${pct(rf, 1)}, quel est le prix de l'obligation, en points ?`,
          reponse: prixSans, tolerance: 0.005, unite: 'points',
          etapes: [{
            titre: en ? 'Module-4 machinery: discount every flow at r' : 'La machinerie du module 4 : actualiser chaque flux à r',
            contenu: en
              ? `P = Σ ${f(coupon, 1)}/(1 + ${f(rf, 1)}/100)^t + 100/(1 + ${f(rf, 1)}/100)^${f(mat, 0)} = **${f(prixSans)}**. Mental anchor from module 4: coupon above the yield ⇒ price above par, coupon at the yield ⇒ exactly par. This is what the bond would be worth if the promise were certain — the government-bond twin of the corporate.`
              : `P = Σ ${f(coupon, 1)}/(1 + ${f(rf, 1)}/100)^t + 100/(1 + ${f(rf, 1)}/100)^${f(mat, 0)} = **${f(prixSans)}**. Ancre mentale du module 4 : coupon au-dessus du rendement ⇒ prix au-dessus du pair, coupon au rendement ⇒ exactement le pair. C'est ce que vaudrait l'obligation si la promesse était certaine — le jumeau d'État du corporate.`,
          }],
          pieges: [en
            ? `Discounting at the coupon rate ${pct(coupon, 1)}: the coupon is a CASH FLOW, the discount rate is the market's — mixing them returns par mechanically and erases all the information.`
            : `Actualiser au taux du coupon ${pct(coupon, 1)} : le coupon est un FLUX, le taux d'actualisation est celui du marché — les confondre redonne le pair mécaniquement et efface toute l'information.`],
        },
        {
          intitule: en ? 'b) The doubt enters: price with the spread' : 'b) Le doute entre : le prix avec le spread',
          enonce: en
            ? `Now discount the same flows at y = ${pct(rf, 1)} + ${pb(sPb)} = ${pct(yTotal)}. What is the price, in points?`
            : `Actualisez maintenant les mêmes flux à y = ${pct(rf, 1)} + ${pb(sPb)} = ${pct(yTotal)}. Quel est le prix, en points ?`,
          reponse: prixAvec, tolerance: 0.005, unite: 'points',
          etapes: [{
            titre: en ? 'Same flows, heavier rate: the desk method' : 'Mêmes flux, taux alourdi : la méthode du desk',
            contenu: en
              ? `P = Σ ${f(coupon, 1)}/(1 + ${f(yTotal)}/100)^t + 100/(1 + ${f(yTotal)}/100)^${f(mat, 0)} = **${f(prixAvec)}**. Note the architecture: the cash flows are UNTOUCHED — the promise is still written as ${f(coupon, 1)} per year and 100 at the end. The doubt lives entirely in the discount rate: that is the "spread on the curve" method, the one that lets a desk reprice a name in one second when the spread moves.`
              : `P = Σ ${f(coupon, 1)}/(1 + ${f(yTotal)}/100)^t + 100/(1 + ${f(yTotal)}/100)^${f(mat, 0)} = **${f(prixAvec)}**. Notez l'architecture : les flux sont INTACTS — la promesse s'écrit toujours ${f(coupon, 1)} par an et 100 au bout. Le doute vit entièrement dans le taux d'actualisation : c'est la méthode « spread sur la courbe », celle qui permet au desk de repricer un nom en une seconde quand le spread bouge.`,
          }],
          pieges: [en
            ? `Haircutting the cash flows by the PD ("the coupon is only ${pct(r2(coupon * (1 - pdImpl / 100)), 2)} expected"): double counting — in this method the default risk is already entirely in the ${pb(sPb)} of the discount rate. Flows OR rate, never both.`
            : `Amputer les flux de la PD (« le coupon ne vaut que ${pct(r2(coupon * (1 - pdImpl / 100)), 2)} en espérance ») : double comptage — dans cette méthode, le risque de défaut est déjà tout entier dans les ${pb(sPb)} du taux d'actualisation. Les flux OU le taux, jamais les deux.`],
        },
        {
          intitule: en ? 'c) The bill in points: what the spread costs' : "c) L'addition en points : ce que coûte le spread",
          enonce: en
            ? `Difference between a) and b): how many points of price does the ${pb(sPb)} spread cost?`
            : `Différence entre le a) et le b) : combien de points de prix le spread de ${pb(sPb)} coûte-t-il ?`,
          reponse: ecart, tolerance: 0.005, unite: 'points',
          etapes: [{
            titre: en ? 'Cost = risk-free price − risky price' : 'Coût = prix sans risque − prix risqué',
            contenu: en
              ? `${f(prixSans)} − ${f(prixAvec)} = **${f(ecart)} points**. Sanity-check it with duration: ΔP ≈ −D × Δs, and with roughly ${f(mat, 0)} years of maturity the order of magnitude works out — the longer the bond, the more each basis point of spread costs in price. The library's reference: coupon 4, r 3, 5 years — the 200 bp spread costs 8.91 points.`
              : `${f(prixSans)} − ${f(prixAvec)} = **${f(ecart)} points**. Vérifiez l'ordre de grandeur par la duration : ΔP ≈ −D × Δs, et avec environ ${f(mat, 0)} ans de maturité le compte y est — plus l'obligation est longue, plus chaque point de base de spread coûte cher en prix. La référence de la bibliothèque : coupon 4, r 3, 5 ans — le spread de 200 pb coûte 8,91 points.`,
          }],
          pieges: [en
            ? `Reading ${f(ecart)} points as ${pct(ecart)} of loss: points of PRICE on a base of ${f(prixSans)}, i.e. ${pct(r2((ecart / prixSans) * 100))} in relative terms — close here, but the desk quotes prices in points, never in percent of themselves.`
            : `Lire ${f(ecart)} points comme ${pct(ecart)} de perte : des points de PRIX sur une base de ${f(prixSans)}, soit ${pct(r2((ecart / prixSans) * 100))} en relatif — proche ici, mais le desk cote les prix en points, jamais en pour cent d'eux-mêmes.`],
        },
        {
          intitule: en ? 'd) The reading: what the market is pricing' : 'd) La lecture : ce que le marché price',
          enonce: en
            ? `With the ${pct(rec, 0)} recovery convention, what annual default probability is implied by the ${pb(sPb)} spread, in %?`
            : `Avec la convention de recouvrement de ${pct(rec, 0)}, quelle probabilité de défaut annuelle le spread de ${pb(sPb)} implique-t-il, en % ?`,
          reponse: pdImpl, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'PD = (s/100)/(1 − R/100), and the caveat that goes with it' : 'PD = (s/100)/(1 − R/100), et la réserve qui va avec',
            contenu: en
              ? `(${f(sPb, 0)}/100)/(1 − ${f(rec, 0)}/100) = **${pct(pdImpl)}** per year — the price of b) and this PD are two faces of the same number. The caveat for the committee: it is RISK-NEUTRAL, inflated by the risk and liquidity premia — the historical frequency of the name is lower. The desk uses it as a common language between bonds and CDS, not as a forecast.`
              : `(${f(sPb, 0)}/100)/(1 − ${f(rec, 0)}/100) = **${pct(pdImpl)}** par an — le prix du b) et cette PD sont deux visages du même nombre. La réserve pour le comité : elle est RISQUE-NEUTRE, gonflée par les primes de risque et de liquidité — la fréquence historique du nom est plus basse. Le desk s'en sert comme langue commune entre obligations et CDS, pas comme prévision.`,
          }],
          pieges: [en
            ? `Announcing "${pct(pdImpl)} chance of default" to a client as a forecast: the implied PD overstates the real-world frequency by construction — the spread pays for clusters and illiquidity on top of the average default.`
            : `Annoncer « ${pct(pdImpl)} de chances de défaut » à un client comme une prévision : la PD implicite surestime la fréquence réelle par construction — le spread paie les grappes et l'illiquidité en plus du défaut moyen.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 6. m5-pb-06 — L'écartement de crise — N2                            */
/* ------------------------------------------------------------------ */
const ecartementCrise: ProblemeMoule = {
  id: 'm5-pb-06', moduleId: M5,
  titre: "L'écartement de crise : la spread duration au travail",
  titreEn: 'The crisis widening: spread duration at work',
  typeDeCas: 'portefeuille',
  typeDeCasEn: 'portfolio',
  difficulte: 2,
  scenarios: ['Le book high yield : +300 pb en trois semaines', "Le Crossover s'embrase : le fonds mesure sa toile", 'Le fonds IG : un repricing poli, mais long en duration'],
  scenariosEn: ['The high yield book: +300 bp in three weeks', 'Crossover catches fire: the fund measures its exposure', 'The IG fund: a polite repricing, but long duration'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : spread duration, écartement, prix initial, encours, chute de l'action témoin.
    const cfg = ([
      { dMin: 4, dMax: 6, dsMin: 200, dsMax: 400, pMin: 88, pMax: 100, vMin: 50, vMax: 200, acMin: 20, acMax: 35 },
      { dMin: 3.5, dMax: 5, dsMin: 150, dsMax: 350, pMin: 90, pMax: 102, vMin: 100, vMax: 300, acMin: 15, acMax: 30 },
      { dMin: 6, dMax: 8, dsMin: 60, dsMax: 150, pMin: 95, pMax: 104, vMin: 200, vMax: 500, acMin: 15, acMax: 25 },
    ] as const)[sIdx];
    const duration = randFloat(rng, cfg.dMin, cfg.dMax, 1);
    const ds = randInt(rng, cfg.dsMin, cfg.dsMax);
    const p0 = randFloat(rng, cfg.pMin, cfg.pMax, 2);
    const encours = randInt(rng, cfg.vMin, cfg.vMax);
    const chuteAction = randInt(rng, cfg.acMin, cfg.acMax);
    const dp = r2(variationPrixSpreadPct(duration, ds));
    const pNouveau = r2(p0 * (1 + dp / 100));
    const perteM = r2((encours * dp) / 100);
    const dsEquiv = r2((chuteAction / duration) * 100);

    const { en, f, pct, pb, mEur } = outils(langue);
    const desc = en
      ? `book of ${mEur(encours, 0)}, spread duration ${f(duration, 1)}, average price ${f(p0)}; the market scenario: spreads widen by ${pb(ds)}, while the benchmark equity index drops ${pct(chuteAction, 0)}`
      : `book de ${mEur(encours, 0)}, spread duration ${f(duration, 1)}, prix moyen ${f(p0)} ; le scénario de marché : les spreads s'écartent de ${pb(ds)}, pendant que l'indice actions de référence perd ${pct(chuteAction, 0)}`;
    const contexte = (en
      ? [
        `Three weeks ago the primary was wide open; this morning it is shut and the screens show the widening spreading from name to name. Your high yield book: ${desc}. The risk manager wants the crisis arithmetic — price impact, new level, loss in euros — and one comparison: who is really falling faster, your bonds or the equity market?`,
        `The Crossover gaps at the open and the fund's board calls before lunch. The exposure: ${desc}. Spread duration is the only ruler that matters today: convert the basis points into percent, the percent into euros, and the panic into a comparable number.`,
        `An IG fund — polite spreads, but LONG duration: the repricing is small in basis points and large in price. The book: ${desc}. Show the committee why "investment grade" does not mean "low volatility" when the duration ruler is this long.`,
      ]
      : [
        `Il y a trois semaines le primaire était grand ouvert ; ce matin il est fermé et les écrans montrent l'écartement gagner nom après nom. Votre book high yield : ${desc}. Le risk manager veut l'arithmétique de crise — impact prix, nouveau niveau, perte en euros — et une comparaison : qui tombe vraiment le plus vite, vos obligations ou le marché actions ?`,
        `Le Crossover saute à l'ouverture et le conseil du fonds appelle avant midi. L'exposition : ${desc}. La spread duration est la seule règle qui compte aujourd'hui : convertissez les points de base en pour cent, les pour cent en euros, et la panique en un nombre comparable.`,
        `Un fonds IG — des spreads polis, mais une duration LONGUE : le repricing est petit en points de base et grand en prix. Le book : ${desc}. Montrez au comité pourquoi « investment grade » ne veut pas dire « faible volatilité » quand la règle de duration est aussi longue.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? `a) The ruler: ΔP for +${pb(ds)}` : `a) La règle : ΔP pour +${pb(ds)}`,
          enonce: en
            ? `Spread duration ${f(duration, 1)}, spreads widen by ${pb(ds)}. Price impact in % (signed)?`
            : `Spread duration ${f(duration, 1)}, écartement de ${pb(ds)}. Impact prix en % (signé) ?`,
          reponse: dp, tolerance: 0.1, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'ΔP% = −D × Δs/100: module-4 arithmetic, credit shock' : 'ΔP % = −D × Δs/100 : arithmétique du module 4, choc de crédit',
            contenu: en
              ? `−${f(duration, 1)} × ${f(ds, 0)}/100 = **${pct(dp)}**. Same machinery as rate duration, but the shock comes from CREDIT: the spread is a risk class of its own, with its own duration. The module's benchmarks: (4.5, +50 bp) = −2.25%; (7, +300 bp) = −21% — a crisis-sized widening on a long book loses like an equity crash.`
              : `−${f(duration, 1)} × ${f(ds, 0)}/100 = **${pct(dp)}**. La même machinerie que la duration de taux, mais le choc vient du CRÉDIT : le spread est une classe de risque à part entière, avec sa propre duration. Les étalons du module : (4,5, +50 pb) = −2,25 % ; (7, +300 pb) = −21 % — un écartement de crise sur un book long perd comme un krach actions.`,
          }],
          pieges: [en
            ? `Dividing by 10,000 instead of 100 (answering ${pct(r2(dp / 100))}): the formula −D × Δs/100 already takes Δs in BASIS points and returns percent. Check the order of magnitude before sending anything.`
            : `Diviser par 10 000 au lieu de 100 (répondre ${pct(r2(dp / 100))}) : la formule −D × Δs/100 prend déjà Δs en points de BASE et rend des pour cent. Vérifiez l'ordre de grandeur avant d'envoyer quoi que ce soit.`],
        },
        {
          intitule: en ? 'b) The screen: the new price' : "b) L'écran : le nouveau prix",
          enonce: en
            ? `Average book price before the shock: ${f(p0)}. Applying the ΔP of a), what is the new average price, in points?`
            : `Prix moyen du book avant le choc : ${f(p0)}. En appliquant le ΔP du a), quel est le nouveau prix moyen, en points ?`,
          reponse: pNouveau, tolerance: 0.005, unite: 'points',
          etapes: [{
            titre: en ? 'New price = old price × (1 + ΔP/100)' : 'Nouveau prix = ancien prix × (1 + ΔP/100)',
            contenu: en
              ? `${f(p0)} × (1 + ${f(dp)}/100) = **${f(pNouveau)}**. The percentage applies to the CURRENT price, not to par — a book bought at ${f(p0)} loses ${pct(r2(-dp))} of ${f(p0)}, not of 100. And note what did NOT happen: no default, no missed coupon. The mark-to-market loss is pure repricing of the doubt — the m11 lesson of AAA CDOs falling from 100 to 30 before a single realised loss.`
              : `${f(p0)} × (1 + ${f(dp)}/100) = **${f(pNouveau)}**. Le pourcentage s'applique au prix COURANT, pas au pair — un book acheté à ${f(p0)} perd ${pct(r2(-dp))} de ${f(p0)}, pas de 100. Et notez ce qui ne s'est PAS produit : aucun défaut, aucun coupon manqué. La perte mark-to-market est un pur repricing du doute — la leçon du m11, les CDO AAA passés de 100 à 30 avant la moindre perte réalisée.`,
          }],
          pieges: [en
            ? `Computing 100 + ${f(dp)} = ${f(r2(100 + dp))}: the book's average price was ${f(p0)}, not par — the shock lands on the actual mark, and the difference matters exactly when prices are already away from 100.`
            : `Calculer 100 + ${f(dp)} = ${f(r2(100 + dp))} : le prix moyen du book était ${f(p0)}, pas le pair — le choc frappe la valorisation réelle, et la différence compte précisément quand les prix sont déjà loin de 100.`],
        },
        {
          intitule: en ? 'c) The euros: the loss on the book' : 'c) Les euros : la perte sur le book',
          enonce: en
            ? `On the ${mEur(encours, 0)} book, what does the ΔP of a) represent in €m (signed)?`
            : `Sur le book de ${mEur(encours, 0)}, que représente le ΔP du a) en M€ (signé) ?`,
          reponse: perteM, tolerance: 0.005, unite: en ? '€m' : 'M€',
          etapes: [{
            titre: en ? 'Loss = book value × ΔP/100' : 'Perte = valeur du book × ΔP/100',
            contenu: en
              ? `${f(encours, 0)} × ${f(dp)}/100 = **${mEur(perteM)}** — the number the risk manager actually reports upstairs. The chain matters more than each link: basis points (the market's language) → percent (the ruler) → euros (the P&L). A desk junior who can run it in thirty seconds during a gap is worth his seat.`
              : `${f(encours, 0)} × ${f(dp)}/100 = **${mEur(perteM)}** — le nombre que le risk manager remonte réellement à l'étage. La chaîne compte plus que chaque maillon : points de base (la langue du marché) → pour cent (la règle) → euros (le P&L). Le junior de desk qui sait la dérouler en trente secondes pendant un gap vaut sa place.`,
          }],
          pieges: [en
            ? `Applying ΔP to a notional at par rather than to the book's market value: the ${mEur(encours, 0)} ARE the market value here — mixing face value and market value silently rescales the whole P&L.`
            : `Appliquer ΔP à un nominal au pair plutôt qu'à la valeur de marché du book : les ${mEur(encours, 0)} SONT la valeur de marché ici — confondre nominal et valeur de marché rescale tout le P&L en silence.`],
        },
        {
          intitule: en ? `d) The comparison: the equity index at ${pct(-chuteAction, 0)}` : `d) La comparaison : l'indice actions à ${pct(-chuteAction, 0)}`,
          enonce: en
            ? `The equity index lost ${pct(chuteAction, 0)}. What spread widening (in bp) would inflict the SAME percentage loss on your book?`
            : `L'indice actions a perdu ${pct(chuteAction, 0)}. Quel écartement de spread (en pb) infligerait la MÊME perte en pourcentage à votre book ?`,
          reponse: dsEquiv, tolerance: 0.005, unite: en ? 'bp' : 'pb',
          etapes: [
            {
              titre: en ? 'Invert the ruler: Δs = loss/D × 100' : 'Inversez la règle : Δs = perte/D × 100',
              contenu: en
                ? `${f(chuteAction, 0)}/${f(duration, 1)} × 100 = **${pb(dsEquiv)}**. Compare with the actual widening of ${pb(ds)}: ${ds >= dsEquiv ? 'the book is falling FASTER than the equity market — the credit crisis is, today, the bigger of the two' : 'the equity market is still falling faster — but the gap is a number, not an impression'}. That is the point of the exercise: put credit and equities on the same ruler before anyone says "bonds are the safe part".`
                : `${f(chuteAction, 0)}/${f(duration, 1)} × 100 = **${pb(dsEquiv)}**. Comparez à l'écartement réel de ${pb(ds)} : ${ds >= dsEquiv ? 'le book tombe PLUS VITE que le marché actions — la crise de crédit est, aujourd\'hui, la plus grosse des deux' : 'le marché actions tombe encore plus vite — mais l\'écart est un nombre, pas une impression'}. C'est l'objet de l'exercice : mettre crédit et actions sur la même règle avant que quiconque dise « les obligations sont la partie sûre ».`,
            },
            {
              titre: en ? 'Why a HY book loses like equities' : 'Pourquoi un book HY perd comme des actions',
              contenu: en
                ? `Chapter 7's warning made numerical: a 300 bp crisis widening on a spread-duration-7 portfolio costs −21% — equity-crash territory. High yield sits just above equity in the capital queue, and its price behaviour remembers it: same issuers, same recessions, same clusters. The diversification between HY credit and equities is real in calm times and evaporates exactly when it is needed.`
                : `L'avertissement du chapitre 7 rendu numérique : un écartement de crise de 300 pb sur un portefeuille de spread duration 7 coûte −21 % — un territoire de krach actions. Le high yield siège juste au-dessus de l'action dans la file du passif, et son comportement de prix s'en souvient : mêmes émetteurs, mêmes récessions, mêmes grappes. La diversification entre crédit HY et actions est réelle par temps calme et s'évapore exactement quand on en a besoin.`,
            },
          ],
          pieges: [en
            ? `Assuming equities always fall harder: at spread duration ${f(duration, 1)}, only ${pb(dsEquiv)} of widening matches the index's ${pct(chuteAction, 0)} — crisis widenings run to several hundred bp, and the "quiet" asset catches up fast.`
            : `Supposer que les actions tombent toujours plus fort : à spread duration ${f(duration, 1)}, il suffit de ${pb(dsEquiv)} d'écartement pour égaler les ${pct(chuteAction, 0)} de l'indice — les écartements de crise se comptent en centaines de pb, et l'actif « tranquille » rattrape vite.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 7. m5-pb-07 — Le gérant high yield — N2                             */
/* ------------------------------------------------------------------ */
const gerantHy: ProblemeMoule = {
  id: 'm5-pb-07', moduleId: M5,
  titre: "Le gérant high yield : le gros coupon à l'épreuve des défauts",
  titreEn: 'The high yield manager: the big coupon on trial',
  typeDeCas: 'portefeuille',
  typeDeCasEn: 'portfolio',
  difficulte: 2,
  scenarios: ['Milieu de cycle : le portage paie encore', 'Le retournement : la PD attendue a doublé', 'Devant le mur de refinancement : le millésime sous tension'],
  scenariosEn: ['Mid-cycle: the carry still pays', 'The turn: expected PD has doubled', 'Facing the maturity wall: a vintage under stress'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : poids et rendements des deux poches, PD, recouvrement, sans-risque.
    const cfg = ([
      { pdMin: 2, pdMax: 3.5, recMin: 38, recMax: 45, y1Min: 6, y1Max: 7.5, y2Min: 4.5, y2Max: 6 },
      { pdMin: 5, pdMax: 8, recMin: 30, recMax: 40, y1Min: 7, y1Max: 9, y2Min: 5.5, y2Max: 7 },
      { pdMin: 4, pdMax: 7, recMin: 30, recMax: 42, y1Min: 6.5, y1Max: 8.5, y2Min: 5, y2Max: 6.5 },
    ] as const)[sIdx];
    const poids = randInt(rng, 40, 60);
    const y1 = randFloat(rng, cfg.y1Min, cfg.y1Max, 1);
    const y2 = randFloat(rng, cfg.y2Min, cfg.y2Max, 1);
    const pd = randFloat(rng, cfg.pdMin, cfg.pdMax, 1);
    const rec = randInt(rng, cfg.recMin, cfg.recMax);
    const rf = randFloat(rng, 2.5, 3.5, 1);
    const brut = r2((poids * y1 + (100 - poids) * y2) / 100);
    const el = r2(perteAttenduePct(pd, rec));
    // Net chaîné sur les valeurs affichées (brut et EL arrondis), pour un corrigé recomposable.
    const net = r2(brut - el);
    const excedent = r2(net - rf);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `${pct(poids, 0)} of the book in single-B paper yielding ${pct(y1, 1)}, the rest in BB at ${pct(y2, 1)}; expected annual default rate on the book ${pct(pd, 1)}, recovery convention ${pct(rec, 0)}; the risk-free bond of comparable maturity yields ${pct(rf, 1)}`
      : `${pct(poids, 0)} du book en papier single B rendant ${pct(y1, 1)}, le reste en BB à ${pct(y2, 1)} ; taux de défaut annuel attendu du book ${pct(pd, 1)}, convention de recouvrement ${pct(rec, 0)} ; l'emprunt sans risque de maturité comparable rend ${pct(rf, 1)}`;
    const contexte = (en
      ? [
        `Mid-cycle: the primary is open, the covenants are melting year after year, and the marketing deck says "high yield: equity-like returns, bond-like safety". Your book: ${desc}. The investment committee wants the only arithmetic that survives a cycle: gross, expected loss, net — and the verdict against the risk-free.`,
        `The turn has come: the primary shut first, and the default forecasts doubled while your coupons did not move — they are fixed, that is the point AND the trap. The book: ${desc}. Redo the chapter-7 arithmetic with the new PD before the board asks why the "7% asset class" is being questioned.`,
        `In front of the maturity wall: the names in the book must refinance into a closed market, and the desk's default forecast for the vintage is grim. The book: ${desc}. The client sees the big coupon; show him what is left of it after the expected losses — and against the risk-free.`,
      ]
      : [
        `Milieu de cycle : le primaire est ouvert, les covenants fondent d'année en année, et la plaquette commerciale dit « high yield : des rendements d'action, une sécurité d'obligation ». Votre book : ${desc}. Le comité d'investissement veut la seule arithmétique qui survive à un cycle : brut, perte attendue, net — et le verdict contre le sans-risque.`,
        `Le retournement est arrivé : le primaire s'est fermé en premier, et les prévisions de défaut ont doublé pendant que vos coupons ne bougeaient pas — ils sont fixes, c'est le principe ET le piège. Le book : ${desc}. Refaites l'arithmétique du chapitre 7 avec la nouvelle PD avant que le conseil demande pourquoi la « classe d'actifs à 7 % » est remise en cause.`,
        `Devant le mur de refinancement : les noms du book doivent se refinancer sur un marché fermé, et la prévision de défaut du desk pour le millésime est sombre. Le book : ${desc}. Le client voit le gros coupon ; montrez-lui ce qu'il en reste après les pertes attendues — et face au sans-risque.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The shop window: the gross yield' : 'a) La vitrine : le rendement brut',
          enonce: en
            ? `${pct(poids, 0)} of the book yields ${pct(y1, 1)}, the remaining ${pct(r2(100 - poids), 0)} yields ${pct(y2, 1)}. Weighted gross yield of the book, in %?`
            : `${pct(poids, 0)} du book rend ${pct(y1, 1)}, les ${pct(r2(100 - poids), 0)} restants rendent ${pct(y2, 1)}. Rendement brut pondéré du book, en % ?`,
          reponse: brut, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'Gross = Σ weight × yield' : 'Brut = Σ poids × rendement',
            contenu: en
              ? `(${f(poids, 0)} × ${f(y1, 1)} + ${f(r2(100 - poids), 0)} × ${f(y2, 1)})/100 = **${pct(brut)}** — the number on the marketing deck, and the only one the client remembers. It is a PROMISED yield: every coupon in it assumes the issuer survives to pay it. The rest of the problem is the price of that assumption.`
              : `(${f(poids, 0)} × ${f(y1, 1)} + ${f(r2(100 - poids), 0)} × ${f(y2, 1)})/100 = **${pct(brut)}** — le nombre de la plaquette, et le seul que le client retient. C'est un rendement PROMIS : chaque coupon qu'il contient suppose que l'émetteur survit pour le payer. Le reste du problème est le prix de cette hypothèse.`,
          }],
          pieges: [en
            ? `Taking the simple average (${pct(r2((y1 + y2) / 2), 2)}): the buckets are not equal-weighted — ${pct(poids, 0)} against ${pct(r2(100 - poids), 0)}. Weights first, always.`
            : `Prendre la moyenne simple (${pct(r2((y1 + y2) / 2), 2)}) : les poches ne sont pas équipondérées — ${pct(poids, 0)} contre ${pct(r2(100 - poids), 0)}. Les poids d'abord, toujours.`],
        },
        {
          intitule: en ? 'b) The invoice: the expected loss' : 'b) La facture : la perte attendue',
          enonce: en
            ? `Expected default rate ${pct(pd, 1)} per year, recovery ${pct(rec, 0)}. Annual expected credit loss of the book, in % of nominal?`
            : `Taux de défaut attendu ${pct(pd, 1)} par an, recouvrement ${pct(rec, 0)}. Perte de crédit attendue annuelle du book, en % du nominal ?`,
          reponse: el, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'EL = PD × LGD' : 'EL = PD × LGD',
            contenu: en
              ? `${f(pd, 1)} × (1 − ${f(rec, 0)}/100) = **${pct(el)}** per year — the annual toll the book pays to the default cycle, visible or not in this quarter's P&L. Reference: PD 3%, R 40% gives 1.8%. In a good year the toll seems imaginary; over a full cycle it is the most reliable line of the budget.`
              : `${f(pd, 1)} × (1 − ${f(rec, 0)}/100) = **${pct(el)}** par an — le péage annuel que le book paie au cycle des défauts, visible ou non dans le P&L du trimestre. Référence : PD 3 %, R 40 % donne 1,8 %. Une bonne année, le péage semble imaginaire ; sur un cycle complet, c'est la ligne la plus fiable du budget.`,
          }],
          pieges: [en
            ? `Forgetting the recovery and charging the full ${pct(pd, 1)}: at default the book recovers ${pct(rec, 0)} — the loss is PD × LGD, and skipping the LGD overstates the toll by ${f(r2(100 / (100 - rec)), 1)}×.`
            : `Oublier le recouvrement et facturer les ${pct(pd, 1)} entiers : au défaut le book récupère ${pct(rec, 0)} — la perte est PD × LGD, et sauter la LGD surestime le péage d'un facteur ${f(r2(100 / (100 - rec)), 1)}.`],
        },
        {
          intitule: en ? 'c) The truth: the net yield' : 'c) La vérité : le rendement net',
          enonce: en
            ? `Net the gross of a) against the expected loss of b): expected net yield of the book, in %?`
            : `Nettez le brut du a) contre la perte attendue du b) : rendement net attendu du book, en % ?`,
          reponse: net, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'Net = gross − PD × LGD: the only comparable yield' : 'Net = brut − PD × LGD : le seul rendement comparable',
            contenu: en
              ? `${f(brut)} − ${f(el)} = **${pct(net)}**. The chapter-7 anchor: 7% gross with PD 3% and R 40% nets 5.2%; push the PD to 8% and the same book nets 2.2% — below a 3% risk-free, for infinitely more risk. Nothing in the portfolio changed: only the expectation of defaults moved, and the big coupon became an optical illusion.`
              : `${f(brut)} − ${f(el)} = **${pct(net)}**. L'ancre du chapitre 7 : 7 % brut avec PD 3 % et R 40 % nettent 5,2 % ; poussez la PD à 8 % et le même book nette 2,2 % — sous une OAT à 3 %, pour infiniment plus de risque. Rien n'a changé dans le portefeuille : seule l'espérance de défauts a bougé, et le gros coupon est devenu une illusion d'optique.`,
          }],
          pieges: [en
            ? `Comparing the GROSS ${pct(brut)} to the risk-free: the gross is a promise made partly by issuers who will not survive to keep it. Only the net of expected losses is comparable across asset classes.`
            : `Comparer le BRUT ${pct(brut)} au sans-risque : le brut est une promesse faite en partie par des émetteurs qui ne survivront pas pour la tenir. Seul le net des pertes attendues est comparable entre classes d'actifs.`],
        },
        {
          intitule: en ? `d) The verdict: against the risk-free at ${pct(rf, 1)}` : `d) Le verdict : face au sans-risque à ${pct(rf, 1)}`,
          enonce: en
            ? `The risk-free bond yields ${pct(rf, 1)}. Net yield of c) minus the risk-free, in points of % (signed) — and what is the verdict?`
            : `L'emprunt sans risque rend ${pct(rf, 1)}. Rendement net du c) moins le sans-risque, en points de % (signé) — et quel est le verdict ?`,
          reponse: excedent, tolerance: 0.05, toleranceMode: 'absolu', unite: 'points',
          etapes: [
            {
              titre: en ? 'Excess = net − risk-free' : 'Excédent = net − sans-risque',
              contenu: en
                ? `${f(net)} − ${f(rf, 1)} = **${f(excedent)} points**. ${excedent < 0 ? `NEGATIVE: after expected losses, the book pays LESS than the risk-free — the coupon was gross make-up, and the rational move is to refuse the risk until spreads overcompensate again.` : `Positive: the risk is still paid ${f(excedent)} points above the risk-free — but the margin is a forecast, not a fact: it dies the day the PD assumption moves.`} The discipline: this subtraction is recomputed at every revision of the default outlook, not once at purchase.`
                : `${f(net)} − ${f(rf, 1)} = **${f(excedent)} points**. ${excedent < 0 ? `NÉGATIF : après pertes attendues, le book paie MOINS que le sans-risque — le coupon était du maquillage brut, et le geste rationnel est de refuser le risque jusqu'à ce que les spreads surcompensent à nouveau.` : `Positif : le risque est encore payé ${f(excedent)} points au-dessus du sans-risque — mais la marge est une prévision, pas un fait : elle meurt le jour où l'hypothèse de PD bouge.`} La discipline : cette soustraction se refait à chaque révision des perspectives de défaut, pas une fois à l'achat.`,
            },
            {
              titre: en ? 'Where the best vintages are born' : 'Où naissent les meilleurs millésimes',
              contenu: en
                ? `Chapter 7's cycle closes the loop: after the purge, spreads OVERCOMPENSATE the coming losses — the best high yield vintages are built in the fear, when this same subtraction turns massively positive and nobody wants to do it. The manager's job is not to love or hate the coupon: it is to redo this arithmetic when everyone else has stopped.`
                : `Le cycle du chapitre 7 boucle la boucle : après la purge, les spreads SURCOMPENSENT les pertes à venir — les meilleurs millésimes du high yield se construisent dans la peur, quand cette même soustraction devient massivement positive et que personne ne veut la faire. Le métier du gérant n'est pas d'aimer ou de détester le coupon : c'est de refaire cette arithmétique quand tous les autres ont arrêté.`,
            },
          ],
          pieges: [en
            ? `Running the verdict on the gross (${f(brut)} − ${f(rf, 1)} = ${f(r2(brut - rf))} points, always flattering): the gross-based comparison can never turn negative early enough — it is precisely the mistake the 12-18 month default lag punishes.`
            : `Faire le verdict au brut (${f(brut)} − ${f(rf, 1)} = ${f(r2(brut - rf))} points, toujours flatteur) : la comparaison au brut ne peut jamais devenir négative assez tôt — c'est précisément l'erreur que le décalage de 12-18 mois des défauts punit.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 8. m5-pb-08 — L'enchère de règlement — N2                           */
/* ------------------------------------------------------------------ */
const enchereReglement: ProblemeMoule = {
  id: 'm5-pb-08', moduleId: M5,
  titre: "L'enchère de règlement : le jour où R cesse d'être une convention",
  titreEn: 'The settlement auction: the day R stops being a convention',
  typeDeCas: 'couverture',
  typeDeCasEn: 'hedging',
  difficulte: 2,
  scenarios: ['La banque qui tombe : un recouvrement famélique, type Lehman', 'Le corporate industriel : un défaut ordinaire', "Le souverain restructuré : l'enchère après le bras de fer"],
  scenariosEn: ['The failing bank: a skeletal recovery, Lehman-style', 'The industrial corporate: an ordinary default', 'The restructured sovereign: the auction after the standoff'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : recouvrement d'enchère, notionnel, spread payé, trimestres écoulés.
    const cfg = ([
      { recMin: 20, recMax: 32, nMin: 10, nMax: 40, sMin: 150, sMax: 400, qMin: 4, qMax: 10 },
      { recMin: 35, recMax: 55, nMin: 10, nMax: 50, sMin: 100, sMax: 300, qMin: 6, qMax: 12 },
      { recMin: 25, recMax: 45, nMin: 15, nMax: 50, sMin: 200, sMax: 600, qMin: 4, qMax: 12 },
    ] as const)[sIdx];
    const rec = randFloat(rng, cfg.recMin, cfg.recMax, 1);
    const notionnel = randInt(rng, cfg.nMin, cfg.nMax);
    const sCds = randInt(rng, cfg.sMin, cfg.sMax);
    const trimestres = randInt(rng, cfg.qMin, cfg.qMax);
    const lgdPct = r2(100 - rec);
    const paiement = r2(paiementDefautCdsMillions(notionnel, rec));
    const primeAnn = primeCdsAnnuelleEur(notionnel, sCds);
    const primesVersees = r2((trimestres * primeAnn) / 4);
    const pnl = r2(paiement - r2(primesVersees / 1e6));

    const { en, f, pct, pb, eur, mEur } = outils(langue);
    const desc = en
      ? `the desk bought protection on the name ${f(trimestres, 0)} quarters ago: notional ${mEur(notionnel, 0)}, contractual spread ${pb(sCds)}; the ISDA committee has certified the credit event, and the auction just set the recovery at ${pct(rec, 1)} of par`
      : `le desk a acheté de la protection sur le nom il y a ${f(trimestres, 0)} trimestres : notionnel ${mEur(notionnel, 0)}, spread contractuel ${pb(sCds)} ; le comité ISDA a constaté l'événement de crédit, et l'enchère vient de fixer le recouvrement à ${pct(rec, 1)} du pair`;
    const contexte = (en
      ? [
        `A bank failed — and on a bank, the recovery can be almost nothing: Lehman's October 2008 auction set it at 8.625%, and protection sellers paid 91.375% of notional. Your case is gentler but the machine is the same: ${desc}. Walk the settlement through: the loss fixed by the auction, the sellers' payment, and your desk's final P&L.`,
        `An industrial corporate defaults — the ordinary kind of death the CDS market was built for. Weeks after the event, the dealers quote the defaulted bonds in the organised auction and one number becomes binding for every contract on the name: ${desc}. Compute the settlement chain to the desk's P&L.`,
        `A sovereign restructures: after months of standoff, the committee rules the restructuring a credit event, and the auction prices what the new bonds are worth against the old promise: ${desc}. Same machine as a corporate — one auction, one recovery, every contract settled at once. Run it through.`,
      ]
      : [
        `Une banque est tombée — et sur une banque, le recouvrement peut n'être presque rien : l'enchère Lehman d'octobre 2008 l'a fixé à 8,625 %, et les vendeurs de protection ont payé 91,375 % du notionnel. Votre cas est plus doux mais la machine est la même : ${desc}. Déroulez le règlement : la perte fixée par l'enchère, le paiement des vendeurs, et le P&L final de votre desk.`,
        `Un corporate industriel fait défaut — la mort ordinaire pour laquelle le marché des CDS a été construit. Quelques semaines après l'événement, les dealers cotent les obligations en défaut dans l'enchère organisée et un seul nombre devient opposable à tous les contrats du nom : ${desc}. Calculez la chaîne de règlement jusqu'au P&L du desk.`,
        `Un souverain restructure : après des mois de bras de fer, le comité qualifie la restructuration d'événement de crédit, et l'enchère price ce que valent les nouveaux titres contre l'ancienne promesse : ${desc}. La même machine qu'un corporate — une enchère, un recouvrement, tous les contrats réglés d'un coup. Déroulez.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The auction speaks: the LGD' : "a) L'enchère parle : la LGD",
          enonce: en
            ? `The auction sets the recovery at ${pct(rec, 1)} of par. What loss given default does that fix, in % of notional?`
            : `L'enchère fixe le recouvrement à ${pct(rec, 1)} du pair. Quelle perte en cas de défaut cela fige-t-il, en % du notionnel ?`,
          reponse: lgdPct, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'LGD = 100 − R, and it is now official' : 'LGD = 100 − R, et c\'est désormais officiel',
            contenu: en
              ? `100 − ${f(rec, 1)} = **${pct(lgdPct, 1)}**. The auction's role is exactly this: turn a convention into a FACT. Weeks after the event, dealers quote the defaulted bonds in an organised process, and the resulting price binds every contract on the name at once — without it, thousands of OTC contracts would each have their own litigation. Lehman's benchmark: R = 8.625%, LGD = 91.375% — the "R ≈ 40%" convention is a calm-times average, not a law, and on banks it fails worst.`
              : `100 − ${f(rec, 1)} = **${pct(lgdPct, 1)}**. Le rôle de l'enchère est exactement celui-là : transformer une convention en FAIT. Quelques semaines après l'événement, les dealers cotent les obligations en défaut dans un processus organisé, et le prix qui en sort s'impose à tous les contrats du nom d'un coup — sans lui, des milliers de contrats de gré à gré auraient chacun leur litige. L'étalon Lehman : R = 8,625 %, LGD = 91,375 % — la convention « R ≈ 40 % » est une moyenne de temps calme, pas une loi, et sur les banques elle échoue le plus.`,
          }],
          pieges: [en
            ? `Keeping the desk's R = 40% convention for the settlement: pricing conventions die at the credit event — only the AUCTION recovery of ${pct(rec, 1)} settles contracts.`
            : `Garder la convention R = 40 % du desk pour le règlement : les conventions de pricing meurent à l'événement de crédit — seul le recouvrement d'ENCHÈRE de ${pct(rec, 1)} règle les contrats.`],
        },
        {
          intitule: en ? "b) The sellers' payment" : 'b) Le paiement des vendeurs',
          enonce: en
            ? `On the ${mEur(notionnel, 0)} notional, how much do the protection sellers pay at settlement, in €m?`
            : `Sur le notionnel de ${mEur(notionnel, 0)}, combien les vendeurs de protection paient-ils au règlement, en M€ ?`,
          reponse: paiement, tolerance: 0.005, unite: en ? '€m' : 'M€',
          etapes: [{
            titre: en ? 'Payment = notional × LGD/100' : 'Paiement = notionnel × LGD/100',
            contenu: en
              ? `${f(notionnel, 0)} × ${f(lgdPct, 1)}/100 = **${mEur(paiement)}** — the loss, never the notional. And keep Lehman's second lesson: despite tens of billions of GROSS notionals on the name, net settlements came to about \\$5.2bn — the offsetting of bought and sold positions had already absorbed the bulk. The CDS machine worked; it was the concentrated seller (AIG) that failed, not the mechanism.`
              : `${f(notionnel, 0)} × ${f(lgdPct, 1)}/100 = **${mEur(paiement)}** — la perte, jamais le notionnel. Et gardez la seconde leçon de Lehman : malgré des dizaines de milliards de notionnels BRUTS sur le nom, les règlements nets n'ont représenté qu'environ 5,2 Md\\$ — la compensation des positions acheteuses et vendeuses avait déjà absorbé l'essentiel. La machine CDS a fonctionné ; c'est le vendeur concentré (AIG) qui a failli, pas le mécanisme.`,
          }],
          pieges: [en
            ? `Paying the full ${mEur(notionnel, 0)}: the buyer also gets the recovery value through the settlement — the seller only makes up the missing ${pct(lgdPct, 1)}.`
            : `Payer les ${mEur(notionnel, 0)} entiers : l'acheteur récupère aussi la valeur de recouvrement via le règlement — le vendeur ne comble que les ${pct(lgdPct, 1)} manquants.`],
        },
        {
          intitule: en ? 'c) What the protection cost: the premiums paid' : 'c) Ce que la protection a coûté : les primes versées',
          enonce: en
            ? `The desk paid the ${pb(sCds)} spread for ${f(trimestres, 0)} quarters. Total premiums paid since inception, in €?`
            : `Le desk a payé le spread de ${pb(sCds)} pendant ${f(trimestres, 0)} trimestres. Total des primes versées depuis l'origine, en € ?`,
          reponse: primesVersees, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'Premiums = quarters × (notional × s/10,000)/4' : 'Primes = trimestres × (notionnel × s/10 000)/4',
            contenu: en
              ? `Annual leg = ${f(notionnel, 0)}m × ${f(sCds, 0)}/10,000 = ${eur(primeAnn)}; per quarter ${eur(r2(primeAnn / 4))}; over ${f(trimestres, 0)} quarters: **${eur(primesVersees)}**. The premiums stop at the credit event (prorated in reality — full quarters here). This is the price of sleeping insured for ${f(r2(trimestres / 4), 2)} years.`
              : `Jambe annuelle = ${f(notionnel, 0)} M × ${f(sCds, 0)}/10 000 = ${eur(primeAnn)} ; par trimestre ${eur(r2(primeAnn / 4))} ; sur ${f(trimestres, 0)} trimestres : **${eur(primesVersees)}**. Les primes s'arrêtent à l'événement de crédit (au prorata en réalité — trimestres pleins ici). C'est le prix d'avoir dormi assuré pendant ${f(r2(trimestres / 4), 2)} ans.`,
          }],
          pieges: [en
            ? `Counting ${f(trimestres, 0)} YEARS of premium instead of quarters: the market pays quarterly on the standard dates — ${f(trimestres, 0)} quarters are ${f(r2(trimestres / 4), 2)} years of annual legs.`
            : `Compter ${f(trimestres, 0)} ANNÉES de prime au lieu de trimestres : le marché paie trimestriellement aux dates standardisées — ${f(trimestres, 0)} trimestres font ${f(r2(trimestres / 4), 2)} ans de jambes annuelles.`],
        },
        {
          intitule: en ? "d) The desk's P&L on the protection" : 'd) Le P&L du desk sur la protection',
          enonce: en
            ? `Net the settlement of b) against the premiums of c): the desk's P&L on the CDS, in €m?`
            : `Nettez le règlement du b) contre les primes du c) : le P&L du desk sur le CDS, en M€ ?`,
          reponse: pnl, tolerance: 0.005, unite: en ? '€m' : 'M€',
          etapes: [
            {
              titre: en ? 'P&L = payment received − premiums paid' : 'P&L = paiement reçu − primes versées',
              contenu: en
                ? `${f(paiement)} − ${f(r2(primesVersees / 1e6))} = **${mEur(pnl)}**. Received once, massively; paid small and quarterly — the buyer's insurance profile realised. The seller books the exact mirror: ${mEur(r2(-pnl))}.`
                : `${f(paiement)} − ${f(r2(primesVersees / 1e6))} = **${mEur(pnl)}**. Reçu une fois, massivement ; payé petit et trimestriellement — le profil d'assurance de l'acheteur, réalisé. Le vendeur enregistre le miroir exact : ${mEur(r2(-pnl))}.`,
            },
            {
              titre: en ? 'Hedge or bet: the same number, two meanings' : 'Couverture ou pari : le même nombre, deux sens',
              contenu: en
                ? `If the desk also held ${mEur(notionnel, 0)} of the bonds, this ${mEur(pnl)} is not a win: the bonds just lost roughly the same LGD — the CDS turned a disaster into a wash, which is what a hedge IS. If the desk held nothing (no insurable interest required), the same number is the payoff of a short credit position. The instrument does not know which one you were; your risk committee had better.`
                : `Si le desk détenait aussi ${mEur(notionnel, 0)} des obligations, ces ${mEur(pnl)} ne sont pas un gain : les obligations viennent de perdre à peu près la même LGD — le CDS a transformé un désastre en opération blanche, ce qui est la définition d'une couverture. Si le desk ne détenait rien (aucun intérêt assurable requis), le même nombre est le payoff d'une position courte crédit. L'instrument ne sait pas lequel des deux vous étiez ; votre comité des risques, lui, a intérêt à le savoir.`,
            },
          ],
          pieges: [en
            ? `Calling ${mEur(pnl)} a "profit" without asking what the desk held: against a bond position it merely offsets the loss — reading a hedge's payoff as alpha is how risk reports lie.`
            : `Appeler ${mEur(pnl)} un « gain » sans demander ce que le desk détenait : contre une position obligataire, il ne fait que compenser la perte — lire le payoff d'une couverture comme de l'alpha, c'est ainsi que mentent les rapports de risque.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 9. m5-pb-09 — La base négative — N2                                 */
/* ------------------------------------------------------------------ */
const baseNegative: ProblemeMoule = {
  id: 'm5-pb-09', moduleId: M5,
  titre: "La base négative : l'arbitrage qui meurt d'un appel de marge",
  titreEn: 'The negative basis: the arbitrage that dies of a margin call',
  typeDeCas: 'lecture de marché',
  typeDeCasEn: 'market reading',
  difficulte: 2,
  scenarios: ['Le prop desk monte le trade : obligation + CDS, gain « verrouillé »', "Tension sur le marché : la base s'ouvre, le financement se tend", "Le fonds de base : l'arbitrage industrialisé, financé en repo"],
  scenariosEn: ['The prop desk puts on the trade: bond + CDS, gain "locked in"', 'Market stress: the basis gapes, funding tightens', 'The basis fund: the arbitrage industrialised, funded in repo'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : spread cash, magnitude de la base, notionnel, tension du repo, duration, écartement.
    const cfg = ([
      { scMin: 220, scMax: 380, bMin: 20, bMax: 50, nMin: 10, nMax: 30, xSupMin: 20, xSupMax: 60, dMin: 4, dMax: 6, dsMin: 80, dsMax: 180 },
      { scMin: 350, scMax: 600, bMin: 50, bMax: 100, nMin: 10, nMax: 25, xSupMin: 40, xSupMax: 80, dMin: 4, dMax: 7, dsMin: 120, dsMax: 250 },
      { scMin: 200, scMax: 400, bMin: 25, bMax: 60, nMin: 20, nMax: 40, xSupMin: 20, xSupMax: 70, dMin: 4.5, dMax: 7, dsMin: 80, dsMax: 200 },
    ] as const)[sIdx];
    const sCash = randInt(rng, cfg.scMin, cfg.scMax);
    const baseMag = randInt(rng, cfg.bMin, cfg.bMax);
    const notionnel = randInt(rng, cfg.nMin, cfg.nMax);
    const xFin = baseMag + randInt(rng, cfg.xSupMin, cfg.xSupMax);
    const duration = randFloat(rng, cfg.dMin, cfg.dMax, 1);
    const dsBond = randInt(rng, cfg.dsMin, cfg.dsMax);
    const sCds = sCash - baseMag;
    const base = r2(baseCdsPb(sCds, sCash));
    const portage = r2(primeCdsAnnuelleEur(notionnel, baseMag));
    const portageApres = r2(primeCdsAnnuelleEur(notionnel, baseMag - xFin));
    const dpBond = r2(variationPrixSpreadPct(duration, dsBond));
    const appelMarge = r2((notionnel * -dpBond) / 100);

    const { en, f, pct, pb, eur, mEur } = outils(langue);
    const desc = en
      ? `the bond trades at a spread of ${pb(sCash)}, the 5-year CDS on the same name quotes ${pb(sCds)}; candidate position: buy ${mEur(notionnel, 0)} of the bond, financed in repo, and buy CDS protection on the same notional (spread duration of the bond ${f(duration, 1)})`
      : `l'obligation traite à un spread de ${pb(sCash)}, le CDS 5 ans sur le même nom cote ${pb(sCds)} ; position candidate : acheter ${mEur(notionnel, 0)} de l'obligation, financée en repo, et acheter la protection CDS sur le même notionnel (spread duration de l'obligation ${f(duration, 1)})`;
    const contexte = (en
      ? [
        `The prop desk's whiteboard says "free money": same default, two markets, and the insurance costs less than the spread it insures. The setup: ${desc}. The head trader has survived one cycle too many to sign without numbers: the basis, the theoretical carry, what a funding squeeze does to it — and the margin call that arrives before any convergence.`,
        `Stress is spreading: cash bonds cheapen faster than CDS — forced sellers live in the bond market, not the derivative — and the basis gapes: ${desc}. On paper, historic opportunity; in practice, everyone who could pick it up is deleveraging. Quantify the trade AND its killers.`,
        `The basis fund does this for a living: hundreds of lines of bond + CDS, financed in repo, levered — the m7/LTCM family of convergence trades. A new line: ${desc}. The risk committee wants the four numbers: basis, carry, carry under funding stress, and the day-one margin call if spreads gap.`,
      ]
      : [
        `Le tableau blanc du prop desk dit « argent gratuit » : le même défaut, deux marchés, et l'assurance coûte moins cher que le spread qu'elle assure. Le montage : ${desc}. Le chef de desk a survécu à un cycle de trop pour signer sans chiffres : la base, le portage théorique, ce qu'une tension du financement en fait — et l'appel de marge qui arrive avant toute convergence.`,
        `Le stress se propage : les obligations cash se déprécient plus vite que les CDS — les vendeurs forcés vivent sur le marché obligataire, pas sur le dérivé — et la base s'ouvre : ${desc}. Sur le papier, opportunité historique ; en pratique, tous ceux qui pourraient la ramasser se désendettent. Chiffrez le trade ET ses tueurs.`,
        `Le fonds de base fait cela pour vivre : des centaines de lignes obligation + CDS, financées en repo, leviérées — la famille des trades de convergence du m7 et de LTCM. Une ligne nouvelle : ${desc}. Le comité des risques veut les quatre nombres : base, portage, portage sous stress de financement, et l'appel de marge du premier jour si les spreads sautent.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The anomaly: the basis' : "a) L'anomalie : la base",
          enonce: en
            ? `CDS at ${pb(sCds)}, cash bond spread ${pb(sCash)}. What is the CDS-cash basis, in bp (signed)?`
            : `CDS à ${pb(sCds)}, spread obligataire ${pb(sCash)}. Quelle est la base CDS-cash, en pb (signée) ?`,
          reponse: base, tolerance: 0.5, toleranceMode: 'absolu', unite: en ? 'bp' : 'pb',
          etapes: [{
            titre: en ? 'Basis = CDS spread − bond spread' : 'Base = spread CDS − spread obligataire',
            contenu: en
              ? `${f(sCds, 0)} − ${f(sCash, 0)} = **${pb(base)}**: NEGATIVE — the protection costs ${pb(baseMag)} LESS than the spread the bond pays for the same default. In a frictionless world this cannot last: buy the bond, buy the protection, collect the difference with no credit risk. The word "frictionless" is where the rest of the problem lives.`
              : `${f(sCds, 0)} − ${f(sCash, 0)} = **${pb(base)}** : NÉGATIVE — la protection coûte ${pb(baseMag)} de MOINS que le spread que l'obligation paie pour le même défaut. Dans un monde sans frictions, cela ne peut pas durer : acheter l'obligation, acheter la protection, empocher la différence sans risque de crédit. Le mot « sans frictions » est là où vit le reste du problème.`,
          }],
          pieges: [en
            ? `Computing bond − CDS = +${pb(baseMag)}: the convention is CDS MINUS cash — the sign carries the diagnosis (negative: the bond is cheap versus its own insurance), and desks communicate by that sign.`
            : `Calculer obligation − CDS = +${pb(baseMag)} : la convention est CDS MOINS cash — le signe porte le diagnostic (négative : l'obligation est bon marché face à sa propre assurance), et les desks communiquent par ce signe.`],
        },
        {
          intitule: en ? 'b) The promise: the theoretical carry' : 'b) La promesse : le portage théorique',
          enonce: en
            ? `On ${mEur(notionnel, 0)}, what does locking the |basis| of a) earn per year in theory, in €?`
            : `Sur ${mEur(notionnel, 0)}, que rapporte en théorie le verrouillage de la |base| du a) par an, en € ?`,
          reponse: portage, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'Carry = notional × |basis|/10,000' : 'Portage = notionnel × |base|/10 000',
            contenu: en
              ? `${f(notionnel, 0)}m × ${f(baseMag, 0)}/10,000 = **${eur(portage)}** per year: the bond pays ${pb(sCash)}, the protection costs ${pb(sCds)}, and the default is fully covered — if the issuer dies, the CDS makes the position whole. Note the precision: risk-free OF CREDIT. The financing, the margins and the mark-to-market were never insured — and they are exactly what questions c) and d) price.`
              : `${f(notionnel, 0)} M × ${f(baseMag, 0)}/10 000 = **${eur(portage)}** par an : l'obligation paie ${pb(sCash)}, la protection coûte ${pb(sCds)}, et le défaut est intégralement couvert — si l'émetteur meurt, le CDS reconstitue la position. Notez la précision : sans risque DE CRÉDIT. Le financement, les marges et le mark-to-market n'ont jamais été assurés — et c'est exactement ce que les questions c) et d) pricent.`,
          }],
          pieges: [en
            ? `Reading "no credit risk" as "no risk": the trade holds a repo-financed bond marked to market daily. The basis converging AT MATURITY says nothing about the path — and the path is funded.`
            : `Lire « sans risque de crédit » comme « sans risque » : le trade porte une obligation financée en repo et valorisée chaque jour. Que la base converge À MATURITÉ ne dit rien du chemin — et le chemin se finance.`],
        },
        {
          intitule: en ? `c) Killer one: funding tightens by ${pb(xFin)}` : `c) Premier tueur : le financement se tend de ${pb(xFin)}`,
          enonce: en
            ? `Stress: the repo cost of carrying the bond rises by ${pb(xFin)}. What is the trade's NEW annual carry on ${mEur(notionnel, 0)}, in € (signed)?`
            : `Stress : le coût repo du portage de l'obligation monte de ${pb(xFin)}. Quel est le NOUVEAU portage annuel du trade sur ${mEur(notionnel, 0)}, en € (signé) ?`,
          reponse: portageApres, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'New carry = notional × (|basis| − funding shock)/10,000' : 'Nouveau portage = notionnel × (|base| − tension)/10 000',
            contenu: en
              ? `(${f(baseMag, 0)} − ${f(xFin, 0)}) = ${pb(baseMag - xFin)} of net carry, i.e. ${f(notionnel, 0)}m × (${f(baseMag - xFin, 0)})/10,000 = **${eur(portageApres)}** per year: the "locked" gain is now a certain LOSS as long as the position is held. The arbitrage's margin was ${pb(baseMag)}; the funding market repriced by more than that with one move. Basis trades are short a funding option they never priced — m7's lesson, LTCM's epitaph.`
              : `(${f(baseMag, 0)} − ${f(xFin, 0)}) = ${pb(baseMag - xFin)} de portage net, soit ${f(notionnel, 0)} M × (${f(baseMag - xFin, 0)})/10 000 = **${eur(portageApres)}** par an : le gain « verrouillé » est désormais une perte certaine tant que la position est portée. La marge de l'arbitrage était de ${pb(baseMag)} ; le marché du financement a repricé davantage en un seul mouvement. Les trades de base sont courts d'une option de financement qu'ils n'ont jamais pricée — la leçon du m7, l'épitaphe de LTCM.`,
          }],
          pieges: [en
            ? `Treating the repo cost as fixed for the life of the trade: repo is rolled DAILY or weekly — the basis is locked to maturity, the funding never is. The mismatch of those two horizons is the whole risk.`
            : `Traiter le coût repo comme fixe sur la vie du trade : le repo se renouvelle CHAQUE JOUR ou chaque semaine — la base est verrouillée jusqu'à maturité, le financement jamais. Le décalage de ces deux horizons est tout le risque.`],
        },
        {
          intitule: en ? `d) Killer two: the margin call on a ${pb(dsBond)} gap` : `d) Second tueur : l'appel de marge sur un saut de ${pb(dsBond)}`,
          enonce: en
            ? `The bond's spread gaps ${pb(dsBond)} wider (the basis opens further — the CDS barely moves). With a spread duration of ${f(duration, 1)}, what margin does the repo lender call on the ${mEur(notionnel, 0)} TODAY, in €m?`
            : `Le spread de l'obligation saute de ${pb(dsBond)} (la base s'ouvre encore — le CDS bouge à peine). Avec une spread duration de ${f(duration, 1)}, quelle marge le prêteur repo appelle-t-il sur les ${mEur(notionnel, 0)} AUJOURD'HUI, en M€ ?`,
          reponse: appelMarge, tolerance: 0.005, unite: en ? '€m' : 'M€',
          etapes: [
            {
              titre: en ? 'Margin = |−D × Δs/100| × notional' : 'Marge = |−D × Δs/100| × notionnel',
              contenu: en
                ? `Bond price move: −${f(duration, 1)} × ${f(dsBond, 0)}/100 = ${pct(dpBond)}; on ${mEur(notionnel, 0)} of collateral, the repo lender calls **${mEur(appelMarge)}** in cash, today. Note the poison: the wider basis means the trade is MORE profitable at maturity than when it was put on — and it is precisely now that it demands cash.`
                : `Variation de prix de l'obligation : −${f(duration, 1)} × ${f(dsBond, 0)}/100 = ${pct(dpBond)} ; sur ${mEur(notionnel, 0)} de collatéral, le prêteur repo appelle **${mEur(appelMarge)}** de cash, aujourd'hui. Notez le poison : la base plus large rend le trade PLUS rentable à maturité qu'au montage — et c'est précisément maintenant qu'il réclame du cash.`,
            },
            {
              titre: en ? 'Why the trade dies before it converges' : 'Pourquoi le trade meurt avant de converger',
              contenu: en
                ? `Weigh the two numbers: the carry promised ${eur(portage)} PER YEAR; the margin call demands ${mEur(appelMarge)} TODAY — years of theoretical carry, called in one afternoon. A levered fund that cannot post sells the position into the very market that is gapping, realising the loss and widening the basis for the next fund: the fire-sale spiral, in the arbitrage aisle. "The market can stay irrational longer than you can stay solvent" is not a proverb here; it is the cash-flow schedule.`
                : `Pesez les deux nombres : le portage promettait ${eur(portage)} PAR AN ; l'appel de marge exige ${mEur(appelMarge)} AUJOURD'HUI — des années de portage théorique, appelées en un après-midi. Le fonds leviéré qui ne peut pas poster vend la position dans le marché même qui saute, réalise la perte et élargit la base pour le fonds suivant : la spirale de vente forcée, au rayon arbitrage. « Le marché peut rester irrationnel plus longtemps que vous ne pouvez rester solvable » n'est pas un proverbe ici ; c'est l'échéancier de trésorerie.`,
            },
          ],
          pieges: [en
            ? `Netting the margin call against the CDS gain: the CDS mark-to-market gain is collateral posted TO you over time, on another agreement, with another counterparty — the repo call is cash due TODAY. Liquidity does not net across desks in a crisis.`
            : `Netter l'appel de marge contre le gain du CDS : le gain mark-to-market du CDS est du collatéral posté VERS vous dans le temps, sur un autre contrat, avec une autre contrepartie — l'appel repo est du cash dû AUJOURD'HUI. La liquidité ne se nette pas entre desks dans une crise.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 10. m5-pb-10 — Le portefeuille titrisé — N2                         */
/* ------------------------------------------------------------------ */
const portefeuilleTitrise: ProblemeMoule = {
  id: 'm5-pb-10', moduleId: M5,
  titre: 'Le portefeuille titrisé : trois tranches sous les pertes',
  titreEn: 'The securitised portfolio: three tranches under losses',
  typeDeCas: 'titrisation',
  typeDeCasEn: 'securitisation',
  difficulte: 2,
  scenarios: ['Le CDO de manuel : la structure canonique 0-3/3-6/6-100 sous stress', 'Le millésime maudit : quand les pertes traversent la mezzanine', "Le comité d'investissement : faut-il acheter la mezzanine ?"],
  scenariosEn: ['The textbook CDO: the canonical 0-3/3-6/6-100 structure under stress', 'The cursed vintage: when losses cut through the mezzanine', 'The investment committee: should we buy the mezzanine?'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Structure canonique fixe 0-3 / 3-6 / 6-100 ; bornes par scénario : pertes L, recouvrement du pool.
    const cfg = ([
      { lMin: 3.6, lMax: 5.6, recMin: 40, recMax: 55 },
      { lMin: 6.3, lMax: 8.5, recMin: 40, recMax: 60 },
      { lMin: 4, lMax: 5.8, recMin: 45, recMax: 60 },
    ] as const)[sIdx];
    const pertes = randFloat(rng, cfg.lMin, cfg.lMax, 1);
    const rec = randInt(rng, cfg.recMin, cfg.recMax);
    const perteEq = r2(perteTranchePct(pertes, 0, 3));
    const perteMezz = r2(perteTranchePct(pertes, 3, 6));
    const perteSen = r2(perteTranchePct(pertes, 6, 100));
    const seuilDefauts = r2((100 * 6) / (100 - rec));

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `capital structure: equity 0-3%, mezzanine 3-6%, senior 6-100%; stress scenario on the table: cumulative pool losses L = ${pct(pertes, 1)}; recovery on the pool's defaulted loans: ${pct(rec, 0)}`
      : `structure du passif : equity 0-3 %, mezzanine 3-6 %, senior 6-100 % ; scénario de stress sur la table : pertes cumulées du pool L = ${pct(pertes, 1)} ; recouvrement sur les prêts en défaut du pool : ${pct(rec, 0)}`;
    const contexte = (en
      ? [
        `The canonical structure of chapter 6, stress-tested by the risk committee: ${desc}. Three investors bought three different promises out of the SAME pool — walk each layer through the loss, then find the default rate that erases the middle one entirely.`,
        `The cursed vintage: the pool's losses came in far above every model — the correlated cluster the tranching assumed away: ${desc}. Compute what is left of each layer, and the default threshold that the "prudent" buyers of the mezzanine should have computed on day one.`,
        `The investment committee meets on the mezzanine: the yield is tempting, the attachment point "comfortable". Your stress case: ${desc}. The only honest answer is the full waterfall — all three tranches — plus the default rate at which the mezzanine ceases to exist.`,
      ]
      : [
        `La structure canonique du chapitre 6, stress-testée par le comité des risques : ${desc}. Trois investisseurs ont acheté trois promesses différentes sur le MÊME pool — faites traverser la perte à chaque couche, puis trouvez le taux de défaut qui efface entièrement celle du milieu.`,
        `Le millésime maudit : les pertes du pool sont sorties très au-dessus de tous les modèles — la grappe corrélée que le tranchage supposait absente : ${desc}. Calculez ce qui reste de chaque couche, et le seuil de défauts que les acheteurs « prudents » de la mezzanine auraient dû calculer le premier jour.`,
        `Le comité d'investissement se réunit sur la mezzanine : le rendement est tentant, le point d'attache « confortable ». Votre cas de stress : ${desc}. La seule réponse honnête est la cascade complète — les trois tranches — plus le taux de défaut auquel la mezzanine cesse d'exister.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? `a) The shock absorber: the 0-3% equity at L = ${pct(pertes, 1)}` : `a) L'amortisseur : l'equity 0-3 % à L = ${pct(pertes, 1)}`,
          enonce: en
            ? `Pool losses reach L = ${pct(pertes, 1)}. Loss of the equity tranche (0-3%), in % of ITS notional?`
            : `Les pertes du pool atteignent L = ${pct(pertes, 1)}. Perte de la tranche equity (0-3 %), en % de SON notionnel ?`,
          reponse: perteEq, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'clamp((L − 0)/(3 − 0)) × 100: capped at 100' : 'clamp((L − 0)/(3 − 0)) × 100 : plafonné à 100',
            contenu: en
              ? `L = ${f(pertes, 1)} ≥ 3, so the equity is at **${pct(perteEq, 0)}** — wiped out, as it already was the moment L crossed 3%. Its destruction is not an accident of this scenario: the first-loss tranche is DESIGNED to die first, and it was half-gone at L = 1.5%. Whoever held it was paid — richly, in good vintages — precisely for standing here.`
              : `L = ${f(pertes, 1)} ≥ 3, donc l'equity est à **${pct(perteEq, 0)}** — rasée, comme elle l'était déjà à l'instant où L a franchi 3 %. Sa destruction n'est pas un accident de ce scénario : la tranche de première perte est CONÇUE pour mourir la première, et elle était à moitié détruite dès L = 1,5 %. Celui qui la portait était payé — grassement, dans les bons millésimes — précisément pour se tenir là.`,
          }],
          pieges: [en
            ? `Answering L = ${pct(pertes, 1)}: the tranche's loss is measured against its OWN 3-point thickness, not against the pool — at L = ${pct(pertes, 1)} the clamp has been sitting at 100% for a while.`
            : `Répondre L = ${pct(pertes, 1)} : la perte de la tranche se mesure contre sa PROPRE épaisseur de 3 points, pas contre le pool — à L = ${pct(pertes, 1)}, le clamp est à 100 % depuis un moment.`],
        },
        {
          intitule: en ? 'b) The middle: the 3-6% mezzanine' : 'b) Le milieu : la mezzanine 3-6 %',
          enonce: en
            ? `Same L. Loss of the mezzanine (3-6%), in % of ITS notional?`
            : `Même L. Perte de la mezzanine (3-6 %), en % de SON notionnel ?`,
          reponse: perteMezz, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? '(L − 3)/(6 − 3) × 100, clamped to [0, 100]' : '(L − 3)/(6 − 3) × 100, borné à [0, 100]',
            contenu: en
              ? `(${f(pertes, 1)} − 3)/3 × 100 ${pertes >= 6 ? 'caps at' : 'gives'} **${pct(perteMezz)}**. ${pertes >= 6 ? `L = ${f(pertes, 1)} sits beyond the 6% detachment: the mezzanine no longer exists — the layer bought as "protected by 3 points of subordination" is as dead as the equity.` : `The module's anchor sits right here: at L = 5%, the 3-6% mezzanine has lost 66.67% — the pool loses "only" ${f(pertes, 1)}%, the tranche loses ${f(perteMezz, 0)}%. Between 3 and 6, every extra point of pool loss destroys a third of the tranche: a 33-to-1 sensitivity, leverage without borrowing.`}`
              : `(${f(pertes, 1)} − 3)/3 × 100 ${pertes >= 6 ? 'plafonne à' : 'donne'} **${pct(perteMezz)}**. ${pertes >= 6 ? `L = ${f(pertes, 1)} dépasse le détachement de 6 % : la mezzanine n'existe plus — la couche achetée comme « protégée par 3 points de subordination » est aussi morte que l'equity.` : `L'ancre du module est exactement ici : à L = 5 %, la mezzanine 3-6 % a perdu 66,67 % — le pool ne perd « que » ${f(pertes, 1)} %, la tranche perd ${f(perteMezz, 0)} %. Entre 3 et 6, chaque point de perte du pool supplémentaire détruit un tiers de la tranche : une sensibilité de 33 pour 1, du levier sans emprunt.`}`,
          }],
          pieges: [en
            ? `Reporting L − 3 = ${pct(r2(pertes - 3), 1)}: that is a share of the POOL. The mezzanine's denominator is its own 3-point thickness — normalise before quoting a tranche loss.`
            : `Rapporter L − 3 = ${pct(r2(pertes - 3), 1)} : c'est une part du POOL. Le dénominateur de la mezzanine est sa propre épaisseur de 3 points — normalisez avant de citer une perte de tranche.`],
        },
        {
          intitule: en ? 'c) The top: the 6-100% senior' : 'c) Le sommet : le senior 6-100 %',
          enonce: en
            ? `Same L. Loss of the senior tranche (6-100%), in % of ITS notional?`
            : `Même L. Perte de la tranche senior (6-100 %), en % de SON notionnel ?`,
          reponse: perteSen, tolerance: 0.1, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? '(L − 6)/(100 − 6) × 100, floored at 0' : '(L − 6)/(100 − 6) × 100, plancher à 0',
            contenu: en
              ? `${pertes > 6 ? `(${f(pertes, 1)} − 6)/94 × 100 = **${pct(perteSen)}** — small against its notional, but measure the event: the layer whose rating "excluded" this scenario is taking realised losses. In 2008, senior CDO tranches fell from 100 to 30 on MARKET value long before realised losses arrived — the falaise is priced before it is suffered.` : `L = ${f(pertes, 1)} < 6: the senior is at **${pct(perteSen, 0)}** — intact, and that is the whole point of subordination: ${f(pertes, 1)} points of pool losses were entirely absorbed below it. But "intact at ${pct(pertes, 1)}" is a statement about THIS L, not a property of the tranche: at L = 6.01%, the same senior starts bleeding.`}`
              : `${pertes > 6 ? `(${f(pertes, 1)} − 6)/94 × 100 = **${pct(perteSen)}** — petit contre son notionnel, mais mesurez l'événement : la couche dont la notation « excluait » ce scénario prend des pertes réalisées. En 2008, des tranches senior de CDO sont passées de 100 à 30 en valeur de MARCHÉ bien avant les pertes réalisées — la falaise se price avant de se subir.` : `L = ${f(pertes, 1)} < 6 : le senior est à **${pct(perteSen, 0)}** — intact, et c'est tout l'objet de la subordination : ${f(pertes, 1)} points de pertes du pool ont été entièrement absorbés en dessous de lui. Mais « intact à ${pct(pertes, 1)} » est un énoncé sur CE L, pas une propriété de la tranche : à L = 6,01 %, le même senior commence à saigner.`}`,
          }],
          pieges: [en
            ? `Confusing "senior" with "risk-free": the tranche is safe UNTIL the 6% detachment of the layer below — one correlation assumption away. The AAA of a CDO is a statement about a model of L, not about the world.`
            : `Confondre « senior » et « sans risque » : la tranche est sûre JUSQU'AU détachement de 6 % de la couche du dessous — à une hypothèse de corrélation près. Le AAA d'un CDO est un énoncé sur un modèle de L, pas sur le monde.`],
        },
        {
          intitule: en ? 'd) The committee question: the default rate that erases the mezzanine' : 'd) La question du comité : le taux de défaut qui efface la mezzanine',
          enonce: en
            ? `With ${pct(rec, 0)} recovered on each defaulted loan, what cumulative default rate of the pool takes L to the mezzanine's 6% detachment — i.e. destroys it entirely, in % of loans?`
            : `Avec ${pct(rec, 0)} récupérés sur chaque prêt en défaut, quel taux de défaut cumulé du pool porte L au détachement de 6 % de la mezzanine — c'est-à-dire la détruit entièrement, en % des prêts ?`,
          reponse: seuilDefauts, tolerance: 0.005, unite: '%',
          etapes: [
            {
              titre: en ? 'Invert L = d × (1 − R/100): d* = 6/(1 − R/100)' : 'Inversez L = d × (1 − R/100) : d* = 6/(1 − R/100)',
              contenu: en
                ? `d* = 6/(1 − ${f(rec, 0)}/100) = **${pct(seuilDefauts)}** of the loans. The recovery is the mezzanine's hidden ally: losses, not defaults, climb the capital structure — with ${pct(rec, 0)} recovered, it takes ${f(r2(seuilDefauts / 6), 2)} points of defaults to make one point of losses.`
                : `d* = 6/(1 − ${f(rec, 0)}/100) = **${pct(seuilDefauts)}** des prêts. Le recouvrement est l'allié caché de la mezzanine : ce sont les pertes, pas les défauts, qui montent dans la structure — avec ${pct(rec, 0)} récupérés, il faut ${f(r2(seuilDefauts / 6), 2)} points de défauts pour faire un point de pertes.`,
            },
            {
              titre: en ? 'Why 2007 broke both inputs at once' : 'Pourquoi 2007 a cassé les deux entrées à la fois',
              contenu: en
                ? `The threshold looks comfortable — until you notice it stands on TWO model inputs, and stress breaks them together: defaults cluster (the correlation the tranching assumed away) AND recoveries collapse (everyone forecloses into the same falling housing market). Subprime vintages saw cumulative defaults far beyond any d*, with recoveries far below ${pct(rec, 0)}. The committee's honest sentence: the mezzanine's yield is the rent of this threshold, and the threshold is a hypothesis.`
                : `Le seuil a l'air confortable — jusqu'à remarquer qu'il repose sur DEUX entrées de modèle, et que le stress les casse ensemble : les défauts arrivent en grappes (la corrélation que le tranchage supposait absente) ET les recouvrements s'effondrent (tout le monde saisit dans le même marché immobilier qui baisse). Les millésimes subprime ont vu des défauts cumulés bien au-delà de tout d*, avec des recouvrements bien sous ${pct(rec, 0)}. La phrase honnête du comité : le rendement de la mezzanine est le loyer de ce seuil, et le seuil est une hypothèse.`,
            },
          ],
          pieges: [en
            ? `Answering 6%: six points are the LOSSES that kill the mezzanine — in DEFAULTS, the ${pct(rec, 0)} recovery lifts the threshold to ${pct(seuilDefauts)}. Confusing the two units understates the cushion in calm times and overstates it in crises, when R collapses too.`
            : `Répondre 6 % : six points sont les PERTES qui tuent la mezzanine — en DÉFAUTS, le recouvrement de ${pct(rec, 0)} remonte le seuil à ${pct(seuilDefauts)}. Confondre les deux unités sous-estime le coussin par temps calme et le surestime en crise, quand R s'effondre aussi.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* Export du lot 1 — fusionné dans problems.ts par le contrôleur.      */
/* ------------------------------------------------------------------ */
export const problemesLot1: ProblemeMoule[] = [
  lireUnSpread,         // m5-pb-01 · N1
  analysteNote,         // m5-pb-02 · N1
  premierCds,           // m5-pb-03 · N1
  trancheSimple,        // m5-pb-04 · N1
  pricerCorporate,      // m5-pb-05 · N2
  ecartementCrise,      // m5-pb-06 · N2
  gerantHy,             // m5-pb-07 · N2
  enchereReglement,     // m5-pb-08 · N2
  baseNegative,         // m5-pb-09 · N2
  portefeuilleTitrise,  // m5-pb-10 · N2
];


