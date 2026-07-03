import type { JuryQuestion } from '../../../engine/types';

const M5 = '05-credit';

export const jury: JuryQuestion[] = [
  {
    id: 'm5-j-01',
    moduleId: M5,
    theme: 'le prix du risque de crédit',
    themeEn: 'the price of credit risk',
    difficulte: 2,
    question: 'Qu\'est-ce qu\'un spread de crédit, et que rémunère-t-il exactement ?',
    questionEn: 'What is a credit spread, and what exactly does it pay for?',
    plan: [
      'Définir en une phrase avec l\'exemple canonique : l\'écart de rendement entre l\'obligation risquée et le sans-risque de même maturité, en points de base — (5,5 − 3,5) × 100 = 200 pb',
      'Réciter les repères de temps calme : IG euro 80-150 pb, high yield 300-500 pb, distressed > 1 000 pb ; iTraxx Main ~50-80 pb, Crossover ~250-400 pb',
      'Poser le socle actuariel puis la facture au-dessus : EL = PD × LGD (2 % × 60 % = 1,2 %, soit 120 pb « mérités »), plus prime de risque, prime de liquidité, résidu fiscal',
      'Conclure sur le puzzle : le spread IG observé paie 5 à 8 fois le défaut moyen — le spread rémunère le stress et l\'illiquidité, pas la perte moyenne',
    ],
    planEn: [
      'Define it in one sentence with the canonical example: the yield gap between the risky bond and the risk-free bond of the same maturity, in basis points — (5.5 − 3.5) × 100 = 200 bp',
      'Recite the calm-market anchors: euro IG 80-150 bp, high yield 300-500 bp, distressed > 1,000 bp; iTraxx Main ~50-80 bp, Crossover ~250-400 bp',
      'Lay the actuarial floor then the bill above it: EL = PD × LGD (2% × 60% = 1.2%, i.e. 120 bp "deserved"), plus the risk premium, the liquidity premium, a tax residual',
      'Close on the puzzle: the observed IG spread pays 5 to 8 times the average default — the spread pays for stress and illiquidity, not the average loss',
    ],
    pointsAttendus: [
      'La définition chiffrée : une obligation 5 ans à 5,5 % contre un emprunt d\'État de même maturité à 3,5 % traite à (5,5 − 3,5) × 100 = 200 pb — le supplément de rendement annuel exigé pour porter le doute',
      'Les repères récités sans hésiter : corporate IG euro 80-150 pb en temps calme, high yield 300-500 pb, distressed au-delà de 1 000 pb ; iTraxx Main ~50-80 pb, Crossover ~250-400 pb',
      'Le socle : la compensation actuarielle du défaut moyen, EL = PD × LGD — pour PD 2 % et R 40 %, 1,2 % par an, soit un spread « actuariel » de 120 pb',
      'La prime de risque : les défauts arrivent en grappes, dans les récessions, quand tout le portefeuille souffre — porter du crédit, c\'est vendre de l\'assurance contre le mauvais état du monde, payée au-dessus de sa valeur actuarielle',
      'La prime de liquidité : fourchettes larges, profondeur faible, des jours sans échange — environ la moitié du spread IG selon les études sur données de transactions ; s\'y ajoute un résidu fiscal ou technique',
      'Le credit spread puzzle chiffré : une BBB a une PD historique d\'environ 0,3 % par an, soit 18 pb de perte attendue — et cote 120-150 pb : le marché paie cinq à huit fois le défaut moyen',
    ],
    pointsAttendusEn: [
      'The numbered definition: a 5-year corporate at 5.5% against a same-maturity government bond at 3.5% trades at (5.5 − 3.5) × 100 = 200 bp — the extra annual yield demanded for carrying the doubt',
      'The anchors recited without hesitation: euro IG corporate 80-150 bp in calm markets, high yield 300-500 bp, distressed beyond 1,000 bp; iTraxx Main ~50-80 bp, Crossover ~250-400 bp',
      'The floor: the actuarial compensation for the average default, EL = PD × LGD — for PD 2% and R 40%, 1.2% a year, i.e. an "actuarial" spread of 120 bp',
      'The risk premium: defaults arrive in clusters, in recessions, when the whole portfolio suffers — carrying credit means selling insurance against the bad state of the world, paid above its actuarial value',
      'The liquidity premium: wide bid-offers, thin depth, days without a trade — about half the IG spread according to transaction-data studies; plus a tax or technical residual',
      'The credit spread puzzle in numbers: a BBB has a historical PD of about 0.3% a year, i.e. 18 bp of expected loss — and trades at 120-150 bp: the market pays five to eight times the average default',
    ],
    bonus: [
      'La lecture inverse qui en découle : la PD implicite dans un spread est risque-neutre et surestime la fréquence historique des défauts d\'un facteur 2 à 5 — le marché price le stress, pas la moyenne',
      'La limite du thermomètre : sous 50-60 % du nominal, le marché cesse de coter en spread et passe en prix — le rendement actuariel devient une fiction et la valeur devient un pari sur le recouvrement',
    ],
    bonusEn: [
      'The inverse reading that follows: the PD implied by a spread is risk-neutral and overstates the historical default frequency by a factor of 2 to 5 — the market prices stress, not the average',
      'The thermometer\'s limit: below 50-60% of par, the market stops quoting in spread and switches to price — the yield to maturity becomes a fiction and the value becomes a bet on recovery',
    ],
    reponseModele: `La définition d'abord, avec le chiffre du cours : une obligation d'entreprise à 5 ans rend 5,5 % quand l'emprunt d'État de même maturité rend 3,5 % — le spread vaut (5,5 − 3,5) × 100 = **200 pb**. C'est le prix annuel du doute, affiché en continu. Les repères de temps calme : IG euro 80-150 pb, high yield 300-500 pb, distressed au-delà de 1 000 pb ; iTraxx Main ~50-80 pb, Crossover ~250-400 pb.

Que rémunère-t-il ? L'intuition naïve — « le défaut moyen » — ne couvre que le socle. La perte attendue vaut EL = PD × LGD : pour PD 2 % et R 40 %, 1,2 % par an, soit **120 pb « mérités »**. Or le nom traite à 200 pb, et l'écart n'est pas une anomalie : c'est une facture détaillée. La **prime de risque** d'abord — les défauts arrivent en grappes, dans les récessions, quand tout le portefeuille souffre : porter du crédit, c'est vendre de l'assurance contre le mauvais état du monde, et cette assurance se paie au-dessus de sa valeur actuarielle. La **prime de liquidité** ensuite — environ la moitié du spread IG selon les études. Un résidu fiscal enfin.

La chute : sur l'IG, le spread observé paie **5 à 8 fois** le défaut moyen — une BBB à PD 0,3 % « mérite » 18 pb et cote 120-150. Le spread ne rémunère pas la perte moyenne : il rémunère le stress — et quiconque l'encaisse en portera le coût au pire moment.`,
    reponseModeleEn: `The definition first, with the course number: a 5-year corporate bond yields 5.5% when the government bond of the same maturity yields 3.5% — the spread is (5.5 − 3.5) × 100 = **200 bp**. It is the extra annual yield the market demands for carrying the doubt about the promise, quoted continuously. The calm-market anchors: euro IG 80-150 bp, high yield 300-500 bp, distressed beyond 1,000 bp; iTraxx Main ~50-80 bp, Crossover ~250-400 bp.

What does it pay for? The naive intuition — "the average default" — only covers the floor. Expected loss is EL = PD × LGD: for PD 2% and R 40%, 1.2% a year, i.e. **120 bp "deserved"**. Yet the name trades at 200 bp, and the gap is not an anomaly: it is an itemised bill. The **risk premium** first — defaults do not arrive in scattered order but in clusters, in recessions, precisely when the rest of your portfolio is suffering: carrying credit means selling insurance against the bad state of the world, and that insurance is paid above its actuarial value. The **liquidity premium** next — about half the IG spread according to the studies. A tax residual, finally.

The punchline: on IG, the observed spread pays **5 to 8 times** the average default — a BBB at 0.3% PD "deserves" 18 bp and trades at 120-150. The spread does not pay for the average loss: it pays for stress — and whoever collects it will bear the cost at the worst moment.`,
  },
  {
    id: 'm5-j-02',
    moduleId: M5,
    theme: 'le prix du risque de crédit',
    themeEn: 'the price of credit risk',
    difficulte: 3,
    question: 'Un spread est-il une prévision de défaut ?',
    questionEn: 'Is a spread a default forecast?',
    plan: [
      'Répondre net : non — c\'est un prix, pas une prévision ; la PD qu\'on en extrait est risque-neutre, pas historique',
      'Faire le calcul témoin : 300 pb avec R = 40 % « pricent » 5 % de défaut par an — quand la fréquence historique du nom est bien plus basse, souvent d\'un facteur 2 à 5',
      'Expliquer l\'écart : le spread contient une prime de risque (défauts en grappes, covariance avec les récessions) et une prime de liquidité — la PD implicite les absorbe mécaniquement',
      'Donner la formulation d\'oral : « le marché price 5 % » est juste, « le marché prévoit 5 % » est le piège — la nuance risque-neutre/historique fait la réponse de desk',
    ],
    planEn: [
      'Answer squarely: no — it is a price, not a forecast; the PD you extract from it is risk-neutral, not historical',
      'Run the witness calculation: 300 bp with R = 40% "price" 5% default per year — when the name\'s historical frequency is far lower, often by a factor of 2 to 5',
      'Explain the gap: the spread contains a risk premium (clustered defaults, covariance with recessions) and a liquidity premium — the implied PD mechanically absorbs them',
      'Give the oral phrasing: "the market prices 5%" is correct, "the market forecasts 5%" is the trap — the risk-neutral/historical nuance is what makes a desk answer',
    ],
    pointsAttendus: [
      'La distinction centrale : la PD implicite = spread/LGD est la probabilité qui rend le spread actuariellement juste — une grandeur de pricing, pas une estimation statistique',
      'Le calcul de tête : 300 pb = 3 % ; LGD = 60 % ; PD implicite = 3/0,6 = 5 % par an',
      'La surestimation systématique : le spread paie le stress et l\'illiquidité en plus du défaut moyen, donc la PD risque-neutre dépasse la fréquence historique — facteur 2 à 5',
      'Le chiffrage du puzzle : une BBB à ~0,3 % de PD annuelle historique « mérite » 18 pb de spread actuariel et cote 120-150 pb — cinq à huit fois le défaut moyen',
      'Ce n\'est pas une erreur du marché : c\'est la prime de risque vue de l\'autre côté du miroir — l\'assurance contre les mauvais états du monde se paie au-dessus de sa valeur actuarielle',
      'La conséquence pratique : comparer PD implicite et PD historique mesure la prime — un indicateur de valorisation du crédit, pas un pronostic de défauts',
    ],
    pointsAttendusEn: [
      'The central distinction: the implied PD = spread/LGD is the probability that makes the spread actuarially fair — a pricing quantity, not a statistical estimate',
      'The mental calculation: 300 bp = 3%; LGD = 60%; implied PD = 3/0.6 = 5% per year',
      'The systematic overstatement: the spread pays for stress and illiquidity on top of the average default, so the risk-neutral PD exceeds the historical frequency — by a factor of 2 to 5',
      'The puzzle in numbers: a BBB at ~0.3% historical annual PD "deserves" 18 bp of actuarial spread and trades at 120-150 bp — five to eight times the average default',
      'It is not a market error: it is the risk premium seen from the other side of the mirror — insurance against the bad states of the world is paid above its actuarial value',
      'The practical consequence: comparing implied and historical PD measures the premium — a valuation gauge for credit, not a default forecast',
    ],
    bonus: [
      'Le pont avec les options du m8 : la PD implicite a le même statut que la volatilité implicite — un paramètre qui égalise un prix, systématiquement au-dessus du réalisé, et dont l\'écart au réalisé EST la prime de risque',
      'L\'exception qui confirme : sur le distressed (> 1 000 pb), la composante défaut redevient dominante — et le marché quitte d\'ailleurs le spread pour coter en prix, c\'est-à-dire en recouvrement',
    ],
    bonusEn: [
      'The bridge to m8 options: the implied PD has the same status as implied volatility — a parameter that equates a price, systematically above the realised figure, and whose gap to realised IS the risk premium',
      'The exception that proves it: on distressed names (> 1,000 bp), the default component becomes dominant again — and the market indeed leaves spread quotation for price, that is, recovery',
    ],
    reponseModele: `Non — et la nuance vaut la question. Un spread est un **prix**, pas une prévision. On peut en extraire une probabilité de défaut : PD implicite = spread/LGD. Le calcul témoin : une obligation à **300 pb** avec R = 40 % price 3 %/0,6 = **5 % de défaut par an**. Mais cette PD est dite **risque-neutre** : c'est la probabilité qui rendrait le spread actuariellement juste — pas une estimation de la fréquence réelle.

Pourquoi les deux divergent-elles ? Parce que le spread ne paie pas que le défaut moyen. Il contient une **prime de risque** — les défauts arrivent en grappes dans les récessions, quand tout le portefeuille souffre : vendre cette assurance se paie au-dessus de sa valeur actuarielle — et une **prime de liquidité**, environ la moitié du spread IG. En les absorbant dans la formule, la PD implicite **surestime** mécaniquement la fréquence historique, souvent d'un facteur 2 à 5. Le chiffrage du puzzle : une BBB à ~0,3 % de PD annuelle « mérite » 18 pb et cote 120-150 pb.

Ce n'est pas une erreur du marché : c'est la prime de risque vue de l'autre côté du miroir. D'où la formulation exacte à l'oral : « le marché **price** 5 % de défaut » est juste ; « le marché **prévoit** 5 % de défauts » est le piège. Et l'usage de desk : l'écart entre PD implicite et PD historique mesure la prime — c'est un indicateur de cherté du crédit, jamais un pronostic.`,
    reponseModeleEn: `No — and the nuance is the whole question. A spread is a **price**, not a forecast. You can extract a default probability from it: implied PD = spread/LGD. The witness calculation: a bond at **300 bp** with R = 40% prices 3%/0.6 = **5% default per year**. But that PD is **risk-neutral**: it is the probability that would make the spread actuarially fair — not an estimate of the real frequency.

Why do the two diverge? Because the spread does not only pay for the average default. It contains a **risk premium** — defaults arrive in clusters, in recessions, when the whole portfolio suffers: selling that insurance commands more than its actuarial value — and a **liquidity premium**, about half the IG spread. By absorbing both into the formula, the implied PD mechanically **overstates** the historical frequency, often by a factor of 2 to 5. The puzzle in numbers: a BBB at ~0.3% annual PD "deserves" 18 bp and trades at 120-150 bp.

This is not a market error: it is the risk premium seen from the other side of the mirror. Hence the exact oral phrasing: "the market **prices** 5% default" is correct; "the market **forecasts** 5% of defaults" is the trap. And the desk usage: the gap between implied and historical PD measures the premium — a richness gauge for credit, never a prognosis.`,
  },
  {
    id: 'm5-j-03',
    moduleId: M5,
    theme: 'la notation : l\'alphabet du risque',
    themeEn: 'ratings: the alphabet of risk',
    difficulte: 3,
    question: 'Le marché price les dégradations avant les agences. À quoi servent-elles encore ?',
    questionEn: 'The market prices downgrades before the agencies act. What are they still for?',
    plan: [
      'Accorder le fait : le spread bouge avant la lettre, systématiquement — le marché est un comité qui vote en continu, l\'agence un comité qui se réunit ; Ford tradait « comme du BB » des semaines avant le 25 mars 2020',
      'Renverser : la note n\'est pas une information, c\'est une RÈGLE — mandats « IG only », éligibilité et décotes du collatéral BCE, pondérations de Bâle : c\'est elle qui déclenche les obligations contractuelles',
      'Rappeler le service fondateur : une opinion synthétique et comparable (Moody, 1909) — une même échelle ordinale classe un constructeur, un souverain et une banque, et les fréquences de défaut par note restent strictement croissantes',
      'Nuancer avec le procès de 2008 : le conflit issuer-pays est structurel, contenu sur le corporate, explosif sur la finance structurée — la critique juste vise le AAA de structure, pas l\'alphabet',
    ],
    planEn: [
      'Concede the fact: the spread moves before the letter, systematically — the market is a committee voting continuously, the agency a committee that convenes; Ford traded "like BB" weeks before 25 March 2020',
      'Then flip it: a rating is not information, it is a RULE — "IG only" mandates, ECB collateral eligibility and haircuts, Basel risk weights: the letter is what triggers the contractual obligations',
      'Recall the founding service: a synthetic, comparable opinion (Moody, 1909) — one ordinal scale ranks a carmaker, a sovereign and a bank, and default frequencies by rating remain strictly increasing',
      'Add the 2008 nuance: the issuer-pays conflict is structural, contained on corporates, explosive on structured finance — the fair criticism targets the structured AAA, not the alphabet',
    ],
    pointsAttendus: [
      'Le constat de vitesse assumé : l\'agence instruit un dossier et publie par à-coups ; le marché vote à chaque transaction — quand la dégradation tombe, le spread a le plus souvent déjà fait le chemin',
      'Le renversement clé : la note est une règle, pas une information — elle est écrite dans les mandats de gestion, dans l\'éligibilité du collatéral à la BCE, dans les pondérations de Bâle, et c\'est elle qui déclenche les ventes mécaniques',
      'Le service de comparabilité : depuis 1909, une opinion synthétique sur une échelle unique — la valeur est la brutalité même du classement commun',
      'Le bilan statistique qui défend l\'alphabet : les défauts cumulés à 5 ans restent strictement ordonnés — AAA ~0,1 %, BBB ~1,5 %, B ~15-20 %, CCC ~40-50 %',
      'Le conflit issuer-pays : l\'émetteur paie sa propre note — contenu sur le corporate (comptes publics, réputation), démultiplié en 2008 par le sur-mesure de la finance structurée',
      'Les réformes sans changement de modèle : enregistrement et supervision (Dodd-Frank, ESMA), murailles de Chine, publication des méthodologies — le modèle économique issuer-pays demeure',
    ],
    pointsAttendusEn: [
      'The speed concession, made squarely: the agency builds a file and publishes in bursts; the market votes on every trade — by the time the downgrade lands, the spread has usually already travelled',
      'The key reversal: a rating is a rule, not information — it is written into management mandates, ECB collateral eligibility, Basel risk weights, and it is the letter that triggers the mechanical selling',
      'The comparability service: since 1909, a synthetic opinion on a single scale — the value lies precisely in the brutality of the common ranking',
      'The statistical record that defends the alphabet: 5-year cumulative defaults remain strictly ordered — AAA ~0.1%, BBB ~1.5%, B ~15-20%, CCC ~40-50%',
      'The issuer-pays conflict: the issuer pays for its own rating — contained on corporates (public accounts, reputation), amplified in 2008 by the made-to-measure of structured finance',
      'The reforms without a change of model: registration and supervision (Dodd-Frank, ESMA), Chinese walls, published methodologies — the issuer-pays business model remains',
    ],
    bonus: [
      'Les matrices de migration : la diagonale domine (~87 % pour AAA, ~85 % pour BBB à un an), la stabilité décroît avec la note, et le momentum des dégradations n\'est pas markovien — une note qui vient de baisser a une probabilité anormale de rebaisser',
      'Le vrai risque d\'un book IG : pas le défaut direct mais la migration vers la frontière — la perte vient du repricing du spread pendant la descente, la spread duration fait mal bien avant le recouvrement',
    ],
    bonusEn: [
      'Migration matrices: the diagonal dominates (~87% for AAA, ~85% for BBB over one year), stability decreases down the scale, and downgrade momentum is non-Markovian — a freshly downgraded name has an abnormal probability of being downgraded again',
      'The real risk of an IG book: not outright default but migration towards the frontier — the loss comes from spread repricing during the descent, and spread duration hurts long before recovery matters',
    ],
    reponseModele: `Accordez d'abord le fait, il est exact : **le spread bouge avant la lettre**, systématiquement. L'agence est un comité qui se réunit, instruit un dossier, publie par à-coups ; le marché est un comité qui vote en continu, à chaque transaction. Ford tradait « comme du BB » des semaines avant la dégradation du 25 mars 2020.

Puis renversez la question : si la note est en retard, pourquoi déclenche-t-elle encore des milliards de ventes ? Parce qu'elle n'est pas une *information* — elle est une **règle**. Les mandats de gestion écrivent « investment grade uniquement » ; l'éligibilité et les décotes du collatéral à la BCE dépendent des notes ; les pondérations en capital de Bâle aussi. La note est en retard sur l'information, mais c'est *elle* qui déclenche les obligations contractuelles et réglementaires — c'est exactement ce qui rend la frontière BBB−/BB+ dangereuse.

Ajoutez le service fondateur : depuis Moody en 1909, une **opinion synthétique et comparable** — une même échelle classe un constructeur, un souverain et une banque, et le bilan statistique tient : les défauts cumulés à 5 ans restent strictement ordonnés (AAA ~0,1 %, BBB ~1,5 %, B ~15-20 %).

Et la nuance qui fait la bonne copie : le conflit **issuer-pays** est réel — l'émetteur paie sa note — mais le procès de 2008 vise le AAA *de structure*, ajusté en dialogue avec l'arrangeur, pas l'alphabet corporate, qui a fait son travail avant, pendant et après la crise.`,
    reponseModeleEn: `Concede the fact first, because it is true: **the spread moves before the letter**, systematically. The agency is a committee that convenes, builds a file, publishes in bursts; the market is a committee voting continuously, on every trade. Ford traded "like BB" weeks before the 25 March 2020 downgrade.

Then flip the question: if the rating lags, why does it still trigger billions in sales? Because it is not *information* — it is a **rule**. Management mandates say "investment grade only"; ECB collateral eligibility and haircuts depend on ratings; so do Basel capital weights. The rating lags the information, but it is the *letter* that triggers the contractual and regulatory obligations — which is exactly what makes the BBB−/BB+ frontier dangerous.

Add the founding service: since Moody in 1909, a **synthetic, comparable opinion** — one scale ranks a carmaker, a sovereign and a bank, and the statistical record holds: 5-year cumulative defaults remain strictly ordered (AAA ~0.1%, BBB ~1.5%, B ~15-20%).

And the nuance that makes a good answer: the **issuer-pays** conflict is real — the issuer pays for its own rating — but the 2008 trial concerns the *structured* AAA, fine-tuned in dialogue with the arranger, not the corporate alphabet, which did its job before, during and after the crisis.`,
  },
  {
    id: 'm5-j-04',
    moduleId: M5,
    theme: 'la notation : l\'alphabet du risque',
    themeEn: 'ratings: the alphabet of risk',
    difficulte: 2,
    question: 'Qu\'est-ce qu\'un fallen angel, et pourquoi la frontière BBB−/BB+ est-elle une falaise ?',
    questionEn: 'What is a fallen angel, and why is the BBB−/BB+ frontier a cliff?',
    plan: [
      'Définir : un fallen angel est un émetteur investment grade rétrogradé en high yield — le franchissement vers le bas de la frontière BBB−/Baa3 contre BB+/Ba1 ; la rising star fait le chemin inverse',
      'Expliquer la falaise : la note est une règle — mandats « IG only », indices disjoints, collatéral BCE, Bâle — donc la dégradation déclenche des ventes mécaniques, simultanées, non discrétionnaires',
      'Chiffrer l\'asymétrie des gisements : le HY est plusieurs fois plus petit que l\'IG (en euro, ~3 000 Md€ contre ~400 Md€) — pas d\'acheteur naturel, le spread s\'écarte d\'une prime de dislocation, pas de défaut',
      'Illustrer avec Ford, mars 2020 : ~36 Md$ basculent d\'un coup, le plus gros ange déchu de l\'histoire — spreads écartés AVANT la lettre, seconde vague APRÈS, et la Fed qui inclut les fallen angels dans ses achats',
    ],
    planEn: [
      'Define: a fallen angel is an investment-grade issuer downgraded to high yield — crossing the BBB−/Baa3 versus BB+/Ba1 frontier on the way down; the rising star travels the other way',
      'Explain the cliff: the rating is a rule — "IG only" mandates, disjoint indices, ECB collateral, Basel — so the downgrade triggers mechanical, simultaneous, non-discretionary selling',
      'Quantify the asymmetry of the pools: HY is several times smaller than IG (in euro, ~3,000bn€ against ~400bn€) — no natural buyer, so the spread widens by a dislocation premium, not a default premium',
      'Illustrate with Ford, March 2020: ~36bn$ switch at once, the largest fallen angel in history — spreads widened BEFORE the letter, a second wave AFTER, and the Fed including fallen angels in its purchases',
    ],
    pointsAttendus: [
      'La définition et le vocabulaire : fallen angel (IG → HY) contre rising star (HY → IG), avec les outils de trajectoire — outlook, credit watch',
      'Le point statistique honnête : le risque croît continûment le long de l\'échelle — ce qui est discontinu, c\'est l\'USAGE de la note : la frontière est un mur contractuel posé sur une pente continue',
      'Le mécanisme des ventes forcées : les mandats « IG only » doivent vendre à la dégradation, non parce qu\'ils ont changé d\'avis mais parce que leur mandat l\'exige',
      'Le saut de spread à la frontière : à 5 ans, ~120 pb pour BBB contre ~300 pb pour BB (+180 pb), quand A → BBB ne coûte que +40 pb — le grand saut est à la ligne IG/HY',
      'Ford, 25 mars 2020 : S&P retire le dernier rating IG, ~36 Md$ de dette basculent — le gisement HY grossit de plusieurs pour cent en un jour, et l\'écartement rémunère la dislocation, pas un surcroît de PD',
      'L\'épilogue institutionnel : la Fed inclut explicitement les fallen angels dégradés après le 22 mars dans ses achats de crédit — reconnaissance que la falaise est un problème de plomberie de marché ; Ford redevient IG en 2023',
    ],
    pointsAttendusEn: [
      'The definition and the vocabulary: fallen angel (IG → HY) versus rising star (HY → IG), with the trajectory tools — outlook, credit watch',
      'The honest statistical point: risk grows continuously along the scale — what is discontinuous is the USE of the rating: the frontier is a contractual wall built on a continuous slope',
      'The forced-selling mechanism: "IG only" mandates must sell on the downgrade, not because they changed their mind but because their mandate requires it',
      'The spread jump at the frontier: at 5 years, ~120 bp for BBB against ~300 bp for BB (+180 bp), when A → BBB costs only +40 bp — the big jump sits at the IG/HY line',
      'Ford, 25 March 2020: S&P removes the last IG rating, ~36bn$ of debt switches — the HY pool grows by several percent in one day, and the widening pays for dislocation, not extra PD',
      'The institutional epilogue: the Fed explicitly includes fallen angels downgraded after 22 March in its credit purchases — acknowledging the cliff as a market-plumbing problem; Ford returns to IG in 2023',
    ],
    bonus: [
      'Qui vend au pire moment : les assureurs, gros porteurs naturels contraints par la notation, deviennent des vendeurs mécaniques de fallen angels — savoir QUI détient le risque dit comment la dislocation se propage',
      'La chronologie comme preuve : les spreads de Ford avaient explosé avant le 25 mars — le marché avait voté depuis des semaines ; la lettre n\'a pas apporté d\'information, elle a déclenché la règle',
    ],
    bonusEn: [
      'Who sells at the worst moment: insurers, large natural holders constrained by ratings, become mechanical sellers of fallen angels — knowing WHO holds the risk tells you how the dislocation propagates',
      'The chronology as proof: Ford\'s spreads had blown out before 25 March — the market had been voting for weeks; the letter brought no information, it triggered the rule',
    ],
    reponseModele: `Un **fallen angel** est un émetteur investment grade rétrogradé en high yield — le franchissement vers le bas de la seule ligne de l'échelle qui soit un mur : **BBB−/Baa3** contre **BB+/Ba1**. La rising star fait le chemin inverse.

Pourquoi une falaise ? Le point honnête d'abord : statistiquement, ce cran n'a rien de spécial — le risque croît continûment le long de l'échelle. Ce qui est discontinu, c'est l'**usage** de la note : les mandats institutionnels écrivent « IG uniquement », les indices IG et HY sont disjoints, le collatéral BCE et les pondérations de Bâle changent de régime. La dégradation déclenche donc des ventes **mécaniques**, simultanées, non discrétionnaires — face à un gisement HY plusieurs fois plus petit que l'IG (en euro, ~3 000 Md€ contre ~400 Md€), incapable d'absorber d'un coup la dette d'un géant. Le spread s'écarte alors *au-delà* du risque de crédit : c'est une **prime de dislocation**, pas de défaut. La courbe le montre : à 5 ans, BBB ~120 pb, BB ~300 pb — +180 pb à la frontière, quand A → BBB n'en coûte que 40.

L'illustration canonique : **Ford, 25 mars 2020** — S&P retire le dernier rating IG, ~36 Md$ basculent, le plus gros ange déchu de l'histoire. Les spreads avaient explosé *avant* (le marché avait voté), la seconde vague est venue *après* : les ventes des mandats. Épilogue : la Fed a inclus les fallen angels post-22 mars dans ses achats — aveu officiel que la falaise est de la plomberie de marché. Ford est redevenu IG en 2023.`,
    reponseModeleEn: `A **fallen angel** is an investment-grade issuer downgraded to high yield — crossing, on the way down, the only line of the scale that is a wall: **BBB−/Baa3** versus **BB+/Ba1**. The rising star travels the other way, and the two paths are not symmetric.

Why a cliff? The honest point first: statistically, this notch is nothing special — risk grows continuously along the scale. What is discontinuous is the **use** of the rating: institutional mandates say "IG only", IG and HY indices are disjoint, ECB collateral and Basel weights change regime. The downgrade therefore triggers **mechanical**, simultaneous, non-discretionary selling — into a HY pool several times smaller than IG (in euro, ~3,000bn€ against ~400bn€), unable to absorb a giant\'s debt at once. The spread then widens *beyond* credit risk alone: a **dislocation premium**, not a default premium. The curve shows it: at 5 years, BBB ~120 bp, BB ~300 bp — +180 bp at the frontier, when A → BBB costs only 40.

The canonical illustration: **Ford, 25 March 2020** — S&P removes the last IG rating, ~36bn$ switch, the largest fallen angel in history. Spreads had blown out *before* (the market had voted), the second wave came *after*: the mandates\' selling. Epilogue: the Fed included post-22-March fallen angels in its purchases — an official admission that the cliff is market plumbing. Ford returned to IG in 2023.`,
  },
  {
    id: 'm5-j-05',
    moduleId: M5,
    theme: 'PD × LGD : la perte attendue',
    themeEn: 'PD × LGD: expected loss',
    difficulte: 1,
    question: 'Expliquez EL = PD × LGD en 90 secondes, avec un exemple chiffré.',
    questionEn: 'Explain EL = PD × LGD in 90 seconds, with a numerical example.',
    plan: [
      'Poser les trois lettres : PD, la probabilité de défaut sur un an ; R, le recouvrement en % du nominal (~40 % pour du senior unsecured) ; LGD = 100 − R, ce qu\'on perd vraiment',
      'Faire la multiplication sur le cas d\'école : PD 2 %, LGD 60 % ⇒ EL = 1,2 % du nominal par an, soit un spread « actuariel » de 120 pb',
      'Préciser le statut : une ESPÉRANCE — l\'année réelle donne 0 ou −60, jamais −1,2 ; c\'est pour cela que les spreads observés sont au-dessus',
      'Donner la lecture inverse, celle du desk : PD implicite = spread/LGD — « le marché price quoi ? »',
    ],
    planEn: [
      'Set the three letters: PD, the one-year default probability; R, the recovery in % of par (~40% for senior unsecured); LGD = 100 − R, what you actually lose',
      'Run the multiplication on the textbook case: PD 2%, LGD 60% ⇒ EL = 1.2% of par per year, i.e. an "actuarial" spread of 120 bp',
      'State the status: an EXPECTATION — the actual year delivers 0 or −60, never −1.2; which is why observed spreads sit above it',
      'Give the inverse reading, the desk\'s: implied PD = spread/LGD — "what is the market pricing?"',
    ],
    pointsAttendus: [
      'La division du travail entre les lettres : PD dit SI, LGD dit COMBIEN — il faut les deux pour chiffrer quoi que ce soit',
      'La convention R ≈ 40 % : une moyenne historique du senior unsecured, pas une loi — la séniorité la fait bouger (secured 60-70 %, subordonné 20 % ou moins)',
      'Le cas d\'école récité de tête : 2 % × (1 − 0,40) = 1,2 % par an, converti en 120 pb de spread actuariel',
      'Le statut d\'espérance : la loterie est très asymétrique — presque toujours 0, parfois −60 % d\'un coup ; l\'EL est la moyenne, jamais un scénario',
      'La conséquence sur les prix : les spreads observés valent 5 à 15 fois l\'EL sur l\'IG — le spread rémunère le stress, l\'illiquidité et la fiscalité, pas la seule perte moyenne',
    ],
    pointsAttendusEn: [
      'The division of labour between the letters: PD says IF, LGD says HOW MUCH — you need both to price anything',
      'The R ≈ 40% convention: a historical average for senior unsecured, not a law — seniority moves it (secured 60-70%, subordinated 20% or less)',
      'The textbook case recited from memory: 2% × (1 − 0.40) = 1.2% per year, converted into 120 bp of actuarial spread',
      'The expectation status: the lottery is highly asymmetric — almost always 0, occasionally −60% at once; EL is the average, never a scenario',
      'The consequence for prices: observed spreads run 5 to 15 times EL on IG — the spread pays for stress, illiquidity and tax, not just the average loss',
    ],
    bonus: [
      'La version continue des pros : l\'intensité λ = −ln(1 − PD) et le triangle du crédit s ≈ λ × LGD — EL = PD × LGD n\'en est que la version discrète annuelle',
      'Le réflexe avant toute conversion : demander la séniorité — même émetteur, même PD, mais le rang dans la file d\'attente fixe R, donc tout le prix',
    ],
    bonusEn: [
      'The professionals\' continuous version: the intensity λ = −ln(1 − PD) and the credit triangle s ≈ λ × LGD — EL = PD × LGD is merely its discrete annual version',
      'The reflex before any conversion: ask for the seniority — same issuer, same PD, but the rank in the queue sets R, hence the whole price',
    ],
    reponseModele: `Trois lettres résument le métier. La **PD** est la probabilité que l'émetteur fasse défaut sur un an — c'est ce que les notes des agences encodent. Le **R** est le taux de recouvrement, ce qu'on récupère après le défaut, en % du nominal — convention de marché : **40 %** pour du senior unsecured, une moyenne historique, pas une loi. La **LGD** est le complément, ce qu'on perd vraiment : 100 − R, soit 60 % dans le cas standard. PD dit *si*, LGD dit *combien*.

La perte attendue les multiplie : **EL = PD × LGD**. Le cas d'école : PD 2 %, R 40 %, donc EL = 2 % × 60 % = **1,2 % du nominal par an** — converti en langue du desk, un spread « actuariel » de **120 pb**. C'est l'ordre de grandeur qu'on attend de tête, sans calculatrice.

Deux précisions qui font la différence. D'abord, l'EL est une **espérance** : l'année réelle ne donne jamais −1,2 % — elle donne 0 (le cas de très loin le plus fréquent) ou −60 % d'un coup. C'est précisément pour cela que les spreads observés cotent 5 à 15 fois l'EL sur l'investment grade : le marché paie le stress, pas la moyenne. Ensuite, la formule se lit dans les deux sens : le desk l'inverse tous les matins — PD implicite = spread/LGD, « le marché price quoi ? ». Trois lettres, une multiplication, deux sens de lecture : tout le module tient là.`,
    reponseModeleEn: `Three letters sum up the trade. **PD** is the probability that the issuer defaults within one year — it is what agency ratings encode. **R** is the recovery rate, what you get back after default, in % of par — market convention: **40%** for senior unsecured, a historical average, not a law. **LGD** is the complement, what you really lose: 100 − R, i.e. 60% in the standard case. PD says *if*, LGD says *how much*.

Expected loss multiplies them: **EL = PD × LGD**. The textbook case: PD 2%, R 40%, so EL = 2% × 60% = **1.2% of par per year** — converted into desk language, an "actuarial" spread of **120 bp**. That is the order of magnitude expected from memory, without a calculator.

Two refinements make the difference. First, EL is an **expectation**: the actual year never delivers −1.2% — it delivers 0 (by far the most frequent case) or −60% at once. That is precisely why observed spreads trade at 5 to 15 times EL on investment grade: the market pays for stress, not the average. Second, the formula reads both ways: the desk inverts it every morning — implied PD = spread/LGD, "what is the market pricing?". Three letters, one multiplication, two directions of reading: the whole module fits there.`,
  },
  {
    id: 'm5-j-06',
    moduleId: M5,
    theme: 'PD × LGD : la perte attendue',
    themeEn: 'PD × LGD: expected loss',
    difficulte: 2,
    question: 'Un émetteur a une PD de 2 % par an. Pourquoi son risque de défaut sur 5 ans ne fait-il PAS 10 % ?',
    questionEn: 'An issuer has a 2% annual PD. Why is its 5-year default risk NOT 10%?',
    plan: [
      'Nommer l\'erreur : le réflexe additif n × PD compte comme exposés au défaut des émetteurs déjà morts — pour faire défaut l\'année 3, il faut avoir survécu aux années 1 et 2',
      'Composer la survie : (1 − 0,02)⁵ = 90,392080 %, donc défaut cumulé = 9,607920 % — pas 10 %',
      'Montrer que l\'écart grandit : à PD 5 % sur 10 ans, l\'additif donne 50 % — un pile ou face — quand la composition rend 40,126306 %',
      'Refermer sur le mantra : les défauts ne s\'additionnent pas, ils se composent comme les intérêts du m4 — il faut être vivant pour mourir',
    ],
    planEn: [
      'Name the error: the additive reflex n × PD counts issuers already dead as still exposed to default — to default in year 3, you must have survived years 1 and 2',
      'Compound the survival: (1 − 0.02)⁵ = 90.392080%, so cumulative default = 9.607920% — not 10%',
      'Show the gap grows: at 5% PD over 10 years, the additive rule gives 50% — a coin flip — when compounding yields 40.126306%',
      'Close on the mantra: defaults do not add up, they compound like m4 interest — you must be alive to die',
    ],
    pointsAttendus: [
      'Le bon objet à composer : la SURVIE, pas le défaut — P(survie sur n ans) = (1 − PD)ⁿ, P(défaut cumulé) = 1 − (1 − PD)ⁿ',
      'Le chiffre exact du cas d\'école : (0,98)⁵ = 90,392080 % de survie, soit 9,607920 % de défaut cumulé ≈ 9,61 %',
      'La raison profonde : chaque année de survie réduit la population encore exposée — l\'additif compte des morts parmi les candidats au défaut',
      'L\'écart qui explose avec l\'horizon et la PD : PD 5 % sur 10 ans donne 40,13 % composé contre 50 % additif — dix points d\'écart',
      'Le lien avec le m4 : c\'est la même mécanique que la composition des intérêts, appliquée aux probabilités de survie',
    ],
    pointsAttendusEn: [
      'The right object to compound: SURVIVAL, not default — P(survival over n years) = (1 − PD)ⁿ, P(cumulative default) = 1 − (1 − PD)ⁿ',
      'The exact textbook figure: (0.98)⁵ = 90.392080% survival, i.e. 9.607920% cumulative default ≈ 9.61%',
      'The deep reason: each year of survival shrinks the population still exposed — the additive rule counts the dead among default candidates',
      'The gap exploding with horizon and PD: 5% PD over 10 years gives 40.13% compounded against 50% additive — ten points of difference',
      'The link to m4: it is the same mechanics as interest compounding, applied to survival probabilities',
    ],
    bonus: [
      'La borne qui ridiculise l\'additif : à PD 5 % sur 30 ans, la règle additive promet 150 % de « probabilité » quand la composition plafonne vers 78,5 % — la règle fausse viole les axiomes avant de violer l\'intuition',
      'La version continue : survie = e^(−λt) avec λ = −ln(1 − PD) — pour PD 2 %, λ = 2,0203 %, quasi identique, car ln(1 − x) ≈ −x pour x petit',
    ],
    bonusEn: [
      'The bound that ridicules the additive rule: at 5% PD over 30 years, it promises 150% of "probability" while compounding caps out near 78.5% — the wrong rule violates the axioms before it violates intuition',
      'The continuous version: survival = e^(−λt) with λ = −ln(1 − PD) — for PD 2%, λ = 2.0203%, nearly identical, since ln(1 − x) ≈ −x for small x',
    ],
    reponseModele: `Parce que le réflexe additif — 5 × 2 % = 10 % — commet une erreur de population : il compte comme exposés au défaut de l'année 4 des émetteurs déjà morts en année 2. Pour faire défaut l'année 3, il faut avoir **survécu** aux années 1 et 2 : les défauts ne s'additionnent pas, ils se **composent** — exactement comme les intérêts du module 4, mais en probabilités de survie.

Le bon calcul compose donc la survie : P(survie sur n ans) = (1 − PD)ⁿ. Sur le cas d'école : (0,98)⁵ = **90,392080 %** de survie, donc un défaut cumulé de **9,607920 %** — pas 10 %. L'écart semble cosmétique ? Il grandit avec l'horizon et avec la PD. À PD 5 % sur 10 ans, l'additif donne 50 % — un pile ou face — quand la composition rend **40,126306 %** : dix points d'écart, uniquement parce que chaque année de survie réduit la population encore exposée. Et à 30 ans, la règle additive promet 150 % de « probabilité » — elle viole les axiomes avant de violer l'intuition — quand la courbe composée plafonne vers 78,5 %.

Le mantra à réciter : **il faut être vivant pour mourir**. C'est LE piège du chapitre, et il est symétrique de la capitalisation : le m4 composait des taux, le crédit compose des survies — la même machine, tournée vers la mortalité.`,
    reponseModeleEn: `Because the additive reflex — 5 × 2% = 10% — makes a population error: it counts issuers already dead in year 2 as still exposed to default in year 4. To default in year 3, you must have **survived** years 1 and 2: defaults do not add up, they **compound** — exactly like module 4 interest, but in survival probabilities.

The right calculation therefore compounds survival: P(survival over n years) = (1 − PD)ⁿ. On the textbook case: (0.98)⁵ = **90.392080%** survival, hence a cumulative default of **9.607920%** — not 10%. Does the gap look cosmetic? It grows with the horizon and with the PD. At 5% PD over 10 years, the additive rule gives 50% — a coin flip — while compounding yields **40.126306%**: ten points of difference, purely because each year of survival shrinks the population still exposed. And at 30 years, the additive rule promises 150% of "probability" — it violates the axioms before it violates intuition — while the compounded curve caps out near 78.5%.

The mantra to recite: **you must be alive to die**. It is THE trap of the chapter, and it mirrors capitalisation: m4 compounded rates, credit compounds survivals — the same machine, turned towards mortality.`,
  },
  {
    id: 'm5-j-07',
    moduleId: M5,
    theme: 'PD × LGD : la perte attendue',
    themeEn: 'PD × LGD: expected loss',
    difficulte: 2,
    question: 'Calcul de tête : une obligation cote 300 pb de spread, recouvrement 40 %. Quelle probabilité de défaut le marché price-t-il ?',
    questionEn: 'Mental arithmetic: a bond trades at 300 bp of spread, recovery 40%. What default probability is the market pricing?',
    plan: [
      'Convertir : 300 pb = 3 % par an de spread',
      'Inverser la formule centrale : si le spread compensait exactement le défaut, spread = PD × LGD, donc PD = spread/LGD',
      'Calculer de tête : LGD = 1 − 0,40 = 0,60 ; PD = 3 %/0,60 = 5 % par an — un défaut tous les vingt ans-émetteur',
      'Qualifier le résultat : une PD RISQUE-NEUTRE, qui surestime la fréquence historique — le spread contient les primes de risque et de liquidité',
    ],
    planEn: [
      'Convert: 300 bp = 3% per year of spread',
      'Invert the central formula: if the spread exactly compensated default, spread = PD × LGD, so PD = spread/LGD',
      'Compute mentally: LGD = 1 − 0.40 = 0.60; PD = 3%/0.60 = 5% per year — one default every twenty issuer-years',
      'Qualify the result: a RISK-NEUTRAL PD, which overstates the historical frequency — the spread contains the risk and liquidity premia',
    ],
    pointsAttendus: [
      'La conversion immédiate : 100 pb = 1 %, donc 300 pb = 3 %',
      'La bonne opération : DIVISER par la LGD, pas multiplier — on ne perd que 60 % du nominal, donc chaque point de spread « couvre » plus que son poids de PD',
      'Le résultat net : 3/0,6 = 5 % par an, énoncé sans hésiter',
      'L\'erreur classique à éviter : confondre spread et PD (3 %) ou multiplier par la LGD (1,8 %)',
      'La qualification finale : cette PD est risque-neutre — « le marché price 5 % » est juste, « le marché prévoit 5 % » est faux ; l\'historique est plus bas d\'un facteur 2 à 5',
    ],
    pointsAttendusEn: [
      'The immediate conversion: 100 bp = 1%, so 300 bp = 3%',
      'The right operation: DIVIDE by LGD, do not multiply — you only lose 60% of par, so each point of spread "covers" more than its weight in PD',
      'The clean result: 3/0.6 = 5% per year, stated without hesitation',
      'The classic errors to avoid: confusing spread with PD (3%) or multiplying by LGD (1.8%)',
      'The final qualification: this PD is risk-neutral — "the market prices 5%" is right, "the market forecasts 5%" is wrong; the historical figure is lower by a factor of 2 to 5',
    ],
    bonus: [
      'La variante qui teste la LGD : même spread sur une subordonnée à R = 0 % ⇒ PD implicite 3 % ; sur du secured à R = 70 % ⇒ 10 % — le recouvrement est la moitié du calcul',
      'Le raccourci d\'indice : un Crossover à 300 pb avec R = 40 % price ~5 % de PD moyenne annuelle sur ses 75 noms — la lecture s\'applique telle quelle aux indices CDS',
    ],
    bonusEn: [
      'The variant that tests LGD: the same spread on a subordinated bond at R = 0% ⇒ implied PD 3%; on secured paper at R = 70% ⇒ 10% — recovery is half the calculation',
      'The index shortcut: a Crossover at 300 bp with R = 40% prices ~5% average annual PD across its 75 names — the reading applies as is to CDS indices',
    ],
    reponseModele: `Le calcul tient en trois gestes, à voix haute. **Un** : convertir — 300 pb, c'est 3 % par an de spread. **Deux** : poser la logique — si le spread compensait exactement la perte moyenne, on aurait spread = PD × LGD ; l'inconnue est la PD, donc PD = spread/LGD. **Trois** : diviser — LGD = 1 − 0,40 = 0,60, donc PD = 3 %/0,60 = **5 % par an**. Le marché price un défaut tous les vingt ans-émetteur.

Les deux erreurs qui coûtent des points : confondre le spread et la PD (« 3 % ») — c'est oublier qu'on ne perd que 60 % du nominal, donc qu'il faut *moins* d'un point de PD par point de spread encaissé, d'où la division ; ou multiplier au lieu de diviser (« 1,8 % ») — 1,8 % est l'EL qu'aurait une PD de 3 %, pas la PD implicite d'un spread de 300 pb.

Et la phrase qui transforme un calcul juste en réponse de desk : cette PD est **risque-neutre**. Le spread contient une prime de risque et une prime de liquidité ; la PD implicite les absorbe et **surestime** donc la fréquence historique des défauts, souvent d'un facteur 2 à 5. « Le marché price 5 % » est exact ; « le marché prévoit 5 % » est le piège. Bonus de mémoire : la formule marche telle quelle sur les indices — un Crossover à 300 pb raconte la même chose sur 75 noms à la fois.`,
    reponseModeleEn: `The calculation takes three moves, out loud. **One**: convert — 300 bp is 3% a year of spread. **Two**: set the logic — if the spread exactly compensated the average loss, we would have spread = PD × LGD; the unknown is PD, so PD = spread/LGD. **Three**: divide — LGD = 1 − 0.40 = 0.60, so PD = 3%/0.60 = **5% per year**. The market prices one default every twenty issuer-years.

The two errors that cost marks: confusing the spread with the PD ("3%") — forgetting that you only lose 60% of par, so *less* than one point of PD is covered by each point of spread collected, hence the division; or multiplying instead of dividing ("1.8%") — 1.8% is the EL a 3% PD would produce, not the PD implied by a 300 bp spread.

And the sentence that turns a correct calculation into a desk answer: this PD is **risk-neutral**. The spread contains a risk premium and a liquidity premium; the implied PD absorbs them and therefore **overstates** the historical default frequency, often by a factor of 2 to 5. "The market prices 5%" is exact; "the market forecasts 5%" is the trap. Memory bonus: the formula works as is on indices — a Crossover at 300 bp tells the same story across 75 names at once.`,
  },
  {
    id: 'm5-j-08',
    moduleId: M5,
    theme: 'PD × LGD : la perte attendue',
    themeEn: 'PD × LGD: expected loss',
    difficulte: 2,
    question: 'Brainteaser : un émetteur a une PD de 5 % par an. Sur 10 ans, survivre est-il un pile ou face ?',
    questionEn: 'Brainteaser: an issuer has a 5% annual PD. Over 10 years, is survival a coin flip?',
    plan: [
      'Refuser le piège : 10 × 5 % = 50 % est la règle additive, et elle est fausse — elle compte des morts parmi les exposés',
      'Composer : survie = (0,95)¹⁰ — de tête, (0,95)² = 0,9025, puis (0,9025)⁵ ≈ 0,60',
      'Donner les valeurs exactes : survie 59,873694 %, défaut cumulé 40,126306 % — trois chances sur cinq de survivre, pas une sur deux',
      'Expliquer l\'écart de dix points : chaque année de survie réduit la population encore exposée au défaut',
    ],
    planEn: [
      'Refuse the trap: 10 × 5% = 50% is the additive rule, and it is wrong — it counts the dead among the exposed',
      'Compound: survival = (0.95)¹⁰ — mentally, (0.95)² = 0.9025, then (0.9025)⁵ ≈ 0.60',
      'Give the exact values: survival 59.873694%, cumulative default 40.126306% — three chances in five of surviving, not one in two',
      'Explain the ten-point gap: each year of survival shrinks the population still exposed to default',
    ],
    pointsAttendus: [
      'La réponse franche : non — la survie vaut environ 60 %, le défaut cumulé environ 40 %, pas 50/50',
      'Le calcul posé proprement : (1 − 0,05)¹⁰ = (0,95)¹⁰ = 59,873694 % de survie, donc 40,126306 % de défaut cumulé',
      'L\'astuce de calcul mental : élever au carré puis à la puissance 5 — (0,95)² = 0,9025 ≈ 0,90, et (0,90)⁵ ≈ 0,59-0,60',
      'Le diagnostic de l\'erreur : l\'additif 10 × 5 % suppose que les émetteurs morts en année 2 peuvent encore mourir en année 7',
      'La généralisation : l\'écart additif/composé grandit avec l\'horizon et la PD — négligeable à 2 %/5 ans (9,61 contre 10), dix points ici',
    ],
    pointsAttendusEn: [
      'The straight answer: no — survival is about 60%, cumulative default about 40%, not 50/50',
      'The calculation laid out cleanly: (1 − 0.05)¹⁰ = (0.95)¹⁰ = 59.873694% survival, hence 40.126306% cumulative default',
      'The mental-math trick: square then raise to the fifth power — (0.95)² = 0.9025 ≈ 0.90, and (0.90)⁵ ≈ 0.59-0.60',
      'The diagnosis of the error: the additive 10 × 5% assumes issuers dead in year 2 can still die in year 7',
      'The generalisation: the additive/compounded gap grows with horizon and PD — negligible at 2%/5 years (9.61 versus 10), ten points here',
    ],
    bonus: [
      'Le miroir avec la capitalisation du m4 : « combien d\'années à 5 % pour doubler ? » et « quelle survie à PD 5 % sur 10 ans ? » sont la même question, posée à une exponentielle — l\'une vers le haut, l\'autre vers le bas',
      'La lecture de portefeuille : sur 100 noms indépendants à PD 5 %, environ 40 auront fait défaut en dix ans — le high yield est un métier de rotation des survivants, pas de buy-and-hold',
    ],
    bonusEn: [
      'The mirror with m4 compounding: "how many years at 5% to double?" and "what survival at 5% PD over 10 years?" are the same question, asked of an exponential — one upwards, one downwards',
      'The portfolio reading: out of 100 independent names at 5% PD, about 40 will have defaulted within ten years — high yield is a business of rotating survivors, not buy-and-hold',
    ],
    reponseModele: `Non — et le jury attend que vous démontiez le « 50/50 » avant de calculer. L'intuition 10 × 5 % = 50 % est la règle **additive**, et elle est fausse : elle compte comme candidats au défaut de l'année 7 des émetteurs déjà morts en année 2. On ne cumule pas des défauts, on compose des **survies**.

Le calcul, de tête : survie = (0,95)¹⁰. Passez par le carré : (0,95)² = 0,9025, proche de 0,90 ; puis (0,90)⁵ ≈ 0,59. La valeur exacte : **59,873694 % de survie**, soit **40,126306 % de défaut cumulé**. Survivre n'est donc pas un pile ou face : c'est environ **trois chances sur cinq** — dix points entiers au-dessus de ce que promettait l'additif, uniquement parce que chaque année de survie réduit la population encore exposée. Il faut être vivant pour mourir.

Et la remarque qui montre la maîtrise : l'écart entre les deux règles n'est pas constant — il **grandit** avec l'horizon et la PD. À PD 2 % sur 5 ans, la composition donne 9,61 % contre 10 % additif : presque rien. Ici, dix points. À 30 ans de PD 5 %, l'additif promettrait 150 % — un non-sens — quand la composition plafonne vers 78,5 %. En portefeuille, la lecture est concrète : sur 100 noms à PD 5 %, environ 40 seront morts dans dix ans — le high yield se gère en rotation, pas en buy-and-hold.`,
    reponseModeleEn: `No — and the jury expects you to dismantle the "50/50" before calculating. The intuition 10 × 5% = 50% is the **additive** rule, and it is wrong: it counts issuers already dead in year 2 as candidates for default in year 7. You do not accumulate defaults, you compound **survivals**.

The calculation, mentally: survival = (0.95)¹⁰. Go through the square: (0.95)² = 0.9025, close to 0.90; then (0.90)⁵ ≈ 0.59. The exact value: **59.873694% survival**, i.e. **40.126306% cumulative default**. Surviving is therefore not a coin flip: it is about **three chances in five** — a full ten points above what the additive rule promised, purely because each year of survival shrinks the population still exposed. You must be alive to die.

And the remark that shows mastery: the gap between the two rules is not constant — it **grows** with horizon and PD. At 2% PD over 5 years, compounding gives 9.61% against 10% additive: almost nothing. Here, ten points. At 30 years of 5% PD, the additive rule would promise 150% — nonsense — while compounding caps out near 78.5%. In a portfolio, the reading is concrete: out of 100 names at 5% PD, about 40 will be dead within ten years — high yield is managed by rotation, not buy-and-hold.`,
  },
  {
    id: 'm5-j-09',
    moduleId: M5,
    theme: 'PD × LGD : la perte attendue',
    themeEn: 'PD × LGD: expected loss',
    difficulte: 3,
    question: 'Brainteaser : le Crossover cote 450 pb et le Main 60 pb, R = 40 % dans les deux cas. Quelles PD implicites — et faut-il les croire ?',
    questionEn: 'Brainteaser: the Crossover trades at 450 bp and the Main at 60 bp, R = 40% in both cases. What implied PDs — and should you believe them?',
    plan: [
      'Poser la formule une fois : PD = spread/LGD, avec LGD = 0,60',
      'Calculer les deux de tête : Crossover 4,5 %/0,6 = 7,5 % par an ; Main 0,6 %/0,6 = 1 % par an',
      'Situer les niveaux : Main 60 pb et Crossover 450 pb sont dans leurs fourchettes de temps calme (50-80 et 250-400) — le HY en haut de la sienne',
      'Répondre à la seconde question : non — des PD risque-neutres, qui surestiment l\'historique d\'un facteur 2 à 5 ; l\'écart EST la prime encaissée par le porteur',
    ],
    planEn: [
      'State the formula once: PD = spread/LGD, with LGD = 0.60',
      'Compute both mentally: Crossover 4.5%/0.6 = 7.5% per year; Main 0.6%/0.6 = 1% per year',
      'Place the levels: Main 60 bp and Crossover 450 bp sit within their calm ranges (50-80 and 250-400) — HY at the top of its own',
      'Answer the second question: no — risk-neutral PDs, overstating the historical record by a factor of 2 to 5; the gap IS the premium the holder collects',
    ],
    pointsAttendus: [
      'Les deux conversions propres : 450 pb = 4,5 % et 60 pb = 0,6 %',
      'Les deux divisions de tête : 4,5/0,6 = 7,5 % par an pour le Crossover ; 0,6/0,6 = 1 % par an pour le Main',
      'La connaissance des indices : iTraxx Main = 125 noms IG européens, Crossover = 75 noms HY — repères calmes 50-80 pb et 250-400 pb',
      'Le refus de croire les chiffres au premier degré : PD risque-neutres, pas des prévisions — la fréquence historique est plus basse (facteur 2 à 5)',
      'La lecture relative qui impressionne : le ratio des spreads (7,5×) donne la hiérarchie du doute entre IG et HY en une division — c\'est la température du crédit en deux cotes',
    ],
    pointsAttendusEn: [
      'The two clean conversions: 450 bp = 4.5% and 60 bp = 0.6%',
      'The two mental divisions: 4.5/0.6 = 7.5% per year for the Crossover; 0.6/0.6 = 1% per year for the Main',
      'Knowledge of the indices: iTraxx Main = 125 European IG names, Crossover = 75 HY names — calm anchors 50-80 bp and 250-400 bp',
      'Refusing to take the figures at face value: risk-neutral PDs, not forecasts — the historical frequency is lower (factor of 2 to 5)',
      'The relative reading that impresses: the spread ratio (7.5×) gives the hierarchy of doubt between IG and HY in one division — the temperature of credit in two quotes',
    ],
    bonus: [
      'Le croisement avec le chapitre 2 : 1 % par an sur du Main IG, c\'est déjà plus que la fréquence historique d\'un panier BBB (~0,3 %) — la prime de risque se lit directement dans l\'écart',
      'Le réflexe de série : les indices roulent tous les six mois (mars et septembre) — comparer deux niveaux d\'indice exige de vérifier qu\'on parle de la même série',
    ],
    bonusEn: [
      'The cross-check with chapter 2: 1% per year on IG Main is already more than the historical frequency of a BBB basket (~0.3%) — the risk premium can be read directly in the gap',
      'The series reflex: the indices roll every six months (March and September) — comparing two index levels requires checking you are talking about the same series',
    ],
    reponseModele: `La formule d'abord, une seule fois : PD implicite = spread/LGD, et LGD = 1 − 0,40 = 0,60.

Les deux divisions, de tête. **Crossover** : 450 pb = 4,5 % ; 4,5/0,6 = **7,5 % par an** — le marché price un défaut tous les treize ans environ sur ses 75 noms high yield. **Main** : 60 pb = 0,6 % ; 0,6/0,6 = **1 % par an** sur ses 125 noms investment grade. Au passage, situez les niveaux : le Main est au cœur de sa fourchette de temps calme (50-80 pb), le Crossover en haut de la sienne (250-400 pb) — le marché dort côté IG et s'interroge côté HY.

Faut-il les croire ? **Non — pas au premier degré.** Ce sont des PD **risque-neutres** : les spreads contiennent une prime de risque (défauts en grappes dans les récessions) et une prime de liquidité, que la formule absorbe dans la probabilité. La fréquence historique est plus basse, souvent d'un facteur 2 à 5 — 1 % par an sur du Main est déjà au-dessus des ~0,3 % historiques d'un panier BBB. L'écart n'est pas une erreur : c'est la **rémunération** de celui qui porte.

La lecture qui reste : deux cotes, deux divisions, et vous avez la hiérarchie complète du doute — le HY price sept fois et demie le défaut de l'IG. C'est la température du crédit, prise en dix secondes.`,
    reponseModeleEn: `The formula first, once: implied PD = spread/LGD, and LGD = 1 − 0.40 = 0.60.

The two divisions, mentally. **Crossover**: 450 bp = 4.5%; 4.5/0.6 = **7.5% per year** — the market prices one default roughly every thirteen years across its 75 high yield names. **Main**: 60 bp = 0.6%; 0.6/0.6 = **1% per year** across its 125 investment grade names. In passing, place the levels: the Main sits in the middle of its calm range (50-80 bp), the Crossover at the top of its own (250-400 bp) — the market is asleep on IG and starting to wonder about HY.

Should you believe them? **No — not at face value.** These are **risk-neutral** PDs: the spreads contain a risk premium (defaults clustering in recessions) and a liquidity premium, which the formula absorbs into the probability. The historical frequency is lower, often by a factor of 2 to 5 — 1% per year on the Main already exceeds the ~0.3% historical rate of a BBB basket. The gap is not an error: it is the **compensation** of whoever carries the risk.

The reading that stays: two quotes, two divisions, and you have the full hierarchy of doubt — HY prices seven and a half times the default of IG. That is the temperature of credit, taken in ten seconds.`,
  },
  {
    id: 'm5-j-10',
    moduleId: M5,
    theme: 'pricer une obligation risquée',
    themeEn: 'pricing a risky bond',
    difficulte: 2,
    question: 'Un high yield à 7 % de coupon avec 5 % de défauts attendus par an : bonne affaire ?',
    questionEn: 'A high yield bond with a 7% coupon and 5% expected defaults per year: a good deal?',
    plan: [
      'Refuser de répondre sur le brut : le rendement affiché suppose que tout le monde paie — il faut netter des pertes attendues avant toute comparaison',
      'Calculer la facture : EL = PD × LGD = 5 % × 0,60 = 3 % par an (R = 40 %)',
      'Netter : 7 − 3 = 4 % de rendement net des défauts — à comparer au sans-risque : battu par un 4,5 %, à peine au-dessus d\'une OAT à 3 %, pour infiniment plus de risque',
      'Nommer le piège : le gros coupon n\'était pas du rendement mais un remboursement anticipé de pertes quasi certaines, déguisé en revenu — on compare le NET, jamais le brut',
    ],
    planEn: [
      'Refuse to answer on the gross figure: the displayed yield assumes everyone pays — you must net out expected losses before any comparison',
      'Compute the bill: EL = PD × LGD = 5% × 0.60 = 3% per year (R = 40%)',
      'Net it: 7 − 3 = 4% yield net of defaults — to be compared with the risk-free rate: beaten by 4.5%, barely above a 3% OAT, for infinitely more risk',
      'Name the trap: the fat coupon was not yield but an advance repayment of near-certain losses, disguised as income — you compare the NET, never the gross',
    ],
    pointsAttendus: [
      'Le réflexe fondateur : rendement net = rendement nominal − PD × LGD — c\'est ce net, jamais le brut, qui se compare au sans-risque',
      'Le calcul propre : avec R = 40 %, LGD = 60 %, la perte attendue vaut 5 % × 0,60 = 3 % par an, et le net tombe à 7 − 3 = 4 %',
      'La comparaison qui décide : face à un sans-risque à 4,5 %, le HY est battu — 4 % contre 4,5 %, pour un risque sans commune mesure',
      'Le diagnostic : une PD de 5 % par an est un simple B en fin de cycle — le coupon rémunérait d\'abord des défauts quasi programmés',
      'La sensibilité au cycle : à PD 3 %, le même portefeuille rendait 5,2 % net — rien n\'a changé dans le book, seule l\'espérance de défauts a bougé',
      'La question de desk à réciter : « net des défauts, il reste quoi ? » — le filtre de toute idée de trade en crédit',
    ],
    pointsAttendusEn: [
      'The founding reflex: net yield = nominal yield − PD × LGD — it is this net figure, never the gross, that gets compared with the risk-free rate',
      'The clean calculation: with R = 40%, LGD = 60%, expected loss is 5% × 0.60 = 3% per year, and the net drops to 7 − 3 = 4%',
      'The comparison that decides: against a risk-free rate at 4.5%, the HY is beaten — 4% versus 4.5%, for incomparably more risk',
      'The diagnosis: a 5% annual PD is a plain B late in the cycle — the coupon primarily paid for near-programmed defaults',
      'The cycle sensitivity: at 3% PD, the same portfolio returned 5.2% net — nothing changed in the book, only the expected defaults moved',
      'The desk question to recite: "net of defaults, what is left?" — the filter for any trade idea in credit',
    ],
    bonus: [
      'Le point conceptuel : la perte attendue est un coût économique immédiat, pas un événement futur hypothétique — c\'est exactement pour cela que les spreads s\'écartent avant les défauts',
      'La double peine ignorée par le calcul : l\'EL est une moyenne — en récession les défauts arrivent en grappes, et le 4 % net peut devenir très négatif l\'année où la queue se réalise',
    ],
    bonusEn: [
      'The conceptual point: expected loss is an immediate economic cost, not a hypothetical future event — which is exactly why spreads widen before defaults happen',
      'The double jeopardy the calculation ignores: EL is an average — in a recession defaults arrive in clusters, and the 4% net can turn deeply negative the year the tail materialises',
    ],
    reponseModele: `Le seul réflexe interdit est de répondre sur le brut. Un rendement affiché de 7 % suppose que *tout le monde paie* — or l'énoncé vous dit le contraire : 5 % de défauts attendus par an. Il faut netter avant de comparer.

La facture : avec le recouvrement conventionnel de 40 %, la LGD vaut 60 %, et la perte attendue annuelle EL = PD × LGD = 5 % × 0,60 = **3 % par an**. Le rendement net des défauts tombe donc à 7 − 3 = **4 %**. Face à un sans-risque à 4,5 %, le verdict est sans appel : **battu** — 4 % contre 4,5 %, pour infiniment plus de risque ; même face à une OAT à 3 %, il ne reste qu'un point pour porter du simple B en fin de cycle. Le « gros coupon » n'était pas du rendement : c'était un **remboursement anticipé de pertes quasi certaines, déguisé en revenu** — l'erreur récurrente des chasseurs de rendement.

Deux compléments qui font la bonne copie. La sensibilité au cycle : à PD 3 %, le même portefeuille rendait 5,2 % net — rien n'a changé dans le book, seule l'espérance de défauts a bougé. Et le rappel que l'EL est une *moyenne* : en récession, les défauts arrivent en grappes, et le 4 % net peut devenir très négatif l'année où la queue se réalise. La question de desk, à réciter telle quelle : « **net des défauts, il reste quoi ?** » — on compare le net, jamais le brut.`,
    reponseModeleEn: `The one forbidden reflex is answering on the gross figure. A displayed 7% yield assumes *everyone pays* — yet the question tells you otherwise: 5% expected defaults per year. You must net before comparing.

The bill: with the conventional 40% recovery, LGD is 60%, and the annual expected loss EL = PD × LGD = 5% × 0.60 = **3% per year**. The yield net of defaults therefore falls to 7 − 3 = **4%**. Against a risk-free rate at 4.5%, the verdict is final: **beaten** — 4% versus 4.5%, for incomparably more risk; and even against a 3% OAT, only one point remains as compensation for carrying plain single-B paper late in the cycle. The "fat coupon" was not yield: it was an **advance repayment of near-certain losses, disguised as income** — the recurring error of yield chasers.

Two additions make a strong answer. The cycle sensitivity: at 3% PD, the same portfolio returned 5.2% net — nothing changed in the book, only the expected defaults moved. And the reminder that EL is an *average*: in a recession defaults arrive in clusters, and the 4% net can turn deeply negative the year the tail materialises. The desk question, to recite verbatim: "**net of defaults, what is left?**" — you compare the net, never the gross.`,
  },
  {
    id: 'm5-j-11',
    moduleId: M5,
    theme: 'pricer une obligation risquée',
    themeEn: 'pricing a risky bond',
    difficulte: 2,
    question: 'Votre portefeuille a une spread duration de 7 et les spreads s\'écartent de 300 pb. Que se passe-t-il ?',
    questionEn: 'Your portfolio has a spread duration of 7 and spreads widen by 300 bp. What happens?',
    plan: [
      'Donner le chiffre immédiatement : ΔP ≈ −D × Δs = −7 × 3 % = −21 % — un portefeuille obligataire qui perd comme une action',
      'Rappeler l\'arithmétique : la spread duration est la duration du m4 appliquée au spread — même dérivée, autre source de choc ; attention à la conversion 300 pb = 3 %',
      'Préciser le point conceptuel : aucun défaut n\'a encore eu lieu — la perte est un repricing du risque, pas une réalisation',
      'Élargir aux deux jambes : un corporate se dérive deux fois, Δr et Δs — en crise elles jouent souvent en sens inverse (flight to quality), coussin pour l\'IG, pas pour le HY',
    ],
    planEn: [
      'Give the number immediately: ΔP ≈ −D × Δs = −7 × 3% = −21% — a bond portfolio losing like an equity book',
      'Recall the arithmetic: spread duration is m4 duration applied to the spread — same derivative, different shock source; mind the conversion 300 bp = 3%',
      'Make the conceptual point: no default has happened yet — the loss is a repricing of risk, not a realisation',
      'Widen to the two legs: a corporate differentiates twice, Δr and Δs — in a crisis they often move opposite ways (flight to quality), a cushion for IG, none for HY',
    ],
    pointsAttendus: [
      'Le calcul sans hésiter : ΔP/P ≈ −D_mod × Δs = −7 × 300/100 = −21 %',
      'La conversion maîtrisée : 300 pb = 3 %, pas 0,3 % — l\'erreur d\'un facteur dix est la faute classique',
      'Le concept : le spread est une classe de risque à part entière, avec sa propre duration — la même arithmétique que la duration taux du m4',
      'La précision qui distingue : −21 % sans qu\'un seul défaut soit réalisé — le marché reprice le doute, pas les pertes courantes',
      'La double dérivée du corporate : ΔP ≈ −D × (Δr + Δs) — en crise, les taux sans risque baissent souvent quand les spreads explosent (flight to quality) : l\'IG long est partiellement couvert, le HY dominé par le spread ne l\'est pas',
      'L\'ordre de grandeur de contexte : +300 pb est un écartement type crise — 2008, COVID — pas un scénario d\'école',
    ],
    pointsAttendusEn: [
      'The calculation without hesitation: ΔP/P ≈ −D_mod × Δs = −7 × 300/100 = −21%',
      'The conversion mastered: 300 bp = 3%, not 0.3% — the factor-of-ten slip is the classic mistake',
      'The concept: the spread is a risk class in its own right, with its own duration — the same arithmetic as m4 rate duration',
      'The distinguishing precision: −21% without a single realised default — the market reprices the doubt, not the running losses',
      'The corporate\'s double derivative: ΔP ≈ −D × (Δr + Δs) — in a crisis, risk-free rates often fall as spreads explode (flight to quality): long IG is partly hedged, spread-dominated HY is not',
      'The context order of magnitude: +300 bp is a crisis-type widening — 2008, COVID — not a textbook scenario',
    ],
    bonus: [
      'La question piège qui suit souvent : « votre portefeuille corporate est-il long ou court les taux ? » — la réponse exige de séparer les deux jambes, taux et spread, qui peuvent être de sens opposés',
      'Le pont avec le cycle : cette sensibilité est la raison pour laquelle les spreads HY sont un indicateur avancé qui parle fort — quand il parle, c\'est en dizaines de pour cent de book',
    ],
    bonusEn: [
      'The trick follow-up that often comes: "is your corporate portfolio long or short rates?" — the answer requires separating the two legs, rates and spread, which can point opposite ways',
      'The bridge to the cycle: this sensitivity is why HY spreads are a leading indicator that speaks loudly — when it speaks, it speaks in tens of percent of the book',
    ],
    reponseModele: `Le chiffre d'abord : ΔP/P ≈ −D × Δs = −7 × 3 % = **−21 %**. Un cinquième du portefeuille, effacé par un seul mouvement de spread — un book *obligataire* qui perd comme un book actions.

L'arithmétique est exactement celle de la duration du module 4 : la variation de prix est la duration modifiée multipliée par le choc de rendement — simplement, le choc vient ici du **crédit**, pas des taux. C'est la **spread duration**, et elle fait du spread une classe de risque à part entière. Le piège d'exécution à éviter : 300 pb = 3 %, pas 0,3 % — l'erreur d'un facteur dix est la faute classique. Et l'ordre de grandeur : +300 pb est un écartement type crise — 2008, COVID.

Le point conceptuel qui distingue une bonne réponse : **aucun défaut n'a encore eu lieu**. Les −21 % sont un repricing du doute, pas une réalisation de pertes — le marché exige plus pour porter le même risque, et la valorisation encaisse immédiatement.

Enfin, élargissez d'une phrase : un corporate se dérive **deux fois**, ΔP ≈ −D × (Δr + Δs). En crise, les deux jambes jouent souvent en sens inverse — les spreads explosent pendant que les taux sans risque baissent, tout le monde fuyant vers les emprunts d'État. Un IG long peut finir presque inchangé ; un HY, dominé par le spread, n'a aucun coussin. D'où la question qui suit souvent : « êtes-vous long ou court les taux ? » — séparez toujours les deux jambes.`,
    reponseModeleEn: `The number first: ΔP/P ≈ −D × Δs = −7 × 3% = **−21%**. A fifth of the portfolio, wiped out by a single spread move — a *bond* book losing like an equity book.

The arithmetic is exactly module 4 duration: the price change is modified duration times the yield shock — simply, the shock here comes from **credit**, not rates. That is **spread duration**, and it makes the spread a risk class in its own right. The execution trap to avoid: 300 bp = 3%, not 0.3% — the factor-of-ten slip is the classic mistake. And the scenario\'s order of magnitude: +300 bp is a crisis-type widening — 2008, COVID — not a textbook hypothesis.

The conceptual point that sets a good answer apart: **no default has happened yet**. The −21% is a repricing of doubt, not a realisation of losses — the market demands more to carry the same risk, and the valuation takes the hit immediately.

Finally, widen by one sentence: a corporate differentiates **twice**, ΔP ≈ −D × (Δr + Δs). In a crisis the two legs often move opposite ways — spreads explode while risk-free rates fall, as everyone flees to government bonds. A long IG book can end a crisis almost unchanged; HY, dominated by spread, has no cushion. Hence the frequent follow-up: "are you long or short rates?" — always separate the two legs.`,
  },
  {
    id: 'm5-j-12',
    moduleId: M5,
    theme: 'pricer une obligation risquée',
    themeEn: 'pricing a risky bond',
    difficulte: 3,
    question: 'Un client veut acheter une obligation qui cote 40 % du nominal « pour verrouiller son rendement actuariel de 35 % ». Que lui dites-vous ?',
    questionEn: 'A client wants to buy a bond quoted at 40% of par "to lock in its 35% yield to maturity". What do you tell him?',
    plan: [
      'Désamorcer le chiffre : un rendement actuariel suppose des coupons payés jusqu\'à une maturité atteinte — à 40 % du nominal, plus personne ne croit à ces flux ; le 35 % est calculé sur une fiction',
      'Donner la règle de marché : sous 50-60 % du nominal, on cesse de coter en spread et on cote en PRIX — le scénario central n\'est plus « des flux risqués » mais « les flux s\'arrêtent : que récupère-t-on ? »',
      'Traduire le prix : à 40, le marché price un défaut quasi certain avec un recouvrement autour de 40 — la valeur est un pari sur le R du chapitre 3',
      'Rediriger l\'analyse : séniorité, valeur des actifs, droit de la faillite — un autre métier, celui du distressed ; la courbe de spreads inversée en est le panneau indicateur',
    ],
    planEn: [
      'Defuse the number: a yield to maturity assumes coupons paid until a maturity that is reached — at 40% of par, nobody believes in those flows anymore; the 35% is computed on a fiction',
      'Give the market rule: below 50-60% of par, the market stops quoting in spread and quotes in PRICE — the central scenario is no longer "risky flows" but "the flows stop: what do we recover?"',
      'Translate the price: at 40, the market prices a near-certain default with a recovery around 40 — the value is a bet on chapter 3\'s R',
      'Redirect the analysis: seniority, asset values, bankruptcy law — a different trade, distressed; an inverted spread curve is its road sign',
    ],
    pointsAttendus: [
      'Le refus argumenté du « verrouillage » : le rendement actuariel n\'est verrouillé que si tous les flux arrivent — précisément ce que le prix de 40 dément',
      'Le seuil de changement de langue : sous environ 50-60 % du nominal, le marché cote en prix, plus en spread ni en rendement',
      'La lecture du prix : 40 % du nominal ≈ un défaut quasi certain avec R proche de 40 — l\'obligation est devenue un pari sur le recouvrement',
      'Le déplacement de l\'analyse : tableaux de séniorité, valeur liquidative des actifs, droit de la faillite — l\'analyse quitte les courbes de taux',
      'Le piège du débutant nommé : un rendement actuariel spectaculaire sur du distressed n\'est pas une opportunité, c\'est un chiffre calculé sur des flux morts',
      'Le signal de courbe : l\'inversion de la courbe des spreads (le court au-dessus du long) marque l\'entrée dans ce régime — tout le risque se concentre sur l\'échéance immédiate',
    ],
    pointsAttendusEn: [
      'The argued refusal of the "lock-in": the yield to maturity is only locked if every flow arrives — precisely what the price of 40 denies',
      'The language-switch threshold: below roughly 50-60% of par, the market quotes in price, no longer in spread or yield',
      'Reading the price: 40% of par ≈ a near-certain default with R close to 40 — the bond has become a bet on recovery',
      'The shift of analysis: seniority tables, liquidation value of assets, bankruptcy law — the analysis leaves the yield curves',
      'The beginner\'s trap named: a spectacular yield to maturity on distressed paper is not an opportunity, it is a number computed on dead flows',
      'The curve signal: an inverted spread curve (short above long) marks the entry into this regime — all the risk concentrates on the immediate maturity',
    ],
    bonus: [
      'La contrepartie honnête : le distressed est un vrai métier rentable — mais il s\'achète sur une analyse de recouvrement (rang, collatéral, procédure), jamais sur un rendement actuariel',
      'Le miroir CDS : sur ces noms, le marché de la protection passe en points upfront (« 35 points, coupon 500 ») — même bascule de langue, pour la même raison',
    ],
    bonusEn: [
      'The honest counterpart: distressed is a real, profitable business — but it is bought on a recovery analysis (rank, collateral, process), never on a yield to maturity',
      'The CDS mirror: on these names, the protection market switches to upfront points ("35 points, 500 coupon") — the same language shift, for the same reason',
    ],
    reponseModele: `Je lui dis d'abord ce que son 35 % *suppose* : un rendement actuariel est calculé sur des coupons payés jusqu'à une maturité atteinte. Or le prix de 40 % du nominal dit exactement le contraire — plus personne ne croit à ces flux. Son « rendement verrouillé » est un chiffre exact calculé sur une **fiction** : il n'y a rien à verrouiller.

La règle de marché ensuite : sous environ **50-60 % du nominal**, le marché change de langue — on cesse de coter en spread ou en rendement, on cote en **prix**. Le scénario central n'est plus « les flux arrivent avec du risque » mais « les flux s'arrêtent : que récupère-t-on ? ». À 40, le marché price un défaut quasi certain avec un recouvrement autour de **40** : l'obligation est devenue un pari sur le R du chapitre 3, plus rien d'autre.

D'où le déplacement complet de l'analyse : ce qui compte désormais, c'est le **rang dans la file d'attente** de la faillite, la valeur liquidative des actifs, le droit de la procédure — les tableaux de séniorité, pas les courbes de taux. Le **distressed** est un vrai métier — mais il s'achète sur une analyse de recouvrement, jamais sur un rendement actuariel spectaculaire, piège du débutant par excellence.

Et le panneau indicateur, pour finir : sur ces émetteurs, la courbe des spreads s'**inverse** — le court explose au-dessus du long, tout le risque se concentre sur l'échéance immédiate. Si l'émetteur passe l'année, le pire est derrière lui : survivre est l'information.`,
    reponseModeleEn: `First I tell him what his 35% *assumes*: a yield to maturity is computed on coupons paid until a maturity that is reached. Yet the price of 40% of par says exactly the opposite — nobody believes in those flows anymore. His "locked-in yield" is an exact number computed on a **fiction**: there is nothing to lock.

Then the market rule: below roughly **50-60% of par**, the market changes language — it stops quoting in spread or yield and quotes in **price**. The central scenario is no longer "the flows arrive with some risk" but "the flows stop: what do we recover?". At 40, the market prices a near-certain default with a recovery around **40**: the bond has become a bet on chapter 3\'s R, and nothing else.

Hence the complete shift of analysis: what matters now is the **rank in the bankruptcy queue**, the liquidation value of the assets, the law of the proceedings — seniority tables, not yield curves. It is a real business, **distressed**, and it can be very profitable — but it is bought on a recovery analysis, never on a spectacular yield to maturity, which is the beginner\'s trap par excellence.

And the road sign, to finish: on these issuers the spread curve **inverts** — the short end explodes above the long end, all the risk concentrating on the immediate maturity. If the issuer survives the year, the worst is behind it: surviving is the information.`,
  },
  {
    id: 'm5-j-13',
    moduleId: M5,
    theme: 'les CDS : le risque détaché de l\'obligation',
    themeEn: 'CDS: credit risk detached from the bond',
    difficulte: 1,
    question: 'Expliquez les deux jambes d\'un CDS.',
    questionEn: 'Explain the two legs of a CDS.',
    plan: [
      'Poser le contrat : acheteur et vendeur de protection, référencés sur une entité — le risque de crédit négocié sans détenir l\'obligation',
      'La jambe fixe : prime annuelle = notionnel × spread/10 000 — 10 M à 200 pb = 200 000 € par an, payés par quarts trimestriels (20 mars, juin, septembre, décembre), tant que l\'entité survit',
      'La jambe de protection, contingente : paiement au défaut = notionnel × (1 − R) — 10 M avec R = 40 % ⇒ 6 M ; les primes s\'arrêtent au même instant, au prorata',
      'Nommer le profil : l\'acheteur paie petit et régulier contre rare et massif — le vendeur a le profil du vendeur d\'options du m8',
    ],
    planEn: [
      'Set the contract: protection buyer and seller, referenced on an entity — credit risk traded without holding the bond',
      'The fixed leg: annual premium = notional × spread/10,000 — 10M at 200 bp = 200,000 € per year, paid in quarterly instalments (20 March, June, September, December), as long as the entity survives',
      'The protection leg, contingent: payment at default = notional × (1 − R) — 10M with R = 40% ⇒ 6M; the premiums stop at the same instant, pro rata',
      'Name the profile: the buyer pays small and regular against rare and massive — the seller has the m8 option-seller profile',
    ],
    pointsAttendus: [
      'Les rôles clairs : l\'ACHETEUR de protection paie la prime (comme un assuré), le VENDEUR indemnise au défaut — ni l\'un ni l\'autre n\'a besoin de détenir l\'obligation',
      'La jambe fixe chiffrée : notionnel × spread en pb/10 000 — l\'ancre : 10 M à 200 pb = 200 000 € par an, soit 50 000 € par trimestre aux dates standardisées',
      'L\'ordre de grandeur à garder : 100 pb = 0,1 M€ par an pour 10 M de notionnel — la protection se compte en dixièmes de pour cent',
      'La jambe contingente chiffrée : notionnel × (1 − R) — 10 M à R 40 % ⇒ 6 M ; le vendeur paie la PERTE, jamais le notionnel',
      'L\'asymétrie des positions : payer 2 % par an pour recevoir 60 % au sinistre — le vendeur encaisse petit et régulier contre une perte rare et massive, profil vendeur d\'option',
    ],
    pointsAttendusEn: [
      'The roles made clear: the protection BUYER pays the premium (like a policyholder), the SELLER compensates at default — neither needs to hold the bond',
      'The fixed leg in numbers: notional × spread in bp/10,000 — the anchor: 10M at 200 bp = 200,000 € per year, i.e. 50,000 € per quarter on the standardised dates',
      'The order of magnitude to keep: 100 bp = 0.1M€ per year on 10M of notional — protection is counted in tenths of a percent',
      'The contingent leg in numbers: notional × (1 − R) — 10M at R 40% ⇒ 6M; the seller pays the LOSS, never the notional',
      'The asymmetry of the positions: pay 2% a year to receive 60% at the loss event — the seller collects small and regular against a rare, massive payout: an option-seller profile',
    ],
    bonus: [
      'La modernisation post-2009 : coupons standardisés (100 pb IG, 500 pb HY) et soulte upfront — le juste spread se règle à l\'initiation, les contrats deviennent fongibles et compensables',
      'Le déclencheur institutionnel : l\'événement de crédit (faillite, défaut de paiement, restructuration) est constaté par un comité ISDA, et le R officiel sort d\'une enchère opposable à tous les contrats',
    ],
    bonusEn: [
      'The post-2009 modernisation: standardised coupons (100 bp IG, 500 bp HY) and an upfront payment — the fair spread settles at initiation, contracts become fungible and clearable',
      'The institutional trigger: the credit event (bankruptcy, payment default, restructuring) is established by an ISDA committee, and the official R comes out of an auction binding on all contracts',
    ],
    reponseModele: `Un CDS est un contrat de gré à gré entre un **acheteur** et un **vendeur de protection**, référencé sur une entité — entreprise, banque, État — et il s'analyse, comme le swap de taux du module 7, en deux jambes.

La **jambe fixe** est payée par l'acheteur tant que l'entité survit : prime annuelle = notionnel × spread/10 000. L'ancre à retenir : **10 M de notionnel à 200 pb = 200 000 € par an**, versés par quarts trimestriels de 50 000 € aux dates standardisées — 20 mars, 20 juin, 20 septembre, 20 décembre. L'ordre de grandeur : 100 pb coûtent 0,1 M€ par an pour 10 M — la protection se compte en dixièmes de pour cent.

La **jambe de protection** est contingente : elle ne paie qu'au défaut, et elle paie la **perte**, pas le notionnel — paiement = notionnel × (1 − R). Sur 10 M avec le recouvrement conventionnel de 40 % : **6 M**. Les primes s'arrêtent au même instant, au prorata du trimestre couru.

Le profil qui en découle vaut d'être nommé : l'acheteur paie petit et régulier contre une indemnisation rare et massive — 2 % par an contre 60 % au sinistre. Le vendeur est dans la position exacte du **vendeur d'options** du module 8 : il « gagne » tous les trimestres, jusqu'au trimestre où il rend tout. Et depuis 2009, tout cela est standardisé : coupons fixes (100 pb IG, 500 pb HY), soulte upfront, compensation centrale — le Far West de 2008 est devenu un marché de flux.`,
    reponseModeleEn: `A CDS is an over-the-counter contract between a **protection buyer** and a **protection seller**, referenced on an entity — a company, a bank, a sovereign — and, like the module 7 interest rate swap, it breaks into two legs.

The **fixed leg** is paid by the buyer as long as the entity survives: annual premium = notional × spread/10,000. The anchor to remember: **10M of notional at 200 bp = 200,000 € per year**, paid in quarterly instalments of 50,000 € on the standardised dates — 20 March, 20 June, 20 September, 20 December. The order of magnitude: 100 bp cost 0.1M€ a year on 10M — protection is counted in tenths of a percent.

The **protection leg** is contingent: it only pays at default, and it pays the **loss**, not the notional — payment = notional × (1 − R). On 10M with the conventional 40% recovery: **6M**. The premiums stop at the same instant, pro rata over the running quarter.

The resulting profile deserves naming: the buyer pays small and regular against a rare, massive payout — 2% a year against 60% at the loss event. The seller sits in the exact position of the module 8 **option seller**: he "earns" every quarter, until the quarter where he gives it all back. And since 2009 everything is standardised: fixed coupons (100 bp IG, 500 bp HY), upfront payments, central clearing — the Wild West of 2008 has become a flow market.`,
  },
  {
    id: 'm5-j-14',
    moduleId: M5,
    theme: 'les CDS : le risque détaché de l\'obligation',
    themeEn: 'CDS: credit risk detached from the bond',
    difficulte: 2,
    question: 'Au défaut, le vendeur de protection paie-t-il le notionnel ?',
    questionEn: 'At default, does the protection seller pay the notional?',
    plan: [
      'Répondre net : non — il compense la PERTE : notionnel × (1 − R) ; sur 10 M avec R = 40 %, il verse 6 M, pas 10',
      'Expliquer qui fixe R : le comité de détermination ISDA constate l\'événement de crédit, puis l\'ENCHÈRE fixe un recouvrement unique, opposable à tous les contrats du marché',
      'Donner le cas d\'école : Lehman, octobre 2008 — enchère à 8,625 % du pair, les vendeurs ont payé 91,375 % du notionnel (9,1375 M pour 10 M)',
      'Tirer les deux leçons : R ≈ 40 % est une moyenne de temps calme, pas une loi ; et la machine a tenu — règlements nets ~5,2 Md$ seulement, grâce au netting',
    ],
    planEn: [
      'Answer squarely: no — he compensates the LOSS: notional × (1 − R); on 10M with R = 40%, he pays 6M, not 10',
      'Explain who sets R: the ISDA determinations committee establishes the credit event, then the AUCTION fixes a single recovery, binding on every contract in the market',
      'Give the canonical case: Lehman, October 2008 — auction at 8.625% of par, sellers paid 91.375% of notional (9.1375M per 10M)',
      'Draw the two lessons: R ≈ 40% is a calm-times average, not a law; and the machine held — net settlements only ~5.2bn$, thanks to netting',
    ],
    pointsAttendus: [
      'La formule et le chiffre : paiement au défaut = notionnel × (1 − R) — 10 M à R 40 % ⇒ 6 M ; le CDS remet l\'acheteur dans la situation d\'un créancier indemnisé, pas d\'un gagnant au loto',
      'La séquence institutionnelle : comité de détermination ISDA (constate le sinistre) puis enchère (fixe le prix des obligations en défaut) — un R unique pour tous les contrats, sans quoi des milliers de litiges bilatéraux',
      'Lehman chiffré : recouvrement fixé à 8,625 %, vendeurs payant 91,375 % du notionnel — sur une banque en faillite, il ne reste presque rien pour les seniors',
      'La leçon sur la convention : R ≈ 40 % est une moyenne historique du senior unsecured en temps calme — jamais une garantie',
      'La robustesse du mécanisme : malgré des dizaines de milliards de notionnels bruts, ~5,2 Md$ de règlements nets — le netting avait déjà compressé l\'essentiel ; c\'est AIG le vendeur concentré qui a failli, pas la machine',
    ],
    pointsAttendusEn: [
      'The formula and the number: payment at default = notional × (1 − R) — 10M at R 40% ⇒ 6M; the CDS puts the buyer back in the position of a compensated creditor, not a lottery winner',
      'The institutional sequence: ISDA determinations committee (establishes the loss event) then the auction (fixes the price of the defaulted bonds) — one R for all contracts, without which thousands of bilateral disputes',
      'Lehman in numbers: recovery set at 8.625%, sellers paying 91.375% of notional — on a failed bank, almost nothing is left for senior creditors',
      'The lesson on the convention: R ≈ 40% is a calm-times historical average for senior unsecured — never a guarantee',
      'The robustness of the mechanism: despite tens of billions of gross notionals, ~5.2bn$ of net settlements — netting had already compressed the bulk; it was AIG the concentrated seller that failed, not the machine',
    ],
    bonus: [
      'Le pont avec la séniorité : le même émetteur peut donner des recouvrements très différents selon le rang — l\'enchère porte sur la dette de référence livrable, d\'où l\'importance de la documentation',
      'La lecture du desk : un CDS pricé avec R 40 % sur une banque sous-estime la perte au défaut — certains desks pricent les financières avec des R plus bas précisément à cause du précédent Lehman',
    ],
    bonusEn: [
      'The bridge to seniority: the same issuer can produce very different recoveries by rank — the auction covers the deliverable reference debt, hence the importance of documentation',
      'The desk reading: a CDS priced with R 40% on a bank understates the loss at default — some desks price financials with lower Rs precisely because of the Lehman precedent',
    ],
    reponseModele: `Non — et c'est le réflexe d'oral du chapitre : au défaut, le vendeur de protection ne rembourse pas le notionnel, il compense la **perte** : paiement = notionnel × (1 − R). Sur 10 M avec le recouvrement conventionnel de 40 %, il verse **6 M**, pas 10. Le CDS remet l'acheteur dans la situation d'un créancier indemnisé — pas d'un gagnant au loto.

Reste à savoir *qui* fixe R. D'abord, un **comité de détermination ISDA** — banques et investisseurs — vote sur l'événement de crédit : faillite, défaut de paiement, restructuration. Puis une **enchère** organise la cotation des obligations en défaut : le prix qui en sort devient le recouvrement officiel de *tous* les contrats du marché en même temps. Sans ce chiffre unique et opposable, des milliers de contrats de gré à gré auraient chacun leur litige.

Le cas d'école : **Lehman, octobre 2008**. L'enchère fixe le recouvrement à **8,625 %** du pair — les vendeurs de protection ont payé **91,375 % du notionnel**, soit 9,1375 M pour 10 M assurés. Deux leçons dans ce chiffre. La convention « R ≈ 40 % » est une moyenne de temps calme du senior unsecured, pas une loi : sur une banque en faillite, il ne reste presque rien. Et la machine a tenu : malgré des dizaines de milliards de notionnels bruts sur le nom, les règlements nets n'ont fait qu'environ **5,2 Md$** — le netting avait absorbé l'essentiel. C'est le vendeur concentré, AIG, qui a failli — pas le mécanisme.`,
    reponseModeleEn: `No — and this is the chapter\'s oral reflex: at default, the protection seller does not repay the notional, he compensates the **loss**: payment = notional × (1 − R). On 10M with the conventional 40% recovery, he pays **6M**, not 10. The CDS puts the buyer back in the position of a compensated creditor — not a lottery winner.

That leaves the question of *who* sets R, and there the market built its finest plumbing. First, an **ISDA determinations committee** — banks and investors — votes on the credit event: bankruptcy, payment default, restructuring. Then an **auction** organises the pricing of the defaulted bonds: the resulting price becomes the official recovery for *all* contracts in the market at once. Without that single, binding number, thousands of over-the-counter contracts would each have their own dispute.

The canonical case: **Lehman, October 2008**. The auction set the recovery at **8.625%** of par — protection sellers paid **91.375% of the notional**, i.e. 9.1375M per 10M insured. Two lessons in that figure. The "R ≈ 40%" convention is a calm-times average for senior unsecured, not a law: on a failed bank, almost nothing remains. And the machine held: despite tens of billions of gross notionals on the name, net settlements came to only about **5.2bn$** — netting had absorbed the bulk. It was the concentrated seller, AIG, that failed — not the mechanism.`,
  },
  {
    id: 'm5-j-15',
    moduleId: M5,
    theme: 'les CDS : le risque détaché de l\'obligation',
    themeEn: 'CDS: credit risk detached from the bond',
    difficulte: 3,
    question: 'Un CDS n\'est-il pas simplement une assurance ?',
    questionEn: 'Isn\'t a CDS just insurance?',
    plan: [
      'Accorder l\'intuition : prime petite et régulière contre indemnisation rare et massive — l\'analogie est le bon point de départ',
      'Première rupture, juridique : aucun intérêt assurable — on peut acheter de la protection sur un émetteur dont on ne détient rien, l\'équivalent d\'assurer la maison du voisin',
      'Deuxième rupture, institutionnelle : le sinistre n\'est pas expertisé mais voté (comité ISDA) et le montant sort d\'une enchère de marché — définitions standardisées, contrats fongibles',
      'Troisième rupture, économique : un CDS est un instrument de MARCHÉ — coté en continu, mark-to-market, revendable, compensé en chambre — sans mutualisation ni réserves techniques : AIG a montré ce qui arrive quand on le confond avec de l\'assurance',
    ],
    planEn: [
      'Concede the intuition: small regular premium against a rare massive payout — the analogy is the right starting point',
      'First break, legal: no insurable interest — you can buy protection on an issuer you own nothing of, the equivalent of insuring your neighbour\'s house',
      'Second break, institutional: the loss event is not appraised but voted (ISDA committee) and the amount comes out of a market auction — standardised definitions, fungible contracts',
      'Third break, economic: a CDS is a MARKET instrument — quoted continuously, marked to market, resaleable, centrally cleared — with no mutualisation or technical reserves: AIG showed what happens when you mistake it for insurance',
    ],
    pointsAttendus: [
      'L\'analogie assumée puis dépassée : oui pour le profil des flux, non pour le régime juridique et économique',
      'L\'absence d\'intérêt assurable : c\'est la liberté fondatrice de l\'instrument — elle permet les trois usages du desk (couvrir, shorter, prendre de l\'exposition), et elle a permis les excès de 2008',
      'La standardisation qui n\'existe pas en assurance : définitions ISDA de l\'événement de crédit, comité de détermination dont la décision s\'applique à tout le marché, enchère qui fixe un R unique',
      'La nature de marché : cotation en continu en pb, mark-to-market quotidien, position revendable ou compensable — une police d\'assurance ne se trade pas',
      'L\'absence de mutualisation : pas de pool d\'assurés ni de réserves techniques réglementées — le vendeur de CDS peut être n\'importe qui, y compris un vendeur concentré sans réserves : AIG, ~500 Md$ vendus',
      'La réponse post-crise : depuis 2009, marges initiales et appels quotidiens en chambre de compensation tiennent le rôle que les réserves jouent en assurance',
    ],
    pointsAttendusEn: [
      'The analogy embraced then surpassed: yes for the cash-flow profile, no for the legal and economic regime',
      'The absence of insurable interest: the instrument\'s founding freedom — it enables the desk\'s three uses (hedge, short, take exposure), and it enabled the excesses of 2008',
      'The standardisation that does not exist in insurance: ISDA definitions of the credit event, a determinations committee whose decision applies to the whole market, an auction fixing a single R',
      'The market nature: continuous quotation in bp, daily mark-to-market, a position you can resell or net — an insurance policy does not trade',
      'The absence of mutualisation: no pool of policyholders, no regulated technical reserves — the CDS seller can be anyone, including a concentrated seller without reserves: AIG, ~500bn$ sold',
      'The post-crisis answer: since 2009, initial margins and daily calls at the clearing house play the role reserves play in insurance',
    ],
    bonus: [
      'Le paradoxe à formuler : c\'est précisément ce qui rend le CDS différent d\'une assurance (pas d\'intérêt assurable, négociabilité) qui le rend utile — le short crédit propre n\'existe pas sans lui',
      'La nuance psychologique : le vendeur de protection a le profil du vendeur d\'options — encaisse petit et régulier, rend tout d\'un coup ; l\'assureur classique mutualise ce profil sur des milliers de sinistres indépendants, le vendeur de CDS sur des défauts corrélés',
    ],
    bonusEn: [
      'The paradox to articulate: precisely what makes the CDS different from insurance (no insurable interest, tradability) is what makes it useful — a clean credit short does not exist without it',
      'The psychological nuance: the protection seller has the option-seller profile — collects small and regular, gives it all back at once; the classic insurer mutualises that profile over thousands of independent claims, the CDS seller over correlated defaults',
    ],
    reponseModele: `L'intuition est bonne et il faut la donner : une prime petite et régulière contre une indemnisation rare et massive — c'est le profil d'une assurance. Mais trois ruptures font du CDS un autre objet.

**Juridique** : le CDS n'exige aucun **intérêt assurable**. On peut acheter de la protection sur un émetteur dont on ne détient rien — assurer la maison du voisin. Cette liberté rend l'instrument utile (couvrir, shorter, prendre de l'exposition sans bilan) et a permis les excès de 2008.

**Institutionnelle** : le sinistre n'est pas expertisé, il est **voté** — un comité de détermination ISDA constate l'événement de crédit ; puis une **enchère** fixe un recouvrement unique (Lehman : 8,625 %, vendeurs payant 91,375 %). Définitions standardisées, contrats fongibles : rien de tel dans une police.

**Économique**, la plus profonde : le CDS est un instrument de **marché** — coté en continu en points de base, valorisé chaque soir, revendable, compensable en chambre. Et il n'a ni mutualisation ni réserves techniques : le vendeur peut être n'importe qui, y compris un vendeur concentré sans réserves face à des défauts *corrélés* — AIG, ~500 Md$ vendus, l'a démontré. Un assureur mutualise des sinistres indépendants ; le vendeur de CDS porte des sinistres qui arrivent tous ensemble.

Depuis 2009, marges initiales et appels quotidiens de la chambre tiennent le rôle des réserves. La formule finale : une assurance dans son *profil*, un marché dans son *régime* — et confondre les deux a coûté 85 Md$ au contribuable américain.`,
    reponseModeleEn: `The intuition is right and you should grant it: a small regular premium against a rare massive payout — that is an insurance profile. But three breaks make the CDS a different object.

**Legal**: the CDS requires no **insurable interest**. You can buy protection on an issuer you own nothing of — insuring your neighbour\'s house. That freedom is exactly what makes the instrument useful (hedge without selling, short cleanly, take exposure without balance sheet) and exactly what enabled the excesses of 2008.

**Institutional**: the loss event is not appraised, it is **voted** — an ISDA determinations committee establishes the credit event, and its decision applies to every contract in the market; then an **auction** fixes a single recovery (Lehman: 8.625%, sellers paying 91.375%). Standardised definitions, fungible contracts: nothing like an insurance policy.

**Economic**, the deepest: the CDS is a **market** instrument — quoted continuously in basis points, marked every evening, resaleable, clearable. And it has neither mutualisation nor technical reserves: the seller can be anyone, including a concentrated seller with no reserves facing *correlated* defaults — AIG, ~500bn$ sold, proved it. An insurer mutualises independent claims; the CDS seller carries claims that all arrive together.

Since 2009, initial margins and daily clearing-house calls play the role of reserves. The closing line: insurance in its *profile*, a market in its *regime* — and confusing the two cost the American taxpayer 85bn$.`,
  },
  {
    id: 'm5-j-16',
    moduleId: M5,
    theme: 'les CDS : le risque détaché de l\'obligation',
    themeEn: 'CDS: credit risk detached from the bond',
    difficulte: 3,
    question: 'Qu\'est-ce que la base négative, et pourquoi le trade peut-il mal finir ?',
    questionEn: 'What is the negative basis, and why can the trade end badly?',
    plan: [
      'Définir avec l\'ancre : base = spread CDS − spread obligataire — CDS à 180 pb, obligation à 200 pb ⇒ base = −20 pb',
      'Décrire le trade : acheter l\'obligation (encaisser 200), acheter la protection (payer 180) — 20 pb par an verrouillés « sans risque de crédit », le CDS compensant le défaut',
      'Démonter le « sans risque » : la position se finance en repo au jour le jour et se valorise chaque soir — si la base s\'écarte (fin 2008 : plusieurs centaines de pb sur des financières), les appels de marge tombent tout de suite, le gain n\'arrive qu\'à maturité',
      'Conclure sur la vraie nature : la base négative est le prix du BILAN — elle rémunère celui qui peut financer et tenir ; la leçon LTCM : un arbitrage certain à terme peut mourir avant l\'échéance',
    ],
    planEn: [
      'Define with the anchor: basis = CDS spread − bond spread — CDS at 180 bp, bond at 200 bp ⇒ basis = −20 bp',
      'Describe the trade: buy the bond (collect 200), buy protection (pay 180) — 20 bp a year locked in "without credit risk", the CDS covering default',
      'Dismantle the "riskless": the position is repo-funded overnight and marked every evening — if the basis widens (late 2008: several hundred bp on financials), margin calls hit immediately while the gain only arrives at maturity',
      'Close on the true nature: the negative basis is the price of BALANCE SHEET — it pays whoever can fund and hold; the LTCM lesson: an arbitrage certain at maturity can die before maturity',
    ],
    pointsAttendus: [
      'La définition et le signe : base = s_CDS − s_obligation ; 180 − 200 = −20 pb — la protection coûte moins que le spread encaissé',
      'Le montage précis : long obligation + long protection = flux de +20 pb par an, et le défaut est neutralisé par la jambe de protection',
      'La distinction clé : « sans risque de crédit » n\'est pas « sans risque » — restent le financement, le mark-to-market et la liquidité',
      'La mécanique de la mort : repo renouvelé au jour le jour, valorisation quotidienne — une base qui passe de −20 à −80 pb inflige des pertes immédiates et des appels de marge, quand la convergence n\'arrive qu\'à maturité',
      'Le précédent chiffré : fin 2008, la base a dépassé plusieurs centaines de pb sur des financières — les porteurs leviérisés ont été sortis avant d\'avoir raison',
      'L\'interprétation économique : la base négative n\'est pas une anomalie gratuite, c\'est la rémunération du bilan — de la capacité à financer et à porter',
    ],
    pointsAttendusEn: [
      'The definition and the sign: basis = s_CDS − s_bond; 180 − 200 = −20 bp — the protection costs less than the spread collected',
      'The precise structure: long bond + long protection = a flow of +20 bp per year, with default neutralised by the protection leg',
      'The key distinction: "without credit risk" is not "without risk" — funding, mark-to-market and liquidity remain',
      'The mechanics of death: repo rolled overnight, daily valuation — a basis going from −20 to −80 bp inflicts immediate losses and margin calls, while convergence only arrives at maturity',
      'The numbered precedent: in late 2008, the basis exceeded several hundred bp on financials — leveraged holders were carried out before being proven right',
      'The economic interpretation: the negative basis is not a free anomaly, it is the compensation of balance sheet — of the capacity to fund and to carry',
    ],
    bonus: [
      'Le fil rouge du cours : c\'est le basis trade qui dérape du m7 et la leçon LTCM du m11 — le marché peut rester disloqué plus longtemps que vous ne pouvez rester financé',
      'La question de contrôle qui suit : « qui peut faire ce trade, alors ? » — celui qui a du financement stable et pas de mark-to-market forcé : le bilan bancaire d\'avant-crise, certains fonds fermés aujourd\'hui',
    ],
    bonusEn: [
      'The course\'s red thread: this is the m7 basis trade gone wrong and the m11 LTCM lesson — the market can stay dislocated longer than you can stay funded',
      'The follow-up control question: "who can do this trade, then?" — whoever has stable funding and no forced mark-to-market: the pre-crisis bank balance sheet, some closed-end funds today',
    ],
    reponseModele: `La base est l'écart entre les deux prix du même risque : **base = spread CDS − spread obligataire**. L'ancre du cours : CDS à 180 pb, obligation à 200 pb au-dessus du sans-risque ⇒ base = **−20 pb**. Une base négative semble offrir l'affaire du siècle : acheter l'obligation (encaisser 200), acheter la protection (payer 180), et empocher **20 pb par an sans risque de crédit** — si l'émetteur fait défaut, le CDS compense la perte. C'est le *negative basis trade*.

Pourquoi peut-il mal finir ? Parce que « sans risque de crédit » ne veut pas dire « sans risque ». L'obligation s'achète avec de l'argent emprunté — en **repo, renouvelé au jour le jour** — et la position est valorisée en marché chaque soir. Si la base, au lieu de converger vers zéro, s'écarte de −20 à −80 pb, le trade perd immédiatement au mark-to-market et les **appels de marge tombent tout de suite** — alors que le gain, lui, n'arrive qu'à maturité. Fin 2008, la base a dépassé **plusieurs centaines de points de base** sur des financières : les porteurs leviérisés ont été sortis avant d'avoir raison. C'est la leçon LTCM du module 11 : un arbitrage certain à terme, financé au jour le jour, peut mourir d'un appel de marge bien avant l'échéance.

La chute, économique : la base négative n'est pas une anomalie gratuite — c'est le **prix du bilan**. Elle rémunère celui qui peut financer la position et la tenir sans vente forcée. Si vous ne pouvez pas, ces 20 pb ne vous étaient pas destinés.`,
    reponseModeleEn: `The basis is the gap between the two prices of the same risk: **basis = CDS spread − bond spread**. The course anchor: CDS at 180 bp, bond at 200 bp over risk-free ⇒ basis = **−20 bp**. A negative basis looks like the deal of the century: buy the bond (collect 200), buy the protection (pay 180), and pocket **20 bp a year with no credit risk** — if the issuer defaults, the CDS covers the loss. That is the *negative basis trade*.

Why can it end badly? Because "without credit risk" does not mean "without risk". The bond is bought with borrowed money — **repo, rolled overnight** — and the position is marked to market every evening. If the basis, instead of converging to zero, widens from −20 to −80 bp, the trade loses immediately on the mark and the **margin calls hit right away** — while the gain only arrives at maturity. In late 2008, the basis exceeded **several hundred basis points** on financials: leveraged holders were carried out before being proven right. That is the m11 LTCM lesson: an arbitrage certain at maturity, funded overnight, can die of a margin call long before the end.

The economic punchline: the negative basis is not a free anomaly — it is the **price of balance sheet**. It pays whoever can fund the position and hold it without forced selling. If you cannot, those 20 bp were never meant for you.`,
  },
  {
    id: 'm5-j-17',
    moduleId: M5,
    theme: 'les CDS : le risque détaché de l\'obligation',
    themeEn: 'CDS: credit risk detached from the bond',
    difficulte: 4,
    question: 'Racontez AIG en trois minutes.',
    questionEn: 'Tell me about AIG in three minutes.',
    plan: [
      'Le dispositif : AIG Financial Products vend ~500 Md$ de protection CDS sur des tranches senior « sans risque » — encaisser la jambe fixe comme un revenu quasi certain, sans réserves en face, exposition unfunded adossée au AAA du groupe',
      'La mécanique de mort : pas un défaut réalisé, mais le mark-to-market — quand les tranches se déprécient et qu\'AIG est dégradée, les clauses contractuelles exigent de poster du collatéral ; les appels s\'empilent, la trésorerie ne suit pas',
      'Le dénouement : 16 septembre 2008, au lendemain de Lehman — la Fed injecte 85 Md$ contre 79,9 % du capital, nationalisation de fait ; la faillite aurait retiré d\'un coup l\'assurance de toutes les grandes banques du monde',
      'Les leçons : le vendeur d\'options systémique (encaisse petit et régulier, rend tout d\'un coup), la catastrophe corrélée qui frappe tous les contrats à la fois, et la réponse institutionnelle — compensation centrale, marges (Big Bang 2009, EMIR, Dodd-Frank)',
    ],
    planEn: [
      'The setup: AIG Financial Products sells ~500bn$ of CDS protection on "riskless" senior tranches — collecting the fixed leg as near-certain income, no reserves behind it, an unfunded exposure resting on the group\'s AAA',
      'The death mechanics: not one realised default, but mark-to-market — as the tranches lose value and AIG is downgraded, contractual clauses require posting collateral; the calls pile up, the cash does not follow',
      'The resolution: 16 September 2008, the day after Lehman — the Fed injects 85bn$ for 79.9% of the equity, a de facto nationalisation; failure would have withdrawn insurance from every major bank in the world at once',
      'The lessons: the systemic option seller (collects small and regular, gives it all back at once), the correlated catastrophe hitting every contract simultaneously, and the institutional answer — central clearing, margins (2009 Big Bang, EMIR, Dodd-Frank)',
    ],
    pointsAttendus: [
      'Le chiffre d\'entrée : ~500 Md$ de protection CDS vendue sur des tranches senior de titrisation réputées sans risque — concentrée chez un seul vendeur, dans le cadre bilatéral d\'avant-crise, sans chambre de compensation',
      'Le modèle économique du désastre : vendre de l\'assurance contre la catastrophe et encaisser la jambe fixe comme un revenu — le scénario de paiement étant jugé impossible, aucune réserve n\'est constituée : la position AIG est l\'exposition unfunded par excellence',
      'Le déclencheur précis : pas un défaut du pool — le mark-to-market des tranches et la dégradation de la note d\'AIG elle-même, qui active les clauses de collatéral ; la mort vient des appels de collatéral, pas des sinistres',
      'La logique du sauvetage : 16 septembre 2008, 85 Md$ de la Fed contre 79,9 % du capital — parce que la faillite aurait troué simultanément les bilans de toutes les contreparties : le systémique se mesure en liens, pas en taille',
      'La double asymétrie : profil de vendeur d\'options (petit et régulier contre rare et massif), aggravé par la corrélation — quand la catastrophe frappe, elle frappe tous les contrats à la fois : rien à mutualiser',
      'La cicatrice réglementaire : Big Bang 2009, compensation centrale obligatoire des dérivés standardisés (EMIR, Dodd-Frank), marges initiales et appels quotidiens — la chambre s\'interpose pour qu\'un AIG ne puisse plus se reconstituer de gré à gré',
    ],
    pointsAttendusEn: [
      'The opening figure: ~500bn$ of CDS protection sold on securitisation senior tranches deemed riskless — concentrated in a single seller, in the pre-crisis bilateral framework, with no clearing house',
      'The business model of the disaster: selling catastrophe insurance and booking the fixed leg as income — the payout scenario being judged impossible, no reserves are set aside: the AIG position is the unfunded exposure par excellence',
      'The precise trigger: not a pool default — the mark-to-market of the tranches and the downgrade of AIG itself, which activates the collateral clauses; death comes from collateral calls, not from claims',
      'The logic of the rescue: 16 September 2008, 85bn$ from the Fed for 79.9% of the equity — because failure would have holed every counterparty\'s balance sheet simultaneously: systemic risk is measured in links, not in size',
      'The double asymmetry: an option-seller profile (small and regular against rare and massive), aggravated by correlation — when the catastrophe strikes, it strikes every contract at once: nothing to mutualise',
      'The regulatory scar: the 2009 Big Bang, mandatory central clearing of standardised derivatives (EMIR, Dodd-Frank), initial margins and daily calls — the clearing house steps in so that an AIG can no longer rebuild itself over the counter',
    ],
    bonus: [
      'Le contraste à 24 heures qui structure le récit : Lehman lâchée le 15 septembre, AIG sauvée le 16 — une contrepartie parmi d\'autres contre le vendeur d\'assurance de tout le système ; l\'interconnexion a décidé, pas la taille',
      'La coda du chapitre 5 : la machine CDS elle-même a tenu — l\'enchère Lehman a réglé ~5,2 Md$ nets sans accroc ; le problème n\'était pas l\'instrument mais la concentration d\'un vendeur sans marges',
    ],
    bonusEn: [
      'The 24-hour contrast that frames the story: Lehman dropped on 15 September, AIG rescued on the 16th — one counterparty among many against the insurance seller of the whole system; interconnection decided, not size',
      'The chapter 5 coda: the CDS machine itself held — the Lehman auction settled ~5.2bn$ net without a hitch; the problem was not the instrument but the concentration of an unmargined seller',
    ],
    reponseModele: `Trois minutes, trois actes. **Le dispositif.** Dans le cadre bilatéral d'avant-crise — pas de chambre, collatéral négocié au cas par cas — AIG Financial Products vend pour environ **500 Md$** de protection CDS sur des tranches senior de titrisation réputées sans risque. Le scénario de paiement étant jugé impossible, la **jambe fixe** s'encaisse comme un revenu gratuit, sans la moindre réserve en face. L'exposition *unfunded* par excellence, adossée au seul AAA du groupe : vendre de l'assurance contre la fin du monde et dépenser les primes.

**La mécanique de mort.** Ce qui tue AIG n'est pas un sinistre — c'est le renvoi mécanique de sa propre structure. Quand les tranches se déprécient en 2007-2008, les contrats exigent de poster du **collatéral** au mark-to-market ; et quand AIG elle-même est **dégradée**, les clauses de rating en exigent davantage encore. Les appels s'empilent, la trésorerie ne suit pas : AIG meurt d'appels de collatéral avant d'avoir payé un seul défaut.

**Le dénouement et les leçons.** Le **16 septembre 2008**, au lendemain de Lehman, la Fed injecte **85 Md$ contre 79,9 % du capital** — nationalisation de fait, parce que sa faillite aurait retiré d'un coup l'assurance de toutes les grandes banques du monde : le systémique se mesure en liens, pas en taille. Les leçons : un vendeur d'options systémique encaisse petit et régulier jusqu'au jour où il rend tout ; la catastrophe assurée était **corrélée** — elle frappe tous les contrats à la fois, rien à mutualiser. La cicatrice : Big Bang 2009, marges et **compensation centrale** (EMIR, Dodd-Frank) — pour qu'un AIG ne puisse plus se reconstituer de gré à gré.`,
    reponseModeleEn: `Three minutes, three acts. **The setup.** In the pre-crisis bilateral framework — no clearing house, collateral negotiated case by case — AIG Financial Products sells roughly **500bn$** of CDS protection on securitisation senior tranches deemed riskless. The payout scenario being judged impossible, the **fixed leg** is booked as free income, with no reserve behind it. The *unfunded* exposure par excellence, resting on the group\'s AAA: selling insurance against the end of the world and spending the premiums.

**The death mechanics.** What kills AIG is not a claim — it is the mechanical recoil of its own structure. As the tranches lose value in 2007-2008, the contracts require posting **collateral** against the mark-to-market; and when AIG itself is **downgraded**, the rating triggers demand even more. The calls pile up, the cash does not follow: AIG dies of collateral calls before paying a single default.

**The resolution and the lessons.** On **16 September 2008**, the day after Lehman, the Fed injects **85bn$ for 79.9% of the equity** — a de facto nationalisation, because its failure would have withdrawn insurance from every major bank in the world at once: systemic risk is measured in links, not in size. The lessons: a systemic option seller collects small and regular until the day it gives everything back; the insured catastrophe was **correlated** — it strikes every contract at once, nothing to mutualise. The scar: the 2009 Big Bang, margins and **central clearing** (EMIR, Dodd-Frank) — the clearing house steps in so that an AIG can never rebuild itself over the counter.`,
  },
  {
    id: 'm5-j-18',
    moduleId: M5,
    theme: 'la titrisation : ABS, MBS, CDO',
    themeEn: 'securitisation: ABS, MBS, CDOs',
    difficulte: 2,
    question: 'Comment fabrique-t-on du AAA à partir d\'un pool BBB ?',
    questionEn: 'How do you manufacture AAA out of a BBB pool?',
    plan: [
      'Poser les deux gestes : le POOLING (des milliers de prêts illiquides deviennent un objet statistique, cédés en true sale à un SPV/FCT) puis le TRANCHING (le passif est découpé en couches hiérarchisées)',
      'Décrire la structure canonique : equity 0-3 % (première perte), mezzanine 3-6 %, senior 6-100 % — perte de tranche = clamp((L − A)/(D − A)) : à L = 5 %, la mezzanine perd 66,666667 %',
      'Empiler le rehaussement : subordination, surdimensionnement, excess spread, compte de réserve — sur le papier, la probabilité de perte du senior devient infinitésimale',
      'Donner la réserve : tout repose sur la corrélation des défauts — le AAA obtenu vaut ce que vaut l\'hypothèse distributionnelle qui le fonde',
    ],
    planEn: [
      'Set the two moves: POOLING (thousands of illiquid loans become a statistical object, sold in a true sale to an SPV) then TRANCHING (the liability side is cut into hierarchical layers)',
      'Describe the canonical structure: equity 0-3% (first loss), mezzanine 3-6%, senior 6-100% — tranche loss = clamp((L − A)/(D − A)): at L = 5%, the mezzanine loses 66.666667%',
      'Stack the enhancement: subordination, overcollateralisation, excess spread, reserve account — on paper, the senior\'s loss probability becomes infinitesimal',
      'Give the caveat: everything rests on default correlation — the AAA obtained is worth what the underlying distributional assumption is worth',
    ],
    pointsAttendus: [
      'La plomberie juridique : cession parfaite (true sale) à un véhicule dédié — étanchéité dans les deux sens, l\'investisseur n\'a de recours que sur le pool',
      'Le pooling seul ne suffit pas : un pool de prêts BBB reste un actif BBB — c\'est le tranchage qui redistribue le risque',
      'La formule et ses ancres : perte de tranche = clamp((L − A)/(D − A)) × 100 — mezzanine 3-6 % : intacte à L = 2 %, 66,666667 % à L = 5 %, rasée à 8 % ; l\'equity 0-3 % rasée dès 3 %',
      'Le levier sans emprunt : entre 3 et 6 % de pertes du pool, chaque point détruit un tiers de la mezzanine — sensibilité de 33 pour 1, logée dans la structure',
      'L\'arsenal complet du rehaussement : subordination + surdimensionnement (105 de prêts pour 100 de titres) + excess spread (le pool rapporte 6 %, les tranches coûtent 4 %) + compte de réserve — plus la cascade et les tests OC/IC qui re-routent les flux',
      'La condition de validité : la protection du senior est une hypothèse sur la FORME de la distribution des pertes — défauts indépendants ⇒ muraille ; corrélation vers 1 ⇒ ligne Maginot',
    ],
    pointsAttendusEn: [
      'The legal plumbing: a true sale to a dedicated vehicle — watertight both ways, the investor\'s only recourse is the pool',
      'Pooling alone is not enough: a pool of BBB loans is still a BBB asset — tranching is what redistributes the risk',
      'The formula and its anchors: tranche loss = clamp((L − A)/(D − A)) × 100 — mezzanine 3-6%: intact at L = 2%, 66.666667% at L = 5%, wiped out at 8%; the 0-3% equity razed from 3%',
      'Leverage without borrowing: between 3% and 6% of pool losses, each point destroys a third of the mezzanine — a 33-to-1 sensitivity, housed in the structure',
      'The full enhancement arsenal: subordination + overcollateralisation (105 of loans for 100 of notes) + excess spread (the pool earns 6%, the tranches cost 4%) + a reserve account — plus the waterfall and the OC/IC tests that re-route the flows',
      'The validity condition: the senior\'s protection is an assumption about the SHAPE of the loss distribution — independent defaults ⇒ a rampart; correlation towards 1 ⇒ a Maginot line',
    ],
    bonus: [
      'Le mot du structureur : les points d\'attache se vendent — le métier consiste littéralement à vendre de l\'épaisseur de coussin, tranche par tranche, à des appétits différents',
      'La discipline moderne : rétention de 5 %, label STS sans re-titrisation — le AAA de structure existe encore, mais l\'originateur garde désormais une part du risque',
    ],
    bonusEn: [
      'The structurer\'s word: attachment points are what gets sold — the job literally consists of selling cushion thickness, tranche by tranche, to different appetites',
      'The modern discipline: 5% retention, the STS label with no re-securitisation — the structured AAA still exists, but the originator now keeps a share of the risk',
    ],
    reponseModele: `Deux gestes, dans cet ordre. Le **pooling** d'abord : des milliers de prêts individuellement illiquides sont cédés — en **true sale**, à un véhicule dédié (SPV/FCT) étanche dans les deux sens — et deviennent un objet statistique. Mais le pooling seul ne fabrique rien : un pool de prêts BBB reste un actif BBB.

La magie — à prendre avec méfiance — vient du **tranchage** : le passif du véhicule est découpé en couches hiérarchisées, définies par leurs points d'attache et de détachement. La structure canonique : **equity 0-3 %** (première perte), **mezzanine 3-6 %**, **senior 6-100 %**. La perte d'une tranche vaut clamp((L − A)/(D − A)) : à 5 % de pertes du pool, la mezzanine a perdu **66,666667 %** de son notionnel — le pool a perdu 5, la tranche les deux tiers. C'est du **levier sans emprunt** : 33 pour 1 entre attache et détachement, logé dans la structure.

S'empile ensuite le **rehaussement** : la subordination, le surdimensionnement (105 de prêts pour 100 de titres), l'excess spread (le pool rapporte 6 %, les tranches coûtent 4 %), un compte de réserve — plus la cascade et ses tests OC/IC qui re-routent les flux vers le senior en cas d'alerte. Sur le papier, le senior devient intouchable : voilà le AAA.

La réserve obligatoire, pour finir : tout repose sur la **corrélation des défauts**. Indépendants, la loi des grands nombres fait du coussin de 6 % une muraille ; corrélés, la distribution devient bimodale et la muraille une ligne Maginot. Le AAA fabriqué vaut exactement ce que vaut cette hypothèse.`,
    reponseModeleEn: `Two moves, in this order. **Pooling** first: thousands of individually illiquid loans are sold — in a **true sale**, to a dedicated vehicle (SPV) watertight both ways — and become a statistical object: predictable flows, documented history, granularity. But pooling alone manufactures nothing: a pool of BBB loans is still a BBB asset.

The magic — to be handled with suspicion — comes from **tranching**: the vehicle\'s liability side is cut into hierarchical layers, defined by attachment and detachment points. The canonical structure: **equity 0-3%** (first loss), **mezzanine 3-6%**, **senior 6-100%**. A tranche\'s loss is clamp((L − A)/(D − A)): at 5% pool losses, the mezzanine has lost **66.666667%** of its notional — the pool lost 5, the tranche two thirds. That is **leverage without borrowing**: 33 to 1 between attachment and detachment, housed in the structure.

Then the **enhancement** stacks up: subordination (the thickness of the tranches below), overcollateralisation (105 of loans for 100 of notes), excess spread (the pool earns 6%, the tranches cost 4%), a reserve account — plus the waterfall and its OC/IC tests re-routing flows to the senior when alarms ring. On paper, the senior\'s loss probability becomes infinitesimal: there is your AAA.

The mandatory caveat, to finish: everything rests on **default correlation**. Independent, the law of large numbers turns the 6% cushion into a rampart; correlated, the distribution turns bimodal and the rampart into a Maginot line. The manufactured AAA is worth exactly what that assumption is worth.`,
  },
  {
    id: 'm5-j-19',
    moduleId: M5,
    theme: 'la titrisation : ABS, MBS, CDO',
    themeEn: 'securitisation: ABS, MBS, CDOs',
    difficulte: 4,
    question: 'Pourquoi le AAA d\'un CDO n\'est-il pas le AAA de Nestlé ?',
    questionEn: 'Why is a CDO\'s AAA not Nestlé\'s AAA?',
    plan: [
      'Poser la thèse : même lettre, deux objets — un AAA corporate survit à presque tous les scénarios ; un AAA de structure survit à tous les scénarios sauf un, et sa valeur dépend de la probabilité de ce scénario',
      'Démontrer sur un coin de table : 100 prêts à PD 2 %, senior attaché à 6 % — défauts indépendants : binomiale de moyenne 2, écart-type ~1,4, P(> 6 défauts) < 0,5 % ; corrélation parfaite : 0 % ou 100 %, senior détruit une fois sur cinquante, en entier',
      'Souligner l\'invariant : l\'espérance de perte du pool est IDENTIQUE (2 %) dans les deux mondes — la titrisation ne réduit pas le risque, elle le redistribue le long de la distribution ; le senior est structurellement short de corrélation',
      'Refermer sur 2008 : un AAA de CDO cotant 30 sans défaut supplémentaire réalisé — le marché re-priçait la corrélation ; une note calibrée sur un siècle de bilans corporate avait été apposée sur un objet sans historique',
    ],
    planEn: [
      'State the thesis: same letter, two objects — a corporate AAA survives almost every scenario; a structured AAA survives every scenario but one, and its value depends on that scenario\'s probability',
      'Prove it on the back of an envelope: 100 loans at 2% PD, senior attached at 6% — independent defaults: binomial with mean 2, standard deviation ~1.4, P(> 6 defaults) < 0.5%; perfect correlation: 0% or 100%, the senior destroyed once in fifty, in full',
      'Underline the invariant: the pool\'s expected loss is IDENTICAL (2%) in both worlds — securitisation does not reduce risk, it redistributes it along the distribution; the senior is structurally short correlation',
      'Close on 2008: a CDO AAA quoting 30 with no additional realised default — the market was repricing correlation; a rating calibrated on a century of corporate balance sheets had been stamped on an object with no history',
    ],
    pointsAttendus: [
      'La distinction fondatrice : le AAA corporate est une opinion sur UN bilan ; le AAA de structure est une opinion sur la FORME d\'une distribution de pertes — c\'est-à-dire sur une corrélation',
      'Le calcul des deux mondes : défauts indépendants ⇒ binomiale resserrée (moyenne 2, σ ≈ 1,4, dépasser l\'attache de 6 % : < 0,5 %) ; corrélation 1 ⇒ distribution bimodale, pertes de 0 % (98 %) ou 100 % (2 %)',
      'L\'invariant qui tue le raisonnement naïf : l\'espérance de perte est 2 % dans les deux cas — mais le senior passe d\'intouchable à détruit une fois sur cinquante, et détruit EN ENTIER',
      'La formule « short corrélation » : le senior a vendu une assurance contre le scénario où tout le pool meurt ensemble — et sa notation supposait ce scénario impossible (« les prix immobiliers n\'ont jamais baissé au niveau national »)',
      'La preuve de marché 2008 : des tranches AAA passant de 100 à 30 sans défaut supplémentaire réalisé — un repricing de la corrélation, pas des pertes courantes',
      'La critique juste des agences : la même échelle calibrée sur un siècle de défauts corporate a été appliquée à un objet dont personne n\'avait l\'historique — le procès porte sur le AAA de structure, pas sur l\'alphabet',
    ],
    pointsAttendusEn: [
      'The founding distinction: the corporate AAA is an opinion on ONE balance sheet; the structured AAA is an opinion on the SHAPE of a loss distribution — that is, on a correlation',
      'The two-world calculation: independent defaults ⇒ a tight binomial (mean 2, σ ≈ 1.4, exceeding the 6% attachment: < 0.5%); correlation 1 ⇒ a bimodal distribution, losses of 0% (98%) or 100% (2%)',
      'The invariant that kills the naive reasoning: expected loss is 2% in both cases — but the senior goes from untouchable to destroyed once in fifty, and destroyed IN FULL',
      'The "short correlation" phrase: the senior sold insurance against the scenario where the whole pool dies together — and its rating assumed that scenario impossible ("national house prices have never fallen")',
      'The 2008 market proof: AAA tranches going from 100 to 30 with no additional realised default — a repricing of correlation, not of running losses',
      'The fair criticism of the agencies: the same scale calibrated on a century of corporate defaults was applied to an object nobody had a history for — the trial concerns the structured AAA, not the alphabet',
    ],
    bonus: [
      'Le prolongement professionnel : les desks « de corrélation » ne font que trader ce paramètre — le prix d\'une tranche est un pari sur la forme de la distribution, l\'espérance étant fixée par le pool',
      'L\'aggravation CDO² : re-titriser des mezzanines déjà concentrées sur le même scénario immobilier empile les corrélations — chaque étage refabrique du AAA plus fragile que le précédent ; le produit est essentiellement éteint depuis 2008',
    ],
    bonusEn: [
      'The professional extension: "correlation" desks do nothing but trade this parameter — a tranche\'s price is a bet on the shape of the distribution, the expectation being fixed by the pool',
      'The CDO² aggravation: re-securitising mezzanines already concentrated on the same housing scenario stacks the correlations — each floor remanufactures a more fragile AAA than the last; the product has been essentially extinct since 2008',
    ],
    reponseModele: `Parce que la même lettre recouvre deux objets. Le AAA de Nestlé est une opinion sur **un bilan** : il survit à presque tous les scénarios. Le AAA d'un CDO est une opinion sur la **forme d'une distribution de pertes** — c'est-à-dire sur une corrélation : il survit à tous les scénarios sauf un.

La démonstration tient sur un coin de table. Pool de 100 prêts à PD 2 %, senior attaché à 6 %. **Défauts indépendants** : le nombre de défauts suit une binomiale de moyenne 2 et d'écart-type ~1,4 — dépasser 6 défauts a moins de 0,5 % de chances : le senior est virtuellement intouchable. **Corrélation parfaite** : un seul tirage pour tout le pool — 0 % de pertes avec probabilité 98 %, 100 % avec probabilité 2 %. L'espérance de perte est **identique** — 2 % — dans les deux mondes ; mais le senior passe d'intouchable à **détruit une fois sur cinquante, en entier**. La titrisation ne réduit pas le risque : elle le redistribue le long de la distribution.

Le senior est donc structurellement **short de corrélation** : il a vendu une assurance contre le scénario où tous les emprunteurs meurent ensemble — et sa notation supposait ce scénario inexistant : « les prix immobiliers n'ont jamais baissé au niveau national ». Preuve de marché, 2008 : des AAA de CDO cotant **30 sans qu'un défaut supplémentaire soit réalisé** — le marché re-priçait la corrélation, pas les pertes courantes.

La chute : une note calibrée sur un siècle de bilans d'entreprises a été apposée sur un objet dont personne n'avait l'historique. Même alphabet, autre monde.`,
    reponseModeleEn: `Because the same letter covers two objects. Nestlé\'s AAA is an opinion on **one balance sheet**: it survives almost every scenario. A CDO\'s AAA is an opinion on the **shape of a loss distribution** — that is, on a correlation: it survives every scenario but one.

The proof fits on the back of an envelope. A pool of 100 loans at 2% PD, senior attached at 6%. **Independent defaults**: the number of defaults follows a binomial with mean 2 and standard deviation ~1.4 — exceeding 6 defaults has less than a 0.5% chance: the senior is virtually untouchable, and that is what the 2006 models computed. **Perfect correlation**: a single draw for the whole pool — 0% losses with probability 98%, 100% with probability 2%. The expected loss is **identical** — 2% — in both worlds; but the senior goes from untouchable to **destroyed once in fifty, in full**. Securitisation does not reduce risk by an iota: it redistributes it along the distribution.

The senior is therefore structurally **short correlation**: it sold insurance against the scenario where all borrowers die together — and its rating assumed that scenario away: "national house prices have never fallen". 2008 supplied the market proof: CDO AAAs quoting **30 with no additional realised default** — the market was repricing correlation, not running losses.

The punchline: a rating calibrated on a century of corporate balance sheets was stamped on an object nobody had a history for. It is not the same letter — it is the same alphabet applied to another world.`,
  },
  {
    id: 'm5-j-20',
    moduleId: M5,
    theme: 'la titrisation : ABS, MBS, CDO',
    themeEn: 'securitisation: ABS, MBS, CDOs',
    difficulte: 3,
    question: 'CLO et CDO d\'ABS : pourquoi l\'un a survécu à 2008 et pas l\'autre ?',
    questionEn: 'CLOs and ABS CDOs: why did one survive 2008 and not the other?',
    plan: [
      'Écarter la fausse piste : la structure est semblable — tranches, cascade, tests OC/IC ; la différence est le SOUS-JACENT et son régime de corrélation',
      'Décrire le CLO : des leveraged loans — des entreprises de secteurs et de cycles variés, sélectionnées et gérées activement par un gérant ; des défauts imparfaitement corrélés',
      'Décrire le CDO d\'ABS : une RE-titrisation — des tranches mezzanine de RMBS, déjà des falaises, toutes adossées au même marché immobilier national : l\'empilement des corrélations',
      'Donner le verdict de 2008 et la leçon : zéro défaut de tranche AAA de CLO contre l\'hécatombe des CDO d\'ABS — on juge une titrisation à la corrélation de son pool, pas à sa structure',
    ],
    planEn: [
      'Dismiss the false lead: the structure is similar — tranches, waterfall, OC/IC tests; the difference is the UNDERLYING and its correlation regime',
      'Describe the CLO: leveraged loans — companies from varied sectors and cycles, selected and actively managed by a manager; imperfectly correlated defaults',
      'Describe the ABS CDO: a RE-securitisation — mezzanine tranches of RMBS, already cliffs, all backed by the same national housing market: correlations stacked on correlations',
      'Give the 2008 verdict and the lesson: zero CLO AAA tranche defaults against the ABS CDO massacre — you judge a securitisation by its pool\'s correlation, not by its structure',
    ],
    pointsAttendus: [
      'Le refus du procès de structure : tranches, cascade, tests — tout est semblable ; c\'est le pool qui sépare les destins',
      'Le CLO défini : pools de leveraged loans (entreprises endettées, souvent sous LBO), gérés activement — des secteurs variés qui ne défaillent pas tous ensemble',
      'Le CDO d\'ABS défini : re-titrisation de tranches mezzanine de RMBS — des expositions déjà en falaise, concentrées sur le MÊME scénario immobilier national',
      'L\'argument de corrélation explicite : des entreprises diversifiées ≠ 50 000 hypothèques adossées au même marché — le premier pool a une distribution resserrée, le second devient bimodal dans un retournement national',
      'Le verdict factuel : les tranches AAA de CLO ont traversé 2008 sans un défaut — l\'argument (exact) de tout vendeur de CLO ; les CDO d\'ABS ont été décimés et le CDO² est éteint',
      'La leçon généralisable : se méfier par principe de toute RE-titrisation — exclue du label STS — et juger le pool, pas le montage',
    ],
    pointsAttendusEn: [
      'Refusing the structural trial: tranches, waterfall, tests — all similar; it is the pool that separates the fates',
      'The CLO defined: pools of leveraged loans (indebted companies, often under LBO), actively managed — varied sectors that do not all fail together',
      'The ABS CDO defined: a re-securitisation of RMBS mezzanine tranches — exposures already on a cliff, concentrated on the SAME national housing scenario',
      'The explicit correlation argument: diversified companies ≠ 50,000 mortgages backed by the same market — the first pool has a tight distribution, the second turns bimodal in a national downturn',
      'The factual verdict: CLO AAA tranches went through 2008 without a single default — the (accurate) argument of every CLO salesman; ABS CDOs were decimated and the CDO² is extinct',
      'The generalisable lesson: distrust any RE-securitisation on principle — excluded from the STS label — and judge the pool, not the packaging',
    ],
    bonus: [
      'La nuance pour aujourd\'hui : les CLO achètent les deux tiers des loans — un soutien puissant et procyclique — et la part majoritaire de cov-lite annonce des recouvrements plus bas au prochain cycle : avoir survécu à 2008 ne vaut pas quitus pour 2030',
      'Le mécanisme de l\'empilement : chaque étage de re-titrisation refabrique du AAA à partir des invendus de l\'étage inférieur — la falaise se reconstruit sur la falaise, dans le même scénario',
    ],
    bonusEn: [
      'The nuance for today: CLOs buy two thirds of the loans — a powerful, procyclical support — and the majority cov-lite share announces lower recoveries next cycle: surviving 2008 is no clean bill of health for 2030',
      'The stacking mechanism: each re-securitisation floor remanufactures AAA from the unsold leftovers of the floor below — the cliff is rebuilt upon the cliff, within the same scenario',
    ],
    reponseModele: `Écartez d'abord la fausse piste : la différence n'est **pas la structure**. Tranches, cascade, tests OC/IC — tout est semblable. Ce qui sépare les destins, c'est le **sous-jacent et son régime de corrélation**.

Le **CLO** met en pool des *leveraged loans* — des prêts à des entreprises endettées, souvent sous LBO, sélectionnés et gérés activement par un gérant. Des secteurs variés, des cycles différents : des défauts imparfaitement corrélés, donc une distribution de pertes resserrée autour de sa moyenne — le monde où la subordination protège vraiment.

Le **CDO d'ABS** de 2007 faisait autre chose : une **re-titrisation**. Il remettait en pool des tranches *mezzanine* de RMBS — des expositions déjà en falaise, à sensibilité 33 pour 1 — toutes adossées au **même marché immobilier national**. L'empilement des corrélations : ces mezzanines meurent toutes ensemble dans le même scénario, précisément celui que les modèles excluaient. Des entreprises diversifiées ne sont pas 50 000 hypothèques adossées au même sous-jacent.

Le verdict de 2008 est sans appel : **zéro défaut de tranche AAA de CLO** — l'argument, factuellement exact, que tout vendeur de CLO vous opposera — contre l'hécatombe des CDO d'ABS, et l'extinction du CDO². La leçon à généraliser : on ne juge jamais une titrisation à son montage, on la juge à la **corrélation de son pool** — et l'on se méfie par principe de toute re-titrisation, désormais exclue du label STS. Avec la nuance d'aujourd'hui : les CLO achètent les deux tiers des loans, majoritairement cov-lite — avoir survécu à 2008 ne vaut pas quitus pour le prochain cycle.`,
    reponseModeleEn: `Dismiss the false lead first: the difference is **not the structure**. Tranches, waterfall, OC/IC tests — everything is similar. What separates the fates is the **underlying and its correlation regime**.

The **CLO** pools *leveraged loans* — loans to indebted companies, often under LBO, selected and actively managed by a manager. Varied sectors, different cycles: imperfectly correlated defaults, hence a loss distribution tight around its mean — the world where subordination genuinely protects.

The 2007 **ABS CDO** did something else: a **re-securitisation**. It re-pooled *mezzanine* tranches of RMBS — exposures already on a cliff, with 33-to-1 sensitivity — all backed by the **same national housing market**. Correlations stacked on correlations: those mezzanines die together in the same scenario, precisely the one the models excluded. Diversified companies are not 50,000 mortgages backed by the same underlying.

The 2008 verdict is final: **zero CLO AAA tranche defaults** — the factually accurate argument every CLO salesman will hand you — against the ABS CDO massacre, and the extinction of the CDO². The lesson to generalise: never judge a securitisation by its packaging, judge it by its **pool\'s correlation** — and distrust any re-securitisation on principle, now excluded from the STS label. With today\'s nuance: CLOs buy two thirds of the loans, majority cov-lite — surviving 2008 is no clean bill of health for the next cycle.`,
  },
  {
    id: 'm5-j-21',
    moduleId: M5,
    theme: 'la titrisation : ABS, MBS, CDO',
    themeEn: 'securitisation: ABS, MBS, CDOs',
    difficulte: 2,
    question: 'À quoi sert la rétention obligatoire de 5 % ?',
    questionEn: 'What is the mandatory 5% retention for?',
    plan: [
      'Nommer le mal soigné : l\'originate-to-distribute — chaque maillon (courtier, arrangeur, agence) payé au flux, le risque final chez un investisseur qui n\'a jamais vu l\'emprunteur : la qualité devient l\'affaire de personne',
      'Décrire le remède : l\'originateur doit garder à son bilan au moins 5 % du risque de chaque opération — le skin in the game qui réaligne les incitations',
      'Situer le dispositif : un pilier de la titrisation disciplinée post-2008, avec le label STS (2019) — pas de re-titrisation, historiques documentés, données ligne à ligne',
      'Donner les limites honnêtes : 5 % reste modeste, et la rétention ne crée aucun recours pour l\'investisseur — elle change les incitations à l\'origination, pas la nature du titre',
    ],
    planEn: [
      'Name the disease being treated: originate-to-distribute — every link (broker, arranger, agency) paid on flow, the final risk with an investor who never saw the borrower: quality becomes nobody\'s business',
      'Describe the remedy: the originator must keep at least 5% of each deal\'s risk on its balance sheet — skin in the game realigning the incentives',
      'Place the device: a pillar of post-2008 disciplined securitisation, with the STS label (2019) — no re-securitisation, documented histories, loan-level data',
      'Give the honest limits: 5% remains modest, and retention creates no recourse for the investor — it changes origination incentives, not the nature of the security',
    ],
    pointsAttendus: [
      'Le diagnostic comportemental : quand celui qui accorde le prêt le garde trente ans, il vérifie ; quand il le revend dans la semaine, il est payé au volume — commission, next',
      'La chaîne complète du vice : courtier, arrangeur, agence — chacun rémunéré au passage de l\'actif, personne ne portant le risque final : le carburant de 2007',
      'Le mécanisme du remède : garder au moins 5 % du risque au bilan — l\'originateur reste exposé à la qualité de ce qu\'il a produit, chaque maillon a de nouveau quelque chose à perdre',
      'Le cadre d\'ensemble : rétention + label STS (simple, transparent, standardisé, 2019) — interdiction de la re-titrisation, documentation des historiques de défaut, transparence ligne à ligne',
      'La limite à énoncer soi-même : 5 % ne transforme pas le titre — pas de recours contre l\'originateur (la true sale demeure), et une equity 0-3 % bien choisie peut concentrer plus de risque que la rétention n\'en garde',
    ],
    pointsAttendusEn: [
      'The behavioural diagnosis: when the loan originator keeps it for thirty years, he checks; when he resells it within the week, he is paid on volume — commission, next',
      'The full chain of the vice: broker, arranger, agency — each paid as the asset passes through, nobody carrying the final risk: the fuel of 2007',
      'The remedy\'s mechanism: keep at least 5% of the risk on the balance sheet — the originator stays exposed to the quality of what he produced, every link once again has something to lose',
      'The overall framework: retention + the STS label (simple, transparent, standardised, 2019) — re-securitisation banned, documented default histories, loan-level transparency',
      'The limit to state unprompted: 5% does not transform the security — no recourse against the originator (the true sale remains), and a well-chosen 0-3% equity can concentrate more risk than the retention keeps',
    ],
    bonus: [
      'Le contrepoint architectural : le covered bond résout le même problème par la structure inverse — pool au bilan, double recours, zéro tranchage : la version prudente vieille de deux siècles, qui n\'est PAS une titrisation',
      'L\'enjeu européen actuel : relancer une titrisation disciplinée pour désengorger des bilans bancaires qui portent 80 % du financement de l\'économie — l\'outil n\'était pas coupable, l\'usage l\'était',
    ],
    bonusEn: [
      'The architectural counterpoint: the covered bond solves the same problem with the inverse structure — pool on balance sheet, dual recourse, zero tranching: the two-century-old prudent version, which is NOT a securitisation',
      'The current European stake: reviving disciplined securitisation to relieve bank balance sheets that carry 80% of the economy\'s financing — the tool was not guilty, the use was',
    ],
    reponseModele: `Elle soigne le vice d'incitations qui a alimenté 2007 : l'**originate-to-distribute**. Quand celui qui accorde le prêt le garde trente ans à son bilan, il vérifie l'emprunteur — sa survie en dépend. Quand il le revend dans la semaine pour titrisation, il est payé **au flux** : commission à l'origination, volume, next. Et le vice remonte toute la chaîne — courtier, arrangeur, agence de notation — chacun rémunéré au passage de l'actif, le risque final atterrissant chez un investisseur qui n'a jamais vu l'emprunteur. La qualité du crédit devient l'affaire de tout le monde, c'est-à-dire de personne.

Le remède est d'une simplicité assumée : le **skin in the game**. L'originateur doit conserver à son bilan **au moins 5 % du risque** de chaque opération — plus de distribution intégrale, chaque producteur reste exposé à la qualité de ce qu'il a fabriqué. On ne demande pas la vertu : on redonne à chacun quelque chose à perdre.

Le dispositif s'inscrit dans la titrisation disciplinée d'après-crise, avec le **label STS** (simple, transparent, standardisé, 2019) : interdiction de la re-titrisation, historiques de défaut documentés, données ligne à ligne pour l'investisseur.

Et les limites, à énoncer soi-même : 5 % reste modeste, et la rétention ne crée **aucun recours** pour l'investisseur — la true sale demeure, vous achetez toujours le pool, pas la signature du cédant. Elle change les incitations à l'origination, pas la nature du titre. La comparaison qui éclaire : le covered bond résout le même problème par la structure inverse — pool au bilan, double recours, zéro tranchage.`,
    reponseModeleEn: `It treats the incentive vice that fuelled 2007: **originate-to-distribute**. When the one granting the loan keeps it on his balance sheet for thirty years, he checks the borrower — his survival depends on it. When he resells it within the week for securitisation, he is paid **on flow**: origination fee, volume, next. And the vice runs up the whole chain — broker, arranger, rating agency — each paid as the asset passes through, the final risk landing with an investor who never saw the borrower. Credit quality becomes everybody\'s business, that is to say nobody\'s.

The remedy is deliberately simple: **skin in the game**. The originator must keep **at least 5% of the risk** of each deal on its balance sheet — no more full distribution, every producer stays exposed to the quality of what he manufactured. Virtue is not requested: everyone is given something to lose again.

The device belongs to post-crisis disciplined securitisation, alongside the **STS label** (simple, transparent, standardised, 2019): re-securitisation banned, documented default histories, loan-level data for the investor.

And the limits, to state unprompted: 5% remains modest, and retention creates **no recourse** for the investor — the true sale remains, you still buy the pool, not the seller\'s signature. It changes origination incentives, not the nature of the security. The clarifying comparison: the covered bond solves the same problem with the inverse structure — pool on balance sheet, dual recourse, zero tranching.`,
  },
  {
    id: 'm5-j-22',
    moduleId: M5,
    theme: 'le cycle du crédit et le desk',
    themeEn: 'the credit cycle and the desk',
    difficulte: 3,
    question: '« Où en est-on du cycle du crédit ? » Comment répondriez-vous ?',
    questionEn: '"Where are we in the credit cycle?" How would you answer?',
    plan: [
      'Cadrer d\'abord la question : personne n\'attend une prédiction — on attend un REPÉRAGE méthodique, en trois lectures publiques',
      'Lecture 1, le prix : les spreads contre leur historique — Main 50-80 pb et Crossover 250-400 pb en temps calme, le double en stress ; serrés = expansion mûre, écartés = retournement ou purge',
      'Lecture 2, les défauts : le taux courant et son anticipation à 12 mois — en se rappelant que le pic suit le retournement de 12 à 18 mois : le défaut est un événement retardé',
      'Lecture 3, la quantité : l\'état du primaire — qui parvient à émettre, à quelle prime de nouvelle émission, avec quelle part de cov-lite ; le vrai signal du retournement est la fermeture du guichet, pas le prix',
    ],
    planEn: [
      'Frame the question first: nobody expects a prediction — they expect a methodical BEARINGS-TAKING, in three public readings',
      'Reading 1, the price: spreads against their history — Main 50-80 bp and Crossover 250-400 bp in calm times, double under stress; tight = mature expansion, wide = turning point or purge',
      'Reading 2, defaults: the current rate and its 12-month expectation — remembering that the peak follows the turn by 12 to 18 months: default is a delayed event',
      'Reading 3, the quantity: the state of the primary market — who manages to issue, at what new-issue premium, with what cov-lite share; the true signal of the turn is the window closing, not the price',
    ],
    pointsAttendus: [
      'La posture : refuser la boule de cristal et dérouler une méthode — trois chiffres publics, une réponse structurée : la différence entre réciter un cours et lire un marché',
      'Les quatre temps du cycle en toile de fond : expansion (spreads serrés, discipline qui fond — Minsky : la stabilité est déstabilisante), retournement (le primaire se ferme), défauts (12-18 mois plus tard), purge et redémarrage (les meilleurs millésimes s\'achètent dans la peur)',
      'Les repères de spread : Main 50-80 pb, Crossover 250-400 pb en temps calme — et leur position actuelle relative à l\'historique comme premier diagnostic',
      'Le canal des défauts : la mort par refinancement — la dette existante est à taux fixe, l\'émetteur meurt quand une échéance tombe devant un guichet fermé ; d\'où le mur de refinancement comme outil de datation',
      'Les thermomètres du primaire : la NIP (quasi nulle en expansion, béante dans le doute) et la part de cov-lite (le thermomètre de l\'excès — et le LGD de demain)',
      'La lecture avancée : les spreads HY voient avant les statistiques — le primaire se grippe deux ou trois trimestres avant que la récession ne se voie dans le PIB',
    ],
    pointsAttendusEn: [
      'The stance: refuse the crystal ball and unroll a method — three public numbers, one structured answer: the difference between reciting a course and reading a market',
      'The four beats of the cycle as backdrop: expansion (tight spreads, melting discipline — Minsky: stability is destabilising), the turn (the primary closes), defaults (12-18 months later), purge and restart (the best vintages are bought in fear)',
      'The spread anchors: Main 50-80 bp, Crossover 250-400 bp in calm times — and their current position relative to history as the first diagnosis',
      'The default channel: death by refinancing — existing debt is fixed-rate, the issuer dies when a maturity lands in front of a closed window; hence the maturity wall as the dating tool',
      'The primary\'s thermometers: the NIP (near zero in expansion, gaping in doubt) and the cov-lite share (the thermometer of excess — and tomorrow\'s LGD)',
      'The leading-indicator reading: HY spreads see before the statistics — the primary seizes up two or three quarters before the recession shows in GDP',
    ],
    bonus: [
      'La quatrième lecture qui impressionne : QUI porte le risque — fonds quotidiens sur actif illiquide, assureurs vendeurs mécaniques de fallen angels, CLO procycliques, private credit sans prix : la carte des porteurs dit comment la prochaine dislocation se propagera',
      'Le corollaire d\'investisseur : au pic de défauts, les spreads ont souvent déjà commencé à se resserrer — les meilleurs millésimes HY s\'achètent dans la peur, pas après elle',
    ],
    bonusEn: [
      'The fourth reading that impresses: WHO carries the risk — daily funds on an illiquid asset, insurers as mechanical sellers of fallen angels, procyclical CLOs, private credit without prices: the map of holders tells you how the next dislocation will propagate',
      'The investor\'s corollary: at the default peak, spreads have often already started tightening — the best HY vintages are bought in fear, not after it',
    ],
    reponseModele: `Je commence par cadrer : personne n'attend une prédiction — on attend un **repérage**, méthodique, en trois lectures publiques.

**Le prix.** Les spreads contre leur historique : iTraxx Main vers 50-80 pb et Crossover vers 250-400 pb en temps calme, le double en stress. Des spreads serrés avec une discipline qui fond signalent une expansion mûre — c'est Minsky : la stabilité est déstabilisante, chaque année sans défaut justifie un cran de levier supplémentaire.

**Les défauts.** Le taux courant et son anticipation à 12 mois — en gardant le décalage en tête : le pic de défauts suit le retournement de **12 à 18 mois**, parce qu'un émetteur HY — dont la dette existante est à taux fixe — ne meurt pas quand son spread s'écarte mais quand une échéance tombe devant un guichet fermé : le marché du crédit tue par asphyxie, rarement par balle — d'où le **mur de refinancement** comme outil de datation.

**La quantité.** L'état du primaire — le vrai signal du retournement : qui parvient à émettre, à quelle **prime de nouvelle émission** (quasi nulle en expansion, béante dans le doute), avec quelle part de **cov-lite** — le thermomètre de l'excès, et le LGD de demain.

J'ajoute la lecture avancée — les spreads HY voient deux ou trois trimestres avant le PIB — puis la quatrième dimension : **qui porte le risque**. Fonds quotidiens sur actif illiquide, assureurs contraints, CLO procycliques, private credit sans prix : la carte des porteurs dit comment la prochaine dislocation se propagera. Trois chiffres publics, une réponse structurée : lire un marché, pas réciter un cours.`,
    reponseModeleEn: `I start by framing: nobody expects a prediction — they expect a methodical **bearings-taking**, in three public readings.

**The price.** Spreads against their history: iTraxx Main around 50-80 bp and Crossover around 250-400 bp in calm times, double under stress. Tight spreads with melting discipline signal a mature expansion — that is Minsky: stability is destabilising, every default-free year justifies one more notch of leverage.

**Defaults.** The current rate and its 12-month expectation — keeping the lag in mind: the default peak follows the turn by **12 to 18 months**, because a HY issuer does not die when its spread widens but when a maturity lands in front of a closed window. Its existing debt is fixed-rate: the credit market kills by asphyxiation, rarely by bullet — hence the **maturity wall** as the dating tool.

**The quantity.** The state of the primary market — the true signal of the turn: who manages to issue, at what **new-issue premium** (near zero in expansion, gaping in doubt), with what share of **cov-lite** — the thermometer of excess, and tomorrow\'s LGD.

I add the leading-indicator reading — HY spreads see two or three quarters before GDP — and, if the jury follows, the fourth dimension: **who carries the risk**. Daily funds on an illiquid asset, constrained insurers, procyclical CLOs, private credit without prices: the map of holders tells you how the next dislocation will propagate. Three public numbers, one structured answer: reading a market, not reciting a course.`,
  },
  {
    id: 'm5-j-23',
    moduleId: M5,
    theme: 'le cycle du crédit et le desk',
    themeEn: 'the credit cycle and the desk',
    difficulte: 4,
    question: 'Le private credit est-il le prochain accident ?',
    questionEn: 'Is private credit the next accident?',
    plan: [
      'Définir et dimensionner : ~1 500 Md$ de prêt direct non coté, né de la régulation — Bâle III et Dodd-Frank ont renchéri le prêt risqué pour les banques, des fonds fermés ont occupé le terrain',
      'Instruire à charge : pas de prix de marché, valorisation trimestrielle à dire d\'expert — la volatilité n\'a pas disparu, elle n\'est pas mesurée (volatility laundering) ; des emprunteurs trop petits ou trop endettés pour le marché obligataire ; jamais traversé un cycle de défauts complet à cette taille',
      'Instruire à décharge : fonds fermés — pas de porteur à rembourser demain, donc pas de vente forcée, structure plus stable qu\'un fonds HY quotidien ; créancier unique qui restructure vite, sans comité de 200 créanciers',
      'Conclure en nuance : ni panique ni marketing — 1 500 Md$ de risque ont migré des bilans supervisés vers des véhicules sans prix, et on découvrira la vérité des marks au prochain pic de défauts',
    ],
    planEn: [
      'Define and size: ~1,500bn$ of unlisted direct lending, born of regulation — Basel III and Dodd-Frank made risky lending expensive for banks, closed-end funds took the ground',
      'Prosecute: no market prices, quarterly expert-based valuation — volatility has not disappeared, it is simply not measured (volatility laundering); borrowers too small or too indebted for the bond market; never crossed a full default cycle at this size',
      'Defend: closed-end funds — no holder to repay tomorrow, hence no forced selling, a more stable structure than a daily HY fund; a single lender who restructures fast, without a 200-creditor committee',
      'Conclude in nuance: neither panic nor marketing — 1,500bn$ of risk migrated from supervised balance sheets to vehicles without prices, and the truth of the marks will be discovered at the next default peak',
    ],
    pointsAttendus: [
      'La définition exacte : du prêt direct non coté (~1 500 Md$), accordé par des fonds fermés à des entreprises trop petites ou trop endettées pour le marché obligataire — le supplément de rendement (10-12 % affichés) rémunère l\'illiquidité',
      'L\'origine réglementaire : la classe d\'actifs est née de Bâle III et Dodd-Frank — le risque n\'a pas disparu du système, il a migré des bilans bancaires supervisés vers des véhicules qui ne publient pas de prix',
      'L\'argument à charge central : la valorisation trimestrielle à dire d\'expert lisse artificiellement les rendements — le volatility laundering : la volatilité n\'est pas absente, elle n\'est pas mesurée ; personne ne connaît la vraie valeur avant d\'avoir besoin de vendre',
      'Les deux arguments à décharge sérieux : structure fermée sans passif exigible à vue (pas de spirale de rachats-ventes forcées) et restructuration rapide à créancier unique',
      'Le point d\'honnêteté épistémique : la classe d\'actifs n\'a pas encore traversé de cycle de défauts complet à sa taille actuelle — l\'absence d\'accident n\'est pas une preuve de robustesse',
      'La conclusion attendue : dire les deux faces sans trancher par slogan — c\'est exactement la nuance qui distingue un candidat',
    ],
    pointsAttendusEn: [
      'The exact definition: unlisted direct lending (~1,500bn$), extended by closed-end funds to companies too small or too indebted for the bond market — the extra yield (a displayed 10-12%) pays for illiquidity',
      'The regulatory origin: the asset class was born of Basel III and Dodd-Frank — the risk has not left the system, it migrated from supervised bank balance sheets to vehicles that publish no prices',
      'The central prosecution argument: quarterly expert-based valuation artificially smooths returns — volatility laundering: the volatility is not absent, it is unmeasured; nobody knows the true value until they need to sell',
      'The two serious defence arguments: a closed structure with no on-demand liabilities (no redemption/forced-sale spiral) and fast single-lender restructuring',
      'The epistemic honesty point: the asset class has not yet crossed a full default cycle at its current size — the absence of accident is not proof of robustness',
      'The expected conclusion: state both sides without slogan-cutting — exactly the nuance that distinguishes a candidate',
    ],
    bonus: [
      'Le parallèle historique à manier avec précaution : chaque crise du m11 a commencé par un risque migré hors du périmètre surveillé — repo en 2008, LDI en 2022 ; la migration ne condamne pas, elle désigne où regarder',
      'La question de flux qui fera le verdict : les fonds fermés lèvent par millésimes — si la collecte se retourne, le soutien au refinancement des emprunteurs fragiles disparaît, et le mur de maturités se découvre',
    ],
    bonusEn: [
      'The historical parallel to handle with care: every m11 crisis began with risk migrating outside the supervised perimeter — repo in 2008, LDI in 2022; migration does not condemn, it points to where to look',
      'The flow question that will decide the verdict: closed funds raise by vintages — if fundraising turns, the refinancing support for fragile borrowers disappears, and the maturity wall stands exposed',
    ],
    reponseModele: `La réponse qui vaut des points refuse le slogan — dans les deux sens. D'abord les faits : environ **1 500 Md$** de prêt direct non coté, accordé par des fonds fermés à des entreprises trop petites ou trop endettées pour le marché obligataire. La classe d'actifs est **née de la régulation** : Bâle III et Dodd-Frank ont renchéri le prêt risqué pour les banques ; le risque n'a pas disparu, il a **migré** des bilans supervisés vers des véhicules qui ne publient pas de prix.

**À charge.** L'argument de vente — 10-12 % de rendement, volatilité minuscule — mérite le scalpel : ces prêts ne cotent nulle part, leur valorisation est trimestrielle et à dire d'expert. La volatilité n'a pas disparu : elle n'est **pas mesurée** — le *volatility laundering*. Personne ne connaît la vraie valeur avant d'avoir besoin de vendre. Et surtout : la classe d'actifs n'a **jamais traversé un cycle de défauts complet à sa taille actuelle** — l'absence d'accident ne prouve rien.

**À décharge**, deux arguments sérieux. Les fonds sont **fermés** : pas de porteur à rembourser demain, donc pas de spirale rachats-ventes forcées — plus stable qu'un fonds HY à liquidité quotidienne. Et le **créancier unique** restructure vite, sans comité de 200 créanciers.

Le verdict honnête : ni panique, ni marketing. 1 500 Md$ de risque de crédit vivent hors des prix et hors de la supervision bancaire, et l'on découvrira ce que valent les *marks* au prochain pic de défauts.`,
    reponseModeleEn: `The answer that scores refuses the slogan — in both directions. The facts first: about **1,500bn$** of unlisted direct lending, extended by closed-end funds to companies too small or too indebted for the bond market. The asset class was **born of regulation**: Basel III and Dodd-Frank made risky lending expensive for banks; the risk did not disappear, it **migrated** from supervised balance sheets to vehicles that publish no prices.

**Prosecution.** The sales pitch — 10-12% returns, minuscule volatility — deserves the scalpel: these loans are quoted nowhere, their valuation is quarterly and expert-based. The volatility has not disappeared: it is **not measured** — *volatility laundering*. Nobody knows the true value until they need to sell. Above all: the asset class has **never crossed a full default cycle at its current size** — the absence of accident proves nothing.

**Defence**, two serious arguments. The funds are **closed**: no holder to repay tomorrow, hence no redemption/forced-sale spiral — structurally more stable than a daily-liquidity HY fund sitting on an illiquid asset. And the **single lender** restructures fast, without a 200-creditor committee.

The honest verdict: neither panic nor marketing. 1,500bn$ of credit risk lives outside prices and outside bank supervision, and we will discover what the *marks* are worth at the next default peak. Saying that — both sides, then the point of ignorance — is exactly the expected answer.`,
  },
  {
    id: 'm5-j-24',
    moduleId: M5,
    theme: 'le cycle du crédit et le desk',
    themeEn: 'the credit cycle and the desk',
    difficulte: 2,
    question: 'Comment shorte-t-on le crédit ?',
    questionEn: 'How do you short credit?',
    plan: [
      'Commencer par l\'impossibilité cash : vendre à découvert une obligation exige de l\'emprunter — rare et cher sur un gré à gré fragmenté en dizaines de milliers de souches qui dorment dans des portefeuilles',
      'Donner l\'instrument : acheter de la protection CDS — single-name pour un émetteur précis, indice (Main, Crossover) pour la photo d\'ensemble',
      'Décrire le profil : perte maximale connue (les primes payées), gain massif au défaut (1 − R) — la convexité d\'un put très en dehors de la monnaie',
      'Nommer le coût : le portage négatif — payer le spread en attendant, perdre au mark-to-market si les spreads se resserrent ; le short crédit est un pari qui saigne tant qu\'il n\'a pas raison',
    ],
    planEn: [
      'Start with the cash impossibility: short-selling a bond requires borrowing it — rare and expensive on an OTC market fragmented into tens of thousands of lines sleeping in portfolios',
      'Give the instrument: buy CDS protection — single-name for a specific issuer, index (Main, Crossover) for the big picture',
      'Describe the profile: known maximum loss (the premiums paid), massive gain at default (1 − R) — the convexity of a deep out-of-the-money put',
      'Name the cost: negative carry — paying the spread while waiting, losing on the mark-to-market if spreads tighten; a credit short is a bet that bleeds until it is proven right',
    ],
    pointsAttendus: [
      'Le diagnostic cash : chaque souche dort dans des portefeuilles qui ne prêtent pas — l\'emprunt de titres est l\'exception, le short cash est pratiquement infaisable à l\'échelle',
      'Le geste standard : acheter de la protection — le CDS donne le risque sans le titre, en single-name ou en indice selon que la vue est idiosyncratique ou macro',
      'Le profil asymétrique chiffré : payer 1 à 2 % par an pour recevoir de l\'ordre de 60 % du notionnel au défaut — profil de put très en dehors de la monnaie',
      'Le coût honnête : les primes sont perdues si le défaut ne vient pas, et le mark-to-market est négatif si le spread se resserre — le portage joue contre le short',
      'Les variantes de desk : vendre son inventaire ou sous-pondérer (le « short » du gérant long-only), couvrir un book à l\'indice — couvrir n\'est pas shorter, la nuance compte',
    ],
    pointsAttendusEn: [
      'The cash diagnosis: every line sleeps in portfolios that do not lend — securities borrowing is the exception, the cash short is practically unworkable at scale',
      'The standard move: buy protection — the CDS gives the risk without the paper, single-name or index depending on whether the view is idiosyncratic or macro',
      'The asymmetric profile in numbers: pay 1 to 2% a year to receive around 60% of notional at default — a deep out-of-the-money put profile',
      'The honest cost: the premiums are lost if the default never comes, and the mark-to-market is negative if the spread tightens — carry works against the short',
      'The desk variants: selling inventory or underweighting (the long-only manager\'s "short"), hedging a book with the index — hedging is not shorting, and the nuance matters',
    ],
    bonus: [
      'Le rappel historique : les shorts célèbres de 2007 étaient des achats de protection sur tranches mezzanine — même instrument, cible plus convexe encore ; et leur douleur fut le portage, des trimestres de primes avant d\'avoir raison',
      'La leçon de timing du chapitre 7 : le vrai signal est la fermeture du primaire, pas le niveau des spreads — shorter trop tôt coûte du portage, et le marché peut rester ouvert plus longtemps que votre patience',
    ],
    bonusEn: [
      'The historical reminder: the famous 2007 shorts were protection purchases on mezzanine tranches — the same instrument, an even more convex target; and their pain was carry, quarters of premiums before being proven right',
      'The chapter 7 timing lesson: the true signal is the primary market closing, not the spread level — shorting too early costs carry, and the market can stay open longer than your patience',
    ],
    reponseModele: `Commencez par ce qui ne marche pas : le short **cash**. Vendre à découvert une obligation exige de l'emprunter, or le marché est un gré à gré fragmenté en dizaines de milliers de souches dont la plupart dorment dans des portefeuilles qui ne prêtent pas — l'emprunt de titres est l'exception. Le short cash est pratiquement infaisable à l'échelle.

Le geste standard est donc d'**acheter de la protection CDS** — c'est le deuxième des trois usages du desk. En **single-name** si la vue est idiosyncratique — un émetteur précis dont vous anticipez la dégradation ; en **indice** — Main pour l'IG, Crossover pour le HY — si la vue est macro : « le cycle se retourne ». Le profil est celui d'un **put très en dehors de la monnaie** : perte maximale connue d'avance (les primes, 1 à 2 % par an), gain massif au défaut — de l'ordre de 60 % du notionnel avec R = 40 %.

Mais nommez le coût, c'est ce qui distingue la réponse : le **portage négatif**. Tant que le défaut ne vient pas, vous payez le spread trimestre après trimestre ; et si les spreads se *resserrent*, le mark-to-market joue contre vous. Un short crédit est un pari qui saigne tant qu'il n'a pas raison — les shorts célèbres de 2007 ont souffert des trimestres avant de gagner.

Complétez d'une nuance de desk : vendre son inventaire ou sous-pondérer est le « short » du gérant long-only, et acheter de la protection sur indice contre un book est une **couverture** — couvrir n'est pas shorter.`,
    reponseModeleEn: `Start with what does not work: the **cash** short. Short-selling a bond requires borrowing it, yet the market is an OTC space fragmented into tens of thousands of lines, most of them sleeping in portfolios that do not lend — securities borrowing is the exception. The cash short is practically unworkable at scale.

The standard move is therefore to **buy CDS protection** — the second of the desk\'s three uses. **Single-name** if the view is idiosyncratic — a specific issuer you expect to deteriorate; **index** — Main for IG, Crossover for HY — if the view is macro: "the cycle is turning". The profile is that of a **deep out-of-the-money put**: maximum loss known in advance (the premiums, 1 to 2% a year), massive gain at default — around 60% of notional with R = 40%.

But name the cost, because that is what distinguishes the answer: **negative carry**. As long as the default does not come, you pay the spread quarter after quarter; and if spreads *tighten*, the mark-to-market works against you. A credit short is a bet that bleeds until it is proven right — the famous 2007 shorts suffered for quarters before winning.

Complete with a desk nuance: selling inventory or underweighting is the long-only manager\'s "short", and buying index protection against a book is a **hedge** — hedging is not shorting.`,
  },
  {
    id: 'm5-j-25',
    moduleId: M5,
    theme: 'le cycle du crédit et le desk',
    themeEn: 'the credit cycle and the desk',
    difficulte: 4,
    question: 'Brainteaser : votre book perd 2 % par an en perte attendue et porte 350 pb de spread. Décomposez votre P&L attendu — et dites ce qui peut le détruire.',
    questionEn: 'Brainteaser: your book loses 2% a year in expected loss and carries 350 bp of spread. Break down your expected P&L — and say what can destroy it.',
    plan: [
      'Poser la décomposition : portage de spread +350 pb, perte attendue −200 pb ⇒ +150 pb par an de rendement net attendu au-dessus du sans-risque — c\'est la prime de risque et de liquidité qu\'on encaisse en portant',
      'Vérifier la cohérence : avec R = 40 %, l\'EL de 2 % correspond à une PD « réelle » d\'environ 3,3 %, quand le spread de 350 pb price une PD risque-neutre de ~5,8 % — l\'écart EST la prime, le book est payé pour le stress',
      'Premier destructeur : le mark-to-market — spread duration 5 et +100 pb d\'écartement = −5 %, plus de trois ans de portage net effacés ; +300 pb type crise = −15 %',
      'Deuxième et troisième destructeurs : les grappes (l\'EL est une moyenne — l\'année de récession réalise 6-8 % de défauts, pas 2) et la liquidité (rachats, falaise fallen angel : vendre dans la dislocation transforme la perte papier en perte réalisée)',
    ],
    planEn: [
      'Set the decomposition: spread carry +350 bp, expected loss −200 bp ⇒ +150 bp per year of expected net return over risk-free — the risk and liquidity premium you collect by carrying',
      'Check the consistency: with R = 40%, the 2% EL corresponds to a "real" PD of about 3.3%, while the 350 bp spread prices a risk-neutral PD of ~5.8% — the gap IS the premium, the book is paid for stress',
      'First destroyer: the mark-to-market — spread duration 5 and +100 bp of widening = −5%, more than three years of net carry erased; +300 bp crisis-style = −15%',
      'Second and third destroyers: clusters (EL is an average — the recession year realises 6-8% of defaults, not 2) and liquidity (redemptions, the fallen-angel cliff: selling into the dislocation turns the paper loss into a realised one)',
    ],
    pointsAttendus: [
      'La décomposition immédiate et propre : +350 pb de portage − 200 pb d\'EL = +150 pb par an de P&L attendu au-dessus du sans-risque — énoncée en dix secondes',
      'L\'identification de ce que sont ces 150 pb : la prime de risque et d\'illiquidité — le book vend de l\'assurance contre le mauvais état du monde et encaisse le loyer',
      'La cohérence risque-neutre/historique : PD implicite dans 350 pb ≈ 3,5/0,6 ≈ 5,8 % contre PD attendue ≈ 2/0,6 ≈ 3,3 % — l\'écart de pricing confirme la prime',
      'Le premier destructeur chiffré : l\'écartement de spread × la spread duration — le mark-to-market peut effacer des années de portage en un mois, sans aucun défaut réalisé',
      'Le deuxième destructeur : l\'EL est une espérance — les défauts arrivent en grappes en récession, et l\'année de queue réalise plusieurs fois la moyenne, précisément quand le mark-to-market frappe aussi',
      'Le troisième destructeur : la liquidité — rachats des porteurs, ventes mécaniques de fallen angels : être forcé de vendre dans la dislocation réalise la perte papier ; le P&L attendu n\'appartient qu\'à celui qui peut tenir',
    ],
    pointsAttendusEn: [
      'The immediate, clean decomposition: +350 bp of carry − 200 bp of EL = +150 bp per year of expected P&L over risk-free — stated in ten seconds',
      'Identifying what those 150 bp are: the risk and illiquidity premium — the book sells insurance against the bad state of the world and collects the rent',
      'The risk-neutral/historical consistency: PD implied by 350 bp ≈ 3.5/0.6 ≈ 5.8% against expected PD ≈ 2/0.6 ≈ 3.3% — the pricing gap confirms the premium',
      'The first destroyer in numbers: spread widening × spread duration — the mark-to-market can erase years of carry in a month, without a single realised default',
      'The second destroyer: EL is an expectation — defaults arrive in clusters in recessions, and the tail year realises several times the average, precisely when the mark-to-market hits too',
      'The third destroyer: liquidity — holder redemptions, mechanical fallen-angel selling: being forced to sell into the dislocation realises the paper loss; the expected P&L belongs only to whoever can hold',
    ],
    bonus: [
      'La synthèse en une phrase : ce book est un vendeur d\'options — 150 pb de loyer contre un risque de queue ; le métier n\'est pas d\'éviter ce profil, c\'est de le porter à une taille qui survit à l\'année de queue',
      'Le chiffrage de l\'avertissement : à spread duration 5, un écartement type crise de +300 pb coûte −15 %, soit dix ans de portage net — la survie d\'abord, la performance ensuite',
    ],
    bonusEn: [
      'The one-sentence synthesis: this book is an option seller — 150 bp of rent against tail risk; the trade is not to avoid this profile, it is to carry it at a size that survives the tail year',
      'The warning in numbers: at spread duration 5, a crisis-style +300 bp widening costs −15%, i.e. ten years of net carry — survival first, performance second',
    ],
    reponseModele: `La décomposition d'abord, en dix secondes : le book encaisse **+350 pb** de portage de spread et paie **−200 pb** de perte attendue — le P&L attendu est donc **+150 pb par an** au-dessus du sans-risque. Ces 150 pb ont un nom : la **prime de risque et d'illiquidité** — le book vend de l'assurance contre le mauvais état du monde et touche le loyer. La cohérence se vérifie par les PD : 350 pb pricent une PD risque-neutre de 3,5/0,6 ≈ 5,8 %, quand l'EL de 2 % suppose une PD « réelle » de ~3,3 % — l'écart est la prime.

Ce qui peut le détruire — trois choses, par ordre d'arrivée. **Le mark-to-market** : le portage est lent, le spread est rapide. À spread duration 5, un écartement de +100 pb coûte −5 % — plus de trois ans de portage net effacés en un mois, sans un seul défaut ; +300 pb type crise, c'est −15 %, dix ans de loyer. **Les grappes** : l'EL est une *moyenne* — l'année réelle ne donne jamais −2 % ; en récession, les défauts arrivent ensemble et l'année de queue réalise 6-8 %. **La liquidité** : si les porteurs rachètent ou si la falaise des fallen angels force la vente, la perte papier devient réalisée — au pire prix.

La synthèse : ce book est un **vendeur d'options** — 150 pb de loyer contre un risque de queue. Le métier n'est pas de refuser ce profil : c'est de le porter à une taille qui survit à l'année de queue. La survie d'abord, la performance ensuite.`,
    reponseModeleEn: `The decomposition first, in ten seconds: the book collects **+350 bp** of spread carry and pays **−200 bp** of expected loss — the expected P&L is therefore **+150 bp per year** over risk-free. Those 150 bp have a name: the **risk and illiquidity premium** — the book sells insurance against the bad state of the world and collects the rent. Consistency checks out through the PDs: 350 bp price a risk-neutral PD of 3.5/0.6 ≈ 5.8%, while the 2% EL assumes a "real" PD of ~3.3% — the gap is the premium, the account balances.

What can destroy it — three things, in order of arrival. **The mark-to-market**: carry is slow, spread is fast. At spread duration 5, a +100 bp widening costs −5% — more than three years of net carry erased in a month, without a single default; +300 bp crisis-style is −15%, ten years of rent. **The clusters**: EL is an *average* — the actual year never delivers −2%; in a recession defaults arrive together and the tail year realises 6-8%, precisely when the mark-to-market hits too. **Liquidity**: if holders redeem or the fallen-angel cliff forces selling, the paper loss becomes realised — at the worst price.

The synthesis: this book is an **option seller** — 150 bp of rent against tail risk. The trade is not to refuse this profile: it is to carry it at a size that survives the tail year. Survival first, performance second.`,
  },
];
