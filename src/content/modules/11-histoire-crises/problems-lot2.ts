/**
 * Moules de problèmes multi-étapes du module Histoire & crises financières —
 * LOT 2 : les 6 boss N4 (m11-pb-09 à m11-pb-14), alignés sur les chapitres
 * relus 3, 5, 6 et 7 : LTCM septembre 1998, le lundi noir du 19 octobre 1987,
 * le week-end Lehman des 13-15 septembre 2008, Athènes 2010-2012, la spirale
 * des gilts du 28 septembre 2022, et SVB des 8-10 mars 2023.
 * Chaque moule : 3 scénarios FR + EN (narration immersive datée, deuxième
 * personne), sous-questions chaînées (la sortie de a) nourrit b), c)…),
 * corrigés calculés via calculs.ts (m11) et le pont duration du m10 —
 * jamais de texte figé.
 * INVARIANT BILINGUE : tous les tirages aléatoires ont lieu AVANT toute branche
 * de langue — même seed + même scénario ⇒ mêmes nombres en français et en
 * anglais.
 * FAITS HISTORIQUES : exactement ceux des chapitres relus — LTCM : capital
 * ~4,7 Md$, actifs ~125 Md$, levier ~27, choc fatal −100/27 ≈ −3,7 %, août
 * −44 %, fin septembre ~400 M$ pour >100 Md$ (levier >250), consortium privé
 * 3,625 Md$ pour 90 %, AUCUN argent public ; 1987 : Dow +44 % jan-août, pic
 * 2 722,42 le 25 août, −22,6 % le 19 octobre (2 246,74 → 1 738,74), 60-90 Md$
 * assurés, récupérer −22,6 % exige +29,2 %, Greenspan une phrase le 20, pic
 * revu en août 1989 ; Lehman : levier ~31, faillite 15 septembre (613 Md$ de
 * dettes), AIG sauvée le 16 (85 Md$ contre 79,9 %, ~500 Md$ de CDS vendus),
 * ruée sur les haircuts (Gorton, 2 % → 25 %) ; Grèce : dette ~180 % du PIB,
 * 10 ans >35 % en mars 2012 (spread >3 000 pb contre Bund ~1,5 %), PSI
 * mars 2012 : ~200 Md€ privés, décote nominale 53,5 %, ~75 % en VA ; gilts :
 * +130 pb en trois séances sur le 30 ans (duration ~20), BoE 13 jours ouvrés
 * (~19 Md£ utilisés, capacité 5 Md£/jour soit 65 Md£), Truss 44 jours ; SVB :
 * ~140 Md$ de titres duration ~5,7, moins-values latentes ~16 Md$ ≈ fonds
 * propres, vente de 21 Md$ le 8 mars (perte 1,8 Md$), 42 Md$ de retraits le
 * 9 mars (~un quart des dépôts), BTFP au pair le 12 mars.
 * Conventions (en-tête de calculs.ts) : pourcentages partout, levier sans
 * unité, pertes signées côté écrans, décotes/haircuts en % de la valeur de
 * marché ; variationPrixObligationDuration (m10) reçoit des pb et rend du %.
 */
import { formatNombreLangue } from '../../../engine/answers';
import { mulberry32, randFloat, randInt } from '../../../engine/rng';
import type { Langue, ProblemGenerator } from '../../../engine/types';
import { variationPrixObligationDuration } from '../10-macro-banques-centrales/calculs';
import {
  chargeInteretsDette, financementRepo, gainRequisPourRecuperer, levierBilan,
  spreadSouverainPb, tauxCouvertureDepots, variationActifsFatale, venteForceePourCash,
} from './calculs';

/** Un « moule » de problème est un ProblemGenerator de l'engine (alias local). */
export type ProblemeMoule = ProblemGenerator;

const M11 = '11-histoire-crises';
const r0 = (v: number) => Math.round(v);
const r1 = (v: number) => Math.round(v * 10) / 10;
const r2 = (v: number) => Math.round(v * 100) / 100;

/** Petits formateurs liés à la langue (les tirages sont déjà faits quand on les crée). */
function outils(langue: Langue) {
  const en = langue === 'en';
  const f = (v: number, d = 2) => formatNombreLangue(langue, v, d);
  const pct = (v: number, d = 2) => (en ? `${f(v, d)}%` : `${f(v, d)} %`);
  const pb = (v: number, d = 0) => (en ? `${f(v, d)} bp` : `${f(v, d)} pb`);
  return { en, f, pct, pb };
}

