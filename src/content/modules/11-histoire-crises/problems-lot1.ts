/**
 * Moules de problèmes multi-étapes du module Histoire & crises financières —
 * LOT 1 : les 8 moules N1/N2 (m11-pb-01 à m11-pb-08).
 * 4 N1 (le spéculateur de 1929, anatomie d'un krach, la banque face à la
 * ruée, l'État sous les spreads) et 4 N2 (le fonds levié dans la tempête,
 * le desk repo en 2008, la banque morte en silence, récupérer ou pas).
 * Chaque moule : 3 scénarios FR + EN (habillages ET bornes de tirage
 * différents), sous-questions chaînées (la sortie de a) nourrit b), c)…),
 * corrigés calculés via calculs.ts (m11 + le pont duration du m10) — jamais
 * de texte figé.
 * INVARIANT BILINGUE : tous les tirages aléatoires ont lieu AVANT toute branche
 * de langue — même seed + même scénario ⇒ mêmes nombres en français et en anglais.
 * Conventions (en-tête de calculs.ts) : pourcentages partout ; le levier est
 * un multiple SANS UNITÉ (actifs/fonds propres) ; une PERTE se passe en
 * magnitude POSITIVE aux fonctions de récupération, les drawdowns et impacts
 * de levier se RENDENT signés ; décotes et haircuts en % de la valeur de
 * marché ; les spreads souverains en POINTS DE BASE ; composition DISCRÈTE
 * annuelle (1 + g)^n. La vente forcée à levier cible S = (A − λE)/(1 − λd)
 * est celle du GoFurther du chapitre 1 (helper local, composé — les briques
 * de calculs.ts n'exposent que venteForceePourCash). Les chiffres
 * historiques des habillages (381,17 → 41,22, call loans à 8,5 Md$, haircuts
 * 2 % → 25 %, SVB −11,4 % × 140 Md$, Grèce 3 350 pb, Nikkei 34 ans) sont ceux
 * des chapitres 1, 2, 5, 6 et 7 du module.
 */
import { formatNombreLangue } from '../../../engine/answers';
import { mulberry32, randFloat, randInt } from '../../../engine/rng';
import type { Langue, ProblemGenerator } from '../../../engine/types';
import { variationPrixObligationDuration } from '../10-macro-banques-centrales/calculs';
import {
  anneesDeRecuperation, chargeInteretsDette, drawdownPct, financementRepo,
  gainRequisPourRecuperer, impactLevierSurFondsPropres, levierBilan,
  levierMaximalRepo, spreadSouverainPb, tauxCouvertureDepots,
  variationActifsFatale, venteForceePourCash,
} from './calculs';

/** Un « moule » de problème est un ProblemGenerator de l'engine (alias local). */
export type ProblemeMoule = ProblemGenerator;

const M11 = '11-histoire-crises';
const r2 = (v: number) => Math.round(v * 100) / 100;

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
  return { en, f, pct, mnt };
}

/** Devises « à échelle » (Md$, M$, Md£, Md¥) : préfixe EN, suffixe EN, libellé FR. */
interface Dev { fr: string; pre: string; suf: string; }
const cashFab = (en: boolean, f: (v: number, d?: number) => string, dev: Dev) =>
  (v: number, d = 1) => (en ? `${dev.pre}${f(v, d)}${dev.suf}` : `${f(v, d)} ${dev.fr}`);

/**
 * Vente forcée pour REVENIR à un levier cible λ sous une décote de
 * liquidation d : S = (A − λE)/(1 − λ·d/100) — la formule dérivée dans le
 * GoFurther du chapitre 1 (vendre S rapporte S(1−d) de cash et coûte S·d de
 * fonds propres ; on impose A − S = λ(E − S·d)). Composée ici car calculs.ts
 * expose la spirale par ses briques (venteForceePourCash comble un besoin de
 * cash donné) mais pas la cible de levier. Zone de mort si λ·d ≥ 1.
 */
function venteForceePourLevierCible(actifs: number, fondsPropres: number, levierCible: number, decotePct: number): number {
  return (actifs - levierCible * fondsPropres) / (1 - (levierCible * decotePct) / 100);
}

