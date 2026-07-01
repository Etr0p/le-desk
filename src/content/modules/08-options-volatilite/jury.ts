import type { JuryQuestion } from '../../../engine/types';

const M8 = '08-options-volatilite';

export const jury: JuryQuestion[] = [
  {
    id: 'm8-j-01',
    moduleId: M8,
    theme: 'le droit sans l\'obligation',
    themeEn: 'the right without the obligation',
    difficulte: 1,
    question: 'Qu\'est-ce qu\'une option — et pourquoi coûte-t-elle une prime, là où le contrat ferme ne coûtait rien à la signature ?',
    questionEn: 'What is an option — and why does it cost a premium, when the firm contract cost nothing at signature?',
    plan: [
      'Définir les quatre mots : call, put, strike, prime — un droit sans obligation, acheté comptant',
      'Dessiner le payoff : max(S_T − K, 0) pour le call, max(K − S_T, 0) pour le put — le coude, là où le ferme ne traçait que des droites',
      'Poser l\'asymétrie : acheteur à perte bornée et gain ouvert, vendeur à gain plafonné et perte ouverte — un seul engagé, le vendeur',
      'Répondre à la seconde question : le ferme compense deux obligations symétriques (valeur initiale nulle) ; un droit sans obligation en face ne peut pas être gratuit',
    ],
    planEn: [
      'Define the four words: call, put, strike, premium — a right without obligation, bought for cash',
      'Draw the payoff: max(S_T − K, 0) for the call, max(K − S_T, 0) for the put — the kink, where the firm contract only drew straight lines',
      'State the asymmetry: buyer with bounded loss and open gain, seller with capped gain and open loss — only one side committed, the seller',
      'Answer the second question: the firm contract nets two symmetric obligations (zero initial value); a right with no obligation facing it cannot be free',
    ],
    pointsAttendus: [
      'La définition complète : le droit, sans l\'obligation, d\'acheter (call) ou de vendre (put) un sous-jacent à un prix fixé d\'avance — le strike — à ou jusqu\'à une échéance donnée ; ce droit se paie comptant : la prime',
      'Les payoffs à l\'échéance : max(S_T − K, 0) pour le call, max(K − S_T, 0) pour le put — l\'acheteur n\'exerce que si cela l\'arrange, sinon le droit meurt et l\'affaire s\'arrête là',
      'L\'asymétrie fondamentale : l\'acheteur risque au pire sa prime (perte bornée, payée d\'avance) contre un gain ouvert ; le vendeur encaisse la prime (gain plafonné) contre une perte ouverte — illimitée sur un call vendu nu',
      'Qui est engagé : le seul vendeur — l\'acheteur détient un droit et décide seul ; c\'est cette obligation unilatérale qui explique la prime',
      'Le contraste avec le module 7 : le dérivé ferme vaut zéro à la signature parce que deux obligations symétriques se font face — l\'option vaut toujours quelque chose, car un droit sans obligation en face ne peut pas être gratuit',
      'La carte d\'identité en une phrase : européenne (exercice à l\'échéance) contre américaine (à tout moment, vaut toujours au moins autant) ; listée standardisée (grille de strikes, quotité 100, chambre de compensation) contre OTC sur mesure',
    ],
    pointsAttendusEn: [
      'The complete definition: the right, without the obligation, to buy (call) or sell (put) an underlying at a price fixed in advance — the strike — at or until a given expiry; that right is paid for in cash: the premium',
      'The payoffs at expiry: max(S_T − K, 0) for the call, max(K − S_T, 0) for the put — the buyer only exercises if it suits him, otherwise the right dies and the matter ends there',
      'The fundamental asymmetry: the buyer risks at worst his premium (bounded loss, paid upfront) against an open gain; the seller collects the premium (capped gain) against an open loss — unlimited on a naked call',
      'Who is committed: the seller alone — the buyer holds a right and decides alone; that unilateral obligation is what explains the premium',
      'The contrast with module 7: the firm derivative is worth zero at signature because two symmetric obligations face each other — the option is always worth something, because a right with no obligation facing it cannot be free',
      'The identity card in one sentence: European (exercise at expiry only) versus American (any time, always worth at least as much); listed and standardised (strike grid, contract size of 100, clearing house) versus tailor-made OTC',
    ],
    bonus: [
      'L\'ancienneté qui surprend : Thalès de Milet réservant les pressoirs à huile contre un dépôt — un call raconté par Aristote ; le saut moderne date du CBOE, avril 1973, quelques semaines avant la formule de Black-Scholes-Merton',
      'La formule qui classe : « la prime est le prix de l\'asymétrie » — et le module entier ne fait qu\'en dérouler les conséquences, jusqu\'à coter l\'incertitude elle-même',
    ],
    bonusEn: [
      'The surprising age: Thales of Miletus reserving the oil presses against a deposit — a call recounted by Aristotle; the modern leap dates from the CBOE, April 1973, weeks before the Black-Scholes-Merton formula',
      'The line that ranks you: "the premium is the price of the asymmetry" — and the whole module merely unrolls its consequences, up to pricing uncertainty itself',
    ],
    reponseModele: `Une option donne à son acheteur le **droit, sans l'obligation**, d'acheter — c'est le call — ou de vendre — c'est le put — un sous-jacent à un prix fixé d'avance, le strike, à une échéance donnée. Ce droit se paie comptant : la prime. Le détenteur n'exercera que si cela l'arrange : à l'échéance, le contrat verse max(S_T − K, 0) pour le call, max(K − S_T, 0) pour le put — une demi-droite et un plancher à zéro, coudés au strike. Là où le module 7 ne traçait que des droites, l'option introduit un **coude** : sa signature graphique.

Ce coude fonde une asymétrie de risque. L'acheteur risque, au pire, sa prime : perte bornée, connue, payée d'avance — et un gain ouvert, illimité pour un call. Le vendeur vit le miroir exact : gain plafonné à la prime encaissée, perte ouverte — illimitée s'il a vendu un call sans détenir le titre. Et une seule partie reste engagée : le vendeur, qui subit la décision de l'acheteur jusqu'au bout.

D'où la réponse à votre seconde question. Le contrat ferme vaut zéro à la signature parce que deux obligations symétriques s'y font face — le prix à terme est calibré exactement pour cela. Dans l'option, l'un a tous les droits, l'autre toutes les obligations : **un droit sans obligation en face ne peut pas être gratuit**. La prime est le prix de cette asymétrie.

Le vocabulaire pour finir : exercice à l'échéance seule pour l'européenne, à tout moment pour l'américaine — qui vaut toujours au moins autant, à droits supplémentaires prix supérieur ou égal ; négociation listée et standardisée — grille de strikes, quotité de 100, chambre de compensation — ou OTC sur mesure. La chute : obligation contre droit, gratuité contre prime, droite contre coude — l'ADN de l'option tient en trois oppositions.`,
    reponseModeleEn: `An option gives its buyer the **right, without the obligation**, to buy — the call — or to sell — the put — an underlying at a price fixed in advance, the strike, at a given expiry. That right is paid for in cash: the premium. The holder will only exercise if it suits him: at expiry, the contract pays max(S_T − K, 0) for the call, max(K − S_T, 0) for the put — a half-line and a floor at zero, kinked at the strike. Where module 7 only drew straight lines, the option introduces a **kink**: its graphic signature.

That kink founds an asymmetry of risk. The buyer risks, at worst, his premium: a bounded loss, known, paid upfront — against an open gain, unlimited for a call. The seller lives the exact mirror: gain capped at the premium collected, open loss — unlimited if he sold a call without holding the stock. And only one side remains committed: the seller, who endures the buyer's decision to the very end.

Hence the answer to your second question. The firm contract is worth zero at signature because two symmetric obligations face each other — the forward price is calibrated exactly for that. In an option, one side holds all the rights and the other all the obligations: **a right with no obligation facing it cannot be free**. The premium is the price of that asymmetry.

The vocabulary to finish: exercise at expiry only for the European style, at any time for the American — which is always worth at least as much, since extra rights cannot cost less; listed and standardised trading — strike grid, contract size of 100, clearing house — or tailor-made OTC. The closing line: obligation versus right, free versus premium, straight line versus kink — the option's DNA fits in three oppositions.`,
  },
  {
    id: 'm8-j-02',
    moduleId: M8,
    theme: 'le droit sans l\'obligation',
    themeEn: 'the right without the obligation',
    difficulte: 2,
    question: 'L\'action cote 100. Le call de strike 120 ne rapporterait rien si l\'on exerçait aujourd\'hui — et pourtant il cote, et se traite. Expliquez.',
    questionEn: 'The stock trades at 100. The 120-strike call would pay nothing if exercised today — and yet it has a price, and it trades. Explain.',
    plan: [
      'Découper la prime : valeur intrinsèque (ce que rapporterait l\'exercice immédiat) plus valeur temps (le prix de ce qui peut encore arriver)',
      'Situer le call 120 : hors de la monnaie, intrinsèque nulle — sa prime est de la valeur temps à l\'état pur : la chance de dépasser 120 se paie',
      'Poser la grille de moneyness : ITM, ATM, OTM — et l\'exemple canonique : ATM, le call à 10,45 est 100 % valeur temps',
      'Expliquer le sommet ATM : très ITM ou très OTM, le sort est presque joué ; à la monnaie, chaque mouvement peut tout faire basculer — le droit de choisir culmine',
    ],
    planEn: [
      'Split the premium: intrinsic value (what immediate exercise would pay) plus time value (the price of what can still happen)',
      'Place the 120 call: out of the money, zero intrinsic — its premium is pure time value: the chance of clearing 120 is worth money',
      'Lay out the moneyness grid: ITM, ATM, OTM — and the canonical example: ATM, the 10.45 call is 100% time value',
      'Explain the ATM peak: deep ITM or deep OTM, the outcome is almost settled; at the money, every move can tip the scales — the right to choose peaks',
    ],
    pointsAttendus: [
      'La décomposition à réciter : prime = valeur intrinsèque + valeur temps — l\'intrinsèque vaut max(S − K, 0) pour un call, max(K − S, 0) pour un put',
      'La moneyness : ITM quand exercer rapporterait (S > K pour un call), ATM quand S ≈ K, OTM quand exercer n\'aurait aucun sens — et l\'intrinsèque est nulle pour toute option ATM ou OTM',
      'Le call 120 sur une action à 100 : OTM, intrinsèque nulle, prime entièrement de la valeur temps — il reste une chance que l\'action dépasse 120 avant l\'échéance, et cette chance se paie',
      'L\'exemple canonique : action 100, call strike 100, un an, taux 5 %, vol 20 % — prime 10,45, intrinsèque zéro : plus de 10 % du prix de l\'action pour le seul droit de choisir dans un an',
      'Le sommet ATM : très ITM, l\'option se comporte presque comme le sous-jacent (l\'optionnalité n\'ajoute rien) ; très OTM, elle ne sera presque sûrement jamais exercée ; à la monnaie, l\'incertitude est entière et le droit de choisir atteint sa pleine valeur',
      'La dynamique : la valeur temps fond à mesure que l\'échéance approche et tombe à zéro au terme — la prime rejoint alors la valeur intrinsèque : c\'est le sens même du payoff',
    ],
    pointsAttendusEn: [
      'The decomposition to recite: premium = intrinsic value + time value — intrinsic is max(S − K, 0) for a call, max(K − S, 0) for a put',
      'Moneyness: ITM when exercising would pay (S > K for a call), ATM when S ≈ K, OTM when exercising would make no sense — and intrinsic value is zero for any ATM or OTM option',
      'The 120 call on a stock at 100: OTM, zero intrinsic, premium entirely time value — there remains a chance the stock clears 120 before expiry, and that chance is worth money',
      'The canonical example: stock 100, strike 100, one year, 5% rate, 20% vol — premium 10.45, zero intrinsic: over 10% of the stock price for the mere right to choose in a year',
      'The ATM peak: deep ITM, the option behaves almost like the underlying (optionality adds nothing); deep OTM, it will almost surely never be exercised; at the money, uncertainty is whole and the right to choose reaches full value',
      'The dynamics: time value melts as expiry approaches and hits zero at the end — the premium then meets the intrinsic value: that is the very meaning of the payoff',
    ],
    bonus: [
      'L\'annonce du chapitre 5 : gamma et vega — les sensibilités qui mesurent l\'optionnalité — culminent exactement là où la valeur temps culmine : à la monnaie',
      'Anticiper la relance symétrique : une option ITM ne « vaut » pas sa seule intrinsèque — la coter ainsi, c\'est brader la valeur temps qu\'elle contient encore ; le réflexe propre : toute prime se découpe en deux',
    ],
    bonusEn: [
      'The chapter 5 preview: gamma and vega — the sensitivities that measure optionality — peak exactly where time value peaks: at the money',
      'Anticipate the symmetric follow-up: an ITM option is not "worth" its intrinsic alone — quoting it so gives away the time value it still contains; the clean reflex: every premium splits in two',
    ],
    reponseModele: `Parce qu'une prime ne se réduit jamais à ce que rapporterait l'exercice immédiat. Le réflexe propre, devant n'importe quelle cotation : la découper en deux — **prime = valeur intrinsèque + valeur temps**. L'intrinsèque est le produit de l'exercice immédiat : max(S − K, 0) pour un call. Sur votre exemple : max(100 − 120, 0) = zéro — le call est **hors de la monnaie**, personne n'achète à 120 ce qui en vaut 100.

Et pourtant il cote, parce que le temps qui reste vaut de l'argent. Tant qu'il y a du temps et de la volatilité, l'action peut dépasser 120 — et le droit de choisir *après avoir vu* se paie. La prime du call 120 est de la **valeur temps à l'état pur** : le prix d'une chance. Le marché range cela dans trois sigles : ITM quand exercer rapporterait, ATM quand le spot colle au strike, OTM quand exercer n'aurait aucun sens — et l'intrinsèque est nulle partout sauf ITM.

L'exemple canonique du cours chiffre l'enjeu : action à 100, strike 100, un an, taux 5 %, volatilité 20 % — le call cote 10,45 pour une intrinsèque de zéro. Plus de 10 % du prix de l'action pour le seul droit de choisir dans un an.

Et c'est précisément **à la monnaie que la valeur temps culmine**. Très dans la monnaie, l'option se comporte presque comme le sous-jacent — son sort est quasi joué, l'optionnalité n'ajoute rien ; très en dehors, le droit ne vaut presque rien. À la monnaie, chaque mouvement peut faire basculer l'option d'un côté ou de l'autre du strike : l'incertitude est entière, le droit de choisir vaut son maximum — gamma et vega, qui mesurent cette optionnalité, culmineront exactement là. À l'échéance enfin, le temps est épuisé : la valeur temps tombe à zéro et la prime rejoint le payoff. La chute : hors de la monnaie ne veut pas dire sans valeur — cela veut dire que toute la valeur est du temps.`,
    reponseModeleEn: `Because a premium is never just what immediate exercise would pay. The clean reflex, in front of any quote: split it in two — **premium = intrinsic value + time value**. Intrinsic is the product of immediate exercise: max(S − K, 0) for a call. On your example: max(100 − 120, 0) = zero — the call is **out of the money**; nobody buys at 120 what is worth 100.

And yet it trades, because the time that remains is worth money. As long as there is time and volatility, the stock can clear 120 — and the right to choose *after having seen* is worth paying for. The 120 call's premium is **pure time value**: the price of a chance. The market files this under three acronyms: ITM when exercising would pay, ATM when spot sits on the strike, OTM when exercising would make no sense — and intrinsic value is zero everywhere except ITM.

The course's canonical example puts a number on it: stock at 100, strike 100, one year, 5% rate, 20% volatility — the call quotes 10.45 for zero intrinsic. More than 10% of the stock price for the mere right to choose in a year.

And it is precisely **at the money that time value peaks**. Deep in the money, the option behaves almost like the underlying — its fate is nearly sealed, optionality adds almost nothing; deep out, the right is worth almost nothing. At the money, every move can tip the option to either side of the strike: uncertainty is whole, the right to choose is at its maximum — gamma and vega, which measure that optionality, will peak exactly there. At expiry, finally, time is exhausted: time value falls to zero and the premium meets the payoff. The closing line: out of the money does not mean worthless — it means all the value is time.`,
  },
  {
    id: 'm8-j-03',
    moduleId: M8,
    theme: 'le droit sans l\'obligation',
    themeEn: 'the right without the obligation',
    difficulte: 4,
    question: 'Le vendeur d\'options est-il un assureur ?',
    questionEn: 'Is the option seller an insurer?',
    plan: [
      'Accorder la structure : primes certaines contre sinistre incertain — gain plafonné, perte ouverte, la définition même du métier d\'assureur',
      'Chiffrer la rémunération : la volatilité implicite dépasse en moyenne la réalisée — la prime de risque de volatilité est le surcoût actuariel de toute assurance',
      'Marquer la limite : l\'assureur classique diversifie des sinistres indépendants ; le vendeur de volatilité porte un risque systématique — le jour du krach, tout corrèle',
      'Conclure en professionnel : oui par le profil — à condition d\'en accepter le métier entier : taille calibrée sur la perte, limites de grecques, trésorerie pour le pire scénario',
    ],
    planEn: [
      'Concede the structure: certain premiums against an uncertain loss — capped gain, open loss, the very definition of the insurance business',
      'Quantify the pay: implied volatility exceeds realised on average — the volatility risk premium is the actuarial mark-up of any insurance',
      'Draw the limit: the classic insurer diversifies independent claims; the volatility seller carries a systematic risk — on crash day, everything correlates',
      'Conclude as a professional: yes by profile — provided you accept the whole trade: size calibrated on the loss, Greek limits, cash for the worst scenario',
    ],
    pointsAttendus: [
      'La structure du P&L : le vendeur encaisse des primes certaines contre un sinistre incertain — gain au plus la prime, perte ouverte : une longue série de petits gains réguliers, puis une perte rare et massive',
      'L\'image du métier, à ressortir telle quelle : « ramasser des pièces devant un rouleau compresseur » — et le piège statistique : trois années calmes ne prouvent pas l\'absence de risque, seulement l\'absence de sinistre',
      'La rémunération existe et se mesure : la volatilité implicite dépasse en moyenne la réalisée ultérieure — la prime de risque de volatilité, exact analogue du surcoût actuariel d\'une prime d\'assurance',
      'La différence décisive avec l\'assureur incendie : ses sinistres sont indépendants, la loi des grands nombres travaille pour lui ; le vendeur d\'options sur indices porte un risque de queue systématique — le jour du krach, les corrélations montent vers 1 et toutes les positions perdent ensemble (LTCM 1998)',
      'La seconde différence : l\'assureur est régulé, provisionné, réassuré ; le vendeur de volatilité amateur (XIV, 2018) vend la même protection sans fonds propres ni provisions — l\'accident n\'est qu\'une question de date',
      'La synthèse attendue : oui, c\'est le même métier — et c\'est justement pourquoi il exige les disciplines de l\'assureur : taille calibrée sur le pire scénario, limites de vega et de gamma, trésorerie capable d\'encaisser le sinistre',
    ],
    pointsAttendusEn: [
      'The P&L structure: the seller collects certain premiums against an uncertain loss — gain at most the premium, open loss: a long series of small regular gains, then a rare, massive loss',
      'The trade\'s image, to quote verbatim: "picking up pennies in front of a steamroller" — and the statistical trap: three calm years prove no absence of risk, only an absence of claims',
      'The pay exists and is measurable: implied volatility exceeds subsequently realised volatility on average — the volatility risk premium, the exact analogue of the actuarial mark-up in an insurance premium',
      'The decisive difference with the fire insurer: his claims are independent, the law of large numbers works for him; the index option seller carries a systematic tail risk — on crash day, correlations rise towards 1 and every position loses together (LTCM 1998)',
      'The second difference: the insurer is regulated, provisioned, reinsured; the amateur volatility seller (XIV, 2018) sells the same protection with no capital and no reserves — the accident is only a matter of date',
      'The expected synthesis: yes, it is the same business — and that is exactly why it demands the insurer\'s disciplines: size calibrated on the worst scenario, vega and gamma limits, cash able to absorb the claim',
    ],
    bonus: [
      'Le contrepoint Buffett : Berkshire a vendu des puts géants à très long terme — mais sans appels de marge quotidiens, avec un bilan d\'assureur derrière : le profil assumé par quelqu\'un qui en a les moyens',
      'Anticiper la relance : « alors pourquoi ne pas interdire la vente d\'options ? » — parce qu\'assurer est un service : sans vendeurs, pas de protection à acheter ; le problème n\'est jamais le métier, c\'est de l\'exercer sans fonds propres',
    ],
    bonusEn: [
      'The Buffett counterpoint: Berkshire sold giant very-long-dated puts — but without daily margin calls, with an insurer\'s balance sheet behind: the profile assumed by someone with the means',
      'Anticipate the follow-up: "then why not ban option selling?" — because insuring is a service: without sellers, no protection to buy; the problem is never the business, it is running it without capital',
    ],
    reponseModele: `Structurellement, oui — et le cours le dit dès le premier chapitre : vendre une option, c'est vendre de l'assurance. Le vendeur encaisse des primes certaines contre un sinistre incertain : gain plafonné à la prime, perte ouverte. Sa signature de P&L est celle d'une compagnie d'assurance : une **longue série de petits gains réguliers, puis une perte rare et massive**. Le métier a une image pour cela : ramasser des pièces devant un rouleau compresseur.

Il en a aussi la rémunération, et elle se mesure : la volatilité implicite dépasse **en moyenne** la volatilité ensuite réalisée. Cette prime de risque de volatilité est l'exact analogue du surcoût actuariel d'une prime d'assurance : l'acheteur de protection surpaie un peu pour être couvert le jour où tout casse ; le vendeur exige cette marge pour porter la queue de distribution.

Mais je marquerais deux différences, et c'est là que la question se gagne. L'assureur incendie diversifie des sinistres **indépendants** : la loi des grands nombres travaille pour lui. Le vendeur de volatilité sur indices porte un risque **systématique** : le jour du krach, les corrélations montent vers 1 et ses dix positions perdent ensemble — LTCM, piloté par les inventeurs mêmes du modèle, l'a appris en 1998. Ensuite, l'assureur est régulé, provisionné, réassuré ; le porteur de XIV en 2018 vendait la même protection sans fonds propres — le VIX a bondi de 115 % en une séance, le produit a perdu 96 % et disparu.

Ma réponse de synthèse : **oui, c'est le même métier — et c'est précisément pourquoi il exige les disciplines de l'assureur**. Taille calibrée sur le pire scénario et non sur la prime espérée, limites de vega et de gamma posées avant, trésorerie capable d'encaisser le sinistre. Vendre de l'assurance est légitime ; la vendre sans bilan d'assureur est la matière première de tous les accidents du module.`,
    reponseModeleEn: `Structurally, yes — and the course says it from chapter one: selling an option is selling insurance. The seller collects certain premiums against an uncertain loss: gain capped at the premium, open loss. His P&L signature is an insurance company's: a **long series of small regular gains, then a rare, massive loss**. The trade has an image for it: picking up pennies in front of a steamroller.

He also gets the insurer's pay, and it is measurable: implied volatility exceeds **on average** the volatility subsequently realised. That volatility risk premium is the exact analogue of the actuarial mark-up in an insurance premium: the protection buyer slightly overpays to be covered the day everything breaks; the seller demands that margin to carry the tail of the distribution.

But I would mark two differences, and this is where the question is won. The fire insurer diversifies **independent** claims: the law of large numbers works for him. The index volatility seller carries a **systematic** risk: on crash day, correlations rise towards 1 and his ten positions lose together — LTCM, run by the very inventors of the model, learned it in 1998. Next, the insurer is regulated, provisioned, reinsured; the XIV holder in 2018 was selling the same protection with no capital — the VIX jumped 115% in one session, the product lost 96% and disappeared.

My summary answer: **yes, it is the same business — and that is precisely why it demands the insurer's disciplines**. Size calibrated on the worst scenario rather than the hoped-for premium, vega and gamma limits set beforehand, cash able to absorb the claim. Selling insurance is legitimate; selling it without an insurer's balance sheet is the raw material of every accident in this module.`,
  },
  {
    id: 'm8-j-04',
    moduleId: M8,
    theme: 'payoffs et stratégies',
    themeEn: 'payoffs and strategies',
    difficulte: 2,
    question: 'Vous avez payé 4 un call de strike 100. À l\'échéance, l\'action cote 103. Exercez-vous — et gagnez-vous de l\'argent ?',
    questionEn: 'You paid 4 for a 100-strike call. At expiry, the stock trades at 103. Do you exercise — and do you make money?',
    plan: [
      'Distinguer les deux objets : le payoff est ce que verse le contrat, le P&L retranche la prime — P&L = payoff − prime',
      'Répondre au premier verbe : oui, on exerce — récupérer 3 vaut mieux que rien',
      'Répondre au second : non, on perd 1 — le seuil de profit est le point mort, strike plus prime = 104, pas le strike',
      'Découper les trois zones : sous 100, perte de la prime entière ; entre 100 et 104, exercer réduit la perte ; au-delà de 104 seulement, le profit commence',
    ],
    planEn: [
      'Separate the two objects: the payoff is what the contract pays, the P&L subtracts the premium — P&L = payoff − premium',
      'Answer the first verb: yes, you exercise — recovering 3 beats nothing',
      'Answer the second: no, you lose 1 — the profit threshold is the break-even, strike plus premium = 104, not the strike',
      'Cut the three zones: below 100, the whole premium is lost; between 100 and 104, exercising reduces the loss; beyond 104 only, profit begins',
    ],
    pointsAttendus: [
      'La distinction fondatrice : payoff = max(S_T − K, 0), toujours positif ou nul pour le détenteur ; P&L = payoff − prime — la prime décale la crosse de hockey vers le bas, l\'acheteur part de −4',
      'À 103 : payoff = 3, on exerce — acheter à 100 ce qui en vaut 103 réduit la perte ; mais P&L = 3 − 4 = −1 : dans la monnaie, exercé, et pourtant perdant',
      'Le point mort : strike + prime = 104 pour un call (strike − prime pour un put) — c\'est lui, pas le strike, qui sépare gain et perte',
      'Les trois zones à réciter : sous 100, le droit meurt et la perte est la prime entière (−4) ; entre 100 et 104, on exerce pour réduire la perte ; au-delà de 104, le profit commence',
      'Le miroir du vendeur : son P&L est l\'opposé exact — au point mort, personne ne gagne ni ne perd, des deux côtés du contrat ; l\'option reste un jeu à somme nulle',
      'La faute d\'oral que la question débusque : « j\'exerce donc je gagne » — exercer n\'est pas gagner, c\'est optimiser',
    ],
    pointsAttendusEn: [
      'The founding distinction: payoff = max(S_T − K, 0), always positive or zero for the holder; P&L = payoff − premium — the premium shifts the hockey stick down, the buyer starts at −4',
      'At 103: payoff = 3, you exercise — buying at 100 what is worth 103 reduces the loss; but P&L = 3 − 4 = −1: in the money, exercised, and yet losing',
      'The break-even: strike + premium = 104 for a call (strike − premium for a put) — that, not the strike, separates gain from loss',
      'The three zones to recite: below 100, the right dies and the loss is the whole premium (−4); between 100 and 104, you exercise to reduce the loss; beyond 104, profit begins',
      'The seller\'s mirror: his P&L is the exact opposite — at the break-even, nobody gains or loses, on either side of the contract; the option remains a zero-sum game',
      'The oral mistake this question flushes out: "I exercise therefore I win" — exercising is not winning, it is optimising',
    ],
    bonus: [
      'La généralisation immédiate : les points morts d\'un straddle acheté 10 au strike 100 sont 90 et 110 — même grammaire, prime totale de part et d\'autre du strike',
      'Anticiper la relance : « et si vous aviez payé le call 4 pour le revendre avant l\'échéance ? » — avant le terme, la valeur temps n\'est pas morte : on ne compare plus au payoff mais au prix de marché',
    ],
    bonusEn: [
      'The immediate generalisation: the break-evens of a straddle bought for 10 at strike 100 are 90 and 110 — same grammar, total premium either side of the strike',
      'Anticipate the follow-up: "and if you had paid 4 to resell the call before expiry?" — before the end, time value is not dead: you no longer compare to the payoff but to the market price',
    ],
    reponseModele: `Les deux réponses ne coïncident pas, et c'est tout l'intérêt de la question : **j'exerce, et je perds de l'argent**.

D'abord les deux objets, à ne jamais confondre. Le **payoff** est ce que verse le contrat : max(S_T − K, 0), ici max(103 − 100, 0) = 3. Le **P&L** retranche ce que le droit a coûté : payoff moins prime, soit 3 − 4 = **−1**. Graphiquement, la prime décale la crosse de hockey vers le bas : l'acheteur part de −4, pas de zéro.

J'exerce donc — acheter à 100 ce qui en vaut 103, c'est récupérer 3, et 3 vaut mieux que rien. Mais exercer n'est pas gagner : c'est optimiser une position perdante. Le seuil de profit n'est pas le strike, c'est le **point mort** : strike plus prime, 100 + 4 = 104.

D'où les trois zones que je décrirais au tableau. Sous 100 : le droit meurt, perte de la prime entière, −4 — le maximum qu'un acheteur d'option puisse jamais perdre. Entre 100 et 104 : on exerce pour *réduire* la perte — ma situation à 103. Au-delà de 104 seulement : le profit commence. Et le vendeur vit le miroir exact de ces trois zones, point mort compris : au point mort, personne ne gagne ni ne perd — l'option reste un jeu à somme nulle.

La chute : « j'exerce donc je gagne » est la faute classique que cette question débusque. Dans la monnaie dit ce que verse le contrat ; le point mort dit si vous avez eu raison de le payer.`,
    reponseModeleEn: `The two answers do not coincide, and that is the whole point of the question: **I exercise, and I lose money**.

First, the two objects, never to be confused. The **payoff** is what the contract pays: max(S_T − K, 0), here max(103 − 100, 0) = 3. The **P&L** subtracts what the right cost: payoff minus premium, 3 − 4 = **−1**. Graphically, the premium shifts the hockey stick down: the buyer starts at −4, not at zero.

So I exercise — buying at 100 what is worth 103 recovers 3, and 3 beats nothing. But exercising is not winning: it is optimising a losing position. The profit threshold is not the strike, it is the **break-even**: strike plus premium, 100 + 4 = 104.

Hence the three zones I would draw on the board. Below 100: the right dies, the whole premium is lost, −4 — the most an option buyer can ever lose. Between 100 and 104: you exercise to *reduce* the loss — my situation at 103. Beyond 104 only: profit begins. And the seller lives the exact mirror of these three zones, break-even included: at the break-even, nobody gains or loses — the option remains a zero-sum game.

The closing line: "I exercise therefore I win" is the classic mistake this question is designed to flush out. In the money tells you what the contract pays; the break-even tells you whether you were right to pay for it.`,
  },
  {
    id: 'm8-j-05',
    moduleId: M8,
    theme: 'payoffs et stratégies',
    themeEn: 'payoffs and strategies',
    difficulte: 2,
    question: 'Des résultats tombent dans un mois. Vous êtes convaincu que le titre bougera fort — sans savoir dans quel sens. Que construisez-vous, et qu\'est-ce qui peut faire perdre le pari malgré tout ?',
    questionEn: 'Earnings are due in a month. You are convinced the stock will move sharply — without knowing which way. What do you build, and what can still make the bet lose?',
    plan: [
      'Nommer l\'instrument : le straddle — call et put achetés au même strike : un pari sur l\'amplitude, pas sur la direction',
      'Chiffrer : strike 100, call 6 plus put 4, coût 10 — points morts 90 et 110 : il faut sortir de la bande, bouger de plus de 10 %',
      'Identifier le pire scénario : l\'immobilité — à 100 pile, les deux jambes meurent ensemble, perte totale de 10',
      'Donner le piège de praticien : si l\'annonce est attendue de tous, les primes l\'ont déjà intégrée — il faut battre le mouvement pricé, pas zéro',
    ],
    planEn: [
      'Name the instrument: the straddle — call and put bought at the same strike: a bet on amplitude, not on direction',
      'Quantify: strike 100, call 6 plus put 4, cost 10 — break-evens 90 and 110: the stock must leave the band, move more than 10%',
      'Identify the worst scenario: stillness — at exactly 100, both legs die together, total loss of 10',
      'Give the practitioner\'s trap: if the announcement is expected by all, the premiums have already priced it — you must beat the priced move, not zero',
    ],
    pointsAttendus: [
      'Le straddle : call et put achetés au même strike, même échéance — à l\'échéance, l\'une des deux jambes paie l\'écart au strike quelle que soit la direction',
      'Les comptes : coût total 10 (call 6 + put 4), points morts K ± coût total = 90 et 110 — le titre doit bouger de plus de 10 % pour que le pari paie',
      'Le pire ennemi : le calme plat — à 100 pile, les deux jambes expirent sans valeur, perte maximale de 10 ; « gagner dans les deux sens » n\'est vrai que SI le mouvement est assez grand',
      'La variante : le strangle écarte les strikes (put 90, call 110) — moins cher, mais le mouvement requis est plus grand',
      'Le piège de praticien, décisif : les primes d\'avant-annonce intègrent déjà le mouvement attendu — la volatilité implicite est chère, et il faut battre le mouvement que le marché a pricé, pas zéro',
      'Le miroir : vendre le straddle, c\'est vendre du calme — assureur des deux côtés à la fois, gain plafonné au coût encaissé, perte ouverte dans les deux directions',
    ],
    pointsAttendusEn: [
      'The straddle: call and put bought at the same strike, same expiry — at expiry, one of the two legs pays the distance to the strike whatever the direction',
      'The accounts: total cost 10 (call 6 + put 4), break-evens K ± total cost = 90 and 110 — the stock must move more than 10% for the bet to pay',
      'The worst enemy: dead calm — at exactly 100, both legs expire worthless, maximum loss of 10; "winning both ways" is only true IF the move is big enough',
      'The variant: the strangle spreads the strikes (put 90, call 110) — cheaper, but the required move is larger',
      'The practitioner\'s trap, decisive: pre-announcement premiums already price the expected move — implied volatility is expensive, and you must beat the move the market has priced, not zero',
      'The mirror: selling the straddle is selling calm — an insurer on both sides at once, gain capped at the cost collected, open loss in both directions',
    ],
    bonus: [
      'Le vocabulaire qui annonce le chapitre 6 : ce « mouvement pricé » s\'appelle la volatilité implicite — acheter un straddle, c\'est acheter de la volatilité ; après l\'annonce, l\'implicite se dégonfle d\'un coup, et le straddle peut perdre même si le titre a bougé',
      'Anticiper la relance : « et si vous aviez une vue directionnelle en plus ? » — déplacer le strike, ou passer au call sec : chaque conviction a sa construction',
    ],
    bonusEn: [
      'The vocabulary that announces chapter 6: that "priced move" is called implied volatility — buying a straddle is buying volatility; after the announcement, the implied deflates at once, and the straddle can lose even though the stock moved',
      'Anticipate the follow-up: "and if you also had a directional view?" — move the strike, or switch to the outright call: every conviction has its construction',
    ],
    reponseModele: `La construction canonique est le **straddle** : acheter le call et le put au même strike, même échéance. À l'échéance, l'une des deux jambes paie l'écart au strike, quelle que soit la direction : c'est un pari sur l'**amplitude**, la direction est neutralisée par construction.

Chiffrons sur le cas du cours : strike 100, call à 6, put à 4 — coût total 10. Les points morts sont K ± coût total : **90 et 110**. Traduction : il faut que le titre sorte de la bande, bouge de plus de 10 %, pour que le pari paie. Et le pire scénario est l'immobilité : à 100 pile, les deux jambes meurent ensemble et je perds la totalité des 10. « Le straddle gagne dans les deux sens » est donc un demi-mensonge : il gagne dans les deux sens *si* le mouvement est assez grand. Variante plus économe : le strangle — put 90, call 110 — moins cher, mais la barre du mouvement monte d'autant.

Reste le piège de praticien, et c'est lui qui fait perdre les paris apparemment gagnés : si l'annonce est attendue de tous, **les primes l'ont déjà intégrée**. Le call à 6 et le put à 4 sont chers précisément parce que le marché price un grand mouvement. Mon vrai adversaire n'est pas zéro : c'est le mouvement pricé. Si le titre bouge de 7 % quand les primes en payaient 10, j'ai eu raison sur l'événement et j'ai perdu de l'argent.

La chute, qui ouvre le chapitre 6 : ce « mouvement pricé » a un nom — la volatilité implicite. Acheter un straddle, c'est acheter de la volatilité ; le vendre, c'est vendre du calme — le métier d'assureur, des deux côtés à la fois.`,
    reponseModeleEn: `The canonical construction is the **straddle**: buy the call and the put at the same strike, same expiry. At expiry, one of the two legs pays the distance to the strike, whatever the direction: it is a bet on **amplitude**; direction is neutralised by construction.

Put numbers on it with the course's case: strike 100, call at 6, put at 4 — total cost 10. The break-evens are K ± total cost: **90 and 110**. Translation: the stock must leave the band — move more than 10% — for the bet to pay. And the worst scenario is stillness: at exactly 100, both legs die together and I lose the full 10. "The straddle wins both ways" is thus a half-lie: it wins both ways *if* the move is big enough. The thriftier variant: the strangle — put 90, call 110 — cheaper, but the bar rises accordingly.

There remains the practitioner's trap, and it is what loses apparently won bets: if the announcement is expected by all, **the premiums have already priced it**. The call at 6 and the put at 4 are expensive precisely because the market prices a large move. My true opponent is not zero: it is the priced move. If the stock moves 7% when the premiums paid for 10, I was right about the event and I lost money.

The closing line, which opens chapter 6: that "priced move" has a name — implied volatility. Buying a straddle is buying volatility; selling it is selling calm — the insurance business, on both sides at once.`,
  },
  {
    id: 'm8-j-06',
    moduleId: M8,
    theme: 'payoffs et stratégies',
    themeEn: 'payoffs and strategies',
    difficulte: 2,
    question: 'Covered call, protective put, collar : pour chacun, que promettez-vous à votre client — et que lui faites-vous abandonner ?',
    questionEn: 'Covered call, protective put, collar: for each, what do you promise your client — and what do you make him give up?',
    plan: [
      'Poser la grammaire : ces stratégies n\'existent pas seules — elles habillent une position en actions existante, et tout revenu se paie d\'un morceau de profil',
      'Le covered call : action + call vendu — une prime encaissée quoi qu\'il arrive, contre la hausse au-delà du strike, abandonnée',
      'Le protective put : action + put acheté — un plancher garanti au strike, la hausse conservée, contre une prime dont la valeur temps fond',
      'Le collar : le put financé par le call — protégé en bas, plafonné en haut, coût net proche de zéro : l\'habit du dirigeant qui doit garder ses titres',
    ],
    planEn: [
      'Set the grammar: these strategies do not stand alone — they dress an existing stock position, and every income is paid for with a piece of the profile',
      'The covered call: stock + short call — a premium collected whatever happens, against the upside beyond the strike, given up',
      'The protective put: stock + long put — a guaranteed floor at the strike, upside kept, against a premium whose time value melts',
      'The collar: the put financed by the call — protected below, capped above, net cost near zero: the outfit of the executive who must keep his shares',
    ],
    pointsAttendus: [
      'Le covered call : détenir l\'action, vendre un call dessus — la prime tombe, un revenu encaissé quoi qu\'il arrive ; si le titre dépasse le strike, on livre : la hausse au-delà n\'appartient plus au client',
      'Le chiffre qui dégrise : action à 100, call 100 vendu 10,45 — le titre finit à 150, le portefeuille vaut 110,45 quand le voisin non couvert affiche 150 : la prime est le prix de la hausse vendue',
      'La requalification qui classe : par la parité, action + call vendu = put vendu (à l\'actualisation du strike près) — le « générateur de revenu » est économiquement un vendeur de put : gains plafonnés, baisse presque entière à charge',
      'Le protective put : l\'assurance au sens propre — plancher au strike (moins la prime), hausse conservée (moins la prime) ; le choix du strike est un choix de franchise, un put plus OTM coûte moins et protège plus tard',
      'Le coût réel de l\'assurance permanente : la valeur temps, qui fond et se repaie à chaque roll — s\'assurer en continu ampute durablement la performance',
      'Le collar : put acheté, call OTM vendu, la prime encaissée paie tout ou partie de la protection — protégé sous le strike du put, plafonné au strike du call, coût net proche de zéro',
    ],
    pointsAttendusEn: [
      'The covered call: hold the stock, sell a call on it — the premium lands, income collected whatever happens; if the stock clears the strike, you deliver: the upside beyond no longer belongs to the client',
      'The sobering number: stock at 100, 100-strike call sold at 10.45 — the stock ends at 150, the portfolio is worth 110.45 while the unhedged neighbour shows 150: the premium is the price of the upside sold',
      'The requalification that ranks you: by parity, stock + short call = short put (up to the discounted strike) — the "income generator" is economically a put seller: capped gains, almost the whole downside to carry',
      'The protective put: insurance in the literal sense — floor at the strike (minus the premium), upside kept (minus the premium); choosing the strike is choosing a deductible, a more OTM put costs less and protects later',
      'The true cost of permanent insurance: time value, which melts and is paid again at every roll — insuring continuously durably amputates performance',
      'The collar: put bought, OTM call sold, the premium collected pays all or part of the protection — protected below the put strike, capped at the call strike, net cost near zero',
    ],
    bonus: [
      'Le cas d\'usage du collar : le dirigeant contraint de conserver ses titres mais qui ne peut pas se permettre d\'en porter tout le risque — protection sans décaissement',
      'Anticiper la relance : « le covered call est-il de l\'argent gratuit ? » — non : lire les positions par leurs payoffs, pas par leur marketing ; la prime rémunère toujours un renoncement',
    ],
    bonusEn: [
      'The collar\'s use case: the executive forced to keep his shares but unable to carry their full risk — protection without cash outlay',
      'Anticipate the follow-up: "is the covered call free money?" — no: read positions by their payoffs, not their marketing; a premium always pays for a renunciation',
    ],
    reponseModele: `Trois habits pour une même position en actions — et une règle qui les gouverne tous : **aucune prime n'est un cadeau ; tout revenu se paie d'un morceau de profil**.

Le **covered call** : mon client détient l'action, je vends un call dessus. Promesse : une prime encaissée immédiatement, quoi qu'il arrive — d'où la réputation de « stratégie de rendement ». Renoncement : la hausse au-delà du strike. Le chiffre qui dégrise : action à 100, call 100 vendu 10,45, titre à 150 à l'échéance — le portefeuille vaut 110,45 quand le voisin non couvert affiche 150. Et la parité call-put requalifie la position sans appel : action plus call vendu égale **put vendu**. Le « générateur de revenu » est économiquement un vendeur d'assurance — gains plafonnés, baisse presque entière à charge.

Le **protective put** : action plus put acheté. Promesse : un plancher garanti au strike, moins la prime — et toute la hausse conservée, moins la prime. C'est l'assurance au sens propre : le strike joue la franchise, la prime la cotisation. Renoncement : le coût, qui est de la valeur temps — elle fond à mesure que l'échéance approche, et se repaie à chaque roll : s'assurer en permanence ampute durablement la performance.

Le **collar** : le put financé par la vente d'un call OTM. Promesse : protégé en bas, pour un coût net proche de zéro. Renoncement : plafonné en haut. C'est l'habit du dirigeant qui doit conserver ses titres sans pouvoir en porter tout le risque.

La chute : ces trois profils ne s'évaluent ni au discours ni au nom commercial — ils se lisent sur le diagramme de payoff, où chaque prime encaissée a, quelque part, sa contrepartie abandonnée.`,
    reponseModeleEn: `Three outfits for the same stock position — and one rule governing them all: **no premium is a gift; every income is paid for with a piece of the profile**.

The **covered call**: my client holds the stock, I sell a call on it. Promise: a premium collected immediately, whatever happens — hence the "yield strategy" reputation. Renunciation: the upside beyond the strike. The sobering number: stock at 100, 100-strike call sold at 10.45, stock at 150 at expiry — the portfolio is worth 110.45 while the unhedged neighbour shows 150. And put-call parity requalifies the position beyond appeal: stock plus short call equals **short put**. The "income generator" is economically an insurance seller — capped gains, almost the whole downside to carry.

The **protective put**: stock plus long put. Promise: a guaranteed floor at the strike, minus the premium — and all the upside kept, minus the premium. It is insurance in the literal sense: the strike plays the deductible, the premium the contribution. Renunciation: the cost, which is time value — it melts as expiry approaches, and is paid again at every roll: permanent insurance durably amputates performance.

The **collar**: the put financed by selling an OTM call. Promise: protected below, for a net cost near zero. Renunciation: capped above. It is the outfit of the executive who must keep his shares without being able to carry their full risk.

The closing line: these three profiles are judged neither by the pitch nor by the product name — they are read on the payoff diagram, where every premium collected has, somewhere, its abandoned counterpart.`,
  },
  {
    id: 'm8-j-07',
    moduleId: M8,
    theme: 'la parité call-put',
    themeEn: 'put-call parity',
    difficulte: 2,
    question: 'Démontrez-moi la parité call-put en 90 secondes.',
    questionEn: 'Prove put-call parity for me in 90 seconds.',
    plan: [
      'Construire les deux portefeuilles : A = call + placement de K·e^(−rT) ; B = put + action — options européennes, même strike, même échéance, pas de dividende',
      'Comparer à l\'échéance : dans les deux états du monde, A comme B valent max(S_T, K) — le meilleur des deux',
      'Conclure par la loi du prix unique : même payoff partout, même prix aujourd\'hui — C + K·e^(−rT) = P + S',
      'Vérifier sur le canonique : C − P = 10,4506 − 5,5735 = 4,8771 = 100 − 95,1229 — et souligner : aucun modèle, aucune volatilité là-dedans',
    ],
    planEn: [
      'Build the two portfolios: A = call + investment of K·e^(−rT); B = put + stock — European options, same strike, same expiry, no dividend',
      'Compare at expiry: in both states of the world, A and B are worth max(S_T, K) — the better of the two',
      'Conclude by the law of one price: same payoff everywhere, same price today — C + K·e^(−rT) = P + S',
      'Verify on the canonical case: C − P = 10.4506 − 5.5735 = 4.8771 = 100 − 95.1229 — and stress: no model, no volatility in there',
    ],
    pointsAttendus: [
      'Les deux portefeuilles : A = un call plus un placement de K·e^(−rT) (calibré pour valoir K à l\'échéance) ; B = un put plus l\'action',
      'Le tableau des deux cas : si S_T ≥ K, A vaut S_T (call exercé + les K du placement) et B aussi (put abandonné + l\'action) ; si S_T < K, A vaut K (call mort, placement) et B aussi (put exercé : l\'action se vend K) — partout max(S_T, K)',
      'L\'argument : deux actifs qui paieront exactement la même chose demain, quoi qu\'il arrive, cotent le même prix aujourd\'hui — sinon on vend le cher, on achète l\'autre, et la différence est acquise sans risque',
      'L\'équation sous ses deux formes : C + K·e^(−rT) = P + S, soit C − P = S − K·e^(−rT) — vérifiée sur le canonique : 4,8771 = 100 − 95,1229',
      'Ce qui n\'y figure PAS : ni Black-Scholes, ni volatilité, ni distribution des rendements — seulement l\'absence d\'arbitrage ; tout modèle qui violerait la parité serait faux avant d\'avoir commencé',
      'Les deux bornes du théorème : options européennes (un exercice anticipé casserait l\'égalité terminale) et pas de dividende (sinon on retranche du spot leur valeur actuelle)',
    ],
    pointsAttendusEn: [
      'The two portfolios: A = one call plus an investment of K·e^(−rT) (calibrated to be worth K at expiry); B = one put plus the stock',
      'The two-case table: if S_T ≥ K, A is worth S_T (call exercised + the K from the investment) and so is B (put abandoned + the stock); if S_T < K, A is worth K (dead call, investment) and so is B (put exercised: the stock sells for K) — everywhere max(S_T, K)',
      'The argument: two assets that will pay exactly the same tomorrow, whatever happens, quote the same price today — otherwise sell the expensive one, buy the other, and the difference is pocketed risk-free',
      'The equation in both forms: C + K·e^(−rT) = P + S, i.e. C − P = S − K·e^(−rT) — verified on the canonical case: 4.8771 = 100 − 95.1229',
      'What is NOT in it: no Black-Scholes, no volatility, no return distribution — only absence of arbitrage; any pricing model violating parity would be wrong before it started',
      'The theorem\'s two bounds: European options (early exercise would break the terminal equality) and no dividend (otherwise subtract their present value from the spot)',
    ],
    bonus: [
      'La filiation qui impressionne : même bois que le cash and carry du module 7 et la parité couverte du change — la loi du prix unique, quatrième habit : une réplication, pas une opinion',
      'Anticiper la relance : « pourquoi le call ATM vaut-il plus que le put ? » — parce que C − P = S − K·e^(−rT) > 0 dès que les taux sont positifs : le strike actualisé est sous le spot, le portage joue pour le droit d\'acheter',
    ],
    bonusEn: [
      'The lineage that impresses: same wood as module 7\'s cash and carry and FX covered parity — the law of one price, fourth outfit: a replication, not an opinion',
      'Anticipate the follow-up: "why is the ATM call worth more than the put?" — because C − P = S − K·e^(−rT) > 0 whenever rates are positive: the discounted strike sits below the spot, carry works for the right to buy',
    ],
    reponseModele: `Quatre-vingt-dix secondes, deux portefeuilles, zéro modèle. Options européennes, même strike K, même échéance T, pas de dividende. **Portefeuille A** : un call, plus un placement de K·e^(−rT) au taux sans risque — calibré pour valoir exactement K à l'échéance. **Portefeuille B** : un put, plus l'action.

Que valent-ils au terme ? Deux cas seulement. Si S_T ≥ K : le call de A s'exerce, S_T − K, plus les K du placement — total S_T ; en face, le put de B meurt et l'action vaut S_T — total S_T. Si S_T < K : le call de A meurt, restent les K du placement ; en B, le put s'exerce et l'action se vend K — total K des deux côtés. Dans **tous** les états du monde, A et B valent max(S_T, K) : le meilleur des deux.

Or deux actifs qui paieront exactement la même chose demain, quoi qu'il arrive, doivent coter le même prix aujourd'hui — sinon on vend le cher, on achète l'autre, et la différence est un gain sans risque. Donc **C + K·e^(−rT) = P + S**, soit C − P = S − K·e^(−rT). Vérification sur le canonique : 10,4506 − 5,5735 = 4,8771 = 100 − 95,1229 — au dix-millième.

Relisez ce que je n'ai pas utilisé : ni Black-Scholes, ni volatilité, ni opinion sur l'action. Seulement l'absence d'arbitrage — plus deux bornes : exercice européen, pas de dividende. C'est le même bois que le cash and carry : une réplication, pas une prévision. Et la conséquence pratique : donnez-moi le prix du call, je vous donne celui du put en une ligne — tout modèle qui violerait cette ligne serait faux avant d'avoir commencé.`,
    reponseModeleEn: `Ninety seconds, two portfolios, zero model. European options, same strike K, same expiry T, no dividend. **Portfolio A**: one call, plus an investment of K·e^(−rT) at the risk-free rate — calibrated to be worth exactly K at expiry. **Portfolio B**: one put, plus the stock.

What are they worth at the end? Two cases only. If S_T ≥ K: A's call is exercised, S_T − K, plus the K from the investment — total S_T; opposite, B's put dies and the stock is worth S_T — total S_T. If S_T < K: A's call dies, the K from the investment remain; in B, the put is exercised and the stock sells for K — total K on both sides. In **all** states of the world, A and B are worth max(S_T, K): the better of the two.

Now two assets that will pay exactly the same tomorrow, whatever happens, must quote the same price today — otherwise sell the expensive one, buy the other, and the difference is a riskless gain. Hence **C + K·e^(−rT) = P + S**, i.e. C − P = S − K·e^(−rT). Verification on the canonical case: 10.4506 − 5.5735 = 4.8771 = 100 − 95.1229 — to the fourth decimal.

Reread what I did not use: no Black-Scholes, no volatility, no opinion on the stock. Only absence of arbitrage — plus two bounds: European exercise, no dividend. It is the same wood as cash and carry: a replication, not a forecast. And the practical consequence: give me the call price and I give you the put in one line — any model violating that line would be wrong before it started.`,
  },
  {
    id: 'm8-j-08',
    moduleId: M8,
    theme: 'la parité call-put',
    themeEn: 'put-call parity',
    difficulte: 3,
    question: 'Le call cote 10,4506, l\'action 100 — mais le put se traite à 6,50 au lieu des 5,5735 de la parité. Que faites-vous, concrètement ?',
    questionEn: 'The call quotes 10.4506, the stock 100 — but the put trades at 6.50 instead of parity\'s 5.5735. What do you do, concretely?',
    plan: [
      'Diagnostiquer : le portefeuille put + action est trop cher de 0,9265 — je vends le cher et j\'achète sa réplique',
      'Dérouler les quatre gestes du jour J : vendre le put (+6,50), vendre l\'action à découvert (+100), acheter le call (−10,4506), placer 95,1229',
      'Compter : net encaissé aujourd\'hui +0,9265 — et montrer que les flux terminaux sont nuls dans les deux états du monde',
      'Conclure : gain sans mise, sans risque, sans opinion — près de 93 euros par contrat de quotité 100, à industrialiser ; c\'est pourquoi la parité tient en permanence',
    ],
    planEn: [
      'Diagnose: the put + stock portfolio is 0.9265 too expensive — I sell the expensive one and buy its replica',
      'Walk the four day-one moves: sell the put (+6.50), short the stock (+100), buy the call (−10.4506), invest 95.1229',
      'Count: net collected today +0.9265 — and show the terminal flows are zero in both states of the world',
      'Conclude: gain with no stake, no risk, no opinion — nearly 93 euros per 100-lot contract, to industrialise; that is why parity holds at all times',
    ],
    pointsAttendus: [
      'Le diagnostic : parité violée — put + action = 106,50 contre call + cash = 105,5735 : le portefeuille B est trop cher de 0,9265 ; on vend le cher, on achète l\'autre',
      'Les quatre gestes simultanés : vendre le put (+6,50), vendre l\'action à découvert (+100), acheter le call (−10,4506), placer K·e^(−rT) = 95,1229 à 5 % — il vaudra exactement 100 dans un an',
      'Le net encaissé aujourd\'hui : 6,50 + 100 − 10,4506 − 95,1229 = +0,9265',
      'Le dénouement automatique, état par état : au-dessus de 100, le put expire, le call s\'exerce — les 100 du placement paient l\'action, qui rembourse le découvert ; en dessous, le put est exercé contre moi — les 100 du placement paient le titre livré, qui rembourse le découvert, et le call meurt : flux terminal nul partout',
      'Les deux propriétés d\'arbitrage : aucune mise initiale, aucun risque de marché — les 0,9265 étaient gratuits : près de 93 euros par contrat de quotité 100',
      'La morale de marché : c\'est parce que des desks entiers guettent cet écart qu\'on ne l\'observe pas — sur les marchés liquides, la parité tient à l\'épaisseur des coûts de transaction près',
    ],
    pointsAttendusEn: [
      'The diagnosis: parity violated — put + stock = 106.50 against call + cash = 105.5735: portfolio B is 0.9265 too expensive; sell the expensive one, buy the other',
      'The four simultaneous moves: sell the put (+6.50), short the stock (+100), buy the call (−10.4506), invest K·e^(−rT) = 95.1229 at 5% — it will be worth exactly 100 in a year',
      'The net collected today: 6.50 + 100 − 10.4506 − 95.1229 = +0.9265',
      'The automatic unwind, state by state: above 100, the put expires, the call is exercised — the 100 from the investment pay for the stock, which repays the short; below, the put is exercised against me — the 100 pay for the delivered stock, which repays the short, and the call dies: zero terminal flow everywhere',
      'The two arbitrage properties: no initial stake, no market risk — the 0.9265 were free: nearly 93 euros per 100-lot contract',
      'The market moral: it is because entire desks watch for this gap that it is not observed — on liquid markets, parity holds to within transaction costs',
    ],
    bonus: [
      'La nuance d\'exécution : le montage exige de vendre l\'action à découvert — le prêt-emprunt de titres a un coût et n\'est pas toujours disponible : la parité vit dans une étroite bande de non-arbitrage, pas sur un fil',
      'Anticiper la relance : « et si c\'est le put qui est trop bas ? » — le montage en miroir : acheter le put et l\'action, vendre le call, emprunter — même logique, sens inverse',
    ],
    bonusEn: [
      'The execution nuance: the trade requires shorting the stock — securities lending has a cost and is not always available: parity lives in a narrow no-arbitrage band, not on a knife edge',
      'Anticipate the follow-up: "and if the put is too cheap?" — the mirror trade: buy the put and the stock, sell the call, borrow — same logic, opposite direction',
    ],
    reponseModele: `Je fais les comptes, puis je fais les quatre gestes. La parité exige C − P = S − K·e^(−rT) : le put devrait valoir 5,5735. À 6,50, le portefeuille **put + action** (106,50) est trop cher face à **call + cash** (105,5735) : écart 0,9265. Règle d'or : on vend le cher, on achète sa réplique.

Jour J, quatre gestes simultanés : je **vends le put** (+6,50), je **vends l'action à découvert** (+100), j'**achète le call** (−10,4506), et je **place** K·e^(−rT) = 95,1229 à 5 % — il vaudra exactement 100 dans un an. Net encaissé aujourd'hui : 6,50 + 100 − 10,4506 − 95,1229 = **+0,9265**.

À l'échéance, tout se solde tout seul, quel que soit le marché. Action au-dessus de 100 : le put vendu expire, j'exerce mon call — les 100 du placement paient l'action, qui rembourse le découvert. Action en dessous : le put est exercé contre moi — les 100 du placement paient le titre qu'on me livre, lequel rembourse le découvert, et mon call meurt. Flux terminal : **zéro, dans tous les états du monde**. Les 0,9265 encaissés au départ étaient donc gratuits — près de 93 euros par contrat de quotité 100, sans mise, sans risque, sans opinion : à industrialiser sans modération.

La morale, qui est la vraie réponse : c'est précisément parce que des desks entiers guettent cet écart qu'on ne l'observe pas. Sur les marchés liquides, la parité tient en permanence, à l'épaisseur des coûts de transaction près — et ma seule réserve d'exécution serait le coût du prêt-emprunt de titres sur la jambe vendeuse.`,
    reponseModeleEn: `I do the accounts, then I make the four moves. Parity requires C − P = S − K·e^(−rT): the put should be worth 5.5735. At 6.50, the **put + stock** portfolio (106.50) is too expensive against **call + cash** (105.5735): a 0.9265 gap. Golden rule: sell the expensive one, buy its replica.

Day one, four simultaneous moves: I **sell the put** (+6.50), I **short the stock** (+100), I **buy the call** (−10.4506), and I **invest** K·e^(−rT) = 95.1229 at 5% — it will be worth exactly 100 in a year. Net collected today: 6.50 + 100 − 10.4506 − 95.1229 = **+0.9265**.

At expiry, everything settles by itself, whatever the market. Stock above 100: the short put expires, I exercise my call — the 100 from the investment pay for the stock, which repays the short. Stock below: the put is exercised against me — the 100 pay for the stock I am delivered, which repays the short, and my call dies. Terminal flow: **zero, in every state of the world**. The 0.9265 collected upfront were therefore free — nearly 93 euros per 100-lot contract, with no stake, no risk, no opinion: to be industrialised without moderation.

The moral, which is the real answer: it is precisely because entire desks watch for this gap that it is not observed. On liquid markets, parity holds at all times, to within transaction costs — and my only execution reservation would be the cost of securities lending on the short leg.`,
  },
  {
    id: 'm8-j-09',
    moduleId: M8,
    theme: 'la parité call-put',
    themeEn: 'put-call parity',
    difficulte: 3,
    question: 'Avec un call, un put, l\'action et du cash, que savez-vous fabriquer — et qu\'est-ce que la parité impose aux grecques avant tout calcul ?',
    questionEn: 'With a call, a put, the stock and cash, what can you manufacture — and what does parity impose on the Greeks before any computation?',
    plan: [
      'Lire la parité comme une boîte à recettes : une équation à quatre instruments s\'isole dans tous les sens — chaque réarrangement est un synthétique',
      'Détailler la ligne reine : call moins put = forward — deux coudes recollés font une droite : l\'engagement ferme du module 7, reconstruit en options',
      'Requalifier le covered call : action − call = cash − put — détenir l\'action et vendre le call, c\'est vendre un put',
      'Dériver la parité : delta call − delta put = 1 ; pas de courbure ni de sigma à droite — gammas égaux, vegas égaux : garantis par arbitrage, avant tout modèle',
    ],
    planEn: [
      'Read parity as a recipe box: an equation with four instruments isolates every which way — each rearrangement is a synthetic',
      'Detail the flagship line: call minus put = forward — two kinks glued together make a straight line: module 7\'s firm commitment, rebuilt from options',
      'Requalify the covered call: stock − call = cash − put — holding the stock and selling the call is selling a put',
      'Differentiate parity: delta call − delta put = 1; no curvature and no sigma on the right — equal gammas, equal vegas: guaranteed by arbitrage, before any model',
    ],
    pointsAttendus: [
      'La boîte à synthétiques : call synthétique = put + action − emprunt de K·e^(−rT) ; put synthétique = call − action + placement ; action synthétique = call − put + placement — fabriquer l\'instrument qui ne cote pas',
      'Le forward synthétique : C − P = S − K·e^(−rT) — acheter le call, vendre le put, même strike : au-dessus de K mon call s\'exerce, en dessous le put vendu s\'exerce contre moi — dans tous les cas j\'achète à K : deux coudes font une droite, le profil linéaire du module 7',
      'La requalification du covered call : action + call vendu = put vendu + cash — le chapitre 2 l\'annonçait, la parité le démontre en une ligne',
      'La dérivation par rapport à S : le membre de droite a une pente de 1, donc delta call − delta put = 1 — sur le canonique : 0,6368 − (−0,3632) = 1, exactement',
      'La dérivée seconde et la volatilité : une droite n\'a pas de courbure, donc gamma call = gamma put ; S − K·e^(−rT) ignore sigma, donc vega call = vega put — trois identités garanties par arbitrage avant tout modèle',
      'La conséquence de contrôle : un pricer qui affiche des gammas différents pour le call et le put de mêmes strike et échéance n\'a pas découvert le marché — il a un bug',
    ],
    pointsAttendusEn: [
      'The synthetics box: synthetic call = put + stock − borrowing of K·e^(−rT); synthetic put = call − stock + investment; synthetic stock = call − put + investment — manufacturing the instrument that does not quote',
      'The synthetic forward: C − P = S − K·e^(−rT) — buy the call, sell the put, same strike: above K my call is exercised, below the short put is exercised against me — in every case I buy at K: two kinks make a straight line, module 7\'s linear profile',
      'The covered call requalification: stock + short call = short put + cash — chapter 2 announced it, parity proves it in one line',
      'Differentiating with respect to S: the right-hand side has slope 1, hence delta call − delta put = 1 — on the canonical case: 0.6368 − (−0.3632) = 1, exactly',
      'The second derivative and volatility: a straight line has no curvature, hence gamma call = gamma put; S − K·e^(−rT) ignores sigma, hence vega call = vega put — three identities guaranteed by arbitrage before any model',
      'The control consequence: a pricer showing different gammas for the call and put of same strike and expiry has not discovered the market — it has a bug',
    ],
    bonus: [
      'L\'usage de salle : répliquer une exposition quand le titre ne s\'emprunte pas, retourner une position sans toucher au sous-jacent — les desks vivent de ces recettes',
      'Anticiper la relance : « pourquoi delta put = delta call − 1 est-il négatif ? » — le droit de vendre s\'apprécie quand le marché baisse : −0,3632 sur le canonique, et la somme des valeurs absolues fait 1',
    ],
    bonusEn: [
      'The trading floor use: replicating an exposure when the stock cannot be borrowed, reversing a position without touching the underlying — desks live off these recipes',
      'Anticipate the follow-up: "why is delta put = delta call − 1 negative?" — the right to sell appreciates when the market falls: −0.3632 on the canonical case, and the absolute values sum to 1',
    ],
    reponseModele: `La parité est une équation à quatre instruments — C, P, S et le cash — et une équation s'isole dans tous les sens : chaque réarrangement est une **recette de fabrication**. Call synthétique : put + action − emprunt de K·e^(−rT). Put synthétique : call − action + placement. Action synthétique : call − put + placement. Le desk vit de ces recettes : fabriquer l'instrument qui ne cote pas, répliquer quand le titre ne s'emprunte pas, retourner une position sans toucher au sous-jacent.

La ligne reine mérite le dessin : **call acheté moins put vendu, même strike, égale forward**. Au-dessus de K, mon call s'exerce ; en dessous, le put vendu s'exerce contre moi — dans tous les cas, j'achète à K. Deux coudes recollés font une droite : l'engagement ferme du module 7, reconstruit en options. Et la même lecture requalifie le covered call en une ligne : action + call vendu = put vendu + cash.

Maintenant, les grecques — et c'est là que la parité devient un instrument de contrôle. L'équation C − P = S − K·e^(−rT) vaut à chaque instant, pour tout niveau de S. Dérivez par rapport à S : la pente du membre de droite est 1, donc **delta call − delta put = 1** — sur le canonique, 0,6368 − (−0,3632) = 1, exactement. Dérivez une seconde fois : une droite n'a pas de courbure — **gammas identiques**. Et le membre de droite ignore superbement la volatilité — **vegas identiques**.

Trois identités garanties par arbitrage, avant tout modèle. La chute : si votre pricer affiche des gammas différents pour le call et le put de mêmes caractéristiques, ce n'est pas le marché qui a tort — c'est votre tableur.`,
    reponseModeleEn: `Parity is an equation with four instruments — C, P, S and cash — and an equation isolates every which way: each rearrangement is a **manufacturing recipe**. Synthetic call: put + stock − borrowing of K·e^(−rT). Synthetic put: call − stock + investment. Synthetic stock: call − put + investment. The desk lives off these recipes: manufacturing the instrument that does not quote, replicating when the stock cannot be borrowed, reversing a position without touching the underlying.

The flagship line deserves the drawing: **long call minus short put, same strike, equals a forward**. Above K, my call is exercised; below, the short put is exercised against me — in every case, I buy at K. Two kinks glued together make a straight line: module 7's firm commitment, rebuilt from options. And the same reading requalifies the covered call in one line: stock + short call = short put + cash.

Now the Greeks — and this is where parity becomes a control instrument. The equation C − P = S − K·e^(−rT) holds at every instant, for every level of S. Differentiate with respect to S: the right-hand side has slope 1, hence **delta call − delta put = 1** — on the canonical case, 0.6368 − (−0.3632) = 1, exactly. Differentiate again: a straight line has no curvature — **identical gammas**. And the right-hand side superbly ignores volatility — **identical vegas**.

Three identities guaranteed by arbitrage, before any model. The closing line: if your pricer shows different gammas for the call and the put of same strike and expiry, it is not the market that is wrong — it is your spreadsheet.`,
  },
  {
    id: 'm8-j-10',
    moduleId: M8,
    theme: 'du binomial à Black-Scholes',
    themeEn: 'from binomial to Black-Scholes',
    difficulte: 2,
    question: 'Arbre à une période : l\'action cote 100 et vaudra 120 ou 80 dans un an, le taux vaut 4 %. Pricez le call de strike 100 — sans me donner une probabilité de hausse.',
    questionEn: 'One-period tree: the stock trades at 100 and will be worth 120 or 80 in a year, the rate is 4%. Price the 100-strike call — without giving me a probability of the market rising.',
    plan: [
      'Écrire les payoffs : 20 dans l\'état haut, 0 dans l\'état bas — puis fabriquer ces deux nombres avec ce qui se traite aujourd\'hui',
      'Construire la réplication : 0,5 action et un emprunt de 38,4615 (dette de 40 dans un an) — vérifier les deux états : 20 et 0',
      'Conclure par la loi du prix unique : le call vaut son coût de fabrication, 0,5 × 100 − 38,4615 = 11,5385',
      'Souligner l\'absence : la probabilité de hausse ne figure nulle part — et le ratio 0,5 = écart des payoffs sur écart des prix s\'appellera delta',
    ],
    planEn: [
      'Write the payoffs: 20 in the up state, 0 in the down state — then manufacture those two numbers with what trades today',
      'Build the replication: 0.5 shares and a borrowing of 38.4615 (debt of 40 in a year) — check both states: 20 and 0',
      'Conclude by the law of one price: the call is worth its manufacturing cost, 0.5 × 100 − 38.4615 = 11.5385',
      'Stress the absence: the probability of rising appears nowhere — and the 0.5 ratio, payoff spread over price spread, will be called delta',
    ],
    pointsAttendus: [
      'Les payoffs à l\'échéance : max(120 − 100, 0) = 20 en haut, max(80 − 100, 0) = 0 en bas',
      'Le geste fondateur : chercher Δ actions et un emprunt qui répliquent les deux états — Δ = (20 − 0)/(120 − 80) = 0,5, l\'écart des payoffs sur l\'écart des prix',
      'La vérification état par état : 0,5 × 120 − 40 = 20 ; 0,5 × 80 − 40 = 0 — le portefeuille réplique l\'option partout ; l\'emprunt vaut 40/1,04 = 38,4615 aujourd\'hui',
      'Le prix par la loi du prix unique : C = 0,5 × 100 − 38,4615 = 11,5385 — tout autre prix offrirait un arbitrage face au portefeuille de réplication',
      'L\'absence remarquable : que le marché monte une fois sur deux ou neuf fois sur dix, la réplication coûte 11,5385 — la probabilité de hausse ne figure nulle part',
      'La réécriture risque-neutre : le même prix s\'écrit (q × 20 + (1 − q) × 0)/1,04 avec q = (1,04 − 0,8)/(1,2 − 0,8) = 0,6 — un poids d\'arbitrage, pas un pari',
    ],
    pointsAttendusEn: [
      'The payoffs at expiry: max(120 − 100, 0) = 20 up, max(80 − 100, 0) = 0 down',
      'The founding move: find Δ shares and a borrowing that replicate both states — Δ = (20 − 0)/(120 − 80) = 0.5, the payoff spread over the price spread',
      'The state-by-state check: 0.5 × 120 − 40 = 20; 0.5 × 80 − 40 = 0 — the portfolio replicates the option everywhere; the borrowing is worth 40/1.04 = 38.4615 today',
      'The price by the law of one price: C = 0.5 × 100 − 38.4615 = 11.5385 — any other price would offer an arbitrage against the replicating portfolio',
      'The remarkable absence: whether the market rises one time in two or nine in ten, replication costs 11.5385 — the probability of rising appears nowhere',
      'The risk-neutral rewrite: the same price reads (q × 20 + (1 − q) × 0)/1.04 with q = (1.04 − 0.8)/(1.2 − 0.8) = 0.6 — an arbitrage weight, not a bet',
    ],
    bonus: [
      'Le vocabulaire d\'avance : le ratio 0,5 s\'appellera delta au chapitre des grecques — l\'écart des valeurs sur l\'écart des prix, devenu ratio de couverture',
      'La remarque de structure : deux actifs suffisent à répliquer tout payoff sur deux états — le marché est complet, tout dérivé y reçoit un prix unique imposé par la réplication',
    ],
    bonusEn: [
      'The vocabulary in advance: the 0.5 ratio will be called delta in the Greeks chapter — the value spread over the price spread, turned hedge ratio',
      'The structural remark: two assets suffice to replicate any payoff on two states — the market is complete, every derivative there receives a unique price imposed by replication',
    ],
    reponseModele: `Je ne prévois rien : je **fabrique** l'option, et je vous vends le coût de fabrication.

Les payoffs d'abord : à l'échéance, le call de strike 100 vaut 20 dans l'état haut (120), 0 dans l'état bas (80). Le geste fondateur : répliquer ces deux nombres avec ce qui se traite aujourd'hui. Je cherche Δ actions et un emprunt : Δ = écart des payoffs sur écart des prix = (20 − 0)/(120 − 80) = **0,5**. J'achète donc 0,5 action et j'emprunte 38,4615 — une dette de 40 dans un an à 4 %. Vérification état par état : en haut, 0,5 × 120 − 40 = 20 ; en bas, 0,5 × 80 − 40 = 0. Le portefeuille paie l'option dans **tous** les états du monde.

Deux actifs qui paient la même chose partout valent la même chose aujourd'hui — sinon, arbitrage. Le call vaut donc son coût de fabrication : C = 0,5 × 100 − 38,4615 = **11,5385**.

Relisez le calcul : la probabilité de hausse n'y figure **nulle part**. Que le marché monte une fois sur deux ou neuf fois sur dix, la réplication coûte 11,5385 — et tout autre prix distribuerait de l'argent gratuit. Si vous voulez malgré tout une « probabilité », elle existe comme réécriture : le même prix s'écrit (q × 20)/1,04 avec q = (1,04 − 0,8)/(1,2 − 0,8) = 0,6 — mais ce q se déduit de trois nombres d'arbitrage, pas d'un sondage.

La chute : comme le forward sortait du cash and carry sans prévision, l'option sort d'une réplication — et le ratio 0,5, l'écart des valeurs sur l'écart des prix, portera bientôt un nom : le delta.`,
    reponseModeleEn: `I forecast nothing: I **manufacture** the option, and I sell you the manufacturing cost.

The payoffs first: at expiry, the 100-strike call is worth 20 in the up state (120), 0 in the down state (80). The founding move: replicate those two numbers with what trades today. I look for Δ shares and a borrowing: Δ = payoff spread over price spread = (20 − 0)/(120 − 80) = **0.5**. So I buy 0.5 shares and borrow 38.4615 — a debt of 40 in one year at 4%. State-by-state check: up, 0.5 × 120 − 40 = 20; down, 0.5 × 80 − 40 = 0. The portfolio pays the option in **all** states of the world.

Two assets that pay the same everywhere are worth the same today — otherwise, arbitrage. The call is therefore worth its manufacturing cost: C = 0.5 × 100 − 38.4615 = **11.5385**.

Reread the computation: the probability of rising appears **nowhere**. Whether the market rises one time in two or nine times in ten, replication costs 11.5385 — and any other price would hand out free money. If you insist on a "probability", it exists as a rewrite: the same price reads (q × 20)/1.04 with q = (1.04 − 0.8)/(1.2 − 0.8) = 0.6 — but that q is deduced from three arbitrage numbers, not from a poll.

The closing line: just as the forward came out of cash and carry with no forecast, the option comes out of a replication — and the 0.5 ratio, the value spread over the price spread, will soon bear a name: delta.`,
  },
  {
    id: 'm8-j-11',
    moduleId: M8,
    theme: 'du binomial à Black-Scholes',
    themeEn: 'from binomial to Black-Scholes',
    difficulte: 3,
    question: 'Dans votre arbre, q = 0,6. Le marché monte donc six fois sur dix ?',
    questionEn: 'In your tree, q = 0.6. So the market rises six times out of ten?',
    plan: [
      'Répondre net : non — q ne sort d\'aucun sondage et ne prédit rien : il se déduit de trois nombres d\'arbitrage, u, d et r',
      'Donner le test qui démasque : sous q, l\'action elle-même rapporte exactement le taux sans risque — (0,6 × 120 + 0,4 × 80)/1,04 = 100, le spot : une martingale',
      'Expliquer le nom : le poids qui rend le monde « neutre au risque » — non que les investisseurs le soient : leur aversion est déjà dans les prix dont q se déduit',
      'Généraliser : la vraie probabilité de hausse est sans doute supérieure — prime de risque — et rigoureusement inutile pour pricer : le jumeau du « forward qui prévoit »',
    ],
    planEn: [
      'Answer squarely: no — q comes from no poll and predicts nothing: it is deduced from three arbitrage numbers, u, d and r',
      'Give the unmasking test: under q, the stock itself earns exactly the risk-free rate — (0.6 × 120 + 0.4 × 80)/1.04 = 100, the spot: a martingale',
      'Explain the name: the weight that makes the world "risk-neutral" — not that investors are: their risk aversion is already in the prices q is deduced from',
      'Generalise: the true probability of rising is probably higher — risk premium — and rigorously useless for pricing: the twin of "the forward forecasts"',
    ],
    pointsAttendus: [
      'La formule et sa source : q = ((1 + rT) − d)/(u − d) = (1,04 − 0,8)/(1,2 − 0,8) = 0,6 — trois nombres d\'arbitrage, aucune donnée d\'opinion',
      'Le test de la martingale : sous q, le sous-jacent actualisé redonne le spot — (0,6 × 120 + 0,4 × 80)/1,04 = 104/1,04 = 100 : un jeu équitable, ni prime ni pénalité pour le risque',
      'La définition propre : la valeur d\'un dérivé est l\'espérance RISQUE-NEUTRE de son payoff, actualisée — pas son espérance tout court',
      'Le pourquoi du nom : q rend le monde neutre au risque non parce que les investisseurs le seraient, mais parce que leur aversion au risque est déjà contenue dans les prix (u, d, S) dont q se déduit',
      'La vraie probabilité : sans doute supérieure à 0,6 — les actionnaires exigent une prime de risque — et rigoureusement inutile pour pricer : la réplication coûte le même prix quelle que soit l\'opinion',
      'Le rapprochement transversal : même démontage que « le futures prévoit la hausse » au module 7 — un poids d\'arbitrage n\'est pas une prévision ; N(d2) dans Black-Scholes est exactement ce q devenu aire sous la cloche',
    ],
    pointsAttendusEn: [
      'The formula and its source: q = ((1 + rT) − d)/(u − d) = (1.04 − 0.8)/(1.2 − 0.8) = 0.6 — three arbitrage numbers, no opinion data',
      'The martingale test: under q, the discounted underlying gives back the spot — (0.6 × 120 + 0.4 × 80)/1.04 = 104/1.04 = 100: a fair game, no premium and no penalty for risk',
      'The clean definition: a derivative\'s value is the RISK-NEUTRAL expectation of its payoff, discounted — not its plain expectation',
      'The why of the name: q makes the world risk-neutral not because investors are, but because their risk aversion is already contained in the prices (u, d, S) from which q is deduced',
      'The true probability: probably above 0.6 — shareholders demand a risk premium — and rigorously useless for pricing: replication costs the same whatever the opinion',
      'The cross-module link: the same dismantling as "the future forecasts a rise" in module 7 — an arbitrage weight is not a forecast; N(d2) in Black-Scholes is exactly this q become an area under the bell',
    ],
    bonus: [
      'La condition d\'existence : q est strictement entre 0 et 1 si et seulement si d < 1 + rT < u — ni l\'action ni le cash ne domine l\'autre : la condition de non-arbitrage elle-même',
      'La formulation qui classe : « q est un poids d\'arbitrage, pas une prévision — c\'est l\'objet le plus mal compris du programme, et le plus utile »',
    ],
    bonusEn: [
      'The existence condition: q lies strictly between 0 and 1 if and only if d < 1 + rT < u — neither the stock nor cash dominates the other: the no-arbitrage condition itself',
      'The line that ranks you: "q is an arbitrage weight, not a forecast — the most misunderstood object in the syllabus, and the most useful"',
    ],
    reponseModele: `Non — et cette confusion est exactement celle que la question veut débusquer. Regardez d'où sort q : q = ((1 + rT) − d)/(u − d) = (1,04 − 0,8)/(1,2 − 0,8) = 0,6. Trois nombres d'arbitrage — le taux, les deux facteurs de l'arbre — et aucun sondage, aucune donnée historique, aucune opinion. Un objet qui ne contient pas d'information sur l'avenir ne peut pas en prédire.

Le test qui le démasque : sous q, l'action **elle-même** rapporte exactement le taux sans risque — (0,6 × 120 + 0,4 × 80)/1,04 = 104/1,04 = 100, le spot. Le sous-jacent actualisé est une **martingale** sous q : un jeu équitable, ni prime ni pénalité pour le risque. Or personne ne croit que les actions rapportent le taux sans risque : les actionnaires exigent une prime de risque. q n'est donc pas une croyance — c'est le poids qui rend le monde « neutre au risque », non parce que les investisseurs le seraient, mais parce que leur aversion au risque est **déjà dans les prix** dont q se déduit.

D'où la définition propre : la valeur d'un dérivé est l'**espérance risque-neutre de son payoff, actualisée** — pas son espérance tout court. La vraie probabilité de hausse est sans doute supérieure à 0,6, et elle est rigoureusement inutile pour pricer : la réplication coûte 11,5385 quelle que soit votre opinion.

La chute transversale : c'est le jumeau exact du « forward qui prévoit » du module 7 — un poids d'arbitrage n'est pas une prévision. Et vous retrouverez ce q dans Black-Scholes : N(d2), la probabilité risque-neutre d'exercice, est ce même poids devenu aire sous la cloche.`,
    reponseModeleEn: `No — and that confusion is exactly what this question is designed to flush out. Look at where q comes from: q = ((1 + rT) − d)/(u − d) = (1.04 − 0.8)/(1.2 − 0.8) = 0.6. Three arbitrage numbers — the rate, the tree's two factors — and no poll, no historical data, no opinion. An object that contains no information about the future cannot predict it.

The test that unmasks it: under q, the stock **itself** earns exactly the risk-free rate — (0.6 × 120 + 0.4 × 80)/1.04 = 104/1.04 = 100, the spot. The discounted underlying is a **martingale** under q: a fair game, no premium and no penalty for risk. Yet nobody believes stocks earn the risk-free rate: shareholders demand a risk premium. So q is not a belief — it is the weight that makes the world "risk-neutral", not because investors are, but because their risk aversion is **already in the prices** from which q is deduced.

Hence the clean definition: a derivative's value is the **risk-neutral expectation of its payoff, discounted** — not its plain expectation. The true probability of rising is probably above 0.6, and it is rigorously useless for pricing: replication costs 11.5385 whatever your opinion.

The cross-module closing line: this is the exact twin of module 7's "forward that forecasts" — an arbitrage weight is not a forecast. And you will meet this q again in Black-Scholes: N(d2), the risk-neutral probability of exercise, is the same weight become an area under the bell curve.`,
  },
  {
    id: 'm8-j-12',
    moduleId: M8,
    theme: 'du binomial à Black-Scholes',
    themeEn: 'from binomial to Black-Scholes',
    difficulte: 2,
    question: 'Lisez-moi la formule de Black-Scholes terme à terme — comme si je ne devais retenir qu\'une phrase.',
    questionEn: 'Read me the Black-Scholes formula term by term — as if I were to remember only one sentence.',
    plan: [
      'Poser la formule : C = S·N(d1) − K·e^(−rT)·N(d2) — cinq ingrédients, une seule fonction : N, la cloche du module 2',
      'Donner la phrase : la formule se lit comme une facture — ce que je reçois, moins ce que je paie, pondérés par leurs chances',
      'Détailler les deux termes : K·e^(−rT)·N(d2) = le strike actualisé, pondéré par la probabilité risque-neutre d\'exercice ; S·N(d1) = l\'action reçue si exercice — et N(d1) > N(d2), l\'espérance conditionnelle gonfle le poids',
      'Vérifier aux extrêmes et au canonique : très ITM, C ≈ S − K·e^(−rT), un forward ; très OTM, tout tend vers zéro ; canonique : 63,68 − 53,23 = 10,45',
    ],
    planEn: [
      'State the formula: C = S·N(d1) − K·e^(−rT)·N(d2) — five ingredients, a single function: N, module 2\'s bell curve',
      'Give the sentence: the formula reads like an invoice — what I receive, minus what I pay, each weighted by its chances',
      'Detail the two terms: K·e^(−rT)·N(d2) = the discounted strike, weighted by the risk-neutral probability of exercise; S·N(d1) = the stock received if exercised — and N(d1) > N(d2), the conditional expectation inflates the weight',
      'Check the extremes and the canonical case: deep ITM, C ≈ S − K·e^(−rT), a forward; deep OTM, everything tends to zero; canonical: 63.68 − 53.23 = 10.45',
    ],
    pointsAttendus: [
      'La formule pour un call européen sans dividende : C = S·N(d1) − K·e^(−rT)·N(d2), avec d2 = d1 − σ√T — cinq ingrédients : spot, strike, taux, volatilité, échéance',
      'La phrase à retenir : ce que je reçois moins ce que je paie, pondérés par leurs chances — une facture, pas une incantation',
      'N(d2) : la probabilité risque-neutre d\'exercice — le q de l\'arbre devenu aire sous la cloche ; K·e^(−rT)·N(d2) est le strike que je paierai peut-être : actualisé, pondéré par la chance de le payer',
      'S·N(d1) : la valeur d\'aujourd\'hui de l\'action reçue SI j\'exerce — N(d1) > N(d2) parce qu\'on ne reçoit l\'action que dans les états où elle a monté : l\'espérance conditionnelle dépasse la moyenne',
      'Les extrêmes qui font avouer la formule : très dans la monnaie, N(d1) ≈ N(d2) ≈ 1 et C ≈ S − K·e^(−rT) — un forward, l\'optionnalité ne vaut plus rien ; très en dehors, tout tend vers zéro',
      'Le rituel de calcul sur le canonique : d1 = 0,35, d2 = 0,15, N(d1) = 0,6368, N(d2) = 0,5596 — C = 63,68 − 53,23 = 10,45 : le fameux prix du chapitre 1 n\'était pas une cotation tombée du ciel',
    ],
    pointsAttendusEn: [
      'The formula for a European call without dividend: C = S·N(d1) − K·e^(−rT)·N(d2), with d2 = d1 − σ√T — five ingredients: spot, strike, rate, volatility, expiry',
      'The sentence to remember: what I receive minus what I pay, each weighted by its chances — an invoice, not an incantation',
      'N(d2): the risk-neutral probability of exercise — the tree\'s q become an area under the bell; K·e^(−rT)·N(d2) is the strike I may pay: discounted, weighted by the chance of paying it',
      'S·N(d1): today\'s value of the stock received IF I exercise — N(d1) > N(d2) because you only receive the stock in the states where it went up: the conditional expectation exceeds the average',
      'The extremes that make the formula confess: deep in the money, N(d1) ≈ N(d2) ≈ 1 and C ≈ S − K·e^(−rT) — a forward, optionality worth nothing; deep out, everything tends to zero',
      'The computation ritual on the canonical case: d1 = 0.35, d2 = 0.15, N(d1) = 0.6368, N(d2) = 0.5596 — C = 63.68 − 53.23 = 10.45: chapter 1\'s famous price did not fall from the sky',
    ],
    bonus: [
      'Le raccourci d\'oral : le put ne demande aucun calcul nouveau — la parité le livre : P = C − S + K·e^(−rT) = 5,5735 ; et d2 se lit comme un z-score : l\'avance du sous-jacent porté sur le strike, mesurée en écarts-types σ√T',
      'Anticiper le piège : N(d1) est le delta du call, N(d2) la probabilité d\'exercice — les confondre est LA faute classique ; N(d1) surestime toujours la probabilité',
    ],
    bonusEn: [
      'The oral shortcut: the put requires no new computation — parity delivers it: P = C − S + K·e^(−rT) = 5.5735; and d2 reads like a z-score: the carried underlying\'s lead over the strike, measured in σ√T standard deviations',
      'Anticipate the trap: N(d1) is the call\'s delta, N(d2) the probability of exercise — confusing them is THE classic mistake; N(d1) always overstates the probability',
    ],
    reponseModele: `La phrase : **une facture — ce que je reçois, moins ce que je paie, pondérés par leurs chances**. La formule de 1973, pour un call européen sans dividende : C = S·N(d1) − K·e^(−rT)·N(d2), avec d2 = d1 − σ√T. Cinq ingrédients — spot, strike, taux, volatilité, échéance — et une seule fonction : N, la fonction de répartition de la normale, la cloche même du module 2, devenue moteur de pricing.

Le second terme d'abord, le plus lisible : **N(d2) est la probabilité risque-neutre d'exercice** — le q de l'arbre, devenu aire sous la cloche. K·e^(−rT)·N(d2) est donc le strike que je paierai peut-être : actualisé, pondéré par la chance de le payer. Ce que je paie.

Le premier terme : **S·N(d1)** est la valeur d'aujourd'hui de l'action que je recevrai *si* j'exerce. Pourquoi N(d1) dépasse-t-il N(d2) ? Parce que je ne reçois l'action que dans les états où elle a monté : l'espérance conditionnelle dépasse la moyenne, et le poids s'en trouve gonflé. Ce que je reçois.

Aux extrêmes, la formule avoue tout : très dans la monnaie, N(d1) ≈ N(d2) ≈ 1 et C ≈ S − K·e^(−rT) — un forward, l'optionnalité ne vaut plus rien ; très en dehors, tout tend vers zéro. Et le rituel chiffré sur le canonique : d1 = 0,35, d2 = 0,15, lectures de table 0,6368 et 0,5596 — C = 63,68 − 53,23 = **10,45**. Le fameux prix du chapitre 1 n'était pas tombé du ciel.

La chute : le put ne demande aucun calcul nouveau — la parité le livre en une ligne, 5,5735. Une formule qui se lit comme une facture et se vérifie par arbitrage : voilà pourquoi elle a tenu cinquante ans.`,
    reponseModeleEn: `The sentence: **an invoice — what I receive, minus what I pay, each weighted by its chances**. The 1973 formula, for a European call without dividend: C = S·N(d1) − K·e^(−rT)·N(d2), with d2 = d1 − σ√T. Five ingredients — spot, strike, rate, volatility, expiry — and a single function: N, the normal distribution function, the very bell of module 2, turned pricing engine.

The second term first, the most readable: **N(d2) is the risk-neutral probability of exercise** — the tree's q, become an area under the bell. K·e^(−rT)·N(d2) is therefore the strike I may pay: discounted, weighted by the chance of paying it. What I pay.

The first term: **S·N(d1)** is today's value of the stock I will receive *if* I exercise. Why does N(d1) exceed N(d2)? Because I only receive the stock in the states where it went up: the conditional expectation exceeds the average, and the weight is inflated accordingly. What I receive.

At the extremes, the formula confesses everything: deep in the money, N(d1) ≈ N(d2) ≈ 1 and C ≈ S − K·e^(−rT) — a forward, optionality worth nothing; deep out, everything tends to zero. And the numeric ritual on the canonical case: d1 = 0.35, d2 = 0.15, table readings 0.6368 and 0.5596 — C = 63.68 − 53.23 = **10.45**. Chapter 1's famous price had not fallen from the sky.

The closing line: the put requires no new computation — parity delivers it in one line, 5.5735. A formula that reads like an invoice and is checked by arbitrage: that is why it has lasted fifty years.`,
  },
  {
    id: 'm8-j-13',
    moduleId: M8,
    theme: 'du binomial à Black-Scholes',
    themeEn: 'from binomial to Black-Scholes',
    difficulte: 3,
    question: 'Quelles hypothèses Black-Scholes exige-t-il — et lesquelles sont sérieusement fausses ?',
    questionEn: 'What assumptions does Black-Scholes require — and which ones are seriously wrong?',
    plan: [
      'Dresser la liste : log-rendements normaux à volatilité constante et connue, taux constant, pas de dividendes, exercice européen, marché sans frictions avec couverture ajustée en continu',
      'Trier : aucune n\'est exactement vraie — deux sont sérieusement fausses : la volatilité n\'est ni constante ni connue, et les queues réelles sont plus épaisses que la cloche',
      'Donner la preuve historique : le 19 octobre 1987, −22,6 % en une séance — un mouvement à peu près impossible sous la loi normale',
      'Conclure sur le statut du modèle : le marché le sait et le dit dans les prix — le smile ; Black-Scholes rétrogradé de description du monde à langue de cotation',
    ],
    planEn: [
      'Draw the list: normal log-returns with constant and known volatility, constant rate, no dividends, European exercise, frictionless market with continuously adjusted hedging',
      'Sort: none is exactly true — two are seriously wrong: volatility is neither constant nor known, and real tails are fatter than the bell',
      'Give the historical proof: 19 October 1987, −22.6% in one session — a move roughly impossible under the normal law',
      'Conclude on the model\'s status: the market knows it and says it in prices — the smile; Black-Scholes demoted from description of the world to quoting language',
    ],
    pointsAttendus: [
      'La liste complète : log-rendements normaux à volatilité constante et connue ; taux constant ; pas de dividendes ; exercice européen ; marché sans frictions où l\'on réajuste la couverture en continu',
      'La hiérarchie : aucune n\'est exactement vraie, mais deux sont sérieusement fausses — σ n\'est ni constante ni connue (c\'est le seul ingrédient inobservable), et la vraie distribution a des queues épaisses que la log-normale ignore',
      'La preuve par 1987 : −22,6 % sur le Dow en une séance — sous la cloche, un événement à peu près impossible ; les krachs existent, la log-normale ne les voit pas',
      'Les accommodements techniques : dividendes — retrancher du spot leur valeur actuelle ou un rendement continu ; exercice américain — retour à l\'arbre binomial, qui compare valeur de continuation et exercice immédiat à chaque nœud',
      'La réponse du marché à la fausseté : le smile — chaque strike cote SA volatilité implicite, ce qui est logiquement incompatible avec un σ unique ; le marché corrige le modèle dans les prix',
      'Le statut final, à formuler : Black-Scholes est faux comme modèle et indispensable comme convention — un convertisseur prix-volatilité universel et inversible, la langue de cotation du marché',
    ],
    pointsAttendusEn: [
      'The full list: normal log-returns with constant and known volatility; constant rate; no dividends; European exercise; frictionless market where the hedge is adjusted continuously',
      'The hierarchy: none is exactly true, but two are seriously wrong — σ is neither constant nor known (the only unobservable ingredient), and the true distribution has fat tails the lognormal ignores',
      'The 1987 proof: −22.6% on the Dow in one session — under the bell, a roughly impossible event; crashes exist, the lognormal does not see them',
      'The technical accommodations: dividends — subtract their present value from the spot, or a continuous yield; American exercise — back to the binomial tree, which compares continuation value and immediate exercise at each node',
      'The market\'s answer to the falsehood: the smile — each strike quotes ITS implied volatility, logically incompatible with a single σ; the market corrects the model in the prices',
      'The final status, to phrase: Black-Scholes is wrong as a model and indispensable as a convention — a universal, invertible price-volatility converter, the market\'s quoting language',
    ],
    bonus: [
      'L\'aveu chiffré : le vega — la salle mesure la sensibilité des prix aux variations d\'un paramètre censé être constant : le modèle se sait faux, et le marché a institutionnalisé cet aveu',
      'Anticiper la relance : « pourquoi l\'utiliser encore ? » — parce qu\'une langue de cotation n\'a pas besoin d\'être vraie : elle a besoin d\'être commune, inversible et comprise de tous — comme le rendement actuariel pour les obligations',
    ],
    bonusEn: [
      'The quantified confession: vega — the trading floor measures price sensitivity to changes in a parameter supposed to be constant: the model knows itself wrong, and the market institutionalised the confession',
      'Anticipate the follow-up: "why still use it?" — because a quoting language does not need to be true: it needs to be shared, invertible and understood by all — like yield to maturity for bonds',
    ],
    reponseModele: `La liste d'abord, car le prix de l'élégance de 1973 est une liste d'hypothèses : des **log-rendements normaux à volatilité constante et connue** ; un taux constant ; pas de dividendes ; un exercice européen ; un marché sans frictions où l'on réajuste la couverture en continu. Aucune n'est exactement vraie — mais toutes ne se valent pas.

Deux sont **sérieusement fausses**. La première : σ n'est ni constante ni connue — c'est le seul des cinq ingrédients qui ne s'observe nulle part, et le marché passe ses journées à le faire varier. La seconde : les queues réelles sont plus épaisses que la cloche. La preuve tient en une date : le 19 octobre 1987, le Dow perd 22,6 % en une séance — un mouvement que la loi normale qualifie d'à peu près impossible. Les krachs existent ; la log-normale ne les voit pas.

Les autres hypothèses s'accommodent : les dividendes se retranchent du spot en valeur actuelle ; l'exercice américain ramène à l'arbre binomial, qui compare à chaque nœud la valeur de continuation et l'exercice immédiat — aucune formule fermée ne sait le faire.

Reste le point qui départage les candidats : que fait le marché d'un modèle faux ? Il ne le jette pas — il le **rétrograde**. Depuis 1987, chaque strike cote sa propre volatilité implicite : le smile, logiquement incompatible avec un σ unique, est l'endroit exact où le marché corrige le modèle. Black-Scholes est passé de description du monde à **langue de cotation** — un convertisseur prix-volatilité universel et inversible.

Ma formulation de synthèse : **faux comme modèle, indispensable comme convention**. Et l'aveu est même chiffré : le vega — mesurer la sensibilité à un paramètre censé être constant, c'est reconnaître, en continu, que le modèle se sait faux.`,
    reponseModeleEn: `The list first, because the price of 1973's elegance is a list of assumptions: **normal log-returns with constant and known volatility**; a constant rate; no dividends; European exercise; a frictionless market where the hedge is adjusted continuously. None is exactly true — but they are not equally false.

Two are **seriously wrong**. First: σ is neither constant nor known — it is the only one of the five ingredients observable nowhere, and the market spends its days moving it. Second: real tails are fatter than the bell. The proof fits in one date: on 19 October 1987, the Dow lost 22.6% in a single session — a move the normal law calls roughly impossible. Crashes exist; the lognormal does not see them.

The other assumptions can be accommodated: dividends are subtracted from the spot at present value; American exercise brings back the binomial tree, which compares continuation value and immediate exercise at each node — something no closed formula can do.

There remains the point that separates candidates: what does the market do with a wrong model? It does not throw it away — it **demotes** it. Since 1987, each strike quotes its own implied volatility: the smile, logically incompatible with a single σ, is the exact place where the market corrects the model. Black-Scholes went from description of the world to **quoting language** — a universal, invertible price-volatility converter.

My summary phrasing: **wrong as a model, indispensable as a convention**. And the confession is even quantified: vega — measuring sensitivity to a parameter supposed to be constant is acknowledging, continuously, that the model knows itself wrong.`,
  },
  {
    id: 'm8-j-14',
    moduleId: M8,
    theme: 'du binomial à Black-Scholes',
    themeEn: 'from binomial to Black-Scholes',
    difficulte: 3,
    question: 'La formule fermée existe depuis 1973. Pourquoi les desks utilisent-ils encore l\'arbre binomial ?',
    questionEn: 'The closed-form formula has existed since 1973. Why do desks still use the binomial tree?',
    plan: [
      'Renverser la perception : l\'arbre n\'est pas un échafaudage pédagogique vers Black-Scholes — c\'est un outil de production qui a survécu à sa propre limite',
      'Donner la raison reine : l\'exercice américain — à chaque nœud, comparer valeur de continuation et valeur d\'exercice immédiat, ce qu\'aucune formule fermée ne sait faire',
      'Ajouter la souplesse : dividendes discrets, conditions exotiques — l\'arbre encaisse ce que la formule refuse',
      'Rappeler la cohérence : l\'arbre converge vers Black-Scholes quand les pas se multiplient — binomiale, TCL, lognormale : les deux outils sont le même argument de réplication',
    ],
    planEn: [
      'Flip the perception: the tree is not pedagogical scaffolding towards Black-Scholes — it is a production tool that outlived its own limit',
      'Give the chief reason: American exercise — at each node, compare continuation value and immediate exercise value, which no closed formula can do',
      'Add the flexibility: discrete dividends, exotic features — the tree absorbs what the formula refuses',
      'Recall the consistency: the tree converges to Black-Scholes as steps multiply — binomial, CLT, lognormal: the two tools are the same replication argument',
    ],
    pointsAttendus: [
      'La raison décisive : Black-Scholes price un exercice à date unique ; pour une option américaine, exerçable à tout moment, il faut comparer à CHAQUE nœud la valeur de continuation et la valeur d\'exercice immédiat — un algorithme, pas une formule',
      'La mécanique : construire l\'arbre du sous-jacent, puis remonter de l\'échéance vers aujourd\'hui, avec le même q à chaque nœud — en prenant à chaque étape le maximum entre continuer et exercer',
      'La souplesse en plus : dividendes discrets (l\'arbre s\'ajuste au détachement), barrières et clauses exotiques — l\'arbre encaisse les cas que la forme fermée refuse',
      'La cohérence théorique : quand n grandit, le nombre de hausses suit la binomiale, le log du prix devient une somme de chocs — le TCL fait converger vers la lognormale et l\'arbre vers Black-Scholes : deux visages du même argument de réplication',
      'La calibration standard : u = e^(σ√(T/n)), d = 1/u — chaque pas reproduit sa part de variance ; quelques centaines de pas suffisent en pratique',
      'La remarque de fond : le geste fondateur — répliquer, pas prévoir — est identique dans l\'arbre et dans la formule ; l\'arbre est la version discrète et robuste, la formule la version continue et élégante',
    ],
    pointsAttendusEn: [
      'The decisive reason: Black-Scholes prices exercise at a single date; for an American option, exercisable at any time, you must compare at EACH node the continuation value and the immediate exercise value — an algorithm, not a formula',
      'The mechanics: build the underlying\'s tree, then walk back from expiry to today, with the same q at each node — taking at each step the maximum of continuing and exercising',
      'The extra flexibility: discrete dividends (the tree adjusts at the ex-date), barriers and exotic features — the tree absorbs the cases the closed form refuses',
      'The theoretical consistency: as n grows, the number of up-moves follows the binomial, the log-price becomes a sum of shocks — the CLT drives convergence to the lognormal and the tree to Black-Scholes: two faces of the same replication argument',
      'The standard calibration: u = e^(σ√(T/n)), d = 1/u — each step reproduces its share of variance; a few hundred steps suffice in practice',
      'The deeper remark: the founding move — replicate, do not forecast — is identical in the tree and in the formula; the tree is the discrete, robust version, the formula the continuous, elegant one',
    ],
    bonus: [
      'Le cas concret du programme : les options sur actions sont le plus souvent américaines avec livraison des titres — l\'outil de production quotidien de ces marchés est l\'arbre, pas la formule',
      'Anticiper la relance : « quand l\'exercice anticipé d\'un call américain est-il rationnel ? » — essentiellement autour d\'un dividende : sans dividende, un call américain sur action vaut son jumeau européen, car vendre l\'option rapporte plus qu\'exercer',
    ],
    bonusEn: [
      'The syllabus\' concrete case: stock options are mostly American with physical delivery — the daily production tool of those markets is the tree, not the formula',
      'Anticipate the follow-up: "when is early exercise of an American call rational?" — essentially around a dividend: without dividends, an American call on a stock is worth its European twin, because selling the option pays more than exercising',
    ],
    reponseModele: `Parce que l'arbre n'a jamais été un simple échafaudage pédagogique vers la formule : c'est un outil de production qui a **survécu à sa propre limite**.

La raison reine est l'**exercice américain**. Black-Scholes price un exercice à date unique — l'échéance. Une option américaine s'exerce à tout moment : à chaque instant, son détenteur compare ce que vaut l'option vivante et ce que rapporterait l'exercice immédiat. Aucune formule fermée ne sait résoudre ce problème de décision ; l'arbre, si — mécaniquement. On construit l'arbre du sous-jacent, puis on **remonte** de l'échéance vers aujourd'hui, avec le même q à chaque nœud, en prenant à chaque étape le maximum entre la valeur de continuation et la valeur d'exercice. Or les options sur actions sont le plus souvent américaines : l'outil quotidien de ces marchés est l'arbre.

S'ajoute la souplesse : dividendes discrets, barrières, clauses exotiques — l'arbre encaisse ce que la forme fermée refuse.

Et il n'y a aucune schizophrénie entre les deux outils : calibrez u = e^(σ√(T/n)) et d = 1/u, multipliez les pas — le nombre de hausses suit la binomiale, le log du prix devient une somme de petits chocs, le théorème central limite installe la lognormale, et l'arbre **converge vers Black-Scholes**. La formule est la limite continue de l'arbre ; l'arbre est la version discrète et robuste de la formule — deux visages du même argument : répliquer, pas prévoir.

La chute : 1973 a donné au marché une formule fermée d'une élégance rare — et c'est l'échafaudage qui est resté debout à côté de la cathédrale, parce qu'on continue de construire avec.`,
    reponseModeleEn: `Because the tree was never mere pedagogical scaffolding towards the formula: it is a production tool that **outlived its own limit**.

The chief reason is **American exercise**. Black-Scholes prices exercise at a single date — expiry. An American option can be exercised at any moment: at every instant, its holder compares what the live option is worth and what immediate exercise would pay. No closed formula can solve that decision problem; the tree can — mechanically. You build the underlying's tree, then **walk back** from expiry to today, with the same q at each node, taking at each step the maximum of the continuation value and the exercise value. And stock options are mostly American: the daily tool of those markets is the tree.

Add the flexibility: discrete dividends, barriers, exotic features — the tree absorbs what the closed form refuses.

And there is no schizophrenia between the two tools: calibrate u = e^(σ√(T/n)) and d = 1/u, multiply the steps — the number of up-moves follows the binomial, the log-price becomes a sum of small shocks, the central limit theorem installs the lognormal, and the tree **converges to Black-Scholes**. The formula is the continuous limit of the tree; the tree is the discrete, robust version of the formula — two faces of the same argument: replicate, do not forecast.

The closing line: 1973 gave the market a closed formula of rare elegance — and it is the scaffolding that stayed standing next to the cathedral, because people still build with it.`,
  },
  {
    id: 'm8-j-15',
    moduleId: M8,
    theme: 'les grecques et le delta-hedging',
    themeEn: 'the Greeks and delta-hedging',
    difficulte: 2,
    question: 'Le delta du call canonique vaut 0,6368. Donnez-moi trois lectures de ce nombre.',
    questionEn: 'The canonical call\'s delta is 0.6368. Give me three readings of that number.',
    plan: [
      'Première lecture : une pente — l\'action bouge de 1, le call bouge d\'environ 0,64 : la tangente de la courbe de prix, valable pour de petits mouvements',
      'Deuxième lecture : un ratio de couverture — 0,6368 action par call vendu neutralise la position : le Δ de l\'arbre passé en continu',
      'Troisième lecture : à peu près une probabilité d\'exercice — « delta 64 » en salle — mais approximative : la vraie probabilité risque-neutre est N(d2) = 0,5596',
      'Encadrer : bornes 0 et 1, delta du put négatif (−0,3632), parité delta call − delta put = 1 — et ATM, le delta dépasse 0,5',
    ],
    planEn: [
      'First reading: a slope — the stock moves 1, the call moves about 0.64: the tangent of the price curve, valid for small moves',
      'Second reading: a hedge ratio — 0.6368 shares per short call neutralises the position: the tree\'s Δ gone continuous',
      'Third reading: roughly a probability of exercise — "delta 64" on the floor — but approximate: the true risk-neutral probability is N(d2) = 0.5596',
      'Frame it: bounds 0 and 1, negative put delta (−0.3632), parity delta call − delta put = 1 — and ATM, delta exceeds 0.5',
    ],
    pointsAttendus: [
      'La définition : le delta mesure la sensibilité de la prime au sous-jacent — pour un call Black-Scholes, Δ = N(d1), un poids qui figurait déjà dans la formule du prix',
      'La pente : l\'action passe de 100 à 101, le call prend environ 0,64 — c\'est une tangente, valable localement : le delta bouge lui-même avec le marché (c\'est le gamma)',
      'Le ratio de couverture : détenir 0,6368 action par call vendu rend le book insensible aux petits mouvements — le Δ = 0,5 de l\'arbre binomial, passé en continu',
      'La probabilité approximative : « delta 64 » se lit « environ deux chances sur trois de finir dans la monnaie » — mais la vraie probabilité risque-neutre d\'exercice est N(d2) = 0,5596 : N(d1) la surestime systématiquement, car il pondère aussi par la valeur de l\'action dans les états d\'exercice',
      'Les bornes et le put : très OTM, Δ → 0 (l\'option ne réagit à rien) ; très ITM, Δ → 1 (elle EST l\'action) ; le delta du put est négatif, −0,3632, et la parité impose delta call − delta put = 1',
      'La subtilité ATM : le delta à la monnaie dépasse 0,5 (0,6368 ici) — le strike se compare au spot capitalisé, pas au spot, et le terme σ²/2 de d1 pousse dans le même sens',
    ],
    pointsAttendusEn: [
      'The definition: delta measures the premium\'s sensitivity to the underlying — for a Black-Scholes call, Δ = N(d1), a weight that already appeared in the price formula',
      'The slope: the stock goes from 100 to 101, the call gains about 0.64 — it is a tangent, valid locally: delta itself moves with the market (that is gamma)',
      'The hedge ratio: holding 0.6368 shares per short call makes the book insensitive to small moves — the binomial tree\'s Δ = 0.5, gone continuous',
      'The approximate probability: "delta 64" reads "about two chances in three of finishing in the money" — but the true risk-neutral probability of exercise is N(d2) = 0.5596: N(d1) systematically overstates it, because it also weights by the stock\'s value in the exercise states',
      'The bounds and the put: deep OTM, Δ → 0 (the option reacts to nothing); deep ITM, Δ → 1 (it IS the stock); the put\'s delta is negative, −0.3632, and parity imposes delta call − delta put = 1',
      'The ATM subtlety: the at-the-money delta exceeds 0.5 (0.6368 here) — the strike compares to the capitalised spot, not the spot, and d1\'s σ²/2 term pushes the same way',
    ],
    bonus: [
      'Le langage de salle : les strikes se désignent par leur delta — « le put 25-delta », « le risk reversal » — le delta est devenu une coordonnée du marché, pas seulement une sensibilité',
      'Anticiper la relance : « votre couverture delta est-elle définitive ? » — non : le delta bouge avec le spot et le temps, et c\'est le gamma qui dicte la fréquence des réajustements — la question suivante du jury',
    ],
    bonusEn: [
      'The floor language: strikes are designated by their delta — "the 25-delta put", "the risk reversal" — delta has become a market coordinate, not just a sensitivity',
      'Anticipate the follow-up: "is your delta hedge final?" — no: delta moves with spot and time, and gamma dictates the rebalancing frequency — the jury\'s next question',
    ],
    reponseModele: `Trois lectures, du plus mathématique au plus parlé — et c'est le même nombre, Δ = N(d1), qui figurait déjà dans la formule du prix.

**Une pente.** L'action passe de 100 à 101 : le call prend environ 0,64. C'est la tangente de la courbe de prix — une lecture locale, valable pour de petits mouvements : le delta bouge lui-même avec le marché, et cette dérive de la pente a un nom, le gamma.

**Un ratio de couverture.** Détenir 0,6368 action par call vendu neutralise la position au premier ordre : ce que les calls vendus coûtent sur un petit mouvement, les actions le rendent. C'est le Δ de l'arbre binomial — l'écart des valeurs sur l'écart des prix — passé en continu. Pour 10 contrats de quotité 100, soit 1 000 calls vendus : delta de position −636,8, j'achète 637 actions.

**À peu près une probabilité.** « Delta 64 » se lit en salle « environ deux chances sur trois de finir dans la monnaie ». Lecture commode — et approximative : la vraie probabilité risque-neutre d'exercice est N(d2) = 0,5596, et N(d1) la **surestime systématiquement**, parce qu'il pondère aussi par la valeur de l'action dans les états d'exercice. Distinguer les deux est exactement le genre de précision qu'un jury attend.

L'encadrement pour finir : très en dehors, Δ tend vers 0 — l'option ne réagit à rien ; très dans la monnaie, vers 1 — elle *est* l'action. Le delta du put est négatif, −0,3632, et la parité tient la comptabilité : delta call − delta put = 1, exactement. Et à la monnaie, le delta dépasse 0,5 — 0,6368 ici : le strike se compare au spot capitalisé, pas au spot.`,
    reponseModeleEn: `Three readings, from the most mathematical to the most spoken — and it is the same number, Δ = N(d1), which already appeared in the price formula.

**A slope.** The stock goes from 100 to 101: the call gains about 0.64. It is the tangent of the price curve — a local reading, valid for small moves: delta itself moves with the market, and that drift of the slope has a name, gamma.

**A hedge ratio.** Holding 0.6368 shares per short call neutralises the position at first order: what the short calls cost on a small move, the shares give back. It is the binomial tree's Δ — the value spread over the price spread — gone continuous. For 10 contracts of 100 lot size, i.e. 1,000 short calls: position delta −636.8, I buy 637 shares.

**Roughly a probability.** "Delta 64" reads on the floor as "about two chances in three of finishing in the money". A convenient reading — and an approximate one: the true risk-neutral probability of exercise is N(d2) = 0.5596, and N(d1) **systematically overstates** it, because it also weights by the stock's value in the exercise states. Distinguishing the two is exactly the kind of precision a jury expects.

The frame to finish: deep out, Δ tends to 0 — the option reacts to nothing; deep in, towards 1 — it *is* the stock. The put's delta is negative, −0.3632, and parity keeps the books: delta call − delta put = 1, exactly. And at the money, delta exceeds 0.5 — 0.6368 here: the strike compares to the capitalised spot, not the spot.`,
  },
  {
    id: 'm8-j-16',
    moduleId: M8,
    theme: 'les grecques et le delta-hedging',
    themeEn: 'the Greeks and delta-hedging',
    difficulte: 3,
    question: 'Vous avez vendu 1 000 calls et acheté 637 actions : delta-neutre. L\'action fait 100 → 105 → 100. Pourquoi avez-vous perdu de l\'argent, alors que le marché est revenu à son point de départ ?',
    questionEn: 'You sold 1,000 calls and bought 637 shares: delta-neutral. The stock goes 100 → 105 → 100. Why did you lose money, when the market came back to its starting point?',
    plan: [
      'Rappeler que la neutralité ne dure pas : le delta bouge avec le marché — à 105, le delta du call passe de 0,6368 à 0,7237',
      'Dérouler l\'aller-retour : acheter 87 actions à 105 pour rester neutre, les revendre à 100 au retour — perte de 87 × 5 = 435, sans aucune erreur d\'exécution',
      'Nommer le coupable : le gamma négatif du vendeur — acheter après la hausse, vendre après la baisse, à contre-pied par construction ; coût ≈ ½Γ(ΔS)²',
      'Donner la contrepartie : le theta — le vendeur est payé pour attendre : le loyer quotidien compense, en espérance, les allers-retours perdants',
    ],
    planEn: [
      'Recall that neutrality does not last: delta moves with the market — at 105, the call\'s delta goes from 0.6368 to 0.7237',
      'Walk the round trip: buy 87 shares at 105 to stay neutral, sell them back at 100 on the way down — a loss of 87 × 5 = 435, with no execution error',
      'Name the culprit: the seller\'s negative gamma — buying after the rise, selling after the fall, wrong-footed by construction; cost ≈ ½Γ(ΔS)²',
      'Give the compensation: theta — the seller is paid to wait: the daily rent compensates, in expectation, the losing round trips',
    ],
    pointsAttendus: [
      'Le point de départ : 1 000 calls vendus × delta 0,6368 = −636,8 équivalents action, neutralisés par 637 actions — delta-neutre signifie insensible à la direction au premier ordre, pas P&L nul',
      'La neutralité est périssable : à 105, le delta du call passe à 0,7237 — il faut désormais 724 actions : achat de 87 actions à 105',
      'Le retour à 100 : le delta revient à 0,6368 — revente des 87 actions à 100 : perte de 87 × 5 = 435, alors que le marché a fait un aller-retour parfait',
      'Aucune erreur n\'a été commise : le vendeur delta-hedgé achète APRÈS la hausse et vend APRÈS la baisse, par construction — il court après le marché, et chaque tour de piste se paie',
      'Le nom et le chiffre : gamma négatif — le coût d\'un trajet ΔS vaut environ ½Γ(ΔS)² = ½ × 0,018762 × 25 ≈ 0,23 par option, soit ≈ 470 pour les 1 000 options : l\'ordre de grandeur des 435 constatés',
      'La contrepartie qui rend le métier viable : le theta — chaque jour calme encaisse le loyer de la convexité vendue ; le point mort est le mouvement « à un écart-type » de la vol vendue, ≈ 1,26 % par jour pour 20 %',
    ],
    pointsAttendusEn: [
      'The starting point: 1,000 short calls × 0.6368 delta = −636.8 share equivalents, neutralised with 637 shares — delta-neutral means direction-insensitive at first order, not zero P&L',
      'Neutrality is perishable: at 105, the call\'s delta goes to 0.7237 — you now need 724 shares: buy 87 shares at 105',
      'The return to 100: delta comes back to 0.6368 — sell the 87 shares at 100: a loss of 87 × 5 = 435, though the market made a perfect round trip',
      'No error was made: the delta-hedged seller buys AFTER the rise and sells AFTER the fall, by construction — he chases the market, and every lap costs',
      'The name and the number: negative gamma — the cost of a ΔS trip is about ½Γ(ΔS)² = ½ × 0.018762 × 25 ≈ 0.23 per option, i.e. ≈ 470 for the 1,000 options: the order of magnitude of the 435 observed',
      'The compensation that makes the business viable: theta — every calm day collects the rent on the convexity sold; the break-even is the "one standard deviation" move of the vol sold, ≈ 1.26% a day for 20%',
    ],
    bonus: [
      'La précision qui impressionne : l\'écart entre les 470 théoriques et les 435 constatés vient du gamma qui bouge lui-même en route — la formule en ½Γ(ΔS)² est une approximation locale',
      'Anticiper la relance : « et si vous réajustiez plus souvent ? » — la fréquence ne change pas l\'espérance du coût gamma, elle en réduit la variance : on ne se débarrasse pas de la convexité en la découpant plus fin',
    ],
    bonusEn: [
      'The precision that impresses: the gap between the theoretical 470 and the observed 435 comes from gamma itself moving along the way — the ½Γ(ΔS)² formula is a local approximation',
      'Anticipate the follow-up: "what if you rebalanced more often?" — frequency does not change the expected gamma cost, it reduces its variance: you cannot get rid of convexity by slicing it thinner',
    ],
    reponseModele: `Parce que « delta-neutre » est un état instantané, pas un abonnement — et que ma position vendeuse porte un **gamma négatif** qui me met à contre-pied par construction.

Reprenons la séquence. Au départ : 1 000 calls vendus, delta 0,6368, soit −636,8 équivalents action — je détiens 637 actions, book neutre. L'action monte à 105 : le delta du call passe à **0,7237** — il me faut désormais 724 actions. J'en **achète 87, à 105**. Puis l'action retombe à 100 : le delta revient à 0,6368 — je **revends mes 87 actions, à 100**. Le marché a fait un aller-retour parfait, mon book est revenu à son point de départ… moins 87 × 5 = **435**. Aucune erreur d'exécution : le vendeur delta-hedgé achète après la hausse et vend après la baisse, mécaniquement. Il court après le marché, et chaque tour de piste se paie.

Le coût se chiffre : un trajet ΔS coûte environ ½Γ(ΔS)² — soit ½ × 0,018762 × 25 ≈ 0,23 par option, environ 470 sur les 1 000 : l'ordre de grandeur exact des 435 constatés, l'écart venant du gamma qui bouge en route.

Si l'histoire s'arrêtait là, personne ne vendrait jamais d'options. La contrepartie existe : le **theta**. Chaque jour sans mouvement ronge la valeur temps de mes calls vendus — je suis payé pour attendre. Le contrat de location complet : celui qui détient la convexité paie un loyer quotidien ; celui qui la subit l'encaisse. Et le point mort est remarquable : au prix Black-Scholes, le book s'équilibre si le marché réalise le mouvement « à un écart-type » de la vol vendue — environ 1,26 % par jour pour 20 %. En dessous, je gagne ; au-dessus, l'aller-retour de ce matin se répète — et le rouleau compresseur se rapproche.`,
    reponseModeleEn: `Because "delta-neutral" is an instantaneous state, not a subscription — and my short position carries a **negative gamma** that wrong-foots me by construction.

Replay the sequence. At the start: 1,000 short calls, delta 0.6368, i.e. −636.8 share equivalents — I hold 637 shares, a neutral book. The stock rises to 105: the call's delta goes to **0.7237** — I now need 724 shares. I **buy 87, at 105**. Then the stock falls back to 100: the delta returns to 0.6368 — I **sell my 87 shares back, at 100**. The market made a perfect round trip, my book is back where it started… minus 87 × 5 = **435**. No execution error: the delta-hedged seller buys after the rise and sells after the fall, mechanically. He chases the market, and every lap costs.

The cost can be quantified: a ΔS trip costs about ½Γ(ΔS)² — that is ½ × 0.018762 × 25 ≈ 0.23 per option, about 470 on the 1,000: exactly the order of magnitude of the 435 observed, the gap coming from gamma itself moving along the way.

If the story ended there, nobody would ever sell options. The compensation exists: **theta**. Every day without a move gnaws at the time value of my short calls — I am paid to wait. The full rental contract: whoever holds the convexity pays a daily rent; whoever suffers it collects. And the break-even is remarkable: at the Black-Scholes price, the book balances if the market realises the "one standard deviation" move of the vol sold — about 1.26% a day for 20%. Below that, I win; above it, this morning's round trip repeats — and the steamroller draws closer.`,
  },
  {
    id: 'm8-j-17',
    moduleId: M8,
    theme: 'les grecques et le delta-hedging',
    themeEn: 'the Greeks and delta-hedging',
    difficulte: 3,
    question: 'Gamma, theta, vega : dessinez-moi le tableau de bord d\'un book d\'options — et dites-moi quelle journée est bonne pour un vendeur delta-hedgé.',
    questionEn: 'Gamma, theta, vega: draw me an option book\'s dashboard — and tell me what kind of day is good for a delta-hedged seller.',
    plan: [
      'Poser l\'équation du book delta-hedgé : P&L ≈ ½Γ(ΔS)² + ΘΔt — le marché bouge, le temps passe : deux termes, tout est là',
      'Lire le premier terme : le carré efface la direction — seule l\'amplitude compte ; gamma positif pour l\'acheteur, négatif pour le vendeur',
      'Lire le second : le theta est le loyer du gamma — qui détient la convexité paie, qui la subit encaisse ; point mort au mouvement « à un écart-type », ≈ 1,26 % par jour pour 20 % de vol',
      'Ajouter le vega et cartographier : sensibilité à la volatilité, maximal ATM, croissant avec la maturité — options courtes affaires de gamma, longues affaires de vega ; la bonne journée du vendeur : le calme plat',
    ],
    planEn: [
      'State the delta-hedged book\'s equation: P&L ≈ ½Γ(ΔS)² + ΘΔt — the market moves, time passes: two terms, everything is there',
      'Read the first term: the square erases direction — only amplitude matters; gamma positive for the buyer, negative for the seller',
      'Read the second: theta is gamma\'s rent — whoever holds the convexity pays, whoever suffers it collects; break-even at the "one standard deviation" move, ≈ 1.26% a day for 20% vol',
      'Add vega and map: sensitivity to volatility, maximal ATM, increasing with maturity — short options are gamma instruments, long ones vega instruments; the seller\'s good day: dead calm',
    ],
    pointsAttendus: [
      'L\'équation maîtresse, une fois le delta neutralisé : P&L ≈ ½Γ(ΔS)² + ΘΔt — le terme de convexité et le terme de temps ; delta-neutre ne veut pas dire P&L nul',
      'Le carré qui efface la direction : hausse ou baisse, seule l\'amplitude compte — les jours agités paient l\'acheteur de gamma, les jours calmes font tomber le loyer quand même',
      'Le couple gamma-theta : deux faces du même contrat de location — le détenteur de la convexité paie le theta, le vendeur l\'encaisse ; au prix Black-Scholes, le point mort est le mouvement à un écart-type : σ/√252 ≈ 1,26 % par jour pour 20 %',
      'Le gamma dans l\'espace et le temps : maximal à la monnaie, il explose près de l\'échéance — de 0,019 à un an à 0,20 à quelques jours : le delta d\'une ATM qui expire saute de 0 à 1, l\'heure où les hedgers transpirent',
      'Le vega : sensibilité au point de vol (0,3752 sur le canonique — σ de 20 à 21 fait passer le call de 10,45 à 10,83), identique call et put, maximal ATM, CROISSANT avec la maturité — contrairement au gamma',
      'La cartographie du desk et la réponse : options courtes = instruments à gamma, longues = instruments à vega ; la bonne journée du vendeur delta-hedgé est une journée sans mouvement — il encaisse le theta sans payer de facture gamma',
    ],
    pointsAttendusEn: [
      'The master equation, once delta is neutralised: P&L ≈ ½Γ(ΔS)² + ΘΔt — the convexity term and the time term; delta-neutral does not mean zero P&L',
      'The square that erases direction: up or down, only amplitude matters — hectic days pay the gamma buyer, calm days let the rent fall due anyway',
      'The gamma-theta couple: two faces of the same rental contract — the convexity holder pays theta, the seller collects it; at the Black-Scholes price, the break-even is the one-standard-deviation move: σ/√252 ≈ 1.26% a day for 20%',
      'Gamma in space and time: maximal at the money, it explodes near expiry — from 0.019 at one year to 0.20 at a few days: an expiring ATM\'s delta jumps from 0 to 1, the hour when hedgers sweat',
      'Vega: sensitivity per vol point (0.3752 on the canonical — σ from 20 to 21 takes the call from 10.45 to 10.83), identical for call and put, maximal ATM, INCREASING with maturity — unlike gamma',
      'The desk\'s map and the answer: short options = gamma instruments, long ones = vega instruments; the delta-hedged seller\'s good day is a day without movement — he collects theta without paying a gamma bill',
    ],
    bonus: [
      'Le paradoxe du vega, excellent à l\'oral : Black-Scholes suppose σ constante, et la salle passe ses journées à mesurer la sensibilité des prix aux variations d\'un paramètre censé ne pas varier — l\'aveu chiffré que le modèle se sait faux',
      'Le pont vers la vol : sur la vie entière de la position, le P&L cumulé a le signe de (vol réalisée² − vol implicite²) — acheter du gamma delta-hedgé, c\'est acheter de la volatilité au niveau implicite payé',
    ],
    bonusEn: [
      'The vega paradox, excellent at the oral: Black-Scholes assumes constant σ, and the floor spends its days measuring price sensitivity to changes in a parameter supposed not to change — the quantified confession that the model knows itself wrong',
      'The bridge to vol: over the position\'s whole life, cumulative P&L has the sign of (realised vol² − implied vol²) — buying delta-hedged gamma is buying volatility at the implied level paid',
    ],
    reponseModele: `Une fois le delta neutralisé, tout le P&L d'un book d'options tient en une ligne : **P&L ≈ ½Γ(ΔS)² + ΘΔt** — le marché bouge, le temps passe.

Le premier terme est en (ΔS)² : le **carré efface la direction**. Hausse ou baisse, seule l'amplitude compte. Le gamma est positif pour qui détient l'option — sa position s'incurve en sa faveur — et négatif pour qui l'a vendue : le réajustement à contre-pied, l'aller-retour perdant. Dans l'espace, le gamma culmine à la monnaie ; dans le temps, il **explose près de l'échéance** — de 0,019 à un an à 0,20 à quelques jours : le delta d'une ATM qui expire saute de 0 à 1 au moindre frémissement, l'heure où les hedgers transpirent.

Le second terme est le loyer : le **theta**. Gamma et theta sont les deux faces du même contrat de location — qui détient la convexité paie chaque jour ; qui la subit est payé pour attendre. Et le point mort est remarquable : au prix Black-Scholes, l'équilibre exact est le mouvement « à un écart-type » de la vol du pricing — σ/√252, soit environ 1,26 % par jour pour 20 %.

Troisième cadran : le **vega**, la sensibilité au point de volatilité — 0,3752 sur le canonique : σ passe de 20 à 21, le call de 10,45 à 10,83. Identique pour le call et le put, maximal à la monnaie, et — contrairement au gamma — croissant avec la maturité. D'où la cartographie du desk : **les options courtes sont des instruments à gamma, les longues des instruments à vega**.

Votre question, alors : la bonne journée du vendeur delta-hedgé est une journée de **calme plat** — le theta tombe, la facture gamma reste vide. Sa mauvaise journée est un grand mouvement, dans un sens ou dans l'autre : le carré ne pardonne pas. Il vend du désordre ; il prospère dans l'ennui.`,
    reponseModeleEn: `Once delta is neutralised, an option book's entire P&L fits in one line: **P&L ≈ ½Γ(ΔS)² + ΘΔt** — the market moves, time passes.

The first term is in (ΔS)²: the **square erases direction**. Up or down, only amplitude matters. Gamma is positive for whoever holds the option — the position curves in his favour — and negative for whoever sold it: the wrong-footed rebalancing, the losing round trip. In space, gamma peaks at the money; in time, it **explodes near expiry** — from 0.019 at one year to 0.20 at a few days: an expiring ATM's delta jumps from 0 to 1 at the slightest quiver, the hour when hedgers sweat.

The second term is the rent: **theta**. Gamma and theta are the two faces of the same rental contract — whoever holds the convexity pays daily; whoever suffers it is paid to wait. And the break-even is remarkable: at the Black-Scholes price, exact balance is the "one standard deviation" move of the pricing vol — σ/√252, about 1.26% a day for 20%.

Third dial: **vega**, the sensitivity per volatility point — 0.3752 on the canonical case: σ goes from 20 to 21, the call from 10.45 to 10.83. Identical for call and put, maximal at the money, and — unlike gamma — increasing with maturity. Hence the desk's map: **short options are gamma instruments, long ones vega instruments**.

Your question, then: the delta-hedged seller's good day is one of **dead calm** — theta falls due, the gamma bill stays empty. His bad day is a big move, either way: the square does not forgive. He sells disorder; he thrives on boredom.`,
  },
  {
    id: 'm8-j-18',
    moduleId: M8,
    theme: 'les grecques et le delta-hedging',
    themeEn: 'the Greeks and delta-hedging',
    difficulte: 4,
    question: 'Acheter un call, est-ce parier sur la hausse ?',
    questionEn: 'Is buying a call betting on a rise?',
    plan: [
      'Accorder le cas nu : oui — un pari haussier à levier, perte bornée à la prime, mais le temps travaille contre vous',
      'Introduire le renversement : delta-hedgez ce call — la direction disparaît au premier ordre, il reste ½Γ(ΔS)² + ΘΔt : du gamma contre du theta',
      'Nommer ce qui reste : un pari sur l\'AMPLITUDE — le P&L final a le signe de (vol réalisée − vol implicite) : vous avez acheté de la volatilité, au niveau implicite payé',
      'Conclure : l\'option est un pari sur la hausse pour qui la laisse nue, un pari sur le désordre pour qui la couvre — c\'est pourquoi la salle cote en vol, pas en euros',
    ],
    planEn: [
      'Concede the naked case: yes — a leveraged bullish bet, loss bounded at the premium, but time works against you',
      'Introduce the reversal: delta-hedge that call — direction disappears at first order, what remains is ½Γ(ΔS)² + ΘΔt: gamma against theta',
      'Name what remains: a bet on AMPLITUDE — the final P&L has the sign of (realised vol − implied vol): you bought volatility, at the implied level paid',
      'Conclude: the option is a bet on the rise for whoever leaves it naked, a bet on disorder for whoever hedges it — which is why the floor quotes in vol, not in euros',
    ],
    pointsAttendus: [
      'Le cas nu, à accorder d\'abord : le call canonique coûte 10,45 et porte un delta de 0,64 — l\'exposition d\'environ 64 de sous-jacent pour 10,45 décaissés, un levier d\'environ 6, perte bornée à la prime ; mais si le titre ne bouge pas, la valeur temps fond jour après jour',
      'Le renversement du delta-hedging : vendez 0,64 action contre votre call — la direction est neutralisée au premier ordre, et le P&L devient ½Γ(ΔS)² + ΘΔt : vous encaissez l\'agitation, vous payez le loyer',
      'Le point mort qui révèle la marchandise : le book s\'équilibre si le sous-jacent réalise le mouvement à un écart-type de la vol payée — s\'il réalise durablement plus que l\'implicite d\'entrée, vous gagnez ; moins, vous perdez',
      'La conclusion conceptuelle : acheter une option et la delta-hedger, c\'est acheter de la VOLATILITÉ — ici à 20 le point d\'entrée : la direction a disparu du problème, seule l\'amplitude paie',
      'La version pure : le straddle delta-hedgé, position de vol du praticien ; et plus pur encore, le variance swap — exposition linéaire en variance, sans delta-hedging : la volatilité est devenue une classe d\'actifs',
      'La synthèse attendue : le même contrat est un pari directionnel chez l\'un et une position de volatilité chez l\'autre — l\'intention ne se lit pas dans l\'instrument, elle se lit dans la couverture qui l\'accompagne',
    ],
    pointsAttendusEn: [
      'The naked case, to concede first: the canonical call costs 10.45 and carries a 0.64 delta — exposure of about 64 of underlying for 10.45 paid out, roughly 6x leverage, loss bounded at the premium; but if the stock does not move, time value melts day after day',
      'The delta-hedging reversal: sell 0.64 shares against your call — direction is neutralised at first order, and the P&L becomes ½Γ(ΔS)² + ΘΔt: you collect the agitation, you pay the rent',
      'The break-even that reveals the merchandise: the book balances if the underlying realises the one-standard-deviation move of the vol paid — if it durably realises more than the entry implied, you win; less, you lose',
      'The conceptual conclusion: buying an option and delta-hedging it is buying VOLATILITY — here at 20 as the entry point: direction has vanished from the problem, only amplitude pays',
      'The pure version: the delta-hedged straddle, the practitioner\'s vol position; purer still, the variance swap — linear exposure to variance, no delta-hedging: volatility has become an asset class',
      'The expected synthesis: the same contract is a directional bet for one and a volatility position for the other — intent cannot be read in the instrument, it is read in the hedge that accompanies it',
    ],
    bonus: [
      'L\'écho du module 7 : « le swap est-il un pari ? » — même grille : l\'instrument est neutre, la position globale décide ; ici, c\'est la couverture qui change la nature du pari',
      'La conséquence de cotation : puisque la marchandise réelle est la volatilité, les desks cotent en vol — « je paie le strike 100 à 20 » — et le vega traduit instantanément en euros ; c\'est la porte du chapitre 6',
    ],
    bonusEn: [
      'The module 7 echo: "is the swap a bet?" — same grid: the instrument is neutral, the overall position decides; here, it is the hedge that changes the nature of the bet',
      'The quoting consequence: since the real merchandise is volatility, desks quote in vol — "I pay the 100 strike at 20" — and vega translates instantly into euros; that is the door to chapter 6',
    ],
    reponseModele: `Nu, oui. Couvert, non — et c'est dans ce renversement que se cache la vraie nature de l'option.

Le cas nu d'abord : le call canonique coûte 10,45 et porte un delta de 0,64 — l'exposition d'environ 64 de sous-jacent pour 10,45 décaissés, un levier d'environ 6, avec une perte bornée à la prime. Un pari haussier, assumé — mais daté : si le titre ne bouge pas, la valeur temps fond jour après jour, et l'acheteur paie cette fonte.

Maintenant, **delta-hedgez** ce call : vendez 0,64 action en face. La direction disparaît au premier ordre — que le marché monte ou baisse d'un point, le book ne bronche pas. Ce qui reste tient en une ligne : P&L ≈ ½Γ(ΔS)² + ΘΔt. J'encaisse le carré des mouvements — hausse **ou** baisse, le carré efface le signe — et je paie le loyer theta. Le point mort est le mouvement à un écart-type de la vol payée : si le sous-jacent **réalise** durablement plus que les 20 % implicites de mon prix d'entrée, je gagne ; moins, je perds. La direction a quitté le problème : je n'ai pas parié sur la hausse — j'ai **acheté de la volatilité, à 20**.

La version pure existe : le straddle delta-hedgé, et plus pur encore le variance swap — exposition linéaire à la variance réalisée, sans couverture à gérer. La volatilité n'est plus un paramètre : c'est une classe d'actifs, qui se cote et se traite.

Ma synthèse : le même call est un pari directionnel chez celui qui le laisse nu, une position de volatilité chez celui qui le couvre — l'intention ne se lit pas dans l'instrument, elle se lit dans la couverture. Et c'est exactement pourquoi la salle cote les options en vol, pas en euros : la marchandise réelle du marché des options, c'est le désordre.`,
    reponseModeleEn: `Naked, yes. Hedged, no — and in that reversal hides the option's true nature.

The naked case first: the canonical call costs 10.45 and carries a 0.64 delta — exposure of about 64 of underlying for 10.45 paid out, roughly six-fold leverage, with the loss bounded at the premium. A bullish bet, assumed — but dated: if the stock does not move, time value melts day after day, and the buyer pays for that melting.

Now **delta-hedge** that call: sell 0.64 shares against it. Direction disappears at first order — whether the market rises or falls a point, the book does not flinch. What remains fits in one line: P&L ≈ ½Γ(ΔS)² + ΘΔt. I collect the square of the moves — rise **or** fall, the square erases the sign — and I pay the theta rent. The break-even is the one-standard-deviation move of the vol paid: if the underlying durably **realises** more than the 20% implied in my entry price, I win; less, I lose. Direction has left the problem: I did not bet on the rise — I **bought volatility, at 20**.

The pure version exists: the delta-hedged straddle, and purer still the variance swap — linear exposure to realised variance, with no hedge to manage. Volatility is no longer a parameter: it is an asset class, quoted and traded.

My synthesis: the same call is a directional bet for whoever leaves it naked, a volatility position for whoever hedges it — intent cannot be read in the instrument, it is read in the hedge. And that is exactly why the floor quotes options in vol, not in euros: the real merchandise of the options market is disorder.`,
  },
  {
    id: 'm8-j-19',
    moduleId: M8,
    theme: 'la volatilité implicite et le smile',
    themeEn: 'implied volatility and the smile',
    difficulte: 2,
    question: '« Ce call est-il cher ? » Répondez-moi comme un desk, pas comme un particulier.',
    questionEn: '"Is this call expensive?" Answer me like a desk, not like a retail investor.',
    plan: [
      'Refuser l\'unité : une prime en euros ne se compare à rien — strikes et maturités différents rendent les euros incommensurables',
      'Convertir : inverser Black-Scholes — l\'unique σ qui redonne la prime cotée est la volatilité implicite ; le vega garantit l\'unicité, la dichotomie fait le travail',
      'Comparer dans la bonne unité : implicite contre réalisée (σ_an = σ_jour × √252, la règle du 16), contre son histoire, contre les strikes voisins',
      'Illustrer : le canonique cote 10,4506, soit 20 de vol — « cher » si le sous-jacent n\'en réalise que 14, dans la moyenne si le VIX est à 20',
    ],
    planEn: [
      'Refuse the unit: a premium in euros compares to nothing — different strikes and maturities make euros incommensurable',
      'Convert: invert Black-Scholes — the unique σ that gives back the quoted premium is the implied volatility; vega guarantees uniqueness, bisection does the work',
      'Compare in the right unit: implied against realised (σ_an = σ_day × √252, the rule of 16), against its own history, against neighbouring strikes',
      'Illustrate: the canonical quotes 10.4506, i.e. 20 vol — "expensive" if the underlying only realises 14, average if the VIX is at 20',
    ],
    pointsAttendus: [
      'Le réflexe fondateur : comparer deux options de strikes et de maturités différents par leurs primes en euros n\'a aucun sens — il faut une échelle commune, comme le rendement pour les obligations',
      'La conversion : la volatilité implicite est l\'unique σ tel que le prix Black-Scholes retombe sur la prime cotée — unicité garantie par le vega (le prix croît strictement avec σ), calcul par dichotomie : 15 % donne 8,59, trop bas ; 25 % donne 12,34, trop haut ; convergence vers 20 %',
      'La langue du métier : les desks cotent en vol, pas en euros — « je paie le strike 100 à 20 » ; et le vega traduit : la cotation passe de 20 à 21, la prime prend 0,38',
      'Le premier étalon : la volatilité réalisée — σ_an = σ_jour × √252, la règle de tête √252 ≈ 16 : 1 % par jour ≈ 16 % par an ; « il cote 20 alors que le sous-jacent n\'en réalise que 14 » EST la réponse à « est-il cher ? »',
      'La mise en garde du rétroviseur : la réalisée regarde en arrière, l\'option paie sur l\'agitation future — l\'écart moyen entre les deux est structurel : la prime de risque de volatilité',
      'Les autres étalons du desk : la vol implicite comparée à sa propre histoire, aux strikes voisins (le smile), aux autres maturités (la structure par terme) — un prix d\'option se juge dans la nappe, jamais isolé',
    ],
    pointsAttendusEn: [
      'The founding reflex: comparing two options of different strikes and maturities by their euro premiums makes no sense — you need a common scale, like yield for bonds',
      'The conversion: implied volatility is the unique σ such that the Black-Scholes price lands on the quoted premium — uniqueness guaranteed by vega (the price rises strictly with σ), computed by bisection: 15% gives 8.59, too low; 25% gives 12.34, too high; convergence to 20%',
      'The trade\'s language: desks quote in vol, not in euros — "I pay the 100 strike at 20"; and vega translates: the quote goes from 20 to 21, the premium gains 0.38',
      'The first yardstick: realised volatility — σ_an = σ_day × √252, the mental rule √252 ≈ 16: 1% a day ≈ 16% a year; "it quotes 20 while the underlying only realises 14" IS the answer to "is it expensive?"',
      'The rear-view warning: realised looks backwards, the option pays on future agitation — the average gap between the two is structural: the volatility risk premium',
      'The desk\'s other yardsticks: implied vol against its own history, against neighbouring strikes (the smile), against other maturities (the term structure) — an option price is judged within the surface, never in isolation',
    ],
    bonus: [
      'L\'analogie qui fait mouche : personne ne juge une obligation à son prix en euros — on convertit en rendement ; la vol implicite est le rendement actuariel des options',
      'Anticiper la relance : « implicite au-dessus de la réalisée : est-ce un arbitrage ? » — non : c\'est le prix de l\'assurance ; encaisser cet écart expose précisément aux queues de distribution',
    ],
    bonusEn: [
      'The analogy that lands: nobody judges a bond by its euro price — you convert to yield; implied vol is the options\' yield to maturity',
      'Anticipate the follow-up: "implied above realised: is that an arbitrage?" — no: it is the price of insurance; collecting that gap exposes you precisely to the tails of the distribution',
    ],
    reponseModele: `Je commence par refuser l'unité de la question : « cher en euros » ne veut rien dire. Une prime dépend du strike, de la maturité, du niveau du spot — comparer deux primes en euros, c'est comparer deux obligations par leur prix sans regarder le rendement. Il faut convertir dans l'échelle commune du métier.

Cette échelle existe : la **volatilité implicite**. Le prix Black-Scholes croît strictement avec σ — c'est le vega — donc pour toute prime cotée il existe un unique σ qui la reproduit. Sur le canonique : le marché cote 10,4506 ; à 15 % de vol le modèle donne 8,59, trop bas ; à 25 %, 12,34, trop haut ; la dichotomie converge vers **20 %**. Ce call « cote 20 » — et les desks parlent ainsi : « je paie le strike 100 à 20 », le vega traduisant instantanément en euros — de 20 à 21, la prime prend 0,38.

Cher, alors ? Je compare dans la bonne unité. Premier étalon : la **volatilité réalisée** — écart-type des rendements constatés, annualisé en √252, la règle de tête : 1 % par jour ≈ 16 % par an. « Il cote 20 alors que le sous-jacent n'en réalise que 14 » est une vraie réponse — en gardant la mise en garde du rétroviseur : la réalisée regarde en arrière, l'option paiera sur l'agitation future, et l'écart moyen entre implicite et réalisée est structurel : la prime de risque de volatilité, le surcoût de l'assurance.

Ensuite, je situe le 20 dans la **nappe** : contre l'histoire de l'implicite du titre, contre les strikes voisins — le smile —, contre les autres maturités. La chute : un prix d'option ne se juge jamais isolé ni en euros — il se juge en vol, dans sa surface. Répondre autrement, c'est répondre en particulier.`,
    reponseModeleEn: `I start by refusing the question's unit: "expensive in euros" means nothing. A premium depends on the strike, the maturity, the spot level — comparing two premiums in euros is comparing two bonds by price without looking at yield. You must convert into the trade's common scale.

That scale exists: **implied volatility**. The Black-Scholes price rises strictly with σ — that is vega — so for any quoted premium there is a unique σ that reproduces it. On the canonical case: the market quotes 10.4506; at 15% vol the model gives 8.59, too low; at 25%, 12.34, too high; bisection converges to **20%**. This call "quotes 20" — and desks speak that way: "I pay the 100 strike at 20", with vega translating instantly into euros — from 20 to 21, the premium gains 0.38.

Expensive, then? I compare in the right unit. First yardstick: **realised volatility** — the standard deviation of observed returns, annualised by √252, the mental rule: 1% a day ≈ 16% a year. "It quotes 20 while the underlying only realises 14" is a real answer — keeping the rear-view warning: realised looks backwards, the option will pay on future agitation, and the average gap between implied and realised is structural: the volatility risk premium, the mark-up of insurance.

Then I place the 20 within the **surface**: against the stock\'s own implied history, against neighbouring strikes — the smile —, against other maturities. The closing line: an option price is never judged in isolation or in euros — it is judged in vol, within its surface. Answering otherwise is answering like a retail investor.`,
  },
  {
    id: 'm8-j-20',
    moduleId: M8,
    theme: 'la volatilité implicite et le smile',
    themeEn: 'implied volatility and the smile',
    difficulte: 2,
    question: 'Qu\'est-ce que le VIX — et que lisez-vous quand il cote 12, 20, 40 ou 80 ?',
    questionEn: 'What is the VIX — and what do you read when it quotes 12, 20, 40 or 80?',
    plan: [
      'Définir : la volatilité implicite à environ 30 jours des options sur le S&P 500, agrégée sur tout un panier de strikes, exprimée en pourcentage annualisé — calculée par le CBOE',
      'Expliquer le surnom : « l\'indice de la peur » — il monte quand les marchés chutent, car on se rue sur les puts et leur prix en vol s\'envole',
      'Donner les repères : 12 marché endormi, 20 moyenne de long terme, 40 crise ouverte, 80 les sommets de 2008 et mars 2020',
      'Souligner le double statut : indicateur ET actif — le VIX se traite (futures, options, trackers), et c\'est ce double statut qui a produit l\'accident de 2018',
    ],
    planEn: [
      'Define: the roughly 30-day implied volatility of S&P 500 options, aggregated over a whole basket of strikes, expressed as an annualised percentage — computed by the CBOE',
      'Explain the nickname: "the fear index" — it rises when markets fall, as investors rush into puts and their vol price soars',
      'Give the landmarks: 12 sleepy market, 20 long-term average, 40 open crisis, 80 the peaks of 2008 and March 2020',
      'Underline the double status: indicator AND asset — the VIX itself trades (futures, options, trackers), and that double status produced the 2018 accident',
    ],
    pointsAttendus: [
      'La définition : intuitivement, la volatilité implicite à environ 30 jours des options sur le S&P 500, agrégée sur un panier de strikes et annualisée — le thermomètre mondial de la volatilité cotée, calculé par le CBOE',
      'Le mécanisme du surnom : quand les marchés chutent, la demande de protection explose — les puts se paient plus cher en vol, et le VIX monte : la peur devient un chiffre',
      'Les repères à réciter : autour de 12, marché endormi ; autour de 20, la moyenne de long terme ; au-delà de 40, crise ouverte ; au-delà de 80, les sommets historiques — automne 2008 et mars 2020',
      'La lecture fine : le VIX ne prédit pas un krach — il cote le prix actuel de l\'assurance ; un VIX à 30 dit que la protection est chère, pas que la chute est certaine',
      'La construction savante : la recette du variance swap — un panier de puts et de calls hors de la monnaie de tous les strikes, pas une seule option à la monnaie ; c\'est pour cela que la définition officielle agrège toute la nappe',
      'Le double statut, décisif : le VIX se traite lui-même — futures, options, produits indiciels — à la fois indicateur et actif ; les produits short-vol adossés à ses futures ont produit le Volmageddon de février 2018',
    ],
    pointsAttendusEn: [
      'The definition: intuitively, the roughly 30-day implied volatility of S&P 500 options, aggregated over a basket of strikes and annualised — the world thermometer of quoted volatility, computed by the CBOE',
      'The nickname\'s mechanism: when markets fall, demand for protection explodes — puts get pricier in vol, and the VIX rises: fear becomes a number',
      'The landmarks to recite: around 12, a sleepy market; around 20, the long-term average; above 40, open crisis; above 80, the historic peaks — autumn 2008 and March 2020',
      'The fine reading: the VIX does not predict a crash — it quotes the current price of insurance; a VIX at 30 says protection is expensive, not that the fall is certain',
      'The learned construction: the variance swap recipe — a basket of out-of-the-money puts and calls across all strikes, not a single at-the-money option; that is why the official definition aggregates the whole surface',
      'The double status, decisive: the VIX itself trades — futures, options, index products — both indicator and asset; the short-vol products built on its futures produced February 2018\'s Volmageddon',
    ],
    bonus: [
      'La précision technique qui impressionne : le VIX est construit sur la réplication du variance swap — un panier d\'options de tous les strikes —, ce qui le rend indépendant de tout modèle particulier de pricing',
      'Anticiper la relance : « peut-on acheter le VIX au comptant ? » — non : on traite ses futures, et leur courbe en contango fait saigner les trackers longs — le coût du roll, écho du module 7',
    ],
    bonusEn: [
      'The technical precision that impresses: the VIX is built on the variance swap replication — a basket of options across all strikes — which makes it independent of any particular pricing model',
      'Anticipate the follow-up: "can you buy spot VIX?" — no: you trade its futures, and their contango curve bleeds long trackers — the roll cost, an echo of module 7',
    ],
    reponseModele: `Le VIX est le thermomètre mondial de la volatilité cotée : intuitivement, la **volatilité implicite à environ 30 jours des options sur le S&P 500**, agrégée sur tout un panier de strikes et exprimée en pourcentage annualisé — calculée en continu par le CBOE. Techniquement, sa recette est celle de la réplication d'un variance swap : des puts et des calls hors de la monnaie de tous les strikes, ce qui le rend indépendant d'un modèle particulier.

Son surnom — « l'indice de la peur » — décrit un mécanisme précis : quand les marchés chutent, on se rue sur les puts, leur prix en vol s'envole, et le VIX monte. La peur devient un chiffre coté en continu.

Les repères que je garde en tête : autour de **12**, marché endormi ; autour de **20**, la moyenne de long terme ; au-delà de **40**, crise ouverte ; au-delà de **80**, les sommets historiques — l'automne 2008 et mars 2020. Avec une lecture fine : le VIX ne *prédit* pas un krach — il cote le **prix actuel de l'assurance**. Un VIX à 30 dit que la protection est chère, pas que la chute est certaine.

Le point qui départage, enfin : le VIX a un **double statut**. Indicateur — l'écran que tout le monde regarde — et **actif** : il se traite lui-même, via futures, options et produits indiciels. C'est ce second statut qui a produit un accident d'école : les trackers short-vol adossés à ses futures, rentables des années durant, détruits en une séance le 5 février 2018 quand le VIX a bondi de 115 %. Le thermomètre était devenu un objet de pari — et le pari a cassé le thermomètre.`,
    reponseModeleEn: `The VIX is the world thermometer of quoted volatility: intuitively, the **roughly 30-day implied volatility of S&P 500 options**, aggregated over a whole basket of strikes and expressed as an annualised percentage — computed continuously by the CBOE. Technically, its recipe is that of a variance swap replication: out-of-the-money puts and calls across all strikes, which makes it independent of any particular model.

Its nickname — "the fear index" — describes a precise mechanism: when markets fall, investors rush into puts, their vol price soars, and the VIX rises. Fear becomes a continuously quoted number.

The landmarks I keep in mind: around **12**, a sleepy market; around **20**, the long-term average; above **40**, open crisis; above **80**, the historic peaks — autumn 2008 and March 2020. With a fine reading: the VIX does not *predict* a crash — it quotes the **current price of insurance**. A VIX at 30 says protection is expensive, not that the fall is certain.

The point that separates candidates, finally: the VIX has a **double status**. Indicator — the screen everyone watches — and **asset**: it trades itself, through futures, options and index products. That second status produced a textbook accident: the short-vol trackers built on its futures, profitable for years, destroyed in one session on 5 February 2018 when the VIX jumped 115%. The thermometer had become an object of betting — and the bet broke the thermometer.`,
  },
  {
    id: 'm8-j-21',
    moduleId: M8,
    theme: 'la volatilité implicite et le smile',
    themeEn: 'implied volatility and the smile',
    difficulte: 4,
    question: 'Pourquoi le smile existe-t-il, alors que Black-Scholes suppose une volatilité constante ?',
    questionEn: 'Why does the smile exist, when Black-Scholes assumes constant volatility?',
    plan: [
      'Poser la contradiction : sous Black-Scholes, toutes les options d\'un même sous-jacent et d\'une même échéance devraient afficher le MÊME σ — et c\'était à peu près vrai avant octobre 1987',
      'Dater la cicatrice : le 19 octobre 1987, −22,6 % en une séance — un événement à peu près impossible sous la loi normale ; la nappe ne s\'est jamais remise à plat',
      'Donner les deux lectures : la crash-o-phobie (la queue gauche épaisse, facturée dans les puts) et l\'effet de levier (une action qui chute rend l\'entreprise plus léveragée, donc plus volatile)',
      'Résoudre la contradiction : le smile ne réfute pas Black-Scholes, il le rétrograde — de description du monde à langue de cotation ; le smile est l\'endroit où le marché corrige le modèle',
    ],
    planEn: [
      'State the contradiction: under Black-Scholes, all options on one underlying and one expiry should show the SAME σ — and that was roughly true before October 1987',
      'Date the scar: 19 October 1987, −22.6% in one session — a roughly impossible event under the normal law; the surface never flattened again',
      'Give the two readings: crash-o-phobia (the fat left tail, billed into the puts) and the leverage effect (a falling stock makes the firm more leveraged, hence more volatile)',
      'Resolve the contradiction: the smile does not refute Black-Scholes, it demotes it — from description of the world to quoting language; the smile is where the market corrects the model',
    ],
    pointsAttendus: [
      'La contradiction logique, énoncée proprement : un seul processus lognormal à σ unique implique une nappe de vols implicites PLATE — si chaque strike cote sa vol, le modèle est réfuté comme description du monde',
      'L\'histoire : avant octobre 1987, la nappe était à peu près plate ; le lundi noir — Dow −22,6 % en une séance, quasi impossible sous la cloche — l\'a définitivement déformée : depuis, les puts hors de la monnaie se paient durablement plus cher en vol que l\'ATM',
      'Première lecture, la crash-o-phobie : le marché a appris que la vraie distribution a une queue gauche épaisse que la log-normale ignore — et il facture cette queue dans les puts, l\'assurance anti-krach',
      'Seconde lecture, l\'effet de levier : quand l\'action chute, les dettes de l\'entreprise ne chutent pas avec elle — l\'actionnaire est mécaniquement plus léveragé, l\'action plus volatile dans la baisse ; la vol monte quand le prix descend, les strikes bas en héritent',
      'La résolution : le marché sait le modèle faux depuis 1987 et continue de coter VIA lui — Black-Scholes rétrogradé de description du monde à langue de cotation, un convertisseur prix-vol universel et inversible ; le smile est précisément l\'endroit où le marché corrige le modèle',
      'L\'extension : la surface de volatilité — une vol par couple (strike, maturité) ; structure par terme croissante en temps calme, inversée en crise — le desk ne gère pas un prix, il gère une nappe',
    ],
    pointsAttendusEn: [
      'The logical contradiction, cleanly stated: a single lognormal process with one σ implies a FLAT implied vol surface — if each strike quotes its own vol, the model is refuted as a description of the world',
      'The history: before October 1987, the surface was roughly flat; Black Monday — Dow −22.6% in one session, near-impossible under the bell — deformed it for good: since then, out-of-the-money puts durably cost more in vol than the ATM',
      'First reading, crash-o-phobia: the market learned that the true distribution has a fat left tail the lognormal ignores — and it bills that tail into the puts, the anti-crash insurance',
      'Second reading, the leverage effect: when the stock falls, the firm\'s debts do not fall with it — the shareholder is mechanically more leveraged, the stock more volatile on the way down; vol rises as price falls, and low strikes inherit it',
      'The resolution: the market has known the model wrong since 1987 and keeps quoting THROUGH it — Black-Scholes demoted from description of the world to quoting language, a universal, invertible price-vol converter; the smile is precisely where the market corrects the model',
      'The extension: the volatility surface — one vol per (strike, maturity) pair; term structure rising in calm times, inverted in crisis — the desk does not manage a price, it manages a surface',
    ],
    bonus: [
      'Le pont vers le module 2 : le smile est le prix coté de la non-normalité — les queues épaisses du cours de statistique, devenues une pente observable sur un écran',
      'La formulation qui classe : « Black-Scholes est faux comme modèle et indispensable comme convention — le smile est l\'endroit exact où le marché corrige le modèle » ; dire « le smile prouve que BS est inutilisable » est le contresens à éviter',
    ],
    bonusEn: [
      'The bridge to module 2: the smile is the quoted price of non-normality — the statistics course\'s fat tails, become an observable slope on a screen',
      'The phrasing that ranks you: "Black-Scholes is wrong as a model and indispensable as a convention — the smile is the exact place where the market corrects the model"; saying "the smile proves BS is unusable" is the misreading to avoid',
    ],
    reponseModele: `Commençons par la contradiction, car elle est réelle : si le monde était celui de Black-Scholes — une log-normale à σ unique —, toutes les options d'un même sous-jacent et d'une même échéance afficheraient la **même** volatilité implicite, quel que soit le strike. La nappe serait plate. Et elle l'était, à peu près — avant octobre 1987.

Puis vint le lundi noir : le 19 octobre 1987, le Dow perd **22,6 % en une séance** — un mouvement que la loi normale qualifie d'à peu près impossible. La nappe ne s'est jamais remise à plat : depuis, sur les marchés actions, les puts hors de la monnaie se paient durablement plus cher en vol que les options à la monnaie — le skew, le sourire asymétrique.

Deux lectures se complètent. La **crash-o-phobie** : le marché a appris, dans sa chair, que la vraie distribution a une queue gauche épaisse que la log-normale ignore — et il facture cette queue là où elle fait mal : dans les puts, l'assurance anti-krach. L'**effet de levier** : quand une action chute, les dettes de l'entreprise ne chutent pas avec elle — l'actionnaire est mécaniquement plus léveragé, donc l'action plus volatile dans la baisse ; la vol monte quand le prix descend, et les strikes bas en héritent.

Reste à résoudre le paradoxe de votre question — et c'est là que je veux être précis. Le smile **réfute** Black-Scholes comme description du monde : chaque strike avec sa vol est logiquement incompatible avec un σ unique. Mais le marché ne l'a pas jeté : il l'a **rétrogradé** en langue de cotation — un convertisseur prix-vol universel et inversible, dans lequel le smile est précisément l'endroit où le marché corrige le modèle. Ajoutez les maturités et vous avez l'objet réel du desk : la surface de volatilité, dont la pente par terme s'inverse en crise.

Ma formulation de synthèse : **faux comme modèle, indispensable comme convention** — et le smile n'est pas une anomalie de Black-Scholes : c'est la mémoire de 1987, gravée dans les prix.`,
    reponseModeleEn: `Let me start with the contradiction, because it is real: if the world were Black-Scholes' — one lognormal with a single σ —, all options on one underlying and one expiry would show the **same** implied volatility, whatever the strike. The surface would be flat. And it was, roughly — before October 1987.

Then came Black Monday: on 19 October 1987, the Dow lost **22.6% in one session** — a move the normal law calls roughly impossible. The surface never flattened again: since then, on equity markets, out-of-the-money puts durably cost more in vol than at-the-money options — the skew, the asymmetric smile.

Two readings complement each other. **Crash-o-phobia**: the market learned, in its flesh, that the true distribution has a fat left tail the lognormal ignores — and it bills that tail where it hurts: in the puts, the anti-crash insurance. The **leverage effect**: when a stock falls, the firm's debts do not fall with it — the shareholder is mechanically more leveraged, hence the stock more volatile on the way down; vol rises as price falls, and low strikes inherit it.

There remains your question's paradox to resolve — and here I want to be precise. The smile **refutes** Black-Scholes as a description of the world: each strike having its own vol is logically incompatible with a single σ. But the market did not throw the model away: it **demoted** it to a quoting language — a universal, invertible price-vol converter, in which the smile is precisely the place where the market corrects the model. Add maturities and you have the desk's real object: the volatility surface, whose term slope inverts in a crisis.

My summary phrasing: **wrong as a model, indispensable as a convention** — and the smile is not a Black-Scholes anomaly: it is the memory of 1987, engraved in the prices.`,
  },
  {
    id: 'm8-j-22',
    moduleId: M8,
    theme: 'la volatilité implicite et le smile',
    themeEn: 'implied volatility and the smile',
    difficulte: 3,
    question: 'La volatilité implicite est-elle une prévision ?',
    questionEn: 'Is implied volatility a forecast?',
    plan: [
      'Poser le statut : la vol implicite est un PRIX — l\'unique σ qui réconcilie le modèle et la prime cotée —, pas un sondage des anticipations',
      'Donner le fait statistique : sur les grands indices, l\'implicite dépasse EN MOYENNE la réalisée ultérieure — comme prévision, elle serait systématiquement biaisée à la hausse',
      'Nommer le biais : la prime de risque de volatilité — une option est une assurance, et une assurance se paie au-dessus de son coût actuariel',
      'Conclure en nuance : de l\'information dedans, mais une prime par-dessus — le VIX à 30 dit que la protection est chère, pas que le krach est certain ; le jumeau du « forward qui prévoit »',
    ],
    planEn: [
      'State the status: implied vol is a PRICE — the unique σ reconciling the model and the quoted premium —, not a poll of expectations',
      'Give the statistical fact: on major indices, implied exceeds ON AVERAGE the subsequently realised — as a forecast, it would be systematically biased upwards',
      'Name the bias: the volatility risk premium — an option is insurance, and insurance is paid above its actuarial cost',
      'Conclude with nuance: information inside, but a premium on top — a VIX at 30 says protection is expensive, not that a crash is certain; the twin of "the forward forecasts"',
    ],
    pointsAttendus: [
      'Le statut exact : la vol implicite est extraite d\'un prix de marché par inversion de Black-Scholes — c\'est le niveau de σ que l\'acheteur PAIE, pas celui que le marché « croit »',
      'Le fait statistique central : mises côte à côte jour après jour, l\'implicite est en moyenne AU-DESSUS de la volatilité que le sous-jacent réalise ensuite — une « prévision » systématiquement biaisée à la hausse',
      'L\'explication du biais : la prime de risque de volatilité — l\'acheteur de protection surpaie un peu pour être couvert le jour où tout casse, le vendeur exige cette marge pour porter le risque de queue : la prime d\'assurance dépasse l\'espérance des sinistres',
      'La conséquence de lecture : un VIX à 30 ne dit pas « le krach arrive » — il dit « l\'assurance est chère » ; confondre le prix de la peur avec une probabilité de sinistre est le contresens',
      'La nuance à défendre : il y a bien de l\'information dedans — l\'implicite intègre l\'agenda (annonces, élections) et réagit plus vite que l\'historique ; mais elle contient un prix de risque, pas une espérance pure',
      'Le rapprochement transversal : même grille que le forward du module 7 et le q risque-neutre — les objets tirés des prix d\'arbitrage contiennent les anticipations PLUS les primes de risque, jamais les anticipations seules',
    ],
    pointsAttendusEn: [
      'The exact status: implied vol is extracted from a market price by inverting Black-Scholes — it is the level of σ the buyer PAYS, not the one the market "believes"',
      'The central statistical fact: set side by side day after day, implied is on average ABOVE the volatility the underlying then realises — a "forecast" systematically biased upwards',
      'The bias explained: the volatility risk premium — the protection buyer slightly overpays to be covered the day everything breaks, the seller demands that margin to carry tail risk: the insurance premium exceeds the expected claims',
      'The reading consequence: a VIX at 30 does not say "the crash is coming" — it says "insurance is expensive"; confusing the price of fear with a probability of disaster is the misreading',
      'The nuance to defend: there IS information inside — implied vol incorporates the calendar (announcements, elections) and reacts faster than historical measures; but it contains a price of risk, not a pure expectation',
      'The cross-module link: the same grid as module 7\'s forward and the risk-neutral q — objects extracted from arbitrage prices contain expectations PLUS risk premia, never expectations alone',
    ],
    bonus: [
      'Le miroir professionnel : c\'est précisément parce que l\'implicite n\'est pas une prévision pure que le métier de vendeur de volatilité existe — encaisser l\'écart moyen est la rémunération de l\'assureur, pas un arbitrage',
      'Anticiper la relance : « alors pourquoi tout le monde la regarde ? » — parce qu\'un prix payé par des acteurs qui risquent leur argent reste le meilleur agrégateur d\'information disponible : biaisé, mais informatif',
    ],
    bonusEn: [
      'The professional mirror: it is precisely because implied vol is not a pure forecast that the volatility seller\'s business exists — collecting the average gap is the insurer\'s pay, not an arbitrage',
      'Anticipate the follow-up: "then why does everyone watch it?" — because a price paid by players risking their own money remains the best information aggregator available: biased, but informative',
    ],
    reponseModele: `Non — c'est un **prix**, et la nuance vaut la question entière. La vol implicite est extraite d'une prime cotée par inversion de Black-Scholes : c'est le niveau de σ que l'acheteur **paie**, pas celui que le marché « croit ». Entre payer et croire, il y a exactement une prime de risque.

Le fait statistique tranche : mises côte à côte jour après jour sur les grands indices, la volatilité implicite est **en moyenne au-dessus** de la volatilité que le sous-jacent réalise ensuite. Prise comme prévision, elle serait systématiquement biaisée à la hausse — un prévisionniste qu'on aurait congédié depuis longtemps. Comme prix, elle est parfaitement rationnelle : une option est une assurance, et une assurance se paie **au-dessus de son coût actuariel**. L'acheteur de protection surpaie un peu pour être couvert le jour où tout casse ; le vendeur exige cette marge pour porter la queue de distribution. Cet écart a un nom : la prime de risque de volatilité.

D'où la lecture propre des écrans : un VIX à 30 ne dit pas « le krach arrive » — il dit « l'assurance est chère ». Confondre le prix de la peur avec une probabilité de sinistre est le contresens que cette question débusque.

Je défends pourtant la nuance : il y a de l'information dedans. L'implicite intègre l'agenda — résultats, élections, banques centrales — et réagit bien plus vite que toute mesure historique. Mais elle livre les anticipations **plus** la prime de risque, jamais les anticipations seules.

La chute transversale : même grille que le forward qui « prévoyait » la hausse et que le q risque-neutre — tout objet tiré d'un prix d'arbitrage contient une prime de risque. Et c'est précisément parce que l'implicite n'est pas une prévision pure que le métier de vendeur de volatilité existe : encaisser l'écart moyen est la rémunération de l'assureur — pas un arbitrage.`,
    reponseModeleEn: `No — it is a **price**, and that nuance is worth the entire question. Implied vol is extracted from a quoted premium by inverting Black-Scholes: it is the level of σ the buyer **pays**, not the one the market "believes". Between paying and believing lies exactly one risk premium.

The statistical fact settles it: set side by side day after day on major indices, implied volatility is **on average above** the volatility the underlying then realises. Taken as a forecast, it would be systematically biased upwards — a forecaster long since dismissed. Taken as a price, it is perfectly rational: an option is insurance, and insurance is paid **above its actuarial cost**. The protection buyer slightly overpays to be covered the day everything breaks; the seller demands that margin to carry the tail of the distribution. The gap has a name: the volatility risk premium.

Hence the clean reading of the screens: a VIX at 30 does not say "the crash is coming" — it says "insurance is expensive". Confusing the price of fear with a probability of disaster is the misreading this question is designed to flush out.

Yet I would defend the nuance: there is information inside. Implied vol incorporates the calendar — earnings, elections, central banks — and reacts far faster than any historical measure. But it delivers expectations **plus** the risk premium, never expectations alone.

The cross-module closing line: the same grid as the forward that "forecast" a rise and the risk-neutral q — anything extracted from an arbitrage price contains a risk premium. And it is precisely because implied vol is not a pure forecast that the volatility seller's business exists: collecting the average gap is the insurer's pay — not an arbitrage.`,
  },
  {
    id: 'm8-j-23',
    moduleId: M8,
    theme: 'usages, risques et accidents',
    themeEn: 'uses, risks and accidents',
    difficulte: 3,
    question: 'Racontez-moi le 5 février 2018 — le « Volmageddon ».',
    questionEn: 'Tell me about 5 February 2018 — "Volmageddon".',
    plan: [
      'Planter le décor : des années de calme exceptionnel, VIX scotché sous 12 — et la vente de volatilité devenue produit grand public : des trackers short-vol comme le XIV, la performance inverse des futures VIX en un clic',
      'Nommer la stratégie : la prime de risque de volatilité, industrialisée — des gains réguliers pendant des années : la signature de l\'assureur',
      'Décrire la séance : le VIX bondit de 115 %, sa plus forte hausse en une journée — les produits short-vol doivent racheter des futures VIX DANS la hausse pour se rééquilibrer, amplifiant le pic qui les détruit',
      'Chiffrer et conclure : le XIV perd environ 96 % et est liquidé — les porteurs croyaient détenir un placement ; ils vendaient de l\'assurance contre la peur, avec du levier, sans le savoir',
    ],
    planEn: [
      'Set the scene: years of exceptional calm, VIX stuck below 12 — and volatility selling turned mass-market product: short-vol trackers like XIV, the inverse performance of VIX futures in one click',
      'Name the strategy: the volatility risk premium, industrialised — regular gains for years: the insurer\'s signature',
      'Describe the session: the VIX jumps 115%, its biggest one-day rise — the short-vol products must buy back VIX futures INTO the spike to rebalance, amplifying the peak that destroys them',
      'Quantify and conclude: XIV loses about 96% and is liquidated — the holders thought they owned an investment; they were selling insurance against fear, with leverage, without knowing it',
    ],
    pointsAttendus: [
      'Le contexte : après des années de calme exceptionnel — VIX durablement sous 12 —, vendre de la volatilité était devenu un produit grand public : le XIV offrait en un clic la performance inverse des futures sur VIX',
      'La stratégie sous-jacente : encaisser la prime de risque de volatilité, industrialisée — gagnante régulièrement pendant des années : la signature P&L de l\'assureur, petits gains répétés avant le sinistre',
      'La séance du 5 février 2018 : le VIX bondit de 115 % en une journée — sa plus forte hausse historique, la pire journée des vendeurs de volatilité',
      'La mécanique auto-aggravante : pour se rééquilibrer, les produits short-vol doivent racheter massivement des futures VIX DANS la hausse — leurs rachats nourrissent le pic qui les détruit : la boucle de 1987, transposée à la volatilité',
      'Le bilan : le XIV perd environ 96 % de sa valeur et son émetteur le liquide dans la foulée — les porteurs croyaient détenir un placement ; ils vendaient de l\'assurance contre la peur, avec du levier, sans le savoir',
      'La leçon générale : quand une stratégie mécanique devient assez grosse, sa couverture cesse de subir les prix et les fabrique — et le double statut du VIX (indicateur devenu actif) était la condition de l\'accident',
    ],
    pointsAttendusEn: [
      'The context: after years of exceptional calm — VIX durably below 12 —, selling volatility had become a mass-market product: XIV offered in one click the inverse performance of VIX futures',
      'The underlying strategy: collecting the volatility risk premium, industrialised — winning regularly for years: the insurer\'s P&L signature, small repeated gains before the claim',
      'The session of 5 February 2018: the VIX jumps 115% in one day — its biggest rise on record, the volatility sellers\' worst day',
      'The self-aggravating mechanics: to rebalance, the short-vol products must massively buy back VIX futures INTO the rise — their buying feeds the spike that destroys them: the 1987 loop, transposed to volatility',
      'The tally: XIV loses about 96% of its value and its issuer liquidates it in the aftermath — the holders thought they owned an investment; they were selling insurance against fear, with leverage, without knowing it',
      'The general lesson: when a mechanical strategy grows big enough, its hedging stops taking prices and starts making them — and the VIX\'s double status (indicator turned asset) was the accident\'s precondition',
    ],
    bonus: [
      'Le fil rouge du chapitre : 1987, 2018, 2021 — trois fois la même structure : des acteurs obligés de traiter dans le sens du mouvement transforment un choc en spirale ; la couverture des uns est le flux des autres',
      'Anticiper la relance : « le produit était-il mal conçu ? » — le prospectus disait le risque ; le problème était le décalage entre la signature P&L (des années de gains) et la nature réelle (vente d\'assurance à levier) : trois années calmes ne prouvent pas l\'absence de rouleau compresseur',
    ],
    bonusEn: [
      'The chapter\'s common thread: 1987, 2018, 2021 — three times the same structure: players forced to trade in the direction of the move turn a shock into a spiral; one side\'s hedge is the other side\'s flow',
      'Anticipate the follow-up: "was the product badly designed?" — the prospectus stated the risk; the problem was the gap between the P&L signature (years of gains) and the true nature (leveraged insurance selling): three calm years prove no absence of steamroller',
    ],
    reponseModele: `C'est la leçon de 1987 rejouée en miniature et en accéléré — sur la volatilité elle-même.

Le décor : des années de calme exceptionnel, un VIX scotché sous 12. Dans ce paysage, vendre de la volatilité était devenu un **produit grand public** : des trackers short-vol comme le **XIV** offraient, en un clic, la performance inverse des futures sur VIX. La stratégie sous-jacente — encaisser la prime de risque de volatilité — avait gagné régulièrement pendant des années. Relisez cette phrase avec le chapitre 1 en tête : petits gains répétés, sinistre rare — c'est la signature de l'assureur. Les porteurs croyaient détenir un placement ; ils vendaient de l'assurance contre la peur, avec du levier, sans le savoir.

Le 5 février 2018, le VIX bondit de **115 % en une séance** — sa plus forte hausse en une journée. Et la mécanique s'inverse : pour se rééquilibrer, les produits short-vol doivent **racheter massivement des futures VIX dans la hausse** — leurs rachats nourrissent le pic qui les détruit. C'est la boucle de 1987 — vendre dans la baisse — transposée à la volatilité : acheter dans la hausse de la peur. Le XIV perd environ **96 %** de sa valeur ; son émetteur le liquide dans la foulée.

Deux leçons à en tirer devant vous. La première : le double statut du VIX — indicateur devenu actif — était la condition de l'accident : on ne peut pas parier en masse sur un thermomètre sans finir par le faire bouger. La seconde, le fil rouge du chapitre : quand une stratégie mécanique devient assez grosse, sa couverture cesse de subir les prix — elle les fabrique. Des années de gains n'avaient rien prouvé, sinon l'absence de sinistre ; le rouleau compresseur est passé en une séance.`,
    reponseModeleEn: `It is the 1987 lesson replayed in miniature and at speed — on volatility itself.

The scene: years of exceptional calm, a VIX stuck below 12. In that landscape, selling volatility had become a **mass-market product**: short-vol trackers like **XIV** offered, in one click, the inverse performance of VIX futures. The underlying strategy — collecting the volatility risk premium — had won regularly for years. Reread that sentence with chapter 1 in mind: small repeated gains, a rare claim — it is the insurer's signature. The holders thought they owned an investment; they were selling insurance against fear, with leverage, without knowing it.

On 5 February 2018, the VIX jumped **115% in one session** — its biggest one-day rise. And the mechanics reversed: to rebalance, the short-vol products had to **buy back VIX futures massively into the rise** — their buying fed the spike that was destroying them. It is the 1987 loop — selling into the fall — transposed to volatility: buying into the rise of fear. XIV lost about **96%** of its value; its issuer liquidated it in the aftermath.

Two lessons to draw in front of you. First: the VIX's double status — indicator turned asset — was the accident's precondition: you cannot bet at scale on a thermometer without eventually moving it. Second, the chapter's common thread: when a mechanical strategy grows big enough, its hedging stops taking prices — it makes them. Years of gains had proved nothing except the absence of a claim; the steamroller came through in one session.`,
  },
  {
    id: 'm8-j-24',
    moduleId: M8,
    theme: 'usages, risques et accidents',
    themeEn: 'uses, risks and accidents',
    difficulte: 4,
    question: 'Racontez-moi un accident où le gamma a tué le desk.',
    questionEn: 'Tell me about an accident where gamma killed the desk.',
    plan: [
      'Choisir GameStop, janvier 2021 — le gamma squeeze : des particuliers coordonnés achètent en masse des calls courts hors de la monnaie, les moins chers et les plus léveragés',
      'Dérouler la mécanique : les market makers vendeurs couvrent en achetant l\'action ; la hausse rapproche les calls de la monnaie — zone de gamma maximal près de l\'échéance — leur delta bondit, il faut acheter encore : la boucle réflexive',
      'Doubler avec 1987 : la portfolio insurance répliquait un put par delta-hedging — vendre dans la baisse ; des dizaines de milliards au même plan, et les ventes nourrissent la chute : Dow −22,6 %',
      'Généraliser : trois accidents, une structure — des acteurs OBLIGÉS de traiter dans le sens du mouvement ; la couverture des uns est le flux des autres, et le dérivé finit par piloter le sous-jacent',
    ],
    planEn: [
      'Choose GameStop, January 2021 — the gamma squeeze: coordinated retail buys short-dated out-of-the-money calls en masse, the cheapest and most leveraged',
      'Walk the mechanics: the market makers who sold them hedge by buying the stock; the rise brings the calls towards the money — the zone of maximal gamma near expiry — their delta jumps, more buying is needed: the reflexive loop',
      'Double with 1987: portfolio insurance replicated a put by delta-hedging — selling into the fall; tens of billions on the same plan, and the selling feeds the fall: Dow −22.6%',
      'Generalise: three accidents, one structure — players FORCED to trade in the direction of the move; one side\'s hedge is the other side\'s flow, and the derivative ends up steering the underlying',
    ],
    pointsAttendus: [
      'GameStop, le montage : des particuliers coordonnés achètent en masse des calls à échéance courte, hors de la monnaie — les moins chers, les plus léveragés ; en face, les market makers vendeurs ne spéculent pas : ils couvrent leur delta négatif en achetant des actions',
      'Le rôle exact du gamma : quand le titre monte, les calls OTM se rapprochent de la monnaie — précisément la zone où le gamma est maximal près de l\'échéance ; leur delta bondit, la couverture exige d\'acheter ENCORE, ce qui fait monter le titre, rapproche d\'autres strikes, force d\'autres achats',
      'La boucle réflexive nommée : la couverture des vendeurs d\'options devient le carburant de la hausse — le titre s\'envole non parce qu\'on a décidé qu\'il valait plus, mais parce que la tuyauterie du delta-hedging l\'exige ; ajoutez les vendeurs à découvert forcés de racheter',
      'Le second exemple, 1987 : la portfolio insurance répliquait des puts par delta-hedging — vendre des futures dans la baisse ; des dizaines de milliards exécutant le même ordre dans le même sens, et les ventes nourrissent la baisse : Dow −22,6 % en une séance, naissance du skew',
      'La structure commune, à formuler : des acteurs obligés de traiter dans le sens du mouvement — non par avidité, mais par construction de leur couverture — transforment un choc en spirale : quand une stratégie mécanique devient assez grosse, elle cesse de subir les prix et les fabrique',
      'La leçon de gestion : le gamma vendu se limite en agrégé, et il explose à la monnaie près de l\'échéance — c\'est LE paramètre que la salle surveille les jours d\'expiration ; la réplication suppose un marché liquide où l\'on traite sans peser sur les prix : quand tout le monde a le même plan, le plan échoue',
    ],
    pointsAttendusEn: [
      'GameStop, the setup: coordinated retail buys short-dated, out-of-the-money calls en masse — the cheapest, most leveraged; opposite, the market makers who sold them are not speculating: they hedge their negative delta by buying shares',
      'Gamma\'s exact role: as the stock rises, the OTM calls approach the money — precisely the zone where gamma is maximal near expiry; their delta jumps, the hedge demands buying MORE, which lifts the stock, brings other strikes closer, forces more buying',
      'The reflexive loop named: the option sellers\' hedging becomes the fuel of the rise — the stock soars not because anyone decided it was worth more, but because the delta-hedging plumbing demands it; add the short sellers forced to buy back',
      'The second example, 1987: portfolio insurance replicated puts by delta-hedging — selling futures into the fall; tens of billions executing the same order in the same direction, and the selling feeds the fall: Dow −22.6% in one session, birth of the skew',
      'The common structure, to phrase: players forced to trade in the direction of the move — not out of greed, but by construction of their hedge — turn a shock into a spiral: when a mechanical strategy grows big enough, it stops taking prices and starts making them',
      'The management lesson: sold gamma is capped in aggregate, and it explodes at the money near expiry — THE parameter the floor watches on expiry days; replication assumes a liquid market where you trade without moving prices: when everyone has the same plan, the plan fails',
    ],
    bonus: [
      'Le troisième frère : Volmageddon 2018 — racheter des futures VIX dans la hausse de la vol : même boucle, troisième marché ; savoir aligner les trois en une phrase est exactement le niveau attendu',
      'Le versant post-marché de GameStop, pour montrer la carte complète : les appels de marge de la chambre de compensation et la suspension des achats chez les courtiers — le module 1 raconte cette moitié-là',
    ],
    bonusEn: [
      'The third sibling: Volmageddon 2018 — buying back VIX futures into the vol spike: same loop, third market; being able to line up all three in one sentence is exactly the expected level',
      'GameStop\'s post-market side, to show the full map: the clearing house\'s margin calls and the buying halt at the brokers — module 1 tells that half',
    ],
    reponseModele: `Je vous en raconte deux, car c'est la même mécanique à trente-quatre ans d'écart — et la comparaison est la vraie réponse.

**GameStop, janvier 2021 — le gamma squeeze.** Des particuliers coordonnés achètent en masse des calls à échéance courte, hors de la monnaie : les moins chers, les plus léveragés. En face, les market makers qui les vendent ne spéculent pas : ils couvrent — le call vendu laisse leur book en delta négatif, qu'ils neutralisent en **achetant l'action**. Puis le gamma entre en scène : quand le titre monte, ces calls OTM se rapprochent de la monnaie — précisément la zone où le gamma est **maximal près de l'échéance**. Leur delta bondit ; la couverture exige d'acheter encore ; ces achats font monter le titre, qui rapproche d'autres strikes, qui forcent d'autres achats. Une **boucle réflexive** : la couverture des vendeurs d'options devient le carburant de la hausse — le titre s'envole parce que la tuyauterie du delta-hedging l'exige, pas parce qu'on a décidé qu'il valait plus.

**1987, la portfolio insurance** — le miroir baissier. Plutôt que d'acheter de vrais puts, on les répliquait par delta-hedging : vendre des futures quand le marché baisse. Le 19 octobre, des dizaines de milliards exécutent le même ordre dans le même sens : les ventes nourrissent la baisse qui déclenche les ventes suivantes — Dow **−22,6 %** en une séance, et la naissance du skew.

La structure commune, que je formulerais ainsi : des acteurs **obligés** de traiter dans le sens du mouvement — non par avidité, mais par construction de leur couverture — transforment un choc en spirale. Quand une stratégie mécanique devient assez grosse, elle cesse de subir les prix : elle les fabrique. La couverture des uns est le flux des autres.

La leçon de desk pour finir : le gamma vendu se limite en agrégé, et l'on sait où il mord — à la monnaie, près de l'échéance, les jours d'expiration. La réplication suppose qu'on traite sans peser sur les prix ; quand tout le monde a le même plan, le plan échoue.`,
    reponseModeleEn: `Let me tell you two, because it is the same mechanics thirty-four years apart — and the comparison is the real answer.

**GameStop, January 2021 — the gamma squeeze.** Coordinated retail buys short-dated, out-of-the-money calls en masse: the cheapest, most leveraged. Opposite them, the market makers selling those calls are not speculating: they hedge — the sold call leaves their book delta-negative, which they neutralise by **buying the stock**. Then gamma walks on stage: as the stock rises, those OTM calls approach the money — precisely the zone where gamma is **maximal near expiry**. Their delta jumps; the hedge demands more buying; that buying lifts the stock, which brings other strikes closer, which forces more buying. A **reflexive loop**: the option sellers' hedging becomes the fuel of the rise — the stock soars because the delta-hedging plumbing demands it, not because anyone decided it was worth more.

**1987, portfolio insurance** — the bearish mirror. Rather than buying real puts, institutions replicated them by delta-hedging: selling futures as the market falls. On 19 October, tens of billions executed the same order in the same direction: the selling fed the fall that triggered the next wave of selling — Dow **−22.6%** in one session, and the birth of the skew.

The common structure, which I would phrase like this: players **forced** to trade in the direction of the move — not out of greed, but by construction of their hedge — turn a shock into a spiral. When a mechanical strategy grows big enough, it stops taking prices: it makes them. One side's hedge is the other side's flow.

The desk lesson to finish: sold gamma is capped in aggregate, and we know where it bites — at the money, near expiry, on expiration days. Replication assumes you can trade without moving prices; when everyone has the same plan, the plan fails.`,
  },
  {
    id: 'm8-j-25',
    moduleId: M8,
    theme: 'usages, risques et accidents',
    themeEn: 'uses, risks and accidents',
    difficulte: 3,
    question: 'Vendre de la volatilité sur dix sous-jacents différents, est-ce diversifier ?',
    questionEn: 'Is selling volatility on ten different underlyings diversification?',
    plan: [
      'Répondre net : non — le risque de queue ne se diversifie pas : le jour du krach, les corrélations montent vers 1 et toutes les positions perdent ensemble',
      'Raconter la preuve : LTCM, 1998 — Scholes et Merton aux commandes, « la banque centrale de la volatilité », vendeur massif de vol longue jugée trop chère',
      'Décrire la fin : défaut russe, fuite vers la qualité, vols implicites en fusée, appels de marge en cascade — sauvetage orchestré par la Fed : trop léveragé pour attendre d\'avoir raison',
      'Tirer les leçons du desk : la taille se calibre sur la perte, les grecques se limitent en portefeuille, et la diversification ne protège pas du jour où c\'est le monde entier qui bouge',
    ],
    planEn: [
      'Answer squarely: no — tail risk does not diversify: on crash day, correlations rise towards 1 and every position loses together',
      'Tell the proof: LTCM, 1998 — Scholes and Merton at the controls, "the central bank of volatility", massive seller of long-dated vol judged too expensive',
      'Describe the end: Russian default, flight to quality, implied vols rocketing, cascading margin calls — a Fed-orchestrated rescue: too leveraged to wait to be right',
      'Draw the desk lessons: size is calibrated on the loss, Greeks are capped at portfolio level, and diversification does not protect from the day the whole world moves',
    ],
    pointsAttendus: [
      'La réponse structurelle : vendre de la vol sur dix sous-jacents n\'est pas dix paris indépendants — le jour du krach, toutes les corrélations montent vers 1 et toutes les positions perdent ensemble : le risque de queue est systématique',
      'La distinction propre : la diversification protège des accidents idiosyncratiques — elle ne protège pas du jour où c\'est le monde entier qui bouge',
      'LTCM, les faits : parmi ses associés, Myron Scholes et Robert Merton — Nobel 1997 ; le fonds vendait massivement de la volatilité à long terme sur les grands indices, jugée trop chère face à la réalisée, au point d\'être surnommé « la banque centrale de la volatilité »',
      'L\'été 1998 : le défaut de la Russie déclenche une fuite générale vers la qualité — les vols implicites s\'envolent, les positions vendeuses plongent, les appels de marge se multiplient',
      'La chute : trop léveragé pour attendre que sa thèse redevienne vraie, le fonds doit être sauvé par un consortium de banques orchestré par la Fed — avoir raison à l\'échéance ne sert à rien si la trésorerie meurt avant',
      'Les leçons du desk, à réciter : la taille se calibre sur la perte, pas sur le gain espéré ; les grecques se limitent en portefeuille — combien je perds si la vol monte de 5 points, si le spot saute de 10 % — des questions posées AVANT, pas découvertes pendant',
    ],
    pointsAttendusEn: [
      'The structural answer: selling vol on ten underlyings is not ten independent bets — on crash day, all correlations rise towards 1 and every position loses together: tail risk is systematic',
      'The clean distinction: diversification protects against idiosyncratic accidents — it does not protect from the day the whole world moves',
      'LTCM, the facts: among its partners, Myron Scholes and Robert Merton — 1997 Nobel; the fund massively sold long-dated volatility on major indices, judged too expensive against realised, to the point of being nicknamed "the central bank of volatility"',
      'Summer 1998: Russia\'s default triggers a general flight to quality — implied vols soar, the short positions plunge, margin calls multiply',
      'The ending: too leveraged to wait for its thesis to come true again, the fund had to be rescued by a bank consortium orchestrated by the Fed — being right at maturity is useless if the cash dies first',
      'The desk lessons, to recite: size is calibrated on the loss, not the hoped-for gain; Greeks are capped at portfolio level — how much do I lose if vol rises 5 points, if spot jumps 10% — questions asked BEFORE, not discovered during',
    ],
    bonus: [
      'L\'écho du module 7 : Metallgesellschaft mourait de trésorerie en ayant peut-être raison — LTCM meurt de levier en ayant peut-être raison : solvable ne suffit pas, il faut survivre à la liquidité',
      'L\'ironie qui marque un jury : les noms mêmes de la formule de ce module étaient aux commandes — la précision mathématique de l\'outil ne protège pas de la taille, du levier et de la corrélation des queues',
    ],
    bonusEn: [
      'The module 7 echo: Metallgesellschaft died of cash flow while perhaps being right — LTCM dies of leverage while perhaps being right: solvent is not enough, you must survive liquidity',
      'The irony that marks a jury: the very names of this module\'s formula were at the controls — the tool\'s mathematical precision protects from neither size, nor leverage, nor tail correlation',
    ],
    reponseModele: `Non — et la raison tient en une phrase : **le risque de queue ne se diversifie pas**. Dix ventes de volatilité sur dix sous-jacents ressemblent à dix paris indépendants par temps calme. Le jour du krach, les corrélations montent vers 1 : tout baisse ensemble, toutes les vols s'envolent ensemble, et les dix positions perdent le même jour. La diversification protège des accidents idiosyncratiques — la faillite d'une entreprise, le procès d'un laboratoire ; elle ne protège pas du jour où c'est le monde entier qui bouge.

La preuve porte un nom : **LTCM, 1998**. Parmi les associés du fonds, Myron Scholes et Robert Merton — Nobel 1997, les noms mêmes du modèle de ce module. Le fonds vendait massivement de la volatilité à long terme sur les grands indices, jugée trop chère par rapport à la réalisée — au point que le marché l'avait surnommé *la banque centrale de la volatilité* : c'est à lui qu'on venait acheter de la vol. La thèse était défendable ; des années durant, elle a payé.

À l'été 1998, le défaut de la Russie déclenche une fuite générale vers la qualité. Les volatilités implicites s'envolent — sur **tous** les marchés à la fois —, les positions vendeuses plongent, les appels de marge se multiplient. Trop léveragé pour attendre que sa thèse redevienne vraie, le fonds doit être sauvé par un consortium de banques orchestré par la Fed. La sentence du module 7 s'applique mot pour mot : **avoir raison à l'échéance ne sert à rien si la trésorerie meurt avant**.

Les leçons que le desk en a tirées, et que je retiens : la taille se calibre sur la perte — le rouleau compresseur —, jamais sur la prime espérée ; les grecques se limitent en **portefeuille** — combien je perds si la vol monte de 5 points, si le spot saute de 10 % : des questions posées avant, pas découvertes pendant. Et la diversification, en vol, est une promesse de beau temps — précisément ce contre quoi on est censé assurer.`,
    reponseModeleEn: `No — and the reason fits in one sentence: **tail risk does not diversify**. Ten volatility sales on ten underlyings look like ten independent bets in calm weather. On crash day, correlations rise towards 1: everything falls together, every vol soars together, and the ten positions lose on the same day. Diversification protects against idiosyncratic accidents — one company's bankruptcy, one laboratory's lawsuit; it does not protect from the day the whole world moves.

The proof has a name: **LTCM, 1998**. Among the fund's partners, Myron Scholes and Robert Merton — 1997 Nobel, the very names of this module's model. The fund massively sold long-dated volatility on the major indices, judged too expensive against realised — to the point that the market had nicknamed it *the central bank of volatility*: it was where you went to buy vol. The thesis was defensible; for years, it paid.

In the summer of 1998, Russia's default triggered a general flight to quality. Implied volatilities soared — on **all** markets at once —, the short positions plunged, margin calls multiplied. Too leveraged to wait for its thesis to come true again, the fund had to be rescued by a bank consortium orchestrated by the Fed. Module 7's sentence applies word for word: **being right at maturity is useless if the cash dies first**.

The lessons the desk drew, and that I retain: size is calibrated on the loss — the steamroller —, never on the hoped-for premium; Greeks are capped at **portfolio** level — how much do I lose if vol rises 5 points, if spot jumps 10%: questions asked before, not discovered during. And diversification, in vol, is a fair-weather promise — precisely what one is supposed to be insuring against.`,
  },
];
