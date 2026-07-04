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

/* ------------------------------------------------------------------ */
/* 5. m12-pb-05 — Le mandat du client — N2                             */
/* ------------------------------------------------------------------ */
const mandatDuClient: ProblemeMoule = {
  id: 'm12-pb-05', moduleId: M12,
  titre: 'Le mandat du client : deux fonds, un seul siège',
  titreEn: 'The client mandate: two funds, one seat',
  typeDeCas: 'sélection de fonds',
  typeDeCasEn: 'fund selection',
  difficulte: 2,
  scenarios: ['La caisse de retraite : le fonds sage contre le fonds nerveux', 'Le family office après le bull run : la performance brute a une odeur', 'Le mandat défensif : petit rendement, petit risque, grande question'],
  scenariosEn: ['The pension fund: the quiet fund against the nervous one', 'The family office after the bull run: raw performance has a smell', 'The defensive mandate: small return, small risk, big question'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : taux sans risque, fonds A (rendement, vol), fonds B (rendement, vol), écart au benchmark et tracking error du fonds A.
    const cfg = ([
      { rfMin: 2, rfMax: 3, raMin: 6.5, raMax: 8.5, vaMin: 10, vaMax: 14, rbMin: 9.5, rbMax: 12, vbMin: 22, vbMax: 30, spMin: -1, spMax: 2, teMin: 2, teMax: 4 },
      { rfMin: 2.5, rfMax: 3.5, raMin: 8, raMax: 11, vaMin: 14, vaMax: 18, rbMin: 12, rbMax: 16, vbMin: 26, vbMax: 34, spMin: -2, spMax: 1.5, teMin: 3, teMax: 6 },
      { rfMin: 2, rfMax: 3, raMin: 5.5, raMax: 7, vaMin: 7, vaMax: 10, rbMin: 8, rbMax: 11, vbMin: 18, vbMax: 24, spMin: 0, spMax: 2.5, teMin: 1.5, teMax: 3 },
    ] as const)[sIdx];
    const rf = randFloat(rng, cfg.rfMin, cfg.rfMax, 1);
    const ra = randFloat(rng, cfg.raMin, cfg.raMax, 1);
    const va = randInt(rng, cfg.vaMin, cfg.vaMax);
    const rb = randFloat(rng, cfg.rbMin, cfg.rbMax, 1);
    const vb = randInt(rng, cfg.vbMin, cfg.vbMax);
    const surp = randFloat(rng, cfg.spMin, cfg.spMax, 1);
    const te = randFloat(rng, cfg.teMin, cfg.teMax, 1);
    const sharpeA = r2(ratioSharpe(ra, rf, va));
    const sharpeB = r2(ratioSharpe(rb, rf, vb));
    const ir = r2(ratioInformation(surp, te));
    // Chaîné sur les Sharpe arrondis de a) et b).
    const ecart = r2(sharpeA - sharpeB);
    const aGagne = ecart >= 0;

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `fund A: ${pct(ra, 1)} return for ${pct(va, 0)} volatility; fund B: ${pct(rb, 1)} for ${pct(vb, 0)}; risk-free rate ${pct(rf, 1)}; fund A runs ${f(surp, 1)} point(s) per year against its benchmark (negative = behind) for a tracking error of ${pct(te, 1)}`
      : `fonds A : ${pct(ra, 1)} de rendement pour ${pct(va, 0)} de volatilité ; fonds B : ${pct(rb, 1)} pour ${pct(vb, 0)} ; taux sans risque ${pct(rf, 1)} ; le fonds A affiche ${f(surp, 1)} point(s) par an d'écart à son indice (négatif = en retard) pour une tracking error de ${pct(te, 1)}`;
    const contexte = (en
      ? [
        `The pension fund is filling ONE seat in its equity allocation, and two managers are in the corridor: the quiet fund A and the nervous fund B — ${desc}. The trustees see only one column: the raw return, where B wins. Your job is to make them see the other column: return PER unit of risk, then the information ratio, then a verdict in numbers.`,
        `Three years of bull market, and the family office's patriarch has fallen for the fund with the biggest number on the last line: ${desc}. The CIO hands you the file before the family meeting: "Raw performance after a bull run has a smell — deflate it by the risk taken. Sharpe, Sharpe, IR, verdict."`,
        `A defensive mandate: capital that must sleep at night. Two candidates — ${desc}. The consultant's warning is on the first page: "Small numbers flatter no one; risk-adjusted, they can beat the heroes." Prove or disprove it in four steps.`,
      ]
      : [
        `La caisse de retraite pourvoit UN siège dans son allocation actions, et deux gérants attendent dans le couloir : le fonds sage A et le fonds nerveux B — ${desc}. Les administrateurs ne regardent qu'une colonne : le rendement brut, où B gagne. Votre travail : leur faire voir l'autre colonne — le rendement PAR unité de risque, puis le ratio d'information, puis un verdict chiffré.`,
        `Trois ans de marché haussier, et le patriarche du family office s'est entiché du fonds au plus gros chiffre en dernière ligne : ${desc}. Le directeur des investissements vous tend le dossier avant le conseil de famille : « La performance brute après un bull run a une odeur — dégonflez-la par le risque pris. Sharpe, Sharpe, IR, verdict. »`,
        `Un mandat défensif : du capital qui doit dormir la nuit. Deux candidats — ${desc}. L'avertissement du consultant est en première page : « Les petits chiffres ne flattent personne ; ajustés du risque, ils peuvent battre les héros. » Démontrez-le — ou l'inverse — en quatre étapes.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The quiet fund: the Sharpe ratio of A' : 'a) Le fonds sage : le ratio de Sharpe de A',
          enonce: en
            ? `Fund A returns ${pct(ra, 1)} with ${pct(va, 0)} volatility; risk-free rate ${pct(rf, 1)}. What is its Sharpe ratio (unitless)?`
            : `Le fonds A rend ${pct(ra, 1)} pour ${pct(va, 0)} de volatilité ; taux sans risque ${pct(rf, 1)}. Quel est son ratio de Sharpe (sans unité) ?`,
          reponse: sharpeA, tolerance: 0.01, toleranceMode: 'absolu',
          etapes: [{
            titre: en ? 'Sharpe = (r − r_f) / σ: excess return per unit of risk' : 'Sharpe = (r − r_f)/σ : l\'excès de rendement par unité de risque',
            contenu: en
              ? `(${f(ra, 1)} − ${f(rf, 1)})/${f(va, 0)} = **${f(sharpeA)}** — the anchor: (8, 3, 10) = 0.5. Two reflexes: subtract the risk-free rate FIRST (the cash return is not a performance, it is the floor), and divide by the TOTAL volatility. Calibration: ~0.3-0.5 for a passive equity portfolio over long periods, above 1 excellent, above 2 suspicious (ch. 3).`
              : `(${f(ra, 1)} − ${f(rf, 1)})/${f(va, 0)} = **${f(sharpeA)}** — l'ancre : (8, 3, 10) = 0,5. Deux réflexes : retrancher D'ABORD le taux sans risque (le rendement du cash n'est pas une performance, c'est le plancher), et diviser par la volatilité TOTALE. Étalonnage : ~0,3-0,5 pour un portefeuille actions passif sur longue période, au-dessus de 1 excellent, au-dessus de 2 suspect (ch. 3).`,
          }],
          pieges: [en
            ? `Dividing the raw return: ${f(ra, 1)}/${f(va, 0)} = ${f(r2(ra / va))} rewards the fund for the ${pct(rf, 1)} that a savings account also pays — the Sharpe prices only what the risk BOUGHT beyond cash.`
            : `Diviser le rendement brut : ${f(ra, 1)}/${f(va, 0)} = ${f(r2(ra / va))} récompense le fonds pour les ${pct(rf, 1)} qu'un livret paie aussi — le Sharpe ne valorise que ce que le risque a ACHETÉ au-delà du cash.`],
        },
        {
          intitule: en ? 'b) The nervous fund: the Sharpe ratio of B' : 'b) Le fonds nerveux : le ratio de Sharpe de B',
          enonce: en
            ? `Fund B returns ${pct(rb, 1)} with ${pct(vb, 0)} volatility, same risk-free rate. What is its Sharpe ratio (unitless)?`
            : `Le fonds B rend ${pct(rb, 1)} pour ${pct(vb, 0)} de volatilité, même taux sans risque. Quel est son ratio de Sharpe (sans unité) ?`,
          reponse: sharpeB, tolerance: 0.01, toleranceMode: 'absolu',
          etapes: [{
            titre: en ? 'Same formula, other diet' : 'Même formule, autre régime',
            contenu: en
              ? `(${f(rb, 1)} − ${f(rf, 1)})/${f(vb, 0)} = **${f(sharpeB)}**. Fund B earns ${f(r2(rb - ra), 1)} point(s) more than A in raw return — but it pays for them with ${f(vb - va, 0)} extra points of volatility. The Sharpe is precisely the exchange rate between the two: whether the extra return covers the extra risk is not an opinion, it is this division. Remember LTCM: a Sharpe above 4 before 1998 — a beautiful ratio can also be a risk not yet realised (m11 ch. 3).`
              : `(${f(rb, 1)} − ${f(rf, 1)})/${f(vb, 0)} = **${f(sharpeB)}**. Le fonds B gagne ${f(r2(rb - ra), 1)} point(s) de rendement brut de plus que A — mais il les paie de ${f(vb - va, 0)} points de volatilité en plus. Le Sharpe est exactement le taux de change entre les deux : savoir si le rendement en plus couvre le risque en plus n'est pas une opinion, c'est cette division. Souvenez-vous de LTCM : un Sharpe au-dessus de 4 avant 1998 — un beau ratio peut aussi être un risque pas encore réalisé (m11 ch. 3).`,
          }],
          pieges: [en
            ? `Stopping at "${pct(rb, 1)} beats ${pct(ra, 1)}": the raw return ignores the price paid in risk — it is exactly the column the trustees already saw, and exactly the one that decides nothing.`
            : `S'arrêter à « ${pct(rb, 1)} bat ${pct(ra, 1)} » : le rendement brut ignore le prix payé en risque — c'est exactement la colonne que les administrateurs ont déjà vue, et exactement celle qui ne décide rien.`],
        },
        {
          intitule: en ? 'c) The active skill: the information ratio of A' : 'c) Le talent actif : le ratio d\'information de A',
          enonce: en
            ? `Fund A runs ${f(surp, 1)} point(s) per year against its benchmark (negative = behind) with a tracking error of ${pct(te, 1)}. What is its information ratio (unitless)?`
            : `Le fonds A affiche ${f(surp, 1)} point(s) par an d'écart à son indice (négatif = en retard) pour une tracking error de ${pct(te, 1)}. Quel est son ratio d'information (sans unité) ?`,
          reponse: ir, tolerance: 0.01, toleranceMode: 'absolu',
          etapes: [{
            titre: en ? 'IR = outperformance / tracking error: the active manager\'s Sharpe' : 'IR = surperformance / tracking error : le Sharpe du gérant actif',
            contenu: en
              ? `${f(surp, 1)}/${f(te, 1)} = **${f(ir)}** — the anchor: (2, 4) = 0.5. Same logic as the Sharpe, other benchmark: not cash but the INDEX the mandate names. The tracking error is chosen, not suffered — it is the mandate's budget of freedom, and the IR says what each unit of that budget earned. Above 0.5 over a long period is already very good (ch. 3). ${ir >= 0 ? 'Here the active bets paid.' : 'Here the active bets cost money: freedom was spent, nothing was bought.'}`
              : `${f(surp, 1)}/${f(te, 1)} = **${f(ir)}** — l'ancre : (2, 4) = 0,5. Même logique que le Sharpe, autre étalon : pas le cash, mais l'INDICE que le mandat désigne. La tracking error se choisit, elle ne se subit pas — c'est le budget de liberté du mandat, et l'IR dit ce que chaque unité de ce budget a rapporté. Au-dessus de 0,5 sur longue durée, c'est déjà très bon (ch. 3). ${ir >= 0 ? 'Ici, les paris actifs ont payé.' : 'Ici, les paris actifs ont coûté : la liberté a été dépensée, rien n\'a été acheté.'}`,
          }],
          pieges: [en
            ? `Subtracting the risk-free rate as in a): the IR compares with the INDEX, not with cash — (${f(surp, 1)} − ${f(rf, 1)})/${f(te, 1)} mixes the two benchmarks and answers no one's question.`
            : `Retrancher le taux sans risque comme au a) : l'IR se compare à l'INDICE, pas au cash — (${f(surp, 1)} − ${f(rf, 1)})/${f(te, 1)} mélange les deux étalons et ne répond à la question de personne.`],
        },
        {
          intitule: en ? 'd) The verdict: the Sharpe gap' : 'd) Le verdict : l\'écart de Sharpe',
          enonce: en
            ? `Gap between the rounded Sharpes of a) and b) — Sharpe(A) − Sharpe(B). The seat goes to the better risk-adjusted return: what is the gap (negative if B wins)?`
            : `Écart entre les Sharpe arrondis du a) et du b) — Sharpe(A) − Sharpe(B). Le siège va au meilleur rendement ajusté du risque : que vaut l'écart (négatif si B gagne) ?`,
          reponse: ecart, tolerance: 0.02, toleranceMode: 'absolu',
          etapes: [
            {
              titre: en ? 'Gap = Sharpe(A) − Sharpe(B)' : 'Écart = Sharpe(A) − Sharpe(B)',
              contenu: en
                ? `${f(sharpeA)} − ${f(sharpeB)} = **${f(ecart)}**. ${aGagne ? `Verdict: fund A takes the seat — each unit of risk is better paid there, ${f(ecart)} point(s) of Sharpe better, even though its raw return of ${pct(ra, 1)} looks duller than B's ${pct(rb, 1)}.` : `Verdict: fund B takes the seat — despite the noise, its extra return more than covers its extra risk, by ${f(r2(-ecart))} point(s) of Sharpe.`} That is the whole discipline: the mandate does not buy a return, it buys a PRICE of risk.`
                : `${f(sharpeA)} − ${f(sharpeB)} = **${f(ecart)}**. ${aGagne ? `Verdict : le fonds A prend le siège — chaque unité de risque y est mieux payée, de ${f(ecart)} point(s) de Sharpe, alors même que son rendement brut de ${pct(ra, 1)} paraît plus terne que les ${pct(rb, 1)} de B.` : `Verdict : le fonds B prend le siège — malgré le bruit, son rendement en plus couvre son risque en plus, et au-delà : ${f(r2(-ecart))} point(s) de Sharpe d'avance.`} C'est toute la discipline : le mandat n'achète pas un rendement, il achète un PRIX du risque.`,
            },
            {
              titre: en ? 'What the committee should still ask' : 'Ce que le comité doit encore demander',
              contenu: en
                ? `Two caveats before signing. The Sharpe is symmetric: it punishes upside volatility like downside — two funds with the same Sharpe can hide very different worst months. And the window matters: a Sharpe measured over a bull run flatters high-beta funds mechanically. Hence the pairing with c): the IR of ${f(ir)} says whether the manager's FREEDOM earned its keep — a different question from whether his ASSET CLASS did.`
                : `Deux réserves avant de signer. Le Sharpe est symétrique : il punit la volatilité à la hausse comme à la baisse — deux fonds au même Sharpe peuvent cacher des pires mois très différents. Et la fenêtre compte : un Sharpe mesuré sur un marché haussier flatte mécaniquement les fonds à gros bêta. D'où l'attelage avec le c) : l'IR de ${f(ir)} dit si la LIBERTÉ du gérant a mérité son salaire — question distincte de savoir si sa CLASSE D'ACTIFS l'a fait.`,
            },
          ],
          pieges: [en
            ? `Awarding the seat on the raw return gap ${f(r2(rb - ra), 1)} point(s) in favour of B: without dividing by the risk, that number cannot rank anything — it is the Sharpe gap of ${f(ecart)} that signs the mandate.`
            : `Attribuer le siège sur l'écart de rendement brut, ${f(r2(rb - ra), 1)} point(s) en faveur de B : sans division par le risque, ce nombre ne classe rien — c'est l'écart de Sharpe de ${f(ecart)} qui signe le mandat.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 6. m12-pb-06 — Le choc de marché — N2                               */
/* ------------------------------------------------------------------ */
const chocDeMarche: ProblemeMoule = {
  id: 'm12-pb-06', moduleId: M12,
  titre: 'Le choc de marché : la perte, le capital, le verdict',
  titreEn: 'The market shock: the loss, the capital, the verdict',
  typeDeCas: 'stress test',
  typeDeCasEn: 'stress testing',
  difficulte: 2,
  scenarios: ['La grande banque : un choc de marché contre un bilan épais', 'La banque moyenne : le book de trading trop gros pour le bilan', 'La revue du superviseur : rejouer 2008 sur la filiale'],
  scenariosEn: ['The large bank: a market shock against a thick balance sheet', 'The mid-sized bank: a trading book too big for the balance sheet', "The supervisor's review: replaying 2008 on the subsidiary"],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : book (M), choc (%), bêta, RWA (M), CET1 de départ (%), coussins au-dessus de 7 %.
    const cfg = ([
      { vMin: 80, vMax: 150, chMin: -20, chMax: -15, bMin: 1.0, bMax: 1.3, rwMin: 1200, rwMax: 2000, ctMin: 12, ctMax: 14.5, cousMin: 1, cousMax: 2 },
      { vMin: 120, vMax: 180, chMin: -26, chMax: -18, bMin: 1.0, bMax: 1.3, rwMin: 800, rwMax: 1400, ctMin: 10, ctMax: 11.5, cousMin: 1.5, cousMax: 3 },
      { vMin: 100, vMax: 160, chMin: -35, chMax: -25, bMin: 1.0, bMax: 1.25, rwMin: 1000, rwMax: 1800, ctMin: 10.5, ctMax: 13, cousMin: 2, cousMax: 3 },
    ] as const)[sIdx];
    const valeur = randInt(rng, cfg.vMin, cfg.vMax);
    const choc = randInt(rng, cfg.chMin, cfg.chMax);
    const beta = randFloat(rng, cfg.bMin, cfg.bMax, 1);
    const rwa = randInt(rng, cfg.rwMin, cfg.rwMax);
    const cet1T = randFloat(rng, cfg.ctMin, cfg.ctMax, 1);
    const coussin = randFloat(rng, cfg.cousMin, cfg.cousMax, 1);
    const exigence = r2(4.5 + 2.5 + coussin);
    const fp = Math.round(rwa * cet1T / 100);
    const perte = r2(perteStressMillions(valeur, choc, beta));
    // Chaîné sur la perte arrondie du a), puis sur le capital arrondi du b).
    const fpApres = r2(fp + perte);
    const cet1Apres = r2(ratioCet1Pct(fpApres, rwa));
    const marge = r2(cet1Apres - exigence);
    const capitalEcart = r2(Math.abs(marge) * rwa / 100);

    const { en, f, pct, mEur } = outils(langue);
    const desc = en
      ? `trading book of ${mEur(valeur, 0)} with a beta of ${f(beta, 1)}; stress scenario: ${pct(choc, 0)} on the market index; on the balance sheet, ${mEur(fp, 0)} of CET1 against ${mEur(rwa, 0)} of RWA; total supervisory requirement ${pct(exigence, 1)} (4.5% + 2.5% conservation + ${pct(coussin, 1)} of additional buffers)`
      : `book de trading de ${mEur(valeur, 0)} au bêta de ${f(beta, 1)} ; scénario de stress : ${pct(choc, 0)} sur l'indice de marché ; au bilan, ${mEur(fp, 0)} de CET1 face à ${mEur(rwa, 0)} de RWA ; exigence totale du superviseur ${pct(exigence, 1)} (4,5 % + 2,5 % de conservation + ${pct(coussin, 1)} de coussins additionnels)`;
    const contexte = (en
      ? [
        `Annual stress-test season at the large bank, and your line of the exercise is the equity trading book: ${desc}. The CRO's instruction is a chain, not a formula: "The loss, the capital after the loss, the ratio after the capital, the verdict after the ratio. Four numbers, in that order — the board reads nothing else."`,
        `The mid-sized bank grew its trading book faster than its equity, and this quarter the risk committee finally asks the uncomfortable question: ${desc}. Run the shock through the balance sheet: how much does the book lose, what remains of the capital, does the ratio still clear the bar?`,
        `The supervisor's letter is one paragraph long: replay a 2008-grade market shock on the subsidiary and report the capital trajectory. On your desk: ${desc}. No probabilities, no model debate — a scenario, a balance sheet, and the arithmetic between them (ch. 5 and 6).`,
      ]
      : [
        `Saison des stress tests annuels à la grande banque, et votre ligne de l'exercice est le book de trading actions : ${desc}. La consigne du directeur des risques est une chaîne, pas une formule : « La perte, le capital après la perte, le ratio après le capital, le verdict après le ratio. Quatre nombres, dans cet ordre — le conseil ne lit rien d'autre. »`,
        `La banque moyenne a fait grossir son book de trading plus vite que ses fonds propres, et ce trimestre le comité des risques pose enfin la question qui fâche : ${desc}. Faites passer le choc à travers le bilan : combien perd le book, que reste-t-il du capital, le ratio franchit-il encore la barre ?`,
        `La lettre du superviseur tient en un paragraphe : rejouer un choc de marché calibre 2008 sur la filiale et rendre la trajectoire de capital. Sur votre bureau : ${desc}. Pas de probabilités, pas de débat de modèle — un scénario, un bilan, et l'arithmétique entre les deux (ch. 5 et 6).`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The scenario bites: the stress loss' : 'a) Le scénario mord : la perte de stress',
          enonce: en
            ? `Book of ${mEur(valeur, 0)}, beta ${f(beta, 1)}, market shock of ${pct(choc, 0)}. What is the stress loss, SIGNED (negative), in €m?`
            : `Book de ${mEur(valeur, 0)}, bêta ${f(beta, 1)}, choc de marché de ${pct(choc, 0)}. Quelle est la perte de stress, SIGNÉE (négative), en M€ ?`,
          reponse: perte, tolerance: 0.005, unite: en ? '€m' : 'M€',
          etapes: [{
            titre: en ? 'Loss = V × shock × β' : 'Perte = V × choc × β',
            contenu: en
              ? `${f(valeur, 0)} × (${pct(choc, 0)}) × ${f(beta, 1)} = **${mEur(perte)}** — the anchor: (100, −20, 1.2) = −24m. Note what a stress test is NOT: no probability, no confidence level — a SCENARIO, deliberately crude. The virtue is in the question ("what if the market fell ${pct(choc, 0)}?"), not in the refinement of the model. That crudeness is exactly what makes it the VaR's mandatory companion: the VaR stops at the threshold, the stress test walks past it (ch. 5).`
              : `${f(valeur, 0)} × (${pct(choc, 0)}) × ${f(beta, 1)} = **${mEur(perte)}** — l'ancre : (100, −20, 1,2) = −24 M. Notez ce qu'un stress test n'est PAS : pas de probabilité, pas de seuil de confiance — un SCÉNARIO, volontairement fruste. La vertu est dans la question (« et si le marché faisait ${pct(choc, 0)} ? »), pas dans le raffinement du modèle. Cette rusticité est exactement ce qui en fait le compagnon obligatoire de la VaR : la VaR s'arrête au seuil, le stress test marche au-delà (ch. 5).`,
          }],
          pieges: [en
            ? `Forgetting the beta: ${f(valeur, 0)} × (${pct(choc, 0)}) = ${mEur(r2(valeur * choc / 100))} assumes the book moves one-for-one with the market — with a beta of ${f(beta, 1)}, it amplifies the shock.`
            : `Oublier le bêta : ${f(valeur, 0)} × (${pct(choc, 0)}) = ${mEur(r2(valeur * choc / 100))} suppose que le book bouge un pour un avec le marché — avec un bêta de ${f(beta, 1)}, il amplifie le choc.`],
        },
        {
          intitule: en ? 'b) The balance sheet absorbs: the capital after the shock' : 'b) Le bilan encaisse : le capital après le choc',
          enonce: en
            ? `The CET1 of ${mEur(fp, 0)} absorbs the loss of a). How much hard capital remains, in €m?`
            : `Le CET1 de ${mEur(fp, 0)} encaisse la perte du a). Combien de capital dur reste-t-il, en M€ ?`,
          reponse: fpApres, tolerance: 0.005, unite: en ? '€m' : 'M€',
          etapes: [{
            titre: en ? 'Capital after = capital before + signed loss' : 'Capital après = capital avant + perte signée',
            contenu: en
              ? `${f(fp, 0)} + (${f(perte)}) = **${mEur(fpApres)}**. This is the reason capital exists: equity is the shock absorber that takes the loss BEFORE depositors and creditors feel anything. Every million lost by the book is a million of CET1 gone — the trading desk's bad day lands directly on the ratio's numerator, which is why supervisors size the buffer against exactly these scenarios (ch. 6).`
              : `${f(fp, 0)} + (${f(perte)}) = **${mEur(fpApres)}**. C'est la raison d'être du capital : les fonds propres sont l'amortisseur qui prend la perte AVANT que déposants et créanciers ne sentent quoi que ce soit. Chaque million perdu par le book est un million de CET1 en moins — la mauvaise journée du desk atterrit directement au numérateur du ratio, et c'est exactement contre ces scénarios que le superviseur dimensionne le coussin (ch. 6).`,
          }],
          pieges: [en
            ? `Getting the sign wrong and ADDING ${mEur(r2(Math.abs(perte)))}: a stress loss destroys capital — the capital after the shock must be SMALLER than ${mEur(fp, 0)}, a five-second sanity check.`
            : `Se tromper de signe et AJOUTER ${mEur(r2(Math.abs(perte)))} : une perte de stress détruit du capital — le capital après choc doit être PLUS PETIT que ${mEur(fp, 0)}, vérification de cinq secondes.`],
        },
        {
          intitule: en ? 'c) The ratio after the storm: the new CET1' : 'c) Le ratio après la tempête : le nouveau CET1',
          enonce: en
            ? `With the capital of b) and RWA assumed unchanged at ${mEur(rwa, 0)}, what is the CET1 ratio after the shock, in %?`
            : `Avec le capital du b) et des RWA supposés inchangés à ${mEur(rwa, 0)}, quel est le ratio CET1 après le choc, en % ?`,
          reponse: cet1Apres, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'CET1 after = remaining capital / RWA × 100' : 'CET1 après = capital restant / RWA × 100',
            contenu: en
              ? `${f(fpApres)}/${f(rwa, 0)} × 100 = **${pct(cet1Apres)}**, down from ${pct(cet1T, 1)} before the shock — the loss costs ${f(r2(cet1T - cet1Apres))} points of ratio. "RWA unchanged" is the conventional simplification and it is OPTIMISTIC: in a real crisis the denominator rises too (downgrades inflate risk weights, m5), so the true ratio falls from both ends at once. Calibration: large European banks live at 12-15% precisely to survive this squeeze.`
              : `${f(fpApres)}/${f(rwa, 0)} × 100 = **${pct(cet1Apres)}**, contre ${pct(cet1T, 1)} avant le choc — la perte coûte ${f(r2(cet1T - cet1Apres))} points de ratio. « RWA inchangés » est la simplification conventionnelle, et elle est OPTIMISTE : en vraie crise le dénominateur monte aussi (les dégradations gonflent les pondérations, m5), donc le vrai ratio baisse par les deux bouts à la fois. Étalonnage : les grandes banques européennes vivent à 12-15 % précisément pour survivre à cet étau.`,
          }],
          pieges: [en
            ? `Dividing the LOSS by the RWA and subtracting from memory: cleaner to rebuild the fraction with the capital of b) — the ratio is a stock over a stock, not a running total of flows.`
            : `Diviser la PERTE par les RWA et soustraire de tête : plus propre de reconstruire la fraction avec le capital du b) — le ratio est un stock sur un stock, pas un cumul de flux.`],
        },
        {
          intitule: en ? 'd) The verdict: compliant after the shock?' : 'd) Le verdict : conforme après le choc ?',
          enonce: en
            ? `The total requirement is ${pct(exigence, 1)}. By how many percentage points does the post-shock CET1 of c) exceed it (negative if below)?`
            : `L'exigence totale est de ${pct(exigence, 1)}. De combien de points de pourcentage le CET1 après choc du c) la dépasse-t-il (négatif si en dessous) ?`,
          reponse: marge, tolerance: 0.05, toleranceMode: 'absolu', unite: 'points',
          etapes: [
            {
              titre: en ? 'Margin = post-shock CET1 − requirement' : 'Marge = CET1 après choc − exigence',
              contenu: en
                ? `${f(cet1Apres)} − ${f(exigence, 1)} = **${f(marge)} points**. ${marge >= 0 ? `Verdict: the balance sheet HOLDS — after a ${pct(choc, 0)} shock, ${f(marge)} points of cushion remain, about ${mEur(capitalEcart, 0)} of capital headroom. This is precisely what the stress test is for: proving the buffer BEFORE the crisis does.` : `Verdict: the bar is BROKEN — a shortfall of ${f(r2(-marge))} points, roughly ${mEur(capitalEcart, 0)} of missing CET1. In supervisory practice this means restricted distributions and a remediation plan; in the stress-test exercise, it means the scenario found the balance sheet's edge.`}`
                : `${f(cet1Apres)} − ${f(exigence, 1)} = **${f(marge)} points**. ${marge >= 0 ? `Verdict : le bilan TIENT — après un choc de ${pct(choc, 0)}, il reste ${f(marge)} points de coussin, soit environ ${mEur(capitalEcart, 0)} de capital d'avance. C'est exactement à cela que sert le stress test : prouver le coussin AVANT que la crise ne s'en charge.` : `Verdict : la barre est CASSÉE — un déficit de ${f(r2(-marge))} points, environ ${mEur(capitalEcart, 0)} de CET1 manquant. En pratique prudentielle : distributions restreintes et plan de remédiation ; dans l'exercice de stress, cela veut dire que le scénario a trouvé le bord du bilan.`}`,
            },
            {
              titre: en ? 'Why this chain is the whole post-2008 doctrine' : 'Pourquoi cette chaîne est toute la doctrine d\'après 2008',
              contenu: en
                ? `Scenario → loss → capital → ratio → verdict: this is the exact chain regulators institutionalised after 2008, because the crisis showed that banks passing every POINT-IN-TIME ratio could still die of one bad TRAJECTORY. Lehman ran at ~31× leverage (m11); today's doctrine sizes the buffer so the ratio still clears the bar AT THE BOTTOM of the scenario, not just on a sunny reporting date.`
                : `Scénario → perte → capital → ratio → verdict : c'est la chaîne exacte que les régulateurs ont institutionnalisée après 2008, parce que la crise a montré que des banques conformes à chaque ratio INSTANTANÉ pouvaient mourir d'une seule mauvaise TRAJECTOIRE. Lehman tournait à un levier de ~31 (m11) ; la doctrine actuelle dimensionne le coussin pour que le ratio franchisse la barre AU FOND du scénario, pas seulement un jour d'arrêté ensoleillé.`,
            },
          ],
          pieges: [en
            ? `Comparing with the bare 4.5% pillar-1 minimum: the effective bar is ${pct(exigence, 1)} with buffers stacked — and the buffers exist precisely to be measured against days like this scenario.`
            : `Comparer au minimum nu de 4,5 % du pilier 1 : la barre effective vaut ${pct(exigence, 1)} coussins empilés — et les coussins existent précisément pour être mesurés contre des jours comme ce scénario.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 7. m12-pb-07 — Frais et horizon — N2                                */
/* ------------------------------------------------------------------ */
const fraisEtHorizon: ProblemeMoule = {
  id: 'm12-pb-07', moduleId: M12,
  titre: 'Frais et horizon : la facture que personne ne voit',
  titreEn: 'Fees and horizon: the invoice nobody sees',
  typeDeCas: 'frais et épargne longue',
  typeDeCasEn: 'fees and long-horizon saving',
  difficulte: 2,
  scenarios: ["Le jeune cadre : le contrat maison contre l'ETF", 'La donation : un capital avec quarante ans devant lui', 'Le quadragénaire pressé : vingt ans pour compter'],
  scenariosEn: ['The young executive: the house product against the ETF', 'The family gift: a capital with forty years ahead of it', 'The hurried forty-something: twenty years to count'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : mise (k€), rendement brut, frais du contrat, frais de l'ETF, horizon (années).
    const cfg = ([
      { kMin: 20, kMax: 60, rMin: 6.5, rMax: 7.5, faMin: 1.8, faMax: 2.2, feMin: 0.15, feMax: 0.25, nMin: 28, nMax: 32 },
      { kMin: 10, kMax: 30, rMin: 6, rMax: 7, faMin: 1.9, faMax: 2.4, feMin: 0.18, feMax: 0.3, nMin: 35, nMax: 40 },
      { kMin: 80, kMax: 200, rMin: 5.5, rMax: 6.5, faMin: 1.6, faMax: 2.1, feMin: 0.15, feMax: 0.25, nMin: 20, nMax: 25 },
    ] as const)[sIdx];
    const capital = randInt(rng, cfg.kMin, cfg.kMax) * 1000;
    const rBrut = randFloat(rng, cfg.rMin, cfg.rMax, 1);
    const fraisA = randFloat(rng, cfg.faMin, cfg.faMax, 1);
    const fraisE = randFloat(rng, cfg.feMin, cfg.feMax, 2);
    const annees = randInt(rng, cfg.nMin, cfg.nMax);
    const vNetA = r2(valeurNetteDeFrais(capital, rBrut, fraisA, annees));
    const vNetE = r2(valeurNetteDeFrais(capital, rBrut, fraisE, annees));
    // Chaîné sur les valeurs arrondies de a) et b), puis sur le coût arrondi de c).
    const cout = r2(vNetE - vNetA);
    const mult = r2(cout / capital);
    const fraisAn1 = r2(capital * fraisA / 100);

    const { en, f, pct, eur } = outils(langue);
    const desc = en
      ? `${eur(capital)} invested for ${f(annees, 0)} years at ${pct(rBrut, 1)} gross per year; the house product charges ${pct(fraisA, 1)} in annual fees, the index ETF ${pct(fraisE, 2)}`
      : `${eur(capital)} investis ${f(annees, 0)} ans à ${pct(rBrut, 1)} brut par an ; le contrat maison prélève ${pct(fraisA, 1)} de frais annuels, l'ETF indiciel ${pct(fraisE, 2)}`;
    const contexte = (en
      ? [
        `A young executive walks into the branch with a bonus to invest, and walks out with two brochures: ${desc}. The adviser called the fee difference "marginal". You have a spreadsheet and ${f(annees, 0)} years: compute both endings, then the price of the word "marginal".`,
        `A family gift, formally invested for the grandchildren: ${desc}. Nobody in the family will touch this money for decades — which makes it the perfect laboratory for the one force stronger than any market call: compounding, working for the investor on one line and for the fee collector on the other.`,
        `Forty-something, late start, and a lump sum to place: ${desc}. "At my age the fees hardly matter any more," he says. Shorter horizon, bigger capital — check whether the sentence survives the arithmetic.`,
      ]
      : [
        `Un jeune cadre entre à l'agence avec une prime à placer, et en ressort avec deux plaquettes : ${desc}. Le conseiller a qualifié l'écart de frais de « marginal ». Vous avez un tableur et ${f(annees, 0)} ans : calculez les deux fins de l'histoire, puis le prix du mot « marginal ».`,
        `Une donation familiale, placée dans les formes pour les petits-enfants : ${desc}. Personne dans la famille ne touchera cet argent avant des décennies — le laboratoire parfait pour la seule force plus puissante que n'importe quelle vue de marché : la composition, qui travaille pour l'investisseur sur une ligne et pour l'encaisseur de frais sur l'autre.`,
        `La quarantaine, un départ tardif, et un capital à placer d'un coup : ${desc}. « À mon âge, les frais ne comptent presque plus », dit-il. Horizon plus court, capital plus gros — vérifiez si la phrase survit à l'arithmétique.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The house product: the net value at full fees' : 'a) Le contrat maison : la valeur nette à frais pleins',
          enonce: en
            ? `${eur(capital)} at ${pct(rBrut, 1)} gross, minus ${pct(fraisA, 1)} of annual fees, for ${f(annees, 0)} years. Final value, in €?`
            : `${eur(capital)} à ${pct(rBrut, 1)} brut, moins ${pct(fraisA, 1)} de frais annuels, pendant ${f(annees, 0)} ans. Valeur finale, en € ?`,
          reponse: vNetA, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'V = C × (1 + (r − f)/100)^n: the fees compound too' : 'V = C × (1 + (r − f)/100)^n : les frais composent aussi',
            contenu: en
              ? `${f(capital, 0)} × (1 + ${f(r2(rBrut - fraisA))}/100)^${f(annees, 0)} = **${eur(vNetA)}**. The fee is subtracted from the rate BEFORE compounding: the investor does not compound at ${pct(rBrut, 1)}, but at ${pct(r2(rBrut - fraisA))} — every year, forever. The library's anchor: 100 for 30 years at 7% gross make 761, but only 432 net of 2% fees, WITHOUT any single year ever looking expensive (ch. 4).`
              : `${f(capital, 0)} × (1 + ${f(r2(rBrut - fraisA))}/100)^${f(annees, 0)} = **${eur(vNetA)}**. Les frais se retranchent du taux AVANT la composition : l'investisseur ne compose pas à ${pct(rBrut, 1)}, mais à ${pct(r2(rBrut - fraisA))} — chaque année, pour toujours. L'ancre de la bibliothèque : 100 sur 30 ans à 7 % brut font 761, mais seulement 432 nets de 2 % de frais, SANS qu'aucune année isolée ne paraisse chère (ch. 4).`,
          }],
          pieges: [en
            ? `Compounding gross then removing the fees once at the end: that treats ${pct(fraisA, 1)} as a one-off exit charge — the fee is levied every year on a growing base, which is precisely why it compounds against you.`
            : `Composer en brut puis retirer les frais une fois à la fin : c'est traiter les ${pct(fraisA, 1)} comme un droit de sortie unique — les frais sont prélevés chaque année sur une base qui grossit, et c'est précisément pourquoi ils composent contre vous.`],
        },
        {
          intitule: en ? 'b) The ETF: the same journey at index fees' : "b) L'ETF : le même trajet aux frais de l'indiciel",
          enonce: en
            ? `Same capital, same gross return, same horizon, but ${pct(fraisE, 2)} of annual fees. Final value, in €?`
            : `Même capital, même rendement brut, même horizon, mais ${pct(fraisE, 2)} de frais annuels. Valeur finale, en € ?`,
          reponse: vNetE, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'Same formula, a rate almost intact' : 'Même formule, un taux presque intact',
            contenu: en
              ? `${f(capital, 0)} × (1 + ${f(r2(rBrut - fraisE))}/100)^${f(annees, 0)} = **${eur(vNetE)}**. At ${pct(fraisE, 2)}, the ETF leaves the compounding engine nearly untouched — the anchor: the 0.2% ETF leaves 719.68 of the gross 761. This is the industrial argument for passive investing (ch. 4): before any talent debate, the index fund wins by NOT losing the compounding of ${f(r2(fraisA - fraisE))} points of fees per year.`
              : `${f(capital, 0)} × (1 + ${f(r2(rBrut - fraisE))}/100)^${f(annees, 0)} = **${eur(vNetE)}**. À ${pct(fraisE, 2)}, l'ETF laisse le moteur de composition presque intact — l'ancre : l'ETF à 0,2 % laisse 719,68 des 761 bruts. C'est l'argument industriel de la gestion passive (ch. 4) : avant tout débat de talent, le fonds indiciel gagne en NE PERDANT PAS la composition de ${f(r2(fraisA - fraisE))} points de frais par an.`,
          }],
          pieges: [en
            ? `Reasoning "ten times cheaper on a small number, so a small difference": the fee gap works on the RATE, and the rate works on ${f(annees, 0)} years of exponent — smallness in year one says nothing about year ${f(annees, 0)}.`
            : `Raisonner « dix fois moins cher sur un petit nombre, donc petite différence » : l'écart de frais travaille sur le TAUX, et le taux travaille sur ${f(annees, 0)} ans d'exposant — la petitesse de l'année un ne dit rien de l'année ${f(annees, 0)}.`],
        },
        {
          intitule: en ? 'c) The invoice: the cost of the fees' : 'c) La facture : le coût des frais',
          enonce: en
            ? `Difference between b) and a): what did the ${pct(fraisA, 1)} product cost compared with the ETF, over the whole journey, in €?`
            : `Différence entre le b) et le a) : qu'a coûté le contrat à ${pct(fraisA, 1)} par rapport à l'ETF, sur tout le trajet, en € ?`,
          reponse: cout, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'Cost = net value at ETF fees − net value at full fees' : 'Coût = valeur nette aux frais ETF − valeur nette à frais pleins',
            contenu: en
              ? `${f(vNetE, 0)} − ${f(vNetA, 0)} = **${eur(cout)}**. That is the invoice nobody ever receives: no statement line ever shows it, because each year's charge looked small — about ${eur(fraisAn1)} in year one. The gap is not the sum of the annual charges: it is the annual charges PLUS everything they would have earned had they stayed invested. Compounding collects for the fee-taker with the same patience it shows the investor.`
              : `${f(vNetE, 0)} − ${f(vNetA, 0)} = **${eur(cout)}**. Voilà la facture que personne ne reçoit jamais : aucune ligne de relevé ne l'affiche, parce que le prélèvement de chaque année a paru petit — environ ${eur(fraisAn1)} la première année. L'écart n'est pas la somme des prélèvements annuels : c'est les prélèvements PLUS tout ce qu'ils auraient rapporté s'ils étaient restés investis. La composition encaisse pour le préleveur avec la même patience qu'elle montre à l'investisseur.`,
          }],
          pieges: [en
            ? `Estimating the cost as ${f(annees, 0)} × the first-year charge ≈ ${eur(r2(fraisAn1 * annees))}: linear extrapolation misses the compounding of the forgone gains — the true invoice is much larger.`
            : `Estimer le coût à ${f(annees, 0)} × le prélèvement de la première année ≈ ${eur(r2(fraisAn1 * annees))} : l'extrapolation linéaire rate la composition des gains manqués — la vraie facture est bien plus lourde.`],
        },
        {
          intitule: en ? 'd) The scale: the invoice in multiples of the stake' : 'd) L\'échelle : la facture en multiples de la mise',
          enonce: en
            ? `Divide the cost of c) by the initial stake of ${eur(capital)}. How many times the original investment did the fees consume (unitless)?`
            : `Divisez le coût du c) par la mise initiale de ${eur(capital)}. Combien de fois la mise de départ les frais ont-ils consommée (sans unité) ?`,
          reponse: mult, tolerance: 0.02, toleranceMode: 'absolu',
          etapes: [
            {
              titre: en ? 'Multiple = cost / initial stake' : 'Multiple = coût / mise initiale',
              contenu: en
                ? `${f(cout, 0)}/${f(capital, 0)} = **${f(mult)}×** the original stake. The module's anchor: on the canonical 30-year example, the 2% fees cost 329 on a stake of 100 — more than THREE TIMES the money initially invested. Said to the client in one sentence: over this horizon, the fee difference devours about ${f(mult)} times what you walked in with.`
                : `${f(cout, 0)}/${f(capital, 0)} = **${f(mult)}×** la mise de départ. L'ancre du module : sur l'exemple canonique à 30 ans, les 2 % de frais coûtent 329 pour une mise de 100 — plus de TROIS FOIS l'argent initialement investi. Dit au client en une phrase : sur cet horizon, l'écart de frais dévore environ ${f(mult)} fois ce que vous avez apporté en entrant.`,
            },
            {
              titre: en ? 'What would justify paying it anyway' : 'Ce qui justifierait quand même de le payer',
              contenu: en
                ? `The honest closing: fees are a certainty, alpha is a hope. Paying ${pct(fraisA, 1)} is rational only if the manager reliably delivers MORE than ${f(r2(fraisA - fraisE))} points of alpha per year over the index — and the m12 attribution lesson (ch. 3-4) is that aggregate alpha is roughly zero before fees and negative after. The burden of proof sits with the expensive product, and it grows with every year of horizon.`
                : `La conclusion honnête : les frais sont une certitude, l'alpha est un espoir. Payer ${pct(fraisA, 1)} n'est rationnel que si le gérant livre de façon fiable PLUS de ${f(r2(fraisA - fraisE))} points d'alpha par an au-dessus de l'indice — et la leçon d'attribution du m12 (ch. 3-4) est que l'alpha agrégé vaut à peu près zéro avant frais et devient négatif après. La charge de la preuve pèse sur le produit cher, et elle grossit avec chaque année d'horizon.`,
            },
          ],
          pieges: [en
            ? `Dividing by the FINAL value instead of the stake: ${f(cout, 0)}/${f(vNetE, 0)} tells you the share of the potential lost — interesting, but the client's question was "how many times MY money", and that denominator is ${eur(capital)}.`
            : `Diviser par la valeur FINALE au lieu de la mise : ${f(cout, 0)}/${f(vNetE, 0)} donne la part du potentiel perdu — intéressant, mais la question du client était « combien de fois MON argent », et ce dénominateur-là est ${eur(capital)}.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 8. m12-pb-08 — La couverture du portefeuille — N2                   */
/* ------------------------------------------------------------------ */
const couvertureDuPortefeuille: ProblemeMoule = {
  id: 'm12-pb-08', moduleId: M12,
  titre: "La couverture du portefeuille : vendre l'indice ou décorréler",
  titreEn: 'Hedging the book: sell the index or decorrelate',
  typeDeCas: 'couverture',
  typeDeCasEn: 'hedging',
  difficulte: 2,
  scenarios: ['Avant les résultats : le book actions-crédit sous parapluie', "Le fonds diversifié : combien de futures faut-il vendre ?", "Le mandat avec une poche d'or : la couverture qui ne se vend pas"],
  scenariosEn: ['Before earnings: the equity-credit book under an umbrella', 'The diversified fund: how many futures must be sold?', 'The mandate with a gold pocket: the hedge you never sell'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : valeur (M), poids actions, vols des deux poches, ρ interne, ρ portefeuille-indice, vol de l'indice.
    const cfg = ([
      { vMin: 100, vMax: 250, wMin: 55, wMax: 70, vaMin: 16, vaMax: 22, vbMin: 8, vbMax: 12, riMin: 0.4, riMax: 0.6, rmMin: 0.8, rmMax: 0.95, vmMin: 14, vmMax: 18 },
      { vMin: 200, vMax: 500, wMin: 60, wMax: 75, vaMin: 15, vaMax: 20, vbMin: 10, vbMax: 14, riMin: 0.45, riMax: 0.65, rmMin: 0.75, rmMax: 0.9, vmMin: 15, vmMax: 19 },
      { vMin: 80, vMax: 180, wMin: 70, wMax: 85, vaMin: 16, vaMax: 24, vbMin: 12, vbMax: 16, riMin: 0.3, riMax: 0.5, rmMin: 0.7, rmMax: 0.85, vmMin: 14, vmMax: 18 },
    ] as const)[sIdx];
    const valeur = randInt(rng, cfg.vMin, cfg.vMax);
    const w = randInt(rng, cfg.wMin, cfg.wMax);
    const va = randInt(rng, cfg.vaMin, cfg.vaMax);
    const vb = randInt(rng, cfg.vbMin, cfg.vbMax);
    const rhoAb = randFloat(rng, cfg.riMin, cfg.riMax, 2);
    const rhoPm = randFloat(rng, cfg.rmMin, cfg.rmMax, 2);
    const vm = randInt(rng, cfg.vmMin, cfg.vmMax);
    const volP = r2(volatilitePortefeuille2Actifs(w, va, vb, rhoAb));
    // Chaîné sur la vol arrondie du a), puis sur le bêta arrondi du b).
    const beta = r2(betaActif(rhoPm, volP, vm));
    const equiv = r2(valeur * beta);
    const volRho0 = r2(volatilitePortefeuille2Actifs(w, va, vb, 0));
    const gain = r2(volP - volRho0);
    const wB = 100 - w;

    const { en, f, pct, mEur } = outils(langue);
    const noms = (en
      ? ['investment-grade credit', 'sovereign bonds', 'gold']
      : ["le crédit investment grade", 'les obligations souveraines', "l'or"])[sIdx];
    const desc = en
      ? `book of ${mEur(valeur, 0)}: ${pct(w, 0)} in equities (vol ${pct(va, 0)}), the remaining ${pct(wB, 0)} in ${noms} (vol ${pct(vb, 0)}), internal correlation ρ = ${f(rhoAb, 2)}; correlation of the WHOLE portfolio with the index ρ = ${f(rhoPm, 2)}, index volatility ${pct(vm, 0)}`
      : `book de ${mEur(valeur, 0)} : ${pct(w, 0)} en actions (vol ${pct(va, 0)}), les ${pct(wB, 0)} restants en ${noms} (vol ${pct(vb, 0)}), corrélation interne ρ = ${f(rhoAb, 2)} ; corrélation du portefeuille ENTIER avec l'indice ρ = ${f(rhoPm, 2)}, vol de l'indice ${pct(vm, 0)}`;
    const contexte = (en
      ? [
        `Earnings week, and the CIO wants an umbrella over the book without liquidating a single line: ${desc}. Two roads on the whiteboard: sell index futures against the beta, or find decorrelation. Before choosing, the numbers: the risk, the lever, the hedge, the alternative.`,
        `The diversified fund's board authorised derivatives last quarter, and today the question is finally operational: ${desc}. How big is the risk, how much market lives inside it, and exactly how many millions of index futures neutralise it? Then the counter-proposal from the allocation team: what would decorrelation alone achieve?`,
        `The mandate carries a gold pocket precisely for days like these: ${desc}. The client forbids selling — the hedge must come either from futures overlay or from the structure of the book itself. Quantify both before the noon call.`,
      ]
      : [
        `Semaine de résultats, et le directeur des investissements veut un parapluie sur le book sans liquider une seule ligne : ${desc}. Deux routes au tableau : vendre des futures sur indice contre le bêta, ou trouver de la décorrélation. Avant de choisir, les nombres : le risque, le levier, la couverture, l'alternative.`,
        `Le conseil du fonds diversifié a autorisé les dérivés au dernier trimestre, et aujourd'hui la question devient enfin opérationnelle : ${desc}. Quelle est la taille du risque, combien de marché vit à l'intérieur, et combien de millions de futures sur indice le neutralisent exactement ? Puis la contre-proposition de l'équipe d'allocation : que ferait la décorrélation seule ?`,
        `Le mandat porte une poche d'or précisément pour des jours comme ceux-ci : ${desc}. Le client interdit de vendre — la couverture doit venir soit d'un overlay de futures, soit de la structure même du book. Chiffrez les deux avant le point de midi.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The risk as it stands: the portfolio volatility' : 'a) Le risque tel quel : la volatilité du portefeuille',
          enonce: en
            ? `${pct(w, 0)}/${pct(wB, 0)} between the two pockets, vols ${pct(va, 0)} and ${pct(vb, 0)}, internal correlation ρ = ${f(rhoAb, 2)}. What is the portfolio's volatility, in %?`
            : `${pct(w, 0)}/${pct(wB, 0)} entre les deux poches, vols ${pct(va, 0)} et ${pct(vb, 0)}, corrélation interne ρ = ${f(rhoAb, 2)}. Quelle est la volatilité du portefeuille, en % ?`,
          reponse: volP, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'σₚ = √(w₁²σ₁² + w₂²σ₂² + 2w₁w₂ρσ₁σ₂)' : 'σₚ = √(w₁²σ₁² + w₂²σ₂² + 2w₁w₂ρσ₁σ₂)',
            contenu: en
              ? `√(${f(w / 100, 2)}² × ${f(va, 0)}² + ${f(wB / 100, 2)}² × ${f(vb, 0)}² + 2 × ${f(w / 100, 2)} × ${f(wB / 100, 2)} × ${f(rhoAb, 2)} × ${f(va, 0)} × ${f(vb, 0)}) = **${pct(volP)}** — the module's formula, anchor (60/40, 20/10, ρ 0.3) = 13.74%. Any hedging decision starts here: you cannot size an umbrella without measuring the rain. This number is the risk the CIO wants reduced — everything that follows is HOW.`
              : `√(${f(w / 100, 2)}² × ${f(va, 0)}² + ${f(wB / 100, 2)}² × ${f(vb, 0)}² + 2 × ${f(w / 100, 2)} × ${f(wB / 100, 2)} × ${f(rhoAb, 2)} × ${f(va, 0)} × ${f(vb, 0)}) = **${pct(volP)}** — la formule du module, ancre (60/40, 20/10, ρ 0,3) = 13,74 %. Toute décision de couverture commence ici : on ne dimensionne pas un parapluie sans mesurer la pluie. Ce nombre est le risque que le directeur veut réduire — toute la suite est le COMMENT.`,
          }],
          pieges: [en
            ? `Taking the weighted average ${pct(r2((w * va + wB * vb) / 100))}: that is the ρ = 1 world — with ρ = ${f(rhoAb, 2)}, the cross-term already grants free diversification before any hedge is bought.`
            : `Prendre la moyenne pondérée ${pct(r2((w * va + wB * vb) / 100))} : c'est le monde à ρ = 1 — à ρ = ${f(rhoAb, 2)}, le terme croisé accorde déjà une diversification gratuite avant tout achat de couverture.`],
        },
        {
          intitule: en ? 'b) The market inside: the portfolio beta' : 'b) Le marché à l\'intérieur : le bêta du portefeuille',
          enonce: en
            ? `Correlation of the portfolio with the index ρ = ${f(rhoPm, 2)}, index volatility ${pct(vm, 0)}. Using the ROUNDED volatility of a), what is the portfolio's beta (unitless)?`
            : `Corrélation du portefeuille avec l'indice ρ = ${f(rhoPm, 2)}, vol de l'indice ${pct(vm, 0)}. Avec la volatilité ARRONDIE du a), quel est le bêta du portefeuille (sans unité) ?`,
          reponse: beta, tolerance: 0.01, toleranceMode: 'absolu',
          etapes: [{
            titre: en ? 'β = ρ × σ_portfolio / σ_index' : 'β = ρ × σ_portefeuille / σ_indice',
            contenu: en
              ? `${f(rhoPm, 2)} × ${f(volP)}/${f(vm, 0)} = **${f(beta)}** — the anchor: (0.8, 25, 15) = 1.33. The beta is the hedgeable PART of the risk: it measures how much of the book's movement is really the index moving in disguise. What the futures can kill is exactly this; what remains — the (1 − ρ²) share — no index position will ever touch (ch. 2 and 5).`
              : `${f(rhoPm, 2)} × ${f(volP)}/${f(vm, 0)} = **${f(beta)}** — l'ancre : (0,8, 25, 15) = 1,33. Le bêta est la PART couvrable du risque : il mesure combien du mouvement du book est en réalité l'indice qui bouge déguisé. Ce que les futures peuvent tuer, c'est exactement cela ; ce qui reste — la part en (1 − ρ²) — aucune position sur indice ne le touchera jamais (ch. 2 et 5).`,
          }],
          pieges: [en
            ? `Using the equity pocket's vol ${pct(va, 0)} instead of the whole book's ${pct(volP)}: the futures will hedge the PORTFOLIO, so it is the portfolio's beta the trade needs — mixing levels of aggregation is the classic overlay error.`
            : `Utiliser la vol de la poche actions ${pct(va, 0)} au lieu de celle du book entier ${pct(volP)} : les futures couvriront le PORTEFEUILLE, c'est donc son bêta que le trade réclame — mélanger les niveaux d'agrégation est l'erreur classique de l'overlay.`],
        },
        {
          intitule: en ? 'c) The umbrella: the index-equivalent to sell' : "c) Le parapluie : l'équivalent-indice à vendre",
          enonce: en
            ? `To bring the market exposure of the ${mEur(valeur, 0)} book to zero, what notional of index futures must be sold (beta of b)), in €m?`
            : `Pour ramener à zéro l'exposition de marché du book de ${mEur(valeur, 0)}, quel notionnel de futures sur indice faut-il vendre (bêta du b)), en M€ ?`,
          reponse: equiv, tolerance: 0.005, unite: en ? '€m' : 'M€',
          etapes: [{
            titre: en ? 'Index-equivalent = β × V' : 'Équivalent-indice = β × V',
            contenu: en
              ? `${f(beta)} × ${f(valeur, 0)} = **${mEur(equiv)}** of futures to SELL. The logic is the stress-test anchor read backwards: (100, −20, 1.2) loses 24m because the book behaves like 120m of index — so selling ${mEur(equiv)} of index makes the combined beta ≈ 0. ${beta > 1 ? 'A beta above 1 means selling MORE than the book is worth: leverage hides inside correlation.' : 'A beta below 1 means selling less than the book is worth: part of the risk never came from the market.'}`
              : `${f(beta)} × ${f(valeur, 0)} = **${mEur(equiv)}** de futures à VENDRE. La logique est l'ancre du stress test lue à l'envers : (100, −20, 1,2) perd 24 M parce que le book se comporte comme 120 M d'indice — vendre ${mEur(equiv)} d'indice ramène donc le bêta combiné à ≈ 0. ${beta > 1 ? 'Un bêta au-dessus de 1 impose de vendre PLUS que la valeur du book : le levier se cache dans la corrélation.' : 'Un bêta en dessous de 1 fait vendre moins que la valeur du book : une partie du risque n\'est jamais venue du marché.'}`,
          }],
          pieges: [en
            ? `Selling ${mEur(valeur, 0)} flat, ignoring the beta: with β = ${f(beta)}, that leaves ${mEur(r2(Math.abs(valeur * beta - valeur)))} of market exposure ${beta > 1 ? 'UNHEDGED' : 'OVER-hedged — the book would now profit from a crash, which is a position, not a hedge'}.`
            : `Vendre ${mEur(valeur, 0)} tout rond en ignorant le bêta : à β = ${f(beta)}, il reste ${mEur(r2(Math.abs(valeur * beta - valeur)))} d'exposition de marché ${beta > 1 ? 'NON couverte' : 'SUR-couverte — le book profiterait désormais d\'un krach, ce qui est une position, pas une couverture'}.`],
        },
        {
          intitule: en ? 'd) The other umbrella: the vol if ρ fell to 0' : "d) L'autre parapluie : la vol si ρ tombait à 0",
          enonce: en
            ? `Alternative road: same weights, same vols, but suppose the internal correlation fell from ${f(rhoAb, 2)} to 0. What would the portfolio volatility be, in %?`
            : `Route alternative : mêmes poids, mêmes vols, mais supposez que la corrélation interne tombe de ${f(rhoAb, 2)} à 0. Que vaudrait la volatilité du portefeuille, en % ?`,
          reponse: volRho0, tolerance: 0.005, unite: '%',
          etapes: [
            {
              titre: en ? 'Same formula, cross-term switched off' : 'Même formule, terme croisé éteint',
              contenu: en
                ? `√(${f(w / 100, 2)}² × ${f(va, 0)}² + ${f(wB / 100, 2)}² × ${f(vb, 0)}²) = **${pct(volRho0)}** — at ρ = 0 the cross-term vanishes and only the squared terms survive. Against the ${pct(volP)} of a), decorrelation alone would save ${f(gain)} point(s) of volatility, without selling one future, without paying one bid-ask spread, without giving up the upside.`
                : `√(${f(w / 100, 2)}² × ${f(va, 0)}² + ${f(wB / 100, 2)}² × ${f(vb, 0)}²) = **${pct(volRho0)}** — à ρ = 0, le terme croisé s'éteint et seuls les termes au carré survivent. Contre les ${pct(volP)} du a), la décorrélation seule économiserait ${f(gain)} point(s) de volatilité, sans vendre un future, sans payer une fourchette, sans renoncer à la hausse.`,
            },
            {
              titre: en ? 'Choosing between the two umbrellas' : 'Choisir entre les deux parapluies',
              contenu: en
                ? `The futures hedge of c) kills the BETA: precise, immediate, but it also sells the market's return and must be rolled and margined. The decorrelation route reduces TOTAL vol while keeping both engines running — but ρ is estimated, not contractual, and the m11 lesson stands: correlations converge on 1 exactly on the days the umbrella was bought for. The desk's honest answer is usually both: futures for the event, structure for the regime.`
                : `La couverture en futures du c) tue le BÊTA : précise, immédiate, mais elle vend aussi le rendement du marché, et il faut la rouler et l'appeler en marge. La route de la décorrélation réduit la vol TOTALE en gardant les deux moteurs allumés — mais ρ est estimé, pas contractuel, et la leçon du m11 tient toujours : les corrélations convergent vers 1 exactement les jours pour lesquels le parapluie avait été acheté. La réponse honnête du desk est souvent : les deux — les futures pour l'événement, la structure pour le régime.`,
            },
          ],
          pieges: [en
            ? `Believing ρ = 0 means zero risk: the squared terms remain — ${pct(volRho0)} is far from zero. Only ρ = −1 with the right weights can cancel risk entirely; independence merely stops risks from ADDING.`
            : `Croire que ρ = 0 signifie risque nul : les termes au carré restent — ${pct(volRho0)} est loin de zéro. Seul ρ = −1 avec les bons poids peut annuler tout le risque ; l'indépendance empêche seulement les risques de S'ADDITIONNER.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 9. m12-pb-09 — Le stress de liquidité — N2                          */
/* ------------------------------------------------------------------ */
const stressDeLiquidite: ProblemeMoule = {
  id: 'm12-pb-09', moduleId: M12,
  titre: 'Le stress de liquidité : trente jours sans banque centrale',
  titreEn: 'The liquidity stress: thirty days without the central bank',
  typeDeCas: 'liquidité',
  typeDeCasEn: 'liquidity',
  difficulte: 2,
  scenarios: ['La banque régionale : des dépôts qui dorment moins bien', 'SVB rejoué : les dépôts corporate partent en courant', 'La filiale sous revue : le superviseur durcit le scénario'],
  scenariosEn: ['The regional bank: deposits sleeping less soundly', 'SVB replayed: corporate deposits leave at a run', 'The subsidiary under review: the supervisor hardens the scenario'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : sorties 30 j (M), LCR de départ visé (%), aggravation des sorties (%).
    const cfg = ([
      { soMin: 150, soMax: 300, lcMin: 120, lcMax: 145, agMin: 25, agMax: 40 },
      { soMin: 400, soMax: 800, lcMin: 110, lcMax: 130, agMin: 35, agMax: 55 },
      { soMin: 100, soMax: 250, lcMin: 130, lcMax: 160, agMin: 20, agMax: 35 },
    ] as const)[sIdx];
    const sorties = randInt(rng, cfg.soMin, cfg.soMax);
    const lcrCible = randInt(rng, cfg.lcMin, cfg.lcMax);
    const agg = randInt(rng, cfg.agMin, cfg.agMax);
    const hqla = Math.round(sorties * lcrCible / 100);
    const lcrAvant = r2(lcrPct(hqla, sorties));
    // Chaîné sur les sorties aggravées arrondies du b).
    const sortiesAggr = r2(sorties * (1 + agg / 100));
    const lcrApres = r2(lcrPct(hqla, sortiesAggr));
    const marge = r2(lcrApres - 100);

    const { en, f, pct, mEur } = outils(langue);
    const desc = en
      ? `${mEur(hqla, 0)} of high-quality liquid assets (HQLA); net cash outflows over 30 days of stress estimated at ${mEur(sorties, 0)}; the supervisor's hardened scenario worsens the outflows by ${pct(agg, 0)}`
      : `${mEur(hqla, 0)} d'actifs liquides de haute qualité (HQLA) ; sorties nettes de trésorerie à 30 jours de stress estimées à ${mEur(sorties, 0)} ; le scénario durci du superviseur aggrave les sorties de ${pct(agg, 0)}`;
    const contexte = (en
      ? [
        `The regional bank's deposits used to be furniture — now they have a banking app and a news feed: ${desc}. The ALM committee wants the liquidity position in four numbers: the LCR as it stands, the outflows if the scenario hardens, the LCR after, and the verdict against the 100% bar.`,
        `The treasurer has read the SVB post-mortems twice and wants the same movie run on his own balance sheet — concentrated corporate deposits, one bad headline, everyone leaves through the same door: ${desc}. Run the run: before, worse, after, verdict.`,
        `The subsidiary is under supervisory review, and this year the liquidity annex comes with a twist: the standard outflow assumptions are deemed too kind. On the table: ${desc}. The supervisor's question is the only one that matters: does the buffer survive the harder month?`,
      ]
      : [
        `Les dépôts de la banque régionale étaient du mobilier — ils ont désormais une appli bancaire et un fil d'actualité : ${desc}. Le comité ALM veut la position de liquidité en quatre nombres : le LCR tel quel, les sorties si le scénario durcit, le LCR après, et le verdict contre la barre des 100 %.`,
        `Le trésorier a lu deux fois les autopsies de SVB et veut projeter le même film sur son propre bilan — des dépôts corporate concentrés, un mauvais titre de presse, tout le monde sort par la même porte : ${desc}. Déroulez le run : avant, pire, après, verdict.`,
        `La filiale est sous revue prudentielle, et cette année l'annexe liquidité vient avec une torsion : les hypothèses de sortie standard sont jugées trop aimables. Sur la table : ${desc}. La question du superviseur est la seule qui compte : le coussin survit-il au mois durci ?`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The snapshot: the LCR as it stands' : 'a) La photographie : le LCR tel quel',
          enonce: en
            ? `${mEur(hqla, 0)} of HQLA against ${mEur(sorties, 0)} of 30-day stressed net outflows. What is the LCR, in %?`
            : `${mEur(hqla, 0)} de HQLA contre ${mEur(sorties, 0)} de sorties nettes à 30 jours de stress. Quel est le LCR, en % ?`,
          reponse: lcrAvant, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'LCR = HQLA / 30-day net outflows × 100' : 'LCR = HQLA / sorties nettes 30 j × 100',
            contenu: en
              ? `${f(hqla, 0)}/${f(sorties, 0)} × 100 = **${pct(lcrAvant)}** — the anchor: (120, 100) = 120%, bar at 100%. Read the ratio as a survival clock: enough unencumbered, sellable-tomorrow assets to endure THIRTY DAYS of run without calling the central bank. It is 2008's most direct lesson written into law — Northern Rock and the repo market died of illiquidity, not insolvency (ch. 6, m11).`
              : `${f(hqla, 0)}/${f(sorties, 0)} × 100 = **${pct(lcrAvant)}** — l'ancre : (120, 100) = 120 %, barre à 100 %. Lisez le ratio comme une horloge de survie : assez d'actifs libres et vendables demain pour endurer TRENTE JOURS de run sans appeler la banque centrale. C'est la leçon la plus directe de 2008 écrite dans la loi — Northern Rock et le repo sont morts d'illiquidité, pas d'insolvabilité (ch. 6, m11).`,
          }],
          pieges: [en
            ? `Inverting the fraction: ${f(sorties, 0)}/${f(hqla, 0)} × 100 = ${pct(r2(lcrPct(sorties, hqla)))} answers "what share of my buffer leaves", not "do I survive the month" — the HQLA go on TOP.`
            : `Inverser la fraction : ${f(sorties, 0)}/${f(hqla, 0)} × 100 = ${pct(r2(lcrPct(sorties, hqla)))} répond à « quelle part de mon coussin sort », pas à « est-ce que je survis au mois » — les HQLA vont AU-DESSUS.`],
        },
        {
          intitule: en ? 'b) The scenario hardens: the aggravated outflows' : 'b) Le scénario durcit : les sorties aggravées',
          enonce: en
            ? `The hardened scenario worsens the outflows by ${pct(agg, 0)}. What are the new 30-day outflows, in €m?`
            : `Le scénario durci aggrave les sorties de ${pct(agg, 0)}. Que valent les nouvelles sorties à 30 jours, en M€ ?`,
          reponse: sortiesAggr, tolerance: 0.005, unite: en ? '€m' : 'M€',
          etapes: [{
            titre: en ? 'New outflows = old × (1 + aggravation)' : 'Nouvelles sorties = anciennes × (1 + aggravation)',
            contenu: en
              ? `${f(sorties, 0)} × ${f(r2(1 + agg / 100), 2)} = **${mEur(sortiesAggr)}**. Why harden the OUTFLOWS and not the assets? Because that is where run models are most fragile: outflow rates per deposit class are calibrated on history, and 2023 rewrote the history — SVB lost about a QUARTER of its deposits in a day, at smartphone speed, faster than any Basel assumption. The aggravation is the supervisor pricing that new physics in.`
              : `${f(sorties, 0)} × ${f(r2(1 + agg / 100), 2)} = **${mEur(sortiesAggr)}**. Pourquoi durcir les SORTIES et pas les actifs ? Parce que c'est là que les modèles de run sont les plus fragiles : les taux de fuite par classe de dépôts sont calibrés sur l'histoire, et 2023 a réécrit l'histoire — SVB a perdu environ un QUART de ses dépôts en une journée, à la vitesse du smartphone, plus vite que toute hypothèse bâloise. L'aggravation, c'est le superviseur qui met cette nouvelle physique dans le prix.`,
          }],
          pieges: [en
            ? `Applying the ${pct(agg, 0)} to the LCR itself (${f(lcrAvant)} − ${f(agg, 0)} points or −${pct(agg, 0)}): the shock hits the DENOMINATOR, and a ratio does not move like its components — compute the flows first, the ratio second.`
            : `Appliquer les ${pct(agg, 0)} au LCR lui-même (${f(lcrAvant)} − ${f(agg, 0)} points ou −${pct(agg, 0)}) : le choc frappe le DÉNOMINATEUR, et un ratio ne bouge pas comme ses composantes — d'abord les flux, ensuite le ratio.`],
        },
        {
          intitule: en ? 'c) The clock reread: the LCR after' : 'c) L\'horloge relue : le LCR après',
          enonce: en
            ? `Same HQLA of ${mEur(hqla, 0)}, outflows of b). What is the LCR in the hardened scenario, in %?`
            : `Mêmes HQLA de ${mEur(hqla, 0)}, sorties du b). Quel est le LCR dans le scénario durci, en % ?`,
          reponse: lcrApres, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'Same numerator, heavier denominator' : 'Même numérateur, dénominateur plus lourd',
            contenu: en
              ? `${f(hqla, 0)}/${f(sortiesAggr)} × 100 = **${pct(lcrApres)}**, down from ${pct(lcrAvant)} — mechanically, ${pct(agg, 0)} more outflows divide the ratio by ${f(r2(1 + agg / 100), 2)}. Note the asymmetry of liquidity: the buffer is fixed in the short run (selling MORE assets under stress means fire-sale discounts, the m11 spiral), while the outflows are limited only by depositors' fear. The denominator always runs faster than the numerator.`
              : `${f(hqla, 0)}/${f(sortiesAggr)} × 100 = **${pct(lcrApres)}**, contre ${pct(lcrAvant)} — mécaniquement, ${pct(agg, 0)} de sorties en plus divisent le ratio par ${f(r2(1 + agg / 100), 2)}. Notez l'asymétrie de la liquidité : le coussin est figé à court terme (vendre PLUS d'actifs sous stress, c'est la décote de vente forcée, la spirale du m11), tandis que les sorties n'ont pour limite que la peur des déposants. Le dénominateur court toujours plus vite que le numérateur.`,
          }],
          pieges: [en
            ? `Keeping the old denominator out of habit and reporting ${pct(lcrAvant)}: the whole point of the exercise is that the outflow assumption CHANGED — a stress test that reuses calm-weather inputs tests nothing.`
            : `Garder l'ancien dénominateur par habitude et rendre ${pct(lcrAvant)} : tout l'objet de l'exercice est que l'hypothèse de sortie a CHANGÉ — un stress test qui réutilise les entrées de beau temps ne teste rien.`],
        },
        {
          intitule: en ? 'd) The verdict: the gap to the 100% bar' : "d) Le verdict : l'écart à la barre des 100 %",
          enonce: en
            ? `By how many percentage points does the hardened LCR of c) clear the 100% bar (negative if below)?`
            : `De combien de points de pourcentage le LCR durci du c) dépasse-t-il la barre des 100 % (négatif si en dessous) ?`,
          reponse: marge, tolerance: 0.05, toleranceMode: 'absolu', unite: 'points',
          etapes: [
            {
              titre: en ? 'Margin = hardened LCR − 100' : 'Marge = LCR durci − 100',
              contenu: en
                ? `${f(lcrApres)} − 100 = **${f(marge)} points**. ${marge >= 0 ? `Verdict: the month is SURVIVED even in the hardened scenario, with ${f(marge)} points to spare — the buffer was sized for bad weather, not just for the reporting date.` : `Verdict: the bar BREAKS — ${f(r2(-marge))} points short. Operationally: the bank would be selling assets into a falling market or knocking on the central bank's door before day 30 — exactly the two endings the LCR was designed to prevent. Remediation: more HQLA, or a deposit base that runs slower.`}`
                : `${f(lcrApres)} − 100 = **${f(marge)} points**. ${marge >= 0 ? `Verdict : le mois est SURVÉCU même en scénario durci, avec ${f(marge)} points d'avance — le coussin était dimensionné pour le mauvais temps, pas seulement pour la date d'arrêté.` : `Verdict : la barre CASSE — ${f(r2(-marge))} points manquants. Opérationnellement : la banque vendrait des actifs dans un marché qui baisse ou frapperait à la porte de la banque centrale avant le jour 30 — exactement les deux fins que le LCR a été conçu pour éviter. Remédiation : plus de HQLA, ou une base de dépôts qui court moins vite.`}`,
            },
            {
              titre: en ? 'Solvency does not protect from illiquidity' : "La solvabilité ne protège pas de l'illiquidité",
              contenu: en
                ? `The sentence to keep from this problem: a bank can hold every capital ratio in the book and still die in a month — capital absorbs LOSSES, liquidity pays DEPARTURES, and the two clocks tick independently. SVB 2023 was arithmetically solvent on paper while a quarter of its deposits left in a day. That is why Basel III has TWO guardrails, CET1 and LCR, and why this committee reads both (ch. 6).`
                : `La phrase à garder de ce problème : une banque peut cocher tous les ratios de capital du manuel et mourir quand même en un mois — le capital absorbe les PERTES, la liquidité paie les DÉPARTS, et les deux horloges tournent indépendamment. SVB 2023 était arithmétiquement solvable sur le papier pendant qu'un quart de ses dépôts partait en une journée. C'est pourquoi Bâle III a DEUX garde-fous, le CET1 et le LCR, et pourquoi ce comité lit les deux (ch. 6).`,
            },
          ],
          pieges: [en
            ? `Reading a broken LCR as insolvency: below 100% the bank is ILLIQUID under the scenario, not necessarily insolvent — the confusion matters, because the remedies are different (liquidity buffers versus capital raises) and so is the speed of death.`
            : `Lire un LCR cassé comme une insolvabilité : sous 100 %, la banque est ILLIQUIDE dans le scénario, pas nécessairement insolvable — la confusion compte, parce que les remèdes diffèrent (coussins de liquidité contre levées de capital) et la vitesse de la mort aussi.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 10. m12-pb-10 — L'attribution — N2                                  */
/* ------------------------------------------------------------------ */
const attribution: ProblemeMoule = {
  id: 'm12-pb-10', moduleId: M12,
  titre: "L'attribution : le loyer du marché et la part du talent",
  titreEn: 'Attribution: the market rent and the share of talent',
  typeDeCas: 'attribution de performance',
  typeDeCasEn: 'performance attribution',
  difficulte: 2,
  scenarios: ['Le bilan annuel du fonds vedette', "Le fonds « market neutral » qui ne l'est pas tout à fait", 'Le gérant star après dix ans de marché haussier'],
  scenariosEn: ["The flagship fund's annual review", "The 'market neutral' fund that is not quite neutral", 'The star manager after ten bullish years'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : taux sans risque, prime de marché, bêta, alpha tiré.
    const cfg = ([
      { rfMin: 2, rfMax: 3, prMin: 4, prMax: 6, bMin: 1.1, bMax: 1.4, alMin: -0.5, alMax: 1.5 },
      { rfMin: 2.5, rfMax: 3.5, prMin: 4.5, prMax: 6, bMin: 0.3, bMax: 0.6, alMin: -1, alMax: 2.5 },
      { rfMin: 1.5, rfMax: 2.5, prMin: 5, prMax: 7, bMin: 1.2, bMax: 1.5, alMin: -1.5, alMax: 1 },
    ] as const)[sIdx];
    const rf = randFloat(rng, cfg.rfMin, cfg.rfMax, 1);
    const prime = randFloat(rng, cfg.prMin, cfg.prMax, 1);
    const beta = randFloat(rng, cfg.bMin, cfg.bMax, 1);
    const alphaT = randFloat(rng, cfg.alMin, cfg.alMax, 1);
    const rm = r2(rf + prime);
    const exigence = r2(rendementCapm(rf, beta, prime));
    const rReal = r2(exigence + alphaT);
    const alpha = r2(alphaJensen(rReal, rf, beta, rm));
    const loyerBeta = r2(beta * prime);
    // Chaîné sur le loyer arrondi du c) et l'alpha arrondi du b).
    const partBeta = r2(loyerBeta / rReal * 100);
    const partTalent = r2(alpha / rReal * 100);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `return delivered by the fund: ${pct(rReal)}; risk-free rate ${pct(rf, 1)}; market premium ${pct(prime, 1)} (market at ${pct(rm, 1)}); fund beta ${f(beta, 1)}`
      : `rendement livré par le fonds : ${pct(rReal)} ; taux sans risque ${pct(rf, 1)} ; prime de marché ${pct(prime, 1)} (marché à ${pct(rm, 1)}) ; bêta du fonds ${f(beta, 1)}`;
    const contexte = (en
      ? [
        `Annual review of the flagship fund, and the deck's first slide shows only the big number: ${desc}. The selection committee's job is to carve that number into its three owners — the risk-free floor, the market's rent, the manager's talent — because only ONE of the three deserves the fees.`,
        `The fund sells itself as "market neutral", and its beta says: not quite — ${desc}. Before renewing the mandate, the committee wants the decomposition: how much of the performance is the market leaking through the imperfect neutrality, and how much is genuine skill?`,
        `Ten bullish years, and the star manager's track record looks like talent from every angle: ${desc}. The new CIO asks the impolite question: with a beta of ${f(beta, 1)} in a market paying ${pct(prime, 1)} over cash, what did the tide contribute — and what, exactly, did the manager add?`,
      ]
      : [
        `Bilan annuel du fonds vedette, et la première diapositive du deck ne montre que le gros chiffre : ${desc}. Le travail du comité de sélection est de découper ce nombre entre ses trois propriétaires — le plancher sans risque, le loyer du marché, le talent du gérant — parce qu'UN SEUL des trois mérite les frais.`,
        `Le fonds se vend « market neutral », et son bêta répond : pas tout à fait — ${desc}. Avant de renouveler le mandat, le comité veut la décomposition : combien de la performance est le marché qui fuit à travers la neutralité imparfaite, et combien est du vrai talent ?`,
        `Dix ans de marché haussier, et le track record du gérant star ressemble à du talent sous tous les angles : ${desc}. Le nouveau directeur des investissements pose la question impolie : avec un bêta de ${f(beta, 1)} dans un marché qui paie ${pct(prime, 1)} au-dessus du cash, qu'a apporté la marée — et qu'a ajouté, exactement, le gérant ?`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The fair rent: the CAPM requirement' : "a) Le juste loyer : l'exigence CAPM",
          enonce: en
            ? `Risk-free rate ${pct(rf, 1)}, market premium ${pct(prime, 1)}, beta ${f(beta, 1)}. What return does the CAPM require from this fund, in %?`
            : `Taux sans risque ${pct(rf, 1)}, prime de marché ${pct(prime, 1)}, bêta ${f(beta, 1)}. Quel rendement le CAPM exige-t-il de ce fonds, en % ?`,
          reponse: exigence, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'r = r_f + β × premium' : 'r = r_f + β × prime',
            contenu: en
              ? `${f(rf, 1)} + ${f(beta, 1)} × ${f(prime, 1)} = **${pct(exigence)}** — the anchor: CAPM(3, 1.2, 5) = 9%. This is the fund's PERSONAL benchmark: not the market's return, but the return its own risk profile owes. Everything the fund delivers below this line was available for a few basis points in a tracker; only what lives above it is worth paying for (ch. 2 and 3).`
              : `${f(rf, 1)} + ${f(beta, 1)} × ${f(prime, 1)} = **${pct(exigence)}** — l'ancre : CAPM(3, 1,2, 5) = 9 %. C'est l'étalon PERSONNEL du fonds : pas le rendement du marché, mais le rendement que son propre profil de risque doit. Tout ce que le fonds livre sous cette ligne était disponible pour quelques points de base dans un tracker ; seul ce qui vit au-dessus mérite d'être payé (ch. 2 et 3).`,
          }],
          pieges: [en
            ? `Using the market return ${pct(rm, 1)} instead of the premium: r_f + β × r_m = ${pct(r2(rf + beta * rm))} counts the risk-free rate twice — the premium is already the EXCESS over cash.`
            : `Utiliser le rendement du marché ${pct(rm, 1)} au lieu de la prime : r_f + β × r_m = ${pct(r2(rf + beta * rm))} compte le taux sans risque deux fois — la prime est déjà l'EXCÈS au-dessus du cash.`],
        },
        {
          intitule: en ? "b) The manager's line: Jensen's alpha" : "b) La ligne du gérant : l'alpha de Jensen",
          enonce: en
            ? `The fund delivered ${pct(rReal)}. Against the requirement of a), what is its Jensen alpha, in %?`
            : `Le fonds a livré ${pct(rReal)}. Contre l'exigence du a), quel est son alpha de Jensen, en % ?`,
          reponse: alpha, tolerance: 0.02, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'α = realised return − CAPM requirement' : 'α = rendement réalisé − exigence CAPM',
            contenu: en
              ? `${f(rReal)} − ${f(exigence)} = **${pct(alpha)}** — the anchor: alpha(12, 3, 1.2, 10) = +0.6%. ${alpha >= 0 ? 'Positive: after paying the rent of its own beta, the fund added real value — the rarest commodity on the buy-side.' : 'Negative: the fund did not even cover the rent of its own beta — an index position at the same risk would have done better, for basis points.'} The alpha is the ONLY line of the decomposition that belongs to the manager.`
              : `${f(rReal)} − ${f(exigence)} = **${pct(alpha)}** — l'ancre : alpha(12, 3, 1,2, 10) = +0,6 %. ${alpha >= 0 ? 'Positif : une fois payé le loyer de son propre bêta, le fonds a ajouté de la vraie valeur — la denrée la plus rare du buy-side.' : "Négatif : le fonds n'a même pas couvert le loyer de son propre bêta — une position indicielle au même risque aurait fait mieux, pour des points de base."} L'alpha est la SEULE ligne de la décomposition qui appartienne au gérant.`,
          }],
          pieges: [en
            ? `Comparing with the market: ${f(rReal)} − ${f(rm, 1)} = ${pct(r2(rReal - rm))} is beating (or lagging) the INDEX, not the risk — with a beta of ${f(beta, 1)}, the fund's fair bar was ${pct(exigence)}.`
            : `Comparer au marché : ${f(rReal)} − ${f(rm, 1)} = ${pct(r2(rReal - rm))}, c'est battre (ou suivre) l'INDICE, pas le risque — avec un bêta de ${f(beta, 1)}, la juste barre du fonds était ${pct(exigence)}.`],
        },
        {
          intitule: en ? "c) The market's line: the share of the return due to beta" : 'c) La ligne du marché : la part du rendement due au bêta',
          enonce: en
            ? `The market rent is β × premium = ${f(beta, 1)} × ${f(prime, 1)} point(s). What share of the realised return of ${pct(rReal)} does it represent, in %?`
            : `Le loyer du marché vaut β × prime = ${f(beta, 1)} × ${f(prime, 1)} point(s). Quelle part du rendement réalisé de ${pct(rReal)} représente-t-il, en % ?`,
          reponse: partBeta, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Share = (β × premium) / realised return × 100' : 'Part = (β × prime) / rendement réalisé × 100',
            contenu: en
              ? `β × premium = ${f(loyerBeta)} points; ${f(loyerBeta)}/${f(rReal)} × 100 = **${pct(partBeta)}** of the delivered return is simply the market paying its usual rent through the fund's exposure. Add the risk-free floor of ${pct(rf, 1)} and the picture sharpens further: the bulk of most track records is the TIDE, not the swimmer. This is not an insult — it is the base rate against which talent must be read.`
              : `β × prime = ${f(loyerBeta)} points ; ${f(loyerBeta)}/${f(rReal)} × 100 = **${pct(partBeta)}** du rendement livré n'est que le marché payant son loyer habituel à travers l'exposition du fonds. Ajoutez le plancher sans risque de ${pct(rf, 1)} et l'image se précise encore : l'essentiel de la plupart des track records est la MARÉE, pas le nageur. Ce n'est pas une insulte — c'est le taux de base contre lequel le talent doit se lire.`,
          }],
          pieges: [en
            ? `Computing the share of the FULL requirement (${f(exigence)}/${f(rReal)} × 100 = ${pct(r2(exigence / rReal * 100))}): that also hands the risk-free floor to the "market" line — the beta's own contribution is β × premium, ${f(loyerBeta)} points.`
            : `Calculer la part de l'exigence ENTIÈRE (${f(exigence)}/${f(rReal)} × 100 = ${pct(r2(exigence / rReal * 100))}) : c'est donner aussi le plancher sans risque à la ligne « marché » — la contribution propre du bêta vaut β × prime, soit ${f(loyerBeta)} points.`],
        },
        {
          intitule: en ? 'd) The verdict: the share of talent' : 'd) Le verdict : la part du talent',
          enonce: en
            ? `Divide the alpha of b) by the realised return of ${pct(rReal)}. What share of the performance is talent, in % (negative if the manager destroyed value)?`
            : `Divisez l'alpha du b) par le rendement réalisé de ${pct(rReal)}. Quelle part de la performance est du talent, en % (négatif si le gérant a détruit de la valeur) ?`,
          reponse: partTalent, tolerance: 0.1, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'Share of talent = α / realised return × 100' : 'Part du talent = α / rendement réalisé × 100',
              contenu: en
                ? `${f(alpha)}/${f(rReal)} × 100 = **${pct(partTalent)}**. ${alpha > 0 ? `Verdict: real talent — ${pct(partTalent)} of the delivered return is the manager's own line. The follow-up question is commercial: is that alpha larger than the fee gap with a tracker? If the fund charges 1-2% more than the index fund, the ${pct(alpha)} of alpha is the ceiling of what the CLIENT can hope to keep.` : `Verdict: the market did all the work${alpha < 0 ? ' — and the manager subtracted from it' : ''}. A tracker at the same beta would have delivered the requirement of ${pct(exigence)} for basis points of fees. The honest recommendation writes itself.`}`
                : `${f(alpha)}/${f(rReal)} × 100 = **${pct(partTalent)}**. ${alpha > 0 ? `Verdict : du vrai talent — ${pct(partTalent)} du rendement livré est la ligne propre du gérant. La question suivante est commerciale : cet alpha est-il plus grand que l'écart de frais avec un tracker ? Si le fonds facture 1-2 % de plus que l'indiciel, les ${pct(alpha)} d'alpha sont le plafond de ce que le CLIENT peut espérer garder.` : `Verdict : le marché a fait tout le travail${alpha < 0 ? ' — et le gérant en a soustrait' : ''}. Un tracker au même bêta aurait livré l'exigence de ${pct(exigence)} pour des points de base de frais. La recommandation honnête s'écrit toute seule.`}`,
            },
            {
              titre: en ? 'Why attribution is the industry\'s most feared slide' : "Pourquoi l'attribution est la diapositive la plus redoutée du métier",
              contenu: en
                ? `Because it converts a marketing narrative into three auditable numbers — floor, rent, talent — and because the aggregate arithmetic is merciless: across all managers, alpha sums to roughly zero before fees and negative after. Ten bullish years make the beta line enormous and the talent line hard to see; that is precisely when committees overpay for tide. The discipline of this problem — requirement first, alpha second, shares last — is the antidote (ch. 3-4).`
                : `Parce qu'elle convertit un récit marketing en trois nombres auditables — plancher, loyer, talent — et parce que l'arithmétique agrégée est sans pitié : sur l'ensemble des gérants, l'alpha somme à peu près à zéro avant frais et devient négatif après. Dix ans de hausse rendent la ligne bêta énorme et la ligne talent difficile à voir ; c'est précisément là que les comités surpaient la marée. La discipline de ce problème — l'exigence d'abord, l'alpha ensuite, les parts à la fin — est l'antidote (ch. 3-4).`,
            },
          ],
          pieges: [en
            ? `Confusing the share of talent ${pct(partTalent)} with the alpha ${pct(alpha)}: one is a fraction of the performance, the other is points of return — the committee needs both, but they answer different questions ("who did the work" versus "how much extra was earned").`
            : `Confondre la part du talent ${pct(partTalent)} avec l'alpha ${pct(alpha)} : l'une est une fraction de la performance, l'autre des points de rendement — le comité a besoin des deux, mais ils répondent à des questions différentes (« qui a fait le travail » contre « combien a été gagné en plus »).`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* Export du lot 1                                                     */
/* ------------------------------------------------------------------ */
export const problemesLot1: ProblemeMoule[] = [
  construirePortefeuille,    // m12-pb-01 · N1
  ficheDuFonds,              // m12-pb-02 · N1
  tableauDeBordRisque,       // m12-pb-03 · N1
  comiteBale,                // m12-pb-04 · N1
  mandatDuClient,            // m12-pb-05 · N2
  chocDeMarche,              // m12-pb-06 · N2
  fraisEtHorizon,            // m12-pb-07 · N2
  couvertureDuPortefeuille,  // m12-pb-08 · N2
  stressDeLiquidite,         // m12-pb-09 · N2
  attribution,               // m12-pb-10 · N2
];