/* ------------------------------------------------------------------ */
/* 1. m11-pb-01 — Le spéculateur de 1929 — N1                          */
/* ------------------------------------------------------------------ */
const speculateur1929: ProblemeMoule = {
  id: 'm11-pb-01', moduleId: M11,
  titre: "Le spéculateur de 1929 : la marge, le levier et l'appel du courtier",
  titreEn: "The 1929 speculator: margin, leverage and the broker's call",
  typeDeCas: 'achat sur marge',
  typeDeCasEn: 'buying on margin',
  difficulte: 1,
  scenarios: ["L'employé de bureau achète RCA sur marge au sommet de 1929 (le titre ×10 en quatre ans)", 'Le chauffeur de taxi devenu trader : un compte sur marge ouvert au printemps 1929', "Le trust d'investissement : un professionnel leviéré sur un marché leviéré"],
  scenariosEn: ['The office clerk buys RCA on margin at the 1929 top (the stock ×10 in four years)', 'The taxi driver turned trader: a margin account opened in the spring of 1929', 'The investment trust: a leveraged professional in a leveraged market'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : taille du portefeuille, marge exigée.
    const cfg = ([
      { totMin: 1, totMax: 5, totMult: 1000, mgMin: 10, mgMax: 15 },
      { totMin: 5, totMax: 20, totMult: 100, mgMin: 10, mgMax: 20 },
      { totMin: 1, totMax: 5, totMult: 100000, mgMin: 15, mgMax: 25 },
    ] as const)[sIdx];
    const total = randInt(rng, cfg.totMin, cfg.totMax) * cfg.totMult;
    const marge = randInt(rng, cfg.mgMin, cfg.mgMax);
    // Le choc tiré reste STRICTEMENT sous le choc fatal (30-75 % de la marge).
    const choc = randFloat(rng, marge * 0.3, marge * 0.75, 1);
    const mise = r2((total * marge) / 100);
    const dette = r2(total - mise);
    const levier = r2(levierBilan(total, mise));
    const fatal = r2(variationActifsFatale(levier));
    const impact = r2(impactLevierSurFondsPropres(levier, -choc));
    const fpRestants = r2(mise * (1 + impact / 100));
    const appel = r2(mise - fpRestants);
    const perteMarche = r2((total * choc) / 100);

    const { en, f, pct, mnt } = outils(langue);
    const desc = en
      ? `${mnt(total, '$', 0)} of stock bought with a ${mnt(mise, '$', 0)} down payment (${pct(marge, 0)} margin), the remaining ${mnt(dette, '$', 0)} lent by the broker as an overnight call loan, securities pledged; market scenario: a ${pct(choc, 1)} drop`
      : `${mnt(total, '$', 0)} d'actions achetées avec ${mnt(mise, '$', 0)} de mise (marge de ${pct(marge, 0)}), le solde — ${mnt(dette, '$', 0)} — prêté par le courtier en call loan au jour le jour, titres en garantie ; scénario de marché : une baisse de ${pct(choc, 1)}`;
    const contexte = (en
      ? [
        `New York, summer 1929. RCA has been multiplied by ten in four years and the office clerk wants his share: ${desc}. Broker loans exceed \\$8.5bn nationwide and call money at times pays 15% — even industrial firms lend to speculators rather than build factories. His worksheet: the leverage, the shock that kills, the effect of an "ordinary" dip, and the broker's call.`,
        `Spring 1929. The taxi driver hands out stock tips between two fares — the anecdote that made Joseph Kennedy sell — and he now runs his own margin account: ${desc}. Before believing the "new era", run the chapter's arithmetic: leverage, fatal shock, the effect of an ordinary correction, and what the broker will demand.`,
        `1929's great innovation: investment trusts — leveraged funds buying, on margin, shares of other leveraged trusts. The pyramid in one account: ${desc}. The manager wants the numbers his own clients never ask for: leverage, distance to death, the arithmetic of an ordinary drop, and the margin call that ends careers.`,
      ]
      : [
        `New York, été 1929. RCA a été multipliée par dix en quatre ans et l'employé de bureau veut sa part : ${desc}. Les broker loans dépassent 8,5 Md\\$ dans le pays et le call money paie par moments 15 % — même des entreprises industrielles préfèrent prêter aux spéculateurs plutôt que d'investir dans leurs usines. Sa feuille : le levier, le choc qui tue, l'effet d'une baisse « ordinaire », et l'appel du courtier.`,
        `Printemps 1929. Le chauffeur de taxi donne des tuyaux boursiers entre deux courses — l'anecdote qui fit vendre Joseph Kennedy — et il gère désormais son propre compte sur marge : ${desc}. Avant de croire à la « nouvelle ère », faisons l'arithmétique du chapitre : levier, choc fatal, effet d'une correction ordinaire, et ce que le courtier exigera.`,
        `La grande innovation de 1929 : les trusts d'investissement — des fonds leviérés qui achètent, sur marge, des actions d'autres trusts leviérés. La pyramide en un compte : ${desc}. Le gérant veut les chiffres que ses propres clients ne demandent jamais : le levier, la distance à la mort, l'arithmétique d'une baisse ordinaire, et l'appel de marge qui termine les carrières.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The margin mechanics: the leverage' : 'a) La mécanique de la marge : le levier',
          enonce: en
            ? `A ${pct(marge, 0)} margin: ${mnt(mise, '$', 0)} of equity carry ${mnt(total, '$', 0)} of stock. What is the account's leverage (assets/equity, unitless)?`
            : `Marge de ${pct(marge, 0)} : ${mnt(mise, '$', 0)} de mise portent ${mnt(total, '$', 0)} d'actions. Quel est le levier du compte (actifs/fonds propres, sans unité) ?`,
          reponse: levier, tolerance: 0.005, unite: '×',
          etapes: [{
            titre: en ? 'Leverage = assets/equity = 100/margin' : 'Levier = actifs/fonds propres = 100/marge',
            contenu: en
              ? `Leverage = ${f(total, 0)}/${f(mise, 0)} = **${f(levier, 2)}**: every dollar of equity carries ${f(levier, 2)} dollars of stock, and the ${mnt(dette, '$', 0)} of call-loan debt is renewed every single day, securities pledged. The 10% margin — the 1929 standard, with no federal rule before the SEC of 1934 — handed leverage 10 to millions of Americans; broker loans reached \\$8.5bn.`
              : `Levier = ${f(total, 0)}/${f(mise, 0)} = **${f(levier, 2)}** : chaque dollar de mise porte ${f(levier, 2)} dollars d'actions, et la dette de call loan de ${mnt(dette, '$', 0)} se renouvelle chaque jour, titres en garantie. La marge de 10 % — le standard de 1929, sans aucune règle fédérale avant la SEC de 1934 — a mis le levier 10 entre les mains de millions d'Américains ; les broker loans ont atteint 8,5 Md\\$.`,
          }],
          pieges: [en
            ? `Reading "${pct(marge, 0)} margin" as "leverage ${f(marge, 0)}": leverage is the INVERSE of margin — 100/${f(marge, 0)} = ${f(levier, 2)}. The smaller the margin, the bigger the leverage.`
            : `Lire « marge de ${pct(marge, 0)} » comme « levier ${f(marge, 0)} » : le levier est l'INVERSE de la marge — 100/${f(marge, 0)} = ${f(levier, 2)}. Plus la marge est petite, plus le levier est grand.`],
        },
        {
          intitule: en ? 'b) The distance to death: the fatal shock' : 'b) La distance à la mort : le choc fatal',
          enonce: en
            ? `At the leverage found in a), what market move wipes out EXACTLY all the equity, in % (signed answer)?`
            : `Au levier trouvé au a), quelle variation du marché efface EXACTEMENT toute la mise, en % (réponse signée) ?`,
          reponse: fatal, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Fatal shock = −100/leverage' : 'Choc fatal = −100/levier',
            contenu: en
              ? `−100/${f(levier, 2)} = **${pct(fatal, 2)}** — notice it is exactly minus the margin: the debt does not share losses, so the equity IS the whole distance to death. Now measure October 1929 against it: Black Monday (Oct 28) −12.8%, Black Tuesday (Oct 29) −11.7% — EACH of those single days exceeded the fatal shock of the entire 10%-margin speculation of the country. Liquidation was not a decision; it was wired in advance.`
              : `−100/${f(levier, 2)} = **${pct(fatal, 2)}** — remarquez : c'est exactement moins la marge. La dette ne partage pas les pertes, la mise EST toute la distance à la mort. Mesurez maintenant octobre 1929 à cette aune : lundi noir (28 oct.) −12,8 %, mardi noir (29 oct.) −11,7 % — CHACUNE de ces journées dépassait à elle seule le choc fatal de toute la spéculation sur marge à 10 % du pays. La liquidation n'était pas une décision ; elle était câblée d'avance.`,
          }],
          pieges: [en
            ? `Believing the account survives down to −100%: that is the CASH investor (leverage 1, who never goes bust on prices). At leverage ${f(levier, 2)}, ${pct(fatal, 2)} is enough — a bad week in 1929.`
            : `Croire que le compte tient jusqu'à −100 % : c'est l'investisseur au COMPTANT (levier 1, qui ne fait jamais faillite par les prix). Au levier ${f(levier, 2)}, ${pct(fatal, 2)} suffisent — une mauvaise semaine de 1929.`],
        },
        {
          intitule: en ? `c) An "ordinary" dip: ${pct(choc, 1)} on the market` : `c) Une baisse « ordinaire » : ${pct(choc, 1)} de marché`,
          enonce: en
            ? `The market slips by ${pct(choc, 1)} — less than the fatal shock of b). By how much does the account's equity move, in % (signed)?`
            : `Le marché recule de ${pct(choc, 1)} — moins que le choc fatal du b). De combien varient les fonds propres du compte, en % (signé) ?`,
          reponse: impact, tolerance: 0.1, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'ΔEquity% = leverage × Δassets%: the misfortune formula' : 'ΔFP % = levier × Δactifs % : la formule du malheur',
            contenu: en
              ? `${f(levier, 2)} × (${f(-choc, 1)}) = **${pct(impact, 2)}**. The assets lose ${pct(choc, 1)}, but the ${mnt(dette, '$', 0)} of debt does not move by a cent: equity absorbs everything, multiplied by the leverage. Remember the formula works both ways — that is WHY people lever up: the same ${pct(choc, 1)} on the upside would have made +${pct(r2(-impact), 2)} on the stake. Leverage manufactures geniuses during the boom and reveals them during the panic.`
              : `${f(levier, 2)} × (${f(-choc, 1)}) = **${pct(impact, 2)}**. Les actifs perdent ${pct(choc, 1)}, mais la dette de ${mnt(dette, '$', 0)} ne bouge pas d'un cent : les fonds propres absorbent tout, multiplié par le levier. Et souvenez-vous que la formule marche dans les deux sens — c'est POUR ÇA qu'on se levier : le même ${pct(choc, 1)} à la hausse aurait fait +${pct(r2(-impact), 2)} sur la mise. Le levier fabrique des génies pendant le boom et les révèle pendant la panique.`,
          }],
          pieges: [en
            ? `Answering ${pct(-choc, 1)}: forgetting the leverage. Equity moves ${f(levier, 2)} times as much as the market — that multiplication IS the whole story of 1929.`
            : `Répondre ${pct(-choc, 1)} : oublier le levier. Les fonds propres bougent ${f(levier, 2)} fois plus que le marché — cette multiplication EST toute l'histoire de 1929.`],
        },
        {
          intitule: en ? "d) The broker's call" : "d) L'appel du courtier",
          enonce: en
            ? `After the shock of c), the broker calls: restore the initial ${mnt(mise, '$', 0)} of equity TODAY, or be liquidated. How much cash must be wired in, in \\$?`
            : `Après le choc du c), le courtier appelle : reconstituer la mise initiale de ${mnt(mise, '$', 0)} AUJOURD'HUI, ou liquidation d'office. Combien faut-il apporter en cash, en \\$ ?`,
          reponse: appel, tolerance: 0.005, unite: '$',
          etapes: [
            {
              titre: en ? 'Remaining equity, then the call' : "Fonds propres restants, puis l'appel",
              contenu: en
                ? `Remaining equity = ${f(mise, 0)} × (1 + ${f(impact, 2)}/100) = **${mnt(fpRestants, '$', 2)}**; the call = ${f(mise, 0)} − ${f(fpRestants, 2)} = **${mnt(appel, '$', 2)}**. Sanity check: that is exactly the portfolio's loss, ${pct(choc, 1)} × ${f(total, 0)} = ${mnt(perteMarche, '$', 2)} — since the debt is fixed, restoring the equity means injecting the whole market loss, which is ${pct(r2(-impact), 2)} of the original stake.`
                : `Fonds propres restants = ${f(mise, 0)} × (1 + ${f(impact, 2)}/100) = **${mnt(fpRestants, '$', 2)}** ; l'appel = ${f(mise, 0)} − ${f(fpRestants, 2)} = **${mnt(appel, '$', 2)}**. Vérification : c'est exactement la perte du portefeuille, ${pct(choc, 1)} × ${f(total, 0)} = ${mnt(perteMarche, '$', 2)} — la dette étant fixe, reconstituer la mise revient à injecter TOUTE la perte de marché, soit ${pct(r2(-impact), 2)} de la mise initiale.`,
            },
            {
              titre: en ? 'What 1929 did with this call' : 'Ce que 1929 a fait de cet appel',
              contenu: en
                ? `Multiply this call by hundreds of thousands of accounts and you have the chapter-1 spiral: those who cannot pay are liquidated, forced sales depress prices, lower prices trigger the next round of calls. Black Thursday (Oct 24): 12.9 million shares traded, the ticker running up to four hours late — millions sold without knowing their own prices. The Dow went from its 381.17 peak (Sept 3, 1929) to 41.22 (July 8, 1932). The SEC of 1934 would regulate margin — your module-1 regulator is a scar of this very counter.`
                : `Multipliez cet appel par des centaines de milliers de comptes et vous avez la spirale du chapitre 1 : ceux qui ne paient pas sont liquidés d'office, les ventes forcées dépriment les prix, les prix plus bas déclenchent la vague d'appels suivante. Jeudi noir (24 oct.) : 12,9 millions de titres échangés, un ticker jusqu'à quatre heures en retard — des millions de porteurs ont vendu sans connaître leurs propres prix. Le Dow est allé de son pic de 381,17 (3 sept. 1929) à 41,22 (8 juil. 1932). La SEC de 1934 encadrera la marge — votre régulateur du module 1 est une cicatrice de ce guichet précis.`,
            },
          ],
          pieges: [en
            ? `Computing the call on the stake ("${pct(choc, 1)} of ${mnt(mise, '$', 0)}"): the drop applies to the WHOLE ${mnt(total, '$', 0)} portfolio — the call equals the full market loss ${mnt(appel, '$', 2)}, i.e. ${pct(r2(-impact), 2)} of the stake.`
            : `Calculer l'appel sur la mise (« ${pct(choc, 1)} de ${mnt(mise, '$', 0)} ») : la baisse s'applique au PORTEFEUILLE entier de ${mnt(total, '$', 0)} — l'appel égale toute la perte de marché ${mnt(appel, '$', 2)}, soit ${pct(r2(-impact), 2)} de la mise.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 2. m11-pb-02 — Anatomie d'un krach — N1                             */
/* ------------------------------------------------------------------ */
const anatomieKrach: ProblemeMoule = {
  id: 'm11-pb-02', moduleId: M11,
  titre: "Anatomie d'un krach : drawdown, gain requis, années de purgatoire",
  titreEn: 'Anatomy of a crash: drawdown, required gain, years of purgatory',
  typeDeCas: 'asymétrie des pertes',
  typeDeCasEn: 'loss asymmetry',
  difficulte: 1,
  scenarios: ["Un indice type 1929 : de 381 à 41, l'étalon de toutes les catastrophes", 'Un indice type Nasdaq 2000 : la tech rend plus des trois quarts', 'Un indice type Nikkei 1989 : quand la récupération se compte en décennies'],
  scenariosEn: ['A 1929-style index: from 381 to 41, the benchmark of all catastrophes', 'A Nasdaq-2000-style index: tech gives back more than three quarters', 'A Nikkei-1989-style index: when recovery is measured in decades'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : pic, creux, croissance de récupération, rebond intermédiaire.
    const cfg = ([
      { picMin: 360, picMax: 400, crMin: 40, crMax: 60, gMin: 6, gMax: 8, rbMin: 35, rbMax: 50, dec: 2 },
      { picMin: 4800, picMax: 5200, crMin: 1100, crMax: 1500, gMin: 5, gMax: 8, rbMin: 20, rbMax: 40, dec: 2 },
      { picMin: 35000, picMax: 39000, crMin: 14000, crMax: 20000, gMin: 1.5, gMax: 4, rbMin: 20, rbMax: 35, dec: 0 },
    ] as const)[sIdx];
    const pic = randFloat(rng, cfg.picMin, cfg.picMax, cfg.dec);
    const creux = randFloat(rng, cfg.crMin, cfg.crMax, cfg.dec);
    const g = randFloat(rng, cfg.gMin, cfg.gMax, 1);
    const rebond = randInt(rng, cfg.rbMin, cfg.rbMax);
    const dd = r2(drawdownPct(pic, creux));            // signé, négatif
    const gain = r2(gainRequisPourRecuperer(-dd));     // magnitude positive
    const annees = r2(anneesDeRecuperation(-dd, g));
    const niveauRebond = r2(creux * (1 + rebond / 100));
    const ddRestant = r2(drawdownPct(pic, niveauRebond));
    const gainRestant = r2(gainRequisPourRecuperer(-ddRestant));
    const naifAnnees = r2(gain / g);
    const dec = cfg.dec;

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `peak ${f(pic, dec)}, trough ${f(creux, dec)}; assumed recovery growth ${pct(g, 1)} per year, compounded; along the way, a ${pct(rebond, 0)} rally off the trough`
      : `pic ${f(pic, dec)}, creux ${f(creux, dec)} ; croissance de récupération supposée ${pct(g, 1)} par an, composée ; en chemin, un rebond de ${pct(rebond, 0)} depuis le creux`;
    const contexte = (en
      ? [
        `The museum of crashes, room one: a 1929-style index — the real thing went from 381.17 (Sept 3, 1929) to 41.22 (July 8, 1932) and needed 25 years to see its peak again. Your specimen: ${desc}. Establish its identity card: drawdown, required gain, theoretical recovery years — and what the mid-crash rally was really worth.`,
        `Room two: a Nasdaq-2000-style index — the real one went from 5,048.62 to 1,114.11 and took 15 years to revisit its peak. Your specimen: ${desc}. Same protocol: drawdown, required gain, theoretical years, and the arithmetic of the bear-market rally that fooled everyone.`,
        `Room three: a Nikkei-1989-style index — the real one peaked near 38,957 in December 1989 and waited 34 years. Your specimen: ${desc}. The Japanese case is the module's memento: compute the drawdown, the required gain, the theoretical years at a modest growth — then weigh the rally against the road left.`,
      ]
      : [
        `Le musée des krachs, salle un : un indice type 1929 — l'original est allé de 381,17 (3 sept. 1929) à 41,22 (8 juil. 1932) et a mis 25 ans à revoir son pic. Votre spécimen : ${desc}. Établissez sa carte d'identité : drawdown, gain requis, années théoriques de récupération — et ce que valait vraiment le rebond de milieu de krach.`,
        `Salle deux : un indice type Nasdaq 2000 — l'original est allé de 5 048,62 à 1 114,11 et a attendu 15 ans pour revoir son pic. Votre spécimen : ${desc}. Même protocole : drawdown, gain requis, années théoriques, et l'arithmétique du rebond de bear market qui a trompé tout le monde.`,
        `Salle trois : un indice type Nikkei 1989 — l'original a culminé vers 38 957 en décembre 1989 et a attendu 34 ans. Votre spécimen : ${desc}. Le cas japonais est le memento du module : calculez le drawdown, le gain requis, les années théoriques à croissance modeste — puis pesez le rebond contre la route restante.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The identity card: the drawdown' : "a) La carte d'identité : le drawdown",
          enonce: en
            ? `Peak ${f(pic, dec)}, trough ${f(creux, dec)}. Peak-to-trough drawdown, in % (signed)?`
            : `Pic ${f(pic, dec)}, creux ${f(creux, dec)}. Drawdown pic-à-creux, en % (signé) ?`,
          reponse: dd, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'Drawdown = (trough/peak − 1) × 100' : 'Drawdown = (creux/pic − 1) × 100',
            contenu: en
              ? `(${f(creux, dec)}/${f(pic, dec)} − 1) × 100 = **${pct(dd, 2)}** — the crash's numbered identity card, always quoted signed, the market-screen convention. The module's reference values: DJIA 1929-32, 381.17 → 41.22 = −89.19%; Nasdaq 2000-02, 5,048.62 → 1,114.11 = −77.93%; COVID 2020, 3,386.15 → 2,237.40 = −33.92% in 23 sessions.`
              : `(${f(creux, dec)}/${f(pic, dec)} − 1) × 100 = **${pct(dd, 2)}** — la carte d'identité chiffrée du krach, toujours cotée signée, la convention des écrans de marché. Les valeurs de référence du module : DJIA 1929-32, 381,17 → 41,22 = −89,19 % ; Nasdaq 2000-02, 5 048,62 → 1 114,11 = −77,93 % ; COVID 2020, 3 386,15 → 2 237,40 = −33,92 % en 23 séances.`,
          }],
          pieges: [en
            ? `Dividing by the trough (peak/trough − 1): that computes the REQUIRED GAIN of question b), not the drawdown — the base of a percentage move is always the starting point, here the peak.`
            : `Diviser par le creux (pic/creux − 1) : cela calcule le GAIN REQUIS de la question b), pas le drawdown — la base d'une variation en % est toujours le point de départ, ici le pic.`],
        },
        {
          intitule: en ? 'b) The asymmetry: the required gain' : "b) L'asymétrie : le gain requis",
          enonce: en
            ? `Starting from the drawdown of a), what gain is needed to climb from the trough back to the peak, in %?`
            : `À partir du drawdown du a), quel gain faut-il pour remonter du creux au pic, en % ?`,
          reponse: gain, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'Gain = 100/(100 − loss) − 1: convex, and it explodes' : 'Gain = 100/(100 − perte) − 1 : convexe, et ça explose',
            contenu: en
              ? `With the loss as a positive magnitude (${f(r2(-dd), 2)}): 100/(100 − ${f(r2(-dd), 2)}) − 1 gives **${pct(gain, 2)}**. The function is CONVEX — recite the scale: −50% demands +100% (doubling!), −89% (the Dow of 1932) demands +809%, while −22.6% (Black Monday 1987) demands "only" +29.2%. THE most profitable mental-math trap in interviews: always compute the required gain before talking about rebounds.`
              : `Avec la perte en magnitude positive (${f(r2(-dd), 2)}) : 100/(100 − ${f(r2(-dd), 2)}) − 1 donne **${pct(gain, 2)}**. La fonction est CONVEXE — récitez l'échelle : −50 % exige +100 % (doubler !), −89 % (le Dow de 1932) exige +809 %, quand −22,6 % (le lundi noir de 1987) n'exige « que » +29,2 %. LE piège de calcul mental le plus rentable en entretien : calculez toujours le gain requis avant de parler de rebond.`,
          }],
          pieges: [en
            ? `The naive symmetry "+${f(r2(-dd), 2)}% will do": after losing ${pct(r2(-dd), 2)}, a ${pct(r2(-dd), 2)} rebound leaves you at ${f(r2((1 + dd / 100) * (1 - dd / 100) * 100), 2)} for 100 invested — percentage moves multiply, they never cancel by addition.`
            : `La symétrie naïve « +${f(r2(-dd), 2)} % suffira » : après ${pct(r2(-dd), 2)} de perte, un rebond de ${pct(r2(-dd), 2)} laisse à ${f(r2((1 + dd / 100) * (1 - dd / 100) * 100), 2)} pour 100 investis — les variations en % se multiplient, elles ne s'annulent jamais par addition.`],
        },
        {
          intitule: en ? `c) The purgatory clock: years at ${pct(g, 1)}/yr` : `c) L'horloge du purgatoire : les années à ${pct(g, 1)}/an`,
          enonce: en
            ? `At a constant compounded growth of ${pct(g, 1)} per year, how many years to deliver the gain of b)?`
            : `À ${pct(g, 1)} de croissance annuelle composée constante, combien d'années pour réaliser le gain du b) ?`,
          reponse: annees, tolerance: 0.005, unite: en ? 'years' : 'ans',
          etapes: [{
            titre: en ? 'Years = ln(1/(1 − loss))/ln(1 + g)' : 'Années = ln(1/(1 − perte))/ln(1 + g)',
            contenu: en
              ? `ln(1/(1 − ${f(r2(-dd), 2)}/100))/ln(1 + ${f(g, 1)}/100) = **${f(annees, 2)} years**. The module's benchmarks: recovering −50% at 7%/yr takes 10.24 years; −89% at 7%/yr, 32.62 years — the order of magnitude of the Dow's quarter-century (it actually took 25 years, to November 1954, deflation and dividends being slightly kinder than price alone). Kindleberger's "revulsion" lasts a generation for a reason.`
              : `ln(1/(1 − ${f(r2(-dd), 2)}/100))/ln(1 + ${f(g, 1)}/100) = **${f(annees, 2)} ans**. Les étalons du module : récupérer −50 % à 7 %/an prend 10,24 ans ; −89 % à 7 %/an, 32,62 ans — l'ordre de grandeur du quart de siècle du Dow (25 ans en réalité, jusqu'à novembre 1954, la déflation et les dividendes ayant été un peu plus cléments que le prix seul). La « révulsion » de Kindleberger dure une génération pour une raison.`,
          }],
          pieges: [en
            ? `Dividing the gain by the growth (${f(gain, 2)}/${f(g, 1)} = ${f(naifAnnees, 1)} years): compounding works FOR you on the way up — the logarithmic formula, not linear division. Rates compound, always.`
            : `Diviser le gain par la croissance (${f(gain, 2)}/${f(g, 1)} = ${f(naifAnnees, 1)} ans) : la composition travaille POUR vous à la remontée — la formule logarithmique, pas la division linéaire. Les taux se composent, toujours.`],
        },
        {
          intitule: en ? `d) The false rally: +${pct(rebond, 0)} off the trough` : `d) Le faux rebond : +${pct(rebond, 0)} depuis le creux`,
          enonce: en
            ? `Off the trough, the index rallies ${pct(rebond, 0)} — the papers call the alert over. What gain is STILL needed from there to see the peak again, in %?`
            : `Depuis le creux, l'indice rebondit de ${pct(rebond, 0)} — les journaux titrent sur la fin de l'alerte. Quel gain reste-t-il ENCORE à faire pour revoir le pic, en % ?`,
          reponse: gainRestant, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'Chain the level, then re-run the required gain' : 'Chaînez le niveau, puis relancez le gain requis',
            contenu: en
              ? `Level after the rally: ${f(creux, dec)} × (1 + ${f(rebond, 0)}/100) = ${f(niveauRebond, 2)} — still ${pct(ddRestant, 2)} below the peak, so the remaining required gain is 100/(100 − ${f(r2(-ddRestant), 2)}) − 1 = **${pct(gainRestant, 2)}**, against ${pct(gain, 2)} from the trough. History's warning: after November 1929 the market rallied about +48% into April 1930 — the press celebrated — then came the slow grind to 41.22. Violent rallies are the RULE of great bear markets, not a signal that they are over.`
              : `Niveau après le rebond : ${f(creux, dec)} × (1 + ${f(rebond, 0)}/100) = ${f(niveauRebond, 2)} — toujours ${pct(ddRestant, 2)} sous le pic, donc le gain encore requis est 100/(100 − ${f(r2(-ddRestant), 2)}) − 1 = **${pct(gainRestant, 2)}**, contre ${pct(gain, 2)} depuis le creux. L'avertissement de l'histoire : après novembre 1929, le marché a rebondi d'environ +48 % jusqu'en avril 1930 — la presse a célébré — puis est venue la lente descente vers 41,22. Les rebonds violents sont la RÈGLE des grands bear markets, pas le signal de leur fin.`,
          }],
          pieges: [en
            ? `Subtracting (${f(gain, 2)} − ${f(rebond, 0)} = ${f(r2(gain - rebond), 2)}): gains COMPOUND, they do not add — the remaining leg is (1 + total)/(1 + rally) − 1, computed here as ${pct(gainRestant, 2)}.`
            : `Soustraire (${f(gain, 2)} − ${f(rebond, 0)} = ${f(r2(gain - rebond), 2)}) : les gains se COMPOSENT, ils ne s'additionnent pas — la jambe restante est (1 + total)/(1 + rebond) − 1, calculée ici à ${pct(gainRestant, 2)}.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 3. m11-pb-03 — La banque face à la ruée — N1                        */
/* ------------------------------------------------------------------ */
const banqueRuee: ProblemeMoule = {
  id: 'm11-pb-03', moduleId: M11,
  titre: 'La banque face à la ruée : couverture, trou de cash et vente forcée',
  titreEn: 'The bank facing the run: coverage, cash hole and fire sale',
  typeDeCas: 'run bancaire',
  typeDeCasEn: 'bank run',
  difficulte: 1,
  scenarios: ['Une banque de 1931 : pas de FDIC, la ruée est rationnelle', 'Northern Rock, septembre 2007 : le financement de marché meurt le premier', 'Une banque régionale, mars 2023 : le run à la vitesse du smartphone'],
  scenariosEn: ['A bank in 1931: no FDIC, the run is rational', 'Northern Rock, September 2007: market funding dies first', 'A regional bank, March 2023: the run at smartphone speed'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : dépôts, ratio liquide, retraits, décote, fonds propres.
    const cfg = ([
      { depMin: 100, depMax: 200, liqMin: 15, liqMax: 25, retMin: 30, retMax: 45, decMin: 20, decMax: 35, fpMin: 6, fpMax: 10 },
      { depMin: 20, depMax: 30, liqMin: 8, liqMax: 15, retMin: 20, retMax: 30, decMin: 10, decMax: 20, fpMin: 4, fpMax: 7 },
      { depMin: 80, depMax: 120, liqMin: 10, liqMax: 20, retMin: 25, retMax: 40, decMin: 8, decMax: 15, fpMin: 6, fpMax: 9 },
    ] as const)[sIdx];
    const depots = randInt(rng, cfg.depMin, cfg.depMax);
    const liqRatio = randFloat(rng, cfg.liqMin, cfg.liqMax, 1);
    const retrait = randInt(rng, cfg.retMin, cfg.retMax);
    const decote = randInt(rng, cfg.decMin, cfg.decMax);
    const fpRatio = randFloat(rng, cfg.fpMin, cfg.fpMax, 1);
    const liquides = r2((depots * liqRatio) / 100);
    const fp = r2((depots * fpRatio) / 100);
    const couverture = r2(tauxCouvertureDepots(liquides, depots));
    const retraits = r2((depots * retrait) / 100);
    const trou = r2(retraits - liquides);
    const vente = r2(venteForceePourCash(trou, decote));
    const perteSeche = r2(vente - trou);
    const ratioFp = r2((perteSeche / fp) * 100);
    const cashInsuffisant = r2(trou * (1 - decote / 100));

    const { en, f, pct } = outils(langue);
    const dev: Dev = ([
      { fr: 'M\\$', pre: '\\$', suf: 'm' },
      { fr: 'Md£', pre: '£', suf: 'bn' },
      { fr: 'Md\\$', pre: '\\$', suf: 'bn' },
    ] as const)[sIdx];
    const unit = (['M$', 'Md£', 'Md$'] as const)[sIdx];
    const cash = cashFab(en, f, dev);
    const desc = en
      ? `${cash(depots, 0)} of demand deposits, ${cash(liquides, 2)} of same-day liquid assets, ${cash(fp, 2)} of equity; rumour scenario: ${pct(retrait, 0)} of deposits ask to leave, and the emergency liquidation discount on the asset book is ${pct(decote, 0)}`
      : `${cash(depots, 0)} de dépôts exigibles, ${cash(liquides, 2)} d'actifs liquides mobilisables le jour même, ${cash(fp, 2)} de fonds propres ; scénario de rumeur : ${pct(retrait, 0)} des dépôts demandent à partir, et la décote de liquidation d'urgence du portefeuille d'actifs est de ${pct(decote, 0)}`;
    const contexte = (en
      ? [
        `1931, somewhere in the American Midwest. No deposit insurance exists — your neighbour's bank failed last month and his savings are gone, so queuing early is perfectly RATIONAL. The bank's book: ${desc}. Between 1930 and 1933 roughly 9,000 US banks closed and the money supply shrank by a third. Walk the arithmetic of one of them.`,
        `September 2007, United Kingdom. Northern Rock funded a mortgage machine on wholesale markets, and it is that market funding that evaporated FIRST — the queues at the branches, the first UK run since 1866, only certified the death. The balance sheet, stylised: ${desc}. Run the numbers the treasurer ran that week.`,
        `March 2023, US West Coast. No queues this time: the run travels by group chat and banking app — SVB saw \\$42bn asked out in ONE day, about a quarter of its deposits. Your regional bank, stylised: ${desc}. Compute what the smartphone does to a balance sheet.`,
      ]
      : [
        `1931, quelque part dans le Midwest américain. Aucune assurance des dépôts n'existe — la banque du voisin a fermé le mois dernier et ses économies ont disparu, donc arriver tôt au guichet est parfaitement RATIONNEL. Le livre de la banque : ${desc}. De 1930 à 1933, environ 9 000 banques américaines ferment et la masse monétaire fond d'un tiers. Déroulez l'arithmétique de l'une d'elles.`,
        `Septembre 2007, Royaume-Uni. Northern Rock finançait une machine à crédits immobiliers sur les marchés de gros, et c'est ce financement de marché qui s'est évaporé le PREMIER — les files devant les agences, première ruée britannique depuis 1866, n'ont fait que constater le décès. Le bilan, stylisé : ${desc}. Refaites les calculs que le trésorier a faits cette semaine-là.`,
        `Mars 2023, côte Ouest américaine. Pas de files cette fois : la ruée voyage par group chat et application bancaire — SVB a vu 42 Md\\$ demandés en UNE journée, environ un quart de ses dépôts. Votre banque régionale, stylisée : ${desc}. Calculez ce que le smartphone fait à un bilan.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The fatal fraction: the deposit coverage ratio' : 'a) La fraction fatale : le taux de couverture des dépôts',
          enonce: en
            ? `${cash(liquides, 2)} of liquid assets against ${cash(depots, 0)} of demand deposits: coverage ratio, in %?`
            : `${cash(liquides, 2)} d'actifs liquides face à ${cash(depots, 0)} de dépôts exigibles : taux de couverture, en % ?`,
          reponse: couverture, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'Coverage = liquid/deposits × 100 — and it IS the fatal fraction' : "Couverture = liquide/dépôts × 100 — et c'EST la fraction fatale",
            contenu: en
              ? `${f(liquides, 2)}/${f(depots, 0)} × 100 = **${pct(couverture, 2)}**. Read it as a death threshold: if more than ${pct(couverture, 2)} of deposits walk, the same-day cash is gone — whatever the SOLVENCY of the bank. Every deposit is a daily plebiscite (chapter 1), and solvency does not protect from a run: in March 2023 SVB faced a quarter of its deposits in one day — no bank on earth covers that in same-day assets.`
              : `${f(liquides, 2)}/${f(depots, 0)} × 100 = **${pct(couverture, 2)}**. Lisez-le comme un seuil de mort : si plus de ${pct(couverture, 2)} des dépôts partent, le cash du jour est épuisé — quelle que soit la SOLVABILITÉ de la banque. Chaque dépôt est un plébiscite quotidien (chapitre 1), et la solvabilité ne protège pas d'un run : en mars 2023, SVB a affronté un quart de ses dépôts en un jour — aucune banque au monde ne couvre cela en actifs du jour même.`,
          }],
          pieges: [en
            ? `Confusing coverage with solvency: assets can exceed liabilities (solvent) while same-day cash covers only ${pct(couverture, 2)} of deposits. Illiquid is not insolvent — but both die, the chapter's royal distinction.`
            : `Confondre couverture et solvabilité : les actifs peuvent excéder les dettes (solvable) pendant que le cash du jour ne couvre que ${pct(couverture, 2)} des dépôts. Illiquide n'est pas insolvable — mais les deux meurent, la distinction reine du chapitre.`],
        },
        {
          intitule: en ? `b) The rumour: ${pct(retrait, 0)} of deposits at the door` : `b) La rumeur : ${pct(retrait, 0)} des dépôts à la porte`,
          enonce: en
            ? `${pct(retrait, 0)} of deposits ask out — more than the coverage of a). Once the liquid assets are exhausted, how much cash is MISSING, in ${unit}?`
            : `${pct(retrait, 0)} des dépôts demandent à sortir — plus que la couverture du a). Une fois les actifs liquides épuisés, combien de cash MANQUE-t-il, en ${unit} ?`,
          reponse: trou, tolerance: 0.005, unite: unit,
          etapes: [{
            titre: en ? 'Hole = withdrawals − liquid assets' : 'Trou = retraits − actifs liquides',
            contenu: en
              ? `Withdrawals = ${pct(retrait, 0)} × ${f(depots, 0)} = ${cash(retraits, 2)}; hole = ${f(retraits, 2)} − ${f(liquides, 2)} = **${cash(trou, 2)}**, to be found TODAY. This is where 1930-33 was decided: the Fed, created in 1913 precisely to lend into this hole, let roughly 9,000 banks die — and the FDIC of 1933 solved it the other way, by making the run pointless: a guaranteed deposit has no reason to queue. An institution that kills a panic equilibrium without spending a dollar in normal times.`
              : `Retraits = ${pct(retrait, 0)} × ${f(depots, 0)} = ${cash(retraits, 2)} ; trou = ${f(retraits, 2)} − ${f(liquides, 2)} = **${cash(trou, 2)}**, à trouver AUJOURD'HUI. C'est ici que 1930-33 s'est joué : la Fed, créée en 1913 précisément pour prêter dans ce trou, a laissé mourir environ 9 000 banques — et la FDIC de 1933 l'a résolu par l'autre bout, en rendant la ruée inutile : un dépôt garanti n'a aucune raison de faire la queue. Une institution qui supprime un équilibre de panique sans dépenser un dollar en temps normal.`,
          }],
          pieges: [en
            ? `Comparing ${pct(retrait, 0)} to 100% ("plenty of assets overall"): the right comparator is the coverage of a), ${pct(couverture, 2)} — the run is a race against same-day cash, not against the balance-sheet total.`
            : `Comparer ${pct(retrait, 0)} à 100 % (« il y a largement assez d'actifs au total ») : le bon comparateur est la couverture du a), ${pct(couverture, 2)} — la ruée est une course contre le cash du jour, pas contre le total du bilan.`],
        },
        {
          intitule: en ? 'c) Selling to survive: the fire sale' : 'c) Vendre pour survivre : la vente forcée',
          enonce: en
            ? `To raise the missing cash of b) today, the bank sells assets at a ${pct(decote, 0)} liquidation discount. What pre-discount market value must it sell, in ${unit}?`
            : `Pour lever aujourd'hui le cash manquant du b), la banque vend des actifs sous une décote de liquidation de ${pct(decote, 0)}. Quelle valeur de marché pré-décote faut-il vendre, en ${unit} ?`,
          reponse: vente, tolerance: 0.005, unite: unit,
          etapes: [{
            titre: en ? 'Sale = need/(1 − d): the discount forces overselling' : 'Vente = besoin/(1 − d) : la décote force à survendre',
            contenu: en
              ? `${f(trou, 2)}/(1 − ${f(decote, 0)}/100) = **${cash(vente, 2)}** — more than the need, because each unit sold only brings 1 − d of cash. This is the engine of the chapter-1 spiral: selling depresses prices, the discount widens, more must be sold — 1987 (portfolio insurance), 2008 (CDOs), 2022 (gilts), the same loop under three costumes.`
              : `${f(trou, 2)}/(1 − ${f(decote, 0)}/100) = **${cash(vente, 2)}** — plus que le besoin, car chaque unité vendue ne rapporte que 1 − d de cash. C'est le moteur de la spirale du chapitre 1 : vendre déprime les prix, la décote s'élargit, il faut vendre davantage — 1987 (assurance de portefeuille), 2008 (CDO), 2022 (gilts), la même boucle sous trois costumes.`,
          }],
          pieges: [en
            ? `Selling exactly ${cash(trou, 2)}: under the ${pct(decote, 0)} discount that only raises ${cash(cashInsuffisant, 2)} of cash — the hole is not filled. Divide by (1 − d), never multiply.`
            : `Vendre exactement ${cash(trou, 2)} : sous la décote de ${pct(decote, 0)}, cela ne rapporte que ${cash(cashInsuffisant, 2)} de cash — le trou n'est pas comblé. On divise par (1 − d), on ne multiplie jamais.`],
        },
        {
          intitule: en ? 'd) The bill: the discount against the equity' : "d) L'addition : la décote contre les fonds propres",
          enonce: en
            ? `The discount paid on the sale of c) is a dead loss. With ${cash(fp, 2)} of equity, what fraction of the equity does this single day of run consume, in %?`
            : `La décote payée sur la vente du c) est une perte sèche. Avec ${cash(fp, 2)} de fonds propres, quelle fraction des fonds propres cette seule journée de ruée consume-t-elle, en % ?`,
          reponse: ratioFp, tolerance: 0.005, unite: '%',
          etapes: [
            {
              titre: en ? 'Dead loss = sale − need, then divide by equity' : 'Perte sèche = vente − besoin, puis divisez par les fonds propres',
              contenu: en
                ? `Dead loss = ${f(vente, 2)} − ${f(trou, 2)} = ${cash(perteSeche, 2)}; against equity: ${f(perteSeche, 2)}/${f(fp, 2)} × 100 = **${pct(ratioFp, 2)}**. ${ratioFp >= 100 ? 'More than the whole equity: the bank, perhaps solvent this morning, is insolvent tonight — killed by the proof it was asked to give.' : 'A large bite in one day — and the run is rarely over in one day.'}`
                : `Perte sèche = ${f(vente, 2)} − ${f(trou, 2)} = ${cash(perteSeche, 2)} ; contre les fonds propres : ${f(perteSeche, 2)}/${f(fp, 2)} × 100 = **${pct(ratioFp, 2)}**. ${ratioFp >= 100 ? "Plus que la totalité des fonds propres : la banque, peut-être solvable ce matin, est insolvable ce soir — tuée par la preuve qu'on lui demandait de fournir." : "Une morsure énorme en un jour — et une ruée s'arrête rarement en un jour."}`,
            },
            {
              titre: en ? 'Bagehot, or why the fireman exists' : 'Bagehot, ou pourquoi le pompier existe',
              contenu: en
                ? `This is the exact circle Bagehot's 1873 doctrine breaks: forced to sell at a discount to prove its liquidity, a SOLVENT bank BECOMES insolvent. Hence: lend widely, at a penalty rate, against good collateral — so the illiquid survive without subsidising the insolvent. Northern Rock's queues were the certificate, not the cause: its wholesale funding had evaporated first, and the Bank of England's guarantee came after the images had done their work.`
                : `C'est le cercle exact que la doctrine de Bagehot (1873) casse : forcée de vendre sous décote pour prouver sa liquidité, une banque SOLVABLE DEVIENT insolvable. D'où : prêter largement, à taux de pénalité, contre bon collatéral — pour que les illiquides survivent sans subventionner les insolvables. Les files de Northern Rock étaient le constat, pas la cause : son financement de gros s'était évaporé d'abord, et la garantie de la Banque d'Angleterre est arrivée après que les images avaient fait leur œuvre.`,
            },
          ],
          pieges: [en
            ? `"No loss, the assets were sold at their price": the ${pct(decote, 0)} discount is the price of IMMEDIACY — it is precisely what converts a liquidity problem into a solvency hole. That conversion is the whole tragedy of runs.`
            : `« Pas de perte, les actifs ont été vendus à leur prix » : la décote de ${pct(decote, 0)} est le prix de l'IMMÉDIATETÉ — c'est précisément elle qui convertit un problème de liquidité en trou de solvabilité. Cette conversion est toute la tragédie des ruées.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 4. m11-pb-04 — L'État sous les spreads — N1                         */
/* ------------------------------------------------------------------ */
const etatSpreads: ProblemeMoule = {
  id: 'm11-pb-04', moduleId: M11,
  titre: "L'État sous les spreads : la charge, la hausse et la ligne rouge",
  typeDeCas: 'dette souveraine',
  titreEn: 'The State under the spreads: the burden, the hike and the red line',
  typeDeCasEn: 'sovereign debt',
  difficulte: 1,
  scenarios: ['Un pays du Sud de la zone euro, automne 2011 : la doom loop se referme', 'Un émergent endetté en devise étrangère : le péché originel', "Le pays « vertueux » : la même arithmétique, lue à l'envers"],
  scenariosEn: ['A southern euro-area country, autumn 2011: the doom loop closes in', 'An emerging country indebted in foreign currency: the original sin', 'The "virtuous" country: the same arithmetic, read in reverse'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : dette/PIB, taux moyen, hausse, taux de référence, seuil politique.
    const cfg = ([
      { dMin: 120, dMax: 180, tMin: 4, tMax: 6, hMin: 1.5, hMax: 3, rMin: 1.5, rMax: 2.5, sMin: 8, sMax: 12 },
      { dMin: 50, dMax: 90, tMin: 6, tMax: 10, hMin: 2, hMax: 4, rMin: 3, rMax: 5, sMin: 6, sMax: 9 },
      { dMin: 60, dMax: 90, tMin: 1, tMax: 2.5, hMin: 0.5, hMax: 1.5, rMin: 1.5, rMax: 2.5, sMin: 3, sMax: 5 },
    ] as const)[sIdx];
    const dettePib = randInt(rng, cfg.dMin, cfg.dMax);
    const taux = randFloat(rng, cfg.tMin, cfg.tMax, 1);
    const hausse = randFloat(rng, cfg.hMin, cfg.hMax, 1);
    const ref = randFloat(rng, cfg.rMin, cfg.rMax, 1);
    const seuil = randInt(rng, cfg.sMin, cfg.sMax);
    const charge1 = r2(chargeInteretsDette(dettePib, taux));
    const taux2 = r2(taux + hausse);
    const charge2 = r2(chargeInteretsDette(dettePib, taux2));
    const surcout = r2(charge2 - charge1);
    const spread = r2(spreadSouverainPb(taux2, ref));
    const tauxPlafond = r2((100 * seuil) / dettePib);
    const margeRestante = r2(tauxPlafond - taux2);

    const { en, f, pct } = outils(langue);
    const desc = en
      ? `debt at ${pct(dettePib, 0)} of GDP, average rate paid on the stock ${pct(taux, 1)}; the market now reprices the country ${pct(hausse, 1)} point(s) higher; risk-free reference (Bund/Treasury) at ${pct(ref, 1)}; political red line: debt service below ${pct(seuil, 0)} of GDP`
      : `dette à ${pct(dettePib, 0)} du PIB, taux moyen payé sur le stock ${pct(taux, 1)} ; le marché reprice désormais le pays ${pct(hausse, 1)} point(s) plus haut ; référence sans risque (Bund/Treasury) à ${pct(ref, 1)} ; ligne rouge politique : un service de la dette sous ${pct(seuil, 0)} du PIB`;
    const contexte = (en
      ? [
        `Autumn 2011. The Greek deficit revision of October 2009 (announced ~6%, revised to 12.7%, final 15.4%) has taught markets that sovereign numbers can lie, and the contagion now works down the list of weak links. Your southern country: ${desc}. The debt agency runs the doom-loop arithmetic: burden, burden after the repricing, spread — and the ceiling rate the budget can bear.`,
        `An emerging economy borrowed in a currency it does not print — the original sin, the same position De Grauwe diagnosed for euro members: default by simple ILLIQUIDITY becomes possible. The file: ${desc}. Same worksheet, higher stakes: the rollover date is a referendum the country cannot lose.`,
        `The "virtuous" counter-example, for contrast: ${desc}. The same four computations — and the same formula that hurts at 180% of GDP barely tickles here: sustainability is the PRODUCT of two numbers, and this country keeps both small. Run it to see why the market forgives it everything.`,
      ]
      : [
        `Automne 2011. La révision grecque d'octobre 2009 (annoncé ~6 %, révisé à 12,7 %, final 15,4 %) a appris aux marchés que les chiffres souverains peuvent mentir, et la contagion descend maintenant la liste des maillons faibles. Votre pays du Sud : ${desc}. L'agence de la dette déroule l'arithmétique de la doom loop : charge, charge après le repricing, spread — et le taux plafond que le budget supporte.`,
        `Un émergent a emprunté dans une monnaie qu'il n'imprime pas — le péché originel, la position même que De Grauwe a diagnostiquée pour les membres de l'euro : le défaut par simple ILLIQUIDITÉ devient possible. Le dossier : ${desc}. Même feuille de calcul, enjeu supérieur : la date de refinancement est un référendum que le pays n'a pas le droit de perdre.`,
        `Le contre-exemple « vertueux », pour le contraste : ${desc}. Les quatre mêmes calculs — et la même formule qui fait mal à 180 % du PIB chatouille à peine ici : la soutenabilité est le PRODUIT de deux nombres, et ce pays garde les deux petits. Déroulez pour voir pourquoi le marché lui pardonne tout.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? 'a) The starting burden' : 'a) La charge de départ',
          enonce: en
            ? `Debt at ${pct(dettePib, 0)} of GDP, average rate ${pct(taux, 1)}: interest burden, in % of GDP?`
            : `Dette à ${pct(dettePib, 0)} du PIB, taux moyen ${pct(taux, 1)} : charge d'intérêts, en % du PIB ?`,
          reponse: charge1, tolerance: 0.005, unite: en ? '% of GDP' : '% du PIB',
          etapes: [{
            titre: en ? 'Burden = (debt/GDP) × rate / 100' : 'Charge = (dette/PIB) × taux / 100',
            contenu: en
              ? `${f(dettePib, 0)} × ${f(taux, 1)}/100 = **${pct(charge1, 2)} of GDP**, before the first euro of schools or hospitals. The module's benchmark: Greece 2011 at 180% of GDP — each point of rate costs 1.8 points of GDP, so 5% of average rate means 9% of GDP in debt service alone. The same 120% of debt under QE at 1.5% costs 1.8: the same stock, sustainable or not, depending on one number.`
              : `${f(dettePib, 0)} × ${f(taux, 1)}/100 = **${pct(charge1, 2)} du PIB**, avant le premier euro d'école ou d'hôpital. L'étalon du module : la Grèce 2011 à 180 % du PIB — chaque point de taux coûte 1,8 point de PIB, donc 5 % de taux moyen font 9 % du PIB de seul service de la dette. Les mêmes 120 % de dette sous QE à 1,5 % coûtent 1,8 : le même stock, soutenable ou pas, selon un seul nombre.`,
          }],
          pieges: [en
            ? `Confusing the AVERAGE rate on the stock with the market rate on new issues: the stock refinances slowly, which is what gives a country time — the market rate becomes the average rate one auction at a time.`
            : `Confondre le taux MOYEN du stock avec le taux de marché des nouvelles émissions : le stock se refinance lentement, c'est ce qui donne du temps au pays — le taux de marché devient le taux moyen une adjudication à la fois.`],
        },
        {
          intitule: en ? `b) The repricing: +${pct(hausse, 1)} point(s)` : `b) Le repricing : +${pct(hausse, 1)} point(s)`,
          enonce: en
            ? `Refinancing eventually drags the average rate to ${pct(taux2, 1)}. New burden, in % of GDP?`
            : `Le refinancement porte à terme le taux moyen à ${pct(taux2, 1)}. Nouvelle charge, en % du PIB ?`,
          reponse: charge2, tolerance: 0.005, unite: en ? '% of GDP' : '% du PIB',
          etapes: [{
            titre: en ? 'Same formula, and read the increment' : 'Même formule, et lisez le surcoût',
            contenu: en
              ? `${f(dettePib, 0)} × ${f(taux2, 1)}/100 = **${pct(charge2, 2)} of GDP** — an extra ${f(surcout, 2)} points of GDP versus a), i.e. debt/100 = ${f(r2(dettePib / 100), 2)} point(s) of GDP per point of rate. That multiplier is the arithmetic of unsustainability, and it feeds the self-fulfilling prophecy: rates rise → the burden rises → solvency worsens → rates rise. You have seen this loop on banks (chapter 1) and on haircuts (chapter 5); here it wears a flag.`
              : `${f(dettePib, 0)} × ${f(taux2, 1)}/100 = **${pct(charge2, 2)} du PIB** — ${f(surcout, 2)} points de PIB de plus qu'au a), soit dette/100 = ${f(r2(dettePib / 100), 2)} point(s) de PIB par point de taux. Ce multiplicateur est l'arithmétique de l'insoutenabilité, et il nourrit la prophétie auto-réalisatrice : les taux montent → la charge monte → la solvabilité se dégrade → les taux montent. Vous avez vu cette boucle sur les banques (chapitre 1) et sur les haircuts (chapitre 5) ; ici elle porte un drapeau.`,
          }],
          pieges: [en
            ? `Adding ${pct(hausse, 1)} directly to the burden of a): the increment is ${f(hausse, 1)} × ${f(dettePib, 0)}/100 = ${f(surcout, 2)} points of GDP — the debt LEVEL is the multiplier, which is why 500 bp mean nothing to one country and a regime change to another.`
            : `Additionner ${pct(hausse, 1)} directement à la charge du a) : le surcoût est ${f(hausse, 1)} × ${f(dettePib, 0)}/100 = ${f(surcout, 2)} points de PIB — le NIVEAU de dette est le multiplicateur, et c'est pourquoi 500 pb ne sont rien pour un pays et un changement de régime pour un autre.`],
        },
        {
          intitule: en ? 'c) The thermometer: the spread in basis points' : 'c) Le thermomètre : le spread en points de base',
          enonce: en
            ? `The risk-free reference trades at ${pct(ref, 1)}. At ${pct(taux2, 1)}, what spread does the country pay, in basis points?`
            : `La référence sans risque cote ${pct(ref, 1)}. À ${pct(taux2, 1)}, quel spread le pays paie-t-il, en points de base ?`,
          reponse: spread, tolerance: 1, toleranceMode: 'absolu', unite: 'pb',
          etapes: [{
            titre: en ? 'Spread = (rate − reference) × 100' : 'Spread = (taux − référence) × 100',
            contenu: en
              ? `(${f(taux2, 1)} − ${f(ref, 1)}) × 100 = **${f(spread, 0)} bp**. ${spread < 0 ? 'Negative: the country borrows CHEAPER than the reference — the safe-haven privilege, the flight-to-quality money of others\' crises.' : 'The scale to recite: the French OAT lives at 30-60 bp over the Bund; Italy crossed 500 bp in autumn 2011; Greece in March 2012, a 10-year above 35% against a 1.5% Bund, printed 3,350 bp — at those levels the rate no longer prices a risk, it IS the anticipated default.'}`
              : `(${f(taux2, 1)} − ${f(ref, 1)}) × 100 = **${f(spread, 0)} pb**. ${spread < 0 ? "Négatif : le pays emprunte MOINS CHER que la référence — le privilège du refuge, l'argent du flight-to-quality des crises des autres." : "L'échelle à réciter : l'OAT française vit à 30-60 pb au-dessus du Bund ; l'Italie a franchi 500 pb à l'automne 2011 ; la Grèce en mars 2012, un 10 ans au-dessus de 35 % contre un Bund à 1,5 %, cotait 3 350 pb — à ces niveaux le taux ne price plus un risque, il EST le défaut anticipé."}`,
          }],
          pieges: [en
            ? `Forgetting the ×100 (answering ${f(r2(taux2 - ref), 2)} "points"): sovereign spreads are quoted in BASIS points — 100 bp = 1 percentage point, the bond-desk convention of module 4.`
            : `Oublier le ×100 (répondre ${f(r2(taux2 - ref), 2)} « points ») : les spreads souverains se cotent en points de BASE — 100 pb = 1 point de pourcentage, la convention obligataire du module 4.`],
        },
        {
          intitule: en ? `d) The red line: holding under ${pct(seuil, 0)} of GDP` : `d) La ligne rouge : tenir sous ${pct(seuil, 0)} du PIB`,
          enonce: en
            ? `The finance minister draws the line: debt service must stay below ${pct(seuil, 0)} of GDP. Up to what average rate does the country hold, in %?`
            : `Le ministre trace la ligne : le service de la dette ne doit pas dépasser ${pct(seuil, 0)} du PIB. Jusqu'à quel taux moyen le pays tient-il, en % ?`,
          reponse: tauxPlafond, tolerance: 0.005, unite: '%',
          etapes: [
            {
              titre: en ? 'The burden formula, read backwards' : "La formule de la charge, lue à l'envers",
              contenu: en
                ? `Ceiling rate = ${f(seuil, 0)} × 100/${f(dettePib, 0)} = **${pct(tauxPlafond, 2)}**. ${taux2 > tauxPlafond ? `The market, at ${pct(taux2, 1)}, is ALREADY beyond the line: without a lender of last resort in its own currency, the loop closes by itself. That is the hole the OMT of 2012 filled — "whatever it takes" institutionalised, spreads down several hundred basis points without one euro spent: against a self-fulfilling panic, the best money is the money never spent.` : `The market at ${pct(taux2, 1)} leaves ${f(margeRestante, 2)} point(s) of margin — comfortable today, but the loop eats margins fast: watch the spread of c), it moves first.`}`
                : `Taux plafond = ${f(seuil, 0)} × 100/${f(dettePib, 0)} = **${pct(tauxPlafond, 2)}**. ${taux2 > tauxPlafond ? `Le marché, à ${pct(taux2, 1)}, est DÉJÀ au-delà de la ligne : sans prêteur en dernier ressort dans sa propre monnaie, la boucle se referme toute seule. C'est le trou que l'OMT de 2012 a comblé — le « whatever it takes » institutionnalisé, des spreads en baisse de plusieurs centaines de points de base sans un euro dépensé : contre une panique auto-réalisatrice, le meilleur argent est celui qu'on ne dépense pas.` : `Le marché à ${pct(taux2, 1)} laisse ${f(margeRestante, 2)} point(s) de marge — confortable aujourd'hui, mais la boucle mange les marges vite : surveillez le spread du c), c'est lui qui bouge en premier.`}`,
            },
          ],
          pieges: [en
            ? `Treating the debt ratio as a constant: austerity that crushes GDP degrades the very ratio it claims to fix — the IMF admitted in 2013 it had underestimated fiscal multipliers, after a Greek GDP down about 25% between 2008 and 2013. A rescue plan can be arithmetically coherent and economically self-defeating.`
            : `Traiter le ratio de dette comme une constante : l'austérité qui écrase le PIB dégrade le ratio même qu'elle prétend redresser — le FMI a reconnu en 2013 avoir sous-estimé les multiplicateurs budgétaires, après un PIB grec en baisse d'environ 25 % entre 2008 et 2013. Un plan de sauvetage peut être arithmétiquement cohérent et économiquement auto-défaisant.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 5. m11-pb-05 — Le fonds levié dans la tempête — N2                  */
/* ------------------------------------------------------------------ */
const fondsLevie: ProblemeMoule = {
  id: 'm11-pb-05', moduleId: M11,
  titre: 'Le fonds levié dans la tempête : choc, vente forcée, spirale',
  titreEn: 'The leveraged fund in the storm: shock, fire sale, spiral',
  typeDeCas: 'spirale de désendettement',
  typeDeCasEn: 'deleveraging spiral',
  difficulte: 2,
  scenarios: ['Un fonds LDI, 27 septembre 2022 : solvable, illiquide, presque mort', 'Un hedge fund de convergence, septembre 1998 : le levier 25 rencontre les queues épaisses', "Un prop desk, 19 octobre 1987 : l'assurance de portefeuille des autres"],
  scenariosEn: ['An LDI fund, September 27, 2022: solvent, illiquid, nearly dead', 'A convergence hedge fund, September 1998: leverage 25 meets the fat tails', "A prop desk, October 19, 1987: other people's portfolio insurance"],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : fonds propres, levier initial (= cible), choc, décote.
    // Les bornes garantissent λ·d < 1 (hors zone de mort) et S < A1 (vente possible).
    const cfg = ([
      { eMin: 1, eMax: 3, eDec: 1, lMin: 3, lMax: 5, cMin: 5, cMax: 10, dMin: 2, dMax: 5 },
      { eMin: 3, eMax: 5, eDec: 1, lMin: 20, lMax: 26, cMin: 1.0, cMax: 1.7, dMin: 1, dMax: 2 },
      { eMin: 50, eMax: 200, eDec: 0, lMin: 8, lMax: 12, cMin: 2.5, cMax: 4, dMin: 1.5, dMax: 3 },
    ] as const)[sIdx];
    const e0 = cfg.eDec === 0 ? randInt(rng, cfg.eMin, cfg.eMax) : randFloat(rng, cfg.eMin, cfg.eMax, 1);
    const levier = randInt(rng, cfg.lMin, cfg.lMax);
    const choc = randFloat(rng, cfg.cMin, cfg.cMax, 1);
    const decote = randFloat(rng, cfg.dMin, cfg.dMax, 1);
    const a0 = r2(e0 * levier);
    const dette = r2(a0 - e0);
    const impact = r2(impactLevierSurFondsPropres(levier, -choc));
    const fatal = r2(variationActifsFatale(levier));
    const e1 = r2(e0 * (1 + impact / 100));
    const a1 = r2(a0 * (1 - choc / 100));
    const levApres = r2(levierBilan(a1, e1));
    const vente = r2(venteForceePourLevierCible(a1, e1, levier, decote));
    const excesApparent = r2(a1 - levier * e1);
    const denom = r2(1 - (levier * decote) / 100);
    const e2 = r2(e1 - (vente * decote) / 100);
    const a2 = r2(a1 - vente);
    const levierFinal = r2(levierBilan(a2, e2));
    const perteChoc = r2(e0 - e1);
    const perteSpirale = r2(e1 - e2);
    const bilanReduit = r2((1 - a2 / a0) * 100);
    const fpAmputes = r2((1 - e2 / e0) * 100);

    const { en, f, pct } = outils(langue);
    const dev: Dev = ([
      { fr: 'Md£', pre: '£', suf: 'bn' },
      { fr: 'Md\\$', pre: '\\$', suf: 'bn' },
      { fr: 'M\\$', pre: '\\$', suf: 'm' },
    ] as const)[sIdx];
    const unit = (['Md£', 'Md$', 'M$'] as const)[sIdx];
    const cash = cashFab(en, f, dev);
    const desc = en
      ? `equity ${cash(e0, 2)}, leverage ${f(levier, 0)} (assets ${cash(a0, 2)}, debt ${cash(dette, 2)}); shock on assets: ${pct(choc, 1)} down; liquidation discount if forced to sell: ${pct(decote, 1)}; the lender demands a return to the initial leverage of ${f(levier, 0)}`
      : `fonds propres ${cash(e0, 2)}, levier ${f(levier, 0)} (actifs ${cash(a0, 2)}, dette ${cash(dette, 2)}) ; choc sur les actifs : ${pct(choc, 1)} de baisse ; décote de liquidation en cas de vente forcée : ${pct(decote, 1)} ; le prêteur exige le retour au levier initial de ${f(levier, 0)}`;
    const contexte = (en
      ? [
        `September 27, 2022. The Truss mini-budget (about £45bn of unfunded tax cuts) has sent the 30-year gilt up +130 bp in three sessions, and your LDI fund — gilts levered through swaps and repo to hedge pension liabilities — faces the margin calls of the decade: ${desc}. The cruel irony: rising rates IMPROVE its economic solvency (liabilities deflate), yet it may die of Tuesday's margin. Walk the spiral leg by leg.`,
        `September 1998. Convergence trades priced for a calm world, negotiated haircuts near zero, and Russia has just defaulted: ${desc}. LTCM carried over \\$125bn of assets on less than \\$5bn of capital — leverage around 25, where the fatal shock is only −4%. Your fund is the same animal, one size down; redo the arithmetic its risk committee did that week.`,
        `Monday October 19, 1987, late afternoon. The Dow has lost 22.6% in one session — portfolio insurance sold mechanically into the fall, all together: ${desc}. Your prop desk survived the day; now the credit officer calls about the leverage. Compute what surviving costs.`,
      ]
      : [
        `27 septembre 2022. Le mini-budget Truss (environ 45 Md£ de baisses d'impôts non financées) a fait bondir le gilt 30 ans de +130 pb en trois séances, et votre fonds LDI — des gilts leviérés par swaps et repo pour couvrir des engagements de retraite — affronte les appels de marge de la décennie : ${desc}. L'ironie cruelle : la hausse des taux AMÉLIORE sa solvabilité économique (les engagements dégonflent), et il peut pourtant mourir de la marge du mardi. Déroulez la spirale jambe par jambe.`,
        `Septembre 1998. Des trades de convergence calibrés pour un monde calme, des haircuts négociés quasi nuls, et la Russie vient de faire défaut : ${desc}. LTCM portait plus de 125 Md\\$ d'actifs sur moins de 5 Md\\$ de capital — un levier d'environ 25, où le choc fatal n'est que −4 %. Votre fonds est le même animal, une taille en dessous ; refaites l'arithmétique que son comité des risques a faite cette semaine-là.`,
        `Lundi 19 octobre 1987, fin d'après-midi. Le Dow a perdu 22,6 % en une séance — l'assurance de portefeuille a vendu mécaniquement dans la baisse, toutes ensemble : ${desc}. Votre prop desk a survécu à la journée ; maintenant le responsable crédit appelle au sujet du levier. Calculez ce que survivre coûte.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? `a) The shock: equity after ${pct(choc, 1)} on the assets` : `a) Le choc : les fonds propres après ${pct(choc, 1)} d'actifs`,
          enonce: en
            ? `The assets drop ${pct(choc, 1)}. What is the equity after the shock, in ${unit}?`
            : `Les actifs baissent de ${pct(choc, 1)}. Que valent les fonds propres après le choc, en ${unit} ?`,
          reponse: e1, tolerance: 0.005, unite: unit,
          etapes: [{
            titre: en ? 'ΔEquity% = leverage × Δassets%, then apply to the stake' : 'ΔFP % = levier × Δactifs %, puis appliquez à la mise',
            contenu: en
              ? `ΔEquity = ${f(levier, 0)} × (${f(-choc, 1)}) = ${pct(impact, 2)}, so E = ${f(e0, 2)} × (1 + ${f(impact, 2)}/100) = **${cash(e1, 2)}** (assets: ${cash(a1, 2)}). Note the distance to death: the fatal shock at leverage ${f(levier, 0)} is ${pct(fatal, 2)} — the fund survived, but its leverage has mechanically RISEN to ${f(levApres, 2)}, at the worst possible moment: equity melts faster than assets.`
              : `ΔFP = ${f(levier, 0)} × (${f(-choc, 1)}) = ${pct(impact, 2)}, donc E = ${f(e0, 2)} × (1 + ${f(impact, 2)}/100) = **${cash(e1, 2)}** (actifs : ${cash(a1, 2)}). Notez la distance à la mort : le choc fatal au levier ${f(levier, 0)} est ${pct(fatal, 2)} — le fonds a survécu, mais son levier est mécaniquement MONTÉ à ${f(levApres, 2)}, au pire moment : les fonds propres fondent plus vite que les actifs.`,
          }],
          pieges: [en
            ? `Applying ${pct(choc, 1)} to the equity: the ${cash(dette, 2)} of debt does not share the loss — equity absorbs the WHOLE asset move, multiplied by the leverage of ${f(levier, 0)}.`
            : `Appliquer ${pct(choc, 1)} aux fonds propres : la dette de ${cash(dette, 2)} ne partage pas la perte — les fonds propres absorbent TOUTE la variation d'actifs, multipliée par le levier de ${f(levier, 0)}.`],
        },
        {
          intitule: en ? 'b) The forced sale: how much must go' : 'b) La vente forcée : combien il faut vendre',
          enonce: en
            ? `The lender demands a return to leverage ${f(levier, 0)}. Selling costs ${pct(decote, 1)} of dead-loss discount on every unit sold. What market value S must be sold, in ${unit}?`
            : `Le prêteur exige le retour au levier ${f(levier, 0)}. Vendre coûte ${pct(decote, 1)} de décote en perte sèche sur chaque unité vendue. Quelle valeur de marché S faut-il vendre, en ${unit} ?`,
          reponse: vente, tolerance: 0.005, unite: unit,
          etapes: [
            {
              titre: en ? 'S = (A − λE)/(1 − λd): the chapter-1 formula' : 'S = (A − λE)/(1 − λd) : la formule du chapitre 1',
              contenu: en
                ? `Selling S brings S(1 − d) of cash to repay debt and costs S·d of equity, and we impose A − S = λ(E − S·d), hence $S = \\frac{A - \\lambda E}{1 - \\lambda d}$ = (${f(a1, 2)} − ${f(levier, 0)} × ${f(e1, 2)})/(1 − ${f(levier, 0)} × ${f(decote, 1)}/100) = ${f(excesApparent, 2)}/${f(denom, 2)} = **${cash(vente, 2)}**.`
                : `Vendre S rapporte S(1 − d) de cash pour rembourser la dette et coûte S·d de fonds propres, et l'on impose A − S = λ(E − S·d), d'où $S = \\frac{A - \\lambda E}{1 - \\lambda d}$ = (${f(a1, 2)} − ${f(levier, 0)} × ${f(e1, 2)})/(1 − ${f(levier, 0)} × ${f(decote, 1)}/100) = ${f(excesApparent, 2)}/${f(denom, 2)} = **${cash(vente, 2)}**.`,
            },
            {
              titre: en ? 'Read the denominator: the death zone' : 'Lisez le dénominateur : la zone de mort',
              contenu: en
                ? `The numerator is the apparent asset excess (${cash(excesApparent, 2)}), but the denominator ${f(denom, 2)} AMPLIFIES the sale. If λ·d ≥ 1, it vanishes or flips sign: every unit sold destroys more equity than it removes leverage — selling no longer deleverages, only rescue or bankruptcy remain. That was precisely LTCM in September 1998 and the LDI funds in September 2022 — and why the effective fireman does not buy the whole market: it only needs to CRUSH the discount d (the BoE bought for 13 business days, about £19bn used, and the spiral died in hours).`
                : `Le numérateur est l'excès d'actifs apparent (${cash(excesApparent, 2)}), mais le dénominateur ${f(denom, 2)} AMPLIFIE la vente. Si λ·d ≥ 1, il s'annule ou change de signe : chaque unité vendue détruit plus de fonds propres qu'elle ne réduit le levier — vendre ne désendette plus, il ne reste que le sauvetage ou la faillite. C'était très exactement LTCM en septembre 1998 et les fonds LDI en septembre 2022 — et pourquoi le pompier efficace n'achète pas tout le marché : il lui suffit d'ÉCRASER la décote d (la BoE a acheté pendant 13 jours ouvrés, environ 19 Md£ utilisés, et la spirale est morte en heures).`,
            },
          ],
          pieges: [en
            ? `Selling only the apparent excess ${cash(excesApparent, 2)}: each unit sold burns ${pct(decote, 1)} of equity, which raises the very leverage you are lowering — hence the division by ${f(denom, 2)}.`
            : `Ne vendre que l'excès apparent ${cash(excesApparent, 2)} : chaque unité vendue brûle ${pct(decote, 1)} de fonds propres, ce qui relève le levier même qu'on essaie de baisser — d'où la division par ${f(denom, 2)}.`],
        },
        {
          intitule: en ? 'c) Equity after the sale: the spiral bill' : "c) Les fonds propres après la vente : l'addition de la spirale",
          enonce: en
            ? `The discount is a dead loss. After selling the S of b), what is the equity, in ${unit}?`
            : `La décote est une perte sèche. Après la vente S du b), que valent les fonds propres, en ${unit} ?`,
          reponse: e2, tolerance: 0.005, unite: unit,
          etapes: [{
            titre: en ? 'E after = E − S × d' : 'E après = E − S × d',
            contenu: en
              ? `${f(e1, 2)} − ${f(vente, 2)} × ${f(decote, 1)}/100 = **${cash(e2, 2)}**. Split the day's damage: the SHOCK took ${cash(perteChoc, 2)}, the forced deleveraging took ${cash(perteSpirale, 2)} MORE — the spiral kills what the shock had spared. And this loss went to nobody but the distressed buyers: the discount is a pure transfer to those who hold cash when cash is king.`
              : `${f(e1, 2)} − ${f(vente, 2)} × ${f(decote, 1)}/100 = **${cash(e2, 2)}**. Décomposez les dégâts du jour : le CHOC a pris ${cash(perteChoc, 2)}, le désendettement forcé a pris ${cash(perteSpirale, 2)} DE PLUS — la spirale tue ce que le choc avait épargné. Et cette perte n'est allée à personne d'autre qu'aux acheteurs de détresse : la décote est un transfert pur vers ceux qui tiennent du cash quand le cash est roi.`,
          }],
          pieges: [en
            ? `"No loss when selling at market": the fund sells UNDER the market — the ${pct(decote, 1)} × ${f(vente, 2)} = ${cash(perteSpirale, 2)} of discount is definitive, realised, and inflicted by the urgency itself.`
            : `« Pas de perte quand on vend au prix du marché » : le fonds vend SOUS le marché — la décote de ${pct(decote, 1)} × ${f(vente, 2)} = ${cash(perteSpirale, 2)} est définitive, réalisée, et infligée par l'urgence elle-même.`],
        },
        {
          intitule: en ? 'd) The final leverage: repaired, but smaller' : 'd) Le levier final : réparé, mais plus petit',
          enonce: en
            ? `After the sale (assets ${cash(a2, 2)}, equity from c)), what is the final leverage (unitless)?`
            : `Après la vente (actifs ${cash(a2, 2)}, fonds propres du c)), quel est le levier final (sans unité) ?`,
          reponse: levierFinal, tolerance: 0.1, toleranceMode: 'absolu', unite: '×',
          etapes: [
            {
              titre: en ? 'Leverage = assets/equity, back to target' : 'Levier = actifs/fonds propres, retour à la cible',
              contenu: en
                ? `A = ${f(a1, 2)} − ${f(vente, 2)} = ${cash(a2, 2)}; leverage = ${f(a2, 2)}/${f(e2, 2)} = **${f(levierFinal, 2)}** — back to the target of ${f(levier, 0)} (rounding aside), which is exactly what the formula of b) was built to do. But look at the price: balance sheet shrunk by ${pct(bilanReduit, 2)}, equity amputated by ${pct(fpAmputes, 2)} since the morning.`
                : `A = ${f(a1, 2)} − ${f(vente, 2)} = ${cash(a2, 2)} ; levier = ${f(a2, 2)}/${f(e2, 2)} = **${f(levierFinal, 2)}** — retour à la cible de ${f(levier, 0)} (aux arrondis près), exactement ce pour quoi la formule du b) est construite. Mais regardez le prix : bilan rétréci de ${pct(bilanReduit, 2)}, fonds propres amputés de ${pct(fpAmputes, 2)} depuis le matin.`,
            },
            {
              titre: en ? 'The chapter-7 moral: solvent, illiquid, nearly dead' : 'La morale du chapitre 7 : solvable, illiquide, presque mort',
              contenu: en
                ? `Remember the LDI irony: rising rates IMPROVED the pension funds' economic solvency — the present value of their liabilities deflated, pure duration mechanics — and the funds nearly died anyway, of Tuesday's margin call. Solvent but illiquid dies as fast as insolvent if nobody lends: if you keep one example of the module's royal distinction, keep this one.`
                : `Souvenez-vous de l'ironie LDI : la hausse des taux AMÉLIORAIT la solvabilité économique des fonds de pension — la valeur actualisée de leurs engagements dégonflait, pure mécanique de duration — et les fonds ont failli mourir quand même, de l'appel de marge du mardi. Solvable mais illiquide meurt aussi vite qu'insolvable si personne ne prête : si vous ne gardez qu'un exemple de la distinction reine du module, gardez celui-là.`,
            },
          ],
          pieges: [en
            ? `Calling the episode harmless because leverage is back at ${f(levier, 0)}: compare ${cash(e0, 2)} → ${cash(e2, 2)} — the structure is repaired, the wealth is amputated; and if the market drops again, the next spiral starts from a weaker balance sheet.`
            : `Juger l'épisode indolore parce que le levier est revenu à ${f(levier, 0)} : comparez ${cash(e0, 2)} → ${cash(e2, 2)} — la structure est réparée, le patrimoine est amputé ; et si le marché rebaisse, la prochaine spirale part d'un bilan plus fragile.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 6. m11-pb-06 — Le desk repo en 2008 — N2                            */
/* ------------------------------------------------------------------ */
const deskRepo2008: ProblemeMoule = {
  id: 'm11-pb-06', moduleId: M11,
  titre: 'Le desk repo en 2008 : la ruée sur les haircuts',
  titreEn: 'The repo desk in 2008: the run on haircuts',
  typeDeCas: 'run sur le repo',
  typeDeCasEn: 'repo run',
  difficulte: 2,
  scenarios: ['Le SIV : des actifs à 30 ans financés à 30 jours, hors bilan', 'Le broker-dealer : tout le bilan roulé en repo au jour le jour', 'Le fonds monétaire prêteur : pourquoi JE monte le haircut'],
  scenariosEn: ['The SIV: 30-year assets funded at 30 days, off balance sheet', 'The broker-dealer: the whole balance sheet rolled overnight in repo', 'The money-market lender: why I am the one raising the haircut'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : book, haircut avant, haircut après, décote de liquidation.
    const cfg = ([
      { bMin: 20, bMax: 50, h1Min: 1, h1Max: 3, h2Min: 15, h2Max: 25, dMin: 3, dMax: 6 },
      { bMin: 100, bMax: 300, h1Min: 2, h1Max: 4, h2Min: 10, h2Max: 20, dMin: 4, dMax: 8 },
      { bMin: 10, bMax: 30, h1Min: 1, h1Max: 2, h2Min: 20, h2Max: 30, dMin: 5, dMax: 10 },
    ] as const)[sIdx];
    const book = randInt(rng, cfg.bMin, cfg.bMax);
    const h1 = randFloat(rng, cfg.h1Min, cfg.h1Max, 1);
    const h2 = randInt(rng, cfg.h2Min, cfg.h2Max);
    const decote = randFloat(rng, cfg.dMin, cfg.dMax, 1);
    const fin1 = r2(financementRepo(book, h1));
    const fin2 = r2(financementRepo(book, h2));
    const trou = r2(fin1 - fin2);
    const vente = r2(venteForceePourCash(trou, decote));
    const perte = r2(vente - trou);
    const levmax1 = r2(levierMaximalRepo(h1));
    const levmax2 = r2(levierMaximalRepo(h2));
    const trouPctBook = r2((trou / book) * 100);
    const cashInsuffisant = r2(trou * (1 - decote / 100));

    const { en, f, pct } = outils(langue);
    const dev: Dev = { fr: 'Md\\$', pre: '\\$', suf: 'bn' };
    const unit = 'Md$';
    const cash = cashFab(en, f, dev);
    const desc = en
      ? `a book of ${cash(book, 0)} of structured securities financed in repo; yesterday's haircut ${pct(h1, 1)}, this morning's demand ${pct(h2, 0)}; liquidation discount if forced to sell: ${pct(decote, 1)}`
      : `un book de ${cash(book, 0)} de titres structurés financé en repo ; haircut d'hier ${pct(h1, 1)}, exigence de ce matin ${pct(h2, 0)} ; décote de liquidation en cas de vente forcée : ${pct(decote, 1)}`;
    const contexte = (en
      ? [
        `2007. Your SIV holds 30-year securitised assets OFF the bank's balance sheet and refinances them endlessly with 30-day paper and repo — a bank without deposit insurance and without a lender of last resort: ${desc}. On August 9, 2007, BNP Paribas froze three funds citing an "evaporation of liquidity", and the doubt has now reached your collateral. Compute the morning the shadow-banking model died.`,
        `March 2008. Your broker-dealer rolls its whole book overnight in repo — the Bear Stearns configuration, killed by the repo market in one week: ${desc}. No depositor to panic, no branch to queue at: the run is a treasurer watching a haircut number. Redo his arithmetic.`,
        `September 2008. You run the money-market fund that LENDS in repo — the other side of the trade. Reserve Primary just "broke the buck" on its Lehman paper and your board asks one question: is our collateral cushion big enough? Your borrower: ${desc}. Compute what raising the haircut does — and why you do it anyway.`,
      ]
      : [
        `2007. Votre SIV loge des actifs titrisés à 30 ans HORS du bilan de la banque et les refinance sans fin en papier à 30 jours et en repo — une banque sans assurance des dépôts et sans prêteur en dernier ressort : ${desc}. Le 9 août 2007, BNP Paribas a gelé trois fonds en invoquant une « évaporation de la liquidité », et le doute atteint maintenant votre collatéral. Calculez le matin où le modèle du shadow banking est mort.`,
        `Mars 2008. Votre broker-dealer roule tout son book au jour le jour en repo — la configuration Bear Stearns, tuée par le marché du repo en une semaine : ${desc}. Aucun déposant à paniquer, aucune agence où faire la queue : la ruée, c'est un trésorier qui regarde un chiffre de haircut. Refaites son arithmétique.`,
        `Septembre 2008. Vous gérez le fonds monétaire qui PRÊTE en repo — l'autre côté du trade. Reserve Primary vient de « casser le dollar » sur son papier Lehman et votre conseil pose une seule question : notre coussin de collatéral suffit-il ? Votre emprunteur : ${desc}. Calculez ce que monter le haircut provoque — et pourquoi vous le faites quand même.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? `a) Yesterday's world: funding at a ${pct(h1, 1)} haircut` : `a) Le monde d'hier : le financement au haircut de ${pct(h1, 1)}`,
          enonce: en
            ? `What funding does the ${cash(book, 0)} book obtain in repo at a ${pct(h1, 1)} haircut, in ${unit}?`
            : `Quel financement le book de ${cash(book, 0)} obtient-il en repo au haircut de ${pct(h1, 1)}, en ${unit} ?`,
          reponse: fin1, tolerance: 0.005, unite: unit,
          etapes: [{
            titre: en ? 'Funding = value × (1 − haircut) — and the haircut caps the leverage' : 'Financement = valeur × (1 − haircut) — et le haircut plafonne le levier',
            contenu: en
              ? `${f(book, 0)} × (1 − ${f(h1, 1)}/100) = **${cash(fin1, 2)}**: the lender keeps ${pct(h1, 1)} as a cushion. And read the haircut as a leverage cap: 100/${f(h1, 1)} = ${f(levmax1, 2)} of maximal leverage by re-pledging round after round — the mechanics that let LTCM, with negotiated near-zero haircuts, carry over \\$125bn of assets on less than \\$5bn of capital. In 2006, structured-product haircuts lived at these levels.`
              : `${f(book, 0)} × (1 − ${f(h1, 1)}/100) = **${cash(fin1, 2)}** : le prêteur garde ${pct(h1, 1)} de coussin. Et lisez le haircut comme un plafond de levier : 100/${f(h1, 1)} = ${f(levmax1, 2)} de levier maximal en re-nantissant tour après tour — la mécanique qui a permis à LTCM, haircuts négociés quasi nuls, de porter plus de 125 Md\\$ d'actifs sur moins de 5 Md\\$ de capital. En 2006, les haircuts sur produits structurés vivaient à ces niveaux.`,
          }],
          pieges: [en
            ? `Taking the funding to be the full ${cash(book, 0)}: the haircut is THE variable of 2008 — the run happened on that number, not at any counter.`
            : `Croire le financement égal aux ${cash(book, 0)} : le haircut est LA variable de 2008 — la ruée a eu lieu sur ce nombre, pas à un guichet.`],
        },
        {
          intitule: en ? `b) The lender does not say no — he says "${pct(h2, 0)}"` : `b) Le prêteur ne dit pas non — il dit « ${pct(h2, 0)} »`,
          enonce: en
            ? `This morning the haircut jumps to ${pct(h2, 0)}. How much funding evaporates versus a), to be found THE SAME DAY, in ${unit}?`
            : `Ce matin, le haircut saute à ${pct(h2, 0)}. Combien de financement s'évapore par rapport au a), à trouver LE JOUR MÊME, en ${unit} ?`,
          reponse: trou, tolerance: 0.005, unite: unit,
          etapes: [{
            titre: en ? 'Hole = old funding − new funding' : 'Trou = ancien financement − nouveau financement',
            contenu: en
              ? `New funding = ${f(book, 0)} × (1 − ${f(h2, 0)}/100) = ${cash(fin2, 2)}; hole = ${f(fin1, 2)} − ${f(fin2, 2)} = **${cash(trou, 2)}** (${pct(trouPctBook, 2)} of the book), due today. The leverage cap collapses too: 100/${f(h2, 0)} = ${f(levmax2, 2)} against ${f(levmax1, 2)}. This is Gorton's invisible run: no queue in the street — a treasurer watching 2% become 25%, a repo lender shortening 30 days to 1. Bear Stearns went from rumour to rescue sale in ONE week of exactly this.`
              : `Nouveau financement = ${f(book, 0)} × (1 − ${f(h2, 0)}/100) = ${cash(fin2, 2)} ; trou = ${f(fin1, 2)} − ${f(fin2, 2)} = **${cash(trou, 2)}** (${pct(trouPctBook, 2)} du book), exigible aujourd'hui. Le plafond de levier s'effondre aussi : 100/${f(h2, 0)} = ${f(levmax2, 2)} contre ${f(levmax1, 2)}. C'est le run invisible de Gorton : aucune file dans la rue — un trésorier qui regarde 2 % devenir 25 %, un prêteur de repo qui raccourcit 30 jours en 1. Bear Stearns est passée de la rumeur à la vente de sauvetage en UNE semaine d'exactement ceci.`,
          }],
          pieges: [en
            ? `Thinking an outright refusal would be worse: raising the haircut from ${pct(h1, 1)} to ${pct(h2, 0)} IS a partial withdrawal — repo was the institutions' "deposit", reputedly safe, withdrawable at will, and with no FDIC behind it.`
            : `Penser qu'un refus pur et simple serait pire : monter le haircut de ${pct(h1, 1)} à ${pct(h2, 0)} EST un retrait partiel — le repo était le « dépôt » des institutionnels, réputé sûr, retirable à volonté, et sans FDIC derrière.`],
        },
        {
          intitule: en ? 'c) Selling into the hole' : 'c) Vendre dans le trou',
          enonce: en
            ? `To raise the cash of b), the desk sells under a ${pct(decote, 1)} liquidation discount. What pre-discount market value must be sold, in ${unit}?`
            : `Pour lever le cash du b), le desk vend sous une décote de liquidation de ${pct(decote, 1)}. Quelle valeur de marché pré-décote faut-il vendre, en ${unit} ?`,
          reponse: vente, tolerance: 0.005, unite: unit,
          etapes: [{
            titre: en ? 'Sale = need/(1 − d), and the loop closes' : 'Vente = besoin/(1 − d), et la boucle se ferme',
            contenu: en
              ? `${f(trou, 2)}/(1 − ${f(decote, 1)}/100) = **${cash(vente, 2)}**. And here the loop closes on everyone else: these sales depress the price of the SAME assets on every other book, so haircuts widen further, so more must be sold — the chapter-1 liquidity spiral in a closed circuit. The 2008 chapter's canonical numbers: a haircut going 2% → 25% melts funding from 98 to 75; 23 to find at once, and at a 5% discount that means selling 24.2.`
              : `${f(trou, 2)}/(1 − ${f(decote, 1)}/100) = **${cash(vente, 2)}**. Et ici la boucle se referme sur tous les autres : ces ventes dépriment le prix des MÊMES actifs dans tous les autres books, donc les haircuts s'élargissent encore, donc il faut vendre plus — la spirale de liquidité du chapitre 1 en circuit fermé. Les chiffres canoniques du chapitre 2008 : un haircut qui passe de 2 % → 25 % fait fondre le financement de 98 à 75 ; 23 à trouver tout de suite, et sous 5 % de décote cela oblige à vendre 24,2.`,
          }],
          pieges: [en
            ? `Selling ${cash(trou, 2)} flat: under the discount that only raises ${cash(cashInsuffisant, 2)} — always divide the need by (1 − d).`
            : `Vendre ${cash(trou, 2)} tout rond : sous la décote, cela ne rapporte que ${cash(cashInsuffisant, 2)} — on divise toujours le besoin par (1 − d).`],
        },
        {
          intitule: en ? "d) The day's dead loss" : 'd) La perte sèche de la journée',
          enonce: en
            ? `What total dead loss does the desk book on the day (the discount paid on the sale of c)), in ${unit}?`
            : `Quelle perte sèche totale le desk enregistre-t-il sur la journée (la décote payée sur la vente du c)), en ${unit} ?`,
          reponse: perte, tolerance: 0.005, unite: unit,
          etapes: [
            {
              titre: en ? 'Loss = sale − need: realised, definitive, and no default anywhere' : 'Perte = vente − besoin : réalisée, définitive, et aucun défaut nulle part',
              contenu: en
                ? `${f(vente, 2)} − ${f(trou, 2)} = **${cash(perte, 2)}** — realised and definitive, while NOT ONE security in the book has defaulted. The loss came entirely from the FUNDING side: liquidity risk is a risk of its own, distinct from credit risk, and 2008 is its monument.`
                : `${f(vente, 2)} − ${f(trou, 2)} = **${cash(perte, 2)}** — réalisée et définitive, alors que PAS UN titre du book n'a fait défaut. La perte est venue entièrement du côté du FINANCEMENT : le risque de liquidité est un risque en soi, distinct du risque de crédit, et 2008 est son monument.`,
            },
            {
              titre: en ? "The lender's side: individually rational, collectively lethal" : 'Le côté du prêteur : rationnel un par un, létal tous ensemble',
              contenu: en
                ? `Seen from the money-market lender, raising the haircut is pure prudence: his cushion must cover liquidating a book whose discount is widening. Each lender is individually right — and together they manufacture the run, exactly like the depositors of 1931. On September 16, 2008, Reserve Primary broke the buck on its Lehman paper and the commercial-paper market shut for the whole economy. The shadow system had rebuilt pre-1934 banking, flammable and without the extinguisher: Basel III's liquidity ratios are the children of this precise day.`
                : `Vu du fonds monétaire prêteur, monter le haircut est de la pure prudence : son coussin doit couvrir la liquidation d'un book dont la décote s'élargit. Chaque prêteur a raison individuellement — et ensemble ils fabriquent la ruée, exactement comme les déposants de 1931. Le 16 septembre 2008, Reserve Primary a cassé le dollar sur son papier Lehman et le marché du papier commercial s'est fermé pour toute l'économie. Le système parallèle avait reconstruit la banque d'avant 1934, inflammable et sans extincteur : les ratios de liquidité de Bâle III sont les enfants de ce jour précis.`,
            },
          ],
          pieges: [en
            ? `Looking for the loss in credit quality: the book suffered zero defaults — Gorton's line to quote at the oral: 2008 was not a run on deposits, it was a run ON HAIRCUTS.`
            : `Chercher la perte dans la qualité de crédit : le book n'a subi aucun défaut — la phrase de Gorton à citer à l'oral : 2008 ne fut pas une ruée aux guichets, ce fut une ruée SUR LES HAIRCUTS.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 7. m11-pb-07 — La banque morte en silence (SVB) — N2                */
/* ------------------------------------------------------------------ */
const banqueMorteSilence: ProblemeMoule = {
  id: 'm11-pb-07', moduleId: M11,
  titre: 'La banque morte en silence : duration, perte latente, fuite des dépôts',
  titreEn: 'The bank that died in silence: duration, latent loss, deposit flight',
  typeDeCas: 'risque de taux bancaire',
  typeDeCasEn: 'bank interest-rate risk',
  difficulte: 2,
  scenarios: ['SVB, fin 2022 : les dépôts de la tech placés en titres longs au sommet', 'Une caisse d\'épargne (S&L), 1981 : prêter à 30 ans, se financer au jour le jour, croiser Volcker', 'Une banque japonaise, années 1990 : le stress test des JGB'],
  scenariosEn: ['SVB, late 2022: tech deposits parked in long securities at the top', 'A savings & loan, 1981: lend at 30 years, fund overnight, meet Volcker', 'A Japanese bank, 1990s: the JGB stress test'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : portefeuille, duration, choc (pas de 25 pb), FP, dépôts, liquides.
    const cfg = ([
      { pMin: 100, pMax: 140, duMin: 5, duMax: 6.5, dyMin: 6, dyMax: 10, fpMin: 12, fpMax: 18, depMin: 150, depMax: 190, liMin: 10, liMax: 25 },
      { pMin: 400, pMax: 700, duMin: 7, duMax: 9, dyMin: 12, dyMax: 20, fpMin: 25, fpMax: 45, depMin: 500, depMax: 900, liMin: 40, liMax: 90 },
      { pMin: 2000, pMax: 4000, duMin: 6, duMax: 8, dyMin: 4, dyMax: 8, fpMin: 150, fpMax: 300, depMin: 3000, depMax: 5000, liMin: 200, liMax: 500 },
    ] as const)[sIdx];
    const portefeuille = randInt(rng, cfg.pMin, cfg.pMax);
    const duration = randFloat(rng, cfg.duMin, cfg.duMax, 1);
    const dy = randInt(rng, cfg.dyMin, cfg.dyMax) * 25; // pas de 25 pb, la granularité des cycles
    const fp = randInt(rng, cfg.fpMin, cfg.fpMax);
    const depots = randInt(rng, cfg.depMin, cfg.depMax);
    const liquides = randInt(rng, cfg.liMin, cfg.liMax);
    const varPct = r2(variationPrixObligationDuration(duration, dy)); // % signé, négatif
    const perte = r2((portefeuille * -varPct) / 100);                 // magnitude positive
    const ratioFp = r2((perte / fp) * 100);
    const couverture = r2(tauxCouvertureDepots(liquides, depots));
    const perteNaive = r2(-duration * dy);

    const { en, f, pct } = outils(langue);
    const dev: Dev = ([
      { fr: 'Md\\$', pre: '\\$', suf: 'bn' },
      { fr: 'M\\$', pre: '\\$', suf: 'm' },
      { fr: 'Md¥', pre: '¥', suf: 'bn' },
    ] as const)[sIdx];
    const unit = (['Md$', 'M$', 'Md¥'] as const)[sIdx];
    const cash = cashFab(en, f, dev);
    const desc = en
      ? `a held-to-maturity portfolio of ${cash(portefeuille, 0)}, modified duration ${f(duration, 1)}, bought at the top; rate shock: +${f(dy, 0)} bp; equity ${cash(fp, 0)}; demand deposits ${cash(depots, 0)}, same-day liquid assets ${cash(liquides, 0)}`
      : `un portefeuille held-to-maturity de ${cash(portefeuille, 0)}, duration modifiée ${f(duration, 1)}, acheté au sommet ; choc de taux : +${f(dy, 0)} pb ; fonds propres ${cash(fp, 0)} ; dépôts exigibles ${cash(depots, 0)}, actifs liquides du jour ${cash(liquides, 0)}`;
    const contexte = (en
      ? [
        `Late 2022, California. Deposits more than tripled between 2019 and 2021 — from about \\$60bn to about \\$190bn of concentrated tech money, over 90% above the \\$250k insurance cap — and were parked in LONG Treasuries and MBS at the very top of the bond market. Then the Fed hiked +425 bp. Your stylised SVB: ${desc}. The chapter's one-line arithmetic (−5.7 × 2 points ≈ −11.4%, i.e. about −\\$16bn on \\$140bn) killed the bank before anyone noticed: accounting said nothing. Redo it.`,
        `1981, main street America. Your savings & loan wrote 30-year fixed mortgages for decades and funds them with short deposits — then Volcker takes short rates towards 20%. The S&L industry will die of it by the hundreds through the 1980s: ${desc}. Same disease as SVB, forty years earlier, at 1980s speed. Do the autopsy in advance.`,
        `Tokyo, 1990s. Your bank sits on a mountain of JGBs while the BoJ fights deflation at zero — and the board wants the STRESS TEST: what if rates ever normalised? ${desc}. The scenario the BoJ still runs today: a duration mountain against thin equity. Compute what "normalisation" would cost.`,
      ]
      : [
        `Fin 2022, Californie. Des dépôts plus que triplés entre 2019 et 2021 — d'environ 60 à environ 190 Md\\$ d'argent tech concentré, plus de 90 % au-dessus du plafond de garantie de 250 k\\$ — et placés en Treasuries et MBS LONGS au sommet exact du marché obligataire. Puis la Fed monte de +425 pb. Votre SVB stylisée : ${desc}. L'arithmétique en une ligne du chapitre (−5,7 × 2 points ≈ −11,4 %, soit de l'ordre de −16 Md\\$ sur 140 Md\\$) a tué la banque avant que quiconque ne le voie : la comptabilité ne disait rien. Refaites-la.`,
        `1981, l'Amérique des petites villes. Votre caisse d'épargne écrit des crédits immobiliers à 30 ans à taux fixe depuis des décennies et se finance en dépôts courts — puis Volcker porte les taux courts vers 20 %. L'industrie des S&L en mourra par centaines au fil des années 1980 : ${desc}. La même maladie que SVB, quarante ans plus tôt, à la vitesse des années 1980. Faites l'autopsie à l'avance.`,
        `Tokyo, années 1990. Votre banque est assise sur une montagne de JGB pendant que la BoJ combat la déflation à zéro — et le conseil veut le STRESS TEST : et si les taux se normalisaient un jour ? ${desc}. Le scénario que la BoJ fait encore tourner aujourd'hui : une montagne de duration contre des fonds propres minces. Calculez ce que la « normalisation » coûterait.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? `a) The duration hit: +${f(dy, 0)} bp on the portfolio` : `a) Le coup de duration : +${f(dy, 0)} pb sur le portefeuille`,
          enonce: en
            ? `Modified duration ${f(duration, 1)}, rates up ${f(dy, 0)} bp. Price change of the portfolio, in % (signed)?`
            : `Duration modifiée ${f(duration, 1)}, taux en hausse de ${f(dy, 0)} pb. Variation de prix du portefeuille, en % (signée) ?`,
          reponse: varPct, tolerance: 0.05, toleranceMode: 'absolu', unite: '%',
          etapes: [{
            titre: en ? 'ΔP/P ≈ −D × Δy (Δy in points)' : 'ΔP/P ≈ −D × Δy (Δy en points)',
            contenu: en
              ? `$\\frac{\\Delta P}{P} \\approx -D \\times \\Delta y$ = −${f(duration, 1)} × ${f(r2(dy / 100), 2)} point(s) = **${pct(varPct, 2)}**. The module-10 transmission channel, seen from the victim's side: SVB's chapter line is −5.7 × 2 points ≈ −11.4%. The linear approximation is slightly pessimistic for the holder (convexity, module 4) — more than close enough to kill.`
              : `$\\frac{\\Delta P}{P} \\approx -D \\times \\Delta y$ = −${f(duration, 1)} × ${f(r2(dy / 100), 2)} point(s) = **${pct(varPct, 2)}**. Le canal de transmission du module 10, vu du côté de la victime : la ligne du chapitre pour SVB est −5,7 × 2 points ≈ −11,4 %. L'approximation linéaire est légèrement pessimiste pour le porteur (convexité, module 4) — largement assez juste pour tuer.`,
          }],
          pieges: [en
            ? `Multiplying the duration by the bp figure without converting (−${f(duration, 1)} × ${f(dy, 0)} = ${f(perteNaive, 0)}%!): duration multiplies POINTS of yield — ${f(dy, 0)} bp = ${f(r2(dy / 100), 2)} point(s).`
            : `Multiplier la duration par les pb sans convertir (−${f(duration, 1)} × ${f(dy, 0)} = ${f(perteNaive, 0)} % !) : la duration multiplie des POINTS de taux — ${f(dy, 0)} pb = ${f(r2(dy / 100), 2)} point(s).`],
        },
        {
          intitule: en ? 'b) The latent loss, in money' : 'b) La moins-value latente, en argent',
          enonce: en
            ? `Apply the percentage of a) to the ${cash(portefeuille, 0)} portfolio. Latent loss, in ${unit} (magnitude)?`
            : `Appliquez le pourcentage du a) au portefeuille de ${cash(portefeuille, 0)}. Moins-value latente, en ${unit} (magnitude) ?`,
          reponse: perte, tolerance: 0.005, unite: unit,
          etapes: [{
            titre: en ? '"Latent" only as long as nobody has to sell' : '« Latente » seulement tant que personne ne doit vendre',
            contenu: en
              ? `${f(portefeuille, 0)} × ${f(r2(-varPct), 2)}/100 = **${cash(perte, 2)}**. Held-to-maturity accounting keeps the securities at cost: as long as nothing is sold, the loss does not exist on paper. The double trap of the chapter: for the bank, the loss is real the day a run FORCES the sale; for the analyst, a balance sheet can look presentable while the economic wealth is destroyed. On March 8, 2023, SVB sold \\$21bn of securities, realised \\$1.8bn of loss, announced a capital raise — and turned the latent number into a public one.`
              : `${f(portefeuille, 0)} × ${f(r2(-varPct), 2)}/100 = **${cash(perte, 2)}**. La comptabilité held-to-maturity garde les titres au coût d'achat : tant qu'on ne vend rien, la perte n'existe pas sur le papier. Le double piège du chapitre : pour la banque, la perte est réelle le jour où un run FORCE la vente ; pour l'analyste, un bilan peut être présentable pendant que le patrimoine économique est détruit. Le 8 mars 2023, SVB a vendu 21 Md\\$ de titres, réalisé 1,8 Md\\$ de perte, annoncé une augmentation de capital — et transformé le chiffre latent en chiffre public.`,
          }],
          pieges: [en
            ? `Calling the loss hypothetical: not one issuer defaulted in SVB's portfolio — INTEREST-RATE risk is not credit risk, and it was enough to cost the equity.`
            : `Juger la perte hypothétique : aucun émetteur n'a fait défaut dans le portefeuille de SVB — le risque de TAUX n'est pas un risque de crédit, et il a suffi à coûter les fonds propres.`],
        },
        {
          intitule: en ? 'c) Against the equity: dead or alive?' : 'c) Contre les fonds propres : morte ou vivante ?',
          enonce: en
            ? `Equity: ${cash(fp, 0)}. What percentage of the equity does the latent loss of b) represent, in %?`
            : `Fonds propres : ${cash(fp, 0)}. Quel pourcentage des fonds propres la moins-value latente du b) représente-t-elle, en % ?`,
          reponse: ratioFp, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'Loss/equity: the economic verdict' : 'Perte/fonds propres : le verdict économique',
            contenu: en
              ? `${f(perte, 2)}/${f(fp, 0)} × 100 = **${pct(ratioFp, 2)}**. ${ratioFp >= 100 ? 'Above 100%: economically, the bank is DEAD — materialise the loss and the equity is gone. SVB at end-2022 in one line: about −\\$16bn of latent losses against roughly all of its equity, and nobody saw it because the accounts did not say it.' : 'Below 100%, the bank is wounded, not dead — but a run does not wait for the 100% line: the ANNOUNCEMENT of the loss is what starts the clock.'} The 1980s S&L industry ran for years with negative economic net worth — regulatory forbearance let the zombies grow, and the final bill exploded.`
              : `${f(perte, 2)}/${f(fp, 0)} × 100 = **${pct(ratioFp, 2)}**. ${ratioFp >= 100 ? 'Au-dessus de 100 % : économiquement, la banque est MORTE — matérialisez la perte et les fonds propres disparaissent. SVB fin 2022 en une ligne : de l\'ordre de −16 Md\\$ de latentes contre à peu près la totalité des fonds propres, et personne ne le voyait parce que les comptes ne le disaient pas.' : 'Sous 100 %, la banque est blessée, pas morte — mais un run n\'attend pas la ligne des 100 % : c\'est l\'ANNONCE de la perte qui déclenche le chronomètre.'} Les S&L des années 1980 ont tourné des années en valeur nette économique négative — l'indulgence réglementaire a laissé grossir les zombies, et l'addition finale a explosé.`,
          }],
          pieges: [en
            ? `Reading the accounting balance sheet ("equity intact"): held-to-maturity hides exactly this number — the module's rule: judge the ECONOMIC net worth, marked to market, not the book one.`
            : `Lire le bilan comptable (« fonds propres intacts ») : le held-to-maturity cache exactement ce nombre — la règle du module : jugez le patrimoine ÉCONOMIQUE, valorisé au marché, pas le comptable.`],
        },
        {
          intitule: en ? 'd) The trigger: how much flight forces the sale' : 'd) Le déclencheur : quelle fuite force la vente',
          enonce: en
            ? `Deposits ${cash(depots, 0)}, same-day liquid assets ${cash(liquides, 0)} — the rest is the HTM portfolio. What fraction of deposits can flee before the bank is FORCED to sell (and realise the loss of b)), in %?`
            : `Dépôts ${cash(depots, 0)}, actifs liquides du jour ${cash(liquides, 0)} — le reste est le portefeuille HTM. Quelle fraction des dépôts peut fuir avant que la banque soit FORCÉE de vendre (et de réaliser la perte du b)), en % ?`,
          reponse: couverture, tolerance: 0.005, unite: '%',
          etapes: [
            {
              titre: en ? 'Coverage = liquid/deposits: the fuse length' : 'Couverture = liquide/dépôts : la longueur de la mèche',
              contenu: en
                ? `${f(liquides, 0)}/${f(depots, 0)} × 100 = **${pct(couverture, 2)}**. Beyond that fraction, every withdrawal forces an HTM sale: the latent loss becomes realised, the announcement feeds the run, the run forces more sales — the March 2023 loop, closed. This question chains the whole problem: the duration built the bomb (a, b, c), the deposit coverage is the length of the fuse.`
                : `${f(liquides, 0)}/${f(depots, 0)} × 100 = **${pct(couverture, 2)}**. Au-delà de cette fraction, chaque retrait force une vente HTM : la perte latente devient réalisée, l'annonce nourrit le run, le run force de nouvelles ventes — la boucle de mars 2023, refermée. Cette question chaîne tout le problème : la duration a construit la bombe (a, b, c), la couverture des dépôts est la longueur de la mèche.`,
            },
            {
              titre: en ? 'March 9, 2023: the smartphone run' : 'Le 9 mars 2023 : le run au smartphone',
              contenu: en
                ? `SVB faced \\$42bn of withdrawal requests in ONE day — about a quarter of its deposits, coordinated by Twitter and the venture-capital group chats; the 1907 run took weeks of queues, this one took hours without a single line. On March 12 came the backstop: ALL deposits guaranteed under the systemic risk exception, and the Fed's BTFP lending AT PAR against collateral quoted below par — a twisted Bagehot, tailor-made for a duration crisis. And remember who ran first: the uninsured deposits — the guarantee only anchors what it covers.`
                : `SVB a affronté 42 Md\\$ de demandes de retrait en UNE journée — environ un quart de ses dépôts, coordonnés par Twitter et les group chats du capital-risque ; la ruée de 1907 prenait des semaines de files, celle-ci a pris des heures sans une seule file. Le 12 mars, le backstop : TOUS les dépôts garantis au titre de la « systemic risk exception », et le BTFP de la Fed qui prête AU PAIR contre du collatéral qui cote sous le pair — un Bagehot tordu, taillé sur mesure pour une crise de duration. Et souvenez-vous de qui a couru en premier : les dépôts non assurés — la garantie n'ancre que ce qu'elle couvre.`,
            },
          ],
          pieges: [en
            ? `Counting on deposit insurance to hold the base: over 90% of SVB's deposits were above the \\$250k cap — uninsured deposits run FIRST, and client concentration is a risk datum in its own right, like the balance sheet.`
            : `Compter sur la garantie des dépôts pour tenir la base : plus de 90 % des dépôts de SVB dépassaient le plafond de 250 k\\$ — les dépôts non assurés courent les PREMIERS, et la concentration de la clientèle est une donnée de risque à part entière, comme le bilan.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* 8. m11-pb-08 — Récupérer ou pas — N2                                */
/* ------------------------------------------------------------------ */
const recupererOuPas: ProblemeMoule = {
  id: 'm11-pb-08', moduleId: M11,
  titre: "Récupérer ou pas : deux krachs, deux horloges, une hypothèse héroïque",
  titreEn: 'Recover or not: two crashes, two clocks, one heroic assumption',
  typeDeCas: 'comparaison de récupérations',
  typeDeCasEn: 'recovery comparison',
  difficulte: 2,
  scenarios: ['1987 contre 1929 : le même mot « krach », deux mondes', 'COVID 2020 contre 2008 : le pompier change tout', 'Dot-com contre marché large : la tech paie sa convexité'],
  scenariosEn: ['1987 versus 1929: the same word "crash", two worlds', 'COVID 2020 versus 2008: the fireman changes everything', 'Dot-com versus broad market: tech pays for its convexity'],
  generate(seed, scenario, langue = 'fr') {
    const sIdx = scenario >= 0 && scenario < 3 ? scenario : 0;
    const rng = mulberry32(seed * 31 + sIdx * 1009);
    // Bornes par scénario : drawdowns (magnitudes) et croissances des deux indices.
    const cfg = ([
      { d1Min: 20, d1Max: 25, g1Min: 6, g1Max: 8, d2Min: 85, d2Max: 89, g2Min: 6, g2Max: 8 },
      { d1Min: 30, d1Max: 35, g1Min: 8, g1Max: 12, d2Min: 50, d2Max: 57, g2Min: 5, g2Max: 7 },
      { d1Min: 75, d1Max: 78, g1Min: 8, g1Max: 10, d2Min: 45, d2Max: 50, g2Min: 6, g2Max: 8 },
    ] as const)[sIdx];
    const dd1 = randFloat(rng, cfg.d1Min, cfg.d1Max, 1);
    const g1 = randFloat(rng, cfg.g1Min, cfg.g1Max, 1);
    const dd2 = randFloat(rng, cfg.d2Min, cfg.d2Max, 1);
    const g2 = randFloat(rng, cfg.g2Min, cfg.g2Max, 1);
    const gain1 = r2(gainRequisPourRecuperer(dd1));
    const gain2 = r2(gainRequisPourRecuperer(dd2));
    const an1 = r2(anneesDeRecuperation(dd1, g1));
    const an2 = r2(anneesDeRecuperation(dd2, g2));
    const ratioPertes = r2(dd2 / dd1);
    const ratioGains = r2(gain2 / gain1);
    const premierEstA = an1 < an2;

    const { en, f, pct } = outils(langue);
    const noms = ([
      { a: "l'indice 1987", b: "l'indice 1929", aEn: 'the 1987 index', bEn: 'the 1929 index' },
      { a: "l'indice COVID", b: "l'indice 2008", aEn: 'the COVID index', bEn: 'the 2008 index' },
      { a: 'le Nasdaq 2000', b: 'le marché large', aEn: 'the 2000 Nasdaq', bEn: 'the broad market' },
    ] as const)[sIdx];
    const nomA = en ? noms.aEn : noms.a;
    const nomB = en ? noms.bEn : noms.b;
    const desc = en
      ? `${noms.aEn}: ${pct(dd1, 1)} peak-to-trough, assumed recovery growth ${pct(g1, 1)}/yr; ${noms.bEn}: ${pct(dd2, 1)} peak-to-trough, assumed growth ${pct(g2, 1)}/yr — compounded, constant, heroic`
      : `${noms.a} : ${pct(dd1, 1)} pic-à-creux, croissance de récupération supposée ${pct(g1, 1)}/an ; ${noms.b} : ${pct(dd2, 1)} pic-à-creux, croissance supposée ${pct(g2, 1)}/an — composée, constante, héroïque`;
    const contexte = (en
      ? [
        `The examiner puts two photographs side by side — 1987, the worst single day in Wall Street history (−22.6%, worse than any 1929 session, −36.1% peak-to-trough) against 1929, the worst destruction (−89.2%, 25 years of purgatory): ${desc}. Same word, "crash"; your job is to show with four numbers that they belong to different worlds — and to say what the growth assumption is really worth.`,
        `Two modern bear markets on the desk: a COVID-style shock (−33.9% in 23 sessions in the real one, repaired in five months of unlimited QE) against a 2008-style grind (−56.8%, seventeen months of falling): ${desc}. Required gains, theoretical clocks, and the punchline: why did the real 2020 destroy the theoretical clock, and what does that prove about the model?`,
        `The 2000s split screen: tech (the real Nasdaq: −77.9%, back in 15 years) against the broad market of the same era: ${desc}. The growth optimists sat in tech — and tech still recovered LAST. Show the convexity that beats the growth premium, then say why every number here is an assumption wearing a suit.`,
      ]
      : [
        `L'examinateur pose deux photographies côte à côte — 1987, la pire séance de l'histoire de Wall Street (−22,6 %, pire que toute séance de 1929, −36,1 % pic-à-creux) contre 1929, la pire destruction (−89,2 %, 25 ans de purgatoire) : ${desc}. Le même mot, « krach » ; votre travail est de montrer en quatre nombres qu'ils appartiennent à des mondes différents — et de dire ce que vaut vraiment l'hypothèse de croissance.`,
        `Deux bear markets modernes sur le desk : un choc type COVID (−33,9 % en 23 séances dans la vraie version, réparé en cinq mois de QE illimité) contre un broyage type 2008 (−56,8 %, dix-sept mois de baisse) : ${desc}. Gains requis, horloges théoriques, et la chute : pourquoi le vrai 2020 a-t-il pulvérisé l'horloge théorique, et qu'est-ce que cela prouve sur le modèle ?`,
        `L'écran partagé des années 2000 : la tech (le vrai Nasdaq : −77,9 %, revenu en 15 ans) contre le marché large de la même époque : ${desc}. Les optimistes de la croissance étaient assis dans la tech — et la tech a quand même récupéré en DERNIER. Montrez la convexité qui bat la prime de croissance, puis dites pourquoi chaque nombre ici est une hypothèse en costume.`,
      ])[sIdx];

    return {
      contexte,
      sousQuestions: [
        {
          intitule: en ? `a) ${nomA}: the required gain` : `a) ${nomA} : le gain requis`,
          enonce: en
            ? `${nomA} lost ${pct(dd1, 1)} peak-to-trough. What gain takes it back to its peak, in %?`
            : `${nomA} a perdu ${pct(dd1, 1)} pic-à-creux. Quel gain le ramène à son pic, en % ?`,
          reponse: gain1, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'Gain = 100/(100 − loss) − 1' : 'Gain = 100/(100 − perte) − 1',
            contenu: en
              ? `100/(100 − ${f(dd1, 1)}) − 1 = **${pct(gain1, 2)}**. Keep the interview anchors: −22.6% (Black Monday 1987) requires "only" +29.2%; −50% requires +100%; −89% (the 1932 Dow) requires +809%. Never talk about a rebound before computing this number.`
              : `100/(100 − ${f(dd1, 1)}) − 1 = **${pct(gain1, 2)}**. Gardez les ancres d'entretien : −22,6 % (le lundi noir de 1987) n'exige « que » +29,2 % ; −50 % exige +100 % ; −89 % (le Dow de 1932) exige +809 %. Ne parlez jamais de rebond avant d'avoir calculé ce nombre.`,
          }],
          pieges: [en
            ? `Answering +${pct(dd1, 1)}: the naive symmetry — a ${pct(dd1, 1)} rebound on a base shrunk by ${pct(dd1, 1)} does not close the gap; percentages multiply.`
            : `Répondre +${pct(dd1, 1)} : la symétrie naïve — un rebond de ${pct(dd1, 1)} sur une base rétrécie de ${pct(dd1, 1)} ne referme pas l'écart ; les pourcentages se multiplient.`],
        },
        {
          intitule: en ? `b) ${nomB}: convexity at work` : `b) ${nomB} : la convexité au travail`,
          enonce: en
            ? `${nomB} lost ${pct(dd2, 1)}. Required gain, in % — and compare with a).`
            : `${nomB} a perdu ${pct(dd2, 1)}. Gain requis, en % — et comparez au a).`,
          reponse: gain2, tolerance: 0.005, unite: '%',
          etapes: [{
            titre: en ? 'The loss ratio versus the gain ratio' : 'Le rapport des pertes contre le rapport des gains',
            contenu: en
              ? `100/(100 − ${f(dd2, 1)}) − 1 = **${pct(gain2, 2)}**. Now the comparison that matters: the loss is ${f(ratioPertes, 2)}× the one in a), but the required gain is ${f(ratioGains, 2)}× the one in a) — the function is CONVEX, it explodes near 100% of loss. That non-linearity is the whole difference between a bad year and a lost generation: Kindleberger's revulsion is arithmetic before it is psychology.`
              : `100/(100 − ${f(dd2, 1)}) − 1 = **${pct(gain2, 2)}**. Et voici la comparaison qui compte : la perte vaut ${f(ratioPertes, 2)}× celle du a), mais le gain requis vaut ${f(ratioGains, 2)}× celui du a) — la fonction est CONVEXE, elle explose près de 100 % de perte. Cette non-linéarité est toute la différence entre une mauvaise année et une génération perdue : la révulsion de Kindleberger est de l'arithmétique avant d'être de la psychologie.`,
          }],
          pieges: [en
            ? `Scaling linearly from a) (${f(ratioPertes, 2)} × ${f(gain1, 2)} = ${pct(r2(ratioPertes * gain1), 2)}): convexity makes the true requirement ${pct(gain2, 2)} — extrapolation UNDERSHOOTS, and the bigger the loss the worse it gets.`
            : `Extrapoler linéairement depuis le a) (${f(ratioPertes, 2)} × ${f(gain1, 2)} = ${pct(r2(ratioPertes * gain1), 2)}) : la convexité porte le vrai requis à ${pct(gain2, 2)} — l'extrapolation SOUS-ESTIME, et d'autant plus que la perte est grande.`],
        },
        {
          intitule: en ? `c) The clock of ${nomA}` : `c) L'horloge de ${nomA}`,
          enonce: en
            ? `At ${pct(g1, 1)}/yr compounded, how many years does ${nomA} need to recover, in years?`
            : `À ${pct(g1, 1)}/an composés, combien d'années faut-il à ${nomA} pour récupérer, en années ?`,
          reponse: an1, tolerance: 0.005, unite: en ? 'years' : 'ans',
          etapes: [{
            titre: en ? 'Years = ln(1/(1 − loss))/ln(1 + g)' : 'Années = ln(1/(1 − perte))/ln(1 + g)',
            contenu: en
              ? `ln(1/(1 − ${f(dd1, 1)}/100))/ln(1 + ${f(g1, 1)}/100) = **${f(an1, 2)} years**. Benchmark the formula itself: −50% at 7%/yr = 10.24 years; −89% at 7%/yr = 32.62 years. Real 1987: about two years — a crash without a depression, because the leverage was in the machines, not in the households, and the Fed announced its liquidity the very next morning.`
              : `ln(1/(1 − ${f(dd1, 1)}/100))/ln(1 + ${f(g1, 1)}/100) = **${f(an1, 2)} ans**. Étalonnez la formule elle-même : −50 % à 7 %/an = 10,24 ans ; −89 % à 7 %/an = 32,62 ans. Le vrai 1987 : environ deux ans — un krach sans dépression, parce que le levier était dans les machines, pas chez les ménages, et que la Fed a annoncé sa liquidité dès le lendemain matin.`,
          }],
          pieges: [en
            ? `Dividing the gain by the growth (${f(gain1, 2)}/${f(g1, 1)} = ${f(r2(gain1 / g1), 1)} years): compounding shortens the road — the clock is logarithmic, not linear.`
            : `Diviser le gain par la croissance (${f(gain1, 2)}/${f(g1, 1)} = ${f(r2(gain1 / g1), 1)} ans) : la composition raccourcit la route — l'horloge est logarithmique, pas linéaire.`],
        },
        {
          intitule: en ? `d) The clock of ${nomB} — and the verdict` : `d) L'horloge de ${nomB} — et le verdict`,
          enonce: en
            ? `At ${pct(g2, 1)}/yr, how many years does ${nomB} need — and which of the two sees its peak first, in years?`
            : `À ${pct(g2, 1)}/an, combien d'années faut-il à ${nomB} — et lequel des deux revoit son pic en premier, en années ?`,
          reponse: an2, tolerance: 0.005, unite: en ? 'years' : 'ans',
          etapes: [
            {
              titre: en ? 'Compute, then rank' : 'Calculez, puis classez',
              contenu: en
                ? `ln(1/(1 − ${f(dd2, 1)}/100))/ln(1 + ${f(g2, 1)}/100) = **${f(an2, 2)} years**, against ${f(an1, 2)} years in c): ${premierEstA ? `${nomA} recovers first, with ${f(r2(an2 - an1), 2)} year(s) to spare` : `${nomB} recovers first, with ${f(r2(an1 - an2), 2)} year(s) to spare`} — the drawdown sets the mountain, the growth sets the pace, and the verdict belongs to BOTH numbers.`
                : `ln(1/(1 − ${f(dd2, 1)}/100))/ln(1 + ${f(g2, 1)}/100) = **${f(an2, 2)} ans**, contre ${f(an1, 2)} ans au c) : ${premierEstA ? `${nomA} récupère en premier, avec ${f(r2(an2 - an1), 2)} an(s) d'avance` : `${nomB} récupère en premier, avec ${f(r2(an1 - an2), 2)} an(s) d'avance`} — le drawdown fixe la montagne, la croissance fixe l'allure, et le verdict appartient aux DEUX nombres.`,
            },
            {
              titre: en ? 'Why the growth is the heroic assumption' : "Pourquoi la croissance est l'hypothèse héroïque",
              contenu: en
                ? `The g in the formula is a textbook constant, not a promise. Nikkei 1989: theory at 7%/yr said about 25 years — reality took 34 (deflation, thin dividends, a delirious starting valuation). COVID 2020: theory at 7% said about 6 years — reality took 5 months, because unlimited QE entered the room on March 23, the exact day of the trough. The gap between theory and reality is not a defect of the model, it IS the lesson: the growth is the heroic variable, and the starting point — valuation, monetary regime, fireman — decides everything.`
                : `Le g de la formule est une constante de manuel, pas une promesse. Nikkei 1989 : la théorie à 7 %/an disait environ 25 ans — la réalité en a pris 34 (déflation, dividendes maigres, valorisation de départ délirante). COVID 2020 : la théorie à 7 % disait environ 6 ans — la réalité a pris 5 mois, parce que le QE illimité est entré dans la salle le 23 mars, le jour exact du creux. L'écart entre théorie et réalité n'est pas un défaut du modèle, il EST la leçon : la croissance est la variable héroïque, et le point de départ — valorisation, régime monétaire, pompier — décide de tout.`,
            },
          ],
          pieges: [en
            ? `Turning the verdict into a law ("the smaller crash always recovers first"): swap the growth assumptions (${pct(g1, 1)} against ${pct(g2, 1)}) and the ranking can flip — the model's output is worth exactly what its heroic assumption is worth.`
            : `Faire du verdict une loi (« le petit krach récupère toujours en premier ») : échangez les hypothèses de croissance (${pct(g1, 1)} contre ${pct(g2, 1)}) et le classement peut basculer — la sortie du modèle vaut exactement ce que vaut son hypothèse héroïque.`],
        },
      ],
    };
  },
};

/* ------------------------------------------------------------------ */
/* Export du lot 1 — fusionné dans problems.ts par le contrôleur.      */
/* ------------------------------------------------------------------ */
export const problemesLot1: ProblemeMoule[] = [
  speculateur1929,     // m11-pb-01 · N1
  anatomieKrach,       // m11-pb-02 · N1
  banqueRuee,          // m11-pb-03 · N1
  etatSpreads,         // m11-pb-04 · N1
  fondsLevie,          // m11-pb-05 · N2
  deskRepo2008,        // m11-pb-06 · N2
  banqueMorteSilence,  // m11-pb-07 · N2
  recupererOuPas,      // m11-pb-08 · N2
];
