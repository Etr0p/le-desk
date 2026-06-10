import type { JuryQuestion } from '../../../engine/types';

const M4 = '04-taux-obligations';

export const jury: JuryQuestion[] = [
  {
    id: 'm4-jury-01',
    moduleId: M4,
    theme: 'pricing',
    themeEn: 'pricing',
    difficulte: 1,
    question: "Pourquoi le prix d'une obligation baisse-t-il quand les taux montent ?",
    questionEn: "Why does a bond's price fall when interest rates rise?",
    plan: [
      'Poser la nature du titre : des flux futurs contractuels, gravés dans le contrat',
      "La réponse mécanique : l'actualisation au dénominateur",
      'La réponse de marché : la concurrence des émissions neuves',
      "Conclure : le prix est la seule variable d'ajustement",
    ],
    planEn: [
      'State what a bond is: future cash flows fixed by contract',
      'The mechanical answer: discounting in the denominator',
      'The market answer: competition from newly issued bonds',
      'Conclude: the price is the only variable that can adjust',
    ],
    pointsAttendus: [
      "Les flux d'une obligation à taux fixe sont contractuels et immuables : coupons et nominal ne bougeront jamais",
      'Mécanique : chaque flux est divisé par (1+r)^t ; si r monte, chaque valeur actuelle rétrécit, donc la somme — le prix — baisse',
      "Marché : si les taux montent, les émissions neuves servent des coupons plus élevés ; l'ancien titre doit décoter pour rester compétitif",
      "La décote égalise les rendements : le prix baisse jusqu'à ce que coupon + gain au remboursement rejoignent le rendement du neuf",
      'Donner les deux formulations, mécanique et de marché : le jury attend les deux',
    ],
    pointsAttendusEn: [
      'The cash flows of a fixed-rate bond are contractual and immutable: coupons and principal will never change',
      'Mechanical: each flow is divided by (1+r)^t; if r rises, every present value shrinks, so the sum — the price — falls',
      'Market: when rates rise, new issues pay richer coupons; the old bond must trade at a discount to stay competitive',
      'The discount equalises yields: the price falls until coupon plus pull to par matches the yield on new paper',
      'Give both framings, mechanical and market-based: the examiner expects both',
    ],
    bonus: [
      "Chiffrer de tête : 1 000 €, coupon 5 %, 3 ans → 1 027,75 € à 4 % de taux de marché, et exactement 1 000 € à 5 %",
      "Glisser que la relation n'est pas une droite : la courbe prix-taux est convexe, une baisse de taux rapporte un peu plus que la hausse symétrique ne coûte",
    ],
    bonusEn: [
      'Quote numbers from memory: €1,000 face, 5% coupon, 3 years → €1,027.75 at a 4% market rate, and exactly €1,000 at 5%',
      'Mention that the relationship is not a straight line: the price-yield curve is convex, a fall in rates gains slightly more than the symmetric rise costs',
    ],
    reponseModele: `Une obligation à taux fixe, c'est une promesse de flux entièrement connue d'avance : les coupons et le remboursement du nominal sont gravés dans le contrat et ne bougeront jamais. Son prix, lui, est la somme de ces flux actualisés : $P = \\sum F_t/(1+r)^t$.

La première réponse est mécanique. Le taux exigé par le marché est au dénominateur : si $r$ monte, chaque facteur $(1+r)^t$ grossit, chaque valeur actuelle rétrécit, et la somme — le prix — baisse. Les flux étant fixes, le prix est la **seule variable d'ajustement**.

La seconde réponse est celle du marché. Si les taux montent, les émissions neuves de même signature offrent des coupons plus généreux. Personne ne paierait le pair pour un titre ancien au coupon devenu maigre : son prix doit baisser jusqu'au point exact où le coupon, complété par le gain entre prix d'achat et remboursement au pair, redonne le rendement du neuf. La décote n'est pas une punition : c'est le mécanisme qui égalise les rendements.

Un chiffre pour fixer les idées : une obligation de 1 000 €, coupon 5 %, 3 ans, vaut 1 027,75 € quand le marché exige 4 % — et exactement 1 000 € s'il exige 5 %. Dernier raffinement : la relation n'est pas une droite. Elle est convexe, si bien qu'une baisse de taux rapporte un peu plus que la hausse symétrique ne coûte.`,
    reponseModeleEn: `A fixed-rate bond is a promise whose cash flows are fully known in advance: the coupons and the principal repayment are written into the contract and will never change. The price is simply the sum of those flows discounted: $P = \\sum F_t/(1+r)^t$.

The first answer is mechanical. The rate the market requires sits in the denominator: when $r$ rises, every $(1+r)^t$ factor grows, every present value shrinks, and the sum — the price — falls. Since the flows are fixed, the price is the **only variable that can adjust**.

The second answer is the market one. When rates rise, newly issued bonds of the same quality pay richer coupons. Nobody would pay par for an old bond whose coupon now looks thin: its price has to drop to the exact point where the coupon, plus the pull to par between purchase price and redemption, matches the yield on new paper. The discount is not a punishment — it is the mechanism that equalises yields.

One number to anchor it: a €1,000 bond, 5% coupon, 3 years, is worth €1,027.75 when the market requires 4% — and exactly €1,000 at 5%. One final refinement: the relationship is not a straight line. It is convex, so a fall in rates gains slightly more than the symmetric rise costs.`,
  },
  {
    id: 'm4-jury-02',
    moduleId: M4,
    theme: 'duration',
    themeEn: 'duration',
    difficulte: 2,
    question: "Expliquez la duration à quelqu'un qui n'a jamais fait de finance.",
    questionEn: 'Explain duration to someone who has never studied finance.',
    plan: [
      "Partir d'une image : le centre de gravité des flux dans le temps",
      'Traduire : combien de temps, en moyenne, pour récupérer son argent',
      "Relier à l'utilité : la sensibilité du prix aux taux",
      'Donner les repères qui parlent : zéro-coupon, effet du coupon',
    ],
    planEn: [
      'Start from a picture: the centre of gravity of the cash flows over time',
      'Translate: how long, on average, before you get your money back',
      'Connect to its use: the sensitivity of price to rates',
      'Give the reference points that stick: zero-coupon, coupon effect',
    ],
    pointsAttendus: [
      "L'image du barycentre : posez les flux actualisés sur une planche graduée en années, la duration est le point d'équilibre",
      "Elle s'exprime en années : la durée moyenne de récupération des flux, chaque flux pondéré par sa valeur actualisée",
      "L'utilité : plus la duration est longue, plus le prix bouge quand les taux bougent — environ D % de prix par point de taux",
      'Zéro-coupon : un seul flux, duration = maturité, exactement',
      'Coupon plus élevé ⇒ duration plus courte : les gros coupons rapatrient la valeur plus tôt',
    ],
    pointsAttendusEn: [
      'The balance-point image: lay the discounted cash flows on a plank graduated in years, duration is where it balances',
      'It is measured in years: the average time to recover your money, each flow weighted by its present value',
      'Why it matters: the longer the duration, the more the price moves when rates move — roughly D% of price per point of yield',
      'Zero-coupon: a single flow, so duration equals maturity, exactly',
      'Higher coupon ⇒ shorter duration: large coupons bring value back earlier',
    ],
    bonus: [
      "L'exemple chiffré de tête : 1 000 €, coupon 5 %, 3 ans, marché à 4 % → duration 2,86 ans",
      'La perpétuité : maturité infinie mais duration finie, (1+y)/y, soit 26 ans à 4 %',
    ],
    bonusEn: [
      'The worked number from memory: €1,000 face, 5% coupon, 3 years, 4% market → duration 2.86 years',
      'The perpetuity: infinite maturity yet finite duration, (1+y)/y, i.e. 26 years at 4%',
    ],
    reponseModele: `J'éviterais toute formule et je partirais d'une image. Une obligation, c'est une série de versements : des petits chaque année — les coupons — et un gros à la fin — le remboursement. Imaginez ces versements posés sur une planche graduée en années, chacun pesant ce qu'il vaut aujourd'hui. La duration, c'est le point où la planche tient en équilibre : le **centre de gravité de l'argent dans le temps**. Elle se mesure donc en années : c'est la durée moyenne au bout de laquelle vous récupérez votre mise, en pondérant chaque versement par son poids réel.

À quoi ça sert ? C'est le meilleur résumé du risque de taux. Plus ce centre de gravité est loin, plus la valeur du titre est sensible aux mouvements de taux : en pratique, une duration de 5 signifie qu'une hausse de 1 point des taux fait perdre environ 5 % du prix.

Deux repères rendent l'idée concrète. Un titre qui ne verse rien avant l'échéance — un zéro-coupon — a toute sa masse sur la dernière année : sa duration égale exactement sa maturité. Et plus les coupons sont gros, plus une partie de l'argent revient tôt : le centre de gravité se rapproche, la duration raccourcit. Notre exemple de cours : une obligation 3 ans, coupon 5 %, dans un marché à 4 %, a une duration de 2,86 ans — presque 3, parce que l'essentiel de la valeur est dans le remboursement final.`,
    reponseModeleEn: `I would avoid formulas and start with a picture. A bond is a series of payments: small ones every year — the coupons — and one large one at the end — the repayment. Imagine laying those payments on a plank graduated in years, each weighing what it is worth today. Duration is the point where the plank balances: the **centre of gravity of your money over time**. So it is measured in years — the average time it takes to get your money back, with each payment weighted by its present value.

Why is it useful? Because it is the best single summary of interest-rate risk. The further out that centre of gravity sits, the more the bond's value moves when rates move: in practice, a duration of 5 means a one-point rise in rates costs roughly 5% of the price.

Two reference points make the idea concrete. A security that pays nothing before maturity — a zero-coupon — has all its weight on the final year: its duration equals its maturity exactly. And the larger the coupons, the more money comes back early: the centre of gravity moves closer and duration shortens. Our course example: a 3-year bond with a 5% coupon, in a 4% market, has a duration of 2.86 years — almost 3, because most of the value sits in the final repayment.`,
  },
  {
    id: 'm4-jury-03',
    moduleId: M4,
    theme: 'duration',
    themeEn: 'duration',
    difficulte: 2,
    question: 'Différence entre duration de Macaulay, duration modifiée et DV01 ?',
    questionEn: 'What is the difference between Macaulay duration, modified duration and DV01?',
    plan: [
      'Macaulay : une durée, en années',
      'Modifiée : une sensibilité, sans unité',
      'DV01 : un montant, en euros par point de base',
      'Le fil qui les relie, et le piège des unités',
    ],
    planEn: [
      'Macaulay: a length of time, in years',
      'Modified: a sensitivity, unitless',
      'DV01: an amount, in euros per basis point',
      'The thread connecting them, and the units trap',
    ],
    pointsAttendus: [
      'Macaulay : barycentre temporel des flux actualisés, D = Σ t × VA(Ft) / P, en années',
      'Modifiée : D_mod = D_Mac/(1+y), facteur de sensibilité sans unité — % de prix perdu par point de taux',
      'La formule du desk : ΔP ≈ −D_mod × Δy × P',
      'DV01 = D_mod × valeur de marché × 0,0001 : la perte en euros pour 1 pb — la mesure que les desks s\'échangent',
      'Toujours nommer l\'unité : années, sans unité, euros par pb — la confusion est le lapsus d\'entretien classique',
    ],
    pointsAttendusEn: [
      'Macaulay: time barycentre of the discounted flows, D = Σ t × PV(Ft) / P, in years',
      'Modified: D_mod = D_Mac/(1+y), a unitless sensitivity factor — % of price lost per point of yield',
      'The desk formula: ΔP ≈ −D_mod × Δy × P',
      'DV01 = D_mod × market value × 0.0001: the loss in euros for 1bp — the measure desks quote to each other',
      'Always name the unit: years, unitless, euros per bp — mixing them up is the classic interview slip',
    ],
    bonus: [
      'Dérouler le fil rouge de tête : D_Mac 2,86 ans → D_mod 2,75 → DV01 0,28 € par pb sur un prix de 1 027,75 €',
      'La modifiée est la dérivée du prix : D_mod = −(1/P)(dP/dy) — le facteur 1/(1+y) tombe de la dérivation, ce n\'est pas une convention',
    ],
    bonusEn: [
      'Run the course example from memory: Macaulay 2.86 years → modified 2.75 → DV01 €0.28 per bp on a €1,027.75 price',
      'Modified duration is the price derivative: D_mod = −(1/P)(dP/dy) — the 1/(1+y) factor falls out of the calculus, it is not a convention',
    ],
    reponseModele: `Ce sont trois étages du même calcul, avec trois unités différentes — et l'unité dit tout.

La **duration de Macaulay** est une durée : le barycentre temporel des flux actualisés, $D_{Mac} = \\sum t \\cdot VA(F_t)/P$, en années. Sur l'obligation de référence du cours — 1 000 €, coupon 5 %, 3 ans, marché à 4 % — elle vaut 2,86 ans.

La **duration modifiée** la transforme en instrument de mesure : $D_{mod} = D_{Mac}/(1+y)$, soit 2,75 ici. Sans unité, c'est la sensibilité relative du prix au taux — mathématiquement, la dérivée du prix rapportée au prix. Elle alimente la formule que tout desk applique de tête : $\\Delta P \\approx -D_{mod} \\times \\Delta y \\times P$. Une hausse de 50 pb sur notre titre : −2,75 × 0,005 × 1 027,75 ≈ −14 €.

Le **DV01** traduit enfin tout cela en argent : duration modifiée × valeur de marché × 0,0001, soit la perte en euros pour un point de base. Ici 0,28 € par pb — et pour une position de 10 000 titres, environ 2 828 € par pb : c'est le chiffre que le trader surveille en continu.

Le piège d'entretien est précisément là : annoncer « une duration de 7 » sans dire 7 quoi. Macaulay en années, modifiée sans unité, DV01 en euros par point de base — nommer l'unité, c'est prouver qu'on a compris au lieu de réciter.`,
    reponseModeleEn: `They are three floors of the same calculation, with three different units — and the unit tells the whole story.

**Macaulay duration** is a length of time: the time barycentre of the discounted cash flows, $D_{Mac} = \\sum t \\cdot PV(F_t)/P$, in years. On the course's reference bond — €1,000 face, 5% coupon, 3 years, 4% market — it is 2.86 years.

**Modified duration** turns that into a measuring instrument: $D_{mod} = D_{Mac}/(1+y)$, 2.75 here. It is unitless: the relative sensitivity of price to yield — mathematically, the price derivative scaled by the price. It feeds the formula every desk applies in its head: $\\Delta P \\approx -D_{mod} \\times \\Delta y \\times P$. A 50bp rise on our bond: −2.75 × 0.005 × 1,027.75 ≈ −€14.

**DV01** finally converts all of that into money: modified duration × market value × 0.0001, the euro loss per basis point. Here €0.28 per bp — and on a 10,000-bond position, about €2,828 per bp: the number the trader watches all day.

The interview trap sits exactly there: announcing 'a duration of 7' without saying 7 what. Macaulay in years, modified unitless, DV01 in euros per basis point — naming the unit proves you understand rather than recite.`,
  },
  {
    id: 'm4-jury-04',
    moduleId: M4,
    theme: 'courbe des taux',
    themeEn: 'yield curve',
    difficulte: 2,
    question: 'Que nous dit une courbe des taux inversée ? Est-ce un signal fiable ?',
    questionEn: 'What does an inverted yield curve tell us? Is it a reliable signal?',
    plan: [
      "Définir l'inversion : taux courts au-dessus des taux longs, 2s10s négatif",
      'Ce qu\'elle traduit : des baisses de taux directeurs anticipées',
      'Le palmarès historique américain',
      'Les limites : un signal sérieux, pas un oracle',
    ],
    planEn: [
      'Define inversion: short rates above long rates, negative 2s10s',
      'What it expresses: anticipated policy-rate cuts',
      'The US historical track record',
      'The limits: a serious signal, not an oracle',
    ],
    pointsAttendus: [
      "Inversion = taux courts supérieurs aux taux longs ; se mesure couramment par un 2s10s négatif",
      'Lecture : le marché anticipe que la banque centrale, après avoir monté ses taux, devra les baisser — typiquement parce que l\'économie ralentit',
      'Palmarès américain : les inversions du 2s10s ont précédé les récessions de 1980, 1990, 2001, 2008 et 2020',
      'Nuance 1 : le délai entre inversion et récession varie de quelques mois à deux ans — le signal ne date rien',
      'Nuance 2 : 2022-2024, environ deux ans d\'inversion sans récession immédiate ; et 2020 doit beaucoup au hasard (choc COVID exogène)',
      'Le signal peut être brouillé quand les achats des banques centrales compriment artificiellement les taux longs',
    ],
    pointsAttendusEn: [
      'Inversion = short rates above long rates; commonly measured by a negative 2s10s',
      'Reading: the market expects the central bank, having hiked, to be forced to cut — typically because the economy is slowing',
      'US track record: 2s10s inversions preceded the recessions of 1980, 1990, 2001, 2008 and 2020',
      'Caveat 1: the lag between inversion and recession ranges from a few months to two years — the signal dates nothing',
      'Caveat 2: 2022-2024, roughly two years of inversion with no immediate recession; and 2020 owes much to luck (the exogenous COVID shock)',
      'The signal can be distorted when central-bank asset purchases artificially compress long yields',
    ],
    bonus: [
      'Expliquer le mécanisme par l\'épisode 2022-2023 : la Fed passe de près de 0 à plus de 5 %, le 2 ans suit, le 10 ans monte moins — bear flattening poussé jusqu\'à l\'inversion',
      "La sortie d'inversion de 2024 s'est faite « par l'avant » : le 2 ans a reflué sur les anticipations de baisses de taux",
    ],
    bonusEn: [
      'Explain the mechanism through 2022-2023: the Fed goes from near 0 to above 5%, the 2-year follows, the 10-year rises less — bear flattening pushed all the way to inversion',
      'The 2024 dis-inversion came from the front end: the 2-year fell back on rate-cut expectations',
    ],
    reponseModele: `Une courbe inversée, c'est une courbe où les taux courts dépassent les taux longs — on le mesure couramment par le spread 2s10s, taux 10 ans moins taux 2 ans, devenu négatif. Ce n'est pas la configuration naturelle : en temps normal, prêter plus longtemps se paie plus cher.

Ce que dit l'inversion : le marché anticipe que la banque centrale, après avoir monté ses taux, devra les **baisser** — et le scénario type qui force des baisses, c'est le ralentissement, voire la récession. L'épisode 2022-2023 américain illustre la mécanique : la Fed passe de près de zéro à plus de 5 %, le 2 ans suit presque mécaniquement, le 10 ans monte beaucoup moins — un bear flattening poussé jusqu'à l'inversion.

Est-ce fiable ? Le palmarès impressionne : aux États-Unis, les inversions du 2s10s ont précédé les récessions de 1980, 1990, 2001, 2008 et 2020. Mais deux nuances s'imposent. D'abord le délai : de quelques mois à deux ans — le signal ne date rien. Ensuite les contre-exemples récents : 2020 doit beaucoup au hasard, la récession étant venue d'un choc exogène, la pandémie ; et le 2s10s est resté inversé environ deux ans en 2022-2024 sans récession immédiate. Ajoutez que le QE peut comprimer artificiellement les taux longs et brouiller la lecture.

Ma conclusion : un signal **sérieux**, à intégrer dans le diagnostic — mais pas un oracle.`,
    reponseModeleEn: `An inverted curve is one where short rates sit above long rates — commonly measured by the 2s10s spread, the 10-year yield minus the 2-year, turning negative. It is not the natural shape: in normal times, lending longer pays more.

What inversion says: the market expects the central bank, having hiked, to be forced to **cut** — and the typical scenario that forces cuts is a slowdown, or an outright recession. The US 2022-2023 episode shows the mechanics: the Fed goes from near zero to above 5%, the 2-year follows almost mechanically, the 10-year rises far less — a bear flattening pushed all the way into inversion.

Is it reliable? The track record is striking: in the US, 2s10s inversions preceded the recessions of 1980, 1990, 2001, 2008 and 2020. But two caveats are essential. First, the lag: anywhere from a few months to two years — the signal dates nothing. Second, the recent counter-examples: 2020 owes a lot to luck, since that recession came from an exogenous shock, the pandemic; and the 2s10s stayed inverted for roughly two years in 2022-2024 with no immediate recession. Add that QE can artificially compress long yields and blur the reading.

My conclusion: a **serious** signal, worth integrating into the diagnosis — but not an oracle.`,
  },
  {
    id: 'm4-jury-05',
    moduleId: M4,
    theme: 'duration',
    themeEn: 'duration',
    difficulte: 2,
    question: 'Pourquoi une obligation à faible coupon est-elle plus sensible aux taux ?',
    questionEn: 'Why is a low-coupon bond more sensitive to interest rates?',
    plan: [
      "Rappeler d'où vient la sensibilité : l'actualisation frappe surtout les flux lointains",
      'Faible coupon = valeur concentrée sur le remboursement final',
      'Traduire en duration : le barycentre recule',
      'Le cas extrême du zéro-coupon, et un exemple chiffré',
    ],
    planEn: [
      'Recall where sensitivity comes from: discounting hits distant flows hardest',
      'Low coupon = value concentrated in the final repayment',
      'Translate into duration: the barycentre moves out',
      'The extreme case of the zero-coupon, and a worked number',
    ],
    pointsAttendus: [
      "Les flux lointains sont divisés par (1+r)^t à exposant élevé : ce sont eux qui encaissent le choc d'actualisation",
      "Un faible coupon rapatrie peu de valeur sur les premières années : l'essentiel du prix est dans le flux final, le plus exposé",
      'En termes de duration : coupon faible ⇒ barycentre temporel reculé ⇒ duration longue ⇒ sensibilité forte',
      'Cas extrême : le zéro-coupon, duration = maturité, le plus sensible à maturité égale',
      'Un chiffre : à 10 ans, pour +1 point de taux, un zéro-coupon perd 9,13 % quand une obligation à coupon 8 % perd 7,01 %',
    ],
    pointsAttendusEn: [
      'Distant flows are divided by (1+r)^t with high exponents: they absorb the brunt of the discounting shock',
      'A low coupon brings little value back in the early years: most of the price sits in the final flow, the most exposed one',
      'In duration terms: low coupon ⇒ barycentre further out ⇒ longer duration ⇒ higher sensitivity',
      'Extreme case: the zero-coupon, duration = maturity, the most sensitive for a given maturity',
      'A number: at 10 years, for a 1-point rise, a zero-coupon loses 9.13% while an 8%-coupon bond loses 7.01%',
    ],
    bonus: [
      'La gradation de tête, sur 3 ans à 4 % : duration 3,00 ans à coupon nul, 2,86 ans à coupon 5 %, 2,79 ans à coupon 8 %',
      "Le lien d'actualité : les titres longs à coupon minuscule émis en 2020-2021 ont subi les pires pertes de la débâcle de 2022",
    ],
    bonusEn: [
      'The gradient from memory, 3 years at 4%: duration 3.00 years at zero coupon, 2.86 at a 5% coupon, 2.79 at 8%',
      'The topical link: long bonds with tiny coupons issued in 2020-2021 took the worst losses of the 2022 rout',
    ],
    reponseModele: `Tout part de la formule de prix : chaque flux est divisé par $(1+r)^t$. Plus le flux est lointain, plus l'exposant est élevé, plus sa valeur actuelle réagit violemment à un mouvement de taux. La sensibilité d'une obligation dépend donc du **calendrier** de ses flux : où, dans le temps, la valeur est-elle posée ?

Une obligation à gros coupon rapatrie une part importante de sa valeur sur les premières années — des flux presque insensibles à l'actualisation. Une obligation à faible coupon, elle, ne distribue presque rien en route : l'essentiel de son prix repose sur le remboursement final, le flux le plus lointain, donc le plus exposé. À maturité égale, sa valeur est concentrée là où le choc frappe le plus fort.

En langage de duration : le coupon faible recule le barycentre temporel des flux. Sur 3 ans dans un marché à 4 % : duration de 3,00 ans à coupon nul, 2,86 ans à coupon 5 %, 2,79 ans à coupon 8 %. Le cas extrême est le zéro-coupon : un seul flux, à l'échéance, duration exactement égale à la maturité — le titre le plus sensible de sa catégorie.

Le chiffre qui résume tout, à 10 ans pour une hausse de 1 point : le zéro-coupon perd 9,13 %, l'obligation à coupon 8 % perd 7,01 %. Même maturité, même choc — c'est bien le coupon qui fait la différence.`,
    reponseModeleEn: `Everything starts from the pricing formula: each cash flow is divided by $(1+r)^t$. The further out the flow, the higher the exponent, and the more violently its present value reacts to a move in rates. A bond's sensitivity therefore depends on the **timing** of its flows: where, along the timeline, is the value parked?

A high-coupon bond brings a sizeable share of its value back in the early years — flows that are nearly immune to discounting. A low-coupon bond hands out almost nothing along the way: most of its price rests on the final repayment, the most distant flow, hence the most exposed. For the same maturity, its value is concentrated exactly where the shock hits hardest.

In duration language: a low coupon pushes the time barycentre outward. Over 3 years in a 4% market: duration of 3.00 years with no coupon, 2.86 with a 5% coupon, 2.79 at 8%. The extreme case is the zero-coupon: a single flow at maturity, duration exactly equal to maturity — the most rate-sensitive bond in its class.

The number that sums it all up, at 10 years for a 1-point rise: the zero-coupon loses 9.13%, the 8%-coupon bond loses 7.01%. Same maturity, same shock — the coupon makes the difference.`,
  },
  {
    id: 'm4-jury-06',
    moduleId: M4,
    theme: 'repo',
    themeEn: 'repo',
    difficulte: 2,
    question: "Qu'est-ce que le repo et pourquoi est-il vital pour les marchés ?",
    questionEn: 'What is a repo, and why is it vital to markets?',
    plan: [
      'La mécanique : une vente avec engagement de rachat = un prêt de cash garanti',
      'Les paramètres : haircut, taux repo, GC contre spécial',
      'Les trois fonctions vitales',
      'Ce qui se passe quand le repo se grippe',
    ],
    planEn: [
      'The mechanics: a sale with a buy-back commitment = a secured cash loan',
      'The parameters: haircut, repo rate, GC versus special',
      'The three vital functions',
      'What happens when the repo market seizes up',
    ],
    pointsAttendus: [
      "Pension livrée : vendre des titres au comptant en s'engageant à les racheter à date et prix convenus — économiquement, un prêt de cash garanti par des titres",
      "Le haircut : le prêteur ne finance qu'une fraction de la valeur du collatéral (par exemple 98 %), pour se protéger d'une baisse des titres",
      'Fonction 1 — financement : les desks financent leurs positions au jour le jour en mettant leurs titres en pension',
      "Fonction 2 — vente à découvert : le repo inversé procure les titres qu'on ne détient pas, contre du cash",
      'Fonction 3 — transmission monétaire : les taux courts de marché se forment sur le repo, canal des taux directeurs vers tous les actifs',
      'GC : n\'importe quel titre du panier, le taux colle aux taux directeurs ; spécial : un titre précis recherché se finance sous le GC',
    ],
    pointsAttendusEn: [
      'Repurchase agreement: selling securities spot while committing to buy them back at an agreed date and price — economically, a cash loan collateralised by securities',
      'The haircut: the lender only funds a fraction of the collateral value (98%, say), as protection against the securities falling',
      'Function 1 — funding: desks finance their positions day to day by repoing out their bonds',
      'Function 2 — short selling: the reverse repo sources the securities you do not own, against cash',
      'Function 3 — monetary transmission: short market rates form in the repo market, the channel from policy rates to all asset prices',
      'GC: any security in a quality basket, the rate tracks policy rates; special: one sought-after security funds below GC',
    ],
    bonus: [
      "L'exemple chiffré de tête : 10 M€ d'OAT, haircut 2 % → 9,8 M€ levés ; à 2,8 % sur 7 jours en Exact/360, 5 335,56 € d'intérêts",
      'Septembre 2019 aux États-Unis : le taux repo au jour le jour touche 10 % en séance, la Fed réinjecte des liquidités pour la première fois depuis 2008',
      'LTCM : le repo comme machine à levier — environ 125 Md$ de positions pour moins de 5 Md$ de capital',
    ],
    bonusEn: [
      'The worked number from memory: €10m of OATs, 2% haircut → €9.8m raised; at 2.8% over 7 days Actual/360, €5,335.56 of interest',
      'September 2019 in the US: the overnight repo rate touched 10% intraday and the Fed injected liquidity for the first time since 2008',
      'LTCM: repo as a leverage machine — about $125bn of positions on less than $5bn of capital',
    ],
    reponseModele: `Le repo — la pension livrée — est l'opération la plus banale et la moins connue de la finance : je vous vends des titres au comptant et je m'engage, dans le même contrat, à les racheter à une date et à un prix convenus. Habillage juridique mis à part, c'est un **prêt de cash garanti par des titres**. Le prêteur applique un haircut — il ne finance qu'une fraction de la valeur du collatéral : sur 10 M€ d'OAT avec 2 % de haircut, je lève 9,8 M€ ; à 2,8 % sur 7 jours en Exact/360, je paierai 5 335,56 € d'intérêts.

Pourquoi est-il vital ? Trois fonctions. **Le financement** : un desk ne paie pas ses positions sur ses fonds propres — il achète le titre, le met en pension, et finance l'essentiel de la position au jour le jour. **La vente à découvert** : pour vendre un titre qu'on ne détient pas, il faut se le procurer — c'est le repo inversé qui le fournit, contre du cash. **La transmission monétaire** : les taux courts de marché se forment sur le repo ; quand la banque centrale bouge ses taux directeurs, c'est par ce canal que l'impulsion irrigue les prix de tous les actifs.

Un raffinement de vocabulaire : quand n'importe quel titre de qualité fait l'affaire, on parle de GC, et le taux colle aux taux directeurs ; quand un titre précis est très recherché — typiquement par des vendeurs à découvert —, il traite « spécial », sous le GC. Et quand le repo se grippe, tout casse : en septembre 2019, le taux au jour le jour américain a touché 10 % en séance, forçant la Fed à réinjecter des liquidités — une première depuis 2008.`,
    reponseModeleEn: `The repo — repurchase agreement — is the most mundane and least known operation in finance: I sell you securities for cash and commit, in the same contract, to buying them back at an agreed date and price. Legal packaging aside, it is a **cash loan secured by securities**. The lender applies a haircut — it only funds a fraction of the collateral value: on €10m of OATs with a 2% haircut, I raise €9.8m; at 2.8% over 7 days Actual/360, I will pay €5,335.56 of interest.

Why is it vital? Three functions. **Funding**: a desk does not pay for its positions out of its own capital — it buys the bond, repos it out, and finances most of the position day to day. **Short selling**: to sell a security you do not own, you must source it — the reverse repo provides it, against cash. **Monetary transmission**: short-term market rates form in the repo market; when the central bank moves its policy rates, this is the channel through which the impulse reaches the prices of all assets.

One vocabulary refinement: when any quality security will do as collateral, the trade is GC and the rate tracks policy rates; when one specific security is in hot demand — typically from short sellers — it trades 'special', below GC. And when repo seizes up, everything breaks: in September 2019 the US overnight rate touched 10% intraday, forcing the Fed to inject liquidity — a first since 2008.`,
  },
  {
    id: 'm4-jury-07',
    moduleId: M4,
    theme: 'couverture',
    themeEn: 'hedging',
    difficulte: 3,
    question: 'Comment couvririez-vous un portefeuille obligataire contre une hausse des taux ?',
    questionEn: 'How would you hedge a bond portfolio against rising rates?',
    plan: [
      "Mesurer d'abord : le DV01 du portefeuille",
      "Choisir l'instrument : vendre des contrats à terme",
      'Dimensionner : égaliser les DV01',
      'Nommer les limites : le niveau est couvert, pas la pente',
    ],
    planEn: [
      'Measure first: the portfolio DV01',
      'Choose the instrument: sell futures contracts',
      'Size the hedge: equalise the DV01s',
      'Name the limits: the level is hedged, not the slope',
    ],
    pointsAttendus: [
      'Étape 1 — chiffrer le risque : DV01 du portefeuille = duration modifiée × valeur de marché × 0,0001',
      'Étape 2 — vendre des futures obligataires : la position vendeuse gagne quand les taux montent et compense la perte des titres',
      'Étape 3 — dimensionner : nombre de contrats = DV01 du portefeuille / DV01 du contrat',
      'Exemple : DV01 de 4 000 € par pb, contrat à 80 € par pb → vendre 50 contrats',
      'Après couverture, le portefeuille est insensible au premier ordre à un choc parallèle',
      'Limite : la duration couvre le niveau, pas la pente — un steepening ou un flattening déforme la courbe et laisse un risque résiduel',
    ],
    pointsAttendusEn: [
      'Step 1 — quantify the risk: portfolio DV01 = modified duration × market value × 0.0001',
      'Step 2 — sell bond futures: the short position gains when rates rise, offsetting the loss on the bonds',
      'Step 3 — size it: number of contracts = portfolio DV01 / contract DV01',
      'Example: a DV01 of €4,000 per bp, a contract at €80 per bp → sell 50 contracts',
      'Once hedged, the portfolio is insensitive, to first order, to a parallel shock',
      'Limit: duration hedges the level, not the slope — a steepening or flattening reshapes the curve and leaves residual risk',
    ],
    bonus: [
      "L'alternative bilancielle : raccourcir la duration en vendant le long pour acheter du court — mais coûts de transaction et impact marché",
      'Le coût implicite : couvrir, c\'est renoncer au portage — un portefeuille parfaitement couvert rapporte peu ou prou le taux monétaire',
      'Pour les chocs non parallèles : durations partielles et couverture par points de courbe',
    ],
    bonusEn: [
      'The balance-sheet alternative: shorten duration by selling the long end to buy the short end — but transaction costs and market impact',
      'The implicit cost: hedging means giving up carry — a fully hedged portfolio earns more or less the money-market rate',
      'For non-parallel shocks: partial durations and hedging by curve points',
    ],
    reponseModele: `Je procéderais en trois temps : mesurer, choisir l'instrument, dimensionner.

**Mesurer.** La question d'un desk n'est pas « suis-je exposé ? » mais « combien je perds par point de base ? ». Je calcule donc le DV01 du portefeuille : duration modifiée × valeur de marché × 0,0001. Disons un portefeuille de 50 M€ de duration modifiée 8 : DV01 de 40 000 € — chaque pb de hausse coûte 40 000 €.

**Choisir.** L'outil standard est le contrat à terme obligataire : liquide, sans mobiliser de cash, réversible en un ordre. Je **vends** des futures : la position vendeuse gagne quand les taux montent, exactement quand mes titres perdent.

**Dimensionner.** Nombre de contrats = DV01 du portefeuille / DV01 du contrat. Avec l'exemple du cours : 4 000 € de DV01 contre 80 € par contrat, je vends 50 contrats. Après l'opération, 1 pb de hausse coûte 4 000 € sur les titres et en rapporte 4 000 sur les contrats : insensible au premier ordre.

**Les limites, à nommer spontanément.** D'abord, cette couverture neutralise un choc parallèle : si la courbe se pentifie ou s'aplatit, le contrat — assis sur un point de courbe — ne réplique plus mes titres, il reste un risque de déformation ; pour le traiter, il faut des durations partielles et une couverture par points de courbe. Ensuite, le coût : couvrir, c'est renoncer au portage — un portefeuille parfaitement couvert rapporte peu ou prou le taux monétaire. La couverture est un choix tactique, pas un état permanent.`,
    reponseModeleEn: `I would proceed in three steps: measure, choose the instrument, size the trade.

**Measure.** A desk's question is not 'am I exposed?' but 'how much do I lose per basis point?'. So I compute the portfolio's DV01: modified duration × market value × 0.0001. Say a €50m portfolio with modified duration 8: a DV01 of €40,000 — every basis point of rise costs €40,000.

**Choose.** The standard tool is the bond future: liquid, no cash tied up, reversible in one order. I **sell** futures: the short position gains when rates rise, exactly when my bonds lose.

**Size.** Number of contracts = portfolio DV01 / contract DV01. With the course example: €4,000 of DV01 against €80 per contract, I sell 50 contracts. After the trade, 1bp of rise costs €4,000 on the bonds and earns €4,000 on the contracts: insensitive to first order.

**The limits, to volunteer unprompted.** First, this hedge neutralises a parallel shock: if the curve steepens or flattens, the contract — anchored to one curve point — no longer mirrors my holdings, and a reshaping risk remains; treating it requires partial durations and hedging point by point. Second, the cost: hedging means giving up carry — a fully hedged portfolio earns roughly the money-market rate. A hedge is a tactical choice, not a permanent state.`,
  },
  {
    id: 'm4-jury-08',
    moduleId: M4,
    theme: 'courbe des taux',
    themeEn: 'yield curve',
    difficulte: 3,
    question: "Qu'est-ce que le bootstrapping et pourquoi en a-t-on besoin ?",
    questionEn: 'What is bootstrapping and why do we need it?',
    plan: [
      'Le problème : les YTM observés ne sont pas les « vrais » taux par maturité',
      "La cause : l'effet coupon",
      'La méthode : extraire les taux zéro-coupon de proche en proche',
      "L'usage : la courbe zéro-coupon est celle des pricers",
    ],
    planEn: [
      "The problem: observed YTMs are not the 'true' rates per maturity",
      'The cause: the coupon effect',
      'The method: extracting zero-coupon rates step by step',
      'The use: the zero-coupon curve is what pricers run on',
    ],
    pointsAttendus: [
      'En toute rigueur, chaque flux doit s\'actualiser au taux zéro-coupon de sa propre date — pas à un taux unique',
      "Le YTM d'une obligation couponnée est une moyenne pondérée par ses flux : sur une courbe pentue, deux titres de même maturité et de coupons différents ont des YTM différents — l'effet coupon",
      "La méthode : z1 extrait d'un titre 1 an ; puis sur une obligation 2 ans, on retranche le coupon de l'an 1 actualisé à z1, le flux final donne z2 ; et de proche en proche",
      "L'exemple du cours : obligation 2 ans, coupon 3 %, au pair → YTM 3,00 % mais z2 = 3,01 %",
      "C'est la courbe zéro-coupon, pas la courbe des YTM, qu'utilisent les pricers — et c'est d'elle que sortent les taux forward",
    ],
    pointsAttendusEn: [
      'Strictly, each cash flow should be discounted at the zero-coupon rate of its own date — not at one single rate',
      'The YTM of a coupon bond is an average weighted by its flows: on a steep curve, two bonds of the same maturity but different coupons have different YTMs — the coupon effect',
      'The method: z1 extracted from a 1-year instrument; then on a 2-year bond, subtract the year-1 coupon discounted at z1, the final flow yields z2; and so on step by step',
      'The course example: a 2-year bond, 3% coupon, at par → YTM 3.00% yet z2 = 3.01%',
      'It is the zero-coupon curve, not the YTM curve, that pricers run on — and forwards are derived from it',
    ],
    bonus: [
      'La formule de tête sur l\'exemple : (1+z2)² = 103 / (100 − 3/(1+z1))',
      "L'écart YTM/zéro-coupon est minime à 2 ans mais enfle avec la maturité et la pente de la courbe",
    ],
    bonusEn: [
      'The formula from memory on the example: (1+z2)² = 103 / (100 − 3/(1+z1))',
      'The YTM/zero-coupon gap is tiny at 2 years but swells with maturity and curve steepness',
    ],
    reponseModele: `Le point de départ est une exigence de rigueur : chaque flux devrait s'actualiser au taux de sa propre date — le taux zéro-coupon, celui d'un placement unique finissant à cette échéance. Or ce que le marché affiche, ce sont des YTM d'obligations couponnées : des taux uniques, qui sont en réalité des **moyennes** pondérées par les flux de chaque titre. Sur une courbe pentue, deux obligations de même maturité mais de coupons différents n'ont pas le même YTM — c'est l'effet coupon. Les YTM ne sont donc pas les « vrais » taux par maturité.

Le bootstrapping reconstruit ces vrais taux de proche en proche. Premier maillon : un titre 1 an sans coupon — un zéro-coupon à 97,56 € pour 100 € donne directement $z_1 = 2{,}50\\,\\%$. Deuxième maillon : je prends une obligation 2 ans, coupon 3 %, cotée au pair ; je retranche du prix le coupon de l'an 1 actualisé à $z_1$, et le flux final me livre $z_2$ : ici 3,01 %. Et ainsi de suite — le titre 3 ans donne $z_3$ à partir de $z_1$ et $z_2$, jusqu'à reconstruire la courbe entière.

La lecture vaut le calcul : cette obligation au pair affiche un YTM de 3,00 % exactement, et pourtant le vrai taux 2 ans est 3,01 %. Minime ici, l'écart enfle avec la maturité et la pente. C'est pourquoi les pricers, les desks de dérivés et le contrôle des risques travaillent sur la courbe zéro-coupon — et c'est d'elle que sortent les taux forward.`,
    reponseModeleEn: `The starting point is a demand for rigour: each cash flow should be discounted at the rate of its own date — the zero-coupon rate, that of a single investment ending at that horizon. But what the market displays are YTMs of coupon bonds: single rates that are really **averages**, weighted by each bond's flows. On a steep curve, two bonds with the same maturity but different coupons do not share the same YTM — the coupon effect. So YTMs are not the 'true' rates per maturity.

Bootstrapping rebuilds those true rates step by step. First link: a 1-year instrument with no coupon — a zero at €97.56 per €100 gives directly $z_1 = 2.50\\,\\%$. Second link: I take a 2-year bond, 3% coupon, quoted at par; I strip out of the price the year-1 coupon discounted at $z_1$, and the final flow hands me $z_2$: 3.01% here. And so on — the 3-year bond yields $z_3$ from $z_1$ and $z_2$, until the whole curve is rebuilt.

The reading matters as much as the maths: that par bond shows a YTM of exactly 3.00%, and yet the true 2-year rate is 3.01%. Tiny here, the gap swells with maturity and steepness. That is why pricers, derivatives desks and risk control all run on the zero-coupon curve — and why forwards are derived from it.`,
  },
  {
    id: 'm4-jury-09',
    moduleId: M4,
    theme: 'spreads',
    themeEn: 'spreads',
    difficulte: 2,
    question: 'Parlez-moi du spread OAT-Bund. Que reflète-t-il ?',
    questionEn: 'Tell me about the OAT-Bund spread. What does it reflect?',
    plan: [
      'Définition : un écart de rendements actuariels à 10 ans, en points de base',
      'Ce qu\'il rémunère : budget, politique, liquidité',
      "L'historique : un changement de régime après 2022",
      'Le réflexe professionnel : décomposer les deux jambes',
    ],
    planEn: [
      'Definition: a gap between 10-year yields to maturity, in basis points',
      'What it compensates: fiscal risk, political risk, liquidity',
      'The history: a regime change after 2022',
      'The professional reflex: decompose the two legs',
    ],
    pointsAttendus: [
      'OAT 10 ans moins Bund 10 ans, en points de base — une différence de rendements actuariels, jamais de prix',
      'Niveau début 2026 : environ 75 pb (OAT vers 3,30 %, Bund vers 2,55 %)',
      'Il mesure la prime exigée pour prêter à la France plutôt qu\'à l\'Allemagne : risque budgétaire, risque politique, différence de liquidité',
      'Historique : 30-40 pb avant 2022 ; au-delà de 80 pb lors des pics de tension de 2024-2025 (dissolution, censures budgétaires)',
      "Un spread a deux jambes : un écartement peut venir d'une OAT qui monte (France sanctionnée) ou d'un Bund qui baisse (fuite vers la qualité) — décomposer avant d'interpréter",
    ],
    pointsAttendusEn: [
      'The 10-year OAT yield minus the 10-year Bund yield, in basis points — a difference of yields to maturity, never of prices',
      'Level in early 2026: around 75bp (OAT near 3.30%, Bund near 2.55%)',
      'It measures the premium required to lend to France rather than Germany: fiscal risk, political risk, liquidity differential',
      'History: 30-40bp before 2022; above 80bp at the 2024-2025 stress peaks (dissolution, budget censure votes)',
      'A spread has two legs: a widening can come from the OAT rising (France punished) or the Bund falling (flight to quality) — decompose before interpreting',
    ],
    bonus: [
      'Le point de comparaison italien : le BTP-Bund, structurellement plus large, a dépassé 500 pb en 2011-2012, avant le « whatever it takes » de Draghi en juillet 2012',
      'La trajectoire croisée de 2024-2025 : le BTP-Bund se resserre porté par la stabilité politique italienne, au point de croiser par moments un spread français en pleine fièvre',
    ],
    bonusEn: [
      "The Italian comparison: the BTP-Bund, structurally wider, exceeded 500bp in 2011-2012, before Draghi's 'whatever it takes' in July 2012",
      'The 2024-2025 crossover: the BTP-Bund tightened on Italian political stability, at times crossing a feverish French spread',
    ],
    reponseModele: `Le spread OAT-Bund est l'écart entre le rendement actuariel de l'OAT 10 ans et celui du Bund 10 ans, exprimé en points de base. OAT à 3,30 %, Bund à 2,55 % : 75 pb. Premier réflexe de rigueur : un spread est une différence de **rendements**, jamais de prix.

Ce qu'il reflète : la prime que le marché exige pour prêter à la France plutôt qu'à l'Allemagne, la référence de la zone euro. C'est un mélange de risque budgétaire — déficits, trajectoire de dette —, de risque politique et d'une différence de liquidité. C'est devenu, littéralement, le thermomètre politique français : chaque épisode — dissolution de 2024, censures budgétaires — se lit en temps réel sur ce chiffre.

L'histoire récente montre un changement de régime. Avant 2022, le spread vivait paisiblement entre 30 et 40 pb. La remontée des taux puis l'instabilité politique l'ont fait dépasser 80 pb lors des pics de 2024-2025 — des niveaux plus vus depuis la crise de la zone euro. Pour l'échelle : le BTP-Bund italien a dépassé 500 pb en 2011-2012, et il a fallu le « whatever it takes » de Draghi pour casser la spirale.

Dernier point, celui qui distingue : un spread a **deux jambes**. S'il passe de 75 à 90 pb, est-ce l'OAT qui a monté — la France est sanctionnée — ou le Bund qui a baissé, par fuite vers la qualité un jour de panique ? Les deux écartent le spread, et les lectures sont opposées. Toujours décomposer avant d'interpréter.`,
    reponseModeleEn: `The OAT-Bund spread is the gap between the 10-year OAT yield and the 10-year Bund yield, in basis points. OAT at 3.30%, Bund at 2.55%: 75bp. First reflex of rigour: a spread is a difference of **yields**, never of prices.

What it reflects: the premium the market demands for lending to France rather than to Germany, the euro area's benchmark. It is a blend of fiscal risk — deficits, the debt trajectory — political risk, and a liquidity differential. It has become, quite literally, France's political thermometer: every episode — the 2024 dissolution, the budget censure votes — prints on that number in real time.

Recent history shows a regime change. Before 2022, the spread lived quietly between 30 and 40bp. The rise in rates and then political instability pushed it beyond 80bp at the 2024-2025 peaks — levels unseen since the euro crisis. For scale: the Italian BTP-Bund exceeded 500bp in 2011-2012, and it took Draghi's 'whatever it takes' to break the spiral.

Last point, the one that sets a candidate apart: a spread has **two legs**. If it moves from 75 to 90bp, did the OAT rise — France being punished — or did the Bund fall, on a flight to quality during a panic? Both widen the spread, and the readings are opposite. Always decompose before interpreting.`,
  },
  {
    id: 'm4-jury-10',
    moduleId: M4,
    theme: 'courbe & macro',
    themeEn: 'curve & macro',
    difficulte: 3,
    question: 'Le QE de la banque centrale : quel effet sur la courbe des taux ?',
    questionEn: 'Central-bank QE: what effect does it have on the yield curve?',
    plan: [
      'Le mécanisme : des achats massifs de titres, concentrés sur le long',
      "L'effet : taux longs comprimés, courbe aplatie",
      'La lecture théorique : prime de terme et habitat préféré',
      'Le mouvement inverse : le QT depuis 2023',
    ],
    planEn: [
      'The mechanism: large-scale asset purchases, concentrated at the long end',
      'The effect: long yields compressed, curve flattened',
      'The theoretical reading: term premium and preferred habitat',
      'The reverse move: QT since 2023',
    ],
    pointsAttendus: [
      "QE : achats d'actifs à grande échelle par la banque centrale, surtout des obligations souveraines de maturités moyennes et longues",
      'Effet direct : la demande fait monter les prix, donc baisser les rendements longs — la courbe s\'aplatit',
      "Le canal principal : la compression de la prime de terme ; lecture « habitat préféré » : un acheteur insensible au prix déforme le compartiment long",
      "Effet de signal : acheter du long annonce des taux bas durables et ancre aussi les anticipations",
      "Effet pervers : le signal de la courbe (l'inversion notamment) est brouillé quand le long est artificiellement comprimé",
      "QT depuis 2023 : le portefeuille s'éteint sans réinvestissement, le marché doit absorber plus de papier, les primes de terme regonflent",
    ],
    pointsAttendusEn: [
      'QE: large-scale asset purchases by the central bank, mostly sovereign bonds at medium and long maturities',
      'Direct effect: the demand pushes prices up, hence long yields down — the curve flattens',
      'The main channel: term-premium compression; the preferred-habitat reading: a price-insensitive buyer distorts the long-end compartment',
      'Signalling effect: buying long paper announces durably low rates and anchors expectations too',
      'Perverse effect: the curve signal (inversion in particular) gets blurred when the long end is artificially compressed',
      'QT since 2023: the portfolio runs off without reinvestment, the market must absorb more paper, term premiums rebuild',
    ],
    bonus: [
      "L'ordre de grandeur : au pic, l'Eurosystème portait de l'ordre du quart de la dette négociable française",
      "Le lien avec les spreads : le retrait de l'acheteur insensible au prix redonne du poids au jugement des investisseurs privés sur chaque signature",
    ],
    bonusEn: [
      'The order of magnitude: at its peak, the Eurosystem held roughly a quarter of France\'s negotiable debt',
      'The link to spreads: removing the price-insensitive buyer hands pricing power back to private investors\' judgement of each issuer',
    ],
    reponseModele: `Le QE — l'assouplissement quantitatif — consiste pour la banque centrale, une fois ses taux directeurs au plancher, à acheter massivement des titres, pour l'essentiel des obligations souveraines de maturités moyennes et longues, financés par création de réserves.

L'effet sur la courbe se lit en deux temps. Le canal direct : une demande massive et insensible au prix fait monter les prix des titres longs, donc baisser leurs rendements — la courbe **s'aplatit** par le long. En théorie des courbes, c'est la prime de terme qui est comprimée, et la grille « habitat préféré » décrit bien le mécanisme : un acheteur géant s'installe dans un compartiment de maturités et en déforme l'équilibre offre-demande, presque indépendamment du reste. S'y ajoute un canal de signal : acheter du 10 ans annonce que les taux resteront bas longtemps, ce qui ancre aussi les anticipations sur le court et le moyen terme.

L'ordre de grandeur mérite d'être cité : au pic, l'Eurosystème portait de l'ordre du quart de la dette négociable française. Conséquence moins flatteuse : quand le long est artificiellement comprimé, les signaux de la courbe — l'inversion en tête — deviennent difficiles à lire.

Depuis 2023, le film se déroule à l'envers : c'est le resserrement quantitatif. La banque centrale laisse son portefeuille s'éteindre sans réinvestir ; le marché doit absorber davantage de papier, les primes de terme regonflent, et le jugement des investisseurs privés sur chaque signature — donc les spreads — reprend du poids.`,
    reponseModeleEn: `QE — quantitative easing — is what a central bank does once policy rates are at the floor: it buys securities at scale, mostly sovereign bonds at medium and long maturities, financed by creating reserves.

The effect on the curve reads in two steps. The direct channel: massive, price-insensitive demand pushes long-bond prices up, hence their yields down — the curve **flattens** from the long end. In curve theory, it is the term premium being compressed, and the preferred-habitat framework describes the mechanics well: a giant buyer moves into one maturity compartment and distorts its supply-demand balance, almost independently of the rest. Add a signalling channel: buying 10-year paper announces that rates will stay low for long, which anchors expectations at the short and middle of the curve too.

The order of magnitude is worth quoting: at its peak, the Eurosystem held roughly a quarter of France's negotiable government debt. A less flattering consequence: with the long end artificially compressed, curve signals — inversion first among them — become hard to read.

Since 2023 the film has been running backwards: quantitative tightening. The central bank lets its portfolio run off without reinvesting; the market has to absorb more paper, term premiums rebuild, and private investors' judgement of each issuer — hence spreads — regains its weight.`,
  },
  {
    id: 'm4-jury-11',
    moduleId: M4,
    theme: 'rendement',
    themeEn: 'yield',
    difficulte: 2,
    question: 'Le YTM : définition, hypothèses, limites.',
    questionEn: 'Yield to maturity: definition, assumptions, limitations.',
    plan: [
      'Définition : le taux qui égalise prix et flux actualisés',
      'Calcul : pas de formule fermée, résolution itérative',
      'Hypothèses : détention à maturité et réinvestissement au même taux',
      'Limites et bon usage',
    ],
    planEn: [
      'Definition: the rate that equates price and discounted cash flows',
      'Computation: no closed-form formula, iterative solving',
      'Assumptions: holding to maturity and reinvestment at the same rate',
      'Limitations and proper use',
    ],
    pointsAttendus: [
      'Le YTM est LE taux y tel que P = Σ Ft/(1+y)^t : le TRI de l\'investissement obligataire, lecture inverse de la formule de prix',
      'Résolution numérique par essais encadrants — possible car le prix est une fonction strictement décroissante du taux',
      'Lire le YTM comme rendement réalisé suppose : détention jusqu\'à maturité ET réinvestissement de chaque coupon au taux y',
      'Risque de réinvestissement : si les taux baissent, les coupons se replacent moins bien et le rendement réalisé tombe sous le YTM',
      'Seul le zéro-coupon verrouille son rendement à l\'achat : rien à réinvestir',
      'Utilité : rendre comparables des profils prix/coupon différents ; les dettes souveraines se cotent en taux',
    ],
    pointsAttendusEn: [
      'The YTM is THE rate y such that P = Σ Ft/(1+y)^t: the IRR of the bond investment, the pricing formula read in reverse',
      'Numerical solving by bracketing trials — possible because price is strictly decreasing in the rate',
      'Reading the YTM as a realised return assumes: holding to maturity AND reinvesting every coupon at the rate y',
      'Reinvestment risk: if rates fall, coupons reinvest worse and the realised return drops below the YTM',
      'Only the zero-coupon locks its return at purchase: nothing to reinvest',
      'Usefulness: making different price/coupon profiles comparable; sovereign debt is quoted in yield',
    ],
    bonus: [
      "L'exemple de tête : 2 ans, coupon 4 %, prix 990 € → YTM ≈ 4,53 %",
      "En surcote : YTM < rendement courant < coupon — et l'ordre s'inverse en décote",
      "Le YTM est une moyenne complexe des taux zéro-coupon — d'où l'effet coupon sur courbe pentue",
    ],
    bonusEn: [
      'The worked number from memory: 2 years, 4% coupon, price €990 → YTM ≈ 4.53%',
      'At a premium: YTM < current yield < coupon — and the ordering flips at a discount',
      'The YTM is a complex average of zero-coupon rates — hence the coupon effect on a steep curve',
    ],
    reponseModele: `Le rendement actuariel, ou YTM, est LE taux $y$ qui égalise le prix observé et la somme des flux actualisés : $P = \\sum F_t/(1+y)^t$. C'est la formule de prix lue à l'envers — on observe le prix, on en extrait le taux — et c'est le taux de rentabilité interne de l'investissement obligataire : il intègre les coupons, leur calendrier, le prix d'achat et le remboursement.

Côté calcul, pas de formule fermée dès que le titre a plusieurs flux : on résout par itérations, en s'appuyant sur le fait que le prix décroît strictement avec le taux. Exemple : une obligation 2 ans, coupon 4 %, à 990 € — sous le pair, donc YTM au-dessus du coupon ; le solveur donne environ 4,53 %.

Les hypothèses, maintenant — c'est là que le jury attend. Lire le YTM comme un rendement **réalisé** suppose deux choses : détenir jusqu'à maturité, et réinvestir chaque coupon au taux $y$ lui-même. Détenir jusqu'au bout fige les flux, pas leur réinvestissement : si les taux baissent après l'achat, les coupons se replacent moins bien et le rendement réalisé tombe sous le YTM affiché. Le seul titre qui verrouille son rendement à l'achat est le zéro-coupon — rien à réinvestir.

D'où le bon usage : le YTM est un instrument de **comparaison**, qui ramène n'importe quelle combinaison prix-coupon-maturité à un taux unique — c'est pour cela que les dettes souveraines se cotent en taux. C'est un rendement promis sous conditions, pas une garantie.`,
    reponseModeleEn: `The yield to maturity is THE rate $y$ that equates the observed price with the sum of discounted cash flows: $P = \\sum F_t/(1+y)^t$. It is the pricing formula read backwards — observe the price, extract the rate — and it is the internal rate of return of the bond investment: it captures the coupons, their timing, the purchase price and the redemption.

On computation: no closed form once the bond has several flows; you solve iteratively, leaning on the fact that price is strictly decreasing in the rate. Example: a 2-year bond, 4% coupon, at €990 — below par, so the YTM sits above the coupon; the solver returns about 4.53%.

Now the assumptions — this is where the examiner listens. Reading the YTM as a **realised** return assumes two things: holding to maturity, and reinvesting every coupon at the rate $y$ itself. Holding to the end locks the contractual flows, not their reinvestment: if rates fall after purchase, coupons reinvest at worse rates and the realised return drops below the quoted YTM. The only instrument that locks its return at purchase is the zero-coupon — nothing to reinvest.

Hence the proper use: the YTM is a **comparison** tool, reducing any price-coupon-maturity combination to a single rate — which is why sovereign debt is quoted in yield. It is a return promised under conditions, not a guarantee.`,
  },
  {
    id: 'm4-jury-12',
    moduleId: M4,
    theme: 'pricing',
    themeEn: 'pricing',
    difficulte: 1,
    question: 'Prix propre vs prix sale : pourquoi cette distinction ?',
    questionEn: 'Clean price versus dirty price: why the distinction?',
    plan: [
      "Le problème : l'intérêt s'accumule entre deux détachements de coupon",
      'Les définitions : couru, propre, sale',
      'Pourquoi le marché cote en prix propre',
      'Un exemple chiffré',
    ],
    planEn: [
      'The problem: interest accrues between two coupon dates',
      'The definitions: accrued, clean, dirty',
      'Why the market quotes clean',
      'A worked example',
    ],
    pointsAttendus: [
      'Le coupon couru : la fraction du coupon accumulée depuis le dernier détachement, au prorata des jours, dans la base du titre (Exact/Exact pour les OAT)',
      'Prix propre (clean) = le prix coté sur les écrans, hors couru ; prix sale (dirty) = le montant réglé = propre + couru',
      "Le couru dédommage le vendeur qui a porté le titre, alors que l'acheteur encaissera le prochain coupon en entier",
      "Coté en sale, le prix monterait en dents de scie — hausse mécanique quotidienne, chute au détachement — sans aucune information de marché",
      'Exemple : OAT coupon 3 %, prix coté 98,45 %, 146 jours après le coupon → couru 12 €, règlement 996,50 € pour 1 000 € de nominal',
    ],
    pointsAttendusEn: [
      "The accrued coupon: the fraction of the coupon built up since the last payment, pro rata by days, in the bond's basis (Actual/Actual for OATs)",
      'Clean price = the screen quote, excluding accrued; dirty price = the amount settled = clean + accrued',
      'The accrued compensates the seller who carried the bond, while the buyer will collect the next coupon in full',
      'Quoted dirty, the price would saw-tooth — mechanical daily rise, drop at the coupon date — with zero market information',
      'Example: OAT with a 3% coupon, quoted 98.45%, 146 days after the coupon → accrued €12, settlement €996.50 per €1,000 face',
    ],
    bonus: [
      'La période de coupon contenant un 29 février compte 366 jours en Exact/Exact',
      "Le prix sale « roule » mécaniquement d'environ la capitalisation quotidienne au taux de marché — le couru linéaire n'en est qu'une approximation conventionnelle",
    ],
    bonusEn: [
      'A coupon period containing 29 February counts 366 days under Actual/Actual',
      "The dirty price mechanically 'rolls up' by roughly one day's compounding at the market rate — the linear accrued is just a conventional approximation of it",
    ],
    reponseModele: `Entre deux détachements de coupon, l'intérêt s'accumule jour après jour au profit du porteur. Si je vends mon obligation 146 jours après le dernier coupon, j'ai « gagné » 146 jours d'intérêt — mais c'est l'acheteur qui encaissera le prochain coupon, en totalité. Pour rétablir l'équité, l'acheteur me dédommage en payant, en plus du prix coté, le **coupon couru** : la fraction du coupon accumulée depuis le dernier détachement, au prorata des jours, dans la base du titre — Exact/Exact pour les OAT.

D'où deux prix pour un même titre. Le **prix propre**, ou pied de coupon : celui des écrans, hors couru. Le **prix sale**, ou plein coupon : le montant effectivement réglé, soit prix propre plus couru. Exemple du cours : OAT coupon 3 %, cotée 98,45 %, achetée 146 jours après le détachement — couru de 1 000 × 3 % × 146/365 = 12 €, règlement de 984,50 + 12 = 996,50 € pour 1 000 € de nominal. Répondre « 984,50 € » à la question « combien réglez-vous ? » est LA faute classique.

Pourquoi coter en propre ? Parce que le couru croît mécaniquement chaque jour puis retombe à zéro au détachement : coté « sale », le prix monterait en dents de scie sans que rien ne change sur le marché. Le prix propre neutralise cette mécanique calendaire et n'exprime que ce qui intéresse le marché : la valeur du titre au regard des taux, de la signature et de la liquidité.`,
    reponseModeleEn: `Between two coupon dates, interest builds up day after day for whoever holds the bond. If I sell mine 146 days after the last coupon, I have 'earned' 146 days of interest — yet it is the buyer who will collect the next coupon, in full. To restore fairness, the buyer compensates me by paying, on top of the quoted price, the **accrued coupon**: the fraction of the coupon built up since the last payment, pro rata by days, in the bond's own basis — Actual/Actual for OATs.

Hence two prices for one bond. The **clean price**: the screen quote, excluding accrued. The **dirty price**: the amount actually settled, clean plus accrued. The course example: an OAT with a 3% coupon, quoted at 98.45%, bought 146 days after the coupon — accrued of 1,000 × 3% × 146/365 = €12, settlement of 984.50 + 12 = €996.50 per €1,000 of face value. Answering '€984.50' to 'how much do you pay?' is THE classic mistake.

Why quote clean? Because the accrued grows mechanically every day, then drops to zero at the coupon date: quoted dirty, the price would saw-tooth upward and crash on coupon day without anything changing in the market. The clean price strips out that calendar mechanics and expresses only what the market cares about: the bond's value given rates, credit quality and liquidity.`,
  },
  {
    id: 'm4-jury-13',
    moduleId: M4,
    theme: 'convexité',
    themeEn: 'convexity',
    difficulte: 3,
    question: "Qu'est-ce que la convexité et pourquoi dit-on que c'est une qualité ?",
    questionEn: 'What is convexity, and why do we say it is a desirable feature?',
    plan: [
      'Le point de départ : la relation prix-taux est une courbe, pas une droite',
      'La duration est la tangente — elle ment sur les gros chocs',
      "La correction d'ordre 2 et son signe, positif dans les deux sens",
      'Les conséquences de gestion : la convexité se paie',
    ],
    planEn: [
      'The starting point: the price-yield relationship is a curve, not a line',
      'Duration is the tangent — it lies on large shocks',
      'The second-order correction and its sign, positive both ways',
      'The portfolio consequences: convexity is paid for',
    ],
    pointsAttendus: [
      'La courbe prix-taux est convexe, bombée vers le haut ; la duration modifiée n\'est que la pente de sa tangente au taux courant',
      'Une courbe convexe reste au-dessus de sa tangente : la duration surestime les pertes et sous-estime les gains, systématiquement',
      'La formule complète : ΔP/P ≈ −D_mod × Δy + ½ × C × (Δy)²',
      "Le terme de convexité est positif que les taux montent ou baissent, car (Δy)² est toujours positif : il amortit les pertes et amplifie les gains",
      'À duration et rendement égaux, le titre le plus convexe est strictement préférable — c\'est pourquoi la convexité « se paie » par un rendement légèrement inférieur',
      "L'erreur de la duration seule croît comme le carré du choc : invisible à 10 pb, significative à 200 pb",
    ],
    pointsAttendusEn: [
      'The price-yield curve is convex, bowed upward; modified duration is merely the slope of its tangent at the current yield',
      'A convex curve stays above its tangent: duration overstates losses and understates gains, systematically',
      'The full formula: ΔP/P ≈ −D_mod × Δy + ½ × C × (Δy)²',
      'The convexity term is positive whether rates rise or fall, since (Δy)² is always positive: it cushions losses and amplifies gains',
      'For equal duration and yield, the more convex bond strictly dominates — which is why convexity is paid for via a slightly lower yield',
      'The duration-only error grows with the square of the shock: invisible at 10bp, significant at 200bp',
    ],
    bonus: [
      'Le fil rouge chiffré : pour ±1 point, prix exacts −27,75 €/+28,82 € contre ∓28,28 € prédits par la duration seule — la convexité (10,41) explique toute l\'asymétrie',
      'Les profils très convexes : zéro-coupons longs ; à l\'inverse, les obligations callables ont de la convexité négative (module 9)',
    ],
    bonusEn: [
      'The course numbers: for ±1 point, exact prices −€27.75/+€28.82 versus ∓€28.28 predicted by duration alone — convexity (10.41) explains the whole asymmetry',
      'Highly convex profiles: long zero-coupons; conversely, callable bonds exhibit negative convexity (module 9)',
    ],
    reponseModele: `Tout part d'un fait géométrique : la relation entre le prix d'une obligation et son taux n'est pas une droite, c'est une courbe **convexe**, bombée vers le haut. La duration modifiée n'est que la pente de la tangente à cette courbe au taux actuel. Approximer la variation de prix par la duration, c'est remplacer la courbe par sa tangente : excellent tout près du point, de plus en plus faux à mesure que le choc grandit — et l'erreur croît comme le carré du choc.

Or une courbe convexe reste toujours **au-dessus** de sa tangente. L'erreur de la duration joue donc systématiquement dans le même sens : elle surestime les pertes et sous-estime les gains. Sur l'obligation fil rouge du cours, pour ±1 point de taux, la duration prédit ±28,28 € ; les valeurs exactes sont −27,75 € et +28,82 €.

La convexité $C$ est la correction d'ordre 2 qui mesure cette courbure : $\\Delta P/P \\approx -D_{mod}\\,\\Delta y + \\tfrac{1}{2}\\,C\\,(\\Delta y)^2$. Le point décisif : $(\\Delta y)^2$ est positif quel que soit le signe du choc. Le terme de convexité **amortit les pertes quand les taux montent et amplifie les gains quand ils baissent**.

C'est en cela qu'elle est une qualité : à duration et rendement égaux, le titre le plus convexe se comporte mieux dans les deux scénarios — il domine strictement. Les gérants parlent d'« acheter de la convexité », et comme toute qualité, elle se paie : le marché accepte un rendement légèrement inférieur pour un profil plus convexe.`,
    reponseModeleEn: `It all starts from a geometric fact: the relationship between a bond's price and its yield is not a straight line but a **convex** curve, bowed upward. Modified duration is merely the slope of the tangent to that curve at the current yield. Approximating the price change with duration means replacing the curve by its tangent: excellent very close to the point, increasingly wrong as the shock grows — and the error grows with the square of the shock.

Now, a convex curve always stays **above** its tangent. So duration's error always cuts the same way: it overstates losses and understates gains. On the course's reference bond, for ±1 point of yield, duration predicts ±€28.28; the exact figures are −€27.75 and +€28.82.

Convexity $C$ is the second-order correction that measures this curvature: $\\Delta P/P \\approx -D_{mod}\\,\\Delta y + \\tfrac{1}{2}\\,C\\,(\\Delta y)^2$. The decisive point: $(\\Delta y)^2$ is positive whatever the sign of the shock. The convexity term **cushions losses when rates rise and amplifies gains when they fall**.

That is why it is a quality: for equal duration and yield, the more convex bond behaves better in both scenarios — it strictly dominates. Portfolio managers talk about 'buying convexity', and like any quality it has a price: the market accepts a slightly lower yield for a more convex profile.`,
  },
  {
    id: 'm4-jury-14',
    moduleId: M4,
    theme: 'marché primaire',
    themeEn: 'primary market',
    difficulte: 2,
    question: 'Adjudication vs syndication : différences, et quand utilise-t-on chacune ?',
    questionEn: 'Auction versus syndication: how do they differ, and when is each used?',
    plan: [
      "L'adjudication : l'enchère régulière des émetteurs souverains",
      'La technique française : prix multiples, SVT',
      'La syndication : un placement construit par des banques',
      'Le choix : la routine contre le sur-mesure',
    ],
    planEn: [
      'The auction: the sovereign issuer\'s regular tender',
      'The French technique: multiple prices, primary dealers',
      'Syndication: a placement built by banks',
      'The choice: routine versus bespoke',
    ],
    pointsAttendus: [
      "Adjudication : enchère à calendrier régulier et annoncé — l'AFT émet les BTF chaque semaine, les OAT chaque mois —, réservée aux SVT (primary dealers)",
      'Le format français à prix multiples : les ordres sont servis du prix le plus élevé au plus bas, et chaque SVT servi paie le prix qu\'il a lui-même demandé',
      "Le bid-to-cover (demande/montant servi) mesure l'appétit — une adjudication mal couverte est un signal de marché scruté",
      "Syndication : l'émetteur mandate un syndicat de banques qui sonde les investisseurs, construit le livre d'ordres, cale le prix et alloue les titres",
      'Usage : adjudication = la routine des États (régularité, coût minimal) ; syndication = les corporates, et les États pour les souches nouvelles ou très longues',
    ],
    pointsAttendusEn: [
      'Auction: a tender on a regular, announced calendar — the AFT issues BTFs weekly, OATs monthly — restricted to primary dealers (SVTs)',
      'The French multiple-price format: orders are filled from the highest price down, and each dealer served pays the price it bid',
      'The bid-to-cover ratio (demand/amount served) gauges appetite — a poorly covered auction is a closely watched market signal',
      'Syndication: the issuer mandates a bank syndicate that sounds out investors, builds the order book, sets the price and allocates',
      'Usage: auctions = the sovereign routine (regularity, minimal cost); syndication = corporates, and sovereigns for new or very long lines',
    ],
    bonus: [
      "Les ordres de grandeur AFT : environ 11 Md€ par séance d'adjudication OAT, un programme d'environ 300 Md€ par an, un ratio de couverture typique autour de 2,4",
      'La winner\'s curse du format à prix multiples : le SVT le plus agressif paie plus cher que les autres — surenchérir a un coût',
    ],
    bonusEn: [
      'AFT orders of magnitude: about €11bn per OAT auction, a programme of roughly €300bn a year, a typical bid-to-cover around 2.4',
      "The winner's curse of the multiple-price format: the most aggressive dealer pays more than everyone else — overbidding has a cost",
    ],
    reponseModele: `Une obligation naît sur le marché primaire, et deux mécanismes dominent.

**L'adjudication** est la voie des États. En France, l'Agence France Trésor émet selon un calendrier régulier et annoncé — les BTF chaque semaine, les OAT chaque mois, de l'ordre de 11 Md€ par séance pour un programme annuel d'environ 300 Md€. Seuls participent les SVT, une quinzaine de banques agréées. La technique française est l'enchère **à prix multiples** : les ordres sont servis du prix le plus élevé au plus bas jusqu'au montant visé, et chaque SVT servi paie le prix qu'il a lui-même demandé — l'État capte ainsi le surplus des enchérisseurs agressifs, au risque d'une winner's curse pour qui surenchérit. L'indicateur scruté est le bid-to-cover : une adjudication mal couverte est un signal de défiance.

**La syndication** est la voie des entreprises — et des États pour certaines souches. L'émetteur mandate un syndicat de banques qui sonde les investisseurs, construit le livre d'ordres, cale le prix au vu de la demande et alloue les titres, contre commission.

Quand utilise-t-on chacune ? L'adjudication est la machine de la **routine** : pour un émetteur régulier et connu, c'est le coût minimal — pas de syndicat à rémunérer, une prévisibilité qui se paie en rendement plus bas. La syndication est le **sur-mesure** : indispensable quand il faut construire une demande qui n'existe pas encore — une signature corporate, une souche souveraine nouvelle, très longue ou inaugurale, comme la première OAT verte.`,
    reponseModeleEn: `A bond is born on the primary market, and two mechanisms dominate.

**The auction** is the sovereign route. In France, the Agence France Trésor issues on a regular, announced calendar — BTFs every week, OATs every month, around €11bn per session within an annual programme of roughly €300bn. Only the SVTs take part, some fifteen accredited primary dealers. The French technique is the **multiple-price** auction: orders are filled from the highest price down to the target amount, and each dealer served pays the price it actually bid — the State thereby captures the surplus of aggressive bidders, at the risk of a winner's curse for whoever overbids. The watched indicator is the bid-to-cover: a poorly covered auction is a signal of distrust.

**Syndication** is the corporate route — and the sovereign route for certain lines. The issuer mandates a syndicate of banks that sounds out investors, builds the order book, sets the price against demand and allocates the paper, for a fee.

When is each used? The auction is the machine of **routine**: for a regular, well-known issuer it minimises cost — no syndicate to pay, and predictability that translates into lower funding costs. Syndication is the **bespoke** option: indispensable when demand has to be built from scratch — a corporate name, a new, very long or inaugural sovereign line, like the first green OAT.`,
  },
  {
    id: 'm4-jury-15',
    moduleId: M4,
    theme: 'culture',
    themeEn: 'market culture',
    difficulte: 1,
    question: 'Pourquoi le marché obligataire est-il plus gros que le marché actions ?',
    questionEn: 'Why is the bond market bigger than the equity market?',
    plan: [
      "Les chiffres d'abord",
      'La raison structurelle : qui peut émettre quoi',
      'La mécanique du stock : la dette se réémet sans cesse',
      'Pourquoi il fait moins les gros titres mais fixe tous les prix',
    ],
    planEn: [
      'The numbers first',
      'The structural reason: who can issue what',
      'The stock mechanics: debt is endlessly refinanced',
      'Why it makes fewer headlines yet sets every price',
    ],
    pointsAttendus: [
      "Encours mondial de l'ordre de 140 000 Md$ — du même ordre que la capitalisation boursière mondiale, et longtemps supérieur",
      'Les États n\'émettent pas d\'actions : la totalité de la dette publique mondiale est obligataire — la France à elle seule approche 3 500 Md€',
      'Les entreprises font les deux, et la désintermédiation pousse le financement par titres plutôt que par crédit bancaire',
      'La dette arrive à échéance et se refinance en permanence : le stock se renouvelle et s\'empile, contrairement aux actions',
      "La courbe souveraine sert de prix de référence à quasiment tous les autres actifs — d'où le surnom d'instrument roi",
    ],
    pointsAttendusEn: [
      'Global outstanding around $140 trillion — on a par with world equity market capitalisation, and long above it',
      'States issue no equity: the entirety of world public debt is bonds — France alone approaches €3,500bn',
      'Companies do both, and disintermediation pushes financing through securities rather than bank credit',
      'Debt matures and is endlessly refinanced: the stock rolls over and piles up, unlike equity',
      "The sovereign curve serves as the reference price for nearly every other asset — hence the nickname 'king instrument'",
    ],
    bonus: [
      "Le marché obligataire est un marché de gré à gré animé par des teneurs de marché, moins visible que les Bourses — d'où son déficit de notoriété",
      'Banques, assureurs et fonds de pension sont structurellement contraints de détenir de la dette (réglementation, gestion actif-passif)',
    ],
    bonusEn: [
      'The bond market is an over-the-counter market run by market makers, less visible than stock exchanges — hence its low public profile',
      'Banks, insurers and pension funds are structurally required to hold debt (regulation, asset-liability management)',
    ],
    reponseModele: `Les chiffres d'abord : le marché obligataire mondial représente un encours de l'ordre de 140 000 milliards de dollars — du même ordre que la capitalisation boursière mondiale, et longtemps supérieur à elle.

La raison principale est structurelle : **les États n'émettent pas d'actions**. Toute la dette publique mondiale, par construction, est obligataire — la France à elle seule approche 3 500 Md€ de dette publique. Les entreprises, elles, font les deux, et le mouvement de désintermédiation pousse depuis des décennies le financement par titres plutôt que par crédit bancaire : montants plus gros, maturités plus longues, base d'investisseurs plus large.

S'y ajoute une mécanique de stock : une action est émise une fois et vit indéfiniment ; une obligation arrive à échéance et se **refinance** — l'émetteur réemprunte pour rembourser. Le marché primaire obligataire tourne donc en permanence, et le stock s'empile au rythme des déficits publics.

Enfin, la demande est structurelle : banques, assureurs et fonds de pension sont contraints — par la réglementation et par leur gestion actif-passif — de détenir massivement de la dette.

Le paradoxe, c'est la notoriété : les actions font les gros titres, mais c'est sur la courbe des taux souverains que se construisent les prix de quasiment tous les autres actifs. Le marché obligataire est moins spectaculaire — il est simplement la référence. D'où son surnom : l'instrument roi.`,
    reponseModeleEn: `The numbers first: the global bond market represents an outstanding stock of around $140 trillion — on a par with world equity market capitalisation, and for a long time above it.

The main reason is structural: **states issue no equity**. All of the world's public debt, by construction, is in bonds — France alone is approaching €3,500bn of public debt. Companies, for their part, do both, and the decades-long disintermediation trend keeps pushing financing through securities rather than bank credit: larger amounts, longer maturities, a broader investor base.

Add a stock mechanic: a share is issued once and lives indefinitely; a bond matures and gets **refinanced** — the issuer borrows again to repay. The bond primary market therefore runs continuously, and the stock piles up at the pace of public deficits.

Finally, demand is structural: banks, insurers and pension funds are required — by regulation and by their asset-liability management — to hold debt in size.

The paradox is the publicity: equities make the headlines, but it is on the sovereign yield curve that the prices of nearly all other assets are built. The bond market is less spectacular — it is simply the reference. Hence its nickname: the king instrument.`,
  },
  {
    id: 'm4-jury-16',
    moduleId: M4,
    theme: 'FRN',
    themeEn: 'FRN',
    difficulte: 3,
    question: 'Une entreprise hésite entre émettre à taux fixe ou variable. Que lui dites-vous ?',
    questionEn: 'A company is hesitating between issuing fixed or floating rate. What do you tell them?',
    plan: [
      'Reformuler la question : qui porte le risque de taux, et lequel',
      'Le taux fixe : un coût certain, prime de terme incluse',
      'Le variable : coller au marché monétaire, coupon par coupon',
      'Les critères de décision, et la troisième voie',
    ],
    planEn: [
      'Reframe the question: who carries the rate risk, and which risk',
      'Fixed: a certain cost, term premium included',
      'Floating: tracking the money market, coupon by coupon',
      'The decision criteria, and the third way',
    ],
    pointsAttendus: [
      "Fixe : coût figé jusqu'à maturité — protection contre la hausse, mais on paie la courbe entière, prime de terme incluse, et on ne profite pas d'une baisse",
      'Variable (FRN) : coupon = Euribor + marge de crédit fixée à l\'émission, refixé périodiquement ; le coût suit le marché monétaire dans les deux sens',
      'Critère 1 — le bilan : si les revenus de l\'entreprise suivent les taux courts, le variable est une couverture naturelle (logique actif-passif)',
      'Critère 2 — les anticipations face aux forwards : émettre fixe n\'est gagnant que si les taux montent plus que ce que la courbe intègre déjà',
      "Le point mort est calculable : la hausse d'Euribor qui égalise les deux coûts sur la période",
      "La décision n'est pas définitive : on émet l'un et on peut swapper vers l'autre",
    ],
    pointsAttendusEn: [
      'Fixed: cost locked to maturity — protection against rises, but you pay the whole curve, term premium included, and gain nothing from a fall',
      'Floating (FRN): coupon = Euribor + a credit margin set at issue, refixed periodically; the cost tracks the money market both ways',
      'Criterion 1 — the balance sheet: if the company\'s revenues track short rates, floating is a natural hedge (asset-liability logic)',
      'Criterion 2 — expectations versus the forwards: issuing fixed only wins if rates rise by more than the curve already prices in',
      'The break-even is computable: the Euribor rise that equalises the two costs over the period',
      'The decision is not final: issue one and swap into the other later',
    ],
    bonus: [
      "Rappeler que le forward n'est pas une prévision : « la courbe monte, donc je fixe » revient en réalité à payer la prime de terme",
      "Le prix d'un FRN reste proche du pair tant que la qualité de crédit est stable : sensibilité taux quasi nulle, sensibilité crédit intacte",
    ],
    bonusEn: [
      "Recall that the forward is not a forecast: 'the curve is upward sloping, so I lock in' actually amounts to paying the term premium",
      'An FRN trades near par as long as credit quality is stable: near-zero rate sensitivity, intact credit sensitivity',
    ],
    reponseModele: `Je commencerais par reformuler : la vraie question est de savoir **qui porte le risque de taux**, et lequel des deux risques l'entreprise tolère le mieux.

Émettre à taux **fixe**, c'est acheter de la certitude : le coût est figé jusqu'à maturité, la hausse des taux ne peut plus faire mal. Mais cette certitude se paie : on fige un taux long qui contient la prime de terme, et si les taux baissent, on reste accroché au coût d'hier. Émettre en **FRN** — Euribor plus une marge de crédit fixée à l'émission —, c'est l'inverse : le coupon se refixe périodiquement, le coût épouse le marché monétaire, dans les deux sens.

Deux critères structurent la décision. D'abord le **bilan** : si les revenus de l'entreprise suivent les taux courts, le variable est une couverture naturelle — actifs et passifs respirent ensemble. Ensuite les **anticipations, comparées aux forwards** : la courbe intègre déjà un scénario de taux ; émettre fixe n'est gagnant que si les taux montent *plus* que ce scénario. Dire « la courbe monte, donc je fixe » revient en réalité à payer la prime de terme. Le point mort se chiffre : la hausse d'Euribor qui égalise les deux coûts sur la période.

J'ajouterais enfin que la décision n'est pas irréversible : on émet là où le marché est le plus profond, et un swap permet ensuite de transformer fixe en variable ou l'inverse. Le choix d'émission est un choix de format ; l'exposition aux taux, elle, se pilote en continu.`,
    reponseModeleEn: `I would start by reframing: the real question is **who carries the rate risk**, and which of the two risks the company tolerates best.

Issuing **fixed** is buying certainty: the cost is locked until maturity, rising rates can no longer hurt. But that certainty has a price: you lock in a long rate that embeds the term premium, and if rates fall you stay stuck with yesterday's cost. Issuing an **FRN** — Euribor plus a credit margin set at issue — is the reverse: the coupon refixes periodically and the cost tracks the money market, both ways.

Two criteria structure the decision. First, the **balance sheet**: if the company's revenues track short rates, floating is a natural hedge — assets and liabilities breathe together. Second, **expectations versus the forwards**: the curve already prices in a rate path; issuing fixed only wins if rates rise by *more* than that path. Saying 'the curve slopes up, so I lock in' actually amounts to paying the term premium. The break-even can be computed: the Euribor rise that equalises the two costs over the period.

I would add, finally, that the decision is not irreversible: you issue where the market is deepest, and a swap can later turn fixed into floating or the reverse. The issuance choice is a question of format; the rate exposure is managed continuously.`,
  },
  {
    id: 'm4-jury-17',
    moduleId: M4,
    theme: 'inflation',
    themeEn: 'inflation-linked',
    difficulte: 2,
    question: "Qu'est-ce qu'une OATi et quand est-elle intéressante ?",
    questionEn: 'What is an OATi, and when is it attractive?',
    plan: [
      'La mécanique : nominal indexé, coupon réel',
      'Ce qu\'elle garantit : un rendement réel',
      "L'outil de comparaison : le point mort d'inflation",
      'Les porteurs naturels',
    ],
    planEn: [
      'The mechanics: indexed principal, real coupon',
      'What it locks in: a real return',
      'The comparison tool: the break-even inflation rate',
      'The natural holders',
    ],
    pointsAttendus: [
      "OATi : OAT indexée sur l'inflation française hors tabac ; l'OAT€i est indexée sur l'inflation de la zone euro hors tabac",
      "Le nominal est multiplié par un coefficient d'indexation qui suit l'indice des prix ; le coupon — un taux réel fixe — s'applique au nominal indexé ; le remboursement est lui aussi indexé",
      'Elle verrouille un rendement réel, là où une OAT classique verrouille un rendement nominal',
      'Le point mort (breakeven) ≈ taux nominal − taux réel : l\'inflation moyenne qui égalise indexée et nominale',
      "Intéressante si l'inflation réalisée dépasse le point mort ; sinon la nominale aurait fait mieux",
      'Porteurs naturels : assureurs et fonds de pension aux engagements indexés sur les prix, gérants cherchant une protection du pouvoir d\'achat',
    ],
    pointsAttendusEn: [
      'OATi: an OAT indexed to French inflation excluding tobacco; the OAT€i is indexed to euro-area inflation excluding tobacco',
      'The principal is multiplied by an indexation coefficient tracking the price index; the coupon — a fixed real rate — applies to the indexed principal; redemption is indexed too',
      'It locks in a real return, where a standard OAT locks in a nominal one',
      'The break-even ≈ nominal yield − real yield: the average inflation that equalises the linker and the nominal bond',
      'Attractive if realised inflation exceeds the break-even; otherwise the nominal bond would have done better',
      'Natural holders: insurers and pension funds with price-linked liabilities, managers seeking purchasing-power protection',
    ],
    bonus: [
      "Le plancher de remboursement : l'OATi est remboursée au minimum au pair, même en cas de déflation cumulée",
      'Le breakeven extrait des indexées est l\'une des mesures d\'anticipations d\'inflation les plus suivies par les banques centrales',
    ],
    bonusEn: [
      'The redemption floor: an OATi is repaid at par at minimum, even after cumulative deflation',
      'The break-even extracted from linkers is one of the inflation-expectation gauges central banks watch most closely',
    ],
    reponseModele: `L'OATi est une OAT indexée sur l'inflation française hors tabac — sa cousine l'OAT€i suit l'inflation de la zone euro. La mécanique tient en deux points : le **nominal** est multiplié par un coefficient d'indexation qui suit l'indice des prix, et le **coupon** — un taux réel fixe — s'applique chaque année à ce nominal indexé. Le remboursement final est lui aussi indexé. Résultat : là où une OAT classique verrouille un rendement nominal, l'indexée verrouille un rendement **réel** — le pouvoir d'achat est protégé, quoi qu'il arrive aux prix.

Quand est-elle intéressante ? Tout se lit dans le **point mort d'inflation**, le breakeven : approximativement le taux nominal moins le taux réel de même maturité. C'est l'inflation moyenne qui rend indexée et nominale équivalentes. Si l'inflation réalisée dépasse ce point mort, l'indexée gagne ; si elle reste en dessous, la nominale aurait fait mieux. Acheter une OATi, ce n'est donc pas parier sur « de l'inflation », c'est parier sur **plus d'inflation que ce que le marché intègre déjà**.

Les porteurs naturels sont ceux dont les engagements suivent les prix : assureurs, fonds de pension, gestions de passifs indexés — pour eux, l'indexée est une couverture structurelle, pas un pari. Deux raffinements pour finir : l'OATi est remboursée au minimum au pair même en déflation cumulée, et le breakeven extrait des indexées est l'une des mesures d'anticipations d'inflation les plus suivies par les banques centrales.`,
    reponseModeleEn: `The OATi is an OAT indexed to French inflation excluding tobacco — its cousin the OAT€i tracks euro-area inflation. The mechanics come down to two points: the **principal** is multiplied by an indexation coefficient that follows the price index, and the **coupon** — a fixed real rate — applies each year to that indexed principal. The final redemption is indexed too. The result: where a standard OAT locks in a nominal return, the linker locks in a **real** one — purchasing power is protected whatever happens to prices.

When is it attractive? Everything reads off the **break-even inflation rate**: roughly the nominal yield minus the real yield at the same maturity. It is the average inflation that makes the linker and the nominal bond equivalent. If realised inflation comes in above the break-even, the linker wins; below it, the nominal bond would have done better. Buying an OATi is therefore not a bet on 'inflation' — it is a bet on **more inflation than the market already prices in**.

The natural holders are those whose liabilities track prices: insurers, pension funds, index-linked liability managers — for them the linker is a structural hedge, not a bet. Two refinements to close: the OATi is redeemed at par at minimum even after cumulative deflation, and the break-even extracted from linkers is one of the inflation-expectation gauges central banks watch most closely.`,
  },
  {
    id: 'm4-jury-18',
    moduleId: M4,
    theme: 'courbe des taux',
    themeEn: 'yield curve',
    difficulte: 3,
    question: 'Expliquez le taux forward. Le forward est-il une prévision ?',
    questionEn: 'Explain the forward rate. Is the forward a forecast?',
    plan: [
      'Définition : le taux futur implicite contenu dans la courbe',
      "L'exemple chiffré et la formule",
      "Pourquoi c'est un fait d'arbitrage, pas une opinion",
      'La prime de terme, ou pourquoi le forward surestime',
    ],
    planEn: [
      'Definition: the implied future rate embedded in the curve',
      'The worked number and the formula',
      'Why it is an arbitrage fact, not an opinion',
      'The term premium, or why the forward overestimates',
    ],
    pointsAttendus: [
      "Le forward f1,2 est le taux d'un placement de 1 an commençant dans 1 an, tel que les deux chemins vers l'horizon 2 ans se valent : placer 2 ans d'un bloc, ou 1 an puis replacer au forward",
      'La formule : (1+z2)² = (1+z1)(1+f1,2)',
      "L'exemple chiffré : z1 = 2 %, z2 = 3 % → f1,2 = 1,03²/1,02 − 1 ≈ 4,01 %",
      "La justification par absence d'arbitrage : deux stratégies certaines de même mise doivent produire la même richesse finale, sinon gain sans risque",
      'Non, pas une prévision : la prime de terme se loge dans le forward, qui surestime historiquement les taux courts réalisés',
      "La formulation exacte : « le taux d'indifférence entre placer long et rouler du court »",
    ],
    pointsAttendusEn: [
      'The forward f1,2 is the rate on a 1-year investment starting in 1 year, such that the two routes to the 2-year horizon are equivalent: invest 2 years outright, or 1 year then roll at the forward',
      'The formula: (1+z2)² = (1+z1)(1+f1,2)',
      'The worked number: z1 = 2%, z2 = 3% → f1,2 = 1.03²/1.02 − 1 ≈ 4.01%',
      'The no-arbitrage justification: two riskless strategies with the same outlay must produce the same final wealth, otherwise free money',
      'No, not a forecast: the term premium lodges itself in the forward, which historically overestimates realised short rates',
      "The exact phrasing: 'the indifference rate between investing long and rolling short'",
    ],
    bonus: [
      "L'arbitrage explicite : si (1+z1)(1+f) > (1+z2)², emprunter 2 ans, placer 1 an plus forward — gain certain sans mise initiale",
      'Même sans valeur prédictive, les forwards sont des prix contractables : FRA et swaps permettent de les verrouiller réellement',
    ],
    bonusEn: [
      'The explicit arbitrage: if (1+z1)(1+f) > (1+z2)², borrow 2 years, invest 1 year plus the forward — a certain gain with zero initial outlay',
      'Even without predictive value, forwards are tradable prices: FRAs and swaps let you actually lock them in',
    ],
    reponseModele: `La courbe d'aujourd'hui contient, en creux, des taux futurs : les taux forward. Le forward $f_{1,2}$ est le taux d'un placement de 1 an commençant dans 1 an, tel que les deux chemins vers l'horizon 2 ans se valent — placer 2 ans d'un bloc, ou placer 1 an puis replacer au forward : $(1+z_2)^2 = (1+z_1)(1+f_{1,2})$.

L'exemple du cours : $z_1 = 2\\,\\%$, $z_2 = 3\\,\\%$, d'où $f_{1,2} = 1{,}03^2/1{,}02 - 1 \\approx 4{,}01\\,\\%$. L'intuition est arithmétique : pour rapporter 3 % par an sur deux ans quand la première année n'en rapporte que 2, la seconde doit en rapporter environ 4.

Pourquoi est-ce une égalité stricte ? Par **absence d'arbitrage** : deux stratégies sans risque, de même mise et de mêmes dates, doivent produire la même richesse finale. Sinon, j'emprunte sur le chemin bon marché, je place sur l'autre, et j'empoche un gain certain sans mise initiale — les arbitragistes ramènent les prix à l'égalité.

Le forward est-il une prévision ? **Non**, et c'est la nuance attendue. C'est un fait arithmétique de la courbe, pas un sondage. Si les taux longs contiennent une prime de terme, elle se loge mécaniquement dans le forward, qui surestime alors le taux futur réellement anticipé — c'est ce qu'on observe historiquement. La formulation exacte : 4,01 % est le taux d'indifférence entre placer long et rouler du court. Et même sans valeur prédictive, les forwards restent des prix bien réels : FRA et swaps permettent de les contracter aujourd'hui.`,
    reponseModeleEn: `Today's curve contains, implicitly, future rates: the forwards. The forward $f_{1,2}$ is the rate on a 1-year investment starting in 1 year, such that the two routes to the 2-year horizon are worth the same — invest 2 years outright, or invest 1 year and roll at the forward: $(1+z_2)^2 = (1+z_1)(1+f_{1,2})$.

The course example: $z_1 = 2\\,\\%$, $z_2 = 3\\,\\%$, hence $f_{1,2} = 1.03^2/1.02 - 1 \\approx 4.01\\,\\%$. The intuition is arithmetic: to earn 3% a year over two years when the first year only pays 2%, the second must pay about 4%.

Why is it a strict equality? **No arbitrage**: two riskless strategies with the same outlay over the same dates must produce the same final wealth. Otherwise I borrow along the cheap route, invest along the other, and pocket a certain gain with zero initial money — arbitrageurs force prices back to equality.

Is the forward a forecast? **No** — and that is the nuance the examiner wants. It is an arithmetic fact of the curve, not a poll. If long rates contain a term premium, it lodges itself mechanically in the forward, which then overestimates the rate actually expected — exactly what we observe historically. The precise phrasing: 4.01% is the indifference rate between investing long and rolling short. And even without predictive value, forwards are very real prices: FRAs and swaps let you contract them today.`,
  },
  {
    id: 'm4-jury-19',
    moduleId: M4,
    theme: 'gestion',
    themeEn: 'portfolio management',
    difficulte: 3,
    question: "Qu'est-ce que l'immunisation d'un portefeuille ?",
    questionEn: 'What is portfolio immunisation?',
    plan: [
      'Le problème : un passif à payer à dates connues',
      "Le principe : caler la duration de l'actif sur celle du passif",
      'Pourquoi ça marche : deux effets qui se compensent',
      'Les conditions et les limites',
    ],
    planEn: [
      'The problem: liabilities due at known dates',
      'The principle: match the asset duration to the liability duration',
      'Why it works: two offsetting effects',
      'The conditions and the limits',
    ],
    pointsAttendus: [
      'Le contexte est la gestion actif-passif : un assureur ou un fonds de pension doit payer des prestations futures — son passif a une valeur actuelle et une duration',
      "Le principe : duration de l'actif = duration du passif, à valeurs actuelles égales — l'égalité des durations seule ne suffit pas",
      'La mécanique : si les taux montent, les titres perdent en prix mais les coupons se réinvestissent mieux ; à l\'horizon de la duration, les deux effets se compensent — et symétriquement en cas de baisse',
      'Le portefeuille est alors insensible, au premier ordre, à un choc de taux parallèle',
      'Limites : le raisonnement suppose un choc parallèle et instantané ; la duration dérive avec le temps et les taux, il faut rebalancer régulièrement',
    ],
    pointsAttendusEn: [
      'The context is asset-liability management: an insurer or pension fund must pay future benefits — its liability has a present value and a duration',
      'The principle: asset duration = liability duration, with equal present values — matching durations alone is not enough',
      'The mechanics: if rates rise, bond prices fall but coupons reinvest better; at the duration horizon the two effects offset — and symmetrically for a fall',
      'The portfolio is then insensitive, to first order, to a parallel rate shock',
      'Limits: the reasoning assumes a parallel, one-off shock; duration drifts with time and rates, so regular rebalancing is needed',
    ],
    bonus: [
      "L'immunisation parfaite : un zéro-coupon de maturité égale à l'horizon (cash-flow matching) — c'est exactement à cela que servent les OAT démembrées",
      "Le raffinement d'ordre 2 : viser une convexité d'actif supérieure ou égale à celle du passif, pour que les gros chocs jouent en votre faveur",
    ],
    bonusEn: [
      'Perfect immunisation: a zero-coupon whose maturity equals the horizon (cash-flow matching) — exactly what stripped OATs are for',
      'The second-order refinement: target asset convexity at or above liability convexity, so large shocks work in your favour',
    ],
    reponseModele: `L'immunisation répond à un problème de gestion actif-passif. Un assureur ou un fonds de pension doit payer des prestations à dates connues : son **passif** est une série de flux futurs, qui a donc une valeur actuelle et une duration. Le risque n'est pas de « perdre de l'argent » dans l'absolu, c'est que l'actif et le passif divergent quand les taux bougent.

Le principe : caler la **duration de l'actif sur celle du passif**, à valeurs actuelles égales — je précise bien les deux conditions, car l'égalité des durations seule ne suffit pas.

Pourquoi ça marche ? Un mouvement de taux a deux effets opposés sur un portefeuille obligataire. Si les taux montent, les prix baissent — effet négatif immédiat — mais les coupons se réinvestissent à un meilleur taux — effet positif cumulatif. À l'horizon de la duration, précisément, ces deux effets se compensent ; symétriquement en cas de baisse. En égalisant les durations, on fait coïncider cet horizon de neutralité avec l'échéance du passif : le portefeuille devient insensible, au premier ordre, à un choc de taux parallèle.

Les limites font partie de la réponse : le raisonnement suppose un choc parallèle et instantané, et la duration dérive avec le temps et les mouvements de taux — l'immunisation se rebalance régulièrement, ce n'est pas un réglage unique. Le cas parfait existe d'ailleurs : un zéro-coupon de maturité égale à l'horizon — c'est exactement l'usage des OAT démembrées. Et le raffinement d'ordre 2 : viser une convexité d'actif au moins égale à celle du passif, pour que les gros chocs jouent pour vous.`,
    reponseModeleEn: `Immunisation answers an asset-liability problem. An insurer or a pension fund must pay benefits at known dates: its **liability** is a stream of future cash flows, so it has a present value and a duration. The risk is not 'losing money' in the abstract — it is the asset and the liability drifting apart when rates move.

The principle: match the **asset duration to the liability duration**, with equal present values — I stress both conditions, because matching durations alone is not enough.

Why does it work? A rate move has two opposite effects on a bond portfolio. If rates rise, prices fall — an immediate negative — but coupons reinvest at better rates — a cumulative positive. Precisely at the duration horizon, the two effects offset; symmetrically for a fall. By matching durations, you align that neutrality horizon with the liability's due date: the portfolio becomes insensitive, to first order, to a parallel rate shock.

The limits are part of the answer: the reasoning assumes a parallel, one-off shock, and duration drifts as time passes and rates move — an immunised portfolio is rebalanced regularly, it is not a one-time setting. The perfect case does exist: a zero-coupon maturing exactly at the horizon — which is precisely what stripped OATs are used for. And the second-order refinement: target asset convexity at or above liability convexity, so that large shocks work in your favour.`,
  },
  {
    id: 'm4-jury-20',
    moduleId: M4,
    theme: 'crédit',
    themeEn: 'credit',
    difficulte: 2,
    question: 'La hiérarchie des créanciers : où se situent les obligations ?',
    questionEn: 'The creditor hierarchy: where do bonds sit?',
    plan: [
      'Le principe : un ordre de remboursement en cas de défaut',
      "L'échelle complète, du mieux protégé au plus exposé",
      'Où loge la masse des obligations',
      'La traduction en rendement',
    ],
    planEn: [
      'The principle: a repayment order in case of default',
      'The full ladder, from best protected to most exposed',
      'Where the bulk of bonds sits',
      'The translation into yield',
    ],
    pointsAttendus: [
      "En cas de liquidation, les créanciers sont servis dans un ordre strict : c'est la hiérarchie du passif",
      "L'échelle : dette senior sécurisée (adossée à des actifs) → senior non sécurisée → subordonnée (Tier 2 bancaire) → hybrides (AT1, perpétuelles) → actions, servies en dernier",
      'La grande masse des obligations classiques — souveraines comme corporate — est de la dette senior non sécurisée',
      'Plus on descend, plus le taux de recouvrement espéré baisse et plus le rendement exigé monte',
      'Les hybrides sont des absorbeurs de pertes, à mi-chemin de la dette et des fonds propres',
    ],
    pointsAttendusEn: [
      'In a liquidation, creditors are paid in a strict order: the liability-side hierarchy',
      'The ladder: senior secured debt (backed by assets) → senior unsecured → subordinated (bank Tier 2) → hybrids (AT1, perpetuals) → equity, paid last',
      'The great bulk of standard bonds — sovereign and corporate alike — is senior unsecured debt',
      'The further down you go, the lower the expected recovery rate and the higher the required yield',
      'Hybrids are loss absorbers, halfway between debt and equity',
    ],
    bonus: [
      "L'anecdote qui marque : Credit Suisse, mars 2023 — environ 16 Md CHF d'AT1 effacés alors que les actionnaires recevaient une contrepartie ; la hiérarchie perçue inversée, un séisme sur le marché des AT1",
      'Relier au spread de crédit : la seniorité est, avec la probabilité de défaut, l\'un des deux déterminants du spread (probabilité × perte en cas de défaut)',
    ],
    bonusEn: [
      'The memorable anecdote: Credit Suisse, March 2023 — about CHF 16bn of AT1s written off while shareholders received something; the perceived hierarchy inverted, an earthquake for the AT1 market',
      'Link to credit spreads: seniority is, with default probability, one of the two drivers of the spread (probability × loss given default)',
    ],
    reponseModele: `La hiérarchie des créanciers, c'est l'ordre strict dans lequel le passif d'un émetteur est servi en cas de défaut ou de liquidation. Du mieux protégé au plus exposé : la **dette senior sécurisée**, adossée à des actifs précis, première servie ; la **dette senior non sécurisée** ; la **dette subordonnée**, remboursée seulement après les seniors — typiquement les titres Tier 2 bancaires ; les **hybrides**, à mi-chemin de la dette et des fonds propres — AT1 bancaires, perpétuelles corporate —, conçus comme absorbeurs de pertes ; et enfin les **actions**, servies en dernier, c'est-à-dire le plus souvent pas du tout.

Où se situent les obligations ? La grande masse des obligations classiques — souveraines comme corporate — loge dans la dette **senior non sécurisée**. C'est le cœur du marché.

La traduction financière est directe : plus on descend dans la hiérarchie, plus le taux de recouvrement espéré en cas de défaut baisse, et plus le rendement exigé monte. La seniorité est ainsi, avec la probabilité de défaut, l'un des deux déterminants du spread de crédit.

Si je veux marquer le jury, je cite Credit Suisse en mars 2023 : environ 16 milliards de francs suisses d'AT1 intégralement effacés alors que les actionnaires, en bas de la hiérarchie, recevaient une contrepartie. L'inversion perçue de l'ordre des pertes a provoqué un séisme sur tout le marché des AT1 — la preuve que cette hiérarchie n'est pas un détail juridique, mais le cœur du pricing.`,
    reponseModeleEn: `The creditor hierarchy is the strict order in which an issuer's liabilities are paid in a default or liquidation. From best protected to most exposed: **senior secured debt**, backed by specific assets, paid first; **senior unsecured debt**; **subordinated debt**, repaid only after the seniors — typically bank Tier 2 paper; **hybrids**, halfway between debt and equity — bank AT1s, corporate perpetuals — designed as loss absorbers; and finally **equity**, paid last, which in a bankruptcy usually means not at all.

Where do bonds sit? The great bulk of standard bonds — sovereign and corporate alike — lives in **senior unsecured** debt. That is the heart of the market.

The financial translation is direct: the further down the ladder, the lower the expected recovery in default, and the higher the yield investors demand. Seniority is thus, together with default probability, one of the two drivers of the credit spread.

If I want to leave a mark on the panel, I cite Credit Suisse in March 2023: roughly CHF 16 billion of AT1s written down to zero while shareholders, at the bottom of the ladder, still received something. That perceived inversion of the loss order sent an earthquake through the entire AT1 market — proof that this hierarchy is not legal fine print but the core of pricing.`,
  },
  {
    id: 'm4-jury-21',
    moduleId: M4,
    theme: 'culture',
    themeEn: 'market culture',
    difficulte: 3,
    question: "Que s'est-il passé sur les marchés de taux en 2022, et pourquoi est-ce historique ?",
    questionEn: 'What happened in rates markets in 2022, and why was it historic?',
    plan: [
      'Le déclencheur : le retour brutal de l\'inflation',
      'La réponse : le resserrement monétaire le plus rapide en quarante ans',
      'Les dégâts : la pire année obligataire de l\'histoire moderne',
      'Les répliques, et ce que 2022 a changé',
    ],
    planEn: [
      'The trigger: the brutal return of inflation',
      'The response: the fastest monetary tightening in forty years',
      'The damage: the worst bond year in modern history',
      'The aftershocks, and what 2022 changed',
    ],
    pointsAttendus: [
      "Le déclencheur : l'inflation post-COVID (réouverture, goulets d'étranglement), aggravée par la guerre en Ukraine — autour de 10 % en zone euro fin 2022",
      'La réponse : la Fed passe de près de zéro à plus de 5 % en dix-huit mois, la BCE sort des taux négatifs — le cycle de resserrement le plus rapide depuis les années 1980',
      "Les dégâts : prix obligataires en chute historique, les indices obligataires mondiaux perdent plus de 10 % sur l'année — du jamais vu — et le Bund 10 ans passe de taux négatifs à nettement positifs",
      'La courbe américaine : bear flattening poussé jusqu\'à l\'inversion la plus profonde depuis le début des années 1980',
      'La corrélation actions-obligations devient positive : le portefeuille 60/40 perd sur ses deux jambes, la diversification classique échoue',
      "La fin de l'ère des taux négatifs : le stock mondial de dette à rendement négatif — environ 18 000 Md$ au pic de 2020 — disparaît",
    ],
    pointsAttendusEn: [
      'The trigger: post-COVID inflation (reopening, bottlenecks), aggravated by the war in Ukraine — around 10% in the euro area in late 2022',
      'The response: the Fed goes from near zero to above 5% in eighteen months, the ECB exits negative rates — the fastest tightening cycle since the 1980s',
      'The damage: a historic crash in bond prices, global bond indices losing more than 10% on the year — unprecedented — and the 10-year Bund swinging from negative yields to clearly positive',
      'The US curve: bear flattening pushed into the deepest inversion since the early 1980s',
      'The stock-bond correlation turns positive: the 60/40 portfolio loses on both legs, classic diversification fails',
      'The end of the negative-rates era: the global stock of negative-yielding debt — about $18 trillion at the 2020 peak — vanishes',
    ],
    bonus: [
      'La crise LDI britannique (septembre-octobre 2022) : le mini-budget Truss fait bondir les Gilts longs, appels de marge en spirale chez les fonds de pension, la Banque d\'Angleterre intervient en urgence',
      "Le changement de régime des spreads : l'OAT-Bund quitte définitivement la zone des 30-40 pb après 2022",
    ],
    bonusEn: [
      'The UK LDI crisis (September-October 2022): the Truss mini-budget sends long Gilts soaring, margin calls spiral at pension funds, the Bank of England steps in as an emergency buyer',
      'The spread regime change: the OAT-Bund leaves the 30-40bp zone for good after 2022',
    ],
    reponseModele: `2022 est l'année où quarante ans de baisse des taux se sont retournés en quelques mois.

Le déclencheur : le retour de l'inflation — réouverture post-COVID, goulets d'étranglement, puis le choc énergétique de la guerre en Ukraine. Autour de 10 % en zone euro fin 2022, du jamais vu depuis les années 1980. La réponse des banques centrales a été le resserrement le plus rapide en quarante ans : la Fed passe de près de zéro à plus de 5 % en dix-huit mois, la BCE sort des taux négatifs.

La traduction obligataire est mécanique — prix et taux varient en sens inverse — mais l'ampleur fut historique : les indices obligataires mondiaux perdent plus de 10 % sur l'année, la pire performance de l'histoire moderne pour un actif réputé « sûr » ; le Bund 10 ans passe de taux négatifs à nettement positifs ; la courbe américaine s'inverse en bear flattening, au plus profond depuis le début des années 1980. Et le stock mondial de dette à rendement négatif — environ 18 000 milliards de dollars au pic de 2020 — disparaît purement et simplement.

Pourquoi historique, au-delà des chiffres ? D'abord parce que la corrélation actions-obligations est devenue positive : le 60/40 a perdu sur ses deux jambes, la diversification classique a échoué au pire moment. Ensuite par les répliques : la crise LDI britannique d'octobre 2022, où la Banque d'Angleterre a dû intervenir en urgence pour stopper la spirale des appels de marge des fonds de pension. 2022 a refermé l'ère de l'argent gratuit — et rouvert l'ère du risque de taux.`,
    reponseModeleEn: `2022 is the year when forty years of falling rates reversed in a few months.

The trigger: the return of inflation — post-COVID reopening, supply bottlenecks, then the energy shock of the war in Ukraine. Around 10% in the euro area by late 2022, unseen since the 1980s. The central-bank response was the fastest tightening in forty years: the Fed goes from near zero to above 5% in eighteen months, the ECB exits negative rates.

The bond translation is mechanical — prices and yields move inversely — but the scale was historic: global bond indices lost more than 10% on the year, the worst modern-era performance for an asset class reputed 'safe'; the 10-year Bund swung from negative yields to clearly positive; the US curve inverted in a bear flattening, the deepest since the early 1980s. And the global stock of negative-yielding debt — about $18 trillion at the 2020 peak — simply vanished.

Why historic, beyond the numbers? First because the stock-bond correlation turned positive: the 60/40 portfolio lost on both legs, and classic diversification failed exactly when it was needed. Then the aftershocks: the UK LDI crisis of October 2022, when the Bank of England had to step in as an emergency buyer to stop the margin-call spiral at pension funds. 2022 closed the era of free money — and reopened the era of interest-rate risk.`,
  },
  {
    id: 'm4-jury-22',
    moduleId: M4,
    theme: 'courbe des taux',
    themeEn: 'yield curve',
    difficulte: 4,
    question: "Qu'est-ce que le 2s10s et comment le tradez-vous ?",
    questionEn: 'What is the 2s10s, and how do you trade it?',
    plan: [
      'Définition et lecture du 2s10s',
      'Le vocabulaire des mouvements : bull/bear, steepening/flattening',
      'Construire le trade : deux pattes, duration-neutre',
      'Le P&L et les risques',
    ],
    planEn: [
      'Definition and reading of the 2s10s',
      'The vocabulary of moves: bull/bear, steepening/flattening',
      'Building the trade: two legs, duration-neutral',
      'The P&L and the risks',
    ],
    pointsAttendus: [
      'Le 2s10s = taux 10 ans moins taux 2 ans, en points de base : le résumé standard de la pente de la courbe',
      'Steepener = parier sur la pentification : acheter le 2 ans, vendre le 10 ans ; flattener = le trade inverse',
      'Le dimensionnement : égaliser les DV01 des deux pattes pour neutraliser les translations parallèles — le nominal du 2 ans est un multiple de celui du 10 ans (rapport des durations, environ 4 à 5)',
      "Une fois duration-neutre, le P&L ne dépend que de la pente : environ DV01 d'une patte × variation du 2s10s en pb",
      'Préciser le scénario : bull steepening (le 2 ans baisse — assouplissement) vs bear steepening (le 10 ans monte — inflation, budget) : même trade, chemins différents',
      "Les risques : le carry et le roll-down du trade ne sont pas nuls, et la courbe peut se déformer autrement que par la pente (bosse)",
    ],
    pointsAttendusEn: [
      'The 2s10s = the 10-year yield minus the 2-year yield, in basis points: the standard summary of curve slope',
      'Steepener = betting on steepening: buy the 2-year, sell the 10-year; flattener = the reverse trade',
      'Sizing: equalise the DV01s of the two legs to neutralise parallel shifts — the 2-year notional is a multiple of the 10-year one (the duration ratio, roughly 4 to 5)',
      'Once duration-neutral, the P&L depends only on the slope: roughly one leg\'s DV01 × the change in the 2s10s in bp',
      'Specify the scenario: bull steepening (the 2-year falls — easing) versus bear steepening (the 10-year rises — inflation, fiscal risk): same trade, different paths',
      'The risks: the trade\'s carry and roll-down are not zero, and the curve can deform in ways other than slope (a hump)',
    ],
    bonus: [
      'En pratique, le trade se monte en futures — Schatz contre Bund sur la courbe euro : liquide, sans financement de titres',
      "L'exemple historique : bear flattening 2022-2023 jusqu'à environ −100 pb sur le 2s10s américain, puis sortie d'inversion en 2024 par le reflux du 2 ans",
    ],
    bonusEn: [
      'In practice the trade is put on in futures — Schatz against Bund on the euro curve: liquid, no securities funding needed',
      'The historical example: the 2022-2023 bear flattening down to about −100bp on the US 2s10s, then the 2024 dis-inversion via the 2-year falling back',
    ],
    reponseModele: `Le 2s10s est le spread de courbe le plus suivi : taux 10 ans moins taux 2 ans, en points de base. Positif, la courbe est pentue ; négatif, elle est inversée. C'est le résumé en un chiffre de la pente.

Le trade : si j'anticipe une **pentification**, je monte un steepener — acheter le 2 ans, vendre le 10 ans ; pour un aplatissement, le flattener inverse. Tout l'art est dans le dimensionnement : je veux être payé sur la pente, pas sur le niveau. J'égalise donc les **DV01 des deux pattes** : comme la duration du 10 ans est environ quatre à cinq fois celle du 2 ans, je mets quatre à cinq fois plus de nominal sur la patte courte. Ainsi, une translation parallèle de la courbe fait gagner une patte ce que l'autre perd — P&L proche de zéro — tandis qu'une variation de la pente paie : environ le DV01 d'une patte multiplié par le mouvement du 2s10s en pb.

Le candidat qui veut le niveau 4 précise le **scénario** : un steepening peut être bull — le 2 ans baisse, la banque centrale va assouplir — ou bear — le 10 ans monte, inflation ou dérapage budgétaire. Même trade, chemins et contextes très différents. Référence récente : le bear flattening de 2022-2023 a porté le 2s10s américain vers −100 pb, et la sortie d'inversion de 2024 s'est faite par le reflux du 2 ans.

Restent les risques à nommer : le carry et le roll-down du trade ne sont pas nuls — une courbe pentue « coûte » au steepener qui attend —, et la courbe peut se bosseler plutôt que pivoter. En pratique, on monte tout cela en futures — Schatz contre Bund en zone euro — pour la liquidité et l'absence de financement de titres.`,
    reponseModeleEn: `The 2s10s is the most watched curve spread: the 10-year yield minus the 2-year, in basis points. Positive, the curve is steep; negative, it is inverted. It is the one-number summary of slope.

The trade: if I expect **steepening**, I put on a steepener — buy the 2-year, sell the 10-year; for flattening, the reverse flattener. The craft is in the sizing: I want to be paid on the slope, not the level. So I equalise the **DV01s of the two legs**: since the 10-year's duration is roughly four to five times the 2-year's, I put four to five times more notional on the short leg. A parallel shift then earns on one leg what it loses on the other — P&L near zero — while a change in slope pays: roughly one leg's DV01 times the move in the 2s10s in bp.

A level-4 candidate specifies the **scenario**: steepening can be bull — the 2-year falls, the central bank is about to ease — or bear — the 10-year rises on inflation or fiscal slippage. Same trade, very different paths and contexts. Recent reference: the 2022-2023 bear flattening took the US 2s10s to about −100bp, and the 2024 dis-inversion came via the 2-year falling back.

The risks remain to be named: the trade's carry and roll-down are not zero — a steep curve 'costs' the steepener who waits — and the curve can hump rather than pivot. In practice it is all put on in futures — Schatz against Bund in the euro area — for liquidity and to avoid funding securities.`,
  },
  {
    id: 'm4-jury-23',
    moduleId: M4,
    theme: 'repo',
    themeEn: 'repo',
    difficulte: 4,
    question: 'Le repo squeeze de septembre 2019 aux États-Unis : que s\'est-il passé ?',
    questionEn: 'The September 2019 US repo squeeze: what happened?',
    plan: [
      'Les faits : une flambée du taux repo au jour le jour',
      'Les déclencheurs immédiats : un choc de demande de cash',
      'Les causes structurelles : des réserves devenues trop rares',
      'La réponse de la Fed et les leçons',
    ],
    planEn: [
      'The facts: a spike in the overnight repo rate',
      'The immediate triggers: a cash-demand shock',
      'The structural causes: reserves grown too scarce',
      "The Fed's response and the lessons",
    ],
    pointsAttendus: [
      "Mi-septembre 2019, le taux repo américain au jour le jour s'envole jusqu'à environ 10 % en séance — environ cinq fois son niveau normal",
      "Le déclencheur : la conjonction, le même jour, d'échéances fiscales des entreprises (le cash quitte les fonds monétaires) et du règlement d'une grosse adjudication de Treasuries (le cash est absorbé par le papier)",
      'La toile de fond : des réserves bancaires raréfiées par des années de réduction du bilan de la Fed, et des contraintes réglementaires qui dissuadent les banques de prêter leur cash même à 10 %',
      'La réponse : la Fed réinjecte des liquidités par opérations de repo au jour le jour — une première depuis 2008 — puis rachète des T-bills pour regonfler les réserves',
      'La leçon : le repo est la plomberie de la transmission monétaire ; quand il se grippe, le contrôle des taux courts casse — sans aucune crise de solvabilité',
    ],
    pointsAttendusEn: [
      'In mid-September 2019, the US overnight repo rate spiked to about 10% intraday — roughly five times its normal level',
      'The trigger: the same-day coincidence of corporate tax deadlines (cash leaving money-market funds) and the settlement of a large Treasury auction (cash absorbed by the paper)',
      "The backdrop: bank reserves made scarce by years of Fed balance-sheet runoff, and regulatory constraints deterring banks from lending their cash even at 10%",
      "The response: the Fed injected liquidity through overnight repo operations — a first since 2008 — then bought T-bills to rebuild reserves",
      'The lesson: repo is the plumbing of monetary transmission; when it seizes, control of short rates breaks — with no solvency crisis whatsoever',
    ],
    bonus: [
      "Personne n'était insolvable ce jour-là : c'est une crise de plomberie pure, pas de crédit — la distinction impressionne un jury",
      'La suite institutionnelle : la Fed a créé en 2021 une facilité de repo permanente (standing repo facility) pour plafonner ce risque',
      "L'écho LTCM : le même marché du repo qui fabrique le levier peut le détruire quand il se ferme",
    ],
    bonusEn: [
      'Nobody was insolvent that day: a pure plumbing crisis, not a credit crisis — a distinction that impresses a panel',
      'The institutional sequel: in 2021 the Fed created a standing repo facility to cap this risk',
      'The LTCM echo: the same repo market that builds leverage can destroy it when it shuts',
    ],
    reponseModele: `Les faits d'abord : mi-septembre 2019, le taux des pensions livrées au jour le jour sur le marché américain s'envole brutalement — jusqu'à environ 10 % en séance, cinq fois son niveau normal, alors que les taux directeurs de la Fed sont autour de 2 %. Pendant deux jours, le marché du financement le plus profond du monde cesse de fonctionner normalement.

Le déclencheur est une conjonction de calendrier : le même jour tombent des échéances fiscales trimestrielles — les entreprises retirent leur cash des fonds monétaires pour payer l'impôt — et le règlement d'une grosse adjudication de Treasuries — le cash disponible est absorbé par le papier. Double ponction sur le cash, au même moment.

Mais le déclencheur n'explique pas tout, et c'est là que la réponse devient intéressante : la toile de fond, c'est des **réserves bancaires raréfiées** par des années de réduction du bilan de la Fed, et des contraintes réglementaires de bilan qui dissuadent les grandes banques de prêter leur cash — même à 10 %. Le système n'avait plus de marge.

La Fed a répondu en réinjectant des liquidités par opérations de repo au jour le jour — une première depuis 2008 — puis en rachetant des T-bills pour regonfler durablement les réserves ; elle a ensuite créé, en 2021, une facilité de repo permanente.

La leçon, en une phrase : personne n'était insolvable ce jour-là — c'est une crise de plomberie, pas de crédit. Le repo est le canal par lequel la banque centrale contrôle les taux courts : quand il se grippe, la transmission monétaire casse, sans qu'aucun défaut soit en cause.`,
    reponseModeleEn: `The facts first: in mid-September 2019, the overnight repo rate in the US market spiked violently — to about 10% intraday, five times its normal level, while the Fed's policy rates sat around 2%. For two days, the deepest funding market in the world stopped working normally.

The trigger was a calendar coincidence: quarterly corporate tax deadlines fell on the same day — companies pulled cash out of money-market funds to pay the bill — as the settlement of a large Treasury auction — available cash got absorbed by the paper. A double drain on cash, at the same moment.

But the trigger does not explain everything, and this is where the answer gets interesting: the backdrop was **bank reserves made scarce** by years of Fed balance-sheet runoff, plus regulatory balance-sheet constraints that deterred the big banks from lending their cash — even at 10%. The system had run out of slack.

The Fed responded by injecting liquidity through overnight repo operations — a first since 2008 — then by buying T-bills to rebuild reserves durably; in 2021 it went on to create a standing repo facility.

The lesson, in one sentence: nobody was insolvent that day — it was a plumbing crisis, not a credit crisis. Repo is the channel through which the central bank controls short rates: when it seizes up, monetary transmission breaks, with no default anywhere in sight.`,
  },
  {
    id: 'm4-jury-24',
    moduleId: M4,
    theme: 'synthèse',
    themeEn: 'capstone',
    difficulte: 4,
    question: 'On vous donne 10 M€ à placer en obligations avec une vue de baisse des taux. Votre stratégie ?',
    questionEn: 'You are given €10m to invest in bonds with a view that rates will fall. Your strategy?',
    plan: [
      'Traduire la vue en exposition : allonger la duration',
      'Préciser le scénario : quel point de la courbe baisse',
      'Choisir les instruments et chiffrer le gain espéré',
      'Encadrer le risque : ce qui se passe si la vue est fausse',
    ],
    planEn: [
      'Translate the view into exposure: extend duration',
      'Refine the scenario: which part of the curve falls',
      'Pick the instruments and quantify the expected gain',
      'Frame the risk: what happens if the view is wrong',
    ],
    pointsAttendus: [
      'Une baisse des taux fait monter les prix : la vue se monétise en maximisant la duration du portefeuille',
      'Les instruments : maturités longues et coupons faibles — zéro-coupons ou OAT démembrées pour la duration maximale par euro investi',
      'Chiffrer : une OAT 10 ans a une duration modifiée d\'environ 8 à 8,5 → −100 pb ≈ +8 % ≈ +800 k€ sur 10 M€ ; un démembré 30 ans (duration ~29) tripler l\'exposition',
      'Affiner selon le scénario : baisse par le court (bull steepening, assouplissement) → privilégier le 2-5 ans ; baisse par le long (bull flattening, fuite vers la qualité) → le 10-30 ans',
      'La convexité travaille pour vous : sur un gros mouvement, le gain dépasse l\'estimation linéaire — à duration égale, préférer les profils convexes',
      'Le risque est symétrique : +100 pb coûte du même ordre — définir taille, horizon et seuil de sortie avant d\'entrer',
    ],
    pointsAttendusEn: [
      'Falling rates mean rising prices: the view is monetised by maximising portfolio duration',
      'The instruments: long maturities and low coupons — zero-coupons or stripped OATs for maximum duration per euro invested',
      'Quantify: a 10-year OAT has a modified duration around 8 to 8.5 → −100bp ≈ +8% ≈ +€800k on €10m; a 30-year strip (duration ~29) triples the exposure',
      'Refine by scenario: a fall led by the front end (bull steepening, easing) → favour the 2-5 year; led by the long end (bull flattening, flight to quality) → the 10-30 year',
      'Convexity works for you: on a large move the gain beats the linear estimate — for equal duration, prefer convex profiles',
      'The risk is symmetric: +100bp costs about as much — set size, horizon and exit threshold before entering',
    ],
    bonus: [
      'La structure barbell (très court + très long) offre plus de convexité qu\'un bullet de même duration',
      "Le coût de portage : sur une courbe pentue, être long duration coûte du carry si la baisse tarde — le point mort temporel se calcule",
      'Pour amplifier sans cash supplémentaire : futures ou achat financé en repo — en précisant que le levier change la nature du risque',
    ],
    bonusEn: [
      'The barbell structure (very short + very long) offers more convexity than a bullet of equal duration',
      'The carry cost: on a steep curve, being long duration costs carry if the fall is late — the time break-even can be computed',
      'To amplify without extra cash: futures or repo-funded purchases — noting that leverage changes the nature of the risk',
    ],
    reponseModele: `Première étape : traduire la vue en exposition. Une baisse des taux fait monter les prix obligataires, et l'ampleur du gain est proportionnelle à la duration : $\\Delta P \\approx -D_{mod}\\,\\Delta y\\,P$. Ma stratégie consiste donc à **allonger la duration** au maximum compatible avec mon mandat.

Deuxième étape, celle qui fait la différence : préciser le **scénario**. Si la baisse vient du court — la banque centrale assouplit, bull steepening —, le 2-5 ans capte le mouvement et le 30 ans peut ne presque pas bouger. Si elle vient du long — désinflation, fuite vers la qualité, bull flattening —, c'est le 10-30 ans qu'il faut. Une vue de taux est toujours une vue de courbe.

Troisième étape : les instruments, chiffrés. Pour une baisse généralisée, des OAT longues — duration modifiée 8 à 8,5 sur le 10 ans : −100 pb ≈ +8 %, soit +800 k€ sur mes 10 M€. Pour l'exposition maximale par euro : des zéro-coupons, OAT démembrées — un strip 30 ans a une duration d'environ 29, plus du triple. À duration égale, je privilégie la convexité — un barbell très court/très long plutôt qu'un bullet — pour que les gros mouvements jouent davantage pour moi.

Dernière étape, obligatoire : le risque. Il est symétrique — +100 pb me coûte du même ordre que ce que −100 pb me rapporte — et le portage d'une attente prolongée n'est pas gratuit sur une courbe pentue. Donc : taille calibrée, horizon défini, seuil de sortie fixé avant d'entrer. Une vue n'est une stratégie que si son échec est budgété.`,
    reponseModeleEn: `Step one: translate the view into exposure. Falling rates push bond prices up, and the size of the gain is proportional to duration: $\\Delta P \\approx -D_{mod}\\,\\Delta y\\,P$. So my strategy is to **extend duration** as far as my mandate allows.

Step two — the one that separates candidates: refine the **scenario**. If the fall comes from the front end — the central bank easing, a bull steepening — the 2-5 year captures the move and the 30-year may barely budge. If it comes from the long end — disinflation, flight to quality, a bull flattening — the 10-30 year is the place to be. A rates view is always a curve view.

Step three: the instruments, with numbers. For a broad-based fall, long OATs — modified duration 8 to 8.5 on the 10-year: −100bp ≈ +8%, that is +€800k on my €10m. For maximum exposure per euro: zero-coupons, stripped OATs — a 30-year strip has a duration of about 29, more than triple. For equal duration I favour convexity — a barbell of very short plus very long rather than a bullet — so that large moves work harder for me.

Final step, non-negotiable: the risk. It is symmetric — +100bp costs me about what −100bp earns me — and the carry of a long wait is not free on a steep curve. So: calibrated size, defined horizon, exit threshold set before entering. A view only becomes a strategy once its failure has been budgeted.`,
  },
  {
    id: 'm4-jury-25',
    moduleId: M4,
    theme: 'jeu de rôle',
    themeEn: 'role play',
    difficulte: 4,
    question: 'Convainquez-moi en 60 secondes que la duration de mon fonds est trop élevée.',
    questionEn: 'Convince me in 60 seconds that my fund\'s duration is too high.',
    plan: [
      'Ouvrir par le chiffre qui fait mal : la perte en euros pour 100 pb',
      'Rapporter le risque au mandat et à l\'horizon du fonds',
      'Invoquer le précédent : 2022',
      'Fermer par une proposition concrète et une question',
    ],
    planEn: [
      'Open with the number that hurts: the euro loss per 100bp',
      'Relate the risk to the fund\'s mandate and horizon',
      'Invoke the precedent: 2022',
      'Close with a concrete proposal and a question',
    ],
    pointsAttendus: [
      'Parler en euros, pas en concepts : duration modifiée 8 sur 500 M€ → +100 pb = −8 %, soit −40 M€',
      'Comparer au portage : le surcroît de rendement du long ne couvre que quelques dizaines de pb de hausse par an — l\'asymétrie est défavorable',
      "Rapporter au passif et à l'horizon : une duration très supérieure à l'horizon des porteurs n'est plus de la gestion, c'est un pari directionnel",
      'Le précédent concret : 2022 — les fonds obligataires longs ont perdu 15 % et plus ; le scénario n\'est pas théorique',
      'Conclure par l\'action : vendre des futures ramène le DV01 à la cible immédiatement, à coût faible et réversible — puis poser la question qui force la décision',
    ],
    pointsAttendusEn: [
      'Speak in euros, not concepts: modified duration 8 on €500m → +100bp = −8%, i.e. −€40m',
      'Compare with carry: the extra yield of the long end only covers a few dozen bp of rise per year — the asymmetry is unfavourable',
      "Relate to liabilities and horizon: a duration far above the holders' horizon is no longer management, it is a directional bet",
      'The concrete precedent: 2022 — long bond funds lost 15% and more; the scenario is not theoretical',
      'Close with the action: selling futures brings the DV01 back to target immediately, cheaply and reversibly — then ask the question that forces a decision',
    ],
    bonus: [
      'Structurer la minute en trois phrases-chiffres : la perte potentielle, le point mort de portage, le coût de la couverture',
      "Le test de renversement : « si le fonds était en cash aujourd'hui, achèteriez-vous cette duration ? »",
      "Anticiper l'objection « et si les taux baissent ? » : la couverture se déboucle en un ordre — l'optionalité est asymétrique",
    ],
    bonusEn: [
      'Structure the minute as three number-sentences: the potential loss, the carry break-even, the cost of the hedge',
      "The reversal test: 'if the fund were in cash today, would you buy this duration?'",
      "Pre-empt the objection 'what if rates fall?': the hedge unwinds in one order — the optionality is asymmetric",
    ],
    reponseModele: `Voici ma minute, montre en main.

« Votre fonds porte une duration modifiée de 8 pour 500 M€ d'encours. Concrètement : si les taux montent de 100 points de base, vous perdez 8 %, soit **40 millions d'euros**. Pas dans un scénario extrême — 100 pb, c'est un trimestre ordinaire de 2022, l'année où les fonds longs ont perdu 15 % et plus.

Que gagnez-vous en échange ? Le surcroît de rendement du long sur le court se compte aujourd'hui en quelques dizaines de points de base par an. Votre point mort est donc minuscule : il suffit d'une hausse de 30 à 40 pb dans l'année pour effacer tout l'avantage de portage. L'asymétrie est contre vous.

Et surtout : vos porteurs ont un horizon de trois à quatre ans. Une duration de 8, c'est le double — l'écart n'est plus de la gestion, c'est un pari directionnel sur la baisse des taux, que votre mandat n'affiche nulle part.

Ma proposition tient en un ordre : vendre des futures pour ramener le DV01 de 400 000 € à 200 000 € par pb. Coût : quelques points de base. Réversible du jour au lendemain si votre vue change. La vraie question n'est donc pas "pourquoi couvrir ?" mais : **si le fonds était en cash aujourd'hui, achèteriez-vous cette duration ?** »

Et si le jury objecte « et si les taux baissent ? » : je gagne encore sur la moitié non couverte, et je débouche en un ordre. L'optionalité est asymétrique — c'est précisément l'argument.`,
    reponseModeleEn: `Here is my minute, stopwatch running.

'Your fund carries a modified duration of 8 on €500m of assets. Concretely: if rates rise 100 basis points, you lose 8% — **40 million euros**. Not in an extreme scenario — 100bp was an ordinary quarter in 2022, the year long bond funds lost 15% and more.

What do you earn in exchange? The extra yield of the long end over the short end is currently worth a few dozen basis points a year. Your break-even is therefore tiny: a 30 to 40bp rise within the year wipes out the entire carry advantage. The asymmetry is against you.

Above all: your investors have a three-to-four-year horizon. A duration of 8 is double that — the gap is no longer management, it is a directional bet on falling rates, one your mandate discloses nowhere.

My proposal fits in one order: sell futures to bring the DV01 from €400,000 down to €200,000 per basis point. Cost: a few basis points. Reversible overnight if your view changes. So the real question is not "why hedge?" but: **if the fund were in cash today, would you buy this duration?**'

And if the panel objects 'what if rates fall?': I still gain on the unhedged half, and I unwind in a single order. The optionality is asymmetric — that is precisely the point.`,
  },
];
