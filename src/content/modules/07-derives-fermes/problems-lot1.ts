/**
 * Moules de problèmes multi-étapes du module Dérivés fermes : futures, FRA & swaps
 * — LOT 1 : les 10 moules N1/N2 (m7-pb-01 à m7-pb-10).
 * 4 N1 (première position futures, semaine de marge, forward d'indice, lecture
 * d'un futures de taux) et 6 N2 (appel de marge, trésorier FRA, cash-and-carry
 * complet, swap corporate, couverture du gérant avec bêta, MtM d'un swap choqué).
 * Chaque moule : 3 scénarios FR + EN (habillages ET bornes de tirage différents),
 * sous-questions chaînées (la sortie de a) nourrit b), c)…), corrigés calculés
 * via calculs.ts — jamais de texte figé.
 * INVARIANT BILINGUE : tous les tirages aléatoires ont lieu AVANT toute branche
 * de langue — même seed + même scénario ⇒ mêmes nombres en français et en anglais.
 * Conventions (en-tête de calculs.ts) : taux en %, durées en années, intérêts
 * LINÉAIRES ≤ 1 an, composition ANNUELLE au-delà ; long = +1, short = −1 ;
 * l'appel de marge ramène à la marge INITIALE ; prix d'un futures de taux = 100 − taux.
 */
import { formatNombreLangue } from '../../../engine/answers';
import { mulberry32, pick, randFloat, randInt } from '../../../engine/rng';
import type { Langue, ProblemGenerator } from '../../../engine/types';
import {
  appelDeMarge, effetLevier, facteurActualisation, margeVariation,
  nombreContratsCouverture, pnlFutures, prixForwardIndice, reglementFra,
  tauxForwardImplicite, tauxSwapParitaire, valeurJambeFixe, valeurSwapPayeurFixe,
} from './calculs';

/** Un « moule » de problème est un ProblemGenerator de l'engine (alias local). */
export type ProblemeMoule = ProblemGenerator;

const M7 = '07-derives-fermes';
const r1 = (v: number) => Math.round(v * 10) / 10;
const r2 = (v: number) => Math.round(v * 100) / 100;
const r3 = (v: number) => Math.round(v * 1000) / 1000;
const r4 = (v: number) => Math.round(v * 10_000) / 10_000;

/** Petits formateurs liés à la langue (les tirages sont déjà faits quand on les crée). */
function outils(langue: Langue) {
  const en = langue === 'en';
  const f = (v: number, d = 2) => formatNombreLangue(langue, v, d);
  const pct = (v: number, d = 2) => (en ? `${f(v, d)}%` : `${f(v, d)} %`);
  // Montant en devise. Le dollar est échappé (\$) : règle du mini-parser markdown,
  // un $ nu ouvrirait un segment KaTeX.
  const mnt = (v: number, sym: string, d = 2) => {
    const s = sym === '$' ? '\\$' : sym;
    return en ? `${s}${f(v, d)}` : `${f(v, d)} ${s}`;
  };
  // Montant en millions de devise ("3,25 M$" / "$3.25m").
  const mln = (v: number, sym: string, d = 3) => {
    const s = sym === '$' ? '\\$' : sym;
    return en ? `${s}${f(v, d)}m` : `${f(v, d)} M${s}`;
  };
  return { en, f, pct, mnt, mln };
}

