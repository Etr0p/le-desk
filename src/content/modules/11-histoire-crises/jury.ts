import type { JuryQuestion } from '../../../engine/types';

const M11 = '11-histoire-crises';

export const jury: JuryQuestion[] = [
  {
    id: 'm11-j-01',
    moduleId: M11,
    theme: '2008 : des subprimes au systémique',
    themeEn: '2008: from subprime to systemic',
    difficulte: 4,
    question: 'Racontez-moi 2008 en trois minutes.',
    questionEn: 'Tell me about 2008 in three minutes.',
    plan: [
      'Poser l\'énigme d\'entrée : ~500 Md$ de pertes subprime ont failli tuer un système de 60 000 Md$, quand la dot-com avait brûlé 5 000 Md$ sans crise bancaire — la question n\'est pas « combien de pertes ? » mais « où logeaient-elles ? »',
      'Le carburant : Fed à 1 % en 2003, épargne mondiale en quête de AAA, immobilier +90 % — et l\'hypothèse mortelle « les prix n\'ont jamais baissé au niveau national »',
      'La chaîne et la poudre : subprime → originate-to-distribute → titrisation (MBS, CDO, CDO²) → AAA fabriqué → AIG qui reconcentre ; le tout financé au jour le jour en repo — le run de 2008 est une ruée sur les haircuts (Gorton)',
      'Les dominos et les réponses : 9 août 2007 (BNP), Bear, Lehman le 15 septembre, AIG le 16, fonds monétaires, TARP, QE — et refermer sur la leçon : la localisation des pertes, pas leur taille',
    ],
    planEn: [
      'Open with the puzzle: ~500bn$ of subprime losses nearly killed a 60,000bn$ system, while the dot-com had burned 5,000bn$ without a banking crisis — the question is not "how much was lost?" but "where did the losses sit?"',
      'The fuel: Fed at 1% in 2003, global savings hunting AAA paper, house prices +90% — and the fatal assumption "national house prices have never fallen"',
      'The chain and the powder: subprime → originate-to-distribute → securitisation (MBS, CDO, CDO²) → manufactured AAA → AIG reconcentrating it all; the whole edifice funded overnight in repo — the 2008 run was a run on haircuts (Gorton)',
      'The dominoes and the responses: 9 August 2007 (BNP), Bear, Lehman on 15 September, AIG on the 16th, money market funds, TARP, QE — and close on the lesson: the location of losses, not their size',
    ],
    pointsAttendus: [
      'L\'énigme fondatrice : les pertes subprime réalisées (~500 Md$) sont dix fois plus petites que la capitalisation détruite par la dot-com (~5 000 Md$) — et pourtant c\'est 2008 qui a failli emporter le système',
      'Le carburant : taux Fed à 1 % (2003) pour amortir la dot-com, excédents asiatiques et pétroliers en quête d\'actifs sûrs en dollars, Case-Shiller +90 % entre 2000 et 2006, hypothèse « jamais de baisse nationale depuis 1945 » partagée par tous les modèles',
      'La chaîne de fabrication : prêts 2/28 et NINJA, originate-to-distribute (chaque maillon payé au flux, personne ne porte le risque, donc personne ne vérifie), subordination qui fabrique du AAA — valable seulement si les défauts sont peu corrélés, et la corrélation saute vers 1 dans un retournement national',
      'La poudre : levier ~30 des banques d\'investissement (Lehman ~31, mort à −3,2 %), financement en repo et ABCP au jour le jour, haircuts de 2 % à 25 % (financement de 98 à 75 par 100 de titres) — la « ruée sur les haircuts » de Gorton, un run invisible entre institutions',
      'La chronologie pivot avec ses dates : 9 août 2007 (BNP Paribas gèle trois fonds), mars 2008 (Bear Stearns, garantie Fed 29 Md$), 15 septembre 2008 (Lehman, 613 Md$ de dettes), 16 septembre (AIG, 85 Md$ contre 79,9 % ; Reserve Primary sous 1 $), TARP rejeté puis voté (700 Md$), QE1 en novembre',
      'Le bilan et la chute : S&P 500 de 1 565,15 à 676,53 (−56,8 %), ~8,8 millions d\'emplois détruits — et la leçon en une phrase : le systémique vient du levier et du financement court, pas de la taille de la perte initiale',
    ],
    pointsAttendusEn: [
      'The founding puzzle: realised subprime losses (~500bn$) are ten times smaller than the market cap destroyed by the dot-com (~5,000bn$) — yet 2008 is the one that nearly took down the system',
      'The fuel: Fed rate at 1% (2003) to cushion the dot-com bust, Asian and oil surpluses hunting safe dollar assets, Case-Shiller +90% between 2000 and 2006, the assumption "no national decline since 1945" shared by every model',
      'The production chain: 2/28 and NINJA loans, originate-to-distribute (every link paid on flow, nobody holds the risk, so nobody checks), subordination manufacturing AAA — valid only if defaults are weakly correlated, and correlation jumps towards 1 in a national downturn',
      'The powder: ~30 leverage at the investment banks (Lehman ~31, dead at −3.2%), overnight repo and ABCP funding, haircuts from 2% to 25% (funding from 98 to 75 per 100 of securities) — Gorton\'s "run on haircuts", an invisible run between institutions',
      'The pivotal chronology with dates: 9 August 2007 (BNP Paribas freezes three funds), March 2008 (Bear Stearns, 29bn$ Fed guarantee), 15 September 2008 (Lehman, 613bn$ of debt), 16 September (AIG, 85bn$ for 79.9%; Reserve Primary breaks the buck), TARP rejected then passed (700bn$), QE1 in November',
      'The toll and the punchline: S&P 500 from 1,565.15 to 676.53 (−56.8%), ~8.8 million jobs destroyed — and the one-sentence lesson: systemic risk comes from leverage and short funding, not from the size of the initial loss',
    ],
    bonus: [
      'Le plan large de début 2009 : la production industrielle mondiale chutait sur une pente comparable à celle de 1930 — la Grande Dépression était en train de recommencer, et c\'est la réponse (taux zéro, QE, garanties, relances coordonnées : tout ce que 1930 n\'avait pas fait) qui a bifurqué l\'histoire',
      'Lire les réformes comme le négatif de la crise : Bâle III et le LCR visent le financement court d\'actifs longs, EMIR et la compensation centrale visent le gré à gré d\'AIG, les stress tests institutionnalisent la question que personne ne posait en 2006 — « et si les prix baissaient partout à la fois ? »',
    ],
    bonusEn: [
      'The early-2009 wide shot: world industrial production was falling on a slope comparable to 1930 — the Great Depression was starting again, and it is the response (zero rates, QE, guarantees, coordinated stimulus: everything 1930 had not done) that forked history',
      'Read the reforms as the negative of the crisis: Basel III and the LCR target short funding of long assets, EMIR and central clearing target AIG\'s OTC web, and stress tests institutionalise the question nobody asked in 2006 — "what if prices fell everywhere at once?"',
    ],
    reponseModele: `L'erreur classique est de réciter « les subprimes ». L'énigme de 2008 est ailleurs : environ **500 Md$** de pertes subprime ont failli tuer un système financier de 60 000 Md$, alors que la dot-com avait détruit dix fois plus — 5 000 Md$ — sans une seule faillite bancaire. Trois minutes, trois actes.

**Le carburant.** Fed à 1 % en 2003 pour amortir la dot-com, épargne mondiale en quête de papier AAA, immobilier américain +90 % entre 2000 et 2006 — et, sous tous les modèles, l'hypothèse mortelle : les prix n'ont jamais baissé au niveau national depuis 1945.

**La chaîne.** Prêts 2/28 et NINJA distribués par des courtiers payés au volume — l'**originate-to-distribute** : quand personne ne garde le risque, personne ne vérifie. La titrisation empile les poupées russes — MBS, CDO, CDO² — où la subordination refabrique du AAA à chaque étage, valable seulement si les défauts sont peu corrélés ; dans un retournement national, la corrélation saute vers 1. Et AIG reconcentre tout : ~500 Md$ de CDS vendus sans réserves.

**La poudre.** Ces actifs longs sont financés au jour le jour — repo, ABCP — sans assurance des dépôts ni accès au prêteur en dernier ressort. Lehman est au levier 31 : mort à −3,2 %. Quand le doute arrive, les haircuts passent de 2 % à 25 % : le financement fond de 98 à 75, il faut vendre aujourd'hui — le run de 2008 est une **ruée sur les haircuts** (Gorton), invisible, entre institutions.

Les dominos : 9 août 2007, BNP gèle trois fonds ; mars 2008, Bear Stearns ; **15 septembre, Lehman** (613 Md$ de dettes) ; le 16, AIG sauvée (85 Md$ contre 79,9 %) ; le Reserve Primary casse le dollar, le papier commercial se ferme, TARP, taux zéro, QE1. Bilan : S&P −56,8 %, 8,8 millions d'emplois. La chute : ce n'est pas la taille des pertes qui fait le systémique — c'est **où elles logent, à quel levier, et comment elles sont financées**.`,
    reponseModeleEn: `The classic mistake is to recite "subprime". The puzzle of 2008 lies elsewhere: about **500bn$** of subprime losses nearly killed a 60,000bn$ financial system, when the dot-com had destroyed ten times more — 5,000bn$ — without a single bank failure. Three minutes, three acts.

**The fuel.** Fed at 1% in 2003 to cushion the dot-com bust, global savings hunting AAA paper, US house prices +90% between 2000 and 2006 — and, beneath every model, the fatal assumption: prices had never fallen nationally since 1945.

**The chain.** 2/28 and NINJA loans pushed by brokers paid on volume — **originate-to-distribute**: when nobody keeps the risk, nobody checks. Securitisation stacks the Russian dolls — MBS, CDO, CDO² — where subordination re-manufactures AAA at every level, valid only if defaults are weakly correlated; in a national downturn, correlation jumps towards 1. And AIG reconcentrates everything: ~500bn$ of CDS sold without reserves.

**The powder.** Those long assets are funded overnight — repo, ABCP — with no deposit insurance and no lender of last resort. Lehman runs at 31× leverage: dead at −3.2%. When doubt arrives, haircuts go from 2% to 25%: funding melts from 98 to 75, you must sell today — the 2008 run is a **run on haircuts** (Gorton), invisible, between institutions.

The dominoes: 9 August 2007, BNP freezes three funds; March 2008, Bear Stearns; **15 September, Lehman** (613bn$ of debt); on the 16th, AIG rescued (85bn$ for 79.9%); the Reserve Primary breaks the buck, commercial paper shuts, TARP, zero rates, QE1. Toll: S&P −56.8%, 8.8 million jobs. The punchline: it is not the size of the losses that makes a crisis systemic — it is **where they sit, at what leverage, and how they are funded**.`,
  },
  {
    id: 'm11-j-02',
    moduleId: M11,
    theme: '2008 : des subprimes au systémique',
    themeEn: '2008: from subprime to systemic',
    difficulte: 3,
    question: 'Pourquoi avoir sauvé AIG et pas Lehman ?',
    questionEn: 'Why was AIG rescued and not Lehman?',
    plan: [
      'Poser le paradoxe des 24 heures : Lehman déposée le 15 septembre 2008, AIG sauvée le 16 — deux décisions opposées, un jour d\'écart',
      'La clé : l\'interconnexion, pas la taille — AIG avait vendu ~500 Md$ de protection CDS aux grandes banques du monde entier ; sa faillite trouait simultanément tous les bilans d\'en face',
      'Lehman : une contrepartie parmi d\'autres, et la volonté politique de démontrer, après Bear Stearns, qu\'il n\'existait pas de garantie automatique',
      'Le verdict du marché en 24 heures — Reserve Primary sous 1 $, papier commercial fermé — et la conclusion : le systémique se mesure en liens, pas en milliards',
    ],
    planEn: [
      'State the 24-hour paradox: Lehman filed on 15 September 2008, AIG rescued on the 16th — two opposite decisions, one day apart',
      'The key: interconnection, not size — AIG had sold ~500bn$ of CDS protection to the world\'s major banks; its failure would have holed every counterparty\'s balance sheet simultaneously',
      'Lehman: one counterparty among others, and the political will to demonstrate, after Bear Stearns, that there was no automatic guarantee',
      'The market\'s verdict within 24 hours — Reserve Primary below 1$, commercial paper shut — and the conclusion: systemic risk is measured in links, not in billions',
    ],
    pointsAttendus: [
      'Les faits : 15 septembre 2008, Lehman dépose le bilan — 613 Md$ de dettes, la plus grosse faillite de l\'histoire américaine, pas de repreneur, pas de garantie publique ; 16 septembre, AIG reçoit 85 Md$ de la Fed contre 79,9 % du capital — une nationalisation de fait',
      'La raison décisive : AIG avait concentré ~500 Md$ de protection CDS vendue sur des tranches senior « sans risque », sans réserves en face — son défaut retirait d\'un coup l\'assurance de toutes les banques du monde, transformant une faillite en pandémie',
      'Lehman était une contrepartie parmi d\'autres : sa faillite était un choc, pas un retrait simultané d\'assurance systémique',
      'La dimension politique : après Bear Stearns (mars 2008, garantie Fed de 29 Md$), les autorités voulaient prouver qu\'il n\'y avait pas de garantie automatique — l\'aléa moral se combattait par l\'exemple',
      'Le coût de la démonstration : dès le 16 septembre, le Reserve Primary Fund « breaks the buck », la ruée gagne les fonds monétaires, le marché du papier commercial se ferme — plus personne n\'a jamais voulu refaire l\'expérience',
      'La leçon d\'oral : le risque systémique se mesure en interconnexions, pas en taille de bilan',
    ],
    pointsAttendusEn: [
      'The facts: 15 September 2008, Lehman files — 613bn$ of debt, the largest bankruptcy in US history, no buyer, no public guarantee; 16 September, AIG gets 85bn$ from the Fed for 79.9% of its equity — a de facto nationalisation',
      'The decisive reason: AIG had concentrated ~500bn$ of CDS protection sold on "riskless" senior tranches, with no reserves behind it — its default would have withdrawn insurance from every major bank at once, turning one failure into a pandemic',
      'Lehman was one counterparty among many: its failure was a shock, not a simultaneous withdrawal of systemic insurance',
      'The political dimension: after Bear Stearns (March 2008, 29bn$ Fed guarantee), the authorities wanted to prove there was no automatic guarantee — fighting moral hazard by example',
      'The cost of the demonstration: from 16 September, the Reserve Primary Fund breaks the buck, the run reaches money market funds, the commercial paper market shuts — nobody ever wanted to repeat the experiment',
      'The oral lesson: systemic risk is measured in interconnections, not in balance-sheet size',
    ],
    bonus: [
      'La cicatrice réglementaire directe : la compensation centrale obligatoire des dérivés standardisés (EMIR en Europe, Dodd-Frank aux États-Unis) — la chambre de compensation s\'interpose précisément pour qu\'un AIG ne puisse plus se propager de gré à gré',
      'Le contre-argument à connaître : certains soutiennent que Lehman était insolvable là où AIG souffrait d\'illiquidité sur appels de collatéral — la distinction de Bagehot affleure même dans ce choix ; mais en temps réel, personne ne pouvait trancher, et c\'est l\'interconnexion qui a décidé',
    ],
    bonusEn: [
      'The direct regulatory scar: mandatory central clearing of standardised derivatives (EMIR in Europe, Dodd-Frank in the US) — the clearing house steps in precisely so that an AIG can no longer propagate over the counter',
      'The counter-argument worth knowing: some hold that Lehman was insolvent while AIG suffered illiquidity on collateral calls — Bagehot\'s distinction surfaces even in this choice; but in real time nobody could tell, and interconnection made the call',
    ],
    reponseModele: `Deux décisions opposées à 24 heures d'écart : le **15 septembre 2008**, Lehman Brothers dépose le bilan — 613 Md$ de dettes, la plus grosse faillite de l'histoire américaine, pas de repreneur, pas de garantie publique. Le **16 septembre**, AIG est sauvée : 85 Md$ de la Fed contre 79,9 % du capital, une nationalisation de fait. La clé du contraste tient en un mot : l'**interconnexion** — pas la taille.

AIG avait vendu pour environ **500 Md$ de protection CDS** aux grandes banques du monde entier, sur des tranches senior réputées sans risque, sans mettre de réserves en face puisque le scénario de paiement était jugé impossible. Sa faillite aurait retiré *d'un coup* l'assurance de toutes les contreparties d'en face : un défaut transformé en pandémie, un trou instantané dans tous les bilans du système. Lehman, elle, était une contrepartie *parmi d'autres* — un choc sévère, pas un retrait simultané d'assurance systémique.

S'y ajoute le politique : après Bear Stearns en mars 2008 (vendue à JPMorgan avec 29 Md$ de garantie Fed), le marché avait retenu que « les gros seront sauvés ». Les autorités voulaient démontrer le contraire. Le verdict est tombé en 24 heures : le Reserve Primary Fund passe sous 1 $, la ruée gagne les fonds monétaires, le marché du papier commercial se ferme — la démonstration a coûté si cher que plus personne n'a jamais voulu la refaire.

La chute pour le jury : **le systémique se mesure en liens, pas en milliards de bilan** — et la compensation centrale imposée après-crise (EMIR, Dodd-Frank) est la réponse institutionnelle exacte au précédent AIG.`,
    reponseModeleEn: `Two opposite decisions 24 hours apart: on **15 September 2008**, Lehman Brothers files for bankruptcy — 613bn$ of debt, the largest failure in US history, no buyer, no public guarantee. On **16 September**, AIG is rescued: 85bn$ from the Fed for 79.9% of the equity, a de facto nationalisation. The key to the contrast is one word: **interconnection** — not size.

AIG had sold roughly **500bn$ of CDS protection** to the world's major banks, on senior tranches deemed riskless, with no reserves behind it since the payout scenario was judged impossible. Its failure would have withdrawn insurance from every counterparty *at once*: one default turned into a pandemic, an instant hole in every balance sheet in the system. Lehman was one counterparty *among many* — a severe shock, not a simultaneous withdrawal of systemic insurance.

Add the politics: after Bear Stearns in March 2008 (sold to JPMorgan with a 29bn$ Fed guarantee), the market had concluded that "the big ones get saved". The authorities wanted to prove otherwise. The verdict came within 24 hours: the Reserve Primary Fund breaks the buck, the run reaches money market funds, the commercial paper market shuts — the demonstration cost so much that nobody ever wanted to repeat it.

The closing line for the jury: **systemic risk is measured in links, not in billions of balance sheet** — and post-crisis mandatory central clearing (EMIR, Dodd-Frank) is the exact institutional answer to the AIG precedent.`,
  },
  {
    id: 'm11-j-03',
    moduleId: M11,
    theme: 'la grammaire des crises',
    themeEn: 'the grammar of crises',
    difficulte: 2,
    question: 'Qu\'est-ce qu\'une spirale de liquidité ? Donnez deux exemples historiques.',
    questionEn: 'What is a liquidity spiral? Give two historical examples.',
    plan: [
      'Poser la boucle : choc → fonds propres fondent (la dette ne partage pas les pertes) → le levier monte au pire moment → vente forcée sous décote → re-valorisation du book → re-choc',
      'Donner la formule : S = (A − λE)/(1 − λd), le dénominateur amplifie — au levier 25 et 2 % de décote, il faut vendre le double de l\'excès apparent ; zone de mort si λd ≥ 1',
      'Exemple 1 : l\'assurance de portefeuille en 1987 — les ventes programmées de futures fabriquent la baisse qui déclenche les ventes suivantes (−22,6 % en une séance)',
      'Exemple 2 : les gilts/LDI de 2022 — appels de marge → ventes de gilts → hausse des taux → nouveaux appels ; et la sortie : le pompier n\'a pas besoin de tout acheter, il lui suffit d\'écraser la décote',
    ],
    planEn: [
      'State the loop: shock → equity melts (debt does not share losses) → leverage rises at the worst moment → forced sale at a discount → mark-to-market of the remaining book → new shock',
      'Give the formula: S = (A − λE)/(1 − λd), the denominator amplifies — at 25× leverage and a 2% discount you must sell double the apparent excess; death zone if λd ≥ 1',
      'Example 1: portfolio insurance in 1987 — programmed futures sales manufacture the decline that triggers the next round of sales (−22.6% in one session)',
      'Example 2: gilts/LDI in 2022 — margin calls → gilt sales → higher yields → new calls; and the exit: the firefighter need not buy the whole market, crushing the discount is enough',
    ],
    pointsAttendus: [
      'Le moteur : au levier, les fonds propres absorbent toute la perte (ΔFP % = levier × Δactifs %), donc le levier monte mécaniquement après un choc — et le prêteur ou le risk manager exige de revenir à la cible : il faut vendre',
      'Vendre en urgence, c\'est vendre sous décote — et la vente déprime les prix du book restant, ce qui rogne encore les fonds propres : la boucle choc → vente forcée → re-valorisation → re-choc s\'auto-entretient',
      'La quantification : S = (A − λE)/(1 − λd) — au levier cible 25 et décote 2 %, 1 − λd = 0,5 : il faut vendre le double de l\'excès apparent ; si λd ≥ 1, vendre ne désendette plus — sauvetage ou faillite',
      '1987 : 60 à 90 Md$ d\'assurance de portefeuille vendent des futures selon la même règle — la stratégie fabrique le scénario contre lequel elle assure (−22,6 % le 19 octobre)',
      '2022 : les fonds LDI leviérisés reçoivent des appels de marge après +130 pb sur le gilt 30 ans, vendent des gilts, font monter les taux, reçoivent de nouveaux appels — la spirale la plus pure jamais observée',
      'La sortie : l\'acheteur en dernier ressort casse la boucle en écrasant la décote, pas en achetant tout — la BoE n\'a utilisé qu\'environ 19 Md£ en treize jours',
    ],
    pointsAttendusEn: [
      'The engine: under leverage, equity absorbs the whole loss (Δequity % = leverage × Δassets %), so leverage mechanically rises after a shock — and the lender or risk manager demands a return to target: you must sell',
      'Selling in a hurry means selling at a discount — and the sale marks down the remaining book, which erodes equity further: the loop shock → forced sale → revaluation → new shock feeds itself',
      'The quantification: S = (A − λE)/(1 − λd) — at target leverage 25 and a 2% discount, 1 − λd = 0.5: you must sell double the apparent excess; if λd ≥ 1, selling no longer deleverages — rescue or bankruptcy',
      '1987: 60 to 90bn$ of portfolio insurance selling futures on the same rule — the strategy manufactures the very scenario it insures against (−22.6% on 19 October)',
      '2022: leveraged LDI funds get margin calls after +130 bp on the 30-year gilt, sell gilts, push yields up, get new calls — the purest spiral ever observed',
      'The exit: the buyer of last resort breaks the loop by crushing the discount, not by buying everything — the BoE used only about £19bn in thirteen business days',
    ],
    bonus: [
      'Le troisième exemple qui unifie : la ruée sur les haircuts de 2008 — le haircut passe de 2 % à 25 %, le financement fond de 98 à 75, lever 23 sous 5 % de décote force à vendre 24,2 — même boucle, jouée sur le financement plutôt que sur la marge',
      'Le concept qui chapeaute : le risque endogène — la volatilité de crise n\'est pas un choc extérieur, elle est fabriquée par les règles de gestion des participants eux-mêmes ; votre stop-loss n\'est une protection que si les autres n\'ont pas le même',
    ],
    bonusEn: [
      'The third, unifying example: the 2008 run on haircuts — the haircut goes from 2% to 25%, funding melts from 98 to 75, raising 23 under a 5% discount forces the sale of 24.2 — the same loop, played on funding rather than margin',
      'The umbrella concept: endogenous risk — crisis volatility is not an external shock, it is manufactured by the participants\' own management rules; your stop-loss protects you only if the others do not have the same one',
    ],
    reponseModele: `Une spirale de liquidité est la boucle par laquelle **vendre pour se sauver aggrave la situation de tous les vendeurs**. Le moteur est le levier : les fonds propres absorbent toute la perte (ΔFP % = levier × Δactifs %), donc après un choc, le levier *monte* mécaniquement au pire moment — et le prêteur ou le risk manager exige de revenir à la cible. Il faut vendre. Mais vendre en urgence, c'est vendre **sous décote**, et la vente déprime les prix du book restant, ce qui rogne encore les fonds propres, ce qui force une nouvelle vente : choc → vente forcée → re-valorisation → re-choc.

La quantification fait la différence à l'oral : la vente nécessaire vaut S = (A − λE)/(1 − λd). Le dénominateur amplifie — au levier cible 25 et 2 % de décote, 1 − λd = 0,5 : il faut vendre le **double** de l'excès apparent. Et si λd ≥ 1, vendre ne désendette plus : c'est la zone de mort, où il ne reste que le sauvetage ou la faillite.

Deux exemples. **1987** : 60 à 90 Md$ d'assurance de portefeuille répliquent un put en vendant des futures quand le marché baisse — la baisse déclenche des ventes qui aggravent la baisse ; la stratégie fabrique le scénario contre lequel elle assure : −22,6 % le 19 octobre. **2022** : après +130 pb sur le gilt 30 ans en trois séances, les fonds LDI leviérisés reçoivent des appels de marge, vendent des gilts, font monter les taux, reçoivent de nouveaux appels — la spirale en laboratoire.

La sortie, enfin : le pompier n'a pas besoin d'acheter tout le marché — il lui suffit d'**écraser la décote** qui alimente la boucle. La BoE l'a prouvé : treize jours, environ 19 Md£, spirale éteinte en heures.`,
    reponseModeleEn: `A liquidity spiral is the loop by which **selling to save yourself worsens the position of every seller**. The engine is leverage: equity absorbs the whole loss (Δequity % = leverage × Δassets %), so after a shock leverage mechanically *rises* at the worst moment — and the lender or the risk manager demands a return to target. You must sell. But selling in a hurry means selling **at a discount**, and the sale marks down the remaining book, which erodes equity further, which forces another sale: shock → forced sale → revaluation → new shock.

Quantifying it makes the difference in an oral: the required sale is S = (A − λE)/(1 − λd). The denominator amplifies — at target leverage 25 and a 2% discount, 1 − λd = 0.5: you must sell **double** the apparent excess. And if λd ≥ 1, selling no longer deleverages: that is the death zone, where only rescue or bankruptcy remain.

Two examples. **1987**: 60 to 90bn$ of portfolio insurance replicate a put by selling futures as the market falls — the fall triggers sales that worsen the fall; the strategy manufactures the very scenario it insures against: −22.6% on 19 October. **2022**: after +130 bp on the 30-year gilt in three sessions, leveraged LDI funds get margin calls, sell gilts, push yields higher, get new calls — the spiral in laboratory conditions.

The exit, finally: the firefighter does not need to buy the whole market — it is enough to **crush the discount** feeding the loop. The BoE proved it: thirteen business days, about £19bn, spiral extinguished in hours.`,
  },
  {
    id: 'm11-j-04',
    moduleId: M11,
    theme: 'la dette souveraine et la doom loop',
    themeEn: 'sovereign debt and the doom loop',
    difficulte: 4,
    question: 'La crise de l\'euro : crise de solvabilité ou crise de liquidité ?',
    questionEn: 'The euro crisis: a solvency crisis or a liquidity crisis?',
    plan: [
      'Refuser le choix binaire : la Grèce était insolvable (le PSI de mars 2012 le prouve), mais la dimension proprement européenne de la crise était un problème de liquidité auto-réalisateur',
      'L\'argument de De Grauwe : un État qui emprunte dans une monnaie qu\'il n\'émet pas est un émergent endetté en devise — il peut mourir d\'illiquidité même solvable ; le Royaume-Uni, dette comparable, n\'a jamais subi ces spreads',
      'L\'arithmétique auto-réalisatrice : charge = dette/PIB × taux — à 180 % de dette, chaque point de taux coûte 1,8 point de PIB ; le taux fait la solvabilité, donc la panique se valide elle-même',
      'La preuve par les remèdes : le LTRO (liquidité) soulage mais resserre la doom loop ; l\'OMT (prêteur en dernier ressort crédible) éteint les spreads sans dépenser un euro — donc la composante liquidité dominait pour l\'Italie et l\'Espagne',
    ],
    planEn: [
      'Refuse the binary choice: Greece was insolvent (the March 2012 PSI proves it), but the distinctly European dimension of the crisis was a self-fulfilling liquidity problem',
      'De Grauwe\'s argument: a state borrowing in a currency it does not issue is an emerging market indebted in foreign currency — it can die of illiquidity while solvent; the UK, with comparable debt, never faced those spreads',
      'The self-fulfilling arithmetic: interest burden = debt/GDP × rate — at 180% debt, each point of yield costs 1.8 points of GDP; the rate makes the solvency, so the panic validates itself',
      'The proof by remedies: the LTRO (liquidity) soothes but tightens the doom loop; the OMT (a credible lender of last resort) extinguishes the spreads without spending a euro — so the liquidity component dominated for Italy and Spain',
    ],
    pointsAttendus: [
      'La réponse nuancée : les deux — la Grèce était réellement insolvable (déficit révisé de ~6 % à 12,7 %, final 15,4 % ; PSI avec décote nominale de 53,5 % et perte en valeur actuelle d\'environ 75 %), mais l\'Espagne et l\'Italie étaient victimes d\'un run auto-réalisateur',
      'De Grauwe : emprunter dans une monnaie qu\'on n\'émet pas expose à la faillite par illiquidité — le robinet de l\'euro appartenait à Francfort, sans prêteur en dernier ressort souverain ; le Royaume-Uni, dette et déficits comparables, empruntait dans sa propre monnaie : run impossible',
      'L\'arithmétique de la boucle : charge d\'intérêts = (dette/PIB) × taux/100 — Grèce 2011 à 180 % de dette : 5 % de taux = 9 % du PIB ; taux ↑ ⇒ charge ↑ ⇒ solvabilité ↓ ⇒ taux ↑ : la solvabilité dépend du taux, donc du régime de liquidité — une dette n\'est jamais soutenable dans l\'absolu, mais à un taux donné',
      'Le test par les remèdes : le LTRO (~1 000 Md€, déc. 2011-févr. 2012) fournit de la liquidité aux banques qui rachètent leur souverain — soulagement immédiat, biais domestique accru, doom loop resserrée : la liquidité ne guérit pas une solvabilité douteuse',
      'L\'OMT (septembre 2012), backstop illimité sous conditionnalité : jamais utilisé, pas un euro dépensé, spreads en chute de centaines de points de base — la preuve que pour l\'Italie et l\'Espagne, la composante dominante était la panique de liquidité',
      'La conclusion structurelle : la crise a révélé une union monétaire sans union budgétaire ni bancaire — l\'OMT a fourni le prêteur en dernier ressort manquant, l\'union bancaire (2014) a commencé à desserrer la doom loop',
    ],
    pointsAttendusEn: [
      'The nuanced answer: both — Greece was genuinely insolvent (deficit revised from ~6% to 12.7%, final 15.4%; PSI with a 53.5% nominal haircut and ~75% loss in present value), but Spain and Italy were victims of a self-fulfilling run',
      'De Grauwe: borrowing in a currency you do not issue exposes you to bankruptcy by illiquidity — the euro\'s tap belonged to Frankfurt, with no sovereign lender of last resort; the UK, with comparable debt and deficits, borrowed in its own currency: no run possible',
      'The loop\'s arithmetic: interest burden = (debt/GDP) × rate/100 — Greece 2011 at 180% debt: a 5% rate = 9% of GDP; rate ↑ ⇒ burden ↑ ⇒ solvency ↓ ⇒ rate ↑: solvency depends on the rate, hence on the liquidity regime — debt is never sustainable in the absolute, only at a given rate',
      'The test by remedies: the LTRO (~1,000bn€, Dec. 2011-Feb. 2012) provides liquidity to banks that buy their own sovereign — immediate relief, increased home bias, tightened doom loop: liquidity does not cure doubtful solvency',
      'The OMT (September 2012), an unlimited backstop under conditionality: never used, not one euro spent, spreads down by hundreds of basis points — proof that for Italy and Spain the dominant component was a liquidity panic',
      'The structural conclusion: the crisis revealed a monetary union without fiscal or banking union — the OMT supplied the missing lender of last resort, and banking union (2014) began to loosen the doom loop',
    ],
    bonus: [
      'Le thermomètre et ses ordres de grandeur : l\'OAT vit à 30-60 pb contre Bund, la Grèce franchit 1 000 pb au printemps 2010, l\'Italie 500 pb à l\'automne 2011, et le 10 ans grec dépasse 35 % en mars 2012 — soit 3 350 pb contre un Bund à 1,5 % : à ces niveaux, le taux n\'est plus une prime de risque, il EST le défaut anticipé',
      'Juillet 2012, la nature du risque change : les spreads espagnols au-delà de 7,5 % ne pricent plus seulement le défaut mais la redénomination — le retour à la peseta ; c\'est ce risque-là, existentiel pour la monnaie, qui justifie le « whatever it takes » du 26 juillet',
    ],
    bonusEn: [
      'The thermometer and its orders of magnitude: the OAT lives at 30-60 bp against the Bund, Greece crosses 1,000 bp in spring 2010, Italy 500 bp in autumn 2011, and the Greek 10-year exceeds 35% in March 2012 — 3,350 bp against a Bund at 1.5%: at those levels, the yield is no longer a risk premium, it IS the anticipated default',
      'July 2012, the nature of the risk changes: Spanish spreads beyond 7.5% no longer price only default but redenomination — the return to the peseta; it is that risk, existential for the currency, that justifies the "whatever it takes" of 26 July',
    ],
    reponseModele: `La bonne réponse refuse le choix binaire : **les deux, mais pas pour les mêmes pays** — et c'est la distinction reine du métier, appliquée aux États.

**La Grèce était insolvable.** Déficit 2009 révisé de ~6 % à 12,7 % du PIB (final : 15,4 %), statistiques fausses depuis des années, dette à 180 % du PIB. La preuve définitive : le **PSI de mars 2012** — décote nominale de 53,5 %, perte en valeur actuelle d'environ 75 % sur ~200 Md€ de dette privée. Aucune liquidité ne guérit cela : il a fallu un défaut.

**L'Espagne et l'Italie, elles, subissaient un run auto-réalisateur.** C'est l'analyse de **De Grauwe** : un État qui emprunte dans une monnaie qu'il n'émet pas est structurellement un émergent endetté en devise — il peut mourir d'**illiquidité** même solvable, si les investisseurs refusent de renouveler sa dette. Le Royaume-Uni, dette comparable, n'a jamais subi ces spreads : sa banque centrale émet la monnaie de sa dette, donc le run ne démarre pas. L'arithmétique rend la panique auto-réalisatrice : charge = dette/PIB × taux — à 180 % de dette, 5 % de taux coûtent 9 % du PIB ; taux ↑ ⇒ charge ↑ ⇒ solvabilité ↓ ⇒ taux ↑. La solvabilité d'un souverain n'existe qu'*à un taux donné*.

**La preuve par les remèdes.** Le LTRO (~1 000 Md€) — pure liquidité — soulage les taux mais resserre la doom loop : les banques du Sud se gavent de leur propre souverain. L'**OMT** — un prêteur en dernier ressort crédible, illimité, sous conditionnalité — n'a jamais été utilisé et a fait fondre les spreads de centaines de points de base. Quand une promesse non dépensée suffit, c'est que la composante dominante était la liquidité. La chute : l'euro de 2010 était une union monétaire sans prêteur en dernier ressort souverain — la crise n'en a été que le révélateur.`,
    reponseModeleEn: `The right answer refuses the binary choice: **both, but not for the same countries** — and this is the profession's master distinction, applied to states.

**Greece was insolvent.** Its 2009 deficit revised from ~6% to 12.7% of GDP (final: 15.4%), statistics false for years, debt at 180% of GDP. The definitive proof: the **PSI of March 2012** — a 53.5% nominal haircut, roughly 75% loss in present value on ~200bn€ of privately held debt. No amount of liquidity cures that: it took a default.

**Spain and Italy, by contrast, faced a self-fulfilling run.** That is **De Grauwe**'s analysis: a state borrowing in a currency it does not issue is structurally an emerging market indebted in foreign currency — it can die of **illiquidity** while solvent, if investors refuse to roll its debt. The UK, with comparable debt, never faced those spreads: its central bank issues the currency its debt is written in, so the run cannot start. The arithmetic makes the panic self-fulfilling: burden = debt/GDP × rate — at 180% debt, a 5% rate costs 9% of GDP; rate ↑ ⇒ burden ↑ ⇒ solvency ↓ ⇒ rate ↑. Sovereign solvency only exists *at a given rate*.

**The proof by remedies.** The LTRO (~1,000bn€) — pure liquidity — eased yields but tightened the doom loop: southern banks gorged on their own sovereign. The **OMT** — a credible, unlimited lender of last resort under conditionality — was never used and melted spreads by hundreds of basis points. When an unspent promise suffices, the dominant component was liquidity. The closing line: the euro of 2010 was a monetary union without a sovereign lender of last resort — the crisis merely revealed it.`,
  },
  {
    id: 'm11-j-05',
    moduleId: M11,
    theme: '1987 et LTCM : quand les modèles cassent le marché',
    themeEn: '1987 and LTCM: when models break the market',
    difficulte: 2,
    question: 'Que s\'est-il passé le 19 octobre 1987, et qu\'est-ce que ça a changé ?',
    questionEn: 'What happened on 19 October 1987, and what did it change?',
    plan: [
      'Le fait : −508 points, −22,6 % en une séance sur le Dow — le pire jour de l\'histoire de Wall Street, près de deux fois le pire jour de 1929, sans nouvelle fondamentale ce jour-là',
      'Le mécanisme : l\'assurance de portefeuille — 60 à 90 Md$ répliquant un put par ventes mécaniques de futures ; le sophisme de composition : la stratégie fabrique le scénario contre lequel elle assure',
      'Le lendemain : le communiqué d\'une phrase de Greenspan — Bagehot en une ligne — pas de deuxième acte, pas de récession, pic retrouvé en août 1989',
      'Les deux cicatrices permanentes : les circuit breakers, et le smile de volatilité — le marché price le krach en permanence depuis',
    ],
    planEn: [
      'The fact: −508 points, −22.6% in one session on the Dow — the worst day in Wall Street history, nearly twice the worst day of 1929, with no fundamental news that day',
      'The mechanism: portfolio insurance — 60 to 90bn$ replicating a put through mechanical futures sales; the fallacy of composition: the strategy manufactures the scenario it insures against',
      'The next morning: Greenspan\'s one-sentence statement — Bagehot in one line — no second act, no recession, peak regained by August 1989',
      'The two permanent scars: circuit breakers, and the volatility smile — the market has priced the crash permanently ever since',
    ],
    pointsAttendus: [
      'Les chiffres : de 2 246,74 à 1 738,74, soit −508 points et −22,6 % en une séance ; du pic du 25 août (2 722,42) au soir du 19 octobre, −36,1 % — dont près des deux tiers en une journée',
      'Le mécanisme : l\'assurance de portefeuille (Leland-O\'Brien-Rubinstein) réplique un put par delta-hedging — vendre des futures quand le marché baisse ; correct pour un acteur isolé, fatal pour 60-90 Md$ suivant la même règle : le risque endogène',
      'Le détail qui montre la compréhension : après une semaine de baisse (~10 %), les modèles avaient accumulé d\'énormes ventes en attente pour le lundi — le krach était mécaniquement chargé d\'avance',
      'La réponse : mardi matin, la Fed de Greenspan se dit « prête à servir de source de liquidité » — une phrase, pas un chèque ; les banques rouvrent leurs lignes aux brokers, pas de faillites en chaîne, pas de récession, pic retrouvé en août 1989',
      'Cicatrice 1 : les circuit breakers — suspendre la cotation pour casser les boucles de ventes programmées',
      'Cicatrice 2 : le smile de volatilité — avant 1987 la nappe était plate (monde lognormal de Black-Scholes) ; depuis, les puts hors de la monnaie cotent structurellement plus cher : la mémoire du krach, gravée dans les prix',
    ],
    pointsAttendusEn: [
      'The numbers: from 2,246.74 to 1,738.74 — −508 points and −22.6% in one session; from the 25 August peak (2,722.42) to the close of 19 October, −36.1% — nearly two thirds of it in a single day',
      'The mechanism: portfolio insurance (Leland-O\'Brien-Rubinstein) replicates a put via delta-hedging — selling futures as the market falls; correct for one isolated player, fatal for 60-90bn$ following the same rule: endogenous risk',
      'The detail that shows understanding: after a week of decline (~10%), the models had accumulated enormous pending sell orders for Monday — the crash was mechanically pre-loaded',
      'The response: Tuesday morning, Greenspan\'s Fed declares itself "ready to serve as a source of liquidity" — a sentence, not a cheque; banks reopen credit lines to brokers, no chain failures, no recession, peak regained in August 1989',
      'Scar 1: circuit breakers — halting trading to break the loops of programmed selling',
      'Scar 2: the volatility smile — before 1987 the surface was flat (Black-Scholes lognormal world); ever since, out-of-the-money puts trade structurally richer: the crash\'s memory, engraved in prices',
    ],
    bonus: [
      'Le paradoxe à énoncer soi-même : près de deux fois pire que le pire jour de 1929 — et aucune dépression : la gravité d\'un krach ne se juge pas à sa violence boursière mais à sa transmission au crédit ; 1929 et 1987 sont l\'expérience contrôlée de l\'histoire, même choc, avec et sans pompier',
      'L\'arithmétique qui relativise : récupérer −22,6 % n\'exige que +29,2 % — la vraie question n\'est pas la profondeur du trou mais ce qui se passe le lendemain matin ; et le VIX, créé en 1993, a transformé la mémoire de 1987 en thermomètre coté',
    ],
    bonusEn: [
      'The paradox to state unprompted: nearly twice as bad as the worst day of 1929 — and no depression: a crash\'s severity is judged not by its market violence but by its transmission to credit; 1929 and 1987 are history\'s controlled experiment, same shock, with and without a firefighter',
      'The arithmetic that puts it in perspective: recovering −22.6% only requires +29.2% — the real question is not the depth of the hole but what happens the next morning; and the VIX, created in 1993, turned the memory of 1987 into a quoted thermometer',
    ],
    reponseModele: `Le lundi 19 octobre 1987, le Dow Jones perd **−508 points, −22,6 % en une seule séance** — de 2 246,74 à 1 738,74. Le pire jour de l'histoire de Wall Street, près de deux fois le pire jour de 1929 — et sans aucune nouvelle fondamentale ce jour-là. C'est la première grande crise causée par des **modèles**.

Le mécanisme : l'**assurance de portefeuille**. Entre 60 et 90 Md$ de portefeuilles répliquaient un put synthétique par delta-hedging — vendre des futures S&P 500 quand le marché baisse, mécaniquement. Le raisonnement est correct pour un acteur isolé ; il est fatal pour la salle entière : quand des dizaines de milliards suivent la même règle, la baisse déclenche des ventes qui aggravent la baisse — le **sophisme de composition**. Après une semaine à −10 %, les modèles avaient accumulé d'énormes ventes en attente pour le lundi : le krach était chargé d'avance. La stratégie a fabriqué le scénario contre lequel elle assurait.

Ce qui a changé, d'abord, dans l'immédiat : le mardi matin, la Fed de Greenspan publie **une phrase** — « prête à servir de source de liquidité » — du Bagehot en une ligne. Les banques rouvrent leurs lignes aux brokers, la panique n'a pas de deuxième acte, aucune récession, et le Dow retrouve son pic dès août 1989. Même violence que 1929, transmission au crédit coupée : tout le contraste tient là.

Ensuite, deux cicatrices permanentes. Les **circuit breakers**, qui suspendent la cotation pour casser les boucles de ventes programmées — ils serviront quatre fois en mars 2020. Et surtout le **smile de volatilité** : avant octobre 1987, la nappe de volatilité implicite était à peu près plate ; depuis, les puts hors de la monnaie cotent structurellement plus cher. Le marché price la possibilité du krach en permanence — la mémoire du 19 octobre, gravée dans chaque nappe d'options.`,
    reponseModeleEn: `On Monday 19 October 1987, the Dow Jones loses **−508 points, −22.6% in a single session** — from 2,246.74 to 1,738.74. The worst day in Wall Street history, nearly twice the worst day of 1929 — and with no fundamental news that day. It is the first major crisis caused by **models**.

The mechanism: **portfolio insurance**. Between 60 and 90bn$ of portfolios replicated a synthetic put through delta-hedging — mechanically selling S&P 500 futures as the market fell. The reasoning is correct for one isolated player; it is fatal for the whole room: when tens of billions follow the same rule, the decline triggers sales that worsen the decline — the **fallacy of composition**. After a week down ~10%, the models had accumulated enormous pending sell orders for Monday: the crash was pre-loaded. The strategy manufactured the very scenario it insured against.

What changed, first, immediately: on Tuesday morning, Greenspan's Fed issues **one sentence** — "ready to serve as a source of liquidity" — Bagehot in one line. Banks reopen their credit lines to brokers, the panic has no second act, no recession, and the Dow regains its peak by August 1989. Same violence as 1929, credit transmission cut: the whole contrast lies there.

Then, two permanent scars. **Circuit breakers**, which halt trading to break the loops of programmed selling — they would fire four times in March 2020. And above all the **volatility smile**: before October 1987, the implied volatility surface was roughly flat; ever since, out-of-the-money puts have traded structurally richer. The market prices the possibility of a crash permanently — the memory of 19 October, engraved in every option surface.`,
  },
  {
    id: 'm11-j-06',
    moduleId: M11,
    theme: '1987 et LTCM : quand les modèles cassent le marché',
    themeEn: '1987 and LTCM: when models break the market',
    difficulte: 4,
    question: 'LTCM : deux prix Nobel, et alors ?',
    questionEn: 'LTCM: two Nobel laureates — so what?',
    plan: [
      'Le dispositif : Meriwether, Merton et Scholes, des trades de convergence (off-the-run/on-the-run, spreads de swap) — chacun rapportant très peu, donc démultipliés par le levier : 125 Md$ d\'actifs pour 4,7 Md$ de capital, levier ≈ 27, mort à −3,7 %',
      'Le déclencheur : le défaut russe du 17 août 1998 — LTCM n\'a presque rien en Russie, mais la fuite vers la qualité écarte tous les spreads en même temps : cent positions « indépendantes » se révèlent être le même pari répété — que le calme continue',
      'L\'agonie : −44 % en août, capital vers 400 M$ pour plus de 100 Md$ d\'actifs — levier > 250 ; le fonds ne peut plus vendre sans écraser ses propres prix',
      'Le dénouement et les leçons : consortium privé de 3,625 Md$ orchestré par la Fed de New York — pas un dollar public ; VaR calibrée sur le calme, corrélations vers 1, crowded trade : le prestige des modèles était devenu une condition de financement',
    ],
    planEn: [
      'The setup: Meriwether, Merton and Scholes, convergence trades (off-the-run/on-the-run, swap spreads) — each earning very little, hence multiplied by leverage: 125bn$ of assets on 4.7bn$ of capital, leverage ≈ 27, dead at −3.7%',
      'The trigger: the Russian default of 17 August 1998 — LTCM holds almost nothing in Russia, but the flight to quality widens every spread at once: a hundred "independent" positions turn out to be the same bet repeated — that calm continues',
      'The agony: −44% in August, capital down towards 400M$ against more than 100bn$ of assets — leverage > 250; the fund can no longer sell without crushing its own prices',
      'The resolution and the lessons: a private consortium of 3.625bn$ orchestrated by the New York Fed — not one public dollar; VaR calibrated on calm data, correlations to 1, the crowded trade: the models\' prestige had become a funding condition',
    ],
    pointsAttendus: [
      'Le bilan en trois nombres : capital ~4,7 Md$, actifs ~125 Md$, levier ≈ 27 — donc variation fatale −100/27 ≈ −3,7 % ; plus de 1 000 Md$ de notionnels de dérivés hors bilan',
      'Le financement du levier : le repo à haircuts quasi nuls — un haircut de 2 % autorise à lui seul un levier de 50 ; le prestige des Nobel n\'était pas une image, c\'était une condition de financement',
      'La mécanique de la perte : chaque trade de convergence revenait à vendre la qualité et acheter l\'écart — le défaut russe déclenche une fuite vers la qualité mondiale, tous les spreads s\'écartent ensemble, les corrélations montent vers 1 précisément quand la diversification devait jouer',
      'Les chiffres de l\'agonie : −44 % en août 1998 ; fin septembre, ~400 M$ de capital pour plus de 100 Md$ d\'actifs — levier supérieur à 250, chaque 0,4 % de variation est une question de survie',
      'Le sauvetage, avec sa nuance : 23 septembre 1998, quatorze banques réunies par la Fed de New York injectent 3,625 Md$ de capitaux PRIVÉS et reprennent 90 % du fonds — la Fed a prêté sa salle de réunion et son autorité, pas un dollar',
      'Les leçons : la VaR calibrée sur le calme estime la queue avec des données qui n\'en contiennent pas ; le crowded trade — votre risque inclut les positions des autres ; et le levier transforme « avoir raison à terme » en « être mort avant » : les trades ont convergé en 1999, après la mort du fonds',
    ],
    pointsAttendusEn: [
      'The balance sheet in three numbers: capital ~4.7bn$, assets ~125bn$, leverage ≈ 27 — hence a fatal move of −100/27 ≈ −3.7%; more than 1,000bn$ of derivative notionals off balance sheet',
      'How the leverage was funded: repo at near-zero haircuts — a 2% haircut alone allows 50× leverage; the Nobel prestige was not an image, it was a funding condition',
      'The loss mechanics: every convergence trade amounted to selling quality and buying the spread — the Russian default triggers a global flight to quality, all spreads widen together, correlations rise towards 1 precisely when diversification was supposed to work',
      'The agony in numbers: −44% in August 1998; by late September, ~400M$ of capital against more than 100bn$ of assets — leverage above 250, where every 0.4% move is a matter of survival',
      'The rescue, with its nuance: 23 September 1998, fourteen banks convened by the New York Fed inject 3.625bn$ of PRIVATE capital and take over 90% of the fund — the Fed lent its meeting room and its authority, not a dollar',
      'The lessons: a VaR calibrated on calm estimates the tail with data that contains none; the crowded trade — your risk includes other people\'s positions; and leverage turns "being right eventually" into "being dead first": the trades converged in 1999, after the fund\'s death',
    ],
    bonus: [
      'La citation-devise de l\'épisode, attribuée à Keynes : « le marché peut rester irrationnel plus longtemps que vous ne pouvez rester solvable » — et son pendant : presque tous les trades de LTCM étaient bons, c\'est le chemin qui a tué, pas la destination',
      'Le débat d\'aléa moral qui reste ouvert : aucun argent public, mais l\'orchestration par la banque centrale a-t-elle installé la conviction qu\'un acteur assez central sera toujours secouru ? Dix ans plus tard, Bear Stearns semble confirmer — puis Lehman dément, au pire prix',
    ],
    bonusEn: [
      'The episode\'s motto, attributed to Keynes: "the market can stay irrational longer than you can stay solvent" — and its corollary: almost all of LTCM\'s trades were good ones; the path killed, not the destination',
      'The moral hazard debate that remains open: no public money, but did the central bank\'s orchestration plant the conviction that any sufficiently central player will always be rescued? Ten years later, Bear Stearns seems to confirm — then Lehman refutes it, at the worst possible price',
    ],
    reponseModele: `« Et alors » : les deux Nobel sont précisément le cœur du sujet — LTCM démontre que l'excellence des modèles ne protège pas de la structure du marché, et qu'elle peut même l'aggraver.

**Le dispositif.** John Meriwether, ex-Salomon, avec Merton et Scholes au conseil — Nobel 1997 pour la théorie des options. La stratégie : des **trades de convergence** — acheter le Treasury off-the-run, vendre l'on-the-run, empocher quelques points de base d'écart pour un risque de crédit identique. Chaque position rapporte très peu : on démultiplie donc par le levier. Début 1998 : **4,7 Md$ de capital, 125 Md$ d'actifs — levier ≈ 27**, mort à −3,7 % ; plus de 1 000 Md$ de notionnels hors bilan. Le financement : du repo à haircuts quasi nuls — 2 % de haircut autorisent déjà un levier de 50. Le prestige des Nobel n'était pas une image : c'était une **condition de financement**.

**La chute.** Le 17 août 1998, la Russie fait défaut. LTCM n'a presque rien en Russie — et c'est toute la leçon : la fuite vers la qualité écarte **tous** les spreads en même temps. Cent positions construites comme indépendantes se révèlent être le même pari répété cent fois : que le calme continue. Les corrélations montent vers 1 précisément quand la diversification devait sauver. Août : **−44 %**. Fin septembre : ~400 M$ de capital pour plus de 100 Md$ d'actifs — levier supérieur à 250 — et le fonds ne peut plus vendre sans écraser ses propres prix, car tout le marché connaît ses positions.

**Le dénouement.** Le 23 septembre, quatorze banques réunies par la Fed de New York injectent **3,625 Md$ privés** — pas un dollar public : la Fed a prêté sa salle et son autorité. Les leçons, à réciter : la VaR calibrée sur le calme n'a pas de queues ; le **crowded trade** — votre risque inclut les positions des autres ; et le levier transforme « avoir raison à terme » en « être mort avant » — les trades ont convergé en 1999, après la mort du fonds.`,
    reponseModeleEn: `"So what": the two Nobels are precisely the heart of the matter — LTCM demonstrates that model excellence does not protect you from market structure, and can even make it worse.

**The setup.** John Meriwether, ex-Salomon, with Merton and Scholes on the board — 1997 Nobel for option theory. The strategy: **convergence trades** — buy the off-the-run Treasury, sell the on-the-run, pocket a few basis points of spread for identical credit risk. Each position earns very little: so you multiply by leverage. Early 1998: **4.7bn$ of capital, 125bn$ of assets — leverage ≈ 27**, dead at −3.7%; over 1,000bn$ of derivative notionals off balance sheet. The funding: repo at near-zero haircuts — a 2% haircut already allows 50× leverage. The Nobel prestige was not an image: it was a **funding condition**.

**The fall.** On 17 August 1998, Russia defaults. LTCM holds almost nothing in Russia — and that is the whole lesson: the flight to quality widens **every** spread at once. A hundred positions built as independent turn out to be the same bet repeated a hundred times: that calm continues. Correlations rise towards 1 precisely when diversification was supposed to save the day. August: **−44%**. Late September: ~400M$ of capital against more than 100bn$ of assets — leverage above 250 — and the fund can no longer sell without crushing its own prices, because the whole market knows its positions.

**The resolution.** On 23 September, fourteen banks convened by the New York Fed inject **3.625bn$ of private money** — not one public dollar: the Fed lent its meeting room and its authority. The lessons, to recite: a VaR calibrated on calm has no tails; the **crowded trade** — your risk includes other people's positions; and leverage turns "being right eventually" into "being dead first" — the trades converged in 1999, after the fund's death.`,
  },
  {
    id: 'm11-j-07',
    moduleId: M11,
    theme: '1929 et la Grande Dépression',
    themeEn: '1929 and the Great Depression',
    difficulte: 2,
    question: 'Pourquoi le Dow a-t-il mis 25 ans à retrouver son pic de 1929 ?',
    questionEn: 'Why did the Dow take 25 years to regain its 1929 peak?',
    plan: [
      'Poser les bornes : pic à 381,17 le 3 septembre 1929, creux à 41,22 le 8 juillet 1932 — soit −89,19 % ; le pic n\'est revu qu\'en novembre 1954',
      'La première raison est arithmétique : l\'asymétrie des pertes — après −89 %, il faut +809 % pour revenir ; à 7 %/an, la théorie donne 32,6 ans',
      'La deuxième est macroéconomique : la dépression et la déflation — 9 000 banques mortes, masse monétaire −1/3, prix en chute de ~10 %/an, debt-deflation de Fisher',
      'Nuancer en refermant : déflation et dividendes rendent le chiffre de 25 ans un peu trompeur en termes réels — mais la révulsion de Kindleberger a détourné une génération entière de la Bourse',
    ],
    planEn: [
      'Set the bounds: peak at 381.17 on 3 September 1929, trough at 41.22 on 8 July 1932 — a −89.19% drawdown; the peak is only regained in November 1954',
      'The first reason is arithmetic: the asymmetry of losses — after −89%, it takes +809% to get back; at 7%/year, theory gives 32.6 years',
      'The second is macroeconomic: depression and deflation — 9,000 dead banks, money supply down a third, prices falling ~10%/year, Fisher\'s debt-deflation',
      'Close with the nuance: deflation and dividends make the 25-year figure slightly misleading in real terms — but Kindleberger\'s revulsion turned an entire generation away from the stock market',
    ],
    pointsAttendus: [
      'Les chiffres exacts : 381,17 (3 septembre 1929) → 41,22 (8 juillet 1932) = −89,19 % ; un dollar investi au sommet vaut onze cents ; pic revu en novembre 1954',
      'L\'asymétrie des pertes, LE point : gain requis = 100/(100 − perte) − 1 — après −89 %, il faut +809 % ; la convexité explose pour les grandes pertes (−50 % exige +100 %, −22,6 % seulement +29,2 %)',
      'Le corollaire temporel : à 7 % de croissance annuelle, récupérer −89 % demande ln(1/0,11)/ln(1,07) ≈ 32,6 ans — les 25 ans observés sont l\'ordre de grandeur que l\'arithmétique impose',
      'Le contexte qui a creusé le trou : le krach n\'a détruit qu\'une partie — le faux rebond de +48 % (novembre 1929-avril 1930) puis la vraie descente ; 9 000 banques mortes, masse monétaire −1/3 (Friedman-Schwartz), déflation ~10 %/an et debt-deflation de Fisher',
      'La nuance des bonnes copies : en termes réels, le creux était moins profond que −89 % nominal (prix ~25 % plus bas en 1932), et les dividendes élevés (souvent > 5 %) ont fait retrouver le pouvoir d\'achat en total return des années avant 1954 — le chiffre de 25 ans mesure la souffrance du porteur en prix nominal',
      'La dimension comportementale : la révulsion de Kindleberger — après une bulle, la génération entière se détourne ; les Américains ne reviennent massivement en Bourse que dans les années 1950',
    ],
    pointsAttendusEn: [
      'The exact numbers: 381.17 (3 September 1929) → 41.22 (8 July 1932) = −89.19%; a dollar invested at the top is worth eleven cents; peak regained in November 1954',
      'The asymmetry of losses, THE point: required gain = 100/(100 − loss) − 1 — after −89%, it takes +809%; the convexity explodes for large losses (−50% requires +100%, −22.6% only +29.2%)',
      'The time corollary: at 7% annual growth, recovering −89% takes ln(1/0.11)/ln(1.07) ≈ 32.6 years — the observed 25 years are the order of magnitude arithmetic dictates',
      'The context that dug the hole: the crash destroyed only part of it — the +48% false rebound (November 1929-April 1930) then the true descent; 9,000 dead banks, money supply down a third (Friedman-Schwartz), ~10%/year deflation and Fisher\'s debt-deflation',
      'The nuance of good answers: in real terms the trough was less deep than the nominal −89% (prices ~25% lower in 1932), and high dividends (often > 5%) restored purchasing power in total return terms years before 1954 — the 25-year figure measures the holder\'s pain in nominal price',
      'The behavioural dimension: Kindleberger\'s revulsion — after a bubble, the whole generation turns away; Americans only return to equities in numbers in the 1950s',
    ],
    bonus: [
      'La comparaison qui éclaire : le Nasdaq post-2000 (−78 %) a mis quinze ans à revoir 5 000 points, le Nikkei post-1989 a mis 34 ans — dès qu\'un drawdown dépasse les trois quarts, l\'arithmétique impose la décennie ; à l\'inverse, le S&P post-COVID (−33,9 %) a tout repris en cinq mois : le point de départ et le régime monétaire décident de tout',
      'Le réflexe d\'entretien : devant tout drawdown, calculer le gain requis AVANT de parler de rebond — la symétrie naïve (« j\'ai perdu 50 %, je remonterai de 50 % ») laisse à −25 % du compte',
    ],
    bonusEn: [
      'The illuminating comparison: the post-2000 Nasdaq (−78%) took fifteen years to see 5,000 again, the post-1989 Nikkei took 34 — once a drawdown exceeds three quarters, arithmetic dictates decades; conversely the post-COVID S&P (−33.9%) took it all back in five months: the starting point and the monetary regime decide everything',
      'The interview reflex: facing any drawdown, compute the required gain BEFORE talking about a rebound — naive symmetry ("I lost 50%, I will climb back 50%") leaves you at −25%',
    ],
    reponseModele: `Parce que l'arithmétique des pertes est **asymétrique**, et que la dépression a creusé un trou dont on ne sort pas en additionnant des pourcentages.

**Les bornes.** Le Dow culmine à **381,17** le 3 septembre 1929 et touche **41,22** le 8 juillet 1932 : −89,19 %. Un dollar investi au sommet vaut onze cents. Et le krach d'octobre n'a fait qu'une partie du travail : après un faux rebond de +48 % jusqu'en avril 1930, c'est la dépression de 1930-1932 — 9 000 banques mortes, masse monétaire amputée d'un tiers, prix en chute de ~10 % par an, la debt-deflation de Fisher — qui fait le reste.

**L'arithmétique.** Le gain requis pour récupérer une perte vaut 100/(100 − perte) − 1 : une fonction **convexe** qui explose. Après −50 %, il faut +100 % ; après −89 %, il faut **+809 %** — multiplier par neuf. À 7 % de croissance annuelle, la théorie donne ln(1/0,11)/ln(1,07) ≈ **32,6 ans** : les 25 ans observés ne sont pas une anomalie, ils sont l'ordre de grandeur que l'arithmétique impose.

**La nuance qui fait la bonne copie.** Le chiffre de 25 ans mesure le prix *nominal* — le seul que le porteur voyait. En termes réels, la déflation (prix ~25 % plus bas en 1932) rendait le creux moins profond, et les dividendes élevés des années 1930-1940 (souvent plus de 5 %) ont fait retrouver le pouvoir d'achat, en total return, des années avant 1954. Mais qui a tenu ? Le spéculateur à levier 10 était mort en octobre 1929, et la **révulsion** de Kindleberger a fait le reste : après une bulle, c'est une génération entière qui se détourne. La chute : −89 % n'est pas une perte comme les autres — c'est un quart de siècle, câblé dans la convexité.`,
    reponseModeleEn: `Because the arithmetic of losses is **asymmetric**, and the Depression dug a hole you cannot climb out of by adding percentages.

**The bounds.** The Dow peaks at **381.17** on 3 September 1929 and touches **41.22** on 8 July 1932: −89.19%. A dollar invested at the top is worth eleven cents. And the October crash did only part of the work: after a +48% false rebound into April 1930, it is the 1930-1932 depression — 9,000 dead banks, money supply cut by a third, prices falling ~10% a year, Fisher's debt-deflation — that does the rest.

**The arithmetic.** The gain required to recover a loss is 100/(100 − loss) − 1: a **convex** function that explodes. After −50%, you need +100%; after −89%, you need **+809%** — a ninefold multiple. At 7% annual growth, theory gives ln(1/0.11)/ln(1.07) ≈ **32.6 years**: the observed 25 years are no anomaly, they are the order of magnitude arithmetic dictates.

**The nuance that makes a good answer.** The 25-year figure measures the *nominal* price — the only one the holder saw. In real terms, deflation (prices ~25% lower in 1932) made the trough shallower, and the high dividends of the 1930s-40s (often above 5%) restored purchasing power, in total return, years before 1954. But who held on? The 10× leveraged speculator died in October 1929, and Kindleberger's **revulsion** did the rest: after a bubble, an entire generation turns away. The closing line: −89% is not a loss like any other — it is a quarter of a century, hard-wired into convexity.`,
  },
  {
    id: 'm11-j-08',
    moduleId: M11,
    theme: 'la grammaire des crises',
    themeEn: 'the grammar of crises',
    difficulte: 2,
    question: 'Liquidité et solvabilité : expliquez la distinction — et pourquoi elle est reine.',
    questionEn: 'Liquidity and solvency: explain the distinction — and why it reigns supreme.',
    plan: [
      'Les définitions : insolvable — les actifs valent moins que les dettes, le trou est réel ; illiquide — les actifs couvrent les dettes mais ne sont pas transformables en cash aujourd\'hui, alors que les créanciers réclament aujourd\'hui',
      'Le paradoxe opérationnel : une institution solvable mais illiquide meurt aussi vite qu\'une insolvable — forcée de vendre sous décote, elle DEVIENT insolvable en essayant de prouver qu\'elle ne l\'était pas',
      'La doctrine qui en découle : Bagehot (1873) — prêter largement, à taux de pénalité, contre du bon collatéral ; chaque terme a sa logique',
      'L\'exemple moderne le plus pur : les gilts/LDI de 2022 — des fonds ENRICHIS par la hausse des taux (solvabilité améliorée) ont failli mourir de ne pas pouvoir poster la marge du mardi',
    ],
    planEn: [
      'The definitions: insolvent — assets worth less than debts, the hole is real; illiquid — assets cover debts but cannot be turned into cash today, while creditors demand payment today',
      'The operational paradox: a solvent but illiquid institution dies as fast as an insolvent one — forced to sell at a discount, it BECOMES insolvent while trying to prove it was not',
      'The doctrine that follows: Bagehot (1873) — lend freely, at a penalty rate, against good collateral; each term has its logic',
      'The purest modern example: the 2022 gilts/LDI episode — funds ENRICHED by rising rates (improved solvency) nearly died of being unable to post Tuesday\'s margin',
    ],
    pointsAttendus: [
      'Les deux définitions exactes, et le mécanisme de conversion : l\'illiquide forcé de vendre sous décote devient insolvable — la vente forcée transforme un problème de calendrier en trou réel',
      'La racine du problème : tout financement court est un plébiscite quotidien, fondé sur une croyance circulaire (« je prête parce que je crois que d\'autres prêteront demain ») — dès que la croyance vacille, chacun a individuellement raison de couper le premier',
      'Bagehot, terme à terme : largement (éteindre la panique en prouvant que le cash existe), taux de pénalité (que seuls les vrais illiquides viennent), bon collatéral (filtrer les solvables — un insolvable n\'a pas de bon collatéral à offrir)',
      'Pourquoi elle est reine : chaque intervention de crise se juge à cette aune — 1907 (Morgan trie les livres), 1929 (la Fed ne prête pas : 9 000 banques meurent), 1987 (une phrase suffit), 2008 (Lehman/AIG), 2012 (LTRO contre OMT), 2022 (gilts), 2023 (BTFP)',
      'Gilts 2022, l\'exemple canonique : la hausse des taux améliore la solvabilité économique des fonds de pension (la valeur actualisée des engagements dégonfle) — et les fonds LDI ont pourtant failli mourir des appels de marge : solvables, illiquides, presque morts',
      'L\'aveu d\'honnêteté qui impressionne : en temps réel, la question « liquidité ou solvabilité ? » est toujours posée et rarement tranchable — c\'est toute la difficulté du métier de pompier',
    ],
    pointsAttendusEn: [
      'The two exact definitions, and the conversion mechanism: the illiquid party forced to sell at a discount becomes insolvent — the forced sale turns a calendar problem into a real hole',
      'The root of the problem: all short funding is a daily plebiscite, resting on a circular belief ("I lend because I believe others will lend tomorrow") — once the belief wavers, each lender is individually right to cut first',
      'Bagehot, term by term: freely (extinguish the panic by proving the cash exists), penalty rate (so only the truly illiquid come), good collateral (filter the solvent — an insolvent firm has no good collateral to offer)',
      'Why it reigns: every crisis intervention is judged by this yardstick — 1907 (Morgan sorts the books), 1929 (the Fed does not lend: 9,000 banks die), 1987 (one sentence suffices), 2008 (Lehman/AIG), 2012 (LTRO versus OMT), 2022 (gilts), 2023 (BTFP)',
      'Gilts 2022, the canonical example: rising rates improve pension funds\' economic solvency (the present value of liabilities deflates) — and yet the LDI funds nearly died of margin calls: solvent, illiquid, almost dead',
      'The honest admission that impresses: in real time, the question "liquidity or solvency?" is always asked and rarely answerable — that is the firefighter\'s whole difficulty',
    ],
    bonus: [
      'La version souveraine de la distinction : De Grauwe — un État qui emprunte dans une monnaie qu\'il n\'émet pas peut mourir d\'illiquidité même solvable ; c\'est la grille de lecture de toute la crise de l\'euro, et la raison pour laquelle l\'OMT a suffi sans dépenser un euro',
      'Le Bagehot « tordu » de 2023 : le BTFP prête au pair contre du collatéral qui cote sous le pair — prêter contre bon collatéral, oui, mais valorisé généreusement : un Bagehot taillé sur mesure pour une crise de duration, et la preuve que la doctrine s\'adapte plus qu\'elle ne s\'applique',
    ],
    bonusEn: [
      'The sovereign version of the distinction: De Grauwe — a state borrowing in a currency it does not issue can die of illiquidity while solvent; it is the reading grid of the whole euro crisis, and the reason the OMT sufficed without spending a euro',
      'The "twisted" Bagehot of 2023: the BTFP lends at par against collateral trading below par — lending against good collateral, yes, but generously valued: a Bagehot tailored to a duration crisis, and proof that the doctrine adapts more than it applies',
    ],
    reponseModele: `**Insolvable** : les actifs valent moins que les dettes — le trou est réel, quelqu'un devra le payer. **Illiquide** : les actifs couvrent les dettes, mais ils ne sont pas transformables en cash *aujourd'hui*, alors que les créanciers réclament *aujourd'hui*. La distinction est limpide sur le papier — et elle est reine parce que toute la difficulté des crises tient dans son effondrement pratique : une institution **solvable mais illiquide meurt aussi vite qu'une insolvable** si personne ne lui prête. Forcée de vendre en urgence, sous décote, elle *devient* insolvable en essayant de prouver qu'elle ne l'était pas.

La racine : tout financement court — dépôt, repo, papier commercial — est un **plébiscite quotidien**, fondé sur une croyance circulaire : je vous prête parce que je crois que d'autres vous prêteront demain. Dès que ce « je crois » vacille, chacun a individuellement raison de couper le premier — et la prophétie s'auto-réalise.

C'est pour casser ce cercle que **Bagehot** écrit en 1873 la doctrine du prêteur en dernier ressort : prêter **largement** (éteindre la panique en prouvant que le cash existe), à **taux de pénalité** (que seuls les vrais illiquides viennent), contre du **bon collatéral** (filtrer les solvables — un insolvable n'en a pas à offrir). Chaque intervention de 1907 à 2023 se juge à cette aune.

L'exemple moderne le plus pur : les **gilts de 2022**. La hausse des taux *améliorait* la solvabilité économique des fonds de pension — elle dégonflait la valeur actualisée de leurs engagements. Des institutions *enrichies* par le choc ont pourtant failli mourir de ne pas pouvoir poster la marge du mardi : solvables, illiquides, presque mortes. Et l'aveu qui fait la maturité : en temps réel, la question « liquidité ou solvabilité ? » est toujours posée, rarement tranchable — c'est toute la difficulté du pompier.`,
    reponseModeleEn: `**Insolvent**: assets worth less than debts — the hole is real, someone will have to pay it. **Illiquid**: assets cover the debts, but they cannot be turned into cash *today*, while creditors demand payment *today*. The distinction is crystal clear on paper — and it reigns supreme because the whole difficulty of crises lies in its practical collapse: a **solvent but illiquid institution dies as fast as an insolvent one** if nobody will lend to it. Forced to sell in a hurry, at a discount, it *becomes* insolvent while trying to prove it was not.

The root: all short funding — deposits, repo, commercial paper — is a **daily plebiscite**, resting on a circular belief: I lend to you because I believe others will lend to you tomorrow. Once that "I believe" wavers, each lender is individually right to cut first — and the prophecy self-fulfils.

It is to break that circle that **Bagehot** wrote the lender-of-last-resort doctrine in 1873: lend **freely** (extinguish the panic by proving the cash exists), at a **penalty rate** (so only the truly illiquid come), against **good collateral** (filter the solvent — the insolvent have none to offer). Every intervention from 1907 to 2023 is judged by that yardstick.

The purest modern example: the **gilts of 2022**. Rising yields *improved* pension funds' economic solvency — deflating the present value of their liabilities. Institutions *enriched* by the shock nearly died of being unable to post Tuesday's margin: solvent, illiquid, almost dead. And the admission that shows maturity: in real time, the question "liquidity or solvency?" is always asked, rarely answerable — that is the firefighter's whole difficulty.`,
  },
  {
    id: 'm11-j-09',
    moduleId: M11,
    theme: 'la dette souveraine et la doom loop',
    themeEn: 'sovereign debt and the doom loop',
    difficulte: 2,
    question: 'Qu\'est-ce que la doom loop ?',
    questionEn: 'What is the doom loop?',
    plan: [
      'La définition à dessiner : l\'étreinte mortelle entre un État et ses banques, nouée par deux liens — les banques détiennent la dette de leur propre État (biais domestique), et l\'État est le garant en dernier ressort de ses banques',
      'Les deux portes d\'entrée, avec leurs cas : l\'Irlande entre par la jambe bancaire (~64 Md€ de sauvetage, ~40 % du PIB, ruinent un État exemplaire) ; la Grèce par la jambe souveraine (le défaut de l\'État ruine des banques gavées de sa dette)',
      'La démonstration involontaire : le LTRO — la liquidité BCE sert à racheter du souverain national, soulage les taux et resserre la boucle',
      'La réponse structurelle : l\'union bancaire (2014) — dénationaliser la supervision pour couper la boucle ; et l\'OMT pour casser la jambe des taux',
    ],
    planEn: [
      'The definition to draw: the deadly embrace between a state and its banks, tied by two links — banks hold their own state\'s debt (home bias), and the state is the last-resort guarantor of its banks',
      'The two entry doors, with their cases: Ireland enters through the banking leg (~64bn€ of rescues, ~40% of GDP, ruin an exemplary state); Greece through the sovereign leg (the state\'s default ruins banks stuffed with its debt)',
      'The involuntary demonstration: the LTRO — ECB liquidity is used to buy domestic sovereign debt, easing yields while tightening the loop',
      'The structural answer: banking union (2014) — denationalising supervision to cut the loop; and the OMT to break the yield leg',
    ],
    pointsAttendus: [
      'Les deux liens, dans les deux sens : dette souveraine décotée ⇒ fonds propres bancaires troués (biais domestique) ; banques vacillantes ⇒ dette publique gonflée (l\'État garant) — chaque jambe entraîne l\'autre',
      'L\'Irlande, porte bancaire : le sauvetage de ses banques (~64 Md€, environ 40 % du PIB) ruine un État jusque-là exemplaire — plan de 85 Md€ en novembre 2010',
      'La Grèce, porte souveraine : le PSI de 2012 ruine des banques gavées de dette nationale — deux portes, une seule pièce',
      'L\'arithmétique qui alimente la boucle : charge d\'intérêts = dette/PIB × taux — à 180 % de dette, chaque point de taux coûte 1,8 point de PIB : taux ↑ ⇒ solvabilité ↓ ⇒ taux ↑',
      'Le piège LTRO : ~1 000 Md€ de liquidité à 3 ans (déc. 2011-févr. 2012), carry irrésistible (emprunter à ~1 %, acheter du souverain à 5-7 %) — les taux se détendent, mais le biais domestique augmente : l\'analgésique a resserré la boucle',
      'Les réponses : l\'OMT (2012) écrase la jambe des taux par la crédibilité ; l\'union bancaire (2014) — supervision unique confiée à la BCE — commence à couper le lien banques-souverain',
    ],
    pointsAttendusEn: [
      'The two links, in both directions: marked-down sovereign debt ⇒ holed bank equity (home bias); wobbling banks ⇒ swollen public debt (the state as guarantor) — each leg drags the other',
      'Ireland, the banking door: rescuing its banks (~64bn€, about 40% of GDP) ruins a hitherto exemplary state — 85bn€ programme in November 2010',
      'Greece, the sovereign door: the 2012 PSI ruins banks stuffed with national debt — two doors, one room',
      'The arithmetic feeding the loop: interest burden = debt/GDP × rate — at 180% debt, each point of yield costs 1.8 points of GDP: rate ↑ ⇒ solvency ↓ ⇒ rate ↑',
      'The LTRO trap: ~1,000bn€ of 3-year liquidity (Dec. 2011-Feb. 2012), an irresistible carry (borrow at ~1%, buy sovereigns at 5-7%) — yields ease, but home bias increases: the painkiller tightened the loop',
      'The answers: the OMT (2012) crushes the yield leg through credibility; banking union (2014) — single supervision entrusted to the ECB — begins to cut the bank-sovereign link',
    ],
    bonus: [
      'Le déclencheur d\'octobre 2009 comme leçon générale : la révision du déficit grec (~6 % → 12,7 %, final 15,4 %) a détruit la valorisabilité de toute la signature — les statistiques sont un actif de crédibilité, et un chiffre faux coûte plus cher que des années de déficits',
      'Le prix humain qui donne l\'échelle : PIB grec −25 % entre 2008 et 2013, chômage ~27 % — une Grande Dépression au sens littéral ; et le mea culpa du FMI (2013) sur les multiplicateurs budgétaires : l\'austérité en récession peut dégrader le ratio qu\'elle prétend redresser',
    ],
    bonusEn: [
      'The October 2009 trigger as a general lesson: the revision of the Greek deficit (~6% → 12.7%, final 15.4%) destroyed the valuability of the whole signature — statistics are a credibility asset, and one false number costs more than years of deficits',
      'The human toll that gives the scale: Greek GDP −25% between 2008 and 2013, unemployment ~27% — a Great Depression in the literal sense; and the IMF\'s 2013 mea culpa on fiscal multipliers: austerity in a recession can worsen the very ratio it claims to fix',
    ],
    reponseModele: `La **doom loop** est l'étreinte mortelle entre un État et ses banques, nouée par deux liens qui se dessinent au tableau avec deux flèches. **Première flèche, État → banques** : les banques nationales détiennent massivement la dette de *leur propre* État — le biais domestique ; si la dette souveraine décote, leurs fonds propres fondent. **Seconde flèche, banques → État** : l'État est le garant en dernier ressort de *ses* banques ; si elles vacillent, c'est sa dette qui gonfle. Chaque jambe entraîne l'autre, dans les deux sens.

La crise de l'euro a fourni les deux démonstrations. L'**Irlande** entre par la jambe bancaire : le sauvetage de ses banques — environ 64 Md€, 40 % du PIB — ruine un État jusque-là exemplaire, contraint au plan de 85 Md€ en novembre 2010. La **Grèce** entre par la jambe souveraine : le défaut de 2012 ruine des banques gavées de dette nationale. Deux portes d'entrée, une seule pièce — et l'on n'en sort pas en sauvant un seul des deux.

L'arithmétique alimente la boucle : la charge d'intérêts vaut dette/PIB × taux — à 180 % de dette, chaque point de taux coûte 1,8 point de PIB, donc taux ↑ ⇒ solvabilité ↓ ⇒ taux ↑. Et le **LTRO** en a fait la démonstration involontaire : ~1 000 Md€ prêtés à 3 ans vers 1 %, que les banques du Sud investissent en souverain national à 5-7 % — les taux se détendent, mais le biais domestique *augmente* : l'analgésique a resserré la boucle même qu'il soulageait.

Les vraies réponses attaquent chacune une jambe : l'**OMT** (2012) écrase la jambe des taux par un backstop crédible jamais utilisé ; l'**union bancaire** (2014) dénationalise la supervision pour couper le lien banques-souverain. La chute : la doom loop est la preuve qu'en union monétaire, on ne peut pas sauver les banques sans l'État, ni l'État sans les banques — il faut changer l'architecture.`,
    reponseModeleEn: `The **doom loop** is the deadly embrace between a state and its banks, tied by two links you draw on the board with two arrows. **First arrow, state → banks**: national banks massively hold *their own* state's debt — home bias; if sovereign debt marks down, their equity melts. **Second arrow, banks → state**: the state is the last-resort guarantor of *its* banks; if they wobble, its debt swells. Each leg drags the other, in both directions.

The euro crisis provided both demonstrations. **Ireland** enters through the banking leg: rescuing its banks — about 64bn€, 40% of GDP — ruins a hitherto exemplary state, forced into an 85bn€ programme in November 2010. **Greece** enters through the sovereign leg: the 2012 default ruins banks stuffed with national debt. Two entry doors, one single room — and you do not get out by saving only one of the two.

Arithmetic feeds the loop: the interest burden is debt/GDP × rate — at 180% debt, each point of yield costs 1.8 points of GDP, so rate ↑ ⇒ solvency ↓ ⇒ rate ↑. And the **LTRO** provided the involuntary demonstration: ~1,000bn€ lent for 3 years at ~1%, which southern banks invested in national sovereigns at 5-7% — yields eased, but home bias *increased*: the painkiller tightened the very loop it was soothing.

The real answers each attack one leg: the **OMT** (2012) crushes the yield leg with a credible backstop never used; **banking union** (2014) denationalises supervision to cut the bank-sovereign link. The closing line: the doom loop proves that in a monetary union you cannot save the banks without the state, nor the state without the banks — you have to change the architecture.`,
  },
  {
    id: 'm11-j-10',
    moduleId: M11,
    theme: 'les crises éclair',
    themeEn: 'the flash crises',
    difficulte: 3,
    question: 'SVB : comment une banque meurt-elle de son portefeuille « sans risque » ?',
    questionEn: 'SVB: how does a bank die of its "riskless" portfolio?',
    plan: [
      'Le bilan fragile : dépôts triplés (60 → 190 Md$) d\'une clientèle tech concentrée, à plus de 90 % non assurés, placés en Treasuries et MBS longs (duration ≈ 5,7) achetés au sommet',
      'L\'arithmétique de la mort silencieuse : ΔP/P ≈ −D × Δy = −5,7 × 2 ≈ −11,4 %, appliqué à ~140 Md$ : ~−16 Md$ de moins-values latentes — l\'ordre de grandeur des fonds propres, masqué par la comptabilité held-to-maturity',
      'Les 48 heures : le 8 mars 2023, vente de 21 Md$ (perte actée 1,8 Md$) qui rend la mort publique ; le 9 mars, 42 Md$ de retraits en un jour — le run à la vitesse du smartphone ; le 10, la FDIC ferme',
      'Le backstop et les leçons : garantie de tous les dépôts et BTFP (prêter au pair contre du collatéral sous le pair) ; la duration tue aussi les banques, et les dépôts non assurés courent les premiers',
    ],
    planEn: [
      'The fragile balance sheet: deposits tripled (60 → 190bn$) from a concentrated tech clientele, over 90% uninsured, invested in long Treasuries and MBS (duration ≈ 5.7) bought at the top of the bond market',
      'The arithmetic of silent death: ΔP/P ≈ −D × Δy = −5.7 × 2 ≈ −11.4%, applied to ~140bn$: ~−16bn$ of unrealised losses — the order of magnitude of equity, masked by held-to-maturity accounting',
      'The 48 hours: on 8 March 2023, a 21bn$ sale (1.8bn$ realised loss) makes the death public; on 9 March, 42bn$ of withdrawals in one day — the smartphone-speed run; on the 10th, the FDIC closes the bank',
      'The backstop and the lessons: guarantee of all deposits and the BTFP (lending at par against collateral below par); duration kills banks too, and uninsured deposits run first',
    ],
    pointsAttendus: [
      'Le montage : dépôts de 60 à ~190 Md$ entre 2019 et 2021, clientèle tech concentrée, plus de 90 % au-dessus du plafond de 250 k$ — donc non assurés : le carburant du run est dans le passif',
      'L\'actif : Treasuries et MBS d\'agences longs, duration proche de 5,7, achetés au sommet du marché obligataire — AUCUN risque de crédit, aucun défaut dans le portefeuille',
      'Le choc : +425 pb de Fed en 2022 ; ΔP/P ≈ −5,7 × 2 points ≈ −11,4 % sur ~140 Md$ de titres ≈ −16 Md$ de moins-values latentes — à peu près la totalité des fonds propres : la banque était économiquement morte fin 2022',
      'Le masque comptable : held-to-maturity — les titres restent au coût d\'achat tant qu\'on ne vend pas ; la perte n\'existe pas comptablement, mais un run force à vendre, donc à la matérialiser',
      'Les 48 heures : 8 mars, vente de 21 Md$ et perte actée de 1,8 Md$ — le signal ; 9 mars, 42 Md$ de retraits en une journée (~un quart des dépôts), coordonnés par Twitter et les group chats ; 10 mars, FDIC — deuxième plus grosse faillite bancaire américaine',
      'La réponse du 12 mars : garantie de TOUS les dépôts (systemic risk exception) et BTFP — prêter au pair contre du collatéral qui cote sous le pair, un Bagehot tordu taillé pour une crise de duration',
    ],
    pointsAttendusEn: [
      'The setup: deposits from 60 to ~190bn$ between 2019 and 2021, a concentrated tech clientele, over 90% above the 250k$ cap — hence uninsured: the run\'s fuel is on the liability side',
      'The assets: long Treasuries and agency MBS, duration close to 5.7, bought at the top of the bond market — NO credit risk, not one default in the portfolio',
      'The shock: +425 bp of Fed hikes in 2022; ΔP/P ≈ −5.7 × 2 points ≈ −11.4% on ~140bn$ of securities ≈ −16bn$ of unrealised losses — roughly the entirety of equity: the bank was economically dead by late 2022',
      'The accounting mask: held-to-maturity — securities stay at cost as long as you do not sell; the loss does not exist in the accounts, but a run forces you to sell, hence to crystallise it',
      'The 48 hours: 8 March, 21bn$ sold and a 1.8bn$ realised loss — the signal; 9 March, 42bn$ of withdrawals in one day (~a quarter of deposits), coordinated on Twitter and VC group chats; 10 March, FDIC — the second-largest US bank failure',
      'The 12 March response: guarantee of ALL deposits (systemic risk exception) and the BTFP — lending at par against collateral quoted below par, a twisted Bagehot tailored to a duration crisis',
    ],
    bonus: [
      'Le pont contagion : l\'information comme canal — la chute de SVB révèle que tous les bilans du même modèle sont suspects, sans aucun lien réel : Signature ferme le 12 mars, First Republic agonise jusqu\'au 1ᵉʳ mai ; et de l\'autre côté de l\'Atlantique, la panique trouve la banque la plus affaiblie — Credit Suisse, 167 ans d\'histoire, absorbée par UBS en un week-end, AT1 effacés',
      'La formule qui résume : le risque de taux n\'est PAS un risque de crédit — et il tue aussi ; la garantie des dépôts n\'ancre que ce qu\'elle couvre, et la ruée de 2023 va à la vitesse d\'une application mobile : 1907 prenait des semaines de files, SVB a pris 48 heures sans une file',
    ],
    bonusEn: [
      'The contagion bridge: information as the channel — SVB\'s fall reveals that every balance sheet with the same model is suspect, with no real link needed: Signature closes on 12 March, First Republic agonises until 1 May; and across the Atlantic, the panic finds the weakest bank — Credit Suisse, 167 years old, absorbed by UBS in a weekend, AT1s wiped out',
      'The summary formula: interest rate risk is NOT credit risk — and it kills too; deposit insurance only anchors what it covers, and the 2023 run moves at the speed of a mobile app: 1907 took weeks of queues, SVB took 48 hours without a single queue',
    ],
    reponseModele: `Silicon Valley Bank est morte d'un portefeuille de Treasuries et de MBS d'agences — zéro défaut, zéro risque de crédit. L'arme du crime est la **duration**, et le récit tient en trois actes.

**Le bilan fragile.** Entre 2019 et 2021, les dépôts triplent — d'environ 60 à 190 Md$ — venus d'une clientèle tech concentrée, dont **plus de 90 % au-dessus du plafond de garantie de 250 k$**, donc non assurés. Ces dépôts sont placés en titres *longs* (duration ≈ 5,7), achetés au sommet du marché obligataire. Le carburant du run est au passif ; l'explosif est à l'actif.

**La mort silencieuse.** 2022 : la Fed monte de +425 pb. L'arithmétique s'écrit en une ligne : ΔP/P ≈ −D × Δy ≈ −5,7 × 2 ≈ **−11,4 %**, appliqué à ~140 Md$ de titres : de l'ordre de **−16 Md$ de moins-values latentes** — à peu près la totalité des fonds propres. La banque était économiquement morte fin 2022, et personne ne le voyait : la comptabilité **held-to-maturity** garde les titres au coût d'achat — la perte n'existe pas tant qu'on ne vend pas. Il suffit d'être *forcé* de vendre.

**Les 48 heures.** Le 8 mars 2023, contrainte de lever du cash, SVB vend 21 Md$ de titres — perte actée : 1,8 Md$ — et la mort devient publique. Le 9 mars, coordonnés par Twitter et les group chats du capital-risque, les déposants retirent **42 Md$ en une journée** — un quart des dépôts, sans une file d'attente. Le 10 au matin, la FDIC ferme la banque. Le dimanche 12 : garantie de *tous* les dépôts et **BTFP** — la Fed prête *au pair* contre du collatéral qui cote sous le pair, un Bagehot tordu taillé pour une crise de duration.

Les leçons : la **duration tue aussi les banques** — le risque de taux n'est pas un risque de crédit ; les dépôts **non assurés courent les premiers** ; et un run moderne va à la vitesse du smartphone — 48 heures là où 1907 prenait des semaines.`,
    reponseModeleEn: `Silicon Valley Bank died of a portfolio of Treasuries and agency MBS — zero defaults, zero credit risk. The murder weapon is **duration**, and the story holds in three acts.

**The fragile balance sheet.** Between 2019 and 2021, deposits triple — from about 60 to 190bn$ — from a concentrated tech clientele, with **over 90% above the 250k$ insurance cap**, hence uninsured. Those deposits are invested in *long* securities (duration ≈ 5.7), bought at the top of the bond market. The run's fuel is on the liability side; the explosive is on the asset side.

**The silent death.** 2022: the Fed hikes +425 bp. The arithmetic fits on one line: ΔP/P ≈ −D × Δy ≈ −5.7 × 2 ≈ **−11.4%**, applied to ~140bn$ of securities: on the order of **−16bn$ of unrealised losses** — roughly the entirety of equity. The bank was economically dead by late 2022, and nobody saw it: **held-to-maturity** accounting keeps securities at cost — the loss does not exist until you sell. You only need to be *forced* to sell.

**The 48 hours.** On 8 March 2023, needing cash, SVB sells 21bn$ of securities — realised loss: 1.8bn$ — and the death becomes public. On 9 March, coordinated on Twitter and VC group chats, depositors withdraw **42bn$ in one day** — a quarter of deposits, without a single queue. On the morning of the 10th, the FDIC closes the bank. On Sunday the 12th: a guarantee of *all* deposits and the **BTFP** — the Fed lends *at par* against collateral quoted below par, a twisted Bagehot tailored to a duration crisis.

The lessons: **duration kills banks too** — rate risk is not credit risk; **uninsured deposits run first**; and a modern run moves at smartphone speed — 48 hours where 1907 took weeks.`,
  },
  {
    id: 'm11-j-11',
    moduleId: M11,
    theme: 'la dette souveraine et la doom loop',
    themeEn: 'sovereign debt and the doom loop',
    difficulte: 2,
    question: 'Le « whatever it takes » : pourquoi trois mots ont-ils suffi ?',
    questionEn: '"Whatever it takes": why were three words enough?',
    plan: [
      'Le contexte : juillet 2012, rendements espagnols au-delà de 7,5 % — les spreads ne pricent plus seulement le défaut mais la redénomination, le retour à la peseta et à la lire',
      'Le 26 juillet à Londres, Draghi ; en septembre la promesse devient un programme : l\'OMT — achats potentiellement illimités de dette d\'un État sous conditionnalité',
      'Le mécanisme : une panique auto-réalisatrice a deux équilibres — un backstop illimité et crédible sélectionne le bon, car personne ne vend contre un acheteur sans limite',
      'La preuve et le contraste : l\'OMT n\'a jamais été utilisé, pas un euro dépensé, spreads en chute de centaines de pb — quand le SMP, limité et ambigu, avait été testé et débordé',
    ],
    planEn: [
      'The context: July 2012, Spanish yields beyond 7.5% — spreads no longer price only default but redenomination, the return to the peseta and the lira',
      'On 26 July in London, Draghi; in September the promise becomes a programme: the OMT — potentially unlimited purchases of a state\'s debt under conditionality',
      'The mechanism: a self-fulfilling panic has two equilibria — an unlimited, credible backstop selects the good one, because nobody sells against a buyer without limits',
      'The proof and the contrast: the OMT was never used, not one euro spent, spreads down by hundreds of bp — where the SMP, limited and ambiguous, had been tested and overrun',
    ],
    pointsAttendus: [
      'Le contexte précis : été 2012, l\'Espagne au-delà de 7,5 %, l\'Italie attaquée — trop grosses pour le FESF ; le risque pricé était devenu existentiel : la redénomination, c\'est-à-dire l\'éclatement de l\'euro',
      'La logique De Grauwe sous-jacente : sans prêteur en dernier ressort dans sa monnaie, un souverain solvable peut mourir d\'un refus de refinancement — le run était auto-réalisateur, donc une promesse crédible pouvait l\'arrêter',
      'Le mot décisif : « illimité » — un backstop borné invite le marché à tester la borne (le SMP l\'a prouvé) ; un backstop sans limite retire tout intérêt à vendre',
      'La condition de la magie : la crédibilité — les trois mots n\'ont marché que parce que l\'institution derrière pouvait effectivement créer des euros sans limite, et que « believe me » a été cru',
      'Le résultat : l\'OMT jamais activé, zéro euro dépensé, spreads italiens et espagnols en baisse de plusieurs centaines de points de base — contre une panique auto-réalisatrice, le meilleur argent est celui qu\'on ne dépense pas',
      'Le pont m10 : c\'est le canal des anticipations appliqué à une crise souveraine — même mécanique que la forward guidance : la parole d\'une banque centrale crédible est un instrument à part entière',
    ],
    pointsAttendusEn: [
      'The precise context: summer 2012, Spain beyond 7.5%, Italy under attack — too big for the EFSF; the priced risk had become existential: redenomination, i.e. the break-up of the euro',
      'The underlying De Grauwe logic: without a lender of last resort in its own currency, a solvent sovereign can die of a refinancing refusal — the run was self-fulfilling, so a credible promise could stop it',
      'The decisive word: "unlimited" — a capped backstop invites the market to test the cap (the SMP proved it); a limitless backstop removes any point in selling',
      'The condition for the magic: credibility — the three words only worked because the institution behind them could actually create euros without limit, and because "believe me" was believed',
      'The result: the OMT never activated, zero euros spent, Italian and Spanish spreads down by several hundred basis points — against a self-fulfilling panic, the best money is the money you never spend',
      'The m10 bridge: this is the expectations channel applied to a sovereign crisis — the same mechanics as forward guidance: a credible central bank\'s word is a policy instrument in its own right',
    ],
    bonus: [
      'La comparaison institutionnelle : le SMP — limité, stérilisé, si controversé qu\'il coûte deux démissions allemandes (Weber, Stark) — a été débordé ; l\'OMT, assorti d\'une conditionnalité MES qui répondait à l\'objection d\'aléa moral, a tenu sans servir : la conception du backstop importe autant que sa taille',
      'Le corollaire de desk : jugez un backstop à sa taille annoncée et à sa crédibilité, pas à son utilisation — et méfiez-vous du symétrique : un backstop annoncé mais non crédible (borné, conditionnel flou) est une invitation à vendre',
    ],
    bonusEn: [
      'The institutional comparison: the SMP — limited, sterilised, so controversial it cost two German resignations (Weber, Stark) — was overrun; the OMT, paired with ESM conditionality that answered the moral hazard objection, held without ever serving: a backstop\'s design matters as much as its size',
      'The desk corollary: judge a backstop by its announced size and its credibility, not by its use — and beware the mirror image: an announced but non-credible backstop (capped, vaguely conditional) is an invitation to sell',
    ],
    reponseModele: `Été 2012 : les rendements espagnols dépassent 7,5 %, l'Italie est attaquée, et toutes deux sont trop grosses pour le FESF. Surtout, les spreads ne pricent plus seulement un défaut — ils pricent la **redénomination** : le retour à la peseta et à la lire, l'éclatement de l'euro. Le 26 juillet, à Londres, Mario Draghi prononce le « *whatever it takes* » ; en septembre, la promesse devient l'**OMT** : des achats potentiellement **illimités** de dette souveraine, sous conditionnalité. L'OMT n'a jamais été utilisé — pas un euro dépensé — et les spreads ont fondu de plusieurs centaines de points de base.

Pourquoi trois mots suffisent-ils ? Parce que la crise était, pour l'Italie et l'Espagne, une **panique auto-réalisatrice** — la logique de De Grauwe : un État qui emprunte dans une monnaie qu'il n'émet pas peut mourir d'un simple refus de refinancement, même solvable. Or une panique auto-réalisatrice a **deux équilibres** : chacun vend parce que les autres vendent — ou personne ne vend parce que personne n'a de raison de vendre. Un acheteur *sans limite* rend la vente perdante d'avance : le backstop ne combat pas la panique, il la rend irrationnelle — exactement ce que la FDIC avait fait aux ruées bancaires en 1934.

Deux conditions, et elles font toute la réponse. **« Illimité »** : le SMP, limité et ambigu, avait été testé et débordé — une borne invite le marché à la tester. **Crédible** : les trois mots n'ont marché que parce que la BCE peut effectivement créer des euros sans limite, et parce que le « *believe me* » a été cru — la crédibilité accumulée d'une institution est un actif qui remplace les munitions.

Le pont avec la politique monétaire : c'est le canal des anticipations appliqué à une crise souveraine. La chute : contre une panique auto-réalisatrice, **le meilleur argent est celui qu'on ne dépense pas** — jugez un backstop à sa crédibilité, jamais à son utilisation.`,
    reponseModeleEn: `Summer 2012: Spanish yields exceed 7.5%, Italy is under attack, and both are too big for the EFSF. Above all, spreads no longer price just a default — they price **redenomination**: the return to the peseta and the lira, the break-up of the euro. On 26 July, in London, Mario Draghi says "*whatever it takes*"; in September the promise becomes the **OMT**: potentially **unlimited** purchases of sovereign debt, under conditionality. The OMT was never used — not one euro spent — and spreads melted by several hundred basis points.

Why were three words enough? Because the crisis was, for Italy and Spain, a **self-fulfilling panic** — De Grauwe's logic: a state borrowing in a currency it does not issue can die of a mere refinancing refusal, even while solvent. And a self-fulfilling panic has **two equilibria**: everyone sells because everyone else sells — or nobody sells because nobody has a reason to. A buyer *without limits* makes selling a losing trade from the start: the backstop does not fight the panic, it makes it irrational — exactly what the FDIC had done to bank runs in 1934.

Two conditions, and they are the whole answer. **"Unlimited"**: the SMP, capped and ambiguous, had been tested and overrun — a cap invites the market to test it. **Credible**: the three words only worked because the ECB can actually create euros without limit, and because the "*believe me*" was believed — an institution's accumulated credibility is an asset that replaces ammunition.

The bridge to monetary policy: this is the expectations channel applied to a sovereign crisis. The closing line: against a self-fulfilling panic, **the best money is the money you never spend** — judge a backstop by its credibility, never by its use.`,
  },
  {
    id: 'm11-j-12',
    moduleId: M11,
    theme: 'les leçons transversales',
    themeEn: 'cross-cutting lessons',
    difficulte: 4,
    question: 'Une bulle est-elle identifiable avant qu\'elle n\'éclate ?',
    questionEn: 'Can a bubble be identified before it bursts?',
    plan: [
      'Structurer la réponse en tension : oui, le régime se diagnostique — non, la date ne se prédit pas, et cette asymétrie change tout',
      'Les signaux qui se voient : la grammaire de Minsky-Kindleberger — crédit qui s\'engouffre, valorisations impossibles COLLECTIVEMENT (P/E > 100, 117 IPO qui doublent, call money à 15 %), et le récit « cette fois c\'est différent »',
      'Pourquoi voir ne suffit pas : Greenspan lucide en décembre 1996, le Nasdaq triple encore ; Robertson ferme Tiger au mois exact du pic ; shorter une bulle expose à des pertes illimitées pendant toute l\'euphorie',
      'Déplacer la question, en professionnel : la vraie question de desk n\'est pas « est-ce une bulle ? » mais « qui la porte, à quel levier, financé comment ? » — dot-com sans levier bancaire : coûteuse ; subprimes à crédit dans les banques : systémique',
    ],
    planEn: [
      'Structure the answer as a tension: yes, the regime can be diagnosed — no, the date cannot be predicted, and that asymmetry changes everything',
      'The visible signals: the Minsky-Kindleberger grammar — credit rushing in, valuations impossible COLLECTIVELY (P/E > 100, 117 IPOs doubling, call money at 15%), and the "this time is different" narrative',
      'Why seeing is not enough: Greenspan lucid in December 1996, the Nasdaq still triples; Robertson closes Tiger in the exact month of the peak; shorting a bubble means unlimited losses throughout the euphoria',
      'Shift the question, like a professional: the real desk question is not "is this a bubble?" but "who holds it, at what leverage, funded how?" — dot-com without bank leverage: costly; subprime on credit inside the banks: systemic',
    ],
    pointsAttendus: [
      'Le diagnostic de régime est possible : le cycle de Minsky-Kindleberger (déplacement réel → boom à crédit → euphorie → prise de profit → panique) se reconnaît en temps réel à ses marqueurs — le crédit qui finance l\'achat d\'actifs, les métriques de substitution (eyeballs contre cash-flows), le « this time is different »',
      'Les marqueurs quantitatifs qui datent l\'euphorie : P/E du Nasdaq > 100 au pic contre 15-20 historique, 486 IPO en 1999 dont ~117 doublent le premier jour, call money à 15 % en 1929 — quand financer la spéculation rapporte plus que l\'économie réelle',
      'L\'argument d\'impossibilité collective : chaque histoire dot-com était plausible SEULE ; toutes ensemble, elles exigeaient que des concurrents prennent chacun le marché des autres — l\'arithmétique était impossible collectivement, pas individuellement : c\'est ce qui rend la bulle si difficile à combattre',
      'Pourquoi la lucidité ne paie pas : « exubérance irrationnelle » le 5 décembre 1996, pic en mars 2000 — le Nasdaq fait plus que tripler après la phrase ; être lucide trop tôt ruine (Robertson ferme Tiger en mars 2000, le mois exact du pic ; Buffett moqué fin 1999)',
      'La mécanique de l\'élimination des sceptiques : shorter expose à des pertes illimitées avec appels de marge à chaque plus haut — le marché élimine ceux qui ont raison avant de leur donner raison (Keynes : irrationnel plus longtemps que vous ne resterez solvable)',
      'Le déplacement professionnel de la question : puisque la date est imprévisible, la question opérante est « qui porte le risque et avec quel levier ? » — 5 000 Md$ de dot-com au comptant : pas de crise systémique ; ~500 Md$ de subprimes au levier 30 financés au jour le jour : quasi-effondrement',
    ],
    pointsAttendusEn: [
      'Regime diagnosis is possible: the Minsky-Kindleberger cycle (real displacement → credit-fuelled boom → euphoria → profit-taking → panic) can be recognised in real time by its markers — credit financing asset purchases, substitute metrics (eyeballs instead of cash flows), "this time is different"',
      'The quantitative markers that date the euphoria: Nasdaq P/E > 100 at the peak versus 15-20 historically, 486 IPOs in 1999 of which ~117 double on day one, call money at 15% in 1929 — when funding speculation pays more than the real economy',
      'The collective impossibility argument: each dot-com story was plausible ALONE; all together they required competitors to each take the others\' market — the arithmetic was impossible collectively, not individually: that is what makes a bubble so hard to fight',
      'Why lucidity does not pay: "irrational exuberance" on 5 December 1996, peak in March 2000 — the Nasdaq more than triples after the phrase; being lucid too early ruins you (Robertson closes Tiger in March 2000, the exact month of the peak; Buffett mocked in late 1999)',
      'The mechanics of sceptic elimination: shorting means unlimited losses with margin calls at every new high — the market eliminates those who are right before proving them right (Keynes: irrational longer than you can stay solvent)',
      'The professional reframing: since the date is unpredictable, the operative question is "who holds the risk and at what leverage?" — 5,000bn$ of dot-com held unlevered: no systemic crisis; ~500bn$ of subprime at 30× leverage funded overnight: near-collapse',
    ],
    bonus: [
      'Templeton : « this time is different » — les cinq mots les plus chers de l\'histoire ; et la subtilité qui fait la grande copie : l\'argument du récit est souvent VRAI (Internet a bien tout changé, la titrisation dispersait bien le risque) — le piège n\'est pas que le récit soit faux, c\'est qu\'il ne change rien à l\'arithmétique des flux actualisés',
      'La leçon de Minsky en une phrase : la stabilité engendre l\'instabilité — chaque année de calme « prouve » qu\'on pouvait prendre plus de risque, donc on le prend ; les années sans crise ne sont pas la preuve que le système est sûr, elles sont le mécanisme par lequel il cesse de l\'être',
    ],
    bonusEn: [
      'Templeton: "this time is different" — the five most expensive words in history; and the subtlety that makes a great answer: the narrative\'s argument is often TRUE (the internet did change everything, securitisation did spread risk) — the trap is not that the story is false, it is that it changes nothing in discounted cash-flow arithmetic',
      'Minsky\'s lesson in one sentence: stability breeds instability — each calm year "proves" more risk could be taken, so it is taken; years without crisis are not evidence the system is safe, they are the mechanism by which it stops being safe',
    ],
    reponseModele: `Réponse en tension, car les deux moitiés sont vraies : **le régime se diagnostique, la date ne se prédit pas** — et cette asymétrie change tout.

**Oui, on voit le régime.** Le cycle de Minsky-Kindleberger se reconnaît en temps réel : un déplacement réel (le rail, Internet, la titrisation), puis le crédit qui s'engouffre, puis l'euphorie — les prix décollent de toute valorisation et l'on invente des métriques de substitution : les *eyeballs* à défaut de cash-flows. Les marqueurs se mesurent : P/E du Nasdaq **supérieur à 100** au pic contre 15-20 historique ; 486 IPO en 1999 dont **117 doublent le premier jour** ; call money à **15 %** en 1929, quand financer la spéculation rapportait plus que l'économie réelle. Et l'argument décisif : chaque histoire dot-com était plausible *seule* — toutes ensemble, elles exigeaient que des concurrents prennent chacun le marché des autres. L'arithmétique était impossible **collectivement**, pas individuellement.

**Non, voir ne suffit pas.** Greenspan diagnostique l'« exubérance irrationnelle » le 5 décembre **1996** ; le Nasdaq fait plus que tripler ensuite, le pic n'arrivant qu'en mars 2000. Julian Robertson, qui refuse la tech, ferme Tiger au **mois exact du pic**. Shorter une bulle expose à des pertes illimitées, avec appels de marge à chaque plus haut : le marché élimine ceux qui ont raison *avant* de leur donner raison — irrationnel plus longtemps que vous ne resterez solvable.

**La sortie professionnelle : déplacer la question.** Puisque la date est imprévisible, la question de desk n'est pas « est-ce une bulle ? » mais « **qui la porte, à quel levier, financé comment ?** » — 5 000 Md$ de dot-com au comptant : des épargnants appauvris, pas de crise ; ~500 Md$ de subprimes au levier 30 financés au jour le jour : quasi-effondrement du système. On ne prédit pas l'éclatement — on choisit de ne pas être celui qui meurt quand il a lieu.`,
    reponseModeleEn: `An answer held in tension, because both halves are true: **the regime can be diagnosed, the date cannot be predicted** — and that asymmetry changes everything.

**Yes, the regime is visible.** The Minsky-Kindleberger cycle can be recognised in real time: a real displacement (railways, the internet, securitisation), then credit rushing in, then euphoria — prices detach from any valuation and substitute metrics get invented: *eyeballs* for lack of cash flows. The markers are measurable: Nasdaq P/E **above 100** at the peak versus 15-20 historically; 486 IPOs in 1999 of which **117 double on day one**; call money at **15%** in 1929, when funding speculation paid more than the real economy. And the decisive argument: each dot-com story was plausible *alone* — all together, they required competitors to each capture the others' market. The arithmetic was impossible **collectively**, not individually.

**No, seeing is not enough.** Greenspan diagnoses "irrational exuberance" on 5 December **1996**; the Nasdaq more than triples afterwards, the peak only arriving in March 2000. Julian Robertson, who refuses tech, closes Tiger in the **exact month of the peak**. Shorting a bubble means unlimited losses, with margin calls at every new high: the market eliminates those who are right *before* proving them right — irrational longer than you can stay solvent.

**The professional exit: reframe the question.** Since the date is unpredictable, the desk question is not "is this a bubble?" but "**who holds it, at what leverage, funded how?**" — 5,000bn$ of dot-com held unlevered: impoverished savers, no crisis; ~500bn$ of subprime at 30× leverage funded overnight: near-collapse of the system. You do not predict the burst — you choose not to be the one who dies when it happens.`,
  },
  {
    id: 'm11-j-13',
    moduleId: M11,
    theme: '2008 : des subprimes au systémique',
    themeEn: '2008: from subprime to systemic',
    difficulte: 3,
    question: 'Qu\'est-ce que le shadow banking, et pourquoi a-t-il amplifié 2008 ?',
    questionEn: 'What is shadow banking, and why did it amplify 2008?',
    plan: [
      'La définition : l\'ensemble des structures qui font le métier d\'une banque — transformer du financement court en actifs longs — sans en avoir le statut : ni dépôts assurés, ni accès au prêteur en dernier ressort, ni supervision bancaire',
      'Les véhicules de 2007 : SIV et conduits ABCP (actifs titrisés à 30 ans financés en papier à 30 jours, hors bilan), et le marché du repo où les broker-dealers se financent au jour le jour',
      'L\'amplification : la thèse de Gorton — repo et ABCP étaient devenus les « dépôts » des institutionnels, sûrs et retirables à volonté, mais SANS assurance : le système avait reconstruit la banque d\'avant 1934, sans l\'extincteur',
      'La mécanique chiffrée du run : haircut de 2 % à 25 %, financement de 98 à 75, ventes forcées, spirale — un run invisible, sans une file d\'attente',
    ],
    planEn: [
      'The definition: the set of structures doing a bank\'s job — turning short funding into long assets — without the status: no insured deposits, no access to the lender of last resort, no banking supervision',
      'The 2007 vehicles: SIVs and ABCP conduits (30-year securitised assets funded with 30-day paper, off balance sheet), and the repo market where broker-dealers fund themselves overnight',
      'The amplification: Gorton\'s thesis — repo and ABCP had become the institutional world\'s "deposits", safe and withdrawable at will, but WITHOUT insurance: the system had rebuilt pre-1934 banking, without the fire extinguisher',
      'The quantified run mechanics: haircut from 2% to 25%, funding from 98 to 75, forced sales, spiral — an invisible run, without a single queue',
    ],
    pointsAttendus: [
      'La définition fonctionnelle : faire le métier d\'une banque (transformation d\'échéances) sans le statut de banque — donc sans le filet qui va avec : ni FDIC, ni guichet de la banque centrale, ni superviseur',
      'Les véhicules concrets : SIV et conduits ABCP logeant des actifs titrisés à 30 ans hors du bilan des banques, financés en papier commercial à 30 jours à renouveler sans cesse ; le repo au jour le jour des broker-dealers',
      'Le levier caché : un haircut de 2 % autorise un levier de 100/2 = 50, invisible dans les ratios réglementaires — le levier officiel de Lehman (~31) n\'était que la partie émergée',
      'La thèse de Gorton : repo et ABCP étaient les dépôts des institutionnels — des créances courtes réputées sûres, retirables à volonté ; or ce qui a arrêté les runs classiques après 1934, ce n\'est pas la vertu des banques, c\'est la garantie fédérale — le système parallèle n\'en avait pas',
      'Le run chiffré : haircut de 2 % à 25 % ⇒ financement de 98 à 75 par 100 de titres — 23 à trouver le jour même ; sous 5 % de décote, lever 23 force à vendre 24,2 ; les ventes élargissent les haircuts des autres : spirale',
      'Pourquoi personne ne l\'a vu : la ruée de 1907 se photographiait (une file devant une agence) ; celle de 2008 s\'est produite dans des chiffres que seuls les trésoriers voyaient — un haircut, une maturité raccourcie, un papier non renouvelé',
    ],
    pointsAttendusEn: [
      'The functional definition: doing a bank\'s job (maturity transformation) without a bank\'s status — hence without the net that comes with it: no FDIC, no central bank window, no supervisor',
      'The concrete vehicles: SIVs and ABCP conduits housing 30-year securitised assets off banks\' balance sheets, funded with 30-day commercial paper to be rolled endlessly; broker-dealers\' overnight repo',
      'The hidden leverage: a 2% haircut allows leverage of 100/2 = 50, invisible in regulatory ratios — Lehman\'s official leverage (~31) was only the visible part',
      'Gorton\'s thesis: repo and ABCP were the institutional world\'s deposits — short claims deemed safe, withdrawable at will; what stopped classic runs after 1934 was not banks\' virtue but the federal guarantee — the parallel system had none',
      'The quantified run: haircut from 2% to 25% ⇒ funding from 98 to 75 per 100 of securities — 23 to find the same day; under a 5% liquidation discount, raising 23 forces the sale of 24.2; the sales widen everyone else\'s haircuts: spiral',
      'Why nobody saw it: the 1907 run could be photographed (a queue outside a branch); the 2008 one happened in numbers only treasurers saw — a haircut, a shortened maturity, unrolled paper',
    ],
    bonus: [
      'La lecture des réformes : les ratios de liquidité de Bâle III (LCR) et la supervision des non-banques se lisent entièrement comme une réponse au diagnostic de Gorton — s\'attaquer au financement court d\'actifs longs, où qu\'il loge',
      'Le pont vers aujourd\'hui : la transformation d\'échéances n\'a pas disparu, elle a re-migré — fonds monétaires, fonds obligataires ouverts, stablecoins : chaque fois qu\'une créance courte « sûre » finance un actif long, la question de 2008 se repose',
    ],
    bonusEn: [
      'Reading the reforms: Basel III\'s liquidity ratios (LCR) and non-bank supervision read entirely as an answer to Gorton\'s diagnosis — attacking the short funding of long assets, wherever it sits',
      'The bridge to today: maturity transformation has not disappeared, it has re-migrated — money market funds, open-ended bond funds, stablecoins: every time a "safe" short claim funds a long asset, the 2008 question returns',
    ],
    reponseModele: `Le **système bancaire parallèle** désigne l'ensemble des structures qui font le métier d'une banque — transformer du financement court en actifs longs — **sans** en avoir le statut : ni dépôts assurés, ni accès au prêteur en dernier ressort, ni supervision bancaire. Ses véhicules emblématiques en 2007 : les **SIV** et conduits **ABCP**, qui logent des actifs titrisés à 30 ans *hors* du bilan des banques et les financent en papier commercial à 30 jours, à renouveler sans cesse ; et le marché du **repo**, où les broker-dealers financent leurs portefeuilles au jour le jour contre collatéral. Une banque sans filet.

Pourquoi l'amplification ? D'abord par le **levier caché** : un haircut de repo de 2 % autorise un levier de 100/2 = 50, invisible dans les ratios réglementaires — le levier officiel de Lehman (~31) n'était que la partie émergée. Ensuite et surtout par la thèse de **Gorton** : le repo et l'ABCP étaient devenus les « dépôts » des institutionnels — des créances courtes, réputées sûres, retirables à volonté. Or ce qui a arrêté les ruées bancaires après 1934, ce n'est pas la vertu des banques : c'est la **garantie fédérale**. Le système parallèle avait reconstruit la banque d'avant 1934, avec la même inflammabilité et **sans l'extincteur**.

Le run, quand il vient, est chiffrable : le haircut passe de 2 % à 25 %, le financement fond de 98 à 75 par 100 de titres — 23 à trouver *le jour même* ; sous 5 % de décote, lever 23 force à vendre 24,2, ce qui déprime les prix et élargit les haircuts des autres : la spirale. Et il est **invisible** : la ruée de 1907 se photographiait — une file devant une agence ; celle de 2008 s'est jouée dans des chiffres que seuls les trésoriers voyaient. La chute : le shadow banking n'a pas créé les pertes de 2008 — il a fourni la poudre qui a transformé une perte en explosion.`,
    reponseModeleEn: `**Shadow banking** designates the set of structures doing a bank's job — turning short funding into long assets — **without** a bank's status: no insured deposits, no access to the lender of last resort, no banking supervision. Its emblematic vehicles in 2007: **SIVs** and **ABCP** conduits, housing 30-year securitised assets *off* banks' balance sheets and funding them with 30-day commercial paper, rolled endlessly; and the **repo** market, where broker-dealers fund their portfolios overnight against collateral. A bank without a net.

Why the amplification? First, **hidden leverage**: a 2% repo haircut allows leverage of 100/2 = 50, invisible in regulatory ratios — Lehman's official leverage (~31) was only the visible part. Second and above all, **Gorton**'s thesis: repo and ABCP had become the institutional world's "deposits" — short claims, deemed safe, withdrawable at will. Yet what stopped bank runs after 1934 was not banks' virtue: it was the **federal guarantee**. The parallel system had rebuilt pre-1934 banking, with the same flammability and **without the fire extinguisher**.

The run, when it comes, can be quantified: the haircut goes from 2% to 25%, funding melts from 98 to 75 per 100 of securities — 23 to find *the same day*; under a 5% discount, raising 23 forces the sale of 24.2, which depresses prices and widens everyone else's haircuts: the spiral. And it is **invisible**: the 1907 run could be photographed — a queue outside a branch; the 2008 one played out in numbers only treasurers saw. The punchline: shadow banking did not create the losses of 2008 — it supplied the powder that turned a loss into an explosion.`,
  },
  {
    id: 'm11-j-14',
    moduleId: M11,
    theme: 'la bulle dot-com',
    themeEn: 'the dot-com bubble',
    difficulte: 3,
    question: 'Dot-com contre subprimes : pourquoi 5 000 Md$ de pertes sans crise systémique d\'un côté, et l\'apocalypse de l\'autre ?',
    questionEn: 'Dot-com versus subprime: why 5,000bn$ of losses without a systemic crisis on one side, and near-apocalypse on the other?',
    plan: [
      'Poser le paradoxe chiffré : ~5 000 Md$ de capitalisation détruits en 2000-2002 — récession courte, aucune faillite bancaire ; ~500 Md$ de pertes subprime — quasi-effondrement du système mondial',
      'Éliminer les fausses explications : ni la taille (dix contre un), ni la rapidité, ni la nature immobilière — la variable décisive est le canal de financement',
      'Le théorème : les pertes dot-com étaient logées en actions, au comptant, chez des investisseurs finals ; celles de 2008 dans des bilans au levier 30+, financés au jour le jour en repo et ABCP',
      'La formule du malheur qui boucle : au levier 31, −3,2 % d\'actifs tuent — chaque euro de perte déclenche ventes forcées et retraits de financement ; et l\'ironie de la transition : la Fed à 1 % en 2003 pour amortir la dot-com a fourni le carburant des subprimes',
    ],
    planEn: [
      'State the numbered paradox: ~5,000bn$ of market cap destroyed in 2000-2002 — a short recession, no bank failure; ~500bn$ of subprime losses — near-collapse of the global system',
      'Eliminate the false explanations: not size (ten to one), not speed, not the real-estate nature — the decisive variable is the funding channel',
      'The theorem: dot-com losses sat in equities, unlevered, with final investors; 2008 losses sat in 30×+ leveraged balance sheets funded overnight in repo and ABCP',
      'The formula of misfortune closes the loop: at 31× leverage, −3.2% of assets kills — each euro of loss triggers forced sales and funding withdrawals; and the irony of the transition: the Fed at 1% in 2003 to cushion the dot-com supplied the subprime fuel',
    ],
    pointsAttendus: [
      'Le paradoxe assumé dès la première phrase : la perte dix fois plus PETITE a produit la crise incomparablement plus grave — donc la taille de la perte initiale ne prédit pas la gravité',
      'La localisation des pertes dot-com : portefeuilles d\'actions — fonds de pension, ménages, capital-risque — détenus sans levier bancaire ; un actionnaire au comptant ruiné ne doit rien à personne : pas d\'appel de marge, pas de vente forcée, pas de contagion',
      'La localisation des pertes subprime : bilans bancaires à levier 30+ (Lehman ~31, mort à −100/31 ≈ −3,2 %), financés au jour le jour en repo et ABCP — chaque euro de perte déclenche l\'amplification',
      'Le théorème du module : une bulle sectorielle ne devient systémique que si elle est financée par la dette et logée dans les banques',
      'La preuve par les conséquences : 2001 — récession courte et peu profonde, pas de run ; 2008 — S&P −56,8 %, ~8,8 M d\'emplois, production industrielle mondiale sur la pente de 1930',
      'L\'ironie de l\'enchaînement : pour amortir l\'éclatement dot-com, la Fed baisse à 1 % en 2003 — l\'argent bon marché cherche un rendement et le trouve dans l\'immobilier : la bulle suivante sera à crédit',
    ],
    pointsAttendusEn: [
      'The paradox owned from the first sentence: the ten times SMALLER loss produced the incomparably graver crisis — so the size of the initial loss does not predict severity',
      'Where the dot-com losses sat: equity portfolios — pension funds, households, venture capital — held without bank leverage; a ruined unlevered shareholder owes nobody anything: no margin call, no forced sale, no contagion',
      'Where the subprime losses sat: bank balance sheets at 30×+ leverage (Lehman ~31, dead at −100/31 ≈ −3.2%), funded overnight in repo and ABCP — every euro of loss triggers the amplification',
      'The module\'s theorem: a sectoral bubble only becomes systemic if it is financed by debt and housed inside the banks',
      'The proof by consequences: 2001 — a short, shallow recession, no run; 2008 — S&P −56.8%, ~8.8M jobs, world industrial production on the 1930 slope',
      'The irony of the sequence: to cushion the dot-com bust, the Fed cuts to 1% in 2003 — cheap money hunts for yield and finds it in housing: the next bubble would be on credit',
    ],
    bonus: [
      'La nuance qui enrichit : la dot-com a quand même laissé des leçons institutionnelles (Enron, WorldCom → Sarbanes-Oxley 2002, certification personnelle des comptes) — pas de crise systémique ne veut pas dire pas de dégâts : quinze ans pour revoir 5 000 points, une génération d\'épargne retraite amputée',
      'La grille de lecture prospective à offrir au jury : devant toute bulle présumée (IA, crypto, immobilier), poser les trois questions du théorème — qui la porte ? à quel levier ? financé à quelle échéance ? — c\'est elle qui sépare la correction coûteuse de la menace systémique',
    ],
    bonusEn: [
      'The enriching nuance: the dot-com still left institutional lessons (Enron, WorldCom → Sarbanes-Oxley 2002, personal certification of accounts) — no systemic crisis does not mean no damage: fifteen years to see 5,000 again, a generation\'s retirement savings amputated',
      'The forward-looking grid to offer the jury: facing any presumed bubble (AI, crypto, real estate), ask the theorem\'s three questions — who holds it? at what leverage? funded at what maturity? — that is what separates a costly correction from a systemic threat',
    ],
    reponseModele: `Le paradoxe mérite d'être posé en chiffres : l'éclatement de la dot-com détruit de l'ordre de **5 000 Md$** de capitalisation — récession courte de 2001, aucune faillite bancaire ; les pertes subprime réalisées font environ **500 Md$** — dix fois moins — et le système financier mondial passe à quelques jours de l'arrêt. La taille de la perte initiale ne prédit donc *rien* : tout tient au **canal de financement**.

**Dot-com : des fonds propres qui s'évaporent.** Les pertes étaient logées dans des portefeuilles d'actions — fonds de pension, ménages, capital-risque — détenus **sans levier bancaire**. Un actionnaire au comptant qui perd 78 % est ruiné, mais il ne doit rien à personne : pas d'appel de marge, pas de vente forcée, pas de créancier à rembourser le jour même — pas de contagion. Des épargnants appauvris, pas un système en danger.

**Subprimes : des actifs à crédit dans des bilans à levier.** Les mêmes euros de perte logeaient dans des banques au levier 30 et plus — Lehman vers 31, où la formule du malheur donne la mort à −100/31 ≈ **−3,2 %** d'actifs — financées au jour le jour en repo et ABCP. Là, chaque euro de perte déclenche l'amplification : appels de collatéral, haircuts élargis, ventes forcées, retraits de financement. D'où le théorème du chapitre : **une bulle sectorielle ne devient systémique que si elle est financée par la dette et logée dans les banques.**

Et l'ironie de l'enchaînement, à offrir en conclusion : pour amortir l'éclatement de la dot-com, la Fed descend à 1 % en 2003 — et cet argent bon marché, cherchant un rendement, ira gonfler l'immobilier. La bulle suivante, elle, sera à crédit. Devant toute bulle présumée, les trois questions qui comptent : qui la porte, à quel levier, financé à quelle échéance.`,
    reponseModeleEn: `The paradox deserves to be stated in numbers: the dot-com bust destroys on the order of **5,000bn$** of market capitalisation — the short recession of 2001, no bank failure; realised subprime losses come to about **500bn$** — ten times less — and the global financial system comes within days of stopping. The size of the initial loss therefore predicts *nothing*: everything hinges on the **funding channel**.

**Dot-com: equity evaporating.** The losses sat in equity portfolios — pension funds, households, venture capital — held **without bank leverage**. An unlevered shareholder who loses 78% is ruined, but owes nobody anything: no margin call, no forced sale, no creditor to repay the same day — no contagion. Impoverished savers, not a system in danger.

**Subprime: credit-financed assets inside leveraged balance sheets.** The same euros of loss sat in banks at 30× leverage and above — Lehman around 31, where the formula of misfortune puts death at −100/31 ≈ **−3.2%** of assets — funded overnight in repo and ABCP. There, every euro of loss triggers the amplification: collateral calls, wider haircuts, forced sales, funding withdrawals. Hence the chapter's theorem: **a sectoral bubble only becomes systemic if it is financed by debt and housed inside the banks.**

And the irony of the sequence, to offer in conclusion: to cushion the dot-com bust, the Fed cuts to 1% in 2003 — and that cheap money, hunting for yield, would inflate housing. The next bubble would be on credit. Facing any presumed bubble, the three questions that matter: who holds it, at what leverage, funded at what maturity.`,
  },
  {
    id: 'm11-j-15',
    moduleId: M11,
    theme: '2008 : des subprimes au systémique',
    themeEn: '2008: from subprime to systemic',
    difficulte: 3,
    question: 'Qu\'a changé la titrisation dans la nature du risque de crédit ?',
    questionEn: 'What did securitisation change in the nature of credit risk?',
    plan: [
      'Le changement d\'incitations : du modèle « originer et garder » au modèle originate-to-distribute — quand plus personne dans la chaîne n\'est exposé, plus personne ne vérifie',
      'Le changement de mathématique : la subordination transforme le risque de défaut individuel en risque de CORRÉLATION — le senior AAA ne craint pas les défauts isolés, il ne craint qu\'un choc commun',
      'Le vice caché : la corrélation calibrée sur des données sans retournement national — dans un retournement national, tous les prêts défaillent ensemble, la corrélation saute vers 1, le coussin est traversé',
      'Le paradoxe final : le risque prétendument dispersé s\'est reconcentré — AIG vend ~500 Md$ de protection sur les tranches senior sans réserves : la dispersion était une illusion comptable',
    ],
    planEn: [
      'The change in incentives: from "originate and hold" to originate-to-distribute — when nobody along the chain is exposed, nobody checks',
      'The change in mathematics: subordination turns individual default risk into CORRELATION risk — the senior AAA does not fear isolated defaults, it only fears a common shock',
      'The hidden flaw: correlation calibrated on data with no national downturn — in a national downturn, all loans default together, correlation jumps towards 1, the cushion is pierced',
      'The final paradox: the supposedly dispersed risk reconcentrated — AIG sells ~500bn$ of protection on senior tranches without reserves: dispersion was an accounting illusion',
    ],
    pointsAttendus: [
      'Le modèle classique : celui qui accorde le prêt le garde trente ans à son bilan — il a un intérêt vital à vérifier l\'emprunteur ; l\'originate-to-distribute rémunère chaque maillon au flux (courtier, arrangeur, agence) — le risque atterrit chez un investisseur qui n\'a jamais vu l\'emprunteur',
      'La phrase de synthèse sur les incitations : la qualité du crédit devient l\'affaire de tout le monde, c\'est-à-dire de personne — d\'où les prêts 2/28, teaser rates et NINJA',
      'La mécanique de la subordination : pool de 100 découpé en equity 5 / mezzanine 15 / senior 80 — les pertes frappent dans l\'ordre ; si les défauts sont peu corrélés, la probabilité que les pertes dépassent 20 est infime : le senior peut être AAA au-dessus d\'un pool BBB',
      'Le transfert de nature : le porteur de la tranche senior ne porte plus un risque de défaut individuel mais un risque de scénario commun — exactement la leçon du worst-of : la diversification disparaît quand la corrélation monte, précisément quand on en a besoin',
      'L\'étage qui démultiplie : CDO d\'ABS et CDO² — à chaque étage, la subordination refabrique du AAA à partir des invendus de l\'étage inférieur, et la sensibilité à l\'hypothèse de corrélation est démultipliée',
      'La distinction des deux AAA : un AAA corporate survit à presque tous les scénarios ; un AAA structuré survit à tous les scénarios sauf UN — précisément celui qui s\'est produit ; et la reconcentration finale chez AIG (~500 Md$ de CDS sans réserves)',
    ],
    pointsAttendusEn: [
      'The classic model: whoever grants the loan keeps it thirty years on its books — a vital interest in checking the borrower; originate-to-distribute pays every link on flow (broker, arranger, agency) — the risk lands with an investor who has never seen the borrower',
      'The one-line synthesis on incentives: credit quality becomes everybody\'s business, that is to say nobody\'s — hence 2/28 loans, teaser rates and NINJA',
      'The subordination mechanics: a pool of 100 cut into equity 5 / mezzanine 15 / senior 80 — losses hit in order; if defaults are weakly correlated, the probability that losses exceed 20 is tiny: the senior can be AAA on top of a BBB pool',
      'The change of nature: the senior tranche holder no longer carries individual default risk but common-scenario risk — exactly the worst-of lesson: diversification vanishes when correlation rises, precisely when you need it',
      'The multiplying storey: CDOs of ABS and CDO² — at each level, subordination re-manufactures AAA from the unsold parts of the level below, and the sensitivity to the correlation assumption is multiplied',
      'The two AAAs distinguished: a corporate AAA survives almost every scenario; a structured AAA survives every scenario but ONE — precisely the one that happened; and the final reconcentration at AIG (~500bn$ of CDS with no reserves)',
    ],
    bonus: [
      'Le rôle des agences, avec sa mécanique : payées par l\'émetteur qu\'elles notent — refuser le AAA, c\'est perdre le client au profit de l\'agence d\'à côté : un conflit d\'intérêts structurel, pas une malhonnêteté ponctuelle',
      'L\'hypothèse-mère à nommer : « les prix de l\'immobilier n\'ont jamais baissé au niveau national depuis 1945 » — toute la pyramide reposait sur une corrélation estimée dans un échantillon qui ne contenait pas le scénario destructeur ; c\'est le même vice statistique que la VaR de LTCM',
    ],
    bonusEn: [
      'The agencies\' role, with its mechanics: paid by the issuer they rate — refusing the AAA means losing the client to the agency next door: a structural conflict of interest, not one-off dishonesty',
      'The mother-assumption to name: "national house prices have never fallen since 1945" — the whole pyramid rested on a correlation estimated in a sample that did not contain the destructive scenario; the same statistical flaw as LTCM\'s VaR',
    ],
    reponseModele: `La titrisation a changé le risque de crédit deux fois : dans ses **incitations**, et dans sa **nature mathématique**.

**Les incitations d'abord.** Dans le modèle classique, celui qui accorde un prêt le garde trente ans à son bilan : il a un intérêt vital à vérifier l'emprunteur. Dans l'**originate-to-distribute**, le courtier revend immédiatement le prêt à un arrangeur qui le titrise : chaque maillon — courtier, banque, agence de notation — est payé au flux, au volume, et le risque final atterrit chez un investisseur qui n'a jamais vu l'emprunteur. Quand plus personne dans la chaîne n'est exposé, plus personne ne vérifie : la qualité du crédit devient l'affaire de tout le monde, c'est-à-dire de **personne**. Les prêts 2/28 et NINJA en sont les enfants naturels.

**La nature du risque ensuite.** La **subordination** est un ordre de passage devant les pertes : sur un pool de 100 découpé en equity 5, mezzanine 15, senior 80, le senior n'est touché qu'au-delà de 20 de pertes — probabilité infime *si les défauts sont peu corrélés*. Le porteur du senior AAA ne porte donc plus un risque de défaut individuel : il porte un pur **risque de corrélation** — il ne craint qu'un choc commun. Or la corrélation était calibrée sur des données où l'immobilier ne baissait jamais partout à la fois ; dans un retournement national, tous les prêts défaillent ensemble, la corrélation saute vers 1, et le coussin est traversé comme du papier. C'est la leçon du worst-of à l'échelle systémique — et les CDO et CDO², qui retranchent les invendus de l'étage inférieur, démultiplient la sensibilité à cette seule hypothèse.

D'où la distinction à réciter : un AAA corporate survit à presque tous les scénarios ; un AAA structuré survit à tous les scénarios **sauf un** — celui qui s'est produit. Et le paradoxe final : le risque prétendument dispersé s'est **reconcentré** — AIG en avait assuré ~500 Md$ sans réserves. La titrisation n'a pas éliminé le risque de crédit : elle l'a transformé en risque de corrélation, et déplacé chez ceux qui le comprenaient le moins.`,
    reponseModeleEn: `Securitisation changed credit risk twice: in its **incentives**, and in its **mathematical nature**.

**Incentives first.** In the classic model, whoever grants a loan keeps it on its books for thirty years: a vital interest in checking the borrower. In **originate-to-distribute**, the broker immediately sells the loan to an arranger who securitises it: every link — broker, bank, rating agency — is paid on flow, on volume, and the final risk lands with an investor who has never seen the borrower. When nobody along the chain is exposed, nobody checks: credit quality becomes everybody's business, that is to say **nobody's**. The 2/28 and NINJA loans are its natural children.

**The nature of the risk next.** **Subordination** is an order of passage before losses: on a pool of 100 cut into equity 5, mezzanine 15, senior 80, the senior is only touched beyond 20 of losses — a tiny probability *if defaults are weakly correlated*. The senior AAA holder thus no longer carries individual default risk: he carries pure **correlation risk** — he only fears a common shock. Yet the correlation was calibrated on data where housing never fell everywhere at once; in a national downturn, all loans default together, correlation jumps towards 1, and the cushion is pierced like paper. It is the worst-of lesson at systemic scale — and the CDOs and CDO², which re-tranche the unsold parts of the level below, multiply the sensitivity to that single assumption.

Hence the distinction to recite: a corporate AAA survives almost every scenario; a structured AAA survives every scenario **but one** — the one that happened. And the final paradox: the supposedly dispersed risk **reconcentrated** — AIG had insured ~500bn$ of it with no reserves. Securitisation did not eliminate credit risk: it turned it into correlation risk, and moved it to those who understood it least.`,
  },
  {
    id: 'm11-j-16',
    moduleId: M11,
    theme: 'la grammaire des crises',
    themeEn: 'the grammar of crises',
    difficulte: 1,
    question: 'Racontez la panique de 1907 et sa conséquence institutionnelle.',
    questionEn: 'Tell the story of the 1907 panic and its institutional consequence.',
    plan: [
      'Le déclencheur : une tentative ratée de corner sur le cuivre éclabousse les banques des spéculateurs — la défiance saute sur le Knickerbocker Trust, pris d\'assaut, fermé le 22 octobre après 8 M$ payés en trois heures',
      'La propagation : ruées de trust en trust, la bourse manque de call money, les taux au jour le jour s\'envolent — et il n\'y a PAS de banque centrale (l\'Amérique a laissé mourir la sienne en 1836)',
      'Le sauvetage : J.P. Morgan, 70 ans, depuis sa bibliothèque — trier les solvables des condamnés (du Bagehot à main levée), et enfermer les présidents des trusts jusqu\'au fonds de 25 M$ souscrit vers 4 h 45 du matin',
      'La conséquence : une économie de cette taille ne peut pas dépendre d\'un homme de 70 ans — le Federal Reserve Act est signé en 1913 : le prêteur en dernier ressort devient une institution',
    ],
    planEn: [
      'The trigger: a failed copper corner splashes the speculators\' banks — distrust jumps to the Knickerbocker Trust, stormed, closed on 22 October after paying 8M$ in three hours',
      'The propagation: runs from trust to trust, the stock exchange short of call money, overnight rates soaring — and there is NO central bank (America let its own die in 1836)',
      'The rescue: J.P. Morgan, 70 years old, from his library — sorting the solvent from the doomed (Bagehot freehand), and locking the trust presidents in until the 25M$ fund is subscribed around 4:45 a.m.',
      'The consequence: an economy of that size cannot depend on one 70-year-old man — the Federal Reserve Act is signed in 1913: the lender of last resort becomes an institution',
    ],
    pointsAttendus: [
      'La chronologie : octobre 1907, New York — corner raté sur le cuivre, défiance sur le Knickerbocker Trust (troisième trust de la ville), fermé le 22 octobre après avoir payé 8 M$ en trois heures',
      'La propagation mécanique : les ruées sautent de trust en trust, la bourse manque de call money, les taux au jour le jour s\'envolent — le plébiscite quotidien du financement court, perdu',
      'Le vide institutionnel : pas de banque centrale depuis 1836 — le prêteur en dernier ressort est un homme privé de 70 ans, J.P. Morgan',
      'La méthode Morgan, qui est du Bagehot appliqué : examiner les livres pour trier les solvables des condamnés, organiser la solidarité des banquiers — jusqu\'à les enfermer dans sa bibliothèque pour obtenir les 25 M$ vers 4 h 45 du matin',
      'La conséquence : le Federal Reserve Act, signé en 1913 — le prêteur en dernier ressort institutionnalisé',
      'Le schéma à généraliser : la crise révèle le trou institutionnel, l\'institution naît du trou — 1907 → Fed ; 1929-33 → FDIC, SEC, Glass-Steagall ; 2008 → Dodd-Frank, Bâle III ; 2010-12 → MES, union bancaire',
    ],
    pointsAttendusEn: [
      'The chronology: October 1907, New York — a failed copper corner, distrust of the Knickerbocker Trust (the city\'s third-largest), closed on 22 October after paying 8M$ in three hours',
      'The mechanical propagation: runs jump from trust to trust, the exchange lacks call money, overnight rates soar — the daily plebiscite of short funding, lost',
      'The institutional void: no central bank since 1836 — the lender of last resort is a private 70-year-old man, J.P. Morgan',
      'Morgan\'s method, which is applied Bagehot: examining the books to sort the solvent from the doomed, organising the bankers\' solidarity — even locking them in his library until the 25M$ fund is subscribed around 4:45 a.m.',
      'The consequence: the Federal Reserve Act, signed in 1913 — the lender of last resort institutionalised',
      'The pattern to generalise: the crisis reveals the institutional hole, the institution is born from the hole — 1907 → Fed; 1929-33 → FDIC, SEC, Glass-Steagall; 2008 → Dodd-Frank, Basel III; 2010-12 → ESM, banking union',
    ],
    bonus: [
      'Le parallèle 1907-2023 qui fait le pont d\'un siècle : Knickerbocker meurt en payant 8 M$ en trois heures de guichets ; SVB meurt sur 42 Md$ de retraits en une journée d\'application mobile — même mécanique de run, la vitesse en plus, et dans les deux cas ce sont les créances non garanties qui courent',
      'Le clin d\'œil de l\'histoire : en 1929, Richard Whitney achetant ostensiblement US Steel copiait le geste théâtral de Morgan en 1907 — mais un geste sans bilan derrière n\'arrête pas une panique : 1929 n\'était pas 1907, et c\'est bien pourquoi il faut une institution',
    ],
    bonusEn: [
      'The 1907-2023 parallel bridging a century: Knickerbocker dies paying 8M$ over three hours at the counters; SVB dies on 42bn$ of withdrawals in one mobile-app day — the same run mechanics, plus speed, and in both cases it is the unguaranteed claims that run',
      'History\'s wink: in 1929, Richard Whitney ostentatiously buying US Steel copied Morgan\'s 1907 theatrical gesture — but a gesture without a balance sheet behind it does not stop a panic: 1929 was not 1907, which is precisely why an institution is needed',
    ],
    reponseModele: `New York, octobre 1907. Une tentative ratée de **corner sur le cuivre** éclabousse les banques des spéculateurs, et la défiance saute sur le **Knickerbocker Trust** — troisième trust de la ville — dont les guichets sont pris d'assaut : il ferme le 22 octobre après avoir payé **8 millions de dollars en trois heures**. Les ruées se propagent de trust en trust, la bourse manque de call money, les taux au jour le jour s'envolent. Le financement court est un plébiscite quotidien, et le plébiscite vient d'être perdu.

Le détail qui fait tout le sel de l'histoire : il n'y a **pas de banque centrale** — l'Amérique a laissé mourir la sienne en 1836. Il y a un homme : **John Pierpont Morgan**, 70 ans, qui organise le sauvetage depuis sa bibliothèque de Madison Avenue. Sa méthode est du Bagehot appliqué à main levée : il examine les livres pour **trier les solvables des condamnés**, convoque les banquiers, et une nuit fameuse, enferme littéralement les présidents des trusts dans la pièce jusqu'à ce qu'ils souscrivent, vers 4 h 45 du matin, un fonds de solidarité de **25 millions de dollars**. La panique reflue.

La leçon institutionnelle fait immédiatement consensus : une économie de la taille des États-Unis ne peut pas suspendre son système de paiement à la santé et au bon vouloir d'un homme de 70 ans. Le **Federal Reserve Act est signé en 1913** : le prêteur en dernier ressort devient une institution.

Et le schéma se généralise — c'est lui que le jury veut entendre : **la crise révèle le trou institutionnel, l'institution naît du trou**. 1907 donne la Fed ; 1929-1933 donnent la FDIC, la SEC et Glass-Steagall ; 2008 donne Dodd-Frank et Bâle III ; 2010-2012 donnent le MES et l'union bancaire. Nos institutions sont des cicatrices — chacune porte la date de sa catastrophe fondatrice.`,
    reponseModeleEn: `New York, October 1907. A failed **copper corner** splashes the speculators' banks, and distrust jumps to the **Knickerbocker Trust** — the city's third-largest — whose counters are stormed: it closes on 22 October after paying out **8 million dollars in three hours**. Runs propagate from trust to trust, the stock exchange runs short of call money, overnight rates soar. Short funding is a daily plebiscite, and the plebiscite has just been lost.

The detail that gives the story its flavour: there is **no central bank** — America let its own die in 1836. There is a man: **John Pierpont Morgan**, 70 years old, organising the rescue from his Madison Avenue library. His method is Bagehot applied freehand: he examines the books to **sort the solvent from the doomed**, summons the bankers, and on one famous night literally locks the trust presidents in the room until they subscribe, around 4:45 a.m., a solidarity fund of **25 million dollars**. The panic recedes.

The institutional lesson is immediately consensual: an economy the size of the United States cannot hang its payment system on the health and goodwill of one 70-year-old man. The **Federal Reserve Act is signed in 1913**: the lender of last resort becomes an institution.

And the pattern generalises — it is what the jury wants to hear: **the crisis reveals the institutional hole, the institution is born from the hole**. 1907 gives the Fed; 1929-1933 give the FDIC, the SEC and Glass-Steagall; 2008 gives Dodd-Frank and Basel III; 2010-2012 give the ESM and banking union. Our institutions are scars — each bears the date of its founding catastrophe.`,
  },
  {
    id: 'm11-j-17',
    moduleId: M11,
    theme: 'les crises éclair',
    themeEn: 'the flash crises',
    difficulte: 3,
    question: 'Pourquoi les crises modernes durent-elles des semaines, et non des années ?',
    questionEn: 'Why do modern crises last weeks, not years?',
    plan: [
      'Le constat chiffré : 34 mois de baisse pour le Dow de 1929 et 25 ans de purgatoire ; 17 mois pour le S&P de 2008 ; 23 séances et 5 mois pour le COVID ; 13 jours pour les gilts ; 48 heures pour SVB',
      'Raison 1, la dominante : le pompier a appris — instruit par 1929 et 2008, il intervient en heures avec des backstops massifs et crédibles : QE illimité le 23 mars 2020 (le creux est le jour même), 19 Md£ de la BoE, garantie de tous les dépôts le 12 mars 2023',
      'Raisons 2 et 3 : l\'information et l\'ordre de vente voyagent à la vitesse du smartphone — les crises se compriment dans les deux sens ; et le levier est devenu systémique, donc les spirales s\'enclenchent plus vite',
      'Le double tranchant à ne pas omettre : chaque sauvetage réussi enseigne au marché à porter plus de levier — l\'aléa moral prépare la crise suivante ; la question ouverte : plus sûr, ou seulement mieux assuré ?',
    ],
    planEn: [
      'The numbered observation: 34 months of decline for the 1929 Dow and 25 years of purgatory; 17 months for the 2008 S&P; 23 sessions and 5 months for COVID; 13 days for gilts; 48 hours for SVB',
      'Reason 1, the dominant one: the firefighter has learned — schooled by 1929 and 2008, it intervenes within hours with massive, credible backstops: unlimited QE on 23 March 2020 (the trough is that very day), £19bn from the BoE, all deposits guaranteed on 12 March 2023',
      'Reasons 2 and 3: information and the sell order travel at smartphone speed — crises compress in both directions; and leverage has become systemic, so spirals engage faster',
      'The double edge not to omit: every successful rescue teaches the market to carry more leverage — moral hazard prepares the next crisis; the open question: safer, or merely better insured?',
    ],
    pointsAttendus: [
      'La compression documentée : 1929 — creux à 34 mois, pic revu 25 ans après ; 2008 — creux à 17 mois ; COVID 2020 — −33,9 % en 23 séances, pic revu en 5 mois ; gilts 2022 — 13 jours ouvrés d\'intervention ; SVB 2023 — 48 heures',
      'Le pompier instruit : la leçon de Friedman-Schwartz (la Fed passive de 1930 a transformé un krach en dépression) est apprise — Bernanke l\'a promis en 2002 : « grâce à vous, nous ne le referons plus » ; en mars 2020, la Fed déroule en trois semaines ce qui avait pris dix-huit mois en 2008',
      'La preuve du 23 mars 2020 : le creux du S&P (2 237,40) est atteint LE JOUR MÊME de l\'annonce du QE illimité — pas au point bas de l\'économie : dans une crise de liquidité, le plancher n\'est pas une valorisation, c\'est un bilan',
      'La vitesse de l\'information : le run SVB est coordonné par Twitter et les group chats — 42 Md$ en une journée là où 1907 prenait des semaines de files ; l\'ordre de vente va aussi vite que la rumeur',
      'Le levier systémique : les spirales s\'enclenchent plus vite (LDI : la boucle tourne en heures), mais s\'éteignent aussi plus vite dès que le backstop écrase la décote',
      'Le double tranchant : Greenspan 1987 → Fed put → QE illimité 2020 → garantie de tous les dépôts 2023 — chaque sauvetage réussi enseigne au marché à porter plus de levier ; bilans de banques centrales multipliés par ~9 depuis 2007 : le système est-il plus sûr, ou seulement assuré par un assureur de plus en plus chargé ?',
    ],
    pointsAttendusEn: [
      'The documented compression: 1929 — trough at 34 months, peak regained 25 years later; 2008 — trough at 17 months; COVID 2020 — −33.9% in 23 sessions, peak regained in 5 months; gilts 2022 — 13 business days of intervention; SVB 2023 — 48 hours',
      'The schooled firefighter: the Friedman-Schwartz lesson (the passive Fed of 1930 turned a crash into a depression) has been learned — Bernanke promised it in 2002: "thanks to you, we won\'t do it again"; in March 2020 the Fed unrolls in three weeks what took eighteen months in 2008',
      'The proof of 23 March 2020: the S&P trough (2,237.40) is reached THE VERY DAY unlimited QE is announced — not at the economy\'s low point: in a liquidity crisis, the floor is not a valuation, it is a balance sheet',
      'The speed of information: the SVB run is coordinated on Twitter and group chats — 42bn$ in one day where 1907 took weeks of queues; the sell order travels as fast as the rumour',
      'Systemic leverage: spirals engage faster (LDI: the loop turns in hours), but also die faster once the backstop crushes the discount',
      'The double edge: Greenspan 1987 → Fed put → unlimited QE 2020 → all deposits guaranteed 2023 — every successful rescue teaches the market to carry more leverage; central bank balance sheets multiplied by ~9 since 2007: is the system safer, or merely insured by an ever more loaded insurer?',
    ],
    bonus: [
      'La nuance du contre-exemple : la compression n\'est pas une loi — le Nikkei de 1989 a mis 34 ans, et le Nasdaq de 2000 quinze ans : quand le problème est une valorisation de départ délirante et non une liquidité, le pompier ne raccourcit rien ; les backstops écourtent les crises de liquidité, pas les erreurs de prix',
      'Le marqueur de régime à citer : le « dash for cash » de mars 2020 — même les Treasuries et l\'or baissaient : signature d\'une crise de liquidité pure, précisément le type de crise que le pompier moderne sait éteindre en jours',
    ],
    bonusEn: [
      'The counter-example nuance: compression is not a law — the 1989 Nikkei took 34 years, the 2000 Nasdaq fifteen: when the problem is a delusional starting valuation rather than liquidity, the firefighter shortens nothing; backstops shorten liquidity crises, not pricing errors',
      'The regime marker to cite: the March 2020 "dash for cash" — even Treasuries and gold were falling: the signature of a pure liquidity crisis, precisely the type the modern firefighter knows how to extinguish in days',
    ],
    reponseModele: `Le constat d'abord, en chiffres : le Dow de 1929 met **34 mois** à toucher son creux et 25 ans à revoir son pic ; le S&P de 2008, 17 mois ; le COVID, **−33,9 % en 23 séances** et cinq mois pour tout reprendre ; les gilts de 2022, treize jours ouvrés ; SVB, 48 heures. Trois raisons à cette compression.

**La première, dominante : le pompier a appris.** La leçon de Friedman et Schwartz — la Fed passive de 1930 a transformé un krach en dépression — est devenue le manuel ; Bernanke l'avait promis aux auteurs en 2002 : « grâce à vous, nous ne le referons plus ». En mars 2020, la Fed déroule en **trois semaines** ce qui avait pris dix-huit mois en 2008 : baisse d'urgence, taux zéro, puis QE **illimité** le 23 mars. Et la preuve est dans la date : le creux du marché est atteint **le jour même** de l'annonce — pas au point bas de l'économie. Dans une crise de liquidité, le plancher n'est pas une valorisation, c'est un **bilan** — celui de l'acteur qui ne peut pas manquer de cash.

**Les deux autres : la vitesse et le levier.** L'information — et l'ordre de vente — voyage à la vitesse du smartphone : 42 Md$ retirés de SVB en une journée, là où 1907 prenait des semaines de files. Et le levier est devenu systémique : les spirales s'enclenchent en heures — mais s'éteignent aussi en heures dès que le backstop écrase la décote.

**Le double tranchant, à ne jamais omettre.** Suivez le fil : communiqué Greenspan 1987 → Fed put → QE illimité 2020 → garantie de *tous* les dépôts 2023. Chaque sauvetage fut, isolément, la bonne décision — et chaque sauvetage réussi enseigne au marché à porter plus de levier, puisque la perte extrême est assurée. Bilans de banques centrales multipliés par ~9 depuis 2007 : les crises durent des semaines, mais la question de la décennie reste ouverte — le système est-il plus sûr, ou seulement assuré par un assureur de plus en plus chargé ?`,
    reponseModeleEn: `The observation first, in numbers: the 1929 Dow takes **34 months** to reach its trough and 25 years to see its peak again; the 2008 S&P, 17 months; COVID, **−33.9% in 23 sessions** and five months to take it all back; the 2022 gilts, thirteen business days; SVB, 48 hours. Three reasons for this compression.

**The first, dominant one: the firefighter has learned.** The Friedman-Schwartz lesson — the passive Fed of 1930 turned a crash into a depression — became the manual; Bernanke promised the authors in 2002: "thanks to you, we won't do it again". In March 2020, the Fed unrolls in **three weeks** what took eighteen months in 2008: emergency cut, zero rates, then **unlimited** QE on 23 March. And the proof is in the date: the market trough is reached **the very day** of the announcement — not at the economy's low point. In a liquidity crisis, the floor is not a valuation, it is a **balance sheet** — that of the actor who cannot run out of cash.

**The other two: speed and leverage.** Information — and the sell order — travels at smartphone speed: 42bn$ withdrawn from SVB in one day, where 1907 took weeks of queues. And leverage has become systemic: spirals engage within hours — but also die within hours once the backstop crushes the discount.

**The double edge, never to omit.** Follow the thread: Greenspan's 1987 statement → Fed put → unlimited QE 2020 → *all* deposits guaranteed 2023. Each rescue was, in isolation, the right decision — and each successful rescue teaches the market to carry more leverage, since the extreme loss is insured. Central bank balance sheets multiplied by ~9 since 2007: crises last weeks, but the decade's question remains open — is the system safer, or merely insured by an ever more loaded insurer?`,
  },
  {
    id: 'm11-j-18',
    moduleId: M11,
    theme: 'les leçons transversales',
    themeEn: 'cross-cutting lessons',
    difficulte: 3,
    question: 'L\'aléa moral : le prix caché des sauvetages ?',
    questionEn: 'Moral hazard: the hidden price of bailouts?',
    plan: [
      'Définir : l\'aléa moral naît quand l\'assurance change le comportement de l\'assuré — si la perte extrême est couverte par le pompier, il devient rationnel de porter plus de levier',
      'Dérouler le fil historique : communiqué Greenspan 1987 → « Greenspan put » puis « Fed put » des années 1990-2000 → Bear Stearns mars 2008 (« les gros seront sauvés ») → QE illimité 2020 → garantie de tous les dépôts 2023',
      'Le contre-exemple qui prouve la difficulté : Lehman — la tentative de casser l\'aléa moral par l\'exemple, au prix d\'une quasi-destruction du système en 24 heures',
      'Conclure en tension : chaque sauvetage fut isolément la bonne décision, et leur somme installe un backstop attendu — bilans de banques centrales ×9 depuis 2007 ; les remèdes qui découplent : conditionnalité (OMT), pertes imposées aux porteurs (AT1), taux de pénalité (Bagehot)',
    ],
    planEn: [
      'Define: moral hazard arises when insurance changes the insured\'s behaviour — if the extreme loss is covered by the firefighter, carrying more leverage becomes rational',
      'Unroll the historical thread: Greenspan\'s 1987 statement → the "Greenspan put" then the "Fed put" of the 1990s-2000s → Bear Stearns March 2008 ("the big ones get saved") → unlimited QE 2020 → all deposits guaranteed 2023',
      'The counter-example that proves the difficulty: Lehman — the attempt to break moral hazard by example, at the price of near-destruction of the system within 24 hours',
      'Conclude in tension: each rescue was individually the right decision, and their sum installs an expected backstop — central bank balance sheets ×9 since 2007; the decoupling remedies: conditionality (OMT), losses imposed on holders (AT1), penalty rates (Bagehot)',
    ],
    pointsAttendus: [
      'La définition économique propre : l\'assurance modifie le comportement de l\'assuré — appliquée aux marchés : si le pompier couvre la queue de distribution, le levier et la prise de risque augmentent rationnellement',
      'Le fil chronologique complet : 1987 (communiqué Greenspan), le « Fed put » des années 1990-2000 (baisses de taux après LTCM qui nourrissent la dot-com), Bear Stearns (mars 2008 : le marché retient que les gros seront sauvés), mars 2020 (QE illimité, facilités corporate jusqu\'aux fallen angels), mars 2023 (garantie de tous les dépôts de SVB)',
      'Lehman comme expérience naturelle : vouloir casser l\'aléa moral par l\'exemple a coûté si cher (fonds monétaires, papier commercial, TARP) que plus personne n\'a jamais voulu refaire la démonstration — l\'aléa moral est d\'autant plus fort que le refus de sauver n\'est pas crédible',
      'La tension honnête : chaque sauvetage fut, isolément, la bonne décision — le problème n\'est pas une erreur ponctuelle mais la somme : un backstop désormais attendu, pricé, incorporé dans les leviers',
      'Les chiffres du bilan : bilans de banques centrales multipliés par environ 9 depuis 2007, dettes publiques au sommet — l\'assureur systémique est de plus en plus chargé',
      'Les mécanismes qui découplent sauvetage et subvention : le taux de pénalité et le bon collatéral de Bagehot, la conditionnalité de l\'OMT, les pertes imposées aux actionnaires et créanciers (AIG à 79,9 %, AT1 de Credit Suisse effacés) — sauver le système sans enrichir ceux qui l\'ont mis en danger',
    ],
    pointsAttendusEn: [
      'The proper economic definition: insurance changes the insured\'s behaviour — applied to markets: if the firefighter covers the tail of the distribution, leverage and risk-taking increase rationally',
      'The full chronological thread: 1987 (Greenspan\'s statement), the "Fed put" of the 1990s-2000s (post-LTCM rate cuts feeding the dot-com), Bear Stearns (March 2008: the market concludes the big ones get saved), March 2020 (unlimited QE, corporate facilities down to fallen angels), March 2023 (all SVB deposits guaranteed)',
      'Lehman as the natural experiment: trying to break moral hazard by example cost so much (money market funds, commercial paper, TARP) that nobody ever wanted to repeat the demonstration — moral hazard is all the stronger because refusing to rescue is not credible',
      'The honest tension: each rescue was, in isolation, the right decision — the problem is not a one-off error but the sum: a backstop now expected, priced, embedded in leverage levels',
      'The balance sheet numbers: central bank balance sheets multiplied by about 9 since 2007, public debts at record highs — the systemic insurer is more and more loaded',
      'The mechanisms that decouple rescue from subsidy: Bagehot\'s penalty rate and good collateral, the OMT\'s conditionality, losses imposed on shareholders and creditors (AIG at 79.9%, Credit Suisse AT1s wiped out) — saving the system without enriching those who endangered it',
    ],
    bonus: [
      'La distinction fine qui impressionne : sauver le SYSTÈME n\'est pas sauver les ACTEURS — AIG a été sauvée mais ses actionnaires dilués à 79,9 % ; les déposants de SVB ont été garantis mais actionnaires et créanciers ont tout perdu : l\'aléa moral se combat dans la répartition des pertes, pas dans le refus d\'intervenir',
      'Le pont Bagehot : le taux de pénalité de 1873 était déjà une réponse à l\'aléa moral — la doctrine complète contenait dès l\'origine son antidote ; c\'est quand on prête largement SANS pénalité ni tri que l\'assurance devient subvention',
    ],
    bonusEn: [
      'The fine distinction that impresses: saving the SYSTEM is not saving the PLAYERS — AIG was rescued but its shareholders diluted to 79.9%; SVB\'s depositors were guaranteed but shareholders and creditors lost everything: moral hazard is fought in the distribution of losses, not in refusing to intervene',
      'The Bagehot bridge: the 1873 penalty rate was already an answer to moral hazard — the complete doctrine contained its antidote from the start; it is when you lend freely WITHOUT penalty or sorting that insurance becomes subsidy',
    ],
    reponseModele: `L'aléa moral naît quand l'assurance change le comportement de l'assuré. Appliqué aux marchés : si le pompier couvre la queue de distribution, porter plus de levier devient **rationnel** — la perte extrême est externalisée. C'est le prix caché de chaque sauvetage réussi.

**Le fil se suit sur quarante ans.** Le communiqué Greenspan de 1987 (« prête à fournir la liquidité ») devient le « **Greenspan put** », puis le « Fed put » des années 1990-2000 — les trois baisses de taux post-LTCM nourrissent la dot-com. Bear Stearns, mars 2008 : le marché retient que « les gros seront sauvés ». Mars 2020 : QE illimité, facilités corporate étendues jusqu'aux fallen angels. Mars 2023 : garantie de *tous* les dépôts de SVB. Chaque étape élargit le périmètre assuré — et chaque sauvetage réussi enseigne au marché à porter plus de levier.

**Le contre-exemple prouve la difficulté** : Lehman fut la tentative de casser l'aléa moral par l'exemple. Coût : ruée sur les fonds monétaires en 24 heures, papier commercial fermé, TARP en urgence — la démonstration a coûté si cher que plus personne n'a voulu la refaire. L'aléa moral est d'autant plus puissant que le refus de sauver n'est **pas crédible**.

**La réponse en tension, honnête** : chaque sauvetage fut, isolément, la bonne décision — le problème est leur *somme* : un backstop désormais attendu, pricé, incorporé dans les leviers, avec des bilans de banques centrales multipliés par ~9 depuis 2007. La sortie intellectuelle : l'aléa moral se combat dans la **répartition des pertes**, pas dans le refus d'intervenir — taux de pénalité et tri de Bagehot, conditionnalité de l'OMT, actionnaires d'AIG dilués à 79,9 %, AT1 de Credit Suisse effacés. Sauver le système, oui ; enrichir ceux qui l'ont mis en danger, non. La question non résolue de la décennie reste ouverte : plus sûr, ou seulement mieux assuré ?`,
    reponseModeleEn: `Moral hazard arises when insurance changes the insured's behaviour. Applied to markets: if the firefighter covers the tail of the distribution, carrying more leverage becomes **rational** — the extreme loss is externalised. That is the hidden price of every successful rescue.

**The thread runs over forty years.** Greenspan's 1987 statement ("ready to provide liquidity") becomes the "**Greenspan put**", then the "Fed put" of the 1990s-2000s — the three post-LTCM rate cuts feed the dot-com. Bear Stearns, March 2008: the market concludes "the big ones get saved". March 2020: unlimited QE, corporate facilities extended down to fallen angels. March 2023: *all* SVB deposits guaranteed. Each step widens the insured perimeter — and each successful rescue teaches the market to carry more leverage.

**The counter-example proves the difficulty**: Lehman was the attempt to break moral hazard by example. Cost: a run on money market funds within 24 hours, commercial paper shut, TARP in emergency — the demonstration cost so much that nobody wanted to repeat it. Moral hazard is all the more powerful because refusing to rescue is **not credible**.

**The honest answer, held in tension**: each rescue was, in isolation, the right decision — the problem is their *sum*: a backstop now expected, priced, embedded in leverage, with central bank balance sheets multiplied by ~9 since 2007. The intellectual exit: moral hazard is fought in the **distribution of losses**, not in the refusal to intervene — Bagehot's penalty rate and sorting, the OMT's conditionality, AIG's shareholders diluted to 79.9%, Credit Suisse's AT1s wiped out. Save the system, yes; enrich those who endangered it, no. The decade's unresolved question remains open: safer, or merely better insured?`,
  },
  {
    id: 'm11-j-19',
    moduleId: M11,
    theme: '2008 : des subprimes au systémique',
    themeEn: '2008: from subprime to systemic',
    difficulte: 3,
    question: 'Qu\'est-ce qu\'un run sur le repo ?',
    questionEn: 'What is a run on repo?',
    plan: [
      'Poser la mécanique du repo : financement contre collatéral, le prêteur garde un haircut comme coussin — financement = valeur × (1 − haircut) : 100 de titres à 2 % de haircut financent 98',
      'Le run : le prêteur ne dit pas « non », il dit « 25 % de haircut » — le financement fond de 98 à 75 : 23 à trouver le jour même, car le repo se renouvelle au jour le jour',
      'La spirale : lever 23 sous 5 % de décote force à vendre 24,2 ; les ventes dépriment les prix, élargissent les haircuts des autres, forcent de nouvelles ventes',
      'La thèse de Gorton : le run de 2008 ne fut pas une ruée aux guichets mais une ruée sur les haircuts — les « dépôts » des institutionnels, sans assurance ; Northern Rock et Bear Stearns tués par le financement de marché avant les déposants',
    ],
    planEn: [
      'State the repo mechanics: funding against collateral, the lender keeps a haircut as cushion — funding = value × (1 − haircut): 100 of securities at a 2% haircut fund 98',
      'The run: the lender does not say "no", it says "25% haircut" — funding melts from 98 to 75: 23 to find the same day, because repo rolls overnight',
      'The spiral: raising 23 under a 5% liquidation discount forces the sale of 24.2; the sales depress prices, widen everyone else\'s haircuts, force new sales',
      'Gorton\'s thesis: the 2008 run was not a run on the counters but a run on haircuts — the institutional world\'s "deposits", uninsured; Northern Rock and Bear Stearns killed by market funding before their depositors',
    ],
    pointsAttendus: [
      'La formule de base : financement repo = valeur des titres × (1 − haircut) — 100 × (1 − 0,02) = 98 en 2006 ; et le levier implicite : haircut 2 % ⇒ levier maximal 100/2 = 50',
      'La forme du run : pas un refus, une décote — le haircut passe de 2 % à 25 %, le financement tombe de 98 à 75 : 23 de financement par 100 de titres s\'évaporent, à combler LE JOUR MÊME puisque le repo est au jour le jour',
      'La seule issue est la vente forcée : lever 23 sous une décote de liquidation de 5 % oblige à vendre 23/(1 − 0,05) = 24,2 de titres — ce qui déprime les prix, élargit les haircuts, et force de nouvelles ventes : la spirale de liquidité en boucle fermée',
      'La formule de Gorton à citer : le run de 2008 fut une ruée SUR LES HAIRCUTS, pas aux guichets — le repo et l\'ABCP étaient les dépôts des institutionnels, réputés sûrs, retirables à volonté, et sans assurance fédérale',
      'L\'invisibilité : la ruée se joue dans des chiffres que seuls les trésoriers voient — un haircut élargi, une maturité raccourcie de 30 jours à 1 jour, un papier non renouvelé',
      'Les victimes emblématiques : Northern Rock (septembre 2007 — tuée par son financement de marché avant ses déposants, les files ne font que constater le décès) et Bear Stearns (mars 2008 — le repo peut tuer une banque en une semaine)',
    ],
    pointsAttendusEn: [
      'The basic formula: repo funding = securities value × (1 − haircut) — 100 × (1 − 0.02) = 98 in 2006; and the implicit leverage: 2% haircut ⇒ maximum leverage 100/2 = 50',
      'The form of the run: not a refusal, a discount — the haircut goes from 2% to 25%, funding falls from 98 to 75: 23 of funding per 100 of securities evaporates, to be replaced THE SAME DAY since repo is overnight',
      'The only way out is the forced sale: raising 23 under a 5% liquidation discount requires selling 23/(1 − 0.05) = 24.2 of securities — which depresses prices, widens haircuts, and forces new sales: the liquidity spiral in a closed loop',
      'Gorton\'s formula to quote: the 2008 run was a run ON HAIRCUTS, not on the counters — repo and ABCP were the institutional world\'s deposits, deemed safe, withdrawable at will, and without federal insurance',
      'The invisibility: the run plays out in numbers only treasurers see — a widened haircut, a maturity shortened from 30 days to 1 day, unrolled paper',
      'The emblematic victims: Northern Rock (September 2007 — killed by its market funding before its depositors, the queues merely record the death) and Bear Stearns (March 2008 — repo can kill a bank in a week)',
    ],
    bonus: [
      'Le lien avec LTCM, dix ans plus tôt : les haircuts quasi nuls négociés grâce au prestige des Nobel autorisaient un levier supérieur à 50 — le haircut est le vrai régulateur du levier du système, et personne ne le supervisait',
      'La réponse réglementaire à lire en creux : les ratios de liquidité de Bâle III (LCR, NSFR) visent précisément le financement court d\'actifs longs — l\'assurance des dépôts de 1934 étendue, par la contrainte, au monde du repo',
    ],
    bonusEn: [
      'The link to LTCM, ten years earlier: the near-zero haircuts negotiated thanks to Nobel prestige allowed leverage above 50 — the haircut is the true regulator of the system\'s leverage, and nobody supervised it',
      'The regulatory answer to read between the lines: Basel III\'s liquidity ratios (LCR, NSFR) target precisely the short funding of long assets — the 1934 deposit insurance extended, through constraint, to the world of repo',
    ],
    reponseModele: `Le repo est le financement de gros du système : je dépose 100 de titres en garantie, le prêteur me finance **valeur × (1 − haircut)** — à 2 % de haircut, 98 — et garde le haircut comme coussin. Renouvelé chaque jour. Deux conséquences immédiates : un haircut de 2 % autorise un levier implicite de 100/2 = **50**, invisible dans les ratios réglementaires ; et tout le passif se replébiscite chaque matin.

Le run, quand il vient, n'a pas la forme d'un refus : le prêteur ne dit pas « non », il dit « **25 % de haircut** ». Le même portefeuille ne finance plus que 75 : ce sont **23 de financement par 100 de titres** qui s'évaporent — à trouver *le jour même*, puisque le repo est au jour le jour. La seule issue est la vente forcée : lever 23 sous une décote de liquidation de 5 % oblige à vendre 23/(1 − 0,05) = **24,2** de titres. Ces ventes dépriment les prix, donc élargissent les haircuts des autres, donc forcent de nouvelles ventes : la spirale de liquidité, en boucle fermée.

D'où la formule de **Gary Gorton**, à citer : le run de 2008 ne fut pas une ruée aux guichets — ce fut une **ruée sur les haircuts**. Le repo et l'ABCP étaient devenus les « dépôts » des institutionnels : des créances courtes, réputées sûres, retirables à volonté — mais *sans assurance fédérale*. Et cette ruée est invisible : elle se joue dans des chiffres que seuls les trésoriers voient — un haircut élargi, une maturité raccourcie de 30 jours à 1 jour, un papier non renouvelé.

Les preuves par les victimes : **Northern Rock**, septembre 2007 — tuée par son financement de *marché*, évaporé le premier ; les files de déposants n'ont fait que constater le décès. **Bear Stearns**, mars 2008 : le repo peut tuer une banque en une semaine. La chute : le système parallèle avait reconstruit la banque d'avant 1934 — même inflammabilité, sans l'extincteur.`,
    reponseModeleEn: `Repo is the system's wholesale funding: I post 100 of securities as collateral, the lender funds me **value × (1 − haircut)** — at a 2% haircut, 98 — and keeps the haircut as a cushion. Rolled every day. Two immediate consequences: a 2% haircut allows implicit leverage of 100/2 = **50**, invisible in regulatory ratios; and the whole liability side gets re-voted every morning.

The run, when it comes, does not take the form of a refusal: the lender does not say "no", it says "**25% haircut**". The same portfolio now funds only 75: that is **23 of funding per 100 of securities** evaporating — to be found *the same day*, since repo is overnight. The only way out is the forced sale: raising 23 under a 5% liquidation discount forces the sale of 23/(1 − 0.05) = **24.2** of securities. Those sales depress prices, hence widen everyone else's haircuts, hence force new sales: the liquidity spiral, in a closed loop.

Hence **Gary Gorton**'s formula, to quote: the 2008 run was not a run on the counters — it was a **run on haircuts**. Repo and ABCP had become the institutional world's "deposits": short claims, deemed safe, withdrawable at will — but *without federal insurance*. And this run is invisible: it plays out in numbers only treasurers see — a widened haircut, a maturity shortened from 30 days to 1 day, unrolled paper.

The proof by the victims: **Northern Rock**, September 2007 — killed by its *market* funding, the first to evaporate; the depositor queues merely recorded the death. **Bear Stearns**, March 2008: repo can kill a bank in a week. The punchline: the parallel system had rebuilt pre-1934 banking — same flammability, without the fire extinguisher.`,
  },
  {
    id: 'm11-j-20',
    moduleId: M11,
    theme: 'la dette souveraine et la doom loop',
    themeEn: 'sovereign debt and the doom loop',
    difficulte: 2,
    question: 'Le PSI grec de 2012 : un défaut qui ne dit pas son nom ?',
    questionEn: 'The 2012 Greek PSI: a default that dares not speak its name?',
    plan: [
      'Les faits : mars 2012, échange « volontaire » de titres sous la menace explicite qu\'il n\'y aurait pas de plan B — sur ~200 Md€ de dette privée, décote nominale de 53,5 %, perte en valeur actuelle d\'environ 75 %',
      'Trancher le débat sémantique : « Private Sector Involvement », « volontaire » — l\'euphémisme officiel ne change rien à la substance : c\'est le plus gros défaut souverain de l\'histoire, dans un pays développé de la zone euro',
      'La preuve par le marché : les CDS souverains grecs sont déclenchés — l\'assurance a fonctionné, donc le marché a bien qualifié l\'événement de crédit',
      'Les conséquences : le tabou tombé (la dette d\'un État de l\'euro peut ne pas être remboursée), la doom loop resserrée (les banques grecques gavées de dette nationale sont ruinées), et le prix réel — PIB −25 %, chômage ~27 %',
    ],
    planEn: [
      'The facts: March 2012, a "voluntary" bond exchange under the explicit threat that there was no plan B — on ~200bn€ of privately held debt, a 53.5% nominal haircut, roughly 75% loss in present value',
      'Settle the semantic debate: "Private Sector Involvement", "voluntary" — the official euphemism changes nothing of substance: it is the largest sovereign default in history, in a developed euro-area country',
      'The proof by the market: Greek sovereign CDS are triggered — the insurance worked, so the market did qualify the event as a credit event',
      'The consequences: the taboo broken (a euro state\'s debt may not be repaid), the doom loop tightened (Greek banks stuffed with national debt are ruined), and the real price — GDP −25%, unemployment ~27%',
    ],
    pointsAttendus: [
      'Les chiffres du PSI : environ 200 Md€ de dette grecque détenue par le privé, décote nominale de 53,5 %, et — en tenant compte des nouveaux taux et des nouvelles maturités — une perte en valeur actuelle d\'environ 75 %',
      'La qualification assumée : le plus gros défaut souverain de l\'histoire — et pas dans un émergent des années 80 : dans un pays développé, membre de la zone euro',
      'Le « volontaire » entre guillemets : un échange accepté sous la menace explicite qu\'il n\'y aurait pas de plan B — la contrainte fait la substance, pas le vocabulaire',
      'Le test des CDS : les CDS souverains grecs sont déclenchés — l\'assurance a fonctionné ; c\'est la preuve juridique et de marché que l\'événement de crédit a bien eu lieu',
      'La conséquence systémique : le tabou tombé — la dette d\'un État de la zone euro peut ne pas être remboursée ; et la doom loop en action : les banques grecques, gavées de dette nationale, sont ruinées par le défaut de leur propre souverain',
      'Le prix réel : PIB grec −25 % entre 2008 et 2013 — l\'ordre de grandeur de la Grande Dépression américaine —, chômage ~27 %, plus de 50 % chez les jeunes ; et le mea culpa du FMI (2013) sur les multiplicateurs sous-estimés',
    ],
    pointsAttendusEn: [
      'The PSI numbers: about 200bn€ of privately held Greek debt, a 53.5% nominal haircut, and — accounting for the new coupons and maturities — a loss in present value of about 75%',
      'The qualification owned: the largest sovereign default in history — and not in a 1980s emerging market: in a developed country, a member of the euro area',
      'The "voluntary" in quotation marks: an exchange accepted under the explicit threat that there was no plan B — the coercion makes the substance, not the vocabulary',
      'The CDS test: Greek sovereign CDS are triggered — the insurance worked; it is the legal and market proof that the credit event did happen',
      'The systemic consequence: the taboo broken — a euro-area state\'s debt may not be repaid; and the doom loop in action: Greek banks, stuffed with national debt, are ruined by their own sovereign\'s default',
      'The real price: Greek GDP −25% between 2008 and 2013 — the order of magnitude of the American Great Depression —, unemployment ~27%, above 50% among the young; and the IMF\'s 2013 mea culpa on underestimated multipliers',
    ],
    bonus: [
      'La leçon de vocabulaire financier : les euphémismes officiels (involvement, reprofilage, échange volontaire) sont des instruments de gestion de crise — ils visent à éviter les clauses de défaut croisé et la contagion ; le praticien lit la substance : une perte en valeur actuelle de 75 % est un défaut, quel que soit le communiqué',
      'Le pont avec octobre 2009 : le point de départ était déjà une affaire de sincérité — déficit révisé de ~6 % à 12,7 % (final 15,4 %) ; de la statistique falsifiée au défaut « volontaire », la crise grecque est une leçon continue sur la valeur de la parole souveraine',
    ],
    bonusEn: [
      'The financial vocabulary lesson: official euphemisms (involvement, reprofiling, voluntary exchange) are crisis-management instruments — they aim to avoid cross-default clauses and contagion; the practitioner reads the substance: a 75% present-value loss is a default, whatever the press release says',
      'The bridge to October 2009: the starting point was already a matter of sincerity — the deficit revised from ~6% to 12.7% (final 15.4%); from falsified statistics to the "voluntary" default, the Greek crisis is one continuous lesson on the value of the sovereign word',
    ],
    reponseModele: `Oui — et la réponse gagne à assumer les deux moitiés de la formule : c'est un défaut, et il ne dit pas son nom pour de bonnes raisons de gestion de crise.

**Les faits.** Mars 2012 : l'euphémisme officiel s'appelle **PSI** — *Private Sector Involvement* — un échange « volontaire » de titres, accepté sous la menace explicite qu'il n'y aurait pas de plan B. Sur environ **200 Md€** de dette grecque détenue par le privé, les créanciers subissent une décote nominale de **53,5 %** — et, en comptant les nouveaux taux et les nouvelles maturités, une perte en valeur actuelle d'environ **75 %**. C'est le **plus gros défaut souverain de l'histoire** — et il n'a pas eu lieu dans un émergent des années 80 : dans un pays développé, membre de la zone euro.

**La preuve que c'était bien un défaut** : les **CDS souverains grecs ont été déclenchés** — l'assurance a fonctionné. Le marché et le droit ont qualifié l'événement de crédit, quel que soit le vocabulaire du communiqué. La leçon de desk : les euphémismes (« involvement », « volontaire », « reprofilage ») sont des instruments de gestion de crise — le praticien lit la substance : une perte en valeur actuelle de 75 % est un défaut.

**Les conséquences.** Le tabou est tombé : la dette d'un État de l'euro peut ne pas être remboursée — les spreads de toute la périphérie doivent désormais pricer ce précédent. La doom loop joue à plein : les banques grecques, gavées de dette nationale, sont ruinées par le défaut de leur propre souverain. Et le prix réel donne l'échelle : PIB **−25 %** entre 2008 et 2013 — une Grande Dépression au sens littéral —, chômage ~27 %, plus de 50 % chez les jeunes, et le mea culpa du FMI en 2013 sur les multiplicateurs budgétaires sous-estimés. Un défaut qui ne disait pas son nom, mais dont tout le monde a payé le prix sous le sien.`,
    reponseModeleEn: `Yes — and the answer is stronger for owning both halves of the phrase: it is a default, and it dares not speak its name for legitimate crisis-management reasons.

**The facts.** March 2012: the official euphemism is called **PSI** — *Private Sector Involvement* — a "voluntary" bond exchange, accepted under the explicit threat that there was no plan B. On about **200bn€** of privately held Greek debt, creditors take a **53.5%** nominal haircut — and, counting the new coupons and maturities, a loss in present value of about **75%**. It is the **largest sovereign default in history** — and it did not happen in a 1980s emerging market: it happened in a developed country, a member of the euro area.

**The proof that it really was a default**: **Greek sovereign CDS were triggered** — the insurance worked. The market and the law qualified the credit event, whatever the press release's vocabulary. The desk lesson: euphemisms ("involvement", "voluntary", "reprofiling") are crisis-management instruments — the practitioner reads the substance: a 75% present-value loss is a default.

**The consequences.** The taboo fell: a euro state's debt may not be repaid — every peripheral spread must now price that precedent. The doom loop plays out in full: Greek banks, stuffed with national debt, are ruined by their own sovereign's default. And the real price gives the scale: GDP **−25%** between 2008 and 2013 — a Great Depression in the literal sense —, unemployment ~27%, above 50% among the young, and the IMF's 2013 mea culpa on underestimated fiscal multipliers. A default that did not speak its name — but everyone paid its price under their own.`,
  },
  {
    id: 'm11-j-21',
    moduleId: M11,
    theme: 'les crises éclair',
    themeEn: 'the flash crises',
    difficulte: 3,
    question: 'Que nous apprend l\'épisode gilts/LDI de 2022 ?',
    questionEn: 'What does the 2022 gilts/LDI episode teach us?',
    plan: [
      'La chronologie de la spirale, jambe par jambe : mini-budget Truss du 23 septembre (~45 Md£ non financés) → gilt 30 ans +130 pb en trois séances → appels de marge des fonds LDI leviérisés → ventes de gilts → hausse des taux → nouveaux appels',
      'L\'ironie centrale : la hausse des taux AMÉLIORE la solvabilité économique des fonds de pension (la valeur actualisée des engagements dégonfle) — des institutions enrichies par le choc ont failli mourir de la marge du mardi',
      'L\'intervention : la BoE, en plein resserrement et à la veille du QT, achète des gilts — treize jours ouvrés, ~19 Md£ : pompier et pyromane à la fois, le conflit assumé et borné',
      'Les leçons : la distinction liquidité/solvabilité dans sa forme la plus pure ; le levier caché dans les couvertures ; et il suffit d\'écraser la décote pour éteindre une spirale — pas d\'acheter le marché',
    ],
    planEn: [
      'The spiral\'s chronology, leg by leg: Truss mini-budget of 23 September (~£45bn unfunded) → 30-year gilt +130 bp in three sessions → margin calls on leveraged LDI funds → gilt sales → higher yields → new calls',
      'The central irony: rising yields IMPROVE pension funds\' economic solvency (the present value of liabilities deflates) — institutions enriched by the shock nearly died of Tuesday\'s margin',
      'The intervention: the BoE, mid-tightening and on the eve of QT, buys gilts — thirteen business days, ~£19bn: firefighter and arsonist at once, the conflict owned and bounded',
      'The lessons: the liquidity/solvency distinction in its purest form; leverage hidden inside hedges; and crushing the discount is enough to extinguish a spiral — no need to buy the market',
    ],
    pointsAttendus: [
      'Le choc initial : 23 septembre 2022, le mini-budget de Liz Truss — environ 45 Md£ de baisses d\'impôts non financées — fait bondir le gilt 30 ans de +130 pb en trois séances',
      'La mécanique LDI : les fonds couvrent les engagements des fonds de pension avec des gilts leviérisés (swaps, repo) — la hausse des taux déclenche des appels de marge massifs ; pour trouver le collatéral, ils vendent leur actif le plus liquide : des gilts — ce qui fait monter les taux et déclenche de nouveaux appels',
      'L\'ironie décisive : la hausse des taux améliorait la solvabilité économique des fonds de pension — pure mécanique de duration sur la valeur actualisée des engagements ; solvables, illiquides, presque morts : l\'exemple canonique de la distinction reine',
      'L\'intervention et son design : le 28 septembre, la BoE — en plein resserrement, à la veille de VENDRE des gilts au titre du QT — annonce des achats explicitement temporaires : treize jours ouvrés, ~19 Md£ utilisés ; borné pour ne pas ressembler à un financement du budget',
      'Pourquoi ça a suffi : une spirale se nourrit de la décote de vente forcée — dès qu\'un acheteur crédible l\'écrase, la boucle s\'arrête en heures ; le pompier n\'a pas besoin d\'acheter tout le marché',
      'Le bilan politique et les leçons : Truss démissionne après 44 jours ; le levier peut se cacher dans les COUVERTURES elles-mêmes, et la plomberie des appels de marge est un risque systémique à part entière',
    ],
    pointsAttendusEn: [
      'The initial shock: 23 September 2022, Liz Truss\'s mini-budget — about £45bn of unfunded tax cuts — sends the 30-year gilt up +130 bp in three sessions',
      'The LDI mechanics: the funds hedge pension schemes\' liabilities with leveraged gilts (swaps, repo) — rising yields trigger massive margin calls; to find collateral they sell their most liquid asset: gilts — which pushes yields higher and triggers new calls',
      'The decisive irony: rising yields improved pension funds\' economic solvency — pure duration mechanics on the present value of liabilities; solvent, illiquid, almost dead: the canonical example of the master distinction',
      'The intervention and its design: on 28 September, the BoE — mid-tightening, on the eve of SELLING gilts under QT — announces explicitly temporary purchases: thirteen business days, ~£19bn used; bounded so as not to look like budget financing',
      'Why it sufficed: a spiral feeds on the forced-sale discount — once a credible buyer crushes it, the loop stops within hours; the firefighter does not need to buy the whole market',
      'The political toll and the lessons: Truss resigns after 44 days; leverage can hide inside the HEDGES themselves, and margin-call plumbing is a systemic risk in its own right',
    ],
    bonus: [
      'Le paradoxe du pompier-pyromane, à nommer : la BoE combattait l\'inflation (elle montait ses taux) ET éteignait un incendie de liquidité (elle achetait des gilts longs) — deux gestes de sens opposé, assumés simultanément parce que bornés dans le temps et dans l\'objectif : stabilité financière n\'est pas politique monétaire',
      'La généralisation : après 2022, tous les régulateurs ont exigé des coussins de liquidité accrus des fonds LDI — et la question s\'étend à tout le non-bancaire : fonds ouverts, marges centralisées, hedge funds de base — le prochain gilts/LDI couve toujours là où la couverture est leviérisée',
    ],
    bonusEn: [
      'The firefighter-arsonist paradox, to name: the BoE was fighting inflation (raising rates) AND putting out a liquidity fire (buying long gilts) — two moves in opposite directions, owned simultaneously because bounded in time and in objective: financial stability is not monetary policy',
      'The generalisation: after 2022, every regulator demanded larger liquidity buffers from LDI funds — and the question extends to all non-banks: open-ended funds, centrally cleared margins, basis hedge funds — the next gilts/LDI always smoulders wherever the hedge is leveraged',
    ],
    reponseModele: `L'épisode tient en une semaine, et c'est la spirale de ventes forcées la plus pure jamais observée — un cas d'école, jambe par jambe.

**Le choc** : le 23 septembre 2022, le mini-budget de Liz Truss — environ 45 Md£ de baisses d'impôts non financées — fait bondir le gilt 30 ans de **+130 pb en trois séances**. **La marge** : les fonds LDI, qui couvrent les engagements des fonds de pension avec des gilts *leviérisés* (swaps, repo), reçoivent des appels de marge massifs. **La vente forcée** : pour trouver le collatéral, ils vendent leur actif le plus liquide — des gilts. **La re-valorisation** : ces ventes font monter les taux, qui déclenchent de nouveaux appels. La boucle est fermée ; elle tourne toute seule.

**L'ironie qui rend l'épisode si précieux** : la hausse des taux **améliorait** la solvabilité économique des fonds de pension — pure mécanique de duration, la valeur actualisée de leurs engagements dégonflait. Des institutions *enrichies* par le choc ont failli mourir de ne pas pouvoir poster la marge du mardi. **Solvables, illiquides, presque mortes** : si l'on ne retient qu'un exemple de la distinction reine, c'est celui-là.

**L'intervention** : le 28 septembre, la BoE — en plein resserrement, à la veille de *vendre* des gilts au titre du QT — annonce des achats **explicitement temporaires** : treize jours ouvrés, environ 19 Md£ utilisés. Pompier et pyromane à la fois, le conflit d'objectifs assumé et borné pour ne pas ressembler à un financement du budget. Et cela suffit : la spirale s'éteint en heures — l'acheteur en dernier ressort n'a pas besoin de tout acheter, il lui suffit d'**écraser la décote** qui alimente la boucle. Truss démissionne après 44 jours.

Les leçons : le levier peut se cacher dans les *couvertures* elles-mêmes ; la plomberie des appels de marge est un risque systémique à part entière ; et un backstop bien conçu — borné, ciblé, crédible — éteint en jours ce que l'attentisme laisserait brûler des mois.`,
    reponseModeleEn: `The episode fits in a week, and it is the purest forced-selling spiral ever observed — a textbook case, leg by leg.

**The shock**: on 23 September 2022, Liz Truss's mini-budget — about £45bn of unfunded tax cuts — sends the 30-year gilt up **+130 bp in three sessions**. **The margin**: LDI funds, which hedge pension schemes' liabilities with *leveraged* gilts (swaps, repo), receive massive margin calls. **The forced sale**: to find collateral, they sell their most liquid asset — gilts. **The revaluation**: those sales push yields higher, which triggers new calls. The loop is closed; it turns on its own.

**The irony that makes the episode so precious**: rising yields **improved** pension funds' economic solvency — pure duration mechanics, the present value of their liabilities was deflating. Institutions *enriched* by the shock nearly died of being unable to post Tuesday's margin. **Solvent, illiquid, almost dead**: if you remember only one example of the master distinction, it is this one.

**The intervention**: on 28 September, the BoE — mid-tightening, on the eve of *selling* gilts under QT — announces **explicitly temporary** purchases: thirteen business days, about £19bn used. Firefighter and arsonist at once, the conflict of objectives owned and bounded so as not to look like budget financing. And it suffices: the spiral dies within hours — the buyer of last resort does not need to buy everything, it only needs to **crush the discount** feeding the loop. Truss resigns after 44 days.

The lessons: leverage can hide inside the *hedges* themselves; margin-call plumbing is a systemic risk in its own right; and a well-designed backstop — bounded, targeted, credible — extinguishes in days what wait-and-see would let burn for months.`,
  },
  {
    id: 'm11-j-22',
    moduleId: M11,
    theme: '1987 et LTCM : quand les modèles cassent le marché',
    themeEn: '1987 and LTCM: when models break the market',
    difficulte: 2,
    question: 'Pourquoi dit-on que le smile de volatilité est né en 1987 ?',
    questionEn: 'Why do we say the volatility smile was born in 1987?',
    plan: [
      'L\'avant : la nappe de volatilité implicite des options d\'indice était à peu près plate — le monde lognormal de Black-Scholes, où toutes les options d\'une même échéance cotent la même volatilité',
      'Le choc : −22,6 % en une séance le 19 octobre 1987 — un mouvement essentiellement impossible sous l\'hypothèse lognormale : le modèle donnait à ce jour une probabilité astronomiquement faible',
      'L\'après : les puts hors de la monnaie cotent structurellement plus cher que la monnaie — le marché price la possibilité du krach en permanence : le smile est la mémoire du 19 octobre, gravée dans les prix',
      'Boucler la boucle : le krach fut CAUSÉ par la réplication d\'options (l\'assurance de portefeuille) — l\'outil de Black-Scholes a cassé son propre monde, et le smile en est la cicatrice ; le VIX (1993) en fera un thermomètre coté',
    ],
    planEn: [
      'Before: the implied volatility surface of index options was roughly flat — the Black-Scholes lognormal world, where every option of a given maturity trades at the same volatility',
      'The shock: −22.6% in one session on 19 October 1987 — a move essentially impossible under the lognormal assumption: the model gave that day an astronomically small probability',
      'After: out-of-the-money puts trade structurally richer than at-the-money — the market prices the possibility of a crash permanently: the smile is the memory of 19 October, engraved in prices',
      'Close the loop: the crash was CAUSED by option replication (portfolio insurance) — the Black-Scholes toolkit broke its own world, and the smile is the scar; the VIX (1993) would turn it into a quoted thermometer',
    ],
    pointsAttendus: [
      'L\'état antérieur : avant octobre 1987, la nappe de volatilité implicite des options d\'indice était à peu près plate — cohérente avec le monde lognormal de Black-Scholes',
      'Le choc statistique : −22,6 % en une séance est un événement auquel la lognormale calibrée sur les données d\'avant donnait une probabilité astronomiquement faible — le marché a constaté que les queues de distribution réelles sont épaisses',
      'La forme née du choc : les puts hors de la monnaie cotent depuis structurellement plus cher que la monnaie — payer plus de volatilité implicite pour les strikes bas, c\'est payer l\'assurance contre le scénario de krach',
      'La lecture profonde : le smile est de l\'information — la densité risque-neutre que le marché price a une queue gauche épaisse ; le smile est la mémoire du marché, gravée dans les prix en permanence depuis 1987',
      'La boucle causale qui fait la grande copie : le krach a été causé par la réplication delta de puts synthétiques (l\'assurance de portefeuille) — la stratégie issue de Black-Scholes a invalidé l\'hypothèse de Black-Scholes (liquidité continue), et le marché des options en porte la cicatrice',
      'La postérité : le VIX, créé en 1993, transforme cette mémoire en thermomètre coté — et tout pricing d\'options d\'indice depuis 1987 doit composer avec le smile (modèles à volatilité locale ou stochastique)',
    ],
    pointsAttendusEn: [
      'The prior state: before October 1987, the implied volatility surface of index options was roughly flat — consistent with the Black-Scholes lognormal world',
      'The statistical shock: −22.6% in one session is an event to which the lognormal calibrated on prior data gave an astronomically small probability — the market learned that real tails are fat',
      'The shape born of the shock: out-of-the-money puts have since traded structurally richer than at-the-money — paying more implied volatility for low strikes is paying insurance against the crash scenario',
      'The deep reading: the smile is information — the risk-neutral density the market prices has a fat left tail; the smile is the market\'s memory, permanently engraved in prices since 1987',
      'The causal loop that makes a great answer: the crash was caused by delta replication of synthetic puts (portfolio insurance) — the strategy born of Black-Scholes invalidated the Black-Scholes assumption (continuous liquidity), and the options market carries the scar',
      'The posterity: the VIX, created in 1993, turns that memory into a quoted thermometer — and all index option pricing since 1987 has had to accommodate the smile (local or stochastic volatility models)',
    ],
    bonus: [
      'La formulation d\'oral qui condense : « avant 1987, le marché croyait Black-Scholes ; depuis, il le corrige » — le smile n\'est pas un défaut du marché, c\'est le prix de la leçon apprise le 19 octobre : les krachs existent, les queues sont épaisses, et l\'assurance contre le pire vaut une prime permanente',
      'La rime avec le module : chaque outil du métier porte une cicatrice — le smile pour le 19 octobre 1987, les circuit breakers pour la même journée, la VaR stressée pour 1998 et 2008 : les prix d\'options sont de l\'histoire condensée',
    ],
    bonusEn: [
      'The condensing oral phrasing: "before 1987, the market believed Black-Scholes; ever since, it has been correcting it" — the smile is not a market defect, it is the price of the lesson learned on 19 October: crashes exist, tails are fat, and insurance against the worst is worth a permanent premium',
      'The rhyme with the module: every tool of the trade carries a scar — the smile for 19 October 1987, circuit breakers for the same day, stressed VaR for 1998 and 2008: option prices are condensed history',
    ],
    reponseModele: `Parce qu'avant octobre 1987, le smile n'existait pas — et que depuis, il n'a jamais disparu.

**L'avant.** La nappe de volatilité implicite des options d'indice était à peu près **plate** : toutes les options d'une même échéance cotaient à peu près la même volatilité, quel que soit le strike — exactement ce que prédit le monde lognormal de Black-Scholes. Le marché croyait son modèle.

**Le choc.** Le 19 octobre 1987, le Dow perd **−22,6 % en une séance**. Sous l'hypothèse lognormale calibrée sur les données d'avant, un tel mouvement avait une probabilité astronomiquement faible — l'événement « ne pouvait pas arriver ». Il est arrivé. Le marché a appris, en un jour, que les queues de distribution réelles sont **épaisses**.

**L'après.** Depuis, les puts hors de la monnaie cotent **structurellement plus cher** que la monnaie : payer plus de volatilité implicite pour les strikes bas, c'est payer l'assurance contre le scénario de krach — en permanence, dans chaque nappe. Le smile est de l'information : la densité que le marché price a une queue gauche épaisse. C'est **la mémoire du 19 octobre, gravée dans les prix** — et le VIX, créé en 1993, en fera un thermomètre coté.

**La boucle qui fait la grande copie** : le krach lui-même a été *causé* par la réplication d'options — l'assurance de portefeuille, du delta-hedging de puts synthétiques à l'échelle de 60-90 Md$. La stratégie issue de Black-Scholes a invalidé l'hypothèse de Black-Scholes — la liquidité continue — en la surchargeant. L'outil a cassé son propre monde, et le marché des options en porte la cicatrice depuis. La formule pour conclure : avant 1987, le marché croyait Black-Scholes ; depuis, il le corrige — le smile est le prix, jamais remboursé, de la leçon.`,
    reponseModeleEn: `Because before October 1987 the smile did not exist — and since then it has never gone away.

**Before.** The implied volatility surface of index options was roughly **flat**: every option of a given maturity traded at about the same volatility, whatever the strike — exactly what the Black-Scholes lognormal world predicts. The market believed its model.

**The shock.** On 19 October 1987, the Dow loses **−22.6% in one session**. Under the lognormal assumption calibrated on prior data, such a move had an astronomically small probability — the event "could not happen". It happened. The market learned, in a day, that real tails are **fat**.

**After.** Ever since, out-of-the-money puts have traded **structurally richer** than at-the-money: paying more implied volatility for low strikes is paying insurance against the crash scenario — permanently, in every surface. The smile is information: the density the market prices has a fat left tail. It is **the memory of 19 October, engraved in prices** — and the VIX, created in 1993, would turn it into a quoted thermometer.

**The loop that makes a great answer**: the crash itself was *caused* by option replication — portfolio insurance, delta-hedging of synthetic puts at the scale of 60-90bn$. The strategy born of Black-Scholes invalidated the Black-Scholes assumption — continuous liquidity — by overloading it. The tool broke its own world, and the options market has carried the scar ever since. The closing formula: before 1987, the market believed Black-Scholes; ever since, it has been correcting it — the smile is the never-refunded price of the lesson.`,
  },
  {
    id: 'm11-j-23',
    moduleId: M11,
    theme: 'les leçons transversales',
    themeEn: 'cross-cutting lessons',
    difficulte: 1,
    question: 'Citez trois cicatrices institutionnelles laissées par les crises, et leur crise d\'origine.',
    questionEn: 'Name three institutional scars left by crises, and the crisis each came from.',
    plan: [
      'Annoncer le principe avant la liste : la crise révèle le trou institutionnel, l\'institution naît du trou — chaque règle du métier a un certificat de naissance daté d\'une catastrophe',
      'En choisir trois et les dater : la Fed (1913, née de la panique de 1907) ; la FDIC, la SEC et Glass-Steagall (1933-34, nés de 1929-1933) ; les circuit breakers et le smile de volatilité (nés du 19 octobre 1987)',
      'Élargir d\'une phrase pour montrer la profondeur du banc : Sarbanes-Oxley (Enron-WorldCom), Dodd-Frank/Bâle III/EMIR (2008), MES/union bancaire/OMT (2010-2012)',
      'Refermer sur la nuance : les cicatrices se rouvrent — Glass-Steagall abrogé en 1999, règle Volcker en 2010 : chaque crise rejoue le débat',
    ],
    planEn: [
      'State the principle before the list: the crisis reveals the institutional hole, the institution is born from the hole — every rule of the trade has a birth certificate dated to a catastrophe',
      'Pick three and date them: the Fed (1913, born of the 1907 panic); the FDIC, the SEC and Glass-Steagall (1933-34, born of 1929-1933); circuit breakers and the volatility smile (born of 19 October 1987)',
      'Widen by one sentence to show bench depth: Sarbanes-Oxley (Enron-WorldCom), Dodd-Frank/Basel III/EMIR (2008), ESM/banking union/OMT (2010-2012)',
      'Close on the nuance: scars reopen — Glass-Steagall repealed in 1999, Volcker rule in 2010: every crisis replays the debate',
    ],
    pointsAttendus: [
      'Le schéma générateur, énoncé avant les exemples : la crise révèle le trou institutionnel, l\'institution naît du trou',
      '1907 → la Fed (1913) : une économie de la taille des États-Unis ne peut pas suspendre son système de paiement au bon vouloir d\'un homme de 70 ans — le prêteur en dernier ressort institutionnalisé',
      '1929-1933 → FDIC (la ruée devient irrationnelle : l\'équilibre de panique supprimé sans dépenser un dollar en temps normal), SEC (transparence, répression des manipulations, encadrement de la marge), Glass-Steagall (séparer dépôts et spéculation)',
      '19 octobre 1987 → les circuit breakers (réponse de microstructure aux ventes programmées) et le smile de volatilité (la mémoire du krach pricée en permanence — une cicatrice gravée dans les prix, pas dans la loi)',
      'Le banc de touche à mentionner d\'une phrase : Sarbanes-Oxley 2002 (certification personnelle des comptes après Enron-WorldCom), Dodd-Frank/Bâle III/EMIR (2008), MES/union bancaire/OMT (2010-2012)',
      'La nuance finale : les cicatrices ne sont pas des monuments — Glass-Steagall, abrogé en 1999 (Gramm-Leach-Bliley), renaît en miniature dans la règle Volcker de 2010 : elles se rouvrent, se referment, et chaque crise rejoue le débat',
    ],
    pointsAttendusEn: [
      'The generating pattern, stated before the examples: the crisis reveals the institutional hole, the institution is born from the hole',
      '1907 → the Fed (1913): an economy the size of the United States cannot hang its payment system on the goodwill of one 70-year-old man — the lender of last resort institutionalised',
      '1929-1933 → FDIC (the run becomes irrational: the panic equilibrium removed without spending a dollar in normal times), SEC (transparency, anti-manipulation, margin rules), Glass-Steagall (separating deposits from speculation)',
      '19 October 1987 → circuit breakers (a microstructure answer to programmed selling) and the volatility smile (the crash\'s memory priced permanently — a scar engraved in prices, not in law)',
      'The bench to mention in one sentence: Sarbanes-Oxley 2002 (personal certification of accounts after Enron-WorldCom), Dodd-Frank/Basel III/EMIR (2008), ESM/banking union/OMT (2010-2012)',
      'The final nuance: scars are not monuments — Glass-Steagall, repealed in 1999 (Gramm-Leach-Bliley), is reborn in miniature in the 2010 Volcker rule: they reopen, close again, and every crisis replays the debate',
    ],
    bonus: [
      'La cicatrice la plus originale à signaler : le smile de volatilité n\'est ni une loi ni une agence — c\'est une cicatrice logée dans les PRIX : le marché lui-même a institutionnalisé la mémoire du 19 octobre 1987 ; les institutions ne sont pas toutes publiques',
      'L\'exemple le plus pur d\'institution qui supprime une crise sans la combattre : la FDIC — en garantissant les dépôts, elle rend la ruée irrationnelle et l\'équilibre de panique disparaît ; limite à connaître : au-dessus du plafond, la ruée redevient rationnelle — SVB, mars 2023, plus de 90 % de dépôts non assurés',
    ],
    bonusEn: [
      'The most original scar to flag: the volatility smile is neither a law nor an agency — it is a scar lodged in PRICES: the market itself institutionalised the memory of 19 October 1987; not all institutions are public ones',
      'The purest example of an institution removing a crisis without fighting it: the FDIC — by guaranteeing deposits, it makes the run irrational and the panic equilibrium disappears; the limit to know: above the cap, the run becomes rational again — SVB, March 2023, over 90% of deposits uninsured',
    ],
    reponseModele: `Le principe d'abord, car il vaut plus que la liste : **la crise révèle le trou institutionnel, l'institution naît du trou** — chaque règle du métier a un certificat de naissance daté d'une catastrophe. Trois exemples, trois époques.

**1907 → la Fed (1913).** La panique des trusts est éteinte par un homme privé de 70 ans, J.P. Morgan, qui trie les solvables dans sa bibliothèque. La leçon fait consensus : une économie de cette taille ne peut pas suspendre son système de paiement au bon vouloir d'un individu — le Federal Reserve Act institutionnalise le prêteur en dernier ressort.

**1929-1933 → FDIC, SEC, Glass-Steagall.** Neuf mille banques mortes sans assurance des dépôts : la **FDIC** rend la ruée *irrationnelle* — l'équilibre de panique disparaît sans coûter un dollar en temps normal, l'exemple le plus pur d'une institution qui supprime une crise en changeant les incitations. La **SEC** impose la transparence et encadre la marge ; **Glass-Steagall** sépare les dépôts de la spéculation.

**19 octobre 1987 → les circuit breakers et le smile.** Les coupe-circuits répondent en microstructure aux ventes programmées. Et la cicatrice la plus originale n'est ni une loi ni une agence : le **smile de volatilité** — depuis 1987, les puts hors de la monnaie cotent structurellement plus cher ; la mémoire du krach est gravée dans les *prix*. Toutes les institutions ne sont pas publiques.

Le banc est profond — Sarbanes-Oxley après Enron, Dodd-Frank/Bâle III/EMIR après 2008, MES/union bancaire/OMT après 2010-2012 — et la nuance qui referme : les cicatrices ne sont pas des monuments. Glass-Steagall, abrogé en 1999, renaît en miniature dans la règle Volcker de 2010. Elles se rouvrent, se referment — chaque crise rejoue le débat.`,
    reponseModeleEn: `The principle first, because it is worth more than the list: **the crisis reveals the institutional hole, the institution is born from the hole** — every rule of the trade has a birth certificate dated to a catastrophe. Three examples, three eras.

**1907 → the Fed (1913).** The trust panic is extinguished by a private 70-year-old man, J.P. Morgan, sorting the solvent in his library. The lesson is consensual: an economy of that size cannot hang its payment system on one individual's goodwill — the Federal Reserve Act institutionalises the lender of last resort.

**1929-1933 → FDIC, SEC, Glass-Steagall.** Nine thousand banks dead with no deposit insurance: the **FDIC** makes the run *irrational* — the panic equilibrium disappears without costing a dollar in normal times, the purest example of an institution removing a crisis by changing incentives. The **SEC** imposes transparency and regulates margin; **Glass-Steagall** separates deposits from speculation.

**19 October 1987 → circuit breakers and the smile.** The breakers answer programmed selling at the microstructure level. And the most original scar is neither a law nor an agency: the **volatility smile** — since 1987, out-of-the-money puts have traded structurally richer; the crash's memory is engraved in *prices*. Not all institutions are public ones.

The bench is deep — Sarbanes-Oxley after Enron, Dodd-Frank/Basel III/EMIR after 2008, ESM/banking union/OMT after 2010-2012 — and the closing nuance: scars are not monuments. Glass-Steagall, repealed in 1999, is reborn in miniature in the 2010 Volcker rule. They reopen, they close — every crisis replays the debate.`,
  },
  {
    id: 'm11-j-24',
    moduleId: M11,
    theme: 'la grammaire des crises',
    themeEn: 'the grammar of crises',
    difficulte: 3,
    question: 'Un fonds au levier 25 perd 3 % sur ses actifs ; la décote de liquidation est de 2 %. Survit-il ? Raisonnez à voix haute.',
    questionEn: 'A fund levered 25× loses 3% on its assets; the liquidation discount is 2%. Does it survive? Reason out loud.',
    plan: [
      'Étape 1, le choc : ΔFP % = levier × Δactifs % = 25 × (−3) = −75 % — les fonds propres passent de 100 à 25 ; le fonds SURVIT au choc (la mort directe était à −100/25 = −4 %)',
      'Étape 2, le levier après choc : actifs 2 425 pour 25 de fonds propres — levier 97 ; le prêteur exige le retour à 25 : il faut vendre',
      'Étape 3, la vente : S = (A − λE)/(1 − λd) avec 1 − λd = 1 − 25 × 0,02 = 0,5 — S = (2 425 − 625)/0,5 = 3 600 : le DOUBLE de l\'excès apparent, et plus que le book entier (2 425)',
      'Conclusion : vendre tout le book coûte 2 425 × 2 % = 48,5 de décote pour 25 de fonds propres restants — le fonds survit au choc et meurt de la vente ; seules sorties : un prêteur patient ou un backstop qui écrase la décote — c\'est LTCM',
    ],
    planEn: [
      'Step 1, the shock: Δequity % = leverage × Δassets % = 25 × (−3) = −75% — equity goes from 100 to 25; the fund SURVIVES the shock (direct death was at −100/25 = −4%)',
      'Step 2, post-shock leverage: assets 2,425 on 25 of equity — leverage 97; the lender demands a return to 25: it must sell',
      'Step 3, the sale: S = (A − λE)/(1 − λd) with 1 − λd = 1 − 25 × 0.02 = 0.5 — S = (2,425 − 625)/0.5 = 3,600: DOUBLE the apparent excess, and more than the entire book (2,425)',
      'Conclusion: selling the whole book costs 2,425 × 2% = 48.5 of discount against 25 of remaining equity — the fund survives the shock and dies of the sale; the only exits: a patient lender or a backstop that crushes the discount — this is LTCM',
    ],
    pointsAttendus: [
      'Poser le bilan de départ : 2 500 d\'actifs, 100 de fonds propres, 2 400 de dette (levier 25) — et vérifier la distance à la mort : −100/25 = −4 % ; le choc de −3 % ne tue donc PAS directement',
      'Le choc : perte = 3 % × 2 500 = 75, absorbée en totalité par les fonds propres — FP = 25, actifs = 2 425, dette inchangée à 2 400 ; ΔFP = 25 × (−3 %) = −75 %',
      'Le levier a bondi : 2 425/25 = 97 — c\'est la mécanique perverse : le choc fait MONTER le levier au pire moment, et le prêteur exige le retour à la cible',
      'La vente requise : S = (A − λE)/(1 − λd) = (2 425 − 25 × 25)/(1 − 25 × 0,02) = 1 800/0,5 = 3 600 — le dénominateur 0,5 double la vente ; or le book entier ne vaut que 2 425 : la cible est inatteignable',
      'La vérification par l\'absurde : vendre TOUT le book coûte 2 425 × 2 % = 48,5 de décote — presque le double des 25 de fonds propres restants : le fonds meurt DE LA VENTE, pas du choc',
      'La conclusion à formuler : survivant au choc, mort par le désendettement — sauf si le prêteur suspend l\'appel ou si un backstop écrase la décote ; c\'est exactement LTCM en septembre 1998 : le consortium a existé parce que la liquidation aurait tué tout le monde',
    ],
    pointsAttendusEn: [
      'Set up the starting balance sheet: 2,500 of assets, 100 of equity, 2,400 of debt (25× leverage) — and check the distance to death: −100/25 = −4%; the −3% shock therefore does NOT kill directly',
      'The shock: loss = 3% × 2,500 = 75, absorbed entirely by equity — equity = 25, assets = 2,425, debt unchanged at 2,400; Δequity = 25 × (−3%) = −75%',
      'Leverage has jumped: 2,425/25 = 97 — the perverse mechanics: the shock RAISES leverage at the worst moment, and the lender demands a return to target',
      'The required sale: S = (A − λE)/(1 − λd) = (2,425 − 25 × 25)/(1 − 25 × 0.02) = 1,800/0.5 = 3,600 — the 0.5 denominator doubles the sale; yet the entire book is only worth 2,425: the target is unreachable',
      'The check by absurdity: selling the WHOLE book costs 2,425 × 2% = 48.5 of discount — nearly double the 25 of remaining equity: the fund dies OF THE SALE, not of the shock',
      'The conclusion to state: survives the shock, dies of the deleveraging — unless the lender suspends the call or a backstop crushes the discount; this is exactly LTCM in September 1998: the consortium existed because liquidation would have killed everyone',
    ],
    bonus: [
      'La zone de mort à nommer : ici λd = 25 × 0,02 = 0,5 < 1 — la formule reste positive, et pourtant le fonds meurt quand même car S dépasse le book : la zone de mort formelle (λd ≥ 1) n\'est que le cas extrême — bien avant elle, le désendettement peut être arithmétiquement possible et physiquement impossible',
      'Le message de politique : le pompier n\'a pas besoin d\'acheter les 3 600 — il lui suffit d\'écraser la décote d : à d ≈ 0, la vente requise retombe à 1 800, réalisable ; c\'est exactement ce que la BoE a fait sur les gilts en 2022 avec ~19 Md£ seulement',
    ],
    bonusEn: [
      'The death zone to name: here λd = 25 × 0.02 = 0.5 < 1 — the formula stays positive, and yet the fund still dies because S exceeds the book: the formal death zone (λd ≥ 1) is only the extreme case — well before it, deleveraging can be arithmetically possible and physically impossible',
      'The policy message: the firefighter need not buy the 3,600 — it only needs to crush the discount d: at d ≈ 0, the required sale falls back to 1,800, feasible; exactly what the BoE did on gilts in 2022 with only ~£19bn',
    ],
    reponseModele: `À voix haute, en trois étapes — et la réponse est subtile : il survit au choc, et meurt de la vente.

**Étape 1 — le choc.** Bilan de départ : 2 500 d'actifs, 100 de fonds propres, 2 400 de dette. La distance à la mort d'un levier 25 est −100/25 = **−4 %** : le choc de −3 % ne tue donc pas directement. La perte : 3 % × 2 500 = 75, absorbée en totalité par les fonds propres — ΔFP = 25 × (−3 %) = **−75 %**. Il reste 25 de fonds propres pour 2 425 d'actifs.

**Étape 2 — le levier a bondi.** 2 425/25 = **97**. C'est la mécanique perverse : le choc fait *monter* le levier au pire moment — et le prêteur exige le retour à la cible de 25. Il faut vendre.

**Étape 3 — la vente impossible.** La vente requise vaut S = (A − λE)/(1 − λd). Le dénominateur : 1 − 25 × 0,02 = **0,5** — chaque euro vendu ne désendette qu'à moitié, car la décote détruit des fonds propres en route. Donc S = (2 425 − 625)/0,5 = **3 600** : le *double* de l'excès apparent — et plus que le book entier, qui ne vaut que 2 425. La cible est inatteignable. Vérification par l'absurde : vendre **tout** coûte 2 425 × 2 % = 48,5 de décote, pour 25 de fonds propres restants — mort avant la fin de la liquidation.

**Conclusion.** Le fonds survit au choc et **meurt du désendettement** — sauf si le prêteur suspend l'appel, ou si un backstop écrase la décote : à d ≈ 0, la vente requise retombe à 1 800, réalisable. C'est très exactement LTCM en septembre 1998 : le choc n'avait pas tué le fonds, la liquidation forcée aurait tué tout le monde — d'où le consortium. Et c'est le message du pompier moderne : il n'achète pas le marché, il écrase la décote.`,
    reponseModeleEn: `Out loud, in three steps — and the answer is subtle: it survives the shock, and dies of the sale.

**Step 1 — the shock.** Starting balance sheet: 2,500 of assets, 100 of equity, 2,400 of debt. The distance to death at 25× leverage is −100/25 = **−4%**: the −3% shock therefore does not kill directly. The loss: 3% × 2,500 = 75, absorbed entirely by equity — Δequity = 25 × (−3%) = **−75%**. There remain 25 of equity against 2,425 of assets.

**Step 2 — leverage has jumped.** 2,425/25 = **97**. That is the perverse mechanism: the shock *raises* leverage at the worst moment — and the lender demands a return to the 25 target. It must sell.

**Step 3 — the impossible sale.** The required sale is S = (A − λE)/(1 − λd). The denominator: 1 − 25 × 0.02 = **0.5** — each euro sold only deleverages by half, because the discount destroys equity along the way. So S = (2,425 − 625)/0.5 = **3,600**: *double* the apparent excess — and more than the entire book, worth only 2,425. The target is unreachable. Check by absurdity: selling **everything** costs 2,425 × 2% = 48.5 of discount, against 25 of remaining equity — dead before the liquidation ends.

**Conclusion.** The fund survives the shock and **dies of the deleveraging** — unless the lender suspends the call, or a backstop crushes the discount: at d ≈ 0, the required sale falls back to 1,800, feasible. That is exactly LTCM in September 1998: the shock had not killed the fund, forced liquidation would have killed everyone — hence the consortium. And that is the modern firefighter's message: it does not buy the market, it crushes the discount.`,
  },
  {
    id: 'm11-j-25',
    moduleId: M11,
    theme: 'la grammaire des crises',
    themeEn: 'the grammar of crises',
    difficulte: 2,
    question: 'Après −60 %, combien faut-il gagner pour revenir au point de départ ? Et pourquoi votre grand-mère a-t-elle raison de dire qu\'il ne faut pas perdre d\'argent ?',
    questionEn: 'After −60%, how much do you need to gain to get back to where you started? And why is your grandmother right to say you should not lose money?',
    plan: [
      'Le calcul mental : après −60 %, il reste 40 — pour revenir à 100, il faut ×2,5, soit +150 % ; formule générale : gain requis = 100/(100 − perte) − 1',
      'La convexité : la fonction explose — −50 % exige +100 %, −78 % (Nasdaq) exige +354,5 %, −89 % (Dow 1932) exige +809 % ; la symétrie naïve est LE piège d\'arithmétique d\'entretien',
      'Le corollaire temporel : à 7 %/an, récupérer −60 % prend ln(2,5)/ln(1,07) ≈ 13,5 ans — les grandes pertes se paient en décennies, pas en pourcentages',
      'La grand-mère et Buffett : règle n° 1, ne pas perdre d\'argent ; règle n° 2, ne pas oublier la règle n° 1 — la sagesse populaire encode la convexité : éviter les grandes pertes vaut mathématiquement mieux que chasser les grands gains',
    ],
    planEn: [
      'The mental arithmetic: after −60%, 40 remains — to get back to 100 you need ×2.5, i.e. +150%; general formula: required gain = 100/(100 − loss) − 1',
      'The convexity: the function explodes — −50% requires +100%, −78% (Nasdaq) requires +354.5%, −89% (1932 Dow) requires +809%; naive symmetry is THE interview arithmetic trap',
      'The time corollary: at 7%/year, recovering −60% takes ln(2.5)/ln(1.07) ≈ 13.5 years — large losses are paid in decades, not percentages',
      'Grandmother and Buffett: rule no. 1, never lose money; rule no. 2, never forget rule no. 1 — folk wisdom encodes the convexity: avoiding large losses is mathematically worth more than chasing large gains',
    ],
    pointsAttendus: [
      'Le calcul juste et rapide : il reste 40 sur 100 ; revenir à 100 exige de multiplier par 100/40 = 2,5 — soit +150 % ; formule générale : gain requis = 100/(100 − perte) − 1',
      'Le piège à désamorcer explicitement : la symétrie naïve — croire qu\'après −60 % il suffit de +60 % laisse à 40 × 1,6 = 64, soit −36 % du compte',
      'La convexité, avec ses jalons du module : −22,6 % (1987) exige +29,2 % ; −50 % exige +100 % ; −60 % exige +150 % ; −78 % (Nasdaq 2000-2002) exige +354,5 % ; −89 % (Dow 1929-1932) exige +809 %',
      'Le corollaire temporel : années = ln(1/(1 − perte))/ln(1 + g) — à 7 %/an, −60 % coûte ln(2,5)/ln(1,07) ≈ 13,5 ans ; d\'où les 25 ans du Dow et les 15 ans du Nasdaq',
      'La traduction de la sagesse populaire : la grand-mère (et Buffett — règle n° 1 : ne jamais perdre d\'argent ; règle n° 2 : ne jamais oublier la règle n° 1) encode la convexité — les pertes coûtent plus qu\'elles ne pèsent, donc éviter les grandes pertes domine la chasse aux grands gains',
      'La conséquence de gestion : le contrôle du drawdown n\'est pas de la prudence décorative — c\'est de l\'arithmétique ; la survie d\'abord, la performance ensuite (le pendant de la leçon LTCM : être mort avant d\'avoir raison)',
    ],
    pointsAttendusEn: [
      'The correct, fast calculation: 40 out of 100 remains; getting back to 100 requires multiplying by 100/40 = 2.5 — i.e. +150%; general formula: required gain = 100/(100 − loss) − 1',
      'The trap to defuse explicitly: naive symmetry — believing that after −60% you only need +60% leaves you at 40 × 1.6 = 64, i.e. −36% of the account',
      'The convexity, with the module\'s milestones: −22.6% (1987) requires +29.2%; −50% requires +100%; −60% requires +150%; −78% (Nasdaq 2000-2002) requires +354.5%; −89% (Dow 1929-1932) requires +809%',
      'The time corollary: years = ln(1/(1 − loss))/ln(1 + g) — at 7%/year, −60% costs ln(2.5)/ln(1.07) ≈ 13.5 years; hence the Dow\'s 25 years and the Nasdaq\'s 15',
      'The translation of folk wisdom: grandmother (and Buffett — rule no. 1: never lose money; rule no. 2: never forget rule no. 1) encodes the convexity — losses cost more than they weigh, so avoiding large losses dominates chasing large gains',
      'The management consequence: drawdown control is not decorative prudence — it is arithmetic; survival first, performance second (the twin of the LTCM lesson: dead before being right)',
    ],
    bonus: [
      'La démonstration en une ligne qui scelle l\'argument : un portefeuille qui fait +60 % puis −60 % finit à 1,6 × 0,4 = 0,64 — l\'ordre ne change rien, la perte gagne toujours : la moyenne arithmétique des rendements (0 %) ment, seule la moyenne géométrique paie',
      'Le pont avec le levier : le levier augmente l\'espérance ET la probabilité de la grande perte — or la convexité fait payer la grande perte plus que proportionnellement : c\'est le fondement arithmétique commun de la prudence de la grand-mère et de la mort de LTCM',
    ],
    bonusEn: [
      'The one-line demonstration that seals the argument: a portfolio doing +60% then −60% ends at 1.6 × 0.4 = 0.64 — order does not matter, the loss always wins: the arithmetic mean of returns (0%) lies, only the geometric mean pays',
      'The bridge to leverage: leverage raises the expectation AND the probability of the large loss — and convexity makes the large loss cost more than proportionally: the common arithmetic foundation of grandmother\'s prudence and LTCM\'s death',
    ],
    reponseModele: `Le calcul d'abord, de tête : après −60 %, il reste **40**. Pour revenir à 100, il faut multiplier par 100/40 = 2,5 — soit **+150 %**. La formule générale : gain requis = 100/(100 − perte) − 1. Et le piège à désamorcer soi-même : la symétrie naïve — croire qu'il suffit de +60 % laisse à 40 × 1,6 = 64, soit toujours −36 % du compte.

Le point structurel : cette fonction est **convexe**, et elle explose. Les jalons du module : −22,6 % (le lundi noir de 1987) n'exige que +29,2 % ; −50 % exige +100 % ; −60 % exige +150 % ; −78 % (le Nasdaq de 2000-2002) exige +354,5 % ; −89 % (le Dow de 1932) exige **+809 %**. Le corollaire temporel donne l'échelle du deuil : à 7 % par an, récupérer −60 % prend ln(2,5)/ln(1,07) ≈ **13,5 ans** — d'où les 25 ans du Dow et les 15 ans du Nasdaq : les grandes pertes se paient en décennies.

**Et la grand-mère ?** Elle a mathématiquement raison — comme Buffett : règle n° 1, ne jamais perdre d'argent ; règle n° 2, ne jamais oublier la règle n° 1. Ce n'est pas de la frilosité, c'est de la **convexité** : les pertes coûtent plus qu'elles ne pèsent, donc éviter les grandes pertes domine la chasse aux grands gains. La démonstration en une ligne : un portefeuille qui fait +60 % puis −60 % finit à 1,6 × 0,4 = **0,64** — l'ordre ne change rien, la perte gagne toujours ; la moyenne arithmétique (0 %) ment, seule la géométrique paie.

La conséquence de gestion, pour conclure : le contrôle du drawdown n'est pas de la prudence décorative, c'est de l'arithmétique — la survie d'abord, la performance ensuite. C'est la même leçon que LTCM, vue du côté défensif : dans ce métier, on ne peut avoir raison à terme que si l'on est encore là à terme.`,
    reponseModeleEn: `The calculation first, in your head: after −60%, **40** remains. To get back to 100 you must multiply by 100/40 = 2.5 — that is **+150%**. The general formula: required gain = 100/(100 − loss) − 1. And the trap to defuse unprompted: naive symmetry — believing +60% is enough leaves you at 40 × 1.6 = 64, still −36% of the account.

The structural point: this function is **convex**, and it explodes. The module's milestones: −22.6% (Black Monday 1987) requires only +29.2%; −50% requires +100%; −60% requires +150%; −78% (the 2000-2002 Nasdaq) requires +354.5%; −89% (the 1932 Dow) requires **+809%**. The time corollary gives the scale of the mourning: at 7% a year, recovering −60% takes ln(2.5)/ln(1.07) ≈ **13.5 years** — hence the Dow's 25 years and the Nasdaq's 15: large losses are paid in decades.

**And grandmother?** She is mathematically right — like Buffett: rule no. 1, never lose money; rule no. 2, never forget rule no. 1. It is not timidity, it is **convexity**: losses cost more than they weigh, so avoiding large losses dominates chasing large gains. The one-line demonstration: a portfolio doing +60% then −60% ends at 1.6 × 0.4 = **0.64** — order does not matter, the loss always wins; the arithmetic mean (0%) lies, only the geometric one pays.

The management consequence, to conclude: drawdown control is not decorative prudence, it is arithmetic — survival first, performance second. It is the LTCM lesson seen from the defensive side: in this business, you can only be right eventually if you are still there eventually.`,
  },
];
