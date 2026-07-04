import type { QcmQuestion } from '../../../engine/types';

const M12 = '12-gestion-actifs-risques';

// Banque de 60 QCM bilingues (FR/EN). Quotas par chapitre :
// le portefeuille 9 · la frontière et le CAPM 9 · mesurer la performance 8 ·
// passif contre actif et les ETF 8 · la VaR et les stress tests 9 ·
// les quatre risques et Bâle III 9 · l'ESG 8.
// Les valeurs numériques sont alignées sur calculs.ts et les chapitres relus :
// rendement 60/40 (8, 3) = 6 % ; vol (60/40, 20/10, ρ 0,3) = 13,740451 %
// (et PAS 16, la moyenne pondérée — qui ne revient qu'à ρ = 1) ; à ρ = −1
// le 60/40 tombe à 8 % ; à ρ = 0, 50/50 de deux actifs à 20 % = 14,142136 %
// (÷√2) ; β(0,8, 25, 15) = 1,333333 ; CAPM(3, 1,2, 5) = 9 % ; alpha(12, 3,
// 1,2, 10) = +0,6 % (et PAS 2 %) ; Sharpe(8, 3, 10) = 0,5 ; IR(2, 4) = 0,5 ;
// couverture : 120 M × β 1,2 = 144 M équivalent-indice ; VaR (100 M, 20 %,
// 1,65, 1 j) = 2,078805 M ; (100 M, 20 %, 2,33, 10 j) = 9,282942 M ;
// 2 × √10 = 6,324555 M ; stress (100 M, −20 %, 1,2) = −24 M ; RWA (100, 75)
// = 75 M ; CET1 (12, 100) = 12 % (exigence 4,5 + coussin 2,5) ; levier
// ≥ 3 % (Lehman ~31 de levier ≈ 3,2 %) ; LCR (120, 100) = 120 % ; frais :
// 100 à 7 % sur 30 ans = 761,225504 brut, 432,194238 à 2 % de frais (coût
// 329,031266), 719,676929 à 0,2 % ; SPIVA ~85-90 % ; LTCM Sharpe > 4 puis
// 4,3 Md$ perdus ; Kerviel 4,9 Md€ ; corrélation noteurs ESG ~0,4-0,6
// contre ~0,99 en crédit ; greenium = quelques pb ; DWS 19 M$ (SEC).
// Répartition des bonnes réponses : 15 × index 0, 15 × 1, 15 × 2, 15 × 3.

const T1 = 'le portefeuille';
const T1_EN = 'the portfolio';
const T2 = 'la frontière et le CAPM';
const T2_EN = 'the frontier and the CAPM';
const T3 = 'mesurer la performance';
const T3_EN = 'measuring performance';
const T4 = 'passif contre actif et les ETF';
const T4_EN = 'passive vs active and ETFs';
const T5 = 'la VaR et les stress tests';
const T5_EN = 'VaR and stress tests';
const T6 = 'les quatre risques et Bâle III';
const T6_EN = 'the four risks and Basel III';
const T7 = 'l\'ESG';
const T7_EN = 'ESG';

