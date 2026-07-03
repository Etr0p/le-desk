/**
 * Les 14 générateurs d'exercices d'application du module Crédit : lire un
 * spread, chiffrer la perte attendue, composer la survie, pricer l'obligation
 * risquée, manier le CDS, lire la base, découper les tranches — chaque moule
 * martèle un piège des chapitres 1 à 7.
 *
 * BILINGUES : generate(seed, langue = 'fr'). Invariant absolu : TOUS les tirages
 * aléatoires sont effectués AVANT toute branche de langue — un même seed produit
 * exactement les mêmes nombres, la même réponse et la même tolérance en français
 * et en anglais. Seuls les textes (énoncé, étapes, pièges, unité textuelle) changent.
 *
 * Tous les calculs passent par calculs.ts (aucune formule recopiée). Conventions
 * du module (en-tête de calculs.ts) : pourcentages partout ; les spreads se
 * passent et se rendent en POINTS DE BASE (100 pb = 1 %) ; le recouvrement R est
 * un % du nominal et la perte en cas de défaut vaut LGD = 100 − R ; les PD sont
 * ANNUELLES et la survie se compose en DISCRET, (1 − PD)^n ; les notionnels CDS
 * se passent en MILLIONS, la prime annuelle se rend en EUROS et le paiement
 * contingent en MILLIONS ; les tranches se décrivent par attache/détachement en
 * % du pool et leur perte se rend en % de LEUR notionnel, bornée à [0, 100].
 * Les pièges martelés ici : le spread rendu en % au lieu de pb, la LGD oubliée
 * (PD implicite = spread/100 tout court), le réflexe additif n × PD pour le
 * défaut cumulé, les pb non divisés par 100 dans un rendement ou une spread
 * duration, le brut comparé au sans-risque au lieu du net, le vendeur de CDS
 * qui « rembourse le notionnel », la base inversée, l'attache confondue avec le
 * détachement et le clamp oublié. L'ordre des tirages de chaque moule est
 * documenté dans son commentaire « Tirages (ordre strict) ».
 */
import { formatNombreLangue } from '../../../engine/answers';
import { mulberry32, pick, randFloat, randInt } from '../../../engine/rng';
import type { ExerciseGenerator, Langue } from '../../../engine/types';
import {
  baseCdsPb,
  paiementDefautCdsMillions,
  pdImplicitePct,
  perteAttenduePct,
  perteTranchePct,
  primeCdsAnnuelleEur,
  prixObligationRisquee,
  probaDefautCumuleePct,
  probaSurvieCumuleePct,
  rendementNetDefautsPct,
  spreadCreditPb,
  spreadTheoriquePb,
  variationPrixSpreadPct,
} from './calculs';

const M5 = '05-credit';

const r2 = (v: number) => Math.round(v * 100) / 100;

/** Formateurs dépendants de la langue : nombre, pourcentage, signé, points de base, euros, millions. */
function formatters(langue: Langue) {
  const f = (v: number, d = 2) => formatNombreLangue(langue, v, d);
  const pct = (v: number, d = 2) => (langue === 'en' ? `${f(v, d)}%` : `${f(v, d)} %`);
  /** Nombre signé (+20 / −2,25), pour les variations et la base. */
  const sgn = (v: number, d = 2) => (v > 0 ? `+${f(v, d)}` : f(v, d));
  const pb = (v: number, d = 0) => (langue === 'en' ? `${f(v, d)} bp` : `${f(v, d)} pb`);
  const eur = (v: number, d = 0) => (langue === 'en' ? `€${f(v, d)}` : `${f(v, d)} €`);
  const meur = (v: number, d = 0) => (langue === 'en' ? `€${f(v, d)}m` : `${f(v, d)} M€`);
  return { f, pct, sgn, pb, eur, meur };
}

