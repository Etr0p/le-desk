import type { JuryQuestion } from '../../../engine/types';

const M7 = '07-derives-fermes';

export const jury: JuryQuestion[] = [
  {
    id: 'm7-j-01',
    moduleId: M7,
    theme: 'l\'engagement ferme',
    themeEn: 'the firm commitment',
    difficulte: 1,
    question: 'Qu\'est-ce qu\'un dérivé ferme — et en quoi est-ce différent d\'une option ?',
    questionEn: 'What is a firm (linear) derivative — and how does it differ from an option?',
    plan: [
      'Définir : un contrat qui OBLIGE les deux parties — acheter et vendre à une date future, à un prix fixé aujourd\'hui',
      'Opposer à l\'option : un droit sans obligation, payé d\'une prime — le ferme, lui, ne coûte rien à la signature',
      'Décrire le payoff : linéaire, symétrique, somme nulle — le gain du long est la perte du short',
      'Donner les deux habits : forward sur mesure de gré à gré, futures standardisé en bourse',
    ],
    planEn: [
      'Define: a contract that BINDS both parties — to buy and to sell at a future date, at a price fixed today',
      'Contrast with the option: a right without obligation, paid for with a premium — the firm contract costs nothing at signature',
      'Describe the payoff: linear, symmetric, zero-sum — the long\'s gain is the short\'s loss',
      'Give the two institutional forms: the tailor-made OTC forward, the standardised exchange-traded future',
    ],
    pointsAttendus: [
      'Un engagement irrévocable des DEUX parties : acheter ou vendre le sous-jacent à un prix fixé dès aujourd\'hui, quoi que fasse le marché entre-temps',
      'L\'option donne un droit sans obligation, et ce droit asymétrique se paie d\'une prime ; le ferme ne coûte rien à la signature — sa valeur initiale est nulle, le prix à terme est calibré pour cela',
      'Payoff linéaire et symétrique : le long gagne (prix final − prix convenu) × taille, le short exactement l\'opposé — un jeu à somme nulle',
      'Le vocabulaire des positions : long = gagne si le sous-jacent monte ; short = gagne s\'il baisse',
      'Deux formes institutionnelles du même engagement : forward (OTC, sur mesure, risque de contrepartie bilatéral) et futures (standardisé, chambre de compensation, marges quotidiennes)',
    ],
    pointsAttendusEn: [
      'An irrevocable commitment of BOTH parties: to buy or sell the underlying at a price fixed today, whatever the market does in between',
      'The option grants a right without obligation, and that asymmetric right is paid for with a premium; the firm contract costs nothing at signature — its initial value is zero, the forward price is calibrated for exactly that',
      'Linear, symmetric payoff: the long earns (final price − agreed price) × size, the short exactly the opposite — a zero-sum game',
      'Position vocabulary: long = gains if the underlying rises; short = gains if it falls',
      'Two institutional forms of the same commitment: the forward (OTC, tailor-made, bilateral counterparty risk) and the future (standardised, clearing house, daily margins)',
    ],
    bonus: [
      'L\'ancienneté de l\'objet : les tickets de riz de Dojima (reconnus en 1730) et le Chicago Board of Trade (1848) — l\'engagement à terme est plus vieux que les actions cotées',
      'La précision qui classe : « valeur initiale nulle » ne veut pas dire « sans risque » — l\'engagement porte sur le notionnel entier, pas sur la mise',
    ],
    bonusEn: [
      'The age of the object: Dojima\'s rice tickets (recognised in 1730) and the Chicago Board of Trade (1848) — the forward commitment is older than listed equities',
      'The distinction that ranks you: "zero initial value" does not mean "riskless" — the commitment bears on the full notional, not on the deposit',
    ],
    reponseModele: `Un dérivé ferme est une **obligation réciproque** : l'une des parties s'engage à acheter, l'autre à vendre un sous-jacent à une date future, à un prix fixé dès aujourd'hui — et aucune ne peut se dédire, quoi que fasse le marché entre-temps. L'option, elle, donne à son détenteur un **droit sans obligation** : il n'exerce que si cela l'arrange, et cette asymétrie se paie d'une prime. Le ferme, lui, ne coûte rien à la signature : sa valeur initiale est nulle, précisément parce que le prix à terme est calibré pour cela.

Le profil de gain en découle : **linéaire et symétrique**. À l'échéance, le long encaisse (prix final − prix convenu) × taille, le short exactement l'opposé. Chaque point de hausse rapporte autant que le précédent, sans plancher ni plafond — et le gain de l'un est, au signe près, la perte de l'autre : un jeu à somme nulle, qui déplace le risque sans jamais le détruire.

Reste l'habillage institutionnel, double : le **forward**, de gré à gré, sur mesure, où chacun porte le risque de défaut de l'autre ; le **futures**, standardisé, coté en bourse, garanti par une chambre de compensation et des marges quotidiennes.

La distinction à tenir pour finir : gratuit à la signature ne veut pas dire sans risque. L'engagement ferme porte sur le notionnel entier — c'est l'option, payante, qui borne la perte.`,
    reponseModeleEn: `A firm derivative is a **reciprocal obligation**: one party commits to buy, the other to sell an underlying at a future date, at a price fixed today — and neither can walk away, whatever the market does in between. The option, by contrast, gives its holder a **right without obligation**: he exercises only if it suits him, and that asymmetry is paid for with a premium. The firm contract costs nothing at signature: its initial value is zero, precisely because the forward price is calibrated for that.

The payoff follows: **linear and symmetric**. At maturity, the long collects (final price − agreed price) × size, the short exactly the opposite. Each point of upside pays as much as the previous one, with no floor and no cap — and one side's gain is, up to the sign, the other side's loss: a zero-sum game, which moves risk around without ever destroying it.

There remains the institutional clothing, which is double: the **forward**, over the counter, tailor-made, where each party bears the other's default risk; the **future**, standardised, exchange-traded, guaranteed by a clearing house and daily margins.

The distinction to hold on to: free at signature does not mean riskless. The firm commitment bears on the entire notional — it is the option, the one you pay for, that caps the loss.`,
  },
  {
    id: 'm7-j-02',
    moduleId: M7,
    theme: 'l\'engagement ferme',
    themeEn: 'the firm commitment',
    difficulte: 2,
    question: 'Les dérivés sont un jeu à somme nulle : le gain de l\'un est la perte de l\'autre. À quoi sert ce marché, alors ?',
    questionEn: 'Derivatives are a zero-sum game: one side\'s gain is the other side\'s loss. So what is this market for?',
    plan: [
      'Accorder le fait : agrégé sur les deux parties, le P&L est nul — mais l\'utilité ne l\'est pas',
      'Donner le service central : le transfert de risque — le hedger cède, le spéculateur porte, comme une assurance',
      'Ajouter le troisième visage : l\'arbitragiste, qui soude le prix du dérivé à celui du comptant',
      'Compléter par les deux services collectifs : la découverte des prix et l\'accès au marché',
    ],
    planEn: [
      'Concede the fact: aggregated over both parties, the P&L is zero — but the utility is not',
      'Give the core service: risk transfer — the hedger sheds, the speculator carries, like an insurance policy',
      'Add the third face: the arbitrageur, who welds the derivative\'s price to the spot',
      'Complete with the two collective services: price discovery and market access',
    ],
    pointsAttendus: [
      'Somme nulle en euros ne veut pas dire somme nulle en utilité : l\'exportateur couvert dort tranquille, le spéculateur est payé pour porter un risque qu\'il choisit',
      'Le hedger subit une exposition (recettes en dollars, kérosène, dette à taux variable) et la neutralise : il renonce au gain possible pour éliminer la perte possible',
      'Le spéculateur prend la position que le hedger abandonne — sa présence garantit une contrepartie à toute heure : c\'est lui qui fait la liquidité',
      'L\'arbitragiste ne parie sur rien : il referme les écarts entre dérivé et sous-jacent (le cash and carry) — c\'est lui qui rend le prix à terme fiable',
      'Deux services collectifs : la découverte des prix (le prix mondial du pétrole EST celui du Brent et du WTI à terme) et l\'accès — exposition indicielle en un contrat, vente à découvert sans emprunt de titres, mise réduite',
      'Le risque ne disparaît jamais : il change de mains — le marché des dérivés est l\'endroit où ce déménagement se négocie',
    ],
    pointsAttendusEn: [
      'Zero-sum in euros does not mean zero-sum in utility: the hedged exporter sleeps at night, the speculator is paid to carry a risk he chooses',
      'The hedger suffers an exposure (dollar revenues, jet fuel, floating-rate debt) and neutralises it: he gives up the possible gain to eliminate the possible loss',
      'The speculator takes the position the hedger abandons — his presence guarantees a counterparty at any hour: he is the one making the liquidity',
      'The arbitrageur bets on nothing: he closes the gaps between derivative and underlying (cash and carry) — he is the one keeping forward prices honest',
      'Two collective services: price discovery (the world price of oil IS the front Brent and WTI futures) and access — index exposure in one contract, short selling without borrowing securities, a reduced stake',
      'Risk never disappears: it changes hands — the derivatives market is where that removal is negotiated',
    ],
    bonus: [
      'L\'analogie qui désarme l\'objection du « casino » : l\'assurance incendie est aussi un jeu à somme nulle en cash, et personne ne propose de l\'interdire',
      'La nuance de maturité : l\'intention ne se lit pas dans le contrat — le même contrat est couverture ou pari selon le bilan de celui qui le signe',
    ],
    bonusEn: [
      'The analogy that disarms the "casino" objection: fire insurance is also zero-sum in cash, and nobody proposes banning it',
      'The maturity nuance: intent cannot be read in the contract — the same contract is a hedge or a bet depending on the balance sheet of whoever signs it',
    ],
    reponseModele: `À ce que produit toute assurance — qui est, elle aussi, un jeu à somme nulle en cash. Le fait est exact : agrégé sur les deux parties, un dérivé ne crée pas un euro. Mais la somme des P&L n'est pas la somme des utilités.

Le service central est le **transfert de risque**. Le hedger détient déjà un risque qu'il subit — des recettes en dollars, une cuve de kérosène, une dette à taux variable — et paie pour s'en défaire : il renonce au gain possible pour éliminer la perte possible. En face, le spéculateur n'avait aucune exposition : il prend celle que le hedger abandonne, parce qu'il est payé pour la porter. Sa présence garantit au hedger une contrepartie à toute heure. Le troisième visage, l'arbitragiste, ne parie sur rien : il referme les écarts entre dérivé et sous-jacent — le cash and carry — et rend ainsi le prix à terme digne de confiance.

S'ajoutent deux services collectifs : la **découverte des prix** — le prix mondial du pétrole est celui du Brent et du WTI à terme, le dérivé est souvent la source du prix, pas son reflet — et l'**accès** : un indice entier en un contrat, à la hausse comme à la baisse, pour une mise réduite.

La chute : le risque ne disparaît jamais — il change de mains. Ce marché est l'endroit où ce déménagement se négocie, et c'est exactement la réponse à l'objection du casino.`,
    reponseModeleEn: `The same thing any insurance produces — and insurance, too, is zero-sum in cash. The fact is correct: aggregated over both parties, a derivative does not create one euro. But the sum of P&Ls is not the sum of utilities.

The core service is **risk transfer**. The hedger already holds a risk he suffers — dollar revenues, a tank of jet fuel, floating-rate debt — and pays to shed it: he gives up the possible gain to eliminate the possible loss. Opposite him, the speculator had no exposure: he takes on what the hedger abandons, because he has a view and is paid to carry it. His presence guarantees the hedger a counterparty at any hour. The third face, the arbitrageur, bets on nothing: he closes the gaps between the derivative and its underlying — cash and carry — and he is the one who makes the forward price trustworthy.

Add two collective services: **price discovery** — the world price of oil is the front Brent and WTI futures; the derivative is often the source of the price, not its reflection — and **access**: a whole index in one contract, long or short, for a reduced stake.

The closing line: risk never disappears — it changes hands. This market is where that removal is negotiated, and that is precisely the answer to the casino objection.`,
  },
  {
    id: 'm7-j-03',
    moduleId: M7,
    theme: 'l\'engagement ferme',
    themeEn: 'the firm commitment',
    difficulte: 4,
    question: 'Les dérivés représentent de l\'ordre de 600 000 milliards de dollars de notionnel — plusieurs fois le PIB mondial. Ce chiffre est-il un danger ?',
    questionEn: 'Derivatives represent on the order of 600 trillion dollars of notional — several times world GDP. Is that figure a danger?',
    plan: [
      'Désamorcer le chiffre : le notionnel est une assiette de calcul des flux, pas un montant en jeu',
      'Donner la bonne métrique : valeur de marché (quelques pourcents), expositions nettes, marges, sensibilité',
      'Réhabiliter la vraie inquiétude : le danger n\'est pas la taille mais l\'opacité et le levier — 2008, Archegos',
      'Conclure en candidat : respecter le chiffre comme mesure d\'activité, mesurer le risque ailleurs',
    ],
    planEn: [
      'Defuse the figure: notional is a calculation base for the flows, not an amount at stake',
      'Give the right metric: market value (a few percent), net exposures, margins, sensitivity',
      'Rehabilitate the real worry: the danger is not size but opacity and leverage — 2008, Archegos',
      'Conclude as a candidate: respect the figure as a measure of activity, measure risk elsewhere',
    ],
    pointsAttendus: [
      'Sur un swap de taux de 100 M€, on n\'échange jamais les 100 M€ : seulement des différentiels d\'intérêts calculés dessus — le notionnel est l\'assiette, pas l\'enjeu',
      'La hiérarchie qui surprend : les dérivés de taux dominent, de l\'ordre des trois quarts du total — toute banque, tout assureur, tout trésorier gère un bilan exposé aux taux',
      'La valeur de marché — ce qui se perdrait réellement si tout se dénouait — n\'est qu\'une petite fraction du notionnel, de l\'ordre de quelques pourcents ; le netting et le collatéral la réduisent encore',
      'La preuve par la compression : on résilie les contrats redondants et on les remplace par un jeu réduit de swaps au même risque net — le notionnel brut fond, le risque ne bouge pas',
      'La vraie inquiétude est ailleurs : le levier invisible et la concentration — Lehman 2008 (personne n\'avait la carte des expositions bilatérales), Archegos 2021 (un levier fragmenté entre banques)',
      'La bonne grille de lecture : exposition nette, marges, valeur de marché, sensibilité (DV01) — jamais le notionnel comparé à un PIB sans vérifier ce que le chiffre mesure',
    ],
    pointsAttendusEn: [
      'On a €100m interest rate swap, the €100m never changes hands: only interest differentials computed on it — the notional is the base, not the stake',
      'The hierarchy that surprises: interest rate derivatives dominate, around three quarters of the total — every bank, insurer and treasurer manages a balance sheet exposed to rates',
      'The market value — what would actually be lost if everything were unwound — is only a small fraction of the notional, on the order of a few percent; netting and collateral shrink it further',
      'The proof by compression: redundant contracts are torn up and replaced by a reduced set of swaps with the same net risk — gross notional melts, risk does not move',
      'The real worry lies elsewhere: invisible leverage and concentration — Lehman 2008 (nobody had the map of bilateral exposures), Archegos 2021 (leverage fragmented across banks)',
      'The right reading grid: net exposure, margins, market value, sensitivity (DV01) — never notional compared to a GDP without checking what the figure measures',
    ],
    bonus: [
      'Buffett 2002, « armes financières de destruction massive » — et Berkshire vendant ensuite des puts géants à très long terme, sans appels de marge quotidiens : l\'outil n\'est ni bon ni mauvais, le levier et la liquidité décident',
      'Le réflexe transversal du cours : mêmes précautions que pour les 7 500 Md$ quotidiens du change — toujours demander si un grand chiffre est un flux, un encours ou une assiette',
    ],
    bonusEn: [
      'Buffett 2002, "financial weapons of mass destruction" — and Berkshire then selling giant very-long-dated index puts, with no daily margin calls: the tool is neither good nor bad, leverage and liquidity decide',
      'The course-wide reflex: same caution as for FX\'s \\$7.5tn a day — always ask whether a big number is a flow, a stock or a calculation base',
    ],
    reponseModele: `Le chiffre est vrai ; la peur se trompe d'objet. Le **notionnel** est l'assiette de calcul des flux, pas un montant en jeu : sur un swap de taux de 100 M€, les 100 M€ ne circulent jamais — seuls des différentiels d'intérêts changent de mains. Le comparer au PIB mondial, c'est comparer des unités qui ne se parlent pas. Et les trois quarts sont des dérivés de taux — l'outillage ordinaire des bilans bancaires et assurantiels, pas une montagne de paris.

La bonne métrique existe : la **valeur de marché** — ce qui se perdrait réellement si tout se dénouait — représente quelques pourcents du notionnel, encore réduits par netting et collatéral. La preuve par la **compression** : on résilie les contrats redondants pour les remplacer par un jeu réduit au même risque net — le notionnel brut fond, aucun risque n'a disparu. Un chiffre qu'on peut dégonfler sans rien changer ne mesurait pas le danger.

Mais je ne conclurais pas « dormez tranquilles ». Le vrai danger n'est pas la taille : c'est ce qu'ils rendent **invisible** — le levier et la concentration. Lehman 2008 : personne n'avait la carte des expositions bilatérales. Archegos 2021 : un levier massif fragmenté entre banques, dont aucune ne voyait le total.

Ma réponse de synthèse : le notionnel mesure l'échelle de l'activité ; le risque se lit dans les expositions nettes, les marges et la sensibilité. Respecter le chiffre, oui — le craindre, non ; craindre l'opacité, toujours.`,
    reponseModeleEn: `The figure is true; the fear aims at the wrong object. **Notional** is the calculation base for the flows, not an amount at stake: on a €100m interest rate swap, the €100m never moves — only interest differentials computed on it change hands. Comparing that figure to world GDP is comparing units that do not speak to each other. Composition confirms it: three quarters are interest rate derivatives — the ordinary toolkit of any bank or insurance balance sheet, not a mountain of bets.

The right metric exists: **market value** — what would actually be lost if everything were unwound — runs at a few percent of notional, further reduced by netting and collateral. The most telling proof is **compression**: redundant contracts between members are regularly torn up and replaced by a reduced set with the same net risk — gross notional melts by half, and no risk has disappeared. A figure you can deflate without changing anything was never measuring the danger.

But I would not conclude "sleep well". The real danger of derivatives is not their size: it is what they make **invisible** — leverage and concentration. Lehman 2008: nobody had the map of bilateral exposures. Archegos 2021: massive leverage fragmented across banks, none of which saw the total.

My summary answer: notional measures the scale of activity; risk is read in net exposures, margins and sensitivity. Respect the figure, yes — fear it, no; fear opacity, always.`,
  },
  {
    id: 'm7-j-04',
    moduleId: M7,
    theme: 'futures, marges et chambre de compensation',
    themeEn: 'futures, margins and the clearing house',
    difficulte: 2,
    question: 'Futures contre forward : où est passé le risque de contrepartie ?',
    questionEn: 'Future versus forward: where did the counterparty risk go?',
    plan: [
      'Poser le problème du forward : une promesse bilatérale — le défaut de l\'autre est votre problème, pendant des mois',
      'Décrire la novation : la chambre devient l\'acheteuse de tous les vendeurs et la vendeuse de tous les acheteurs',
      'Montrer le déplacement : le risque n\'est pas détruit — il est concentré sur la CCP, qui le neutralise par marges quotidiennes et netting',
      'Illustrer par l\'épreuve du feu : Lehman 2008 — les chambres ont tenu, le bilatéral a paniqué',
    ],
    planEn: [
      'State the forward\'s problem: a bilateral promise — the other side\'s default is your problem, for months',
      'Describe novation: the clearing house becomes the buyer to every seller and the seller to every buyer',
      'Show the displacement: risk is not destroyed — it is concentrated on the CCP, which neutralises it with daily margins and netting',
      'Illustrate with the trial by fire: Lehman 2008 — the clearing houses held, the bilateral world panicked',
    ],
    pointsAttendus: [
      'Dans un forward, l\'engagement est bilatéral : chacun porte le défaut de l\'autre pendant toute la vie du contrat — d\'autant plus grave que le contrat a pris de la valeur',
      'La novation : à l\'instant de l\'exécution, le contrat entre acheteur et vendeur est juridiquement remplacé par deux contrats face à la chambre — acheteuse de tous les vendeurs, vendeuse de tous les acheteurs',
      'Le risque n\'est pas détruit, il est déplacé et géré : marge initiale à l\'ouverture, marge de variation chaque soir (mark-to-market) — le P&L se règle tous les jours, l\'ardoise ne s\'accumule jamais',
      'Les sous-produits décisifs : anonymat du carnet sans danger, et netting multilatéral — une position se referme en la retournant face à la chambre, sans retrouver sa contrepartie d\'origine',
      'Lehman, septembre 2008 : les chambres ont liquidé et transféré les portefeuilles du défaillant en s\'appuyant d\'abord sur ses marges, sans sinistre majeur — pendant que les expositions bilatérales semaient la panique',
      'La réponse fine : le risque de contrepartie bilatéral a disparu — il s\'appelle désormais risque de chambre de compensation, concentré et surveillé',
    ],
    pointsAttendusEn: [
      'In a forward, the commitment is bilateral: each party bears the other\'s default for the contract\'s whole life — all the more serious once the contract has gained value',
      'Novation: at execution, the contract between buyer and seller is legally replaced by two contracts facing the clearing house — buyer to every seller, seller to every buyer',
      'Risk is not destroyed, it is displaced and managed: initial margin at opening, variation margin every evening (mark-to-market) — the P&L settles daily, the tab never accumulates',
      'The decisive by-products: harmless anonymity of the order book, and multilateral netting — a position is closed by reversing it against the clearing house, without finding the original counterparty',
      'Lehman, September 2008: the clearing houses liquidated and transferred the defaulter\'s portfolios relying first on its margins, with no major loss — while bilateral exposures spread the panic',
      'The fine answer: bilateral counterparty risk is gone — it is now called clearing house risk, concentrated and supervised',
    ],
    bonus: [
      'Nommer la conséquence réglementaire : c\'est ce contraste de 2008 qui a convaincu le G20 d\'imposer la compensation centrale aux dérivés OTC standardisés',
      'Anticiper la question suivante : la cascade de défaut d\'une CCP — marges du défaillant, fonds de garantie, capital de la chambre, contributions des survivants',
    ],
    bonusEn: [
      'Name the regulatory consequence: that 2008 contrast is what convinced the G20 to impose central clearing on standardised OTC derivatives',
      'Anticipate the follow-up: a CCP\'s default waterfall — defaulter\'s margins, default fund, the house\'s own capital, survivors\' contributions',
    ],
    reponseModele: `Il n'a pas disparu — il a déménagé, et c'est tout l'intérêt de la question. Dans un **forward**, la promesse est bilatérale : si ma contrepartie fait défaut dans six mois, c'est mon problème — et précisément au moment où le contrat a pris de la valeur pour moi, donc où son défaut me coûte le plus.

Le futures résout cela par la **novation** : à l'instant où la transaction s'exécute dans le carnet, le contrat entre l'acheteur et le vendeur est juridiquement remplacé par deux contrats face à la **chambre de compensation** — la formule canonique : acheteuse de tous les vendeurs, vendeuse de tous les acheteurs. Mon seul débiteur devient la chambre, dont c'est l'unique métier de ne jamais faillir. D'où deux sous-produits décisifs : l'anonymat du carnet devient sans danger, et le netting multilatéral permet de sortir d'une position en la retournant, sans retrouver sa contrepartie d'origine.

Mais le risque n'est pas détruit : il est **concentré puis neutralisé** par les marges — dépôt initial à l'ouverture, marge de variation chaque soir. Le P&L se règle tous les jours : l'ardoise ne s'accumule jamais.

L'épreuve du feu a eu lieu : en septembre 2008, les chambres ont liquidé les portefeuilles de Lehman en s'appuyant d'abord sur ses marges, sans sinistre majeur — pendant que le gré à gré bilatéral semait la panique. La réponse exacte à votre question : le risque de contrepartie s'appelle désormais risque de chambre de compensation — concentré, collatéralisé, surveillé.`,
    reponseModeleEn: `It has not disappeared — it has moved house, and that is the whole point of the question. In a **forward**, the promise is bilateral: if my counterparty defaults in six months, that is my problem — and precisely when the contract has gained value for me, hence when its default costs me most.

The future solves this through **novation**: the instant the trade executes in the book, the contract between buyer and seller is legally replaced by two contracts facing the **clearing house** — the canonical phrase: buyer to every seller, seller to every buyer. My only debtor becomes the house, whose sole business is never to fail. Two decisive by-products follow: the order book\'s anonymity becomes harmless, and multilateral netting lets you exit a position by reversing it, without ever finding your original counterparty.

But the risk is not destroyed: it is **concentrated, then neutralised** by margins — an initial deposit at opening, variation margin every evening. The P&L settles daily: the tab never accumulates.

The trial by fire happened: in September 2008, the clearing houses liquidated Lehman\'s portfolios relying first on its margins, with no major loss — while the bilateral OTC world spread the panic. The exact answer to your question: counterparty risk is now called clearing house risk — concentrated, collateralised, supervised.`,
  },
  {
    id: 'm7-j-05',
    moduleId: M7,
    theme: 'futures, marges et chambre de compensation',
    themeEn: 'futures, margins and the clearing house',
    difficulte: 2,
    question: 'Pourquoi l\'appel de marge ramène-t-il le compte à la marge initiale, et pas à la marge de maintenance ?',
    questionEn: 'Why does a margin call top the account back up to initial margin, and not to maintenance margin?',
    plan: [
      'Verrouiller le triplet : marge initiale = dépôt d\'ouverture, maintenance = seuil plancher, mark-to-market chaque soir',
      'Énoncer la convention : la maintenance est le DÉCLENCHEUR, l\'initiale est la CIBLE du versement',
      'Justifier : recompléter au seuil laisserait le compte sur le fil — un tick adverse redéclencherait un appel chaque matin',
      'Chiffrer : solde 4 200 €, maintenance 4 500 €, initiale 6 000 € — versement de 1 800 €, pas de 300 €',
    ],
    planEn: [
      'Lock the triplet: initial margin = opening deposit, maintenance = floor threshold, mark-to-market every evening',
      'State the convention: maintenance is the TRIGGER, initial is the TARGET of the payment',
      'Justify: topping up only to the threshold would leave the account on the edge — one adverse tick would re-trigger a call every morning',
      'Quantify: balance 4,200, maintenance 4,500, initial 6,000 — a 1,800 payment, not 300',
    ],
    pointsAttendus: [
      'La convention américaine des futures : aucun appel tant que le solde reste supérieur ou égal à la maintenance ; dès qu\'il passe strictement dessous, versement = marge initiale − solde',
      'L\'exemple canonique : solde tombé à 4 200 € pour une maintenance de 4 500 € et une initiale de 6 000 € — appel de 6 000 − 4 200 = 1 800 €, et non 4 500 − 4 200 = 300 €',
      'La logique : la marge initiale est calibrée sur la perte plausible d\'une ou deux séances — le compte doit retrouver son coussin ENTIER, pas flotter sur le seuil',
      'Le contre-scénario qui justifie tout : recomplété à la maintenance, le moindre tick adverse du lendemain redéclencherait un appel — des appels en rafale, coûteux et dangereux pour la chambre',
      'La symétrie du piège : pas d\'appel tant que le seuil n\'est pas strictement franchi — un solde à 4 800 € pour 4 500 € de maintenance ne doit rien, même s\'il est sous l\'initiale',
      'La sanction : un appel non honoré dans le délai, c\'est la liquidation d\'office — au pire moment, juste après le mouvement adverse',
    ],
    pointsAttendusEn: [
      'The US futures convention: no call as long as the balance stays at or above maintenance; once strictly below, payment = initial margin − balance',
      'The canonical example: balance fallen to 4,200 with maintenance at 4,500 and initial at 6,000 — a call of 6,000 − 4,200 = 1,800, not 4,500 − 4,200 = 300',
      'The logic: initial margin is calibrated on the plausible loss of one or two sessions — the account must recover its FULL cushion, not float on the threshold',
      'The counter-scenario that justifies everything: topped up only to maintenance, the slightest adverse tick the next day would re-trigger a call — calls in bursts, costly and dangerous for the clearing house',
      'The symmetric trap: no call as long as the threshold is not strictly crossed — a 4,800 balance against a 4,500 maintenance owes nothing, even though it sits below the initial margin',
      'The sanction: a call not honoured in time means forced liquidation — at the worst moment, right after the adverse move',
    ],
    bonus: [
      'Le résumé qui fait mouche : « la maintenance est le déclencheur, l\'initiale est la cible » — deux rôles, deux seuils',
      'Le pont vers la fin du module : ce mécanisme de cash exigé ce soir, au pire moment, est exactement ce qui a asphyxié Metallgesellschaft',
    ],
    bonusEn: [
      'The summary that lands: "maintenance is the trigger, initial is the target" — two roles, two thresholds',
      'The bridge to the end of the module: this cash-due-tonight mechanism, at the worst moment, is exactly what asphyxiated Metallgesellschaft',
    ],
    reponseModele: `Parce que les deux seuils n'ont pas le même métier : la maintenance est un **déclencheur**, l'initiale est une **cible**. La marge initiale est le dépôt exigé à l'ouverture, calibré sur la perte plausible d'une ou deux séances ; la maintenance, plus basse, est le plancher au-dessous duquel le compte ne doit jamais rester. Chaque soir, le mark-to-market crédite ou débite le compte ; tant que le solde reste au-dessus de la maintenance, la chambre ne dit rien.

Mais dès qu'il passe strictement dessous, le versement exigé ramène à l'**initiale** : appel = marge initiale − solde. Chiffrons : solde tombé à 4 200 €, maintenance 4 500 €, initiale 6 000 € — je dois verser 6 000 − 4 200 = **1 800 €**, pas 300. Six fois plus que « repasser le seuil ».

La logique est défensive. Si l'on ne recomplétait qu'à la maintenance, le compte vivrait en permanence sur le fil : le moindre tick adverse du lendemain redéclencherait un appel — des appels en rafale, coûteux à traiter, et un coussin structurellement insuffisant pour la chambre, dont tout le métier est d'absorber la prochaine mauvaise séance. Le compte doit retrouver son coussin entier, pas flotter sur la ligne de flottaison.

Et j'ajoute la symétrie du piège : à 4 800 € pour 4 500 € de maintenance, aucun appel n'est dû — le déclenchement est binaire et strict. La sanction, enfin : un appel non honoré, c'est la liquidation d'office, au pire moment possible.`,
    reponseModeleEn: `Because the two thresholds have different jobs: maintenance is a **trigger**, initial margin is a **target**. Initial margin is the deposit required at opening, calibrated on the plausible loss of one or two sessions; maintenance, lower, is the floor below which the account must never stay. Every evening, mark-to-market credits or debits the account; as long as the balance stays above maintenance, the clearing house says nothing.

But once it falls strictly below, the required payment goes back to the **initial** level: call = initial margin − balance. Put numbers on it: balance down to 4,200, maintenance 4,500, initial 6,000 — I must pay 6,000 − 4,200 = **1,800**, not 300. Six times more than "getting back over the line".

The logic is defensive. If you only topped up to maintenance, the account would live permanently on the edge: the slightest adverse tick the next day would re-trigger a call — calls in bursts, costly to process, and a structurally insufficient cushion for the clearing house, whose entire business is absorbing the next bad session. The account must recover its full cushion, not float on the waterline.

And I would add the symmetric trap: at 4,800 against a 4,500 maintenance, no call is due — the trigger is binary and strict. The sanction, finally: a call not honoured means forced liquidation, at the worst possible moment.`,
  },
  {
    id: 'm7-j-06',
    moduleId: M7,
    theme: 'futures, marges et chambre de compensation',
    themeEn: 'futures, margins and the clearing house',
    difficulte: 2,
    question: 'Peut-on perdre plus que sa mise sur un futures ?',
    questionEn: 'Can you lose more than your stake on a futures position?',
    plan: [
      'Répondre net : oui — et c\'est la différence structurelle avec l\'achat d\'une action',
      'Poser la mécanique : on ne paie pas le notionnel, on le garantit par une marge — le levier vaut 1/marge',
      'Chiffrer : marge 10 %, sous-jacent −12 % en une séance, soit −120 % de la mise : le dépôt est effacé et il faut remettre au pot',
      'Conclure : l\'engagement porte sur le notionnel entier — dimensionner sur le pire scénario de trésorerie',
    ],
    planEn: [
      'Answer squarely: yes — and that is the structural difference with buying a share',
      'Lay out the mechanics: you do not pay the notional, you guarantee it with a margin — leverage is 1/margin',
      'Quantify: 10% margin, underlying down 12% in one session, that is −120% of the stake: the deposit is wiped out and you must pay in more',
      'Conclude: the commitment bears on the full notional — size on the worst cash scenario',
    ],
    pointsAttendus: [
      'Oui : en achetant une action, la perte est plafonnée à 100 % ; un dérivé ferme ne connaît pas ce plancher — on est engagé sur le notionnel entier, pas sur le dépôt',
      'Le levier de la marge : variation de la mise = variation du sous-jacent/marge — à 10 % de marge initiale, levier ×10 : +2 % de sous-jacent fait +20 % de la mise',
      'Le calcul adverse : −12 % de sous-jacent sous 10 % de marge = −120 % de la mise — sur 5 000 € déposés contre 50 000 € de notionnel, perte de 6 000 € : le dépôt est effacé et il manque 1 000 €',
      'Le mécanisme concret : les appels de marge exigent l\'argent frais immédiatement ; non honorés, la position est liquidée d\'office — la perte latente devient définitive, juste après le mouvement adverse',
      'La leçon : le levier ne crée pas de rendement, il dilate les deux queues de la distribution — dimensionner la position sur le cash mobilisable dans la tempête, pas sur le P&L espéré',
    ],
    pointsAttendusEn: [
      'Yes: buying a share caps the loss at 100%; a firm derivative knows no such floor — you are committed on the full notional, not on the deposit',
      'Margin leverage: change in stake = change in underlying/margin — at 10% initial margin, ×10 leverage: +2% on the underlying makes +20% on the stake',
      'The adverse computation: −12% on the underlying under 10% margin = −120% of the stake — on a 5,000 deposit against a 50,000 notional, a 6,000 loss: the deposit is wiped out and 1,000 is still owed',
      'The concrete mechanism: margin calls demand fresh cash immediately; unmet, the position is force-liquidated — the paper loss becomes final, right after the adverse move',
      'The lesson: leverage creates no return, it dilates both tails of the distribution — size the position on the cash you can raise in a storm, not on fair-weather P&L',
    ],
    bonus: [
      'L\'illustration de marché : le 15 janvier 2015, le saut du franc suisse a mis des comptes retail à fort levier massivement en négatif — des pertes au-delà du dépôt, absorbées par les courtiers',
      'Le contre-exemple riche : Buffett a vendu des dérivés géants mais SANS appels de marge quotidiens — il avait neutralisé précisément ce mécanisme',
    ],
    bonusEn: [
      'The market illustration: on 15 January 2015, the Swiss franc jump pushed highly leveraged retail accounts massively negative — losses beyond the deposit, absorbed by the brokers',
      'The rich counter-example: Buffett sold giant derivative positions but WITHOUT daily margin calls — he had neutralised precisely this mechanism',
    ],
    reponseModele: `Oui — et c'est la différence structurelle entre **investir une somme** et **engager sa signature**. En achetant une action, ma perte maximale est de 100 % : le titre peut tomber à zéro, pas en dessous. Un futures ne se paie pas : il se garantit. Pour porter 50 000 € de notionnel, je ne dépose qu'une marge — disons 10 %, soit 5 000 €. Je contrôle dix fois ma mise, et chaque variation du sous-jacent est démultipliée d'autant : le levier vaut un sur la marge.

Faites le calcul dans le sens qui fait mal. Un jour de krach à −12 %, la variation de ma mise vaut −12 %/10 % = **−120 %**. Sur mes 5 000 € déposés, la perte est de 6 000 € : le dépôt est effacé, et il manque encore 1 000 € — que je dois, en argent frais, ce soir. La perte a traversé mon dépôt et continue sa course : je suis engagé sur le notionnel entier, pas sur ma mise.

Le mécanisme concret est l'appel de marge : non honoré dans le délai, le courtier liquide d'office — au pire moment, juste après le mouvement adverse, la perte latente devient définitive.

Ma conclusion de professionnel : le levier ne crée pas de rendement, il dilate les deux queues de la distribution. On dimensionne donc une position sur le cash mobilisable dans la tempête — jamais sur le P&L espéré au beau temps.`,
    reponseModeleEn: `Yes — and that is the structural difference between **investing a sum** and **committing your signature**. Buying a share, my maximum loss is 100%: the stock can fall to zero, not below. A future is not paid for: it is guaranteed. To carry 50,000 of notional, I only post a margin — say 10%, or 5,000. I control ten times my stake, and every move in the underlying is magnified accordingly: leverage equals one over the margin.

Run the computation the way that hurts. On a crash day at −12%, the change in my stake is −12%/10% = **−120%**. On my 5,000 deposit, the loss is 6,000: the deposit is wiped out, and 1,000 is still missing — owed, in fresh cash, tonight. The loss has gone straight through my deposit and kept running: I am committed on the entire notional, not on my stake.

The mechanism that makes this very concrete is the margin call: unmet within the deadline, the broker liquidates the position — at the worst moment, right after the adverse move, and the paper loss becomes final.

The professional conclusion I draw: leverage creates no return, it dilates both tails of the distribution. So you size a position on the cash you can raise in a storm — never on fair-weather P&L.`,
  },
  {
    id: 'm7-j-07',
    moduleId: M7,
    theme: 'futures, marges et chambre de compensation',
    themeEn: 'futures, margins and the clearing house',
    difficulte: 4,
    question: 'La chambre de compensation peut-elle sauter ?',
    questionEn: 'Can a clearing house fail?',
    plan: [
      'Refuser le confort du « jamais » : décrire d\'abord ce que la chambre risque — le défaut d\'un membre, pas le marché',
      'Dérouler la cascade de défaut : marges du défaillant, fonds de garantie, capital de la chambre, contributions des survivants',
      'Donner l\'épreuve historique : Lehman 2008, absorbé pour l\'essentiel par les seules marges du défaillant',
      'Conclure en stratège : le risque n\'a pas disparu, il s\'est concentré — la CCP est systémique par construction, et surveillée comme telle',
    ],
    planEn: [
      'Refuse the comfort of "never": first describe what the house actually risks — a member\'s default, not the market',
      'Walk the default waterfall: defaulter\'s margins, default fund, the house\'s own capital, survivors\' contributions',
      'Give the historical test: Lehman 2008, absorbed essentially by the defaulter\'s own margins',
      'Conclude as a strategist: the risk has not disappeared, it has been concentrated — the CCP is systemic by construction, and supervised as such',
    ],
    pointsAttendus: [
      'Préciser d\'abord ce que la chambre risque : sa position de marché est nulle (acheteuse de tous les vendeurs, vendeuse de tous les acheteurs) — son risque est le défaut d\'un membre laissant un trou plus grand que ses dépôts',
      'Première ligne de défense : les marges du défaillant — initiale calibrée sur la perte plausible d\'une ou deux séances, variation réglée chaque soir ; elles suffisent dans l\'immense majorité des cas, Lehman compris',
      'La cascade ensuite : contribution du défaillant au fonds de garantie, tranche du capital de la chambre elle-même (le skin in the game, qui l\'incite à calibrer sérieusement), puis contributions des membres survivants, éventuellement recomplétées',
      'Le scénario noir : défauts multiples simultanés sur mouvements extrêmes, marges procycliques — la cascade peut en théorie s\'épuiser ; la défaillance d\'une grande CCP serait un événement systémique majeur',
      'Le paradoxe post-2008 : la régulation a volontairement concentré le risque dans quelques chambres devenues hypercritiques — chassé des bilans bancaires, le risque s\'est déplacé vers des nœuds mieux surveillés',
      'La réponse de synthèse : hautement improbable, jamais arrivé aux grandes chambres modernes — mais tout l\'édifice suppose que la forteresse ne cède jamais, d\'où stress tests et surveillance rapprochée',
    ],
    pointsAttendusEn: [
      'First specify what the house risks: its market position is flat (buyer to every seller, seller to every buyer) — its risk is a member defaulting with a hole bigger than its deposits',
      'First line of defence: the defaulter\'s margins — initial calibrated on the plausible loss of one or two sessions, variation settled every evening; they suffice in the vast majority of cases, Lehman included',
      'Then the waterfall: the defaulter\'s contribution to the default fund, a tranche of the house\'s own capital (skin in the game, incentivising serious margin calibration), then the surviving members\' contributions, possibly replenished',
      'The dark scenario: multiple simultaneous defaults on extreme moves, procyclical margins — the waterfall can in theory be exhausted; the failure of a major CCP would be a major systemic event',
      'The post-2008 paradox: regulation deliberately concentrated risk in a few hypercritical clearing houses — pushed out of bank balance sheets, the risk moved to better-watched nodes',
      'The summary answer: highly improbable, never seen at the major modern houses — but the whole edifice assumes the fortress never falls, hence stress tests and close supervision',
    ],
    bonus: [
      'La procyclicité des marges : dans la tempête, les modèles relèvent les exigences au moment précis où le cash est rare — la protection de la chambre peut amplifier le stress de ses membres',
      'GameStop, janvier 2021 : les appels de marge de la chambre des actions américaines aux courtiers ont dicté la suspension des achats — la CCP n\'est pas une abstraction, elle pilote des décisions visibles',
    ],
    bonusEn: [
      'Margin procyclicality: in a storm, the models raise requirements at the precise moment cash is scarce — the house\'s protection can amplify its members\' stress',
      'GameStop, January 2021: the US equities clearing house\'s margin calls on brokers dictated the buying halt — the CCP is no abstraction, it drives visible decisions',
    ],
    reponseModele: `La réponse honnête tient en deux temps : elle est construite pour ne pas sauter — et tout l'édifice suppose qu'elle ne saute jamais.

D'abord, ce que la chambre risque vraiment. Sa position de marché est nulle : acheteuse de tous les vendeurs, vendeuse de tous les acheteurs, elle ne perd rien quand les prix bougent. Son risque est ailleurs : qu'un membre fasse défaut en laissant un trou plus grand que ses dépôts. Contre cela, elle organise une **cascade de défaut**. Première ligne : les marges du défaillant — initiale calibrée sur la perte plausible d'une ou deux séances, variation réglée chaque soir. L'épreuve du feu : 2008 — les portefeuilles colossaux de Lehman, liquidés d'abord sur ses propres marges, sans sinistre majeur. Ensuite : sa contribution au fonds de garantie pré-financé, puis une tranche du capital de la chambre elle-même — le *skin in the game* qui l'incite à calibrer sérieusement —, enfin les contributions des membres survivants.

Le scénario noir existe pourtant : défauts multiples sur mouvements extrêmes, marges procycliques qui réclament du cash au pire moment. La cascade peut, en théorie, s'épuiser. Et le paradoxe post-2008 est assumé : en imposant la compensation centrale, on a **concentré** le risque dans quelques nœuds hypercritiques — mieux surveillés, stress-testés, mais systémiques par construction.

La forteresse n'a jamais cédé chez les grandes chambres modernes ; sa défaillance est hautement improbable — et serait un événement systémique majeur. C'est pourquoi on la surveille comme hier les banques.`,
    reponseModeleEn: `The honest answer comes in two steps: it is built not to fail — and the whole edifice assumes it never does.

First, what the house actually risks. Its market position is flat: buyer to every seller, seller to every buyer, it loses nothing when prices move. Its risk lies elsewhere: a member defaulting with a hole bigger than its deposits. Against that, it organises a **default waterfall**. First line: the defaulter's margins — initial margin calibrated on the plausible loss of one or two sessions, variation settled every evening. The trial by fire: in 2008, Lehman's colossal portfolios were liquidated relying first on its own margins, with no major loss. Next: its contribution to the pre-funded default fund, then a tranche of the house's own capital — the *skin in the game* that incentivises serious calibration — and finally the surviving members' contributions.

Yet the dark scenario exists: multiple defaults on extreme moves, procyclical margins demanding cash at the worst moment. The waterfall can, in theory, run dry. And the post-2008 paradox is deliberate: by mandating central clearing, we **concentrated** risk into a few hypercritical nodes — better supervised, stress-tested, but systemic by construction.

My closing line: the fortress has never fallen among the major modern houses; its failure is highly improbable — and would be a major systemic event. Which is precisely why it is watched the way banks used to be.`,
  },
  {
    id: 'm7-j-08',
    moduleId: M7,
    theme: 'le pricing par cash-and-carry',
    themeEn: 'cash-and-carry pricing',
    difficulte: 2,
    question: 'Démontrez-moi le cash-and-carry en 90 secondes.',
    questionEn: 'Prove cash-and-carry pricing for me in 90 seconds.',
    plan: [
      'Poser le problème : vendre l\'indice à terme sans deviner le marché — il suffit de FABRIQUER la livraison dès aujourd\'hui',
      'Compter le portage : emprunter pour acheter le panier au spot, le porter en encaissant les dividendes',
      'Égaliser : coût de revient = spot + financement − dividendes, d\'où F = S × (1 + (r − q) × T)',
      'Chiffrer : 5 000 points, financement 4 %, dividendes 2 %, un an — F = 5 100 ; aucune anticipation n\'entre dans le calcul',
    ],
    planEn: [
      'Set the problem: selling the index forward without guessing the market — just MANUFACTURE the delivery today',
      'Count the carry: borrow to buy the basket at spot, carry it while collecting the dividends',
      'Equate: all-in cost = spot + financing − dividends, hence F = S × (1 + (r − q) × T)',
      'Quantify: 5,000 points, 4% financing, 2% dividends, one year — F = 5,100; no expectation enters the computation',
    ],
    pointsAttendus: [
      'L\'idée fondatrice : le vendeur à terme n\'a rien à prévoir — il achète le panier comptant (cash), le finance et le porte (carry) jusqu\'à la livraison',
      'Les comptes du portage sur l\'exemple canonique : financement 5 000 × 4 % = 200 points ; dividendes encaissés 5 000 × 2 % = 100 points',
      'Le coût de revient complet : 5 000 + 200 − 100 = 5 100 — vendre au-dessus, c\'est gagner à coup sûr ; en dessous, perdre à coup sûr : 5 100 est le seul prix sans argent gratuit',
      'La formule générale, en intérêts linéaires : F = S × (1 + (r − q) × T) — r > q donne le report (F > S), q > r le déport (F < S)',
      'La grande unification : la même formule partout, seul q change — dividendes pour un indice, taux de la devise achetée pour le change (la CIP), convenience yield moins stockage pour une matière première',
      'La conclusion d\'arbitrage : trois nombres observables aujourd\'hui suffisent — aucune anticipation n\'entre dans le prix',
    ],
    pointsAttendusEn: [
      'The founding idea: the forward seller has nothing to forecast — he buys the basket for cash, finances it and carries it to delivery',
      'The carry accounts on the canonical example: financing 5,000 × 4% = 200 points; dividends collected 5,000 × 2% = 100 points',
      'The all-in cost: 5,000 + 200 − 100 = 5,100 — sell above it and you win for sure; below it and you lose for sure: 5,100 is the only price with no free money',
      'The general formula, in simple interest: F = S × (1 + (r − q) × T) — r > q gives contango-like premium (F > S), q > r a discount (F < S)',
      'The grand unification: the same formula everywhere, only q changes — dividends for an index, the purchased currency\'s rate for FX (CIP), convenience yield minus storage for a commodity',
      'The arbitrage conclusion: three numbers observable today suffice — no expectation enters the price',
    ],
    bonus: [
      'La nuance d\'exécution : le sens inverse (reverse cash and carry) exige d\'emprunter les titres — le prix vit donc dans une étroite bande de non-arbitrage, pas sur un fil',
      'Le raffinement de second ordre : futures et forward divergent légèrement quand le sous-jacent est corrélé aux taux — le biais de convexité, pricé sur les taux courts lointains',
    ],
    bonusEn: [
      'The execution nuance: the reverse direction (reverse cash and carry) requires borrowing the securities — so the price lives in a narrow no-arbitrage band, not on a knife edge',
      'The second-order refinement: futures and forwards diverge slightly when the underlying is correlated with rates — the convexity bias, priced on distant short-rate contracts',
    ],
    reponseModele: `Quatre-vingt-dix secondes, et je n'aurai besoin d'aucune prévision. Vendeur d'un forward sur indice, je dois livrer l'indice dans un an à un prix fixé aujourd'hui. Deviner où sera le marché ? Non — je **fabrique la livraison dès aujourd'hui**.

J'emprunte de quoi acheter le panier d'actions au spot, 5 000 points, à un taux de financement de 4 % ; je le porte un an ; et pendant ce temps, le panier me verse ses dividendes, 2 %. Les comptes du portage : le financement me coûte 5 000 × 4 % = 200 points, les dividendes me rapportent 5 000 × 2 % = 100 points. Mon coût de revient complet est donc 5 000 + 200 − 100 = **5 100 points**.

Vendre au-dessus de 5 100, c'est gagner à coup sûr ; en dessous, perdre à coup sûr. Le seul prix auquel personne n'encaisse d'argent gratuit : **F = S × (1 + (r − q) × T)** — le spot porté du coût de portage net, en intérêts linéaires. r au-dessus de q : report ; l'inverse : déport.

Et la formule est universelle : seul le contenu de q change — dividendes pour un indice, taux de la devise achetée pour le change (la parité couverte est un cash-and-carry), convenience yield moins stockage pour une matière première.

La chute : trois nombres observables aujourd'hui suffisent — un prix à terme est une fabrication, jamais une prévision.`,
    reponseModeleEn: `Ninety seconds, and I will need no forecast. Put me in the shoes of the seller of an index forward: I must deliver the index in one year at a price fixed today. Do I need to guess where the market will be? No — I **manufacture the delivery today**.

I borrow enough to buy the basket of shares at spot, 5,000 points, at a 4% funding rate; I carry it for a year; and meanwhile the basket pays me its dividends, 2%. The carry accounts: financing costs me 5,000 × 4% = 200 points, dividends earn me 5,000 × 2% = 100 points. My all-in cost is therefore 5,000 + 200 − 100 = **5,100 points**.

If I sell the forward above 5,100, I win for sure; below, I lose for sure. The only price at which nobody collects free money: **F = S × (1 + (r − q) × T)** — spot carried at the net cost of carry, in simple interest. Financing above the yield: the forward trades at a premium; the reverse: at a discount.

And the formula is universal: only the content of q changes — dividends for an index, the purchased currency\'s interest rate for FX (covered parity is a cash-and-carry), convenience yield minus storage for a commodity.

The closing line, in one sentence: three numbers observable today suffice — a forward price is a fabrication, never a forecast.`,
  },
  {
    id: 'm7-j-09',
    moduleId: M7,
    theme: 'le pricing par cash-and-carry',
    themeEn: 'cash-and-carry pricing',
    difficulte: 2,
    question: 'L\'indice cote 5 000, le futures à un an cote 5 100. Le marché prévoit donc une hausse de 2 % ?',
    questionEn: 'The index trades at 5,000, the one-year future at 5,100. So the market forecasts a 2% rise?',
    plan: [
      'Répondre net : non — le futures est un prix d\'arbitrage, pas un sondage',
      'Décomposer les 100 points : 200 de financement moins 100 de dividendes — le loyer de l\'argent moins le loyer de l\'actif',
      'Donner le contre-exemple historique : 2015-2021, les futures d\'indices européens cotaient SOUS le spot — arithmétique, pas pessimisme',
      'Généraliser : même piège que le forward de change et le taux forward — trois habits, un seul contresens',
    ],
    planEn: [
      'Answer squarely: no — the future is an arbitrage price, not a poll',
      'Decompose the 100 points: 200 of financing minus 100 of dividends — the rent of money minus the rent of the asset',
      'Give the historical counter-example: 2015-2021, European index futures traded BELOW spot — arithmetic, not pessimism',
      'Generalise: same trap as the FX forward and the forward rate — three outfits, one misreading',
    ],
    pointsAttendus: [
      'Le prix du futures sort de trois nombres observables aujourd\'hui — spot, taux de financement, rendement du dividende : aucune anticipation n\'entre dans le calcul',
      'Les 100 points se décomposent : 5 000 × 4 % = 200 points de financement, moins 5 000 × 2 % = 100 points de dividendes — le coût de portage net, pas une prévision',
      'Si l\'écart ne valait pas le portage, l\'arbitrage cash-and-carry le refermerait en quelques secondes : c\'est précisément lui qui fixe le prix',
      'Le contre-exemple qui tue le contresens : 2015-2021, taux proches de zéro et dividendes vers 3 % — q > r, les futures européens cotaient durablement sous le spot ; y lire du pessimisme était une erreur d\'arithmétique',
      'La base S − F converge vers zéro à l\'échéance par construction : un futures qui expire devient du spot',
      'Le triple jumeau du cours : forward de change, taux forward, futures d\'indice — un prix d\'arbitrage n\'est jamais une anticipation',
    ],
    pointsAttendusEn: [
      'The futures price comes from three numbers observable today — spot, funding rate, dividend yield: no expectation enters the computation',
      'The 100 points decompose: 5,000 × 4% = 200 points of financing, minus 5,000 × 2% = 100 points of dividends — the net cost of carry, not a forecast',
      'If the gap did not equal the carry, the cash-and-carry arbitrage would close it within seconds: that is precisely what sets the price',
      'The counter-example that kills the misreading: 2015-2021, near-zero rates and dividends around 3% — q > r, European futures traded durably below spot; reading pessimism into it was an arithmetic error',
      'The basis S − F converges to zero at expiry by construction: an expiring future becomes spot',
      'The course\'s triple twin: FX forward, forward rate, index future — an arbitrage price is never an expectation',
    ],
    bonus: [
      'La pratique des salles : la fair value publiée chaque matin — l\'écart du futures à cette valeur donne le sens probable de l\'ouverture du comptant, c\'est lui que commentent les desks à 8 h 59',
      'La nuance fine : sur les futures de taux courts, on LIT bien des anticipations — mais à travers une convention de prix, et avec une prime de risque logée dedans',
    ],
    bonusEn: [
      'Trading floor practice: the fair value published every morning — the future\'s gap to it gives the likely direction of the cash open, the number desks comment at 8:59',
      'The fine nuance: on short-term rate futures you DO read expectations — but through a price convention, and with a risk premium lodged inside',
    ],
    reponseModele: `Non — et le piège est dans le verbe « prévoit ». Le futures ne prévoit rien : son prix se **déduit** de trois nombres observables aujourd'hui — spot, taux de financement, rendement du dividende. Aucune anticipation n'entre dans le calcul.

Décomposons les 100 points. Porter l'indice un an coûte le financement : 5 000 × 4 % = 200 points ; et rapporte les dividendes : 5 000 × 2 % = 100 points. Le coût de portage net vaut 100 points : le futures cote 5 100 parce que c'est le coût de **fabrication** de la livraison — le loyer de l'argent moins le loyer de l'actif. Si l'écart valait autre chose, le cash-and-carry le refermerait en secondes : c'est l'arbitrage qui fixe le prix, pas une opinion.

Le contre-exemple historique achève le contresens : entre 2015 et 2021, avec des taux proches de zéro et des dividendes autour de 3 %, les futures sur indices européens cotaient durablement **sous** le spot. Des générations d'étudiants y ont lu du pessimisme ; c'était de l'arithmétique — q > r, rien d'autre. Le resserrement de 2022-2024 a inversé la configuration sans qu'aucune « prévision » ne change de camp.

Repère mécanique enfin : la base converge vers zéro à l'échéance — un futures qui expire devient du spot.

La chute : même piège, sous trois habits, que le forward de change et le taux forward — **un prix d'arbitrage n'est pas un sondage**. C'est la faute que cette question débusque.`,
    reponseModeleEn: `No — and the trap is in the verb "forecasts". The future forecasts nothing: its price is **deduced** from three numbers observable today — spot, the funding rate, the dividend yield. No expectation enters the computation.

Decompose the 100 points. Carrying the index for a year costs the financing: 5,000 × 4% = 200 points; and earns the dividends: 5,000 × 2% = 100 points. The net cost of carry is 100 points: the future trades at 5,100 because that is the **manufacturing cost** of the delivery — the rent of money minus the rent of the asset. If the gap were anything else, the cash-and-carry arbitrage would close it within seconds; that is what sets the price, not an opinion.

The counter-example that finishes off the misreading is historical: between 2015 and 2021, with near-zero rates and dividends around 3%, futures on European indices traded durably **below** spot. Generations of students read pessimism into it; it was arithmetic — q > r, nothing more. The 2022-2024 tightening flipped the configuration without any "forecast" switching sides.

I would add the mechanical anchor: the basis converges to zero at expiry — an expiring future becomes spot.

The closing line: it is the same trap, in three outfits, as the FX forward and the forward rate — **an arbitrage price is not a poll**. Confusing the two is the very mistake this question is designed to flush out.`,
  },
  {
    id: 'm7-j-10',
    moduleId: M7,
    theme: 'le pricing par cash-and-carry',
    themeEn: 'cash-and-carry pricing',
    difficulte: 3,
    question: 'Le prix d\'arbitrage est 5 100, mais le futures cote 5 150 (multiplicateur 10 €). Que faites-vous, concrètement ?',
    questionEn: 'The arbitrage price is 5,100, but the future trades at 5,150 (10-euro multiplier). What do you do, concretely?',
    plan: [
      'Diagnostiquer : le terme surpaie la livraison de 50 points — je vends ce qui est trop cher et je le fabrique moins cher',
      'Dérouler le jour J : emprunter 50 000 € à 4 %, acheter le panier au spot, vendre le futures à 5 150 — mise nulle',
      'Compter à l\'échéance : livraison contre 51 500 €, plus 1 000 € de dividendes, moins 52 000 € de dette = +500 € par contrat',
      'Conclure : sans capital ni risque de marché — et la ruée des desks referme l\'écart vers 5 100',
    ],
    planEn: [
      'Diagnose: the forward overpays the delivery by 50 points — I sell what is too expensive and manufacture it more cheaply',
      'Walk day one: borrow 50,000 at 4%, buy the basket at spot, sell the future at 5,150 — zero outlay',
      'Count at maturity: delivery against 51,500, plus 1,000 of dividends, minus a 52,000 debt = +500 per contract',
      'Conclude: no capital, no market risk — and the desks\' rush closes the gap back to 5,100',
    ],
    pointsAttendus: [
      'Le sens d\'abord : on VEND le futures surpayé et on ACHÈTE le comptant — « vendre et attendre » sans détenir le panier serait une spéculation, pas un arbitrage',
      'Jour J, trois gestes simultanés : emprunter 50 000 € à 4 %, acheter le panier (5 000 points × 10 €), vendre le futures à 5 150 — mise de sa poche : zéro',
      'Pendant l\'année : le panier verse 1 000 € de dividendes (100 points) ; la dette enfle à 52 000 € (5 200 points)',
      'À l\'échéance : livrer l\'indice contre 51 500 € — bilan : 51 500 + 1 000 − 52 000 = +500 € par contrat, soit les 50 points d\'écart fois le multiplicateur',
      'Les deux propriétés à marteler : aucun capital initial, aucun risque de marché — tous les prix et taux sont figés au départ, peu importe où finit l\'indice',
      'La dynamique collective : des dizaines de desks vendent le même futures — le cours revient vers 5 100, le seul prix auquel personne n\'a plus rien à gagner',
    ],
    pointsAttendusEn: [
      'Direction first: you SELL the overpriced future and BUY the cash basket — "sell and wait" without holding the basket would be speculation, not arbitrage',
      'Day one, three simultaneous moves: borrow 50,000 at 4%, buy the basket (5,000 points × 10), sell the future at 5,150 — out-of-pocket stake: zero',
      'During the year: the basket pays 1,000 of dividends (100 points); the debt grows to 52,000 (5,200 points)',
      'At maturity: deliver the index against 51,500 — tally: 51,500 + 1,000 − 52,000 = +500 per contract, the 50-point gap times the multiplier',
      'The two properties to hammer: no initial capital, no market risk — every price and rate is locked at inception, wherever the index ends up',
      'The collective dynamics: dozens of desks sell the same future — the price returns towards 5,100, the only level at which nobody has anything left to gain',
    ],
    bonus: [
      'Le cas symétrique : futures SOUS le prix d\'arbitrage, reverse cash and carry — vendre le panier à découvert via le prêt-emprunt de titres, sens plus contraint, d\'où une bande de non-arbitrage plutôt qu\'un fil',
      'La version moderne : le program trading referme ces écarts en secondes — et les jours où la base casse malgré tout (dividendes incertains de 2020, fin d\'année) sont un thermomètre de stress',
    ],
    bonusEn: [
      'The symmetric case: future BELOW the arbitrage price, reverse cash and carry — short the basket via securities lending, a more constrained direction, hence a no-arbitrage band rather than a knife edge',
      'The modern version: program trading closes these gaps in seconds — and the days when the basis breaks anyway (2020\'s uncertain dividends, year-end) are a stress thermometer',
    ],
    reponseModele: `Le futures surpaie la livraison de 50 points : je **vends** ce qui est trop cher, et je fabrique la même livraison moins cher. Surtout pas « vendre et attendre » sans rien détenir : un pari directionnel, pas un arbitrage.

Jour J, trois gestes simultanés : emprunter 50 000 € à 4 %, acheter le panier au spot — 5 000 points fois 10 € —, vendre le futures à 5 150. Mise de poche : **zéro**. Pendant l'année, le panier me verse 1 000 € de dividendes — 100 points — et ma dette enfle à 52 000 €.

À l'échéance, tout se dénoue : je livre l'indice contre 51 500 €, j'ajoute les 1 000 € de dividendes, je rembourse 52 000 €. Bilan : **+500 € par contrat** — les 50 points d'écart fois le multiplicateur. Les deux propriétés qui définissent l'arbitrage : aucun capital initial — tout est financé par l'emprunt — et aucun risque de marché — tout est figé au départ, peu importe où finit l'indice.

Et je ne serai pas seul : des dizaines de desks vendent le même futures dans la seconde — la ruée ramène le cours vers 5 100, le seul prix auquel personne n'a plus rien à gagner. Ainsi tient la formule du portage.

Nuance d'exécution pour finir : dans l'autre sens, il faudrait emprunter les titres — plus contraint. Le prix vit donc dans une étroite **bande de non-arbitrage**, refermée en secondes par le program trading.`,
    reponseModeleEn: `The future overpays the delivery by 50 points: I **sell** what is too expensive, and I manufacture the same delivery more cheaply. Definitely not "sell and wait" holding nothing — that would be a directional bet, not an arbitrage.

Day one, three simultaneous moves. I borrow 50,000 at 4%; I buy the basket of shares at spot — 5,000 points times 10; I sell the future at 5,150. Out of my pocket: **zero**. During the year, the basket pays me 1,000 in dividends — 100 points — and my debt grows to 52,000.

At maturity, everything unwinds mechanically: I deliver the index against 51,500, add the 1,000 of dividends, repay 52,000. Tally: **+500 per contract** — exactly the 50-point gap times the multiplier. Reread the two properties that define arbitrage: no initial capital — everything is funded by the loan — and no market risk — prices and rates are locked at inception, wherever the index finishes.

And I will not be alone: dozens of desks sell the same future within the second. That rush drives the price back towards 5,100 — the only level at which nobody has anything left to gain. That is how the carry formula holds.

One execution nuance to finish: in the other direction, you would need to borrow the securities — more constrained. So the price lives inside a narrow **no-arbitrage band**, closed nowadays within seconds by program trading.`,
  },
  {
    id: 'm7-j-11',
    moduleId: M7,
    theme: 'FRA et futures de taux',
    themeEn: 'FRAs and short-term rate futures',
    difficulte: 2,
    question: 'FRA 6×12 à 3 % sur 10 M€, position longue. Au fixing, le taux 6 mois ressort à 4 % : qui paie quoi — et combien, exactement ?',
    questionEn: 'A 6×12 FRA at 3% on €10m, long position. At fixing, the 6-month rate comes out at 4%: who pays what — and exactly how much?',
    plan: [
      'Lire le contrat : 6×12 = la période qui commence dans 6 mois et finit dans 12 ; le long est le payeur du taux fixe',
      'Établir le sens : les taux ont monté, le long reçoit — c\'est l\'emprunteur futur qui se couvre',
      'Calculer : différentiel 10 M€ × 1 % × 0,5 = 50 000 €, actualisé au taux constaté : 50 000/1,02 = 49 019,61 €',
      'Boucler la cohérence : replacés 6 mois à 4 %, ces 49 019,61 € redonnent exactement 50 000 €',
    ],
    planEn: [
      'Read the contract: 6×12 = the period starting in 6 months and ending in 12; the long is the fixed-rate payer',
      'Establish the direction: rates went up, the long receives — it is the future borrower hedging',
      'Compute: differential €10m × 1% × 0.5 = €50,000, discounted at the observed rate: 50,000/1.02 = €49,019.61',
      'Close the loop: reinvested for 6 months at 4%, those €49,019.61 give back exactly €50,000',
    ],
    pointsAttendus: [
      'La notation : 6×12 se lit « six contre douze » — un taux 6 mois, dans 6 mois ; aucun capital ne circule, seul le différentiel se règle',
      'Le sens, à énoncer sans hésiter : le long du FRA (payeur du fixe) gagne quand les taux montent — l\'emprunteur futur est blessé par la hausse, sa couverture doit payer à la hausse',
      'Le différentiel d\'intérêts : 10 000 000 × (4 − 3) % × 0,5 = 50 000 €',
      'L\'actualisation, le point qui sépare les candidats : le règlement a lieu AU FIXING, en début de période, alors que le surcoût qu\'il compense tombe en fin — 50 000/(1 + 4 % × 0,5) = 49 019,61 €',
      'La preuve de cohérence : 49 019,61 € replacés 6 mois à 4 % redonnent 50 000 € — tout compris, la trésorière emprunte bien à 3 %, comme promis',
      'La symétrie : si le taux était ressorti à 2 %, le long aurait payé 49 504,95 € — différentiel actualisé au nouveau taux constaté',
    ],
    pointsAttendusEn: [
      'The notation: 6×12 reads "six against twelve" — a 6-month rate, in 6 months; no capital moves, only the differential settles',
      'The direction, to state without hesitation: the long FRA (fixed-rate payer) gains when rates rise — the future borrower is hurt by the rise, so his hedge must pay on the rise',
      'The interest differential: 10,000,000 × (4 − 3)% × 0.5 = €50,000',
      'Discounting, the point that separates candidates: settlement happens AT FIXING, at the start of the period, while the extra cost it compensates falls at the end — 50,000/(1 + 4% × 0.5) = €49,019.61',
      'The consistency proof: €49,019.61 reinvested for 6 months at 4% gives back €50,000 — all in, the treasurer borrows at 3%, as promised',
      'The symmetry: had the rate come out at 2%, the long would have paid €49,504.95 — the differential discounted at the new observed rate',
    ],
    bonus: [
      'L\'ancrage mnémotechnique : long FRA = payeur du fixe = ami des hausses de taux — le même camp que le vendeur de futures Euribor et le payeur fixe d\'un swap',
      'La modernité : avec la mort du Libor, le FRA classique forward-looking a largement cédé la place aux futures et swaps sur SOFR/€STR, composés au fil de l\'eau et connus en fin de période',
    ],
    bonusEn: [
      'The mnemonic anchor: long FRA = fixed payer = friend of rising rates — the same camp as the Euribor futures seller and the fixed payer of a swap',
      'The modern note: with Libor\'s death, the classic forward-looking FRA has largely given way to SOFR/€STR futures and swaps, compounded along the way and known at period end',
    ],
    reponseModele: `Je reçois — et le chiffre exact départage. Lecture du contrat d'abord : un 6×12 couvre la période qui commence dans 6 mois et finit dans 12 — un taux 6 mois, dans 6 mois. Aucun capital ne circule : au fixing, on compare le taux garanti au taux constaté et on ne règle que la différence.

Le sens, sans hésitation : le **long FRA — payeur du taux fixe — gagne quand les taux montent**. C'est la position de l'emprunteur futur : blessé par la hausse, sa couverture doit payer à la hausse. De 3 % à 4 %, je suis du bon côté.

Le calcul en deux temps. Le différentiel d'intérêts sur la période : 10 M€ × (4 − 3) % × 0,5 = **50 000 €**. Mais ils compensent un surcoût payable à la **fin** de la période d'emprunt, alors que le FRA se règle **au fixing**, en début de période. Verser 50 000 € aujourd'hui pour un préjudice dans six mois serait trop payer : on actualise au taux constaté — 50 000/(1 + 4 % × 0,5) = **49 019,61 €**.

Preuve de cohérence : replacés six mois à 4 %, ces 49 019,61 € redonnent exactement 50 000 € — pile le surcoût. Tout compris, la trésorière emprunte à 3 %, comme promis il y a six mois.

La chute : un FRA ne fait que cela — transformer un taux incertain en taux certain, au centime près.`,
    reponseModeleEn: `I receive — and I will walk through the number, because the number is what separates candidates. First, reading the contract: a 6×12 covers the period starting in 6 months and ending in 12 — a 6-month rate, in 6 months. No capital moves: at fixing, the guaranteed rate is compared with the observed rate and only the difference settles.

The direction next, without hesitation: the **long FRA — the fixed-rate payer — gains when rates rise**. It is the future borrower\'s position: hurt by the rise, he needs a hedge that pays on the rise. Rates went from 3% to 4%: I am on the right side.

The computation in two steps. The interest differential over the period: €10m × (4 − 3)% × 0.5 = **€50,000**. But those €50,000 compensate an extra interest cost payable at the **end** of the borrowing period, while the FRA settles **at fixing**, at the start. Paying €50,000 today for a harm due in six months would be overpaying: you discount at the observed rate — 50,000/(1 + 4% × 0.5) = **€49,019.61**.

The proof the convention is right: reinvested for six months at 4%, those €49,019.61 give back exactly €50,000 — precisely the extra cost. All in, the treasurer borrows at 3%, as promised six months ago.

The closing line: a FRA does exactly that — it turns an uncertain rate into a certain one, to the cent.`,
  },
  {
    id: 'm7-j-12',
    moduleId: M7,
    theme: 'FRA et futures de taux',
    themeEn: 'FRAs and short-term rate futures',
    difficulte: 3,
    question: 'Le 6 mois cote 3 %, le 1 an 3,5 %. À quel taux pouvez-vous garantir aujourd\'hui un emprunt de 6 mois dans 6 mois — et pourquoi celui-là ?',
    questionEn: 'The 6-month rate is 3%, the 1-year 3.5%. At what rate can you guarantee, today, a 6-month loan starting in 6 months — and why that one?',
    plan: [
      'Poser les deux chemins vers l\'horizon 1 an : placer d\'un bloc à 3,5 %, ou placer 6 mois à 3 % puis rouler au forward f',
      'Égaliser : 1,015 × (1 + f × 0,5) = 1,035, d\'où f = 3,9409 %',
      'Désamorcer le piège du 4 % : le second placement part d\'un capital déjà gonflé à 1,015 — il faut un peu moins de 4',
      'Conclure : la banque garantit ce taux parce qu\'elle peut le FABRIQUER depuis la courbe — pas le prédire',
    ],
    planEn: [
      'Set the two paths to the 1-year horizon: invest in one block at 3.5%, or invest 6 months at 3% then roll at the forward f',
      'Equate: 1.015 × (1 + f × 0.5) = 1.035, hence f = 3.9409%',
      'Defuse the 4% trap: the second investment starts from capital already grown to 1.015 — slightly less than 4 is needed',
      'Conclude: the bank guarantees this rate because it can MANUFACTURE it from the curve — not predict it',
    ],
    pointsAttendus: [
      'Le raisonnement d\'arbitrage : deux stratégies sans risque, même mise, même horizon — même richesse finale, sinon argent gratuit',
      'Le calcul : 1,015 × (1 + f × 0,5) = 1,035, soit f = [(1,035/1,015) − 1]/0,5 = 3,9409 %',
      'Le piège du « 4 % » : l\'intuition de moyenne oublie que le second semestre part d\'un capital gonflé à 1,015 — il faut un peu moins de 4 % pour boucler',
      'La fabrication, cœur de la réponse : emprunter 1 an à 3,5 % et replacer 6 mois à 3 % — le taux de la seconde période sort tout seul ; le FRA est à la courbe ce que le cash-and-carry est à l\'indice',
      'Le statut du chiffre : 3,9409 % n\'est pas une prévision — c\'est le seul taux garantissable sans risque, donc le seul que la banque peut coter',
      'La subtilité de convention : en linéaire (monde monétaire), une courbe PLATE à 4 % donne un forward 6×12 à 3,9216 %, pas 4 — le linéaire ne compose pas ; en composé (monde obligataire), courbe plate donne exactement 4',
    ],
    pointsAttendusEn: [
      'The arbitrage reasoning: two riskless strategies, same stake, same horizon — same final wealth, otherwise free money',
      'The computation: 1.015 × (1 + f × 0.5) = 1.035, i.e. f = [(1.035/1.015) − 1]/0.5 = 3.9409%',
      'The "4%" trap: the averaging intuition forgets that the second half-year starts from capital already grown to 1.015 — slightly less than 4% is needed to close the loop',
      'The manufacturing, heart of the answer: borrow 1 year at 3.5% and reinvest 6 months at 3% — the second period\'s rate falls out by itself; the FRA is to the curve what cash-and-carry is to the index',
      'The figure\'s status: 3.9409% is not a forecast — it is the only rate that can be guaranteed risk-free, hence the only one the bank can quote',
      'The convention subtlety: in simple interest (money market), a FLAT 4% curve gives a 6×12 forward of 3.9216%, not 4 — linear interest does not compound; in compound terms (bond world), a flat curve gives exactly 4',
    ],
    bonus: [
      'L\'extension qui annonce la suite : enchaîner ces FRA bout à bout — 0×6, 6×12, 12×18… — c\'est exactement construire un swap de taux',
      'La lecture d\'écran : la bande des futures Euribor/SOFR successifs dessine la même courbe forward — l\'écran que les salles regardent les soirs de banque centrale',
    ],
    bonusEn: [
      'The extension that announces what follows: chaining these FRAs end to end — 0×6, 6×12, 12×18… — is exactly building an interest rate swap',
      'The screen reading: the strip of successive Euribor/SOFR futures draws the same forward curve — the screen trading floors watch on central bank evenings',
    ],
    reponseModele: `À **3,9409 %** — et le « pourquoi » vaut plus que le chiffre. Deux chemins sans risque vers l'horizon un an, partant du même euro. Chemin A, d'un bloc : placer à 3,5 % — 1,035. Chemin B : placer 6 mois à 3 % — 1,015 — puis replacer au taux forward f, fixé aujourd'hui. Même mise, même horizon, zéro aléa : les richesses finales doivent être égales, sinon argent gratuit. Donc 1,015 × (1 + f × 0,5) = 1,035, soit f = **3,9409 %**.

Le piège : répondre 4 % — « après 3, il faut 4 pour faire 3,5 de moyenne ». Presque juste : le second placement part d'un capital déjà gonflé à 1,015 — il faut un peu *moins* de 4 % pour boucler.

Pourquoi « garanti » et non estimé ? Parce que la banque peut le **fabriquer** : emprunter un an à 3,5 %, replacer six mois à 3 % — le taux de la seconde période sort tout seul de la courbe. Le FRA est à la courbe des taux ce que le cash-and-carry est à l'indice : une fabrication, pas une boule de cristal.

La subtilité qui paie : en linéaire — convention monétaire —, une courbe **plate** à 4 % donne un forward de 3,9216 %, pas 4 : le linéaire ne compose pas ; en composé, monde obligataire, courbe plate rend exactement 4. Connaître ces écarts de conventions, c'est parler le langage des salles.`,
    reponseModeleEn: `At **3.9409%** — and the "why" is worth more than the figure. I compare two riskless paths to the one-year horizon, starting from the same euro. Path A, in one block: invest at 3.5% — I get 1.035. Path B, in two steps: invest 6 months at 3% — 1.015 — then reinvest at the forward rate f, fixed today. Same stake, same horizon, zero uncertainty on either side: the final amounts must be equal, otherwise there is free money. So 1.015 × (1 + f × 0.5) = 1.035, hence f = **3.9409%**.

The trap this question sets: answering 4% — "after 3, you need 4 to average 3.5". Almost right, but wrong: the second investment starts from capital already grown to 1.015, so slightly *less* than 4% closes the loop.

Why is this the "guaranteed" rate and not an estimate? Because the bank can **manufacture** it: borrow one year at 3.5%, reinvest six months at 3%, and the second period\'s rate falls out of the curve by itself. The FRA is to the yield curve what cash-and-carry is to the index: a fabrication, not a crystal ball.

And the subtlety that pays at the oral: in simple interest — the money market convention — a **flat** 4% curve gives a 3.9216% forward, not 4: linear interest does not compound. In compound terms, the bond world, a flat curve returns exactly 4. Knowing where these convention gaps come from is speaking the language of the trading floor.`,
  },
  {
    id: 'm7-j-13',
    moduleId: M7,
    theme: 'FRA et futures de taux',
    themeEn: 'FRAs and short-term rate futures',
    difficulte: 2,
    question: 'Pourquoi les futures de taux courts cotent-ils « 100 moins le taux » ?',
    questionEn: 'Why do short-term interest rate futures quote at "100 minus the rate"?',
    plan: [
      'Énoncer la convention : taux anticipé 3 % donne un prix de 97,00 — et sa conséquence : le prix baisse quand les taux montent',
      'Justifier : il faut un PRIX qui monte et baisse pour brancher la machinerie des marges — et la convention recrée le réflexe obligataire',
      'Tirer la conséquence pratique : l\'emprunteur qui craint la hausse VEND le contrat — le miroir exact du FRA où il est long',
      'Chiffrer l\'unité : sur l\'Euribor 3 mois, 1 point de base vaut 25 €, le tick de 0,005 vaut 12,50 €',
    ],
    planEn: [
      'State the convention: an expected 3% rate gives a 97.00 price — and its consequence: the price falls when rates rise',
      'Justify: you need a PRICE that goes up and down to plug into the margin machinery — and the convention recreates the bond reflex',
      'Draw the practical consequence: the borrower fearing a rise SELLS the contract — the exact mirror of the FRA, where he is long',
      'Quantify the unit: on 3-month Euribor, 1 basis point is worth 25 euros, the 0.005 tick is worth 12.50',
    ],
    pointsAttendus: [
      'La convention : prix = 100 − taux — un taux à 3 % se cote 97,00, à 3,5 % le contrat cote 96,50',
      'La raison technique : un futures a besoin d\'un prix qui monte et qui baisse pour faire tourner le mark-to-market et les marges quotidiennes — un taux brut ne rentre pas dans le moule',
      'La raison pédagogique : la convention recrée le réflexe obligataire — les prix baissent quand les taux montent, le vendeur gagne à la hausse des taux',
      'La conséquence de couverture : l\'emprunteur qui se protège contre la hausse VEND des contrats — alors qu\'il était LONG du FRA : deux conventions, une même protection',
      'L\'unité de compte : sur l\'Euribor 3 mois (notionnel 1 M€, période d\'un quart d\'année), 1 pb = 1 000 000 × 0,0001 × 0,25 = 25 € ; le tick de 0,005 vaut 12,50 €',
      'La lecture macro : la bande (strip) des échéances trimestrielles dessine la trajectoire des taux courts pricée par le marché — l\'écran des soirs de banque centrale',
    ],
    pointsAttendusEn: [
      'The convention: price = 100 − rate — a 3% rate quotes at 97.00, at 3.5% the contract quotes 96.50',
      'The technical reason: a future needs a price that rises and falls to run mark-to-market and daily margins — a raw rate does not fit the mould',
      'The pedagogical reason: the convention recreates the bond reflex — prices fall when rates rise, the seller gains on rising rates',
      'The hedging consequence: the borrower protecting against a rise SELLS contracts — whereas he was LONG the FRA: two conventions, one protection',
      'The unit of account: on 3-month Euribor (€1m notional, quarter-year period), 1 bp = 1,000,000 × 0.0001 × 0.25 = €25; the 0.005 tick is worth €12.50',
      'The macro reading: the strip of quarterly expiries draws the market-priced path of short rates — the screen on central bank evenings',
    ],
    bonus: [
      'La prudence sur les « probabilités » : les fameuses probabilités de hausse tirées des Fed funds futures sont une convention de calcul — une prime de risque peut se loger dans le prix, ce n\'est pas un sondage des banquiers centraux',
      'L\'arrière-plan des indices : la mort du Libor (déclaratif, manipulé, amendes de 2012) et la bascule vers SOFR et €STR, calculés sur transactions réelles',
    ],
    bonusEn: [
      'Caution on "probabilities": the famous hike probabilities drawn from Fed funds futures are a computational convention — a risk premium can lodge in the price, it is not a poll of central bankers',
      'The index backdrop: the death of Libor (declarative, manipulated, the 2012 fines) and the switch to SOFR and €STR, computed on real transactions',
    ],
    reponseModele: `Parce qu'un taux, en soi, ne rentre pas dans le moule d'un futures — et que la convention choisie a une vertu pédagogique cachée. Un futures, c'est un prix qui monte et qui baisse, branché sur la machinerie du chapitre des marges : mark-to-market chaque soir, marge de variation, appels. Pour y faire entrer un taux d'intérêt, le marché l'a déguisé en prix : **prix = 100 − taux**. Un taux 3 mois anticipé à 3 % se cote 97,00 ; à 3,5 %, le contrat cote 96,50.

La conséquence demande un temps d'adaptation : **le prix baisse quand les taux montent** — et c'est voulu. La convention recrée exactement le réflexe obligataire : être acheteur, c'est parier sur la baisse des taux ; le vendeur gagne à la hausse. D'où le miroir qui piège les débutants : l'emprunteur qui se couvre contre la hausse des taux était *long* du FRA — il doit *vendre* des futures Euribor. Deux conventions, une même protection.

L'unité de compte : sur l'Euribor 3 mois — 1 M€, un quart d'année —, le point de base vaut 1 000 000 × 0,0001 × 0,25 = **25 €**, et le tick de 0,005 en vaut 12,50.

La chute, qui élargit : ces contrats cotent par échéances trimestrielles sur des années — la bande des prix successifs dessine, en creux, la trajectoire des taux directeurs que le marché price. C'est l'écran que toutes les salles regardent les soirs de banque centrale.`,
    reponseModeleEn: `Because a rate, by itself, does not fit a future\'s mould — and the chosen convention has a hidden pedagogical virtue. A future is a price that rises and falls, plugged into the margin machinery: mark-to-market every evening, variation margin, calls. To fit an interest rate into that, the market disguised it as a price: **price = 100 − rate**. A 3-month rate expected at 3% quotes at 97.00; at 3.5%, the contract quotes 96.50.

The consequence takes some getting used to: **the price falls when rates rise** — and that is deliberate. The convention recreates exactly the bond reflex: being a buyer means betting on falling rates; the seller gains on the rise. Hence the mirror that traps beginners: the borrower hedging against rising rates was *long* the FRA — he must *sell* Euribor futures. Two conventions, one protection.

The unit of account, to show I can actually trade it: on 3-month Euribor — €1m notional, a quarter-year period — one basis point is worth 1,000,000 × 0.0001 × 0.25 = **€25**, and the minimum price increment, the 0.005 tick, is worth 12.50.

The closing line, which widens the lens: these contracts quote on quarterly expiries over several years — the strip of successive prices sketches, in relief, the path of policy rates the market is pricing. It is the screen every trading floor watches on central bank evenings.`,
  },
  {
    id: 'm7-j-14',
    moduleId: M7,
    theme: 'FRA et futures de taux',
    themeEn: 'FRAs and short-term rate futures',
    difficulte: 3,
    question: 'L\'Euribor 3 mois passe de 96,50 à 96,54. Vous êtes short 40 contrats : votre P&L ?',
    questionEn: 'The 3-month Euribor future moves from 96.50 to 96.54. You are short 40 contracts: your P&L?',
    plan: [
      'Traduire d\'abord le prix en taux : 96,50 vers 96,54, le taux implicite passe de 3,50 % à 3,46 % — les taux ont BAISSÉ',
      'Établir le sens : short = gagnant à la hausse des taux — ici, vous perdez',
      'Chiffrer : 4 points de base × 25 € × 40 contrats = 4 000 €, au débit : P&L = −4 000 €',
      'Contrôler par le tick : 0,04 = 8 ticks de 12,50 €, soit 100 € par contrat — même résultat',
    ],
    planEn: [
      'First translate price into rate: 96.50 to 96.54, the implied rate goes from 3.50% to 3.46% — rates FELL',
      'Establish the direction: short = winner on rising rates — here, you lose',
      'Quantify: 4 basis points × 25 euros × 40 contracts = 4,000 euros, debited: P&L = −4,000',
      'Cross-check with ticks: 0.04 = 8 ticks of 12.50, i.e. 100 per contract — same result',
    ],
    pointsAttendus: [
      'Le réflexe avant tout calcul : convertir le mouvement de prix en mouvement de taux — +0,04 de prix = −4 points de base de taux (3,50 % vers 3,46 %)',
      'Le sens de la position : short de futures de taux = pari sur la hausse des taux (ou couverture d\'emprunteur) — les taux ont baissé, donc perte',
      'La valeur du point de base : 25 € sur l\'Euribor 3 mois (1 M€ × 0,0001 × 0,25)',
      'Le calcul : −4 pb × 25 € × 40 contrats = −4 000 €',
      'Le contrôle par le tick : 0,04 = 8 ticks de 0,005 valant 12,50 € chacun, soit 100 € par contrat, fois 40 = 4 000 € — au débit',
      'La mécanique de règlement : ce P&L n\'attend pas l\'échéance — il est débité le soir même par la marge de variation',
    ],
    pointsAttendusEn: [
      'The reflex before any computation: convert the price move into a rate move — +0.04 in price = −4 basis points in rate (3.50% to 3.46%)',
      'The position\'s direction: short rate futures = a bet on rising rates (or a borrower\'s hedge) — rates fell, hence a loss',
      'The basis point value: €25 on 3-month Euribor (€1m × 0.0001 × 0.25)',
      'The computation: −4 bp × €25 × 40 contracts = −€4,000',
      'The tick cross-check: 0.04 = 8 ticks of 0.005 worth €12.50 each, i.e. €100 per contract, times 40 = €4,000 — debited',
      'The settlement mechanics: this P&L does not wait for expiry — it is debited that very evening through variation margin',
    ],
    bonus: [
      'La question retournée : qui est short 40 contrats ? Typiquement une trésorière couvrant environ 40 M€ d\'emprunt à 3 mois — sa « perte » sur les futures compense un taux d\'emprunt devenu plus bas : le hedge fait exactement son travail',
      'La précision de desk : annoncer le P&L avec son signe et son canal de règlement (« −4 000 €, débités ce soir en marge de variation ») — c\'est ce niveau de précision qui distingue',
    ],
    bonusEn: [
      'The question turned around: who is short 40 contracts? Typically a treasurer hedging about €40m of 3-month borrowing — her futures "loss" offsets a now-lower borrowing rate: the hedge is doing exactly its job',
      'Desk-level precision: state the P&L with its sign and settlement channel ("−€4,000, debited tonight as variation margin") — that level of precision is what distinguishes',
    ],
    reponseModele: `Moins 4 000 euros — et voici le chemin, parce que le signe est tout le sujet. Premier réflexe, toujours : **traduire le prix en taux**. La convention est prix = 100 − taux : à 96,50, le taux implicite valait 3,50 % ; à 96,54, il vaut 3,46 %. Le prix a monté de 4 centièmes parce que les taux ont **baissé** de 4 points de base.

Deuxième temps, ma position : short de futures de taux, je gagne quand le prix baisse — donc quand les taux montent. C'est l'emprunteur qui se couvre, ou le spéculateur haussier taux. Ici, les taux ont baissé : mauvais côté.

Troisième temps, le chiffrage. Sur l'Euribor 3 mois — notionnel 1 M€, période d'un quart d'année — le point de base vaut 1 000 000 × 0,0001 × 0,25 = 25 €. Mon P&L : 4 points de base × 25 € × 40 contrats = 4 000 €, au débit : **−4 000 €**. Contrôle par le tick, pour verrouiller : 0,04, c'est 8 ticks de 0,005 valant 12,50 € chacun — 100 € par contrat, fois 40 : même chiffre.

Et la précision professionnelle : ce P&L n'attend pas l'échéance — débité **ce soir**, en marge de variation.

Si je suis une trésorière couvrant 40 M€ d'emprunt futur, ce débit n'est d'ailleurs pas une défaite : en face, mon taux d'emprunt a baissé d'autant. Le hedge fait exactement son travail.`,
    reponseModeleEn: `Minus 4,000 euros — and here is the path, because the sign is the whole point. First reflex, always: **translate price into rate**. The convention is price = 100 − rate: at 96.50, the implied rate was 3.50%; at 96.54, it is 3.46%. The price rose four hundredths because rates **fell** by 4 basis points.

Second step, my position\'s direction: short rate futures, I gain when the price falls — hence when rates rise. That is the hedging borrower\'s position, or the rate bull\'s. Here, rates fell: I am on the wrong side.

Third step, the numbers. On 3-month Euribor — €1m notional, a quarter-year period — the basis point is worth 1,000,000 × 0.0001 × 0.25 = €25. My P&L: 4 basis points × €25 × 40 contracts = €4,000, debited: **−€4,000**. Tick cross-check, to lock it in: 0.04 is 8 ticks of 0.005 worth €12.50 each — €100 per contract, times 40: same figure.

And the precision that sounds professional: this P&L does not wait for expiry — it will be debited **tonight**, as variation margin, by the clearing house.

If I am a treasurer hedging €40m of future borrowing, that debit is no defeat anyway: on the other side, my borrowing rate just fell by as much. The hedge is doing exactly its job.`,
  },
  {
    id: 'm7-j-15',
    moduleId: M7,
    theme: 'FRA et futures de taux',
    themeEn: 'FRAs and short-term rate futures',
    difficulte: 3,
    question: 'FRA et futures de taux protègent du même risque. Pourquoi deux instruments — et pourquoi l\'emprunteur est-il long de l\'un mais vendeur de l\'autre ?',
    questionEn: 'FRAs and rate futures protect against the same risk. Why two instruments — and why is the borrower long one but a seller of the other?',
    plan: [
      'Poser l\'équivalence économique : les deux gèlent aujourd\'hui un taux futur — le même taux forward, sorti de la même courbe',
      'Opposer les habits : gré à gré sur mesure contre standardisé en bourse — chambre, marges, liquidité',
      'Expliquer le miroir des sens : le FRA cote en taux (le long gagne à la hausse), le futures cote en prix = 100 − taux (le vendeur gagne à la hausse)',
      'Nuancer en trésorier : règlement unique au fixing contre marges quotidiennes — la trésorerie et la base font la vraie différence',
    ],
    planEn: [
      'State the economic equivalence: both freeze a future rate today — the same forward rate, out of the same curve',
      'Contrast the clothing: tailor-made OTC versus standardised exchange-traded — clearing house, margins, liquidity',
      'Explain the mirrored directions: the FRA quotes in rate (the long gains on a rise), the future quotes in price = 100 − rate (the seller gains on a rise)',
      'Qualify as a treasurer: single settlement at fixing versus daily margins — cash flow and basis make the real difference',
    ],
    pointsAttendus: [
      'Économiquement le même objet : geler le taux forward de la courbe sur une période future — un FRA et le futures de l\'échéance correspondante pricent le même taux',
      'Le FRA : gré à gré, sur mesure (montant et dates exacts du besoin), un seul règlement actualisé au fixing — et un risque de contrepartie bilatéral, encadré depuis 2008',
      'Le futures : standardisé (1 M€, échéances trimestrielles, tick), chambre de compensation et marges quotidiennes, position retournable à tout instant dans le carnet',
      'Le miroir des conventions : long FRA = payeur du fixe = gagne à la hausse des taux ; sur le futures, prix = 100 − taux, donc c\'est le VENDEUR qui gagne à la hausse — deux habits, une même protection',
      'Le prix de la standardisation : dates et montants ronds — la couverture futures laisse une base entre le taux du contrat et l\'emprunt réel ; le sur-mesure du FRA l\'élimine',
      'La différence de trésorerie : le futures encaisse et décaisse chaque soir (appels de marge), le FRA règle en une fois au fixing — un hedge en futures peut coûter du cash en chemin',
    ],
    pointsAttendusEn: [
      'Economically the same object: freezing the curve\'s forward rate over a future period — a FRA and the matching futures expiry price the same rate',
      'The FRA: OTC, tailor-made (the exact amount and dates of the need), one discounted settlement at fixing — and bilateral counterparty risk, framed since 2008',
      'The future: standardised (€1m, quarterly expiries, tick), clearing house and daily margins, a position reversible at any moment in the book',
      'The convention mirror: long FRA = fixed payer = gains on rising rates; on the future, price = 100 − rate, so the SELLER gains on the rise — two outfits, one protection',
      'The price of standardisation: round dates and amounts — a futures hedge leaves a basis between the contract rate and the actual loan; the FRA\'s tailoring removes it',
      'The cash flow difference: the future pays and collects every evening (margin calls), the FRA settles once at fixing — a futures hedge can cost cash along the way',
    ],
    bonus: [
      'Le raffinement de pricing : sur les échéances lointaines, futures et FRA ne cotent pas exactement le même taux — le biais de convexité, lié au placement des marges quotidiennes',
      'La note de modernité : la mort du Libor a fait reculer le FRA classique au profit des futures et swaps SOFR/€STR, backward-looking — les conventions changent, l\'arithmétique du forward reste',
    ],
    bonusEn: [
      'The pricing refinement: on distant expiries, futures and FRAs do not quote exactly the same rate — the convexity bias, tied to the reinvestment of daily margins',
      'The modernity note: Libor\'s death pushed the classic FRA back in favour of SOFR/€STR futures and swaps, backward-looking — conventions change, forward arithmetic stays',
    ],
    reponseModele: `Économiquement, c'est le même animal : geler aujourd'hui un taux qui n'existe pas encore — et les deux instruments pricent le **même taux forward**, sorti de la même courbe. Tout le reste est affaire d'habit — et l'habit compte.

Le **FRA** est du sur-mesure de gré à gré : montant exact, dates exactes, un seul règlement — le différentiel actualisé, payé au fixing. Le **futures** est son cousin standardisé : 1 M€, échéances trimestrielles, tick imposé — en échange, chambre de compensation, marges quotidiennes, position retournable à tout instant. L'arbitrage permanent du module : le sur-mesure contre la sécurité et la liquidité.

Le miroir des sens, maintenant — le piège favori des jurys. Le FRA cote **en taux** : le long, payeur du fixe, gagne quand les taux montent — c'est l'emprunteur couvert. Le futures cote **en prix**, par la convention 100 − taux : quand les taux montent, le prix baisse — c'est donc le *vendeur* qui gagne. Le même emprunteur est long du FRA et vendeur du futures : deux conventions, une seule protection.

La vraie différence, je la dirais en trésorier : le futures règle son P&L **chaque soir** — un hedge peut exiger du cash en chemin — et sa standardisation laisse une **base** entre le contrat et mon emprunt réel. Le FRA épouse mon besoin et règle en une fois.

La chute : même taux, deux disciplines — on choisit selon sa trésorerie et son besoin de précision, pas selon le prix.`,
    reponseModeleEn: `Economically, it is the same animal: freezing today a rate that does not yet exist — and both instruments price the **same forward rate**, out of the same curve. Everything else is institutional clothing, and the clothing matters.

The **FRA** is tailor-made OTC: the exact amount, the exact dates of my need, one single settlement — the discounted differential, paid at fixing. The **future** is its standardised cousin: €1m notional, quarterly expiries, an imposed tick — in exchange, a clearing house, daily margins, and liquidity that lets you reverse the position at any moment. It is the module\'s permanent trade-off: tailoring versus safety and liquidity.

Now the mirror of directions — the jury\'s favourite trap. The FRA quotes **in rate**: the long, the fixed payer, gains when rates rise — that is the hedged borrower. The future quotes **in price**, through the 100 − rate convention: when rates rise, the price falls — so it is the *seller* who gains. The same borrower is long the FRA and a seller of futures: two conventions, one protection.

The real difference I would state as a treasurer: the future settles its P&L **every evening** — a hedge can demand cash along the way — and its standardisation leaves a **basis** between the contract and my actual loan. The FRA fits my need exactly and settles once.

Hence the closing line: same rate, two disciplines — you pick the instrument on cash flow and precision, not on price.`,
  },
  {
    id: 'm7-j-16',
    moduleId: M7,
    theme: 'le swap de taux',
    themeEn: 'the interest rate swap',
    difficulte: 1,
    question: 'Dans un swap de taux, qu\'est-ce qui s\'échange — au juste ?',
    questionEn: 'In an interest rate swap, what exactly is exchanged?',
    plan: [
      'Définir : deux jambes d\'intérêts calculées sur un même notionnel — un taux fixe contre un taux variable, à dates régulières',
      'Marteler le point clé : le notionnel n\'est JAMAIS échangé — c\'est une assiette de calcul ; en pratique, seul le net change de mains',
      'Situer la généalogie : une chaîne de FRA mis bout à bout — fixer un taux période après période, pendant des années',
      'Donner le vocabulaire de salle : payeur fixe, receveur fixe — « payer le swap », c\'est payer le fixe',
    ],
    planEn: [
      'Define: two legs of interest computed on the same notional — a fixed rate against a floating rate, at regular dates',
      'Hammer the key point: the notional is NEVER exchanged — it is a calculation base; in practice only the net changes hands',
      'Place the genealogy: a chain of FRAs laid end to end — fixing a rate period after period, for years',
      'Give the trading floor vocabulary: fixed payer, fixed receiver — "paying the swap" means paying fixed',
    ],
    pointsAttendus: [
      'Des flux d\'intérêts, rien d\'autre : une jambe fixe (le même coupon à chaque date, défini à la signature) contre une jambe variable (le taux constaté période après période — Euribor, et de plus en plus €STR ou SOFR composés)',
      'Le notionnel sert d\'assiette et ne circule jamais — ni au départ, ni à l\'échéance : sur un swap de 100 M€, aucun flux ne contient 100 M€',
      'À chaque date commune, seul le NET des deux montants change de mains',
      'La généalogie qui éclaire tout : un swap est économiquement une chaîne de FRA bout à bout — 0×6, 6×12, 12×18… sur un même notionnel',
      'Le vocabulaire : le payeur fixe paie le fixe et reçoit le variable ; le receveur fixe fait l\'inverse ; par convention de salle, « payer le swap » = payer le fixe',
      'La frontière à connaître : dans le cross-currency swap, au contraire, les notionnels SONT échangés — au départ et à l\'échéance',
    ],
    pointsAttendusEn: [
      'Interest flows, nothing else: a fixed leg (the same coupon at each date, set at signing) against a floating leg (the rate observed period after period — Euribor, and increasingly compounded €STR or SOFR)',
      'The notional is a calculation base and never moves — neither at the start nor at maturity: on a €100m swap, no cash flow contains €100m',
      'At each common date, only the NET of the two amounts changes hands',
      'The genealogy that lights everything: a swap is economically a chain of FRAs end to end — 0×6, 6×12, 12×18… on the same notional',
      'The vocabulary: the fixed payer pays fixed and receives floating; the fixed receiver does the reverse; by floor convention, "paying the swap" = paying fixed',
      'The frontier to know: in the cross-currency swap, by contrast, the notionals ARE exchanged — at the start and at maturity',
    ],
    bonus: [
      'Les trois usages canoniques en une ligne chacun : le corporate fixe le coût de sa dette variable, l\'assureur pilote sa duration sans acheter un titre, le macro-trader prend du directionnel taux sans capital immobilisé',
      'L\'ordre de grandeur qui situe : les dérivés de taux dominent le gré à gré mondial — de l\'ordre des trois quarts des notionnels —, swaps en tête : l\'instrument de taux le plus traité au monde',
    ],
    bonusEn: [
      'The three canonical uses in one line each: the corporate fixes the cost of its floating debt, the insurer steers its duration without buying a single bond, the macro trader takes rates exposure with no capital tied up',
      'The order of magnitude that frames it: rates derivatives dominate global OTC — around three quarters of notionals — swaps first: the most traded rates instrument in the world',
    ],
    reponseModele: `Des intérêts — et seulement des intérêts. Un swap de taux est un contrat par lequel deux parties s'échangent, à dates régulières et pendant une durée convenue, des flux d'intérêts calculés sur un même montant de référence : l'une paie un taux **fixe**, défini à la signature et identique à chaque échéance ; l'autre paie un taux **variable**, constaté période après période — l'Euribor historiquement, de plus en plus les taux au jour le jour composés, €STR ou SOFR.

Le point à marteler, parce qu'il commande tout le reste : le **notionnel n'est jamais échangé**. Ni au départ, ni à l'échéance. Sur un swap de 100 M€, aucune case du tableau de flux ne contient 100 M€ : le notionnel n'est qu'une assiette de calcul. Et en pratique, à chaque date commune, seul le **net** des deux montants change de mains.

La généalogie éclaire l'objet : un swap est économiquement une **chaîne de FRA** mis bout à bout — fixer un taux non pas sur une période, mais sur dix ou vingt périodes consécutives, en un seul contrat. C'est ce qui en fait l'instrument de taux le plus traité au monde.

Le vocabulaire de salle pour finir : le **payeur fixe** paie le fixe et reçoit le variable ; le receveur fixe fait l'inverse — et « payer le swap », par convention, c'est payer le fixe.

Une frontière en réserve : dans le swap de devises, les notionnels, eux, s'échangent réellement — autre question, autre risque.`,
    reponseModeleEn: `Interest — and only interest. An interest rate swap is a contract through which two parties exchange, at regular dates and for an agreed duration, interest flows computed on the same reference amount: one pays a **fixed** rate, set at signing and identical at every date; the other pays a **floating** rate, observed period after period — historically Euribor, increasingly compounded overnight rates, €STR or SOFR.

The point to hammer, because everything else follows from it: the **notional is never exchanged**. Not at the start, not at maturity. On a €100m swap, no cell of the cash flow table contains €100m: the notional is only a calculation base. And in practice, at each common date, only the **net** of the two amounts changes hands.

The genealogy lights up the object: a swap is economically a **chain of FRAs** laid end to end — fixing a rate not over one period, but over ten or twenty consecutive periods, in a single contract. That is what makes it the most traded rates instrument in the world.

Floor vocabulary to finish: the **fixed payer** pays fixed and receives floating; the fixed receiver does the reverse — and "paying the swap", by convention, means paying fixed.

One frontier in reserve, if you push me: in the currency swap, the notionals really are exchanged. That is another question — and another risk.`,
  },
  {
    id: 'm7-j-17',
    moduleId: M7,
    theme: 'le swap de taux',
    themeEn: 'the interest rate swap',
    difficulte: 2,
    question: 'Qui gagne quand les taux montent : le payeur ou le receveur du fixe ? Expliquez-moi sans formule.',
    questionEn: 'Who gains when rates rise: the fixed payer or the fixed receiver? Explain without a formula.',
    plan: [
      'Répondre net : le payeur du fixe — puis donner deux intuitions, aucune algèbre',
      'Intuition 1, par le contrat : son fixe est gravé dans le marbre — quand le marché exige plus cher, son ancien prix devient un privilège',
      'Intuition 2, par les flux : il encaisse un variable qui grossit contre un débours inchangé',
      'Ancrer par l\'analogie obligataire : payer le fixe, c\'est être vendeur d\'obligation — duration négative',
    ],
    planEn: [
      'Answer squarely: the fixed payer — then give two intuitions, zero algebra',
      'Intuition 1, through the contract: his fixed rate is carved in stone — when the market demands more, his old price becomes a privilege',
      'Intuition 2, through the flows: he collects a growing floating leg against an unchanged outlay',
      'Anchor with the bond analogy: paying fixed is like being short a bond — negative duration',
    ],
    pointsAttendus: [
      'La réponse immédiate et sans détour : le payeur du fixe gagne quand les taux montent — le contresens inverse est éliminatoire',
      'Première intuition : le taux fixe est contractuel, il ne bouge plus jamais ; ce qui bouge, c\'est le taux des NOUVEAUX swaps — payer 4 % quand les nouveaux entrants paient 5 %, c\'est détenir un privilège qui se valorise',
      'Seconde intuition, par la jambe reçue : le payeur fixe encaisse un variable qui monte, contre un débours figé — l\'écart net tourne en sa faveur, échéance après échéance',
      'Le miroir : le receveur fixe gagne quand les taux baissent — c\'est la position « porteur d\'obligation »',
      'L\'analogie qui ancre tout : recevoir le fixe = détenir une obligation à taux fixe financée à taux variable (duration longue) ; payer le fixe = l\'avoir vendue (duration négative)',
      'La cohérence transversale du module : long FRA, vendeur de futures de taux, payeur fixe de swap — trois habits du même camp, celui qui gagne à la hausse des taux',
    ],
    pointsAttendusEn: [
      'The immediate, direct answer: the fixed payer gains when rates rise — the reverse misreading is disqualifying',
      'First intuition: the fixed rate is contractual, it never moves again; what moves is the rate on NEW swaps — paying 4% when new entrants pay 5% is holding a privilege that gains value',
      'Second intuition, through the received leg: the fixed payer collects a rising floating rate against a frozen outlay — the net gap turns in his favour, date after date',
      'The mirror: the fixed receiver gains when rates fall — that is the "bondholder" position',
      'The anchoring analogy: receiving fixed = holding a fixed-rate bond funded at floating (long duration); paying fixed = having sold it (negative duration)',
      'The module-wide consistency: long FRA, seller of rate futures, fixed payer of a swap — three outfits of the same camp, the one that wins when rates rise',
    ],
    bonus: [
      'Le chiffre en réserve si le jury pousse : payer un fixe de 5 % quand la courbe est plate à 4 % coûte 2,775 M€ par tranche de 100 M€ sur 3 ans — le privilège, en valeur actualisée',
      'Le vocabulaire de desk : la sensibilité du swap se résume en DV01 — la valeur gagnée ou perdue par point de base de mouvement de courbe',
    ],
    bonusEn: [
      'The figure in reserve if the jury pushes: paying a 5% fixed rate when the curve is flat at 4% costs €2.775m per €100m over 3 years — the privilege, in present value',
      'Desk vocabulary: the swap\'s sensitivity is summed up in DV01 — the value gained or lost per basis point of curve move',
    ],
    reponseModele: `Le **payeur du fixe** — sans hésitation, car l'inverse est le contresens qui élimine. Et je peux le démontrer sans une ligne d'algèbre, par deux chemins.

Premier chemin, le contrat. Mon taux fixe est gravé dans le marbre à la signature : il ne bougera plus jamais. Ce qui bouge, c'est le prix des **nouveaux** swaps — le taux que mes concurrents doivent accepter aujourd'hui. Si les taux montent, je paie 4 % quand les nouveaux entrants paient 5 % : mon ancien prix est devenu un privilège, et un privilège se valorise. C'est exactement le locataire au loyer bloqué dans une ville où les loyers flambent.

Second chemin, les flux. Je paie du fixe, je reçois du variable. Quand les taux montent, ma jambe reçue grossit, échéance après échéance, pendant que mon débours ne change pas d'un centime : l'écart net tourne en ma faveur.

L'ancrage qui relie tout au module obligataire : recevoir le fixe, c'est détenir une obligation à taux fixe financée à taux variable — une duration longue, qui souffre à la hausse des taux. Payer le fixe, c'est l'avoir **vendue** : une duration négative, qui en profite.

Et la cohérence d'ensemble, pour finir : long d'un FRA, vendeur de futures Euribor, payeur fixe d'un swap — trois habits du même camp, celui qui gagne quand les taux montent. Si je me trompe sur l'un, je me trompe sur les trois.`,
    reponseModeleEn: `The **fixed payer** — without hesitation, because the reverse is the misreading that disqualifies. And I can prove it without one line of algebra, by two paths.

First path, the contract. My fixed rate is carved in stone at signing: it will never move again. What moves is the price of **new** swaps — the rate my competitors must accept today. If rates rise, I pay 4% while new entrants pay 5%: my old price has become a privilege, and a privilege gains value. It is exactly the tenant with a frozen rent in a city where rents are soaring.

Second path, the flows. I pay fixed, I receive floating. When rates rise, my received leg grows, date after date, while my outlay does not change by one cent: the net gap turns in my favour.

The anchor that ties it back to the bond module: receiving fixed is holding a fixed-rate bond funded at floating — long duration, which suffers when rates rise. Paying fixed is having **sold** it: negative duration, which benefits.

And the overall consistency, to finish: long a FRA, seller of Euribor futures, fixed payer of a swap — three outfits of the same camp, the one that wins when rates rise. If I get one wrong, I get all three wrong.`,
  },
  {
    id: 'm7-j-18',
    moduleId: M7,
    theme: 'le swap de taux',
    themeEn: 'the interest rate swap',
    difficulte: 3,
    question: 'Comment pricez-vous un swap sans prévoir un seul taux futur ?',
    questionEn: 'How do you price a swap without forecasting a single future rate?',
    plan: [
      'Lever le paradoxe : les flux variables sont inconnus, mais leur VALEUR est connue',
      'Idée 1 : ajouter fictivement le notionnel des deux côtés — la jambe variable plus notionnel vaut le pair à chaque fixing',
      'Idée 2 : la jambe fixe plus notionnel est une obligation — le taux paritaire est le coupon qui la met au pair',
      'Chiffrer : courbe 3 / 3,5 / 4, taux paritaire 3,9738 % — et le cas limite : courbe plate, paritaire égal au taux plat',
    ],
    planEn: [
      'Lift the paradox: the floating flows are unknown, but their VALUE is known',
      'Idea 1: fictitiously add the notional on both sides — floating leg plus notional is worth par at every fixing',
      'Idea 2: fixed leg plus notional is a bond — the par swap rate is the coupon that puts it at par',
      'Quantify: curve 3 / 3.5 / 4, par rate 3.9738% — and the limit case: flat curve, par rate equals the flat rate',
    ],
    pointsAttendus: [
      'L\'astuce fondatrice : ajouter fictivement le notionnel à l\'échéance des deux jambes ne change rien au swap — mais chaque jambe devient une obligation',
      'Jambe variable + notionnel = un placement monétaire roulé, qui sert à chaque période le taux du marché : personne ne le paierait ni plus ni moins que son nominal — il vaut le pair à chaque date de fixing',
      'Conséquence magique : pricer un swap n\'exige aucune prévision de taux — la jambe variable est connue en valeur, il ne reste qu\'à valoriser la jambe fixe',
      'Jambe fixe + notionnel = une obligation de coupon C : valeur = C × somme des facteurs d\'actualisation + notionnel actualisé, sur la courbe zéro',
      'Le taux paritaire : C* = (1 − df_n)/Σ df — le coupon qui amortit exactement la décote du notionnel actualisé ; sur la courbe 3 / 3,5 / 4 : df = 0,970874, 0,933511, 0,888996, d\'où C* = 0,111004/2,793381 = 3,9738 %',
      'Les deux contrôles : courbe plate à r, le paritaire vaut r exactement ; le paritaire est une moyenne pondérée de la courbe, tirée vers les piliers longs',
    ],
    pointsAttendusEn: [
      'The founding trick: fictitiously adding the notional at maturity on both legs changes nothing in the swap — but each leg becomes a bond',
      'Floating leg + notional = a rolled money market investment, paying the market rate each period: nobody would pay more or less than its face value — it is worth par at every fixing date',
      'The magical consequence: pricing a swap requires no rate forecast — the floating leg is known in value, only the fixed leg remains to be valued',
      'Fixed leg + notional = a bond with coupon C: value = C × sum of discount factors + discounted notional, on the zero curve',
      'The par rate: C* = (1 − df_n)/Σ df — the coupon that exactly amortises the discounted notional\'s decay; on the 3 / 3.5 / 4 curve: df = 0.970874, 0.933511, 0.888996, hence C* = 0.111004/2.793381 = 3.9738%',
      'The two checks: on a flat curve at r, the par rate is exactly r; the par rate is a weighted average of the curve, pulled towards the long pillars',
    ],
    bonus: [
      'La précision de convention : facteurs d\'actualisation en composition annuelle au-delà d\'un an — df = 1/(1,04)² = 0,924556 pour 4 % à 2 ans — cohérent avec le monde obligataire',
      'La nuance de vie du contrat : la jambe variable vaut le pair AUX dates de fixing — entre deux fixings, elle s\'en écarte légèrement',
    ],
    bonusEn: [
      'The convention precision: discount factors compounded annually beyond one year — df = 1/(1.04)² = 0.924556 for 4% at 2 years — consistent with the bond world',
      'The contract-life nuance: the floating leg is worth par AT fixing dates — between two fixings, it drifts slightly away',
    ],
    reponseModele: `Le paradoxe n'est qu'apparent : je n'ai pas besoin de connaître les flux variables — seulement leur **valeur**. Et elle est connue.

L'astuce fondatrice : j'ajoute fictivement le notionnel à l'échéance des deux jambes. Cela ne change rien au swap — le même montant s'ajoute des deux côtés — mais chaque jambe devient une obligation. Or « jambe variable plus notionnel » est un **placement monétaire roulé** : à chaque fixing, il sert le taux du marché. Personne ne le paierait ni plus ni moins que son nominal : il vaut **le pair** à chaque fixing. Voilà la magie : la moitié incertaine du swap se valorise sans prévoir un seul taux.

Reste la jambe fixe : avec le notionnel, une obligation de coupon C — C fois la somme des facteurs d'actualisation, plus le notionnel actualisé, sur la courbe zéro. Le **taux paritaire** est le coupon qui met cette obligation au pair — donc le swap à valeur nulle : C* = (1 − df_n)/Σ df, le coupon qui amortit exactement la décote du notionnel.

Chiffrons sur la courbe 3 / 3,5 / 4 % : les facteurs valent 0,970874, 0,933511 et 0,888996 — d'où C* = 0,111004/2,793381 = **3,9738 %**. Deux contrôles : courbe plate à 4 %, le paritaire vaut 4 % exactement ; et le paritaire est une moyenne pondérée de la courbe, tirée vers les piliers longs.

La chute : le swap se price comme tout le module — par fabrication, jamais par prophétie.`,
    reponseModeleEn: `The paradox is only apparent: I do not need to know the floating flows — only their **value**. And that is known.

The founding trick: I fictitiously add the notional at maturity on both legs. It changes nothing in the swap — the same amount is added on both sides — but each leg becomes a bond. Now "floating leg plus notional" is a **rolled money market investment**: at each fixing, it pays the market rate. Nobody would pay more or less than face value: it is worth **par** at every fixing. There is the magic: the uncertain half of the swap is valued without forecasting a single rate.

The fixed leg remains: with the notional, it is a bond with coupon C, worth C times the sum of discount factors, plus the discounted notional, all read off the zero curve. The **par swap rate** is the coupon that puts this bond at par — hence the swap at zero value: C* = (1 − df_n)/Σ df, the coupon that exactly amortises the notional\'s discount decay.

Put numbers on the 3 / 3.5 / 4% curve: the factors are 0.970874, 0.933511 and 0.888996 — hence C* = 0.111004/2.793381 = **3.9738%**. Two checks keep me honest: on a flat 4% curve, the par rate is exactly 4%; and the par rate is a weighted average of the curve, pulled towards the long pillars.

The closing line: a swap is priced like everything in this module — by manufacturing, never by prophecy.`,
  },
  {
    id: 'm7-j-19',
    moduleId: M7,
    theme: 'le swap de taux',
    themeEn: 'the interest rate swap',
    difficulte: 3,
    question: 'Vous payez le fixe à 5 % sur 100 M€ ; il reste trois ans et la courbe est aujourd\'hui plate à 4 %. Que vaut votre swap ?',
    questionEn: 'You pay fixed at 5% on €100m; three years remain and the curve is now flat at 4%. What is your swap worth?',
    plan: [
      'Diagnostiquer : sur courbe plate à 4 %, le paritaire vaut 4 % — je paie 1 % de trop sur le notionnel, soit 1 M€ par an pendant trois ans',
      'Actualiser : −1 M€ × (0,961538 + 0,924556 + 0,888996) = −2,775091 M€',
      'Interpréter : c\'est le mark-to-market — la soulte que la banque réclamerait pour déboucler aujourd\'hui',
      'Généraliser : valeur du payeur fixe = notionnel (jambe variable au pair) − jambe fixe ; nulle au paritaire, positive si les taux remontent',
    ],
    planEn: [
      'Diagnose: on a flat 4% curve, the par rate is 4% — I overpay 1% of notional, i.e. €1m a year for three years',
      'Discount: −1m × (0.961538 + 0.924556 + 0.888996) = −2.775091m',
      'Interpret: this is the mark-to-market — the unwind payment the bank would demand today',
      'Generalise: fixed payer\'s value = notional (floating leg at par) − fixed leg; zero at the par rate, positive if rates climb back',
    ],
    pointsAttendus: [
      'Le diagnostic : sur une courbe plate, le taux paritaire égale le taux plat — 4 % ; payer 5 %, c\'est surpayer 100 points de base sur le notionnel, 1 M€ par an pendant trois ans',
      'L\'actualisation obligatoire : df = 0,961538, 0,924556, 0,888996, somme 2,775091 — V = −1 × 2,775091 = −2,775091 M€ ; répondre « −3 M€ » confond une somme de flux futurs avec une valeur d\'aujourd\'hui',
      'La méthode générale qui retrouve le chiffre : valeur du payeur fixe = notionnel − valeur de la jambe fixe = 100 − 102,775091 — la jambe variable vaut le pair, la jambe fixe est une obligation à 5 % sur courbe à 4 %',
      'La lecture : ce mark-to-market est la soulte de débouclage — ce que la banque me réclamerait pour sortir aujourd\'hui ; en face, le receveur fixe a exactement +2,775091 M€ : somme nulle',
      'Le rappel d\'orientation : le swap valait zéro à la signature ; les taux ont baissé, donc le payeur fixe a perdu — et si la courbe remontait au-dessus de 5 %, la valeur redeviendrait positive',
      'La symétrie de contrôle : payer un fixe de 3 % sur la même courbe vaudrait +2,775091 M€',
    ],
    pointsAttendusEn: [
      'The diagnosis: on a flat curve, the par rate equals the flat rate — 4%; paying 5% means overpaying 100 basis points on the notional, €1m a year for three years',
      'The mandatory discounting: df = 0.961538, 0.924556, 0.888996, sum 2.775091 — V = −1 × 2.775091 = −€2.775091m; answering "−€3m" confuses a sum of future flows with a value today',
      'The general method that recovers the figure: fixed payer\'s value = notional − fixed leg value = 100 − 102.775091 — the floating leg is worth par, the fixed leg is a 5% bond on a 4% curve',
      'The reading: this mark-to-market is the unwind payment — what the bank would charge me to exit today; opposite me, the fixed receiver holds exactly +€2.775091m: zero-sum',
      'The orientation reminder: the swap was worth zero at signing; rates fell, so the fixed payer lost — and if the curve climbed back above 5%, the value would turn positive again',
      'The control symmetry: paying a 3% fixed rate on the same curve would be worth +€2.775091m',
    ],
    bonus: [
      'La conséquence opérationnelle : c\'est cette valeur, recalculée chaque jour, qui se collatéralise — marge de variation en chambre, ou CSA en bilatéral',
      'Le langage de desk : la position se résume en DV01 — payer le fixe = duration négative : chaque point de base de baisse coûte, chaque point de base de hausse rapporte',
    ],
    bonusEn: [
      'The operational consequence: this value, recomputed daily, is what gets collateralised — variation margin at the clearing house, or CSA bilaterally',
      'Desk language: the position is summed up in DV01 — paying fixed = negative duration: every basis point of decline costs, every basis point of rise pays',
    ],
    reponseModele: `Il vaut **−2,775091 M€** pour moi — et voici le raisonnement en trois temps.

Le diagnostic d'abord. Sur une courbe plate, le taux paritaire égale le taux plat : les swaps neufs se signent aujourd'hui à 4 %. Moi, je me suis engagé à payer 5 % : je surpaie **100 points de base sur le notionnel**, soit 1 M€ par an, pendant encore trois ans. Mon malheur tient dans ces trois flux.

L'actualisation ensuite — le geste qui sépare une somme de flux d'une valeur. Les facteurs valent 0,961538, 0,924556 et 0,888996, somme 2,775091 : V = −1 M€ × 2,775091 = **−2,775091 M€**. Répondre « moins trois millions » serait la faute classique : confondre des flux futurs avec une valeur d'aujourd'hui.

Le contrôle par la méthode générale, enfin : la jambe variable vaut le pair — 100 — et ma jambe fixe est une obligation à 5 % sur une courbe à 4 %, qui vaut 102,775091. Valeur du payeur fixe : 100 − 102,775091 — même chiffre, par construction.

La lecture professionnelle : c'est mon mark-to-market — la soulte que ma banque me réclamerait pour déboucler aujourd'hui, et la valeur qui se collatéralise chaque jour. En face, le receveur fixe détient exactement +2,775091 M€ : somme nulle, comme tout le module. Et l'histoire continue : le swap valait zéro à la signature, les taux ont baissé contre moi — qu'ils remontent au-dessus de 5 %, la même mécanique me remet dans le vert.`,
    reponseModeleEn: `It is worth **−€2.775091m** to me — and here is the reasoning in three steps.

The diagnosis first. On a flat curve, the par rate equals the flat rate: new swaps are signed today at 4%. I committed to paying 5%: I overpay **100 basis points on the notional**, that is €1m a year, for three more years. My misfortune is entirely summed up in those three flows.

Then the discounting — the gesture that separates a sum of flows from a value. The factors are 0.961538, 0.924556 and 0.888996, summing to 2.775091: V = −€1m × 2.775091 = **−€2.775091m**. Answering "minus three million" would be the classic mistake: confusing future flows with a value today.

Finally the check through the general method: the floating leg is worth par — 100 — and my fixed leg is a 5% bond on a 4% curve, worth 102.775091. Fixed payer\'s value: 100 − 102.775091 — same figure, by construction.

The professional reading: this is my mark-to-market — the unwind payment my bank would charge me to exit today, and the value that gets collateralised daily. Opposite me, the fixed receiver holds exactly +€2.775091m: zero-sum, like the whole module. And the story is not over: the swap was worth zero at signing, rates fell against me — let them climb back above 5%, and the same mechanics put me back in the green.`,
  },
  {
    id: 'm7-j-20',
    moduleId: M7,
    theme: 'le swap de taux',
    themeEn: 'the interest rate swap',
    difficulte: 4,
    question: 'Un swap de taux est-il un pari ?',
    questionEn: 'Is an interest rate swap a bet?',
    plan: [
      'Refuser le binaire : l\'instrument est neutre — l\'intention ne se lit pas dans le contrat',
      'Montrer le swap-couverture : le corporate qui fixe son coût, l\'assureur qui cale sa duration — une réduction de risque mesurable',
      'Montrer le swap-pari : le macro-trader payeur fixe sans exposition en face — le même contrat crée du risque',
      'Conclure : la question professionnelle porte sur la position globale du signataire — et le marché a besoin des deux camps',
    ],
    planEn: [
      'Refuse the binary: the instrument is neutral — intent cannot be read in the contract',
      'Show the swap as hedge: the corporate fixing its cost, the insurer matching its duration — a measurable risk reduction',
      'Show the swap as bet: the macro trader paying fixed with no exposure behind it — the same contract creates risk',
      'Conclude: the professional question is about the signer\'s overall position — and the market needs both camps',
    ],
    pointsAttendus: [
      'Le point de maturité : aucune case « motif » dans une confirmation de swap — le même contrat est couverture ou pari selon le bilan de celui qui le signe',
      'Le swap-couverture : l\'entreprise endettée à Euribor + marge paie le fixe, reçoit l\'Euribor qui rembourse celui de son crédit — son coût devient fixe sans renégocier sa dette : le risque global BAISSE',
      'L\'autre couverture : l\'assureur reçoit le fixe pour allonger la duration de son bilan sans acheter une obligation — l\'outil de la gestion actif-passif',
      'Le swap-pari : payer le fixe sans dette en face, c\'est vendre les taux à découvert sans emprunter un titre ni immobiliser de capital — une exposition pure, créée de rien',
      'La défense du spéculateur : sa présence donne au hedger une contrepartie à toute heure — le transfert de risque exige un preneur',
      'La synthèse attendue : le swap n\'est pas un pari — il peut en porter un ; et la régulation post-2008 (compensation, marges, déclaration) encadre les deux usages sans les distinguer',
    ],
    pointsAttendusEn: [
      'The maturity point: there is no "motive" box in a swap confirmation — the same contract is a hedge or a bet depending on the balance sheet of whoever signs it',
      'The swap as hedge: the company indebted at Euribor + spread pays fixed, receives the Euribor that repays its loan\'s — its cost becomes fixed without renegotiating the debt: overall risk FALLS',
      'The other hedge: the insurer receives fixed to lengthen its balance sheet duration without buying a bond — the tool of asset-liability management',
      'The swap as bet: paying fixed with no debt behind it is shorting rates without borrowing a security or tying up capital — pure exposure, created from nothing',
      'The speculator\'s defence: his presence gives the hedger a counterparty at any hour — risk transfer requires a taker',
      'The expected synthesis: the swap is not a bet — it can carry one; and post-2008 regulation (clearing, margins, reporting) frames both uses without distinguishing them',
    ],
    bonus: [
      'L\'analogie de la check-list : le notionnel n\'est pas le risque, l\'instrument n\'est pas l\'intention — deux lectures de la même discipline : regarder la position, pas l\'étiquette',
      'Le parallèle assurance : l\'assurance est un « pari » sur votre incendie — c\'est l\'exposition préalable qui en fait une protection ; exactement la grille à appliquer au swap',
    ],
    bonusEn: [
      'The checklist analogy: notional is not risk, the instrument is not the intent — two readings of the same discipline: look at the position, not the label',
      'The insurance parallel: insurance is a "bet" on your house fire — the pre-existing exposure is what makes it protection; exactly the grid to apply to the swap',
    ],
    reponseModele: `La question est piégée parce qu'elle porte sur l'instrument — et que la réponse est dans la **position de celui qui le signe**. Une confirmation de swap ne comporte aucune case « motif » : le même contrat, payeur fixe contre Euribor, est une assurance chez l'un et un pari chez l'autre.

Chez le trésorier endetté à Euribor plus marge, le swap payeur fixe est l'inverse d'un pari : l'Euribor reçu rembourse celui du crédit, le coût total devient fixe sans renégocier la dette. Le risque global a **baissé** — c'est mesurable. Même logique chez l'assureur qui reçoit le fixe pour caler sa duration : de la gestion actif-passif, pas de la spéculation.

Chez le macro-trader sans exposition en face, le même contrat est un pari assumé : payer le fixe, c'est vendre les taux à découvert — sans emprunter un titre, sans immobiliser de capital. Une exposition pure, créée de rien.

Faut-il le déplorer ? Non — et c'est le point que je défendrais devant vous : le transfert de risque exige un preneur. Le spéculateur est la contrepartie disponible du hedger ; sans lui, pas de liquidité, donc pas de couverture. La régulation post-2008 l'a d'ailleurs compris : compensation obligatoire, marges, déclaration — elle encadre les deux usages sans jamais les distinguer.

Ma réponse en une phrase : **le swap n'est pas un pari — il peut en porter un**. L'intention ne se lit pas dans le contrat ; elle se lit dans le bilan.`,
    reponseModeleEn: `The question is a trap because it is about the instrument — and the answer lies in the **position of whoever signs it**. A swap confirmation has no "motive" box: the same contract, fixed payer against Euribor, is insurance for one and a bet for the other.

For the treasurer of a company indebted at Euribor plus a spread, the fixed-payer swap is the opposite of a bet: the Euribor received repays the loan\'s, and the all-in cost becomes fixed without renegotiating the debt. Overall risk has **fallen** — measurably. Same logic for the insurer receiving fixed to match its asset duration to its liabilities: asset-liability management, not speculation.

For the macro trader with no exposure behind it, the same contract is an assumed bet: paying fixed is shorting rates — without borrowing a security, without tying up capital. Pure exposure, created from nothing.

Should we deplore it? No — and that is the point I would defend in front of you: risk transfer requires a taker. The speculator is the hedger\'s available counterparty; without him, no liquidity, hence no hedging. Post-2008 regulation understood this: mandatory clearing, margins, reporting — it frames both uses without ever distinguishing them.

My one-sentence answer: **the swap is not a bet — it can carry one**. Intent cannot be read in the contract; it is read in the balance sheet.`,
  },
  {
    id: 'm7-j-21',
    moduleId: M7,
    theme: 'la famille des swaps',
    themeEn: 'the swap family',
    difficulte: 2,
    question: 'Dans quel swap le notionnel est-il réellement échangé — et pourquoi est-ce capital ?',
    questionEn: 'In which swap is the notional actually exchanged — and why does it matter so much?',
    plan: [
      'Répondre : le cross-currency swap — échange des notionnels au départ, au spot, et à l\'échéance, au même cours',
      'Opposer au swap de taux : là, le notionnel n\'est qu\'une assiette de calcul, jamais versée',
      'Donner l\'usage canonique : transformer une dette d\'une devise dans une autre — l\'émetteur européen qui lève en dollars',
      'Tirer la conséquence : à l\'échéance, c\'est un capital entier qui doit revenir — un risque de contrepartie d\'une autre ampleur',
    ],
    planEn: [
      'Answer: the cross-currency swap — notionals exchanged at the start, at spot, and at maturity, at the same rate',
      'Contrast with the interest rate swap: there, the notional is only a calculation base, never paid',
      'Give the canonical use: transforming a debt from one currency into another — the European issuer raising in dollars',
      'Draw the consequence: at maturity, a whole capital must come back — counterparty risk of a different magnitude',
    ],
    pointsAttendus: [
      'Le cross-currency swap échange les notionnels DEUX fois : au départ (vous livrez vos euros, recevez des dollars, au spot du jour) et à l\'échéance (l\'échange inverse, au même cours fixé à l\'origine)',
      'Entre les deux, chaque partie paie les intérêts de la devise qu\'elle a reçue — le contrat combine un échange de capital et un échange de taux',
      'Le contraste de jury : dans le swap de taux, le notionnel est une pure base de calcul — aucun capital ne circule, jamais',
      'L\'usage canonique : l\'entreprise européenne émet 1 Md$ à New York, livre les dollars levés, reçoit des euros, paie un taux euro, et récupère ses dollars juste à temps pour rembourser ses porteurs — sa dette dollar est devenue, flux pour flux, une dette euro',
      'La conséquence sur le risque : à l\'échéance, un capital entier doit revenir, pas un différentiel d\'intérêts — le risque de contrepartie est bien supérieur à celui d\'un swap de taux',
      'Le prix du service : la parité théorique plus le cross-currency basis — la prime, le plus souvent en faveur du dollar, qui mesure la tension mondiale sur le financement en billet vert',
    ],
    pointsAttendusEn: [
      'The cross-currency swap exchanges the notionals TWICE: at the start (you deliver your euros, receive dollars, at the day\'s spot) and at maturity (the reverse exchange, at the same rate fixed at the origin)',
      'In between, each party pays the interest of the currency it received — the contract combines a capital exchange and a rates exchange',
      'The jury contrast: in the interest rate swap, the notional is a pure calculation base and no capital ever moves',
      'The canonical use: a European company issues \\$1bn in New York, delivers the dollars raised, receives euros, pays a euro rate, and gets its dollars back just in time to repay its bondholders — its dollar debt has become, flow for flow, a euro debt',
      'The risk consequence: at maturity, an entire capital must come back, not an interest differential — counterparty risk is far higher than on an interest rate swap',
      'The price of the service: theoretical parity plus the cross-currency basis — the premium, usually in the dollar\'s favour, measuring global tension on dollar funding',
    ],
    bonus: [
      'La filiation avec le module change : le cross-currency swap est le prolongement long terme du FX swap — l\'instrument le plus traité du marché des changes',
      'La lecture de marché : c\'est sur ce marché que le basis se cote aux maturités longues — un thermomètre du stress de financement en dollars',
    ],
    bonusEn: [
      'The lineage with the FX module: the cross-currency swap is the long-term extension of the FX swap — the most traded instrument in the currency market',
      'The market reading: this is where the basis is quoted at long maturities — a thermometer of dollar funding stress',
    ],
    reponseModele: `Le **cross-currency swap** — et la frontière avec le swap de taux est exactement le genre de distinction qu'un jury teste. Dans un swap de taux, le notionnel est une pure assiette de calcul : sur 100 M€, aucun flux ne contient jamais 100 M€. Dans un swap de devises, l'échange des notionnels est **le cœur du contrat** : au départ, je livre mes euros et je reçois des dollars, au cours spot du jour ; à l'échéance, l'échange inverse, au même cours fixé dès l'origine. Entre les deux, chacun paie les intérêts de la devise qu'il a reçue.

Pourquoi capital ? Par l'usage d'abord : cet échange transforme **réellement** une dette d'une devise dans une autre. L'émettrice européenne d'un milliard de dollars à New York livre les dollars levés, reçoit des euros, paie un taux euro, et récupère ses dollars juste à temps pour rembourser ses porteurs : sa dette dollar est devenue, flux pour flux, une dette euro.

Par le risque ensuite : à l'échéance, ce n'est pas un différentiel d'intérêts qui doit revenir — c'est un **capital entier** : un risque de contrepartie d'une tout autre ampleur.

Et le prix du service dépasse la parité théorique : s'y ajoute le **cross-currency basis** — la prime, le plus souvent en faveur du dollar, qui mesure la tension mondiale sur le financement en billet vert. La chute : même grammaire que les autres swaps, mais ici, le capital voyage — et le risque avec lui.`,
    reponseModeleEn: `The **cross-currency swap** — and the frontier with the interest rate swap is exactly the kind of distinction a jury tests. In an interest rate swap, the notional is a pure calculation base: on €100m, no cash flow ever contains €100m. In a currency swap, the notional exchange is **the heart of the contract**: at the start, I deliver my euros and receive dollars, at the day\'s spot; at maturity, the reverse exchange, at the same rate fixed at the origin. In between, each side pays the interest of the currency it received.

Why does it matter so much? First through the use: that capital exchange is what **really** transforms a debt from one currency into another. The European company issuing a billion dollars in New York delivers the dollars raised, receives euros, pays a euro rate over the contract\'s life, and gets its dollars back just in time to repay its bondholders: its dollar debt has become, flow for flow, a euro debt.

Then through the risk: at maturity, it is not an interest differential that must come back — it is an **entire capital**: counterparty risk of a different magnitude.

And the price of the service is not exactly theoretical parity: the **cross-currency basis** adds to it — the premium, usually in the dollar\'s favour, measuring global tension on dollar funding. The closing line: same grammar as the other swaps, but here the capital travels — and the risk travels with it.`,
  },
  {
    id: 'm7-j-22',
    moduleId: M7,
    theme: 'la famille des swaps',
    themeEn: 'the swap family',
    difficulte: 3,
    question: 'Racontez-moi Archegos. L\'instrument était-il coupable ?',
    questionEn: 'Tell me about Archegos. Was the instrument guilty?',
    plan: [
      'Poser l\'objet : le total return swap — la performance totale d\'un actif contre un financement : l\'exposition sans la détention',
      'Raconter la construction : positions massives et concentrées, répliquées en parallèle chez plusieurs banques, chacune aveugle sur le total',
      'Décrire mars 2021 : une valeur phare chute, appels de marge impayables, liquidations en cascade — environ 10 Md$ de pertes bancaires, dont 5,5 pour Credit Suisse',
      'Juger : l\'instrument est banal — le coupable est le levier rendu invisible ; leçon de transparence',
    ],
    planEn: [
      'Define the object: the total return swap — an asset\'s total performance against financing: exposure without ownership',
      'Tell the build-up: massive, concentrated positions, replicated in parallel across several banks, each blind to the total',
      'Describe March 2021: a flagship stock falls, unpayable margin calls, cascading liquidations — about \\$10bn of bank losses, 5.5 of them at Credit Suisse',
      'Judge: the instrument is banal — the culprit is leverage made invisible; a transparency lesson',
    ],
    pointsAttendus: [
      'Le TRS : recevoir la performance totale d\'un actif (dividendes et plus-values, en indemnisant les moins-values) contre un taux de financement plus marge — économiquement détenir, juridiquement ne rien détenir',
      'La machine à levier : l\'investisseur n\'immobilise que le dépôt de garantie réclamé par la banque, pas le prix de l\'actif',
      'Archegos, le family office de Bill Hwang : positions massives et très concentrées (médias américains, tech chinoises cotées à New York), bâties via TRS auprès de PLUSIEURS banques en parallèle',
      'L\'invisibilité : aucune action déclarable — l\'exposition logée dans des swaps échappait aux seuils de transparence, et chaque banque ne voyait que sa propre tranche : personne n\'avait la carte du levier total',
      'Fin mars 2021 : la chute d\'une valeur phare déclenche des appels de marge impayables ; les banques liquident des dizaines de milliards en se marchant dessus — pertes cumulées de l\'ordre de 10 Md$ au total, dont environ 5,5 Md$ pour Credit Suisse',
      'Le verdict attendu : l\'instrument, parfaitement banal, n\'a pas tué — c\'est ce qu\'il rendait invisible : un levier concentré, fragmenté entre contreparties ; la transparence a été durcie depuis',
    ],
    pointsAttendusEn: [
      'The TRS: receiving an asset\'s total performance (dividends and gains, indemnifying the losses) against a funding rate plus spread — economically owning, legally owning nothing',
      'The leverage machine: the investor only ties up the collateral the bank demands, not the asset\'s price',
      'Archegos, Bill Hwang\'s family office: massive, highly concentrated positions (US media, Chinese tech listed in New York), built via TRS with SEVERAL banks in parallel',
      'The invisibility: no reportable shareholding — the exposure lodged in swaps escaped transparency thresholds, and each bank saw only its own slice: nobody had the map of total leverage',
      'Late March 2021: a flagship stock\'s fall triggers unpayable margin calls; the banks liquidate tens of billions while trampling each other — cumulative losses around \\$10bn, including about \\$5.5bn for Credit Suisse',
      'The expected verdict: the instrument, perfectly banal, did not kill — what it made invisible did: concentrated leverage, fragmented across counterparties; transparency has been tightened since',
    ],
    bonus: [
      'Le fil rouge avec 2008 et la régulation : chaque fois que le dérivé sépare l\'exposition de la détention, la carte des risques se brouille — c\'est la raison d\'être des trade repositories',
      'Le coût pour Credit Suisse : un coup dont la banque, déjà fragilisée, ne s\'est pas vraiment relevée — l\'accident de marché devenu accident de franchise',
    ],
    bonusEn: [
      'The thread back to 2008 and regulation: whenever a derivative separates exposure from ownership, the risk map blurs — the very reason trade repositories exist',
      'The cost to Credit Suisse: a blow from which the already weakened bank never quite recovered — a market accident turned franchise accident',
    ],
    reponseModele: `L'histoire tient en un instrument et un angle mort. L'instrument : le **total return swap**. Je reçois la performance totale d'un actif — dividendes et plus-values, en indemnisant les moins-values — contre un taux de financement plus marge. Économiquement, je détiens l'actif ; juridiquement, je ne détiens rien — et je n'immobilise que le dépôt de garantie, pas le prix : une machine à levier.

Archegos, le family office de Bill Hwang, avait bâti via ces TRS des positions massives et très concentrées — médias américains, valeurs technologiques chinoises cotées à New York — en traitant **en parallèle avec plusieurs banques**. L'angle mort : aucune action déclarable, donc pas de seuils franchis ; et chaque banque ne voyait que sa tranche. Le levier total, énorme, n'existait sur aucun écran.

Fin mars 2021, une valeur phare décroche : appels de marge impayables, et les banques liquident en urgence des dizaines de milliards — en se marchant dessus. Bilan : de l'ordre de **10 milliards de dollars** de pertes bancaires — dont environ 5,5 pour Credit Suisse, un coup dont elle ne s'est pas vraiment relevée.

L'instrument était-il coupable ? Non — le TRS est parfaitement banal, et utile. Le coupable est ce qu'il rendait **invisible** : un levier concentré, fragmenté entre contreparties. La leçon dépasse le cas : là où le dérivé sépare l'exposition de la détention, la carte des risques se brouille — et c'est la carte, pas l'outil, qu'il faut réparer. Les régulateurs ont durci la transparence depuis.`,
    reponseModeleEn: `The story fits in one instrument and one blind spot. The instrument: the **total return swap**. I receive an asset\'s total performance — dividends and gains, indemnifying the losses — against a funding rate plus a spread. Economically, I own the asset; legally, I own nothing — and I only tie up the collateral, not the price: a leverage machine.

Archegos, Bill Hwang\'s family office, had built through these TRS massive, highly concentrated positions — US media, Chinese tech stocks listed in New York — dealing **in parallel with several banks**. The blind spot is right there: no reportable shareholding, hence no threshold crossings; and each bank saw only its own slice. The total leverage, enormous, existed on no screen.

In late March 2021, a flagship stock broke down. Margin calls became unpayable, and the banks rushed to liquidate tens of billions of positions — trampling each other. The tally: around **\\$10bn** of bank losses, including about 5.5 for Credit Suisse alone, a blow it never quite recovered from.

Was the instrument guilty? No — the TRS is perfectly banal, and useful. The culprit is what it made **invisible**: concentrated leverage, fragmented across counterparties. The lesson, beyond the case: wherever a derivative separates exposure from ownership, the risk map blurs — and it is the map, not the tool, that needs fixing. Regulators have tightened transparency since.`,
  },
  {
    id: 'm7-j-23',
    moduleId: M7,
    theme: 'usages, risques et accidents',
    themeEn: 'uses, risks and accidents',
    difficulte: 3,
    question: 'Comment un seul trader a-t-il pu faire disparaître Barings, une banque de 233 ans ?',
    questionEn: 'How could a single trader make Barings, a 233-year-old bank, disappear?',
    plan: [
      'Donner les faits : Nick Leeson à Singapour, des positions non autorisées sur les futures Nikkei, des pertes dissimulées',
      'Identifier le carburant : le levier des futures — quelques pourcents de marge, des expositions démultipliées',
      'Identifier la faille décisive : il contrôlait à la fois le trading et le back-office — il se surveillait lui-même',
      'Chiffrer la fin et généraliser : début 1995, 827 M£ de pertes, la banque vendue une livre symbolique — levier, concentration, contrôles défaillants',
    ],
    planEn: [
      'Give the facts: Nick Leeson in Singapore, unauthorised positions on Nikkei futures, concealed losses',
      'Identify the fuel: futures leverage — a few percent of margin, multiplied exposures',
      'Identify the decisive flaw: he controlled both trading and the back office — he supervised himself',
      'Quantify the end and generalise: early 1995, £827m of losses, the bank sold for a symbolic pound — leverage, concentration, failed controls',
    ],
    pointsAttendus: [
      'Les faits : Nick Leeson, opérateur de Barings à Singapour, accumule des positions non autorisées sur les futures Nikkei et en dissimule les pertes',
      'Le carburant financier : le levier des futures — quelques pourcents de marge suffisent à porter des expositions énormes, et chaque baisse du Nikkei se démultiplie sur le capital engagé',
      'La faille organisationnelle, décisive : Leeson contrôlait à la fois le trading ET le back-office — il validait ses propres opérations et pouvait masquer les pertes d\'autant plus facilement',
      'Le dénouement : le marché japonais chute début 1995 ; les pertes atteignent 827 M£ — plus que les fonds propres ; la banque, vieille de 233 ans, disparaît en un week-end, revendue pour une livre symbolique',
      'La généralisation attendue : le dénominateur commun des désastres — levier, concentration, contrôles défaillants ; aucun de ces accidents n\'est venu d\'un instrument mal pricé',
      'La leçon de gouvernance : l\'organisation, pas la formule — des instruments mathématiquement précis entre les mains d\'organisations qui ne voient pas la taille réelle du risque',
    ],
    pointsAttendusEn: [
      'The facts: Nick Leeson, Barings\' trader in Singapore, builds unauthorised positions on Nikkei futures and conceals the losses',
      'The financial fuel: futures leverage — a few percent of margin carries enormous exposures, and every Nikkei drop is multiplied on the committed capital',
      'The organisational flaw, decisive: Leeson controlled both trading AND the back office — he validated his own trades and could hide the losses all the more easily',
      'The ending: the Japanese market falls in early 1995; losses reach £827m — more than the equity; the 233-year-old bank disappears in a weekend, sold for a symbolic pound',
      'The expected generalisation: the common denominator of disasters — leverage, concentration, failed controls; none of these accidents came from a mispriced instrument',
      'The governance lesson: the organisation, not the formula — mathematically precise instruments in the hands of organisations that do not see the real size of the risk',
    ],
    bonus: [
      'Le détail de contexte : le séisme de Kobe, en janvier 1995, précipite la chute du Nikkei — le hasard frappe, mais sur une position que rien n\'aurait dû laisser exister',
      'L\'héritage : la séparation stricte front, middle et back-office est depuis une règle universelle — Barings est l\'accident fondateur du contrôle des risques moderne',
    ],
    bonusEn: [
      'The context detail: the Kobe earthquake in January 1995 precipitated the Nikkei\'s fall — chance struck, but on a position nothing should have allowed to exist',
      'The legacy: strict separation of front, middle and back office has been a universal rule since — Barings is the founding accident of modern risk control',
    ],
    reponseModele: `Par la rencontre de deux forces : un instrument à levier, et une organisation aveugle. L'une sans l'autre n'aurait pas suffi.

Les faits d'abord. Nick Leeson, opérateur de Barings à Singapour, accumule des positions non autorisées sur les futures Nikkei — et en dissimule les pertes. Le carburant est le levier : quelques pourcents de dépôt portent des expositions énormes, et chaque baisse de l'indice se démultiplie sur le capital engagé. Quand le marché japonais chute début 1995, les pertes grossissent plus vite que tout ce que la banque peut suivre : **827 millions de livres** — davantage que ses fonds propres. Barings, 233 ans d'histoire, disparaît en un week-end, revendue pour une livre symbolique.

Mais le levier n'explique pas la dissimulation. La faille décisive est organisationnelle : Leeson contrôlait à la fois le **trading et le back-office** — il validait ses propres opérations, enterrait les pertes dans un compte d'erreurs, et répondait lui-même aux questions qu'on aurait dû lui poser. Il se surveillait lui-même : la banque n'avait pas de carte de son propre risque.

La généralisation que le jury attend : le dénominateur commun des grands désastres — Barings, Amaranth, Archegos — n'est jamais un instrument mal pricé. C'est le triptyque **levier, concentration, contrôles défaillants**.

La chute : les formules du module sont d'une précision totale ; les organisations qui les manient ne le sont que si on les y oblige. Barings en est la démonstration par l'absurde — et l'acte fondateur du contrôle des risques moderne.`,
    reponseModeleEn: `Through the meeting of two forces: a leveraged instrument, and a blind organisation. Neither alone would have sufficed.

The facts first. Nick Leeson, Barings\' trader in Singapore, builds unauthorised positions on Nikkei futures — and conceals the losses. The fuel is the leverage from the margins chapter: a few percent of deposit carries enormous exposures, and every drop in the index is multiplied on the committed capital. When the Japanese market falls in early 1995, the losses grow faster than anything the bank can track: **£827 million** — more than its equity. Barings, 233 years of history, disappears in a weekend, sold for a symbolic pound.

But leverage does not explain the concealment. The decisive flaw is organisational: Leeson controlled both **trading and the back office** — he validated his own trades, buried the losses in an error account, and personally answered the questions that should have been asked of him. He supervised himself: the bank had no map of its own risk.

The generalisation the jury expects: the common denominator of the great disasters — Barings, Amaranth, Archegos — is never a mispriced instrument. It is the triptych of **leverage, concentration, failed controls**.

The closing line: the formulas of this module are mathematically exact; the organisations that handle them are exact only if forced to be. Barings is the proof by absurdity — and the founding act of modern risk control.`,
  },
  {
    id: 'm7-j-24',
    moduleId: M7,
    theme: 'usages, risques et accidents',
    themeEn: 'uses, risks and accidents',
    difficulte: 4,
    question: 'Racontez-moi Metallgesellschaft.',
    questionEn: 'Tell me about Metallgesellschaft.',
    plan: [
      'Planter le décor : des ventes de carburant à prix fixe sur des années — environ 150 millions de barils — couvertes en futures courts rollés (stack and roll)',
      'Raconter fin 1993 : le pétrole baisse et la courbe passe en contango — les futures perdent en cash chaque soir, les gains clients restent latents',
      'Chiffrer l\'asphyxie : de l\'ordre du milliard de dollars d\'appels de marge à trouver — débouclage forcé au pire moment, environ 1,3 Md$ de pertes',
      'Tirer LA leçon : un hedge économiquement défendable peut tuer par la trésorerie — solvable ne suffit pas, il faut survivre à la liquidité',
    ],
    planEn: [
      'Set the scene: fuel sold at fixed prices over years — about 150 million barrels — hedged with rolled short-dated futures (stack and roll)',
      'Tell late 1993: oil falls and the curve flips into contango — the futures lose cash every evening, the client gains stay latent',
      'Quantify the asphyxiation: on the order of a billion dollars of margin calls to fund — forced unwind at the worst moment, about \\$1.3bn of losses',
      'Draw THE lesson: an economically defensible hedge can kill through cash flow — solvent is not enough, you must survive liquidity',
    ],
    pointsAttendus: [
      'L\'exposition initiale : la filiale américaine du conglomérat allemand avait vendu à ses clients des carburants à prix fixe sur des années — de l\'ordre de 150 millions de barils d\'engagements : un risque de hausse du pétrole',
      'La couverture choisie : acheter des futures courts, les seuls liquides, et les rouler d\'échéance en échéance — la stratégie stack and roll ; économiquement défendable, opérationnellement explosive',
      'Fin 1993, le double coup : le pétrole baisse nettement — les futures perdent, en CASH, réglé chaque soir par appels de marge, de l\'ordre du milliard de dollars — et le marché s\'installe en contango : chaque roll coûte',
      'L\'asymétrie fatale : en face, les contrats clients gagnent symétriquement de la valeur — mais ces gains sont LATENTS, étalés sur des années de livraisons : ils ne versent pas un centime aujourd\'hui',
      'Le dénouement : asphyxiée, sous la pression de la maison mère et des banques, l\'entreprise déboucle au pire moment — environ 1,3 Md$ de pertes cristallisées, la quasi-faillite d\'un groupe pourtant défendable au bilan',
      'LA leçon : être solvable ne suffit pas, il faut survivre à la trésorerie — avant toute couverture à marges quotidiennes, la question est « puis-je financer le pire scénario de marge jusqu\'au bout ? »',
    ],
    pointsAttendusEn: [
      'The initial exposure: the German conglomerate\'s US subsidiary had sold fuel to clients at fixed prices over years — around 150 million barrels of commitments: a risk of rising oil',
      'The chosen hedge: buying short-dated futures, the only liquid ones, and rolling them expiry after expiry — the stack and roll strategy; economically defensible, operationally explosive',
      'Late 1993, the double blow: oil falls sharply — the futures lose, in CASH, settled every evening through margin calls, on the order of a billion dollars — and the market settles into contango: every roll costs',
      'The fatal asymmetry: opposite, the client contracts gain value symmetrically — but those gains are LATENT, spread over years of deliveries: they pay not a cent today',
      'The ending: asphyxiated, under pressure from the parent and the banks, the firm unwinds at the worst moment — about \\$1.3bn of crystallised losses, the near-bankruptcy of a group whose balance sheet was defensible',
      'THE lesson: being solvent is not enough, you must survive the cash flow — before any daily-margined hedge, the question is "can I fund the worst margin scenario to the end?"',
    ],
    bonus: [
      'L\'honnêteté académique : le débat sur la qualité économique du hedge dure encore — la leçon opérationnelle, elle, est tranchée, et c\'est elle qu\'on vous demande',
      'Le contrepoint Buffett : ses dérivés géants étaient négociés SANS appels de marge quotidiens — il avait contractuellement neutralisé le poison exact qui a tué Metallgesellschaft',
    ],
    bonusEn: [
      'Academic honesty: the debate on the hedge\'s economic quality continues — the operational lesson, however, is settled, and that is the one being asked of you',
      'The Buffett counterpoint: his giant derivative positions were negotiated WITHOUT daily margin calls — he had contractually neutralised the exact poison that killed Metallgesellschaft',
    ],
    reponseModele: `C'est l'histoire d'une entreprise qui avait peut-être raison — et qui a failli mourir quand même. La filiale américaine du conglomérat allemand avait vendu à ses clients des carburants à **prix fixe sur des années** — de l'ordre de 150 millions de barils. Risque : la hausse du pétrole. Couverture : des **futures courts**, les seuls liquides, rollés indéfiniment — le *stack and roll*. Économiquement défendable ; opérationnellement explosif.

Fin 1993, le double coup. Le pétrole **baisse** nettement : les futures perdent — et ces pertes-là sont **cash, immédiates**, réglées chaque soir par appels de marge : de l'ordre du milliard de dollars à trouver. Et le marché s'installe en **contango** : chaque roll coûte désormais. En face, les contrats clients gagnent symétriquement — mais ces gains sont **latents**, étalés sur des années de livraisons : pas un centime ce soir.

Asphyxiée, sous la pression de sa maison mère et de ses banques, l'entreprise déboucle **au pire moment** — cristallisant environ **1,3 milliard de dollars** de pertes et frôlant la faillite. Le débat académique sur la qualité économique du hedge dure encore ; la leçon opérationnelle, elle, est tranchée.

LA leçon du module : **être solvable ne suffit pas — il faut survivre à la trésorerie**. Les marges se paient ce soir ; les gains latents ne paient rien. Avant toute couverture à marges quotidiennes, la question n'est pas « le hedge est-il bon ? » mais « puis-je financer le pire scénario de marge jusqu'au bout ? ».`,
    reponseModeleEn: `It is the story of a company that may have been right — and nearly died anyway. The German conglomerate\'s US subsidiary had sold fuel to its clients at **fixed prices over years** — on the order of 150 million barrels. The obvious risk: rising oil. The chosen hedge: buying **short-dated futures**, the only liquid ones, and rolling them indefinitely — *stack and roll*. Economically defensible; operationally explosive.

Late 1993, the double blow. Oil **falls** sharply: the futures lose — and those losses are **cash, immediate**, settled every evening through margin calls: on the order of a billion dollars to find. And the market settles into **contango**: every roll now costs. Opposite, the client contracts gain value symmetrically — the firm will sell dearly an oil that has become cheap — but those gains are **latent**, spread over years of deliveries: they pay not one cent tonight.

Asphyxiated, under pressure from its parent and its banks, the firm unwinds **at the worst moment** — crystallising about **\\$1.3 billion** of losses and brushing bankruptcy. The academic debate on the hedge\'s economic quality continues; the operational lesson is settled.

And it is THE lesson of the module: **being solvent is not enough — you must survive the cash flow**. Margins are paid tonight; latent gains pay nothing. Before any daily-margined hedge, the professional question is not "is the hedge sound?" but "can I fund the worst margin scenario all the way through?".`,
  },
  {
    id: 'm7-j-25',
    moduleId: M7,
    theme: 'usages, risques et accidents',
    themeEn: 'uses, risks and accidents',
    difficulte: 3,
    question: 'Qu\'ont changé EMIR et Dodd-Frank pour les dérivés — et où est passé le risque ?',
    questionEn: 'What did EMIR and Dodd-Frank change for derivatives — and where did the risk go?',
    plan: [
      'Partir du diagnostic de 2008 : l\'opacité du gré à gré bilatéral a transformé le défaut de Lehman en panique systémique — personne n\'avait la carte',
      'Énoncer les trois piliers : compensation centrale obligatoire des contrats standardisés, marges bilatérales sur le reste, déclaration aux référentiels centraux',
      'Évaluer : la discipline des futures imposée au gré à gré — un système incontestablement plus robuste',
      'Nuancer en stratège : le risque n\'a pas disparu, il s\'est déplacé et concentré dans quelques chambres hypercritiques, mieux surveillées',
    ],
    planEn: [
      'Start from the 2008 diagnosis: the opacity of bilateral OTC turned Lehman\'s default into systemic panic — nobody had the map',
      'State the three pillars: mandatory central clearing of standardised contracts, bilateral margins on the rest, reporting to trade repositories',
      'Assess: futures discipline imposed on OTC — an unquestionably more robust system',
      'Qualify as a strategist: risk did not disappear, it moved and concentrated into a few hypercritical clearing houses, better supervised',
    ],
    pointsAttendus: [
      'Le diagnostic fondateur : en 2008, les expositions bilatérales étaient invisibles — le défaut de Lehman a semé la panique, pendant que les chambres de compensation traversaient l\'épisode sans sinistre majeur : c\'est ce contraste qui a convaincu le G20',
      'Pilier 1 : compensation centrale obligatoire des dérivés OTC standardisés — une CCP s\'interpose, appelle des marges quotidiennes : la discipline des futures imposée au gré à gré (LCH SwapClear, CME pour les swaps de taux)',
      'Pilier 2 : marges bilatérales sur le non-compensé — marge initiale et marge de variation échangées entre contreparties, pour que le bilatéral ne soit plus un angle mort',
      'Pilier 3 : déclaration de toutes les transactions à des référentiels centraux (trade repositories) — les régulateurs disposent enfin de la carte des expositions qui manquait en 2008',
      'Le bilan : un système incontestablement plus robuste — netting, collatéral, compression des portefeuilles qui dégonfle les notionnels bruts',
      'La nuance attendue : le risque n\'a pas été supprimé, il a été déplacé — chassé des bilans bancaires, concentré dans quelques CCP devenues systémiques par construction, dont la défaillance, improbable, serait un événement majeur',
    ],
    pointsAttendusEn: [
      'The founding diagnosis: in 2008, bilateral exposures were invisible — Lehman\'s default spread panic, while the clearing houses came through the episode without major loss: that contrast convinced the G20',
      'Pillar 1: mandatory central clearing of standardised OTC derivatives — a CCP interposes itself and calls daily margins: futures discipline imposed on OTC (LCH SwapClear, CME for rate swaps)',
      'Pillar 2: bilateral margins on the uncleared — initial and variation margin exchanged between counterparties, so the bilateral world is no longer a blind spot',
      'Pillar 3: reporting of all transactions to trade repositories — regulators finally hold the map of exposures that was missing in 2008',
      'The assessment: an unquestionably more robust system — netting, collateral, portfolio compression deflating gross notionals',
      'The expected nuance: risk was not removed, it was displaced — pushed out of bank balance sheets, concentrated in a few CCPs that are systemic by construction, whose failure, improbable, would be a major event',
    ],
    bonus: [
      'Le coût discret de la robustesse : marges et collatéral consomment du bilan et de la liquidité — la même rareté de bilan qui laisse vivre les basis persistants depuis 2008',
      'Le complément bilatéral : contrat-cadre ISDA, netting de clôture et annexe CSA — la plomberie qui explique pourquoi des notionnels vertigineux coexistent avec des expositions nettes contenues',
    ],
    bonusEn: [
      'The quiet cost of robustness: margins and collateral consume balance sheet and liquidity — the same balance sheet scarcity that lets persistent bases live on since 2008',
      'The bilateral complement: the ISDA master agreement, close-out netting and the CSA annex — the plumbing that explains why vertiginous notionals coexist with contained net exposures',
    ],
    reponseModele: `Le point de départ : un contraste observé en 2008. Quand Lehman tombe, ses expositions bilatérales de gré à gré sont invisibles — personne n'a la carte, et l'incertitude sème la panique. Au même moment, les chambres de compensation liquident ses portefeuilles de futures en s'appuyant sur ses marges, **sans sinistre majeur**. C'est ce contraste qui a convaincu le G20, traduit en Europe par EMIR et aux États-Unis par Dodd-Frank.

Trois piliers. Un : la **compensation centrale obligatoire** des dérivés OTC standardisés — swaps de taux en tête, chez LCH SwapClear ou CME : une chambre s'interpose et appelle des marges quotidiennes, la discipline des futures imposée au gré à gré. Deux : des **marges bilatérales** — initiale et variation — sur ce qui reste non compensé, pour que le bilatéral ne soit plus un angle mort. Trois : la **déclaration** de toutes les transactions à des référentiels centraux, qui donne enfin aux régulateurs la carte des expositions manquante en 2008.

Bilan largement positif : netting, collatéral généralisé, compression des portefeuilles — le système est incontestablement plus robuste.

Mais votre seconde question est la bonne : le risque n'a pas disparu — il a **déménagé**. Chassé des bilans bancaires, il s'est concentré dans quelques chambres devenues des infrastructures hypercritiques, systémiques par construction, dont la défaillance — hautement improbable — serait un événement majeur. La régulation n'a pas supprimé le risque ; elle l'a déplacé vers des nœuds qu'elle surveille mieux. C'est un progrès réel — et un pari permanent.`,
    reponseModeleEn: `The starting point is a contrast observed in 2008. When Lehman falls, its bilateral OTC exposures are invisible — nobody has the map, and uncertainty spreads panic. At the same moment, the clearing houses liquidate its futures portfolios relying on its margins, **without major loss**. That contrast convinced the G20, translated in Europe as EMIR and in the United States as Dodd-Frank.

Three pillars. One: **mandatory central clearing** of standardised OTC derivatives — rate swaps first, at LCH SwapClear or CME: a clearing house interposes itself and calls daily margins, futures discipline imposed on the OTC world. Two: **bilateral margins** — initial and variation — on what remains uncleared, so the bilateral world is no longer a blind spot. Three: **reporting** of every transaction to trade repositories, finally giving regulators the map of exposures that was missing in 2008.

The assessment is largely positive: netting, generalised collateral, portfolio compression — the system is unquestionably more robust.

But your second question is the right one: the risk has not disappeared — it has **moved house**. Pushed out of bank balance sheets, it has concentrated in a few clearing houses that are now hypercritical infrastructure, systemic by construction, whose failure — highly improbable — would be a major event. Regulation did not remove the risk; it moved it to nodes it watches more closely. That is real progress — and a permanent wager.`,
  },
];
