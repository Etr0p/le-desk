import type { JuryQuestion } from '../../../engine/types';

const M6 = '06-change-commos-crypto';

export const jury: JuryQuestion[] = [
  {
    id: 'm6-j-01',
    moduleId: M6,
    theme: 'le marché des changes',
    themeEn: 'the FX market',
    difficulte: 1,
    question: "EUR/USD cote 1,10. Le cours passe à 1,15 : qui s'apprécie ?",
    questionEn: 'EUR/USD is quoted at 1.10. The rate moves to 1.15: which currency appreciates?',
    plan: [
      'Verrouiller la convention : BASE/COTÉE, le cours est le prix d\'une unité de base en devise cotée',
      'Appliquer : 1 euro achète 1,15 dollar au lieu de 1,10 — l\'euro s\'apprécie, le dollar se déprécie',
      'Désamorcer le piège : « le chiffre du dollar a monté » ne veut rien dire',
      'Donner le réflexe : la hausse du cours est toujours une appréciation de la base',
    ],
    planEn: [
      'Lock the convention: BASE/QUOTED, the rate is the price of one unit of the base in the quoted currency',
      'Apply it: 1 euro buys 1.15 dollars instead of 1.10 — the euro appreciates, the dollar depreciates',
      'Defuse the trap: "the dollar number went up" means nothing',
      'Give the reflex: a rising rate is always an appreciation of the base',
    ],
    pointsAttendus: [
      'Une paire se note BASE/COTÉE : le cours est le prix d\'une unité de la devise de base, exprimé en devise cotée',
      "À 1,15, 1 euro achète 1,15 dollar contre 1,10 avant : c'est l'euro — la base — qui s'apprécie, d'environ 4,5 %",
      'Le dollar — la cotée — se déprécie symétriquement, alors même que « son chiffre » a monté : le piège de lecture n° 1 du change',
      'Contre-exemple de contrôle : USD/JPY qui passe de 150 à 155, c\'est un dollar plus fort, car le dollar y est la devise de base',
      "Le réflexe d'oral : reformuler tout cours comme « prix d'une unité de BASE en COTÉE » avant de conclure quoi que ce soit",
    ],
    pointsAttendusEn: [
      'A pair is written BASE/QUOTED: the rate is the price of one unit of the base currency, expressed in the quoted currency',
      'At 1.15, 1 euro buys 1.15 dollars versus 1.10 before: it is the euro — the base — that appreciates, by roughly 4.5%',
      'The dollar — the quoted currency — symmetrically depreciates, even though "its number" went up: trap number one in FX reading',
      'Control counter-example: USD/JPY moving from 150 to 155 is a stronger dollar, because the dollar is the base currency there',
      'The oral reflex: restate any rate as "price of one unit of BASE in QUOTED" before concluding anything',
    ],
    bonus: [
      "Citer la hiérarchie conventionnelle des bases — EUR > GBP > AUD > NZD > USD > le reste — qui explique qu'on ne voie jamais USD/EUR",
      'Glisser l\'unité de mesure : 500 pips de hausse sur une paire cotée à 4 décimales — et rappeler que les paires en yen cotent le pip à la 2ᵉ décimale',
    ],
    bonusEn: [
      'Quote the conventional base hierarchy — EUR > GBP > AUD > NZD > USD > the rest — which explains why you never see USD/EUR',
      'Slip in the unit of measure: a 500-pip rise on a four-decimal pair — and recall that yen pairs quote the pip at the 2nd decimal',
    ],
    reponseModele: `L'euro — et toute la réponse tient dans une convention qu'il faut verrouiller avant de parler. Une paire de change se note BASE/COTÉE, et le cours est **le prix d'une unité de la devise de base, exprimé en devise cotée**. EUR/USD = 1,10 se lit donc : 1 euro vaut 1,10 dollar.

Appliquons. À 1,15, le même euro achète désormais 1,15 dollar au lieu de 1,10 : l'euro — la base — s'est **apprécié** d'environ 4,5 %, et le dollar — la cotée — s'est déprécié d'autant. Le piège est exactement là : « le chiffre du dollar a monté », donc l'intuition naïve conclut à un dollar plus fort. C'est l'inverse : il faut désormais *plus* de dollars pour acheter un euro — c'est la définition même d'un dollar plus faible.

Le contre-exemple qui contrôle le raisonnement : USD/JPY qui passe de 150 à 155, c'est cette fois un **dollar plus fort** contre le yen — car dans cette paire, le dollar est la devise de base. « Le dollar monte » est donc une phrase ambiguë tant qu'on ne précise pas la paire et la place du dollar dedans.

D'où le réflexe que je m'impose avant toute lecture : reformuler le cours comme « prix d'une unité de BASE en COTÉE ». Une fois cette grille posée, la règle est sans exception : **la hausse du cours est toujours une appréciation de la devise de base** — jamais autre chose. Tout le reste du change — forwards, carry, parités — se brise si ce sens de lecture flotte.`,
    reponseModeleEn: `The euro — and the whole answer sits in a convention that must be locked before saying anything. A currency pair is written BASE/QUOTED, and the rate is **the price of one unit of the base currency, expressed in the quoted currency**. EUR/USD = 1.10 therefore reads: 1 euro is worth 1.10 dollars.

Apply it. At 1.15, the same euro now buys 1.15 dollars instead of 1.10: the euro — the base — has **appreciated** by roughly 4.5%, and the dollar — the quoted currency — has depreciated by as much. The trap is exactly there: "the dollar number went up", so naive intuition concludes the dollar is stronger. It is the opposite: it now takes *more* dollars to buy one euro — that is the very definition of a weaker dollar.

The counter-example that checks the reasoning: USD/JPY moving from 150 to 155 is, this time, a **stronger dollar** against the yen — because in that pair, the dollar is the base currency. "The dollar is up" is therefore an ambiguous sentence until you specify the pair and the dollar's place in it.

Hence the reflex I impose on myself before any reading: restate the rate as "price of one unit of BASE in QUOTED". Once that grid is set, the rule has no exception: **a rising rate is always an appreciation of the base currency** — never anything else. Everything else in FX — forwards, carry, parities — breaks if this reading direction drifts.`,
  },
  {
    id: 'm6-j-02',
    moduleId: M6,
    theme: 'le marché des changes',
    themeEn: 'the FX market',
    difficulte: 1,
    question: 'Le marché des changes est-il une bourse ?',
    questionEn: 'Is the foreign exchange market an exchange?',
    plan: [
      'Répondre net : non — un marché OTC, un réseau de banques teneuses de marché',
      'Donner l\'échelle : environ 7 500 Md$ par jour (BRI 2022) — un volume, pas un encours',
      'Décrire la géographie : 24 h/24 cinq jours sur sept, Londres en tête, le dollar partout',
      'Conclure : pas d\'enceinte, pas d\'administrateur — les banques centrales y sont des acteurs',
    ],
    planEn: [
      'Answer squarely: no — an OTC market, a network of market-making banks',
      'Give the scale: about \\$7.5tn a day (BIS 2022) — a flow, not a stock',
      'Describe the geography: 24/5, London first, the dollar everywhere',
      'Conclude: no trading floor, no administrator — central banks are participants there',
    ],
    pointsAttendus: [
      'Non : aucun carnet d\'ordres central, aucune autorité de cotation — un marché OTC où les banques se cotent mutuellement et cotent leurs clients',
      "L'échelle : environ 7 500 Md$ échangés par jour (enquête triennale BRI 2022, de l'ordre de 9 600 pour 2025) — et préciser que c'est un volume quotidien, pas un encours",
      'Ouvert en continu du lundi matin à Wellington au vendredi soir à New York : 24 h/24, 5 jours sur 7',
      "Concentration : Londres traite de l'ordre de 38 % des volumes, New York environ 19 % ; le dollar figure dans près de 9 transactions sur 10 — la devise véhiculaire",
      'Les banques centrales y interviennent comme acteurs (réserves, interventions), pas comme administrateurs',
    ],
    pointsAttendusEn: [
      'No: no central order book, no listing authority — an OTC market where banks quote each other and their clients',
      'The scale: about \\$7.5tn traded per day (BIS triennial survey 2022, on the order of 9.6tn for 2025) — and specify it is a daily flow, not a stock',
      'Open continuously from Monday morning in Wellington to Friday evening in New York: 24/5',
      'Concentration: London handles around 38% of volumes, New York about 19%; the dollar appears in nearly 9 trades out of 10 — the vehicle currency',
      'Central banks act there as participants (reserves, interventions), not as administrators',
    ],
    bonus: [
      'Citer la plomberie : règlement spot à T+2, risque de règlement neutralisé pour une large part du marché par CLS',
      "L'anecdote du fixing WM/Reuters de 16 h à Londres, manipulé en 2013 : même le marché le plus liquide du monde n'est pas au-dessus de la microstructure",
    ],
    bonusEn: [
      'Mention the plumbing: spot settlement at T+2, settlement risk neutralised for a large share of the market by CLS',
      'The 4pm London WM/Reuters fixing scandal of 2013: even the most liquid market in the world is not above microstructure',
    ],
    reponseModele: `Non — et la différence est structurelle, pas cosmétique. Il n'existe pas de bourse des devises : le change est un marché **OTC**, de gré à gré — un réseau mondial de banques teneuses de marché qui se cotent les unes les autres et cotent leurs clients, sans carnet d'ordres central ni autorité de cotation.

L'échelle d'abord, car elle classe le sujet : environ **7 500 milliards de dollars échangés chaque jour** selon l'enquête triennale de la BRI de 2022 — et l'enquête 2025 pointe vers 9 600. J'insiste sur la nature du chiffre : c'est un **volume**, un flux quotidien, pas un encours — le comparer à la capitalisation boursière mondiale n'aurait aucun sens. En débit, en revanche, aucun marché au monde n'approche le change.

Conséquence directe de la décentralisation : le marché ne ferme jamais en semaine. Il s'ouvre le lundi matin à Wellington, suit le soleil par Tokyo, Singapour et Hong Kong, passe par Londres, et se referme le vendredi soir à New York — 24 h/24, 5 jours sur 7. Décentralisé ne veut pas dire dispersé : **Londres traite à elle seule de l'ordre de 38 % des volumes**, devant New York autour de 19 %. Et une devise écrase tout : le dollar figure dans près de **9 transactions sur 10**, y compris entre contreparties non américaines — c'est la devise véhiculaire du système.

La chute, qui répond précisément à votre question : sur ce marché, même les banques centrales ne sont pas des administrateurs — ce sont des **acteurs**, qui gèrent leurs réserves et interviennent parfois. Personne ne tient la cote ; tout le monde la fait.`,
    reponseModeleEn: `No — and the difference is structural, not cosmetic. There is no stock exchange for currencies: FX is an **OTC** market — a global network of market-making banks quoting one another and their clients, with no central order book and no listing authority.

Scale first, because it frames the topic: roughly **\\$7.5 trillion traded every day** according to the BIS 2022 triennial survey — with the 2025 survey pointing towards 9.6. I stress the nature of the figure: it is a **volume**, a daily flow, not a stock — comparing it with global market capitalisation would be meaningless. In throughput, however, no market in the world comes close.

A direct consequence of decentralisation: the market never closes during the week. It opens Monday morning in Wellington, follows the sun through Tokyo, Singapore and Hong Kong, passes through London, and shuts Friday evening in New York — 24 hours a day, five days a week. Decentralised does not mean scattered: **London alone handles around 38% of volumes**, ahead of New York at about 19%. And one currency crushes everything: the dollar appears in nearly **9 trades out of 10**, including between two non-American counterparties — the vehicle currency of the system.

The closing line, which answers your question precisely: in this market, even central banks are not administrators — they are **participants**, managing reserves and occasionally intervening. Nobody keeps the quote; everybody makes it.`,
  },
  {
    id: 'm6-j-03',
    moduleId: M6,
    theme: 'le marché des changes',
    themeEn: 'the FX market',
    difficulte: 2,
    question: 'EUR/USD est coté 1,1000/1,1002. Combien coûte un aller-retour immédiat sur 10 M€ ?',
    questionEn: 'EUR/USD is quoted 1.1000/1.1002. How much does an immediate round trip on €10m cost?',
    plan: [
      'Lire la cotation : bid 1,1000, ask 1,1002 — un spread de 2 pips, milieu 1,1001',
      'Poser la mécanique : acheter à l\'ask, revendre aussitôt au bid — on paie le spread',
      'Calculer : montant × spread/milieu = 10 M × 0,0002/1,1001 ≈ 1 818 €',
      'Désamorcer le piège des 2 000 : les pips s\'encaissent en dollars, à reconvertir au milieu',
    ],
    planEn: [
      'Read the quote: bid 1.1000, ask 1.1002 — a 2-pip spread, mid 1.1001',
      'State the mechanics: buy at the ask, sell straight back at the bid — you pay the spread',
      'Compute: amount × spread/mid = 10m × 0.0002/1.1001 ≈ €1,818',
      'Defuse the 2,000 trap: pips accrue in dollars, to be converted back at the mid',
    ],
    pointsAttendus: [
      "Identifier le spread : 1,1002 − 1,1000 = 2 pips, milieu de fourchette 1,1001",
      "La formule : coût = montant × (ask − bid)/milieu — le spread relatif appliqué au montant traité",
      "Le calcul : 10 000 000 × 0,0002/1,1001 ≈ 1 818 € — soit environ 0,018 % du montant",
      "Le piège : 2 pips × 10 M = 2 000, mais en *dollars* (la devise cotée) ; il faut reconvertir au cours milieu — 2 000/1,1001 ≈ 1 818 €",
      "La mise en perspective : dérisoire pour une opération isolée, considérable pour qui tourne son portefeuille plusieurs fois par jour",
    ],
    pointsAttendusEn: [
      'Identify the spread: 1.1002 − 1.1000 = 2 pips, mid-quote 1.1001',
      'The formula: cost = amount × (ask − bid)/mid — the relative spread applied to the traded amount',
      'The computation: 10,000,000 × 0.0002/1.1001 ≈ €1,818 — about 0.018% of the amount',
      'The trap: 2 pips × 10m = 2,000, but in *dollars* (the quoted currency); it must be converted back at the mid — 2,000/1.1001 ≈ €1,818',
      'The perspective: negligible for a one-off trade, substantial for anyone turning the book several times a day',
    ],
    bonus: [
      "Situer la cotation : 2 pips, c'est un spread ordinaire sur une major hors heures de pointe — aux heures liquides, EUR/USD descend autour d'un pip",
      "Rappeler l'exemple canonique du cours : 4 pips sur 1 M€ (1,0998/1,1002) coûtent 363,64 €, pas 400 — même piège de devise, même reconversion",
    ],
    bonusEn: [
      'Place the quote: 2 pips is an ordinary spread on a major outside peak hours — in liquid hours, EUR/USD goes down to around one pip',
      'Recall the canonical course example: 4 pips on €1m (1.0998/1.1002) cost €363.64, not 400 — same currency trap, same conversion',
    ],
    reponseModele: `Environ **1 818 euros** — et le chemin compte autant que le chiffre. La cotation se lit d'abord : le teneur de marché m'achète des euros à 1,1000 — le bid — et m'en vend à 1,1002 — l'ask. Spread : **2 pips**, milieu de fourchette 1,1001.

Un aller-retour immédiat, c'est acheter 10 M€ à l'ask et les revendre dans la seconde au bid : je paie le spread, rien d'autre — le cours n'a pas eu le temps de bouger. Le coût se calcule comme le spread relatif appliqué au montant :

$$10\\,000\\,000 \\times \\frac{0{,}0002}{1{,}1001} \\approx 1\\,818 \\text{ €}$$

Le piège que cette question tend : répondre 2 000 €. Les 2 pips rapportent bien 2 000 par tranche de 10 millions traités — mais **en dollars**, la devise cotée : 0,0002 dollar par euro. Pour exprimer le coût en euros, il faut reconvertir au cours milieu : 2 000/1,1001 ≈ 1 818 €. C'est la version à 10 millions de l'exemple du cours — 4 pips sur 1 M€ coûtent 363,64 €, pas 400.

La mise en perspective pour finir : 1 818 € sur 10 millions, c'est **0,018 %** — dérisoire en absolu, et c'est précisément ce qui fait du change le marché le plus serré du monde. Mais la friction est par aller-retour : un desk qui tourne sa position dix fois par jour paie dix fois ce péage. Le spread est invisible sur une opération, et structurant sur une activité.`,
    reponseModeleEn: `About **1,818 euros** — and the path matters as much as the figure. Read the quote first: the market maker buys my euros at 1.1000 — the bid — and sells them to me at 1.1002 — the ask. Spread: **2 pips**, mid-quote 1.1001.

An immediate round trip means buying €10m at the ask and selling it back within the second at the bid: I pay the spread, nothing else — the rate has had no time to move. The cost is the relative spread applied to the amount:

$$10{,}000{,}000 \\times \\frac{0.0002}{1.1001} \\approx €1{,}818$$

The trap this question sets: answering €2,000. The 2 pips do amount to 2,000 per 10 million traded — but **in dollars**, the quoted currency: 0.0002 dollars per euro. To express the cost in euros, you must convert back at the mid: 2,000/1.1001 ≈ €1,818. This is the 10-million version of the course example — 4 pips on €1m cost €363.64, not 400.

Perspective to finish: €1,818 on 10 million is **0.018%** — negligible in absolute terms, and that is precisely what makes FX the tightest market in the world. But the friction is per round trip: a desk that turns its position ten times a day pays that toll ten times. The spread is invisible on one trade, and structural on a business.`,
  },
  {
    id: 'm6-j-04',
    moduleId: M6,
    theme: 'le marché des changes',
    themeEn: 'the FX market',
    difficulte: 2,
    question: "Pourquoi le yen s'apprécie-t-il quand les marchés paniquent ?",
    questionEn: 'Why does the yen appreciate when markets panic?',
    plan: [
      'Poser le fait stylisé : en risk-off, les capitaux refluent vers les devises refuges — yen, franc suisse, souvent le dollar',
      'Donner la mécanique propre au yen : devise de financement du carry trade',
      'Dérouler le débouclage : pertes → rachats massifs de yens → appréciation auto-entretenue',
      'Illustrer : 2008 et le 5 août 2024',
    ],
    planEn: [
      'State the stylised fact: in risk-off, capital flows back to safe-haven currencies — yen, Swiss franc, often the dollar',
      'Give the yen-specific mechanics: the funding currency of the carry trade',
      'Walk the unwind: losses → massive yen buybacks → self-reinforcing appreciation',
      'Illustrate: 2008 and 5 August 2024',
    ],
    pointsAttendus: [
      'Les devises ont des personnalités : en régime risk-off, yen et franc suisse jouent les refuges, les devises à haut rendement décrochent',
      "La clé du yen : ses taux durablement bas en font la devise d'emprunt favorite des carry trades — le monde est structurellement vendeur de yens",
      'Quand la panique arrive, les positions de portage se débouclent : il faut racheter des yens pour rembourser les emprunts — une demande forcée, massive et simultanée',
      "Le mécanisme est auto-entretenu : l'appréciation du yen aggrave les pertes des porteurs restants, qui débouclent à leur tour",
      "Les illustrations : 2008 (les paires comme AUD/JPY perdent plus de 30 % en quelques mois) et août 2024 (hausse de la BoJ, débouclage brutal, Nikkei −12 % le 5 août)",
    ],
    pointsAttendusEn: [
      'Currencies have personalities: in risk-off regimes, the yen and the Swiss franc act as havens while high-yielding currencies sell off',
      'The yen key: durably low rates make it the favourite borrowing currency of carry trades — the world is structurally short yen',
      'When panic hits, carry positions unwind: yen must be bought back to repay the loans — a forced, massive, simultaneous demand',
      'The mechanism is self-reinforcing: yen appreciation worsens the losses of remaining holders, who unwind in turn',
      'The illustrations: 2008 (pairs like AUD/JPY lose more than 30% in a few months) and August 2024 (BoJ hike, brutal unwind, Nikkei −12% on 5 August)',
    ],
    bonus: [
      "Le franc suisse a sa propre variante : excédents extérieurs et statut historique de refuge — au point que la BNS a dû combattre l'appréciation pendant des années, jusqu'au plancher de 1,20 abandonné en 2015",
      "Relier au chapitre carry : le yen qui monte en panique est exactement le rouleau compresseur de la skewness négative du portage",
    ],
    bonusEn: [
      'The Swiss franc has its own variant: external surpluses and a historical haven status — to the point that the SNB had to fight appreciation for years, until the 1.20 floor abandoned in 2015',
      'Link to the carry chapter: the yen surging in a panic is exactly the steamroller behind the negative skewness of carry',
    ],
    reponseModele: `Parce qu'en cas de panique, le monde entier doit **racheter** du yen — qu'il l'aime ou non. Le fait stylisé d'abord : quand les marchés basculent en *risk-off*, les capitaux refluent vers les devises refuges — le yen et le franc suisse au premier rang, le dollar souvent avec eux — et les devises à haut rendement décrochent.

Mais pour le yen, l'explication a une mécanique précise, et c'est elle qui intéresse un jury. Ses taux durablement bas en font la **devise de financement** favorite du carry trade : on emprunte le yen à presque rien pour placer dans des devises qui rémunèrent. Le monde est donc structurellement *vendeur* de yens — des positions empilées pendant des années de calme.

Quand la panique arrive, ces positions perdent de l'argent et se débouclent : pour rembourser un emprunt en yens, il faut **racheter des yens**. Une demande forcée, massive, simultanée. Et le mécanisme s'auto-entretient : le yen qui monte aggrave les pertes des porteurs restants, qui débouclent à leur tour — le rachat nourrit la hausse qui force le rachat.

Deux illustrations datées. En 2008, les carry trades financés en yen se débouclent dans la panique : des paires emblématiques comme le dollar australien contre yen perdent plus de 30 % en quelques mois. En août 2024, version accélérée : la Banque du Japon venait de relever ses taux, des données américaines décevantes ont fait le reste — le yen s'apprécie brutalement et le Nikkei perd plus de 12 % dans la seule séance du 5 août.

La chute : le yen ne monte pas parce qu'on le désire — il monte parce qu'on le **doit**.`,
    reponseModeleEn: `Because in a panic, the whole world has to **buy back** yen — whether it likes it or not. The stylised fact first: when markets flip to risk-off, capital flows back into safe-haven currencies — the yen and the Swiss franc first among them, the dollar often alongside — while high-yielding currencies sell off.

But for the yen, the explanation has a precise mechanism, and that is what interests a jury. Its durably low rates make it the favourite **funding currency** of the carry trade: you borrow yen for next to nothing to invest in currencies that pay. The world is therefore structurally *short* yen — positions piled up through years of calm.

When panic hits, those positions lose money and unwind: to repay a yen loan, you must **buy yen back**. A forced, massive, simultaneous demand. And the mechanism feeds itself: the rising yen worsens the losses of the remaining holders, who unwind in turn — the buyback fuels the rise that forces the buyback.

Two dated illustrations. In 2008, yen-funded carry trades unwound in the panic: emblematic pairs such as the Australian dollar against the yen lost more than 30% in a few months. In August 2024, the accelerated version: the Bank of Japan had just raised rates, disappointing US data did the rest — the yen appreciated sharply and the Nikkei lost more than 12% in the single session of 5 August.

The closing line: the yen does not rise because people want it — it rises because they **must**.`,
  },
  {
    id: 'm6-j-05',
    moduleId: M6,
    theme: 'forwards et parité couverte',
    themeEn: 'forwards and covered parity',
    difficulte: 2,
    question: 'Démontrez-moi la parité couverte des taux d\'intérêt en 90 secondes.',
    questionEn: 'Prove covered interest rate parity for me in 90 seconds.',
    plan: [
      'Poser le problème : 1 euro aujourd\'hui, des dollars dans un an, zéro risque — deux chemins possibles',
      'Chemin A : convertir au spot puis placer en dollars ; chemin B : placer en euros puis convertir au forward fixé aujourd\'hui',
      'Égaliser : deux stratégies sans risque, même mise, même horizon — même richesse finale, sinon arbitrage',
      "Chiffrer : 1,10 × 1,05/1,03 = 1,1214, soit +213,6 pips de report",
    ],
    planEn: [
      'Set the problem: 1 euro today, dollars in one year, zero risk — two possible paths',
      'Path A: convert at spot then invest in dollars; path B: invest in euros then convert at the forward fixed today',
      'Equate: two riskless strategies, same stake, same horizon — same final wealth, otherwise arbitrage',
      'Quantify: 1.10 × 1.05/1.03 = 1.1214, i.e. +213.6 pips of premium',
    ],
    pointsAttendus: [
      "Chemin A : convertir 1 € au spot S, placer au taux dollar — richesse finale S × (1 + r_cotée·T) dollars",
      'Chemin B : placer 1 € au taux euro, vendre dès aujourd\'hui le produit à terme au forward F — richesse finale (1 + r_base·T) × F dollars',
      "Aucun des deux chemins ne comporte d'aléa : même mise, même horizon, zéro risque — les deux richesses doivent être égales, sinon on emprunte le chemin pauvre pour dérouler le riche",
      "D'où F = S × (1 + r_cotée·T)/(1 + r_base·T) — taux de la devise cotée au numérateur, base au dénominateur",
      "L'exemple canonique : 1,10 × 1,05/1,03 = 1,1214, soit +213,6 pips — vérification par les deux chemins : 1,155 $ des deux côtés",
      'La règle qui condense : la devise au taux le plus bas se revalorise à terme — le forward neutralise le portage, il ne récompense personne',
    ],
    pointsAttendusEn: [
      'Path A: convert €1 at spot S, invest at the dollar rate — final wealth S × (1 + r_quoted·T) dollars',
      'Path B: invest €1 at the euro rate, sell the proceeds forward today at F — final wealth (1 + r_base·T) × F dollars',
      'Neither path carries any uncertainty: same stake, same horizon, zero risk — the two final amounts must be equal, otherwise borrow the poor path and run the rich one',
      'Hence F = S × (1 + r_quoted·T)/(1 + r_base·T) — quoted-currency rate in the numerator, base in the denominator',
      'The canonical example: 1.10 × 1.05/1.03 = 1.1214, i.e. +213.6 pips — checked through both paths: \\$1.155 either way',
      'The condensing rule: the lower-rate currency appreciates forward — the forward neutralises the carry, it rewards no one',
    ],
    bonus: [
      'Préciser la convention : taux en linéaire simple, la convention du marché monétaire — le change à terme vit surtout sous l\'année',
      "Signaler l'entorse moderne : depuis 2008, le cross-currency basis fait dévier la CIP — l'arbitrage mobilise du bilan bancaire, devenu rare et facturé",
    ],
    bonusEn: [
      'Specify the convention: simple linear rates, the money-market convention — forward FX mostly lives below one year',
      'Flag the modern deviation: since 2008, the cross-currency basis bends CIP — the arbitrage consumes bank balance sheet, now scarce and charged for',
    ],
    reponseModele: `Quatre-vingt-dix secondes, deux chemins, un seul prix. Le problème : j'ai 1 euro aujourd'hui, je veux des dollars dans un an, **sans prendre aucun risque**.

**Chemin A** — convertir d'abord, placer ensuite : je change mon euro au spot $S$, j'obtiens $S$ dollars que je place au taux dollar. Dans un an : $S \\times (1 + r_{cot}T)$ dollars. **Chemin B** — placer d'abord, convertir ensuite : je place mon euro au taux euro, et je vends *dès aujourd'hui* à terme le produit de ce placement, au forward $F$. Dans un an : $(1 + r_{base}T) \\times F$ dollars.

Les deux chemins partent du même euro, finissent à la même date, et aucun ne comporte le moindre aléa — le chemin B est *couvert* par la vente à terme, d'où le nom. Deux stratégies sans risque, de même mise et de même horizon, doivent livrer la même richesse : sinon, j'emprunte par le chemin pauvre et je déroule le chemin riche — de l'argent gratuit. D'où :

$$F = S \\times \\frac{1 + r_{cot}\\,T}{1 + r_{base}\\,T}$$

Chiffrons : spot 1,10, taux dollar 5 %, taux euro 3 %, un an. $F = 1{,}10 \\times 1{,}05/1{,}03 = 1{,}1214$ — soit **+213,6 pips** de report de l'euro. Vérification éclair : 1 € converti puis placé donne 1,155 $ ; 1 € placé donne 1,03 €, vendus à terme à 1,1214, soit 1,155 $ aussi. Les deux chemins se rejoignent.

La règle qui condense tout : **la devise au taux le plus bas se revalorise à terme** — le forward compense exactement le différentiel de portage. Il ne récompense personne, et il ne prédit rien.`,
    reponseModeleEn: `Ninety seconds, two paths, one price. The problem: I have 1 euro today, I want dollars in one year, **with zero risk**.

**Path A** — convert first, invest after: I exchange my euro at spot $S$, getting $S$ dollars which I invest at the dollar rate. In one year: $S \\times (1 + r_{quo}T)$ dollars. **Path B** — invest first, convert after: I invest my euro at the euro rate, and I sell the proceeds forward *today*, at the forward $F$. In one year: $(1 + r_{base}T) \\times F$ dollars.

Both paths start from the same euro, end on the same date, and neither carries the slightest uncertainty — path B is *covered* by the forward sale, hence the name. Two riskless strategies with the same stake and horizon must deliver the same wealth: otherwise, I borrow through the poor path and run the rich one — free money. Hence:

$$F = S \\times \\frac{1 + r_{quo}\\,T}{1 + r_{base}\\,T}$$

Put numbers on it: spot 1.10, dollar rate 5%, euro rate 3%, one year. $F = 1.10 \\times 1.05/1.03 = 1.1214$ — that is **+213.6 pips** of euro premium. Lightning check: €1 converted then invested yields \\$1.155; €1 invested yields €1.03, sold forward at 1.1214, also \\$1.155. The two paths meet.

The rule that condenses everything: **the lower-rate currency appreciates forward** — the forward exactly offsets the carry differential. It rewards no one, and it predicts nothing.`,
  },
  {
    id: 'm6-j-06',
    moduleId: M6,
    theme: 'forwards et parité couverte',
    themeEn: 'forwards and covered parity',
    difficulte: 2,
    question: 'Le forward EUR/USD 1 an cote 213,6 pips au-dessus du spot. Le marché prévoit donc un euro plus fort ?',
    questionEn: 'The 1-year EUR/USD forward quotes 213.6 pips above spot. So the market forecasts a stronger euro?',
    plan: [
      'Répondre net : non — le forward est de l\'arithmétique d\'arbitrage, pas une anticipation',
      'Montrer les ingrédients : spot et deux taux, trois nombres observables aujourd\'hui, zéro prévision',
      'Expliquer le report : le dollar rémunère plus, le forward neutralise ce portage',
      'Retourner l\'argument : si le forward prédisait, les données le contrediraient — le forward premium puzzle',
    ],
    planEn: [
      'Answer squarely: no — the forward is arbitrage arithmetic, not an expectation',
      'Show the ingredients: spot and two rates, three numbers observable today, zero forecast',
      'Explain the premium: the dollar pays more, the forward neutralises that carry',
      'Turn the argument around: if the forward predicted, the data would contradict it — the forward premium puzzle',
    ],
    pointsAttendus: [
      'Le forward se calcule avec trois nombres observables aujourd\'hui — spot, taux dollar, taux euro : aucune anticipation n\'y entre',
      "Le report de l'euro dit seulement que le dollar rémunère plus (5 % contre 3 %) : si le forward ne compensait pas ce différentiel, placer en dollars couvert serait un guichet d'argent gratuit",
      'Le forward dit « voici le seul cours à terme compatible avec l\'absence d\'arbitrage », pas « voici où sera le spot »',
      "L'argument empirique : si le forward était une bonne prévision, la devise à taux élevé devrait se déprécier du différentiel — à court terme, elle fait souvent l'inverse (forward premium puzzle, Fama 1984)",
      "La distinction d'oral : prix d'arbitrage d'un côté, anticipation de l'autre — même piège, même réponse que pour les taux forward",
    ],
    pointsAttendusEn: [
      'The forward is computed from three numbers observable today — spot, dollar rate, euro rate: no expectation enters it',
      'The euro premium only says the dollar pays more (5% versus 3%): if the forward did not offset that differential, covered dollar deposits would be a free-money counter',
      'The forward says "here is the only forward rate consistent with no arbitrage", not "here is where spot will be"',
      'The empirical argument: if the forward were a good forecast, the high-rate currency should depreciate by the differential — at short horizons it often does the opposite (forward premium puzzle, Fama 1984)',
      'The oral distinction: arbitrage price on one side, expectation on the other — same trap, same answer as for forward interest rates',
    ],
    bonus: [
      "Nommer la conséquence de l'anomalie : c'est le carburant du carry trade — encaisser le différentiel a historiquement payé en moyenne, au prix d'un risque de crash",
      'Citer la pratique des écrans : les cambistes cotent les points de terme à ajouter au spot — le signe des points donne le régime (report/déport) d\'un coup d\'œil',
    ],
    bonusEn: [
      'Name the consequence of the anomaly: it is the fuel of the carry trade — collecting the differential has historically paid on average, at the cost of crash risk',
      'Quote screen practice: dealers quote forward points to add to spot — the sign of the points gives the regime (premium/discount) at a glance',
    ],
    reponseModele: `Non — et confondre les deux est exactement le contresens que cette question veut débusquer. Le forward de change est de l'**arithmétique d'arbitrage** : il se calcule avec trois nombres observables aujourd'hui — le spot, le taux dollar, le taux euro. Aucune anticipation n'entre dans la formule : $F = S \\times (1 + r_{cot}T)/(1 + r_{base}T)$, soit 1,10 × 1,05/1,03 = 1,1214.

Que disent alors ces 213,6 pips de report ? Une seule chose : le dollar rémunère plus que l'euro — 5 % contre 3 %. Si le forward ne reprenait pas cet avantage de portage, tout le monde emprunterait en euros pour placer en dollars couvert à terme : un guichet d'argent gratuit. Le forward s'ajuste donc jusqu'à rendre l'opération exactement blanche. Il **neutralise le portage** — il ne prédit rien. Il dit « voici le seul cours à terme compatible avec l'absence d'arbitrage », pas « voici où sera le spot dans un an ».

L'argument qui achève la démonstration est empirique : si le forward était une bonne prévision, la devise à taux élevé devrait se déprécier du différentiel chaque année. Or, sur des décennies de données, à court et moyen terme, elle fait souvent l'**inverse** — c'est le *forward premium puzzle* mis en évidence par Fama en 1984. Cette anomalie n'est pas une curiosité : c'est le carburant du carry trade.

La distinction à tenir devant vous, donc : d'un côté un **prix d'arbitrage**, verrouillé au pip près ; de l'autre une **anticipation**, qui n'engage que celui qui la formule. Le forward appartient à la première catégorie — entièrement.`,
    reponseModeleEn: `No — and confusing the two is exactly the misreading this question is designed to flush out. The FX forward is **arbitrage arithmetic**: it is computed from three numbers observable today — spot, the dollar rate, the euro rate. No expectation enters the formula: $F = S \\times (1 + r_{quo}T)/(1 + r_{base}T)$, that is 1.10 × 1.05/1.03 = 1.1214.

So what do those 213.6 pips of premium say? One thing only: the dollar pays more than the euro — 5% versus 3%. If the forward did not absorb that carry advantage, everyone would borrow euros to invest in covered dollar deposits: a free-money counter. The forward therefore adjusts until the trade is exactly flat. It **neutralises the carry** — it predicts nothing. It says "here is the only forward rate consistent with no free money", not "here is where spot will be in a year".

The clinching argument is empirical: if the forward were a good forecast, the high-rate currency should depreciate by the differential every year. Yet, across decades of data, at short and medium horizons, it often does the **opposite** — the *forward premium puzzle* documented by Fama in 1984. That anomaly is no curiosity: it is the fuel of the carry trade.

The distinction to hold in front of you, then: on one side an **arbitrage price**, locked to the pip; on the other an **expectation**, which binds only whoever states it. The forward belongs to the first category — entirely.`,
  },
  {
    id: 'm6-j-07',
    moduleId: M6,
    theme: 'forwards et parité couverte',
    themeEn: 'forwards and covered parity',
    difficulte: 3,
    question: 'La CIP donne un forward de 1,1214, mais un teneur de marché cote 1,1300. Que faites-vous, concrètement ?',
    questionEn: 'CIP gives a 1.1214 forward, but a market maker quotes 1.1300. What do you do, concretely?',
    plan: [
      'Diagnostiquer : le forward coté surpaie l\'euro à terme de 86 pips — on le vend, et on le fabrique moins cher',
      'Dérouler les quatre jambes : emprunter des dollars, acheter l\'euro spot, placer, vendre à terme à 1,1300',
      "Chiffrer le gain : environ +8 091 $ par million de dollars emprunté, sans capital ni risque de marché",
      'Conclure : la ruée referme l\'écart — et nuancer avec le cross-currency basis post-2008',
    ],
    planEn: [
      'Diagnose: the quoted forward overpays the forward euro by 86 pips — sell it, and manufacture it cheaper',
      'Walk the four legs: borrow dollars, buy euro spot, invest, sell forward at 1.1300',
      'Quantify the gain: about +\\$8,091 per million dollars borrowed, with no capital and no market risk',
      'Conclude: the rush closes the gap — and qualify with the post-2008 cross-currency basis',
    ],
    pointsAttendus: [
      "Identifier le sens : à 1,1300, l'euro à terme est trop cher de 86 pips — on vend ce qui est surpayé et on le fabrique par le marché monétaire",
      'Les quatre jambes simultanées : emprunter des dollars à 5 %, les vendre au comptant contre euros à 1,10, placer les euros à 3 %, vendre les euros futurs à terme à 1,1300',
      'Le chiffrage : sur 1 M€ — dette de 1 155 000 $, recette de 1 030 000 × 1,13 = 1 163 900 $, soit +8 900 $ ; rapporté au million de dollars emprunté : ≈ +8 091 $',
      'Souligner les deux propriétés : aucun capital initial, aucun risque de marché — tous les cours et taux sont fixés au départ',
      "La dynamique : des dizaines de desks logent la même faille en quelques secondes — le forward coté revient sur 1,1214, le prix auquel personne n'a plus rien à gagner",
      "La nuance moderne : depuis 2008, des écarts persistent (cross-currency basis) — l'arbitrage consomme du bilan bancaire, ressource rare et facturée",
    ],
    pointsAttendusEn: [
      'Identify the direction: at 1.1300, the forward euro is 86 pips too expensive — sell what is overpaid and manufacture it through the money market',
      'The four simultaneous legs: borrow dollars at 5%, sell them spot for euros at 1.10, invest the euros at 3%, sell the future euros forward at 1.1300',
      'The numbers: on €1m — debt of \\$1,155,000, proceeds of 1,030,000 × 1.13 = \\$1,163,900, i.e. +\\$8,900; per million dollars borrowed: ≈ +\\$8,091',
      'Stress the two properties: no initial capital, no market risk — every rate and price is locked at inception',
      'The dynamics: dozens of desks hit the same flaw within seconds — the quoted forward returns to 1.1214, the price at which no one has anything left to gain',
      'The modern caveat: since 2008, deviations persist (cross-currency basis) — the arbitrage consumes bank balance sheet, a scarce and charged-for resource',
    ],
    bonus: [
      "Donner la lecture du basis : en période de stress, le monde entier veut des dollars — le dollar emprunté via FX swap se paie au-dessus de son prix théorique, un thermomètre du stress de financement",
      "Préciser la discipline d'exécution : les quatre jambes se traitent simultanément — toute jambe laissée ouverte transforme l'arbitrage en spéculation",
    ],
    bonusEn: [
      'Give the basis reading: under stress, the whole world wants dollars — dollars borrowed via FX swaps trade above their theoretical price, a funding-stress thermometer',
      'Specify execution discipline: the four legs are traded simultaneously — any leg left open turns the arbitrage into speculation',
    ],
    reponseModele: `Le forward coté surpaie l'euro à terme de 86 pips : je **vends** ce qui est trop cher, et je le fabrique moi-même moins cher par le marché monétaire. Quatre jambes, traitées simultanément.

Un : j'emprunte 1,1 M\\$ à 5 % — ma dette à un an vaudra 1 155 000 \\$. Deux : je vends ces dollars au comptant contre 1 M€ au spot de 1,10. Trois : je place ce million d'euros à 3 % — j'aurai 1 030 000 € dans un an. Quatre : je vends *dès aujourd'hui* ces 1 030 000 € à terme, au cours coté de 1,1300.

À l'échéance, tout se dénoue mécaniquement : j'encaisse 1 030 000 × 1,13 = **1 163 900 \\$**, je rembourse 1 155 000 \\$ — il me reste **8 900 \\$ nets**, soit environ **8 091 \\$ par million de dollars emprunté**. Relisez les propriétés : aucun capital initial — tout est financé par l'emprunt — et aucun risque de marché — spot, taux et forward sont tous fixés à la signature. C'est la définition exacte de l'arbitrage.

Et je ne serai pas seul : des dizaines de desks logent la même faille en quelques secondes. Leur ruée vend le forward coté jusqu'à le ramener sur 1,1214 — le seul prix auquel personne n'a plus rien à gagner. C'est ainsi que la parité tient.

Une nuance pour finir, qui montre que je connais le marché d'après 2008 : la CIP n'est plus vérifiée au pip près en continu. Des écarts persistants — le *cross-currency basis* — subsistent, parce que cet arbitrage consomme du bilan bancaire, devenu une ressource rare et facturée depuis la régulation post-crise. La parité reste la référence ; ses entorses sont un thermomètre du stress de financement en dollars.`,
    reponseModeleEn: `The quoted forward overpays the forward euro by 86 pips: I **sell** what is too expensive, and I manufacture it myself more cheaply through the money market. Four legs, traded simultaneously.

One: I borrow \\$1.1m at 5% — my one-year debt will be \\$1,155,000. Two: I sell those dollars spot for €1m at 1.10. Three: I invest that million euros at 3% — I will have €1,030,000 in a year. Four: I sell those €1,030,000 forward *today*, at the quoted 1.1300.

At maturity everything unwinds mechanically: I collect 1,030,000 × 1.13 = **\\$1,163,900**, I repay \\$1,155,000 — leaving **\\$8,900 net**, about **\\$8,091 per million dollars borrowed**. Reread the properties: no initial capital — everything is funded by the loan — and no market risk — spot, rates and forward are all locked at inception. That is the exact definition of arbitrage.

And I will not be alone: dozens of desks hit the same flaw within seconds. Their rush sells the quoted forward back down to 1.1214 — the only price at which no one has anything left to gain. That is how the parity holds.

One closing nuance, to show I know the post-2008 market: CIP is no longer verified to the pip, continuously. Persistent deviations — the *cross-currency basis* — remain, because this arbitrage consumes bank balance sheet, a scarce and charged-for resource since post-crisis regulation. The parity remains the reference; its breaches are a thermometer of dollar funding stress.`,
  },
  {
    id: 'm6-j-08',
    moduleId: M6,
    theme: 'forwards et parité couverte',
    themeEn: 'forwards and covered parity',
    difficulte: 3,
    question: 'Quel est l\'instrument le plus traité du marché des changes — et pourquoi celui-là ?',
    questionEn: 'What is the most traded instrument in the FX market — and why that one?',
    plan: [
      'Donner la réponse contre-intuitive : le FX swap, de l\'ordre de la moitié des volumes — devant le spot',
      'Décrire l\'objet : un spot et un forward inversé, traités simultanément avec la même contrepartie',
      'Donner la lecture économique : un prêt d\'une devise gagé sur l\'autre — le repo du change',
      'Conclure sur l\'usage : la trésorerie internationale, et le cross-currency basis comme thermomètre',
    ],
    planEn: [
      'Give the counter-intuitive answer: the FX swap, around half of volumes — ahead of spot',
      'Describe the object: a spot and a reversed forward, traded simultaneously with the same counterparty',
      'Give the economic reading: a loan of one currency collateralised by the other — the repo of FX',
      'Conclude on usage: international treasury, and the cross-currency basis as a thermometer',
    ],
    pointsAttendus: [
      "Le FX swap : de l'ordre de la moitié des volumes quotidiens (BRI), devant le spot (~28 %) et les forwards secs",
      "Sa mécanique : j'échange aujourd'hui mes euros contre vos dollars au spot, et nous convenons en même temps de l'échange inverse à terme, au forward",
      "Sa nature économique : un prêt d'une devise gagé sur l'autre — le cousin cambiste du repo, le collatéral étant une devise plutôt qu'un titre",
      "Son usage : l'outil de toute la trésorerie internationale — une banque européenne qui a besoin de dollars pour 3 mois les swappe contre ses euros",
      "Le prolongement : c'est sur ce marché que se lit le cross-currency basis — la prime du dollar emprunté contre devise en période de stress",
    ],
    pointsAttendusEn: [
      'The FX swap: around half of daily volumes (BIS), ahead of spot (~28%) and outright forwards',
      'Its mechanics: I exchange my euros for your dollars at spot today, and we simultaneously agree the reverse exchange at the forward date, at the forward rate',
      'Its economic nature: a loan of one currency collateralised by the other — the FX cousin of the repo, the collateral being a currency rather than a security',
      'Its usage: the tool of all international treasury — a European bank needing dollars for 3 months swaps them against its euros',
      'The extension: this is the market where the cross-currency basis is read — the premium on dollars borrowed against currency in times of stress',
    ],
    bonus: [
      "Expliquer pourquoi l'écart persiste : l'arbitrage qui devrait refermer le basis mobilise du bilan bancaire — rare et facturé depuis la régulation post-crise",
      "Relier au risque de règlement : deux jambes, deux devises — c'est précisément le terrain de jeu de CLS",
    ],
    bonusEn: [
      'Explain why the gap persists: the arbitrage that should close the basis consumes bank balance sheet — scarce and charged for since post-crisis regulation',
      'Link to settlement risk: two legs, two currencies — precisely the playground of CLS',
    ],
    reponseModele: `La réponse surprend toujours : ce n'est ni le spot ni le forward sec, c'est le **swap de change** — de l'ordre de **la moitié des volumes quotidiens** selon la BRI, devant le spot qui n'en pèse qu'environ 28 %. L'instrument roi du plus gros marché du monde est celui que les manuels oublient.

L'objet d'abord : un FX swap, c'est un spot et un forward inversé, traités simultanément avec la même contrepartie. J'échange aujourd'hui mes euros contre vos dollars au cours comptant, et nous convenons dans le même mouvement de l'échange inverse dans trois mois, au cours à terme.

Pourquoi domine-t-il ? Parce que sa nature économique répond au besoin le plus massif de la finance internationale : ce n'est pas un pari sur le change, c'est un **prêt d'une devise gagé sur l'autre** — le cousin cambiste du repo, le collatéral étant une devise plutôt qu'un titre. Une banque européenne qui a besoin de dollars pour trois mois ne les achète pas : elle les *swappe* contre ses euros, et les rend à l'échéance. Toute la trésorerie internationale vit de cet outil, en le renouvelant sans cesse — d'où des volumes qui écrasent tout le reste.

Et ce marché porte un signal que les desks surveillent : le **cross-currency basis**. Depuis 2008, emprunter des dollars via FX swap coûte souvent un peu plus que le taux dollar direct — en période de stress, le monde entier veut des dollars, et le dollar gagé sur devise se paie au-dessus de son prix théorique. La chute : le FX swap n'est pas seulement l'instrument le plus traité du change — c'est aussi son meilleur thermomètre.`,
    reponseModeleEn: `The answer always surprises: it is neither spot nor the outright forward, it is the **FX swap** — around **half of daily volumes** according to the BIS, ahead of spot at roughly 28%. The king instrument of the world's biggest market is the one textbooks forget.

The object first: an FX swap is a spot and a reversed forward, traded simultaneously with the same counterparty. I exchange my euros for your dollars at the spot rate today, and in the same motion we agree the reverse exchange in three months, at the forward rate.

Why does it dominate? Because its economic nature answers the most massive need in international finance: it is not a currency bet, it is a **loan of one currency collateralised by the other** — the FX cousin of the repo, the collateral being a currency rather than a security. A European bank needing dollars for three months does not buy them: it *swaps* them against its euros and returns them at maturity. All international treasury lives off this tool, rolling it endlessly — hence volumes that crush everything else.

And this market carries a signal the desks watch: the **cross-currency basis**. Since 2008, borrowing dollars via FX swap has often cost a little more than the direct dollar rate — under stress, the whole world wants dollars, and dollars secured against currency trade above their theoretical price. The closing line: the FX swap is not merely the most traded instrument in FX — it is also its best thermometer.`,
  },
  {
    id: 'm6-j-09',
    moduleId: M6,
    theme: 'parités économiques et carry trade',
    themeEn: 'economic parities and the carry trade',
    difficulte: 2,
    question: 'Le Big Mac coûte 5,80 $ aux États-Unis et 5,00 € en zone euro ; le spot EUR/USD cote 1,10. Qui est sous-évalué, et de combien ?',
    questionEn: 'A Big Mac costs \\$5.80 in the US and €5.00 in the euro area; spot EUR/USD is 1.10. Which currency is undervalued, and by how much?',
    plan: [
      'Poser la PPA : le taux qui égalise le prix du panier — 5,80/5,00 = 1,16',
      'Mesurer l\'écart : (1,10/1,16 − 1) = −5,17 % — l\'euro, la base, est sous-évalué',
      'Vérifier par le panier : 5,00 € au spot = 5,50 $ < 5,80 $ — le Big Mac européen est le moins cher',
      'Conclure sur la portée : boussole de très long terme, pas un signal de trading',
    ],
    planEn: [
      'State PPP: the rate that equalises the basket price — 5.80/5.00 = 1.16',
      'Measure the gap: (1.10/1.16 − 1) = −5.17% — the euro, the base, is undervalued',
      'Check through the basket: €5.00 at spot = \\$5.50 < \\$5.80 — the European Big Mac is the cheaper one',
      'Conclude on the scope: a very-long-term compass, not a trading signal',
    ],
    pointsAttendus: [
      'La PPA part de la loi du prix unique : un même bien échangeable devrait coûter le même prix partout une fois converti',
      'Le calcul : PPA EUR/USD = 5,80/5,00 = 1,16 dollar par euro — homogène au cours BASE/COTÉE',
      "L'écart : (1,10/1,16 − 1) × 100 = −5,17 % — le spot est sous la parité, donc la devise de base, l'euro, est sous-évaluée ; le dollar, symétriquement, surévalué",
      'Le contrôle de sens : 5,00 € convertis au spot font 5,50 $, moins que les 5,80 $ américains — le panier européen est bien le moins cher, signature d\'une devise bon marché',
      "Les limites : prix visqueux, biens non échangeables, effet Balassa-Samuelson — un écart à la PPA met de l'ordre de trois à cinq ans à se résorber de moitié",
    ],
    pointsAttendusEn: [
      'PPP starts from the law of one price: the same tradable good should cost the same everywhere once converted',
      'The computation: PPP EUR/USD = 5.80/5.00 = 1.16 dollars per euro — homogeneous with the BASE/QUOTED rate',
      'The gap: (1.10/1.16 − 1) × 100 = −5.17% — spot is below parity, so the base currency, the euro, is undervalued; the dollar, symmetrically, overvalued',
      'The sense check: €5.00 converted at spot makes \\$5.50, less than the American \\$5.80 — the European basket is indeed the cheaper one, the signature of a cheap currency',
      'The limits: sticky prices, non-tradable goods, the Balassa-Samuelson effect — a PPP gap takes on the order of three to five years to close by half',
    ],
    bonus: [
      "Situer l'indice : publié par The Economist depuis 1986, volontairement simpliste — un panier d'un seul bien, produit localement",
      "Expliquer Balassa-Samuelson en une phrase : dans les pays riches, la productivité du secteur exposé tire tous les salaires — les services y sont structurellement plus chers, et les devises paraissent durablement « surévaluées » sans arbitrage possible",
    ],
    bonusEn: [
      'Place the index: published by The Economist since 1986, deliberately simplistic — a one-good basket, locally produced',
      'Explain Balassa-Samuelson in one sentence: in rich countries, tradable-sector productivity pulls up all wages — services are structurally dearer there, and currencies look durably "overvalued" with no arbitrage available',
    ],
    reponseModele: `C'est l'**euro** qui est sous-évalué, d'environ **5,2 %** — et le sens de lecture est précisément là où cette question piège les candidats.

Le raisonnement d'abord. La parité des pouvoirs d'achat applique la loi du prix unique : le même hamburger, produit localement des deux côtés, devrait coûter pareil une fois converti. Le taux qui égalise les prix vaut PPA = 5,80/5,00 = **1,16 dollar par euro** — homogène au cours EUR/USD, prix d'un euro en dollars.

Le spot cote 1,10, *en dessous* de la parité. L'écart : (1,10/1,16 − 1) × 100 = **−5,17 %**. Lecture : un euro n'achète que 1,10 dollar là où le panier en justifierait 1,16 — la devise de **base**, l'euro, est sous-évaluée de 5,17 % ; et le dollar, symétriquement, surévalué. Mon réflexe de vérification, qui évite toute inversion : je convertis le Big Mac européen au spot — 5,00 € × 1,10 = 5,50 \\$, moins cher que les 5,80 \\$ américains. Le panier est bon marché en Europe : signature d'une devise bon marché. Cohérent.

La portée, pour finir, car un jury attend la nuance : la PPA est une boussole de **très long terme**. Les prix des biens sont visqueux quand le change bouge à la milliseconde ; une grande partie du panier — services, loyers — ne s'arbitre pas par conteneur, et l'effet Balassa-Samuelson rend les pays riches durablement « chers » sans qu'aucun arbitrage ne corrige. Les études classiques donnent trois à cinq ans pour résorber la moitié d'un écart. Verdict : la PPA dit si une devise est chère ou bon marché — elle est à peu près muette sur ce qu'elle fera d'ici Noël.`,
    reponseModeleEn: `It is the **euro** that is undervalued, by about **5.2%** — and the reading direction is precisely where this question traps candidates.

The reasoning first. Purchasing power parity applies the law of one price: the same burger, produced locally on both sides, should cost the same once converted. The equalising rate is PPP = 5.80/5.00 = **1.16 dollars per euro** — homogeneous with the EUR/USD rate, the price of one euro in dollars.

Spot quotes 1.10, *below* parity. The gap: (1.10/1.16 − 1) × 100 = **−5.17%**. Reading: one euro buys only 1.10 dollars where the basket would justify 1.16 — the **base** currency, the euro, is undervalued by 5.17%; and the dollar, symmetrically, overvalued. My verification reflex, which prevents any inversion: I convert the European Big Mac at spot — €5.00 × 1.10 = \\$5.50, cheaper than the American \\$5.80. The basket is cheap in Europe: the signature of a cheap currency. Consistent.

The scope, finally, because a jury expects the nuance: PPP is a **very-long-term** compass. Goods prices are sticky while FX moves by the millisecond; a large part of the basket — services, rents — cannot be arbitraged by container, and the Balassa-Samuelson effect keeps rich countries durably "expensive" with no corrective arbitrage. Classic studies put three to five years on closing half a gap. Verdict: PPP says whether a currency is dear or cheap — it is roughly mute on what it will do by Christmas.`,
  },
  {
    id: 'm6-j-10',
    moduleId: M6,
    theme: 'parités économiques et carry trade',
    themeEn: 'economic parities and the carry trade',
    difficulte: 3,
    question: 'Le yen rémunère 0,5 %, le peso mexicain 10 %. Pourquoi tout le monde n\'emprunte-t-il pas l\'un pour placer dans l\'autre — free lunch ?',
    questionEn: 'The yen pays 0.5%, the Mexican peso 10%. Why does not everyone borrow one to invest in the other — free lunch?',
    plan: [
      'Nommer la stratégie : le carry trade, 9,5 points de portage par an',
      'Donner la réponse théorique : l\'UIP — le peso devrait se déprécier du différentiel',
      'Donner la réponse empirique : l\'UIP échoue (Fama 1984), le carry paie en moyenne — mais',
      'Conclure sur la distribution : skewness négative — pas un déjeuner gratuit, une prime d\'assurance',
    ],
    planEn: [
      'Name the strategy: the carry trade, 9.5 points of carry a year',
      'Give the theoretical answer: UIP — the peso should depreciate by the differential',
      'Give the empirical answer: UIP fails (Fama 1984), carry pays on average — but',
      'Conclude on the distribution: negative skewness — not a free lunch, an insurance premium',
    ],
    pointsAttendus: [
      "Identifier le carry trade : emprunter la devise de financement à 0,5 %, placer à 10 % — près de 9,5 points de portage tant que le change ne bouge pas",
      'La théorie (UIP) : ce différentiel devrait être effacé, en espérance, par une dépréciation du peso d\'environ 9,5 % par an — sinon avantage gratuit',
      "L'empirie : l'UIP est démentie à l'horizon des desks (forward premium puzzle, Fama 1984) — les devises à haut taux se déprécient moins que prévu, voire s'apprécient",
      "Le vrai prix : la distribution — skewness négative et queues épaisses ; chiffrer sur 1 M : +60 000 en année calme (8 %/2 %), −40 000 si la cible décroche de 10 %",
      'Le moment du crash : en régime risk-off, quand tout le reste du portefeuille souffre aussi — 2008, août 2024',
      "La conclusion : pas un free lunch — une prime de risque encaissée d'avance, dont l'addition arrive rarement mais brutalement",
    ],
    pointsAttendusEn: [
      'Identify the carry trade: borrow the funding currency at 0.5%, invest at 10% — nearly 9.5 points of carry as long as the rate does not move',
      'The theory (UIP): that differential should be erased, in expectation, by a peso depreciation of about 9.5% a year — otherwise free advantage',
      'The empirics: UIP fails at desk horizons (forward premium puzzle, Fama 1984) — high-rate currencies depreciate less than predicted, or even appreciate',
      'The true price: the distribution — negative skewness and fat tails; quantify on 1m: +60,000 in a calm year (8%/2%), −40,000 if the target drops 10%',
      'The crash timing: in risk-off regimes, when everything else in the portfolio suffers too — 2008, August 2024',
      'The conclusion: not a free lunch — a risk premium collected upfront, whose bill arrives rarely but brutally',
    ],
    bonus: [
      'Le bêta du mauvais signe : les régressions à la Fama trouvent des β souvent négatifs, de l\'ordre de −1 — mais des R² minuscules et des coefficients instables',
      "La phrase qui classe : « la volatilité historique d'un carry ment — le risque est dans le saut qui n'est pas encore dans l'échantillon »",
    ],
    bonusEn: [
      'The wrong-sign beta: Fama-style regressions find β often negative, on the order of −1 — but tiny R²s and unstable coefficients',
      'The line that ranks you: "the historical volatility of a carry lies — the risk is in the jump not yet in the sample"',
    ],
    reponseModele: `Ce que vous décrivez a un nom — le **carry trade** : emprunter le yen à 0,5 %, convertir, placer en pesos à 10 %, et empocher près de 9,5 points de portage par an tant que le change ne bouge pas. La question est de savoir qui paie ces 9,5 points.

La théorie répond d'abord : personne ne devrait les gagner. C'est la parité non couverte des taux — si le peso rémunère 9,5 points de plus, il devrait se **déprécier** d'environ autant, en espérance ; sinon, avantage gratuit. Mais l'empirie dément la théorie à l'horizon des desks : c'est le *forward premium puzzle* de Fama (1984) — sur des décennies, les devises à haut taux se sont dépréciées moins que prévu, parfois même appréciées. Le carry a donc historiquement payé **en moyenne**. Voilà pourquoi « tout le monde » le fait, effectivement, par vagues.

Alors, free lunch ? Non — et la réponse est dans la **distribution**, pas dans la moyenne. Chiffrons sur 1 M\\$ avec un portage de 6 points : année calme, +60 000 \\$ ; la devise cible décroche de 10 %, et le résultat devient 1 M × (0,06 − 0,10) = **−40 000 \\$**. Une seule mauvaise année efface les deux tiers d'une bonne — et les décrochages de devises à haut rendement dépassent souvent 10 %. Le profil est celui du ramasseur de pièces devant le rouleau compresseur : skewness négative, queues épaisses, et le crash survient en régime *risk-off* — 2008, août 2024 — exactement quand le reste du portefeuille souffre aussi.

Ma conclusion : ce n'est pas un déjeuner gratuit, c'est une **prime d'assurance encaissée d'avance**. Le marché vous paie 9,5 points par an pour porter le risque d'un saut rare et brutal. L'addition arrive rarement — mais elle arrive.`,
    reponseModeleEn: `What you describe has a name — the **carry trade**: borrow yen at 0.5%, convert, invest in pesos at 10%, and pocket nearly 9.5 points of carry a year as long as the exchange rate holds still. The question is who pays those 9.5 points.

Theory answers first: nobody should earn them. That is uncovered interest parity — if the peso pays 9.5 points more, it should **depreciate** by roughly as much, in expectation; otherwise, free advantage. But the data contradict the theory at desk horizons: the *forward premium puzzle* of Fama (1984) — across decades, high-rate currencies depreciated less than predicted, sometimes even appreciated. Carry has therefore historically paid **on average**. Which is why "everyone" does indeed do it, in waves.

So, free lunch? No — and the answer lies in the **distribution**, not the mean. Put numbers on \\$1m with 6 points of carry: calm year, +\\$60,000; the target currency drops 10%, and the result becomes 1m × (0.06 − 0.10) = **−\\$40,000**. One bad year erases two thirds of a good one — and high-yield currency sell-offs often exceed 10%. The profile is the coin-picker in front of the steamroller: negative skewness, fat tails, and the crash comes in risk-off regimes — 2008, August 2024 — exactly when the rest of the portfolio suffers too.

My conclusion: this is not a free lunch, it is an **insurance premium collected upfront**. The market pays you 9.5 points a year to carry the risk of a rare, brutal jump. The bill arrives seldom — but it arrives.`,
  },
  {
    id: 'm6-j-11',
    moduleId: M6,
    theme: 'parités économiques et carry trade',
    themeEn: 'economic parities and the carry trade',
    difficulte: 3,
    question: 'Pourquoi le carry trade a-t-il une skewness négative ?',
    questionEn: 'Why does the carry trade have negative skewness?',
    plan: [
      'Décrire le profil de gains : beaucoup de petits gains réguliers, de rares pertes massives',
      'Expliquer la source des petits gains : le différentiel, encaissé tant que rien ne se passe',
      'Expliquer la source du saut : le débouclage auto-entretenu de la devise de financement',
      'En tirer la leçon statistique : la volatilité historique ment, moyenne-variance ne suffit pas',
    ],
    planEn: [
      'Describe the payoff profile: many small regular gains, rare massive losses',
      'Explain the source of the small gains: the differential, collected as long as nothing happens',
      'Explain the source of the jump: the self-reinforcing unwind of the funding currency',
      'Draw the statistical lesson: historical volatility lies, mean-variance is not enough',
    ],
    pointsAttendus: [
      'Le gain du carry est borné et régulier : le différentiel de taux, quelques points par an, encaissé tant que le change est stable',
      "La perte, elle, est rare et massive : un décrochage de la devise cible — souvent plus de 10 % — efface des années de portage en quelques semaines",
      "Le mécanisme du saut est auto-entretenu : les pertes forcent des débouclages, qui font monter la devise de financement, qui aggrave les pertes des autres porteurs — 2008 (AUD/JPY −30 % en quelques mois), août 2024 (Nikkei −12 % le 5 août)",
      'D\'où une distribution asymétrique : skewness négative — la queue longue est du côté des pertes — et kurtosis élevé',
      "La conséquence : trois années calmes donnent un Sharpe flatteur et une volatilité trompeuse — le risque est dans le saut qui n'est pas encore dans l'échantillon",
      'Et le saut survient en régime risk-off, exactement quand le reste du portefeuille souffre : la diversification disparaît au pire moment',
    ],
    pointsAttendusEn: [
      'The carry gain is capped and regular: the rate differential, a few points a year, collected as long as the exchange rate is stable',
      'The loss is rare and massive: a sell-off in the target currency — often more than 10% — wipes out years of carry within weeks',
      'The jump mechanism is self-reinforcing: losses force unwinds, which push the funding currency up, which worsens the losses of other holders — 2008 (AUD/JPY −30% in a few months), August 2024 (Nikkei −12% on 5 August)',
      'Hence an asymmetric distribution: negative skewness — the long tail is on the loss side — and high kurtosis',
      'The consequence: three calm years give a flattering Sharpe and a deceptive volatility — the risk lies in the jump not yet in the sample',
      'And the jump comes in risk-off regimes, exactly when the rest of the portfolio suffers: diversification vanishes at the worst moment',
    ],
    bonus: [
      "L'image qui reste : « ramasser des pièces devant le rouleau compresseur » — petits gains certains, écrasement rare",
      'Préciser la lecture du signe : la skewness se lit du côté de la queue longue, pas du côté où l\'on gagne le plus souvent',
    ],
    bonusEn: [
      'The image that sticks: "picking up coins in front of a steamroller" — small certain gains, rare crushing',
      'Specify how to read the sign: skewness is read from the long-tail side, not from the side where you win most often',
    ],
    reponseModele: `Parce que ses gains et ses pertes ne sont pas fabriqués par la même machine. Le **gain** du carry est borné et régulier : c'est le différentiel de taux — six points par an dans l'exemple du cours —, encaissé mois après mois tant que le change ne bouge pas. Sur 1 M\\$, une année calme rapporte +60 000 \\$. La **perte**, elle, est rare et massive : un décrochage de la devise cible de 10 % transforme la même position en −40 000 \\$ — une seule mauvaise année mange les deux tiers d'une bonne, et les décrochages dépassent souvent 10 %.

Pourquoi le décrochage est-il si brutal ? Parce qu'il s'auto-entretient. Les premières pertes forcent des débouclages : il faut racheter la devise de financement pour rembourser. Ces rachats la font monter, ce qui aggrave les pertes des porteurs restants, qui débouclent à leur tour. Le rouleau compresseur accélère précisément quand tout le monde court vers la sortie : en 2008, les paires comme AUD/JPY perdent plus de 30 % en quelques mois ; le 5 août 2024, le débouclage du carry en yen emporte le Nikkei de plus de 12 % en une séance.

Statistiquement, cela dessine une distribution **asymétrique** : une masse de petits gains, une queue longue et épaisse du côté des pertes — skewness négative, kurtosis élevé. D'où le piège : mesurez un carry sur trois années calmes, vous obtenez un rendement régulier, une volatilité modeste, un Sharpe flatteur — tout est vrai, et tout est trompeur, car le saut n'est pas encore dans l'échantillon. Pire : il survient en régime *risk-off*, quand vos autres positions souffrent aussi.

La phrase qui résume : le carry ramasse des pièces devant un rouleau compresseur — et présenter sa performance en moyenne-variance sans mentionner l'asymétrie est le contresens qui disqualifie.`,
    reponseModeleEn: `Because its gains and its losses are not produced by the same machine. The carry's **gain** is capped and regular: the rate differential — six points a year in the course example — collected month after month as long as the exchange rate holds. On \\$1m, a calm year brings +\\$60,000. The **loss** is rare and massive: a 10% drop in the target currency turns the same position into −\\$40,000 — a single bad year eats two thirds of a good one, and sell-offs often exceed 10%.

Why is the drop so brutal? Because it feeds itself. The first losses force unwinds: the funding currency must be bought back to repay. Those buybacks push it higher, which worsens the losses of the remaining holders, who unwind in turn. The steamroller accelerates exactly when everyone runs for the exit: in 2008, pairs like AUD/JPY lost more than 30% in a few months; on 5 August 2024, the yen carry unwind took the Nikkei down more than 12% in one session.

Statistically, this draws an **asymmetric** distribution: a mass of small gains, a long, fat tail on the loss side — negative skewness, high kurtosis. Hence the trap: measure a carry over three calm years and you get steady returns, modest volatility, a flattering Sharpe — all true, and all misleading, because the jump is not yet in the sample. Worse: it arrives in risk-off regimes, when your other positions suffer too.

The summary line: carry picks up coins in front of a steamroller — and presenting its performance in mean-variance terms without mentioning the asymmetry is the disqualifying misreading.`,
  },
  {
    id: 'm6-j-12',
    moduleId: M6,
    theme: 'parités économiques et carry trade',
    themeEn: 'economic parities and the carry trade',
    difficulte: 3,
    question: 'Où sera EUR/USD dans six mois ? Et si vous ne savez pas — à quoi sert votre analyse ?',
    questionEn: 'Where will EUR/USD be in six months? And if you do not know — what is your analysis for?',
    plan: [
      'Assumer l\'humilité : à cet horizon, personne ne sait — et c\'est un résultat scientifique',
      'Citer Meese-Rogoff (1983) : les modèles structurels ne battent pas la marche aléatoire',
      'Expliquer pourquoi : un prix sur-déterminé — parités à long terme, taux et risk-on/off à court terme',
      'Donner la vraie réponse professionnelle : scénarios, positionnement, asymétries de risque',
    ],
    planEn: [
      'Own the humility: at that horizon, nobody knows — and that is a scientific result',
      'Quote Meese-Rogoff (1983): structural models do not beat the random walk',
      'Explain why: an over-determined price — parities long term, rates and risk-on/off short term',
      'Give the real professional answer: scenarios, positioning, risk asymmetries',
    ],
    pointsAttendus: [
      "Le résultat fondateur : Meese et Rogoff (1983) — à horizon de quelques trimestres, les modèles structurels de change ne battent pas une simple marche aléatoire",
      'La raison de fond : le change est sur-déterminé — trop de forces légitimes tirent dans des directions différentes, à des horizons différents',
      'Les ancres de très long terme : PPA, balances courantes, termes de l\'échange — lentes mais réelles',
      'Les moteurs du quotidien : différentiels de taux et surprises de banques centrales, statistiques macro, balancier risk-on/risk-off et devises refuges',
      "La réponse professionnelle : on ne prédit pas un niveau, on raisonne en scénarios, en positionnement du marché et en asymétries de risque — et on dimensionne les couvertures en conséquence",
      "Refuser un chiffre sec n'est pas une esquive : c'est l'équivalent FX des décomptes SPIVA — l'humilité documentée vaut mieux qu'une fausse précision",
    ],
    pointsAttendusEn: [
      'The founding result: Meese and Rogoff (1983) — at horizons of a few quarters, structural FX models do not beat a simple random walk',
      'The deep reason: FX is over-determined — too many legitimate forces pull in different directions, at different horizons',
      'The very-long-term anchors: PPP, current accounts, terms of trade — slow but real',
      'The daily drivers: rate differentials and central bank surprises, macro releases, the risk-on/risk-off pendulum and safe-haven currencies',
      'The professional answer: you do not predict a level, you reason in scenarios, market positioning and risk asymmetries — and size hedges accordingly',
      'Refusing a dry number is not a dodge: it is the FX equivalent of the SPIVA scorecards — documented humility beats false precision',
    ],
    bonus: [
      "Relier aux parités : la PPA donne le « cher ou bon marché » (l'euro sous-évalué de 5,17 % au sens Big Mac), pas le timing",
      "La nuance d'expert : l'imprévisibilité du niveau n'interdit pas de travailler — couvertures, options, scénarios de stress sur les pegs et le positionnement spéculatif",
    ],
    bonusEn: [
      'Link to parities: PPP gives the "dear or cheap" (the euro undervalued by 5.17% in Big Mac terms), not the timing',
      'The expert nuance: unpredictability of the level does not forbid working — hedges, options, stress scenarios on pegs and speculative positioning',
    ],
    reponseModele: `Je vais vous répondre en professionnel : je ne sais pas — et je peux vous démontrer que personne ne sait. Le résultat fondateur date de 1983 : Meese et Rogoff ont montré qu'à horizon de quelques trimestres, les modèles structurels de change — taux, monnaie, balances — ne battent pas une simple **marche aléatoire**. Quarante ans plus tard, ce constat tient toujours l'essentiel de sa force. C'est l'équivalent FX des décomptes SPIVA sur la gestion active : une humilité documentée.

Pourquoi cette résistance à la prévision ? Parce que le change est un prix **sur-déterminé**. À très long terme, il gravite autour de ses ancres économiques — la PPA, les balances courantes, les termes de l'échange : lentes, mais réelles. Au quotidien, il vit d'autre chose — différentiels de taux, surprises de banques centrales, statistiques macro, et le balancier *risk-on/risk-off* qui fait monter yen et franc suisse les mauvais jours. Trop de forces légitimes, à trop d'horizons différents, pour qu'un modèle unique les départage.

Mais ne pas prédire n'est pas ne rien faire — et c'est là que mon analyse sert. D'abord, situer : au sens de la PPA, l'euro est-il cher ou bon marché ? Ensuite, cartographier les **scénarios** : que fait la paire si la Fed surprend, si le risque se retourne, si le positionnement spéculatif est déjà saturé d'un côté ? Enfin, mesurer les **asymétries** : où sont les pertes bornées, où sont les sauts possibles — et dimensionner couvertures et options en conséquence.

La chute : sur le change, le professionnel ne vend pas une prévision — il vend une **cartographie des risques**. Quiconque vous donne un chiffre au pip près dans six mois vous dit surtout qu'il n'a pas lu Meese et Rogoff.`,
    reponseModeleEn: `Let me answer as a professional: I do not know — and I can prove to you that nobody does. The founding result dates from 1983: Meese and Rogoff showed that at horizons of a few quarters, structural exchange rate models — rates, money, balances — do not beat a simple **random walk**. Forty years on, that finding retains most of its force. It is the FX equivalent of the SPIVA scorecards on active management: documented humility.

Why this resistance to forecasting? Because FX is an **over-determined** price. At very long horizons it gravitates around its economic anchors — PPP, current accounts, terms of trade: slow, but real. Day to day, it lives off something else — rate differentials, central bank surprises, macro releases, and the risk-on/risk-off pendulum that lifts the yen and the Swiss franc on bad days. Too many legitimate forces, at too many horizons, for a single model to arbitrate.

But not predicting is not doing nothing — and that is where my analysis earns its keep. First, situate: in PPP terms, is the euro dear or cheap? Then, map the **scenarios**: what does the pair do if the Fed surprises, if risk turns, if speculative positioning is already saturated on one side? Finally, measure the **asymmetries**: where are losses bounded, where are jumps possible — and size hedges and options accordingly.

The closing line: in FX, the professional does not sell a forecast — he sells a **map of the risks**. Anyone who gives you a six-month number to the pip is mostly telling you he has not read Meese and Rogoff.`,
  },
  {
    id: 'm6-j-13',
    moduleId: M6,
    theme: 'régimes de change',
    themeEn: 'exchange rate regimes',
    difficulte: 2,
    question: 'Exposez-moi le triangle de Mundell — et classez-y les États-Unis, Hong Kong et la Chine.',
    questionEn: 'Walk me through the Mundell trilemma — and place the United States, Hong Kong and China in it.',
    plan: [
      'Énoncer le théorème : change fixe, capitaux libres, politique monétaire autonome — deux sur trois, jamais les trois',
      'Démontrer en une phrase : capitaux libres + taux différents de l\'ancre = flux qui font sauter la parité',
      'Classer les trois cas : États-Unis, Hong Kong, Chine — chacun sacrifie un sommet différent',
      'Conclure : l\'outil qui classe toute question de change',
    ],
    planEn: [
      'State the theorem: fixed exchange rate, free capital flows, autonomous monetary policy — two out of three, never all three',
      'Prove it in one sentence: free capital + rates different from the anchor = flows that break the parity',
      'Classify the three cases: United States, Hong Kong, China — each sacrifices a different corner',
      'Conclude: the tool that sorts every FX question',
    ],
    pointsAttendus: [
      'Les trois objectifs désirables : un change fixe (stabilité commerciale), la libre circulation des capitaux (financement), une politique monétaire autonome (taux réglés sur sa conjoncture)',
      "Le théorème, formalisé à partir des travaux de Mundell dans les années 1960 : on ne peut en obtenir que deux à la fois",
      "La démonstration en une phrase : si les capitaux circulent librement et que vos taux diffèrent de ceux de l'ancre, l'argent afflue ou fuit pour capter l'écart et la parité saute — à moins de copier les taux de l'ancre, et alors votre politique monétaire n'existe plus",
      'États-Unis (et zone euro) : capitaux libres + politique autonome — le change flotte',
      'Hong Kong : capitaux libres + change fixe (caisse d\'émission depuis 1983, bande 7,75–7,85) — ses taux suivent la Fed, quelle que soit la conjoncture locale',
      'Chine : change piloté + politique autonome — au prix du contrôle des capitaux',
    ],
    pointsAttendusEn: [
      'The three desirable goals: a fixed exchange rate (trade stability), free capital movement (financing), an autonomous monetary policy (rates set for your own cycle)',
      'The theorem, formalised from Mundell\'s work in the 1960s: you can only have two at a time',
      'The one-sentence proof: if capital moves freely and your rates differ from the anchor\'s, money floods in or out to capture the gap and the parity breaks — unless your rates copy the anchor\'s, and then your monetary policy no longer exists',
      'United States (and euro area): free capital + autonomous policy — the currency floats',
      'Hong Kong: free capital + fixed rate (currency board since 1983, 7.75–7.85 band) — its rates follow the Fed, whatever the local cycle',
      'China: managed exchange rate + autonomous policy — at the price of capital controls',
    ],
    bonus: [
      "Ajouter le fear of floating (Calvo-Reinhart) : nombre de pays officiellement flottants interviennent massivement — régime déclaré et régime pratiqué diffèrent",
      "Anticiper la suite : c'est ce triangle qui s'est refermé sur la livre en 1992 — taux Bundesbank élevés, récession britannique, parité intenable",
    ],
    bonusEn: [
      'Add fear of floating (Calvo-Reinhart): many officially floating countries intervene heavily — declared and practised regimes differ',
      'Anticipate the sequel: this is the triangle that closed on sterling in 1992 — high Bundesbank rates, British recession, untenable parity',
    ],
    reponseModele: `Un pays peut désirer trois choses. Un **change fixe** — la stabilité pour son commerce et sa dette. La **libre circulation des capitaux** — l'accès au financement extérieur. Une **politique monétaire autonome** — des taux réglés sur sa propre conjoncture. Le triangle d'incompatibilité, formalisé à partir des travaux de Mundell dans les années 1960, énonce qu'on ne peut en obtenir que **deux à la fois** — jamais les trois.

La démonstration tient en une phrase : si les capitaux circulent librement et que vos taux diffèrent de ceux de la devise d'ancrage, l'argent afflue ou fuit pour capter l'écart, et la parité saute — à moins que vos taux ne copient ceux de l'ancre, et alors votre politique monétaire n'existe plus.

Les trois sommets abandonnés ont chacun leur incarnation. Les **États-Unis** — et la zone euro — gardent capitaux libres et politique autonome : le change flotte, c'est le prix payé. **Hong Kong** garde capitaux libres et change fixe — une caisse d'émission arrimée au dollar depuis 1983, dans la bande 7,75–7,85 : ses taux suivent la Fed, quelle que soit la conjoncture locale ; la politique monétaire est le sommet sacrifié. La **Chine** garde un change piloté et une politique autonome — au prix du contrôle des capitaux, le troisième sommet.

J'ajoute la nuance qui distingue : le régime *déclaré* et le régime *pratiqué* diffèrent souvent — le *fear of floating* de Calvo et Reinhart décrit ces pays officiellement flottants qui interviennent massivement, parce que leurs entreprises sont endettées en dollars.

La chute : devant n'importe quelle question de change — un peg qui craque, une banque centrale coincée, une crise émergente —, je dessine d'abord ce triangle. C'est l'outil qui classe tout : il dit ce qu'un pays a choisi, donc ce qu'il a renoncé à défendre.`,
    reponseModeleEn: `A country can want three things. A **fixed exchange rate** — stability for its trade and its debt. **Free capital movement** — access to external financing. An **autonomous monetary policy** — rates set for its own cycle. The impossible trinity, formalised from Mundell's work in the 1960s, states that you can only have **two at a time** — never all three.

The proof fits in one sentence: if capital moves freely and your rates differ from the anchor currency's, money floods in or out to capture the gap, and the parity breaks — unless your rates copy the anchor's, in which case your monetary policy no longer exists.

Each abandoned corner has its incarnation. The **United States** — and the euro area — keep free capital and autonomous policy: the currency floats, that is the price paid. **Hong Kong** keeps free capital and a fixed rate — a currency board pegged to the dollar since 1983, in the 7.75–7.85 band: its rates follow the Fed whatever the local cycle; monetary policy is the sacrificed corner. **China** keeps a managed exchange rate and an autonomous policy — at the price of capital controls, the third corner.

I add the distinguishing nuance: the *declared* regime and the *practised* regime often differ — Calvo and Reinhart's *fear of floating* describes officially floating countries that intervene heavily, because their companies are indebted in dollars.

The closing line: facing any FX question — a cracking peg, a cornered central bank, an emerging crisis — I draw this triangle first. It is the tool that sorts everything: it says what a country has chosen, hence what it has given up defending.`,
  },
  {
    id: 'm6-j-14',
    moduleId: M6,
    theme: 'régimes de change',
    themeEn: 'exchange rate regimes',
    difficulte: 4,
    question: 'Vous dirigez une banque centrale dont la parité fixe est attaquée. Que faites-vous — et qu\'est-ce qui marche vraiment ?',
    questionEn: 'You run a central bank whose fixed parity is under attack. What do you do — and what actually works?',
    plan: [
      'Diagnostiquer d\'abord : les fondamentaux sont-ils compatibles avec la parité ? Tout en découle',
      'Inventorier l\'arsenal : réserves, hausses de taux, contrôles de capitaux — et le coût de chacun',
      "Chiffrer le rapport de force : 7 500 Md$/jour contre des réserves finies, la Suède à 500 %",
      'Trancher en stratège : si les fondamentaux condamnent la parité, sortir tôt et en ordre vaut mieux que capituler en panique',
    ],
    planEn: [
      'Diagnose first: are the fundamentals compatible with the parity? Everything follows from that',
      'Inventory the arsenal: reserves, rate hikes, capital controls — and the cost of each',
      'Quantify the balance of power: \\$7.5tn a day against finite reserves, Sweden at 500%',
      'Decide as a strategist: if fundamentals doom the parity, exiting early and in order beats capitulating in panic',
    ],
    pointsAttendus: [
      "Commencer par le diagnostic : si les fondamentaux (inflation, déficit, récession) condamnent la parité, la défense est perdue d'avance — taux et réserves n'achètent que du temps",
      'Arme 1, les réserves : finies et publiées — le marché compte ; face à 7 500 Md$/jour de volumes, même les ~3 000 Md$ chinois ne pèsent que quelques séances',
      "Arme 2, les taux : rendre la vente à découvert coûteuse — la Riksbank à 500 % en 1992, soit ≈ 1,4 % par jour ; mais si le marché attend −10 % sous une semaine, le pari spéculatif reste gagnant, et des taux à trois chiffres asphyxient l'économie en quelques jours",
      "Comprendre l'asymétrie adverse : pour le spéculateur, c'est un pari à sens unique — perte bornée au portage si le peg tient, gain de 15 à 30 % s'il cède",
      'Arme 3, les contrôles de capitaux : efficaces mais coûteux — on abandonne un sommet du triangle de Mundell, avec le signal désastreux qui va avec',
      "La décision de stratège : si la parité est intenable, mieux vaut sortir tôt, en ordre et à ses conditions — la livre a brûlé réserves et crédibilité avant de sortir le soir même (16 septembre 1992) ; Hong Kong, fondamentaux solides, a tenu en 1997-98",
    ],
    pointsAttendusEn: [
      'Start with the diagnosis: if fundamentals (inflation, deficit, recession) doom the parity, the defence is lost in advance — rates and reserves only buy time',
      'Weapon 1, reserves: finite and published — the market counts; against \\$7.5tn a day of volumes, even China\'s ~\\$3tn weighs only a few sessions',
      'Weapon 2, rates: make short selling expensive — the Riksbank at 500% in 1992, i.e. ≈ 1.4% per day; but if the market expects −10% within a week, the speculative bet stays profitable, and triple-digit rates asphyxiate the economy within days',
      'Understand the adverse asymmetry: for the speculator it is a one-way bet — loss bounded at the carry if the peg holds, a 15-to-30% gain if it breaks',
      'Weapon 3, capital controls: effective but costly — you abandon a corner of the Mundell triangle, with the disastrous signal that goes with it',
      'The strategist\'s decision: if the parity is untenable, better to exit early, in order, on your own terms — sterling burned reserves and credibility before leaving that very evening (16 September 1992); Hong Kong, with solid fundamentals, held in 1997-98',
    ],
    bonus: [
      'Distinguer intervention stérilisée et non stérilisée : agir sur le change sans toucher aux conditions monétaires internes — au prix d\'une puissance moindre',
      "L'asymétrie structurelle : freiner sa devise se fait en monnaie qu'on imprime (munitions illimitées, bilan qui enfle — la BNS d'avant 2015) ; la défendre se fait en réserves finies",
    ],
    bonusEn: [
      'Distinguish sterilised from unsterilised intervention: acting on the currency without touching domestic monetary conditions — at the price of less power',
      'The structural asymmetry: capping your currency is done in money you print (unlimited ammunition, swelling balance sheet — the pre-2015 SNB); defending it is done with finite reserves',
    ],
    reponseModele: `Ma première décision n'est pas une intervention — c'est un **diagnostic**. Mes fondamentaux sont-ils compatibles avec la parité ? Si l'inflation, le déficit ou la récession la condamnent, tout ce qui suit n'achète que du temps : on ne gagne durablement contre le marché que si les fondamentaux sont de votre côté.

L'arsenal, ensuite, dans l'ordre où on le brûle. **Les réserves** : je vends mes dollars pour racheter ma devise. Problème — elles sont finies *et publiées* : le marché compte mes munitions en temps réel, face à un marché qui traite 7 500 Md\\$ par jour ; même le trésor chinois, environ 3 000 Md\\$, ne pèse que quelques séances de volume global. **Les taux** : je rends la vente à découvert ruineuse. La Suède a porté son taux marginal à **500 %** en septembre 1992 — environ 1,4 % de portage par jour pour le vendeur. Faites l'arithmétique du spéculateur : s'il attend une dévaluation de 10 % sous une semaine, son pari reste gagnant — et des taux à trois chiffres asphyxient mes banques en quelques jours. La Suède a capitulé en novembre. **Les contrôles de capitaux**, enfin : efficaces, mais j'abandonne un sommet du triangle de Mundell, avec le signal désastreux qui l'accompagne.

Et je n'oublie jamais l'asymétrie adverse : pour l'attaquant, c'est un pari à sens unique — perte bornée au portage si je tiens, 15 à 30 % de gain si je cède. Plus mes réserves fondent, plus j'attire de vendeurs.

D'où ma vraie réponse, celle d'un stratège : si le diagnostic dit que la parité est morte, je choisis **l'heure de ma défaite** — sortir tôt, en ordre, à mes conditions, plutôt que brûler réserves et crédibilité pour sortir quand même, comme la Banque d'Angleterre le 16 septembre 1992 : taux de 10 à 12 %, promesse de 15 %, sortie le soir même. Si les fondamentaux tiennent — Hong Kong en 1997-98 —, alors je défends, et je gagne.`,
    reponseModeleEn: `My first decision is not an intervention — it is a **diagnosis**. Are my fundamentals compatible with the parity? If inflation, the deficit or a recession condemn it, everything that follows only buys time: you only beat the market durably when the fundamentals are on your side.

The arsenal next, in the order it gets burned. **Reserves**: I sell my dollars to buy back my currency. Problem — they are finite *and published*: the market counts my ammunition in real time, against a market trading \\$7.5tn a day; even China's war chest, about \\$3tn, weighs only a few sessions of global volume. **Rates**: I make short selling ruinous. Sweden took its marginal rate to **500%** in September 1992 — about 1.4% of carry per day for the seller. Do the speculator's arithmetic: if he expects a 10% devaluation within a week, his bet stays profitable — and triple-digit rates asphyxiate my banks within days. Sweden capitulated in November. **Capital controls**, finally: effective, but I abandon a corner of the Mundell triangle, with the disastrous signal that comes with it.

And I never forget the adverse asymmetry: for the attacker, this is a one-way bet — loss bounded at the carry if I hold, a 15-to-30% gain if I fold. The faster my reserves melt, the more sellers I attract.

Hence my real answer, a strategist's: if the diagnosis says the parity is dead, I choose **the hour of my defeat** — exit early, in order, on my terms, rather than burn reserves and credibility only to exit anyway, like the Bank of England on 16 September 1992: rates from 10 to 12%, a promise of 15%, out that very evening. If the fundamentals hold — Hong Kong in 1997-98 — then I defend, and I win.`,
  },
  {
    id: 'm6-j-15',
    moduleId: M6,
    theme: 'régimes de change',
    themeEn: 'exchange rate regimes',
    difficulte: 3,
    question: 'Pourquoi l\'abandon du plancher du franc suisse, le 15 janvier 2015, a-t-il ruiné des courtiers ?',
    questionEn: 'Why did the abandonment of the Swiss franc floor on 15 January 2015 ruin brokers?',
    plan: [
      'Planter le décor : un plancher de 1,20 défendu depuis 2011 — contre l\'appréciation, en imprimant des francs',
      'Raconter la journée : abandon sans préavis à 10 h 30, −30 % en quelques minutes, pas de prix intermédiaires',
      'Expliquer la ruine : stops inopérants, comptes clients négatifs à fort levier, pertes absorbées par les courtiers',
      'Tirer la leçon : un peg ne supprime pas le risque, il le comprime en un saut',
    ],
    planEn: [
      'Set the scene: a 1.20 floor defended since 2011 — against appreciation, by printing francs',
      'Tell the day: abandoned without warning at 10:30, −30% in minutes, no intermediate prices',
      'Explain the ruin: stops inoperative, leveraged client accounts negative, losses absorbed by brokers',
      'Draw the lesson: a peg does not remove risk, it compresses it into a jump',
    ],
    pointsAttendus: [
      'Le contexte : depuis 2011, la BNS défendait un plancher EUR/CHF de 1,20 — non pour soutenir sa devise mais pour freiner son appréciation de valeur refuge, en imprimant des francs et en accumulant des réserves colossales',
      "Le 15 janvier 2015 à 10 h 30, sans préavis, elle abandonne : l'EUR/CHF s'effondre d'environ 30 % en quelques minutes, touchant des niveaux proches de 0,85 avant de se stabiliser vers la parité",
      "Le détail qui tue : il n'y avait plus de prix entre 1,20 et le fond du trou — les stops ne servent à rien quand le marché saute sans coter",
      'La transmission aux courtiers : clientèle retail à fort levier, comptes virant massivement négatifs, pertes légalement ou commercialement absorbées par les brokers — Alpari UK en faillite, FXCM sauvé par un prêt d\'urgence',
      "La leçon distributionnelle : des années de volatilité quasi nulle, puis −30 % en une matinée — un change administré comprime le risque en queue de distribution, il ne le supprime jamais",
      "Le paradoxe : la BNS imprimait sa propre monnaie — munitions « illimitées » ; c'est son bilan et son choix politique qui ont cédé, pas ses réserves",
    ],
    pointsAttendusEn: [
      'The context: since 2011, the SNB had defended a 1.20 EUR/CHF floor — not to support its currency but to curb its safe-haven appreciation, by printing francs and accumulating colossal reserves',
      'On 15 January 2015 at 10:30, without warning, it gave up: EUR/CHF collapsed about 30% in minutes, touching levels near 0.85 before stabilising around parity',
      'The killer detail: there were no prices left between 1.20 and the bottom of the hole — stops are useless when the market jumps without quoting',
      'The transmission to brokers: highly leveraged retail clients, accounts swinging massively negative, losses legally or commercially absorbed by the brokers — Alpari UK bankrupt, FXCM saved by an emergency loan',
      'The distributional lesson: years of near-zero volatility, then −30% in one morning — an administered exchange rate compresses risk into the tail of the distribution, it never removes it',
      'The paradox: the SNB was printing its own currency — "unlimited" ammunition; it was its balance sheet and its political choice that gave way, not its reserves',
    ],
    bonus: [
      "Le contraste avec 1992 : la livre défendait sa devise avec des réserves finies ; la BNS combattait l'appréciation en imprimant — et a quand même capitulé : aucun peg n'est éternel, dans aucun sens",
      "Le pont vers le module 2 : la distribution d'un peg est l'anti-gaussienne par excellence — l'échantillon calme ne contient pas l'événement qui compte",
    ],
    bonusEn: [
      'The contrast with 1992: sterling defended its currency with finite reserves; the SNB fought appreciation by printing — and still capitulated: no peg is eternal, in either direction',
      'The bridge to module 2: a peg\'s distribution is the anti-Gaussian par excellence — the calm sample does not contain the event that matters',
    ],
    reponseModele: `Parce que ce jour-là, le marché n'a pas baissé — il a **sauté**, et tout le système de protection du courtage repose sur l'hypothèse qu'un prix existe à chaque instant.

Le décor : depuis 2011, la Banque nationale suisse défendait un plancher de 1,20 franc pour un euro — non pour soutenir sa devise, mais pour freiner son appréciation de valeur refuge, en *imprimant* des francs et en accumulant des réserves colossales. Des munitions en théorie illimitées : le marché dormait dessus, volatilité quasi nulle.

Le 15 janvier 2015 à 10 h 30, sans préavis, la BNS abandonne. L'EUR/CHF s'effondre d'environ **30 % en quelques minutes**, touchant des niveaux proches de 0,85 avant de se stabiliser vers la parité. Le détail décisif : entre 1,20 et le fond du trou, il n'y avait **plus de prix**. Pas de cotations intermédiaires, donc pas d'exécution possible — les stops, qui promettent de couper une position « au niveau choisi », n'ont rien coupé du tout.

La chaîne de ruine, ensuite. La clientèle des courtiers FX de détail travaillait à fort levier : sur un compte à effet 50, un saut de 30 % ne met pas le compte à zéro — il le met massivement *négatif*. Et ces pertes au-delà du dépôt, les courtiers ont dû largement les absorber : Alpari UK a fait faillite, FXCM — l'un des plus gros au monde — n'a survécu qu'à un prêt d'urgence.

La leçon, qui dépasse le cas suisse : un change administré affiche des années de variance nulle, puis rend tout le risque en une matinée. **Un peg ne supprime pas le risque de change — il le comprime en un saut rare et brutal.** Et même une banque centrale qui imprime ses munitions peut choisir de capituler : son bilan et sa politique ont des limites que le marché ne voit pas venir.`,
    reponseModeleEn: `Because that day, the market did not fall — it **jumped**, and the entire protection system of brokerage rests on the assumption that a price exists at every moment.

The scene: since 2011, the Swiss National Bank had defended a floor of 1.20 francs per euro — not to support its currency, but to curb its safe-haven appreciation, by *printing* francs and accumulating colossal reserves. Theoretically unlimited ammunition: the market slept on it, volatility near zero.

On 15 January 2015 at 10:30, without warning, the SNB gave up. EUR/CHF collapsed by about **30% in a few minutes**, touching levels near 0.85 before stabilising around parity. The decisive detail: between 1.20 and the bottom of the hole, there were **no prices left**. No intermediate quotes, hence no possible execution — stops, which promise to cut a position "at the chosen level", cut nothing at all.

Then the chain of ruin. Retail FX clients traded on high leverage: on a 50-to-1 account, a 30% jump does not take the account to zero — it takes it massively *negative*. And those losses beyond the deposit largely fell on the brokers: Alpari UK went bankrupt; FXCM — one of the world's largest — survived only thanks to an emergency loan.

The lesson, beyond the Swiss case: an administered exchange rate posts years of zero variance, then returns all the risk in one morning. **A peg does not remove currency risk — it compresses it into a rare, brutal jump.** And even a central bank that prints its own ammunition can choose to capitulate: its balance sheet and its politics have limits the market does not see coming.`,
  },
  {
    id: 'm6-j-16',
    moduleId: M6,
    theme: 'régimes de change',
    themeEn: 'exchange rate regimes',
    difficulte: 4,
    question: "L'euro élimine-t-il le risque de change ?",
    questionEn: 'Does the euro eliminate currency risk?',
    plan: [
      'Découper la question : entre membres, face au reste du monde — deux réponses différentes',
      'Entre membres : des pegs irrévocables — plus de cours, plus de dévaluation possible',
      'Montrer la métamorphose : la pression migre vers les spreads souverains — BTP-Bund > 500 pb en 2011-2012',
      'Conclure : le risque ne s\'est pas évaporé, il a changé de forme — et l\'ajustement réel passe par la dévaluation interne',
    ],
    planEn: [
      'Split the question: between members, against the rest of the world — two different answers',
      'Between members: irrevocable pegs — no rate left, no devaluation possible',
      'Show the metamorphosis: pressure migrates to sovereign spreads — BTP-Bund > 500bp in 2011-2012',
      'Conclude: the risk has not evaporated, it has changed form — and real adjustment goes through internal devaluation',
    ],
    pointsAttendus: [
      'Face au reste du monde, rien n\'est éliminé : EUR/USD flotte — une trésorerie en dollars reste exposée comme avant',
      'Entre membres : une union monétaire est un ensemble de pegs irrévocables fondus dans une monnaie commune — le risque de cours de change interne a bien disparu',
      "Mais l'amortisseur a disparu avec lui : l'Italie ne peut plus dévaluer pour restaurer sa compétitivité face à l'Allemagne",
      'La pression migre vers la soupape restante : les spreads souverains — OAT-Bund, BTP-Bund au-delà de 500 pb en 2010-2012, quand le marché testait l\'irrévocabilité des parités internes',
      "L'ajustement réel ne peut plus passer que par les prix et les salaires — la dévaluation interne, plus lente et douloureuse qu'une dévaluation de change",
      "La synthèse : à l'intérieur de la zone euro, le risque de change ne s'est pas évaporé — il s'est métamorphosé en risque souverain",
    ],
    pointsAttendusEn: [
      'Against the rest of the world, nothing is eliminated: EUR/USD floats — a dollar cash flow remains as exposed as before',
      'Between members: a monetary union is a set of irrevocable pegs melted into a common currency — internal exchange rate risk has indeed disappeared',
      'But the shock absorber disappeared with it: Italy can no longer devalue to restore competitiveness against Germany',
      'Pressure migrates to the remaining valve: sovereign spreads — OAT-Bund, BTP-Bund beyond 500bp in 2010-2012, when the market was testing the irrevocability of internal parities',
      'Real adjustment can only go through prices and wages — internal devaluation, slower and more painful than a currency devaluation',
      'The synthesis: inside the euro area, currency risk has not evaporated — it has metamorphosed into sovereign risk',
    ],
    bonus: [
      "Préciser que l'euro ne mutualise pas les dettes : chaque État emprunte sous sa propre signature — c'est précisément pourquoi le spread peut exister",
      'Le parallèle de structure : un peg ordinaire comprime le risque en saut de dévaluation ; une union le déplace vers un autre marché — dans les deux cas, le risque se conserve, il ne s\'annule pas',
    ],
    bonusEn: [
      'Specify that the euro does not mutualise debts: each state borrows under its own signature — which is precisely why the spread can exist',
      'The structural parallel: an ordinary peg compresses risk into a devaluation jump; a union shifts it to another market — in both cases risk is conserved, not cancelled',
    ],
    reponseModele: `La question mérite d'être découpée, car elle a deux réponses. **Face au reste du monde**, rien n'est éliminé : l'euro flotte contre le dollar, le yen, la livre — l'exportateur de la zone qui facture en dollars porte exactement le même risque qu'avant.

**Entre membres**, la réponse est plus subtile. Vu du marché des changes, une union monétaire est un ensemble de **pegs irrévocables** : le franc, la lire et le mark ont été fixés une fois pour toutes, puis fondus dans une monnaie commune. Le risque de *cours* interne a bien disparu — il n'y a plus de cours. Mais l'amortisseur a disparu avec lui : l'Italie ne peut plus dévaluer pour restaurer sa compétitivité face à l'Allemagne.

Or la pression économique, elle, n'a pas disparu — elle a cherché la soupape restante. Ce que le marché ne peut plus exprimer en parités, il l'exprime en **primes de risque sur les dettes publiques** : les spreads souverains, l'écart OAT-Bund, le BTP-Bund. En 2010-2012, quand le BTP-Bund a dépassé **500 points de base**, c'est l'irrévocabilité des parités internes que le marché testait — une attaque spéculative, transposée du marché des changes au marché obligataire. Et l'ajustement réel ne peut plus passer que par les prix et les salaires : la « dévaluation interne », autrement plus lente et douloureuse qu'une dévaluation de change.

Ma synthèse tient en une phrase : à l'intérieur de la zone euro, le risque de change ne s'est pas évaporé — il s'est **métamorphosé en risque souverain**. C'est une loi plus générale que l'euro : un régime de change ne détruit jamais le risque, il choisit seulement la forme sous laquelle il se manifeste — saut de dévaluation pour un peg, spread souverain pour une union.`,
    reponseModeleEn: `The question deserves to be split, because it has two answers. **Against the rest of the world**, nothing is eliminated: the euro floats against the dollar, the yen, the pound — a euro area exporter invoicing in dollars carries exactly the same risk as before.

**Between members**, the answer is subtler. Seen from the FX market, a monetary union is a set of **irrevocable pegs**: the franc, the lira and the mark were fixed once and for all, then melted into a common currency. Internal *price* risk has indeed disappeared — there is no rate left. But the shock absorber disappeared with it: Italy can no longer devalue to restore its competitiveness against Germany.

Yet the economic pressure has not disappeared — it found the remaining valve. What the market can no longer express in parities, it expresses in **risk premia on public debt**: sovereign spreads, OAT-Bund, BTP-Bund. In 2010-2012, when BTP-Bund exceeded **500 basis points**, it was the irrevocability of the internal parities the market was testing — a speculative attack, transposed from the currency market to the bond market. And real adjustment can only go through prices and wages: "internal devaluation", far slower and more painful than a currency devaluation.

My synthesis fits in one sentence: inside the euro area, currency risk has not evaporated — it has **metamorphosed into sovereign risk**. And that is a law more general than the euro: an exchange rate regime never destroys risk, it merely chooses the form in which it shows up — a devaluation jump for a peg, a sovereign spread for a union.`,
  },
  {
    id: 'm6-j-17',
    moduleId: M6,
    theme: 'matières premières',
    themeEn: 'commodities',
    difficulte: 1,
    question: 'Pourquoi ne peut-on pas valoriser un baril de pétrole comme une action ?',
    questionEn: 'Why can a barrel of oil not be valued like a share?',
    plan: [
      'Rappeler le principe des modules précédents : action et obligation valent leurs flux futurs actualisés',
      'Constater l\'impossibilité : un baril ne verse rien — il coûte à détenir',
      'En tirer le mode de formation du prix : équilibre physique offre-demande et anticipations',
      'Dérouler les trois conséquences : stockage central, saisonnalité, géopolitique',
    ],
    planEn: [
      'Recall the principle from previous modules: shares and bonds are worth their discounted future cash flows',
      'Note the impossibility: a barrel pays nothing — it costs to hold',
      'Derive how the price forms: physical supply-demand equilibrium and expectations',
      'Unfold the three consequences: storage is central, seasonality, geopolitics',
    ],
    pointsAttendus: [
      'Le réflexe des modules 3 et 4 : une action vaut ses flux futurs actualisés, une obligation aussi — le DCF exige des flux',
      "Un baril ne verse ni dividende ni coupon — il coûte au contraire : stockage, assurance, transport ; sans flux, pas de valeur fondamentale par actualisation",
      'Son prix est un pur équilibre entre offre physique, demande physique et anticipations',
      'Conséquence 1 : le stockage est central — son coût sculpte la courbe des prix à terme (contango/backwardation)',
      'Conséquence 2 : la saisonnalité est réelle — gaz l\'hiver, essence l\'été, récoltes à date fixe',
      "Conséquence 3 : la géopolitique est un facteur de prix de premier rang — offre concentrée sur peu de pays",
    ],
    pointsAttendusEn: [
      'The reflex from modules 3 and 4: a share is worth its discounted future cash flows, so is a bond — a DCF requires cash flows',
      'A barrel pays neither dividend nor coupon — it costs instead: storage, insurance, transport; without flows, no fundamental value by discounting',
      'Its price is a pure equilibrium between physical supply, physical demand and expectations',
      'Consequence 1: storage is central — its cost sculpts the forward price curve (contango/backwardation)',
      'Consequence 2: seasonality is real — gas in winter, gasoline in summer, harvests on fixed dates',
      'Consequence 3: geopolitics is a first-rank price factor — supply concentrated in few countries',
    ],
    bonus: [
      "Étendre à l'or : même absence de flux — sa grille de lecture est le coût d'opportunité face au taux réel, pas un DCF",
      "Préciser l'accès : détenir le physique est un métier (Glencore, Vitol) — pour les autres, l'exposition passe par les futures, avec le roll comme prix de la durée",
    ],
    bonusEn: [
      'Extend to gold: same absence of flows — its reading grid is opportunity cost against the real rate, not a DCF',
      'Specify access: holding the physical is a profession (Glencore, Vitol) — for everyone else, exposure goes through futures, with the roll as the price of duration',
    ],
    reponseModele: `Parce que toute la valorisation classique repose sur une matière première que le baril n'a pas : des **flux**. Une action vaut la somme de ses dividendes ou free cash flows actualisés ; une obligation, celle de ses coupons. Essayez avec un baril : il ne verse rien. Pire — il **coûte** : stockage, assurance, transport. Sans flux à actualiser, le DCF n'a tout simplement pas de point d'appui : aucun modèle ne peut produire une « valeur fondamentale » du pétrole au sens où on l'entend pour une action.

D'où vient le prix, alors ? D'un pur **équilibre physique** : offre, demande, et anticipations sur les deux. Et cette matérialité — un baril pèse 136 kilos, une cargaison de blé moisit — structure toute la classe d'actifs en trois traits.

Un : **le stockage est central**. Détenir la matière a un coût permanent, et ce coût sculpte littéralement la courbe des prix à terme — c'est lui qui fabrique le contango et la backwardation. Deux : **la saisonnalité est réelle** — le gaz se consomme l'hiver, l'essence se brûle l'été, les récoltes arrivent à date fixe : les prix respirent au rythme du calendrier. Trois : **la géopolitique est un facteur de prix de premier rang** — l'offre est concentrée sur un petit nombre de pays, et chaque tension en mer Noire ou au Moyen-Orient s'imprime immédiatement dans les cours.

La chute, qui relie au reste du module : les matières premières rejoignent les devises et l'or dans la famille des **actifs sans flux** — des actifs dont le prix ne se lit pas par l'actualisation, mais par l'équilibre entre détention, portage et rareté. Changer de classe d'actifs, ici, c'est vraiment changer de grille de lecture.`,
    reponseModeleEn: `Because all classical valuation rests on a raw material the barrel does not have: **cash flows**. A share is worth the sum of its discounted dividends or free cash flows; a bond, that of its coupons. Try it with a barrel: it pays nothing. Worse — it **costs**: storage, insurance, transport. With no flows to discount, the DCF simply has no foothold: no model can produce a "fundamental value" of oil in the sense we mean for a share.

Where does the price come from, then? From a pure **physical equilibrium**: supply, demand, and expectations about both. And this materiality — a barrel weighs 136 kilos, a wheat cargo rots — structures the whole asset class in three traits.

One: **storage is central**. Holding the material has a permanent cost, and that cost literally sculpts the forward price curve — it is what manufactures contango and backwardation. Two: **seasonality is real** — gas is burned in winter, gasoline in summer, harvests arrive on fixed dates: prices breathe to the calendar, not just to the economy. Three: **geopolitics is a first-rank price factor** — supply is concentrated in a handful of countries, and every tension in the Black Sea or the Middle East prints immediately into prices.

The closing line, which ties back to the rest of the module: commodities join currencies and gold in the family of **assets without cash flows** — assets whose price is read not through discounting, but through the balance between holding, carry and scarcity. Changing asset class, here, genuinely means changing reading grid.`,
  },
  {
    id: 'm6-j-18',
    moduleId: M6,
    theme: 'matières premières',
    themeEn: 'commodities',
    difficulte: 4,
    question: "L'or enchaîne les records alors que les taux réels sont positifs : contradiction ?",
    questionEn: 'Gold keeps setting records while real rates are positive: a contradiction?',
    plan: [
      'Poser le cadre canonique : le taux réel est le coût d\'opportunité de l\'or — relation historiquement inverse',
      'Reconnaître l\'anomalie : depuis 2022-2023, l\'or monte malgré des taux réels redevenus positifs',
      'Résoudre : l\'acheteur marginal a changé — banques centrales émergentes, demande d\'assurance géopolitique',
      'Conclure en méthode : une corrélation est une régularité, pas une loi',
    ],
    planEn: [
      'State the canonical frame: the real rate is gold\'s opportunity cost — a historically inverse relation',
      'Acknowledge the anomaly: since 2022-2023, gold has risen despite real rates turning positive again',
      'Resolve it: the marginal buyer has changed — emerging central banks, geopolitical insurance demand',
      'Conclude on method: a correlation is a regularity, not a law',
    ],
    pointsAttendus: [
      "Le cadre : l'or ne verse rien — détenir un lingot, c'est renoncer au taux réel des obligations indexées (TIPS) ; quand ce taux monte, le coût d'opportunité monte et l'or devrait baisser",
      'La relation a bien fonctionné : corrélation nettement négative sur 2006-2021 — taux réels profondément négatifs en 2020, or à des sommets',
      "L'anomalie est réelle : depuis 2022-2023, la relation s'est distendue — l'or a progressé malgré des taux réels positifs, enchaînant les records en 2024-2025 au-delà de 4 000 $",
      "La résolution : les banques centrales — acheteuses nettes depuis 2010, mouvement accéléré dans les années 2020 — diversifient leurs réserves hors dollar dans un contexte de tensions géopolitiques ; cet acheteur-là ne raisonne pas en coût d'opportunité",
      "Le rappel structurel : stock extrait ~210 000 tonnes, production annuelle ~3 500 tonnes (1 à 2 % du stock) — le prix se joue sur la volonté de détenir le stock existant, donc sur la demande d'assurance du moment",
      "La conclusion de méthode : pas une contradiction — un changement d'acheteur marginal ; une corrélation est une régularité, pas une loi",
    ],
    pointsAttendusEn: [
      'The frame: gold pays nothing — holding bullion means forgoing the real rate of inflation-linked bonds (TIPS); when that rate rises, the opportunity cost rises and gold should fall',
      'The relation worked well: clearly negative correlation over 2006-2021 — deeply negative real rates in 2020, gold at record highs',
      'The anomaly is real: since 2022-2023 the relation has loosened — gold advanced despite positive real rates, chaining records in 2024-2025 beyond \\$4,000',
      'The resolution: central banks — net buyers since 2010, a move that accelerated in the 2020s — are diversifying reserves away from the dollar amid geopolitical tensions; that buyer does not reason in opportunity cost',
      'The structural reminder: extracted stock ~210,000 tonnes, annual production ~3,500 tonnes (1 to 2% of the stock) — the price is set by the willingness to hold the existing stock, hence by the insurance demand of the moment',
      'The methodological conclusion: not a contradiction — a change of marginal buyer; a correlation is a regularity, not a law',
    ],
    bonus: [
      "La formulation d'assureur : l'or est une assurance contre les scénarios extrêmes — inflation non maîtrisée, crise géopolitique, défiance envers le dollar — et une assurance se paie en rendement manquant",
      'Le garde-fou de jury : se méfier de tout modèle à une variable — le taux réel reste la première grille de lecture, mais elle se complète, elle ne se récite pas',
    ],
    bonusEn: [
      'The insurer\'s phrasing: gold is insurance against extreme scenarios — unanchored inflation, geopolitical crisis, distrust of the dollar — and insurance is paid for in forgone yield',
      'The jury guardrail: beware of any one-variable model — the real rate remains the first reading grid, but it gets complemented, not recited',
    ],
    reponseModele: `Apparente, la contradiction — et la résoudre proprement est exactement ce qu'un jury attend. Le cadre canonique d'abord : l'or ne verse rien. Le détenir, c'est renoncer au **taux réel** des obligations indexées sur l'inflation — les TIPS. Ce taux réel est le coût d'opportunité de l'or : quand il monte, ne rien toucher coûte plus cher, et l'or devrait baisser. La relation a remarquablement fonctionné : corrélation nettement négative sur 2006-2021, avec l'illustration spectaculaire de 2020 — taux réels profondément négatifs, or à des sommets.

Puis le modèle s'est enrayé : depuis 2022-2023, les taux réels sont redevenus positifs et l'or, au lieu de corriger, a enchaîné les records — au-delà de 4 000 \\$ l'once en 2024-2025. Anomalie ? Non : **changement d'acheteur marginal**. Les banques centrales — acheteuses nettes depuis 2010, mouvement nettement accéléré dans les années 2020 — diversifient leurs réserves hors dollar, sur fond de tensions géopolitiques et de sanctions. Or cet acheteur-là ne raisonne pas en coût d'opportunité face aux TIPS : il achète une assurance politique, indifférente au niveau des taux.

Le rappel structurel qui complète : le stock d'or extrait représente environ 210 000 tonnes, la production annuelle 3 500 — 1 à 2 % du stock. L'offre nouvelle est marginale : le prix se joue presque entièrement sur la **volonté de détenir le stock existant**, donc sur la demande d'assurance du moment.

Ma conclusion, en méthode : il n'y a pas contradiction, il y a une corrélation qui rencontre ses limites. Une corrélation est une **régularité, pas une loi** — le taux réel reste ma première grille de lecture sur l'or, mais réciter un modèle à une variable quand l'acheteur marginal a changé, c'est confondre la carte et le territoire.`,
    reponseModeleEn: `Apparent, the contradiction — and resolving it cleanly is exactly what a jury expects. The canonical frame first: gold pays nothing. Holding it means forgoing the **real rate** on inflation-linked bonds — TIPS. That real rate is gold's opportunity cost: when it rises, touching nothing costs more, and gold should fall. The relation worked remarkably well: clearly negative correlation over 2006-2021, with the spectacular illustration of 2020 — deeply negative real rates, gold at record highs.

Then the model jammed: since 2022-2023, real rates have turned positive again and gold, instead of correcting, has chained records — beyond \\$4,000 an ounce in 2024-2025. An anomaly? No: **a change of marginal buyer**. Central banks — net buyers since 2010, a move that clearly accelerated in the 2020s — are diversifying their reserves away from the dollar, against a backdrop of geopolitical tensions and sanctions. And that buyer does not reason in opportunity cost against TIPS: it is buying political insurance, indifferent to the level of rates.

The structural reminder that completes the picture: the stock of extracted gold is about 210,000 tonnes, annual production 3,500 — 1 to 2% of the stock. New supply is marginal: the price is set almost entirely by the **willingness to hold the existing stock**, hence by the insurance demand of the moment.

My conclusion, as a matter of method: there is no contradiction, there is a correlation meeting its limits. A correlation is a **regularity, not a law** — the real rate remains my first reading grid on gold, but reciting a one-variable model when the marginal buyer has changed is mistaking the map for the territory.`,
  },
  {
    id: 'm6-j-19',
    moduleId: M6,
    theme: 'matières premières',
    themeEn: 'commodities',
    difficulte: 3,
    question: 'Comment un prix du pétrole négatif est-il possible ?',
    questionEn: 'How is a negative oil price possible?',
    plan: [
      'Dater le fait : 20 avril 2020, le futures WTI échéance mai clôture à −37,63 $ le baril',
      'Donner la clé : un contrat à livraison physique — le porteur à l\'échéance reçoit 1 000 barils à Cushing',
      'Reconstituer la mécanique : demande effondrée, cuves quasi saturées — détenir le contrat devenait une obligation impossible à honorer',
      'Élargir : ce que l\'épisode dit de la matérialité et des ETF',
    ],
    planEn: [
      'Date the fact: 20 April 2020, the May WTI futures contract settles at −\\$37.63 a barrel',
      'Give the key: a physically delivered contract — the holder at expiry receives 1,000 barrels at Cushing',
      'Reconstruct the mechanics: demand collapsed, tanks nearly full — holding the contract became an obligation impossible to honour',
      'Broaden: what the episode says about materiality and ETFs',
    ],
    pointsAttendus: [
      'Le fait précis : 20 avril 2020, le futures WTI échéance mai clôture à −37,63 $ — le vendeur paie l\'acheteur',
      'La clé contractuelle : le WTI se dénoue par livraison physique — le détenteur à l\'échéance reçoit 1 000 barils à Cushing, Oklahoma, nœud de pipelines et de cuves',
      'Le contexte : confinements mondiaux, demande effondrée, cuves de Cushing quasi saturées — plus de capacité de stockage disponible',
      "La mécanique du prix négatif : les derniers porteurs longs — fonds et particuliers incapables de prendre livraison — ont payé pour se débarrasser de leur obligation de recevoir les barils",
      "La leçon : un futures n'est pas un ticket sur un chiffre, c'est un engagement de livraison — la matérialité de la classe d'actifs reprend ses droits à l'échéance",
      "Le prolongement : les ETF pétroliers contraints de roller dans ce marché dévasté — USO, regroupement de parts 1 pour 8 — la meilleure publicité du chapitre contango",
    ],
    pointsAttendusEn: [
      'The precise fact: 20 April 2020, the May WTI futures settles at −\\$37.63 — the seller pays the buyer',
      'The contractual key: WTI settles by physical delivery — the holder at expiry receives 1,000 barrels at Cushing, Oklahoma, a hub of pipelines and tanks',
      'The context: global lockdowns, demand collapsed, Cushing tanks nearly saturated — no storage capacity left',
      'The negative-price mechanics: the last long holders — funds and retail investors unable to take delivery — paid to get rid of their obligation to receive the barrels',
      'The lesson: a futures contract is not a ticket on a number, it is a delivery commitment — the materiality of the asset class reasserts itself at expiry',
      'The extension: oil ETFs forced to roll in that devastated market — USO, 1-for-8 reverse share split — the best advertisement for the contango chapter',
    ],
    bonus: [
      'Le contraste qui éclaire : le Brent, réglé en cash et chargé sur navire, n\'est pas passé en négatif — la contrainte logistique de Cushing était le cœur du problème',
      "La généralisation : tout actif dont la détention coûte peut coter négatif quand la capacité de stockage s'épuise — le prix rémunère alors celui qui accepte de détenir",
    ],
    bonusEn: [
      'The illuminating contrast: Brent, cash-settled and ship-loaded, did not go negative — the Cushing logistics constraint was the heart of the problem',
      'The generalisation: any asset that costs to hold can trade negative when storage capacity runs out — the price then pays whoever agrees to hold',
    ],
    reponseModele: `La date est à connaître : le **20 avril 2020**, le futures WTI d'échéance mai clôture à **−37,63 \\$ le baril**. Un prix négatif — le vendeur paie l'acheteur. Ce n'est ni une erreur informatique ni une curiosité statistique : c'est de la logistique.

La clé est contractuelle : le WTI se dénoue par **livraison physique**. Le détenteur du contrat à l'échéance ne reçoit pas un règlement en cash — il reçoit 1 000 barils, livrés à Cushing, Oklahoma, un nœud de pipelines et de cuves au milieu des terres. En temps normal, ce détail ne gêne personne : on revend le contrat avant l'échéance. En avril 2020, les confinements mondiaux avaient effondré la demande, et les cuves de Cushing étaient quasi saturées.

Reconstituez alors la position des derniers porteurs longs — fonds et particuliers qui n'avaient ni cuve, ni pipeline, ni la moindre intention de recevoir du brut : à l'échéance, leur contrat devenait une **obligation impossible à honorer**. Pour s'en débarrasser, il fallait trouver quelqu'un acceptant de prendre la livraison — et le payer. Près de 38 dollars par baril : le prix de la dernière place de stockage disponible.

Deux leçons. La première : un futures n'est pas un ticket de casino sur un chiffre — c'est un **engagement de livraison**, et la matérialité de la classe d'actifs reprend tous ses droits à l'échéance. La seconde : les ETF pétroliers, contraints de roller leurs contrats dans ce super-contango dévasté, y ont laissé des plumes mémorables — USO a fini par regrouper ses parts une pour huit. Le baril a rebondi ; leurs porteurs sont restés loin derrière. Le prix négatif fut une journée ; le roll, lui, facture tous les mois.`,
    reponseModeleEn: `The date is worth knowing: on **20 April 2020**, the May WTI futures contract settled at **−\\$37.63 a barrel**. A negative price — the seller pays the buyer. It was neither a computer glitch nor a statistical curiosity: it was logistics.

The key is contractual: WTI settles by **physical delivery**. The contract holder at expiry does not receive a cash settlement — he receives 1,000 barrels, delivered at Cushing, Oklahoma, a hub of pipelines and tanks in the middle of the country. In normal times, the detail bothers nobody: you sell the contract before expiry. In April 2020, global lockdowns had collapsed demand, and Cushing's tanks were nearly full.

Now reconstruct the position of the last long holders — funds and retail investors with no tank, no pipeline, and no intention whatsoever of receiving crude: at expiry, their contract became an **obligation impossible to honour**. To get rid of it, they had to find someone willing to take delivery — and pay him. Nearly 38 dollars a barrel: the price of the last available storage slot.

Two lessons. First: a futures contract is not a casino ticket on a number — it is a **delivery commitment**, and the materiality of the asset class reclaims all its rights at expiry. Second: oil ETFs, forced to roll their contracts in that devastated super-contango, took memorable losses — USO ended up reverse-splitting its shares one for eight. The barrel rebounded; their holders stayed far behind. The negative price lasted a day; the roll bills every month.`,
  },
  {
    id: 'm6-j-20',
    moduleId: M6,
    theme: 'contango et backwardation',
    themeEn: 'contango and backwardation',
    difficulte: 3,
    question: 'Quelle différence entre le report d\'une devise et le contango d\'une matière première ?',
    questionEn: 'What is the difference between a currency forward premium and a commodity contango?',
    plan: [
      'Poser la parenté : F > S dans les deux cas, et le même squelette — un prix d\'arbitrage cash and carry, jamais une prévision',
      'Différencier les moteurs : différentiel de taux côté FX, financement + stockage − convenience yield côté matières',
      "Montrer l'asymétrie d'information : le contango raconte l'état des stocks, le report ne dit que l'écart de taux",
      'Conclure sur la conséquence investisseur : le roll coûte en contango — le report, lui, se neutralise par la parité',
    ],
    planEn: [
      'State the kinship: F > S in both cases, and the same skeleton — a cash-and-carry arbitrage price, never a forecast',
      'Differentiate the drivers: rate differential on the FX side, financing + storage − convenience yield on the commodity side',
      'Show the information asymmetry: contango tells the state of inventories, the premium only states the rate gap',
      'Conclude on the investor consequence: the roll costs in contango — the FX premium nets out through parity',
    ],
    pointsAttendus: [
      'La parenté : dans les deux cas F > S, et le prix vient du même raisonnement cash and carry — acheter comptant, porter, revendre à terme ; ni l\'un ni l\'autre n\'est une prévision',
      'Côté change : le coût de portage est purement financier — le différentiel de taux ; F = S × (1 + r_cotée·T)/(1 + r_base·T), report si la devise cotée rémunère plus',
      'Côté matière première : le portage est physique — financement + stockage − convenience yield ; F = S × (1 + c·T)',
      "La différence structurante : le convenience yield n'a pas d'équivalent FX — une devise en compte ne « manque » jamais ; pas de prime de disponibilité, pas de pénurie de yens en cuve",
      "Conséquence de lecture : la backwardation signale une tension physique (stocks bas) — le déport d'une devise ne signale qu'un différentiel de taux inversé, aucune « tension » à y lire",
      "Conséquence d'investissement : en contango, le roll érode une position longue (−4,76 % sur 80/84) ; côté FX, le report est exactement compensé par le différentiel de taux placé — la CIP neutralise, le contango facture",
    ],
    pointsAttendusEn: [
      'The kinship: in both cases F > S, and the price comes from the same cash-and-carry reasoning — buy spot, carry, sell forward; neither is a forecast',
      'On the FX side: the carry cost is purely financial — the rate differential; F = S × (1 + r_quoted·T)/(1 + r_base·T), a premium when the quoted currency pays more',
      'On the commodity side: the carry is physical — financing + storage − convenience yield; F = S × (1 + c·T)',
      'The structuring difference: convenience yield has no FX equivalent — a currency on deposit is never "missing"; no availability premium, no shortage of yen in tanks',
      'Reading consequence: backwardation signals physical tension (low inventories) — a currency discount only signals a reversed rate differential, no "tension" to read into it',
      'Investment consequence: in contango, the roll erodes a long position (−4.76% on 80/84); on the FX side, the premium is exactly offset by the invested rate differential — CIP neutralises, contango bills',
    ],
    bonus: [
      'La formule-pont : le convenience yield joue dans la formule du forward matière première exactement le rôle du taux de la devise de base dans la CIP — le « rendement » de l\'actif porté',
      "Le piège de vocabulaire : backwardation observée (F < S) et normal backwardation de Keynes (F < E[S_T]) ne sont pas synonymes — la seconde est inobservable",
    ],
    bonusEn: [
      'The bridge formula: convenience yield plays in the commodity forward formula exactly the role of the base currency rate in CIP — the "yield" of the carried asset',
      'The vocabulary trap: observed backwardation (F < S) and Keynes\'s normal backwardation (F < E[S_T]) are not synonyms — the latter is unobservable',
    ],
    reponseModele: `Commençons par la parenté, car elle est réelle : dans les deux cas, le terme cote au-dessus du comptant, et dans les deux cas le prix sort du même raisonnement **cash and carry** — acheter au comptant, porter, revendre à terme ; le forward ne peut s'écarter du coût complet de l'opération sans ouvrir un arbitrage. Et ni l'un ni l'autre n'est une prévision : ce sont des prix de portage.

La différence est dans la nature du portage. Côté change, il est **purement financier** : le différentiel de taux. F = S × (1 + r_cotée·T)/(1 + r_base·T) — l'euro cote en report quand le dollar rémunère plus, point. Côté matière première, le portage est **physique** : financement, plus stockage, *moins* le convenience yield — ce « dividende de disponibilité » qu'encaisse celui qui a la matière sous la main, la raffinerie qui ne s'arrête jamais faute de brut.

Ce troisième terme est la vraie ligne de partage, car il n'a **aucun équivalent en change** : une devise en compte rémunéré ne « manque » jamais — il n'y a pas de pénurie de yens en cuve. Conséquences en cascade. Pour la lecture : une backwardation signale une tension physique, des stocks bas — les desks lisent la pente courte du brut comme un indicateur de stocks en temps réel ; un déport de devise ne signale qu'un différentiel de taux inversé, aucune tension à y lire. Pour l'investisseur : en contango, le roll **facture** — vendre 80, racheter 84, −4,76 % par an à spot inchangé ; côté FX, le report est exactement compensé par le taux supérieur que rapporte la devise placée — la parité couverte neutralise.

La synthèse en une phrase : même squelette d'arbitrage, mais le change n'a ni cuves ni pénuries — le contango raconte l'état du monde physique, le report ne récite que l'écart de deux taux.`,
    reponseModeleEn: `Start with the kinship, because it is real: in both cases the forward quotes above spot, and in both cases the price comes from the same **cash and carry** reasoning — buy spot, carry, sell forward; the forward cannot drift from the full cost of that operation without opening an arbitrage. And neither is a forecast: they are carry prices.

The difference lies in the nature of the carry. On the FX side it is **purely financial**: the rate differential. F = S × (1 + r_quoted·T)/(1 + r_base·T) — the euro trades at a premium when the dollar pays more, full stop. On the commodity side, the carry is **physical**: financing, plus storage, *minus* the convenience yield — that "availability dividend" earned by whoever has the material at hand, the refinery that never stops for lack of crude.

That third term is the true dividing line, because it has **no FX equivalent**: a currency in an interest-bearing account is never "missing" — there is no shortage of yen in tanks. Consequences cascade. For reading: backwardation signals physical tension, low inventories — desks read the short end of the crude curve as a real-time inventory indicator; a currency discount only signals a reversed rate differential, with no tension to read into it. For the investor: in contango, the roll **bills** — sell 80, buy back 84, −4.76% a year with spot unchanged; on the FX side, the premium is exactly offset by the higher rate earned on the invested currency — covered parity neutralises.

The one-sentence synthesis: same arbitrage skeleton, but FX has neither tanks nor shortages — contango tells the state of the physical world, the forward premium merely recites the gap between two interest rates.`,
  },
  {
    id: 'm6-j-21',
    moduleId: M6,
    theme: 'contango et backwardation',
    themeEn: 'contango and backwardation',
    difficulte: 2,
    question: 'Un client veut acheter un ETF pétrole « pour profiter de la hausse du baril ». Expliquez-lui le roll yield.',
    questionEn: 'A client wants to buy an oil ETF "to ride the barrel higher". Explain the roll yield to him.',
    plan: [
      'Corriger la prémisse : le fonds ne détient pas un baril — une chaîne de futures perpétuellement remplacés',
      'Expliquer le roll : à chaque échéance, vendre le contrat proche, racheter le suivant',
      "Chiffrer en contango : vendre 80, racheter 84 — environ −4,76 % par an à spot inchangé",
      'Donner la décomposition complète et le cas d\'école USO — puis la règle de décision',
    ],
    planEn: [
      'Correct the premise: the fund holds no barrel — a chain of perpetually replaced futures',
      'Explain the roll: at each expiry, sell the near contract, buy the next one',
      'Quantify in contango: sell 80, buy back 84 — about −4.76% a year with spot unchanged',
      'Give the full decomposition and the USO case study — then the decision rule',
    ],
    pointsAttendus: [
      'Partir du malentendu : un ETF pétrole ne stocke aucun baril — il détient des futures qu\'il doit remplacer à chaque échéance : le roll',
      'La mécanique en contango : on vend le contrat proche (80) moins cher qu\'on ne rachète le lointain (84) — on paie l\'écart à chaque roll',
      "Le chiffre : roll yield = (80/84 − 1) ≈ −4,76 % par an — une érosion qui ne doit rien à la trajectoire du spot, le tapis roulant pris à l'envers",
      'En backwardation, le tapis s\'inverse : vendre 80, racheter 77,60 — environ +3,09 % par an à spot inchangé',
      'La décomposition complète : rendement total ≈ spot return + roll yield + collateral yield — exemple du cours : +5 % − 4,76 % + 3 % ≈ +3,2 %',
      "Le cas d'école : USO en avril 2020 — roll forcé dans un super-contango, regroupement de parts 1 pour 8 ; « le baril a fait +20 %, mon ETF +6 % » n'est pas un vol, c'est le roll",
    ],
    pointsAttendusEn: [
      'Start from the misunderstanding: an oil ETF stores no barrel — it holds futures it must replace at every expiry: the roll',
      'The mechanics in contango: you sell the near contract (80) for less than you buy back the next one (84) — you pay the gap at every roll',
      'The number: roll yield = (80/84 − 1) ≈ −4.76% a year — an erosion owing nothing to the spot path, the conveyor belt taken backwards',
      'In backwardation the belt reverses: sell 80, buy back 77.60 — about +3.09% a year with spot unchanged',
      'The full decomposition: total return ≈ spot return + roll yield + collateral yield — course example: +5% − 4.76% + 3% ≈ +3.2%',
      'The case study: USO in April 2020 — forced roll in a super-contango, 1-for-8 reverse split; "the barrel did +20%, my ETF +6%" is not theft, it is the roll',
    ],
    bonus: [
      'La règle de décision client : avant tout ETF matière première, regarder la pente de la courbe — en contango marqué, la position longue paie un loyer mensuel pour exister',
      "Préciser l'exception métaux précieux : certains ETC or détiennent réellement des lingots — pas de roll, pas d'érosion, seuls les frais de garde",
    ],
    bonusEn: [
      'The client decision rule: before any commodity ETF, look at the curve slope — in steep contango, a long position pays a monthly rent just to exist',
      'Specify the precious metals exception: some gold ETCs genuinely hold bullion — no roll, no erosion, only custody fees',
    ],
    reponseModele: `« Commençons par corriger une image : votre ETF ne possédera pas un seul baril. Un fonds ne peut pas stocker de pétrole — il détient des **contrats futures**, qui expirent. Pour rester exposé, il doit, à chaque échéance, vendre le contrat qui expire et racheter le suivant : c'est le *roll*. Anodin en apparence ; c'est là que tout se joue.

Regardez la courbe actuelle : le contrat proche cote 80 \\$, celui de l'an prochain 84. À chaque roll, votre fonds vend à 80 et rachète à 84 — il paie la pente. Annualisé, ce péage vaut (80/84 − 1) ≈ **−4,76 % par an**. Lisez bien : votre ETF perd près de 5 % par an *sans que le baril ait bougé d'un centime*. C'est un tapis roulant pris à l'envers — et en marché inversé, en backwardation, le tapis change de sens : le roll rapporterait environ +3,09 %.

Votre performance totale aura donc trois étages : la variation du spot, le roll yield, et les intérêts du collatéral — le capital non immobilisé dort en bons du Trésor. Sur notre exemple : spot +5 %, roll −4,76 %, collatéral +3 % ≈ **+3,2 %** — dont presque rien ne vient du pétrole lui-même.

Le précédent à connaître avant de signer : avril 2020. L'ETF USO, massivement investi sur le contrat le plus proche dans un super-contango — avec une échéance partie en territoire *négatif* —, a dû roller en urgence dans des conditions désastreuses, puis regrouper ses parts une pour huit. Le baril a rebondi ; ses porteurs sont restés loin derrière.

Ma règle, donc : avant d'acheter, nous regarderons la **pente de la courbe**. Si elle monte fortement, votre position longue paiera un loyer mensuel pour exister — et il faudra que votre scénario de hausse le couvre. Le baril de la presse est gratuit ; l'exposition au baril ne l'est pas. »`,
    reponseModeleEn: `"Let us start by correcting one image: your ETF will not own a single barrel. A fund cannot store oil — it holds **futures contracts**, which expire. To stay exposed, at every expiry it must sell the dying contract and buy the next one: the *roll*. Innocuous in appearance; that is where everything plays out.

Look at today's curve: the near contract quotes \\$80, next year's 84. At each roll, your fund sells at 80 and buys back at 84 — it pays the slope. Annualised, that toll is (80/84 − 1) ≈ **−4.76% a year**. Read it carefully: your ETF loses nearly 5% a year *without the barrel moving a cent*. It is a conveyor belt taken backwards — and in an inverted market, in backwardation, the belt switches direction: the roll would earn about +3.09%.

Your total performance will therefore have three layers: the spot move, the roll yield, and the interest on collateral — the capital not posted as margin sits in Treasury bills. On our example: spot +5%, roll −4.76%, collateral +3% ≈ **+3.2%** — almost none of it coming from oil itself.

The precedent to know before signing: April 2020. The ETF USO, massively invested in the nearest contract in a super-contango — with one expiry gone *negative* — had to roll in emergency conditions, then reverse-split its shares one for eight. The barrel rebounded; its holders stayed far behind.

So here is my rule: before buying, we will look at the **slope of the curve**. If it rises steeply, your long position will pay a monthly rent just to exist — and your bullish scenario will have to cover it. The barrel in the newspapers is free; exposure to the barrel is not."`,
  },
  {
    id: 'm6-j-22',
    moduleId: M6,
    theme: 'contango et backwardation',
    themeEn: 'contango and backwardation',
    difficulte: 3,
    question: 'La courbe du brut bascule en backwardation marquée. Le marché prédit-il une baisse des prix ?',
    questionEn: 'The crude curve flips into steep backwardation. Is the market predicting falling prices?',
    plan: [
      'Répondre net : non — la courbe est un prix de portage, pas une prévision',
      'Donner la cause : convenience yield dominant — stocks bas, la disponibilité immédiate vaut une prime',
      'Montrer la valeur informative : la pente courte comme indicateur de stocks en temps réel',
      'Distinguer pour finir : backwardation observée et normal backwardation de Keynes',
    ],
    planEn: [
      'Answer squarely: no — the curve is a carry price, not a forecast',
      'Give the cause: dominant convenience yield — low inventories, immediate availability commands a premium',
      'Show the informational value: the short end as a real-time inventory indicator',
      'Distinguish to finish: observed backwardation and Keynes\'s normal backwardation',
    ],
    pointsAttendus: [
      'Lire la courbe comme une prédiction du spot est le contresens classique : F sort du cash and carry — portage et prime de disponibilité, pas anticipation',
      "La mécanique : backwardation = convenience yield dominant les coûts de portage — exemple du cours : financement 2 %, stockage 1 %, convenience 6 % → F = 80 × 0,97 = 77,60",
      "La lecture économique : un diagnostic de tension physique — stocks bas, peur de la rupture ; la pente courte du brut est un indicateur de stocks en temps réel",
      'La base (spot − futures, positive en backwardation) converge vers zéro à l\'échéance, quelle que soit la trajectoire du spot',
      "La distinction de jury : backwardation observée (F < S, lisible à l'écran) ≠ normal backwardation de Keynes (F < E[S_T], inobservable) — un contango affiché peut offrir une prime de risque à l'acheteur",
      'Conséquence pratique : pour une position longue rollée, la backwardation rapporte (+3,09 % sur 80/77,60) — indépendamment de la direction du spot',
    ],
    pointsAttendusEn: [
      'Reading the curve as a spot prediction is the classic misreading: F comes from cash and carry — carry costs and availability premium, not expectations',
      'The mechanics: backwardation = convenience yield dominating carry costs — course example: financing 2%, storage 1%, convenience 6% → F = 80 × 0.97 = 77.60',
      'The economic reading: a diagnosis of physical tension — low stocks, fear of shortage; the short end of the crude curve is a real-time inventory indicator',
      'The basis (spot − futures, positive in backwardation) converges to zero at expiry, whatever the spot path',
      'The jury distinction: observed backwardation (F < S, readable on screen) ≠ Keynes\'s normal backwardation (F < E[S_T], unobservable) — a posted contango can still offer the buyer a risk premium',
      'Practical consequence: for a rolled long position, backwardation pays (+3.09% on 80/77.60) — independently of spot direction',
    ],
    bonus: [
      'La théorie de Keynes en une phrase : la pression vendeuse structurelle des producteurs qui se couvrent tire F sous le spot futur anticipé — le spéculateur long encaisse une prime d\'assurance',
      "Le parallèle FX : même piège que « le forward prédit le spot » — deux courbes de portage, deux fausses boules de cristal",
    ],
    bonusEn: [
      'Keynes\'s theory in one sentence: the structural selling pressure of hedging producers pulls F below the expected future spot — the long speculator collects an insurance premium',
      'The FX parallel: same trap as "the forward predicts spot" — two carry curves, two false crystal balls',
    ],
    reponseModele: `Non — et ce réflexe de lecture sépare précisément les professionnels des touristes. Une courbe de futures n'est pas un sondage d'anticipations : c'est un **prix de portage**, construit par le cash and carry. Le terme vaut le spot plus le coût de porter la matière jusqu'à l'échéance — financement, stockage — *moins* le convenience yield, la valeur d'avoir la matière sous la main.

La backwardation dit donc une chose précise : le **convenience yield domine** les coûts de portage. Chiffrons avec l'exemple du cours — financement 2 %, stockage 1 %, convenience 6 % : F = 80 × (1 − 0,03) = 77,60 \\$. Le spot vaut plus que le terme parce qu'en avoir *maintenant* vaut cher : stocks bas, peur de la rupture. C'est un **diagnostic de tension physique**, pas une prophétie — les desks lisent d'ailleurs la pente courte du brut comme un indicateur de stocks en temps réel. Et la base convergera vers zéro à l'échéance quelle que soit la trajectoire du spot : le futures qui expire devient du spot, mécaniquement.

J'ajoute la distinction qui rassure un jury : ne pas confondre la backwardation **observée** — F < S, lisible à l'écran — avec le *normal backwardation* de Keynes — F < E[S_T], le spot futur *anticipé*, inobservable. La seconde décrit une prime de risque : les producteurs qui vendent à terme pour dormir tranquille tirent les futures sous le spot anticipé, et le spéculateur long encaisse l'écart en moyenne — le salaire de l'assureur. Un marché peut être en contango affiché tout en offrant cette prime.

La chute, et la seule conclusion opérationnelle : pour une position longue rollée, cette backwardation **rapporte** — environ +3,09 % par an sur 80/77,60, à spot inchangé. La courbe ne me dit pas où va le pétrole ; elle me dit ce que je gagne ou paie pour l'attendre.`,
    reponseModeleEn: `No — and this reading reflex is precisely what separates professionals from tourists. A futures curve is not a poll of expectations: it is a **carry price**, built by cash and carry. The forward is worth spot plus the cost of carrying the material to expiry — financing, storage — *minus* the convenience yield, the value of having the material at hand.

Backwardation therefore says one precise thing: the **convenience yield dominates** the carry costs. Quantify it with the course example — financing 2%, storage 1%, convenience 6%: F = 80 × (1 − 0.03) = \\$77.60. Spot is worth more than the forward because having it *now* is expensive: low inventories, fear of shortage. It is a **diagnosis of physical tension**, not a prophecy — desks indeed read the short end of the crude curve as a real-time inventory indicator. And the basis will converge to zero at expiry whatever the spot does: the expiring future becomes spot, mechanically.

I add the distinction that reassures a jury: do not confuse **observed** backwardation — F < S, readable on screen — with Keynes's *normal backwardation* — F < E[S_T], the *expected* future spot, unobservable. The latter describes a risk premium: producers selling forward to sleep at night pull futures below the expected spot, and the long speculator collects the gap on average — the insurer's wage. A market can post a contango while still offering that premium.

The closing line, and the only operational conclusion: for a rolled long position, this backwardation **pays** — about +3.09% a year on 80/77.60, with spot unchanged. The curve does not tell me where oil is going; it tells me what I earn or pay while waiting for it.`,
  },
  {
    id: 'm6-j-23',
    moduleId: M6,
    theme: 'crypto-actifs',
    themeEn: 'crypto-assets',
    difficulte: 2,
    question: 'Un stablecoin est-il sans risque ?',
    questionEn: 'Is a stablecoin risk-free?',
    plan: [
      'Répondre net : non — « stable » décrit l\'objectif, pas une garantie',
      'Distinguer les deux modèles : collatéralisé (USDT, USDC) et algorithmique',
      'Chiffrer les précédents : Terra mai 2022 (~40 Md$), USDC mars 2023',
      'Nuancer avec MiCA : un risque désormais surveillé en Europe — pas supprimé',
    ],
    planEn: [
      'Answer squarely: no — "stable" describes the objective, not a guarantee',
      'Distinguish the two models: collateralised (USDT, USDC) and algorithmic',
      'Quantify the precedents: Terra May 2022 (~\\$40bn), USDC March 2023',
      'Qualify with MiCA: a risk now supervised in Europe — not removed',
    ],
    pointsAttendus: [
      "Un stablecoin collatéralisé est fonctionnellement un fonds monétaire qui ne dit pas son nom : un passif à vue adossé à des actifs courts — cash et bons du Trésor américain",
      'Ses risques : réserve, contrepartie, retrait massif (run) — l\'USDC a brièvement décroché en mars 2023, une partie de ses réserves dormant à la Silicon Valley Bank en faillite',
      "Le modèle algorithmique est plus fragile encore : aucune réserve réelle, une parité tenue par arbitrage avec un second jeton — la confiance seule ; TerraUSD, mai 2022 : ~40 Md$ évaporés en une semaine",
      'Le pont conceptuel : un stablecoin est un peg — la mécanique de crise de change du chapitre 4, sans réserves obligatoires historiques ni banque centrale pour défendre la parité',
      'La nuance MiCA : en Europe, émetteurs agréés, réserves encadrées, convertibilité au pair garantie en droit — le risque devient surveillé, il ne disparaît pas',
      "L'enjeu systémique : ~300 Md$ d'encours début 2026, rôle de dollar de l'ombre, émetteurs devenus détenteurs significatifs de bons du Trésor",
    ],
    pointsAttendusEn: [
      'A collateralised stablecoin is functionally a money market fund that does not say its name: a sight liability backed by short assets — cash and US Treasury bills',
      'Its risks: reserve, counterparty, mass redemption (run) — USDC briefly broke its peg in March 2023, part of its reserves sitting in the failed Silicon Valley Bank',
      'The algorithmic model is more fragile still: no real reserves, a parity held by arbitrage with a second token — confidence alone; TerraUSD, May 2022: ~\\$40bn evaporated in a week',
      'The conceptual bridge: a stablecoin is a peg — the currency crisis mechanics of chapter 4, without historical reserve requirements or a central bank to defend the parity',
      'The MiCA nuance: in Europe, licensed issuers, regulated reserves, legal par convertibility — the risk becomes supervised, it does not disappear',
      'The systemic stake: ~\\$300bn outstanding in early 2026, a shadow-dollar role, issuers now significant holders of Treasury bills',
    ],
    bonus: [
      "La formule qui reste : Terra fut une crise de change accélérée, appliquée à un dollar privé — même pari à sens unique, même mort en quelques jours quand le marché teste la promesse",
      "Le détail qui impressionne : la fonction de dollar de l'ombre — dans les pays à monnaie faible, détenir de l'USDT, c'est détenir du dollar sans compte américain",
    ],
    bonusEn: [
      'The line that sticks: Terra was an accelerated currency crisis applied to a private dollar — same one-way bet, same death within days once the market tested the promise',
      'The impressive detail: the shadow-dollar function — in weak-currency countries, holding USDT means holding dollars without a US bank account',
    ],
    reponseModele: `Non — « stable » décrit l'**objectif**, pas une garantie. Et la meilleure preuve est qu'il faut distinguer deux mécaniques très différentes sous la même appellation.

Le modèle **collatéralisé** — USDT, USDC — adosse chaque jeton à des réserves réelles : du cash et surtout des bons du Trésor américain. Fonctionnellement, c'est un **fonds monétaire qui ne dit pas son nom** : un passif à vue, un portefeuille d'actifs courts — donc un risque de réserve, de contrepartie et de retrait massif. Ce n'est pas théorique : en mars 2023, l'USDC lui-même a brièvement décroché de sa parité, parce qu'une partie de ses réserves dormait à la Silicon Valley Bank en faillite.

Le modèle **algorithmique** est plus fragile encore : aucune réserve réelle, une parité tenue par un mécanisme d'arbitrage avec un second jeton — c'est-à-dire par la confiance seule. Mai 2022 : TerraUSD perd son ancrage, et la spirale de mort avec Luna évapore de l'ordre de **40 milliards de dollars en une semaine**. Vous reconnaissez la mécanique du chapitre régimes de change : un stablecoin est un *peg* — et Terra fut une crise de change accélérée, appliquée à un dollar privé, sans banque centrale pour défendre la parité.

La nuance que j'apporte depuis MiCA : en Europe, les émetteurs sont désormais agréés, leurs réserves encadrées, la convertibilité au pair garantie en droit. Le risque devient **surveillé** — il ne disparaît pas.

Et l'enjeu dépasse les porteurs : environ 300 Md\\$ d'encours début 2026, une fonction de dollar de l'ombre dans les pays à monnaie faible, et des émetteurs devenus détenteurs significatifs de bons du Trésor. Un objet « sans risque » ne tiendrait pas les banquiers centraux éveillés — celui-ci le fait.`,
    reponseModeleEn: `No — "stable" describes the **objective**, not a guarantee. And the best proof is that two very different mechanics hide under the same label.

The **collateralised** model — USDT, USDC — backs each token with real reserves: cash and, above all, US Treasury bills. Functionally, it is a **money market fund that does not say its name**: a sight liability, a portfolio of short assets — hence reserve risk, counterparty risk and run risk. This is not theoretical: in March 2023, USDC itself briefly broke its peg, because part of its reserves sat in the failed Silicon Valley Bank.

The **algorithmic** model is more fragile still: no real reserves, a parity held by an arbitrage mechanism with a second token — that is, by confidence alone. May 2022: TerraUSD loses its anchor, and the death spiral with Luna evaporates on the order of **40 billion dollars in one week**. You will recognise the mechanics from the exchange rate regimes chapter: a stablecoin is a *peg* — and Terra was an accelerated currency crisis, applied to a private dollar, with no central bank to defend the parity.

The nuance I add since MiCA: in Europe, issuers are now licensed, their reserves regulated, par convertibility guaranteed in law. The risk becomes **supervised** — it does not disappear.

And the stakes go beyond the holders: about \\$300bn outstanding in early 2026, a shadow-dollar function in weak-currency countries, and issuers that have become significant holders of Treasury bills. A "riskless" object would not keep central bankers awake — this one does.`,
  },
  {
    id: 'm6-j-24',
    moduleId: M6,
    theme: 'crypto-actifs',
    themeEn: 'crypto-assets',
    difficulte: 2,
    question: "Qu'est-ce que MiCA a changé — et qu'est-ce que MiCA n'a pas changé ?",
    questionEn: 'What did MiCA change — and what did MiCA not change?',
    plan: [
      'Situer : règlement européen adopté en 2023, entré en application en 2024 — première grande juridiction au cadre unifié',
      'Détailler le contenu : stablecoins encadrés à la mi-2024, prestataires agréés fin 2024, passeport européen',
      'Contraster avec les États-Unis : querelle SEC-CFTC, avancée par à-coups',
      'Tracer la limite : régulé ≠ recommandé, non régulé ≠ interdit',
    ],
    planEn: [
      'Situate: EU regulation adopted in 2023, in application from 2024 — the first major jurisdiction with a unified framework',
      'Detail the content: stablecoins regulated mid-2024, licensed service providers late 2024, European passport',
      'Contrast with the United States: SEC-CFTC turf war, progress by fits and starts',
      'Draw the boundary: regulated ≠ recommended, unregulated ≠ forbidden',
    ],
    pointsAttendus: [
      'MiCA (Markets in Crypto-Assets) : règlement adopté en 2023, entré en application en 2024 — les stablecoins d\'abord (mi-2024), les prestataires de services ensuite (fin 2024)',
      'Pour les stablecoins : réserves encadrées, agrément des émetteurs, convertibilité au pair garantie en droit',
      'Pour les prestataires : agrément obligatoire et passeport européen — la zone grise troquée contre des règles du jeu explicites',
      "Le contraste américain : pas de cadre unifié — querelle de compétence SEC (jetons ~ titres) contre CFTC (bitcoin ~ matière première), procès structurants, orientations qui changent avec les administrations",
      "Ce que MiCA n'a pas changé : la nature des actifs — volatilité, absence de flux, historique court ; la régulation protège contre la fraude et l'opacité, pas contre une mauvaise thèse d'investissement",
      'Le réflexe de jury : « régulé ≠ recommandé, non régulé ≠ interdit » — un produit agréé peut rester un très mauvais placement',
    ],
    pointsAttendusEn: [
      'MiCA (Markets in Crypto-Assets): regulation adopted in 2023, in application from 2024 — stablecoins first (mid-2024), service providers next (late 2024)',
      'For stablecoins: regulated reserves, issuer licensing, par convertibility guaranteed in law',
      'For service providers: mandatory licensing and a European passport — the grey zone traded for explicit rules of the game',
      'The American contrast: no unified framework — a turf war between the SEC (tokens ~ securities) and the CFTC (bitcoin ~ commodity), structuring lawsuits, orientations shifting with administrations',
      'What MiCA did not change: the nature of the assets — volatility, absence of cash flows, short history; regulation protects against fraud and opacity, not against a bad investment thesis',
      'The jury reflex: "regulated ≠ recommended, unregulated ≠ forbidden" — a licensed product can remain a very bad investment',
    ],
    bonus: [
      "L'effet concret sur les stablecoins : le quasi-fonds monétaire opère enfin sous une régulation correspondante — le risque devient surveillé, pas supprimé",
      'La leçon comparative : un même actif mondial, deux philosophies réglementaires — le cadre complet contre les à-coups jurisprudentiels',
    ],
    bonusEn: [
      'The concrete effect on stablecoins: the quasi-money-market fund finally operates under matching regulation — the risk becomes supervised, not removed',
      'The comparative lesson: one global asset, two regulatory philosophies — a complete framework versus case-law fits and starts',
    ],
    reponseModele: `Ce que MiCA a changé tient en un mot : le **cadre**. Avec ce règlement — *Markets in Crypto-Assets*, adopté en 2023, entré en application en **2024** —, l'Union européenne est devenue la première grande juridiction à offrir un régime unifié aux crypto-actifs. Concrètement, en deux vagues : les **stablecoins** d'abord, encadrés à la mi-2024 — réserves encadrées, agrément des émetteurs, convertibilité au pair garantie en droit ; les **prestataires de services** ensuite, en fin d'année — agrément obligatoire et passeport européen. La zone grise a été troquée contre des règles du jeu explicites : qui peut émettre, qui peut distribuer, avec quelles réserves et quelles obligations.

Le contraste éclaire le choix européen : les États-Unis avancent **par à-coups** — une querelle de compétence jamais tranchée entre la SEC, pour qui nombre de jetons ressemblent à des titres financiers, et la CFTC, qui traite bitcoin comme une matière première ; des procès structurants ; des orientations qui changent avec les administrations. Un même actif mondial, deux philosophies réglementaires.

Mais voici ce que MiCA n'a **pas** changé — et c'est la moitié de la réponse qui compte : la nature des actifs. La volatilité d'un jeton agréé reste entière ; son absence de flux aussi ; son historique reste court. La régulation encadre les émetteurs, les plateformes et la distribution — elle protège l'investisseur contre la fraude et l'opacité, pas contre sa propre thèse d'investissement.

D'où le réflexe que je garde : « **régulé ≠ recommandé, non régulé ≠ interdit** ». Un produit agréé peut rester un très mauvais placement ; un actif hors cadre n'est pas pour autant illégal à détenir. MiCA a changé les règles du jeu — pas le jeu.`,
    reponseModeleEn: `What MiCA changed fits in one word: the **framework**. With this regulation — *Markets in Crypto-Assets*, adopted in 2023, in application from **2024** — the European Union became the first major jurisdiction to offer crypto-assets a unified regime. Concretely, in two waves: **stablecoins** first, regulated from mid-2024 — supervised reserves, issuer licensing, par convertibility guaranteed in law; **service providers** next, at the end of the year — mandatory licensing and a European passport. The grey zone was traded for explicit rules of the game: who may issue, who may distribute, with what reserves and what obligations.

The contrast illuminates the European choice: the United States advances **by fits and starts** — a never-settled turf war between the SEC, for which many tokens look like securities, and the CFTC, which treats bitcoin as a commodity; structuring lawsuits; orientations that change with administrations. One global asset, two regulatory philosophies.

But here is what MiCA did **not** change — and it is the half of the answer that matters: the nature of the assets. The volatility of a licensed token remains intact; so does its absence of cash flows; its track record remains short. Regulation frames issuers, platforms and distribution — it protects the investor against fraud and opacity, not against his own investment thesis.

Hence the reflex I keep: "**regulated ≠ recommended, unregulated ≠ forbidden**". A licensed product can remain a very bad investment; an asset outside the framework is not thereby illegal to hold. MiCA changed the rules of the game — not the game.`,
  },
  {
    id: 'm6-j-25',
    moduleId: M6,
    theme: 'crypto-actifs',
    themeEn: 'crypto-assets',
    difficulte: 4,
    question: 'Faut-il du bitcoin dans un portefeuille institutionnel ?',
    questionEn: 'Should an institutional portfolio hold bitcoin?',
    plan: [
      'Refuser les deux postures qui ruinent un oral : l\'évangélisme et le mépris — traiter bitcoin comme un actif',
      'Le dossier pour : offre fixe, narratif or numérique, institutionnalisation de l\'accès (ETF spot 2024)',
      'Le dossier contre : volatilité 3-4 fois les actions, corrélation aux actifs risqués dans les stress, pas de flux ni d\'ancrage',
      'Trancher en professionnel : une question de taille et de mandat, pas de oui ou non',
    ],
    planEn: [
      'Refuse the two postures that ruin an oral: evangelism and contempt — treat bitcoin as an asset',
      'The case for: fixed supply, digital gold narrative, institutionalised access (spot ETFs 2024)',
      'The case against: volatility 3-4 times equities, correlation to risk assets in stress, no cash flows and no anchor',
      'Decide as a professional: a question of size and mandate, not of yes or no',
    ],
    pointsAttendus: [
      "Pour : offre plafonnée à 21 millions d'unités, halvings — un actif sans flux à offre inélastique, le narratif « or numérique »",
      "Pour : l'accès s'est institutionnalisé — futures CME fin 2017, custody dédiée, ETF spot approuvés en janvier 2024 (BlackRock, Fidelity), collecte en dizaines de milliards dès la première année",
      'Contre : volatilité de l\'ordre de 3 à 4 fois celle des actions, et corrélation aux actifs risqués qui augmente dans les stress — 2022 : bitcoin ≈ −65 % quand le Nasdaq perdait ≈ 33 %',
      "Contre : aucun flux, donc aucun ancrage de valorisation — ni DCF ni multiple ; un historique court, des régimes de corrélation instables",
      "Le correctif d'analyse : l'ETF a changé l'accès, pas la nature de l'actif — la respectabilité du véhicule n'est pas celle du sous-jacent",
      "Le verdict nuancé : la question n'est pas oui/non mais taille et mandat — 0 % se défend ; 1 à 2 % en poche de diversification, avec budget de risque explicite et gouvernance qui assume la baisse de moitié, se défend aussi ; 10 % ne se défend pas",
    ],
    pointsAttendusEn: [
      'For: supply capped at 21 million units, halvings — a flowless asset with inelastic supply, the "digital gold" narrative',
      'For: access has been institutionalised — CME futures in late 2017, dedicated custody, spot ETFs approved in January 2024 (BlackRock, Fidelity), tens of billions collected within the first year',
      'Against: volatility on the order of 3 to 4 times equities, and correlation to risk assets that rises in stress — 2022: bitcoin ≈ −65% while the Nasdaq lost ≈ 33%',
      'Against: no cash flows, hence no valuation anchor — neither DCF nor multiple; a short history, unstable correlation regimes',
      'The analytical corrective: the ETF changed the access, not the nature of the asset — the vehicle\'s respectability is not the underlying\'s',
      'The nuanced verdict: the question is not yes/no but size and mandate — 0% is defensible; 1 to 2% as a diversification pocket, with an explicit risk budget and a governance that can stomach a halving, is defensible too; 10% is not',
    ],
    bonus: [
      "La formulation qui tient à l'oral : « un or en cours de maturation — diversifiant par temps calme, actif risqué dans les crises »",
      "Le critère de gouvernance : si le comité d'investissement ne survit pas politiquement à un −60 %, la position est trop grosse quelle que soit la thèse",
    ],
    bonusEn: [
      'The phrasing that holds at the oral: "gold still maturing — diversifying in calm times, a risk asset in crises"',
      'The governance criterion: if the investment committee cannot politically survive a −60%, the position is too big whatever the thesis',
    ],
    reponseModele: `Deux postures ruinent cette réponse : l'évangélisme — « la monnaie de demain » — et le mépris — « un casino ». Je propose la troisième voie : traiter bitcoin comme n'importe quel actif candidat à l'allocation, dossier pour, dossier contre, verdict dimensionné.

**Le dossier pour.** Une offre plafonnée par le code à 21 millions d'unités, divisée par deux tous les quatre ans : un actif sans flux à offre inélastique — l'analogie « or numérique » a un fondement réel. Et l'obstacle historique, l'accès, est tombé : futures CME dès fin 2017, conservation institutionnelle, puis les **ETF spot approuvés en janvier 2024** — BlackRock, Fidelity —, avec une collecte en dizaines de milliards dès la première année. La liquidité et la tuyauterie sont désormais aux standards institutionnels.

**Le dossier contre.** La volatilité reste de l'ordre de **3 à 4 fois celle des actions**, et surtout, la corrélation aux actifs risqués augmente dans les stress : en 2022, bitcoin a perdu environ **65 %** quand le Nasdaq en perdait 33. Un « or » qui chute deux fois plus que la bourse dans les tempêtes est, au mieux, un or en cours de maturation — diversifiant par temps calme, actif risqué dans les crises. Ajoutez l'absence de flux — donc aucun ancrage de valorisation, ni DCF ni multiple — et un historique court. Et gardons le correctif : l'ETF a changé l'**accès**, pas la **nature** de l'actif.

**Mon verdict.** La question posée en oui/non est mal posée : c'est une question de *taille* et de *mandat*. Zéro pour cent se défend parfaitement — aucun coût d'opportunité démontré. Une poche de 1 à 2 %, avec budget de risque explicite et une gouvernance capable d'assumer une baisse de moitié sans paniquer, se défend aussi. Dix pour cent ne se défend pas. Entre l'évangéliste et le méprisant, le professionnel est celui qui répond en points de pourcentage.`,
    reponseModeleEn: `Two postures ruin this answer: evangelism — "the money of tomorrow" — and contempt — "a casino". I propose the third way: treat bitcoin like any asset applying for an allocation — case for, case against, a sized verdict.

**The case for.** A supply capped by code at 21 million units, halved every four years: a flowless asset with inelastic supply — the "digital gold" analogy has a real foundation. And the historical obstacle, access, has fallen: CME futures since late 2017, institutional custody, then the **spot ETFs approved in January 2024** — BlackRock, Fidelity — with tens of billions collected within the first year. Liquidity and plumbing are now at institutional standards.

**The case against.** Volatility remains on the order of **3 to 4 times that of equities**, and above all, correlation to risk assets rises in stress: in 2022, bitcoin lost about **65%** while the Nasdaq lost 33. A "gold" that falls twice as hard as the stock market in storms is, at best, gold still maturing — diversifying in calm times, a risk asset in crises. Add the absence of cash flows — hence no valuation anchor, neither DCF nor multiple — and a short track record. And keep the corrective: the ETF changed the **access**, not the **nature** of the asset.

**My verdict.** Posed as yes/no, the question is badly posed: it is a question of *size* and *mandate*. Zero percent is perfectly defensible — no demonstrated opportunity cost. A 1-to-2% pocket, with an explicit risk budget and a governance able to stomach a halving without panic, is defensible too. Ten percent is not. Between the evangelist and the scorner, the professional is the one who answers in percentage points.`,
  },
];
