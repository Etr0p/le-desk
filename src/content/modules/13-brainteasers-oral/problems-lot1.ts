/**
 * Moules de problèmes multi-étapes du module Brainteasers & oral — LOT 1 :
 * les 10 moules N1/N2 (m13-pb-01 à m13-pb-10). 4 N1 (le placement qui
 * double, le jeu de dé simple, le pari du jury, la série de piles) et 6 N2
 * (le pari de Méré rejoué, la salle de marché et les anniversaires, le test
 * de dépistage, le tirage de cartes, l'estimation de Fermi guidée, le dé à
 * relance).
 * Chaque moule : 3 scénarios FR + EN (habillages ET bornes de tirage
 * différents), sous-questions chaînées (la sortie de a) nourrit b), c)…),
 * corrigés calculés via calculs.ts — jamais de texte figé. Les contextes
 * sont des MISES EN SITUATION D'ENTRETIEN : le jury qui pose son dé sur la
 * table, le voisin de desk qui parie à la machine à café.
 * INVARIANT BILINGUE : tous les tirages aléatoires ont lieu AVANT toute branche
 * de langue — même seed + même scénario ⇒ mêmes nombres en français et en anglais.
 * Conventions (en-tête de calculs.ts) : les PROBABILITÉS se passent et se
 * rendent en % (50 = 50 %) ; les taux de la règle de 72 sont annuels en %,
 * composition discrète ; les cotes s'entendent « pour 1 » (cote équitable
 * = 100/p, probabilité implicite = 1/cote) ; les estimations de Fermi
 * prennent la moyenne GÉOMÉTRIQUE des bornes, jamais l'arithmétique. Les
 * chaînages s'appuient sur les valeurs ARRONDIES (r2) des sous-questions
 * précédentes, pour que le corrigé affiché soit recomposable à la
 * calculatrice. Les ancres des habillages (72/8 = 9 ans contre 9,006468 ;
 * au moins un 6 en 4 lancers = 51,77 % ; 23 personnes = 50,73 % ; Bayes
 * 1 %/99 %/5 % = 1/6 ; C(52, 5) = 2 598 960 ; E[d6] = 3,5 ; relance = 4,25,
 * option 0,75) sont celles des chapitres 1 à 7 du module.
 */
import { formatNombreLangue } from '../../../engine/answers';
import { mulberry32, randFloat, randInt } from '../../../engine/rng';
import type { Langue, ProblemGenerator } from '../../../engine/types';
import {
  anneesDoublementExactes, bayesAPosterioriPct, combinaisons, coteEquitable,
  erreurRelativePct, esperanceLancerDe, estimationFermi,
  probaAnniversairesPct, probaAuMoinsUnPct, probaSerieConsecutivePct,
  regleDe72,
} from './calculs';

/** Un « moule » de problème est un ProblemGenerator de l'engine (alias local). */
export type ProblemeMoule = ProblemGenerator;

const M13 = '13-brainteasers-oral';
const r2 = (v: number) => Math.round(v * 100) / 100;

/** Petits formateurs liés à la langue (les tirages sont déjà faits quand on les crée). */
function outils(langue: Langue) {
  const en = langue === 'en';
  const f = (v: number, d = 2) => formatNombreLangue(langue, v, d);
  /** Pourcentages : « 51,77 % » / "51.77%". */
  const pct = (v: number, d = 2) => (en ? `${f(v, d)}%` : `${f(v, d)} %`);
  /** Euros : « 4,25 € » / "€4.25". */
  const eur = (v: number, d = 2) => (en ? `€${f(v, d)}` : `${f(v, d)} €`);
  return { en, f, pct, eur };
}

