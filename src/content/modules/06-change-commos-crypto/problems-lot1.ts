/**
 * Moules de problèmes multi-étapes du module Change, matières premières & crypto
 * — LOT 1 : les 10 moules N1/N2 (m6-pb-01 à m6-pb-10).
 * 4 N1 (voyageur et spread, courbe des forwards, Big Mac, première position
 * commodity) et 6 N2 (exportateur couvert, importateur non couvert, carry trade,
 * triangle de cours croisés, ETF en contango, or et taux réels).
 * Chaque moule : 3 scénarios FR + EN (habillages ET bornes de tirage différents),
 * sous-questions chaînées (la sortie de a) nourrit b), c)…), corrigés calculés
 * via calculs.ts — jamais de texte figé.
 * INVARIANT BILINGUE : tous les tirages aléatoires ont lieu AVANT toute branche
 * de langue — même seed + même scénario ⇒ mêmes nombres en français et en anglais.
 * Convention FX (en-tête de calculs.ts) : une paire s'écrit BASE/COTÉE, le cours
 * est le prix d'UNE unité de base en devise cotée — le sens ne s'inverse jamais.
 */
import { formatNombreLangue } from '../../../engine/answers';
import { mulberry32, pick, randFloat, randInt } from '../../../engine/rng';
import type { Langue, ProblemGenerator } from '../../../engine/types';
import {
  baseFutures, coutSpreadFx, forwardCommodity, forwardFx, pnlCarryTrade,
  pointsDeTerme, rollYieldAnnualise, surSousEvaluation, tauxPpa,
  variationAnnualiseePct,
} from './calculs';

/** Un « moule » de problème est un ProblemGenerator de l'engine (alias local). */
export type ProblemeMoule = ProblemGenerator;

