/**
 * Moules de problèmes multi-étapes du module Brainteasers & oral — LOT 2 :
 * 4 moules N3 (m13-pb-11 à m13-pb-14 : le market making du dé, la cascade
 * de Bayes, le tournoi de paris, Fermi sous contrainte) et 6 boss N4
 * narratifs (m13-pb-15 à m13-pb-20 : l'oral aux trois épreuves, le candidat
 * et le menteur, la table de poker du desk, le drive de l'entretien — pont
 * m5 —, la VaR au tableau — pont m12 —, les trois portes et le contrat).
 * Les boss sont des SIMULATIONS D'ORAL COMPLET : un seul fil narratif, le
 * jury qui enchaîne, et chaque réponse qui nourrit la suivante.
 * Chaque moule : 3 scénarios FR + EN (habillages ET bornes de tirage
 * différents), 5-6 sous-questions chaînées, corrigés calculés via
 * calculs.ts (m13) et deux ponts assumés — pdImplicitePct (m5) et
 * varParametrique (m12) — jamais de texte figé.
 * INVARIANT BILINGUE : tous les tirages aléatoires ont lieu AVANT toute
 * branche de langue — même seed + même scénario ⇒ mêmes nombres en français
 * et en anglais.
 * Conventions (en-têtes de calculs.ts m13/m5/m12) : les PROBABILITÉS se
 * passent et se rendent en % (50 = 50 %) ; les cotes s'entendent « pour 1 »
 * (cote équitable = 100/p, probabilité implicite = 1/cote) ; les taux de la
 * règle de 72 sont annuels en %, composition discrète ; Fermi prend la
 * moyenne GÉOMÉTRIQUE des bornes ; la PD implicite d'un spread vaut
 * (spread/100)/(1 − R/100) ; la VaR paramétrique vaut V·z·σ·√(h/252), z =
 * 1,65 à 95 % et 2,33 à 99 %. Les chaînages s'appuient sur les valeurs
 * ARRONDIES (r2) des sous-questions précédentes, pour que le corrigé
 * affiché soit recomposable à la calculatrice. Les ancres des habillages
 * (E[d6] = 3,5 ; Bayes des 10 000 ⇒ 1/6 ; C(52, 5) = 2 598 960 ; Monty
 * Hall = 2/3 en changeant, 1/2 si l'animateur ignore ; Kelly f* =
 * (bp − q)/b ; VaR(100, 20 %, 1,65, 1 j) ≈ 2,08 M) sont celles des
 * chapitres 1 à 7 du module et des chapitres sources des ponts.
 */