// ---------------------------------------------------------------------------
// 1. Le spread de crédit (N1)
// ---------------------------------------------------------------------------
export const genSpreadCredit: ExerciseGenerator = {
  id: 'm5-ex-01',
  moduleId: M5,
  titre: 'Le spread de crédit',
  titreEn: 'The credit spread',
  difficulte: 1,
  // Tirages (ordre strict) : 1. habillage = pick(['ig', 'bb', 'b']) ·
  // 2. rSans = randFloat(1.5, 4, 1) · 3. sIg = randInt(12, 30) × 5 (60-150 pb)
  // · 4. sBb = randInt(30, 60) × 5 (150-300 pb) · 5. sB = randInt(60, 110) × 5
  // (300-550 pb). Le rendement de l'obligation est CONSTRUIT comme rSans +
  // spread/100 : la réponse (spreadCreditPb) retombe exactement sur le spread
  // tiré, un multiple de 5 pb propre. Les bandes suivent les repères du ch1 :
  // IG 80-150 pb en temps calme, crossover 150-300, high yield 300-500.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const habillage = pick(rng, ['ig', 'bb', 'b'] as const);
    const rSans = randFloat(rng, 1.5, 4, 1);
    const sIg = randInt(rng, 12, 30) * 5;
    const sBb = randInt(rng, 30, 60) * 5;
    const sB = randInt(rng, 60, 110) * 5;

    const estIg = habillage === 'ig';
    const estBb = habillage === 'bb';
    const spread = estIg ? sIg : estBb ? sBb : sB;
    const rOblig = r2(rSans + spread / 100);
    const reponse = r2(spreadCreditPb(rOblig, rSans));
    const fauxPct = r2(reponse / 100);

    const en = langue === 'en';
    const { f, pct, pb } = formatters(langue);
    const emetteurFr = estIg
      ? 'un industriel noté BBB'
      : estBb
        ? 'un émetteur BB, à la frontière du high yield'
        : 'un émetteur B, cœur du high yield';
    const emetteurEn = estIg
      ? 'a BBB-rated industrial'
      : estBb
        ? 'a BB issuer, right at the high-yield frontier'
        : 'a single-B issuer, core high yield';
    return {
      enonce: en
        ? `On the credit desk, a 5-year bond issued by ${emetteurEn} yields ${pct(rOblig, 2)}. The government bond of the SAME maturity yields ${pct(rSans, 2)}.\n\n**What is the credit spread, in basis points?**`
        : `Sur le desk crédit, une obligation 5 ans émise par ${emetteurFr} rend ${pct(rOblig, 2)}. L'emprunt d'État de MÊME maturité rend ${pct(rSans, 2)}.\n\n**Quel est le spread de crédit, en points de base ?**`,
      reponse,
      tolerance: 0.005,
      unite: en ? 'bp' : 'pb',
      etapes: [
        {
          titre: en ? 'Subtract, then convert' : 'Soustraire, puis convertir',
          contenu: en
            ? `$s = (y_{\\text{bond}} - y_{\\text{risk-free}}) × 100 = (${f(rOblig, 2)}\\,\\% - ${f(rSans, 2)}\\,\\%) × 100$ = **${pb(reponse)}**. The spread is the price of default risk, quoted in the credit desk's native language: basis points, where 100 bp = 1%. The subtraction is trivial — the whole exercise is speaking the right unit without hesitating.`
            : `$s = (y_{\\text{oblig}} - y_{\\text{sans risque}}) × 100 = (${f(rOblig, 2)}\\,\\% - ${f(rSans, 2)}\\,\\%) × 100$ = **${pb(reponse)}**. Le spread est le prix du risque de défaut, coté dans la langue maternelle du desk crédit : le point de base, où 100 pb = 1 %. La soustraction est triviale — tout l'exercice est de parler la bonne unité sans hésiter.`,
        },
        {
          titre: en ? 'Read it on the scale' : 'Le lire sur l\'échelle',
          contenu: en
            ? `The calm-times anchors of chapter 1: euro investment grade 80-150 bp, high yield 300-500 bp, distressed above 1,000 bp; on indices, iTraxx Main around 50-80 bp, Crossover around 250-400 bp. Your ${pb(reponse)} reads as ${estIg ? 'a well-behaved investment grade name' : estBb ? 'a crossover name — the IG/HY frontier, where rating cliffs force mechanical selling' : 'a genuine high-yield name, where the spread is most of the yield'}. A credit trader never says "risk aversion is rising": they say "the spread widened by 40 bp".`
            : `Les repères de temps calme du chapitre 1 : investment grade euro 80-150 pb, high yield 300-500 pb, distressed au-delà de 1 000 pb ; côté indices, iTraxx Main autour de 50-80 pb, Crossover autour de 250-400 pb. Vos ${pb(reponse)} se lisent comme ${estIg ? 'une signature investment grade sage' : estBb ? 'un nom crossover — la frontière IG/HY, là où les cliffs de notation forcent des ventes mécaniques' : 'du vrai high yield, où le spread fait l\'essentiel du rendement'}. Un trader crédit ne dit jamais « l'aversion au risque monte » : il dit « le spread s'écarte de 40 pb ».`,
        },
        {
          titre: en ? 'What lives inside the spread' : 'Ce que le spread contient',
          contenu: en
            ? `The spread is not just the expected loss PD × LGD (chapter 3 converts it: exercise 4): it also carries a risk premium, a liquidity premium, sometimes tax effects — which is why the observed spread sits SYSTEMATICALLY above the actuarial one. This is THE number module 11 watched blow out in every crisis; here you learn to read it in peacetime, so that the widening means something when it comes.`
            : `Le spread n'est pas que la perte attendue PD × LGD (le chapitre 3 fait la conversion : exercice 4) : il embarque aussi une prime de risque, une prime de liquidité, parfois de la fiscalité — d'où un spread observé SYSTÉMATIQUEMENT au-dessus du spread actuariel. C'est LE chiffre que le module 11 regardait s'envoler dans chaque crise ; ici on apprend à le lire en temps de paix, pour que l'écartement veuille dire quelque chose le jour venu.`,
        },
      ],
      pieges: [
        en
          ? `Answering ${pct(fauxPct, 2)} — the difference in percent — when the question asks for basis points: ${pb(reponse)}, a factor of 100. The desk quotes credit in bp; get the reflex both ways: divide by 100 to go back to percent, multiply by 100 to speak spread.`
          : `Répondre ${pct(fauxPct, 2)} — l'écart en pour cent — quand la question demande des points de base : ${pb(reponse)}, un facteur 100. Le desk cote le crédit en pb ; installez le réflexe dans les deux sens : diviser par 100 pour revenir aux %, multiplier par 100 pour parler spread.`,
        en
          ? `Measuring against a risk-free rate of a DIFFERENT maturity: you would capture the slope of the yield curve, not the credit. The spread compares like with like — same maturity, same currency; that is why the desk prefers the Z-spread when curves are steep (chapter 4).`
          : `Mesurer contre un sans-risque d'une AUTRE maturité : on capturerait la pente de la courbe des taux, pas le crédit. Le spread compare ce qui est comparable — même maturité, même devise ; c'est pour cela que le desk préfère le Z-spread quand les courbes sont pentues (chapitre 4).`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 2. La perte attendue (N1)
// ---------------------------------------------------------------------------
export const genPerteAttendue: ExerciseGenerator = {
  id: 'm5-ex-02',
  moduleId: M5,
  titre: 'La perte attendue',
  titreEn: 'Expected loss',
  difficulte: 1,
  // Tirages (ordre strict) : 1. pd = randFloat(0.5, 8, 1) · 2. recouvrement =
  // pick([20, 30, 40, 60]) · 3. habillage = pick(['nom', 'portefeuille']).
  // Réponse = perteAttenduePct(pd, R) — l'ancre du ch3 : (PD 2 %, R 40 %)
  // = 1,2 %. Le faux du piège (PD × R au lieu de PD × LGD) est recalculé
  // dans le corrigé.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const pd = randFloat(rng, 0.5, 8, 1);
    const recouvrement = pick(rng, [20, 30, 40, 60] as const);
    const habillage = pick(rng, ['nom', 'portefeuille'] as const);

    const lgd = 100 - recouvrement;
    const reponse = r2(perteAttenduePct(pd, recouvrement));
    const fauxR = r2((pd * recouvrement) / 100);
    const estNom = habillage === 'nom';

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    return {
      enonce: en
        ? estNom
          ? `Your analyst puts the annual default probability of an issuer at ${pct(pd, 1)}; in default, the expected recovery on the senior unsecured debt is ${pct(recouvrement, 0)} of par.\n\n**What is the annual expected loss, in % of the nominal?**`
          : `A loan portfolio carries an average annual default probability of ${pct(pd, 1)} and an average recovery rate of ${pct(recouvrement, 0)}.\n\n**What is the annual expected loss, in % of the nominal?**`
        : estNom
          ? `Votre analyste estime la probabilité de défaut annuelle d'un émetteur à ${pct(pd, 1)} ; en cas de défaut, le recouvrement attendu sur la dette senior unsecured est de ${pct(recouvrement, 0)} du pair.\n\n**Quelle est la perte attendue annuelle, en % du nominal ?**`
          : `Un portefeuille de prêts affiche une probabilité de défaut annuelle moyenne de ${pct(pd, 1)} et un taux de recouvrement moyen de ${pct(recouvrement, 0)}.\n\n**Quelle est la perte attendue annuelle, en % du nominal ?**`,
      reponse,
      tolerance: 0.005,
      unite: '%',
      etapes: [
        {
          titre: en ? 'First, the LGD' : 'D\'abord, la LGD',
          contenu: en
            ? `In default you do not lose everything: the recovery pays back ${pct(recouvrement, 0)} of the nominal, so the loss given default is $LGD = 100 - R = 100 - ${f(recouvrement, 0)}$ = **${pct(lgd, 0)}**. R ≈ 40% is the market convention for senior unsecured in calm times — a convention, not a law: the Lehman auction set it at 8.625% (exercise 11).`
            : `Au défaut, on ne perd pas tout : le recouvrement rend ${pct(recouvrement, 0)} du nominal, donc la perte en cas de défaut vaut $LGD = 100 - R = 100 - ${f(recouvrement, 0)}$ = **${pct(lgd, 0)}**. R ≈ 40 % est la convention de marché du senior unsecured en temps calme — une convention, pas une loi : l'enchère Lehman l'a fixé à 8,625 % (exercice 11).`,
        },
        {
          titre: en ? 'Three letters that sum up the business' : 'Trois lettres qui résument le métier',
          contenu: en
            ? `$EL = PD × LGD = ${f(pd, 1)}\\,\\% × ${f(lgd, 0)}\\,\\%$ = **${pct(reponse, 2)}** per year. This is the central formula of the module: how much I expect to lose, per year, for carrying this name. Chapter 3's anchor to recite: PD 2%, R 40% ⇒ EL = 1.2%.`
            : `$EL = PD × LGD = ${f(pd, 1)}\\,\\% × ${f(lgd, 0)}\\,\\%$ = **${pct(reponse, 2)}** par an. C'est la formule centrale du module : combien je m'attends à perdre, par an, en portant ce nom. L'ancre du chapitre 3 à réciter : PD 2 %, R 40 % ⇒ EL = 1,2 %.`,
        },
        {
          titre: en ? 'An expectation, not a forecast' : 'Une espérance, pas une prévision',
          contenu: en
            ? `The real year never delivers ${pct(-reponse, 2)}: it delivers 0 (survival, probability ${pct(r2(100 - pd), 1)}) or −${pct(lgd, 0)} (default, probability ${pct(pd, 1)}). The EL is the average of a violently asymmetric lottery — which is exactly why observed spreads pay a premium ABOVE the EL: the market charges for the stress, not just for the mean.`
            : `L'année réelle ne donne jamais ${pct(-reponse, 2)} : elle donne 0 (survie, probabilité ${pct(r2(100 - pd), 1)}) ou −${pct(lgd, 0)} (défaut, probabilité ${pct(pd, 1)}). L'EL est la moyenne d'une loterie violemment asymétrique — raison exacte pour laquelle les spreads observés paient une prime AU-DESSUS de l'EL : le marché fait payer le stress, pas seulement la moyenne.`,
        },
      ],
      pieges: [
        en
          ? `Multiplying by R instead of LGD: $${f(pd, 1)}\\,\\% × ${f(recouvrement, 0)}\\,\\% = ${pct(fauxR, 2)}$ instead of ${pct(reponse, 2)}. The recovery is what you get BACK — what you lose is the complement, 100 − R. Say "loss given default" out loud before multiplying.`
          : `Multiplier par R au lieu de la LGD : $${f(pd, 1)}\\,\\% × ${f(recouvrement, 0)}\\,\\% = ${pct(fauxR, 2)}$ au lieu de ${pct(reponse, 2)}. Le recouvrement est ce qu'on RÉCUPÈRE — ce qu'on perd est le complément, 100 − R. Dites « perte en cas de défaut » à voix haute avant de multiplier.`,
        en
          ? `Reading the EL as "what I will lose this year": no single year ever loses ${pct(reponse, 2)} — outcomes are 0 or −${pct(lgd, 0)}. Confusing an expectation with a realisation is how yield hunters book the coupon and forget the lottery behind it.`
          : `Lire l'EL comme « ce que je vais perdre cette année » : aucune année ne perd ${pct(reponse, 2)} — les issues sont 0 ou −${pct(lgd, 0)}. Confondre espérance et réalisation, c'est la façon dont les chasseurs de rendement encaissent le coupon en oubliant la loterie derrière.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 3. La prime annuelle d'un CDS (N1)
// ---------------------------------------------------------------------------
export const genPrimeCds: ExerciseGenerator = {
  id: 'm5-ex-03',
  moduleId: M5,
  titre: 'La prime annuelle d\'un CDS',
  titreEn: 'The annual CDS premium',
  difficulte: 1,
  // Tirages (ordre strict) : 1. notionnel = pick([5, 10, 15, 20, 25, 50]) (M€)
  // · 2. spread = randInt(10, 120) × 5 (50-600 pb).
  // Réponse = primeCdsAnnuelleEur, en euros — l'ancre du ch5 : 10 M à 200 pb
  // = 200 000 €/an, versés par quarts trimestriels. Le faux du piège (pb lus
  // comme des %) est recalculé dans le corrigé.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const notionnel = pick(rng, [5, 10, 15, 20, 25, 50] as const);
    const spread = randInt(rng, 10, 120) * 5;

    const reponse = r2(primeCdsAnnuelleEur(notionnel, spread));
    const trimestre = r2(reponse / 4);
    const fauxCent = r2(notionnel * 1e6 * (spread / 100));

    const en = langue === 'en';
    const { f, eur, meur, pb } = formatters(langue);
    return {
      enonce: en
        ? `Your desk buys CDS protection on a corporate issuer: notional ${meur(notionnel)}, quoted at ${pb(spread)} per year.\n\n**What annual premium do you pay, in euros?**`
        : `Votre desk achète une protection CDS sur un émetteur corporate : notionnel de ${meur(notionnel)}, coté ${pb(spread)} par an.\n\n**Quelle prime annuelle payez-vous, en euros ?**`,
      reponse,
      tolerance: 0.005,
      unite: '€',
      etapes: [
        {
          titre: en ? 'Convert the spread first' : 'D\'abord convertir le spread',
          contenu: en
            ? `${pb(spread)} means $${f(spread, 0)}/10\\,000 = ${f(r2(spread / 100), 2)}\\,\\%$ of the notional per year. The CDS premium is quoted exactly like a bond spread — in basis points of notional per annum: the credit desk's single unit for everything.`
            : `${pb(spread)} signifie $${f(spread, 0)}/10\\,000 = ${f(r2(spread / 100), 2)}\\,\\%$ du notionnel par an. La prime CDS se cote exactement comme un spread obligataire — en points de base du notionnel par an : l'unité unique du desk crédit pour tout.`,
        },
        {
          titre: en ? 'The fixed leg' : 'La jambe fixe',
          contenu: en
            ? `$\\text{premium} = \\text{notional} × \\dfrac{s}{10\\,000} = ${f(notionnel, 0)}\\,\\text{M} × \\dfrac{${f(spread, 0)}}{10\\,000}$ = **${eur(reponse)}** per year, paid in quarterly instalments of ${eur(trimestre)} on the standard dates (20 March, June, September, December) — for as long as the reference entity survives. At default, the payments stop, accrued pro rata.`
            : `$\\text{prime} = \\text{notionnel} × \\dfrac{s}{10\\,000} = ${f(notionnel, 0)}\\,\\text{M} × \\dfrac{${f(spread, 0)}}{10\\,000}$ = **${eur(reponse)}** par an, versés par quarts trimestriels de ${eur(trimestre)} aux dates standardisées (20 mars, juin, septembre, décembre) — tant que l'entité de référence survit. Au défaut, les versements s'arrêtent, au prorata du couru.`,
        },
        {
          titre: en ? 'The order of magnitude to carry around' : 'L\'ordre de grandeur à retenir',
          contenu: en
            ? `100 bp = 0.1% = €0.1m per year on €10m of notional: protection is counted in tenths of a percent. That smallness is the whole psychology of the market — the seller collects small and regular, against a rare and massive payout (exercise 11): the option-seller's profile, AIG's position in miniature.`
            : `100 pb = 0,1 % = 0,1 M€ par an pour 10 M€ de notionnel : la protection se compte en dixièmes de pour cent. Cette petitesse est toute la psychologie du marché — le vendeur encaisse petit et régulier, contre un versement rare et massif (exercice 11) : le profil du vendeur d'options, la position AIG en miniature.`,
        },
      ],
      pieges: [
        en
          ? `Reading the bp as percent: ${f(notionnel, 0)} M × ${f(spread, 0)}/100 = ${eur(fauxCent)} — a factor of 100 too big. Basis points divide by 10,000, not by 100; a premium worth ${f(r2((fauxCent / (notionnel * 1e6)) * 100), 0)}% of notional per year should have set off the alarm.`
          : `Lire les pb comme des % : ${f(notionnel, 0)} M × ${f(spread, 0)}/100 = ${eur(fauxCent)} — un facteur 100 de trop. Les points de base divisent par 10 000, pas par 100 ; une prime valant ${f(r2((fauxCent / (notionnel * 1e6)) * 100), 0)} % du notionnel par an aurait dû mettre la puce à l'oreille.`,
        en
          ? `Believing the premium is a one-off payment at signing, or confusing the legs: what YOU pay is the running fixed leg, every year of survival; what you would RECEIVE at default is the protection leg, notional × (1 − R) — that is exercise 11.`
          : `Croire la prime payée une fois pour toutes à la signature, ou confondre les jambes : ce que VOUS payez est la jambe fixe, qui court chaque année de survie ; ce que vous RECEVRIEZ au défaut est la jambe de protection, notionnel × (1 − R) — c'est l'exercice 11.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 4. Le spread théorique (N2)
// ---------------------------------------------------------------------------
export const genSpreadTheorique: ExerciseGenerator = {
  id: 'm5-ex-04',
  moduleId: M5,
  titre: 'Le spread actuariel théorique',
  titreEn: 'The theoretical (actuarial) spread',
  difficulte: 2,
  // Tirages (ordre strict) : 1. pd = randFloat(0.5, 6, 1) · 2. recouvrement =
  // pick([20, 30, 40, 60]).
  // Réponse = spreadTheoriquePb(pd, R) — l'ancre du ch3 : (PD 2 %, R 40 %)
  // = 120 pb. Le faux « LGD oubliée » (PD × 100) est recalculé dans le corrigé.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const pd = randFloat(rng, 0.5, 6, 1);
    const recouvrement = pick(rng, [20, 30, 40, 60] as const);

    const lgd = 100 - recouvrement;
    const el = r2(perteAttenduePct(pd, recouvrement));
    const reponse = r2(spreadTheoriquePb(pd, recouvrement));
    const fauxSansLgd = r2(pd * 100);

    const en = langue === 'en';
    const { f, pct, pb } = formatters(langue);
    return {
      enonce: en
        ? `An issuer carries an annual default probability of ${pct(pd, 1)} with an expected recovery of ${pct(recouvrement, 0)}.\n\n**What annual spread, in basis points, exactly compensates the expected loss (the actuarial spread)?**`
        : `Un émetteur porte une probabilité de défaut annuelle de ${pct(pd, 1)} avec un recouvrement attendu de ${pct(recouvrement, 0)}.\n\n**Quel spread annuel, en points de base, compense exactement la perte attendue (le spread actuariel) ?**`,
      reponse,
      tolerance: 0.005,
      unite: en ? 'bp' : 'pb',
      etapes: [
        {
          titre: en ? 'The expected loss' : 'La perte attendue',
          contenu: en
            ? `$EL = PD × LGD = ${f(pd, 1)}\\,\\% × (100 - ${f(recouvrement, 0)})\\,\\% = ${f(pd, 1)}\\,\\% × ${f(lgd, 0)}\\,\\%$ = **${pct(el, 2)}** per year. This is the actuarial bill of carrying the name (exercise 2): the spread must at least pay it back, year after year.`
            : `$EL = PD × LGD = ${f(pd, 1)}\\,\\% × (100 - ${f(recouvrement, 0)})\\,\\% = ${f(pd, 1)}\\,\\% × ${f(lgd, 0)}\\,\\%$ = **${pct(el, 2)}** par an. C'est la facture actuarielle du portage (exercice 2) : le spread doit au minimum la rembourser, année après année.`,
        },
        {
          titre: en ? 'Convert into the desk\'s unit' : 'Convertir dans l\'unité du desk',
          contenu: en
            ? `$s_{\\text{theoretical}} = EL × 100 = ${f(el, 2)}\\,\\% × 100$ = **${pb(reponse)}**. Chapter 3's anchor: PD 2%, R 40% ⇒ 120 bp. The formula reads in both directions — this one prices a PD into a spread; exercise 5 reads the market's PD out of a spread.`
            : `$s_{\\text{théorique}} = EL × 100 = ${f(el, 2)}\\,\\% × 100$ = **${pb(reponse)}**. L'ancre du chapitre 3 : PD 2 %, R 40 % ⇒ 120 pb. La formule se lit dans les deux sens — ici on convertit une PD en spread ; l'exercice 5 lit la PD du marché dans un spread.`,
        },
        {
          titre: en ? 'The market always quotes above' : 'Le marché cote toujours au-dessus',
          contenu: en
            ? `The observed spread sits SYSTEMATICALLY above these ${pb(reponse)}: the excess pays the risk premium (the loss comes in bad years, correlated with everything else), the liquidity premium, sometimes taxes. That gap — market spread minus actuarial spread — is the remuneration of stress, not of the average default: the "credit risk premium puzzle" of chapter 3. Finding a bond quoted exactly at its actuarial spread should worry you, not thrill you.`
            : `Le spread observé cote SYSTÉMATIQUEMENT au-dessus de ces ${pb(reponse)} : l'excédent paie la prime de risque (la perte tombe les mauvaises années, corrélée à tout le reste), la prime de liquidité, parfois la fiscalité. Cet écart — spread de marché moins spread actuariel — rémunère le stress, pas le défaut moyen : le « credit risk premium puzzle » du chapitre 3. Trouver une obligation cotée exactement à son spread actuariel devrait inquiéter, pas réjouir.`,
        },
      ],
      pieges: [
        en
          ? `Forgetting the LGD: PD × 100 = ${pb(fauxSansLgd)} instead of ${pb(reponse)}. That implicitly assumes you lose EVERYTHING at default (R = 0) — with ${pct(recouvrement, 0)} recovered, the compensating spread is only the fraction ${f(lgd, 0)}/100 of that.`
          : `Oublier la LGD : PD × 100 = ${pb(fauxSansLgd)} au lieu de ${pb(reponse)}. C'est supposer implicitement qu'on perd TOUT au défaut (R = 0) — avec ${pct(recouvrement, 0)} récupérés, le spread compensateur n'est que la fraction ${f(lgd, 0)}/100 de ce chiffre.`,
        en
          ? `Delivering ${pct(el, 2)} when the question asks for basis points — same number, wrong dialect. And the conceptual twin: expecting the MARKET spread to equal this actuarial value; the excess above it is not an anomaly, it is the price of bearing pain at the worst times.`
          : `Rendre ${pct(el, 2)} quand la question demande des points de base — même nombre, mauvais dialecte. Et le jumeau conceptuel : attendre que le spread de MARCHÉ égale cette valeur actuarielle ; l'excédent au-dessus n'est pas une anomalie, c'est le prix de souffrir aux pires moments.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 5. La PD implicite dans un spread (N2)
// ---------------------------------------------------------------------------
export const genPdImplicite: ExerciseGenerator = {
  id: 'm5-ex-05',
  moduleId: M5,
  titre: 'La PD implicite dans un spread',
  titreEn: 'The default probability implied by a spread',
  difficulte: 2,
  // Tirages (ordre strict) : 1. spread = randInt(10, 120) × 5 (50-600 pb) ·
  // 2. recouvrement = pick([20, 30, 40, 60]) · 3. habillage = pick(['nom',
  // 'crossover']).
  // Réponse = pdImplicitePct(spread, R) — l'ancre du ch3 : (300 pb, R 40 %)
  // = 5 %/an. LE piège du moule (LGD oubliée : spread/100 tout court) et le
  // faux « division par R » sont recalculés dans le corrigé.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const spread = randInt(rng, 10, 120) * 5;
    const recouvrement = pick(rng, [20, 30, 40, 60] as const);
    const habillage = pick(rng, ['nom', 'crossover'] as const);

    const lgd = 100 - recouvrement;
    const reponse = r2(pdImplicitePct(spread, recouvrement));
    const fauxSansLgd = r2(spread / 100);
    const fauxDivR = r2(spread / 100 / (recouvrement / 100));
    const estNom = habillage === 'nom';

    const en = langue === 'en';
    const { f, pct, pb } = formatters(langue);
    return {
      enonce: en
        ? estNom
          ? `An issuer's 5-year CDS quotes ${pb(spread)}. Assume a recovery rate of ${pct(recouvrement, 0)}.\n\n**What annual default probability is the market pricing?**`
          : `The iTraxx Crossover trades at ${pb(spread)}. Assume an average recovery rate of ${pct(recouvrement, 0)} across the index names.\n\n**What annual default probability is the market pricing?**`
        : estNom
          ? `Le CDS 5 ans d'un émetteur cote ${pb(spread)}. Hypothèse : taux de recouvrement de ${pct(recouvrement, 0)}.\n\n**Quelle probabilité de défaut annuelle le marché price-t-il ?**`
          : `L'iTraxx Crossover traite à ${pb(spread)}. Hypothèse : recouvrement moyen de ${pct(recouvrement, 0)} sur les noms de l'indice.\n\n**Quelle probabilité de défaut annuelle le marché price-t-il ?**`,
      reponse,
      tolerance: 0.005,
      unite: '%',
      etapes: [
        {
          titre: en ? 'Back to percent' : 'Revenir aux pour cent',
          contenu: en
            ? `${pb(spread)} = $${f(spread, 0)}/100 = ${pct(r2(spread / 100), 2)}$ of expected loss per year, paid by the spread. The desk's inverse reading: "what is the market pricing?" — the spread IS an expected-loss quote; the exercise is to unpack it.`
            : `${pb(spread)} = $${f(spread, 0)}/100 = ${pct(r2(spread / 100), 2)}$ de perte attendue par an, payée par le spread. La lecture inverse du desk : « le marché price quoi ? » — le spread EST une cotation de perte attendue ; l'exercice consiste à la déplier.`,
        },
        {
          titre: en ? 'Divide by the LGD, not by R' : 'Diviser par la LGD, pas par R',
          contenu: en
            ? `Since $s \\approx PD × LGD$, invert: $PD = \\dfrac{s/100}{1 - R/100} = \\dfrac{${f(r2(spread / 100), 2)}\\,\\%}{${f(r2(lgd / 100), 2)}}$ = **${pct(reponse, 2)}** per year. Chapter 3's anchor: 300 bp with R = 40% ⇒ 5%/year. The smaller the loss per default, the MORE defaults it takes to justify a given spread — hence the division by the LGD.`
            : `Puisque $s \\approx PD × LGD$, on inverse : $PD = \\dfrac{s/100}{1 - R/100} = \\dfrac{${f(r2(spread / 100), 2)}\\,\\%}{${f(r2(lgd / 100), 2)}}$ = **${pct(reponse, 2)}** par an. L'ancre du chapitre 3 : 300 pb avec R = 40 % ⇒ 5 %/an. Plus la perte par défaut est petite, plus il faut de défauts pour justifier un spread donné — d'où la division par la LGD.`,
        },
        {
          titre: en ? 'A risk-neutral probability' : 'Une probabilité risque-neutre',
          contenu: en
            ? `These ${pct(reponse, 2)} are a RISK-NEUTRAL PD: they overstate the historical default frequency, precisely because the spread carries a risk premium on top of the pure expected loss. The gap between market-implied and realised default rates is not a model error — it is the risk premium, made visible. Quote it as "the market prices", never as "the issuer will default with probability".`
            : `Ces ${pct(reponse, 2)} sont une PD RISQUE-NEUTRE : elle surestime la fréquence historique des défauts, précisément parce que le spread contient une prime de risque au-dessus de la perte attendue pure. L'écart entre PD implicite et taux de défaut réalisés n'est pas une erreur de modèle — c'est la prime de risque, rendue visible. Dites « le marché price », jamais « l'émetteur fera défaut avec probabilité ».`,
        },
      ],
      pieges: [
        en
          ? `THE trap of the formula — forgetting the LGD: ${f(spread, 0)}/100 = ${pct(fauxSansLgd, 2)}, as if each default cost the full nominal. With only ${pct(lgd, 0)} lost per default, the implied PD must be HIGHER: ${pct(reponse, 2)}. The spread prices a loss, not a body count.`
          : `LE piège de la formule — oublier la LGD : ${f(spread, 0)}/100 = ${pct(fauxSansLgd, 2)}, comme si chaque défaut coûtait tout le nominal. Avec seulement ${pct(lgd, 0)} perdus par défaut, la PD implicite doit être PLUS HAUTE : ${pct(reponse, 2)}. Le spread price une perte, pas un nombre de morts.`,
        en
          ? `Dividing by R instead of by the LGD: ${f(r2(spread / 100), 2)}/${f(r2(recouvrement / 100), 2)} = ${pct(fauxDivR, 2)} — the recovery is what survives the default, not what the spread must fund. Same reflex as exercise 2: say "loss given default" before dividing.`
          : `Diviser par R au lieu de la LGD : ${f(r2(spread / 100), 2)}/${f(r2(recouvrement / 100), 2)} = ${pct(fauxDivR, 2)} — le recouvrement est ce qui survit au défaut, pas ce que le spread doit financer. Même réflexe qu'à l'exercice 2 : dire « perte en cas de défaut » avant de diviser.`,
        en
          ? `Reading the result as a forecast of realised defaults: the risk-neutral PD systematically overshoots history. Comparing it with the rating agencies' historical PD for the same rating is precisely how a desk measures how much premium the market is charging.`
          : `Lire le résultat comme une prévision des défauts réalisés : la PD risque-neutre surestime systématiquement l'historique. La comparer à la PD historique des agences pour la même notation est précisément la façon dont un desk mesure la prime que le marché fait payer.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 6. La survie cumulée (N2)
// ---------------------------------------------------------------------------
export const genSurvieCumulee: ExerciseGenerator = {
  id: 'm5-ex-06',
  moduleId: M5,
  titre: 'La survie cumulée',
  titreEn: 'Cumulative survival',
  difficulte: 2,
  // Tirages (ordre strict) : 1. pd = randFloat(0.5, 8, 1) · 2. annees =
  // randInt(3, 10).
  // Réponse = probaSurvieCumuleePct(pd, n) — composition DISCRÈTE annuelle,
  // l'ancre du ch3 : (PD 2 %, 5 ans) = 90,392080 %. Le faux linéaire
  // 100 − n × PD est recalculé dans le corrigé.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const pd = randFloat(rng, 0.5, 8, 1);
    const annees = randInt(rng, 3, 10);

    const reponse = r2(probaSurvieCumuleePct(pd, annees));
    const survieUnAn = r2(100 - pd);
    const fauxLineaire = r2(100 - annees * pd);
    const ecart = r2(reponse - fauxLineaire);

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    return {
      enonce: en
        ? `An issuer carries a constant annual default probability of ${pct(pd, 1)}. You hold its ${f(annees, 0)}-year bond to maturity.\n\n**What is the probability, in %, that the issuer survives the full ${f(annees, 0)} years?**`
        : `Un émetteur porte une probabilité de défaut annuelle constante de ${pct(pd, 1)}. Vous détenez son obligation ${f(annees, 0)} ans jusqu'à maturité.\n\n**Quelle est la probabilité, en %, que l'émetteur survive les ${f(annees, 0)} années entières ?**`,
      reponse,
      tolerance: 0.005,
      unite: '%',
      etapes: [
        {
          titre: en ? 'Survive one year' : 'Survivre un an',
          contenu: en
            ? `Each year, the issuer survives with probability $1 - PD = 1 - ${f(pd, 1)}\\,\\% = ${pct(survieUnAn, 1)}$. Surviving the whole horizon means surviving year 1 AND year 2 AND … AND year ${f(annees, 0)} — an intersection of events, hence a product.`
            : `Chaque année, l'émetteur survit avec probabilité $1 - PD = 1 - ${f(pd, 1)}\\,\\% = ${pct(survieUnAn, 1)}$. Survivre à l'horizon entier, c'est survivre l'année 1 ET l'année 2 ET … ET l'année ${f(annees, 0)} — une intersection d'événements, donc un produit.`,
        },
        {
          titre: en ? 'Compound the survival' : 'Composer la survie',
          contenu: en
            ? `$S(${f(annees, 0)}) = 100 × (1 - ${f(pd, 1)}\\,\\%)^{${f(annees, 0)}}$ = **${pct(reponse, 2)}**. Discrete annual compounding — exactly the compound-interest arithmetic of module 4, applied to survival probabilities. Chapter 3's anchor: PD 2%, 5 years ⇒ 90.392080%.`
            : `$S(${f(annees, 0)}) = 100 × (1 - ${f(pd, 1)}\\,\\%)^{${f(annees, 0)}}$ = **${pct(reponse, 2)}**. Composition discrète annuelle — exactement l'arithmétique des intérêts composés du module 4, appliquée aux probabilités de survie. L'ancre du chapitre 3 : PD 2 %, 5 ans ⇒ 90,392080 %.`,
        },
        {
          titre: en ? 'The decay is not linear' : 'La décroissance n\'est pas linéaire',
          contenu: en
            ? `The linear guess $100 - ${f(annees, 0)} × ${f(pd, 1)} = ${pct(fauxLineaire, 1)}$ misses by ${f(Math.abs(ecart), 2)} points — always too pessimistic, because it makes the dead default again. The gap grows with the horizon: surviving 10 years at PD 5% is not "50/50", it is 59.87%. This survival curve is the backbone of every CDS pricer (the risky duration of chapter 5 weights each premium by it).`
            : `L'estimation linéaire $100 - ${f(annees, 0)} × ${f(pd, 1)} = ${pct(fauxLineaire, 1)}$ se trompe de ${f(Math.abs(ecart), 2)} points — toujours trop pessimiste, parce qu'elle fait re-défaillir les morts. L'écart grandit avec l'horizon : survivre 10 ans à PD 5 % n'a rien de « 50/50 », c'est 59,87 %. Cette courbe de survie est la colonne vertébrale de tout pricer CDS (la duration risquée du chapitre 5 pondère chaque prime par elle).`,
        },
      ],
      pieges: [
        en
          ? `The linear reflex 100 − n × PD = ${pct(fauxLineaire, 1)} instead of ${pct(reponse, 2)}: defaults do not add up, they compound (exercise 7 quantifies the mirror error on the default side). Sanity check: the linear formula goes NEGATIVE on a long enough horizon — a probability cannot.`
          : `Le réflexe linéaire 100 − n × PD = ${pct(fauxLineaire, 1)} au lieu de ${pct(reponse, 2)} : les défauts ne s'additionnent pas, ils se composent (l'exercice 7 chiffre l'erreur miroir côté défaut). Garde-fou : la formule linéaire devient NÉGATIVE sur un horizon assez long — une probabilité, jamais.`,
        en
          ? `Compounding the PD instead of the survival: $(${f(pd, 1)}\\,\\%)^{${f(annees, 0)}}$ is the probability of defaulting EVERY year — essentially zero, and meaningless (you only die once). The object that compounds is the survival, $(1 - PD)^n$.`
          : `Composer la PD au lieu de la survie : $(${f(pd, 1)}\\,\\%)^{${f(annees, 0)}}$ est la probabilité de faire défaut CHAQUE année — quasi nulle, et absurde (on ne meurt qu'une fois). L'objet qui se compose est la survie, $(1 - PD)^n$.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 7. Le défaut cumulé (N2)
// ---------------------------------------------------------------------------
export const genDefautCumule: ExerciseGenerator = {
  id: 'm5-ex-07',
  moduleId: M5,
  titre: 'Le défaut cumulé',
  titreEn: 'Cumulative default',
  difficulte: 2,
  // Tirages (ordre strict) : 1. pd = randFloat(1, 8, 1) · 2. annees =
  // randInt(3, 10).
  // Réponse = probaDefautCumuleePct(pd, n) — l'ancre du ch3 : (PD 2 %, 5 ans)
  // = 9,607920 %, PAS 10 %. Le faux additif n × PD (piège n° 1 du chapitre)
  // est recalculé et chiffré dans les pièges.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const pd = randFloat(rng, 1, 8, 1);
    const annees = randInt(rng, 3, 10);

    const reponse = r2(probaDefautCumuleePct(pd, annees));
    const survie = r2(probaSurvieCumuleePct(pd, annees));
    const fauxAdditif = r2(annees * pd);
    const ecart = r2(fauxAdditif - reponse);

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    return {
      enonce: en
        ? `A high-yield issuer carries a constant annual default probability of ${pct(pd, 1)}.\n\n**What is the probability, in %, that it defaults at least once over ${f(annees, 0)} years?**`
        : `Un émetteur high yield porte une probabilité de défaut annuelle constante de ${pct(pd, 1)}.\n\n**Quelle est la probabilité, en %, qu'il fasse défaut au moins une fois sur ${f(annees, 0)} ans ?**`,
      reponse,
      tolerance: 0.005,
      unite: '%',
      etapes: [
        {
          titre: en ? 'Go through the survival' : 'Passer par la survie',
          contenu: en
            ? `"Defaults at least once" is the complement of "survives everything". First the survival (exercise 6): $S(${f(annees, 0)}) = 100 × (1 - ${f(pd, 1)}\\,\\%)^{${f(annees, 0)}}$ = **${pct(survie, 2)}**. To default in year 3, you must have survived years 1 and 2 — the composition does that bookkeeping for you.`
            : `« Défaut au moins une fois » est le complément de « survit à tout ». D'abord la survie (exercice 6) : $S(${f(annees, 0)}) = 100 × (1 - ${f(pd, 1)}\\,\\%)^{${f(annees, 0)}}$ = **${pct(survie, 2)}**. Pour faire défaut l'année 3, il faut avoir survécu aux années 1 et 2 — la composition tient cette comptabilité pour vous.`,
        },
        {
          titre: en ? 'Take the complement' : 'Prendre le complément',
          contenu: en
            ? `$PD_{\\text{cum}} = 100 - S(${f(annees, 0)}) = 100 - ${f(survie, 2)}$ = **${pct(reponse, 2)}**. Chapter 3's anchor: PD 2%, 5 years ⇒ 9.607920% — and NOT 10%. This cumulative curve is what a rating table shows when it prints default rates by horizon.`
            : `$PD_{\\text{cum}} = 100 - S(${f(annees, 0)}) = 100 - ${f(survie, 2)}$ = **${pct(reponse, 2)}**. L'ancre du chapitre 3 : PD 2 %, 5 ans ⇒ 9,607920 % — et PAS 10 %. Cette courbe cumulée est ce qu'affiche une table de notation quand elle imprime des taux de défaut par horizon.`,
        },
        {
          titre: en ? 'Measure the additive error' : 'Mesurer l\'erreur additive',
          contenu: en
            ? `The naive sum gives $${f(annees, 0)} × ${f(pd, 1)} = ${pct(fauxAdditif, 1)}$ — ${f(ecart, 2)} points too high, because it counts defaults of issuers already dead. The gap GROWS with the horizon: at PD 5% over 10 years, the additive says 50%, the truth is 40.13%. One-line summary for the oral: defaults do not add up, they compound — you have to be alive to die.`
            : `La somme naïve donne $${f(annees, 0)} × ${f(pd, 1)} = ${pct(fauxAdditif, 1)}$ — ${f(ecart, 2)} points de trop, parce qu'elle compte des défauts d'émetteurs déjà morts. L'écart GRANDIT avec l'horizon : à PD 5 % sur 10 ans, l'additif dit 50 %, la vérité est 40,13 %. Résumé d'oral en une ligne : les défauts ne s'additionnent pas, ils se composent — il faut être vivant pour mourir.`,
        },
      ],
      pieges: [
        en
          ? `THE trap of chapter 3 — adding: n × PD = ${pct(fauxAdditif, 1)} instead of ${pct(reponse, 2)}, already ${f(ecart, 2)} points off here. The formula denounces itself: on a long enough horizon, n × PD sails past 100% — a probability of default above certainty.`
          : `LE piège du chapitre 3 — additionner : n × PD = ${pct(fauxAdditif, 1)} au lieu de ${pct(reponse, 2)}, déjà ${f(ecart, 2)} points d'écart ici. La formule s'auto-dénonce : sur un horizon assez long, n × PD dépasse 100 % — une probabilité de défaut au-delà de la certitude.`,
        en
          ? `Compounding the wrong object: $100 × (1 - (${f(pd, 1)}\\,\\%)^{${f(annees, 0)}})$ or other creative rearrangements. Discipline: ALWAYS compute the survival $(1 - PD)^n$ first, then take the complement — the survival is the only thing that compounds cleanly.`
          : `Composer le mauvais objet : $100 × (1 - (${f(pd, 1)}\\,\\%)^{${f(annees, 0)}})$ ou autres réarrangements créatifs. Discipline : calculer TOUJOURS la survie $(1 - PD)^n$ d'abord, puis prendre le complément — la survie est la seule chose qui se compose proprement.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 8. Le prix d'une obligation risquée (N2)
// ---------------------------------------------------------------------------
export const genPrixObligationRisquee: ExerciseGenerator = {
  id: 'm5-ex-08',
  moduleId: M5,
  titre: 'Le prix d\'une obligation risquée',
  titreEn: 'Pricing a risky bond',
  difficulte: 2,
  // Tirages (ordre strict) : 1. coupon = randInt(2, 7) · 2. rSans = pick([2,
  // 2.5, 3, 3.5, 4]) · 3. spread = randInt(10, 80) × 5 (50-400 pb) · 4.
  // maturite = randInt(3, 8).
  // Réponse = prixObligationRisquee — la méthode du desk (ch4) : flux INTACTS,
  // défaut dans le taux d'actualisation y = r + s. L'ancre : coupon = y ⇒ pair.
  // Le faux « actualiser au sans-risque seul » (= prix sans spread) est
  // recalculé dans le corrigé — c'est aussi la matière de l'ex-14.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const coupon = randInt(rng, 2, 7);
    const rSans = pick(rng, [2, 2.5, 3, 3.5, 4] as const);
    const spread = randInt(rng, 10, 80) * 5;
    const maturite = randInt(rng, 3, 8);

    const y = r2(rSans + spread / 100);
    const reponse = r2(prixObligationRisquee(coupon, rSans, spread, maturite));
    const prixSansSpread = r2(prixObligationRisquee(coupon, rSans, 0, maturite));
    const auPair = Math.abs(coupon - y) < 1e-9;

    const en = langue === 'en';
    const { f, pct, pb } = formatters(langue);
    return {
      enonce: en
        ? `A corporate bond pays an annual coupon of ${pct(coupon, 0)}, matures in ${f(maturite, 0)} years and redeems at par (100). The risk-free rate for that maturity is ${pct(rSans, 1)} and the issuer's credit spread is ${pb(spread)}.\n\n**Using the desk method (all contractual flows discounted at y = r + s), what is the bond's price, in % of the nominal?**`
        : `Une obligation corporate paie un coupon annuel de ${pct(coupon, 0)}, arrive à maturité dans ${f(maturite, 0)} ans et rembourse au pair (100). Le taux sans risque de cette maturité est ${pct(rSans, 1)} et le spread de crédit de l'émetteur vaut ${pb(spread)}.\n\n**Par la méthode du desk (tous les flux contractuels actualisés à y = r + s), quel est le prix de l'obligation, en % du nominal ?**`,
      reponse,
      tolerance: 0.005,
      unite: en ? '% of par' : '% du nominal',
      etapes: [
        {
          titre: en ? 'The default goes into the rate, not the flows' : 'Le défaut va dans le taux, pas dans les flux',
          contenu: en
            ? `The desk method (chapter 4): keep every contractual flow INTACT — full coupons of ${f(coupon, 0)}, full redemption of 100, as if default did not exist — and discount everything at a single yield $y = r + s = ${f(rSans, 1)}\\,\\% + ${f(spread, 0)}/100\\,\\%$ = **${pct(y, 2)}**. All the credit risk is compressed into the discount rate; the flows never change.`
            : `La méthode du desk (chapitre 4) : garder tous les flux contractuels INTACTS — coupons pleins de ${f(coupon, 0)}, remboursement plein de 100, comme si le défaut n'existait pas — et tout actualiser à un rendement unique $y = r + s = ${f(rSans, 1)}\\,\\% + ${f(spread, 0)}/100\\,\\%$ = **${pct(y, 2)}**. Tout le risque de crédit est comprimé dans le taux d'actualisation ; les flux, eux, ne bougent jamais.`,
        },
        {
          titre: en ? 'Discount' : 'Actualiser',
          contenu: en
            ? `$P = \\sum_{t=1}^{${f(maturite, 0)}} \\dfrac{${f(coupon, 0)}}{(1+y)^t} + \\dfrac{100}{(1+y)^{${f(maturite, 0)}}}$ with $y = ${f(y, 2)}\\,\\%$ = **${f(reponse, 2)}**. ${auPair ? `No surprise: coupon = yield (${pct(coupon, 0)} = ${pct(y, 2)}) ⇒ the bond prices exactly at par — module 4's mental anchor, worth checking before any computation.` : `Sanity check with module 4's anchor: coupon ${coupon > y ? 'above' : 'below'} the yield (${pct(coupon, 0)} vs ${pct(y, 2)}) ⇒ price ${coupon > y ? 'above' : 'below'} par — consistent with ${f(reponse, 2)}.`}`
            : `$P = \\sum_{t=1}^{${f(maturite, 0)}} \\dfrac{${f(coupon, 0)}}{(1+y)^t} + \\dfrac{100}{(1+y)^{${f(maturite, 0)}}}$ avec $y = ${f(y, 2)}\\,\\%$ = **${f(reponse, 2)}**. ${auPair ? `Aucune surprise : coupon = rendement (${pct(coupon, 0)} = ${pct(y, 2)}) ⇒ l'obligation cote exactement au pair — l'ancre mentale du module 4, à vérifier avant tout calcul.` : `Garde-fou avec l'ancre du module 4 : coupon ${coupon > y ? 'au-dessus' : 'en dessous'} du rendement (${pct(coupon, 0)} contre ${pct(y, 2)}) ⇒ prix ${coupon > y ? 'au-dessus' : 'sous'} le pair — cohérent avec ${f(reponse, 2)}.`}`,
        },
        {
          titre: en ? 'What the spread costs' : 'Ce que le spread coûte',
          contenu: en
            ? `The same bond WITHOUT spread (discounted at ${pct(rSans, 1)} alone) would price at ${f(prixSansSpread, 2)}: the ${pb(spread)} "cost" ${f(r2(prixSansSpread - reponse), 2)} price points — evaporated not because a default occurred, but because the market demands to be paid for carrying the risk (exercise 14 isolates that gap). Chapter 4's benchmark: coupon 4, r 3%, s 200 bp, 5 years ⇒ 95.670523 against 104.579707 without spread.`
            : `La même obligation SANS spread (actualisée à ${pct(rSans, 1)} seul) coterait ${f(prixSansSpread, 2)} : les ${pb(spread)} « coûtent » ${f(r2(prixSansSpread - reponse), 2)} points de prix — évaporés non parce qu'un défaut a eu lieu, mais parce que le marché exige d'être payé pour porter le risque (l'exercice 14 isole cet écart). Le repère du chapitre 4 : coupon 4, r 3 %, s 200 pb, 5 ans ⇒ 95,670523 contre 104,579707 sans spread.`,
        },
      ],
      pieges: [
        en
          ? `Forgetting the /100 on the spread: $y = ${f(rSans, 1)} + ${f(spread, 0)} = ${f(r2(rSans + spread), 1)}\\,\\%$ — an absurd discount rate that crushes the price to nothing. ${f(spread, 0)} bp = ${pct(r2(spread / 100), 2)}; the bp-to-percent conversion is the recurring toll of this module.`
          : `Oublier le /100 sur le spread : $y = ${f(rSans, 1)} + ${f(spread, 0)} = ${f(r2(rSans + spread), 1)}\\,\\%$ — un taux d'actualisation absurde qui écrase le prix à presque rien. ${f(spread, 0)} pb = ${pct(r2(spread / 100), 2)} ; la conversion pb → % est le péage récurrent de ce module.`,
        en
          ? `Discounting at the risk-free rate alone: ${f(prixSansSpread, 2)} instead of ${f(reponse, 2)} — counting the yield of the risk without counting the risk. The fat coupon does not "compensate" anything if you discount it risk-free.`
          : `Actualiser au sans-risque seul : ${f(prixSansSpread, 2)} au lieu de ${f(reponse, 2)} — compter le rendement du risque sans compter le risque. Le gros coupon ne « compense » rien si on l'actualise au taux sans risque.`,
        en
          ? `Double-counting: shrinking the flows by the survival probability AND discounting at r + s. The actuarial method (weighted flows) and the desk method (spread in the rate) are two expressions of the same price — pick one, never both at once.`
          : `Compter double : réduire les flux par la probabilité de survie ET actualiser à r + s. La méthode actuarielle (flux pondérés) et la méthode du desk (spread dans le taux) sont deux écritures du même prix — on en choisit une, jamais les deux à la fois.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 9. La spread duration : l'écartement qui coûte (N2)
// ---------------------------------------------------------------------------
export const genVariationSpread: ExerciseGenerator = {
  id: 'm5-ex-09',
  moduleId: M5,
  titre: 'La spread duration : l\'écartement qui coûte',
  titreEn: 'Spread duration: the widening that hurts',
  difficulte: 2,
  // Tirages (ordre strict) : 1. duration = randFloat(3, 8, 1) · 2. deltaPb =
  // randInt(5, 60) × 5 (25-300 pb, écartement) · 3. habillage =
  // pick(['resultats', 'downgrade', 'crise']).
  // Réponse = variationPrixSpreadPct(D, Δs), SIGNÉE (négative : écartement ⇒
  // baisse de prix) — l'ancre du ch4 : (D 4,5, +50 pb) = −2,25 %. Le faux
  // « pb non convertis » (−D × Δs_pb) est recalculé dans le corrigé.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const duration = randFloat(rng, 3, 8, 1);
    const deltaPb = randInt(rng, 5, 60) * 5;
    const habillage = pick(rng, ['resultats', 'downgrade', 'crise'] as const);

    const reponse = r2(variationPrixSpreadPct(duration, deltaPb));
    const deltaPct = r2(deltaPb / 100);
    const fauxSans100 = r2(-duration * deltaPb);

    const en = langue === 'en';
    const { f, pct, sgn, pb } = formatters(langue);
    const contexteFr = {
      resultats: 'Après un avertissement sur résultats, le spread d\'un émetteur',
      downgrade: 'Après un downgrade d\'un cran, le spread d\'un émetteur',
      crise: 'Dans un accès d\'aversion au risque type crise, le spread moyen d\'un portefeuille',
    } as const;
    const contexteEn = {
      resultats: 'After a profit warning, an issuer\'s spread',
      downgrade: 'After a one-notch downgrade, an issuer\'s spread',
      crise: 'In a crisis-style risk-off episode, the average spread of a portfolio',
    } as const;
    return {
      enonce: en
        ? `${contexteEn[habillage]} widens by ${pb(deltaPb)}. The position's modified duration is ${f(duration, 1)}.\n\n**What is the price impact, in % (sign included)?**`
        : `${contexteFr[habillage]} s'écarte de ${pb(deltaPb)}. La duration modifiée de la position est de ${f(duration, 1)}.\n\n**Quel est l'impact sur le prix, en % (signe compris) ?**`,
      reponse,
      tolerance: 0.05,
      toleranceMode: 'absolu',
      unite: '%',
      etapes: [
        {
          titre: en ? 'Convert the basis points' : 'Convertir les points de base',
          contenu: en
            ? `$\\Delta s = ${f(deltaPb, 0)}\\ \\text{bp} = ${f(deltaPb, 0)}/100$ = **${pct(deltaPct, 2)}**. The duration formula eats percentage points, not basis points — do the conversion BEFORE touching the multiplication, every single time.`
            : `$\\Delta s = ${f(deltaPb, 0)}\\ \\text{pb} = ${f(deltaPb, 0)}/100$ = **${pct(deltaPct, 2)}**. La formule de duration mange des points de pourcentage, pas des points de base — faites la conversion AVANT de toucher à la multiplication, à chaque fois.`,
        },
        {
          titre: en ? 'Same arithmetic as rate duration' : 'La même arithmétique que la duration taux',
          contenu: en
            ? `$\\dfrac{\\Delta P}{P} \\approx -D_{\\text{mod}} × \\Delta s = -${f(duration, 1)} × ${f(deltaPct, 2)}\\,\\%$ = **${sgn(reponse, 2)}%**. This is spread duration: module 4's duration formula, with the shock coming from credit instead of rates. Chapter 4's anchor: D 4.5, +50 bp ⇒ −2.25%.`
            : `$\\dfrac{\\Delta P}{P} \\approx -D_{\\text{mod}} × \\Delta s = -${f(duration, 1)} × ${f(deltaPct, 2)}\\,\\%$ = **${sgn(reponse, 2)} %**. C'est la spread duration : la formule de duration du module 4, avec un choc qui vient du crédit et non des taux. L'ancre du chapitre 4 : D 4,5, +50 pb ⇒ −2,25 %.`,
        },
        {
          titre: en ? 'Why a bond book can lose like equities' : 'Pourquoi un book obligataire peut perdre comme des actions',
          contenu: en
            ? `Scale it up: duration 7 in a crisis-style widening of +300 bp ⇒ −21% — a BOND portfolio losing like an equity book, without a single default having occurred. And remember the corporate carries TWO risks with the same duration, $\\Delta P \\approx -D × (\\Delta r + \\Delta s)$: in a crisis they can move in OPPOSITE directions — spreads blow out while risk-free rates fall (flight to quality), so an IG book may end almost flat while high yield, spread-dominated, has no cushion.`
            : `Changez d'échelle : duration 7 dans un écartement type crise de +300 pb ⇒ −21 % — un portefeuille OBLIGATAIRE qui perd comme un book actions, sans qu'un seul défaut ait eu lieu. Et rappelez-vous que le corporate porte DEUX risques avec la même duration, $\\Delta P \\approx -D × (\\Delta r + \\Delta s)$ : en crise ils peuvent jouer en sens INVERSE — les spreads explosent pendant que les taux sans risque baissent (flight to quality), si bien qu'un book IG peut finir presque inchangé quand le high yield, dominé par le spread, n'a aucun coussin.`,
        },
      ],
      pieges: [
        en
          ? `Skipping the bp conversion: $-${f(duration, 1)} × ${f(deltaPb, 0)} = ${sgn(fauxSans100, 0)}$ "%" — a price impact beyond −100% on a widening, nonsense on sight. ${f(deltaPb, 0)} bp = ${pct(deltaPct, 2)}, always.`
          : `Sauter la conversion des pb : $-${f(duration, 1)} × ${f(deltaPb, 0)} = ${sgn(fauxSans100, 0)}$ « % » — un impact prix au-delà de −100 % sur un écartement, absurde à vue. ${f(deltaPb, 0)} pb = ${pct(deltaPct, 2)}, toujours.`,
        en
          ? `Getting the sign wrong: answering ${sgn(-reponse, 2)}%. A WIDENING spread means the market demands more yield, so the price FALLS — a positive answer would mean you are long a widening, i.e. short the bond. Lock the direction before computing.`
          : `Se tromper de signe : répondre ${sgn(-reponse, 2)} %. Un spread qui s'ÉCARTE signifie que le marché exige plus de rendement, donc le prix BAISSE — une réponse positive voudrait dire qu'on gagne à l'écartement, c'est-à-dire qu'on est short l'obligation. Verrouillez le sens avant de calculer.`,
        en
          ? `Believing a default is needed to lose money: the ${sgn(reponse, 2)}% is pure re-pricing — the mark-to-market of a spread move. Most credit P&L, in both directions, is made of exactly this.`
          : `Croire qu'il faut un défaut pour perdre : les ${sgn(reponse, 2)} % sont du pur re-pricing — le mark-to-market d'un mouvement de spread. L'essentiel du P&L crédit, dans les deux sens, est fait exactement de cela.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 10. Le rendement net des défauts (N2)
// ---------------------------------------------------------------------------
export const genRendementNet: ExerciseGenerator = {
  id: 'm5-ex-10',
  moduleId: M5,
  titre: 'Le rendement net des défauts',
  titreEn: 'The default-adjusted yield',
  difficulte: 2,
  // Tirages (ordre strict) : 1. rendementNominal = randFloat(5, 9, 1) · 2. pd
  // = randFloat(1, 6, 1) · 3. recouvrement = pick([20, 30, 40]) · 4. sansRisque
  // = randFloat(2, 4.5, 1).
  // Réponse = rendementNetDefautsPct — l'ancre du ch4 : (7 %, PD 3 %, R 40 %)
  // = 5,2 %. Le verdict net contre sans-risque (bat/battu) est tranché dans le
  // corrigé — selon le tirage, les deux issues existent, c'est voulu. Les faux
  // « brut comparé » et « PD entière retranchée » sont recalculés.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const rendementNominal = randFloat(rng, 5, 9, 1);
    const pd = randFloat(rng, 1, 6, 1);
    const recouvrement = pick(rng, [20, 30, 40] as const);
    const sansRisque = randFloat(rng, 2, 4.5, 1);

    const lgd = 100 - recouvrement;
    const el = r2(perteAttenduePct(pd, recouvrement));
    const reponse = r2(rendementNetDefautsPct(rendementNominal, pd, recouvrement));
    const bat = reponse > sansRisque;
    const ecartNet = r2(reponse - sansRisque);
    const ecartBrut = r2(rendementNominal - sansRisque);
    const fauxPdEntiere = r2(rendementNominal - pd);

    const en = langue === 'en';
    const { f, pct, sgn } = formatters(langue);
    return {
      enonce: en
        ? `A high-yield portfolio displays a gross yield of ${pct(rendementNominal, 1)}. Your analysts expect an average annual default probability of ${pct(pd, 1)} with a recovery of ${pct(recouvrement, 0)}. The comparable government bond pays ${pct(sansRisque, 1)}.\n\n**What is the portfolio's yield net of expected defaults, in %?** (The verdict against the risk-free rate is settled in the walkthrough.)`
        : `Un portefeuille high yield affiche un rendement brut de ${pct(rendementNominal, 1)}. Vos analystes attendent une probabilité de défaut annuelle moyenne de ${pct(pd, 1)} avec un recouvrement de ${pct(recouvrement, 0)}. L'emprunt d'État comparable paie ${pct(sansRisque, 1)}.\n\n**Quel est le rendement du portefeuille net des défauts attendus, en % ?** (Le verdict contre le sans-risque se tranche dans le corrigé.)`,
      reponse,
      tolerance: 0.05,
      toleranceMode: 'absolu',
      unite: '%',
      etapes: [
        {
          titre: en ? 'The annual bill' : 'La facture annuelle',
          contenu: en
            ? `Expected credit losses: $EL = PD × LGD = ${f(pd, 1)}\\,\\% × ${f(lgd, 0)}\\,\\%$ = **${pct(el, 2)}** per year (exercise 2). The displayed ${pct(rendementNominal, 1)} is a GROSS yield: it assumes everyone pays. The EL is the part of the coupon that is not income — it is pre-paid losses.`
            : `Pertes de crédit attendues : $EL = PD × LGD = ${f(pd, 1)}\\,\\% × ${f(lgd, 0)}\\,\\%$ = **${pct(el, 2)}** par an (exercice 2). Les ${pct(rendementNominal, 1)} affichés sont un rendement BRUT : ils supposent que tout le monde paie. L'EL est la part du coupon qui n'est pas du revenu — ce sont des pertes payées d'avance.`,
        },
        {
          titre: en ? 'Net the yield' : 'Passer au net',
          contenu: en
            ? `$\\text{net yield} = ${f(rendementNominal, 1)}\\,\\% - ${f(el, 2)}\\,\\%$ = **${pct(reponse, 2)}**. Chapter 4's anchor: 7% gross, PD 3%, R 40% ⇒ 5.2% net. This is the number that answers the desk's question on every trade idea: "net of defaults, what is left?"`
            : `$\\text{rendement net} = ${f(rendementNominal, 1)}\\,\\% - ${f(el, 2)}\\,\\%$ = **${pct(reponse, 2)}**. L'ancre du chapitre 4 : 7 % brut, PD 3 %, R 40 % ⇒ 5,2 % net. C'est le chiffre qui répond à la question du desk devant chaque idée de trade : « net des défauts, il reste quoi ? »`,
        },
        {
          titre: en ? 'The verdict — net against risk-free' : 'Le verdict — le net contre le sans-risque',
          contenu: en
            ? bat
              ? `${pct(reponse, 2)} net against ${pct(sansRisque, 1)} risk-free: the portfolio BEATS the government bond by ${sgn(ecartNet, 2)} points — that surplus is the risk premium you are actually paid, the compensation for bearing default years that will not be average. The comparison only became honest once the EL was deducted: net against net, never gross.`
              : `${pct(reponse, 2)} net against ${pct(sansRisque, 1)} risk-free: the portfolio is BEATEN by ${f(Math.abs(ecartNet), 2)} points. The fat coupon was not yield — it was a pre-payment of quasi-certain losses, dressed up as income (chapter 4's fat-coupon trap). The yield hunter who compared gross saw ${sgn(ecartBrut, 1)} points of "pick-up"; net, the trade destroys value against the government bond.`
            : bat
              ? `${pct(reponse, 2)} net contre ${pct(sansRisque, 1)} sans risque : le portefeuille BAT l'emprunt d'État de ${sgn(ecartNet, 2)} points — ce surplus est la prime de risque réellement encaissée, la rémunération des années de défaut qui ne seront pas moyennes. La comparaison n'est devenue honnête qu'une fois l'EL retranchée : du net contre du net, jamais du brut.`
              : `${pct(reponse, 2)} net contre ${pct(sansRisque, 1)} sans risque : le portefeuille est BATTU de ${f(Math.abs(ecartNet), 2)} points. Le gros coupon n'était pas du rendement — c'était un remboursement anticipé de pertes quasi certaines, déguisé en revenu (le piège du gros coupon du chapitre 4). Le chasseur de rendement qui comparait le brut voyait ${sgn(ecartBrut, 1)} points de « pick-up » ; en net, le trade détruit de la valeur contre l'emprunt d'État.`,
        },
      ],
      pieges: [
        en
          ? `Comparing the GROSS yield to the risk-free: "${sgn(ecartBrut, 1)} points above the government bond, I buy" — the recurring error of yield hunters. The only honest comparison is net of expected defaults: here it ${bat ? `shrinks the pick-up to ${sgn(ecartNet, 2)} points` : `turns the pick-up into a ${f(Math.abs(ecartNet), 2)}-point deficit`}.`
          : `Comparer le rendement BRUT au sans-risque : « ${sgn(ecartBrut, 1)} points au-dessus de l'État, j'achète » — l'erreur récurrente des chasseurs de rendement. La seule comparaison honnête est nette des défauts attendus : ici elle ${bat ? `réduit le pick-up à ${sgn(ecartNet, 2)} points` : `transforme le pick-up en déficit de ${f(Math.abs(ecartNet), 2)} points`}.`,
        en
          ? `Subtracting the full PD: $${f(rendementNominal, 1)} - ${f(pd, 1)} = ${pct(fauxPdEntiere, 2)}$ — forgetting the recovery. Each default only costs the LGD (${pct(lgd, 0)} here), so the bill is PD × LGD = ${pct(el, 2)}, not PD.`
          : `Retrancher la PD entière : $${f(rendementNominal, 1)} - ${f(pd, 1)} = ${pct(fauxPdEntiere, 2)}$ — c'est oublier le recouvrement. Chaque défaut ne coûte que la LGD (${pct(lgd, 0)} ici), donc la facture vaut PD × LGD = ${pct(el, 2)}, pas la PD.`,
        en
          ? `Forgetting that the EL is an average: at the end of the cycle, realised defaults overshoot the expected ones precisely when spreads are tightest. The net yield is the entry ticket of the analysis, not its conclusion.`
          : `Oublier que l'EL est une moyenne : en fin de cycle, les défauts réalisés dépassent les attendus précisément quand les spreads sont les plus serrés. Le rendement net est le ticket d'entrée de l'analyse, pas sa conclusion.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 11. Le paiement contingent d'un CDS (N2)
// ---------------------------------------------------------------------------
export const genPaiementDefautCds: ExerciseGenerator = {
  id: 'm5-ex-11',
  moduleId: M5,
  titre: 'Le paiement au défaut d\'un CDS',
  titreEn: 'The CDS default payment',
  difficulte: 2,
  // Tirages (ordre strict) : 1. notionnel = pick([5, 10, 15, 20, 25, 50]) (M€)
  // · 2. recouvrement = pick([20, 30, 40, 60]) · 3. habillage =
  // pick(['faillite', 'defautPaiement']).
  // Réponse = paiementDefautCdsMillions — le VENDEUR paie la perte, jamais le
  // notionnel : (10 M, R 40 %) = 6 M. Énoncé côté vendeur pour frapper le
  // piège de plein fouet ; les deux faux (notionnel entier, part recouvrée)
  // sont recalculés dans les pièges.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const notionnel = pick(rng, [5, 10, 15, 20, 25, 50] as const);
    const recouvrement = pick(rng, [20, 30, 40, 60] as const);
    const habillage = pick(rng, ['faillite', 'defautPaiement'] as const);

    const lgd = 100 - recouvrement;
    const reponse = r2(paiementDefautCdsMillions(notionnel, recouvrement));
    const fauxRecouvre = r2((notionnel * recouvrement) / 100);
    const estFaillite = habillage === 'faillite';

    const en = langue === 'en';
    const { f, pct, meur } = formatters(langue);
    return {
      enonce: en
        ? `Your desk has SOLD CDS protection on a corporate issuer, notional ${meur(notionnel)}. The entity ${estFaillite ? 'files for bankruptcy' : 'misses a payment beyond the grace period'}; the ISDA auction sets the recovery at ${pct(recouvrement, 0)} of par.\n\n**How much do you pay out, in millions of euros?**`
        : `Votre desk a VENDU une protection CDS sur un émetteur corporate, notionnel ${meur(notionnel)}. L'entité ${estFaillite ? 'dépose le bilan' : 'manque un paiement au-delà du délai de grâce'} ; l'enchère ISDA fixe le recouvrement à ${pct(recouvrement, 0)} du pair.\n\n**Combien versez-vous, en millions d'euros ?**`,
      reponse,
      tolerance: 0.005,
      unite: 'M€',
      etapes: [
        {
          titre: en ? 'The seller pays the LOSS' : 'Le vendeur paie la PERTE',
          contenu: en
            ? `$\\text{payment} = \\text{notional} × (1 - R) = ${f(notionnel, 0)} × (1 - ${f(recouvrement, 0)}\\,\\%)$ = **${meur(reponse, 2)}**. The protection seller compensates the loss given default — ${pct(lgd, 0)} of the notional — never the notional itself: the CDS puts the buyer back in the position of an indemnified creditor, not of a lottery winner.`
            : `$\\text{paiement} = \\text{notionnel} × (1 - R) = ${f(notionnel, 0)} × (1 - ${f(recouvrement, 0)}\\,\\%)$ = **${meur(reponse, 2)}**. Le vendeur de protection compense la perte en cas de défaut — ${pct(lgd, 0)} du notionnel — jamais le notionnel lui-même : le CDS remet l'acheteur dans la situation d'un créancier indemnisé, pas d'un gagnant au loto.`,
        },
        {
          titre: en ? 'Who fixes R: the auction' : 'Qui fixe R : l\'enchère',
          contenu: en
            ? `The sequence: an ISDA determinations committee rules that a credit event occurred (bankruptcy, failure to pay, restructuring), then the auction prices the defaulted bonds — and that single number becomes the recovery for ALL contracts at once. Lehman, October 2008: R = 8.625%, sellers paid 91.375% of notional. The "R ≈ 40%" convention is a calm-times average, not a law — on a failed bank there is almost nothing left.`
            : `La séquence : un comité de détermination ISDA constate l'événement de crédit (faillite, défaut de paiement, restructuration), puis l'enchère price les obligations en défaut — et ce chiffre unique devient le recouvrement de TOUS les contrats à la fois. Lehman, octobre 2008 : R = 8,625 %, les vendeurs ont payé 91,375 % du notionnel. La convention « R ≈ 40 % » est une moyenne de temps calme, pas une loi — sur une banque en faillite, il ne reste presque rien.`,
        },
        {
          titre: en ? 'The asymmetry you just lived' : 'L\'asymétrie que vous venez de vivre',
          contenu: en
            ? `Selling protection collects a premium counted in tenths of a percent per year (exercise 3), against this single payout of ${meur(reponse, 2)} — small and regular against rare and massive: the option-seller's profile (module 8), and AIG's position in miniature. Since the 2009 Big Bang, central clearing and margin calls frame exactly this risk; the premiums you had collected stop at the default, accrued pro rata.`
            : `Vendre la protection encaisse une prime comptée en dixièmes de pour cent par an (exercice 3), contre ce versement unique de ${meur(reponse, 2)} — petit et régulier contre rare et massif : le profil du vendeur d'options (module 8), et la position AIG en miniature. Depuis le Big Bang de 2009, compensation centrale et appels de marge encadrent exactement ce risque ; les primes que vous encaissiez s'arrêtent au défaut, au prorata du couru.`,
        },
      ],
      pieges: [
        en
          ? `Answering the notional (${meur(notionnel)}): the seller compensates the LOSS, notional × (1 − R) = ${meur(reponse, 2)}. Paying the full notional would overcompensate the buyer, who still recovers ${pct(recouvrement, 0)} on the defaulted bond.`
          : `Répondre le notionnel (${meur(notionnel)}) : le vendeur compense la PERTE, notionnel × (1 − R) = ${meur(reponse, 2)}. Payer le notionnel entier surindemniserait l'acheteur, qui récupère encore ${pct(recouvrement, 0)} sur l'obligation en défaut.`,
        en
          ? `Answering the recovered part, notional × R = ${meur(fauxRecouvre, 2)}: that is what the CREDITOR salvages from the bankruptcy — the CDS pays the complement. Recovery and loss are the two halves of the nominal; the seller owes the loss half.`
          : `Répondre la part recouvrée, notionnel × R = ${meur(fauxRecouvre, 2)} : c'est ce que le CRÉANCIER sauve de la faillite — le CDS paie le complément. Recouvrement et perte sont les deux moitiés du nominal ; le vendeur doit la moitié perte.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 12. La base cash-CDS (N3)
// ---------------------------------------------------------------------------
export const genBaseCashCds: ExerciseGenerator = {
  id: 'm5-ex-12',
  moduleId: M5,
  titre: 'La base cash-CDS',
  titreEn: 'The cash-CDS basis',
  difficulte: 3,
  // Tirages (ordre strict) : 1. spreadOblig = randInt(24, 90) × 5 (120-450 pb)
  // · 2. ecart = pick([−60, −45, −35, −25, −20, −15, −10, 10, 15, 20, 25, 35]).
  // Le spread CDS est CONSTRUIT comme spreadOblig + ecart : la réponse
  // (baseCdsPb) retombe exactement sur l'écart tiré, positif ou négatif — les
  // deux signes existent et le corrigé interprète chacun. L'ancre du ch5 :
  // CDS 180, cash 200 ⇒ −20 pb, le negative basis trade… qui n'est pas gratuit.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const spreadOblig = randInt(rng, 24, 90) * 5;
    const ecart = pick(rng, [-60, -45, -35, -25, -20, -15, -10, 10, 15, 20, 25, 35] as const);

    const spreadCds = spreadOblig + ecart;
    const reponse = r2(baseCdsPb(spreadCds, spreadOblig));
    const negative = reponse < 0;

    const en = langue === 'en';
    const { f, sgn, pb } = formatters(langue);
    const sgnPb = (v: number) => (en ? `${sgn(v, 0)} bp` : `${sgn(v, 0)} pb`);
    return {
      enonce: en
        ? `On a BBB issuer, the 5-year CDS quotes ${pb(spreadCds)} while its 5-year bond yields ${pb(spreadOblig)} over the risk-free curve.\n\n**What is the cash-CDS basis, in basis points (sign included) — and what does its sign say?** (The expected numeric answer is the basis.)`
        : `Sur un émetteur BBB, le CDS 5 ans cote ${pb(spreadCds)} quand son obligation 5 ans rend ${pb(spreadOblig)} au-dessus de la courbe sans risque.\n\n**Quelle est la base cash-CDS, en points de base (signe compris) — et que dit son signe ?** (La réponse numérique attendue est la base.)`,
      reponse,
      tolerance: 0.5,
      toleranceMode: 'absolu',
      unite: en ? 'bp' : 'pb',
      etapes: [
        {
          titre: en ? 'The definition IS the order of subtraction' : 'La définition EST l\'ordre de la soustraction',
          contenu: en
            ? `$\\text{basis} = s_{\\text{CDS}} - s_{\\text{bond}} = ${f(spreadCds, 0)} - ${f(spreadOblig, 0)}$ = **${sgnPb(reponse)}**. Same default, two wrappers — the derivative and the cash bond — so the two spreads should match, and in normal regimes they nearly do. The basis measures the disagreement, and its SIGN carries the whole story.`
            : `$\\text{base} = s_{\\text{CDS}} - s_{\\text{oblig}} = ${f(spreadCds, 0)} - ${f(spreadOblig, 0)}$ = **${sgnPb(reponse)}**. Même défaut, deux emballages — le dérivé et l'obligation cash — donc les deux spreads devraient coïncider, et en régime normal ils le font presque. La base mesure le désaccord, et son SIGNE porte toute l'histoire.`,
        },
        {
          titre: en ? 'Reading the sign' : 'Lire le signe',
          contenu: en
            ? negative
              ? `Negative basis: the protection costs ${f(Math.abs(reponse), 0)} bp LESS than the spread the bond pays. On paper, buy the bond (earn ${pb(spreadOblig)}), buy the CDS (pay ${pb(spreadCds)}), pocket ${f(Math.abs(reponse), 0)} bp a year with the default fully hedged — the negative basis trade, chapter 5's anchor (CDS 180, cash 200 ⇒ −20 bp). The bond is "too cheap" relative to its derivative — typically because whoever buys it must fund it and carry it on a balance sheet.`
              : `Positive basis: the protection costs ${f(reponse, 0)} bp MORE than the bond's spread. The classic drivers: a rush to buy protection (shorting credit via CDS is easy; shorting the cash bond means borrowing a bond nobody lends), cheapest-to-deliver optionality in the CDS, or a bond squeezed rich by scarcity. The theoretical arbitrage — sell protection, short the bond — dies on the second leg: borrowing the bond is rare and expensive, which is exactly why the positive basis can persist.`
            : negative
              ? `Base négative : la protection coûte ${f(Math.abs(reponse), 0)} pb de MOINS que le spread encaissé sur l'obligation. Sur le papier : acheter l'obligation (encaisser ${pb(spreadOblig)}), acheter le CDS (payer ${pb(spreadCds)}), et empocher ${f(Math.abs(reponse), 0)} pb par an avec le défaut entièrement couvert — le negative basis trade, l'ancre du chapitre 5 (CDS 180, cash 200 ⇒ −20 pb). L'obligation est « trop bon marché » relativement à son dérivé — typiquement parce que celui qui l'achète doit la financer et la porter au bilan.`
              : `Base positive : la protection coûte ${f(reponse, 0)} pb de PLUS que le spread de l'obligation. Les moteurs classiques : une ruée sur la protection (shorter le crédit via CDS est facile ; shorter le cash exige d'emprunter une obligation que personne ne prête), l'option cheapest-to-deliver logée dans le CDS, ou une obligation renchérie par la rareté. L'« arbitrage » théorique — vendre la protection, shorter l'obligation — meurt sur la seconde jambe : emprunter le titre est rare et cher, et c'est exactement pourquoi la base positive peut persister.`,
        },
        {
          titre: en ? 'Why it is not free money' : 'Pourquoi ce n\'est pas de l\'argent gratuit',
          contenu: en
            ? `"No credit risk" does not mean "no risk". The bond leg is financed in repo, rolled daily, and the whole position is marked to market every night: if the basis widens instead of converging — from −20 to −80 bp, and several hundred bp on financials in late 2008 — the margin calls land immediately while the locked-in gain only arrives at maturity. That is LTCM's lesson (module 11): an arbitrage that is certain at maturity can kill its holder before being right. The basis is not a glitch — it is the price of balance sheet, paid to whoever can fund and hold.`
            : `« Sans risque de crédit » ne veut pas dire « sans risque ». La jambe obligataire se finance en repo, renouvelé au jour le jour, et toute la position est valorisée en marché chaque soir : si la base s'écarte au lieu de converger — de −20 à −80 pb, et plusieurs centaines de pb sur des financières fin 2008 — les appels de marge tombent immédiatement quand le gain verrouillé, lui, n'arrive qu'à maturité. C'est la leçon LTCM (module 11) : un arbitrage certain à terme peut tuer son porteur avant d'avoir raison. La base n'est pas une anomalie — c'est le prix du bilan, payé à qui peut financer et porter.`,
        },
      ],
      pieges: [
        en
          ? `Inverting the subtraction and announcing ${sgnPb(-reponse)}: the sign carries the entire interpretation — which leg is rich, which trade makes sense, who gets paid for balance sheet. Basis = CDS minus cash, by definition and always in that order.`
          : `Inverser la soustraction et annoncer ${sgnPb(-reponse)} : le signe porte toute l'interprétation — quelle jambe est chère, quel trade a un sens, qui est payé pour le bilan. Base = CDS moins cash, par définition et toujours dans cet ordre.`,
        en
          ? `Reading "hedged against default" as "riskless": the negative basis trade earns ${negative ? f(Math.abs(reponse), 0) : '20'} bp a year but can lose multiples of that in mark-to-market before converging — funded overnight, it can be forced out at the worst point. The gain is at maturity; the margin call is tonight.`
          : `Lire « couvert contre le défaut » comme « sans risque » : le negative basis trade encaisse ${negative ? f(Math.abs(reponse), 0) : '20'} pb par an mais peut en perdre des multiples en mark-to-market avant de converger — financé au jour le jour, il peut être sorti de force au pire moment. Le gain est à maturité ; l'appel de marge est ce soir.`,
        en
          ? `Comparing spreads of mismatched maturities or seniorities: a 5-year CDS against a 7-year bond measures curve slope, not the basis. The basis is only defined like-for-like — same entity, same maturity, same rank.`
          : `Comparer des spreads de maturités ou de séniorités différentes : un CDS 5 ans contre une obligation 7 ans mesure la pente de la courbe, pas la base. La base ne se définit qu'à identique — même entité, même maturité, même rang.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 13. La perte d'une tranche mezzanine (N3)
// ---------------------------------------------------------------------------
export const genPerteTranche: ExerciseGenerator = {
  id: 'm5-ex-13',
  moduleId: M5,
  titre: 'La perte d\'une tranche mezzanine',
  titreEn: 'The loss on a mezzanine tranche',
  difficulte: 3,
  // Tirages (ordre strict) : 1. trancheIdx = randInt(0, 3) parmi [(3,6), (3,7),
  // (4,8), (5,10)] · 2. frac = randInt(0, 100).
  // La perte du pool L interpole linéairement [attache − 2, détachement + 3]
  // (au dixième) : les TROIS régimes existent — intacte (L ≤ A), partielle,
  // rasée (L ≥ D) — et le corrigé traite chacun, clamp compris. Réponse =
  // perteTranchePct, en % du notionnel de LA TRANCHE, bornée [0, 100] —
  // l'ancre du ch6 : mezzanine 3-6 % avec L = 5 % ⇒ 66,666667 %.
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const tranches = [
      [3, 6],
      [3, 7],
      [4, 8],
      [5, 10],
    ] as const;
    const trancheIdx = randInt(rng, 0, 3);
    const frac = randInt(rng, 0, 100);

    const [attache, detachement] = tranches[trancheIdx];
    const lMin = attache - 2;
    const lMax = detachement + 3;
    const pertePool = Math.round((lMin + (frac / 100) * (lMax - lMin)) * 10) / 10;
    const reponse = r2(perteTranchePct(pertePool, attache, detachement));
    const brut = r2(((pertePool - attache) / (detachement - attache)) * 100);
    const intacte = pertePool <= attache;
    const rasee = pertePool >= detachement;
    const epaisseur = detachement - attache;
    const sensibilite = r2(100 / epaisseur);

    const en = langue === 'en';
    const { f, pct } = formatters(langue);
    return {
      enonce: en
        ? `A CDO slices a loan pool into tranches; you hold the mezzanine tranche attaching at ${pct(attache, 0)} and detaching at ${pct(detachement, 0)} of the pool. Cumulative pool losses reach ${pct(pertePool, 1)}.\n\n**What loss does your tranche suffer, in % of ITS OWN notional?**`
        : `Un CDO découpe un pool de prêts en tranches ; vous détenez la tranche mezzanine attachée à ${pct(attache, 0)} et détachée à ${pct(detachement, 0)} du pool. Les pertes cumulées du pool atteignent ${pct(pertePool, 1)}.\n\n**Quelle perte subit votre tranche, en % de SON notionnel ?**`,
      reponse,
      tolerance: 0.5,
      toleranceMode: 'absolu',
      unite: '%',
      etapes: [
        {
          titre: en ? 'Locate L between the two thresholds' : 'Situer L entre les deux seuils',
          contenu: en
            ? `The tranche STARTS losing when pool losses cross the attachment ${pct(attache, 0)}, and is fully destroyed at the detachment ${pct(detachement, 0)}. Here $L = ${f(pertePool, 1)}\\,\\%$ sits ${intacte ? `below the attachment: the ${pct(attache, 0)} of subordination beneath you absorbs everything — the equity bleeds so that you do not` : rasee ? `beyond the detachment: your entire slice of the loss distribution has been consumed` : `inside the band: the tranche is being eaten alive, block by block`}.`
            : `La tranche COMMENCE à perdre quand les pertes du pool franchissent l'attache ${pct(attache, 0)}, et elle est intégralement détruite au détachement ${pct(detachement, 0)}. Ici $L = ${f(pertePool, 1)}\\,\\%$ se situe ${intacte ? `sous l'attache : les ${pct(attache, 0)} de subordination sous vous absorbent tout — l'equity saigne pour que vous ne saigniez pas` : rasee ? `au-delà du détachement : votre étage de la distribution des pertes est intégralement consommé` : `dans la bande : la tranche se fait dévorer, bloc par bloc`}.`,
        },
        {
          titre: en ? 'The clamped formula' : 'La formule bornée',
          contenu: en
            ? `$\\text{loss} = \\min\\!\\left(100, \\max\\!\\left(0, \\dfrac{L - A}{D - A} × 100\\right)\\right) = \\dfrac{${f(pertePool, 1)} - ${f(attache, 0)}}{${f(detachement, 0)} - ${f(attache, 0)}} × 100 = ${f(brut, 2)}$${intacte || rasee ? `, clamped to **${pct(reponse, 2)}**: a tranche can neither lose more than everything nor "gain" below its attachment — the clamp IS the tranche` : ` = **${pct(reponse, 2)}** of the tranche's notional`}. Chapter 6's anchor: mezzanine 3-6% with L = 5% ⇒ 66.666667%.`
            : `$\\text{perte} = \\min\\!\\left(100, \\max\\!\\left(0, \\dfrac{L - A}{D - A} × 100\\right)\\right) = \\dfrac{${f(pertePool, 1)} - ${f(attache, 0)}}{${f(detachement, 0)} - ${f(attache, 0)}} × 100 = ${f(brut, 2)}$${intacte || rasee ? `, borné à **${pct(reponse, 2)}** : une tranche ne peut ni perdre plus que tout ni « gagner » sous son attache — le clamp EST la tranche` : ` = **${pct(reponse, 2)}** du notionnel de la tranche`}. L'ancre du chapitre 6 : mezzanine 3-6 % avec L = 5 % ⇒ 66,666667 %.`,
        },
        {
          titre: en ? 'The cliff: leverage without borrowing' : 'La falaise : du levier sans emprunt',
          contenu: en
            ? `Inside the band, each extra point of POOL losses destroys $100/(${f(detachement, 0)} - ${f(attache, 0)}) = ${f(sensibilite, 1)}\\,\\%$ of the TRANCHE — a ${f(sensibilite, 0)}-for-1 sensitivity manufactured by the structure alone, without borrowing a cent. The subordination concentrates risk exactly like debt would, but it hides in the capital structure. That cliff — plus the correlation that reshapes the loss distribution — is how a AAA CDO tranche could drop from 100 to 30 without a single additional realised default (module 11, chapter 5): the market was repricing the SHAPE of the distribution, not current losses.`
            : `Dans la bande, chaque point supplémentaire de pertes du POOL détruit $100/(${f(detachement, 0)} - ${f(attache, 0)}) = ${f(sensibilite, 1)}\\,\\%$ de la TRANCHE — une sensibilité de ${f(sensibilite, 0)} pour 1 fabriquée par la seule structure, sans un centime d'emprunt. La subordination concentre le risque exactement comme le ferait de la dette, mais elle se cache dans la structure du passif. Cette falaise — plus la corrélation qui déforme la distribution des pertes — est la raison pour laquelle un AAA de CDO pouvait passer de 100 à 30 sans un seul défaut réalisé de plus (module 11, chapitre 5) : le marché re-priçait la FORME de la distribution, pas les pertes courantes.`,
        },
      ],
      pieges: [
        en
          ? `Swapping attachment and detachment: declaring the tranche wiped out as soon as L crosses ${pct(attache, 0)}, or intact until ${pct(detachement, 0)}. The attachment is where losses BEGIN; the detachment is where the tranche is FULLY destroyed — between the two, the destruction is proportional.`
          : `Confondre attache et détachement : déclarer la tranche rasée dès que L franchit ${pct(attache, 0)}, ou intacte jusqu'à ${pct(detachement, 0)}. L'attache est où les pertes COMMENCENT ; le détachement où la tranche est ENTIÈREMENT détruite — entre les deux, la destruction est proportionnelle.`,
        en
          ? intacte || rasee
            ? `Forgetting the clamp and answering the raw ${pct(brut, 2)}: outside the band, the formula must be capped to [0, 100] — a tranche loss ${brut < 0 ? 'below zero' : 'above 100%'} does not exist. The clamp is not cosmetic: it is what turns a continuous pool loss into a cliff.`
            : `Forgetting the clamp exists: here L falls inside the band so the raw formula happens to work, but push L beyond ${pct(detachement, 0)} and it returns more than 100% — cap at [0, 100] systematically, the clamp is what makes a tranche a tranche.`
          : intacte || rasee
            ? `Oublier le clamp et répondre le brut ${pct(brut, 2)} : hors de la bande, la formule doit être bornée à [0, 100] — une perte de tranche ${brut < 0 ? 'négative' : 'au-delà de 100 %'} n'existe pas. Le clamp n'est pas cosmétique : c'est lui qui transforme une perte continue du pool en falaise.`
            : `Oublier que le clamp existe : ici L tombe dans la bande donc la formule brute passe, mais poussez L au-delà de ${pct(detachement, 0)} et elle rend plus de 100 % — bornez à [0, 100] systématiquement, le clamp est ce qui fait d'une tranche une tranche.`,
        en
          ? `Confusing % of the pool with % of the tranche: the pool "only" lost ${pct(pertePool, 1)}, your tranche lost ${pct(reponse, 2)} of ITS notional. An untranched investor holding 1% of the pool loses ${pct(pertePool, 1)}; the tranche holder lives on another planet — that difference is the entire point of tranching.`
          : `Confondre % du pool et % de la tranche : le pool n'a perdu « que » ${pct(pertePool, 1)}, votre tranche a perdu ${pct(reponse, 2)} de SON notionnel. L'investisseur non tranché qui détient 1 % du pool perd ${pct(pertePool, 1)} ; le porteur de tranche vit sur une autre planète — cette différence est tout l'objet du tranchage.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// 14. Ce que le spread coûte en points de prix (N3)
// ---------------------------------------------------------------------------
export const genCoutDuSpread: ExerciseGenerator = {
  id: 'm5-ex-14',
  moduleId: M5,
  titre: 'Ce que le spread coûte en points de prix',
  titreEn: 'What the spread costs in price points',
  difficulte: 3,
  // Tirages (ordre strict) : 1. coupon = randInt(2, 7) · 2. rSans = pick([2,
  // 2.5, 3, 3.5, 4]) · 3. spread = randInt(20, 80) × 5 (100-400 pb) · 4.
  // maturite = randInt(4, 8).
  // Exercice CHAÎNÉ sur l'ex-08 : deux passages dans prixObligationRisquee
  // (avec spread, puis spread nul) et la réponse est la DIFFÉRENCE, en points
  // de prix — l'ancre du ch4 : coupon 4, r 3, s 200 pb, 5 ans ⇒ 8,909184
  // points. Le corrigé confronte l'exact à l'approximation « spread duration »
  // de l'ex-09 (convexité).
  generate(seed, langue = 'fr') {
    const rng = mulberry32(seed);
    const coupon = randInt(rng, 2, 7);
    const rSans = pick(rng, [2, 2.5, 3, 3.5, 4] as const);
    const spread = randInt(rng, 20, 80) * 5;
    const maturite = randInt(rng, 4, 8);

    const prixSansBrut = prixObligationRisquee(coupon, rSans, 0, maturite);
    const prixAvecBrut = prixObligationRisquee(coupon, rSans, spread, maturite);
    const prixSans = r2(prixSansBrut);
    const prixAvec = r2(prixAvecBrut);
    const reponse = r2(prixSansBrut - prixAvecBrut);
    const pertePct = r2(((prixSansBrut - prixAvecBrut) / prixSansBrut) * 100);
    const coutPar100 = r2(reponse / (spread / 100));

    const en = langue === 'en';
    const { f, pct, pb } = formatters(langue);
    return {
      enonce: en
        ? `A corporate bond pays an annual coupon of ${pct(coupon, 0)}, matures in ${f(maturite, 0)} years and redeems at par (100). The risk-free rate is ${pct(rSans, 1)}; the issuer trades at a credit spread of ${pb(spread)}.\n\n**How many price points does the spread cost — i.e. the difference between the bond's price WITHOUT spread and its price WITH the spread?**`
        : `Une obligation corporate paie un coupon annuel de ${pct(coupon, 0)}, arrive à maturité dans ${f(maturite, 0)} ans et rembourse au pair (100). Le taux sans risque vaut ${pct(rSans, 1)} ; l'émetteur traite avec un spread de crédit de ${pb(spread)}.\n\n**Combien de points de prix le spread coûte-t-il — c'est-à-dire l'écart entre le prix de l'obligation SANS spread et son prix AVEC le spread ?**`,
      reponse,
      tolerance: 0.005,
      unite: 'points',
      etapes: [
        {
          titre: en ? 'The risk-free twin' : 'Le jumeau sans risque',
          contenu: en
            ? `First price the same flows as if the issuer were the sovereign: discount at $y = ${f(rSans, 1)}\\,\\%$ alone (exercise 8's machinery, spread set to zero) ⇒ $P_{\\text{no spread}}$ = **${f(prixSans, 4)}**. Same coupons, same redemption — only the signature differs.`
            : `Pricez d'abord les mêmes flux comme si l'émetteur était l'État : actualisation à $y = ${f(rSans, 1)}\\,\\%$ seul (la machinerie de l'exercice 8, spread à zéro) ⇒ $P_{\\text{sans spread}}$ = **${f(prixSans, 4)}**. Mêmes coupons, même remboursement — seule la signature change.`,
        },
        {
          titre: en ? 'The risky version' : 'La version risquée',
          contenu: en
            ? `Now the desk method with the credit in the rate: $y = ${f(rSans, 1)}\\,\\% + ${f(spread, 0)}/100\\,\\% = ${pct(r2(rSans + spread / 100), 2)}$ ⇒ $P_{\\text{with spread}}$ = **${f(prixAvec, 4)}**. Identical flows, heavier discounting: every euro of coupon and principal is worth less because the market demands ${pb(spread)} for carrying the name.`
            : `Puis la méthode du desk avec le crédit dans le taux : $y = ${f(rSans, 1)}\\,\\% + ${f(spread, 0)}/100\\,\\% = ${pct(r2(rSans + spread / 100), 2)}$ ⇒ $P_{\\text{avec spread}}$ = **${f(prixAvec, 4)}**. Flux identiques, actualisation plus lourde : chaque euro de coupon et de principal vaut moins parce que le marché exige ${pb(spread)} pour porter le nom.`,
        },
        {
          titre: en ? 'The gap, and its duration reading' : 'L\'écart, et sa lecture en duration',
          contenu: en
            ? `$${f(prixSans, 4)} - ${f(prixAvec, 4)}$ = **${f(reponse, 2)} price points** (${pct(pertePct, 2)} of the risk-free price) — evaporated with no default having occurred: it is the price of carrying, not of dying. Chapter 4's anchor: coupon 4, r 3%, s 200 bp, 5 years ⇒ 8.909184 points. Per 100 bp of spread this bond loses about ${f(coutPar100, 2)} points — the exact, repriced version of exercise 9's spread duration; the linear −D × Δs approximation drifts on big spreads, because convexity works in your favour as the discounting deepens.`
            : `$${f(prixSans, 4)} - ${f(prixAvec, 4)}$ = **${f(reponse, 2)} points de prix** (${pct(pertePct, 2)} du prix sans risque) — évaporés sans qu'aucun défaut ait eu lieu : c'est le prix du portage, pas celui de la mort. L'ancre du chapitre 4 : coupon 4, r 3 %, s 200 pb, 5 ans ⇒ 8,909184 points. Par tranche de 100 pb de spread, cette obligation perd environ ${f(coutPar100, 2)} points — la version exacte, re-pricée, de la spread duration de l'exercice 9 ; l'approximation linéaire −D × Δs dévie sur les gros spreads, parce que la convexité joue pour vous à mesure que l'actualisation s'alourdit.`,
        },
      ],
      pieges: [
        en
          ? `Answering one of the two prices (${f(prixAvec, 2)} or ${f(prixSans, 2)}) instead of their difference: the question isolates what the CREDIT costs, and that only exists as a gap between the twin with and the twin without.`
          : `Répondre l'un des deux prix (${f(prixAvec, 2)} ou ${f(prixSans, 2)}) au lieu de leur écart : la question isole ce que COÛTE le crédit, et cela n'existe que comme différence entre le jumeau avec et le jumeau sans.`,
        en
          ? `Shortcutting with −D × Δs: over ${pb(spread)}, the linear spread-duration estimate visibly deviates from the exact ${f(reponse, 2)} points — the approximation is a local derivative, not a pricer. For big moves, reprice; keep the duration for small ones (exercise 9).`
          : `Court-circuiter avec −D × Δs : sur ${pb(spread)}, l'estimation linéaire en spread duration dévie visiblement des ${f(reponse, 2)} points exacts — l'approximation est une dérivée locale, pas un pricer. Pour les grands mouvements, on re-price ; on garde la duration pour les petits (exercice 9).`,
        en
          ? `The recurring toll: forgetting the /100 and discounting at ${f(rSans, 1)} + ${f(spread, 0)} = ${f(r2(rSans + spread), 1)}%. It repeats across the module because it keeps being committed — ${f(spread, 0)} bp = ${pct(r2(spread / 100), 2)}, every time.`
          : `Le péage récurrent : oublier le /100 et actualiser à ${f(rSans, 1)} + ${f(spread, 0)} = ${f(r2(rSans + spread), 1)} %. Il se répète dans tout le module parce qu'il continue de se commettre — ${f(spread, 0)} pb = ${pct(r2(spread / 100), 2)}, à chaque fois.`,
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// Export : les 14 générateurs du module, dans l'ordre de progression du cours
// ---------------------------------------------------------------------------
export const exercices: ExerciseGenerator[] = [
  genSpreadCredit,
  genPerteAttendue,
  genPrimeCds,
  genSpreadTheorique,
  genPdImplicite,
  genSurvieCumulee,
  genDefautCumule,
  genPrixObligationRisquee,
  genVariationSpread,
  genRendementNet,
  genPaiementDefautCds,
  genBaseCashCds,
  genPerteTranche,
  genCoutDuSpread,
];
