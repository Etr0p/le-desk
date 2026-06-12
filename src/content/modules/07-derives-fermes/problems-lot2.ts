/**
 * Moules de problèmes multi-étapes du module Dérivés fermes : futures, FRA &
 * swaps — LOT 2 : les niveaux durs. 4 N3 (cash-and-carry sous frictions,
 * strip de FRA = swap, STIR et banque centrale, cross-currency simple) et
 * 6 boss N4 (la semaine de Metallgesellschaft, Leeson à Singapour, le desk
 * de clearing dans le crash, le swap hérité, le basis trade qui dérape, le
 * corporate qui « optimise »).
 * Chaque moule : 3 scénarios FR + EN, sous-questions chaînées, corrigés
 * calculés via calculs.ts — jamais de texte figé. Les tirages aléatoires ont
 * lieu AVANT toute branche de langue : même seed + même scénario ⇒ mêmes
 * nombres en français et en anglais.
 */
import { formatNombreLangue } from '../../../engine/answers';
import { mulberry32, pick, randFloat, randInt } from '../../../engine/rng';
import type { Langue, ProblemGenerator } from '../../../engine/types';
import {
  appelDeMarge, effetLevier, facteurActualisation, margeVariation,
  nombreContratsCouverture, pnlFutures, prixForwardIndice, reglementFra,
  tauxForwardImplicite, tauxSwapParitaire, valeurJambeFixe, valeurSwapPayeurFixe,
} from './calculs';

/** Alias local : un « moule » de problème est un ProblemGenerator de l'engine. */
export type ProblemeMoule = ProblemGenerator;

const M7 = '07-derives-fermes';
const r0 = (v: number) => Math.round(v);
const r1 = (v: number) => Math.round(v * 10) / 10;
const r2 = (v: number) => Math.round(v * 100) / 100;
const r4 = (v: number) => Math.round(v * 10_000) / 10_000;

/** Petits formateurs liés à la langue (les tirages sont déjà faits quand on les crée). */
function outils(langue: Langue) {
  const en = langue === 'en';
  const f = (v: number, d = 2) => formatNombreLangue(langue, v, d);
  const usd = (v: number, d = 2) => (en ? `$${f(v, d)}` : `${f(v, d)} $`);
  const eur = (v: number, d = 2) => (en ? `€${f(v, d)}` : `${f(v, d)} €`);
  const pct = (v: number, d = 2) => (en ? `${f(v, d)}%` : `${f(v, d)} %`);
  return { en, f, usd, eur, pct };
}