/* ------------------------------------------------------------------ */
/* 1. m7-pb-01 — Première position : le futures de bout en bout — N1   */
/* ------------------------------------------------------------------ */
const premierePosition: ProblemeMoule = {
  id: 'm7-pb-01', moduleId: M7,
  titre: 'Première position : un futures de bout en bout',
  titreEn: 'A first position: one futures, end to end',
  typeDeCas: 'mécanique des futures',
  typeDeCasEn: 'futures mechanics',
  difficulte: 1,
  scenarios: ['Le junior au desk indices sur le CAC 40', "La gérante qui vend l'E-mini S&P 500", "L'étudiant en simulation sur l'Euro Stoxx 50"],
  scenariosEn: ['The junior on the index desk, CAC 40 futures', 'The manager selling the E-mini S&P 500', 'The student in the trading game, Euro Stoxx 50'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Config par scénario : contrat, multiplicateur, bornes (prix, contrats, marge %, mouvement).
    const cfg = ([
      { indice: 'CAC 40', mult: 10, sym: '€', pMin: 720, pMax: 820, nMin: 2, nMax: 5, mMin: 8, mMax: 12, dMin: 40, dMax: 180, sens: 1 },
      { indice: 'E-mini S&P 500', mult: 50, sym: '$', pMin: 480, pMax: 560, nMin: 1, nMax: 3, mMin: 8, mMax: 12, dMin: 30, dMax: 120, sens: -1 },
      { indice: 'Euro Stoxx 50', mult: 10, sym: '€', pMin: 470, pMax: 530, nMin: 4, nMax: 8, mMin: 10, mMax: 15, dMin: 25, dMax: 110, sens: 1 },
    ] as const)[sIdx];
    const p0 = randInt(rng, cfg.pMin, cfg.pMax) * 10;
    const n = randInt(rng, cfg.nMin, cfg.nMax);
    const m = randInt(rng, cfg.mMin, cfg.mMax);            // marge initiale, % du notionnel
    const dAbs = randInt(rng, cfg.dMin, cfg.dMax);
    const dSgn = pick(rng, [1, -1] as const);
    const p1 = p0 + dAbs * dSgn;
    const notionnel = p0 * cfg.mult * n;
    const marge = Math.round(notionnel * (m / 100));       // exact : notionnel multiple de 100
    const pnl = pnlFutures(p0, p1, cfg.mult, n, cfg.sens);
    const varPct = (p1 / p0 - 1) * 100;                    // non arrondi : nourrit le levier
    const rendMise = r1(effetLevier(varPct, m) * cfg.sens);
    const varPctR = r2(varPct);
    const gagne = pnl > 0;
    const short = cfg.sens === -1;

    const { en, f, pct, mnt } = outils(langue);
    const desc = en
      ? `the ${cfg.indice} futures trades at ${f(p0, 0)} points, multiplier ${mnt(cfg.mult, cfg.sym, 0)} per point, and the clearing house requires an initial margin of ${pct(m, 0)} of notional`
      : `le futures ${cfg.indice} cote ${f(p0, 0)} points, multiplicateur ${mnt(cfg.mult, cfg.sym, 0)} par point, et la chambre exige une marge initiale de ${pct(m, 0)} du notionnel`;
    const contexte = (en
      ? [
        `First day on the index desk: ${desc}. The senior trader lets you open your first position — buyer of ${f(n, 0)} contracts. A few sessions later, the position is closed out at ${f(p1, 0)} points. Before the debrief, the four numbers that tell the whole story: the notional committed, the margin posted, the P&L, and what it did to your stake.`,
        `Convinced the S&P 500 has run too far, a portfolio manager sells ${f(n, 0)} E-mini contract${n > 1 ? 's' : ''}: ${desc}. The position is bought back at ${f(p1, 0)} points. For the risk committee, she lays out the notional, the margin, the P&L of the short — and the multiple it represents on the cash actually posted.`,
        `Trading-game finale at the business school: ${desc}. You buy ${f(n, 0)} contracts and unwind at ${f(p1, 0)} points. The jury wants more than a screenshot: notional, initial margin, P&L sign included, and the percentage move on the stake — the number that explains why futures are not equities.`,
      ]
      : [
        `Premier jour au desk indices : ${desc}. Le trader senior vous laisse ouvrir votre première position — acheteur de ${f(n, 0)} contrats. Quelques séances plus tard, la position est soldée à ${f(p1, 0)} points. Avant le débrief, les quatre chiffres qui racontent tout : le notionnel engagé, la marge déposée, le P&L, et l'effet sur la mise.`,
        `Convaincue que le S&P 500 est monté trop vite, une gérante vend ${f(n, 0)} contrat${n > 1 ? 's' : ''} E-mini : ${desc}. La position est rachetée à ${f(p1, 0)} points. Pour le comité des risques, elle déroule le notionnel, la marge, le P&L de la vente — et le multiple que cela représente sur le cash réellement déposé.`,
        `Finale du jeu de bourse de l'école : ${desc}. Vous achetez ${f(n, 0)} contrats et débouclez à ${f(p1, 0)} points. Le jury veut mieux qu'une capture d'écran : notionnel, marge initiale, P&L signe compris, et la variation en pourcentage de la mise — le chiffre qui explique pourquoi un futures n'est pas une action.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The notional' : 'a) Le notionnel',
          enonce: en
            ? `${short ? 'You sell' : 'You buy'} ${f(n, 0)} contract${n > 1 ? 's' : ''} at ${f(p0, 0)} points. What notional are you committing to, in ${cfg.sym}?`
            : `Vous ${short ? 'vendez' : 'achetez'} ${f(n, 0)} contrat${n > 1 ? 's' : ''} à ${f(p0, 0)} points. Quel notionnel engagez-vous, en ${cfg.sym} ?`,
          reponse: notionnel, tolerance: 0.005, unite: cfg.sym,
          etapes: [{
            titre: en ? 'Price × multiplier × number of contracts' : 'Prix × multiplicateur × nombre de contrats',
            contenu: en
              ? `Notional = ${f(p0, 0)} × ${f(cfg.mult, 0)} × ${f(n, 0)} = **${mnt(notionnel, cfg.sym, 0)}**. That is the size of the commitment — the amount your signature engages, even though not a cent of it leaves your account at the open.`
              : `Notionnel = ${f(p0, 0)} × ${f(cfg.mult, 0)} × ${f(n, 0)} = **${mnt(notionnel, cfg.sym, 0)}**. C'est la taille de l'engagement — le montant que votre signature engage, alors même que pas un centime de cette somme ne sort du compte à l'ouverture.`,
          }],
          pieges: [en
            ? `The notional is not the stake: a futures is not paid for, it is guaranteed. Confusing the two understates the leverage by a factor of ten or more.`
            : `Le notionnel n'est pas la mise : un futures ne se paie pas, il se garantit. Confondre les deux sous-estime le levier d'un facteur dix ou plus.`],
        },
        {
          intitule: en ? 'b) The initial margin' : 'b) La marge initiale',
          enonce: en
            ? `The clearing house requires ${pct(m, 0)} of the notional. How much cash do you post, in ${cfg.sym}?`
            : `La chambre de compensation exige ${pct(m, 0)} du notionnel. Combien de cash déposez-vous, en ${cfg.sym} ?`,
          reponse: marge, tolerance: 0.005, unite: cfg.sym,
          etapes: [{
            titre: en ? 'A guarantee, not a payment' : 'Une garantie, pas un paiement',
            contenu: en
              ? `Initial margin = ${f(notionnel, 0)} × ${pct(m, 0)} = **${mnt(marge, cfg.sym, 0)}**. It is a good-faith deposit calibrated on one or two bad sessions — it stays your money, and it is the true denominator of the position: you control ${mnt(notionnel, cfg.sym, 0)} with ${mnt(marge, cfg.sym, 0)}.`
              : `Marge initiale = ${f(notionnel, 0)} × ${pct(m, 0)} = **${mnt(marge, cfg.sym, 0)}**. C'est un dépôt de bonne foi calibré sur une ou deux mauvaises séances — il reste votre argent, et c'est le vrai dénominateur de la position : vous contrôlez ${mnt(notionnel, cfg.sym, 0)} avec ${mnt(marge, cfg.sym, 0)}.`,
          }],
        },
        {
          intitule: en ? 'c) The P&L at close-out' : 'c) Le P&L à la clôture',
          enonce: en
            ? `The position is closed at ${f(p1, 0)} points. What is the P&L, sign included, in ${cfg.sym}?`
            : `La position est soldée à ${f(p1, 0)} points. Quel est le P&L, signe compris, en ${cfg.sym} ?`,
          reponse: pnl, tolerance: Math.max(1, Math.abs(pnl) * 0.01), toleranceMode: 'absolu', unite: cfg.sym,
          etapes: [{
            titre: en ? 'Exit minus entry, times the size, times the side' : 'Sortie moins entrée, fois la taille, fois le sens',
            contenu: en
              ? `P&L = (${f(p1, 0)} − ${f(p0, 0)}) × ${f(cfg.mult, 0)} × ${f(n, 0)} × (${short ? '−1' : '+1'}) = **${mnt(pnl, cfg.sym, 0)}**. ${short ? 'Short side: each point of decline pays, each point of rise costs.' : 'Long side: each point of rise pays, each point of decline costs.'} Zero-sum game: whoever took the other side ${gagne ? 'lost' : 'won'} exactly that amount.`
              : `P&L = (${f(p1, 0)} − ${f(p0, 0)}) × ${f(cfg.mult, 0)} × ${f(n, 0)} × (${short ? '−1' : '+1'}) = **${mnt(pnl, cfg.sym, 0)}**. ${short ? 'Côté vendeur : chaque point de baisse rapporte, chaque point de hausse coûte.' : 'Côté acheteur : chaque point de hausse rapporte, chaque point de baisse coûte.'} Jeu à somme nulle : la contrepartie d'en face a ${gagne ? 'perdu' : 'gagné'} exactement ce montant.`,
          }],
          pieges: [en
            ? `${short ? 'The seller reads the formula with sense = −1: applying the long formula flips the sign of the whole verdict.' : 'A P&L is reported with its sign: announcing a loss as an absolute value hides the side of the trade.'}`
            : `${short ? 'Le vendeur lit la formule avec sens = −1 : appliquer la formule du long inverse le signe de tout le verdict.' : "Un P&L se rend avec son signe : annoncer une perte en valeur absolue masque le sens de la position."}`],
        },
        {
          intitule: en ? 'd) The move on the stake' : 'd) La variation de la mise',
          enonce: en
            ? `Relative to the margin posted in b), what did the position return, in % (sign included)?`
            : `Rapporté à la marge déposée en b), combien la position a-t-elle rendu, en % (signe compris) ?`,
          reponse: rendMise, tolerance: 0.5, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'P&L over margin' : 'Le P&L sur la marge',
              contenu: en
                ? `Return on stake = ${f(pnl, 0)} / ${f(marge, 0)} = **${pct(rendMise, 1)}** — while the index itself only moved by ${pct(varPctR, 2)}.`
                : `Rendement sur mise = ${f(pnl, 0)} / ${f(marge, 0)} = **${pct(rendMise, 1)}** — pendant que l'indice, lui, ne bougeait que de ${pct(varPctR, 2)}.`,
            },
            {
              titre: en ? 'The leverage, named' : 'Le levier, nommé',
              contenu: en
                ? `Same number through the leverage lens: move on stake = spot move / (margin/100) = ${pct(varPctR, 2)} / ${f(m / 100, 2)}${short ? ' × (−1)' : ''} = **${pct(rendMise, 1)}**. A ${pct(m, 0)} margin is a ×${f(r1(100 / m), 1)} lever: it dilates gains AND losses alike — the double-edged sword of chapter 1.`
                : `Même chiffre par la lorgnette du levier : variation de la mise = variation du spot / (marge/100) = ${pct(varPctR, 2)} / ${f(m / 100, 2)}${short ? ' × (−1)' : ''} = **${pct(rendMise, 1)}**. Une marge de ${pct(m, 0)} est un levier ×${f(r1(100 / m), 1)} : il dilate les gains COMME les pertes — l'arme à double tranchant du chapitre 1.`,
            },
          ],
          pieges: [en
            ? `Dividing the P&L by the notional gives the spot move (${pct(varPctR, 2)}) — true but beside the point: the cash at risk is the margin, and that is what leverage multiplies.`
            : `Diviser le P&L par le notionnel redonne la variation du spot (${pct(varPctR, 2)}) — exact mais hors sujet : le cash en jeu est la marge, et c'est elle que le levier multiplie.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 2. m7-pb-02 — La semaine de marge — N1                              */
/* ------------------------------------------------------------------ */
const semaineDeMarge: ProblemeMoule = {
  id: 'm7-pb-02', moduleId: M7,
  titre: 'La semaine de marge : le P&L payé soir après soir',
  titreEn: 'The margin week: a P&L paid evening by evening',
  typeDeCas: 'mark-to-market',
  typeDeCasEn: 'mark-to-market',
  difficulte: 1,
  scenarios: ['Le trésorier long CAC 40 sur quatre soirs', 'Le desk vendeur d\'Euro Stoxx en couverture', 'Le particulier et son premier E-mini'],
  scenariosEn: ['The treasurer long CAC 40 over four evenings', 'The desk short Euro Stoxx as a hedge', 'The retail trader and his first E-mini'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const cfg = ([
      { indice: 'CAC 40', mult: 10, sym: '€', pMin: 720, pMax: 820, nMin: 2, nMax: 3, dMax: 18, sens: 1 },
      { indice: 'Euro Stoxx 50', mult: 10, sym: '€', pMin: 470, pMax: 530, nMin: 3, nMax: 5, dMax: 16, sens: -1 },
      { indice: 'E-mini S&P 500', mult: 50, sym: '$', pMin: 480, pMax: 560, nMin: 1, nMax: 2, dMax: 14, sens: 1 },
    ] as const)[sIdx];
    const p0 = randInt(rng, cfg.pMin, cfg.pMax) * 10;
    const n = randInt(rng, cfg.nMin, cfg.nMax);
    // 4 cours de compensation : variations en multiples de 5 points, jamais nulles.
    const deltas = [0, 1, 2, 3].map(() => randInt(rng, 1, cfg.dMax) * 5 * pick(rng, [1, -1] as const));
    const c1 = p0 + deltas[0];
    const c2 = c1 + deltas[1];
    const c3 = c2 + deltas[2];
    const c4 = c3 + deltas[3];
    const f1 = margeVariation(p0, c1, cfg.mult, n, cfg.sens);
    const f2 = margeVariation(c1, c2, cfg.mult, n, cfg.sens);
    const f34 = margeVariation(c2, c4, cfg.mult, n, cfg.sens); // télescopage des soirs 3 et 4
    const cumul = pnlFutures(p0, c4, cfg.mult, n, cfg.sens);   // = f1 + f2 + f34
    const short = cfg.sens === -1;

    const { en, f, mnt } = outils(langue);
    const jours = en ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday'] : ['lundi', 'mardi', 'mercredi', 'jeudi'];
    const desc = en
      ? `${short ? 'short' : 'long'} ${f(n, 0)} ${cfg.indice} contract${n > 1 ? 's' : ''} opened Monday morning at ${f(p0, 0)} points (multiplier ${mnt(cfg.mult, cfg.sym, 0)}/point); settlement prices: ${jours[0]} ${f(c1, 0)}, ${jours[1]} ${f(c2, 0)}, ${jours[2]} ${f(c3, 0)}, ${jours[3]} ${f(c4, 0)}`
      : `${short ? 'vendeur' : 'acheteur'} de ${f(n, 0)} contrat${n > 1 ? 's' : ''} ${cfg.indice} ouvert${n > 1 ? 's' : ''} lundi matin à ${f(p0, 0)} points (multiplicateur ${mnt(cfg.mult, cfg.sym, 0)}/point) ; cours de compensation : ${jours[0]} ${f(c1, 0)}, ${jours[1]} ${f(c2, 0)}, ${jours[2]} ${f(c3, 0)}, ${jours[3]} ${f(c4, 0)}`;
    const contexte = (en
      ? [
        `A corporate treasurer pre-hedges an equity purchase: ${desc}. Four evenings, four cash flows on the margin account — and on Friday morning the CFO asks for the week's tally. You reconstruct the flows one evening at a time, then check the total the professional way.`,
        `On the desk, a hedge runs through a choppy week: ${desc}. The risk report wants the variation margin evening by evening, then the cumulative P&L — and the proof that the daily settlement invents nothing.`,
        `A retail trader opens his first futures position: ${desc}. Every evening his broker credits or debits the account; he wants to understand each flow before reading the weekly statement — and why the sum of the evenings is exactly the P&L.`,
      ]
      : [
        `Un trésorier d'entreprise pré-couvre un achat d'actions : ${desc}. Quatre soirs, quatre flux sur le compte de marge — et vendredi matin, le directeur financier demande le bilan de la semaine. Vous reconstituez les flux soir après soir, puis vérifiez le total comme au desk.`,
        `Au desk, une couverture traverse une semaine agitée : ${desc}. Le rapport de risque veut la marge de variation soir par soir, puis le P&L cumulé — et la preuve que le règlement quotidien n'invente rien.`,
        `Un particulier ouvre sa première position futures : ${desc}. Chaque soir, son courtier crédite ou débite le compte ; il veut comprendre chaque flux avant de lire le relevé hebdomadaire — et pourquoi la somme des soirs est exactement le P&L.`,
      ])[sIdx];

    const fluxMot = (v: number) => (en ? (v >= 0 ? 'credited' : 'debited') : (v >= 0 ? 'crédité' : 'débité'));
    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? `a) ${jours[0]} evening's flow` : `a) Le flux du soir de ${jours[0]}`,
          enonce: en
            ? `At ${jours[0]}'s settlement price of ${f(c1, 0)}, what is the variation margin flow, sign included, in ${cfg.sym}?`
            : `Au cours de compensation de ${jours[0]} (${f(c1, 0)}), quel est le flux de marge de variation, signe compris, en ${cfg.sym} ?`,
          reponse: f1, tolerance: Math.max(10, Math.abs(f1) * 0.01), toleranceMode: 'absolu', unite: cfg.sym,
          etapes: [{
            titre: en ? 'Today versus the entry price' : "Le jour contre le prix d'entrée",
            contenu: en
              ? `Flow = (${f(c1, 0)} − ${f(p0, 0)}) × ${f(cfg.mult, 0)} × ${f(n, 0)} × (${short ? '−1' : '+1'}) = **${mnt(f1, cfg.sym, 0)}**: the account is ${fluxMot(f1)} this very evening. The P&L does not wait for expiry — it is settled in cash every night.`
              : `Flux = (${f(c1, 0)} − ${f(p0, 0)}) × ${f(cfg.mult, 0)} × ${f(n, 0)} × (${short ? '−1' : '+1'}) = **${mnt(f1, cfg.sym, 0)}** : le compte est ${fluxMot(f1)} ce soir même. Le P&L n'attend pas l'échéance — il se règle en cash chaque soir.`,
          }],
        },
        {
          intitule: en ? `b) ${jours[1]} evening's flow` : `b) Le flux du soir de ${jours[1]}`,
          enonce: en
            ? `${jours[1]} settles at ${f(c2, 0)}. What is that evening's flow, sign included, in ${cfg.sym}?`
            : `${jours[1].charAt(0).toUpperCase() + jours[1].slice(1)} compense à ${f(c2, 0)}. Quel est le flux de ce soir-là, signe compris, en ${cfg.sym} ?`,
          reponse: f2, tolerance: Math.max(10, Math.abs(f2) * 0.01), toleranceMode: 'absolu', unite: cfg.sym,
          etapes: [{
            titre: en ? 'Always against YESTERDAY\'s settlement' : 'Toujours contre le cours de la VEILLE',
            contenu: en
              ? `Flow = (${f(c2, 0)} − ${f(c1, 0)}) × ${f(cfg.mult, 0)} × ${f(n, 0)} × (${short ? '−1' : '+1'}) = **${mnt(f2, cfg.sym, 0)}**. The position was re-marked at ${f(c1, 0)} last night: only the move since then settles tonight.`
              : `Flux = (${f(c2, 0)} − ${f(c1, 0)}) × ${f(cfg.mult, 0)} × ${f(n, 0)} × (${short ? '−1' : '+1'}) = **${mnt(f2, cfg.sym, 0)}**. La position a été recalée à ${f(c1, 0)} hier soir : seul le mouvement depuis ce cours se règle ce soir.`,
          }],
          pieges: [en
            ? `Measuring each evening against the ENTRY price double-counts the earlier days: the daily flow always compares to the previous settlement, never to ${f(p0, 0)}.`
            : `Mesurer chaque soir contre le prix d'ENTRÉE compte plusieurs fois les premiers jours : le flux quotidien se compare toujours à la compensation de la veille, jamais à ${f(p0, 0)}.`],
        },
        {
          intitule: en ? `c) ${jours[2]} and ${jours[3]}, combined` : `c) Les soirs de ${jours[2]} et ${jours[3]}, cumulés`,
          enonce: en
            ? `${jours[2]} settles at ${f(c3, 0)}, ${jours[3]} at ${f(c4, 0)}. What is the combined flow of those two evenings, in ${cfg.sym}?`
            : `${jours[2].charAt(0).toUpperCase() + jours[2].slice(1)} compense à ${f(c3, 0)}, ${jours[3]} à ${f(c4, 0)}. Quel est le flux cumulé de ces deux soirs, en ${cfg.sym} ?`,
          reponse: f34, tolerance: Math.max(10, Math.abs(f34) * 0.01), toleranceMode: 'absolu', unite: cfg.sym,
          etapes: [{
            titre: en ? 'The sum telescopes' : 'La somme se télescope',
            contenu: en
              ? `(${f(c3, 0)} − ${f(c2, 0)}) + (${f(c4, 0)} − ${f(c3, 0)}) = ${f(c4, 0)} − ${f(c2, 0)}: the intermediate price drops out. Combined flow = (${f(c4, 0)} − ${f(c2, 0)}) × ${f(cfg.mult, 0)} × ${f(n, 0)} × (${short ? '−1' : '+1'}) = **${mnt(f34, cfg.sym, 0)}**. Consecutive margin flows always telescope: only the endpoints matter.`
              : `(${f(c3, 0)} − ${f(c2, 0)}) + (${f(c4, 0)} − ${f(c3, 0)}) = ${f(c4, 0)} − ${f(c2, 0)} : le cours intermédiaire disparaît. Flux cumulé = (${f(c4, 0)} − ${f(c2, 0)}) × ${f(cfg.mult, 0)} × ${f(n, 0)} × (${short ? '−1' : '+1'}) = **${mnt(f34, cfg.sym, 0)}**. Les flux de marge consécutifs se télescopent toujours : seules les extrémités comptent.`,
          }],
        },
        {
          intitule: en ? 'd) The week\'s tally' : 'd) Le bilan de la semaine',
          enonce: en
            ? `Summing the four evenings, what is the cumulative P&L of the week, sign included, in ${cfg.sym}?`
            : `En sommant les quatre soirs, quel est le P&L cumulé de la semaine, signe compris, en ${cfg.sym} ?`,
          reponse: cumul, tolerance: Math.max(10, Math.abs(cumul) * 0.01), toleranceMode: 'absolu', unite: cfg.sym,
          etapes: [
            {
              titre: en ? 'The sum of the flows is the P&L' : 'La somme des flux est le P&L',
              contenu: en
                ? `${f(f1, 0)} + ${f(f2, 0)} + ${f(f34, 0)} = **${mnt(cumul, cfg.sym, 0)}** — exactly (${f(c4, 0)} − ${f(p0, 0)}) × ${f(cfg.mult, 0)} × ${f(n, 0)} × (${short ? '−1' : '+1'}), the P&L of a position closed at ${f(c4, 0)}. Mark-to-market invents nothing: it spreads the same P&L over the evenings.`
                : `${f(f1, 0)} + ${f(f2, 0)} + ${f(f34, 0)} = **${mnt(cumul, cfg.sym, 0)}** — exactement (${f(c4, 0)} − ${f(p0, 0)}) × ${f(cfg.mult, 0)} × ${f(n, 0)} × (${short ? '−1' : '+1'}), le P&L d'une position soldée à ${f(c4, 0)}. Le mark-to-market n'invente rien : il étale le même P&L sur les soirs.`,
            },
            {
              titre: en ? 'Same P&L as a forward — different cash calendar' : 'Même P&L qu\'un forward — autre calendrier de caisse',
              contenu: en
                ? `A forward unwound at ${f(c4, 0)} would have produced the same ${mnt(cumul, cfg.sym, 0)}, but in ONE flow at the end. The futures demands or delivers cash every evening — and it demands it precisely when the market moves against you: identical P&L, radically different treasury.`
                : `Un forward dénoué à ${f(c4, 0)} aurait produit les mêmes ${mnt(cumul, cfg.sym, 0)}, mais en UN flux à la fin. Le futures exige ou verse du cash chaque soir — et il l'exige précisément quand le marché va contre vous : P&L identique, trésorerie radicalement différente.`,
            },
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 3. m7-pb-03 — Forward d'indice : le portage, pas la boule de cristal — N1 */
/* ------------------------------------------------------------------ */
const forwardIndice: ProblemeMoule = {
  id: 'm7-pb-03', moduleId: M7,
  titre: "Forward d'indice : le portage, pas la boule de cristal",
  titreEn: 'Index forward: carry, not a crystal ball',
  typeDeCas: 'pricing par portage',
  typeDeCasEn: 'carry pricing',
  difficulte: 1,
  scenarios: ['Le trésorier face au futures CAC en report', "L'analyste de 2017 et le futures Euro Stoxx sous le spot", 'Le stagiaire de New York sur le S&P 3 mois'],
  scenariosEn: ['The treasurer and the CAC futures at a premium', 'The 2017 analyst and the Euro Stoxx futures below spot', 'The New York intern on the 3-month S&P'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // flipUp : pour la question d), l'« autre époque » fait remonter (true) ou
    // retomber (false) le taux de financement, pour inverser le régime.
    const cfg = ([
      { indice: 'CAC 40', sym: '€', pMin: 720, pMax: 820, T: 1, tLbl: '12 mois', tLblEn: '12 months', rMin: 3.2, rMax: 5, qMin: 1.5, qMax: 2.8, flipUp: false },
      { indice: 'Euro Stoxx 50', sym: '€', pMin: 290, pMax: 360, T: 0.5, tLbl: '6 mois', tLblEn: '6 months', rMin: 0, rMax: 0.8, qMin: 2.6, qMax: 3.6, flipUp: true },
      { indice: 'S&P 500', sym: '$', pMin: 480, pMax: 560, T: 0.25, tLbl: '3 mois', tLblEn: '3 months', rMin: 4, rMax: 5.5, qMin: 1, qMax: 1.8, flipUp: false },
    ] as const)[sIdx];
    const S = randInt(rng, cfg.pMin, cfg.pMax) * 10;
    const r = randFloat(rng, cfg.rMin, cfg.rMax, 1);
    const q = randFloat(rng, cfg.qMin, cfg.qMax, 1);
    const rB = cfg.flipUp
      ? r1(q + randFloat(rng, 0.5, 2, 1))                 // les taux remontent au-dessus du dividende
      : r1(Math.max(0, q - randFloat(rng, 0.5, 2, 1)));   // les taux retombent sous le dividende
    const portage = r2(r - q);
    const F = r2(prixForwardIndice(S, r, q, cfg.T));
    const ecart = r2(F - S);
    const report = ecart > 0;
    const FB = r2(prixForwardIndice(S, rB, q, cfg.T));
    const reportB = FB > S;

    const { en, f, pct } = outils(langue);
    const tl = en ? cfg.tLblEn : cfg.tLbl;
    const desc = en
      ? `the ${cfg.indice} spot trades at ${f(S, 0)} points, money can be borrowed at ${pct(r, 1)} a year, and the basket pays a dividend yield of ${pct(q, 1)} a year`
      : `le ${cfg.indice} cote ${f(S, 0)} points au comptant, l'argent s'emprunte à ${pct(r, 1)} par an, et le panier verse un rendement du dividende de ${pct(q, 1)} par an`;
    const contexte = (en
      ? [
        `A treasurer notices the ${tl} futures quoting away from spot and wonders whether the market "expects" something: ${desc}. You answer the desk way — net carry, theoretical forward, the gap with its proper name (premium or discount), and what the same screen would show in another rate regime.`,
        `In an era of zero rates, an analyst sees the ${tl} Euro Stoxx futures BELOW the spot and is asked whether the market is bearish: ${desc}. The note must rebuild the forward by cost of carry, name the regime — and show that no forecast hides in there.`,
        `First week in New York, the intern must explain the ${tl} S&P futures to a client: ${desc}. Four numbers: the net carry, the fair forward, the gap to spot with its name, and the counterfactual with different rates — the proof that the futures predicts nothing.`,
      ]
      : [
        `Un trésorier remarque que le futures ${tl} cote loin du spot et se demande si le marché « anticipe » quelque chose : ${desc}. Vous répondez comme au desk — portage net, forward théorique, écart avec son vrai nom (report ou déport), et ce que le même écran afficherait sous un autre régime de taux.`,
        `En pleine époque de taux zéro, une analyste voit le futures Euro Stoxx ${tl} SOUS le spot et on lui demande si le marché est baissier : ${desc}. La note doit reconstruire le forward par le coût de portage, nommer le régime — et montrer qu'aucune prévision ne s'y cache.`,
        `Première semaine à New York : le stagiaire doit expliquer le futures S&P ${tl} à un client : ${desc}. Quatre chiffres : le portage net, le forward d'équilibre, l'écart au spot avec son nom, et le contrefactuel avec d'autres taux — la preuve que le futures ne prédit rien.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The net carry' : 'a) Le portage net',
          enonce: en
            ? `What is the net cost of carry of the index, in % a year (sign included)?`
            : `Quel est le coût de portage net de l'indice, en % par an (signe compris) ?`,
          reponse: portage, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Financing minus the asset\'s income' : "Le financement moins le revenu de l'actif",
            contenu: en
              ? `Net carry = r − q = ${pct(r, 1)} − ${pct(q, 1)} = **${pct(portage, 1)}** a year: holding the basket costs the funding rate and pays back the dividends. ${portage > 0 ? 'Positive: carrying the index costs money on net.' : 'Negative: the dividends more than pay for the funding — being long the basket earns its keep.'}`
              : `Portage net = r − q = ${pct(r, 1)} − ${pct(q, 1)} = **${pct(portage, 1)}** par an : détenir le panier coûte le taux de financement et rapporte les dividendes. ${portage > 0 ? 'Positif : porter l\'indice coûte de l\'argent en net.' : 'Négatif : les dividendes paient plus que le financement — détenir le panier rapporte en net.'}`,
          }],
        },
        {
          intitule: en ? `b) The ${tl} forward` : `b) Le forward ${tl}`,
          enonce: en
            ? `By cash and carry, what is the fair ${tl} forward price, in points?`
            : `Par le cash and carry, que vaut le forward ${tl} d'équilibre, en points ?`,
          reponse: F, tolerance: 0.005, unite: 'pts',
          etapes: [{
            titre: en ? 'Spot plus the carry over the horizon' : "Le spot plus le portage sur l'horizon",
            contenu: en
              ? `$F = S \\times (1 + \\frac{r - q}{100} \\times T)$ = ${f(S, 0)} × ${f(1 + (portage / 100) * cfg.T, 5)} = **${f(F, 2)} points**, with T = ${f(cfg.T, 2)}. Three observable numbers — spot, funding, dividends — and not one forecast.`
              : `$F = S \\times (1 + \\frac{r - q}{100} \\times T)$ = ${f(S, 0)} × ${f(1 + (portage / 100) * cfg.T, 5)} = **${f(F, 2)} points**, avec T = ${f(cfg.T, 2)}. Trois chiffres observables — spot, financement, dividendes — et pas une seule prévision.`,
          }],
          pieges: [en
            ? `Adding financing AND dividends to the spot puts the curve on the wrong side: the dividend is an income of the carry, it SUBTRACTS.`
            : `Additionner financement ET dividendes au spot met la courbe du mauvais côté : le dividende est un revenu du portage, il se RETRANCHE.`],
        },
        {
          intitule: en ? 'c) The gap and its name' : "c) L'écart et son nom",
          enonce: en
            ? `What gap does the forward show against spot (F − S), in points, sign included?`
            : `Quel écart le forward affiche-t-il contre le spot (F − S), en points, signe compris ?`,
          reponse: ecart, tolerance: Math.max(0.5, Math.abs(ecart) * 0.05), toleranceMode: 'absolu', unite: 'pts',
          etapes: [
            {
              titre: en ? 'F minus S, then the verdict' : 'F moins S, puis le verdict',
              contenu: en
                ? `Gap = ${f(F, 2)} − ${f(S, 0)} = **${f(ecart, 2)} points**: ${report ? `positive, the futures trades at a PREMIUM (r > q, the normal regime when money costs more than the basket pays)` : `negative, the futures trades at a DISCOUNT (q > r: the dividends crush the funding cost — the standard picture of the zero-rate years)`}.`
                : `Écart = ${f(F, 2)} − ${f(S, 0)} = **${f(ecart, 2)} points** : ${report ? `positif, le futures cote en REPORT (r > q, le régime normal quand l'argent coûte plus que ce que le panier verse)` : `négatif, le futures cote en DÉPORT (q > r : les dividendes écrasent le coût de financement — l'image standard des années de taux zéro)`}.`,
            },
            {
              titre: en ? 'No information about direction' : 'Aucune information directionnelle',
              contenu: en
                ? `If the gap announced a market move, buying the cheap leg and selling the rich one would lock in the profit — and that very arbitrage is what pins the price. ${report ? 'A premium says "rates above dividends", nothing more.' : 'A discount says "dividends above rates", not "the market sees a fall".'}`
                : `Si l'écart annonçait un mouvement du marché, acheter la jambe bon marché et vendre la jambe chère verrouillerait le profit — et c'est précisément cet arbitrage qui fixe le prix. ${report ? 'Un report dit « taux au-dessus des dividendes », rien de plus.' : 'Un déport dit « dividendes au-dessus des taux », pas « le marché voit une baisse ».'}`,
            },
          ],
          pieges: [en
            ? `Reading the ${report ? 'premium as bullishness' : 'discount as bearishness'} is the classic mistake of the module: the gap is carry arithmetic, the twin of "the FX forward predicts the euro".`
            : `Lire le ${report ? 'report comme de l\'optimisme' : 'déport comme du pessimisme'} est le contresens classique du module : l'écart est l'arithmétique du portage, le jumeau de « le forward de change prévoit l'euro ».`],
        },
        {
          intitule: en ? 'd) The same screen, another era' : 'd) Le même écran, une autre époque',
          enonce: en
            ? `Same spot, same dividends, but the funding rate ${cfg.flipUp ? 'rises' : 'falls'} to ${pct(rB, 1)}. What is the new ${tl} forward, in points?`
            : `Même spot, mêmes dividendes, mais le taux de financement ${cfg.flipUp ? 'remonte' : 'retombe'} à ${pct(rB, 1)}. Que vaut le nouveau forward ${tl}, en points ?`,
          reponse: FB, tolerance: 0.005, unite: 'pts',
          etapes: [{
            titre: en ? 'The regime flips with the rates' : 'Le régime bascule avec les taux',
            contenu: en
              ? `F = ${f(S, 0)} × (1 + (${f(rB, 1)} − ${f(q, 1)})/100 × ${f(cfg.T, 2)}) = **${f(FB, 2)} points** — the futures now trades ${reportB ? 'ABOVE' : 'BELOW'} spot: ${reportB ? 'premium' : 'discount'}. Same index, same formula, opposite regime: only the rates moved. That is why the 2015-2021 discounts turned into premiums with the 2022 tightening — arithmetic, not sentiment.`
              : `F = ${f(S, 0)} × (1 + (${f(rB, 1)} − ${f(q, 1)})/100 × ${f(cfg.T, 2)}) = **${f(FB, 2)} points** — le futures cote désormais ${reportB ? 'AU-DESSUS' : 'SOUS'} le spot : ${reportB ? 'report' : 'déport'}. Même indice, même formule, régime inversé : seuls les taux ont bougé. Voilà pourquoi les déports de 2015-2021 sont devenus des reports avec le resserrement de 2022 — de l'arithmétique, pas du sentiment.`,
          }],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 4. m7-pb-04 — Lire un futures de taux : 100 − taux — N1             */
/* ------------------------------------------------------------------ */
const futuresDeTaux: ProblemeMoule = {
  id: 'm7-pb-04', moduleId: M7,
  titre: 'Lire un futures de taux : le prix qui marche à l\'envers',
  titreEn: 'Reading a rate futures: the price that walks backwards',
  typeDeCas: 'futures de taux courts',
  typeDeCasEn: 'short-term rate futures',
  difficulte: 1,
  scenarios: ['La trésorière qui vend ses Euribor', 'Le prop trader long SOFR avant la détente', "L'étudiant long Euribor à contre-courant"],
  scenariosEn: ['The treasurer selling her Euribor contracts', 'The prop trader long SOFR before the easing', 'The student long Euribor against the tide'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // sens : position sur le CONTRAT (prix) ; up : les taux montent (le prix baisse).
    // Multiplicateur : 1 point de prix = 100 pb × 25 €/pb = 2 500 € (notionnel 1 M, 3 mois).
    const cfg = ([
      { contrat: 'Euribor 3 mois', sym: '€', sens: -1, nMin: 20, nMax: 100, tMin: 2, tMax: 3.6, dMin: 10, dMax: 60, up: true },
      { contrat: 'SOFR 3 mois', sym: '$', sens: 1, nMin: 10, nMax: 60, tMin: 3.5, tMax: 5, dMin: 15, dMax: 70, up: false },
      { contrat: 'Euribor 3 mois', sym: '€', sens: 1, nMin: 5, nMax: 40, tMin: 2.2, tMax: 4, dMin: 10, dMax: 50, up: true },
    ] as const)[sIdx];
    const t0 = randFloat(rng, cfg.tMin, cfg.tMax, 2);
    const dpb = randInt(rng, cfg.dMin, cfg.dMax);          // mouvement du taux, en pb
    const n = randInt(rng, cfg.nMin, cfg.nMax);
    const t1 = r2(t0 + (cfg.up ? dpb : -dpb) / 100);
    const prix0 = r2(100 - t0);
    const prix1 = r2(100 - t1);
    const ticks = Math.round((prix1 - prix0) / 0.005);     // ticks de 0,005, signés (= ∓2×dpb)
    const pnl = r2(pnlFutures(prix0, prix1, 2500, n, cfg.sens));
    const short = cfg.sens === -1;
    const gagne = pnl > 0;

    const { en, f, pct, mnt } = outils(langue);
    const desc = en
      ? `the ${cfg.contrat} futures (notional ${mnt(1, cfg.sym, 0)}m, quarterly period: 1 basis point = ${mnt(25, cfg.sym, 0)}, tick 0.005 = ${mnt(12.5, cfg.sym, 2)}) quotes ${f(prix0, 2)}; the position is ${short ? 'a sale' : 'a purchase'} of ${f(n, 0)} contracts`
      : `le futures ${cfg.contrat} (notionnel 1 M${cfg.sym}, période trimestrielle : 1 point de base = ${mnt(25, cfg.sym, 0)}, tick 0,005 = ${mnt(12.5, cfg.sym, 2)}) cote ${f(prix0, 2)} ; la position est ${short ? 'une vente' : 'un achat'} de ${f(n, 0)} contrats`;
    const move = en
      ? `the 3-month rate priced by the market moves to ${pct(t1, 2)}`
      : `le taux 3 mois pricé par le marché passe à ${pct(t1, 2)}`;
    const contexte = (en
      ? [
        `A corporate treasurer must roll a large borrowing next quarter and fears a rate rise; she hedges by SELLING rate futures: ${desc}. Weeks later, ${move}. She unwinds and documents the trade for the audit trail: implied rate at entry, new price, the move in ticks, and the P&L.`,
        `On the prop desk, a trader is convinced the central bank will ease sooner than priced; he BUYS rate futures: ${desc}. Indeed, ${move}. Time to close and write the recap: entry rate, exit price, ticks gained, money made.`,
        `In the trading game, a student buys rate futures "because rates will keep rising — so my contract will too": ${desc}. Then ${move}. The debrief walks through the implied rate, the new price, the tick count — and the sign error that the convention price = 100 − rate punishes.`,
      ]
      : [
        `Une trésorière doit refinancer un gros emprunt le trimestre prochain et craint une hausse des taux ; elle se couvre en VENDANT des futures de taux : ${desc}. Quelques semaines plus tard, ${move}. Elle déboucle et documente l'opération pour la piste d'audit : taux implicite à l'entrée, nouveau prix, mouvement en ticks, et P&L.`,
        `Au prop desk, un trader est convaincu que la banque centrale assouplira plus tôt que pricé ; il ACHÈTE des futures de taux : ${desc}. De fait, ${move}. Il solde et rédige le récap : taux d'entrée, prix de sortie, ticks gagnés, argent gagné.`,
        `Au jeu de bourse, un étudiant achète des futures de taux « parce que les taux vont continuer de monter — donc mon contrat aussi » : ${desc}. Puis ${move}. Le débrief déroule le taux implicite, le nouveau prix, le compte de ticks — et l'erreur de signe que la convention prix = 100 − taux punit.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The implied rate at entry' : "a) Le taux implicite à l'entrée",
          enonce: en
            ? `The contract quotes ${f(prix0, 2)}. What 3-month rate is the market pricing, in %?`
            : `Le contrat cote ${f(prix0, 2)}. Quel taux 3 mois le marché price-t-il, en % ?`,
          reponse: t0, tolerance: 0.01, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Price = 100 − rate' : 'Prix = 100 − taux',
            contenu: en
              ? `Rate = 100 − ${f(prix0, 2)} = **${pct(t0, 2)}**. The convention recreates the bond reflex of module 4: the price falls when rates rise — which lets the contract live inside the ordinary futures machinery (margins, ticks, order book).`
              : `Taux = 100 − ${f(prix0, 2)} = **${pct(t0, 2)}**. La convention recrée le réflexe obligataire du module 4 : le prix baisse quand les taux montent — ce qui permet au contrat de vivre dans la machinerie ordinaire des futures (marges, ticks, carnet).`,
          }],
        },
        {
          intitule: en ? 'b) The new price' : 'b) Le nouveau prix',
          enonce: en
            ? `The 3-month rate priced by the market moves to ${pct(t1, 2)}. Where does the contract quote now, in points?`
            : `Le taux 3 mois pricé par le marché passe à ${pct(t1, 2)}. Où cote le contrat désormais, en points ?`,
          reponse: prix1, tolerance: 0.01, toleranceMode: 'absolu', unite: 'pts',
          etapes: [{
            titre: en ? 'Same convention, new rate' : 'Même convention, nouveau taux',
            contenu: en
              ? `Price = 100 − ${f(t1, 2)} = **${f(prix1, 2)}**. The rate ${cfg.up ? 'rose' : 'fell'} by ${f(dpb, 0)} basis points, so the price ${cfg.up ? 'FELL' : 'ROSE'} by the same ${f(dpb, 0)} bp — the mirror is exact, basis point for basis point.`
              : `Prix = 100 − ${f(t1, 2)} = **${f(prix1, 2)}**. Le taux a ${cfg.up ? 'monté' : 'baissé'} de ${f(dpb, 0)} points de base, donc le prix a ${cfg.up ? 'BAISSÉ' : 'MONTÉ'} des mêmes ${f(dpb, 0)} pb — le miroir est exact, point de base pour point de base.`,
          }],
          pieges: [en
            ? `"Rates up, so my contract goes up" is the sign error this convention exists to punish: on a rate futures, the BUYER bets on FALLING rates.`
            : `« Les taux montent, donc mon contrat monte » est l'erreur de signe que cette convention existe pour punir : sur un futures de taux, l'ACHETEUR parie sur la BAISSE des taux.`],
        },
        {
          intitule: en ? 'c) The move in ticks' : 'c) Le mouvement en ticks',
          enonce: en
            ? `With a tick of 0.005 point, by how many ticks did the price move (sign included)?`
            : `Avec un tick de 0,005 point, de combien de ticks le prix a-t-il bougé (signe compris) ?`,
          reponse: ticks, tolerance: 1, toleranceMode: 'absolu', unite: 'ticks',
          etapes: [{
            titre: en ? 'From basis points to ticks' : 'Des points de base aux ticks',
            contenu: en
              ? `Price move = ${f(prix1, 2)} − ${f(prix0, 2)} = ${f(r2(prix1 - prix0), 2)} point, i.e. ${f(cfg.up ? -dpb : dpb, 0)} bp. One bp = 2 ticks of 0.005, so **${f(ticks, 0)} ticks** — each one worth ${mnt(12.5, cfg.sym, 2)} per contract, the half-tick every STIR trader knows by heart.`
              : `Variation de prix = ${f(prix1, 2)} − ${f(prix0, 2)} = ${f(r2(prix1 - prix0), 2)} point, soit ${f(cfg.up ? -dpb : dpb, 0)} pb. Un pb = 2 ticks de 0,005, donc **${f(ticks, 0)} ticks** — chacun vaut ${mnt(12.5, cfg.sym, 2)} par contrat, le demi-tick que tout trader de STIR connaît par cœur.`,
          }],
        },
        {
          intitule: en ? 'd) The P&L in money' : "d) Le P&L en monnaie",
          enonce: en
            ? `For the position of ${f(n, 0)} contracts (${short ? 'short' : 'long'}), what is the P&L, sign included, in ${cfg.sym}?`
            : `Pour la position de ${f(n, 0)} contrats (${short ? 'vendeur' : 'acheteur'}), quel est le P&L, signe compris, en ${cfg.sym} ?`,
          reponse: pnl, tolerance: Math.max(1, Math.abs(pnl) * 0.01), toleranceMode: 'absolu', unite: cfg.sym,
          etapes: [
            {
              titre: en ? 'Price move × value of a point × side' : 'Variation de prix × valeur du point × sens',
              contenu: en
                ? `One full price point = 100 bp × ${mnt(25, cfg.sym, 0)} = ${mnt(2500, cfg.sym, 0)} per contract. P&L = (${f(prix1, 2)} − ${f(prix0, 2)}) × ${f(2500, 0)} × ${f(n, 0)} × (${short ? '−1' : '+1'}) = **${mnt(pnl, cfg.sym, 0)}**.`
                : `Un point de prix entier = 100 pb × ${mnt(25, cfg.sym, 0)} = ${mnt(2500, cfg.sym, 0)} par contrat. P&L = (${f(prix1, 2)} − ${f(prix0, 2)}) × ${f(2500, 0)} × ${f(n, 0)} × (${short ? '−1' : '+1'}) = **${mnt(pnl, cfg.sym, 0)}**.`,
            },
            {
              titre: en ? 'Cross-check by the ticks' : 'Recoupement par les ticks',
              contenu: en
                ? `${f(ticks, 0)} ticks × ${mnt(12.5, cfg.sym, 2)} × ${f(n, 0)} contracts × (${short ? '−1' : '+1'}) = **${mnt(pnl, cfg.sym, 0)}** — same number, the desk way. ${gagne ? (short ? 'Rates rose, the SELLER wins: that is exactly why a borrower hedges by selling these contracts.' : 'Rates fell, the BUYER wins: the long leg of the easing bet paid off.') : 'The position was on the wrong side of the convention: rates rose, the price fell, and the buyer paid for the sign error.'}`
                : `${f(ticks, 0)} ticks × ${mnt(12.5, cfg.sym, 2)} × ${f(n, 0)} contrats × (${short ? '−1' : '+1'}) = **${mnt(pnl, cfg.sym, 0)}** — même chiffre, façon desk. ${gagne ? (short ? 'Les taux ont monté, le VENDEUR gagne : c\'est exactement pourquoi un emprunteur se couvre en vendant ces contrats.' : 'Les taux ont baissé, l\'ACHETEUR gagne : la jambe longue du pari d\'assouplissement a payé.') : 'La position était du mauvais côté de la convention : les taux ont monté, le prix a baissé, et l\'acheteur a payé l\'erreur de signe.'}`,
            },
          ],
          pieges: [en
            ? `The borrower hedging a future rate rise SELLS the rate futures — the exact mirror of the FRA, where the same borrower is LONG. Two conventions, one protection.`
            : `L'emprunteur qui se couvre contre une hausse VEND le futures de taux — l'exact miroir du FRA, où le même emprunteur est LONG. Deux conventions, une même protection.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 5. m7-pb-05 — L'appel de marge : retour à l'INITIALE — N2           */
/* ------------------------------------------------------------------ */
const appelMarge: ProblemeMoule = {
  id: 'm7-pb-05', moduleId: M7,
  titre: "L'appel de marge : le versement qui ramène à l'initiale",
  titreEn: 'The margin call: the payment that restores the initial margin',
  typeDeCas: 'appels de marge',
  typeDeCasEn: 'margin calls',
  difficulte: 2,
  scenarios: ['Le trésorier long CAC 40 dans la tempête', 'La gérante et ses E-mini S&P secoués', 'Le prop junior long Euro Stoxx 50'],
  scenariosEn: ['The treasurer long CAC 40 in the storm', 'The manager and her battered E-mini S&P', 'The prop junior long Euro Stoxx 50'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes calibrées pour GARANTIR : pas d'appel au soir 1, appel au soir 2,
    // solde toujours positif (mi multiple de 400 ⇒ maintenance 75 % entière).
    const cfg = ([
      { indice: 'CAC 40', mult: 10, sym: '€', pMin: 740, pMax: 820, nMin: 2, nMax: 4, miMin: 14, miMax: 17, d1Min: 60, d1Max: 110, d2Min: 120, d2Max: 170, d3Min: 40, d3Max: 120 },
      { indice: 'E-mini S&P 500', mult: 50, sym: '$', pMin: 490, pMax: 560, nMin: 1, nMax: 2, miMin: 28, miMax: 35, d1Min: 20, d1Max: 50, d2Min: 55, d2Max: 90, d3Min: 20, d3Max: 70 },
      { indice: 'Euro Stoxx 50', mult: 10, sym: '€', pMin: 480, pMax: 530, nMin: 3, nMax: 6, miMin: 8, miMax: 11, d1Min: 40, d1Max: 75, d2Min: 75, d2Max: 130, d3Min: 30, d3Max: 90 },
    ] as const)[sIdx];
    const p0 = randInt(rng, cfg.pMin, cfg.pMax) * 10;
    const n = randInt(rng, cfg.nMin, cfg.nMax);
    const mi = randInt(rng, cfg.miMin, cfg.miMax) * 400;   // marge initiale PAR CONTRAT
    const ma = mi * 0.75;                                  // maintenance par contrat (75 %)
    const d1 = randInt(rng, cfg.d1Min, cfg.d1Max);
    const d2 = randInt(rng, cfg.d2Min, cfg.d2Max);
    const d3 = randInt(rng, cfg.d3Min, cfg.d3Max);
    const c1 = p0 - d1;
    const c2 = c1 - d2;
    const c3 = c2 + d3;
    const miTot = mi * n;
    const maTot = ma * n;
    const flux1 = margeVariation(p0, c1, cfg.mult, n, 1);  // négatif
    const flux2 = margeVariation(c1, c2, cfg.mult, n, 1);  // négatif
    const flux3 = margeVariation(c2, c3, cfg.mult, n, 1);  // positif
    const solde1 = miTot + flux1;                          // > maTot par construction
    const solde2 = solde1 + flux2;                         // < maTot par construction
    const appel = appelDeMarge(solde2, maTot, miTot);      // = miTot − solde2 > 0
    const appelFaux = maTot - solde2;                      // le « 600 € » du chapitre 2
    const soldeFinal = miTot + flux3;                      // après recomplètement
    const pnl = pnlFutures(p0, c3, cfg.mult, n, 1);        // = flux1 + flux2 + flux3 < 0
    const verseTotal = miTot + appel;

    const { en, f, mnt } = outils(langue);
    const desc = en
      ? `long ${f(n, 0)} ${cfg.indice} contract${n > 1 ? 's' : ''} at ${f(p0, 0)} points (multiplier ${mnt(cfg.mult, cfg.sym, 0)}/point); initial margin ${mnt(mi, cfg.sym, 0)} per contract, maintenance margin ${mnt(ma, cfg.sym, 0)} per contract; settlement prices: day 1 at ${f(c1, 0)}, day 2 at ${f(c2, 0)}, day 3 at ${f(c3, 0)}`
      : `acheteur de ${f(n, 0)} contrat${n > 1 ? 's' : ''} ${cfg.indice} à ${f(p0, 0)} points (multiplicateur ${mnt(cfg.mult, cfg.sym, 0)}/point) ; marge initiale ${mnt(mi, cfg.sym, 0)} par contrat, marge de maintenance ${mnt(ma, cfg.sym, 0)} par contrat ; cours de compensation : jour 1 à ${f(c1, 0)}, jour 2 à ${f(c2, 0)}, jour 3 à ${f(c3, 0)}`;
    const contexte = (en
      ? [
        `A treasurer pre-hedged an equity programme and the market turns against him for two straight sessions before bouncing: ${desc}. Walk the margin account through the storm — balance, trigger, the payment US futures convention actually demands, and the cash truth of the episode.`,
        `A portfolio manager runs a tactical long into a violent pullback: ${desc}. The middle office reconstructs the account evening by evening: when does the call trigger, for how much, and what does the week really cost in cash versus in P&L?`,
        `The prop desk's junior gets his first real margin call: ${desc}. The head of desk asks him to recite the mechanics with numbers — the balance path, the trigger threshold, the restoring payment, and the final reconciliation that separates treasury from P&L.`,
      ]
      : [
        `Un trésorier a pré-couvert un programme d'achat d'actions et le marché se retourne contre lui deux séances de suite avant de rebondir : ${desc}. Faites traverser la tempête au compte de marge — solde, déclencheur, le versement que la convention américaine des futures exige vraiment, et la vérité de caisse de l'épisode.`,
        `Une gérante tient une position longue tactique dans une correction violente : ${desc}. Le middle office reconstitue le compte soir après soir : quand l'appel se déclenche-t-il, pour combien, et que coûte vraiment la semaine en cash par rapport au P&L ?`,
        `Le junior du prop desk reçoit son premier vrai appel de marge : ${desc}. Le chef de desk lui demande de réciter la mécanique en chiffres — la trajectoire du solde, le seuil de déclenchement, le versement de recomplètement, et la réconciliation finale qui sépare la trésorerie du P&L.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The initial deposit' : 'a) Le dépôt initial',
          enonce: en
            ? `What total initial margin do you post at the open, in ${cfg.sym}?`
            : `Quelle marge initiale totale déposez-vous à l'ouverture, en ${cfg.sym} ?`,
          reponse: miTot, tolerance: 0.005, unite: cfg.sym,
          etapes: [{
            titre: en ? 'Two thresholds, per contract then in total' : 'Deux seuils, par contrat puis en total',
            contenu: en
              ? `Initial margin = ${f(mi, 0)} × ${f(n, 0)} = **${mnt(miTot, cfg.sym, 0)}**, and the maintenance floor sits at ${f(ma, 0)} × ${f(n, 0)} = ${mnt(maTot, cfg.sym, 0)}. The account may breathe between the two; it must never REST below the second.`
              : `Marge initiale = ${f(mi, 0)} × ${f(n, 0)} = **${mnt(miTot, cfg.sym, 0)}**, et le plancher de maintenance se situe à ${f(ma, 0)} × ${f(n, 0)} = ${mnt(maTot, cfg.sym, 0)}. Le compte peut respirer entre les deux ; il ne doit jamais RESTER sous le second.`,
          }],
        },
        {
          intitule: en ? 'b) The balance after two bad evenings' : 'b) Le solde après deux mauvais soirs',
          enonce: en
            ? `After the settlements of day 1 (${f(c1, 0)}) and day 2 (${f(c2, 0)}), what is the margin account balance, before any reaction, in ${cfg.sym}?`
            : `Après les compensations du jour 1 (${f(c1, 0)}) et du jour 2 (${f(c2, 0)}), quel est le solde du compte de marge, avant toute réaction, en ${cfg.sym} ?`,
          reponse: solde2, tolerance: 0.005, unite: cfg.sym,
          etapes: [
            {
              titre: en ? 'Evening 1: debited, but no call' : 'Soir 1 : débité, mais pas d\'appel',
              contenu: en
                ? `Flow = (${f(c1, 0)} − ${f(p0, 0)}) × ${f(cfg.mult, 0)} × ${f(n, 0)} = ${mnt(flux1, cfg.sym, 0)} → balance ${f(miTot, 0)} − ${f(-flux1, 0)} = ${mnt(solde1, cfg.sym, 0)}. Still ABOVE the maintenance of ${f(maTot, 0)}: the clearing house says nothing — the trigger is strictly below the floor, however painful the day.`
                : `Flux = (${f(c1, 0)} − ${f(p0, 0)}) × ${f(cfg.mult, 0)} × ${f(n, 0)} = ${mnt(flux1, cfg.sym, 0)} → solde ${f(miTot, 0)} − ${f(-flux1, 0)} = ${mnt(solde1, cfg.sym, 0)}. Encore AU-DESSUS de la maintenance de ${f(maTot, 0)} : la chambre ne dit rien — le déclencheur est strictement sous le plancher, quelle que soit la douleur du jour.`,
            },
            {
              titre: en ? 'Evening 2: through the floor' : 'Soir 2 : à travers le plancher',
              contenu: en
                ? `Flow = (${f(c2, 0)} − ${f(c1, 0)}) × ${f(cfg.mult, 0)} × ${f(n, 0)} = ${mnt(flux2, cfg.sym, 0)} → balance **${mnt(solde2, cfg.sym, 0)}**, below the maintenance of ${mnt(maTot, cfg.sym, 0)}: the margin call lands before tomorrow's open.`
                : `Flux = (${f(c2, 0)} − ${f(c1, 0)}) × ${f(cfg.mult, 0)} × ${f(n, 0)} = ${mnt(flux2, cfg.sym, 0)} → solde **${mnt(solde2, cfg.sym, 0)}**, sous la maintenance de ${mnt(maTot, cfg.sym, 0)} : l'appel de marge tombe avant l'ouverture de demain.`,
            },
          ],
          pieges: [en
            ? `Triggering an imaginary call on day 1 is the symmetric trap: the size of the daily loss is irrelevant, only the LEVEL of the balance against the floor counts.`
            : `Déclencher un appel imaginaire dès le jour 1 est le piège symétrique : l'ampleur de la perte du jour est sans importance, seul compte le NIVEAU du solde face au plancher.`],
        },
        {
          intitule: en ? 'c) The margin call' : "c) L'appel de marge",
          enonce: en
            ? `How much must you wire to answer the call, in ${cfg.sym}?`
            : `Combien devez-vous virer pour honorer l'appel, en ${cfg.sym} ?`,
          reponse: appel, tolerance: 0.005, unite: cfg.sym,
          etapes: [{
            titre: en ? 'Back to the INITIAL margin, not the maintenance' : "Retour à la marge INITIALE, pas à la maintenance",
            contenu: en
              ? `US futures convention: the maintenance is the TRIGGER, the initial margin is the TARGET. Call = ${f(miTot, 0)} − ${f(solde2, 0)} = **${mnt(appel, cfg.sym, 0)}**. Topping up only to the floor would leave the account surfing the threshold: one adverse tick tomorrow and the call fires again — the cushion must be rebuilt whole.`
              : `Convention américaine des futures : la maintenance est le DÉCLENCHEUR, la marge initiale est la CIBLE. Appel = ${f(miTot, 0)} − ${f(solde2, 0)} = **${mnt(appel, cfg.sym, 0)}**. Ne recompléter que jusqu'au plancher laisserait le compte surfer sur le seuil : un tick adverse demain et l'appel repart — le coussin doit être reconstruit en entier.`,
          }],
          pieges: [en
            ? `Paying just enough to cross back over the floor (${f(maTot, 0)} − ${f(solde2, 0)} = ${mnt(appelFaux, cfg.sym, 0)}) is the classic — and costly — interview mistake: the call restores the INITIAL margin.`
            : `Verser juste de quoi repasser le plancher (${f(maTot, 0)} − ${f(solde2, 0)} = ${mnt(appelFaux, cfg.sym, 0)}) est l'erreur d'entretien classique — et coûteuse : l'appel ramène à la marge INITIALE.`],
        },
        {
          intitule: en ? 'd) The cash truth after the rebound' : 'd) La vérité de caisse après le rebond',
          enonce: en
            ? `Day 3 settles at ${f(c3, 0)}. What is the position's total P&L since the open, sign included, in ${cfg.sym}?`
            : `Le jour 3 compense à ${f(c3, 0)}. Quel est le P&L total de la position depuis l'ouverture, signe compris, en ${cfg.sym} ?`,
          reponse: pnl, tolerance: Math.max(10, Math.abs(pnl) * 0.01), toleranceMode: 'absolu', unite: cfg.sym,
          etapes: [
            {
              titre: en ? 'Sum the three evenings' : 'Sommer les trois soirs',
              contenu: en
                ? `P&L = ${f(flux1, 0)} + ${f(flux2, 0)} + ${f(flux3, 0)} = (${f(c3, 0)} − ${f(p0, 0)}) × ${f(cfg.mult, 0)} × ${f(n, 0)} = **${mnt(pnl, cfg.sym, 0)}**: the rebound of day 3 (${mnt(flux3, cfg.sym, 0)} credited on the replenished account) repairs only part of the damage.`
                : `P&L = ${f(flux1, 0)} + ${f(flux2, 0)} + ${f(flux3, 0)} = (${f(c3, 0)} − ${f(p0, 0)}) × ${f(cfg.mult, 0)} × ${f(n, 0)} = **${mnt(pnl, cfg.sym, 0)}** : le rebond du jour 3 (${mnt(flux3, cfg.sym, 0)} crédités sur le compte recomplété) ne répare qu'une partie du dégât.`,
            },
            {
              titre: en ? 'Reconcile the cash — and read the lesson' : 'Réconcilier la caisse — et lire la leçon',
              contenu: en
                ? `Cash wired in: ${f(miTot, 0)} + ${f(appel, 0)} = ${mnt(verseTotal, cfg.sym, 0)}; account balance: ${f(miTot, 0)} + ${f(flux3, 0)} = ${mnt(soldeFinal, cfg.sym, 0)}; difference = **${mnt(pnl, cfg.sym, 0)}** — books square. The position demanded ${mnt(appel, cfg.sym, 0)} of fresh cash at the worst moment, NOT because the final P&L required it: that is the Metallgesellschaft lesson in miniature — size the position on the cash you can mobilise in the storm.`
                : `Cash viré : ${f(miTot, 0)} + ${f(appel, 0)} = ${mnt(verseTotal, cfg.sym, 0)} ; solde du compte : ${f(miTot, 0)} + ${f(flux3, 0)} = ${mnt(soldeFinal, cfg.sym, 0)} ; différence = **${mnt(pnl, cfg.sym, 0)}** — la caisse boucle. La position a exigé ${mnt(appel, cfg.sym, 0)} d'argent frais au pire moment, PAS parce que le P&L final le demandait : c'est la leçon Metallgesellschaft en miniature — dimensionnez la position sur le cash mobilisable dans la tempête.`,
            },
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 6. m7-pb-06 — Le trésorier FRA : geler le taux de demain — N2       */
/* ------------------------------------------------------------------ */
const tresorierFra: ProblemeMoule = {
  id: 'm7-pb-06', moduleId: M7,
  titre: 'Le trésorier FRA : geler aujourd\'hui le taux de demain',
  titreEn: 'The FRA treasurer: freezing tomorrow\'s rate today',
  typeDeCas: 'couverture de taux',
  typeDeCasEn: 'rate hedging',
  difficulte: 2,
  scenarios: ["La trésorière d'ETI et son FRA 6×12", "Le directeur financier et son FRA 3×9", 'Le trésorier déçu — les taux ont baissé'],
  scenariosEn: ['The mid-cap treasurer and her 6×12 FRA', 'The CFO and his 3×9 FRA', 'The disappointed treasurer — rates fell'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // dSgn : +1 ⇒ les taux montent (le long gagne), −1 ⇒ ils baissent (il paie).
    const cfg = ([
      { lbl: '6×12', t1: 0.5, t2: 1, nMin: 5, nMax: 20, rcMin: 2, rcMax: 3.5, pMin: 0.2, pMax: 0.8, dSgn: 1, dMin: 0.5, dMax: 1.5 },
      { lbl: '3×9', t1: 0.25, t2: 0.75, nMin: 10, nMax: 50, rcMin: 2.5, rcMax: 4, pMin: 0.1, pMax: 0.5, dSgn: 1, dMin: 0.8, dMax: 2 },
      { lbl: '6×12', t1: 0.5, t2: 1, nMin: 5, nMax: 25, rcMin: 3, rcMax: 4.5, pMin: 0.2, pMax: 0.6, dSgn: -1, dMin: 0.5, dMax: 1.2 },
    ] as const)[sIdx];
    const rCourt = randFloat(rng, cfg.rcMin, cfg.rcMax, 1);    // taux du pilier court
    const rLong = r1(rCourt + randFloat(rng, cfg.pMin, cfg.pMax, 1)); // pilier long, courbe croissante
    const N = randInt(rng, cfg.nMin, cfg.nMax);                // notionnel en M€
    const delta = randFloat(rng, cfg.dMin, cfg.dMax, 1) * cfg.dSgn;
    const periode = cfg.t2 - cfg.t1;                           // 0,5 an dans les trois scénarios
    const fra = r4(tauxForwardImplicite(rCourt, cfg.t1, rLong, cfg.t2));
    const tc = r2(fra + delta);                                // taux constaté au fixing
    const regl = r2(reglementFra(N, fra, tc, periode));
    const differentiel = r2(N * 1e6 * ((tc - fra) / 100) * periode);
    const interets = r2(N * 1e6 * (tc / 100) * periode);
    const reglCapitalise = regl * (1 + (tc / 100) * periode);  // ≈ differentiel
    const tauxEff = r4(((interets - reglCapitalise) / (N * 1e6 * periode)) * 100); // ≈ fra
    const hausse = cfg.dSgn === 1;
    const mCourt = Math.round(cfg.t1 * 12);
    const mLong = Math.round(cfg.t2 * 12);

    const { en, f, pct, mnt } = outils(langue);
    const desc = en
      ? `borrowing need: ${f(N, 0)} million euros, starting in ${f(mCourt, 0)} months, for 6 months; today the money market quotes ${pct(rCourt, 1)} at ${f(mCourt, 0)} months and ${pct(rLong, 1)} at ${f(mLong, 0)} months (linear convention)`
      : `besoin d'emprunt : ${f(N, 0)} millions d'euros, départ dans ${f(mCourt, 0)} mois, pour 6 mois ; le marché monétaire cote aujourd'hui ${pct(rCourt, 1)} à ${f(mCourt, 0)} mois et ${pct(rLong, 1)} à ${f(mLong, 0)} mois (convention linéaire)`;
    const fixing = en
      ? `On fixing day, the 6-month rate comes out at ${pct(tc, 2)}`
      : `Au jour du fixing, le taux 6 mois ressort à ${pct(tc, 2)}`;
    const contexte = (en
      ? [
        `A mid-cap treasurer must fund an inventory peak and wants no surprise on her future borrowing: ${desc}. She buys (goes long) a ${cfg.lbl} FRA from her bank. ${fixing} — rates rose. Unroll the whole episode: the fair FRA rate, the settlement, the loan interest, and the all-in rate that proves the freeze worked.`,
        `A CFO locks the rate of a bridge loan months in advance: ${desc}. He signs a ${cfg.lbl} FRA, payer of the fixed rate. ${fixing}. The board asks for the four numbers: the FRA rate built from the curve, the discounted settlement, the interest bill, and the effective rate all-in.`,
        `A treasurer froze his borrowing rate with a ${cfg.lbl} FRA — and watches rates FALL: ${desc}. ${fixing} — below the locked rate, and the bank now debits him at settlement. Before calling the hedge "a mistake", compute: the FRA rate, the (negative) settlement, the cheaper loan interest, and the all-in rate — the freeze worked exactly as promised.`,
      ]
      : [
        `Une trésorière d'ETI doit financer un pic de stocks et ne veut aucune surprise sur son emprunt futur : ${desc}. Elle achète (position longue) un FRA ${cfg.lbl} auprès de sa banque. ${fixing} — les taux ont monté. Déroulez l'épisode complet : le taux d'équilibre du FRA, le règlement, les intérêts de l'emprunt, et le taux tout compris qui prouve que le gel a fonctionné.`,
        `Un directeur financier verrouille des mois à l'avance le taux d'un crédit relais : ${desc}. Il signe un FRA ${cfg.lbl}, payeur du taux fixe. ${fixing}. Le conseil demande les quatre chiffres : le taux FRA fabriqué depuis la courbe, le règlement actualisé, la facture d'intérêts, et le taux effectif tout compris.`,
        `Un trésorier a gelé son taux d'emprunt avec un FRA ${cfg.lbl} — et regarde les taux BAISSER : ${desc}. ${fixing} — sous le taux garanti, et la banque le débite au règlement. Avant de déclarer la couverture « une erreur », calculez : le taux du FRA, le règlement (négatif), les intérêts d'emprunt allégés, et le taux tout compris — le gel a fonctionné exactement comme promis.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? `a) The fair ${cfg.lbl} FRA rate` : `a) Le taux d'équilibre du FRA ${cfg.lbl}`,
          enonce: en
            ? `From the curve (${pct(rCourt, 1)} at ${f(mCourt, 0)} months, ${pct(rLong, 1)} at ${f(mLong, 0)} months, linear), what rate can the bank guarantee, in %?`
            : `À partir de la courbe (${pct(rCourt, 1)} à ${f(mCourt, 0)} mois, ${pct(rLong, 1)} à ${f(mLong, 0)} mois, linéaire), quel taux la banque peut-elle garantir, en % ?`,
          reponse: fra, tolerance: 0.005, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Two riskless paths to the same horizon' : 'Deux chemins sans risque vers le même horizon',
            contenu: en
              ? `Investing in one block to ${f(mLong, 0)} months must equal investing ${f(mCourt, 0)} months then rolling at the forward: $f = \\frac{1}{T_2 - T_1}\\left(\\frac{1 + r_2 T_2}{1 + r_1 T_1} - 1\\right)$ = [(${f(1 + (rLong / 100) * cfg.t2, 5)} / ${f(1 + (rCourt / 100) * cfg.t1, 5)}) − 1] / ${f(periode, 2)} = **${pct(fra, 4)}**. Not a forecast — a fabrication: borrow long, relend short, and this rate falls out.`
              : `Placer d'un bloc jusqu'à ${f(mLong, 0)} mois doit égaler placer ${f(mCourt, 0)} mois puis rouler au forward : $f = \\frac{1}{T_2 - T_1}\\left(\\frac{1 + r_2 T_2}{1 + r_1 T_1} - 1\\right)$ = [(${f(1 + (rLong / 100) * cfg.t2, 5)} / ${f(1 + (rCourt / 100) * cfg.t1, 5)}) − 1] / ${f(periode, 2)} = **${pct(fra, 4)}**. Pas une prévision — une fabrication : emprunter long, replacer court, et ce taux sort tout seul.`,
          }],
          pieges: [en
            ? `Linear convention, money-market world: on a FLAT curve this formula gives a forward slightly BELOW the flat rate (linear interest does not compound) — a different number from the compounded forward of module 4.`
            : `Convention linéaire, monde monétaire : sur une courbe PLATE, cette formule donne un forward légèrement SOUS le taux plat (le linéaire ne compose pas) — un chiffre différent du forward composé du module 4.`],
        },
        {
          intitule: en ? 'b) The settlement at fixing' : 'b) Le règlement au fixing',
          enonce: en
            ? `The observed rate is ${pct(tc, 2)}. What settlement does the long receive (sign included), in €?`
            : `Le taux constaté est ${pct(tc, 2)}. Quel règlement le long reçoit-il (signe compris), en € ?`,
          reponse: regl, tolerance: Math.max(1, Math.abs(regl) * 0.005), toleranceMode: 'absolu', unite: '€',
          etapes: [
            {
              titre: en ? 'The interest differential first' : "Le différentiel d'intérêts d'abord",
              contenu: en
                ? `${f(N, 0)} 000 000 × (${f(tc, 2)} − ${f(fra, 4)})/100 × ${f(periode, 2)} = ${mnt(differentiel, '€', 0)} — the over- or under-cost of interest on the covered period.`
                : `${f(N, 0)} 000 000 × (${f(tc, 2)} − ${f(fra, 4)})/100 × ${f(periode, 2)} = ${mnt(differentiel, '€', 0)} — le sur- ou sous-coût d'intérêts sur la période couverte.`,
            },
            {
              titre: en ? 'Then the discounting — FRA convention' : "Puis l'actualisation — convention FRA",
              contenu: en
                ? `Interest is suffered at the END of the period, but the FRA settles NOW, at its start: divide by (1 + ${f(tc, 2)}% × ${f(periode, 2)}) = ${f(1 + (tc / 100) * periode, 5)} → settlement = **${mnt(regl, '€', 2)}**. ${hausse ? 'Rates rose: the long (fixed-rate payer) RECEIVES — the borrower\'s wound is compensated.' : 'Rates fell: the long PAYS — but he borrows more cheaply in exchange, see d).'}`
                : `Les intérêts se subissent en FIN de période, mais le FRA se règle MAINTENANT, à son début : on divise par (1 + ${f(tc, 2)} % × ${f(periode, 2)}) = ${f(1 + (tc / 100) * periode, 5)} → règlement = **${mnt(regl, '€', 2)}**. ${hausse ? 'Les taux ont monté : le long (payeur du fixe) REÇOIT — la blessure de l\'emprunteur est compensée.' : 'Les taux ont baissé : le long PAIE — mais il emprunte moins cher en échange, voir d).'}`,
            },
          ],
          pieges: [en
            ? `Forgetting the discounting overstates the settlement: paying the full differential today for a harm dated 6 months later would overpay it. And the sign: the LONG FRA wins when rates RISE.`
            : `Oublier l'actualisation gonfle le règlement : payer aujourd'hui le différentiel plein pour un préjudice daté de 6 mois plus tard serait trop payer. Et le signe : le LONG du FRA gagne quand les taux MONTENT.`],
        },
        {
          intitule: en ? 'c) The loan interest' : "c) Les intérêts de l'emprunt",
          enonce: en
            ? `The loan is taken at the observed rate of ${pct(tc, 2)} for 6 months. What interest will be paid at its term, in €?`
            : `L'emprunt est contracté au taux constaté de ${pct(tc, 2)} pour 6 mois. Quels intérêts seront payés à son terme, en € ?`,
          reponse: interets, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'Linear interest on the period' : 'Intérêts linéaires sur la période',
            contenu: en
              ? `Interest = ${f(N, 0)} 000 000 × ${f(tc, 2)}% × ${f(periode, 2)} = **${mnt(interets, '€', 0)}**, due at the end of the 6 months. ${hausse ? 'More than budgeted at the FRA rate — exactly what the settlement of b) compensates.' : 'Less than the FRA rate would have cost — exactly what the settlement of b) claws back.'}`
              : `Intérêts = ${f(N, 0)} 000 000 × ${f(tc, 2)} % × ${f(periode, 2)} = **${mnt(interets, '€', 0)}**, dus à la fin des 6 mois. ${hausse ? 'Plus que le budget au taux FRA — exactement ce que le règlement du b) compense.' : 'Moins que ce qu\'aurait coûté le taux FRA — exactement ce que le règlement du b) reprend.'}`,
          }],
        },
        {
          intitule: en ? 'd) The all-in effective rate' : 'd) Le taux effectif tout compris',
          enonce: en
            ? `Reinvesting (or funding) the settlement at ${pct(tc, 2)} over the 6 months, what effective annual rate does the treasurer pay all-in, in %?`
            : `En replaçant (ou finançant) le règlement à ${pct(tc, 2)} sur les 6 mois, quel taux annuel effectif le trésorier paie-t-il tout compris, en % ?`,
          reponse: tauxEff, tolerance: 0.01, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'The settlement grows back into the differential' : 'Le règlement repousse en différentiel plein',
              contenu: en
                ? `${mnt(regl, '€', 2)} placed 6 months at ${pct(tc, 2)} becomes ${mnt(r2(reglCapitalise), '€', 0)} — the full interest differential, landing exactly when the interest is due. Net cost = ${f(interets, 0)} − ${f(r2(reglCapitalise), 0)} = ${mnt(r2(interets - reglCapitalise), '€', 0)}.`
                : `${mnt(regl, '€', 2)} placés 6 mois à ${pct(tc, 2)} redonnent ${mnt(r2(reglCapitalise), '€', 0)} — le différentiel d'intérêts plein, qui tombe exactement quand les intérêts sont dus. Coût net = ${f(interets, 0)} − ${f(r2(reglCapitalise), 0)} = ${mnt(r2(interets - reglCapitalise), '€', 0)}.`,
            },
            {
              titre: en ? 'The freeze, verified to the basis point' : 'Le gel, vérifié au point de base',
              contenu: en
                ? `Effective rate = net cost / (notional × ${f(periode, 2)}) = **${pct(tauxEff, 4)}** — the FRA rate of a), to the rounding. ${hausse ? 'Rates rose: the hedge paid.' : 'Rates fell: the hedge "cost" the windfall — and that is not a mistake. The treasurer\'s job was a certain rate, not a market view: judging a hedge ex post is judging fire insurance by whether the house burned.'}`
                : `Taux effectif = coût net / (notionnel × ${f(periode, 2)}) = **${pct(tauxEff, 4)}** — le taux FRA du a), aux arrondis près. ${hausse ? 'Les taux ont monté : la couverture a payé.' : 'Les taux ont baissé : la couverture a « coûté » l\'aubaine — et ce n\'est pas une erreur. Le métier du trésorier était un taux certain, pas une vue de marché : juger une couverture ex post, c\'est juger l\'assurance incendie sur l\'absence d\'incendie.'}`,
            },
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 7. m7-pb-07 — Cash-and-carry complet : l'arbitrage sans mise — N2   */
/* ------------------------------------------------------------------ */
const cashAndCarry: ProblemeMoule = {
  id: 'm7-pb-07', moduleId: M7,
  titre: 'Cash-and-carry complet : le profit sans mise ni risque',
  titreEn: 'A full cash-and-carry: profit with no stake and no risk',
  typeDeCas: 'arbitrage cash and carry',
  typeDeCasEn: 'cash-and-carry arbitrage',
  difficulte: 2,
  scenarios: ['Le desk d\'arbitrage indiciel sur le CAC 40', 'Le hedge fund face à un Euro Stoxx bradé', 'Le prop desk de Chicago sur l\'E-mini'],
  scenariosEn: ['The index arbitrage desk on the CAC 40', 'The hedge fund and a cut-price Euro Stoxx', 'The Chicago prop desk on the E-mini'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // cher : true ⇒ futures coté AU-DESSUS du théorique (cash and carry) ;
    // false ⇒ en dessous (reverse cash and carry).
    const cfg = ([
      { indice: 'CAC 40', mult: 10, sym: '€', pMin: 720, pMax: 820, T: 1, tLbl: '12 mois', tLblEn: '12 months', rMin: 3, rMax: 5, qMin: 1.5, qMax: 2.5, cher: true },
      { indice: 'Euro Stoxx 50', mult: 10, sym: '€', pMin: 470, pMax: 530, T: 0.5, tLbl: '6 mois', tLblEn: '6 months', rMin: 2.5, rMax: 4, qMin: 2.8, qMax: 3.6, cher: false },
      { indice: 'S&P 500 (E-mini)', mult: 50, sym: '$', pMin: 480, pMax: 560, T: 0.5, tLbl: '6 mois', tLblEn: '6 months', rMin: 4, rMax: 5.5, qMin: 1, qMax: 1.6, cher: true },
    ] as const)[sIdx];
    const S = randInt(rng, cfg.pMin, cfg.pMax) * 10;
    const r = randFloat(rng, cfg.rMin, cfg.rMax, 1);
    const q = randFloat(rng, cfg.qMin, cfg.qMax, 1);
    const off = randInt(rng, 20, 60) * (cfg.cher ? 1 : -1);
    const fTheoExact = prixForwardIndice(S, r, q, cfg.T);
    const fTheo = r2(fTheoExact);
    const fCote = Math.round((fTheoExact + off) / 5) * 5;  // cote ronde, multiple de 5
    const ecart = r2(fCote - fTheoExact);                  // |écart| ≥ 17,5 pts par construction
    const gain = r2(Math.abs(fCote - fTheoExact) * cfg.mult);
    const ST = randInt(rng, cfg.pMin - 40, cfg.pMax + 40) * 10; // l'indice à l'échéance
    // Le grand livre du corrigé (par contrat) :
    const panier = S * cfg.mult;
    const dette = r2(S * cfg.mult * (1 + (r / 100) * cfg.T));
    const divs = r2(S * cfg.mult * (q / 100) * cfg.T);
    const livraison = fCote * cfg.mult;
    const cher = cfg.cher;

    const { en, f, pct, mnt } = outils(langue);
    const tl = en ? cfg.tLblEn : cfg.tLbl;
    const desc = en
      ? `the ${cfg.indice} spot trades at ${f(S, 0)} points, funding costs ${pct(r, 1)} a year, the dividend yield is ${pct(q, 1)} a year — and the ${tl} futures (multiplier ${mnt(cfg.mult, cfg.sym, 0)}/point) quotes ${f(fCote, 0)} points`
      : `le ${cfg.indice} cote ${f(S, 0)} points au comptant, le financement coûte ${pct(r, 1)} par an, le rendement du dividende vaut ${pct(q, 1)} par an — et le futures ${tl} (multiplicateur ${mnt(cfg.mult, cfg.sym, 0)}/point) cote ${f(fCote, 0)} points`;
    const contexte = (en
      ? [
        `8:47 am on the index arbitrage desk: the fair-value sheet says the futures is rich — ${desc}. Before the basket traders wake up, you document the trade: theoretical forward, the gap, the riskless ledger at expiry, and the proof that the final index level is irrelevant.`,
        `A hedge fund screens for cheap futures and finds one: ${desc}. The investment memo must show the fair price, the discount, the reverse cash-and-carry ledger — and why the profit is locked whatever the market does.`,
        `On the Chicago prop desk, the morning run flags a mispricing: ${desc}. The junior writes the four-line case: fair forward, gap in points, arbitrage profit per contract at expiry, and the robustness check at a randomly chosen final index level.`,
      ]
      : [
        `8 h 47 au desk d'arbitrage indiciel : la feuille de fair value dit que le futures est riche — ${desc}. Avant le réveil des traders de panier, vous documentez l'opération : forward théorique, écart, grand livre sans risque à l'échéance, et la preuve que le niveau final de l'indice est sans importance.`,
        `Un hedge fund filtre les futures bon marché et en trouve un : ${desc}. La note d'investissement doit montrer le prix d'équilibre, la décote, le grand livre du reverse cash and carry — et pourquoi le profit est verrouillé quoi que fasse le marché.`,
        `Au prop desk de Chicago, le run du matin signale un déséquilibre : ${desc}. Au junior d'écrire le dossier en quatre lignes : forward d'équilibre, écart en points, profit d'arbitrage par contrat à l'échéance, et le test de robustesse à un niveau final de l'indice tiré au hasard.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The fair forward' : 'a) Le forward d\'équilibre',
          enonce: en
            ? `By cash and carry, what is the fair ${tl} forward price, in points?`
            : `Par le cash and carry, que vaut le forward ${tl} d'équilibre, en points ?`,
          reponse: fTheo, tolerance: 0.005, unite: 'pts',
          etapes: [{
            titre: en ? 'Spot plus net carry' : 'Le spot plus le portage net',
            contenu: en
              ? `$F = S \\times (1 + \\frac{r - q}{100} T)$ = ${f(S, 0)} × ${f(1 + ((r - q) / 100) * cfg.T, 5)} = **${f(fTheo, 2)} points**: financing adds ${f(r2(S * (r / 100) * cfg.T), 1)} points of cost, dividends give back ${f(r2(S * (q / 100) * cfg.T), 1)} points. This is the full cost of manufacturing the delivery yourself.`
              : `$F = S \\times (1 + \\frac{r - q}{100} T)$ = ${f(S, 0)} × ${f(1 + ((r - q) / 100) * cfg.T, 5)} = **${f(fTheo, 2)} points** : le financement ajoute ${f(r2(S * (r / 100) * cfg.T), 1)} points de coût, les dividendes en rendent ${f(r2(S * (q / 100) * cfg.T), 1)}. C'est le coût complet de la fabrication de la livraison soi-même.`,
          }],
        },
        {
          intitule: en ? 'b) The gap — and the right reflex' : "b) L'écart — et le bon réflexe",
          enonce: en
            ? `What gap does the quoted futures show against fair value (quoted − theoretical), in points, sign included?`
            : `Quel écart le futures coté affiche-t-il contre la valeur d'équilibre (coté − théorique), en points, signe compris ?`,
          reponse: ecart, tolerance: Math.max(1, Math.abs(ecart) * 0.05), toleranceMode: 'absolu', unite: 'pts',
          etapes: [{
            titre: en ? 'Rich or cheap — then act, never predict' : 'Riche ou bon marché — puis agir, jamais prédire',
            contenu: en
              ? `Gap = ${f(fCote, 0)} − ${f(fTheo, 2)} = **${f(ecart, 2)} points**: the futures is ${cher ? 'too RICH. The arbitrage: SELL the futures, borrow, BUY the basket and carry it — the cash and carry' : 'too CHEAP. The arbitrage: BUY the futures, sell the basket short, invest the proceeds — the reverse cash and carry'}. No view on the market enters at any step.`
              : `Écart = ${f(fCote, 0)} − ${f(fTheo, 2)} = **${f(ecart, 2)} points** : le futures est ${cher ? 'trop RICHE. L\'arbitrage : VENDRE le futures, emprunter, ACHETER le panier et le porter — le cash and carry' : 'trop BON MARCHÉ. L\'arbitrage : ACHETER le futures, vendre le panier à découvert, placer le produit — le reverse cash and carry'}. Aucune vue de marché n'entre à aucune étape.`,
          }],
          pieges: [en
            ? `${cher ? 'Selling the futures "and waiting for it to come back" WITHOUT holding the basket is a directional bet, not an arbitrage' : 'Buying the futures "because it is cheap" WITHOUT shorting the basket is a directional bet, not an arbitrage'}: the lock comes from holding both legs to expiry.`
            : `${cher ? 'Vendre le futures « en attendant qu\'il revienne » SANS détenir le panier est un pari directionnel, pas un arbitrage' : 'Acheter le futures « parce qu\'il est bon marché » SANS vendre le panier est un pari directionnel, pas un arbitrage'} : le verrou vient de la détention des deux jambes jusqu'à l'échéance.`],
        },
        {
          intitule: en ? 'c) The ledger at expiry' : 'c) Le grand livre à l\'échéance',
          enonce: en
            ? `Holding the position to expiry, what is the arbitrage profit per contract, in ${cfg.sym}?`
            : `En tenant la position jusqu'à l'échéance, quel est le profit d'arbitrage par contrat, en ${cfg.sym} ?`,
          reponse: gain, tolerance: Math.max(5, gain * 0.02), toleranceMode: 'absolu', unite: cfg.sym,
          etapes: [{
            titre: en ? 'Every line was fixed on day one' : 'Chaque ligne était figée au premier jour',
            contenu: en
              ? `${cher
                ? `Day 1: borrow ${mnt(panier, cfg.sym, 0)}, buy the basket (${f(S, 0)} pts × ${f(cfg.mult, 0)}), sell the futures at ${f(fCote, 0)}. At expiry: deliver against ${mnt(livraison, cfg.sym, 0)}, pocket ${mnt(divs, cfg.sym, 0)} of dividends, repay ${mnt(dette, cfg.sym, 0)} of debt → ${f(livraison, 0)} + ${f(divs, 0)} − ${f(dette, 0)} = **${mnt(gain, cfg.sym, 2)}**`
                : `Day 1: short the basket for ${mnt(panier, cfg.sym, 0)} (${f(S, 0)} pts × ${f(cfg.mult, 0)}), invest the proceeds at ${pct(r, 1)}, buy the futures at ${f(fCote, 0)}. At expiry: the deposit returns ${mnt(dette, cfg.sym, 0)}, hand back ${mnt(divs, cfg.sym, 0)} of dividends to the stock lender, take delivery against ${mnt(livraison, cfg.sym, 0)} → ${f(dette, 0)} − ${f(divs, 0)} − ${f(livraison, 0)} = **${mnt(gain, cfg.sym, 2)}**`} — the ${f(r2(Math.abs(ecart)), 2)} points of gap, times the multiplier, with zero initial outlay.`
              : `${cher
                ? `Jour J : emprunter ${mnt(panier, cfg.sym, 0)}, acheter le panier (${f(S, 0)} pts × ${f(cfg.mult, 0)}), vendre le futures à ${f(fCote, 0)}. À l'échéance : livrer contre ${mnt(livraison, cfg.sym, 0)}, encaisser ${mnt(divs, cfg.sym, 0)} de dividendes, rembourser ${mnt(dette, cfg.sym, 0)} de dette → ${f(livraison, 0)} + ${f(divs, 0)} − ${f(dette, 0)} = **${mnt(gain, cfg.sym, 2)}**`
                : `Jour J : vendre le panier à découvert pour ${mnt(panier, cfg.sym, 0)} (${f(S, 0)} pts × ${f(cfg.mult, 0)}), placer le produit à ${pct(r, 1)}, acheter le futures à ${f(fCote, 0)}. À l'échéance : le placement rend ${mnt(dette, cfg.sym, 0)}, reverser ${mnt(divs, cfg.sym, 0)} de dividendes au prêteur de titres, prendre livraison contre ${mnt(livraison, cfg.sym, 0)} → ${f(dette, 0)} − ${f(divs, 0)} − ${f(livraison, 0)} = **${mnt(gain, cfg.sym, 2)}**`} — les ${f(r2(Math.abs(ecart)), 2)} points d'écart, fois le multiplicateur, sans aucune mise initiale.`,
          }],
        },
        {
          intitule: en ? `d) The robustness check at ${f(ST, 0)} points` : `d) Le test de robustesse à ${f(ST, 0)} points`,
          enonce: en
            ? `Suppose the index finishes at ${f(ST, 0)} points. What is the arbitrageur's profit per contract then, in ${cfg.sym}?`
            : `Supposez que l'indice termine à ${f(ST, 0)} points. Quel est alors le profit de l'arbitragiste par contrat, en ${cfg.sym} ?`,
          reponse: gain, tolerance: Math.max(5, gain * 0.02), toleranceMode: 'absolu', unite: cfg.sym,
          etapes: [{
            titre: en ? 'The index level cancels out, line by line' : 'Le niveau de l\'indice s\'annule, ligne à ligne',
            contenu: en
              ? `At ${f(ST, 0)}: ${cher
                ? `the basket is worth ${mnt(ST * cfg.mult, cfg.sym, 0)}, and the short futures settles (${f(fCote, 0)} − ${f(ST, 0)}) × ${f(cfg.mult, 0)} = ${mnt((fCote - ST) * cfg.mult, cfg.sym, 0)}: together, ${mnt(livraison, cfg.sym, 0)} — the sale at ${f(fCote, 0)} was locked from day one`
                : `buying the basket back costs ${mnt(ST * cfg.mult, cfg.sym, 0)}, and the long futures settles (${f(ST, 0)} − ${f(fCote, 0)}) × ${f(cfg.mult, 0)} = ${mnt((ST - fCote) * cfg.mult, cfg.sym, 0)}: together, a repurchase at ${mnt(livraison, cfg.sym, 0)} — locked from day one`}. Profit: **${mnt(gain, cfg.sym, 2)}**, identical to c). ${f(ST, 0)}, ${f(S, 0)} or anything else: $S_T$ appears in both legs with opposite signs and vanishes. That is what "riskless" means — and that is why this arbitrage, run by every desk, is precisely what pins the futures to its fair value.`
              : `À ${f(ST, 0)} : ${cher
                ? `le panier vaut ${mnt(ST * cfg.mult, cfg.sym, 0)}, et le futures vendu règle (${f(fCote, 0)} − ${f(ST, 0)}) × ${f(cfg.mult, 0)} = ${mnt((fCote - ST) * cfg.mult, cfg.sym, 0)} : ensemble, ${mnt(livraison, cfg.sym, 0)} — la vente à ${f(fCote, 0)} était verrouillée dès le premier jour`
                : `racheter le panier coûte ${mnt(ST * cfg.mult, cfg.sym, 0)}, et le futures acheté règle (${f(ST, 0)} − ${f(fCote, 0)}) × ${f(cfg.mult, 0)} = ${mnt((ST - fCote) * cfg.mult, cfg.sym, 0)} : ensemble, un rachat à ${mnt(livraison, cfg.sym, 0)} — verrouillé dès le premier jour`}. Profit : **${mnt(gain, cfg.sym, 2)}**, identique au c). ${f(ST, 0)}, ${f(S, 0)} ou n'importe quoi d'autre : $S_T$ apparaît dans les deux jambes avec des signes opposés et disparaît. C'est le sens du mot « sans risque » — et c'est pourquoi cet arbitrage, mené par tous les desks, est précisément ce qui soude le futures à sa valeur d'équilibre.`,
          }],
          pieges: [en
            ? `If your answer in d) depends on ${f(ST, 0)}, one leg of the ledger is missing: an arbitrage whose result moves with the market is not an arbitrage.`
            : `Si votre réponse en d) dépend de ${f(ST, 0)}, une jambe du grand livre manque : un arbitrage dont le résultat bouge avec le marché n'est pas un arbitrage.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 8. m7-pb-08 — Swap corporate : la dette fixe synthétique — N2       */
/* ------------------------------------------------------------------ */
const swapCorporate: ProblemeMoule = {
  id: 'm7-pb-08', moduleId: M7,
  titre: 'Swap corporate : fabriquer une dette fixe sans renégocier',
  titreEn: 'Corporate swap: building fixed-rate debt without renegotiating',
  typeDeCas: 'swap de taux',
  typeDeCasEn: 'interest rate swap',
  difficulte: 2,
  scenarios: ["L'ETI endettée à Euribor + marge", 'Le promoteur et son crédit de 4 ans', 'Le corporate face à la courbe inversée'],
  scenariosEn: ['The mid-cap borrowing at Euribor + spread', 'The developer and his 4-year loan', 'The corporate facing an inverted curve'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // inverse : courbe décroissante (le paritaire s'installe SOUS le taux 1 an).
    const cfg = ([
      { ans: 3, nMin: 20, nMax: 80, z1Min: 2, z1Max: 3.2, mMin: 0.8, mMax: 1.6, inverse: false },
      { ans: 4, nMin: 10, nMax: 50, z1Min: 2.4, z1Max: 3.4, mMin: 1.0, mMax: 2.0, inverse: false },
      { ans: 3, nMin: 30, nMax: 120, z1Min: 3.6, z1Max: 4.6, mMin: 0.8, mMax: 1.5, inverse: true },
    ] as const)[sIdx];
    const z1 = randFloat(rng, cfg.z1Min, cfg.z1Max, 1);
    const zs: number[] = [z1];
    for (let i = 1; i < cfg.ans; i++) {
      zs.push(r1(zs[i - 1] + randFloat(rng, 0.2, 0.5, 1) * (cfg.inverse ? -1 : 1)));
    }
    const N = randInt(rng, cfg.nMin, cfg.nMax);            // notionnel en M€
    const marge = randFloat(rng, cfg.mMin, cfg.mMax, 1);   // marge de crédit, % au-dessus de l'Euribor
    const parExact = tauxSwapParitaire(zs);
    const par = r4(parExact);
    const dfs = zs.map((z, i) => facteurActualisation(z, i + 1));
    const sommeDf = dfs.reduce((a, b) => a + b, 0);
    const fluxNet1 = r2(N * 1e6 * ((z1 - par) / 100));     // payeur fixe, année 1 (1er fixing = z1)
    const coutTotal = r4(parExact + marge);
    const facture = r2(N * 1e6 * ((parExact + marge) / 100));
    const payeurPaieNet = fluxNet1 < 0;

    const { en, f, pct, mnt } = outils(langue);
    const courbeTxt = zs.map((z, i) => (en ? `${pct(z, 1)} at ${i + 1}y` : `${pct(z, 1)} à ${i + 1} an${i > 0 ? 's' : ''}`)).join(en ? ', ' : ', ');
    const desc = en
      ? `debt of ${f(N, 0)} million euros at Euribor 12m + ${pct(marge, 1)}, ${f(cfg.ans, 0)} years to run; zero curve: ${courbeTxt}; the first Euribor fixing is known at signature: ${pct(z1, 1)}`
      : `dette de ${f(N, 0)} millions d'euros à Euribor 12 mois + ${pct(marge, 1)}, ${f(cfg.ans, 0)} ans restant à courir ; courbe zéro : ${courbeTxt} ; le premier fixing de l'Euribor est connu à la signature : ${pct(z1, 1)}`;
    const contexte = (en
      ? [
        `A mid-cap suffers every rise of the Euribor on its floating-rate loan and wants certainty without renegotiating with its bank: ${desc}. It signs a payer swap (pays fixed, receives Euribor) on the full notional. Document the operation: the par rate, the first-year net flow, the all-in cost of the synthetic fixed debt, and the locked annual interest bill.`,
        `A property developer financed a programme at floating rate and the rate committee wants the exposure killed: ${desc}. A fixed-rate payer swap does the job. Compute the par swap rate from the curve, the first net exchange, the synthetic all-in rate — and the bill the CFO can finally write into the business plan.`,
        `With the curve INVERTED, a corporate hesitates: "paying fixed looks expensive". The treasurer runs the numbers anyway: ${desc}. Par rate below the 1-year rate, a first net flow that the payer RECEIVES — and an all-in cost locked for ${f(cfg.ans, 0)} years: the inversion changes the optics, not the mechanics.`,
      ]
      : [
        `Une ETI subit chaque hausse de l'Euribor sur son crédit à taux variable et veut de la certitude sans renégocier avec sa banque : ${desc}. Elle signe un swap payeur (paie le fixe, reçoit l'Euribor) sur tout le notionnel. Documentez l'opération : le taux paritaire, le flux net de la première année, le coût tout compris de la dette fixe synthétique, et la facture annuelle verrouillée.`,
        `Un promoteur immobilier a financé un programme à taux variable et le comité des taux veut tuer l'exposition : ${desc}. Un swap payeur fixe fait l'affaire. Calculez le taux de swap paritaire depuis la courbe, le premier échange net, le taux synthétique tout compris — et la facture que le directeur financier peut enfin inscrire au business plan.`,
        `Courbe INVERSÉE : un corporate hésite — « payer le fixe a l'air cher ». Le trésorier fait tourner les chiffres quand même : ${desc}. Paritaire sous le taux 1 an, un premier flux net que le payeur REÇOIT — et un coût tout compris verrouillé pour ${f(cfg.ans, 0)} ans : l'inversion change l'optique, pas la mécanique.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The par swap rate' : 'a) Le taux de swap paritaire',
          enonce: en
            ? `On this curve, at what fixed rate does the ${f(cfg.ans, 0)}-year swap (annual payments) sign for zero value, in %?`
            : `Sur cette courbe, à quel taux fixe le swap ${f(cfg.ans, 0)} ans (paiements annuels) se signe-t-il pour une valeur nulle, en % ?`,
          reponse: par, tolerance: 0.005, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'The discount factors first' : "Les facteurs d'actualisation d'abord",
              contenu: en
                ? `$df_i = 1/(1+z_i)^i$: ${dfs.map((d, i) => `df${i + 1} = ${f(r4(d), 4)}`).join(', ')} — sum ${f(r4(sommeDf), 4)}.`
                : `$df_i = 1/(1+z_i)^i$ : ${dfs.map((d, i) => `df${i + 1} = ${f(r4(d), 4)}`).join(', ')} — somme ${f(r4(sommeDf), 4)}.`,
            },
            {
              titre: en ? 'The coupon that amortises the notional\'s discount' : 'Le coupon qui amortit la décote du notionnel',
              contenu: en
                ? `$C^* = \\frac{1 - df_n}{\\sum df_i}$ = (1 − ${f(r4(dfs[dfs.length - 1]), 4)}) / ${f(r4(sommeDf), 4)} = **${pct(par, 4)}** — a weighted average of the curve, pulled towards the long pillars${cfg.inverse ? ', and BELOW the 1-year rate here: the inverted curve drags it down' : ''}.`
                : `$C^* = \\frac{1 - df_n}{\\sum df_i}$ = (1 − ${f(r4(dfs[dfs.length - 1]), 4)}) / ${f(r4(sommeDf), 4)} = **${pct(par, 4)}** — une moyenne pondérée de la courbe, tirée vers les piliers longs${cfg.inverse ? ', et SOUS le taux 1 an ici : la courbe inversée le tire vers le bas' : ''}.`,
            },
          ],
          pieges: [en
            ? `The par rate is NOT the arithmetic mean of the zero rates, nor the last pillar: it is (1 − df_n)/Σdf — the weighting comes from the discount factors.`
            : `Le paritaire n'est NI la moyenne arithmétique des taux zéro, NI le dernier pilier : c'est (1 − df_n)/Σdf — la pondération vient des facteurs d'actualisation.`],
        },
        {
          intitule: en ? 'b) The first net exchange' : 'b) Le premier échange net',
          enonce: en
            ? `End of year 1: the swap nets the fixed leg against the first Euribor fixing (${pct(z1, 1)}). What net flow does the company register, sign included, in €?`
            : `Fin d'année 1 : le swap compense la jambe fixe contre le premier fixing de l'Euribor (${pct(z1, 1)}). Quel flux net l'entreprise enregistre-t-elle, signe compris, en € ?`,
          reponse: fluxNet1, tolerance: Math.max(100, Math.abs(fluxNet1) * 0.01), toleranceMode: 'absolu', unite: '€',
          etapes: [{
            titre: en ? 'Receive the fixing, pay the par rate' : 'Recevoir le fixing, payer le paritaire',
            contenu: en
              ? `Net = ${f(N, 0)} 000 000 × (${f(z1, 1)} − ${f(par, 4)})/100 = **${mnt(fluxNet1, '€', 0)}**: the company ${payeurPaieNet ? 'PAYS the difference — the price of certainty in year 1, when the floating leg is still cheap' : 'RECEIVES the difference — on an inverted curve, the payer pockets cash in year 1, and gives it back later if the fixings fall as priced'}. Only this NET amount moves; the ${f(N, 0)} million notional never does.`
              : `Net = ${f(N, 0)} 000 000 × (${f(z1, 1)} − ${f(par, 4)})/100 = **${mnt(fluxNet1, '€', 0)}** : l'entreprise ${payeurPaieNet ? 'PAIE la différence — le prix de la certitude en année 1, quand la jambe variable est encore bon marché' : 'REÇOIT la différence — sur courbe inversée, le payeur encaisse en année 1, et rendra plus tard si les fixings baissent comme pricé'}. Seul ce montant NET circule ; les ${f(N, 0)} millions de notionnel, jamais.`,
          }],
          pieges: [en
            ? `The first fixing is the only floating flow known at signature — the later ones stay unknown, and pricing the swap never required forecasting them: the floating leg is worth par.`
            : `Le premier fixing est le seul flux variable connu à la signature — les suivants restent inconnus, et le pricing du swap n'a jamais demandé de les prévoir : la jambe variable vaut le pair.`],
        },
        {
          intitule: en ? 'c) The synthetic all-in cost' : 'c) Le coût synthétique tout compris',
          enonce: en
            ? `Loan (Euribor + ${pct(marge, 1)}) plus payer swap: what total fixed rate does the company pay, in %?`
            : `Crédit (Euribor + ${pct(marge, 1)}) plus swap payeur : quel taux fixe total l'entreprise paie-t-elle, en % ?`,
          reponse: coutTotal, tolerance: 0.005, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The Euribor cancels out' : "L'Euribor s'annule",
            contenu: en
              ? `Pay the bank (Euribor + ${f(marge, 1)}), receive Euribor from the swap, pay the fixed ${f(par, 4)}: the Euribor appears once in each direction and vanishes. All-in cost = ${f(par, 4)} + ${f(marge, 1)} = **${pct(coutTotal, 4)}**, whatever the fixings do for ${f(cfg.ans, 0)} years — a synthetic fixed-rate debt, no renegotiation needed.`
              : `Payer la banque (Euribor + ${f(marge, 1)}), recevoir l'Euribor du swap, payer le fixe ${f(par, 4)} : l'Euribor apparaît une fois dans chaque sens et disparaît. Coût tout compris = ${f(par, 4)} + ${f(marge, 1)} = **${pct(coutTotal, 4)}**, quoi que fassent les fixings pendant ${f(cfg.ans, 0)} ans — une dette à taux fixe synthétique, sans renégociation.`,
          }],
          pieges: [en
            ? `The swap hedges the INDEX, not the credit spread: the + ${pct(marge, 1)} margin stays, owed to the lender. Announcing ${pct(par, 4)} all-in forgets what the bank charges for the credit risk.`
            : `Le swap couvre l'INDICE, pas la marge de crédit : le + ${pct(marge, 1)} reste dû au prêteur. Annoncer ${pct(par, 4)} tout compris oublie ce que la banque facture pour le risque de crédit.`],
        },
        {
          intitule: en ? 'd) The locked annual bill' : 'd) La facture annuelle verrouillée',
          enonce: en
            ? `In euros, what annual interest bill is now locked into the business plan?`
            : `En euros, quelle facture annuelle d'intérêts est désormais inscrite au business plan ?`,
          reponse: facture, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'Notional times the all-in rate' : 'Le notionnel fois le taux tout compris',
            contenu: en
              ? `Bill = ${f(N, 0)} 000 000 × ${f(coutTotal, 4)}% = **${mnt(facture, '€', 0)}** a year, every year, independent of the Euribor's path. The floating uncertainty has been traded for one number — which is precisely what a CFO can budget, covenant and communicate.`
              : `Facture = ${f(N, 0)} 000 000 × ${f(coutTotal, 4)} % = **${mnt(facture, '€', 0)}** par an, chaque année, indépendamment de la trajectoire de l'Euribor. L'incertitude du variable a été troquée contre un seul chiffre — exactement ce qu'un directeur financier peut budgéter, « covenanter » et communiquer.`,
          }],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 9. m7-pb-09 — La couverture du gérant : le bêta avant l'arrondi — N2 */
/* ------------------------------------------------------------------ */
const couvertureGerant: ProblemeMoule = {
  id: 'm7-pb-09', moduleId: M7,
  titre: 'Couvrir un portefeuille : le bêta avant l\'arrondi',
  titreEn: 'Hedging a portfolio: beta before rounding',
  typeDeCas: 'couverture indicielle',
  typeDeCasEn: 'index hedging',
  difficulte: 2,
  scenarios: ['Le gérant growth avant l\'échéance électorale', 'Le fonds patrimonial défensif et son comité', 'La gérante tech face au S&P'],
  scenariosEn: ['The growth manager before the election', 'The defensive wealth fund and its committee', 'The tech manager against the S&P'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // bêta > 1 (growth/tech) ou < 1 (défensif) — jamais 1 : c'est tout le sujet.
    const cfg = ([
      { indice: 'CAC 40', mult: 10, sym: '€', uE: 'M€', pMin: 720, pMax: 820, eMin: 15, eMax: 60, bMin: 1.15, bMax: 1.45, xMin: 5, xMax: 12 },
      { indice: 'Euro Stoxx 50', mult: 10, sym: '€', uE: 'M€', pMin: 470, pMax: 530, eMin: 10, eMax: 40, bMin: 0.6, bMax: 0.85, xMin: 4, xMax: 10 },
      { indice: 'E-mini S&P 500', mult: 50, sym: '$', uE: 'M$', pMin: 480, pMax: 560, eMin: 20, eMax: 80, bMin: 1.1, bMax: 1.35, xMin: 5, xMax: 12 },
    ] as const)[sIdx];
    const F0 = randInt(rng, cfg.pMin, cfg.pMax) * 10;
    const E = randInt(rng, cfg.eMin, cfg.eMax);            // exposition, en millions
    const beta = randFloat(rng, cfg.bMin, cfg.bMax, 2);
    const x = randFloat(rng, cfg.xMin, cfg.xMax, 1);       // baisse de l'indice, %
    const nb = nombreContratsCouverture(E * beta, F0, cfg.mult);
    const nbNaif = nombreContratsCouverture(E, F0, cfg.mult);  // le piège : bêta oublié
    const F1 = Math.round(F0 * (1 - x / 100));
    const pnlPtf = r2(-E * 1e6 * beta * (x / 100));        // le portefeuille amplifie (ou amortit) par bêta
    const pnlFut = r2(pnlFutures(F0, F1, cfg.mult, nb, -1));
    const pnlNet = r2(pnlFut + pnlPtf);                    // résidu d'arrondi, proche de zéro
    const valContrat = F0 * cfg.mult;
    const brut = r2((E * beta * 1e6) / valContrat);        // avant arrondi

    const { en, f, pct, mnt, mln } = outils(langue);
    const desc = en
      ? `portfolio of ${f(E, 0)} million (beta ${f(beta, 2)} against the index), ${cfg.indice} futures at ${f(F0, 0)} points, multiplier ${mnt(cfg.mult, cfg.sym, 0)}/point`
      : `portefeuille de ${f(E, 0)} millions (bêta ${f(beta, 2)} contre l'indice), futures ${cfg.indice} à ${f(F0, 0)} points, multiplicateur ${mnt(cfg.mult, cfg.sym, 0)}/point`;
    const contexte = (en
      ? [
        `An election weekend is coming and a growth manager wants his book flat without selling a single line: ${desc}. He shorts index futures over the event. The market indeed drops ${pct(x, 1)}. Reconstruct the hedge: contracts to sell (beta included), the portfolio's P&L, the futures' P&L, and the net — against what an unhedged book would have suffered.`,
        `A defensive wealth fund must neutralise its equity pocket for a quarter, by mandate: ${desc}. The committee validates a futures hedge. The index then falls ${pct(x, 1)}. Four numbers for the minutes: the contract count adjusted for a LOW beta, both legs' P&L, and the residual.`,
        `A tech manager fears a rate scare on the S&P: ${desc}. She sells E-minis sized on her amplified beta. The index loses ${pct(x, 1)}. The risk report wants the position size, the damage on the book, the futures' gain, and the net that proves — or not — the calibration.`,
      ]
      : [
        `Un week-end électoral approche et un gérant growth veut un livre plat sans vendre une seule ligne : ${desc}. Il vend des futures sur indice le temps de l'événement. Le marché chute effectivement de ${pct(x, 1)}. Reconstituez la couverture : contrats à vendre (bêta compris), P&L du portefeuille, P&L des futures, et le net — contre ce qu'un livre non couvert aurait subi.`,
        `Un fonds patrimonial défensif doit neutraliser sa poche actions un trimestre, par mandat : ${desc}. Le comité valide une couverture par futures. L'indice baisse ensuite de ${pct(x, 1)}. Quatre chiffres pour le procès-verbal : le nombre de contrats ajusté d'un bêta FAIBLE, le P&L des deux jambes, et le résidu.`,
        `Une gérante tech craint une alerte sur les taux côté S&P : ${desc}. Elle vend des E-mini calibrés sur son bêta amplifié. L'indice perd ${pct(x, 1)}. Le rapport de risque veut la taille de la position, le dégât sur le livre, le gain des futures, et le net qui prouve — ou non — le calibrage.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The number of contracts' : 'a) Le nombre de contrats',
          enonce: en
            ? `How many futures contracts should be sold to neutralise the portfolio?`
            : `Combien de contrats futures faut-il vendre pour neutraliser le portefeuille ?`,
          reponse: nb, tolerance: 0.5, toleranceMode: 'absolu', unite: en ? 'contracts' : 'contrats',
          etapes: [
            {
              titre: en ? 'Beta scales the exposure BEFORE the division' : "Le bêta ajuste l'exposition AVANT la division",
              contenu: en
                ? `The book moves like ${f(beta, 2)} × the index: the exposure to hedge is ${f(E, 0)} × ${f(beta, 2)} = ${f(r2(E * beta), 2)} million. One contract carries ${f(F0, 0)} × ${f(cfg.mult, 0)} = ${mnt(valContrat, cfg.sym, 0)}.`
                : `Le livre bouge comme ${f(beta, 2)} × l'indice : l'exposition à couvrir vaut ${f(E, 0)} × ${f(beta, 2)} = ${f(r2(E * beta), 2)} millions. Un contrat porte ${f(F0, 0)} × ${f(cfg.mult, 0)} = ${mnt(valContrat, cfg.sym, 0)}.`,
            },
            {
              titre: en ? 'Then round to a whole contract' : "Puis l'arrondi au contrat entier",
              contenu: en
                ? `N = ${f(r2(E * beta), 2)} 000 000 / ${f(valContrat, 0)} = ${f(brut, 2)} → **${f(nb, 0)} contracts**, sold. Only whole contracts trade: the decimal residue is the first crack in any "perfect" hedge.`
                : `N = ${f(r2(E * beta), 2)} 000 000 / ${f(valContrat, 0)} = ${f(brut, 2)} → **${f(nb, 0)} contrats**, à la vente. On ne traite que des contrats entiers : le résidu décimal est la première fissure de toute couverture « parfaite ».`,
            },
          ],
          pieges: [en
            ? `Forgetting the beta gives ${f(nbNaif, 0)} contracts — ${beta > 1 ? 'an UNDER-hedge: the book amplifies the index, the hedge must too' : 'an OVER-hedge: the book dampens the index, hedging it one-for-one shorts the market'}.`
            : `Oublier le bêta donne ${f(nbNaif, 0)} contrats — ${beta > 1 ? 'une SOUS-couverture : le livre amplifie l\'indice, la couverture doit l\'amplifier aussi' : 'une SUR-couverture : le livre amortit l\'indice, le couvrir un pour un vend le marché à découvert'}.`],
        },
        {
          intitule: en ? 'b) The damage on the book' : 'b) Le dégât sur le livre',
          enonce: en
            ? `The index drops ${pct(x, 1)}. What is the portfolio's P&L, sign included, in ${cfg.sym}?`
            : `L'indice chute de ${pct(x, 1)}. Quel est le P&L du portefeuille, signe compris, en ${cfg.sym} ?`,
          reponse: pnlPtf, tolerance: Math.max(100, Math.abs(pnlPtf) * 0.01), toleranceMode: 'absolu', unite: cfg.sym,
          etapes: [{
            titre: en ? 'The beta amplifies (or dampens) the move' : 'Le bêta amplifie (ou amortit) le mouvement',
            contenu: en
              ? `The book falls by ${f(beta, 2)} × ${pct(x, 1)} = ${pct(r2(beta * x), 2)}: P&L = −${f(E, 0)} 000 000 × ${f(beta, 2)} × ${f(x, 1)}% = **${mnt(pnlPtf, cfg.sym, 0)}** (${mln(r3(pnlPtf / 1e6), cfg.sym)}). That is what an UNHEDGED treasury would simply have suffered.`
              : `Le livre baisse de ${f(beta, 2)} × ${pct(x, 1)} = ${pct(r2(beta * x), 2)} : P&L = −${f(E, 0)} 000 000 × ${f(beta, 2)} × ${f(x, 1)} % = **${mnt(pnlPtf, cfg.sym, 0)}** (${mln(r3(pnlPtf / 1e6), cfg.sym)}). C'est ce qu'un livre NON couvert aurait simplement subi.`,
          }],
        },
        {
          intitule: en ? 'c) The futures leg' : 'c) La jambe futures',
          enonce: en
            ? `The futures falls from ${f(F0, 0)} to ${f(F1, 0)} points. What is the P&L of the short futures position, in ${cfg.sym}?`
            : `Le futures passe de ${f(F0, 0)} à ${f(F1, 0)} points. Quel est le P&L de la position vendeuse de futures, en ${cfg.sym} ?`,
          reponse: pnlFut, tolerance: Math.max(100, Math.abs(pnlFut) * 0.01), toleranceMode: 'absolu', unite: cfg.sym,
          etapes: [{
            titre: en ? 'The short collects the fall' : 'Le vendeur encaisse la baisse',
            contenu: en
              ? `P&L = (${f(F1, 0)} − ${f(F0, 0)}) × ${f(cfg.mult, 0)} × ${f(nb, 0)} × (−1) = **${mnt(pnlFut, cfg.sym, 0)}**: each point of decline pays ${mnt(cfg.mult * nb, cfg.sym, 0)} into the margin account — in cash, evening after evening, while the book's loss stays latent.`
              : `P&L = (${f(F1, 0)} − ${f(F0, 0)}) × ${f(cfg.mult, 0)} × ${f(nb, 0)} × (−1) = **${mnt(pnlFut, cfg.sym, 0)}** : chaque point de baisse verse ${mnt(cfg.mult * nb, cfg.sym, 0)} au compte de marge — en cash, soir après soir, pendant que la perte du livre reste latente.`,
          }],
        },
        {
          intitule: en ? 'd) The net — and the honest verdict' : 'd) Le net — et le verdict honnête',
          enonce: en
            ? `Hedged book = portfolio + futures. What is the net P&L, sign included, in ${cfg.sym}?`
            : `Livre couvert = portefeuille + futures. Quel est le P&L net, signe compris, en ${cfg.sym} ?`,
          reponse: pnlNet, tolerance: Math.max(500, Math.abs(pnlNet) * 0.05), toleranceMode: 'absolu', unite: cfg.sym,
          etapes: [
            {
              titre: en ? 'Add the two legs' : 'Additionner les deux jambes',
              contenu: en
                ? `Net = ${f(pnlPtf, 0)} + ${f(pnlFut, 0)} = **${mnt(pnlNet, cfg.sym, 0)}**, against ${mnt(pnlPtf, cfg.sym, 0)} unhedged: the hedge absorbed almost the entire shock. The residue comes from rounding to ${f(nb, 0)} whole contracts (${f(brut, 2)} was the exact figure).`
                : `Net = ${f(pnlPtf, 0)} + ${f(pnlFut, 0)} = **${mnt(pnlNet, cfg.sym, 0)}**, contre ${mnt(pnlPtf, cfg.sym, 0)} sans couverture : la couverture a absorbé presque tout le choc. Le résidu vient de l'arrondi à ${f(nb, 0)} contrats entiers (${f(brut, 2)} était le chiffre exact).`,
            },
            {
              titre: en ? 'What "hedged" really means' : 'Ce que « couvert » veut vraiment dire',
              contenu: en
                ? `The price risk has been traded for a smaller one: the residual rounding, and above all the BASIS risk — if the realised beta drifts from ${f(beta, 2)}, or the futures expiry mismatches the horizon, the gap lands on the book. "Hedged, therefore riskless" fails the interview; "hedged, therefore exposed to the basis" passes it.`
                : `Le risque de prix a été troqué contre un plus petit : le résidu d'arrondi, et surtout le risque de BASE — si le bêta réalisé dérive de ${f(beta, 2)}, ou si l'échéance du futures ne colle pas à l'horizon, l'écart atterrit sur le livre. « Couvert, donc sans risque » échoue à l'oral ; « couvert, donc exposé à la base » y réussit.`,
            },
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 10. m7-pb-10 — Le MtM d'un swap : la courbe bouge, qui gagne ? — N2 */
/* ------------------------------------------------------------------ */
const mtmSwap: ProblemeMoule = {
  id: 'm7-pb-10', moduleId: M7,
  titre: 'Le mark-to-market d\'un swap : la courbe bouge, qui gagne ?',
  titreEn: 'Marking a swap to market: the curve moves — who wins?',
  typeDeCas: 'valorisation de swap',
  typeDeCasEn: 'swap valuation',
  difficulte: 2,
  scenarios: ['Le corporate payeur fixe 3 ans', 'La banque et son swap 5 ans', "L'assureur sur courbe inversée"],
  scenariosEn: ['The corporate paying fixed for 3 years', 'The bank and its 5-year swap', 'The insurer on an inverted curve'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const cfg = ([
      { ans: 3, nMin: 50, nMax: 150, z1Min: 2.2, z1Max: 3.2, sym: '€', inverse: false },
      { ans: 5, nMin: 50, nMax: 200, z1Min: 2.6, z1Max: 3.6, sym: '€', inverse: false },
      { ans: 4, nMin: 30, nMax: 120, z1Min: 3.8, z1Max: 4.6, sym: '$', inverse: true },
    ] as const)[sIdx];
    const z1 = randFloat(rng, cfg.z1Min, cfg.z1Max, 1);
    const zs: number[] = [z1];
    for (let i = 1; i < cfg.ans; i++) {
      zs.push(r1(zs[i - 1] + randFloat(rng, 0.2, 0.5, 1) * (cfg.inverse ? -1 : 1)));
    }
    const N = randInt(rng, cfg.nMin, cfg.nMax);            // notionnel en millions
    const s = randInt(rng, 3, 8) * 10;                     // translation, en pb (30 à 80)
    const par = r4(tauxSwapParitaire(zs));
    const v0 = r3(valeurSwapPayeurFixe(par, zs, N));       // ≈ 0 (arrondi de cotation)
    const zsUp = zs.map((z) => r2(z + s / 100));
    const zsDown = zs.map((z) => r2(z - s / 100));
    const vUp = r3(valeurSwapPayeurFixe(par, zsUp, N));    // > 0 : le payeur fixe gagne
    const vDown = r3(valeurSwapPayeurFixe(par, zsDown, N)); // < 0 : il perd
    const jambeUp = r3(valeurJambeFixe(par, zsUp, N));
    const jambeDown = r3(valeurJambeFixe(par, zsDown, N));
    const jambe0 = r3(valeurJambeFixe(par, zs, N));

    const { en, f, pct, mln } = outils(langue);
    const courbeTxt = zs.map((z, i) => (en ? `${pct(z, 1)} at ${i + 1}y` : `${pct(z, 1)} à ${i + 1} an${i > 0 ? 's' : ''}`)).join(', ');
    const desc = en
      ? `${f(cfg.ans, 0)}-year payer swap (pays fixed, receives floating, annual payments) on ${f(N, 0)} million, signed today at the par rate; zero curve at signature: ${courbeTxt}`
      : `swap payeur ${f(cfg.ans, 0)} ans (paie le fixe, reçoit le variable, paiements annuels) sur ${f(N, 0)} millions, signé aujourd'hui au taux paritaire ; courbe zéro à la signature : ${courbeTxt}`;
    const contexte = (en
      ? [
        `A corporate signs its hedge and the CFO asks the question every auditor will ask later: "what is this contract worth, today and if the curve moves?" — ${desc}. Establish the par rate, the value at signature, then mark the swap after a parallel shift of +${f(s, 0)} bp and of −${f(s, 0)} bp: who wins, who loses, and by how much.`,
        `A bank's risk department stress-tests a freshly signed position: ${desc}. The report requires the par rate, the initial value, and the mark-to-market under two parallel scenarios: curve up ${f(s, 0)} bp, curve down ${f(s, 0)} bp — with the zero-sum reading against the counterparty.`,
        `An insurer signed a payer swap on an INVERTED curve and the investment committee wants the full picture: ${desc}. Par rate (below the 1-year pillar!), value at inception, then the revaluation at ±${f(s, 0)} bp — and the reminder that the fixed rate is contractual: only the market's par rate moves.`,
      ]
      : [
        `Un corporate signe sa couverture et le directeur financier pose la question que tout auditeur posera plus tard : « que vaut ce contrat, aujourd'hui et si la courbe bouge ? » — ${desc}. Établissez le taux paritaire, la valeur à la signature, puis revalorisez le swap après une translation de +${f(s, 0)} pb puis de −${f(s, 0)} pb : qui gagne, qui perd, et de combien.`,
        `Le département des risques d'une banque stress-teste une position fraîchement signée : ${desc}. Le rapport exige le taux paritaire, la valeur initiale, et le mark-to-market sous deux scénarios parallèles : courbe +${f(s, 0)} pb, courbe −${f(s, 0)} pb — avec la lecture à somme nulle face à la contrepartie.`,
        `Un assureur a signé un swap payeur sur courbe INVERSÉE et le comité d'investissement veut l'image complète : ${desc}. Taux paritaire (sous le pilier 1 an !), valeur à l'initiation, puis la revalorisation à ±${f(s, 0)} pb — et le rappel que le taux fixe est contractuel : seul le paritaire de marché bouge.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The par rate at signature' : 'a) Le taux paritaire à la signature',
          enonce: en
            ? `On the curve at signature, what is the ${f(cfg.ans, 0)}-year par swap rate, in %?`
            : `Sur la courbe de signature, quel est le taux de swap paritaire ${f(cfg.ans, 0)} ans, en % ?`,
          reponse: par, tolerance: 0.005, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The coupon that prices the fixed leg at par' : 'Le coupon qui met la jambe fixe au pair',
            contenu: en
              ? `$C^* = (1 - df_n)/\\sum df_i$ on the zero curve = **${pct(par, 4)}** — ${cfg.inverse ? 'BELOW the 1-year rate: the inverted curve pulls the weighted average down' : 'between the short and long pillars, pulled towards the long end'}. At this coupon, "fixed leg + notional" is an obligation worth exactly par.`
              : `$C^* = (1 - df_n)/\\sum df_i$ sur la courbe zéro = **${pct(par, 4)}** — ${cfg.inverse ? 'SOUS le taux 1 an : la courbe inversée tire la moyenne pondérée vers le bas' : 'entre les piliers courts et longs, tiré vers le pilier long'}. À ce coupon, « jambe fixe + notionnel » est une obligation qui vaut exactement le pair.`,
          }],
        },
        {
          intitule: en ? 'b) The value at signature' : 'b) La valeur à la signature',
          enonce: en
            ? `Signed at the par rate of ${pct(par, 4)}: what is the swap worth on day one, in millions (sign included)?`
            : `Signé au taux paritaire de ${pct(par, 4)} : que vaut le swap au premier jour, en millions (signe compris) ?`,
          reponse: v0, tolerance: 0.05, toleranceMode: 'absolu', unite: cfg.sym === '€' ? 'M€' : 'M$',
          etapes: [{
            titre: en ? 'Two legs at par, value zero' : 'Deux jambes au pair, valeur nulle',
            contenu: en
              ? `Floating leg + notional = a rolled money-market deposit = par (${f(N, 0)}); fixed leg + notional at the par coupon = ${f(jambe0, 3)} ≈ par as well. Value for the fixed payer = ${f(N, 0)} − ${f(jambe0, 3)} = **${mln(v0, cfg.sym)}** — zero to the quoting rounding: a par swap signs without any payment, that is the definition of the par rate.`
              : `Jambe variable + notionnel = un placement monétaire roulé = le pair (${f(N, 0)}) ; jambe fixe + notionnel au coupon paritaire = ${f(jambe0, 3)} ≈ le pair aussi. Valeur pour le payeur fixe = ${f(N, 0)} − ${f(jambe0, 3)} = **${mln(v0, cfg.sym)}** — zéro à l'arrondi de cotation près : un swap au paritaire se signe sans aucun paiement, c'est la définition même du taux paritaire.`,
          }],
          pieges: [en
            ? `"The swap is worth zero, therefore it is riskless" confuses value and risk: the value is zero TODAY, the sensitivity to the curve is enormous — see c) and d).`
            : `« Le swap vaut zéro, donc il est sans risque » confond valeur et risque : la valeur est nulle AUJOURD'HUI, la sensibilité à la courbe est énorme — voir c) et d).`],
        },
        {
          intitule: en ? `c) The curve shifts up ${f(s, 0)} bp` : `c) La courbe monte de ${f(s, 0)} pb`,
          enonce: en
            ? `The whole curve translates UP by ${f(s, 0)} bp. What is the swap now worth for the fixed payer, in millions?`
            : `Toute la courbe se translate de +${f(s, 0)} pb. Que vaut désormais le swap pour le payeur fixe, en millions ?`,
          reponse: vUp, tolerance: Math.max(0.02, Math.abs(vUp) * 0.02), toleranceMode: 'absolu', unite: cfg.sym === '€' ? 'M€' : 'M$',
          etapes: [
            {
              titre: en ? 'Revalue the fixed leg on the new curve' : 'Revaloriser la jambe fixe sur la nouvelle courbe',
              contenu: en
                ? `Same contractual coupon ${pct(par, 4)}, discounted on the shifted curve: fixed leg = ${f(jambeUp, 3)} — below par, since the coupon is now SMALLER than the new par rate. Value = ${f(N, 0)} − ${f(jambeUp, 3)} = **${mln(vUp, cfg.sym)}**.`
                : `Même coupon contractuel ${pct(par, 4)}, actualisé sur la courbe translatée : jambe fixe = ${f(jambeUp, 3)} — sous le pair, puisque le coupon est désormais PLUS PETIT que le nouveau paritaire. Valeur = ${f(N, 0)} − ${f(jambeUp, 3)} = **${mln(vUp, cfg.sym)}**.`,
            },
            {
              titre: en ? 'Rates up ⇒ the fixed payer wins' : 'Taux en hausse ⇒ le payeur fixe gagne',
              contenu: en
                ? `His fixed rate is locked while new swaps sign higher: he pays below-market and receives a floating leg that rises. The reflex to hammer: the fixed payer behaves like a bond SELLER — negative duration.`
                : `Son taux fixe est verrouillé pendant que les nouveaux swaps se signent plus haut : il paie sous le marché et reçoit un variable qui monte. Le réflexe à marteler : le payeur fixe se comporte comme un VENDEUR d'obligations — duration négative.`,
            },
          ],
          pieges: [en
            ? `"Rates rose, I pay interest, so I lose" is the eliminating mistake: the contractual fixed rate never moves — what moved is the price of NEW swaps, and that revalues yours UP.`
            : `« Les taux montent, je paie des intérêts, donc je perds » est l'erreur éliminatoire : le taux fixe contractuel ne bouge jamais — ce qui a bougé, c'est le prix des NOUVEAUX swaps, et cela revalorise le vôtre à la HAUSSE.`],
        },
        {
          intitule: en ? `d) The curve falls ${f(s, 0)} bp instead` : `d) La courbe baisse de ${f(s, 0)} pb, au lieu de monter`,
          enonce: en
            ? `From the initial curve, the translation is −${f(s, 0)} bp instead. What is the swap worth for the fixed payer, in millions (sign included)?`
            : `Depuis la courbe initiale, la translation est de −${f(s, 0)} pb au lieu de +${f(s, 0)}. Que vaut le swap pour le payeur fixe, en millions (signe compris) ?`,
          reponse: vDown, tolerance: Math.max(0.02, Math.abs(vDown) * 0.02), toleranceMode: 'absolu', unite: cfg.sym === '€' ? 'M€' : 'M$',
          etapes: [
            {
              titre: en ? 'Mirror scenario' : 'Le scénario miroir',
              contenu: en
                ? `Fixed leg on the lowered curve = ${f(jambeDown, 3)} — ABOVE par: the locked coupon is now generous. Value = ${f(N, 0)} − ${f(jambeDown, 3)} = **${mln(vDown, cfg.sym)}**: the fixed payer loses, the fixed RECEIVER books the opposite gain.`
                : `Jambe fixe sur la courbe abaissée = ${f(jambeDown, 3)} — AU-DESSUS du pair : le coupon verrouillé est devenu généreux. Valeur = ${f(N, 0)} − ${f(jambeDown, 3)} = **${mln(vDown, cfg.sym)}** : le payeur fixe perd, le RECEVEUR fixe enregistre le gain opposé.`,
            },
            {
              titre: en ? 'Zero-sum, and what the MtM is for' : 'Somme nulle, et à quoi sert le MtM',
              contenu: en
                ? `At every date, the counterparty's value is exactly −(yours): ${mln(r3(-vDown), cfg.sym)} for the receiver here. This mark-to-market is what the bank would charge (or pay) to unwind, what collateral calls are computed on since EMIR/Dodd-Frank — and the number that lives, every day, on both balance sheets. The contract was born at zero; it never stays there.`
                : `À chaque date, la valeur chez la contrepartie est exactement −(la vôtre) : ${mln(r3(-vDown), cfg.sym)} pour le receveur ici. Ce mark-to-market est ce que la banque facturerait (ou paierait) pour déboucler, l'assiette des appels de collatéral depuis EMIR/Dodd-Frank — et le chiffre qui vit, chaque jour, dans les deux bilans. Le contrat est né à zéro ; il n'y reste jamais.`,
            },
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* Export du lot 1 — fusionné dans problems.ts par le contrôleur.      */
/* ------------------------------------------------------------------ */
export const problemesLot1: ProblemeMoule[] = [
  premierePosition,   // m7-pb-01 · N1
  semaineDeMarge,     // m7-pb-02 · N1
  forwardIndice,      // m7-pb-03 · N1
  futuresDeTaux,      // m7-pb-04 · N1
  appelMarge,         // m7-pb-05 · N2
  tresorierFra,       // m7-pb-06 · N2
  cashAndCarry,       // m7-pb-07 · N2
  swapCorporate,      // m7-pb-08 · N2
  couvertureGerant,   // m7-pb-09 · N2
  mtmSwap,            // m7-pb-10 · N2
];
