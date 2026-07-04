/**
 * Moules de problèmes multi-étapes du module Gestion d'actifs & risques —
 * LOT 1 : les 10 moules N1/N2 (m12-pb-01 à m12-pb-10). 4 N1 (construire un
 * portefeuille, la fiche du fonds, le tableau de bord du risque, le comité
 * Bâle) et 6 N2 (le mandat du client, le choc de marché, frais et horizon,
 * la couverture du portefeuille, le stress de liquidité, l'attribution).
 * Chaque moule : 3 scénarios FR + EN (habillages ET bornes de tirage
 * différents), sous-questions chaînées (la sortie de a) nourrit b), c)…),
 * corrigés calculés via calculs.ts — jamais de texte figé.
 * INVARIANT BILINGUE : tous les tirages aléatoires ont lieu AVANT toute branche
 * de langue — même seed + même scénario ⇒ mêmes nombres en français et en anglais.
 * Conventions (en-tête de calculs.ts) : pourcentages partout (5 = 5 %) ; les
 * POIDS de portefeuille en % (le complément à 100 va au second actif) ; ρ et
 * β SANS UNITÉ ; Sharpe et ratio d'information SANS UNITÉ ; valeurs de
 * portefeuille et de bilan en MILLIONS, VaR rendue en MILLIONS ; année de
 * 252 jours de bourse ; quantiles z EXPLICITES (1,65 pour 95 %, 2,33 pour
 * 99 %). Les chaînages s'appuient sur les valeurs ARRONDIES (r2) des
 * sous-questions précédentes, pour que le corrigé affiché soit recomposable
 * à la calculatrice. Les ancres des habillages (vol (60/40, 20/10, ρ 0,3) =
 * 13,74 % contre 16 % à ρ = 1 ; β(0,8, 25, 15) = 1,33 ; CAPM(3, 1,2, 5) =
 * 9 % ; alpha(12, 3, 1,2, 10) = +0,6 % ; Sharpe(8, 3, 10) = 0,5 ; VaR 1 j
 * 95 % (100 M, 20 %) = 2,08 M ; stress (100, −20, 1,2) = −24 M ; CET1 des
 * grandes banques européennes 12-15 % contre le levier ~31 de Lehman ;
 * LCR ≥ 100 % — Northern Rock, SVB 2023 ; 100 investis 30 ans à 7 % : 761
 * bruts, 432 nets de 2 % de frais) sont celles des chapitres 1 à 6 du module.
 */
import { formatNombreLangue } from '../../../engine/answers';
import { mulberry32, randFloat, randInt } from '../../../engine/rng';
import type { Langue, ProblemGenerator } from '../../../engine/types';
import {
  actifsPonderesRisqueMillions, alphaJensen, betaActif, lcrPct,
  perteStressMillions, ratioCet1Pct, ratioInformation, ratioSharpe,
  rendementCapm, rendementPortefeuille2Actifs, valeurNetteDeFrais,
  varHorizon, varParametrique, volatilitePortefeuille2Actifs,
} from './calculs';

/** Un « moule » de problème est un ProblemGenerator de l'engine (alias local). */
export type ProblemeMoule = ProblemGenerator;

const M12 = '12-gestion-actifs-risques';
const r2 = (v: number) => Math.round(v * 100) / 100;

/** Petits formateurs liés à la langue (les tirages sont déjà faits quand on les crée). */
function outils(langue: Langue) {
  const en = langue === 'en';
  const f = (v: number, d = 2) => formatNombreLangue(langue, v, d);
  const pct = (v: number, d = 2) => (en ? `${f(v, d)}%` : `${f(v, d)} %`);
  /** Millions d'euros : « 120 M€ » / "€120m". */
  const mEur = (v: number, d = 2) => (en ? `€${f(v, d)}m` : `${f(v, d)} M€`);
  /** Euros pleins : « 300 000 € » / "€300,000". */
  const eur = (v: number, d = 0) => (en ? `€${f(v, d)}` : `${f(v, d)} €`);
  return { en, f, pct, mEur, eur };
}