export const qcm: QcmQuestion[] = [
  // ──────────────── le portefeuille (9) ────────────────
  {
    id: 'm12-qcm-01', moduleId: M12, theme: T1, themeEn: T1_EN, difficulte: 1,
    question: 'Un portefeuille 60/40 : 60 % d\'actions à 8 % de rendement espéré, 40 % d\'obligations à 3 %. Quel est son rendement espéré ?',
    options: [
      '6 % : 0,6 × 8 + 0,4 × 3 — le rendement espéré est la moyenne pondérée des rendements, il se diversifie linéairement',
      '5,5 % : la moyenne simple (8 + 3)/2 des deux rendements',
      '4,8 % : seule la poche actions rapporte, soit 0,6 × 8',
      '8 % : le portefeuille adopte le rendement de son actif dominant',
    ],
    bonneReponse: 0,
    explications: [
      'La moitié facile de Markowitz : r_p = w₁r₁ + w₂r₂ = 0,6 × 8 + 0,4 × 3 = 6 %. Linéaire, sans surprise — diversifier ne coûte aucun rendement espéré. Tout le module tient dans le contraste avec la volatilité, qui, elle, ne se moyenne PAS.',
      'La moyenne simple ignore les poids : les actions pèsent 60 % du portefeuille, pas 50 %. La pondération est précisément ce que le gérant choisit — son seul vrai levier selon ce chapitre.',
      'Les obligations rapportent aussi : oublier 0,4 × 3 = 1,2 point ampute le calcul. Chaque poche contribue au prorata de son poids.',
      'Un portefeuille n\'« adopte » rien : chaque composant contribue au prorata de son poids. 8 % serait le rendement d\'un portefeuille 100 % actions — un autre choix de poids, un autre point du plan risque/rendement.',
    ],
    questionEn: 'A 60/40 portfolio: 60% equities with an 8% expected return, 40% bonds at 3%. What is its expected return?',
    optionsEn: [
      '6%: 0.6 × 8 + 0.4 × 3 — the expected return is the weighted average of returns, it diversifies linearly',
      '5.5%: the simple average (8 + 3)/2 of the two returns',
      '4.8%: only the equity sleeve earns anything, i.e. 0.6 × 8',
      '8%: the portfolio takes on the return of its dominant asset',
    ],
    explicationsEn: [
      'The easy half of Markowitz: r_p = w₁r₁ + w₂r₂ = 0.6 × 8 + 0.4 × 3 = 6%. Linear, no surprise — diversifying costs no expected return. The whole module lives in the contrast with volatility, which does NOT average.',
      'The simple average ignores the weights: equities are 60% of the portfolio, not 50%. The weighting is precisely what the manager chooses — his only real lever according to this chapter.',
      'Bonds earn too: dropping 0.4 × 3 = 1.2 points truncates the calculation. Each sleeve contributes in proportion to its weight.',
      'A portfolio does not "take on" anything: every component contributes pro rata to its weight. 8% would be the return of a 100% equity portfolio — another choice of weights, another point in the risk/return plane.',
    ],
  },
  {
    id: 'm12-qcm-02', moduleId: M12, theme: T1, themeEn: T1_EN, difficulte: 2,
    question: 'Le même 60/40 : actions à 20 % de volatilité, obligations à 10 %, corrélation 0,3. Quelle est la volatilité du portefeuille ?',
    options: [
      '16 % : la moyenne pondérée 0,6 × 20 + 0,4 × 10, comme pour le rendement',
      '12,649111 % : la racine de 144 + 16, sans terme croisé',
      '13,740451 % : √(144 + 16 + 28,8) — SOUS la moyenne pondérée de 16 % : plus de deux points de risque ont disparu par pur assemblage, sans sacrifier un centime de rendement',
      '30 % : les volatilités s\'additionnent, 20 + 10',
    ],
    bonneReponse: 2,
    explications: [
      'L\'erreur fondatrice que ce chapitre existe pour tuer : le risque ne se moyenne PAS. La moyenne pondérée (16 %) n\'est atteinte qu\'à ρ = 1 — dès que la corrélation est imparfaite, la racine sort en dessous.',
      'Oublier le terme croisé 2w₁w₂ρσ₁σ₂ = 28,8, c\'est effacer le seul terme où la corrélation apparaît — celui qui contient toute l\'histoire. Le calcul rendrait 12,65 %, faussement optimiste ici (ρ = 0,3 > 0 ajoute du risque par rapport à l\'indépendance).',
      'LA formule du module, terme à terme : 0,36 × 400 = 144, plus 0,16 × 100 = 16, plus 2 × 0,6 × 0,4 × 0,3 × 20 × 10 = 28,8 ; total 188,8, racine 13,740451 %. L\'écart avec 16 % est le seul repas gratuit de la finance — de la réduction de risque obtenue par pur assemblage, à dérouler de tête à l\'oral.',
      'Additionner les volatilités brutes ignore et les poids et la corrélation : même à ρ = 1, le pire cas, le portefeuille ne dépasse pas la moyenne pondérée de 16 %.',
    ],
    questionEn: 'The same 60/40: equities at 20% volatility, bonds at 10%, correlation 0.3. What is the portfolio volatility?',
    optionsEn: [
      '16%: the weighted average 0.6 × 20 + 0.4 × 10, as for the return',
      '12.649111%: the square root of 144 + 16, without the cross term',
      '13.740451%: √(144 + 16 + 28.8) — BELOW the 16% weighted average: more than two points of risk vanished through pure assembly, without sacrificing a cent of return',
      '30%: volatilities add up, 20 + 10',
    ],
    explicationsEn: [
      'The founding error this chapter exists to kill: risk does NOT average. The weighted average (16%) is only reached at ρ = 1 — as soon as correlation is imperfect, the square root comes out below it.',
      'Dropping the cross term 2w₁w₂ρσ₁σ₂ = 28.8 erases the only term where correlation appears — the one that carries the whole story. The calculation would give 12.65%, falsely optimistic here (ρ = 0.3 > 0 adds risk relative to independence).',
      'THE formula of the module, term by term: 0.36 × 400 = 144, plus 0.16 × 100 = 16, plus 2 × 0.6 × 0.4 × 0.3 × 20 × 10 = 28.8; total 188.8, square root 13.740451%. The gap to 16% is the only free lunch in finance — risk reduction obtained by pure assembly, to be unrolled from memory at the oral.',
      'Adding raw volatilities ignores both the weights and the correlation: even at ρ = 1, the worst case, the portfolio never exceeds the 16% weighted average.',
    ],
  },
  {
    id: 'm12-qcm-03', moduleId: M12, theme: T1, themeEn: T1_EN, difficulte: 1,
    question: 'Que devient la volatilité de ce 60/40 (20 %, 10 %) si la corrélation passe à exactement 1 ?',
    options: [
      'Elle reste à 13,740451 % : la corrélation ne joue que sur le rendement',
      'Exactement 16 %, la moyenne pondérée : le terme croisé referme le carré parfait, la diversification ne retire plus rien — deux actifs parfaitement corrélés sont un seul actif déguisé',
      'Elle tombe à 8 % : la corrélation maximale stabilise le portefeuille',
      'Elle dépasse 20 % : les risques s\'additionnent au-delà du plus volatil des deux',
    ],
    bonneReponse: 1,
    explications: [
      'C\'est l\'inverse : la corrélation n\'apparaît QUE dans la formule de la volatilité (le terme croisé), jamais dans celle du rendement — qui reste 6 % quel que soit ρ.',
      'À ρ = 1, la racine se referme en w₁σ₁ + w₂σ₂ = 0,6 × 20 + 0,4 × 10 = 16 % — la moyenne pondérée, pas un point de moins. Le corollaire d\'oral : ce n\'est pas le NOMBRE de lignes qui diversifie, c\'est la corrélation entre elles — mille actifs corrélés à 1 se comportent comme un seul.',
      '8 % est le résultat à ρ = −1, l\'autre extrême — la couverture, pas la corrélation parfaite positive. Confondre les deux signes, c\'est confondre l\'actif qui double votre risque et celui qui l\'annule.',
      'Impossible : la volatilité d\'un portefeuille est bornée par la moyenne pondérée, atteinte à ρ = 1. Les poids au carré (inférieurs aux poids) empêchent toute « addition » au-delà.',
    ],
    questionEn: 'What happens to the volatility of this 60/40 (20%, 10%) if the correlation moves to exactly 1?',
    optionsEn: [
      'It stays at 13.740451%: correlation only affects the return',
      'Exactly 16%, the weighted average: the cross term completes the perfect square, diversification removes nothing anymore — two perfectly correlated assets are a single asset in disguise',
      'It drops to 8%: maximum correlation stabilises the portfolio',
      'It exceeds 20%: risks add up beyond the more volatile of the two',
    ],
    explicationsEn: [
      'The other way round: correlation appears ONLY in the volatility formula (the cross term), never in the return — which stays at 6% whatever ρ.',
      'At ρ = 1, the square root closes into w₁σ₁ + w₂σ₂ = 0.6 × 20 + 0.4 × 10 = 16% — the weighted average, not a point less. The oral corollary: it is not the NUMBER of positions that diversifies, it is the correlation between them — a thousand assets correlated at 1 behave as one.',
      '8% is the result at ρ = −1, the other extreme — the hedge, not perfect positive correlation. Mixing up the two signs means mixing up the asset that doubles your risk and the one that cancels it.',
      'Impossible: portfolio volatility is capped by the weighted average, reached at ρ = 1. The squared weights (smaller than the weights) rule out any "addition" beyond it.',
    ],
  },
  {
    id: 'm12-qcm-04', moduleId: M12, theme: T1, themeEn: T1_EN, difficulte: 2,
    question: 'Et à corrélation −1, que vaut ce 60/40 — et que permet ce cas limite qu\'aucune autre valeur de ρ ne permet ?',
    options: [
      '16 % : le signe de la corrélation ne change rien, seule sa valeur absolue compte',
      '0 % automatiquement : à ρ = −1, tout portefeuille est sans risque quel que soit le dosage',
      'Une volatilité négative de −8 % : le terme croisé négatif rend le résultat négatif',
      '8 % : |0,6 × 20 − 0,4 × 10| — et un choix de poids (1/3 actions, 2/3 obligations, pour égaliser w₁σ₁ et w₂σ₂) annulerait TOUTE la volatilité : c\'est le principe même d\'une couverture',
    ],
    bonneReponse: 3,
    explications: [
      'Le signe est toute l\'affaire : à ρ = +1 les mouvements s\'empilent (16 %), à ρ = −1 ils se compensent (8 %). Un actif corrélé à −1 avec votre position est exactement ce qu\'est un future vendu (module 7).',
      'L\'annulation totale exige le BON dosage : w₁σ₁ = w₂σ₂, soit 1/3 actions et 2/3 obligations ici. Le 60/40, lui, garde 8 % de volatilité — la compensation est imparfaite tant que les deux jambes ne sont pas égalisées.',
      'Une volatilité est un écart-type : jamais négative, par construction. À ρ = −1 la formule se referme en |w₁σ₁ − w₂σ₂| — une valeur absolue, précisément pour cela.',
      'La formule se referme en |0,6 × 20 − 0,4 × 10| = 8 %, et le choix w₁ = 1/3 (qui égalise 1/3 × 20 et 2/3 × 10) annule tout : la couverture est le cas limite de la diversification. Entre les extrêmes, retenez aussi ρ = 0 : deux actifs identiques indépendants en 50/50 divisent la volatilité par √2.',
    ],
    questionEn: 'And at correlation −1, what is this 60/40 worth — and what does this limiting case allow that no other value of ρ allows?',
    optionsEn: [
      '16%: the sign of the correlation changes nothing, only its absolute value matters',
      '0% automatically: at ρ = −1, every portfolio is riskless whatever the mix',
      'A negative volatility of −8%: the negative cross term makes the result negative',
      '8%: |0.6 × 20 − 0.4 × 10| — and one choice of weights (1/3 equities, 2/3 bonds, equalising w₁σ₁ and w₂σ₂) would cancel ALL the volatility: that is the very principle of a hedge',
    ],
    explicationsEn: [
      'The sign is the whole story: at ρ = +1 the moves pile up (16%), at ρ = −1 they offset (8%). An asset correlated at −1 with your position is exactly what a sold future is (module 7).',
      'Total cancellation requires the RIGHT mix: w₁σ₁ = w₂σ₂, i.e. 1/3 equities and 2/3 bonds here. The 60/40 keeps 8% volatility — the offset is imperfect as long as the two legs are not equalised.',
      'A volatility is a standard deviation: never negative, by construction. At ρ = −1 the formula closes into |w₁σ₁ − w₂σ₂| — an absolute value, precisely for that reason.',
      'The formula closes into |0.6 × 20 − 0.4 × 10| = 8%, and the choice w₁ = 1/3 (equalising 1/3 × 20 and 2/3 × 10) cancels everything: hedging is the limiting case of diversification. Between the extremes, remember ρ = 0 too: two identical independent assets in 50/50 divide volatility by √2.',
    ],
  },
  {
    id: 'm12-qcm-05', moduleId: M12, theme: T1, themeEn: T1_EN, difficulte: 2,
    question: 'Deux actifs identiques à 20 % de volatilité, parfaitement indépendants (ρ = 0), en 50/50. Volatilité du portefeuille ?',
    options: [
      '20 % : sans corrélation, la diversification ne retire rien',
      '10 % : la volatilité se divise par n = 2',
      '14,142136 % : 20/√2 — le terme croisé disparaît et n actifs indépendants divisent la volatilité par √n : la loi des grands nombres au service du portefeuille',
      '0 % : deux actifs indépendants se compensent parfaitement',
    ],
    bonneReponse: 2,
    explications: [
      'C\'est ρ = 1, pas ρ = 0, qui annule le bénéfice : à corrélation nulle, le terme croisé disparaît et il reste √(100 + 100) = 14,14 % — la diversification travaille à plein.',
      'La division par n vaudrait pour les VARIANCES, pas pour la volatilité : la variance passe de 400 à 200, et l\'écart-type — sa racine — ne baisse que d\'un facteur √2. Confondre variance et volatilité coûte exactement ce facteur.',
      'Sous la racine : 0,25 × 400 + 0,25 × 400 + 0 = 200, soit 14,142136 %. Généralisation à réciter : n actifs indépendants de même volatilité la divisent par √n — le mécanisme exact par lequel la multiplication des lignes fait fondre le risque spécifique.',
      'La compensation parfaite exige ρ = −1 ET le bon dosage : l\'indépendance signifie seulement que les chocs ne sont pas coordonnés — ils s\'atténuent en moyenne, ils ne s\'annulent pas.',
    ],
    questionEn: 'Two identical assets at 20% volatility, perfectly independent (ρ = 0), in 50/50. Portfolio volatility?',
    optionsEn: [
      '20%: without correlation, diversification removes nothing',
      '10%: volatility divides by n = 2',
      '14.142136%: 20/√2 — the cross term vanishes and n independent assets divide volatility by √n: the law of large numbers put to work for the portfolio',
      '0%: two independent assets offset each other perfectly',
    ],
    explicationsEn: [
      'It is ρ = 1, not ρ = 0, that kills the benefit: at zero correlation the cross term vanishes and √(100 + 100) = 14.14% remains — diversification works at full strength.',
      'Division by n would apply to VARIANCES, not to volatility: the variance drops from 400 to 200, and the standard deviation — its square root — only falls by a factor √2. Confusing variance and volatility costs exactly that factor.',
      'Under the root: 0.25 × 400 + 0.25 × 400 + 0 = 200, i.e. 14.142136%. The generalisation to recite: n independent assets of equal volatility divide it by √n — the exact mechanism by which adding positions melts away specific risk.',
      'Perfect offsetting requires ρ = −1 AND the right mix: independence only means the shocks are uncoordinated — they attenuate on average, they do not cancel.',
    ],
  },
  {
    id: 'm12-qcm-06', moduleId: M12, theme: T1, themeEn: T1_EN, difficulte: 1,
    question: 'En ajoutant toujours plus de lignes à un portefeuille d\'actions, la volatilité baisse puis bute sur un plancher. Pourquoi ?',
    options: [
      'Parce que les frais de transaction finissent par dominer le bénéfice',
      'Parce qu\'au-delà de 100 titres, la loi des grands nombres cesse de fonctionner',
      'Parce que les rendements espérés convergent vers le taux sans risque',
      'Parce que la diversification fait fondre le risque SPÉCIFIQUE (l\'usine qui brûle, le profit warning), mais ne peut rien contre le risque SYSTÉMATIQUE — celui du marché entier, qui frappe toutes les lignes à la fois',
    ],
    bonneReponse: 3,
    explications: [
      'Les frais sont une friction opérationnelle, pas la cause du plancher : même dans un monde sans frais, la volatilité convergerait vers celle du marché sans jamais la percer.',
      'La loi des grands nombres ne « cesse » jamais : elle continue de diluer le risque spécifique — simplement, il n\'en reste presque plus à diluer au-delà de quelques dizaines de titres (l\'essentiel du bénéfice est capturé vers 20-30 lignes).',
      'Hors sujet : la diversification agit sur le risque, pas sur les rendements espérés, qui restent la moyenne pondérée quoi qu\'il arrive.',
      'La distinction fondatrice : le risque spécifique est propre à chaque titre et se dilue comme 1/√n ; le risque systématique — récession, choc de taux, crise — est commun à toutes les lignes, et détenir 500 actions plutôt que 5 ne protège en rien contre une baisse du marché entier. Ce plancher prépare le CAPM : puisque n\'importe qui élimine le spécifique gratuitement, le marché ne rémunère QUE le systématique.',
    ],
    questionEn: 'Adding ever more positions to an equity portfolio, volatility falls then hits a floor. Why?',
    optionsEn: [
      'Because transaction costs eventually dominate the benefit',
      'Because beyond 100 stocks, the law of large numbers stops working',
      'Because expected returns converge to the risk-free rate',
      'Because diversification melts away SPECIFIC risk (the factory fire, the profit warning), but is powerless against SYSTEMATIC risk — the risk of the whole market, which hits every position at once',
    ],
    explicationsEn: [
      'Costs are an operational friction, not the cause of the floor: even in a costless world, volatility would converge to the market\'s without ever piercing it.',
      'The law of large numbers never "stops": it keeps diluting specific risk — there is simply almost none left to dilute beyond a few dozen stocks (the bulk of the benefit is captured around 20-30 positions).',
      'Beside the point: diversification acts on risk, not on expected returns, which remain the weighted average no matter what.',
      'The founding distinction: specific risk is unique to each stock and dilutes like 1/√n; systematic risk — recession, rate shock, crisis — is common to every position, and holding 500 stocks rather than 5 offers no protection against a fall of the whole market. This floor sets up the CAPM: since anyone can eliminate the specific part for free, the market only pays for the systematic part.',
    ],
  },
  {
    id: 'm12-qcm-07', moduleId: M12, theme: T1, themeEn: T1_EN, difficulte: 2,
    question: 'Pourquoi dit-on que la diversification est « un outil de croisière, pas un gilet de sauvetage » ?',
    options: [
      'Parce qu\'en crise les corrélations BAISSENT : chacun vend des actifs différents',
      'Parce qu\'en crise les corrélations montent vers 1 : quand tout le monde vend tout en même temps, le terme croisé qui protégeait gonfle au pire moment — le repas gratuit disparaît précisément quand on en a le plus besoin',
      'Parce que la diversification ne fonctionne que sur les actions, pas sur les obligations',
      'Parce que les corrélations sont des constantes physiques, estimées une fois pour toutes',
    ],
    bonneReponse: 1,
    explications: [
      'C\'est l\'exact contraire du mécanisme observé : les ventes forcées et la fuite vers le cash frappent toutes les classes à la fois — actions, crédit, immobilier, matières premières chutent ensemble.',
      'La leçon du module 11 réimportée : les corrélations estimées en temps calme MONTENT vers 1 dans les crises. Une protection construite sur ces corrélations s\'évapore en tempête — la même leçon que le AAA de structure du module 5. La diversification réduit le risque des jours ordinaires ; pour les jours extrêmes, il faut des couvertures et du capital.',
      'La diversification s\'applique à toute classe d\'actifs — c\'est même entre classes (actions/taux/matières premières) qu\'elle est la plus puissante, les corrélations inter-classes étant plus basses.',
      'Les corrélations sont des estimations statistiques instables, pas des constantes : elles dépendent de la fenêtre, du régime de marché — et c\'est précisément leur instabilité en crise qui fait le piège.',
    ],
    questionEn: 'Why is diversification said to be "a cruising tool, not a life jacket"?',
    optionsEn: [
      'Because in a crisis correlations FALL: everyone sells different assets',
      'Because in a crisis correlations rise towards 1: when everyone sells everything at once, the cross term that protected you swells at the worst moment — the free lunch vanishes precisely when you need it most',
      'Because diversification only works on equities, not on bonds',
      'Because correlations are physical constants, estimated once and for all',
    ],
    explicationsEn: [
      'The exact opposite of the observed mechanism: forced sales and the flight to cash hit every asset class at once — equities, credit, real estate and commodities fall together.',
      'Module 11\'s lesson reimported: correlations estimated in calm times RISE towards 1 in crises. Protection built on those correlations evaporates in the storm — the same lesson as module 5\'s structured AAA. Diversification reduces ordinary-day risk; for extreme days you need hedges and capital.',
      'Diversification applies to every asset class — it is even strongest ACROSS classes (equities/rates/commodities), since cross-class correlations are lower.',
      'Correlations are unstable statistical estimates, not constants: they depend on the window and the market regime — and it is precisely their instability in crises that sets the trap.',
    ],
  },
  {
    id: 'm12-qcm-08', moduleId: M12, theme: T1, themeEn: T1_EN, difficulte: 1,
    question: 'Quels ordres de grandeur situent l\'industrie de la gestion d\'actifs ?',
    options: [
      'Environ 1 000 Md$ d\'encours mondiaux — un marché de niche à côté de la banque',
      'BlackRock gère environ 100 000 Md$ à lui seul, soit la totalité du marché',
      'Environ 100 000 Md$ d\'encours mondiaux — l\'ordre de grandeur du PIB mondial annuel — et le premier gérant, BlackRock, dépasse à lui seul 10 000 Md$, plus que le PIB de tout pays sauf deux',
      'Les encours mondiaux équivalent au PIB de la France, environ 3 000 Md$',
    ],
    bonneReponse: 2,
    explications: [
      'Trop petit d\'un facteur cent : la gestion d\'actifs n\'est pas une niche, c\'est l\'autre moitié de la finance — le buy-side, client de tous les desks des onze modules précédents.',
      'Inversion des deux chiffres : 100 000 Md$ est le total MONDIAL ; BlackRock, le premier gérant, en pèse environ un dixième — dominant, mais loin du monopole.',
      'Les deux repères à réciter : ~100 000 Md$ d\'encours mondiaux (l\'ordre du PIB de la planète) et > 10 000 Md$ pour BlackRock seul. Ils disent l\'échelle du métier — et pourquoi les poids de ces portefeuilles pèsent sur les prix de tous les marchés.',
      'Beaucoup trop petit : 3 000 Md$ est l\'ordre de grandeur d\'un très grand fonds souverain ou d\'un gérant moyen, pas de l\'industrie mondiale.',
    ],
    questionEn: 'Which orders of magnitude locate the asset management industry?',
    optionsEn: [
      'About $1,000bn of global AUM — a niche market next to banking',
      'BlackRock alone manages about $100,000bn, i.e. the entire market',
      'About $100,000bn of global AUM — the order of magnitude of annual world GDP — and the largest manager, BlackRock, alone exceeds $10,000bn, more than the GDP of every country but two',
      'Global AUM equals France\'s GDP, about $3,000bn',
    ],
    explicationsEn: [
      'Too small by a factor of one hundred: asset management is no niche, it is the other half of finance — the buy-side, client of every desk in the previous eleven modules.',
      'The two figures are swapped: $100,000bn is the WORLD total; BlackRock, the largest manager, weighs about a tenth of it — dominant, but far from a monopoly.',
      'The two benchmarks to recite: ~$100,000bn of global AUM (the order of the planet\'s GDP) and > $10,000bn for BlackRock alone. They convey the scale of the business — and why these portfolios\' weights move prices in every market.',
      'Far too small: $3,000bn is the order of magnitude of a very large sovereign fund or a mid-sized manager, not of the global industry.',
    ],
  },
  {
    id: 'm12-qcm-09', moduleId: M12, theme: T1, themeEn: T1_EN, difficulte: 1,
    question: 'Quelle est la différence entre un fonds UCITS et un mandat de gestion ?',
    options: [
      'Le fonds est un véhicule COLLECTIF, mutualisé et régulé, achetable par le grand public (label UCITS en Europe) ; le mandat est une gestion SUR MESURE pour un seul client institutionnel, où benchmark, budget de risque et univers se négocient au contrat — dans les deux cas le gérant est un fiduciaire : l\'argent ne lui appartient pas',
      'Le mandat est réservé au grand public, le fonds aux institutionnels',
      'UCITS désigne les hedge funds européens, peu contraints et à levier libre',
      'Aucune : ce sont deux noms commerciaux du même objet juridique',
    ],
    bonneReponse: 0,
    explications: [
      'La carte des formats du chapitre 1 : le fonds mutualise (liquidité quotidienne, diversification imposée par la régulation), le mandat personnalise (contraintes négociées). Et l\'évidence qui structure tout — reporting, contraintes, benchmarks : le gérant est un fiduciaire, il gère l\'argent des AUTRES.',
      'Inversé : c\'est le fonds (UCITS) qui s\'adresse au grand public, avec la protection réglementaire qui va avec ; le mandat exige la taille et la sophistication d\'un institutionnel.',
      'Contresens : UCITS est le label européen des fonds GRAND PUBLIC — mutualisés, régulés, diversification imposée. Le hedge fund est son opposé : investisseurs avertis, levier, vente à découvert, commission de performance.',
      'Les deux formats diffèrent par le client, la régulation et la personnalisation — et ces différences commandent toute la relation : un OPCVM sert des milliers de porteurs anonymes, un mandat répond d\'un contrat unique.',
    ],
    questionEn: 'What is the difference between a UCITS fund and a management mandate?',
    optionsEn: [
      'The fund is a COLLECTIVE vehicle, pooled and regulated, available to the general public (the UCITS label in Europe); the mandate is BESPOKE management for a single institutional client, where benchmark, risk budget and universe are negotiated in the contract — in both cases the manager is a fiduciary: the money is not his',
      'The mandate is for the general public, the fund for institutionals',
      'UCITS refers to European hedge funds, lightly constrained and free to use leverage',
      'None: they are two commercial names for the same legal object',
    ],
    explicationsEn: [
      'Chapter 1\'s map of formats: the fund pools (daily liquidity, regulator-imposed diversification), the mandate customises (negotiated constraints). And the evidence that structures everything — reporting, constraints, benchmarks: the manager is a fiduciary, managing OTHER people\'s money.',
      'Inverted: it is the fund (UCITS) that serves the general public, with the regulatory protection that entails; the mandate requires an institutional client\'s size and sophistication.',
      'A misreading: UCITS is the European label for RETAIL funds — pooled, regulated, with imposed diversification. The hedge fund is its opposite: sophisticated investors, leverage, short selling, performance fees.',
      'The two formats differ by client, regulation and customisation — and those differences drive the whole relationship: a mutual fund serves thousands of anonymous holders, a mandate answers to a single contract.',
    ],
  },
  // ──────────────── la frontière et le CAPM (9) ────────────────
  {
    id: 'm12-qcm-10', moduleId: M12, theme: T2, themeEn: T2_EN, difficulte: 1,
    question: 'Qu\'est-ce que la frontière efficiente de Markowitz (1952) ?',
    options: [
      'La liste des actifs dont le rendement espéré dépasse l\'inflation',
      'L\'ensemble des portefeuilles de variance MINIMALE pour chaque niveau de rendement visé : tout portefeuille sous la frontière est dominé — un autre offre le même rendement pour moins de risque, et le métier de gérant commence par refuser d\'être dominé',
      'La limite réglementaire de risque imposée aux fonds UCITS',
      'La droite qui relie le taux sans risque au portefeuille de marché',
    ],
    bonneReponse: 1,
    explications: [
      'La frontière ne trie pas les actifs un par un : elle trie les ASSEMBLAGES — des jeux de poids. Un actif médiocre isolément peut être précieux dans un portefeuille, si sa corrélation est basse.',
      'La réponse de Markowitz (Nobel 1990) à l\'infinité des choix du chapitre 1 : pour chaque rendement visé, UN portefeuille de variance minimale ; leur ensemble dessine la frontière, qui bombe vers la gauche dès que ρ < 1. Être « sous » la frontière n\'est pas une opinion, c\'est une erreur : quelqu\'un fait mieux avec le même risque.',
      'Aucun rapport réglementaire : la frontière est un objet théorique de construction de portefeuille — la régulation UCITS impose de la diversification, pas une frontière de variance.',
      'La droite partant du taux sans risque est la CML — l\'étape SUIVANTE, qui exige d\'ajouter l\'actif sans risque au monde purement risqué de Markowitz.',
    ],
    questionEn: 'What is Markowitz\'s (1952) efficient frontier?',
    optionsEn: [
      'The list of assets whose expected return beats inflation',
      'The set of MINIMUM-variance portfolios for each targeted return: every portfolio below the frontier is dominated — another one offers the same return for less risk, and the manager\'s job begins with refusing to be dominated',
      'The regulatory risk limit imposed on UCITS funds',
      'The straight line linking the risk-free rate to the market portfolio',
    ],
    explicationsEn: [
      'The frontier does not sort assets one by one: it sorts ASSEMBLIES — sets of weights. An asset mediocre on its own can be precious inside a portfolio, if its correlation is low.',
      'Markowitz\'s answer (Nobel 1990) to chapter 1\'s infinity of choices: for each targeted return, ONE minimum-variance portfolio; together they draw the frontier, which bulges left as soon as ρ < 1. Being "below" the frontier is not an opinion, it is an error: someone does better with the same risk.',
      'Nothing regulatory about it: the frontier is a theoretical portfolio-construction object — UCITS regulation imposes diversification, not a variance frontier.',
      'The straight line from the risk-free rate is the CML — the NEXT step, which requires adding the riskless asset to Markowitz\'s purely risky world.',
    ],
  },
  {
    id: 'm12-qcm-11', moduleId: M12, theme: T2, themeEn: T2_EN, difficulte: 2,
    question: 'Un épargnant « très prudent » détient 100 % d\'obligations. Que lui dit la géométrie de Markowitz ?',
    options: [
      'Qu\'il a raison : les obligations sont l\'actif le moins volatil, donc le portefeuille le moins risqué possible',
      'Que son choix est optimal dès que la corrélation actions-obligations est positive',
      'Qu\'il ne peut faire mieux qu\'en vendant ses obligations à découvert',
      'Qu\'il est DOMINÉ : il existe un point de variance minimale — un mélange contenant un peu d\'actions — MOINS volatil que 100 % d\'obligations, grâce à la corrélation imparfaite ; la prudence maximale n\'est pas le portefeuille sans actions',
    ],
    bonneReponse: 3,
    explications: [
      'L\'intuition « actif le moins volatil = portefeuille le moins risqué » est exactement ce que la frontière réfute : le portefeuille est un objet différent de ses composants, et le terme croisé travaille pour lui.',
      'Le sens est inversé : c\'est la corrélation IMPARFAITE (ρ < 1) qui crée le bénéfice, et il existe dès que les deux actifs ne sont pas des clones — positif ou pas, tant que ρ < 1 le mélange bat le monoproduit.',
      'Aucune vente à découvert nécessaire : le point de variance minimale s\'obtient avec des poids positifs ordinaires — un peu d\'actions, beaucoup d\'obligations.',
      'La lecture qui surprend les débutants : la trajectoire bombe vers la gauche, et le point de variance minimale contient un peu d\'actions — leur ajout DIVERSIFIE plus qu\'il n\'ajoute de risque, tant que la corrélation est basse. Sous ce point, chaque portefeuille a un jumeau au-dessus : même risque, meilleur rendement — seule la branche supérieure est efficiente.',
    ],
    questionEn: 'A "very prudent" saver holds 100% bonds. What does Markowitz\'s geometry tell him?',
    optionsEn: [
      'That he is right: bonds are the least volatile asset, hence the least risky possible portfolio',
      'That his choice is optimal whenever the equity-bond correlation is positive',
      'That he can only do better by short-selling his bonds',
      'That he is DOMINATED: there is a minimum-variance point — a mix containing some equities — LESS volatile than 100% bonds, thanks to imperfect correlation; maximal prudence is not the equity-free portfolio',
    ],
    explicationsEn: [
      'The intuition "least volatile asset = least risky portfolio" is exactly what the frontier refutes: the portfolio is a different object from its components, and the cross term works in its favour.',
      'Backwards: it is IMPERFECT correlation (ρ < 1) that creates the benefit, and it exists as soon as the two assets are not clones — positive or not, as long as ρ < 1 the mix beats the single asset.',
      'No short selling needed: the minimum-variance point is reached with ordinary positive weights — a few equities, many bonds.',
      'The reading that surprises beginners: the curve bulges left, and the minimum-variance point contains some equities — adding them DIVERSIFIES more than it adds risk, as long as correlation is low. Below that point, every portfolio has a twin above it: same risk, better return — only the upper branch is efficient.',
    ],
  },
  {
    id: 'm12-qcm-12', moduleId: M12, theme: T2, themeEn: T2_EN, difficulte: 2,
    question: 'Que dit le théorème de séparation, une fois l\'actif sans risque introduit ?',
    options: [
      'Que chaque investisseur construit sa propre frontière selon son aversion au risque',
      'Que tout investisseur rationnel détient LE MÊME portefeuille risqué — le portefeuille tangent, qui ne peut être que le marché entier pondéré par les capitalisations — et ne règle son appétit pour le risque qu\'en dosant le cash ou le levier autour',
      'Qu\'il faut séparer actions et obligations dans deux poches gérées indépendamment',
      'Que l\'actif sans risque doit peser au moins 50 % de tout portefeuille prudent',
    ],
    bonneReponse: 1,
    explications: [
      'C\'est l\'inverse de la séparation : la frontière risquée est la même pour tous (mêmes anticipations), et l\'aversion au risque ne joue que sur le DOSAGE cash/tangent — pas sur le contenu risqué.',
      'La droite partant de r_f et tangentant la frontière (la CML) domine la frontière elle-même : même risque, rendement supérieur. D\'où deux décisions séparées : QUOI détenir en risqué (le tangent, identique pour tous — donc le marché) et COMBIEN (30 % pour le prudent, 150 % à crédit pour l\'agressif). C\'est ce raisonnement qui fonde le CAPM et, en pratique, la gestion indicielle.',
      'Contresens sur le mot « séparation » : elle sépare la décision de composition de la décision de dosage — elle ne cloisonne pas les classes d\'actifs, qui restent mélangées DANS le portefeuille tangent.',
      'Aucun seuil de ce genre : le poids du cash est libre, de 0 % à plus de 100 % (position emprunteuse) — c\'est précisément la variable d\'ajustement individuelle.',
    ],
    questionEn: 'What does the separation theorem say, once the risk-free asset is introduced?',
    optionsEn: [
      'That each investor builds his own frontier according to his risk aversion',
      'That every rational investor holds THE SAME risky portfolio — the tangency portfolio, which can only be the whole market weighted by capitalisation — and adjusts his risk appetite solely by dosing the cash or leverage around it',
      'That equities and bonds must be separated into two independently managed sleeves',
      'That the risk-free asset must weigh at least 50% of any prudent portfolio',
    ],
    explicationsEn: [
      'The opposite of separation: the risky frontier is the same for everyone (same expectations), and risk aversion only drives the cash/tangency MIX — not the risky content.',
      'The line from r_f tangent to the frontier (the CML) dominates the frontier itself: same risk, higher return. Hence two separate decisions: WHAT to hold in risky assets (the tangency portfolio, identical for all — hence the market) and HOW MUCH (30% for the cautious, 150% on borrowed money for the aggressive). This reasoning underpins both the CAPM and, in practice, index investing.',
      'A misreading of the word "separation": it separates the composition decision from the dosing decision — it does not wall off asset classes, which stay blended INSIDE the tangency portfolio.',
      'No such threshold: the cash weight is free, from 0% to beyond 100% (a borrowing position) — it is precisely the individual adjustment variable.',
    ],
  },
  {
    id: 'm12-qcm-13', moduleId: M12, theme: T2, themeEn: T2_EN, difficulte: 2,
    question: 'Un actif a une volatilité de 25 %, le marché de 15 %, leur corrélation vaut 0,8. Quel est son bêta ?',
    options: [
      '1,666667 : le rapport des volatilités 25/15 — la corrélation ne joue pas',
      '0,8 : le bêta EST la corrélation avec le marché',
      '0,48 : ρ × σ_marché/σ_actif = 0,8 × 15/25',
      '1,333333 : β = ρ × σ_actif/σ_marché = 0,8 × 25/15 — l\'actif amplifie les mouvements du marché d\'un tiers, car le bêta mêle corrélation ET volatilité relative',
    ],
    bonneReponse: 3,
    explications: [
      'Oublier ρ, c\'est traiter tout le risque comme systématique : le rapport brut 25/15 ne vaudrait que pour un actif parfaitement corrélé au marché. La corrélation est précisément le filtre qui ne retient que la part commune.',
      'La corrélation seule ignore l\'amplitude : deux actifs corrélés à 0,8 avec le marché mais de volatilités 10 % et 50 % n\'amplifient pas ses mouvements pareil. Le bêta est une PENTE, pas un coefficient de corrélation.',
      'Fraction inversée : le bêta rapporte la volatilité de l\'ACTIF à celle du marché, pas l\'inverse — 0,48 sous-estimerait précisément l\'actif le plus nerveux.',
      'β = ρ × σa/σm = 0,8 × 25/15 = 1,333333. Les deux ingrédients comptent : le même actif à 25 % de volatilité mais décorrélé (ρ ≈ 0) aurait un bêta quasi nul — son risque, pourtant énorme, serait entièrement diversifiable, donc non rémunéré selon le CAPM.',
    ],
    questionEn: 'An asset has 25% volatility, the market 15%, and their correlation is 0.8. What is its beta?',
    optionsEn: [
      '1.666667: the volatility ratio 25/15 — correlation plays no role',
      '0.8: the beta IS the correlation with the market',
      '0.48: ρ × σ_market/σ_asset = 0.8 × 15/25',
      '1.333333: β = ρ × σ_asset/σ_market = 0.8 × 25/15 — the asset amplifies market moves by a third, because beta blends correlation AND relative volatility',
    ],
    explicationsEn: [
      'Dropping ρ treats all the risk as systematic: the raw ratio 25/15 would only hold for an asset perfectly correlated with the market. Correlation is precisely the filter that keeps only the common part.',
      'Correlation alone ignores amplitude: two assets correlated at 0.8 with the market but with 10% and 50% volatilities do not amplify its moves alike. Beta is a SLOPE, not a correlation coefficient.',
      'The fraction is inverted: beta scales the ASSET\'s volatility by the market\'s, not the reverse — 0.48 would underestimate precisely the jumpier asset.',
      'β = ρ × σa/σm = 0.8 × 25/15 = 1.333333. Both ingredients matter: the same asset at 25% volatility but uncorrelated (ρ ≈ 0) would have a near-zero beta — its risk, however huge, would be fully diversifiable, hence unrewarded under the CAPM.',
    ],
  },
  {
    id: 'm12-qcm-14', moduleId: M12, theme: T2, themeEn: T2_EN, difficulte: 1,
    question: 'Taux sans risque 3 %, prime de marché 5 %, bêta 1,2. Quel rendement le CAPM exige-t-il ?',
    options: [
      '9 % : r = r_f + β × prime = 3 + 1,2 × 5 — le long de la security market line, qui ne paie que le risque systématique',
      '6 % : 1,2 × 5, la prime amplifiée seule',
      '9,6 % : 1,2 × (3 + 5), le bêta amplifie tout, taux sans risque compris',
      '8 % : 3 + 5, le bêta ne sert qu\'à mesurer la volatilité',
    ],
    bonneReponse: 0,
    explications: [
      'La SML : r = r_f + β(r_m − r_f) = 3 + 1,2 × 5 = 9 %. Repère empirique à citer : la prime de risque du marché actions vaut environ 4 à 6 % par an sur longue période. Et l\'usage desk : ce 9 % est l\'ÉTALON — un gérant de bêta 1,2 qui livre 11 % a créé 2 points d\'alpha.',
      'Oublier le taux sans risque ampute la rémunération du TEMPS : même un actif de bêta nul rapporte r_f. Le bêta n\'amplifie que la prime, il ne remplace pas le socle.',
      'Le bêta n\'amplifie pas le taux sans risque : celui-ci rémunère l\'attente, disponible sans prendre aucun risque — seule la prime de risque (r_m − r_f) passe par le bêta.',
      'Additionner taux et prime sans le bêta, c\'est pricer un actif de bêta exactement 1 — le marché lui-même. Un bêta de 1,2 exige un cinquième de prime en plus.',
    ],
    questionEn: 'Risk-free rate 3%, market premium 5%, beta 1.2. What return does the CAPM require?',
    optionsEn: [
      '9%: r = r_f + β × premium = 3 + 1.2 × 5 — along the security market line, which only pays for systematic risk',
      '6%: 1.2 × 5, the amplified premium alone',
      '9.6%: 1.2 × (3 + 5), beta amplifies everything, risk-free rate included',
      '8%: 3 + 5, beta being only a measure of volatility',
    ],
    explicationsEn: [
      'The SML: r = r_f + β(r_m − r_f) = 3 + 1.2 × 5 = 9%. The empirical benchmark to quote: the equity market risk premium is about 4 to 6% per year over long periods. And the desk usage: this 9% is the YARDSTICK — a beta-1.2 manager delivering 11% has created 2 points of alpha.',
      'Dropping the risk-free rate removes the payment for TIME: even a zero-beta asset earns r_f. Beta only amplifies the premium, it does not replace the base.',
      'Beta does not amplify the risk-free rate: that rate rewards waiting, and is available with no risk at all — only the risk premium (r_m − r_f) flows through beta.',
      'Adding rate and premium without beta prices an asset of beta exactly 1 — the market itself. A beta of 1.2 demands one fifth more premium.',
    ],
  },
  {
    id: 'm12-qcm-15', moduleId: M12, theme: T2, themeEn: T2_EN, difficulte: 2,
    question: 'Une biotech a 40 % de volatilité mais une corrélation quasi nulle avec le marché. Selon le CAPM, quel rendement peut-elle promettre à un investisseur diversifié ?',
    options: [
      'Un rendement très élevé : 40 % de volatilité est un risque énorme, qui doit se payer',
      'Un rendement négatif : les actifs décorrélés coûtent une prime d\'assurance',
      'À peine plus que le taux sans risque : son bêta est proche de 0, donc son risque — aussi énorme soit-il — est DIVERSIFIABLE, et le marché ne paie pas ce que n\'importe qui peut éliminer gratuitement',
      'Exactement le rendement du marché : toutes les actions convergent vers la SML',
    ],
    bonneReponse: 2,
    explications: [
      'Le piège classique d\'oral — « un actif à 40 % de volatilité doit-il rapporter plus qu\'un actif à 15 % ? » : cela dépend UNIQUEMENT de leurs bêtas. La volatilité mesure le risque total ; le bêta n\'en retient que la part systématique, la seule que subit le porteur diversifié.',
      'Un bêta proche de zéro donne un rendement proche de r_f — pas en dessous : le rendement négatif exigerait un bêta NÉGATIF, celui d\'un actif de couverture qui monte quand le marché baisse (une assurance, qui, elle, se paie).',
      'La seule idée du CAPM, formulée sur son cas le plus contre-intuitif : β = ρ × σa/σm ≈ 0 quand ρ ≈ 0, donc rendement exigé ≈ r_f. L\'essai clinique de la biotech est un pari purement spécifique — dilué dans tout portefeuille diversifié, donc gratuit aux yeux du marché. On n\'est pas payé pour le risque que l\'on prend, mais pour celui que l\'on ne peut pas éliminer.',
      'Tous les actifs se placent SUR la SML, mais chacun à SON bêta : le rendement du marché correspond à β = 1, pas à β ≈ 0. La biotech se place tout à gauche de la droite, près de r_f.',
    ],
    questionEn: 'A biotech has 40% volatility but near-zero correlation with the market. Under the CAPM, what return can it promise a diversified investor?',
    optionsEn: [
      'A very high return: 40% volatility is enormous risk, which must be paid for',
      'A negative return: uncorrelated assets cost an insurance premium',
      'Barely more than the risk-free rate: its beta is close to 0, so its risk — however huge — is DIVERSIFIABLE, and the market does not pay for what anyone can eliminate for free',
      'Exactly the market return: all stocks converge to the SML',
    ],
    explicationsEn: [
      'The classic oral trap — "must a 40%-volatility asset earn more than a 15% one?": it depends ONLY on their betas. Volatility measures total risk; beta keeps only the systematic part, the only one a diversified holder actually bears.',
      'A near-zero beta gives a return near r_f — not below it: a negative return would require a NEGATIVE beta, that of a hedging asset that rises when the market falls (an insurance, which does cost).',
      'The CAPM\'s single idea, stated on its most counter-intuitive case: β = ρ × σa/σm ≈ 0 when ρ ≈ 0, hence required return ≈ r_f. The biotech\'s clinical trial is a purely specific bet — diluted in any diversified portfolio, hence free in the market\'s eyes. You are not paid for the risk you take, but for the risk you cannot eliminate.',
      'All assets sit ON the SML, but each at ITS beta: the market return corresponds to β = 1, not β ≈ 0. The biotech sits at the far left of the line, near r_f.',
    ],
  },
  {
    id: 'm12-qcm-16', moduleId: M12, theme: T2, themeEn: T2_EN, difficulte: 2,
    question: 'CML et SML : quelle est la différence entre ces deux droites ?',
    options: [
      'La CML porte en abscisse la volatilité TOTALE et ne contient que les portefeuilles efficients (mélanges de cash et de marché) ; la SML porte en abscisse le BÊTA et contient TOUS les actifs — à l\'équilibre, même une biotech mal diversifiée est sur la SML, mais très loin sous la CML',
      'Ce sont deux noms de la même droite, selon les manuels',
      'La CML concerne les actions, la SML les obligations',
      'La SML ne contient que les portefeuilles efficients, la CML tous les actifs',
    ],
    bonneReponse: 0,
    explications: [
      'La distinction d\'oral classique, et sa clé : sur la CML on paie le risque TOTAL (mais seuls les portefeuilles parfaitement diversifiés y vivent) ; sur la SML on ne paie que le risque SYSTÉMATIQUE (et tous les actifs s\'y placent, car leur prix ne rémunère que leur contribution au marché). La biotech du chapitre : bêta ~0, donc sur la SML près de r_f — et loin sous la CML, trop de risque total pour son rendement.',
      'Deux objets distincts : abscisses différentes (σ contre β), contenus différents (les efficients seuls contre tous les actifs). Les confondre trahit une lecture superficielle du modèle.',
      'Aucun découpage par classe d\'actifs : les deux droites parlent de TOUT actif ou portefeuille — la différence est la mesure de risque portée en abscisse, pas l\'univers.',
      'Inversé, exactement : c\'est la CML qui est réservée aux portefeuilles efficients, et la SML qui accueille tous les actifs, même très mal diversifiés pris isolément.',
    ],
    questionEn: 'CML and SML: what is the difference between these two lines?',
    optionsEn: [
      'The CML plots TOTAL volatility on the x-axis and contains only efficient portfolios (mixes of cash and the market); the SML plots BETA and contains ALL assets — at equilibrium, even a poorly diversified biotech sits on the SML, yet far below the CML',
      'They are two names for the same line, depending on the textbook',
      'The CML deals with equities, the SML with bonds',
      'The SML contains only efficient portfolios, the CML all assets',
    ],
    explicationsEn: [
      'The classic oral distinction, and its key: on the CML you are paid for TOTAL risk (but only perfectly diversified portfolios live there); on the SML only SYSTEMATIC risk is paid (and every asset sits there, since its price only rewards its contribution to the market). The chapter\'s biotech: beta ~0, so on the SML near r_f — and far below the CML, too much total risk for its return.',
      'Two distinct objects: different x-axes (σ versus β), different contents (efficient portfolios only versus all assets). Confusing them betrays a superficial reading of the model.',
      'No asset-class split: both lines speak about ANY asset or portfolio — the difference is the risk measure on the x-axis, not the universe.',
      'Exactly inverted: it is the CML that is reserved for efficient portfolios, and the SML that hosts all assets, even those very poorly diversified in isolation.',
    ],
  },
  {
    id: 'm12-qcm-17', moduleId: M12, theme: T2, themeEn: T2_EN, difficulte: 3,
    question: 'Quelle est la principale faiblesse EMPIRIQUE du CAPM, et pourquoi continue-t-on de l\'utiliser ?',
    options: [
      'Il est mathématiquement incohérent : la SML n\'existe pas à l\'équilibre',
      'Il surestime systématiquement tous les rendements, ce qui le rend inutilisable',
      'Il prédit mal les rendements en coupe — les anomalies value, momentum et low-vol contredisent la SML, la relation bêta/rendement mesurée est plus plate que la théorie — mais son langage bêta/alpha structure tout le métier : c\'est un langage plus qu\'une loi',
      'Aucune : le CAPM est vérifié empiriquement depuis 1964',
    ],
    bonneReponse: 2,
    explications: [
      'La cohérence interne du modèle n\'est pas en cause : sous ses hypothèses (anticipations homogènes, prêt illimité à r_f…), la SML se dérive proprement. Le problème est que ces hypothèses sont ouvertement irréalistes — et que les données ne suivent pas.',
      'Pas de biais systématique dans un sens unique : le modèle se trompe EN COUPE — il sous-paie les value et le momentum, sur-paie les hauts bêtas — la pente mesurée est trop plate, pas uniformément trop haute.',
      'La nuance qui vaut des points : les anomalies (value, momentum, et les actions à FAIBLE volatilité qui rapportent plus que leur bêta ne l\'exige — à rebours exact de la SML) ont mené aux modèles multi-facteurs de Fama-French, où l\'alpha est ce qui survit à tous les facteurs. Mais le CAPM reste l\'étalon : exposition (bêta, réplicable pour rien) contre valeur ajoutée (alpha, rare et chère) — la grammaire de toute fiche de fonds.',
      'Indéfendable : quarante ans d\'études documentent les anomalies. Répondre « vérifié » à l\'oral signale qu\'on n\'a lu ni Fama-French ni la moindre fiche de fonds.',
    ],
    questionEn: 'What is the CAPM\'s main EMPIRICAL weakness, and why is it still used?',
    optionsEn: [
      'It is mathematically inconsistent: the SML does not exist at equilibrium',
      'It systematically overestimates all returns, making it unusable',
      'It predicts cross-sectional returns poorly — the value, momentum and low-vol anomalies contradict the SML, the measured beta/return relation is flatter than theory — but its beta/alpha language structures the whole business: it is a language more than a law',
      'None: the CAPM has been empirically verified since 1964',
    ],
    explicationsEn: [
      'The model\'s internal consistency is not the issue: under its assumptions (homogeneous expectations, unlimited lending at r_f…), the SML derives cleanly. The problem is that those assumptions are openly unrealistic — and the data do not comply.',
      'No one-directional bias: the model errs IN THE CROSS-SECTION — underpaying value and momentum, overpaying high betas — the measured slope is too flat, not uniformly too high.',
      'The nuance that earns marks: the anomalies (value, momentum, and LOW-volatility stocks earning more than their beta demands — the exact reverse of the SML) led to Fama-French multi-factor models, where alpha is what survives all factors. Yet the CAPM remains the yardstick: exposure (beta, replicable for nothing) versus added value (alpha, rare and expensive) — the grammar of every fund factsheet.',
      'Indefensible: forty years of studies document the anomalies. Answering "verified" at the oral signals you have read neither Fama-French nor a single fund factsheet.',
    ],
  },
  {
    id: 'm12-qcm-18', moduleId: M12, theme: T2, themeEn: T2_EN, difficulte: 2,
    question: 'Un portefeuille actions de 120 M€ a un bêta de 1,2. Sur quel montant dimensionner la vente de futures qui neutralise son risque de marché ?',
    options: [
      '120 M€ : la valeur du portefeuille, le bêta ne sert qu\'au reporting',
      '144 M€ : l\'exposition équivalent-indice vaut 120 × 1,2 — vendre au bêta neutralise le risque de marché, et il ne reste dans le book que le pari spécifique du gérant, son alpha à l\'état pur',
      '100 M€ : la valeur divisée par le bêta, 120/1,2',
      '24 M€ : seul l\'excès de bêta au-dessus de 1 se couvre',
    ],
    bonneReponse: 1,
    explications: [
      'Couvrir 120 M€ sous-couvre un book de bêta 1,2 : il resterait 0,2 × 120 = 24 M€ d\'exposition résiduelle au marché — le portefeuille continuerait d\'amplifier chaque baisse d\'un cinquième de trop.',
      'Le calcul du module 7 réimporté : l\'exposition au marché n\'est pas la valeur du book mais la valeur × bêta = 144 M€ équivalent-indice — c\'est ce montant que l\'on divise par le nominal d\'un contrat. Les fonds market neutral vivent en permanence dans cet état : bêta couvert, alpha isolé.',
      'Diviser par le bêta inverse la logique : un book PLUS nerveux que le marché exige une couverture PLUS grosse que sa valeur, pas plus petite.',
      'Couvrir le seul excès (24 M€) ramènerait le bêta à 1 — un book qui suit le marché — pas à 0 : la neutralisation complète exige de couvrir toute l\'exposition équivalent-indice.',
    ],
    questionEn: 'A 120 M€ equity portfolio has a beta of 1.2. On what amount should the futures sale that neutralises its market risk be sized?',
    optionsEn: [
      '120 M€: the portfolio value, beta being for reporting only',
      '144 M€: the index-equivalent exposure is 120 × 1.2 — selling at beta neutralises market risk, and what remains in the book is the manager\'s specific bet, his alpha in its pure state',
      '100 M€: the value divided by beta, 120/1.2',
      '24 M€: only the excess of beta above 1 needs hedging',
    ],
    explicationsEn: [
      'Hedging 120 M€ under-hedges a beta-1.2 book: 0.2 × 120 = 24 M€ of residual market exposure would remain — the portfolio would keep amplifying every downturn by a fifth too much.',
      'Module 7\'s calculation reimported: market exposure is not the book\'s value but value × beta = 144 M€ index-equivalent — that amount, divided by one contract\'s notional, sizes the hedge. Market-neutral funds live permanently in this state: beta hedged, alpha isolated.',
      'Dividing by beta inverts the logic: a book JUMPIER than the market requires a hedge LARGER than its value, not smaller.',
      'Hedging only the excess (24 M€) would bring the beta back to 1 — a book that tracks the market — not to 0: full neutralisation requires hedging the entire index-equivalent exposure.',
    ],
  },
  // ──────────────── mesurer la performance (8) ────────────────
  {
    id: 'm12-qcm-19', moduleId: M12, theme: T3, themeEn: T3_EN, difficulte: 1,
    question: 'Un portefeuille rend 8 % quand le cash paie 3 %, avec 10 % de volatilité. Quel est son ratio de Sharpe ?',
    options: [
      '0,8 : le rendement divisé par la volatilité, 8/10',
      '5 : l\'excès de rendement, en points',
      '0,5 : (8 − 3)/10 — chaque point de volatilité subie a payé un demi-point de rendement au-dessus du cash ; repères : 0,3-0,5 pour des actions passives en longue période, > 1 excellent, > 2 suspect',
      '2 : la volatilité divisée par l\'excès de rendement, 10/(8 − 3)',
    ],
    bonneReponse: 2,
    explications: [
      'Oublier de retrancher le cash gonfle le ratio : les 3 premiers points de rendement étaient disponibles SANS risque — le Sharpe ne rémunère que ce que le risque a rapporté au-delà.',
      'L\'excès de rendement (5 points) est le numérateur, pas le ratio : sans division par la volatilité, impossible de comparer deux portefeuilles de risques différents — c\'est toute la raison d\'être du Sharpe.',
      'Sharpe = (r − r_f)/σ = (8 − 3)/10 = 0,5, sans unité. Il répond à la question la plus primitive : valait-il la peine de quitter le cash ? Les repères d\'usage sont à réciter : ~0,3-0,5 pour un portefeuille actions passif, > 1 excellent, > 2 non pas impressionnant mais SUSPECT.',
      'Fraction inversée : ce ratio-là dirait combien de risque il faut subir par point de rendement — l\'inverse de la question posée. Le Sharpe met le gain au numérateur, le prix (le risque) au dénominateur.',
    ],
    questionEn: 'A portfolio returns 8% while cash pays 3%, with 10% volatility. What is its Sharpe ratio?',
    optionsEn: [
      '0.8: the return divided by volatility, 8/10',
      '5: the excess return, in points',
      '0.5: (8 − 3)/10 — each point of volatility endured paid half a point of return above cash; benchmarks: 0.3-0.5 for passive equities over the long run, > 1 excellent, > 2 suspicious',
      '2: volatility divided by excess return, 10/(8 − 3)',
    ],
    explicationsEn: [
      'Forgetting to subtract cash inflates the ratio: the first 3 points of return were available with NO risk — the Sharpe only credits what risk earned beyond that.',
      'The excess return (5 points) is the numerator, not the ratio: without dividing by volatility, you cannot compare two portfolios of different risk — which is the Sharpe\'s whole reason for existing.',
      'Sharpe = (r − r_f)/σ = (8 − 3)/10 = 0.5, unitless. It answers the most primitive question: was leaving cash worth it? The usage benchmarks are to be recited: ~0.3-0.5 for a passive equity portfolio, > 1 excellent, > 2 not impressive but SUSPICIOUS.',
      'The fraction is inverted: that ratio would say how much risk you endure per point of return — the reverse of the question asked. The Sharpe puts the gain in the numerator, the price (the risk) in the denominator.',
    ],
  },
  {
    id: 'm12-qcm-20', moduleId: M12, theme: T3, themeEn: T3_EN, difficulte: 2,
    question: 'Un fonds a rendu 12 % avec un bêta de 1,2 ; le marché a fait 10 %, le cash 3 %. Quel est son alpha de Jensen ?',
    options: [
      '+0,6 % : le CAPM exigeait 3 + 1,2 × (10 − 3) = 11,4 %, et le fonds a livré 12 % — le gérant a battu SON risque, de peu',
      '+2 % : il a battu le marché de 12 − 10',
      '0 % : un fonds qui bat le marché n\'a pas d\'alpha, seulement du bêta',
      '+9 % : le rendement moins le taux sans risque, 12 − 3',
    ],
    bonneReponse: 0,
    explications: [
      'α = r − [r_f + β(r_m − r_f)] = 12 − 11,4 = +0,6 %. L\'alpha est ce qui reste quand on a payé le bêta — la denrée la plus chère et la plus rare du buy-side. Sur les 2 points d\'écart apparent au marché, 1,4 point n\'est que la rémunération normale du risque amplifié.',
      'La lecture naïve α = r − r_m oublie que le bêta de 1,2 est une amplification ACHETÉE, pas fabriquée : sur un marché haussier, un portefeuille plus risqué que le marché DOIT faire mieux que lui. « 2 % de talent » confond rémunération du risque et sélection.',
      'Contresens : l\'alpha n\'est pas nul dès qu\'on bat le marché, il se mesure contre l\'exigence du CAPM — ici 11,4 %, dépassée de 0,6 point. En revanche, un fonds à bêta 1 qui fait EXACTEMENT le marché a bien un alpha nul : un ETF l\'aurait livré pour presque rien.',
      'L\'excès sur le cash (9 points) est le numérateur du Sharpe, pas l\'alpha : il ignore le bêta — donc il crédite au « talent » toute la rémunération du risque de marché.',
    ],
    questionEn: 'A fund returned 12% with a beta of 1.2; the market did 10%, cash 3%. What is its Jensen alpha?',
    optionsEn: [
      '+0.6%: the CAPM required 3 + 1.2 × (10 − 3) = 11.4%, and the fund delivered 12% — the manager beat HIS risk, narrowly',
      '+2%: it beat the market by 12 − 10',
      '0%: a fund that beats the market has no alpha, only beta',
      '+9%: the return minus the risk-free rate, 12 − 3',
    ],
    explicationsEn: [
      'α = r − [r_f + β(r_m − r_f)] = 12 − 11.4 = +0.6%. Alpha is what remains once beta has been paid for — the most expensive and rarest commodity on the buy-side. Of the apparent 2-point gap to the market, 1.4 points are just the normal reward for amplified risk.',
      'The naive reading α = r − r_m forgets that the 1.2 beta is amplification BOUGHT, not manufactured: in a rising market, a portfolio riskier than the market MUST beat it. "2% of talent" confuses risk compensation with selection.',
      'Backwards: alpha is not zero whenever the market is beaten, it is measured against the CAPM\'s requirement — here 11.4%, exceeded by 0.6 points. However, a beta-1 fund that does EXACTLY the market does have zero alpha: an ETF would have delivered it for almost nothing.',
      'The excess over cash (9 points) is the Sharpe\'s numerator, not alpha: it ignores beta — thus crediting all the market-risk compensation to "talent".',
    ],
  },
  {
    id: 'm12-qcm-21', moduleId: M12, theme: T3, themeEn: T3_EN, difficulte: 2,
    question: 'Un hedge fund présente un Sharpe de 3 sur cinq ans. Quel est le bon réflexe de desk ?',
    options: [
      'Investir vite : un Sharpe de 3 est six fois le portefeuille passif',
      'Se méfier : un Sharpe très élevé signale souvent une stratégie qui VEND DE L\'ASSURANCE — prime régulière, volatilité historique minuscule, et un risque de queue que l\'écart-type ne voit pas tant qu\'il ne s\'est pas réalisé ; LTCM affichait plus de 4 avant 1998, puis a perdu 4,3 Md$ en quelques semaines',
      'Vérifier que le fonds a un bêta exactement égal à 1',
      'Recalculer le ratio avec un taux sans risque plus élevé',
    ],
    bonneReponse: 1,
    explications: [
      'C\'est précisément le réflexe que le chapitre veut éteindre : au-dessus de 2, un Sharpe cesse d\'être une performance et devient une QUESTION — d\'où vient un rendement aussi lisse ?',
      'Le mécanisme est toujours le même : vente d\'options (module 8), portage de crédit, arbitrage de convergence — encaisser une petite prime régulière et porter un risque de queue qui ne s\'est simplement pas encore réalisé dans la fenêtre. La volatilité historique ne voit pas un risque qui n\'a pas eu lieu. Devant un Sharpe > 2 : demander d\'où vient le rendement, exiger la distribution, pas le ratio.',
      'Le bêta est une autre question (l\'exposition au marché) : un vendeur d\'assurance peut afficher un bêta faible ET un Sharpe superbe — c\'est même la combinaison typique du piège.',
      'Changer r_f déplace le ratio de quelques centièmes : il ne fera pas apparaître la queue de distribution cachée — le problème est dans le dénominateur (une volatilité qui n\'a rien vu), pas dans le numérateur.',
    ],
    questionEn: 'A hedge fund shows a Sharpe of 3 over five years. What is the right desk reflex?',
    optionsEn: [
      'Invest fast: a Sharpe of 3 is six times the passive portfolio',
      'Be suspicious: a very high Sharpe often signals a strategy that SELLS INSURANCE — regular premium, tiny historical volatility, and a tail risk the standard deviation cannot see until it materialises; LTCM showed above 4 before 1998, then lost $4.3bn in a few weeks',
      'Check that the fund has a beta of exactly 1',
      'Recompute the ratio with a higher risk-free rate',
    ],
    explicationsEn: [
      'Precisely the reflex this chapter wants to extinguish: above 2, a Sharpe stops being a performance and becomes a QUESTION — where does such a smooth return come from?',
      'The mechanism is always the same: option selling (module 8), credit carry, convergence arbitrage — collecting a small regular premium while carrying a tail risk that simply has not yet materialised within the window. Historical volatility cannot see a risk that has not happened. Facing a Sharpe > 2: ask where the return comes from, demand the distribution, not the ratio.',
      'Beta is a different question (market exposure): an insurance seller can show a low beta AND a superb Sharpe — that is in fact the trap\'s typical combination.',
      'Changing r_f moves the ratio by a few hundredths: it will not reveal the hidden tail — the problem lies in the denominator (a volatility that saw nothing), not in the numerator.',
    ],
  },
  {
    id: 'm12-qcm-22', moduleId: M12, theme: T3, themeEn: T3_EN, difficulte: 2,
    question: 'Un gérant bat son indice de 2 % par an avec une tracking error de 4 %. Quel est son ratio d\'information, et que mesure-t-il ?',
    options: [
      '8 : le produit 2 × 4, l\'efficacité totale du mandat',
      '2 : la surperformance brute suffit, la tracking error est un détail de reporting',
      '0,25 : la tracking error divisée par la surperformance... rapportée au double',
      '0,5 : IR = surperformance/TE = 2/4 — le Sharpe du gérant ACTIF : combien chaque unité d\'écart au benchmark a rapporté ; > 0,5 maintenu dans la durée est déjà très bon, et la TE, elle, se CHOISIT — c\'est le budget de liberté du mandat',
    ],
    bonneReponse: 3,
    explications: [
      'Multiplier n\'a aucun sens dimensionnel : plus de risque pris augmenterait le « score » — l\'exact opposé de ce qu\'un ratio ajusté du risque doit faire.',
      'La surperformance brute sans son risque est le mensonge que le chapitre 3 démonte : 2 % gagnés avec 4 % de TE (paris mesurés) et 2 % gagnés avec 12 % de TE (casino) ne méritent pas le même jugement — IR 0,5 contre 0,17.',
      'Fraction inversée (4/2 = 2, pas 0,25 d\'ailleurs) : l\'IR met le gain au numérateur et le risque au dénominateur, comme le Sharpe — la construction est toujours la même.',
      'IR = 2/4 = 0,5. Même construction que le Sharpe — un excès de rendement divisé par le risque pris pour l\'obtenir — mais l\'étalon est le MANDAT, pas le cash. Et le point capital : contrairement à la volatilité du marché qui se subit, la tracking error se choisit — 0,5 % pour un indiciel, 2 à 6 % pour un actif classique.',
    ],
    questionEn: 'A manager beats his index by 2% a year with a 4% tracking error. What is his information ratio, and what does it measure?',
    optionsEn: [
      '8: the product 2 × 4, the mandate\'s total efficiency',
      '2: the raw outperformance suffices, tracking error is a reporting detail',
      '0.25: the tracking error divided by the outperformance... scaled by two',
      '0.5: IR = outperformance/TE = 2/4 — the ACTIVE manager\'s Sharpe: how much each unit of deviation from the benchmark earned; > 0.5 sustained over time is already very good, and the TE, unlike volatility, is CHOSEN — the mandate\'s freedom budget',
    ],
    explicationsEn: [
      'Multiplying makes no dimensional sense: taking more risk would raise the "score" — the exact opposite of what a risk-adjusted ratio must do.',
      'Raw outperformance without its risk is the lie chapter 3 dismantles: 2% earned with 4% TE (measured bets) and 2% earned with 12% TE (casino) do not deserve the same judgement — IR 0.5 versus 0.17.',
      'An inverted fraction (4/2 = 2, not 0.25, incidentally): the IR puts the gain in the numerator and the risk in the denominator, like the Sharpe — the construction never changes.',
      'IR = 2/4 = 0.5. Same construction as the Sharpe — an excess return divided by the risk taken to get it — but the yardstick is the MANDATE, not cash. And the capital point: unlike market volatility, which is endured, tracking error is chosen — 0.5% for an index fund, 2 to 6% for a classic active manager.',
    ],
  },
  {
    id: 'm12-qcm-23', moduleId: M12, theme: T3, themeEn: T3_EN, difficulte: 2,
    question: 'Quelle est la différence entre le ratio de Sharpe et le ratio d\'information ?',
    options: [
      'Même construction — un excès de rendement divisé par le risque pris — mais pas le même étalon : le Sharpe compare au CASH avec le risque total (σ), l\'IR compare au BENCHMARK du mandat avec la tracking error ; confondre les deux, c\'est confondre « le risque a-t-il payé ? » et « la liberté du gérant a-t-elle payé ? »',
      'Aucune : l\'IR est l\'ancien nom du Sharpe, avant 1994',
      'Le Sharpe s\'applique aux actions, l\'IR aux obligations',
      'L\'IR est toujours supérieur au Sharpe, car la tracking error est plus petite que la volatilité',
    ],
    bonneReponse: 0,
    explications: [
      'Les trois étalons du chapitre s\'emboîtent : le cash (Sharpe — le risque total a-t-il payé ?), le marché ajusté du bêta (alpha — y a-t-il du talent ?), le mandat (IR — la liberté accordée a-t-elle été rentabilisée ?). Un fonds indiciel peut avoir un excellent Sharpe (le marché a monté) et un IR sans objet (aucun pari) : les deux ratios répondent à des questions différentes.',
      'Deux objets distincts et contemporains : numérateurs différents (excès sur cash contre surperformance sur benchmark), dénominateurs différents (volatilité totale contre tracking error).',
      'Aucun découpage par classe : les deux ratios s\'appliquent à tout portefeuille — la différence est l\'étalon de comparaison, pas l\'univers d\'investissement.',
      'Aucune inégalité systématique : un gérant peut avoir un IR élevé et un Sharpe médiocre (bons paris dans un marché baissier) ou l\'inverse — précisément parce que les questions posées diffèrent.',
    ],
    questionEn: 'What is the difference between the Sharpe ratio and the information ratio?',
    optionsEn: [
      'Same construction — an excess return divided by the risk taken — but not the same yardstick: the Sharpe compares to CASH with total risk (σ), the IR compares to the mandate\'s BENCHMARK with tracking error; confusing them means confusing "did the risk pay?" with "did the manager\'s freedom pay?"',
      'None: IR is the old name of the Sharpe, before 1994',
      'The Sharpe applies to equities, the IR to bonds',
      'The IR is always higher than the Sharpe, since tracking error is smaller than volatility',
    ],
    explicationsEn: [
      'The chapter\'s three yardsticks nest: cash (Sharpe — did total risk pay?), the beta-adjusted market (alpha — is there talent?), the mandate (IR — was the granted freedom monetised?). An index fund can have an excellent Sharpe (the market rose) and a moot IR (no bets): the two ratios answer different questions.',
      'Two distinct, contemporary objects: different numerators (excess over cash versus outperformance over benchmark), different denominators (total volatility versus tracking error).',
      'No split by asset class: both ratios apply to any portfolio — the difference is the comparison yardstick, not the investment universe.',
      'No systematic inequality: a manager can have a high IR and a mediocre Sharpe (good bets in a falling market) or the reverse — precisely because the questions asked differ.',
    ],
  },
  {
    id: 'm12-qcm-24', moduleId: M12, theme: T3, themeEn: T3_EN, difficulte: 2,
    question: 'Pourquoi la performance moyenne affichée par les bases de données de fonds est-elle structurellement trop belle ?',
    options: [
      'Parce que les gérants arrondissent leurs chiffres au point supérieur',
      'À cause du biais du SURVIVANT : les fonds qui meurent — et ils meurent d\'avoir mal performé — sortent des bases ; la moyenne des survivants surestime la catégorie d\'environ 1 à 2 % par an ; la question qui tue : « et les fonds que votre société a fermés ? »',
      'Parce que les bases de données incluent les dividendes',
      'Parce que la volatilité des fonds est sous-estimée en période calme',
    ],
    bonneReponse: 1,
    explications: [
      'Pas besoin de tricherie individuelle : le biais est STRUCTUREL — il opère même si chaque chiffre publié est exact, par simple disparition des perdants de l\'échantillon.',
      'Le mécanisme du chapitre 3 : une société lance dix fonds, en ferme six médiocres, et sa « gamme » affiche la moyenne des quatre survivants. L\'effet est mesuré : 1 à 2 % par an de surestimation. C\'est pour cela que SPIVA (chapitre 4) corrige explicitement ce biais — et que ses verdicts sont si sévères.',
      'Inclure les dividendes est CORRECT — c\'est la performance totale. Les exclure serait l\'erreur ; ce n\'est pas la source du biais.',
      'Hors sujet : la sous-estimation de la volatilité fausse les ratios ajustés du risque, pas la moyenne des rendements affichés — le biais du survivant frappe, lui, la moyenne elle-même.',
    ],
    questionEn: 'Why is the average performance shown by fund databases structurally too good?',
    optionsEn: [
      'Because managers round their figures up',
      'Because of SURVIVORSHIP bias: funds that die — and they die of poor performance — drop out of the databases; the survivors\' average overstates the category by about 1 to 2% per year; the killer question: "and the funds your firm closed?"',
      'Because databases include dividends',
      'Because fund volatility is underestimated in calm periods',
    ],
    explicationsEn: [
      'No individual cheating needed: the bias is STRUCTURAL — it operates even if every published figure is exact, through the simple disappearance of losers from the sample.',
      'Chapter 3\'s mechanism: a firm launches ten funds, closes six mediocre ones, and its "range" shows the average of the four survivors. The effect is measured: 1 to 2% per year of overstatement. That is why SPIVA (chapter 4) explicitly corrects this bias — and why its verdicts are so harsh.',
      'Including dividends is CORRECT — that is total return. Excluding them would be the error; it is not the source of the bias.',
      'Beside the point: understated volatility distorts risk-adjusted ratios, not the average of displayed returns — survivorship bias, by contrast, hits the average itself.',
    ],
  },
  {
    id: 'm12-qcm-25', moduleId: M12, theme: T3, themeEn: T3_EN, difficulte: 2,
    question: 'Un gérant emprunte au taux sans risque pour doubler sa position. Que deviennent son rendement affiché et son ratio de Sharpe ?',
    options: [
      'Les deux doublent : le levier est un multiplicateur de talent',
      'Le rendement double, le Sharpe est divisé par deux',
      'L\'excès de rendement double ET la volatilité double : le rendement affiché gonfle, le Sharpe ne bouge pas d\'un cheveu — un rendement spectaculaire à Sharpe ordinaire, c\'est du levier, pas du talent',
      'Rien ne change : le levier au taux sans risque est neutre sur tout',
    ],
    bonneReponse: 2,
    explications: [
      'Le levier ne multiplie que l\'EXPOSITION : le numérateur (excès de rendement) et le dénominateur (volatilité) doublent ensemble, le ratio est inchangé — aucun talent n\'a été créé, seulement du risque.',
      'Aucun mécanisme ne divise le Sharpe : les deux termes du ratio évoluent proportionnellement. Diviser par deux supposerait que la volatilité quadruple — le levier est linéaire, pas quadratique.',
      'Le troisième des quatre trucages du track record (avec la fenêtre choisie, le survivant et le brut de frais) : emprunter à r_f double (r − r_f) et double σ — le Sharpe est invariant au levier. D\'où le réflexe : devant un rendement spectaculaire, demander le Sharpe ; s\'il est ordinaire, c\'est l\'échelle qui a changé, pas la qualité.',
      'Pas neutre sur tout : le rendement AFFICHÉ change bel et bien — c\'est même le but du maquillage. Ce qui est invariant, c\'est le rendement ajusté du risque.',
    ],
    questionEn: 'A manager borrows at the risk-free rate to double his position. What happens to his displayed return and his Sharpe ratio?',
    optionsEn: [
      'Both double: leverage is a talent multiplier',
      'The return doubles, the Sharpe is halved',
      'The excess return doubles AND the volatility doubles: the displayed return swells, the Sharpe does not move a hair — a spectacular return with an ordinary Sharpe is leverage, not talent',
      'Nothing changes: leverage at the risk-free rate is neutral on everything',
    ],
    explicationsEn: [
      'Leverage only multiplies EXPOSURE: the numerator (excess return) and the denominator (volatility) double together, the ratio is unchanged — no talent was created, only risk.',
      'No mechanism halves the Sharpe: both terms of the ratio scale proportionally. Halving would require volatility to quadruple — leverage is linear, not quadratic.',
      'The third of the four track-record tricks (with the chosen window, the survivor and gross-of-fees figures): borrowing at r_f doubles (r − r_f) and doubles σ — the Sharpe is leverage-invariant. Hence the reflex: facing a spectacular return, ask for the Sharpe; if it is ordinary, the scale changed, not the quality.',
      'Not neutral on everything: the DISPLAYED return does change — that is the whole point of the make-up. What is invariant is the risk-adjusted return.',
    ],
  },
  {
    id: 'm12-qcm-26', moduleId: M12, theme: T3, themeEn: T3_EN, difficulte: 1,
    question: 'Un client demande : « mon fonds a fait +12 % cette année, c\'est bien ? ». Quelle est la seule réponse rigoureuse ?',
    options: [
      'Oui : +12 % dépasse largement l\'inflation',
      'Non : un bon fonds fait au moins +15 % par an',
      'Oui, à condition que le fonds ait un bêta supérieur à 1',
      'Impossible à dire sans étalon : il faut comparer au cash ajusté du risque total (Sharpe), au marché ajusté du bêta (alpha de Jensen), et au mandat (tracking error et ratio d\'information) — un chiffre de rendement seul ne veut rien dire',
    ],
    bonneReponse: 3,
    explications: [
      'L\'inflation est un étalon de pouvoir d\'achat, pas de gestion : +12 % avec un bêta de 1,2 sur un marché à +10 % est banal (alpha +0,6 %), +12 % avec 8 % de volatilité sur un marché plat serait remarquable.',
      'Aucun seuil absolu n\'existe : +15 % dans un marché à +25 % est une contre-performance, +5 % dans un marché à −10 % est un exploit. Le rendement ne se juge que relativement à un étalon.',
      'Le bêta élevé joue CONTRE le gérant dans le jugement : plus le bêta est haut, plus le CAPM exige — un bêta > 1 rend le +12 % plus facile à obtenir, pas plus méritoire.',
      'Les trois étalons emboîtés du chapitre : le cash (que rapporte le risque tout court ?), le marché ajusté du risque (que rapporte le talent ?), le mandat (que rapporte la liberté laissée au gérant ?). Réflexe d\'oral : ne jamais commenter un chiffre de performance sans demander le risque et le benchmark qui vont avec.',
    ],
    questionEn: 'A client asks: "my fund did +12% this year, is that good?". What is the only rigorous answer?',
    optionsEn: [
      'Yes: +12% comfortably beats inflation',
      'No: a good fund does at least +15% a year',
      'Yes, provided the fund has a beta above 1',
      'Impossible to say without a yardstick: compare to cash adjusted for total risk (Sharpe), to the market adjusted for beta (Jensen alpha), and to the mandate (tracking error and information ratio) — a return figure alone means nothing',
    ],
    explicationsEn: [
      'Inflation is a purchasing-power yardstick, not a management one: +12% with a 1.2 beta in a +10% market is banal (alpha +0.6%), +12% with 8% volatility in a flat market would be remarkable.',
      'No absolute threshold exists: +15% in a +25% market is underperformance, +5% in a −10% market is a feat. Returns are only judged relative to a yardstick.',
      'A high beta works AGAINST the manager in the judgement: the higher the beta, the more the CAPM requires — a beta > 1 makes the +12% easier to obtain, not more meritorious.',
      'The chapter\'s three nested yardsticks: cash (what does risk itself earn?), the risk-adjusted market (what does talent earn?), the mandate (what does the freedom granted to the manager earn?). Oral reflex: never comment on a performance figure without asking for the risk and the benchmark that go with it.',
    ],
  },
  // ──────────────── passif contre actif et les ETF (8) ────────────────
  {
    id: 'm12-qcm-27', moduleId: M12, theme: T4, themeEn: T4_EN, difficulte: 2,
    question: 'Pourquoi l\'argument de Sharpe (1991) sur la gestion active n\'est-il « pas une opinion » ?',
    options: [
      'Parce qu\'il s\'appuie sur trente ans de données SPIVA',
      'Parce que c\'est une IDENTITÉ COMPTABLE : la moyenne pondérée par encours de tous les investisseurs EST le marché ; les passifs font le marché avant frais, donc l\'actif MOYEN fait aussi le marché avant frais — et moins que le marché après frais, la gestion active coûtant plus cher que la réplication',
      'Parce que les marchés sont parfaitement efficients : aucune information n\'est exploitable',
      'Parce que battre le marché est mathématiquement impossible, pour quiconque',
    ],
    bonneReponse: 1,
    explications: [
      'C\'est l\'inverse chronologique et logique : l\'argument de 1991 ne mobilise AUCUNE donnée — deux paragraphes d\'arithmétique pure ; SPIVA (depuis 2002) n\'est venu que le vérifier empiriquement.',
      'Le marché est la somme de ses détenteurs : pour chaque acteur actif qui surpondère un titre gagnant, un autre actif le sous-pondère. En agrégat, jeu à somme nulle avant frais, négative après. La nuance d\'oral : l\'identité porte sur la MOYENNE — elle n\'interdit pas les gagnants, elle garantit qu\'ils sont financés par des perdants, frais déduits des deux côtés.',
      'L\'argument est plus fort que l\'efficience : il ne suppose RIEN sur les prix — même dans un marché inefficient et absurde, la moyenne pondérée des détenteurs reste le marché. C\'est ce qui le rend irréfutable.',
      'Personne ne dit cela : chercher un bon gérant reste possible — c\'est chercher quelqu\'un du bon côté d\'un jeu à somme nulle, en payant pour participer. L\'identité contraint l\'agrégat, pas l\'individu.',
    ],
    questionEn: 'Why is Sharpe\'s (1991) argument on active management "not an opinion"?',
    optionsEn: [
      'Because it rests on thirty years of SPIVA data',
      'Because it is an ACCOUNTING IDENTITY: the AUM-weighted average of all investors IS the market; passive investors do the market before fees, so the AVERAGE active manager also does the market before fees — and less than the market after fees, active management costing more than replication',
      'Because markets are perfectly efficient: no information can be exploited',
      'Because beating the market is mathematically impossible, for anyone',
    ],
    explicationsEn: [
      'The reverse, chronologically and logically: the 1991 argument uses NO data — two paragraphs of pure arithmetic; SPIVA (since 2002) merely came to verify it empirically.',
      'The market is the sum of its holders: for every active player overweighting a winning stock, another active player underweights it. In aggregate, a zero-sum game before fees, negative after. The oral nuance: the identity bears on the AVERAGE — it does not forbid winners, it guarantees they are financed by losers, fees deducted on both sides.',
      'The argument is stronger than efficiency: it assumes NOTHING about prices — even in an inefficient, absurd market, the holders\' weighted average is still the market. That is what makes it irrefutable.',
      'Nobody says that: finding a good manager remains possible — it means finding someone on the right side of a zero-sum game, while paying to play. The identity constrains the aggregate, not the individual.',
    ],
  },
  {
    id: 'm12-qcm-28', moduleId: M12, theme: T4, themeEn: T4_EN, difficulte: 2,
    question: '100 sont investis 30 ans à 7 % de rendement brut annuel. Que coûte une ligne de frais de 2 % par an ?',
    options: [
      'Environ 60 : 2 % × 30 ans du capital initial',
      'Environ 15 : les frais sont absorbés par le rendement',
      'Rien à long terme : les frais se diluent dans la composition',
      '329,031266 : la valeur finale tombe de 761,225504 à 432,194238 — plus de trois fois la mise de départ, soit 43 % de la valeur finale brute, sans qu\'aucune année isolée ne semble chère',
    ],
    bonneReponse: 3,
    explications: [
      'Le calcul linéaire 2 % × 30 = 60 % de la mise sous-estime massivement : chaque euro de frais prélevé cesse de produire du rendement pendant TOUTES les années restantes — l\'erreur ignore la composition, qui fait tout le dégât.',
      'Encore plus faux que le calcul linéaire : rien n\'« absorbe » les frais — ils se prélèvent sur l\'assiette qui aurait dû composer, année après année.',
      'Exactement l\'inverse : la composition AGGRAVE les frais au lieu de les diluer — 2 % sur une année est invisible, 2 % composés sur trente ans confisquent 43 % de la valeur finale (329/761).',
      'V = 100 × (1 + 5/100)^30 = 432,194238 contre 761,225504 à 7 % brut : manque à gagner 329,031266. L\'argument massue du débat actif/passif : la composition travaille pour celui qui encaisse les frais aussi sûrement que pour l\'investisseur — et pour mériter ses 2 %, le gérant doit battre le marché de 1,8 point par an pendant trente ans.',
    ],
    questionEn: '100 is invested for 30 years at 7% gross annual return. What does a 2% annual fee line cost?',
    optionsEn: [
      'About 60: 2% × 30 years of the initial capital',
      'About 15: fees are absorbed by the return',
      'Nothing in the long run: fees dilute away in compounding',
      '329.031266: the final value drops from 761.225504 to 432.194238 — more than three times the initial stake, i.e. 43% of the gross final value, without any single year ever seeming expensive',
    ],
    explicationsEn: [
      'The linear calculation 2% × 30 = 60% of the stake massively underestimates: every euro of fees taken stops producing returns for ALL remaining years — the error ignores compounding, which does all the damage.',
      'Even more wrong than the linear estimate: nothing "absorbs" fees — they are taken from the very base that should have compounded, year after year.',
      'Exactly backwards: compounding AGGRAVATES fees rather than diluting them — 2% in one year is invisible, 2% compounded over thirty years confiscates 43% of the final value (329/761).',
      'V = 100 × (1 + 5/100)^30 = 432.194238 versus 761.225504 at 7% gross: a shortfall of 329.031266. The sledgehammer of the active/passive debate: compounding works for whoever collects the fees as surely as for the investor — and to earn its 2%, the fund must beat the market by 1.8 points a year for thirty years.',
    ],
  },
  {
    id: 'm12-qcm-29', moduleId: M12, theme: T4, themeEn: T4_EN, difficulte: 2,
    question: 'Mêmes 100 sur 30 ans à 7 % brut, mais dans un ETF à 0,2 % de frais. Valeur finale ?',
    options: [
      '719,676929 : 100 × (1 + 6,8/100)^30 — l\'ETF laisse la quasi-totalité de la performance : 41,55 de coût contre 329,03 pour le fonds à 2 %',
      'Environ 755 : 761,23 moins 0,2 % × 30 ans du capital initial',
      '432,194238 : les frais pèsent pareil quel que soit leur niveau',
      '761,225504 : 0,2 % est négligeable, on arrondit à zéro',
    ],
    bonneReponse: 0,
    explications: [
      'Le rendement net est 7 − 0,2 = 6,8 %, d\'où 719,676929 : les frais de l\'ETF coûtent 41,548575 — huit fois moins que les 329,03 du fonds à 2 %. C\'est toute la thèse du chapitre en un tableau : le niveau des frais, composé sur trente ans, est LA variable qui sépare les véhicules.',
      'Le calcul linéaire (0,2 × 30 = 6 sur la mise initiale) sous-estime le coût réel : même de petits frais se composent — 41,55 de manque à gagner, pas 6.',
      'Absurde arithmétiquement : 432,19 correspond à 2 % de frais. Les frais pèsent proportionnellement à leur niveau, et la composition amplifie l\'écart — c\'est précisément la démonstration massue.',
      'Petit n\'est pas nul : 0,2 % composé sur trente ans coûte tout de même 41,55, environ 5 % de la valeur finale. L\'arrondir à zéro néglige la même mécanique qui rend les 2 % mortels.',
    ],
    questionEn: 'The same 100 over 30 years at 7% gross, but in an ETF charging 0.2%. Final value?',
    optionsEn: [
      '719.676929: 100 × (1 + 6.8/100)^30 — the ETF leaves almost all the performance: a 41.55 cost against 329.03 for the 2% fund',
      'About 755: 761.23 minus 0.2% × 30 years of the initial capital',
      '432.194238: fees weigh the same whatever their level',
      '761.225504: 0.2% is negligible, rounded to zero',
    ],
    explicationsEn: [
      'The net return is 7 − 0.2 = 6.8%, hence 719.676929: the ETF\'s fees cost 41.548575 — eight times less than the 2% fund\'s 329.03. The chapter\'s whole thesis in one table: the fee level, compounded over thirty years, is THE variable that separates vehicles.',
      'The linear calculation (0.2 × 30 = 6 on the initial stake) understates the true cost: even small fees compound — a 41.55 shortfall, not 6.',
      'Arithmetically absurd: 432.19 corresponds to 2% fees. Fees weigh in proportion to their level, and compounding amplifies the gap — that is precisely the sledgehammer demonstration.',
      'Small is not zero: 0.2% compounded over thirty years still costs 41.55, about 5% of the final value. Rounding it to zero neglects the very mechanics that make the 2% lethal.',
    ],
  },
  {
    id: 'm12-qcm-30', moduleId: M12, theme: T4, themeEn: T4_EN, difficulte: 1,
    question: 'Que disent les rapports SPIVA sur les fonds actions actifs à horizon 10-15 ans ?',
    options: [
      'Environ la moitié battent leur indice : le talent et la chance s\'équilibrent',
      'Environ 85 à 90 % battent leur indice, grâce à la sélection de titres',
      'Environ 85 à 90 % SOUS-PERFORMENT leur indice après frais — aux États-Unis comme en Europe — et la proportion de perdants MONTE avec l\'horizon : les frais se composent, la chance ne se compose pas ; la persistance des premiers quartiles est presque nulle',
      'Les résultats sont inexploitables à cause du biais du survivant',
    ],
    bonneReponse: 2,
    explications: [
      'La moitié serait le monde d\'avant frais de l\'arithmétique de Sharpe : à somme nulle en brut. Après frais, la distribution glisse — et le temps aggrave le verdict, il ne l\'équilibre pas.',
      'Inversion du verdict : 85-90 % est la proportion de PERDANTS, pas de gagnants — le chiffre le plus cité du débat actif/passif, à ne jamais retourner à l\'oral.',
      'Le verdict SPIVA (S&P Indices Versus Active, publié depuis 2002) : à un an les résultats fluctuent, à 10-15 ans environ 85-90 % des fonds actions actifs sous-performent après frais, avec une constance remarquable. Et la persistance est presque nulle : les premiers quartiles d\'une période ne se maintiennent pas plus que le hasard — l\'arithmétique de Sharpe, vérifiée dans les données.',
      'C\'est précisément l\'inverse : SPIVA CORRIGE le biais du survivant — les fonds fermés en cours de route restent comptés comme sous-performants. C\'est ce qui rend le verdict solide.',
    ],
    questionEn: 'What do the SPIVA reports say about active equity funds over a 10-15 year horizon?',
    optionsEn: [
      'About half beat their index: talent and luck balance out',
      'About 85 to 90% beat their index, thanks to stock selection',
      'About 85 to 90% UNDERPERFORM their index after fees — in the United States as in Europe — and the share of losers RISES with the horizon: fees compound, luck does not; first-quartile persistence is nearly nil',
      'The results are unusable because of survivorship bias',
    ],
    explicationsEn: [
      'Half would be the before-fees world of Sharpe\'s arithmetic: zero-sum gross. After fees the distribution slides — and time worsens the verdict, it does not balance it.',
      'The verdict inverted: 85-90% is the share of LOSERS, not winners — the most quoted figure of the active/passive debate, never to be flipped at the oral.',
      'The SPIVA verdict (S&P Indices Versus Active, published since 2002): over one year results fluctuate, over 10-15 years about 85-90% of active equity funds underperform after fees, with remarkable constancy. And persistence is nearly nil: one period\'s first quartiles repeat no more often than chance — Sharpe\'s arithmetic, verified in the data.',
      'Precisely backwards: SPIVA CORRECTS survivorship bias — funds closed along the way stay counted as underperformers. That is what makes the verdict robust.',
    ],
  },
  {
    id: 'm12-qcm-31', moduleId: M12, theme: T4, themeEn: T4_EN, difficulte: 2,
    question: 'Par quel mécanisme le prix d\'un ETF reste-t-il collé à la valeur de son panier ?',
    options: [
      'L\'arbitrage de CRÉATION-RACHAT : des participants autorisés échangent en nature (in-kind) le panier de titres contre des parts d\'ETF auprès de l\'émetteur ; toute prime ou décote ouvre un arbitrage immédiat qui la referme — le prix est tenu par un arbitrage permanent, pas par une promesse',
      'L\'émetteur ajuste le prix de cotation chaque soir sur la valeur liquidative',
      'Le régulateur suspend la cotation dès que l\'écart dépasse 0,5 %',
      'Les frais très bas garantissent mécaniquement que le prix suit l\'indice',
    ],
    bonneReponse: 0,
    explications: [
      'Si l\'ETF cote au-dessus de son panier : acheter le panier, le livrer contre des parts neuves, vendre les parts — l\'écart se referme ; symétriquement pour une décote. Second mérite de l\'in-kind : l\'émetteur ne vend pas de titres pour servir les sorties, ce qui réduit coûts de transaction et frottements fiscaux.',
      'Personne n\'« ajuste » le prix d\'un titre coté : l\'ETF traite en continu au prix que le marché fait — c\'est l\'arbitrage, pas une main administrative, qui le rappelle vers la valeur du panier.',
      'Aucune règle de ce genre : mars 2020 a vu des décotes de plusieurs pourcents sur les ETF high yield SANS suspension — et c\'était une information, pas un dysfonctionnement.',
      'Les frais bas expliquent la compétitivité du véhicule, pas la tenue du prix : sans le canal de création-rachat, un ETF même gratuit pourrait dériver loin de sa valeur liquidative.',
    ],
    questionEn: 'Through what mechanism does an ETF\'s price stay glued to the value of its basket?',
    optionsEn: [
      'The CREATION-REDEMPTION arbitrage: authorised participants exchange the basket of securities in kind against ETF shares with the issuer; any premium or discount opens an immediate arbitrage that closes it — the price is held by a permanent arbitrage, not by a promise',
      'The issuer adjusts the quoted price every evening to the net asset value',
      'The regulator suspends trading as soon as the gap exceeds 0.5%',
      'Very low fees mechanically guarantee that the price tracks the index',
    ],
    explicationsEn: [
      'If the ETF trades above its basket: buy the basket, deliver it for newly created shares, sell the shares — the gap closes; symmetrically for a discount. The in-kind exchange\'s second merit: the issuer sells no securities to meet outflows, reducing transaction costs and tax frictions.',
      'Nobody "adjusts" a listed security\'s price: the ETF trades continuously at whatever price the market makes — it is arbitrage, not an administrative hand, that pulls it back to the basket\'s value.',
      'No such rule: March 2020 saw discounts of several percent on high-yield ETFs with NO suspension — and that was information, not a malfunction.',
      'Low fees explain the vehicle\'s competitiveness, not the price discipline: without the creation-redemption channel, even a free ETF could drift far from its net asset value.',
    ],
  },
  {
    id: 'm12-qcm-32', moduleId: M12, theme: T4, themeEn: T4_EN, difficulte: 3,
    question: 'Mars 2020 : les ETF d\'obligations high yield cotent plusieurs pourcents SOUS leur valeur liquidative. Quelle est la bonne lecture ?',
    options: [
      'Le mécanisme de création-rachat a échoué : les participants autorisés ont fait défaut à leur rôle',
      'Les ETF ont créé la panique en forçant des ventes d\'obligations',
      'La VL était calculée sur les derniers prix connus d\'obligations qui ne se traitaient plus — des prix MORTS ; l\'ETF, lui, agrégeait les transactions réelles : la découverte de prix avait MIGRÉ vers l\'ETF, et ce sont les obligations qui ont convergé vers lui',
      'C\'est la preuve que les ETF obligataires sont sans risque : ils ont continué de coter',
    ],
    bonneReponse: 2,
    explications: [
      'Le mécanisme a tenu — pas de suspension, cotation continue : la « décote » n\'était pas un échec d\'arbitrage mais une illusion d\'étalon, la VL étant calculée sur des prix périmés qu\'aucun arbitragiste ne pouvait traiter.',
      'La causalité est inversée : les ventes forcées venaient de la panique générale (module 11), et l\'ETF ne faisait qu\'agréger en temps réel ce que les vendeurs et acheteurs réels acceptaient — il révélait la pression, il ne la créait pas.',
      'La leçon à double tranchant du chapitre : le prix de l\'ETF n\'était pas en retard sur la VL, il était DEVANT — rassurant (le mécanisme a tenu) et inquiétant à la fois, car la liquidité d\'un ETF ne peut jamais être meilleure que celle de son sous-jacent en stress : elle peut seulement la révéler plus vite. Un ETF liquide sur un marché illiquide est un thermomètre, pas un remède.',
      'Continuer de coter ne veut pas dire être sans risque : l\'ETF a coté la CHUTE, en continu — le porteur a bien subi la baisse du high yield, il l\'a seulement vue plus tôt que les porteurs d\'obligations en direct.',
    ],
    questionEn: 'March 2020: high-yield bond ETFs trade several percent BELOW their net asset value. What is the right reading?',
    optionsEn: [
      'The creation-redemption mechanism failed: authorised participants defaulted on their role',
      'ETFs created the panic by forcing bond sales',
      'The NAV was computed on the last known prices of bonds that no longer traded — DEAD prices; the ETF, meanwhile, aggregated real transactions: price discovery had MIGRATED to the ETF, and it was the bonds that converged to it',
      'It proves bond ETFs are riskless: they kept trading',
    ],
    explicationsEn: [
      'The mechanism held — no suspension, continuous trading: the "discount" was not an arbitrage failure but a yardstick illusion, the NAV being computed on stale prices no arbitrageur could actually deal at.',
      'Causality inverted: the forced selling came from the general panic (module 11), and the ETF merely aggregated in real time what actual buyers and sellers would accept — it revealed the pressure, it did not create it.',
      'The chapter\'s double-edged lesson: the ETF\'s price was not lagging the NAV, it was AHEAD — reassuring (the mechanism held) and worrying at once, because an ETF\'s liquidity can never beat its underlying\'s in stress: it can only reveal it faster. A liquid ETF on an illiquid market is a thermometer, not a cure.',
      'Continuing to trade does not mean riskless: the ETF quoted the FALL, continuously — the holder fully suffered the high-yield drawdown, he merely saw it earlier than direct bondholders did.',
    ],
  },
  {
    id: 'm12-qcm-33', moduleId: M12, theme: T4, themeEn: T4_EN, difficulte: 2,
    question: 'Où la gestion active garde-t-elle du sens, malgré l\'arithmétique de Sharpe ?',
    options: [
      'Nulle part : l\'identité comptable vaut pour tout marché et tout mandat',
      'Sur les mega-caps américaines, le marché le plus analysé du monde',
      'Uniquement dans les hedge funds, exemptés de l\'arithmétique par leur levier',
      'Là où le marché est peu efficient et l\'indice mal construit : petites capitalisations peu couvertes, crédit distressed où l\'analyse du recouvrement est tout ; là où le mandat n\'est pas de battre un indice (gérer le passif d\'un assureur) ; et l\'obligataire indiciel a un défaut de conception — pondérer par la capitalisation, c\'est prêter le plus aux plus endettés',
    ],
    bonneReponse: 3,
    explications: [
      'L\'identité vaut pour l\'AGRÉGAT d\'un marché donné — mais elle mord moins là où l\'indexation est impraticable, et elle ne dit rien des mandats dont le benchmark est un engagement, pas un indice.',
      'À rebours : plus un marché est couvert par l\'analyse, plus il est efficient, plus l\'arithmétique mord — les mega-caps américaines sont le terrain le PLUS défavorable au gérant actif.',
      'Aucune exemption : les hedge funds sont des acteurs actifs comme les autres dans l\'agrégat — leur levier amplifie leurs positions, pas leur droit de sortir de l\'identité comptable.',
      'La nuance qui vaut cher à l\'oral, dans les deux sens : l\'actif garde du sens dans les segments peu efficients (small caps, distressed — module 5) et les mandats de passif (assureurs, LDI) ; et l\'indiciel obligataire prête structurellement le plus aux émetteurs les plus endettés. Le réquisitoire sans nuance est aussi faux que la défense sans chiffres.',
    ],
    questionEn: 'Where does active management keep its point, despite Sharpe\'s arithmetic?',
    optionsEn: [
      'Nowhere: the accounting identity holds for every market and every mandate',
      'In US mega-caps, the most analysed market in the world',
      'Only in hedge funds, exempted from the arithmetic by their leverage',
      'Where the market is inefficient and the index badly built: under-covered small caps, distressed credit where recovery analysis is everything; where the mandate is not to beat an index (managing an insurer\'s liabilities); and index bond investing has a design flaw — weighting by capitalisation means lending the most to the most indebted',
    ],
    explicationsEn: [
      'The identity holds for the AGGREGATE of a given market — but it bites less where indexing is impracticable, and it says nothing about mandates whose benchmark is a commitment, not an index.',
      'Backwards: the more a market is covered by analysts, the more efficient it is, the harder the arithmetic bites — US mega-caps are the LEAST favourable ground for an active manager.',
      'No exemption: hedge funds are active players like any other in the aggregate — their leverage amplifies their positions, not their right to exit the accounting identity.',
      'The nuance that earns marks, in both directions: active keeps its point in inefficient segments (small caps, distressed — module 5) and liability-driven mandates (insurers, LDI); and bond indexing structurally lends the most to the most indebted issuers. The one-sided indictment is as wrong as the figure-free defence.',
    ],
  },
  {
    id: 'm12-qcm-34', moduleId: M12, theme: T4, themeEn: T4_EN, difficulte: 2,
    question: 'Quelle fragilité le triomphe de la gestion passive fabrique-t-il lui-même ?',
    options: [
      'Les ETF finiront par coûter plus cher que les fonds actifs, par pénurie d\'arbitragistes',
      'Dans un indice capi-pondéré, chaque euro indexé achète les titres au prorata de leur taille : le poids des mega-caps s\'AUTO-ENTRETIENT, et la « diversification passive » des indices américains devient un pari de plus en plus étroit sur une poignée de valeurs technologiques',
      'La gestion passive supprime la volatilité des marchés',
      'Les indices capi-pondérés se rééquilibrent trop souvent, ce qui explose les coûts',
    ],
    bonneReponse: 1,
    explications: [
      'Aucun mécanisme n\'inverse la structure de coûts : la réplication d\'un indice capi-pondéré reste structurellement bon marché — c\'est même ce qui a permis les 0,05 %.',
      'Le paradoxe du chapitre : le flux indiciel achète les titres au prorata de leur capitalisation, donc renforce mécaniquement les plus gros — et la concentration des indices américains sur quelques valeurs technologiques (module 3) rétrécit la diversification réelle que le porteur croit acheter. Le succès du passif ronge l\'hypothèse qui le justifiait.',
      'Rien de tel : la volatilité demeure — et certains soutiennent même que l\'indiciellisation a AUGMENTÉ les corrélations entre titres (trading de paniers), relevant le plancher systématique du chapitre 1.',
      'C\'est l\'inverse qui rend la réplication bon marché : un indice capi-pondéré se rééquilibre TOUT SEUL — quand un titre monte, son poids dans l\'indice et dans le portefeuille montent ensemble, sans transaction.',
    ],
    questionEn: 'What fragility does the triumph of passive investing manufacture by itself?',
    optionsEn: [
      'ETFs will end up costing more than active funds, for lack of arbitrageurs',
      'In a cap-weighted index, every indexed euro buys stocks in proportion to their size: mega-cap weights become SELF-REINFORCING, and the "passive diversification" of US indices turns into an ever-narrower bet on a handful of technology names',
      'Passive investing eliminates market volatility',
      'Cap-weighted indices rebalance too often, exploding costs',
    ],
    explicationsEn: [
      'No mechanism inverts the cost structure: replicating a cap-weighted index remains structurally cheap — that is precisely what made 0.05% possible.',
      'The chapter\'s paradox: index flows buy stocks pro rata to their capitalisation, thus mechanically reinforcing the biggest — and the concentration of US indices on a few technology names (module 3) shrinks the real diversification the holder thinks he is buying. Passive\'s success erodes the very assumption that justified it.',
      'Nothing of the sort: volatility remains — and some even argue indexation has INCREASED cross-stock correlations (basket trading), raising chapter 1\'s systematic floor.',
      'The reverse is what makes replication cheap: a cap-weighted index rebalances ITSELF — when a stock rises, its weight in the index and in the portfolio rise together, with no transaction.',
    ],
  },
  // __SUITE__
];
