import type { JuryQuestion } from '../../../engine/types';

const M12 = '12-gestion-actifs-risques';

export const jury: JuryQuestion[] = [
  {
    id: 'm12-j-01',
    moduleId: M12,
    theme: 'le portefeuille : le seul repas gratuit',
    themeEn: 'the portfolio: the only free lunch',
    difficulte: 2,
    question: 'Pourquoi dit-on que la diversification est le seul repas gratuit de la finance ?',
    questionEn: 'Why is diversification called the only free lunch in finance?',
    plan: [
      'Poser l\'asymétrie fondatrice : le rendement se moyenne — 0,6 × 8 + 0,4 × 3 = 6 % pour le 60/40 — mais le risque, lui, ne se moyenne pas',
      'Dérouler LA formule du module : σₚ = √(w₁²σ₁² + w₂²σ₂² + 2 w₁w₂ ρ σ₁σ₂) — trois termes, et seul le terme croisé contient la corrélation : c\'est lui qui porte toute l\'histoire',
      'Chiffrer sur le 60/40 canonique (vol 20/10, ρ 0,3) : 144 + 16 + 28,8 = 188,8 sous la racine ⇒ 13,740451 % — contre 16 % de moyenne pondérée : plus de deux points de risque disparus, rendement intact à 6 %',
      'Nuancer : le repas est gratuit mais pas garanti — à ρ = 1 il disparaît (16 % exactement), et seul le risque spécifique fond ; le systématique reste, quel que soit le nombre de lignes',
    ],
    planEn: [
      'Set the founding asymmetry: return averages — 0.6 × 8 + 0.4 × 3 = 6% for the 60/40 — but risk does not average',
      'Unroll THE formula of the module: σₚ = √(w₁²σ₁² + w₂²σ₂² + 2 w₁w₂ ρ σ₁σ₂) — three terms, and only the cross term contains the correlation: it carries the whole story',
      'Put numbers on the canonical 60/40 (vols 20/10, ρ 0.3): 144 + 16 + 28.8 = 188.8 under the root ⇒ 13.740451% — against a 16% weighted average: more than two points of risk gone, return untouched at 6%',
      'Qualify: the lunch is free but not guaranteed — at ρ = 1 it vanishes (exactly 16%), and only specific risk melts away; systematic risk remains, whatever the number of lines',
    ],
    pointsAttendus: [
      'L\'asymétrie récitée en une phrase : le rendement espéré d\'un portefeuille est la moyenne pondérée des rendements ; sa volatilité est SOUS la moyenne pondérée dès que ρ < 1 — de la réduction de risque obtenue par pur assemblage, sans sacrifier un centime de rendement espéré',
      'Le calcul de tête sur le 60/40 : rendement 0,6 × 8 + 0,4 × 3 = 6 % ; sous la racine 0,36 × 400 + 0,16 × 100 + 2 × 0,6 × 0,4 × 0,3 × 20 × 10 = 188,8, soit σₚ = 13,740451 % contre 16 % en moyenne pondérée',
      'La lecture terme à terme : les deux premiers termes sont les contributions individuelles, le troisième — le terme croisé — est le seul où la corrélation apparaît : c\'est lui qui offre le repas',
      'Les cas limites qui bornent l\'histoire : ρ = 1 ⇒ 16 % exactement, deux actifs parfaitement corrélés sont un seul actif déguisé ; ρ = −1 ⇒ 8 %, et un choix de poids annulerait tout ; ρ = 0 ⇒ diviser par √n (14,142136 % pour deux actifs identiques à 20 % en 50/50)',
      'La limite structurelle : la diversification fait fondre le risque SPÉCIFIQUE (l\'usine qui brûle), pas le SYSTÉMATIQUE (la récession) — la courbe bute sur un plancher, et c\'est ce plancher que le CAPM rémunère',
      'Le mot d\'ordre d\'oral : ce n\'est pas le nombre de lignes qui diversifie, c\'est la corrélation entre elles',
    ],
    pointsAttendusEn: [
      'The asymmetry recited in one sentence: a portfolio\'s expected return is the weighted average of returns; its volatility sits BELOW the weighted average as soon as ρ < 1 — risk reduction obtained by pure assembly, without sacrificing a cent of expected return',
      'The mental calculation on the 60/40: return 0.6 × 8 + 0.4 × 3 = 6%; under the root 0.36 × 400 + 0.16 × 100 + 2 × 0.6 × 0.4 × 0.3 × 20 × 10 = 188.8, i.e. σₚ = 13.740451% against 16% as a weighted average',
      'The term-by-term reading: the first two terms are the individual contributions; the third — the cross term — is the only one where correlation appears: it is the one serving the lunch',
      'The limit cases that frame the story: ρ = 1 ⇒ exactly 16%, two perfectly correlated assets are one asset in disguise; ρ = −1 ⇒ 8%, and one choice of weights would cancel everything; ρ = 0 ⇒ divide by √n (14.142136% for two identical 20% assets at 50/50)',
      'The structural limit: diversification melts SPECIFIC risk (the factory that burns down), not SYSTEMATIC risk (the recession) — the curve hits a floor, and that floor is what the CAPM prices',
      'The oral watchword: it is not the number of lines that diversifies, it is the correlation between them',
    ],
    bonus: [
      'Les études classiques (Evans et Archer 1968, Statman 1987) : une vingtaine de titres capture l\'essentiel du bénéfice, au-delà de 30-50 lignes le gain marginal est minuscule — et diversifier ENTRE classes d\'actifs reste plus puissant que multiplier les lignes dans une seule',
      'La réserve du m11, à placer avant qu\'on vous la demande : les corrélations montent vers 1 dans les crises — le repas gratuit disparaît précisément quand on en a le plus besoin',
    ],
    bonusEn: [
      'The classic studies (Evans and Archer 1968, Statman 1987): about twenty stocks capture most of the benefit, beyond 30-50 lines the marginal gain is tiny — and diversifying ACROSS asset classes remains more powerful than multiplying lines within one',
      'The m11 caveat, volunteered before the jury asks: correlations rise towards 1 in crises — the free lunch disappears precisely when you need it most',
    ],
    reponseModele: `Parce que c'est de la réduction de risque obtenue **sans payer** — ni en rendement, ni en prime. Le rendement d'un portefeuille se moyenne : le 60/40 canonique — 60 % d'actions à 8 %, 40 % d'obligations à 3 % — rend 0,6 × 8 + 0,4 × 3 = **6 %**, linéairement. Le risque, lui, ne se moyenne pas : σₚ = √(w₁²σ₁² + w₂²σ₂² + 2 w₁w₂ ρ σ₁σ₂). Trois termes sous la racine, et un seul contient la corrélation — le terme croisé. Dès que ρ < 1, il est plus petit que ce qu'exigerait la moyenne, et la racine sort en dessous.

Le chiffre du cours : volatilités 20 et 10, ρ = 0,3 — sous la racine 144 + 16 + 28,8 = 188,8, soit **13,740451 %**, quand la moyenne pondérée donnerait **16 %**. Plus de deux points de volatilité ont disparu, et le rendement n'a pas bougé : voilà le repas gratuit, servi par le seul assemblage.

Deux garde-fous pour une réponse complète. D'abord, ce n'est pas le nombre de lignes qui diversifie, c'est la corrélation : à ρ = 1, la formule rend exactement 16 % — mille actifs parfaitement corrélés sont un seul actif déguisé. Ensuite, seul le risque **spécifique** fond ; le **systématique** — la récession qui frappe toutes les lignes — reste, et c'est lui que le CAPM rémunérera. Et la réserve du module 11 : en crise, les corrélations montent vers 1 — le repas gratuit est un outil de croisière, pas un gilet de sauvetage.`,
    reponseModeleEn: `Because it is risk reduction obtained **without paying** — neither in return nor in premium. A portfolio's return averages: the canonical 60/40 — 60% equities at 8%, 40% bonds at 3% — yields 0.6 × 8 + 0.4 × 3 = **6%**, linearly. Risk does not average: σₚ = √(w₁²σ₁² + w₂²σ₂² + 2 w₁w₂ ρ σ₁σ₂). Three terms under the root, and only one contains the correlation — the cross term. As soon as ρ < 1, it is smaller than a simple average would require, and the root comes out below.

The course number: volatilities 20 and 10, ρ = 0.3 — under the root 144 + 16 + 28.8 = 188.8, i.e. **13.740451%**, when the weighted average would give **16%**. More than two points of volatility have vanished, and the return has not moved: that is the free lunch, served by assembly alone.

Two guard-rails for a complete answer. First, it is not the number of lines that diversifies, it is the correlation: at ρ = 1 the formula returns exactly 16% — a thousand perfectly correlated assets are one asset in disguise. Second, only **specific** risk melts; **systematic** risk — the recession hitting every line — remains, and it is what the CAPM will price. And the module 11 caveat: in crises, correlations rise towards 1 — the free lunch is a cruising tool, not a life jacket.`,
  },
  {
    id: 'm12-j-02',
    moduleId: M12,
    theme: 'le portefeuille : le seul repas gratuit',
    themeEn: 'the portfolio: the only free lunch',
    difficulte: 2,
    question: 'Deux actifs très volatils peuvent-ils former un portefeuille peu risqué ?',
    questionEn: 'Can two very volatile assets form a low-risk portfolio?',
    plan: [
      'Répondre net : oui — le risque d\'un portefeuille ne dépend pas que des volatilités individuelles, mais de la corrélation qui les lie',
      'Donner le cas extrême : à ρ = −1, il existe un choix de poids (celui qui égalise w₁σ₁ et w₂σ₂) qui annule TOUTE la volatilité — deux actifs à 20 et 40 % de vol peuvent faire un portefeuille à 0 %',
      'Donner le cas intermédiaire : à ρ = 0, deux actifs identiques à 20 % en 50/50 rendent 14,142136 % — diviser par √2, et par √n avec n actifs indépendants',
      'Nommer l\'objet : un actif corrélé à −1 avec la position est une couverture — vendre un future contre un book (m7) est le cas limite de la diversification',
    ],
    planEn: [
      'Answer squarely: yes — a portfolio\'s risk does not depend only on individual volatilities, but on the correlation linking them',
      'Give the extreme case: at ρ = −1, there is a choice of weights (the one equalising w₁σ₁ and w₂σ₂) that cancels ALL volatility — two assets at 20% and 40% vol can make a 0% portfolio',
      'Give the intermediate case: at ρ = 0, two identical 20% assets at 50/50 yield 14.142136% — divide by √2, and by √n with n independent assets',
      'Name the object: an asset correlated at −1 with the position is a hedge — selling a future against a book (m7) is the limit case of diversification',
    ],
    pointsAttendus: [
      'Le renversement de perspective : la question piège suppose que le risque s\'additionne — or il se compose via la formule à trois termes, et le terme croisé peut être massivement négatif',
      'Le calcul témoin à ρ = −1 : le 60/40 à vols 20/10 tombe à |0,6 × 20 − 0,4 × 10| = 8 % ; et le choix w₁ = 1/3, w₂ = 2/3 (qui égalise 1/3 × 20 et 2/3 × 10) annule tout',
      'Le lien avec la couverture : c\'est exactement ce que fait une vente de futures contre une position (m7) — s\'adjoindre un actif corrélé à −1 ; la couverture est le cas limite de la diversification',
      'Le cas ρ = 0 : deux actifs indépendants à 20 % en 50/50 donnent 14,142136 % — la loi des grands nombres divise par √n',
      'La réserve obligatoire : ces corrélations sont estimées en temps calme — en crise elles montent vers 1 (m11), et le portefeuille « peu risqué » redevient la somme de ses volatilités',
    ],
    pointsAttendusEn: [
      'The reversal of perspective: the trap question assumes risk adds up — but it compounds through the three-term formula, and the cross term can be massively negative',
      'The witness calculation at ρ = −1: the 60/40 at vols 20/10 falls to |0.6 × 20 − 0.4 × 10| = 8%; and the choice w₁ = 1/3, w₂ = 2/3 (equalising 1/3 × 20 and 2/3 × 10) cancels everything',
      'The link to hedging: it is exactly what selling futures against a position does (m7) — adding an asset correlated at −1; hedging is the limit case of diversification',
      'The ρ = 0 case: two independent 20% assets at 50/50 give 14.142136% — the law of large numbers divides by √n',
      'The mandatory caveat: these correlations are estimated in calm times — in crises they rise towards 1 (m11), and the "low-risk" portfolio becomes the sum of its volatilities again',
    ],
    bonus: [
      'La formulation qui plaît au jury : la volatilité est une propriété de l\'actif, le risque du portefeuille est une propriété de la MATRICE de corrélation — on ne juge jamais une ligne isolément',
      'Le pont vers le CAPM : le même argument, poussé à l\'équilibre, dit qu\'un actif très volatil mais décorrélé du marché a un bêta minuscule — son risque est diversifiable, donc non rémunéré',
    ],
    bonusEn: [
      'The phrasing juries like: volatility is a property of the asset, portfolio risk is a property of the correlation MATRIX — you never judge a line in isolation',
      'The bridge to the CAPM: the same argument, pushed to equilibrium, says a very volatile asset uncorrelated with the market has a tiny beta — its risk is diversifiable, hence unpaid',
    ],
    reponseModele: `Oui — et c'est même toute la leçon de Markowitz : le risque d'un portefeuille n'est pas une propriété de ses lignes, mais de la **corrélation** qui les lie. La formule le montre : σₚ = √(w₁²σ₁² + w₂²σ₂² + 2 w₁w₂ ρ σ₁σ₂). Les deux premiers termes portent les volatilités individuelles ; le troisième porte ρ — et il peut être massivement négatif.

Le cas extrême d'abord : à **ρ = −1**, le 60/40 à volatilités 20/10 tombe à |0,6 × 20 − 0,4 × 10| = **8 %**, et le choix de poids qui égalise w₁σ₁ et w₂σ₂ — un tiers/deux tiers ici — annule **toute** la volatilité. Deux actifs très volatils, un portefeuille à zéro. Vous connaissez cet objet : c'est une **couverture** — vendre un future contre une position (module 7), c'est s'adjoindre un actif corrélé à −1 ; la couverture est le cas limite de la diversification.

Le cas ordinaire ensuite : à **ρ = 0**, deux actifs identiques à 20 % de volatilité en 50/50 rendent **14,142136 %** — diviser par √2, et n actifs indépendants divisent par √n.

La réserve qui fait la bonne copie : ces corrélations sont **estimées en temps calme**. En crise, elles montent vers 1 (module 11), et le portefeuille « peu risqué » redevient brutalement la somme de ses volatilités. La réponse complète tient donc en deux temps : oui, par construction — tant que la corrélation tient.`,
    reponseModeleEn: `Yes — and that is the whole lesson of Markowitz: a portfolio's risk is not a property of its lines, but of the **correlation** linking them. The formula shows it: σₚ = √(w₁²σ₁² + w₂²σ₂² + 2 w₁w₂ ρ σ₁σ₂). The first two terms carry the individual volatilities; the third carries ρ — and it can be massively negative.

The extreme case first: at **ρ = −1**, the 60/40 with volatilities 20/10 falls to |0.6 × 20 − 0.4 × 10| = **8%**, and the choice of weights that equalises w₁σ₁ and w₂σ₂ — one third/two thirds here — cancels **all** the volatility. Two very volatile assets, a zero-risk portfolio. You know this object: it is a **hedge** — selling a future against a position (module 7) means adding an asset correlated at −1; hedging is the limit case of diversification.

The ordinary case next: at **ρ = 0**, two identical 20% assets at 50/50 yield **14.142136%** — dividing by √2, and n independent assets divide by √n.

The caveat that makes a good answer: these correlations are **estimated in calm times**. In a crisis they rise towards 1 (module 11), and the "low-risk" portfolio brutally becomes the sum of its volatilities again. The complete answer therefore comes in two beats: yes, by construction — as long as the correlation holds.`,
  },
  {
    id: 'm12-j-03',
    moduleId: M12,
    theme: 'le portefeuille : le seul repas gratuit',
    themeEn: 'the portfolio: the only free lunch',
    difficulte: 3,
    question: 'Que deviennent les corrélations en période de crise, et qu\'en déduire pour la diversification ?',
    questionEn: 'What happens to correlations in a crisis, and what does that imply for diversification?',
    plan: [
      'Le fait, sans détour : en crise, les corrélations montent vers 1 — actions, crédit, immobilier, matières premières chutent ensemble (m11)',
      'Le mécanisme : ventes forcées et appels de marge — quand tout le monde doit vendre tout en même temps, le lien statistique entre actifs devient un lien de trésorerie entre porteurs',
      'La conséquence dans la formule : le terme croisé 2 w₁w₂ ρ σ₁σ₂ gonfle au pire moment — le repas gratuit disparaît précisément quand on en a le plus besoin',
      'La déduction pratique : la diversification est un outil de croisière, pas un gilet de sauvetage — d\'où les stress tests à corrélations stressées et les couvertures explicites (options du m8) pour la queue',
    ],
    planEn: [
      'The fact, stated squarely: in crises, correlations rise towards 1 — equities, credit, real estate, commodities fall together (m11)',
      'The mechanism: forced selling and margin calls — when everyone must sell everything at once, the statistical link between assets becomes a cash link between holders',
      'The consequence inside the formula: the cross term 2 w₁w₂ ρ σ₁σ₂ swells at the worst moment — the free lunch disappears precisely when you need it most',
      'The practical deduction: diversification is a cruising tool, not a life jacket — hence stress tests with stressed correlations and explicit hedges (m8 options) for the tail',
    ],
    pointsAttendus: [
      'Le constat empirique du m11 : dans toutes les grandes crises — 2008, mars 2020 — des actifs faiblement corrélés en temps calme se mettent à chuter ensemble ; « tout se vend en même temps »',
      'Le mécanisme, pas seulement le fait : les corrélations de crise ne sont pas un caprice statistique — elles viennent des ventes forcées, des appels de marge et du désendettement simultané des porteurs (les spirales du m11)',
      'La traduction dans la formule du chapitre 1 : c\'est le terme croisé, celui-là même qui offrait le repas gratuit, qui gonfle quand ρ monte — la protection s\'évapore par le canal qui la fournissait',
      'Le parallèle avec le AAA de structure du m5 : une protection construite sur des corrélations estimées en temps calme est une protection qui s\'évapore en tempête — même leçon, autre objet',
      'La déduction opérationnelle : ne pas jeter la diversification (elle travaille tous les jours ordinaires), mais la compléter — stress tests avec corrélations à 1, limites de concentration, couvertures optionnelles pour la queue',
    ],
    pointsAttendusEn: [
      'The m11 empirical record: in every major crisis — 2008, March 2020 — assets weakly correlated in calm times start falling together; "everything gets sold at once"',
      'The mechanism, not just the fact: crisis correlations are no statistical whim — they come from forced selling, margin calls and the simultaneous deleveraging of holders (the m11 spirals)',
      'The translation into the chapter 1 formula: it is the cross term, the very one serving the free lunch, that swells as ρ rises — the protection evaporates through the channel that provided it',
      'The parallel with the m5 structured AAA: protection built on correlations estimated in calm times is protection that evaporates in a storm — same lesson, different object',
      'The operational deduction: do not discard diversification (it works every ordinary day), but complement it — stress tests with correlations at 1, concentration limits, optional hedges for the tail',
    ],
    bonus: [
      'La précision qui distingue : l\'asymétrie est documentée — les corrélations montent davantage dans les baisses que dans les hausses ; la diversification protège mieux contre la hausse dont personne n\'a peur',
      'Le réflexe de desk : demander « quelle est la corrélation stressée de ce book ? » avant « quelle est sa corrélation historique ? » — et rejouer 2008 et mars 2020 sur le portefeuille d\'aujourd\'hui (ch. 5)',
    ],
    bonusEn: [
      'The distinguishing precision: the asymmetry is documented — correlations rise more in sell-offs than in rallies; diversification protects best against the rally nobody fears',
      'The desk reflex: ask "what is this book\'s stressed correlation?" before "what is its historical correlation?" — and replay 2008 and March 2020 on today\'s portfolio (ch. 5)',
    ],
    reponseModele: `Elles **montent vers 1** — c'est l'une des régularités les mieux documentées du module 11. En 2008 comme en mars 2020, des actifs faiblement corrélés en temps calme — actions, crédit, immobilier, matières premières — se sont mis à chuter ensemble. Le mécanisme n'est pas statistique mais mécanique : ventes forcées, appels de marge, désendettement simultané. Quand tous les porteurs doivent lever du cash en même temps, ils vendent **ce qui se vend**, pas ce qu'ils jugent cher — et le lien entre actifs devient un lien de trésorerie entre porteurs.

La traduction dans la formule du portefeuille est cruelle : le terme croisé 2 w₁w₂ ρ σ₁σ₂ — celui-là même qui offrait le repas gratuit — gonfle quand ρ monte. À la limite ρ = 1, la volatilité rejoint la moyenne pondérée : le 60/40 qui vivait à 13,74 % se retrouve à 16 %. La protection s'évapore par le canal qui la fournissait, exactement comme le AAA de structure du module 5 : une défense construite sur des corrélations estimées en temps calme meurt en tempête.

Qu'en déduire ? Pas d'abandonner la diversification — elle travaille tous les jours ordinaires, et ils sont l'immense majorité. Mais la compléter : des **stress tests** qui rejouent 2008 avec des corrélations à 1, des limites de concentration, et pour la queue de distribution, des couvertures **explicites** — les options du module 8 — dont le prix, lui, ne trahit pas. La diversification est un outil de croisière, pas un gilet de sauvetage.`,
    reponseModeleEn: `They **rise towards 1** — one of the best-documented regularities of module 11. In 2008 as in March 2020, assets weakly correlated in calm times — equities, credit, real estate, commodities — started falling together. The mechanism is not statistical but mechanical: forced selling, margin calls, simultaneous deleveraging. When every holder must raise cash at once, they sell **what can be sold**, not what they think is expensive — and the link between assets becomes a cash link between holders.

The translation into the portfolio formula is cruel: the cross term 2 w₁w₂ ρ σ₁σ₂ — the very one serving the free lunch — swells as ρ rises. At the limit ρ = 1, volatility reaches the weighted average: the 60/40 living at 13.74% finds itself at 16%. The protection evaporates through the channel that provided it, exactly like the structured AAA of module 5: a defence built on correlations estimated in calm times dies in the storm.

What to deduce? Not to abandon diversification — it works every ordinary day, and ordinary days are the overwhelming majority. But to complement it: **stress tests** replaying 2008 with correlations at 1, concentration limits, and for the tail of the distribution, **explicit** hedges — the options of module 8 — whose price, at least, does not betray you. Diversification is a cruising tool, not a life jacket.`,
  },
  {
    id: 'm12-j-04',
    moduleId: M12,
    theme: 'la frontière efficiente et le CAPM',
    themeEn: 'the efficient frontier and the CAPM',
    difficulte: 1,
    question: 'Expliquez le bêta en 90 secondes, avec un calcul de tête.',
    questionEn: 'Explain beta in 90 seconds, with a mental calculation.',
    plan: [
      'Définir en une phrase : le bêta mesure la sensibilité d\'un actif aux mouvements du marché — β = ρ × σ_actif/σ_marché, la corrélation ET la volatilité relative',
      'Faire le calcul de tête : ρ = 0,8, σ_actif = 25 %, σ_marché = 15 % ⇒ β = 0,8 × 25/15 = 1,333333 — l\'actif amplifie le marché d\'un tiers',
      'Donner l\'usage : le CAPM ne rémunère que le bêta — r = r_f + β × prime, soit 3 + 1,2 × 5 = 9 % — et le bêta d\'un portefeuille est la moyenne pondérée des bêtas',
      'Refermer sur le piège : le bêta n\'est PAS la volatilité — un actif très volatil mais décorrélé a un bêta minuscule, son risque est diversifiable donc gratuit',
    ],
    planEn: [
      'Define in one sentence: beta measures an asset\'s sensitivity to market moves — β = ρ × σ_asset/σ_market, correlation AND relative volatility',
      'Run the mental calculation: ρ = 0.8, σ_asset = 25%, σ_market = 15% ⇒ β = 0.8 × 25/15 = 1.333333 — the asset amplifies the market by a third',
      'Give the usage: the CAPM only pays for beta — r = r_f + β × premium, i.e. 3 + 1.2 × 5 = 9% — and a portfolio\'s beta is the weighted average of its lines\' betas',
      'Close on the trap: beta is NOT volatility — a very volatile but uncorrelated asset has a tiny beta, its risk is diversifiable hence free',
    ],
    pointsAttendus: [
      'La formule récitée sans hésiter : β = ρ × σ_actif/σ_marché — et la lecture des deux ingrédients : la corrélation dit si l\'actif bouge AVEC le marché, le rapport des volatilités dit de COMBIEN',
      'Le calcul de tête exact : 0,8 × 25/15 = 1,333333 — énoncé avec l\'interprétation « amplifie les mouvements du marché d\'environ un tiers »',
      'L\'ancrage CAPM : seul le risque systématique est rémunéré, le long de la SML — r = r_f + β(r_m − r_f), avec 3 + 1,2 × 5 = 9 % et une prime de marché de 4 à 6 % par an en longue période',
      'L\'usage de desk : bêta de portefeuille = moyenne pondérée des bêtas ; un book de 120 M à bêta 1,2 s\'expose pour 144 M équivalent-indice — c\'est ce montant qui dimensionne la couverture en futures (m7)',
      'Le contre-exemple qui verrouille : la biotech à 40 % de volatilité mais ρ ≈ 0 a un bêta proche de zéro — risque énorme, mais diversifiable, donc non rémunéré',
    ],
    pointsAttendusEn: [
      'The formula recited without hesitation: β = ρ × σ_asset/σ_market — and the reading of both ingredients: correlation says whether the asset moves WITH the market, the volatility ratio says by HOW MUCH',
      'The exact mental calculation: 0.8 × 25/15 = 1.333333 — stated with the interpretation "amplifies market moves by about a third"',
      'The CAPM anchor: only systematic risk is paid, along the SML — r = r_f + β(r_m − r_f), with 3 + 1.2 × 5 = 9% and a market premium of 4 to 6% a year over the long run',
      'The desk usage: portfolio beta = weighted average of betas; a 120M book at beta 1.2 is exposed to 144M index-equivalent — that amount, not the book value, sizes the futures hedge (m7)',
      'The counter-example that locks it in: the biotech at 40% volatility but ρ ≈ 0 has a beta near zero — enormous risk, but diversifiable, hence unpaid',
    ],
    bonus: [
      'La distinction CML/SML placée sans qu\'on la demande : la CML porte la volatilité totale et ne contient que les portefeuilles efficients ; la SML porte le bêta et contient TOUS les actifs — la biotech est loin sous la CML mais exactement sur la SML',
      'Le vocabulaire du métier : fonds « high beta » contre stratégies « defensive » low-beta — et l\'alpha, ce qui reste quand on a payé le bêta, comme denrée rare du chapitre 3',
    ],
    bonusEn: [
      'The CML/SML distinction volunteered: the CML carries total volatility and contains only efficient portfolios; the SML carries beta and contains ALL assets — the biotech is far below the CML yet exactly on the SML',
      'The trade vocabulary: "high beta" funds versus "defensive" low-beta strategies — and alpha, what remains once beta is paid for, as the scarce commodity of chapter 3',
    ],
    reponseModele: `Le bêta mesure la sensibilité d'un actif aux mouvements du **marché** — pas son risque total. La formule : **β = ρ × σ_actif/σ_marché**. Deux ingrédients, à lire séparément : la corrélation dit si l'actif bouge *avec* le marché ; le rapport des volatilités dit de *combien* il amplifie.

Le calcul de tête : un actif à 25 % de volatilité, corrélé à 0,8 avec un marché à 15 % — β = 0,8 × 25/15 = **1,333333**. L'actif amplifie les mouvements du marché d'environ un tiers : marché +3 %, lui +4 %, en espérance.

À quoi sert-il ? C'est la seule variable que le CAPM rémunère : r = r_f + β × prime de marché — avec 3 % de taux sans risque, 5 % de prime et un bêta de 1,2, le rendement exigé est **9 %**, sur la SML. Le portefeuille hérite linéairement : le bêta d'un book est la moyenne pondérée des bêtas de ses lignes, et un book de 120 M à bêta 1,2 s'expose pour **144 M équivalent-indice** — c'est ce chiffre qui dimensionne la couverture en futures du module 7.

Le piège à désamorcer en conclusion : le bêta n'est **pas** la volatilité. Une biotech à 40 % de volatilité mais décorrélée du marché (ρ ≈ 0) a un bêta proche de zéro — son risque, énorme, est diversifiable, donc **gratuit** aux yeux du marché. On n'est pas payé pour le risque qu'on prend ; on est payé pour celui qu'on ne peut pas éliminer.`,
    reponseModeleEn: `Beta measures an asset's sensitivity to **market** moves — not its total risk. The formula: **β = ρ × σ_asset/σ_market**. Two ingredients, to be read separately: the correlation says whether the asset moves *with* the market; the volatility ratio says by *how much* it amplifies.

The mental calculation: an asset at 25% volatility, correlated at 0.8 with a 15% market — β = 0.8 × 25/15 = **1.333333**. The asset amplifies market moves by about a third: market +3%, the asset +4%, in expectation.

What is it for? It is the only variable the CAPM pays: r = r_f + β × market premium — with a 3% risk-free rate, a 5% premium and a beta of 1.2, the required return is **9%**, on the SML. The portfolio inherits linearly: a book's beta is the weighted average of its lines' betas, and a 120M book at beta 1.2 is exposed to **144M index-equivalent** — that figure, not the book value, sizes the module 7 futures hedge.

The trap to defuse in closing: beta is **not** volatility. A biotech at 40% volatility but uncorrelated with the market (ρ ≈ 0) has a beta near zero — its risk, enormous, is diversifiable, hence **free** in the market's eyes. You are not paid for the risk you take; you are paid for the risk you cannot eliminate.`,
  },
  {
    id: 'm12-j-05',
    moduleId: M12,
    theme: 'la frontière efficiente et le CAPM',
    themeEn: 'the efficient frontier and the CAPM',
    difficulte: 2,
    question: 'Un actif très volatil a-t-il forcément un bêta élevé ?',
    questionEn: 'Does a very volatile asset necessarily have a high beta?',
    plan: [
      'Répondre net : non — le bêta mêle la volatilité relative ET la corrélation : β = ρ × σ_actif/σ_marché, et ρ peut tout annuler',
      'Donner le contre-exemple canonique : une biotech à 40 % de volatilité en attente d\'essai clinique, ρ ≈ 0 avec le marché ⇒ bêta proche de zéro',
      'Expliquer pourquoi c\'est cohérent : son risque est spécifique, donc diversifiable, donc non rémunéré — la volatilité mesure le risque total, le bêta n\'en retient que la part systématique',
      'Refermer sur la géométrie : cet actif est très loin sous la CML (trop de risque total pour son rendement) mais exactement SUR la SML (bêta ~0, rendement exigé ~r_f)',
    ],
    planEn: [
      'Answer squarely: no — beta mixes relative volatility AND correlation: β = ρ × σ_asset/σ_market, and ρ can cancel everything',
      'Give the canonical counter-example: a biotech at 40% volatility awaiting a clinical trial, ρ ≈ 0 with the market ⇒ beta near zero',
      'Explain why this is consistent: its risk is specific, hence diversifiable, hence unpaid — volatility measures total risk, beta only keeps the systematic share',
      'Close on the geometry: this asset sits far below the CML (too much total risk for its return) yet exactly ON the SML (beta ~0, required return ~r_f)',
    ],
    pointsAttendus: [
      'La formule et son terme oublié : β = ρ × σ_actif/σ_marché — la question piège fait oublier ρ, qui peut ramener à zéro le bêta de l\'actif le plus volatil du monde',
      'Le contre-exemple concret : la biotech dont tout le destin dépend d\'un essai clinique — 40 % de volatilité, mais un résultat indépendant du cycle économique : ρ ≈ 0, bêta ≈ 0',
      'La comparaison inverse qui complète : un actif modérément volatil mais très corrélé peut avoir un bêta supérieur — 0,8 × 25/15 = 1,333333 bat le bêta de la biotech malgré une volatilité moindre',
      'La logique CAPM assumée : le risque spécifique se diversifie dans le portefeuille de marché, personne n\'a besoin d\'être payé pour le porter — seule la contribution systématique est rémunérée',
      'La distinction CML/SML : l\'actif volatil décorrélé est sous la CML mais SUR la SML — c\'est précisément ce que le CAPM veut dire par « le marché ne price que le bêta »',
    ],
    pointsAttendusEn: [
      'The formula and its forgotten term: β = ρ × σ_asset/σ_market — the trap makes you forget ρ, which can bring the world\'s most volatile asset\'s beta to zero',
      'The concrete counter-example: the biotech whose whole fate hangs on a clinical trial — 40% volatility, but an outcome independent of the economic cycle: ρ ≈ 0, beta ≈ 0',
      'The reverse comparison that completes it: a moderately volatile but highly correlated asset can have a higher beta — 0.8 × 25/15 = 1.333333 beats the biotech\'s beta despite lower volatility',
      'The CAPM logic owned: specific risk diversifies away inside the market portfolio, nobody needs to be paid to carry it — only the systematic contribution is priced',
      'The CML/SML distinction: the volatile uncorrelated asset is below the CML but ON the SML — precisely what the CAPM means by "the market only prices beta"',
    ],
    bonus: [
      'La nuance empirique qui impressionne : l\'anomalie low-vol — les actions à faible volatilité rapportent PLUS que leur bêta ne l\'exige, à rebours exact de la SML ; le modèle est un langage plus qu\'une loi',
      'Le réflexe de gérant : avant d\'acheter « de la volatilité », demander si elle est corrélée — le même 40 % de vol coûte très cher en bêta s\'il vient des semi-conducteurs, presque rien s\'il vient d\'un essai clinique',
    ],
    bonusEn: [
      'The empirical nuance that impresses: the low-vol anomaly — low-volatility stocks return MORE than their beta requires, the exact reverse of the SML; the model is a language more than a law',
      'The manager\'s reflex: before buying "volatility", ask whether it is correlated — the same 40% vol costs a lot in beta if it comes from semiconductors, almost nothing if it comes from a clinical trial',
    ],
    reponseModele: `Non — et la formule contient toute la réponse : **β = ρ × σ_actif/σ_marché**. Le bêta mêle deux ingrédients, la volatilité relative ET la corrélation, et le second peut annuler le premier. Un actif à 40 % de volatilité corrélé à zéro avec le marché a un bêta proche de **zéro**.

Le contre-exemple canonique : une **biotech** en attente de résultat d'essai clinique. Sa volatilité est énorme — le titre peut faire ±60 % à l'annonce — mais l'issue de l'essai ne dépend en rien du cycle économique : ρ ≈ 0. À l'inverse, un actif à 25 % de volatilité corrélé à 0,8 avec un marché à 15 % porte un bêta de 0,8 × 25/15 = **1,333333** — plus exposé au marché que la biotech, avec une volatilité bien moindre.

Pourquoi est-ce cohérent, et non une bizarrerie ? Parce que le risque de la biotech est **spécifique** : dans le portefeuille de marché, il se dilue — personne n'a besoin d'être payé pour un risque que n'importe qui peut éliminer en diversifiant. La volatilité mesure le risque *total* ; le bêta n'en retient que la part *systématique*, la seule que le porteur d'un portefeuille diversifié subit réellement.

Géométriquement : la biotech est très loin **sous la CML** — trop de risque total pour son rendement — mais exactement **sur la SML** : bêta ~0, rendement exigé ~r_f. C'est toute l'idée du CAPM en une image : on n'est pas payé pour le risque qu'on prend, on est payé pour celui qu'on ne peut pas éliminer.`,
    reponseModeleEn: `No — and the formula contains the whole answer: **β = ρ × σ_asset/σ_market**. Beta mixes two ingredients, relative volatility AND correlation, and the second can cancel the first. An asset at 40% volatility with zero correlation to the market has a beta near **zero**.

The canonical counter-example: a **biotech** awaiting a clinical trial result. Its volatility is enormous — the stock can move ±60% on the announcement — but the trial's outcome does not depend on the economic cycle at all: ρ ≈ 0. Conversely, an asset at 25% volatility correlated at 0.8 with a 15% market carries a beta of 0.8 × 25/15 = **1.333333** — more exposed to the market than the biotech, on far less volatility.

Why is this consistent rather than a quirk? Because the biotech's risk is **specific**: inside the market portfolio it dilutes away — nobody needs to be paid for a risk anyone can eliminate by diversifying. Volatility measures *total* risk; beta only keeps the *systematic* share, the only one the holder of a diversified portfolio actually suffers.

Geometrically: the biotech sits far **below the CML** — too much total risk for its return — yet exactly **on the SML**: beta ~0, required return ~r_f. That is the whole idea of the CAPM in one picture: you are not paid for the risk you take, you are paid for the risk you cannot eliminate.`,
  },
  {
    id: 'm12-j-06',
    moduleId: M12,
    theme: 'la frontière efficiente et le CAPM',
    themeEn: 'the efficient frontier and the CAPM',
    difficulte: 3,
    question: 'Le CAPM est-il vrai ?',
    questionEn: 'Is the CAPM true?',
    plan: [
      'Refuser le binaire : distinguer la cohérence interne (impeccable), les hypothèses (ouvertement irréalistes) et la validité empirique (faible en coupe)',
      'Instruire à charge : anticipations homogènes, prêt illimité au taux sans risque, un « portefeuille de marché » introuvable — et surtout les anomalies persistantes : value, momentum, low-vol contredisent la SML, la relation bêta/rendement mesurée est plus plate que la théorie',
      'Instruire à décharge : le CAPM fournit l\'étalon qui manquait — un gérant de bêta 1,2 qui livre 11 % quand la SML exige 9 % a créé 2 points ; sans le modèle, impossible de le dire',
      'Conclure sur la formule du cours : le CAPM est un LANGAGE plus qu\'une loi — bêta, alpha, prime de risque structurent fiches de fonds, mandats et commentaires de gestion',
    ],
    planEn: [
      'Refuse the binary: distinguish internal consistency (impeccable), assumptions (openly unrealistic) and empirical validity (weak in the cross-section)',
      'Prosecute: homogeneous expectations, unlimited borrowing at the risk-free rate, an unfindable "market portfolio" — and above all the persistent anomalies: value, momentum, low-vol contradict the SML, the measured beta/return relation is flatter than theory',
      'Defend: the CAPM provides the missing yardstick — a beta-1.2 manager delivering 11% when the SML requires 9% has created 2 points; without the model, you could not say so',
      'Close on the course phrase: the CAPM is a LANGUAGE more than a law — beta, alpha, risk premium structure fund sheets, mandates and performance commentary',
    ],
    pointsAttendus: [
      'La structure de réponse en trois étages : logique interne / hypothèses / données — répondre « oui » ou « non » d\'un bloc est exactement ce que le jury guette',
      'Les hypothèses nommées sans complaisance : anticipations homogènes, prêt et emprunt illimités à r_f, pas de frais ni d\'impôts, un portefeuille de marché qui devrait contenir immobilier et capital humain — qu\'aucun indice ne capture',
      'Le bilan empirique précis : depuis les années 1980, la relation bêta/rendement en coupe est plus plate que prévu ; les anomalies value, momentum et low-vol persistent — les actions à FAIBLE volatilité rapportent plus que leur bêta ne l\'exige, à rebours exact de la SML',
      'La réponse académique : les modèles multi-facteurs (Fama-French trois puis cinq facteurs, Carhart) — un bêta par facteur, l\'alpha est ce qui survit à tous ; plus on ajoute de facteurs, plus la barre de l\'alpha monte',
      'La défense décisive : le modèle fournit l\'étalon — 3 + 1,2 × 5 = 9 % de rendement « normal » pour un bêta de 1,2, et tout écart devient mesurable ; le vocabulaire bêta/alpha est la grammaire du métier',
      'La conclusion en une phrase : un langage plus qu\'une loi — il prédit imparfaitement mais structure tout',
    ],
    pointsAttendusEn: [
      'The three-storey answer structure: internal logic / assumptions / data — answering "yes" or "no" in one block is exactly what the jury is watching for',
      'The assumptions named without indulgence: homogeneous expectations, unlimited lending and borrowing at r_f, no fees or taxes, a market portfolio that should contain real estate and human capital — which no index captures',
      'The precise empirical record: since the 1980s, the cross-sectional beta/return relation is flatter than predicted; the value, momentum and low-vol anomalies persist — LOW-volatility stocks return more than their beta requires, the exact reverse of the SML',
      'The academic response: multi-factor models (Fama-French three then five factors, Carhart) — one beta per factor, alpha is what survives them all; the more factors you add, the higher the alpha bar',
      'The decisive defence: the model provides the yardstick — 3 + 1.2 × 5 = 9% of "normal" return for a 1.2 beta, and any gap becomes measurable; the beta/alpha vocabulary is the grammar of the trade',
      'The one-sentence conclusion: a language more than a law — it predicts imperfectly but structures everything',
    ],
    bonus: [
      'Le parallèle avec le m8 qui fait mouche : Black-Scholes aussi est « faux » (le smile le prouve) et pourtant indispensable — la finance garde ses modèles faux quand ils fournissent la langue commune de la négociation',
      'La conséquence pratique du multi-facteurs : ce qui passait pour de l\'alpha sous le CAPM n\'est souvent qu\'un bêta value ou momentum qui ne dit pas son nom — d\'où le smart beta, qui vend ces primes pour quelques points de base',
    ],
    bonusEn: [
      'The m8 parallel that lands: Black-Scholes too is "wrong" (the smile proves it) and yet indispensable — finance keeps its wrong models when they provide the common language of negotiation',
      'The practical consequence of multi-factor models: what passed for alpha under the CAPM is often just a value or momentum beta in disguise — hence smart beta, selling those premia for a few basis points',
    ],
    reponseModele: `La question appelle trois réponses, pas une. **Comme théorème**, le CAPM est vrai : si ses hypothèses tiennent, la conclusion suit — tout le monde détient le portefeuille de marché, et seul le bêta est rémunéré le long de la SML.

**Comme description du monde**, il est faux, et doublement. Ses hypothèses d'abord : anticipations homogènes, prêt illimité au taux sans risque, pas de frais, et un « portefeuille de marché » qui devrait contenir tous les actifs du monde — immobilier et capital humain compris — qu'aucun indice ne capture. Ses prédictions ensuite : la relation bêta/rendement mesurée en coupe est **plus plate** que la théorie, et des anomalies persistantes la contredisent — value, momentum, et surtout low-vol : les actions à faible volatilité rapportent *plus* que leur bêta ne l'exige, à rebours exact de la SML. La réponse académique — Fama-French, trois puis cinq facteurs — généralise plutôt qu'elle n'abandonne : un bêta par facteur, et l'alpha est ce qui survit à tous.

**Comme langage**, enfin, il est irremplaçable — et c'est la vraie réponse. Le CAPM fournit l'étalon qui manquait au métier : si le rendement normal d'un bêta 1,2 est 3 + 1,2 × 5 = **9 %**, alors un gérant qui livre 11 % a créé quelque chose de mesurable, et un gérant à 8 % a détruit de la valeur en la maquillant. Fiches de fonds, mandats, attribution de performance : tout parle bêta et alpha. Le CAPM est un **langage plus qu'une loi** — il prédit imparfaitement, mais il structure tout.`,
    reponseModeleEn: `The question calls for three answers, not one. **As a theorem**, the CAPM is true: if its assumptions hold, the conclusion follows — everyone holds the market portfolio, and only beta is paid, along the SML.

**As a description of the world**, it is false, twice over. Its assumptions first: homogeneous expectations, unlimited borrowing at the risk-free rate, no fees, and a "market portfolio" that should contain every asset in the world — real estate and human capital included — which no index captures. Its predictions next: the measured cross-sectional beta/return relation is **flatter** than theory, and persistent anomalies contradict it — value, momentum, and above all low-vol: low-volatility stocks return *more* than their beta requires, the exact reverse of the SML. The academic response — Fama-French, three then five factors — generalises rather than abandons: one beta per factor, and alpha is what survives them all.

**As a language**, finally, it is irreplaceable — and that is the real answer. The CAPM provides the yardstick the trade lacked: if the normal return of a 1.2 beta is 3 + 1.2 × 5 = **9%**, then a manager delivering 11% has created something measurable, and a manager at 8% has destroyed value while dressing it up. Fund sheets, mandates, performance attribution: everything speaks beta and alpha. The CAPM is a **language more than a law** — it predicts imperfectly, but it structures everything.`,
  },
  {
    id: 'm12-j-07',
    moduleId: M12,
    theme: 'la frontière efficiente et le CAPM',
    themeEn: 'the efficient frontier and the CAPM',
    difficulte: 3,
    question: 'Que dit le théorème de séparation — et pourquoi fonde-t-il, trente ans à l\'avance, la gestion indicielle ?',
    questionEn: 'What does the separation theorem say — and why did it lay the ground, thirty years early, for index investing?',
    plan: [
      'Poser le décor : la frontière efficiente de Markowitz (chaque niveau de rendement a UN portefeuille de variance minimale), puis l\'ajout de l\'actif sans risque',
      'Dérouler le théorème : la droite qui part de r_f et tangente la frontière (la CML) domine toute la frontière — donc tout investisseur rationnel détient LE MÊME portefeuille risqué, le tangent, et ne règle son appétit qu\'en dosant cash ou levier',
      'Tirer la conséquence d\'équilibre : si tout le monde détient le même portefeuille risqué, il ne peut être que le marché entier, pondéré par les capitalisations',
      'Refermer sur la filiation : « détenez le marché, dosez le cash » est très exactement le programme de l\'ETF indiciel du chapitre 4 — la théorie de 1958 a écrit le produit de 1990',
    ],
    planEn: [
      'Set the scene: Markowitz\'s efficient frontier (each return level has ONE minimum-variance portfolio), then the addition of the risk-free asset',
      'Unroll the theorem: the line from r_f tangent to the frontier (the CML) dominates the whole frontier — so every rational investor holds THE SAME risky portfolio, the tangent one, and sets their risk appetite only by dosing cash or leverage',
      'Draw the equilibrium consequence: if everyone holds the same risky portfolio, it can only be the entire market, capitalisation-weighted',
      'Close on the lineage: "hold the market, dose the cash" is exactly the programme of the chapter 4 index ETF — the theory of 1958 wrote the product of 1990',
    ],
    pointsAttendus: [
      'La mécanique géométrique : combiner du cash (volatilité nulle, corrélation nulle) avec un portefeuille risqué trace une DROITE dans le plan risque/rendement — et parmi toutes ces droites, celle qui tangente la frontière domine tout le reste',
      'L\'énoncé exact de la séparation : deux décisions indépendantes — QUOI détenir en risqué (le portefeuille tangent, identique pour tous) et COMBIEN en détenir (le dosage cash/levier, propre à chacun) ; le prudent 30/70, l\'agressif 150 % financé par emprunt',
      'Le passage à l\'équilibre : si tous les investisseurs détiennent le même portefeuille risqué, celui-ci EST le marché capi-pondéré — le portefeuille tangent devient observable, c\'est l\'indice',
      'La filiation avec le passif : le théorème dit que la brique risquée optimale est le marché lui-même — répliquer l\'indice n\'est pas un renoncement, c\'est la prescription du modèle',
      'La nuance honnête : la conclusion hérite des hypothèses du CAPM (anticipations homogènes, emprunt illimité à r_f) — en pratique les portefeuilles individuels divergent, mais l\'étalon reste',
    ],
    pointsAttendusEn: [
      'The geometric mechanics: combining cash (zero volatility, zero correlation) with a risky portfolio traces a STRAIGHT LINE in the risk/return plane — and among all those lines, the one tangent to the frontier dominates everything else',
      'The exact statement of separation: two independent decisions — WHAT to hold in risky assets (the tangent portfolio, identical for all) and HOW MUCH of it (the cash/leverage dosing, personal to each); the cautious 30/70, the aggressive 150% funded by borrowing',
      'The move to equilibrium: if all investors hold the same risky portfolio, it IS the cap-weighted market — the tangent portfolio becomes observable: it is the index',
      'The lineage to passive: the theorem says the optimal risky brick is the market itself — replicating the index is not a surrender, it is the model\'s prescription',
      'The honest nuance: the conclusion inherits the CAPM\'s assumptions (homogeneous expectations, unlimited borrowing at r_f) — in practice individual portfolios diverge, but the yardstick remains',
    ],
    bonus: [
      'Le détail qui montre la maîtrise : sous le point de variance minimale, la branche basse de la frontière est dominée — détenir 100 % d\'obligations « par prudence » est dominé par un mélange contenant un peu d\'actions',
      'Le raccourci historique : Tobin (1958) sépare, Sharpe (1964) met à l\'équilibre, Bogle (1976) vend le résultat — le premier fonds indiciel grand public est du CAPM appliqué',
    ],
    bonusEn: [
      'The detail that shows mastery: below the minimum-variance point, the lower branch of the frontier is dominated — holding 100% bonds "out of caution" is dominated by a mix containing some equities',
      'The historical shortcut: Tobin (1958) separates, Sharpe (1964) takes it to equilibrium, Bogle (1976) sells the result — the first retail index fund is applied CAPM',
    ],
    reponseModele: `Partez de Markowitz : parmi l'infinité des assemblages possibles, seuls ceux de la **frontière efficiente** méritent d'être détenus — pour chaque rendement visé, un seul portefeuille de variance minimale. Ajoutez maintenant l'actif sans risque. Combiner du cash — volatilité nulle, corrélation nulle — avec un portefeuille risqué P trace une **droite** dans le plan risque/rendement ; et parmi toutes ces droites, une seule domine : celle qui part de r_f et vient **tangenter** la frontière, la CML.

Le théorème de séparation en découle : le choix optimal se scinde en deux décisions **indépendantes**. *Quoi* détenir en risqué — le portefeuille tangent, le même pour tous ; et *combien* en détenir — le dosage cash/levier, propre à chacun. Le prudent : 30 % de tangent, 70 % de cash. L'agressif : 150 % financé par emprunt. Le contenu risqué, lui, ne change pas.

L'équilibre ferme la boucle : si tout le monde détient le même portefeuille risqué, celui-ci ne peut être qu'une chose — **le marché entier, pondéré par les capitalisations**. Le portefeuille tangent est observable : c'est l'indice.

D'où la filiation, et elle fait la bonne copie : « détenez le marché, réglez le risque avec du cash » est mot pour mot le programme de la **gestion indicielle** du chapitre 4. Tobin sépare en 1958, Sharpe met à l'équilibre en 1964, Bogle vend le résultat en 1976 : l'ETF n'est pas une renonciation à la théorie — c'en est l'application la plus littérale.`,
    reponseModeleEn: `Start from Markowitz: among the infinity of possible assemblies, only those on the **efficient frontier** deserve to be held — for each target return, a single minimum-variance portfolio. Now add the risk-free asset. Combining cash — zero volatility, zero correlation — with a risky portfolio P traces a **straight line** in the risk/return plane; and among all those lines, one dominates: the one from r_f that comes **tangent** to the frontier, the CML.

The separation theorem follows: the optimal choice splits into two **independent** decisions. *What* to hold in risky assets — the tangent portfolio, the same for everyone; and *how much* of it — the cash/leverage dosing, personal to each. The cautious investor: 30% tangent, 70% cash. The aggressive one: 150%, funded by borrowing. The risky content itself does not change.

Equilibrium closes the loop: if everyone holds the same risky portfolio, it can only be one thing — **the entire market, capitalisation-weighted**. The tangent portfolio is observable: it is the index.

Hence the lineage, and it makes the good answer: "hold the market, set your risk with cash" is word for word the programme of chapter 4's **index investing**. Tobin separates in 1958, Sharpe takes it to equilibrium in 1964, Bogle sells the result in 1976: the ETF is not a surrender of the theory — it is its most literal application.`,
  },
  {
    id: 'm12-j-08',
    moduleId: M12,
    theme: 'mesurer la performance : Sharpe, alpha, tracking error',
    themeEn: 'measuring performance: Sharpe, alpha, tracking error',
    difficulte: 2,
    question: 'Un client vous dit : « mon fonds a fait +12 % cette année, c\'est bien ? ». Que répondez-vous ?',
    questionEn: 'A client tells you: "my fund made +12% this year, is that good?". What do you answer?',
    plan: [
      'Refuser de répondre au chiffre nu : un rendement isolé ne dit rien — il faut un étalon, et le buy-side en a construit trois, emboîtés',
      'Premier étalon, le cash : le ratio de Sharpe (r − r_f)/σ — le risque total a-t-il payé ? Repères : 0,3-0,5 pour des actions passives, > 1 excellent, > 2 suspect',
      'Deuxième étalon, le marché ajusté du bêta : l\'alpha de Jensen — avec bêta 1,2, marché +10 %, cash 3 %, le CAPM exigeait 11,4 % : les +12 % ne contiennent que 0,6 % de talent',
      'Troisième étalon, le mandat : tracking error et ratio d\'information — la liberté accordée par le mandat a-t-elle été rentabilisée ?',
    ],
    planEn: [
      'Refuse to answer the naked number: an isolated return says nothing — you need a yardstick, and the buy-side built three, nested',
      'First yardstick, cash: the Sharpe ratio (r − r_f)/σ — did total risk pay? Anchors: 0.3-0.5 for passive equities, > 1 excellent, > 2 suspicious',
      'Second yardstick, the market adjusted for beta: Jensen\'s alpha — with beta 1.2, market +10%, cash 3%, the CAPM required 11.4%: the +12% contains only 0.6% of skill',
      'Third yardstick, the mandate: tracking error and information ratio — was the freedom granted by the mandate made profitable?',
    ],
    pointsAttendus: [
      'Le réflexe d\'oral : ne jamais commenter un chiffre de performance sans demander le risque et le benchmark qui vont avec — +12 % à 8 % de vol sur un marché à +5 % est remarquable ; +12 % à bêta 1,2 sur un marché à +10 % est banal',
      'Le Sharpe posé proprement : (r − r_f)/σ, sans unité — un fonds à 8 % avec 3 % de cash et 10 % de vol affiche 0,5 ; les repères récités : 0,3-0,5 passif, > 1 excellent, > 2 suspect',
      'L\'alpha calculé sur l\'exemple même du client : CAPM exige 3 + 1,2 × (10 − 3) = 11,4 % ⇒ alpha = +0,6 % — le piège « 2 points de talent » démonté : 1,4 point n\'est que la rémunération du bêta',
      'Le troisième étage : la tracking error se CHOISIT (le budget de liberté du mandat, 0,5 % indiciel, 2-6 % actif) et le ratio d\'information — surperformance/TE, 2/4 = 0,5, très bon si tenu dans la durée',
      'La hiérarchie des questions au client : quel risque ? quel benchmark ? quel mandat ? net ou brut de frais ? — la réponse est un questionnaire, pas un verdict',
    ],
    pointsAttendusEn: [
      'The oral reflex: never comment on a performance figure without asking for the risk and the benchmark that go with it — +12% at 8% vol in a +5% market is remarkable; +12% at beta 1.2 in a +10% market is ordinary',
      'The Sharpe laid out properly: (r − r_f)/σ, unitless — a fund at 8% with 3% cash and 10% vol shows 0.5; the anchors recited: 0.3-0.5 passive, > 1 excellent, > 2 suspicious',
      'The alpha computed on the client\'s own example: the CAPM requires 3 + 1.2 × (10 − 3) = 11.4% ⇒ alpha = +0.6% — the "2 points of skill" trap dismantled: 1.4 points are just the pay for beta',
      'The third storey: tracking error is CHOSEN (the mandate\'s freedom budget, 0.5% index funds, 2-6% active) and the information ratio — outperformance/TE, 2/4 = 0.5, very good if sustained',
      'The hierarchy of questions back to the client: what risk? what benchmark? what mandate? net or gross of fees? — the answer is a questionnaire, not a verdict',
    ],
    bonus: [
      'Les quatre falsificateurs du chapitre 3, cités d\'un trait : la fenêtre choisie, le biais du survivant (+1 à 2 % par an sur la moyenne des survivants), le levier (qui gonfle le rendement sans bouger le Sharpe), le brut de frais',
      'La décomposition de Brinson pour aller plus loin : allocation ou sélection ? — savoir D\'OÙ vient la surperformance dit pour quoi le client paie',
    ],
    bonusEn: [
      'The four falsifiers of chapter 3, cited in one breath: the chosen window, survivorship bias (+1 to 2% a year on the survivors\' average), leverage (which inflates return without moving the Sharpe), gross-of-fees figures',
      'Brinson decomposition to go further: allocation or selection? — knowing WHERE the outperformance comes from says what the client is paying for',
    ],
    reponseModele: `Honnêtement : **impossible à dire** — et c'est la seule réponse rigoureuse. Un rendement isolé ne signifie rien : +12 % avec 8 % de volatilité sur un marché à +5 % est remarquable ; +12 % avec un bêta de 1,2 sur un marché à +10 % est banal. Il faut un étalon, et le métier en a trois, emboîtés.

**Le cash** d'abord : le ratio de Sharpe, (r − r_f)/σ — le risque total a-t-il payé ? Repères : 0,3-0,5 pour des actions passives en longue période, au-delà de 1 excellent, au-delà de 2 suspect. **Le marché ajusté du risque** ensuite : l'alpha de Jensen. Faisons le calcul sur votre fonds — bêta 1,2, marché +10 %, cash 3 % : le CAPM exigeait 3 + 1,2 × 7 = **11,4 %**. Vos +12 % contiennent donc **0,6 %** de talent, pas 2 : le bêta est une amplification *achetée*, pas fabriquée — sur un marché haussier, un portefeuille plus risqué doit faire mieux que l'indice. **Le mandat** enfin : la tracking error — qui se choisit, contrairement à la volatilité qui se subit — et le ratio d'information, surperformance/TE : 2 % de surperformance pour 4 % de TE font 0,5, très bon si c'est tenu dans la durée.

Et avant tout verdict, quatre questions de contrôle : mesuré sur quelle fenêtre ? net ou brut de frais ? avec quel levier ? et les fonds fermés de la même société ? Un chiffre de performance est une réponse ; encore faut-il savoir à quelle question.`,
    reponseModeleEn: `Honestly: **impossible to say** — and that is the only rigorous answer. An isolated return means nothing: +12% with 8% volatility in a +5% market is remarkable; +12% with a 1.2 beta in a +10% market is ordinary. You need a yardstick, and the trade has three, nested.

**Cash** first: the Sharpe ratio, (r − r_f)/σ — did total risk pay? Anchors: 0.3-0.5 for passive equities over the long run, above 1 excellent, above 2 suspicious. **The market adjusted for risk** next: Jensen's alpha. Let us run it on your fund — beta 1.2, market +10%, cash 3%: the CAPM required 3 + 1.2 × 7 = **11.4%**. Your +12% therefore contains **0.6%** of skill, not 2: beta is amplification *bought*, not manufactured — in a rising market, a riskier portfolio must beat the index. **The mandate** finally: tracking error — which is chosen, unlike volatility, which is suffered — and the information ratio, outperformance/TE: 2% of outperformance on 4% of TE makes 0.5, very good if sustained over time.

And before any verdict, four control questions: measured over which window? net or gross of fees? with what leverage? and the closed funds of the same firm? A performance figure is an answer; you still need to know to which question.`,
  },
  {
    id: 'm12-j-09',
    moduleId: M12,
    theme: 'mesurer la performance : Sharpe, alpha, tracking error',
    themeEn: 'measuring performance: Sharpe, alpha, tracking error',
    difficulte: 2,
    question: 'Calcul de tête : un fonds de bêta 1,2 rend +12 % quand le marché fait +10 % et le cash 3 %. Quel est son alpha ?',
    questionEn: 'Mental arithmetic: a fund with a 1.2 beta returns +12% when the market makes +10% and cash 3%. What is its alpha?',
    plan: [
      'Poser l\'étalon : le rendement exigé par le CAPM, r_f + β(r_m − r_f) = 3 + 1,2 × (10 − 3) = 3 + 8,4 = 11,4 %',
      'Soustraire : alpha = 12 − 11,4 = +0,6 % — le gérant a battu SON risque, de peu',
      'Démonter le piège : « 12 contre 10, donc 2 points de talent » oublie que le bêta de 1,2 est une amplification achetée — 1,4 des 2 points ne sont que la rémunération normale du risque',
      'Donner le corollaire : un fonds à bêta 1 qui fait exactement le marché a un alpha NUL — un ETF l\'aurait livré pour presque rien',
    ],
    planEn: [
      'Set the yardstick: the CAPM-required return, r_f + β(r_m − r_f) = 3 + 1.2 × (10 − 3) = 3 + 8.4 = 11.4%',
      'Subtract: alpha = 12 − 11.4 = +0.6% — the manager beat HIS OWN risk, narrowly',
      'Dismantle the trap: "12 versus 10, so 2 points of skill" forgets that the 1.2 beta is bought amplification — 1.4 of the 2 points are just the normal pay for risk',
      'Give the corollary: a beta-1 fund that exactly matches the market has ZERO alpha — an ETF would have delivered it for almost nothing',
    ],
    pointsAttendus: [
      'La prime de marché isolée d\'abord : r_m − r_f = 10 − 3 = 7 % — l\'erreur classique est de multiplier le bêta par le rendement du marché (1,2 × 10) au lieu de la prime',
      'Le rendement exigé énoncé : 3 + 1,2 × 7 = 11,4 % — c\'est ce que le fonds AURAIT DÛ rendre compte tenu de son risque',
      'Le résultat net : alpha = 12 − 11,4 = +0,6 %, positif mais mince',
      'Le piège démonté explicitement : sur les 2 points d\'écart apparent au marché, 1,4 point est dû au bêta — de la rémunération du risque, pas de la sélection',
      'La qualification d\'usage : un alpha positif APRÈS frais est déjà rare (chapitre 4) — et 0,6 % s\'évapore dans 2 % de frais de gestion',
    ],
    pointsAttendusEn: [
      'The market premium isolated first: r_m − r_f = 10 − 3 = 7% — the classic error is multiplying beta by the market return (1.2 × 10) instead of the premium',
      'The required return stated: 3 + 1.2 × 7 = 11.4% — what the fund SHOULD have returned given its risk',
      'The clean result: alpha = 12 − 11.4 = +0.6%, positive but thin',
      'The trap dismantled explicitly: of the 2 apparent points over the market, 1.4 points are due to beta — pay for risk, not selection',
      'The usage qualification: positive alpha AFTER fees is already rare (chapter 4) — and 0.6% evaporates inside 2% management fees',
    ],
    bonus: [
      'La variante symétrique à avoir en tête : le même fonds sur un marché à −10 % « bat » l\'indice en faisant −11,4 % — le bêta joue dans les deux sens, l\'alpha se mesure de la même façon',
      'La question suivante du jury, anticipée : cet alpha est-il significatif ? Une année ne prouve rien — il faut la persistance, et le chapitre 4 montre qu\'elle est presque nulle en moyenne',
    ],
    bonusEn: [
      'The symmetric variant to keep in mind: the same fund in a −10% market "beats" the index by making −11.4% — beta works both ways, alpha is measured the same way',
      'The jury\'s next question, anticipated: is this alpha significant? One year proves nothing — you need persistence, and chapter 4 shows it is nearly zero on average',
    ],
    reponseModele: `Trois gestes, à voix haute. **Un** : isoler la prime de marché — r_m − r_f = 10 − 3 = 7 %. **Deux** : calculer ce que le CAPM exigeait de ce fonds compte tenu de son risque — r_f + β × prime = 3 + 1,2 × 7 = **11,4 %**. **Trois** : soustraire — alpha = 12 − 11,4 = **+0,6 %**.

Le piège que la question tend : répondre « 2 points de talent » parce que 12 > 10. C'est oublier que le bêta de 1,2 est une **amplification achetée, pas fabriquée** : sur un marché haussier, un portefeuille plus risqué que le marché *doit* faire mieux que lui — c'est de la rémunération du risque, pas de la sélection. Sur les 2 points d'écart apparent, **1,4 point** n'est que le loyer du bêta ; le talent, c'est 0,6.

L'autre erreur classique : multiplier le bêta par le rendement du marché (1,2 × 10 = 12) au lieu de la prime — elle donne un alpha nul par coïncidence et un raisonnement faux dans tous les autres cas.

Deux phrases pour finir en réponse de desk. Un fonds à bêta 1 qui fait exactement le marché a un alpha **nul** — il a livré ce qu'un ETF aurait livré pour trois points de base. Et 0,6 % d'alpha *brut* s'évapore dans 2 % de frais : l'alpha est la denrée la plus chère et la plus rare du buy-side — c'est précisément pour cela qu'on le mesure si soigneusement.`,
    reponseModeleEn: `Three moves, out loud. **One**: isolate the market premium — r_m − r_f = 10 − 3 = 7%. **Two**: compute what the CAPM required of this fund given its risk — r_f + β × premium = 3 + 1.2 × 7 = **11.4%**. **Three**: subtract — alpha = 12 − 11.4 = **+0.6%**.

The trap the question sets: answering "2 points of skill" because 12 > 10. That forgets that the 1.2 beta is **amplification bought, not manufactured**: in a rising market, a portfolio riskier than the market *must* beat it — that is pay for risk, not selection. Of the 2 apparent points of gap, **1.4 points** are just the rent on beta; the skill is 0.6.

The other classic error: multiplying beta by the market return (1.2 × 10 = 12) instead of the premium — it gives a zero alpha by coincidence here and a wrong reasoning in every other case.

Two sentences to finish like a desk. A beta-1 fund that exactly matches the market has **zero** alpha — it delivered what an ETF would have delivered for three basis points. And 0.6% of *gross* alpha evaporates inside 2% of fees: alpha is the most expensive and the rarest commodity of the buy-side — which is exactly why it is measured so carefully.`,
  },
  {
    id: 'm12-j-10',
    moduleId: M12,
    theme: 'mesurer la performance : Sharpe, alpha, tracking error',
    themeEn: 'measuring performance: Sharpe, alpha, tracking error',
    difficulte: 4,
    question: 'Un fonds vous présente un ratio de Sharpe de 4. Votre réaction ?',
    questionEn: 'A fund shows you a Sharpe ratio of 4. Your reaction?',
    plan: [
      'Poser les repères pour situer l\'énormité : 0,3-0,5 pour des actions passives en longue période, > 1 excellent, > 2 déjà suspect — 4 n\'est pas une performance, c\'est une anomalie à expliquer',
      'Nommer le mécanisme le plus probable : une stratégie qui VEND DE L\'ASSURANCE — vente d\'options (m8), portage de crédit (m5), arbitrage de convergence : prime petite et régulière, volatilité mesurée minuscule, et un risque de queue qui ne s\'est pas encore réalisé',
      'Citer le précédent : LTCM affichait un Sharpe supérieur à 4 avant 1998 — puis a perdu 4,3 Md$ en quelques semaines (m11) : la volatilité historique ne voit pas un risque absent de la fenêtre',
      'Dérouler la due diligence : d\'où vient le rendement ? la distribution a-t-elle une queue (skew, drawdowns) ? quel levier, quelle liquidité des positions, quelle fenêtre de mesure, et les fonds fermés de la société ?',
    ],
    planEn: [
      'Set the anchors to size the enormity: 0.3-0.5 for passive equities over the long run, > 1 excellent, > 2 already suspicious — 4 is not a performance, it is an anomaly to explain',
      'Name the most likely mechanism: a strategy that SELLS INSURANCE — option selling (m8), credit carry (m5), convergence arbitrage: small regular premium, tiny measured volatility, and a tail risk that simply has not happened yet',
      'Cite the precedent: LTCM showed a Sharpe above 4 before 1998 — then lost 4.3bn$ in a few weeks (m11): historical volatility cannot see a risk absent from the window',
      'Unroll the due diligence: where does the return come from? does the distribution have a tail (skew, drawdowns)? what leverage, what liquidity of positions, what measurement window, and the firm\'s closed funds?',
    ],
    pointsAttendus: [
      'La réaction immédiate assumée : la suspicion, pas l\'admiration — au-delà de 2, un Sharpe cesse d\'être une réponse et devient une question : d\'où vient un rendement aussi lisse ?',
      'Le mécanisme du vendeur d\'assurance expliqué : encaisser une petite prime régulière contre un paiement rare et massif — le rendement est lisse, la volatilité historique minuscule, le Sharpe superbe, tant que l\'événement n\'a pas eu lieu dans la fenêtre',
      'Le défaut structurel de l\'écart-type : la volatilité ne capte pas l\'asymétrie ni les queues — une distribution à petit gain fréquent et perte rare énorme peut afficher la même σ qu\'une distribution bénigne',
      'LTCM récité avec les chiffres : Sharpe > 4 avant 1998, 4,3 Md$ perdus en quelques semaines quand toutes les convergences ont divergé ensemble — la VaR quotidienne était impeccable, c\'est la queue qui a tué',
      'Les questions de due diligence concrètes : stratégie exacte et source du rendement, skew et pire drawdown, levier, liquidité des sous-jacents, fenêtre de mesure, fonds fermés (biais du survivant)',
      'La conclusion en une phrase : demander à voir la DISTRIBUTION, pas le ratio — un Sharpe de 4 durable et expliqué n\'existe pour ainsi dire pas',
    ],
    pointsAttendusEn: [
      'The immediate reaction owned: suspicion, not admiration — above 2, a Sharpe stops being an answer and becomes a question: where does such a smooth return come from?',
      'The insurance-seller mechanism explained: collecting a small regular premium against a rare, massive payout — the return is smooth, the historical volatility tiny, the Sharpe superb, as long as the event has not happened inside the window',
      'The structural flaw of the standard deviation: volatility captures neither asymmetry nor tails — a distribution with frequent small gains and a rare enormous loss can show the same σ as a benign one',
      'LTCM recited with the numbers: Sharpe > 4 before 1998, 4.3bn$ lost in a few weeks when all the convergence trades diverged together — the daily VaR was impeccable, the tail did the killing',
      'The concrete due-diligence questions: exact strategy and source of return, skew and worst drawdown, leverage, liquidity of underlyings, measurement window, closed funds (survivorship bias)',
      'The one-sentence conclusion: ask to see the DISTRIBUTION, not the ratio — a durable, explained Sharpe of 4 essentially does not exist',
    ],
    bonus: [
      'Le pont avec le m8 : vendre des puts hors de la monnaie fabrique mécaniquement ce profil — premium régulier, queue gauche massive ; « ramasser des pièces devant un rouleau compresseur »',
      'La variante liquidité : des positions illiquides valorisées au modèle lissent artificiellement les rendements — la volatilité mesurée baisse sans que le risque bouge ; demander la part de niveau 3 dans le portefeuille',
      'Le renvoi Bâle/risque : c\'est exactement pourquoi le backtesting compte les dépassements ET pourquoi FRTB passe à l\'expected shortfall — les mesures fondées sur le quotidien ratent le rare',
    ],
    bonusEn: [
      'The m8 bridge: selling out-of-the-money puts mechanically manufactures this profile — regular premium, massive left tail; "picking up coins in front of a steamroller"',
      'The liquidity variant: illiquid positions marked to model artificially smooth returns — measured volatility falls while risk does not move; ask for the level-3 share of the portfolio',
      'The Basel/risk echo: this is exactly why backtesting counts exceedances AND why FRTB moves to expected shortfall — measures built on the everyday miss the rare',
    ],
    reponseModele: `Ma réaction : de la **suspicion**, pas de l'admiration. Les repères d'abord, pour situer l'énormité : un portefeuille actions passif vit à 0,3-0,5 de Sharpe en longue période ; au-dessus de 1, c'est excellent ; au-dessus de 2, c'est déjà suspect. Un Sharpe de **4** n'est pas une performance — c'est une anomalie qui exige une explication.

L'explication la plus fréquente : la stratégie **vend de l'assurance**. Vente d'options (module 8), portage de crédit (module 5), arbitrage de convergence — toutes encaissent une petite prime régulière contre un paiement rare et massif. Le rendement est lisse, la volatilité *mesurée* minuscule, le Sharpe superbe… tant que l'événement ne s'est pas produit **dans la fenêtre de mesure**. C'est le défaut structurel de l'écart-type : il ne voit ni l'asymétrie ni les queues — un risque qui n'a pas encore eu lieu est invisible pour lui.

Le précédent qui interdit de l'oublier : **LTCM** affichait un Sharpe supérieur à 4 avant 1998 — puis a perdu **4,3 milliards de dollars** en quelques semaines, quand toutes ses convergences ont divergé ensemble. Ses mesures quotidiennes de risque étaient impeccables ; c'est la queue qui a tué.

Ma due diligence, donc : d'où vient le rendement, précisément ? Montrez-moi la **distribution** — skew, pire drawdown — pas le ratio. Quel levier ? Quelle liquidité des positions — du niveau 3 valorisé au modèle lisse artificiellement tout ? Quelle fenêtre ? Et les fonds que votre société a fermés ? Un Sharpe de 4 durable et expliqué, cela n'existe pour ainsi dire pas.`,
    reponseModeleEn: `My reaction: **suspicion**, not admiration. The anchors first, to size the enormity: a passive equity portfolio lives at a 0.3-0.5 Sharpe over the long run; above 1 is excellent; above 2 is already suspicious. A Sharpe of **4** is not a performance — it is an anomaly demanding an explanation.

The most frequent explanation: the strategy **sells insurance**. Option selling (module 8), credit carry (module 5), convergence arbitrage — all collect a small regular premium against a rare, massive payout. The return is smooth, the *measured* volatility tiny, the Sharpe superb… as long as the event has not occurred **inside the measurement window**. That is the structural flaw of the standard deviation: it sees neither asymmetry nor tails — a risk that has not yet happened is invisible to it.

The precedent that forbids forgetting: **LTCM** showed a Sharpe above 4 before 1998 — then lost **4.3 billion dollars** in a few weeks, when all its convergence trades diverged together. Its daily risk measures were impeccable; the tail did the killing.

My due diligence, therefore: where exactly does the return come from? Show me the **distribution** — skew, worst drawdown — not the ratio. What leverage? How liquid are the positions — level-3 assets marked to model smooth everything artificially? Which window? And the funds your firm has closed? A durable, explained Sharpe of 4 essentially does not exist.`,
  },
  {
    id: 'm12-j-11',
    moduleId: M12,
    theme: 'mesurer la performance : Sharpe, alpha, tracking error',
    themeEn: 'measuring performance: Sharpe, alpha, tracking error',
    difficulte: 2,
    question: 'Pourquoi dit-on que la tracking error « se choisit » quand la volatilité « se subit » ?',
    questionEn: 'Why do we say tracking error is "chosen" while volatility is "suffered"?',
    plan: [
      'Définir : la tracking error est la volatilité de l\'écart de rendement au benchmark — l\'écart-type de (r_p − r_b)',
      'Expliquer la différence de nature : la volatilité du marché s\'impose à tous ; l\'écart au benchmark dépend entièrement des paris pris par le gérant — zéro pari, zéro TE',
      'Chiffrer les régimes : un fonds indiciel vit sous 0,5 % de TE, un gérant actif classique entre 2 et 6 % — la TE est le budget de liberté que le mandat accorde',
      'Juger l\'usage du budget : le ratio d\'information = surperformance/TE — 2 % de surperformance pour 4 % de TE font 0,5, et > 0,5 tenu dans la durée est déjà très bon',
    ],
    planEn: [
      'Define: tracking error is the volatility of the return gap to the benchmark — the standard deviation of (r_p − r_b)',
      'Explain the difference in nature: market volatility is imposed on everyone; the gap to the benchmark depends entirely on the manager\'s bets — no bets, no TE',
      'Quantify the regimes: an index fund lives below 0.5% TE, a classic active manager between 2 and 6% — TE is the freedom budget the mandate grants',
      'Judge the use of the budget: the information ratio = outperformance/TE — 2% of outperformance on 4% of TE makes 0.5, and > 0.5 sustained over time is already very good',
    ],
    pointsAttendus: [
      'La définition exacte : TE = écart-type de (r_p − r_b) — pas l\'écart moyen, sa VOLATILITÉ ; un fonds peut battre son indice avec une TE faible ou le rater avec une TE énorme',
      'Le contraste de nature : la volatilité du marché est exogène — elle s\'impose au gérant comme la météo ; la TE est endogène — elle mesure la taille des paris, que le gérant contrôle intégralement',
      'Les repères de régime : < 0,5 % on réplique, 2-6 % on gère activement — et le mandat institutionnel fixe cette enveloppe au contrat, comme un budget',
      'Le ratio d\'information posé : IR = surperformance/TE, le Sharpe du gérant ACTIF — même construction (excès de rendement sur risque pris), mais l\'étalon est le mandat, pas le cash',
      'Le repère de jugement : 2/4 = 0,5, et un IR > 0,5 maintenu dans la durée est déjà très bon — la durée fait tout, une année ne prouve rien',
    ],
    pointsAttendusEn: [
      'The exact definition: TE = standard deviation of (r_p − r_b) — not the average gap, its VOLATILITY; a fund can beat its index with low TE or miss it with enormous TE',
      'The contrast in nature: market volatility is exogenous — it is imposed on the manager like the weather; TE is endogenous — it measures the size of the bets, which the manager fully controls',
      'The regime anchors: < 0.5% you replicate, 2-6% you manage actively — and the institutional mandate sets this envelope in the contract, like a budget',
      'The information ratio laid out: IR = outperformance/TE, the ACTIVE manager\'s Sharpe — same construction (excess return over risk taken), but the yardstick is the mandate, not cash',
      'The judgment anchor: 2/4 = 0.5, and an IR > 0.5 sustained over time is already very good — duration is everything, one year proves nothing',
    ],
    bonus: [
      'La lecture contractuelle qui plaît : la TE est la traduction chiffrée de la confiance du client — un mandat à 6 % de TE dit « prenez des paris », un mandat à 1 % dit « ne vous éloignez pas » ; dépasser sa TE est une faute de mandat même si la performance est bonne',
      'Le piège du closet indexing : un fonds facturé comme actif (2 %) avec une TE de fonds indiciel (< 1 %) fait payer la gestion active au prix fort pour livrer de la réplication — le scandale réglementaire classique',
    ],
    bonusEn: [
      'The contractual reading juries like: TE is the quantified translation of the client\'s trust — a 6% TE mandate says "take bets", a 1% TE mandate says "stay close"; breaching your TE is a mandate fault even if performance is good',
      'The closet-indexing trap: a fund charging active fees (2%) with index-fund TE (< 1%) bills active management at full price to deliver replication — the classic regulatory scandal',
    ],
    reponseModele: `La **tracking error** est la volatilité de l'écart de rendement entre le portefeuille et son benchmark — l'écart-type de (r_p − r_b). Pas l'écart moyen : sa *dispersion*. Et la formule contient déjà la réponse : cet écart ne dépend que des **paris** que le gérant prend contre son indice. Zéro pari, zéro tracking error — la réplication parfaite existe, et elle coûte trois points de base.

La volatilité du marché, elle, s'impose à tous — le gérant la subit comme la météo. La TE, au contraire, est **endogène** : c'est la taille des écarts que le gérant *choisit* de prendre. D'où sa vraie nature, contractuelle : c'est le **budget de liberté** que le mandat accorde. Les régimes chiffrés : un fonds indiciel vit sous 0,5 % de TE ; un gérant actif classique entre 2 et 6 %. Le mandat institutionnel écrit cette enveloppe noir sur blanc — et la dépasser est une faute, même si la performance est bonne.

Reste à juger l'usage du budget : c'est le **ratio d'information**, IR = surperformance/TE — le Sharpe du gérant actif, même construction mais mesurée contre le mandat plutôt que contre le cash. Un gérant qui bat son indice de 2 % par an avec 4 % de TE affiche un IR de **0,5** — et tenir plus de 0,5 dans la durée est déjà très bon.

Le piège que cette grille révèle : le *closet indexing* — facturer 2 % de frais de gestion active avec une TE de fonds indiciel. Le client paie la liberté au prix fort et reçoit de la réplication.`,
    reponseModeleEn: `**Tracking error** is the volatility of the return gap between the portfolio and its benchmark — the standard deviation of (r_p − r_b). Not the average gap: its *dispersion*. And the formula already contains the answer: that gap depends only on the **bets** the manager takes against the index. No bets, no tracking error — perfect replication exists, and it costs three basis points.

Market volatility, by contrast, is imposed on everyone — the manager suffers it like the weather. TE is **endogenous**: it is the size of the deviations the manager *chooses* to take. Hence its true, contractual nature: it is the **freedom budget** the mandate grants. The quantified regimes: an index fund lives below 0.5% TE; a classic active manager between 2 and 6%. The institutional mandate writes this envelope in black and white — and breaching it is a fault, even when performance is good.

What remains is judging the use of the budget: that is the **information ratio**, IR = outperformance/TE — the active manager's Sharpe, same construction but measured against the mandate rather than cash. A manager beating the index by 2% a year on 4% of TE shows an IR of **0.5** — and holding above 0.5 over time is already very good.

The trap this grid exposes: *closet indexing* — charging 2% of active fees with index-fund TE. The client pays full price for freedom and receives replication.`,
  },
  {
    id: 'm12-j-12',
    moduleId: M12,
    theme: 'passif contre actif : ETF et l\'arithmétique des frais',
    themeEn: 'passive versus active: ETFs and the arithmetic of fees',
    difficulte: 2,
    question: 'Pourquoi le gérant actif moyen sous-performe-t-il son indice après frais ?',
    questionEn: 'Why does the average active manager underperform the index after fees?',
    plan: [
      'Poser l\'argument de Sharpe (1991) : le marché est la somme de ses détenteurs — la moyenne pondérée par encours de TOUS les investisseurs est, par construction, le rendement du marché',
      'Dérouler : les passifs répliquent l\'indice, donc font le marché avant frais ⇒ l\'agrégat des actifs fait AUSSI le marché avant frais — chaque surpondération gagnante a pour contrepartie une sous-pondération',
      'Conclure : la gestion active coûtant plus cher que la réplication, l\'actif moyen fait MOINS que le marché après frais — ce n\'est pas une opinion ni un résultat empirique : une identité comptable',
      'Vérifier dans les données : SPIVA — sur 10-15 ans, 85 à 90 % des fonds actions actifs sous-performent après frais, et la persistance des gagnants est presque nulle',
    ],
    planEn: [
      'State Sharpe\'s argument (1991): the market is the sum of its holders — the asset-weighted average of ALL investors is, by construction, the market return',
      'Unroll: passives replicate the index, so they make the market before fees ⇒ the aggregate of actives ALSO makes the market before fees — every winning overweight has an underweight as its counterpart',
      'Conclude: since active management costs more than replication, the average active does LESS than the market after fees — not an opinion nor a fragile empirical result: an accounting identity',
      'Check in the data: SPIVA — over 10-15 years, 85 to 90% of active equity funds underperform after fees, and winner persistence is nearly zero',
    ],
    pointsAttendus: [
      'L\'argument déroulé dans l\'ordre, sans données : marché = somme des détenteurs ⇒ moyenne pondérée de tous = rendement du marché ⇒ si les passifs font le marché, l\'agrégat des actifs le fait aussi, avant frais',
      'Le statut de l\'énoncé, martelé : une IDENTITÉ COMPTABLE, pas une hypothèse d\'efficience des marchés — l\'argument ne suppose rien sur l\'information ni sur la rationalité',
      'La précision qui évite la caricature : l\'identité porte sur la MOYENNE en agrégat — elle n\'interdit pas les gagnants, elle garantit qu\'ils gagnent exactement ce que les perdants perdent, frais déduits des deux côtés',
      'La vérification empirique : SPIVA, publié depuis 2002 en corrigeant le biais du survivant — 85-90 % de sous-performants à 10-15 ans, proportion qui MONTE avec l\'horizon (les frais se composent, la chance non)',
      'La persistance quasi nulle : les fonds du premier quartile d\'une période ne sont pas plus souvent premiers ensuite que le hasard — le talent passé ne se recycle pas en promesse',
      'Les limites honnêtes : l\'argument mord moins sur les marchés peu efficients (small caps peu couvertes, distressed du m5) et ne dit rien des mandats qui ne visent pas un indice (passif d\'assureur)',
    ],
    pointsAttendusEn: [
      'The argument unrolled in order, with no data: market = sum of holders ⇒ weighted average of all = market return ⇒ if passives make the market, the aggregate of actives makes it too, before fees',
      'The status of the statement, hammered: an ACCOUNTING IDENTITY, not a market-efficiency assumption — the argument assumes nothing about information or rationality',
      'The precision that avoids caricature: the identity concerns the AVERAGE in aggregate — it does not forbid winners, it guarantees they win exactly what the losers lose, fees deducted on both sides',
      'The empirical check: SPIVA, published since 2002 with survivorship bias corrected — 85-90% underperformers at 10-15 years, a proportion that RISES with the horizon (fees compound, luck does not)',
      'Near-zero persistence: first-quartile funds of one period are no more often first in the next than chance would have it — past skill does not recycle into a promise',
      'The honest limits: the argument bites less in inefficient markets (under-covered small caps, m5 distressed) and says nothing about mandates that do not target an index (an insurer\'s liabilities)',
    ],
    bonus: [
      'La formulation qui fait mouche : chercher un bon gérant reste possible — c\'est chercher quelqu\'un du bon côté d\'un jeu à somme nulle, en payant pour participer',
      'Le prolongement smart beta : une partie de l\'« alpha » des gérants actifs n\'est que l\'exposition à des facteurs (value, momentum) désormais réplicable pour 0,2-0,5 % — ce qui reste vendable au prix fort rétrécit',
    ],
    bonusEn: [
      'The phrasing that lands: finding a good manager remains possible — it means finding someone on the right side of a zero-sum game, while paying to play',
      'The smart-beta extension: part of active managers\' "alpha" is mere factor exposure (value, momentum) now replicable for 0.2-0.5% — what remains sellable at full price keeps shrinking',
    ],
    reponseModele: `Parce que c'est arithmétiquement obligatoire — l'argument tient en deux paragraphes et il est de William Sharpe, 1991. Le marché est la somme de tous ses détenteurs : la moyenne **pondérée par les encours** de tous les investisseurs — passifs et actifs confondus — est donc, par construction, le rendement du marché lui-même. Les passifs répliquent l'indice : ils font le marché, avant frais. Il ne reste qu'une possibilité : **avant frais, le gérant actif moyen fait exactement le marché** — pour chaque acteur actif qui surpondère un titre gagnant, un autre le sous-pondère. Et comme la gestion active coûte plus cher que la réplication — analystes, rotation, commissions — **après frais, l'actif moyen fait moins que le marché**. Ce n'est ni une opinion ni un résultat empirique fragile : c'est une **identité comptable**, qui ne suppose rien sur l'efficience des marchés.

Les données confirment ce que l'arithmétique impose : les rapports **SPIVA**, qui corrigent le biais du survivant, montrent que sur 10 à 15 ans, **85 à 90 %** des fonds actions actifs sous-performent leur indice après frais — et la proportion *monte* avec l'horizon, car les frais se composent et la chance non. La persistance est presque nulle : les premiers quartiles d'hier ne prédisent pas ceux de demain.

Deux nuances pour finir juste. L'identité porte sur la *moyenne* : elle n'interdit pas les gagnants — elle garantit qu'ils sont financés par des perdants, frais déduits des deux côtés. Et elle mord moins là où l'indexation est impraticable : small caps peu couvertes, distressed du module 5, mandats adossés à un passif. Chercher un bon gérant reste possible ; c'est chercher le bon côté d'un jeu à somme nulle, en payant pour participer.`,
    reponseModeleEn: `Because it is arithmetically compulsory — the argument fits in two paragraphs and belongs to William Sharpe, 1991. The market is the sum of all its holders: the **asset-weighted** average of all investors — passive and active combined — is therefore, by construction, the return of the market itself. Passives replicate the index: they make the market, before fees. Only one possibility remains: **before fees, the average active manager makes exactly the market** — for every active player overweighting a winning stock, another underweights it. And since active management costs more than replication — analysts, turnover, commissions — **after fees, the average active does less than the market**. This is neither an opinion nor a fragile empirical result: it is an **accounting identity**, which assumes nothing about market efficiency.

The data confirm what the arithmetic imposes: the **SPIVA** reports, which correct for survivorship bias, show that over 10 to 15 years, **85 to 90%** of active equity funds underperform their index after fees — and the proportion *rises* with the horizon, because fees compound and luck does not. Persistence is nearly zero: yesterday's first quartiles do not predict tomorrow's.

Two closing nuances to be exact. The identity concerns the *average*: it does not forbid winners — it guarantees they are financed by losers, fees deducted on both sides. And it bites less where indexing is impractical: under-covered small caps, module 5 distressed, liability-driven mandates. Finding a good manager remains possible; it means finding the right side of a zero-sum game, while paying to play.`,
  },
  {
    id: 'm12-j-13',
    moduleId: M12,
    theme: 'passif contre actif : ETF et l\'arithmétique des frais',
    themeEn: 'passive versus active: ETFs and the arithmetic of fees',
    difficulte: 2,
    question: '2 % de frais de gestion par an, est-ce vraiment grave ? Chiffrez sur trente ans.',
    questionEn: 'Are 2% annual management fees really a big deal? Put numbers on thirty years.',
    plan: [
      'Refuser l\'intuition additive : « 2 % × 30 ans = 60 % de la mise » sous-estime massivement — chaque euro prélevé cesse de produire du rendement pendant toutes les années restantes',
      'Faire le calcul canonique : 100 investis 30 ans à 7 % brut = 761,225504 ; à 5 % net de 2 % de frais = 432,194238 — les frais ont coûté 329,031266, plus de trois fois la mise de départ',
      'Traduire en proportion : 329/761 ≈ 43 % de la valeur finale confisquée — sans qu\'aucune année, prise isolément, ne semble chère',
      'Donner le point de comparaison : un ETF à 0,2 % laisse 719,676929 — la quasi-totalité de la performance ; et pour mériter ses 2 %, le gérant doit battre le marché de 1,8 point par an pendant trente ans',
    ],
    planEn: [
      'Refuse the additive intuition: "2% × 30 years = 60% of the stake" massively underestimates — every euro taken stops producing return for all remaining years',
      'Run the canonical calculation: 100 invested 30 years at 7% gross = 761.225504; at 5% net of 2% fees = 432.194238 — the fees cost 329.031266, more than three times the initial stake',
      'Translate into proportion: 329/761 ≈ 43% of the final value confiscated — without any single year ever looking expensive',
      'Give the comparison point: an ETF at 0.2% leaves 719.676929 — nearly all the performance; and to deserve its 2%, the manager must beat the market by 1.8 points a year for thirty years',
    ],
    pointsAttendus: [
      'L\'erreur naïve démontée d\'entrée : le calcul additif ignore la composition — les frais prélevés tôt manquent à l\'appel pendant des décennies, c\'est la machine du m4 tournée contre l\'épargnant',
      'Les trois chiffres exacts : 761,225504 à 7 % brut ; 432,194238 à 5 % net ; écart 329,031266 — plus de trois fois la mise de départ',
      'La proportion qui frappe : 43 % de la valeur finale brute confisquée par une ligne de frais que personne ne remarque année par année',
      'Le comparatif ETF : 0,2 % de frais laissent 719,676929 — l\'écart entre 0,2 % et 2 % de frais vaut 287 sur une mise de 100',
      'La barre implicite : pour faire jeu égal avec l\'ETF, le fonds à 2 % doit surperformer de 1,8 point par an, chaque année, pendant trente ans — quand l\'identité de Sharpe garantit que la moyenne fera zéro avant frais',
    ],
    pointsAttendusEn: [
      'The naive error dismantled upfront: the additive calculation ignores compounding — fees taken early are missing for decades, the m4 machine turned against the saver',
      'The three exact figures: 761.225504 at 7% gross; 432.194238 at 5% net; gap 329.031266 — more than three times the initial stake',
      'The striking proportion: 43% of the gross final value confiscated by a fee line nobody notices year by year',
      'The ETF comparison: 0.2% fees leave 719.676929 — the gap between 0.2% and 2% fees is worth 287 on a stake of 100',
      'The implicit bar: to break even with the ETF, the 2% fund must outperform by 1.8 points a year, every year, for thirty years — when Sharpe\'s identity guarantees the average will do zero before fees',
    ],
    bonus: [
      'La phrase qui résume le mécanisme : la composition travaille pour celui qui encaisse les frais aussi sûrement que pour l\'investisseur — même machine, autre bénéficiaire',
      'Le réflexe de mesure du chapitre 3 : toujours demander si une performance est présentée nette ou brute — sur trente ans, la différence est plus grosse que la mise de départ',
    ],
    bonusEn: [
      'The sentence that sums up the mechanism: compounding works for whoever collects the fees as surely as for the investor — same machine, different beneficiary',
      'The chapter 3 measurement reflex: always ask whether a performance is shown net or gross — over thirty years, the difference is bigger than the initial stake',
    ],
    reponseModele: `Oui — et le calcul est plus brutal que l'intuition. Le réflexe naïf dit : 2 % par an sur 30 ans, cela fait 60 % de la mise — désagréable, pas dramatique. Ce calcul est faux, parce qu'il ignore la **composition** : chaque euro de frais prélevé cesse de produire du rendement pendant toutes les années restantes.

Le calcul exact du cours : **100 investis 30 ans à 7 % brut** font V = 100 × (1,07)³⁰ = **761,225504**. Avec 2 % de frais annuels, le moteur tourne à 5 % net : **432,194238**. Les frais ont coûté **329,031266** — plus de **trois fois la mise de départ**, soit environ **43 %** de la valeur finale brute confisqués. Et voici le plus insidieux : aucune année, prise isolément, n'a semblé chère — 2 % sur un an est invisible ; 2 % composés sur trente ans sont une amputation.

Le point de comparaison qui achève la démonstration : un ETF à 0,2 % laisse **719,676929** — la quasi-totalité de la performance. L'écart entre les deux véhicules vaut 287 sur une mise de 100 : c'est le prix de la promesse active.

Pour mériter ses 2 %, le gérant doit donc battre le marché de **1,8 point par an, chaque année, pendant trente ans** — quand l'arithmétique de Sharpe garantit que la moyenne de ses confrères fera zéro avant frais. La composition, cette force que le module 4 mettait au service de l'épargnant, travaille avec la même puissance pour celui qui encaisse les frais. Même machine, autre bénéficiaire.`,
    reponseModeleEn: `Yes — and the calculation is more brutal than the intuition. The naive reflex says: 2% a year over 30 years makes 60% of the stake — unpleasant, not dramatic. That calculation is wrong, because it ignores **compounding**: every euro of fees taken stops producing return for all the remaining years.

The exact course calculation: **100 invested for 30 years at 7% gross** makes V = 100 × (1.07)³⁰ = **761.225504**. With 2% annual fees, the engine runs at 5% net: **432.194238**. The fees cost **329.031266** — more than **three times the initial stake**, i.e. about **43%** of the gross final value confiscated. And here is the most insidious part: no single year ever looked expensive — 2% over one year is invisible; 2% compounded over thirty years is an amputation.

The comparison point that completes the demonstration: an ETF at 0.2% leaves **719.676929** — nearly all of the performance. The gap between the two vehicles is worth 287 on a stake of 100: that is the price of the active promise.

To deserve its 2%, the manager must therefore beat the market by **1.8 points a year, every year, for thirty years** — when Sharpe\'s arithmetic guarantees that the average of his peers will do zero before fees. Compounding, the force module 4 put at the saver\'s service, works with the same power for whoever collects the fees. Same machine, different beneficiary.`,
  },
  {
    id: 'm12-j-14',
    moduleId: M12,
    theme: 'passif contre actif : ETF et l\'arithmétique des frais',
    themeEn: 'passive versus active: ETFs and the arithmetic of fees',
    difficulte: 3,
    question: 'Un ETF peut-il être plus liquide que ses sous-jacents ?',
    questionEn: 'Can an ETF be more liquid than its underlying assets?',
    plan: [
      'Répondre en deux temps : en apparence oui — l\'ETF cote en continu quand ses sous-jacents ne traitent plus ; en substance non — sa liquidité ne peut jamais EXCÉDER celle du panier en stress, elle ne fait que la révéler plus vite',
      'Rappeler le mécanisme qui tient le prix : la création-rachat in-kind — les participants autorisés arbitrent toute prime ou décote contre la valeur du panier',
      'Dérouler le cas canonique : mars 2020, les ETF high yield cotent avec des décotes de plusieurs pourcents sous leur VL — mais la VL reposait sur des prix morts ; la découverte de prix avait MIGRÉ vers l\'ETF, et les obligations ont convergé vers lui',
      'Conclure sur l\'image du cours : un ETF liquide sur un marché illiquide est un thermomètre, pas un remède',
    ],
    planEn: [
      'Answer in two beats: in appearance yes — the ETF trades continuously while its underlyings stop trading; in substance no — its liquidity can never EXCEED the basket\'s in stress, it only reveals it faster',
      'Recall the mechanism holding the price: in-kind creation-redemption — authorised participants arbitrage any premium or discount against the basket\'s value',
      'Unroll the canonical case: March 2020, high-yield ETFs trade at discounts of several percent below NAV — but the NAV rested on dead prices; price discovery had MIGRATED to the ETF, and the bonds converged towards it',
      'Close on the course image: a liquid ETF on an illiquid market is a thermometer, not a cure',
    ],
    pointsAttendus: [
      'Le mécanisme de création-rachat maîtrisé : des participants autorisés échangent EN NATURE le panier contre des parts auprès de l\'émetteur — toute prime ou décote ouvre un arbitrage immédiat qui la referme ; le prix est tenu par un arbitrage, pas par une promesse',
      'Le fait de mars 2020 précis : au pic de la panique COVID, les ETF d\'obligations high yield ont coté en continu avec des décotes de plusieurs pourcents sous leur valeur liquidative',
      'La bonne lecture de la décote : les obligations sous-jacentes ne traitaient presque plus, la VL était calculée sur les DERNIERS prix connus — des prix morts ; l\'ETF agrégeait en temps réel les prix des transactions réelles',
      'Le sens de la convergence, à l\'endroit : le prix de l\'ETF n\'était pas en retard sur la VL, il était DEVANT — et ce sont les prix des obligations qui ont convergé vers lui : la découverte de prix avait migré',
      'La double conclusion du cours : rassurant — le mécanisme a tenu, sans suspension ; inquiétant — la liquidité de l\'ETF ne peut jamais être meilleure que celle de son sous-jacent en stress, elle peut seulement la révéler plus vite',
    ],
    pointsAttendusEn: [
      'The creation-redemption mechanism mastered: authorised participants exchange the basket IN KIND for shares with the issuer — any premium or discount opens an immediate arbitrage that closes it; the price is held by an arbitrage, not a promise',
      'The precise March 2020 fact: at the peak of the COVID panic, high-yield bond ETFs traded continuously at discounts of several percent below their net asset value',
      'The right reading of the discount: the underlying bonds had almost stopped trading, the NAV was computed on the LAST known prices — dead prices; the ETF was aggregating real transaction prices in real time',
      'The direction of convergence, the right way round: the ETF price was not lagging the NAV, it was AHEAD — and it was the bond prices that converged towards it: price discovery had migrated',
      'The course\'s double conclusion: reassuring — the mechanism held, with no suspension; worrying — an ETF\'s liquidity can never be better than its underlying\'s in stress, it can only reveal it faster',
    ],
    bonus: [
      'Le détail technique qui distingue : l\'échange in-kind évite à l\'émetteur de vendre des titres pour servir les sorties — moins de coûts de transaction, moins de frottements fiscaux, et pas de ventes forcées logées dans le fonds',
      'Le renvoi structurel : répliquer un indice capi-pondéré est structurellement bon marché car il se rééquilibre tout seul (m3) — c\'est ce qui rend les 0,05 % possibles ; la liquidité apparente du véhicule n\'y change rien',
    ],
    bonusEn: [
      'The distinguishing technical detail: the in-kind exchange spares the issuer from selling securities to meet redemptions — lower transaction costs, fewer tax frictions, and no forced sales housed inside the fund',
      'The structural echo: replicating a cap-weighted index is structurally cheap because it rebalances itself (m3) — that is what makes 0.05% possible; the vehicle\'s apparent liquidity changes nothing about it',
    ],
    reponseModele: `En apparence, oui ; en substance, jamais — et la nuance entre les deux est exactement ce que mars 2020 a enseigné.

L'apparence d'abord. L'ETF cote en continu, comme une action, et son prix est tenu par l'arbitrage de **création-rachat** : des participants autorisés peuvent à tout moment échanger *en nature* le panier de titres contre des parts auprès de l'émetteur — toute prime ou décote ouvre un arbitrage immédiat qui la referme. Le prix tient par un arbitrage, pas par une promesse.

Le test grandeur nature : **mars 2020**. Au pic de la panique, les ETF d'obligations **high yield** ont coté avec des décotes de plusieurs pourcents sous leur valeur liquidative. Scandale, échec du mécanisme ? Regardez de plus près : les obligations sous-jacentes ne se traitaient presque plus, et la VL était calculée sur les derniers prix connus — des **prix morts**. L'ETF, lui, agrégeait en temps réel ce que des acheteurs et vendeurs réels acceptaient. Son prix n'était pas en retard sur la VL : il était **devant** — et ce sont les obligations qui ont convergé vers lui. La **découverte de prix avait migré** du marché sous-jacent vers l'ETF.

La double conclusion, à donner dans cet ordre. Rassurant : le mécanisme a tenu, sans suspension. Inquiétant : la liquidité d'un ETF ne peut jamais *excéder* celle de son sous-jacent en stress — elle peut seulement la révéler plus vite. Un ETF liquide sur un marché illiquide est un **thermomètre, pas un remède** : il vous dit la température exacte du marché ; il ne la fait pas baisser.`,
    reponseModeleEn: `In appearance, yes; in substance, never — and the nuance between the two is exactly what March 2020 taught.

The appearance first. The ETF trades continuously, like a stock, and its price is held by the **creation-redemption** arbitrage: authorised participants can at any moment exchange the basket of securities *in kind* for shares with the issuer — any premium or discount opens an immediate arbitrage that closes it. The price holds through an arbitrage, not a promise.

The full-scale test: **March 2020**. At the peak of the panic, **high-yield** bond ETFs traded at discounts of several percent below their net asset value. A scandal, a failure of the mechanism? Look closer: the underlying bonds had almost stopped trading, and the NAV was computed on the last known prices — **dead prices**. The ETF, meanwhile, was aggregating in real time what actual buyers and sellers would accept. Its price was not lagging the NAV: it was **ahead** — and it was the bonds that converged towards it. **Price discovery had migrated** from the underlying market to the ETF.

The double conclusion, in this order. Reassuring: the mechanism held, without a single suspension. Worrying: an ETF\'s liquidity can never *exceed* its underlying\'s in stress — it can only reveal it faster. A liquid ETF on an illiquid market is a **thermometer, not a cure**: it tells you the market\'s exact temperature; it does not bring it down.`,
  },
  {
    id: 'm12-j-15',
    moduleId: M12,
    theme: 'la VaR et les stress tests',
    themeEn: 'VaR and stress tests',
    difficulte: 1,
    question: 'Définissez la VaR — sans employer les mots « perte maximale ».',
    questionEn: 'Define VaR — without using the words "maximum loss".',
    plan: [
      'Donner la définition juste : un SEUIL de perte associé à un niveau de confiance et un horizon — un quantile de la distribution des P&L, pas une borne',
      'Illustrer avec l\'ancre du cours : VaR 95 % à 1 jour de 2,1 M€ = « on ne devrait pas perdre plus de 2,1 M€ en une journée, 19 jours sur 20 » — 100 × 1,65 × 0,20 × √(1/252) = 2,078805 M',
      'Expliquer pourquoi « perte maximale » est le contresens à bannir : la VaR dit où commence la queue, pas ce qu\'il y a dedans — le 20e jour, la perte peut être 2,2 ou 40 M€',
      'Situer les trois paramètres comme des décisions de gestion : le quantile (z = 1,65 pour 95 %, 2,33 pour 99 %), la confiance, l\'horizon — et l\'origine : RiskMetrics, JPMorgan, 1994',
    ],
    planEn: [
      'Give the correct definition: a loss THRESHOLD tied to a confidence level and a horizon — a quantile of the P&L distribution, not a bound',
      'Illustrate with the course anchor: a 95% 1-day VaR of 2.1M€ = "we should not lose more than 2.1M€ in one day, 19 days out of 20" — 100 × 1.65 × 0.20 × √(1/252) = 2.078805M',
      'Explain why "maximum loss" is the misreading to ban: VaR says where the tail begins, not what is inside it — on the 20th day, the loss can be 2.2 or 40M€',
      'Frame the three parameters as management decisions: the quantile (z = 1.65 for 95%, 2.33 for 99%), the confidence, the horizon — and the origin: RiskMetrics, JPMorgan, 1994',
    ],
    pointsAttendus: [
      'La formulation exacte : « la perte ne devrait pas dépasser X sur h jours, dans c % des cas » — un quantile de la distribution des P&L (m2), jamais une espérance ni une borne',
      'La lecture récitée sur l\'ancre : 2,1 M€ à 95 %/1 j se lit « 19 jours sur 20 » — et le calcul paramétrique qui la produit : V × z × σ × √(h/252), soit 100 × 1,65 × 0,20 × √(1/252) = 2,078805 M',
      'Le contresens désamorcé frontalement : la VaR ne borne rien — elle dit où commence la queue de distribution, pas ce qu\'elle contient ; le jour du dépassement, le chiffre est muet par construction',
      'Les trois paramètres comme décisions : la confiance dit quelle fraction des jours on accepte de dépasser, l\'horizon dit en combien de temps on saurait déboucler — z = 1,65 (95 %) et 2,33 (99 %) à connaître par cœur',
      'Le complément naturel : parce qu\'elle est muette au-delà du seuil, on lui adjoint l\'expected shortfall (la moyenne des pertes au-delà) et les stress tests',
    ],
    pointsAttendusEn: [
      'The exact phrasing: "the loss should not exceed X over h days, in c% of cases" — a quantile of the P&L distribution (m2), never an expectation nor a bound',
      'The reading recited on the anchor: 2.1M€ at 95%/1 day reads "19 days out of 20" — and the parametric calculation producing it: V × z × σ × √(h/252), i.e. 100 × 1.65 × 0.20 × √(1/252) = 2.078805M',
      'The misreading defused head-on: VaR bounds nothing — it says where the distribution\'s tail begins, not what it contains; on the day of the exceedance, the figure is silent by construction',
      'The three parameters as decisions: the confidence says what fraction of days you accept to exceed, the horizon says how fast you could unwind — z = 1.65 (95%) and 2.33 (99%) known by heart',
      'The natural complement: because it is silent beyond the threshold, it is paired with expected shortfall (the average of losses beyond) and stress tests',
    ],
    bonus: [
      'L\'origine institutionnelle qui fait bien à l\'oral : RiskMetrics, JPMorgan, 1994 — l\'exigence de Dennis Weatherstone : un seul chiffre, chaque soir à 16 h 15, résumant le risque de toute la banque',
      'L\'ancienne convention réglementaire : Bâle exigeait la VaR 99 % à 10 jours — 100 × 2,33 × 0,20 × √(10/252) = 9,282942 M sur le même portefeuille — avant que FRTB ne passe à l\'expected shortfall',
    ],
    bonusEn: [
      'The institutional origin that plays well orally: RiskMetrics, JPMorgan, 1994 — Dennis Weatherstone\'s demand: one figure, every evening at 4:15 pm, summarising the whole bank\'s risk',
      'The old regulatory convention: Basel required the 99% 10-day VaR — 100 × 2.33 × 0.20 × √(10/252) = 9.282942M on the same portfolio — before FRTB moved to expected shortfall',
    ],
    reponseModele: `La VaR est un **seuil de perte** associé à un **niveau de confiance** et un **horizon** : « la perte ne devrait pas dépasser X sur h jours, dans c % des cas ». Techniquement, c'est un **quantile** de la distribution des P&L — pas une espérance, et surtout pas une borne.

L'ancre du cours : un portefeuille de 100 M€ à 20 % de volatilité annuelle a une VaR paramétrique 95 % à 1 jour de 100 × 1,65 × 0,20 × √(1/252) = **2,078805 M€**. Lecture exacte : « on ne devrait pas perdre plus de ~2,1 M€ en une journée, **19 jours sur 20** ». Les z d'usage se récitent : 1,65 pour 95 %, 2,33 pour 99 %.

Pourquoi la question interdit-elle « perte maximale » ? Parce que c'est LE contresens qui coûte des points à l'oral et des carrières en salle : la VaR **ne borne rien**. Elle dit où commence la queue de distribution — pas ce qu'il y a dedans. Le 20e jour, celui qu'elle laisse de côté, la perte peut être de 2,2 M€ comme de 40 M€ : le chiffre est muet par construction. C'est pour cela qu'on lui adjoint l'**expected shortfall** — la moyenne des pertes au-delà du seuil — et les stress tests.

Les trois paramètres sont des **décisions de gestion**, pas des constantes : la confiance dit quelle fraction des jours on accepte de dépasser ; l'horizon dit en combien de temps on saurait déboucler. L'origine dit le reste : RiskMetrics, JPMorgan, 1994 — un seul chiffre, chaque soir à 16 h 15, pour résumer le risque de toute la banque.`,
    reponseModeleEn: `VaR is a **loss threshold** tied to a **confidence level** and a **horizon**: "the loss should not exceed X over h days, in c% of cases". Technically, it is a **quantile** of the P&L distribution — not an expectation, and above all not a bound.

The course anchor: a 100M€ portfolio at 20% annual volatility has a parametric 95% 1-day VaR of 100 × 1.65 × 0.20 × √(1/252) = **2.078805M€**. The exact reading: "we should not lose more than ~2.1M€ in one day, **19 days out of 20**". The usual z values are recited: 1.65 for 95%, 2.33 for 99%.

Why does the question ban "maximum loss"? Because that is THE misreading that costs marks at orals and careers on trading floors: VaR **bounds nothing**. It says where the tail of the distribution begins — not what is inside it. On the 20th day, the one it leaves aside, the loss can be 2.2M€ or 40M€: the figure is silent by construction. That is why it is paired with **expected shortfall** — the average of losses beyond the threshold — and with stress tests.

The three parameters are **management decisions**, not constants: the confidence says what fraction of days you accept to exceed; the horizon says how fast you could unwind. The origin says the rest: RiskMetrics, JPMorgan, 1994 — one figure, every evening at 4:15 pm, summarising the risk of the entire bank.`,
  },
  // __SUITE__
];