/* ------------------------------------------------------------------ */
/* 1. m12-pb-01 — Construire un portefeuille — N1                      */
/* ------------------------------------------------------------------ */
const construirePortefeuille: ProblemeMoule = {
  id: 'm12-pb-01', moduleId: M12,
  titre: 'Construire un portefeuille : le seul repas gratuit, mesuré',
  titreEn: 'Building a portfolio: the only free lunch, measured',
  typeDeCas: 'construction de portefeuille',
  typeDeCasEn: 'portfolio construction',
  difficulte: 1,
  scenarios: ['Le premier mandat : actions et obligations, le 60/40 du manuel', "L'appel du large : les marchés émergents entrent dans le book", "L'actif qui n'écoute personne : l'or face au book actions"],
  scenariosEn: ['The first mandate: equities and bonds, the textbook 60/40', 'The call of the open sea: emerging markets enter the book', 'The asset that listens to no one: gold against the equity book'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : poids, rendements, volatilités, corrélation.
    const cfg = ([
      { wMin: 50, wMax: 70, raMin: 6, raMax: 9, rbMin: 2, rbMax: 4, vaMin: 15, vaMax: 22, vbMin: 5, vbMax: 8, rhoMin: 0.2, rhoMax: 0.4 },
      { wMin: 60, wMax: 80, raMin: 6, raMax: 8, rbMin: 8, rbMax: 12, vaMin: 16, vaMax: 22, vbMin: 24, vbMax: 32, rhoMin: 0.5, rhoMax: 0.7 },
      { wMin: 70, wMax: 85, raMin: 6, raMax: 9, rbMin: 3, rbMax: 6, vaMin: 15, vaMax: 20, vbMin: 14, vbMax: 18, rhoMin: -0.1, rhoMax: 0.2 },
    ] as const)[sIdx];
    const w = randInt(rng, cfg.wMin, cfg.wMax);
    const ra = randFloat(rng, cfg.raMin, cfg.raMax, 1);
    const rb = randFloat(rng, cfg.rbMin, cfg.rbMax, 1);
    const va = randInt(rng, cfg.vaMin, cfg.vaMax);
    const vb = randInt(rng, cfg.vbMin, cfg.vbMax);
    const rho = randFloat(rng, cfg.rhoMin, cfg.rhoMax, 2);
    const rend = r2(rendementPortefeuille2Actifs(w, ra, rb));
    const vol = r2(volatilitePortefeuille2Actifs(w, va, vb, rho));
    const volRho1 = r2(volatilitePortefeuille2Actifs(w, va, vb, 1));
    // Chaîné sur les valeurs arrondies de b) et c).
    const gain = r2(volRho1 - vol);
    const wB = 100 - w;

    const { en, f, pct } = outils(langue);
    const noms = (en
      ? [['euro-area equities', 'sovereign bonds'], ['domestic equities', 'emerging-market equities'], ['the equity book', 'gold']]
      : [['les actions de la zone euro', 'les obligations souveraines'], ['les actions domestiques', 'les actions émergentes'], ['le book actions', "l'or"]])[sIdx];
    const desc = en
      ? `${pct(w, 0)} in ${noms[0]} (expected return ${pct(ra, 1)}, volatility ${pct(va, 0)}), the remaining ${pct(wB, 0)} in ${noms[1]} (${pct(rb, 1)}, ${pct(vb, 0)}); estimated correlation ρ = ${f(rho, 2)}`
      : `${pct(w, 0)} sur ${noms[0]} (rendement espéré ${pct(ra, 1)}, volatilité ${pct(va, 0)}), les ${pct(wB, 0)} restants sur ${noms[1]} (${pct(rb, 1)}, ${pct(vb, 0)}) ; corrélation estimée ρ = ${f(rho, 2)}`;
    const contexte = (en
      ? [
        `Your first mandate on the buy-side: a client, two asset classes, and the textbook allocation to defend before the investment committee: ${desc}. The CIO slides the sheet across the table: "Return, risk, and the number that justifies our fees — the diversification gain. Markowitz in four lines, please."`,
        `The allocation committee is debating the move everyone made ten years too late or ten years too early: adding emerging markets to the book. The proposal: ${desc}. Before the debate about growth stories, the CIO wants the arithmetic: what does the mix return, what does it risk, and what does the correlation actually buy?`,
        `Gold pays no coupon, has no earnings, and answers to no one — which is exactly why it is on the table this morning: ${desc}. The risk team is sceptical ("an asset with no yield"), the CIO patient: "Run the numbers first. An asset that ignores the rest of the portfolio can be paid for in RISK." Do the four steps.`,
      ]
      : [
        `Votre premier mandat côté buy-side : un client, deux classes d'actifs, et l'allocation du manuel à défendre devant le comité d'investissement : ${desc}. Le directeur des investissements pousse la feuille vers vous : « Le rendement, le risque, et le nombre qui justifie nos honoraires — le gain de diversification. Markowitz en quatre lignes, s'il vous plaît. »`,
        `Le comité d'allocation débat du mouvement que tout le monde a fait dix ans trop tard ou dix ans trop tôt : ajouter les émergents au book. La proposition : ${desc}. Avant le débat sur les histoires de croissance, le directeur veut l'arithmétique : que rend le mélange, que risque-t-il, et qu'achète vraiment la corrélation ?`,
        `L'or ne paie pas de coupon, n'a pas de résultats, et n'obéit à personne — c'est exactement pourquoi il est sur la table ce matin : ${desc}. L'équipe risque est sceptique (« un actif sans rendement »), le directeur patient : « Faites d'abord les comptes. Un actif qui ignore le reste du portefeuille se paie en RISQUE. » Déroulez les quatre étapes.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The promise: the expected return' : 'a) La promesse : le rendement espéré',
          enonce: en
            ? `With ${pct(w, 0)} in the first asset (${pct(ra, 1)}) and ${pct(wB, 0)} in the second (${pct(rb, 1)}), what is the portfolio's expected return, in %?`
            : `Avec ${pct(w, 0)} sur le premier actif (${pct(ra, 1)}) et ${pct(wB, 0)} sur le second (${pct(rb, 1)}), quel est le rendement espéré du portefeuille, en % ?`,
          reponse: rend, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'Return = w₁r₁ + w₂r₂: the weighted average, no surprise' : 'Rendement = w₁r₁ + w₂r₂ : la moyenne pondérée, sans surprise',
            contenu: en
              ? `${f(w, 0)}% × ${f(ra, 1)} + ${f(wB, 0)}% × ${f(rb, 1)} = **${pct(rend)}**. The return diversifies LINEARLY — no bonus, no penalty, just the average. Hold on to this: it is the RISK that refuses to average, and the whole of Markowitz lives in that asymmetry (ch. 1). Everything interesting in this problem happens in questions b) to d).`
              : `${f(w, 0)} % × ${f(ra, 1)} + ${f(wB, 0)} % × ${f(rb, 1)} = **${pct(rend)}**. Le rendement se diversifie LINÉAIREMENT — pas de bonus, pas de pénalité, juste la moyenne. Retenez-le : c'est le RISQUE qui refuse de se moyenner, et tout Markowitz vit dans cette asymétrie (ch. 1). Tout l'intéressant de ce problème se joue aux questions b) à d).`,
          }],
          pieges: [en
            ? `Taking the simple average (${f(ra, 1)} + ${f(rb, 1)})/2 = ${pct(r2((ra + rb) / 2), 1)}: the portfolio is ${pct(w, 0)}/${pct(wB, 0)}, not 50/50 — the weights are the whole allocation decision.`
            : `Prendre la moyenne simple (${f(ra, 1)} + ${f(rb, 1)})/2 = ${pct(r2((ra + rb) / 2), 1)} : le portefeuille est ${pct(w, 0)}/${pct(wB, 0)}, pas 50/50 — les poids sont toute la décision d'allocation.`],
        },
        {
          intitule: en ? `b) The risk: the volatility at ρ = ${f(rho, 2)}` : `b) Le risque : la volatilité à ρ = ${f(rho, 2)}`,
          enonce: en
            ? `Volatilities ${pct(va, 0)} and ${pct(vb, 0)}, correlation ρ = ${f(rho, 2)}. What is the portfolio's volatility, in %?`
            : `Volatilités ${pct(va, 0)} et ${pct(vb, 0)}, corrélation ρ = ${f(rho, 2)}. Quelle est la volatilité du portefeuille, en % ?`,
          reponse: vol, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'σₚ = √(w₁²σ₁² + w₂²σ₂² + 2w₁w₂ρσ₁σ₂): THE formula of the module' : 'σₚ = √(w₁²σ₁² + w₂²σ₂² + 2w₁w₂ρσ₁σ₂) : LA formule du module',
            contenu: en
              ? `√(${f(w / 100, 2)}² × ${f(va, 0)}² + ${f(wB / 100, 2)}² × ${f(vb, 0)}² + 2 × ${f(w / 100, 2)} × ${f(wB / 100, 2)} × ${f(rho, 2)} × ${f(va, 0)} × ${f(vb, 0)}) = **${pct(vol)}**. The module's anchor: a 60/40 of vols 20 and 10 at ρ = 0.3 gives 13.74%, LESS than the 16% weighted average. The cross-term carries the correlation — and as long as ρ < 1, the whole is less risky than the sum of its parts.`
              : `√(${f(w / 100, 2)}² × ${f(va, 0)}² + ${f(wB / 100, 2)}² × ${f(vb, 0)}² + 2 × ${f(w / 100, 2)} × ${f(wB / 100, 2)} × ${f(rho, 2)} × ${f(va, 0)} × ${f(vb, 0)}) = **${pct(vol)}**. L'ancre du module : un 60/40 de vols 20 et 10 à ρ = 0,3 donne 13,74 %, MOINS que la moyenne pondérée de 16 %. Le terme croisé porte la corrélation — et tant que ρ < 1, le tout est moins risqué que la somme des parties.`,
          }],
          pieges: [en
            ? `Answering the weighted average ${pct(volRho1)}: that ignores the correlation entirely — volatilities only average when ρ = 1. At ρ = ${f(rho, 2)}, the cross-term does real work.`
            : `Répondre la moyenne pondérée ${pct(volRho1)} : c'est ignorer complètement la corrélation — les volatilités ne se moyennent qu'à ρ = 1. À ρ = ${f(rho, 2)}, le terme croisé travaille vraiment.`],
        },
        {
          intitule: en ? 'c) The world without diversification: ρ = 1' : 'c) Le monde sans diversification : ρ = 1',
          enonce: en
            ? `Same weights, same volatilities, but now suppose ρ = 1. What is the portfolio's volatility, in %?`
            : `Mêmes poids, mêmes volatilités, mais supposez maintenant ρ = 1. Quelle est la volatilité du portefeuille, en % ?`,
          reponse: volRho1, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'At ρ = 1 the formula collapses to the weighted average' : 'À ρ = 1, la formule retombe sur la moyenne pondérée',
            contenu: en
              ? `${f(w, 0)}% × ${f(va, 0)} + ${f(wB, 0)}% × ${f(vb, 0)} = **${pct(volRho1)}** — no square root needed: at ρ = 1 the expression under the root is a perfect square, (w₁σ₁ + w₂σ₂)². Two assets that move as one are ONE asset in two lines of the account statement: diversification is not owning several things, it is owning several things that disagree.`
              : `${f(w, 0)} % × ${f(va, 0)} + ${f(wB, 0)} % × ${f(vb, 0)} = **${pct(volRho1)}** — aucune racine nécessaire : à ρ = 1, l'expression sous la racine est un carré parfait, (w₁σ₁ + w₂σ₂)². Deux actifs qui bougent comme un seul SONT un seul actif en deux lignes de relevé : diversifier, ce n'est pas détenir plusieurs choses, c'est détenir plusieurs choses qui ne sont pas d'accord.`,
          }],
          pieges: [en
            ? `Recomputing the full formula term by term: at ρ = 1 the answer is the weighted average w₁σ₁ + w₂σ₂, immediately — knowing this shortcut is also the fastest sanity check on your b).`
            : `Recalculer laborieusement la formule terme à terme : à ρ = 1, la réponse est la moyenne pondérée w₁σ₁ + w₂σ₂, immédiatement — connaître ce raccourci est aussi la vérification mentale la plus rapide de votre b).`],
        },
        {
          intitule: en ? 'd) The free lunch: the diversification gain' : 'd) Le repas gratuit : le gain de diversification',
          enonce: en
            ? `Difference between c) and b): how many points of volatility does the correlation of ρ = ${f(rho, 2)} save, compared with the ρ = 1 world?`
            : `Différence entre le c) et le b) : combien de points de volatilité la corrélation de ρ = ${f(rho, 2)} fait-elle économiser, par rapport au monde à ρ = 1 ?`,
          reponse: gain, tolerance: 0.05, toleranceMode: 'absolu', unite: 'points',
          etapes: [
            {
              titre: en ? 'Gain = σ(ρ = 1) − σ(ρ actual)' : 'Gain = σ(ρ = 1) − σ(ρ réel)',
              contenu: en
                ? `${f(volRho1)} − ${f(vol)} = **${f(gain)} points** of volatility, for free. Free in the precise sense: question a) did not move — the expected return is ${pct(rend)} in both worlds. Less risk, same return: that is why diversification is called the only free lunch in finance, and why this subtraction is the number that justifies a portfolio's existence.`
                : `${f(volRho1)} − ${f(vol)} = **${f(gain)} points** de volatilité, gratuits. Gratuits au sens précis : la question a) n'a pas bougé — le rendement espéré vaut ${pct(rend)} dans les deux mondes. Moins de risque, même rendement : voilà pourquoi la diversification s'appelle le seul repas gratuit de la finance, et pourquoi cette soustraction est le nombre qui justifie l'existence d'un portefeuille.`,
            },
            {
              titre: en ? 'The small print on the free lunch' : 'Les petites lignes du repas gratuit',
              contenu: en
                ? `Two caveats the committee should hear. At ρ = −1 the gain would be total — a choice of weights could cancel the risk entirely; at ρ = 0, two identical assets split 50/50 divide the vol by √2. And the correlation is ESTIMATED, not granted: correlations rise precisely in crises (the m11 lesson), so the ${f(gain)} points are a fair-weather rent — real, collectable, and partly repossessed on the worst days.`
                : `Deux réserves que le comité doit entendre. À ρ = −1, le gain serait total — un choix de poids annulerait entièrement le risque ; à ρ = 0, deux actifs identiques en 50/50 divisent la vol par √2. Et la corrélation est ESTIMÉE, pas garantie : les corrélations montent précisément en crise (la leçon du m11) — les ${f(gain)} points sont un loyer de beau temps : réel, encaissable, et partiellement repris les pires jours.`,
            },
          ],
          pieges: [en
            ? `Believing diversification also improves the return of a): it touches ONLY the risk. The return stays the weighted average — anyone who promises extra return from diversification alone is selling something else.`
            : `Croire que la diversification améliore aussi le rendement du a) : elle ne touche QUE le risque. Le rendement reste la moyenne pondérée — qui promet du rendement en plus par la seule diversification vend autre chose.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 2. m12-pb-02 — La fiche du fonds — N1                               */
/* ------------------------------------------------------------------ */
const ficheDuFonds: ProblemeMoule = {
  id: 'm12-pb-02', moduleId: M12,
  titre: 'La fiche du fonds : bêta, exigence, alpha',
  titreEn: 'The fund factsheet: beta, requirement, alpha',
  typeDeCas: 'analyse de fonds',
  typeDeCasEn: 'fund analysis',
  difficulte: 1,
  scenarios: ['Le fonds actions euro devant le comité de sélection', 'Le fonds growth : la fusée qui suit le marché de trop près', 'Le fonds défensif : petit bêta, grandes prétentions'],
  scenariosEn: ['The euro equity fund before the selection committee', 'The growth fund: the rocket that tracks the market too closely', 'The defensive fund: small beta, big claims'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : corrélation, vols, taux sans risque, prime, alpha tiré.
    const cfg = ([
      { rhoMin: 0.75, rhoMax: 0.9, vfMin: 14, vfMax: 20, vmMin: 12, vmMax: 16, alMin: -1, alMax: 2 },
      { rhoMin: 0.85, rhoMax: 0.95, vfMin: 20, vfMax: 28, vmMin: 14, vmMax: 18, alMin: -2, alMax: 1 },
      { rhoMin: 0.6, rhoMax: 0.8, vfMin: 10, vfMax: 14, vmMin: 14, vmMax: 18, alMin: -0.5, alMax: 1.5 },
    ] as const)[sIdx];
    const rho = randFloat(rng, cfg.rhoMin, cfg.rhoMax, 2);
    const volF = randInt(rng, cfg.vfMin, cfg.vfMax);
    const volM = randInt(rng, cfg.vmMin, cfg.vmMax);
    const rf = randFloat(rng, 2, 3.5, 1);
    const prime = randFloat(rng, 4, 6, 1);
    const alphaT = randFloat(rng, cfg.alMin, cfg.alMax, 1);
    const beta = r2(betaActif(rho, volF, volM));
    // Chaîné sur le bêta arrondi, puis alpha reconstruit sur l'exigence arrondie.
    const exigence = r2(rendementCapm(rf, beta, prime));
    const rReal = r2(exigence + alphaT);
    const alpha = r2(rReal - exigence);
    const rMarche = r2(rf + prime);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `correlation of the fund with the market ρ = ${f(rho, 2)}, fund volatility ${pct(volF, 0)}, market volatility ${pct(volM, 0)}; risk-free rate ${pct(rf, 1)}, expected market premium ${pct(prime, 1)}; return delivered by the fund last year: ${pct(rReal)}`
      : `corrélation du fonds avec le marché ρ = ${f(rho, 2)}, volatilité du fonds ${pct(volF, 0)}, volatilité du marché ${pct(volM, 0)} ; taux sans risque ${pct(rf, 1)}, prime de marché attendue ${pct(prime, 1)} ; rendement livré par le fonds l'an dernier : ${pct(rReal)}`;
    const contexte = (en
      ? [
        `Selection committee, Tuesday 9 a.m. The asset manager presents its euro equity fund and the room waits for your numbers: ${desc}. The chairman sums it up: "The brochure says 'talented manager'. The CAPM will say whether he beat his risk — not the market, HIS risk." Three numbers: the beta, the requirement, the alpha.`,
        `The growth fund of the range doubled in size in two years — a rocket, says the marketing. But a rocket that tracks the market very closely: ${desc}. Before congratulating anyone, decompose: how much of that return is the plain rent of the beta, and how much is alpha?`,
        `A defensive fund promising "performance with less risk": ${desc}. The client's consultant is sceptical: a small beta LOWERS the requirement — the fund still has to clear it. Beta, required return, alpha: the full factsheet before the 3 p.m. meeting.`,
      ]
      : [
        `Comité de sélection, mardi 9 heures. La société de gestion présente son fonds actions euro et la salle attend vos chiffres : ${desc}. Le président résume : « La plaquette dit "gérant talentueux". Le CAPM dira s'il a battu son risque — pas le marché, SON risque. » Trois nombres : le bêta, l'exigence, l'alpha.`,
        `Le fonds growth de la gamme a doublé de taille en deux ans — une fusée, dit le marketing. Mais une fusée qui suit le marché de très près : ${desc}. Avant de féliciter qui que ce soit, décomposez : combien de ce rendement est le simple loyer du bêta, et combien est de l'alpha ?`,
        `Un fonds défensif qui promet « la performance avec moins de risque » : ${desc}. Le consultant du client est sceptique : un petit bêta ABAISSE l'exigence — encore faut-il la franchir. Bêta, rendement exigé, alpha : la fiche complète avant le rendez-vous de quinze heures.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? "a) The measure: the fund's beta" : 'a) La mesure : le bêta du fonds',
          enonce: en
            ? `Correlation ρ = ${f(rho, 2)}, fund volatility ${pct(volF, 0)}, market volatility ${pct(volM, 0)}. What is the fund's beta (unitless)?`
            : `Corrélation ρ = ${f(rho, 2)}, volatilité du fonds ${pct(volF, 0)}, volatilité du marché ${pct(volM, 0)}. Quel est le bêta du fonds (sans unité) ?`,
          reponse: beta, tolerance: 0.01, toleranceMode: 'absolu',
          etapes: [{
            titre: en ? 'β = ρ × σ_fund / σ_market' : 'β = ρ × σ_fonds / σ_marché',
            contenu: en
              ? `${f(rho, 2)} × ${f(volF, 0)}/${f(volM, 0)} = **${f(beta)}** — the library's anchor: (0.8, 25, 15) = 1.33. Read it as a lever: when the market moves 1%, the fund moves about ${f(beta)}% ON AVERAGE. And note what beta is NOT: total risk. A wildly volatile fund that is DECORRELATED from the market (ρ ≈ 0) has a tiny beta — its risk is diversifiable, and the CAPM says diversifiable risk earns nothing (ch. 2).`
              : `${f(rho, 2)} × ${f(volF, 0)}/${f(volM, 0)} = **${f(beta)}** — l'ancre de la bibliothèque : (0,8, 25, 15) = 1,33. Lisez-le comme un levier : quand le marché bouge de 1 %, le fonds bouge d'environ ${f(beta)} % EN MOYENNE. Et notez ce que le bêta n'est PAS : le risque total. Un fonds très volatil mais DÉCORRÉLÉ du marché (ρ ≈ 0) a un bêta minuscule — son risque est diversifiable, et le CAPM dit que le risque diversifiable ne rapporte rien (ch. 2).`,
          }],
          pieges: [en
            ? `Computing σ_fund/σ_market = ${f(r2(volF / volM))} without the ρ: that assumes perfect correlation. The beta only counts the co-movement — the ${f(rho, 2)} is doing real work here.`
            : `Calculer σ_fonds/σ_marché = ${f(r2(volF / volM))} sans le ρ : c'est supposer une corrélation parfaite. Le bêta ne compte que le co-mouvement — le ${f(rho, 2)} travaille vraiment ici.`],
        },
        {
          intitule: en ? 'b) The requirement: the return the CAPM demands' : "b) L'exigence : le rendement que le CAPM réclame",
          enonce: en
            ? `Risk-free rate ${pct(rf, 1)}, market premium ${pct(prime, 1)}, beta from a). What return does the CAPM require from this fund, in %?`
            : `Taux sans risque ${pct(rf, 1)}, prime de marché ${pct(prime, 1)}, bêta du a). Quel rendement le CAPM exige-t-il de ce fonds, en % ?`,
          reponse: exigence, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'r = r_f + β × market premium: the SML' : 'r = r_f + β × prime de marché : la SML',
            contenu: en
              ? `${f(rf, 1)} + ${f(beta)} × ${f(prime, 1)} = **${pct(exigence)}** — the anchor: CAPM(3, 1.2, 5) = 9%. This is the security market line: the market only pays for SYSTEMATIC risk, the rest it assumes you have diversified away. Orders of magnitude to keep: the equity market premium runs at ~4-6% per year over long periods — the ${pct(prime, 1)} here is not a house opinion, it is the going rate for bearing the market.`
              : `${f(rf, 1)} + ${f(beta)} × ${f(prime, 1)} = **${pct(exigence)}** — l'ancre : CAPM(3, 1,2, 5) = 9 %. C'est la droite de marché des titres : le marché ne paie que le risque SYSTÉMATIQUE, le reste, il suppose que vous l'avez diversifié. Ordres de grandeur à garder : la prime de marché actions vaut ~4-6 % par an sur longue période — les ${pct(prime, 1)} d'ici ne sont pas une opinion maison, c'est le tarif du portage de marché.`,
          }],
          pieges: [en
            ? `Using the MARKET RETURN ${pct(rMarche, 1)} instead of the premium: r_f + β × r_m = ${pct(r2(rf + beta * rMarche))} counts the risk-free rate twice. The premium is r_m − r_f — the risk-free enters once, as the floor.`
            : `Utiliser le RENDEMENT DU MARCHÉ ${pct(rMarche, 1)} à la place de la prime : r_f + β × r_m = ${pct(r2(rf + beta * rMarche))} compte le taux sans risque deux fois. La prime, c'est r_m − r_f — le sans-risque entre une fois, comme plancher.`],
        },
        {
          intitule: en ? 'c) The verdict: the realised alpha' : "c) Le verdict : l'alpha réalisé",
          enonce: en
            ? `The fund returned ${pct(rReal)} last year. Against the requirement of b), what is its alpha, in %?`
            : `Le fonds a rendu ${pct(rReal)} l'an dernier. Contre l'exigence du b), quel est son alpha, en % ?`,
          reponse: alpha, tolerance: 0.02, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'Alpha = realised return − CAPM requirement' : "Alpha = rendement réalisé − exigence CAPM",
              contenu: en
                ? `${f(rReal)} − ${f(exigence)} = **${pct(alpha)}** — Jensen's alpha, the library's anchor: alpha(12, 3, 1.2, 10) = +0.6%. ${alpha >= 0 ? `Positive: the manager beat HIS OWN risk, not just the tape — after paying the rent of a ${f(beta)} beta, ${pct(alpha)} of genuine value-added remains.` : `Negative: the fund did not even pay the rent of its own beta — a plain index position levered to ${f(beta)} would have done better, for a few basis points of fees.`} The alpha is what remains once the beta is paid — the rarest and most expensive commodity on the buy-side (ch. 3).`
                : `${f(rReal)} − ${f(exigence)} = **${pct(alpha)}** — l'alpha de Jensen, l'ancre de la bibliothèque : alpha(12, 3, 1,2, 10) = +0,6 %. ${alpha >= 0 ? `Positif : le gérant a battu SON risque, pas seulement la cote — une fois payé le loyer d'un bêta de ${f(beta)}, il reste ${pct(alpha)} de vraie valeur ajoutée.` : `Négatif : le fonds n'a même pas payé le loyer de son propre bêta — une simple position indicielle au levier ${f(beta)} aurait fait mieux, pour quelques points de base de frais.`} L'alpha est ce qui reste quand le bêta est payé — la denrée la plus rare et la plus chère du buy-side (ch. 3).`,
            },
            {
              titre: en ? 'Why the committee asks for alpha and not "did you beat the index?"' : "Pourquoi le comité demande l'alpha et pas « avez-vous battu l'indice ? »",
              contenu: en
                ? `Because the index question has a cheap answer: take more beta. In a rising market, a ${f(beta)} beta "beats" the index with zero talent — and gives it all back, with interest, in the drawdown. Jensen's alpha closes that loophole by charging each fund the price of its OWN risk. It is also why aggregate alpha is roughly zero before fees and negative after: the beta is available for basis points, the talent is what you are actually shopping for.`
                : `Parce que la question de l'indice a une réponse bon marché : prendre plus de bêta. Par marché haussier, un bêta de ${f(beta)} « bat » l'indice sans aucun talent — et rend tout, avec les intérêts, dans la baisse. L'alpha de Jensen ferme cette échappatoire en facturant à chaque fonds le prix de SON risque. C'est aussi pourquoi l'alpha agrégé vaut à peu près zéro avant frais et devient négatif après : le bêta s'achète en points de base, le talent est ce que vous êtes vraiment venu chercher.`,
            },
          ],
          pieges: [en
            ? `Comparing with the market: ${f(rReal)} − ${f(rMarche, 1)} = ${pct(r2(rReal - rMarche))} vs the index is NOT the alpha — with a beta of ${f(beta)}, the fund's fair benchmark was ${pct(exigence)}, not the market's return.`
            : `Comparer au marché : ${f(rReal)} − ${f(rMarche, 1)} = ${pct(r2(rReal - rMarche))} contre l'indice n'est PAS l'alpha — avec un bêta de ${f(beta)}, le juste étalon du fonds était ${pct(exigence)}, pas le rendement du marché.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 3. m12-pb-03 — Le tableau de bord du risque — N1                    */
/* ------------------------------------------------------------------ */
const tableauDeBordRisque: ProblemeMoule = {
  id: 'm12-pb-03', moduleId: M12,
  titre: 'Le tableau de bord du risque : trois VaR avant neuf heures',
  titreEn: 'The risk dashboard: three VaRs before nine',
  typeDeCas: 'mesure du risque',
  typeDeCasEn: 'risk measurement',
  difficulte: 1,
  scenarios: ['Le rapport du matin : le book actions du desk', "Le client institutionnel : une VaR pour le conseil d'administration", 'La poche de trésorerie : petite vol, grandes questions'],
  scenariosEn: ['The morning report: the desk equity book', 'The institutional client: a VaR for the board', 'The treasury pocket: small vol, big questions'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : valeur du portefeuille (M), vol annuelle.
    const cfg = ([
      { vMin: 80, vMax: 250, volMin: 15, volMax: 25 },
      { vMin: 300, vMax: 800, volMin: 8, volMax: 14 },
      { vMin: 100, vMax: 400, volMin: 3, volMax: 6 },
    ] as const)[sIdx];
    const valeur = randInt(rng, cfg.vMin, cfg.vMax);
    const vol = randInt(rng, cfg.volMin, cfg.volMax);
    const var95 = r2(varParametrique(valeur, vol, 1.65, 1));
    const var99 = r2(varParametrique(valeur, vol, 2.33, 1));
    // Chaîné sur la VaR 99 % arrondie du b).
    const var10j = r2(varHorizon(var99, 10));

    const { en, f, pct, mEur } = outils(langue);
    const desc = en
      ? `portfolio valued at ${mEur(valeur, 0)}, annualised volatility ${pct(vol, 0)}; desk conventions: 252 trading days, z = 1.65 for 95% and 2.33 for 99%`
      : `portefeuille valorisé ${mEur(valeur, 0)}, volatilité annualisée ${pct(vol, 0)} ; conventions du desk : 252 jours de bourse, z = 1,65 pour 95 % et 2,33 pour 99 %`;
    const contexte = (en
      ? [
        `7:40 a.m., the risk report must be on the head of desk's screen before the open. Your line this morning: ${desc}. Three numbers before nine: the daily VaR at 95%, the same at 99%, and the ten-day figure the regulator's framework was built on. No model debate — the parametric convention, cleanly executed.`,
        `The institutional client's board meets Thursday and wants ONE slide on risk — no distribution charts, no Greek letters: ${desc}. The mandate's reporting requires the daily 95% VaR, the 99% for the audit committee, and the 10-day horizon for the regulatory annex. Your job: the three numbers, and what each one does NOT say.`,
        `The treasury pocket looks sleepy — ${desc} — and that is precisely why the new CRO picked it for the methodology review: "Small vol, small VaR, everyone nods. Show me the three standard numbers and tell me where the convention stops being true."`,
      ]
      : [
        `7 h 40, le rapport de risque doit être sur l'écran du chef de desk avant l'ouverture. Votre ligne ce matin : ${desc}. Trois nombres avant neuf heures : la VaR quotidienne à 95 %, la même à 99 %, et le chiffre à dix jours sur lequel le cadre du régulateur s'est construit. Pas de débat de modèle — la convention paramétrique, proprement exécutée.`,
        `Le conseil d'administration du client institutionnel se réunit jeudi et veut UNE diapositive sur le risque — pas de graphique de distribution, pas de lettres grecques : ${desc}. Le reporting du mandat exige la VaR quotidienne à 95 %, la 99 % pour le comité d'audit, et l'horizon 10 jours pour l'annexe réglementaire. Votre travail : les trois nombres, et ce que chacun ne dit PAS.`,
        `La poche de trésorerie a l'air endormie — ${desc} — et c'est précisément pourquoi le nouveau directeur des risques l'a choisie pour la revue de méthodologie : « Petite vol, petite VaR, tout le monde hoche la tête. Montrez-moi les trois nombres standards et dites-moi où la convention cesse d'être vraie. »`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The morning number: the 1-day 95% VaR' : 'a) Le chiffre du matin : la VaR 1 jour à 95 %',
          enonce: en
            ? `Portfolio ${mEur(valeur, 0)}, annual volatility ${pct(vol, 0)}, z = 1.65, 252-day year. What is the 1-day 95% VaR, in €m?`
            : `Portefeuille ${mEur(valeur, 0)}, volatilité annuelle ${pct(vol, 0)}, z = 1,65, année de 252 jours. Quelle est la VaR 1 jour à 95 %, en M€ ?`,
          reponse: var95, tolerance: 0.005, unite: en ? '€m' : 'M€',
          etapes: [{
            titre: en ? 'VaR = V × z × σ_annual × √(1/252)' : 'VaR = V × z × σ_annuelle × √(1/252)',
            contenu: en
              ? `${f(valeur, 0)} × 1.65 × ${f(vol, 0)}% × √(1/252) = **${mEur(var95)}** — the library's anchor: (100m, 20%) gives 2.08m. Read it the only correct way: "19 days out of 20, the daily loss should not exceed ${mEur(var95)}." Not a maximum, a THRESHOLD — the VaR says where the bad 5% begins, and stays silent about everything beyond it (ch. 5).`
              : `${f(valeur, 0)} × 1,65 × ${f(vol, 0)} % × √(1/252) = **${mEur(var95)}** — l'ancre de la bibliothèque : (100 M, 20 %) donne 2,08 M. Lisez-la de la seule façon correcte : « 19 jours sur 20, la perte quotidienne ne devrait pas dépasser ${mEur(var95)}. » Pas un maximum, un SEUIL — la VaR dit où commencent les 5 % mauvais, et se tait sur tout ce qui vit au-delà (ch. 5).`,
          }],
          pieges: [en
            ? `Forgetting to bring the volatility down to one day: ${f(valeur, 0)} × 1.65 × ${f(vol, 0)}% = ${mEur(r2(valeur * 1.65 * vol / 100))} is an ANNUAL VaR — about 16 times too big. Divide the annual vol by √252 ≈ 15.87 first.`
            : `Oublier de ramener la volatilité au jour : ${f(valeur, 0)} × 1,65 × ${f(vol, 0)} % = ${mEur(r2(valeur * 1.65 * vol / 100))} est une VaR ANNUELLE — environ 16 fois trop grosse. Divisez d'abord la vol annuelle par √252 ≈ 15,87.`],
        },
        {
          intitule: en ? 'b) The demanding tail: the same at 99%' : 'b) La queue exigeante : la même à 99 %',
          enonce: en
            ? `Same portfolio, same day, but z = 2.33. What is the 1-day 99% VaR, in €m?`
            : `Même portefeuille, même journée, mais z = 2,33. Quelle est la VaR 1 jour à 99 %, en M€ ?`,
          reponse: var99, tolerance: 0.005, unite: en ? '€m' : 'M€',
          etapes: [{
            titre: en ? 'Only z changes: 1.65 → 2.33, i.e. about ×1.41' : 'Seul z change : 1,65 → 2,33, soit environ ×1,41',
            contenu: en
              ? `${f(valeur, 0)} × 2.33 × ${f(vol, 0)}% × √(1/252) = **${mEur(var99)}** — or, chained on a): ${f(var95)} × 2.33/1.65 ≈ the same number. Going from 95% to 99% costs about 41% more capital-at-risk: the confidence level is a MANAGEMENT decision, not a hidden constant — which day of the month do you want to be surprised on?`
              : `${f(valeur, 0)} × 2,33 × ${f(vol, 0)} % × √(1/252) = **${mEur(var99)}** — ou, chaîné sur le a) : ${f(var95)} × 2,33/1,65 ≈ le même nombre. Passer de 95 % à 99 % coûte environ 41 % de risque-en-capital en plus : le seuil de confiance est une décision de GESTION, pas une constante cachée — quel jour du mois acceptez-vous d'être surpris ?`,
          }],
          pieges: [en
            ? `Reading ${mEur(var99)} as "the maximum possible loss": the 99% VaR still says NOTHING about the size of the loss beyond the threshold — that question belongs to the expected shortfall and to stress tests, the VaR's mandatory companions.`
            : `Lire ${mEur(var99)} comme « la perte maximale possible » : la VaR 99 % ne dit toujours RIEN de la taille de la perte au-delà du seuil — cette question appartient à l'expected shortfall et aux stress tests, les compagnons obligatoires de la VaR.`],
        },
        {
          intitule: en ? 'c) The Basel convention: ten days of storm' : 'c) La convention Bâle : dix jours de tempête',
          enonce: en
            ? `Extend the 99% VaR of b) to a 10-day horizon with the square-root-of-time rule. Result in €m?`
            : `Étendez la VaR 99 % du b) à un horizon de 10 jours avec la règle de la racine du temps. Résultat en M€ ?`,
          reponse: var10j, tolerance: 0.005, unite: en ? '€m' : 'M€',
          etapes: [
            {
              titre: en ? 'VaR_10d = VaR_1d × √10' : 'VaR_10 j = VaR_1 j × √10',
              contenu: en
                ? `${f(var99)} × √10 = **${mEur(var10j)}** — the anchor: 2 × √10 = 6.32. This is the historical regulatory convention: Basel's market-risk charge was built on the 10-day 99% VaR, computed exactly this way, 1-day × √10. The √ is the i.i.d. hypothesis at work: independent days add in VARIANCE, hence the square root on the horizon.`
                : `${f(var99)} × √10 = **${mEur(var10j)}** — l'ancre : 2 × √10 = 6,32. C'est la convention réglementaire historique : la charge de risque de marché de Bâle s'est construite sur la VaR 10 jours à 99 %, calculée exactement ainsi, 1 jour × √10. La √ est l'hypothèse i.i.d. au travail : des jours indépendants s'additionnent en VARIANCE, d'où la racine sur l'horizon.`,
            },
            {
              titre: en ? 'Where the convention stops being true' : 'Où la convention cesse d\'être vraie',
              contenu: en
                ? `The square-root rule assumes returns are independent from one day to the next. Crises break precisely that: losses feed on losses — forced sales, margin calls, drying liquidity — and ten bad days pile up FASTER than √10. The rule is an optimistic ceiling, at its weakest exactly when the number matters most (ch. 5). Hence the modern pairing: VaR for the daily routine, stress tests for the days the routine dies.`
                : `La règle de la racine suppose des rendements indépendants d'un jour à l'autre. Les crises cassent précisément cela : les pertes se nourrissent des pertes — ventes forcées, appels de marge, liquidité qui s'assèche — et dix mauvais jours s'empilent PLUS VITE que √10. La règle est un plafond optimiste, au plus faible exactement quand le nombre compte le plus (ch. 5). D'où l'attelage moderne : la VaR pour la routine quotidienne, les stress tests pour les jours où la routine meurt.`,
            },
          ],
          pieges: [en
            ? `Multiplying by 10 instead of √10: ${mEur(r2(var99 * 10))} scales the risk LINEARLY, as if ten days were ten certain losses. Independent risks add in variance — ×√10, i.e. ×3.16.`
            : `Multiplier par 10 au lieu de √10 : ${mEur(r2(var99 * 10))} fait croître le risque LINÉAIREMENT, comme si dix jours étaient dix pertes certaines. Les risques indépendants s'additionnent en variance — ×√10, soit ×3,16.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 4. m12-pb-04 — Le comité Bâle — N1                                  */
/* ------------------------------------------------------------------ */
const comiteBale: ProblemeMoule = {
  id: 'm12-pb-04', moduleId: M12,
  titre: 'Le comité Bâle : du bilan au verdict de capital',
  titreEn: 'The Basel committee: from balance sheet to capital verdict',
  typeDeCas: 'réglementation',
  typeDeCasEn: 'regulation',
  difficulte: 1,
  scenarios: ['La banque de détail : des crédits aux ménages par milliers', "La banque corporate : du papier d'entreprise en pondération pleine", 'La filiale sous revue : le superviseur veut des chiffres pour vendredi'],
  scenariosEn: ['The retail bank: household loans by the thousand', 'The corporate bank: company paper at full weight', 'The subsidiary under review: the supervisor wants numbers by Friday'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : exposition, pondération, CET1 cible, coussin au-dessus de 7 %.
    const cfg = ([
      { eMin: 800, eMax: 2000, pMin: 75, pMax: 75, cMin: 10, cMax: 15, bMin: 1, bMax: 2.5 },
      { eMin: 500, eMax: 1500, pMin: 80, pMax: 100, cMin: 9, cMax: 14, bMin: 1.5, bMax: 3 },
      { eMin: 300, eMax: 900, pMin: 90, pMax: 100, cMin: 7.5, cMax: 10.5, bMin: 2, bMax: 3 },
    ] as const)[sIdx];
    const expo = randInt(rng, cfg.eMin, cfg.eMax);
    const pond = randInt(rng, cfg.pMin, cfg.pMax);
    const cet1T = randFloat(rng, cfg.cMin, cfg.cMax, 1);
    const coussin = randFloat(rng, cfg.bMin, cfg.bMax, 1);
    const exigence = r2(4.5 + 2.5 + coussin);
    const rwa = r2(actifsPonderesRisqueMillions(expo, pond));
    const fp = Math.round(rwa * cet1T / 100);
    // Chaîné sur les RWA arrondis du a).
    const cet1 = r2(ratioCet1Pct(fp, rwa));
    const marge = r2(cet1 - exigence);
    const capitalEcart = r2(Math.abs(marge) * rwa / 100);

    const { en, f, pct, mEur } = outils(langue);
    const desc = en
      ? `exposure of ${mEur(expo, 0)} risk-weighted at ${pct(pond, 0)}; common equity tier 1 (CET1) of ${mEur(fp, 0)}; total supervisory requirement ${pct(exigence, 1)} (4.5% pillar 1 + 2.5% conservation buffer + ${pct(coussin, 1)} of additional buffers)`
      : `exposition de ${mEur(expo, 0)} pondérée à ${pct(pond, 0)} ; fonds propres durs (CET1) de ${mEur(fp, 0)} ; exigence totale du superviseur ${pct(exigence, 1)} (4,5 % de pilier 1 + 2,5 % de coussin de conservation + ${pct(coussin, 1)} de coussins additionnels)`;
    const contexte = (en
      ? [
        `Capital committee, first item on the agenda: the retail book — thousands of household loans, none of them newsworthy, all of them capital-hungry: ${desc}. The CFO wants the Basel arithmetic in three moves: the RWA, the ratio, the verdict. "And in millions, please — the board does not think in percentages."`,
        `The corporate bank's book carries company paper at close to full weight — this is where the m5 rating scale becomes a capital bill: ${desc}. Before the pricing debate on next year's loans, the committee needs to know how much room the balance sheet actually has. RWA, CET1, margin against the requirement.`,
        `The subsidiary has been placed under review, and the supervisor's letter is unambiguous: figures by Friday, and no narrative. On the table: ${desc}. Your task is the bare chain — risk weights to RWA, RWA to ratio, ratio to verdict — because that is exactly the chain the supervisor will run.`,
      ]
      : [
        `Comité capital, premier point de l'ordre du jour : le book de détail — des milliers de crédits aux ménages, aucun ne fait la presse, tous consomment du capital : ${desc}. Le directeur financier veut l'arithmétique Bâle en trois gestes : les RWA, le ratio, le verdict. « Et en millions, s'il vous plaît — le conseil ne pense pas en pourcentages. »`,
        `Le book de la banque corporate porte du papier d'entreprise en pondération presque pleine — c'est ici que l'échelle de notation du m5 devient une facture de capital : ${desc}. Avant le débat de tarification des prêts de l'an prochain, le comité doit savoir quelle marge de manœuvre le bilan a vraiment. RWA, CET1, marge sur l'exigence.`,
        `La filiale est placée sous revue, et la lettre du superviseur est sans ambiguïté : des chiffres pour vendredi, et pas de récit. Sur la table : ${desc}. Votre tâche est la chaîne nue — pondérations vers RWA, RWA vers ratio, ratio vers verdict — parce que c'est exactement la chaîne que le superviseur déroulera.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The denominator: the RWA' : 'a) Le dénominateur : les RWA',
          enonce: en
            ? `Exposure ${mEur(expo, 0)}, risk weight ${pct(pond, 0)}. What are the risk-weighted assets, in €m?`
            : `Exposition ${mEur(expo, 0)}, pondération ${pct(pond, 0)}. Que valent les actifs pondérés du risque, en M€ ?`,
          reponse: rwa, tolerance: 0.005, unite: en ? '€m' : 'M€',
          etapes: [{
            titre: en ? 'RWA = exposure × risk weight' : 'RWA = exposition × pondération',
            contenu: en
              ? `${f(expo, 0)} × ${f(pond, 0)}% = **${mEur(rwa, 0)}** — the anchor: (100, 75) = 75m. The weight encodes the regulatory view of risk, and it is the m5 rating scale wearing a uniform: ~0% for AAA sovereigns, 20-50% for well-rated banks and corporates, 75% for retail, 100% and beyond for the rest (ch. 6). Every euro of weight is a euro that must be backed by capital.`
              : `${f(expo, 0)} × ${f(pond, 0)} % = **${mEur(rwa, 0)}** — l'ancre : (100, 75) = 75 M. La pondération encode la vision réglementaire du risque, et c'est l'échelle de notation du m5 en uniforme : ~0 % pour le souverain AAA, 20-50 % pour les banques et corporates bien notés, 75 % pour la clientèle de détail, 100 % et plus pour le reste (ch. 6). Chaque euro de pondération est un euro qu'il faut adosser à du capital.`,
          }],
          pieges: [en
            ? `Keeping the gross exposure ${mEur(expo, 0)} as the denominator of the ratio: that computes a LEVERAGE ratio, the other guardrail — the CET1 ratio wants the WEIGHTED assets, and the difference is the whole point of Basel's risk sensitivity.`
            : `Garder l'exposition brute de ${mEur(expo, 0)} comme dénominateur du ratio : cela calcule un ratio de LEVIER, l'autre garde-fou — le ratio CET1 veut les actifs PONDÉRÉS, et la différence est tout l'objet de la sensibilité au risque de Bâle.`],
        },
        {
          intitule: en ? 'b) The ratio: the CET1' : 'b) Le ratio : le CET1',
          enonce: en
            ? `With ${mEur(fp, 0)} of common equity tier 1 and the RWA of a), what is the CET1 ratio, in %?`
            : `Avec ${mEur(fp, 0)} de fonds propres durs et les RWA du a), quel est le ratio CET1, en % ?`,
          reponse: cet1, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'CET1 = hard capital / RWA × 100' : 'CET1 = capital dur / RWA × 100',
            contenu: en
              ? `${f(fp, 0)}/${f(rwa, 0)} × 100 = **${pct(cet1)}**. Calibrate it: Basel III demands 4.5% of CET1 plus buffers, and large European banks live at 12-15%. Set that against Lehman's ~31× leverage (m11): the entire post-2008 regulatory answer fits in this one fraction — more capital, of better quality, against risk-weighted assets.`
              : `${f(fp, 0)}/${f(rwa, 0)} × 100 = **${pct(cet1)}**. Étalonnez : Bâle III exige 4,5 % de CET1 plus les coussins, et les grandes banques européennes vivent à 12-15 %. Mettez cela en face du levier ~31 de Lehman (m11) : toute la réponse réglementaire d'après 2008 tient dans cette seule fraction — plus de capital, de meilleure qualité, face à des actifs pondérés du risque.`,
          }],
          pieges: [en
            ? `Dividing by the exposure: ${f(fp, 0)}/${f(expo, 0)} × 100 = ${pct(r2(ratioCet1Pct(fp, expo)))} understates the true ratio — the regulatory denominator is the RWA of a), not the balance-sheet total.`
            : `Diviser par l'exposition : ${f(fp, 0)}/${f(expo, 0)} × 100 = ${pct(r2(ratioCet1Pct(fp, expo)))} sous-estime le vrai ratio — le dénominateur réglementaire est le RWA du a), pas le total de bilan.`],
        },
        {
          intitule: en ? 'c) The verdict: the margin against the requirement' : "c) Le verdict : la marge sur l'exigence",
          enonce: en
            ? `The total requirement is ${pct(exigence, 1)}. By how many percentage points does the CET1 of b) exceed it (negative if below)?`
            : `L'exigence totale est de ${pct(exigence, 1)}. De combien de points de pourcentage le CET1 du b) la dépasse-t-il (négatif si en dessous) ?`,
          reponse: marge, tolerance: 0.05, toleranceMode: 'absolu', unite: 'points',
          etapes: [
            {
              titre: en ? 'Margin = CET1 − total requirement' : 'Marge = CET1 − exigence totale',
              contenu: en
                ? `${f(cet1)} − ${f(exigence, 1)} = **${f(marge)} points**. ${marge >= 0 ? `Verdict: COMPLIANT, with a cushion of ${f(marge)} points above the requirement — about ${mEur(capitalEcart, 0)} of capital headroom on ${mEur(rwa, 0)} of RWA, the balance sheet's real room for growth or for absorbing a bad year.` : `Verdict: NON-COMPLIANT — a shortfall of ${f(r2(-marge))} points, i.e. roughly ${mEur(capitalEcart, 0)} of CET1 to raise (or of RWA to shed) on ${mEur(rwa, 0)} of weighted assets. The supervisor will not debate the decimal: distribution restrictions first, remediation plan next.`}`
                : `${f(cet1)} − ${f(exigence, 1)} = **${f(marge)} points**. ${marge >= 0 ? `Verdict : CONFORME, avec un coussin de ${f(marge)} points au-dessus de l'exigence — environ ${mEur(capitalEcart, 0)} de capital d'avance sur ${mEur(rwa, 0)} de RWA, la vraie marge du bilan pour croître ou encaisser une mauvaise année.` : `Verdict : NON CONFORME — un déficit de ${f(r2(-marge))} points, soit environ ${mEur(capitalEcart, 0)} de CET1 à lever (ou de RWA à réduire) sur ${mEur(rwa, 0)} d'actifs pondérés. Le superviseur ne discutera pas la virgule : restrictions de distribution d'abord, plan de remédiation ensuite.`}`,
            },
            {
              titre: en ? 'Why the bar sits far above 4.5%' : 'Pourquoi la barre vit bien au-dessus de 4,5 %',
              contenu: en
                ? `The pillar-1 minimum of 4.5% is the floor of the floor: on top come the 2.5% conservation buffer, then the systemic and countercyclical buffers — here a total bar of ${pct(exigence, 1)}. The design intent is that buffers are USABLE in a crisis without triggering panic; the market's reality is that no bank wants to be seen dipping into them. Which is why large European banks hold 12-15%: the true binding constraint is the market's expectation, sitting on top of the supervisor's.`
                : `Le minimum de pilier 1 à 4,5 % est le plancher du plancher : au-dessus s'empilent le coussin de conservation de 2,5 %, puis les coussins systémique et contracyclique — ici une barre totale de ${pct(exigence, 1)}. L'intention du dispositif : des coussins UTILISABLES en crise sans déclencher de panique ; la réalité du marché : aucune banque ne veut être vue en train d'y puiser. C'est pourquoi les grandes banques européennes tiennent 12-15 % : la vraie contrainte est l'attente du marché, posée par-dessus celle du superviseur.`,
            },
          ],
          pieges: [en
            ? `Comparing with the bare 4.5% minimum and declaring a comfortable pass: the effective requirement here is ${pct(exigence, 1)} once buffers are stacked — the buffers are exactly where supervisory life actually happens.`
            : `Comparer au minimum nu de 4,5 % et déclarer une réussite confortable : l'exigence effective vaut ici ${pct(exigence, 1)} une fois les coussins empilés — les coussins sont exactement là où se joue la vie prudentielle.`],
        },
      ],
    };
  },
};

// __SUITE__