import { formatNombreLangue } from '../../../engine/answers';
import { mulberry32, randFloat, randInt } from '../../../engine/rng';
import type { Langue, ProblemGenerator } from '../../../engine/types';
import { pdImplicitePct } from '../05-credit/calculs';
import { varParametrique } from '../12-gestion-actifs-risques/calculs';
import {
  anneesDoublementExactes, bayesAPosterioriPct, combinaisons, coteEquitable,
  erreurRelativePct, esperanceJeu, esperanceLancerDe, estimationFermi,
  probaSerieConsecutivePct, regleDe72,
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
/* 11. m13-pb-11 — Le market making du dé — N3                         */
/* ------------------------------------------------------------------ */
const marketMakingDuDe: ProblemeMoule = {
  id: 'm13-pb-11', moduleId: M13,
  titre: 'Le market making du dé : coter, être traité, requoter',
  titreEn: 'Market making a die: quote, get lifted, requote',
  typeDeCas: 'jeu de marché',
  typeDeCasEn: 'market game',
  difficulte: 3,
  scenarios: ['Le d6 du jury : « cotez-moi ce dé — et tenez votre prix »', 'Le d10 de la machine à café : dix faces, un flux à coter', 'Le d20 du dernier tour : le jury joue le client qui insiste'],
  scenariosEn: ['The jury’s d6: “make me a market on this die — and stand by your price”', 'The coffee-machine d10: ten faces, a flow to quote', 'The final-round d20: the jury plays the client who keeps coming back'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : faces, multiplicateur €/point.
    const cfg = ([
      { faces: 6, mMin: 2, mMax: 4 },
      { faces: 10, mMin: 1, mMax: 3 },
      { faces: 20, mMin: 1, mMax: 2 },
    ] as const)[sIdx];
    const faces = cfg.faces;
    const mult = randInt(rng, cfg.mMin, cfg.mMax);
    const demi = r2(randFloat(rng, 0.15, 0.35, 2) * mult);      // demi-fourchette
    const faceTiree = randInt(rng, 1, faces);                   // la face qui sort
    const decalage = r2(randFloat(rng, 0.1, 0.3, 2) * mult);    // requote après deux levées

    const probasFaces = Array.from({ length: faces }, () => 100 / faces);
    const gainsFaces = Array.from({ length: faces }, (_, i) => mult * (i + 1));
    const eFace = r2(esperanceLancerDe(faces));
    const eJeu = r2(esperanceJeu(probasFaces, gainsFaces));
    const ask = r2(eJeu + demi);
    const bid = r2(eJeu - demi);
    const edgeAsk = r2(ask - eJeu);
    const pnl = r2(ask - mult * faceTiree);
    const askRequote = r2(eJeu + decalage + demi);
    const bidRequote = r2(eJeu + decalage - demi);

    const { en, f, eur } = outils(langue);
    const desc = en
      ? `one roll of a fair ${f(faces, 0)}-sided die; the buyer of the flow receives ${eur(mult, 0)} per point of the face rolled; you must show a two-way price of half-width ±${eur(demi)}`
      : `un lancer d'un dé équilibré à ${f(faces, 0)} faces ; l'acheteur du flux reçoit ${eur(mult, 0)} par point de la face obtenue ; vous devez afficher une fourchette de demi-largeur ±${eur(demi)}`;
    const contexte = (en
      ? [
        `The jury member sets a die on the table and crosses his arms: “make me a market.” The game: ${desc}. This is chapter 5 in one sentence — value first, two prices second, and then the part that actually gets graded: what you do AFTER someone trades against you.`,
        `Coffee machine, 8:55. Your desk neighbour produces a ten-sided die and plays the client: ${desc}. He will trade, maybe twice, and watch whether your quote lives or stays nailed to the wall — the same test a jury runs, without the suit.`,
        `Final round. The interviewer borrows a twenty-sided die and announces he will be your flow all afternoon: ${desc}. Twenty faces change nothing about the method — expectation, symmetric spread, and a quote that listens to the flow. That last part is the hire.`,
      ]
      : [
        `Le membre du jury pose un dé sur la table et croise les bras : « faites-moi un marché. » Le jeu : ${desc}. C'est le chapitre 5 en une phrase — la valeur d'abord, deux prix ensuite, puis la partie réellement notée : ce que vous faites APRÈS que quelqu'un a traité contre vous.`,
        `Machine à café, 8 h 55. Votre voisin de desk sort un dé à dix faces et joue le client : ${desc}. Il va traiter, peut-être deux fois, et regarder si votre cotation vit ou reste clouée au mur — le même test qu'un jury, sans le costume.`,
        `Dernier tour. L'interviewer emprunte un dé à vingt faces et annonce qu'il sera votre flux tout l'après-midi : ${desc}. Vingt faces ne changent rien à la méthode — espérance, fourchette symétrique, et une cote qui écoute le flux. Cette dernière partie est l'embauche.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The brick: the expected face' : 'a) La brique : la face espérée',
          enonce: en
            ? `Before saying a word: what is the expected value of one roll of a fair ${f(faces, 0)}-sided die, in points?`
            : `Avant d'ouvrir la bouche : quelle est l'espérance d'un lancer d'un dé équilibré à ${f(faces, 0)} faces, en points ?`,
          reponse: eFace, tolerance: 0.005, unite: 'points',
          etapes: [{
            titre: en ? 'E = (f + 1)/2' : 'E = (f + 1)/2',
            contenu: en
              ? `(${f(faces, 0)} + 1)/2 = **${f(eFace, 1)}** — the anchor E[d6] = 3.5, E[d100] = 50.5. The candidate who quotes before computing this has already quoted at random, and no desk forgives a price pulled out of a hat. Silence, expectation, THEN the market.`
              : `(${f(faces, 0)} + 1)/2 = **${f(eFace, 1)}** — l'ancre E[d6] = 3,5, E[d100] = 50,5. Le candidat qui cote avant d'avoir calculé ceci a déjà coté au hasard, et aucun desk ne pardonne un prix sorti du chapeau. Silence, espérance, PUIS le marché.`,
          }],
          pieges: [en
            ? `Reading the “middle of the faces” 1-${f(faces, 0)} as ${f(faces / 2, 0)}: the true middle of the integers 1 to ${f(faces, 0)} is (${f(faces, 0)} + 1)/2 = ${f(eFace, 1)} — half a point of error that poisons the whole quote.`
            : `Lire le « milieu des faces » 1-${f(faces, 0)} comme ${f(faces / 2, 0)} : le vrai milieu des entiers de 1 à ${f(faces, 0)} est (${f(faces, 0)} + 1)/2 = ${f(eFace, 1)} — un demi-point d'erreur qui empoisonne toute la cotation.`],
        },
        {
          intitule: en ? 'b) The value of the flow' : 'b) La valeur du flux',
          enonce: en
            ? `At ${eur(mult, 0)} per point, what is the fair value of the flow you are about to quote, in €?`
            : `À ${eur(mult, 0)} par point, quelle est la valeur équitable du flux que vous vous apprêtez à coter, en € ?`,
          reponse: eJeu, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'Value = Σ pᵢ·gᵢ = multiplier × E' : 'Valeur = Σ pᵢ·gᵢ = multiplicateur × E',
            contenu: en
              ? `Each face pays ${eur(mult, 0)} per point with probability 1/${f(faces, 0)} : E = ${f(mult, 0)} × ${f(eFace, 1)} = **${eur(eJeu)}**. This is the mid of your future quote — the value around which bid and ask organise themselves. It is not yet a price: a mid is an opinion, a quote is a commitment.`
              : `Chaque face paie ${eur(mult, 0)} par point avec probabilité 1/${f(faces, 0)} : E = ${f(mult, 0)} × ${f(eFace, 1)} = **${eur(eJeu)}**. C'est le mid de votre future cotation — la valeur autour de laquelle bid et ask s'organisent. Ce n'est pas encore un prix : un mid est une opinion, une cotation est un engagement.`,
          }],
          pieges: [en
            ? `Confusing the value of the FLOW (${eur(eJeu)}) with the expected face (${f(eFace, 1)} points): the jury asked for euros — forgetting the multiplier is the classic slip when the pressure rises.`
            : `Confondre la valeur du FLUX (${eur(eJeu)}) avec la face espérée (${f(eFace, 1)} points) : le jury demande des euros — oublier le multiplicateur est la glissade classique quand la pression monte.`],
        },
        {
          intitule: en ? 'c) The quote: your ask' : 'c) La cotation : votre ask',
          enonce: en
            ? `You show a symmetric two-way price of half-width ±${eur(demi)} around the value. What is your ask, in €?`
            : `Vous affichez une fourchette symétrique de demi-largeur ±${eur(demi)} autour de la valeur. Quel est votre ask, en € ?`,
          reponse: ask, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'Bid below, ask above, same distance' : 'Le bid dessous, l’ask dessus, même distance',
            contenu: en
              ? `Quote: **${f(bid)} / ${f(ask)}** — bid = ${f(eJeu)} − ${f(demi)}, ask = ${f(eJeu)} + ${f(demi)} = **${eur(ask)}**. Symmetric, because you have no directional view on a fair die; of defensible width, because the spread is your pay for carrying the risk of one roll (standard deviation ≈ 1.71 points on a d6 — your margin is small against that noise, and only becomes income repeated). A decentred quote tells the jury you have an opinion; an enormous one tells them you refuse to quote.`
              : `Cotation : **${f(bid)} / ${f(ask)}** — bid = ${f(eJeu)} − ${f(demi)}, ask = ${f(eJeu)} + ${f(demi)} = **${eur(ask)}**. Symétrique, parce que vous n'avez aucune vue directionnelle sur un dé équilibré ; de largeur défendable, parce que la fourchette est votre rémunération pour porter le risque d'un lancer (écart-type ≈ 1,71 point sur un d6 — votre marge est petite face à ce bruit, et ne devient un revenu que répétée). Une cote décentrée dit au jury que vous avez un avis ; une cote énorme, que vous refusez de coter.`,
          }],
          pieges: [en
            ? `Quoting “I buy at ${f(mult, 0)}, I sell at ${f(mult * faces, 0)}” (the extreme payoffs): nobody will ever trade — it is a refusal to quote dressed up as prudence, and the jury will say so.`
            : `Coter « j'achète à ${f(mult, 0)}, je vends à ${f(mult * faces, 0)} » (les gains extrêmes) : personne ne traitera jamais — c'est un refus de coter déguisé en prudence, et le jury le dira.`],
        },
        {
          intitule: en ? 'd) “I lift your ask”: the expected edge' : 'd) « Je vous lève l’ask » : l’edge attendu',
          enonce: en
            ? `The jury lifts your ask at ${eur(ask)}: you sell the flow. What is your EXPECTED P&L on this trade, in €?`
            : `Le jury lève votre ask à ${eur(ask)} : vous vendez le flux. Quelle est votre espérance de P&L sur ce trade, en € ?`,
          reponse: edgeAsk, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'Edge = ask − value' : 'Edge = ask − valeur',
            contenu: en
              ? `You receive ${f(ask)} for a flow worth ${f(eJeu)}: expected P&L = **${eur(edgeAsk)}** — exactly your half-spread. That is the market maker's whole business model (module 1: the market maker lives off the spread), and the sentence to say out loud: “I earn the half-width in expectation, per trade, whichever side gets hit.”`
              : `Vous encaissez ${f(ask)} pour un flux qui vaut ${f(eJeu)} : espérance de P&L = **${eur(edgeAsk)}** — exactement votre demi-fourchette. C'est tout le modèle économique du teneur de marché (module 1 : le market maker vit de la fourchette), et la phrase à dire à voix haute : « je gagne la demi-largeur en espérance, par trade, quel que soit le côté traité. »`,
          }],
          pieges: [en
            ? `Announcing the FULL spread ${f(r2(2 * demi))} as your gain: the client crossed only ONE half — you sold at value + ${f(demi)}, not at bid + spread.`
            : `Annoncer la fourchette ENTIÈRE ${f(r2(2 * demi))} comme gain : le client n'a traversé qu'UNE demi-largeur — vous avez vendu à valeur + ${f(demi)}, pas à bid + fourchette.`],
        },
        {
          intitule: en ? 'e) The roll: the realised P&L' : 'e) Le lancer : le P&L réalisé',
          enonce: en
            ? `The die is rolled and shows ${f(faceTiree, 0)}. You pay ${f(mult, 0)} × ${f(faceTiree, 0)} to the buyer. What is your REALISED P&L on the trade, in € (signed)?`
            : `Le dé est lancé et affiche ${f(faceTiree, 0)}. Vous payez ${f(mult, 0)} × ${f(faceTiree, 0)} à l'acheteur. Quel est votre P&L RÉALISÉ sur le trade, en € (signé) ?`,
          reponse: pnl, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'Realised = ask − multiplier × face' : 'Réalisé = ask − multiplicateur × face',
            contenu: en
              ? `${f(ask)} − ${f(mult, 0)} × ${f(faceTiree, 0)} = **${eur(pnl)}**. ${pnl >= 0 ? 'A gain this time' : 'A loss this time'} — and the point the jury is fishing for: one roll proves NOTHING. The edge of d) is an expectation; the realisation is noise. A market maker is a law of large numbers: small margin, repeated, sized so that no single roll takes him out of the game.`
              : `${f(ask)} − ${f(mult, 0)} × ${f(faceTiree, 0)} = **${eur(pnl)}**. ${pnl >= 0 ? 'Un gain cette fois' : 'Une perte cette fois'} — et le point que le jury pêche : un lancer ne prouve RIEN. L'edge du d) est une espérance ; la réalisation est du bruit. Un teneur de marché est une loi des grands nombres : une marge petite, répétée, dimensionnée pour qu'aucun lancer ne le sorte du jeu.`,
          }],
          pieges: [en
            ? `${pnl < 0 ? 'Concluding from this loss that the quote was wrong' : 'Concluding from this gain that the quote was right'}: judging a decision by one outcome is the anecdote-thinking the whole chapter trains out of you — the quote is judged on the expectation, the sizing on the worst case.`
            : `${pnl < 0 ? 'Conclure de cette perte que la cote était mauvaise' : 'Conclure de ce gain que la cote était bonne'} : juger une décision sur un dénouement est la pensée-anecdote que tout le chapitre dresse à éliminer — la cote se juge à l'espérance, la taille au pire cas.`],
        },
        {
          intitule: en ? 'f) Lifted twice: the requote' : 'f) Levé deux fois : la requote',
          enonce: en
            ? `The jury lifts your ask again, immediately. You shift your mid UP by ${eur(decalage)} and keep the same half-width. What is your new ask, in €?`
            : `Le jury lève encore votre ask, immédiatement. Vous décalez votre mid de +${eur(decalage)} et gardez la même demi-largeur. Quel est votre nouvel ask, en € ?`,
          reponse: askRequote, tolerance: 0.005, unite: '€',
          etapes: [
            {
              titre: en ? 'New quote = (value + shift) ± half-width' : 'Nouvelle cote = (valeur + décalage) ± demi-largeur',
              contenu: en
                ? `New mid ${f(eJeu)} + ${f(decalage)} = ${f(r2(eJeu + decalage))}, new quote **${f(bidRequote)} / ${f(askRequote)}** — the ask moves to **${eur(askRequote)}**. Why move? Because the flow is information: someone who lifts you twice may simply like the game — or may know something (a loaded die?). This is adverse selection in germ (module 1): the counterparty who insists is possibly better informed.`
                : `Nouveau mid ${f(eJeu)} + ${f(decalage)} = ${f(r2(eJeu + decalage))}, nouvelle cote **${f(bidRequote)} / ${f(askRequote)}** — l'ask passe à **${eur(askRequote)}**. Pourquoi bouger ? Parce que le flux est une information : celui qui vous lève deux fois aime peut-être le jeu — ou sait peut-être quelque chose (un dé pipé ?). C'est la sélection adverse en germe (module 1) : la contrepartie qui insiste est peut-être mieux informée.`,
            },
            {
              titre: en ? 'The oral takeaway' : 'La phrase pour l’oral',
              contenu: en
                ? `The jury tests your second price more than your first. “I quote symmetric around the expectation, I earn the half-width in expectation, and if the same side trades me twice, I move — the flow talks, and I listen” is the answer that sounds like a desk.`
                : `Le jury teste votre deuxième prix plus que votre premier. « Je cote symétrique autour de l'espérance, je gagne la demi-largeur en espérance, et si le même côté me traite deux fois, je bouge — le flux parle, et je l'écoute » est la réponse qui sonne desk.`,
            },
          ],
          pieges: [en
            ? `Staying nailed at ${f(bid)} / ${f(ask)} while the ask gets lifted in a loop: ignoring the information in the flow is how a market maker gets eaten — the mistake chapter 5 lists among the four that sink an interview.`
            : `Rester cloué à ${f(bid)} / ${f(ask)} pendant que l'ask se fait lever en boucle : ignorer l'information du flux est la façon dont un teneur de marché se fait manger — l'erreur que le chapitre 5 classe parmi les quatre qui coulent un entretien.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 12. m13-pb-12 — La cascade de Bayes — N3                            */
/* ------------------------------------------------------------------ */
const cascadeDeBayes: ProblemeMoule = {
  id: 'm13-pb-12', moduleId: M13,
  titre: 'La cascade de Bayes : deux tests, l’a posteriori qui devient a priori',
  titreEn: 'The Bayes cascade: two tests, the posterior that becomes the prior',
  typeDeCas: 'probabilités d’entretien',
  typeDeCasEn: 'interview probabilities',
  difficulte: 3,
  scenarios: ['Le dépistage à deux étages : le test de confirmation', 'Le signal de trading confirmé par un second indicateur', 'La fraude rare : deux filtres de conformité en série'],
  scenariosEn: ['Two-stage screening: the confirmation test', 'The trading signal confirmed by a second indicator', 'Rare fraud: two compliance filters in series'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : prévalence (%), sensibilité/faux positifs des deux tests (%).
    const cfg = ([
      { pMin: 0.5, pMax: 2, s1Min: 90, s1Max: 98, f1Min: 4, f1Max: 8, s2Min: 90, s2Max: 98, f2Min: 2, f2Max: 5 },
      { pMin: 1, pMax: 3, s1Min: 85, s1Max: 95, f1Min: 6, f1Max: 10, s2Min: 88, s2Max: 96, f2Min: 3, f2Max: 6 },
      { pMin: 0.2, pMax: 1, s1Min: 92, s1Max: 99, f1Min: 3, f1Max: 6, s2Min: 90, s2Max: 97, f2Min: 2, f2Max: 4 },
    ] as const)[sIdx];
    const prev = randFloat(rng, cfg.pMin, cfg.pMax, 1);
    const sens1 = randInt(rng, cfg.s1Min, cfg.s1Max);
    const fp1 = randInt(rng, cfg.f1Min, cfg.f1Max);
    const sens2 = randInt(rng, cfg.s2Min, cfg.s2Max);
    const fp2 = randInt(rng, cfg.f2Min, cfg.f2Max);

    const vraisPositifs = r2(10000 * (prev / 100) * (sens1 / 100));
    const fauxPositifs = r2(10000 * (1 - prev / 100) * (fp1 / 100));
    const post1 = r2(bayesAPosterioriPct(prev, sens1, fp1));
    const post2 = r2(bayesAPosterioriPct(post1, sens2, fp2));
    const facteur = r2(post2 / prev);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `base rate ${pct(prev, 1)}; first test: sensitivity ${pct(sens1, 0)}, false-positive rate ${pct(fp1, 0)}; second, independent test: sensitivity ${pct(sens2, 0)}, false-positive rate ${pct(fp2, 0)}`
      : `prévalence ${pct(prev, 1)} ; premier test : sensibilité ${pct(sens1, 0)}, taux de faux positifs ${pct(fp1, 0)} ; second test, indépendant : sensibilité ${pct(sens2, 0)}, taux de faux positifs ${pct(fp2, 0)}`;
    const contexte = (en
      ? [
        `The jury member smiles — he knows you saw the screening classic coming — and adds a floor to it: “the patient tests positive TWICE, on two independent tests. Now what?” The data: ${desc}. The 10,000-people method still works; the trick is what becomes of the prevalence between the two floors.`,
        `Morning meeting. A quant strategy flags a stock, and a second, independent indicator flags it too. Your desk head asks the only question that matters: “knowing both signals fired, what is the probability the opportunity is real?” The numbers: ${desc} — where the “base rate” is the fraction of flagged opportunities that are genuinely there.`,
        `Compliance interview. Transactions are screened by two filters in series; genuine fraud is rare. The examiner: “a transaction trips both alarms — how sure are we?” The file: ${desc}. Rare events are exactly where false positives drown true ones, and where the second filter earns its keep.`,
      ]
      : [
        `Le membre du jury sourit — il sait que vous avez vu venir le classique du dépistage — et lui ajoute un étage : « le patient est positif DEUX fois, sur deux tests indépendants. Et maintenant ? » Les données : ${desc}. La méthode des 10 000 fonctionne toujours ; le tour de main est ce que devient la prévalence entre les deux étages.`,
        `Morning meeting. Une stratégie quantitative signale un titre, et un second indicateur, indépendant, le signale aussi. Votre chef de desk pose la seule question qui compte : « sachant les deux signaux, quelle probabilité que l'opportunité soit réelle ? » Les chiffres : ${desc} — où la « prévalence » est la fraction des opportunités signalées qui existent vraiment.`,
        `Entretien conformité. Les transactions passent deux filtres en série ; la vraie fraude est rare. L'examinateur : « une transaction déclenche les deux alarmes — quelle certitude a-t-on ? » Le dossier : ${desc}. Les événements rares sont exactement là où les faux positifs noient les vrais, et là où le second filtre gagne sa place.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The 10,000 method: the true positives' : 'a) La méthode des 10 000 : les vrais positifs',
          enonce: en
            ? `Out of 10,000 cases with a base rate of ${pct(prev, 1)}, how many REAL positives does the first test detect (sensitivity ${pct(sens1, 0)})?`
            : `Sur 10 000 cas avec une prévalence de ${pct(prev, 1)}, combien de VRAIS positifs le premier test détecte-t-il (sensibilité ${pct(sens1, 0)}) ?`,
          reponse: vraisPositifs, tolerance: 0.02, unite: en ? 'out of 10,000' : 'sur 10 000',
          etapes: [{
            titre: en ? 'Population first, percentages second' : 'La population d’abord, les pourcentages ensuite',
            contenu: en
              ? `10,000 × ${f(prev, 1)}% = ${f(r2(10000 * prev / 100))} real cases; the test catches ${f(sens1, 0)}% of them: **${f(vraisPositifs)}**. The oral method from chapter 3: never juggle three percentages in your head — put 10,000 people on the table and count them. The jury hears the method before it hears the number.`
              : `10 000 × ${f(prev, 1)} % = ${f(r2(10000 * prev / 100))} cas réels ; le test en attrape ${f(sens1, 0)} % : **${f(vraisPositifs)}**. La méthode d'oral du chapitre 3 : ne jamais jongler avec trois pourcentages de tête — poser 10 000 personnes sur la table et les compter. Le jury entend la méthode avant d'entendre le nombre.`,
          }],
          pieges: [en
            ? `Answering “the test is ${pct(sens1, 0)} reliable, so the probability is ${pct(sens1, 0)}”: the sensitivity says nothing yet — it has not met the base rate. That confusion is precisely what the question is built to catch.`
            : `Répondre « le test est fiable à ${pct(sens1, 0)}, donc la probabilité est ${pct(sens1, 0)} » : la sensibilité ne dit encore rien — elle n'a pas rencontré la prévalence. Cette confusion est précisément ce que la question est construite pour attraper.`],
        },
        {
          intitule: en ? 'b) The noise: the false positives' : 'b) Le bruit : les faux positifs',
          enonce: en
            ? `Out of the same 10,000, how many FALSE positives does the first test produce (false-positive rate ${pct(fp1, 0)} on the healthy)?`
            : `Sur les mêmes 10 000, combien de FAUX positifs le premier test produit-il (taux de faux positifs ${pct(fp1, 0)} sur les sains) ?`,
          reponse: fauxPositifs, tolerance: 0.02, unite: en ? 'out of 10,000' : 'sur 10 000',
          etapes: [{
            titre: en ? 'The big crowd times the small rate' : 'La grande foule fois le petit taux',
            contenu: en
              ? `(10,000 − ${f(r2(10000 * prev / 100))}) × ${f(fp1, 0)}% = **${f(fauxPositifs)}** false alarms — ${fauxPositifs > vraisPositifs ? 'MORE than the true positives' : 'of the same order as the true positives'}. A small error rate applied to a huge healthy crowd beats a big detection rate applied to a tiny sick one: that is the entire mechanics of the classic, and of every rare-event detector (m10, m11: the crisis indicator that mostly cries wolf).`
              : `(10 000 − ${f(r2(10000 * prev / 100))}) × ${f(fp1, 0)} % = **${f(fauxPositifs)}** fausses alertes — ${fauxPositifs > vraisPositifs ? 'PLUS que les vrais positifs' : 'du même ordre que les vrais positifs'}. Un petit taux d'erreur appliqué à une immense foule saine bat un grand taux de détection appliqué à une minuscule foule malade : c'est toute la mécanique du classique, et de tout détecteur d'événement rare (m10, m11 : l'indicateur de crise qui crie surtout au loup).`,
          }],
          pieges: [en
            ? `Applying ${pct(fp1, 0)} to the whole 10,000 instead of the ${f(r2(10000 - 10000 * prev / 100))} negatives: the false-positive rate is defined ON THE HEALTHY — a small slip that shifts the final answer visibly.`
            : `Appliquer ${pct(fp1, 0)} aux 10 000 entiers au lieu des ${f(r2(10000 - 10000 * prev / 100))} sains : le taux de faux positifs est défini SUR LES SAINS — une petite glissade qui décale visiblement la réponse finale.`],
        },
        {
          intitule: en ? 'c) First floor: the posterior' : 'c) Premier étage : l’a posteriori',
          enonce: en
            ? `Given ONE positive on the first test, what is the probability the case is real, in %?`
            : `Sachant UN positif au premier test, quelle est la probabilité que le cas soit réel, en % ?`,
          reponse: post1, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'True / (true + false)' : 'Vrais / (vrais + faux)',
            contenu: en
              ? `${f(vraisPositifs)} / (${f(vraisPositifs)} + ${f(fauxPositifs)}) = **${pct(post1)}**. That is Bayes without writing Bayes — the whole formula hides in the fraction of positives that are real. The chapter's anchor: 1% prevalence, 99% sensitivity, 5% false positives ⇒ 1/6 only. A positive test on a rare condition mostly measures the false-alarm machine.`
              : `${f(vraisPositifs)} / (${f(vraisPositifs)} + ${f(fauxPositifs)}) = **${pct(post1)}**. C'est Bayes sans écrire Bayes — toute la formule se cache dans la fraction des positifs qui sont réels. L'ancre du chapitre : prévalence 1 %, sensibilité 99 %, faux positifs 5 % ⇒ 1/6 seulement. Un test positif sur une condition rare mesure surtout la machine à fausses alertes.`,
          }],
          pieges: [en
            ? `Confusing P(positive | real) = ${pct(sens1, 0)} with P(real | positive) = ${pct(post1)}: the two conditionals point in opposite directions, and inverting them is THE interview trap of chapter 3.`
            : `Confondre P(positif | réel) = ${pct(sens1, 0)} avec P(réel | positif) = ${pct(post1)} : les deux conditionnelles pointent en sens inverses, et les intervertir est LE piège d'entretien du chapitre 3.`],
        },
        {
          intitule: en ? 'd) Second floor: the cascade' : 'd) Second étage : la cascade',
          enonce: en
            ? `The SECOND, independent test also comes back positive (sensitivity ${pct(sens2, 0)}, false positives ${pct(fp2, 0)}). Using your answer to c) as the new base rate, what is the probability the case is real, in %?`
            : `Le SECOND test, indépendant, revient positif lui aussi (sensibilité ${pct(sens2, 0)}, faux positifs ${pct(fp2, 0)}). En prenant votre réponse du c) comme nouvelle prévalence, quelle est la probabilité que le cas soit réel, en % ?`,
          reponse: post2, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'The posterior becomes the prior' : 'L’a posteriori devient l’a priori',
            contenu: en
              ? `Same machine, new input: prevalence ${pct(post1)}, hence ${f(post1)} × ${f(sens2, 0)} / (${f(post1)} × ${f(sens2, 0)} + ${f(r2(100 - post1))} × ${f(fp2, 0)}) = **${pct(post2)}**. This is the whole point of the cascade: Bayes is an UPDATE, and updates chain — yesterday's posterior is today's prior. One positive left you at ${pct(post1)}; two independent positives lift you to ${pct(post2)}, because the second test starts from a population already filtered by the first.`
              : `Même machine, nouvelle entrée : prévalence ${pct(post1)}, d'où ${f(post1)} × ${f(sens2, 0)} / (${f(post1)} × ${f(sens2, 0)} + ${f(r2(100 - post1))} × ${f(fp2, 0)}) = **${pct(post2)}**. C'est tout l'intérêt de la cascade : Bayes est une MISE À JOUR, et les mises à jour se chaînent — l'a posteriori d'hier est l'a priori d'aujourd'hui. Un positif vous laissait à ${pct(post1)} ; deux positifs indépendants vous hissent à ${pct(post2)}, parce que le second test part d'une population déjà filtrée par le premier.`,
          }],
          pieges: [en
            ? `Re-using the ORIGINAL ${pct(prev, 1)} prevalence for the second test: that throws away everything the first positive taught you — the single most common error on the two-stage version.`
            : `Réutiliser la prévalence INITIALE de ${pct(prev, 1)} pour le second test : c'est jeter tout ce que le premier positif vous a appris — l'erreur la plus fréquente sur la version à deux étages.`],
        },
        {
          intitule: en ? 'e) The verdict: the multiplication of belief' : 'e) Le verdict : la multiplication de la croyance',
          enonce: en
            ? `By what factor have the two positives multiplied the initial probability (answer of d) over the ${pct(prev, 1)} base rate)?`
            : `Par quel facteur les deux positifs ont-ils multiplié la probabilité initiale (réponse du d) rapportée à la prévalence de ${pct(prev, 1)}) ?`,
          reponse: facteur, tolerance: 0.02, unite: '×',
          etapes: [
            {
              titre: en ? 'Factor = posterior / prior' : 'Facteur = a posteriori / a priori',
              contenu: en
                ? `${f(post2)} / ${f(prev, 1)} = **${f(facteur)}×**. From ${pct(prev, 1)} to ${pct(post2)}: evidence multiplies belief, it does not add to it. And note what did NOT happen: even two positives leave you ${post2 < 99 ? `at ${pct(post2)}, not at certainty` : 'just short of certainty'} — the false-alarm machine never fully switches off.`
                : `${f(post2)} / ${f(prev, 1)} = **${f(facteur)}×**. De ${pct(prev, 1)} à ${pct(post2)} : l'évidence multiplie la croyance, elle ne s'y additionne pas. Et notez ce qui ne s'est PAS produit : même deux positifs vous laissent ${post2 < 99 ? `à ${pct(post2)}, pas à la certitude` : 'juste sous la certitude'} — la machine à fausses alertes ne s'éteint jamais tout à fait.`,
            },
            {
              titre: en ? 'The oral takeaway' : 'La phrase pour l’oral',
              contenu: en
                ? `“The strength of a signal depends on the rarity of what it looks for — and independent signals chain: each posterior is the next prior.” Two sentences, both from chapter 3, and the jury hears you own the tool rather than the anecdote.`
                : `« La force d'un signal dépend de la rareté de ce qu'il cherche — et les signaux indépendants se chaînent : chaque a posteriori est l'a priori suivant. » Deux phrases, toutes deux du chapitre 3, et le jury entend que vous possédez l'outil et pas seulement l'anecdote.`,
            },
          ],
          pieges: [en
            ? `Presenting the gain additively (“${f(r2(post2 - prev))} points more”): belief updates are multiplicative — the factor ${f(facteur)}× is the number that carries the meaning, exactly like the implied-PD ratio of a spread widening (m5).`
            : `Présenter le gain additivement (« ${f(r2(post2 - prev))} points de plus ») : les mises à jour de croyance sont multiplicatives — le facteur ${f(facteur)}× est le nombre qui porte le sens, exactement comme le rapport des PD implicites d'un écartement de spread (m5).`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 13. m13-pb-13 — Le tournoi de paris — N3                            */
/* ------------------------------------------------------------------ */
const tournoiDeParis: ProblemeMoule = {
  id: 'm13-pb-13', moduleId: M13,
  titre: 'Le tournoi de paris : la marge du bookmaker et le seul edge de la table',
  titreEn: 'The betting tournament: the bookmaker’s margin and the only edge on the table',
  typeDeCas: 'cotes et paris',
  typeDeCasEn: 'odds and bets',
  difficulte: 3,
  scenarios: ['Le derby à trois issues : victoire, nul, défaite', 'Le bookmaker du desk : trois candidats pour une promotion', 'La finale à trois : le jury affiche son tableau de cotes'],
  scenariosEn: ['The three-way derby: win, draw, loss', 'The desk bookmaker: three candidates for one promotion', 'The three-horse final: the jury pins up its odds board'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Tirages : trois probabilités réelles (somme 100), facteurs de cote —
    // l'issue la moins probable porte le seul edge positif (facteur > 1),
    // les deux autres sont cotées sous le juste (facteur ≤ 0,92) : la somme
    // des probabilités implicites dépasse alors mécaniquement 100 %.
    const p1 = randInt(rng, 20, 40);
    const p2 = randInt(rng, Math.max(20, 55 - p1), Math.min(45, 80 - p1));
    const p3 = 100 - p1 - p2;
    const probas = [p1, p2, p3];
    const fGenereux = randFloat(rng, 1.06, 1.15, 2);
    const fMaison1 = randFloat(rng, 0.8, 0.92, 2);
    const fMaison2 = randFloat(rng, 0.8, 0.92, 2);
    const mise = randInt(rng, 2, 10) * 10;
    // L'issue à edge positif : la plus petite probabilité (≤ 33 par construction).
    let edgeIdx = 0;
    if (probas[1] < probas[edgeIdx]) edgeIdx = 1;
    if (probas[2] < probas[edgeIdx]) edgeIdx = 2;
    const facteurs = [fMaison1, fMaison2];
    const cotes = probas.map((p, i) => r2(coteEquitable(p) * (i === edgeIdx ? fGenereux : facteurs[i < edgeIdx ? i : i - 1])));
    const implicites = cotes.map((c) => r2(100 / c));
    const sommeImpl = r2(implicites[0] + implicites[1] + implicites[2]);
    const marge = r2(sommeImpl - 100);
    const coteEqEdge = r2(coteEquitable(probas[edgeIdx]));
    const edge = r2((probas[edgeIdx] * cotes[edgeIdx]) / 100 - 1);
    const espMise = r2(mise * edge);

    const { en, f, pct, eur } = outils(langue);
    const nomsIssues = en
      ? [['home win', 'draw', 'away win'], ['candidate A', 'candidate B', 'candidate C'], ['horse 1', 'horse 2', 'horse 3']][sIdx]
      : [['victoire', 'nul', 'défaite'], ['candidat A', 'candidat B', 'candidat C'], ['cheval 1', 'cheval 2', 'cheval 3']][sIdx];
    const tableau = nomsIssues.map((n, i) => en
      ? `${n}: real probability ${f(probas[i], 0)}%, odds offered ${f(cotes[i])} for 1`
      : `${n} : probabilité réelle ${f(probas[i], 0)} %, cote proposée ${f(cotes[i])} pour 1`).join(en ? '; ' : ' ; ');
    const contexte = (en
      ? [
        `The jury member pins three lines on the table: “a match, three outcomes, and my odds board. One of these three bets is good. Find it — and tell me what I charge for the other two.” The board: ${tableau}. The probabilities are agreed by both sides; the odds are his. Chapter 5's inversion gymnastics, three times over.`,
        `Your desk runs its yearly game: three candidates for one promotion, and the desk bookmaker — a senior trader with a spreadsheet — posts his odds. The board: ${tableau}. Before putting a single euro down, do what he hopes nobody does: invert every price, sum what you find, and locate the one line where he was too generous.`,
        `Final round. The interviewer slides a printed odds board across: ${tableau}. “I am the house. Where is my margin, and where did I make a mistake?” Two questions, one method: the implied probability of a price is 1 over the price.`,
      ]
      : [
        `Le membre du jury épingle trois lignes sur la table : « un match, trois issues, et mon tableau de cotes. Un de ces trois paris est bon. Trouvez-le — et dites-moi ce que je fais payer sur les deux autres. » Le tableau : ${tableau}. Les probabilités sont admises par les deux camps ; les cotes sont les siennes. La gymnastique d'inversion du chapitre 5, trois fois de suite.`,
        `Votre desk joue son jeu annuel : trois candidats pour une promotion, et le bookmaker du desk — un trader senior armé d'un tableur — affiche ses cotes. Le tableau : ${tableau}. Avant de poser un euro, faites ce qu'il espère que personne ne fera : inverser chaque prix, sommer ce que vous trouvez, et localiser la seule ligne où il a été trop généreux.`,
        `Dernier tour. L'interviewer fait glisser un tableau de cotes imprimé : ${tableau}. « Je suis la maison. Où est ma marge, et où me suis-je trompé ? » Deux questions, une méthode : la probabilité implicite d'un prix est 1 sur le prix.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The first inversion' : 'a) La première inversion',
          enonce: en
            ? `What win probability do the odds of ${f(cotes[0])} for 1 on “${nomsIssues[0]}” actually price, in %?`
            : `Quelle probabilité de gain la cote de ${f(cotes[0])} pour 1 sur « ${nomsIssues[0]} » price-t-elle réellement, en % ?`,
          reponse: implicites[0], tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'Implied probability = 100/odds' : 'Probabilité implicite = 100/cote',
            contenu: en
              ? `100 / ${f(cotes[0])} = **${pct(implicites[0])}**, against ${pct(probas[0], 0)} of real probability. THE PRICE CONTAINS THE PROBABILITY — invert it. Same gymnastics as the implied PD of a credit spread (m5): every quoted price is a probability wearing a costume.`
              : `100 / ${f(cotes[0])} = **${pct(implicites[0])}**, contre ${pct(probas[0], 0)} de probabilité réelle. LE PRIX CONTIENT LA PROBABILITÉ — il suffit de l'inverser. Même gymnastique que la PD implicite d'un spread de crédit (m5) : tout prix coté est une probabilité déguisée.`,
          }],
          pieges: [en
            ? `Inverting on the NET gain, 100/(${f(cotes[0])} − 1) = ${pct(r2(100 / (cotes[0] - 1)))}: the course convention is “for 1”, stake included — announce your convention before computing, then hold it.`
            : `Inverser sur le gain NET, 100/(${f(cotes[0])} − 1) = ${pct(r2(100 / (cotes[0] - 1)))} : la convention du cours est « pour 1 », mise comprise — annoncez votre convention avant de calculer, puis tenez-la.`],
        },
        {
          intitule: en ? 'b) The sum that betrays the house' : 'b) La somme qui trahit la maison',
          enonce: en
            ? `Invert the other two odds the same way. What is the SUM of the three implied probabilities, in %?`
            : `Inversez de même les deux autres cotes. Quelle est la SOMME des trois probabilités implicites, en % ?`,
          reponse: sommeImpl, tolerance: 0.02, unite: '%',
          etapes: [{
            titre: en ? 'Three inversions, one addition' : 'Trois inversions, une addition',
            contenu: en
              ? `100/${f(cotes[1])} = ${pct(implicites[1])} and 100/${f(cotes[2])} = ${pct(implicites[2])}, hence ${f(implicites[0])} + ${f(implicites[1])} + ${f(implicites[2])} = **${pct(sommeImpl)}**. Real probabilities sum to exactly 100%; PRICED probabilities sum to more. The excess is not an arithmetic accident — it is the house's business model, spread across the three lines.`
              : `100/${f(cotes[1])} = ${pct(implicites[1])} et 100/${f(cotes[2])} = ${pct(implicites[2])}, d'où ${f(implicites[0])} + ${f(implicites[1])} + ${f(implicites[2])} = **${pct(sommeImpl)}**. Les probabilités réelles somment à exactement 100 % ; les probabilités PRICÉES somment à plus. L'excédent n'est pas un accident d'arithmétique — c'est le modèle économique de la maison, étalé sur les trois lignes.`,
          }],
          pieges: [en
            ? `Expecting 100% and “correcting” your inversions to get there: the sum ABOVE 100% is the finding, not the error — a book that summed to 100% would be a charity.`
            : `Attendre 100 % et « corriger » ses inversions pour y arriver : la somme AU-DESSUS de 100 % est le résultat, pas l'erreur — un book qui sommerait à 100 % serait une œuvre de charité.`],
        },
        {
          intitule: en ? 'c) The margin, named' : 'c) La marge, nommée',
          enonce: en
            ? `What is the bookmaker's margin (the overround): the sum of b) minus 100, in points of %?`
            : `Quelle est la marge du bookmaker (l'overround) : la somme du b) moins 100, en points de % ?`,
          reponse: marge, tolerance: 0.02, toleranceMode: 'absolu', unite: en ? 'points' : 'points',
          etapes: [{
            titre: en ? 'Margin = Σ implied − 100' : 'Marge = Σ implicites − 100',
            contenu: en
              ? `${f(sommeImpl)} − 100 = **${f(marge)} points**. Whoever bets the three outcomes in proportion to the implied probabilities loses the margin with certainty: the house has built itself a risk-free spread, exactly like a market maker whose bid and ask bracket the value. The desk sentence: “the overround is the bid-ask of the betting world.”`
              : `${f(sommeImpl)} − 100 = **${f(marge)} points**. Qui parie les trois issues au prorata des probabilités implicites perd la marge avec certitude : la maison s'est construit une fourchette sans risque, exactement comme un teneur de marché dont le bid et l'ask encadrent la valeur. La phrase de desk : « l'overround est le bid-ask du monde des paris. »`,
          }],
          pieges: [en
            ? `Reading the margin as “the house wins ${pct(marge)} of the time”: it is not a frequency but a TAKE — the fraction of balanced stakes the house keeps whatever the outcome.`
            : `Lire la marge comme « la maison gagne ${pct(marge)} du temps » : ce n'est pas une fréquence mais un PRÉLÈVEMENT — la fraction des mises équilibrées que la maison garde quelle que soit l'issue.`],
        },
        {
          intitule: en ? 'd) The fair benchmark of the suspect line' : 'd) L’étalon de la ligne suspecte',
          enonce: en
            ? `“${nomsIssues[edgeIdx]}” wins with real probability ${pct(probas[edgeIdx], 0)}. What are its FAIR odds, for 1?`
            : `« ${nomsIssues[edgeIdx]} » gagne avec une probabilité réelle de ${pct(probas[edgeIdx], 0)}. Quelle est sa cote ÉQUITABLE, pour 1 ?`,
          reponse: coteEqEdge, tolerance: 0.005, unite: en ? 'for 1' : 'pour 1',
          etapes: [{
            titre: en ? 'Fair odds = 100/p' : 'Cote équitable = 100/p',
            contenu: en
              ? `100 / ${f(probas[edgeIdx], 0)} = **${f(coteEqEdge)} for 1** — zero expectation at that price. The offered ${f(cotes[edgeIdx])} sits ABOVE the fair level: on this line, and this line only, the house pays more than the event deserves. On the other two, the offered odds sit below their fair values (${f(r2(coteEquitable(probas[(edgeIdx + 1) % 3])))} and ${f(r2(coteEquitable(probas[(edgeIdx + 2) % 3])))}) — the margin lives there.`
              : `100 / ${f(probas[edgeIdx], 0)} = **${f(coteEqEdge)} pour 1** — espérance nulle à ce prix. La cote proposée de ${f(cotes[edgeIdx])} est AU-DESSUS du juste : sur cette ligne, et cette ligne seule, la maison paie plus que ce que l'événement mérite. Sur les deux autres, les cotes proposées sont sous leurs justes valeurs (${f(r2(coteEquitable(probas[(edgeIdx + 1) % 3])))} et ${f(r2(coteEquitable(probas[(edgeIdx + 2) % 3])))}) — la marge vit là.`,
          }],
          pieges: [en
            ? `Hunting the edge on the biggest odds: the size of the odds says how RARE the event is, not how well it is paid — the edge is the gap between offered and fair, line by line.`
            : `Chasser l'edge sur la plus grosse cote : la taille d'une cote dit la RARETÉ de l'événement, pas la qualité de son paiement — l'edge est l'écart entre proposé et juste, ligne par ligne.`],
        },
        {
          intitule: en ? 'e) The only positive edge' : 'e) Le seul edge positif',
          enonce: en
            ? `Per 1 € staked on “${nomsIssues[edgeIdx]}” at the offered ${f(cotes[edgeIdx])}, what is the expected profit, in €?`
            : `Pour 1 € misé sur « ${nomsIssues[edgeIdx]} » à la cote proposée de ${f(cotes[edgeIdx])}, quel est le gain attendu, en € ?`,
          reponse: edge, tolerance: 0.02, toleranceMode: 'absolu', unite: en ? '€ per € staked' : '€ par € misé',
          etapes: [{
            titre: en ? 'Edge = p × odds − 1' : 'Edge = p × cote − 1',
            contenu: en
              ? `${f(probas[edgeIdx], 0)}/100 × ${f(cotes[edgeIdx])} − 1 = **${eur(edge)}** per euro staked — positive, the only one of the three (the other two lines pay ${f(r2((probas[(edgeIdx + 1) % 3] * cotes[(edgeIdx + 1) % 3]) / 100 - 1))} and ${f(r2((probas[(edgeIdx + 2) % 3] * cotes[(edgeIdx + 2) % 3]) / 100 - 1))} per euro). A book can carry a fat global margin AND leak on one line: finding the leak is the whole job, in betting as in market making.`
              : `${f(probas[edgeIdx], 0)}/100 × ${f(cotes[edgeIdx])} − 1 = **${eur(edge)}** par euro misé — positif, le seul des trois (les deux autres lignes paient ${f(r2((probas[(edgeIdx + 1) % 3] * cotes[(edgeIdx + 1) % 3]) / 100 - 1))} et ${f(r2((probas[(edgeIdx + 2) % 3] * cotes[(edgeIdx + 2) % 3]) / 100 - 1))} par euro). Un book peut porter une grosse marge globale ET fuir sur une ligne : trouver la fuite est tout le métier, aux paris comme au market making.`,
          }],
          pieges: [en
            ? `Computing p × odds and forgetting the −1 (${f(r2((probas[edgeIdx] * cotes[edgeIdx]) / 100))} instead of ${f(edge)}): the expectation of the PAYOUT is not the expectation of the PROFIT — the stake is spent whatever happens.`
            : `Calculer p × cote et oublier le −1 (${f(r2((probas[edgeIdx] * cotes[edgeIdx]) / 100))} au lieu de ${f(edge)}) : l'espérance du VERSEMENT n'est pas l'espérance du GAIN — la mise est dépensée quoi qu'il arrive.`],
        },
        {
          intitule: en ? 'f) The stake, sized' : 'f) La mise, dimensionnée',
          enonce: en
            ? `You put ${eur(mise, 0)} on that line. What is your expected profit, in €?`
            : `Vous posez ${eur(mise, 0)} sur cette ligne. Quel est votre gain attendu, en € ?`,
          reponse: espMise, tolerance: 0.03, unite: '€',
          etapes: [
            {
              titre: en ? 'Expectation scales with the stake' : 'L’espérance suit la mise',
              contenu: en
                ? `${f(mise, 0)} × ${f(edge)} = **${eur(espMise)}**. An expectation, not a promise: on one bet, you ${en ? '' : ''}win ${eur(r2(mise * (cotes[edgeIdx] - 1)))} or lose ${eur(mise, 0)} — the edge only becomes income repeated, and sized small (chapter 5: never the whole bankroll, even on a positive edge; Kelly puts a number on “small”).`
                : `${f(mise, 0)} × ${f(edge)} = **${eur(espMise)}**. Une espérance, pas une promesse : sur un pari, vous gagnez ${eur(r2(mise * (cotes[edgeIdx] - 1)))} ou perdez ${eur(mise, 0)} — l'edge ne devient un revenu que répété, et misé petit (chapitre 5 : jamais tout le capital, même à edge positif ; Kelly chiffre le « petit »).`,
            },
            {
              titre: en ? 'The oral takeaway' : 'La phrase pour l’oral',
              contenu: en
                ? `Three beats for the jury: invert every price (1/odds), sum to expose the margin (${pct(sommeImpl)} > 100%), then compare line by line to find the single positive edge. Method first, number second — that order is what gets graded.`
                : `Trois temps pour le jury : inverser chaque prix (1/cote), sommer pour exposer la marge (${pct(sommeImpl)} > 100 %), puis comparer ligne à ligne pour trouver le seul edge positif. La méthode d'abord, le chiffre ensuite — cet ordre est ce qui est noté.`,
            },
          ],
          pieges: [en
            ? `Betting big because “the edge is proven”: the ${pct(probas[edgeIdx], 0)} probability means you lose this bet more often than you win it — the positive expectation pays the patient, not the brave.`
            : `Miser gros parce que « l'edge est prouvé » : la probabilité de ${pct(probas[edgeIdx], 0)} signifie que vous perdez ce pari plus souvent que vous ne le gagnez — l'espérance positive paie le patient, pas le brave.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 14. m13-pb-14 — Fermi sous contrainte — N3                          */
/* ------------------------------------------------------------------ */
const fermiSousContrainte: ProblemeMoule = {
  id: 'm13-pb-14', moduleId: M13,
  titre: 'Fermi sous contrainte : le jury conteste votre borne',
  titreEn: 'Fermi under fire: the jury challenges your bound',
  typeDeCas: 'estimation de Fermi',
  typeDeCasEn: 'Fermi estimation',
  difficulte: 3,
  scenarios: ['Les fenêtres de Paris : l’estimation que tout desk a posée un jour', 'Les litres d’essence vendus par jour en France', 'Les distributeurs de billets du pays'],
  scenariosEn: ['The windows of Paris: the estimate every desk has set one day', 'Litres of petrol sold per day in France', 'The country’s cash machines'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : exposant de la borne basse, écart d'ordres de grandeur.
    const cfg = ([
      { expB: 6 },
      { expB: 7 },
      { expB: 4 },
    ] as const)[sIdx];
    const mantisses = [1, 2, 5] as const;
    const mB = mantisses[randInt(rng, 0, 2)];
    const mH = mantisses[randInt(rng, 0, 2)];
    const span = randInt(rng, 2, 3);
    const k = randInt(rng, 4, 12); // le facteur dont le jury conteste la borne basse
    const borneBasse = mB * 10 ** cfg.expB;
    const borneHaute = mH * 10 ** (cfg.expB + span);
    const est1 = r2(estimationFermi(borneBasse, borneHaute));
    const moyArith = r2((borneBasse + borneHaute) / 2);
    const ratioArith = r2(moyArith / est1);
    const borneBasse2 = borneBasse * k;
    const est2 = r2(estimationFermi(borneBasse2, borneHaute));
    const facteurRevision = r2(est2 / est1);
    const largeur = r2(Math.log10(borneHaute / borneBasse2));

    const { en, f } = outils(langue);
    const unites = (en ? ['windows', 'litres/day', 'ATMs'] : ['fenêtres', 'litres/jour', 'distributeurs'])[sIdx];
    const desc = en
      ? `you defend the bracket “at least ${f(borneBasse, 0)}, at most ${f(borneHaute, 0)}” (${unites})`
      : `vous défendez l'encadrement « au moins ${f(borneBasse, 0)}, au plus ${f(borneHaute, 0)} » (${unites})`;
    const contexte = (en
      ? [
        `“How many windows in Paris?” The jury member does not want THE number — nobody has it — he wants your bracket and what you do with it. After two minutes of decomposition, ${desc}. Then he leans forward: “your LOWER bound is lazy — I say it is at least ${f(k, 0)} times higher.” The estimate must move, and you must know by how much before he does.`,
        `Energy desk interview. “Litres of petrol sold per day in France — bracket it.” You decompose (cars, kilometres, consumption) and ${desc}. The jury pushes back: “your lower bound forgets the trucks — multiply it by ${f(k, 0)}.” A Fermi estimate is a living object: it must absorb the objection, not collapse under it.`,
        `“How many cash machines in the country?” You build the bracket from branches and street corners: ${desc}. The jury: “too timid on the low side — at least ${f(k, 0)} times more.” What he is really testing: do you know how a GEOMETRIC estimate responds when one bound moves?`,
      ]
      : [
        `« Combien de fenêtres à Paris ? » Le membre du jury ne veut pas LE nombre — personne ne l'a — il veut votre encadrement et ce que vous en faites. Après deux minutes de décomposition, ${desc}. Puis il se penche : « votre borne BASSE est paresseuse — je dis qu'elle est au moins ${f(k, 0)} fois plus haute. » L'estimation doit bouger, et vous devez savoir de combien avant lui.`,
        `Entretien desk énergie. « Les litres d'essence vendus par jour en France — encadrez. » Vous décomposez (voitures, kilomètres, consommation) et ${desc}. Le jury conteste : « votre borne basse oublie les camions — multipliez-la par ${f(k, 0)}. » Une estimation de Fermi est un objet vivant : elle doit absorber l'objection, pas s'effondrer dessous.`,
        `« Combien de distributeurs de billets dans le pays ? » Vous construisez l'encadrement depuis les agences et les coins de rue : ${desc}. Le jury : « trop timide côté bas — au moins ${f(k, 0)} fois plus. » Ce qu'il teste vraiment : savez-vous comment une estimation GÉOMÉTRIQUE répond quand une borne bouge ?`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The estimate: the multiplicative middle' : 'a) L’estimation : le milieu multiplicatif',
          enonce: en
            ? `Between the bounds ${f(borneBasse, 0)} and ${f(borneHaute, 0)}, what is the Fermi estimate (geometric mean), in ${unites}?`
            : `Entre les bornes ${f(borneBasse, 0)} et ${f(borneHaute, 0)}, quelle est l'estimation de Fermi (moyenne géométrique), en ${unites} ?`,
          reponse: est1, tolerance: 0.005, unite: unites,
          etapes: [{
            titre: en ? 'Estimate = √(low × high)' : 'Estimation = √(basse × haute)',
            contenu: en
              ? `√(${f(borneBasse, 0)} × ${f(borneHaute, 0)}) = **${f(est1, 0)}**. On orders of magnitude, the middle is MULTIPLICATIVE: the chapter's anchor — between 1,000 and 1,000,000 the Fermi middle is ≈ 31,623, not 500,500. Announce the bracket, then the geometric middle, then the order of magnitude: that three-beat delivery is the answer.`
              : `√(${f(borneBasse, 0)} × ${f(borneHaute, 0)}) = **${f(est1, 0)}**. Sur des ordres de grandeur, le milieu est MULTIPLICATIF : l'ancre du chapitre — entre 1 000 et 1 000 000, le milieu de Fermi vaut ≈ 31 623, pas 500 500. Annoncer l'encadrement, puis le milieu géométrique, puis l'ordre de grandeur : ce trois-temps est la réponse.`,
          }],
          pieges: [en
            ? `Taking the arithmetic mean: on a bracket spanning ${f(span, 0)} orders of magnitude it crushes the low bound and lands near half the HIGH bound — a systematic upward bias.`
            : `Prendre la moyenne arithmétique : sur un encadrement de ${f(span, 0)} ordres de grandeur, elle écrase la borne basse et atterrit près de la moitié de la borne HAUTE — un biais systématique vers le haut.`],
        },
        {
          intitule: en ? 'b) The trap, quantified' : 'b) Le piège, chiffré',
          enonce: en
            ? `By what factor does the ARITHMETIC mean of the bounds overshoot your Fermi estimate of a)?`
            : `Par quel facteur la moyenne ARITHMÉTIQUE des bornes dépasse-t-elle votre estimation de Fermi du a) ?`,
          reponse: ratioArith, tolerance: 0.02, unite: '×',
          etapes: [{
            titre: en ? 'Ratio = arithmetic / geometric' : 'Rapport = arithmétique / géométrique',
            contenu: en
              ? `(${f(borneBasse, 0)} + ${f(borneHaute, 0)})/2 = ${f(moyArith, 0)}, hence ${f(moyArith, 0)} / ${f(est1, 0)} = **${f(ratioArith)}×**. Quantifying your own trap is the chapter-1 reflex transplanted to Fermi: know the tool AND its rival's error. Said to the jury, this one number kills the “why not the average?” follow-up before it is asked.`
              : `(${f(borneBasse, 0)} + ${f(borneHaute, 0)})/2 = ${f(moyArith, 0)}, d'où ${f(moyArith, 0)} / ${f(est1, 0)} = **${f(ratioArith)}×**. Chiffrer son propre piège est le réflexe du chapitre 1 transplanté chez Fermi : connaître l'outil ET l'erreur de son rival. Dit au jury, ce seul nombre tue la relance « pourquoi pas la moyenne ? » avant qu'elle ne soit posée.`,
          }],
          pieges: [en
            ? `Believing the arithmetic mean is “safer because bigger”: an estimate biased by a factor ${f(ratioArith, 1)} is not prudent, it is wrong — prudence lives in the BRACKET, not in inflating the point estimate.`
            : `Croire la moyenne arithmétique « plus prudente parce que plus grosse » : une estimation biaisée d'un facteur ${f(ratioArith, 1)} n'est pas prudente, elle est fausse — la prudence vit dans l'ENCADREMENT, pas dans le gonflement du point central.`],
        },
        {
          intitule: en ? 'c) The objection, absorbed' : 'c) L’objection, absorbée',
          enonce: en
            ? `The jury multiplies your lower bound by ${f(k, 0)}: new bracket ${f(borneBasse2, 0)} to ${f(borneHaute, 0)}. What is the revised Fermi estimate, in ${unites}?`
            : `Le jury multiplie votre borne basse par ${f(k, 0)} : nouvel encadrement ${f(borneBasse2, 0)} à ${f(borneHaute, 0)}. Quelle est l'estimation de Fermi révisée, en ${unites} ?`,
          reponse: est2, tolerance: 0.005, unite: unites,
          etapes: [{
            titre: en ? 'Same formula, new input' : 'Même formule, nouvelle entrée',
            contenu: en
              ? `√(${f(borneBasse2, 0)} × ${f(borneHaute, 0)}) = **${f(est2, 0)}**. Note the composure being graded: the objection does not restart the reasoning, it re-enters ONE input. “Then my estimate moves to ${f(est2, 0)}” — accepting the hint and updating out loud is worth more points than the initial estimate itself (chapter 4: refusing the hint costs three).`
              : `√(${f(borneBasse2, 0)} × ${f(borneHaute, 0)}) = **${f(est2, 0)}**. Notez le sang-froid qui est noté : l'objection ne relance pas le raisonnement, elle ressaisit UNE entrée. « Alors mon estimation passe à ${f(est2, 0)} » — accepter la perche et mettre à jour à voix haute rapporte plus de points que l'estimation initiale elle-même (chapitre 4 : refuser l'indice en coûte trois).`,
          }],
          pieges: [en
            ? `Defending the old bound out of pride: the jury just handed you information, and on a desk the person who ignores new information is the person who keeps the losing position (m11, in one sentence).`
            : `Défendre l'ancienne borne par orgueil : le jury vient de vous tendre une information, et sur un desk celui qui ignore l'information nouvelle est celui qui garde la position perdante (le m11 en une phrase).`],
        },
        {
          intitule: en ? 'd) The revision, in multiplicative terms' : 'd) La révision, en termes multiplicatifs',
          enonce: en
            ? `By what factor did your estimate move between a) and c)?`
            : `De quel facteur votre estimation a-t-elle bougé entre le a) et le c) ?`,
          reponse: facteurRevision, tolerance: 0.02, unite: '×',
          etapes: [{
            titre: en ? 'A ×k on one bound moves the estimate by √k' : 'Un ×k sur une borne déplace l’estimation de √k',
            contenu: en
              ? `${f(est2, 0)} / ${f(est1, 0)} = **${f(facteurRevision)}×** — and no accident: √(k·low × high) = √k × √(low × high), so a factor ${f(k, 0)} on ONE bound moves the geometric estimate by √${f(k, 0)} ≈ ${f(r2(Math.sqrt(k)))}. That damping is Fermi's built-in shock absorber: each bound only half-matters, in log terms. Say it, and the jury knows you understand the tool rather than operate it.`
              : `${f(est2, 0)} / ${f(est1, 0)} = **${f(facteurRevision)}×** — et rien d'accidentel : √(k·basse × haute) = √k × √(basse × haute), donc un facteur ${f(k, 0)} sur UNE borne déplace l'estimation géométrique de √${f(k, 0)} ≈ ${f(r2(Math.sqrt(k)))}. Cet amortissement est l'amortisseur intégré de Fermi : chaque borne ne compte qu'à moitié, en termes logarithmiques. Dites-le, et le jury sait que vous comprenez l'outil au lieu de l'actionner.`,
          }],
          pieges: [en
            ? `Expecting the estimate to move by the full factor ${f(k, 0)}: only if BOTH bounds moved. One bound × ${f(k, 0)} ⇒ estimate × √${f(k, 0)} — mixing the two is reading a geometric object with arithmetic eyes.`
            : `Attendre que l'estimation bouge du facteur ${f(k, 0)} entier : seulement si les DEUX bornes bougeaient. Une borne × ${f(k, 0)} ⇒ estimation × √${f(k, 0)} — confondre les deux, c'est lire un objet géométrique avec des yeux arithmétiques.`],
        },
        {
          intitule: en ? 'e) The honesty of the bracket' : 'e) L’honnêteté de l’encadrement',
          enonce: en
            ? `After the revision, how many orders of magnitude (log₁₀) separate your bounds ${f(borneBasse2, 0)} and ${f(borneHaute, 0)}?`
            : `Après la révision, combien d'ordres de grandeur (log₁₀) séparent vos bornes ${f(borneBasse2, 0)} et ${f(borneHaute, 0)} ?`,
          reponse: largeur, tolerance: 0.02, toleranceMode: 'absolu', unite: en ? 'orders of magnitude' : 'ordres de grandeur',
          etapes: [
            {
              titre: en ? 'Width = log₁₀(high/low)' : 'Largeur = log₁₀(haute/basse)',
              contenu: en
                ? `log₁₀(${f(borneHaute, 0)} / ${f(borneBasse2, 0)}) = **${f(largeur)}** orders of magnitude. The jury's objection did not just move your estimate — it TIGHTENED your bracket (from ${f(span, 0)} orders to ${f(largeur)}): a good challenge is free information, and the honest answer names both effects.`
                : `log₁₀(${f(borneHaute, 0)} / ${f(borneBasse2, 0)}) = **${f(largeur)}** ordres de grandeur. L'objection du jury n'a pas seulement déplacé votre estimation — elle a RESSERRÉ votre encadrement (de ${f(span, 0)} ordres à ${f(largeur)}) : une bonne contestation est de l'information gratuite, et la réponse honnête nomme les deux effets.`,
            },
            {
              titre: en ? 'The oral takeaway' : 'La phrase pour l’oral',
              contenu: en
                ? `The full delivery: “bracket ${f(borneBasse2, 0)}–${f(borneHaute, 0)}, geometric middle ${f(est2, 0)}, and I hold the order of magnitude, not the digits.” A Fermi answer that claims more precision than its bracket allows is an invention — and chapter 7 is unambiguous about inventions in front of a jury.`
                : `La livraison complète : « encadrement ${f(borneBasse2, 0)}–${f(borneHaute, 0)}, milieu géométrique ${f(est2, 0)}, et je tiens l'ordre de grandeur, pas les décimales. » Une réponse de Fermi qui revendique plus de précision que son encadrement n'en permet est une invention — et le chapitre 7 est sans ambiguïté sur les inventions devant un jury.`,
            },
          ],
          pieges: [en
            ? `Announcing the estimate with three significant digits: the bracket spans ${f(largeur, 1)} orders of magnitude — false precision is the fastest way to lose a jury of practitioners.`
            : `Annoncer l'estimation avec trois chiffres significatifs : l'encadrement couvre ${f(largeur, 1)} ordres de grandeur — la précision fausse est le plus court chemin pour perdre un jury de praticiens.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 15. m13-pb-15 — BOSS : l'oral aux trois épreuves — N4               */
/* ------------------------------------------------------------------ */
const oralAuxTroisEpreuves: ProblemeMoule = {
  id: 'm13-pb-15', moduleId: M13,
  titre: 'BOSS — L’oral aux trois épreuves : 72, Bayes, puis le pari',
  titreEn: 'BOSS — The three-trial oral: 72, Bayes, then the bet',
  typeDeCas: 'simulation d’oral',
  typeDeCasEn: 'oral simulation',
  difficulte: 4,
  scenarios: ['Le jury méthodique : il monte les marches une à une', 'Le jury pressé : les taux bas et la cote au rabais', 'Le jury joueur : les taux émergents et le pari final'],
  scenariosEn: ['The methodical jury: climbing the steps one by one', 'The hurried jury: low rates and the discounted odds', 'The gambling jury: emerging-market rates and the final bet'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : taux (en évitant le voisinage de 8 % où l'erreur
    // de la règle passe par zéro), facteur de la cote proposée à l'épreuve 3.
    const cfg = ([
      { tMin: 5, tMax: 7, cMin: 1.1, cMax: 1.3 },
      { tMin: 2, tMax: 4, cMin: 0.75, cMax: 0.9 },
      { tMin: 10, tMax: 14, cMin: 1.1, cMax: 1.25 },
    ] as const)[sIdx];
    const taux = randFloat(rng, cfg.tMin, cfg.tMax, 1);
    const prev = randFloat(rng, 1, 3, 1);
    const sens = randInt(rng, 88, 96);
    const fp = randInt(rng, 4, 9);
    const facteurCote = randFloat(rng, cfg.cMin, cfg.cMax, 2);

    const approx = r2(regleDe72(taux));
    const exact = r2(anneesDoublementExactes(taux));
    const erreur = r2(erreurRelativePct(approx, exact));
    const post = r2(bayesAPosterioriPct(prev, sens, fp));
    const coteEq = r2(coteEquitable(post));
    const coteOff = r2(coteEq * facteurCote);
    const edge = r2(esperanceJeu([post, 100 - post], [coteOff - 1, -1]));

    const { en, f, pct, eur } = outils(langue);
    const desc = en
      ? `a fund promises ${pct(taux, 1)} a year, compounded; of the strategies that make such claims, about ${pct(prev, 1)} genuinely deliver; your due-diligence test flags true performers with ${pct(sens, 0)} sensitivity and stamps ${pct(fp, 0)} of the pretenders by mistake; this fund IS flagged`
      : `un fonds promet ${pct(taux, 1)} par an, composés ; parmi les stratégies qui affichent une telle promesse, environ ${pct(prev, 1)} tiennent vraiment ; votre test de due diligence signale les vraies performances avec ${pct(sens, 0)} de sensibilité et tamponne par erreur ${pct(fp, 0)} des imposteurs ; ce fonds EST signalé`;
    const contexte = (en
      ? [
        `Twenty minutes into the final oral, the jury member stacks three exercises into one story and warns you: “each answer feeds the next — get the first wrong and the rest collapses.” The story: ${desc}. Trial one: the doubling time, exact value, error of the shortcut. Trial two: given the flag, the probability the fund is genuine. Trial three: he offers you odds of ${f(coteOff)} for 1 that it is — and wants your expectation before you shake on it. Chapter 7 said the oral changes scale without warning; here is the full staircase.`,
        `The jury member checks his watch: “fifteen minutes, three floors, one thread.” The thread: ${desc}. First the mental arithmetic of the promised rate — approximation, exact figure, signed error, low rates being exactly where the rule of 72 drifts. Then the Bayes of the 10,000 on your due-diligence flag. Then his bet: ${f(coteOff)} for 1 that the fund is genuine. He is hurried; your method cannot be.`,
        `“Let's play,” says the jury member, and he means it — three trials, rising stakes. The material: ${desc}. Emerging-market rates first (the rule of 72 undershoots up there, and he knows it), the flagged fund second, and to finish: odds of ${f(coteOff)} for 1 on the fund being genuine, your stake, your call. Every number you produce will be an input to the next question — the very definition of a desk conversation.`,
      ]
      : [
        `Vingt minutes dans l'oral final, le membre du jury empile trois exercices en une seule histoire et vous prévient : « chaque réponse nourrit la suivante — ratez la première et le reste s'effondre. » L'histoire : ${desc}. Épreuve un : le temps de doublement, la valeur exacte, l'erreur du raccourci. Épreuve deux : sachant le signalement, la probabilité que le fonds soit authentique. Épreuve trois : il vous offre une cote de ${f(coteOff)} pour 1 qu'il l'est — et veut votre espérance avant la poignée de main. Le chapitre 7 disait que l'oral change d'échelle sans prévenir ; voici l'escalier complet.`,
        `Le membre du jury regarde sa montre : « quinze minutes, trois étages, un seul fil. » Le fil : ${desc}. D'abord le calcul mental du taux promis — approximation, exact, erreur signée, les taux bas étant exactement là où la règle de 72 dérive. Puis le Bayes des 10 000 sur votre signalement de due diligence. Puis son pari : ${f(coteOff)} pour 1 que le fonds est authentique. Lui est pressé ; votre méthode n'a pas le droit de l'être.`,
        `« Jouons », dit le membre du jury, et il ne plaisante pas — trois épreuves, enjeux croissants. La matière : ${desc}. Les taux émergents d'abord (la règle de 72 sous-estime là-haut, et il le sait), le fonds signalé ensuite, et pour finir : une cote de ${f(coteOff)} pour 1 sur l'authenticité du fonds, votre mise, votre décision. Chaque nombre que vous produisez sera une entrée de la question suivante — la définition même d'une conversation de desk.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) Trial one: the rule of 72' : 'a) Épreuve un : la règle de 72',
          enonce: en
            ? `By the rule of 72, in how many years does the promised ${pct(taux, 1)} double the capital?`
            : `Par la règle de 72, en combien d'années le ${pct(taux, 1)} promis double-t-il le capital ?`,
          reponse: approx, tolerance: 0.005, unite: en ? 'years' : 'années',
          etapes: [{
            titre: en ? 'Doubling ≈ 72 / rate' : 'Doublement ≈ 72 / taux',
            contenu: en
              ? `72 / ${f(taux, 1)} = **${f(approx)} years**. Announced in three seconds, without a calculator — that speed is itself the message: the promised rate has a shape now (8% ⇒ 9 years, 6% ⇒ 12, 2% ⇒ 36), and the jury sees you own the most profitable mental tool of the interview.`
              : `72 / ${f(taux, 1)} = **${f(approx)} années**. Annoncé en trois secondes, sans calculatrice — cette vitesse est elle-même le message : le taux promis a désormais une forme (8 % ⇒ 9 ans, 6 % ⇒ 12, 2 % ⇒ 36), et le jury voit que vous possédez l'outil mental le plus rentable de l'entretien.`,
          }],
          pieges: [en
            ? `Dividing 72 by the rate in decimal (${f(r2(taux / 100), 3)}): the rule takes the rate in PERCENT — and confusing simple interest (100/${f(taux, 1)} = ${f(r2(100 / taux))} years) throws away the compounding the 72 encodes.`
            : `Diviser 72 par le taux en décimal (${f(r2(taux / 100), 3)}) : la règle prend le taux en POURCENT — et confondre avec les intérêts simples (100/${f(taux, 1)} = ${f(r2(100 / taux))} années) jette la composition que le 72 encode.`],
        },
        {
          intitule: en ? 'b) The safety net: the exact figure' : 'b) Le filet : la valeur exacte',
          enonce: en
            ? `What is the EXACT doubling time at ${pct(taux, 1)}, discrete annual compounding, in years?`
            : `Quel est le temps de doublement EXACT à ${pct(taux, 1)}, composition discrète annuelle, en années ?`,
          reponse: exact, tolerance: 0.005, unite: en ? 'years' : 'années',
          etapes: [{
            titre: en ? 'Exact = ln 2 / ln(1 + t/100)' : 'Exact = ln 2 / ln(1 + t/100)',
            contenu: en
              ? `ln 2 / ln(1 + ${f(taux, 1)}/100) = **${f(exact)} years**. The reference: at 8% the rule says 9 against 9.006468 exact — error −0.07%, invisible out loud. Away from 8% the rule drifts: it OVERSTATES at low rates, UNDERSTATES at high ones — one tool, one validity range, one known error.`
              : `ln 2 / ln(1 + ${f(taux, 1)}/100) = **${f(exact)} années**. La référence : à 8 %, la règle dit 9 contre 9,006468 exacts — erreur de −0,07 %, invisible à l'oral. Loin de 8 %, la règle dérive : elle SURESTIME aux taux bas, SOUS-ESTIME aux taux élevés — un outil, un domaine de validité, une erreur connue.`,
          }],
          pieges: [en
            ? `Using continuous compounding ln 2/(${f(taux, 1)}/100) = ${f(r2(69.31471805599453 / taux))} years: the course convention (m2/m4) is DISCRETE annual — the denominator is ln(1 + t/100).`
            : `Utiliser la composition continue ln 2/(${f(taux, 1)}/100) = ${f(r2(69.31471805599453 / taux))} années : la convention du cours (m2/m4) est la composition DISCRÈTE annuelle — le dénominateur est ln(1 + t/100).`],
        },
        {
          intitule: en ? 'c) The winning move: the signed error' : 'c) Le geste qui recrute : l’erreur signée',
          enonce: en
            ? `What is the relative error of a) against b), in % (signed: positive = the rule overstates)?`
            : `Quelle est l'erreur relative du a) contre le b), en % (signée : positif = la règle surestime) ?`,
          reponse: erreur, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Error = (approx − exact)/exact × 100' : 'Erreur = (approx − exact)/exact × 100',
            contenu: en
              ? `(${f(approx)} − ${f(exact)}) / ${f(exact)} × 100 = **${pct(erreur)}**. Announce, bound, quantify: the trial-one sentence in full — “about ${f(approx)} years by the rule, ${f(exact)} exactly, the shortcut is off by ${pct(erreur)} at this rate.” The jury nods; the staircase continues.`
              : `(${f(approx)} − ${f(exact)}) / ${f(exact)} × 100 = **${pct(erreur)}**. Annoncer, borner, chiffrer : la phrase complète de l'épreuve un — « environ ${f(approx)} ans par la règle, ${f(exact)} exactement, le raccourci se trompe de ${pct(erreur)} à ce niveau de taux. » Le jury hoche la tête ; l'escalier continue.`,
          }],
          pieges: [en
            ? `Dropping the sign: the sign says WHERE the rule drifts — ${erreur > 0 ? 'positive here, the rule overstates (low-rate side)' : 'negative here, the rule understates (high-rate side)'} — and it is the half of the answer that shows understanding.`
            : `Perdre le signe : le signe dit OÙ la règle dérive — ${erreur > 0 ? 'positif ici, la règle surestime (côté taux bas)' : 'négatif ici, la règle sous-estime (côté taux élevés)'} — et c'est la moitié de la réponse qui montre la compréhension.`],
        },
        {
          intitule: en ? 'd) Trial two: the Bayes of the 10,000' : 'd) Épreuve deux : le Bayes des 10 000',
          enonce: en
            ? `Base rate ${pct(prev, 1)}, sensitivity ${pct(sens, 0)}, false positives ${pct(fp, 0)}: given the flag, what is the probability the fund is genuine, in %?`
            : `Prévalence ${pct(prev, 1)}, sensibilité ${pct(sens, 0)}, faux positifs ${pct(fp, 0)} : sachant le signalement, quelle est la probabilité que le fonds soit authentique, en % ?`,
          reponse: post, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? '10,000 funds on the table' : '10 000 fonds sur la table',
            contenu: en
              ? `Out of 10,000 claimants: ${f(r2(10000 * prev / 100), 0)} genuine, of which ${f(r2(10000 * (prev / 100) * (sens / 100)))} flagged; ${f(r2(10000 - 10000 * prev / 100), 0)} pretenders, of which ${f(r2(10000 * (1 - prev / 100) * (fp / 100)))} flagged by mistake. Genuine share of the flags: ${f(r2(10000 * (prev / 100) * (sens / 100)))} / ${f(r2(10000 * (prev / 100) * (sens / 100) + 10000 * (1 - prev / 100) * (fp / 100)))} = **${pct(post)}**. The false positives drown the true ones because the base rate is small — the chapter-3 anchor (1%/99%/5% ⇒ 1/6) in a suit.`
              : `Sur 10 000 prétendants : ${f(r2(10000 * prev / 100), 0)} authentiques, dont ${f(r2(10000 * (prev / 100) * (sens / 100)))} signalés ; ${f(r2(10000 - 10000 * prev / 100), 0)} imposteurs, dont ${f(r2(10000 * (1 - prev / 100) * (fp / 100)))} signalés par erreur. Part authentique des signalements : ${f(r2(10000 * (prev / 100) * (sens / 100)))} / ${f(r2(10000 * (prev / 100) * (sens / 100) + 10000 * (1 - prev / 100) * (fp / 100)))} = **${pct(post)}**. Les faux positifs noient les vrais parce que la prévalence est faible — l'ancre du chapitre 3 (1 %/99 %/5 % ⇒ 1/6) en costume.`,
          }],
          pieges: [en
            ? `Answering “${pct(sens, 0)}, the test is reliable”: P(flag | genuine) is not P(genuine | flag) — inverting the conditional is the exact trap this trial is built on, and the promised ${pct(taux, 1)} of trial one should have made you suspicious already.`
            : `Répondre « ${pct(sens, 0)}, le test est fiable » : P(signalé | authentique) n'est pas P(authentique | signalé) — inverser la conditionnelle est le piège exact sur lequel cette épreuve est bâtie, et le ${pct(taux, 1)} promis de l'épreuve un aurait déjà dû vous rendre méfiant.`],
        },
        {
          intitule: en ? 'e) The benchmark of the final bet' : 'e) L’étalon du pari final',
          enonce: en
            ? `At the probability of d), what are the FAIR odds “for 1” on the fund being genuine?`
            : `À la probabilité du d), quelle est la cote ÉQUITABLE « pour 1 » sur l'authenticité du fonds ?`,
          reponse: coteEq, tolerance: 0.005, unite: en ? 'for 1' : 'pour 1',
          etapes: [{
            titre: en ? 'Fair odds = 100/p' : 'Cote équitable = 100/p',
            contenu: en
              ? `100 / ${f(post)} = **${f(coteEq)} for 1** — the zero-expectation price of the bet, computed from YOUR posterior, not from the base rate and not from the sensitivity. This is where the staircase pays: trial two's output is trial three's only honest input.`
              : `100 / ${f(post)} = **${f(coteEq)} pour 1** — le prix à espérance nulle du pari, calculé sur VOTRE a posteriori, pas sur la prévalence ni sur la sensibilité. C'est ici que l'escalier paie : la sortie de l'épreuve deux est la seule entrée honnête de l'épreuve trois.`,
          }],
          pieges: [en
            ? `Pricing the odds on the raw base rate (100/${f(prev, 1)} = ${f(r2(100 / prev))}): the flag happened — ignoring your own update is throwing away the entire second trial.`
            : `Pricer la cote sur la prévalence brute (100/${f(prev, 1)} = ${f(r2(100 / prev))}) : le signalement a eu lieu — ignorer sa propre mise à jour, c'est jeter toute l'épreuve deux.`],
        },
        {
          intitule: en ? 'f) Trial three: the verdict per euro' : 'f) Épreuve trois : le verdict par euro',
          enonce: en
            ? `The jury offers ${f(coteOff)} for 1. Per 1 € staked, what is your expected profit or loss, in € — and do you take the bet?`
            : `Le jury offre ${f(coteOff)} pour 1. Pour 1 € misé, quel est votre gain ou perte attendu, en € — et prenez-vous le pari ?`,
          reponse: edge, tolerance: 0.02, toleranceMode: 'absolu', unite: en ? '€ per € staked' : '€ par € misé',
          etapes: [
            {
              titre: en ? 'E = p(odds − 1) − (1 − p)' : 'E = p(cote − 1) − (1 − p)',
              contenu: en
                ? `${f(post)}/100 × ${f(r2(coteOff - 1))} − ${f(r2(1 - post / 100))} = **${eur(edge)}** per euro staked. Offered ${f(coteOff)} against a fair ${f(coteEq)}: ${edge > 0 ? 'the odds overpay the event — you take the bet, small' : 'the odds underpay the event — you decline, with the number'}. The comparison offered-vs-fair IS the verdict; the expectation is its price tag.`
                : `${f(post)}/100 × ${f(r2(coteOff - 1))} − ${f(r2(1 - post / 100))} = **${eur(edge)}** par euro misé. ${f(coteOff)} proposé contre ${f(coteEq)} équitable : ${edge > 0 ? 'la cote surpaie l’événement — vous prenez le pari, petit' : 'la cote sous-paie l’événement — vous déclinez, chiffre à l’appui'}. La comparaison proposé-contre-juste EST le verdict ; l'espérance en est l'étiquette de prix.`,
            },
            {
              titre: en ? 'The staircase, replayed for the jury' : 'L’escalier, rejoué pour le jury',
              contenu: en
                ? `Close the oral the way chapter 7 teaches — one line per trial: “${f(approx)} years by the rule, ${f(exact)} exact, ${pct(erreur)} of error; flagged, the fund is genuine with probability ${pct(post)}; at ${f(coteOff)} for 1 my expectation is ${eur(edge)} per euro${edge > 0 ? ', I play small and repeatable' : ', I pass'}.” Three answers, each feeding the next, delivered in twenty seconds: that is the exercise the whole module trains.`
                : `Refermez l'oral comme le chapitre 7 l'enseigne — une ligne par épreuve : « ${f(approx)} ans par la règle, ${f(exact)} exacts, ${pct(erreur)} d'erreur ; signalé, le fonds est authentique avec probabilité ${pct(post)} ; à ${f(coteOff)} pour 1 mon espérance est de ${eur(edge)} par euro${edge > 0 ? ', je joue petit et répétable' : ', je passe'}. » Trois réponses, chacune nourrissant la suivante, livrées en vingt secondes : c'est l'exercice que tout le module entraîne.`,
            },
          ],
          pieges: [en
            ? `Deciding on the odds alone (“${f(coteOff)} for 1 sounds ${coteOff > 3 ? 'generous' : 'thin'}”): odds mean nothing without the probability they are measured against — the whole point of having climbed the first two trials.`
            : `Décider sur la cote seule (« ${f(coteOff)} pour 1, ça sonne ${coteOff > 3 ? 'généreux' : 'maigre'} ») : une cote ne dit rien sans la probabilité contre laquelle on la mesure — tout l'intérêt d'avoir gravi les deux premières épreuves.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 16. m13-pb-16 — BOSS : le candidat et le menteur — N4               */
/* ------------------------------------------------------------------ */
const candidatEtLeMenteur: ProblemeMoule = {
  id: 'm13-pb-16', moduleId: M13,
  titre: 'BOSS — Le candidat et le menteur : la pièce truquée au tribunal de Bayes',
  titreEn: 'BOSS — The candidate and the liar: the loaded coin before Bayes’ court',
  typeDeCas: 'simulation d’oral',
  typeDeCasEn: 'oral simulation',
  difficulte: 4,
  scenarios: ['Les deux pièces du jury : une honnête, une truquée', 'Le bocal du desk : une pièce truquée sur quatre', 'La pièce suspecte du dernier tour : le doute a priori est mince'],
  scenariosEn: ['The jury’s two coins: one honest, one loaded', 'The desk jar: one loaded coin in four', 'The final-round suspect coin: the prior doubt is thin'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : a priori de pièce truquée (%), biais de la pièce.
    const cfg = ([
      { prior: 50 },
      { prior: 25 },
      { prior: 10 },
    ] as const)[sIdx];
    const prior = cfg.prior;
    const pTruquee = 5 * randInt(rng, 14, 17); // 70, 75, 80 ou 85 % de pile
    const nPiles = randInt(rng, 3, 5);
    const perte = randInt(rng, 5, 10);
    const gain = perte + randInt(rng, 2, 6);

    const pSerieHonnete = r2(probaSerieConsecutivePct(50, nPiles));
    const pSerieTruquee = r2(probaSerieConsecutivePct(pTruquee, nPiles));
    const post = r2(bayesAPosterioriPct(prior, pSerieTruquee, pSerieHonnete));
    const pProchainPile = r2(esperanceJeu([post, 100 - post], [pTruquee, 50]));
    const esperancePari = r2(esperanceJeu([pProchainPile, 100 - pProchainPile], [gain, -perte]));
    const gainNet = r2(gain / perte);
    const kelly = r2((100 * (gainNet * (pProchainPile / 100) - (1 - pProchainPile / 100))) / gainNet);

    const { en, f, pct, eur } = outils(langue);
    const desc = en
      ? `the loaded coin lands heads ${pct(pTruquee, 0)} of the time, the honest one 50%; a priori, the coin in his hand is loaded with probability ${pct(prior, 0)}; he flips it ${f(nPiles, 0)} times: ${f(nPiles, 0)} heads in a row; then the bet — you win ${eur(gain, 0)} if the NEXT flip is heads, you pay ${eur(perte, 0)} if it is tails`
      : `la pièce truquée tombe sur pile ${pct(pTruquee, 0)} du temps, l'honnête 50 % ; a priori, la pièce dans sa main est truquée avec probabilité ${pct(prior, 0)} ; il la lance ${f(nPiles, 0)} fois : ${f(nPiles, 0)} piles d'affilée ; puis le pari — vous gagnez ${eur(gain, 0)} si le PROCHAIN lancer est pile, vous payez ${eur(perte, 0)} s'il est face`;
    const contexte = (en
      ? [
        `The jury member produces two coins, shows them both, and palms one with a magician's smile: “one is honest, one is not. Watch.” The setup: ${desc}. Four questions hide in his smile: how surprising is the series under each hypothesis, what the series does to your belief, what the next flip is really worth, and whether his bet deserves your money. Answer them in that order — the order IS the method.`,
        `Desk initiation ritual: a jar of coins, one in four loaded, and the new hire bets on a flip. Your neighbour fishes one out. The facts: ${desc}. Everyone at the coffee machine already “knows” the coin is rigged — your job is to replace the certainty with a number, then price the bet with it.`,
        `Last round. The interviewer flips a coin he claims is ordinary — the prior that it is loaded is thin. The data: ${desc}. This is the chapter-3 sentence made flesh: the gambler's fallacy says the next flip is 50% no matter what; the Bayesian answers “50% IF the coin is honest — and the series is starting to testify against that very hypothesis.”`,
      ]
      : [
        `Le membre du jury sort deux pièces, les montre toutes deux, et en escamote une avec un sourire de magicien : « une honnête, une pas. Regardez. » Le dispositif : ${desc}. Quatre questions se cachent dans son sourire : la série est-elle surprenante sous chaque hypothèse, que fait-elle à votre croyance, que vaut vraiment le prochain lancer, et son pari mérite-t-il votre argent. Répondez dans cet ordre — l'ordre EST la méthode.`,
        `Rituel d'initiation du desk : un bocal de pièces, une sur quatre truquée, et le nouveau parie sur un lancer. Votre voisin en pêche une. Les faits : ${desc}. Tout le monde à la machine à café « sait » déjà que la pièce est pipée — votre travail est de remplacer la certitude par un nombre, puis de pricer le pari avec.`,
        `Dernier tour. L'interviewer lance une pièce qu'il affirme ordinaire — l'a priori qu'elle soit truquée est mince. Les données : ${desc}. C'est la phrase du chapitre 3 faite chair : le sophisme du joueur dit que le prochain lancer est à 50 % quoi qu'il arrive ; le bayésien répond « 50 % SI la pièce est honnête — et la série commence à témoigner contre cette hypothèse même. »`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The series under the honest hypothesis' : 'a) La série sous l’hypothèse honnête',
          enonce: en
            ? `If the coin is honest (heads 50%), what is the probability of ${f(nPiles, 0)} heads in a row, in %?`
            : `Si la pièce est honnête (pile à 50 %), quelle est la probabilité de ${f(nPiles, 0)} piles d'affilée, en % ?`,
          reponse: pSerieHonnete, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'Consecutive successes multiply: pⁿ' : 'Les succès consécutifs se multiplient : pⁿ',
            contenu: en
              ? `(50/100)^${f(nPiles, 0)} × 100 = **${pct(pSerieHonnete)}** — the chapter anchor: five heads in a row = 3.125%. Mirror image of “at least one”: here the SUCCESSES multiply, there the failures did. Rare, but not impossible — which is exactly why this number alone decides nothing yet.`
              : `(50/100)^${f(nPiles, 0)} × 100 = **${pct(pSerieHonnete)}** — l'ancre du chapitre : cinq piles d'affilée = 3,125 %. Miroir du « au moins un » : ici les SUCCÈS se multiplient, là-bas c'étaient les échecs. Rare, mais pas impossible — et c'est exactement pourquoi ce nombre seul ne décide encore rien.`,
          }],
          pieges: [en
            ? `“The series is unlikely (${pct(pSerieHonnete)}), so the coin is loaded”: a small P(series | honest) is not a small P(honest | series) — you need the OTHER likelihood and the prior before concluding. That shortcut is the whole trap of the problem.`
            : `« La série est improbable (${pct(pSerieHonnete)}), donc la pièce est truquée » : un petit P(série | honnête) n'est pas un petit P(honnête | série) — il faut l'AUTRE vraisemblance et l'a priori avant de conclure. Ce raccourci est tout le piège du problème.`],
        },
        {
          intitule: en ? 'b) The series under the loaded hypothesis' : 'b) La série sous l’hypothèse truquée',
          enonce: en
            ? `If the coin is loaded (heads ${pct(pTruquee, 0)}), what is the probability of the same ${f(nPiles, 0)} heads, in %?`
            : `Si la pièce est truquée (pile à ${pct(pTruquee, 0)}), quelle est la probabilité des mêmes ${f(nPiles, 0)} piles, en % ?`,
          reponse: pSerieTruquee, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'Same formula, other hypothesis' : 'Même formule, autre hypothèse',
            contenu: en
              ? `(${f(pTruquee, 0)}/100)^${f(nPiles, 0)} × 100 = **${pct(pSerieTruquee)}** — against ${pct(pSerieHonnete)} under honesty: the series is ${f(r2(pSerieTruquee / pSerieHonnete), 1)} times more likely if the coin is loaded. That RATIO of likelihoods is the entire information content of the evidence — a signal only means something by comparing its probability under the two hypotheses (chapter 3, Monty Hall included).`
              : `(${f(pTruquee, 0)}/100)^${f(nPiles, 0)} × 100 = **${pct(pSerieTruquee)}** — contre ${pct(pSerieHonnete)} sous honnêteté : la série est ${f(r2(pSerieTruquee / pSerieHonnete), 1)} fois plus probable si la pièce est truquée. Ce RAPPORT des vraisemblances est tout le contenu informatif de l'évidence — un signal ne vaut que par la comparaison de ses probabilités sous les deux hypothèses (chapitre 3, Monty Hall compris).`,
          }],
          pieges: [en
            ? `Stopping at “${pct(pSerieTruquee)} is big, case closed”: even a likelihood of ${pct(pSerieTruquee)} proves nothing if loaded coins barely exist — the prior of ${pct(prior, 0)} has not spoken yet.`
            : `S'arrêter à « ${pct(pSerieTruquee)} c'est gros, affaire classée » : même une vraisemblance de ${pct(pSerieTruquee)} ne prouve rien si les pièces truquées existent à peine — l'a priori de ${pct(prior, 0)} n'a pas encore parlé.`],
        },
        {
          intitule: en ? 'c) Bayes’ verdict on the coin' : 'c) Le verdict de Bayes sur la pièce',
          enonce: en
            ? `With the prior of ${pct(prior, 0)} and the two likelihoods of a) and b), what is the probability the coin is loaded, given the series, in %?`
            : `Avec l'a priori de ${pct(prior, 0)} et les deux vraisemblances du a) et du b), quelle est la probabilité que la pièce soit truquée, sachant la série, en % ?`,
          reponse: post, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'Posterior = prior·L₁ / (prior·L₁ + (1−prior)·L₀)' : 'A posteriori = prior·L₁ / (prior·L₁ + (1−prior)·L₀)',
            contenu: en
              ? `${f(prior, 0)} × ${f(pSerieTruquee)} / (${f(prior, 0)} × ${f(pSerieTruquee)} + ${f(100 - prior, 0)} × ${f(pSerieHonnete)}) = **${pct(post)}**. Same machine as the medical test: “loaded” plays the disease, the series plays the positive test, b) is the sensitivity and a) the false-positive rate. One structure, every costume — spotting it across disguises is what the jury calls understanding.`
              : `${f(prior, 0)} × ${f(pSerieTruquee)} / (${f(prior, 0)} × ${f(pSerieTruquee)} + ${f(100 - prior, 0)} × ${f(pSerieHonnete)}) = **${pct(post)}**. Même machine que le test médical : « truquée » joue la maladie, la série joue le test positif, le b) est la sensibilité et le a) le taux de faux positifs. Une structure, tous les costumes — la repérer sous les déguisements est ce que le jury appelle comprendre.`,
          }],
          pieges: [en
            ? `Forgetting the prior and computing ${f(pSerieTruquee)}/(${f(pSerieTruquee)} + ${f(pSerieHonnete)}) = ${pct(r2(100 * pSerieTruquee / (pSerieTruquee + pSerieHonnete)))}: that silently assumes a 50/50 prior — ${prior === 50 ? 'legitimate here, but say it out loud' : `wrong here, where the prior is ${pct(prior, 0)}`}.`
            : `Oublier l'a priori et calculer ${f(pSerieTruquee)}/(${f(pSerieTruquee)} + ${f(pSerieHonnete)}) = ${pct(r2(100 * pSerieTruquee / (pSerieTruquee + pSerieHonnete)))} : c'est supposer en silence un a priori 50/50 — ${prior === 50 ? 'légitime ici, mais dites-le à voix haute' : `faux ici, où l'a priori vaut ${pct(prior, 0)}`}.`],
        },
        {
          intitule: en ? 'd) The next flip, honestly priced' : 'd) Le prochain lancer, pricé honnêtement',
          enonce: en
            ? `Mixing the two hypotheses with the posterior of c), what is the probability the NEXT flip is heads, in %?`
            : `En mélangeant les deux hypothèses avec l'a posteriori du c), quelle est la probabilité que le PROCHAIN lancer soit pile, en % ?`,
          reponse: pProchainPile, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'P(heads) = post × p_loaded + (1 − post) × 50' : 'P(pile) = post × p_truquée + (1 − post) × 50',
            contenu: en
              ? `${f(post)}/100 × ${f(pTruquee, 0)} + ${f(r2(100 - post))}/100 × 50 = **${pct(pProchainPile)}**. Neither 50% (the gambler's-fallacy answer) nor ${pct(pTruquee, 0)} (the “case closed” answer): a WEIGHTED mix of the two worlds, weighted by your posterior. The fine answer of chapter 3, with the number attached — the flips are independent GIVEN the coin; it is the coin you are unsure about.`
              : `${f(post)}/100 × ${f(pTruquee, 0)} + ${f(r2(100 - post))}/100 × 50 = **${pct(pProchainPile)}**. Ni 50 % (la réponse du sophisme du joueur) ni ${pct(pTruquee, 0)} (la réponse « affaire classée ») : un mélange PONDÉRÉ des deux mondes, pondéré par votre a posteriori. La réponse fine du chapitre 3, chiffre à l'appui — les lancers sont indépendants SACHANT la pièce ; c'est de la pièce que vous doutez.`,
          }],
          pieges: [en
            ? `Answering “50%, coins have no memory”: true WITHIN the honest hypothesis, blind ACROSS hypotheses — after ${f(nPiles, 0)} heads, defending pure independence against the evidence is the symmetric twin of the gambler's fallacy.`
            : `Répondre « 50 %, une pièce n'a pas de mémoire » : vrai DANS l'hypothèse honnête, aveugle ENTRE les hypothèses — après ${f(nPiles, 0)} piles, défendre l'indépendance pure contre l'évidence est le jumeau symétrique du sophisme du joueur.`],
        },
        {
          intitule: en ? 'e) The liar’s bet, priced' : 'e) Le pari du menteur, pricé',
          enonce: en
            ? `Win ${eur(gain, 0)} on heads, pay ${eur(perte, 0)} on tails, at the probability of d): what is the expectation of the bet, in €?`
            : `Gagner ${eur(gain, 0)} sur pile, payer ${eur(perte, 0)} sur face, à la probabilité du d) : quelle est l'espérance du pari, en € ?`,
          reponse: esperancePari, tolerance: 0.02, toleranceMode: 'absolu', unite: '€',
          etapes: [{
            titre: en ? 'E = p·G − (1 − p)·P' : 'E = p·G − (1 − p)·P',
            contenu: en
              ? `${f(pProchainPile)}/100 × ${f(gain, 0)} − ${f(r2(100 - pProchainPile))}/100 × ${f(perte, 0)} = **${eur(esperancePari)}**. Positive — and notice WHY: the jury wrote the payoffs before flipping, but your probability moved with the series while his prices did not. Stale quotes against fresh information: that is where every edge on every desk comes from.`
              : `${f(pProchainPile)}/100 × ${f(gain, 0)} − ${f(r2(100 - pProchainPile))}/100 × ${f(perte, 0)} = **${eur(esperancePari)}**. Positive — et notez POURQUOI : le jury a écrit les gains avant de lancer, mais votre probabilité a bougé avec la série pendant que ses prix restaient figés. Des cotes rassies contre une information fraîche : c'est de là que vient chaque edge de chaque desk.`,
          }],
          pieges: [en
            ? `Pricing the bet at 50% “to stay neutral”: E would read ${eur(r2(0.5 * gain - 0.5 * perte))} — neutrality that ignores your own Bayes of c) and d) is not prudence, it is amnesia.`
            : `Pricer le pari à 50 % « pour rester neutre » : E vaudrait ${eur(r2(0.5 * gain - 0.5 * perte))} — une neutralité qui ignore votre propre Bayes du c) et du d) n'est pas de la prudence, c'est de l'amnésie.`],
        },
        {
          intitule: en ? 'f) The size: Kelly closes the oral' : 'f) La taille : Kelly clôt l’oral',
          enonce: en
            ? `Net gain per unit staked b = ${f(gain, 0)}/${f(perte, 0)}: what fraction of your bankroll does the Kelly criterion f* = (bp − q)/b put on the bet, in %?`
            : `Gain net par unité misée b = ${f(gain, 0)}/${f(perte, 0)} : quelle fraction de votre capital le critère de Kelly f* = (bp − q)/b place-t-il sur le pari, en % ?`,
          reponse: kelly, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'f* = (bp − q)/b, with the posterior p' : 'f* = (bp − q)/b, avec le p a posteriori',
              contenu: en
                ? `b = ${f(gainNet)}, p = ${f(pProchainPile)}%, q = ${f(r2(100 - pProchainPile))}% : f* = (${f(gainNet)} × ${f(r2(pProchainPile / 100))} − ${f(r2((100 - pProchainPile) / 100))}) / ${f(gainNet)} = **${pct(kelly)}** of the bankroll. Not 100%, not 20%: ${f(kelly, 0)}. Beyond f*, per-bet expectation still rises but COMPOUND growth falls — too big turns a winning game into near-certain ruin (losing 50% requires +100% back). Desks bet half-Kelly, because the edge is estimated, not known.`
                : `b = ${f(gainNet)}, p = ${f(pProchainPile)} %, q = ${f(r2(100 - pProchainPile))} % : f* = (${f(gainNet)} × ${f(r2(pProchainPile / 100))} − ${f(r2((100 - pProchainPile) / 100))}) / ${f(gainNet)} = **${pct(kelly)}** du capital. Ni 100 %, ni 20 % : ${f(kelly, 0)}. Au-delà de f*, l'espérance par coup monte encore mais la croissance COMPOSÉE chute — trop miser transforme un jeu gagnant en ruine quasi certaine (perdre 50 % exige +100 % pour revenir). Les desks misent demi-Kelly, parce que l'edge est estimé, pas connu.`,
            },
            {
              titre: en ? 'The oral takeaway' : 'La phrase pour l’oral',
              contenu: en
                ? `The full arc in four beats: two likelihoods (${pct(pSerieHonnete)} vs ${pct(pSerieTruquee)}), one posterior (${pct(post)}), one honest mixture (${pct(pProchainPile)}), one sized bet (${pct(kelly)} of capital). The liar loses not because you caught him — but because you priced him.`
                : `L'arc complet en quatre temps : deux vraisemblances (${pct(pSerieHonnete)} contre ${pct(pSerieTruquee)}), un a posteriori (${pct(post)}), un mélange honnête (${pct(pProchainPile)}), un pari dimensionné (${pct(kelly)} du capital). Le menteur perd non parce que vous l'avez démasqué — mais parce que vous l'avez pricé.`,
            },
          ],
          pieges: [en
            ? `Betting the whole bankroll because “the expectation is positive”: with probability ${pct(r2(100 - pProchainPile))} you lose this very flip — the size of a position is a decision distinct from its direction, and often the more important of the two (m12).`
            : `Miser tout le capital parce que « l'espérance est positive » : avec probabilité ${pct(r2(100 - pProchainPile))} vous perdez ce lancer précis — la taille d'une position est une décision distincte de son sens, et souvent la plus importante des deux (m12).`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 17. m13-pb-17 — BOSS : la table de poker du desk — N4               */
/* ------------------------------------------------------------------ */
const tableDePokerDuDesk: ProblemeMoule = {
  id: 'm13-pb-17', moduleId: M13,
  titre: 'BOSS — La table de poker du desk : compter, coter, suivre',
  titreEn: 'BOSS — The desk poker table: count, quote, call',
  typeDeCas: 'simulation d’oral',
  typeDeCasEn: 'oral simulation',
  difficulte: 4,
  scenarios: ['Le tirage couleur : neuf cartes qui sauvent', 'Le tirage quinte par les deux bouts : huit sorties', 'Le tirage monstre : quinte ou couleur, quinze sorties'],
  scenariosEn: ['The flush draw: nine saving cards', 'The open-ended straight draw: eight outs', 'The monster draw: straight or flush, fifteen outs'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : nombre de sorties (outs), facteur pot/mise —
    // calibré pour que la cote offerte par le pot dépasse la cote équitable.
    const cfg = ([
      { outs: 9, fMin: 2.2, fMax: 3.2 },
      { outs: 8, fMin: 2.6, fMax: 3.6 },
      { outs: 15, fMin: 1.3, fMax: 2.4 },
    ] as const)[sIdx];
    const outs = cfg.outs;
    const mise = randInt(rng, 20, 60);
    const pot = Math.round(mise * randFloat(rng, cfg.fMin, cfg.fMax, 2));

    const totalCombis = combinaisons(47, 2);                     // 1 081
    const combisRatees = combinaisons(47 - outs, 2);
    const pToucher = r2(100 * (1 - combisRatees / totalCombis));
    const coteEq = r2(coteEquitable(pToucher));
    const coteOfferte = r2((pot + mise) / mise);
    const esperanceCall = r2(esperanceJeu([pToucher, 100 - pToucher], [pot, -mise]));

    const { en, f, pct, eur } = outils(langue);
    const mains = (en
      ? ['a flush draw (four hearts, any of the 9 remaining hearts completes it)', 'an open-ended straight draw (8 cards complete it, four on each end)', 'a monster draw — straight or flush — with 15 completing cards']
      : ['un tirage couleur (quatre cœurs, n’importe lequel des 9 cœurs restants le complète)', 'un tirage quinte par les deux bouts (8 cartes le complètent, quatre de chaque côté)', 'un tirage monstre — quinte ou couleur — à 15 cartes salvatrices'])[sIdx];
    const desc = en
      ? `after the flop you hold ${mains}; you have seen 5 cards (your 2 and the 3 on the board), so 47 remain unseen and 2 are still to come; the pot holds ${eur(pot, 0)} and your opponent's bet asks you to call ${eur(mise, 0)}`
      : `après le flop vous tenez ${mains} ; vous avez vu 5 cartes (vos 2 et les 3 du tableau), il en reste donc 47 non vues et 2 à venir ; le pot contient ${eur(pot, 0)} et la mise adverse vous demande de payer ${eur(mise, 0)}`;
    const contexte = (en
      ? [
        `Friday, 7 p.m., the monthly desk poker game — and the head of desk, who interviews candidates for a living, watches HOW you decide more than what you win. The hand: ${desc}. He taps the table: “out loud, please — the count, the price, the call.” The oral is never over: C(52, 5) = 2,598,960 was chapter 3; tonight it plays for money.`,
        `The jury member pushes a deck aside and deals the situation on paper: ${desc}. “No poker culture required,” he says, “only arithmetic: what are the odds the draw completes, what price does the pot offer you, and is the call profitable?” A pricing exercise wearing a card game — his favourite disguise.`,
        `Last round of the assessment day: the firm rents a poker table and the examiners deal set hands. Yours: ${desc}. The grading grid, leaked by an alumnus: counting (combinations), conversion (probability to odds), comparison (fair odds against pot odds), and the discipline of folding when the price is wrong — tonight the price happens to be right, IF you compute it.`,
      ]
      : [
        `Vendredi, 19 h, le poker mensuel du desk — et le chef de desk, qui fait passer des entretiens pour gagner sa vie, regarde COMMENT vous décidez plus que ce que vous gagnez. La main : ${desc}. Il tapote la table : « à voix haute, s'il vous plaît — le compte, le prix, la décision. » L'oral n'est jamais fini : C(52, 5) = 2 598 960, c'était le chapitre 3 ; ce soir il joue pour de l'argent.`,
        `Le membre du jury écarte un jeu de cartes et distribue la situation sur papier : ${desc}. « Aucune culture poker requise, dit-il, seulement de l'arithmétique : quelle probabilité que le tirage rentre, quel prix le pot vous offre, et le call est-il rentable ? » Un exercice de pricing déguisé en jeu de cartes — son déguisement préféré.`,
        `Dernier tour de la journée d'évaluation : la maison loue une table de poker et les examinateurs distribuent des mains imposées. La vôtre : ${desc}. La grille de notation, fuitée par un ancien : le comptage (combinaisons), la conversion (probabilité en cote), la comparaison (cote équitable contre cote du pot), et la discipline de passer quand le prix est mauvais — ce soir le prix se trouve être bon, SI vous le calculez.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The universe: two cards among 47' : 'a) L’univers : deux cartes parmi 47',
          enonce: en
            ? `How many distinct pairs of cards can the last two streets deal, i.e. C(47, 2)?`
            : `Combien de paires de cartes distinctes les deux dernières rues peuvent-elles livrer, c'est-à-dire C(47, 2) ?`,
          reponse: totalCombis, tolerance: 0.5, toleranceMode: 'absolu', unite: en ? 'pairs' : 'paires',
          etapes: [{
            titre: en ? 'C(n, k): count without enumerating' : 'C(n, k) : compter sans énumérer',
            contenu: en
              ? `C(47, 2) = 47 × 46 / 2 = **${f(totalCombis, 0)}**. The chapter-3 reflex: simplify BEFORE multiplying (46/2 = 23, then 47 × 23). Same tool that counts the ${en ? '' : ''}2,598,960 five-card hands — here it counts the futures your draw lives in.`
              : `C(47, 2) = 47 × 46 / 2 = **${f(totalCombis, 0)}**. Le réflexe du chapitre 3 : simplifier AVANT de multiplier (46/2 = 23, puis 47 × 23). Le même outil qui compte les 2 598 960 mains de cinq cartes — ici il compte les futurs dans lesquels vit votre tirage.`,
          }],
          pieges: [en
            ? `Counting ordered pairs (47 × 46 = ${f(47 * 46, 0)}): the turn-then-river order does not matter for completing the draw — dividing by 2 is what C(n, k) is FOR.`
            : `Compter les paires ordonnées (47 × 46 = ${f(47 * 46, 0)}) : l'ordre turn-puis-river ne compte pas pour compléter le tirage — diviser par 2 est précisément ce à quoi sert C(n, k).`],
        },
        {
          intitule: en ? 'b) The complementary: the futures that miss' : 'b) Le complémentaire : les futurs qui ratent',
          enonce: en
            ? `With ${f(outs, 0)} outs, how many of those pairs contain NO helping card, i.e. C(${f(47 - outs, 0)}, 2)?`
            : `Avec ${f(outs, 0)} sorties, combien de ces paires ne contiennent AUCUNE carte utile, c'est-à-dire C(${f(47 - outs, 0)}, 2) ?`,
          reponse: combisRatees, tolerance: 0.5, toleranceMode: 'absolu', unite: en ? 'pairs' : 'paires',
          etapes: [{
            titre: en ? 'Route the “at least one” through its complement' : 'Faire passer le « au moins un » par son complémentaire',
            contenu: en
              ? `${f(47 - outs, 0)} cards help nothing; C(${f(47 - outs, 0)}, 2) = ${f(47 - outs, 0)} × ${f(46 - outs, 0)} / 2 = **${f(combisRatees, 0)}** all-blank futures. THE probability reflex of the whole module: “at least one out” is hard head-on and trivial through the complement — count the disasters, subtract from the whole.`
              : `${f(47 - outs, 0)} cartes n'aident en rien ; C(${f(47 - outs, 0)}, 2) = ${f(47 - outs, 0)} × ${f(46 - outs, 0)} / 2 = **${f(combisRatees, 0)}** futurs entièrement blancs. LE réflexe probabiliste de tout le module : « au moins une sortie » est dur de front et trivial par le complémentaire — compter les désastres, soustraire du tout.`,
          }],
          pieges: [en
            ? `Computing the direct way — one out on the turn PLUS one on the river — and double-counting the pairs with two outs: the complement exists precisely to spare you that inclusion-exclusion.`
            : `Calculer en direct — une sortie au turn PLUS une à la river — et compter deux fois les paires à deux sorties : le complémentaire existe précisément pour vous épargner cette inclusion-exclusion.`],
        },
        {
          intitule: en ? 'c) The probability of getting there' : 'c) La probabilité d’arriver',
          enonce: en
            ? `What is the probability the draw completes on the last two streets, in % (1 minus the ratio of b) to a))?`
            : `Quelle est la probabilité que le tirage rentre sur les deux dernières rues, en % (1 moins le rapport du b) au a)) ?`,
          reponse: pToucher, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'P = 100 × (1 − misses/total)' : 'P = 100 × (1 − ratés/total)',
            contenu: en
              ? `100 × (1 − ${f(combisRatees, 0)}/${f(totalCombis, 0)}) = **${pct(pToucher)}**. Sanity-check it like a desk would: the rough “rule of 4” (outs × 4 ≈ ${f(outs * 4, 0)}%) lands close — a mental cross-check that catches sign and order-of-magnitude errors before the jury does.`
              : `100 × (1 − ${f(combisRatees, 0)}/${f(totalCombis, 0)}) = **${pct(pToucher)}**. Vérifiez-la comme un desk : la « règle du 4 » approximative (sorties × 4 ≈ ${f(outs * 4, 0)} %) atterrit tout près — un recoupement mental qui attrape les erreurs de signe et d'ordre de grandeur avant le jury.`,
          }],
          pieges: [en
            ? `Adding the per-street chances (${f(outs, 0)}/47 + ${f(outs, 0)}/46 ≈ ${pct(r2(100 * (outs / 47 + outs / 46)))}): successes do not add, they compound — the n×p error of chapter 3, at a poker table.`
            : `Additionner les chances rue par rue (${f(outs, 0)}/47 + ${f(outs, 0)}/46 ≈ ${pct(r2(100 * (outs / 47 + outs / 46)))}) : les succès ne s'additionnent pas, ils se composent — l'erreur n×p du chapitre 3, à une table de poker.`],
        },
        {
          intitule: en ? 'd) The fair odds of the draw' : 'd) La cote équitable du tirage',
          enonce: en
            ? `At the probability of c), what are the fair odds “for 1” of completing?`
            : `À la probabilité du c), quelle est la cote équitable « pour 1 » de toucher ?`,
          reponse: coteEq, tolerance: 0.005, unite: en ? 'for 1' : 'pour 1',
          etapes: [{
            titre: en ? 'Fair odds = 100/p' : 'Cote équitable = 100/p',
            contenu: en
              ? `100 / ${f(pToucher)} = **${f(coteEq)} for 1**: to break even, each euro at risk must return ${f(coteEq)} (stake included) when the draw hits. You have just converted a probability into a PRICE — the single most transferable gesture of the module, from bookmakers to credit spreads.`
              : `100 / ${f(pToucher)} = **${f(coteEq)} pour 1** : pour être à l'équilibre, chaque euro risqué doit rendre ${f(coteEq)} (mise comprise) quand le tirage rentre. Vous venez de convertir une probabilité en PRIX — le geste le plus transférable du module, des bookmakers aux spreads de crédit.`,
          }],
          pieges: [en
            ? `Quoting the odds AGAINST (the ${f(r2(coteEq - 1))}-to-1 of poker books): both conventions are fine, but mixing them mid-answer shifts everything by one unit — announce “for 1, stake included” and hold it.`
            : `Coter « contre » (le ${f(r2(coteEq - 1))} contre 1 des livres de poker) : les deux conventions se défendent, mais les mélanger en pleine réponse décale tout d'une unité — annoncez « pour 1, mise comprise » et tenez-le.`],
        },
        {
          intitule: en ? 'e) The odds the pot offers' : 'e) La cote que le pot offre',
          enonce: en
            ? `The pot holds ${eur(pot, 0)} and the call costs ${eur(mise, 0)}. What odds “for 1” does the pot offer (total collected if you win, per 1 staked)?`
            : `Le pot contient ${eur(pot, 0)} et le call coûte ${eur(mise, 0)}. Quelle cote « pour 1 » le pot offre-t-il (total encaissé si vous gagnez, pour 1 misé) ?`,
          reponse: coteOfferte, tolerance: 0.005, unite: en ? 'for 1' : 'pour 1',
          etapes: [{
            titre: en ? 'Pot odds = (pot + call)/call' : 'Cote du pot = (pot + call)/call',
            contenu: en
              ? `(${f(pot, 0)} + ${f(mise, 0)}) / ${f(mise, 0)} = **${f(coteOfferte)} for 1**, against a fair requirement of ${f(coteEq)}: the pot pays MORE than the draw deserves. The market is quoting you a generous price — the same reading as a bookmaker's odds above fair, or a spread wider than the PD justifies.`
              : `(${f(pot, 0)} + ${f(mise, 0)}) / ${f(mise, 0)} = **${f(coteOfferte)} pour 1**, contre une exigence équitable de ${f(coteEq)} : le pot paie PLUS que ce que le tirage mérite. Le marché vous cote un prix généreux — la même lecture qu'une cote de bookmaker au-dessus du juste, ou qu'un spread plus large que la PD ne justifie.`,
          }],
          pieges: [en
            ? `Comparing the call to the pot ALONE (${f(pot, 0)}/${f(mise, 0)} = ${f(r2(pot / mise))}): your own stake comes back when you win — forgetting it undervalues every draw at the table.`
            : `Comparer le call au pot SEUL (${f(pot, 0)}/${f(mise, 0)} = ${f(r2(pot / mise))}) : votre propre mise revient quand vous gagnez — l'oublier sous-évalue tous les tirages de la table.`],
        },
        {
          intitule: en ? 'f) The call, in euros' : 'f) Le call, en euros',
          enonce: en
            ? `What is the expectation of calling: win ${eur(pot, 0)} with the probability of c), lose ${eur(mise, 0)} otherwise, in €?`
            : `Quelle est l'espérance du call : gagner ${eur(pot, 0)} avec la probabilité du c), perdre ${eur(mise, 0)} sinon, en € ?`,
          reponse: esperanceCall, tolerance: 0.05, toleranceMode: 'absolu', unite: '€',
          etapes: [
            {
              titre: en ? 'E = p × pot − (1 − p) × call' : 'E = p × pot − (1 − p) × call',
              contenu: en
                ? `${f(pToucher)}/100 × ${f(pot, 0)} − ${f(r2(100 - pToucher))}/100 × ${f(mise, 0)} = **${eur(esperanceCall)}**. Positive: the call is right — and it stays right even when the river blanks, because the decision is graded on the price, not the outcome. Most rivers you LOSE this hand (${pct(r2(100 - pToucher))} of the time); the expectation pays across the season of Fridays.`
                : `${f(pToucher)}/100 × ${f(pot, 0)} − ${f(r2(100 - pToucher))}/100 × ${f(mise, 0)} = **${eur(esperanceCall)}**. Positive : le call est juste — et il reste juste même quand la river est blanche, parce que la décision se note au prix, pas au dénouement. La plupart des rivers, vous PERDEZ cette main (${pct(r2(100 - pToucher))} du temps) ; l'espérance paie sur la saison des vendredis.`,
            },
            {
              titre: en ? 'The oral takeaway' : 'La phrase pour l’oral',
              contenu: en
                ? `The head of desk heard exactly what he came for: count (C(47, 2) = ${f(totalCombis, 0)}), convert (${pct(pToucher)} ⇒ ${f(coteEq)} for 1), compare (${f(coteOfferte)} offered), conclude (${eur(esperanceCall)} per call). Four Cs, one method — the same four he uses on a trade.`
                : `Le chef de desk a entendu exactement ce qu'il était venu chercher : compter (C(47, 2) = ${f(totalCombis, 0)}), convertir (${pct(pToucher)} ⇒ ${f(coteEq)} pour 1), comparer (${f(coteOfferte)} offert), conclure (${eur(esperanceCall)} par call). Quatre gestes, une méthode — les mêmes quatre qu'il applique à un trade.`,
            },
          ],
          pieges: [en
            ? `Folding “because you probably lose”: true (${pct(r2(100 - pToucher))} of the time) and irrelevant — a bet is judged on expectation against price, and refusing a ${eur(esperanceCall)} edge because it usually loses is the anecdote-thinking the jury screens out.`
            : `Passer « parce que vous perdez probablement » : vrai (${pct(r2(100 - pToucher))} du temps) et hors sujet — un pari se juge à l'espérance contre le prix, et refuser un edge de ${eur(esperanceCall)} parce qu'il perd souvent est la pensée-anecdote que le jury élimine.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 18. m13-pb-18 — BOSS : le drive de l'entretien (pont m5) — N4       */
/* ------------------------------------------------------------------ */
const driveDeLEntretien: ProblemeMoule = {
  id: 'm13-pb-18', moduleId: M13,
  titre: 'BOSS — Le drive de l’entretien : du spread à la cote, et retour',
  titreEn: 'BOSS — The interview drive: from spread to odds, and back',
  typeDeCas: 'simulation d’oral (pont crédit)',
  typeDeCasEn: 'oral simulation (credit bridge)',
  difficulte: 4,
  scenarios: ['L’émetteur BBB : le jury du desk crédit sort son écran', 'Le crossover : le spread qui hésite entre deux mondes', 'Le high yield : gros spread, faible recouvrement, grosses cotes'],
  scenariosEn: ['The BBB issuer: the credit-desk jury turns his screen around', 'The crossover: the spread hesitating between two worlds', 'The high yield: big spread, low recovery, big odds'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : spread (pb), recouvrement (%), facteur de la cote
    // proposée (au-dessus ou au-dessous du juste selon le scénario), choc de spread.
    const cfg = ([
      { sMin: 180, sMax: 300, r: 40, fMin: 1.15, fMax: 1.35, chocMin: 80, chocMax: 150 },
      { sMin: 320, sMax: 480, r: 40, fMin: 0.75, fMax: 0.9, chocMin: 120, chocMax: 220 },
      { sMin: 500, sMax: 700, r: 25, fMin: 1.1, fMax: 1.25, chocMin: 150, chocMax: 300 },
    ] as const)[sIdx];
    const spread = randInt(rng, cfg.sMin, cfg.sMax);
    const recouvrement = cfg.r;
    const facteur = randFloat(rng, cfg.fMin, cfg.fMax, 2);
    const choc = randInt(rng, cfg.chocMin, cfg.chocMax);
    const miseEur = randInt(rng, 2, 10) * 100;

    const pd = r2(pdImplicitePct(spread, recouvrement));
    const coteEq = r2(coteEquitable(pd));
    const coteOff = r2(coteEq * facteur);
    const probImplCote = r2(100 / coteOff);
    const edge = r2((pd * coteOff) / 100 - 1);
    const espMise = r2(miseEur * edge);
    const spread2 = spread + choc;
    const pd2 = r2(pdImplicitePct(spread2, recouvrement));
    const coteEq2 = r2(coteEquitable(pd2));

    const { en, f, pct, eur, pb } = { ...outils(langue), pb: (v: number) => (langue === 'en' ? `${formatNombreLangue(langue, v, 0)} bp` : `${formatNombreLangue(langue, v, 0)} pb`) };
    const desc = en
      ? `an issuer trades at a spread of ${pb(spread)} over the risk-free curve; the desk convention is a recovery R = ${pct(recouvrement, 0)}; the jury offers you odds of ${f(coteOff)} for 1 that the issuer DEFAULTS within the year, and you may stake ${eur(miseEur, 0)}`
      : `un émetteur traite à un spread de ${pb(spread)} au-dessus de la courbe sans risque ; la convention du desk est un recouvrement R = ${pct(recouvrement, 0)} ; le jury vous offre une cote de ${f(coteOff)} pour 1 que l'émetteur FAIT DÉFAUT dans l'année, et vous pouvez miser ${eur(miseEur, 0)}`;
    const contexte = (en
      ? [
        `Credit-desk final. The jury member swivels his screen towards you: a live quote. “You told me you know module 5. Prove it the trader's way.” The situation: ${desc}. His grading grid is a loop: extract the probability from the spread, turn the probability into fair odds, judge his offered odds, size the bet — then close the loop out loud: a spread IS a market's betting line on default. Say that sentence and the oral changes tone.`,
        `The issuer sits in the crossover no-man's-land, and the jury plays it as an interrogation: ${desc}. “Everyone on this desk reads spreads all day without ever saying what they mean. You have five minutes to say it with numbers.” What follows is the same inversion four times: price to probability, probability to price.`,
        `High-yield desk, last round. The jury member is blunt: “big spreads make people stupid — they see income where the market prints fear. Show me you read the fear.” The file: ${desc}. Low recovery is the detail that changes every number downstream; he chose it on purpose.`,
      ]
      : [
        `Final du desk crédit. Le membre du jury pivote son écran vers vous : une cote en direct. « Vous m'avez dit connaître le module 5. Prouvez-le à la façon d'un trader. » La situation : ${desc}. Sa grille de notation est une boucle : extraire la probabilité du spread, convertir la probabilité en cote équitable, juger sa cote proposée, dimensionner la mise — puis refermer la boucle à voix haute : un spread EST la ligne de pari du marché sur le défaut. Dites cette phrase et l'oral change de ton.`,
        `L'émetteur habite le no man's land du crossover, et le jury le joue en interrogatoire : ${desc}. « Tout le monde sur ce desk lit des spreads toute la journée sans jamais dire ce qu'ils signifient. Vous avez cinq minutes pour le dire avec des chiffres. » La suite est la même inversion quatre fois : du prix à la probabilité, de la probabilité au prix.`,
        `Desk high yield, dernier tour. Le membre du jury est direct : « les gros spreads rendent bête — on y voit du rendement là où le marché imprime de la peur. Montrez-moi que vous lisez la peur. » Le dossier : ${desc}. Le faible recouvrement est le détail qui change tous les chiffres en aval ; il l'a choisi exprès.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The spread, read backwards' : 'a) Le spread, lu à l’envers',
          enonce: en
            ? `With R = ${pct(recouvrement, 0)}, what annual default probability does the ${pb(spread)} spread imply, in %?`
            : `Avec R = ${pct(recouvrement, 0)}, quelle probabilité de défaut annuelle le spread de ${pb(spread)} implique-t-il, en % ?`,
          reponse: pd, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'PD = (spread/100) / (1 − R)' : 'PD = (spread/100) / (1 − R)',
            contenu: en
              ? `(${f(spread, 0)}/100) / (1 − ${f(recouvrement, 0)}/100) = **${pct(pd)}** a year — the m5 inversion: the spread compensates the LOSS given default, so dividing by LGD recovers the probability. Mind its nature: a RISK-NEUTRAL probability, above the historical frequency, because the spread also pays risk and liquidity premia. The market prices its fear, not its forecast.`
              : `(${f(spread, 0)}/100) / (1 − ${f(recouvrement, 0)}/100) = **${pct(pd)}** par an — l'inversion du m5 : le spread rémunère la PERTE en cas de défaut, donc diviser par la LGD retrouve la probabilité. Attention à sa nature : une probabilité RISQUE-NEUTRE, au-dessus de la fréquence historique, parce que le spread paie aussi des primes de risque et de liquidité. Le marché price sa peur, pas sa prévision.`,
          }],
          pieges: [en
            ? `Dividing by R instead of LGD (giving ${pct(r2((spread / 100) / (recouvrement / 100)))}): the spread pays for the ${pct(100 - recouvrement, 0)} you LOSE, not the ${pct(recouvrement, 0)} you recover — the classic inversion, deadlier here because R = ${pct(recouvrement, 0)} ${recouvrement < 40 ? 'is low and the gap is huge' : 'sits near the middle'}.`
            : `Diviser par R au lieu de la LGD (ce qui donne ${pct(r2((spread / 100) / (recouvrement / 100)))}) : le spread paie les ${pct(100 - recouvrement, 0)} que vous PERDEZ, pas les ${pct(recouvrement, 0)} que vous récupérez — l'inversion classique, plus meurtrière ici car R = ${pct(recouvrement, 0)} ${recouvrement < 40 ? 'est bas et l’écart est énorme' : 'est proche du milieu'}.`],
        },
        {
          intitule: en ? 'b) The fair odds of the default bet' : 'b) La cote équitable du pari de défaut',
          enonce: en
            ? `At the implied PD of a), what are the fair odds “for 1” on a default within the year?`
            : `À la PD implicite du a), quelle est la cote équitable « pour 1 » sur un défaut dans l'année ?`,
          reponse: coteEq, tolerance: 0.005, unite: en ? 'for 1' : 'pour 1',
          etapes: [{
            titre: en ? 'Fair odds = 100/PD' : 'Cote équitable = 100/PD',
            contenu: en
              ? `100 / ${f(pd)} = **${f(coteEq)} for 1**. Read what you just did: the spread became a probability (a), the probability became a price (b) — a credit spread and a bookmaker's line are the SAME object in two dialects. That is the loop the jury wants closed, and you are halfway around it.`
              : `100 / ${f(pd)} = **${f(coteEq)} pour 1**. Relisez ce que vous venez de faire : le spread est devenu une probabilité (a), la probabilité est devenue un prix (b) — un spread de crédit et une ligne de bookmaker sont le MÊME objet en deux dialectes. C'est la boucle que le jury veut voir refermée, et vous en êtes à mi-chemin.`,
          }],
          pieges: [en
            ? `Feeding the formula the spread instead of the PD (100/${f(spread, 0)} = ${f(r2(100 / spread))}): odds price a PROBABILITY — the spread must pass through the LGD division first.`
            : `Donner à la formule le spread au lieu de la PD (100/${f(spread, 0)} = ${f(r2(100 / spread))}) : une cote price une PROBABILITÉ — le spread doit d'abord passer par la division par la LGD.`],
        },
        {
          intitule: en ? 'c) The jury’s odds, read backwards' : 'c) La cote du jury, lue à l’envers',
          enonce: en
            ? `What default probability do the OFFERED odds of ${f(coteOff)} for 1 actually price, in %?`
            : `Quelle probabilité de défaut la cote PROPOSÉE de ${f(coteOff)} pour 1 price-t-elle réellement, en % ?`,
          reponse: probImplCote, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'Implied probability = 100/odds' : 'Probabilité implicite = 100/cote',
            contenu: en
              ? `100 / ${f(coteOff)} = **${pct(probImplCote)}**, against ${pct(pd)} implied by the spread. ${probImplCote < pd ? 'The jury prices the default CHEAPER than the market does: his odds pay more than the spread says they should.' : 'The jury prices the default DEARER than the market does: his odds pay less than the spread justifies.'} Two prices for one event — and where two prices disagree, one of them is your counterparty's mistake.`
              : `100 / ${f(coteOff)} = **${pct(probImplCote)}**, contre ${pct(pd)} implicites dans le spread. ${probImplCote < pd ? 'Le jury price le défaut MOINS CHER que le marché : sa cote paie plus que ce que le spread commande.' : 'Le jury price le défaut PLUS CHER que le marché : sa cote paie moins que ce que le spread justifie.'} Deux prix pour un même événement — et là où deux prix divergent, l'un des deux est l'erreur de votre contrepartie.`,
          }],
          pieges: [en
            ? `Treating ${pct(probImplCote)} and ${pct(pd)} as “close enough”: the gap between them IS the trade — desks are paid precisely for gaps that look small to everyone else.`
            : `Traiter ${pct(probImplCote)} et ${pct(pd)} comme « à peu près pareils » : l'écart entre les deux EST le trade — les desks sont payés précisément pour les écarts qui semblent petits à tous les autres.`],
        },
        {
          intitule: en ? 'd) The edge per euro' : 'd) L’edge par euro',
          enonce: en
            ? `Taking the spread's PD of a) as the true probability, what is the expectation per 1 € staked on default at ${f(coteOff)} for 1, in €?`
            : `En prenant la PD du spread du a) comme probabilité vraie, quelle est l'espérance pour 1 € misé sur le défaut à ${f(coteOff)} pour 1, en € ?`,
          reponse: edge, tolerance: 0.02, toleranceMode: 'absolu', unite: en ? '€ per € staked' : '€ par € misé',
          etapes: [{
            titre: en ? 'Edge = PD × odds − 1' : 'Edge = PD × cote − 1',
            contenu: en
              ? `${f(pd)}/100 × ${f(coteOff)} − 1 = **${eur(edge)}** per euro staked. ${edge > 0 ? 'Positive: you take the bet — the jury underprices the default relative to his own market.' : 'Negative: you decline — politely, with the number, the way one declines a bad quote.'} Note the honesty clause said out loud: “taking the spread's PD as true” is an assumption — the spread is risk-neutral and fear-laden, and saying so is part of the answer.`
              : `${f(pd)}/100 × ${f(coteOff)} − 1 = **${eur(edge)}** par euro misé. ${edge > 0 ? 'Positif : vous prenez le pari — le jury sous-price le défaut par rapport à son propre marché.' : 'Négatif : vous déclinez — poliment, chiffre à l’appui, comme on décline une mauvaise cote.'} Notez la clause d'honnêteté dite à voix haute : « prendre la PD du spread pour vraie » est une hypothèse — le spread est risque-neutre et chargé de peur, et le dire fait partie de la réponse.`,
          }],
          pieges: [en
            ? `Forgetting the −1 (${f(r2((pd * coteOff) / 100))} instead of ${f(edge)}): the stake is gone whatever happens — payout expectation is not profit expectation, at a betting window or on a CDS.`
            : `Oublier le −1 (${f(r2((pd * coteOff) / 100))} au lieu de ${f(edge)}) : la mise est partie quoi qu'il arrive — l'espérance du versement n'est pas celle du gain, au guichet des paris comme sur un CDS.`],
        },
        {
          intitule: en ? 'e) The stake, in euros' : 'e) La mise, en euros',
          enonce: en
            ? `On the allowed ${eur(miseEur, 0)} stake, what is the expected profit or loss, in €?`
            : `Sur la mise autorisée de ${eur(miseEur, 0)}, quel est le gain ou la perte attendu, en € ?`,
          reponse: espMise, tolerance: 0.05, unite: '€',
          etapes: [{
            titre: en ? 'Expectation scales with size' : 'L’espérance suit la taille',
            contenu: en
              ? `${f(miseEur, 0)} × ${f(edge)} = **${eur(espMise)}**. ${edge > 0 ? `An expectation carried by an event of probability ${pct(pd)}: most years the bet simply loses ${eur(miseEur, 0)} — the edge only exists across repetitions and small sizing.` : `The number that justifies the polite refusal: at this price, every euro staked burns ${eur(r2(-edge))} in expectation.`} Selling protection without pricing it is how AIG died (m11); buying bets without pricing them is the retail version of the same funeral.`
              : `${f(miseEur, 0)} × ${f(edge)} = **${eur(espMise)}**. ${edge > 0 ? `Une espérance portée par un événement de probabilité ${pct(pd)} : la plupart des années, le pari perd simplement ${eur(miseEur, 0)} — l'edge n'existe qu'à travers la répétition et la petite taille.` : `Le chiffre qui justifie le refus poli : à ce prix, chaque euro misé brûle ${eur(r2(-edge))} en espérance.`} Vendre de la protection sans la pricer a tué AIG (m11) ; acheter des paris sans les pricer est la version particulier du même enterrement.`,
          }],
          pieges: [en
            ? `Sizing on conviction instead of on the worst case: ${edge > 0 ? `the bet loses whole with probability ${pct(r2(100 - pd))}` : `there is nothing to size — a negative edge scales into a bigger loss`} — position size answers to survival, not to enthusiasm (m12).`
            : `Dimensionner à la conviction au lieu du pire cas : ${edge > 0 ? `le pari perd en totalité avec probabilité ${pct(r2(100 - pd))}` : `il n'y a rien à dimensionner — un edge négatif ne fait que grossir la perte`} — la taille d'une position répond à la survie, pas à l'enthousiasme (m12).`],
        },
        {
          intitule: en ? 'f) The loop, closed: the spread moves' : 'f) La boucle, refermée : le spread bouge',
          enonce: en
            ? `Bad news: the spread widens to ${pb(spread2)}. What is the NEW fair odds “for 1” on default (same R)?`
            : `Mauvaise nouvelle : le spread s'écarte à ${pb(spread2)}. Quelle est la NOUVELLE cote équitable « pour 1 » sur le défaut (même R) ?`,
          reponse: coteEq2, tolerance: 0.005, unite: en ? 'for 1' : 'pour 1',
          etapes: [
            {
              titre: en ? 'Rerun the loop: spread → PD → odds' : 'Rejouer la boucle : spread → PD → cote',
              contenu: en
                ? `New PD = (${f(spread2, 0)}/100)/(1 − ${f(recouvrement, 0)}/100) = ${pct(pd2)}, hence odds = 100/${f(pd2)} = **${f(coteEq2)} for 1** (against ${f(coteEq)} before). The spread widened, the priced default probability rose, the fair odds on default FELL: three sentences, one movement — the loop runs in both directions, and running it fast is the skill.`
                : `Nouvelle PD = (${f(spread2, 0)}/100)/(1 − ${f(recouvrement, 0)}/100) = ${pct(pd2)}, d'où cote = 100/${f(pd2)} = **${f(coteEq2)} pour 1** (contre ${f(coteEq)} avant). Le spread s'écarte, la probabilité de défaut pricée monte, la cote équitable sur le défaut BAISSE : trois phrases, un seul mouvement — la boucle tourne dans les deux sens, et la faire tourner vite est la compétence.`,
            },
            {
              titre: en ? 'The oral takeaway' : 'La phrase pour l’oral',
              contenu: en
                ? `Close as the jury hoped: “a spread is the market's betting line on default — ${pb(spread)} at R = ${pct(recouvrement, 0)} means ${pct(pd)} a year, fair odds of ${f(coteEq)} for 1; quote me either one and I will give you the other.” One sentence, both dialects, and module 5 audibly belongs to you.`
                : `Refermez comme le jury l'espérait : « un spread est la ligne de pari du marché sur le défaut — ${pb(spread)} à R = ${pct(recouvrement, 0)}, c'est ${pct(pd)} par an, une cote équitable de ${f(coteEq)} pour 1 ; cotez-moi l'un et je vous rends l'autre. » Une phrase, les deux dialectes, et le module 5 vous appartient à voix haute.`,
            },
          ],
          pieges: [en
            ? `Expecting the odds to RISE with the risk: odds are an inverse price — more probable means shorter odds (${f(coteEq2)} < ${f(coteEq)}), exactly like a bond price falling as its yield rises (m4).`
            : `Attendre que la cote MONTE avec le risque : une cote est un prix inverse — plus probable signifie cote plus courte (${f(coteEq2)} < ${f(coteEq)}), exactement comme un prix d'obligation qui baisse quand son rendement monte (m4).`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 19. m13-pb-19 — BOSS : la VaR au tableau (pont m12) — N4            */
/* ------------------------------------------------------------------ */
const varAuTableau: ProblemeMoule = {
  id: 'm13-pb-19', moduleId: M13,
  titre: 'BOSS — La VaR au tableau : le portefeuille dicté, la craie à la main',
  titreEn: 'BOSS — VaR at the whiteboard: the dictated portfolio, chalk in hand',
  typeDeCas: 'simulation d’oral (pont risques)',
  typeDeCasEn: 'oral simulation (risk bridge)',
  difficulte: 4,
  scenarios: ['Le book actions : la vol de tête et la craie', 'Le book obligataire : petite vol, gros notionnel', 'Le book volatil du dernier tour : « et si la vol double ? »'],
  scenariosEn: ['The equity book: headline vol and chalk', 'The bond book: small vol, big notional', 'The volatile final-round book: “and if vol doubles?”'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : valeur du book (millions), vol annuelle (%).
    const cfg = ([
      { vMin: 80, vMax: 150, volMin: 18, volMax: 30 },
      { vMin: 200, vMax: 400, volMin: 4, volMax: 7 },
      { vMin: 50, vMax: 120, volMin: 25, volMax: 40 },
    ] as const)[sIdx];
    const valeur = randInt(rng, cfg.vMin, cfg.vMax);
    const vol = randInt(rng, cfg.volMin, cfg.volMax);
    const z95 = 1.65;
    const z99 = 2.33;

    const var1j = r2(varParametrique(valeur, vol, z95, 1));
    const pctValeur = r2((100 * var1j) / valeur);
    const depassements = 12.6; // 252 × 5 %
    const var10j = r2(var1j * Math.sqrt(10));
    const varVolDouble = r2(2 * var1j);
    const var99 = r2((var1j * z99) / z95);

    const { en, f, pct } = outils(langue);
    const m = (v: number, d = 2) => (en ? `€${f(v, d)}m` : `${f(v, d)} M€`);
    const desc = en
      ? `book value ${m(valeur, 0)}, annualised volatility ${pct(vol, 0)}, 95% confidence (z = 1.65), 252 trading days, √252 ≈ 16 for the mental version`
      : `valeur du book ${m(valeur, 0)}, volatilité annualisée ${pct(vol, 0)}, confiance 95 % (z = 1,65), 252 jours de bourse, √252 ≈ 16 pour la version mentale`;
    const contexte = (en
      ? [
        `The jury member hands you the chalk and dictates, slowly, watching you write: “${desc}. One-day VaR — in your head first, exact second.” Then he sits back: he has four follow-ups loaded (the % of the book, the exceedances per year, the 10-day figure, and his favourite: “if vol doubles?”), and chapter 7's whiteboard discipline is being graded as hard as the numbers: data down first, big writing, spoken as you go.`,
        `Risk-desk interview, the bond book: “${desc}. Small vol, big notional — people mis-rank those risks all day. Rank this one.” The dictated-portfolio drill from module 12, at the board, with the jury deliberately choosing numbers you can hold in your head.`,
        `Final round, the book chosen to sting: “${desc}. VaR, exceedances, horizon, and then a stress: vol doubles overnight. Go.” He wants the arithmetic AND the two disclaimers that keep it honest — the threshold-not-the-loss-beyond, and the model that dies exactly when needed.`,
      ]
      : [
        `Le membre du jury vous tend la craie et dicte, lentement, en vous regardant écrire : « ${desc}. VaR un jour — de tête d'abord, exacte ensuite. » Puis il se cale : il a quatre relances chargées (le % du book, les dépassements par an, le chiffre 10 jours, et sa préférée : « si la vol double ? »), et la discipline de tableau du chapitre 7 est notée aussi dur que les chiffres : les données posées d'abord, écrire gros, commenter à mesure.`,
        `Entretien desk risques, le book obligataire : « ${desc}. Petite vol, gros notionnel — les gens classent mal ces risques-là toute la journée. Classez celui-ci. » L'exercice du portefeuille dicté du module 12, au tableau, avec un jury qui choisit exprès des nombres tenables de tête.`,
        `Dernier tour, le book choisi pour piquer : « ${desc}. VaR, dépassements, horizon, puis un stress : la vol double dans la nuit. Allez-y. » Il veut l'arithmétique ET les deux réserves qui la gardent honnête — le seuil-pas-la-perte-au-delà, et le modèle qui meurt exactement quand on en a besoin.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The headline figure: one-day VaR' : 'a) Le chiffre de tête : la VaR un jour',
          enonce: en
            ? `What is the one-day 95% parametric VaR of the book (V × z × σ × √(1/252)), in €m?`
            : `Quelle est la VaR paramétrique 95 % à un jour du book (V × z × σ × √(1/252)), en M€ ?`,
          reponse: var1j, tolerance: 0.05, unite: en ? '€m' : 'M€',
          etapes: [{
            titre: en ? 'Mental version: V × z × σ / 16' : 'Version mentale : V × z × σ / 16',
            contenu: en
              ? `${f(valeur, 0)} × 1.65 × ${f(vol, 0)}%/16 ≈ **${m(var1j)}** (exact: √(1/252)). Out loud, the desk sentence that shows you read the number: “we should not lose more than ${m(var1j)} in a day, 19 days out of 20.” The anchor to cross-check: VaR(100, 20%, 1.65, 1d) ≈ 2.08m — your figure must scale from it.`
              : `${f(valeur, 0)} × 1,65 × ${f(vol, 0)} %/16 ≈ **${m(var1j)}** (exact : √(1/252)). À voix haute, la phrase de desk qui montre que vous lisez le chiffre : « on ne devrait pas perdre plus de ${m(var1j)} en un jour, 19 jours sur 20. » L'ancre de recoupement : VaR(100, 20 %, 1,65, 1 j) ≈ 2,08 M — votre chiffre doit s'en déduire à l'échelle.`,
          }],
          pieges: [en
            ? `Forgetting the √(1/252) and quoting the ANNUAL shock ${f(valeur, 0)} × 1.65 × ${f(vol, 0)}% = ${m(r2(valeur * z95 * vol / 100), 1)}: a 16× error the jury spots before your chalk stops moving — the vol is annual, the horizon is a day.`
            : `Oublier le √(1/252) et annoncer le choc ANNUEL ${f(valeur, 0)} × 1,65 × ${f(vol, 0)} % = ${m(r2(valeur * z95 * vol / 100), 1)} : une erreur ×16 que le jury repère avant que votre craie ne s'arrête — la vol est annuelle, l'horizon est un jour.`],
        },
        {
          intitule: en ? 'b) The order of magnitude: in % of the book' : 'b) L’ordre de grandeur : en % du book',
          enonce: en
            ? `What does that VaR represent as a % of the book's value?`
            : `Que représente cette VaR en % de la valeur du book ?`,
          reponse: pctValeur, tolerance: 0.02, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'VaR / V — the sanity check' : 'VaR / V — le recoupement',
            contenu: en
              ? `${f(var1j)} / ${f(valeur, 0)} × 100 = **${pct(pctValeur)}** of the book per day at 95%. The number that lets you RANK books across desks: ${vol >= 15 ? 'an equity-like book loses about 1-3% on a bad day' : 'a rates book breathes in tenths of a percent'} — if your a) had landed outside that range, this line would have caught it. Always compute the ratio; it is the error detector.`
              : `${f(var1j)} / ${f(valeur, 0)} × 100 = **${pct(pctValeur)}** du book par jour à 95 %. Le nombre qui permet de CLASSER les books entre desks : ${vol >= 15 ? 'un book type actions perd environ 1-3 % un mauvais jour' : 'un book de taux respire en dixièmes de pour cent'} — si votre a) était tombé hors de cette plage, cette ligne l'aurait attrapé. Calculez toujours le ratio ; c'est le détecteur d'erreur.`,
          }],
          pieges: [en
            ? `Skipping this step: a VaR in euros without its % of book is a number without a size — the jury cannot tell whether YOU can tell if it is big.`
            : `Sauter cette étape : une VaR en euros sans son % du book est un nombre sans taille — le jury ne peut pas savoir si VOUS savez s'il est gros.`],
        },
        {
          intitule: en ? 'c) The definition, tested: exceedances per year' : 'c) La définition, testée : les dépassements par an',
          enonce: en
            ? `If the model is right, how many days per year (252 trading days) should the loss EXCEED the 95% VaR?`
            : `Si le modèle est juste, combien de jours par an (252 jours de bourse) la perte devrait-elle DÉPASSER la VaR 95 % ?`,
          reponse: depassements, tolerance: 0.1, toleranceMode: 'absolu', unite: en ? 'days/year' : 'jours/an',
          etapes: [{
            titre: en ? '252 × 5%' : '252 × 5 %',
            contenu: en
              ? `252 × 5% = **12.6 days a year** — about one a month. The double edge to state: too MANY exceedances and the model understates risk; too FEW and it overstates (capital sleeping idle). And the founding limit of chapter 5 (m12): the VaR says the threshold, NEVER the loss beyond it — 12.6 times a year you lose more, and the model does not say how much more.`
              : `252 × 5 % = **12,6 jours par an** — environ un par mois. Le double tranchant à énoncer : trop de dépassements et le modèle sous-estime le risque ; trop PEU et il le surestime (du capital qui dort). Et la limite fondatrice du chapitre 5 (m12) : la VaR dit le seuil, JAMAIS la perte au-delà — 12,6 fois par an vous perdez plus, et le modèle ne dit pas combien de plus.`,
          }],
          pieges: [en
            ? `Reading 95% as “safe 95% of the time, so exceedances are anomalies”: exceedances are part of the CONTRACT — a year with zero of them is as suspicious as a year with thirty.`
            : `Lire 95 % comme « sûr 95 % du temps, donc les dépassements sont des anomalies » : les dépassements font partie du CONTRAT — une année à zéro dépassement est aussi suspecte qu'une année à trente.`],
        },
        {
          intitule: en ? 'd) The horizon: ten days' : 'd) L’horizon : dix jours',
          enonce: en
            ? `Using the √t rule on your a), what is the 10-day 95% VaR, in €m?`
            : `Par la règle en √t sur votre a), quelle est la VaR 95 % à 10 jours, en M€ ?`,
          reponse: var10j, tolerance: 0.02, unite: en ? '€m' : 'M€',
          etapes: [{
            titre: en ? 'VaR_h = VaR_1d × √h' : 'VaR_h = VaR_1j × √h',
            contenu: en
              ? `${f(var1j)} × √10 ≈ ${f(var1j)} × 3.16 = **${m(var10j)}** — the historical Basel convention. State its hypothesis while the chalk writes: i.i.d. returns, no autocorrelation — an assumption that breaks PRECISELY in crises, when losses feed on themselves (m11). Ten days of 2008 were not √10 times one day of 2008.`
              : `${f(var1j)} × √10 ≈ ${f(var1j)} × 3,16 = **${m(var10j)}** — la convention réglementaire historique de Bâle. Énoncez son hypothèse pendant que la craie écrit : rendements i.i.d., pas d'autocorrélation — une hypothèse qui casse PRÉCISÉMENT en crise, quand les pertes s'auto-entretiennent (m11). Dix jours de 2008 ne valaient pas √10 fois un jour de 2008.`,
          }],
          pieges: [en
            ? `Multiplying by 10 (${m(r2(var1j * 10), 1)}): risks add in VARIANCE, not in standard deviation — time scales the σ by √t, the same square root as everywhere in the course.`
            : `Multiplier par 10 (${m(r2(var1j * 10), 1)}) : les risques s'additionnent en VARIANCE, pas en écart-type — le temps met la σ à l'échelle en √t, la même racine carrée que partout dans le cours.`],
        },
        {
          intitule: en ? 'e) The stress: “and if vol doubles?”' : 'e) Le stress : « et si la vol double ? »',
          enonce: en
            ? `Vol jumps from ${pct(vol, 0)} to ${pct(2 * vol, 0)} overnight. What is the new one-day 95% VaR, in €m?`
            : `La vol saute de ${pct(vol, 0)} à ${pct(2 * vol, 0)} dans la nuit. Quelle est la nouvelle VaR 95 % à un jour, en M€ ?`,
          reponse: varVolDouble, tolerance: 0.02, unite: en ? '€m' : 'M€',
          etapes: [{
            titre: en ? 'VaR is LINEAR in σ' : 'La VaR est LINÉAIRE en σ',
            contenu: en
              ? `2 × ${f(var1j)} = **${m(varVolDouble)}** — no recomputation needed, and saying WHY is the point: σ enters the formula once, multiplicatively, so the whole risk figure scales with it. The jury's real question hides underneath: your risk limit was calibrated on ${m(var1j)}; overnight the same book consumes twice the budget — who cuts what by morning?`
              : `2 × ${f(var1j)} = **${m(varVolDouble)}** — aucun recalcul nécessaire, et dire POURQUOI est le point : σ entre une fois dans la formule, multiplicativement, donc tout le chiffre de risque suit à l'échelle. La vraie question du jury se cache dessous : votre limite de risque était calibrée sur ${m(var1j)} ; du jour au lendemain le même book consomme deux fois le budget — qui coupe quoi avant le matin ?`,
          }],
          pieges: [en
            ? `Recomputing from scratch and losing thirty seconds: spotting the linearity IS the answer — the candidate who rebuilds the formula shows arithmetic, the one who doubles shows understanding.`
            : `Recalculer de zéro et perdre trente secondes : repérer la linéarité EST la réponse — le candidat qui reconstruit la formule montre de l'arithmétique, celui qui double montre de la compréhension.`],
        },
        {
          intitule: en ? 'f) The last rung: 99%' : 'f) Le dernier barreau : 99 %',
          enonce: en
            ? `Back to the original vol: convert your a) to a 99% VaR (z = 2.33 instead of 1.65), in €m.`
            : `Retour à la vol d'origine : convertissez votre a) en VaR 99 % (z = 2,33 au lieu de 1,65), en M€.`,
          reponse: var99, tolerance: 0.02, unite: en ? '€m' : 'M€',
          etapes: [
            {
              titre: en ? 'Scale by z₉₉/z₉₅' : 'Mettre à l’échelle par z₉₉/z₉₅',
              contenu: en
                ? `${f(var1j)} × 2.33/1.65 = **${m(var99)}** — a ratio of ${f(r2(z99 / z95))}, again without recomputing. The counterpart to say: at 99%, exceedances drop to 252 × 1% ≈ 2.5 days a year — a higher threshold, crossed more rarely, and even less informative about the size of the disaster beyond. Confidence buys you rarity, never a ceiling.`
                : `${f(var1j)} × 2,33/1,65 = **${m(var99)}** — un rapport de ${f(r2(z99 / z95))}, encore sans recalcul. La contrepartie à dire : à 99 %, les dépassements tombent à 252 × 1 % ≈ 2,5 jours par an — un seuil plus haut, franchi plus rarement, et encore moins bavard sur la taille du désastre au-delà. La confiance achète de la rareté, jamais un plafond.`,
            },
            {
              titre: en ? 'The oral takeaway' : 'La phrase pour l’oral',
              contenu: en
                ? `The board, read top to bottom, is the answer: ${m(var1j)} a day (${pct(pctValeur)} of the book), exceeded ~12.6 days a year; ${m(var10j)} over ten days IF returns are i.i.d.; linear in vol (×2 ⇒ ${m(varVolDouble)}); ${m(var99)} at 99%. Five numbers, two disclaimers, zero recomputation — that is what module 12 sounds like when it is owned.`
                : `Le tableau, lu de haut en bas, est la réponse : ${m(var1j)} par jour (${pct(pctValeur)} du book), dépassée ~12,6 jours par an ; ${m(var10j)} sur dix jours SI les rendements sont i.i.d. ; linéaire en vol (×2 ⇒ ${m(varVolDouble)}) ; ${m(var99)} à 99 %. Cinq nombres, deux réserves, zéro recalcul — voilà le son du module 12 quand il est possédé.`,
            },
          ],
          pieges: [en
            ? `Presenting the 99% figure as “the worst case”: it is a QUANTILE, not a maximum — the 2.5 yearly exceedances live beyond it, unbounded by the model. Selling a VaR as a ceiling is the exact confusion that made 2008 expensive (m11).`
            : `Présenter le chiffre 99 % comme « le pire cas » : c'est un QUANTILE, pas un maximum — les 2,5 dépassements annuels vivent au-delà, non bornés par le modèle. Vendre une VaR comme un plafond est la confusion exacte qui a rendu 2008 coûteux (m11).`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 20. m13-pb-20 — BOSS : les trois portes et le contrat — N4          */
/* ------------------------------------------------------------------ */
const troisPortesEtLeContrat: ProblemeMoule = {
  id: 'm13-pb-20', moduleId: M13,
  titre: 'BOSS — Les trois portes et le contrat : Monty Hall, pricé puis piégé',
  titreEn: 'BOSS — Three doors and the contract: Monty Hall, priced then twisted',
  typeDeCas: 'simulation d’oral',
  typeDeCasEn: 'oral simulation',
  difficulte: 4,
  scenarios: ['Le contrat derrière la porte : le jury joue l’animateur', 'Les trois enveloppes du desk : le bonus caché', 'La variante qui tue : l’animateur ne savait pas'],
  scenariosEn: ['The contract behind the door: the jury plays the host', 'The desk’s three envelopes: the hidden bonus', 'The killer variant: the host did not know'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : le gain (multiple de 300 pour des tiers exacts).
    const cfg = ([
      { gMin: 10, gMax: 20 },
      { gMin: 20, gMax: 40 },
      { gMin: 12, gMax: 30 },
    ] as const)[sIdx];
    const gain = 300 * randInt(rng, cfg.gMin, cfg.gMax);

    const pRester = r2(100 / 3);
    const pChanger = r2(200 / 3);
    const eChanger = r2((gain * 2) / 3);
    const valeurDroit = r2(gain / 3);
    const pRevele = r2(100 / 3);
    const pCondIgnorant = 50;

    const { en, f, pct, eur } = outils(langue);
    const prix = (en ? ['a signing bonus of', 'a hidden bonus of', 'a prize of'] : ['une prime de signature de', 'un bonus caché de', 'un lot de'])[sIdx];
    const desc = en
      ? `three doors, ${prix} ${eur(gain, 0)} behind exactly one, nothing behind the other two; you pick a door; the host opens one of the two others and reveals it empty, then offers you the switch`
      : `trois portes, ${prix} ${eur(gain, 0)} derrière exactement une, rien derrière les deux autres ; vous choisissez une porte ; l'animateur ouvre une des deux autres et la révèle vide, puis vous offre l'échange`;
    const contexte = (en
      ? [
        `End of the assessment day, and the jury turns game-show host — three doors drawn on the whiteboard: “${desc}. And because this is a desk, we do not vote, we PRICE.” He wants five numbers in a row, then springs his trap: what changes if a colleague who did NOT know opened the door instead. Chapter 3's verdict — who knows what is the whole game — is about to be worth ${eur(gain, 0)}.`,
        `The desk's end-of-year ritual: three envelopes, ${prix} ${eur(gain, 0)} in one. The head of desk plays the KNOWING host: “${desc}.” Around the table, half the desk shouts fifty-fifty — your job is to price the switch, price the RIGHT to switch, and then survive the variant he keeps for candidates who look too comfortable.`,
        `The jury member announces the trap up front, which makes it worse: “${desc}. First the classic. THEN I replace myself with an intern who opens a random door — it happens to be empty — and you tell me what survives of your reasoning.” Two games that look identical door for door, and the whole answer is in the difference.`,
      ]
      : [
        `Fin de journée d'évaluation, et le jury se fait animateur de jeu télévisé — trois portes dessinées au tableau : « ${desc}. Et comme on est sur un desk, on ne vote pas, on PRICE. » Il veut cinq nombres d'affilée, puis dégoupille son piège : ce qui change si un collègue qui ne savait PAS a ouvert la porte à la place. Le verdict du chapitre 3 — qui sait quoi est tout le jeu — est sur le point de valoir ${eur(gain, 0)}.`,
        `Le rituel de fin d'année du desk : trois enveloppes, ${prix} ${eur(gain, 0)} dans une seule. Le chef de desk joue l'animateur QUI SAIT : « ${desc}. » Autour de la table, la moitié du desk crie au cinquante-cinquante — votre travail est de pricer l'échange, de pricer le DROIT d'échanger, puis de survivre à la variante qu'il réserve aux candidats trop à l'aise.`,
        `Le membre du jury annonce le piège d'entrée, ce qui l'aggrave : « ${desc}. D'abord le classique. PUIS je me remplace par un stagiaire qui ouvre une porte au hasard — elle se trouve être vide — et vous me dites ce qui survit de votre raisonnement. » Deux jeux identiques porte à porte, et toute la réponse est dans la différence.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) Staying: the probability that does not move' : 'a) Rester : la probabilité qui ne bouge pas',
          enonce: en
            ? `The knowing host has opened an empty door. If you STAY on your initial door, what is your probability of winning, in %?`
            : `L'animateur qui sait a ouvert une porte vide. Si vous RESTEZ sur votre porte initiale, quelle est votre probabilité de gagner, en % ?`,
          reponse: pRester, tolerance: 0.02, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Your door was 1/3 and nothing he did could change it' : 'Votre porte valait 1/3 et rien de ce qu’il a fait ne pouvait le changer',
            contenu: en
              ? `**${pct(pRester)}** (1/3). The clean argument: the host opens an empty door WHATEVER you initially picked — his gesture was certain, so it carries no information about YOUR door. An event that happens with probability 1 under every hypothesis updates nothing (chapter 3, said with Bayes or without).`
              : `**${pct(pRester)}** (1/3). L'argument propre : l'animateur ouvre une porte vide QUEL QUE SOIT votre choix initial — son geste était certain, il ne porte donc aucune information sur VOTRE porte. Un événement qui arrive avec probabilité 1 sous toutes les hypothèses ne met rien à jour (chapitre 3, avec Bayes ou sans).`,
          }],
          pieges: [en
            ? `“Two doors left, so 50/50”: counting doors instead of tracking information — the two remaining doors were NOT born equal: one was picked blind, the other survived a filter that knew where the prize was.`
            : `« Deux portes restantes, donc 50/50 » : compter les portes au lieu de suivre l'information — les deux portes restantes ne sont PAS nées égales : l'une a été choisie à l'aveugle, l'autre a survécu à un filtre qui savait où était le lot.`],
        },
        {
          intitule: en ? 'b) Switching: where the two thirds went' : 'b) Changer : où sont passés les deux tiers',
          enonce: en
            ? `If you SWITCH to the remaining closed door, what is your probability of winning, in %?`
            : `Si vous CHANGEZ pour la porte fermée restante, quelle est votre probabilité de gagner, en % ?`,
          reponse: pChanger, tolerance: 0.02, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The constrained gesture concentrates the probability' : 'Le geste contraint concentre la probabilité',
            contenu: en
              ? `**${pct(pChanger)}** (2/3). The 2/3 that sat on “one of the two other doors” had nowhere to go: the host, FORCED by his knowledge to open an empty one, funnelled it all onto the door he spared. Bayes states it in one line: P(open 3 | prize in 2) = 1 against P(open 3 | prize in 1) = 1/2 — the gesture is twice as likely when the prize is behind the other door.`
              : `**${pct(pChanger)}** (2/3). Les 2/3 posés sur « une des deux autres portes » n'avaient nulle part où aller : l'animateur, FORCÉ par sa connaissance d'ouvrir une vide, les a entonnés tout entiers sur la porte qu'il a épargnée. Bayes le dit en une ligne : P(ouvre 3 | lot en 2) = 1 contre P(ouvre 3 | lot en 1) = 1/2 — le geste est deux fois plus probable quand le lot est derrière l'autre porte.`,
          }],
          pieges: [en
            ? `Conceding “switching helps a bit, maybe 55/45”: the move is not marginal, it DOUBLES your chances (1/3 → 2/3) — hedging the answer out of caution reads as not owning the argument.`
            : `Concéder « changer aide un peu, 55/45 peut-être » : le geste n'est pas marginal, il DOUBLE vos chances (1/3 → 2/3) — édulcorer la réponse par prudence se lit comme ne pas posséder l'argument.`],
        },
        {
          intitule: en ? 'c) The desk reflex: price the switch' : 'c) Le réflexe desk : pricer l’échange',
          enonce: en
            ? `With ${eur(gain, 0)} behind the winning door, what is the expected value of playing the SWITCH strategy, in €?`
            : `Avec ${eur(gain, 0)} derrière la bonne porte, quelle est l'espérance de la stratégie CHANGER, en € ?`,
          reponse: eChanger, tolerance: 0.02, unite: '€',
          etapes: [{
            titre: en ? 'E = 2/3 × prize' : 'E = 2/3 × lot',
            contenu: en
              ? `2/3 × ${f(gain, 0)} = **${eur(eChanger)}**, against 1/3 × ${f(gain, 0)} = ${eur(r2(gain / 3))} for staying. The jury's “we PRICE” is the whole pedagogy: a probability argument becomes irrefutable when it becomes a price — nobody argues with a valuation gap of ${eur(r2(gain / 3))}.`
              : `2/3 × ${f(gain, 0)} = **${eur(eChanger)}**, contre 1/3 × ${f(gain, 0)} = ${eur(r2(gain / 3))} en restant. Le « on PRICE » du jury est toute la pédagogie : un argument de probabilité devient irréfutable quand il devient un prix — personne ne discute un écart de valorisation de ${eur(r2(gain / 3))}.`,
          }],
          pieges: [en
            ? `Pricing the strategy at 50% “to be safe” (${eur(r2(gain / 2))}): a wrong probability does not become right by being cautious — it just misprices the game by ${eur(r2(gain * 2 / 3 - gain / 2))}.`
            : `Pricer la stratégie à 50 % « par sécurité » (${eur(r2(gain / 2))}) : une probabilité fausse ne devient pas juste en étant prudente — elle mal-price simplement le jeu de ${eur(r2(gain * 2 / 3 - gain / 2))}.`],
        },
        {
          intitule: en ? 'd) The right to switch, as an option' : 'd) Le droit de changer, comme une option',
          enonce: en
            ? `The host offers to SELL you the right to switch. What is the most you should pay for it, in € (the value gap between the two strategies)?`
            : `L'animateur vous propose de vous VENDRE le droit de changer. Combien vaut-il au plus, en € (l'écart de valeur entre les deux stratégies) ?`,
          reponse: valeurDroit, tolerance: 0.02, unite: '€',
          etapes: [{
            titre: en ? 'Value of the right = E(switch) − E(stay)' : 'Valeur du droit = E(changer) − E(rester)',
            contenu: en
              ? `${f(eChanger)} − ${f(r2(gain / 3))} = **${eur(valeurDroit)}** — exactly one third of the prize. The module-8 reflex transplanted: a right without obligation has a computable value, and “I would pay up to ${eur(valeurDroit)} for the switch” is the sentence that turns a brainteaser answer into a desk answer.`
              : `${f(eChanger)} − ${f(r2(gain / 3))} = **${eur(valeurDroit)}** — exactement un tiers du lot. Le réflexe du module 8 transplanté : un droit sans obligation a une valeur calculable, et « je paierais jusqu'à ${eur(valeurDroit)} pour l'échange » est la phrase qui transforme une réponse de brainteaser en réponse de desk.`,
          }],
          pieges: [en
            ? `Valuing the right at the full E(switch) = ${eur(eChanger)}: you already OWN a 1/3 claim by standing on your door — the right is worth the IMPROVEMENT, not the destination.`
            : `Valoriser le droit à E(changer) entier = ${eur(eChanger)} : vous POSSÉDEZ déjà une créance de 1/3 en restant sur votre porte — le droit vaut l'AMÉLIORATION, pas la destination.`],
        },
        {
          intitule: en ? 'e) The twist: the ignorant host’s risk' : 'e) Le piège : le risque de l’animateur ignorant',
          enonce: en
            ? `Now the intern who does NOT know opens one of the two other doors at random. What was the probability he reveals the PRIZE and kills the game, in %?`
            : `Maintenant le stagiaire qui ne sait PAS ouvre une des deux autres portes au hasard. Quelle était la probabilité qu'il révèle le LOT et tue le jeu, en % ?`,
          reponse: pRevele, tolerance: 0.02, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'P(reveals prize) = P(prize among the two others) × 1/2' : 'P(révèle le lot) = P(lot parmi les deux autres) × 1/2',
            contenu: en
              ? `2/3 × 1/2 = **${pct(pRevele)}** (1/3). This number is the fingerprint of ignorance: the knowing host reveals the prize with probability ZERO. One third of the time, the intern's game dies on the spot — and that dead branch is precisely where the information difference between the two games hides.`
              : `2/3 × 1/2 = **${pct(pRevele)}** (1/3). Ce nombre est l'empreinte digitale de l'ignorance : l'animateur qui sait révèle le lot avec probabilité ZÉRO. Une fois sur trois, le jeu du stagiaire meurt sur place — et cette branche morte est précisément là où se cache la différence d'information entre les deux jeux.`,
          }],
          pieges: [en
            ? `Treating the intern's empty door as the same event as the host's: it LOOKS identical on the day it happens — the difference only lives in the branches that COULD have happened, which is exactly why intuition misses it.`
            : `Traiter la porte vide du stagiaire comme le même événement que celle de l'animateur : cela SEMBLE identique le jour où ça arrive — la différence ne vit que dans les branches qui AURAIENT PU arriver, et c'est exactement pourquoi l'intuition la rate.`],
        },
        {
          intitule: en ? 'f) The conditional: what survives of the 2/3' : 'f) Le conditionnement : ce qui survit des 2/3',
          enonce: en
            ? `The intern's random door happens to be empty. GIVEN that stroke of luck, what is now your probability of winning if you switch, in %?`
            : `La porte ouverte au hasard par le stagiaire se trouve être vide. SACHANT ce coup de chance, quelle est désormais votre probabilité de gagner en changeant, en % ?`,
          reponse: pCondIgnorant, tolerance: 0.02, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'Count the six equally likely cases' : 'Compter les six cas équiprobables',
              contenu: en
                ? `Prize placement (3 cases) × intern's door (2 each) = 6 equally likely branches. The revealed door is empty in 4 of them: in 2 the prize is behind YOUR door, in 2 behind the OTHER — **${pct(pCondIgnorant, 0)}**. The luck of an ignorant gesture carries no direction: conditioning on it rescales both hypotheses equally, and the asymmetry that powered the 2/3 is gone.`
                : `Position du lot (3 cas) × porte du stagiaire (2 chacun) = 6 branches équiprobables. La porte révélée est vide dans 4 d'entre elles : dans 2, le lot est derrière VOTRE porte, dans 2 derrière l'AUTRE — **${pct(pCondIgnorant, 0)}**. La chance d'un geste ignorant ne porte aucune direction : conditionner dessus remet les deux hypothèses à la même échelle, et l'asymétrie qui alimentait les 2/3 a disparu.`,
            },
            {
              titre: en ? 'The oral takeaway' : 'La phrase pour l’oral',
              contenu: en
                ? `The closing line the jury is fishing for: “same door, same goat, different WORLD — the knowing host's gesture is twice as likely when I hold the wrong door, the intern's gesture is equally likely everywhere. Information is not in what happened; it is in what could not have happened.” That is Monty Hall, Bayes, and half of market microstructure in three sentences.`
                : `La phrase de clôture que le jury pêche : « même porte, même chèvre, autre MONDE — le geste de l'animateur qui sait est deux fois plus probable quand je tiens la mauvaise porte, celui du stagiaire est également probable partout. L'information n'est pas dans ce qui est arrivé ; elle est dans ce qui n'aurait pas pu arriver. » C'est Monty Hall, Bayes, et la moitié de la microstructure de marché en trois phrases.`,
            },
          ],
          pieges: [en
            ? `Recycling the 2/3 out of habit: the 2/3 was MANUFACTURED by the host's constraint — remove the constraint and the update vanishes. Same observation, different observer, different probability: if that sentence feels wrong, reread chapter 3 tonight.`
            : `Recycler les 2/3 par habitude : les 2/3 étaient FABRIQUÉS par la contrainte de l'animateur — retirez la contrainte et la mise à jour s'évapore. Même observation, autre observateur, autre probabilité : si cette phrase dérange, relisez le chapitre 3 ce soir.`],
        },
      ],
    };
  },
};

/** Les 10 moules du lot 2 : 4 N3 puis 6 boss N4 — ordre d'affichage. */
export const problemesLot2: ProblemGenerator[] = [
  marketMakingDuDe,
  cascadeDeBayes,
  tournoiDeParis,
  fermiSousContrainte,
  oralAuxTroisEpreuves,
  candidatEtLeMenteur,
  tableDePokerDuDesk,
  driveDeLEntretien,
  varAuTableau,
  troisPortesEtLeContrat,
];
