/**
 * Moules de problèmes multi-étapes du module Panorama des marchés & acteurs.
 * Dix moules : exécution d'un ordre dans le carnet, choix du type d'ordre,
 * journée d'un market maker, chaîne de coûts d'un ordre d'un million, frais de
 * gestion composés, sélection adverse (boss), découpage d'un gros ordre (boss),
 * appels de marge CCP (boss), détection de spoofing (boss), tour des acteurs.
 * Chaque moule : 3 scénarios FR + EN, sous-questions chaînées (les valeurs de a)
 * servent en b), c)…), corrigés calculés via calculs.ts — jamais de texte figé.
 * Les tirages aléatoires ont lieu AVANT toute branche de langue : même seed +
 * même scénario ⇒ mêmes nombres en français et en anglais.
 */
import { formatNombreLangue } from '../../../engine/answers';
import { mulberry32, pick, randFloat, randInt } from '../../../engine/rng';
import type { Langue, ProblemGenerator } from '../../../engine/types';
import {
  commissionTotale, coutTraverseeSpread, executionCarnet, milieuFourchette,
  pnlMarketMaker, slippage, spreadPb,
} from './calculs';
import type { NiveauCarnet } from './calculs';

const M1 = '01-panorama-marches';
const r1 = (v: number) => Math.round(v * 10) / 10;
const r2 = (v: number) => Math.round(v * 100) / 100;
const r4 = (v: number) => Math.round(v * 10_000) / 10_000;

/** Petits formateurs liés à la langue (les tirages sont déjà faits quand on les crée). */
function outils(langue: Langue) {
  const en = langue === 'en';
  const f = (v: number, d = 2) => formatNombreLangue(langue, v, d);
  const eur = (v: number, d = 2) => (en ? `€${f(v, d)}` : `${f(v, d)} €`);
  const pct = (v: number, d = 2) => (en ? `${f(v, d)}%` : `${f(v, d)} %`);
  const bp = (v: number, d = 2) => (en ? `${f(v, d)} bp` : `${f(v, d)} pb`);
  return { en, f, eur, pct, bp };
}