/* ------------------------------------------------------------------ */
/* 1. m13-pb-01 — Le placement qui double — N1                         */
/* ------------------------------------------------------------------ */
const placementQuiDouble: ProblemeMoule = {
  id: 'm13-pb-01', moduleId: M13,
  titre: 'Le placement qui double : la règle de 72 et son erreur',
  titreEn: 'The doubling investment: the rule of 72 and its error',
  typeDeCas: 'calcul mental',
  typeDeCasEn: 'mental arithmetic',
  difficulte: 1,
  scenarios: ['Le portefeuille du jury : « il double en combien de temps ? »', 'Le livret prudent : les taux bas, là où la règle déraille', "Le marché émergent : les taux élevés, là où l'erreur change de signe"],
  scenariosEn: ['The jury’s portfolio: “how long until it doubles?”', 'The cautious savings account: low rates, where the rule drifts', 'The emerging market: high rates, where the error flips sign'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : taux annuel composé, en % (on évite le voisinage
    // de 8 % où l'erreur de la règle passe par zéro — c) doit rester lisible).
    const cfg = ([
      { tMin: 5, tMax: 7 },
      { tMin: 1.5, tMax: 3 },
      { tMin: 10, tMax: 15 },
    ] as const)[sIdx];
    const taux = randFloat(rng, cfg.tMin, cfg.tMax, 1);
    const approx = r2(regleDe72(taux));
    const exact = r2(anneesDoublementExactes(taux));
    const erreur = r2(erreurRelativePct(approx, exact));

    const { en, f, pct } = outils(langue);
    const contexte = (en
      ? [
        `Trading-floor interview, third question. The jury member puts his pen down: “your portfolio returns ${pct(taux, 1)} a year — how long until it doubles?” No calculator on the table, obviously. Chapter 1’s three-beat answer: announce the approximation, give the exact figure, bound the error.`,
        `The jury plays the cautious client: “my savings earn ${pct(taux, 1)} a year, compounded. When has my money doubled?” Low rates are exactly where the rule of 72 starts to drift — and saying so is part of the answer they are listening for.`,
        `Your desk neighbour bets you a coffee that you cannot price it in ten seconds: an emerging-market bond compounding at ${pct(taux, 1)} a year. Doubling time, exact value, and by how much the mental shortcut is off — high rates flip the sign of the error, and he knows it.`,
      ]
      : [
        `Entretien de salle de marchés, troisième question. Le membre du jury pose son stylo : « votre portefeuille rapporte ${pct(taux, 1)} par an — il double en combien de temps ? » Pas de calculatrice sur la table, évidemment. Le trois-temps du chapitre 1 : annoncer l'approximation, donner l'exact, borner l'erreur.`,
        `Le jury joue le client prudent : « mon livret rapporte ${pct(taux, 1)} par an, composés. Quand mon argent a-t-il doublé ? » Les taux bas sont exactement la zone où la règle de 72 se met à dériver — et le dire fait partie de la réponse qu'il attend.`,
        `Votre voisin de desk parie un café que vous ne savez pas le pricer en dix secondes : une obligation émergente qui compose à ${pct(taux, 1)} par an. Temps de doublement, valeur exacte, et de combien le raccourci mental se trompe — les taux élevés inversent le signe de l'erreur, et il le sait.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The reflex: the rule of 72' : 'a) Le réflexe : la règle de 72',
          enonce: en
            ? `By the rule of 72, in how many years does a capital compounding at ${pct(taux, 1)} a year double?`
            : `Par la règle de 72, en combien d'années un capital composé à ${pct(taux, 1)} par an double-t-il ?`,
          reponse: approx, tolerance: 0.005, unite: en ? 'years' : 'années',
          etapes: [{
            titre: en ? 'Doubling ≈ 72 / rate' : 'Doublement ≈ 72 / taux',
            contenu: en
              ? `72 / ${f(taux, 1)} = **${f(approx)} years**. The single most profitable mental-math tool of the whole interview: 8% ⇒ 9 years, 6% ⇒ 12, 2% ⇒ 36. Why 72 and not 100·ln 2 ≈ 69.3? Because 72 divides by 2, 3, 4, 6, 8, 9 and 12 — and the gap with 69.3 happens to offset the annual compounding right around 8%, where the rule was calibrated.`
              : `72 / ${f(taux, 1)} = **${f(approx)} années**. L'outil de calcul mental le plus rentable de tout l'entretien : 8 % ⇒ 9 ans, 6 % ⇒ 12, 2 % ⇒ 36. Pourquoi 72 et pas 100·ln 2 ≈ 69,3 ? Parce que 72 se divise par 2, 3, 4, 6, 8, 9 et 12 — et que l'écart avec 69,3 compense justement la composition annuelle autour de 8 %, là où la règle a été calibrée.`,
          }],
          pieges: [en
            ? `Dividing 72 by the rate written as a decimal (${f(r2(taux / 100), 3)}): the rule takes the rate in PERCENT. And do not confuse it with simple interest, where doubling takes 100/${f(taux, 1)} = ${f(r2(100 / taux))} years — compounding is precisely what the 72 encodes.`
            : `Diviser 72 par le taux écrit en décimal (${f(r2(taux / 100), 3)}) : la règle prend le taux en POURCENT. Et ne pas confondre avec les intérêts simples, où le doublement demande 100/${f(taux, 1)} = ${f(r2(100 / taux))} années — la composition est précisément ce que le 72 encode.`],
        },
        {
          intitule: en ? 'b) The safety net: the exact figure' : 'b) Le filet : la valeur exacte',
          enonce: en
            ? `What is the EXACT doubling time at ${pct(taux, 1)} a year, discrete annual compounding, in years?`
            : `Quel est le temps de doublement EXACT à ${pct(taux, 1)} par an, composition discrète annuelle, en années ?`,
          reponse: exact, tolerance: 0.005, unite: en ? 'years' : 'années',
          etapes: [{
            titre: en ? 'Exact = ln 2 / ln(1 + t/100)' : 'Exact = ln 2 / ln(1 + t/100)',
            contenu: en
              ? `ln 2 / ln(1 + ${f(taux, 1)}/100) = **${f(exact)} years**. The reference anchor: at 8%, the rule says 9 while the exact value is 9.006468 — an error of −0.07%, undetectable out loud. At 2%, 36 announced against 35.0 exact: at low rates the rule OVERSTATES by about a year; at high rates it UNDERSTATES. One tool, one validity domain, one known error — the contract of every approximation in the course.`
              : `ln 2 / ln(1 + ${f(taux, 1)}/100) = **${f(exact)} années**. L'ancre de référence : à 8 %, la règle dit 9 quand l'exact vaut 9,006468 — erreur de −0,07 %, indétectable à l'oral. À 2 %, 36 annoncés contre 35,0 exacts : aux taux bas la règle SURESTIME d'environ un an ; aux taux élevés elle SOUS-ESTIME. Un outil, un domaine de validité, une erreur connue — le contrat de toutes les approximations du cours.`,
          }],
          pieges: [en
            ? `Using continuous compounding ln 2/(${f(taux, 1)}/100) = ${f(r2(69.31471805599453 / taux))} years: the course convention (m2/m4) is DISCRETE annual compounding — the denominator is ln(1 + t/100), not t/100.`
            : `Utiliser la composition continue ln 2/(${f(taux, 1)}/100) = ${f(r2(69.31471805599453 / taux))} années : la convention du cours (m2/m4) est la composition DISCRÈTE annuelle — le dénominateur est ln(1 + t/100), pas t/100.`],
        },
        {
          intitule: en ? 'c) The winning move: announce the error' : "c) Le geste qui recrute : annoncer l'erreur",
          enonce: en
            ? `What is the relative error of the rule-of-72 answer of a) against the exact figure of b), in % (signed: positive = the rule overstates)?`
            : `Quelle est l'erreur relative de la réponse « règle de 72 » du a) contre l'exact du b), en % (signée : positif = la règle surestime) ?`,
          reponse: erreur, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Error = (approx − exact)/exact × 100' : 'Erreur = (approx − exact)/exact × 100',
            contenu: en
              ? `(${f(approx)} − ${f(exact)}) / ${f(exact)} × 100 = **${pct(erreur)}**. This fourth gesture — announce, bound, THEN quantify the error — is the rarest and the best paid: it turns “I can compute” into “you can hand me a book”. The full sentence for the jury: “about ${f(approx)} years by the rule of 72; ${f(exact)} exactly; the rule is off by ${pct(erreur)} at this rate — the error stays under 2% between roughly 4 and 12%, and never exceeds 3.5% on the 1-15% range.”`
              : `(${f(approx)} − ${f(exact)}) / ${f(exact)} × 100 = **${pct(erreur)}**. Ce quatrième geste — annoncer, borner, PUIS chiffrer l'erreur — est le plus rare et le mieux payé : il transforme « je sais calculer » en « on peut me confier un book ». La phrase complète pour le jury : « environ ${f(approx)} ans par la règle de 72 ; ${f(exact)} exactement ; la règle se trompe de ${pct(erreur)} à ce niveau de taux — l'erreur reste sous 2 % entre 4 et 12 % environ, et ne dépasse jamais 3,5 % sur la plage 1-15 %. »`,
          }],
          pieges: [en
            ? `Giving the error in years (${f(r2(approx - exact))}) instead of in %: the jury asked for a RELATIVE error — divide by the exact value. And dropping the sign wastes the best part of the answer: the sign says WHERE the rule drifts (up at low rates, down at high ones).`
            : `Donner l'erreur en années (${f(r2(approx - exact))}) au lieu de % : le jury demande une erreur RELATIVE — on divise par l'exact. Et perdre le signe gâche le meilleur de la réponse : le signe dit OÙ la règle dérive (vers le haut aux taux bas, vers le bas aux taux élevés).`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 2. m13-pb-02 — Le jeu de dé simple — N1                             */
/* ------------------------------------------------------------------ */
const jeuDeDeSimple: ProblemeMoule = {
  id: 'm13-pb-02', moduleId: M13,
  titre: 'Le jeu de dé simple : calculer E avant d’ouvrir la bouche',
  titreEn: 'The simple dice game: compute E before you open your mouth',
  typeDeCas: 'jeu de marché',
  typeDeCasEn: 'market game',
  difficulte: 1,
  scenarios: ['« Cotez-moi ce dé » : le d6 sort de la poche du jury', 'Le d10 du voisin de desk : dix faces et un prix à négocier', 'Le d20 du dernier tour : le jeu de rôle devient un pricing'],
  scenariosEn: ['“Make me a price on this die”: the d6 comes out of the jury’s pocket', 'The desk neighbour’s d10: ten faces and a price to negotiate', 'The final-round d20: the role-playing die becomes a pricing exercise'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : faces du dé, multiplicateur €/point.
    const cfg = ([
      { faces: 6, mMin: 2, mMax: 5 },
      { faces: 10, mMin: 1, mMax: 3 },
      { faces: 20, mMin: 1, mMax: 2 },
    ] as const)[sIdx];
    const faces = cfg.faces;
    const mult = randInt(rng, cfg.mMin, cfg.mMax);
    const sens = randInt(rng, 0, 1); // 1 : prix proposé au-dessus de E (jouer est perdant), 0 : en dessous
    const ecartBrut = randFloat(rng, 0.1, 0.5, 2) * mult;
    const eFace = r2(esperanceLancerDe(faces));
    const eJeu = r2(mult * eFace);
    const prix = r2(eJeu + (sens === 1 ? ecartBrut : -ecartBrut));
    const edge = r2(eJeu - prix);

    const { en, f, eur } = outils(langue);
    const desc = en
      ? `one roll of a fair ${f(faces, 0)}-sided die; you receive ${eur(mult, 0)} per point of the face rolled; entry ticket offered: ${eur(prix)}`
      : `un lancer d'un dé équilibré à ${f(faces, 0)} faces ; vous recevez ${eur(mult, 0)} par point de la face obtenue ; ticket d'entrée proposé : ${eur(prix)}`;
    const contexte = (en
      ? [
        `The jury member pulls a die out of his pocket and slides it across the table: ${desc}. “Do you play?” This is not a riddle — it is a desk simulation, and the first rule of chapter 5 applies: the candidate who names a price before computing the expectation has already disqualified himself.`,
        `Coffee machine, 8:52. Your desk neighbour produces a ten-sided die: ${desc}. “Quick, before the open.” He is testing exactly what a jury tests: value first, price second, decision third.`,
        `Final round. The interviewer borrows a twenty-sided die from a colleague’s desk and grins: ${desc}. Twenty faces instead of six changes nothing about the method — which is precisely the point being tested.`,
      ]
      : [
        `Le membre du jury sort un dé de sa poche et le fait glisser sur la table : ${desc}. « Vous jouez ? » Ce n'est pas une devinette — c'est une simulation de desk, et la première règle du chapitre 5 s'applique : le candidat qui annonce un prix avant d'avoir calculé l'espérance s'est déjà disqualifié.`,
        `Machine à café, 8 h 52. Votre voisin de desk sort un dé à dix faces : ${desc}. « Vite, avant l'ouverture. » Il teste exactement ce qu'un jury teste : la valeur d'abord, le prix ensuite, la décision enfin.`,
        `Dernier tour. L'interviewer emprunte un dé à vingt faces sur le bureau d'un collègue et sourit : ${desc}. Vingt faces au lieu de six ne changent rien à la méthode — et c'est précisément ce qui est testé.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The brick: the expected face' : 'a) La brique : la face espérée',
          enonce: en
            ? `What is the expected value of one roll of a fair ${f(faces, 0)}-sided die, in points?`
            : `Quelle est l'espérance d'un lancer d'un dé équilibré à ${f(faces, 0)} faces, en points ?`,
          reponse: eFace, tolerance: 0.005, unite: 'points',
          etapes: [{
            titre: en ? 'E = (f + 1)/2: the closed form' : 'E = (f + 1)/2 : la forme fermée',
            contenu: en
              ? `(${f(faces, 0)} + 1)/2 = **${f(eFace, 1)}**. The anchor: E[d6] = 3.5, E[d100] = 50.5 — the brick of every dice game in every interview. Compute it BEFORE you speak: this is the value around which everything else (a fair price, a bid, an ask, an odds quote) gets organised. Until you have it, you have nothing.`
              : `(${f(faces, 0)} + 1)/2 = **${f(eFace, 1)}**. L'ancre : E[d6] = 3,5, E[d100] = 50,5 — la brique de tous les jeux de dés de tous les entretiens. Calculez-la AVANT de parler : c'est la valeur autour de laquelle tout le reste (prix équitable, bid, ask, cote) s'organise. Tant que vous ne l'avez pas, vous n'avez rien.`,
          }],
          pieges: [en
            ? `Reading the “middle of the faces” 1-${f(faces, 0)} too fast and saying ${f(faces / 2, 0)}: the true middle of the integers 1 to ${f(faces, 0)} is (${f(faces, 0)} + 1)/2 = ${f(eFace, 1)}. Half a point of error on the value poisons every price downstream.`
            : `Lire trop vite le « milieu des faces » 1-${f(faces, 0)} et dire ${f(faces / 2, 0)} : le vrai milieu des entiers de 1 à ${f(faces, 0)} est (${f(faces, 0)} + 1)/2 = ${f(eFace, 1)}. Un demi-point d'erreur sur la valeur empoisonne tous les prix en aval.`],
        },
        {
          intitule: en ? 'b) The value: the maximum price to pay' : 'b) La valeur : le prix maximal à payer',
          enonce: en
            ? `At ${eur(mult, 0)} per point, what is the maximum entry price you can rationally pay to play, in €?`
            : `À ${eur(mult, 0)} par point, quel est le prix d'entrée maximal que vous pouvez rationnellement payer pour jouer, en € ?`,
          reponse: eJeu, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'Fair price = multiplier × E' : 'Prix équitable = multiplicateur × E',
            contenu: en
              ? `${f(mult, 0)} × ${f(eFace, 1)} = **${eur(eJeu)}**. The price of a game IS its expectation: pay ${eur(eJeu)} and your expected P&L is exactly zero. The market-maker reflex to state out loud: “I would pay at most ${eur(eJeu)} — and strictly less if I want a margin, because the fair price leaves nothing for the risk I carry on one single roll.”`
              : `${f(mult, 0)} × ${f(eFace, 1)} = **${eur(eJeu)}**. Le prix d'un jeu EST son espérance : payez ${eur(eJeu)} et votre P&L attendu vaut exactement zéro. Le réflexe market maker à dire à voix haute : « je paie au plus ${eur(eJeu)} — et strictement moins si je veux une marge, car le prix équitable ne rémunère en rien le risque que je porte sur un lancer unique. »`,
          }],
          pieges: [en
            ? `Announcing a price before computing E: a quote pulled out of a hat is worse than a silence — no desk forgives it. The arithmetic is deliberately trivial; the reflex is what is being graded.`
            : `Annoncer un prix avant d'avoir calculé E : un prix sorti du chapeau est pire qu'un silence — aucun desk ne le pardonne. L'arithmétique est volontairement triviale ; c'est le réflexe qui est noté.`],
        },
        {
          intitule: en ? 'c) The verdict: the edge at the offered price' : 'c) Le verdict : l’edge au prix proposé',
          enonce: en
            ? `The ticket is offered at ${eur(prix)}. What is your expected edge per game if you play (fair value of b) minus price), in € — and do you play?`
            : `Le ticket est proposé à ${eur(prix)}. Quel est votre edge attendu par partie si vous jouez (valeur équitable du b) moins prix), en € — et jouez-vous ?`,
          reponse: edge, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'Edge = E(game) − price' : 'Edge = E(jeu) − prix',
            contenu: en
              ? `${f(eJeu)} − ${f(prix)} = **${eur(edge)}** per game. ${edge > 0 ? `Positive: you play — and you say WHY out loud: “the ticket is below the value, I collect ${eur(edge)} of expectation per roll.”` : `Negative: you decline — politely and with the number: “the ticket is above the value, playing gives away ${eur(r2(-edge))} per roll.”`} Then the desk sentence that closes the answer: the edge is an EXPECTATION — on one roll anything can happen; it only becomes income repeated, and sized small (chapter 5: the market maker is a law of large numbers).`
              : `${f(eJeu)} − ${f(prix)} = **${eur(edge)}** par partie. ${edge > 0 ? `Positif : vous jouez — et vous dites POURQUOI à voix haute : « le ticket est sous la valeur, j'encaisse ${eur(edge)} d'espérance par lancer. »` : `Négatif : vous refusez — poliment et avec le chiffre : « le ticket est au-dessus de la valeur, jouer donne ${eur(r2(-edge))} par lancer. »`} Puis la phrase de desk qui clôt la réponse : l'edge est une ESPÉRANCE — sur un lancer, tout peut arriver ; il ne devient un revenu que répété, et misé petit (chapitre 5 : le teneur de marché est une loi des grands nombres).`,
          }],
          pieges: [en
            ? `Deciding on the sign of one possible outcome (“I could roll a ${f(faces, 0)} and win big”): the decision criterion is the expectation, not the best case — thinking in anecdotes instead of expectations is exactly what the jury is screening out.`
            : `Décider sur le signe d'un dénouement possible (« je peux sortir un ${f(faces, 0)} et gagner gros ») : le critère de décision est l'espérance, pas le meilleur cas — penser en anecdote plutôt qu'en espérance est exactement ce que le jury cherche à éliminer.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 3. m13-pb-03 — Le pari du jury — N1                                 */
/* ------------------------------------------------------------------ */
const pariDuJury: ProblemeMoule = {
  id: 'm13-pb-03', moduleId: M13,
  titre: 'Le pari du jury : de la probabilité à la cote, et retour',
  titreEn: 'The jury’s bet: from probability to odds, and back',
  typeDeCas: 'cotes et paris',
  typeDeCasEn: 'odds and bets',
  difficulte: 1,
  scenarios: ['Le pari généreux : le jury vous offre une cote au-dessus du juste', 'Le café du voisin de desk : une cote qui a l’air belle et qui ne l’est pas', 'Le long shot : petite probabilité, grosse cote, vrai edge ?'],
  scenariosEn: ['The generous bet: the jury offers you odds above fair', 'The desk neighbour’s coffee bet: odds that look pretty and are not', 'The long shot: small probability, big odds, real edge?'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : probabilité de gain (%), facteur cote proposée/cote équitable.
    const cfg = ([
      { pMin: 20, pMax: 25, fMin: 1.1, fMax: 1.35 },
      { pMin: 30, pMax: 40, fMin: 0.75, fMax: 0.92 },
      { pMin: 5, pMax: 10, fMin: 1.1, fMax: 1.3 },
    ] as const)[sIdx];
    const proba = randInt(rng, cfg.pMin, cfg.pMax);
    const facteur = randFloat(rng, cfg.fMin, cfg.fMax, 2);
    const coteEq = r2(coteEquitable(proba));
    const coteProp = r2(coteEq * facteur);
    const probaImpl = r2(100 / coteProp);
    const edge = r2((proba * coteProp) / 100 - 1);

    const { en, f, pct, eur } = outils(langue);
    const desc = en
      ? `the event wins with probability ${pct(proba, 0)} (agreed by both sides); the odds offered pay ${f(coteProp)} for 1 — you receive ${f(coteProp)}, stake included, per 1 staked, if the event happens`
      : `l'événement gagne avec une probabilité de ${pct(proba, 0)} (admise par les deux camps) ; la cote proposée paie ${f(coteProp)} pour 1 — vous touchez ${f(coteProp)}, mise comprise, pour 1 misé, si l'événement se produit`;
    const contexte = (en
      ? [
        `The jury member leans back: “let’s bet.” ${desc}. Before saying yes or no, run the three-step gymnastics of chapter 5: the fair odds, the probability the offered odds actually price, and the expectation per euro staked — the same inversion as the implied PD of a credit spread in module 5.`,
        `Your desk neighbour slides a coffee across: “I’ll make it interesting.” ${desc}. Odds that sound generous often price the event better than you would — extract the number before you shake hands.`,
        `End of the interview, the jury tries the long shot: ${desc}. Small probabilities are where intuition fails loudest and where the arithmetic pays most — quote the fair odds first, then judge the offer.`,
      ]
      : [
        `Le membre du jury se cale dans sa chaise : « parions. » ${desc}. Avant de dire oui ou non, déroulez la gymnastique en trois temps du chapitre 5 : la cote équitable, la probabilité que la cote proposée price réellement, et l'espérance par euro misé — la même inversion que la PD implicite d'un spread de crédit au module 5.`,
        `Votre voisin de desk fait glisser un café : « on pimente ? » ${desc}. Les cotes qui sonnent généreuses pricent souvent l'événement mieux que vous — extrayez le chiffre avant de serrer la main.`,
        `Fin d'entretien, le jury tente le long shot : ${desc}. Les petites probabilités sont là où l'intuition rate le plus fort et où l'arithmétique paie le plus — cotez le juste d'abord, jugez l'offre ensuite.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The benchmark: the fair odds' : 'a) L’étalon : la cote équitable',
          enonce: en
            ? `At a ${pct(proba, 0)} win probability, what are the fair odds “for 1” (zero expectation)?`
            : `À ${pct(proba, 0)} de probabilité de gain, quelle est la cote équitable « pour 1 » (espérance nulle) ?`,
          reponse: coteEq, tolerance: 0.005, unite: en ? 'for 1' : 'pour 1',
          etapes: [{
            titre: en ? 'Fair odds = 100/p' : 'Cote équitable = 100/p',
            contenu: en
              ? `100 / ${f(proba, 0)} = **${f(coteEq)} for 1**. The anchor: winning at 25% deserves odds of 4 — you get 4, stake included, per 1 staked, and the expectation is exactly zero (0.25 × 4 = 1). A 6 on a die deserves odds of 6. Any odds above the fair level hand the edge to the bettor; below, to the house.`
              : `100 / ${f(proba, 0)} = **${f(coteEq)} pour 1**. L'ancre : gagner à 25 % mérite une cote de 4 — on touche 4, mise comprise, pour 1 misé, et l'espérance vaut exactement zéro (0,25 × 4 = 1). Un 6 sur un dé mérite une cote de 6. Toute cote au-dessus du juste donne l'edge au parieur ; en dessous, à la maison.`,
          }],
          pieges: [en
            ? `Quoting the odds on the NET gain (100/p − 1 = ${f(r2(coteEq - 1))}): the course convention is “for 1”, stake included. Mixing the two conventions shifts every subsequent computation by exactly one unit.`
            : `Coter sur le gain NET (100/p − 1 = ${f(r2(coteEq - 1))}) : la convention du cours est « pour 1 », mise comprise. Mélanger les deux conventions décale toute la suite d'exactement une unité.`],
        },
        {
          intitule: en ? 'b) The inverse reading: the implied probability' : 'b) La lecture inverse : la probabilité implicite',
          enonce: en
            ? `What win probability do the OFFERED odds of ${f(coteProp)} for 1 actually price, in %?`
            : `Quelle probabilité de gain la cote PROPOSÉE de ${f(coteProp)} pour 1 price-t-elle réellement, en % ?`,
          reponse: probaImpl, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'Implied probability = 100/odds' : 'Probabilité implicite = 100/cote',
            contenu: en
              ? `100 / ${f(coteProp)} = **${pct(probaImpl)}**, against ${pct(proba, 0)} of real probability. This inverse reading is the most useful one: THE PRICE CONTAINS THE PROBABILITY — invert it. It is exactly the gymnastics you already know from module 5: extracting the implied PD from a spread. Say that sentence to the jury; it is worth more than the number.`
              : `100 / ${f(coteProp)} = **${pct(probaImpl)}**, contre ${pct(proba, 0)} de probabilité réelle. Cette lecture inverse est la plus utile : LE PRIX CONTIENT LA PROBABILITÉ — il suffit de l'inverser. C'est exactement la gymnastique que vous connaissez du module 5 : extraire la PD implicite d'un spread. Dites cette phrase au jury ; elle vaut plus que le chiffre.`,
          }],
          pieges: [en
            ? `${probaImpl < proba ? `Reading “implied ${pct(probaImpl)} < real ${pct(proba, 0)}” as bad news: the bookmaker UNDERPRICES your win — that is precisely where your edge lives.` : `Reading “implied ${pct(probaImpl)} > real ${pct(proba, 0)}” as generosity: the offered odds pay less than the event deserves — the edge is against you.`} The comparison implied vs real is the whole verdict.`
            : `${probaImpl < proba ? `Lire « implicite ${pct(probaImpl)} < réel ${pct(proba, 0)} » comme une mauvaise nouvelle : le bookmaker SOUS-PRICE votre gain — c'est précisément là que vit votre edge.` : `Lire « implicite ${pct(probaImpl)} > réel ${pct(proba, 0)} » comme de la générosité : la cote proposée paie moins que ce que l'événement mérite — l'edge est contre vous.`} La comparaison implicite contre réel est tout le verdict.`],
        },
        {
          intitule: en ? 'c) The verdict: the expectation per euro staked' : 'c) Le verdict : l’espérance par euro misé',
          enonce: en
            ? `Per 1 € staked at the offered odds, what is your expected profit or loss (expectation of the payout minus the stake), in €?`
            : `Pour 1 € misé à la cote proposée, quel est votre gain ou perte attendu (espérance du versement moins la mise), en € ?`,
          reponse: edge, tolerance: 0.005, unite: en ? '€ per € staked' : '€ par € misé',
          etapes: [
            {
              titre: en ? 'Edge = p × odds − 1' : 'Edge = p × cote − 1',
              contenu: en
                ? `${f(proba, 0)}/100 × ${f(coteProp)} − 1 = **${eur(edge)}** per euro staked. ${edge > 0 ? 'Positive: you take the bet' : 'Negative: you decline'} — the chapter’s worked anchor: 7-for-1 on a die’s 6 gives 1/6 × 7 = 1.17, an edge of +0.17 per euro. The two-line verdict the jury wants: compare implied to real probability, then give the expectation in euros.`
                : `${f(proba, 0)}/100 × ${f(coteProp)} − 1 = **${eur(edge)}** par euro misé. ${edge > 0 ? 'Positif : vous prenez le pari' : 'Négatif : vous déclinez'} — l'ancre déroulée du chapitre : du 7 pour 1 sur le 6 d'un dé donne 1/6 × 7 = 1,17, un edge de +0,17 par euro. Le verdict en deux lignes que le jury attend : comparer probabilité implicite et réelle, puis donner l'espérance en euros.`,
            },
            {
              titre: en ? 'The other half of the answer: sizing' : 'L’autre moitié de la réponse : la taille',
              contenu: en
                ? `Spotting the edge is only half the job. Even with a positive expectation, betting everything is a fault: a losing streak — certain if you repeat — takes you out of the game before the law of large numbers pays. “I bet small, and I repeat” is the sentence that sounds like a desk (chapter 5; Kelly puts a number on “small”: the edge divided by the net gain).`
                : `Repérer l'edge n'est que la moitié du travail. Même à espérance positive, tout miser est une faute : une série perdante — certaine à force de répéter — vous sort du jeu avant que la loi des grands nombres ne paie. « Je mise petit, et je répète » est la phrase qui sonne desk (chapitre 5 ; Kelly chiffre le « petit » : l'edge divisé par le gain net).`,
            },
          ],
          pieges: [en
            ? `Computing p × odds and forgetting the −1 (${f(r2((proba * coteProp) / 100))} instead of ${f(edge)}): the stake is spent whatever happens — the expectation of the PAYOUT is not the expectation of the PROFIT.`
            : `Calculer p × cote et oublier le −1 (${f(r2((proba * coteProp) / 100))} au lieu de ${f(edge)}) : la mise est dépensée quoi qu'il arrive — l'espérance du VERSEMENT n'est pas l'espérance du GAIN.`],
        },
      ],
    };
  },
};

// __SUITE__