/* ------------------------------------------------------------------ */
/* 9. m11-pb-09 — Greenwich, septembre 1998 : LTCM — BOSS N4           */
/* ------------------------------------------------------------------ */
const ltcmGreenwich: ProblemeMoule = {
  id: 'm11-pb-09', moduleId: M11,
  titre: 'Greenwich, septembre 1998 : LTCM, le sauvetage sans argent public',
  titreEn: 'Greenwich, September 1998: LTCM, the bailout without public money',
  typeDeCas: 'levier et liquidité',
  typeDeCasEn: 'leverage and liquidity',
  difficulte: 4,
  scenarios: ['Le risk manager du fonds, Greenwich, dimanche 20 septembre', 'La Fed de New York : préparer la salle du 23 septembre', 'La banque du consortium : faut-il mettre au pot ?'],
  scenariosEn: ['The fund\'s risk manager, Greenwich, Sunday September 20', 'The New York Fed: preparing the room for September 23', 'The consortium bank: should we ante up?'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const capital = randFloat(rng, 4.5, 4.9, 1);
    const actifs = randInt(rng, 120, 130);
    const perteAout = randInt(rng, 42, 46);
    const capFin = randFloat(rng, 0.38, 0.42, 2);
    const actifsFin = randInt(rng, 100, 110);
    const besoin = randFloat(rng, 1.5, 2.5, 1);
    const decote = randFloat(rng, 4, 6, 1);
    const injection = 3.625;

    const levier0 = levierBilan(actifs, capital);
    const fatal = variationActifsFatale(levier0);
    const capAout = capital * (1 - perteAout / 100);
    const levierFin = levierBilan(actifsFin, capFin);
    const aVendre = venteForceePourCash(besoin, decote);
    const part = (injection / (injection + capFin)) * 100;
    const repLevier0 = r1(levier0);
    const repFatal = r2(fatal);
    const repCapAout = r2(capAout);
    const repLevierFin = r0(levierFin);
    const repVente = r2(aVendre);
    const repPart = r1(part);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `in early 1998, Long-Term Capital Management carries about \\$${f(actifs, 0)}bn of assets on \\$${f(capital, 1)}bn of capital, plus more than \\$1,000bn of off-balance-sheet derivative notionals, financed through repo at near-zero negotiated haircuts — the prestige of Meriwether and of the 1997 Nobel laureates Merton and Scholes was a funding condition, not an ornament; on August 17 Russia defaults on its rouble debt and triggers a worldwide flight to quality: every convergence trade was, in substance, "sell quality, buy the spread", so every spread widens at once; August costs −${pct(perteAout, 0)} on the month; by late September the capital has fallen toward \\$${f(capFin, 2)}bn against still \\$${f(actifsFin, 0)}bn of assets, the fund must raise \\$${f(besoin, 1)}bn of cash for margin, and any sale of its (universally known) positions goes through at a discount of about ${pct(decote, 1)}`
      : `début 1998, Long-Term Capital Management porte environ ${f(actifs, 0)} Md\\$ d'actifs pour ${f(capital, 1)} Md\\$ de capital, plus de 1 000 Md\\$ de notionnels de dérivés hors bilan, financés en repo à haircuts négociés quasi nuls — le prestige de Meriwether et des Nobel 1997 Merton et Scholes n'était pas un ornement, c'était une condition de financement ; le 17 août, la Russie fait défaut sur sa dette en roubles et déclenche une fuite vers la qualité mondiale : chaque trade de convergence était, en substance, « vendre la qualité, acheter l'écart », donc tous les spreads s'écartent en même temps ; août coûte −${pct(perteAout, 0)} sur le mois ; fin septembre, le capital est tombé vers ${f(capFin, 2)} Md\\$ pour encore ${f(actifsFin, 0)} Md\\$ d'actifs, le fonds doit lever ${f(besoin, 1)} Md\\$ de cash pour la marge, et toute vente de ses positions (connues de tous) passe sous une décote d'environ ${pct(decote, 1)}`;
    const contexte = (en
      ? [
        `Sunday, September 20, 1998, Greenwich, Connecticut. The offices are silent, the screens are not: tomorrow, William McDonough of the New York Fed and officials from the Treasury will walk through the door to look at the books — the books YOU keep. John Meriwether wants one page of numbers before they arrive, because the fund's survival will be decided by arithmetic, not eloquence. The situation: ${desc}.\n\nYour page must run in order: the leverage the fund was built on; the asset move that was always enough to kill it; what August actually left in the till; the leverage the losses have manufactured — the number that explains why nothing can be sold; the forced-sale arithmetic that proves it; and the shape of the only endgame that avoids liquidation. In four days, fourteen banks will be sitting in a room at the Fed. Your page is what they will be looking at.`,
        `Tuesday, September 22, 1998, the New York Fed. President McDonough has made his decision: tomorrow, the heads of fourteen banks will sit in one room, and he will ask them to solve the problem with THEIR money — the Fed will lend its meeting room and its authority, not a dollar. You are drafting the file that must convince them. The facts: ${desc}.\n\nThe file's logic is the chapter's: show the leverage, show the fatal threshold it implied, show what August did, show the post-loss leverage that makes orderly selling impossible — every bank at the table is a counterparty and would catch the debris of \\$1,000bn of notionals at the worst price —, price the forced-sale spiral, and then lay out the consortium arithmetic: who pays, what they get, and why not one public dollar can appear anywhere in the document.`,
        `Wednesday, September 23, 1998, morning. Your CEO enters the New York Fed in three hours, and the question on the table is brutally simple: put roughly \\$300m into a fund that just lost ${pct(perteAout, 0)} in a month — or refuse, and take the consequences. You have twenty minutes to brief him. The data: ${desc}.\n\nYour briefing must weigh the two branches: the cost of paying (the consortium's \\$3.625bn for 90% of the fund, an orderly wind-down over eighteen months) against the cost of refusing (the simultaneous forced liquidation of \\$1,000bn of notionals, of which your own bank is a counterparty — the chapter 1 fire-sale spiral, at the scale of the global financial system). Walk him through the leverage, the fatal move, the August arithmetic, the leverage after losses, the sale that cannot happen, and the dilution table. Then let him decide — the way all fourteen decided.`,
      ]
      : [
        `Dimanche 20 septembre 1998, Greenwich, Connecticut. Les bureaux sont silencieux, pas les écrans : demain, William McDonough, président de la Fed de New York, et des représentants du Trésor passeront la porte pour regarder les livres — les livres que VOUS tenez. John Meriwether veut une page de chiffres avant leur arrivée, parce que la survie du fonds se jouera à l'arithmétique, pas à l'éloquence. La situation : ${desc}.\n\nVotre page doit dérouler dans l'ordre : le levier sur lequel le fonds était construit ; la variation d'actifs qui a toujours suffi à le tuer ; ce qu'août a réellement laissé en caisse ; le levier que les pertes ont fabriqué — le nombre qui explique pourquoi on ne peut plus rien vendre ; l'arithmétique de la vente forcée qui le prouve ; et la forme de la seule fin de partie qui évite la liquidation. Dans quatre jours, quatorze banques seront assises dans une salle de la Fed. Votre page est ce qu'elles regarderont.`,
        `Mardi 22 septembre 1998, la Fed de New York. Le président McDonough a pris sa décision : demain, les patrons de quatorze banques s'assiéront dans une même salle, et il leur demandera de régler le problème avec LEUR argent — la Fed prêtera sa salle de réunion et son autorité, pas un dollar. Vous rédigez le dossier qui doit les convaincre. Les faits : ${desc}.\n\nLa logique du dossier est celle du chapitre : montrer le levier, montrer le seuil fatal qu'il impliquait, montrer ce qu'août a fait, montrer le levier post-pertes qui rend toute vente ordonnée impossible — chaque banque autour de la table est contrepartie et ramasserait les débris de 1 000 Md\\$ de notionnels au pire prix —, pricer la spirale de ventes forcées, puis poser l'arithmétique du consortium : qui paie, ce qu'ils reçoivent, et pourquoi pas un dollar public ne peut apparaître nulle part dans le document.`,
        `Mercredi 23 septembre 1998, au matin. Votre CEO entre à la Fed de New York dans trois heures, et la question sur la table est brutalement simple : mettre environ 300 M\\$ dans un fonds qui vient de perdre ${pct(perteAout, 0)} en un mois — ou refuser, et en assumer les conséquences. Vous avez vingt minutes pour le briefer. Les données : ${desc}.\n\nVotre brief doit peser les deux branches : le coût de payer (les 3,625 Md\\$ du consortium pour 90 % du fonds, une liquidation en ordre sur dix-huit mois) contre le coût de refuser (la liquidation forcée simultanée de 1 000 Md\\$ de notionnels, dont votre propre banque est contrepartie — la spirale de ventes forcées du chapitre 1, à l'échelle du système financier mondial). Déroulez-lui le levier, le choc fatal, l'arithmétique d'août, le levier après pertes, la vente qui ne peut pas avoir lieu, et la table de dilution. Puis laissez-le décider — comme les quatorze ont décidé.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The leverage the dream team built' : 'a) Le levier que l\'équipe de rêve a construit',
          enonce: en
            ? `\\$${f(actifs, 0)}bn of assets on \\$${f(capital, 1)}bn of capital. What is the fund's balance-sheet leverage (a unitless multiple)?`
            : `${f(actifs, 0)} Md\\$ d'actifs pour ${f(capital, 1)} Md\\$ de capital. Quel est le levier de bilan du fonds (multiple sans unité) ?`,
          reponse: repLevier0, tolerance: 0.3, toleranceMode: 'absolu', unite: '×',
          etapes: [{
            titre: en ? 'Financed by prestige, at haircut zero' : 'Financé au prestige, à haircut zéro',
            contenu: en
              ? `Leverage = ${f(actifs, 0)} / ${f(capital, 1)} = **${f(repLevier0, 1)}×** — the chapter's order of magnitude (~27). How do you carry \\$${f(actifs, 0)}bn on \\$${f(capital, 1)}bn? Through repo: each round of borrowing re-pledges the remainder, and a 2% haircut alone allows a leverage of 100/2 = 50. LTCM negotiated better still: the Nobel prestige was not an image, it was a funding condition. Dozens of convergence trades — off-the-run vs on-the-run Treasuries, swap spreads — each earning a few basis points, therefore multiplied by this machine.`
              : `Levier = ${f(actifs, 0)} / ${f(capital, 1)} = **${f(repLevier0, 1)}×** — l'ordre de grandeur du chapitre (~27). Comment porter ${f(actifs, 0)} Md\\$ avec ${f(capital, 1)} ? Par le repo : chaque tour d'emprunt re-nantit le reste, et un haircut de 2 % autorise à lui seul un levier de 100/2 = 50. LTCM négociait mieux encore : le prestige des Nobel n'était pas une image, c'était une condition de financement. Des dizaines de trades de convergence — Treasuries off-the-run contre on-the-run, spreads de swap — rapportant chacun quelques points de base, donc démultipliés par cette machine.`,
          }],
          pieges: [en
            ? `Adding the \\$1,000bn of derivative notionals to the assets confuses notional and balance sheet: the 27× is the BALANCE-SHEET leverage; the off-balance-sheet notionals are a separate — and larger — layer of the same bet.`
            : `Additionner les 1 000 Md\\$ de notionnels de dérivés aux actifs confond notionnel et bilan : le 27× est le levier de BILAN ; les notionnels hors bilan sont une couche séparée — et plus grosse — du même pari.`],
        },
        {
          intitule: en ? 'b) The move that was always fatal' : 'b) La variation qui a toujours été fatale',
          enonce: en
            ? `At that leverage, what asset-value change (in %, signed) wipes out the entire capital?`
            : `À ce levier, quelle variation de la valeur des actifs (en %, signée) efface la totalité du capital ?`,
          reponse: repFatal, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The distance to death, printed in the structure' : 'La distance à la mort, imprimée dans la structure',
            contenu: en
              ? `Fatal move = −100 / ${f(repLevier0, 1)} = **${pct(repFatal, 2)}**. On positions reputed near-riskless — arbitrages between twin securities — a portfolio-wide move of ${pct(r1(Math.abs(fatal)), 1)} kills the fund. That number was written into the structure from day one, in 1994, through two years of +40% returns: leverage does not create risk on the day of the crisis, it stores it from the day of the first trade. Chapter 1's grammar: the 1929 speculator died at −10 (leverage 10); LTCM dies at ${pct(r1(Math.abs(fatal)), 1)}.`
              : `Variation fatale = −100 / ${f(repLevier0, 1)} = **${pct(repFatal, 2)}**. Sur des positions réputées quasi sans risque — des arbitrages entre titres jumeaux —, une variation de ${pct(r1(Math.abs(fatal)), 1)} de l'ensemble du portefeuille tue le fonds. Ce nombre était écrit dans la structure dès le premier jour, en 1994, à travers deux années à +40 % de rendement : le levier ne crée pas le risque le jour de la crise, il le stocke depuis le jour du premier trade. La grammaire du chapitre 1 : le spéculateur de 1929 mourait à −10 (levier 10) ; LTCM meurt à ${pct(r1(Math.abs(fatal)), 1)}.`,
          }],
        },
        {
          intitule: en ? 'c) August: what is left in the till' : 'c) Août : ce qui reste en caisse',
          enonce: en
            ? `August 1998 costs the fund ${pct(perteAout, 0)} of its capital in one month. From \\$${f(capital, 1)}bn, how much capital remains, in \\$bn?`
            : `Août 1998 coûte au fonds ${pct(perteAout, 0)} de son capital en un mois. À partir de ${f(capital, 1)} Md\\$, combien de capital reste-t-il, en Md\\$ ?`,
          reponse: repCapAout, tolerance: 0.05, toleranceMode: 'absolu', unite: 'Md$',
          etapes: [{
            titre: en ? 'A hundred bets that were one bet' : 'Cent paris qui n\'en étaient qu\'un',
            contenu: en
              ? `Capital = ${f(capital, 1)} × (1 − ${f(perteAout, 0)}%) = **\\$${f(repCapAout, 2)}bn**. The fund held almost nothing in Russia — and that is the whole lesson. The default triggered a global flight to quality; every convergence trade was "sell quality, buy the spread"; positions built as independent turned out to be the same bet repeated a hundred times — the bet that calm continues. Correlations rose toward 1 precisely on the day diversification was supposed to save. The VaR, calibrated on calm years, gave August an astronomically small probability: estimating a tail with data that contains no tail.`
              : `Capital = ${f(capital, 1)} × (1 − ${f(perteAout, 0)} %) = **${f(repCapAout, 2)} Md\\$**. Le fonds n'avait presque rien en Russie — et c'est toute la leçon. Le défaut a déclenché une fuite vers la qualité mondiale ; chaque trade de convergence était « vendre la qualité, acheter l'écart » ; des positions construites comme indépendantes se sont révélées être le même pari répété cent fois — le pari que le calme continue. Les corrélations sont montées vers 1 précisément le jour où la diversification devait sauver. La VaR, calibrée sur les années calmes, donnait à août une probabilité astronomiquement faible : estimer une queue avec des données qui n'en contiennent pas.`,
          }],
          pieges: [en
            ? `"LTCM was killed by its Russian exposure" gets the mechanism wrong: the exposure was elsewhere — in the correlation of all its spread trades under a common flight to quality. Your risk includes the positions of everyone who holds the same trade.`
            : `« LTCM a été tué par son exposition russe » se trompe de mécanisme : l'exposition était ailleurs — dans la corrélation de tous ses trades de spread sous une même fuite vers la qualité. Votre risque inclut les positions de tous ceux qui portent le même trade.`],
        },
        {
          intitule: en ? 'd) The leverage the losses manufactured' : 'd) Le levier que les pertes ont fabriqué',
          enonce: en
            ? `By late September, capital has fallen toward \\$${f(capFin, 2)}bn while assets still stand near \\$${f(actifsFin, 0)}bn. What is the fund's leverage now?`
            : `Fin septembre, le capital est tombé vers ${f(capFin, 2)} Md\\$ quand les actifs sont encore proches de ${f(actifsFin, 0)} Md\\$. Quel est le levier du fonds désormais ?`,
          reponse: repLevierFin, tolerance: 8, toleranceMode: 'absolu', unite: '×',
          etapes: [{
            titre: en ? 'Losses deleverage nothing — they leverage' : 'Les pertes ne désendettent pas — elles endettent',
            contenu: en
              ? `Leverage = ${f(actifsFin, 0)} / ${f(capFin, 2)} = **${f(repLevierFin, 0)}×** — the chapter's "leverage above 250" order of magnitude. The perverse arithmetic of losses at leverage: capital absorbs the fall, assets barely move, so the RATIO explodes. At ${f(repLevierFin, 0)}×, the fatal move is −100/${f(repLevierFin, 0)} ≈ ${pct(r2(-100 / levierFin), 2)}: every flutter of the portfolio is now life or death. And the fund cannot sell to deleverage, because the whole market knows its positions — the next sub-question prices exactly that trap.`
              : `Levier = ${f(actifsFin, 0)} / ${f(capFin, 2)} = **${f(repLevierFin, 0)}×** — l'ordre de grandeur du chapitre, « un levier supérieur à 250 ». L'arithmétique perverse des pertes sous levier : le capital absorbe la baisse, les actifs bougent à peine, donc le RATIO explose. À ${f(repLevierFin, 0)}×, la variation fatale est −100/${f(repLevierFin, 0)} ≈ ${pct(r2(-100 / levierFin), 2)} : chaque frémissement du portefeuille est désormais une question de vie ou de mort. Et le fonds ne peut pas vendre pour se désendetter, parce que le marché entier connaît ses positions — la sous-question suivante price exactement ce piège.`,
          }],
        },
        {
          intitule: en ? 'e) Why selling is impossible' : 'e) Pourquoi vendre est impossible',
          enonce: en
            ? `The fund must raise \\$${f(besoin, 1)}bn of cash for margin. Its positions are so well known that any sale executes at a discount of about ${pct(decote, 1)}. What pre-discount market value must it sell, in \\$bn?`
            : `Le fonds doit lever ${f(besoin, 1)} Md\\$ de cash pour la marge. Ses positions sont si connues que toute vente s'exécute sous une décote d'environ ${pct(decote, 1)}. Quelle valeur de marché pré-décote doit-il vendre, en Md\\$ ?`,
          reponse: repVente, tolerance: 0.05, toleranceMode: 'absolu', unite: 'Md$',
          etapes: [{
            titre: en ? 'The crowded trade prices your exit' : 'Le crowded trade price votre sortie',
            contenu: en
              ? `To sell = ${f(besoin, 1)} / (1 − ${f(decote, 1)}%) = **\\$${f(repVente, 2)}bn**. And the discount is not a constant: it is an increasing function of the selling itself. Every sale depresses the price of positions the whole street knows are LTCM's; the marked-down price shrinks the capital, which raises the leverage, which forces the next sale at a worse discount — the chapter 1 spiral, with an aggravating factor unique to this file: the counterparties can see the fund coming. The risk of a position is not only in its cash flows; it is in the list of those who hold the same one — their forced sales make your exit price.`
              : `À vendre = ${f(besoin, 1)} / (1 − ${f(decote, 1)} %) = **${f(repVente, 2)} Md\\$**. Et la décote n'est pas une constante : c'est une fonction croissante de la vente elle-même. Chaque cession déprime le prix de positions que toute la place sait être celles de LTCM ; le prix dégradé rétrécit le capital, qui augmente le levier, qui force la vente suivante à une décote pire — la spirale du chapitre 1, avec un facteur aggravant propre à ce dossier : les contreparties voient le fonds arriver. Le risque d'une position n'est pas seulement dans ses flux ; il est dans la liste de ceux qui portent la même — leurs ventes forcées font votre prix de sortie.`,
          }],
          pieges: [en
            ? `Computing ${f(besoin, 1)} × (1 + ${f(decote, 1)}%) = ${f(r2(besoin * (1 + decote / 100)), 2)} instead of dividing by (1 − d) understates the sale: the discount applies to what you SELL, not to what you need — the classic error on every forced-sale problem in the module.`
            : `Calculer ${f(besoin, 1)} × (1 + ${f(decote, 1)} %) = ${f(r2(besoin * (1 + decote / 100)), 2)} au lieu de diviser par (1 − d) sous-estime la vente : la décote s'applique à ce que vous VENDEZ, pas à ce dont vous avez besoin — l'erreur classique de tous les problèmes de vente forcée du module.`],
        },
        {
          intitule: en ? 'f) The consortium arithmetic' : 'f) L\'arithmétique du consortium',
          enonce: en
            ? `On September 23, the fourteen banks inject \\$3.625bn and take 90% of the fund. Against the post-injection capital (\\$${f(capFin, 2)}bn remaining + \\$3.625bn), what share does the consortium's money represent, in %?`
            : `Le 23 septembre, les quatorze banques injectent 3,625 Md\\$ et reprennent 90 % du fonds. Rapporté au capital post-injection (${f(capFin, 2)} Md\\$ restants + 3,625 Md\\$), quelle part l'argent du consortium représente-t-il, en % ?`,
          reponse: repPart, tolerance: 0.3, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'Who pays, what they get, who pays nothing' : 'Qui paie, ce qu\'ils reçoivent, qui ne paie rien',
              contenu: en
                ? `Share = 3.625 / (3.625 + ${f(capFin, 2)}) = **${pct(repPart, 1)}** — the consortium's money IS about 90% of the post-deal fund, which is exactly the equity it receives: the partners who were worth \\$${f(capital, 1)}bn in January keep ~10% of a \\$${f(r2(injection + capFin), 2)}bn vehicle, wound down in order over eighteen months. Now the sentence that makes good oral answers: NOT ONE PUBLIC DOLLAR. The Fed lent its meeting room and its authority — the fourteen banks paid because each was a counterparty to the \\$1,000bn of notionals and would have caught the debris of a forced liquidation at the worst price. The consortium internalised what a disorderly liquidation would have externalised.`
                : `Part = 3,625 / (3,625 + ${f(capFin, 2)}) = **${pct(repPart, 1)}** — l'argent du consortium EST environ 90 % du fonds post-opération, soit exactement la part qu'il reçoit : les associés qui valaient ${f(capital, 1)} Md\\$ en janvier gardent ~10 % d'un véhicule de ${f(r2(injection + capFin), 2)} Md\\$, liquidé en ordre sur dix-huit mois. Et la phrase qui fait les bonnes réponses d'oral : PAS UN DOLLAR PUBLIC. La Fed a prêté sa salle de réunion et son autorité — les quatorze banques ont payé parce que chacune était contrepartie des 1 000 Md\\$ de notionnels et aurait ramassé les débris d'une liquidation forcée au pire prix. Le consortium a internalisé ce que la liquidation désordonnée aurait externalisé.`,
            },
            {
              titre: en ? 'What that September taught the trade' : 'Ce que ce septembre a appris au métier',
              contenu: en
                ? `Three lines for the exit interview. One: leverage turns "right eventually" into "dead first" — nearly all of LTCM's trades converged… in 1999, after the fund's death; Keynes' line is the chapter's motto: the market can stay irrational longer than you can stay solvent. Two: your risk includes other people's positions — the crowded trade appears in no model, and its measurement is still an open problem. Three: the moral-hazard debate the rescue opened — no public money, but the central bank's orchestration taught the market that an actor central enough will always be walked to safety; that question returns, bigger, in 2008.`
                : `Trois lignes pour l'entretien de sortie. Un : le levier transforme « avoir raison à terme » en « être mort avant » — presque tous les trades de LTCM ont convergé… en 1999, après la mort du fonds ; la phrase de Keynes est la devise du chapitre : le marché peut rester irrationnel plus longtemps que vous ne pouvez rester solvable. Deux : votre risque inclut les positions des autres — le crowded trade ne figure dans aucun modèle, et sa mesure reste un problème ouvert. Trois : le débat d'aléa moral que le sauvetage a ouvert — aucun argent public, mais l'orchestration par la banque centrale a appris au marché qu'un acteur assez central sera toujours raccompagné à l'abri ; cette question revient, en plus gros, en 2008.`,
            },
          ],
          pieges: [en
            ? `Calling September 23 a "public bail-out" fails the question: the 3.625bn were PRIVATE — the Fed convened, coordinated, and spent nothing. The nuance is precisely what the jury is testing.`
            : `Appeler le 23 septembre un « bail-out public » fait échouer la question : les 3,625 Md étaient PRIVÉS — la Fed a convoqué, coordonné, et n'a rien dépensé. La nuance est précisément ce que le jury teste.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 10. m11-pb-10 — Le lundi noir, 19 octobre 1987 — BOSS N4            */
/* ------------------------------------------------------------------ */
const lundiNoir87: ProblemeMoule = {
  id: 'm11-pb-10', moduleId: M11,
  titre: 'Le lundi noir, 19 octobre 1987 : l\'assurance qui fabriquait le sinistre',
  titreEn: 'Black Monday, October 19, 1987: the insurance that manufactured the claim',
  typeDeCas: 'risque endogène',
  typeDeCasEn: 'endogenous risk',
  difficulte: 4,
  scenarios: ['Le gérant du programme d\'assurance de portefeuille, dimanche 18 octobre au soir', 'Le desk de futures S&P 500, lundi 19 octobre avant l\'ouverture', 'Le market maker, le soir du lundi noir'],
  scenariosEn: ['The portfolio-insurance programme manager, Sunday evening, October 18', 'The S&P 500 futures desk, Monday October 19 before the open', 'The market maker, on the evening of Black Monday'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const encours = randFloat(rng, 8, 15, 1);
    const delta0 = randFloat(rng, 0.3, 0.4, 2);
    const delta1 = randFloat(rng, 0.55, 0.65, 2);
    const gap = randFloat(rng, 8, 12, 1);
    const notLong = randFloat(rng, 2, 4, 1);
    const total = randInt(rng, 60, 90);
    const vol = randFloat(rng, 4, 6, 1);
    const jour = 22.6;

    const cible = delta1 * encours;
    const aVendreLundi = (delta1 - delta0) * encours;
    const aVendreBrut = venteForceePourCash(aVendreLundi, gap);
    const appel = (jour / 100) * notLong;
    const ventesCollectives = (delta1 - delta0) * total;
    const nbJours = ventesCollectives / vol;
    const rebond = gainRequisPourRecuperer(jour);
    const repCible = r2(cible);
    const repVendre = r2(aVendreLundi);
    const repBrut = r2(aVendreBrut);
    const repAppel = r2(appel);
    const repJours = r1(nbJours);
    const repRebond = r1(rebond);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `from January to August 1987 the Dow gains +44% and peaks at 2,722.42 on August 25 — five years of uninterrupted bull market — while the foundations crack: the US 10-year has moved from about 7% to more than 10% within the year, and the dollar is under strain despite the Louvre accords; your programme insures \\$${f(encours, 1)}bn of equity portfolios by synthetically replicating a put — Leland-O'Brien-Rubinstein logic: sell S&P 500 futures when the market falls, buy them back when it rises, mechanically, by rule; across the street, between \\$60bn and \\$90bn are insured the same way (take \\$${f(total, 0)}bn); after the week of October 12-16 the market has already given back about 10%, and the replication model has moved the put's delta from −${f(delta0, 2)} to −${f(delta1, 2)}; the futures market normally absorbs about \\$${f(vol, 1)}bn a day, and Monday opens on a gap — average execution about ${pct(gap, 1)} below Friday's prices`
      : `de janvier à août 1987, le Dow gagne +44 % et touche 2 722,42 le 25 août — cinq ans de marché haussier ininterrompu — pendant que les fondations craquent : le 10 ans américain est passé d'environ 7 % à plus de 10 % dans l'année, et le dollar est sous tension malgré les accords du Louvre ; votre programme assure ${f(encours, 1)} Md\\$ de portefeuilles actions en répliquant synthétiquement un put — la logique Leland-O'Brien-Rubinstein : vendre des futures S&P 500 quand le marché baisse, les racheter quand il monte, mécaniquement, selon une règle ; sur la place, entre 60 et 90 Md\\$ sont assurés de la même façon (retenez ${f(total, 0)} Md\\$) ; après la semaine du 12-16 octobre, le marché a déjà rendu environ 10 %, et le modèle de réplication a fait passer le delta du put de −${f(delta0, 2)} à −${f(delta1, 2)} ; le marché des futures absorbe normalement environ ${f(vol, 1)} Md\\$ par jour, et lundi ouvre en gap — exécution moyenne environ ${pct(gap, 1)} sous les cours de vendredi`;
    const contexte = (en
      ? [
        `Sunday, October 18, 1987, 10 p.m. You run the portfolio-insurance programme, and the model's output for tomorrow is sitting on your desk like an unexploded shell: after last week's 10% slide, the replication rule demands a much bigger short. The situation: ${desc}.\n\nBefore the open, work the numbers the model will execute without asking you: the target futures short; the block to sell at the bell; what the gap does to that execution; the margin call that will land tonight on whoever is long against you; and then the question the model never asks — what happens when EVERY programme on the street sends the same order, into a market that absorbs \\$${f(vol, 1)}bn on a normal day. Tomorrow the Dow will lose 508 points, −22.6% in one session, from 2,246.74 to 1,738.74 — the worst day in the history of US indices, without one piece of fundamental news.`,
        `Monday, October 19, 1987, 8 a.m., the futures desk. The order tickets stacking up before the open all come from the same species of client: portfolio insurers whose models accumulated sell orders over the weekend. The book you see: ${desc}.\n\nQuantify what is about to hit your screens: the insurers' target short, the block they must sell at the open, the execution shortfall the gap imposes, the variation margin that will be called tonight on the longs — the arbitrageurs you finance —, and the composition arithmetic: the street's mechanical sales measured in days of normal volume. The cash-futures arbitrage will transmit the pressure to stocks, quotation systems will saturate, some market makers will stop answering their phones. By the close: −22.6%.`,
        `Monday, October 19, 1987, 11 p.m. You are a market maker, the tape says −508 points, −22.6%, and the clearing house's evening call is on your desk: variation margin, cash, before tomorrow's open. The day you have just survived: ${desc}.\n\nReconstruct the mechanics that just happened to you, in order: the insurers' target delta, the futures they had to sell into the open, what the gap did to their execution, YOUR margin call on the long leg you carry, and the composition arithmetic that made the whole thing inevitable. Then the two numbers of the aftermath: the rebound that undoes −22.6%, and the reason tomorrow morning's one-sentence statement from a ten-week-old Fed chairman named Greenspan will matter more than everything that happened today.`,
      ]
      : [
        `Dimanche 18 octobre 1987, 22 h. Vous gérez le programme d'assurance de portefeuille, et la sortie du modèle pour demain est posée sur votre bureau comme un obus non explosé : après les 10 % rendus la semaine dernière, la règle de réplication exige une position courte beaucoup plus grosse. La situation : ${desc}.\n\nAvant l'ouverture, faites les comptes que le modèle exécutera sans vous demander votre avis : la position courte cible en futures ; le bloc à vendre à la cloche ; ce que le gap fait à cette exécution ; l'appel de marge qui tombera ce soir sur celui qui est long en face de vous ; puis la question que le modèle ne pose jamais — ce qui se passe quand TOUS les programmes de la place envoient le même ordre, dans un marché qui absorbe ${f(vol, 1)} Md\\$ un jour normal. Demain, le Dow perdra 508 points, −22,6 % en une séance, de 2 246,74 à 1 738,74 — le pire jour de l'histoire des indices américains, sans une seule nouvelle fondamentale.`,
        `Lundi 19 octobre 1987, 8 h, le desk de futures. Les tickets d'ordres qui s'empilent avant l'ouverture viennent tous de la même espèce de client : des assureurs de portefeuille dont les modèles ont accumulé des ordres de vente pendant le week-end. Le tableau que vous voyez : ${desc}.\n\nQuantifiez ce qui va frapper vos écrans : la position courte cible des assureurs, le bloc qu'ils doivent vendre à l'ouverture, le manque à l'exécution que le gap impose, la marge de variation qui sera appelée ce soir chez les longs — les arbitragistes que vous financez —, et l'arithmétique de composition : les ventes mécaniques de la place mesurées en jours de volume normal. L'arbitrage cash-futures transmettra la pression aux actions, les systèmes de cotation satureront, certains market makers ne décrocheront plus leur téléphone. À la cloche : −22,6 %.`,
        `Lundi 19 octobre 1987, 23 h. Vous êtes market maker, le ruban dit −508 points, −22,6 %, et l'appel du soir de la chambre de compensation est sur votre bureau : marge de variation, en cash, avant l'ouverture de demain. La journée que vous venez de survivre : ${desc}.\n\nReconstituez la mécanique qui vient de vous arriver, dans l'ordre : le delta cible des assureurs, les futures qu'ils ont dû vendre dans l'ouverture, ce que le gap a fait à leur exécution, VOTRE appel de marge sur la jambe longue que vous portez, et l'arithmétique de composition qui rendait le tout inévitable. Puis les deux nombres de l'après : le rebond qui défait −22,6 %, et la raison pour laquelle le communiqué d'une phrase, demain matin, d'un président de la Fed en poste depuis dix semaines nommé Greenspan, comptera plus que tout ce qui s'est passé aujourd'hui.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The target short the model demands' : 'a) La position courte cible que le modèle exige',
          enonce: en
            ? `Replicating the put now requires carrying a delta of −${f(delta1, 2)} on the \\$${f(encours, 1)}bn insured. What target short futures position, in \\$bn, does the model demand?`
            : `Répliquer le put exige désormais de porter un delta de −${f(delta1, 2)} sur les ${f(encours, 1)} Md\\$ assurés. Quelle position courte cible en futures, en Md\\$, le modèle exige-t-il ?`,
          reponse: repCible, tolerance: Math.max(0.05, repCible * 0.02), toleranceMode: 'absolu', unite: 'Md$',
          etapes: [{
            titre: en ? 'Module 8, read in the other direction' : 'Le module 8, lu dans l\'autre sens',
            contenu: en
              ? `Target short = ${f(delta1, 2)} × ${f(encours, 1)} = **\\$${f(repCible, 2)}bn** of futures. This is dynamic replication (module 8) run in reverse: instead of hedging an option you sold, you manufacture the put you did not buy — a negative delta that GROWS as the market falls. The mathematics is correct for one actor: Black-Scholes guarantees the replication works… under its assumptions, one of which is continuous liquidity — you can always trade, in the size you want, near the last price. Keep that assumption in sight; it dies today.`
              : `Courte cible = ${f(delta1, 2)} × ${f(encours, 1)} = **${f(repCible, 2)} Md\\$** de futures. C'est la réplication dynamique (module 8) conduite à l'envers : au lieu de couvrir une option vendue, on fabrique le put qu'on n'a pas acheté — un delta négatif qui GROSSIT quand le marché baisse. La mathématique est correcte pour un acteur isolé : Black-Scholes garantit que la réplication fonctionne… sous ses hypothèses, dont la liquidité continue — on peut toujours traiter, en quantité voulue, à un prix proche du dernier. Gardez cette hypothèse en vue ; elle meurt aujourd'hui.`,
          }],
        },
        {
          intitule: en ? 'b) The block to sell at the open' : 'b) Le bloc à vendre à l\'ouverture',
          enonce: en
            ? `The delta was −${f(delta0, 2)} before last week; it must now be −${f(delta1, 2)}. What additional futures block, in \\$bn, must be sold when the market opens?`
            : `Le delta était de −${f(delta0, 2)} avant la semaine dernière ; il doit désormais être de −${f(delta1, 2)}. Quel bloc de futures supplémentaire, en Md\\$, faut-il vendre quand le marché ouvre ?`,
          reponse: repVendre, tolerance: Math.max(0.05, repVendre * 0.02), toleranceMode: 'absolu', unite: 'Md$',
          etapes: [{
            titre: en ? 'Orders accumulated over a weekend' : 'Des ordres accumulés pendant un week-end',
            contenu: en
              ? `To sell = (${f(delta1, 2)} − ${f(delta0, 2)}) × ${f(encours, 1)} = **\\$${f(repVendre, 2)}bn** — for YOUR programme alone. The 10% already lost during the week of October 12-16 means the models spent the weekend accumulating enormous PENDING sell orders for Monday: the rule trades on the market's moves, and the market moved while the exchange was closed. Monday's open is therefore not a price discovery — it is a queue of mechanical orders all pointing the same way.`
              : `À vendre = (${f(delta1, 2)} − ${f(delta0, 2)}) × ${f(encours, 1)} = **${f(repVendre, 2)} Md\\$** — pour VOTRE seul programme. Les 10 % déjà rendus pendant la semaine du 12-16 octobre signifient que les modèles ont passé le week-end à accumuler d'énormes ordres de vente EN ATTENTE pour lundi : la règle traite sur les mouvements du marché, et le marché a bougé pendant que la Bourse était fermée. L'ouverture de lundi n'est donc pas une découverte de prix — c'est une file d'ordres mécaniques pointant tous dans le même sens.`,
          }],
        },
        {
          intitule: en ? 'c) What the gap does to the execution' : 'c) Ce que le gap fait à l\'exécution',
          enonce: en
            ? `Monday opens in a gap: executions print about ${pct(gap, 1)} below Friday's prices. To obtain \\$${f(repVendre, 2)}bn of effective protection valued at Friday's prices, what pre-gap notional must actually be traded, in \\$bn?`
            : `Lundi ouvre en gap : les exécutions passent environ ${pct(gap, 1)} sous les cours de vendredi. Pour obtenir ${f(repVendre, 2)} Md\\$ de protection effective valorisée aux cours de vendredi, quel notionnel pré-gap faut-il réellement traiter, en Md\\$ ?`,
          reponse: repBrut, tolerance: Math.max(0.05, repBrut * 0.02), toleranceMode: 'absolu', unite: 'Md$',
          etapes: [{
            titre: en ? 'Selling more because prices fell — the loop\'s fuel' : 'Vendre plus parce que les prix ont baissé — le carburant de la boucle',
            contenu: en
              ? `To trade = ${f(repVendre, 2)} / (1 − ${f(gap, 1)}%) = **\\$${f(repBrut, 2)}bn**. Read the forced-sale formula as an impact machine: the gap forces you to sell MORE to achieve the same protection, and that extra selling deepens the gap for the programme behind you. Each tranche of sales lowers the price, the lower price raises the delta the models must carry, the higher delta generates the next tranche — the strategy manufactures the very scenario it insures against. This is endogenous risk: the danger was not in the market, it was in the rule.`
              : `À traiter = ${f(repVendre, 2)} / (1 − ${f(gap, 1)} %) = **${f(repBrut, 2)} Md\\$**. Lisez la formule de vente forcée comme une machine à impact : le gap force à vendre PLUS pour obtenir la même protection, et ce surplus de ventes creuse le gap pour le programme suivant. Chaque tranche de ventes abaisse le prix, le prix plus bas augmente le delta que les modèles doivent porter, le delta plus haut engendre la tranche suivante — la stratégie fabrique le scénario même contre lequel elle assure. C'est le risque endogène : le danger n'était pas dans le marché, il était dans la règle.`,
          }],
        },
        {
          intitule: en ? 'd) The evening margin call' : 'd) L\'appel de marge du soir',
          enonce: en
            ? `The session closes at −${pct(jour, 1)}. On a LONG futures leg of \\$${f(notLong, 1)}bn notional (the cash-futures arbitrageur — or you, market maker), what variation margin, in \\$bn of cash, does the clearing house call before Tuesday's open?`
            : `La séance clôture à −${pct(jour, 1)}. Sur une jambe LONGUE de futures de ${f(notLong, 1)} Md\\$ de notionnel (l'arbitragiste cash-futures — ou vous, market maker), quelle marge de variation, en Md\\$ de cash, la chambre appelle-t-elle avant l'ouverture de mardi ?`,
          reponse: repAppel, tolerance: Math.max(0.02, repAppel * 0.03), toleranceMode: 'absolu', unite: 'Md$',
          etapes: [{
            titre: en ? 'Module 7 arrives at 11 p.m.' : 'Le module 7 arrive à 23 h',
            contenu: en
              ? `Call = ${pct(jour, 1)} × ${f(notLong, 1)} = **\\$${f(repAppel, 2)}bn** of cash, tonight — the margin mechanics of module 7, at historical scale. This is where a price crash threatens to become a credit event: if the longs cannot post, the clearing house liquidates into a dead market, and the brokers who financed them take the hit. That is precisely the wound the Fed will treat on Tuesday morning — by pushing banks to keep their credit lines open to brokers and market makers, so positions can be carried instead of dumped.`
              : `Appel = ${pct(jour, 1)} × ${f(notLong, 1)} = **${f(repAppel, 2)} Md\\$** de cash, ce soir — la mécanique de marge du module 7, à l'échelle historique. C'est ici qu'un krach de prix menace de devenir un événement de crédit : si les longs ne peuvent pas poster, la chambre liquide dans un marché mort, et les brokers qui les finançaient prennent le choc. C'est précisément la plaie que la Fed traitera mardi matin — en poussant les banques à maintenir leurs lignes de crédit aux brokers et aux market makers, pour que les positions soient portées au lieu d'être bradées.`,
          }],
        },
        {
          intitule: en ? 'e) The fallacy of composition, in days of volume' : 'e) Le sophisme de composition, en jours de volume',
          enonce: en
            ? `Apply the same delta adjustment (−${f(delta0, 2)} → −${f(delta1, 2)}) to the \\$${f(total, 0)}bn insured across the street. Measured against a normal daily futures volume of \\$${f(vol, 1)}bn, how many days of volume do the street's mechanical sales represent?`
            : `Appliquez le même ajustement de delta (−${f(delta0, 2)} → −${f(delta1, 2)}) aux ${f(total, 0)} Md\\$ assurés sur la place. Rapportées à un volume quotidien normal de futures de ${f(vol, 1)} Md\\$, combien de jours de volume les ventes mécaniques de la place représentent-elles ?`,
          reponse: repJours, tolerance: 0.2, toleranceMode: 'absolu', unite: en ? 'days' : 'jours',
          etapes: [{
            titre: en ? 'An exit sized for one, used by all' : 'Une sortie dimensionnée pour un, empruntée par tous',
            contenu: en
              ? `Street sales = (${f(delta1, 2)} − ${f(delta0, 2)}) × ${f(total, 0)} = \\$${f(r2(ventesCollectives), 2)}bn; against \\$${f(vol, 1)}bn of normal daily volume, that is **${f(repJours, 1)} days of volume** — demanded in the first hour. There is the fallacy of composition, quantified: the strategy assumes there is always someone on the other side, which is true for one programme and false for all of them at once. A stop-loss protects you only if the others do not have the same one; an emergency exit sized for one person is never sized for the whole room. The quotation systems saturate, the arbitrage transmits the pressure to stocks, and −22.6% happens without any fundamental news.`
              : `Ventes de la place = (${f(delta1, 2)} − ${f(delta0, 2)}) × ${f(total, 0)} = ${f(r2(ventesCollectives), 2)} Md\\$ ; rapportées à ${f(vol, 1)} Md\\$ de volume quotidien normal, cela fait **${f(repJours, 1)} jours de volume** — exigés dans la première heure. Voilà le sophisme de composition, quantifié : la stratégie suppose qu'il y a toujours quelqu'un en face, ce qui est vrai pour un programme et faux pour tous à la fois. Un stop-loss ne vous protège que si les autres n'ont pas le même ; une sortie de secours dimensionnée pour un individu ne l'est jamais pour la salle entière. Les systèmes de cotation saturent, l'arbitrage transmet la pression aux actions, et −22,6 % arrive sans aucune nouvelle fondamentale.`,
          }],
          pieges: [en
            ? `"The models were wrong" misses the point the jury wants: the models were RIGHT — delta replication works for an isolated actor. What broke was the continuous-liquidity assumption, killed by the strategy's own popularity. The danger was not in the strategy but in its success.`
            : `« Les modèles étaient faux » manque le point que le jury attend : les modèles étaient JUSTES — la réplication delta fonctionne pour un acteur isolé. Ce qui a cassé, c'est l'hypothèse de liquidité continue, tuée par la popularité de la stratégie elle-même. Le danger n'était pas dans la stratégie, mais dans son succès.`],
        },
        {
          intitule: en ? 'f) The morning after: the arithmetic and the sentence' : 'f) Le lendemain : l\'arithmétique et la phrase',
          enonce: en
            ? `Recovering a −${pct(jour, 1)} loss requires what gain, in %?`
            : `Récupérer une perte de −${pct(jour, 1)} exige quel gain, en % ?`,
          reponse: repRebond, tolerance: 0.3, toleranceMode: 'absolu', unite: '%',
          etapes: [
            {
              titre: en ? 'The hole is recoverable — if credit survives' : 'Le trou est récupérable — si le crédit survit',
              contenu: en
                ? `Required gain = 100/(100 − ${f(jour, 1)}) − 1 = **${pct(repRebond, 1)}** — "only" that, against the +809% the 1932 Dow needed. The depth of the hole was never the real question; the question is what happens the next morning. Tuesday, October 20, before the open, the Fed of Alan Greenspan — chairman for ten weeks — publishes ONE sentence: ready to serve as a source of liquidity to support the economic and financial system. Bagehot in one line; behind it, banks reopen credit lines to brokers. The panic has no second act: no chain failures, no recession, and the Dow regains its peak by August 1989.`
                : `Gain requis = 100/(100 − ${f(jour, 1)}) − 1 = **${pct(repRebond, 1)}** — « seulement », contre les +809 % qu'exigeait le Dow de 1932. La profondeur du trou n'a jamais été la vraie question ; la question est ce qui se passe le lendemain matin. Mardi 20 octobre, avant l'ouverture, la Fed d'Alan Greenspan — président depuis dix semaines — publie UNE phrase : prête à servir de source de liquidité pour soutenir le système économique et financier. Bagehot en une ligne ; derrière, les banques rouvrent leurs lignes de crédit aux brokers. La panique n'a pas de deuxième acte : pas de faillites en chaîne, pas de récession, et le Dow retrouve son pic dès août 1989.`,
            },
            {
              titre: en ? 'What that Monday taught the trade' : 'Ce que ce lundi a appris au métier',
              contenu: en
                ? `Two permanent scars, which you still touch every day. Circuit breakers: automatic trading halts to break the loops of programmed selling — a microstructure answer to a microstructure problem. And the volatility smile: before October 1987 the implied-vol surface of index options was roughly flat; since then, out-of-the-money puts trade structurally richer — the market prices the possibility of the crash, permanently, in every options surface. The exam sentence: never judge a crash by its equity violence, always by its transmission to the credit system — nearly twice the worst day of 1929, and no depression, because the lender of last resort spoke the next morning.`
                : `Deux cicatrices permanentes, que vous côtoyez encore chaque jour. Les circuit breakers : des suspensions automatiques de cotation pour casser les boucles de ventes programmées — une réponse de microstructure à un problème de microstructure. Et le smile de volatilité : avant octobre 1987, la nappe de volatilité implicite des options d'indice était à peu près plate ; depuis, les puts hors de la monnaie cotent structurellement plus cher — le marché price la possibilité du krach, en permanence, dans chaque nappe. La phrase d'examen : ne jamais juger un krach à sa violence boursière, toujours à sa transmission au système de crédit — près de deux fois le pire jour de 1929, et aucune dépression, parce que le prêteur en dernier ressort a parlé le lendemain matin.`,
            },
          ],
          pieges: [en
            ? `Answering ${pct(jour, 1)} (symmetry) forgets the asymmetry of losses: the gain applies to a SMALLER base — the single most profitable arithmetic trap in interviews, from −22.6%/+29.2% here to −89%/+809% for 1932.`
            : `Répondre ${pct(jour, 1)} (symétrie) oublie l'asymétrie des pertes : le gain s'applique à une base PLUS PETITE — le piège d'arithmétique le plus rentable en entretien, de −22,6 %/+29,2 % ici à −89 %/+809 % pour 1932.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 11. m11-pb-11 — Le week-end Lehman, 13-15 septembre 2008 — BOSS N4  */
/* ------------------------------------------------------------------ */
const weekEndLehman: ProblemeMoule = {
  id: 'm11-pb-11', moduleId: M11,
  titre: 'Le week-end Lehman, 13-15 septembre 2008 : la ruée sur les haircuts',
  titreEn: 'The Lehman weekend, September 13-15, 2008: the run on haircuts',
  typeDeCas: 'run sur le financement',
  typeDeCasEn: 'run on funding',
  difficulte: 4,
  scenarios: ['Le trésorier de Lehman, vendredi 12 septembre au soir', 'Le créancier repo qui fixe le haircut de lundi', 'La salle du Trésor, dimanche 14 septembre'],
  scenariosEn: ['Lehman\'s treasurer, Friday evening, September 12', 'The repo lender setting Monday\'s haircut', 'The Treasury\'s war room, Sunday September 14'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const book = randInt(rng, 180, 220);
    const h0 = randFloat(rng, 1.5, 2.5, 1);
    const h1 = randInt(rng, 20, 30);
    const dv = randFloat(rng, 6, 10, 1);
    const actifs = randInt(rng, 620, 660);
    const fp = randFloat(rng, 20, 23, 1);
    const cds = randInt(rng, 480, 520);
    const reprov = randFloat(rng, 8, 12, 1);

    const finAvant = financementRepo(book, h0);
    const evapore = (book * (h1 - h0)) / 100;
    const aVendre = venteForceePourCash(evapore, dv);
    const perte = (aVendre * dv) / 100;
    const levierAvant = levierBilan(actifs, fp);
    const levierApres = levierBilan(actifs - aVendre, fp - perte);
    const trouAig = (cds * reprov) / 100;
    const repFin = r1(finAvant);
    const repEvap = r1(evapore);
    const repVendre = r1(aVendre);
    const repPerte = r2(perte);
    const repLevierApres = r1(levierApres);
    const repAig = r1(trouAig);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `Lehman Brothers carries about \\$${f(actifs, 0)}bn of assets on \\$${f(fp, 1)}bn of equity — a leverage of about ${f(r1(levierAvant), 1)}, where a ${pct(r1(-100 / levierAvant), 1)} fall in assets erases everything — and finances a securities book of about \\$${f(book, 0)}bn in overnight repo, to be rolled every morning; in 2006 the haircuts on this collateral lived near ${pct(h0, 1)}; since Bear Stearns died of its repo in March (sold for \\$2 a share, raised to \\$10, with a \\$29bn Fed guarantee), the lenders have been raising them — this weekend they demand ${pct(h1, 0)}, when they roll at all; any rapid sale of the book executes at a discount of about ${pct(dv, 1)}; across the market, AIG has sold about \\$${f(cds, 0)}bn of CDS protection on senior tranches, without reserves, and its counterparties would have to absorb about ${pct(reprov, 1)} of that notional in immediate losses and collateral calls if the insurer fell`
      : `Lehman Brothers porte environ ${f(actifs, 0)} Md\\$ d'actifs pour ${f(fp, 1)} Md\\$ de fonds propres — un levier d'environ ${f(r1(levierAvant), 1)}, où une baisse d'actifs de ${pct(r1(-100 / levierAvant), 1)} efface tout — et finance un book de titres d'environ ${f(book, 0)} Md\\$ en repo au jour le jour, à renouveler chaque matin ; en 2006, les haircuts sur ce collatéral vivaient vers ${pct(h0, 1)} ; depuis que Bear Stearns est morte de son repo en mars (vendue 2 \\$ l'action, relevé à 10 \\$, avec une garantie Fed de 29 Md\\$), les prêteurs les relèvent — ce week-end ils exigent ${pct(h1, 0)}, quand ils renouvellent tout court ; toute vente rapide du book s'exécute sous une décote d'environ ${pct(dv, 1)} ; sur le marché d'en face, AIG a vendu environ ${f(cds, 0)} Md\\$ de protection CDS sur les tranches senior, sans réserves, et ses contreparties devraient absorber environ ${pct(reprov, 1)} de ce notionnel en pertes et appels de collatéral immédiats si l'assureur tombait`;
    const contexte = (en
      ? [
        `Friday, September 12, 2008, 9 p.m., the treasury floor at 745 Seventh Avenue. You are Lehman's treasurer, and your job this weekend is a single question asked every hour: can we open on Monday? The buyers are evaporating one by one — Bank of America is drifting toward Merrill Lynch, Barclays needs a guarantee London will not give. What remains is the arithmetic of the funding: ${desc}.\n\nRun it the way the file will be read for decades: the financing the book obtained when the world trusted the collateral; the financing that evaporates when the haircut jumps; the forced sale that plugging the gap would require; the loss that sale crystallises; and the perverse arithmetic showing that selling at a loss makes the leverage WORSE, not better. Sunday night, the answer will be no: Monday, September 15, the firm files — \\$613bn of debts, the largest bankruptcy in American history.`,
        `Sunday, September 14, 2008. You run collateral at a money-market fund that lends billions to broker-dealers overnight against securities. Tomorrow at 7 a.m. your desk must answer one question: roll Lehman's repo, and at what haircut? Your analysts' file: ${desc}.\n\nGorton's sentence describes what you are about to do: the run of 2008 is not a queue at a teller's window, it is a haircut that jumps — the silent withdrawal of wholesale funding. Quantify your own decision: the funding at the old haircut, the funding that disappears at the new one, the forced sales your prudence imposes on the borrower, the loss those sales realise, the leverage that explodes as the firm shrinks. Then look across the market at AIG, and understand why the authorities will draw, in 24 hours, the line they drew.`,
        `Sunday, September 14, 2008, the Treasury's war room. Paulson has said it in every tone: no public money for Lehman — after Bear Stearns in March, the government will not write the next guarantee. Barclays has just fallen through: London refuses. On the table, two files: Lehman, and one for Tuesday nobody has opened yet — AIG. The numbers: ${desc}.\n\nYour note for the Secretary must contain the mechanics of the death (funding evaporated by haircuts, forced sales, leverage exploding as the firm sells at a loss) and the answer to the question history will ask: why let Lehman file on the 15th and rescue AIG on the 16th with \\$85bn against 79.9% of the capital? The answer is not size. It is a number about interconnection — compute it, and the double standard becomes a doctrine.`,
      ]
      : [
        `Vendredi 12 septembre 2008, 21 h, l'étage de la trésorerie du 745 Seventh Avenue. Vous êtes le trésorier de Lehman, et votre travail ce week-end tient en une question posée toutes les heures : peut-on ouvrir lundi ? Les acheteurs s'évaporent un à un — Bank of America dérive vers Merrill Lynch, Barclays a besoin d'une garantie que Londres ne donnera pas. Ce qui reste, c'est l'arithmétique du financement : ${desc}.\n\nDéroulez-la comme le dossier sera lu pendant des décennies : le financement que le book obtenait quand le monde faisait confiance au collatéral ; le financement qui s'évapore quand le haircut saute ; la vente forcée qu'exigerait de boucher le trou ; la perte que cette vente cristallise ; et l'arithmétique perverse qui montre que vendre à perte AGGRAVE le levier au lieu de l'améliorer. Dimanche soir, la réponse sera non : lundi 15 septembre, la firme dépose le bilan — 613 Md\\$ de dettes, la plus grosse faillite de l'histoire américaine.`,
        `Dimanche 14 septembre 2008. Vous gérez le collatéral d'un fonds monétaire qui prête chaque nuit des milliards aux broker-dealers contre titres. Demain à 7 h, votre desk doit répondre à une question : renouveler le repo de Lehman, et à quel haircut ? Le dossier de vos analystes : ${desc}.\n\nLa phrase de Gorton décrit ce que vous vous apprêtez à faire : le run de 2008 n'est pas une file au guichet, c'est un haircut qui saute — le retrait silencieux du financement de gros. Quantifiez votre propre décision : le financement à l'ancien haircut, le financement qui disparaît au nouveau, les ventes forcées que votre prudence impose à l'emprunteur, la perte que ces ventes réalisent, le levier qui explose à mesure que la firme rétrécit. Puis regardez AIG de l'autre côté du marché, et comprenez pourquoi les autorités traceront, à 24 heures d'intervalle, la ligne qu'elles ont tracée.`,
        `Dimanche 14 septembre 2008, la salle de crise du Trésor. Paulson l'a dit sur tous les tons : pas d'argent public pour Lehman — après Bear Stearns en mars, l'État n'écrira pas la garantie suivante. Barclays vient de tomber à l'eau : Londres refuse. Sur la table, deux dossiers : Lehman, et un dossier pour mardi que personne n'a encore ouvert — AIG. Les nombres : ${desc}.\n\nVotre note pour le Secrétaire doit contenir la mécanique de la mort (financement évaporé par les haircuts, ventes forcées, levier qui explose à mesure que la firme vend à perte) et la réponse à la question que l'histoire posera : pourquoi laisser Lehman déposer le 15 et sauver AIG le 16 avec 85 Md\\$ contre 79,9 % du capital ? La réponse n'est pas la taille. C'est un nombre d'interconnexion — calculez-le, et le deux poids deux mesures devient une doctrine.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The funding, when the world still trusted' : 'a) Le financement, quand le monde faisait encore confiance',
          enonce: en
            ? `At the old haircut of ${pct(h0, 1)}, how much funding, in \\$bn, did the \\$${f(book, 0)}bn securities book obtain in repo?`
            : `À l'ancien haircut de ${pct(h0, 1)}, combien de financement, en Md\\$, le book de titres de ${f(book, 0)} Md\\$ obtenait-il en repo ?`,
          reponse: repFin, tolerance: 1, toleranceMode: 'absolu', unite: 'Md$',
          etapes: [{
            titre: en ? 'A bank without deposits, rolled every morning' : 'Une banque sans dépôts, renouvelée chaque matin',
            contenu: en
              ? `Funding = ${f(book, 0)} × (1 − ${f(h0, 1)}%) = **\\$${f(repFin, 1)}bn** — the lender keeps ${pct(h0, 1)} as a cushion. This is the shadow-banking machine of chapter 5: the business of a bank — short funding against long assets — without deposit insurance and without a lender of last resort. A ${pct(h0, 1)} haircut implicitly allows a leverage of 100/${f(h0, 1)} ≈ ${f(r0(100 / h0), 0)}, invisible in any regulatory ratio. The whole edifice rests on the overnight roll: the funding exists only as long as someone renews it tomorrow morning.`
              : `Financement = ${f(book, 0)} × (1 − ${f(h0, 1)} %) = **${f(repFin, 1)} Md\\$** — le prêteur garde ${pct(h0, 1)} de coussin. C'est la machine du shadow banking du chapitre 5 : le métier d'une banque — financement court contre actifs longs — sans assurance des dépôts et sans prêteur en dernier ressort. Un haircut de ${pct(h0, 1)} autorise implicitement un levier de 100/${f(h0, 1)} ≈ ${f(r0(100 / h0), 0)}, invisible dans tout ratio réglementaire. Tout l'édifice repose sur le renouvellement au jour le jour : le financement n'existe que tant que quelqu'un le renouvelle demain matin.`,
          }],
        },
        {
          intitule: en ? 'b) The run: what the new haircut evaporates' : 'b) Le run : ce que le nouveau haircut évapore',
          enonce: en
            ? `Monday morning, the lenders demand ${pct(h1, 0)}. How much funding, in \\$bn, evaporates on the same book — cash to find the same day?`
            : `Lundi matin, les prêteurs exigent ${pct(h1, 0)}. Combien de financement, en Md\\$, s'évapore sur le même book — du cash à trouver le jour même ?`,
          reponse: repEvap, tolerance: 1, toleranceMode: 'absolu', unite: 'Md$',
          etapes: [{
            titre: en ? 'Not a queue at a window — a percentage that moves' : 'Pas une file au guichet — un pourcentage qui bouge',
            contenu: en
              ? `Evaporated = ${f(book, 0)} × (${f(h1, 0)}% − ${f(h0, 1)}%) = **\\$${f(repEvap, 1)}bn**, due today, because overnight repo reprices every morning. Gorton's formula, to quote at the oral: the run of 2008 was not a run on deposits, it was a run ON THE HAIRCUTS. The lender never says "no"; he says "${pct(h1, 0)}" — and the arithmetic does the rest. Northern Rock had already demonstrated it in September 2007: the queues of depositors only certified a death caused by market funding, evaporated first.`
              : `Évaporé = ${f(book, 0)} × (${f(h1, 0)} % − ${f(h0, 1)} %) = **${f(repEvap, 1)} Md\\$**, exigibles aujourd'hui, parce que le repo au jour le jour se re-price chaque matin. La formule de Gorton, à citer à l'oral : le run de 2008 ne fut pas une ruée aux guichets, ce fut une ruée SUR LES HAIRCUTS. Le prêteur ne dit jamais « non » ; il dit « ${pct(h1, 0)} » — et l'arithmétique fait le reste. Northern Rock l'avait déjà démontré en septembre 2007 : les files de déposants n'ont fait que constater un décès causé par le financement de marché, évaporé le premier.`,
          }],
        },
        {
          intitule: en ? 'c) The forced sale that plugging the gap requires' : 'c) La vente forcée qu\'exige le trou',
          enonce: en
            ? `To raise those \\$${f(repEvap, 1)}bn by selling under a liquidation discount of ${pct(dv, 1)}, what pre-discount market value, in \\$bn, must be sold?`
            : `Pour lever ces ${f(repEvap, 1)} Md\\$ en vendant sous une décote de liquidation de ${pct(dv, 1)}, quelle valeur de marché pré-décote, en Md\\$, faut-il vendre ?`,
          reponse: repVendre, tolerance: 1, toleranceMode: 'absolu', unite: 'Md$',
          etapes: [{
            titre: en ? 'Selling depresses, depressing widens, widening forces' : 'Vendre déprime, déprimer élargit, élargir force',
            contenu: en
              ? `To sell = ${f(repEvap, 1)} / (1 − ${f(dv, 1)}%) = **\\$${f(repVendre, 1)}bn** of securities, into a market where every dealer knows why you are selling. And the loop closes: the sales depress the prices of the very collateral the haircuts are set on, wider haircuts evaporate more funding, more funding gone forces more sales — the chapter 1 liquidity spiral in closed circuit. This is why "just sell assets" was never an exit: for the system as a whole, the exit was the fire.`
              : `À vendre = ${f(repEvap, 1)} / (1 − ${f(dv, 1)} %) = **${f(repVendre, 1)} Md\\$** de titres, dans un marché où chaque dealer sait pourquoi vous vendez. Et la boucle se ferme : les ventes dépriment les prix du collatéral même sur lequel les haircuts sont fixés, des haircuts plus larges évaporent plus de financement, le financement disparu force de nouvelles ventes — la spirale de liquidité du chapitre 1 en circuit fermé. Voilà pourquoi « il n'y a qu'à vendre des actifs » n'a jamais été une sortie : pour le système entier, la sortie était l'incendie.`,
          }],
        },
        {
          intitule: en ? 'd) The loss the sale crystallises' : 'd) La perte que la vente cristallise',
          enonce: en
            ? `On that \\$${f(repVendre, 1)}bn sale at a ${pct(dv, 1)} discount, what loss, in \\$bn, is realised against the equity?`
            : `Sur cette vente de ${f(repVendre, 1)} Md\\$ sous ${pct(dv, 1)} de décote, quelle perte, en Md\\$, est réalisée contre les fonds propres ?`,
          reponse: repPerte, tolerance: 0.15, toleranceMode: 'absolu', unite: 'Md$',
          etapes: [{
            titre: en ? 'The till pays the discount' : 'La caisse paie la décote',
            contenu: en
              ? `Loss = ${f(repVendre, 1)} × ${f(dv, 1)}% = **\\$${f(repPerte, 2)}bn**, taken directly from \\$${f(fp, 1)}bn of equity — capital that a ${pct(r1(-100 / levierAvant), 1)} asset move already sufficed to erase. Note what just happened: a LIQUIDITY problem (a haircut) has manufactured a SOLVENCY loss (a realised discount). That conversion — illiquidity forcing sales that create the very losses the market feared — is the engine of every modern financial crisis, and the reason the liquidity/solvency distinction blurs precisely when it matters most.`
              : `Perte = ${f(repVendre, 1)} × ${f(dv, 1)} % = **${f(repPerte, 2)} Md\\$**, prélevés directement sur ${f(fp, 1)} Md\\$ de fonds propres — un capital qu'une variation d'actifs de ${pct(r1(-100 / levierAvant), 1)} suffisait déjà à effacer. Notez ce qui vient de se passer : un problème de LIQUIDITÉ (un haircut) a fabriqué une perte de SOLVABILITÉ (une décote réalisée). Cette conversion — l'illiquidité forçant des ventes qui créent les pertes mêmes que le marché craignait — est le moteur de toutes les crises financières modernes, et la raison pour laquelle la distinction liquidité/solvabilité se brouille précisément quand elle compte le plus.`,
          }],
        },
        {
          intitule: en ? 'e) Selling at a loss makes the leverage WORSE' : 'e) Vendre à perte AGGRAVE le levier',
          enonce: en
            ? `Before: \\$${f(actifs, 0)}bn of assets on \\$${f(fp, 1)}bn of equity. After selling \\$${f(repVendre, 1)}bn and losing \\$${f(repPerte, 2)}bn: what is the new leverage?`
            : `Avant : ${f(actifs, 0)} Md\\$ d'actifs pour ${f(fp, 1)} Md\\$ de fonds propres. Après la vente de ${f(repVendre, 1)} Md\\$ et la perte de ${f(repPerte, 2)} Md\\$ : quel est le nouveau levier ?`,
          reponse: repLevierApres, tolerance: 0.5, toleranceMode: 'absolu', unite: '×',
          etapes: [{
            titre: en ? 'Deleveraging that leverages' : 'Un désendettement qui endette',
            contenu: en
              ? `New leverage = (${f(actifs, 0)} − ${f(repVendre, 1)}) / (${f(fp, 1)} − ${f(repPerte, 2)}) = ${f(r1(actifs - aVendre), 1)} / ${f(r2(fp - perte), 2)} = **${f(repLevierApres, 1)}×**, against ${f(r1(levierAvant), 1)}× before. The numerator shrinks by the sale, but the denominator shrinks by the loss — and at these leverage levels, the equity effect wins: the firm sells itself SICKER. That is the trap that closed on Lehman during the weekend: no sale programme could outrun the arithmetic, only new capital or a buyer could — and on Sunday night there was neither. Monday, September 15: bankruptcy, \\$613bn of debts.`
              : `Nouveau levier = (${f(actifs, 0)} − ${f(repVendre, 1)}) / (${f(fp, 1)} − ${f(repPerte, 2)}) = ${f(r1(actifs - aVendre), 1)} / ${f(r2(fp - perte), 2)} = **${f(repLevierApres, 1)}×**, contre ${f(r1(levierAvant), 1)}× avant. Le numérateur rétrécit de la vente, mais le dénominateur rétrécit de la perte — et à ces niveaux de levier, l'effet fonds propres l'emporte : la firme se vend PLUS MALADE. C'est le piège qui s'est refermé sur Lehman pendant le week-end : aucun programme de cessions ne pouvait courir plus vite que l'arithmétique, seuls du capital neuf ou un acheteur le pouvaient — et dimanche soir, il n'y avait ni l'un ni l'autre. Lundi 15 septembre : dépôt de bilan, 613 Md\\$ de dettes.`,
          }],
          pieges: [en
            ? `"Selling assets deleverages" holds only if you sell at (or above) book: at a discount, equity falls faster in proportion than assets, and leverage RISES — check it against the numbers before asserting it in front of a jury.`
            : `« Vendre des actifs désendette » ne tient que si l'on vend au prix comptable (ou au-dessus) : sous décote, les fonds propres baissent proportionnellement plus vite que les actifs, et le levier MONTE — vérifiez-le sur les nombres avant de l'affirmer devant un jury.`],
        },
        {
          intitule: en ? 'f) Why AIG on the 16th and not Lehman on the 15th' : 'f) Pourquoi AIG le 16 et pas Lehman le 15',
          enonce: en
            ? `If AIG falls, its counterparties lose protection on about \\$${f(cds, 0)}bn of senior tranches and must absorb about ${pct(reprov, 1)} of that notional in immediate losses and collateral calls. How many \\$bn does AIG's default instantly spread through the balance sheets of the world's major banks?`
            : `Si AIG tombe, ses contreparties perdent la protection sur environ ${f(cds, 0)} Md\\$ de tranches senior et doivent absorber environ ${pct(reprov, 1)} de ce notionnel en pertes et appels de collatéral immédiats. Combien de Md\\$ le défaut d'AIG répand-il instantanément dans les bilans des grandes banques mondiales ?`,
          reponse: repAig, tolerance: 1, toleranceMode: 'absolu', unite: 'Md$',
          etapes: [
            {
              titre: en ? 'Systemic is measured in links, not billions' : 'Le systémique se mesure en liens, pas en milliards',
              contenu: en
                ? `Instant hole = ${f(cds, 0)} × ${f(reprov, 1)}% = **\\$${f(repAig, 1)}bn**, distributed across EVERY major bank at once — because AIG had concentrated, on a single balance sheet and without reserves, the insurance of the whole system's senior tranches. Lehman was a counterparty among others; AIG was the counterparty OF the others. That is the whole answer to the double standard: the authorities let a node fail and could not let the hub fail — \\$85bn from the Fed against 79.9% of the capital on the 16th, a de facto nationalisation, 24 hours after refusing a dollar for Lehman.`
                : `Trou instantané = ${f(cds, 0)} × ${f(reprov, 1)} % = **${f(repAig, 1)} Md\\$**, répartis d'un coup sur TOUTES les grandes banques — parce qu'AIG avait concentré, sur un seul bilan et sans réserves, l'assurance des tranches senior du système entier. Lehman était une contrepartie parmi d'autres ; AIG était la contrepartie DES autres. C'est toute la réponse au deux poids deux mesures : les autorités ont laissé tomber un nœud et ne pouvaient pas laisser tomber le hub — 85 Md\\$ de la Fed contre 79,9 % du capital le 16, une nationalisation de fait, 24 heures après avoir refusé un dollar à Lehman.`,
            },
            {
              titre: en ? 'What that weekend taught the trade' : 'Ce que ce week-end a appris au métier',
              contenu: en
                ? `The demonstration cost so much that nobody ever wanted to repeat it: within a day the Reserve Primary Fund breaks the buck, money-market funds are run, commercial paper closes for the whole economy; on September 29 the House rejects TARP and the S&P loses 8.8% in a session. Three lines survive: short funding of long assets is the powder, losses are only the spark; hidden leverage (haircuts, SIVs, an unreserved insurer) counts more than reported leverage; and systemic risk lives in interconnection — which is why EMIR pushed derivatives into clearing houses, so that the next AIG faces a CCP, not the whole street bilaterally.`
                : `La démonstration a coûté si cher que plus personne n'a jamais voulu la refaire : en un jour, le Reserve Primary Fund passe sous 1 \\$, les fonds monétaires subissent la ruée, le papier commercial se ferme pour toute l'économie ; le 29 septembre, la Chambre rejette le TARP et le S&P perd 8,8 % en séance. Trois lignes survivent : le financement court d'actifs longs est la poudre, les pertes ne sont que l'étincelle ; le levier caché (haircuts, SIV, un assureur sans réserves) compte plus que le levier affiché ; et le risque systémique loge dans l'interconnexion — c'est pourquoi EMIR a poussé les dérivés vers les chambres de compensation, pour que le prochain AIG fasse face à une CCP, pas à toute la place en bilatéral.`,
            },
          ],
          pieges: [en
            ? `"AIG was saved because it was bigger" fails the oral: the decisive variable is the POSITION IN THE NETWORK — a hub whose failure holes every counterparty at once. Size without interconnection is a big bankruptcy; interconnection without size can still be a pandemic.`
            : `« AIG a été sauvée parce qu'elle était plus grosse » échoue à l'oral : la variable décisive est la POSITION DANS LE RÉSEAU — un hub dont la chute troue toutes les contreparties à la fois. La taille sans interconnexion est une grosse faillite ; l'interconnexion sans taille peut encore être une pandémie.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 12. m11-pb-12 — Athènes, 2010-2012 : la doom loop — BOSS N4         */
/* ------------------------------------------------------------------ */
const athenesDoomLoop: ProblemeMoule = {
  id: 'm11-pb-12', moduleId: M11,
  titre: 'Athènes, 2010-2012 : l\'arithmétique de la doom loop',
  titreEn: 'Athens, 2010-2012: the arithmetic of the doom loop',
  typeDeCas: 'dette souveraine',
  typeDeCasEn: 'sovereign debt',
  difficulte: 4,
  scenarios: ['Le Trésor grec, Athènes, printemps 2010', 'La banque grecque, hiver 2011-2012 — avant le PSI', 'La mission de la troïka, Athènes'],
  scenariosEn: ['The Greek Treasury, Athens, spring 2010', 'The Greek bank, winter 2011-2012 — before the PSI', 'The troika mission, Athens'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const dette = randInt(rng, 165, 185);
    const t0 = randFloat(rng, 4.5, 5.5, 1);
    const tM = randFloat(rng, 25, 35, 1);
    const bund = randFloat(rng, 1.4, 1.8, 1);
    const prive = randInt(rng, 190, 210);
    const psi = randFloat(rng, 50, 60, 1);
    const detBanques = randInt(rng, 45, 60);
    const fpBanques = randFloat(rng, 25, 35, 1);
    const tBas = randFloat(rng, 1.5, 2.5, 1);

    const charge0 = chargeInteretsDette(dette, t0);
    const spread = spreadSouverainPb(tM, bund);
    const chargeM = chargeInteretsDette(dette, tM);
    const pertesPsi = (prive * psi) / 100;
    const perteBanques = (detBanques * psi) / 100;
    const ratioFp = (perteBanques / fpBanques) * 100;
    const chargeBas = chargeInteretsDette(dette, tBas);
    const repCharge0 = r2(charge0);
    const repSpread = r0(spread);
    const repChargeM = r1(chargeM);
    const repPsi = r1(pertesPsi);
    const repRatioFp = r0(ratioFp);
    const repChargeBas = r2(chargeBas);

    const { en, f, pct, pb } = outils(langue);
    const desc = en
      ? `in October 2009 the newly elected Greek government opens the books and revises the 2009 deficit from ~6% of GDP to 12.7% — the final figure will be 15.4%: the statistics had been false for years, and sovereign debt is lent on the faith of public numbers; debt stands around ${pct(dette, 0)} of GDP at an average rate of about ${pct(t0, 1)}; as the crisis deepens, the market pushes the Greek 10-year toward ${pct(tM, 1)} while the Bund yields ${pct(bund, 1)}; of the debt stock, about €${f(prive, 0)}bn sit in private hands, Greek banks hold about €${f(detBanques, 0)}bn of their own sovereign's paper against about €${f(fpBanques, 1)}bn of equity, and the restructuring under discussion — the "PSI" — would impose a nominal haircut of about ${pct(psi, 1)}`
      : `en octobre 2009, le gouvernement grec à peine élu ouvre les livres et révise le déficit 2009 de ~6 % du PIB à 12,7 % — le chiffre final sera 15,4 % : les statistiques étaient fausses depuis des années, et la dette souveraine se prête sur la foi de chiffres publics ; la dette est d'environ ${pct(dette, 0)} du PIB à un taux moyen d'environ ${pct(t0, 1)} ; la crise s'approfondissant, le marché pousse le 10 ans grec vers ${pct(tM, 1)} quand le Bund rend ${pct(bund, 1)} ; sur le stock de dette, environ ${f(prive, 0)} Md€ sont aux mains du privé, les banques grecques détiennent environ ${f(detBanques, 0)} Md€ du papier de leur propre souverain contre environ ${f(fpBanques, 1)} Md€ de fonds propres, et la restructuration en discussion — le « PSI » — imposerait une décote nominale d'environ ${pct(psi, 1)}`;
    const contexte = (en
      ? [
        `Spring 2010, the Greek Treasury, Athens. You prepare the financing programme, and the numbers no longer add up in any scenario your predecessors left behind. Since the October revision, the market treats every Greek statistic as a lie until proven otherwise — you recognise BNP Paribas' August 9, 2007, transposed to states: it is not the loss that triggers the panic, it is the discovery that nothing can be measured. The file: ${desc}.\n\nBuild the note that will end up on the Eurogroup's table: the interest burden as it stands; the spread the market is now writing; the arithmetic showing that refinancing at market rates is not expensive but IMPOSSIBLE — a maturity wall with no ladder; what the restructuring would take from private creditors; what it would do, through the domestic bias, to the country's own banks — the loop that gives the chapter its name; and the counterfactual rate at which the very same debt becomes carriable. In May, the first package: €110bn from the EU and IMF, under a trio soon nicknamed the troika.`,
        `Winter 2011-2012, the head office of one of the large Greek banks. You are the CFO, and the "voluntary" exchange being negotiated in Brussels has a line item with your name on it: the bank's portfolio of Greek government bonds — accumulated over years, LTRO carry included, because lending to one's own sovereign was the definition of prudence. The data: ${desc}.\n\nQuantify what is coming: the sovereign's interest burden and the spread that says default is already priced; the refinancing arithmetic that makes the restructuring inevitable; the PSI's bill for private creditors as a whole; and then the number that concerns your board — the loss on your own book against your equity. You are about to demonstrate, from the inside, the doom loop's second leg: the sovereign's default ruins the banks the sovereign will then have to rescue with money it does not have. March 2012: the largest sovereign default in history, in a developed country, inside the euro.`,
        `Athens, a troika mission (Commission, ECB, IMF). Your team reviews debt sustainability between two meetings at the finance ministry, tractors sometimes parked outside. The programme's premise — austerity restores solvency, solvency reopens markets — is dying against the numbers: ${desc}. GDP is on its way to a ~25% fall between 2008 and 2013, unemployment toward 27%, and the IMF will admit in 2013 that the fiscal multipliers were underestimated: cutting 1 of spending in a collapsing economy removes well more than 1 of activity.\n\nYour internal memo must hold the whole arithmetic: the burden at the old average rate; the spread against the Bund at the paroxysm; the market-rate burden that proves the refinancing wall is unclimbable; the PSI and its ~${pct(psi, 1)} nominal haircut on €${f(prive, 0)}bn; the transmission to the banks' equity — the loop the programme keeps tightening (the LTROs made the banks MORE loaded with their sovereign, not less); and the rate at which the same debt stock would be sustainable — the number that explains why, in the end, it took a sentence from Draghi and an unused backstop, not another austerity package, to close the spreads.`,
      ]
      : [
        `Printemps 2010, le Trésor grec, Athènes. Vous préparez le programme de financement, et les chiffres ne bouclent plus dans aucun des scénarios laissés par vos prédécesseurs. Depuis la révision d'octobre, le marché traite chaque statistique grecque comme un mensonge jusqu'à preuve du contraire — vous reconnaissez le 9 août 2007 de BNP Paribas, transposé aux États : ce n'est pas la perte qui déclenche la panique, c'est la découverte qu'on ne sait plus mesurer. Le dossier : ${desc}.\n\nConstruisez la note qui finira sur la table de l'Eurogroupe : la charge d'intérêts telle qu'elle est ; le spread que le marché écrit désormais ; l'arithmétique qui montre que se refinancer au taux de marché n'est pas cher mais IMPOSSIBLE — un mur d'échéances sans échelle ; ce que la restructuration prendrait aux créanciers privés ; ce qu'elle ferait, par le biais domestique, aux banques du pays — la boucle qui donne son nom au chapitre ; et le taux contrefactuel auquel la même dette redevient portable. En mai, le premier plan : 110 Md€ de l'UE et du FMI, sous un trio vite surnommé la troïka.`,
        `Hiver 2011-2012, le siège d'une des grandes banques grecques. Vous êtes le directeur financier, et l'échange « volontaire » qui se négocie à Bruxelles comporte une ligne à votre nom : le portefeuille d'obligations d'État grecques de la banque — accumulé pendant des années, carry du LTRO compris, parce que prêter à son propre souverain était la définition de la prudence. Les données : ${desc}.\n\nQuantifiez ce qui arrive : la charge d'intérêts du souverain et le spread qui dit que le défaut est déjà dans les prix ; l'arithmétique de refinancement qui rend la restructuration inévitable ; la facture du PSI pour l'ensemble des créanciers privés ; puis le nombre qui concerne votre conseil — la perte sur votre propre portefeuille rapportée à vos fonds propres. Vous allez démontrer, de l'intérieur, la seconde jambe de la doom loop : le défaut du souverain ruine les banques que le souverain devra ensuite sauver avec un argent qu'il n'a plus. Mars 2012 : le plus gros défaut souverain de l'histoire, dans un pays développé, dans l'euro.`,
        `Athènes, une mission de la troïka (Commission, BCE, FMI). Votre équipe revoit la soutenabilité de la dette entre deux réunions au ministère des Finances, des tracteurs parfois garés devant. La prémisse du programme — l'austérité restaure la solvabilité, la solvabilité rouvre les marchés — est en train de mourir contre les chiffres : ${desc}. Le PIB est en route vers une chute d'environ 25 % entre 2008 et 2013, le chômage vers 27 %, et le FMI reconnaîtra en 2013 que les multiplicateurs budgétaires étaient sous-estimés : couper 1 de dépense dans une économie qui s'effondre retire nettement plus que 1 d'activité.\n\nVotre mémo interne doit tenir toute l'arithmétique : la charge à l'ancien taux moyen ; le spread contre le Bund au paroxysme ; la charge au taux de marché qui prouve que le mur de refinancement est infranchissable ; le PSI et sa décote nominale d'environ ${pct(psi, 1)} sur ${f(prive, 0)} Md€ ; la transmission aux fonds propres des banques — la boucle que le programme ne cesse de resserrer (les LTRO ont rendu les banques PLUS gavées de leur souverain, pas moins) ; et le taux auquel le même stock de dette serait soutenable — le nombre qui explique pourquoi, à la fin, il a fallu une phrase de Draghi et un backstop jamais utilisé, pas un plan d'austérité de plus, pour refermer les spreads.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The interest burden, as it stands' : 'a) La charge d\'intérêts, telle qu\'elle est',
          enonce: en
            ? `Debt at ${pct(dette, 0)} of GDP, average rate ${pct(t0, 1)}. What interest burden, in % of GDP, does the state carry before the first euro of spending?`
            : `Dette à ${pct(dette, 0)} du PIB, taux moyen ${pct(t0, 1)}. Quelle charge d'intérêts, en % du PIB, l'État porte-t-il avant le premier euro de dépense ?`,
          reponse: repCharge0, tolerance: 0.1, toleranceMode: 'absolu', unite: en ? '% of GDP' : '% du PIB',
          etapes: [{
            titre: en ? 'Two numbers multiply into a destiny' : 'Deux nombres se multiplient en destin',
            contenu: en
              ? `Burden = ${f(dette, 0)} × ${f(t0, 1)} / 100 = **${pct(repCharge0, 2)} of GDP** — before a single school or hospital. The structure of the number is the whole trap: at ${pct(dette, 0)} of GDP, EVERY point of rate costs ${f(r2(dette / 100), 2)} points of GDP. The burden is the product of a stock (slow to change) and a price (which can double in a quarter): that asymmetry is why a sovereign crisis is always a RATE crisis before being a debt crisis.`
              : `Charge = ${f(dette, 0)} × ${f(t0, 1)} / 100 = **${pct(repCharge0, 2)} du PIB** — avant la première école ou le premier hôpital. La structure du nombre est tout le piège : à ${pct(dette, 0)} du PIB, CHAQUE point de taux coûte ${f(r2(dette / 100), 2)} point de PIB. La charge est le produit d'un stock (lent à changer) et d'un prix (qui peut doubler en un trimestre) : cette asymétrie est la raison pour laquelle une crise souveraine est toujours une crise de TAUX avant d'être une crise de dette.`,
          }],
        },
        {
          intitule: en ? 'b) The thermometer: the spread against the Bund' : 'b) Le thermomètre : le spread contre le Bund',
          enonce: en
            ? `The Greek 10-year trades at ${pct(tM, 1)}; the Bund yields ${pct(bund, 1)}. What is the sovereign spread, in basis points?`
            : `Le 10 ans grec traite à ${pct(tM, 1)} ; le Bund rend ${pct(bund, 1)}. Quel est le spread souverain, en points de base ?`,
          reponse: repSpread, tolerance: 15, toleranceMode: 'absolu', unite: 'pb',
          etapes: [{
            titre: en ? 'At these levels, the rate IS the anticipated default' : 'À ces niveaux, le taux EST le défaut anticipé',
            contenu: en
              ? `Spread = (${f(tM, 1)} − ${f(bund, 1)}) × 100 = **${pb(repSpread)}**. Scale it: the French OAT lives its ordinary life at 30-60 bp; Italy crossing 500 bp in autumn 2011 was a regime change; Greece above 3,000 bp in March 2012 is no longer a risk premium at all — nobody demands ${pct(tM, 1)} a year believing they will be repaid at par; the price contains the restructuring. Reading spreads as anticipated-default probabilities, not as "expensive borrowing", is what separates a rates desk from a newspaper.`
              : `Spread = (${f(tM, 1)} − ${f(bund, 1)}) × 100 = **${pb(repSpread)}**. Donnez l'échelle : l'OAT française vit sa vie ordinaire à 30-60 pb ; l'Italie franchissant 500 pb à l'automne 2011 était un changement de régime ; la Grèce au-dessus de 3 000 pb en mars 2012 n'est plus une prime de risque du tout — personne n'exige ${pct(tM, 1)} par an en croyant être remboursé au pair ; le prix contient la restructuration. Lire les spreads comme des probabilités de défaut anticipé, pas comme un « emprunt cher », est ce qui sépare un desk de taux d'un journal.`,
          }],
        },
        {
          intitule: en ? 'c) The maturity wall: refinancing is not expensive, it is impossible' : 'c) Le mur des échéances : se refinancer n\'est pas cher, c\'est impossible',
          enonce: en
            ? `Suppose the whole stock had to roll at the market rate of ${pct(tM, 1)}. What would the interest burden become, in % of GDP?`
            : `Supposez que tout le stock doive rouler au taux de marché de ${pct(tM, 1)}. Que deviendrait la charge d'intérêts, en % du PIB ?`,
          reponse: repChargeM, tolerance: 0.5, toleranceMode: 'absolu', unite: en ? '% of GDP' : '% du PIB',
          etapes: [{
            titre: en ? 'The self-fulfilling loop, closed' : 'La boucle auto-réalisatrice, refermée',
            contenu: en
              ? `Burden = ${f(dette, 0)} × ${f(tM, 1)} / 100 = **${pct(repChargeM, 1)} of GDP** — an absurdity: no state hands over ${f(repChargeM, 1)}% of national output in interest. The point of the calculation is precisely its absurdity: each maturity that falls due must be repaid in full or rolled at THIS price, so the state faces a WALL, not a cost. And the loop closes by itself: rates up → burden up → solvency down → rates up. De Grauwe's key: a state borrowing in a currency it does not issue can die of pure illiquidity, like an emerging borrower in dollars — Greece, Spain, Italy borrowed in euros whose tap was in Frankfurt; the United Kingdom, comparable debt, never saw these spreads.`
              : `Charge = ${f(dette, 0)} × ${f(tM, 1)} / 100 = **${pct(repChargeM, 1)} du PIB** — une absurdité : aucun État ne verse ${f(repChargeM, 1)} % de la production nationale en intérêts. L'intérêt du calcul est précisément son absurdité : chaque échéance qui tombe doit être remboursée en totalité ou roulée à CE prix, donc l'État fait face à un MUR, pas à un coût. Et la boucle se referme toute seule : taux ↑ → charge ↑ → solvabilité ↓ → taux ↑. La clé de De Grauwe : un État qui emprunte dans une monnaie qu'il n'émet pas peut mourir de pure illiquidité, comme un émergent endetté en dollars — la Grèce, l'Espagne, l'Italie empruntaient dans un euro dont le robinet était à Francfort ; le Royaume-Uni, dette comparable, n'a jamais vu ces spreads.`,
          }],
          pieges: [en
            ? `"They just had to stop borrowing" ignores the structure of a debt stock: old debt MATURES and must be rolled — a primary surplus does not cancel the wall of maturities falling due this year at market prices.`
            : `« Il suffisait d'arrêter d'emprunter » ignore la structure d'un stock de dette : la dette ancienne ARRIVE À ÉCHÉANCE et doit être roulée — un excédent primaire n'annule pas le mur des échéances qui tombent cette année aux prix du marché.`],
        },
        {
          intitule: en ? 'd) The PSI: the largest sovereign default in history' : 'd) Le PSI : le plus gros défaut souverain de l\'histoire',
          enonce: en
            ? `March 2012: the "voluntary" exchange imposes a nominal haircut of ${pct(psi, 1)} on the €${f(prive, 0)}bn held by private creditors. How many €bn do private creditors lose in nominal terms?`
            : `Mars 2012 : l'échange « volontaire » impose une décote nominale de ${pct(psi, 1)} sur les ${f(prive, 0)} Md€ détenus par les créanciers privés. Combien de Md€ les créanciers privés perdent-ils en nominal ?`,
          reponse: repPsi, tolerance: 1.5, toleranceMode: 'absolu', unite: 'Md€',
          etapes: [{
            titre: en ? 'The taboo falls inside the euro' : 'Le tabou tombe dans l\'euro',
            contenu: en
              ? `Nominal loss = ${f(prive, 0)} × ${f(psi, 1)}% = **€${f(repPsi, 1)}bn** — and the real bill was worse: the actual PSI cut 53.5% of nominal, but counting the new bonds' lower coupons and longer maturities, the present-value loss reached about 75%. The largest sovereign default in history did not happen in an emerging market of the 1980s: it happened in a developed country, inside the euro, with the Greek sovereign CDS duly triggered — the insurance worked. The taboo fell that day: euro-denominated sovereign debt can not be repaid.`
              : `Perte nominale = ${f(prive, 0)} × ${f(psi, 1)} % = **${f(repPsi, 1)} Md€** — et la facture réelle fut pire : le PSI effectif a coupé 53,5 % du nominal, mais en comptant les coupons plus faibles et les maturités plus longues des nouveaux titres, la perte en valeur actuelle a atteint environ 75 %. Le plus gros défaut souverain de l'histoire n'a pas eu lieu dans un émergent des années 80 : dans un pays développé, membre de la zone euro, avec les CDS souverains grecs dûment déclenchés — l'assurance a fonctionné. Le tabou est tombé ce jour-là : la dette d'un État de l'euro peut ne pas être remboursée.`,
          }],
          pieges: [en
            ? `Confusing the nominal haircut (${pct(psi, 1)}) with the present-value loss (~75%) is the classic trap: exchanging into bonds with lower coupons and longer maturities destroys value BEYOND the face-value cut — always ask "haircut on what?".`
            : `Confondre la décote nominale (${pct(psi, 1)}) et la perte en valeur actuelle (~75 %) est le piège classique : échanger contre des titres à coupons plus faibles et maturités plus longues détruit de la valeur AU-DELÀ de la coupe du nominal — toujours demander « décote sur quoi ? ».`],
        },
        {
          intitule: en ? 'e) The doom loop, quantified on the banks' : 'e) La doom loop, chiffrée sur les banques',
          enonce: en
            ? `Greek banks hold €${f(detBanques, 0)}bn of their own sovereign's bonds against €${f(fpBanques, 1)}bn of equity. Applying the ${pct(psi, 1)} haircut, what fraction of their equity is destroyed, in %?`
            : `Les banques grecques détiennent ${f(detBanques, 0)} Md€ d'obligations de leur propre souverain contre ${f(fpBanques, 1)} Md€ de fonds propres. En appliquant la décote de ${pct(psi, 1)}, quelle fraction de leurs fonds propres est détruite, en % ?`,
          reponse: repRatioFp, tolerance: 3, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Two legs, one embrace' : 'Deux jambes, une seule étreinte',
            contenu: en
              ? `Loss = ${f(detBanques, 0)} × ${f(psi, 1)}% = €${f(r1(perteBanques), 1)}bn; against €${f(fpBanques, 1)}bn of equity: **${pct(repRatioFp, 0)}** destroyed. There is the loop, drawn with two arrows: the sovereign's default guts the banks (domestic bias — holding your own state's paper was "prudence", and the LTRO carry made it worse); the gutted banks must be recapitalised by… the sovereign, whose debt grows again. Ireland walked in through the other door — rescuing its banks (~€64bn, ~40% of GDP) ruined an exemplary state. Two entrances, one room; you do not leave it by saving only one of the two. That is why the euro area built a banking union from 2014: denationalising supervision to cut the loop.`
              : `Perte = ${f(detBanques, 0)} × ${f(psi, 1)} % = ${f(r1(perteBanques), 1)} Md€ ; contre ${f(fpBanques, 1)} Md€ de fonds propres : **${pct(repRatioFp, 0)}** détruits. Voilà la boucle, dessinée avec deux flèches : le défaut du souverain éventre les banques (biais domestique — détenir le papier de son propre État était de la « prudence », et le carry du LTRO a aggravé le cas) ; les banques éventrées doivent être recapitalisées par… le souverain, dont la dette regonfle. L'Irlande est entrée par l'autre porte — sauver ses banques (~64 Md€, ~40 % du PIB) a ruiné un État jusque-là exemplaire. Deux portes d'entrée, une seule pièce ; on n'en sort pas en sauvant un seul des deux. C'est pourquoi la zone euro a construit une union bancaire à partir de 2014 : dénationaliser la supervision pour couper la boucle.`,
          }],
        },
        {
          intitule: en ? 'f) The counterfactual rate — and the sentence that ended it' : 'f) Le taux contrefactuel — et la phrase qui a tout éteint',
          enonce: en
            ? `Same debt stock, ${pct(dette, 0)} of GDP, but at an average rate of ${pct(tBas, 1)} (the post-OMT world). What does the interest burden become, in % of GDP?`
            : `Même stock de dette, ${pct(dette, 0)} du PIB, mais à un taux moyen de ${pct(tBas, 1)} (le monde post-OMT). Que devient la charge d'intérêts, en % du PIB ?`,
          reponse: repChargeBas, tolerance: 0.1, toleranceMode: 'absolu', unite: en ? '% of GDP' : '% du PIB',
          etapes: [
            {
              titre: en ? 'A debt is never sustainable in the absolute — only at a rate' : 'Une dette n\'est jamais soutenable dans l\'absolu — seulement à un taux',
              contenu: en
                ? `Burden = ${f(dette, 0)} × ${f(tBas, 1)} / 100 = **${pct(repChargeBas, 2)} of GDP** — the same stock that was unfinanceable at ${pct(tM, 1)} becomes carriable at ${pct(tBas, 1)}. Nothing about the debt changed; only the price did. That is the deepest lesson of the crisis: solvency was a FUNCTION of the rate, so whoever controls the rate controls the solvency. On July 26, 2012, Draghi says "whatever it takes"; in September the promise becomes the OMT — potentially unlimited purchases under conditionality. It is never used. Not one euro. And spreads melt by hundreds of basis points: nobody sells against a buyer without limits.`
                : `Charge = ${f(dette, 0)} × ${f(tBas, 1)} / 100 = **${pct(repChargeBas, 2)} du PIB** — le même stock infinançable à ${pct(tM, 1)} devient portable à ${pct(tBas, 1)}. Rien n'a changé dans la dette ; seul le prix a changé. C'est la leçon la plus profonde de la crise : la solvabilité était une FONCTION du taux, donc qui contrôle le taux contrôle la solvabilité. Le 26 juillet 2012, Draghi prononce « whatever it takes » ; en septembre, la promesse devient l'OMT — des achats potentiellement illimités sous conditionnalité. Il n'est jamais utilisé. Pas un euro. Et les spreads fondent de plusieurs centaines de points de base : personne ne vend contre un acheteur sans limite.`,
            },
            {
              titre: en ? 'What those three years taught the trade' : 'Ce que ces trois années ont appris au métier',
              contenu: en
                ? `Four lines to keep. Statistics are a credibility asset: the October 2009 revision cost more than years of deficits — a false number destroys the valuability of the whole signature. The doom loop is not cut by saving one of its two legs (the LTROs proved it involuntarily). Austerity in a recession can worsen the very ratio it targets — the IMF's 2013 mea culpa on multipliers, paid by a ~25% GDP fall and 27% unemployment. And against a self-fulfilling panic, the best money is the money never spent: the SMP, limited and ambiguous, was tested and overrun; the OMT, unlimited and credible, never fired a shot. Judge a backstop by its announced size and its credibility, not by its use.`
                : `Quatre lignes à garder. Les statistiques sont un actif de crédibilité : la révision d'octobre 2009 a coûté plus cher que des années de déficits — un chiffre faux détruit la valorisabilité de toute la signature. La doom loop ne se coupe pas en sauvant une seule de ses deux jambes (les LTRO l'ont prouvé involontairement). L'austérité en récession peut dégrader le ratio même qu'elle vise — le mea culpa du FMI de 2013 sur les multiplicateurs, payé par ~25 % de PIB en moins et 27 % de chômage. Et contre une panique auto-réalisatrice, le meilleur argent est celui qu'on ne dépense pas : le SMP, limité et ambigu, a été testé et débordé ; l'OMT, illimité et crédible, n'a jamais tiré un coup. Jugez un backstop à sa taille annoncée et à sa crédibilité, pas à son utilisation.`,
            },
          ],
          pieges: [en
            ? `"The ECB saved Greece with the OMT" confuses the files: Greece was restructured (PSI) and financed by programmes; the OMT's target was the CONTAGION — Spain and Italy, too big for the rescue funds, where the spread priced a redenomination risk the promise extinguished.`
            : `« La BCE a sauvé la Grèce avec l'OMT » confond les dossiers : la Grèce a été restructurée (PSI) et financée par des programmes ; la cible de l'OMT était la CONTAGION — l'Espagne et l'Italie, trop grosses pour les fonds de secours, où le spread priçait un risque de redénomination que la promesse a éteint.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 13. m11-pb-13 — Londres, 28 septembre 2022 : gilts/LDI — BOSS N4    */
/* ------------------------------------------------------------------ */
const giltsSpiraleTours: ProblemeMoule = {
  id: 'm11-pb-13', moduleId: M11,
  titre: 'Londres, 28 septembre 2022 : la spirale des gilts, tour par tour',
  titreEn: 'London, September 28, 2022: the gilt spiral, loop by loop',
  typeDeCas: 'spirale de ventes forcées',
  typeDeCasEn: 'forced-sales spiral',
  difficulte: 4,
  scenarios: ['Le gérant du fonds LDI, lundi 26 septembre', 'La cellule de stabilité financière de la BoE, mercredi 28 au matin', 'Le directeur financier du fonds de pension client'],
  scenariosEn: ['The LDI fund manager, Monday September 26', 'The BoE financial-stability unit, Wednesday 28, morning', 'The pension fund client\'s finance director'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const choc = randInt(rng, 100, 150);
    const notionnel = randFloat(rng, 5, 8, 1);
    const cash = randFloat(rng, 0.3, 0.6, 1);
    const decote = randFloat(rng, 2, 4, 1);
    const nFonds = randInt(rng, 8, 12);
    const impactPb = randFloat(rng, 1.5, 2.5, 1);
    const passif = randInt(rng, 10, 15);
    const dur = 20;
    const capaciteBoE = 65;

    const mv = variationPrixObligationDuration(dur, choc);
    const appel1 = (Math.abs(mv) / 100) * notionnel;
    const trou = appel1 - cash;
    const aVendre = venteForceePourCash(trou, decote);
    const ventesSecteur = nFonds * aVendre;
    const pbTour2 = ventesSecteur * impactPb;
    const mv2 = variationPrixObligationDuration(dur, pbTour2);
    const appel2 = (Math.abs(mv2) / 100) * notionnel;
    const multiple = capaciteBoE / ventesSecteur;
    const gainPassif = (Math.abs(mv) / 100) * passif;
    const netClient = gainPassif - appel1;
    const repMv = r1(mv);
    const repAppel1 = r2(appel1);
    const repVendre = r2(aVendre);
    const repAppel2 = r2(appel2);
    const repMultiple = r1(multiple);
    const repNet = r2(netClient);

    const { en, f, pct, pb } = outils(langue);
    const desc = en
      ? `on Friday September 23, 2022, the Truss government — in office for three weeks — unveils a "mini-budget": about £45bn of unfunded tax cuts, no independent costing, in a country where inflation exceeds 10%; the 30-year gilt jumps about ${pb(choc)} in three sessions (chapter reference: +130 bp) — on a modified duration of about 20; your LDI fund replicates pension liabilities with LEVERAGED gilts (swaps, repo): a hedging notionnel of £${f(notionnel, 1)}bn margined daily in cash, of which £${f(cash, 1)}bn is readily available; in a falling market, forced gilt sales execute at a discount of about ${pct(decote, 1)}, and each £1bn the SECTOR dumps pushes the 30-year up by about ${f(impactPb, 1)} bp; about ${f(nFonds, 0)} funds of your size carry the same programme, the same duration, the same margin call, the same week; your client, the pension fund, carries £${f(passif, 0)}bn of long-dated liabilities (duration ~20)`
      : `le vendredi 23 septembre 2022, le gouvernement Truss — en poste depuis trois semaines — présente un « mini-budget » : environ 45 Md£ de baisses d'impôts non financées, sans chiffrage indépendant, dans un pays où l'inflation dépasse 10 % ; le gilt 30 ans saute d'environ ${pb(choc)} en trois séances (référence du chapitre : +130 pb) — sur une duration modifiée d'environ 20 ; votre fonds LDI réplique les engagements de retraite avec des gilts LEVIÉRISÉS (swaps, repo) : un notionnel de couverture de ${f(notionnel, 1)} Md£ margé chaque jour en cash, dont ${f(cash, 1)} Md£ immédiatement disponibles ; dans un marché qui baisse, les ventes forcées de gilts s'exécutent sous une décote d'environ ${pct(decote, 1)}, et chaque milliard de livres que le SECTEUR déverse pousse le 30 ans d'environ ${f(impactPb, 1)} pb ; environ ${f(nFonds, 0)} fonds de votre taille portent le même programme, la même duration, le même appel, la même semaine ; votre client, le fonds de pension, porte ${f(passif, 0)} Md£ d'engagements de long terme (duration ~20)`;
    const contexte = (en
      ? [
        `Monday, September 26, 2022, 7:15 a.m., Canary Wharf. You manage the LDI fund, and the weekend has resolved nothing: the collateral engine you built — quiet for a decade — is about to run backwards. The file: ${desc}.\n\nThe chapter calls this episode the purest forced-sales spiral ever observed, and today you get to compute it leg by leg: the mark-to-market of the shock on duration 20; the margin call on the leveraged notional; the gilt sales the cash gap forces; then the second loop — YOUR sales plus everyone's sales revalue the market against you and generate the NEXT call. Finally the two numbers of the ending: how big a buyer must stand in the market to break the loop, and the paradox to explain to your client — who is getting richer while you are going under.`,
        `Wednesday, September 28, 2022, 8 a.m., Threadneedle Street. The Financial Policy Committee meets in continuous session. The 30-year is in free fall for a fifth session; the LDI funds' calls all say the same thing: no eligible collateral left by Friday. The Bank was to start SELLING gilts next week under QT — the room is discussing the exact opposite. The representative file on the table: ${desc}.\n\nBefore the governor signs, the unit must see the machine turn: shock → mark-to-market → margin call → forced sales → revaluation → next call. Then it must size the answer — how big the announced buyer must be against the sector's forced flow, and why an EXPLICITLY temporary window (thirteen business days, until October 14) both kills the spiral and protects the tightening's credibility. The intervention will use about £19bn of a £65bn capacity. The spiral will die in hours. The prime minister will resign after 44 days.`,
        `Tuesday, September 27, 2022, evening. You are the finance director of the pension fund — the CLIENT of the LDI programme — and today's board call made no sense to anyone: the fund's economic position has IMPROVED since Friday, and the LDI manager is demanding cash by tomorrow under threat of unwinding your hedge at the worst prices in a decade. The data: ${desc}.\n\nWork through what your board could not: the duration arithmetic of the shock; the margin call on the leveraged hedge; the forced sales and the spiral's second loop that the whole sector is feeding; the size of buyer it takes to stop it; and the total irony — the same rate rise deflates the present value of your £${f(passif, 0)}bn of liabilities by MORE than everything the hedge is losing. Solvent, richer, and nearly dead by Friday: chapter 1's liquidity/solvency distinction, if you only ever keep one example, is this one.`,
      ]
      : [
        `Lundi 26 septembre 2022, 7 h 15, Canary Wharf. Vous gérez le fonds LDI, et le week-end n'a rien résolu : la machine à collatéral que vous avez construite — silencieuse pendant une décennie — s'apprête à tourner à l'envers. Le dossier : ${desc}.\n\nLe chapitre appelle cet épisode la spirale de ventes forcées la plus pure jamais observée, et aujourd'hui vous allez la calculer jambe par jambe : le mark-to-market du choc sur duration 20 ; l'appel de marge sur le notionnel leviérisé ; les ventes de gilts que le trou de cash force ; puis le deuxième tour — VOS ventes plus celles de tous les autres re-valorisent le marché contre vous et engendrent l'appel SUIVANT. Enfin les deux nombres du dénouement : quelle taille d'acheteur il faut dans le marché pour casser la boucle, et le paradoxe à expliquer à votre client — qui s'enrichit pendant que vous coulez.`,
        `Mercredi 28 septembre 2022, 8 h, Threadneedle Street. Le comité de politique financière siège en continu. Le 30 ans est en chute libre pour une cinquième séance ; les appels des fonds LDI disent tous la même chose : plus de collatéral éligible d'ici vendredi. La Banque devait commencer à VENDRE des gilts la semaine prochaine au titre du QT — la salle discute de l'exact inverse. Le dossier représentatif sur la table : ${desc}.\n\nAvant que le gouverneur signe, la cellule doit voir la machine tourner : choc → mark-to-market → appel de marge → ventes forcées → re-valorisation → appel suivant. Puis dimensionner la réponse — quelle taille l'acheteur annoncé doit avoir face au flux forcé du secteur, et pourquoi une fenêtre EXPLICITEMENT temporaire (treize jours ouvrés, jusqu'au 14 octobre) tue la spirale ET protège la crédibilité du resserrement. L'intervention utilisera environ 19 Md£ d'une capacité de 65 Md£. La spirale mourra en quelques heures. La Première ministre démissionnera après 44 jours.`,
        `Mardi 27 septembre 2022, au soir. Vous êtes le directeur financier du fonds de pension — le CLIENT du programme LDI — et le conseil d'aujourd'hui n'a eu de sens pour personne : la position économique du fonds s'est AMÉLIORÉE depuis vendredi, et le gérant LDI exige du cash pour demain sous menace de déboucler votre couverture aux pires prix de la décennie. Les données : ${desc}.\n\nFaites le travail que votre conseil n'a pas pu faire : l'arithmétique de duration du choc ; l'appel de marge sur la couverture leviérisée ; les ventes forcées et le deuxième tour de spirale que tout le secteur alimente ; la taille d'acheteur qu'il faut pour l'arrêter ; et l'ironie totale — la même hausse de taux dégonfle la valeur actuelle de vos ${f(passif, 0)} Md£ d'engagements de PLUS que tout ce que la couverture perd. Solvable, enrichi, et presque mort vendredi : la distinction liquidité/solvabilité du chapitre 1, si vous ne gardez qu'un exemple, c'est celui-là.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The shock through duration 20' : 'a) Le choc à travers la duration 20',
          enonce: en
            ? `The 30-year gilt takes ${pb(choc)} in three sessions, on a modified duration of 20. What price change does the duration approximation give, in %?`
            : `Le gilt 30 ans prend ${pb(choc)} en trois séances, sur une duration modifiée de 20. Quelle variation de prix l'approximation par la duration donne-t-elle, en % ?`,
          reponse: repMv, tolerance: Math.max(0.5, Math.abs(repMv) * 0.03), toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'A quarter of the safest asset in the kingdom' : 'Un quart de l\'actif le plus sûr du royaume',
            contenu: en
              ? `ΔP/P ≈ −20 × ${f(r2(choc / 100), 2)} = **${pct(repMv, 1)}** — on the longest, most rate-sensitive point of the gilt curve, in three sessions, triggered not by a central bank but by a BUDGET: £45bn of unfunded cuts under 10%+ inflation. Duration is a lever: pension money lives at the long end by construction (liabilities decades away), which is why the accident happened in precisely this corner. The number matches the chapter: +130 bp on duration 20 ≈ −26%.`
              : `ΔP/P ≈ −20 × ${f(r2(choc / 100), 2)} = **${pct(repMv, 1)}** — sur le point le plus long, le plus sensible aux taux de la courbe des gilts, en trois séances, déclenché non par une banque centrale mais par un BUDGET : 45 Md£ de baisses non financées sous plus de 10 % d'inflation. La duration est un levier : l'argent des retraites vit sur la partie longue par construction (des engagements à des décennies), et c'est pourquoi l'accident est arrivé précisément dans ce coin-là. Le nombre colle au chapitre : +130 pb sur duration 20 ≈ −26 %.`,
          }],
        },
        {
          intitule: en ? 'b) The margin call on the leveraged hedge' : 'b) L\'appel de marge sur la couverture leviérisée',
          enonce: en
            ? `The LDI programme's leveraged notional is £${f(notionnel, 1)}bn, margined daily in cash and marked like the gilt. What margin call, in £bn, do the three sessions generate?`
            : `Le notionnel leviérisé du programme LDI est de ${f(notionnel, 1)} Md£, margé chaque jour en cash et valorisé comme le gilt. Quel appel de marge, en Md£, les trois séances génèrent-elles ?`,
          reponse: repAppel1, tolerance: Math.max(0.05, repAppel1 * 0.03), toleranceMode: 'absolu', unite: 'Md£',
          etapes: [{
            titre: en ? 'The hedge is right, and it wants cash tonight' : 'La couverture a raison, et elle veut du cash ce soir',
            contenu: en
              ? `Call = ${pct(r1(Math.abs(mv)), 1)} × ${f(notionnel, 1)} = **£${f(repAppel1, 2)}bn** of cash collateral, within days (module 7's margin mechanics, arriving for the "safe" side of the balance sheet). The hedge is doing its economic job — it mirrors liabilities that are falling in value — but a swap is marked and margined DAILY: economically right, cash-flow brutal. The fund insured its solvency and mortgaged its liquidity.`
              : `Appel = ${pct(r1(Math.abs(mv)), 1)} × ${f(notionnel, 1)} = **${f(repAppel1, 2)} Md£** de collatéral cash, en quelques jours (la mécanique de marge du module 7, qui arrive pour le côté « sûr » du bilan). La couverture fait son travail économique — elle réplique des engagements dont la valeur baisse — mais un swap est valorisé et margé CHAQUE JOUR : économiquement juste, brutale en trésorerie. Le fonds a assuré sa solvabilité et hypothéqué sa liquidité.`,
          }],
        },
        {
          intitule: en ? 'c) Loop one: the forced sale' : 'c) Tour un : la vente forcée',
          enonce: en
            ? `Against the £${f(repAppel1, 2)}bn call, the fund holds £${f(cash, 1)}bn of ready cash. To raise the difference by selling gilts under a ${pct(decote, 1)} discount, what pre-discount value, in £bn, must it sell?`
            : `Face à l'appel de ${f(repAppel1, 2)} Md£, le fonds détient ${f(cash, 1)} Md£ de cash disponible. Pour lever la différence en vendant des gilts sous ${pct(decote, 1)} de décote, quelle valeur pré-décote, en Md£, doit-il vendre ?`,
          reponse: repVendre, tolerance: Math.max(0.05, repVendre * 0.03), toleranceMode: 'absolu', unite: 'Md£',
          etapes: [{
            titre: en ? 'Selling the very asset whose fall caused the call' : 'Vendre l\'actif même dont la chute a causé l\'appel',
            contenu: en
              ? `To sell = (${f(repAppel1, 2)} − ${f(cash, 1)}) / (1 − ${f(decote, 1)}%) = **£${f(repVendre, 2)}bn** — and the only asset liquid enough to sell in size, in days, is… gilts. The loop's geometry is now visible: the collateral demanded because gilts fell can only be raised by selling gilts, which makes gilts fall. No panic, no error, no fraud anywhere in the chain — every actor executes its contract, and the sum of the contracts is a machine for self-amplification.`
              : `À vendre = (${f(repAppel1, 2)} − ${f(cash, 1)}) / (1 − ${f(decote, 1)} %) = **${f(repVendre, 2)} Md£** — et le seul actif assez liquide pour être vendu en taille, en jours, ce sont… des gilts. La géométrie de la boucle est désormais visible : le collatéral exigé parce que les gilts ont baissé ne peut être levé qu'en vendant des gilts, ce qui fait baisser les gilts. Aucune panique, aucune erreur, aucune fraude nulle part dans la chaîne — chaque acteur exécute son contrat, et la somme des contrats est une machine à auto-amplification.`,
          }],
        },
        {
          intitule: en ? 'd) Loop two: the revaluation calls again' : 'd) Tour deux : la re-valorisation rappelle',
          enonce: en
            ? `The ~${f(nFonds, 0)} funds of your size each sell as much as you (loop one), and each £1bn dumped adds about ${f(impactPb, 1)} bp to the 30-year. What NEW margin call, in £bn, does the sector's selling generate on your £${f(notionnel, 1)}bn notional?`
            : `Les ~${f(nFonds, 0)} fonds de votre taille vendent chacun autant que vous (tour un), et chaque milliard déversé ajoute environ ${f(impactPb, 1)} pb au 30 ans. Quel NOUVEL appel de marge, en Md£, les ventes du secteur génèrent-elles sur votre notionnel de ${f(notionnel, 1)} Md£ ?`,
          reponse: repAppel2, tolerance: Math.max(0.03, repAppel2 * 0.05), toleranceMode: 'absolu', unite: 'Md£',
          etapes: [{
            titre: en ? 'The loop turns by itself' : 'La boucle tourne toute seule',
            contenu: en
              ? `Sector sales = ${f(nFonds, 0)} × ${f(repVendre, 2)} = £${f(r1(ventesSecteur), 1)}bn; induced move = ${f(r1(ventesSecteur), 1)} × ${f(impactPb, 1)} ≈ ${pb(r0(pbTour2))}; mark-to-market = −20 × ${f(r2(pbTour2 / 100), 2)} = ${pct(r1(mv2), 1)}; new call = **£${f(repAppel2, 2)}bn**. Rates up → calls → sales → rates up: the loop is closed and needs nobody's opinion to keep turning. And loop two understates the reality: as liquidity dries, the discount and the price impact both GROW with each turn — the spiral does not fade politely, it accelerates until someone outside the loop steps in.`
              : `Ventes du secteur = ${f(nFonds, 0)} × ${f(repVendre, 2)} = ${f(r1(ventesSecteur), 1)} Md£ ; mouvement induit = ${f(r1(ventesSecteur), 1)} × ${f(impactPb, 1)} ≈ ${pb(r0(pbTour2))} ; mark-to-market = −20 × ${f(r2(pbTour2 / 100), 2)} = ${pct(r1(mv2), 1)} ; nouvel appel = **${f(repAppel2, 2)} Md£**. Taux ↑ → appels → ventes → taux ↑ : la boucle est fermée et n'a besoin de l'avis de personne pour continuer à tourner. Et le tour deux sous-estime la réalité : à mesure que la liquidité s'assèche, la décote et l'impact-prix GRANDISSENT à chaque tour — la spirale ne s'éteint pas poliment, elle accélère jusqu'à ce que quelqu'un d'extérieur à la boucle s'interpose.`,
          }],
          pieges: [en
            ? `Computing loop two on your own sales alone misses the fallacy of composition: your £${f(repVendre, 2)}bn barely moves the market — the SECTOR's £${f(r1(ventesSecteur), 1)}bn does. Your risk includes everyone who carries the same hedge.`
            : `Calculer le tour deux sur vos seules ventes manque le sophisme de composition : vos ${f(repVendre, 2)} Md£ bougent à peine le marché — les ${f(r1(ventesSecteur), 1)} Md£ du SECTEUR, si. Votre risque inclut tous ceux qui portent la même couverture.`],
        },
        {
          intitule: en ? 'e) The buyer it takes to break the loop' : 'e) L\'acheteur qu\'il faut pour casser la boucle',
          enonce: en
            ? `On September 28, the BoE announces a capacity of up to £5bn a day for 13 business days — £${f(capaciteBoE, 0)}bn. What multiple of the sector's forced flow (loop one) does that capacity represent?`
            : `Le 28 septembre, la BoE annonce une capacité d'achat allant jusqu'à 5 Md£ par jour pendant 13 jours ouvrés — ${f(capaciteBoE, 0)} Md£. Quel multiple du flux forcé du secteur (tour un) cette capacité représente-t-elle ?`,
          reponse: repMultiple, tolerance: Math.max(0.2, repMultiple * 0.05), toleranceMode: 'absolu', unite: '×',
          etapes: [{
            titre: en ? 'Crush the discount, and the loop starves' : 'Écrasez la décote, et la boucle meurt de faim',
            contenu: en
              ? `Multiple = ${f(capaciteBoE, 0)} / ${f(r1(ventesSecteur), 1)} = **${f(repMultiple, 1)}×** the forced flow. That is the whole design: the announced buyer dwarfs anything the spiral can throw at the market, so the liquidation discount collapses — and without a discount, loop two never happens (the LeverageSpiralSim's message: the buyer of last resort does not need to buy everything, only to crush the discount that feeds the loop). In the event, about £19bn of the £65bn were used, and the spiral died in HOURS — the OMT logic from the sovereign chapter, replayed on the gilt market: nobody sells against a credible unlimited buyer. And note the design's other half: EXPLICITLY temporary, thirteen business days, hard stop — so that buying gilts in an inflation crisis does not become financing the budget that caused it. Firefighter and arsonist at once, the conflict assumed and time-boxed.`
              : `Multiple = ${f(capaciteBoE, 0)} / ${f(r1(ventesSecteur), 1)} = **${f(repMultiple, 1)}×** le flux forcé. C'est tout le dispositif : l'acheteur annoncé écrase tout ce que la spirale peut déverser sur le marché, donc la décote de liquidation s'effondre — et sans décote, le tour deux n'a jamais lieu (le message du LeverageSpiralSim : l'acheteur en dernier ressort n'a pas besoin de tout acheter, il lui suffit d'écraser la décote qui alimente la boucle). Dans les faits, environ 19 Md£ des 65 ont servi, et la spirale est morte en QUELQUES HEURES — la logique OMT du chapitre souverain, rejouée sur le marché des gilts : personne ne vend contre un acheteur crédible sans limite. Et notez l'autre moitié du dispositif : EXPLICITEMENT temporaire, treize jours ouvrés, arrêt ferme — pour qu'acheter des gilts en pleine crise d'inflation ne devienne pas financer le budget qui l'a causée. Pompier et pyromane à la fois, le conflit assumé et borné dans le temps.`,
          }],
        },
        {
          intitule: en ? 'f) The total irony: your client got richer' : 'f) L\'ironie totale : votre client s\'est enrichi',
          enonce: en
            ? `The same ${pb(choc)} deflate the present value of the client's £${f(passif, 0)}bn of liabilities (duration ~20) while the hedge calls £${f(repAppel1, 2)}bn. By how much, in £bn, does the pension fund's net economic position IMPROVE?`
            : `Les mêmes ${pb(choc)} dégonflent la valeur actuelle des ${f(passif, 0)} Md£ d'engagements du client (duration ~20) quand la couverture appelle ${f(repAppel1, 2)} Md£. De combien, en Md£, la position économique nette du fonds de pension s'AMÉLIORE-t-elle ?`,
          reponse: repNet, tolerance: Math.max(0.05, repNet * 0.05), toleranceMode: 'absolu', unite: 'Md£',
          etapes: [
            {
              titre: en ? 'Solvent, illiquid, nearly dead' : 'Solvable, illiquide, presque mort',
              contenu: en
                ? `Liabilities deflate by ${pct(r1(Math.abs(mv)), 1)} × ${f(passif, 0)} = £${f(r2(gainPassif), 2)}bn; the hedge loses £${f(repAppel1, 2)}bn; net improvement = **£${f(repNet, 2)}bn**. The rate rise makes the pension fund RICHER — a pension promise is a debt discounted at the long rate, and the promise just got cheaper. Institutions ENRICHED by the shock nearly died of not being able to post Tuesday's margin: the gain lives in a discounted liability nobody pays out today, the loss is a cash call due tomorrow morning. Solvency and liquidity run on different clocks — if you keep one example of chapter 1's royal distinction, keep this one.`
                : `Le passif se dégonfle de ${pct(r1(Math.abs(mv)), 1)} × ${f(passif, 0)} = ${f(r2(gainPassif), 2)} Md£ ; la couverture perd ${f(repAppel1, 2)} Md£ ; amélioration nette = **${f(repNet, 2)} Md£**. La hausse des taux enrichit le fonds de pension — un engagement de retraite est une dette actualisée au taux long, et la promesse vient de devenir moins chère. Des institutions ENRICHIES par le choc ont failli mourir de ne pas pouvoir poster la marge du mardi : le gain loge dans un passif actualisé que personne ne décaisse aujourd'hui, la perte est un appel de cash exigible demain matin. Solvabilité et liquidité n'ont pas la même horloge — si vous ne gardez qu'un exemple de la distinction reine du chapitre 1, gardez celui-là.`,
            },
            {
              titre: en ? 'What those thirteen days taught the trade' : 'Ce que ces treize jours ont appris au métier',
              contenu: en
                ? `Three lines. Rate risk is MEASURED by duration and MATERIALISES through liquidity: the hedge was economically right and operationally lethal. A spiral feeds on the discount, so the cure is a credible buyer, not a big buyer — £19bn used, out of £65bn announced, against a market of trillions. And a central bank can be forced to fight fire in the middle of its own tightening: financial stability and monetary policy can contradict each other on a Tuesday morning — the time-boxed design is how you keep both credible. Truss resigned after 44 days; the mechanics stayed on every risk desk's wall.`
                : `Trois lignes. Le risque de taux se MESURE par la duration et se MATÉRIALISE par la liquidité : la couverture était économiquement juste et opérationnellement mortelle. Une spirale se nourrit de la décote, donc le remède est un acheteur crédible, pas un gros acheteur — 19 Md£ utilisés, sur 65 annoncés, face à un marché de milliers de milliards. Et une banque centrale peut être forcée d'éteindre un incendie au milieu de son propre resserrement : stabilité financière et politique monétaire peuvent se contredire un mardi matin — le dispositif borné dans le temps est ce qui garde les deux crédibles. Truss a démissionné après 44 jours ; la mécanique est restée au mur de tous les desks de risque.`,
            },
          ],
          pieges: [en
            ? `"The LDI funds were insolvent and had to be rescued" inverts the balance sheet: higher yields IMPROVED the funds' economic solvency (liabilities deflate more than assets). The BoE rescued a MARKET from a liquidity loop, not funds from insolvency — the nuance is the whole episode.`
            : `« Les fonds LDI étaient insolvables et ont dû être sauvés » inverse le bilan : la hausse des taux AMÉLIORAIT la solvabilité économique des fonds (le passif se dégonfle plus que l'actif). La BoE a sauvé un MARCHÉ d'une boucle de liquidité, pas des fonds d'une insolvabilité — la nuance est tout l'épisode.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 14. m11-pb-14 — Santa Clara, 8-10 mars 2023 : SVB — BOSS N4         */
/* ------------------------------------------------------------------ */
const svbSantaClara: ProblemeMoule = {
  id: 'm11-pb-14', moduleId: M11,
  titre: 'Santa Clara, 8-10 mars 2023 : la banque morte en silence',
  titreEn: 'Santa Clara, March 8-10, 2023: the bank that died in silence',
  typeDeCas: 'run à la vitesse du smartphone',
  typeDeCasEn: 'smartphone-speed bank run',
  difficulte: 4,
  scenarios: ['Le CFO de SVB, mercredi 8 mars au soir', 'Le trésorier de startup, jeudi 9 mars, dans les group chats', 'La FDIC, vendredi 10 mars à l\'aube'],
  scenariosEn: ['SVB\'s CFO, Wednesday evening, March 8', 'The startup treasurer, Thursday March 9, in the group chats', 'The FDIC, Friday March 10 at dawn'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    const depots = randInt(rng, 180, 195);
    const titres = randInt(rng, 135, 145);
    const dur = randFloat(rng, 5.5, 5.9, 1);
    const deltaPb = randInt(rng, 190, 210);
    const fp = randFloat(rng, 15, 17, 1);
    const decoteVente = randFloat(rng, 8, 9.5, 1);
    const retraits = randInt(rng, 40, 44);
    const liquides = randInt(rng, 10, 15);
    const decoteRun = randFloat(rng, 4, 6, 1);
    const vente8Mars = 21;

    const mvPct = variationPrixObligationDuration(dur, deltaPb);
    const mvMd = (Math.abs(mvPct) / 100) * titres;
    const perteVente = (vente8Mars * decoteVente) / 100;
    const couverture = tauxCouvertureDepots(liquides, depots);
    const manque = retraits - liquides;
    const aVendre = venteForceePourCash(manque, decoteRun);
    const perteRun = (aVendre * decoteRun) / 100;
    const btfp = mvMd;
    const repMv = r1(mvMd);
    const repVente = r2(perteVente);
    const repCouv = r1(couverture);
    const repVendre = r1(aVendre);
    const repBtfp = r1(btfp);

    const { en, f, pct, pb } = outils(langue);
    const desc = en
      ? `between 2019 and 2021, venture-capital money more than triples Silicon Valley Bank's deposits, toward \\$${f(depots, 0)}bn — one industry, one valley, more than 90% of balances above the \\$250,000 insurance cap; the startups deposit rather than borrow, so the bank parks about \\$${f(titres, 0)}bn in LONG Treasuries and MBS (average modified duration ${f(dur, 1)}), bought at the very top of the bond market and classified held-to-maturity — at cost, invisible to the income statement; in 2022 the Fed hikes +425 bp, of which about ${pb(deltaPb)} hit the portfolio's relevant maturities; equity stands near \\$${f(fp, 1)}bn, same-day liquid assets near \\$${f(liquides, 0)}bn; on March 8 the bank sells \\$21bn of securities at about ${pct(decoteVente, 1)} below cost and announces a capital raise; on March 9 the depositors request \\$${f(retraits, 0)}bn in ONE day, and any further forced sales execute about ${pct(decoteRun, 1)} below carrying value`
      : `entre 2019 et 2021, l'argent du capital-risque fait plus que tripler les dépôts de Silicon Valley Bank, vers ${f(depots, 0)} Md\\$ — une industrie, une vallée, plus de 90 % des soldes au-dessus du plafond de garantie de 250 000 \\$ ; les startups déposent au lieu d'emprunter, la banque gare donc environ ${f(titres, 0)} Md\\$ en Treasuries et MBS LONGS (duration modifiée moyenne ${f(dur, 1)}), achetés au sommet exact du marché obligataire et classés held-to-maturity — au coût, invisibles au compte de résultat ; en 2022, la Fed monte de +425 pb, dont environ ${pb(deltaPb)} touchent les maturités pertinentes du portefeuille ; les fonds propres sont proches de ${f(fp, 1)} Md\\$, les actifs liquides du jour d'environ ${f(liquides, 0)} Md\\$ ; le 8 mars, la banque vend 21 Md\\$ de titres environ ${pct(decoteVente, 1)} sous leur coût et annonce une augmentation de capital ; le 9 mars, les déposants demandent ${f(retraits, 0)} Md\\$ en UNE journée, et toute vente forcée supplémentaire s'exécute environ ${pct(decoteRun, 1)} sous la valeur comptable`;
    const contexte = (en
      ? [
        `Wednesday, March 8, 2023, 6 p.m., Santa Clara. You are SVB's CFO and you have just pressed the button you spent months avoiding: the sale of \\$21bn of securities is announced, the loss is public, the capital raise is filed. Your phone starts vibrating and does not stop. The balance sheet you are defending: ${desc}.\n\nTonight, reconstruct the file the way the market is reading it right now: the latent loss the HTM accounting hid in plain sight, against the equity — the bank died in silence at the end of 2022, today's announcement only turned the lights on; the loss the sale just crystallised; the coverage arithmetic that says NO bank survives what Twitter is about to organise; the forced sales that serving the run would require; and the only design that could stop it — the one the Fed will announce on Sunday night. Tomorrow, \\$${f(retraits, 0)}bn will ask to leave. Friday morning, the FDIC will be in the lobby.`,
        `Thursday, March 9, 2023, 11 a.m., a startup office in Palo Alto. You are the treasurer; the company's \\$40m of payroll money sits at SVB, and the board group chat has one message repeated in six forms: GET OUT. The venture funds are telling their portfolio companies to pull everything, now, from the phone in your hand. What you can read in the public filings: ${desc}.\n\nBefore you press the button too, do the arithmetic that the chat is skipping — not because the conclusion changes (above the insurance cap, running first is individually rational), but because the mechanism is your profession: the latent hole against equity that made the bank a loaded spring; the realised loss that armed it; the coverage ratio that guarantees the run kills; the fire sale the withdrawals force; and the pair-value lending trick that will, three days too late for SVB, make running pointless at every other bank. You will press the button. So will everyone. \\$${f(retraits, 0)}bn in one day, without a single queue.`,
        `Friday, March 10, 2023, 5 a.m., Washington. The FDIC's resolution team has worked through the night: the California regulator will close Silicon Valley Bank before the market opens — the second-largest bank failure in American history, 48 hours after a routine securities-sale announcement. Your file: ${desc}.\n\nBy Sunday you must put numbers on two decisions: closing this bank (walk the chain — latent loss vs equity, the crystallising sale, the coverage arithmetic against a one-day, smartphone-speed run, the fire sale that serving it would have required), and stopping the contagion already jumping to Signature and First Republic. The answer announced Sunday night has two legs: every SVB deposit guaranteed, above the cap, under the systemic risk exception — and the BTFP, a Fed facility that lends AT PAR against collateral trading below par. Compute what that par does, and say what Bagehot would sign — and what he would not.`,
      ]
      : [
        `Mercredi 8 mars 2023, 18 h, Santa Clara. Vous êtes le CFO de SVB et vous venez d'appuyer sur le bouton que vous évitiez depuis des mois : la vente de 21 Md\\$ de titres est annoncée, la perte est publique, l'augmentation de capital est déposée. Votre téléphone se met à vibrer et ne s'arrête plus. Le bilan que vous défendez : ${desc}.\n\nCe soir, reconstituez le dossier tel que le marché est en train de le lire : la perte latente que la comptabilité HTM cachait en pleine lumière, rapportée aux fonds propres — la banque est morte en silence fin 2022, l'annonce d'aujourd'hui n'a fait qu'allumer la lumière ; la perte que la vente vient de cristalliser ; l'arithmétique de couverture qui dit qu'AUCUNE banque ne survit à ce que Twitter s'apprête à organiser ; les ventes forcées qu'exigerait de servir la ruée ; et le seul dispositif qui pouvait l'arrêter — celui que la Fed annoncera dimanche soir. Demain, ${f(retraits, 0)} Md\\$ demanderont à partir. Vendredi matin, la FDIC sera dans le hall.`,
        `Jeudi 9 mars 2023, 11 h, un bureau de startup à Palo Alto. Vous êtes le trésorier ; les 40 M\\$ de paie de l'entreprise dorment chez SVB, et le group chat du conseil répète un seul message sous six formes : SORTEZ. Les fonds de capital-risque disent à leurs participations de tout retirer, maintenant, depuis le téléphone que vous tenez. Ce que les documents publics vous laissent lire : ${desc}.\n\nAvant d'appuyer vous aussi sur le bouton, faites l'arithmétique que le chat saute — non que la conclusion change (au-dessus du plafond de garantie, courir en premier est individuellement rationnel), mais parce que le mécanisme est votre métier : le trou latent contre les fonds propres qui faisait de la banque un ressort armé ; la perte réalisée qui l'a détendu ; le taux de couverture qui garantit que la ruée tue ; la braderie que les retraits forcent ; et l'astuce du prêt au pair qui rendra la fuite inutile dans toutes les autres banques — trois jours trop tard pour SVB. Vous appuierez sur le bouton. Tout le monde le fera. ${f(retraits, 0)} Md\\$ en un jour, sans une seule file.`,
        `Vendredi 10 mars 2023, 5 h, Washington. L'équipe de résolution de la FDIC a travaillé toute la nuit : le régulateur californien fermera Silicon Valley Bank avant l'ouverture — la deuxième plus grosse faillite bancaire de l'histoire américaine, 48 heures après l'annonce d'une vente de titres de routine. Votre dossier : ${desc}.\n\nD'ici dimanche, vous devez mettre des chiffres sur deux décisions : fermer cette banque (déroulez la chaîne — perte latente contre fonds propres, la vente qui cristallise, l'arithmétique de couverture face à une ruée d'un jour à la vitesse du smartphone, la braderie qu'il aurait fallu pour la servir), et arrêter la contagion qui saute déjà vers Signature et First Republic. La réponse annoncée dimanche soir a deux jambes : tous les dépôts de SVB garantis, au-delà du plafond, au titre de la systemic risk exception — et le BTFP, une facilité de la Fed qui prête AU PAIR contre du collatéral qui cote sous le pair. Calculez ce que ce pair change, et dites ce que Bagehot signerait — et ce qu'il ne signerait pas.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) Dead in silence: the latent loss vs equity' : 'a) Morte en silence : la perte latente contre les fonds propres',
          enonce: en
            ? `About ${pb(deltaPb)} hit a \\$${f(titres, 0)}bn portfolio of modified duration ${f(dur, 1)}. Using −D×Δy, how many \\$bn of latent losses does that create?`
            : `Environ ${pb(deltaPb)} frappent un portefeuille de ${f(titres, 0)} Md\\$ de duration modifiée ${f(dur, 1)}. Par −D×Δy, combien de Md\\$ de moins-values latentes cela crée-t-il ?`,
          reponse: repMv, tolerance: Math.max(0.5, repMv * 0.03), toleranceMode: 'absolu', unite: 'Md$',
          etapes: [{
            titre: en ? 'The accounting shows nothing; the economics shows everything' : 'La comptabilité ne montre rien ; l\'économie montre tout',
            contenu: en
              ? `ΔP/P ≈ −${f(dur, 1)} × ${f(r2(deltaPb / 100), 2)} = ${pct(r1(mvPct), 1)}; on \\$${f(titres, 0)}bn: **\\$${f(repMv, 1)}bn** of latent losses — against \\$${f(fp, 1)}bn of equity, that is ${pct(r0((mvMd / fp) * 100), 0)}: mark the portfolio to market and the bank's net worth is roughly zero. The chapter's phrase is exact: economically dead at end-2022, and nobody saw it because HTM accounting keeps securities at cost — the loss was real, footnoted, published, visible to whoever multiplies two numbers. And note what the portfolio was: Treasuries and agency MBS, zero credit risk. Rate risk is NOT credit risk, and it kills banks too.`
              : `ΔP/P ≈ −${f(dur, 1)} × ${f(r2(deltaPb / 100), 2)} = ${pct(r1(mvPct), 1)} ; sur ${f(titres, 0)} Md\\$ : **${f(repMv, 1)} Md\\$** de moins-values latentes — contre ${f(fp, 1)} Md\\$ de fonds propres, soit ${pct(r0((mvMd / fp) * 100), 0)} : valorisez le portefeuille au marché et l'actif net de la banque est à peu près nul. La phrase du chapitre est exacte : économiquement morte fin 2022, et personne ne le voyait parce que la comptabilité HTM garde les titres au coût — la perte était réelle, en note de bas de page, publiée, visible pour qui multiplie deux nombres. Et notez ce qu'était le portefeuille : des Treasuries et des MBS d'agences, zéro risque de crédit. Le risque de taux N'EST PAS un risque de crédit, et il tue aussi des banques.`,
          }],
          pieges: [en
            ? `"The losses were only latent, so the bank was fine" assumes the liability side waits: sight deposits can leave any morning, and holding to maturity is a promise the depositors never signed — a run is precisely the event that forces the latent to become real.`
            : `« Les pertes n'étaient que latentes, donc la banque tenait » suppose que le passif attend : des dépôts à vue peuvent partir n'importe quel matin, et porter à l'échéance est une promesse que les déposants n'ont jamais signée — la ruée est précisément l'événement qui force le latent à devenir réel.`],
        },
        {
          intitule: en ? 'b) March 8: the sale that turned the lights on' : 'b) Le 8 mars : la vente qui allume la lumière',
          enonce: en
            ? `The bank sells \\$${f(vente8Mars, 0)}bn of securities at about ${pct(decoteVente, 1)} below their carrying value. What loss, in \\$bn, does the sale realise?`
            : `La banque vend ${f(vente8Mars, 0)} Md\\$ de titres environ ${pct(decoteVente, 1)} sous leur valeur comptable. Quelle perte, en Md\\$, la vente réalise-t-elle ?`,
          reponse: repVente, tolerance: 0.1, toleranceMode: 'absolu', unite: 'Md$',
          etapes: [{
            titre: en ? 'Someone said it out loud' : 'Quelqu\'un l\'a dit tout haut',
            contenu: en
              ? `Loss = ${f(vente8Mars, 0)} × ${f(decoteVente, 1)}% = **\\$${f(repVente, 2)}bn** realised — the real file's order of magnitude (\\$1.8bn), and the signal that armed spring needed. The loaded-spring logic: nothing HAD to happen, but any event forcing latent to become real — a sale, a downgrade, a tweet — reveals that the equity is gone. Selling \\$21bn and announcing a capital raise the same day is exactly that event: the latent loss becomes public accounting, and every treasurer in the valley reads the same two numbers you just multiplied.`
              : `Perte = ${f(vente8Mars, 0)} × ${f(decoteVente, 1)} % = **${f(repVente, 2)} Md\\$** réalisés — l'ordre de grandeur du dossier réel (1,8 Md\\$), et le signal dont le ressort armé avait besoin. La logique du ressort : rien n'était OBLIGÉ d'arriver, mais tout événement forçant le latent à devenir réel — une vente, une dégradation, un tweet — révèle que les fonds propres ont disparu. Vendre 21 Md\\$ et annoncer une augmentation de capital le même jour est exactement cet événement : la perte latente devient de la comptabilité publique, et chaque trésorier de la vallée lit les deux mêmes nombres que vous venez de multiplier.`,
          }],
        },
        {
          intitule: en ? 'c) The coverage arithmetic: no bank survives this' : 'c) L\'arithmétique de couverture : aucune banque ne survit à ça',
          enonce: en
            ? `Same-day liquid assets: \\$${f(liquides, 0)}bn against \\$${f(depots, 0)}bn of deposits. What is the deposit coverage ratio, in %?`
            : `Actifs liquides du jour : ${f(liquides, 0)} Md\\$ contre ${f(depots, 0)} Md\\$ de dépôts. Quel est le taux de couverture des dépôts, en % ?`,
          reponse: repCouv, tolerance: 0.3, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'The 19th century at app speed' : 'Le XIXᵉ siècle à la vitesse de l\'app',
            contenu: en
              ? `Coverage = ${f(liquides, 0)} / ${f(depots, 0)} = **${pct(repCouv, 1)}**. On March 9 the depositors request \\$${f(retraits, 0)}bn — ${pct(r1((retraits / depots) * 100), 1)} of the base, in ONE day, from smartphones, without a single queue: no bank on earth covers a quarter of its deposits in same-day liquid assets; fractional banking is a promise that not everyone comes at once. Two structural aggravations: the concentration that built the deposit base (one industry, one valley, the same group chats) turned it into a single coordinated depositor; and with >90% of balances above the insurance cap, whoever withdraws first gets 100 cents, whoever waits gets the liquidation — running first was individually rational, which is what makes the panic collectively unstoppable.`
              : `Couverture = ${f(liquides, 0)} / ${f(depots, 0)} = **${pct(repCouv, 1)}**. Le 9 mars, les déposants demandent ${f(retraits, 0)} Md\\$ — ${pct(r1((retraits / depots) * 100), 1)} de la base, en UNE journée, depuis des smartphones, sans une seule file : aucune banque au monde ne couvre un quart de ses dépôts en actifs liquides du jour ; la banque fractionnaire est une promesse que tout le monde ne vient pas en même temps. Deux aggravations structurelles : la concentration qui avait construit la base de dépôts (une industrie, une vallée, les mêmes group chats) l'a transformée en un unique déposant coordonné ; et avec plus de 90 % des soldes au-dessus du plafond de garantie, qui retire en premier touche 100 cents, qui attend touche la liquidation — courir en premier était individuellement rationnel, ce qui rend la panique collectivement inarrêtable.`,
          }],
        },
        {
          intitule: en ? 'd) Serving the run: the sale that realises the death' : 'd) Servir la ruée : la vente qui réalise la mort',
          enonce: en
            ? `To serve the \\$${f(retraits, 0)}bn of withdrawals beyond the \\$${f(liquides, 0)}bn of liquid assets, the bank must sell securities at about ${pct(decoteRun, 1)} below carrying value. What pre-discount value, in \\$bn, must it sell?`
            : `Pour servir les ${f(retraits, 0)} Md\\$ de retraits au-delà des ${f(liquides, 0)} Md\\$ d'actifs liquides, la banque doit vendre des titres environ ${pct(decoteRun, 1)} sous la valeur comptable. Quelle valeur pré-décote, en Md\\$, doit-elle vendre ?`,
          reponse: repVendre, tolerance: 0.5, toleranceMode: 'absolu', unite: 'Md$',
          etapes: [{
            titre: en ? 'Each withdrawal converts latent into real' : 'Chaque retrait convertit du latent en réel',
            contenu: en
              ? `To sell = (${f(retraits, 0)} − ${f(liquides, 0)}) / (1 − ${f(decoteRun, 1)}%) = **\\$${f(repVendre, 1)}bn**, crystallising about \\$${f(r1(perteRun), 1)}bn of additional realised losses against equity the latent hole has already consumed. There is the fatal coupling: the run forces sales, the sales realise the very losses the depositors feared, each confirmed loss accelerates the run. The HTM promise — "we will hold to maturity" — dies at the first withdrawal it cannot serve in cash. Friday morning, the regulator closes the bank; Signature follows on the 12th, First Republic agonises until May 1.`
              : `À vendre = (${f(retraits, 0)} − ${f(liquides, 0)}) / (1 − ${f(decoteRun, 1)} %) = **${f(repVendre, 1)} Md\\$**, en cristallisant environ ${f(r1(perteRun), 1)} Md\\$ de pertes réalisées supplémentaires contre des fonds propres que le trou latent a déjà consommés. Voilà le couplage fatal : la ruée force les ventes, les ventes réalisent les pertes mêmes que les déposants craignaient, chaque perte confirmée accélère la ruée. La promesse du HTM — « nous porterons à l'échéance » — meurt au premier retrait qu'elle ne peut pas servir en cash. Vendredi matin, le régulateur ferme la banque ; Signature suit le 12, First Republic agonise jusqu'au 1ᵉʳ mai.`,
          }],
        },
        {
          intitule: en ? 'e) The BTFP: lending at par breaks the run' : 'e) Le BTFP : prêter au pair casse le run',
          enonce: en
            ? `Sunday, March 12: the BTFP lends AT PAR against collateral trading below par. Against the \\$${f(titres, 0)}bn portfolio, how many MORE \\$bn does par lending provide than a market lender valuing the collateral at market price?`
            : `Dimanche 12 mars : le BTFP prête AU PAIR contre du collatéral qui cote sous le pair. Sur le portefeuille de ${f(titres, 0)} Md\\$, combien de Md\\$ de PLUS le prêt au pair fournit-il qu'un prêteur de marché valorisant le collatéral au prix du marché ?`,
          reponse: repBtfp, tolerance: Math.max(0.5, repBtfp * 0.03), toleranceMode: 'absolu', unite: 'Md$',
          etapes: [
            {
              titre: en ? 'A Bagehot bent for a duration crisis' : 'Un Bagehot tordu pour une crise de duration',
              contenu: en
                ? `Extra funding = par − market = ${f(titres, 0)} − ${f(titres, 0)} × (1 − ${f(r1(Math.abs(mvPct)), 1)}%) = **\\$${f(repBtfp, 1)}bn** — exactly the latent loss of question a). That identity IS the design: the facility lends precisely the amount the market refuses to see as collateral value. Consequence: a bank facing a run no longer needs to SELL — it borrows at par, serves the withdrawals, the loss stays latent, and running becomes pointless. Bagehot's rule (chapter 1) says: lend freely, at a penalty rate, against GOOD collateral. Here the collateral is good in CREDIT (Treasuries, agencies) and only impaired in RATE — the BTFP closes its eyes on the mark-to-market: a Bagehot bent, tailor-made for a duration crisis. What Bagehot would sign: the free lending against sound credit. What he would question: valuing collateral above its market price, and the precedent it sets.`
                : `Financement en plus = pair − marché = ${f(titres, 0)} − ${f(titres, 0)} × (1 − ${f(r1(Math.abs(mvPct)), 1)} %) = **${f(repBtfp, 1)} Md\\$** — exactement la perte latente de la question a). Cette identité EST le dispositif : la facilité prête précisément le montant que le marché refuse de voir comme valeur de collatéral. Conséquence : une banque face à une ruée n'a plus besoin de VENDRE — elle emprunte au pair, sert les retraits, la perte reste latente, et courir devient inutile. La règle de Bagehot (chapitre 1) dit : prêter largement, à taux de pénalité, contre du BON collatéral. Ici le collatéral est bon en CRÉDIT (Treasuries, agences) et seulement déprécié en TAUX — le BTFP ferme les yeux sur le mark-to-market : un Bagehot tordu, taillé sur mesure pour une crise de duration. Ce que Bagehot signerait : le prêt large contre du crédit sain. Ce qu'il questionnerait : valoriser un collatéral au-dessus de son prix de marché, et le précédent que cela crée.`,
            },
            {
              titre: en ? 'What those 48 hours taught the trade' : 'Ce que ces 48 heures ont appris au métier',
              contenu: en
                ? `March 2023 in three lessons, plus one thread. Duration kills banks too — no default anywhere in the portfolio, and it cost the equity. A modern run moves at social-network speed — 48 hours where 1907 took weeks; the queues are group chats now. Uninsured deposits run FIRST — client concentration is a risk datum on a par with the balance sheet. And the thread for the module's finale: Greenspan's one sentence (1987) became the Fed put, became the unlimited QE of March 2020, became the guarantee of ALL deposits of March 12, 2023 — each rescue was individually right, and each teaches the system to carry more risk toward the next one. Safer, or just more heavily insured? That question is the module's exit door.`
                : `Mars 2023 en trois leçons, plus un fil. La duration tue aussi les banques — aucun défaut nulle part dans le portefeuille, et elle a coûté les fonds propres. Un run moderne va à la vitesse des réseaux sociaux — 48 heures là où 1907 prenait des semaines ; les files d'attente sont désormais des group chats. Les dépôts non assurés courent EN PREMIER — la concentration de la clientèle est une donnée de risque au même titre que le bilan. Et le fil pour le finale du module : la phrase unique de Greenspan (1987) est devenue le Fed put, devenue le QE illimité de mars 2020, devenue la garantie de TOUS les dépôts du 12 mars 2023 — chaque sauvetage a été isolément juste, et chacun apprend au système à porter plus de risque vers le suivant. Plus sûr, ou seulement mieux assuré ? Cette question est la porte de sortie du module.`,
            },
          ],
          pieges: [en
            ? `"SVB died of risky startup loans" gets the asset wrong: the portfolio was government paper — the killer was rate risk plus a runnable, concentrated, uninsured liability. Credit risk never appeared in this story.`
            : `« SVB est morte de prêts risqués aux startups » se trompe d'actif : le portefeuille était du papier d'État — le tueur fut le risque de taux plus un passif concentré, non assuré, et capable de courir. Le risque de crédit n'apparaît jamais dans cette histoire.`],
        },
      ],
    };
  },
};

export const problemesLot2: ProblemGenerator[] = [
  ltcmGreenwich,
  lundiNoir87,
  weekEndLehman,
  athenesDoomLoop,
  giltsSpiraleTours,
  svbSantaClara,
];