/* ------------------------------------------------------------------ */
/* 1. m1-pb-executer-un-ordre — N2                                     */
/* ------------------------------------------------------------------ */
const executerUnOrdre: ProblemGenerator = {
  id: 'm1-pb-executer-un-ordre', moduleId: M1,
  titre: 'Exécuter un ordre dans le carnet',
  titreEn: 'Working an order through the book',
  typeDeCas: "coûts d'exécution",
  typeDeCasEn: 'execution costs',
  difficulte: 2,
  scenarios: ['Gérant pressé qui doit être investi ce soir', "Desk d'exécution qui rend compte au client", 'Particulier averti qui décortique son relevé'],
  scenariosEn: ['Portfolio manager who must be invested by tonight', 'Execution desk reporting back to the client', 'Savvy retail investor dissecting his statement'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const mid = randInt(rng, 20, 120);
    const demiC = pick(rng, [2, 5, 10] as const);
    const stepC = pick(rng, [5, 10, 20] as const);
    const mult3 = pick(rng, [1, 2] as const);
    const s1 = randInt(rng, 2, 6) * 100;
    const s2 = randInt(rng, 2, 6) * 100;
    const s3 = randInt(rng, 5, 10) * 100;
    const partiel = randInt(rng, 1, 4) * 100;
    const tauxPb = pick(rng, [2, 5, 8] as const);
    const minimum = pick(rng, [10, 25, 50] as const);

    const bid = r2(mid - demiC / 100);
    const a1 = r2(mid + demiC / 100);
    const a2 = r2(a1 + stepC / 100);
    const a3 = r2(a2 + (mult3 * stepC) / 100);
    const Q = s1 + s2 + partiel;
    const niveaux: NiveauCarnet[] = [
      { prix: a1, taille: s1 },
      { prix: a2, taille: s2 },
      { prix: a3, taille: s3 },
    ];
    const milieu = milieuFourchette(bid, a1);
    const exec = executionCarnet(Q, niveaux);
    const slipUnit = slippage(exec.prixMoyen, milieu, 'achat');
    const slipTotal = Q * slipUnit;
    const commission = commissionTotale(exec.coutTotal, tauxPb, minimum);
    const minBinde = (exec.coutTotal * tauxPb) / 10_000 < minimum;
    const repSpread = r2(spreadPb(bid, a1));
    const repPrixMoyen = r4(exec.prixMoyen);
    const repSlip = r2(slipTotal);
    const repCom = r2(commission);
    const repFriction = r2(slipTotal + commission);

    const { en, f, eur, bp } = outils(langue);
    const desc = en
      ? `The book shows €${f(bid)} at the bid; on the ask side, ${f(s1, 0)} shares at €${f(a1)}, ${f(s2, 0)} at €${f(a2)} and ${f(s3, 0)} at €${f(a3)}. The order: buy ${f(Q, 0)} shares at market. Brokerage: ${f(tauxPb, 0)} bp of the executed amount, with a €${f(minimum, 0)} minimum`
      : `Le carnet affiche ${f(bid)} € au bid ; côté vente, ${f(s1, 0)} titres à ${f(a1)} €, ${f(s2, 0)} à ${f(a2)} € et ${f(s3, 0)} à ${f(a3)} €. L'ordre : acheter ${f(Q, 0)} titres au marché. Courtage : ${f(tauxPb, 0)} pb du montant exécuté, avec un minimum de ${f(minimum, 0)} €`;
    const contexte = (en
      ? [
        `The investment committee decided at 4 pm: the line must be in the portfolio tonight, whatever the book looks like. ${desc}. Before pressing the button, you quantify exactly what immediacy will cost — level by level.`,
        `Your execution desk just filled a client order and the post-trade report is due within the hour. ${desc}. The client will challenge every line: spread, average price, slippage, commission. Better to have each number nailed down.`,
        `Your broker's statement shows an execution price above the quote you saw on screen, and you want to know why before filing a complaint. ${desc}. Time to rebuild the whole execution, level by level, and see where the money actually went.`,
      ]
      : [
        `Le comité d'investissement a tranché à 16 h : la ligne doit être en portefeuille ce soir, quel que soit l'état du carnet. ${desc}. Avant d'appuyer sur le bouton, vous chiffrez précisément ce que l'immédiateté va coûter — niveau par niveau.`,
        `Votre desk d'exécution vient de servir un ordre client et le compte rendu post-trade est attendu dans l'heure. ${desc}. Le client contestera chaque ligne : fourchette, prix moyen, slippage, commission. Autant avoir chaque chiffre verrouillé.`,
        `Le relevé de votre courtier affiche un prix d'exécution au-dessus du cours que vous voyiez à l'écran, et vous voulez comprendre avant de réclamer. ${desc}. Reconstituons l'exécution complète, niveau par niveau, pour voir où l'argent est réellement passé.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The quoted spread, in basis points' : 'a) La fourchette affichée, en points de base',
          enonce: en
            ? `What is the bid-ask spread, expressed in basis points of the mid price?`
            : `Que vaut la fourchette achat-vente, exprimée en points de base du milieu de fourchette ?`,
          reponse: repSpread, tolerance: 0.1, toleranceMode: 'absolu', unite: en ? 'bp' : 'pb',
          etapes: [
            {
              titre: en ? 'Absolute spread, then relative' : 'Spread absolu, puis relatif',
              contenu: en
                ? `Absolute spread: ${f(a1)} − ${f(bid)} = ${eur(r2(a1 - bid))}. Mid: (${f(bid)} + ${f(a1)}) / 2 = ${eur(milieu)}. In basis points: ${f(r2(a1 - bid))} / ${f(milieu)} × 10,000 = **${bp(repSpread)}**.`
                : `Spread absolu : ${f(a1)} − ${f(bid)} = ${eur(r2(a1 - bid))}. Milieu : (${f(bid)} + ${f(a1)}) / 2 = ${eur(milieu)}. En points de base : ${f(r2(a1 - bid))} / ${f(milieu)} × 10 000 = **${bp(repSpread)}**.`,
            },
            {
              titre: en ? 'Read it as a price of immediacy' : "Le lire comme un prix de l'immédiateté",
              contenu: en
                ? `${bp(repSpread)} is what a full round trip at the touch costs, before any depth effect. The chapter-4 reflex: on a stock trading near €100, one cent of spread ≈ one basis point.`
                : `${bp(repSpread)}, c'est le prix d'un aller-retour complet aux meilleures limites, avant tout effet de profondeur. Le réflexe du chapitre 4 : sur un titre proche de 100 €, un centime de fourchette ≈ un point de base.`,
            },
          ],
          pieges: [en
            ? `Dividing by the bid instead of the mid skews the measure: the convention is the mid price, the only "neutral" reference between buyer and seller.`
            : `Diviser par le bid au lieu du milieu fausse la mesure : la convention est le milieu de fourchette, seule référence « neutre » entre acheteur et vendeur.`],
        },
        {
          intitule: en ? 'b) The average execution price' : "b) Le prix moyen d'exécution",
          enonce: en
            ? `The ${f(Q, 0)}-share market order walks the book. What average price per share does it obtain, in euros?`
            : `L'ordre au marché de ${f(Q, 0)} titres marche le carnet. Quel prix moyen par titre obtient-il, en euros ?`,
          reponse: repPrixMoyen, tolerance: 0.01, toleranceMode: 'absolu', unite: '€',
          etapes: [
            {
              titre: en ? 'Consume the levels in order' : "Consommer les niveaux dans l'ordre",
              contenu: en
                ? `${f(s1, 0)} shares at €${f(a1)}, then ${f(s2, 0)} at €${f(a2)}, then ${f(partiel, 0)} at €${f(a3)} (third level only partially consumed). Total paid: **${eur(exec.coutTotal)}** for ${f(Q, 0)} shares.`
                : `${f(s1, 0)} titres à ${f(a1)} €, puis ${f(s2, 0)} à ${f(a2)} €, puis ${f(partiel, 0)} à ${f(a3)} € (troisième niveau entamé seulement). Total payé : **${eur(exec.coutTotal)}** pour ${f(Q, 0)} titres.`,
            },
            {
              titre: en ? 'Weighted average — not simple average' : 'Moyenne pondérée — pas moyenne simple',
              contenu: en
                ? `${f(exec.coutTotal)} / ${f(Q, 0)} = **${eur(repPrixMoyen, 4)}** per share. The weights are the executed quantities at each level, never the prices alone.`
                : `${f(exec.coutTotal)} / ${f(Q, 0)} = **${eur(repPrixMoyen, 4)}** par titre. Les poids sont les quantités exécutées à chaque niveau, jamais les prix seuls.`,
            },
          ],
          pieges: [en
            ? `The simple average of the three touched prices (${eur(r2((a1 + a2 + a3) / 3))}) ignores the quantities; the best ask €${f(a1)} is obtained for the first ${f(s1, 0)} shares only.`
            : `La moyenne simple des trois prix touchés (${eur(r2((a1 + a2 + a3) / 3))}) ignore les quantités ; le meilleur ask de ${f(a1)} € n'est obtenu que pour les ${f(s1, 0)} premiers titres.`],
        },
        {
          intitule: en ? 'c) The total slippage versus the mid' : 'c) Le slippage total contre le milieu',
          enonce: en
            ? `Versus the mid price, how much does the execution cost in total, in euros (half-spread + depth)?`
            : `Par rapport au milieu de fourchette, combien l'exécution coûte-t-elle au total, en euros (demi-fourchette + profondeur) ?`,
          reponse: repSlip, tolerance: 0.005, unite: '€',
          etapes: [
            {
              titre: en ? 'Average price minus reference' : 'Prix moyen moins référence',
              contenu: en
                ? `Per share: ${f(repPrixMoyen, 4)} − ${f(milieu)} = ${eur(r4(slipUnit), 4)}. On ${f(Q, 0)} shares: ${f(Q, 0)} × ${f(r4(slipUnit), 4)} = **${eur(repSlip)}**.`
                : `Par titre : ${f(repPrixMoyen, 4)} − ${f(milieu)} = ${eur(r4(slipUnit), 4)}. Sur ${f(Q, 0)} titres : ${f(Q, 0)} × ${f(r4(slipUnit), 4)} = **${eur(repSlip)}**.`,
            },
            {
              titre: en ? 'Two floors in one number' : 'Deux étages dans un seul chiffre',
              contenu: en
                ? `This cost stacks the half-spread (buying at the ask while the value sits at the mid: ${eur(r2(Q * (a1 - milieu)))}) and the depth slippage (the ${f(Q - s1, 0)} shares served beyond the first level: ${eur(r2(slipTotal - Q * (a1 - milieu)))}). A small order pays only the first floor; a large one wakes the second.`
                : `Ce coût empile la demi-fourchette (acheter à l'ask quand la valeur est au milieu : ${eur(r2(Q * (a1 - milieu)))}) et le slippage de profondeur (les ${f(Q - s1, 0)} titres servis au-delà du premier niveau : ${eur(r2(slipTotal - Q * (a1 - milieu)))}). Un petit ordre ne paie que le premier étage ; un gros réveille le second.`,
            },
          ],
        },
        {
          intitule: en ? 'd) The brokerage commission' : 'd) La commission de courtage',
          enonce: en
            ? `What commission does the broker charge on this execution, in euros?`
            : `Quelle commission le courtier prélève-t-il sur cette exécution, en euros ?`,
          reponse: repCom, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'Rate versus minimum: the higher wins' : 'Taux contre minimum : le plus élevé gagne',
            contenu: en
              ? `Commission = max(executed amount × rate; minimum) = max(${f(exec.coutTotal)} × ${f(tauxPb, 0)} / 10,000; ${f(minimum, 0)}) = max(${f(r2((exec.coutTotal * tauxPb) / 10_000))}; ${f(minimum, 0)}) = **${eur(repCom)}**. ${minBinde ? `Here the €${f(minimum, 0)} minimum bites: on small tickets, the fixed floor dominates the rate.` : `Here the proportional rate exceeds the €${f(minimum, 0)} floor: on tickets this size, the rate is what you negotiate.`}`
              : `Commission = max(montant exécuté × taux ; minimum) = max(${f(exec.coutTotal)} × ${f(tauxPb, 0)} / 10 000 ; ${f(minimum, 0)}) = max(${f(r2((exec.coutTotal * tauxPb) / 10_000))} ; ${f(minimum, 0)}) = **${eur(repCom)}**. ${minBinde ? `Ici le minimum de ${f(minimum, 0)} € mord : sur les petits tickets, c'est le plancher fixe qui domine le taux.` : `Ici le taux proportionnel dépasse le plancher de ${f(minimum, 0)} € : sur des tickets de cette taille, c'est le taux qui se négocie.`}`,
          }],
        },
        {
          intitule: en ? 'e) The all-in friction cost' : 'e) Le coût de friction total',
          enonce: en
            ? `Adding slippage and commission, what is the all-in friction cost of this order, in euros?`
            : `En additionnant slippage et commission, quel est le coût de friction complet de cet ordre, en euros ?`,
          reponse: repFriction, tolerance: 0.005, unite: '€',
          etapes: [
            {
              titre: en ? 'Stack the two floors' : 'Empiler les deux étages',
              contenu: en
                ? `Friction = slippage + commission = ${f(repSlip)} + ${f(repCom)} = **${eur(repFriction)}**, i.e. ${bp(r2((repFriction / exec.coutTotal) * 10_000))} of the executed amount.`
                : `Friction = slippage + commission = ${f(repSlip)} + ${f(repCom)} = **${eur(repFriction)}**, soit ${bp(r2((repFriction / exec.coutTotal) * 10_000))} du montant exécuté.`,
            },
            {
              titre: en ? 'The screen price is not the paid price' : "Le prix à l'écran n'est pas le prix payé",
              contenu: en
                ? `The quote said €${f(a1)}; the order really cost ${eur(repPrixMoyen, 4)} per share plus fees. That gap — invisible on any price chart — is exactly what execution desks are paid to compress.`
                : `L'écran affichait ${f(a1)} € ; l'ordre a réellement coûté ${eur(repPrixMoyen, 4)} par titre, hors frais. Cet écart — invisible sur n'importe quel graphique de cours — est exactement ce que les desks d'exécution sont payés à comprimer.`,
            },
          ],
          pieges: [en
            ? `Counting only the commission (${eur(repCom)}) misses the bigger half: the market itself charged ${eur(repSlip)} through spread and depth.`
            : `Ne compter que la commission (${eur(repCom)}) rate la plus grosse moitié : le marché lui-même a prélevé ${eur(repSlip)} via la fourchette et la profondeur.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 2. m1-pb-choix-type-ordre — N2                                      */
/* ------------------------------------------------------------------ */
const choixTypeOrdre: ProblemGenerator = {
  id: 'm1-pb-choix-type-ordre', moduleId: M1,
  titre: 'Choisir le bon type d\'ordre',
  titreEn: 'Picking the right order type',
  typeDeCas: "types d'ordres",
  typeDeCasEn: 'order types',
  difficulte: 2,
  scenarios: ["Gérant qui ajuste le stop de protection d'une ligne", 'Trader qui vise un niveau de sortie en limite', 'Vendeur pressé avant une annonce à risque'],
  scenariosEn: ['Manager adjusting a protective stop on a position', 'Trader aiming at an exit level with a limit order', 'Hurried seller ahead of a risky announcement'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const B = randInt(rng, 30, 90);
    const Q = randInt(rng, 3, 12) * 100;
    const gap = randInt(rng, 6, 15);
    const stopPct = pick(rng, [2, 3, 4] as const);
    const glisse = pick(rng, [0.1, 0.2, 0.3, 0.5] as const);
    const limPct = randInt(rng, 1, 3);

    const G = r2(B * (1 - gap / 100));
    const S = r2(B * (1 - stopPct / 100));
    const L = r2(B * (1 + limPct / 100));
    const prixStop = r2(G - glisse);
    const repMarche = r2(Q * B);
    const repResiduel = r2(Q * G);
    const repStop = r2(Q * prixStop);
    const repEcart = r2(Q * S - repStop);

    const { en, f, eur } = outils(langue);
    const desc = en
      ? `you hold ${f(Q, 0)} shares and the bid stands at €${f(B)}. If the announcement disappoints, the stock could reopen around €${f(G)} (a downside gap of ${f(gap, 0)}%). A protective stop at €${f(S)}, triggered inside the gap, would execute about €${f(glisse)} below the reopening price; a sell limit at €${f(L)}, placed above the market, would simply remain unfilled`
      : `vous détenez ${f(Q, 0)} titres et le bid s'affiche à ${f(B)} €. Si l'annonce déçoit, le titre pourrait rouvrir autour de ${f(G)} € (un gap baissier de ${f(gap, 0)} %). Un stop de protection à ${f(S)} €, déclenché dans le gap, s'exécuterait environ ${f(glisse)} € sous le prix de réouverture ; une limite de vente à ${f(L)} €, placée au-dessus du marché, resterait simplement non exécutée`;
    const contexte = (en
      ? [
        `Quarterly review of your book: one position goes through a binary news event tonight and you must decide how its protection is wired. ${desc}. Before choosing, you price what EACH order type would actually deliver if the bad scenario materialises.`,
        `You had pencilled an exit "on my level, not below" — the classic limit-order discipline. ${desc}. Tonight's event forces the question: what does each order type really guarantee, in euros, if the gap opens under your feet?`,
        `The announcement falls after the close and your risk limits force a decision before 5:30 pm. ${desc}. Market order now, limit at your level, or stop for the night: three routes, three very different cheques. Price all three.`,
      ]
      : [
        `Revue trimestrielle de votre livre : une position traverse ce soir un événement binaire et vous devez décider comment sa protection est câblée. ${desc}. Avant de choisir, vous chiffrez ce que CHAQUE type d'ordre livrerait réellement si le mauvais scénario se matérialise.`,
        `Vous aviez prévu une sortie « sur mon niveau, pas en dessous » — la discipline classique de l'ordre à cours limité. ${desc}. L'événement de ce soir force la question : que garantit réellement chaque type d'ordre, en euros, si le gap s'ouvre sous vos pieds ?`,
        `L'annonce tombe après la clôture et vos limites de risque imposent une décision avant 17 h 30. ${desc}. Ordre au marché maintenant, limite sur votre niveau, ou stop pour la nuit : trois routes, trois chèques très différents. Chiffrez les trois.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The market order, right now' : "a) L'ordre au marché, tout de suite",
          enonce: en
            ? `If you sell the whole position at market right now, what do you collect, in euros?`
            : `Si vous vendez toute la position au marché maintenant, combien encaissez-vous, en euros ?`,
          reponse: repMarche, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'Certainty of execution, at the bid' : "Certitude d'exécution, au bid",
            contenu: en
              ? `A market sell hits the bid: ${f(Q, 0)} × ${f(B)} = **${eur(repMarche)}**. The market order guarantees the execution, never the price — but right now, the price is known: €${f(B)}.`
              : `Une vente au marché tape le bid : ${f(Q, 0)} × ${f(B)} = **${eur(repMarche)}**. L'ordre au marché garantit l'exécution, jamais le prix — mais à cet instant, le prix est connu : ${f(B)} €.`,
          }],
          pieges: [en
            ? `Valuing the sale at the mid or at the ask overstates the cheque: a seller crosses the spread and receives the bid.`
            : `Valoriser la vente au milieu ou à l'ask gonfle le chèque : un vendeur traverse la fourchette et touche le bid.`],
        },
        {
          intitule: en ? 'b) The limit order through the gap' : 'b) La limite face au gap',
          enonce: en
            ? `You place the sell limit at €${f(L)} instead. The bad scenario hits and the stock reopens at €${f(G)}. What is your position worth at the reopening, in euros?`
            : `Vous placez plutôt la limite de vente à ${f(L)} €. Le mauvais scénario se réalise et le titre rouvre à ${f(G)} €. Que vaut votre position à la réouverture, en euros ?`,
          reponse: repResiduel, tolerance: 0.005, unite: '€',
          etapes: [
            {
              titre: en ? 'A limit above the market never trades in a fall' : 'Une limite au-dessus du marché ne traite jamais dans une chute',
              contenu: en
                ? `The order book never went up through €${f(L)}: the limit sat there, unfilled. You still hold ${f(Q, 0)} shares, now worth ${f(Q, 0)} × ${f(G)} = **${eur(repResiduel)}**.`
                : `Le carnet n'est jamais remonté au travers de ${f(L)} € : la limite est restée là, non exécutée. Vous détenez toujours ${f(Q, 0)} titres, qui valent désormais ${f(Q, 0)} × ${f(G)} = **${eur(repResiduel)}**.`,
            },
            {
              titre: en ? 'The mirror guarantee' : 'La garantie en miroir',
              contenu: en
                ? `The limit order guarantees the price (€${f(L)} or better) but never the execution. Versus selling at market in a), the unfilled limit leaves ${eur(r2(repMarche - repResiduel))} on the table — the price of waiting for a level the market never paid.`
                : `L'ordre à cours limité garantit le prix (${f(L)} € ou mieux) mais jamais l'exécution. Face à la vente au marché du a), la limite non servie laisse ${eur(r2(repMarche - repResiduel))} sur la table — le prix d'attendre un niveau que le marché n'a jamais payé.`,
            },
          ],
        },
        {
          intitule: en ? 'c) The stop swallowed by the gap' : 'c) Le stop avalé par le gap',
          enonce: en
            ? `Third route: the stop at €${f(S)}. The stock gaps straight to €${f(G)} and the stop, turned into a market order, executes €${f(glisse)} lower. What do you collect, in euros?`
            : `Troisième route : le stop à ${f(S)} €. Le titre saute directement à ${f(G)} € et le stop, devenu ordre au marché, s'exécute ${f(glisse)} € plus bas. Combien encaissez-vous, en euros ?`,
          reponse: repStop, tolerance: 0.005, unite: '€',
          etapes: [
            {
              titre: en ? 'The trigger is not an execution price' : "Le seuil de déclenchement n'est pas un prix d'exécution",
              contenu: en
                ? `The price never traded between €${f(S)} and €${f(G)}: the stop wakes up AFTER the gap, as a market order in a falling book. Execution at ${f(G)} − ${f(glisse)} = €${f(prixStop)}, hence ${f(Q, 0)} × ${f(prixStop)} = **${eur(repStop)}**.`
                : `Le cours n'a jamais traité entre ${f(S)} € et ${f(G)} € : le stop se réveille APRÈS le gap, en ordre au marché dans un carnet qui chute. Exécution à ${f(G)} − ${f(glisse)} = ${f(prixStop)} €, d'où ${f(Q, 0)} × ${f(prixStop)} = **${eur(repStop)}**.`,
            },
          ],
          pieges: [en
            ? `Computing ${f(Q, 0)} × ${f(S)} = ${eur(r2(Q * S))} assumes the stop guarantees its threshold — precisely the illusion the gap destroys.`
            : `Calculer ${f(Q, 0)} × ${f(S)} = ${eur(r2(Q * S))} suppose que le stop garantit son seuil — précisément l'illusion que le gap détruit.`],
        },
        {
          intitule: en ? 'd) The broken promise of the stop' : 'd) La promesse trahie du stop',
          enonce: en
            ? `In euros, how far does the stop's actual proceeds fall short of what its €${f(S)} threshold seemed to promise?`
            : `En euros, de combien le produit réel du stop est-il inférieur à ce que son seuil de ${f(S)} € semblait promettre ?`,
          reponse: repEcart, tolerance: 0.005, unite: '€',
          etapes: [
            {
              titre: en ? 'Promise minus reality' : 'Promesse moins réalité',
              contenu: en
                ? `Promised: ${f(Q, 0)} × ${f(S)} = ${eur(r2(Q * S))}. Delivered: ${eur(repStop)}. Shortfall: **${eur(repEcart)}** — the gap jumped over the threshold, and the slippage added insult.`
                : `Promis : ${f(Q, 0)} × ${f(S)} = ${eur(r2(Q * S))}. Livré : ${eur(repStop)}. Manque : **${eur(repEcart)}** — le gap a sauté par-dessus le seuil, et le slippage a ajouté l'addition.`,
            },
            {
              titre: en ? 'The verdict, route by route' : 'Le verdict, route par route',
              contenu: en
                ? `Selling at market today: ${eur(repMarche)} — certain, spread paid. Limit at €${f(L)}: ${eur(repResiduel)} of paper value if the gap hits — price guaranteed, execution not. Stop at €${f(S)}: ${eur(repStop)} — execution guaranteed, price not. No order type beats the event itself: each one only chooses WHICH risk you keep — price risk, execution risk, or gap risk. The jury answer: "a stop limits the loss in a continuous market, not through a gap".`
                : `Vendre au marché aujourd'hui : ${eur(repMarche)} — certain, fourchette payée. Limite à ${f(L)} € : ${eur(repResiduel)} de valeur papier si le gap frappe — prix garanti, exécution non. Stop à ${f(S)} € : ${eur(repStop)} — exécution garantie, prix non. Aucun type d'ordre ne bat l'événement lui-même : chacun choisit seulement QUEL risque vous gardez — risque de prix, risque d'exécution, ou risque de gap. La réponse de jury : « un stop limite la perte en marché continu, pas au travers d'un gap ».`,
            },
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 3. m1-pb-market-maker-journee — N3                                  */
/* ------------------------------------------------------------------ */
const marketMakerJournee: ProblemGenerator = {
  id: 'm1-pb-market-maker-journee', moduleId: M1,
  titre: "La journée d'un market maker",
  titreEn: "A market maker's day",
  typeDeCas: 'économie de la tenue de marché',
  typeDeCasEn: 'market-making economics',
  difficulte: 3,
  scenarios: ['Market maker sur une action moyenne du CAC', 'Teneur de marché obligataire', "Animateur d'ETF un jour de volatilité"],
  scenariosEn: ['Market maker on a mid-cap CAC stock', 'Bond market maker', 'ETF liquidity provider on a volatile day'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const nb = randInt(rng, 20, 60);
    const taille = randInt(rng, 2, 10) * 1000;
    const spC = randInt(rng, 3, 8);
    const cvC = r1(spC * randFloat(rng, 0.25, 0.5, 2));
    const fixes = randInt(rng, 5, 25) * 100;

    const brut = nb * taille * (spC / 100);
    const couv = nb * taille * (cvC / 100);
    const net = pnlMarketMaker(nb, taille, spC / 100, cvC / 100) - fixes;
    const seuilC = cvC + (fixes * 100) / (nb * taille);
    const netChoc = net - couv;
    const repBrut = r2(brut);
    const repCouv = r2(couv);
    const repNet = r2(net);
    const repSeuil = Math.round(seuilC * 1000) / 1000;
    const repChoc = r2(netChoc);

    const { en, f, eur } = outils(langue);
    const desc = en
      ? `the desk completes ${f(nb, 0)} round trips of ${f(taille, 0)} shares at an average captured spread of ${f(spC, 1)} cents per share; hedging costs ${f(cvC, 1)} cents per share, and the day carries €${f(fixes, 0)} of fixed costs (seat, data, connectivity)`
      : `le desk boucle ${f(nb, 0)} allers-retours de ${f(taille, 0)} titres à un spread moyen capturé de ${f(spC, 1)} centimes par titre ; la couverture coûte ${f(cvC, 1)} centimes par titre, et la journée porte ${f(fixes, 0)} € de coûts fixes (siège, données, connectivité)`;
    const contexte = (en
      ? [
        `End of day on the equity market-making desk: the head trader wants the P&L decomposed before the 6 pm meeting, not a single net number. Today, ${desc}. Gross spread, hedging, fixed costs — then the spread level at which the whole day would have been for nothing.`,
        `On the bond desk, your market making is quoted in cents per unit traded, and today's session must be settled line by line: ${desc}. The desk head adds his usual question: at what average spread does the day break even?`,
        `Volatility woke up and your ETF market-making book turned over heavily: ${desc}. Risk asks for the full decomposition — and for what happens to the day if hedging costs double in tomorrow's session.`,
      ]
      : [
        `Fin de journée sur le desk de market making actions : le chef de desk veut le P&L décomposé avant la réunion de 18 h, pas un chiffre net unique. Aujourd'hui, ${desc}. Spread brut, couverture, coûts fixes — puis le niveau de spread auquel toute la journée n'aurait servi à rien.`,
        `Sur le desk obligataire, votre tenue de marché se cote en centimes par titre traité, et la séance du jour doit être soldée ligne à ligne : ${desc}. Le chef de desk ajoute sa question rituelle : à quel spread moyen la journée est-elle à l'équilibre ?`,
        `La volatilité s'est réveillée et votre livre d'animation d'ETF a beaucoup tourné : ${desc}. Le risque demande la décomposition complète — et ce que devient la journée si le coût de couverture double à la séance suivante.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The gross spread P&L' : 'a) Le P&L brut de spread',
          enonce: en
            ? `How much does the captured spread bring in over the whole day, in euros?`
            : `Combien le spread capturé rapporte-t-il sur la journée entière, en euros ?`,
          reponse: repBrut, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'Spread × size × rotation' : 'Spread × taille × rotation',
            contenu: en
              ? `Each round trip captures ${f(spC, 1)} cents on ${f(taille, 0)} shares: ${f(nb, 0)} × ${f(taille, 0)} × ${f(spC / 100, 4)} = **${eur(repBrut)}**. The market maker's revenue is the spread times the rotation — never a directional bet (chapter 3).`
              : `Chaque aller-retour capture ${f(spC, 1)} centimes sur ${f(taille, 0)} titres : ${f(nb, 0)} × ${f(taille, 0)} × ${f(spC / 100, 4)} = **${eur(repBrut)}**. Le revenu du market maker, c'est la fourchette multipliée par la rotation — jamais un pari directionnel (chapitre 3).`,
          }],
          pieges: [en
            ? `Counting the full spread per single trade instead of per round trip doubles the revenue: the spread is earned buy-AND-sell, not on each leg.`
            : `Compter le spread entier par transaction simple au lieu de par aller-retour double le revenu : la fourchette se gagne achat-ET-vente, pas sur chaque jambe.`],
        },
        {
          intitule: en ? 'b) The total hedging cost' : 'b) Le coût de couverture total',
          enonce: en
            ? `What does hedging the inventory cost over the day, in euros?`
            : `Que coûte la couverture de l'inventaire sur la journée, en euros ?`,
          reponse: repCouv, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'The price of not betting' : 'Le prix du non-pari',
            contenu: en
              ? `${f(nb, 0)} × ${f(taille, 0)} × ${f(cvC / 100, 4)} = **${eur(repCouv)}**. Hedging is what turns a directional position into a pure spread business: this cost is structural, not optional.`
              : `${f(nb, 0)} × ${f(taille, 0)} × ${f(cvC / 100, 4)} = **${eur(repCouv)}**. La couverture est ce qui transforme une position directionnelle en pur métier de spread : ce coût est structurel, pas optionnel.`,
          }],
        },
        {
          intitule: en ? 'c) The net P&L of the day' : 'c) Le P&L net de la journée',
          enonce: en
            ? `After hedging and the €${f(fixes, 0)} of fixed costs, what is the day's net P&L, in euros?`
            : `Après couverture et les ${f(fixes, 0)} € de coûts fixes, quel est le P&L net de la journée, en euros ?`,
          reponse: repNet, tolerance: 5, toleranceMode: 'absolu', unite: '€',
          etapes: [
            {
              titre: en ? 'Gross, minus everything that eats it' : 'Le brut, moins tout ce qui le mange',
              contenu: en
                ? `Net = ${f(repBrut)} − ${f(repCouv)} − ${f(fixes, 0)} = **${eur(repNet)}**. ${net >= 0 ? 'A positive day — by the margin the spread allows, no more.' : 'A losing day: the captured spread did not cover hedging plus the fixed base.'}`
                : `Net = ${f(repBrut)} − ${f(repCouv)} − ${f(fixes, 0)} = **${eur(repNet)}**. ${net >= 0 ? "Journée positive — de la marge que le spread autorise, pas plus." : "Journée perdante : le spread capturé n'a pas couvert la couverture plus la base fixe."}`,
            },
            {
              titre: en ? 'Per share, the business is tiny' : 'Par titre, le métier est minuscule',
              contenu: en
                ? `Net margin per share traded: ${f(repNet)} / ${f(nb * taille, 0)} = ${eur(r4(net / (nb * taille)), 4)}. Market making is an industrial volume business on a margin of fractions of a cent.`
                : `Marge nette par titre traité : ${f(repNet)} / ${f(nb * taille, 0)} = ${eur(r4(net / (nb * taille)), 4)}. La tenue de marché est une industrie de volume sur une marge de fractions de centime.`,
            },
          ],
        },
        {
          intitule: en ? 'd) The break-even spread' : "d) Le spread d'équilibre de la journée",
          enonce: en
            ? `At what average captured spread, in cents per share, would the day end exactly at zero (same volumes, same costs)?`
            : `À quel spread moyen capturé, en centimes par titre, la journée finirait-elle exactement à zéro (mêmes volumes, mêmes coûts) ?`,
          reponse: repSeuil, tolerance: 0.05, toleranceMode: 'absolu', unite: en ? 'cents' : 'centimes',
          etapes: [
            {
              titre: en ? 'Set the net to zero' : 'Annuler le net',
              contenu: en
                ? `Zero requires: volume × (spread − hedging) = fixed costs, i.e. spread* = ${f(cvC, 1)} + ${f(fixes, 0)} × 100 / ${f(nb * taille, 0)} = ${f(cvC, 1)} + ${f(r2((fixes * 100) / (nb * taille)))} = **${f(repSeuil, 3)} cents**.`
                : `Le zéro exige : volume × (spread − couverture) = coûts fixes, soit spread* = ${f(cvC, 1)} + ${f(fixes, 0)} × 100 / ${f(nb * taille, 0)} = ${f(cvC, 1)} + ${f(r2((fixes * 100) / (nb * taille)))} = **${f(repSeuil, 3)} centimes**.`,
            },
            {
              titre: en ? 'Read the cushion' : 'Lire le coussin',
              contenu: en
                ? `Today's spread of ${f(spC, 1)} cents sits ${spC >= seuilC ? `${f(r2(spC - seuilC))} cents above` : `${f(r2(seuilC - spC))} cents below`} the threshold. ${spC >= seuilC ? 'That cushion is the desk\'s entire profitability: a competitor quoting one cent tighter erases most of it.' : 'Below threshold, every round trip digs the hole deeper — quoting wider or trading less both beat persisting.'}`
                : `Le spread du jour, ${f(spC, 1)} centimes, se situe ${spC >= seuilC ? `${f(r2(spC - seuilC))} centime(s) au-dessus` : `${f(r2(seuilC - spC))} centime(s) en dessous`} du seuil. ${spC >= seuilC ? "Ce coussin est toute la rentabilité du desk : un concurrent qui cote un centime plus serré en efface l'essentiel." : "Sous le seuil, chaque aller-retour creuse le trou — élargir la cote ou moins traiter valent mieux que persister."}`,
            },
          ],
          pieges: [en
            ? `Answering ${f(cvC, 1)} cents (hedging alone) forgets the fixed base: a desk that only covers its variable cost still loses €${f(fixes, 0)} a day.`
            : `Répondre ${f(cvC, 1)} centimes (la seule couverture) oublie la base fixe : un desk qui ne couvre que son coût variable perd encore ${f(fixes, 0)} € par jour.`],
        },
        {
          intitule: en ? 'e) The hedging shock' : 'e) Le choc sur la couverture',
          enonce: en
            ? `Volatility doubles the hedging cost (${f(cvC, 1)} → ${f(2 * cvC, 1)} cents), volumes unchanged. What does the net P&L become, in euros?`
            : `La volatilité double le coût de couverture (${f(cvC, 1)} → ${f(2 * cvC, 1)} centimes), volumes inchangés. Que devient le P&L net, en euros ?`,
          reponse: repChoc, tolerance: 5, toleranceMode: 'absolu', unite: '€',
          etapes: [
            {
              titre: en ? 'One more layer of b)' : 'Une couche de b) en plus',
              contenu: en
                ? `Doubling the unit cost simply subtracts b) once more: ${f(repNet)} − ${f(repCouv)} = **${eur(repChoc)}**. ${netChoc < 0 ? 'The day flips into loss: ' : 'The day survives, barely: '}this is why quoted spreads widen mechanically when volatility jumps — the market maker passes his hedging bill on to the spread.`
                : `Doubler le coût unitaire retranche simplement b) une seconde fois : ${f(repNet)} − ${f(repCouv)} = **${eur(repChoc)}**. ${netChoc < 0 ? 'La journée bascule en perte : ' : 'La journée survit, de peu : '}voilà pourquoi les fourchettes cotées s'élargissent mécaniquement quand la volatilité saute — le market maker répercute sa facture de couverture sur le spread.`,
            },
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 4. m1-pb-chaine-de-couts — N3                                       */
/* ------------------------------------------------------------------ */
const chaineDeCouts: ProblemGenerator = {
  id: 'm1-pb-chaine-de-couts', moduleId: M1,
  titre: "La chaîne de coûts d'un ordre d'un million",
  titreEn: 'The cost chain of a one-million-euro order',
  typeDeCas: "chaîne de coûts d'exécution",
  typeDeCasEn: 'execution cost chain',
  difficulte: 3,
  scenarios: ['Caisse de retraite servie au tarif institutionnel', 'Particulier fortuné via un courtier en ligne', "Consultant qui compare les canaux pour un appel d'offres"],
  scenariosEn: ['Pension fund on institutional terms', 'Wealthy retail investor through an online broker', 'Consultant benchmarking channels for a tender'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const N = 1_000_000;
    const co = randFloat(rng, 3, 12, 1);
    const minimum = pick(rng, [20, 50, 100] as const);
    const de = randFloat(rng, 1.5, 6, 1);
    const sl = randFloat(rng, 0.5, 4, 1);
    const inf = randFloat(rng, 0.5, 2, 1);

    const courtage = commissionTotale(N, co, minimum);
    const demiSpread = (N * de) / 10_000;
    const slip = (N * sl) / 10_000;
    const infra = (N * inf) / 10_000;
    const total = courtage + demiSpread + slip + infra;
    const repCourtage = r2(courtage);
    const repDemi = r2(demiSpread);
    const repSlip = r2(slip);
    const repInfra = r2(infra);
    const repTotal = r2(total);
    const repTotalPb = r2(total / 100);

    const { en, f, eur, bp } = outils(langue);
    const desc = en
      ? `a €${f(N, 0)} buy order in liquid equities goes through the whole chain: brokerage at ${f(co, 1)} bp (minimum €${f(minimum, 0)}), a half-spread of ${f(de, 1)} bp, depth slippage of ${f(sl, 1)} bp and infrastructure fees (exchange, clearing, settlement) of ${f(inf, 1)} bp`
      : `un ordre d'achat de ${f(N, 0)} € en actions liquides traverse toute la chaîne : courtage à ${f(co, 1)} pb (minimum ${f(minimum, 0)} €), demi-fourchette de ${f(de, 1)} pb, slippage de profondeur de ${f(sl, 1)} pb et frais d'infrastructure (bourse, compensation, règlement-livraison) de ${f(inf, 1)} pb`;
    const contexte = (en
      ? [
        `The pension fund's board wants the cost of its equity programme documented euro by euro before renewing the broker mandate. This quarter's reference trade: ${desc}. Your job: each layer in euros, the total in euros AND in basis points.`,
        `A wealthy client executes through his online broker and finally asks the question his statement never answers: what does a single large order really cost, all layers included? His reference trade: ${desc}. Decompose, then total — in euros and in basis points.`,
        `For a best-execution tender, you must rebuild the full cost chain of a standard order on the candidate channel: ${desc}. The scoring grid requires each layer in euros and the all-in figure in basis points, comparable across channels.`,
      ]
      : [
        `Le conseil de la caisse de retraite veut le coût de son programme actions documenté euro par euro avant de renouveler le mandat de courtage. Le trade de référence du trimestre : ${desc}. Votre travail : chaque étage en euros, le total en euros ET en points de base.`,
        `Un client fortuné exécute via son courtier en ligne et pose enfin la question à laquelle son relevé ne répond jamais : que coûte réellement un gros ordre, toutes couches comprises ? Son trade de référence : ${desc}. Décomposez, puis totalisez — en euros et en points de base.`,
        `Pour un appel d'offres best execution, vous devez reconstituer la chaîne de coûts complète d'un ordre standard sur le canal candidat : ${desc}. La grille de notation exige chaque étage en euros et le chiffre tout compris en points de base, comparable entre canaux.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The brokerage layer' : "a) L'étage courtage",
          enonce: en
            ? `What does the broker charge on this order, in euros?`
            : `Que prélève le courtier sur cet ordre, en euros ?`,
          reponse: repCourtage, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'On €1m, 1 bp = €100' : 'Sur 1 M€, 1 pb = 100 €',
            contenu: en
              ? `Commission = max(${f(N, 0)} × ${f(co, 1)} / 10,000; ${f(minimum, 0)}) = **${eur(repCourtage)}**. The conversion to burn in: on one million euros, every basis point is worth €100 — the €${f(minimum, 0)} minimum is irrelevant at this size (it bites on small retail tickets).`
              : `Commission = max(${f(N, 0)} × ${f(co, 1)} / 10 000 ; ${f(minimum, 0)}) = **${eur(repCourtage)}**. La conversion à graver : sur un million d'euros, chaque point de base vaut 100 € — le minimum de ${f(minimum, 0)} € est sans effet à cette taille (il mord sur les petits tickets de détail).`,
          }],
        },
        {
          intitule: en ? 'b) The half-spread layer' : "b) L'étage demi-fourchette",
          enonce: en
            ? `What does crossing the half-spread cost, in euros?`
            : `Que coûte la traversée de la demi-fourchette, en euros ?`,
          reponse: repDemi, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'The market maker\'s toll' : 'Le péage du teneur de marché',
            contenu: en
              ? `${f(N, 0)} × ${f(de, 1)} / 10,000 = **${eur(repDemi)}**. Buying at the ask while the value sits at the mid: this is the market maker's compensation for immediacy and adverse-selection risk (chapter 5).`
              : `${f(N, 0)} × ${f(de, 1)} / 10 000 = **${eur(repDemi)}**. Acheter à l'ask quand la valeur est au milieu : c'est la rémunération du teneur de marché pour l'immédiateté et le risque de sélection adverse (chapitre 5).`,
          }],
        },
        {
          intitule: en ? 'c) The depth-slippage layer' : "c) L'étage slippage de profondeur",
          enonce: en
            ? `What does the order's size add beyond the touch, in euros?`
            : `Que coûte en plus la taille de l'ordre au-delà de la meilleure limite, en euros ?`,
          reponse: repSlip, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'Size has its own price' : 'La taille a son propre prix',
            contenu: en
              ? `${f(N, 0)} × ${f(sl, 1)} / 10,000 = **${eur(repSlip)}**. A million euros rarely fits at the best limit: the deeper levels charge their step. This is the layer that explodes on illiquid names — and the one execution algos exist to compress.`
              : `${f(N, 0)} × ${f(sl, 1)} / 10 000 = **${eur(repSlip)}**. Un million d'euros tient rarement à la meilleure limite : les niveaux suivants facturent leur marche. C'est l'étage qui explose sur les valeurs illiquides — et celui que les algos d'exécution existent pour comprimer.`,
          }],
        },
        {
          intitule: en ? 'd) The infrastructure layer' : "d) L'étage infrastructure",
          enonce: en
            ? `What do exchange, clearing and settlement fees amount to, in euros?`
            : `À combien se montent les frais de bourse, compensation et règlement-livraison, en euros ?`,
          reponse: repInfra, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'The plumbing bill' : 'La facture de la tuyauterie',
            contenu: en
              ? `${f(N, 0)} × ${f(inf, 1)} / 10,000 = **${eur(repInfra)}**. Exchange, CCP and CSD each take a sliver. Individually invisible, jointly the price of a guaranteed, settled trade (chapter 7).`
              : `${f(N, 0)} × ${f(inf, 1)} / 10 000 = **${eur(repInfra)}**. Bourse, CCP et dépositaire prennent chacun une écaille. Individuellement invisibles, ensemble le prix d'un trade garanti et dénoué (chapitre 7).`,
          }],
        },
        {
          intitule: en ? 'e) The all-in total, in euros' : 'e) Le total tout compris, en euros',
          enonce: en
            ? `Summing the four layers, what does the execution cost in total, in euros?`
            : `En sommant les quatre étages, combien coûte l'exécution au total, en euros ?`,
          reponse: repTotal, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'Stack the chain' : 'Empiler la chaîne',
            contenu: en
              ? `${f(repCourtage)} + ${f(repDemi)} + ${f(repSlip)} + ${f(repInfra)} = **${eur(repTotal)}**. The biggest layer here is ${courtage >= Math.max(demiSpread, slip) ? 'brokerage' : demiSpread >= slip ? 'the half-spread' : 'depth slippage'} — knowing WHERE the money goes is what lets you negotiate it.`
              : `${f(repCourtage)} + ${f(repDemi)} + ${f(repSlip)} + ${f(repInfra)} = **${eur(repTotal)}**. Le plus gros étage est ici ${courtage >= Math.max(demiSpread, slip) ? 'le courtage' : demiSpread >= slip ? 'la demi-fourchette' : 'le slippage de profondeur'} — savoir OÙ part l'argent est ce qui permet de le négocier.`,
          }],
          pieges: [en
            ? `Forgetting layers b) and c) — the ones no invoice ever shows — is the classic understatement: the market charges without sending a bill.`
            : `Oublier les étages b) et c) — ceux qu'aucune facture n'affiche — est la sous-estimation classique : le marché prélève sans envoyer de note.`],
        },
        {
          intitule: en ? 'f) The all-in total, in basis points' : 'f) Le total tout compris, en points de base',
          enonce: en
            ? `Express the all-in cost in basis points of the order.`
            : `Exprimez le coût tout compris en points de base de l'ordre.`,
          reponse: repTotalPb, tolerance: 0.2, toleranceMode: 'absolu', unite: en ? 'bp' : 'pb',
          etapes: [
            {
              titre: en ? 'Divide by €100 per bp' : 'Diviser par 100 € le pb',
              contenu: en
                ? `${f(repTotal)} / 100 = **${bp(repTotalPb)}** (= ${f(co, 1)} + ${f(de, 1)} + ${f(sl, 1)} + ${f(inf, 1)}: in bp, the chain simply adds up).`
                : `${f(repTotal)} / 100 = **${bp(repTotalPb)}** (= ${f(co, 1)} + ${f(de, 1)} + ${f(sl, 1)} + ${f(inf, 1)} : en pb, la chaîne s'additionne simplement).`,
            },
            {
              titre: en ? 'The three channels, compared' : 'Les trois canaux, comparés',
              contenu: en
                ? `Orders of magnitude to anchor (chapter 2 benchmark: ≈ 8 bp all-in for an institutional trade): an institutional desk lands around 5–10 bp, a retail online broker around 20–50 bp once its wider spread is counted, and an old-style full-service retail channel above 100 bp. Same order, same market — up to ten times the friction, depending on who carries it.`
                : `Ordres de grandeur à ancrer (référence du chapitre 2 : ≈ 8 pb tout compris pour un trade institutionnel) : un desk institutionnel atterrit vers 5–10 pb, un courtier en ligne grand public vers 20–50 pb une fois sa fourchette plus large comptée, et un canal de détail à l'ancienne au-dessus de 100 pb. Même ordre, même marché — jusqu'à dix fois la friction, selon qui le porte.`,
            },
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 5. m1-pb-frais-gestion-long-terme — N3                              */
/* ------------------------------------------------------------------ */
const fraisGestionLongTerme: ProblemGenerator = {
  id: 'm1-pb-frais-gestion-long-terme', moduleId: M1,
  titre: 'Le poids des frais sur vingt ans et plus',
  titreEn: 'The weight of fees over twenty years and beyond',
  typeDeCas: 'frais de gestion composés',
  typeDeCasEn: 'compounded management fees',
  difficulte: 3,
  scenarios: ['Épargnant qui hésite entre ETF et fonds actif', 'Conseiller en gestion de patrimoine sommé de justifier ses frais', 'Réponse de jury sur le pouvoir des frais composés'],
  scenariosEn: ['Saver torn between an ETF and an active fund', 'Wealth adviser pressed to justify his fees', 'Jury answer on the power of compounded fees'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const C = pick(rng, [10_000, 20_000, 50_000, 100_000] as const);
    const n = pick(rng, [20, 25, 30, 40] as const);
    const r = randFloat(rng, 5, 7, 1);
    const f1 = randFloat(rng, 0.15, 0.4, 2);
    const f2 = randFloat(rng, 1.5, 2.2, 2);

    const netEtf = r - f1;
    const netActif = r - f2;
    const capEtf = C * Math.pow(1 + netEtf / 100, n);
    const capActif = C * Math.pow(1 + netActif / 100, n);
    const ecart = capEtf - capActif;
    const ecartPct = (ecart / capEtf) * 100;
    const repEtf = r2(capEtf);
    const repActif = r2(capActif);
    const repEcart = r2(ecart);
    const repEcartPct = r2(ecartPct);

    const { en, f, eur, pct } = outils(langue);
    const desc = en
      ? `an initial €${f(C, 0)} invested for ${n} years at a gross annual return of ${f(r, 1)}%, identical in both vehicles; the index fund charges ${f(f1, 2)}% a year, the active fund ${f(f2, 2)}% a year`
      : `un capital initial de ${f(C, 0)} € investi pendant ${n} ans à un rendement brut annuel de ${f(r, 1)} %, identique dans les deux supports ; le fonds indiciel facture ${f(f1, 2)} % par an, le fonds actif ${f(f2, 2)} % par an`;
    const contexte = (en
      ? [
        `Same market, same gross performance, two price tags — the only experiment that isolates what fees alone do to savings. Your case: ${desc}. Before signing anything, you run the numbers to the end of the horizon.`,
        `A client walks in with a competitor's ETF proposal and asks you to defend your fund selection, figures in hand. The comparison on the table: ${desc}. Intellectual honesty requires computing both trajectories before arguing about alpha.`,
        `The jury question is a classic for a reason: "show us, with numbers, why fees matter more than almost anything else over the long run." Your material: ${desc}. The expected answer is not an opinion — it is four numbers, derived cleanly.`,
      ]
      : [
        `Même marché, même performance brute, deux étiquettes de prix — la seule expérience qui isole ce que les frais, seuls, font à une épargne. Votre cas : ${desc}. Avant de signer quoi que ce soit, vous déroulez les chiffres jusqu'au bout de l'horizon.`,
        `Un client arrive avec la proposition ETF d'un concurrent et vous demande de défendre votre sélection de fonds, chiffres à l'appui. La comparaison sur la table : ${desc}. L'honnêteté intellectuelle impose de calculer les deux trajectoires avant de parler d'alpha.`,
        `La question de jury est un classique pour une bonne raison : « montrez-nous, chiffres à l'appui, pourquoi les frais comptent plus que presque tout le reste à long terme. » Votre matériau : ${desc}. La réponse attendue n'est pas une opinion — ce sont quatre nombres, dérivés proprement.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The index-fund capital at the horizon' : "a) Le capital du fonds indiciel à l'horizon",
          enonce: en
            ? `What capital does the index fund deliver after ${n} years, in euros?`
            : `Quel capital le fonds indiciel délivre-t-il après ${n} ans, en euros ?`,
          reponse: repEtf, tolerance: 0.005, unite: '€',
          etapes: [
            {
              titre: en ? 'Fees come off the rate, every single year' : 'Les frais se retranchent du taux, chaque année',
              contenu: en
                ? `Net rate = gross return − fees = ${f(r, 1)} − ${f(f1, 2)} = ${pct(r2(netEtf))}. Final capital = $C \\times (1 + r_{net})^{n}$ — the fee is not a one-off toll, it compounds against you ${n} times.`
                : `Taux net = rendement brut − frais = ${f(r, 1)} − ${f(f1, 2)} = ${pct(r2(netEtf))}. Capital final = $C \\times (1 + r_{net})^{n}$ — les frais ne sont pas un péage unique, ils se composent contre vous ${n} fois.`,
            },
            {
              titre: en ? 'Application' : 'Application',
              contenu: en
                ? `${f(C, 0)} × (1 + ${f(netEtf, 2)}/100)^${n} = ${f(C, 0)} × ${f(Math.pow(1 + netEtf / 100, n), 4)} = **${eur(repEtf)}**.`
                : `${f(C, 0)} × (1 + ${f(netEtf, 2)}/100)^${n} = ${f(C, 0)} × ${f(Math.pow(1 + netEtf / 100, n), 4)} = **${eur(repEtf)}**.`,
            },
          ],
        },
        {
          intitule: en ? 'b) The active-fund capital at the horizon' : "b) Le capital du fonds actif à l'horizon",
          enonce: en
            ? `Same gross return, ${f(f2, 2)}% of fees: what capital does the active fund deliver, in euros?`
            : `Même rendement brut, ${f(f2, 2)} % de frais : quel capital le fonds actif délivre-t-il, en euros ?`,
          reponse: repActif, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'Same formula, thinner rate' : 'Même formule, taux raboté',
            contenu: en
              ? `Net rate: ${f(r, 1)} − ${f(f2, 2)} = ${pct(r2(netActif))}. Capital: ${f(C, 0)} × (1 + ${f(netActif, 2)}/100)^${n} = ${f(C, 0)} × ${f(Math.pow(1 + netActif / 100, n), 4)} = **${eur(repActif)}**. The fee gap looks small (${f(r2(f2 - f1))} point${f2 - f1 >= 2 ? 's' : ''} a year); the exponent is what turns it into a chasm.`
              : `Taux net : ${f(r, 1)} − ${f(f2, 2)} = ${pct(r2(netActif))}. Capital : ${f(C, 0)} × (1 + ${f(netActif, 2)}/100)^${n} = ${f(C, 0)} × ${f(Math.pow(1 + netActif / 100, n), 4)} = **${eur(repActif)}**. L'écart de frais paraît mince (${f(r2(f2 - f1))} point(s) par an) ; c'est l'exposant qui le transforme en gouffre.`,
          }],
          pieges: [en
            ? `Computing ${f(C, 0)} × (1 + ${f(r, 1)}/100)^${n} then subtracting ${n} years of fees on the initial capital ignores compounding: fees eat the growth of the growth.`
            : `Calculer ${f(C, 0)} × (1 + ${f(r, 1)}/100)^${n} puis soustraire ${n} années de frais sur le capital initial ignore la composition : les frais mangent la croissance de la croissance.`],
        },
        {
          intitule: en ? 'c) The gap in euros' : "c) L'écart en euros",
          enonce: en
            ? `How many euros separate the two final capitals?`
            : `Combien d'euros séparent les deux capitaux finaux ?`,
          reponse: repEcart, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'Subtract — and weigh it' : 'Soustraire — et peser',
            contenu: en
              ? `${f(repEtf)} − ${f(repActif)} = **${eur(repEcart)}**, i.e. ${f(r2(ecart / C), 1)} times the initial capital, gone in fees and forgone compounding. For scale, the active fund collected roughly ${f(f2, 2)}% × ${n} years on a growing base — and each euro collected stopped compounding for the client that very day.`
              : `${f(repEtf)} − ${f(repActif)} = **${eur(repEcart)}**, soit ${f(r2(ecart / C), 1)} fois le capital initial, partis en frais et en composition perdue. Pour l'échelle : le fonds actif a prélevé environ ${f(f2, 2)} % × ${n} ans sur une base croissante — et chaque euro prélevé a cessé de composer pour le client le jour même.`,
          }],
        },
        {
          intitule: en ? 'd) The gap as a share of the capital' : "d) L'écart en pourcentage du capital",
          enonce: en
            ? `Express the gap as a percentage of the index-fund final capital.`
            : `Exprimez l'écart en pourcentage du capital final du fonds indiciel.`,
          reponse: repEcartPct, tolerance: 0.5, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'The share the fee differential confiscated' : 'La part confisquée par le différentiel de frais',
              contenu: en
                ? `${f(repEcart)} / ${f(repEtf)} × 100 = **${pct(repEcartPct)}** of the achievable capital. A useful approximation to quote: each extra point of annual fees costs roughly n points of final capital over n years — here, ${f(r2(f2 - f1))} point × ${n} years ≈ ${pct(r2((f2 - f1) * n), 0)}, close to the exact figure.`
                : `${f(repEcart)} / ${f(repEtf)} × 100 = **${pct(repEcartPct)}** du capital atteignable. L'approximation utile à citer : chaque point de frais annuel supplémentaire coûte environ n points de capital final sur n ans — ici, ${f(r2(f2 - f1))} point × ${n} ans ≈ ${pct(r2((f2 - f1) * n), 0)}, proche du chiffre exact.`,
            },
            {
              titre: en ? 'The jury reflex' : 'Le réflexe de jury',
              contenu: en
                ? `The sentence that lands: "before debating whether the manager can beat the market, note that he must beat it by ${f(r2(f2 - f1))} points a year just to break even with the index fund — over ${n} years, the burden of proof costs ${pct(repEcartPct)} of the capital." Fees are certain; alpha is a hypothesis (chapter 2's 2/20 debate, module 12's efficiency debate).`
                : `La phrase qui marque : « avant de débattre si le gérant peut battre le marché, notez qu'il doit le battre de ${f(r2(f2 - f1))} points par an juste pour égaler le fonds indiciel — sur ${n} ans, cette charge de la preuve coûte ${pct(repEcartPct)} du capital. » Les frais sont certains ; l'alpha est une hypothèse (débat 2/20 du chapitre 2, débat d'efficience du module 12).`,
            },
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 6. m1-pb-selection-adverse — N4, boss 1                             */
/* ------------------------------------------------------------------ */
const selectionAdverse: ProblemGenerator = {
  id: 'm1-pb-selection-adverse', moduleId: M1,
  titre: 'Coter face aux mieux informés',
  titreEn: 'Quoting against better-informed traders',
  typeDeCas: 'sélection adverse & spread',
  typeDeCasEn: 'adverse selection & spread',
  difficulte: 4,
  scenarios: ['Market maker actions à la veille de résultats', 'Desk HFT qui recalibre ses cotations', 'Teneur de marché obligataire face à un flux toxique'],
  scenariosEn: ['Equity market maker on results eve', 'HFT desk recalibrating its quotes', 'Bond market maker facing toxic flow'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const V = randInt(rng, 40, 120);
    const delta = pick(rng, [0.5, 1, 1.5, 2] as const);
    const p = pick(rng, [5, 8, 10, 12, 15, 20] as const);
    const N = randInt(rng, 20, 60) * 10;
    const T = pick(rng, [100, 200, 500] as const);
    const hFac = pick(rng, [0.4, 0.5, 0.6] as const);

    const pFrac = p / 100;
    const h = Math.round(pFrac * delta * hFac * 1000) / 1000;
    const perte = N * pFrac * (delta - h) * T;
    const gain = N * (1 - pFrac) * h * T;
    const spreadEqC = 2 * pFrac * delta * 100;
    const repPerte = r2(perte);
    const repGain = r2(gain);
    const repSpreadEq = r2(spreadEqC);
    const repSpreadDouble = r2(2 * spreadEqC);
    const hEqC = pFrac * delta * 100;

    const { en, f, eur, pct } = outils(langue);
    const desc = en
      ? `when the news breaks, the stock will be worth €${f(delta)} above or below today's fair value of €${f(V, 0)}, with equal odds; among the ${f(N, 0)} orders of ${f(T, 0)} shares you will face, ${f(p, 0)}% come from informed traders who already know the outcome, the rest trade for unrelated reasons; you currently quote a half-spread of €${f(h, 3)} on each side`
      : `quand la nouvelle tombera, le titre vaudra ${f(delta)} € au-dessus ou en dessous de sa valeur centrale actuelle de ${f(V, 0)} €, à chances égales ; parmi les ${f(N, 0)} ordres de ${f(T, 0)} titres que vous allez servir, ${f(p, 0)} % viennent d'intervenants informés qui connaissent déjà le résultat, le reste traite pour des raisons étrangères à l'information ; vous cotez actuellement une demi-fourchette de ${f(h, 3)} € de chaque côté`;
    const contexte = (en
      ? [
        `Results land tomorrow before the open and your screens already smell of it: ${desc}. Your sales colleague finds your quotes "too wide to win flow". Before tightening anything, price what each population of counterparties actually does to your book — then derive the only spread that survives the night.`,
        `Your HFT desk recalibrates its quoting engine before a macro release: ${desc}. The model needs the loss leg, the gain leg, and the equilibrium spread — the number the engine must converge to if it is not to bleed against the fast and informed.`,
        `On the bond desk, a persistent flow keeps hitting you on the same side and post-trade marks keep moving against you — the signature of toxic flow: ${desc}. Quantify the bleed, the cushion, and the spread that makes the two balance.`,
      ]
      : [
        `Les résultats tombent demain avant l'ouverture et vos écrans le sentent déjà : ${desc}. Votre collègue de vente trouve vos cotations « trop larges pour gagner du flux ». Avant de resserrer quoi que ce soit, chiffrez ce que chaque population de contreparties fait réellement à votre livre — puis dérivez le seul spread qui survive à la nuit.`,
        `Votre desk HFT recalibre son moteur de cotation avant une statistique macro : ${desc}. Le modèle a besoin de la jambe de perte, de la jambe de gain, et du spread d'équilibre — le chiffre vers lequel le moteur doit converger s'il ne veut pas saigner face aux rapides et aux informés.`,
        `Sur le desk obligataire, un flux persistant vous frappe toujours du même côté et les valorisations post-trade bougent systématiquement contre vous — la signature du flux toxique : ${desc}. Quantifiez l'hémorragie, le coussin, et le spread qui met les deux à l'équilibre.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The expected loss against the informed' : "a) L'espérance de perte face aux informés",
          enonce: en
            ? `Over the ${f(N, 0)} orders, what loss do you expect against the informed traders, in euros?`
            : `Sur les ${f(N, 0)} ordres, quelle perte espérez-vous face aux intervenants informés, en euros ?`,
          reponse: repPerte, tolerance: 0.005, unite: '€',
          etapes: [
            {
              titre: en ? 'The informed only trade when you are wrong' : "L'informé ne traite que quand vous avez tort",
              contenu: en
                ? `An informed trader buys your ask only if the value will be €${f(V + delta)}, sells on your bid only if it will be €${f(V - delta)}. Either way you lose the move minus your half-spread: ${f(delta)} − ${f(h, 3)} = ${eur(r2(delta - h), 3)} per share. There is no scenario where the informed trader pays you the spread and walks away wrong.`
                : `Un informé n'achète à votre ask que si la valeur sera ${f(V + delta)} €, ne vend sur votre bid que si elle sera ${f(V - delta)} €. Dans les deux cas vous perdez le mouvement moins votre demi-fourchette : ${f(delta)} − ${f(h, 3)} = ${eur(r2(delta - h), 3)} par titre. Il n'existe aucun scénario où l'informé vous paie le spread et repart en ayant tort.`,
            },
            {
              titre: en ? 'Sum over the toxic flow' : 'Sommer sur le flux toxique',
              contenu: en
                ? `Expected informed orders: ${f(N, 0)} × ${f(p, 0)}% = ${f(N * pFrac, 0)}, of ${f(T, 0)} shares each: ${f(N * pFrac, 0)} × ${f(r2(delta - h), 3)} × ${f(T, 0)} = **${eur(repPerte)}**.`
                : `Ordres informés attendus : ${f(N, 0)} × ${f(p, 0)} % = ${f(N * pFrac, 0)}, de ${f(T, 0)} titres chacun : ${f(N * pFrac, 0)} × ${f(r2(delta - h), 3)} × ${f(T, 0)} = **${eur(repPerte)}**.`,
            },
          ],
        },
        {
          intitule: en ? 'b) The gain on the uninformed flow' : 'b) Le gain sur le flux non informé',
          enonce: en
            ? `Over the same ${f(N, 0)} orders, what do you expect to earn from the uninformed flow, in euros?`
            : `Sur les mêmes ${f(N, 0)} ordres, combien espérez-vous gagner sur le flux non informé, en euros ?`,
          reponse: repGain, tolerance: 0.005, unite: '€',
          etapes: [
            {
              titre: en ? 'The ordinary flow pays the half-spread' : 'Le flux ordinaire paie la demi-fourchette',
              contenu: en
                ? `A rebalancing fund or a saver trades at your quote for reasons unrelated to the news: on average you pocket the half-spread, ${eur(h, 3)} per share. Over ${f(N, 0)} × ${f(100 - p, 0)}% = ${f(N * (1 - pFrac), 0)} orders: ${f(N * (1 - pFrac), 0)} × ${f(h, 3)} × ${f(T, 0)} = **${eur(repGain)}**.`
                : `Un fonds qui se rééquilibre ou un épargnant traite à votre cotation pour des raisons étrangères à la nouvelle : en moyenne vous empochez la demi-fourchette, ${eur(h, 3)} par titre. Sur ${f(N, 0)} × ${f(100 - p, 0)} % = ${f(N * (1 - pFrac), 0)} ordres : ${f(N * (1 - pFrac), 0)} × ${f(h, 3)} × ${f(T, 0)} = **${eur(repGain)}**.`,
            },
            {
              titre: en ? 'The day, netted' : 'La journée, en net',
              contenu: en
                ? `Net expectation: ${f(repGain)} − ${f(repPerte)} = **${eur(r2(gain - perte))}**. Your current half-spread of €${f(h, 3)} is BELOW the break-even level: the ordinary flow no longer subsidises the losses to the informed. The spread is not a toll — it is an insurance premium, and yours is underpriced.`
                : `Espérance nette : ${f(repGain)} − ${f(repPerte)} = **${eur(r2(gain - perte))}**. Votre demi-fourchette actuelle de ${f(h, 3)} € est SOUS le niveau d'équilibre : le flux ordinaire ne subventionne plus les pertes face aux informés. Le spread n'est pas un péage — c'est une prime d'assurance, et la vôtre est sous-tarifée.`,
            },
          ],
          pieges: [en
            ? `Multiplying all ${f(N, 0)} orders by the half-spread counts the informed as ordinary clients — precisely the accounting mistake adverse selection punishes.`
            : `Multiplier les ${f(N, 0)} ordres entiers par la demi-fourchette compte les informés comme des clients ordinaires — précisément l'erreur comptable que la sélection adverse punit.`],
        },
        {
          intitule: en ? 'c) The equilibrium spread' : "c) Le spread d'équilibre",
          enonce: en
            ? `Using the simplified Glosten-Milgrom logic of chapter 5, what full spread (in cents per share) makes your expected P&L exactly zero?`
            : `Avec la logique Glosten-Milgrom simplifiée du chapitre 5, quel spread complet (en centimes par titre) rend votre espérance de P&L exactement nulle ?`,
          reponse: repSpreadEq, tolerance: 0.1, toleranceMode: 'absolu', unite: en ? 'cents' : 'centimes',
          etapes: [
            {
              titre: en ? 'Price each side as a conditional expectation' : 'Coter chaque côté comme une espérance conditionnelle',
              contenu: en
                ? `Receiving a buy order is itself bad news for the seller: conditional on a buy, the expected value is no longer €${f(V, 0)} but €${f(V, 0)} + p·δ. The zero-profit ask is therefore ${f(V, 0)} + ${f(pFrac, 2)} × ${f(delta)} and the bid ${f(V, 0)} − ${f(pFrac, 2)} × ${f(delta)}: half-spread h* = p × δ = ${f(hEqC, 2)} cents.`
                : `Recevoir un ordre d'achat est en soi une mauvaise nouvelle pour le vendeur : conditionnellement à un achat, la valeur espérée n'est plus ${f(V, 0)} € mais ${f(V, 0)} € + p·δ. L'ask à profit nul est donc ${f(V, 0)} + ${f(pFrac, 2)} × ${f(delta)} et le bid ${f(V, 0)} − ${f(pFrac, 2)} × ${f(delta)} : demi-fourchette h* = p × δ = ${f(hEqC, 2)} centimes.`,
            },
            {
              titre: en ? 'Check the balance, then double it' : "Vérifier l'équilibre, puis doubler",
              contenu: en
                ? `At h* = p·δ, losses and gains cancel exactly: p × (δ − pδ) = pδ(1 − p) = (1 − p) × pδ — each side of the book breaks even on average. Full spread = 2pδ = 2 × ${f(pFrac, 2)} × ${f(delta)} = **${f(repSpreadEq)} cents**, without a single cent of inventory or processing cost: adverse selection alone manufactures it.`
                : `À h* = p·δ, pertes et gains s'annulent exactement : p × (δ − pδ) = pδ(1 − p) = (1 − p) × pδ — chaque côté du carnet est à l'équilibre en moyenne. Spread complet = 2pδ = 2 × ${f(pFrac, 2)} × ${f(delta)} = **${f(repSpreadEq)} centimes**, sans le moindre centime de coût d'inventaire ou de traitement : la sélection adverse seule le fabrique.`,
            },
          ],
          pieges: [en
            ? `Quoting δ itself (${f(delta * 100, 0)} cents of half-spread) would protect you fully but kill all flow: the equilibrium prices the AVERAGE toxicity, not the worst case.`
            : `Coter δ lui-même (${f(delta * 100, 0)} centimes de demi-fourchette) vous protégerait totalement mais tuerait tout le flux : l'équilibre tarife la toxicité MOYENNE, pas le pire cas.`],
        },
        {
          intitule: en ? 'd) The spread when informed share doubles' : 'd) Le spread quand la part informée double',
          enonce: en
            ? `Rumours intensify and the informed share doubles from ${pct(p, 0)} to ${pct(2 * p, 0)}. What does the equilibrium spread become, in cents?`
            : `Les rumeurs s'intensifient et la part informée double, de ${pct(p, 0)} à ${pct(2 * p, 0)}. Que devient le spread d'équilibre, en centimes ?`,
          reponse: repSpreadDouble, tolerance: 0.1, toleranceMode: 'absolu', unite: en ? 'cents' : 'centimes',
          etapes: [
            {
              titre: en ? 'Linear in p — and that is the lesson' : 'Linéaire en p — et c\'est la leçon',
              contenu: en
                ? `Spread = 2pδ is linear in the informed share: 2 × ${f(2 * pFrac, 2)} × ${f(delta)} = **${f(repSpreadDouble)} cents** — exactly double c). Liquidity deteriorates one-for-one with the probability of facing someone who knows.`
                : `Spread = 2pδ est linéaire en la part informée : 2 × ${f(2 * pFrac, 2)} × ${f(delta)} = **${f(repSpreadDouble)} centimes** — exactement le double du c). La liquidité se détériore un pour un avec la probabilité de croiser quelqu'un qui sait.`,
            },
            {
              titre: en ? 'What the screen shows before every announcement' : "Ce que l'écran montre avant chaque annonce",
              contenu: en
                ? `This is why spreads widen mechanically before results, central-bank meetings and macro prints: nobody "decides" it, every market maker solves the same equation as p rises. The trader who reads a widening spread is reading the market's estimate of informed flow in real time — the chapter-5 reflex worth quoting to any jury.`
                : `Voilà pourquoi les fourchettes s'élargissent mécaniquement avant résultats, réunions de banque centrale et statistiques macro : personne ne le « décide », chaque market maker résout la même équation quand p monte. Le trader qui lit un spread qui s'élargit lit en temps réel l'estimation du flux informé par le marché — le réflexe du chapitre 5 à citer devant n'importe quel jury.`,
            },
          ],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 7. m1-pb-decouper-un-gros-ordre — N4, boss 2                        */
/* ------------------------------------------------------------------ */
const decouperUnGrosOrdre: ProblemGenerator = {
  id: 'm1-pb-decouper-un-gros-ordre', moduleId: M1,
  titre: 'Découper un gros ordre',
  titreEn: 'Slicing a block order',
  typeDeCas: "exécution d'un bloc",
  typeDeCasEn: 'block execution',
  difficulte: 4,
  scenarios: ["Desk d'exécution chargé d'un bloc de 50 000 titres", 'Fonds qui solde une ligne sans se faire repérer', "Prop trader qui calibre son algorithme d'exécution"],
  scenariosEn: ['Execution desk handed a 50,000-share block', 'Fund unwinding a line without being spotted', 'Prop trader calibrating his execution algorithm'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const mid = randInt(rng, 20, 80);
    const demiC = pick(rng, [2, 5] as const);
    const stC = pick(rng, [5, 10, 20] as const);
    const s1 = pick(rng, [5000, 10000] as const);
    const k = pick(rng, [5, 6, 8, 10] as const);
    const dt = pick(rng, [2, 5, 10] as const);

    const Q = k * s1;
    const bid = r2(mid - demiC / 100);
    const a1 = r2(mid + demiC / 100);
    const a2 = r2(a1 + stC / 100);
    const a3 = r2(a1 + (2 * stC) / 100);
    const a4 = r2(a1 + (4 * stC) / 100);
    const niveaux: NiveauCarnet[] = [
      { prix: a1, taille: s1 },
      { prix: a2, taille: s1 },
      { prix: a3, taille: 2 * s1 },
      { prix: a4, taille: 6 * s1 },
    ];
    const exec = executionCarnet(Q, niveaux);
    const coutBrutal = exec.coutTotal - Q * mid;
    const coutDecoupe = coutTraverseeSpread(Q, bid, a1, 'achat');
    const economie = coutBrutal - coutDecoupe;
    const notionnel = Q * mid;
    const economiePb = (economie / notionnel) * 10_000;
    const duree = (k - 1) * dt;
    const derive = (Q / 2) * (stC / 100); // illustration : une dérive d'un cran sur la moitié des tranches
    const repBrutal = r2(coutBrutal);
    const repDecoupe = r2(coutDecoupe);
    const repEconomie = r2(economie);
    const repEconomiePb = r2(economiePb);
    const repDuree = duree;

    const { en, f, eur, bp } = outils(langue);
    const desc = en
      ? `you must buy ${f(Q, 0)} shares of a stock whose mid stands at €${f(mid, 0)} (bid €${f(bid)}). First ask level: ${f(s1, 0)} shares at €${f(a1)}; deeper levels: ${f(s1, 0)} at €${f(a2)}, ${f(2 * s1, 0)} at €${f(a3)} and ${f(6 * s1, 0)} at €${f(a4)}. The alternative execution plan: ${k} tranches of ${f(s1, 0)} shares, one every ${dt} minutes, each consuming the first level only — assumed to refill identically between tranches`
      : `vous devez acheter ${f(Q, 0)} titres d'une valeur dont le milieu cote ${f(mid, 0)} € (bid ${f(bid)} €). Premier niveau vendeur : ${f(s1, 0)} titres à ${f(a1)} € ; niveaux suivants : ${f(s1, 0)} à ${f(a2)} €, ${f(2 * s1, 0)} à ${f(a3)} € et ${f(6 * s1, 0)} à ${f(a4)} €. Le plan d'exécution alternatif : ${k} tranches de ${f(s1, 0)} titres, une toutes les ${dt} minutes, chacune ne consommant que le premier niveau — supposé se reconstituer à l'identique entre deux tranches`;
    const contexte = (en
      ? [
        `The portfolio manager dropped the block on your desk at 2 pm: ${desc}. Two routes, one decision: smash the book now, or slice. The client pays the difference — quantify it before choosing, and know what the slicing bet actually assumes.`,
        `Your fund must exit financing a position quietly, and the buy leg comes first: ${desc}. The investment committee asks for the brutal cost, the sliced cost, the saving — and an honest line on what the slicing hypothesis hides.`,
        `Before going live, your execution algorithm needs its benchmark numbers on a textbook book: ${desc}. Brutal walk versus patient slicing: the gap between the two is precisely the value your algo claims to capture.`,
      ]
      : [
        `Le gérant a déposé le bloc sur votre desk à 14 h : ${desc}. Deux routes, une décision : défoncer le carnet maintenant, ou découper. Le client paie la différence — chiffrez-la avant de choisir, et sachez ce que le pari du découpage suppose réellement.`,
        `Votre fonds doit déboucler discrètement, et la jambe d'achat passe d'abord : ${desc}. Le comité d'investissement demande le coût brutal, le coût découpé, l'économie — et une ligne honnête sur ce que cache l'hypothèse du découpage.`,
        `Avant la mise en production, votre algorithme d'exécution a besoin de ses chiffres de référence sur un carnet d'école : ${desc}. Marche brutale contre découpage patient : l'écart entre les deux est précisément la valeur que votre algo prétend capturer.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The cost of brutal execution' : "a) Le coût de l'exécution brutale",
          enonce: en
            ? `One single market order for the ${f(Q, 0)} shares walks the book. Versus the mid, what does it cost, in euros?`
            : `Un seul ordre au marché pour les ${f(Q, 0)} titres marche le carnet. Par rapport au milieu, combien coûte-t-il, en euros ?`,
          reponse: repBrutal, tolerance: 0.005, unite: '€',
          etapes: [
            {
              titre: en ? 'Walk every level' : 'Marcher tous les niveaux',
              contenu: en
                ? `The order consumes ${f(s1, 0)} at €${f(a1)}, ${f(s1, 0)} at €${f(a2)}, ${f(2 * s1, 0)} at €${f(a3)} and ${f(Q - 4 * s1, 0)} at €${f(a4)}: total ${eur(exec.coutTotal)}, i.e. an average price of ${eur(r4(exec.prixMoyen), 4)}.`
                : `L'ordre consomme ${f(s1, 0)} à ${f(a1)} €, ${f(s1, 0)} à ${f(a2)} €, ${f(2 * s1, 0)} à ${f(a3)} € et ${f(Q - 4 * s1, 0)} à ${f(a4)} € : total ${eur(exec.coutTotal)}, soit un prix moyen de ${eur(r4(exec.prixMoyen), 4)}.`,
            },
            {
              titre: en ? 'Cost against the mid' : 'Coût contre le milieu',
              contenu: en
                ? `${f(exec.coutTotal)} − ${f(Q, 0)} × ${f(mid, 0)} = **${eur(repBrutal)}**. The last level alone (€${f(a4)}) carries most of the bill: the deeper the order digs, the more each marginal share costs.`
                : `${f(exec.coutTotal)} − ${f(Q, 0)} × ${f(mid, 0)} = **${eur(repBrutal)}**. Le dernier niveau à lui seul (${f(a4)} €) porte l'essentiel de la facture : plus l'ordre creuse, plus chaque titre marginal coûte cher.`,
            },
          ],
        },
        {
          intitule: en ? 'b) The cost of sliced execution' : 'b) Le coût du découpage',
          enonce: en
            ? `Under the refill hypothesis, what do the ${k} tranches cost in total versus the mid, in euros?`
            : `Sous l'hypothèse de reconstitution, combien coûtent les ${k} tranches au total par rapport au milieu, en euros ?`,
          reponse: repDecoupe, tolerance: 0.005, unite: '€',
          etapes: [
            {
              titre: en ? 'Each tranche pays only the half-spread' : 'Chaque tranche ne paie que la demi-fourchette',
              contenu: en
                ? `Each tranche of ${f(s1, 0)} shares fits inside the first level and pays €${f(a1)}, i.e. the half-spread of ${f(r2(a1 - mid))} per share. Over ${k} tranches: ${f(Q, 0)} × ${f(r2(a1 - mid))} = **${eur(repDecoupe)}**.`
                : `Chaque tranche de ${f(s1, 0)} titres tient dans le premier niveau et paie ${f(a1)} €, soit la demi-fourchette de ${f(r2(a1 - mid))} par titre. Sur ${k} tranches : ${f(Q, 0)} × ${f(r2(a1 - mid))} = **${eur(repDecoupe)}**.`,
            },
            {
              titre: en ? 'Name the hypothesis — it is doing all the work' : "Nommer l'hypothèse — c'est elle qui fait tout le travail",
              contenu: en
                ? `"The first level refills identically every ${dt} minutes" assumes other sellers keep posting ${f(s1, 0)} shares at €${f(a1)} as if nothing happened — no price drift, no detection. That is the BEST case of slicing, not a law of nature; real algos (VWAP, POV) spend their lives managing the gap between this hypothesis and reality.`
                : `« Le premier niveau se reconstitue à l'identique toutes les ${dt} minutes » suppose que d'autres vendeurs reposent ${f(s1, 0)} titres à ${f(a1)} € comme si de rien n'était — aucune dérive de prix, aucune détection. C'est le MEILLEUR cas du découpage, pas une loi de la nature ; les vrais algos (VWAP, POV) passent leur vie à gérer l'écart entre cette hypothèse et la réalité.`,
            },
          ],
        },
        {
          intitule: en ? 'c) The saving, in euros' : "c) L'économie, en euros",
          enonce: en
            ? `How much does slicing save versus the brutal walk, in euros?`
            : `Combien le découpage économise-t-il par rapport à la marche brutale, en euros ?`,
          reponse: repEconomie, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'a) minus b) — the depth bill vanishes' : 'a) moins b) — la facture de profondeur disparaît',
            contenu: en
              ? `${f(repBrutal)} − ${f(repDecoupe)} = **${eur(repEconomie)}**. Slicing does not shrink the half-spread (both routes pay it on every share); it erases the DEPTH cost — the €${f(r2(a2 - a1))} to €${f(r2(a4 - a1))} surcharges of the deeper levels.`
              : `${f(repBrutal)} − ${f(repDecoupe)} = **${eur(repEconomie)}**. Le découpage ne réduit pas la demi-fourchette (les deux routes la paient sur chaque titre) ; il efface le coût de PROFONDEUR — les surcoûts de ${f(r2(a2 - a1))} € à ${f(r2(a4 - a1))} € des niveaux suivants.`,
          }],
        },
        {
          intitule: en ? 'd) The saving, in basis points' : "d) L'économie, en points de base",
          enonce: en
            ? `Express the saving in basis points of the order's notional (${f(Q, 0)} shares × €${f(mid, 0)}).`
            : `Exprimez l'économie en points de base du notionnel de l'ordre (${f(Q, 0)} titres × ${f(mid, 0)} €).`,
          reponse: repEconomiePb, tolerance: 0.1, toleranceMode: 'absolu', unite: en ? 'bp' : 'pb',
          etapes: [{
            titre: en ? 'The unit clients are billed in' : "L'unité dans laquelle les clients sont facturés",
            contenu: en
              ? `${f(repEconomie)} / ${f(notionnel, 0)} × 10,000 = **${bp(repEconomiePb)}**. For scale: an execution desk's entire commission is often 2–5 bp — good slicing can be worth several times the fee that pays for it. That is the economic case for execution algorithms in one number.`
              : `${f(repEconomie)} / ${f(notionnel, 0)} × 10 000 = **${bp(repEconomiePb)}**. Pour l'échelle : la commission entière d'un desk d'exécution vaut souvent 2 à 5 pb — un bon découpage peut valoir plusieurs fois les frais qui le rémunèrent. C'est l'argument économique des algorithmes d'exécution en un seul chiffre.`,
          }],
        },
        {
          intitule: en ? 'e) The price of patience, in minutes' : 'e) Le prix de la patience, en minutes',
          enonce: en
            ? `How many minutes elapse between the first and the last tranche?`
            : `Combien de minutes s'écoulent entre la première et la dernière tranche ?`,
          reponse: repDuree, tolerance: 0.5, toleranceMode: 'absolu', unite: 'min',
          etapes: [
            {
              titre: en ? 'k tranches, k − 1 intervals' : 'k tranches, k − 1 intervalles',
              contenu: en
                ? `(${k} − 1) × ${dt} = **${f(repDuree, 0)} minutes** of exposure. During that window the order is a sitting signal: the same ${f(s1, 0)}-share clip hitting the ask every ${dt} minutes is exactly the pattern detection engines hunt for.`
                : `(${k} − 1) × ${dt} = **${f(repDuree, 0)} minutes** d'exposition. Pendant cette fenêtre, l'ordre est un signal assis : le même paquet de ${f(s1, 0)} titres frappant l'ask toutes les ${dt} minutes est exactement le motif que les moteurs de détection traquent.`,
            },
            {
              titre: en ? 'The leakage arithmetic' : "L'arithmétique de la fuite",
              contenu: en
                ? `One illustrative number: if detection lets the first level drift just one step (${f(stC, 0)} cents) for the second half of the tranches, the surcharge is ≈ ${f(Q / 2, 0)} × ${f(stC / 100)} = ${eur(r2(derive))} — against a saving of ${eur(repEconomie)}. ${derive < economie ? 'Slicing still wins here, but the margin is no longer free:' : 'The whole saving evaporates:'} the real trade-off is depth cost now versus information leakage over ${f(repDuree, 0)} minutes. That trade-off — not the formula — is the N4 answer.`
                : `Un chiffre pour illustrer : si la détection laisse le premier niveau dériver d'un seul cran (${f(stC, 0)} centimes) sur la seconde moitié des tranches, le surcoût vaut ≈ ${f(Q / 2, 0)} × ${f(stC / 100)} = ${eur(r2(derive))} — contre une économie de ${eur(repEconomie)}. ${derive < economie ? "Le découpage gagne encore ici, mais la marge n'est plus gratuite :" : "Toute l'économie s'évapore :"} le vrai arbitrage, c'est coût de profondeur immédiat contre fuite d'information pendant ${f(repDuree, 0)} minutes. Cet arbitrage — pas la formule — est la réponse N4.`,
            },
          ],
          pieges: [en
            ? `Answering ${k} × ${dt} = ${f(k * dt, 0)} minutes counts one interval too many: the first tranche fires at t = 0.`
            : `Répondre ${k} × ${dt} = ${f(k * dt, 0)} minutes compte un intervalle de trop : la première tranche part à t = 0.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 8. m1-pb-appels-de-marge-ccp — N4, boss 3                           */
/* ------------------------------------------------------------------ */
const appelsDeMargeCcp: ProblemGenerator = {
  id: 'm1-pb-appels-de-marge-ccp', moduleId: M1,
  titre: "L'appel de marge qui fait plier un courtier",
  titreEn: 'The margin call that bends a broker',
  typeDeCas: 'marges & compensation',
  typeDeCasEn: 'margins & clearing',
  difficulte: 4,
  scenarios: ['Courtier en ligne face à la CCP, un matin de janvier 2021', 'Membre compensateur sous un choc de volatilité', 'Risk manager de la CCP qui recalibre ses marges'],
  scenariosEn: ['Online broker facing the CCP, one January 2021 morning', 'Clearing member under a volatility shock', 'CCP risk manager recalibrating margins'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const Q = randInt(rng, 2, 9) * 100_000;
    const P = randInt(rng, 15, 60);
    const m0 = randFloat(rng, 5, 10, 1);
    const mult = pick(rng, [3, 4, 5] as const);
    const facE = randFloat(rng, 0.2, 0.5, 2);
    const X = pick(rng, [50_000, 100_000, 200_000] as const);

    const m1pct = r1(m0 * mult);
    const margeInitiale = Q * P * (m0 / 100);
    const margeNouvelle = Q * P * (m1pct / 100);
    const appel = margeNouvelle - margeInitiale;
    const E = Math.round(margeInitiale + (margeNouvelle - margeInitiale) * facE);
    const reduction = Math.round((margeNouvelle - E) / (P * (m1pct / 100)));
    const surcout = X * P * (m1pct / 100);
    const repInitiale = r2(margeInitiale);
    const repNouvelle = r2(margeNouvelle);
    const repAppel = r2(appel);
    const repReduction = reduction;
    const repSurcout = r2(surcout);

    const { en, f, eur, pct } = outils(langue);
    const desc = en
      ? `the clearing house margins your net client position of ${f(Q, 0)} shares at €${f(P, 0)}; overnight volatility explodes and the initial margin rate of ${f(m0, 1)}% is raised to ${f(m1pct, 1)}%, while your collateral envelope holds €${f(E, 0)}. The risk team also wants to know what ${f(X, 0)} additional shares bought by clients would change`
      : `la chambre de compensation marge votre position nette cliente de ${f(Q, 0)} titres à ${f(P, 0)} € ; la volatilité explose dans la nuit et le taux de marge initiale de ${f(m0, 1)} % est relevé à ${f(m1pct, 1)} %, alors que votre enveloppe de collatéral disponible contient ${f(E, 0)} €. L'équipe risques veut aussi savoir ce que changeraient ${f(X, 0)} titres supplémentaires achetés par les clients`;
    const contexte = (en
      ? [
        `6:30 am, the overnight file from the clearing house is on your screen and the number does not fit in the column: ${desc}. Before the market opens you must know exactly what is owed, what is missing, and which lever actually reduces the requirement — the GameStop morning, from the inside.`,
        `As a clearing member, your treasury desk monitors margin headroom daily — and today the volatility shock rewrote every line: ${desc}. Walk the numbers in order: old margin, new margin, the call, and the position cut that brings you back inside the envelope.`,
        `On the CCP side, you recalibrate the margin model after the volatility spike and must document its impact on a representative member: ${desc}. The board wants the mechanics made explicit — including why restricting BUY orders, not sales, is what shrinks the requirement.`,
      ]
      : [
        `6 h 30, le fichier overnight de la chambre de compensation est à l'écran et le chiffre ne tient pas dans la colonne : ${desc}. Avant l'ouverture, vous devez savoir exactement ce qui est dû, ce qui manque, et quel levier réduit réellement l'exigence — le matin GameStop, vu de l'intérieur.`,
        `Membre compensateur, votre desk de trésorerie surveille chaque jour la marge disponible — et aujourd'hui le choc de volatilité a réécrit toutes les lignes : ${desc}. Déroulez les chiffres dans l'ordre : ancienne marge, nouvelle marge, l'appel, puis la réduction de position qui vous ramène dans l'enveloppe.`,
        `Côté CCP, vous recalibrez le modèle de marge après le pic de volatilité et devez documenter son impact sur un membre représentatif : ${desc}. Le conseil veut la mécanique explicite — y compris pourquoi restreindre les ACHATS, et non les ventes, est ce qui réduit l'exigence.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The initial margin, before the shock' : 'a) La marge initiale, avant le choc',
          enonce: en
            ? `What initial margin was the position consuming at ${pct(m0, 1)}, in euros?`
            : `Quelle marge initiale la position consommait-elle à ${pct(m0, 1)}, en euros ?`,
          reponse: repInitiale, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'Exposure × rate' : 'Exposition × taux',
            contenu: en
              ? `Net exposure: ${f(Q, 0)} × ${f(P, 0)} = ${eur(Q * P)}. Initial margin = ${f(Q * P, 0)} × ${f(m0, 1)}% = **${eur(repInitiale)}** — the deposit sized to cover the CCP's loss if it had to liquidate your position in stressed conditions (chapter 7).`
              : `Exposition nette : ${f(Q, 0)} × ${f(P, 0)} = ${eur(Q * P)}. Marge initiale = ${f(Q * P, 0)} × ${f(m0, 1)} % = **${eur(repInitiale)}** — le dépôt calibré pour couvrir la perte de la CCP si elle devait liquider votre position en conditions dégradées (chapitre 7).`,
          }],
        },
        {
          intitule: en ? 'b) The new margin, after the shock' : 'b) La nouvelle marge, après le choc',
          enonce: en
            ? `At the new ${pct(m1pct, 1)} rate, what margin does the same position require, in euros?`
            : `Au nouveau taux de ${pct(m1pct, 1)}, quelle marge la même position exige-t-elle, en euros ?`,
          reponse: repNouvelle, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'Same position, repriced risk' : 'Même position, risque retarifé',
            contenu: en
              ? `${f(Q * P, 0)} × ${f(m1pct, 1)}% = **${eur(repNouvelle)}** — ${f(mult, 0)} times a), with not a single share traded. The margin model reprices VOLATILITY, not your behaviour: that is what "the formula explodes" means in the GameStop story.`
              : `${f(Q * P, 0)} × ${f(m1pct, 1)} % = **${eur(repNouvelle)}** — ${f(mult, 0)} fois le a), sans qu'un seul titre ait été traité. Le modèle de marge retarife la VOLATILITÉ, pas votre comportement : c'est cela, « la formule explose » de l'histoire GameStop.`,
          }],
        },
        {
          intitule: en ? 'c) The overnight margin call' : "c) L'appel de marge overnight",
          enonce: en
            ? `How much additional collateral does the CCP call this morning, in euros?`
            : `Combien de collatéral supplémentaire la CCP appelle-t-elle ce matin, en euros ?`,
          reponse: repAppel, tolerance: 0.005, unite: '€',
          etapes: [
            {
              titre: en ? 'New minus old' : 'Nouveau moins ancien',
              contenu: en
                ? `${f(repNouvelle)} − ${f(repInitiale)} = **${eur(repAppel)}**, due before the open, in cash or eligible collateral. Robinhood's version of this line went from $0.7bn to $3.7bn in one night.`
                : `${f(repNouvelle)} − ${f(repInitiale)} = **${eur(repAppel)}**, exigibles avant l'ouverture, en cash ou collatéral éligible. La version Robinhood de cette ligne est passée de 0,7 à 3,7 Md$ en une nuit.`,
            },
            {
              titre: en ? 'Why the CCP is entitled to it' : 'Pourquoi la CCP y a droit',
              contenu: en
                ? `Through novation, the CCP faces every buyer and every seller: your clients' unsettled trades are HER risk for the settlement window. A member that cannot meet the call is in default — and the waterfall starts with that member's own margins.`
                : `Par la novation, la CCP fait face à tous les acheteurs et tous les vendeurs : les trades non dénoués de vos clients sont SON risque pendant la fenêtre de règlement. Un membre qui ne répond pas à l'appel est en défaut — et la cascade commence par les marges de ce membre.`,
            },
          ],
          pieges: [en
            ? `Reading c) as a penalty misses the mechanism: the call is collateral against YOUR clients' unsettled exposure, returned as positions settle or shrink.`
            : `Lire le c) comme une pénalité rate le mécanisme : l'appel est du collatéral contre l'exposition non dénouée de VOS clients, restitué à mesure que les positions se dénouent ou se réduisent.`],
        },
        {
          intitule: en ? 'd) The position cut that fits the envelope' : "d) La réduction de position qui rentre dans l'enveloppe",
          enonce: en
            ? `Your envelope holds €${f(E, 0)}. By how many shares must the net position shrink for the requirement to fit, at the new rate?`
            : `Votre enveloppe contient ${f(E, 0)} €. De combien de titres la position nette doit-elle se réduire pour que l'exigence tienne, au nouveau taux ?`,
          reponse: repReduction, tolerance: 0.005, unite: en ? 'shares' : 'titres',
          etapes: [
            {
              titre: en ? 'Each share carries its margin' : 'Chaque titre porte sa marge',
              contenu: en
                ? `One share requires ${f(P, 0)} × ${f(m1pct, 1)}% = ${eur(r2(P * (m1pct / 100)))} of margin. Excess requirement: ${f(repNouvelle)} − ${f(E, 0)} = ${eur(r2(margeNouvelle - E))}. Cut = ${f(r2(margeNouvelle - E))} / ${f(r2(P * (m1pct / 100)))} ≈ **${f(repReduction, 0)} shares** (out of ${f(Q, 0)}).`
                : `Un titre exige ${f(P, 0)} × ${f(m1pct, 1)} % = ${eur(r2(P * (m1pct / 100)))} de marge. Excès d'exigence : ${f(repNouvelle)} − ${f(E, 0)} = ${eur(r2(margeNouvelle - E))}. Réduction = ${f(r2(margeNouvelle - E))} / ${f(r2(P * (m1pct / 100)))} ≈ **${f(repReduction, 0)} titres** (sur ${f(Q, 0)}).`,
            },
          ],
        },
        {
          intitule: en ? 'e) Why suspending BUYS is the lever' : 'e) Pourquoi suspendre les ACHATS est le levier',
          enonce: en
            ? `If clients bought ${f(X, 0)} MORE shares instead, by how much would the requirement rise, in euros?`
            : `Si les clients achetaient au contraire ${f(X, 0)} titres de PLUS, de combien l'exigence monterait-elle, en euros ?`,
          reponse: repSurcout, tolerance: 0.005, unite: '€',
          etapes: [
            {
              titre: en ? 'Buys add exposure, sells remove it' : "Les achats ajoutent de l'exposition, les ventes en retirent",
              contenu: en
                ? `${f(X, 0)} × ${f(P, 0)} × ${f(m1pct, 1)}% = **${eur(repSurcout)}** of EXTRA requirement — on top of a call you already cannot fund. Every new buy grows the net position the CCP must guarantee through settlement; every sell shrinks it.`
                : `${f(X, 0)} × ${f(P, 0)} × ${f(m1pct, 1)} % = **${eur(repSurcout)}** d'exigence EN PLUS — par-dessus un appel que vous ne savez déjà pas financer. Chaque achat nouveau grossit la position nette que la CCP doit garantir jusqu'au dénouement ; chaque vente la réduit.`,
            },
            {
              titre: en ? 'The asymmetry, explained for the oral' : "L'asymétrie, expliquée pour l'oral",
              contenu: en
                ? `Hence the infamous "buys blocked, sells allowed": not a favour to short sellers, the only move that mechanically cuts the requirement while the broker recapitalises (chapter 7: volatility → margins recomputed → broker capital short → buy restrictions). The chain, recited in that order, is the answer that ranks you.`
                : `D'où le fameux « achats bloqués, ventes autorisées » : pas une faveur aux vendeurs à découvert, le seul geste qui réduit mécaniquement l'exigence pendant que le courtier se recapitalise (chapitre 7 : volatilité → marges recalculées → capital du courtier insuffisant → restriction des achats). La chaîne, récitée dans cet ordre, est la réponse qui classe.`,
            },
          ],
          pieges: [en
            ? `"The hedge funds called the broker" explains nothing this arithmetic does not: the parliamentary inquiry documented margin mechanics, not pressure.`
            : `« Les hedge funds ont appelé le courtier » n'explique rien que cette arithmétique n'explique : l'enquête parlementaire a documenté une mécanique de marges, pas des pressions.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 9. m1-pb-detection-spoofing — N4, boss 4                            */
/* ------------------------------------------------------------------ */
const detectionSpoofing: ProblemGenerator = {
  id: 'm1-pb-detection-spoofing', moduleId: M1,
  titre: 'Spoofing ou tenue de marché ?',
  titreEn: 'Spoofing or market making?',
  typeDeCas: 'surveillance & abus de marché',
  typeDeCasEn: 'surveillance & market abuse',
  difficulte: 4,
  scenarios: ["Analyste de la surveillance des marchés à l'AMF", 'Compliance officer alerté par le desk', 'Société HFT accusée à tort qui reconstitue ses logs'],
  scenariosEn: ['Market surveillance analyst at the AMF', 'Compliance officer alerted by the desk', 'Wrongly accused HFT firm rebuilding its logs'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const P = randInt(rng, 10, 60);
    const G = randInt(rng, 6, 15);
    const T = pick(rng, [5000, 10000, 20000] as const);
    const eV = pick(rng, [0, 200, 500] as const);
    const R = randInt(rng, 2, 8) * 1000;
    const deltaC = pick(rng, [5, 10, 15, 20] as const);

    const A = G * T;
    const annulation = ((A - eV) / A) * 100;
    const asymetrie = A / R;
    const deltaEur = deltaC / 100;
    const pnl = R * deltaEur;
    const economiePb = (deltaEur / P) * 10_000;
    const repAnnulation = r2(annulation);
    const repAsymetrie = r1(asymetrie);
    const repPnl = r2(pnl);
    const repEconomiePb = r2(economiePb);

    const { en, f, eur, pct, bp } = outils(langue);
    const desc = en
      ? `over twenty minutes, the trader posted ${G} large sell orders of ${f(T, 0)} shares each — ${f(A, 0)} shares displayed in total — and cancelled them after only ${f(eV, 0)} shares executed on that side; meanwhile he actually bought ${f(R, 0)} shares, paying ${f(deltaC, 0)} cents below the initial price of €${f(P, 0)}, before the displayed wall vanished and the price recovered`
      : `en vingt minutes, le trader a affiché ${G} gros ordres de vente de ${f(T, 0)} titres chacun — ${f(A, 0)} titres affichés au total — et les a annulés après seulement ${f(eV, 0)} titres exécutés de ce côté ; pendant ce temps, il a réellement acheté ${f(R, 0)} titres, payés ${f(deltaC, 0)} centimes sous le prix initial de ${f(P, 0)} €, avant que le mur affiché ne disparaisse et que le cours ne se rétablisse`;
    const contexte = (en
      ? [
        `The surveillance algorithm flagged a sequence on a mid-cap and the file lands on your desk at the AMF: ${desc}. Your job before any referral: turn the raw logs into the four numbers that make or break a manipulation case.`,
        `Your own desk's alert system just escalated a client's order flow: ${desc}. Before compliance freezes anything, you quantify the pattern — and check whether an innocent explanation could produce the same numbers.`,
        `Your HFT firm stands accused on the basis of its cancellation statistics, and you must rebuild the episode from your own logs: ${desc}. The defence requires the same four numbers as the prosecution — plus the argument about what they do NOT prove.`,
      ]
      : [
        `L'algorithme de surveillance a signalé une séquence sur une valeur moyenne et le dossier atterrit sur votre bureau à l'AMF : ${desc}. Votre travail avant toute transmission : transformer les logs bruts en quatre chiffres qui font ou défont un dossier de manipulation.`,
        `Le système d'alerte de votre propre desk vient d'escalader le flux d'ordres d'un client : ${desc}. Avant que la conformité ne gèle quoi que ce soit, vous quantifiez le motif — et vérifiez si une explication innocente pourrait produire les mêmes chiffres.`,
        `Votre société HFT est accusée sur la base de ses statistiques d'annulation, et vous devez reconstituer l'épisode depuis vos propres logs : ${desc}. La défense exige les mêmes quatre chiffres que l'accusation — plus l'argument sur ce qu'ils ne prouvent PAS.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The cancellation ratio' : "a) Le ratio d'annulation",
          enonce: en
            ? `On the displayed sell side, what share of the volume was cancelled rather than executed, in %?`
            : `Côté vente affiché, quelle part du volume a été annulée plutôt qu'exécutée, en % ?`,
          reponse: repAnnulation, tolerance: 0.1, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Cancelled over displayed' : "Annulé sur affiché",
            contenu: en
              ? `(${f(A, 0)} − ${f(eV, 0)}) / ${f(A, 0)} × 100 = **${pct(repAnnulation)}**. Taken alone, this number convicts nobody: market makers routinely cancel and re-quote 95% and more of their orders as prices move. It opens the file; it does not close it.`
              : `(${f(A, 0)} − ${f(eV, 0)}) / ${f(A, 0)} × 100 = **${pct(repAnnulation)}**. Pris seul, ce chiffre ne condamne personne : les market makers annulent et recotent en routine 95 % et plus de leurs ordres au fil des prix. Il ouvre le dossier ; il ne le ferme pas.`,
          }],
        },
        {
          intitule: en ? 'b) The display/execution asymmetry' : "b) L'asymétrie affichage/exécution",
          enonce: en
            ? `How many times larger is the displayed sell volume than the volume actually bought on the other side?`
            : `Combien de fois le volume affiché à la vente dépasse-t-il le volume réellement acheté de l'autre côté ?`,
          reponse: repAsymetrie, tolerance: 0.2, toleranceMode: 'absolu', unite: '×',
          etapes: [
            {
              titre: en ? 'The ratio that orients intent' : "Le ratio qui oriente l'intention",
              contenu: en
                ? `${f(A, 0)} / ${f(R, 0)} = **${f(repAsymetrie, 1)}×**. The economic interest of the sequence sat on the BUY side; the sell side existed to be seen, not to trade. That display-versus-interest asymmetry is what separates the pattern from ordinary quoting.`
                : `${f(A, 0)} / ${f(R, 0)} = **${f(repAsymetrie, 1)}×**. L'intérêt économique de la séquence était du côté ACHAT ; le côté vente existait pour être vu, pas pour traiter. Cette asymétrie affichage/intérêt est ce qui sépare le motif d'une cotation ordinaire.`,
            },
          ],
          pieges: [en
            ? `A market maker also displays large sizes — but on BOTH sides at once, with executions on both: one-sidedness is the tell, not size.`
            : `Un market maker affiche aussi de grosses tailles — mais des DEUX côtés à la fois, avec des exécutions des deux côtés : c'est l'unilatéralité qui trahit, pas la taille.`],
        },
        {
          intitule: en ? 'c) The P&L of the manoeuvre' : 'c) Le P&L de la manœuvre',
          enonce: en
            ? `The displayed wall pushed the price down ${f(deltaC, 0)} cents while the trader bought. What did the manoeuvre earn him, in euros?`
            : `Le mur affiché a poussé le prix de ${f(deltaC, 0)} centimes à la baisse pendant que le trader achetait. Combien la manœuvre lui a-t-elle rapporté, en euros ?`,
          reponse: repPnl, tolerance: 0.005, unite: '€',
          etapes: [
            {
              titre: en ? 'Cheaper entry × real volume' : 'Entrée moins chère × volume réel',
              contenu: en
                ? `${f(R, 0)} shares × ${f(deltaEur)} = **${eur(repPnl)}** saved on the entry, captured when the wall vanished and the price recovered. Modest per episode — which is exactly why the pattern repeats: Sarao ran it for YEARS from a suburban bedroom before 2015.`
                : `${f(R, 0)} titres × ${f(deltaEur)} = **${eur(repPnl)}** économisés sur l'entrée, encaissés quand le mur a disparu et que le cours s'est rétabli. Modeste par épisode — et c'est exactement pourquoi le motif se répète : Sarao l'a déroulé pendant des ANNÉES depuis une chambre de banlieue avant 2015.`,
            },
            {
              titre: en ? 'Whose pocket it came from' : 'De quelle poche cela sort',
              contenu: en
                ? `The counterparties who sold ${f(deltaC, 0)} cents too low reacted rationally to a fake order book: the loss is real, distributed, and invisible to its victims — the precise harm MAR exists to punish.`
                : `Les contreparties qui ont vendu ${f(deltaC, 0)} centimes trop bas ont réagi rationnellement à un carnet truqué : la perte est réelle, diffuse, et invisible pour ses victimes — précisément le préjudice que MAR existe pour punir.`,
            },
          ],
        },
        {
          intitule: en ? 'd) The induced move, in basis points — and the verdict' : 'd) Le mouvement induit en points de base — et le verdict',
          enonce: en
            ? `Express the ${f(deltaC, 0)}-cent induced move in basis points of the €${f(P, 0)} price.`
            : `Exprimez le mouvement induit de ${f(deltaC, 0)} centimes en points de base du prix de ${f(P, 0)} €.`,
          reponse: repEconomiePb, tolerance: 0.5, toleranceMode: 'absolu', unite: en ? 'bp' : 'pb',
          etapes: [
            {
              titre: en ? 'The size of the distortion' : 'La taille de la distorsion',
              contenu: en
                ? `${f(deltaEur)} / ${f(P, 0)} × 10,000 = **${bp(repEconomiePb)}** of artificial price pressure — manufactured by orders that were never meant to trade.`
                : `${f(deltaEur)} / ${f(P, 0)} × 10 000 = **${bp(repEconomiePb)}** de pression artificielle sur le prix — fabriquée par des ordres qui n'ont jamais eu vocation à traiter.`,
            },
            {
              titre: en ? 'Qualify under MAR — and steelman the defence' : 'Qualifier sous MAR — et défendre honnêtement l\'accusé',
              contenu: en
                ? `MAR's manipulation test: a false appearance of supply (the ${f(A, 0)}-share wall), orders placed without intent to execute (${pct(repAnnulation)} cancelled), and a benefit taken on the induced move (${eur(repPnl)} on the opposite side). The three legs together qualify spoofing. The legitimate counter-example to rule out: a market maker re-quoting both sides as prices move shows the same cancellation ratio a) — but no one-sided wall b), and no systematic profit on the opposite side c). Intent is proven by the GEOMETRY of the flow, never by the cancellation rate alone.`
                : `Le test de manipulation de MAR : une fausse apparence d'offre (le mur de ${f(A, 0)} titres), des ordres placés sans intention d'exécution (${pct(repAnnulation)} annulés), et un profit pris sur le mouvement induit (${eur(repPnl)} de l'autre côté). Les trois jambes ensemble qualifient le spoofing. Le contre-exemple légitime à écarter : un market maker qui recote des deux côtés au fil des prix montre le même ratio d'annulation a) — mais pas de mur unilatéral b), ni de profit systématique de l'autre côté c). L'intention se prouve par la GÉOMÉTRIE du flux, jamais par le seul taux d'annulation.`,
            },
          ],
          pieges: [en
            ? `Convicting on a) alone would indict every market maker in the book: the qualification needs the asymmetry b) AND the opposite-side profit c).`
            : `Condamner sur le seul a) mettrait en examen tous les market makers du carnet : la qualification exige l'asymétrie b) ET le profit de l'autre côté c).`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 10. m1-pb-tour-des-acteurs — N2                                     */
/* ------------------------------------------------------------------ */
const tourDesActeurs: ProblemGenerator = {
  id: 'm1-pb-tour-des-acteurs', moduleId: M1,
  titre: "Le tour des acteurs sur un trade",
  titreEn: 'Following the money around one trade',
  typeDeCas: 'cartographie des acteurs',
  typeDeCasEn: 'mapping the players',
  difficulte: 2,
  scenarios: ['Tour de table : qui gagne quoi sur un trade institutionnel', "Question de jury : suivez l'argent", "Cas d'école devant un comité d'investissement"],
  scenariosEn: ['Round table: who earns what on an institutional trade', 'Jury question: follow the money', 'Case study before an investment committee'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const N = pick(rng, [2, 5, 10] as const) * 1_000_000;
    const co = randFloat(rng, 3, 8, 1);
    const de = randFloat(rng, 1.5, 4, 1);
    const fg = randFloat(rng, 0.25, 0.8, 2);
    const cu = randFloat(rng, 0.5, 2, 1);

    const courtage = commissionTotale(N, co, 0);
    const spread = (N * de) / 10_000;
    const gestion = N * (fg / 100);
    const conservation = (N * cu) / 10_000;
    const total = courtage + spread + gestion + conservation;
    const repCourtage = r2(courtage);
    const repSpread = r2(spread);
    const repGestion = r2(gestion);
    const repConservation = r2(conservation);
    const repTotal = r2(total);

    const { en, f, eur, pct } = outils(langue);
    const desc = en
      ? `a fund places a €${f(N, 0)} buy order in equities, then holds the line for one year: brokerage of ${f(co, 1)} bp on execution, market-maker half-spread of ${f(de, 1)} bp, management fees of ${f(fg, 2)}% a year on the position, and custody of ${f(cu, 1)} bp a year at the depositary`
      : `un fonds passe un ordre d'achat de ${f(N, 0)} € en actions, puis garde la ligne un an : courtage de ${f(co, 1)} pb à l'exécution, demi-fourchette du teneur de marché de ${f(de, 1)} pb, frais de gestion de ${f(fg, 2)} % par an sur la position, et conservation de ${f(cu, 1)} pb par an chez le dépositaire`;
    const contexte = (en
      ? [
        `One trade, four hands in the till — the cleanest way to learn the map of players is to follow the money once, end to end. The case: ${desc}. For each intermediary: who they are, what they do, what they take, in euros.`,
        `The jury question looks naive and is anything but: "a fund buys shares — who gets paid along the way?" Your material: ${desc}. The expected answer names each player AND prices each toll.`,
        `Before approving a new mandate, the investment committee wants the full cost anatomy of a representative trade: ${desc}. Four lines, four players, one total — and one conclusion about where the value chain really concentrates.`,
      ]
      : [
        `Un trade, quatre mains dans la caisse — la façon la plus propre d'apprendre la carte des acteurs est de suivre l'argent une fois, de bout en bout. Le cas : ${desc}. Pour chaque intermédiaire : qui il est, ce qu'il fait, ce qu'il prélève, en euros.`,
        `La question de jury a l'air naïve et ne l'est pas : « un fonds achète des actions — qui est payé au passage ? » Votre matériau : ${desc}. La réponse attendue nomme chaque acteur ET chiffre chaque péage.`,
        `Avant d'approuver un nouveau mandat, le comité d'investissement veut l'anatomie complète des coûts d'un trade représentatif : ${desc}. Quatre lignes, quatre acteurs, un total — et une conclusion sur l'endroit où la chaîne de valeur se concentre réellement.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? "a) The broker's commission" : 'a) La commission du courtier',
          enonce: en
            ? `What does the broker earn on the execution, in euros?`
            : `Que gagne le courtier sur l'exécution, en euros ?`,
          reponse: repCourtage, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'The sell-side access toll' : "Le péage d'accès du sell-side",
            contenu: en
              ? `${f(N, 0)} × ${f(co, 1)} / 10,000 = **${eur(repCourtage)}**. The broker routes, executes and reports — the access business of chapter 2, an industry of thin margins on large volumes.`
              : `${f(N, 0)} × ${f(co, 1)} / 10 000 = **${eur(repCourtage)}**. Le courtier route, exécute et rend compte — le métier d'accès du chapitre 2, une industrie de marges fines sur gros volumes.`,
          }],
        },
        {
          intitule: en ? "b) The market maker's spread" : 'b) Le spread du teneur de marché',
          enonce: en
            ? `What does the market maker capture on this order, in euros?`
            : `Que capture le teneur de marché sur cet ordre, en euros ?`,
          reponse: repSpread, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'Paid by crossing, not invoiced' : 'Payé par traversée, jamais facturé',
            contenu: en
              ? `${f(N, 0)} × ${f(de, 1)} / 10,000 = **${eur(repSpread)}**. No invoice carries this line: it is embedded in the execution price — the remuneration of immediacy and inventory risk.`
              : `${f(N, 0)} × ${f(de, 1)} / 10 000 = **${eur(repSpread)}**. Aucune facture ne porte cette ligne : elle est incluse dans le prix d'exécution — la rémunération de l'immédiateté et du risque d'inventaire.`,
          }],
        },
        {
          intitule: en ? "c) The asset manager's annual fees" : 'c) Les frais annuels de la société de gestion',
          enonce: en
            ? `Over the one-year holding, what does the management company collect on this position, in euros?`
            : `Sur l'année de détention, que prélève la société de gestion sur cette position, en euros ?`,
          reponse: repGestion, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'The recurring layer' : "L'étage récurrent",
            contenu: en
              ? `${f(N, 0)} × ${f(fg, 2)}% = **${eur(repGestion)}** — every year, executed or not. Where a) and b) are paid once per trade, this layer recurs on the whole stock of assets: that is why the buy-side fee line dwarfs the execution lines.`
              : `${f(N, 0)} × ${f(fg, 2)} % = **${eur(repGestion)}** — chaque année, qu'on traite ou non. Là où a) et b) se paient une fois par trade, cet étage se répète sur tout le stock d'encours : voilà pourquoi la ligne de frais du buy-side écrase les lignes d'exécution.`,
          }],
        },
        {
          intitule: en ? 'd) The custody cost' : 'd) Le coût de conservation',
          enonce: en
            ? `What does custody at the depositary cost over the year, in euros?`
            : `Que coûte la conservation chez le dépositaire sur l'année, en euros ?`,
          reponse: repConservation, tolerance: 0.005, unite: '€',
          etapes: [{
            titre: en ? 'The quiet giant' : 'Le géant silencieux',
            contenu: en
              ? `${f(N, 0)} × ${f(cu, 1)} / 10,000 = **${eur(repConservation)}**. Tiny rate, immense base: custodians like Euroclear keep the ledger of tens of trillions — the post-trade world of chapter 7, invisible until it makes the headlines.`
              : `${f(N, 0)} × ${f(cu, 1)} / 10 000 = **${eur(repConservation)}**. Taux minuscule, base immense : des conservateurs comme Euroclear tiennent le grand livre de dizaines de milliers de milliards — le post-marché du chapitre 7, invisible jusqu'au jour où il fait les gros titres.`,
          }],
        },
        {
          intitule: en ? 'e) The first-year total — and the table' : 'e) Le total de la première année — et la table',
          enonce: en
            ? `Summing the four tolls, what does the first year cost in total, in euros?`
            : `En sommant les quatre péages, combien coûte la première année au total, en euros ?`,
          reponse: repTotal, tolerance: 0.005, unite: '€',
          etapes: [
            {
              titre: en ? 'Who earns what — the recap table' : 'Qui gagne quoi — la table récapitulative',
              contenu: en
                ? `| Player | Service | Take |\n|---|---|---|\n| Broker | execution | ${eur(repCourtage)} |\n| Market maker | immediacy | ${eur(repSpread)} |\n| Asset manager | decision & relationship | ${eur(repGestion)} |\n| Depositary | safekeeping & settlement | ${eur(repConservation)} |\n| **Total year 1** | | **${eur(repTotal)}** |`
                : `| Acteur | Service | Prélèvement |\n|---|---|---|\n| Courtier | exécution | ${eur(repCourtage)} |\n| Teneur de marché | immédiateté | ${eur(repSpread)} |\n| Société de gestion | décision & relation client | ${eur(repGestion)} |\n| Dépositaire | conservation & dénouement | ${eur(repConservation)} |\n| **Total année 1** | | **${eur(repTotal)}** |`,
            },
            {
              titre: en ? 'Where the value concentrates' : 'Où la valeur se concentre',
              contenu: en
                ? `Management alone takes ${pct(r2((gestion / total) * 100), 0)} of the total: the chapter-2 conclusion in one number — value is captured where the client relationship and the investment decision sit, not where the order is executed.`
                : `La gestion seule prend ${pct(r2((gestion / total) * 100), 0)} du total : la conclusion du chapitre 2 en un chiffre — la valeur se capte là où se tiennent la relation client et la décision d'investissement, pas là où l'ordre s'exécute.`,
            },
          ],
          pieges: [en
            ? `Comparing a) to c) per YEAR understates execution only if you trade once: a fund that turns its book over five times a year pays the execution chain five times.`
            : `Comparer a) à c) par AN ne minore l'exécution que si l'on traite une fois : un fonds qui tourne son livre cinq fois par an paie cinq fois la chaîne d'exécution.`],
        },
      ],
    };
  },
};

export const problemes: ProblemGenerator[] = [
  executerUnOrdre,
  choixTypeOrdre,
  marketMakerJournee,
  chaineDeCouts,
  fraisGestionLongTerme,
  selectionAdverse,
  decouperUnGrosOrdre,
  appelsDeMargeCcp,
  detectionSpoofing,
  tourDesActeurs,
];
