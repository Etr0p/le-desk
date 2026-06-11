import type { JuryQuestion } from '../../../engine/types';

const M2 = '02-methodes-quantitatives';

export const jury: JuryQuestion[] = [
  {
    id: 'm2-jury-01',
    moduleId: M2,
    theme: 'valeur temps',
    themeEn: 'time value of money',
    difficulte: 1,
    question: "Pourquoi 100 € aujourd'hui ne valent-ils pas 100 € demain ?",
    questionEn: 'Why is €100 today not worth €100 tomorrow?',
    plan: [
      "Poser le principe : un euro aujourd'hui vaut plus qu'un euro demain",
      "La raison centrale : le coût d'opportunité du placement",
      'Les deux outils : capitalisation et actualisation',
      'Élargir : toute la finance est un transport de flux dans le temps',
    ],
    planEn: [
      'State the principle: a euro today is worth more than a euro tomorrow',
      'The core reason: the opportunity cost of investing',
      'The two tools: compounding and discounting',
      'Broaden out: all of finance is moving cash flows through time',
    ],
    pointsAttendus: [
      "Le cœur de l'argument : 100 € reçus aujourd'hui peuvent être placés au taux r — demain, ils vaudront plus de 100 €",
      'Capitalisation : VF = VA × (1+r)^n transporte une somme vers le futur ; actualisation : VA = VF/(1+r)^n fait le trajet inverse',
      "Chiffrer : à 5 %, 100 € d'aujourd'hui valent 105 € dans un an, et 100 € promis dans un an ne valent que 95,24 € aujourd'hui",
      "L'actualisation rogne d'autant plus que le flux est lointain : dans une perpétuité, le flux de l'année 100 ne pèse presque plus rien",
      "Conclure sur la portée : prix d'une obligation, VAN d'un projet, valorisation d'une action — tout est somme de flux actualisés",
    ],
    pointsAttendusEn: [
      'The heart of the argument: €100 received today can be invested at rate r — tomorrow it will be worth more than €100',
      'Compounding: FV = PV × (1+r)^n carries a sum into the future; discounting: PV = FV/(1+r)^n makes the return trip',
      'Put numbers on it: at 5%, €100 today is worth €105 in a year, and €100 promised in a year is worth only €95.24 today',
      'Discounting bites harder the further out the flow: in a perpetuity, the year-100 payment weighs almost nothing',
      "Close on the scope: a bond's price, a project's NPV, an equity valuation — everything is a sum of discounted cash flows",
    ],
    bonus: [
      "Glisser l'additivité des valeurs actuelles : la valeur d'une série de flux est la somme des valeurs actuelles de chaque flux — la brique de tout le pricing",
      'Le chiffre qui frappe : 50 € par an pour toujours ne valent que 1 250 € à 4 % — une somme infinie de flux a une valeur finie, parce que les flux lointains ne pèsent presque rien',
    ],
    bonusEn: [
      'Slip in the additivity of present values: the value of a stream is the sum of the present values of each flow — the building block of all pricing',
      'The striking number: €50 a year forever is worth only €1,250 at 4% — an infinite sum of flows has a finite value, because distant flows weigh almost nothing',
    ],
    reponseModele: `La réponse tient en une ligne : 100 € reçus aujourd'hui peuvent être placés ; 100 € promis pour demain, pas encore. Si le taux est de 5 %, les 100 € d'aujourd'hui deviennent 105 € dans un an : ils valent donc **plus** que les 100 € de demain. Même sans inflation et sans risque, la simple existence d'un placement rémunéré suffit à créer l'écart — c'est un coût d'opportunité.

Deux outils en découlent, qui sont les deux sens du même trajet. La capitalisation transporte vers le futur : $VF = VA \\times (1+r)^n$. L'actualisation ramène vers aujourd'hui : $VA = VF/(1+r)^n$. À 5 %, 100 € dans un an ne valent que 95,24 € d'aujourd'hui — et plus le flux est lointain, plus il est rogné. C'est ce qui explique un résultat presque magique : une promesse **infinie** — 50 € par an pour toujours — a un prix **fini**, 1 250 € avec des taux à 4 %, parce que le flux de l'année 100 ne pèse presque plus rien une fois actualisé.

Le troisième ingrédient, décisif, est l'additivité : la valeur d'une série de flux est la somme des valeurs actuelles de chaque flux pris isolément. C'est la mécanique de base de toute la finance : le prix d'une obligation, la VAN d'un projet, la valorisation d'une action ne sont rien d'autre que des flux futurs ramenés, un par un, en euros d'aujourd'hui — la seule unité dans laquelle on puisse les comparer.`,
    reponseModeleEn: `The answer fits in one line: €100 received today can be invested; €100 promised for tomorrow cannot — not yet. If rates are at 5%, today's €100 becomes €105 in a year: it is therefore worth **more** than tomorrow's €100. Even with no inflation and no risk, the mere existence of an interest-bearing investment creates the gap — it is an opportunity cost.

Two tools follow, which are the two directions of the same journey. Compounding carries money into the future: $FV = PV \\times (1+r)^n$. Discounting brings it back to today: $PV = FV/(1+r)^n$. At 5%, €100 due in one year is worth only €95.24 today — and the further out the flow, the harder discounting bites. That explains an almost magical result: an **infinite** promise — €50 a year forever — has a **finite** price, €1,250 with rates at 4%, because the year-100 payment weighs next to nothing once discounted.

The third ingredient, the decisive one, is additivity: the value of a stream of cash flows is the sum of the present values of each flow taken separately. That is the basic machinery of all of finance: a bond's price, a project's NPV, an equity valuation are nothing but future flows brought back, one by one, into today's euros — the only unit in which they can be compared.`,
  },
  {
    id: 'm2-jury-02',
    moduleId: M2,
    theme: 'valeur temps',
    themeEn: 'time value of money',
    difficulte: 2,
    question: "VAN ou TRI : si vous ne deviez garder qu'un critère, lequel — et pourquoi ?",
    questionEn: 'NPV or IRR: if you could keep only one criterion, which one — and why?',
    plan: [
      'Définir les deux : la VAN en euros, le TRI en pourcentage',
      "Montrer qu'ils concluent pareil sur un projet simple",
      'Énumérer les cas où le TRI déraille',
      'Trancher : en cas de conflit, la VAN décide',
    ],
    planEn: [
      'Define both: NPV in euros, IRR as a percentage',
      'Show they agree on a simple project',
      'List the cases where IRR breaks down',
      'Settle it: when they conflict, NPV decides',
    ],
    pointsAttendus: [
      'VAN = −I₀ + Σ Ft/(1+r)^t, actualisée au coût du capital : positive on accepte, négative on refuse',
      'TRI = le taux qui annule la VAN ; il se compare au coût du capital, jamais à zéro',
      'Piège 1 — flux non conventionnels : plusieurs changements de signe peuvent donner plusieurs TRI, ou aucun',
      'Piège 2 — comparaison de projets : un pourcentage est aveugle à la taille — 50 % sur 100 € créent moins de valeur que 15 % sur 100 000 €',
      'Piège 3 — le TRI suppose implicitement le réinvestissement des flux intermédiaires au TRI lui-même, hypothèse optimiste pour les projets à TRI élevé',
      "La règle : en cas de conflit, la VAN tranche, parce qu'elle mesure la création de valeur en euros",
    ],
    pointsAttendusEn: [
      'NPV = −I₀ + Σ Ft/(1+r)^t, discounted at the cost of capital: positive you accept, negative you reject',
      'IRR = the rate that sets NPV to zero; it is compared to the cost of capital, never to zero',
      'Trap 1 — non-conventional flows: several sign changes can produce several IRRs, or none',
      'Trap 2 — comparing projects: a percentage is blind to scale — 50% on €100 creates less value than 15% on €100,000',
      'Trap 3 — IRR implicitly assumes intermediate flows are reinvested at the IRR itself, an optimistic assumption for high-IRR projects',
      'The rule: when they conflict, NPV decides, because it measures value creation in euros',
    ],
    bonus: [
      "L'exemple chiffré de tête : 1 000 € investis, 400 € par an pendant 3 ans, coût du capital 10 % → VAN = −5,26 €, TRI = 9,70 % : les deux disent « refus », chacun dans sa langue",
      "Le TRI reste précieux pour communiquer : un pourcentage parle plus qu'un montant — l'utiliser comme langage, pas comme critère de décision",
    ],
    bonusEn: [
      'The worked number from memory: €1,000 invested, €400 a year for 3 years, 10% cost of capital → NPV = −€5.26, IRR = 9.70%: both say "reject", each in its own language',
      'IRR remains precious for communication: a percentage speaks louder than an amount — use it as a language, not as the decision criterion',
    ],
    reponseModele: `Je garderais la VAN — mais je veux d'abord rendre justice aux deux. La VAN met tout dans la même unité, des euros d'aujourd'hui : $VAN = -I_0 + \\sum F_t/(1+r)^t$, actualisée au coût du capital. Positive, on accepte ; négative, on refuse. Le TRI répond à la question symétrique : à quel taux le projet bascule-t-il ? C'est le taux qui annule la VAN, et on l'accepte s'il dépasse le coût du capital — jamais s'il dépasse zéro, c'est le contresens classique.

Sur un projet simple, ils concluent pareil. L'exemple du cours : 1 000 € investis, 400 € par an pendant 3 ans, coût du capital 10 % — VAN de −5,26 €, TRI de 9,70 % : refus dans les deux langues, puisque 9,70 % reste sous les 10 % exigés.

Mais le TRI déraille dans trois cas, et les jurys les connaissent. Un : les flux non conventionnels — si le signe change plusieurs fois, investissement puis revenus puis coût de démantèlement, l'équation peut avoir plusieurs TRI ou aucun ; lequel comparer au coût du capital ? Deux : la comparaison de projets — un pourcentage est aveugle à la taille et à la durée, et 50 % sur 100 € créent moins de valeur que 15 % sur 100 000 €. Trois : le TRI suppose implicitement que les flux intermédiaires se réinvestissent au TRI lui-même — hypothèse flatteuse pour les projets à TRI élevé.

D'où la règle : **en cas de conflit, la VAN tranche**, parce qu'elle mesure la création de valeur en euros. Je garde le TRI comme langage — un pourcentage parle —, jamais comme juge.`,
    reponseModeleEn: `I would keep NPV — but let me first do justice to both. NPV puts everything in the same unit, today's euros: $NPV = -I_0 + \\sum F_t/(1+r)^t$, discounted at the cost of capital. Positive, accept; negative, reject. IRR answers the mirror question: at what rate does the project flip? It is the rate that sets NPV to zero, and you accept it if it beats the cost of capital — never if it merely beats zero, which is the classic blunder.

On a simple project they agree. The course example: €1,000 invested, €400 a year for three years, 10% cost of capital — NPV of −€5.26, IRR of 9.70%: rejection in both languages, since 9.70% falls short of the required 10%.

But IRR breaks down in three cases, and examiners know them. One: non-conventional cash flows — if the sign changes more than once, investment then revenues then a final dismantling cost, the equation can have several IRRs or none, and which one do you compare to the cost of capital? Two: comparing projects — a percentage is blind to scale and to horizon, and 50% on €100 creates less value than 15% on €100,000. Three: IRR implicitly assumes intermediate flows are reinvested at the IRR itself — a flattering assumption for high-IRR projects.

Hence the rule: **when they conflict, NPV decides**, because it measures value creation in euros. I keep IRR as a language — a percentage communicates — never as the judge.`,
  },
  {
    id: 'm2-jury-03',
    moduleId: M2,
    theme: 'statistiques',
    themeEn: 'statistics',
    difficulte: 2,
    question: 'Votre client a fait +10 % puis −10 % et croit être « à zéro ». Expliquez-lui moyenne arithmétique et moyenne géométrique.',
    questionEn: 'Your client made +10% then −10% and believes he is "flat". Explain arithmetic versus geometric mean to him.',
    plan: [
      'Partir du cas concret : +10 % puis −10 %, et compter les euros',
      'Deux moyennes, deux questions différentes',
      "Le volatility drag : l'écart vaut environ σ²/2",
      "La règle d'usage : géométrique pour le réalisé, arithmétique pour l'espérance",
    ],
    planEn: [
      'Start from the concrete case: +10% then −10%, and count the euros',
      'Two means, two different questions',
      'Volatility drag: the gap is roughly σ²/2',
      'The usage rule: geometric for realised performance, arithmetic for expectations',
    ],
    pointsAttendus: [
      "+10 % puis −10 % : 100 € → 110 € → 99 €. Moyenne arithmétique 0 %, réalité −1 € — la perte de 10 % s'applique à une base plus haute",
      'La géométrique respecte la composition : √(1,10 × 0,90) − 1 ≈ −0,50 % par an — le taux constant qui aurait produit la même richesse finale',
      "L'arithmétique répond à « combien rapporte une période typique » : c'est la bonne estimation pour UNE période future",
      "Arithmétique ≥ géométrique, toujours, avec égalité seulement si tous les rendements sont identiques ; l'écart vaut environ σ²/2 — le volatility drag",
      "Conséquence client : un fonds peut afficher une « moyenne des rendements » nulle ou positive et avoir perdu de l'argent",
    ],
    pointsAttendusEn: [
      '+10% then −10%: €100 → €110 → €99. Arithmetic mean 0%, reality −€1 — the 10% loss applies to a higher base',
      'The geometric mean respects compounding: √(1.10 × 0.90) − 1 ≈ −0.50% a year — the constant rate that would have produced the same final wealth',
      'The arithmetic mean answers "what does a typical period return": the right estimate for ONE future period',
      'Arithmetic ≥ geometric, always, with equality only if all returns are identical; the gap is roughly σ²/2 — the volatility drag',
      'Client takeaway: a fund can display a zero or positive "average return" and still have lost money',
    ],
    bonus: [
      'La variante brutale : −50 % puis +50 % laissent à 75 € — il faut +100 % pour effacer −50 %',
      "Compléter le trio : la moyenne harmonique, prix moyen d'achat à montants constants — la mécanique du DCA ; et l'ordre arithmétique ≥ géométrique ≥ harmonique",
    ],
    bonusEn: [
      'The brutal variant: −50% then +50% leaves you at €75 — it takes +100% to undo −50%',
      'Complete the trio: the harmonic mean, the average purchase price when investing fixed amounts — the mechanics of DCA; and the ordering arithmetic ≥ geometric ≥ harmonic',
    ],
    reponseModele: `Je commencerais par compter les euros avec lui. Il avait 100 € ; +10 % les portent à 110 € ; les −10 % s'appliquent à **110 €**, pas à 100 — et il termine à 99 €. La perte a détruit 11 € là où le gain n'en avait créé que 10. Il n'est pas à zéro : il a perdu 1 %.

Les deux moyennes répondent en fait à deux questions différentes. La moyenne arithmétique — ici 0 % — répond à « combien rapporte une période typique ? » : c'est la bonne estimation du rendement à attendre sur *une* période future. La moyenne géométrique répond à « quel taux constant, composé année après année, aurait produit la même richesse finale ? » : $\\sqrt{1{,}10 \\times 0{,}90} - 1 \\approx -0{,}50\\,\\%$ par an. C'est elle, et elle seule, qui mesure la performance réellement obtenue sur plusieurs périodes, parce qu'elle respecte la composition des rendements.

L'écart entre les deux n'est pas un accident : l'arithmétique est **toujours** supérieure ou égale à la géométrique, avec égalité seulement si tous les rendements sont identiques, et l'écart vaut environ $\\sigma^2/2$ — il croît avec la volatilité. Les praticiens appellent cela le *volatility drag* : à moyenne arithmétique égale, plus un placement est volatil, plus sa performance composée s'effrite. La version brutale pour marquer les esprits : −50 % puis +50 % laissent à 75 € — il faut +100 % pour effacer −50 %.

La règle que je donnerais au client : pour juger le passé, exiger la moyenne géométrique ; pour estimer l'avenir sur une période, l'arithmétique. Et se méfier de tout document qui affiche « la moyenne des rendements » sans préciser laquelle.`,
    reponseModeleEn: `I would start by counting the euros with him. He had €100; +10% takes it to €110; the −10% then applies to **€110**, not to 100 — and he ends at €99. The loss destroyed €11 where the gain had only created €10. He is not flat: he is down 1%.

The two means actually answer two different questions. The arithmetic mean — 0% here — answers "what does a typical period return?": it is the right estimate of the return to expect over *one* future period. The geometric mean answers "what constant rate, compounded year after year, would have produced the same final wealth?": $\\sqrt{1.10 \\times 0.90} - 1 \\approx -0.50\\,\\%$ a year. It alone measures the performance actually earned over several periods, because it respects the compounding of returns.

The gap between the two is no accident: the arithmetic mean is **always** greater than or equal to the geometric one, with equality only when all returns are identical, and the gap is roughly $\\sigma^2/2$ — it grows with volatility. Practitioners call this the volatility drag: for the same arithmetic mean, the more volatile the investment, the more its compounded performance erodes. The brutal version to drive it home: −50% then +50% leaves you at €75 — it takes +100% to undo −50%.

The rule I would give the client: to judge the past, demand the geometric mean; to estimate the future over one period, the arithmetic one. And distrust any document that quotes "the average return" without saying which one.`,
  },
  {
    id: 'm2-jury-04',
    moduleId: M2,
    theme: 'statistiques',
    themeEn: 'statistics',
    difficulte: 3,
    question: "Dans la variance d'échantillon, pourquoi divise-t-on par n − 1 et non par n ?",
    questionEn: 'In the sample variance, why do we divide by n − 1 rather than n?',
    plan: [
      "Poser le problème : la dispersion est mesurée autour d'une moyenne estimée",
      "L'intuition : x̄ colle à l'échantillon, les écarts sont trop petits",
      "La correction exacte : l'espérance des carrés vaut (n−1)σ²",
      'La lecture en degrés de liberté, et la portée pratique',
    ],
    planEn: [
      'Frame the problem: dispersion is measured around an estimated mean',
      'The intuition: x̄ hugs the sample, so the deviations are too small',
      'The exact correction: the expected sum of squares equals (n−1)σ²',
      'The degrees-of-freedom reading, and the practical impact',
    ],
    pointsAttendus: [
      "x̄ n'est pas μ : c'est la valeur calculée pour coller au mieux à l'échantillon — parmi toutes les constantes c, c'est x̄ qui minimise Σ(xᵢ − c)²",
      'Les écarts mesurés autour de x̄ sont donc systématiquement plus petits que les écarts autour de la vraie moyenne inconnue : diviser par n sous-estimerait la variance',
      "Le calcul exact : E[Σ(xᵢ − x̄)²] = (n−1)σ² — diviser par n−1 rend l'estimateur sans biais",
      "Lecture degrés de liberté : les n écarts à la moyenne somment à zéro par construction, le dernier se déduit des n−1 autres — il n'y a que n−1 informations indépendantes sur la dispersion",
      "Portée pratique : négligeable sur 252 observations (facteur 252/251), décisif sur 5 ; et on ne divise par n que si l'on observe la population entière, cas rarissime en finance",
    ],
    pointsAttendusEn: [
      'x̄ is not μ: it is computed to fit the sample as closely as possible — among all constants c, x̄ is the one minimising Σ(xᵢ − c)²',
      'Deviations measured around x̄ are therefore systematically smaller than deviations around the true, unknown mean: dividing by n would understate the variance',
      'The exact computation: E[Σ(xᵢ − x̄)²] = (n−1)σ² — dividing by n−1 makes the estimator unbiased',
      'Degrees-of-freedom reading: the n deviations from the mean sum to zero by construction, the last one follows from the other n−1 — only n−1 independent pieces of information about dispersion',
      'Practical impact: negligible on 252 observations (a 252/251 factor), decisive on 5; and you only divide by n when you observe the entire population, vanishingly rare in finance',
    ],
    bonus: [
      "La phrase d'oral qui suffit : « parce que la moyenne est elle-même estimée sur les mêmes données, ce qui sous-estime les écarts »",
      "Le terme manquant est exactement la variance de la moyenne d'échantillon, σ²/n — le même objet qui devient l'erreur standard au chapitre échantillonnage",
    ],
    bonusEn: [
      'The one-line oral answer that suffices: "because the mean is itself estimated on the same data, which understates the deviations"',
      'The missing term is exactly the variance of the sample mean, σ²/n — the very object that becomes the standard error in the sampling chapter',
    ],
    reponseModele: `Le point de départ : $\\bar{x}$ n'est pas la vraie moyenne $\\mu$. C'est une valeur calculée sur l'échantillon — et pas n'importe laquelle : parmi toutes les constantes $c$, c'est précisément $\\bar{x}$ qui minimise $\\sum (x_i - c)^2$. Elle colle au mieux aux données, par construction.

Conséquence mécanique : les écarts mesurés autour de $\\bar{x}$ sont systématiquement **plus petits** que les écarts autour de la vraie moyenne, inconnue. Si je divisais par $n$, je sous-estimerais la variance — un biais systématique, pas un aléa. De combien ? Le calcul exact donne $E[\\sum (x_i - \\bar{x})^2] = (n-1)\\,\\sigma^2$ : le terme manquant est exactement la variance de la moyenne d'échantillon, $\\sigma^2/n$, comptée $n$ fois. Diviser par $n-1$ rend donc l'estimateur sans biais — ce n'est pas une convention, c'est une correction calculée.

Il existe une seconde lecture, dite des degrés de liberté, que j'aime donner à l'oral : les $n$ écarts à la moyenne ne sont pas libres — ils somment à zéro par construction, le dernier se déduit des $n-1$ autres. Il n'y a que $n-1$ informations indépendantes sur la dispersion.

En pratique, l'effet est négligeable sur 252 observations — un facteur 252/251 — mais décisif sur 5. Et on ne divise par $n$ que si l'on observe la population entière, cas rarissime en finance, où la « population » est un processus dont on ne voit jamais qu'un tirage. Si le jury veut la version courte : parce que la moyenne est elle-même estimée sur les mêmes données, ce qui sous-estime les écarts.`,
    reponseModeleEn: `The starting point: $\\bar{x}$ is not the true mean $\\mu$. It is a value computed from the sample — and not just any value: among all constants $c$, it is precisely $\\bar{x}$ that minimises $\\sum (x_i - c)^2$. It hugs the data by construction.

The mechanical consequence: deviations measured around $\\bar{x}$ are systematically **smaller** than deviations around the true, unknown mean. If I divided by $n$, I would understate the variance — a systematic bias, not noise. By how much? The exact computation gives $E[\\sum (x_i - \\bar{x})^2] = (n-1)\\,\\sigma^2$: the missing piece is exactly the variance of the sample mean, $\\sigma^2/n$, counted $n$ times. Dividing by $n-1$ therefore makes the estimator unbiased — not a convention, a computed correction.

There is a second reading, the degrees-of-freedom one, which I like to give in interviews: the $n$ deviations from the mean are not free — they sum to zero by construction, so the last one follows from the other $n-1$. There are only $n-1$ independent pieces of information about dispersion.

In practice the effect is negligible on 252 observations — a 252/251 factor — but decisive on 5. And you only divide by $n$ if you observe the whole population, which is vanishingly rare in finance, where the "population" is a process of which you only ever see one draw. If the panel wants the short version: because the mean is itself estimated on the same data, which understates the deviations.`,
  },
  {
    id: 'm2-jury-05',
    moduleId: M2,
    theme: 'statistiques',
    themeEn: 'statistics',
    difficulte: 2,
    question: "« En crise, toutes les corrélations montent à 1. » Vrai, faux — et qu'est-ce que ça change pour un portefeuille ?",
    questionEn: '"In a crisis, all correlations go to 1." True, false — and what does it change for a portfolio?',
    plan: [
      "Rappeler ce qu'est une corrélation estimée : un paramètre d'échantillon, pas une constante physique",
      'Le mécanisme de crise : ventes forcées et facteur commun',
      "L'épisode 2008, et la nuance : régularité empirique, pas loi exacte",
      "La conséquence : la diversification s'évapore quand on en a besoin",
    ],
    planEn: [
      'Recall what an estimated correlation is: a sample parameter, not a physical constant',
      'The crisis mechanism: forced selling and a common factor',
      'The 2008 episode, and the nuance: an empirical regularity, not an exact law',
      'The consequence: diversification evaporates exactly when you need it',
    ],
    pointsAttendus: [
      'Les corrélations sont estimées sur des données historiques, le plus souvent par temps calme : rien ne garantit leur stabilité',
      'En stress, tout le monde vend en même temps : ventes forcées et fuite vers le cash créent un facteur commun qui pousse les corrélations vers 1',
      '2008 : des actifs réputés décorrélés ont plongé de concert',
      "Nuance : ce n'est pas une loi exacte — les corrélations ne valent pas littéralement 1 —, c'est une régularité empirique majeure",
      "Conséquence : la diversification fondée sur des corrélations historiques disparaît précisément au moment où l'on en a le plus besoin",
      "Lien méthodologique : c'est aussi un problème d'extrapolation — un paramètre mesuré sur des variations de ±4 % ne dit rien d'un krach à −20 %",
    ],
    pointsAttendusEn: [
      'Correlations are estimated on historical data, mostly from calm periods: nothing guarantees their stability',
      'Under stress, everyone sells at once: forced selling and the flight to cash create a common factor that pushes correlations towards 1',
      '2008: assets reputed to be uncorrelated plunged together',
      'Nuance: it is not an exact law — correlations do not literally hit 1 — but a major empirical regularity',
      'Consequence: diversification built on historical correlations disappears precisely when it is needed most',
      'Methodological link: it is also an extrapolation problem — a parameter measured on ±4% moves says nothing about a −20% crash',
    ],
    bonus: [
      'Le réflexe professionnel : compléter les corrélations par des stress tests et des scénarios historiques, qui ne supposent aucune stabilité des paramètres',
    ],
    bonusEn: [
      'The professional reflex: complement correlations with stress tests and historical scenarios, which assume no parameter stability at all',
    ],
    reponseModele: `La phrase est une hyperbole — mais une hyperbole qui dit quelque chose de profondément vrai, et je la déplierais en trois temps.

D'abord, ce qu'est une corrélation : un paramètre **estimé** sur des données historiques, le plus souvent par temps calme. Ce n'est pas une constante physique. Rien, absolument rien, ne garantit que le 0,3 mesuré sur les cinq dernières années tiendra le jour où il devra servir.

Ensuite, le mécanisme. En période de stress, tout le monde vend en même temps : appels de marge, ventes forcées, fuite vers le cash. Ce comportement collectif crée un facteur commun qui écrase les spécificités de chaque actif — et les corrélations s'envolent. En 2008, des actifs réputés décorrélés ont plongé de concert. La nuance que je tiens à faire : les corrélations ne montent pas *exactement* à 1 — ce n'est pas une loi, c'est une régularité empirique majeure. Et c'est aussi, au fond, un problème d'extrapolation : un paramètre mesuré sur des variations ordinaires ne dit rien d'un krach, exactement comme une droite de régression n'existe que sur la plage du nuage de points.

Enfin, la conséquence pour un portefeuille, et elle est brutale : la diversification fondée sur des corrélations historiques s'évapore précisément au moment où l'on en a le plus besoin. Le portefeuille « diversifié » se découvre concentré le jour du stress. D'où le réflexe professionnel : ne jamais s'en remettre aux seules corrélations, et compléter par des stress tests et des scénarios historiques — qui, eux, ne supposent aucune stabilité des paramètres.`,
    reponseModeleEn: `The sentence is hyperbole — but hyperbole that captures something deeply true, and I would unpack it in three steps.

First, what a correlation is: a parameter **estimated** on historical data, mostly from calm periods. It is not a physical constant. Nothing, absolutely nothing, guarantees that the 0.3 measured over the past five years will hold on the day it is actually needed.

Second, the mechanism. Under stress, everyone sells at the same time: margin calls, forced liquidations, the flight to cash. That collective behaviour creates a common factor that crushes each asset's specific story — and correlations spike. In 2008, assets reputed to be uncorrelated plunged together. The nuance I would insist on: correlations do not go *exactly* to 1 — it is not a law, it is a major empirical regularity. And at bottom it is also an extrapolation problem: a parameter measured on ordinary moves says nothing about a crash, exactly as a regression line only exists over the range of the cloud of points.

Finally, the consequence for a portfolio, and it is brutal: diversification built on historical correlations evaporates precisely when it is needed most. The "diversified" portfolio discovers it is concentrated on the day of the stress. Hence the professional reflex: never rely on correlations alone, and complement them with stress tests and historical scenarios — which assume no parameter stability whatsoever.`,
  },
  {
    id: 'm2-jury-06',
    moduleId: M2,
    theme: 'statistiques',
    themeEn: 'statistics',
    difficulte: 3,
    question: "Une stratégie affiche une skewness nettement négative. Qu'est-ce que cela cache ?",
    questionEn: 'A strategy shows clearly negative skewness. What is it hiding?',
    plan: [
      'Définir : le signe de la skewness se lit du côté de la queue longue',
      'Le profil type : beaucoup de petits gains, de rares pertes massives',
      "L'exemple canonique : la vente d'options",
      'La conséquence : moyenne et variance ne suffisent plus',
    ],
    planEn: [
      'Define it: the sign of skewness is read on the side of the long tail',
      'The typical profile: many small gains, rare massive losses',
      'The canonical example: option selling',
      'The consequence: mean and variance are no longer enough',
    ],
    pointsAttendus: [
      'Skewness négative = queue gauche étirée : des gains fréquents et réguliers, des pertes rares mais sévères',
      "Signature des stratégies vendeuses d'options : encaisser des primes, payer rarement mais très cher — « ramasser des pièces devant un rouleau compresseur »",
      "Le piège de lecture : la stratégie « gagne presque tout le temps » — le signe se lit du côté de la queue longue, pas du côté où elle gagne le plus souvent",
      "S'accompagne en général d'un kurtosis supérieur à 3 : les événements extrêmes sont plus fréquents que sous la normale",
      'Conséquence : deux stratégies de même μ et même σ peuvent cacher des risques radicalement différents — exiger les quatre moments',
    ],
    pointsAttendusEn: [
      'Negative skewness = a stretched left tail: frequent, steady gains and rare but severe losses',
      'The signature of option-selling strategies: collecting premiums, paying out rarely but dearly — "picking up pennies in front of a steamroller"',
      'The reading trap: the strategy "wins almost all the time" — the sign is read on the long-tail side, not on the side where it wins most often',
      'It usually comes with kurtosis above 3: extreme events are more frequent than under the normal',
      'Consequence: two strategies with the same μ and the same σ can hide radically different risks — demand all four moments',
    ],
    bonus: [
      "La lecture type d'un profil : « 8 % de moyenne, 12 % de vol, skew −0,8, kurtosis 6 » = un vendeur d'assurance, pas un placement tranquille",
      "Le miroir : skewness positive = profil billet de loterie — petites pertes fréquentes contre rares gains énormes, typique de l'achat d'options",
      'Lien backtest : un historique court peut ne contenir AUCUN épisode de la queue gauche — le track record affiché est alors un mirage',
    ],
    bonusEn: [
      'The standard profile read: "8% mean, 12% vol, skew −0.8, kurtosis 6" = an insurance seller, not a quiet investment',
      'The mirror image: positive skewness = a lottery-ticket profile — frequent small losses against rare huge gains, typical of option buying',
      'The backtest link: a short history may contain NO episode from the left tail — the displayed track record is then a mirage',
    ],
    reponseModele: `Une skewness négative signale une queue gauche étirée : la stratégie engrange beaucoup de petits gains réguliers, et subit de rares pertes massives. Ce qu'elle cache, c'est exactement cela : **un risque qui ne s'est peut-être pas encore montré**.

Le piège de lecture est subtil : sur le relevé, la stratégie « gagne presque tout le temps » — on serait tenté d'y voir un profil favorable. Mais le signe de la skewness se lit du côté de la queue **longue**, pas du côté où la stratégie gagne le plus souvent. Le profil type est celui des stratégies vendeuses d'options : encaisser des primes mois après mois, et payer rarement, mais très cher. Les traders le décrivent d'une image : « ramasser des pièces devant un rouleau compresseur ». En général, cette asymétrie s'accompagne d'un kurtosis supérieur à 3 — des extrêmes plus fréquents que sous la normale : la queue est étirée *et* chargée.

La conséquence méthodologique est la vraie réponse à votre question : moyenne et variance ne suffisent plus. Deux stratégies de même μ et même σ peuvent cacher des risques radicalement différents — l'une symétrique et tranquille, l'autre vendeuse d'assurance. La lecture professionnelle exige les quatre moments : « 8 % de moyenne, 12 % de vol, skew −0,8, kurtosis 6 » se traduit en une phrase — des gains réguliers contre une exposition à des pertes rares et sévères.

Et le piège ultime pour qui recrute des stratégies : un historique court peut ne contenir **aucun** épisode de la queue gauche. Le beau track record d'un vendeur d'options est alors un mirage — les pièces se sont bien ramassées, le rouleau compresseur n'est simplement pas encore passé.`,
    reponseModeleEn: `Negative skewness signals a stretched left tail: the strategy banks many small, steady gains and suffers rare, massive losses. What it hides is exactly that: **a risk that may simply not have shown up yet**.

The reading trap is subtle: on the statement, the strategy "wins almost all the time" — you might be tempted to read that as a favourable profile. But the sign of skewness is read on the side of the **long** tail, not on the side where the strategy wins most often. The typical profile is that of option-selling strategies: collecting premiums month after month, and paying out rarely but very dearly. Traders have an image for it: "picking up pennies in front of a steamroller". This asymmetry usually comes with kurtosis above 3 — extremes more frequent than under the normal: the tail is both stretched *and* loaded.

The methodological consequence is the real answer to your question: mean and variance are no longer enough. Two strategies with the same μ and the same σ can hide radically different risks — one symmetric and quiet, the other selling insurance. The professional read demands all four moments: "8% mean, 12% vol, skew −0.8, kurtosis 6" translates into one sentence — steady gains against exposure to rare, severe losses.

And the ultimate trap for anyone hiring strategies: a short history may contain **no** episode from the left tail at all. The option seller's beautiful track record is then a mirage — the pennies were duly collected, the steamroller just has not come through yet.`,
  },
  {
    id: 'm2-jury-07',
    moduleId: M2,
    theme: 'probabilités',
    themeEn: 'probability',
    difficulte: 2,
    question: "Une maladie touche 1 % de la population ; le test la détecte à 99 % mais sonne à tort chez 5 % des personnes saines. Votre test est positif : êtes-vous malade ? Déroulez le raisonnement.",
    questionEn: 'A disease affects 1% of the population; the test detects it 99% of the time but also rings falsely for 5% of healthy people. Your test is positive: are you sick? Walk me through it.',
    plan: [
      'Refuser le réflexe « 99 % » et poser le bon objet : P(malade | positif)',
      "Convertir en effectifs : l'arbre sur 10 000 personnes",
      'Le calcul : 99 vrais positifs contre 495 faux',
      'La leçon : la rareté de la base écrase la fiabilité du test',
    ],
    planEn: [
      'Refuse the "99%" reflex and name the right object: P(sick | positive)',
      'Convert to headcounts: the tree over 10,000 people',
      'The computation: 99 true positives against 495 false ones',
      'The lesson: the rarity of the base overwhelms the reliability of the test',
    ],
    pointsAttendus: [
      "Identifier l'inversion de conditionnement : le « 99 % » est P(positif | malade), la question posée est P(malade | positif)",
      'Penser en effectifs : sur 10 000 personnes, 100 malades → 99 détectés ; 9 900 saines → 495 faux positifs',
      'P(malade | positif) = 99/594 = 1/6 ≈ 16,67 %',
      'Le mécanisme : la maladie est rare — 5 % de faux positifs appliqués à 9 900 personnes noient les 99 vrais positifs',
      "La version formule de Bayes : 0,99 × 0,01/(0,99 × 0,01 + 0,05 × 0,99) = 16,67 % — mais l'arbre en effectifs est plus sûr sous stress",
    ],
    pointsAttendusEn: [
      'Spot the inverted conditioning: the "99%" is P(positive | sick), the question asked is P(sick | positive)',
      'Think in headcounts: out of 10,000 people, 100 sick → 99 detected; 9,900 healthy → 495 false positives',
      'P(sick | positive) = 99/594 = 1/6 ≈ 16.67%',
      'The mechanism: the disease is rare — 5% of false positives applied to 9,900 people drown the 99 true positives',
      "The Bayes-formula version: 0.99 × 0.01/(0.99 × 0.01 + 0.05 × 0.99) = 16.67% — but the headcount tree is safer under stress",
    ],
    bonus: [
      "La version marché : un signal qui détecte 70 % des tendances, avec 20 % de tendances réelles et 30 % de faux déclenchements, n'a raison que 14/38 ≈ 37 % du temps quand il sonne",
      'Nommer le sophisme du procureur : confondre P(indice | innocent) et P(innocent | indice) — des condamnations réelles ont reposé sur cette inversion',
    ],
    bonusEn: [
      'The market version: a signal that catches 70% of trends, with 20% real trends and 30% false triggers, is right only 14/38 ≈ 37% of the time when it fires',
      "Name the prosecutor's fallacy: confusing P(evidence | innocent) with P(innocent | evidence) — real convictions have rested on this inversion",
    ],
    reponseModele: `Le réflexe « je suis malade à 99 % » est exactement le piège : ce 99 % est $P(\\text{positif} \\mid \\text{malade})$ — la question posée est l'inverse, $P(\\text{malade} \\mid \\text{positif})$. Pour retourner le conditionnement proprement, je convertis tout en effectifs.

Prenons 10 000 personnes. La maladie touche 1 % : 100 malades, et le test en détecte 99. Restent 9 900 personnes saines : le test sonne à tort chez 5 % d'entre elles, soit 495 faux positifs. Au total, 594 tests positifs — dont seulement 99 vrais malades :

$P(\\text{malade} \\mid \\text{positif}) = 99/594 = 1/6 \\approx 16{,}67\\,\\%$.

Une chance sur six. Le mécanisme tient en un mot : la maladie est **rare**. Les 5 % de faux positifs s'appliquent à une population immense — 9 900 personnes — et noient les 99 vrais positifs. Un test « fiable à 99 % » appliqué à une base rare produit une foule de fausses alertes. La formule de Bayes donne le même résultat — 0,99 × 0,01 sur 0,0594 — mais l'arbre en effectifs est plus sûr sous stress, et il montre que je comprends le mécanisme au lieu de réciter.

Et la version qui intéresse un desk : remplacez la maladie par « vraie tendance haussière » et le test par un signal d'achat. Un signal qui détecte 70 % des tendances, dans un marché où elles ne représentent que 20 % des configurations, avec 30 % de faux déclenchements, n'a raison que 14 fois sur 38 — environ 37 % — quand il sonne. Le « 70 % » vendu était l'autre sens du conditionnement. Confondre les deux a un nom — le sophisme du procureur — et un coût.`,
    reponseModeleEn: `The reflex "I am 99% sick" is exactly the trap: that 99% is $P(\\text{positive} \\mid \\text{sick})$ — the question asks the reverse, $P(\\text{sick} \\mid \\text{positive})$. To flip the conditioning safely, I convert everything into headcounts.

Take 10,000 people. The disease affects 1%: 100 sick, of whom the test detects 99. That leaves 9,900 healthy people: the test rings falsely for 5% of them, i.e. 495 false positives. In total, 594 positive tests — of which only 99 are genuinely sick:

$P(\\text{sick} \\mid \\text{positive}) = 99/594 = 1/6 \\approx 16.67\\,\\%$.

One chance in six. The mechanism fits in one word: the disease is **rare**. The 5% false-positive rate applies to a huge population — 9,900 people — and drowns the 99 true positives. A "99% reliable" test applied to a rare base produces a crowd of false alarms. Bayes' formula gives the same number — 0.99 × 0.01 over 0.0594 — but the headcount tree is safer under stress, and it shows I understand the mechanism rather than recite a formula.

And the version a desk cares about: replace the disease with "genuine uptrend" and the test with a buy signal. A signal that catches 70% of trends, in a market where trends are only 20% of configurations, with 30% false triggers, is right only 14 times out of 38 — about 37% — when it fires. The "70%" being sold was the other direction of the conditioning. Confusing the two has a name — the prosecutor's fallacy — and a price.`,
  },
  {
    id: 'm2-jury-08',
    moduleId: M2,
    theme: 'probabilités',
    themeEn: 'probability',
    difficulte: 2,
    question: "Monty Hall : trois portes, une voiture, l'animateur ouvre une porte perdante. Changez-vous de porte ? Convainquez-moi.",
    questionEn: 'Monty Hall: three doors, one car, the host opens a losing door. Do you switch? Convince me.',
    plan: [
      "Poser le protocole exactement : l'animateur sait, et ouvre toujours une porte perdante",
      "L'arbre sur les trois positions possibles de la voiture",
      'Le verdict : changer gagne 2 fois sur 3',
      "L'argument qui emporte la décision : les 100 portes",
    ],
    planEn: [
      'Pin down the protocol: the host knows, and always opens a losing door',
      'The tree over the three possible car positions',
      'The verdict: switching wins 2 times out of 3',
      'The argument that closes the deal: the 100 doors',
    ],
    pointsAttendus: [
      "Le protocole est la clé : l'animateur connaît la position de la voiture et ouvre toujours une porte perdante — son geste n'est pas aléatoire",
      "Arbre : voiture derrière votre porte (1/3) → changer perd ; derrière l'une des deux autres (2/3) → l'animateur est forcé d'ouvrir l'unique perdante restante, et changer gagne",
      'Donc changer gagne avec probabilité 2/3, rester 1/3 — le « il reste deux portes, donc 50/50 » est le piège',
      "L'intuition : votre porte initiale garde son 1/3 ; toute la probabilité restante (2/3) se concentre sur la porte que l'animateur s'est soigneusement gardé d'ouvrir",
      'Version 100 portes : vous en choisissez une, il en ouvre 98 perdantes — restez-vous sur votre 1 % initial ?',
    ],
    pointsAttendusEn: [
      'The protocol is the key: the host knows where the car is and always opens a losing door — his move is not random',
      'Tree: car behind your door (1/3) → switching loses; behind one of the other two (2/3) → the host is forced to open the only remaining losing door, and switching wins',
      'So switching wins with probability 2/3, staying 1/3 — "two doors left, so 50/50" is the trap',
      "The intuition: your initial door keeps its 1/3; all the remaining probability (2/3) concentrates on the door the host carefully avoided opening",
      '100-door version: you pick one, he opens 98 losing ones — do you stick with your initial 1%?',
    ],
    bonus: [
      "La phrase qui résume : l'animateur n'ajoute pas du hasard, il injecte de l'information, parce que son geste est contraint par la position de la voiture",
      "La précision qui distingue : si l'animateur ouvrait au hasard (en risquant de révéler la voiture), le conditionnement changerait — tout repose sur le protocole, et le préciser avant de répondre est exactement ce qu'un jury veut voir",
    ],
    bonusEn: [
      'The one-line summary: the host does not add randomness, he injects information, because his move is constrained by where the car is',
      'The distinguishing precision: if the host opened at random (risking revealing the car), the conditioning would change — everything rests on the protocol, and stating it before answering is exactly what a panel wants to see',
    ],
    reponseModele: `Oui, je change — et je veux d'abord verrouiller le protocole, parce que toute la réponse en dépend : l'animateur **sait** où est la voiture et ouvre **toujours** une porte perdante parmi les deux restantes. Son geste n'est pas aléatoire.

L'arbre sur les trois positions possibles de la voiture, équiprobables à 1/3. Cas 1 : la voiture est derrière ma porte (probabilité 1/3) — l'animateur ouvre l'une ou l'autre des deux perdantes, et changer me fait perdre. Cas 2 : la voiture est derrière la deuxième porte (1/3) — l'animateur est **forcé** d'ouvrir la troisième, et changer me fait gagner. Cas 3 : symétrique (1/3) — changer gagne encore. Bilan : changer gagne dans deux branches sur trois, soit **2/3**, contre 1/3 en restant.

Le réflexe « il reste deux portes, donc 50/50 » oublie l'essentiel : les deux portes restantes n'ont pas la même histoire. Ma porte initiale a été choisie au hasard et garde son 1/3 ; la porte restante est la survivante d'un tri opéré par quelqu'un qui connaît la réponse. L'animateur n'ajoute pas du hasard : il **injecte de l'information**, précisément parce que son geste est contraint par la position de la voiture.

Si vous n'êtes pas convaincu, je passe à 100 portes : vous en choisissez une, l'animateur en ouvre 98 perdantes en évitant soigneusement une seule porte. Restez-vous sur votre choix initial, qui avait 1 % de chances — ou basculez-vous sur la porte qu'il s'est gardé d'ouvrir ? Posé ainsi, plus personne n'hésite.`,
    reponseModeleEn: `Yes, I switch — and first I want to lock down the protocol, because the entire answer depends on it: the host **knows** where the car is and **always** opens a losing door among the two remaining. His move is not random.

The tree over the three possible car positions, each with probability 1/3. Case 1: the car is behind my door (1/3) — the host opens either of the two losing doors, and switching loses. Case 2: the car is behind the second door (1/3) — the host is **forced** to open the third, and switching wins. Case 3: symmetric (1/3) — switching wins again. Tally: switching wins in two branches out of three, i.e. **2/3**, against 1/3 for staying.

The reflex "two doors left, so 50/50" misses the essential point: the two remaining doors do not have the same history. My initial door was picked at random and keeps its 1/3; the remaining door is the survivor of a filtering performed by someone who knows the answer. The host does not add randomness: he **injects information**, precisely because his move is constrained by where the car is.

If you are still not convinced, I scale up to 100 doors: you pick one, the host opens 98 losing doors while carefully sparing a single one. Do you stick with your initial pick, which had a 1% chance — or do you jump to the one door he refused to open? Put that way, nobody hesitates.`,
  },
  {
    id: 'm2-jury-09',
    moduleId: M2,
    theme: 'probabilités',
    themeEn: 'probability',
    difficulte: 3,
    question: 'Indépendance et corrélation nulle : est-ce la même chose ?',
    questionEn: 'Independence and zero correlation: are they the same thing?',
    plan: [
      'Les deux définitions, côte à côte',
      'Le sens qui marche : indépendance ⇒ corrélation nulle',
      'Le contre-exemple : dépendance parfaite, corrélation nulle',
      'La traduction finance : les dépendances non linéaires',
    ],
    planEn: [
      'The two definitions, side by side',
      'The direction that holds: independence ⇒ zero correlation',
      'The counterexample: perfect dependence, zero correlation',
      'The finance translation: nonlinear dependencies',
    ],
    pointsAttendus: [
      "Indépendance : P(A ∩ B) = P(A) × P(B) — connaître l'un ne change rien à la loi de l'autre ; c'est une exigence sur TOUTE la relation",
      'Corrélation nulle : absence de liaison LINÉAIRE seulement — ρ ne capte que les liaisons linéaires',
      'Indépendance ⇒ corrélation nulle, mais la réciproque est fausse',
      'Contre-exemple : X symétrique autour de 0 et Y = X² — Y est entièrement déterminé par X, et pourtant la corrélation est nulle, car la relation est en U, pas en droite',
      'Finance : des rendements peuvent être non corrélés dans le temps tout en restant dépendants — leurs amplitudes se regroupent en paquets de volatilité',
      'Ne pas confondre non plus indépendant et incompatible : deux événements incompatibles sont très dépendants — savoir que l\'un a eu lieu garantit que l\'autre non',
    ],
    pointsAttendusEn: [
      'Independence: P(A ∩ B) = P(A) × P(B) — knowing one changes nothing about the law of the other; it is a requirement on the WHOLE relationship',
      'Zero correlation: absence of LINEAR association only — ρ only captures linear links',
      'Independence ⇒ zero correlation, but the converse is false',
      'Counterexample: X symmetric around 0 and Y = X² — Y is fully determined by X, yet the correlation is zero, because the relationship is U-shaped, not a line',
      'Finance: returns can be uncorrelated over time while remaining dependent — their magnitudes cluster into volatility bursts',
      'Do not confuse independent with mutually exclusive either: two incompatible events are highly dependent — knowing one happened guarantees the other did not',
    ],
    bonus: [
      'La conséquence desk : construire une couverture sur un ρ historique nul ne protège pas des dépendances non linéaires — précisément celles qui se réveillent en crise',
    ],
    bonusEn: [
      'The desk consequence: building a hedge on a historical ρ of zero does not protect against nonlinear dependencies — precisely the ones that wake up in a crisis',
    ],
    reponseModele: `Non — et le sens de l'implication est exactement ce que je veux préciser. L'indépendance est la notion forte : $P(A \\cap B) = P(A) \\times P(B)$, autrement dit connaître l'un ne change strictement rien à la loi de l'autre. C'est une exigence sur **toute** la relation, sous tous ses angles. La corrélation nulle est une notion bien plus faible : elle dit seulement qu'il n'y a pas de liaison **linéaire** — car $\\rho$ ne capte que les liaisons linéaires, c'est sa définition même.

L'implication marche dans un seul sens : indépendance ⇒ corrélation nulle. La réciproque est fausse, et le contre-exemple canonique tient en une ligne : prenez $X$ symétrique autour de zéro et $Y = X^2$. $Y$ est *entièrement déterminé* par $X$ — difficile d'être plus dépendant — et pourtant leur corrélation est nulle : la relation est en U, et une droite ajustée sur un U est plate. La corrélation regarde le nuage avec des lunettes linéaires ; tout ce qui est courbe lui échappe.

La traduction finance est directe. Des rendements peuvent être à peu près non corrélés d'une période à l'autre tout en étant très dépendants : leurs **amplitudes** se regroupent en paquets de volatilité — les journées agitées appellent des journées agitées. Et j'ajoute la confusion sœur, qu'on entend souvent : indépendant ne veut pas dire incompatible. Deux événements incompatibles sont au contraire violemment dépendants — savoir que l'un s'est produit garantit que l'autre non.

La morale pour un desk : un $\\rho$ historique nul n'autorise pas à dormir tranquille. Les dépendances non linéaires existent, et ce sont précisément elles qui se réveillent en crise.`,
    reponseModeleEn: `No — and the direction of the implication is exactly what I want to pin down. Independence is the strong notion: $P(A \\cap B) = P(A) \\times P(B)$, in other words knowing one changes strictly nothing about the law of the other. It is a requirement on the **whole** relationship, from every angle. Zero correlation is a much weaker notion: it only says there is no **linear** association — because $\\rho$ only captures linear links, by its very definition.

The implication runs one way only: independence ⇒ zero correlation. The converse is false, and the canonical counterexample fits in one line: take $X$ symmetric around zero and $Y = X^2$. $Y$ is *entirely determined* by $X$ — hard to be more dependent — and yet their correlation is zero: the relationship is U-shaped, and a line fitted through a U is flat. Correlation looks at the cloud through linear glasses; anything curved escapes it.

The finance translation is direct. Returns can be roughly uncorrelated from one period to the next while being highly dependent: their **magnitudes** cluster into volatility bursts — wild days call for more wild days. And let me add the sister confusion one often hears: independent does not mean mutually exclusive. Two incompatible events are, on the contrary, violently dependent — knowing one occurred guarantees the other did not.

The moral for a desk: a historical $\\rho$ of zero is no license to sleep soundly. Nonlinear dependencies exist, and they are precisely the ones that wake up in a crisis.`,
  },
  {
    id: 'm2-jury-10',
    moduleId: M2,
    theme: 'distributions',
    themeEn: 'distributions',
    difficulte: 2,
    question: 'Pourquoi modélise-t-on les prix par une lognormale plutôt que par une normale ?',
    questionEn: 'Why do we model prices with a lognormal rather than a normal distribution?',
    plan: [
      'Les deux défauts rédhibitoires de la normale sur les prix',
      'Le passage au logarithme : les produits deviennent des sommes',
      "Le TCL referme l'argument : ln P normal, donc P lognormal",
      "La portée : l'hypothèse de Black-Scholes, et ses limites",
    ],
    planEn: [
      'The two disqualifying flaws of the normal for prices',
      'The move to logarithms: products become sums',
      'The CLT closes the argument: ln P normal, hence P lognormal',
      'The scope: the Black-Scholes assumption, and its limits',
    ],
    pointsAttendus: [
      "Défaut 1 : une normale s'étend de −∞ à +∞ — probabilité non nulle d'un prix négatif, absurde puisque la responsabilité limitée borne la perte à zéro",
      'Défaut 2 : les rendements se composent — passer de 100 à 110 puis 121, c\'est multiplier, pas additionner ; or on ne sait bien manipuler que les sommes',
      'Le log transforme les produits en sommes : ln(P_T/P_0) = Σ ln(1+r_t)',
      'Le TCL normalise cette somme : ln P_T approximativement normal, donc P_T lognormal par définition',
      'Propriétés héritées : support strictement positif, asymétrie à droite — la moyenne au-dessus du mode, tirée par la queue droite',
      "C'est l'hypothèse de Black-Scholes : des prix lognormaux, c'est-à-dire des log-rendements normaux",
    ],
    pointsAttendusEn: [
      'Flaw 1: a normal stretches from −∞ to +∞ — nonzero probability of a negative price, absurd since limited liability caps the loss at zero',
      'Flaw 2: returns compound — going from 100 to 110 to 121 is multiplying, not adding; and sums are what we know how to handle',
      'The log turns products into sums: ln(P_T/P_0) = Σ ln(1+r_t)',
      'The CLT normalises that sum: ln P_T approximately normal, hence P_T lognormal by definition',
      'Inherited properties: strictly positive support, right-skewed — the mean above the mode, pulled by the right tail',
      'This is the Black-Scholes assumption: lognormal prices, i.e. normal log-returns',
    ],
    bonus: [
      "Les hypothèses cachées à nommer : indépendance des rendements, petitesse des chocs, variance finie — chacune est discutable sur les marchés réels, et c'est par là que les queues épaisses s'invitent",
    ],
    bonusEn: [
      'The hidden assumptions to name: independence of returns, smallness of shocks, finite variance — each is debatable in real markets, and that is exactly where fat tails creep in',
    ],
    reponseModele: `Deux raisons rendent la normale rédhibitoire pour des **prix**. La première est le support : une normale s'étend de moins l'infini à plus l'infini — elle accorderait une probabilité non nulle à un prix d'action négatif, ce qui n'a aucun sens : la responsabilité limitée borne la perte à zéro. La seconde est plus structurelle : les rendements se **composent**. Passer de 100 à 110 puis de 110 à 121, c'est multiplier par 1,10 deux fois, pas additionner. Or tout notre outillage statistique sait manipuler des sommes, pas des produits.

La solution tient dans le logarithme, qui transforme les produits en sommes : $\\ln(P_T/P_0) = \\ln(1+r_1) + \\cdots + \\ln(1+r_T)$. Voilà une somme d'un grand nombre de petites variables à peu près indépendantes — exactement le terrain du théorème central limite, qui la fait tendre vers une normale. Si $\\ln P_T$ est normal, alors $P_T$ est par définition **lognormal**. L'argument est élégant parce que la forme de la loi sort d'un théorème, pas d'un choix arbitraire.

La lognormale hérite des bonnes propriétés : support strictement positif — l'exponentielle ne produit jamais de valeur négative — et asymétrie à droite, la moyenne au-dessus du mode, mécaniquement, parce que l'exponentielle dilate les valeurs hautes et comprime les basses. C'est précisément l'hypothèse de Black-Scholes : des prix lognormaux, c'est-à-dire des log-rendements normaux.

Et pour finir, la lucidité qui complète la réponse : l'argument enchaîne trois hypothèses — indépendance des rendements, petitesse des chocs, variance finie. Chacune est discutable sur les marchés réels, et c'est exactement par ces fissures que les queues épaisses s'invitent.`,
    reponseModeleEn: `Two reasons disqualify the normal for **prices**. The first is the support: a normal stretches from minus to plus infinity — it would grant a nonzero probability to a negative stock price, which is meaningless: limited liability caps the loss at zero. The second is more structural: returns **compound**. Going from 100 to 110 and then from 110 to 121 means multiplying by 1.10 twice, not adding. And our entire statistical toolkit handles sums well, not products.

The solution lies in the logarithm, which turns products into sums: $\\ln(P_T/P_0) = \\ln(1+r_1) + \\cdots + \\ln(1+r_T)$. There you have a sum of a large number of small, roughly independent variables — exactly the territory of the central limit theorem, which drives it towards a normal. If $\\ln P_T$ is normal, then $P_T$ is by definition **lognormal**. The argument is elegant because the shape of the law comes out of a theorem, not an arbitrary choice.

The lognormal inherits the right properties: strictly positive support — an exponential never produces a negative value — and right skewness, the mean above the mode, mechanically, because the exponential stretches high values and compresses low ones. This is precisely the Black-Scholes assumption: lognormal prices, i.e. normal log-returns.

And to finish, the lucidity that completes the answer: the argument chains three assumptions — independence of returns, smallness of shocks, finite variance. Each is debatable in real markets, and it is exactly through those cracks that fat tails creep in.`,
  },
  {
    id: 'm2-jury-11',
    moduleId: M2,
    theme: 'distributions',
    themeEn: 'distributions',
    difficulte: 3,
    question: 'Un risk manager vous parle d\'un « krach à 20 écarts-types ». Que vous dit ce chiffre — sur le marché, ou sur son modèle ?',
    questionEn: 'A risk manager mentions a "20-sigma crash". What does that number tell you — about the market, or about his model?',
    plan: [
      'Le fait : 19 octobre 1987, −22,6 % en une séance',
      'Ce que dit la normale : un événement à ne jamais observer',
      "Le retournement : c'est le modèle qui est réfuté, pas le hasard",
      'La nuance professionnelle : où la normale reste utilisable',
    ],
    planEn: [
      'The fact: 19 October 1987, −22.6% in one session',
      'What the normal says: an event never to be observed',
      'The reversal: it is the model that is refuted, not luck',
      'The professional nuance: where the normal remains usable',
    ],
    pointsAttendus: [
      "Référence : le 19 octobre 1987, le Dow perd 22,6 % en une séance avec une volatilité quotidienne de l'ordre de 1 % — plus de 20 écarts-types",
      "Sous la normale, la probabilité d'un tel mouvement est si infime qu'on ne devrait pas l'observer une seule fois, même en rejouant chaque séance depuis l'âge de l'univers",
      'La bonne lecture : pas une malchance cosmique — le modèle normal sous-estime massivement les queues ; les rendements réels sont leptokurtiques (kurtosis bien supérieur à 3)',
      'Les rappels : 2008, le flash crash de 2010, mars 2020 — les « impossibilités statistiques » se reproduisent',
      "Donc « un événement à 20σ » mesure l'erreur du modèle, pas la rareté de l'événement",
      "Nuance : la normale reste une bonne approximation au centre de la distribution — le péché est d'oublier qu'on l'utilise, surtout dans une VaR gaussienne",
    ],
    pointsAttendusEn: [
      'Reference: on 19 October 1987 the Dow lost 22.6% in one session with daily volatility around 1% — more than 20 standard deviations',
      'Under the normal, the probability of such a move is so infinitesimal that it should never be observed once, even replaying every session since the age of the universe',
      'The correct reading: not cosmic bad luck — the normal model massively understates the tails; real returns are leptokurtic (kurtosis well above 3)',
      'The reminders: 2008, the 2010 flash crash, March 2020 — "statistical impossibilities" keep recurring',
      'So "a 20-sigma event" measures the error of the model, not the rarity of the event',
      'Nuance: the normal remains a good approximation at the centre of the distribution — the sin is forgetting you are using it, above all in a Gaussian VaR',
    ],
    bonus: [
      "La formule à replacer avec sa nuance : « supposer la normalité, c'est le péché originel du risk management » — le péché n'est pas de l'utiliser, c'est d'oublier qu'on l'utilise",
    ],
    bonusEn: [
      'The quote to land with its nuance: "assuming normality is the original sin of risk management" — the sin is not using it, it is forgetting you are using it',
    ],
    reponseModele: `Ce chiffre me parle de son modèle, bien plus que du marché. La référence est le 19 octobre 1987 : le Dow Jones perd 22,6 % en une seule séance, avec une volatilité quotidienne de l'ordre de 1 % à l'époque — plus de **20 écarts-types**. Sous une loi normale, un mouvement pareil a une probabilité si infinitésimale qu'on ne devrait pas l'observer une seule fois, même en rejouant chaque jour de bourse depuis l'âge de l'univers. Il a pourtant eu lieu. Et il n'est pas seul : 2008, le flash crash de 2010, mars 2020 — les « impossibilités statistiques » ont une fâcheuse tendance à se reproduire.

Devant un tel constat, deux lectures s'affrontent. « Le marché a eu une malchance cosmique » — intenable dès la deuxième occurrence. Ou bien : **le modèle normal sous-estime massivement les queues**. C'est la bonne. Les rendements réels sont leptokurtiques — kurtosis bien au-delà du 3 de la gaussienne — avec des baisses violentes plus fréquentes que les hausses équivalentes. Un « événement à 20σ » n'est donc pas une mesure de la rareté de l'événement : c'est une mesure de l'erreur du modèle qui l'a déclaré impossible.

J'ajoute la nuance qui évite de jeter le bébé avec l'eau du bain : la normale reste une excellente approximation au **centre** de la distribution, là où vivent 95 % des journées de marché — c'est pour cela qu'elle survit dans les pricers et les calculs rapides. Le péché n'est pas de l'utiliser, c'est d'**oublier qu'on l'utilise** : une VaR gaussienne à 99 % sous-estime précisément les pertes qu'elle prétend borner. D'où les stress tests, les scénarios historiques et les lois à queues épaisses.`,
    reponseModeleEn: `That number tells me about his model far more than about the market. The reference is 19 October 1987: the Dow Jones lost 22.6% in a single session, with daily volatility around 1% at the time — more than **20 standard deviations**. Under a normal law, such a move has a probability so infinitesimal that it should never be observed once, even replaying every trading day since the age of the universe. Yet it happened. And it is not alone: 2008, the 2010 flash crash, March 2020 — "statistical impossibilities" have an unfortunate habit of recurring.

Faced with that record, two readings compete. "The market suffered cosmic bad luck" — untenable by the second occurrence. Or: **the normal model massively understates the tails**. That is the right one. Real returns are leptokurtic — kurtosis well beyond the Gaussian's 3 — with violent falls more frequent than equivalent rises. A "20-sigma event" is therefore not a measure of the event's rarity: it is a measure of the error of the model that declared it impossible.

Let me add the nuance that keeps the baby in the bathwater: the normal remains an excellent approximation at the **centre** of the distribution, where 95% of market days live — which is why it survives in pricers and quick calculations. The sin is not using it, it is **forgetting you are using it**: a Gaussian 99% VaR understates precisely the losses it claims to bound. Hence stress tests, historical scenarios and fat-tailed laws.`,
  },
  {
    id: 'm2-jury-12',
    moduleId: M2,
    theme: 'distributions',
    themeEn: 'distributions',
    difficulte: 1,
    question: 'La règle 68-95-99,7 : énoncez-la, appliquez-la, et dites où elle trahit en finance.',
    questionEn: 'The 68-95-99.7 rule: state it, apply it, and say where it betrays you in finance.',
    plan: [
      "L'énoncé : trois intervalles, trois masses",
      "L'outil de conversion : le z-score",
      'Une application chiffrée',
      'Les limites : queues épaisses',
    ],
    planEn: [
      'The statement: three intervals, three masses',
      'The conversion tool: the z-score',
      'A worked application',
      'The limits: fat tails',
    ],
    pointsAttendus: [
      'Sous une normale : environ 68,3 % de la masse dans μ ± 1σ, 95,4 % dans μ ± 2σ, 99,7 % dans μ ± 3σ',
      'Le z-score z = (x − μ)/σ compte la distance à la moyenne en écarts-types et ramène tout à la table de la centrée réduite',
      'Application : rendement annuel normal de moyenne 6 % et d\'écart-type 15 % → P(année pire que −9 %) = Φ(−1) = 15,87 %, environ une année sur six',
      "Lecture desk : avec 2 % de vol quotidienne, l'indice bouge de plus de 2 % — dans un sens ou l'autre — environ un jour sur trois",
      'Limite : les rendements réels ont des queues épaisses — la règle sous-estime les extrêmes, exactement là où vit le risque',
    ],
    pointsAttendusEn: [
      'Under a normal: about 68.3% of the mass within μ ± 1σ, 95.4% within μ ± 2σ, 99.7% within μ ± 3σ',
      'The z-score z = (x − μ)/σ counts the distance to the mean in standard deviations and maps everything to the standard normal table',
      'Application: a normal annual return with mean 6% and standard deviation 15% → P(year worse than −9%) = Φ(−1) = 15.87%, about one year in six',
      'Desk reading: with 2% daily vol, the index moves by more than 2% — either way — about one day in three',
      'Limit: real returns have fat tails — the rule understates the extremes, exactly where the risk lives',
    ],
    bonus: [
      'La quatrième valeur fétiche : ±1,96σ contient 95,0 % — le nombre des intervalles de confiance (Φ(1,96) = 0,9750)',
      "Repères de volatilité à connaître : un indice actions calme vit autour de 15 % annualisé ; au-delà de 30 %, le marché est en stress",
    ],
    bonusEn: [
      'The fourth fetish value: ±1.96σ contains 95.0% — the number behind confidence intervals (Φ(1.96) = 0.9750)',
      'Volatility landmarks to know: a calm equity index lives around 15% annualised; above 30%, the market is in stress',
    ],
    reponseModele: `L'énoncé d'abord. Sous une loi normale, environ 68,3 % de la masse tombe entre $\\mu \\pm 1\\sigma$, 95,4 % entre $\\mu \\pm 2\\sigma$, et 99,7 % entre $\\mu \\pm 3\\sigma$. L'outil qui rend la règle opérationnelle est le z-score, $z = (x - \\mu)/\\sigma$ : la distance à la moyenne comptée en écarts-types, qui ramène n'importe quelle normale à la table de la centrée réduite.

L'application, pour montrer que ce n'est pas décoratif. Un indice au rendement annuel supposé normal, moyenne 6 %, écart-type 15 % : quelle probabilité d'une année pire que −9 % ? Le z-score vaut $(-9 - 6)/15 = -1$, donc $\\Phi(-1) = 15{,}87\\,\\%$ — environ une année sur six. Même gymnastique au quotidien : avec 2 % de volatilité quotidienne, l'indice bouge de plus de 2 %, dans un sens ou dans l'autre, environ un jour sur trois — le tiers qui sort de ±1σ. Et j'ajoute la quatrième valeur fétiche, ±1,96σ pour 95,0 % : le nombre des intervalles de confiance.

Où la règle trahit-elle ? Dans les queues. Les rendements réels sont à queues épaisses : les événements extrêmes sont nettement plus fréquents que la cloche ne le prédit — 1987 et ses 20 écarts-types en sont la démonstration brutale. La règle 68-95-99,7 reste fiable au centre de la distribution, là où vivent la plupart des journées ; elle devient dangereusement optimiste sur les extrêmes, c'est-à-dire exactement là où vit le risque. Mon usage : un excellent ordre de grandeur pour le quotidien, jamais un outil de mesure du pire.`,
    reponseModeleEn: `The statement first. Under a normal law, about 68.3% of the mass falls within $\\mu \\pm 1\\sigma$, 95.4% within $\\mu \\pm 2\\sigma$, and 99.7% within $\\mu \\pm 3\\sigma$. The tool that makes the rule operational is the z-score, $z = (x - \\mu)/\\sigma$: the distance to the mean counted in standard deviations, which maps any normal onto the standard table.

The application, to show it is not decorative. An index with a supposedly normal annual return, mean 6%, standard deviation 15%: what is the probability of a year worse than −9%? The z-score is $(-9 - 6)/15 = -1$, so $\\Phi(-1) = 15.87\\,\\%$ — about one year in six. Same gymnastics daily: with 2% daily volatility, the index moves by more than 2%, one way or the other, about one day in three — the third that falls outside ±1σ. And let me add the fourth fetish value, ±1.96σ for 95.0%: the number behind confidence intervals.

Where does the rule betray you? In the tails. Real returns are fat-tailed: extreme events are far more frequent than the bell curve predicts — 1987 and its 20 standard deviations are the brutal demonstration. The 68-95-99.7 rule stays reliable at the centre of the distribution, where most days live; it becomes dangerously optimistic about the extremes, which is exactly where the risk lives. My usage: an excellent order of magnitude for the everyday, never an instrument for measuring the worst case.`,
  },
  {
    id: 'm2-jury-13',
    moduleId: M2,
    theme: 'échantillonnage',
    themeEn: 'sampling',
    difficulte: 2,
    question: "Expliquez le théorème central limite à quelqu'un qui n'a jamais fait de statistiques — puis dites pourquoi c'est LE théorème de la finance.",
    questionEn: 'Explain the central limit theorem to someone who has never studied statistics — then say why it is THE theorem of finance.',
    plan: [
      "L'image : moyenner beaucoup de petits aléas indépendants fabrique toujours une cloche",
      "L'énoncé en clair : forme universelle, vitesse connue",
      'Les conditions, honnêtement, et le contresens à éviter',
      'Pourquoi la finance entière repose dessus',
    ],
    planEn: [
      'The image: averaging many small independent shocks always builds a bell',
      'The plain statement: universal shape, known speed',
      'The conditions, honestly, and the misconception to avoid',
      'Why all of finance rests on it',
    ],
    pointsAttendus: [
      "L'énoncé accessible : quelle que soit la distribution de départ — plate, discrète, asymétrique —, la distribution de la MOYENNE d'échantillon devient une cloche normale centrée sur μ",
      "Le deuxième miracle : la largeur de la cloche est connue, σ/√n — l'erreur standard ; la précision croît comme la racine du nombre d'observations",
      'Les conditions : tirages indépendants de même loi, variance finie ; théorème asymptotique — les distributions difformes exigent plus de n',
      'Le contresens à éviter : le TCL porte sur la moyenne, pas sur les données — les rendements restent à queues épaisses, même avec un million d\'observations',
      'Quatre piliers, un théorème : prix lognormaux (les log-rendements s\'additionnent), pont binomiale → Black-Scholes, intervalles de confiance et tests, convergence de Monte-Carlo',
    ],
    pointsAttendusEn: [
      'The accessible statement: whatever the starting distribution — flat, discrete, skewed — the distribution of the sample MEAN becomes a normal bell centred on μ',
      'The second miracle: the width of the bell is known, σ/√n — the standard error; precision grows like the square root of the number of observations',
      'The conditions: independent draws from the same law, finite variance; an asymptotic theorem — misshapen distributions demand more n',
      'The misconception to avoid: the CLT is about the mean, not the data — returns stay fat-tailed, even with a million observations',
      'Four pillars, one theorem: lognormal prices (log-returns add up), the binomial → Black-Scholes bridge, confidence intervals and tests, Monte Carlo convergence',
    ],
    bonus: [
      "Si la variance est infinie — queues trop épaisses —, le théorème craque : la limite n'est plus normale mais appartient aux lois stables ; les queues épaisses marquent la frontière exacte de son territoire",
    ],
    bonusEn: [
      'If the variance is infinite — tails too fat — the theorem breaks: the limit is no longer normal but belongs to the stable laws; fat tails mark the exact border of its territory',
    ],
    reponseModele: `Sans formule, je dirais ceci : prenez n'importe quel hasard — un dé, une pièce, une distribution toute plate ou violemment tordue — et au lieu de regarder un tirage, regardez la **moyenne** d'un grand nombre de tirages indépendants. Recommencez l'expérience mille fois et tracez l'histogramme de ces moyennes : vous verrez toujours apparaître la même forme, une cloche. La loi de départ n'a pas d'importance : en moyennant, les hasards individuels se compensent, et ce qui survit a une forme universelle — la normale.

Le théorème dit même deux choses, et la seconde vaut de l'or : la cloche est centrée sur la vraie moyenne $\\mu$, et sa largeur est **connue** — $\\sigma/\\sqrt{n}$, l'erreur standard. La précision croît comme la racine du nombre d'observations. Honnêteté oblige : il faut des tirages indépendants de même loi et une variance finie, et c'est un résultat asymptotique — une distribution difforme exige plus de données avant que la cloche n'émerge. Et le contresens à éviter absolument : le TCL porte sur la **moyenne**, pas sur les données. Les rendements quotidiens restent à queues épaisses, même avec un million d'observations.

Pourquoi LE théorème de la finance ? Parce que la finance est saturée de sommes et de moyennes. Les log-rendements s'additionnent : d'où les prix lognormaux. La binomiale convenablement réduite devient normale : d'où le pont entre l'arbre binomial et Black-Scholes. Toute moyenne d'échantillon devient normale : d'où les intervalles de confiance et les tests. Et tout estimateur de simulation est une moyenne : d'où la convergence de Monte-Carlo. Quatre piliers, un seul théorème.`,
    reponseModeleEn: `With no formulas, I would say this: take any randomness you like — a die, a coin, a distribution that is completely flat or violently twisted — and instead of looking at one draw, look at the **average** of a large number of independent draws. Repeat the experiment a thousand times and plot the histogram of those averages: you will always see the same shape emerge, a bell. The starting law does not matter: in averaging, the individual accidents cancel out, and what survives has a universal shape — the normal.

The theorem actually says two things, and the second is worth gold: the bell is centred on the true mean $\\mu$, and its width is **known** — $\\sigma/\\sqrt{n}$, the standard error. Precision grows like the square root of the number of observations. Honesty requires the fine print: you need independent draws from the same law and a finite variance, and it is an asymptotic result — a misshapen distribution needs more data before the bell emerges. And the misconception to kill on sight: the CLT is about the **mean**, not the data. Daily returns stay fat-tailed, even with a million observations.

Why THE theorem of finance? Because finance is saturated with sums and averages. Log-returns add up: hence lognormal prices. The binomial, suitably standardised, becomes normal: hence the bridge from the binomial tree to Black-Scholes. Every sample mean becomes normal: hence confidence intervals and tests. And every simulation estimator is a mean: hence Monte Carlo convergence. Four pillars, one theorem.`,
  },
  {
    id: 'm2-jury-14',
    moduleId: M2,
    theme: 'échantillonnage',
    themeEn: 'sampling',
    difficulte: 3,
    question: 'Votre intervalle de confiance à 95 % est [−0,07 % ; +0,23 %]. Dites-moi ce que signifient ces 95 % — exactement.',
    questionEn: 'Your 95% confidence interval is [−0.07%; +0.23%]. Tell me what that 95% means — exactly.',
    plan: [
      'La phrase naturelle, et pourquoi elle est fausse',
      "Ce qui est aléatoire ici : l'intervalle, pas μ",
      'La formulation correcte : une propriété de la méthode',
      'La lecture économique de cet intervalle précis',
    ],
    planEn: [
      'The natural sentence, and why it is wrong',
      'What is random here: the interval, not μ',
      'The correct formulation: a property of the method',
      'The economic reading of this particular interval',
    ],
    pointsAttendus: [
      'La phrase « il y a 95 % de chances que μ soit dans l\'intervalle » est fausse dans ce cadre : μ est un nombre fixe, inconnu mais figé',
      "L'objet aléatoire est l'intervalle : il dépend de l'échantillon tiré ; une fois calculé, il contient μ ou non — il ne reste qu'une ignorance, pas une probabilité",
      "L'énoncé correct : en répétant l'échantillonnage, 95 % des intervalles construits par cette méthode contiendraient μ — la confiance qualifie la machine à fabriquer des intervalles, pas l'intervalle fabriqué",
      'Construction : x̄ ± 1,96 σ/√n, héritée du TCL et de Φ(1,96) = 0,9750',
      "La lecture qui pique : cet intervalle vient d'un titre à 0,08 % par jour — environ 20 % annualisés — et il contient zéro : un an de données quotidiennes ne prouve même pas que la moyenne est positive",
      'Ne pas confondre avec la dispersion des données : ±1,96σ sans le √n décrit les rendements individuels, pas la moyenne',
    ],
    pointsAttendusEn: [
      'The sentence "there is a 95% chance that μ is in the interval" is wrong in this framework: μ is a fixed number, unknown but frozen',
      'The random object is the interval: it depends on the sample drawn; once computed, it contains μ or it does not — only ignorance remains, not probability',
      'The correct statement: repeating the sampling, 95% of the intervals built by this method would contain μ — the confidence qualifies the interval-making machine, not the interval made',
      'Construction: x̄ ± 1.96 σ/√n, inherited from the CLT and Φ(1.96) = 0.9750',
      'The reading that stings: this interval comes from a stock earning 0.08% a day — about 20% annualised — and it contains zero: a full year of daily data cannot even prove the mean is positive',
      'Do not confuse it with the dispersion of the data: ±1.96σ without the √n describes individual returns, not the mean',
    ],
    bonus: [
      "Le pont avec les tests : μ₀ hors de l'IC à 95 % ⇔ rejet de H₀ au seuil de 5 % bilatéral — même objet, deux langages, et l'IC est souvent le plus honnête des deux",
      "Le contraste à retenir : la volatilité s'estime vite et bien, la moyenne lentement et mal — estimer une moyenne de rendements est l'un des problèmes les plus ingrats de la finance",
    ],
    bonusEn: [
      'The bridge to testing: μ₀ outside the 95% CI ⇔ rejecting H₀ at the 5% two-sided level — same object, two languages, and the CI is often the more honest of the two',
      'The contrast to remember: volatility is estimated quickly and well, the mean slowly and badly — estimating a mean return is one of the most thankless problems in finance',
    ],
    reponseModele: `La phrase qui vient naturellement — « il y a 95 % de chances que μ soit dans l'intervalle » — est précisément celle qui élimine. Dans ce cadre, $\\mu$ n'est pas aléatoire : c'est un nombre fixe, inconnu mais figé. Ce qui est aléatoire, c'est l'**intervalle** : il dépend de l'échantillon tiré, et un autre échantillon aurait donné d'autres bornes. Une fois [−0,07 % ; +0,23 %] calculé, il contient $\\mu$ ou il ne le contient pas — il n'y a plus de probabilité en jeu, seulement une ignorance.

L'énoncé correct porte sur la **méthode** : en répétant l'échantillonnage, 95 % des intervalles construits de cette façon — $\\bar{x} \\pm 1{,}96\\,\\sigma/\\sqrt{n}$, héritage du TCL et de $\\Phi(1{,}96) = 0{,}9750$ — contiendraient $\\mu$. La confiance qualifie la machine à fabriquer des intervalles, pas l'intervalle fabriqué. Faire cette distinction sans qu'on me la demande vaut cher ; la rater après la question coûte tout aussi cher, dans l'autre sens.

Deux précisions pour finir. D'abord, ne pas confondre cet intervalle avec la dispersion des données : ±1,96σ **sans** le √n décrirait les rendements quotidiens individuels — ici, on encadre leur moyenne. Ensuite, la lecture économique, qui pique : cet intervalle vient d'un titre à 0,08 % par jour, environ 20 % annualisés — une performance spectaculaire — et pourtant il **contient zéro**. Une année entière de données quotidiennes ne suffit pas à affirmer que la moyenne est positive : la volatilité quotidienne écrase la moyenne quotidienne. C'est le contraste à retenir : la volatilité s'estime vite et bien, la moyenne lentement et mal.`,
    reponseModeleEn: `The sentence that comes naturally — "there is a 95% chance that μ is in the interval" — is precisely the one that gets you eliminated. In this framework, $\\mu$ is not random: it is a fixed number, unknown but frozen. What is random is the **interval**: it depends on the sample drawn, and another sample would have produced other bounds. Once [−0.07%; +0.23%] is computed, it either contains $\\mu$ or it does not — there is no probability left in play, only ignorance.

The correct statement is about the **method**: repeating the sampling, 95% of the intervals built this way — $\\bar{x} \\pm 1.96\\,\\sigma/\\sqrt{n}$, inherited from the CLT and $\\Phi(1.96) = 0.9750$ — would contain $\\mu$. The confidence qualifies the interval-making machine, not the interval it made. Drawing that distinction unprompted is worth a lot; missing it after the question costs just as much, in the other direction.

Two final precisions. First, do not confuse this interval with the dispersion of the data: ±1.96σ **without** the √n would describe individual daily returns — here we are bracketing their mean. Second, the economic reading, which stings: this interval comes from a stock earning 0.08% a day, roughly 20% annualised — a spectacular performance — and yet it **contains zero**. A full year of daily data is not enough to claim the mean is positive: daily volatility crushes the daily mean. That is the contrast to remember: volatility is estimated quickly and well, the mean slowly and badly.`,
  },
  {
    id: 'm2-jury-15',
    moduleId: M2,
    theme: 'échantillonnage',
    themeEn: 'sampling',
    difficulte: 2,
    question: 'On vous montre un backtest de 6 mois avec une belle moyenne. Fiable ?',
    questionEn: 'You are shown a 6-month backtest with a nice-looking average return. Reliable?',
    plan: [
      'Le réflexe : toute moyenne porte une erreur standard',
      "L'ordre de grandeur : σ/√n sur six mois",
      "L'exemple qui calibre : un an entier ne suffit déjà pas",
      'Le verdict, et ce qu\'il faudrait pour conclure',
    ],
    planEn: [
      'The reflex: every mean carries a standard error',
      'The order of magnitude: σ/√n over six months',
      'The calibrating example: a full year is already not enough',
      'The verdict, and what it would take to conclude',
    ],
    pointsAttendus: [
      "Une moyenne de backtest est une moyenne d'échantillon : elle porte une erreur standard σ/√n — la question est de savoir si la moyenne survit à ses propres barres d'erreur",
      'Calibrage du cours : sur 252 jours, un titre à 0,08 % par jour (≈ 20 % annualisés) avec 1,2 % de vol quotidienne a un IC à 95 % de [−0,07 % ; +0,23 %] — qui contient zéro',
      "Six mois, c'est moitié moins de données qu'un an : l'erreur standard est √2 fois plus large — le résultat est compatible avec une stratégie sans aucun talent",
      'La malédiction de la racine carrée : diviser l\'erreur par 2 exige de quadrupler n ; pour exclure zéro dans l\'exemple du cours, il faudrait environ 864 jours — presque trois ans et demi',
      "Contraste utile : la volatilité s'estime vite et bien, la moyenne lentement et mal — six mois renseignent à peu près sur σ, pas sur μ",
    ],
    pointsAttendusEn: [
      'A backtest average is a sample mean: it carries a standard error σ/√n — the question is whether the mean survives its own error bars',
      'Course calibration: over 252 days, a stock at 0.08% a day (≈ 20% annualised) with 1.2% daily vol has a 95% CI of [−0.07%; +0.23%] — which contains zero',
      'Six months is half as much data as a year: the standard error is √2 wider — the result is compatible with a strategy that has no skill at all',
      'The square-root curse: halving the error requires quadrupling n; to exclude zero in the course example, you would need about 864 days — almost three and a half years',
      'Useful contrast: volatility is estimated quickly and well, the mean slowly and badly — six months tells you roughly about σ, not about μ',
    ],
    bonus: [
      "Et l'erreur standard n'est que la moitié du problème : combien de backtests ont été essayés avant celui qu'on vous montre ? Data snooping et biais du survivant complètent le réquisitoire",
    ],
    bonusEn: [
      'And the standard error is only half the problem: how many backtests were tried before the one you are being shown? Data snooping and survivorship bias complete the indictment',
    ],
    reponseModele: `Mon réflexe est toujours le même : une moyenne de backtest est une moyenne d'échantillon, donc elle porte une erreur standard, $\\sigma/\\sqrt{n}$. La seule question qui compte : la moyenne survit-elle à ses propres barres d'erreur ?

Pour calibrer, je reprends l'exemple du cours — qui porte sur une année **entière**, deux fois plus longue que ce backtest. Un titre affiche 0,08 % par jour sur 252 jours, soit environ 20 % annualisés, avec 1,2 % de volatilité quotidienne. L'erreur standard vaut 1,2/√252 ≈ 0,076 %, et l'intervalle à 95 % donne [−0,07 % ; +0,23 %] : il **contient zéro**. Une année complète de données quotidiennes ne suffit même pas à affirmer que la moyenne est positive. Sur six mois, c'est pire : moitié moins de données, donc une erreur standard √2 fois plus large. La belle moyenne est, statistiquement, compatible avec une stratégie sans aucun talent — du bruit bien habillé.

Et la racine carrée rend l'addition salée : diviser l'erreur par 2 exige de **quadrupler** les données. Pour que l'exemple du cours exclue zéro, il faudrait environ 864 jours — presque trois ans et demi. Le contraste à garder en tête : la volatilité s'estime vite et bien, la moyenne lentement et mal. Six mois renseignent à peu près correctement sur le σ d'une stratégie ; sur son μ, presque pas.

Donc non, pas fiable en l'état. Et l'erreur standard n'est que la moitié du réquisitoire : avant de croire ce backtest, je demanderais combien d'autres ont été essayés avant celui qu'on me montre — le data snooping et le biais du survivant font l'objet d'une autre question, mais ils commencent ici.`,
    reponseModeleEn: `My reflex is always the same: a backtest average is a sample mean, so it carries a standard error, $\\sigma/\\sqrt{n}$. The only question that matters: does the mean survive its own error bars?

To calibrate, I take the course example — which covers a **full** year, twice as long as this backtest. A stock shows 0.08% a day over 252 days, about 20% annualised, with 1.2% daily volatility. The standard error is 1.2/√252 ≈ 0.076%, and the 95% interval comes out at [−0.07%; +0.23%]: it **contains zero**. An entire year of daily data is not even enough to claim the mean is positive. Over six months it is worse: half the data, hence a standard error √2 wider. The nice-looking average is, statistically, compatible with a strategy that has no skill whatsoever — well-dressed noise.

And the square root makes the bill steep: halving the error requires **quadrupling** the data. For the course example to exclude zero, you would need about 864 days — almost three and a half years. The contrast to keep in mind: volatility is estimated quickly and well, the mean slowly and badly. Six months tells you roughly the right σ of a strategy; about its μ, almost nothing.

So no, not reliable as it stands. And the standard error is only half the indictment: before believing this backtest, I would ask how many others were tried before the one I am being shown — data snooping and survivorship bias are another question, but they start here.`,
  },
  {
    id: 'm2-jury-16',
    moduleId: M2,
    theme: "tests d'hypothèses",
    themeEn: 'hypothesis testing',
    difficulte: 3,
    question: "Définissez la p-value. Précisément — c'est l'une des définitions les plus ratées en entretien.",
    questionEn: 'Define the p-value. Precisely — it is one of the most botched definitions in interviews.',
    plan: [
      'La définition exacte, dans le bon sens du conditionnement',
      "Ce que la p-value n'est PAS",
      "L'exemple chiffré du fonds",
      "Pourquoi l'inversion est le sophisme du procureur",
    ],
    planEn: [
      'The exact definition, with the conditioning the right way round',
      'What the p-value is NOT',
      'The worked fund example',
      "Why the inversion is the prosecutor's fallacy",
    ],
    pointsAttendus: [
      "p-value = probabilité, SI H₀ est vraie, d'observer un écart au moins aussi extrême que celui constaté : P(données | H₀)",
      "Ce n'est PAS P(H₀ | données) : dire « p = 4,6 %, donc 95,4 % de chances que le fonds ait du talent » inverse le sens du conditionnement",
      'Exemple : fonds à +2 % par an sur 25 ans, écart-type des excédents 5 % → erreur standard 1 %, t = 2,0, p = 2 × (1 − Φ(2)) = 4,55 % en bilatéral',
      "Pour obtenir P(H₀ | données), il faudrait du Bayes — donc un a priori sur la rareté des vrais talents, que la p-value ignore totalement",
      'Comme les vrais talents sont rares, un « positif à 5 % » reste le plus souvent un faux positif — le test médical, version desk',
    ],
    pointsAttendusEn: [
      'p-value = the probability, IF H₀ is true, of observing a deviation at least as extreme as the one seen: P(data | H₀)',
      'It is NOT P(H₀ | data): saying "p = 4.6%, so a 95.4% chance the fund has skill" inverts the direction of the conditioning',
      'Example: a fund beating its index by 2% a year over 25 years, with a 5% standard deviation of excess returns → standard error 1%, t = 2.0, p = 2 × (1 − Φ(2)) = 4.55% two-sided',
      'To get P(H₀ | data) you would need Bayes — hence a prior on how rare true skill is, which the p-value ignores entirely',
      'Since true skill is rare, a "positive at 5%" remains most often a false positive — the medical test, desk edition',
    ],
    bonus: [
      'La précision Student qui ferait mouche : avec σ estimé par s sur n = 25, le seuil exact est 2,06 (Student à 24 ddl) et p ≈ 5,7 % — le « significatif d\'un cheveu » casse',
      "p mesure la surprise sous l'hypothèse du hasard ; elle ne mesure ni la taille de l'effet, ni sa valeur économique",
    ],
    bonusEn: [
      'The Student precision that would land: with σ estimated by s on n = 25, the exact threshold is 2.06 (Student, 24 df) and p ≈ 5.7% — the "significant by a hair" breaks',
      'p measures surprise under the chance hypothesis; it measures neither the size of the effect nor its economic value',
    ],
    reponseModele: `La définition exacte : la p-value est la probabilité, **si l'hypothèse nulle est vraie**, d'observer un écart au moins aussi extrême que celui constaté. En notation : $P(\\text{données} \\mid H_0)$. Tout est dans le sens du conditionnement.

Ce qu'elle n'est pas : la probabilité que $H_0$ soit vraie. Dire « p = 4,6 %, donc il y a 95,4 % de chances que le fonds ait du talent » inverse le conditionnement — c'est, mot pour mot, le sophisme du procureur, version desk. Pour obtenir $P(H_0 \\mid \\text{données})$, il faudrait du Bayes, donc un a priori sur la rareté des vrais talents — information que la p-value ignore totalement. Et comme les vrais talents sont rares, un « positif à 5 % » issu d'une population où presque tous les fonds sont sans talent reste, le plus souvent, un faux positif : exactement le test médical à 16,67 %.

L'exemple chiffré pour ancrer : un fonds bat son indice de 2 % par an sur 25 ans, avec un écart-type des excédents de 5 %. Erreur standard : 5/√25 = 1 %. Statistique de test : t = 2,0 — deux erreurs standards de zéro. En bilatéral, $p = 2 \\times (1 - \\Phi(2)) = 4{,}55\\,\\%$ : significatif au seuil de 5 %… d'un cheveu, la frontière étant à 1,96.

Et si je veux marquer le point final : avec σ estimé sur 25 observations, le test exact est un Student à 24 degrés de liberté — seuil critique 2,06, p ≈ 5,7 %. Le cheveu casse. La p-value mesure la surprise sous l'hypothèse du hasard ; elle ne mesure ni la probabilité du talent, ni la taille de l'effet, ni sa valeur économique.`,
    reponseModeleEn: `The exact definition: the p-value is the probability, **if the null hypothesis is true**, of observing a deviation at least as extreme as the one seen. In notation: $P(\\text{data} \\mid H_0)$. Everything lies in the direction of the conditioning.

What it is not: the probability that $H_0$ is true. Saying "p = 4.6%, so there is a 95.4% chance the fund has skill" inverts the conditioning — it is, word for word, the prosecutor's fallacy, desk edition. To get $P(H_0 \\mid \\text{data})$ you would need Bayes, hence a prior on how rare true skill is — information the p-value ignores entirely. And since true skill is rare, a "positive at 5%" drawn from a population where almost all funds are skill-less remains, most of the time, a false positive: exactly the medical test at 16.67%.

The worked example to anchor it: a fund beats its index by 2% a year over 25 years, with a 5% standard deviation of excess returns. Standard error: 5/√25 = 1%. Test statistic: t = 2.0 — two standard errors away from zero. Two-sided, $p = 2 \\times (1 - \\Phi(2)) = 4.55\\,\\%$: significant at the 5% level… by a hair, the boundary sitting at 1.96.

And if I want to score the final point: with σ estimated on 25 observations, the exact test is a Student with 24 degrees of freedom — critical threshold 2.06, p ≈ 5.7%. The hair snaps. The p-value measures surprise under the chance hypothesis; it measures neither the probability of skill, nor the size of the effect, nor its economic value.`,
  },
  {
    id: 'm2-jury-17',
    moduleId: M2,
    theme: "tests d'hypothèses",
    themeEn: 'hypothesis testing',
    difficulte: 2,
    question: 'Erreur de type I, erreur de type II : définissez-les — et dites laquelle vous préférez éviter sur un desk.',
    questionEn: 'Type I error, type II error: define them — and say which one you would rather avoid on a desk.',
    plan: [
      'Le tableau des quatre cases',
      "L'analogie du radar et le bouton de sensibilité α",
      "L'arbitrage : on ne gagne pas sur les deux tableaux à n donné",
      'La réponse desk : tout dépend du coût relatif des deux erreurs',
    ],
    planEn: [
      'The four-cell table',
      'The radar analogy and the α sensitivity dial',
      'The trade-off: you cannot win on both fronts for a given n',
      'The desk answer: it all depends on the relative cost of the two errors',
    ],
    pointsAttendus: [
      'Type I : rejeter H₀ alors qu\'elle est vraie — le faux positif, de probabilité α ; type II : rater un effet réel — de probabilité β ; la puissance est 1 − β',
      'Le radar antiaérien : trop sensible, il sonne sur les vols d\'oiseaux (type I) ; trop sourd, il laisse passer des avions (type II)',
      'Abaisser α de 5 % à 1 % réduit les fausses alertes mais rend le radar plus sourd : β monte, la puissance chute',
      "Le seul moyen d'améliorer les deux à la fois : augmenter n, qui resserre l'erreur standard σ/√n et sépare mieux le signal du bruit",
      "La réponse attendue : pour allouer du capital, le faux positif coûte cher — on durcit α ; pour un signal d'alerte de risque, la détection ratée tue — on accepte des fausses alertes",
    ],
    pointsAttendusEn: [
      'Type I: rejecting H₀ when it is true — the false positive, with probability α; type II: missing a real effect — with probability β; power is 1 − β',
      'The air-defence radar: too sensitive, it rings on flocks of birds (type I); too deaf, it lets planes through (type II)',
      'Lowering α from 5% to 1% reduces false alarms but makes the radar deafer: β rises, power drops',
      'The only way to improve both at once: increase n, which tightens the standard error σ/√n and separates signal from noise',
      'The expected answer: to allocate capital, the false positive is the costly one — harden α; for a risk alert, the missed detection kills — accept false alarms',
    ],
    bonus: [
      "Le lien avec la présomption d'innocence : H₀ joue l'accusé, et ne pas rejeter H₀ ne prouve pas H₀ — acquitté ne veut pas dire innocent",
    ],
    bonusEn: [
      'The link with the presumption of innocence: H₀ plays the defendant, and failing to reject H₀ does not prove H₀ — acquitted does not mean innocent',
    ],
    reponseModele: `Les définitions d'abord, parce que le vocabulaire est traître. L'erreur de type I, c'est condamner un innocent : rejeter $H_0$ alors qu'elle est vraie — le faux positif, dont la probabilité est précisément le seuil $\\alpha$ qu'on s'est donné. L'erreur de type II, c'est laisser filer un coupable : ne pas détecter un effet qui existe réellement, avec probabilité $\\beta$ ; la puissance du test, $1 - \\beta$, est sa capacité de détection.

L'analogie qui fixe tout : un radar antiaérien. Réglé trop sensible, il sonne sur les vols d'oiseaux — fausses alertes, type I. Réglé trop sourd, il laisse passer des avions — détections ratées, type II. Le seuil $\\alpha$ est le bouton de sensibilité : l'abaisser de 5 % à 1 % réduit les fausses alertes mais rend mécaniquement le radar plus sourd — $\\beta$ monte, la puissance chute. À taille d'échantillon donnée, on ne gagne pas sur les deux tableaux ; le seul moyen d'améliorer les deux à la fois est d'agrandir l'antenne — augmenter $n$, ce qui resserre l'erreur standard $\\sigma/\\sqrt{n}$.

Laquelle je préfère éviter ? Ma réponse honnête : **ça dépend de la décision**. Pour allouer du capital à une stratégie, le faux positif coûte cher — je mets du vrai argent sur du bruit — donc je durcis $\\alpha$. Pour un signal d'alerte de risque, c'est l'inverse : la détection ratée tue, et j'accepte volontiers des fausses alertes. Le seuil n'est pas une constante sacrée, c'est un curseur économique réglé sur le coût relatif des deux erreurs. Et j'ajoute le corollaire judiciaire : ne pas rejeter $H_0$ ne prouve jamais $H_0$ — acquitté ne veut pas dire innocent.`,
    reponseModeleEn: `Definitions first, because the vocabulary is treacherous. A type I error is convicting an innocent person: rejecting $H_0$ when it is true — the false positive, whose probability is precisely the threshold $\\alpha$ you set. A type II error is letting a guilty one walk: failing to detect an effect that really exists, with probability $\\beta$; the test's power, $1 - \\beta$, is its detection capacity.

The analogy that settles everything: an air-defence radar. Tuned too sensitive, it rings on flocks of birds — false alarms, type I. Tuned too deaf, it lets planes through — missed detections, type II. The threshold $\\alpha$ is the sensitivity dial: lowering it from 5% to 1% reduces false alarms but mechanically deafens the radar — $\\beta$ rises, power drops. For a given sample size, you cannot win on both fronts; the only way to improve both at once is to enlarge the antenna — increase $n$, which tightens the standard error $\\sigma/\\sqrt{n}$.

Which do I prefer to avoid? My honest answer: **it depends on the decision**. To allocate capital to a strategy, the false positive is the expensive one — I would be putting real money on noise — so I harden $\\alpha$. For a risk alert, it is the reverse: the missed detection is what kills, and I will gladly accept false alarms. The threshold is not a sacred constant, it is an economic dial set to the relative cost of the two errors. And I would add the judicial corollary: failing to reject $H_0$ never proves $H_0$ — acquitted does not mean innocent.`,
  },
  {
    id: 'm2-jury-18',
    moduleId: M2,
    theme: "tests d'hypothèses",
    themeEn: 'hypothesis testing',
    difficulte: 4,
    question: "Un candidat quant vous présente 5 stratégies « significatives à 5 % »… sorties de 100 testées. L'embauchez-vous ?",
    questionEn: 'A quant candidate shows you 5 strategies "significant at 5%"… out of 100 tested. Do you hire him?',
    plan: [
      "Le calcul d'abord : ce que 100 tests à 5 % produisent par construction",
      'Le diagnostic : data snooping — la découverte était garantie d\'avance',
      'La couche Bayes : que vaut un « positif » quand les vrais edges sont rares ?',
      'La décision : non sur ces chiffres — mais évaluer le processus, pas la chance',
    ],
    planEn: [
      'The arithmetic first: what 100 tests at 5% produce by construction',
      'The diagnosis: data snooping — the discovery was guaranteed in advance',
      'The Bayes layer: what is a "positive" worth when true edges are rare?',
      'The decision: not on these numbers — but judge the process, not the luck',
    ],
    pointsAttendus: [
      'Au seuil de 5 %, 100 stratégies sans aucun pouvoir prédictif produisent en moyenne 5 « significatives » — exactement ce qu\'on vous montre',
      "P(au moins une « marche ») = 1 − 0,95¹⁰⁰ = 99,4 % : la découverte est garantie même s'il n'y a rien à découvrir ; 20 tests suffisent déjà pour 64 %",
      'Couche Bayes : si les vrais edges sont rares, P(edge réel | significatif) est faible — même mécanique que le test médical à 16,67 %',
      'Les parades à exiger : hypothèses déclarées avant de voir les données, seuil durci quand les tests se multiplient, validation out-of-sample sur des données jamais touchées',
      "La question qui tue : « combien de tests avant ceux qu'on me montre ? » — ici la réponse est connue : 100",
      "La décision nuancée : aucune allocation sur ces résultats ; mais un candidat qui révèle lui-même les 95 échecs et propose l'out-of-sample démontre exactement l'honnêteté statistique qu'on veut embaucher",
    ],
    pointsAttendusEn: [
      'At the 5% threshold, 100 strategies with zero predictive power produce on average 5 "significant" ones — exactly what you are being shown',
      'P(at least one "works") = 1 − 0.95¹⁰⁰ = 99.4%: the discovery is guaranteed even when there is nothing to discover; 20 tests already get you to 64%',
      'Bayes layer: if true edges are rare, P(real edge | significant) is low — the same mechanics as the medical test at 16.67%',
      'The defences to demand: hypotheses declared before seeing the data, a hardened threshold as tests multiply, out-of-sample validation on untouched data',
      'The killer question: "how many tests before the ones you are showing me?" — here the answer is known: 100',
      'The nuanced decision: no allocation on these results; but a candidate who discloses the 95 failures himself and proposes out-of-sample testing demonstrates exactly the statistical honesty you want to hire',
    ],
    bonus: [
      "Pousser la finesse : 5 succès sur 100 au seuil de 5 %, c'est EXACTEMENT la fréquence attendue sous l'hypothèse « rien ne marche » — ce portefeuille de « découvertes » est indistinguable du bruit pur",
      'Le biais jumeau à vérifier : le survivorship — sur quelles données les 100 stratégies ont-elles tourné ? Une base sans les fonds et titres morts truque le test avant même le seuil',
    ],
    bonusEn: [
      'Push the finesse: 5 hits out of 100 at the 5% threshold is EXACTLY the expected frequency under the "nothing works" hypothesis — this portfolio of "discoveries" is indistinguishable from pure noise',
      'The twin bias to check: survivorship — on what data did the 100 strategies run? A database without the dead funds and delisted stocks rigs the test before the threshold even matters',
    ],
    reponseModele: `Je commence par le calcul, parce qu'il est dévastateur. Au seuil de 5 %, cent stratégies **sans aucun pouvoir prédictif** produisent, par construction du seuil, environ 5 « significatives ». Cinq sur cent, c'est exactement ce qu'on me présente : ce portefeuille de découvertes est indistinguable du bruit pur. Et la probabilité qu'au moins une « marche » par hasard vaut $1 - 0{,}95^{100} = 99{,}4\\,\\%$ — la découverte était garantie d'avance, même s'il n'y avait strictement rien à découvrir. Vingt tests suffisent déjà à porter cette probabilité à 64 %.

J'ajoute la couche Bayes, celle qui sépare les candidats : même « significative », une stratégie tirée d'un univers où les vrais edges sont rares a une probabilité faible d'être réelle — c'est la mécanique du test médical, où un test positif fiable à 99 % ne donne qu'une chance sur six d'être malade. La p-value ne dit jamais $P(\\text{edge} \\mid \\text{significatif})$.

Donc : aucune allocation sur ces chiffres. Mais la question d'embauche est différente, et c'est là que je nuance. Ce candidat m'a **dit** qu'il avait testé 100 stratégies — la plupart des vendeurs de backtests taisent les 95 échecs. S'il enchaîne de lui-même sur les parades — hypothèses déclarées avant de voir les données, seuil durci quand les tests se multiplient, validation out-of-sample sur des données jamais touchées, vérification du survivorship de sa base —, alors il démontre exactement l'honnêteté statistique qu'on veut sur un desk. Je n'achète pas ses 5 stratégies ; je peux acheter sa méthode. S'il croit sincèrement avoir 5 pépites, en revanche, l'entretien est terminé.`,
    reponseModeleEn: `I start with the arithmetic, because it is devastating. At the 5% threshold, one hundred strategies **with zero predictive power** produce, by construction of the threshold, about 5 "significant" ones. Five out of a hundred is exactly what I am being shown: this portfolio of discoveries is indistinguishable from pure noise. And the probability that at least one "works" by chance is $1 - 0.95^{100} = 99.4\\,\\%$ — the discovery was guaranteed in advance, even if there was strictly nothing to discover. Twenty tests already push that probability to 64%.

I add the Bayes layer, the one that separates candidates: even when "significant", a strategy drawn from a universe where true edges are rare has a low probability of being real — the same mechanics as the medical test, where a 99%-reliable positive still leaves only one chance in six of being sick. The p-value never tells you $P(\\text{edge} \\mid \\text{significant})$.

So: no allocation on these numbers. But the hiring question is different, and this is where I qualify. This candidate **told** me he tested 100 strategies — most backtest sellers bury the 95 failures. If he follows up, unprompted, with the defences — hypotheses declared before touching the data, a hardened threshold as tests multiply, out-of-sample validation on untouched data, a survivorship check on his database — then he is demonstrating exactly the statistical honesty you want on a desk. I am not buying his 5 strategies; I might buy his process. If he sincerely believes he has found 5 gems, on the other hand, the interview is over.`,
  },
  {
    id: 'm2-jury-19',
    moduleId: M2,
    theme: "tests d'hypothèses",
    themeEn: 'hypothesis testing',
    difficulte: 2,
    question: '« Statistiquement significatif » veut-il dire « important » ? Illustrez.',
    questionEn: 'Does "statistically significant" mean "important"? Illustrate.',
    plan: [
      'Distinguer les deux questions : bruit ou pas, argent ou pas',
      'Le sens significatif-mais-négligeable : le million d\'observations',
      'Le sens inverse : économiquement énorme mais à peine significatif',
      "La conclusion d'usage : taille d'effet et intervalle, pas seulement p",
    ],
    planEn: [
      'Separate the two questions: noise or not, money or not',
      'The significant-but-negligible direction: the million observations',
      'The reverse direction: economically huge but barely significant',
      'The practical conclusion: effect size and interval, not just p',
    ],
    pointsAttendus: [
      'La significativité dit « ce n\'est probablement pas du bruit » ; elle ne dit jamais « cela vaut de l\'argent »',
      "t = x̄/(s/√n) grandit mécaniquement avec √n : avec un million d'observations, un excédent de 0,01 % par an devient significatif — et reste économiquement invisible, dévoré par le moindre coût de transaction",
      "Le miroir : un fonds qui bat l'indice de 2 % par an pendant 25 ans — économiquement énorme — n'est significatif qu'à un cheveu (t = 2,0, p = 4,55 %)",
      "L'une est une question de √n, l'autre une question de centimes",
      "Le réflexe : toujours donner la taille de l'effet avec son intervalle de confiance, pas seulement la p-value — l'IC montre toute la plage des valeurs compatibles avec les données",
    ],
    pointsAttendusEn: [
      'Significance says "this is probably not noise"; it never says "this is worth money"',
      't = x̄/(s/√n) grows mechanically with √n: with a million observations, an excess of 0.01% a year becomes significant — and stays economically invisible, devoured by the smallest transaction cost',
      'The mirror image: a fund beating its index by 2% a year for 25 years — economically huge — is significant only by a hair (t = 2.0, p = 4.55%)',
      'One is a question of √n, the other a question of cents',
      'The reflex: always report the effect size with its confidence interval, not just the p-value — the CI shows the whole range of values compatible with the data',
    ],
    bonus: [
      "La check-list finale avant de croire un résultat : est-ce significatif, est-ce important, et combien de tests ont été faits — trois questions, trois filtres différents",
    ],
    bonusEn: [
      'The final checklist before believing a result: is it significant, is it important, and how many tests were run — three questions, three different filters',
    ],
    reponseModele: `Non — et la confusion entre les deux est l'une des plus coûteuses du métier. La significativité répond à une seule question : « cet écart peut-il n'être que du bruit d'échantillonnage ? ». Elle ne dit jamais : « cet écart vaut de l'argent ».

L'illustration dans le premier sens : la statistique de test, $t = \\bar{x}/(s/\\sqrt{n})$, grandit mécaniquement avec $\\sqrt{n}$. Avec un million d'observations, un excédent de rendement de 0,01 % par an devient statistiquement significatif — l'erreur standard est devenue microscopique. Économiquement, ce 0,01 % est invisible : le moindre coût de transaction le dévore. Significatif, oui ; important, en rien.

L'illustration dans l'autre sens, tout aussi instructive : un fonds qui bat son indice de 2 % par an pendant **25 ans** — économiquement énorme, une carrière entière de surperformance — n'est significatif qu'à un cheveu : t = 2,0, p = 4,55 %, la frontière à 1,96. L'effet le plus précieux du marché passe à peine le seuil, pendant qu'un effet sans valeur le franchit confortablement pourvu qu'on empile les données. La formule qui résume : l'une est une question de $\\sqrt{n}$, l'autre une question de centimes.

D'où ma pratique : ne jamais livrer une p-value seule. Toujours la taille de l'effet, accompagnée de son intervalle de confiance — qui montre toute la plage des valeurs compatibles avec les données, et reste souvent le plus honnête des deux langages. Et avant de croire quoi que ce soit, la troisième question, distincte des deux premières : combien de tests ont été effectués avant celui qu'on me montre ?`,
    reponseModeleEn: `No — and confusing the two is one of the most expensive mistakes in the business. Significance answers a single question: "could this gap be nothing but sampling noise?". It never says: "this gap is worth money".

The illustration in the first direction: the test statistic, $t = \\bar{x}/(s/\\sqrt{n})$, grows mechanically with $\\sqrt{n}$. With a million observations, an excess return of 0.01% a year becomes statistically significant — the standard error has shrunk to microscopic. Economically, that 0.01% is invisible: the smallest transaction cost devours it. Significant, yes; important, not remotely.

The illustration in the other direction, just as instructive: a fund beating its index by 2% a year for **25 years** — economically huge, an entire career of outperformance — is significant only by a hair: t = 2.0, p = 4.55%, with the boundary at 1.96. The most valuable effect in the market barely clears the bar, while a worthless effect clears it comfortably provided you pile up enough data. The summary line: one is a question of $\\sqrt{n}$, the other a question of cents.

Hence my practice: never deliver a p-value on its own. Always the effect size, accompanied by its confidence interval — which displays the whole range of values compatible with the data, and often remains the more honest of the two languages. And before believing anything, the third question, distinct from the first two: how many tests were run before the one I am being shown?`,
  },
  {
    id: 'm2-jury-20',
    moduleId: M2,
    theme: 'régression',
    themeEn: 'regression',
    difficulte: 2,
    question: "Le beta d'une action : définition, calcul, lecture.",
    questionEn: "A stock's beta: definition, computation, interpretation.",
    plan: [
      "Définition : la pente d'une régression de rendements",
      'Calcul : cov/var — sur des rendements, jamais des prix',
      'Lecture : amplificateur ou amortisseur, et le R² qui complète',
      "Les précautions : erreur d'estimation, outliers, extrapolation",
    ],
    planEn: [
      'Definition: the slope of a regression of returns',
      'Computation: cov/var — on returns, never on prices',
      'Interpretation: amplifier or dampener, and the R² that completes it',
      'The precautions: estimation error, outliers, extrapolation',
    ],
    pointsAttendus: [
      'β = pente de la régression des rendements du titre sur ceux du marché : b = cov(x, y)/var(x) — la covariance des statistiques descriptives, recyclée telle quelle',
      'Lecture : β = 1,35 → quand le marché varie de 1 %, le titre varie en moyenne de 1,35 % — profil amplificateur ; β = 0,5 amortit',
      "L'ordonnée à l'origine préfigure l'alpha — la performance que le marché n'explique pas — avec la question réflexe : significativement différente de zéro, ou bruit ?",
      'Le R² = ρ² complète la lecture : la part des variations expliquée par le marché ; le reste est le risque spécifique du titre',
      'Règle absolue : régresser des rendements, jamais des prix — deux séries qui montent avec le temps fabriquent un R² fallacieux',
      "Précautions : un β estimé sur cinq points est un sondage à cinq personnes ; les outliers pèsent au carré (retirer une semaine fait sauter la pente de 1,35 à 1,66) ; et un β mesuré par temps calme ne dit rien d'un krach",
    ],
    pointsAttendusEn: [
      "β = the slope of the regression of the stock's returns on the market's: b = cov(x, y)/var(x) — descriptive-statistics covariance, recycled as is",
      'Interpretation: β = 1.35 → when the market moves 1%, the stock moves 1.35% on average — an amplifying profile; β = 0.5 dampens',
      'The intercept prefigures alpha — the performance the market does not explain — with the reflex question: significantly different from zero, or noise?',
      "R² = ρ² completes the read: the share of variation explained by the market; the rest is the stock's specific risk",
      'Absolute rule: regress returns, never prices — two series drifting up with time manufacture a spurious R²',
      'Precautions: a β estimated on five points is a five-person poll; outliers weigh as squares (dropping one week jumps the slope from 1.35 to 1.66); and a β measured in calm times says nothing about a crash',
    ],
    bonus: [
      "La distinction d'oral : une corrélation ne peut pas dépasser 1, un beta si — la pente mélange la corrélation et le rapport des volatilités",
    ],
    bonusEn: [
      'The interview distinction: a correlation cannot exceed 1, a beta can — the slope blends the correlation with the ratio of volatilities',
    ],
    reponseModele: `**Définition.** Le beta est la pente de la régression des rendements du titre sur ceux du marché : la sensibilité moyenne du titre aux mouvements du marché — la définition même du beta du CAPM.

**Calcul.** Les moindres carrés donnent $b = \\text{cov}(x, y)/\\text{var}(x)$ : une covariance normalisée — les outils des statistiques descriptives recyclés tels quels. Détail qui n'en est pas un : on régresse des **rendements**, jamais des prix. Deux prix qui montent avec le temps sont mécaniquement corrélés, et la régression de niveaux fabrique des R² fallacieux.

**Lecture.** Un β de 1,35 se lit : quand le marché varie de 1 %, le titre varie en moyenne de 1,35 % — il amplifie de 35 %, profil agressif ; un β de 0,5 amortirait. L'ordonnée à l'origine préfigure l'alpha, la performance que le marché n'explique pas — avec la question réflexe : significativement différente de zéro, ou bruit ? Et le R², carré de la corrélation, complète : s'il vaut 0,93, le marché explique 93 % des variations du titre, le reste est son risque spécifique. Précision qui distingue : une corrélation ne peut pas dépasser 1, un beta si — la pente mélange corrélation et rapport des volatilités.

**Précautions.** Trois. Un β est estimé, donc porte une erreur standard : sur cinq points, c'est un sondage à cinq personnes. Les moindres carrés pèsent au carré : retirez une seule semaine extrême de l'exemple du cours, et la pente saute de 1,35 à 1,66. Et la droite n'existe que sur la plage du nuage : un β mesuré sur des semaines à ±4 % ne dit rien d'un krach à −20 % — là où, précisément, les corrélations se déforment.`,
    reponseModeleEn: `**Definition.** Beta is the slope of the regression of the stock's returns on the market's returns: the stock's average sensitivity to market moves — the very definition of the CAPM beta.

**Computation.** Least squares give $b = \\text{cov}(x, y)/\\text{var}(x)$: a normalised covariance — the descriptive-statistics toolkit recycled as is. One detail that is anything but: you regress **returns**, never prices. Two prices drifting up over time are mechanically correlated, and regressing levels manufactures spurious R²s.

**Interpretation.** A β of 1.35 reads: when the market moves 1%, the stock moves 1.35% on average — it amplifies by 35%, an aggressive profile; a β of 0.5 would dampen. The intercept prefigures alpha, the performance the market does not explain — with the reflex question: significantly different from zero, or noise? And the R², the square of the correlation, completes the picture: at 0.93, the market explains 93% of the stock's variation, the rest being its specific risk. A distinguishing precision: a correlation cannot exceed 1, a beta can — the slope blends correlation with the ratio of volatilities.

**Precautions.** Three. A β is estimated, so it carries a standard error: on five points, it is a five-person poll. Least squares weigh as squares: drop a single extreme week from the course example and the slope jumps from 1.35 to 1.66. And the line only exists over the range of the cloud: a β measured on ±4% weeks says nothing about a −20% crash — exactly where correlations deform.`,
  },
  {
    id: 'm2-jury-21',
    moduleId: M2,
    theme: 'régression',
    themeEn: 'regression',
    difficulte: 3,
    question: 'Votre stagiaire vous montre une régression avec un R² de 0,92. Impressionnant ou suspect ?',
    questionEn: 'Your intern shows you a regression with an R² of 0.92. Impressive or suspicious?',
    plan: [
      'Le réflexe : demander ce qui a été régressé — niveaux ou variations ?',
      'Le scénario suspect : la régression fallacieuse sur des prix',
      'Le scénario plausible : des rendements réellement liés',
      'Le diagnostic : résidus, outliers, taille d\'échantillon',
    ],
    planEn: [
      'The reflex: ask what was regressed — levels or changes?',
      'The suspicious scenario: spurious regression on prices',
      'The plausible scenario: genuinely linked returns',
      'The diagnosis: residuals, outliers, sample size',
    ],
    pointsAttendus: [
      'Première question : prix ou rendements ? Deux séries qui montent avec le temps sont mécaniquement corrélées — un R² écrasant entre niveaux ne dit à peu près rien',
      "La règle de desk : on régresse des variations, jamais des niveaux ; un R² de 0,3 entre rendements est déjà une vraie information, un R² de 0,95 entre prix n'en est pas une",
      "Si ce sont des rendements, 0,92 est possible mais exigeant : un titre très indiciel sur son marché — l'exemple du cours donne R² = 0,93",
      "Vérifier la mécanique : sur très peu de points, le R² est fragile — cinq observations sont un sondage à cinq personnes, et un outlier pèse au carré",
      'Le diagnostic : regarder le graphique des résidus — une courbe, une tendance, des paquets de volatilité signalent que la droite rate quelque chose',
      "Sur données réelles, un score proche de 1 doit éveiller la méfiance plutôt que l'enthousiasme",
    ],
    pointsAttendusEn: [
      'First question: prices or returns? Two series drifting up with time are mechanically correlated — a crushing R² between levels says next to nothing',
      'The desk rule: regress changes, never levels; an R² of 0.3 between returns is already real information, an R² of 0.95 between prices is not',
      'If these are returns, 0.92 is possible but demanding: a stock tracking its market very closely — the course example gives R² = 0.93',
      'Check the mechanics: on very few points the R² is fragile — five observations are a five-person poll, and an outlier weighs as a square',
      'The diagnosis: look at the residual plot — a curve, a trend, volatility clusters signal that the line is missing something',
      'On real data, a score close to 1 should raise suspicion rather than enthusiasm',
    ],
    bonus: [
      "L'exemple qui marque : le prix de l'or régressé sur l'immobilier parisien depuis 2000 affiche un R² de 0,95 — refaites-le en rendements mensuels, il s'effondre probablement vers zéro",
    ],
    bonusEn: [
      'The example that sticks: the gold price regressed on Paris property prices since 2000 shows an R² of 0.95 — redo it in monthly returns and it most likely collapses towards zero',
    ],
    reponseModele: `Ma première réaction n'est ni l'un ni l'autre : c'est une question. **Qu'est-ce qui a été régressé — des niveaux ou des variations ?**

Si ce sont des prix, le 0,92 est presque certainement un mirage. Deux séries qui montent avec le temps sont mécaniquement corrélées : la tendance commune — le temps qui passe, l'inflation, la croissance — fabrique un R² flatteur sans le moindre lien économique exploitable. C'est la régression fallacieuse, et l'exemple du cours la rend inoubliable : le prix de l'or régressé sur l'immobilier parisien depuis 2000 affiche un R² de 0,95 — refaites-le en rendements mensuels, et il s'effondre vraisemblablement vers zéro. D'où la règle absolue du desk : on régresse des **variations**, jamais des niveaux. Un R² de 0,3 entre rendements est déjà une vraie information ; un R² de 0,95 entre prix n'en est pas une.

Si ce sont des rendements, 0,92 devient possible mais exigeant : c'est le profil d'un titre très indiciel régressé sur son marché — l'exemple du cours donne 0,93. Avant d'applaudir, je vérifie trois choses. La taille d'échantillon : sur une poignée de points, le R² est fragile — cinq observations sont un sondage à cinq personnes. Les outliers : les moindres carrés pèsent au carré, un point extrême peut fabriquer l'ajustement à lui seul. Et surtout les **résidus** : une courbe, une tendance ou des paquets de volatilité dans leur graphique signalent que la droite rate quelque chose, quel que soit le R².

En une phrase : sur données réelles, un score proche de 1 doit éveiller la méfiance plutôt que l'enthousiasme — l'excellence statistique se vérifie, elle ne s'admire pas.`,
    reponseModeleEn: `My first reaction is neither: it is a question. **What was regressed — levels or changes?**

If these are prices, the 0.92 is almost certainly a mirage. Two series drifting upward over time are mechanically correlated: the shared trend — passing time, inflation, growth — manufactures a flattering R² without the slightest exploitable economic link. That is spurious regression, and the course example makes it unforgettable: the gold price regressed on Paris property prices since 2000 shows an R² of 0.95 — redo it in monthly returns and it most likely collapses towards zero. Hence the absolute desk rule: regress **changes**, never levels. An R² of 0.3 between returns is already real information; an R² of 0.95 between prices is not.

If these are returns, 0.92 becomes possible but demanding: it is the profile of a stock hugging its index — the course example gives 0.93. Before applauding, I check three things. Sample size: on a handful of points, the R² is fragile — five observations are a five-person poll. Outliers: least squares weigh as squares, and one extreme point can manufacture the fit on its own. And above all the **residuals**: a curve, a trend or volatility clusters in their plot signal that the line is missing something, whatever the R² says.

In one sentence: on real data, a score close to 1 should trigger suspicion rather than enthusiasm — statistical excellence is verified, not admired.`,
  },
  {
    id: 'm2-jury-22',
    moduleId: M2,
    theme: 'Monte-Carlo',
    themeEn: 'Monte Carlo',
    difficulte: 3,
    question: 'À quoi sert Monte-Carlo quand on a des formules fermées ?',
    questionEn: 'What is Monte Carlo for, when closed-form formulas exist?',
    plan: [
      'Rappeler la méthode en trois temps : modéliser, simuler, compter',
      'La réponse courte : les formules fermées sont l\'exception',
      'Ce que Monte-Carlo coûte : la convergence en 1/√N',
      'Ce que Monte-Carlo ne résout jamais : le modèle',
    ],
    planEn: [
      'Recall the three-step method: model, simulate, count',
      'The short answer: closed forms are the exception',
      'What Monte Carlo costs: 1/√N convergence',
      'What Monte Carlo never solves: the model',
    ],
    pointsAttendus: [
      "Les formules fermées n'existent que sous hypothèses restrictives ; dès que le gain dépend de tout le chemin — options asiatiques, barrières —, il n'y a plus de formule : on simule des milliers de trajectoires et on actualise le gain moyen",
      'Autre usage de production : la VaR — simuler, trier les pertes, lire le quantile',
      "Le coût : un estimateur Monte-Carlo est une moyenne d'échantillon — erreur standard en 1/√N ; une décimale de précision coûte cent fois plus de simulations",
      'Quand une formule existe, elle gagne : exacte et instantanée — Monte-Carlo sert alors de contre-vérification, et de banc d\'essai quand on enrichit le modèle au-delà du domaine de la formule',
      "La limite de fond : la simulation reproduit votre modèle, pas le monde — un million de trajectoires lognormales n'inventera jamais les queues épaisses que la lognormale ignore",
    ],
    pointsAttendusEn: [
      'Closed forms only exist under restrictive assumptions; as soon as the payoff depends on the whole path — Asian options, barriers — there is no formula: you simulate thousands of paths and discount the average payoff',
      'The other production use: VaR — simulate, sort the losses, read off the quantile',
      'The cost: a Monte Carlo estimator is a sample mean — standard error in 1/√N; one extra decimal of precision costs a hundred times more simulations',
      'When a formula exists, it wins: exact and instantaneous — Monte Carlo then serves as a cross-check, and as a test bench when you enrich the model beyond the formula\'s domain',
      'The deeper limit: the simulation reproduces your model, not the world — a million lognormal paths will never invent the fat tails the lognormal ignores',
    ],
    bonus: [
      "L'exemple de calibrage : estimer une probabilité dont la valeur exacte est 37,2 % (finir l'année au-dessus de 110 €) — à N = 1 000, l'erreur type est d'environ 1,5 point ; pour 0,15 point, il faut N = 100 000",
    ],
    bonusEn: [
      'The calibration example: estimating a probability whose exact value is 37.2% (ending the year above €110) — at N = 1,000 the standard error is about 1.5 points; for 0.15 points you need N = 100,000',
    ],
    reponseModele: `La réponse courte : parce que les formules fermées sont l'exception, pas la règle. Monte-Carlo, c'est trois temps — modéliser l'aléa, simuler N scénarios, compter. Dès que la quantité visée n'a pas de formule, c'est le seul outil disponible : le pricing des options **exotiques**, dont le gain dépend de tout le chemin du sous-jacent — asiatiques, barrières —, se fait en simulant des milliers de trajectoires et en actualisant le gain moyen. Même logique pour la VaR : on simule, on trie les pertes, on lit le quantile.

Mais la question mérite mieux, parce que même quand une formule existe, Monte-Carlo garde deux rôles. La **contre-vérification** : un pricer qui retombe sur la valeur exacte — par exemple les 37,2 % de probabilité de finir l'année au-dessus de 110 € dans le modèle du cours — est un pricer validé. Et le **banc d'essai** : la formule vit dans un monde étroit ; le jour où l'on enrichit le modèle au-delà de ses hypothèses, la formule meurt, le simulateur survit.

Le coût, à nommer spontanément : un estimateur Monte-Carlo est une moyenne d'échantillon, donc le TCL s'applique intégralement — erreur standard en $1/\\sqrt{N}$. À N = 1 000, environ 1,5 point d'erreur type sur notre probabilité ; pour 0,15 point, il faut N = 100 000. Une décimale de précision coûte **cent fois** plus de calcul.

Et la limite de fond, celle qui sépare le quant du presse-bouton : la simulation reproduit votre **modèle**, pas le monde. Un million de trajectoires lognormales n'inventera jamais les queues épaisses que la lognormale ignore. Monte-Carlo résout le problème du calcul — jamais celui du modèle.`,
    reponseModeleEn: `The short answer: because closed-form formulas are the exception, not the rule. Monte Carlo is three steps — model the randomness, simulate N scenarios, count. As soon as the target quantity has no formula, it is the only tool available: pricing **exotic** options, whose payoff depends on the whole path of the underlying — Asians, barriers — is done by simulating thousands of paths and discounting the average payoff. Same logic for VaR: simulate, sort the losses, read off the quantile.

But the question deserves better, because even when a formula exists, Monte Carlo keeps two roles. **Cross-checking**: a pricer that lands on the exact value — say the 37.2% probability of ending the year above €110 in the course model — is a validated pricer. And the **test bench**: the formula lives in a narrow world; the day you enrich the model beyond its assumptions, the formula dies, the simulator survives.

The cost, to volunteer unprompted: a Monte Carlo estimator is a sample mean, so the CLT applies in full — standard error in $1/\\sqrt{N}$. At N = 1,000, about 1.5 points of standard error on our probability; for 0.15 points, you need N = 100,000. One extra decimal of precision costs **a hundred times** more computation.

And the deeper limit, the one that separates a quant from a button-pusher: the simulation reproduces your **model**, not the world. A million lognormal paths will never invent the fat tails the lognormal ignores. Monte Carlo solves the computation problem — never the model problem.`,
  },
  {
    id: 'm2-jury-23',
    moduleId: M2,
    theme: 'probabilités',
    themeEn: 'probability',
    difficulte: 4,
    question: "Brainteaser en direct : « une famille a deux enfants, l'un au moins est une fille ». Probabilité que les deux soient des filles ? Et si je vous dis que l'aînée est une fille ? Et si vous croisez l'un des enfants au hasard et que c'est une fille ?",
    questionEn: 'Live brainteaser: "a family has two children, at least one is a girl". Probability both are girls? What if I tell you the eldest is a girl? And what if you bump into one of the children at random and she is a girl?',
    plan: [
      "Poser l'univers : FF, FG, GF, GG, équiprobables",
      'Cas 1 — « au moins une fille » : conditionner, compter → 1/3',
      "Cas 2 — « l'aînée est une fille » : l'univers restant change → 1/2",
      'Cas 3 — « vous croisez une fille » : le mécanisme de sélection change tout → 1/2',
    ],
    planEn: [
      'Lay out the universe in birth order: GG, GB, BG, BB, equiprobable',
      'Case 1 — "at least one girl": condition, count → 1/3',
      'Case 2 — "the eldest is a girl": the remaining universe changes → 1/2',
      'Case 3 — "you bump into a girl": the selection mechanism changes everything → 1/2',
    ],
    pointsAttendus: [
      "Écrire l'univers dans l'ordre de naissance : FF, FG, GF, GG — quatre cas équiprobables ; le réflexe « 1/2 » oublie que FG et GF sont deux cas distincts",
      '« Au moins une fille » élimine GG : trois cas restants équiprobables, un seul favorable → 1/3',
      "« L'aînée est une fille » ne laisse que FF et FG → 1/2 : l'information est plus précise, elle identifie QUEL enfant est une fille",
      "« Vous croisez un enfant au hasard et c'est une fille » → 1/2 : la famille FF a deux fois plus de chances de produire cette rencontre que FG ou GF — le mécanisme de sélection de l'information change la réponse",
      "La leçon générale : la probabilité dépend de COMMENT l'information a été obtenue, pas seulement de son contenu — signaler cette sensibilité à la formulation vaut des points",
      "La méthode à voix haute : univers, conditionnement, effectifs — le jury évalue le protocole, pas la réponse récitée",
    ],
    pointsAttendusEn: [
      'Write the universe in birth order: GG, GB, BG, BB — four equiprobable cases; the "1/2" reflex forgets that GB and BG are two distinct cases',
      '"At least one girl" eliminates BB: three remaining equiprobable cases, one favourable → 1/3',
      '"The eldest is a girl" leaves only GG and GB → 1/2: the information is more precise, it identifies WHICH child is a girl',
      '"You bump into one child at random and she is a girl" → 1/2: the GG family is twice as likely to produce that encounter as GB or BG — the selection mechanism of the information changes the answer',
      'The general lesson: the probability depends on HOW the information was obtained, not only on its content — flagging this sensitivity to wording earns points',
      'The out-loud method: universe, conditioning, headcounts — the panel grades the protocol, not the recited answer',
    ],
    bonus: [
      "La version pièces pour s'entraîner : « au moins un pile » sur deux lancers → 1/3 que les deux soient piles — même structure, même piège",
      "Le lien desk : c'est le problème de tout signal de marché — la même donnée n'a pas le même sens selon le processus qui l'a fait remonter jusqu'à vous",
    ],
    bonusEn: [
      'The coin version for practice: "at least one heads" on two tosses → 1/3 that both are heads — same structure, same trap',
      'The desk link: it is the problem of every market signal — the same piece of data does not mean the same thing depending on the process that brought it to you',
    ],
    reponseModele: `Je pose d'abord l'univers, dans l'ordre de naissance : FF, FG, GF, GG — quatre cas équiprobables. C'est le geste qui évite tous les pièges, parce que le réflexe « 1/2 » oublie que FG et GF sont deux cas distincts.

**Cas 1 — « l'un au moins est une fille ».** L'information élimine GG. Restent trois cas équiprobables — FF, FG, GF — dont un seul favorable : $P = 1/3$.

**Cas 2 — « l'aînée est une fille ».** L'information est plus précise : elle identifie *quel* enfant est une fille. L'univers restant est FF et FG — deux cas, un favorable : $P = 1/2$. Une nuance de formulation, et la réponse change.

**Cas 3 — « vous croisez l'un des enfants au hasard, c'est une fille ».** Le contenu de l'information semble identique au cas 1 — il y a une fille — mais le **mécanisme de sélection** a changé. Je pondère par la probabilité de la rencontre : une famille FF produit une rencontre-fille à coup sûr ; FG ou GF, une fois sur deux. Les poids donnent $\\frac{1/4}{1/4 + 1/8 + 1/8} = 1/2$. Intuition : croiser une fille est deux fois plus probable dans une famille FF — cette rencontre est elle-même un indice.

La leçon, qui dépasse le brainteaser : la probabilité dépend de **comment** l'information a été obtenue, pas seulement de son contenu. C'est vrai des enfants, des pièces — « au moins un pile » donne le même 1/3 — et de tout signal de marché : la même donnée n'a pas le même sens selon le processus qui l'a fait remonter jusqu'à vous. Et devant un jury, je déroule tout cela à voix haute : univers, conditionnement, effectifs — c'est le protocole qu'on évalue, pas la réponse.`,
    reponseModeleEn: `First I lay out the universe, in birth order: GG, GB, BG, BB — four equiprobable cases. That is the move that defuses every trap, because the "1/2" reflex forgets that GB and BG are two distinct cases.

**Case 1 — "at least one is a girl".** The information eliminates BB. Three equiprobable cases remain — GG, GB, BG — of which one is favourable: $P = 1/3$.

**Case 2 — "the eldest is a girl".** The information is more precise: it identifies *which* child is a girl. The remaining universe is GG and GB — two cases, one favourable: $P = 1/2$. One nuance of wording, and the answer changes.

**Case 3 — "you bump into one of the children at random, and she is a girl".** The content of the information looks identical to case 1 — there is a girl — but the **selection mechanism** has changed. I weight by the probability of the encounter: a GG family produces a girl-encounter for sure; GB or BG, one time in two. The weights give $\\frac{1/4}{1/4 + 1/8 + 1/8} = 1/2$. Intuition: meeting a girl is twice as likely in a GG family — the encounter is itself a clue.

The lesson, which outgrows the brainteaser: probability depends on **how** the information was obtained, not only on its content. True of children, of coins — "at least one heads" gives the same 1/3 — and of every market signal: the same piece of data does not mean the same thing depending on the process that brought it to you. And in front of a panel, I run all of this out loud: universe, conditioning, headcounts — the protocol is what is being graded, not the answer.`,
  },
  {
    id: 'm2-jury-24',
    moduleId: M2,
    theme: "tests d'hypothèses",
    themeEn: 'hypothesis testing',
    difficulte: 4,
    question: 'Un backtest affiche un Sharpe de 2,1 sur 18 mois. Démontez-le devant nous.',
    questionEn: 'A backtest shows a Sharpe ratio of 2.1 over 18 months. Take it apart for us.',
    plan: [
      'Prendre le chiffre au sérieux : que dit la statistique brute ?',
      "Première attaque : l'erreur standard d'une moyenne sur 18 points",
      'Deuxième attaque : combien de backtests avant celui-ci ? Data snooping et survivants',
      'Troisième attaque : ce que 18 mois ne peuvent pas contenir — la queue gauche',
    ],
    planEn: [
      'Take the number seriously: what does the raw statistic say?',
      'First attack: the standard error of a mean on 18 points',
      'Second attack: how many backtests before this one? Data snooping and survivors',
      'Third attack: what 18 months cannot contain — the left tail',
    ],
    pointsAttendus: [
      "Un Sharpe est un rapport moyenne/écart-type : son numérateur est une moyenne d'échantillon, qui porte une erreur standard σ/√n — avec n = 18 observations mensuelles, elle est énorme",
      "Le test au premier degré : t ≈ (2,1/√12) × √18 ≈ 2,6 — d'apparence significatif… à condition qu'il s'agisse du PREMIER et SEUL test, et avec un seuil Student plus exigeant que 1,96 sur si peu de points",
      "Data snooping : si ce backtest est le survivant de dizaines d'essais, la significativité s'évapore — 100 tests à 5 % garantissent des « découvertes » à 99,4 %",
      'Survivorship : sur quelles données ? Une base expurgée des titres et fonds morts gonfle les performances avant tout calcul',
      "La queue absente : 18 mois peuvent ne contenir aucun épisode de stress — une stratégie à skewness négative (vente d'assurance) affiche un Sharpe superbe jusqu'au passage du rouleau compresseur",
      "Le verdict : rien d'allouable en l'état ; exiger le journal complet des essais et une validation out-of-sample — la moyenne s'estime lentement et mal, 18 mois n'y changent rien",
    ],
    pointsAttendusEn: [
      'A Sharpe is a mean-to-standard-deviation ratio: its numerator is a sample mean, which carries a standard error σ/√n — with n = 18 monthly observations, it is enormous',
      'The face-value test: t ≈ (2.1/√12) × √18 ≈ 2.6 — apparently significant… provided this is the FIRST and ONLY test, and against a Student threshold stricter than 1.96 on so few points',
      'Data snooping: if this backtest is the survivor of dozens of trials, the significance evaporates — 100 tests at 5% guarantee "discoveries" at 99.4%',
      'Survivorship: on what data? A database purged of dead stocks and funds inflates performance before any computation',
      'The missing tail: 18 months may contain no stress episode at all — a negatively skewed strategy (selling insurance) shows a superb Sharpe until the steamroller comes through',
      'The verdict: nothing allocatable as it stands; demand the full log of trials and out-of-sample validation — the mean is estimated slowly and badly, and 18 months changes nothing',
    ],
    bonus: [
      "La question qui désarme le vendeur : « montrez-moi les backtests que vous ne me montrez pas »",
      "Le pont avec l'IC : sur si peu de points, l'intervalle de confiance autour du Sharpe est si large que la valeur affichée est presque décorative — donner l'intervalle, pas le point",
    ],
    bonusEn: [
      'The question that disarms the seller: "show me the backtests you are not showing me"',
      'The CI bridge: on so few points, the confidence interval around the Sharpe is so wide that the displayed value is almost decorative — quote the interval, not the point',
    ],
    reponseModele: `Je commence par prendre le chiffre au sérieux — c'est la manière la plus propre de le démonter. Un Sharpe est un rapport moyenne sur écart-type : son numérateur est une moyenne d'échantillon, donc il porte une erreur standard en $\\sigma/\\sqrt{n}$. Ici, n = 18 observations mensuelles. Le calcul au premier degré : un Sharpe annualisé de 2,1, c'est environ 2,1/√12 ≈ 0,61 par mois, et la statistique de test vaut t ≈ 0,61 × √18 ≈ 2,6. D'apparence, c'est significatif — mais sur 18 points, le seuil exact est celui d'un Student, plus exigeant que le 1,96 asymptotique, et surtout : ce calcul suppose qu'il s'agit du **premier et seul test jamais effectué**.

C'est là que tout s'effondre. Combien de backtests avant celui qu'on me montre ? Cent essais au seuil de 5 % garantissent des « découvertes » avec une probabilité de 99,4 % — si ce Sharpe est le survivant d'une fouille, il est exactement ce que le hasard promettait. J'ajoute le biais jumeau : sur quelles données a-t-il tourné ? Une base expurgée des titres et fonds morts gonfle les performances avant même le premier calcul.

Troisième attaque, la plus sournoise : ce que 18 mois ne peuvent pas contenir. Une stratégie à skewness négative — vente d'assurance, primes régulières — affiche un Sharpe superbe tant que la queue gauche ne s'est pas montrée. Dix-huit mois sans stress ne prouvent pas l'absence de rouleau compresseur ; ils prouvent qu'il n'est pas encore passé.

Mon verdict : rien d'allouable en l'état. J'exige le journal complet des essais, la composition de la base, et une validation out-of-sample. La moyenne s'estime lentement et mal — dix-huit mois n'y changent rien.`,
    reponseModeleEn: `I start by taking the number seriously — it is the cleanest way to take it apart. A Sharpe is a mean over a standard deviation: its numerator is a sample mean, so it carries a standard error in $\\sigma/\\sqrt{n}$. Here, n = 18 monthly observations. The face-value computation: an annualised Sharpe of 2.1 is about 2.1/√12 ≈ 0.61 per month, and the test statistic comes out at t ≈ 0.61 × √18 ≈ 2.6. On its face, significant — but on 18 points the exact threshold is a Student one, stricter than the asymptotic 1.96, and above all: that computation assumes this is the **first and only test ever run**.

That is where everything collapses. How many backtests came before the one I am being shown? A hundred trials at the 5% threshold guarantee "discoveries" with 99.4% probability — if this Sharpe is the survivor of a fishing expedition, it is exactly what chance promised. I add the twin bias: on what data did it run? A database purged of dead stocks and funds inflates performance before the first computation is even made.

Third attack, the most insidious: what 18 months cannot contain. A negatively skewed strategy — selling insurance, steady premiums — displays a superb Sharpe as long as the left tail has not shown up. Eighteen months without stress do not prove there is no steamroller; they prove it has not come through yet.

My verdict: nothing allocatable as it stands. I demand the full log of trials, the composition of the database, and out-of-sample validation. The mean is estimated slowly and badly — eighteen months changes nothing about that.`,
  },
  {
    id: 'm2-jury-25',
    moduleId: M2,
    theme: 'synthèse',
    themeEn: 'capstone',
    difficulte: 4,
    question: 'Jeu de rôle : vous avez 90 secondes devant le comité des risques pour expliquer pourquoi la normalité tue le risk management. Allez-y.',
    questionEn: 'Role play: you have 90 seconds in front of the risk committee to explain why normality kills risk management. Go.',
    plan: [
      "L'accroche : un fait d'armes — 1987, plus de 20 écarts-types",
      'Le mécanisme : queues épaisses et VaR gaussienne',
      'Le complice : les corrélations qui montent vers 1 en crise',
      'La chute : la nuance qui crédibilise — la normale au centre, jamais aux extrêmes',
    ],
    planEn: [
      'The hook: a battlefield fact — 1987, more than 20 standard deviations',
      'The mechanism: fat tails and Gaussian VaR',
      'The accomplice: correlations climbing towards 1 in a crisis',
      'The close: the nuance that builds credibility — the normal at the centre, never at the extremes',
    ],
    pointsAttendus: [
      "Ouvrir par le fait : 19 octobre 1987, −22,6 % en une séance, plus de 20 écarts-types — un événement que la normale interdit à l'échelle de l'âge de l'univers, et qui a eu lieu",
      'Généraliser : 2008, flash crash de 2010, mars 2020 — les rendements réels sont leptokurtiques, les extrêmes sont structurels, pas accidentels',
      'Frapper où ça coûte : une VaR gaussienne à 99 % sous-estime précisément les pertes qu\'elle prétend borner',
      "Le deuxième étage : en crise, les corrélations estimées par temps calme montent vers 1 — la diversification s'évapore au pire moment, le risque est doublement sous-estimé",
      "Les parades : stress tests, scénarios historiques, lois à queues épaisses — en gardant en tête qu'un simulateur lognormal n'inventera jamais les queues que son modèle ignore",
      "Clore avec la nuance : la normale reste excellente au centre, là où vivent 95 % des journées — le péché n'est pas de l'utiliser, c'est d'oublier qu'on l'utilise",
    ],
    pointsAttendusEn: [
      'Open with the fact: 19 October 1987, −22.6% in one session, more than 20 standard deviations — an event the normal forbids on the scale of the age of the universe, and which happened',
      'Generalise: 2008, the 2010 flash crash, March 2020 — real returns are leptokurtic, extremes are structural, not accidental',
      'Hit where it costs: a Gaussian 99% VaR understates precisely the losses it claims to bound',
      'The second storey: in a crisis, correlations estimated in calm times climb towards 1 — diversification evaporates at the worst moment, risk is doubly understated',
      'The defences: stress tests, historical scenarios, fat-tailed laws — keeping in mind that a lognormal simulator will never invent the tails its model ignores',
      'Close with the nuance: the normal stays excellent at the centre, where 95% of days live — the sin is not using it, it is forgetting you are using it',
    ],
    bonus: [
      'Le format compte autant que le fond : 90 secondes = un fait, un mécanisme, un coût, une recommandation — le comité retient une structure, pas une formule',
      "Si l'on vous pousse — « pourquoi la garder alors ? » : parce qu'elle est maniable, qu'elle alimente z-scores et intervalles, et qu'un modèle simple dont on connaît les limites vaut mieux qu'un modèle exotique mal calibré",
    ],
    bonusEn: [
      'The format matters as much as the substance: 90 seconds = one fact, one mechanism, one cost, one recommendation — the committee remembers a structure, not a formula',
      'If pushed — "then why keep it?": because it is tractable, it powers z-scores and intervals, and a simple model with known limits beats a poorly calibrated exotic one',
    ],
    reponseModele: `Mesdames, messieurs — un fait d'abord. Le 19 octobre 1987, le Dow Jones perd 22,6 % en une séance : plus de vingt écarts-types au regard de la volatilité de l'époque. Sous nos hypothèses gaussiennes, cet événement ne devait pas se produire une seule fois depuis l'âge de l'univers. Il a eu lieu — et 2008, le flash crash de 2010 et mars 2020 ont confirmé qu'il n'était pas un accident isolé : les rendements réels ont des queues épaisses, les extrêmes sont structurels.

Pourquoi cela vous concerne : notre VaR gaussienne à 99 % sous-estime **précisément les pertes qu'elle prétend borner**. Elle est juste 95 % du temps, là où il ne se passe rien, et fausse les jours qui peuvent nous emporter. Et le danger est double : en crise, les corrélations estimées par temps calme montent vers 1 — la diversification sur laquelle reposent nos limites s'évapore au pire moment. Risque de queue sous-estimé, risque de concentration sous-estimé : la normalité nous fait sourire deux fois au mauvais moment.

Mes recommandations tiennent en trois points : des stress tests systématiques, des scénarios historiques rejoués — 1987, 2008, 2020 —, et des lois à queues épaisses sur les expositions critiques. Avec une lucidité : nos simulateurs reproduisent leurs modèles, pas le monde — un million de trajectoires lognormales n'inventera jamais les queues que la lognormale ignore.

Et la nuance finale, pour être juste : la normale reste excellente au centre de la distribution, là où vivent 95 % des journées — gardons-la pour le quotidien. Le péché n'est pas de l'utiliser. C'est d'oublier qu'on l'utilise. Merci.`,
    reponseModeleEn: `Ladies and gentlemen — a fact first. On 19 October 1987, the Dow Jones lost 22.6% in a single session: more than twenty standard deviations against the volatility of the day. Under our Gaussian assumptions, that event should not have happened once since the age of the universe. It happened — and 2008, the 2010 flash crash and March 2020 confirmed it was no isolated accident: real returns have fat tails, extremes are structural.

Why this concerns you: our Gaussian 99% VaR understates **precisely the losses it claims to bound**. It is right 95% of the time, when nothing is happening, and wrong on the days that can take us down. And the danger is twofold: in a crisis, correlations estimated in calm times climb towards 1 — the diversification our limits rest on evaporates at the worst possible moment. Tail risk understated, concentration risk understated: normality smiles at us twice at exactly the wrong time.

My recommendations fit in three points: systematic stress tests, historical scenarios replayed — 1987, 2008, 2020 — and fat-tailed laws on our critical exposures. With one piece of lucidity: our simulators reproduce their models, not the world — a million lognormal paths will never invent the tails the lognormal ignores.

And the final nuance, to be fair: the normal remains excellent at the centre of the distribution, where 95% of days live — let us keep it for the everyday. The sin is not using it. It is forgetting that we are using it. Thank you.`,
  },
];
