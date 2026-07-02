import type { JuryQuestion } from '../../../engine/types';

const M9 = '09-produits-structures';

export const jury: JuryQuestion[] = [
  {
    id: 'm9-j-01',
    moduleId: M9,
    theme: 'la promesse en briques',
    themeEn: 'the promise in building blocks',
    difficulte: 1,
    question: 'Qu\'est-ce qu\'un produit structuré — et comment le fabrique-t-on ?',
    questionEn: 'What is a structured product — and how is it manufactured?',
    plan: [
      'Définir : un titre de dette bancaire dont le remboursement suit une formule écrite d\'avance sur un ou plusieurs sous-jacents — la formule EST le produit',
      'Poser les deux briques : un zéro-coupon pour la partie ferme de la promesse, des options pour tous les « si »',
      'Suivre la chaîne : émetteur-structureur, distributeur, client — et la marge, encaissée le jour 1, pas à l\'échéance',
      'Conclure sur la contrainte centrale : budget d\'options = 100 − ZC − marge, ce qui reste pour acheter la promesse conditionnelle',
    ],
    planEn: [
      'Define: a bank-issued debt security whose redemption follows a formula written in advance on one or several underlyings — the formula IS the product',
      'Lay the two bricks: a zero-coupon for the firm part of the promise, options for every "if"',
      'Follow the chain: issuer-structurer, distributor, client — and the margin, pocketed on day 1, not at maturity',
      'Conclude with the central constraint: option budget = 100 − ZC − margin, what remains to buy the conditional promise',
    ],
    pointsAttendus: [
      'La définition complète : un titre de dette émis par une banque, remboursé à l\'échéance selon une formule écrite d\'avance sur un ou plusieurs sous-jacents — acheter un structuré, c\'est prêter 100 à une banque',
      'Les deux familles de briques : le taux (un zéro-coupon porte la partie fixe, ZC = 100 × e^(−rT), soit 86,07 à 3 % et 5 ans) et l\'optionnel (participation = call, protection conditionnelle = put à barrière, coupons conditionnels = digitales)',
      'La chaîne de fabrication : le structureur (marge autour de 1 % du nominal sur 5 ans), le distributeur (rétrocession), le client — sur 100 versés, 98 à 99 seulement « travaillent » pour lui',
      'La marge encaissée à l\'émission : le jour où le produit est vendu 100, il en vaut économiquement 98 ou 99 — d\'où la déception des valeurs de revente des premières semaines',
      'Le budget d\'options : 100 − 86,07 − 1 = 12,93 — toute la générosité de la formule devra tenir dans ce reliquat',
      'Le mot dette et ses deux conséquences : la banque se finance grâce au client (funding), et la formule ne vaut que la signature de l\'émetteur',
    ],
    pointsAttendusEn: [
      'The complete definition: a debt security issued by a bank, redeemed at maturity according to a formula written in advance on one or several underlyings — buying a structured product is lending 100 to a bank',
      'The two brick families: rates (a zero-coupon carries the fixed part, ZC = 100 × e^(−rT), i.e. 86.07 at 3% and 5 years) and optionality (participation = call, conditional protection = barrier put, conditional coupons = digitals)',
      'The manufacturing chain: the structurer (margin around 1% of notional over 5 years), the distributor (retrocession), the client — of 100 paid in, only 98 to 99 actually "work" for him',
      'The margin pocketed at issuance: the day the product is sold at 100, it is economically worth 98 or 99 — hence the disappointing resale values of the first weeks',
      'The option budget: 100 − 86.07 − 1 = 12.93 — all the formula\'s generosity will have to fit inside that remainder',
      'The word debt and its two consequences: the bank funds itself through the client, and the formula is only worth the issuer\'s signature',
    ],
    bonus: [
      'Le raffinement funding : la banque n\'achète pas le zéro-coupon, elle L\'EST — et plus sa signature est fragile, plus son funding est cher, plus la formule est belle : à formule égale, le produit le plus généreux est souvent celui de l\'émetteur le moins sûr',
      'Le premier réflexe de lecture d\'une term sheet : chercher le sens de l\'optionnel — le client achète des options (capital garanti : risque borné) ou en vend (reverse convertible, autocall : profil d\'assureur du module 8)',
    ],
    bonusEn: [
      'The funding refinement: the bank does not buy the zero-coupon, it IS the zero-coupon — and the shakier its signature, the dearer its funding, the prettier the formula: for the same formula, the most generous product is often the least safe issuer\'s',
      'The first term-sheet reading reflex: find which way the optionality points — the client either buys options (capital guarantee: bounded risk) or sells them (reverse convertible, autocall: the module 8 insurer profile)',
    ],
    reponseModele: `Un produit structuré est un **titre de dette émis par une banque**, dont le remboursement à l'échéance suit une **formule** écrite d'avance sur un ou plusieurs sous-jacents : « 100 % du capital plus 50 % de la hausse du CAC 40 », « 8 % par an tant que l'indice tient au-dessus de 60 % de son niveau initial ». La formule EST le produit — et le mot important de la définition est *dette* : acheter un structuré, c'est prêter 100 à une banque, qui s'engage à rembourser selon la formule.

La fabrication tient en deux familles de briques, toutes déjà connues. La partie ferme de la promesse — « vos 100 dans 5 ans » — est un **zéro-coupon** : 100 × e^(−rT), soit 86,07 à 3 % sur 5 ans. Tout ce que la formule contient de conditionnel — participation à la hausse, protection qui saute sous une barrière, coupons conditionnels — est un **payoff d'option** : un call, un put down-and-in, une chaîne de digitales. Le structureur n'invente aucun payoff : il fait ses courses au desk d'options du module 8.

Entre la salle des marchés et l'épargnant, trois maillons se partagent le prix : l'**émetteur-structureur**, qui conçoit, assemble et couvre — sa marge, environ 1 % du nominal sur 5 ans ; le **distributeur**, payé en rétrocession logée dans le prix ; le **client**, qui paie 100 pour un produit qui en vaut économiquement 98 ou 99 dès le jour 1 — la marge se paie à l'émission, pas à l'échéance, et c'est pourquoi les valeurs de revente des premières semaines déçoivent : le client ne perd pas, il découvre la marge.

Reste la contrainte qui gouverne tout le métier : le **budget d'options**, budget = 100 − ZC − marge = 100 − 86,07 − 1 = 12,93. Toute la générosité de la formule devra tenir dans ces 12,93 % du nominal. La chute : une promesse sur mesure, des briques standard, un budget qui contraint — et une signature derrière la garantie, car un zéro-coupon bancaire n'est jamais un coffre-fort, seulement une créance.`,
    reponseModeleEn: `A structured product is a **debt security issued by a bank**, whose redemption at maturity follows a **formula** written in advance on one or several underlyings: "100% of capital plus 50% of the CAC 40's rise", "8% per year as long as the index holds above 60% of its initial level". The formula IS the product — and the important word in the definition is *debt*: buying a structured product is lending 100 to a bank, which commits to repay according to the formula.

The manufacturing rests on two brick families, all already known. The firm part of the promise — "your 100 in 5 years" — is a **zero-coupon**: 100 × e^(−rT), i.e. 86.07 at 3% over 5 years. Everything conditional in the formula — upside participation, protection that fails below a barrier, conditional coupons — is an **option payoff**: a call, a down-and-in put, a chain of digitals. The structurer invents no payoff: he shops at the module 8 options desk.

Between the trading floor and the saver, three links share the price: the **issuer-structurer**, who designs, assembles and hedges — his margin, about 1% of notional over 5 years; the **distributor**, paid a retrocession housed inside the price; the **client**, who pays 100 for a product economically worth 98 or 99 from day 1 — the margin is paid at issuance, not at maturity, which is why early resale values disappoint: the client is not losing, he is discovering the margin.

There remains the constraint that governs the whole trade: the **option budget**, budget = 100 − ZC − margin = 100 − 86.07 − 1 = 12.93. All the formula's generosity must fit inside those 12.93% of notional. The closing line: a tailor-made promise, standard bricks, a budget that constrains — and a signature behind the guarantee, because a bank zero-coupon is never a safe-deposit box, only a claim.`,
  },
  {
    id: 'm9-j-02',
    moduleId: M9,
    theme: 'la promesse en briques',
    themeEn: 'the promise in building blocks',
    difficulte: 2,
    question: 'Le client vous confie 100. Suivez cet argent — et dites-moi ce qui décide de la générosité de la formule.',
    questionEn: 'The client hands you 100. Follow that money — and tell me what decides how generous the formula can be.',
    plan: [
      'Découper les 100 en trois termes : zéro-coupon (la garantie), marge (la chaîne), budget d\'options (le rêve)',
      'Chiffrer le canonique : r = 3 %, 5 ans — ZC 86,07, marge 1, budget 12,93',
      'Lire la sensibilité clé : le budget est une fonction croissante des taux — taux ↑ ⇒ ZC ↓ ⇒ budget ↑',
      'Conclure en structureur : budget maigre = formule terne, ou risque supplémentaire transféré au client',
    ],
    planEn: [
      'Split the 100 into three terms: zero-coupon (the guarantee), margin (the chain), option budget (the dream)',
      'Run the canonical numbers: r = 3%, 5 years — ZC 86.07, margin 1, budget 12.93',
      'Read the key sensitivity: the budget is an increasing function of rates — rates ↑ ⇒ ZC ↓ ⇒ budget ↑',
      'Conclude as a structurer: a thin budget means a dull formula, or extra risk shifted onto the client',
    ],
    pointsAttendus: [
      'L\'équation centrale : budget = 100 − ZC − marge, avec ZC = 100 × e^(−rT)',
      'Le calcul canonique : 86,07 dorment dans la garantie, 1 rémunère la chaîne, 12,93 partent au desk d\'options acheter de la promesse conditionnelle',
      'La lecture macro qui fait les bonnes copies : le budget est une fonction croissante des taux — à r = 5 %, ZC 77,88 et budget 21,12 ; à r = 0,5 %, ZC 97,53 et budget squelettique de 1,47',
      'La lecture structureur : si le budget est maigre, il faut soit vendre moins de rêve, soit aller chercher du rendement en faisant prendre plus de risque au client — le basculement vers les produits où le client vend des options',
      'La marge du jour 1 : le produit vendu 100 vaut 98-99 à l\'émission — contrairement aux frais annuels d\'un fonds, tout est prélevé d\'avance',
      'La conclusion en une flèche : le niveau des taux longs se lit directement dans la générosité des vitrines — le budget relie la macro à la brochure',
    ],
    pointsAttendusEn: [
      'The central equation: budget = 100 − ZC − margin, with ZC = 100 × e^(−rT)',
      'The canonical calculation: 86.07 sleeps in the guarantee, 1 pays the chain, 12.93 goes to the options desk to buy conditional promise',
      'The macro reading that makes good papers: the budget is an increasing function of rates — at r = 5%, ZC 77.88 and budget 21.12; at r = 0.5%, ZC 97.53 and a skeletal budget of 1.47',
      'The structurer reading: if the budget is thin, either sell less dream, or chase yield by making the client take more risk — the shift towards products where the client sells options',
      'The day-1 margin: a product sold at 100 is worth 98-99 at issuance — unlike a fund\'s annual fees, everything is deducted upfront',
      'The one-arrow conclusion: the level of long rates reads directly in shop-window generosity — the budget links macro to brochure',
    ],
    bonus: [
      'Le raffinement funding : le taux pertinent n\'est pas tout à fait le taux sans risque mais le taux de financement de la banque — signature fragile, funding cher, zéro-coupon interne bon marché, formule plus belle',
      'L\'annonce de l\'histoire : ce budget squelettique à 0,5 % explique la disparition du capital garanti entre 2015 et 2021, et sa résurrection en 2022-2023 quand la BCE est passée de −0,5 % à 4 %',
    ],
    bonusEn: [
      'The funding refinement: the relevant rate is not quite the risk-free rate but the bank\'s funding rate — fragile signature, expensive funding, cheap internal zero-coupon, prettier formula',
      'The history preview: that skeletal budget at 0.5% explains the disappearance of capital guarantee between 2015 and 2021, and its resurrection in 2022-2023 when the ECB went from −0.5% to 4%',
    ],
    reponseModele: `Les 100 du client se découpent en trois termes, et cette équation est la contrainte centrale du métier : **100 = zéro-coupon + marge + budget d'options**. Le zéro-coupon finance la partie ferme de la promesse : pour redonner 100 dans 5 ans à un taux de 3 %, il faut immobiliser 100 × e^(−0,15) = 86,07 aujourd'hui. La marge — structuration plus rétrocessions — en prélève environ 1, une fois pour toutes, le jour de l'émission. Ce qui reste s'appelle le **budget d'options** : 100 − 86,07 − 1 = **12,93**. C'est la matière première du structureur : toute la générosité de la formule — participation, coupons, barrières — devra tenir dans ces 12,93 % du nominal.

La générosité de la formule est donc décidée en premier lieu par **le niveau des taux**. La chaîne se récite en une flèche : taux ↑ ⇒ zéro-coupon ↓ ⇒ budget ↑ ⇒ formule généreuse. À r = 5 %, le zéro-coupon tombe à 77,88 et le budget bondit à 21,12 ; à r = 0,5 %, il coûte 97,53 et le budget s'effondre à **1,47** — plus rien à promettre. Le budget d'options est ce qui relie la politique monétaire à la vitrine de l'agence bancaire.

Lecture structureur, ensuite : quand le budget est maigre, il n'y a que deux issues — vendre moins de rêve, ou aller chercher du rendement en faisant prendre plus de risque au client, c'est-à-dire basculer vers les formules où le client **vend** des options au lieu d'en acheter. C'est exactement l'histoire de la décennie de taux zéro : la mort du capital garanti et le triomphe des autocalls.

La chute : suivez l'argent et vous savez tout — 86 qui dorment, 1 qui rémunère la chaîne dès le jour 1 (le produit vaut 98-99 à l'émission, pas 100), et 12,93 qui portent seuls tout ce que la brochure raconte.`,
    reponseModeleEn: `The client's 100 splits into three terms, and this equation is the trade's central constraint: **100 = zero-coupon + margin + option budget**. The zero-coupon funds the firm part of the promise: to give back 100 in 5 years at a 3% rate, you must set aside 100 × e^(−0.15) = 86.07 today. The margin — structuring plus retrocessions — takes about 1, once and for all, on issuance day. What remains is called the **option budget**: 100 − 86.07 − 1 = **12.93**. That is the structurer's raw material: all the formula's generosity — participation, coupons, barriers — must fit inside those 12.93% of notional.

The formula's generosity is therefore decided first by **the level of rates**. The chain recites in one arrow: rates ↑ ⇒ zero-coupon ↓ ⇒ budget ↑ ⇒ generous formula. At r = 5%, the zero-coupon falls to 77.88 and the budget jumps to 21.12; at r = 0.5%, it costs 97.53 and the budget collapses to **1.47** — nothing left to promise. The option budget is what links monetary policy to the bank branch's shop window.

Then the structurer's reading: when the budget is thin, there are only two ways out — sell less dream, or chase yield by making the client carry more risk, that is, switch to formulas where the client **sells** options instead of buying them. That is exactly the story of the zero-rate decade: the death of capital guarantee and the triumph of autocalls.

The closing line: follow the money and you know everything — 86 asleep in the guarantee, 1 paying the chain from day 1 (the product is worth 98-99 at issuance, not 100), and 12.93 carrying, alone, everything the brochure tells.`,
  },
  {
    id: 'm9-j-03',
    moduleId: M9,
    theme: 'la promesse en briques',
    themeEn: 'the promise in building blocks',
    difficulte: 2,
    question: 'L\'indice monte de 50 % et la banque doit verser une forte participation. Vient-elle de perdre de l\'argent — espérait-elle que je perde ?',
    questionEn: 'The index rises 50% and the bank must pay a large participation. Did it just lose money — was it hoping I would lose?',
    plan: [
      'Répondre non, et le prouver : la banque a acheté les briques qui versent exactement ce que la formule promet',
      'Descendre d\'un étage : le desk d\'options en face ne parie pas non plus — il delta-hedge, réajusté au fil du gamma (module 8)',
      'Situer le gain de la banque : la marge, verrouillée le jour 1, identique à +50 % ou −50 % — indifférente au scénario',
      'Déplacer le vrai conflit d\'intérêts : pas la direction du marché, mais la lisibilité — l\'incitation porte sur les volumes de vitrines attrayantes',
    ],
    planEn: [
      'Answer no, and prove it: the bank bought the bricks that pay exactly what the formula promises',
      'Go one floor down: the options desk facing it is not betting either — it delta-hedges, readjusted along the gamma (module 8)',
      'Locate the bank\'s gain: the margin, locked on day 1, identical at +50% or −50% — indifferent to the scenario',
      'Move the real conflict of interest: not market direction, but readability — the incentive bears on volumes of attractive shop windows',
    ],
    pointsAttendus: [
      'La banque n\'est pas la contrepartie économique du client : ce que la formule promet, les briques achetées le versent — les calls paient la participation',
      'Le desk d\'options qui a vendu ces briques neutralise son propre risque par delta-hedging : la quantité d\'actions dictée par le delta, réajustée au fil du gamma — module 8, chapitre 5',
      'Le gain de la banque est la marge de structuration, encaissée à l\'émission, indifférente au scénario de marché : indice à +50 % ou −50 %, elle est la même',
      'Ce qui reste au-delà de la marge : les résidus de couverture nommés au module 8 — P&L de gamma face à la volatilité réalisée, sauts que le hedging discret ne rattrape pas',
      'Le vrai visage du conflit d\'intérêts : la marge est proportionnelle aux volumes émis — l\'incitation de la chaîne est de vendre des formules attrayantes en vitrine dont le risque réel est difficile à lire',
      'La bonne question du client n\'est pas « qui parie contre moi ? » mais « quelle option ai-je vendue sans le savoir, et suis-je payé à son juste prix ? »',
    ],
    pointsAttendusEn: [
      'The bank is not the client\'s economic counterparty: what the formula promises, the purchased bricks pay — the calls pay the participation',
      'The options desk that sold those bricks neutralises its own risk by delta-hedging: the stock quantity dictated by delta, readjusted along the gamma — module 8, chapter 5',
      'The bank\'s gain is the structuring margin, pocketed at issuance, indifferent to the market scenario: index at +50% or −50%, it is the same',
      'What remains beyond the margin: the hedging residuals named in module 8 — gamma P&L against realised volatility, jumps that discrete hedging cannot catch',
      'The real face of the conflict of interest: the margin is proportional to volumes issued — the chain\'s incentive is to sell shop-window-attractive formulas whose true risk is hard to read',
      'The client\'s right question is not "who is betting against me?" but "which option did I sell without knowing, and am I paid its fair price?"',
    ],
    bonus: [
      'L\'histoire française qui fonde la méfiance : Bénéfic (La Poste, 1999-2000) et Doubl\'ô (Caisses d\'Épargne, 2001) — des dizaines de milliers d\'épargnants qui avaient vendu un put sans avoir lu la formule, une décennie de contentieux, et des règles de commercialisation entières',
      'Le vocabulaire qui vaut des points : on ne dit « garanti » que lorsque le capital l\'est vraiment, on dit « protégé » quand une barrière peut céder — la différence valait des milliards dans les prétoires',
    ],
    bonusEn: [
      'The French history behind the distrust: Bénéfic (La Poste, 1999-2000) and Doubl\'ô (Caisses d\'Épargne, 2001) — tens of thousands of savers who had sold a put without reading the formula, a decade of litigation, and entire marketing rulebooks',
      'The vocabulary worth points: say "guaranteed" only when capital truly is, say "protected" when a barrier can give way — the difference was worth billions in courtrooms',
    ],
    reponseModele: `Non — et la réponse mobilise exactement la mécanique de couverture du module 8. La banque n'est pas en face de vous : elle a **acheté les options que la formule promet**. Si l'indice monte de 50 % et que le produit doit verser la participation, ce sont les calls achetés à l'émission qui la versent — ce que le produit doit au client, les briques le paient.

Descendez d'un étage : le desk d'options qui a vendu ces calls ne reste pas exposé non plus. Il **delta-hedge** — il tient en permanence la quantité d'actions que dicte le delta, réajustée au fil du gamma. De bout en bout, le risque de marché est neutralisé. Ce qui reste à la banque, c'est la **marge**, verrouillée le jour de l'émission : indice à +50 % ou à −50 %, elle est la même. S'y ajoutent seulement les résidus de couverture du module 8 — le P&L de gamma face à la volatilité réalisée, les sauts que le hedging discret ne rattrape pas. Sur un structuré correctement couvert, la banque est **indifférente au scénario de marché** : elle fabrique, elle ne parie pas.

Mais la question n'est pas innocente, car le conflit d'intérêts existe — ailleurs, et plus subtil. La marge étant proportionnelle aux **volumes** émis, l'incitation de toute la chaîne est de vendre des formules *attrayantes en vitrine* — coupons élevés, barrières apparemment lointaines — dont le risque réel est difficile à lire. Le produit n'est pas un duel banque-client : c'est une **vente d'options déguisée en placement**, et l'histoire française — Bénéfic, Doubl'ô — a montré ce qui arrive quand personne ne lit la formule.

La chute : la question honnête n'est jamais « qui parie contre moi ? » — personne — mais « **quelle option ai-je vendue sans le savoir, et suis-je payé à son juste prix ?** ». Il y a toujours une réponse, et elle est rarement sur la brochure.`,
    reponseModeleEn: `No — and the answer mobilises exactly the hedging mechanics of module 8. The bank is not facing you: it has **bought the options the formula promises**. If the index rises 50% and the product must pay the participation, the calls bought at issuance pay it — what the product owes the client, the bricks deliver.

Go one floor down: the options desk that sold those calls does not stay exposed either. It **delta-hedges** — permanently holding the stock quantity dictated by delta, readjusted along the gamma. End to end, market risk is neutralised. What remains for the bank is the **margin**, locked on issuance day: index at +50% or −50%, it is the same. Only the module 8 hedging residuals add to it — gamma P&L against realised volatility, jumps that discrete hedging cannot catch. On a properly hedged structured product, the bank is **indifferent to the market scenario**: it manufactures, it does not bet.

But the question is not innocent, because the conflict of interest exists — elsewhere, and more subtly. Since the margin is proportional to **volumes** issued, the whole chain's incentive is to sell formulas *attractive in the shop window* — high coupons, seemingly distant barriers — whose real risk is hard to read. The product is not a bank-versus-client duel: it is an **option sale disguised as an investment**, and French history — Bénéfic, Doubl'ô — showed what happens when nobody reads the formula.

The closing line: the honest question is never "who is betting against me?" — nobody — but "**which option did I sell without knowing, and am I paid its fair price?**". There is always an answer, and it is rarely on the brochure.`,
  },
  {
    id: 'm9-j-04',
    moduleId: M9,
    theme: 'le capital garanti',
    themeEn: 'the capital-guaranteed product',
    difficulte: 2,
    question: 'Décomposez un produit à capital garanti — et dites-moi d\'où sort sa participation.',
    questionEn: 'Break down a capital-guaranteed product — and tell me where its participation comes from.',
    plan: [
      'Lire le payoff terme à terme : 100 + p × max(perf, 0) — les 100 fermes sont un zéro-coupon, le max est un call à la monnaie',
      'Poser LA formule : p = budget / prix du call ATM — la participation n\'est pas un choix commercial, c\'est le résultat d\'une division',
      'Chiffrer le canonique : budget 12,93, call ATM 5 ans 24,33 — p = 53,1 % de la hausse',
      'Donner les deux sensibilités : les taux (via le budget, effet dominant) et la volatilité (via le prix du call — le client est acheteur de vol)',
    ],
    planEn: [
      'Read the payoff term by term: 100 + p × max(perf, 0) — the firm 100 is a zero-coupon, the max is an at-the-money call',
      'State THE formula: p = budget / ATM call price — participation is not a commercial choice, it is the result of a division',
      'Run the canonical numbers: budget 12.93, 5-year ATM call 24.33 — p = 53.1% of the rise',
      'Give the two sensitivities: rates (through the budget, the dominant effect) and volatility (through the call price — the client is a volatility buyer)',
    ],
    pointsAttendus: [
      'Le payoff : remboursement = 100 + p × max((S_T − S_0)/S_0, 0) × 100 — et sa lecture en briques : zéro-coupon plus calls à la monnaie',
      'LA formule du produit : p = budget / prix du call ATM — combien de calls le budget peut-il payer ; 12,93 / 24,33 = 53,1 %',
      'La lecture client : indice à +40 %, remboursement 100 + 0,531 × 40 = 121,26 ; indice à −30 %, remboursement 100 — le pire scénario est un coût d\'opportunité (cinq ans payés zéro), pas une perte',
      'La sensibilité taux : à r = 5 %, budget 21,12 et call 29,14 — participation 72,5 % ; les deux étages bougent en sens inverse, mais l\'effet budget écrase l\'effet prime',
      'La sensibilité volatilité : à budget constant, le call ATM vaut 20,56 / 24,33 / 31,99 à 15 / 20 / 30 % de vol — participation 62,9 / 53,1 / 40,4 % : le client de capital garanti est structurellement acheteur de volatilité',
      'La possibilité p > 100 % : si le budget dépasse le prix du call (taux hauts, vol écrasée), le client touche plus que la hausse, capital garanti compris — le marché a connu ces deux mondes',
    ],
    pointsAttendusEn: [
      'The payoff: redemption = 100 + p × max((S_T − S_0)/S_0, 0) × 100 — and its brick reading: zero-coupon plus at-the-money calls',
      'THE product formula: p = budget / ATM call price — how many calls can the budget pay; 12.93 / 24.33 = 53.1%',
      'The client reading: index at +40%, redemption 100 + 0.531 × 40 = 121.26; index at −30%, redemption 100 — the worst scenario is an opportunity cost (five years paid zero), not a loss',
      'The rate sensitivity: at r = 5%, budget 21.12 and call 29.14 — participation 72.5%; the two floors of the fraction move opposite ways, but the budget effect crushes the premium effect',
      'The volatility sensitivity: at constant budget, the ATM call is worth 20.56 / 24.33 / 31.99 at 15 / 20 / 30% vol — participation 62.9 / 53.1 / 40.4%: the capital-guarantee client is structurally a volatility buyer',
      'The p > 100% possibility: if the budget exceeds the call price (high rates, crushed vol), the client gets more than the rise, capital guarantee included — the market has known both worlds',
    ],
    bonus: [
      'Les quatre rustines quand la division rend un chiffre terne — cap (call spread 100/130 : 118 % d\'une hausse plafonnée à +30 %), moyenne asiatique, garantie à 90 % (participation 88,5 %), maturité allongée : toutes reviennent à acheter une option moins chère pour embellir le ratio',
      'La règle de comparaison : on ne compare jamais deux participations, on compare deux formules — chaque rustine dégrade l\'option pour embellir le pourcentage en gros caractères',
    ],
    bonusEn: [
      'The four patches when the division yields a dull number — cap (100/130 call spread: 118% of a rise capped at +30%), Asian averaging, 90% guarantee (participation 88.5%), longer maturity: all amount to buying a cheaper option to flatter the ratio',
      'The comparison rule: never compare two participations, compare two formulas — every patch degrades the option to embellish the large-print percentage',
    ],
    reponseModele: `Le payoff se lit terme à terme : remboursement = 100 + p × max((S_T − S_0)/S_0, 0) × 100. Les 100 fermes sont un **zéro-coupon** — 86,07 à 3 % sur 5 ans. Le max sur la performance est un **call à la monnaie** — le coude du module 8, ni plus ni moins. Le structureur place le zéro-coupon, prélève la marge, et convertit tout le budget restant en calls ATM.

D'où la formule la plus éclairante du module : la participation n'est pas un choix commercial, c'est le **résultat d'une division** — p = budget / prix du call ATM. Combien de calls le budget peut-il payer ? Sur le canonique : budget 12,93, call ATM 5 ans 24,33 par Black-Scholes, donc p = 12,93 / 24,33 = **53,1 %** de la hausse. Lecture client : indice à +40 %, remboursement 121,26 ; indice à −30 %, remboursement 100 tout rond — le pire scénario n'est pas une perte, c'est cinq ans d'immobilisation payés zéro : un coût d'opportunité.

Cette division a deux sensibilités. **Les taux**, au numérateur : à r = 5 %, le zéro-coupon tombe à 77,88, le budget bondit à 21,12 — et malgré un call renchéri à 29,14, la participation saute à 72,5 % : l'effet budget écrase l'effet prime. **La volatilité**, au dénominateur : à budget strictement constant, le call vaut 20,56 à 15 % de vol, 31,99 à 30 % — le même budget achète 62,9 % ou 40,4 % de la hausse. Le client de capital garanti est structurellement **acheteur de volatilité** : les meilleurs millésimes se fabriquent dans les marchés calmes, sur des indices peu nerveux.

La chute : si un jour le budget dépasse le prix du call — taux hauts, vol écrasée — la participation dépasse 100 % : aucun génie financier là-dedans, la même division avec d'autres paramètres. Et le réflexe face à un chiffre trop beau : vérifier ce que « la hausse » veut dire — plafonnée ? moyennée ? garantie partielle ? — car chaque rustine embellit le ratio en dégradant l'option.`,
    reponseModeleEn: `The payoff reads term by term: redemption = 100 + p × max((S_T − S_0)/S_0, 0) × 100. The firm 100 is a **zero-coupon** — 86.07 at 3% over 5 years. The max on performance is an **at-the-money call** — the module 8 kink, no more, no less. The structurer places the zero-coupon, takes the margin, and converts the whole remaining budget into ATM calls.

Hence the module's most illuminating formula: participation is not a commercial choice, it is the **result of a division** — p = budget / ATM call price. How many calls can the budget pay? On the canonical case: budget 12.93, 5-year ATM call 24.33 by Black-Scholes, so p = 12.93 / 24.33 = **53.1%** of the rise. Client reading: index at +40%, redemption 121.26; index at −30%, redemption exactly 100 — the worst scenario is not a loss, it is five years locked up for zero: an opportunity cost.

This division has two sensitivities. **Rates**, in the numerator: at r = 5%, the zero-coupon falls to 77.88, the budget jumps to 21.12 — and despite a call now costing 29.14, participation leaps to 72.5%: the budget effect crushes the premium effect. **Volatility**, in the denominator: at a strictly constant budget, the call is worth 20.56 at 15% vol, 31.99 at 30% — the same budget buys 62.9% or 40.4% of the rise. The capital-guarantee client is structurally a **volatility buyer**: the best vintages are made in calm markets, on quiet indices.

The closing line: if one day the budget exceeds the call price — high rates, crushed vol — participation exceeds 100%: no financial genius there, the same division with other parameters. And the reflex before a too-pretty number: check what "the rise" means — capped? averaged? partial guarantee? — because every patch flatters the ratio by degrading the option.`,
  },
  {
    id: 'm9-j-05',
    moduleId: M9,
    theme: 'le capital garanti',
    themeEn: 'the capital-guaranteed product',
    difficulte: 2,
    question: 'Pourquoi une décennie de taux bas a-t-elle tué le capital garanti — et pourquoi 2022 l\'a-t-il ressuscité ?',
    questionEn: 'Why did a decade of low rates kill the capital-guaranteed product — and why did 2022 resurrect it?',
    plan: [
      'Poser le canal unique : ZC = 100 × e^(−rT) — quand r tend vers zéro, la garantie mange tout le nominal',
      'Chiffrer les deux mondes : à 0,5 %, budget 1,47 et participation 7,8 % — invendable ; à 3 %, 53 % ; à 5 %, 72,5 %',
      'Raconter la conséquence de structure : l\'épargne migre vers les formules où le client VEND des options — reverse convertibles, autocalls',
      'Conclure sur 2022-2023 : la BCE passe de −0,5 % à 4 % en dix-huit mois, le zéro-coupon retombe, les capitals garantis réapparaissent — parfois au-delà de 100 % de participation',
    ],
    planEn: [
      'State the single channel: ZC = 100 × e^(−rT) — as r goes to zero, the guarantee eats the whole notional',
      'Quantify both worlds: at 0.5%, budget 1.47 and participation 7.8% — unsellable; at 3%, 53%; at 5%, 72.5%',
      'Tell the structural consequence: savings migrate to formulas where the client SELLS options — reverse convertibles, autocalls',
      'Conclude with 2022-2023: the ECB goes from −0.5% to 4% in eighteen months, the zero-coupon falls back, capital-guaranteed products reappear — sometimes above 100% participation',
    ],
    pointsAttendus: [
      'Le canal : taux ↓ ⇒ ZC ↑ ⇒ budget = 100 − ZC − marge ↓ ⇒ participation ↓ — une seule mécanique, aucun mystère',
      'Le chiffre qui tue : à r = 0,5 %, le zéro-coupon 5 ans coûte 97,53 ; une fois la marge servie il reste 1,47 de budget, et la participation tombe à 1,47 / 18,74 = 7,8 % — personne n\'immobilise cinq ans pour 8 % de la hausse',
      'La conséquence historique : la décennie post-2008 (taux zéro puis négatifs de la BCE) fait disparaître le capital garanti des réseaux — le produit n\'était plus fabricable',
      'Le basculement de structure : l\'épargne en quête de rendement migre vers les produits où le client vend de l\'optionnel pour créer du coupon — reverse convertibles et autocalls, le client devient l\'assureur',
      'Le retournement : 2022-2023, l\'inflation revient, la BCE remonte de −0,5 % à 4 % en dix-huit mois — le zéro-coupon passe de près de 98 à moins de 87, et les vitrines raffichent des garantis, parfois à plus de 100 % de participation',
      'La phrase de synthèse : la générosité des produits garantis est un thermomètre des taux longs, pas un exploit d\'ingénierie — la formule p = budget/call convertit la politique monétaire en argument commercial',
    ],
    pointsAttendusEn: [
      'The channel: rates ↓ ⇒ ZC ↑ ⇒ budget = 100 − ZC − margin ↓ ⇒ participation ↓ — one single mechanism, no mystery',
      'The killer number: at r = 0.5%, the 5-year zero-coupon costs 97.53; once the margin is paid, 1.47 of budget remains, and participation falls to 1.47 / 18.74 = 7.8% — nobody locks up five years for 8% of the rise',
      'The historical consequence: the post-2008 decade (ECB zero then negative rates) makes capital guarantee disappear from the networks — the product was no longer manufacturable',
      'The structural shift: yield-hungry savings migrate to products where the client sells optionality to create coupon — reverse convertibles and autocalls, the client becomes the insurer',
      'The turnaround: 2022-2023, inflation returns, the ECB hikes from −0.5% to 4% in eighteen months — the zero-coupon drops from nearly 98 to below 87, and shop windows show guaranteed products again, sometimes above 100% participation',
      'The summary sentence: the generosity of guaranteed products is a thermometer of long rates, not an engineering feat — the formula p = budget/call converts monetary policy into a sales pitch',
    ],
    bonus: [
      'Le second paramètre qui joue en même temps : la volatilité implicite — les meilleurs millésimes combinent taux hauts (gros budget) et vol basse (call bon marché)',
      'Anticiper la relance : « et si les taux remontent après l\'émission ? » — le porteur voit son produit coter sous 100 en cours de vie : le zéro-coupon plonge (duration du module 4), la garantie ne vit qu\'à maturité',
    ],
    bonusEn: [
      'The second parameter playing at the same time: implied volatility — the best vintages combine high rates (big budget) and low vol (cheap call)',
      'Anticipate the follow-up: "what if rates rise after issuance?" — the holder sees his product quote below 100 during its life: the zero-coupon dives (module 4 duration), the guarantee only lives at maturity',
    ],
    reponseModele: `Le canal est unique et tient en une formule : le zéro-coupon qui garantit les 100 coûte **100 × e^(−rT)**. Quand r tend vers zéro, ce prix tend vers 100 : la garantie mange tout le nominal, et le budget d'options — 100 − ZC − marge — devient squelettique, voire négatif une fois la marge servie. Sans budget, pas de calls ; sans calls, pas de participation : la formule garantie n'a plus rien à offrir.

Chiffrons les deux mondes. À r = 0,5 % — le monde 2015-2021 —, le zéro-coupon 5 ans coûte 97,53 ; il reste **1,47** de budget et la participation tombe à 1,47 / 18,74 = **7,8 %** de la hausse. Personne n'immobilise son épargne cinq ans pour cela : le produit n'était plus *fabricable*, et il a disparu des réseaux. À r = 3 %, la participation remonte à 53 % ; à 5 %, à 72,5 %. Entre-temps, l'épargne en quête de rendement a migré vers les formules où le client **vend** de l'optionnel pour créer du coupon — reverse convertibles, autocalls : le grand basculement de la décennie, où l'épargnant est passé d'assuré à assureur sans toujours le savoir.

Puis 2022-2023 : l'inflation revient, la BCE remonte ses taux de −0,5 % à 4 % en dix-huit mois. Le zéro-coupon retombe de près de 98 à moins de 87, tout ce qui n'est plus immobilisé dans la garantie redevient du budget — et les capitals garantis **réapparaissent** dans les vitrines, parfois avec des participations supérieures à 100 %. Aucun génie financier là-dedans : la même division, p = budget / prix du call, avec un autre r.

La chute, en une phrase de synthèse : la générosité des produits garantis est un **thermomètre des taux longs**, pas un exploit d'ingénierie — la formule de participation convertit la politique monétaire en argument commercial.`,
    reponseModeleEn: `The channel is unique and fits in one formula: the zero-coupon guaranteeing the 100 costs **100 × e^(−rT)**. As r goes to zero, that price goes to 100: the guarantee eats the whole notional, and the option budget — 100 − ZC − margin — becomes skeletal, even negative once the margin is paid. No budget, no calls; no calls, no participation: the guaranteed formula has nothing left to offer.

Put numbers on both worlds. At r = 0.5% — the 2015-2021 world — the 5-year zero-coupon costs 97.53; **1.47** of budget remains and participation falls to 1.47 / 18.74 = **7.8%** of the rise. Nobody locks up savings for five years for that: the product was no longer *manufacturable*, and it vanished from the networks. At r = 3%, participation climbs back to 53%; at 5%, to 72.5%. Meanwhile, yield-hungry savings migrated to formulas where the client **sells** optionality to create coupon — reverse convertibles, autocalls: the decade's great shift, where the saver went from insured to insurer, often without knowing it.

Then 2022-2023: inflation returns, the ECB raises rates from −0.5% to 4% in eighteen months. The zero-coupon falls back from nearly 98 to below 87, everything no longer trapped in the guarantee becomes budget again — and capital-guaranteed products **reappear** in the shop windows, sometimes with participations above 100%. No financial genius in that: the same division, p = budget / call price, with another r.

The closing line, as a summary sentence: the generosity of guaranteed products is a **thermometer of long rates**, not an engineering feat — the participation formula converts monetary policy into a sales pitch.`,
  },
  {
    id: 'm9-j-06',
    moduleId: M9,
    theme: 'le reverse convertible',
    themeEn: 'the reverse convertible',
    difficulte: 2,
    question: 'Un reverse convertible affiche 11 % de coupon quand le livret paie 5 %. D\'où sortent les six points d\'écart ?',
    questionEn: 'A reverse convertible shows an 11% coupon while the savings account pays 5%. Where do the six extra points come from?',
    plan: [
      'Démonter le produit : le client prête 100 (zéro-coupon) ET vend un put de strike K — la prime tombe dans la caisse le jour 1',
      'Chiffrer le coupon : disponible = 100 − ZC + prime = 100 − 95,12 + 5,57 = 10,45, capitalisé un an — coupon 10,99 %',
      'Découper le coupon en deux : 5,13 de taux sans risque capitalisé + 5,86 de prime du put capitalisée',
      'Généraliser : tout coupon au-dessus du taux sans risque est le prix d\'un risque vendu — LA grille de lecture du module',
    ],
    planEn: [
      'Dismantle the product: the client lends 100 (zero-coupon) AND sells a put struck at K — the premium lands in the till on day 1',
      'Compute the coupon: available = 100 − ZC + premium = 100 − 95.12 + 5.57 = 10.45, compounded one year — coupon 10.99%',
      'Split the coupon in two: 5.13 of compounded risk-free rate + 5.86 of compounded put premium',
      'Generalise: any coupon above the risk-free rate is the price of a risk sold — THE module\'s reading grid',
    ],
    pointsAttendus: [
      'La décomposition du structureur : zéro-coupon à 95,12 (r = 5 %, 1 an), put ATM Black-Scholes à 5,57 vendu au nom du client — disponible 10,45, capitalisé : coupon 10,99 %',
      'Le découpage qui dit toute la vérité : 10,99 = 5,13 (taux sans risque capitalisé, ce que paierait le même prêt sans risque) + 5,86 (prime de l\'assurance que le client vient de vendre)',
      'La requalification du module 8 : le client croit acheter un placement, il est en réalité vendeur — vendeur d\'assurance contre la baisse de l\'action, le profil primes-régulières-sinistre-rare de l\'assureur',
      'La remise en titres sous le strike : 100/K actions valant S_T — exactement le payoff du vendeur de put, qui « achète » à 100 un titre qui vaut moins',
      'Le desk ne garde pas le risque : il récupère le put du client et le fond dans son book delta-hedgé — la banque fabrique, elle ne parie pas',
      'Le réflexe d\'oral universel : devant tout produit « à 8 % quand les taux sont à 3 % » — où sont les 5 points ? quelle option ai-je vendue sans le savoir ? Il y a toujours une réponse, rarement sur la brochure',
    ],
    pointsAttendusEn: [
      'The structurer\'s decomposition: zero-coupon at 95.12 (r = 5%, 1 year), ATM Black-Scholes put at 5.57 sold on the client\'s behalf — available 10.45, compounded: coupon 10.99%',
      'The split that tells the whole truth: 10.99 = 5.13 (compounded risk-free rate, what the same loan would pay with no risk) + 5.86 (premium of the insurance the client just sold)',
      'The module 8 requalification: the client believes he is buying an investment, he is actually a seller — a seller of insurance against the stock\'s fall, the insurer\'s regular-premiums-rare-loss profile',
      'Physical settlement below the strike: 100/K shares worth S_T — exactly the put seller\'s payoff, "buying" at 100 a stock worth less',
      'The desk keeps no risk: it collects the client\'s put and melts it into its delta-hedged book — the bank manufactures, it does not bet',
      'The universal oral reflex: before any product "at 8% when rates are at 3%" — where are the 5 points? which option did I sell without knowing? There is always an answer, rarely on the brochure',
    ],
    bonus: [
      'Le clin d\'œil de parité (module 8, chapitre 3) : quand S = K = 100, le disponible 100 − K × e^(−rT) + P vaut exactement le prix du call, 10,45 — le client a littéralement troqué la hausse de l\'action contre un coupon',
      'La version à barrière : un put down-and-in à 70 ne vaut que 1,45 au lieu de 5,57 — coupon 6,7 % : la barrière est un curseur commercial, il n\'existe aucun réglage donnant à la fois le gros coupon et la vraie protection',
    ],
    bonusEn: [
      'The parity wink (module 8, chapter 3): when S = K = 100, the available 100 − K × e^(−rT) + P is worth exactly the call price, 10.45 — the client literally traded the stock\'s upside for a coupon',
      'The barrier version: a down-and-in put at 70 is worth only 1.45 instead of 5.57 — coupon 6.7%: the barrier is a commercial dial, no setting gives both the big coupon and the real protection',
    ],
    reponseModele: `Certainement pas de la générosité de la banque — la règle du métier est qu'un produit structuré se price en le **démontant**. Suivez l'argent : le client apporte 100. Le structureur en place une partie en **zéro-coupon** — 95,12 à un an avec r = 5 % — et, au nom du client, **vend un put** de strike 100 sur l'action : la prime, 5,57 par Black-Scholes (vol 20 %), tombe dans la caisse aujourd'hui. Le disponible, 100 − 95,12 + 5,57 = 10,45, capitalisé un an, donne le coupon : 10,45 / 0,9512 = **10,99 %**. Voilà le « 11 % ».

Et ce coupon se laisse découper en deux morceaux qui disent toute la vérité du produit : **10,99 = 5,13 + 5,86**. Le premier morceau, 100 × (e^(0,05) − 1) = 5,13, est ce que paierait le même prêt sans aucun risque — posez prime = 0, c'est tout ce qui reste. Le second est la **prime de l'assurance que le client vient de vendre**. Les six points d'écart avec le livret sont le loyer d'un put.

D'où la relecture du module 8 : le client croit *acheter* un placement, il est en réalité **vendeur** — vendeur d'assurance contre la baisse de l'action. Il encaisse des primes déguisées en coupon et porte le sinistre : sous le strike, la remise en titres lui livre 100/K actions valant S_T — exactement le payoff du vendeur de put. En face, le desk ne garde rien : il récupère le put et le fond dans son book delta-hedgé. La banque fabrique, elle ne parie pas.

La chute, qui est LA grille de lecture du module : **tout coupon au-dessus du taux sans risque est le prix d'un risque vendu**. Devant n'importe quel produit « à 8 % quand les taux sont à 3 % », le réflexe est : où sont les 5 points ? quelle option ai-je vendue sans le savoir ? Il y a toujours une réponse — et elle est rarement sur la brochure.`,
    reponseModeleEn: `Certainly not from the bank's generosity — the trade's rule is that a structured product is priced by **dismantling it**. Follow the money: the client brings 100. The structurer puts part of it into a **zero-coupon** — 95.12 at one year with r = 5% — and, on the client's behalf, **sells a put** struck at 100 on the stock: the premium, 5.57 by Black-Scholes (20% vol), lands in the till today. The available cash, 100 − 95.12 + 5.57 = 10.45, compounded one year, gives the coupon: 10.45 / 0.9512 = **10.99%**. There is the "11%".

And that coupon splits into two pieces that tell the product's whole truth: **10.99 = 5.13 + 5.86**. The first piece, 100 × (e^(0.05) − 1) = 5.13, is what the same loan would pay with no risk at all — set premium = 0, that is all that remains. The second is the **premium of the insurance the client just sold**. The six points above the savings account are the rent of a put.

Hence the module 8 rereading: the client believes he is *buying* an investment, he is actually a **seller** — a seller of insurance against the stock's fall. He collects premiums disguised as a coupon and carries the loss: below the strike, physical settlement delivers 100/K shares worth S_T — exactly the put seller's payoff. Facing him, the desk keeps nothing: it collects the put and melts it into its delta-hedged book. The bank manufactures, it does not bet.

The closing line, which is THE module's reading grid: **any coupon above the risk-free rate is the price of a risk sold**. Before any product "at 8% when rates are at 3%", the reflex is: where are the 5 points? which option did I sell without knowing? There is always an answer — and it is rarely on the brochure.`,
  },
  {
    id: 'm9-j-07',
    moduleId: M9,
    theme: 'le reverse convertible',
    themeEn: 'the reverse convertible',
    difficulte: 3,
    question: 'À l\'échéance de votre reverse convertible (strike 100, coupon 10,99 %), l\'action finit à 70. Que touchez-vous — et le « je perds moins que l\'actionnaire » vous console-t-il ?',
    questionEn: 'At the expiry of your reverse convertible (strike 100, coupon 10.99%), the stock ends at 70. What do you receive — and does "I lose less than the shareholder" console you?',
    plan: [
      'Calculer le flux : remise en titres — une action valant 70 — plus le coupon toujours versé : 80,99 pour 100 investis, soit −19,01',
      'Poser les deux repères : gain plafonné à 10,99 dès que S_T ≥ 100, point mort à 100 − 10,99 ≈ 89',
      'Faire la comparaison demandée : −19 contre −30 pour l\'actionnaire — vrai, c\'est l\'argument commercial, et c\'est l\'anesthésiant',
      'Requalifier : le coupon était le PRIX du risque qui vient de se matérialiser, pas un lot de consolation par-dessus',
    ],
    planEn: [
      'Compute the flow: physical settlement — one share worth 70 — plus the coupon always paid: 80.99 for 100 invested, i.e. −19.01',
      'Set the two markers: gain capped at 10.99 as soon as S_T ≥ 100, break-even at 100 − 10.99 ≈ 89',
      'Make the requested comparison: −19 versus −30 for the shareholder — true, it is the sales pitch, and it is the anaesthetic',
      'Requalify: the coupon was the PRICE of the risk that just materialised, not a consolation prize on top',
    ],
    pointsAttendus: [
      'Le flux exact : sous le strike, remise en titres — 100/K = 1 action valant 70 — plus le coupon 10,99 toujours versé : total 80,99, soit −19,01 pour 100',
      'Le put vendu s\'est exercé contre le porteur : il « achète » à 100 (son nominal) un titre qui en vaut 70',
      'Le gain plafonné : 110,99 au maximum, atteint dès S_T ≥ 100 — toute la distribution des scénarios heureux est écrasée sur un seul chiffre',
      'Le point mort à la manière du module 8 : 100 − 10,99 ≈ 89 — tant que l\'action perd moins que le coupon, le porteur reste gagnant ; en dessous, chaque euro de baisse est pour lui',
      'La comparaison : l\'actionnaire direct perd 30, le porteur 19 — il perd moins, c\'est vrai ; mais l\'actionnaire n\'avait pas plafonné sa hausse à 10,99, lui',
      'La requalification finale : le coupon était le prix du risque — la prime d\'assurance encaissée d\'avance — pas une consolation ; règlement en titres ou en cash : économiquement identique, psychologiquement très différent (l\'illusion « attendre que ça remonte »)',
    ],
    pointsAttendusEn: [
      'The exact flow: below the strike, physical settlement — 100/K = 1 share worth 70 — plus the 10.99 coupon always paid: total 80.99, i.e. −19.01 per 100',
      'The sold put was exercised against the holder: he "buys" at 100 (his notional) a stock worth 70',
      'The capped gain: 110.99 at most, reached as soon as S_T ≥ 100 — the whole distribution of happy scenarios is crushed onto a single number',
      'The break-even, module 8 style: 100 − 10.99 ≈ 89 — as long as the stock loses less than the coupon, the holder stays ahead; below, every euro of decline is his',
      'The comparison: the direct shareholder loses 30, the holder 19 — he loses less, true; but the shareholder had not capped his upside at 10.99',
      'The final requalification: the coupon was the price of the risk — the insurance premium collected upfront — not a consolation; settlement in shares or cash: economically identical, psychologically very different (the "wait for it to come back" illusion)',
    ],
    bonus: [
      'Le client légitime du produit : vue modérément constructive, accepterait de toute façon de devenir actionnaire à ce prix-là, comprend l\'échange hausse contre revenu — « le reverse convertible convient à qui vendrait ce put en connaissance de cause »',
      'Le piège de commercialisation : « coupon garanti » en gros, « capital non garanti » en petit — la hiérarchie des informations inversée : le chiffre certain est le petit, le chiffre incertain est le gros',
    ],
    bonusEn: [
      'The product\'s legitimate client: moderately constructive view, would accept becoming a shareholder at that price anyway, understands the upside-for-income trade — "the reverse convertible suits whoever would sell that put knowingly"',
      'The marketing trap: "guaranteed coupon" in large print, "capital not guaranteed" in small — the information hierarchy inverted: the certain number is the small one, the uncertain number is the big one',
    ],
    reponseModele: `Le flux d'abord. L'action a fini sous le strike : la **remise en titres** s'applique — je reçois 100/K = une action, valant 70 — plus le coupon, versé dans tous les cas : 10,99. Total : **80,99** pour 100 investis, soit −19,01. Le put que j'avais vendu s'est exercé contre moi : j'« achète » à 100, mon nominal, un titre qui en vaut 70. La brochure n'a pas menti — le coupon EST garanti ; c'est mon rendement qui ne l'était pas : coupon plus variation du capital.

Deux repères organisent tous les scénarios, à la manière des points morts du module 8. Le **gain est plafonné** à 10,99, atteint dès que l'action finit au-dessus de 100 : toute la distribution des scénarios heureux est écrasée sur un seul chiffre — la hausse ne m'appartenait plus, je l'avais vendue. Le **point mort** est à 100 − 10,99 ≈ 89 : tant que l'action perd moins que le coupon, je reste gagnant ; en dessous, chaque euro de baisse est pour moi.

« Vous perdez moins que l'actionnaire » — c'est vrai : −19 contre −30. C'est l'argument commercial, et c'est l'anesthésiant. Car la comparaison oublie deux choses : l'actionnaire, lui, n'avait pas plafonné sa hausse à 10,99 ; et surtout, le coupon n'est pas un lot de consolation tombé par-dessus la perte — il était le **prix** du risque qui vient précisément de se matérialiser. J'ai encaissé une prime d'assurance, le sinistre est survenu, je paie : c'est le contrat que j'avais signé, en le sachant ou non.

Une dernière finesse : recevoir des titres plutôt que le cash équivalent — 100 − (K − S_T) — est économiquement identique et psychologiquement très différent : le titre en portefeuille entretient l'illusion qu'« il suffit d'attendre que ça remonte ». La chute : ce produit convient exactement à qui aurait vendu ce put en connaissance de cause — c'est un critère exigeant, et c'est pour cela que la commercialisation dérape si souvent.`,
    reponseModeleEn: `The flow first. The stock ended below the strike: **physical settlement** applies — I receive 100/K = one share, worth 70 — plus the coupon, paid in every case: 10.99. Total: **80.99** for 100 invested, i.e. −19.01. The put I had sold was exercised against me: I "buy" at 100, my notional, a stock worth 70. The brochure did not lie — the coupon IS guaranteed; it is my return that was not: coupon plus capital variation.

Two markers organise every scenario, in the manner of module 8's break-evens. The **gain is capped** at 10.99, reached as soon as the stock ends above 100: the whole distribution of happy scenarios is crushed onto a single number — the upside no longer belonged to me, I had sold it. The **break-even** sits at 100 − 10.99 ≈ 89: as long as the stock loses less than the coupon, I stay ahead; below, every euro of decline is mine.

"You lose less than the shareholder" — true: −19 versus −30. It is the sales pitch, and it is the anaesthetic. Because the comparison forgets two things: the shareholder had not capped his upside at 10.99; and above all, the coupon is not a consolation prize dropped on top of the loss — it was the **price** of the very risk that just materialised. I collected an insurance premium, the claim occurred, I pay: that is the contract I signed, knowingly or not.

One last subtlety: receiving shares rather than the cash equivalent — 100 − (K − S_T) — is economically identical and psychologically very different: the stock in the portfolio feeds the illusion that "you just have to wait for it to come back". The closing line: this product suits exactly whoever would have sold that put knowingly — a demanding criterion, and that is why its marketing derails so often.`,
  },
  {
    id: 'm9-j-08',
    moduleId: M9,
    theme: 'le reverse convertible',
    themeEn: 'the reverse convertible',
    difficulte: 3,
    question: 'Pourquoi dit-on que l\'acheteur de reverse convertible « vend la volatilité au pire moment » — et à qui ce produit convient-il alors ?',
    questionEn: 'Why do we say the reverse convertible buyer "sells volatility at the worst moment" — and who is this product right for, then?',
    plan: [
      'Établir la position : le porteur est économiquement vendeur d\'options — le put embarqué — donc vendeur de volatilité : l\'assureur du module 8, sans le savoir',
      'Poser le paradoxe commercial : le produit se vend par marchés calmes, quand la vol — donc la prime du put — est au plus bas',
      'Dérouler la conséquence : pour tenir la vitrine, le structureur embarque plus de risque — sous-jacent plus volatil, barrière plus haute, échéance plus longue',
      'Répondre à la seconde question : le client légitime a une vue modérément constructive, accepterait d\'être actionnaire au strike, et échange sciemment la hausse contre un revenu',
    ],
    planEn: [
      'Establish the position: the holder is economically an option seller — the embedded put — hence a volatility seller: the module 8 insurer, unknowingly',
      'State the commercial paradox: the product sells well in calm markets, when vol — hence the put premium — is at its lowest',
      'Unroll the consequence: to keep the shop window attractive, the structurer embeds more risk — more volatile underlying, higher barrier, longer maturity',
      'Answer the second question: the legitimate client has a moderately constructive view, would accept becoming a shareholder at the strike, and knowingly trades upside for income',
    ],
    pointsAttendus: [
      'La position réelle du porteur : vendeur de put, donc vendeur de volatilité — le profil d\'assureur du module 8 : primes régulières, sinistre rare et lourd',
      'Le paradoxe : la demande pour ces produits culmine quand tout va bien — marchés calmes, épargnants en quête de rendement — précisément quand la volatilité, donc la prime du put, est au plus bas : le client vend son assurance au moment où elle rapporte le moins',
      'La mécanique de compensation : prime maigre + coupon flatteur à afficher = risque à embarquer ailleurs — action « à histoire » plutôt qu\'indice, barrière remontée (à 80, put 3,82 et coupon 9,1 % contre 1,45 et 6,7 % à 70), échéance allongée',
      'La phrase de synthèse : la générosité apparente du coupon est un thermomètre du risque embarqué — le module 8 disait la même chose des primes d\'options, c\'était juste moins bien emballé',
      'Le client légitime : vue modérément constructive (l\'action ne s\'effondrera pas), accepterait de toute façon de devenir actionnaire à ce prix-là, comprend qu\'il échange le potentiel de hausse contre un revenu',
      'Le critère de desk : « le reverse convertible convient à qui vendrait ce put en connaissance de cause » — exigeant, d\'où les dérapages de commercialisation',
    ],
    pointsAttendusEn: [
      'The holder\'s real position: put seller, hence volatility seller — the module 8 insurer profile: regular premiums, rare and heavy loss',
      'The paradox: demand for these products peaks when everything is fine — calm markets, yield-hungry savers — precisely when volatility, hence the put premium, is at its lowest: the client sells his insurance when it pays the least',
      'The compensation mechanics: thin premium + flattering coupon to display = risk to embed elsewhere — a "story stock" rather than an index, a raised barrier (at 80, put 3.82 and coupon 9.1% versus 1.45 and 6.7% at 70), a longer maturity',
      'The summary sentence: the coupon\'s apparent generosity is a thermometer of the embedded risk — module 8 said the same about option premiums, it was just less well wrapped',
      'The legitimate client: moderately constructive view (the stock will not collapse), would accept becoming a shareholder at that price anyway, understands he trades upside potential for income',
      'The desk criterion: "the reverse convertible suits whoever would sell that put knowingly" — demanding, hence the marketing derailments',
    ],
    bonus: [
      'Où finit le put du client : recyclé dans le book de volatilité de la banque — les desks, acheteurs de puts auprès de leurs clients et vendeurs au marché, portent tous la même position ; quand elle se déboucle, c\'est le même jour dans le même sens (Corée 2015, mars 2020)',
      'La symétrie avec le chapitre 2 : vol chère = mauvais moment pour acheter de la participation, bon moment pour vendre de l\'assurance — le millésime d\'un structuré se lit dans le régime de volatilité de son émission',
    ],
    bonusEn: [
      'Where the client\'s put ends up: recycled into the bank\'s volatility book — desks, buying puts from their clients and selling to the market, all carry the same position; when it unwinds, it is the same day in the same direction (Korea 2015, March 2020)',
      'The symmetry with chapter 2: expensive vol = bad time to buy participation, good time to sell insurance — a structured product\'s vintage reads in the volatility regime of its issuance',
    ],
    reponseModele: `Commençons par la position réelle : le porteur d'un reverse convertible est économiquement **vendeur d'options** — le put embarqué — donc **vendeur de volatilité**. C'est l'assureur du module 8, sans le savoir : des rentrées régulières, un sinistre rare et lourd.

Le paradoxe tient au calendrier de la demande. Ces produits se vendent bien quand les marchés sont **calmes** et que l'épargne cherche du rendement — précisément quand la volatilité, donc la prime du put, est **au plus bas**. Le client vend son assurance au moment exact où elle rapporte le moins. Et pour continuer d'afficher un coupon flatteur avec une prime maigre, le structureur doit aller chercher le rendement ailleurs : un sous-jacent plus volatil — une action « à histoire » plutôt qu'un indice —, une barrière plus haute — à 80, le put down-and-in vaut 3,82 et le coupon 9,1 %, contre 1,45 et 6,7 % à 70 —, une échéance plus longue. Mécaniquement, **la générosité apparente du coupon est un thermomètre du risque embarqué**. Le module 8 disait la même chose des primes d'options ; c'était juste moins bien emballé.

À qui cela convient-il alors ? Le produit a un client légitime, et le critère du desk est précis : l'investisseur qui a une vue **modérément constructive** — l'action ne s'effondrera pas —, qui accepterait de toute façon de **devenir actionnaire à ce prix-là**, et qui comprend qu'il échange le potentiel de hausse contre un revenu. En une phrase : le reverse convertible convient à qui **vendrait ce put en connaissance de cause**. C'est un critère exigeant — et c'est exactement pour cela que la commercialisation dérape si souvent.

La chute : il n'y a rien de honteux à vendre de l'assurance — c'est un service, rémunéré à son prix. Le problème commence quand le vendeur ignore qu'il l'est, et vend au plus bas ce que le marché lui rachètera au plus haut.`,
    reponseModeleEn: `Start with the real position: the holder of a reverse convertible is economically an **option seller** — the embedded put — hence a **volatility seller**. He is the module 8 insurer without knowing it: regular income, a rare and heavy loss.

The paradox lies in the calendar of demand. These products sell well when markets are **calm** and savings chase yield — precisely when volatility, hence the put premium, is **at its lowest**. The client sells his insurance at the exact moment it pays the least. And to keep displaying a flattering coupon with a thin premium, the structurer must find the yield elsewhere: a more volatile underlying — a "story stock" rather than an index —, a higher barrier — at 80, the down-and-in put is worth 3.82 and the coupon 9.1%, versus 1.45 and 6.7% at 70 —, a longer maturity. Mechanically, **the coupon's apparent generosity is a thermometer of the embedded risk**. Module 8 said the same about option premiums; it was just less well wrapped.

Who is it right for, then? The product has a legitimate client, and the desk's criterion is precise: the investor with a **moderately constructive** view — the stock will not collapse —, who would in any case accept **becoming a shareholder at that price**, and who understands he is trading upside potential for income. In one sentence: the reverse convertible suits whoever **would sell that put knowingly**. It is a demanding criterion — and that is exactly why its marketing derails so often.

The closing line: there is nothing shameful about selling insurance — it is a service, paid at its price. The problem starts when the seller does not know he is one, and sells at the bottom what the market will buy back from him at the top.`,
  },
  {
    id: 'm9-j-09',
    moduleId: M9,
    theme: 'l\'autocall',
    themeEn: 'the autocall',
    difficulte: 2,
    question: 'Décomposez-moi un autocall — la mécanique complète, comme si je tenais la term sheet d\'un Athena.',
    questionEn: 'Break down an autocall for me — the complete mechanics, as if I were holding an Athena term sheet.',
    plan: [
      'Nommer les quatre rouages : dates d\'observation annuelles, barrière de rappel à 100 %, coupon à effet mémoire, barrière de protection à 60 % observée à maturité seulement',
      'Dérouler une trajectoire : 93, 97, 108 — deux années blanches, rappel automatique à l\'année 3, le client touche 100 + 7 × 3 = 121',
      'Balayer les quatre destins : rappel an 1 (107), rappel an 3 (121), jamais rappelé au-dessus de 60 (100 sec), sous 60 (48 — la falaise)',
      'Traduire en briques : zéro-coupon + digitales + put down-and-in VENDU par le client — le coupon est la prime de ce put, et le prix s\'estime par Monte-Carlo',
    ],
    planEn: [
      'Name the four gears: annual observation dates, autocall trigger at 100%, memory coupon, 60% protection barrier observed at maturity only',
      'Unroll one path: 93, 97, 108 — two blank years, automatic call at year 3, the client receives 100 + 7 × 3 = 121',
      'Sweep the four fates: called year 1 (107), called year 3 (121), never called above 60 (a dry 100), below 60 (48 — the cliff)',
      'Translate into bricks: zero-coupon + digitals + down-and-in put SOLD by the client — the coupon is that put\'s premium, and the price is estimated by Monte Carlo',
    ],
    pointsAttendus: [
      'Les quatre rouages dans les termes du desk : dates d\'observation (les seuls jours où il se passe quelque chose), barrière de rappel (autocall trigger — remboursement automatique, personne ne décide), coupon à effet mémoire (100 + c × i, les années blanches rattrapées), barrière de protection observée à maturité seulement',
      'Le déroulé canonique : 93 < 100 (rien), 97 < 100 (rien, deux coupons en mémoire), 108 ≥ 100 — rappel, flux unique 121, soit 6,56 % par an composés ; passer sous la barrière de rappel en cours de vie n\'annule rien',
      'La dissymétrie qui fait tout le produit : pour gagner, il suffit d\'être UNE fois au niveau initial à une date anniversaire ; pour perdre, il faut ne l\'avoir jamais été ET finir 40 % plus bas',
      'La clause de maturité EST un put down-and-in vendu par le client — strike au niveau initial, barrière 60 % : c\'est là que loge le rendement, comme au chapitre 3',
      'La falaise : à 60,01 le client touche 100, à 59,99 il touche 59,99 — un point d\'indice sépare deux mondes ; et le scénario « capital sauf » cache cinq ans de rendement zéro',
      'Le pricing : aucune formule fermée — le flux dépend de toute la trajectoire ; prix = espérance risque-neutre actualisée, estimée par Monte-Carlo : environ 98,0 avec le coupon de 7 %, coupon équitable 8,65 % — l\'écart est la marge',
    ],
    pointsAttendusEn: [
      'The four gears in desk terms: observation dates (the only days when anything happens), autocall trigger (automatic redemption, nobody decides), memory coupon (100 + c × i, blank years caught up), protection barrier observed at maturity only',
      'The canonical run: 93 < 100 (nothing), 97 < 100 (nothing, two coupons in memory), 108 ≥ 100 — called, single flow 121, i.e. 6.56% per year compounded; dipping below the trigger during the life cancels nothing',
      'The asymmetry that makes the whole product: to win, being at the initial level ONCE on an anniversary date suffices; to lose, it must never have happened AND the index must end 40% lower',
      'The maturity clause IS a down-and-in put sold by the client — strike at the initial level, 60% barrier: that is where the yield lives, as in chapter 3',
      'The cliff: at 60.01 the client gets 100, at 59.99 he gets 59.99 — one index point separates two worlds; and the "capital safe" scenario hides five years of zero return',
      'The pricing: no closed formula — the flow depends on the whole path; price = discounted risk-neutral expectation, estimated by Monte Carlo: about 98.0 with the 7% coupon, fair coupon 8.65% — the gap is the margin',
    ],
    bonus: [
      'Les deux risques hors formule qui closent une décomposition propre : la signature de l\'émetteur (le produit est une dette) et la marge (valeur d\'émission 97 à 99, publiée au KID)',
      'La vue desk qui annonce le chapitre 5 : le book émetteur est long le put down-and-in du client, long dividendes via ses couvertures, court corrélation sur les worst-of — trois risques que le client ne voit jamais',
    ],
    bonusEn: [
      'The two off-formula risks that close a clean decomposition: the issuer\'s signature (the product is debt) and the margin (issuance value 97 to 99, published in the KID)',
      'The desk view announcing chapter 5: the issuer\'s book is long the client\'s down-and-in put, long dividends through its hedges, short correlation on worst-ofs — three risks the client never sees',
    ],
    reponseModele: `L'Athena — la variante de référence — tient en **quatre rouages**. Les **dates d'observation**, une par an sur cinq ans : les seuls jours où il se passe quelque chose. La **barrière de rappel**, à 100 % du niveau initial : à chaque observation, si l'indice est au niveau initial ou au-dessus, le produit est rappelé — remboursé par anticipation, automatiquement, personne ne décide rien. Le **coupon à effet mémoire** : au rappel à la date i, le client touche 100 + c × i — le coupon de l'année plus tout l'arriéré des années blanches. La **barrière de protection**, à 60 %, observée **à maturité seulement** : jamais rappelé, le client récupère 100 si l'indice finit au-dessus de 60 % — et 100 × S_N/S_0 sinon, la perte entière.

Déroulons : indice à 93, puis 97, puis 108 aux trois premières observations, coupon 7 %. Années 1 et 2 : sous la barrière de rappel, rien — deux coupons dorment en mémoire. Année 3 : 108 ≥ 100, **rappel** — flux unique de 100 + 7 × 3 = **121**, et le produit disparaît. Notez la dissymétrie qui fait tout le produit : pour gagner, il suffit que l'indice soit *une seule fois* au niveau initial à une date anniversaire ; pour perdre, il faut qu'il ne l'ait jamais été *et* qu'il finisse 40 % plus bas. Mais la protection est une **falaise**, pas un amortisseur : à 60,01 le client touche 100, à 59,99 il touche 59,99 — et le scénario « capital sauf » cache cinq ans de rendement zéro.

En briques : un **zéro-coupon** pour le nominal, des **digitales** pour les coupons conditionnels, et un **put down-and-in vendu par le client** — strike au niveau initial, barrière 60 %. C'est là que loge le rendement : le coupon est la prime de cette assurance, exactement comme au reverse convertible.

Le prix, enfin : aucune formule fermée — le flux dépend de toute la trajectoire. On estime l'espérance risque-neutre actualisée par **Monte-Carlo** : avec le coupon de 7 %, environ 98,0 pour un produit vendu 100 — l'écart est la marge ; le coupon équitable serait 8,65 %. Et je terminerais par les deux risques hors formule : la **signature** de l'émetteur — le produit est une dette — et cette marge. Une décomposition qui les oublie est fausse.`,
    reponseModeleEn: `The Athena — the reference variant — runs on **four gears**. The **observation dates**, one per year over five years: the only days when anything happens. The **autocall trigger**, at 100% of the initial level: at each observation, if the index is at or above its initial level, the product is called — redeemed early, automatically, nobody decides anything. The **memory coupon**: when called at date i, the client receives 100 + c × i — the current year's coupon plus all the arrears of the blank years. The **protection barrier**, at 60%, observed **at maturity only**: never called, the client gets 100 back if the index ends above 60% — and 100 × S_N/S_0 otherwise, the entire loss.

Run it: index at 93, then 97, then 108 at the first three observations, 7% coupon. Years 1 and 2: below the trigger, nothing — two coupons sleep in memory. Year 3: 108 ≥ 100, **called** — a single flow of 100 + 7 × 3 = **121**, and the product disappears. Note the asymmetry that makes the whole product: to win, the index need only be at its initial level *once* on an anniversary date; to lose, it must never have been *and* must end 40% lower. But the protection is a **cliff**, not a shock absorber: at 60.01 the client gets 100, at 59.99 he gets 59.99 — and the "capital safe" scenario hides five years of zero return.

In bricks: a **zero-coupon** for the notional, **digitals** for the conditional coupons, and a **down-and-in put sold by the client** — strike at the initial level, 60% barrier. That is where the yield lives: the coupon is the premium of that insurance, exactly as in the reverse convertible.

The price, finally: no closed formula — the flow depends on the whole path. The discounted risk-neutral expectation is estimated by **Monte Carlo**: with the 7% coupon, about 98.0 for a product sold at 100 — the gap is the margin; the fair coupon would be 8.65%. And I would close with the two off-formula risks: the issuer's **signature** — the product is debt — and that margin. A decomposition that forgets them is wrong.`,
  },
  {
    id: 'm9-j-10',
    moduleId: M9,
    theme: 'l\'autocall',
    themeEn: 'the autocall',
    difficulte: 3,
    question: 'Deux autocalls identiques, l\'un pricé à 20 % de volatilité, l\'autre à 25 % : le second offre 11,6 % au lieu de 8,65 %. La banque est-elle devenue généreuse ?',
    questionEn: 'Two identical autocalls, one priced at 20% volatility, the other at 25%: the second offers 11.6% instead of 8.65%. Has the bank turned generous?',
    plan: [
      'Poser la phrase du desk : le coupon n\'est pas choisi, il est résolu — tel que prix + marge = 100, avec les paramètres de marché du jour',
      'Dérouler le canal : vol ↑ ⇒ le put down-and-in vendu par le client vaut plus cher (vega, module 8) ⇒ plus de disponible ⇒ coupon offert plus élevé',
      'Montrer la contrepartie qui voyage avec : la probabilité de finir sous la barrière passe de 2,9 % à 7,9 % puis 13 % (vol 15/20/25 %)',
      'Conclure : le coupon est une cote de marché déguisée en promesse commerciale — un thermomètre du risque, pas une opportunité',
    ],
    planEn: [
      'State the desk\'s sentence: the coupon is not chosen, it is solved — such that price + margin = 100, with the day\'s market parameters',
      'Unroll the channel: vol ↑ ⇒ the down-and-in put sold by the client is worth more (vega, module 8) ⇒ more cash available ⇒ higher offered coupon',
      'Show the counterpart travelling with it: the probability of ending below the barrier goes from 2.9% to 7.9% then 13% (vol 15/20/25%)',
      'Conclude: the coupon is a market quote disguised as a commercial promise — a risk thermometer, not an opportunity',
    ],
    pointsAttendus: [
      'La résolution du coupon : le desk ne « propose » pas 7 ou 11 % — il résout c tel que prix(c) + marge = 100, avec vol, taux et dividendes attendus du jour',
      'Le canal de la volatilité : vol plus haute ⇒ le put down-and-in que vend le client vaut plus cher ⇒ plus de disponible ⇒ coupon équitable de 6,1 % (vol 15 %) à 8,65 % (20 %) puis 11,6 % (25 %)',
      'Le tableau que le client ne voit jamais côte à côte : probabilité de perte en capital de 2,9 %, 7,9 %, 13 % aux mêmes niveaux de vol — le coupon monte exactement quand le risque monte',
      'Pourquoi deux émissions à six mois d\'écart affichent des coupons différents : le coupon est une cote de marché — quand il monte, ce n\'est pas la banque qui devient généreuse, c\'est le risque vendu par le client qui vaut plus cher',
      'La subtilité de la vol sur le rappel : une vol plus haute rend le rappel précoce MOINS probable — les trajectoires s\'écartent du niveau initial dans les deux sens',
      'La conclusion : à prix de marché, il n\'y a pas de coupon gratuit — seulement des risques plus ou moins visibles',
    ],
    pointsAttendusEn: [
      'The coupon solving: the desk does not "offer" 7 or 11% — it solves c such that price(c) + margin = 100, with the day\'s vol, rates and expected dividends',
      'The volatility channel: higher vol ⇒ the down-and-in put the client sells is worth more ⇒ more cash available ⇒ fair coupon from 6.1% (15% vol) to 8.65% (20%) then 11.6% (25%)',
      'The table the client never sees side by side: probability of capital loss of 2.9%, 7.9%, 13% at the same vol levels — the coupon rises exactly when the risk rises',
      'Why two issues six months apart show different coupons: the coupon is a market quote — when it rises, the bank is not turning generous, the risk sold by the client is getting dearer',
      'The vol subtlety on the call: higher vol makes early redemption LESS likely — paths spread away from the initial level in both directions',
      'The conclusion: at market prices, there is no free coupon — only risks more or less visible',
    ],
    bonus: [
      'Les deux autres carburants du coupon, même logique : les dividendes attendus (forward plus bas ⇒ barrière plus menacée ⇒ put plus cher) et la décorrélation sur worst-of (le pire s\'enfonce ⇒ put plus cher)',
      'Anticiper la relance : « alors pourquoi le client signe-t-il ? » — parce qu\'il compare des coupons entre eux, jamais des probabilités de perte : le tableau coupon/risque n\'est imprimé côte à côte sur aucune brochure',
    ],
    bonusEn: [
      'The coupon\'s two other fuels, same logic: expected dividends (lower forward ⇒ more threatened barrier ⇒ dearer put) and decorrelation on worst-ofs (the worst sinks ⇒ dearer put)',
      'Anticipate the follow-up: "then why does the client sign?" — because he compares coupons with each other, never probabilities of loss: the coupon/risk table is printed side by side on no brochure',
    ],
    reponseModele: `Non — et la phrase du desk répond à elle seule : **le coupon n'est pas choisi, il est résolu**. Le desk ne « propose » pas 8,65 ou 11,6 % : il résout le coupon tel que prix + marge = 100, avec les paramètres de marché du jour — volatilité, taux, dividendes attendus. Deux autocalls émis à six mois d'écart sur le même indice affichent des coupons différents pour la même raison que deux obligations émises à six mois d'écart paient des taux différents : le coupon est une **cote de marché** déguisée en promesse commerciale.

Le canal, ensuite. Le rendement de l'autocall vient du put down-and-in que le client vend. Une volatilité plus haute renchérit ce put — c'est le vega du module 8 — donc gonfle le disponible, donc le coupon offert : 6,1 % à 15 % de vol, 8,65 % à 20 %, 11,6 % à 25 %. Quand le coupon proposé monte, ce n'est pas la banque qui devient généreuse — **c'est le risque vendu par le client qui vaut plus cher**.

Et la contrepartie voyage avec, dans le tableau que le client ne voit jamais côte à côte : aux mêmes niveaux de vol, la probabilité de finir sous la barrière de protection passe de 2,9 % à 7,9 % puis **13 %**. Le coupon est un thermomètre : il monte exactement quand le risque monte. Petite subtilité au passage : la vol haute rend aussi le rappel précoce *moins* probable — les trajectoires s'écartent du niveau initial dans les deux sens — donc le produit s'allonge en moyenne, dans les scénarios mêmes où il fait mal.

La chute : à prix de marché, il n'y a pas de coupon gratuit — seulement des risques plus ou moins visibles. La bonne réaction devant 11,6 % n'est pas « c'est mieux que 8,65 % » mais « qu'est-ce que le marché sait de ce sous-jacent pour payer mon assurance aussi cher ? ».`,
    reponseModeleEn: `No — and the desk's sentence answers by itself: **the coupon is not chosen, it is solved**. The desk does not "offer" 8.65 or 11.6%: it solves the coupon such that price + margin = 100, with the day's market parameters — volatility, rates, expected dividends. Two autocalls issued six months apart on the same index show different coupons for the same reason two bonds issued six months apart pay different rates: the coupon is a **market quote** disguised as a commercial promise.

The channel, next. The autocall's yield comes from the down-and-in put the client sells. Higher volatility makes that put dearer — module 8's vega — hence swells the available cash, hence the offered coupon: 6.1% at 15% vol, 8.65% at 20%, 11.6% at 25%. When the offered coupon rises, the bank is not turning generous — **the risk sold by the client is getting dearer**.

And the counterpart travels with it, in the table the client never sees side by side: at the same vol levels, the probability of ending below the protection barrier goes from 2.9% to 7.9% then **13%**. The coupon is a thermometer: it rises exactly when the risk rises. A subtlety in passing: high vol also makes early redemption *less* likely — paths spread away from the initial level in both directions — so the product lengthens on average, in the very scenarios where it hurts.

The closing line: at market prices, there is no free coupon — only risks more or less visible. The right reaction to 11.6% is not "better than 8.65%" but "what does the market know about this underlying, to pay so much for my insurance?".`,
  },
  {
    id: 'm9-j-11',
    moduleId: M9,
    theme: 'l\'autocall',
    themeEn: 'the autocall',
    difficulte: 3,
    question: 'Quelle est la durée d\'un autocall « 5 ans » ?',
    questionEn: 'What is the duration of a "5-year" autocall?',
    plan: [
      'Répondre d\'emblée : personne ne la connaît — pas même la banque ; elle est aléatoire entre 1 et 5 ans',
      'Chiffrer la distribution : 52 % rappelés dès l\'an 1, 65 % en cumulé à deux ans, 22 % vont au bout — vie moyenne 2,4 ans (et environ 62 % dès l\'an 1 en monde réel)',
      'Nommer la perversité : court quand le marché monte (il faut se replacer plus haut), long quand il baisse (collé, sans coupon)',
      'Donner la formulation propre d\'oral : « un produit d\'une durée aléatoire entre 1 et 5 ans, courte si le marché monte, longue s\'il baisse »',
    ],
    planEn: [
      'Answer upfront: nobody knows it — not even the bank; it is random between 1 and 5 years',
      'Quantify the distribution: 52% called at year 1, 65% cumulative by year two, 22% go the distance — average life 2.4 years (and about 62% at year 1 in the real world)',
      'Name the perversity: short when the market rises (you must reinvest higher), long when it falls (stuck, without coupons)',
      'Give the clean oral phrasing: "a product of random duration between 1 and 5 years, short if the market rises, long if it falls"',
    ],
    pointsAttendus: [
      'Ni durée probable, ni durée garantie : sur 200 000 trajectoires risque-neutres, 52 % des produits sont rappelés dès la première observation, 13 % à la deuxième, 22 % seulement vont à maturité — vie moyenne 2,4 ans pour un produit affiché « 5 ans »',
      'Le monde réel est plus expéditif encore : sous une dérive historique des actions d\'environ 8 %, la probabilité de rappel dès l\'an 1 monte vers 60 à 68 % — la grande majorité des autocalls meurent jeunes, et heureux',
      'La duration perverse : le produit est rappelé quand le marché monte — le client récupère capital et coupons précisément quand il faut se replacer plus haut ; il s\'allonge quand le marché baisse — le client reste collé, sans coupon, dans les scénarios où il voudrait sortir',
      'La machine à re-souscription : chaque rappel ramène le client chez le conseiller, qui propose un nouvel autocall — avec une nouvelle marge',
      'La faute à débusquer : « c\'est un placement à 5 ans » décrit la queue de la distribution (22 %) comme si c\'était le centre',
      'L\'effet mémoire ne change pas le rendement : 7 % par an quel que soit le scénario de rappel — il rattrape les années blanches, il n\'améliore rien',
    ],
    pointsAttendusEn: [
      'Neither probable nor guaranteed duration: on 200,000 risk-neutral paths, 52% of products are called at the first observation, 13% at the second, only 22% reach maturity — average life 2.4 years for a product labelled "5 years"',
      'The real world is even more expeditious: under a historical equity drift of about 8%, the probability of a year-1 call rises to 60-68% — the vast majority of autocalls die young, and happy',
      'The perverse duration: the product is called when the market rises — the client gets capital and coupons back precisely when he must reinvest higher; it lengthens when the market falls — the client is stuck, couponless, in the scenarios where he would want out',
      'The re-subscription machine: every call brings the client back to the advisor, who offers a new autocall — with a new margin',
      'The mistake to flush out: "it is a 5-year investment" describes the tail of the distribution (22%) as if it were the centre',
      'The memory effect does not change the return: 7% per year whatever the call scenario — it catches up blank years, it improves nothing',
    ],
    bonus: [
      'La conséquence desk : des books calibrés sur des durées courtes — quand le marché chute, tous les produits s\'allongent en même temps et les couvertures doivent être étendues au pire moment (mars 2020)',
      'Le contraste avec la duration obligataire du module 4 : là-bas une sensibilité calculable ; ici une durée qui dépend du scénario — et toujours dans le mauvais sens pour le porteur',
    ],
    bonusEn: [
      'The desk consequence: books calibrated on short lives — when the market falls, every product lengthens at once and hedges must be extended at the worst moment (March 2020)',
      'The contrast with module 4 bond duration: there, a computable sensitivity; here, a life that depends on the scenario — and always the wrong way for the holder',
    ],
    reponseModele: `Personne ne la connaît — pas même la banque. C'est la bonne réponse, et elle se chiffre. Sur 200 000 trajectoires risque-neutres de l'Athena canonique : **52 %** des produits sont rappelés dès la première observation, 13 % à la deuxième — 65 % en cumulé à deux ans — et **22 % seulement** vont jusqu'à maturité. La durée de vie moyenne ressort à **2,4 ans** pour un produit affiché « 5 ans ». Et le monde réel est plus expéditif encore : sous une dérive historique des actions de l'ordre de 8 %, le rappel dès l'an 1 monte vers 60 à 68 % — la grande majorité des autocalls meurent jeunes, et heureux.

Cette **duration incertaine** est une propriété de structure, et elle est perverse. Le produit est rappelé quand le marché monte : le client récupère capital et coupons précisément quand il faut se replacer *plus haut* — et le conseiller lui propose un nouvel autocall, avec une nouvelle marge : la machine à coupons est aussi une machine à re-souscription. Symétriquement, le produit s'allonge quand le marché baisse : le client reste collé, sans coupon, dans les scénarios où il aurait voulu sortir. **Court quand tout va bien, long quand tout va mal** : la duration qui se comporte comme le pire des amis.

D'où la double faute de la présentation « c'est un placement à 5 ans » : ce n'est ni une durée probable — l'espérance est à 2,4 ans, plus d'un produit sur deux meurt à un an — ni une durée garantie — 22 % vont au bout. C'est décrire la queue de la distribution comme si c'était le centre.

La formulation propre à l'oral : « un produit d'une durée **aléatoire entre 1 et 5 ans**, courte si le marché monte, longue s'il baisse ». Et une remarque pour finir : le coupon annualisé du meilleur scénario est le même quelle que soit la sortie — 7 % par an ; l'effet mémoire ne fait que rattraper les années blanches, il n'améliore rien.`,
    reponseModeleEn: `Nobody knows it — not even the bank. That is the right answer, and it can be quantified. On 200,000 risk-neutral paths of the canonical Athena: **52%** of products are called at the very first observation, 13% at the second — 65% cumulative by year two — and only **22%** reach maturity. The average life comes out at **2.4 years** for a product labelled "5 years". And the real world is even more expeditious: under a historical equity drift of around 8%, the year-1 call rises to 60-68% — the vast majority of autocalls die young, and happy.

This **uncertain duration** is a structural property, and it is perverse. The product is called when the market rises: the client gets his capital and coupons back precisely when he must reinvest *higher* — and the advisor offers him a new autocall, with a new margin: the coupon machine is also a re-subscription machine. Symmetrically, the product lengthens when the market falls: the client is stuck, couponless, in the scenarios where he would have wanted out. **Short when all goes well, long when all goes wrong**: the duration that behaves like the worst of friends.

Hence the double fault of the pitch "it is a 5-year investment": it is neither a probable duration — the expectation is 2.4 years, more than one product in two dies at one year — nor a guaranteed one — 22% go the distance. It describes the tail of the distribution as if it were the centre.

The clean oral phrasing: "a product of **random duration between 1 and 5 years**, short if the market rises, long if it falls". And a final remark: the annualised coupon of the best scenario is the same whatever the exit — 7% per year; the memory effect merely catches up the blank years, it improves nothing.`,
  },
  {
    id: 'm9-j-12',
    moduleId: M9,
    theme: 'barrières, worst-of, corrélation',
    themeEn: 'barriers, worst-of, correlation',
    difficulte: 2,
    question: 'Qu\'est-ce qu\'un put down-and-in — et pourquoi vaut-il toujours moins cher que le put vanille de mêmes strike et maturité ?',
    questionEn: 'What is a down-and-in put — and why is it always worth less than the vanilla put of same strike and maturity?',
    plan: [
      'Définir : un put vanille qui n\'existe pas encore — il ne naît que si le sous-jacent a touché une barrière B sous le niveau initial : payoff = max(K − S_T, 0) × indicatrice{min ≤ B}',
      'Donner l\'argument sans modèle : payoff inférieur ou égal à celui de la vanille sur chaque trajectoire ⇒ prix inférieur ou égal — et à B = K, le DIP redevient exactement la vanille',
      'Chiffrer l\'échelle : 5,59 / 5,40 / 3,82 / 1,45 / 0,24 pour B = 100 / 90 / 80 / 70 / 60 — vanille 5,57',
      'Souligner le détail qui vaut cher : une barrière est un niveau PLUS une fréquence d\'observation — le même DIP à 60 vaut 0,136 observé à l\'échéance seule et 0,236 en quotidien',
    ],
    planEn: [
      'Define: a vanilla put that does not exist yet — it is only born if the underlying has touched a barrier B below the initial level: payoff = max(K − S_T, 0) × indicator{min ≤ B}',
      'Give the model-free argument: payoff less than or equal to the vanilla\'s on every path ⇒ price less than or equal — and at B = K, the DIP becomes exactly the vanilla again',
      'Quantify the ladder: 5.59 / 5.40 / 3.82 / 1.45 / 0.24 for B = 100 / 90 / 80 / 70 / 60 — vanilla 5.57',
      'Underline the detail worth money: a barrier is a level PLUS an observation frequency — the same DIP at 60 is worth 0.136 observed at expiry only and 0.236 daily',
    ],
    pointsAttendus: [
      'La définition et la formule : DIP_T = max(K − S_T, 0) × indicatrice{min de la trajectoire ≤ B} — un put qui doit « naître » en touchant la barrière, sinon il expire sans avoir existé, même si le sous-jacent finit sous le strike',
      'L\'argument de dominance, sans aucun modèle : trajectoire par trajectoire, le DIP paie la même chose que la vanille (barrière touchée) ou zéro (barrière jamais touchée) — un actif qui paie moins partout vaut moins aujourd\'hui',
      'Le cas limite B = K : tout payoff positif implique S_T < K = B, or le minimum est sous le point d\'arrivée — la barrière est forcément touchée dès que le put paie : le DIP redevient exactement la vanille (test de cohérence du pricer)',
      'L\'échelle des prix (Monte-Carlo, 200 000 trajectoires) : 5,59 / 5,40 / 3,82 / 1,45 / 0,24 pour des barrières de 100 à 60 — à 60, vingt fois moins que la vanille : presque toute la valeur d\'un put vient de scénarios où le sous-jacent ne s\'effondre pas de 40 %',
      'La fréquence d\'observation fait partie du prix : à l\'échéance seule 0,136, mensuelle 0,186, quotidienne 0,236 — +73 % ; la barrière continue vaut plus encore : chaque date ajoutée est une occasion de plus de surprendre le sous-jacent sous la barrière',
      'L\'usage structuré : c\'est la brique de la protection conditionnelle — le client la VEND dans l\'autocall et le reverse convertible à barrière ; recyclée en coupon, la prime de 0,24 à barrière 60 ne rapporte qu\'un quart de point au-dessus du taux sans risque — d\'où le worst-of qui suit',
    ],
    pointsAttendusEn: [
      'The definition and formula: DIP_T = max(K − S_T, 0) × indicator{path minimum ≤ B} — a put that must be "born" by touching the barrier, otherwise it expires without ever having existed, even if the underlying ends below the strike',
      'The dominance argument, with no model at all: path by path, the DIP pays the same as the vanilla (barrier touched) or zero (barrier never touched) — an asset that pays less everywhere is worth less today',
      'The limit case B = K: any positive payoff implies S_T < K = B, and the minimum sits below the endpoint — the barrier is necessarily touched whenever the put pays: the DIP becomes exactly the vanilla again (a pricer consistency test)',
      'The price ladder (Monte Carlo, 200,000 paths): 5.59 / 5.40 / 3.82 / 1.45 / 0.24 for barriers from 100 down to 60 — at 60, twenty times less than the vanilla: almost all of a put\'s value comes from scenarios where the underlying does not collapse 40%',
      'Observation frequency is part of the price: at expiry only 0.136, monthly 0.186, daily 0.236 — +73%; the continuous barrier is worth more still: every added date is one more chance to catch the underlying below the barrier',
      'The structured use: it is the brick of conditional protection — the client SELLS it in the autocall and the barrier reverse convertible; recycled into coupon, the 0.24 premium at barrier 60 yields only a quarter point above the risk-free rate — hence the worst-of that follows',
    ],
    bonus: [
      'La parité in/out : à strike et barrière identiques, down-and-in + down-and-out = put vanille — chaque trajectoire active exactement l\'une des deux : une parité d\'arbitrage de plus',
      'Le réflexe term sheet : entre deux autocalls au coupon identique, celui dont la barrière s\'observe en continu fait vendre au client un put plus cher — le coupon égal cache un risque supérieur',
    ],
    bonusEn: [
      'The in/out parity: at identical strike and barrier, down-and-in + down-and-out = vanilla put — each path activates exactly one of the two: one more arbitrage parity',
      'The term-sheet reflex: between two autocalls with identical coupons, the one whose barrier is observed continuously makes the client sell a dearer put — the equal coupon hides a higher risk',
    ],
    reponseModele: `Le put down-and-in — DIP — est un put vanille **qui n'existe pas encore à la signature** : il ne « naît » que si le sous-jacent touche une barrière B fixée sous le niveau initial, à un moment quelconque de la vie du produit. Son payoff s'écrit max(K − S_T, 0) × indicatrice{min de la trajectoire ≤ B} : si la barrière n'a jamais été touchée, il expire sans avoir existé — même si le sous-jacent finit sous le strike.

Pourquoi vaut-il toujours moins que la vanille ? L'argument n'a besoin d'**aucun modèle** : comparez trajectoire par trajectoire. Barrière touchée, les deux paient la même chose ; jamais touchée, le DIP paie zéro là où la vanille pouvait payer. Le payoff du DIP est inférieur ou égal partout — et un actif qui paie moins dans tous les états du monde vaut moins aujourd'hui. Le cas limite verrouille le raisonnement : à B = K, payer exige S_T < K = B, or le minimum d'une trajectoire est sous son point d'arrivée — la barrière est forcément touchée dès que le put paie : le DIP redevient *exactement* la vanille. C'est un des tests de cohérence du pricer.

L'échelle des prix, sur le put canonique (vanille 5,57) : **5,59 / 5,40 / 3,82 / 1,45 / 0,24** pour des barrières de 100 / 90 / 80 / 70 / 60. À barrière 60 — celle de l'autocall — le put vaut vingt fois moins que la vanille : presque toute la valeur d'un put vient de scénarios où le sous-jacent ne s'effondre pas de 40 %. Et un détail qui vaut cher : une barrière est un niveau **plus une fréquence d'observation**. Le même DIP à 60 vaut 0,136 observé à l'échéance seule, 0,236 en clôture quotidienne — 73 % de plus — car chaque date ajoutée est une occasion supplémentaire de surprendre le sous-jacent sous la barrière ; la vraie barrière continue vaut plus encore.

La chute : c'est la brique de toute protection conditionnelle — et dans l'autocall, c'est le client qui la **vend**. Vendue seule sur un indice, elle finance à peine un quart de point de coupon : voilà pourquoi les term sheets ne s'arrêtent jamais là, et empilent maturité, volatilité et worst-of.`,
    reponseModeleEn: `The down-and-in put — DIP — is a vanilla put **that does not exist yet at signature**: it is only "born" if the underlying touches a barrier B set below the initial level, at any moment of the product's life. Its payoff reads max(K − S_T, 0) × indicator{path minimum ≤ B}: if the barrier was never touched, it expires without ever having existed — even if the underlying ends below the strike.

Why is it always worth less than the vanilla? The argument needs **no model at all**: compare path by path. Barrier touched, both pay the same; never touched, the DIP pays zero where the vanilla could pay. The DIP's payoff is less than or equal everywhere — and an asset that pays less in every state of the world is worth less today. The limit case locks the reasoning: at B = K, paying requires S_T < K = B, and a path's minimum sits below its endpoint — the barrier is necessarily touched whenever the put pays: the DIP becomes *exactly* the vanilla again. It is one of the pricer's consistency tests.

The price ladder, on the canonical put (vanilla 5.57): **5.59 / 5.40 / 3.82 / 1.45 / 0.24** for barriers of 100 / 90 / 80 / 70 / 60. At barrier 60 — the autocall's — the put is worth twenty times less than the vanilla: almost all of a put's value comes from scenarios where the underlying does not collapse by 40%. And a detail worth money: a barrier is a level **plus an observation frequency**. The same DIP at 60 is worth 0.136 observed at expiry only, 0.236 at daily close — 73% more — because every added date is one more chance to catch the underlying below the barrier; the true continuous barrier is worth more still.

The closing line: this is the brick of all conditional protection — and in the autocall, it is the client who **sells** it. Sold alone on one index, it barely funds a quarter point of coupon: which is why term sheets never stop there, and stack maturity, volatility and worst-of on top.`,
  },
  {
    id: 'm9-j-13',
    moduleId: M9,
    theme: 'barrières, worst-of, corrélation',
    themeEn: 'barriers, worst-of, correlation',
    difficulte: 3,
    question: 'Une barrière à −40 % : le conseiller dit « quasi sans risque ». Qu\'en dit le desk ?',
    questionEn: 'A barrier at −40%: the advisor says "virtually risk-free". What does the desk say?',
    plan: [
      'Accorder la prémisse : la probabilité est faible — la barrière 60 n\'est touchée que 0,62 % du temps sur nos trajectoires risque-neutres',
      'Renverser : conditionnellement au toucher, la perte moyenne avoisine 40 % du nominal — le client a vendu une assurance catastrophe, pas un petit risque',
      'Décrire la falaise : à 60,01 le produit rembourse 100, à 59,99 il rembourse 59,99 — deux euros de spot, quarante points de nominal ; delta et gamma explosent à l\'approche conjointe de la barrière et de l\'échéance',
      'Conclure côté desk : couvrir exige de traiter des quantités énormes là où le marché est nerveux — d\'où le barrier shift, la barrière décalée de sécurité dans les modèles',
    ],
    planEn: [
      'Concede the premise: the probability is low — the 60 barrier is touched only 0.62% of the time on our risk-neutral paths',
      'Reverse: conditional on touching, the average loss is about 40% of notional — the client sold catastrophe insurance, not a small risk',
      'Describe the cliff: at 60.01 the product repays 100, at 59.99 it repays 59.99 — two euros of spot, forty points of notional; delta and gamma explode as barrier and expiry approach together',
      'Conclude desk-side: hedging requires trading enormous quantities exactly where the market is nervous — hence the barrier shift, the safety-shifted barrier in the models',
    ],
    pointsAttendus: [
      'Le contresens que le produit est conçu pour susciter : probabilité faible ≠ risque faible — la barrière 60 n\'est touchée que 0,62 % du temps, mais conditionnellement au toucher la perte moyenne avoisine 40 % du nominal',
      'La raison du conditionnel : le sous-jacent qui a traversé −40 % ne s\'arrête pas là par politesse — le client a vendu une assurance catastrophe : sinistre rare, sinistre énorme, la vente de puts du module 8 en plus concentré',
      'La lecture de la prime : petite prime (0,24) ne signifie pas petit risque — elle signifie risque improbable : encaisser souvent, perdre énormément une fois, et la moyenne pondérée des deux est la prime',
      'La discontinuité : veille d\'échéance, barrière jamais touchée — à 61, remboursement 100 demain ; à 59, le put naît dans la monnaie et le remboursement tombe vers 59 : deux euros de spot, quarante points de nominal',
      'Les grecques sur la falaise : à l\'approche conjointe de la barrière et de l\'échéance, le delta explose et le gamma avec lui — le cauchemar du delta-hedging du module 8 porté à l\'incandescence',
      'La pratique de desk : pricer avec une barrière décalée (barrier shift), quelques pourcents de sécurité entre la barrière contractuelle et celle du modèle, pour ne pas se faire hacher sur la falaise',
    ],
    pointsAttendusEn: [
      'The misreading the product is designed to invite: low probability ≠ low risk — the 60 barrier is touched only 0.62% of the time, but conditional on touching the average loss is about 40% of notional',
      'The reason for the conditional: an underlying that has crossed −40% does not stop there out of politeness — the client sold catastrophe insurance: rare claim, enormous claim, module 8 put-selling in concentrate',
      'Reading the premium: a small premium (0.24) does not mean a small risk — it means an improbable risk: collect often, lose enormously once, and the weighted average of the two is the premium',
      'The discontinuity: eve of expiry, barrier never touched — at 61, repayment of 100 tomorrow; at 59, the put is born in the money and repayment falls towards 59: two euros of spot, forty points of notional',
      'The Greeks on the cliff: as barrier and expiry approach together, delta explodes and gamma with it — module 8\'s delta-hedging nightmare taken to incandescence',
      'The desk practice: price with a shifted barrier (barrier shift), a few percent of safety between the contractual barrier and the model\'s, to avoid being shredded on the cliff',
    ],
    bonus: [
      'L\'aggravation worst-of : sur deux jumeaux à corrélation 0,5, la même barrière suivie sur la pire performance est touchée 1,25 % du temps au lieu de 0,62 % — et en crise, les corrélations montent',
      'L\'histoire qui incarne la falaise : Corée 2015-2016 — des milliers de produits partageant la même zone de barrières sur le HSCEI, et des desks forcés de rééquilibrer au même endroit dans le même sens',
    ],
    bonusEn: [
      'The worst-of aggravation: on two twins at 0.5 correlation, the same barrier tracked on the worst performance is touched 1.25% of the time instead of 0.62% — and in a crisis, correlations rise',
      'The story that embodies the cliff: Korea 2015-2016 — thousands of products sharing the same barrier zone on the HSCEI, and desks forced to rebalance in the same place in the same direction',
    ],
    reponseModele: `Le desk accorde la prémisse et renverse la conclusion. Oui, la probabilité est faible : sur 200 000 trajectoires risque-neutres, la barrière 60 n'est touchée que **0,62 %** du temps. Mais conditionnellement au toucher, la perte moyenne avoisine **40 % du nominal** — un sous-jacent qui a traversé −40 % ne s'arrête pas là par politesse. Le client n'a pas vendu un petit risque : il a vendu une **assurance catastrophe** — sinistre rare, sinistre énorme —, la vente de puts du module 8 en plus concentré. Petite prime ne signifie pas petit risque : la prime de 0,24 est la moyenne pondérée de « rien » presque toujours et « énorme » une fois.

Ensuite, le desk voit ce que le conseiller ne voit pas : la **falaise**. Le payoff à barrière est discontinu. Veille d'échéance, barrière jamais touchée, sous-jacent à 61 : le produit rembourse 100 demain. Il glisse à 59 : le put naît dans la monnaie, le remboursement tombe vers 59. **Deux euros de spot, quarante points de nominal.** Autour de la barrière, à l'approche de l'échéance, le delta cesse d'être un nombre raisonnable — il explose, et le gamma avec lui : le cauchemar du delta-hedging du module 8 porté à l'incandescence. Couvrir exige de traiter des quantités énormes de sous-jacent précisément là où le marché est nerveux.

La pratique de desk en découle : pricer avec une **barrière décalée** — le *barrier shift*, quelques pourcents de sécurité entre la barrière contractuelle et celle du modèle — pour ne pas se faire hacher sur la falaise. Quand toute une place partage la même zone de barrières, ce risque devient systémique : la Corée 2015-2016 l'a montré grandeur nature.

La chute : « quasi sans risque » confond fréquence et gravité. La phrase juste est : « risque improbable, et dévastateur quand il se réalise » — c'est précisément pour cela qu'on vous le paie.`,
    reponseModeleEn: `The desk concedes the premise and reverses the conclusion. Yes, the probability is low: on 200,000 risk-neutral paths, the 60 barrier is touched only **0.62%** of the time. But conditional on touching, the average loss is about **40% of notional** — an underlying that has crossed −40% does not stop there out of politeness. The client did not sell a small risk: he sold **catastrophe insurance** — rare claim, enormous claim —, module 8 put-selling in concentrate. A small premium does not mean a small risk: the 0.24 premium is the weighted average of "nothing" almost always and "enormous" once.

Next, the desk sees what the advisor does not: the **cliff**. The barrier payoff is discontinuous. Eve of expiry, barrier never touched, underlying at 61: the product repays 100 tomorrow. It slips to 59: the put is born in the money, repayment falls towards 59. **Two euros of spot, forty points of notional.** Around the barrier, as expiry nears, delta stops being a reasonable number — it explodes, and gamma with it: module 8's delta-hedging nightmare taken to incandescence. Hedging requires trading enormous quantities of underlying precisely where the market is nervous.

The desk practice follows: price with a **shifted barrier** — the *barrier shift*, a few percent of safety between the contractual barrier and the model's — to avoid being shredded on the cliff. When a whole market shares the same barrier zone, that risk turns systemic: Korea 2015-2016 demonstrated it full scale.

The closing line: "virtually risk-free" confuses frequency with severity. The correct sentence is: "an improbable risk, devastating when it materialises" — which is precisely why you are being paid for it.`,
  },
  {
    id: 'm9-j-14',
    moduleId: M9,
    theme: 'barrières, worst-of, corrélation',
    themeEn: 'barriers, worst-of, correlation',
    difficulte: 2,
    question: 'Pourquoi un produit worst-of sur trois indices paie-t-il plus qu\'un produit sur un seul ?',
    questionEn: 'Why does a worst-of product on three indices pay more than a product on a single one?',
    plan: [
      'Définir : le produit est indexé sur la PIRE performance du panier — pour que le worst-of monte, il faut que tous montent ; pour qu\'il déçoive, il suffit qu\'un seul trébuche',
      'Nommer le moteur : la dispersion — l\'espérance du minimum est toujours sous le minimum des espérances, et la corrélation règle l\'ampleur du dégât',
      'Chiffrer : le call worst-of sur deux jumeaux passe de 10,43 (ρ = 1, la vanille) à 3,31 (ρ = 0) ; le DIP worst-of double à ρ = 0,5 (0,47 contre 0,24)',
      'Conclure : le supplément de coupon est la prime du risque de dispersion — le client prend position sur un paramètre qu\'il ne sait pas nommer',
    ],
    planEn: [
      'Define: the product is indexed on the WORST performance of the basket — for the worst-of to rise, all must rise; for it to disappoint, one stumbling suffices',
      'Name the engine: dispersion — the expectation of the minimum always sits below the minimum of expectations, and correlation sets the size of the damage',
      'Quantify: the worst-of call on two twins goes from 10.43 (ρ = 1, the vanilla) to 3.31 (ρ = 0); the worst-of DIP doubles at ρ = 0.5 (0.47 versus 0.24)',
      'Conclude: the coupon supplement is the dispersion risk premium — the client takes a position on a parameter he cannot name',
    ],
    pointsAttendus: [
      'La structure défavorable par construction : payoff sur min(S_T⁽¹⁾/S_0⁽¹⁾, S_T⁽²⁾/S_0⁽²⁾) — deux sous-jacents individuellement corrects fabriquent un pire médiocre',
      'Le tableau de la corrélation (jumeaux, vol 20 %, 1 an) : call worst-of à 10,43 / 7,26 / 5,40 / 4,06 / 3,31 pour ρ = 1 / 0,8 / 0,5 / 0,2 / 0 — à ρ = 1 on retrouve la vanille Black-Scholes (10,45), test de cohérence',
      'Les deux faces exploitées par le desk : le call worst-of coûte trois fois moins (participation affichée trois fois plus grosse) ; le DIP worst-of vaut le double à ρ = 0,5 (0,47 contre 0,24, barrière touchée 1,25 % au lieu de 0,62 %) — coupon gonflé',
      'Le raisonnement de diversification est faux là où il compte : la diversification profite à qui touche la moyenne du panier, jamais à qui n\'en touche que le pire — la dispersion enfonce le minimum',
      'En crise, les corrélations montent vers 1 : le scénario qui perce la barrière n\'est pas trois malchances indépendantes, c\'est UN événement systémique — la diversification promise s\'évanouit exactement quand le client comptait dessus',
      'Le nom du supplément : la prime du risque de dispersion — et la corrélation basse embellit la vitrine dans les deux sens, alors que le client compare des coupons, jamais des corrélations',
    ],
    pointsAttendusEn: [
      'The structurally unfavourable design: payoff on min(S_T⁽¹⁾/S_0⁽¹⁾, S_T⁽²⁾/S_0⁽²⁾) — two individually decent underlyings manufacture a mediocre worst',
      'The correlation table (twins, 20% vol, 1 year): worst-of call at 10.43 / 7.26 / 5.40 / 4.06 / 3.31 for ρ = 1 / 0.8 / 0.5 / 0.2 / 0 — at ρ = 1 you recover the Black-Scholes vanilla (10.45), a consistency test',
      'The two faces the desk exploits: the worst-of call costs three times less (displayed participation three times bigger); the worst-of DIP is worth double at ρ = 0.5 (0.47 versus 0.24, barrier touched 1.25% instead of 0.62%) — inflated coupon',
      'The diversification reasoning is wrong where it matters: diversification benefits whoever receives the basket\'s average, never whoever receives only its worst — dispersion sinks the minimum',
      'In a crisis, correlations rise towards 1: the scenario that pierces the barrier is not three independent misfortunes, it is ONE systemic event — the promised diversification vanishes exactly when the client counted on it',
      'The supplement\'s name: the dispersion risk premium — and low correlation flatters the shop window both ways, while the client compares coupons, never correlations',
    ],
    bonus: [
      'La fabrique de la corrélation dans le pricer : Cholesky en dimension 2, z₂ = ρ × z₁ + √(1 − ρ²) × ε — variance 1, corrélation ρ, et ρ = 1 redonne des trajectoires identiques',
      'La conséquence desk : les books, longs des puts worst-of de leurs clients, s\'apprécient quand la corrélation baisse et perdent quand elle monte — structurellement courts de corrélation, les desks d\'autocalls sont les grands acheteurs de corrélation du marché actions',
    ],
    bonusEn: [
      'The correlation factory inside the pricer: Cholesky in dimension 2, z₂ = ρ × z₁ + √(1 − ρ²) × ε — variance 1, correlation ρ, and ρ = 1 gives back identical paths',
      'The desk consequence: books, long their clients\' worst-of puts, appreciate when correlation falls and lose when it rises — structurally short correlation, autocall desks are the equity market\'s great correlation buyers',
    ],
    reponseModele: `Parce que le produit n'est plus indexé sur un indice mais sur la **pire performance** du panier : chaque sous-jacent est ramené à sa performance, et seul le minimum compte. La structure est défavorable par construction : pour que le worst-of monte, il faut que **tous** montent ; pour qu'il déçoive, il suffit qu'**un seul** trébuche. Deux sous-jacents individuellement corrects fabriquent un pire médiocre — l'espérance du minimum est toujours sous le minimum des espérances.

Le paramètre qui règle l'ampleur du dégât est la **corrélation**. Sur deux jumeaux parfaits (mêmes niveaux, mêmes 20 % de vol), le call worst-of vaut 10,43 à ρ = 1 — le « pire des deux » est le sous-jacent lui-même, on retrouve la vanille — puis fond à mesure que la corrélation baisse : 7,26 à 0,8, 5,40 à 0,5, **3,31 à corrélation nulle** — trois fois moins. Plus les sous-jacents vivent chacun leur vie, plus il est probable que l'un déçoive : la dispersion enfonce le minimum. Le desk exploite les deux faces : côté participation, le call worst-of coûte trois fois moins — la vitrine affiche trois fois plus ; côté autocall, le put down-and-in vendu par le client devient un DIP worst-of qui vaut **le double** à ρ = 0,5 (0,47 contre 0,24, barrière touchée 1,25 % au lieu de 0,62 %) — et ce supplément se recycle en coupon.

Le client, lui, raisonne en diversification : « il faudrait que les trois s'effondrent — improbable au cube ». C'est faux deux fois. Par temps calme, la diversification profite à qui touche la *moyenne* du panier, jamais à qui n'en touche que le *pire*. Et par temps de krach, les corrélations **montent vers 1** : le scénario qui perce la barrière n'est pas trois malchances indépendantes, c'est un seul événement systémique, dont la probabilité est celle d'un krach — pas d'un krach au cube. Le panier ne protège jamais celui qui n'en touche que le minimum.

La chute : le supplément de coupon a un nom de salle — la **prime du risque de dispersion**. Le client vient de prendre position sur un paramètre qu'il ne sait pas nommer ; le desk, en face, en est structurellement court, et passe sa vie à racheter de la corrélation.`,
    reponseModeleEn: `Because the product is no longer indexed on one index but on the basket's **worst performance**: each underlying is reduced to its performance, and only the minimum counts. The design is unfavourable by construction: for the worst-of to rise, **all** must rise; for it to disappoint, **one** stumbling suffices. Two individually decent underlyings manufacture a mediocre worst — the expectation of the minimum always sits below the minimum of expectations.

The parameter setting the size of the damage is **correlation**. On two perfect twins (same levels, same 20% vol), the worst-of call is worth 10.43 at ρ = 1 — the "worst of the two" is the underlying itself, you recover the vanilla — then melts as correlation falls: 7.26 at 0.8, 5.40 at 0.5, **3.31 at zero correlation** — three times less. The more the underlyings live their own lives, the likelier one disappoints: dispersion sinks the minimum. The desk exploits both faces: on the participation side, the worst-of call costs three times less — the shop window displays three times more; on the autocall side, the down-and-in put the client sells becomes a worst-of DIP worth **double** at ρ = 0.5 (0.47 versus 0.24, barrier touched 1.25% instead of 0.62%) — and that supplement is recycled into coupon.

The client, though, reasons by diversification: "all three would have to collapse — improbable cubed". Wrong twice. In calm weather, diversification benefits whoever receives the basket's *average*, never whoever receives only its *worst*. And in crash weather, correlations **rise towards 1**: the scenario that pierces the barrier is not three independent misfortunes, it is one single systemic event, whose probability is a crash's — not a crash cubed. The basket never protects the one who only receives its minimum.

The closing line: the coupon supplement has a trading-floor name — the **dispersion risk premium**. The client has just taken a position on a parameter he cannot name; the desk, opposite, is structurally short of it, and spends its life buying correlation back.`,
  },
  {
    id: 'm9-j-15',
    moduleId: M9,
    theme: 'barrières, worst-of, corrélation',
    themeEn: 'barriers, worst-of, correlation',
    difficulte: 3,
    question: 'Qui porte le risque de dividendes dans un autocall — et pourquoi les structureurs adorent les sous-jacents à gros dividendes ?',
    questionEn: 'Who carries the dividend risk in an autocall — and why do structurers love high-dividend underlyings?',
    plan: [
      'Poser le décor : le produit est écrit sur un indice de PRIX, hors dividendes — le client n\'y touche pas',
      'Suivre la couverture : le desk se couvre en forward, F = S × e^((r − q)T) — il encaisse des dividendes que le produit ne reverse pas : structurellement long dividendes',
      'Dérouler le canal pricing : dividendes attendus ↑ ⇒ forward ↓ ⇒ trajectoires risque-neutres abaissées ⇒ barrière percée plus souvent ⇒ DIP vendu plus cher ⇒ coupon affiché plus haut',
      'Répondre : les termes du client sont figés à la signature — c\'est le desk qui porte l\'écart entre dividendes réalisés et anticipés, sur toute la vie du produit ; mars 2020 en a donné la mesure',
    ],
    planEn: [
      'Set the scene: the product is written on a PRICE index, ex-dividends — the client gets none of them',
      'Follow the hedge: the desk hedges with forwards, F = S × e^((r − q)T) — it collects dividends the product does not pass on: structurally long dividends',
      'Unroll the pricing channel: expected dividends ↑ ⇒ forward ↓ ⇒ risk-neutral paths lowered ⇒ barrier pierced more often ⇒ sold DIP dearer ⇒ higher displayed coupon',
      'Answer: the client\'s terms are frozen at signature — the desk carries the gap between realised and anticipated dividends, over the product\'s whole life; March 2020 gave the measure of it',
    ],
    pointsAttendus: [
      'La ligne de term sheet que personne ne lit : sous-jacent = indice de prix, hors dividendes — le client renonce aux dividendes sans le voir',
      'La couverture en forward : F = S × e^((r − q)T) (cash and carry du module 7) — le desk détient l\'action ou le forward et encaisse des dividendes que le produit ne reverse pas : il est structurellement LONG dividendes',
      'Le canal pricing : des dividendes attendus plus élevés abaissent le forward, donc toute la trajectoire risque-neutre — la barrière est percée plus souvent dans le monde du pricing, le DIP vendu par le client vaut plus, le coupon monte',
      'Le goût des structureurs : banques, télécoms, Euro Stoxx 50 — le dividende auquel le client renonce finance le coupon qu\'il touche',
      'Qui porte le risque : pas le client (termes figés à la signature) — le desk, engagé via ses couvertures à terme sur toute la chronique des dividendes des cinq prochaines années',
      'Mars 2020 : annulations massives des dividendes européens sur injonction des régulateurs — les futures de dividendes Euro Stoxx 50 2020-2021 perdent environ la moitié de leur valeur, de l\'ordre de 200 millions d\'euros de pertes par grande maison française',
    ],
    pointsAttendusEn: [
      'The term-sheet line nobody reads: underlying = price index, ex-dividends — the client gives up the dividends without seeing it',
      'The forward hedge: F = S × e^((r − q)T) (module 7 cash and carry) — the desk holds the stock or the forward and collects dividends the product does not pass on: it is structurally LONG dividends',
      'The pricing channel: higher expected dividends lower the forward, hence the whole risk-neutral path — the barrier is pierced more often in the pricing world, the DIP sold by the client is worth more, the coupon rises',
      'The structurers\' taste: banks, telecoms, Euro Stoxx 50 — the dividend the client gives up funds the coupon he receives',
      'Who carries the risk: not the client (terms frozen at signature) — the desk, committed through its forward hedges to the whole dividend chronicle of the next five years',
      'March 2020: massive European dividend cancellations on regulators\' injunction — Euro Stoxx 50 dividend futures for 2020-2021 lose about half their value, around 200 million euros of losses per large French house',
    ],
    bonus: [
      'La trilogie du coupon : volatilité, décorrélation, dividendes — trois paramètres que le client vend ou abandonne sans les nommer, tous recyclés en coupon affiché',
      'La question miroir à anticiper : « et le risque de taux ? » — logé dans le zéro-coupon et les actualisations, géré par la trésorerie et le desk de taux : chaque risque du produit a son propriétaire dans la banque',
    ],
    bonusEn: [
      'The coupon trilogy: volatility, decorrelation, dividends — three parameters the client sells or gives up without naming them, all recycled into the displayed coupon',
      'The mirror question to anticipate: "and the rate risk?" — housed in the zero-coupon and the discounting, managed by treasury and the rates desk: every risk in the product has an owner inside the bank',
    ],
    reponseModele: `Le décor d'abord, sur la ligne de term sheet que personne ne lit : le produit est écrit sur un **indice de prix, hors dividendes**. Le client ne touche pas les dividendes — mais le desk qui couvre le produit, si. Pour tenir un produit de cinq ans, le desk se couvre **en forward** — la mécanique du cash and carry du module 7 — et le forward embarque les dividendes : F = S × e^((r − q)T). Le desk encaisse donc des dividendes que le produit ne reverse pas : il est **structurellement long dividendes**.

De là, le canal de pricing qui explique le goût des structureurs pour les gros payeurs — banques, télécoms, Euro Stoxx 50. Des dividendes attendus plus élevés abaissent le forward, donc toute la trajectoire risque-neutre du sous-jacent : la barrière de protection est percée plus souvent dans le monde du pricing, le put down-and-in vendu par le client vaut plus cher, et le coupon affiché monte. **Le dividende auquel le client renonce finance le coupon qu'il touche** — comme la volatilité, comme la décorrélation : tout se recycle en vitrine.

Qui porte alors le risque si les dividendes *réalisés* dévient des dividendes *anticipés* ? Pas le client : ses termes sont figés à la signature. **Le desk** — engagé via ses couvertures à terme sur toute la chronique des dividendes des cinq prochaines années. Mars 2020 en a donné la mesure : quand régulateurs et entreprises ont annulé les dividendes européens en quelques semaines, les futures de dividendes Euro Stoxx 50 pour 2020 et 2021 ont perdu environ la moitié de leur valeur — la jambe du forward s'est évaporée, pour un coût de l'ordre de 200 millions d'euros par grande maison française, en plus des pertes de volatilité et de corrélation du même trimestre.

La chute : dans un structuré, chaque risque a un propriétaire — le client porte ce qu'il a vendu (la chute, la dispersion), le desk garde ce qui ne se transfère pas. Le dividende est le plus discret de ces risques gardés — et c'est un paramètre de second ordre qui a fait plier des desks entiers.`,
    reponseModeleEn: `The scene first, on the term-sheet line nobody reads: the product is written on a **price index, ex-dividends**. The client receives no dividends — but the desk hedging the product does. To carry a five-year product, the desk hedges **with forwards** — module 7's cash and carry mechanics — and the forward embeds the dividends: F = S × e^((r − q)T). The desk thus collects dividends the product does not pass on: it is **structurally long dividends**.

From there, the pricing channel that explains the structurers' taste for big payers — banks, telecoms, Euro Stoxx 50. Higher expected dividends lower the forward, hence the underlying's whole risk-neutral path: the protection barrier is pierced more often in the pricing world, the down-and-in put sold by the client is worth more, and the displayed coupon rises. **The dividend the client gives up funds the coupon he receives** — like volatility, like decorrelation: everything is recycled into the shop window.

Who then carries the risk if *realised* dividends deviate from *anticipated* ones? Not the client: his terms are frozen at signature. **The desk** — committed through its forward hedges to the entire dividend chronicle of the next five years. March 2020 gave the measure: when regulators and companies cancelled European dividends within weeks, Euro Stoxx 50 dividend futures for 2020 and 2021 lost about half their value — the forward's dividend leg evaporated, at a cost of around 200 million euros per large French house, on top of the volatility and correlation losses of the same quarter.

The closing line: in a structured product, every risk has an owner — the client carries what he sold (the crash, the dispersion), the desk keeps what cannot be transferred. The dividend is the most discreet of those kept risks — and it is a second-order parameter that bent entire desks.`,
  },
  {
    id: 'm9-j-16',
    moduleId: M9,
    theme: 'pricer par Monte-Carlo',
    themeEn: 'pricing by Monte Carlo',
    difficulte: 2,
    question: 'Vos produits à barrière, worst-of, autocall n\'ont pas de formule de prix. Comment le desk les price-t-il quand même ? Expliquez-moi Monte-Carlo comme à un non-quant.',
    questionEn: 'Your barrier, worst-of and autocall products have no pricing formula. How does the desk price them anyway? Explain Monte Carlo to me as to a non-quant.',
    plan: [
      'Poser l\'invariant : le prix reste l\'espérance risque-neutre du payoff, actualisée — le principe du module 8 n\'a pas bougé, seul le calcul change',
      'Diagnostiquer la mort de la formule : dès que le payoff dépend du chemin — minimum de la trajectoire, loi jointe corrélée, dates multiples — l\'intégrale n\'a plus de forme fermée',
      'Dérouler la recette en quatre gestes : simuler des trajectoires risque-neutres, payoffer, moyenner, actualiser — et les deux choix du pas de simulation (drift r, correction −σ²/2)',
      'Verrouiller la confiance : le pricer doit retrouver Black-Scholes sur la vanille (10,4506) avant d\'avoir le droit de pricer autre chose',
    ],
    planEn: [
      'State the invariant: the price remains the discounted risk-neutral expectation of the payoff — the module 8 principle has not moved, only the computation changes',
      'Diagnose the death of the formula: as soon as the payoff depends on the path — path minimum, correlated joint law, multiple dates — the integral has no closed form left',
      'Unroll the four-gesture recipe: simulate risk-neutral paths, compute payoffs, average, discount — and the two choices of the simulation step (drift r, −σ²/2 correction)',
      'Lock in the trust: the pricer must recover Black-Scholes on the vanilla (10.4506) before it earns the right to price anything else',
    ],
    pointsAttendus: [
      'Le principe inchangé depuis le module 8 : prix = espérance risque-neutre actualisée — Black-Scholes intégrait la seule loi de S_T ; la barrière fait intervenir le couple (arrivée, minimum), le worst-of la loi jointe corrélée, l\'autocall toute la suite des observations : la dimension enfle, la forme fermée meurt',
      'Le renversement Monte-Carlo : au lieu d\'intégrer une loi, on la simule — fabriquer des milliers de futurs possibles et compter ; la moyenne converge vers l\'espérance par la loi des grands nombres : aucune intelligence, une force brute admirablement organisée',
      'Le pas de simulation : S_(t+Δt) = S_t × exp[(r − σ²/2)Δt + σ√Δt × z] — le drift est r, le monde risque-neutre, pas la prévision de quiconque ; et il est amputé de σ²/2, la correction de convexité de la lognormale sans laquelle le pricer fabriquerait de l\'arbitrage',
      'La recette en quatre gestes : trajectoires risque-neutres, payoff (la seule ligne qui change d\'un produit à l\'autre), moyenne, actualisation par e^(−rT)',
      'Le test des limites analytiques : le call canonique vaut 10,4506 par Black-Scholes, le moteur donne 10,4500 au million de tirages — et il doit retrouver le put vanille quand la barrière égale le strike, le mono-sous-jacent à corrélation 1',
      'L\'honnêteté sur la précision : l\'erreur décroît en 1/√n — diviser l\'erreur par 10 exige cent fois plus de simulations, donc cent fois plus de temps : la facture qui explique les fermes de calcul',
    ],
    pointsAttendusEn: [
      'The principle unchanged since module 8: price = discounted risk-neutral expectation — Black-Scholes integrated the law of S_T alone; the barrier involves the (endpoint, minimum) pair, the worst-of the correlated joint law, the autocall the whole sequence of observations: the dimension swells, the closed form dies',
      'The Monte Carlo reversal: instead of integrating a law, you simulate it — manufacture thousands of possible futures and count; the average converges to the expectation by the law of large numbers: no intelligence, brute force admirably organised',
      'The simulation step: S_(t+Δt) = S_t × exp[(r − σ²/2)Δt + σ√Δt × z] — the drift is r, the risk-neutral world, nobody\'s forecast; and it is docked by σ²/2, the lognormal convexity correction without which the pricer would manufacture arbitrage',
      'The four-gesture recipe: risk-neutral paths, payoff (the only line that changes from one product to the next), average, discounting by e^(−rT)',
      'The analytical-limits test: the canonical call is worth 10.4506 by Black-Scholes, the engine gives 10.4500 at one million draws — and it must recover the vanilla put when the barrier equals the strike, the single underlying at correlation 1',
      'Honesty about precision: the error decays in 1/√n — dividing the error by 10 requires one hundred times more simulations, hence one hundred times more time: the bill that explains the computing farms',
    ],
    bonus: [
      'La convergence chiffrée (graine 42) : 10,15 / 10,53 / 10,50 / 10,4500 pour mille à un million de tirages — et le test de martingale : la moyenne de 50 000 prix simulés à un an ressort à 105,13, soit 100 × e^(0,05) à l\'erreur statistique près',
      'L\'angle mort distributionnel : la machine ne connaît que le monde qu\'on lui donne — lognormale sans smile, queue gauche trop mince pour une barrière basse : Monte-Carlo résout le problème du calcul, jamais celui du modèle',
    ],
    bonusEn: [
      'The quantified convergence (seed 42): 10.15 / 10.53 / 10.50 / 10.4500 from one thousand to one million draws — and the martingale test: the average of 50,000 simulated one-year prices comes out at 105.13, i.e. 100 × e^(0.05) up to statistical error',
      'The distributional blind spot: the machine only knows the world it is given — a smile-less lognormal, a left tail too thin for a low barrier: Monte Carlo solves the computation problem, never the model problem',
    ],
    reponseModele: `Commençons par ce qui ne change pas : depuis le module 8, **le prix est l'espérance risque-neutre du payoff, actualisée** — ce principe n'a pas bougé d'un millimètre. Ce qui meurt, c'est la formule. Black-Scholes intégrait un payoff qui ne dépendait que du point d'arrivée S_T : une seule loi, une seule intégrale, une forme fermée. Nos produits, eux, dépendent du **chemin** : le put down-and-in fait intervenir le couple (point d'arrivée, minimum de la trajectoire), le worst-of la loi jointe de plusieurs sous-jacents corrélés, l'autocall toute la suite des observations annuelles. À chaque étage, la dimension de l'intégrale enfle — et la forme fermée meurt.

La réponse du desk est d'une brutalité assumée : puisqu'on ne sait plus *calculer* l'espérance, on la **mesure** — on fabrique des milliers de futurs possibles et on compte. La recette tient en **quatre gestes**. Un : simuler des trajectoires risque-neutres — le sous-jacent avance par pas lognormaux, S_(t+Δt) = S_t × exp[(r − σ²/2)Δt + σ√Δt × z], avec deux choix qui sont des points d'oral : le drift est r, pas la prévision de quiconque — on price sous le monde risque-neutre du module 8 —, et il est amputé de σ²/2, la correction de convexité de la lognormale sans laquelle les trajectoires battraient le taux sans risque en moyenne et le pricer fabriquerait de l'arbitrage. Deux : calculer le payoff de chaque trajectoire — la seule ligne qui change d'un produit à l'autre : toute l'exotique tient dans cette ligne. Trois : moyenner — la loi des grands nombres fait converger la moyenne vers l'espérance. Quatre : actualiser par e^(−rT). Aucune intelligence : une force brute admirablement organisée.

Comment fait-on confiance à une machine pareille ? En la braquant d'abord sur ce qu'on **sait** calculer. Le call canonique vaut 10,4506 par Black-Scholes ; le moteur donne 10,15 à mille tirages, 10,50 à cent mille, 10,4500 au million — il converge vers la formule. Et il doit de même retrouver le put vanille quand la barrière égale le strike, le mono-sous-jacent quand la corrélation vaut 1. La phrase d'oral : *on ne fait confiance à la machine sur ce qu'on ne sait pas calculer que parce qu'elle est juste sur ce qu'on sait calculer*.

Reste l'honnêteté sur la précision : l'estimateur est une moyenne d'échantillon, son erreur-type décroît en **1/√n** — diviser l'erreur par 10 exige cent fois plus de simulations, donc cent fois plus de temps. Multipliez par les milliers de positions d'un book, par les grecques, par les scénarios de stress : voilà les fermes de calcul des banques. La chute : Monte-Carlo n'a rien d'un gadget de quant — c'est la machine qui a pricé tous les chiffres de ce module, et sa seule prétention est de compter très vite ce qu'on ne sait plus intégrer.`,
    reponseModeleEn: `Start with what does not change: since module 8, **the price is the discounted risk-neutral expectation of the payoff** — that principle has not moved a millimetre. What dies is the formula. Black-Scholes integrated a payoff that depended only on the endpoint S_T: one law, one integral, one closed form. Our products depend on the **path**: the down-and-in put involves the (endpoint, path minimum) pair, the worst-of the joint law of several correlated underlyings, the autocall the whole sequence of annual observations. At each floor, the dimension of the integral swells — and the closed form dies.

The desk's answer is assumed brutality: since the expectation can no longer be *calculated*, it is **measured** — manufacture thousands of possible futures and count. The recipe holds in **four gestures**. One: simulate risk-neutral paths — the underlying advances by lognormal steps, S_(t+Δt) = S_t × exp[(r − σ²/2)Δt + σ√Δt × z], with two choices that are oral points: the drift is r, nobody's forecast — we price under module 8's risk-neutral world —, and it is docked by σ²/2, the lognormal convexity correction without which paths would beat the risk-free rate on average and the pricer would manufacture arbitrage. Two: compute each path's payoff — the only line that changes from one product to the next: all the exotics live in that line. Three: average — the law of large numbers makes the average converge to the expectation. Four: discount by e^(−rT). No intelligence: brute force admirably organised.

How do you trust such a machine? By pointing it first at what you **can** calculate. The canonical call is worth 10.4506 by Black-Scholes; the engine gives 10.15 at one thousand draws, 10.50 at one hundred thousand, 10.4500 at one million — it converges to the formula. And it must likewise recover the vanilla put when the barrier equals the strike, the single underlying when correlation is 1. The oral sentence: *you only trust the machine on what you cannot calculate because it is right on what you can*.

There remains honesty about precision: the estimator is a sample average, its standard error decays in **1/√n** — dividing the error by 10 requires one hundred times more simulations, hence one hundred times more time. Multiply by the thousands of positions in a book, by the Greeks, by the stress scenarios: there are the banks' computing farms. The closing line: Monte Carlo is no quant gadget — it is the machine that priced every number in this module, and its only claim is to count very fast what can no longer be integrated.`,
  },
  {
    id: 'm9-j-17',
    moduleId: M9,
    theme: 'pricer par Monte-Carlo',
    themeEn: 'pricing by Monte Carlo',
    difficulte: 3,
    question: 'Votre pricer tire ses aléas d\'un générateur à graine figée : même graine, mêmes trajectoires, même prix au bit près. N\'est-ce pas tricher avec le hasard ?',
    questionEn: 'Your pricer draws its randomness from a fixed-seed generator: same seed, same paths, same price to the bit. Isn\'t that cheating with randomness?',
    plan: [
      'Définir : un générateur pseudo-aléatoire — une suite parfaitement déterministe qui imite le hasard, entièrement déterminée par sa valeur initiale, la graine',
      'Retourner l\'accusation : la reproductibilité est une exigence professionnelle, pas une tricherie — trois vertus : audit, comparaisons propres, tests',
      'Illustrer sur les comparaisons : « barrière plus basse ⇒ prix plus bas » ne se démontre proprement qu\'à aléas identiques — sinon la différence observée est un nouveau tirage de bruit',
      'Conclure sur la distinction clé : figer la graine fige l\'échantillon, pas la loi — l\'erreur en 1/√n demeure ; changer de graine ne réduit rien, cela rejoue le même bruit ailleurs',
    ],
    planEn: [
      'Define: a pseudo-random generator — a perfectly deterministic sequence that imitates randomness, entirely determined by its initial value, the seed',
      'Turn the accusation around: reproducibility is a professional requirement, not a cheat — three virtues: audit, clean comparisons, tests',
      'Illustrate on comparisons: "lower barrier ⇒ lower price" can only be demonstrated cleanly on identical randomness — otherwise the observed difference is a fresh draw of noise',
      'Conclude on the key distinction: fixing the seed fixes the sample, not the law — the 1/√n error remains; changing the seed reduces nothing, it replays the same noise elsewhere',
    ],
    pointsAttendus: [
      'La définition exacte : pseudo-aléatoire — une suite déterministe qui imite le hasard ; même graine ⇒ mêmes tirages ⇒ mêmes trajectoires ⇒ même prix, au bit près',
      'L\'audit : le chiffre envoyé au client peut être recalculé à l\'identique des mois plus tard — le pricing devient auditable, une exigence de production, pas un confort',
      'Les comparaisons propres : pour mesurer l\'effet d\'un paramètre ou d\'une modification du code, on rejoue les MÊMES aléas — la différence observée est l\'effet cherché, pas du bruit ; les échelles de prix du module (barrières, corrélations) sont toutes à graine fixée',
      'Les tests : la suite de tests du pricer vérifie des valeurs exactes parce que la graine 42 produit toujours les mêmes trajectoires — un pricer qui n\'a pas passé ses limites analytiques n\'a pas le droit de pricer',
      'La distinction qui fait la bonne copie : la graine fige l\'échantillon, pas la loi — le prix reste entaché de son erreur-type en 1/√n ; changer de graine ne réduit pas l\'erreur, cela rejoue le même niveau de bruit ailleurs',
      'La formule de synthèse : le hasard de production est un hasard en conserve — reproductible, comparable, testable',
    ],
    pointsAttendusEn: [
      'The exact definition: pseudo-random — a deterministic sequence that imitates randomness; same seed ⇒ same draws ⇒ same paths ⇒ same price, to the bit',
      'Audit: the number sent to the client can be recomputed identically months later — pricing becomes auditable, a production requirement, not a comfort',
      'Clean comparisons: to measure the effect of a parameter or a code change, you replay the SAME randomness — the observed difference is the effect you seek, not noise; the module\'s price ladders (barriers, correlations) are all seed-fixed',
      'Tests: the pricer\'s test suite checks exact values because seed 42 always produces the same paths — a pricer that has not passed its analytical limits has no right to price',
      'The distinction that makes a good answer: the seed fixes the sample, not the law — the price still carries its 1/√n standard error; changing the seed does not reduce the error, it replays the same level of noise elsewhere',
      'The summary formula: production randomness is canned randomness — reproducible, comparable, testable',
    ],
    bonus: [
      'Le prolongement grecques : les variables aléatoires communes — la différence de deux pricings à graines indépendantes cumule les variances ; à graines communes, le bruit partagé s\'annule dans la soustraction : c\'est toute la question du delta par bump',
      'Le parallèle produit : l\'app de ce cours fige ses graines pour la même raison que le desk — un exercice, un prix, identiques à chaque visite ; la reproductibilité est une éthique avant d\'être une technique',
    ],
    bonusEn: [
      'The Greeks extension: common random numbers — the difference of two independently-seeded pricings accumulates the variances; with common seeds, the shared noise cancels in the subtraction: that is the whole bump-delta question',
      'The product parallel: this course\'s app fixes its seeds for the same reason as the desk — one exercise, one price, identical at every visit; reproducibility is an ethic before being a technique',
    ],
    reponseModele: `Précisons d'abord ce qu'est ce « hasard ». Les tirages d'un pricer ne sortent pas d'un dé mais d'un générateur **pseudo-aléatoire** : une suite parfaitement déterministe qui imite le hasard, entièrement déterminée par sa valeur initiale — la **graine**. Même graine, mêmes tirages, mêmes trajectoires, même prix, au bit près. Ce n'est pas un défaut caché du système : c'est une propriété choisie.

Car loin d'être une tricherie, cette reproductibilité est une **exigence professionnelle**, pour trois raisons. L'**audit** : le chiffre envoyé au client peut être recalculé à l'identique des mois plus tard — essayez de justifier un prix devant un contrôle si chaque run en donne un autre. Les **comparaisons propres** : pour mesurer l'effet d'un paramètre — une barrière qu'on abaisse, une corrélation qu'on stresse — ou d'une modification du code, on rejoue les *mêmes* aléas ; la différence observée est alors l'effet cherché, pas un nouveau tirage de bruit. Toutes les échelles de ce module — 5,59 / 5,40 / 3,82 / 1,45 / 0,24 sur les barrières — sont des tableaux à graine fixée : sans cela, on comparerait du bruit à du bruit. Les **tests**, enfin : la suite de tests du pricer vérifie des valeurs exactes parce que la graine 42 produit toujours les mêmes trajectoires — et un pricer qui n'a pas passé ses limites analytiques n'a pas le droit de pricer autre chose.

L'objection sérieuse serait : « alors votre prix dépend de la graine ? ». Réponse : oui, comme toute moyenne d'échantillon dépend de l'échantillon — et c'est précisément pour cela qu'un prix Monte-Carlo se donne **avec son erreur-type**, en 1/√n. La graine fige l'*échantillon*, pas la *loi* : changer de graine ne réduit pas l'erreur, cela rejoue le même niveau de bruit ailleurs ; réduire l'erreur exige plus de trajectoires, ou moins de variance par trajectoire. Il n'y a donc aucune triche : la statistique reste entière, seulement domestiquée.

La chute : le hasard de production est un **hasard en conserve** — reproductible pour l'audit, rejouable pour les comparaisons, exact pour les tests. Et la même discipline a un prolongement qui vaut de l'argent : sans graines communes entre deux runs, un delta par bump est du bruit pur — mais c'est une autre question, que j'espère recevoir.`,
    reponseModeleEn: `First, let us specify what this "randomness" is. A pricer's draws do not come from a die but from a **pseudo-random** generator: a perfectly deterministic sequence that imitates randomness, entirely determined by its initial value — the **seed**. Same seed, same draws, same paths, same price, to the bit. That is not a hidden flaw of the system: it is a chosen property.

Because far from being a cheat, this reproducibility is a **professional requirement**, for three reasons. **Audit**: the number sent to the client can be recomputed identically months later — try justifying a price to an inspection if every run gives a different one. **Clean comparisons**: to measure the effect of a parameter — a barrier lowered, a correlation stressed — or of a code change, you replay the *same* randomness; the observed difference is then the effect you seek, not a fresh draw of noise. Every ladder in this module — 5.59 / 5.40 / 3.82 / 1.45 / 0.24 on barriers — is a seed-fixed table: without that, you would be comparing noise to noise. **Tests**, finally: the pricer's test suite checks exact values because seed 42 always produces the same paths — and a pricer that has not passed its analytical limits has no right to price anything else.

The serious objection would be: "so your price depends on the seed?". Answer: yes, as any sample average depends on the sample — and that is precisely why a Monte Carlo price is quoted **with its standard error**, in 1/√n. The seed fixes the *sample*, not the *law*: changing the seed does not reduce the error, it replays the same level of noise elsewhere; reducing the error requires more paths, or less variance per path. So there is no cheating: the statistics remain whole, merely domesticated.

The closing line: production randomness is **canned randomness** — reproducible for audit, replayable for comparisons, exact for tests. And the same discipline has an extension worth money: without common seeds between two runs, a bump delta is pure noise — but that is another question, which I hope to receive.`,
  },
  {
    id: 'm9-j-18',
    moduleId: M9,
    theme: 'pricer par Monte-Carlo',
    themeEn: 'pricing by Monte Carlo',
    difficulte: 3,
    question: 'Monte-Carlo vous donne un prix, mais le desk veut un delta pour se couvrir. Comment l\'obtenez-vous — et pourquoi vos cinq essais donnent-ils 0,33, 0,40, 0,45, 0,53 et 0,83 ?',
    questionEn: 'Monte Carlo gives you a price, but the desk wants a delta to hedge. How do you get it — and why do your five attempts give 0.33, 0.40, 0.45, 0.53 and 0.83?',
    plan: [
      'Poser la méthode : Monte-Carlo n\'a pas de N(d₁) à offrir — bump and reprice : Δ ≈ [V(S₀ + h) − V(S₀)] / h, re-simuler avec un spot décalé de 1 % et prendre la pente',
      'Diagnostiquer les cinq deltas : graines indépendantes — la différence de deux estimations indépendantes cumule leurs variances : erreur-type √2 × 0,15 ≈ 0,21 sur une pente qui vaut 0,64, le bruit est du même ordre que le signal',
      'Donner le remède : les variables aléatoires communes — mêmes graines dans les deux mondes, chaque trajectoire bumpée est la jumelle de sa trajectoire de base, le bruit commun s\'annule dans la soustraction : 0,644 pour un vrai delta de 0,637',
      'Généraliser : « on bumpe le paramètre, jamais le hasard » — la méthode vaut pour toutes les grecques, et la facture (un repricing complet par grecque) explique les fermes de calcul',
    ],
    planEn: [
      'State the method: Monte Carlo has no N(d₁) to offer — bump and reprice: Δ ≈ [V(S₀ + h) − V(S₀)] / h, re-simulate with the spot shifted by 1% and take the slope',
      'Diagnose the five deltas: independent seeds — the difference of two independent estimates accumulates their variances: standard error √2 × 0.15 ≈ 0.21 on a slope worth 0.64, the noise is the same order as the signal',
      'Give the remedy: common random numbers — same seeds in both worlds, each bumped path is the twin of its base path, the shared noise cancels in the subtraction: 0.644 for a true delta of 0.637',
      'Generalise: "bump the parameter, never the randomness" — the method holds for every Greek, and the bill (one full repricing per Greek) explains the computing farms',
    ],
    pointsAttendus: [
      'La méthode universelle : bump and reprice — re-simuler avec S₀ + h (h = 1, un bump de 1 %) et prendre la pente Δ ≈ [V(S₀ + h) − V(S₀)] / h : pas de formule fermée pour le delta d\'un autocall, comme il n\'y en avait pas pour son prix',
      'Le diagnostic des cinq deltas : les deux runs ont été tirés avec des graines INDÉPENDANTES — chaque prix porte son propre bruit, et la différence cumule les variances (module 2)',
      'Le chiffrage qui tue : erreur-type de chaque prix 0,15 à dix mille tirages ⇒ erreur sur la différence √2 × 0,15 ≈ 0,21, sur un vrai delta de N(d₁) = 0,637 — le bruit est du même ordre que le signal : 0,33 à 0,83, inutilisable pour couvrir',
      'Le remède : les variables aléatoires communes (common random numbers) — mêmes graines pour le run de base et le run bumpé : chaque trajectoire bumpée est la jumelle de sa trajectoire de base, le bruit commun s\'annule dans la soustraction, il ne reste que l\'effet du bump — 0,644, très honorable',
      'La règle d\'oral : on bumpe le paramètre, jamais le hasard — et elle vaut pour toutes les grecques : vega par bump de σ, sensibilité dividendes par bump de q, corrélation par bump de ρ',
      'L\'enjeu réel : un delta bruité est un hedge faux — acheter ou vendre les mauvaises quantités coûte du vrai argent ; et chaque grecque exigeant un repricing complet, le book multiplie la facture de calcul',
    ],
    pointsAttendusEn: [
      'The universal method: bump and reprice — re-simulate with S₀ + h (h = 1, a 1% bump) and take the slope Δ ≈ [V(S₀ + h) − V(S₀)] / h: no closed formula for an autocall\'s delta, just as there was none for its price',
      'The five-delta diagnosis: the two runs were drawn with INDEPENDENT seeds — each price carries its own noise, and the difference accumulates the variances (module 2)',
      'The killer arithmetic: standard error of each price 0.15 at ten thousand draws ⇒ error on the difference √2 × 0.15 ≈ 0.21, on a true delta of N(d₁) = 0.637 — the noise is the same order as the signal: 0.33 to 0.83, unusable for hedging',
      'The remedy: common random numbers — same seeds for the base run and the bumped run: each bumped path is the twin of its base path, the shared noise cancels in the subtraction, only the bump effect remains — 0.644, very honourable',
      'The oral rule: bump the parameter, never the randomness — and it holds for every Greek: vega by bumping σ, dividend sensitivity by bumping q, correlation by bumping ρ',
      'The real stake: a noisy delta is a wrong hedge — buying or selling the wrong quantities costs real money; and with each Greek requiring a full repricing, the book multiplies the computing bill',
    ],
    bonus: [
      'Le raffinement d\'ordre supérieur : le gamma par double bump — [V(S₀ + h) − 2V(S₀) + V(S₀ − h)] / h², encore plus sensible au bruit, encore plus dépendant des graines communes',
      'Le pont avec le chapitre 5 : près d\'une barrière à l\'approche de l\'échéance, le delta explose — le bump devient instable même à graines communes, et le desk price avec un barrier shift précisément parce que ses grecques y deviennent infernales',
    ],
    bonusEn: [
      'The higher-order refinement: gamma by double bump — [V(S₀ + h) − 2V(S₀) + V(S₀ − h)] / h², even more noise-sensitive, even more dependent on common seeds',
      'The bridge to chapter 5: near a barrier close to expiry, delta explodes — the bump becomes unstable even with common seeds, and the desk prices with a barrier shift precisely because its Greeks turn infernal there',
    ],
    reponseModele: `La méthode d'abord. Monte-Carlo n'a pas de N(d₁) à offrir : pour un autocall, il n'existe pas plus de formule fermée pour le delta que pour le prix. La méthode universelle est le **bump and reprice** : re-simuler le produit avec un spot décalé — S₀ + 1 — et prendre la pente, Δ ≈ [V(S₀ + h) − V(S₀)] / h. Deux pricings, une soustraction, une division : le delta est mesuré comme le prix l'était.

Mes cinq essais à 0,33, 0,40, 0,45, 0,53 et 0,83 — pour un vrai delta de **0,637** sur le call canonique — ont une seule cause : les deux runs ont été tirés avec des graines **indépendantes**. Chaque prix porte alors son propre bruit, et le module 2 dit ce qui arrive quand on soustrait deux estimations indépendantes : les variances s'additionnent. Avec une erreur-type de 0,15 par prix à dix mille tirages, l'erreur sur la différence vaut √2 × 0,15 ≈ **0,21** — sur une pente qui vaut 0,64. Le bruit est du même ordre que le signal : ce que je lis n'est pas un delta, c'est du hasard. Et un delta bruité n'est pas un problème d'esthétique : c'est un **hedge faux** — des quantités achetées ou vendues à tort, du vrai argent.

Le remède tient en un principe : les **variables aléatoires communes**. On rejoue les *mêmes graines* dans les deux mondes — spot 100 et spot 101 : chaque trajectoire bumpée devient la jumelle de sa trajectoire de base, soumise aux mêmes chocs ; dans la soustraction, le bruit commun s'annule et il ne reste que l'effet du bump. Résultat sur le même exemple : **0,644** — très honorable, avec les mêmes dix mille tirages qui donnaient n'importe quoi à graines libres.

La règle d'oral, qui condense tout : **on bumpe le paramètre, jamais le hasard**. Elle vaut pour toutes les grecques — vega par bump de volatilité, sensibilité dividendes par bump de q, corrélation par bump de ρ — et chaque grecque exigeant un repricing complet, la facture de calcul d'un book se multiplie : deuxième raison, après l'audit, pour laquelle un desk ne compare jamais deux pricings sans figer les graines. La chute : Monte-Carlo ne donne pas seulement des prix — il donne des dérivées, à condition de ne dériver que ce qu'on a choisi de bouger.`,
    reponseModeleEn: `The method first. Monte Carlo has no N(d₁) to offer: for an autocall, there is no more a closed formula for the delta than there was for the price. The universal method is **bump and reprice**: re-simulate the product with a shifted spot — S₀ + 1 — and take the slope, Δ ≈ [V(S₀ + h) − V(S₀)] / h. Two pricings, one subtraction, one division: the delta is measured the way the price was.

My five attempts at 0.33, 0.40, 0.45, 0.53 and 0.83 — for a true delta of **0.637** on the canonical call — have a single cause: the two runs were drawn with **independent** seeds. Each price then carries its own noise, and module 2 says what happens when you subtract two independent estimates: the variances add. With a standard error of 0.15 per price at ten thousand draws, the error on the difference is √2 × 0.15 ≈ **0.21** — on a slope worth 0.64. The noise is the same order as the signal: what I am reading is not a delta, it is chance. And a noisy delta is not an aesthetic problem: it is a **wrong hedge** — quantities bought or sold in error, real money.

The remedy holds in one principle: **common random numbers**. You replay the *same seeds* in both worlds — spot 100 and spot 101: each bumped path becomes the twin of its base path, subject to the same shocks; in the subtraction, the shared noise cancels and only the bump effect remains. Result on the same example: **0.644** — very honourable, with the same ten thousand draws that gave nonsense on free seeds.

The oral rule, which condenses everything: **bump the parameter, never the randomness**. It holds for every Greek — vega by bumping volatility, dividend sensitivity by bumping q, correlation by bumping ρ — and since each Greek requires a full repricing, a book's computing bill multiplies: the second reason, after audit, why a desk never compares two pricings without fixing the seeds. The closing line: Monte Carlo does not only give prices — it gives derivatives, provided you only differentiate what you chose to move.`,
  },
  {
    id: 'm9-j-19',
    moduleId: M9,
    theme: 'term sheet, marge et accidents',
    themeEn: 'term sheet, margin and blow-ups',
    difficulte: 2,
    question: '15 septembre 2008 : que découvrent ce jour-là les porteurs de notes « 100 % capital garanti » émises par Lehman Brothers ?',
    questionEn: 'September 15, 2008: what do the holders of "100% capital guaranteed" notes issued by Lehman Brothers discover that day?',
    plan: [
      'Rappeler la brique : la garantie du capital est un zéro-coupon, c\'est-à-dire une obligation — une créance senior non sécurisée sur l\'émetteur, portant tout le risque de crédit du module 5',
      'Raconter la chute : Lehman, quatrième banque d\'investissement américaine, notée A jusqu\'à l\'été 2008, dépose le bilan — la phrase du term sheet révèle son sens : garanti PAR Lehman',
      'Chiffrer l\'onde de choc : de l\'ordre de 50 000 particuliers en Allemagne (la « Lehman-Oma »), des dizaines de milliers au Benelux, plus de 40 000 porteurs de minibonds à Hong Kong pour environ 2 milliards de dollars',
      'Tirer la leçon : « capital garanti » est une propriété de l\'émetteur, pas du produit — d\'où le KID (PRIIPs, 2018) et sa première page : l\'identité de l\'émetteur et ce qui arrive s\'il fait défaut',
    ],
    planEn: [
      'Recall the brick: the capital guarantee is a zero-coupon, that is, a bond — a senior unsecured claim on the issuer, carrying all of module 5\'s credit risk',
      'Tell the fall: Lehman, fourth-largest American investment bank, rated A until summer 2008, files for bankruptcy — the term-sheet sentence reveals its meaning: guaranteed BY Lehman',
      'Quantify the shockwave: around 50,000 retail investors in Germany (the "Lehman-Oma"), tens of thousands in the Benelux, over 40,000 minibond holders in Hong Kong for about 2 billion dollars',
      'Draw the lesson: "capital guaranteed" is a property of the issuer, not of the product — hence the KID (PRIIPs, 2018) and its first page: the issuer\'s identity and what happens if it defaults',
    ],
    pointsAttendus: [
      'La mécanique nue : la brique qui garantit le capital est un zéro-coupon, donc une obligation — elle porte tout le risque de crédit du module 5 ; le produit entier est une dette senior non sécurisée de la banque',
      'La phrase qui change de sens le 15 septembre : le capital était garanti PAR Lehman — le zéro-coupon n\'était pas un coffre-fort, c\'était une créance sur un émetteur en faillite',
      'Les chiffres de l\'onde : de l\'ordre de 50 000 particuliers touchés en Allemagne — la « Lehman-Oma », à qui sa caisse d\'épargne avait vendu ces certificats comme un placement sûr —, des dizaines de milliers au Benelux, plus de 40 000 porteurs de minibonds à Hong Kong pour environ 2 milliards de dollars',
      'Le dénouement : la liquidation ne rend que quelques dizaines de cents par dollar, au fil d\'une décennie de procédures — sauf à Hong Kong, où le régulateur contraint les banques distributrices à racheter les titres',
      'La leçon de décomposition : à l\'oral, une décomposition de produit structuré qui oublie la ligne « risque émetteur » est une décomposition fausse',
      'La postérité réglementaire : ce scandale accouche du KID européen (PRIIPs, 2018), dont la première page donne l\'identité de l\'émetteur et ce qui arrive s\'il fait défaut',
    ],
    pointsAttendusEn: [
      'The bare mechanics: the brick that guarantees the capital is a zero-coupon, hence a bond — it carries all of module 5\'s credit risk; the whole product is senior unsecured debt of the bank',
      'The sentence that changes meaning on September 15: the capital was guaranteed BY Lehman — the zero-coupon was not a safe-deposit box, it was a claim on a bankrupt issuer',
      'The shockwave numbers: around 50,000 retail investors hit in Germany — the "Lehman-Oma", sold these certificates by her savings bank as a safe investment —, tens of thousands in the Benelux, over 40,000 minibond holders in Hong Kong for about 2 billion dollars',
      'The outcome: liquidation returns only a few tens of cents per dollar, over a decade of proceedings — except in Hong Kong, where the regulator forces the distributing banks to buy the notes back',
      'The decomposition lesson: at the oral, a structured-product decomposition that forgets the "issuer risk" line is a wrong decomposition',
      'The regulatory legacy: this scandal gives birth to the European KID (PRIIPs, 2018), whose first page states the issuer\'s identity and what happens if it defaults',
    ],
    bonus: [
      'Le paradoxe du funding, rétrospectivement glaçant : à formule égale, le produit le plus généreux est souvent celui de l\'émetteur le moins sûr — les porteurs de Lehman étaient « payés » pour un risque de signature qu\'ils ne voyaient pas',
      'Le vocabulaire du module 5 pour chiffrer : spread de crédit, séniorité, taux de recouvrement — un « garanti » se price comme une obligation, et son spread disait déjà quelque chose à l\'été 2008',
    ],
    bonusEn: [
      'The funding paradox, chilling in hindsight: for the same formula, the most generous product is often the least safe issuer\'s — Lehman holders were being "paid" for a signature risk they could not see',
      'Module 5\'s vocabulary to quantify: credit spread, seniority, recovery rate — a "guaranteed" product prices like a bond, and its spread was already saying something in the summer of 2008',
    ],
    reponseModele: `Ils découvrent le sens d'une phrase qu'ils n'avaient jamais lue jusqu'au bout. La brique qui « garantit » le capital d'un structuré est un **zéro-coupon** — c'est-à-dire une **obligation** : une créance senior non sécurisée sur l'émetteur, portant tout le risque de crédit du module 5. Dans les années 2000, les banques vendent aux particuliers du monde entier des notes « 100 % capital garanti » — zéro-coupon plus call — et beaucoup sont émises ou garanties par **Lehman Brothers**, quatrième banque d'investissement américaine, notée A jusqu'à l'été 2008 : une signature que personne n'interroge.

Le 15 septembre 2008, Lehman dépose le bilan — et la phrase du term sheet révèle son sens : le capital était garanti **par Lehman**. Le zéro-coupon n'était pas un coffre-fort ; c'était une créance sur un émetteur en faillite. L'onde de choc se chiffre : de l'ordre de **50 000 particuliers** touchés en Allemagne — la presse parlera de la « Lehman-Oma », cette grand-mère à qui sa caisse d'épargne avait vendu ces certificats comme un placement sûr —, des dizaines de milliers d'autres en Belgique et aux Pays-Bas, plus de **40 000 porteurs de minibonds** à Hong Kong pour environ 2 milliards de dollars. La liquidation ne rendra que quelques dizaines de cents par dollar, au fil d'une décennie de procédures — sauf à Hong Kong, où le régulateur contraindra les banques distributrices à racheter les titres, et où la plupart des porteurs finiront par récupérer l'essentiel de leur mise.

La leçon tient en une inversion : « capital garanti » n'est **jamais une propriété du produit** — c'est une propriété de l'émetteur. À l'oral, une décomposition de produit structuré qui oublie la ligne « risque émetteur » est une décomposition fausse. Et le paradoxe du funding rend la leçon glaçante rétrospectivement : à formule égale, le produit le plus généreux est souvent celui de la signature la plus fragile — les porteurs de Lehman étaient « payés » pour un risque qu'ils ne voyaient pas.

La postérité, enfin : c'est ce scandale qui accouchera du **KID** européen — règlement PRIIPs, 2018 — et de sa première page : l'identité de l'émetteur, et ce qui arrive s'il fait défaut. La chute : le 15 septembre 2008, des centaines de milliers d'épargnants ont appris en un jour ce que ce module dit en une phrase — un zéro-coupon bancaire n'est jamais un coffre-fort, seulement une créance.`,
    reponseModeleEn: `They discover the meaning of a sentence they had never read to the end. The brick that "guarantees" a structured product's capital is a **zero-coupon** — that is, a **bond**: a senior unsecured claim on the issuer, carrying all of module 5's credit risk. In the 2000s, banks sell retail investors worldwide "100% capital guaranteed" notes — zero-coupon plus call — and many are issued or guaranteed by **Lehman Brothers**, the fourth-largest American investment bank, rated A until the summer of 2008: a signature nobody questions.

On September 15, 2008, Lehman files for bankruptcy — and the term-sheet sentence reveals its meaning: the capital was guaranteed **by Lehman**. The zero-coupon was not a safe-deposit box; it was a claim on a bankrupt issuer. The shockwave can be counted: around **50,000 retail investors** hit in Germany — the press will speak of the "Lehman-Oma", the grandmother sold these certificates by her savings bank as a safe investment —, tens of thousands more in Belgium and the Netherlands, over **40,000 minibond holders** in Hong Kong for about 2 billion dollars. Liquidation will return only a few tens of cents per dollar, over a decade of proceedings — except in Hong Kong, where the regulator will force the distributing banks to buy the notes back, and where most holders will eventually recover the bulk of their money.

The lesson holds in one inversion: "capital guaranteed" is **never a property of the product** — it is a property of the issuer. At the oral, a structured-product decomposition that forgets the "issuer risk" line is a wrong decomposition. And the funding paradox makes the lesson chilling in hindsight: for the same formula, the most generous product is often the most fragile signature's — Lehman holders were being "paid" for a risk they could not see.

The legacy, finally: this scandal gives birth to the European **KID** — the PRIIPs regulation, 2018 — and its first page: the issuer's identity, and what happens if it defaults. The closing line: on September 15, 2008, hundreds of thousands of savers learnt in one day what this module says in one sentence — a bank zero-coupon is never a safe-deposit box, only a claim.`,
  },
  {
    id: 'm9-j-20',
    moduleId: M9,
    theme: 'term sheet, marge et accidents',
    themeEn: 'term sheet, margin and blow-ups',
    difficulte: 3,
    question: 'Corée 2015-2016 : comment l\'épargne des ménages coréens a-t-elle aggravé la chute d\'un indice chinois ?',
    questionEn: 'Korea 2015-2016: how did Korean household savings worsen the fall of a Chinese index?',
    plan: [
      'Planter le décor : la Corée est le plus gros marché d\'autocalls au monde (les ELS) — en quête de coupons plus gros, les émetteurs convergent vers le HSCEI, plus volatil que le Kospi domestique',
      'Chiffrer la concentration : à l\'été 2015, de l\'ordre de 30 à 40 milliards de dollars d\'ELS indexés sur ce seul indice — tout un pays a vendu le même put down-and-in, barrières dans la même zone',
      'Dérouler l\'accident : du pic de mai 2015 au creux de février 2016, le HSCEI est quasiment divisé par deux — les knock-ins tombent en cascade, les « placements à coupon » deviennent des pertes actions sèches',
      'Expliquer l\'effet retour : près des barrières, gamma et vega explosent — tous les desks rééquilibrent au même endroit dans le même sens : leurs ventes nourrissent la baisse, leur demande de vega fait flamber la vol',
    ],
    planEn: [
      'Set the scene: Korea is the world\'s largest autocall market (the ELS) — chasing bigger coupons, issuers converge on the HSCEI, more volatile than the domestic Kospi',
      'Quantify the concentration: by summer 2015, around 30 to 40 billion dollars of ELS indexed on that single index — a whole country has sold the same down-and-in put, barriers in the same zone',
      'Unroll the accident: from the May 2015 peak to the February 2016 trough, the HSCEI is nearly halved — knock-ins fall in cascade, "coupon investments" become dry equity losses',
      'Explain the feedback: near the barriers, gamma and vega explode — every desk rebalances in the same place in the same direction: their sales feed the fall, their vega demand ignites the vol',
    ],
    pointsAttendus: [
      'Le point de départ, en pur chapitre 4 : pourquoi le HSCEI — plus volatil que le Kospi, donc des puts plus chers, donc des coupons plus gros : le coupon résolu, pas choisi ; le thermomètre indiquait déjà le risque',
      'La concentration systémique : de l\'ordre de 30 à 40 milliards de dollars d\'ELS sur un seul indice, barrières concentrées dans la même zone — le risque individuel de chaque produit est devenu une position de place',
      'L\'accident : le HSCEI quasiment divisé par deux entre mai 2015 et février 2016 — les knock-ins en cascade transforment des placements à coupon en pertes actions sèches ; le régulateur finit par restreindre les nouvelles émissions',
      'L\'effet retour technique : à l\'approche d\'une barrière, delta et gamma du put down-and-in explosent — de petites variations du spot exigent de grands ajustements ; des milliers de produits partageant la même zone, tous les desks rééquilibrent au même endroit dans le même sens : ventes de futures qui nourrissent la baisse, besoin simultané de vega qui fait flamber la volatilité implicite',
      'La reconnaissance de structure : 1987 (portfolio insurance), Volmageddon 2018 — la couverture des uns est le flux des autres, et la concentration transforme un choc en spirale',
      'La morale : quand tout un pays vend la même barrière, le risque cesse d\'être un paramètre de pricing et devient un événement de marché',
    ],
    pointsAttendusEn: [
      'The starting point, pure chapter 4: why the HSCEI — more volatile than the Kospi, hence dearer puts, hence bigger coupons: the coupon solved, not chosen; the thermometer was already indicating the risk',
      'The systemic concentration: around 30 to 40 billion dollars of ELS on a single index, barriers concentrated in the same zone — each product\'s individual risk became a market-wide position',
      'The accident: the HSCEI nearly halved between May 2015 and February 2016 — cascading knock-ins turn coupon investments into dry equity losses; the regulator ends up restricting new issuance',
      'The technical feedback: as a barrier approaches, the down-and-in put\'s delta and gamma explode — small spot moves demand large adjustments; with thousands of products sharing the same zone, every desk rebalances in the same place in the same direction: futures sales feeding the fall, simultaneous vega demand igniting implied volatility',
      'The structural recognition: 1987 (portfolio insurance), the 2018 Volmageddon — one side\'s hedge is the other side\'s flow, and concentration turns a shock into a spiral',
      'The moral: when a whole country sells the same barrier, the risk stops being a pricing parameter and becomes a market event',
    ],
    bonus: [
      '2024 : la même histoire au même endroit — l\'encours coréen reconstitué se reconcentre sur les indices hongkongais, qui perdent environ la moitié de leur valeur entre 2021 et 2024 ; pertes en milliards, ventes inadaptées massives constatées, indemnisations ordonnées — la mémoire des marchés est courte, celle des jurys ne l\'est pas',
      'Le pont avec le barrier shift du chapitre 5 : les desks pricent avec une barrière décalée précisément parce qu\'ils savent qu\'ils ne pourront pas se couvrir proprement sur la falaise — la Corée est la démonstration grandeur nature de cette prudence',
    ],
    bonusEn: [
      '2024: the same story in the same place — the rebuilt Korean stock re-concentrates on the Hong Kong indices, which lose about half their value between 2021 and 2024; billions in losses, massive mis-selling findings, ordered compensation — markets\' memory is short, juries\' is not',
      'The bridge to chapter 5\'s barrier shift: desks price with a shifted barrier precisely because they know they will not be able to hedge cleanly on the cliff — Korea is the full-scale demonstration of that prudence',
    ],
    reponseModele: `Le décor d'abord. La Corée du Sud est le plus gros marché d'autocalls au monde : les **ELS** — equity-linked securities — y sont un placement de ménage ordinaire. Au milieu des années 2010, les émetteurs cherchent plus rémunérateur que le Kospi domestique et convergent vers le **HSCEI**, l'indice des grandes valeurs chinoises cotées à Hong Kong — plus volatil, donc des puts plus chers, donc des coupons plus gros : vous reconnaissez le chapitre 4, le coupon n'est pas choisi, il est résolu, et le thermomètre indiquait déjà le risque. À l'été 2015, l'encours d'ELS indexés sur ce seul indice est de l'ordre de **30 à 40 milliards de dollars** : tout un pays a vendu le même put down-and-in, barrières concentrées dans la même zone.

Puis la Chine déraille : du pic de mai 2015 au creux de février 2016, le HSCEI est **quasiment divisé par deux**. Les knock-ins tombent en cascade — la falaise du chapitre 5, à l'échelle d'un pays : des « placements à coupon » deviennent des pertes actions sèches, et le régulateur coréen finit par restreindre les nouvelles émissions sur l'indice.

Mais le plus instructif pour un desk est l'**effet retour** — la partie de la question qui dit « aggravé ». À l'approche d'une barrière, le delta et le gamma d'un put down-and-in explosent : de petites variations du spot exigent de grands ajustements de couverture. Quand des milliers de produits partagent la même zone de barrières, tous les desks rééquilibrent **au même endroit, dans le même sens** : leurs ventes de futures nourrissent la baisse qu'ils couvrent, et leur besoin simultané de vega fait flamber la volatilité implicite du HSCEI. L'épargne coréenne n'a pas causé la chute — elle a fourni le combustible qui l'a transformée en spirale. Vous reconnaissez la structure : 1987 et la portfolio insurance, le Volmageddon de 2018 — *la couverture des uns est le flux des autres*.

La chute, en deux temps. La morale : quand tout un pays vend la même barrière, le risque cesse d'être un paramètre de pricing et devient un **événement de marché**. Et l'épilogue qui la rend cruelle : l'encours reconstitué s'est reconcentré sur les mêmes indices, qui ont perdu la moitié de leur valeur entre 2021 et 2024 — pertes en milliards, indemnisations ordonnées. Deux crises identiques à huit ans d'écart : la mémoire des marchés est courte ; celle des jurys ne l'est pas.`,
    reponseModeleEn: `The scene first. South Korea is the world's largest autocall market: **ELS** — equity-linked securities — are an ordinary household investment there. In the mid-2010s, issuers look for something more remunerative than the domestic Kospi and converge on the **HSCEI**, the index of large Chinese stocks listed in Hong Kong — more volatile, hence dearer puts, hence bigger coupons: you recognise chapter 4, the coupon is not chosen, it is solved, and the thermometer was already indicating the risk. By the summer of 2015, the stock of ELS indexed on that single index is around **30 to 40 billion dollars**: a whole country has sold the same down-and-in put, barriers concentrated in the same zone.

Then China derails: from the May 2015 peak to the February 2016 trough, the HSCEI is **nearly halved**. Knock-ins fall in cascade — chapter 5's cliff, at the scale of a country: "coupon investments" become dry equity losses, and the Korean regulator ends up restricting new issuance on the index.

But the most instructive part for a desk is the **feedback** — the part of the question that says "worsen". As a barrier approaches, a down-and-in put's delta and gamma explode: small spot moves demand large hedging adjustments. When thousands of products share the same barrier zone, every desk rebalances **in the same place, in the same direction**: their futures sales feed the very fall they are hedging, and their simultaneous need for vega ignites the HSCEI's implied volatility. Korean savings did not cause the fall — they supplied the fuel that turned it into a spiral. You recognise the structure: 1987 and portfolio insurance, the 2018 Volmageddon — *one side's hedge is the other side's flow*.

The closing, in two beats. The moral: when a whole country sells the same barrier, the risk stops being a pricing parameter and becomes a **market event**. And the epilogue that makes it cruel: the rebuilt stock re-concentrated on the same indices, which lost half their value between 2021 and 2024 — billions in losses, ordered compensation. Two identical crises eight years apart: markets' memory is short; juries' is not.`,
  },
  {
    id: 'm9-j-21',
    moduleId: M9,
    theme: 'term sheet, marge et accidents',
    themeEn: 'term sheet, margin and blow-ups',
    difficulte: 3,
    question: 'Après tout ce que vous m\'avez dit — marge prélevée d\'avance, options vendues sans le savoir, accidents en série — le produit structuré est-il une arnaque ?',
    questionEn: 'After everything you have told me — margin taken upfront, options sold unknowingly, serial accidents — is the structured product a scam?',
    plan: [
      'Refuser le mot en le prenant au sérieux : une arnaque cache son prix — la marge d\'un structuré est publiée au KID depuis 2018 : valeur d\'émission 97 à 99 pour 100 payés, 0,5 à 1 % par an en tout',
      'Défendre l\'objet : chaque formule est un échange de risques consenti et rémunéré — vendre de l\'assurance est un service, et chaque produit a un client légitime',
      'Nommer le vrai problème : la commercialisation — le coupon en gros caractères, le risque illisible ; Bénéfic, Doubl\'ô, Lehman-Oma, minibonds : des scandales de VENTE, pas des formules mensongères',
      'Conclure en professionnel : ni arnaque ni placement miracle — une vente d\'options déguisée en placement, honnête avec qui sait la lire, dangereuse pour qui ne le sait pas',
    ],
    planEn: [
      'Refuse the word by taking it seriously: a scam hides its price — a structured product\'s margin has been published in the KID since 2018: issuance value 97 to 99 for 100 paid, 0.5 to 1% per year in total',
      'Defend the object: every formula is a consented, remunerated exchange of risks — selling insurance is a service, and every product has a legitimate client',
      'Name the real problem: the marketing — the coupon in large print, the risk unreadable; Bénéfic, Doubl\'ô, Lehman-Oma, minibonds: SELLING scandals, not lying formulas',
      'Conclude as a professional: neither scam nor miracle investment — an option sale disguised as an investment, honest with whoever can read it, dangerous for whoever cannot',
    ],
    pointsAttendus: [
      'L\'argument anti-arnaque central : le prix est public — depuis 2018, le règlement PRIIPs impose le KID, qui publie les coûts et la valeur à l\'émission : les 97,5 de l\'Athéna canonique y figurent ; une arnaque ne publie pas sa marge',
      'La marge en perspective : 0,5 à 1 % par an en tout, structuration et rétrocessions confondues — comparable à la fourchette d\'un market maker ou aux frais d\'un fonds, prélevée d\'avance plutôt qu\'au fil de l\'eau ; le coupon d\'équilibre serait 10 %, le term sheet offre 8 : l\'écart se calcule et se compare',
      'La finesse que le KID ne crie pas : rappelé dans 83 % des trajectoires (56 % dès l\'an un), vie moyenne 2,2 ans — annualisée sur la vie effective, la marge dépasse 1 % : la seule vraie zone d\'ombre est là',
      'La légitimité économique : chaque formule est un échange de risques consenti — le client qui échange la hausse contre un revenu, celui qui vendrait ce put en connaissance de cause : vendre de l\'assurance est un service, rémunéré à son prix',
      'Le vrai procès : les scandales — Bénéfic, Doubl\'ô, la Lehman-Oma, les minibonds — sont des scandales de commercialisation : le produit vendu au mauvais client, le coupon certain en gros caractères et le capital incertain en petits ; d\'où MiFID II, gouvernance produit et adéquation',
      'La phrase d\'équilibre : le structuré est une vente d\'options déguisée en placement — l\'arnaque n\'est pas dans la formule, elle serait dans le silence sur ce que la formule fait vendre',
    ],
    pointsAttendusEn: [
      'The central anti-scam argument: the price is public — since 2018, the PRIIPs regulation imposes the KID, which publishes the costs and the issuance value: the canonical Athena\'s 97.5 appears there; a scam does not publish its margin',
      'The margin in perspective: 0.5 to 1% per year in total, structuring and retrocessions combined — comparable to a market maker\'s spread or a fund\'s fees, taken upfront rather than over time; the fair coupon would be 10%, the term sheet offers 8: the gap can be computed and compared',
      'The subtlety the KID does not shout: called in 83% of paths (56% at year one), average life 2.2 years — annualised over the effective life, the margin exceeds 1%: the only real grey area is there',
      'The economic legitimacy: every formula is a consented exchange of risks — the client trading upside for income, the one who would sell that put knowingly: selling insurance is a service, paid at its price',
      'The real trial: the scandals — Bénéfic, Doubl\'ô, the Lehman-Oma, the minibonds — are marketing scandals: the product sold to the wrong client, the certain coupon in large print and the uncertain capital in small; hence MiFID II, product governance and suitability',
      'The balancing sentence: the structured product is an option sale disguised as an investment — the scam is not in the formula, it would be in the silence about what the formula makes you sell',
    ],
    bonus: [
      'La comparaison honnête avec les alternatives : un fonds actions classique prélève de l\'ordre de 2 % par an sur toute la durée — la marge structurée n\'est pas hors marché ; ce qui est hors norme, c\'est l\'asymétrie de lisibilité entre le coupon et le risque',
      'Le critère final du desk, qui tranche tout : « ce produit convient à qui vendrait ces options en connaissance de cause » — si la réponse est non, le problème n\'est pas le produit, c\'est la vente',
    ],
    bonusEn: [
      'The honest comparison with alternatives: a classic equity fund takes around 2% per year for the whole duration — the structured margin is not off-market; what is off-norm is the readability asymmetry between the coupon and the risk',
      'The desk\'s final criterion, which settles everything: "this product suits whoever would sell these options knowingly" — if the answer is no, the problem is not the product, it is the sale',
    ],
    reponseModele: `Prenons le mot au sérieux : une arnaque **cache son prix**. Or la marge d'un structuré est publique. Depuis 2018, le règlement PRIIPs impose le **KID**, qui publie les coûts et la valeur à l'émission : les 97,5 de notre Athéna canonique — pour 100 payés — y figurent noir sur blanc. L'ordre de grandeur, 0,5 à 1 % par an en tout, structuration et rétrocessions confondues, est comparable à la fourchette d'un market maker ou aux frais d'un fonds actions — prélevé d'avance plutôt qu'au fil de l'eau, ce qui explique les valeurs de revente décevantes des premières semaines, mais rien n'y est caché. Le coupon d'équilibre serait d'environ 10 % ; le term sheet en offre 8 : l'écart se calcule, se lit, se compare. Une seule vraie zone d'ombre : rappelé dans 83 % des trajectoires, vie moyenne 2,2 ans — annualisée sur la vie *effective*, la marge dépasse 1 % ; c'est la finesse que le KID ne crie pas.

Sur le fond, l'objet est économiquement légitime : chaque formule est un **échange de risques consenti et rémunéré**. Le retraité qui échange la hausse contre un revenu, l'investisseur qui accepterait de devenir actionnaire au strike et vend ce put en connaissance de cause — vendre de l'assurance est un service, payé à son prix. La banque, correctement couverte, ne parie pas contre le client : elle fabrique, prélève son péage, et garde les risques qui ne se transfèrent pas.

Le vrai procès est ailleurs, et il est accablant : la **commercialisation**. Bénéfic, Doubl'ô, la Lehman-Oma, les minibonds de Hong Kong — aucune de ces affaires n'est une formule mensongère : toutes sont des produits vendus au mauvais client, avec le coupon certain en gros caractères et le capital incertain en petits — la hiérarchie de l'information inversée. C'est exactement ce que MiFID II est venue encadrer : gouvernance produit, transparence des rétrocessions, adéquation au client. Le scandale récurrent du structuré n'est pas ce qu'il fait — c'est à qui on le vend, et ce qu'on omet de dire.

La chute, nuancée comme la question l'exige : le structuré n'est **ni une arnaque ni un placement miracle** — c'est une vente d'options déguisée en placement, honnête avec qui sait la lire, dangereuse pour qui ne le sait pas. L'arnaque n'est pas dans la formule ; elle serait dans le silence sur ce que la formule fait vendre. Et le critère qui tranche tout tient en une phrase de desk : ce produit convient à qui vendrait ces options en connaissance de cause — si la réponse est non, le problème n'est pas le produit, c'est la vente.`,
    reponseModeleEn: `Take the word seriously: a scam **hides its price**. Yet a structured product's margin is public. Since 2018, the PRIIPs regulation has imposed the **KID**, which publishes the costs and the issuance value: our canonical Athena's 97.5 — for 100 paid — appears there in black and white. The order of magnitude, 0.5 to 1% per year in total, structuring and retrocessions combined, is comparable to a market maker's spread or an equity fund's fees — taken upfront rather than over time, which explains the disappointing resale values of the first weeks, but nothing is hidden. The fair coupon would be about 10%; the term sheet offers 8: the gap can be computed, read, compared. One real grey area: called in 83% of paths, average life 2.2 years — annualised over the *effective* life, the margin exceeds 1%; that is the subtlety the KID does not shout.

On substance, the object is economically legitimate: every formula is a **consented, remunerated exchange of risks**. The retiree trading upside for income, the investor who would accept becoming a shareholder at the strike and sells that put knowingly — selling insurance is a service, paid at its price. The bank, properly hedged, is not betting against the client: it manufactures, takes its toll, and keeps the risks that cannot be transferred.

The real trial is elsewhere, and it is damning: the **marketing**. Bénéfic, Doubl'ô, the Lehman-Oma, Hong Kong's minibonds — none of these affairs is a lying formula: all are products sold to the wrong client, with the certain coupon in large print and the uncertain capital in small — the information hierarchy inverted. That is exactly what MiFID II came to police: product governance, retrocession transparency, client suitability. The structured product's recurring scandal is not what it does — it is who it is sold to, and what is left unsaid.

The closing line, nuanced as the question demands: the structured product is **neither a scam nor a miracle investment** — it is an option sale disguised as an investment, honest with whoever can read it, dangerous for whoever cannot. The scam is not in the formula; it would be in the silence about what the formula makes you sell. And the criterion that settles everything holds in one desk sentence: this product suits whoever would sell these options knowingly — if the answer is no, the problem is not the product, it is the sale.`,
  },
  {
    id: 'm9-j-22',
    moduleId: M9,
    theme: 'term sheet, marge et accidents',
    themeEn: 'term sheet, margin and blow-ups',
    difficulte: 4,
    question: 'Mars 2020 : les desks structurés actions perdent des sommes historiques sans avoir vendu un seul produit de plus. Racontez-moi les trois jambes de la perte.',
    questionEn: 'March 2020: equity structured desks post historic losses without having sold a single extra product. Walk me through the three legs of the loss.',
    plan: [
      'Poser la position de départ : un book d\'autocalls est structurellement long dividendes (couverture en forward sur indices de prix), court corrélation (long les puts worst-of des clients) et exposé aux grecques des barrières — trois risques gardés, invisibles au client',
      'Jambe 1, les dividendes : régulateurs et entreprises annulent les dividendes européens — les futures de dividendes Euro Stoxx 50 2020-2021 perdent environ la moitié de leur valeur : la jambe du forward s\'évapore',
      'Jambe 2, les barrières et la volatilité : les indices cassent les zones de knock-in, gamma et vega concentrés explosent, et tous les produits s\'allongent en même temps — couvertures à étendre au pire moment',
      'Jambe 3, la corrélation : sur les worst-of, tout corrèle vers 1 — la dispersion payée en coupons disparaît ; bilan : environ 200 millions d\'euros de dividendes par grande maison, plus d\'un milliard cumulé pour la place, Natixis se retire',
    ],
    planEn: [
      'State the starting position: an autocall book is structurally long dividends (forward hedges on price indices), short correlation (long the clients\' worst-of puts) and exposed to barrier Greeks — three kept risks, invisible to the client',
      'Leg 1, dividends: regulators and companies cancel European dividends — Euro Stoxx 50 dividend futures for 2020-2021 lose about half their value: the forward leg evaporates',
      'Leg 2, barriers and volatility: indices smash through the knock-in zones, concentrated gamma and vega explode, and every product lengthens at once — hedges to extend at the worst moment',
      'Leg 3, correlation: on worst-ofs, everything correlates towards 1 — the dispersion paid for in coupons disappears; the bill: about 200 million euros of dividends per large house, over a billion cumulative for the market, Natixis withdraws',
    ],
    pointsAttendus: [
      'La position structurelle AVANT le choc, héritée de toute la chaîne de fabrication : long dividendes — F = S × e^((r − q)T), le desk encaisse des dividendes que l\'indice de prix ne reverse pas ; court corrélation — long les DIP worst-of des clients, qui perdent de la valeur quand la corrélation monte ; grecques concentrées près des barrières',
      'Jambe dividendes : mars 2020, le Covid ferme les économies, régulateurs et entreprises annulent — ce qu\'aucun modèle ne prévoyait ; les futures de dividendes Euro Stoxx 50 pour 2020 et 2021 perdent environ la moitié de leur valeur en quelques semaines : de l\'ordre de 200 millions d\'euros par grande maison française',
      'Jambe barrières et volatilité : les marchés cassent les zones de barrières — gamma et vega concentrés comme en Corée ; et la duration perverse joue à plein : le rappel s\'éloigne, tous les produits s\'allongent en même temps, les couvertures doivent être étendues au pire moment',
      'Jambe corrélation : sur les worst-of, les corrélations montent vers 1 — l\'événement systémique unique remplace les malchances indépendantes : la dispersion que les books avaient payée en coupons disparaît, et les puts worst-of qu\'ils détiennent perdent leur supplément de valeur',
      'Le bilan : revenus quasi nuls ou négatifs au premier trimestre 2020, facture cumulée au-delà du milliard sur l\'année pour la place — Natixis, après un semestre de pertes, annonce à l\'été 2020 son retrait des produits les plus complexes ; les banques françaises, leaders mondiaux de la structuration actions, étaient les plus longues dividendes de toutes',
      'La leçon transversale : le client vend des risques visibles et rémunérés, le desk garde les risques non transférables — et l\'accident survient quand toute une place porte le même risque au même moment : le risque concentré cesse d\'être un paramètre de pricing et devient un événement de marché',
    ],
    pointsAttendusEn: [
      'The structural position BEFORE the shock, inherited from the whole manufacturing chain: long dividends — F = S × e^((r − q)T), the desk collects dividends the price index does not pass on; short correlation — long the clients\' worst-of DIPs, which lose value when correlation rises; Greeks concentrated near the barriers',
      'Dividend leg: March 2020, Covid shuts the economies, regulators and companies cancel — what no model foresaw; Euro Stoxx 50 dividend futures for 2020 and 2021 lose about half their value within weeks: around 200 million euros per large French house',
      'Barrier and volatility leg: markets smash through the barrier zones — gamma and vega concentrated as in Korea; and the perverse duration plays in full: the call recedes, every product lengthens at once, hedges must be extended at the worst moment',
      'Correlation leg: on worst-ofs, correlations rise towards 1 — the single systemic event replaces independent misfortunes: the dispersion the books had paid for in coupons disappears, and the worst-of puts they hold lose their value supplement',
      'The bill: near-zero or negative revenues in the first quarter of 2020, a cumulative bill beyond a billion for the market over the year — Natixis, after a semester of losses, announces in summer 2020 its withdrawal from the most complex products; French banks, world leaders in equity structuring, were the longest dividends of all',
      'The transversal lesson: the client sells visible, remunerated risks, the desk keeps the non-transferable ones — and the accident comes when a whole market carries the same risk at the same moment: concentrated risk stops being a pricing parameter and becomes a market event',
    ],
    bonus: [
      'Pourquoi les banques françaises en première ligne : leaders mondiaux de la structuration actions, assises sur l\'énorme gisement d\'autocalls européens — la position de place était une position nationale',
      'Le paradoxe du second ordre : le dividende, paramètre « ennuyeux » du pricing, a coûté plus cher que la direction du marché — les risques mortels d\'un book sont rarement ceux qu\'on regarde ; le fil rouge qui mène au module 11 : quand tout le monde porte la même position, la sortie n\'a pas la taille de la foule',
    ],
    bonusEn: [
      'Why French banks were in the front line: world leaders in equity structuring, sitting on the enormous stock of European autocalls — the market-wide position was a national position',
      'The second-order paradox: the dividend, the "boring" pricing parameter, cost more than the market\'s direction — a book\'s lethal risks are rarely the ones being watched; the thread leading to module 11: when everyone carries the same position, the exit is never the size of the crowd',
    ],
    reponseModele: `Pour comprendre la perte, il faut photographier la position **avant** le choc — car elle était écrite dans la fabrication même des produits. Un book d'autocalls est structurellement **long dividendes** : les produits sont écrits sur des indices de prix, le desk se couvre en forward — F = S × e^((r − q)T) — et encaisse des dividendes que le produit ne reverse pas. Il est **court corrélation** : long les puts down-and-in worst-of vendus par ses clients, qui perdent leur supplément de valeur quand la corrélation monte. Et il porte des **grecques concentrées** près des zones de barrières. Trois risques gardés, invisibles au client — et, détail décisif, portés dans le même sens par toute une place, les banques françaises, leaders mondiaux de la structuration actions, en tête.

**Jambe un : les dividendes.** Le Covid ferme les économies, et régulateurs comme entreprises font ce qu'aucun modèle ne prévoyait : ils **annulent les dividendes** européens en quelques semaines. Les futures de dividendes Euro Stoxx 50 pour 2020 et 2021 perdent environ la moitié de leur valeur — la jambe du forward s'évapore : de l'ordre de **200 millions d'euros** par grande maison française, sur ce seul paramètre.

**Jambe deux : les barrières et la volatilité.** Les indices cassent les zones de knock-in — gamma et vega concentrés y explosent, la Corée en accéléré : couvrir exige de traiter des tailles énormes dans un marché déchaîné. Et la duration perverse du chapitre 4 joue à plein : le rappel s'éloigne, **tous les produits s'allongent en même temps**, et des couvertures calibrées sur des vies de deux ans doivent être étendues à cinq — au pire moment.

**Jambe trois : la corrélation.** Sur les worst-of, le krach n'est pas trois malchances indépendantes mais un seul événement systémique : les corrélations montent vers 1, la dispersion que les books avaient payée en coupons disparaît — et ce paramètre-là aussi perd. Le bilan : des revenus quasi nuls ou négatifs au premier trimestre 2020, une facture cumulée au-delà du milliard pour la place — et **Natixis**, après un semestre de pertes, annonce à l'été 2020 son retrait des produits les plus complexes.

La chute, qui est la leçon transversale du module : le client vend des risques visibles et rémunérés — la chute, la dispersion ; le desk garde ce qui ne se transfère pas — les dividendes, la corrélation, les grecques des falaises. Mars 2020 n'a pas pris les desks à contre-pied sur la direction du marché : il a fait se matérialiser, le même mois, les trois risques qu'ils gardaient tous du même côté. Quand toute une place porte le même risque au même moment, il cesse d'être un paramètre de pricing — il devient un événement de marché.`,
    reponseModeleEn: `To understand the loss, photograph the position **before** the shock — because it was written into the very manufacturing of the products. An autocall book is structurally **long dividends**: the products are written on price indices, the desk hedges with forwards — F = S × e^((r − q)T) — and collects dividends the product does not pass on. It is **short correlation**: long the worst-of down-and-in puts sold by its clients, which lose their value supplement when correlation rises. And it carries **concentrated Greeks** near the barrier zones. Three kept risks, invisible to the client — and, decisive detail, carried the same way by a whole market, with French banks, world leaders in equity structuring, at the front.

**Leg one: dividends.** Covid shuts the economies, and regulators and companies alike do what no model foresaw: they **cancel European dividends** within weeks. Euro Stoxx 50 dividend futures for 2020 and 2021 lose about half their value — the forward leg evaporates: around **200 million euros** per large French house, on that parameter alone.

**Leg two: barriers and volatility.** Indices smash through the knock-in zones — concentrated gamma and vega explode there, Korea in fast-forward: hedging requires trading enormous size in a raging market. And chapter 4's perverse duration plays in full: the call recedes, **every product lengthens at once**, and hedges calibrated on two-year lives must be extended to five — at the worst moment.

**Leg three: correlation.** On worst-ofs, the crash is not three independent misfortunes but one systemic event: correlations rise towards 1, the dispersion the books had paid for in coupons disappears — and that parameter loses too. The bill: near-zero or negative revenues in the first quarter of 2020, a cumulative tab beyond a billion for the market — and **Natixis**, after a semester of losses, announces in the summer of 2020 its withdrawal from the most complex products.

The closing line, which is the module's transversal lesson: the client sells visible, remunerated risks — the crash, the dispersion; the desk keeps what cannot be transferred — the dividends, the correlation, the cliff Greeks. March 2020 did not wrong-foot the desks on market direction: it materialised, in the same month, the three risks they were all carrying on the same side. When a whole market carries the same risk at the same moment, it stops being a pricing parameter — it becomes a market event.`,
  },
  {
    id: 'm9-j-23',
    moduleId: M9,
    theme: 'term sheet, marge et accidents',
    themeEn: 'term sheet, margin and blow-ups',
    difficulte: 4,
    question: 'Un client vous tend un term sheet d\'autocall et vous laisse deux minutes. Votre check-list, dans l\'ordre.',
    questionEn: 'A client hands you an autocall term sheet and gives you two minutes. Your checklist, in order.',
    plan: [
      'Annoncer les deux questions qui organisent toute la lecture : qu\'est-ce que le client vend sans le savoir — et combien la banque se paie au passage',
      'Lire dans l\'ordre du desk, pas du client : émetteur (une dette, une signature), sous-jacent (indice de prix ? worst-of ?), barrières (niveau ET fréquence d\'observation), mécanique de rappel',
      'Décomposer la formule de remboursement en briques : zéro-coupon, digitales, put down-and-in vendu — puis le pricing mental : coupon moins taux sans risque = loyer des options vendues, moins la marge',
      'Rendre le verdict : valeur d\'émission au KID, durée réelle espérée, et la question qui remplace « combien ça rapporte ? » : « quel risque a été vendu pour payer ça ? »',
    ],
    planEn: [
      'Announce the two questions that organise the whole reading: what is the client selling without knowing it — and how much is the bank paying itself along the way',
      'Read in the desk\'s order, not the client\'s: issuer (a debt, a signature), underlying (price index? worst-of?), barriers (level AND observation frequency), call mechanics',
      'Decompose the redemption formula into bricks: zero-coupon, digitals, down-and-in put sold — then the mental pricing: coupon minus risk-free rate = rent of the options sold, minus the margin',
      'Deliver the verdict: issuance value in the KID, expected real life, and the question that replaces "how much does it pay?": "what risk was sold to pay for this?"',
    ],
    pointsAttendus: [
      'L\'émetteur d\'abord : le produit est une dette senior non sécurisée — tout, « capital garanti » compris, ne vaut que cette signature (Lehman) ; et le paradoxe du funding : une formule anormalement belle est une raison d\'interroger la signature, pas de se réjouir',
      'Le sous-jacent, deux pièges en une ligne : « indice de prix, hors dividendes » — le client abandonne les dividendes qui financent le coupon ; « la moins bonne performance de » — un worst-of : le client vend de la corrélation en plus de la chute',
      'Les barrières : un niveau ET une fréquence d\'observation — à niveau égal, une barrière continue rend le put vendu plus cher que l\'observation à maturité seule : coupon plus gros, knock-in plus probable ; le même 60 % ne décrit pas le même risque',
      'La mécanique de rappel : fréquence des observations, seuil, effet mémoire — et la traduction en durée réelle : vie moyenne de l\'ordre de 2,2 ans sur l\'Athéna canonique, ni probable ni garantie de tenir les 5 ans faciaux',
      'La formule de remboursement décomposée en briques — ZC + digitales + DIP vendu par le client — et le pricing mental qui tient en une soustraction : taux 5 %, coupon 8 % ⇒ 3 points de loyer du put vendu, moins la marge ; valeur d\'émission au KID ≈ 97,5, coupon d\'équilibre ≈ 10 %',
      'Le verdict final en une question : à qui ce produit convient-il — celui qui vendrait ces options en connaissance de cause ; la question de l\'oral n\'est jamais « combien ça rapporte ? » mais « quel risque a été vendu pour payer ça ? »',
    ],
    pointsAttendusEn: [
      'The issuer first: the product is senior unsecured debt — everything, "capital guaranteed" included, is only worth that signature (Lehman); and the funding paradox: an abnormally pretty formula is a reason to question the signature, not to rejoice',
      'The underlying, two traps in one line: "price index, ex-dividends" — the client gives up the dividends that fund the coupon; "the worst performance of" — a worst-of: the client sells correlation on top of the crash',
      'The barriers: a level AND an observation frequency — at equal level, a continuous barrier makes the sold put dearer than maturity-only observation: bigger coupon, likelier knock-in; the same 60% does not describe the same risk',
      'The call mechanics: observation frequency, trigger, memory effect — and the translation into real life: average life around 2.2 years on the canonical Athena, neither probable nor guaranteed to reach the facial 5 years',
      'The redemption formula decomposed into bricks — ZC + digitals + DIP sold by the client — and the mental pricing that fits in one subtraction: rate 5%, coupon 8% ⇒ 3 points of rent on the sold put, minus the margin; issuance value in the KID ≈ 97.5, fair coupon ≈ 10%',
      'The final verdict in one question: who does this product suit — whoever would sell these options knowingly; the oral question is never "how much does it pay?" but "what risk was sold to pay for this?"',
    ],
    bonus: [
      'La ligne des frais et le KID : depuis 2018 la valeur à l\'émission est publiée — la lire, et l\'annualiser sur la vie effective attendue (2,2 ans) plutôt que sur la maturité faciale : la marge réelle dépasse le pourcentage affiché',
      'Les pièges de vocabulaire qui sautent en dix secondes : « garanti » vs « protégé », le coupon certain en gros caractères et le capital incertain en petits — la hiérarchie typographique inversée est en soi un signal',
    ],
    bonusEn: [
      'The fees line and the KID: since 2018 the issuance value is published — read it, and annualise it over the expected effective life (2.2 years) rather than the facial maturity: the real margin exceeds the displayed percentage',
      'The vocabulary traps that jump out in ten seconds: "guaranteed" vs "protected", the certain coupon in large print and the uncertain capital in small — the inverted typographic hierarchy is itself a signal',
    ],
    reponseModele: `Deux minutes suffisent si l'on sait ce qu'on cherche — et on cherche les réponses à deux questions : **qu'est-ce que le client vend sans le savoir**, et **combien la banque se paie au passage**. Le particulier lit le coupon en gros caractères ; le desk lit dans un tout autre ordre.

**L'émetteur, d'abord.** Le produit est une dette senior non sécurisée : tout — « capital garanti » compris — ne vaut que cette signature ; Lehman l'a écrit dans l'histoire. Et le paradoxe du funding en fait un test : une formule anormalement belle est une raison d'*interroger* la signature, jamais de se réjouir. **Le sous-jacent, ensuite** — deux pièges tiennent en une ligne : « indice de prix, hors dividendes » signifie que le client abandonne les dividendes qui financent son coupon ; « la moins bonne performance de » signale un worst-of — il vend de la corrélation en plus de la chute. **Les barrières, troisième arrêt** : un niveau *et* une fréquence d'observation. À 60 % identiques, une barrière continue rend le put vendu plus cher qu'une observation à maturité seule — coupon plus gros, knock-in plus probable : le même chiffre ne décrit pas le même risque. **La mécanique de rappel, quatrième** : fréquence, seuil, mémoire — et sa traduction honnête : une vie moyenne de l'ordre de 2,2 ans sur l'Athéna canonique, courte si le marché monte, longue s'il baisse — jamais « un placement à 5 ans ».

Reste la **formule de remboursement** — la seule vérité du document — qu'on décompose en briques : un zéro-coupon pour le nominal, des digitales pour les coupons, un put down-and-in **vendu par le client** dont la prime finance l'essentiel du coupon. Le pricing mental tient alors en une soustraction : le taux 5 ans est à 5 %, le produit promet 8 — ces **3 points sont le loyer du put vendu, moins la marge**. Et la marge se vérifie à la ligne des frais et au KID : valeur d'émission autour de 97,5 pour 100 payés, coupon d'équilibre proche de 10 % — l'écart est le péage, à annualiser sur la vie effective, pas sur la maturité faciale.

Le verdict, en trois lignes : ce que le client vend — la chute sous 60 % du pire indice, la dispersion, les dividendes, et la signature qu'il finance ; ce que la banque prend — 2 à 3 points de valeur d'émission ; à qui cela convient — celui qui vendrait ces options en connaissance de cause. La chute : la question de l'oral, et de la vie, n'est jamais « combien ça rapporte ? » mais « **quel risque a été vendu pour payer ça ?** » — deux minutes suffisent toujours à trouver la réponse, parce qu'il y en a toujours une.`,
    reponseModeleEn: `Two minutes are enough if you know what you are looking for — and you are looking for the answers to two questions: **what is the client selling without knowing it**, and **how much is the bank paying itself along the way**. The retail investor reads the coupon in large print; the desk reads in a completely different order.

**The issuer, first.** The product is senior unsecured debt: everything — "capital guaranteed" included — is only worth that signature; Lehman wrote it into history. And the funding paradox turns it into a test: an abnormally pretty formula is a reason to *question* the signature, never to rejoice. **The underlying, next** — two traps fit in one line: "price index, ex-dividends" means the client gives up the dividends that fund his coupon; "the worst performance of" flags a worst-of — he is selling correlation on top of the crash. **The barriers, third stop**: a level *and* an observation frequency. At an identical 60%, a continuous barrier makes the sold put dearer than maturity-only observation — bigger coupon, likelier knock-in: the same number does not describe the same risk. **The call mechanics, fourth**: frequency, trigger, memory — and their honest translation: an average life of around 2.2 years on the canonical Athena, short if the market rises, long if it falls — never "a 5-year investment".

There remains the **redemption formula** — the document's only truth — to decompose into bricks: a zero-coupon for the notional, digitals for the coupons, a down-and-in put **sold by the client** whose premium funds the bulk of the coupon. The mental pricing then fits in one subtraction: the 5-year rate is at 5%, the product promises 8 — those **3 points are the rent of the sold put, minus the margin**. And the margin is checked on the fees line and in the KID: issuance value around 97.5 for 100 paid, fair coupon close to 10% — the gap is the toll, to be annualised over the effective life, not the facial maturity.

The verdict, in three lines: what the client sells — the fall below 60% of the worst index, the dispersion, the dividends, and the signature he is funding; what the bank takes — 2 to 3 points of issuance value; who it suits — whoever would sell these options knowingly. The closing line: the question of the oral, and of life, is never "how much does it pay?" but "**what risk was sold to pay for this?**" — two minutes are always enough to find the answer, because there always is one.`,
  },
  {
    id: 'm9-j-24',
    moduleId: M9,
    theme: 'l\'autocall',
    themeEn: 'the autocall',
    difficulte: 4,
    question: 'Voici un autocall worst-of sur trois indices, coupon 12 %, barrière 60 %. Décomposez-le en briques et dites-moi qui porte chaque risque — le client, le desk, ou personne.',
    questionEn: 'Here is a worst-of autocall on three indices, 12% coupon, 60% barrier. Break it into bricks and tell me who carries each risk — the client, the desk, or nobody.',
    plan: [
      'Traduire le coupon avant de décomposer : 12 % quand le taux sans risque est à 3-5 % — sept à neuf points de loyer d\'options vendues, résolus tels que prix + marge = 100, gonflés par trois carburants : volatilité, décorrélation, dividendes',
      'Poser les briques : un zéro-coupon (le nominal), des digitales à mémoire (les coupons conditionnels), un put down-and-in WORST-OF vendu par le client — strike initial, barrière 60 % sur la pire performance : la brique qui paie presque tout',
      'Cartographier les risques du client : la perte entière sous 60 % du pire indice, la dispersion (un seul trébuche et tout déçoit), la signature de l\'émetteur, la durée aléatoire — dont deux qu\'il ne sait pas nommer',
      'Cartographier les risques du desk et conclure : long dividendes des trois indices, court corrélation, grecques explosives près des barrières — le taux part à la trésorerie, la marge est encaissée jour 1 : chaque risque a un propriétaire',
    ],
    planEn: [
      'Translate the coupon before decomposing: 12% when the risk-free rate is at 3-5% — seven to nine points of rent on sold options, solved such that price + margin = 100, inflated by three fuels: volatility, decorrelation, dividends',
      'Lay the bricks: a zero-coupon (the notional), memory digitals (the conditional coupons), a WORST-OF down-and-in put sold by the client — initial strike, 60% barrier on the worst performance: the brick that pays for almost everything',
      'Map the client\'s risks: the entire loss below 60% of the worst index, the dispersion (one stumbles and everything disappoints), the issuer\'s signature, the random duration — two of which he cannot name',
      'Map the desk\'s risks and conclude: long dividends on the three indices, short correlation, explosive Greeks near the barriers — the rate goes to treasury, the margin is pocketed on day 1: every risk has an owner',
    ],
    pointsAttendus: [
      'La traduction préalable du coupon : 12 % contre un taux sans risque de 3 à 5 % — l\'écart est le loyer des risques vendus ; le coupon n\'est pas choisi, il est résolu tel que prix + marge = 100, et trois carburants le gonflent : la volatilité des trois indices, leur décorrélation, leurs dividendes',
      'Les briques exactes : zéro-coupon pour le nominal + digitales à effet mémoire pour les coupons + put down-and-in worst-of vendu par le client (strike au niveau initial, barrière 60 % sur la pire performance) — le DIP worst-of vaut environ le double du mono-indice à ρ = 0,5 : c\'est ce supplément qui paie le 12 %',
      'Les risques du client : la falaise sur le PIRE des trois (probabilité de toucher accrue par la dispersion — 1,25 % contre 0,62 % déjà sur deux jumeaux), les corrélations qui montent vers 1 en crise (la diversification s\'évanouit quand il compte dessus), le risque émetteur (le produit est une dette), la duration perverse (courte si ça monte, longue si ça baisse)',
      'Les risques du desk, gardés car non transférables : long dividendes des trois indices de prix (mars 2020), court corrélation (il perd quand elle monte, et passe sa vie à en racheter), gamma et vega explosifs près des barrières (Corée) — plus le risque de modèle : le pricer lognormal voit la queue gauche trop mince',
      'La ventilation interne : le risque de taux logé dans le zéro-coupon part à la trésorerie et au desk de taux — chaque risque du produit a un propriétaire dans la banque ; la marge, elle, est encaissée à l\'émission (valeur 97-99, publiée au KID)',
      'La conclusion en carte : le client porte ce qu\'il a vendu — la chute, la dispersion, la signature ; le desk garde ce qui ne se transfère pas ; « personne » ne porte rien — un risque sans propriétaire nommé est un risque mal compris, et l\'oral se gagne en nommant ceux que la brochure tait',
    ],
    pointsAttendusEn: [
      'The prior translation of the coupon: 12% against a risk-free rate of 3 to 5% — the gap is the rent of the risks sold; the coupon is not chosen, it is solved such that price + margin = 100, and three fuels inflate it: the three indices\' volatility, their decorrelation, their dividends',
      'The exact bricks: zero-coupon for the notional + memory digitals for the coupons + worst-of down-and-in put sold by the client (strike at the initial level, 60% barrier on the worst performance) — the worst-of DIP is worth about double the single-index one at ρ = 0.5: that supplement is what pays the 12%',
      'The client\'s risks: the cliff on the WORST of the three (touch probability increased by dispersion — 1.25% versus 0.62% already on two twins), correlations rising towards 1 in a crisis (diversification vanishes when he counts on it), issuer risk (the product is debt), the perverse duration (short if it rises, long if it falls)',
      'The desk\'s risks, kept because non-transferable: long dividends on the three price indices (March 2020), short correlation (it loses when correlation rises, and spends its life buying it back), explosive gamma and vega near the barriers (Korea) — plus model risk: the lognormal pricer sees the left tail too thin',
      'The internal allocation: the rate risk housed in the zero-coupon goes to treasury and the rates desk — every risk in the product has an owner inside the bank; the margin is pocketed at issuance (value 97-99, published in the KID)',
      'The conclusion as a map: the client carries what he sold — the crash, the dispersion, the signature; the desk keeps what cannot be transferred; "nobody" carries nothing — a risk without a named owner is a misunderstood risk, and the oral is won by naming the ones the brochure keeps quiet',
    ],
    bonus: [
      'Le stress combiné qui fait la vraie question de jury : en krach, les jambes du desk perdent ensemble — dividendes coupés, corrélation à 1, barrières cassées, produits qui s\'allongent : mars 2020 est la démonstration grandeur nature de cette carte des risques',
      'La question retour à poser au client : parmi les trois indices, lequel est là pour ses qualités propres — et lequel pour sa décorrélation ? Un panier hétéroclite, sans logique économique commune, est souvent un panier fabriqué pour maximiser la dispersion vendue',
    ],
    bonusEn: [
      'The combined stress that makes the real jury question: in a crash, the desk\'s legs lose together — dividends cut, correlation at 1, barriers smashed, products lengthening: March 2020 is the full-scale demonstration of this risk map',
      'The return question to ask the client: among the three indices, which one is there for its own merits — and which for its decorrelation? A motley basket, with no common economic logic, is often a basket built to maximise the dispersion sold',
    ],
    reponseModele: `Avant de décomposer, je traduis le chiffre en gros caractères : **12 % quand le taux sans risque est à 3-5 %** — sept à neuf points d'écart qui sont, par construction, le loyer de risques vendus. Le coupon n'a pas été choisi : il a été **résolu**, tel que prix + marge = 100 avec les paramètres du jour, et trois carburants le gonflent — la volatilité des trois indices, leur décorrélation, leurs dividendes. Un coupon pareil est un thermomètre : le marché paie cher l'assurance que ce client s'apprête à vendre.

Les briques, dans l'ordre des flux. Un **zéro-coupon** porte le nominal. Des **digitales à effet mémoire** portent les coupons conditionnels aux dates d'observation. Et la clause de remboursement dégradé est un **put down-and-in worst-of vendu par le client** — strike au niveau initial, barrière 60 % suivie sur la *pire* des trois performances. C'est la brique qui paie presque tout : à corrélation 0,5, un DIP worst-of vaut environ le double de son équivalent mono-indice — ce supplément, recyclé, fabrique le 12 %.

Qui porte quoi ? **Le client** porte quatre risques, dont deux qu'il ne sait pas nommer. Les nommés : la falaise — sous 60 % du pire indice à maturité, perte entière — et la signature de l'émetteur, car le produit est une dette. Les innommés : la **dispersion** — il suffit qu'un indice trébuche, et en crise les corrélations montent vers 1, la diversification s'évanouissant exactement quand il comptait dessus — et la **duration perverse** : remboursé tôt si le marché monte, collé cinq ans sans coupon s'il baisse. **Le desk**, lui, garde ce qui ne se transfère pas : il est **long dividendes** des trois indices de prix — mars 2020 a chiffré ce risque —, **court corrélation** — il perd quand elle monte et passe sa vie à en racheter —, et il porte les **grecques explosives** près des barrières — la Corée l'a montré —, plus le risque de modèle : son pricer lognormal voit la queue gauche trop mince. Le **taux**, logé dans le zéro-coupon, part à la trésorerie et au desk de taux. Et la **marge** — 1 à 3 points de valeur d'émission, publiés au KID — est encaissée le jour 1.

La chute : dans ce produit, « personne » n'est jamais la bonne réponse — chaque risque a un propriétaire, dans la banque ou chez le client, et un risque sans propriétaire nommé est simplement un risque mal compris. Le client porte ce qu'il a vendu ; le desk garde les chutes de fabrication ; et l'oral se gagne en nommant ceux que la brochure tait : la dispersion, les dividendes, la signature.`,
    reponseModeleEn: `Before decomposing, I translate the large-print number: **12% when the risk-free rate is at 3-5%** — seven to nine points of gap which are, by construction, the rent of risks sold. The coupon was not chosen: it was **solved**, such that price + margin = 100 with the day's parameters, and three fuels inflate it — the three indices' volatility, their decorrelation, their dividends. Such a coupon is a thermometer: the market pays dearly for the insurance this client is about to sell.

The bricks, in flow order. A **zero-coupon** carries the notional. **Memory digitals** carry the conditional coupons at the observation dates. And the degraded-redemption clause is a **worst-of down-and-in put sold by the client** — strike at the initial level, 60% barrier tracked on the *worst* of the three performances. That is the brick that pays for almost everything: at 0.5 correlation, a worst-of DIP is worth about double its single-index equivalent — that supplement, recycled, manufactures the 12%.

Who carries what? **The client** carries four risks, two of which he cannot name. The named ones: the cliff — below 60% of the worst index at maturity, the entire loss — and the issuer's signature, because the product is debt. The unnamed ones: the **dispersion** — one index stumbling suffices, and in a crisis correlations rise towards 1, diversification vanishing exactly when he counted on it — and the **perverse duration**: redeemed early if the market rises, stuck five years without coupons if it falls. **The desk** keeps what cannot be transferred: it is **long dividends** on the three price indices — March 2020 put a number on that risk —, **short correlation** — it loses when correlation rises and spends its life buying it back —, and it carries the **explosive Greeks** near the barriers — Korea demonstrated it —, plus model risk: its lognormal pricer sees the left tail too thin. The **rate**, housed in the zero-coupon, goes to treasury and the rates desk. And the **margin** — 1 to 3 points of issuance value, published in the KID — is pocketed on day 1.

The closing line: in this product, "nobody" is never the right answer — every risk has an owner, inside the bank or with the client, and a risk without a named owner is simply a misunderstood risk. The client carries what he sold; the desk keeps the manufacturing offcuts; and the oral is won by naming the ones the brochure keeps quiet: the dispersion, the dividends, the signature.`,
  },
  {
    id: 'm9-j-25',
    moduleId: M9,
    theme: 'la promesse en briques',
    themeEn: 'the promise in building blocks',
    difficulte: 4,
    question: 'Dans cette industrie, le desk est-il le casino — ou l\'assureur ?',
    questionEn: 'In this industry, is the desk the casino — or the insurer?',
    plan: [
      'Éliminer le casino : le desk ne parie pas contre le client — briques achetées, delta-hedging de bout en bout, marge verrouillée le jour 1, identique à +50 % ou −50 %',
      'Renverser les rôles : l\'assureur, c\'est le CLIENT — tout coupon au-dessus du taux sans risque est le prix d\'un risque vendu ; primes régulières, sinistre rare et lourd : le profil du module 8, souvent sans le savoir',
      'Nuancer, car c\'est là que se joue la copie : le desk n\'est pas sans risque — il garde ce qui ne se transfère pas : dividendes, corrélation, grecques des barrières ; un péage en temps calme, un porteur de risques concentrés en crise',
      'Conclure : ni casino ni assureur — une usine à transférer des risques, qui prélève un péage et garde les chutes de fabrication ; mars 2020 a montré ce que valent ces chutes quand toute une place les garde du même côté',
    ],
    planEn: [
      'Eliminate the casino: the desk does not bet against the client — bricks bought, delta-hedging end to end, margin locked on day 1, identical at +50% or −50%',
      'Reverse the roles: the insurer is the CLIENT — any coupon above the risk-free rate is the price of a risk sold; regular premiums, rare heavy loss: the module 8 profile, often unknowingly',
      'Nuance, for that is where the answer is graded: the desk is not risk-free — it keeps what cannot be transferred: dividends, correlation, barrier Greeks; a tollbooth in calm weather, a carrier of concentrated risks in a crisis',
      'Conclude: neither casino nor insurer — a risk-transfer factory that takes a toll and keeps the manufacturing offcuts; March 2020 showed what those offcuts are worth when a whole market keeps them on the same side',
    ],
    pointsAttendus: [
      'Contre le casino : la banque n\'est pas la contrepartie économique du client — ce que la formule promet, les briques achetées le versent ; le desk delta-hedge, et sa marge est la même que l\'indice finisse à +50 % ou −50 % : il fabrique, il ne parie pas',
      'Le renversement qui structure la réponse : dans le structuré moderne — reverse convertible, autocall — c\'est le client qui vend l\'assurance : primes déguisées en coupons, sinistre rare et dévastateur sous la barrière — l\'assureur du module 8, souvent sans le savoir',
      'La nuance qui fait la différence : le desk garde les risques non transférables — long dividendes (couverture en forward d\'indices de prix), court corrélation (long les puts worst-of), gamma et vega concentrés près des barrières : des risques réels, rémunérés par la marge, pas par un pari directionnel',
      'Le troisième personnage que la question oublie : le distributeur — rémunéré aux volumes, incité à la vitrine attrayante ; le vrai conflit d\'intérêts de l\'industrie est là, dans la lisibilité, pas dans la direction du marché',
      'La limite systémique de la métaphore du péage : quand toute une place garde les mêmes risques du même côté — Corée 2015, mars 2020 — le desk se découvre assureur malgré lui, et le péage ne couvre pas un événement de place',
      'La formule finale : casino jamais — les cotes sont publiques et le desk ne joue pas contre vous ; assureur à fronts renversés — le client assure le marché contre la chute, le desk réassure les paramètres invisibles ; le déséquilibre n\'est pas dans les cotes, il est dans la lecture',
    ],
    pointsAttendusEn: [
      'Against the casino: the bank is not the client\'s economic counterparty — what the formula promises, the purchased bricks pay; the desk delta-hedges, and its margin is the same whether the index ends at +50% or −50%: it manufactures, it does not bet',
      'The reversal that structures the answer: in the modern structured product — reverse convertible, autocall — it is the client who sells the insurance: premiums disguised as coupons, a rare devastating loss below the barrier — the module 8 insurer, often unknowingly',
      'The nuance that makes the difference: the desk keeps the non-transferable risks — long dividends (forward hedges on price indices), short correlation (long the worst-of puts), gamma and vega concentrated near the barriers: real risks, remunerated by the margin, not by a directional bet',
      'The third character the question forgets: the distributor — paid on volumes, incentivised towards the attractive shop window; the industry\'s real conflict of interest is there, in readability, not in market direction',
      'The systemic limit of the tollbooth metaphor: when a whole market keeps the same risks on the same side — Korea 2015, March 2020 — the desk discovers itself an insurer in spite of itself, and the toll does not cover a market-wide event',
      'The final formula: casino never — the odds are public and the desk does not play against you; insurer with reversed fronts — the client insures the market against the crash, the desk reinsures the invisible parameters; the imbalance is not in the odds, it is in the reading',
    ],
    bonus: [
      'L\'asymétrie qui est la vraie ligne de fracture : le desk sait exactement ce qu\'il garde et le mesure — grecques, stress tests, limites ; le client ignore souvent ce qu\'il a vendu — le déséquilibre de l\'industrie n\'est pas dans les probabilités, il est dans l\'information',
      'Le pont avec le module 8 : « le vendeur d\'options est-il un assureur ? » — même grille, un étage plus haut : dans le structuré, le client est devenu le vendeur, et le desk l\'intermédiaire qui recycle la prime en coupon — la boucle du cours se referme',
    ],
    bonusEn: [
      'The asymmetry that is the real fault line: the desk knows exactly what it keeps and measures it — Greeks, stress tests, limits; the client often does not know what he has sold — the industry\'s imbalance is not in the probabilities, it is in the information',
      'The bridge to module 8: "is the option seller an insurer?" — same grid, one floor up: in the structured product, the client has become the seller, and the desk the intermediary recycling the premium into coupon — the course\'s loop closes',
    ],
    reponseModele: `Éliminons d'abord le casino, car l'image ne résiste pas à la mécanique. Un casino gagne parce que ses clients perdent ; le desk, lui, n'est pas la contrepartie économique du client : ce que la formule promet, les briques achetées le versent, et le desk d'options en face delta-hedge de bout en bout. Sa rémunération est la **marge**, verrouillée le jour de l'émission — identique que l'indice finisse à +50 % ou à −50 %. Le desk fabrique, il ne parie pas. Si casino il y a, les cotes sont publiées au KID.

L'assureur, alors ? Oui — mais **à fronts renversés**, et c'est le cœur de la réponse. Dans le structuré moderne — reverse convertible, autocall — celui qui vend l'assurance, c'est le **client** : tout coupon au-dessus du taux sans risque est le prix d'un risque vendu ; il encaisse des primes déguisées en coupons et porte le sinistre rare et dévastateur sous la barrière. C'est le profil de l'assureur du module 8 — primes régulières, catastrophe rare — endossé le plus souvent sans le savoir. Le desk n'est pas l'assureur du client : il est le **courtier** qui fabrique la police, la vend, et recycle la prime en vitrine.

Mais la nuance qui fait la copie est que le desk ne sort pas indemne de sa propre usine. Il **garde ce qui ne se transfère pas** : long dividendes — sa couverture en forward encaisse ce que l'indice de prix ne reverse pas —, court corrélation — long les puts worst-of de ses clients, il perd quand tout corrèle —, porteur des grecques infernales près des barrières. Des risques réels, rémunérés par la marge, gérés par des limites — un **péage**, en temps calme. Sauf que le péage a une limite systémique : quand toute une place garde les mêmes risques du même côté, l'événement de marché remplace le paramètre de pricing — la Corée en 2016, et surtout **mars 2020**, où dividendes, corrélation et barrières ont frappé le même trimestre : le desk s'est découvert **assureur malgré lui**, réassureur en dernier ressort des paramètres que personne d'autre ne voulait porter. Et j'ajouterais le personnage que la question oublie : le **distributeur**, payé aux volumes — le vrai conflit d'intérêts de l'industrie est dans la lisibilité des vitrines, pas dans la direction du marché.

La chute : casino, jamais — personne ne joue contre vous. Assureur, oui, mais dans les deux sens d'une même police : le client assure le marché contre la chute, en connaissance de cause ou non ; le desk réassure les paramètres invisibles, et le découvre les années de crise. Le déséquilibre de cette industrie n'est pas dans les cotes — il est dans la **lecture** : le desk sait exactement ce qu'il garde ; le client, trop souvent, ignore ce qu'il a vendu.`,
    reponseModeleEn: `Eliminate the casino first, because the image does not survive the mechanics. A casino wins because its clients lose; the desk is not the client's economic counterparty: what the formula promises, the purchased bricks pay, and the options desk behind it delta-hedges end to end. Its pay is the **margin**, locked on issuance day — identical whether the index ends at +50% or −50%. The desk manufactures, it does not bet. If there is a casino, its odds are published in the KID.

The insurer, then? Yes — but **with reversed fronts**, and that is the heart of the answer. In the modern structured product — reverse convertible, autocall — the one selling the insurance is the **client**: any coupon above the risk-free rate is the price of a risk sold; he collects premiums disguised as coupons and carries the rare, devastating loss below the barrier. It is the module 8 insurer's profile — regular premiums, rare catastrophe — most often worn unknowingly. The desk is not the client's insurer: it is the **broker** that manufactures the policy, sells it, and recycles the premium into the shop window.

But the nuance that earns the grade is that the desk does not leave its own factory unscathed. It **keeps what cannot be transferred**: long dividends — its forward hedge collects what the price index does not pass on —, short correlation — long its clients' worst-of puts, it loses when everything correlates —, carrier of the infernal Greeks near the barriers. Real risks, remunerated by the margin, managed by limits — a **tollbooth**, in calm weather. Except the toll has a systemic limit: when a whole market keeps the same risks on the same side, the market event replaces the pricing parameter — Korea in 2016, and above all **March 2020**, when dividends, correlation and barriers struck in the same quarter: the desk discovered itself an **insurer in spite of itself**, reinsurer of last resort for the parameters nobody else would carry. And I would add the character the question forgets: the **distributor**, paid on volumes — the industry's real conflict of interest lies in the readability of the shop windows, not in the direction of the market.

The closing line: casino, never — nobody is playing against you. Insurer, yes, but in both directions of the same policy: the client insures the market against the crash, knowingly or not; the desk reinsures the invisible parameters, and finds out in crisis years. This industry's imbalance is not in the odds — it is in the **reading**: the desk knows exactly what it keeps; the client, too often, does not know what he has sold.`,
  },
];
