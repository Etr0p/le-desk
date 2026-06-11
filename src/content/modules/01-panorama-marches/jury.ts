import type { JuryQuestion } from '../../../engine/types';

const M1 = '01-panorama-marches';

export const jury: JuryQuestion[] = [
  {
    id: 'm1-jury-01',
    moduleId: M1,
    theme: 'fonctions des marchés',
    themeEn: 'market functions',
    difficulte: 1,
    question: 'À quoi servent les marchés financiers ?',
    questionEn: 'What are financial markets for?',
    plan: [
      'Écarter les deux mauvaises réponses : « à spéculer » et la récitation creuse',
      'Dérouler les quatre fonctions : financer, rendre liquide, découvrir les prix, transférer les risques',
      'Situer la voie de marché face à la voie bancaire',
      'Conclure : une machine efficace, avec des modes de défaillance connus',
    ],
    planEn: [
      'Dismiss the two bad answers: "to speculate" and the hollow recitation',
      'Unroll the four functions: financing, liquidity, price discovery, risk transfer',
      'Position the market route against the banking route',
      'Close: an efficient machine, with known failure modes',
    ],
    pointsAttendus: [
      "Financer : sur le marché primaire, des titres neufs s'échangent contre de l'argent frais (IPO, augmentation de capital, émission obligataire) — le seul moment où l'argent va à l'émetteur",
      "Rendre liquide : le marché secondaire permet de revendre à tout moment — on n'achète que ce qu'on pourra revendre",
      "Découvrir les prix : des milliers d'intervenants agrègent leurs fragments d'information en un signal unique, public et gratuit — l'intuition de Hayek",
      'Transférer les risques : kérosène, change, récolte — le risque ne disparaît jamais, il change de mains, via les dérivés',
      "Situer face à la banque : intermédiation (la banque porte le risque à son bilan) contre désintermédiation (le risque passe au bilan des investisseurs) — le mouvement de fond depuis les années 1980",
      'La nuance finale : bulles récurrentes et liquidité procyclique — la machine a des modes de défaillance documentés',
    ],
    pointsAttendusEn: [
      'Financing: on the primary market, newly issued securities are exchanged for fresh money (IPOs, capital increases, bond issues) — the only moment when money actually reaches the issuer',
      'Liquidity: the secondary market lets investors sell at any time — you only buy what you will be able to resell',
      "Price discovery: thousands of participants aggregate their fragments of information into a single, public, free signal — Hayek's insight",
      'Risk transfer: jet fuel, currency, harvest — risk never disappears, it changes hands, via derivatives',
      'Position against banking: intermediation (the bank carries the risk on its own balance sheet) versus disintermediation (risk moves to investors’ balance sheets) — the deep trend since the 1980s',
      'The closing nuance: recurring bubbles and procyclical liquidity — the machine has documented failure modes',
    ],
    bonus: [
      "Le dosage géographique : en zone euro, le financement des entreprises reste de l'ordre des deux tiers bancaire pour un tiers de marché ; aux États-Unis, la proportion est grossièrement inverse — d'où le projet d'union des marchés de capitaux",
      "Savoir que « à spéculer » disqualifie d'emblée : toute la valeur de la réponse tient dans l'articulation des quatre fonctions, pas dans leur énumération",
    ],
    bonusEn: [
      'The geographic mix: in the euro area, corporate financing remains roughly two-thirds bank-based for one-third market-based; in the United States the proportion is roughly reversed — hence the capital markets union project',
      'Knowing that "to speculate" disqualifies you on the spot: all the value of the answer lies in articulating the four functions, not in listing them',
    ],
    reponseModele: `La question a l'air naïve, elle ne l'est pas — et je commence par écarter les deux mauvaises réponses : « à spéculer » disqualifie, et « à financer l'économie » récité sans articulation ne vaut guère mieux. La vraie réponse tient en quatre fonctions.

**Un, financer.** Sur le marché primaire, des titres neufs s'échangent contre de l'argent frais — introduction en bourse, augmentation de capital, émission obligataire. C'est le seul moment où l'argent va à l'émetteur : l'entreprise finance son usine, l'État son déficit. **Deux, rendre liquide.** Le marché secondaire permet de revendre à tout moment — et on n'achète que ce qu'on pourra revendre : sans lui, le primaire ne fonctionnerait pas. **Trois, découvrir les prix.** Personne ne sait seul ce que vaut un baril ou la signature de la France ; des milliers d'intervenants, chacun avec son fragment d'information, produisent en achetant et en vendant un signal unique, public et gratuit — c'est l'intuition de Hayek. Ce signal pilote ensuite l'économie réelle. **Quatre, transférer les risques.** La compagnie aérienne ne veut pas vivre au rythme du kérosène : les dérivés déplacent le risque vers qui accepte de le porter, contre rémunération — le risque ne disparaît jamais, il change de mains.

J'ajoute le cadre : cette voie directe coexiste avec la voie bancaire — intermédiation quand la banque garde le risque à son bilan, désintermédiation quand il passe aux investisseurs. Et la nuance qui crédibilise : la machine a des modes de défaillance connus — bulles récurrentes, liquidité qui s'évapore en crise. Ni dévot, ni procureur.`,
    reponseModeleEn: `The question sounds naive; it is not — and I start by dismissing the two bad answers: "to speculate" disqualifies you, and "to finance the economy" recited without articulation is barely better. The real answer comes in four functions.

**One, financing.** On the primary market, newly issued securities are exchanged for fresh money — IPOs, capital increases, bond issues. It is the only moment when money actually reaches the issuer: the company funds its plant, the State its deficit. **Two, liquidity.** The secondary market lets you sell at any time — and you only buy what you will be able to resell: without it, the primary market would not work. **Three, price discovery.** Nobody knows on their own what a barrel of oil or the French sovereign signature is worth; thousands of participants, each holding a fragment of information, produce through their buying and selling a single, public, free signal — Hayek's insight. That signal then steers the real economy. **Four, risk transfer.** The airline does not want to live at the rhythm of jet fuel: derivatives move the risk to whoever agrees to carry it, for a fee — risk never disappears, it changes hands.

I add the frame: this direct route coexists with the banking route — intermediation when the bank keeps the risk on its balance sheet, disintermediation when it moves to investors. And the nuance that builds credibility: the machine has known failure modes — recurring bubbles, liquidity that evaporates in a crisis. Neither devotee nor prosecutor.`,
  },
  {
    id: 'm1-jury-02',
    moduleId: M1,
    theme: 'fonctions des marchés',
    themeEn: 'market functions',
    difficulte: 2,
    question: "Pourquoi le marché secondaire est-il vital alors qu'aucun financement n'y passe ?",
    questionEn: 'Why is the secondary market vital when no financing flows through it?',
    plan: [
      "Poser le paradoxe : au secondaire, l'émetteur ne voit pas passer un centime",
      "L'argument central : on n'achète que ce qu'on pourra revendre",
      'Chiffrer la disproportion primaire / secondaire',
      'Conclure : le « casino » est une subvention au financement',
    ],
    planEn: [
      'State the paradox: on the secondary market, the issuer never sees a cent',
      'The core argument: you only buy what you will be able to resell',
      'Put numbers on the primary / secondary disproportion',
      'Conclude: the "casino" is a subsidy to financing',
    ],
    pointsAttendus: [
      "Distinguer les deux marchés : le primaire apporte de l'argent frais à l'émetteur ; le secondaire échange des titres d'occasion entre investisseurs",
      "Sans secondaire, souscrire une obligation à trente ans immobiliserait l'épargne pour trente ans : presque personne n'accepterait, sinon contre un rendement prohibitif",
      'Parce que le secondaire permet de sortir à tout moment, les investisseurs acceptent un rendement plus faible au primaire : la liquidité du secondaire est la condition d’un primaire bon marché',
      "La disproportion chiffrée : IPO mondiales de l'ordre de 100 à 150 Md$ par an, contre plus de 100 000 Md$ d'actions échangées au secondaire ; l'AFT émet ~300 Md€ par an, que le secondaire des OAT traite en quelques semaines",
      "Le calcul qui tue : 10 points de base économisés grâce à la profondeur du secondaire, sur ~2 800 Md€ de dette négociable française, représentent de l'ordre de 2,8 Md€ d'intérêts économisés par an",
    ],
    pointsAttendusEn: [
      'Distinguish the two markets: the primary brings fresh money to the issuer; the secondary trades second-hand securities between investors',
      'Without a secondary market, subscribing to a thirty-year bond would lock up savings for thirty years: almost nobody would accept, except against a prohibitive yield',
      'Because the secondary market allows exit at any time, investors accept a lower yield at issuance: secondary liquidity is the condition for cheap primary financing',
      'The disproportion in numbers: global IPOs raise around $100-150bn a year, against more than $100,000bn of equities traded on secondary markets; the French Treasury issues ~€300bn a year, which the OAT secondary market turns over in a few weeks',
      'The killer computation: 10 basis points saved thanks to secondary-market depth, on ~€2,800bn of negotiable French debt, represent on the order of €2.8bn of interest saved every year',
    ],
    bonus: [
      "Lire l'argument dans l'autre sens : les titres peu traités doivent offrir une prime d'illiquidité — c'est le même mécanisme, vu du côté des perdants",
      "La réserve honnête : cette liquidité est procyclique — abondante quand personne n'en a besoin, évaporée en crise (2008 sur le crédit, mars 2020 jusque sur les Treasuries)",
    ],
    bonusEn: [
      'Read the argument the other way round: thinly traded securities must offer an illiquidity premium — the same mechanism, seen from the losers’ side',
      'The honest caveat: this liquidity is procyclical — abundant when nobody needs it, evaporated in a crisis (2008 in credit, March 2020 even in Treasuries)',
    ],
    reponseModele: `Le paradoxe est réel : au secondaire, les investisseurs s'échangent des titres d'occasion, et l'émetteur ne voit pas passer un centime. D'où la tentation de le juger parasitaire — et c'est un contresens complet.

L'argument central tient en une phrase : **on n'achète que ce qu'on pourra revendre**. Sans marché secondaire, souscrire une obligation à trente ans immobiliserait l'épargne pendant trente ans — presque personne n'accepterait, sinon contre un rendement prohibitif. Parce qu'un secondaire profond permet de sortir à tout moment, les investisseurs acceptent un rendement plus faible à l'émission : la liquidité du secondaire est la condition d'un primaire bon marché.

Ensuite, je chiffre la disproportion, parce qu'elle impressionne dans le bon sens. Les introductions en bourse mondiales lèvent de l'ordre de 100 à 150 Md$ par an ; la valeur des actions échangées au secondaire dépasse 100 000 Md$ par an — pour un euro d'argent frais, des centaines d'euros changent de mains entre investisseurs. Côté dette française : l'Agence France Trésor émet environ 300 Md€ par an, un montant que le secondaire des OAT traite en quelques semaines.

Et le calcul qui clôt le débat : 10 points de base d'économie grâce à la profondeur du secondaire, appliqués à environ 2 800 Md€ de dette négociable, représentent à terme de l'ordre de 2,8 Md€ d'intérêts économisés chaque année. Le prétendu « casino » est en réalité une subvention permanente au financement du primaire. Ma seule réserve : cette liquidité est procyclique — elle s'évapore précisément en crise, quand on en a le plus besoin.`,
    reponseModeleEn: `The paradox is real: on the secondary market, investors trade second-hand securities among themselves, and the issuer never sees a cent. Hence the temptation to call it parasitic — and it is a complete misreading.

The core argument fits in one sentence: **you only buy what you will be able to resell**. Without a secondary market, subscribing to a thirty-year bond would lock up savings for thirty years — almost nobody would accept, except against a prohibitive yield. Because a deep secondary market allows exit at any moment, investors accept a lower yield at issuance: secondary liquidity is the condition for cheap primary financing.

Then I put numbers on the disproportion, because they impress in the right way. Global IPOs raise around $100-150bn a year; the value of equities traded on secondary markets exceeds $100,000bn a year — for one euro of fresh money, hundreds of euros change hands between investors. On the French debt side: the Treasury agency issues about €300bn a year, an amount the OAT secondary market turns over in a few weeks.

And the computation that closes the debate: 10 basis points saved thanks to secondary-market depth, applied to roughly €2,800bn of negotiable debt, ultimately represent on the order of €2.8bn of interest saved every year. The alleged "casino" is in reality a permanent subsidy to primary financing. My only caveat: this liquidity is procyclical — it evaporates precisely in a crisis, when it is needed most.`,
  },
  {
    id: 'm1-jury-03',
    moduleId: M1,
    theme: 'fonctions des marchés',
    themeEn: 'market functions',
    difficulte: 2,
    question: '600 000 Md$ de dérivés dans le monde : faut-il avoir peur ?',
    questionEn: '$600,000bn of derivatives in the world: should we be afraid?',
    plan: [
      'Identifier la nature du chiffre : un notionnel, pas une somme en jeu',
      'Le démontrer sur un swap de 100 M€',
      'Donner les bonnes mesures : valeur de marché brute, puis exposition nette',
      'Nuancer : pas de panique, pas d’angélisme non plus — AIG, EMIR',
    ],
    planEn: [
      'Identify the nature of the number: a notional, not money at stake',
      'Demonstrate it on a €100m swap',
      'Give the right measures: gross market value, then net exposure',
      'Qualify: no panic, no complacency either — AIG, EMIR',
    ],
    pointsAttendus: [
      "Le notionnel est l'assiette sur laquelle les flux d'un contrat se calculent, pas une somme en jeu : dans un swap de taux de 100 M€, on n'échange jamais les 100 M€ — seulement des flux d'intérêts nets calculés sur ce montant",
      'Les mesures pertinentes : la valeur de marché brute des contrats — de l’ordre de 15 à 20 000 Md$ selon la BRI, trente à quarante fois moins que le notionnel',
      'Puis, après compensation des positions entre contreparties, une exposition de crédit nette de quelques milliers de Md$',
      'Le réflexe d’oral : devant tout chiffre sur les dérivés, demander s’il s’agit du notionnel, de la valeur de marché ou de l’exposition nette',
      "Pas d'angélisme pour autant : en 2008, AIG avait vendu de la protection à grande échelle sans déposer de garanties — d'où la réponse du G20 et d'EMIR : compensation centrale, déclaration, marges",
    ],
    pointsAttendusEn: [
      'The notional is the base on which a contract’s flows are computed, not money at stake: in a €100m interest rate swap, the €100m is never exchanged — only net interest flows computed on that amount',
      'The relevant measures: the gross market value of the contracts — around $15-20,000bn according to the BIS, thirty to forty times less than the notional',
      'Then, after netting positions between counterparties, a net credit exposure of a few thousand billion dollars',
      'The interview reflex: facing any derivatives number, ask whether it is the notional, the market value or the net exposure',
      'No complacency either: in 2008, AIG had sold protection at scale without posting collateral — hence the G20 response and EMIR: central clearing, reporting, margins',
    ],
    bonus: [
      'Préciser que « six à sept fois le PIB mondial » compare une assiette de calcul à un flux de production — deux grandeurs hétérogènes, le rapprochement ne mesure rien',
      'Conclure sur la phrase du cours : le risque ne disparaît jamais, il change de mains — la vraie question est de savoir si le nouveau porteur peut l’absorber',
    ],
    bonusEn: [
      'Point out that "six to seven times world GDP" compares a computation base with a production flow — two heterogeneous quantities, the comparison measures nothing',
      'Close on the course’s line: risk never disappears, it changes hands — the real question is whether the new bearer can absorb it',
    ],
    reponseModele: `Avant d'avoir peur d'un chiffre, je demande sa nature — et celui-ci est un **notionnel** : l'assiette sur laquelle les flux des contrats se calculent, pas une somme en jeu. La démonstration tient sur un swap de taux de 100 M€ de notionnel : on n'échange jamais les 100 M€ — seulement des flux d'intérêts nets calculés *sur* ce montant, soit quelques centaines de milliers d'euros par an. Dire « 600 000 Md$ de risque », c'est confondre l'assiette et l'enjeu ; et comparer ce notionnel au PIB mondial, c'est rapprocher une assiette de calcul d'un flux de production — deux grandeurs hétérogènes.

Les bonnes mesures existent. La valeur de marché brute des contrats est de l'ordre de 15 à 20 000 Md$ selon la BRI — trente à quarante fois moins que le notionnel. Et après compensation des positions entre contreparties, l'exposition de crédit nette tombe à quelques milliers de milliards. Le réflexe professionnel devant tout chiffre sur les dérivés : demander s'il s'agit du notionnel, de la valeur de marché ou de l'exposition nette.

Faut-il pour autant dormir tranquille ? Non plus. En 2008, l'assureur AIG avait vendu de la protection de crédit à grande échelle sans déposer de garanties, et n'a dû sa survie qu'à l'argent public ; la toile bilatérale des dérivés OTC était illisible. C'est exactement ce qu'EMIR a corrigé depuis 2012 : compensation centrale obligatoire des dérivés standardisés, déclaration aux référentiels, marges quotidiennes. Ma conclusion : pas de peur du chiffre, mais une vigilance sur la tuyauterie — le risque ne disparaît jamais, il change de mains, et la vraie question est de savoir si le nouveau porteur peut l'absorber.`,
    reponseModeleEn: `Before fearing a number, I ask what it is — and this one is a **notional**: the base on which contract flows are computed, not money at stake. The demonstration fits on a €100m interest rate swap: the €100m is never exchanged — only net interest flows computed *on* that amount, a few hundred thousand euros a year. Saying "$600,000bn of risk" confuses the base with the stake; and comparing that notional to world GDP sets a computation base against a production flow — two heterogeneous quantities.

The right measures exist. The gross market value of the contracts is around $15-20,000bn according to the BIS — thirty to forty times less than the notional. And after netting positions between counterparties, the net credit exposure falls to a few thousand billion. The professional reflex in front of any derivatives figure: ask whether it is the notional, the market value or the net exposure.

Should we therefore sleep soundly? Not quite. In 2008, the insurer AIG had sold credit protection at scale without posting collateral, and only survived thanks to public money; the bilateral web of OTC derivatives was unreadable. That is exactly what EMIR has fixed since 2012: mandatory central clearing of standardised derivatives, reporting to trade repositories, daily margins. My conclusion: no fear of the number, but vigilance on the plumbing — risk never disappears, it changes hands, and the real question is whether the new bearer can absorb it.`,
  },
  {
    id: 'm1-jury-04',
    moduleId: M1,
    theme: 'acteurs',
    themeEn: 'market players',
    difficulte: 1,
    question: 'Sell-side et buy-side : qui fait quoi, et qui paie qui ?',
    questionEn: 'Sell-side and buy-side: who does what, and who pays whom?',
    plan: [
      'Poser la frontière : vendre des services de marché contre gérer l’argent des autres',
      'Le sell-side et ses quatre produits',
      'Le buy-side et ses quatre familles, avec les ordres de grandeur',
      'Suivre l’argent : qui paie quoi, et où se capte la valeur',
    ],
    planEn: [
      'Draw the line: selling market services versus managing other people’s money',
      'The sell-side and its four products',
      'The buy-side and its four families, with orders of magnitude',
      'Follow the money: who pays what, and where the value is captured',
    ],
    pointsAttendus: [
      'Sell-side : les banques d’investissement et courtiers — JPMorgan, Goldman Sachs, BNP Paribas — qui vendent des services de marché via leur BFI',
      "Leurs quatre produits : l'accès au primaire (équipes DCM et ECM), la liquidité au secondaire (market making), la recherche, la structuration",
      'Buy-side : gérants d’actifs (BlackRock ~11 500 Md$ fin 2024, Amundi ~2 200 Md€), hedge funds (~4 500-5 000 Md$), assureurs et fonds de pension (les piliers de l’obligataire), fonds souverains (~13 000 Md$)',
      'Qui paie qui : le buy-side paie le sell-side — commissions, spreads — et se rémunère lui-même en pourcentage des encours de ses clients finaux (0,05-0,3 % en passif, 1-2 % en actif grand public)',
      "L'autopsie des coûts : exécuter 1 M€ d'actions coûte ~800 € (0,08 %) ; le même million logé dans un fonds à 0,3 % coûte 3 000 € par an, chaque année — la valeur se capte à la décision, pas à l'exécution",
    ],
    pointsAttendusEn: [
      'Sell-side: the investment banks and brokers — JPMorgan, Goldman Sachs, BNP Paribas — selling market services through their corporate and investment banking arm',
      'Their four products: primary market access (DCM and ECM teams), secondary market liquidity (market making), research, structuring',
      'Buy-side: asset managers (BlackRock ~$11,500bn at end-2024, Amundi ~€2,200bn), hedge funds (~$4,500-5,000bn), insurers and pension funds (the pillars of the bond market), sovereign wealth funds (~$13,000bn)',
      'Who pays whom: the buy-side pays the sell-side — commissions, spreads — and is itself paid as a percentage of its end clients’ assets (0.05-0.3% passive, 1-2% retail active)',
      'The cost autopsy: executing €1m of equities costs ~€800 (0.08%); the same million parked in a 0.3% fund costs €3,000 a year, every year — value is captured at the decision, not at the execution',
    ],
    bonus: [
      'Le test du jury : classer un nom en une seconde — Amundi buy-side, Goldman sell-side, Euronext infrastructure, LCH chambre de compensation',
      'Le sommet de l’échelle des frais : le « 2/20 » des hedge funds, qui s’érode vers ~1,4 % et ~16 % sous la pression des institutionnels et de la gestion passive',
    ],
    bonusEn: [
      'The panel’s test: classify a name in one second — Amundi buy-side, Goldman sell-side, Euronext infrastructure, LCH clearing house',
      'The top of the fee ladder: the hedge funds’ "2/20", eroding towards ~1.4% and ~16% under pressure from institutional investors and passive management',
    ],
    reponseModele: `La frontière tient en une phrase : le **sell-side** vend des services de marché, le **buy-side** gère l'argent des autres et achète ces services.

Le sell-side, ce sont les banques d'investissement et les courtiers — JPMorgan, Goldman Sachs, BNP Paribas — via leur BFI. Quatre produits : l'accès au marché primaire, où les équipes DCM et ECM organisent les émissions ; la liquidité au secondaire, où les teneurs de marché cotent en continu et vivent de la fourchette ; la recherche ; et la structuration, le sur-mesure.

Le buy-side se range en quatre familles, avec les ordres de grandeur. Les gérants d'actifs : BlackRock, numéro un mondial, environ 11 500 Md$ fin 2024 ; Amundi, premier européen, de l'ordre de 2 200 Md€. Les hedge funds : 4 500 à 5 000 Md$ pour l'industrie, mais un levier qui démultiplie leur empreinte. Les assureurs et fonds de pension, géants oubliés et vrais piliers de l'obligataire, dictés par leur passif. Et les fonds souverains, environ 13 000 Md$.

Qui paie qui ? Le buy-side paie le sell-side — commissions de courtage, spreads — et se rémunère lui-même en pourcentage des encours : 0,05 à 0,3 % en gestion passive, 1 à 2 % en gestion active grand public. L'autopsie des coûts du cours fixe les idées : exécuter 1 M€ d'actions coûte environ 800 €, soit 0,08 % ; le même million logé dans un fonds à 0,3 % coûte 3 000 € par an, *chaque année*. La valeur ne se capte pas là où l'ordre s'exécute, mais là où se tiennent la relation client et la décision d'investissement.`,
    reponseModeleEn: `The boundary fits in one sentence: the **sell-side** sells market services; the **buy-side** manages other people's money and buys those services.

The sell-side means the investment banks and brokers — JPMorgan, Goldman Sachs, BNP Paribas — through their corporate and investment banking arms. Four products: primary market access, where DCM and ECM teams organise issuance; secondary market liquidity, where market makers quote continuously and live off the spread; research; and structuring, the made-to-measure business.

The buy-side falls into four families, with orders of magnitude. Asset managers: BlackRock, world number one, about $11,500bn at end-2024; Amundi, Europe's largest, around €2,200bn. Hedge funds: $4,500-5,000bn for the industry, but leverage multiplies their footprint. Insurers and pension funds, the forgotten giants and true pillars of the bond market, driven by their liabilities. And sovereign wealth funds, about $13,000bn.

Who pays whom? The buy-side pays the sell-side — brokerage commissions, spreads — and is itself paid as a percentage of assets: 0.05 to 0.3% for passive management, 1 to 2% for retail active funds. The course's cost autopsy fixes the picture: executing €1m of equities costs about €800, i.e. 0.08%; the same million parked in a 0.3% fund costs €3,000 a year, *every year*. Value is not captured where the order is executed, but where the client relationship and the investment decision sit.`,
  },
  {
    id: 'm1-jury-05',
    moduleId: M1,
    theme: 'acteurs',
    themeEn: 'market players',
    difficulte: 3,
    question: 'BlackRock gère plus de 11 000 Md$ : est-ce dangereux ?',
    questionEn: 'BlackRock manages more than $11,000bn: is that dangerous?',
    plan: [
      'Écarter le contresens : « la plus grande banque du monde »',
      'Expliquer le modèle : fonds séparés, dépositaires, frais de gestion',
      'Déplacer la question : la concentration du pouvoir actionnarial',
      'Élargir au débat passif et conclure en nuance',
    ],
    planEn: [
      'Dismiss the misreading: "the world’s largest bank"',
      'Explain the model: segregated funds, custodians, management fees',
      'Move the question: the concentration of shareholder power',
      'Broaden to the passive debate and close with nuance',
    ],
    pointsAttendus: [
      'Les 11 500 Md$ ne sont pas l’argent de BlackRock : ce sont les avoirs de ses clients, logés dans des fonds juridiquement séparés et conservés chez des dépositaires indépendants',
      'Gains et pertes reviennent aux clients ; BlackRock encaisse des frais de gestion, et son propre bilan est minuscule face aux encours — une banque, à l’inverse, porte dépôts et crédits à son bilan et peut faire faillite sur son portefeuille',
      'Dire « BlackRock, la plus grande banque du monde » est donc un contresens immédiat — pas de risque bancaire classique de type ruée sur les dépôts',
      'La vraie question : la concentration du pouvoir actionnarial — BlackRock, Vanguard et State Street figurent parmi les premiers actionnaires de la plupart des grandes capitalisations américaines',
      "Le moteur : la gestion passive à 0,05-0,3 % aspire les encours ; et les fournisseurs d'indices (MSCI, S&P DJ, FTSE Russell) déplacent des milliards de flux d'un trait de plume",
    ],
    pointsAttendusEn: [
      'The $11,500bn is not BlackRock’s money: it is clients’ assets, held in legally segregated funds and kept with independent custodians',
      'Gains and losses accrue to clients; BlackRock collects management fees, and its own balance sheet is tiny compared with the assets — a bank, by contrast, carries deposits and loans on its balance sheet and can fail on its portfolio',
      'Calling BlackRock "the world’s largest bank" is therefore an immediate misreading — no classic bank-run risk',
      'The real question: the concentration of shareholder power — BlackRock, Vanguard and State Street rank among the top shareholders of most large US listed companies',
      'The engine: passive management at 0.05-0.3% vacuums up assets; and index providers (MSCI, S&P DJ, FTSE Russell) move billions of flows with a stroke of the pen',
    ],
    bonus: [
      "L'ordre de grandeur qui frappe : 11 500 Md$, c'est l'équivalent de près de quatre PIB français — donné en une demi-phrase, il montre qu'on sait situer les masses",
      'La distinction fine : le danger éventuel n’est pas un risque de faillite mais une question de gouvernance et de concentration — un débat ouvert, pas une conclusion',
    ],
    bonusEn: [
      'The striking order of magnitude: $11,500bn is the equivalent of nearly four times French GDP — dropped in half a sentence, it shows you can place the masses',
      'The fine distinction: the potential danger is not a failure risk but a governance and concentration question — an open debate, not a conclusion',
    ],
    reponseModele: `Je commence par désamorcer le contresens classique : non, BlackRock n'est pas « la plus grande banque du monde ». Les 11 500 Md$ — l'équivalent de près de quatre PIB français — ne sont pas l'argent de BlackRock : ce sont les avoirs de ses clients, logés dans des fonds juridiquement séparés et conservés chez des dépositaires indépendants. Les gains comme les pertes reviennent aux clients ; BlackRock encaisse des frais de gestion, et son propre bilan est minuscule face aux encours. Une banque, à l'inverse, porte dépôts et crédits à son bilan et peut faire faillite sur son portefeuille. Le risque bancaire classique — la ruée, la faillite qui emporte les déposants — ne s'applique tout simplement pas à un gérant d'actifs.

Mais la question « est-ce dangereux ? » ne disparaît pas, elle se déplace. La vraie interrogation que soulèvent ces encours, c'est la **concentration du pouvoir actionnarial** : BlackRock, Vanguard et State Street figurent parmi les premiers actionnaires de la plupart des grandes capitalisations américaines. Trois maisons qui votent aux assemblées générales de presque tout l'indice — c'est une question de gouvernance inédite.

Le moteur de cette concentration est le débat passif : la gestion indicielle à 0,05-0,3 % de frais aspire les encours face à la gestion active à 1-2 %. Et dans ce monde indiciel, les fournisseurs d'indices — MSCI, S&P Dow Jones, FTSE Russell — exercent un pouvoir discret considérable : décider qu'un pays entre dans un indice déplace des milliards de flux d'un trait de plume.

Ma conclusion nuancée : pas de danger de faillite — un danger éventuel de concentration, réel, débattu, et non tranché.`,
    reponseModeleEn: `I start by defusing the classic misreading: no, BlackRock is not "the world's largest bank". The $11,500bn — the equivalent of nearly four times French GDP — is not BlackRock's money: it is clients' assets, held in legally segregated funds and kept with independent custodians. Gains and losses accrue to the clients; BlackRock collects management fees, and its own balance sheet is tiny compared with the assets. A bank, by contrast, carries deposits and loans on its balance sheet and can fail on its portfolio. Classic banking risk — the run, the failure that takes depositors down — simply does not apply to an asset manager.

But the question "is it dangerous?" does not vanish; it moves. The real issue raised by those assets is the **concentration of shareholder power**: BlackRock, Vanguard and State Street rank among the top shareholders of most large US listed companies. Three houses voting at the general meetings of nearly the whole index — that is an unprecedented governance question.

The engine of that concentration is the passive debate: index management at 0.05-0.3% in fees vacuums up assets against active management at 1-2%. And in that indexed world, the index providers — MSCI, S&P Dow Jones, FTSE Russell — wield considerable quiet power: deciding that a country joins an index moves billions of flows with a stroke of the pen.

My nuanced conclusion: no failure danger — a potential concentration danger, real, debated, and unsettled.`,
  },
  {
    id: 'm1-jury-06',
    moduleId: M1,
    theme: 'salle des marchés',
    themeEn: 'trading floor',
    difficulte: 1,
    question: 'Décrivez-moi une salle des marchés.',
    questionEn: 'Describe a trading floor to me.',
    plan: [
      'La géographie : front, middle, back — trois lignes de défense',
      'Les quatre familles du front office et leur organisation par classes d’actifs',
      'Le rythme d’une journée, de 6 h 50 au passage de relais',
      'Les garde-fous : middle office indépendant et muraille de Chine',
    ],
    planEn: [
      'The geography: front, middle, back — three lines of defence',
      'The four front-office families and the asset-class organisation',
      'The rhythm of a day, from 6:50 am to the handover',
      'The safeguards: independent middle office and Chinese wall',
    ],
    pointsAttendus: [
      'Front office : ceux qui font face au marché et génèrent le revenu — traders (ils cotent et engagent le bilan), sales (la relation client), structureurs (le sur-mesure), quants (les modèles)',
      'Middle office : validation indépendante du P&L, surveillance des limites de risque — son indépendance est vitale, l’affaire Kerviel (2008) est l’histoire d’alertes non suivies',
      'Back office : règlement-livraison, réconciliations — invisible du client, indispensable au système',
      'L’organisation par classes d’actifs — actions, taux, crédit, change, matières premières — en miroir de la carte des marchés',
      'Le rythme : arrivée 6 h 50 sur l’Asie, morning meeting 7 h 15, flux client toute la journée, statistiques américaines 14 h 30, fixing de clôture 17 h 30, arrêté du P&L et passage de relais le soir',
      'La muraille de Chine : barrière physique et procédurale entre l’information privilégiée (M&A) et les équipes de marché',
    ],
    pointsAttendusEn: [
      'Front office: those facing the market and generating revenue — traders (they quote and commit the balance sheet), sales (client relationships), structurers (made-to-measure), quants (the models)',
      'Middle office: independent P&L validation, risk-limit monitoring — its independence is vital, the Kerviel affair (2008) is, among other things, the story of unheeded alerts',
      'Back office: settlement, reconciliations — invisible to the client, indispensable to the system',
      'Organisation by asset class — equities, rates, credit, FX, commodities — mirroring the map of markets',
      'The rhythm: in at 6:50 am on Asia, morning meeting at 7:15, client flow all day, US statistics at 2:30 pm, closing auction at 5:30 pm, P&L sign-off and handover in the evening',
      'The Chinese wall: a physical and procedural barrier between privileged information (M&A) and the market teams',
    ],
    bonus: [
      'Glisser le chiffre qui cadre tout : environ 90 % du flux d’un desk bancaire est du flux client et de la couverture — la salle est une usine de service, pas un casino',
      'Le détail vrai qui fait pro : les conversations téléphoniques y sont enregistrées et archivées — une obligation réglementaire, pas un mythe de cinéma',
    ],
    bonusEn: [
      'Slip in the framing number: about 90% of a bank desk’s flow is client flow and hedging — the floor is a service factory, not a casino',
      'The true detail that sounds professional: phone conversations are recorded and archived — a regulatory obligation, not a movie myth',
    ],
    reponseModele: `Physiquement : quelques centaines de personnes, six écrans par tête, un niveau sonore qui monte avec la volatilité. Mais la bonne description est fonctionnelle — trois lignes de défense, des écrans vers la comptabilité.

Le **front office** fait face au marché et génère le revenu. Quatre familles : les traders, qui cotent les prix et sont les seuls à engager le bilan de la banque ; les sales, qui tiennent la relation avec les clients institutionnels ; les structureurs, qui assemblent le sur-mesure ; les quants, qui construisent les modèles derrière chaque prix affiché. Le tout organisé par classes d'actifs — actions, taux, crédit, change, matières premières. Le **middle office** contrôle : il valide chaque jour le P&L des desks par un calcul indépendant et surveille les limites de risque. Son indépendance est vitale — l'affaire Kerviel, en 2008, est entre autres l'histoire d'un middle office dont les alertes n'ont pas été suivies. Le **back office** assure l'aval : règlement-livraison, réconciliations — invisible du client, indispensable.

Le rythme, ensuite : arrivée vers 6 h 50 pour lire la nuit asiatique, morning meeting à 7 h 15, appels clients, flux de demandes de prix toute la journée, statistiques américaines à 14 h 30 — trente secondes de silence, puis tout le monde recote —, fixing de clôture à 17 h 30, arrêté du P&L et passage de relais à New York ou Singapour.

Et je termine sur ce qui corrige l'image d'Épinal : environ 90 % du flux d'un desk est du flux client et de la couverture, les conversations sont enregistrées — obligation réglementaire —, et une muraille de Chine sépare strictement les équipes de marché de l'information privilégiée du M&A. Une usine de service très réglementée, pas un casino.`,
    reponseModeleEn: `Physically: a few hundred people, six screens each, a noise level that rises with volatility. But the right description is functional — three lines of defence, from the screens to the books.

The **front office** faces the market and generates the revenue. Four families: the traders, who quote prices and are the only ones who commit the bank's balance sheet; the sales, who own the relationship with institutional clients; the structurers, who assemble made-to-measure products; the quants, who build the models behind every quoted price. All of it organised by asset class — equities, rates, credit, FX, commodities. The **middle office** controls: it validates each desk's P&L daily with an independent computation and monitors risk limits. Its independence is vital — the Kerviel affair, in 2008, is among other things the story of a middle office whose alerts went unheeded. The **back office** handles the downstream: settlement, reconciliations — invisible to the client, indispensable.

Then the rhythm: in around 6:50 am to read the Asian session, morning meeting at 7:15, client calls, requests for quotes all day, US statistics at 2:30 pm — thirty seconds of silence, then everyone re-quotes —, closing auction at 5:30 pm, P&L sign-off and handover to New York or Singapore.

And I close on what corrects the cliché: about 90% of a desk's flow is client flow and hedging, conversations are recorded — a regulatory obligation —, and a Chinese wall strictly separates the market teams from the M&A side's privileged information. A heavily regulated service factory, not a casino.`,
  },
  {
    id: 'm1-jury-07',
    moduleId: M1,
    theme: 'salle des marchés',
    themeEn: 'trading floor',
    difficulte: 2,
    question: 'Trader, c’est parier ?',
    questionEn: 'Is trading gambling?',
    plan: [
      'Répondre non pour l’essentiel — et le chiffrer : ~90 % de flux client',
      'Expliquer le modèle du market maker : fourchette × rotation, pas direction',
      'Raconter la disparition du prop trading bancaire : la règle Volcker',
      'Conclure sur la réponse d’entretien : cotation, inventaire, service',
    ],
    planEn: [
      'Answer no for the essential — and quantify it: ~90% client flow',
      'Explain the market maker’s model: spread × turnover, not direction',
      'Tell the disappearance of bank prop trading: the Volcker rule',
      'Close on the interview answer: quoting, inventory, service',
    ],
    pointsAttendus: [
      'L’écrasante majorité du flux d’un desk bancaire — de l’ordre de 90 % — est du flux client et de la couverture : le client demande un prix, le trader cote, exécute, puis neutralise le risque absorbé',
      'Le market maker vit de la fourchette multipliée par la rotation, pas du pari directionnel',
      'Le trader pour compte propre — des positions pures avec le capital de la banque — a quasiment disparu des banques : règle Volcker (Dodd-Frank, 2010) et équivalents européens',
      'L’activité a migré vers les hedge funds et les firmes de trading indépendantes ; en banque, le risque résiduel est celui qu’exige la tenue de marché : porter l’inventaire entre l’achat du client et la couverture',
      'En entretien, « j’aime le trading parce que j’aime le risque » est éliminatoire : la bonne réponse parle de cotation, de gestion d’inventaire et de service au client',
    ],
    pointsAttendusEn: [
      'The overwhelming majority of a bank desk’s flow — around 90% — is client flow and hedging: the client asks for a price, the trader quotes, executes, then neutralises the absorbed risk',
      'The market maker lives off the spread multiplied by turnover, not directional bets',
      'The proprietary trader — pure positions with the bank’s capital — has all but disappeared from banks: the Volcker rule (Dodd-Frank, 2010) and its European equivalents',
      'The activity migrated to hedge funds and independent trading firms; in banks, the residual risk is the one market making requires: carrying inventory between the client’s trade and the hedge',
      'In an interview, "I love trading because I love risk" is disqualifying: the right answer talks about quoting, inventory management and client service',
    ],
    bonus: [
      'La frontière délicate de Volcker : le market making exige de porter des positions — où finit le service au client, où commence le pari maison ? Des années de textes d’application ont tenté de tracer la ligne',
      'L’idée de la règle en une phrase : l’argent du contribuable, qui garantit les dépôts, ne doit pas financer la table de poker maison',
    ],
    bonusEn: [
      'Volcker’s delicate boundary: market making requires carrying positions — where does client service end, where does the house bet begin? Years of implementing rules tried to draw the line',
      'The rule’s idea in one sentence: taxpayer money, which guarantees deposits, must not fund the house poker table',
    ],
    reponseModele: `Pour l'essentiel, non — et je peux le chiffrer. L'écrasante majorité du flux d'un desk bancaire, de l'ordre de 90 %, est du flux client et de la couverture : un client demande un prix, le trader cote, exécute, puis neutralise le risque qu'il vient d'absorber. Le revenu vient de la fourchette multipliée par la rotation, pas de la direction du marché. Le market maker est un commerçant de liquidité, pas un parieur.

Historiquement, il existait bien une seconde espèce : le trader pour compte propre, qui prenait des positions pures avec le capital de la banque, sans client en face. Cette espèce a quasiment disparu des banques — et c'est une décision politique, pas une évolution naturelle. Après 2008, la règle Volcker, logée dans le Dodd-Frank Act de 2010, a interdit aux banques qui collectent des dépôts garantis le trading pour compte propre : l'argent du contribuable, qui garantit les dépôts, ne doit pas financer la table de poker maison. L'activité a migré vers les hedge funds et les firmes de trading indépendantes. En banque, le risque résiduel est celui qu'exige la tenue de marché : porter l'inventaire entre l'achat du client et la couverture — et la frontière entre ce service et le pari maison reste délicate à tracer, des années de textes d'application en témoignent.

D'où la réponse qui compte en entretien : dire « j'aime le trading parce que j'aime le risque » est éliminatoire. Le vrai métier, c'est coter juste, gérer un inventaire, servir le flux — et le risque y est un coût à maîtriser, pas un plaisir à rechercher.`,
    reponseModeleEn: `For the essential, no — and I can quantify it. The overwhelming majority of a bank desk's flow, around 90%, is client flow and hedging: a client asks for a price, the trader quotes, executes, then neutralises the risk just absorbed. The revenue comes from the spread multiplied by turnover, not from the market's direction. The market maker is a liquidity merchant, not a gambler.

Historically there was indeed a second species: the proprietary trader, taking pure positions with the bank's capital, with no client on the other side. That species has all but disappeared from banks — and it was a political decision, not natural evolution. After 2008, the Volcker rule, housed in the 2010 Dodd-Frank Act, banned proprietary trading at banks that collect insured deposits: taxpayer money, which guarantees the deposits, must not fund the house poker table. The activity migrated to hedge funds and independent trading firms. In banks, the residual risk is the one market making requires: carrying inventory between the client's trade and the hedge — and the boundary between that service and a house bet remains delicate to draw, as years of implementing rules attest.

Hence the answer that matters in an interview: saying "I love trading because I love risk" is disqualifying. The real job is quoting right, managing an inventory, serving the flow — and risk there is a cost to control, not a thrill to seek.`,
  },
  {
    id: 'm1-jury-08',
    moduleId: M1,
    theme: 'salle des marchés',
    themeEn: 'trading floor',
    difficulte: 2,
    question: 'Si je vous embauche en sales, racontez-moi votre journée.',
    questionEn: 'If I hire you as a salesperson, walk me through your day.',
    plan: [
      'Le matin : morning meeting, la munition pour les appels',
      'Les appels clients : une vue et une proposition en quelques phrases, l’axe du desk',
      'La journée au fil du flux : demandes de prix, statistiques, New York',
      'Le soir : recap clients — et comment un sales est payé',
    ],
    planEn: [
      'The morning: morning meeting, the ammunition for the calls',
      'Client calls: a view and a proposal in a few sentences, the desk’s axe',
      'The day along the flow: requests for quotes, statistics, New York',
      'The evening: client recaps — and how a salesperson gets paid',
    ],
    pointsAttendus: [
      'Morning meeting à 7 h 15 : l’économiste passe les chiffres du jour, la recherche donne ses vues, chaque trader résume sa position — la munition des appels clients',
      'Dès 8 h, les appels : assureurs, gérants, trésoriers — une vue et une proposition en quelques phrases, et la diffusion de l’« axe » du desk aux clients susceptibles d’avoir l’intérêt inverse',
      'Le sales connaît le portefeuille, les contraintes et les habitudes de chaque client : il apporte les prix du desk et les idées de la recherche — c’est le trader qui cote, le sales qui couvre la relation',
      'La journée suit le flux : demandes de prix transmises, statistiques américaines à 14 h 30, ouverture de New York à 15 h 30 — souvent les heures les plus actives',
      'Le soir : recap aux clients, arrêté du jour — et la rémunération : le sales credit, la marge commerciale générée par son flux',
    ],
    pointsAttendusEn: [
      'Morning meeting at 7:15: the economist runs through the day’s numbers, research gives its views, each trader sums up his position — the ammunition for client calls',
      'From 8 am, the calls: insurers, asset managers, corporate treasurers — a view and a proposal in a few sentences, and broadcasting the desk’s "axe" to clients likely to have the opposite interest',
      'The salesperson knows each client’s portfolio, constraints and habits: he brings the desk’s prices and research ideas — the trader quotes, the salesperson owns the relationship',
      'The day follows the flow: requests for quotes passed through, US statistics at 2:30 pm, New York opening at 3:30 pm — often the most active hours',
      'The evening: client recaps, the day’s close — and the pay: the sales credit, the commercial margin generated by the flow',
    ],
    bonus: [
      'Donner un exemple d’appel du matin qui sonne vrai : « le marché ouvre vendeur, l’adjudication d’OAT va peser, on a un axe acheteur sur le 10 ans »',
      'Le contraste de tempo avec le buy-side : le sell-side vit à la seconde, le client vit à l’horizon de son portefeuille — un bon sales fait l’interface entre les deux',
    ],
    bonusEn: [
      'Give a morning-call example that rings true: "the market opens offered, the OAT auction will weigh, we have a buying axe on the 10-year"',
      'The tempo contrast with the buy-side: the sell-side lives by the second, the client lives at the horizon of his portfolio — a good salesperson bridges the two',
    ],
    reponseModele: `J'arrive avant 7 h pour lire la nuit — l'Asie, les futures américains — parce que mon premier rendez-vous est le **morning meeting de 7 h 15** : quinze minutes debout, l'économiste passe les chiffres du jour — une inflation à 11 h, une adjudication d'OAT à 10 h 50 —, la recherche donne ses vues, chaque trader résume sa position. Pour moi, c'est de la munition : tout ce que je dirai à mes clients dans l'heure qui suit vient de là.

À 8 h, j'appelle — assureurs, gérants, trésoriers d'entreprise. Le format : une vue et une proposition en quelques phrases. « Le marché ouvre vendeur, l'adjudication va peser, on a un axe acheteur sur le 10 ans. » L'axe, c'est l'intérêt du moment du desk, que je diffuse aux clients susceptibles d'avoir l'intérêt inverse — c'est comme ça que je fais gagner du flux à mon trader et du service à mon client.

Ensuite, la journée suit le flux. Une demande de prix sur 50 M€ d'obligations arrive : je la porte au trader — lui seul cote et engage le bilan —, j'annonce le prix, je tiens la relation. À 14 h 30, les statistiques américaines tombent et tout le monde recote ; à 15 h 30, New York ouvre — souvent les deux heures les plus actives.

Le soir : recap aux clients, débrief du desk. Et puisque vous m'embauchez : je suis payé sur le **sales credit**, la marge commerciale que génère mon flux. Mon actif, c'est la connaissance fine de chaque client — son portefeuille, ses contraintes, ses habitudes. C'est un métier de mémoire et de confiance, au tempo de la salle.`,
    reponseModeleEn: `I am in before 7 am to read the overnight session — Asia, US futures — because my first appointment is the **7:15 morning meeting**: fifteen minutes standing, the economist runs through the day's numbers — an inflation print at 11, an OAT auction at 10:50 —, research gives its views, each trader sums up his position. For me, that is ammunition: everything I tell my clients in the next hour comes from there.

At 8, I call — insurers, asset managers, corporate treasurers. The format: a view and a proposal in a few sentences. "The market opens offered, the auction will weigh, we have a buying axe on the 10-year." The axe is the desk's interest of the moment, which I broadcast to the clients likely to hold the opposite interest — that is how I win flow for my trader and service for my client.

Then the day follows the flow. A request for a quote on €50m of bonds comes in: I take it to the trader — he alone quotes and commits the balance sheet —, I announce the price, I own the relationship. At 2:30 pm the US statistics drop and everyone re-quotes; at 3:30 pm New York opens — often the two most active hours.

In the evening: client recaps, desk debrief. And since you are hiring me: I am paid on the **sales credit**, the commercial margin my flow generates. My asset is the fine knowledge of each client — his portfolio, his constraints, his habits. It is a job of memory and trust, at the floor's tempo.`,
  },
  {
    id: 'm1-jury-09',
    moduleId: M1,
    theme: 'microstructure',
    themeEn: 'microstructure',
    difficulte: 3,
    question: 'Pourquoi le spread bid-ask existe-t-il ?',
    questionEn: 'Why does the bid-ask spread exist?',
    plan: [
      'Première lecture : le prix de l’immédiateté',
      'Deuxième couche : le risque d’inventaire du market maker',
      'Troisième couche, le cœur : la sélection adverse',
      'Le mini-modèle chiffré qui prouve le mécanisme',
    ],
    planEn: [
      'First reading: the price of immediacy',
      'Second layer: the market maker’s inventory risk',
      'Third layer, the heart: adverse selection',
      'The numbered mini-model that proves the mechanism',
    ],
    pointsAttendus: [
      'Le spread est d’abord le prix de l’immédiateté : qui veut traiter tout de suite paie l’aller-retour — et rémunère celui qui offre la liquidité en continu',
      'Risque d’inventaire : le market maker reste porteur entre les deux jambes ; sa parade est de faire glisser ses cotations pour ramener l’inventaire vers zéro',
      'Sélection adverse : face aux intervenants informés, le market maker est systématiquement du mauvais côté — le spread est calibré pour que les gains sur le flux ordinaire couvrent ces pertes : une prime d’assurance, pas un péage arbitraire',
      'Le mini-modèle : titre valant 101 ou 99 à parts égales, 10 % d’informés → ask à 100,10, bid à 99,90, spread de 20 centimes sans le moindre coût de traitement ; avec 20 % d’informés, le spread double',
      'L’implication observable : le spread s’élargit dès que la probabilité de croiser un informé augmente — veille de résultats, rumeur d’OPA, statistique imminente',
    ],
    pointsAttendusEn: [
      'The spread is first the price of immediacy: whoever wants to trade right now pays the round trip — and remunerates the one offering continuous liquidity',
      'Inventory risk: the market maker stays exposed between the two legs; his defence is to shift his quotes to bring inventory back towards zero',
      'Adverse selection: against informed traders, the market maker is systematically on the wrong side — the spread is calibrated so that gains on ordinary flow cover those losses: an insurance premium, not an arbitrary toll',
      'The mini-model: a stock worth 101 or 99 with equal odds, 10% informed traders → ask at 100.10, bid at 99.90, a 20-cent spread with zero processing cost; with 20% informed, the spread doubles',
      'The observable implication: the spread widens whenever the probability of meeting an informed trader rises — eve of earnings, takeover rumour, imminent statistic',
    ],
    bonus: [
      'Savoir dérouler le calcul sans citer le nom : c’est le cœur d’un classique de la microstructure (Glosten et Milgrom, 1985) — le raisonnement vaut plus que la référence',
      'Le réflexe de desk qui en découle : chaque transaction est lue comme un signal — un flux d’achats persistant fait remonter les cotations, même sans la moindre nouvelle publiée',
    ],
    bonusEn: [
      'Knowing how to run the computation without dropping the name: it is the heart of a microstructure classic (Glosten and Milgrom, 1985) — the reasoning is worth more than the reference',
      'The desk reflex that follows: every trade is read as a signal — persistent buying flow lifts the quotes, even with no news published at all',
    ],
    reponseModele: `Première lecture, la plus simple : le spread est le **prix de l'immédiateté**. Qui veut acheter tout de suite paie le meilleur ask, qui veut vendre tout de suite touche le meilleur bid : l'aller-retour instantané coûte exactement le spread, et ce péage rémunère celui qui s'engage à coter en continu.

Mais pourquoi ce service a-t-il un prix ? Deux risques le justifient. D'abord le **risque d'inventaire** : l'aller-retour immédiat est l'exception, le market maker reste porteur entre les deux jambes — s'il accumule des titres pendant que le marché baisse, son stock se déprécie plus vite qu'il n'encaisse de spreads. Sa parade est permanente : faire glisser ses cotations pour ramener l'inventaire vers zéro.

Ensuite, le cœur du métier : la **sélection adverse**. Le market maker traite avec des anonymes, et certains en savent plus que lui — on lui achète en taille juste avant la bonne nouvelle, on lui vend juste avant la mauvaise. Impossible de trier à l'entrée : la défense passe par le prix. Le mini-modèle du cours le prouve. Un titre vaudra 101 ou 99 à parts égales ; 10 % des intervenants sont informés. Recevoir un ordre d'achat est alors une petite mauvaise nouvelle pour le vendeur : conditionnellement à un achat, la valeur espérée n'est plus 100 mais 100,10. Pour ne pas perdre en moyenne, le market maker cote l'ask à 100,10 et, par symétrie, le bid à 99,90 — 20 centimes de spread sans le moindre coût de traitement. Avec 20 % d'informés, le spread double.

D'où l'implication observable sur n'importe quel desk : le spread s'élargit mécaniquement dès que la probabilité de croiser un informé monte — veille de résultats, rumeur d'OPA. Le spread n'est pas un péage arbitraire : c'est une prime d'assurance contre l'asymétrie d'information.`,
    reponseModeleEn: `First reading, the simplest: the spread is the **price of immediacy**. Whoever wants to buy right now pays the best ask, whoever wants to sell right now hits the best bid: the instant round trip costs exactly the spread, and that toll pays the one who commits to quoting continuously.

But why does that service have a price? Two risks justify it. First, **inventory risk**: the immediate round trip is the exception; the market maker stays exposed between the two legs — if he accumulates stock while the market falls, his inventory depreciates faster than he collects spreads. His defence is permanent: shifting his quotes to bring the inventory back towards zero.

Then, the heart of the trade: **adverse selection**. The market maker deals with anonymous counterparties, and some know more than he does — they buy from him in size just before the good news, sell to him just before the bad one. Impossible to screen at the door: the defence works through the price. The course's mini-model proves it. A stock will be worth 101 or 99 with equal odds; 10% of participants are informed. Receiving a buy order is then a small piece of bad news for the seller: conditional on a buy, the expected value is no longer 100 but 100.10. To break even on average, the market maker quotes the ask at 100.10 and, by symmetry, the bid at 99.90 — a 20-cent spread with zero processing cost. With 20% informed, the spread doubles.

Hence the observable implication on any desk: the spread widens mechanically whenever the probability of meeting an informed trader rises — eve of earnings, takeover rumour. The spread is not an arbitrary toll: it is an insurance premium against information asymmetry.`,
  },
  {
    id: 'm1-jury-10',
    moduleId: M1,
    theme: 'ordres & exécution',
    themeEn: 'orders & execution',
    difficulte: 1,
    question: 'Ordre au marché ou ordre à cours limité : quand utiliser quoi ?',
    questionEn: 'Market order or limit order: when should you use which?',
    plan: [
      'Poser l’arbitrage fondamental : exécution certaine ou prix certain, jamais les deux',
      'L’ordre au marché : ce qu’il garantit, ce qu’il coûte',
      'L’ordre limite : ce qu’il garantit, ce qu’il risque',
      'La question décisive qui tranche tous les cas',
    ],
    planEn: [
      'State the fundamental trade-off: certain execution or certain price, never both',
      'The market order: what it guarantees, what it costs',
      'The limit order: what it guarantees, what it risks',
      'The decisive question that settles every case',
    ],
    pointsAttendus: [
      'Tout ordre arbitre entre deux garanties impossibles à obtenir ensemble : être exécuté à coup sûr, ou à un prix connu d’avance',
      'L’ordre au marché : exécution quasi certaine, prix incertain — il consomme les niveaux du carnet aussi loin que sa taille l’exige, et paie demi-fourchette plus slippage',
      'L’ordre limite : prix garanti (ou mieux), exécution incertaine — posé dans le carnet, il attend une contrepartie et peut attendre indéfiniment si le marché s’éloigne',
      'L’ordre limite fournit la liquidité : c’est la matière première dont le carnet est fait — le patient se fait payer par les pressés',
      'La question décisive : qu’est-ce qui coûte le plus cher — ne pas être exécuté, ou être exécuté à un mauvais prix ? Qui doit vendre avant ce soir prend le marché ; qui peut attendre pose une limite',
    ],
    pointsAttendusEn: [
      'Every order trades off two guarantees impossible to get together: certain execution, or a price known in advance',
      'The market order: near-certain execution, uncertain price — it eats through the book’s levels as far as its size requires, paying half-spread plus slippage',
      'The limit order: guaranteed price (or better), uncertain execution — posted in the book, it waits for a counterparty and can wait forever if the market moves away',
      'The limit order supplies the liquidity: it is the raw material the book is made of — the patient get paid by the hurried',
      'The decisive question: which costs you more — not being executed, or being executed at a bad price? Whoever must sell by tonight takes the market order; whoever can wait posts a limit',
    ],
    bonus: [
      'La règle du carnet en prime : priorité prix-temps — améliorer son prix d’un centime fait passer devant tout le monde ; à prix égal, chaque seconde d’ancienneté compte',
      'Le chiffrage du cours : sur un ordre de 800 titres traversant trois niveaux, demi-fourchette plus slippage de profondeur coûtent 85 € avant commission — le prix de l’impatience se mesure',
    ],
    bonusEn: [
      'The book’s rule as a bonus: price-time priority — improving your price by one cent puts you ahead of everyone; at equal price, every second of seniority counts',
      'The course’s numbers: on an 800-share order crossing three levels, half-spread plus depth slippage cost €85 before commission — the price of impatience is measurable',
    ],
    reponseModele: `Tout tient dans un arbitrage : aucun ordre ne peut garantir à la fois l'exécution et le prix. Choisir un type d'ordre, c'est choisir laquelle des deux certitudes on achète — et laquelle on abandonne.

L'**ordre au marché** dit : « exécutez maintenant, au mieux de ce que contient le carnet ». Exécution quasi certaine, prix incertain : il prend le meilleur niveau, puis le suivant, aussi loin que sa taille l'exige. Son coût se mesure — la demi-fourchette d'abord, le slippage de profondeur ensuite si l'ordre est gros : sur l'exemple du cours, 800 titres traversent trois niveaux et laissent 85 € sur la table avant même la commission.

L'**ordre à cours limité** dit : « achetez à 99,93 € ou moins ». Prix garanti — ou mieux —, exécution incertaine : posé dans le carnet, il attend qu'une contrepartie vienne à lui, et peut attendre indéfiniment si le marché s'éloigne. C'est l'ordre du patient, et c'est aussi la matière première du marché : le carnet est fait d'ordres limites, et celui qui en pose fournit la liquidité que les pressés consomment — il se fait payer par eux.

La question qui tranche tous les cas pratiques : **qu'est-ce qui me coûte le plus cher — ne pas être exécuté, ou être exécuté à un mauvais prix ?** Celui qui doit absolument avoir vendu avant ce soir prend un ordre au marché et paie l'immédiateté. Celui qui peut attendre pose une limite et encaisse la patience. Et en prime, la règle du carnet : priorité prix-temps — un centime de mieux fait passer devant tout le monde ; à prix égal, l'ancienneté tranche.`,
    reponseModeleEn: `Everything rests on one trade-off: no order can guarantee both execution and price. Choosing an order type means choosing which of the two certainties you buy — and which one you give up.

The **market order** says: "execute now, at the best the book contains". Near-certain execution, uncertain price: it takes the best level, then the next, as far as its size requires. Its cost is measurable — the half-spread first, then depth slippage if the order is large: in the course's example, 800 shares cross three levels and leave €85 on the table before any commission.

The **limit order** says: "buy at €99.93 or less". Guaranteed price — or better —, uncertain execution: posted in the book, it waits for a counterparty to come to it, and can wait forever if the market moves away. It is the patient trader's order, and it is also the market's raw material: the book is made of limit orders, and whoever posts one supplies the liquidity that the hurried consume — he gets paid by them.

The question that settles every practical case: **which costs me more — not being executed, or being executed at a bad price?** Whoever absolutely must have sold by tonight takes a market order and pays for immediacy. Whoever can wait posts a limit and collects on patience. And as a bonus, the book's rule: price-time priority — one cent better puts you ahead of everyone; at equal price, seniority decides.`,
  },
  {
    id: 'm1-jury-11',
    moduleId: M1,
    theme: 'ordres & exécution',
    themeEn: 'orders & execution',
    difficulte: 2,
    question: 'Un ordre stop protège-t-il vraiment votre position ?',
    questionEn: 'Does a stop order really protect your position?',
    plan: [
      'La mécanique exacte : le stop dort, puis se réveille en ordre au marché',
      'Le scénario qui fait mal : le gap d’ouverture',
      'Les précédents historiques : 1987, le flash crash de 2010',
      'La formule à retenir et l’alternative stop-limite',
    ],
    planEn: [
      'The exact mechanics: the stop sleeps, then wakes up as a market order',
      'The scenario that hurts: the opening gap',
      'The historical precedents: 1987, the 2010 flash crash',
      'The line to remember and the stop-limit alternative',
    ],
    pointsAttendus: [
      'Le stop dort tant que le seuil n’est pas touché, puis se réveille en ordre AU MARCHÉ : il garantit le déclenchement, jamais le prix',
      'Le gap : un stop de vente à 95 €, une mauvaise nouvelle pendant la nuit, une ouverture à 88 € — le titre n’a jamais coté entre 95 et 88, le stop vend vers 88 €',
      'Le 19 octobre 1987, les ventes stop déclenchées en cascade se sont exécutées des dizaines de pourcents sous leurs seuils et ont nourri la chute ; le flash crash du 6 mai 2010 a rejoué la mécanique en quelques minutes',
      'La formule : le stop borne la décision, jamais le prix',
      'Le stop-limite se réveille en ordre limité : il borne le prix de sortie, au risque de ne pas sortir du tout — aucun ordre ne garantit à la fois prix et exécution',
    ],
    pointsAttendusEn: [
      'The stop sleeps until the trigger is touched, then wakes up as a MARKET order: it guarantees the trigger, never the price',
      'The gap: a sell stop at €95, bad news overnight, an open at €88 — the stock never traded between 95 and 88, the stop sells around €88',
      'On 19 October 1987, cascading stop sales executed tens of percent below their triggers and fed the fall; the flash crash of 6 May 2010 replayed the mechanics in minutes',
      'The line: the stop bounds the decision, never the price',
      'The stop-limit wakes up as a limit order: it bounds the exit price, at the risk of not exiting at all — no order guarantees both price and execution',
    ],
    bonus: [
      'L’usage légitime malgré tout : une discipline contre soi-même — la décision de couper est prise à froid, avant que la perte ne soit là pour la discuter',
      'L’effet de système : les stops déclenchés vendent au marché, ce qui enfonce les cours et déclenche les stops suivants — une mécanique auto-entretenue, visible en 1987 comme en 2010',
    ],
    bonusEn: [
      'The legitimate use nonetheless: discipline against yourself — the decision to cut is taken cold, before the loss is there to argue with it',
      'The system effect: triggered stops sell at market, which pushes prices down and triggers the next stops — a self-feeding mechanism, visible in 1987 as in 2010',
    ],
    reponseModele: `Il protège votre **décision**, pas votre prix — et toute la subtilité est là.

La mécanique d'abord : un stop dort tant que le marché n'a pas touché son seuil, puis il se réveille — en **ordre au marché**. À partir de cet instant, il est servi aux prix disponibles, quels qu'ils soient. Le stop garantit donc le déclenchement, jamais le niveau de sortie.

Le scénario qui fait mal : vous détenez un titre à 100 € avec un stop de vente à 95 €. Une mauvaise nouvelle tombe pendant la nuit, le titre ouvre en gap à 88 € — il n'a jamais coté entre 95 et 88. Votre stop se déclenche à l'ouverture et vend vers 88 €, sept points sous votre seuil. Rien n'a dysfonctionné : l'ordre a fait exactement ce qu'il promettait.

L'histoire l'a montré à grande échelle. Le 19 octobre 1987, les ventes stop déclenchées en cascade se sont exécutées des dizaines de pourcents sous leurs seuils — et ont nourri la chute, puisque chaque stop déclenché vendait au marché et enfonçait les cours, déclenchant les suivants. Le flash crash du 6 mai 2010 a rejoué la même mécanique en quelques minutes.

La formule à retenir : **le stop borne la décision, jamais le prix.** Il garde une vraie utilité — c'est une discipline contre soi-même, la décision de couper prise à froid. Et pour qui veut borner le prix, il existe le stop-limite, qui se réveille en ordre limité : sortie bornée, mais au risque de ne pas sortir du tout si le marché saute la limite. Aucun ordre ne garantit à la fois le prix et l'exécution — c'est la loi du genre.`,
    reponseModeleEn: `It protects your **decision**, not your price — and the whole subtlety lies there.

The mechanics first: a stop sleeps until the market touches its trigger, then it wakes up — as a **market order**. From that instant, it is filled at whatever prices are available. The stop therefore guarantees the trigger, never the exit level.

The scenario that hurts: you hold a stock at €100 with a sell stop at €95. Bad news drops overnight, the stock gaps open at €88 — it never traded between 95 and 88. Your stop triggers at the open and sells around €88, seven points below your level. Nothing malfunctioned: the order did exactly what it promised.

History has shown it at scale. On 19 October 1987, cascading stop sales executed tens of percent below their triggers — and fed the fall, since every triggered stop sold at market, pushed prices lower, and triggered the next ones. The flash crash of 6 May 2010 replayed the same mechanics within minutes.

The line to remember: **the stop bounds the decision, never the price.** It keeps a genuine use — it is discipline against yourself, the decision to cut taken cold, before the loss is there to argue with it. And for whoever wants to bound the price, there is the stop-limit, which wakes up as a limit order: a bounded exit, but at the risk of not exiting at all if the market jumps over the limit. No order guarantees both price and execution — that is the law of the genre.`,
  },
  {
    id: 'm1-jury-12',
    moduleId: M1,
    theme: 'ordres & exécution',
    themeEn: 'orders & execution',
    difficulte: 2,
    question: 'Qu’est-ce que le slippage, et comment le limiter ?',
    questionEn: 'What is slippage, and how do you limit it?',
    plan: [
      'Définir : l’écart entre le prix affiché et le prix réellement obtenu',
      'Le chiffrer sur l’exemple du carnet : 800 titres, trois niveaux',
      'Décomposer le coût complet : demi-fourchette, profondeur, commission',
      'Les parades : découper (VWAP, TWAP), ordres limites, fixing',
    ],
    planEn: [
      'Define: the gap between the displayed price and the price actually obtained',
      'Quantify it on the book example: 800 shares, three levels',
      'Break down the full cost: half-spread, depth, commission',
      'The defences: slicing (VWAP, TWAP), limit orders, the auction',
    ],
    pointsAttendus: [
      'Le cours affiché n’est pas le prix payé : un ordre au marché de taille consomme plusieurs niveaux du carnet, et le prix moyen s’éloigne du meilleur affiché',
      'Le chiffrage du cours : 800 titres face à 300 à 100,05, 300 à 100,10, 500 à 100,20 → prix moyen 100,10625 € contre un milieu à 100,00',
      'La décomposition du coût complet : 40 € de demi-fourchette, 45 € de slippage de profondeur, 25 € de commission — 110 € soit ~13,75 pb du notionnel',
      'Première parade : découper — VWAP au prorata des volumes habituels, TWAP en tranches régulières — pour ne jamais traverser plusieurs niveaux d’un coup, quitte à porter le risque que le marché bouge pendant l’exécution',
      'Autres parades : l’ordre limite (pas de slippage, mais risque de non-exécution) et le fixing de clôture, où la liquidité se concentre au prix officiel',
      'L’enjeu d’échelle : pour un fonds qui tourne son portefeuille plusieurs fois par an, ces points de base composent — c’est la raison d’être du trader buy-side',
    ],
    pointsAttendusEn: [
      'The displayed price is not the price paid: a sizeable market order eats several book levels, and the average price drifts away from the best displayed',
      'The course numbers: 800 shares against 300 at 100.05, 300 at 100.10, 500 at 100.20 → average price €100.10625 against a mid at 100.00',
      'The full-cost breakdown: €40 of half-spread, €45 of depth slippage, €25 of commission — €110, about 13.75 bp of the notional',
      'First defence: slicing — VWAP pro rata of usual volumes, TWAP in regular time slices — to never cross several levels at once, at the cost of carrying the risk that the market moves during execution',
      'Other defences: the limit order (no slippage, but execution risk) and the closing auction, where liquidity concentrates at the official price',
      'The scale stake: for a fund that turns its portfolio several times a year, these basis points compound — the very reason the buy-side trader exists',
    ],
    bonus: [
      'La formule du spread en pb pour cadrer le vocabulaire : (ask − bid) / milieu × 10 000 — sur un titre autour de 100 €, un centime de fourchette vaut un point de base',
      'Le lien avec les dark pools : croiser un bloc au prix milieu sans transparence pré-négociation est une autre réponse au même problème — l’impact de marché',
    ],
    bonusEn: [
      'The spread-in-bp formula to frame the vocabulary: (ask − bid) / mid × 10,000 — on a stock around €100, one cent of spread is one basis point',
      'The link to dark pools: crossing a block at the mid price without pre-trade transparency is another answer to the same problem — market impact',
    ],
    reponseModele: `Le slippage, c'est l'écart entre le prix que le cours affiché vous laissait espérer et le prix moyen que vous obtenez réellement. La cause est mécanique : un ordre au marché de taille consomme le carnet niveau par niveau.

Je le chiffre sur le carnet du cours. À la vente : 300 titres à 100,05 €, 300 à 100,10 €, 500 à 100,20 € ; milieu à 100,00 €. Un achat au marché de 800 titres traverse trois niveaux et ressort à un prix moyen de **100,10625 €**. Le coût complet se décompose : 40 € de demi-fourchette — acheter à l'ask quand la valeur est au milieu —, 45 € de slippage de profondeur — les niveaux suivants —, et 25 € de commission. Total : 110 €, environ 13,75 points de base, sur une exécution de 80 000 € — avant même que le marché ait bougé. Pour un fonds qui tourne son portefeuille plusieurs fois par an, ces points de base composent : c'est exactement la raison d'être du trader buy-side.

Comment le limiter ? **Un : découper.** Un algorithme VWAP étale l'exécution au prorata des volumes habituels de la journée ; un TWAP découpe en tranches régulières. L'objectif est le même : ne jamais traverser plusieurs niveaux d'un coup — en acceptant de porter le risque que le marché bouge pendant l'exécution. **Deux : l'ordre limite**, qui supprime le slippage par construction, contre un risque de non-exécution. **Trois : le fixing**, où la liquidité se concentre au prix officiel — la garantie de trouver le volume en face. Et pour les très gros blocs, les dark pools répondent au même problème : croiser au prix milieu sans alerter le carnet public.`,
    reponseModeleEn: `Slippage is the gap between the price the displayed quote led you to expect and the average price you actually obtain. The cause is mechanical: a sizeable market order consumes the book level by level.

I quantify it on the course's book. On the offer: 300 shares at €100.05, 300 at €100.10, 500 at €100.20; mid at €100.00. A market buy of 800 shares crosses three levels and comes out at an average price of **€100.10625**. The full cost breaks down: €40 of half-spread — buying at the ask when the value sits at the mid —, €45 of depth slippage — the next levels —, and €25 of commission. Total: €110, about 13.75 basis points, on an €80,000 execution — before the market has even moved. For a fund that turns its portfolio several times a year, those basis points compound: that is exactly why the buy-side trader exists as a job.

How to limit it? **One: slice.** A VWAP algorithm spreads the execution pro rata of the day's usual volumes; a TWAP cuts it into regular time slices. The goal is the same: never cross several levels at once — while accepting the risk that the market moves during the execution. **Two: the limit order**, which removes slippage by construction, against a risk of non-execution. **Three: the auction**, where liquidity concentrates at the official price — the guarantee of finding volume on the other side. And for very large blocks, dark pools answer the same problem: crossing at the mid without alerting the public book.`,
  },
  {
    id: 'm1-jury-13',
    moduleId: M1,
    theme: 'microstructure',
    themeEn: 'microstructure',
    difficulte: 3,
    question: 'Le trading haute fréquence est-il utile ou nuisible ? Vous avez 90 secondes.',
    questionEn: 'Is high-frequency trading useful or harmful? You have 90 seconds.',
    plan: [
      'Qualifier l’objet : une technologie, pas une stratégie',
      'La colonne crédit : des spreads jamais aussi serrés',
      'La colonne débit : une liquidité conditionnelle, qui s’évapore en stress',
      'Trancher en nuance : les deux affirmations sont vraies en même temps',
    ],
    planEn: [
      'Qualify the object: a technology, not a strategy',
      'The credit column: spreads never so tight',
      'The debit column: conditional liquidity, evaporating under stress',
      'Settle with nuance: both statements are true at the same time',
    ],
    pointsAttendus: [
      'Le HFT n’est pas une stratégie mais une technologie : des programmes qui décident et exécutent en microsecondes ; l’essentiel de l’activité est du market making électronique, le reste surtout de l’arbitrage de latence',
      'Ordre de grandeur : de l’ordre de la moitié des volumes sur les actions américaines, un peu moins en Europe',
      'Au crédit : les spreads affichés sur les grandes valeurs n’ont jamais été aussi serrés, et le coût de transaction d’un particulier a fondu en vingt ans',
      'Au débit : cette liquidité est conditionnelle — quand les signaux deviennent incohérents, les machines coupent ; la liquidité devient « fantôme », abondante tant qu’on n’en a pas besoin',
      'La pièce au dossier : le 6 mai 2010 — retrait en cascade des algorithmes, près de 1 000 points de Dow perdus en minutes, retour en vingt minutes',
      'La conclusion attendue : le HFT a rendu la liquidité ordinaire moins chère ET la liquidité de crise moins fiable — les deux sont vraies en même temps',
    ],
    pointsAttendusEn: [
      'HFT is not a strategy but a technology: programs deciding and executing in microseconds; most of the activity is electronic market making, the rest mostly latency arbitrage',
      'Order of magnitude: around half of US equity volumes, somewhat less in Europe',
      'On the credit side: displayed spreads on large caps have never been so tight, and retail transaction costs have collapsed in twenty years',
      'On the debit side: that liquidity is conditional — when signals turn incoherent, the machines switch off; liquidity turns "phantom", abundant as long as nobody needs it',
      'The exhibit: 6 May 2010 — cascading algorithm withdrawal, nearly 1,000 Dow points lost in minutes, recovered in twenty',
      'The expected conclusion: HFT made ordinary liquidity cheaper AND crisis liquidity less reliable — both are true at the same time',
    ],
    bonus: [
      'La course à la latence comme illustration : ~13 millisecondes pour l’aller-retour Chicago–New York en fibre, des chaînes de tours micro-ondes bâties pour en gagner quelques-unes — la valeur marchande de la priorité dans la file',
      'Le détail de la colocation : les bourses louent des emplacements de serveurs avec des câbles de longueur identique au mètre près — l’égalité des chances version fibre optique',
    ],
    bonusEn: [
      'The latency race as illustration: ~13 milliseconds for the Chicago–New York round trip by fibre, microwave tower chains built to shave a few — the market value of queue priority',
      'The colocation detail: exchanges rent server racks with cables of identical length to the metre — equality of opportunity, fibre-optic version',
    ],
    reponseModele: `D'abord, qualifier l'objet : le HFT n'est pas une stratégie, c'est une **technologie** — des programmes qui décident et exécutent en microsecondes. L'essentiel de l'activité est du market making électronique : le métier classique du teneur de marché, automatisé, mené sur des milliers de titres, inventaires ramenés vers zéro chaque soir. Le reste relève surtout de l'arbitrage de latence. Ordre de grandeur : la moitié des volumes actions américaines, un peu moins en Europe.

La colonne crédit, ensuite : les spreads affichés sur les grandes valeurs n'ont jamais été aussi serrés, et le coût de transaction d'un particulier a fondu en vingt ans — en bonne partie grâce à cette concurrence automatisée. C'est un gain réel, mesurable, distribué à tous les investisseurs.

La colonne débit : cette liquidité est **conditionnelle**. Un market maker humain pouvait difficilement disparaître au milieu de la séance ; un algorithme, si. Quand les signaux deviennent incohérents, les machines font la seule chose prudente — elles coupent. La liquidité devient fantôme : abondante tant qu'on n'en a pas besoin, évaporée précisément quand on en a besoin. La pièce au dossier est le 6 mai 2010 : retrait en cascade des algorithmes, près de 1 000 points de Dow perdus en quelques minutes, des actions à 1 centime — et un retour quasi complet vingt minutes plus tard.

Ma conclusion, en une phrase : le HFT a rendu la liquidité ordinaire moins chère **et** la liquidité de crise moins fiable — les deux affirmations sont vraies en même temps, et c'est exactement cette tension qu'il faut savoir tenir. Ni angélisme, ni diabolisation.`,
    reponseModeleEn: `First, qualify the object: HFT is not a strategy, it is a **technology** — programs that decide and execute in microseconds. Most of the activity is electronic market making: the classic dealer's trade, automated, run across thousands of stocks, inventories brought back to zero every evening. The rest is mostly latency arbitrage. Order of magnitude: half of US equity volumes, somewhat less in Europe.

The credit column next: displayed spreads on large caps have never been so tight, and a retail investor's transaction cost has collapsed in twenty years — in good part thanks to this automated competition. That is a real, measurable gain, distributed to all investors.

The debit column: that liquidity is **conditional**. A human market maker could hardly vanish mid-session; an algorithm can. When signals turn incoherent, the machines do the only prudent thing — they switch off. Liquidity turns phantom: abundant as long as nobody needs it, evaporated precisely when everyone does. The exhibit is 6 May 2010: cascading algorithm withdrawal, nearly 1,000 Dow points lost in a few minutes, stocks printing at one cent — and an almost complete recovery twenty minutes later.

My conclusion, in one sentence: HFT made ordinary liquidity cheaper **and** crisis liquidity less reliable — both statements are true at the same time, and holding that tension is exactly what is expected. Neither cheerleading nor demonising.`,
  },
  {
    id: 'm1-jury-14',
    moduleId: M1,
    theme: 'microstructure',
    themeEn: 'microstructure',
    difficulte: 2,
    question: 'Que s’est-il passé le 6 mai 2010 ?',
    questionEn: 'What happened on 6 May 2010?',
    plan: [
      'Le contexte : un après-midi nerveux, la crise grecque sur tous les écrans',
      'Le déclencheur et l’engrenage : un gros ordre automatisé, des algorithmes qui se retirent',
      'Le bilan chiffré et le rebond en vingt minutes',
      'Les leçons : liquidité conditionnelle, et l’épilogue Sarao',
    ],
    planEn: [
      'The context: a nervous afternoon, the Greek crisis on every screen',
      'The trigger and the spiral: a large automated order, algorithms withdrawing',
      'The numbers and the twenty-minute rebound',
      'The lessons: conditional liquidity, and the Sarao epilogue',
    ],
    pointsAttendus: [
      'Le contexte : après-midi nerveux, la crise grecque occupe tous les écrans',
      'Le déclencheur : un gros ordre de vente automatisé sur les futures S&P 500, programmé sans condition de prix, sur un marché déjà fébrile',
      'L’engrenage : les algorithmes absorbent, se repassent la position de plus en plus vite, puis se retirent en cascade',
      'Le bilan : le Dow perd près de 1 000 points — environ −9 % — en quelques minutes ; des actions traitent à 1 centime, d’autres à 100 000 $ ; vingt minutes plus tard, l’essentiel de la baisse est effacé',
      'La leçon : personne n’avait vendu l’Amérique — la liquidité avait cessé d’exister un quart d’heure ; volumes records et liquidité nulle le même jour : volume ≠ liquidité',
      'L’épilogue : Navinder Sarao, spoofer des futures S&P 500, accusé en 2015 d’avoir contribué au krach — responsabilité réelle débattue',
    ],
    pointsAttendusEn: [
      'The context: a nervous afternoon, the Greek crisis on every screen',
      'The trigger: a large automated sell order on S&P 500 futures, programmed with no price condition, into an already feverish market',
      'The spiral: algorithms absorb, pass the position around faster and faster, then withdraw in cascade',
      'The toll: the Dow loses nearly 1,000 points — about −9% — within minutes; some stocks trade at one cent, others at $100,000; twenty minutes later most of the fall is erased',
      'The lesson: nobody had sold America — liquidity had simply ceased to exist for a quarter of an hour; record volumes and zero liquidity the same day: volume ≠ liquidity',
      'The epilogue: Navinder Sarao, an S&P 500 futures spoofer, accused in 2015 of having contributed to the crash — actual responsibility still debated',
    ],
    bonus: [
      'La phrase qui résume l’épisode : personne n’avait vendu l’Amérique — la liquidité avait simplement cessé d’exister pendant un quart d’heure',
      'Utiliser l’épisode comme preuve des trois dimensions de la liquidité : spread, profondeur, résilience — le volume, lui, était record',
    ],
    bonusEn: [
      'The sentence that sums up the episode: nobody had sold America — liquidity had simply ceased to exist for a quarter of an hour',
      'Use the episode as proof of liquidity’s three dimensions: spread, depth, resilience — volume, meanwhile, was at a record',
    ],
    reponseModele: `Le décor : un après-midi nerveux, la crise grecque occupe tous les écrans. Le déclencheur : un gros ordre de vente **automatisé** sur les futures S&P 500, programmé sans condition de prix, qui arrive sur un marché déjà fébrile.

L'engrenage, ensuite. Les algorithmes absorbent l'ordre, se repassent la position de plus en plus vite — puis, quand les signaux deviennent incohérents, ils font la seule chose prudente : ils se retirent, en cascade. En quelques minutes, le Dow Jones perd près de 1 000 points, environ moins 9 %. Dans les carnets vidés de tout ordre sérieux, des actions traitent à 1 centime, d'autres à 100 000 dollars. Et vingt minutes plus tard, l'essentiel de la baisse est effacé.

La phrase qui résume tout : **personne n'avait vendu l'Amérique** — la liquidité avait simplement cessé d'exister pendant un quart d'heure. C'est la leçon de fond : la liquidité électronique est conditionnelle. Abondante en temps calme, elle s'évapore précisément quand on en a besoin. Et le détail qui enfonce le clou : les volumes de la journée étaient records. Volume et liquidité sont deux choses différentes — la liquidité se juge au spread, à la profondeur et à la résilience, pas à ce qui s'échange.

L'épilogue judiciaire mérite une phrase : Navinder Sarao, qui pratiquait le spoofing sur ces mêmes futures depuis la maison de ses parents à Hounslow, a été arrêté en 2015 et accusé par les autorités américaines d'avoir contribué au krach. Sa responsabilité réelle reste débattue — un homme seul contre le marché le plus profond du monde —, mais l'affaire a prouvé que les régulateurs savent remonter jusqu'à un écran de chambre.`,
    reponseModeleEn: `The setting: a nervous afternoon, the Greek crisis on every screen. The trigger: a large **automated** sell order on S&P 500 futures, programmed with no price condition, landing on an already feverish market.

Then the spiral. The algorithms absorb the order, pass the position around faster and faster — then, when the signals turn incoherent, they do the only prudent thing: they withdraw, in cascade. Within a few minutes, the Dow Jones loses nearly 1,000 points, about minus 9%. In books emptied of any serious order, some stocks trade at one cent, others at $100,000. And twenty minutes later, most of the fall is erased.

The sentence that sums it all up: **nobody had sold America** — liquidity had simply ceased to exist for a quarter of an hour. That is the deep lesson: electronic liquidity is conditional. Abundant in calm times, it evaporates precisely when it is needed. And the detail that drives it home: that day's volumes were a record. Volume and liquidity are two different things — liquidity is judged by spread, depth and resilience, not by what changes hands.

The judicial epilogue deserves a sentence: Navinder Sarao, who had been spoofing those very futures from his parents' house in Hounslow, was arrested in 2015 and accused by the US authorities of having contributed to the crash. His actual responsibility remains debated — one man alone against the deepest market in the world — but the case proved that regulators can trace their way back to a bedroom screen.`,
  },
  {
    id: 'm1-jury-15',
    moduleId: M1,
    theme: 'microstructure',
    themeEn: 'microstructure',
    difficulte: 3,
    question: 'Les dark pools sont-ils louches ?',
    questionEn: 'Are dark pools shady?',
    plan: [
      'Définir exactement : pas de transparence pré-négociation, rien de plus',
      'La raison d’être : l’impact de marché des gros blocs',
      'La contrepartie : trop de noir dégrade le prix public — d’où les plafonds',
      'Situer dans la fragmentation et conclure : une dose, pas un poison',
    ],
    planEn: [
      'Define precisely: no pre-trade transparency, nothing more',
      'The rationale: the market impact of large blocks',
      'The trade-off: too much dark degrades the public price — hence the caps',
      'Place within fragmentation and conclude: a dose, not a poison',
    ],
    pointsAttendus: [
      'Définition exacte : des plateformes sans transparence pré-négociation — les ordres ne sont affichés à personne avant l’exécution ; la transaction, elle, est bien déclarée ensuite',
      'La raison d’être : un gérant qui doit vendre 2 % du capital d’une valeur ferait fuir les acheteurs en affichant son ordre — l’impact de marché ; le dark pool permet de croiser le bloc discrètement',
      'L’exécution s’y fait le plus souvent au prix milieu du marché public : le dark pool est un passager du prix formé ailleurs',
      'La limite systémique : si tout le monde traitait dans le noir, le prix public ne voudrait plus rien dire — d’où les plafonds réglementaires posés à leur part de marché (MiFID II)',
      'Situer dans le paysage : une action se traite aujourd’hui sur la bourse historique, des MTF, face à des internalisateurs et en dark pools — d’où routeurs intelligents et best execution',
    ],
    pointsAttendusEn: [
      'Exact definition: venues with no pre-trade transparency — orders are displayed to no one before execution; the trade itself is reported afterwards',
      'The rationale: a manager who must sell 2% of a company’s capital would scare buyers away by displaying the order — market impact; the dark pool lets the block cross discreetly',
      'Execution usually happens at the public market’s mid price: the dark pool is a passenger of the price formed elsewhere',
      'The systemic limit: if everyone traded in the dark, the public price would no longer mean anything — hence the regulatory caps on their market share (MiFID II)',
      'Place in the landscape: a stock now trades on the historic exchange, on MTFs, against internalisers and in dark pools — hence smart order routers and best execution',
    ],
    bonus: [
      'La formule qui fait mouche : le dark pool ne fabrique pas le prix, il l’emprunte — c’est pour cela qu’il ne peut exister qu’adossé à un marché public de qualité',
      'Remarquer que le nom fait le marketing du soupçon : « bassin sombre » désigne une absence d’affichage pré-négociation, pas une absence de règles',
    ],
    bonusEn: [
      'The line that lands: the dark pool does not make the price, it borrows it — which is why it can only exist leaning on a quality public market',
      'Note that the name does the marketing of suspicion: "dark pool" describes an absence of pre-trade display, not an absence of rules',
    ],
    reponseModele: `Le nom fait le marketing du soupçon, alors je commence par la définition exacte : un dark pool est une plateforme **sans transparence pré-négociation** — les ordres n'y sont affichés à personne avant l'exécution. C'est tout. Pas d'absence de règles, pas d'anonymat vis-à-vis du régulateur : une absence d'affichage.

Leur raison d'être est très concrète. Imaginez un gérant qui doit vendre 2 % du capital d'une valeur moyenne. Affiché dans un carnet public, un ordre pareil ferait fuir les acheteurs et décalerait le prix avant même la première exécution — c'est l'impact de marché. Le dark pool permet de croiser ce bloc avec un acheteur d'en face, discrètement, le plus souvent **au prix milieu du marché public**. Et cette dernière précision est décisive : le dark pool ne fabrique pas le prix, il l'emprunte au marché transparent.

D'où la vraie limite, qui n'est pas morale mais systémique : si tout le monde traitait dans le noir, le prix public — celui que tout le monde emprunte — ne voudrait plus rien dire. C'est exactement pourquoi la réglementation a posé des plafonds à leur part de marché plutôt que de les interdire : la dose fait le poison.

Je replace enfin l'objet dans son paysage : depuis l'ouverture à la concurrence, la même action se traite sur la bourse historique, sur des MTF, face à des internalisateurs et en dark pools — c'est la fragmentation, gérée par les routeurs d'ordres intelligents sous obligation de best execution. Ma réponse : pas louches — utiles à petite dose, toxiques à haute dose, et régulés précisément comme tels.`,
    reponseModeleEn: `The name does the marketing of suspicion, so I start with the exact definition: a dark pool is a venue **without pre-trade transparency** — orders there are displayed to no one before execution. That is all. No absence of rules, no anonymity towards the regulator: an absence of display.

Their rationale is very concrete. Picture a manager who must sell 2% of a mid-cap's capital. Displayed in a public book, such an order would scare buyers away and shift the price before the first fill — that is market impact. The dark pool lets that block cross with a buyer on the other side, discreetly, most often **at the public market's mid price**. And that last point is decisive: the dark pool does not make the price, it borrows it from the transparent market.

Hence the real limit, which is not moral but systemic: if everyone traded in the dark, the public price — the one everybody borrows — would no longer mean anything. That is exactly why regulation capped their market share rather than banning them: the dose makes the poison.

Finally I place the object in its landscape: since competition was opened up, the same stock trades on the historic exchange, on MTFs, against internalisers and in dark pools — that is fragmentation, handled by smart order routers under a best execution obligation. My answer: not shady — useful in small doses, toxic in large ones, and regulated precisely as such.`,
  },
  {
    id: 'm1-jury-16',
    moduleId: M1,
    theme: 'régulation',
    themeEn: 'regulation',
    difficulte: 1,
    question: 'Qui régule les marchés en France et en Europe ?',
    questionEn: 'Who regulates markets in France and in Europe?',
    plan: [
      'La distinction de tête : conduite et marchés contre prudentiel',
      'La France : AMF et ACPR, deux têtes séparées',
      'L’Europe : ESMA et BCE via le mécanisme de surveillance unique',
      'La curiosité américaine en miroir : SEC contre CFTC',
    ],
    planEn: [
      'The framing distinction: conduct and markets versus prudential',
      'France: AMF and ACPR, two separate heads',
      'Europe: ESMA and the ECB via the single supervisory mechanism',
      'The American curiosity as a mirror: SEC versus CFTC',
    ],
    pointsAttendus: [
      'Distinguer deux logiques : la régulation de conduite et de marchés (comment on traite) et la supervision prudentielle (la solidité de ceux qui traitent)',
      'AMF : le gendarme boursier français — information des émetteurs, gestion d’actifs, abus de marché ; ACPR, adossée à la Banque de France : solvabilité des banques et assureurs',
      'ESMA, installée à Paris : harmonise et coordonne les régulateurs de marchés des Vingt-Sept, supervise directement les agences de notation',
      'BCE via le MSU depuis 2014 : supervision prudentielle directe des grandes banques de la zone euro — une centaine de groupes',
      'La double tutelle en pratique : la banque qui maltraite ses clients investisseurs répond à l’AMF ; la même, sous-capitalisée, répond à l’ACPR — et à la BCE si elle est grande',
      'Le miroir américain : la SEC (titres, créée en 1934) et la CFTC (dérivés, héritage des marchés agricoles de Chicago) — la coupure sépare titres et dérivés, pas conduite et prudentiel',
    ],
    pointsAttendusEn: [
      'Distinguish two logics: conduct and markets regulation (how you trade) and prudential supervision (the soundness of those who trade)',
      'AMF: the French market watchdog — issuer disclosure, asset management, market abuse; ACPR, backed by the Banque de France: solvency of banks and insurers',
      'ESMA, based in Paris: harmonises and coordinates the market regulators of the Twenty-Seven, directly supervises rating agencies',
      'The ECB via the SSM since 2014: direct prudential supervision of the euro area’s large banks — about a hundred groups',
      'The dual oversight in practice: a bank mistreating its investor clients answers to the AMF; the same bank undercapitalised answers to the ACPR — and to the ECB if it is large',
      'The American mirror: the SEC (securities, created in 1934) and the CFTC (derivatives, heir to Chicago’s agricultural markets) — the split separates securities and derivatives, not conduct and prudential',
    ],
    bonus: [
      'L’exemple qui fait mouche : un future sur le S&P 500 relève de la CFTC, les actions qui composent l’indice relèvent de la SEC — deux agences pour un même marché',
      'Compléter la carte : la FCA au Royaume-Uni, cadre désormais autonome depuis le Brexit',
    ],
    bonusEn: [
      'The example that lands: an S&P 500 future falls under the CFTC, the stocks in the index fall under the SEC — two agencies for one market',
      'Complete the map: the FCA in the United Kingdom, now an autonomous framework since Brexit',
    ],
    reponseModele: `Le premier réflexe est de distinguer deux logiques. La régulation **de conduite et de marchés** surveille la façon dont on traite — transparence, information, abus, protection du client. La supervision **prudentielle** surveille la solidité de ceux qui traitent — capital, liquidité, risques au bilan.

En France, les deux têtes sont séparées. L'**AMF** est le gendarme boursier : information des émetteurs, gestion d'actifs, répression des abus de marché — avec une commission des sanctions qui frappe fort. L'**ACPR**, adossée à la Banque de France, surveille la solvabilité des banques et des assureurs.

À l'échelle européenne, même partage. L'**ESMA**, installée à Paris, harmonise et coordonne les régulateurs de marchés des Vingt-Sept — et supervise directement les agences de notation. Côté prudentiel, la **BCE** supervise directement les grandes banques de la zone euro depuis 2014, via le mécanisme de surveillance unique — une centaine de groupes. En pratique, c'est une double tutelle : la banque qui maltraite ses clients investisseurs répond à l'AMF ; la même banque sous-capitalisée répond à l'ACPR, et à la BCE si elle est grande.

Et le miroir américain, que les jurys adorent : la coupure ne sépare pas conduite et prudentiel mais **titres et dérivés**. La SEC, créée en 1934 après le krach de 1929, régule les titres ; la CFTC, héritière des marchés agricoles de Chicago, régule les dérivés. Résultat savoureux : un future sur le S&P 500 relève de la CFTC, les actions qui composent l'indice relèvent de la SEC — deux agences pour un même marché. J'ajoute, pour compléter la carte, la FCA britannique, autonome depuis le Brexit.`,
    reponseModeleEn: `The first reflex is to distinguish two logics. **Conduct and markets** regulation watches how trading is done — transparency, disclosure, abuse, client protection. **Prudential** supervision watches the soundness of those who trade — capital, liquidity, balance-sheet risk.

In France, the two heads are separate. The **AMF** is the market watchdog: issuer disclosure, asset management, prosecution of market abuse — with an enforcement committee that hits hard. The **ACPR**, backed by the Banque de France, watches the solvency of banks and insurers.

At the European level, the same split. **ESMA**, based in Paris, harmonises and coordinates the market regulators of the Twenty-Seven — and directly supervises rating agencies. On the prudential side, the **ECB** has directly supervised the euro area's large banks since 2014, through the single supervisory mechanism — about a hundred groups. In practice it is dual oversight: a bank mistreating its investor clients answers to the AMF; the same bank undercapitalised answers to the ACPR, and to the ECB if it is large.

And the American mirror, which panels love: the split there separates not conduct and prudential but **securities and derivatives**. The SEC, created in 1934 after the 1929 crash, regulates securities; the CFTC, heir to Chicago's agricultural markets, regulates derivatives. The delicious result: an S&P 500 future falls under the CFTC, while the stocks in the index fall under the SEC — two agencies for one market. To complete the map, I add the UK's FCA, autonomous since Brexit.`,
  },
  {
    id: 'm1-jury-17',
    moduleId: M1,
    theme: 'régulation',
    themeEn: 'regulation',
    difficulte: 3,
    question: 'Qu’a changé MiFID II, concrètement ?',
    questionEn: 'What did MiFID II actually change?',
    plan: [
      'Situer : MiFID I a créé la fragmentation, MiFID II en tire les leçons (2018)',
      'Les deux chantiers d’exécution : best execution durcie, transparence et plafonds',
      'L’unbundling de la recherche et son effet pervers documenté',
      'La protection de l’investisseur — et ce que ça change au quotidien d’un desk',
    ],
    planEn: [
      'Set the scene: MiFID I created fragmentation, MiFID II draws the lessons (2018)',
      'The two execution chantiers: hardened best execution, transparency and caps',
      'Research unbundling and its documented side effect',
      'Investor protection — and what it changes in a desk’s daily life',
    ],
    pointsAttendus: [
      'Situer l’objet : MiFID I (2007) avait ouvert la concurrence entre lieux d’exécution et créé la fragmentation ; MiFID II, applicable depuis janvier 2018, remet à plat le fonctionnement quotidien',
      'Best execution durcie : une politique d’exécution écrite, des contrôles, et la capacité de démontrer ordre par ordre que le résultat obtenu était le meilleur raisonnablement accessible',
      'Transparence pré- et post-négociation étendue au-delà des actions, et plafonds imposés au trading sans transparence — l’encadrement de la part de marché des dark pools',
      'L’unbundling : la recherche facturée séparément de l’exécution ; effet pervers documenté — budgets comprimés, couverture des petites valeurs appauvrie, règle depuis assouplie',
      'Protection de l’investisseur : gouvernance des produits, information détaillée sur les coûts, et enregistrement des communications — les conversations téléphoniques d’un desk sont archivées',
    ],
    pointsAttendusEn: [
      'Set the scene: MiFID I (2007) had opened competition between execution venues and created fragmentation; MiFID II, applicable since January 2018, overhauled daily market functioning',
      'Hardened best execution: a written execution policy, controls, and the ability to demonstrate order by order that the result obtained was the best reasonably available',
      'Pre- and post-trade transparency extended beyond equities, and caps imposed on non-transparent trading — the framing of dark pools’ market share',
      'Unbundling: research billed separately from execution; the documented side effect — squeezed budgets, impoverished small-cap coverage, the rule since relaxed',
      'Investor protection: product governance, detailed cost disclosure, and the recording of communications — a desk’s phone conversations are archived',
    ],
    bonus: [
      'Raconter l’unbundling comme cas d’école d’effet de bord réglementaire : objectif louable (rendre les conflits visibles), dommage collatéral réel (moins d’analystes sur les small caps), correction législative ensuite',
      'Le lien concret avec la microstructure : le routeur d’ordres intelligent n’est pas un gadget — c’est la matérialisation technologique d’une obligation réglementaire',
    ],
    bonusEn: [
      'Tell unbundling as a case study in regulatory side effects: a worthy goal (making conflicts visible), real collateral damage (fewer analysts on small caps), legislative correction afterwards',
      'The concrete link to microstructure: the smart order router is no gadget — it is the technological materialisation of a regulatory obligation',
    ],
    reponseModele: `Pour répondre précisément, je situe d'abord : la première MiFID, en 2007, avait ouvert la concurrence entre lieux d'exécution — c'est elle qui a créé la fragmentation. MiFID II, applicable depuis janvier 2018, en a tiré les leçons et a remis à plat le quotidien des salles. Quatre chantiers concrets.

**Un, la best execution durcie.** Promettre le meilleur résultat ne suffit plus : il faut une politique d'exécution écrite, des contrôles, et la capacité de démontrer, ordre par ordre, que le résultat — prix, coûts, rapidité, probabilité d'exécution — était le meilleur raisonnablement accessible. Le routeur d'ordres intelligent n'est pas un gadget technologique : c'est la matérialisation d'une obligation réglementaire.

**Deux, la transparence.** Publication des cotations et des transactions étendue au-delà des actions, et plafonds imposés au trading sans transparence — c'est là que la part de marché des dark pools a été encadrée.

**Trois, l'unbundling.** Avant 2018, la recherche des brokers était « offerte », financée par les commissions d'exécution. MiFID II a exigé une facturation séparée pour rendre les coûts et les conflits visibles. L'effet pervers est documenté : budgets comprimés, des analystes en moins, une couverture des petites valeurs appauvrie — au point que le législateur a depuis assoupli la règle. C'est un cas d'école d'effet de bord réglementaire.

**Quatre, la protection de l'investisseur** : gouvernance des produits, information détaillée sur les coûts — et l'enregistrement des communications. Oui, sur un desk, les conversations téléphoniques sont enregistrées et archivées : ce n'est pas un mythe de cinéma, c'est MiFID II.`,
    reponseModeleEn: `To answer precisely, I set the scene first: the first MiFID, in 2007, had opened competition between execution venues — it created fragmentation. MiFID II, applicable since January 2018, drew the lessons and overhauled daily life on trading floors. Four concrete chantiers.

**One, hardened best execution.** Promising the best outcome is no longer enough: you need a written execution policy, controls, and the ability to demonstrate, order by order, that the result — price, costs, speed, likelihood of execution — was the best reasonably available. The smart order router is not a technological gadget: it is the materialisation of a regulatory obligation.

**Two, transparency.** Publication of quotes and trades extended beyond equities, and caps imposed on non-transparent trading — this is where dark pools' market share was reined in.

**Three, unbundling.** Before 2018, brokers' research was "free", funded through execution commissions. MiFID II required separate billing to make costs and conflicts visible. The side effect is documented: squeezed budgets, fewer analysts, impoverished small-cap coverage — to the point that the legislator has since relaxed the rule. It is a case study in regulatory side effects.

**Four, investor protection**: product governance, detailed cost disclosure — and the recording of communications. Yes, on a desk, phone conversations are recorded and archived: that is not a movie myth, that is MiFID II.`,
  },
  {
    id: 'm1-jury-18',
    moduleId: M1,
    theme: 'régulation',
    themeEn: 'regulation',
    difficulte: 2,
    question: 'Définissez le délit d’initié — et ses limites.',
    questionEn: 'Define insider dealing — and its boundaries.',
    plan: [
      'Définir l’information privilégiée : trois caractères cumulatifs',
      'Les trois interdits : utiliser, transmettre, recommander',
      'Le marqueur de rigueur : l’usage suffit, le profit est indifférent',
      'Les limites : ce qui n’est PAS un délit d’initié, et les sanctions',
    ],
    planEn: [
      'Define inside information: three cumulative features',
      'The three prohibitions: using, disclosing, recommending',
      'The rigour marker: use suffices, profit is irrelevant',
      'The boundaries: what insider dealing is NOT, and the sanctions',
    ],
    pointsAttendus: [
      'L’information privilégiée cumule trois caractères : précise (pas une rumeur de couloir), non publique, et susceptible d’influencer sensiblement le cours (règlement MAR, adopté en 2014, applicable depuis juillet 2016)',
      'Trois interdits : en faire usage pour traiter, la transmettre à un tiers, recommander d’acheter ou de vendre sur sa base — dès lors qu’on connaît ou devrait connaître son caractère privilégié',
      'Le filet est large : le dirigeant qui vend avant un avertissement, le prestataire informatique qui a vu le communiqué, le beau-frère tuyauté — et celui qui l’a tuyauté',
      'Le marqueur de rigueur : pas besoin de profit — l’infraction est constituée par l’usage de l’information ; une perte évitée est un avantage, et un trade finalement perdant reste fautif',
      'La limite : l’analyse brillante d’informations publiques est parfaitement légale — toute la frontière passe par les trois caractères, notamment la précision (la rumeur ne suffit pas)',
      'Les sanctions : commission des sanctions AMF jusqu’à 100 M€ ou dix fois l’avantage, publication nominative, bascule au pénal pour les cas graves',
    ],
    pointsAttendusEn: [
      'Inside information combines three features: precise (not a corridor rumour), non-public, and likely to have a significant effect on the price (MAR regulation, adopted in 2014, applicable since July 2016)',
      'Three prohibitions: using it to trade, disclosing it to a third party, recommending to buy or sell on its basis — as soon as you know or should know its privileged nature',
      'The net is wide: the executive selling before a profit warning, the IT contractor who saw the press release, the tipped brother-in-law — and the one who tipped him',
      'The rigour marker: no profit needed — the offence is constituted by the use of the information; an avoided loss is a benefit, and a trade that ends up losing remains an offence',
      'The boundary: brilliant analysis of public information is perfectly legal — the whole frontier runs through the three features, especially precision (a rumour is not enough)',
      'The sanctions: the AMF enforcement committee up to €100m or ten times the benefit, named publication, escalation to criminal courts for the gravest cases',
    ],
    bonus: [
      'Donner l’ordre de grandeur des sanctions réelles : dossiers courants en centaines de milliers ou millions d’euros, record AMF de l’ordre de 75 M€ (H2O AM, 2023) — et la publication nominative, souvent la sanction la plus coûteuse',
      'Relier à la prévention organisée : muraille de Chine, listes d’initiés nominatives, watch list et restricted list — l’architecture qui évite d’avoir à plaider',
    ],
    bonusEn: [
      'Give the order of magnitude of real sanctions: routine cases in hundreds of thousands or millions of euros, the AMF record around €75m (H2O AM, 2023) — and named publication, often the costliest sanction',
      'Link to organised prevention: Chinese wall, named insider lists, watch list and restricted list — the architecture that spares you having to plead',
    ],
    reponseModele: `Tout part de la définition de l'**information privilégiée**, qui cumule trois caractères — c'est le règlement européen Abus de marché, adopté en 2014 et applicable depuis juillet 2016 : elle est **précise** — pas une simple rumeur de couloir —, **non publique**, et **susceptible d'influencer sensiblement le cours** si elle était connue.

Sur cette base, trois interdits : en faire usage pour traiter, la transmettre à un tiers, et recommander d'acheter ou de vendre sur sa base — dès lors qu'on connaît, ou devrait connaître, son caractère privilégié. Le filet est volontairement large : il attrape le banquier M&A, mais aussi le dirigeant qui vend avant un avertissement sur résultats, le prestataire informatique qui a vu passer le communiqué — et le beau-frère tuyauté au dîner de famille, ainsi que celui qui l'a tuyauté.

Le marqueur de rigueur juridique, celui qui distingue à l'oral : **pas besoin d'avoir gagné de l'argent**. L'infraction est constituée par l'usage de l'information, pas par le profit. Vendre pour éviter une perte est tout aussi répréhensible — une perte évitée est un avantage. Et si le marché finit par bouger dans l'autre sens, l'absence de gain n'efface rien : tout se juge à l'information détenue au moment de l'ordre.

Les limites, maintenant. L'analyse brillante d'informations publiques est parfaitement légale — toute la frontière passe par les trois caractères, notamment la précision. Côté sanctions : la commission des sanctions de l'AMF peut prononcer jusqu'à 100 M€ ou dix fois l'avantage retiré, avec publication nominative — souvent la sanction la plus coûteuse — et bascule au pénal pour les cas graves.`,
    reponseModeleEn: `Everything starts from the definition of **inside information**, which combines three features — this is the European Market Abuse Regulation, adopted in 2014 and applicable since July 2016: it is **precise** — not a mere corridor rumour —, **non-public**, and **likely to have a significant effect on the price** if it were known.

On that basis, three prohibitions: using it to trade, disclosing it to a third party, and recommending to buy or sell on its basis — as soon as you know, or should know, its privileged nature. The net is deliberately wide: it catches the M&A banker, but also the executive who sells before a profit warning, the IT contractor who saw the press release go by — and the brother-in-law tipped at the family dinner, along with the one who tipped him.

The legal-rigour marker, the one that distinguishes you orally: **no need to have made money**. The offence is constituted by the use of the information, not by the profit. Selling to avoid a loss is just as punishable — an avoided loss is a benefit. And if the market ends up moving the other way, the absence of gain erases nothing: everything is judged on the information held at the moment of the order.

Now the boundaries. Brilliant analysis of public information is perfectly legal — the whole frontier runs through the three features, especially precision. On sanctions: the AMF enforcement committee can impose up to €100m or ten times the benefit, with named publication — often the costliest sanction — and escalation to criminal courts for the gravest cases.`,
  },
  {
    id: 'm1-jury-19',
    moduleId: M1,
    theme: 'régulation',
    themeEn: 'regulation',
    difficulte: 3,
    question: 'Qu’est-ce que le spoofing, et comment le distinguer du market making ?',
    questionEn: 'What is spoofing, and how do you tell it apart from market making?',
    plan: [
      'Définir : spoofing et layering, deux variantes de manipulation de cours',
      'Le critère de distinction : l’intention d’être exécuté',
      'L’affaire Sarao : la preuve que ce n’est pas réservé aux grandes maisons',
      'La nuance finale : annuler beaucoup n’est pas manipuler',
    ],
    planEn: [
      'Define: spoofing and layering, two variants of price manipulation',
      'The distinguishing criterion: the intention to be executed',
      'The Sarao case: proof it is not reserved to big houses',
      'The final nuance: cancelling a lot is not manipulating',
    ],
    pointsAttendus: [
      'Le spoofing : afficher de gros ordres sans aucune intention de les exécuter, pour pousser les autres à traiter, puis les annuler ; le layering en est la version mille-feuille, en couches de prix échelonnées',
      'Juridiquement, c’est de la manipulation de cours au sens de MAR : créer une fausse apparence d’offre ou de demande',
      'Le critère qui sépare du market making : le teneur de marché affiche des prix qu’il est prêt à honorer — son revenu vient d’être exécuté (le spread) ; le spoofer vit de ne jamais l’être',
      'Le market maker annule et recote en permanence, mais pour gérer son inventaire et sa sélection adverse — le volume d’annulation seul ne fait pas l’infraction : l’intention au moment de l’ordre, déduite du comportement, fait la différence',
      'L’affaire Sarao : du spoofing sur les futures S&P 500 depuis un pavillon de Hounslow, des dizaines de millions de dollars accumulés, arrestation en 2015, accusation d’avoir contribué au flash crash — contribution réelle débattue',
    ],
    pointsAttendusEn: [
      'Spoofing: displaying large orders with no intention of executing them, to push others to trade, then cancelling them; layering is the mille-feuille version, in staggered price layers',
      'Legally, it is price manipulation under MAR: creating a false appearance of supply or demand',
      'The criterion separating it from market making: the market maker displays prices he is ready to honour — his revenue comes from being executed (the spread); the spoofer lives off never being executed',
      'The market maker cancels and re-quotes constantly, but to manage inventory and adverse selection — cancellation volume alone does not make the offence: the intention at the time of the order, inferred from behaviour, makes the difference',
      'The Sarao case: spoofing S&P 500 futures from a Hounslow house, tens of millions of dollars accumulated, arrest in 2015, accusation of contributing to the flash crash — actual contribution debated',
    ],
    bonus: [
      'La formule qui condense le critère : le market maker gagne quand on le traite, le spoofer gagne quand on le croit — l’un vend de la liquidité, l’autre vend une illusion',
      'La leçon institutionnelle de l’affaire Sarao : la manipulation n’est pas l’apanage des grandes institutions, et les régulateurs savent remonter jusqu’à un écran de chambre',
    ],
    bonusEn: [
      'The line that condenses the criterion: the market maker earns when traded with, the spoofer earns when believed — one sells liquidity, the other sells an illusion',
      'The institutional lesson of the Sarao case: manipulation is not the preserve of large institutions, and regulators can trace their way back to a bedroom screen',
    ],
    reponseModele: `Le spoofing consiste à afficher de gros ordres **sans aucune intention de les exécuter** — pour créer une fausse apparence d'offre ou de demande, pousser les autres à traiter dans le sens voulu, puis annuler. Le layering en est la version mille-feuille : plusieurs couches d'ordres fictifs à des prix échelonnés. Juridiquement, c'est de la manipulation de cours au sens du règlement Abus de marché.

La distinction avec le market making est la vraie question, parce qu'en surface les deux se ressemblent : des ordres affichés en masse, annulés en masse. Le critère est l'**intention d'être exécuté**. Le market maker affiche des prix qu'il est prêt à honorer — son revenu vient précisément d'être traité : c'est le spread, multiplié par la rotation. Le spoofer, lui, vit de ne jamais l'être : ses ordres sont un décor. La formule que je retiens : le market maker gagne quand on le traite, le spoofer gagne quand on le croit — l'un vend de la liquidité, l'autre vend une illusion. Et c'est pourquoi le volume d'annulation seul ne fait pas l'infraction : le teneur de marché recote en permanence pour gérer son inventaire et sa sélection adverse ; c'est l'intention au moment de l'ordre, déduite du comportement d'ensemble, qui fait la différence.

L'affaire qui fixe les idées : Navinder Sarao a pratiqué le spoofing sur les futures S&P 500 pendant des années depuis la maison de ses parents à Hounslow, accumulant plusieurs dizaines de millions de dollars. Arrêté en 2015, accusé d'avoir contribué au flash crash de 2010 — contribution réelle débattue : un homme seul contre le marché le plus profond du monde. Mais la leçon est double : la manipulation n'est pas l'apanage des grandes institutions, et les régulateurs savent remonter jusqu'à un écran de chambre.`,
    reponseModeleEn: `Spoofing consists of displaying large orders **with no intention of executing them** — to create a false appearance of supply or demand, push others to trade in the desired direction, then cancel. Layering is its mille-feuille version: several layers of phantom orders at staggered prices. Legally, it is price manipulation under the Market Abuse Regulation.

The distinction from market making is the real question, because on the surface the two look alike: orders displayed in bulk, cancelled in bulk. The criterion is the **intention to be executed**. The market maker displays prices he is ready to honour — his revenue comes precisely from being traded with: the spread, multiplied by turnover. The spoofer lives off never being traded with: his orders are stage scenery. The line I keep: the market maker earns when traded with, the spoofer earns when believed — one sells liquidity, the other sells an illusion. And that is why cancellation volume alone does not make the offence: the market maker re-quotes constantly to manage inventory and adverse selection; it is the intention at the time of the order, inferred from the overall behaviour, that makes the difference.

The case that fixes the picture: Navinder Sarao spoofed S&P 500 futures for years from his parents' house in Hounslow, accumulating tens of millions of dollars. Arrested in 2015, accused of contributing to the 2010 flash crash — actual contribution debated: one man alone against the deepest market in the world. But the lesson is twofold: manipulation is not the preserve of large institutions, and regulators can trace their way back to a bedroom screen.`,
  },
  {
    id: 'm1-jury-20',
    moduleId: M1,
    theme: 'post-marché',
    themeEn: 'post-trade',
    difficulte: 2,
    question: 'À quoi sert une chambre de compensation ?',
    questionEn: 'What is a clearing house for?',
    plan: [
      'Le mécanisme juridique : la novation',
      'Le blindage : marge initiale et marge de variation',
      'La preuve par l’histoire : Lehman 2008',
      'Le cadre : EMIR et la concentration du risque sur les CCP',
    ],
    planEn: [
      'The legal mechanism: novation',
      'The armour: initial margin and variation margin',
      'The proof by history: Lehman 2008',
      'The frame: EMIR and the concentration of risk onto CCPs',
    ],
    pointsAttendus: [
      'La novation : dès le trade accepté en compensation, le contrat entre A et B est remplacé par deux contrats face à la CCP — acheteuse de tout vendeur, vendeuse de tout acheteur',
      'Conséquence : A et B ne sont plus exposés l’un à l’autre — tout le risque de contrepartie du marché se concentre sur la CCP',
      'La marge initiale couvre la perte potentielle d’une liquidation en conditions dégradées ; la marge de variation règle chaque jour, en cash, gains et pertes latents — les pertes ne s’accumulent jamais',
      'Le membre qui ne répond pas à un appel de marge est en défaut : position liquidée ou mise aux enchères, pertes résiduelles épongées selon la cascade de défaut',
      'La preuve : en 2008, la chambre londonienne a débouclé un portefeuille de swaps Lehman d’environ 9 000 Md$ de notionnel sans même épuiser la marge initiale du défaillant',
      'Le cadre : depuis le G20 de 2009 et EMIR (2012), compensation obligatoire des dérivés standardisés — deux banques qui concluent un swap ne se font plus face',
    ],
    pointsAttendusEn: [
      'Novation: as soon as the trade is accepted for clearing, the contract between A and B is replaced by two contracts facing the CCP — buyer to every seller, seller to every buyer',
      'Consequence: A and B are no longer exposed to each other — all the market’s counterparty risk concentrates on the CCP',
      'The initial margin covers the potential loss of a liquidation in stressed conditions; the variation margin settles latent gains and losses daily, in cash — losses never accumulate',
      'A member failing a margin call is in default: position liquidated or auctioned, residual losses absorbed along the default waterfall',
      'The proof: in 2008, the London clearing house unwound a Lehman swap portfolio of about $9,000bn notional without even exhausting the defaulter’s initial margin',
      'The frame: since the 2009 G20 and EMIR (2012), mandatory clearing of standardised derivatives — two banks entering a swap no longer face each other',
    ],
    bonus: [
      'Ne pas oublier le netting : qui a acheté 1 million de titres et vendu 900 000 ne règle que le solde — la compensation réduit mécaniquement les flux à régler',
      'Annoncer le revers de la médaille : à force de tout concentrer sur une poignée de CCP, on a créé des nœuds systémiques sans précédent — le débat too-big-to-fail',
    ],
    bonusEn: [
      'Do not forget netting: whoever bought 1 million shares and sold 900,000 only settles the balance — clearing mechanically shrinks the flows to be settled',
      'Announce the flip side: by concentrating everything on a handful of CCPs, we created unprecedented systemic nodes — the too-big-to-fail debate',
    ],
    reponseModele: `Une chambre de compensation sert à faire disparaître le risque de contrepartie bilatéral — par un mécanisme juridique précis, la **novation**. Dès que le trade est accepté en compensation, le contrat entre A et B est remplacé par deux contrats : la CCP devient l'acheteur du vendeur et le vendeur de l'acheteur. A et B ne sont plus exposés l'un à l'autre ; chacun ne fait plus face qu'à la chambre, qui porte désormais tout le risque de contrepartie du marché. Au passage, elle nette les positions : qui a acheté un million de titres et vendu 900 000 ne règle que le solde.

Pour survivre à ce rôle, elle se blinde à deux étages. La **marge initiale** est un dépôt calibré pour couvrir la perte potentielle si la position d'un membre devait être liquidée en conditions dégradées — quelques jours de mouvement extrême. La **marge de variation** règle chaque jour, parfois en séance, les gains et pertes latents, en cash : les pertes ne s'accumulent jamais. Un membre qui ne répond pas à un appel de marge est déclaré en défaut : sa position est liquidée ou mise aux enchères, et les pertes résiduelles suivent la cascade de défaut.

Le dispositif a fait ses preuves : en 2008, la chambre londonienne qui compensait les swaps de taux de Lehman a débouclé un portefeuille d'environ **9 000 Md$ de notionnel** sans même épuiser la marge initiale du défaillant. C'est pourquoi le G20 de 2009, traduit en Europe par EMIR en 2012, a rendu la compensation obligatoire pour les dérivés standardisés. Mais j'annonce le revers : à force de tout concentrer sur une poignée de CCP, on a créé des nœuds systémiques sans précédent — c'est le débat too-big-to-fail, et il mérite une question à lui seul.`,
    reponseModeleEn: `A clearing house exists to make bilateral counterparty risk disappear — through a precise legal mechanism, **novation**. As soon as the trade is accepted for clearing, the contract between A and B is replaced by two contracts: the CCP becomes the buyer to the seller and the seller to the buyer. A and B are no longer exposed to each other; each now faces only the clearing house, which carries all the market's counterparty risk. Along the way, it nets positions: whoever bought a million shares and sold 900,000 settles only the balance.

To survive that role, it armours itself on two levels. The **initial margin** is a deposit calibrated to cover the potential loss if a member's position had to be liquidated in stressed conditions — a few days of extreme moves. The **variation margin** settles latent gains and losses daily, sometimes intraday, in cash: losses never accumulate. A member who fails a margin call is declared in default: his position is liquidated or auctioned, and residual losses follow the default waterfall.

The mechanism has proved itself: in 2008, the London clearing house that cleared Lehman's interest rate swaps unwound a portfolio of about **$9,000bn notional** without even exhausting the defaulter's initial margin. That is why the 2009 G20, translated in Europe by EMIR in 2012, made clearing mandatory for standardised derivatives. But I flag the flip side: by concentrating everything on a handful of CCPs, we created unprecedented systemic nodes — that is the too-big-to-fail debate, and it deserves a question of its own.`,
  },
  {
    id: 'm1-jury-21',
    moduleId: M1,
    theme: 'post-marché',
    themeEn: 'post-trade',
    difficulte: 3,
    question: 'Pourquoi le passage à T+1 est-il un grand sujet ?',
    questionEn: 'Why is the move to T+1 such a big deal?',
    plan: [
      'Poser l’objet : le délai entre exécution et règlement, une fenêtre de risque',
      'L’état des lieux : États-Unis à T+1 depuis mai 2024, Europe en route pour octobre 2027',
      'Le gain : moins de risque porté, moins de marges immobilisées — le lien GameStop',
      'Le coût : une intendance tendue, fuseaux horaires compris',
    ],
    planEn: [
      'Frame the object: the lag between execution and settlement, a risk window',
      'The state of play: the US at T+1 since May 2024, Europe heading to October 2027',
      'The gain: less risk carried, fewer margins tied up — the GameStop link',
      'The cost: tighter operations, time zones included',
    ],
    pointsAttendus: [
      'Entre exécution et règlement, le trade n’est qu’une promesse : pendant ce délai, la contrepartie peut faire défaut — plus la fenêtre est longue et la volatilité forte, plus le risque porté est grand',
      'Ce risque est couvert par les garanties exigées par la chambre de compensation : fenêtre plus longue = marges plus lourdes',
      'L’état des lieux : les États-Unis sont passés à T+1 fin mai 2024 ; l’Europe règle encore à T+2, avec une bascule annoncée pour octobre 2027, Royaume-Uni et Suisse alignés',
      'Le lien GameStop : l’appel de marge de 3,7 Md$ notifié à Robinhood était le prix de deux jours de risque sous volatilité extrême — l’épisode a accéléré le passage américain à T+1',
      'Le coût opérationnel : un fonds européen qui achète des actions américaines doit désormais trouver ses dollars en quelques heures, fuseaux horaires compris',
      'Le principe qui tient tout : DvP, livraison contre paiement — aucune des deux jambes ne part sans l’autre',
    ],
    pointsAttendusEn: [
      'Between execution and settlement, the trade is only a promise: during that lag, the counterparty can default — the longer the window and the higher the volatility, the larger the risk carried',
      'That risk is covered by the collateral the clearing house demands: longer window = heavier margins',
      'The state of play: the US moved to T+1 at the end of May 2024; Europe still settles at T+2, with a switch announced for October 2027, the UK and Switzerland aligned',
      'The GameStop link: the $3.7bn margin call notified to Robinhood was the price of two days of risk under extreme volatility — the episode accelerated the US move to T+1',
      'The operational cost: a European fund buying US equities now has to find its dollars within hours, time zones included',
      'The principle holding it all: DvP, delivery versus payment — neither leg moves without the other',
    ],
    bonus: [
      'Le thermomètre du stress : les fails de règlement — pénalisés en Europe depuis février 2022 ; le buy-in obligatoire, suspendu puis rendu conditionnel par la révision CSDR de 2024, n’a jamais été déclenché',
      'La formule de synthèse : raccourcir le cycle, c’est échanger du risque de contrepartie contre du risque opérationnel — un arbitrage, pas un déjeuner gratuit',
    ],
    bonusEn: [
      'The stress thermometer: settlement fails — penalised in Europe since February 2022; the mandatory buy-in, suspended then made conditional by the 2024 CSDR review, has never been triggered',
      'The summary line: shortening the cycle trades counterparty risk for operational risk — a trade-off, not a free lunch',
    ],
    reponseModele: `Parce qu'un détail d'intendance cache une fenêtre de risque. Au moment où votre ordre est exécuté, rien n'a changé de mains : le trade n'est qu'une promesse — vous devrez payer, le vendeur devra livrer. Pendant ce délai conventionnel, votre contrepartie peut faire défaut. Plus la fenêtre est longue et la volatilité forte, plus le risque porté par la chambre de compensation est grand — et plus les garanties qu'elle exige sont lourdes. Raccourcir le cycle, c'est mécaniquement moins de risque et moins de marges immobilisées.

L'état des lieux : les États-Unis sont passés à T+1 — règlement le lendemain — fin mai 2024. L'Europe règle encore à T+2, avec une bascule vers T+1 annoncée pour octobre 2027, Royaume-Uni et Suisse alignés.

Pourquoi l'Amérique a-t-elle accéléré ? GameStop. En janvier 2021, sous T+2, la chambre de compensation portait deux jours de risque sur des positions à la volatilité délirante : l'appel de marge notifié à Robinhood est passé de 700 millions à 3,7 milliards de dollars en une nuit. Une fenêtre deux fois plus courte, ce sont des marges plus légères — l'épisode a directement accéléré la réforme.

Mais ce n'est pas un déjeuner gratuit : on échange du risque de contrepartie contre du risque opérationnel. Un fonds européen qui achète des actions américaines doit désormais trouver ses dollars en quelques heures, fuseaux horaires compris. Et le thermomètre à surveiller, ce sont les fails de règlement — pénalisés en Europe depuis février 2022. Le tout sous le principe qui tient la tuyauterie : DvP, livraison contre paiement — aucune des deux jambes ne part sans l'autre.`,
    reponseModeleEn: `Because a piece of operational plumbing hides a risk window. At the moment your order is executed, nothing has changed hands yet: the trade is only a promise — you will have to pay, the seller will have to deliver. During that conventional lag, your counterparty can default. The longer the window and the higher the volatility, the larger the risk carried by the clearing house — and the heavier the collateral it demands. Shortening the cycle mechanically means less risk and fewer margins tied up.

The state of play: the United States moved to T+1 — next-day settlement — at the end of May 2024. Europe still settles at T+2, with a switch to T+1 announced for October 2027, the United Kingdom and Switzerland aligned.

Why did America accelerate? GameStop. In January 2021, under T+2, the clearing house was carrying two days of risk on positions with deranged volatility: the margin call notified to Robinhood jumped from 700 million to 3.7 billion dollars overnight. A window twice as short means lighter margins — the episode directly accelerated the reform.

But it is no free lunch: you trade counterparty risk for operational risk. A European fund buying US equities now has to find its dollars within a few hours, time zones included. And the thermometer to watch is settlement fails — penalised in Europe since February 2022. All of it resting on the principle that holds the plumbing together: DvP, delivery versus payment — neither leg moves without the other.`,
  },
  {
    id: 'm1-jury-22',
    moduleId: M1,
    theme: 'post-marché',
    themeEn: 'post-trade',
    difficulte: 4,
    question: 'Expliquez-moi GameStop, janvier 2021 — la vraie histoire, côté tuyauterie.',
    questionEn: 'Explain GameStop, January 2021 to me — the real story, plumbing side.',
    plan: [
      'Les faits bruts : la valeur la plus shortée de la cote, de ~20 $ à ~500 $ en un mois',
      'Le scandale apparent : achats bloqués, ventes autorisées — et la thèse du complot',
      'La vraie chaîne : T+2, NSCC, dépôts recalculés — 700 M$ → 3,7 Md$ en une nuit',
      'L’épilogue et la leçon de structure : T+1',
    ],
    planEn: [
      'The raw facts: the most shorted stock on the tape, from ~$20 to ~$500 in a month',
      'The apparent scandal: buys blocked, sells allowed — and the conspiracy thesis',
      'The real chain: T+2, NSCC, recomputed deposits — $700m → $3.7bn overnight',
      'The epilogue and the structural lesson: T+1',
    ],
    pointsAttendus: [
      'Les faits : GameStop, valeur la plus vendue à découvert de la cote américaine, passe d’environ 20 $ début janvier à près de 500 $ en séance le 28, portée par des particuliers coordonnés sur les réseaux sociaux',
      'Le 28 au matin, Robinhood et d’autres courtiers bloquent les achats — les ventes restent autorisées — au sommet de la fièvre : la thèse du coup de fil des hedge funds s’impose immédiatement sur les réseaux',
      'La vraie chaîne : sous T+2, la NSCC (groupe DTCC) porte deux jours de risque, couverts par des dépôts recalculés chaque nuit en fonction de la volatilité et de la concentration — des millions de clients d’un même courtier, tous acheteurs des mêmes titres : la formule explose',
      'Le chiffre : l’exigence notifiée à Robinhood passe d’environ 700 M$ la veille à 3,7 Md$ au matin du 28 — plusieurs fois le coussin disponible',
      'L’asymétrie expliquée : acheter augmente l’exposition à couvrir, vendre la réduit — d’où achats bloqués et ventes autorisées, la seule action qui réduise mécaniquement l’exigence',
      'L’épilogue : supplément exceptionnel abandonné, exigence retombée vers 1,4 Md$, ~3,4 Md$ levés par Robinhood en quelques jours ; l’enquête parlementaire n’a documenté aucune pression de hedge funds — et l’épisode a accéléré le passage américain à T+1',
    ],
    pointsAttendusEn: [
      'The facts: GameStop, the most shorted stock on the US tape, goes from about $20 in early January to nearly $500 intraday on the 28th, driven by retail traders coordinated on social media',
      'On the morning of the 28th, Robinhood and other brokers block purchases — sales remain allowed — at the peak of the fever: the hedge-fund-phone-call thesis instantly takes over the networks',
      'The real chain: under T+2, the NSCC (DTCC group) carries two days of risk, covered by deposits recomputed every night on volatility and position concentration — millions of clients of one broker, all buyers of the same stocks: the formula explodes',
      'The number: the requirement notified to Robinhood jumps from about $700m the day before to $3.7bn on the morning of the 28th — several times the available cushion',
      'The asymmetry explained: buying increases the exposure to cover, selling reduces it — hence buys blocked and sells allowed, the only action that mechanically reduces the requirement',
      'The epilogue: exceptional surcharge waived, requirement falling back to around $1.4bn, ~$3.4bn raised by Robinhood within days; the congressional inquiry documented no hedge fund pressure — and the episode accelerated the US move to T+1',
    ],
    bonus: [
      'Dérouler la chaîne en une phrase qui classe : volatilité extrême → marges NSCC recalculées → capital du courtier insuffisant → restriction des achats',
      'La lecture qui prend de la hauteur : pas de complot, mais un courtier sous-capitalisé face à un appel de marge réglementaire — ce qui est, en un sens, plus inquiétant qu’un complot',
    ],
    bonusEn: [
      'Run the chain in one sentence that ranks you: extreme volatility → recomputed NSCC margins → insufficient broker capital → purchase restrictions',
      'The reading that takes altitude: no conspiracy, but an undercapitalised broker facing a regulatory margin call — which is, in a way, more worrying than a conspiracy',
    ],
    reponseModele: `Les faits d'abord. GameStop est alors la valeur la plus vendue à découvert de la cote américaine. Des particuliers coordonnés sur les réseaux sociaux se ruent à l'achat : le titre passe d'environ 20 dollars début janvier à près de 500 en séance le 28. Ce matin-là, Robinhood et d'autres courtiers bloquent les achats — les ventes restent autorisées — au sommet de la fièvre. L'explication qui s'impose immédiatement : les hedge funds, en train de perdre des milliards sur leurs shorts, auraient passé un coup de fil.

La vraie histoire se joue en post-marché. À l'époque, les actions américaines se règlent à **T+2** : pendant deux jours, la chambre de compensation — la NSCC, filiale du groupe DTCC — porte le risque qu'un courtier ne règle pas, couvert par des dépôts recalculés chaque nuit en fonction de la volatilité et de la concentration des positions. Des millions de clients d'un même courtier, tous acheteurs des mêmes titres à la volatilité devenue délirante : la formule explose. Au matin du 28, l'exigence notifiée à Robinhood passe d'environ **700 millions à 3,7 milliards de dollars** — plusieurs fois son coussin disponible.

Le courtier fait alors la seule chose qui réduise mécaniquement l'exigence : suspendre les achats nouveaux. Acheter augmente l'exposition à couvrir, vendre la réduit — voilà l'asymétrie, entièrement expliquée par la mécanique des marges.

L'épilogue : la CCP renonce à un supplément exceptionnel, l'exigence retombe vers 1,4 milliard, Robinhood lève environ 3,4 milliards en quelques jours. L'enquête parlementaire n'a documenté **aucune** pression de hedge funds — mais un courtier sous-capitalisé face à un appel de marge réglementaire, ce qui est presque plus inquiétant. Et la leçon de structure : l'épisode a accéléré le passage américain à T+1 — une fenêtre deux fois plus courte, des marges plus légères.`,
    reponseModeleEn: `The facts first. GameStop was then the most shorted stock on the US tape. Retail traders coordinated on social media piled in: the stock went from about $20 in early January to nearly $500 intraday on the 28th. That morning, Robinhood and other brokers blocked purchases — sales remained allowed — at the very peak of the fever. The explanation that instantly took hold: the hedge funds, losing billions on their shorts, must have made a phone call.

The real story plays out in the post-trade plumbing. At the time, US equities settled at **T+2**: for two days, the clearing house — the NSCC, a subsidiary of the DTCC group — carries the risk that a broker fails to settle, covered by deposits recomputed every night on the volatility and concentration of positions. Millions of clients of a single broker, all buyers of the same stocks whose volatility had gone deranged: the formula explodes. On the morning of the 28th, the requirement notified to Robinhood jumped from about **$700 million to $3.7 billion** — several times its available cushion.

The broker then did the only thing that mechanically reduces the requirement: suspend new purchases. Buying increases the exposure to be covered, selling reduces it — that is the asymmetry so shocking from the outside, entirely explained by margin mechanics.

The epilogue: the CCP waived an exceptional surcharge, the requirement fell back to around $1.4 billion, Robinhood raised about $3.4 billion within days. The congressional inquiry documented **no** hedge fund pressure — but an undercapitalised broker facing a regulatory margin call, which is almost more worrying. And the structural lesson: the episode accelerated the US move to T+1 — a window twice as short, lighter margins.`,
  },
  {
    id: 'm1-jury-23',
    moduleId: M1,
    theme: 'microstructure',
    themeEn: 'microstructure',
    difficulte: 4,
    question: '« Le carnet affiche 100 000 titres à l’achat, le titre est donc liquide. » Démontez cette affirmation.',
    questionEn: '"The book shows 100,000 shares on the bid, so the stock is liquid." Take this claim apart.',
    plan: [
      'Redéfinir la liquidité : un potentiel à trois dimensions, pas un affichage',
      'Première faille : l’affichage est conditionnel — la liquidité fantôme',
      'Deuxième faille : l’affichage peut être une illusion délibérée — le spoofing',
      'Troisième faille : la sélection adverse — la profondeur disparaît quand on en a besoin',
    ],
    planEn: [
      'Redefine liquidity: a three-dimensional potential, not a display',
      'First flaw: the display is conditional — phantom liquidity',
      'Second flaw: the display can be a deliberate illusion — spoofing',
      'Third flaw: adverse selection — depth vanishes when you need it',
    ],
    pointsAttendus: [
      'La liquidité est ce que vous pourriez échanger sans déplacer le prix, pas ce qui est affiché : elle a trois dimensions — spread, profondeur, résilience — et 100 000 titres affichés n’en renseignent qu’une, partiellement',
      'L’affichage est conditionnel : la liquidité électronique est fournie par des algorithmes qui coupent quand les signaux deviennent incohérents — le 6 mai 2010, volumes records, carnets vides, des actions à 1 centime',
      'Les ordres affichés peuvent être annulés en microsecondes — avant même que votre ordre n’arrive ; l’affichage est une photographie, pas un engagement',
      'L’illusion délibérée existe : le spoofing est précisément la fabrication de fausse profondeur — de gros ordres affichés sans intention d’être exécutés (affaire Sarao)',
      'La sélection adverse organise la disparition au pire moment : les teneurs de marché élargissent et réduisent la taille dès que la probabilité de croiser un informé monte — veille de résultats, rumeur',
      'Le vrai test : que se passe-t-il si j’envoie un vrai ordre de 100 000 titres ? Combien de niveaux traversés, quel slippage, et à quelle vitesse le carnet se reconstitue — la résilience',
    ],
    pointsAttendusEn: [
      'Liquidity is what you could trade without moving the price, not what is displayed: it has three dimensions — spread, depth, resilience — and 100,000 displayed shares inform only one, partially',
      'The display is conditional: electronic liquidity is supplied by algorithms that switch off when signals turn incoherent — on 6 May 2010, record volumes, empty books, stocks printing at one cent',
      'Displayed orders can be cancelled in microseconds — before your order even arrives; the display is a photograph, not a commitment',
      'Deliberate illusion exists: spoofing is precisely the manufacture of fake depth — large orders displayed with no intention of execution (the Sarao case)',
      'Adverse selection organises the disappearance at the worst moment: market makers widen and cut size as soon as the probability of meeting an informed trader rises — eve of earnings, rumour',
      'The real test: what happens if I send a real 100,000-share order? How many levels crossed, how much slippage, and how fast the book rebuilds — resilience',
    ],
    bonus: [
      'L’image du cours qui condense tout : juger la liquidité au seul affichage, c’est juger un pont à la peinture',
      'Le renversement final : volume et affichage mesurent le passé et l’apparence ; la liquidité est une promesse — et les promesses des algorithmes sont révocables en microsecondes',
    ],
    bonusEn: [
      'The course image that condenses it all: judging liquidity by the display alone is judging a bridge by its paint',
      'The final reversal: volume and display measure the past and the appearance; liquidity is a promise — and algorithms’ promises are revocable in microseconds',
    ],
    reponseModele: `L'affirmation confond un affichage avec un potentiel. La liquidité, c'est ce que vous **pourriez** échanger sans déplacer le prix — et elle a trois dimensions : le spread, la profondeur, la résilience. Les 100 000 titres affichés n'en renseignent qu'une seule, et encore : partiellement, à cet instant, à ce prix-là. Je démonte en trois temps.

**Un : l'affichage est conditionnel.** Cette profondeur est fournie pour l'essentiel par des market makers électroniques — et un algorithme, contrairement à un teneur de marché humain, peut disparaître au milieu de la séance. Quand les signaux deviennent incohérents, les machines coupent. Le 6 mai 2010 en est la preuve extrême : volumes records, et pourtant des carnets vidés de tout ordre sérieux, des actions traitées à 1 centime. Les 100 000 titres peuvent être annulés en microsecondes — avant même que votre ordre n'arrive. L'affichage est une photographie, pas un engagement.

**Deux : l'affichage peut être une illusion délibérée.** Le spoofing est précisément la fabrication de fausse profondeur — de gros ordres affichés sans la moindre intention d'exécution, pour pousser les autres à traiter. Navinder Sarao en a fait une industrie depuis un pavillon de Hounslow.

**Trois : la sélection adverse organise la disparition au pire moment.** Les teneurs de marché élargissent leurs spreads et réduisent leurs tailles dès que la probabilité de croiser un informé monte — veille de résultats, rumeur d'OPA. La profondeur s'évapore exactement quand vous en avez besoin.

Le vrai test n'est donc pas de lire le carnet, mais de l'interroger : que se passe-t-il si j'envoie un vrai ordre de 100 000 titres ? Combien de niveaux traversés, quel slippage, et à quelle vitesse le carnet se reconstitue ? Juger la liquidité au seul affichage, c'est juger un pont à la peinture.`,
    reponseModeleEn: `The claim confuses a display with a potential. Liquidity is what you **could** trade without moving the price — and it has three dimensions: spread, depth, resilience. The 100,000 displayed shares inform only one of them, and only partially: at this instant, at that price. I take it apart in three steps.

**One: the display is conditional.** That depth is supplied mostly by electronic market makers — and an algorithm, unlike a human dealer, can vanish mid-session. When signals turn incoherent, the machines switch off. The 6th of May 2010 is the extreme proof: record volumes, and yet books emptied of any serious order, stocks printing at one cent. The 100,000 shares can be cancelled in microseconds — before your order even arrives. The display is a photograph, not a commitment.

**Two: the display can be a deliberate illusion.** Spoofing is precisely the manufacture of fake depth — large orders displayed with no intention whatsoever of execution, to push others to trade. Navinder Sarao turned it into an industry from a house in Hounslow.

**Three: adverse selection organises the disappearance at the worst moment.** Market makers widen their spreads and cut their sizes as soon as the probability of meeting an informed trader rises — eve of earnings, takeover rumour. Depth evaporates exactly when you need it.

So the real test is not reading the book but interrogating it: what happens if I send a real 100,000-share order? How many levels crossed, how much slippage, and how fast does the book rebuild? Judging liquidity by the display alone is judging a bridge by its paint.`,
  },
  {
    id: 'm1-jury-24',
    moduleId: M1,
    theme: 'post-marché',
    themeEn: 'post-trade',
    difficulte: 4,
    question: 'Une chambre de compensation peut-elle faire faillite ? Déroulez le default waterfall — et le débat too-big-to-fail.',
    questionEn: 'Can a clearing house fail? Walk me through the default waterfall — and the too-big-to-fail debate.',
    plan: [
      'Répondre franchement : oui en théorie — et c’est devenu LA question systémique',
      'Dérouler la cascade, marche par marche, avec sa philosophie',
      'Les preuves dans les deux sens : Lehman 2008, Nasdaq Clearing 2018',
      'Le débat : des nœuds too-big-to-fail créés par la régulation elle-même',
    ],
    planEn: [
      'Answer squarely: yes in theory — and it has become THE systemic question',
      'Walk the waterfall, step by step, with its philosophy',
      'The evidence both ways: Lehman 2008, Nasdaq Clearing 2018',
      'The debate: too-big-to-fail nodes created by regulation itself',
    ],
    pointsAttendus: [
      'La cascade, dans l’ordre : 1. les marges du défaillant ; 2. sa contribution au fonds de défaut ; 3. une tranche des fonds propres de la CCP — le skin in the game ; 4. le fonds de défaut des membres survivants ; 5. appels supplémentaires, voire décote des marges de variation dues aux membres gagnants',
      'La philosophie de l’ordre : les ressources du fautif d’abord ; la CCP saigne avant les survivants pour rester incitée à calibrer sérieusement ses marges ; la mutualisation en dernier',
      'La preuve rassurante : Lehman 2008 — un portefeuille d’environ 9 000 Md$ de notionnel débouclé dès la première marche, sans épuiser la marge initiale',
      'La preuve inquiétante : Nasdaq Clearing 2018 — le défaut d’un trader individuel norvégien sur des spreads d’électricité traverse ses marges et consomme de l’ordre de 100 M€ du fonds mutualisé : les survivants ont payé pour un seul homme',
      'Le paradoxe réglementaire : en rendant la compensation obligatoire (G20 2009, EMIR), on a remplacé une toile bilatérale illisible par une poignée de nœuds systémiques — une grande CCP qui tomberait ferait passer Lehman pour une répétition générale',
      'La réponse des régulateurs : plans de rétablissement et de résolution imposés — « en espérant ne jamais avoir à les ouvrir »',
    ],
    pointsAttendusEn: [
      'The waterfall, in order: 1. the defaulter’s margins; 2. his contribution to the default fund; 3. a tranche of the CCP’s own capital — the skin in the game; 4. the surviving members’ default fund; 5. additional assessments, even haircutting the variation margins owed to winning members',
      'The philosophy of the ordering: the culprit’s resources first; the CCP bleeds before the survivors to stay incentivised to calibrate its margins seriously; mutualisation last',
      'The reassuring evidence: Lehman 2008 — a portfolio of about $9,000bn notional unwound at the first step, without exhausting the initial margin',
      'The worrying evidence: Nasdaq Clearing 2018 — the default of an individual Norwegian trader on power spreads burned through his margins and consumed around €100m of the mutualised fund: the survivors paid for one man',
      'The regulatory paradox: by making clearing mandatory (G20 2009, EMIR), an unreadable bilateral web was replaced by a handful of systemic nodes — a major CCP going down would make Lehman look like a dress rehearsal',
      'The regulators’ answer: mandatory recovery and resolution plans — "hoping never to have to open them"',
    ],
    bonus: [
      'La marche 5 mérite une pause : décoter les marges de variation dues aux membres gagnants, c’est faire payer les gagnants — la mutualisation ultime, et la plus controversée',
      'Le renversement qui marque : 2018 prouve que la cascade descend parfois plus bas que sa première marche — « rarement ne veut pas dire jamais »',
    ],
    bonusEn: [
      'Step 5 deserves a pause: haircutting the variation margins owed to winning members means making the winners pay — the ultimate mutualisation, and the most controversial',
      'The reversal that sticks: 2018 proves the waterfall sometimes goes below its first step — "rarely does not mean never"',
    ],
    reponseModele: `Oui, en théorie — et c'est précisément devenu LA question systémique, parce qu'en rendant la compensation obligatoire après 2008, on a concentré le risque du système sur une poignée de nœuds.

Quand un membre tombe : son portefeuille est repris en main, couvert, mis aux enchères auprès des survivants. Les pertes éventuelles suivent ensuite une cascade stricte. **Un** : les marges du défaillant — ses ressources d'abord. **Deux** : sa contribution au fonds de défaut mutualisé. **Trois** : une tranche des fonds propres de la CCP elle-même — le *skin in the game* : la chambre doit saigner avant les survivants, pour rester incitée à calibrer sérieusement ses marges. **Quatre** : le fonds de défaut des membres survivants — la mutualisation proprement dite. **Cinq**, au-delà : appels de contributions supplémentaires, voire décote des marges de variation dues aux membres gagnants — faire payer les gagnants, la mutualisation ultime et la plus controversée.

Les preuves existent dans les deux sens. Rassurante : Lehman 2008 — la chambre londonienne a débouclé environ 9 000 Md$ de notionnel de swaps dès la première marche, sans épuiser la marge initiale. Inquiétante : Nasdaq Clearing 2018 — le défaut d'un seul trader norvégien sur des spreads d'électricité a traversé ses marges et consommé de l'ordre de 100 M€ du fonds mutualisé. Les survivants ont payé pour un homme. Rarement ne veut pas dire jamais.

D'où le débat too-big-to-fail, avec son paradoxe : c'est la régulation elle-même — G20 2009, EMIR — qui a créé ces nœuds, en remplaçant une toile bilatérale illisible par quelques points de défaillance uniques. Une grande CCP qui tomberait ferait passer Lehman pour une répétition générale. La réponse des régulateurs : des plans de rétablissement et de résolution imposés — en espérant ne jamais avoir à les ouvrir.`,
    reponseModeleEn: `Yes, in theory — and that has become THE systemic question precisely because, by making clearing mandatory after 2008, we concentrated the system's risk onto a handful of nodes.

First, what happens when a member goes down: its portfolio is taken over, hedged, auctioned off to the survivors. Any remaining losses then follow a strict waterfall. **One**: the defaulter's margins — his resources first. **Two**: his contribution to the mutualised default fund. **Three**: a tranche of the CCP's own capital — the *skin in the game*: the house must bleed before the survivors, to stay incentivised to calibrate its margins seriously. **Four**: the surviving members' default fund — mutualisation proper. **Five**, beyond: additional assessments, even haircutting the variation margins owed to the winning members — making the winners pay, the ultimate and most controversial mutualisation.

The evidence runs both ways. Reassuring: Lehman 2008 — the London clearing house unwound about $9,000bn of swap notional at the first step, without exhausting the initial margin. Worrying: Nasdaq Clearing 2018 — the default of a single Norwegian trader on power spreads burned through his margins and consumed around €100m of the mutualised fund. The survivors paid for one man. Rarely does not mean never.

Hence the too-big-to-fail debate, with its paradox: it is regulation itself — G20 2009, EMIR — that created these nodes, replacing an unreadable bilateral web with a few single points of failure. A major CCP going down would make Lehman look like a dress rehearsal. The regulators' answer: mandatory recovery and resolution plans — hoping never to have to open them.`,
  },
  {
    id: 'm1-jury-25',
    moduleId: M1,
    theme: 'ordres & exécution',
    themeEn: 'orders & execution',
    difficulte: 4,
    question: 'Jeu de rôle : en 90 secondes, expliquez à un client furieux pourquoi son ordre stop a été exécuté 8 % sous son seuil.',
    questionEn: 'Role play: in 90 seconds, explain to a furious client why his stop order was executed 8% below his trigger.',
    plan: [
      'Accuser réception de la colère — et poser le fait : l’ordre a fonctionné comme prévu',
      'Expliquer sans jargon : le stop décide du moment, le marché décide du prix',
      'Le gap : pourquoi aucun prix n’existait entre le seuil et l’exécution',
      'Reconstruire : le choix stop / stop-limite pour la prochaine fois',
    ],
    planEn: [
      'Acknowledge the anger — and state the fact: the order worked as designed',
      'Explain without jargon: the stop decides the moment, the market decides the price',
      'The gap: why no price existed between the trigger and the execution',
      'Rebuild: the stop versus stop-limit choice for next time',
    ],
    pointsAttendus: [
      'Commencer par l’écoute et un fait posé calmement : il n’y a eu ni erreur ni dysfonctionnement — l’ordre a fait exactement ce qu’il promettait, et c’est cette promesse qu’il faut réexpliquer',
      'La pédagogie sans jargon : un stop dort jusqu’au seuil, puis devient un ordre au marché — il garantit le déclenchement, jamais le prix de sortie',
      'Le gap : la mauvaise nouvelle est tombée hors séance ; le titre est passé directement de l’autre côté du seuil sans jamais coter entre les deux — le premier prix disponible était 8 % plus bas',
      'Donner la perspective : en 1987, des stops se sont exécutés des dizaines de pourcents sous leurs seuils ; le flash crash de 2010 a rejoué la mécanique — 8 %, c’est la mécanique normale d’un gap, pas un cas aberrant',
      'Reconstruire pour la suite : le stop-limite borne le prix de sortie, au risque de ne pas sortir du tout — il faut choisir ce qu’on veut garantir, personne n’obtient les deux',
      'La posture : pas de fausses excuses, pas de promesses intenables — reformuler le choix entre certitude d’exécution et certitude de prix, et vérifier que le client le comprend avant de raccrocher',
    ],
    pointsAttendusEn: [
      'Start by listening and calmly stating a fact: there was no error and no malfunction — the order did exactly what it promised, and it is that promise that needs re-explaining',
      'Jargon-free pedagogy: a stop sleeps until the trigger, then becomes a market order — it guarantees the trigger, never the exit price',
      'The gap: the bad news fell outside trading hours; the stock jumped straight past the trigger without ever quoting in between — the first available price was 8% lower',
      'Give perspective: in 1987, stops executed tens of percent below their triggers; the 2010 flash crash replayed the mechanics — 8% is the normal mechanics of a gap, not an aberration',
      'Rebuild for next time: the stop-limit bounds the exit price, at the risk of not exiting at all — you must choose what you want guaranteed, nobody gets both',
      'The posture: no fake apologies, no untenable promises — restate the choice between execution certainty and price certainty, and check the client understands it before hanging up',
    ],
    bonus: [
      'La phrase qui apaise et qui dit tout : « votre stop a décidé du moment de la sortie ; le marché, lui, a décidé du prix »',
      'Le réflexe professionnel avant de répondre : vérifier l’exécution — heure, premier cours coté, best execution — pour pouvoir affirmer, preuves en main, que l’ordre a été servi au premier prix disponible',
    ],
    bonusEn: [
      'The line that calms and says it all: "your stop decided the moment of the exit; the market decided the price"',
      'The professional reflex before answering: check the execution — time, first quoted price, best execution — so you can state, evidence in hand, that the order was filled at the first available price',
    ],
    reponseModele: `« Je comprends votre colère, et je vais être direct avec vous : j'ai vérifié l'exécution avant de vous appeler, et il n'y a eu ni erreur ni dysfonctionnement. Votre ordre a fait exactement ce qu'il promettait — et c'est cette promesse que je dois vous réexpliquer, parce qu'elle est contre-intuitive.

Un ordre stop, c'est un ordre qui dort. Tant que le titre n'a pas touché votre seuil, il n'existe pas. Quand le seuil est touché, il se réveille — et il devient un ordre **au marché** : vendre, maintenant, au prix disponible. Le stop garantit le moment du déclenchement ; il ne garantit jamais le prix. Votre stop a décidé du moment de la sortie ; le marché, lui, a décidé du prix.

Ce qui s'est passé cette nuit : la mauvaise nouvelle est tombée alors que la Bourse était fermée. À l'ouverture, le titre n'est pas *descendu* jusqu'à votre seuil — il a ouvert directement de l'autre côté, 8 % plus bas, sans jamais coter entre les deux. Il n'existait aucun prix entre votre seuil et l'ouverture : votre ordre a été servi au premier prix disponible. C'est ce qu'on appelle un gap, et ce n'est pas un cas aberrant : en 1987, des stops se sont exécutés des dizaines de pourcents sous leurs seuils.

Pour la suite, parlons de ce que vous voulez vraiment garantir. Si c'est le prix, il existe le stop-limite : il borne votre sortie — mais si le marché saute votre limite, vous restez en position. Personne n'obtient les deux : certitude d'exécution ou certitude de prix, il faut choisir. La nuit dernière, votre stop vous a sorti d'un titre qui chutait — c'était sa mission. Le prix, lui, appartenait au marché. »`,
    reponseModeleEn: `"I understand your anger, and I will be straight with you: I checked the execution before calling you, and there was no error and no malfunction. Your order did exactly what it promised — and it is that promise I need to re-explain, because it is counter-intuitive.

A stop order is an order that sleeps. As long as the stock has not touched your trigger, it does not exist. When the trigger is touched, it wakes up — and becomes a **market** order: sell, now, at the available price. The stop guarantees the moment of the trigger; it never guarantees the price. Your stop decided the moment of the exit; the market decided the price.

What happened overnight: the bad news fell while the exchange was closed. At the open, the stock did not *descend* to your trigger — it opened straight past it, 8% lower, without ever quoting in between. No price existed between your trigger and the open: your order was filled at the first available price. That is called a gap, and it is not an aberration: in 1987, stops executed tens of percent below their triggers.

For the future, let us talk about what you really want guaranteed. If it is the price, there is the stop-limit: it bounds your exit — but if the market jumps over your limit, you stay in the position. Nobody gets both: execution certainty or price certainty, you must choose. Last night, your stop took you out of a falling stock — that was its mission. The price belonged to the market."`,
  },
];