/* ------------------------------------------------------------------ */
/* 11. m7-pb-11 — Cash-and-carry sous frictions — N3                   */
/* ------------------------------------------------------------------ */
const cashAndCarryFrictions: ProblemGenerator = {
  id: 'm7-pb-11', moduleId: M7,
  titre: 'Cash-and-carry sous frictions : la bande de non-arbitrage',
  titreEn: 'Cash-and-carry with frictions: the no-arbitrage band',
  typeDeCas: 'pricing et arbitrage de futures',
  typeDeCasEn: 'futures pricing and arbitrage',
  difficulte: 3,
  scenarios: ["Desk d'arbitrage indiciel à l'ouverture", 'Gérant indiciel qui contre-vérifie la fair value', 'Grand oral : la bande de non-arbitrage'],
  scenariosEn: ['Index-arbitrage desk at the open', 'Index fund manager double-checking fair value', 'Final viva: the no-arbitrage band'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const S = randInt(rng, 4600, 5400);
    const rFin = randFloat(rng, 3, 5, 1);
    const qDiv = randFloat(rng, 1.5, 3, 1);
    const cPts = randInt(rng, 6, 18);
    const sens = pick(rng, [1, -1] as const);
    const magn = randInt(rng, 4, 40);
    const tailleM = pick(rng, [20, 25, 30, 40, 50] as const);

    const fTheo = prixForwardIndice(S, rFin, qDiv, 1);
    const fMkt = Math.round(fTheo) + sens * magn;
    const dev = fMkt - fTheo;
    const borneHaute = fTheo + cPts;
    const borneBasse = fTheo - cPts;
    const haut = dev > 0;
    const brutContrat = Math.abs(dev) * 10;
    const netContrat = brutContrat - cPts * 10;
    const survit = netContrat > 0;
    const nb = nombreContratsCouverture(tailleM, S, 10);
    const totalNetK = (nb * netContrat) / 1000;
    const repFTheo = r1(fTheo);
    const repBorne = r1(borneHaute);
    const repBrut = r0(brutContrat);
    const repNet = r0(netContrat);
    const repNb = nb;
    const repTotal = r1(totalNetK);

    const { en, f, eur, pct } = outils(langue);
    const desc = en
      ? `the index at ${f(S, 0)} points, one-year financing at ${pct(rFin, 1)}, a dividend yield of ${pct(qDiv, 1)}; the one-year futures quotes ${f(fMkt, 0)} points (€10/point multiplier); your total frictions — bid-ask spread, fees, stock-borrow — run to ${cPts} points round trip, and your balance sheet can carry €${f(tailleM, 0)} million of basket`
      : `indice à ${f(S, 0)} points, financement 1 an à ${pct(rFin, 1)}, rendement du dividende à ${pct(qDiv, 1)} ; le futures 1 an cote ${f(fMkt, 0)} points (multiplicateur 10 €/point) ; vos frictions totales — fourchette, commissions, prêt-emprunt de titres — valent ${cPts} points aller-retour, et votre bilan peut porter ${f(tailleM, 0)} M€ de panier`;
    const contexte = (en
      ? [
        `9:01 on the index-arbitrage desk; the futures opened before the cash market and the screen flags a gap: ${desc}. The house discipline never changes — the carry price first, then the band the frictions draw around it, then the per-contract P&L, and only then the size. An anomaly smaller than its costs is not an anomaly: it is the normal width of the band.`,
        `You run an index fund, and your broker's morning sheet quotes the futures you roll every quarter: ${desc}. Before accusing anyone of mispricing, you rebuild chapter 3's machine: the theoretical forward, the no-arbitrage window once frictions are counted, and what an arbitrageur would really pocket — because your roll pays those frictions too.`,
        `The examiner draws a line on the board: "the futures quotes away from cash-and-carry — free money?" The data: ${desc}. He wants the carry price, BOTH bounds of the band, the gross and net P&L per contract, and the verdict sized to a real balance sheet — the full reasoning, not the slogan.`,
      ]
      : [
        `9 h 01 au desk d'arbitrage indiciel ; le futures a ouvert avant le comptant et l'écran signale un écart : ${desc}. La discipline maison ne change jamais — d'abord le prix de portage, puis la bande que les frictions dessinent autour, puis le P&L par contrat, et seulement ensuite la taille. Une anomalie plus petite que ses coûts n'est pas une anomalie : c'est la largeur normale de la bande.`,
        `Vous gérez un fonds indiciel, et la feuille du matin de votre courtier cote le futures que vous rollez chaque trimestre : ${desc}. Avant d'accuser qui que ce soit de mal pricer, vous remontez la machine du chapitre 3 : le forward théorique, la fenêtre de non-arbitrage une fois les frictions comptées, et ce qu'un arbitragiste empocherait vraiment — car votre roll paie ces frictions aussi.`,
        `L'examinateur trace une ligne au tableau : « le futures cote loin du cash-and-carry — argent gratuit ? » Les données : ${desc}. Il attend le prix de portage, les DEUX bornes de la bande, le P&L brut et net par contrat, et le verdict dimensionné sur un vrai bilan — le raisonnement complet, pas le slogan.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The carry price' : 'a) Le prix de portage',
          enonce: en
            ? `What one-year futures price does the cash-and-carry impose, in points (1 decimal)?`
            : `Quel prix de futures 1 an le cash-and-carry impose-t-il, en points (1 décimale) ?`,
          reponse: repFTheo, tolerance: 1, toleranceMode: 'absolu', unite: en ? 'points' : 'points',
          etapes: [{
            titre: en ? 'Spot plus net carry, zero forecast' : 'Spot plus portage net, zéro prévision',
            contenu: en
              ? `$F = S \\times (1 + (r - q)T)$ = ${f(S, 0)} × (1 + (${f(rFin, 1)} − ${f(qDiv, 1)})/100) = **${f(repFTheo, 1)} points**. The financing adds ${f(r1((S * rFin) / 100), 0)} points of cost, the dividends give ${f(r1((S * qDiv) / 100), 0)} back: the gap to spot is the rent of money minus the rent of the asset — no view on the market anywhere.`
              : `$F = S \\times (1 + (r - q)T)$ = ${f(S, 0)} × (1 + (${f(rFin, 1)} − ${f(qDiv, 1)})/100) = **${f(repFTheo, 1)} points**. Le financement ajoute ${f(r1((S * rFin) / 100), 0)} points de coût, les dividendes en rendent ${f(r1((S * qDiv) / 100), 0)} : l'écart au spot est le loyer de l'argent moins le loyer de l'actif — aucune vue de marché nulle part.`,
          }],
          pieges: [en
            ? `Adding financing AND dividends (${pct(r1(rFin + qDiv), 1)} of carry) forgets that the dividend is a revenue of the holder, not a cost: q REDUCES the carry.`
            : `Additionner financement ET dividendes (${pct(r1(rFin + qDiv), 1)} de portage) oublie que le dividende est un revenu du porteur, pas un coût : q RÉDUIT le portage.`],
        },
        {
          intitule: en ? 'b) The upper edge of the band' : 'b) Le bord haut de la bande',
          enonce: en
            ? `With ${cPts} points of total frictions, above what quoted price does the cash-and-carry (sell the futures, manufacture the delivery) become profitable, in points?`
            : `Avec ${cPts} points de frictions totales, au-dessus de quel prix coté le cash-and-carry (vendre le futures, fabriquer la livraison) devient-il rentable, en points ?`,
          reponse: repBorne, tolerance: 1.5, toleranceMode: 'absolu', unite: 'points',
          etapes: [{
            titre: en ? 'The band, not the line' : 'La bande, pas le fil',
            contenu: en
              ? `Upper bound = ${f(repFTheo, 1)} + ${cPts} = **${f(repBorne, 1)} points**; symmetrically, the reverse cash-and-carry only pays below ${f(r1(borneBasse), 1)}. Between the two bounds, every gap is smaller than its costs: the market price lives in a no-arbitrage BAND of width 2 × ${cPts} points, not on a wire — chapter 3 said it, here it is quantified.`
              : `Borne haute = ${f(repFTheo, 1)} + ${cPts} = **${f(repBorne, 1)} points** ; symétriquement, le reverse cash-and-carry ne paie qu'en dessous de ${f(r1(borneBasse), 1)}. Entre les deux bornes, tout écart est plus petit que ses coûts : le prix de marché vit dans une BANDE de non-arbitrage de largeur 2 × ${cPts} points, pas sur un fil — le chapitre 3 le disait, la voici chiffrée.`,
          }],
          pieges: [en
            ? `In practice the band is asymmetric: the reverse side needs the stock borrow (cost, availability), so the lower bound sits further from the theoretical price than the upper one. We keep it symmetric here for the arithmetic.`
            : `En pratique la bande est asymétrique : le sens reverse exige le prêt-emprunt de titres (coût, disponibilité), donc la borne basse s'écarte plus du théorique que la haute. On la garde symétrique ici pour l'arithmétique.`],
        },
        {
          intitule: en ? 'c) The gross P&L per contract' : 'c) Le P&L brut par contrat',
          enonce: en
            ? `At the quoted ${f(fMkt, 0)}, what gross P&L per contract does the right-way arbitrage lock in, in euros?`
            : `Au cours coté de ${f(fMkt, 0)}, quel P&L brut par contrat l'arbitrage dans le bon sens verrouille-t-il, en euros ?`,
          reponse: repBrut, tolerance: 12, toleranceMode: 'absolu', unite: '€',
          etapes: [{
            titre: en ? haut ? 'Quoted too HIGH: sell it, manufacture it' : 'Quoted too LOW: buy it, sell the synthetic' : haut ? 'Coté trop HAUT : on le vend, on le fabrique' : 'Coté trop BAS : on l\'achète, on vend le synthétique',
            contenu: en
              ? `${haut
                ? `The futures overpays the basket: SELL it at ${f(fMkt, 0)} and manufacture the delivery — borrow ${eur(r0(S * 10), 0)}, buy the basket at ${f(S, 0)}, collect the dividends, deliver at expiry. All-in manufacturing cost = ${f(repFTheo, 1)} points`
                : `The futures underpays the basket: BUY it at ${f(fMkt, 0)} and sell the synthetic — short the basket via stock borrow, invest the proceeds at ${pct(rFin, 1)}, pay back the dividends, take delivery at expiry. All-in synthetic value = ${f(repFTheo, 1)} points`}; gross P&L = |${f(fMkt, 0)} − ${f(repFTheo, 1)}| × 10 € = **${eur(repBrut, 0)} per contract**, every price and rate locked on day one — the +500 € of the chapter, with your numbers.`
              : `${haut
                ? `Le futures surpaie le panier : VENDEZ-le à ${f(fMkt, 0)} et fabriquez la livraison — empruntez ${eur(r0(S * 10), 0)}, achetez le panier à ${f(S, 0)}, encaissez les dividendes, livrez à l'échéance. Coût de fabrication complet = ${f(repFTheo, 1)} points`
                : `Le futures sous-paie le panier : ACHETEZ-le à ${f(fMkt, 0)} et vendez le synthétique — vendez le panier à découvert via le prêt-emprunt, placez le produit à ${pct(rFin, 1)}, reversez les dividendes, prenez livraison à l'échéance. Valeur du synthétique = ${f(repFTheo, 1)} points`} ; P&L brut = |${f(fMkt, 0)} − ${f(repFTheo, 1)}| × 10 € = **${eur(repBrut, 0)} par contrat**, tous les prix et taux figés au premier jour — le +500 € du chapitre, avec vos nombres.`,
          }],
          pieges: [en
            ? `Selling the futures and "waiting for it to come back" without holding the basket is a directional bet, not an arbitrage: the four legs must be locked simultaneously.`
            : `Vendre le futures et « attendre qu'il revienne » sans détenir le panier est un pari directionnel, pas un arbitrage : les quatre jambes doivent être figées simultanément.`],
        },
        {
          intitule: en ? 'd) The friction bill — and the net' : 'd) La facture de friction — et le net',
          enonce: en
            ? `Net of the ${cPts} points of frictions, what P&L per contract remains, in euros (negative if the costs eat the gap)?`
            : `Net des ${cPts} points de frictions, quel P&L par contrat reste-t-il, en euros (négatif si les coûts mangent l'écart) ?`,
          reponse: repNet, tolerance: 12, toleranceMode: 'absolu', unite: '€',
          etapes: [{
            titre: en ? 'One point costs ten euros' : 'Un point coûte dix euros',
            contenu: en
              ? `Frictions = ${cPts} × 10 € = ${eur(cPts * 10, 0)} per contract; net = ${eur(repBrut, 0)} − ${eur(cPts * 10, 0)} = **${eur(repNet, 0)}**. ${survit
                ? `The quote sits OUTSIDE the band: the gap survives its costs — the ticket goes.`
                : `The quote sits INSIDE the band: the "anomaly" is smaller than the cost of trading it — there is nothing to do, and doing nothing is the correct trade.`}`
              : `Frictions = ${cPts} × 10 € = ${eur(cPts * 10, 0)} par contrat ; net = ${eur(repBrut, 0)} − ${eur(cPts * 10, 0)} = **${eur(repNet, 0)}**. ${survit
                ? `La cote est HORS de la bande : l'écart survit à ses coûts — le ticket part.`
                : `La cote est DANS la bande : l'« anomalie » est plus petite que le coût de la traiter — il n'y a rien à faire, et ne rien faire est le bon trade.`}`,
          }],
        },
        {
          intitule: en ? 'e) Sizing on the balance sheet' : 'e) La taille sur le bilan',
          enonce: en
            ? `Your balance sheet carries €${f(tailleM, 0)} million of basket: how many contracts does the arbitrage mobilise?`
            : `Votre bilan porte ${f(tailleM, 0)} M€ de panier : combien de contrats l'arbitrage mobilise-t-il ?`,
          reponse: repNb, tolerance: 0.5, toleranceMode: 'absolu', unite: en ? 'contracts' : 'contrats',
          etapes: [{
            titre: en ? 'One contract weighs spot times multiplier' : 'Un contrat pèse spot fois multiplicateur',
            contenu: en
              ? `Each contract covers ${f(S, 0)} × 10 € = ${eur(S * 10, 0)} of basket; N = ${f(tailleM, 0)} 000 000 / ${f(S * 10, 0)} = **${f(repNb, 0)} contracts** (whole contracts only, standard rounding). The futures leg costs no cash; it is the BASKET that consumes the balance sheet — and balance sheet is the scarce resource that lets gaps live.`
              : `Chaque contrat couvre ${f(S, 0)} × 10 € = ${eur(S * 10, 0)} de panier ; N = ${f(tailleM, 0)} 000 000 / ${f(S * 10, 0)} = **${f(repNb, 0)} contrats** (contrats entiers seulement, arrondi standard). La jambe futures ne coûte pas de cash ; c'est le PANIER qui consomme le bilan — et le bilan est la ressource rare qui laisse vivre les écarts.`,
          }],
        },
        {
          intitule: en ? 'f) The desk-level verdict' : 'f) Le verdict à l\'échelle du desk',
          enonce: en
            ? `Deploying the full size, what total net P&L does the position lock in, in thousands of euros (negative if the band wins)?`
            : `En déployant toute la taille, quel P&L net total la position verrouille-t-elle, en milliers d'euros (négatif si la bande gagne) ?`,
          reponse: repTotal, tolerance: 8, toleranceMode: 'absolu', unite: 'k€',
          etapes: [
            {
              titre: en ? 'Net per contract times the size' : 'Le net par contrat fois la taille',
              contenu: en
                ? `Total = ${f(repNb, 0)} × ${eur(repNet, 0)} = **${f(repTotal, 1)} k€**. ${survit
                  ? `Locked at inception, no market risk: this is the program-trading money — and it is why the gap will not survive the morning.`
                  : `Trading "anyway" would BURN ${f(Math.abs(repTotal), 1)} k€ with certainty: the frictions are the only counterparty that always wins.`}`
                : `Total = ${f(repNb, 0)} × ${eur(repNet, 0)} = **${f(repTotal, 1)} k€**. ${survit
                  ? `Verrouillé dès l'initiation, sans risque de marché : c'est l'argent du program trading — et c'est pourquoi l'écart ne survivra pas à la matinée.`
                  : `Traiter « quand même » BRÛLERAIT ${f(Math.abs(repTotal), 1)} k€ à coup sûr : les frictions sont la seule contrepartie qui gagne toujours.`}`,
            },
            {
              titre: en ? 'The market lesson' : 'La leçon de marché',
              contenu: en
                ? `${survit
                  ? `In the 1980s this trade took minutes at the pit; today the program-trading machines close it in seconds — which is precisely why you almost never see it open. When you DO see it, ask why you are the lucky one: uncertain dividends, year-end balance-sheet costs, panic — the index basis is a stress thermometer before it is a P&L.`
                  : `A quote inside the band is not an inefficiency, it is the EQUILIBRIUM: arbitrage polices the bounds, frictions set their width. The narrower the frictions, the tighter the band — that is what "liquid market" means in practice, and why the fair-value gap the desks comment at 8:59 is measured in fractions of a point.`}`
                : `${survit
                  ? `Dans les années 1980, ce trade prenait des minutes à la corbeille ; aujourd'hui les machines du program trading le referment en secondes — raison exacte pour laquelle on ne le voit presque jamais ouvert. Quand vous le voyez, demandez-vous pourquoi VOUS êtes le chanceux : dividendes incertains, coût du bilan en fin d'année, panique — la base d'indice est un thermomètre de stress avant d'être un P&L.`
                  : `Une cote dans la bande n'est pas une inefficience, c'est l'ÉQUILIBRE : l'arbitrage police les bornes, les frictions en fixent la largeur. Plus les frictions sont fines, plus la bande est étroite — c'est cela, « marché liquide », en pratique, et c'est pourquoi l'écart à la fair value que les salles commentent à 8 h 59 se mesure en fractions de point.`}`,
            },
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 12. m7-pb-12 — Strip de FRA = swap — N3                             */
/* ------------------------------------------------------------------ */
const stripFraEgalSwap: ProblemGenerator = {
  id: 'm7-pb-12', moduleId: M7,
  titre: 'Le strip de FRA et le swap : deux habits, un seul taux',
  titreEn: 'The FRA strip and the swap: two outfits, one rate',
  typeDeCas: 'courbe, FRA et swaps',
  typeDeCasEn: 'curve, FRAs and swaps',
  difficulte: 3,
  scenarios: ["Trésorier face à deux offres de couverture", 'Structureur junior qui doit prouver l\'équivalence', "Grand oral : démontrer que le swap est une chaîne de FRA"],
  scenariosEn: ['Treasurer weighing two hedging offers', 'Junior structurer asked to prove the equivalence', 'Final viva: prove the swap is a chain of FRAs'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const z1 = randFloat(rng, 1.8, 3.2, 1);
    const z2 = r1(z1 + randFloat(rng, 0.2, 0.6, 1));
    const z3 = r1(z2 + randFloat(rng, 0.1, 0.5, 1));
    const notM = pick(rng, [50, 100, 150, 200] as const);
    const margeBp = randInt(rng, 5, 15);

    const courbe = [z1, z2, z3];
    const df1 = facteurActualisation(z1, 1);
    const df2 = facteurActualisation(z2, 2);
    const df3 = facteurActualisation(z3, 3);
    const sommeDf = df1 + df2 + df3;
    const f12 = (df1 / df2 - 1) * 100;
    const f23 = (df2 / df3 - 1) * 100;
    const par = tauxSwapParitaire(courbe);
    const moyenne = (z1 * df1 + f12 * df2 + f23 * df3) / sommeDf;
    const coutMargeK = valeurSwapPayeurFixe(par + margeBp / 100, courbe, notM) * 1000;
    const repDf2 = r4(df2);
    const repF12 = r4(f12);
    const repF23 = r4(f23);
    const repPar = r4(par);
    const repMoy = r4(moyenne);
    const repCout = r0(coutMargeK);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `zero curve at ${pct(z1, 1)} for 1 year, ${pct(z2, 1)} for 2 years, ${pct(z3, 1)} for 3 years (annual compounding); notional €${f(notM, 0)} million of floating-rate debt to fix for three years; the bank quotes the swap at the par rate plus ${margeBp} basis points`
      : `courbe zéro à ${pct(z1, 1)} à 1 an, ${pct(z2, 1)} à 2 ans, ${pct(z3, 1)} à 3 ans (composition annuelle) ; notionnel de ${f(notM, 0)} M€ de dette à taux variable à figer sur trois ans ; la banque cote le swap au taux paritaire plus ${margeBp} points de base`;
    const contexte = (en
      ? [
        `Two term sheets sit on your desk: a 3-year payer swap, or three successive forward agreements — year 1 at the spot rate, then the 1-year rate in 1 year, then in 2 years — "to keep flexibility", says the salesman: ${desc}. Before choosing, you do what the chapter orders: extract the forwards from the curve, compute the par rate, and check whether the two offers are two products or one product in two outfits.`,
        `Your client saw "swap = chain of FRAs" in a textbook and wants the proof with his own numbers, not a slogan: ${desc}. You build it step by step — discount factors, the two implied forwards, the par rate, and the weighted average that closes the demonstration. If the last two numbers differ, you have made an error somewhere.`,
        `The examiner's favourite bridge question: "chapter 4 ends on a strip of FRAs, chapter 5 opens on the swap — show me they are the same object." The data: ${desc}. He wants the discount factors, the forwards read off the curve, the par rate, and the equality demonstrated to the fourth decimal — then the price of the bank's margin, because nothing is free.`,
      ]
      : [
        `Deux term sheets sur votre bureau : un swap payeur 3 ans, ou trois accords à terme successifs — l'année 1 au taux comptant, puis le taux 1 an dans 1 an, puis dans 2 ans — « pour garder de la souplesse », dit le vendeur : ${desc}. Avant de choisir, vous faites ce que le chapitre ordonne : extraire les forwards de la courbe, calculer le taux paritaire, et vérifier si les deux offres sont deux produits ou un seul produit sous deux habits.`,
        `Votre client a lu « swap = chaîne de FRA » dans un manuel et veut la preuve avec ses propres nombres, pas un slogan : ${desc}. Vous la construisez pas à pas — facteurs d'actualisation, les deux forwards implicites, le taux paritaire, et la moyenne pondérée qui clôt la démonstration. Si les deux derniers nombres diffèrent, vous avez fait une erreur quelque part.`,
        `La question pont favorite de l'examinateur : « le chapitre 4 se termine sur un strip de FRA, le chapitre 5 s'ouvre sur le swap — montrez-moi que c'est le même objet. » Les données : ${desc}. Il attend les facteurs d'actualisation, les forwards lus sur la courbe, le taux paritaire, et l'égalité démontrée à la quatrième décimale — puis le prix de la marge de la banque, car rien n'est gratuit.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The two-year discount factor' : "a) Le facteur d'actualisation 2 ans",
          enonce: en
            ? `What is the 2-year discount factor on this curve (4 decimals)?`
            : `Que vaut le facteur d'actualisation 2 ans sur cette courbe (4 décimales) ?`,
          reponse: repDf2, tolerance: 0.002, toleranceMode: 'absolu',
          etapes: [{
            titre: en ? 'The three pillars, once and for all' : 'Les trois piliers, une fois pour toutes',
            contenu: en
              ? `$df_t = 1/(1+z_t)^t$: df₁ = 1/${f(1 + z1 / 100, 3)} = ${f(r4(df1), 4)}; df₂ = 1/${f(1 + z2 / 100, 3)}² = **${f(repDf2, 4)}**; df₃ = 1/${f(1 + z3 / 100, 3)}³ = ${f(r4(df3), 4)}. Annual compounding beyond one year — the bond-world convention of module 4. These three numbers carry the whole problem.`
              : `$df_t = 1/(1+z_t)^t$ : df₁ = 1/${f(1 + z1 / 100, 3)} = ${f(r4(df1), 4)} ; df₂ = 1/${f(1 + z2 / 100, 3)}² = **${f(repDf2, 4)}** ; df₃ = 1/${f(1 + z3 / 100, 3)}³ = ${f(r4(df3), 4)}. Composition annuelle au-delà d'un an — la convention obligataire du module 4. Ces trois nombres portent tout le problème.`,
          }],
        },
        {
          intitule: en ? 'b) The 1-year rate, in 1 year' : 'b) Le taux 1 an, dans 1 an',
          enonce: en
            ? `What 1-year-in-1-year forward rate does the curve imply, in annual compounding (4 decimals)?`
            : `Quel taux forward 1 an dans 1 an la courbe implique-t-elle, en composition annuelle (4 décimales) ?`,
          reponse: repF12, tolerance: 0.02, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'A forward is a ratio of discount factors' : 'Un forward est un ratio de facteurs',
            contenu: en
              ? `$1 + f_{1,2} = df_1/df_2$ = ${f(r4(df1), 4)} / ${f(repDf2, 4)} ⇒ f₁,₂ = **${pct(repF12, 4)}**. Same two-paths argument as chapter 4: one euro placed 2 years must equal one euro placed 1 year then rolled at the forward — otherwise arbitrage.`
              : `$1 + f_{1,2} = df_1/df_2$ = ${f(r4(df1), 4)} / ${f(repDf2, 4)} ⇒ f₁,₂ = **${pct(repF12, 4)}**. Le même argument des deux chemins qu'au chapitre 4 : un euro placé 2 ans doit égaler un euro placé 1 an puis roulé au forward — sinon arbitrage.`,
          }],
          pieges: [en
            ? `Chapter 4's FRA formula is LINEAR (money market, ≤ 1 year); here the horizons are in years and everything compounds — the two conventions give different numbers, and mixing them is the classic error.`
            : `La formule du FRA au chapitre 4 est LINÉAIRE (monde monétaire, ≤ 1 an) ; ici les horizons sont en années et tout se compose — les deux conventions donnent des nombres différents, et les mélanger est l'erreur classique.`],
        },
        {
          intitule: en ? 'c) The 1-year rate, in 2 years' : 'c) Le taux 1 an, dans 2 ans',
          enonce: en
            ? `Same machine one step further: what 1-year-in-2-years forward (4 decimals)?`
            : `Même machine un cran plus loin : quel forward 1 an dans 2 ans (4 décimales) ?`,
          reponse: repF23, tolerance: 0.02, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The strip is complete' : 'Le strip est complet',
            contenu: en
              ? `$1 + f_{2,3} = df_2/df_3$ = ${f(repDf2, 4)} / ${f(r4(df3), 4)} ⇒ f₂,₃ = **${pct(repF23, 4)}**. The strip of one-year rates the curve guarantees today: ${pct(z1, 1)} (year 1, the spot rate), ${pct(r4(f12), 4)} (year 2), ${pct(repF23, 4)} (year 3) — a rising curve pushes each forward above the zero rate of its start date.`
              : `$1 + f_{2,3} = df_2/df_3$ = ${f(repDf2, 4)} / ${f(r4(df3), 4)} ⇒ f₂,₃ = **${pct(repF23, 4)}**. Le strip des taux 1 an que la courbe garantit aujourd'hui : ${pct(z1, 1)} (année 1, le taux comptant), ${pct(r4(f12), 4)} (année 2), ${pct(repF23, 4)} (année 3) — une courbe croissante pousse chaque forward au-dessus du taux zéro de sa date de départ.`,
          }],
        },
        {
          intitule: en ? 'd) The par swap rate' : 'd) Le taux de swap paritaire',
          enonce: en
            ? `What fixed rate makes the 3-year swap fair at inception (4 decimals)?`
            : `Quel taux fixe rend le swap 3 ans équitable à la signature (4 décimales) ?`,
          reponse: repPar, tolerance: 0.02, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The coupon that amortises the discount' : 'Le coupon qui amortit la décote',
            contenu: en
              ? `$C^* = \\frac{1 - df_3}{\\sum df_i}$ = (1 − ${f(r4(df3), 4)}) / ${f(r4(sommeDf), 4)} = **${pct(repPar, 4)}**. The floating leg is worth par (no forecast needed); the par rate is the coupon that brings the fixed leg back to par — a weighted average of the curve, pulled toward the long pillars.`
              : `$C^* = \\frac{1 - df_3}{\\sum df_i}$ = (1 − ${f(r4(df3), 4)}) / ${f(r4(sommeDf), 4)} = **${pct(repPar, 4)}**. La jambe variable vaut le pair (aucune prévision nécessaire) ; le paritaire est le coupon qui ramène la jambe fixe au pair — une moyenne pondérée de la courbe, tirée vers les piliers longs.`,
          }],
          pieges: [en
            ? `The arithmetic mean of the zero rates (${pct(r4((z1 + z2 + z3) / 3), 2)}) is NOT the par rate: the weights are the discount factors, not the years.`
            : `La moyenne arithmétique des taux zéro (${pct(r4((z1 + z2 + z3) / 3), 2)}) n'est PAS le paritaire : les poids sont les facteurs d'actualisation, pas les années.`],
        },
        {
          intitule: en ? 'e) The demonstration — the strip IS the swap' : 'e) La démonstration — le strip EST le swap',
          enonce: en
            ? `Average the three guaranteed rates (${pct(z1, 1)}, f₁,₂, f₂,₃) weighted by their discount factors: what do you find (4 decimals)?`
            : `Faites la moyenne des trois taux garantis (${pct(z1, 1)}, f₁,₂, f₂,₃) pondérée par leurs facteurs d'actualisation : que trouvez-vous (4 décimales) ?`,
          reponse: repMoy, tolerance: 0.02, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'The number first' : 'Le nombre d\'abord',
              contenu: en
                ? `(${f(z1, 1)} × ${f(r4(df1), 4)} + ${f(r4(f12), 4)} × ${f(repDf2, 4)} + ${f(r4(f23), 4)} × ${f(r4(df3), 4)}) / ${f(r4(sommeDf), 4)} = **${pct(repMoy, 4)}** — the par rate of question d), to the fourth decimal.`
                : `(${f(z1, 1)} × ${f(r4(df1), 4)} + ${f(r4(f12), 4)} × ${f(repDf2, 4)} + ${f(r4(f23), 4)} × ${f(r4(df3), 4)}) / ${f(r4(sommeDf), 4)} = **${pct(repMoy, 4)}** — le taux paritaire de la question d), à la quatrième décimale.`,
            },
            {
              titre: en ? 'Why it is exact, not approximate' : 'Pourquoi c\'est exact, pas approché',
              contenu: en
                ? `Each term telescopes: $f_{i-1,i} \\times df_i = df_{i-1} - df_i$, so the sum collapses to $1 - df_3$ — the numerator of the par formula. Paying the strip of forwards and paying the par rate are the SAME contract: the swap is a chain of FRAs, the par rate is the df-weighted average of the forwards it replaces. The salesman's "flexibility" is a presentation, not a product.`
                : `Chaque terme se télescope : $f_{i-1,i} \\times df_i = df_{i-1} - df_i$, donc la somme s'effondre en $1 - df_3$ — le numérateur de la formule du paritaire. Payer le strip des forwards et payer le paritaire sont le MÊME contrat : le swap est une chaîne de FRA, le paritaire est la moyenne des forwards pondérée par les df. La « souplesse » du vendeur est une présentation, pas un produit.`,
            },
          ],
          pieges: [en
            ? `Weighting by the years (1, 2, 3) instead of the discount factors breaks the telescoping: the equality only holds with df weights — that is precisely what "par" means.`
            : `Pondérer par les années (1, 2, 3) au lieu des facteurs d'actualisation casse le télescopage : l'égalité ne tient qu'avec les poids df — c'est précisément ce que « paritaire » veut dire.`],
        },
        {
          intitule: en ? 'f) The price of the margin' : 'f) Le prix de la marge',
          enonce: en
            ? `The bank quotes the par rate plus ${margeBp} bp: what does that margin cost you in present value on €${f(notM, 0)} million, in thousands of euros (negative = a cost)?`
            : `La banque cote le paritaire plus ${margeBp} pb : que vous coûte cette marge en valeur actuelle sur ${f(notM, 0)} M€, en milliers d'euros (négatif = un coût) ?`,
          reponse: repCout, tolerance: 15, toleranceMode: 'absolu', unite: 'k€',
          etapes: [
            {
              titre: en ? 'An off-par swap has a value — here, against you' : 'Un swap hors paritaire a une valeur — ici, contre vous',
              contenu: en
                ? `Paying ${pct(r4(par + margeBp / 100), 4)} instead of ${pct(repPar, 4)} means overpaying ${margeBp} bp a year for three years: value = notional − fixed leg = **${f(repCout, 0)} k€** — roughly ${margeBp} bp × Σdf × notional = ${f(r0((margeBp / 10000) * sommeDf * notM * 1000), 0)} k€. The par rate is the only free rate; everything above it is a bill you can now read.`
                : `Payer ${pct(r4(par + margeBp / 100), 4)} au lieu de ${pct(repPar, 4)}, c'est surpayer ${margeBp} pb par an pendant trois ans : valeur = notionnel − jambe fixe = **${f(repCout, 0)} k€** — environ ${margeBp} pb × Σdf × notionnel = ${f(r0((margeBp / 10000) * sommeDf * notM * 1000), 0)} k€. Le paritaire est le seul taux gratuit ; tout ce qui le dépasse est une facture que vous savez désormais lire.`,
            },
            {
              titre: en ? 'The negotiating lesson' : 'La leçon de négociation',
              contenu: en
                ? `This is why the demonstration in e) is worth money: a client who can rebuild the par rate from the curve knows EXACTLY what the quote should be, and prices the margin in cash instead of swallowing it in a rate. ${margeBp} bp sounds small; ${f(Math.abs(repCout), 0)} k€ reads differently on a board slide.`
                : `Voilà pourquoi la démonstration du e) vaut de l'argent : un client capable de reconstruire le paritaire depuis la courbe sait EXACTEMENT ce que la cote devrait être, et chiffre la marge en cash au lieu de l'avaler dans un taux. ${margeBp} pb sonne petit ; ${f(Math.abs(repCout), 0)} k€ se lit autrement sur une slide de conseil.`,
            },
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 13. m7-pb-13 — STIR et anticipations de banque centrale — N3        */
/* ------------------------------------------------------------------ */
const stirBanqueCentrale: ProblemGenerator = {
  id: 'm7-pb-13', moduleId: M7,
  titre: 'Lire les futures Euribor : le pari contre la banque centrale',
  titreEn: 'Reading Euribor futures: the bet against the central bank',
  typeDeCas: 'futures de taux courts',
  typeDeCasEn: 'short-term interest rate futures',
  difficulte: 3,
  scenarios: ['Trader STIR le soir de la décision', 'Stratège taux qui décode la bande pour un client', 'Grand oral : prix = 100 − taux, jusqu\'au bout'],
  scenariosEn: ['STIR trader on decision night', 'Rates strategist decoding the strip for a client', 'Final viva: price = 100 − rate, all the way'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const tauxActuel = randFloat(rng, 2.4, 4, 1);
    const nbBaisses = randInt(rng, 1, 3);
    const nCtr = randInt(rng, 40, 120);
    const surpr = randInt(rng, 1, 2);
    const deriveBp = randInt(rng, 0, 15);
    const imContrat = randInt(rng, 450, 700);

    const tauxImplicite = r2(tauxActuel - 0.25 * nbBaisses);
    const p0 = r2(100 - tauxImplicite);
    const tauxVue = r2(tauxImplicite - 0.25);
    const pVue = r2(100 - tauxVue);
    const tauxChoc = r2(tauxImplicite + 0.25 * surpr);
    const pChoc = r2(100 - tauxChoc);
    const tauxFinal = r2(tauxChoc + deriveBp / 100);
    const pFinal = r2(100 - tauxFinal);
    const gainVue = pnlFutures(p0, pVue, 2500, nCtr, 1);
    const varChoc = margeVariation(p0, pChoc, 2500, nCtr, 1);
    const imTotal = imContrat * nCtr;
    const maintTotal = r0(imContrat * 0.75) * nCtr;
    const solde = imTotal + varChoc;
    const appel = appelDeMarge(solde, maintTotal, imTotal);
    const pnlFinal = pnlFutures(p0, pFinal, 2500, nCtr, 1);
    const repImplicite = tauxImplicite;
    const repBaisses = nbBaisses;
    const repGainVue = r0(gainVue);
    const repVarChoc = r0(varChoc);
    const repAppel = r0(appel);
    const repFinal = r0(pnlFinal);

    const { en, f, eur, pct } = outils(langue);
    const desc = en
      ? `the 3-month rate stands at ${pct(tauxActuel, 1)} today; the Euribor futures expiring just after the meetings quotes ${f(p0, 2)}; you trade ${nCtr} contracts (€1M notional, one basis point = €25, half-tick €12.50), initial margin €${f(imContrat, 0)} per contract, maintenance at 75%`
      : `le taux 3 mois vaut ${pct(tauxActuel, 1)} aujourd'hui ; le futures Euribor qui expire juste après les réunions cote ${f(p0, 2)} ; vous traitez ${nCtr} contrats (notionnel 1 M€, un point de base = 25 €, demi-tick 12,50 €), marge initiale ${f(imContrat, 0)} € par contrat, maintenance à 75 %`;
    const contexte = (en
      ? [
        `STIR desk, decision week. Your conviction: the economy is stalling and the central bank will have to cut MORE than the strip prices — one extra 25 bp move by the contract's expiry: ${desc}. Before typing, you decode what the price already says, size what your view is worth if right — and what the evening of a hawkish surprise does to your margin account, because on a futures the P&L does not wait for you to be right.`,
        `A corporate client calls: "the papers say the market gives 80% odds of a cut — where do they read that?" You open the strip with him: ${desc}. Your job: turn the quoted price into an expected rate path, then walk him through what a position pays when the view is right, and what it bleeds — in cash, that same evening — when the central bank disappoints.`,
        `The examiner taps the table: "price equals one hundred minus the rate. Take it seriously, all the way." The data: ${desc}. He wants the implied rate, the number of moves priced, the P&L of an extra-cut bet, the variation margin on surprise night, the margin call — and the lesson on what those famous "probabilities" really are.`,
      ]
      : [
        `Desk STIR, semaine de décision. Votre conviction : l'économie cale et la banque centrale devra baisser PLUS que ce que la bande price — un mouvement de 25 pb de plus d'ici l'expiration du contrat : ${desc}. Avant de taper, vous décodez ce que le prix dit déjà, chiffrez ce que vaut votre vue si elle est juste — et ce que le soir d'une surprise restrictive fait à votre compte de marge, car sur un futures le P&L n'attend pas que vous ayez raison.`,
        `Un client corporate appelle : « les journaux disent que le marché donne 80 % de chances à une baisse — où lisent-ils ça ? » Vous ouvrez la bande avec lui : ${desc}. Votre travail : transformer le prix coté en trajectoire de taux attendue, puis lui dérouler ce qu'une position paie quand la vue est juste, et ce qu'elle saigne — en cash, le soir même — quand la banque centrale déçoit.`,
        `L'examinateur tapote la table : « prix égale cent moins le taux. Prenez-le au sérieux, jusqu'au bout. » Les données : ${desc}. Il attend le taux implicite, le nombre de mouvements pricés, le P&L d'un pari sur une baisse de plus, la marge de variation le soir de la surprise, l'appel de marge — et la leçon sur ce que sont vraiment ces fameuses « probabilités ».`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) What the price already says' : 'a) Ce que le prix dit déjà',
          enonce: en
            ? `What 3-month rate does the quoted ${f(p0, 2)} imply at expiry, in % (2 decimals)?`
            : `Quel taux 3 mois le cours de ${f(p0, 2)} implique-t-il à l'expiration, en % (2 décimales) ?`,
          reponse: repImplicite, tolerance: 0.01, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Invert the convention' : 'Inverser la convention',
            contenu: en
              ? `Implied rate = 100 − ${f(p0, 2)} = **${pct(repImplicite, 2)}**. The convention price = 100 − rate was chosen to recreate the bond reflex: prices fall when rates rise, the seller gains when rates climb. The whole strip of quarterly expiries, read this way, draws the rate path the market prices.`
              : `Taux implicite = 100 − ${f(p0, 2)} = **${pct(repImplicite, 2)}**. La convention prix = 100 − taux a été choisie pour recréer le réflexe obligataire : les prix baissent quand les taux montent, le vendeur gagne à la hausse des taux. Toute la bande d'échéances trimestrielles, lue ainsi, dessine la trajectoire de taux que le marché price.`,
          }],
        },
        {
          intitule: en ? 'b) The moves already priced' : 'b) Les mouvements déjà pricés',
          enonce: en
            ? `Against today's ${pct(tauxActuel, 1)}, how many 25 bp cuts does the contract already price?`
            : `Face aux ${pct(tauxActuel, 1)} d'aujourd'hui, combien de baisses de 25 pb le contrat price-t-il déjà ?`,
          reponse: repBaisses, tolerance: 0.1, toleranceMode: 'absolu',
          etapes: [{
            titre: en ? 'The gap, in central-bank steps' : "L'écart, en pas de banque centrale",
            contenu: en
              ? `(${f(tauxActuel, 1)} − ${f(repImplicite, 2)}) / 0.25 = **${f(repBaisses, 0)} cut${repBaisses > 1 ? 's' : ''}** of 25 bp by expiry. Crucial reading: buying this contract does NOT pay if the bank cuts — it pays only if it cuts MORE than ${f(repBaisses, 0)} time${repBaisses > 1 ? 's' : ''}. The priced path is the starting line, not the finish.`
              : `(${f(tauxActuel, 1)} − ${f(repImplicite, 2)}) / 0,25 = **${f(repBaisses, 0)} baisse${repBaisses > 1 ? 's' : ''}** de 25 pb d'ici l'expiration. Lecture cruciale : acheter ce contrat ne paie PAS si la banque baisse — il ne paie que si elle baisse PLUS de ${f(repBaisses, 0)} fois. La trajectoire pricée est la ligne de départ, pas l'arrivée.`,
          }],
          pieges: [en
            ? `Betting "the bank will cut" by buying a contract that already prices ${f(repBaisses, 0)} cut${repBaisses > 1 ? 's' : ''} is betting on the consensus: if the bank delivers exactly what is priced, the price does not move and you make nothing.`
            : `Parier « la banque va baisser » en achetant un contrat qui price déjà ${f(repBaisses, 0)} baisse${repBaisses > 1 ? 's' : ''}, c'est parier sur le consensus : si la banque livre exactement ce qui est pricé, le prix ne bouge pas et vous ne gagnez rien.`],
        },
        {
          intitule: en ? 'c) What the view is worth' : 'c) Ce que vaut la vue',
          enonce: en
            ? `If the bank cuts one MORE time than priced (rate at ${pct(tauxVue, 2)} at expiry), what does the long position of ${nCtr} contracts make, in euros?`
            : `Si la banque baisse une fois de PLUS que le pricé (taux à ${pct(tauxVue, 2)} à l'expiration), que gagne la position longue de ${nCtr} contrats, en euros ?`,
          reponse: repGainVue, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'One point = 100 bp = €2,500' : 'Un point = 100 pb = 2 500 €',
            contenu: en
              ? `Price goes to 100 − ${f(tauxVue, 2)} = ${f(pVue, 2)}: P&L = (${f(pVue, 2)} − ${f(p0, 2)}) × 2,500 × ${nCtr} = **${eur(repGainVue, 0)}** — 25 bp × €25 × ${nCtr} contracts. The €2,500 multiplier per point is just the chapter's €25 per basis point, scaled: €1M notional × 0.0001 × 0.25 year.`
              : `Le prix va à 100 − ${f(tauxVue, 2)} = ${f(pVue, 2)} : P&L = (${f(pVue, 2)} − ${f(p0, 2)}) × 2 500 × ${nCtr} = **${eur(repGainVue, 0)}** — 25 pb × 25 € × ${nCtr} contrats. Le multiplicateur de 2 500 € par point n'est que les 25 € par point de base du chapitre, mis à l'échelle : 1 M€ de notionnel × 0,0001 × 0,25 an.`,
          }],
        },
        {
          intitule: en ? 'd) Surprise night' : 'd) Le soir de la surprise',
          enonce: en
            ? `The bank turns hawkish: the market removes ${surpr === 1 ? 'one cut' : 'two cuts'} and the implied rate jumps to ${pct(tauxChoc, 2)}. What variation margin hits the account that evening, in euros (negative = debit)?`
            : `La banque durcit le ton : le marché efface ${surpr === 1 ? 'une baisse' : 'deux baisses'} et le taux implicite saute à ${pct(tauxChoc, 2)}. Quelle marge de variation frappe le compte ce soir-là, en euros (négatif = débit) ?`,
          reponse: repVarChoc, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'The P&L does not wait' : "Le P&L n'attend pas",
            contenu: en
              ? `Price drops to 100 − ${f(tauxChoc, 2)} = ${f(pChoc, 2)}: flow = (${f(pChoc, 2)} − ${f(p0, 2)}) × 2,500 × ${nCtr} = **${eur(repVarChoc, 0)}**, debited in cash tonight. You may still believe in your scenario for the months ahead; the clearing house collects this evening's verdict first.`
              : `Le prix tombe à 100 − ${f(tauxChoc, 2)} = ${f(pChoc, 2)} : flux = (${f(pChoc, 2)} − ${f(p0, 2)}) × 2 500 × ${nCtr} = **${eur(repVarChoc, 0)}**, débité en cash ce soir. Vous pouvez encore croire à votre scénario pour les mois qui viennent ; la chambre encaisse d'abord le verdict du soir.`,
          }],
        },
        {
          intitule: en ? 'e) The margin call' : "e) L'appel de marge",
          enonce: en
            ? `Initial margin €${f(imTotal, 0)}, maintenance €${f(maintTotal, 0)}: after the evening's debit, how much must you wire in, in euros?`
            : `Marge initiale ${f(imTotal, 0)} €, maintenance ${f(maintTotal, 0)} € : après le débit du soir, combien devez-vous virer, en euros ?`,
          reponse: repAppel, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'Trigger at maintenance, target at initial' : 'Déclencheur à la maintenance, cible à l\'initiale',
            contenu: en
              ? `Balance = ${f(imTotal, 0)} − ${f(Math.abs(repVarChoc), 0)} = ${eur(r0(solde), 0)} < maintenance ${eur(maintTotal, 0)}: call. US futures convention: you wire back to the INITIAL margin, not the maintenance — payment = ${f(imTotal, 0)} − ${f(r0(solde), 0)} = **${eur(repAppel, 0)}**. Unpaid before the open, the broker liquidates at market — and your scenario dies before having been wrong.`
              : `Solde = ${f(imTotal, 0)} − ${f(Math.abs(repVarChoc), 0)} = ${eur(r0(solde), 0)} < maintenance ${eur(maintTotal, 0)} : appel. Convention des futures américains : on reverse jusqu'à la marge INITIALE, pas la maintenance — versement = ${f(imTotal, 0)} − ${f(r0(solde), 0)} = **${eur(repAppel, 0)}**. Non honoré avant l'ouverture, le courtier liquide au marché — et votre scénario meurt avant d'avoir eu tort.`,
          }],
          pieges: [en
            ? `Wiring just enough to climb back to maintenance (€${f(r0(maintTotal - solde), 0)}) is THE classic mistake: the maintenance is the trigger, the initial margin is the target.`
            : `Virer juste de quoi remonter à la maintenance (${f(r0(maintTotal - solde), 0)} €) est LE piège classique : la maintenance est le déclencheur, la marge initiale est la cible.`],
        },
        {
          intitule: en ? 'f) Expiry — the full bill' : "f) L'expiration — la facture complète",
          enonce: en
            ? `Held to expiry with the rate settling at ${pct(tauxFinal, 2)}, what is the position's total P&L, in euros?`
            : `Portée jusqu'à l'expiration avec un taux qui s'installe à ${pct(tauxFinal, 2)}, quel est le P&L total de la position, en euros ?`,
          reponse: repFinal, tolerance: 0.005, unite: '€',
          etapes: [
            {
              titre: en ? 'Sum of the evenings = final P&L' : 'La somme des soirs = le P&L final',
              contenu: en
                ? `Settlement price = 100 − ${f(tauxFinal, 2)} = ${f(pFinal, 2)}: total = (${f(pFinal, 2)} − ${f(p0, 2)}) × 2,500 × ${nCtr} = **${eur(repFinal, 0)}** — that is ${f(r0((tauxFinal - tauxImplicite) * 100), 0)} bp against you, at €25 × ${nCtr} per bp. Every variation margin already paid is a slice of this number: the mark-to-market changed the calendar, never the total.`
                : `Cours de liquidation = 100 − ${f(tauxFinal, 2)} = ${f(pFinal, 2)} : total = (${f(pFinal, 2)} − ${f(p0, 2)}) × 2 500 × ${nCtr} = **${eur(repFinal, 0)}** — soit ${f(r0((tauxFinal - tauxImplicite) * 100), 0)} pb contre vous, à 25 € × ${nCtr} par pb. Chaque marge de variation déjà payée est une tranche de ce nombre : le mark-to-market a changé le calendrier, jamais le total.`,
            },
            {
              titre: en ? 'What the "probabilities" really are' : 'Ce que sont vraiment les « probabilités »',
              contenu: en
                ? `You lost against a price, not against a fact: the strip is the consensus path, and beating it requires the bank to do something the MARKET does not expect — a much higher bar than "the bank will cut". The famous "80% odds of a cut" in the papers is this same arithmetic run backwards, plus one heroic assumption: that the price contains only expectations, no risk premium. Useful thermometer; not a poll of the governing council.`
                : `Vous avez perdu contre un prix, pas contre un fait : la bande est la trajectoire du consensus, et la battre exige que la banque fasse ce que le MARCHÉ n'attend pas — une barre bien plus haute que « la banque va baisser ». Les fameux « 80 % de chances de baisse » des journaux sont cette même arithmétique à l'envers, plus une hypothèse héroïque : que le prix ne contienne que des anticipations, aucune prime de risque. Thermomètre utile ; pas un sondage du conseil des gouverneurs.`,
            },
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 14. m7-pb-14 — Cross-currency simple — N3                           */
/* ------------------------------------------------------------------ */
const crossCurrencySimple: ProblemGenerator = {
  id: 'm7-pb-14', moduleId: M7,
  titre: 'Emprunter en dollars, devoir des euros : le cross-currency au travail',
  titreEn: 'Borrowing dollars, owing euros: the cross-currency swap at work',
  typeDeCas: 'swaps de devises',
  typeDeCasEn: 'currency swaps',
  difficulte: 3,
  scenarios: ["Directrice financière d'une ETI qui émet aux États-Unis", 'Banquier conseil qui chiffre les deux routes', "Grand oral : couvert contre non couvert, jusqu'au point mort"],
  scenariosEn: ['CFO of a mid-cap issuing in the United States', 'Advisory banker pricing both routes', 'Final viva: hedged versus unhedged, down to the breakeven'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const dM = pick(rng, [20, 30, 40, 50, 60, 80] as const);
    const S = randFloat(rng, 1.04, 1.16, 4);
    const rUsd = randFloat(rng, 4, 5.5, 1);
    const rEur = randFloat(rng, 2, 3.2, 1);
    const basisBp = randInt(rng, 10, 35);
    const kBas = randFloat(rng, 0.90, 0.96, 3);
    const kHaut = randFloat(rng, 1.04, 1.12, 3);

    const s1Bas = r4(S * kBas);
    const s1Haut = r4(S * kHaut);
    const eurosRecus = dM / S;
    const detteUsd = dM * (1 + rUsd / 100);
    const coutCouvertPct = rEur + basisBp / 100;
    const sortieCouverte = eurosRecus * (1 + coutCouvertPct / 100);
    const sortieNcBas = detteUsd / s1Bas;
    const tauxNcBas = (sortieNcBas / eurosRecus - 1) * 100;
    const sortieNcHaut = detteUsd / s1Haut;
    const tauxNcHaut = (sortieNcHaut / eurosRecus - 1) * 100;
    const ecartK = (sortieNcBas - sortieCouverte) * 1000;
    const pointMort = detteUsd / sortieCouverte;
    const repEuros = r2(eurosRecus);
    const repCouvert = r2(coutCouvertPct);
    const repNcBas = r2(tauxNcBas);
    const repNcHaut = r2(tauxNcHaut);
    const repEcart = r0(ecartK);
    const repPointMort = r4(pointMort);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `a $${f(dM, 0)} million one-year private placement at ${pct(rUsd, 1)}, spot EUR/USD at ${f(S, 4)}; the bank offers a one-year cross-currency swap — notionals exchanged at ${f(S, 4)} both ways, you receive the dollar rate and pay the euro rate ${pct(rEur, 1)} plus ${basisBp} bp of basis and margin; your economist's two scenarios for the spot in one year: ${f(s1Bas, 4)} (stronger dollar) or ${f(s1Haut, 4)} (weaker dollar)`
      : `un placement privé d'un an de ${f(dM, 0)} M$ à ${pct(rUsd, 1)}, spot EUR/USD à ${f(S, 4)} ; la banque propose un cross-currency swap 1 an — notionnels échangés à ${f(S, 4)} à l'aller comme au retour, vous recevez le taux dollar et payez le taux euro ${pct(rEur, 1)} plus ${basisBp} pb de basis et de marge ; les deux scénarios de votre économiste pour le spot dans un an : ${f(s1Bas, 4)} (dollar plus fort) ou ${f(s1Haut, 4)} (dollar plus faible)`;
    const contexte = (en
      ? [
        `Your mid-cap has found deep money in New York, but every euro of revenue is at home: ${desc}. The board asks the only question that matters: all-in, in euros, what does this debt cost — hedged through the swap, and naked under each scenario? You owe them four numbers and one breakeven, not adjectives.`,
        `Advisory mandate: your client is tempted by the American coupon, "cheaper than the euro market", says the term sheet: ${desc}. Your memo must dismantle the illusion — convert the proceeds, price the covered route through the swap's mechanics, then show what the naked route costs when the dollar moves, in both directions.`,
        `The viva classic: "a European issuer funds in dollars — walk me from the proceeds to the breakeven exchange rate." The data: ${desc}. The examiner wants the euros raised, the all-in hedged cost and WHY the dollar coupon disappears from it, the unhedged cost under both scenarios, and the spot at which the two routes tie.`,
      ]
      : [
        `Votre ETI a trouvé de l'argent profond à New York, mais chaque euro de revenu est ici : ${desc}. Le conseil pose la seule question qui compte : tout compris, en euros, que coûte cette dette — couverte par le swap, et nue dans chaque scénario ? Vous lui devez quatre nombres et un point mort, pas des adjectifs.`,
        `Mandat de conseil : votre client est tenté par le coupon américain, « moins cher que le marché euro », dit la term sheet : ${desc}. Votre note doit démonter l'illusion — convertir le produit de l'émission, chiffrer la route couverte par la mécanique du swap, puis montrer ce que coûte la route nue quand le dollar bouge, dans les deux sens.`,
        `Le classique de l'oral : « un émetteur européen se finance en dollars — menez-moi du produit d'émission au taux de change de point mort. » Les données : ${desc}. L'examinateur attend les euros levés, le coût couvert tout compris et POURQUOI le coupon dollar en disparaît, le coût non couvert dans les deux scénarios, et le spot auquel les deux routes s'égalisent.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The proceeds, in euros' : "a) Le produit de l'émission, en euros",
          enonce: en
            ? `Through the swap's initial exchange at ${f(S, 4)}, how many millions of euros does the company receive today?`
            : `Par l'échange initial du swap à ${f(S, 4)}, combien de millions d'euros l'entreprise reçoit-elle aujourd'hui ?`,
          reponse: repEuros, tolerance: 0.02, toleranceMode: 'absolu', unite: 'M€',
          etapes: [{
            titre: en ? 'Dollars are the quoted currency: divide' : 'Le dollar est la devise cotée : on divise',
            contenu: en
              ? `${f(dM, 0)} / ${f(S, 4)} = **${f(repEuros)} M€**. At ${f(S, 4)} dollars per euro, each dollar buys 1/${f(S, 4)} euro. The swap hands you these euros against your dollars — the famous notional exchange that does NOT exist in an interest rate swap and is the heart of this one.`
              : `${f(dM, 0)} / ${f(S, 4)} = **${f(repEuros)} M€**. À ${f(S, 4)} dollar par euro, chaque dollar achète 1/${f(S, 4)} euro. Le swap vous remet ces euros contre vos dollars — le fameux échange des notionnels qui n'existe PAS dans un swap de taux et qui est le cœur de celui-ci.`,
          }],
          pieges: [en
            ? `Multiplying the dollars by ${f(S, 4)} is the BASE/QUOTED trap: it would manufacture euros out of thin air.`
            : `Multiplier les dollars par ${f(S, 4)} est le piège BASE/COTÉE : cela fabriquerait des euros à partir de rien.`],
        },
        {
          intitule: en ? 'b) The hedged all-in cost' : 'b) Le coût couvert tout compris',
          enonce: en
            ? `Through the swap, what is the all-in cost of the debt in euros, in % a year (2 decimals)?`
            : `À travers le swap, quel est le coût tout compris de la dette en euros, en % par an (2 décimales) ?`,
          reponse: repCouvert, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'Follow each flow: the dollar coupon vanishes' : 'Suivez chaque flux : le coupon dollar disparaît',
              contenu: en
                ? `During the year, the swap PAYS you the dollar rate on $${f(dM, 0)}M — exactly your bond coupon — and you pay ${pct(rEur, 1)} + ${basisBp} bp on the euro leg. At maturity, the swap returns your $${f(dM, 0)}M against your euros at the SAME ${f(S, 4)}: the future spot never enters. All-in cost = ${f(rEur, 1)} + ${f(basisBp / 100, 2)} = **${pct(repCouvert)}** — total outflow ${f(r2(sortieCouverte))} M€ on ${f(repEuros)} M€ received.`
                : `Pendant l'année, le swap vous PAIE le taux dollar sur ${f(dM, 0)} M$ — exactement le coupon de votre obligation — et vous payez ${pct(rEur, 1)} + ${basisBp} pb sur la jambe euro. À l'échéance, le swap vous rend vos ${f(dM, 0)} M$ contre vos euros au MÊME ${f(S, 4)} : le spot futur n'entre jamais en scène. Coût tout compris = ${f(rEur, 1)} + ${f(basisBp / 100, 2)} = **${pct(repCouvert)}** — sortie totale ${f(r2(sortieCouverte))} M€ pour ${f(repEuros)} M€ reçus.`,
            },
            {
              titre: en ? 'The illusion, dismantled' : "L'illusion, démontée",
              contenu: en
                ? `The "cheap" dollar coupon of ${pct(rUsd, 1)} was never the cost: hedged, a dollar debt costs the EURO rate plus the basis, flux for flux. Anything else would be an arbitrage on covered parity. The basis (${basisBp} bp here, usually in the dollar's favour) is the world price of dollar funding tension — module 6's thermometer, quoted on long maturities precisely in this market.`
                : `Le coupon dollar « pas cher » de ${pct(rUsd, 1)} n'a jamais été le coût : couverte, une dette en dollars coûte le taux EURO plus le basis, flux pour flux. Tout autre résultat serait un arbitrage sur la parité couverte. Le basis (${basisBp} pb ici, le plus souvent en faveur du dollar) est le prix mondial de la tension sur le financement en dollar — le thermomètre du module 6, coté sur les maturités longues précisément sur ce marché.`,
            },
          ],
          pieges: [en
            ? `Answering ${pct(rUsd, 1)} — the bond coupon — forgets that the swap's received leg pays that coupon for you: the cost that remains is the euro leg.`
            : `Répondre ${pct(rUsd, 1)} — le coupon de l'obligation — oublie que la jambe reçue du swap paie ce coupon à votre place : le coût qui reste est la jambe euro.`],
        },
        {
          intitule: en ? 'c) Naked, scenario "stronger dollar"' : 'c) Nue, scénario « dollar plus fort »',
          enonce: en
            ? `Unhedged, with the spot at ${f(s1Bas, 4)} in one year, what is the effective cost of the debt in euros, in %?`
            : `Sans couverture, avec un spot à ${f(s1Bas, 4)} dans un an, quel est le coût effectif de la dette en euros, en % ?`,
          reponse: repNcBas, tolerance: 0.15, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The debt got heavier in euros' : 'La dette s\'est alourdie en euros',
            contenu: en
              ? `Repay ${f(dM, 0)} × ${f(1 + rUsd / 100, 4)} = ${f(r2(detteUsd))} M$, bought at ${f(s1Bas, 4)}: ${f(r2(sortieNcBas))} M€ out, against ${f(repEuros)} M€ received ⇒ effective cost = **${pct(repNcBas)}**. The dollar strengthened ${pct(r1((1 - kBas) * 100), 1)} and every one of those points landed on your funding cost.`
              : `Rembourser ${f(dM, 0)} × ${f(1 + rUsd / 100, 4)} = ${f(r2(detteUsd))} M$, achetés à ${f(s1Bas, 4)} : ${f(r2(sortieNcBas))} M€ de sortie, contre ${f(repEuros)} M€ reçus ⇒ coût effectif = **${pct(repNcBas)}**. Le dollar s'est renforcé de ${pct(r1((1 - kBas) * 100), 1)} et chacun de ces points a atterri sur votre coût de financement.`,
          }],
        },
        {
          intitule: en ? 'd) Naked, scenario "weaker dollar"' : 'd) Nue, scénario « dollar plus faible »',
          enonce: en
            ? `Unhedged, with the spot at ${f(s1Haut, 4)}, what effective cost in % (negative if the FX gain outruns the interest)?`
            : `Sans couverture, avec un spot à ${f(s1Haut, 4)}, quel coût effectif en % (négatif si le gain de change dépasse les intérêts) ?`,
          reponse: repNcHaut, tolerance: 0.15, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The seduction of the open position' : 'La séduction de la position ouverte',
            contenu: en
              ? `${f(r2(detteUsd))} M$ bought at ${f(s1Haut, 4)} = ${f(r2(sortieNcHaut))} M€ ⇒ effective cost = **${pct(repNcHaut)}**${tauxNcHaut < 0 ? ' — the company is PAID to have borrowed' : ''}. This is the scenario the naked route's defenders will brandish. Note what it really is: a currency bet stapled onto a funding decision — profitable here, ruinous in scenario c), decided by a coin the treasurer does not flip.`
              : `${f(r2(detteUsd))} M$ achetés à ${f(s1Haut, 4)} = ${f(r2(sortieNcHaut))} M€ ⇒ coût effectif = **${pct(repNcHaut)}**${tauxNcHaut < 0 ? ' — l\'entreprise est PAYÉE pour avoir emprunté' : ''}. C'est le scénario que les défenseurs de la route nue brandiront. Voyez ce que c'est vraiment : un pari de change agrafé à une décision de financement — gagnant ici, ruineux au scénario c), tranché par une pièce que le trésorier ne lance pas.`,
          }],
        },
        {
          intitule: en ? 'e) The bad-scenario bill' : 'e) La facture du mauvais scénario',
          enonce: en
            ? `In the stronger-dollar scenario, how many thousands of euros does the naked route cost beyond the hedged one?`
            : `Dans le scénario dollar fort, combien de milliers d'euros la route nue coûte-t-elle de plus que la route couverte ?`,
          reponse: repEcart, tolerance: 0.02, unite: 'k€',
          etapes: [{
            titre: en ? 'Two outflows, one gap' : 'Deux sorties, un écart',
            contenu: en
              ? `${f(r2(sortieNcBas))} − ${f(r2(sortieCouverte))} = ${f(r2(sortieNcBas - sortieCouverte))} M€ = **${f(repEcart, 0)} k€** of extra cost — several years of the swap's basis-and-margin bill (${basisBp} bp ≈ ${f(r0((basisBp / 10000) * eurosRecus * 1000), 0)} k€ a year), burned in one adverse draw. The hedge's price buys the removal of exactly this column.`
              : `${f(r2(sortieNcBas))} − ${f(r2(sortieCouverte))} = ${f(r2(sortieNcBas - sortieCouverte))} M€ = **${f(repEcart, 0)} k€** de surcoût — plusieurs années de la facture basis-et-marge du swap (${basisBp} pb ≈ ${f(r0((basisBp / 10000) * eurosRecus * 1000), 0)} k€ par an), brûlées en un seul tirage adverse. Le prix de la couverture achète la suppression d'exactement cette colonne.`,
          }],
        },
        {
          intitule: en ? 'f) The breakeven spot' : 'f) Le spot de point mort',
          enonce: en
            ? `At what EUR/USD spot in one year do the naked and hedged routes cost exactly the same (4 decimals)?`
            : `À quel spot EUR/USD dans un an les routes nue et couverte coûtent-elles exactement pareil (4 décimales) ?`,
          reponse: repPointMort, tolerance: 0.003, toleranceMode: 'absolu',
          etapes: [
            {
              titre: en ? 'Equalise the two outflows' : 'Égaliser les deux sorties',
              contenu: en
                ? `S* = dollar debt / hedged outflow = ${f(r2(detteUsd))} / ${f(r2(sortieCouverte))} = **${f(repPointMort, 4)}**. Below ${f(repPointMort, 4)} (dollar stronger than that), the naked route loses; above, it wins. Notice where S* sits: a touch ${pointMort < S ? 'below' : 'around'} today's ${f(S, 4)} — the rate differential and the basis, nothing else.`
                : `S* = dette en dollars / sortie couverte = ${f(r2(detteUsd))} / ${f(r2(sortieCouverte))} = **${f(repPointMort, 4)}**. Sous ${f(repPointMort, 4)} (dollar plus fort que cela), la route nue perd ; au-dessus, elle gagne. Voyez où S* se loge : un peu ${pointMort < S ? 'sous' : 'autour de'} le ${f(S, 4)} d'aujourd'hui — le différentiel de taux et le basis, rien d'autre.`,
            },
            {
              titre: en ? 'The governance answer' : 'La réponse de gouvernance',
              contenu: en
                ? `The right question for the board is not "where will the dollar be?" — nobody knows — but "is currency risk part of our business?". For an industrial whose margins live elsewhere, the answer is written in the treasury policy before any issue: fund where the money is deep, swap into the revenue currency, and let the basis be the known, budgeted price of sleeping at night.`
                : `La bonne question pour le conseil n'est pas « où sera le dollar ? » — personne ne le sait — mais « le risque de change fait-il partie de notre métier ? ». Pour un industriel dont les marges vivent ailleurs, la réponse s'écrit dans la politique de trésorerie avant toute émission : se financer là où l'argent est profond, swapper vers la devise des revenus, et laisser le basis être le prix connu et budgété des nuits tranquilles.`,
            },
          ],
          pieges: [en
            ? `Comparing the naked route to TODAY's spot instead of the breakeven hides the carry: the hedged outflow already contains the euro leg and the basis — the fair benchmark is S*, not ${f(S, 4)}.`
            : `Comparer la route nue au spot d'AUJOURD'HUI au lieu du point mort masque le portage : la sortie couverte contient déjà la jambe euro et le basis — la référence honnête est S*, pas ${f(S, 4)}.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 15. m7-pb-15 — La semaine de Metallgesellschaft — BOSS N4           */
/* ------------------------------------------------------------------ */
const semaineMetallgesellschaft: ProblemGenerator = {
  id: 'm7-pb-15', moduleId: M7,
  titre: 'La semaine de Metallgesellschaft : solvable, mais pour combien de temps ?',
  titreEn: 'The Metallgesellschaft week: solvent, but for how long?',
  typeDeCas: 'couverture et liquidité',
  typeDeCasEn: 'hedging and liquidity',
  difficulte: 4,
  scenarios: ['Trésorier de la filiale pendant la semaine noire', 'Contrôleur dépêché par la maison mère', "Grand oral : l'autopsie du hedge qui a failli tuer"],
  scenariosEn: ['Treasurer of the subsidiary during the black week', 'Controller flown in by the parent company', 'Final viva: autopsy of the hedge that nearly killed'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const eBarils = randInt(rng, 60, 120); // millions de barils d'engagements clients
    const p0 = randFloat(rng, 17, 22, 2);
    const d1 = randFloat(rng, 0.4, 0.9, 2);
    const dSem = r2(d1 + randFloat(rng, 0.7, 1.4, 2));
    const spread = randFloat(rng, 0.15, 0.4, 2); // contango, $/baril par roll mensuel
    const ligne = randInt(rng, 400, 900); // M$ de lignes de crédit

    const nb = nombreContratsCouverture(eBarils * p0, p0, 1000);
    const p1 = r2(p0 - d1);
    const p5 = r2(p0 - dSem);
    const varLundi = margeVariation(p0, p1, 1000, nb, 1) / 1e6;
    const pnlSem = pnlFutures(p0, p5, 1000, nb, 1) / 1e6;
    const gainLatent = eBarils * dSem;
    const coutRoll = (nb * 1000 * spread) / 1e6;
    const semaines = ligne / Math.abs(pnlSem);
    const repNb = nb;
    const repVar = r1(varLundi);
    const repSem = r1(pnlSem);
    const repLatent = r1(gainLatent);
    const repRoll = r1(coutRoll);
    const repSurvie = r1(semaines);

    const { en, f, usd } = outils(langue);
    const desc = en
      ? `${f(eBarils, 0)} million barrels of fixed-price client commitments spread over the coming years, hedged one-for-one with LONG near-month futures (1,000 barrels per contract) rolled month after month — the stack and roll; the near month trades at $${f(p0, 2)} a barrel; the curve has flipped into contango, ${usd(spread)} a barrel lost on every monthly roll; the group's committed credit lines stand at $${f(ligne, 0)} million`
      : `${f(eBarils, 0)} millions de barils d'engagements clients à prix fixe étalés sur les années à venir, couverts un pour un par des futures courts ACHETEURS (1 000 barils par contrat) rollés mois après mois — le stack and roll ; l'échéance proche cote ${f(p0, 2)} $ le baril ; la courbe vient de basculer en contango, ${f(spread, 2)} $ par baril perdus à chaque roll mensuel ; les lignes de crédit confirmées du groupe valent ${f(ligne, 0)} M$`;
    const contexte = (en
      ? [
        `Houston, Monday, 6:50 a.m. You are the treasurer of the American subsidiary, and the position you inherited is the firm's pride: ${desc}. The sales force calls it "the locked-in decade" — every barrel of future deliveries sold at a fixed price, every barrel hedged. On paper, nothing can hurt you.\n\nThen the screen opens: crude is down again, fifth session out of six. Your assistant puts the clearing broker's overnight margin statement on your desk and does not say a word. By Friday the market will have fallen ${usd(dSem)} a barrel, the parent company in Frankfurt will be asking why a "hedged" book devours cash by the hundred million, and the banks will be re-reading the covenants. Before the 9 a.m. call with Frankfurt, you redo every number yourself — position, Monday's margin, the week, the other side of the ledger, the roll, and the date your liquidity dies.`,
        `Frankfurt sent you with one mission: tell the board whether the American subsidiary is bankrupt, reckless, or simply misunderstood. The file on the plane said: ${desc}.\n\nIn Houston the treasurer shows you a ledger nobody upstairs has wanted to read slowly: futures losses settled in cash every evening, client-contract gains parked in a column marked "latent". The week you must reconstruct — margin flows, the symmetric paper gains, the cost of the contango roll, the runway left on the credit lines — is precisely the week the board will use to decide between wiring fresh capital and ordering the position unwound at market. Both decisions are irreversible; only the arithmetic can arbitrate.`,
        `The examiner slides a single sheet across the table: "December 1993. A subsidiary hedges long-term fixed-price sales with rolled short-dated futures. The market drops and goes into contango. Walk me through the week the hedge nearly killed the firm." The data: ${desc}.\n\nHe wants the canonical autopsy, number by number: the size of the stack, the Monday margin call, the cumulative week, the latent gains that pay nothing, the monthly toll of the roll — and the survival clock. Then the one-sentence verdict that separates the candidates who recite from those who understand: solvent is not the same thing as alive.`,
      ]
      : [
        `Houston, lundi, 6 h 50. Vous êtes trésorier de la filiale américaine, et la position dont vous héritez fait la fierté de la maison : ${desc}. Les commerciaux l'appellent « la décennie verrouillée » — chaque baril de livraisons futures vendu à prix fixe, chaque baril couvert. Sur le papier, rien ne peut vous atteindre.\n\nPuis l'écran s'ouvre : le brut baisse encore, cinquième séance sur six. Votre adjoint pose sur le bureau le relevé de marge du broker compensateur et ne dit pas un mot. D'ici vendredi, le marché aura perdu ${f(dSem, 2)} $ par baril, la maison mère à Francfort demandera pourquoi un book « couvert » dévore le cash par centaines de millions, et les banques reliront les covenants. Avant le call de 9 h avec Francfort, vous refaites chaque nombre vous-même — la position, la marge du lundi, la semaine, l'autre colonne du grand livre, le roll, et la date de mort de votre liquidité.`,
        `Francfort vous a envoyé avec une seule mission : dire au conseil si la filiale américaine est en faillite, inconsciente, ou simplement incomprise. Le dossier lu dans l'avion disait : ${desc}.\n\nÀ Houston, le trésorier vous montre un grand livre que personne là-haut n'a voulu lire lentement : des pertes futures réglées en cash chaque soir, des gains sur contrats clients rangés dans une colonne marquée « latent ». La semaine que vous devez reconstituer — les flux de marge, les gains papier symétriques, le coût du roll en contango, l'autonomie restante sur les lignes — est précisément celle sur laquelle le conseil tranchera entre virer du capital frais et ordonner le débouclage au marché. Les deux décisions sont irréversibles ; seule l'arithmétique peut arbitrer.`,
        `L'examinateur fait glisser une feuille unique : « Décembre 1993. Une filiale couvre des ventes long terme à prix fixe avec des futures courts rollés. Le marché baisse et passe en contango. Déroulez-moi la semaine où le hedge a failli tuer l'entreprise. » Les données : ${desc}.\n\nIl attend l'autopsie canonique, nombre par nombre : la taille du stack, l'appel du lundi, le cumul de la semaine, les gains latents qui ne paient rien, le péage mensuel du roll — et l'horloge de survie. Puis le verdict en une phrase qui sépare les candidats qui récitent de ceux qui comprennent : être solvable n'est pas être vivant.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The size of the stack' : 'a) La taille du stack',
          enonce: en
            ? `Hedging the ${f(eBarils, 0)} million barrels one-for-one on the near month, how many futures contracts does the stack hold?`
            : `Pour couvrir les ${f(eBarils, 0)} millions de barils un pour un sur l'échéance proche, combien de contrats futures le stack contient-il ?`,
          reponse: repNb, tolerance: 0.5, toleranceMode: 'absolu', unite: en ? 'contracts' : 'contrats',
          etapes: [{
            titre: en ? 'A thousand barrels per contract' : 'Mille barils par contrat',
            contenu: en
              ? `Exposure = ${f(eBarils, 0)} 000 000 barrels × ${usd(p0)} = ${usd(r0(eBarils * p0), 0)} million; each contract carries 1,000 × ${usd(p0)} = ${usd(p0 * 1000, 0)} ⇒ N = **${f(repNb, 0)} contracts** — the entire long-term book stacked on the ONE liquid expiry, to be rolled forever. The hedge ratio is right; the maturity mismatch is total, and that mismatch is the whole story.`
              : `Exposition = ${f(eBarils, 0)} 000 000 barils × ${f(p0, 2)} $ = ${f(r0(eBarils * p0), 0)} M$ ; chaque contrat porte 1 000 × ${f(p0, 2)} $ = ${f(p0 * 1000, 0)} $ ⇒ N = **${f(repNb, 0)} contrats** — tout le book long terme empilé sur LA seule échéance liquide, à roller indéfiniment. Le ratio de couverture est juste ; le décalage de maturité est total, et ce décalage est toute l'histoire.`,
          }],
          pieges: [en
            ? `Hedging only the next year's deliveries would leave the rest of the decade naked: the stack hedges the FULL commitment — which is exactly why its margin flows are so enormous.`
            : `Ne couvrir que les livraisons de l'année à venir laisserait le reste de la décennie nu : le stack couvre l'engagement TOTAL — raison exacte pour laquelle ses flux de marge sont si énormes.`],
        },
        {
          intitule: en ? "b) Monday's margin" : 'b) La marge du lundi',
          enonce: en
            ? `Monday evening, the near month settles at ${usd(p1)} (−${usd(d1)}). What variation margin hits the account, in millions of dollars (negative = cash out)?`
            : `Lundi soir, l'échéance proche compense à ${f(p1, 2)} $ (−${f(d1, 2)} $). Quelle marge de variation frappe le compte, en millions de dollars (négatif = sortie de cash) ?`,
          reponse: repVar, tolerance: 0.5, toleranceMode: 'absolu', unite: 'M$',
          etapes: [{
            titre: en ? 'One evening, one flow' : 'Un soir, un flux',
            contenu: en
              ? `(${f(p1, 2)} − ${f(p0, 2)}) × 1,000 × ${f(repNb, 0)} = **${f(repVar, 1)} M$**, wired to the clearing house before tomorrow's open — no negotiation, no delay. Rule of thumb worth memorising: on this stack, every dollar of decline costs ${f(eBarils, 0)} M$ of same-day cash.`
              : `(${f(p1, 2)} − ${f(p0, 2)}) × 1 000 × ${f(repNb, 0)} = **${f(repVar, 1)} M$**, virés à la chambre avant l'ouverture de demain — sans négociation, sans délai. Règle d'or à mémoriser : sur ce stack, chaque dollar de baisse coûte ${f(eBarils, 0)} M$ de cash le jour même.`,
          }],
        },
        {
          intitule: en ? 'c) The whole week' : 'c) La semaine entière',
          enonce: en
            ? `By Friday the near month has lost ${usd(dSem)} in total, settling at ${usd(p5)}. What did the week cost in cash, in millions of dollars?`
            : `Vendredi, l'échéance proche a perdu ${f(dSem, 2)} $ au total et compense à ${f(p5, 2)} $. Qu'a coûté la semaine en cash, en millions de dollars ?`,
          reponse: repSem, tolerance: 0.5, toleranceMode: 'absolu', unite: 'M$',
          etapes: [{
            titre: en ? 'The sum of the evenings' : 'La somme des soirs',
            contenu: en
              ? `(${f(p5, 2)} − ${f(p0, 2)}) × 1,000 × ${f(repNb, 0)} = **${f(repSem, 1)} M$** of variation margin over five sessions — the mark-to-market never changes the total, only the calendar, and this week the calendar is the weapon. The historical case ran the same arithmetic at full scale: around one billion dollars of margin calls to find.`
              : `(${f(p5, 2)} − ${f(p0, 2)}) × 1 000 × ${f(repNb, 0)} = **${f(repSem, 1)} M$** de marges de variation en cinq séances — le mark-to-market ne change jamais le total, seulement le calendrier, et cette semaine le calendrier est l'arme. Le cas historique a déroulé la même arithmétique en taille réelle : de l'ordre du milliard de dollars d'appels de marge à trouver.`,
          }],
        },
        {
          intitule: en ? 'd) The other column of the ledger' : "d) L'autre colonne du grand livre",
          enonce: en
            ? `Same week, same ${usd(dSem)} drop: by how much did the fixed-price client commitments GAIN in value, in millions of dollars?`
            : `Même semaine, même baisse de ${f(dSem, 2)} $ : de combien les engagements clients à prix fixe ont-ils GAGNÉ en valeur, en millions de dollars ?`,
          reponse: repLatent, tolerance: 0.5, toleranceMode: 'absolu', unite: 'M$',
          etapes: [
            {
              titre: en ? 'The hedge works — economically' : 'Le hedge fonctionne — économiquement',
              contenu: en
                ? `Selling ${f(eBarils, 0)} million barrels at a fixed price while the market drops ${usd(dSem)} improves the margin on every future delivery: gain ≈ ${f(eBarils, 0)} × ${f(dSem, 2)} = **+${f(repLatent, 1)} M$** — the mirror image of the futures loss. The book is HEDGED: net exposure near zero, the balance sheet defensible.`
                : `Vendre ${f(eBarils, 0)} millions de barils à prix fixe pendant que le marché perd ${f(dSem, 2)} $ améliore la marge de chaque livraison future : gain ≈ ${f(eBarils, 0)} × ${f(dSem, 2)} = **+${f(repLatent, 1)} M$** — l'image miroir de la perte sur futures. Le book est COUVERT : exposition nette quasi nulle, bilan défendable.`,
            },
            {
              titre: en ? 'But latent gains pay nothing tonight' : 'Mais les gains latents ne paient rien ce soir',
              contenu: en
                ? `Those ${f(repLatent, 1)} M$ are spread over YEARS of future deliveries: not one dollar of them is wired to you this week, while the ${f(Math.abs(repSem), 1)} M$ on the futures leg left in cash, evening after evening. Solvency lives in the left column; survival is decided in the right one. That asymmetry — cash losses against paper gains — is the entire Metallgesellschaft mechanism.`
                : `Ces ${f(repLatent, 1)} M$ sont étalés sur des ANNÉES de livraisons futures : pas un dollar n'en est viré cette semaine, pendant que les ${f(Math.abs(repSem), 1)} M$ de la jambe futures sont partis en cash, soir après soir. La solvabilité vit dans la colonne de gauche ; la survie se décide dans celle de droite. Cette asymétrie — pertes cash contre gains papier — est tout le mécanisme Metallgesellschaft.`,
            },
          ],
          pieges: [en
            ? `Concluding "hedged, therefore nothing happens" confuses P&L and cash flow: the two legs offset in VALUE, not in TIMING — and margin calls are settled in timing.`
            : `Conclure « couvert, donc rien ne se passe » confond P&L et flux de trésorerie : les deux jambes se compensent en VALEUR, pas en CALENDRIER — et les appels de marge se règlent en calendrier.`],
        },
        {
          intitule: en ? 'e) The toll of the roll' : 'e) Le péage du roll',
          enonce: en
            ? `The curve is in contango: rolling the stack costs ${usd(spread)} a barrel each month. What does the next roll cost, in millions of dollars?`
            : `La courbe est en contango : roller le stack coûte ${f(spread, 2)} $ par baril chaque mois. Que coûte le prochain roll, en millions de dollars ?`,
          reponse: repRoll, tolerance: 0.3, toleranceMode: 'absolu', unite: 'M$',
          etapes: [{
            titre: en ? 'Sell cheap, buy dear, every month' : 'Vendre bas, racheter haut, chaque mois',
            contenu: en
              ? `Rolling = selling the expiring month and buying the next one ${usd(spread)} higher: ${f(repNb, 0)} × 1,000 × ${f(spread, 2)} = **${f(repRoll, 1)} M$** per month, ${f(r1(repRoll * 12), 1)} M$ a year if the contango persists. Module 6 called it the roll steamroller; here it grinds a hedger. When the strategy was designed, the curve was backwardated and each roll PAID — the regime flipped, the strategy did not.`
              : `Roller = vendre le mois qui expire et racheter le suivant ${f(spread, 2)} $ plus haut : ${f(repNb, 0)} × 1 000 × ${f(spread, 2)} = **${f(repRoll, 1)} M$** par mois, ${f(r1(repRoll * 12), 1)} M$ par an si le contango persiste. Le module 6 l'appelait le rouleau compresseur du roll ; ici il broie un hedger. Quand la stratégie a été conçue, la courbe était en backwardation et chaque roll RAPPORTAIT — le régime a basculé, la stratégie non.`,
          }],
        },
        {
          intitule: en ? 'f) The survival clock — and the verdict' : "f) L'horloge de survie — et le verdict",
          enonce: en
            ? `At this week's pace of margin outflows, how many weeks do the $${f(ligne, 0)} million credit lines last?`
            : `Au rythme de cette semaine de sorties de marge, combien de semaines les ${f(ligne, 0)} M$ de lignes de crédit tiennent-ils ?`,
          reponse: repSurvie, tolerance: 0.3, toleranceMode: 'absolu', unite: en ? 'weeks' : 'semaines',
          etapes: [
            {
              titre: en ? 'Divide the war chest by the bleed' : 'Diviser le trésor de guerre par l\'hémorragie',
              contenu: en
                ? `${f(ligne, 0)} / ${f(Math.abs(repSem), 1)} = **${f(repSurvie, 1)} weeks** — before counting the monthly ${f(repRoll, 1)} M$ of roll, and assuming the banks keep the lines open while watching the bleed. They will not: nervous lenders shrink lines precisely when you draw them. The clock is shorter than it reads.`
                : `${f(ligne, 0)} / ${f(Math.abs(repSem), 1)} = **${f(repSurvie, 1)} semaines** — avant de compter les ${f(repRoll, 1)} M$ mensuels du roll, et en supposant que les banques gardent les lignes ouvertes en regardant l'hémorragie. Elles ne le feront pas : un prêteur nerveux raccourcit les lignes précisément quand vous les tirez. L'horloge est plus courte qu'elle ne l'affiche.`,
            },
            {
              titre: en ? 'Solvent is not alive — the chapter\'s verdict' : "Solvable n'est pas vivant — le verdict du chapitre",
              contenu: en
                ? `History's answer, December 1993: the parent and the banks, terrified by the cash burn, ordered the unwind AT THE WORST MOMENT — crystallising about $1.3 billion of losses on a book whose economics were defensible, since the latent client gains roughly matched. The operational lesson is settled even where the academic debate is not: before any hedge settled by daily margins, the professional question is not "is the hedge right?" but "can I FUND the worst margin path to the end?" — Buffett structured his own giant derivative positions with no daily margin calls for exactly this reason. Sizing rule: position on the cash mobilisable in the storm, never on the P&L expected in fair weather.`
                : `La réponse de l'histoire, décembre 1993 : la maison mère et les banques, terrifiées par la consommation de cash, ont ordonné le débouclage AU PIRE MOMENT — cristallisant environ 1,3 Md$ de pertes sur un book économiquement défendable, puisque les gains latents clients compensaient à peu près. La leçon opérationnelle est tranchée même là où le débat académique ne l'est pas : avant toute couverture réglée par marges quotidiennes, la question professionnelle n'est pas « le hedge est-il bon ? » mais « puis-je FINANCER le pire chemin de marge jusqu'au bout ? » — Buffett a structuré ses propres positions géantes de dérivés sans appels de marge quotidiens exactement pour cette raison. Règle de dimensionnement : la position se calibre sur le cash mobilisable dans la tempête, jamais sur le P&L espéré au beau temps.`,
            },
          ],
          pieges: [en
            ? `Concluding "the hedge was wrong" misses the point the examiners test: the hedge was economically defensible and operationally lethal — liquidity, not valuation, is what killed it.`
            : `Conclure « le hedge était faux » rate le point que les jurys testent : le hedge était économiquement défendable et opérationnellement létal — c'est la liquidité, pas la valorisation, qui a tué.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 16. m7-pb-16 — Leeson à Singapour — BOSS N4                         */
/* ------------------------------------------------------------------ */
const leesonSingapour: ProblemGenerator = {
  id: 'm7-pb-16', moduleId: M7,
  titre: 'Singapour, compte 88888 : la spirale après Kobé',
  titreEn: 'Singapore, account 88888: the spiral after Kobe',
  typeDeCas: 'levier, marges et contrôles',
  typeDeCasEn: 'leverage, margins and controls',
  difficulte: 4,
  scenarios: ['Inspecteur des risques dépêché de Londres', 'Analyste de la chambre de compensation de Singapour', "Grand oral : l'autopsie de la banque morte en un week-end"],
  scenariosEn: ['Risk inspector flown in from London', "Analyst at the Singapore clearing house", 'Final viva: autopsy of the bank that died in a weekend'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const pertesAnt = randInt(rng, 180, 260); // M£ déjà cachées fin 1994
    const n1k = randInt(rng, 18, 30); // milliers de contrats longs avant Kobé
    const p0 = randInt(rng, 19200, 19600);
    const chute1 = randInt(rng, 1200, 1600);
    const n2k = randInt(rng, 8, 15); // milliers de contrats AJOUTÉS après Kobé
    const chute2 = randInt(rng, 600, 1100);
    const nStrK = randInt(rng, 30, 40); // milliers de straddles vendus
    const strike = randInt(rng, 18800, 19300);
    const prem = randInt(rng, 550, 750); // points encaissés par straddle
    const yenLivre = randInt(rng, 148, 162); // ¥ par £
    const margePct = randFloat(rng, 5, 8, 1);

    const p1 = p0 - chute1;
    const p2 = p1 - chute2;
    const n1 = n1k * 1000;
    const nTot = (n1k + n2k) * 1000;
    const pnl1Y = pnlFutures(p0, p1, 500, n1, 1);
    const pnl1MY = pnl1Y / 1e6;
    const virML = Math.abs(pnl1Y) / 1e6 / yenLivre;
    const pnl2ML = pnlFutures(p1, p2, 500, nTot, 1) / 1e6 / yenLivre;
    const intrin = strike - p2;
    const stradML = ((intrin - prem) * 500 * nStrK * 1000) / 1e6 / yenLivre;
    const totalML = pertesAnt + virML + Math.abs(pnl2ML) + stradML;
    const chutePct = ((p2 - p0) / p0) * 100;
    const levier = effetLevier(r1(chutePct), margePct);
    const repPnl1 = r0(pnl1MY);
    const repVir = r1(virML);
    const repPnl2 = r1(pnl2ML);
    const repStrad = r1(stradML);
    const repTotal = r0(totalML);
    const repLevier = r0(levier);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `a hidden account already carrying £${f(pertesAnt, 0)} million of accumulated losses; ${f(n1k, 0)},000 long Nikkei futures (¥500 per index point) at an average of ${f(p0, 0)} points; after the January 17 earthquake the index slides to ${f(p1, 0)} within a week; the trader then ADDS ${f(n2k, 0)},000 contracts at ${f(p1, 0)}, and the market grinds on down to ${f(p2, 0)}; on top, ${f(nStrK, 0)},000 short straddles struck near ${f(strike, 0)}, sold for about ${f(prem, 0)} points of premium each; SIMEX initial margin around ${pct(margePct, 1)}; ¥${f(yenLivre, 0)} to the pound`
      : `un compte caché portant déjà ${f(pertesAnt, 0)} M£ de pertes accumulées ; ${f(n1k, 0)} 000 futures Nikkei acheteurs (500 ¥ par point d'indice) à ${f(p0, 0)} points de moyenne ; après le séisme du 17 janvier, l'indice glisse à ${f(p1, 0)} en une semaine ; le trader AJOUTE alors ${f(n2k, 0)} 000 contrats à ${f(p1, 0)}, et le marché continue de moudre jusqu'à ${f(p2, 0)} ; par-dessus, ${f(nStrK, 0)} 000 straddles vendeurs de strike proche de ${f(strike, 0)}, vendus environ ${f(prem, 0)} points de prime chacun ; marge initiale SIMEX autour de ${pct(margePct, 1)} ; ${f(yenLivre, 0)} ¥ pour une livre`;
    const contexte = (en
      ? [
        `London, late February 1995. You land in Singapore with an audit letter and a bad feeling: the star trader of the Singapore office — the man who books a quarter of the bank's profits, and who happens to run BOTH the trading desk and the back office — has stopped answering. In a drawer, a printout nobody in London has ever seen: account 88888. The position it hides: ${desc}.\n\nFor weeks, London wired "client margins" by the tens of millions without asking whose clients. Your job tonight, before the Bank of England conference call: reconstruct the spiral number by number — the Kobe week, the cash wired, the doubling-down, the sold volatility detonating, the total against the bank's capital — and say out loud what the haste of others will say tomorrow: the bank is already dead.`,
        `You sit at the clearing house in Singapore, and one member's margin calls have grown beyond anything in the house's history: ${desc}. The member is a 233-year-old British merchant bank; the position is supposedly "hedged client business". Your screens say otherwise.\n\nBefore escalating to the exchange's board, you rebuild the file: what the long futures lost when Kobe hit, what cash that drained, what the doubling added when the trader chose to fight the market, what the short straddles — insurance sold against the very earthquake that happened — cost on top, and what the total does to a bank whose entire capital is around £440 million. The clearing house survived; the member did not. Show why, in numbers.`,
        `The examiner gives you a single line: "Barings, 1995 — eight hundred and twenty-seven million pounds. Decompose it." The data, calibrated like the real thing: ${desc}.\n\nHe wants the canonical chain: the loss on the long futures in the Kobe week, the margin cash London wired without understanding it, the doubling at the bottom of the slide, the short volatility exploding, the cumulative total against the capital — and the two structural lessons, leverage and controls, that every risk department has recited since. The candidate who only says "rogue trader" fails; the mechanism is the answer.`,
      ]
      : [
        `Londres, fin février 1995. Vous atterrissez à Singapour avec une lettre de mission et un mauvais pressentiment : le trader vedette du bureau local — l'homme qui rapporte le quart des profits de la banque, et qui se trouve diriger À LA FOIS le desk de trading et le back-office — ne répond plus. Dans un tiroir, un listing que personne à Londres n'a jamais vu : le compte 88888. La position qu'il cache : ${desc}.\n\nPendant des semaines, Londres a viré des « marges clients » par dizaines de millions sans demander quels clients. Votre travail ce soir, avant la conférence avec la Banque d'Angleterre : reconstituer la spirale nombre par nombre — la semaine de Kobé, le cash viré, le doublement de la mise, la volatilité vendue qui détone, le total face au capital de la banque — et dire à voix haute ce que la précipitation des autres dira demain : la banque est déjà morte.`,
        `Vous êtes à la chambre de compensation de Singapour, et les appels de marge d'un membre dépassent tout ce que la maison a connu : ${desc}. Le membre est une banque d'affaires britannique vieille de 233 ans ; la position est censée être de la « clientèle couverte ». Vos écrans disent autre chose.\n\nAvant d'alerter le conseil de la bourse, vous remontez le dossier : ce que les futures acheteurs ont perdu quand Kobé a frappé, le cash que cela a drainé, ce que le doublement a ajouté quand le trader a choisi de se battre contre le marché, ce que les straddles vendeurs — de l'assurance vendue contre le séisme même qui a eu lieu — ont coûté par-dessus, et ce que le total fait à une banque dont le capital entier avoisine 440 M£. La chambre a survécu ; le membre, non. Montrez pourquoi, en nombres.`,
        `L'examinateur vous donne une seule ligne : « Barings, 1995 — huit cent vingt-sept millions de livres. Décomposez. » Les données, calibrées comme le cas réel : ${desc}.\n\nIl attend la chaîne canonique : la perte des futures acheteurs la semaine de Kobé, le cash de marge que Londres a viré sans le comprendre, le doublement au creux de la glissade, la volatilité vendue qui explose, le total cumulé face au capital — et les deux leçons structurelles, le levier et les contrôles, que tous les départements des risques récitent depuis. Le candidat qui ne dit que « trader fou » échoue ; le mécanisme est la réponse.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The Kobe week, on the books' : 'a) La semaine de Kobé, au grand livre',
          enonce: en
            ? `On the ${f(n1k, 0)},000 long contracts, what does the slide from ${f(p0, 0)} to ${f(p1, 0)} cost, in millions of yen?`
            : `Sur les ${f(n1k, 0)} 000 contrats acheteurs, que coûte la glissade de ${f(p0, 0)} à ${f(p1, 0)}, en millions de yens ?`,
          reponse: repPnl1, tolerance: 0.005, unite: 'M¥',
          etapes: [{
            titre: en ? 'Five hundred yen per point, times the stack' : 'Cinq cents yens par point, fois la pile',
            contenu: en
              ? `(${f(p1, 0)} − ${f(p0, 0)}) × 500 × ${f(n1, 0)} = **${f(repPnl1, 0)} M¥**. One index point on this position is worth ${f(r1((500 * n1) / 1e6), 1)} M¥; the earthquake took ${f(chute1, 0)} of them in a week. Nothing exotic — the plain pnl of a long futures, at a size nobody had authorised.`
              : `(${f(p1, 0)} − ${f(p0, 0)}) × 500 × ${f(n1, 0)} = **${f(repPnl1, 0)} M¥**. Un point d'indice sur cette position vaut ${f(r1((500 * n1) / 1e6), 1)} M¥ ; le séisme en a pris ${f(chute1, 0)} en une semaine. Rien d'exotique — le P&L ordinaire d'un long futures, à une taille que personne n'avait autorisée.`,
          }],
        },
        {
          intitule: en ? 'b) The cash London wired' : 'b) Le cash que Londres a viré',
          enonce: en
            ? `Those losses are settled in cash by daily variation margin. At ¥${f(yenLivre, 0)} per pound, how many millions of pounds did that week drain, labelled "client margins"?`
            : `Ces pertes se règlent en cash par marges de variation quotidiennes. À ${f(yenLivre, 0)} ¥ la livre, combien de millions de livres cette semaine a-t-elle drainés, étiquetés « marges clients » ?`,
          reponse: repVir, tolerance: 0.01, unite: 'M£',
          etapes: [{
            titre: en ? 'The margin is the truth-teller' : 'La marge est le révélateur',
            contenu: en
              ? `${f(Math.abs(repPnl1), 0)} M¥ / ${f(yenLivre, 0)} = **£${f(repVir, 1)}m** wired that week alone — by the end of February the cumulative wires from London approached £760m, more than the bank's capital, and still nobody reconciled whose positions they fed. The mark-to-market machine of chapter 2 was screaming the truth every evening; the governance chose not to listen.`
              : `${f(Math.abs(repPnl1), 0)} M¥ / ${f(yenLivre, 0)} = **${f(repVir, 1)} M£** virés cette semaine-là seulement — fin février, le cumul des virements de Londres approchait 760 M£, plus que le capital de la banque, et personne ne rapprochait encore les positions qu'ils nourrissaient. La machine du mark-to-market du chapitre 2 hurlait la vérité chaque soir ; la gouvernance a choisi de ne pas écouter.`,
          }],
          pieges: [en
            ? `"Margins are just deposits, the money is not lost" — variation margin is NOT a deposit: it settles a realised daily loss, definitively. Only initial margin comes back.`
            : `« Les marges ne sont que des dépôts, l'argent n'est pas perdu » — la marge de VARIATION n'est pas un dépôt : elle règle une perte quotidienne réalisée, définitivement. Seule la marge initiale se récupère.`],
        },
        {
          intitule: en ? 'c) Doubling at the bottom' : 'c) Doubler au creux',
          enonce: en
            ? `He adds ${f(n2k, 0)},000 contracts at ${f(p1, 0)} "because the market is wrong"; it grinds to ${f(p2, 0)}. What does this second leg cost on the ENLARGED position, in millions of pounds?`
            : `Il ajoute ${f(n2k, 0)} 000 contrats à ${f(p1, 0)} « parce que le marché se trompe » ; le marché moud jusqu'à ${f(p2, 0)}. Que coûte cette deuxième jambe sur la position AGRANDIE, en millions de livres ?`,
          reponse: repPnl2, tolerance: 0.01, unite: 'M£',
          etapes: [{
            titre: en ? 'The martingale of the losing trader' : 'La martingale du trader en perte',
            contenu: en
              ? `(${f(p2, 0)} − ${f(p1, 0)}) × 500 × ${f(nTot, 0)} / ${f(yenLivre, 0)}/£ = **£${f(repPnl2, 1)}m**. Averaging down turned a wound into a haemorrhage: the second drop strikes ${f(n1k + n2k, 0)},000 contracts, not ${f(n1k, 0)},000. A trader with honest books gets stopped out; a trader who IS the back office doubles — the hidden account did not just hide losses, it disabled the brake.`
              : `(${f(p2, 0)} − ${f(p1, 0)}) × 500 × ${f(nTot, 0)} / ${f(yenLivre, 0)} ¥/£ = **${f(repPnl2, 1)} M£**. Moyenner à la baisse a changé une plaie en hémorragie : la deuxième chute frappe ${f(n1k + n2k, 0)} 000 contrats, plus ${f(n1k, 0)} 000. Un trader aux livres honnêtes se fait couper ; un trader qui EST le back-office double — le compte caché ne cachait pas seulement des pertes, il désactivait le frein.`,
          }],
        },
        {
          intitule: en ? 'd) The sold volatility detonates' : 'd) La volatilité vendue détone',
          enonce: en
            ? `The ${f(nStrK, 0)},000 short straddles struck at ${f(strike, 0)} collected about ${f(prem, 0)} points each; the index sits at ${f(p2, 0)}. Net of premiums, what do they lose, in millions of pounds?`
            : `Les ${f(nStrK, 0)} 000 straddles vendeurs de strike ${f(strike, 0)} ont encaissé environ ${f(prem, 0)} points chacun ; l'indice est à ${f(p2, 0)}. Net des primes, que perdent-ils, en millions de livres ?`,
          reponse: repStrad, tolerance: 0.01, unite: 'M£',
          etapes: [
            {
              titre: en ? 'Insurance sold against the earthquake that happened' : "De l'assurance vendue contre le séisme qui a eu lieu",
              contenu: en
                ? `The sold put side is ${f(intrin, 0)} points in the money (${f(strike, 0)} − ${f(p2, 0)}); net of the ${f(prem, 0)} points collected: (${f(intrin, 0)} − ${f(prem, 0)}) × 500 × ${f(nStrK * 1000, 0)} / ${f(yenLivre, 0)} = **£${f(repStrad, 1)}m** of additional loss. He had sold straddles to collect premium and FINANCE the futures margins — a bet that the Nikkei would stay calm, stacked on a bet that it would rise.`
                : `La jambe put vendue est dans la monnaie de ${f(intrin, 0)} points (${f(strike, 0)} − ${f(p2, 0)}) ; net des ${f(prem, 0)} points encaissés : (${f(intrin, 0)} − ${f(prem, 0)}) × 500 × ${f(nStrK * 1000, 0)} / ${f(yenLivre, 0)} = **${f(repStrad, 1)} M£** de perte supplémentaire. Il avait vendu les straddles pour encaisser la prime et FINANCER les marges des futures — un pari que le Nikkei resterait calme, empilé sur un pari qu'il monterait.`,
            },
            {
              titre: en ? 'Why the two positions were one' : 'Pourquoi les deux positions n\'en étaient qu\'une',
              contenu: en
                ? `Long futures gains if the market rises; short straddle gains if it stays still: BOTH lose, together and violently, in one single scenario — a crash. The "diversified" book was a single concentrated short on disaster. Selling volatility collects small steady premiums against a rare devastating payout: insurance economics, run without an insurer's capital — remember that sentence, it returns in the corporate boss of this module.`
                : `Le long futures gagne si le marché monte ; le straddle vendu gagne s'il ne bouge pas : les DEUX perdent, ensemble et violemment, dans un seul scénario — le krach. Le book « diversifié » était un unique pari concentré contre le désastre. Vendre de la volatilité encaisse de petites primes régulières contre un paiement rare et dévastateur : l'économie d'un assureur, exploitée sans le capital d'un assureur — retenez la phrase, elle revient dans le boss corporate de ce module.`,
            },
          ],
          pieges: [en
            ? `Forgetting the premium overstates the option loss: the short straddle hurts only beyond the ${f(prem, 0)} points collected — which is also why it looks profitable for so long.`
            : `Oublier la prime exagère la perte optionnelle : le straddle vendu ne blesse qu'au-delà des ${f(prem, 0)} points encaissés — raison pour laquelle il a l'air rentable si longtemps.`],
        },
        {
          intitule: en ? 'e) The total, against the capital' : 'e) Le total, face au capital',
          enonce: en
            ? `Adding the £${f(pertesAnt, 0)}m already hidden, the Kobe week, the doubling and the straddles, what is the hole, in millions of pounds?`
            : `En ajoutant les ${f(pertesAnt, 0)} M£ déjà cachées, la semaine de Kobé, le doublement et les straddles, quel est le trou, en millions de livres ?`,
          reponse: repTotal, tolerance: 0.01, unite: 'M£',
          etapes: [{
            titre: en ? 'The arithmetic of a dead bank' : "L'arithmétique d'une banque morte",
            contenu: en
              ? `${f(pertesAnt, 0)} + ${f(repVir, 1)} + ${f(Math.abs(repPnl2), 1)} + ${f(repStrad, 1)} = **£${f(repTotal, 0)}m**, against roughly £440m of capital for the whole bank. The real tally reached £827m by the end — and Barings, 233 years old, banker to the Crown, was sold to ING over a weekend for one symbolic pound. No mispriced instrument anywhere in the story: only sizes nobody saw.`
              : `${f(pertesAnt, 0)} + ${f(repVir, 1)} + ${f(Math.abs(repPnl2), 1)} + ${f(repStrad, 1)} = **${f(repTotal, 0)} M£**, contre environ 440 M£ de capital pour la banque entière. Le décompte réel a atteint 827 M£ — et Barings, 233 ans, banquier de la Couronne, fut vendue à ING en un week-end pour une livre symbolique. Aucun instrument mal pricé dans toute l'histoire : seulement des tailles que personne ne voyait.`,
          }],
        },
        {
          intitule: en ? 'f) The leverage, in one number' : 'f) Le levier, en un nombre',
          enonce: en
            ? `From ${f(p0, 0)} to ${f(p2, 0)} the index lost ${pct(r1(Math.abs(chutePct)), 1)}; SIMEX initial margin ran near ${pct(margePct, 1)}. What did the move do to the margin stake, in %?`
            : `De ${f(p0, 0)} à ${f(p2, 0)}, l'indice a perdu ${pct(r1(Math.abs(chutePct)), 1)} ; la marge initiale SIMEX avoisinait ${pct(margePct, 1)}. Qu'a fait le mouvement à la mise de marge, en % ?`,
          reponse: repLevier, tolerance: 5, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'The ruin beyond the stake' : 'La ruine au-delà de la mise',
              contenu: en
                ? `${f(r1(chutePct), 1)} / (${f(margePct, 1)}/100) = **${f(repLevier, 0)} %** of the initial margin — the stake wiped out roughly ${f(r1(Math.abs(repLevier) / 100), 1)} times over, and every extra point payable in fresh cash the next morning. That is the −120% mechanism of the chapter, run at the scale of a bank.`
                : `${f(r1(chutePct), 1)} / (${f(margePct, 1)}/100) = **${f(repLevier, 0)} %** de la marge initiale — la mise effacée environ ${f(r1(Math.abs(repLevier) / 100), 1)} fois, et chaque point supplémentaire payable en cash frais dès le lendemain matin. C'est le mécanisme du −120 % du chapitre, joué à l'échelle d'une banque.`,
            },
            {
              titre: en ? 'The two lessons every desk recites' : 'Les deux leçons que tous les desks récitent',
              contenu: en
                ? `Leverage: a few percent of margin commands a hundredfold exposure, so SIZE, not direction, is the first risk decision. Controls: Leeson supervised himself — the same hands traded, settled and reported, and account 88888 lived eighteen months in that blind spot. Since then, separating front and back office is not best practice; it is the tombstone lesson of a 233-year-old bank. Note what did NOT fail: the clearing house, its margins and its waterfall held — the member died, the market opened on Monday.`
                : `Le levier : quelques pour cent de marge commandent une exposition au centuple, donc la TAILLE, pas la direction, est la première décision de risque. Les contrôles : Leeson se surveillait lui-même — les mêmes mains tradaient, réglaient et déclaraient, et le compte 88888 a vécu dix-huit mois dans cet angle mort. Depuis, séparer front et back-office n'est pas une bonne pratique ; c'est la leçon gravée sur la tombe d'une banque de 233 ans. Et voyez ce qui n'a PAS cédé : la chambre de compensation, ses marges et sa cascade ont tenu — le membre est mort, le marché a ouvert lundi.`,
            },
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 17. m7-pb-17 — Le desk de clearing dans le crash — BOSS N4          */
/* ------------------------------------------------------------------ */
const cascadeClearing: ProblemGenerator = {
  id: 'm7-pb-17', moduleId: M7,
  titre: 'Un membre tombe : la cascade de défaut de la chambre',
  titreEn: "A member goes down: the clearing house's default waterfall",
  typeDeCas: 'chambre de compensation',
  typeDeCasEn: 'central clearing',
  difficulte: 4,
  scenarios: ['Responsable du default management de la chambre', "Représentante d'un membre survivant au comité de défaut", 'Grand oral : dérouler la cascade couche par couche'],
  scenariosEn: ["Head of default management at the clearing house", "Surviving member's representative on the default committee", 'Final viva: walking the waterfall layer by layer'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const p0 = randInt(rng, 4700, 5300);
    const nK = randInt(rng, 15, 40); // milliers de contrats longs du défaillant
    const d1 = randFloat(rng, 5.5, 7.5, 1); // % de crash jour 1
    const d2 = randFloat(rng, 3, 4.5, 1); // % supplémentaires à la liquidation
    const imPct = randFloat(rng, 4.5, 5.5, 1);
    const fracC = randFloat(rng, 0.12, 0.2, 2);
    const fracK = randFloat(rng, 0.18, 0.3, 2);
    const partPct = randFloat(rng, 2, 6, 1);

    const N = nK * 1000;
    const p1 = r0(p0 * (1 - d1 / 100));
    const p2 = r0(p1 * (1 - d2 / 100));
    const notionnelM = (p0 * 10 * N) / 1e6;
    const imTotalM = (notionnelM * imPct) / 100;
    const maintTotalM = imTotalM * 0.75;
    const var1M = margeVariation(p0, p1, 10, N, 1) / 1e6;
    const soldeM = imTotalM + var1M;
    const appelM = appelDeMarge(soldeM, maintTotalM, imTotalM);
    const perteTotM = pnlFutures(p0, p2, 10, N, 1) / 1e6;
    const trouM = Math.abs(perteTotM) - imTotalM;
    const contribC = r0(trouM * fracC);
    const skinK = r0(trouM * fracK);
    const resteM = trouM - contribC - skinK;
    const factureM = (resteM * partPct) / 100;
    const chuteTotPct = ((p0 - p2) / p0) * 100;
    const repVar = r1(var1M);
    const repAppel = r1(appelM);
    const repPerte = r1(perteTotM);
    const repTrou = r1(trouM);
    const repReste = r1(resteM);
    const repFacture = r2(factureM);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `a proprietary trading member long ${f(nK, 0)},000 index futures at ${f(p0, 0)} points (€10 per point, about €${f(r0(notionnelM), 0)} million of notional); initial margin held by the house: ${pct(imPct, 1)} of notional (€${f(r1(imTotalM), 1)}m), maintenance at 75%; on crash day the settlement print is ${f(p1, 0)} (−${pct(d1, 1)}); the auction the next day clears the book at ${f(p2, 0)}; the defaulter's contribution to the default fund is €${f(contribC, 0)}m, the house's own "skin in the game" tranche €${f(skinK, 0)}m, and your bank funds ${pct(partPct, 1)} of the survivors' default fund`
      : `un membre de négociation pour compte propre, acheteur de ${f(nK, 0)} 000 futures sur indice à ${f(p0, 0)} points (10 € le point, environ ${f(r0(notionnelM), 0)} M€ de notionnel) ; marge initiale détenue par la chambre : ${pct(imPct, 1)} du notionnel (${f(r1(imTotalM), 1)} M€), maintenance à 75 % ; le jour du krach, le cours de compensation tombe à ${f(p1, 0)} (−${pct(d1, 1)}) ; l'enchère du lendemain liquide le book à ${f(p2, 0)} ; la contribution du défaillant au fonds de garantie vaut ${f(contribC, 0)} M€, la tranche « skin in the game » de la chambre ${f(skinK, 0)} M€, et votre banque finance ${pct(partPct, 1)} du fonds de garantie des survivants`;
    const contexte = (en
      ? [
        `You run default management at the clearing house, and tonight the machine built for 2008 gets its full-dress rehearsal: ${desc}. At 18:40 the member's treasurer stops returning calls; at 19:15 his CEO asks for "a few days". You do not have days — by novation, the house is the buyer to all his sellers, and tomorrow's settlements happen whether he exists or not.\n\nThe procedure is written, rehearsed yearly, and pitiless: declare the default at dawn, hedge the book, auction it to the surviving members, then burn the resources IN ORDER — the dead man's margins first, his default-fund contribution, the house's own tranche, and only then the survivors. Each layer has a number. The committee meets at 7:00; you walk in with all of them.`,
        `Your bank is a clearing member, and at 6:05 a.m. the secure line rings: another member has defaulted, the default committee convenes at 7:00, your seat is on it: ${desc}. Your CFO wants one thing before you enter: the worst-case bill for the bank, layer by layer, and where in the waterfall the burning stops.\n\nYou rebuild the night: the variation margin the defaulter could not pay, the call that went unanswered, the liquidation loss after the auction, and then the cascade — his collateral, his fund contribution, the house's skin in the game, and finally the mutualised slice that lands on members who did nothing wrong except survive. That last number is yours.`,
        `The examiner opens with the chapter's promise: "the clearing house is the buyer of every seller — show me what happens when a buyer dies." The data: ${desc}.\n\nHe wants the full anatomy: the evening margin flow, the unanswered call, the liquidation loss, then the waterfall consumed layer by layer down to the survivors' bill — and the two systemic lessons: why the margins are calibrated to lose only in extremes, and why concentrating risk in the house is both the solution and the new question. Lehman is the benchmark; quote it.`,
      ]
      : [
        `Vous dirigez le default management de la chambre de compensation, et cette nuit la machine construite pour 2008 passe sa répétition générale en conditions réelles : ${desc}. À 18 h 40, le trésorier du membre ne rappelle plus ; à 19 h 15, son directeur général demande « quelques jours ». Vous n'avez pas de jours — par la novation, la chambre est l'acheteuse de tous ses vendeurs, et les règlements de demain auront lieu qu'il existe ou non.\n\nLa procédure est écrite, répétée chaque année, et impitoyable : déclarer le défaut à l'aube, couvrir le book, le vendre aux enchères aux membres survivants, puis brûler les ressources DANS L'ORDRE — les marges du mort d'abord, sa contribution au fonds de garantie, la tranche propre de la chambre, et seulement ensuite les survivants. Chaque couche a un nombre. Le comité siège à 7 h ; vous entrez avec tous.`,
        `Votre banque est membre compensateur, et à 6 h 05 la ligne sécurisée sonne : un autre membre a fait défaut, le comité de défaut se réunit à 7 h, votre siège y est : ${desc}. Votre directeur financier veut une seule chose avant que vous n'entriez : la facture maximale pour la banque, couche par couche, et l'étage de la cascade où l'incendie s'arrête.\n\nVous reconstituez la nuit : la marge de variation que le défaillant n'a pas pu payer, l'appel resté sans réponse, la perte de liquidation après l'enchère, puis la cascade — son collatéral, sa contribution au fonds, le skin in the game de la chambre, et enfin la tranche mutualisée qui atterrit sur des membres qui n'ont rien fait de mal sinon survivre. Ce dernier nombre est le vôtre.`,
        `L'examinateur ouvre sur la promesse du chapitre : « la chambre est l'acheteuse de tous les vendeurs — montrez-moi ce qui se passe quand un acheteur meurt. » Les données : ${desc}.\n\nIl attend l'anatomie complète : le flux de marge du soir, l'appel sans réponse, la perte de liquidation, puis la cascade consommée couche par couche jusqu'à la facture des survivants — et les deux leçons systémiques : pourquoi les marges sont calibrées pour ne perdre que dans les extrêmes, et pourquoi concentrer le risque dans la chambre est à la fois la solution et la question nouvelle. Lehman est l'étalon ; citez-le.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The evening flow he cannot pay' : "a) Le flux du soir qu'il ne peut pas payer",
          enonce: en
            ? `At the ${f(p1, 0)} settlement, what variation margin does the member owe for the day, in millions of euros (negative = he pays)?`
            : `Au cours de compensation de ${f(p1, 0)}, quelle marge de variation le membre doit-il pour la journée, en millions d'euros (négatif = il paie) ?`,
          reponse: repVar, tolerance: 0.01, unite: 'M€',
          etapes: [{
            titre: en ? 'The mark-to-market spares no one' : 'Le mark-to-market n\'épargne personne',
            contenu: en
              ? `(${f(p1, 0)} − ${f(p0, 0)}) × 10 × ${f(N, 0)} = **${f(repVar, 1)} M€** owed in cash before tomorrow's open. A ${pct(d1, 1)} day is the kind of move initial margins are CALIBRATED on — one or two plausible sessions — which is exactly why this evening eats most of his cushion in one bite.`
              : `(${f(p1, 0)} − ${f(p0, 0)}) × 10 × ${f(N, 0)} = **${f(repVar, 1)} M€** dus en cash avant l'ouverture de demain. Une séance à −${f(d1, 1)} % est le type de mouvement sur lequel les marges initiales sont CALIBRÉES — une à deux séances plausibles — raison exacte pour laquelle ce soir mange l'essentiel de son coussin en une bouchée.`,
          }],
        },
        {
          intitule: en ? 'b) The call that goes unanswered' : "b) L'appel resté sans réponse",
          enonce: en
            ? `Margin account at €${f(r1(imTotalM), 1)}m initially, maintenance at €${f(r1(maintTotalM), 1)}m: what margin call does the house issue, in millions of euros?`
            : `Compte de marge à ${f(r1(imTotalM), 1)} M€ au départ, maintenance à ${f(r1(maintTotalM), 1)} M€ : quel appel de marge la chambre émet-elle, en millions d'euros ?`,
          reponse: repAppel, tolerance: 0.01, unite: 'M€',
          etapes: [{
            titre: en ? 'Trigger below maintenance, target at initial' : 'Déclencheur sous la maintenance, cible à l\'initiale',
            contenu: en
              ? `Balance = ${f(r1(imTotalM), 1)} − ${f(r1(Math.abs(repVar)), 1)} = ${f(r1(soldeM), 1)} M€ < ${f(r1(maintTotalM), 1)} M€: the call restores the INITIAL margin — ${f(r1(imTotalM), 1)} − ${f(r1(soldeM), 1)} = **${f(repAppel, 1)} M€**, due before the open. Note the identity: returning to initial means paying back exactly the day's loss. The wire never comes; at dawn the house declares the default and, by novation, steps into every one of his contracts.`
              : `Solde = ${f(r1(imTotalM), 1)} − ${f(r1(Math.abs(repVar)), 1)} = ${f(r1(soldeM), 1)} M€ < ${f(r1(maintTotalM), 1)} M€ : l'appel ramène à la marge INITIALE — ${f(r1(imTotalM), 1)} − ${f(r1(soldeM), 1)} = **${f(repAppel, 1)} M€**, exigibles avant l'ouverture. Notez l'identité : revenir à l'initiale, c'est payer exactement la perte du jour. Le virement ne vient jamais ; à l'aube, la chambre déclare le défaut et, par la novation, endosse chacun de ses contrats.`,
          }],
          pieges: [en
            ? `Calling only the gap to maintenance (€${f(r1(maintTotalM - soldeM), 1)}m) is the classic error: maintenance triggers, initial is the target.`
            : `N'appeler que l'écart à la maintenance (${f(r1(maintTotalM - soldeM), 1)} M€) est l'erreur classique : la maintenance déclenche, l'initiale est la cible.`],
        },
        {
          intitule: en ? 'c) The liquidation loss' : 'c) La perte de liquidation',
          enonce: en
            ? `The auction clears the book at ${f(p2, 0)}. From entry to liquidation, what is the defaulter's total loss, in millions of euros?`
            : `L'enchère liquide le book à ${f(p2, 0)}. De l'entrée à la liquidation, quelle est la perte totale du défaillant, en millions d'euros ?`,
          reponse: repPerte, tolerance: 0.01, unite: 'M€',
          etapes: [{
            titre: en ? 'The house sells into a falling market' : 'La chambre vend dans un marché qui tombe',
            contenu: en
              ? `(${f(p2, 0)} − ${f(p0, 0)}) × 10 × ${f(N, 0)} = **${f(repPerte, 1)} M€** — a total slide of ${pct(r1(chuteTotPct), 1)}: the crash day, plus the ${pct(d2, 1)} the forced auction concedes. That slippage is structural: liquidating a dead member's book means selling size, fast, to nervous buyers — the house hedges first precisely to shrink that bill.`
              : `(${f(p2, 0)} − ${f(p0, 0)}) × 10 × ${f(N, 0)} = **${f(repPerte, 1)} M€** — une glissade totale de ${pct(r1(chuteTotPct), 1)} : le jour du krach, plus les ${pct(d2, 1)} que l'enchère forcée concède. Ce slippage est structurel : liquider le book d'un membre mort, c'est vendre de la taille, vite, à des acheteurs nerveux — la chambre couvre d'abord précisément pour réduire cette facture.`,
          }],
        },
        {
          intitule: en ? 'd) Layer 1: the dead man pays first' : 'd) Couche 1 : le mort paie d\'abord',
          enonce: en
            ? `After burning the defaulter's €${f(r1(imTotalM), 1)}m of initial margin, what hole remains, in millions of euros?`
            : `Après avoir brûlé les ${f(r1(imTotalM), 1)} M€ de marge initiale du défaillant, quel trou reste-t-il, en millions d'euros ?`,
          reponse: repTrou, tolerance: 0.01, unite: 'M€',
          etapes: [{
            titre: en ? 'The waterfall opens' : 'La cascade s\'ouvre',
            contenu: en
              ? `${f(r1(Math.abs(repPerte)), 1)} − ${f(r1(imTotalM), 1)} = **${f(repTrou, 1)} M€**. The margins covered ${pct(imPct, 1)} of notional; the move took ${pct(r1(chuteTotPct), 1)}. In the immense majority of defaults — Lehman 2008 included, the full-scale test — the story ENDS at this layer, with margins to spare. Tonight is the tail: the house designed the next layers for exactly this night.`
              : `${f(r1(Math.abs(repPerte)), 1)} − ${f(r1(imTotalM), 1)} = **${f(repTrou, 1)} M€**. Les marges couvraient ${pct(imPct, 1)} du notionnel ; le mouvement a pris ${pct(r1(chuteTotPct), 1)}. Dans l'immense majorité des défauts — Lehman 2008 compris, le test grandeur nature —, l'histoire S'ARRÊTE à cette couche, avec des marges en reste. Cette nuit est la queue de distribution : la chambre a dessiné les couches suivantes exactement pour cette nuit-là.`,
          }],
        },
        {
          intitule: en ? "e) Layers 2 and 3: his fund money, then the house's blood" : 'e) Couches 2 et 3 : son fonds, puis le sang de la chambre',
          enonce: en
            ? `Burn the defaulter's €${f(contribC, 0)}m default-fund contribution, then the house's €${f(skinK, 0)}m skin in the game: what is left for the survivors, in millions of euros?`
            : `Brûlez les ${f(contribC, 0)} M€ de contribution du défaillant au fonds de garantie, puis les ${f(skinK, 0)} M€ de skin in the game de la chambre : que reste-t-il pour les survivants, en millions d'euros ?`,
          reponse: repReste, tolerance: 0.01, unite: 'M€',
          etapes: [
            {
              titre: en ? 'In order, never in parallel' : 'Dans l\'ordre, jamais en parallèle',
              contenu: en
                ? `${f(r1(repTrou), 1)} − ${f(contribC, 0)} − ${f(skinK, 0)} = **${f(repReste, 1)} M€**. The order is the design: defaulter's margins, defaulter's fund contribution, the house's OWN tranche — and only then other people's money.`
                : `${f(r1(repTrou), 1)} − ${f(contribC, 0)} − ${f(skinK, 0)} = **${f(repReste, 1)} M€**. L'ordre est le dessin même : marges du défaillant, sa contribution au fonds, la tranche PROPRE de la chambre — et seulement ensuite l'argent des autres.`,
            },
            {
              titre: en ? 'Why the house bleeds before the members' : 'Pourquoi la chambre saigne avant les membres',
              contenu: en
                ? `The skin in the game is small in euros and enormous in incentives: a house that eats losses before its members has every reason to calibrate margins seriously, refuse fragile members, and run honest auctions. Remove that tranche and the house becomes an insurer playing with other people's capital — the precise disease central clearing was built to cure.`
                : `Le skin in the game est petit en euros et énorme en incitations : une chambre qui perd avant ses membres a toutes les raisons de calibrer les marges sérieusement, de refuser les membres fragiles et de tenir des enchères honnêtes. Retirez cette tranche et la chambre devient un assureur jouant le capital des autres — précisément la maladie que la compensation centrale devait guérir.`,
            },
          ],
        },
        {
          intitule: en ? "f) Layer 4: the survivors' bill — yours" : 'f) Couche 4 : la facture des survivants — la vôtre',
          enonce: en
            ? `Your bank funds ${pct(partPct, 1)} of the survivors' default fund. What is its share of the remaining hole, in millions of euros?`
            : `Votre banque finance ${pct(partPct, 1)} du fonds de garantie des survivants. Quelle est sa part du trou restant, en millions d'euros ?`,
          reponse: repFacture, tolerance: 0.02, toleranceMode: 'absolu', unite: 'M€',
          etapes: [
            {
              titre: en ? 'Mutualisation, in cash' : 'La mutualisation, en cash',
              contenu: en
                ? `${f(r1(repReste), 1)} × ${f(partPct, 1)} % = **${f(repFacture)} M€**, debited from a bank that made no error — the price of belonging to a mutualised fortress. And the fund can be REPLENISHED: if the crisis claims a second member, the survivors are called again ("assessment powers"), which is why your CFO asked for the worst case, not the base case.`
                : `${f(r1(repReste), 1)} × ${f(partPct, 1)} % = **${f(repFacture)} M€**, débités d'une banque qui n'a commis aucune erreur — le prix de l'appartenance à une forteresse mutualisée. Et le fonds peut être RECOMPLÉTÉ : si la crise emporte un deuxième membre, les survivants sont rappelés (« assessment powers »), raison pour laquelle votre directeur financier demandait le pire cas, pas le cas central.`,
            },
            {
              titre: en ? 'The systemic verdict' : 'Le verdict systémique',
              contenu: en
                ? `The waterfall worked: a member died and the market opened on time — Lehman's portfolios were absorbed the same way in 2008, mostly within his own margins, while bilateral exposures spread the panic. But read the other side of the ledger: post-2008 regulation chased risk OUT of bank balance sheets and INTO a handful of clearing houses that are now too critical to fail by construction. The fortress has held so far; the entire edifice assumes it always will — that open question is the chapter's last word, and a favourite final viva thrust.`
                : `La cascade a fonctionné : un membre est mort et le marché a ouvert à l'heure — les portefeuilles de Lehman ont été absorbés ainsi en 2008, pour l'essentiel dans ses propres marges, pendant que les expositions bilatérales semaient la panique. Mais lisez l'autre colonne : la régulation post-2008 a chassé le risque HORS des bilans bancaires et DANS une poignée de chambres devenues trop critiques pour faillir, par construction. La forteresse a tenu jusqu'ici ; tout l'édifice suppose qu'elle tiendra toujours — cette question ouverte est le dernier mot du chapitre, et une botte favorite de fin d'oral.`,
            },
          ],
          pieges: [en
            ? `"The clearing house insures my market losses" — never: it guarantees PERFORMANCE of contracts, and your own losses remain yours, settled every evening. The waterfall only covers the hole a DEFAULTER leaves behind.`
            : `« La chambre assure mes pertes de marché » — jamais : elle garantit la BONNE FIN des contrats, et vos pertes restent les vôtres, réglées chaque soir. La cascade ne couvre que le trou qu'un DÉFAILLANT laisse derrière lui.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 18. m7-pb-18 — Le swap hérité — BOSS N4                             */
/* ------------------------------------------------------------------ */
const swapHerite: ProblemGenerator = {
  id: 'm7-pb-18', moduleId: M7,
  titre: "Le swap hérité : un book d'un autre monde de taux",
  titreEn: 'The inherited swap: a book from another rate world',
  typeDeCas: 'valorisation et risque de contrepartie',
  typeDeCasEn: 'valuation and counterparty risk',
  difficulte: 4,
  scenarios: ["Nouvelle responsable du desk swaps après l'acquisition", 'Auditeur de la mission post-fusion', 'Grand oral : valoriser, compresser, nover'],
  scenariosEn: ['New head of the swap desk after the acquisition', 'Auditor on the post-merger review', 'Final viva: value it, compress it, novate it'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const z1 = randFloat(rng, 2.6, 3.4, 1);
    const z2 = r1(z1 + randFloat(rng, 0.2, 0.5, 1));
    const z3 = r1(z2 + randFloat(rng, 0.1, 0.4, 1));
    const kFixe = randFloat(rng, 0.8, 1.8, 2); // fixe payé, signé à l'ère des taux bas
    const notM = pick(rng, [100, 150, 200] as const);
    const n2M = pick(rng, [40, 60, 80] as const); // swap inverse face à un dealer
    const recouv = randInt(rng, 30, 45); // % de récupération en cas de défaut
    const pd = randInt(rng, 3, 8); // % de probabilité de défaut sur la vie restante
    const imPct = randFloat(rng, 2, 4, 1);
    const fs = randFloat(rng, 0.8, 1.6, 1); // % de coût de financement du collatéral

    const courbe = [z1, z2, z3];
    const par = tauxSwapParitaire(courbe);
    const jambeM = valeurJambeFixe(kFixe, courbe, notM);
    const valM = valeurSwapPayeurFixe(kFixe, courbe, notM);
    const perteDefM = valM * (1 - recouv / 100);
    const reductionM = 2 * n2M;
    const netM = notM - n2M;
    const imM = (netM * imPct) / 100;
    const coutFinK = ((imM * fs) / 100) * 3 * 1000;
    const perteAttendueK = perteDefM * (pd / 100) * 1000;
    const repPar = r4(par);
    const repJambe = r2(jambeM);
    const repVal = r2(valM);
    const repPerte = r2(perteDefM);
    const repReduction = r0(reductionM);
    const repCout = r0(coutFinK);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `a swap where the bank PAYS ${pct(kFixe, 2)} fixed annually against the floating rate, €${f(notM, 0)} million notional, three years left, facing "Mécanord", an industrial client with NO collateral agreement; today's zero curve: ${pct(z1, 1)} / ${pct(z2, 1)} / ${pct(z3, 1)}; the book also holds a mirror-image swap RECEIVING fixed on €${f(n2M, 0)} million, same maturity, facing a dealer; estimated recovery if Mécanord defaults: ${f(recouv, 0)}%, default probability over the remaining life: ${pct(pd, 0)}; clearing the net dealer position would require ${pct(imPct, 1)} of initial margin, funded at ${pct(fs, 1)} a year`
      : `un swap où la banque PAIE ${pct(kFixe, 2)} de fixe annuel contre le taux variable, ${f(notM, 0)} M€ de notionnel, trois ans restants, face à « Mécanord », un client industriel SANS annexe de collatéral ; la courbe zéro du jour : ${pct(z1, 1)} / ${pct(z2, 1)} / ${pct(z3, 1)} ; le book porte aussi un swap miroir RECEVEUR du fixe sur ${f(n2M, 0)} M€, même maturité, face à un dealer ; récupération estimée si Mécanord fait défaut : ${f(recouv, 0)} %, probabilité de défaut sur la vie restante : ${pct(pd, 0)} ; compenser la position nette dealer exigerait ${pct(imPct, 1)} de marge initiale, financée à ${pct(fs, 1)} par an`;
    const contexte = (en
      ? [
        `Your bank has just absorbed a regional rival, and you inherit its swap book — built in the zero-rate years by a desk that no longer exists, documented in a spreadsheet last opened who knows when. The line that stops you: ${desc}.\n\nRates have climbed a world since that signature, so the position is worth something — but how much, owed by whom, and protected by what? Nothing, you discover: no CSA, no clearing, a 2008-style bilateral exposure sleeping in a 2020s balance sheet. Before the integration committee, you must produce the par rate, the mark-to-market, the loss if the client folds, what compression can tear up, and the price of dragging the rest into the clearing house. The committee wants numbers; the legacy spreadsheet offers vibes.`,
        `Post-merger audit, day three. The data room yields a derivative inventory with a footnote in 9-point font: "legacy swaps, valued at inception". At inception means zero; three years of rate hikes mean anything but: ${desc}.\n\nYour audit must answer the questions the seller hoped nobody would ask: what is this swap worth TODAY on today's curve, how much of that value evaporates if the uncollateralised client defaults, how much gross notional an honest compression would erase, and what it costs to put the net position behind a clearing house. Each answer changes the acquisition price; that is why you were sent.`,
        `The examiner hands you the chapter's full toolbox in one case: "a payer swap signed at ${pct(kFixe, 2)} in the low-rate era, three years left, the curve now at ${pct(z1, 1)}–${pct(z3, 1)} — run the desk." The data: ${desc}.\n\nHe wants the sequence a real desk runs: par rate, fixed-leg value, swap value with the sign explained by the rates-up-payer-wins reflex, expected loss on the naked counterparty, the compression arithmetic, and the clearing decision priced in cash. Six numbers, one coherent story — the swap chapter, lived.`,
      ]
      : [
        `Votre banque vient d'absorber une rivale régionale, et vous héritez de son book de swaps — construit dans les années de taux zéro par un desk qui n'existe plus, documenté dans un tableur ouvert pour la dernière fois on ne sait quand. La ligne qui vous arrête : ${desc}.\n\nLes taux ont grimpé d'un monde entier depuis cette signature, donc la position vaut quelque chose — mais combien, dû par qui, et protégé par quoi ? Par rien, découvrez-vous : pas de CSA, pas de compensation, une exposition bilatérale façon 2008 endormie dans un bilan des années 2020. Devant le comité d'intégration, vous devez produire le taux paritaire, le mark-to-market, la perte si le client plie, ce que la compression peut déchirer, et le prix du transfert du reste en chambre. Le comité veut des nombres ; le tableur hérité offre des impressions.`,
        `Audit post-fusion, troisième jour. La data room livre un inventaire de dérivés avec une note de bas de page en corps 9 : « swaps historiques, valorisés à l'initiation ». À l'initiation, cela veut dire zéro ; trois ans de hausses de taux veulent dire tout sauf cela : ${desc}.\n\nVotre audit doit répondre aux questions que le vendeur espérait ne jamais entendre : que vaut ce swap AUJOURD'HUI sur la courbe d'aujourd'hui, quelle part de cette valeur s'évapore si le client non collatéralisé fait défaut, combien de notionnel brut une compression honnête effacerait, et ce que coûte la mise en chambre de la position nette. Chaque réponse change le prix d'acquisition ; c'est pour cela qu'on vous a envoyé.`,
        `L'examinateur vous tend toute la boîte à outils du chapitre en un seul cas : « un swap payeur signé à ${pct(kFixe, 2)} à l'ère des taux bas, trois ans restants, la courbe désormais à ${pct(z1, 1)}–${pct(z3, 1)} — tenez le desk. » Les données : ${desc}.\n\nIl attend la séquence qu'un vrai desk déroule : taux paritaire, valeur de la jambe fixe, valeur du swap avec le signe expliqué par le réflexe « les taux montent, le payeur gagne », perte attendue sur la contrepartie nue, l'arithmétique de compression, et la décision de compensation chiffrée en cash. Six nombres, une seule histoire cohérente — le chapitre des swaps, vécu.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? "a) Today's par rate" : "a) Le paritaire d'aujourd'hui",
          enonce: en
            ? `On today's curve, what 3-year par swap rate would a new swap be signed at (4 decimals)?`
            : `Sur la courbe du jour, à quel taux de swap paritaire 3 ans un swap neuf se signerait-il (4 décimales) ?`,
          reponse: repPar, tolerance: 0.02, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The benchmark before any verdict' : 'L\'étalon avant tout verdict',
            contenu: en
              ? `$C^* = (1 - df_3)/\\sum df_i$ on the curve ${pct(z1, 1)}/${pct(z2, 1)}/${pct(z3, 1)} = **${pct(repPar, 4)}**. The inherited swap pays ${pct(kFixe, 2)} in a world that now charges ${pct(repPar, 4)}: before any computation, the SIGN of the value is already known — the bank pays well below market.`
              : `$C^* = (1 - df_3)/\\sum df_i$ sur la courbe ${pct(z1, 1)}/${pct(z2, 1)}/${pct(z3, 1)} = **${pct(repPar, 4)}**. Le swap hérité paie ${pct(kFixe, 2)} dans un monde qui facture désormais ${pct(repPar, 4)} : avant tout calcul, le SIGNE de la valeur est déjà connu — la banque paie très en dessous du marché.`,
          }],
        },
        {
          intitule: en ? 'b) The fixed leg, as a bond' : 'b) La jambe fixe, comme une obligation',
          enonce: en
            ? `What is the fixed leg worth (coupons at ${pct(kFixe, 2)} plus notional, discounted on the curve), in millions of euros?`
            : `Que vaut la jambe fixe (coupons à ${pct(kFixe, 2)} plus notionnel, actualisés sur la courbe), en millions d'euros ?`,
          reponse: repJambe, tolerance: 0.5, toleranceMode: 'absolu', unite: 'M€',
          etapes: [{
            titre: en ? 'A bond well below par' : 'Une obligation bien sous le pair',
            contenu: en
              ? `Fixed leg = ${f(notM, 0)} × ${f(kFixe, 2)} % × Σdf + ${f(notM, 0)} × df₃ = **${f(repJambe)} M€** — a ${pct(kFixe, 2)} coupon discounted on a ${pct(r4(par), 2)} curve trades far below par, exactly like the module 4 bond it is. The floating leg, just after fixing, is worth par: ${f(notM, 0)} M€, no forecast required.`
              : `Jambe fixe = ${f(notM, 0)} × ${f(kFixe, 2)} % × Σdf + ${f(notM, 0)} × df₃ = **${f(repJambe)} M€** — un coupon de ${pct(kFixe, 2)} actualisé sur une courbe à ${pct(r4(par), 2)} cote loin sous le pair, exactement comme l'obligation du module 4 qu'elle est. La jambe variable, juste après fixing, vaut le pair : ${f(notM, 0)} M€, aucune prévision nécessaire.`,
          }],
        },
        {
          intitule: en ? 'c) The swap value — and its sign' : 'c) La valeur du swap — et son signe',
          enonce: en
            ? `For the bank, payer of the fixed leg, what is the swap worth, in millions of euros?`
            : `Pour la banque, payeuse de la jambe fixe, que vaut le swap, en millions d'euros ?`,
          reponse: repVal, tolerance: 0.5, toleranceMode: 'absolu', unite: 'M€',
          etapes: [{
            titre: en ? 'Rates rose: the payer won' : 'Les taux ont monté : le payeur a gagné',
            contenu: en
              ? `V = notional − fixed leg = ${f(notM, 0)} − ${f(repJambe)} = **+${f(repVal)} M€**. The contractual ${pct(kFixe, 2)} never moved; the market's par rate climbed to ${pct(r4(par), 2)}: paying yesterday's fixed in today's world is a privilege, and the privilege has a price. The rates-up-payer-wins reflex, in euros.`
              : `V = notionnel − jambe fixe = ${f(notM, 0)} − ${f(repJambe)} = **+${f(repVal)} M€**. Le ${pct(kFixe, 2)} contractuel n'a jamais bougé ; le paritaire de marché est monté à ${pct(r4(par), 2)} : payer le fixe d'hier dans le monde d'aujourd'hui est un privilège, et le privilège a un prix. Le réflexe « les taux montent ⇒ le payeur fixe gagne », en euros.`,
          }],
          pieges: [en
            ? `"We pay interest, rates rose, we must be losing" reverses the sign: the fixed rate is CONTRACTUAL — what moved is the price of new swaps, and against them yours is cheap.`
            : `« On paie des intérêts, les taux ont monté, on doit perdre » inverse le signe : le taux fixe est CONTRACTUEL — ce qui a bougé, c'est le prix des swaps neufs, et face à eux le vôtre est bon marché.`],
        },
        {
          intitule: en ? 'd) The naked counterparty' : 'd) La contrepartie nue',
          enonce: en
            ? `That value is a claim on Mécanord, uncollateralised. If it defaults with ${f(recouv, 0)}% recovery, what does the bank lose, in millions of euros?`
            : `Cette valeur est une créance sur Mécanord, non collatéralisée. S'il fait défaut avec ${f(recouv, 0)} % de récupération, que perd la banque, en millions d'euros ?`,
          reponse: repPerte, tolerance: 0.5, toleranceMode: 'absolu', unite: 'M€',
          etapes: [
            {
              titre: en ? 'A positive value is a loan you never meant to make' : 'Une valeur positive est un prêt que vous n\'avez jamais voulu faire',
              contenu: en
                ? `Loss = ${f(repVal)} × (1 − ${f(recouv, 0)} %) = **${f(repPerte)} M€**. The swap's value IS the exposure: if the client dies, the in-the-money contract dies with him, and you re-hedge at market price. A CSA would have collected this value in collateral as it grew; "no annex, trusted client" is how 2008 balance sheets were written.`
                : `Perte = ${f(repVal)} × (1 − ${f(recouv, 0)} %) = **${f(repPerte)} M€**. La valeur du swap EST l'exposition : si le client meurt, le contrat dans la monnaie meurt avec lui, et vous vous recouvrez au prix du marché. Un CSA aurait collecté cette valeur en collatéral au fil de sa croissance ; « pas d'annexe, client de confiance » est la phrase avec laquelle les bilans de 2008 ont été écrits.`,
            },
            {
              titre: en ? 'The expected-loss reading' : 'La lecture en perte attendue',
              contenu: en
                ? `Weighted by the ${pct(pd, 0)} default probability, the expected loss is about ${f(r0(perteAttendueK), 0)} k€ — small against the ${f(repVal)} M€ of value, but it is a RISK number, priced and charged on real desks under the name CVA. Keep it: question f) weighs it against the cost of doing things properly.`
                : `Pondérée par les ${pct(pd, 0)} de probabilité de défaut, la perte attendue vaut environ ${f(r0(perteAttendueK), 0)} k€ — petite face aux ${f(repVal)} M€ de valeur, mais c'est un nombre de RISQUE, pricé et facturé sur les vrais desks sous le nom de CVA. Gardez-le : la question f) le pèse contre le coût de faire les choses proprement.`,
            },
          ],
        },
        {
          intitule: en ? 'e) What compression can tear up' : 'e) Ce que la compression peut déchirer',
          enonce: en
            ? `The book pays fixed on €${f(notM, 0)}m and receives fixed on €${f(n2M, 0)}m, same maturity. Compressing to the net position, how much GROSS notional disappears, in millions of euros?`
            : `Le book paie le fixe sur ${f(notM, 0)} M€ et le reçoit sur ${f(n2M, 0)} M€, même maturité. En compressant vers la position nette, combien de notionnel BRUT disparaît, en millions d'euros ?`,
          reponse: repReduction, tolerance: 0.5, toleranceMode: 'absolu', unite: 'M€',
          etapes: [{
            titre: en ? 'Same net risk, smaller map' : 'Même risque net, carte plus petite',
            contenu: en
              ? `Gross ${f(notM, 0)} + ${f(n2M, 0)} = ${f(notM + n2M, 0)} M€ collapses to a net payer position of ${f(netM, 0)} M€: **${f(repReduction, 0)} M€** of notional torn up, zero change in net rate risk (the residual value of each contract is settled in cash at tear-up). This is why headline notionals in the hundreds of trillions measure paperwork, not risk — compression services shred them by the trillion while DV01 stands still.`
              : `Le brut ${f(notM, 0)} + ${f(n2M, 0)} = ${f(notM + n2M, 0)} M€ s'effondre en une position payeuse nette de ${f(netM, 0)} M€ : **${f(repReduction, 0)} M€** de notionnel déchirés, zéro changement de risque de taux net (la valeur résiduelle de chaque contrat se règle en cash à la résiliation). Voilà pourquoi les notionnels en centaines de milliers de milliards mesurent de la paperasse, pas du risque — les services de compression en broient par milliers de milliards pendant que la DV01 ne bouge pas.`,
          }],
          pieges: [en
            ? `Netting the VALUES of the two swaps is not compression: compression cancels CONTRACTS. The risk lives in the net DV01 either way; what shrinks is operational and counterparty surface.`
            : `Compenser les VALEURS des deux swaps n'est pas la compression : la compression annule des CONTRATS. Le risque vit dans la DV01 nette de toute façon ; ce qui rétrécit, c'est la surface opérationnelle et de contrepartie.`],
        },
        {
          intitule: en ? 'f) The clearing decision, in cash' : 'f) La décision de compensation, en cash',
          enonce: en
            ? `Novating the net €${f(netM, 0)}m to the clearing house requires ${pct(imPct, 1)} of initial margin funded at ${pct(fs, 1)} a year. What does that funding cost over the three remaining years, in thousands of euros?`
            : `Nover les ${f(netM, 0)} M€ nets vers la chambre exige ${pct(imPct, 1)} de marge initiale financée à ${pct(fs, 1)} par an. Que coûte ce financement sur les trois années restantes, en milliers d'euros ?`,
          reponse: repCout, tolerance: 15, toleranceMode: 'absolu', unite: 'k€',
          etapes: [
            {
              titre: en ? 'The price of the fortress' : 'Le prix de la forteresse',
              contenu: en
                ? `IM = ${f(netM, 0)} × ${f(imPct, 1)} % = ${f(r2(imM))} M€ posted; funding = ${f(r2(imM))} × ${f(fs, 1)} % × 3 years = **${f(repCout, 0)} k€**. Novation replaces your counterparty with the clearing house — the chapter's machine of trust — but the machine eats cash: initial margin immobilised, variation margin breathing every evening.`
                : `MI = ${f(netM, 0)} × ${f(imPct, 1)} % = ${f(r2(imM))} M€ déposés ; financement = ${f(r2(imM))} × ${f(fs, 1)} % × 3 ans = **${f(repCout, 0)} k€**. La novation remplace votre contrepartie par la chambre — la machine de confiance du chapitre — mais la machine mange du cash : marge initiale immobilisée, marge de variation qui respire chaque soir.`,
            },
            {
              titre: en ? 'The real trade-off the committee must hear' : 'Le vrai arbitrage que le comité doit entendre',
              contenu: en
                ? `Set the two bills side by side: staying bilateral on Mécanord carries about ${f(r0(perteAttendueK), 0)} k€ of expected default loss (and the tail risk of the full ${f(repPerte)} M€); clearing the dealer leg costs ${f(repCout, 0)} k€ of certain funding. Post-2008 regulation chose for you on the interbank side — mandatory clearing — while the corporate stays bilateral, usually exempt. The lesson that survives the case: derivatives transfer risk, never destroy it; here credit risk was traded for liquidity cost, and a desk that cannot name BOTH numbers is not managing either.`
                : `Posez les deux factures côte à côte : rester bilatéral sur Mécanord porte environ ${f(r0(perteAttendueK), 0)} k€ de perte attendue au défaut (et le risque extrême des ${f(repPerte)} M€ entiers) ; compenser la jambe dealer coûte ${f(repCout, 0)} k€ de financement certain. La régulation post-2008 a choisi pour vous côté interbancaire — compensation obligatoire — pendant que le corporate reste bilatéral, le plus souvent exempté. La leçon qui survit au cas : le dérivé transfère le risque, il ne le détruit jamais ; ici, du risque de crédit a été troqué contre du coût de liquidité, et un desk incapable de nommer les DEUX nombres ne gère ni l'un ni l'autre.`,
            },
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 19. m7-pb-19 — Le basis trade qui dérape — BOSS N4                  */
/* ------------------------------------------------------------------ */
const basisTradeDerape: ProblemGenerator = {
  id: 'm7-pb-19', moduleId: M7,
  titre: 'Le basis trade qui dérape : quand la convergence recule',
  titreEn: 'The basis trade that breaks: when convergence runs backwards',
  typeDeCas: 'arbitrage cash-futures et levier',
  typeDeCasEn: 'cash-futures arbitrage and leverage',
  difficulte: 4,
  scenarios: ["Gérante du fonds la semaine où la base s'écarte", 'Risk officer du prime broker face à la position', 'Grand oral : anatomie du trade « sans risque » qui tue'],
  scenariosEn: ['Fund manager the week the basis widens', "Prime broker's risk officer facing the position", 'Final viva: anatomy of the "riskless" trade that kills'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const pM = pick(rng, [500, 800, 1000, 1500] as const); // M€ d'obligations en portefeuille
    const haircut = randFloat(rng, 1.5, 3, 1);
    const bConv = randFloat(rng, 0.2, 0.45, 2); // % de convergence attendue
    const f0 = randFloat(rng, 124, 136, 2);
    const saut = randFloat(rng, 2, 4, 2); // points de hausse du futures
    const wBase = randFloat(rng, 0.35, 0.7, 2); // % d'écartement net de la base
    const h2 = r1(haircut + randFloat(rng, 1, 2, 1));

    const f1 = r2(f0 + saut);
    const equityM = (pM * haircut) / 100;
    const roe = effetLevier(bConv, haircut);
    const nCtr = nombreContratsCouverture(pM, f0, 1000);
    const varFutM = margeVariation(f0, f1, 1000, nCtr, -1) / 1e6;
    const gPct = r2((saut / f0) * 100 - wBase);
    const gainCashM = (pM * gPct) / 100;
    const netM = gainCashM + varFutM;
    const pertePctEq = (netM / equityM) * 100;
    const collatSupM = ((h2 - haircut) / 100) * pM;
    const drainM = Math.abs(varFutM) + collatSupM;
    const repEq = r1(equityM);
    const repRoe = r1(roe);
    const repN = nCtr;
    const repVarFut = r1(varFutM);
    const repNet = r2(netM);
    const repCollat = r1(collatSupM);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `€${f(pM, 0)} million of government bonds held LONG in cash, financed in repo with a ${pct(haircut, 1)} haircut (the fund's only equity); the same exposure SHORT via bond futures (€100,000 notional per contract, €1,000 per point) at ${f(f0, 2)}; the cash bonds trade slightly cheap to the futures, and the expected convergence by expiry is worth ${pct(bConv, 2)} of the notional; then the storm week: flight to quality, the futures leaps to ${f(f1, 2)} while the cash bonds, suddenly shunned, gain only ${pct(gPct, 2)} — the basis WIDENS by ${pct(wBase, 2)} instead of converging; the repo desk raises the haircut to ${pct(h2, 1)}`
      : `${f(pM, 0)} M€ d'obligations d'État détenues LONGUES au comptant, financées en repo avec une décote (haircut) de ${pct(haircut, 1)} (les seuls fonds propres du fonds) ; la même exposition VENDUE via des futures obligataires (100 000 € de notionnel par contrat, 1 000 € le point) à ${f(f0, 2)} ; le comptant cote légèrement moins cher que le futures, et la convergence attendue d'ici l'échéance vaut ${pct(bConv, 2)} du notionnel ; puis la semaine de tempête : fuite vers la qualité, le futures bondit à ${f(f1, 2)} pendant que le comptant, soudain boudé, ne gagne que ${pct(gPct, 2)} — la base S'ÉCARTE de ${pct(wBase, 2)} au lieu de converger ; le desk repo monte le haircut à ${pct(h2, 1)}`;
    const contexte = (en
      ? [
        `Your fund runs the most respectable trade in fixed income: long the bond, short its futures, pocket the certain convergence of the basis at expiry — "picking up coins in front of a glacier", your investor letter says. The position: ${desc}.\n\nThe glacier just moved. Tonight the futures leg pays variation margin in cash while the bonds' paper gain pays nothing; tomorrow the repo desk wants more collateral on top. Your investors believe they own an arbitrage; you must now compute what they actually own: a leveraged liquidity bet — equity, promised return, the week's true P&L, and the cash drain that decides whether the fund sees the convergence it was right about.`,
        `You sit on the prime brokerage risk desk, and one client file has turned red overnight: ${desc}.\n\nThe client will call at 8:00 to argue that "the trade is riskless at expiry — the basis MUST converge". He is right, and it is irrelevant: between now and expiry stand margin calls in cash, a haircut hike, and a fund whose entire equity is ${pct(haircut, 1)} of the position. Your decision — extend or cut — needs the same numbers the examiner would demand: the leverage, the seduction, the week's damage in euros and in percent of equity, and the extra collateral that may finish the job.`,
        `The examiner smiles the way they smile before the last boss: "long cash bonds, short futures, repo leverage — the trade that nearly broke the Treasury market in March 2020. Walk me through how an arbitrage kills." The data: ${desc}.\n\nHe wants the canonical chain: the equity a haircut implies, the return that leverage promises, the size of the futures leg, the margin call on storm night, the net loss when convergence runs BACKWARDS, the collateral hike — and the conclusion that points at module 11: the trade dies of liquidity precisely when it is right about value.`,
      ]
      : [
        `Votre fonds porte le trade le plus respectable du fixed income : long l'obligation, short son futures, encaisser la convergence certaine de la base à l'échéance — « ramasser des pièces devant un glacier », dit votre lettre aux investisseurs. La position : ${desc}.\n\nLe glacier vient de bouger. Ce soir, la jambe futures paie des marges de variation en cash pendant que le gain papier des obligations ne paie rien ; demain, le desk repo veut du collatéral en plus. Vos investisseurs croient détenir un arbitrage ; vous devez maintenant calculer ce qu'ils détiennent vraiment : un pari de liquidité levié — fonds propres, rendement promis, vrai P&L de la semaine, et la ponction de cash qui décide si le fonds verra la convergence sur laquelle il avait raison.`,
        `Vous êtes au desk des risques du prime broker, et un dossier client a viré au rouge dans la nuit : ${desc}.\n\nLe client appellera à 8 h pour plaider que « le trade est sans risque à l'échéance — la base DOIT converger ». Il a raison, et c'est sans importance : entre ici et l'échéance se dressent des appels de marge en cash, une hausse de haircut, et un fonds dont les fonds propres entiers font ${pct(haircut, 1)} de la position. Votre décision — étendre ou couper — exige les nombres qu'un examinateur demanderait : le levier, la séduction, les dégâts de la semaine en euros et en pourcentage des fonds propres, et le collatéral supplémentaire qui peut achever le travail.`,
        `L'examinateur sourit comme on sourit avant le dernier boss : « long obligations au comptant, short futures, levier repo — le trade qui a failli casser le marché des Treasuries en mars 2020. Montrez-moi comment un arbitrage tue. » Les données : ${desc}.\n\nIl attend la chaîne canonique : les fonds propres qu'implique un haircut, le rendement que promet le levier, la taille de la jambe futures, l'appel de marge le soir de tempête, la perte nette quand la convergence RECULE, la hausse de collatéral — et la conclusion qui pointe vers le module 11 : le trade meurt de liquidité précisément quand il a raison sur la valeur.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The equity a haircut implies' : 'a) Les fonds propres qu\'implique un haircut',
          enonce: en
            ? `With a ${pct(haircut, 1)} repo haircut on €${f(pM, 0)}m of bonds, how much equity does the fund commit, in millions of euros?`
            : `Avec un haircut repo de ${pct(haircut, 1)} sur ${f(pM, 0)} M€ d'obligations, combien de fonds propres le fonds engage-t-il, en millions d'euros ?`,
          reponse: repEq, tolerance: 0.2, toleranceMode: 'absolu', unite: 'M€',
          etapes: [{
            titre: en ? 'The repo lends everything but the haircut' : 'Le repo prête tout sauf la décote',
            contenu: en
              ? `Equity = ${f(pM, 0)} × ${f(haircut, 1)} % = **${f(repEq, 1)} M€**: the repo desk finances the other ${pct(r1(100 - haircut), 1)} against the bonds as collateral. Leverage = 100/${f(haircut, 1)} ≈ ×${f(r0(100 / haircut), 0)} — a sliver of capital steering a battleship of bonds. Note who grants the leverage: the same repo desk that can re-price it tomorrow.`
              : `Fonds propres = ${f(pM, 0)} × ${f(haircut, 1)} % = **${f(repEq, 1)} M€** : le desk repo finance les ${pct(r1(100 - haircut), 1)} restants contre les obligations en collatéral. Levier = 100/${f(haircut, 1)} ≈ ×${f(r0(100 / haircut), 0)} — un copeau de capital qui pilote un cuirassé d'obligations. Notez qui accorde le levier : le même desk repo qui peut le repricer demain.`,
          }],
        },
        {
          intitule: en ? 'b) The seduction' : 'b) La séduction',
          enonce: en
            ? `If the basis converges as expected (${pct(bConv, 2)} of notional), what return on equity does the trade deliver, in %?`
            : `Si la base converge comme prévu (${pct(bConv, 2)} du notionnel), quel rendement sur fonds propres le trade délivre-t-il, en % ?`,
          reponse: repRoe, tolerance: 1, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Tiny edge times huge lever' : 'Micro-écart fois méga-levier',
            contenu: en
              ? `${f(bConv, 2)} / (${f(haircut, 1)}/100) = **${pct(repRoe, 1)}** on equity, for a gap that converges by construction at expiry — the futures becomes spot, the basis dies at zero. This is why the trade raises billions: the edge is almost certain. What the marketing omits: the SAME multiplier applies to the path before expiry.`
              : `${f(bConv, 2)} / (${f(haircut, 1)}/100) = **${pct(repRoe, 1)}** sur fonds propres, pour un écart qui converge par construction à l'échéance — le futures devient du spot, la base meurt à zéro. Voilà pourquoi le trade lève des milliards : le gain est presque certain. Ce que le marketing omet : le MÊME multiplicateur s'applique au chemin d'ici l'échéance.`,
          }],
        },
        {
          intitule: en ? 'c) The futures leg' : 'c) La jambe futures',
          enonce: en
            ? `To carry the short against €${f(pM, 0)}m of bonds at a futures price of ${f(f0, 2)}, how many contracts does the fund sell?`
            : `Pour porter le short face aux ${f(pM, 0)} M€ d'obligations avec un futures à ${f(f0, 2)}, combien de contrats le fonds vend-il ?`,
          reponse: repN, tolerance: 2, toleranceMode: 'absolu', unite: en ? 'contracts' : 'contrats',
          etapes: [{
            titre: en ? 'Exposure over contract value' : 'Exposition sur valeur du contrat',
            contenu: en
              ? `One contract = ${f(f0, 2)} points × 1,000 € = ${f(r0(f0 * 1000), 0)} €; N = ${f(pM, 0)} 000 000 / ${f(r0(f0 * 1000), 0)} = **${f(repN, 0)} contracts** sold. The package is market-neutral in DIRECTION — rates up or down, the two legs offset — and exposed to exactly one thing: the SPREAD between cash and futures. That residual is the whole trade.`
              : `Un contrat = ${f(f0, 2)} points × 1 000 € = ${f(r0(f0 * 1000), 0)} € ; N = ${f(pM, 0)} 000 000 / ${f(r0(f0 * 1000), 0)} = **${f(repN, 0)} contrats** vendus. Le montage est neutre en DIRECTION — taux en hausse ou en baisse, les deux jambes se compensent — et exposé à exactement une chose : l'ÉCART entre comptant et futures. Ce résidu est tout le trade.`,
          }],
        },
        {
          intitule: en ? 'd) Storm night: the cash call' : 'd) Soir de tempête : l\'appel en cash',
          enonce: en
            ? `Flight to quality: the futures settles at ${f(f1, 2)}. What variation margin does the SHORT leg owe tonight, in millions of euros (negative = cash out)?`
            : `Fuite vers la qualité : le futures compense à ${f(f1, 2)}. Quelle marge de variation la jambe SHORT doit-elle ce soir, en millions d'euros (négatif = sortie de cash) ?`,
          reponse: repVarFut, tolerance: 0.2, toleranceMode: 'absolu', unite: 'M€',
          etapes: [{
            titre: en ? 'Paper gains pay nothing; margins are cash' : 'Les gains papier ne paient rien ; les marges sont du cash',
            contenu: en
              ? `(${f(f1, 2)} − ${f(f0, 2)}) × 1,000 × ${f(repN, 0)} × (−1) = **${f(repVarFut, 1)} M€** wired to the clearing house tonight. The bonds gained ${pct(gPct, 2)} on paper — but a bond's appreciation is not a bank transfer, and the repo lender keeps the bonds. Metallgesellschaft's asymmetry, rebuilt in government paper: cash losses against latent gains.`
              : `(${f(f1, 2)} − ${f(f0, 2)}) × 1 000 × ${f(repN, 0)} × (−1) = **${f(repVarFut, 1)} M€** virés à la chambre ce soir. Les obligations ont gagné ${pct(gPct, 2)} sur le papier — mais l'appréciation d'une obligation n'est pas un virement bancaire, et le prêteur repo garde les titres. L'asymétrie de Metallgesellschaft, reconstruite en papier d'État : pertes cash contre gains latents.`,
          }],
        },
        {
          intitule: en ? 'e) The week\'s truth: the basis widened' : 'e) La vérité de la semaine : la base s\'est écartée',
          enonce: en
            ? `Bonds +${pct(gPct, 2)} on €${f(pM, 0)}m, futures leg as computed: what is the package's net P&L for the week, in millions of euros?`
            : `Obligations +${pct(gPct, 2)} sur ${f(pM, 0)} M€, jambe futures comme calculée : quel est le P&L net du montage sur la semaine, en millions d'euros ?`,
          reponse: repNet, tolerance: 0.3, toleranceMode: 'absolu', unite: 'M€',
          etapes: [
            {
              titre: en ? 'Two big legs, one small poisonous net' : 'Deux grandes jambes, un petit net vénéneux',
              contenu: en
                ? `${f(r2(gainCashM))} (bonds) + ${f(repVarFut, 1)} (futures) = **${f(repNet)} M€**: the basis moved ${pct(wBase, 2)} AGAINST the trade. On ${f(repEq, 1)} M€ of equity, that is ${pct(r1(pertePctEq), 1)} — the leverage of question b), now running in reverse: −${f(wBase, 2)} % times ×${f(r0(100 / haircut), 0)}.`
                : `${f(r2(gainCashM))} (obligations) + ${f(repVarFut, 1)} (futures) = **${f(repNet)} M€** : la base a bougé de ${pct(wBase, 2)} CONTRE le trade. Sur ${f(repEq, 1)} M€ de fonds propres, cela fait ${pct(r1(pertePctEq), 1)} — le levier de la question b), tournant désormais à l'envers : −${f(wBase, 2)} % fois ×${f(r0(100 / haircut), 0)}.`,
            },
            {
              titre: en ? 'Right at expiry, dead before' : "Raison à l'échéance, mort avant",
              contenu: en
                ? `Nothing about expiry changed: the basis will still die at zero, the convergence gain is still there for whoever can HOLD. But a basis can widen before it converges, and the leverage that turned ${pct(bConv, 2)} into ${pct(repRoe, 1)} turns ${pct(wBase, 2)} into ${pct(r1(Math.abs(pertePctEq)), 1)} of equity. LTCM, 1998: the same sentence, written in convergence trades.`
                : `Rien n'a changé sur l'échéance : la base mourra toujours à zéro, le gain de convergence reste là pour qui peut TENIR. Mais une base peut s'écarter avant de converger, et le levier qui transformait ${pct(bConv, 2)} en ${pct(repRoe, 1)} transforme ${pct(wBase, 2)} en ${pct(r1(Math.abs(pertePctEq)), 1)} des fonds propres. LTCM, 1998 : la même phrase, écrite en trades de convergence.`,
            },
          ],
          pieges: [en
            ? `"The two legs hedge each other, the week is flat" forgets what is being traded: the package is short the BASIS, and the basis is exactly what moved.`
            : `« Les deux jambes se couvrent, la semaine est plate » oublie ce qui est tradé : le montage est short la BASE, et la base est exactement ce qui a bougé.`],
        },
        {
          intitule: en ? 'f) The haircut hike — and the spiral' : 'f) La hausse de haircut — et la spirale',
          enonce: en
            ? `The repo desk lifts the haircut from ${pct(haircut, 1)} to ${pct(h2, 1)}. How much additional collateral must the fund post, in millions of euros?`
            : `Le desk repo monte le haircut de ${pct(haircut, 1)} à ${pct(h2, 1)}. Combien de collatéral supplémentaire le fonds doit-il déposer, en millions d'euros ?`,
          reponse: repCollat, tolerance: 0.3, toleranceMode: 'absolu', unite: 'M€',
          etapes: [
            {
              titre: en ? 'The lender re-prices the leverage at the worst moment' : 'Le prêteur reprice le levier au pire moment',
              contenu: en
                ? `(${f(h2, 1)} − ${f(haircut, 1)}) % × ${f(pM, 0)} = **${f(repCollat, 1)} M€** of fresh cash, on top of the ${f(r1(Math.abs(repVarFut)), 1)} M€ of margins: total drain ≈ ${f(r1(drainM), 1)} M€ against ${f(repEq, 1)} M€ of initial equity, already wounded by ${f(r2(Math.abs(repNet)))} M€. The exits are forced sales of bonds — into a market that is shunning them, which widens the basis further, which calls more margin: the spiral has its own name on every risk desk, the doom loop.`
                : `(${f(h2, 1)} − ${f(haircut, 1)}) % × ${f(pM, 0)} = **${f(repCollat, 1)} M€** de cash frais, en plus des ${f(r1(Math.abs(repVarFut)), 1)} M€ de marges : ponction totale ≈ ${f(r1(drainM), 1)} M€ face à ${f(repEq, 1)} M€ de fonds propres initiaux, déjà entamés de ${f(r2(Math.abs(repNet)))} M€. Les sorties sont des ventes forcées d'obligations — dans un marché qui les boude, ce qui écarte la base davantage, ce qui appelle plus de marge : la spirale a son nom sur tous les desks de risque, la boucle infernale.`,
            },
            {
              titre: en ? 'March 2020 — and the door to module 11' : 'Mars 2020 — et la porte du module 11',
              contenu: en
                ? `This is not a thought experiment: in March 2020, the dash for cash hit leveraged Treasury basis funds exactly here — margins and haircuts on both legs at once — and their forced unwinding helped break the deepest market on Earth, until the Federal Reserve bought Treasuries by the hundreds of billions to restore order. An "arbitrage" large enough becomes the market it arbitrages: that systemic turn — who deleverages, who absorbs, who prints — is the subject module 11 picks up where this module leaves you.`
                : `Ceci n'est pas une expérience de pensée : en mars 2020, la ruée vers le cash a frappé les fonds de base Treasuries leviés exactement ici — marges et haircuts sur les deux jambes à la fois — et leur débouclage forcé a contribué à casser le marché le plus profond du monde, jusqu'à ce que la Réserve fédérale achète des Treasuries par centaines de milliards pour rétablir l'ordre. Un « arbitrage » assez gros devient le marché qu'il arbitre : ce basculement systémique — qui se délevier, qui absorbe, qui imprime — est le sujet que le module 11 reprend là où celui-ci vous laisse.`,
            },
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 20. m7-pb-20 — Le corporate qui « optimise » — BOSS N4              */
/* ------------------------------------------------------------------ */
const corporateOptimise: ProblemGenerator = {
  id: 'm7-pb-20', moduleId: M7,
  titre: "Le corporate qui « optimise » : vendre l'assurance sans le capital",
  titreEn: 'The corporate that "optimises": selling insurance without the capital',
  typeDeCas: 'FRA, spéculation et gouvernance',
  typeDeCasEn: 'FRAs, speculation and governance',
  difficulte: 4,
  scenarios: ['Nouvelle trésorière qui découvre le montage', "Administrateur au comité d'audit", "Grand oral : l'anti-couverture démontée"],
  scenariosEn: ['New treasurer discovering the scheme', 'Board member on the audit committee', 'Final viva: the anti-hedge dismantled'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const rCourt = randFloat(rng, 2.2, 2.9, 1); // taux 6 mois à l'époque du montage
    const rLong = r1(rCourt + randFloat(rng, 0.3, 0.6, 1)); // taux 12 mois
    const notM = pick(rng, [30, 50, 80] as const);
    const qRest = randInt(rng, 4, 6); // fixings semestriels restants
    const hausse = randFloat(rng, 1.2, 2.2, 1); // de combien les fixings dépassent K
    const fracT = randFloat(rng, 0.3, 0.6, 2); // tampon de trésorerie, fraction du total

    const kFra = tauxForwardImplicite(rCourt, 0.5, rLong, 1);
    const kR = r4(kFra);
    const revenuSem = -reglementFra(notM, kR, rCourt, 0.5); // positif : le short encaisse
    const revenuAn = 2 * revenuSem;
    const r1New = r2(kR + hausse);
    const paiementSem = reglementFra(notM, kR, r1New, 0.5); // positif : ce que le short PAIE
    const totalM = (qRest * paiementSem) / 1e6;
    const ratio = (qRest * paiementSem) / revenuAn;
    const tamponM = r1(totalM * fracT);
    const manqueM = totalM - tamponM;
    const repK = kR;
    const repRevenuAn = r0(revenuAn / 1000);
    const repPaiement = r0(paiementSem / 1000);
    const repTotal = r2(totalM);
    const repRatio = r1(ratio);
    const repManque = r2(manqueM);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `for two years, the previous treasurer SOLD strips of 6-month FRAs on €${f(notM, 0)} million of notional — short the FRA, receiver of the fixed rate — at the market rate of the time, when the money curve quoted ${pct(rCourt, 1)} at 6 months and ${pct(rLong, 1)} at 12 months; every semester the fixing stayed near ${pct(rCourt, 1)}, and the settlements landed as "treasury income"; then the central bank hiked hard: the fixings now print at ${pct(r1New, 2)}, ${qRest} semiannual fixings remain, the treasury buffer is €${f(tamponM, 2)}m — and the company's own debt is at FLOATING rate`
      : `pendant deux ans, le trésorier précédent a VENDU des strips de FRA 6 mois sur ${f(notM, 0)} M€ de notionnel — short le FRA, receveur du taux fixe — au taux de marché de l'époque, quand la courbe monétaire cotait ${pct(rCourt, 1)} à 6 mois et ${pct(rLong, 1)} à 12 mois ; chaque semestre, le fixing restait proche de ${pct(rCourt, 1)}, et les règlements tombaient en « produits de trésorerie » ; puis la banque centrale a frappé fort : les fixings sortent désormais à ${pct(r1New, 2)}, il reste ${qRest} fixings semestriels, le tampon de trésorerie vaut ${f(tamponM, 2)} M€ — et la dette de l'entreprise est elle-même à taux VARIABLE`;
    const contexte = (en
      ? [
        `First week in the job, and the handover file contains a folder your predecessor labelled "yield enhancement": ${desc}.\n\nThe CFO loved the folder — a quiet income line in a business with thin margins, "money for nothing, the banks pay us every semester". You read it differently: a corporate that is structurally HURT by rising rates has been selling protection against rising rates — collecting premiums for an insurance it could never afford to honour. The hikes have happened. Before Friday's audit committee, you must reconstruct the machine: the rate the strips were sold at, the income that seduced everyone, the bill per semester now, the full strip, how many years of "income" one quarter of bad news erases — and the collateral call that turns spread-out pain into cash due now.`,
        `You sit on the audit committee, and item 4 reads "treasury derivatives — update". The update is a cliff: ${desc}.\n\nManagement's slide says "exceptional market conditions". Your job as a board member is to refuse adjectives: was the position a hedge or a bet? Who approved a notional of €${f(notM, 0)}m — on what limit, against what capital? The numbers you demand are the chapter's: the fair forward the curve quoted (no one was cheated — that is the point), the income booked in the calm years, the semiannual payment now, the total left to bleed, and the gap between that bill and the cash the company actually has. Then the governance verdict, which no spreadsheet can soften.`,
        `The examiner reads the case slowly, savouring it: "a floating-rate borrower sells FRA strips to earn premium. Rates rise. Walk me to the end." The data: ${desc}.\n\nHe wants the full mechanism: the forward rate that comes from the curve and not from a crystal ball, the seduction of regular settlements, the sign flip at the fixing, the strip-times-payment arithmetic, the asymmetry ratio — and the lesson that ties this module's accidents together: selling insurance collects small certain coins against a rare devastating payout, and only entities with CAPITAL can play insurer. The candidate who spots the double exposure — floating debt PLUS short FRAs — gets the top grade.`,
      ]
      : [
        `Première semaine dans le poste, et le dossier de passation contient une chemise que votre prédécesseur a étiquetée « optimisation du rendement » : ${desc}.\n\nLe directeur financier adorait cette chemise — une ligne de revenus tranquille dans un métier à marges minces, « de l'argent gratuit, les banques nous paient chaque semestre ». Vous la lisez autrement : une entreprise structurellement BLESSÉE par la hausse des taux vendait de la protection contre la hausse des taux — encaissant des primes pour une assurance qu'elle n'aurait jamais pu honorer. Les hausses ont eu lieu. Avant le comité d'audit de vendredi, vous devez reconstituer la machine : le taux auquel les strips ont été vendus, le revenu qui a séduit tout le monde, la facture par semestre désormais, le strip complet, le nombre d'années de « revenus » qu'un trimestre de mauvaises nouvelles efface — et l'appel de collatéral qui transforme une douleur étalée en cash exigible maintenant.`,
        `Vous siégez au comité d'audit, et le point 4 s'intitule « dérivés de trésorerie — point d'étape ». Le point d'étape est une falaise : ${desc}.\n\nLa slide de la direction dit « conditions de marché exceptionnelles ». Votre travail d'administrateur est de refuser les adjectifs : la position était-elle une couverture ou un pari ? Qui a approuvé un notionnel de ${f(notM, 0)} M€ — sur quelle limite, contre quel capital ? Les nombres que vous exigez sont ceux du chapitre : le forward honnête que la courbe cotait (personne n'a été trompé — c'est tout le sujet), le revenu engrangé dans les années calmes, le paiement semestriel d'aujourd'hui, le total qui reste à saigner, et l'écart entre cette facture et le cash que l'entreprise possède vraiment. Puis le verdict de gouvernance, qu'aucun tableur n'adoucira.`,
        `L'examinateur lit le cas lentement, en le savourant : « un emprunteur à taux variable vend des strips de FRA pour encaisser la prime. Les taux montent. Menez-moi jusqu'au bout. » Les données : ${desc}.\n\nIl attend le mécanisme complet : le taux forward qui sort de la courbe et pas d'une boule de cristal, la séduction des règlements réguliers, le retournement de signe au fixing, l'arithmétique strip fois paiement, le ratio d'asymétrie — et la leçon qui relie les accidents du module : vendre de l'assurance encaisse de petites pièces certaines contre un paiement rare et dévastateur, et seules les entités dotées de CAPITAL peuvent jouer l'assureur. Le candidat qui repère la double exposition — dette variable PLUS FRA vendus — prend la meilleure note.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The rate the curve was quoting' : 'a) Le taux que la courbe cotait',
          enonce: en
            ? `With ${pct(rCourt, 1)} at 6 months and ${pct(rLong, 1)} at 12 months (linear), at what fair 6×12 FRA rate were the strips sold (4 decimals)?`
            : `Avec ${pct(rCourt, 1)} à 6 mois et ${pct(rLong, 1)} à 12 mois (linéaire), à quel taux de FRA 6×12 d'équilibre les strips ont-ils été vendus (4 décimales) ?`,
          reponse: repK, tolerance: 0.02, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Two paths, one rate — nobody was cheated' : 'Deux chemins, un taux — personne n\'a été trompé',
            contenu: en
              ? `f = [(1 + ${f(rLong, 1)} % × 1)/(1 + ${f(rCourt, 1)} % × 0.5) − 1]/0.5 = **${pct(repK, 4)}** — the only rate the bank can manufacture from the curve (borrow 1 year, place 6 months), money-market linear convention. Note it sits ABOVE the ${pct(rCourt, 1)} spot rate: the curve was already pricing hikes. Selling at that rate is a fair deal — and a naked bet that the priced hikes will not come.`
              : `f = [(1 + ${f(rLong, 1)} % × 1)/(1 + ${f(rCourt, 1)} % × 0,5) − 1]/0,5 = **${pct(repK, 4)}** — le seul taux que la banque peut fabriquer depuis la courbe (emprunter 1 an, placer 6 mois), convention linéaire du monde monétaire. Notez qu'il est AU-DESSUS du taux comptant de ${pct(rCourt, 1)} : la courbe priçait déjà des hausses. Vendre à ce taux est un échange honnête — et un pari nu que les hausses pricées ne viendront pas.`,
          }],
          pieges: [en
            ? `The forward is not a forecast: it comes from a no-arbitrage construction. The seller did not "outsmart" anyone by selling above the spot rate — the premium over spot is the curve's slope, already paid for.`
            : `Le forward n'est pas une prévision : il sort d'une construction d'absence d'arbitrage. Le vendeur n'a « doublé » personne en vendant au-dessus du comptant — la prime sur le spot est la pente de la courbe, déjà payée.`],
        },
        {
          intitule: en ? 'b) The income that seduced everyone' : 'b) Le revenu qui a séduit tout le monde',
          enonce: en
            ? `While the fixings stayed at ${pct(rCourt, 1)}, what did the short strip collect per YEAR (two settlements), in thousands of euros?`
            : `Tant que les fixings restaient à ${pct(rCourt, 1)}, que rapportait le strip vendeur par AN (deux règlements), en milliers d'euros ?`,
          reponse: repRevenuAn, tolerance: 0.01, unite: 'k€',
          etapes: [{
            titre: en ? 'The short FRA collects when rates stay low' : 'Le FRA vendu encaisse quand les taux restent bas',
            contenu: en
              ? `Per semester: ${f(notM, 0)}M × (${f(rCourt, 1)} − ${f(repK, 4)}) % × 0.5, discounted at the fixing = ${f(r0(revenuSem / 1000), 0)} k€ received by the SHORT (the long pays when rates land below the FRA rate); per year = **${f(repRevenuAn, 0)} k€**. Regular, predictable, booked as "treasury income" — structurally identical to an insurer's premium income, with one difference: an insurer holds reserves.`
              : `Par semestre : ${f(notM, 0)} M × (${f(rCourt, 1)} − ${f(repK, 4)}) % × 0,5, actualisé au fixing = ${f(r0(revenuSem / 1000), 0)} k€ encaissés par le SHORT (le long paie quand les taux sortent sous le taux du FRA) ; par an = **${f(repRevenuAn, 0)} k€**. Régulier, prévisible, comptabilisé en « produits de trésorerie » — structurellement identique aux primes d'un assureur, à une différence près : un assureur détient des réserves.`,
          }],
        },
        {
          intitule: en ? 'c) The fixing after the hikes' : 'c) Le fixing après les hausses',
          enonce: en
            ? `The fixing now prints at ${pct(r1New, 2)}. What does ONE semester's settlement cost the company, in thousands of euros?`
            : `Le fixing sort désormais à ${pct(r1New, 2)}. Que coûte UN règlement semestriel à l'entreprise, en milliers d'euros ?`,
          reponse: repPaiement, tolerance: 0.01, unite: 'k€',
          etapes: [{
            titre: en ? 'The long FRA wins when rates rise — and you are short' : 'Le long FRA gagne quand les taux montent — et vous êtes short',
            contenu: en
              ? `Settlement received by the LONG = ${f(notM, 0)}M × (${f(r1New, 2)} − ${f(repK, 4)}) % × 0.5 / (1 + ${f(r1New, 2)} % × 0.5) = **${f(repPaiement, 0)} k€** — paid BY the company, at the fixing, in cash, discounted to the start of the period as FRA convention requires. The sign discipline of the chapter, lived from the wrong side.`
              : `Règlement reçu par le LONG = ${f(notM, 0)} M × (${f(r1New, 2)} − ${f(repK, 4)}) % × 0,5 / (1 + ${f(r1New, 2)} % × 0,5) = **${f(repPaiement, 0)} k€** — payés PAR l'entreprise, au fixing, en cash, actualisés au début de période comme la convention FRA l'exige. La discipline de signe du chapitre, vécue du mauvais côté.`,
          }],
          pieges: [en
            ? `Forgetting the discounting (dividing by 1 + ${f(r1New, 2)} % × 0.5) overstates the settlement: the differential compensates interest due at the END of the period but is paid at the START.`
            : `Oublier l'actualisation (diviser par 1 + ${f(r1New, 2)} % × 0,5) surestime le règlement : le différentiel compense des intérêts dus en FIN de période mais se paie au DÉBUT.`],
        },
        {
          intitule: en ? 'd) The strip left to bleed' : 'd) Le strip qui reste à saigner',
          enonce: en
            ? `${qRest} semiannual fixings remain. If rates hold at ${pct(r1New, 2)}, what does the remaining strip cost in total, in millions of euros?`
            : `Il reste ${qRest} fixings semestriels. Si les taux tiennent à ${pct(r1New, 2)}, que coûte le strip restant au total, en millions d'euros ?`,
          reponse: repTotal, tolerance: 0.02, toleranceMode: 'absolu', unite: 'M€',
          etapes: [{
            titre: en ? 'One bad number, repeated' : 'Un mauvais nombre, répété',
            contenu: en
              ? `${qRest} × ${f(repPaiement, 0)} k€ = **${f(repTotal)} M€** still to pay — and remember the company's own debt floats: every fixing that costs ${f(repPaiement, 0)} k€ on the FRAs ALSO raises its interest bill. The position was not a hedge with the wrong sign; it was the exposure itself, doubled.`
              : `${qRest} × ${f(repPaiement, 0)} k€ = **${f(repTotal)} M€** encore à payer — et rappelez-vous que la dette de l'entreprise est elle-même à taux variable : chaque fixing qui coûte ${f(repPaiement, 0)} k€ sur les FRA alourdit AUSSI sa charge d'intérêts. La position n'était pas une couverture au mauvais signe ; c'était l'exposition elle-même, doublée.`,
          }],
        },
        {
          intitule: en ? 'e) The asymmetry, in years of income' : "e) L'asymétrie, en années de revenus",
          enonce: en
            ? `How many YEARS of the calm-period "treasury income" does the remaining strip wipe out?`
            : `Combien d'ANNÉES de « produits de trésorerie » des années calmes le strip restant efface-t-il ?`,
          reponse: repRatio, tolerance: 0.2, toleranceMode: 'absolu', unite: en ? 'years' : 'années',
          etapes: [{
            titre: en ? 'The steamroller arithmetic, again' : "L'arithmétique du rouleau compresseur, encore",
            contenu: en
              ? `${f(r2(qRest * paiementSem / 1e6), 2)} M€ / ${f(repRevenuAn, 0)} k€ a year = **${f(repRatio, 1)} years** of patient collecting, erased by one rate cycle. Same shape as Leeson's straddles, same shape as every sold insurance: many small certain gains, one rare loss that dwarfs them. The Sharpe ratio of the calm years measured the absence of the event, not the absence of the risk.`
              : `${f(r2(qRest * paiementSem / 1e6), 2)} M€ / ${f(repRevenuAn, 0)} k€ par an = **${f(repRatio, 1)} années** de collecte patiente, effacées par un seul cycle de taux. Même forme que les straddles de Leeson, même forme que toute assurance vendue : beaucoup de petits gains certains, une perte rare qui les écrase. Le ratio de Sharpe des années calmes mesurait l'absence de l'événement, pas l'absence du risque.`,
          }],
        },
        {
          intitule: en ? 'f) The collateral call — pain becomes cash, today' : "f) L'appel de collatéral — la douleur devient du cash, aujourd'hui",
          enonce: en
            ? `Under the CSA, the bank calls collateral for the full mark-to-market of the strip (≈ the total of d). With a treasury buffer of €${f(tamponM, 2)}m, what is the shortfall, in millions of euros?`
            : `Au titre du CSA, la banque appelle du collatéral pour tout le mark-to-market du strip (≈ le total du d). Avec un tampon de trésorerie de ${f(tamponM, 2)} M€, quel est le manque, en millions d'euros ?`,
          reponse: repManque, tolerance: 0.05, toleranceMode: 'absolu', unite: 'M€',
          etapes: [
            {
              titre: en ? 'The CSA refuses the instalment plan' : 'Le CSA refuse le paiement en plusieurs fois',
              contenu: en
                ? `Call ≈ ${f(repTotal)} M€ against ${f(tamponM, 2)} M€ of buffer: shortfall = **${f(repManque)} M€**, to find this week — drawn lines, shareholder money, or a forced unwind that crystallises everything at the worst prices. The settlements were spread over ${qRest} semesters; the collateral is not. Margins turn future losses into present cash: Metallgesellschaft's lesson, served to a mid-cap.`
                : `Appel ≈ ${f(repTotal)} M€ contre ${f(tamponM, 2)} M€ de tampon : manque = **${f(repManque)} M€**, à trouver cette semaine — lignes tirées, argent des actionnaires, ou un débouclage forcé qui cristallise tout aux pires prix. Les règlements étaient étalés sur ${qRest} semestres ; le collatéral, non. Les marges transforment des pertes futures en cash présent : la leçon de Metallgesellschaft, servie à une ETI.`,
            },
            {
              titre: en ? 'The governance verdict' : 'Le verdict de gouvernance',
              contenu: en
                ? `Nothing in the FRA was mispriced, hidden or exotic: the instrument did exactly what its term sheet said. What failed is older than derivatives — intention is not readable in the contract, so only a written POLICY separates hedging from speculation: instruments allowed, sign allowed (a floating-rate borrower may BUY rate protection, never sell it), limits in notional and in stress-loss, and a board that asks "what is the worst fixing path we can fund?" before booking the first "income". The derivative transfers risk; it never destroys it. This company received it — without the capital of an insurer, without the mandate of a trader, and without anyone having decided it.`
                : `Rien dans le FRA n'était mal pricé, caché ou exotique : l'instrument a fait exactement ce que sa term sheet disait. Ce qui a cédé est plus vieux que les dérivés — l'intention ne se lit pas dans le contrat, donc seule une POLITIQUE écrite sépare la couverture de la spéculation : instruments autorisés, sens autorisé (un emprunteur à taux variable peut ACHETER de la protection de taux, jamais la vendre), limites en notionnel et en perte stressée, et un conseil qui demande « quel est le pire chemin de fixings que nous pouvons financer ? » avant de comptabiliser le premier « revenu ». Le dérivé transfère le risque ; il ne le détruit jamais. Cette entreprise l'a reçu — sans le capital d'un assureur, sans le mandat d'un trader, et sans que personne ne l'ait décidé.`,
            },
          ],
        },
      ],
    };
  },
};

export const problemesLot2: ProblemeMoule[] = [
  cashAndCarryFrictions, stripFraEgalSwap, stirBanqueCentrale, crossCurrencySimple,
  semaineMetallgesellschaft, leesonSingapour, cascadeClearing, swapHerite,
  basisTradeDerape, corporateOptimise,
];
