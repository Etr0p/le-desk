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
  erreurRelativePct, esperanceJeu, esperanceLancerDe, estimationFermi,
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

/* ------------------------------------------------------------------ */
/* 4. m13-pb-04 — La série de piles — N1                               */
/* ------------------------------------------------------------------ */
const serieDePiles: ProblemeMoule = {
  id: 'm13-pb-04', moduleId: M13,
  titre: 'La série de piles : n d’affilée contre au moins un',
  titreEn: 'The heads streak: n in a row versus at least one',
  typeDeCas: 'probabilités',
  typeDeCasEn: 'probabilities',
  difficulte: 1,
  scenarios: ['La pièce du jury : une série courte, à voix haute', 'La série longue : le voisin de desk parie sur la suite parfaite', 'La pièce truquée : le biais change les chiffres, pas la méthode'],
  scenariosEn: ['The jury’s coin: a short streak, out loud', 'The long streak: the desk neighbour bets on the perfect run', 'The biased coin: the bias moves the numbers, not the method'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : probabilité de pile (%), longueur de la série.
    const cfg = ([
      { pMin: 50, pMax: 50, nMin: 3, nMax: 4 },
      { pMin: 50, pMax: 50, nMin: 5, nMax: 6 },
      { pMin: 55, pMax: 65, nMin: 4, nMax: 5 },
    ] as const)[sIdx];
    const pPile = randInt(rng, cfg.pMin, cfg.pMax);
    const n = randInt(rng, cfg.nMin, cfg.nMax);
    const serie = r2(probaSerieConsecutivePct(pPile, n));
    const auMoinsUn = r2(probaAuMoinsUnPct(pPile, n));
    const ecart = r2(auMoinsUn - serie);

    const { en, f, pct } = outils(langue);
    const contexte = (en
      ? [
        `The jury member pulls out a coin and lays it on the table: “fair coin, ${f(n, 0)} tosses. Probability of ${f(n, 0)} heads in a row? And now: at least one head over those same ${f(n, 0)} tosses?” Two questions that sound alike — that is chapter 3’s trap: one composes the successes, the other the failures.`,
        `Coffee machine. Your desk neighbour: “I bet you I throw ${f(n, 0)} heads in a row.” Before you answer, price both readings: the full streak, then “at least one head” — two neighbouring sentences, two different worlds of probability.`,
        `The jury raises the stakes: “this coin is loaded — heads comes up ${pct(pPile, 0)} of the time. ${f(n, 0)} heads in a row: probability? At least one head in ${f(n, 0)} tosses?” The bias moves both numbers; the method does not flinch.`,
      ]
      : [
        `Le membre du jury sort une pièce et la pose sur la table : « pièce équilibrée, ${f(n, 0)} lancers. Probabilité de ${f(n, 0)} piles d'affilée ? Et maintenant : au moins un pile sur ces mêmes ${f(n, 0)} lancers ? » Deux questions qui sonnent pareil — c'est le piège du chapitre 3 : l'une compose les succès, l'autre les échecs.`,
        `Machine à café. Votre voisin de desk : « je te parie que je sors ${f(n, 0)} piles d'affilée. » Avant de répondre, chiffrez les deux lectures : la série complète, puis « au moins un pile » — deux phrases voisines, deux mondes de probabilité.`,
        `Le jury monte d'un cran : « cette pièce est truquée — pile sort ${pct(pPile, 0)} du temps. ${f(n, 0)} piles d'affilée : probabilité ? Au moins un pile en ${f(n, 0)} lancers ? » Le biais déplace les deux chiffres ; la méthode, elle, ne bouge pas.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The streak: n heads in a row' : 'a) La série : n piles d’affilée',
          enonce: en
            ? `The coin lands heads with probability ${pct(pPile, 0)}. What is the probability of ${f(n, 0)} CONSECUTIVE heads, in %?`
            : `La pièce tombe sur pile avec une probabilité de ${pct(pPile, 0)}. Quelle est la probabilité de ${f(n, 0)} piles CONSÉCUTIFS, en % ?`,
          reponse: serie, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'Streak = pⁿ: multiply the successes' : 'Série = pⁿ : on multiplie les succès',
            contenu: en
              ? `(${f(pPile, 0)}/100)^${f(n, 0)} = **${pct(serie)}**. Every single toss must succeed: an AND, hence a product. The chapter 3 anchors: five heads in a row = 3.125%; three 6s in a row = 0.46% — streaks collapse fast, much faster than intuition feels.`
              : `(${f(pPile, 0)}/100)^${f(n, 0)} = **${pct(serie)}**. Chaque lancer doit réussir : un ET, donc un produit. Les ancres du chapitre 3 : cinq piles d'affilée = 3,125 % ; trois 6 d'affilée = 0,46 % — les séries s'effondrent vite, bien plus vite que l'intuition ne le sent.`,
          }],
          pieges: [en
            ? `Adding or averaging the tosses: a streak requires EVERY toss to succeed — probabilities of an AND multiply, they never add. And do not confuse this with b): “${f(n, 0)} heads in a row” is not “at least one head in ${f(n, 0)} tosses”.`
            : `Additionner ou moyenner les lancers : une série exige que TOUS les lancers réussissent — les probabilités d'un ET se multiplient, elles ne s'additionnent jamais. Et ne pas confondre avec le b) : « ${f(n, 0)} piles d'affilée » n'est pas « au moins un pile en ${f(n, 0)} lancers ».`],
        },
        {
          intitule: en ? 'b) The other reading: at least one head' : 'b) L’autre lecture : au moins un pile',
          enonce: en
            ? `Same coin, same ${f(n, 0)} tosses: what is the probability of AT LEAST one head, in %?`
            : `Même pièce, mêmes ${f(n, 0)} lancers : quelle est la probabilité d'AU MOINS un pile, en % ?`,
          reponse: auMoinsUn, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'Go through the complement: 1 − (1 − p)ⁿ' : 'Passer par le complémentaire : 1 − (1 − p)ⁿ',
            contenu: en
              ? `100 × (1 − (1 − ${f(pPile, 0)}/100)^${f(n, 0)}) = **${pct(auMoinsUn)}**. THE reflex: the only way to miss “at least one” is to miss EVERYTHING, so compute (1 − p)ⁿ and flip it. The anchor: at least one head in 3 tosses = 87.5%.`
              : `100 × (1 − (1 − ${f(pPile, 0)}/100)^${f(n, 0)}) = **${pct(auMoinsUn)}**. LE réflexe : la seule façon de rater « au moins un » est de TOUT rater, donc on calcule (1 − p)ⁿ et on retourne. L'ancre : au moins un pile en 3 lancers = 87,5 %.`,
          }],
          pieges: [en
            ? `Computing n × p = ${pct(r2(n * pPile), 0)}${n * pPile >= 100 ? ' — already absurd above 100%' : ''}: successes on independent trials do not add up, they compose (the same lesson as cumulative default in module 5).`
            : `Calculer n × p = ${pct(r2(n * pPile), 0)}${n * pPile >= 100 ? ' — déjà absurde au-delà de 100 %' : ''} : les succès d'essais indépendants ne s'additionnent pas, ils se composent (la même leçon que le défaut cumulé du m5).`],
        },
        {
          intitule: en ? 'c) The gap: hearing the wording' : 'c) L’écart : entendre l’énoncé',
          enonce: en
            ? `How many percentage points separate the “at least one” reading of b) from the “full streak” reading of a)?`
            : `Combien de points de pourcentage séparent la lecture « au moins un » du b) de la lecture « série complète » du a) ?`,
          reponse: ecart, tolerance: 0.05, toleranceMode: 'absolu', unite: en ? 'pct points' : 'points de %',
          etapes: [{
            titre: en ? 'Two readings, one gap' : 'Deux lectures, un écart',
            contenu: en
              ? `${f(auMoinsUn)} − ${f(serie)} = **${f(ecart)} points**. Everything happens in the wording: “${f(n, 0)} heads in a row” is a product of successes that collapses; “at least one head” is a complement that climbs towards 100%. The jury rephrases on purpose between two questions — restating the question in your own words before computing is the chapter 7 parry.`
              : `${f(auMoinsUn)} − ${f(serie)} = **${f(ecart)} points**. Tout se joue dans l'énoncé : « ${f(n, 0)} piles d'affilée » est un produit de succès qui s'effondre ; « au moins un pile » est un complémentaire qui grimpe vers 100 %. Le jury reformule exprès d'une question à l'autre — reformuler l'énoncé avec vos mots avant de calculer est la parade du chapitre 7.`,
          }],
          pieges: [en
            ? `Believing a) and b) are complements (summing to 100%): the complement of “${f(n, 0)} heads in a row” is “at least one TAIL”, and the complement of “at least one head” is “all tails” — a) and b) answer two different questions, they owe each other nothing.`
            : `Croire que a) et b) sont complémentaires (somme 100 %) : le complémentaire de « ${f(n, 0)} piles d'affilée » est « au moins un FACE », et celui de « au moins un pile » est « que des faces » — a) et b) répondent à deux questions différentes, ils ne se doivent rien.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 5. m13-pb-05 — Le pari de Méré rejoué — N2                          */
/* ------------------------------------------------------------------ */
const pariDeMere: ProblemeMoule = {
  id: 'm13-pb-05', moduleId: M13,
  titre: 'Le pari de Méré rejoué : deux paris qui se ressemblent',
  titreEn: 'De Méré’s bet replayed: two bets that look alike',
  typeDeCas: 'probabilités',
  typeDeCasEn: 'probabilities',
  difficulte: 2,
  scenarios: ['La série courte : le jury raconte le chevalier de Méré', 'Le classique et sa réplique : quatre lancers, puis vingt-quatre', 'La série allongée : le voisin de desk croit à l’équivalence'],
  scenariosEn: ['The short run: the jury retells the chevalier de Méré', 'The classic and its echo: four throws, then twenty-four', 'The stretched run: the desk neighbour believes in the equivalence'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : nombre de lancers du premier pari (le second en fait 6×).
    const cfg = ([
      { n1Min: 3, n1Max: 4 },
      { n1Min: 4, n1Max: 5 },
      { n1Min: 5, n1Max: 6 },
    ] as const)[sIdx];
    const n1 = randInt(rng, cfg.n1Min, cfg.n1Max);
    const n2 = 6 * n1;
    const pSix = r2(100 / 6);
    const pDouble6 = r2(100 / 36);
    const pUn = r2(probaAuMoinsUnPct(100 / 6, n1));
    const pDeux = r2(probaAuMoinsUnPct(100 / 36, n2));
    const naive = r2((n1 * 100) / 6);
    const ecart = r2(pUn - pDeux);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `bet 1: at least one 6 in ${f(n1, 0)} throws of a die; bet 2: at least one double-6 in ${f(n2, 0)} throws of two dice`
      : `pari 1 : au moins un 6 en ${f(n1, 0)} lancers d'un dé ; pari 2 : au moins un double-6 en ${f(n2, 0)} lancers de deux dés`;
    const contexte = (en
      ? [
        `The jury member smiles: “1654. The chevalier de Méré is ruining himself and cannot see why.” ${desc}. Same additive reading — ${f(n1, 0)}/6 = ${f(n2, 0)}/36 — yet the two bets do not pay alike. Run the numbers his creditors never did.`,
        `The jury lays out the course anchor: ${desc}. The historical figures are 4 and 24 throws; yours are drawn tonight. Price each bet properly — by the complement, never by n × p — then say which side of the table you take.`,
        `Your desk neighbour, categorical: “six times more throws for an event six times rarer — same bet.” ${desc}. He is replaying de Méré’s exact reasoning; the interview question is whether YOU can show, numbers in hand, where the addition betrays him.`,
      ]
      : [
        `Le membre du jury sourit : « 1654. Le chevalier de Méré se ruine et ne voit pas pourquoi. » ${desc}. Même lecture additive — ${f(n1, 0)}/6 = ${f(n2, 0)}/36 — et pourtant les deux paris ne paient pas pareil. Faites les comptes que ses créanciers n'ont jamais faits.`,
        `Le jury pose l'ancre du cours : ${desc}. Les chiffres historiques sont 4 et 24 lancers ; les vôtres sont tirés ce soir. Pricez chaque pari proprement — par le complémentaire, jamais par n × p — puis dites de quel côté de la table vous vous asseyez.`,
        `Votre voisin de desk, catégorique : « six fois plus de lancers pour un événement six fois plus rare — même pari. » ${desc}. Il rejoue exactement le raisonnement de Méré ; la question d'entretien est de savoir si VOUS savez montrer, chiffres à l'appui, où l'addition le trahit.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) Bet 1: at least one 6' : 'a) Le pari 1 : au moins un 6',
          enonce: en
            ? `What is the probability of at least one 6 in ${f(n1, 0)} throws of a fair die (p = 1/6 ≈ ${pct(pSix)} per throw), in %?`
            : `Quelle est la probabilité d'au moins un 6 en ${f(n1, 0)} lancers d'un dé équilibré (p = 1/6 ≈ ${pct(pSix)} par lancer), en % ?`,
          reponse: pUn, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'Complement: 1 − (5/6)ⁿ' : 'Le complémentaire : 1 − (5/6)ⁿ',
            contenu: en
              ? `100 × (1 − (5/6)^${f(n1, 0)}) = **${pct(pUn)}**. The chapter 3 anchor: in 4 throws, 1 − (5/6)⁴ = 51.77% — favourable by a whisker, which is exactly how de Méré got rich on bet 1. The only way to miss “at least one 6” is to miss all ${f(n1, 0)} throws.`
              : `100 × (1 − (5/6)^${f(n1, 0)}) = **${pct(pUn)}**. L'ancre du chapitre 3 : en 4 lancers, 1 − (5/6)⁴ = 51,77 % — favorable de justesse, exactement ce qui a enrichi Méré sur le pari 1. La seule façon de rater « au moins un 6 » est de rater les ${f(n1, 0)} lancers.`,
          }],
          pieges: [en
            ? `Computing n × p = ${f(n1, 0)}/6 = ${pct(naive)}: successes do not add up over independent throws. At 6 throws the addition would announce 100% — one throw more and it breaks its own logic.`
            : `Calculer n × p = ${f(n1, 0)}/6 = ${pct(naive)} : les succès ne s'additionnent pas sur des lancers indépendants. À 6 lancers l'addition annoncerait 100 % — un lancer de plus et elle brise sa propre logique.`],
        },
        {
          intitule: en ? 'b) Bet 2: at least one double-6' : 'b) Le pari 2 : au moins un double-6',
          enonce: en
            ? `What is the probability of at least one double-6 in ${f(n2, 0)} throws of two dice (p = 1/36 ≈ ${pct(pDouble6)} per throw), in %?`
            : `Quelle est la probabilité d'au moins un double-6 en ${f(n2, 0)} lancers de deux dés (p = 1/36 ≈ ${pct(pDouble6)} par lancer), en % ?`,
          reponse: pDeux, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'Same reflex, other numbers: 1 − (35/36)ⁿ' : 'Même réflexe, autres chiffres : 1 − (35/36)ⁿ',
            contenu: en
              ? `100 × (1 − (35/36)^${f(n2, 0)}) = **${pct(pDeux)}**. The historical anchor: in 24 throws, 1 − (35/36)²⁴ = 49.14% — UNfavourable by a whisker, which is how de Méré ruined himself on bet 2 while bet 1 kept paying. Method identical to a); only p and n change.`
              : `100 × (1 − (35/36)^${f(n2, 0)}) = **${pct(pDeux)}**. L'ancre historique : en 24 lancers, 1 − (35/36)²⁴ = 49,14 % — DÉfavorable de justesse, ce qui a ruiné Méré sur le pari 2 pendant que le pari 1 payait. Méthode identique au a) ; seuls p et n changent.`,
          }],
          pieges: [en
            ? `Taking p = 1/12 for the double-6 (“two dice, so twice 1/6”): the two dice must EACH show a 6, so p = 1/6 × 1/6 = 1/36 — a product again, the same composition as the streak of pb-04.`
            : `Prendre p = 1/12 pour le double-6 (« deux dés, donc deux fois 1/6 ») : les deux dés doivent CHACUN montrer un 6, donc p = 1/6 × 1/6 = 1/36 — encore un produit, la même composition que la série du pb-04.`],
        },
        {
          intitule: en ? 'c) De Méré’s reading: the common n × p' : 'c) La lecture de Méré : le n × p commun',
          enonce: en
            ? `What “probability” does the additive reading n × p give — the same value for BOTH bets, in %?`
            : `Quelle « probabilité » la lecture additive n × p donne-t-elle — la même valeur pour les DEUX paris, en % ?`,
          reponse: naive, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'n₁ × 1/6 = n₂ × 1/36: the false equivalence' : 'n₁ × 1/6 = n₂ × 1/36 : la fausse équivalence',
            contenu: en
              ? `${f(n1, 0)} × 1/6 = ${f(n2, 0)} × 1/36 = **${pct(naive)}**. This is precisely why de Méré believed the two bets equivalent: the additive reading cannot tell them apart. But a) gives ${pct(pUn)} and b) ${pct(pDeux)} — the addition is not a probability, it is the EXPECTED NUMBER of successes, a different object that happens to coincide with nothing here.`
              : `${f(n1, 0)} × 1/6 = ${f(n2, 0)} × 1/36 = **${pct(naive)}**. C'est précisément pourquoi Méré croyait les deux paris équivalents : la lecture additive ne sait pas les distinguer. Mais a) donne ${pct(pUn)} et b) ${pct(pDeux)} — l'addition n'est pas une probabilité, c'est le NOMBRE ATTENDU de succès, un autre objet qui ne coïncide ici avec rien.`,
          }],
          pieges: [en
            ? `Treating ${pct(naive)} as an actual probability of winning: push n up and n × p exceeds 100% — the giveaway that the object is not a probability. Equal expected counts do NOT imply equal chances of “at least one”.`
            : `Traiter ${pct(naive)} comme une vraie probabilité de gagner : montez n et n × p dépasse 100 % — l'aveu que l'objet n'est pas une probabilité. Des nombres attendus égaux n'impliquent PAS des chances égales d'« au moins un ».`],
        },
        {
          intitule: en ? 'd) The verdict: the gap that ruined a chevalier' : 'd) Le verdict : l’écart qui a ruiné un chevalier',
          enonce: en
            ? `How many percentage points separate bet 1 (a) from bet 2 (b)?`
            : `Combien de points de pourcentage séparent le pari 1 (a) du pari 2 (b) ?`,
          reponse: ecart, tolerance: 0.05, toleranceMode: 'absolu', unite: en ? 'pct points' : 'points de %',
          etapes: [{
            titre: en ? 'Same naive reading, two different truths' : 'Même lecture naïve, deux vérités différentes',
            contenu: en
              ? `${f(pUn)} − ${f(pDeux)} = **${f(ecart)} points**. ${pUn > 50 && pDeux < 50 ? `Bet 1 sits above 50%, bet 2 below: one enriches, the other ruins — the historical configuration.` : pDeux > 50 ? `Both bets sit above 50% here, but not at the same price: repeated a thousand times, the gap is a fortune.` : `Neither bet clears 50% here, but the gap remains: repeated, it decides who pays for dinner.`} Rare events composed many times always lose ground against the additive intuition — de Méré took the question to Pascal, Pascal wrote to Fermat, and probability theory was born from this exact gap.`
              : `${f(pUn)} − ${f(pDeux)} = **${f(ecart)} points**. ${pUn > 50 && pDeux < 50 ? `Le pari 1 est au-dessus de 50 %, le pari 2 en dessous : l'un enrichit, l'autre ruine — la configuration historique.` : pDeux > 50 ? `Les deux paris passent 50 % ici, mais pas au même prix : répété mille fois, l'écart est une fortune.` : `Aucun des deux ne franchit 50 % ici, mais l'écart demeure : répété, il décide qui paie le dîner.`} L'événement rare composé de nombreuses fois perd toujours du terrain sur l'intuition additive — Méré a porté la question à Pascal, Pascal a écrit à Fermat, et le calcul des probabilités est né de cet écart exact.`,
          }],
          pieges: [en
            ? `Concluding from the equal n × p of c) that the gap “should” be zero: composition is not linear — (35/36)^${f(n2, 0)} is not (5/6)^${f(n1, 0)}, and no scaling of n ever makes them equal.`
            : `Conclure du n × p commun du c) que l'écart « devrait » être nul : la composition n'est pas linéaire — (35/36)^${f(n2, 0)} n'est pas (5/6)^${f(n1, 0)}, et aucune mise à l'échelle de n ne les égalisera jamais.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 6. m13-pb-06 — La salle et les anniversaires — N2                   */
/* ------------------------------------------------------------------ */
const salleDesAnniversaires: ProblemeMoule = {
  id: 'm13-pb-06', moduleId: M13,
  titre: 'La salle et les anniversaires : compter les paires, pas les gens',
  titreEn: 'The room and the birthdays: count the pairs, not the people',
  typeDeCas: 'probabilités',
  typeDeCasEn: 'probabilities',
  difficulte: 2,
  scenarios: ['L’open space : autour du seuil, là où tout se joue', 'L’étage entier : la quasi-certitude qui surprend', 'L’équipe du desk : trop petite pour parier'],
  scenariosEn: ['The open floor: around the threshold, where it all happens', 'The whole floor: the near-certainty that surprises', 'The desk team: too small to bet on'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : nombre de personnes dans la salle.
    const cfg = ([
      { nMin: 20, nMax: 26 },
      { nMin: 35, nMax: 45 },
      { nMin: 12, nMax: 16 },
    ] as const)[sIdx];
    const n = randInt(rng, cfg.nMin, cfg.nMax);
    const pN = r2(probaAnniversairesPct(n));
    const seuil = 23;
    const p22 = r2(probaAnniversairesPct(22));
    const p23 = r2(probaAnniversairesPct(23));
    const paires = combinaisons(n, 2);

    const { en, f, pct } = outils(langue);
    const contexte = (en
      ? [
        `The jury member sweeps the open floor with his hand: “${f(n, 0)} people on this floor. Would you bet that two of them share a birthday?” The most famous trap in interviews — intuition says no, the pairs say otherwise. Number first, bet second.`,
        `Interview on the trading floor itself: “count them — ${f(n, 0)} people at their desks this morning. Probability that at least two share a birthday?” At this headcount the answer surprises even candidates who know the 23 anchor: quantify before you qualify.`,
        `The jury shrinks the question: “just your future team — ${f(n, 0)} people. Same birthday, at least two of them: do you take the bet?” Small rooms are where the intuition and the number finally agree — knowing WHY is the point.`,
      ]
      : [
        `Le membre du jury balaie l'open space de la main : « ${f(n, 0)} personnes sur ce plateau. Vous pariez que deux d'entre elles partagent leur anniversaire ? » Le piège le plus célèbre des entretiens — l'intuition dit non, les paires disent autre chose. Le chiffre d'abord, le pari ensuite.`,
        `Entretien sur le plateau lui-même : « comptez — ${f(n, 0)} personnes à leur poste ce matin. Probabilité qu'au moins deux partagent leur anniversaire ? » À cet effectif la réponse surprend même les candidats qui connaissent l'ancre des 23 : chiffrez avant de qualifier.`,
        `Le jury rétrécit la question : « votre future équipe seulement — ${f(n, 0)} personnes. Même anniversaire, au moins deux : vous prenez le pari ? » Les petites salles sont là où l'intuition et le chiffre se réconcilient enfin — savoir POURQUOI est tout l'enjeu.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The number: the probability for the room' : 'a) Le chiffre : la probabilité pour la salle',
          enonce: en
            ? `What is the probability that at least two people out of ${f(n, 0)} share a birthday (365 equally likely days), in %?`
            : `Quelle est la probabilité qu'au moins deux personnes sur ${f(n, 0)} partagent leur anniversaire (365 jours équiprobables), en % ?`,
          reponse: pN, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'Complement: everyone distinct' : 'Le complémentaire : tous distincts',
            contenu: en
              ? `100 × (1 − 365/365 × 364/365 × … × ${f(365 - n + 1, 0)}/365) = **${pct(pN)}**. The only tractable route is the complement — all ${f(n, 0)} birthdays distinct — built as a product of shrinking fractions. The anchors to recite: 23 people ⇒ 50.73%; 50 ⇒ 97.04%; 70 ⇒ 99.92%.`
              : `100 × (1 − 365/365 × 364/365 × … × ${f(365 - n + 1, 0)}/365) = **${pct(pN)}**. La seule route praticable est le complémentaire — les ${f(n, 0)} anniversaires tous distincts — construit comme un produit de fractions qui rétrécissent. Les ancres à réciter : 23 personnes ⇒ 50,73 % ; 50 ⇒ 97,04 % ; 70 ⇒ 99,92 %.`,
          }],
          pieges: [en
            ? `Computing the probability that someone shares YOUR birthday (1 − (364/365)^${f(n - 1, 0)} ≈ ${pct(r2(probaAuMoinsUnPct(100 / 365, n - 1)))}): the question is about ANY pair, not your date — that other question needs 253 people to cross 50%.`
            : `Calculer la probabilité que quelqu'un partage VOTRE anniversaire (1 − (364/365)^${f(n - 1, 0)} ≈ ${pct(r2(probaAuMoinsUnPct(100 / 365, n - 1)))}) : la question porte sur N'IMPORTE quelle paire, pas sur votre date — cette autre question exige 253 personnes pour franchir 50 %.`],
        },
        {
          intitule: en ? 'b) The threshold: when the bet flips' : 'b) Le seuil : quand le pari bascule',
          enonce: en
            ? `What is the smallest number of people for which the probability exceeds 50%?`
            : `Quel est le plus petit nombre de personnes pour lequel la probabilité dépasse 50 % ?`,
          reponse: seuil, tolerance: 0.5, toleranceMode: 'absolu', unite: en ? 'people' : 'personnes',
          etapes: [{
            titre: en ? '23: the anchor to know cold' : '23 : l’ancre à savoir par cœur',
            contenu: en
              ? `At 22 people the probability is ${pct(p22)}; at 23 it reaches ${pct(p23)} — the bet flips at **23**. This is a memorised anchor, not a computation to redo live: the jury checks you carry it, then checks you can EXPLAIN it (that is c). ${n >= 23 ? `Your room of ${f(n, 0)} is past the threshold: you take the bet.` : `Your room of ${f(n, 0)} is below the threshold: you decline the bet.`}`
              : `À 22 personnes la probabilité vaut ${pct(p22)} ; à 23 elle atteint ${pct(p23)} — le pari bascule à **23**. C'est une ancre mémorisée, pas un calcul à refaire en direct : le jury vérifie que vous l'avez, puis que vous savez l'EXPLIQUER (c'est le c). ${n >= 23 ? `Votre salle de ${f(n, 0)} a passé le seuil : vous prenez le pari.` : `Votre salle de ${f(n, 0)} est sous le seuil : vous déclinez le pari.`}`,
          }],
          pieges: [en
            ? `Guessing 183 (“half of 365”): that linear reading counts people against days. Collisions live in the PAIRS, and pairs grow quadratically — which is why the threshold sits so shockingly low.`
            : `Répondre 183 (« la moitié de 365 ») : cette lecture linéaire compte des personnes contre des jours. Les collisions vivent dans les PAIRES, et les paires croissent en n² — c'est pourquoi le seuil est si scandaleusement bas.`],
        },
        {
          intitule: en ? 'c) The explanation: the number of pairs' : 'c) L’explication : le nombre de paires',
          enonce: en
            ? `How many distinct pairs of people can be formed among the ${f(n, 0)} in the room — C(${f(n, 0)}, 2)?`
            : `Combien de paires distinctes de personnes peut-on former parmi les ${f(n, 0)} de la salle — C(${f(n, 0)}, 2) ?`,
          reponse: paires, tolerance: 0.005, unite: en ? 'pairs' : 'paires',
          etapes: [{
            titre: en ? 'C(n, 2) = n(n − 1)/2: the intuition repaired' : 'C(n, 2) = n(n − 1)/2 : l’intuition réparée',
            contenu: en
              ? `${f(n, 0)} × ${f(n - 1, 0)} / 2 = **${f(paires, 0)} pairs**, each one a collision opportunity at roughly 1/365. Intuition fails because it counts ${f(n, 0)} people; the probability sees ${f(paires, 0)} pairs. The anchor: 23 people = 253 pairs — and 253/365 is no longer small at all. That one sentence, delivered to the jury, turns a memorised curiosity into an understood mechanism.`
              : `${f(n, 0)} × ${f(n - 1, 0)} / 2 = **${f(paires, 0)} paires**, chacune une occasion de collision à environ 1/365. L'intuition rate parce qu'elle compte ${f(n, 0)} personnes ; la probabilité voit ${f(paires, 0)} paires. L'ancre : 23 personnes = 253 paires — et 253/365 n'a plus rien de petit. Cette phrase-là, servie au jury, transforme une curiosité mémorisée en mécanisme compris.`,
          }],
          pieges: [en
            ? `Counting ordered pairs n(n − 1) = ${f(n * (n - 1), 0)}: Alice-Bob and Bob-Alice are the SAME collision — divide by 2. Order never matters in combinations; that is exactly what distinguishes C(n, k) from arrangements.`
            : `Compter les paires ordonnées n(n − 1) = ${f(n * (n - 1), 0)} : Alice-Bob et Bob-Alice sont la MÊME collision — on divise par 2. L'ordre ne compte jamais dans les combinaisons ; c'est précisément ce qui distingue C(n, k) des arrangements.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 7. m13-pb-07 — Le test de dopage — N2                               */
/* ------------------------------------------------------------------ */
const testDeDopage: ProblemeMoule = {
  id: 'm13-pb-07', moduleId: M13,
  typeDeCas: 'Bayes',
  typeDeCasEn: 'Bayes',
  titre: 'Le test de dopage : Bayes par les 10 000',
  titreEn: 'The doping test: Bayes with the 10,000',
  difficulte: 2,
  scenarios: ['Le contrôle antidopage : positif ne veut pas dire dopé', 'L’alerte de conformité : le faux positif qui coûte un client', 'Le dépistage du chapitre : le classique absolu, chiffres redistribués'],
  scenariosEn: ['The anti-doping control: positive does not mean doped', 'The compliance alert: the false positive that costs a client', 'The chapter’s screening test: the absolute classic, numbers reshuffled'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : prévalence, sensibilité, faux positifs, prévalence ciblée (tous en % entiers
    // pour que les effectifs sur 10 000 tombent ronds — la méthode d'oral du chapitre 3).
    const cfg = ([
      { prevMin: 1, prevMax: 2, sensMin: 95, sensMax: 99, fpMin: 3, fpMax: 6, prev2Min: 20, prev2Max: 30 },
      { prevMin: 1, prevMax: 3, sensMin: 90, sensMax: 98, fpMin: 2, fpMax: 5, prev2Min: 10, prev2Max: 20 },
      { prevMin: 1, prevMax: 2, sensMin: 97, sensMax: 99, fpMin: 4, fpMax: 6, prev2Min: 15, prev2Max: 25 },
    ] as const)[sIdx];
    const prev = randInt(rng, cfg.prevMin, cfg.prevMax);
    const sens = randInt(rng, cfg.sensMin, cfg.sensMax);
    const fp = randInt(rng, cfg.fpMin, cfg.fpMax);
    const prev2 = randInt(rng, cfg.prev2Min, cfg.prev2Max);
    const atteints = prev * 100;            // sur 10 000
    const sains = (100 - prev) * 100;
    const vraisPos = prev * sens;           // entiers par construction
    const fauxPos = (100 - prev) * fp;
    const totalPos = vraisPos + fauxPos;
    const aPost = r2(bayesAPosterioriPct(prev, sens, fp));
    const aPost2 = r2(bayesAPosterioriPct(prev2, sens, fp));

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `prevalence ${pct(prev, 0)}; the test flags ${pct(sens, 0)} of true cases but also ${pct(fp, 0)} of clean ones`
      : `prévalence ${pct(prev, 0)} ; le test signale ${pct(sens, 0)} des vrais cas mais aussi ${pct(fp, 0)} des cas sains`;
    const contexte = (en
      ? [
        `The jury member slides the stat sheet across: “a federation tests 10,000 athletes; ${pct(prev, 0)} are doped. The test catches ${pct(sens, 0)} of the doped but wrongly flags ${pct(fp, 0)} of the clean. An athlete tests positive: probability he is doped?” Resist the ${pct(sens, 0)} reflex — walk the 10,000, chapter 3’s method.`,
        `Compliance interview: “our tool screens 10,000 transfers a day; ${desc}. An alert fires: probability of an actual fraud?” Behind the question, a business stake: every false accusation costs a client — the jury wants the number, then the lesson.`,
        `The jury asks THE classic, numbers reshuffled: “${desc}. Your test is positive: probability you are actually affected?” The chapter’s anchor (1%, 99%, 5% ⇒ 1/6) is the template — your own numbers unroll exactly the same way, through the headcounts.`,
      ]
      : [
        `Le membre du jury fait glisser la feuille de stats : « une fédération teste 10 000 athlètes ; ${pct(prev, 0)} sont dopés. Le test attrape ${pct(sens, 0)} des dopés mais signale à tort ${pct(fp, 0)} des propres. Un athlète est positif : probabilité qu'il soit dopé ? » Résistez au réflexe ${pct(sens, 0)} — déroulez les 10 000, la méthode du chapitre 3.`,
        `Entretien conformité : « notre outil filtre 10 000 virements par jour ; ${desc}. Une alerte sonne : probabilité d'une vraie fraude ? » Derrière la question, un enjeu métier : chaque accusation à tort coûte un client — le jury veut le chiffre, puis la leçon.`,
        `Le jury pose LE classique, chiffres redistribués : « ${desc}. Votre test est positif : probabilité d'être réellement atteint ? » L'ancre du chapitre (1 %, 99 %, 5 % ⇒ 1/6) est le gabarit — vos chiffres à vous se déroulent exactement pareil, par les effectifs.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The headcounts: how many positives out of 10,000' : 'a) Les effectifs : combien de positifs sur 10 000',
          enonce: en
            ? `Out of 10,000 cases tested, how many come back positive in total (true positives + false positives)?`
            : `Sur 10 000 cas testés, combien ressortent positifs au total (vrais positifs + faux positifs) ?`,
          reponse: totalPos, tolerance: 0.005, unite: en ? 'cases' : 'cas',
          etapes: [{
            titre: en ? 'Walk the 10,000: two branches, four numbers' : 'Dérouler les 10 000 : deux branches, quatre nombres',
            contenu: en
              ? `${f(atteints, 0)} true cases, of which ${pct(sens, 0)} are caught: ${f(vraisPos, 0)} true positives. ${f(sains, 0)} clean cases, of which ${pct(fp, 0)} are wrongly flagged: ${f(fauxPos, 0)} false positives. Total: ${f(vraisPos, 0)} + ${f(fauxPos, 0)} = **${f(totalPos, 0)} positives**. This is the whole oral method: no formula, just a population you can draw on the whiteboard.`
              : `${f(atteints, 0)} vrais cas, dont ${pct(sens, 0)} attrapés : ${f(vraisPos, 0)} vrais positifs. ${f(sains, 0)} cas sains, dont ${pct(fp, 0)} signalés à tort : ${f(fauxPos, 0)} faux positifs. Total : ${f(vraisPos, 0)} + ${f(fauxPos, 0)} = **${f(totalPos, 0)} positifs**. C'est toute la méthode d'oral : aucune formule, juste une population qu'on dessine au tableau.`,
          }],
          pieges: [en
            ? `Applying the ${pct(fp, 0)} of false positives to the whole 10,000 (${f(fp * 100, 0)} cases) instead of to the ${f(sains, 0)} clean ones (${f(fauxPos, 0)}): the false-positive rate is conditional on being CLEAN. And forgetting the false positives altogether is giving up before Bayes even starts.`
            : `Appliquer les ${pct(fp, 0)} de faux positifs aux 10 000 entiers (${f(fp * 100, 0)} cas) au lieu des ${f(sains, 0)} sains (${f(fauxPos, 0)}) : le taux de faux positifs est conditionnel au fait d'être SAIN. Et oublier les faux positifs tout court, c'est abandonner avant même que Bayes commence.`],
        },
        {
          intitule: en ? 'b) The a posteriori: doped given positive' : 'b) L’a posteriori : dopé sachant positif',
          enonce: en
            ? `Given a positive test, what is the probability of being a true case, in %?`
            : `Sachant un test positif, quelle est la probabilité d'être un vrai cas, en % ?`,
          reponse: aPost, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'True positives over all positives' : 'Les vrais positifs sur tous les positifs',
            contenu: en
              ? `${f(vraisPos, 0)} / ${f(totalPos, 0)} = **${pct(aPost)}**. Among the ${f(totalPos, 0)} positives of a), only ${f(vraisPos, 0)} are true cases — the false positives DROWN the true ones because the prevalence is low. The chapter’s anchor: 1% prevalence, 99% sensitivity, 5% false positives ⇒ 99/(99 + 495) = 1/6 ≈ 16.7%. Same structure as the false signals of a rare-crisis indicator (m10, m11).`
              : `${f(vraisPos, 0)} / ${f(totalPos, 0)} = **${pct(aPost)}**. Parmi les ${f(totalPos, 0)} positifs du a), seuls ${f(vraisPos, 0)} sont de vrais cas — les faux positifs NOIENT les vrais parce que la prévalence est faible. L'ancre du chapitre : prévalence 1 %, sensibilité 99 %, faux positifs 5 % ⇒ 99/(99 + 495) = 1/6 ≈ 16,7 %. Même structure que les faux signaux d'un indicateur de crise rare (m10, m11).`,
          }],
          pieges: [en
            ? `Answering ${pct(sens, 0)} — the sensitivity: that is P(positive | doped), the question asks P(doped | positive). Swapping the two conditionals is THE interview trap; the headcount method makes the swap physically impossible.`
            : `Répondre ${pct(sens, 0)} — la sensibilité : c'est P(positif | dopé), la question demande P(dopé | positif). Échanger les deux conditionnelles est LE piège d'entretien ; la méthode des effectifs rend l'échange physiquement impossible.`],
        },
        {
          intitule: en ? 'c) The base rate: same test, targeted population' : 'c) Le taux de base : même test, population ciblée',
          enonce: en
            ? `Same test (${pct(sens, 0)} sensitivity, ${pct(fp, 0)} false positives) on a targeted population where prevalence is ${pct(prev2, 0)}: what is the new a posteriori probability, in %?`
            : `Même test (sensibilité ${pct(sens, 0)}, faux positifs ${pct(fp, 0)}) sur une population ciblée où la prévalence vaut ${pct(prev2, 0)} : quelle est la nouvelle probabilité a posteriori, en % ?`,
          reponse: aPost2, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'Only the base rate moved' : 'Seul le taux de base a bougé',
            contenu: en
              ? `Rerun the 10,000: ${f(prev2 * 100, 0)} true cases ⇒ ${f(prev2 * sens, 0)} true positives; ${f((100 - prev2) * 100, 0)} clean ⇒ ${f((100 - prev2) * fp, 0)} false positives; ${f(prev2 * sens, 0)}/(${f(prev2 * sens, 0)} + ${f((100 - prev2) * fp, 0)}) = **${pct(aPost2)}**, against ${pct(aPost)} in b). Not one parameter of the test changed — only WHO gets tested. The sentence the jury is fishing for: the value of a positive test lives in the base rate at least as much as in the test.`
              : `On redéroule les 10 000 : ${f(prev2 * 100, 0)} vrais cas ⇒ ${f(prev2 * sens, 0)} vrais positifs ; ${f((100 - prev2) * 100, 0)} sains ⇒ ${f((100 - prev2) * fp, 0)} faux positifs ; ${f(prev2 * sens, 0)}/(${f(prev2 * sens, 0)} + ${f((100 - prev2) * fp, 0)}) = **${pct(aPost2)}**, contre ${pct(aPost)} au b). Pas un paramètre du test n'a changé — seulement QUI on teste. La phrase que le jury attend : la valeur d'un test positif tient au taux de base au moins autant qu'au test.`,
          }],
          pieges: [en
            ? `Believing the quality of the test alone sets the verdict: sensitivity and false-positive rate are IDENTICAL in b) and c), yet the a posteriori jumps from ${pct(aPost)} to ${pct(aPost2)}. Ignoring the base rate is the exact fallacy the whole exercise screens for.`
            : `Croire que la qualité du test suffit au verdict : sensibilité et taux de faux positifs sont IDENTIQUES en b) et c), et pourtant l'a posteriori saute de ${pct(aPost)} à ${pct(aPost2)}. Ignorer le taux de base est exactement le sophisme que tout l'exercice cherche à détecter.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 8. m13-pb-08 — Le tirage de cartes — N2                             */
/* ------------------------------------------------------------------ */
const tirageDeCartes: ProblemeMoule = {
  id: 'm13-pb-08', moduleId: M13,
  titre: 'Le tirage de cartes : compter, pricer, coter',
  titreEn: 'The card draw: count, price, quote',
  typeDeCas: 'combinatoire',
  typeDeCasEn: 'combinatorics',
  difficulte: 2,
  scenarios: ['La couleur pure : que des piques dans la main', 'Les honneurs : as, roi, dame, valet seulement', 'La belote du desk : que des as dans un jeu de 32'],
  scenariosEn: ['The pure suit: nothing but spades in the hand', 'The honours: ace, king, queen, jack only', 'The desk’s belote: nothing but aces from a 32-card deck'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : taille du jeu, cartes favorables, cartes tirées.
    const cfg = ([
      { deck: 52, fav: 13, kMin: 2, kMax: 3 },
      { deck: 52, fav: 16, kMin: 2, kMax: 3 },
      { deck: 32, fav: 4, kMin: 2, kMax: 2 },
    ] as const)[sIdx];
    const { deck, fav } = cfg;
    const k = randInt(rng, cfg.kMin, cfg.kMax);
    const nbMains = combinaisons(deck, k);
    const nbFav = combinaisons(fav, k);
    const pMain = r2((100 * nbFav) / nbMains);
    const cote = r2(coteEquitable(pMain));

    const { en, f, pct } = outils(langue);
    const groupe = (en
      ? ['spades', 'honours (ace, king, queen or jack)', 'aces']
      : ['piques', 'honneurs (as, roi, dame ou valet)', 'as'])[sIdx];
    const contexte = (en
      ? [
        `The jury member shuffles an actual deck: “${f(deck, 0)} cards, you draw ${f(k, 0)}. All spades — what will you pay me for that bet?” Chapter 4’s ladder, always in the same order: count the hands, price the event, quote the odds. Skip a rung and the price is a guess.`,
        `Second round, the interviewer fans the deck: “${f(k, 0)} cards out of ${f(deck, 0)}. All of them honours — ace, king, queen or jack, ${f(fav, 0)} cards in the deck. Fair odds?” The honours make the count less familiar than the suits — which is exactly why he picked them.`,
        `Your desk neighbour raps the belote deck on the table: “${f(deck, 0)} cards, ${f(fav, 0)} aces. I draw ${f(k, 0)}: both aces. What odds do you give me?” A small deck changes every number and no method — count, price, quote.`,
      ]
      : [
        `Le membre du jury bat un vrai paquet : « ${f(deck, 0)} cartes, vous en tirez ${f(k, 0)}. Que des piques — vous me payez combien ce pari ? » L'échelle du chapitre 4, toujours dans le même ordre : compter les mains, pricer l'événement, coter. Sautez un barreau et le prix est une devinette.`,
        `Deuxième tour, l'interviewer étale le paquet en éventail : « ${f(k, 0)} cartes sur ${f(deck, 0)}. Rien que des honneurs — as, roi, dame ou valet, ${f(fav, 0)} cartes du paquet. Cote équitable ? » Les honneurs rendent le compte moins familier que les couleurs — c'est exactement pourquoi il les a choisis.`,
        `Votre voisin de desk claque le paquet de belote sur la table : « ${f(deck, 0)} cartes, ${f(fav, 0)} as. J'en tire ${f(k, 0)} : les deux as. Vous me donnez quelle cote ? » Un petit paquet change tous les chiffres et aucune méthode — compter, pricer, coter.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) Count: the number of possible hands' : 'a) Compter : le nombre de mains possibles',
          enonce: en
            ? `How many distinct hands of ${f(k, 0)} cards can be drawn from a ${f(deck, 0)}-card deck — C(${f(deck, 0)}, ${f(k, 0)})?`
            : `Combien de mains distinctes de ${f(k, 0)} cartes peut-on tirer d'un jeu de ${f(deck, 0)} — C(${f(deck, 0)}, ${f(k, 0)}) ?`,
          reponse: nbMains, tolerance: 0.005, unite: en ? 'hands' : 'mains',
          etapes: [{
            titre: en ? 'C(n, k): simplify BEFORE multiplying' : 'C(n, k) : simplifier AVANT de multiplier',
            contenu: en
              ? `${f(deck, 0)} × ${f(deck - 1, 0)}${k === 3 ? ` × ${f(deck - 2, 0)}` : ''} / ${k === 3 ? '6' : '2'} = **${f(nbMains, 0)} hands**. Ordered draws divided by the k! orderings of the same hand. The course anchor: C(52, 5) = 2,598,960 poker hands — and the by-hand discipline: cancel factors before multiplying, never after.`
              : `${f(deck, 0)} × ${f(deck - 1, 0)}${k === 3 ? ` × ${f(deck - 2, 0)}` : ''} / ${k === 3 ? '6' : '2'} = **${f(nbMains, 0)} mains**. Les tirages ordonnés divisés par les k! ordres d'une même main. L'ancre du cours : C(52, 5) = 2 598 960 mains de poker — et la discipline du calcul à la main : simplifier les facteurs avant de multiplier, jamais après.`,
          }],
          pieges: [en
            ? `Stopping at the ordered count ${f(deck, 0)} × ${f(deck - 1, 0)}${k === 3 ? ` × ${f(deck - 2, 0)}` : ''} = ${f(nbMains * (k === 3 ? 6 : 2), 0)}: a hand has no order — forgetting the division by k! overcounts every hand ${k === 3 ? '6' : '2'} times, and the error silently divides your probability in b).`
            : `S'arrêter au compte ordonné ${f(deck, 0)} × ${f(deck - 1, 0)}${k === 3 ? ` × ${f(deck - 2, 0)}` : ''} = ${f(nbMains * (k === 3 ? 6 : 2), 0)} : une main n'a pas d'ordre — oublier la division par k! surcompte chaque main ${k === 3 ? '6' : '2'} fois, et l'erreur divise en silence votre probabilité du b).`],
        },
        {
          intitule: en ? 'b) Price: the probability of the hand' : 'b) Pricer : la probabilité de la main',
          enonce: en
            ? `What is the probability that all ${f(k, 0)} cards drawn are ${groupe} (${f(fav, 0)} such cards in the deck), in %?`
            : `Quelle est la probabilité que les ${f(k, 0)} cartes tirées soient toutes des ${groupe} (${f(fav, 0)} cartes de ce type dans le jeu), en % ?`,
          reponse: pMain, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'Favourable over possible: C(fav, k)/C(deck, k)' : 'Favorables sur possibles : C(fav, k)/C(jeu, k)',
            contenu: en
              ? `C(${f(fav, 0)}, ${f(k, 0)}) = ${f(nbFav, 0)} all-${groupe} hands, over the ${f(nbMains, 0)} hands of a): 100 × ${f(nbFav, 0)}/${f(nbMains, 0)} = **${pct(pMain)}**. Cross-check without combinations, card by card: ${f(fav, 0)}/${f(deck, 0)} × ${f(fav - 1, 0)}/${f(deck - 1, 0)}${k === 3 ? ` × ${f(fav - 2, 0)}/${f(deck - 2, 0)}` : ''} — same number, and saying both routes out loud is worth points.`
              : `C(${f(fav, 0)}, ${f(k, 0)}) = ${f(nbFav, 0)} mains tout-${groupe}, sur les ${f(nbMains, 0)} mains du a) : 100 × ${f(nbFav, 0)}/${f(nbMains, 0)} = **${pct(pMain)}**. Contre-vérification sans combinaisons, carte à carte : ${f(fav, 0)}/${f(deck, 0)} × ${f(fav - 1, 0)}/${f(deck - 1, 0)}${k === 3 ? ` × ${f(fav - 2, 0)}/${f(deck - 2, 0)}` : ''} — même nombre, et dérouler les deux routes à voix haute rapporte des points.`,
          }],
          pieges: [en
            ? `Computing (${f(fav, 0)}/${f(deck, 0)})^${f(k, 0)} = ${pct(r2(100 * Math.pow(fav / deck, k)))}: that assumes the card is PUT BACK. Drawn cards deplete the deck — the numerators and denominators must both shrink at every draw.`
            : `Calculer (${f(fav, 0)}/${f(deck, 0)})^${f(k, 0)} = ${pct(r2(100 * Math.pow(fav / deck, k)))} : c'est supposer la carte REMISE dans le jeu. Les cartes tirées épuisent le paquet — numérateurs et dénominateurs doivent rétrécir à chaque tirage.`],
        },
        {
          intitule: en ? 'c) Quote: the fair odds' : 'c) Coter : la cote équitable',
          enonce: en
            ? `What are the fair odds “for 1” on that event — the odds at which the bet has zero expectation?`
            : `Quelle est la cote équitable « pour 1 » sur cet événement — la cote à laquelle le pari est d'espérance nulle ?`,
          reponse: cote, tolerance: 0.005, unite: en ? 'for 1' : 'pour 1',
          etapes: [{
            titre: en ? 'Fair odds = 100/p: the price of rarity' : 'Cote équitable = 100/p : le prix de la rareté',
            contenu: en
              ? `100 / ${f(pMain)} = **${f(cote)} for 1**: receive ${f(cote)}, stake included, per 1 staked, and the expectation is exactly zero (${f(pMain)}/100 × ${f(cote)} ≈ 1). This is the chapter 5 hinge: b) turned a count into a probability, c) turns the probability into a price — a market maker would quote around it, never AT it, to keep a margin.`
              : `100 / ${f(pMain)} = **${f(cote)} pour 1** : toucher ${f(cote)}, mise comprise, pour 1 misé, et l'espérance vaut exactement zéro (${f(pMain)}/100 × ${f(cote)} ≈ 1). C'est la charnière du chapitre 5 : b) a transformé un compte en probabilité, c) transforme la probabilité en prix — un teneur de marché cote autour, jamais DESSUS, pour garder sa marge.`,
          }],
          pieges: [en
            ? `Inverting the percentage without the factor 100 (1/${f(pMain)} = ${f(r2(1 / pMain), 3)}): the probability is expressed in %, so the fair odds are 100/p — dimension checks are free and catch this instantly.`
            : `Inverser le pourcentage sans le facteur 100 (1/${f(pMain)} = ${f(r2(1 / pMain), 3)}) : la probabilité est exprimée en %, la cote équitable est donc 100/p — le contrôle de dimension est gratuit et attrape l'erreur immédiatement.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 9. m13-pb-09 — L'estimation de Fermi guidée — N2                    */
/* ------------------------------------------------------------------ */
const fermiGuidee: ProblemeMoule = {
  id: 'm13-pb-09', moduleId: M13,
  titre: 'L’estimation de Fermi guidée : trois facteurs, un ordre de grandeur',
  titreEn: 'The guided Fermi estimate: three factors, one order of magnitude',
  typeDeCas: 'estimation de Fermi',
  typeDeCasEn: 'Fermi estimation',
  difficulte: 2,
  scenarios: ['Les cafés de la Défense : combien par jour ?', 'La tour de bureaux : combien de pages imprimées par jour ?', 'Les paiements par carte : combien en France par jour ?'],
  scenariosEn: ['La Défense coffees: how many a day?', 'The office tower: how many pages printed a day?', 'Card payments: how many in France a day?'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : facteur 1 (population, entier × échelle), facteur 2
    // (proportion 0-1), facteur 3 (fréquence, entier). Tirages AVANT la langue.
    const cfg = ([
      { b1: [80, 120], h1: [200, 300], s1: 1000, b2: [0.2, 0.3], h2: [0.6, 0.9], b3: [1, 1], h3: [2, 4] },
      { b1: [3, 5], h1: [8, 12], s1: 1000, b2: [0.2, 0.4], h2: [0.6, 0.8], b3: [5, 10], h3: [30, 60] },
      { b1: [55, 60], h1: [70, 75], s1: 1000000, b2: [0.3, 0.5], h2: [0.7, 0.9], b3: [1, 2], h3: [3, 5] },
    ] as const)[sIdx];
    const b1 = randInt(rng, cfg.b1[0], cfg.b1[1]) * cfg.s1;
    const h1 = randInt(rng, cfg.h1[0], cfg.h1[1]) * cfg.s1;
    const b2 = randFloat(rng, cfg.b2[0], cfg.b2[1], 2);
    const h2 = randFloat(rng, cfg.h2[0], cfg.h2[1], 2);
    const b3 = randInt(rng, cfg.b3[0], cfg.b3[1]);
    const h3 = randInt(rng, cfg.h3[0], cfg.h3[1]);
    const m1 = r2(estimationFermi(b1, h1));
    const m2 = r2(estimationFermi(b2, h2));
    const m3 = r2(estimationFermi(b3, h3));
    const produit = r2(m1 * m2 * m3);
    const ordre = Math.round(Math.log10(produit));
    const moyArith1 = r2((b1 + h1) / 2);

    const { en, f } = outils(langue);
    const lib = (en
      ? [
        { objet: 'coffees bought at La Défense every workday', f1: 'workers on the site', f2: 'share who buy at least one coffee', f3: 'coffees per buyer per day', unite: 'coffees/day' },
        { objet: 'pages printed in the tower every workday', f1: 'occupants of the tower', f2: 'share who print on a given day', f3: 'pages per printing occupant', unite: 'pages/day' },
        { objet: 'card payments made in France every day', f1: 'inhabitants of France', f2: 'share who pay by card on a given day', f3: 'payments per paying person', unite: 'payments/day' },
      ]
      : [
        { objet: 'cafés achetés à la Défense chaque jour ouvré', f1: 'salariés du site', f2: 'proportion qui achète au moins un café', f3: 'cafés par acheteur et par jour', unite: 'cafés/jour' },
        { objet: 'pages imprimées dans la tour chaque jour ouvré', f1: 'occupants de la tour', f2: 'proportion qui imprime un jour donné', f3: 'pages par occupant qui imprime', unite: 'pages/jour' },
        { objet: 'paiements par carte effectués en France chaque jour', f1: 'habitants de la France', f2: 'proportion qui paie par carte un jour donné', f3: 'paiements par payeur', unite: 'paiements/jour' },
      ])[sIdx];
    const bornes = en
      ? `${lib.f1}: between ${f(b1, 0)} and ${f(h1, 0)}; ${lib.f2}: between ${f(b2)} and ${f(h2)}; ${lib.f3}: between ${f(b3, 0)} and ${f(h3, 0)}`
      : `${lib.f1} : entre ${f(b1, 0)} et ${f(h1, 0)} ; ${lib.f2} : entre ${f(b2)} et ${f(h2)} ; ${lib.f3} : entre ${f(b3, 0)} et ${f(h3, 0)}`;
    const contexte = (en
      ? [
        `The jury member looks out the window towards the towers: “how many ${lib.objet}? You have the whiteboard.” Chapter 2’s protocol: bracket each factor with two bounds you would defend, take the GEOMETRIC middle of each, multiply, announce the power of ten. Your safe bounds — ${bornes}.`,
        `Case interview, no laptop: “estimate the ${lib.objet}. Out loud, structure first.” The jury grades the scaffolding, not the trivia: three factors, two defensible bounds each, geometric middles, one product. Your brackets — ${bornes}.`,
        `The interviewer taps his card on the table: “${lib.objet} — order of magnitude?” Nobody knows the true number, including him; what is graded is the machine that produces it. Your bounds, agreed as “safe”: ${bornes}.`,
      ]
      : [
        `Le membre du jury regarde par la fenêtre vers les tours : « combien de ${lib.objet} ? Le tableau blanc est à vous. » Le protocole du chapitre 2 : encadrer chaque facteur par deux bornes défendables, prendre le milieu GÉOMÉTRIQUE de chacune, multiplier, annoncer la puissance de dix. Vos bornes sûres — ${bornes}.`,
        `Étude de cas, sans ordinateur : « estimez les ${lib.objet}. À voix haute, la structure d'abord. » Le jury note l'échafaudage, pas la culture générale : trois facteurs, deux bornes défendables chacun, des milieux géométriques, un produit. Vos encadrements — ${bornes}.`,
        `L'interviewer tapote sa carte sur la table : « ${lib.objet} — ordre de grandeur ? » Personne ne connaît le vrai chiffre, lui compris ; ce qui est noté, c'est la machine qui le produit. Vos bornes, admises « sûres » : ${bornes}.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The first factor: the geometric middle' : 'a) Le premier facteur : le milieu géométrique',
          enonce: en
            ? `What is the geometric middle of the first factor (${lib.f1}), bounds ${f(b1, 0)} and ${f(h1, 0)}?`
            : `Quel est le milieu géométrique du premier facteur (${lib.f1}), bornes ${f(b1, 0)} et ${f(h1, 0)} ?`,
          reponse: m1, tolerance: 0.005,
          etapes: [{
            titre: en ? '√(low × high): the multiplicative middle' : '√(basse × haute) : le milieu multiplicatif',
            contenu: en
              ? `√(${f(b1, 0)} × ${f(h1, 0)}) = **${f(m1)}**. On orders of magnitude the middle is multiplicative: the estimate should be “as far” from each bound in RATIO, not in difference. The course anchor: between 1,000 and 1,000,000 the Fermi middle is 31,623 — the arithmetic mean, 500,500, sits glued to the high bound and crushes the low one.`
              : `√(${f(b1, 0)} × ${f(h1, 0)}) = **${f(m1)}**. Sur des ordres de grandeur, le milieu est multiplicatif : l'estimation doit être « aussi loin » de chaque borne en RAPPORT, pas en écart. L'ancre du cours : entre 1 000 et 1 000 000, le milieu de Fermi est 31 623 — la moyenne arithmétique, 500 500, colle à la borne haute et écrase la basse.`,
          }],
          pieges: [en
            ? `Taking the arithmetic mean (${f(b1, 0)} + ${f(h1, 0)})/2 = ${f(moyArith1, 0)}: on a wide bracket it ignores the low bound almost entirely. The whole Fermi discipline is geometric middles — anything else quietly biases the estimate upwards.`
            : `Prendre la moyenne arithmétique (${f(b1, 0)} + ${f(h1, 0)})/2 = ${f(moyArith1, 0)} : sur un encadrement large, elle ignore presque entièrement la borne basse. Toute la discipline de Fermi est le milieu géométrique — tout autre choix biaise l'estimation vers le haut, en silence.`],
        },
        {
          intitule: en ? 'b) The product: the full estimate' : 'b) Le produit : l’estimation complète',
          enonce: en
            ? `Take the geometric middles of the two other factors the same way, then multiply the three middles: what is the Fermi estimate of the ${lib.objet}?`
            : `Prenez de la même façon les milieux géométriques des deux autres facteurs, puis multipliez les trois milieux : quelle est l'estimation de Fermi des ${lib.objet} ?`,
          reponse: produit, tolerance: 0.01, unite: lib.unite,
          etapes: [
            {
              titre: en ? 'The two remaining middles' : 'Les deux milieux restants',
              contenu: en
                ? `Factor 2: √(${f(b2)} × ${f(h2)}) = **${f(m2)}**. Factor 3: √(${f(b3, 0)} × ${f(h3, 0)}) = **${f(m3)}**. Same gesture every time — bounds, root, done. Note that the geometric middle works identically on a proportion and on a headcount: it only sees ratios.`
                : `Facteur 2 : √(${f(b2)} × ${f(h2)}) = **${f(m2)}**. Facteur 3 : √(${f(b3, 0)} × ${f(h3, 0)}) = **${f(m3)}**. Même geste à chaque fois — bornes, racine, terminé. Notez que le milieu géométrique fonctionne à l'identique sur une proportion et sur un effectif : il ne voit que des rapports.`,
            },
            {
              titre: en ? 'Multiply the middles' : 'Multiplier les milieux',
              contenu: en
                ? `${f(m1)} × ${f(m2)} × ${f(m3)} = **${f(produit)} ${lib.unite}**. The factorisation is the answer the jury grades: each factor is small enough to bracket honestly, and the product carries the estimate. Errors on independent factors partially cancel — the deep reason Fermi estimates land so often within a factor of 3.`
                : `${f(m1)} × ${f(m2)} × ${f(m3)} = **${f(produit)} ${lib.unite}**. La factorisation EST la réponse que le jury note : chaque facteur est assez petit pour être encadré honnêtement, et le produit porte l'estimation. Les erreurs de facteurs indépendants se compensent en partie — la raison profonde pour laquelle les estimations de Fermi tombent si souvent à un facteur 3 près.`,
            },
          ],
          pieges: [en
            ? `Multiplying the three LOW bounds (${f(r2(b1 * b2 * b3), 0)}) or the three HIGH ones (${f(r2(h1 * h2 * h3), 0)}) and calling it the estimate: those are the bracket’s edges, useful to quote as an error bar — the estimate itself is the product of the middles.`
            : `Multiplier les trois bornes BASSES (${f(r2(b1 * b2 * b3), 0)}) ou les trois HAUTES (${f(r2(h1 * h2 * h3), 0)}) et l'appeler estimation : ce sont les bords de l'encadrement, utiles à citer comme barre d'erreur — l'estimation elle-même est le produit des milieux.`],
        },
        {
          intitule: en ? 'c) The announcement: the order of magnitude' : 'c) L’annonce : l’ordre de grandeur',
          enonce: en
            ? `What order of magnitude do you announce — the exponent k of the nearest power of 10 (log₁₀ of the estimate, rounded to the nearest integer)?`
            : `Quel ordre de grandeur annoncez-vous — l'exposant k de la puissance de 10 la plus proche (log₁₀ de l'estimation, arrondi à l'entier) ?`,
          reponse: ordre, tolerance: 0.5, toleranceMode: 'absolu',
          etapes: [{
            titre: en ? 'log₁₀, then round: announce 10^k' : 'log₁₀, puis arrondi : annoncer 10^k',
            contenu: en
              ? `log₁₀(${f(produit)}) = ${f(r2(Math.log10(produit)))} → k = **${f(ordre, 0)}**: “of the order of 10^${f(ordre, 0)} ${lib.unite}”. That is the deliverable of a Fermi answer — the jury sentence in full: the bracket, the middles, the product, THEN the power of ten with its honest error bar of a factor of about 3 either way.`
              : `log₁₀(${f(produit)}) = ${f(r2(Math.log10(produit)))} → k = **${f(ordre, 0)}** : « de l'ordre de 10^${f(ordre, 0)} ${lib.unite} ». C'est le livrable d'une réponse de Fermi — la phrase complète pour le jury : l'encadrement, les milieux, le produit, PUIS la puissance de dix avec sa barre d'erreur honnête d'un facteur 3 environ dans chaque sens.`,
          }],
          pieges: [en
            ? `Announcing ${f(produit)} as if it were precise: the six digits are an artefact of the calculation, not knowledge. False precision is graded DOWN in a Fermi question — the contract is the power of ten, plus its error bar.`
            : `Annoncer ${f(produit)} comme si c'était précis : les six chiffres sont un artefact du calcul, pas de la connaissance. La fausse précision est SANCTIONNÉE dans une question de Fermi — le contrat est la puissance de dix, plus sa barre d'erreur.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 10. m13-pb-10 — Le dé à relance — N2                                */
/* ------------------------------------------------------------------ */
const deARelance: ProblemeMoule = {
  id: 'm13-pb-10', moduleId: M13,
  titre: 'Le dé à relance : pricer l’option de rejouer',
  titreEn: 'The reroll die: pricing the option to roll again',
  typeDeCas: 'jeu de marché',
  typeDeCasEn: 'market game',
  difficulte: 2,
  scenarios: ['Le d6 du jury : une relance offerte, quel prix ?', 'Le d10 du desk : même option, plus de faces', 'Le d20 du dernier tour : l’option grossit avec le dé'],
  scenariosEn: ['The jury’s d6: one reroll offered, what price?', 'The desk’s d10: same option, more faces', 'The final-round d20: the option grows with the die'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : faces (paires, pour un seuil net), multiplicateur €/point.
    const cfg = ([
      { faces: 6, mMin: 1, mMax: 3 },
      { faces: 10, mMin: 1, mMax: 2 },
      { faces: 20, mMin: 1, mMax: 2 },
    ] as const)[sIdx];
    const faces = cfg.faces;
    const mult = randInt(rng, cfg.mMin, cfg.mMax);
    const eFace = r2(esperanceLancerDe(faces));
    const seuil = faces / 2 + 1;
    const eSans = r2(mult * eFace);
    const probas: number[] = [];
    const gains: number[] = [];
    for (let i = 1; i <= faces; i++) {
      probas.push(100 / faces);
      gains.push(i >= seuil ? i : eFace); // en dessous du seuil : on relance, on « vaut » E
    }
    const eAvecPts = r2(esperanceJeu(probas, gains));
    const eAvec = r2(mult * eAvecPts);
    const option = r2(eAvec - eSans);
    const moyGardes = r2((seuil + faces) / 2);

    const { en, f, eur } = outils(langue);
    const desc = en
      ? `one roll of a fair ${f(faces, 0)}-sided die at ${eur(mult, 0)} per point — and after seeing the first roll, you may reroll ONCE, discarding the first result`
      : `un lancer d'un dé équilibré à ${f(faces, 0)} faces à ${eur(mult, 0)} le point — et après avoir vu le premier lancer, vous pouvez relancer UNE fois, en abandonnant le premier résultat`;
    const contexte = (en
      ? [
        `The jury member rolls his die twice for show: “new game — ${desc}. What is that worth?” This is chapter 5’s closing act: the value of a game with a choice inside is not an average of faces any more, it is a STRATEGY priced.`,
        `Your desk neighbour raises the stakes at the coffee machine: “${desc}. I sell you the ticket — name your maximum.” Two prices exist: the die without the reroll, the die with it. The difference is the option, and he wants to see you compute it.`,
        `Final round, the d20 lands on the table: “${desc}. Price the game, then price the RIGHT to reroll separately.” Bigger dice, bigger option — say why before the arithmetic and the job is half done.`,
      ]
      : [
        `Le membre du jury lance son dé deux fois pour la forme : « nouveau jeu — ${desc}. Ça vaut combien ? » C'est l'acte final du chapitre 5 : la valeur d'un jeu avec un choix dedans n'est plus une moyenne de faces, c'est une STRATÉGIE qu'on price.`,
        `Votre voisin de desk monte les enchères à la machine à café : « ${desc}. Je te vends le ticket — annonce ton maximum. » Deux prix existent : le dé sans la relance, le dé avec. La différence est l'option, et il veut vous voir la calculer.`,
        `Dernier tour, le d20 se pose sur la table : « ${desc}. Pricez le jeu, puis pricez le DROIT de relancer, séparément. » Plus le dé est grand, plus l'option grossit — dire pourquoi avant l'arithmétique, et le travail est à moitié fait.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The base: the game without the reroll' : 'a) La base : le jeu sans relance',
          enonce: en
            ? `Without the reroll, what is the expected value of the game (one roll at ${eur(mult, 0)} per point), in €?`
            : `Sans la relance, quelle est l'espérance du jeu (un lancer à ${eur(mult, 0)} le point), en € ?`,
          reponse: eSans, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'E = (f + 1)/2, then the multiplier' : 'E = (f + 1)/2, puis le multiplicateur',
            contenu: en
              ? `(${f(faces, 0)} + 1)/2 = ${f(eFace, 1)} points, × ${eur(mult, 0)} = **${eur(eSans)}**. The chapter anchor: E[d6] = 3.5. This is the floor of every price in this game — the reroll can only ADD value, since you are free to ignore it.`
              : `(${f(faces, 0)} + 1)/2 = ${f(eFace, 1)} points, × ${eur(mult, 0)} = **${eur(eSans)}**. L'ancre du chapitre : E[d6] = 3,5. C'est le plancher de tous les prix de ce jeu — la relance ne peut qu'AJOUTER de la valeur, puisqu'on est libre de l'ignorer.`,
          }],
          pieges: [en
            ? `Reading the middle of the faces as ${f(faces / 2, 0)}: the integers 1 to ${f(faces, 0)} centre on (${f(faces, 0)} + 1)/2 = ${f(eFace, 1)}. Half a point off here and every price downstream inherits the error.`
            : `Lire le milieu des faces comme ${f(faces / 2, 0)} : les entiers de 1 à ${f(faces, 0)} se centrent sur (${f(faces, 0)} + 1)/2 = ${f(eFace, 1)}. Un demi-point d'erreur ici et tous les prix en aval en héritent.`],
        },
        {
          intitule: en ? 'b) The strategy: the keep threshold' : 'b) La stratégie : le seuil de conservation',
          enonce: en
            ? `Optimal play: what is the SMALLEST first-roll face you keep (no reroll), in points?`
            : `Jeu optimal : quelle est la PLUS PETITE face du premier lancer que vous gardez (pas de relance), en points ?`,
          reponse: seuil, tolerance: 0.5, toleranceMode: 'absolu', unite: 'points',
          etapes: [{
            titre: en ? 'Compare the face to the reroll’s value' : 'Comparer la face à la valeur de la relance',
            contenu: en
              ? `Rerolling is worth ${f(eFace, 1)} points on average — so keep a face if and only if it BEATS ${f(eFace, 1)}: the smallest kept face is **${f(seuil, 0)}**. On a d6: reroll 1-3, keep 4-6. The threshold is not a taste, it is a comparison of two expectations — say that sentence, it is the whole answer.`
              : `Relancer vaut ${f(eFace, 1)} points en moyenne — on garde donc une face si et seulement si elle BAT ${f(eFace, 1)} : la plus petite face gardée est **${f(seuil, 0)}**. Sur un d6 : on relance 1-3, on garde 4-6. Le seuil n'est pas un goût, c'est une comparaison de deux espérances — dites cette phrase, elle est toute la réponse.`,
          }],
          pieges: [en
            ? `Keeping ${f(faces / 2, 0)} “because it is halfway”: ${f(faces / 2, 0)} < ${f(eFace, 1)}, so the reroll beats it in expectation. And deciding on gut feel (“a ${f(seuil - 1, 0)} feels decent”) is precisely the anecdote-thinking the game is designed to expose.`
            : `Garder ${f(faces / 2, 0)} « parce que c'est la moitié » : ${f(faces / 2, 0)} < ${f(eFace, 1)}, donc la relance le bat en espérance. Et décider au ressenti (« un ${f(seuil - 1, 0)}, c'est pas mal ») est exactement la pensée-anecdote que le jeu est conçu pour exposer.`],
        },
        {
          intitule: en ? 'c) The value: the game with the reroll' : 'c) La valeur : le jeu avec relance',
          enonce: en
            ? `Playing the threshold of b), what is the expected value of the game WITH the reroll, in €?`
            : `En jouant le seuil du b), quelle est l'espérance du jeu AVEC la relance, en € ?`,
          reponse: eAvec, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'Half kept, half rerolled' : 'Une moitié gardée, une moitié relancée',
            contenu: en
              ? `With probability 1/2 the first roll is ≥ ${f(seuil, 0)}, average ${f(moyGardes, 1)}; with probability 1/2 you reroll, worth ${f(eFace, 1)}. E = 0.5 × ${f(moyGardes, 1)} + 0.5 × ${f(eFace, 1)} = ${f(eAvecPts)} points, × ${eur(mult, 0)} = **${eur(eAvec)}**. The chapter anchor on a d6: 0.5 × 5 + 0.5 × 3.5 = 4.25.`
              : `Avec probabilité 1/2 le premier lancer est ≥ ${f(seuil, 0)}, moyenne ${f(moyGardes, 1)} ; avec probabilité 1/2 on relance, ce qui vaut ${f(eFace, 1)}. E = 0,5 × ${f(moyGardes, 1)} + 0,5 × ${f(eFace, 1)} = ${f(eAvecPts)} points, × ${eur(mult, 0)} = **${eur(eAvec)}**. L'ancre du chapitre sur un d6 : 0,5 × 5 + 0,5 × 3,5 = 4,25.`,
          }],
          pieges: [en
            ? `Averaging “two rolls, so 2 × ${f(eFace, 1)}” or rerolling everything: if you ALWAYS reroll, the first roll is pure theatre and E stays ${f(eFace, 1)} points. The extra value exists only because the reroll is exercised SELECTIVELY — below the threshold, never above.`
            : `Moyenner « deux lancers, donc 2 × ${f(eFace, 1)} » ou tout relancer : si on relance TOUJOURS, le premier lancer est du théâtre et E reste ${f(eFace, 1)} points. Le surplus n'existe que parce que la relance est exercée SÉLECTIVEMENT — sous le seuil, jamais au-dessus.`],
        },
        {
          intitule: en ? 'd) The option: the price of the right to reroll' : 'd) L’option : le prix du droit de relancer',
          enonce: en
            ? `What is the value of the reroll option alone — the game of c) minus the game of a), in €?`
            : `Que vaut l'option de relance seule — le jeu du c) moins le jeu du a), en € ?`,
          reponse: option, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'Option = E(with) − E(without)' : 'Option = E(avec) − E(sans)',
            contenu: en
              ? `${f(eAvec)} − ${f(eSans)} = **${eur(option)}**. The d6 anchor at €1 per point: 4.25 − 3.50 = 0.75. An option has value because it is exercised ONLY when favourable — you dump the bad first rolls and keep the good ones. That asymmetry is the entire logic of financial options, demonstrated on a die: the jury sentence is “I pay up to ${eur(eAvec)} for the game with reroll, of which ${eur(option)} is the option”.`
              : `${f(eAvec)} − ${f(eSans)} = **${eur(option)}**. L'ancre d6 à 1 € le point : 4,25 − 3,50 = 0,75. Une option a de la valeur parce qu'elle n'est exercée QUE lorsque c'est favorable — on jette les mauvais premiers lancers et on garde les bons. Cette asymétrie est toute la logique des options financières, démontrée sur un dé : la phrase pour le jury est « je paie jusqu'à ${eur(eAvec)} le jeu avec relance, dont ${eur(option)} pour l'option ».`,
          }],
          pieges: [en
            ? `Paying the same ticket for the game with or without the reroll: the right to redo costs ${eur(option)} of real expectation. Conversely, paying MORE than ${eur(option)} for the option (“a second chance is priceless”) is anecdote-pricing — the option is worth exactly the expectation it adds, not the comfort it sells.`
            : `Payer le même ticket pour le jeu avec ou sans relance : le droit de refaire vaut ${eur(option)} d'espérance bien réelle. À l'inverse, payer PLUS que ${eur(option)} l'option (« une seconde chance, ça n'a pas de prix ») est du pricing-anecdote — l'option vaut exactement l'espérance qu'elle ajoute, pas le confort qu'elle vend.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* Export du lot 1 — fusionné dans problems.ts par le contrôleur.      */
/* ------------------------------------------------------------------ */
export const problemesLot1: ProblemeMoule[] = [
  placementQuiDouble,     // m13-pb-01 · N1
  jeuDeDeSimple,          // m13-pb-02 · N1
  pariDuJury,             // m13-pb-03 · N1
  serieDePiles,           // m13-pb-04 · N1
  pariDeMere,             // m13-pb-05 · N2
  salleDesAnniversaires,  // m13-pb-06 · N2
  testDeDopage,           // m13-pb-07 · N2
  tirageDeCartes,         // m13-pb-08 · N2
  fermiGuidee,            // m13-pb-09 · N2
  deARelance,             // m13-pb-10 · N2
];