const M6 = '06-change-commos-crypto';
const r1 = (v: number) => Math.round(v * 10) / 10;
const r2 = (v: number) => Math.round(v * 100) / 100;
const r3 = (v: number) => Math.round(v * 1000) / 1000;
const r4 = (v: number) => Math.round(v * 10_000) / 10_000;
const rN = (v: number, d: number) => Math.round(v * 10 ** d) / 10 ** d;

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
/* 1. m6-pb-01 — Le voyageur et le spread — N1                         */
/* ------------------------------------------------------------------ */
const voyageurSpread: ProblemeMoule = {
  id: 'm6-pb-01', moduleId: M6,
  titre: "Le voyageur et le spread : l'aller-retour qui coûte",
  titreEn: 'The traveller and the spread: the round trip that costs',
  typeDeCas: 'microstructure du change',
  typeDeCasEn: 'FX microstructure',
  difficulte: 1,
  scenarios: ["Le voyageur au comptoir de l'aéroport", "La trésorière dont le contrat capote", 'Le consultant en mission à Tokyo'],
  scenariosEn: ['The traveller at the airport desk', 'The treasurer whose deal collapses', 'The consultant on assignment in Tokyo'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Config par scénario : paire, devises, bornes (montant, milieu, spread).
    const cfg = ([
      { paire: 'EUR/USD', base: 'EUR', cotee: 'USD', sB: '€', sC: '$', dec: 4, aMin: 16, aMax: 40, aMul: 50, mMin: 1.05, mMax: 1.15, spMin: 0.04, spMax: 0.08, spDec: 2 },
      { paire: 'GBP/USD', base: 'GBP', cotee: 'USD', sB: '£', sC: '$', dec: 4, aMin: 50, aMax: 150, aMul: 1000, mMin: 1.20, mMax: 1.32, spMin: 0.003, spMax: 0.008, spDec: 4 },
      { paire: 'USD/JPY', base: 'USD', cotee: 'JPY', sB: '$', sC: '¥', dec: 2, aMin: 20, aMax: 60, aMul: 100, mMin: 140, mMax: 158, spMin: 3, spMax: 6, spDec: 1 },
    ] as const)[sIdx];
    const montant = randInt(rng, cfg.aMin, cfg.aMax) * cfg.aMul;
    const milieu = randFloat(rng, cfg.mMin, cfg.mMax, cfg.dec);
    const spread = randFloat(rng, cfg.spMin, cfg.spMax, cfg.spDec);
    const bid = rN(milieu - spread / 2, cfg.dec);
    const ask = rN(milieu + spread / 2, cfg.dec);

    const recu = r2(montant * bid);            // a) devise cotée reçue à l'aller
    const retour = r2(recu / ask);             // b) devise de base récupérée
    const perte = r2(montant - retour);
    const pertePct = r2((perte / montant) * 100);
    const raccourci = r2(coutSpreadFx(montant, bid, ask));

    const { en, f, pct, mnt } = outils(langue);
    const desc = en
      ? `the board shows ${cfg.paire} at ${f(bid, cfg.dec)} / ${f(ask, cfg.dec)}, and the amount at stake is ${mnt(montant, cfg.sB, 0)}`
      : `le panneau affiche ${cfg.paire} à ${f(bid, cfg.dec)} / ${f(ask, cfg.dec)}, et le montant en jeu est de ${mnt(montant, cfg.sB, 0)}`;
    const contexte = (en
      ? [
        `Airport departure hall, currency desk: ${desc}. You convert everything before flying to New York — and, the trip cancelled at the last minute, you convert it all back at the same board an hour later. Three numbers measure the toll: the dollars received, the euros recovered, the cost of the round trip.`,
        `As treasurer of a UK firm, you convert ${desc} into dollars to pay a deposit on a machine. The next morning the supplier cancels the contract: the dollars must come straight back into pounds, at the same two-way price. The CFO wants the exact cost of this round trip — in pounds and in percent.`,
        `An American consultant lands in Tokyo: at the bureau de change, ${desc}. The assignment is cut short after a week and the unspent yen go back into dollars at the same counter. Before filing the expense report, he reconstructs what the double conversion really cost.`,
      ]
      : [
        `Hall de départ de l'aéroport, comptoir de change : ${desc}. Vous changez tout avant de partir à New York — et, le voyage annulé au dernier moment, vous rechangez tout au même panneau une heure plus tard. Trois chiffres mesurent le péage : les dollars reçus, les euros récupérés, le coût de l'aller-retour.`,
        `Trésorière d'une PME britannique, vous convertissez ${desc} en dollars pour régler l'acompte d'une machine. Le lendemain matin, le fournisseur annule le contrat : les dollars repartent aussitôt en livres, au même prix à deux sens. Le directeur financier veut le coût exact de cet aller-retour — en livres et en pourcentage.`,
        `Un consultant américain atterrit à Tokyo : au bureau de change, ${desc}. La mission écourtée au bout d'une semaine, les yens non dépensés repartent en dollars au même guichet. Avant de remplir sa note de frais, il reconstitue ce que la double conversion a réellement coûté.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The outbound conversion' : "a) La conversion aller",
          enonce: en
            ? `You sell your ${f(montant, 0)} ${cfg.base} at the counter. How many ${cfg.cotee} do you receive?`
            : `Vous vendez vos ${f(montant, 0)} ${cfg.base} au guichet. Combien de ${cfg.cotee} recevez-vous ?`,
          reponse: recu, tolerance: 0.005, unite: cfg.sC,
          etapes: [{
            titre: en ? 'You sell the base: the dealer pays the bid' : 'Vous vendez la base : le cambiste paie le bid',
            contenu: en
              ? `${cfg.paire} is the price of one ${cfg.base} in ${cfg.cotee}. Selling your ${cfg.base}, you get the LOW side of the quote: ${f(montant, 0)} × ${f(bid, cfg.dec)} = **${mnt(recu, cfg.sC)}**.`
              : `${cfg.paire} est le prix d'un ${cfg.base} en ${cfg.cotee}. En vendant vos ${cfg.base}, vous touchez le côté BAS de la fourchette : ${f(montant, 0)} × ${f(bid, cfg.dec)} = **${mnt(recu, cfg.sC)}**.`,
          }],
          pieges: [en
            ? `Converting at the ask (or at the midpoint) flatters the result: the bid is the price at which the dealer BUYS your base currency — always the less favourable side for you.`
            : `Convertir à l'ask (ou au milieu) enjolive le résultat : le bid est le prix auquel le cambiste ACHÈTE votre devise de base — toujours le côté le moins favorable pour vous.`],
        },
        {
          intitule: en ? 'b) The return conversion' : 'b) La conversion retour',
          enonce: en
            ? `You convert the full ${f(recu, 0)} ${cfg.cotee} back. How many ${cfg.base} do you recover?`
            : `Vous reconvertissez l'intégralité des ${f(recu, 0)} ${cfg.cotee}. Combien de ${cfg.base} récupérez-vous ?`,
          reponse: retour, tolerance: 0.005, unite: cfg.sB,
          etapes: [{
            titre: en ? 'Buying the base back costs the ask' : "Racheter la base coûte l'ask",
            contenu: en
              ? `To get ${cfg.base} back you BUY the base, so you pay the HIGH side: ${f(recu)} / ${f(ask, cfg.dec)} = **${mnt(retour, cfg.sB)}**. Same window, same board — but the other side of the quote.`
              : `Pour retrouver des ${cfg.base}, vous ACHETEZ la base, donc vous payez le côté HAUT : ${f(recu)} / ${f(ask, cfg.dec)} = **${mnt(retour, cfg.sB)}**. Même guichet, même panneau — mais l'autre côté de la fourchette.`,
          }],
        },
        {
          intitule: en ? 'c) The bill for the round trip' : "c) La facture de l'aller-retour",
          enonce: en
            ? `How much did the round trip cost, as a % of the initial amount?`
            : `Combien l'aller-retour a-t-il coûté, en % du montant initial ?`,
          reponse: pertePct, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'The loss, in currency then in %' : 'La perte, en devise puis en %',
              contenu: en
                ? `Loss = ${f(montant, 0)} − ${f(retour)} = **${mnt(perte, cfg.sB)}**, i.e. ${f(perte)} / ${f(montant, 0)} = **${pct(pertePct)}** of the stake — without the rate having moved at all: the entire toll is the bid/ask spread, charged twice.`
                : `Perte = ${f(montant, 0)} − ${f(retour)} = **${mnt(perte, cfg.sB)}**, soit ${f(perte)} / ${f(montant, 0)} = **${pct(pertePct)}** de la mise — sans que le cours ait bougé d'un pip : tout le péage est le spread bid/ask, facturé deux fois.`,
            },
            {
              titre: en ? 'The desk shortcut' : 'Le raccourci du desk',
              contenu: en
                ? `Quick check, the relative spread applied to the amount: ${f(montant, 0)} × (${f(ask, cfg.dec)} − ${f(bid, cfg.dec)}) / mid = ${mnt(raccourci, cfg.sB)} — nearly the exact loss (the tiny gap comes from dividing by the mid rather than the ask). The wider the spread, the heavier the toll: an airport bureau charges in figures what the interbank market charges in pips.`
                : `Vérification rapide, le spread relatif appliqué au montant : ${f(montant, 0)} × (${f(ask, cfg.dec)} − ${f(bid, cfg.dec)}) / milieu = ${mnt(raccourci, cfg.sB)} — presque la perte exacte (le petit écart vient de la division par le milieu plutôt que par l'ask). Plus la fourchette est large, plus le péage est lourd : un comptoir d'aéroport facture en figures ce que l'interbancaire facture en pips.`,
            },
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 2. m6-pb-02 — Lecture de courbe forward — N1                        */
/* ------------------------------------------------------------------ */
const courbeForwards: ProblemeMoule = {
  id: 'm6-pb-02', moduleId: M6,
  titre: 'Lire la courbe des forwards : report ou déport ?',
  titreEn: 'Reading the forward curve: premium or discount?',
  typeDeCas: 'change à terme',
  typeDeCasEn: 'forward FX',
  difficulte: 1,
  scenarios: ['Le trésorier qui découvre ses cotations', 'Le desk de Londres sur le câble', 'Le gérant suisse et le déport du dollar'],
  scenariosEn: ['The treasurer discovering his quotes', 'The London desk on cable', 'The Swiss manager and the dollar discount'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Paires à 4 décimales uniquement (les points de terme comptent en pips de 0,0001).
    const cfg = ([
      { paire: 'EUR/USD', base: 'EUR', cotee: 'USD', sMin: 1.05, sMax: 1.15, rcMin: 4, rcMax: 5.5, rbMin: 2, rbMax: 3.5 },
      { paire: 'GBP/USD', base: 'GBP', cotee: 'USD', sMin: 1.20, sMax: 1.32, rcMin: 3.5, rcMax: 4.5, rbMin: 5, rbMax: 6.5 },
      { paire: 'USD/CHF', base: 'USD', cotee: 'CHF', sMin: 0.86, sMax: 0.95, rcMin: 0.25, rcMax: 1.25, rbMin: 4, rbMax: 5.5 },
    ] as const)[sIdx];
    const spot = randFloat(rng, cfg.sMin, cfg.sMax, 4);
    const rc = randFloat(rng, cfg.rcMin, cfg.rcMax, 1); // taux de la devise COTÉE
    const rb = randFloat(rng, cfg.rbMin, cfg.rbMax, 1); // taux de la devise de BASE
    const f3 = r4(forwardFx(spot, rc, rb, 0.25));
    const f12 = r4(forwardFx(spot, rc, rb, 1));
    const pts = r1(pointsDeTerme(spot, f12));
    const report = pts > 0;

    const { en, f, pct } = outils(langue);
    const unitePaire = en ? `${cfg.cotee} per ${cfg.base}` : `${cfg.cotee} par ${cfg.base}`;
    const desc = en
      ? `${cfg.paire} spot at ${f(spot, 4)}, ${cfg.cotee} money-market rate at ${pct(rc, 1)} and ${cfg.base} rate at ${pct(rb, 1)}`
      : `spot ${cfg.paire} à ${f(spot, 4)}, taux monétaire ${cfg.cotee} à ${pct(rc, 1)} et taux ${cfg.base} à ${pct(rb, 1)}`;
    const contexte = (en
      ? [
        `First week in a corporate treasury: the bank sends the daily sheet — ${desc}. Before quoting any hedge to the sales team, you rebuild the forward curve yourself: 3 months, 12 months, and the forward points that summarise it, with the right word on top — premium or discount.`,
        `On the London desk, a client asks where cable trades forward: ${desc}. The graduate is asked to produce the 3-month and 12-month outrights by covered interest parity, then translate the 1-year gap into pips — and to say which currency the curve rewards.`,
        `A Swiss asset manager funds in dollars and reports in francs: ${desc}. He wants the 3-month and 12-month forwards and the 1-year forward points, to see in black and white how the rate differential prices the franc over time.`,
      ]
      : [
        `Première semaine en trésorerie d'entreprise : la banque envoie la feuille du jour — ${desc}. Avant de coter la moindre couverture aux commerciaux, vous reconstruisez la courbe des forwards vous-même : 3 mois, 12 mois, et les points de terme qui la résument, avec le bon mot dessus — report ou déport.`,
        `Au desk de Londres, un client demande où traite le câble à terme : ${desc}. Au junior de produire les outrights 3 mois et 12 mois par la parité couverte, puis de traduire l'écart 1 an en pips — et de dire quelle devise la courbe revalorise.`,
        `Un gérant suisse se finance en dollars et publie en francs : ${desc}. Il veut les forwards 3 mois et 12 mois et les points de terme 1 an, pour lire noir sur blanc comment le différentiel de taux price le franc dans le temps.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The 3-month forward' : 'a) Le forward 3 mois',
          enonce: en
            ? `By covered interest parity, what is the 3-month forward of ${cfg.paire}?`
            : `Par la parité des taux d'intérêt couverte, que vaut le forward 3 mois de ${cfg.paire} ?`,
          reponse: f3, tolerance: 0.0005, toleranceMode: 'absolu', unite: unitePaire,
          etapes: [{
            titre: en ? 'Quoted rate on top, base rate below' : 'Taux de la cotée au numérateur, taux de la base au dénominateur',
            contenu: en
              ? `$F = S \\times \\frac{1 + r_{\\text{quoted}} T}{1 + r_{\\text{base}} T}$ with T = 0.25: F = ${f(spot, 4)} × ${f(1 + (rc / 100) * 0.25, 5)} / ${f(1 + (rb / 100) * 0.25, 5)} = **${f(f3, 4)}**. No forecast in there — only the spot and two observable rates.`
              : `$F = S \\times \\frac{1 + r_{\\text{cotée}} T}{1 + r_{\\text{base}} T}$ avec T = 0,25 : F = ${f(spot, 4)} × ${f(1 + (rc / 100) * 0.25, 5)} / ${f(1 + (rb / 100) * 0.25, 5)} = **${f(f3, 4)}**. Aucune prévision là-dedans — seulement le spot et deux taux observables.`,
          }],
          pieges: [en
            ? `Swapping the two rates flips the curve: the QUOTED currency's rate goes on top. For ${cfg.paire}, that is the ${cfg.cotee} rate (${pct(rc, 1)}), not the ${cfg.base} rate.`
            : `Inverser les deux taux retourne la courbe : c'est le taux de la devise COTÉE qui va au numérateur. Pour ${cfg.paire}, c'est le taux ${cfg.cotee} (${pct(rc, 1)}), pas le taux ${cfg.base}.`],
        },
        {
          intitule: en ? 'b) The 12-month forward' : 'b) Le forward 12 mois',
          enonce: en
            ? `Same inputs, one-year horizon: what is the 12-month forward?`
            : `Mêmes données, horizon un an : que vaut le forward 12 mois ?`,
          reponse: f12, tolerance: 0.0005, toleranceMode: 'absolu', unite: unitePaire,
          etapes: [{
            titre: en ? 'Same machine, longer horizon' : 'Même machine, horizon plus long',
            contenu: en
              ? `T = 1: F = ${f(spot, 4)} × ${f(1 + rc / 100, 4)} / ${f(1 + rb / 100, 4)} = **${f(f12, 4)}**. Against ${f(f3, 4)} at 3 months: the gap to spot grows roughly in proportion to the horizon — the differential of ${pct(r2(rc - rb), 1)} accrues month after month.`
              : `T = 1 : F = ${f(spot, 4)} × ${f(1 + rc / 100, 4)} / ${f(1 + rb / 100, 4)} = **${f(f12, 4)}**. Contre ${f(f3, 4)} à 3 mois : l'écart au spot grandit à peu près proportionnellement à l'horizon — le différentiel de ${pct(r2(rc - rb), 1)} court mois après mois.`,
          }],
        },
        {
          intitule: en ? 'c) Forward points and the verdict' : 'c) Les points de terme et le verdict',
          enonce: en
            ? `How many forward points (pips) does the 12-month forward show against spot (sign included)?`
            : `Combien de points de terme (pips) le forward 12 mois affiche-t-il contre le spot (signe compris) ?`,
          reponse: pts, tolerance: 2, toleranceMode: 'absolu', unite: 'pips',
          etapes: [
            {
              titre: en ? 'From the gap to the pips' : "De l'écart aux pips",
              contenu: en
                ? `Points = (F − S) × 10,000 = (${f(f12, 4)} − ${f(spot, 4)}) × 10,000 = **${f(pts, 1)} pips**: ${report ? `positive, ${cfg.base} trades at a forward PREMIUM (it buys more ${cfg.cotee} forward than spot)` : `negative, ${cfg.base} trades at a forward DISCOUNT (it buys fewer ${cfg.cotee} forward than spot)`}.`
                : `Points = (F − S) × 10 000 = (${f(f12, 4)} − ${f(spot, 4)}) × 10 000 = **${f(pts, 1)} pips** : ${report ? `positifs, ${cfg.base} cote en REPORT (elle achète plus de ${cfg.cotee} à terme qu'au comptant)` : `négatifs, ${cfg.base} cote en DÉPORT (elle achète moins de ${cfg.cotee} à terme qu'au comptant)`}.`,
            },
            {
              titre: en ? 'Why the low-rate currency appreciates forward' : 'Pourquoi la devise au taux bas se revalorise à terme',
              contenu: en
                ? `${report ? `${cfg.base} earns less interest (${pct(rb, 1)} vs ${pct(rc, 1)})` : `${cfg.cotee} earns less interest (${pct(rc, 1)} vs ${pct(rb, 1)})`}: the forward must compensate the carry differential exactly, otherwise a riskless cash-and-carry arbitrage opens up. The forward curve is a no-arbitrage statement, never a market forecast.`
                : `${report ? `${cfg.base} rapporte moins d'intérêts (${pct(rb, 1)} contre ${pct(rc, 1)})` : `${cfg.cotee} rapporte moins d'intérêts (${pct(rc, 1)} contre ${pct(rb, 1)})`} : le forward doit compenser exactement le différentiel de portage, sinon un arbitrage cash and carry sans risque s'ouvre. La courbe des forwards est un énoncé d'absence d'arbitrage, jamais une prévision du marché.`,
            },
          ],
          pieges: [en
            ? `Reading the premium as "the market expects ${cfg.base} to rise" confuses covered parity (an arbitrage, it holds to the pip) with a forecast (it is not one).`
            : `Lire le report comme « le marché anticipe une hausse de ${cfg.base} » confond la parité couverte (un arbitrage, qui tient au pip près) avec une prévision (ce n'en est pas une).`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 3. m6-pb-03 — Big Mac et PPA — N1                                   */
/* ------------------------------------------------------------------ */
const bigMacPpa: ProblemeMoule = {
  id: 'm6-pb-03', moduleId: M6,
  titre: 'Big Mac : la parité des pouvoirs d\'achat en sandwich',
  titreEn: 'Big Mac: purchasing power parity in a sandwich',
  typeDeCas: 'parités économiques',
  typeDeCasEn: 'economic parities',
  difficulte: 1,
  scenarios: ["L'étudiant et l'index de The Economist", 'La chroniqueuse marchés qui vérifie', 'Le stratège qui regarde le yen'],
  scenariosEn: ['The student and The Economist index', 'The markets columnist double-checking', 'The strategist eyeing the yen'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // prixQ : prix du burger en devise COTÉE ; prixB : prix en devise de BASE.
    const cfg = ([
      { paire: 'EUR/USD', base: 'EUR', cotee: 'USD', sC: '$', sB: '€', decP: 4, qMin: 5.4, qMax: 6.2, bMin: 4.8, bMax: 5.6, sMin: 1.05, sMax: 1.15, decS: 4 },
      { paire: 'GBP/USD', base: 'GBP', cotee: 'USD', sC: '$', sB: '£', decP: 4, qMin: 5.4, qMax: 6.2, bMin: 4.2, bMax: 4.9, sMin: 1.20, sMax: 1.32, decS: 4 },
      { paire: 'USD/JPY', base: 'USD', cotee: 'JPY', sC: '¥', sB: '$', decP: 2, qMin: 430, qMax: 520, bMin: 5.4, bMax: 6.2, sMin: 138, sMax: 158, decS: 2 },
    ] as const)[sIdx];
    const prixQ = sIdx === 2 ? randInt(rng, cfg.qMin, cfg.qMax) : randFloat(rng, cfg.qMin, cfg.qMax, 2);
    const prixB = randFloat(rng, cfg.bMin, cfg.bMax, 2);
    const spot = randFloat(rng, cfg.sMin, cfg.sMax, cfg.decS);
    const ppa = rN(tauxPpa(prixQ, prixB), cfg.decP);
    const ecart = r2(surSousEvaluation(spot, ppa));
    const surEv = ecart > 0; // la BASE est surévaluée si spot > PPA
    const ecartCotee = r2((ppa / spot - 1) * 100); // lecture symétrique, côté devise cotée
    const conv = r2(prixB * spot); // le burger « base » converti au spot, en devise cotée

    const { en, f, pct, mnt } = outils(langue);
    const desc = en
      ? `the same burger costs ${mnt(prixQ, cfg.sC, sIdx === 2 ? 0 : 2)} in the quoted-currency country and ${mnt(prixB, cfg.sB)} in the base-currency country, while ${cfg.paire} trades at ${f(spot, cfg.decS)}`
      : `le même burger coûte ${mnt(prixQ, cfg.sC, sIdx === 2 ? 0 : 2)} dans le pays de la devise cotée et ${mnt(prixB, cfg.sB)} dans celui de la devise de base, tandis que ${cfg.paire} cote ${f(spot, cfg.decS)}`;
    const contexte = (en
      ? [
        `The Economist has just refreshed its Big Mac index and your study group argues about what it means for ${cfg.paire}: ${desc}. You settle the debate the proper way — implied PPP rate, gap to spot, and the verdict on which currency is cheap, with the sanity check that never lies.`,
        `A markets columnist wants to write that one of the two currencies is "obviously mispriced": ${desc}. Before publishing, she asks you to run the burgernomics sequence — the PPP rate, the percentage misalignment of the base currency, and the converted price that proves the point.`,
        `An FX strategist reviews the most famous outlier of the whole index: ${desc}. The note must state the implied PPP rate of ${cfg.paire}, the misvaluation of the base currency in percent, and what the burger costs once converted at spot — the one-line proof of a cheap currency.`,
      ]
      : [
        `The Economist vient de rafraîchir son Big Mac index et votre groupe de TD se dispute sur ce que cela dit de ${cfg.paire} : ${desc}. Vous tranchez proprement — taux PPA implicite, écart au spot, et verdict sur la devise bon marché, avec la vérification qui ne ment jamais.`,
        `Une chroniqueuse marchés veut écrire qu'une des deux devises est « manifestement mal pricée » : ${desc}. Avant de publier, elle vous demande de dérouler la séquence burgernomics — le taux PPA, le désalignement de la devise de base en pourcentage, et le prix converti qui prouve le point.`,
        `Un stratège change repasse sur le cas le plus célèbre de tout l'index : ${desc}. La note doit donner le taux PPA implicite de ${cfg.paire}, la sur/sous-évaluation de la devise de base en pourcentage, et ce que coûte le burger une fois converti au spot — la preuve en une ligne d'une devise bon marché.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The implied PPP rate' : 'a) Le taux PPA implicite',
          enonce: en
            ? `What ${cfg.paire} rate would equalise the price of the burger in both countries?`
            : `Quel cours ${cfg.paire} égaliserait le prix du burger dans les deux pays ?`,
          reponse: ppa, tolerance: cfg.decP === 2 ? 0.05 : 0.0005, toleranceMode: 'absolu',
          unite: en ? `${cfg.cotee} per ${cfg.base}` : `${cfg.cotee} par ${cfg.base}`,
          etapes: [{
            titre: en ? 'Quoted price over base price' : 'Prix en cotée sur prix en base',
            contenu: en
              ? `PPP = price in quoted currency / price in base currency = ${f(prixQ, sIdx === 2 ? 0 : 2)} / ${f(prixB)} = **${f(ppa, cfg.decP)}** — homogeneous with the ${cfg.paire} quote: so many ${cfg.cotee} for one ${cfg.base}, the law of one price applied to a sandwich.`
              : `PPA = prix en devise cotée / prix en devise de base = ${f(prixQ, sIdx === 2 ? 0 : 2)} / ${f(prixB)} = **${f(ppa, cfg.decP)}** — homogène au cours ${cfg.paire} : tant de ${cfg.cotee} pour un ${cfg.base}, la loi du prix unique appliquée à un sandwich.`,
          }],
          pieges: [en
            ? `Dividing the other way round gives the ${cfg.base}/${cfg.cotee} rate — a number that cannot be compared to the ${cfg.paire} spot. Keep the ratio homogeneous with the pair.`
            : `Diviser dans l'autre sens donne le cours ${cfg.base}/${cfg.cotee} — un chiffre incomparable au spot ${cfg.paire}. Gardez le ratio homogène à la paire.`],
        },
        {
          intitule: en ? 'b) The gap to parity, with its sign' : "b) L'écart à la parité, avec son signe",
          enonce: en
            ? `By how much is the BASE currency (${cfg.base}) over- or under-valued against its PPP, in % (positive = overvalued)?`
            : `De combien la devise de BASE (${cfg.base}) est-elle sur- ou sous-évaluée par rapport à sa PPA, en % (positif = surévaluée) ?`,
          reponse: ecart, tolerance: 0.3, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'Spot against PPP' : 'Le spot contre la PPA',
              contenu: en
                ? `Gap = (spot / PPP − 1) × 100 = (${f(spot, cfg.decS)} / ${f(ppa, cfg.decP)} − 1) × 100 = **${pct(ecart)}**. ${surEv ? `Spot above PPP: one ${cfg.base} buys MORE ${cfg.cotee} than the burger justifies — the base (${cfg.base}) is OVERvalued, and ${cfg.cotee} symmetrically undervalued (${pct(ecartCotee)} on its side).` : `Spot below PPP: one ${cfg.base} buys FEWER ${cfg.cotee} than the burger justifies — the base (${cfg.base}) is UNDERvalued, and ${cfg.cotee} symmetrically overvalued (${pct(ecartCotee)} on its side).`}`
                : `Écart = (spot / PPA − 1) × 100 = (${f(spot, cfg.decS)} / ${f(ppa, cfg.decP)} − 1) × 100 = **${pct(ecart)}**. ${surEv ? `Spot au-dessus de la PPA : un ${cfg.base} achète PLUS de ${cfg.cotee} que le burger ne le justifie — la base (${cfg.base}) est SURévaluée, et ${cfg.cotee} symétriquement sous-évaluée (${pct(ecartCotee)} de son côté).` : `Spot sous la PPA : un ${cfg.base} achète MOINS de ${cfg.cotee} que le burger ne le justifie — la base (${cfg.base}) est SOUS-évaluée, et ${cfg.cotee} symétriquement surévaluée (${pct(ecartCotee)} de son côté).`}`,
            },
            {
              titre: en ? 'What the number is good for' : 'À quoi sert ce chiffre',
              contenu: en
                ? `PPP is a very-long-term compass: classic studies put the half-life of such a gap at three to five years. It says whether a currency is cheap — it says nothing about what it will do by Christmas.`
                : `La PPA est une boussole de très long terme : les études classiques chiffrent la demi-vie d'un tel écart à trois–cinq ans. Elle dit si une devise est chère ou bon marché — elle ne dit rien de ce qu'elle fera d'ici Noël.`,
            },
          ],
          pieges: [en
            ? `The sign reads on the BASE currency — the trap of the module. Spot < PPP means the base is undervalued; announcing the quoted currency with the same sign reverses the verdict.`
            : `Le signe se lit sur la devise de BASE — le piège du module. Spot < PPA signifie base sous-évaluée ; annoncer la devise cotée avec le même signe inverse le verdict.`],
        },
        {
          intitule: en ? 'c) The sanity check that never lies' : 'c) La vérification qui ne ment jamais',
          enonce: en
            ? `Convert the base-country burger (${mnt(prixB, cfg.sB)}) at the spot rate: what does it cost in ${cfg.cotee}?`
            : `Convertissez le burger du pays de base (${mnt(prixB, cfg.sB)}) au spot : combien coûte-t-il en ${cfg.cotee} ?`,
          reponse: conv, tolerance: 0.01, unite: cfg.sC,
          etapes: [{
            titre: en ? 'One multiplication settles the debate' : 'Une multiplication tranche le débat',
            contenu: en
              ? `${f(prixB)} × ${f(spot, cfg.decS)} = **${mnt(conv, cfg.sC)}**, against ${mnt(prixQ, cfg.sC, sIdx === 2 ? 0 : 2)} locally. ${conv < prixQ ? `The base-country burger comes out CHEAPER once converted — the signature of a cheap base currency, consistent with the ${pct(ecart)} found in b).` : `The base-country burger comes out MORE EXPENSIVE once converted — the signature of a rich base currency, consistent with the ${pct(ecart)} found in b).`} If your conversion contradicts your sign in b), one of the two is wrong.`
              : `${f(prixB)} × ${f(spot, cfg.decS)} = **${mnt(conv, cfg.sC)}**, contre ${mnt(prixQ, cfg.sC, sIdx === 2 ? 0 : 2)} sur place. ${conv < prixQ ? `Le burger du pays de base ressort MOINS cher une fois converti — la signature d'une devise de base bon marché, cohérente avec les ${pct(ecart)} trouvés en b).` : `Le burger du pays de base ressort PLUS cher une fois converti — la signature d'une devise de base chère, cohérente avec les ${pct(ecart)} trouvés en b).`} Si votre conversion contredit votre signe du b), l'un des deux est faux.`,
          }],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 4. m6-pb-04 — Première position commodity — N1                      */
/* ------------------------------------------------------------------ */
const premierePositionCommodity: ProblemeMoule = {
  id: 'm6-pb-04', moduleId: M6,
  titre: 'Première position matière première : du portage à la base',
  titreEn: 'A first commodity position: from carry to basis',
  typeDeCas: 'courbe des futures',
  typeDeCasEn: 'futures curve',
  difficulte: 1,
  scenarios: ['Le junior au desk énergie', 'Le banquier privé face à un client or', 'La coopérative et le blé avant récolte'],
  scenariosEn: ['The junior on the energy desk', 'The private banker and a gold client', 'The co-op and wheat before harvest'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const cfg = ([
      { nom: 'Brent', nomEn: 'Brent', sym: '$', uQte: '$ / baril', uQteEn: '$ / barrel', sMin: 68, sMax: 92, fiMin: 3, fiMax: 5, stMin: 1.5, stMax: 3, cvMin: 0.5, cvMax: 1.5 },
      { nom: 'or', nomEn: 'gold', sym: '$', uQte: '$ / once', uQteEn: '$ / ounce', sMin: 1900, sMax: 2700, fiMin: 2.5, fiMax: 5, stMin: 0.1, stMax: 0.4, cvMin: 0, cvMax: 0 },
      { nom: 'blé', nomEn: 'wheat', sym: '€', uQte: '€ / tonne', uQteEn: '€ / tonne', sMin: 190, sMax: 260, fiMin: 2, fiMax: 3.5, stMin: 2.5, stMax: 4, cvMin: 7, cvMax: 11 },
    ] as const)[sIdx];
    const spot = sIdx === 1 ? randInt(rng, cfg.sMin, cfg.sMax) : randFloat(rng, cfg.sMin, cfg.sMax, 2);
    const fi = randFloat(rng, cfg.fiMin, cfg.fiMax, 1);  // financement %
    const st = randFloat(rng, cfg.stMin, cfg.stMax, 1);  // stockage %
    const cv = randFloat(rng, cfg.cvMin, cfg.cvMax, 1);  // convenience yield %
    const net = r2(fi + st - cv);
    const f6 = r2(forwardCommodity(spot, fi, st, cv, 0.5));
    const f12 = r2(forwardCommodity(spot, fi, st, cv, 1));
    const base12 = r2(baseFutures(spot, f12));
    const contango = f12 > spot;

    const { en, f, pct, mnt } = outils(langue);
    const nom = en ? cfg.nomEn : cfg.nom;
    const uQ = en ? cfg.uQteEn : cfg.uQte;
    const desc = en
      ? `spot at ${mnt(spot, cfg.sym, sIdx === 1 ? 0 : 2)}, financing at ${pct(fi, 1)}, storage at ${pct(st, 1)} and a convenience yield of ${pct(cv, 1)} per year`
      : `spot à ${mnt(spot, cfg.sym, sIdx === 1 ? 0 : 2)}, financement à ${pct(fi, 1)}, stockage à ${pct(st, 1)} et un convenience yield de ${pct(cv, 1)} par an`;
    const contexte = (en
      ? [
        `First morning on the energy desk: the senior trader hands you the ${nom} sheet — ${desc} — and asks for the cash-and-carry numbers before the open: the 6-month forward, the 12-month forward with the name of the regime, and the basis the desk will watch converge.`,
        `A private-banking client wants "real" ${nom} exposure and asks why the term price differs from the screen price: ${desc}. You answer with the carry arithmetic — forwards at 6 and 12 months, the regime, and the basis — the calmest possible way to show there is no anomaly, only carry.`,
        `At the grain co-op, the season is tense and storage is scarce: for ${nom}, ${desc}. Before quoting a term sale, the risk manager rebuilds the curve — 6 months, 12 months, regime — and reads the basis as the market's verdict on the tightness of the physical.`,
      ]
      : [
        `Premier matin au desk énergie : le trader senior vous tend la feuille du ${nom} — ${desc} — et veut les chiffres du cash and carry avant l'ouverture : le forward 6 mois, le forward 12 mois avec le nom du régime, et la base que le desk regardera converger.`,
        `Un client de banque privée veut une exposition « en vrai » au ${nom} et demande pourquoi le prix à terme diffère du prix à l'écran : ${desc}. Vous répondez par l'arithmétique du portage — forwards 6 et 12 mois, régime, base — la façon la plus calme de montrer qu'il n'y a aucune anomalie, seulement du portage.`,
        `À la coopérative céréalière, la saison est tendue et les silos rares : pour le ${nom}, ${desc}. Avant de coter une vente à terme, le responsable des risques reconstruit la courbe — 6 mois, 12 mois, régime — et lit la base comme le verdict du marché sur la tension du physique.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The 6-month forward' : 'a) Le forward 6 mois',
          enonce: en
            ? `By cash and carry, what is the 6-month forward price of ${nom}?`
            : `Par le cash and carry, que vaut le forward 6 mois du ${nom} ?`,
          reponse: f6, tolerance: 0.005, unite: uQ,
          etapes: [{
            titre: en ? 'Net carry first, then half a year of it' : 'Le portage net d\'abord, puis six mois de ce portage',
            contenu: en
              ? `Net carry = financing + storage − convenience = ${f(fi, 1)} + ${f(st, 1)} − ${f(cv, 1)} = ${pct(net, 1)} per year. $F = S \\times (1 + \\frac{c}{100} T)$ = ${f(spot, sIdx === 1 ? 0 : 2)} × ${f(1 + (net / 100) * 0.5, 4)} = **${mnt(f6, cfg.sym)}**.`
              : `Portage net = financement + stockage − convenience = ${f(fi, 1)} + ${f(st, 1)} − ${f(cv, 1)} = ${pct(net, 1)} par an. $F = S \\times (1 + \\frac{c}{100} T)$ = ${f(spot, sIdx === 1 ? 0 : 2)} × ${f(1 + (net / 100) * 0.5, 4)} = **${mnt(f6, cfg.sym)}**.`,
          }],
          pieges: [en
            ? `The convenience yield SUBTRACTS from the carry: it is the dividend of holding the physical. Adding it puts the curve on the wrong side.`
            : `Le convenience yield se RETRANCHE du portage : c'est le dividende de la détention physique. L'additionner met la courbe du mauvais côté.`],
        },
        {
          intitule: en ? 'b) The 12-month forward and the regime' : 'b) Le forward 12 mois et le régime',
          enonce: en
            ? `Same carry, one-year horizon: what is the 12-month forward price?`
            : `Même portage, horizon un an : que vaut le forward 12 mois ?`,
          reponse: f12, tolerance: 0.005, unite: uQ,
          etapes: [
            {
              titre: en ? 'A full year of net carry' : 'Une année pleine de portage net',
              contenu: en
                ? `F = ${f(spot, sIdx === 1 ? 0 : 2)} × ${f(1 + net / 100, 4)} = **${mnt(f12, cfg.sym)}**, after ${mnt(f6, cfg.sym)} at 6 months: the curve ${contango ? 'rises' : 'falls'} steadily along the horizon.`
                : `F = ${f(spot, sIdx === 1 ? 0 : 2)} × ${f(1 + net / 100, 4)} = **${mnt(f12, cfg.sym)}**, après ${mnt(f6, cfg.sym)} à 6 mois : la courbe ${contango ? 'monte' : 'descend'} régulièrement le long de l'horizon.`,
            },
            {
              titre: en ? 'Name the regime' : 'Nommer le régime',
              contenu: en
                ? `${contango ? `F > S: **contango** — the normal regime of a well-supplied market, the term simply quotes spot plus the cost of carrying it (net carry ${pct(net, 1)} > 0).` : `F < S: **backwardation** — the convenience yield (${pct(cv, 1)}) crushes financing and storage: having the physical NOW is worth a premium, the signature of a tight market.`}`
                : `${contango ? `F > S : **contango** — le régime normal d'un marché bien approvisionné, le terme cote simplement le spot plus le coût de le porter (portage net ${pct(net, 1)} > 0).` : `F < S : **backwardation** — le convenience yield (${pct(cv, 1)}) écrase financement et stockage : avoir le physique MAINTENANT vaut une prime, signature d'un marché tendu.`}`,
            },
          ],
        },
        {
          intitule: en ? 'c) The basis' : 'c) La base',
          enonce: en
            ? `What is the basis against the 12-month contract (spot − futures), sign included?`
            : `Que vaut la base contre le contrat 12 mois (spot − futures), signe compris ?`,
          reponse: base12, tolerance: Math.max(0.05, Math.abs(base12) * 0.02), toleranceMode: 'absolu', unite: uQ,
          etapes: [
            {
              titre: en ? 'Spot minus futures' : 'Spot moins futures',
              contenu: en
                ? `Basis = S − F = ${f(spot, sIdx === 1 ? 0 : 2)} − ${f(f12)} = **${mnt(base12, cfg.sym)}**: ${contango ? 'negative, as always in contango' : 'positive, as always in backwardation'}.`
                : `Base = S − F = ${f(spot, sIdx === 1 ? 0 : 2)} − ${f(f12)} = **${mnt(base12, cfg.sym)}** : ${contango ? 'négative, comme toujours en contango' : 'positive, comme toujours en backwardation'}.`,
            },
            {
              titre: en ? 'Where the basis is headed' : 'Où va la base',
              contenu: en
                ? `Mechanically towards ZERO: at expiry the futures becomes spot, so the ${mnt(Math.abs(base12), cfg.sym)} gap must melt away over the year. Desks trade that convergence; mistaking the basis for a profit available today ignores the carry that explains it.`
                : `Mécaniquement vers ZÉRO : à l'échéance le futures devient du spot, l'écart de ${mnt(Math.abs(base12), cfg.sym)} doit donc fondre sur l'année. Les desks tradent cette convergence ; prendre la base pour un profit disponible aujourd'hui, c'est oublier le portage qui l'explique.`,
            },
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 5. m6-pb-05 — L'exportateur couvert — N2                            */
/* ------------------------------------------------------------------ */
const exportateurCouvert: ProblemeMoule = {
  id: 'm6-pb-05', moduleId: M6,
  titre: "L'exportateur couvert : le forward au banc d'essai",
  titreEn: 'The hedged exporter: the forward on trial',
  typeDeCas: 'couverture de change',
  typeDeCasEn: 'FX hedging',
  difficulte: 2,
  scenarios: ['La PME française payée en dollars', "L'industriel britannique et son contrat US", "L'équipementier japonais facturé en dollars"],
  scenariosEn: ['The French SME paid in dollars', 'The UK manufacturer and its US contract', 'The Japanese supplier invoicing in dollars'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // mult=false : recettes domestiques = M/F (créance USD, paire DOM/USD).
    // mult=true  : recettes domestiques = M×F (créance USD, paire USD/DOM — Japon).
    const cfg = ([
      { paire: 'EUR/USD', dom: 'EUR', sDom: '€', mult: false, decQ: 4, decDom: 3, mMin: 2, mMax: 10, sMin: 1.05, sMax: 1.15, rcMin: 4, rcMax: 5.5, rbMin: 2, rbMax: 3.5, uDom: 'M€', tolF: 0.0005 },
      { paire: 'GBP/USD', dom: 'GBP', sDom: '£', mult: false, decQ: 4, decDom: 3, mMin: 5, mMax: 20, sMin: 1.20, sMax: 1.32, rcMin: 3.5, rcMax: 4.5, rbMin: 5, rbMax: 6.5, uDom: 'M£', tolF: 0.0005 },
      { paire: 'USD/JPY', dom: 'JPY', sDom: '¥', mult: true, decQ: 2, decDom: 1, mMin: 5, mMax: 20, sMin: 140, sMax: 158, rcMin: 0.1, rcMax: 1.0, rbMin: 4, rbMax: 5.5, uDom: 'M¥', tolF: 0.05 },
    ] as const)[sIdx];
    const M = randInt(rng, cfg.mMin, cfg.mMax);             // créance en M$ (millions USD)
    const spot = randFloat(rng, cfg.sMin, cfg.sMax, cfg.decQ);
    const rc = randFloat(rng, cfg.rcMin, cfg.rcMax, 1);     // taux devise cotée
    const rb = randFloat(rng, cfg.rbMin, cfg.rbMax, 1);     // taux devise de base
    const v = randFloat(rng, -6, 6, 1);                     // variation du spot sur 6 mois
    const fwd = rN(forwardFx(spot, rc, rb, 0.5), cfg.decQ);
    const sf = rN(spot * (1 + v / 100), cfg.decQ);
    const verrou = rN(cfg.mult ? M * fwd : M / fwd, cfg.decDom);     // recettes couvertes
    const sansCouv = rN(cfg.mult ? M * sf : M / sf, cfg.decDom);     // recettes au spot final
    const gain = rN(verrou - sansCouv, cfg.decDom);                  // >0 : la couverture a gagné
    const hedgeGagne = gain > 0;

    const { en, f, pct, mln } = outils(langue);
    const desc = en
      ? `a ${f(M, 0)} million dollar receivable due in 6 months, ${cfg.paire} spot at ${f(spot, cfg.decQ)}, the quoted-currency rate at ${pct(rc, 1)} and the base-currency rate at ${pct(rb, 1)}`
      : `une créance de ${f(M, 0)} millions de dollars à 6 mois, spot ${cfg.paire} à ${f(spot, cfg.decQ)}, taux de la devise cotée à ${pct(rc, 1)} et taux de la devise de base à ${pct(rb, 1)}`;
    const descFin = en
      ? `Six months later, the spot settles at ${f(sf, cfg.decQ)}.`
      : `Six mois plus tard, le spot s'établit à ${f(sf, cfg.decQ)}.`;
    const contexte = (en
      ? [
        `A French SME has just won a US contract: ${desc}. The CFO sells the dollars forward the day the deal is signed. ${descFin} The board now wants the full story: the forward rate, the euros locked in, what an unhedged treasury would have collected, and the ex-post verdict on the hedge.`,
        `A British manufacturer ships machinery to Texas: ${desc}. Treasury hedges the whole receivable with an outright forward. ${descFin} The audit committee asks for the four numbers — forward, pounds locked, the unhedged counterfactual, and what the hedge gained or gave up.`,
        `A Japanese parts supplier invoices its American client in dollars: ${desc}. The treasurer locks the conversion with a forward sale of dollars. ${descFin} For the quarterly review: the forward, the yen secured, the unhedged alternative, and the hedge's ex-post score.`,
      ]
      : [
        `Une PME française vient de gagner un contrat américain : ${desc}. La directrice financière vend les dollars à terme le jour de la signature. ${descFin} Le conseil veut maintenant l'histoire complète : le cours forward, les euros verrouillés, ce qu'une trésorerie non couverte aurait encaissé, et le verdict ex post sur la couverture.`,
        `Un industriel britannique livre des machines au Texas : ${desc}. La trésorerie couvre toute la créance par un forward sec. ${descFin} Le comité d'audit demande les quatre chiffres — forward, livres verrouillées, contrefactuel sans couverture, et ce que la couverture a gagné ou abandonné.`,
        `Un équipementier japonais facture son client américain en dollars : ${desc}. Le trésorier verrouille la conversion par une vente à terme de dollars. ${descFin} Pour la revue trimestrielle : le forward, les yens sécurisés, l'alternative non couverte, et le score ex post de la couverture.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The 6-month forward rate' : 'a) Le cours forward 6 mois',
          enonce: en
            ? `At what forward rate does the bank commit to convert in 6 months?`
            : `À quel cours forward la banque s'engage-t-elle à convertir dans 6 mois ?`,
          reponse: fwd, tolerance: cfg.tolF, toleranceMode: 'absolu',
          unite: en ? `${cfg.paire.slice(4)} per ${cfg.paire.slice(0, 3)}` : `${cfg.paire.slice(4)} par ${cfg.paire.slice(0, 3)}`,
          etapes: [{
            titre: en ? 'Covered parity, half a year' : 'Parité couverte, sur six mois',
            contenu: en
              ? `$F = S \\times \\frac{1 + r_{\\text{quoted}} T}{1 + r_{\\text{base}} T}$ = ${f(spot, cfg.decQ)} × ${f(1 + (rc / 100) * 0.5, 5)} / ${f(1 + (rb / 100) * 0.5, 5)} = **${f(fwd, cfg.decQ)}**. The bank predicts nothing: it hedges itself and passes the rate differential on to you.`
              : `$F = S \\times \\frac{1 + r_{\\text{cotée}} T}{1 + r_{\\text{base}} T}$ = ${f(spot, cfg.decQ)} × ${f(1 + (rc / 100) * 0.5, 5)} / ${f(1 + (rb / 100) * 0.5, 5)} = **${f(fwd, cfg.decQ)}**. La banque ne prédit rien : elle se couvre elle-même et vous répercute le différentiel de taux.`,
          }],
        },
        {
          intitule: en ? 'b) The locked-in revenue' : 'b) Les recettes verrouillées',
          enonce: en
            ? `How much domestic currency does the forward guarantee at maturity, in ${cfg.uDom}?`
            : `Combien de devise domestique le forward garantit-il à l'échéance, en ${cfg.uDom} ?`,
          reponse: verrou, tolerance: 0.005, unite: cfg.uDom,
          etapes: [{
            titre: en ? 'Convert the receivable at the forward' : 'Convertir la créance au forward',
            contenu: en
              ? `${cfg.mult
                ? `USD/JPY quotes yen per dollar, so the dollars MULTIPLY: ${f(M, 0)} × ${f(fwd, cfg.decQ)} = **${mln(verrou, cfg.sDom, cfg.decDom)}**`
                : `${cfg.paire} quotes dollars per ${cfg.dom}, so the dollars DIVIDE: ${f(M, 0)} / ${f(fwd, cfg.decQ)} = **${mln(verrou, cfg.sDom, cfg.decDom)}**`}, whatever the spot does between now and maturity. That certainty is the whole product.`
              : `${cfg.mult
                ? `USD/JPY cote des yens par dollar, les dollars se MULTIPLIENT donc : ${f(M, 0)} × ${f(fwd, cfg.decQ)} = **${mln(verrou, cfg.sDom, cfg.decDom)}**`
                : `${cfg.paire} cote des dollars par ${cfg.dom}, les dollars se DIVISENT donc : ${f(M, 0)} / ${f(fwd, cfg.decQ)} = **${mln(verrou, cfg.sDom, cfg.decDom)}**`}, quoi que fasse le spot d'ici l'échéance. Cette certitude est tout le produit.`,
          }],
          pieges: [en
            ? `Multiplying when the pair divides (or the reverse) is trap #1 of the module: always re-read the pair as "price of one unit of BASE in QUOTED" before converting.`
            : `Multiplier quand la paire divise (ou l'inverse) est le piège n° 1 du module : relisez toujours la paire comme « prix d'une unité de BASE en COTÉE » avant de convertir.`],
        },
        {
          intitule: en ? 'c) The world without the hedge' : 'c) Le monde sans couverture',
          enonce: en
            ? `Unhedged, converting at the final spot of ${f(sf, cfg.decQ)}: how much would the treasury have collected, in ${cfg.uDom}?`
            : `Sans couverture, en convertissant au spot final de ${f(sf, cfg.decQ)} : combien la trésorerie aurait-elle encaissé, en ${cfg.uDom} ?`,
          reponse: sansCouv, tolerance: 0.005, unite: cfg.uDom,
          etapes: [{
            titre: en ? 'Same conversion, at the realised spot' : 'Même conversion, au spot réalisé',
            contenu: en
              ? `${cfg.mult ? `${f(M, 0)} × ${f(sf, cfg.decQ)}` : `${f(M, 0)} / ${f(sf, cfg.decQ)}`} = **${mln(sansCouv, cfg.sDom, cfg.decDom)}**. Between signing and payment the spot moved by ${pct(v, 1)} — exactly the risk the forward had neutralised.`
              : `${cfg.mult ? `${f(M, 0)} × ${f(sf, cfg.decQ)}` : `${f(M, 0)} / ${f(sf, cfg.decQ)}`} = **${mln(sansCouv, cfg.sDom, cfg.decDom)}**. Entre signature et paiement, le spot a bougé de ${pct(v, 1)} — exactement le risque que le forward avait neutralisé.`,
          }],
        },
        {
          intitule: en ? 'd) The ex-post verdict' : 'd) Le verdict ex post',
          enonce: en
            ? `What did the hedge gain (or give up) against no hedge at all, in ${cfg.uDom} (positive = the hedge won)?`
            : `Qu'a gagné (ou abandonné) la couverture par rapport à l'absence de couverture, en ${cfg.uDom} (positif = la couverture a gagné) ?`,
          reponse: gain, tolerance: Math.max(sIdx === 2 ? 2 : 0.01, Math.abs(gain) * 0.02), toleranceMode: 'absolu', unite: cfg.uDom,
          etapes: [
            {
              titre: en ? 'Locked minus unhedged' : 'Verrouillé moins non couvert',
              contenu: en
                ? `Gain = ${f(verrou, cfg.decDom)} − ${f(sansCouv, cfg.decDom)} = **${mln(gain, cfg.sDom, cfg.decDom)}**. ${hedgeGagne ? 'The spot ended on the wrong side of the forward: the hedge saved that amount of margin.' : 'The spot ended better than the forward: the hedge "cost" that shortfall — the price of certainty, not a mistake.'}`
                : `Gain = ${f(verrou, cfg.decDom)} − ${f(sansCouv, cfg.decDom)} = **${mln(gain, cfg.sDom, cfg.decDom)}**. ${hedgeGagne ? 'Le spot a fini du mauvais côté du forward : la couverture a sauvé ce montant de marge.' : 'Le spot a fini mieux que le forward : la couverture a « coûté » ce manque à gagner — le prix de la certitude, pas une erreur.'}`,
            },
            {
              titre: en ? 'How to judge a hedge' : 'Comment juger une couverture',
              contenu: en
                ? `Ex ante, not ex post. The exporter's job is margin, not currency punting: the forward turned an uncertain revenue into a certain one at ${f(fwd, cfg.decQ)}. Judging it on the realised spot is like calling fire insurance wasted because the house did not burn.`
                : `Ex ante, pas ex post. Le métier de l'exportateur est la marge, pas le pari de change : le forward a transformé une recette incertaine en recette certaine à ${f(fwd, cfg.decQ)}. La juger sur le spot réalisé revient à déclarer l'assurance incendie inutile parce que la maison n'a pas brûlé.`,
            },
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 6. m6-pb-06 — L'importateur non couvert — N2                        */
/* ------------------------------------------------------------------ */
const importateurNonCouvert: ProblemeMoule = {
  id: 'm6-pb-06', moduleId: M6,
  titre: "L'importateur qui n'avait pas couvert",
  titreEn: 'The importer who did not hedge',
  typeDeCas: 'risque de change',
  typeDeCasEn: 'FX risk',
  difficulte: 2,
  scenarios: ["Le distributeur français d'électronique", 'La maison de négoce britannique', 'Le minotier japonais et son blé en dollars'],
  scenariosEn: ['The French electronics distributor', 'The British trading house', 'The Japanese miller and his dollar wheat'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // mult=false : coût domestique = M/S (facture USD, paire DOM/USD) ; la devise
    // domestique (base) se déprécie de x % ⇒ S1 = S0 × (1 − x/100).
    // mult=true : coût = M×S (USD/JPY) ; le dollar s'apprécie de x % ⇒ S1 = S0 × (1 + x/100).
    const cfg = ([
      { paire: 'EUR/USD', dom: 'EUR', sDom: '€', mult: false, decQ: 4, decDom: 3, mDiv: 10, mMin: 5, mMax: 30, sMin: 1.05, sMax: 1.15, uDom: 'M€' },
      { paire: 'GBP/USD', dom: 'GBP', sDom: '£', mult: false, decQ: 4, decDom: 3, mDiv: 10, mMin: 10, mMax: 50, sMin: 1.20, sMax: 1.32, uDom: 'M£' },
      { paire: 'USD/JPY', dom: 'JPY', sDom: '¥', mult: true, decQ: 2, decDom: 1, mDiv: 1, mMin: 2, mMax: 8, sMin: 140, sMax: 158, uDom: 'M¥' },
    ] as const)[sIdx];
    const M = randInt(rng, cfg.mMin, cfg.mMax) / cfg.mDiv;  // facture en M$
    const s0 = randFloat(rng, cfg.sMin, cfg.sMax, cfg.decQ);
    const x = randFloat(rng, 3, 9, 1);                      // ampleur du choc de change, %
    const m = randFloat(rng, 8, 15, 1);                     // marge prévue, % du coût budgété
    const s1 = rN(s0 * (1 + (cfg.mult ? x : -x) / 100), cfg.decQ);
    const cout0 = rN(cfg.mult ? M * s0 : M / s0, cfg.decDom);
    const cout1 = rN(cfg.mult ? M * s1 : M / s1, cfg.decDom);
    const surcout = rN(cout1 - cout0, cfg.decDom);
    const surcoutPct = r2((surcout / cout0) * 100);
    const marge = rN(cout0 * (m / 100), cfg.decDom);
    const part = r1((surcout / marge) * 100);               // % de la marge consumé

    const { en, f, pct, mln } = outils(langue);
    const choc = en
      ? (cfg.mult ? `the dollar appreciates by ${pct(x, 1)} against the yen` : `the ${cfg.dom === 'EUR' ? 'euro' : 'pound'} depreciates by ${pct(x, 1)} against the dollar`)
      : (cfg.mult ? `le dollar s'apprécie de ${pct(x, 1)} contre le yen` : `${cfg.dom === 'EUR' ? "l'euro" : 'la livre'} se déprécie de ${pct(x, 1)} contre le dollar`);
    const desc = en
      ? `an invoice of ${f(M, 1)} million dollars payable in 6 months, ${cfg.paire} spot at ${f(s0, cfg.decQ)} on order day, and a planned margin of ${pct(m, 1)} of the budgeted cost`
      : `une facture de ${f(M, 1)} millions de dollars payable à 6 mois, spot ${cfg.paire} à ${f(s0, cfg.decQ)} au jour de la commande, et une marge prévue de ${pct(m, 1)} du coût budgété`;
    const contexte = (en
      ? [
        `A French electronics distributor orders its Christmas inventory from Asia, invoiced in dollars: ${desc}. "The euro never moves that much", says the boss — no hedge. By payment day, ${choc}. Time to put numbers on the lesson: budgeted cost, actual cost, the overrun, and how much of the margin it devoured.`,
        `A British trading house buys a commodity cargo, dollars payable in 6 months: ${desc}. The hedging memo stays unsigned in a drawer. By settlement, ${choc}. The CFO reconstructs the damage in four steps, from budget to margin.`,
        `A Japanese miller imports US wheat, invoiced in dollars: ${desc}. No forward, "too expensive". Six months later, ${choc}. The quarterly review walks the chain: budgeted yen cost, realised cost, the overrun, the bite taken out of the margin.`,
      ]
      : [
        `Un distributeur français d'électronique commande son stock de Noël en Asie, facturé en dollars : ${desc}. « L'euro ne bouge jamais autant », tranche le patron — pas de couverture. Au jour du paiement, ${choc}. Reste à chiffrer la leçon : coût budgété, coût réel, surcoût, et la part de la marge dévorée.`,
        `Une maison de négoce britannique achète une cargaison de matières premières, dollars payables à 6 mois : ${desc}. La note sur la couverture dort dans un tiroir, jamais signée. Au règlement, ${choc}. Le directeur financier reconstruit le dégât en quatre temps, du budget à la marge.`,
        `Un minotier japonais importe du blé américain, facturé en dollars : ${desc}. Pas de forward, « trop cher ». Six mois plus tard, ${choc}. La revue trimestrielle déroule la chaîne : coût budgété en yens, coût réalisé, surcoût, morsure sur la marge.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The budgeted cost' : 'a) Le coût budgété',
          enonce: en
            ? `At the order-day spot, what cost did the importer budget, in ${cfg.uDom}?`
            : `Au spot du jour de commande, quel coût l'importateur a-t-il budgété, en ${cfg.uDom} ?`,
          reponse: cout0, tolerance: 0.005, unite: cfg.uDom,
          etapes: [{
            titre: en ? 'Convert the invoice at the initial spot' : 'Convertir la facture au spot initial',
            contenu: en
              ? `${cfg.mult ? `USD/JPY quotes yen per dollar: ${f(M, 1)} × ${f(s0, cfg.decQ)}` : `${cfg.paire} quotes dollars per ${cfg.dom}: ${f(M, 1)} / ${f(s0, cfg.decQ)}`} = **${mln(cout0, cfg.sDom, cfg.decDom)}**. This is the number sitting in the business plan — implicitly, a bet that the spot will not move.`
              : `${cfg.mult ? `USD/JPY cote des yens par dollar : ${f(M, 1)} × ${f(s0, cfg.decQ)}` : `${cfg.paire} cote des dollars par ${cfg.dom} : ${f(M, 1)} / ${f(s0, cfg.decQ)}`} = **${mln(cout0, cfg.sDom, cfg.decDom)}**. C'est le chiffre inscrit au budget — implicitement, un pari que le spot ne bougera pas.`,
          }],
        },
        {
          intitule: en ? 'b) The realised cost' : 'b) Le coût réalisé',
          enonce: en
            ? `After the move (${choc}), what does the invoice actually cost, in ${cfg.uDom}?`
            : `Après le choc (${choc}), combien la facture coûte-t-elle réellement, en ${cfg.uDom} ?`,
          reponse: cout1, tolerance: 0.005, unite: cfg.uDom,
          etapes: [
            {
              titre: en ? 'The new spot first' : "Le nouveau spot d'abord",
              contenu: en
                ? `${cfg.mult ? `The dollar gains ${pct(x, 1)}: S₁ = ${f(s0, cfg.decQ)} × ${f(1 + x / 100, 3)} = ${f(s1, cfg.decQ)}.` : `The ${cfg.dom === 'EUR' ? 'euro' : 'pound'} loses ${pct(x, 1)}: S₁ = ${f(s0, cfg.decQ)} × ${f(1 - x / 100, 3)} = ${f(s1, cfg.decQ)} (the pair falls — the base is worth less).`}`
                : `${cfg.mult ? `Le dollar gagne ${pct(x, 1)} : S₁ = ${f(s0, cfg.decQ)} × ${f(1 + x / 100, 3)} = ${f(s1, cfg.decQ)}.` : `${cfg.dom === 'EUR' ? "L'euro" : 'La livre'} perd ${pct(x, 1)} : S₁ = ${f(s0, cfg.decQ)} × ${f(1 - x / 100, 3)} = ${f(s1, cfg.decQ)} (la paire baisse — la base vaut moins).`}`,
            },
            {
              titre: en ? 'Then the conversion' : 'Puis la conversion',
              contenu: en
                ? `${cfg.mult ? `${f(M, 1)} × ${f(s1, cfg.decQ)}` : `${f(M, 1)} / ${f(s1, cfg.decQ)}`} = **${mln(cout1, cfg.sDom, cfg.decDom)}**. Same invoice in dollars, heavier in domestic currency: the move landed entirely on the buyer.`
                : `${cfg.mult ? `${f(M, 1)} × ${f(s1, cfg.decQ)}` : `${f(M, 1)} / ${f(s1, cfg.decQ)}`} = **${mln(cout1, cfg.sDom, cfg.decDom)}**. Même facture en dollars, plus lourde en devise domestique : le choc a atterri intégralement sur l'acheteur.`,
            },
          ],
          pieges: [en
            ? `A ${pct(x, 1)} depreciation of the domestic currency raises the cost by MORE than ${pct(x, 1)} when the pair divides: 1/(1−x) > 1+x. The asymmetry always works against the unhedged importer.`
            : `Une dépréciation de ${pct(x, 1)} de la devise domestique renchérit le coût de PLUS de ${pct(x, 1)} quand la paire divise : 1/(1−x) > 1+x. L'asymétrie joue toujours contre l'importateur non couvert.`],
        },
        {
          intitule: en ? 'c) The overrun' : 'c) Le surcoût',
          enonce: en
            ? `What is the overrun against budget, in ${cfg.uDom}?`
            : `Quel est le surcoût par rapport au budget, en ${cfg.uDom} ?`,
          reponse: surcout, tolerance: Math.max(sIdx === 2 ? 1 : 0.005, Math.abs(surcout) * 0.02), toleranceMode: 'absolu', unite: cfg.uDom,
          etapes: [{
            titre: en ? 'Realised minus budgeted' : 'Réalisé moins budgété',
            contenu: en
              ? `Overrun = ${f(cout1, cfg.decDom)} − ${f(cout0, cfg.decDom)} = **${mln(surcout, cfg.sDom, cfg.decDom)}**, i.e. ${pct(surcoutPct)} of the budgeted cost — pure FX, not a cent of it commercial.`
              : `Surcoût = ${f(cout1, cfg.decDom)} − ${f(cout0, cfg.decDom)} = **${mln(surcout, cfg.sDom, cfg.decDom)}**, soit ${pct(surcoutPct)} du coût budgété — du change pur, pas un centime de commercial.`,
          }],
        },
        {
          intitule: en ? 'd) The bite on the margin' : 'd) La morsure sur la marge',
          enonce: en
            ? `The planned margin was ${pct(m, 1)} of the budgeted cost. What share of that margin does the overrun consume, in %?`
            : `La marge prévue valait ${pct(m, 1)} du coût budgété. Quelle part de cette marge le surcoût consomme-t-il, en % ?`,
          reponse: part, tolerance: 1, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'Margin in currency, then the ratio' : 'La marge en devise, puis le ratio',
              contenu: en
                ? `Margin = ${f(cout0, cfg.decDom)} × ${f(m / 100, 3)} = ${mln(marge, cfg.sDom, cfg.decDom)}. Share consumed = ${f(surcout, cfg.decDom)} / ${f(marge, cfg.decDom)} = **${pct(part, 1)}**. ${part >= 100 ? 'More than the whole margin: the deal now LOSES money — the FX move turned a profitable trade into a loss without a single commercial mistake.' : `Nearly ${f(Math.round(part), 0)}% of a year of commercial effort, transferred to the FX market for want of a forward.`}`
                : `Marge = ${f(cout0, cfg.decDom)} × ${f(m / 100, 3)} = ${mln(marge, cfg.sDom, cfg.decDom)}. Part consommée = ${f(surcout, cfg.decDom)} / ${f(marge, cfg.decDom)} = **${pct(part, 1)}**. ${part >= 100 ? "Plus que la marge entière : l'opération PERD désormais de l'argent — le change a changé un contrat rentable en perte sans la moindre erreur commerciale." : `Près de ${f(Math.round(part), 0)} % d'une année d'effort commercial, transférés au marché des changes faute d'un forward.`}`,
            },
            {
              titre: en ? 'The mirror of the hedged exporter' : "Le miroir de l'exportateur couvert",
              contenu: en
                ? `A forward sale of the domestic currency (purchase of dollars) at the order date would have locked the cost once and for all. Hedging is not a market view — it is the refusal to let a thin commercial margin depend on a market that moves ${pct(x, 1)} in six months.`
                : `Un achat à terme des dollars au jour de la commande aurait verrouillé le coût une fois pour toutes. Couvrir n'est pas une opinion de marché — c'est refuser qu'une marge commerciale mince dépende d'un marché qui bouge de ${pct(x, 1)} en six mois.`,
            },
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 7. m6-pb-07 — Carry trade complet — N2                              */
/* ------------------------------------------------------------------ */
const carryTradeComplet: ProblemeMoule = {
  id: 'm6-pb-07', moduleId: M6,
  titre: 'Carry trade : le rouleau compresseur, chiffré',
  titreEn: 'The carry trade: the steamroller, in numbers',
  typeDeCas: 'stratégies de change',
  typeDeCasEn: 'FX strategies',
  difficulte: 2,
  scenarios: ['Le hedge fund yen-peso', 'Le family office franc-real', 'Le prop desk yen-aussie'],
  scenariosEn: ['The yen-peso hedge fund', 'The franc-real family office', 'The yen-aussie prop desk'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const cfg = ([
      { fin: 'JPY', cible: 'MXN', sym: '$', uN: 'M$', nMin: 5, nMax: 50, rfMin: 0.1, rfMax: 0.8, rcMin: 8, rcMax: 11, dMin: -15, dMax: -8 },
      { fin: 'CHF', cible: 'BRL', sym: '€', uN: 'M€', nMin: 2, nMax: 20, rfMin: 0.3, rfMax: 1.5, rcMin: 9, rcMax: 13, dMin: -18, dMax: -10 },
      { fin: 'JPY', cible: 'AUD', sym: '$', uN: 'M$', nMin: 10, nMax: 100, rfMin: 0.1, rfMax: 0.8, rcMin: 3.5, rcMax: 5.5, dMin: -12, dMax: -6 },
    ] as const)[sIdx];
    const N = randInt(rng, cfg.nMin, cfg.nMax);          // notionnel en millions
    const rf = randFloat(rng, cfg.rfMin, cfg.rfMax, 1);  // taux de financement
    const rc = randFloat(rng, cfg.rcMin, cfg.rcMax, 1);  // taux cible
    const d = randFloat(rng, cfg.dMin, cfg.dMax, 1);     // crash : variation de la cible, %
    const diff = r2(rc - rf);
    const pnl0 = r3(pnlCarryTrade(N, rc, rf, 0));
    const pnlCrash = r3(pnlCarryTrade(N, rc, rf, d));
    const seuil = r2(-diff);

    const { en, f, pct, mln } = outils(langue);
    const desc = en
      ? `a notional of ${f(N, 0)} million, funding in ${cfg.fin} at ${pct(rf, 1)}, investment in ${cfg.cible} at ${pct(rc, 1)}`
      : `un notionnel de ${f(N, 0)} millions, financement en ${cfg.fin} à ${pct(rf, 1)}, placement en ${cfg.cible} à ${pct(rc, 1)}`;
    const contexte = (en
      ? [
        `An emerging-markets hedge fund runs the most classic carry on the street: ${desc}. The risk committee wants the full map before sizing up: the carry, the quiet-year P&L, the P&L if the peso drops ${pct(Math.abs(d), 1)}, and the exact move that wipes the carry out.`,
        `A family office, seduced by Brazilian rates, borrows francs to buy real: ${desc}. Before signing, the adviser demands the four numbers of the steamroller — differential, calm-year gain, crash-year loss at ${pct(d, 1)} on the real, and the break-even move.`,
        `On the prop desk, the old yen-aussie trade is back on the book: ${desc}. The head trader, who lived through 2008 and August 2024, asks the junior for the carry, both P&L paths (flat year, ${pct(d, 1)} drop), and the threshold where the position bleeds.`,
      ]
      : [
        `Un hedge fund émergents fait tourner le carry le plus classique de la place : ${desc}. Le comité des risques veut la carte complète avant d'augmenter la taille : le portage, le P&L d'une année calme, le P&L si le peso décroche de ${pct(Math.abs(d), 1)}, et la variation exacte qui efface tout.`,
        `Un family office, séduit par les taux brésiliens, emprunte des francs pour acheter du real : ${desc}. Avant de signer, le conseiller exige les quatre chiffres du rouleau compresseur — différentiel, gain d'année calme, perte de crash à ${pct(d, 1)} sur le real, et le seuil d'équilibre.`,
        `Au prop desk, le vieux trade yen-aussie est de retour dans le livre : ${desc}. Le chef de desk, qui a vécu 2008 et août 2024, demande au junior le portage, les deux trajectoires de P&L (année plate, décrochage de ${pct(d, 1)}), et le seuil où la position saigne.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The carry' : 'a) Le portage',
          enonce: en
            ? `How many points of carry does the position earn per year (rate differential)?`
            : `Combien de points de portage la position rapporte-t-elle par an (différentiel de taux) ?`,
          reponse: diff, tolerance: 0.02, toleranceMode: 'absolu', unite: en ? 'pts' : 'pts',
          etapes: [{
            titre: en ? 'Target rate minus funding rate' : 'Taux cible moins taux de financement',
            contenu: en
              ? `Carry = ${pct(rc, 1)} − ${pct(rf, 1)} = **${f(diff)} points** per year: you borrow cheap ${cfg.fin}, you collect expensive ${cfg.cible}. The strategy IS this number — everything else is the risk attached to it.`
              : `Portage = ${pct(rc, 1)} − ${pct(rf, 1)} = **${f(diff)} points** par an : on emprunte du ${cfg.fin} bon marché, on encaisse du ${cfg.cible} cher. La stratégie EST ce chiffre — tout le reste est le risque qui va avec.`,
          }],
        },
        {
          intitule: en ? 'b) The quiet year' : "b) L'année calme",
          enonce: en
            ? `FX unchanged over the year (Δ = 0): what is the P&L, in ${cfg.uN}?`
            : `Change inchangé sur l'année (Δ = 0) : quel est le P&L, en ${cfg.uN} ?`,
          reponse: pnl0, tolerance: 0.005, unite: cfg.uN,
          etapes: [{
            titre: en ? 'Notional times the differential' : 'Notionnel fois le différentiel',
            contenu: en
              ? `P&L = N × (carry + Δ)/100 = ${f(N, 0)} × (${f(diff)} + 0)/100 = **${mln(pnl0, cfg.sym)}**. The year where nothing happens: the differential drips in, day after day — the regular little gains in front of the steamroller.`
              : `P&L = N × (portage + Δ)/100 = ${f(N, 0)} × (${f(diff)} + 0)/100 = **${mln(pnl0, cfg.sym)}**. L'année où il ne se passe rien : le différentiel tombe, jour après jour — les petits gains réguliers devant le rouleau compresseur.`,
          }],
        },
        {
          intitule: en ? 'c) The crash year' : "c) L'année du crash",
          enonce: en
            ? `The target currency drops by ${pct(Math.abs(d), 1)} (Δ = ${f(d, 1)}): what is the P&L, in ${cfg.uN}?`
            : `La devise cible décroche de ${pct(Math.abs(d), 1)} (Δ = ${f(d, 1)}) : quel est le P&L, en ${cfg.uN} ?`,
          reponse: pnlCrash, tolerance: Math.max(0.01, Math.abs(pnlCrash) * 0.01), toleranceMode: 'absolu', unite: cfg.uN,
          etapes: [
            {
              titre: en ? 'Same formula, ugly input' : 'Même formule, donnée brutale',
              contenu: en
                ? `P&L = ${f(N, 0)} × (${f(diff)} + (${f(d, 1)}))/100 = ${f(N, 0)} × ${f((diff + d) / 100, 4)} = **${mln(pnlCrash, cfg.sym)}**. One bad year ${pnlCrash < 0 ? `erases ${f(r1(Math.abs(pnlCrash) / Math.max(pnl0, 0.001) * 100), 0)}% of a quiet year's gain — and then some` : 'almost wipes out the whole carry'}.`
                : `P&L = ${f(N, 0)} × (${f(diff)} + (${f(d, 1)}))/100 = ${f(N, 0)} × ${f((diff + d) / 100, 4)} = **${mln(pnlCrash, cfg.sym)}**. Une seule mauvaise année ${pnlCrash < 0 ? `efface ${f(r1(Math.abs(pnlCrash) / Math.max(pnl0, 0.001) * 100), 0)} % du gain d'une année calme — et au-delà` : 'mange presque tout le portage'}.`,
            },
            {
              titre: en ? 'Why the crash comes precisely then' : 'Pourquoi le crash arrive précisément là',
              contenu: en
                ? `Carry unwinds are self-reinforcing: losses force exits, exits push the funding currency up, which deepens everyone else's losses. 2008 (yen pairs −30% in months) and 5 August 2024 (brutal yen-carry unwind) are the same film. The realised volatility of three quiet years says nothing about that jump: negative skewness, fat tails.`
                : `Les débouclages de carry s'auto-entretiennent : les pertes forcent des sorties, les sorties font monter la devise de financement, ce qui creuse les pertes des autres. 2008 (paires en yen à −30 % en quelques mois) et le 5 août 2024 (débouclage brutal du carry en yen) sont le même film. La volatilité réalisée de trois années calmes ne dit rien de ce saut : skewness négative, queues épaisses.`,
            },
          ],
          pieges: [en
            ? `Presenting this strategy on its quiet-year Sharpe ratio is the disqualifying mistake: the risk is not in the observed variance, it is in the jump that has not yet happened in the sample.`
            : `Présenter cette stratégie sur le Sharpe de ses années calmes est le contresens qui disqualifie : le risque n'est pas dans la variance observée, il est dans le saut qui n'a pas encore eu lieu dans l'échantillon.`],
        },
        {
          intitule: en ? 'd) The break-even move' : "d) Le seuil d'équilibre",
          enonce: en
            ? `What move Δ* of the target currency (in %) exactly cancels the year's P&L?`
            : `Quelle variation Δ* de la devise cible (en %) annule exactement le P&L de l'année ?`,
          reponse: seuil, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'Set the P&L to zero' : 'Annuler le P&L',
              contenu: en
                ? `N × (carry + Δ*)/100 = 0 ⇔ Δ* = −carry = **${pct(seuil)}**. The cushion is exactly the differential: any depreciation of ${cfg.cible} beyond ${pct(Math.abs(seuil))} in the year puts the position under water.`
                : `N × (portage + Δ*)/100 = 0 ⇔ Δ* = −portage = **${pct(seuil)}**. Le matelas est exactement le différentiel : toute dépréciation du ${cfg.cible} au-delà de ${pct(Math.abs(seuil))} dans l'année met la position sous l'eau.`,
            },
            {
              titre: en ? 'The theory that says this should not pay' : 'La théorie qui dit que cela ne devrait pas payer',
              contenu: en
                ? `Uncovered interest parity claims the expected depreciation equals the differential — i.e. E[Δ] = Δ*, zero expected profit. Decades of data say otherwise (Fama 1984, the forward premium puzzle): the carry has paid on average. That anomaly is the fuel of the trade — and the steamroller is its price.`
                : `La parité non couverte affirme que la dépréciation attendue égale le différentiel — c'est-à-dire E[Δ] = Δ*, profit espéré nul. Des décennies de données disent le contraire (Fama 1984, le forward premium puzzle) : le carry a payé en moyenne. Cette anomalie est le carburant du trade — et le rouleau compresseur en est le prix.`,
            },
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 8. m6-pb-08 — Cours croisés et triangle — N2                        */
/* ------------------------------------------------------------------ */
const triangleArbitrage: ProblemeMoule = {
  id: 'm6-pb-08', moduleId: M6,
  titre: 'Le triangle qui ne boucle pas : cours croisés et arbitrage',
  typeDeCas: 'arbitrage triangulaire',
  titreEn: 'The triangle that does not close: cross rates and arbitrage',
  typeDeCasEn: 'triangular arbitrage',
  difficulte: 2,
  scenarios: ['Le desk de Londres et le cross EUR/GBP', 'Le desk de Tokyo et le cross EUR/JPY', 'Le desk de Zurich et le cross GBP/CHF'],
  scenariosEn: ['The London desk and the EUR/GBP cross', 'The Tokyo desk and the EUR/JPY cross', 'The Zurich desk and the GBP/CHF cross'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // mode 'ratio'   : cross = a/b   (EUR/GBP = EUR/USD ÷ GBP/USD)
    // mode 'produit' : cross = a×b   (EUR/JPY = EUR/USD × USD/JPY ; GBP/CHF = GBP/USD × USD/CHF)
    const cfg = ([
      { pA: 'EUR/USD', pB: 'GBP/USD', pC: 'EUR/GBP', dep: 'EUR', mid: 'USD', ter: 'GBP', mode: 'ratio', aMin: 1.05, aMax: 1.15, bMin: 1.20, bMax: 1.32, decB: 4, decC: 4 },
      { pA: 'EUR/USD', pB: 'USD/JPY', pC: 'EUR/JPY', dep: 'EUR', mid: 'USD', ter: 'JPY', mode: 'produit', aMin: 1.05, aMax: 1.15, bMin: 140, bMax: 158, decB: 2, decC: 2 },
      { pA: 'GBP/USD', pB: 'USD/CHF', pC: 'GBP/CHF', dep: 'GBP', mid: 'USD', ter: 'CHF', mode: 'produit', aMin: 1.20, aMax: 1.32, bMin: 0.86, bMax: 0.95, decB: 4, decC: 4 },
    ] as const)[sIdx];
    const a = randFloat(rng, cfg.aMin, cfg.aMax, 4);
    const b = randFloat(rng, cfg.bMin, cfg.bMax, cfg.decB);
    const eps = randFloat(rng, 0.25, 0.8, 2);          // taille de l'incohérence, %
    const cote = pick(rng, [1, -1] as const);          // cross affiché trop haut ou trop bas
    const cTheo = rN(cfg.mode === 'ratio' ? a / b : a * b, cfg.decC);
    const cAff = rN(cTheo * (1 + (cote * eps) / 100), cfg.decC);
    const ecart = r3((cAff / cTheo - 1) * 100);
    const crossBasse = cAff < cTheo; // le cross sous-cote la devise de départ
    // Jambes du tour PROFITABLE, calculées sur les cotations affichées.
    // crossBasse : départ → mid → ter → départ (on rachète la base bon marché via le cross).
    // sinon      : départ → ter (vente au cross trop haut) → mid → départ.
    let l1: number; let l2: number; let l3: number;
    let c1: string; let c2: string;
    if (crossBasse) {
      c1 = cfg.mid; c2 = cfg.ter;
      l1 = 1_000_000 * a;
      l2 = cfg.mode === 'ratio' ? l1 / b : l1 * b;
      l3 = l2 / cAff;
    } else {
      c1 = cfg.ter; c2 = cfg.mid;
      l1 = 1_000_000 * cAff;
      l2 = cfg.mode === 'ratio' ? l1 * b : l1 / b;
      l3 = l2 / a;
    }
    const profit = Math.round(l3 - 1_000_000);
    const perteMauvais = Math.round((1_000_000 / l3 - 1) * 1_000_000);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `${cfg.pA} at ${f(a, 4)}, ${cfg.pB} at ${f(b, cfg.decB)}, and a regional platform showing ${cfg.pC} at ${f(cAff, cfg.decC)}`
      : `${cfg.pA} à ${f(a, 4)}, ${cfg.pB} à ${f(b, cfg.decB)}, et une plateforme régionale qui affiche ${cfg.pC} à ${f(cAff, cfg.decC)}`;
    const contexte = (en
      ? [
        `On the London desk, three screens light up at once: ${desc}. One of the three quotes is out of line. Your job, ignoring fees: the theoretical cross, the gap, and the P&L of one full turn of the triangle per million ${cfg.dep} — in the right direction, then in the wrong one.`,
        `Tokyo, 7:02 am: ${desc}. The cross has drifted from its synthetic value during the lunch lull. The senior trader gives you thirty seconds: theoretical cross, percentage gap, profit of one triangular loop per million ${cfg.dep}, and what happens to whoever turns the wrong way.`,
        `Zurich, a client platform quotes the cross with a lag: ${desc}. Before the algos close it, quantify the anomaly — synthetic cross, gap, P&L of one loop per million ${cfg.dep} in each direction (fees ignored throughout).`,
      ]
      : [
        `Au desk de Londres, trois écrans s'allument en même temps : ${desc}. Une des trois cotations est en décalage. Votre travail, frais ignorés : le cross théorique, l'écart, et le P&L d'un tour complet du triangle par million de ${cfg.dep} — dans le bon sens, puis dans le mauvais.`,
        `Tokyo, 7 h 02 : ${desc}. Le cross a dérivé de sa valeur synthétique pendant le creux du déjeuner. Le trader senior vous donne trente secondes : cross théorique, écart en pourcentage, profit d'une boucle triangulaire par million de ${cfg.dep}, et ce qui arrive à qui tourne dans le mauvais sens.`,
        `Zurich, une plateforme cliente cote le cross avec retard : ${desc}. Avant que les algos ne referment l'écart, chiffrez l'anomalie — cross synthétique, écart, P&L d'une boucle par million de ${cfg.dep} dans chaque sens (frais ignorés partout).`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The theoretical cross' : 'a) Le cross théorique',
          enonce: en
            ? `From the two dollar pairs, what should ${cfg.pC} quote?`
            : `À partir des deux paires en dollar, combien ${cfg.pC} devrait-il coter ?`,
          reponse: cTheo, tolerance: cfg.decC === 2 ? 0.05 : 0.0005, toleranceMode: 'absolu',
          unite: en ? `${cfg.ter} per ${cfg.dep}` : `${cfg.ter} par ${cfg.dep}`,
          etapes: [{
            titre: en ? 'Route through the dollar' : 'Passer par le dollar',
            contenu: en
              ? `${cfg.mode === 'ratio'
                ? `One ${cfg.dep} is worth ${f(a, 4)} USD; one ${cfg.ter} is worth ${f(b, cfg.decB)} USD. So ${cfg.pC} = ${f(a, 4)} / ${f(b, cfg.decB)} = **${f(cTheo, cfg.decC)}**`
                : `One ${cfg.dep} is worth ${f(a, 4)} USD, and each USD is worth ${f(b, cfg.decB)} ${cfg.ter}. So ${cfg.pC} = ${f(a, 4)} × ${f(b, cfg.decB)} = **${f(cTheo, cfg.decC)}**`} — the synthetic value the desks arbitrage every cross against.`
              : `${cfg.mode === 'ratio'
                ? `Un ${cfg.dep} vaut ${f(a, 4)} USD ; un ${cfg.ter} vaut ${f(b, cfg.decB)} USD. Donc ${cfg.pC} = ${f(a, 4)} / ${f(b, cfg.decB)} = **${f(cTheo, cfg.decC)}**`
                : `Un ${cfg.dep} vaut ${f(a, 4)} USD, et chaque USD vaut ${f(b, cfg.decB)} ${cfg.ter}. Donc ${cfg.pC} = ${f(a, 4)} × ${f(b, cfg.decB)} = **${f(cTheo, cfg.decC)}**`} — la valeur synthétique contre laquelle les desks arbitrent tout cross.`,
          }],
          pieges: [en
            ? `Multiply or divide? Write each pair as "price of one BASE in QUOTED" and chase the units: USD must cancel out. Getting it upside down produces a cross that is absurd at first glance.`
            : `Multiplier ou diviser ? Écrivez chaque paire comme « prix d'une BASE en COTÉE » et suivez les unités : le USD doit se simplifier. Le sens inverse produit un cross absurde au premier regard.`],
        },
        {
          intitule: en ? 'b) The size of the anomaly' : "b) La taille de l'anomalie",
          enonce: en
            ? `By how much does the displayed cross (${f(cAff, cfg.decC)}) deviate from the theoretical one, in % (sign included)?`
            : `De combien le cross affiché (${f(cAff, cfg.decC)}) s'écarte-t-il du théorique, en % (signe compris) ?`,
          reponse: ecart, tolerance: 0.03, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Displayed against synthetic' : 'Affiché contre synthétique',
            contenu: en
              ? `Gap = (${f(cAff, cfg.decC)} / ${f(cTheo, cfg.decC)} − 1) × 100 = **${pct(ecart, 3)}**: the platform ${crossBasse ? `UNDERprices ${cfg.dep} against ${cfg.ter}` : `OVERprices ${cfg.dep} against ${cfg.ter}`}. On liquid majors, real-life gaps live under a few hundredths of a percent and die in milliseconds — this one is a textbook-sized prey.`
              : `Écart = (${f(cAff, cfg.decC)} / ${f(cTheo, cfg.decC)} − 1) × 100 = **${pct(ecart, 3)}** : la plateforme ${crossBasse ? `SOUS-cote ${cfg.dep} contre ${cfg.ter}` : `SUR-cote ${cfg.dep} contre ${cfg.ter}`}. Sur les majors liquides, les écarts réels vivent sous quelques centièmes de pourcent et meurent en millisecondes — celui-ci est une proie de manuel.`,
          }],
        },
        {
          intitule: en ? 'c) One turn in the right direction' : 'c) Un tour dans le bon sens',
          enonce: en
            ? `Starting with 1,000,000 ${cfg.dep} and turning the profitable way, what P&L does one full loop leave, in ${cfg.dep} (fees ignored)?`
            : `En partant de 1 000 000 ${cfg.dep} et en tournant dans le sens profitable, quel P&L laisse une boucle complète, en ${cfg.dep} (frais ignorés) ?`,
          reponse: profit, tolerance: Math.max(50, Math.abs(profit) * 0.02), toleranceMode: 'absolu', unite: cfg.dep,
          etapes: [
            {
              titre: en ? 'The three legs, written out' : 'Les trois jambes, déroulées',
              contenu: en
                ? `${crossBasse
                  ? `Sell the cross-cheap ${cfg.dep} last, not first. 1) 1,000,000 ${cfg.dep} → ${f(l1, 0)} ${c1} (at ${cfg.pA} ${f(a, 4)}); 2) → ${f(l2, 0)} ${c2} (via ${cfg.pB} ${f(b, cfg.decB)}); 3) buy ${cfg.dep} back at the undervalued cross ${f(cAff, cfg.decC)} → **${f(l3, 0)} ${cfg.dep}**.`
                  : `Sell ${cfg.dep} first, where it is overpriced: at the cross. 1) 1,000,000 ${cfg.dep} → ${f(l1, 0)} ${c1} (at ${cfg.pC} ${f(cAff, cfg.decC)}); 2) → ${f(l2, 0)} ${c2} (via ${cfg.pB} ${f(b, cfg.decB)}); 3) back into ${cfg.dep} at ${cfg.pA} ${f(a, 4)} → **${f(l3, 0)} ${cfg.dep}**.`}`
                : `${crossBasse
                  ? `Vendre le ${cfg.dep} sous-coté au cross en DERNIER, pas en premier. 1) 1 000 000 ${cfg.dep} → ${f(l1, 0)} ${c1} (à ${cfg.pA} ${f(a, 4)}) ; 2) → ${f(l2, 0)} ${c2} (via ${cfg.pB} ${f(b, cfg.decB)}) ; 3) rachat du ${cfg.dep} au cross sous-évalué ${f(cAff, cfg.decC)} → **${f(l3, 0)} ${cfg.dep}**.`
                  : `Vendre le ${cfg.dep} là où il est surpayé : au cross, en PREMIER. 1) 1 000 000 ${cfg.dep} → ${f(l1, 0)} ${c1} (à ${cfg.pC} ${f(cAff, cfg.decC)}) ; 2) → ${f(l2, 0)} ${c2} (via ${cfg.pB} ${f(b, cfg.decB)}) ; 3) retour en ${cfg.dep} à ${cfg.pA} ${f(a, 4)} → **${f(l3, 0)} ${cfg.dep}**.`}`,
            },
            {
              titre: en ? 'The loop pays the gap' : "La boucle paie l'écart",
              contenu: en
                ? `P&L = ${f(l3, 0)} − 1,000,000 = **${f(profit, 0)} ${cfg.dep}** per million, with zero net position at the end: the relative gap of b) IS the profit. In real life, three bid/ask spreads and a few milliseconds of latency eat most of it — which is exactly why such gaps stay microscopic.`
                : `P&L = ${f(l3, 0)} − 1 000 000 = **${f(profit, 0)} ${cfg.dep}** par million, avec une position nette nulle à l'arrivée : l'écart relatif du b) EST le profit. En vrai, trois spreads bid/ask et quelques millisecondes de latence en mangent l'essentiel — précisément pourquoi ces écarts restent microscopiques.`,
            },
          ],
        },
        {
          intitule: en ? 'd) One turn in the wrong direction' : 'd) Un tour dans le mauvais sens',
          enonce: en
            ? `Same three quotes, loop turned the other way: what P&L per million ${cfg.dep}?`
            : `Mêmes trois cotations, boucle tournée dans l'autre sens : quel P&L par million de ${cfg.dep} ?`,
          reponse: perteMauvais, tolerance: Math.max(50, Math.abs(perteMauvais) * 0.02), toleranceMode: 'absolu', unite: cfg.dep,
          etapes: [{
            titre: en ? 'The mirror loop' : 'La boucle miroir',
            contenu: en
              ? `Each leg reversed, the factor inverts: final amount = 1,000,000 / ${f(l3 / 1_000_000, 6)} ⇒ P&L = **${f(perteMauvais, 0)} ${cfg.dep}**. To first order you PAY what the right direction earns (the two factors multiply to 1). An arbitrage has a direction: spotting the anomaly is half the job, turning the right way is the other half.`
              : `Chaque jambe inversée, le facteur s'inverse : montant final = 1 000 000 / ${f(l3 / 1_000_000, 6)} ⇒ P&L = **${f(perteMauvais, 0)} ${cfg.dep}**. Au premier ordre, vous PAYEZ ce que le bon sens encaisse (les deux facteurs se multiplient à 1). Un arbitrage a un sens : repérer l'anomalie est la moitié du travail, tourner dans le bon sens est l'autre moitié.`,
          }],
          pieges: [en
            ? `"There is a gap, so any loop wins" is the classic error: the same three quotes that pay one direction charge the other. Always write the three legs before trading.`
            : `« Il y a un écart, donc toute boucle gagne » est l'erreur classique : les trois mêmes cotations qui paient un sens facturent l'autre. Écrivez toujours les trois jambes avant de traiter.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 9. m6-pb-09 — ETF pétrole et roll yield — N2                        */
/* ------------------------------------------------------------------ */
const etfContango: ProblemeMoule = {
  id: 'm6-pb-09', moduleId: M6,
  titre: "L'ETF pétrole et le tapis roulant du contango",
  titreEn: 'The oil ETF and the contango treadmill',
  typeDeCas: 'roll yield',
  typeDeCasEn: 'roll yield',
  difficulte: 2,
  scenarios: ["Le particulier qui a « acheté le pétrole »", "L'allocataire institutionnel sur le Brent", 'Le marché tendu en backwardation'],
  scenariosEn: ['The retail investor who "bought oil"', 'The institutional allocator on Brent', 'The tight market in backwardation'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // back=false : courbe en contango (lointain > proche) ⇒ roll négatif.
    // back=true  : backwardation (lointain < proche) ⇒ roll positif — le 3e scénario
    // sert de point de comparaison aux deux premiers.
    const cfg = ([
      { nom: 'WTI', back: false, mois: 3, cMin: 10, cMax: 100, cMul: 1000, fMin: 70, fMax: 85, qMin: 1.2, qMax: 2.5, sMin: 5, sMax: 20 },
      { nom: 'Brent', back: false, mois: 2, cMin: 1, cMax: 10, cMul: 1_000_000, fMin: 72, fMax: 88, qMin: 0.8, qMax: 1.8, sMin: 5, sMax: 15 },
      { nom: 'WTI', back: true, mois: 3, cMin: 50, cMax: 500, cMul: 1000, fMin: 80, fMax: 95, qMin: 1.0, qMax: 2.2, sMin: 4, sMax: 15 },
    ] as const)[sIdx];
    const cap = randInt(rng, cfg.cMin, cfg.cMax) * cfg.cMul;  // capital investi, $
    const fn = randFloat(rng, cfg.fMin, cfg.fMax, 2);          // contrat proche
    const q = randFloat(rng, cfg.qMin, cfg.qMax, 2);           // pente entre échéances, %
    const s = randFloat(rng, cfg.sMin, cfg.sMax, 1);           // spot return du c), %
    const ff = r2(fn * (1 + (cfg.back ? -q : q) / 100));       // contrat lointain
    const roll = r2(rollYieldAnnualise(fn, ff, cfg.mois / 12));
    const pnl1 = Math.round(cap * (roll / 100));
    const total = r2(s + roll);
    const cumul3 = Math.round(cap * ((1 + roll / 100) ** 3 - 1));

    const { en, f, pct, mnt } = outils(langue);
    const desc = en
      ? `the near ${cfg.nom} contract (${cfg.mois} month${cfg.mois > 1 ? 's' : ''} out) trades at ${mnt(fn, '$')} and the next one at ${mnt(ff, '$')}, and the position is worth ${mnt(cap, '$', 0)}`
      : `le contrat ${cfg.nom} proche (à ${cfg.mois} mois) cote ${mnt(fn, '$')} et le suivant ${mnt(ff, '$')}, et la position vaut ${mnt(cap, '$', 0)}`;
    const contexte = (en
      ? [
        `A retail investor "bought oil" through a futures ETF and cannot understand why his line lags the barrel on TV: ${desc}. You owe him the honest arithmetic — the annualised roll yield, what one flat-spot year costs, what a rally really leaves, and what three years of treadmill add up to.`,
        `An institutional allocator holds a Brent exposure rolled every ${cfg.mois} months: ${desc}. The investment committee wants the carry of the position spelled out: annualised roll, one-year cost at flat spot, total return under a spot scenario, and the three-year compounded drag.`,
        `Same exercise, opposite world: the market is TIGHT and the curve is inverted — ${desc}. Run the same four numbers and watch every sign flip against the two contango scenarios: this time the treadmill pays the long.`,
      ]
      : [
        `Un particulier a « acheté le pétrole » via un ETF de futures et ne comprend pas pourquoi sa ligne traîne derrière le baril de la télé : ${desc}. Vous lui devez l'arithmétique honnête — le roll yield annualisé, ce que coûte une année à spot plat, ce qu'une hausse laisse vraiment, et ce que trois ans de tapis roulant cumulent.`,
        `Un allocataire institutionnel détient une exposition Brent rollée tous les ${cfg.mois} mois : ${desc}. Le comité d'investissement veut le portage de la position noir sur blanc : roll annualisé, coût d'un an à spot inchangé, rendement total sous un scénario de spot, et l'érosion composée sur trois ans.`,
        `Même exercice, monde inverse : le marché est TENDU et la courbe inversée — ${desc}. Déroulez les quatre mêmes chiffres et regardez chaque signe se retourner par rapport aux deux scénarios en contango : cette fois, le tapis roulant paie l'acheteur.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The annualised roll yield' : 'a) Le roll yield annualisé',
          enonce: en
            ? `Rolling every ${cfg.mois} months along this curve, what is the annualised roll yield, in % (sign included)?`
            : `En rollant tous les ${cfg.mois} mois le long de cette courbe, quel est le roll yield annualisé, en % (signe compris) ?`,
          reponse: roll, tolerance: 0.1, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Sell the near, buy the far' : 'Vendre le proche, racheter le lointain',
            contenu: en
              ? `Roll = (near/far − 1) / T = (${f(fn)} / ${f(ff)} − 1) / ${f(cfg.mois / 12, 3)} = **${pct(roll)}** per year. ${cfg.back ? 'Backwardation: you sell HIGH and buy back LOW at every roll — the slope pays the long position.' : 'Contango: you sell LOW and buy back HIGH at every roll — the slope taxes the long position, the famous tracker erosion.'}`
              : `Roll = (proche/lointain − 1) / T = (${f(fn)} / ${f(ff)} − 1) / ${f(cfg.mois / 12, 3)} = **${pct(roll)}** par an. ${cfg.back ? 'Backwardation : on vend CHER et on rachète MOINS CHER à chaque roll — la pente paie la position longue.' : 'Contango : on vend MOINS CHER et on rachète PLUS CHER à chaque roll — la pente taxe la position longue, la fameuse érosion des trackers.'}`,
          }],
          pieges: [en
            ? `The sign comes from the ROLL mechanics (sell near, buy far), not from a view on prices: in contango the roll yield is negative even if the spot never moves.`
            : `Le signe vient de la MÉCANIQUE du roll (vendre le proche, racheter le lointain), pas d'une opinion sur les prix : en contango, le roll yield est négatif même si le spot ne bouge jamais.`],
        },
        {
          intitule: en ? 'b) One year at flat spot' : 'b) Un an à spot inchangé',
          enonce: en
            ? `Spot unchanged for a year: what does the roll do to the ${mnt(cap, '$', 0)} position, in $?`
            : `Spot inchangé pendant un an : que fait le roll à la position de ${mnt(cap, '$', 0)}, en $ ?`,
          reponse: pnl1, tolerance: 0.01, unite: '$',
          etapes: [{
            titre: en ? 'Capital times the roll' : 'Le capital fois le roll',
            contenu: en
              ? `P&L = ${f(cap, 0)} × ${f(roll)}% = **${mnt(pnl1, '$', 0)}** ${cfg.back ? 'EARNED with the barrel going strictly nowhere: that is the backwardation premium for staying long.' : 'LOST with the barrel going strictly nowhere: not one cent comes from the oil price — the whole bill is the slope, climbed in reverse at every roll.'}`
              : `P&L = ${f(cap, 0)} × ${f(roll)} % = **${mnt(pnl1, '$', 0)}** ${cfg.back ? 'GAGNÉS avec un baril strictement immobile : la prime de backwardation pour rester acheteur.' : 'PERDUS avec un baril strictement immobile : pas un centime ne vient du prix du pétrole — toute la facture est la pente, remontée à contre-sens à chaque roll.'}`,
          }],
        },
        {
          intitule: en ? 'c) The year the barrel moves' : 'c) L\'année où le baril bouge',
          enonce: en
            ? `Now the spot gains ${pct(s, 1)} over the year. To first order, what is the position's total return, in %?`
            : `Cette fois le spot gagne ${pct(s, 1)} sur l'année. Au premier ordre, quel est le rendement total de la position, en % ?`,
          reponse: total, tolerance: 0.2, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'Spot return plus roll yield' : 'Spot return plus roll yield',
              contenu: en
                ? `Total ≈ spot return + roll yield = ${pct(s, 1)} + (${pct(roll)}) = **${pct(total)}** (linear approximation; the collateral yield would add the interest on the cash). ${cfg.back ? 'In backwardation the two engines pull together.' : `The investor sees the barrel up ${pct(s, 1)} on TV and his line up only ${pct(total)}: nobody robbed him — he paid the roll.`}`
                : `Total ≈ spot return + roll yield = ${pct(s, 1)} + (${pct(roll)}) = **${pct(total)}** (approximation linéaire ; le collateral yield ajouterait les intérêts du cash). ${cfg.back ? 'En backwardation, les deux moteurs tirent dans le même sens.' : `Le particulier voit le baril à +${f(s, 1)} % à la télé et sa ligne à ${pct(total)} seulement : personne ne l'a volé — il a payé le roll.`}`,
            },
            {
              titre: en ? 'The decomposition to remember' : 'La décomposition à retenir',
              contenu: en
                ? `Futures total return ≈ spot + roll + collateral. Forgetting the middle term is THE most expensive misunderstanding in retail commodities — the USO episode of April 2020 (super-contango, forced rolls, 1-for-8 reverse split) is its monument.`
                : `Rendement total futures ≈ spot + roll + collatéral. Oublier le terme du milieu est LE malentendu le plus coûteux des matières premières grand public — l'épisode USO d'avril 2020 (super-contango, rolls forcés, regroupement 1 pour 8) en est le monument.`,
            },
          ],
        },
        {
          intitule: en ? 'd) Three years of treadmill' : 'd) Trois ans de tapis roulant',
          enonce: en
            ? `Spot flat for three years, roll unchanged: what does the compounded roll effect amount to on the position, in $?`
            : `Spot plat pendant trois ans, roll inchangé : que cumule l'effet du roll composé sur la position, en $ ?`,
          reponse: cumul3, tolerance: 0.015, unite: '$',
          etapes: [{
            titre: en ? 'Compound the roll, not multiply it' : 'Composer le roll, pas le multiplier',
            contenu: en
              ? `Effect = ${f(cap, 0)} × ((1 + ${f(roll)}%)³ − 1) = ${f(cap, 0)} × ${f((1 + roll / 100) ** 3 - 1, 4)} = **${mnt(cumul3, '$', 0)}**. ${cfg.back ? 'Compounding works FOR the long here — the mirror image of the contango scenarios, where the same arithmetic grinds capital down year after year.' : 'Slightly less than 3 × one year (the base shrinks each year), but the direction is relentless: in contango, time itself is short your position.'}`
              : `Effet = ${f(cap, 0)} × ((1 + ${f(roll)} %)³ − 1) = ${f(cap, 0)} × ${f((1 + roll / 100) ** 3 - 1, 4)} = **${mnt(cumul3, '$', 0)}**. ${cfg.back ? 'La composition joue POUR l\'acheteur ici — l\'image miroir des scénarios en contango, où la même arithmétique rabote le capital année après année.' : 'Un peu moins que 3 × un an (l\'assiette rétrécit chaque année), mais la direction est implacable : en contango, le temps lui-même est vendeur de votre position.'}`,
          }],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 10. m6-pb-10 — L'or et les taux réels — N2                          */
/* ------------------------------------------------------------------ */
const orTauxReels: ProblemeMoule = {
  id: 'm6-pb-10', moduleId: M6,
  titre: "L'or face au taux sans risque : le coût de ce qui ne verse rien",
  titreEn: 'Gold versus the risk-free rate: the cost of what pays nothing',
  typeDeCas: "coût d'opportunité",
  typeDeCasEn: 'opportunity cost',
  difficulte: 2,
  scenarios: ["L'épargnant et son lingot de cinq ans", 'Le family office et son allocation or', "Le candidat face au « refuge » de l'oral"],
  scenariosEn: ['The saver and his five-year ingot', 'The family office and its gold sleeve', 'The candidate and the "safe haven" question'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const cfg = ([
      { ans: 5, pMin: 1700, pMax: 2100, tMin: 10, tMax: 60, rMin: 2, rMax: 4.5, cMin: 10, cMax: 50, cMul: 1000 },
      { ans: 3, pMin: 1800, pMax: 2300, tMin: -10, tMax: 35, rMin: 3, rMax: 5, cMin: 10, cMax: 50, cMul: 100_000 },
      { ans: 8, pMin: 1200, pMax: 1800, tMin: 20, tMax: 120, rMin: 1.5, rMax: 3.5, cMin: 8, cMax: 15, cMul: 10_000 },
    ] as const)[sIdx];
    const p0 = randInt(rng, cfg.pMin, cfg.pMax);                  // prix de départ, $/oz
    const tot = randFloat(rng, cfg.tMin, cfg.tMax, 1);            // variation totale, %
    const r = randFloat(rng, cfg.rMin, cfg.rMax, 1);              // taux sans risque annuel
    const cap = randInt(rng, cfg.cMin, cfg.cMax) * cfg.cMul;      // capital initial, $
    const pf = Math.round(p0 * (1 + tot / 100));                  // prix final, $/oz
    const N = cfg.ans;
    const cagr = r2(variationAnnualiseePct(p0, pf, N));
    const vCash = Math.round(cap * (1 + r / 100) ** N);
    const vOr = Math.round(cap * (pf / p0));
    const cout = vCash - vOr;                                     // >0 : le cash a battu l'or
    const cashGagne = cout > 0;

    const { en, f, pct, mnt } = outils(langue);
    const desc = en
      ? `gold went from ${mnt(p0, '$', 0)} to ${mnt(pf, '$', 0)} an ounce in ${N} years, while the risk-free rate paid ${pct(r, 1)} a year; the capital at stake was ${mnt(cap, '$', 0)}`
      : `l'or est passé de ${mnt(p0, '$', 0)} à ${mnt(pf, '$', 0)} l'once en ${N} ans, quand le taux sans risque payait ${pct(r, 1)} par an ; le capital en jeu était de ${mnt(cap, '$', 0)}`;
    const contexte = (en
      ? [
        `A saver bought a small ingot ${N} years ago "because gold never lies": ${desc}. Before he doubles the position, you owe him the only fair benchmark — gold's annualised return, what the boring risk-free deposit would have produced on the same capital, and the cumulative opportunity cost between the two.`,
        `The family office reviews its gold sleeve at the annual meeting: ${desc}. The chair wants the comparison nobody dares to show — CAGR of the metal, the riskless alternative compounded over ${N} years, and the gap in dollars, sign included.`,
        `Oral drill — the jury smiles: "gold, the ultimate safe haven, right?" The case in front of you: ${desc}. Your answer must produce the annualised return, the compounded risk-free benchmark, and the opportunity cost — then read the result through real rates, the variable gold actually watches.`,
      ]
      : [
        `Un épargnant a acheté un petit lingot il y a ${N} ans « parce que l'or ne ment jamais » : ${desc}. Avant qu'il ne double la position, vous lui devez le seul étalon honnête — le rendement annualisé de l'or, ce que le placement sans risque ennuyeux aurait produit sur le même capital, et le coût d'opportunité cumulé entre les deux.`,
        `Le family office repasse sa poche or en revue annuelle : ${desc}. Le président veut la comparaison que personne n'ose montrer — TCAM du métal, l'alternative sans risque composée sur ${N} ans, et l'écart en dollars, signe compris.`,
        `Entraînement d'oral — le jury sourit : « l'or, valeur refuge ultime, n'est-ce pas ? » Le dossier devant vous : ${desc}. Votre réponse doit produire le rendement annualisé, l'étalon sans risque composé, et le coût d'opportunité — puis lire le résultat à travers les taux réels, la variable que l'or regarde vraiment.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? "a) Gold's annualised return" : "a) Le rendement annualisé de l'or",
          enonce: en
            ? `From ${mnt(p0, '$', 0)} to ${mnt(pf, '$', 0)} in ${N} years: what compounded annual return is that, in %?`
            : `De ${mnt(p0, '$', 0)} à ${mnt(pf, '$', 0)} en ${N} ans : quel rendement annuel composé cela fait-il, en % ?`,
          reponse: cagr, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Compound, never average' : 'Composer, jamais moyenner',
            contenu: en
              ? `CAGR = (${f(pf, 0)}/${f(p0, 0)})^(1/${N}) − 1 = ${f(pf / p0, 4)}^(${f(1 / N, 3)}) − 1 = **${pct(cagr)}** per year. Dividing the total ${pct(tot, 1)} by ${N} would overstate it: arithmetic averages ignore compounding.`
              : `TCAM = (${f(pf, 0)}/${f(p0, 0)})^(1/${N}) − 1 = ${f(pf / p0, 4)}^(${f(1 / N, 3)}) − 1 = **${pct(cagr)}** par an. Diviser le total de ${pct(tot, 1)} par ${N} le surestimerait : la moyenne arithmétique ignore la composition.`,
          }],
        },
        {
          intitule: en ? 'b) The boring benchmark' : "b) L'étalon ennuyeux",
          enonce: en
            ? `The same ${mnt(cap, '$', 0)} at the risk-free rate of ${pct(r, 1)}, compounded over ${N} years: final value, in $?`
            : `Les mêmes ${mnt(cap, '$', 0)} au taux sans risque de ${pct(r, 1)}, composés sur ${N} ans : valeur finale, en $ ?`,
          reponse: vCash, tolerance: 0.005, unite: '$',
          etapes: [{
            titre: en ? 'The riskless machine' : 'La machine sans risque',
            contenu: en
              ? `V = ${f(cap, 0)} × (1 + ${f(r, 1)}%)^${N} = ${f(cap, 0)} × ${f((1 + r / 100) ** N, 4)} = **${mnt(vCash, '$', 0)}** — earned in T-bills, with zero drama. This is the hurdle every asset that pays no income must clear.`
              : `V = ${f(cap, 0)} × (1 + ${f(r, 1)} %)^${N} = ${f(cap, 0)} × ${f((1 + r / 100) ** N, 4)} = **${mnt(vCash, '$', 0)}** — encaissés en bons du Trésor, sans le moindre suspense. C'est la haie que tout actif qui ne verse rien doit franchir.`,
          }],
        },
        {
          intitule: en ? 'c) The gold position' : "c) La position en or",
          enonce: en
            ? `The same capital in gold over the period: final value, in $?`
            : `Le même capital en or sur la période : valeur finale, en $ ?`,
          reponse: vOr, tolerance: 0.005, unite: '$',
          etapes: [{
            titre: en ? 'The capital follows the ounce' : "Le capital suit l'once",
            contenu: en
              ? `V = ${f(cap, 0)} × ${f(pf, 0)}/${f(p0, 0)} = ${f(cap, 0)} × ${f(pf / p0, 4)} = **${mnt(vOr, '$', 0)}**. No coupon, no dividend, no rent along the way: the price move is the ONLY engine of the position.`
              : `V = ${f(cap, 0)} × ${f(pf, 0)}/${f(p0, 0)} = ${f(cap, 0)} × ${f(pf / p0, 4)} = **${mnt(vOr, '$', 0)}**. Ni coupon, ni dividende, ni loyer en chemin : la variation du prix est le SEUL moteur de la position.`,
          }],
        },
        {
          intitule: en ? 'd) The cumulative opportunity cost' : 'd) Le coût d\'opportunité cumulé',
          enonce: en
            ? `What is the cumulative opportunity cost of gold against the risk-free rate, in $ (positive = cash won)?`
            : `Quel est le coût d'opportunité cumulé de l'or face au taux sans risque, en $ (positif = le cash a gagné) ?`,
          reponse: cout, tolerance: Math.max(50, Math.round(cap * 0.005)), toleranceMode: 'absolu', unite: '$',
          etapes: [
            {
              titre: en ? 'Benchmark minus gold' : "L'étalon moins l'or",
              contenu: en
                ? `Cost = ${f(vCash, 0)} − ${f(vOr, 0)} = **${mnt(cout, '$', 0)}**. ${cashGagne ? `Gold (${pct(cagr)} a year) stayed below the risk-free ${pct(r, 1)}: holding the metal cost that gap, silently, year after year.` : `Gold (${pct(cagr)} a year) beat the risk-free ${pct(r, 1)}: the metal more than covered its opportunity cost over the period.`}`
                : `Coût = ${f(vCash, 0)} − ${f(vOr, 0)} = **${mnt(cout, '$', 0)}**. ${cashGagne ? `L'or (${pct(cagr)} par an) est resté sous le taux sans risque de ${pct(r, 1)} : détenir le métal a coûté cet écart, silencieusement, année après année.` : `L'or (${pct(cagr)} par an) a battu le taux sans risque de ${pct(r, 1)} : le métal a plus que couvert son coût d'opportunité sur la période.`}`,
            },
            {
              titre: en ? 'Why gold watches real rates' : "Pourquoi l'or regarde les taux réels",
              contenu: en
                ? `An asset that pays nothing competes with the yield you give up to hold it. When real rates are high, that toll is heavy and gold struggles; when they fall — or turn negative — the toll vanishes and gold breathes. "Safe haven" is a slogan; the opportunity cost is the mechanism.`
                : `Un actif qui ne verse rien concourt contre le rendement auquel on renonce pour le détenir. Taux réels élevés : le péage est lourd et l'or peine ; taux réels en baisse — ou négatifs — : le péage disparaît et l'or respire. « Valeur refuge » est un slogan ; le coût d'opportunité est le mécanisme.`,
            },
          ],
          pieges: [en
            ? `Comparing gold to zero ("it went up, so it worked") forgets the benchmark: capital always has a riskless alternative, and ${N} years of compounding make that alternative expensive to ignore.`
            : `Comparer l'or à zéro (« il a monté, donc ça a marché ») oublie l'étalon : un capital a toujours une alternative sans risque, et ${N} ans de composition rendent cette alternative coûteuse à ignorer.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* Export du lot 1 — fusionné dans problems.ts par le contrôleur.      */
/* ------------------------------------------------------------------ */
export const problemesLot1: ProblemeMoule[] = [
  voyageurSpread,        // m6-pb-01 · N1
  courbeForwards,        // m6-pb-02 · N1
  bigMacPpa,             // m6-pb-03 · N1
  premierePositionCommodity, // m6-pb-04 · N1
  exportateurCouvert,    // m6-pb-05 · N2
  importateurNonCouvert, // m6-pb-06 · N2
  carryTradeComplet,     // m6-pb-07 · N2
  triangleArbitrage,     // m6-pb-08 · N2
  etfContango,           // m6-pb-09 · N2
  orTauxReels,           // m6-pb-10 · N2
];
