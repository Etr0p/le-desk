import type { QcmQuestion } from '../../../engine/types';

const M13 = '13-brainteasers-oral';

// Banque de 60 QCM bilingues (FR/EN). Quotas par chapitre :
// le calcul mental 9 · les estimations de Fermi 8 · les probabilités
// d'entretien 10 · les brainteasers classiques 9 · les jeux de marché 9 ·
// le parcours 7 · le jour J 8.
// Les valeurs numériques sont alignées sur calculs.ts et les chapitres relus :
// 72/8 = 9 ans contre 9,006468 exacts (erreur −0,07 %) ; 72/2 = 36 contre
// 35,0 ; 8 % de 25 = 2 ; +10 % puis −10 % = −1 % ; 100/0,8 = 125 ;
// 17 × 24 = 408 ; 47² = 2 209 ; PD implicite (300 pb, R 40 %) = 5 % ;
// Fermi √(1 000 × 1 000 000) = 31 622 (l'arithmétique dit 500 500 : facteur
// 15) ; accordeurs ≈ 30 ; FX 120 × 63 ≈ 7 500 Md$ ; ping-pong ≈ 3,6 millions
// (remplissage 60 %) ; au moins un 6 en 4 lancers = 51,774691 % (n×p = 66,7 %
// est LE piège) ; double 6 en 24 lancers = 49,1 % ; au moins un pile en 3
// = 87,5 % ; anniversaires à 23 = 50,729723 % (253 paires) ; Bayes (1 %,
// 99 %, 5 %) = 16,666667 % = 99/594 ; C(52, 5) = 2 598 960 ; cinq piles
// = 3,125 % ; Monty Hall 2/3 ; mouche 60 km ; 100 portes → 10 ; œufs → 14 ;
// boules → 2 pesées ; pont → 17 min ; prisonniers → 99 ; E[d6] = 3,5 ;
// relance = 4,25 ; deux relances = 4,666667 ; cote équitable (25 %) = 4,
// proba implicite = 1/cote ; 7 pour 1 sur un 6 : E = 1,166667 par euro ;
// valeur de l'information de la carte = 2,50 €.
// Répartition des bonnes réponses : 15 × index 0, 15 × 1, 15 × 2, 15 × 3.

const T1 = 'le calcul mental';
const T1_EN = 'mental arithmetic';
const T2 = 'les estimations de Fermi';
const T2_EN = 'Fermi estimates';
const T3 = 'les probabilités d\'entretien';
const T3_EN = 'interview probabilities';
const T4 = 'les brainteasers classiques';
const T4_EN = 'classic brainteasers';
const T5 = 'les jeux de marché';
const T5_EN = 'market games';
const T6 = 'le parcours';
const T6_EN = 'defending your background';
const T7 = 'le jour J';
const T7_EN = 'the big day';

export const qcm: QcmQuestion[] = [
  // ──────────────── le calcul mental (9) ────────────────
  {
    id: 'm13-qcm-01', moduleId: M13, theme: T1, themeEn: T1_EN, difficulte: 1,
    question: 'Le jury demande : « votre portefeuille est placé à 8 % par an, il double en combien de temps ? ». La réponse qui marque des points ?',
    options: [
      '« Environ 9 ans — règle de 72, 72/8 ; la valeur exacte est 9,006468 ans, erreur de −0,07 %, indétectable à l\'oral »',
      '« 12,5 ans : on divise 100 par le taux »',
      '« 8 ans : le taux donne directement le nombre d\'années »',
      '« Exactement 9 ans : la règle de 72 est une identité mathématique, pas une approximation »',
    ],
    bonneReponse: 0,
    explications: [
      'La règle de 72 donne 72/8 = 9 ans ; le calcul exact ln 2 / ln(1,08) = 9,006468 ans montre une erreur de −0,07 % — la règle est quasi exacte vers 8 %, là où elle a été calibrée. Annoncer le chiffre AVEC son erreur est le méta-réflexe du chapitre : un outil, un domaine de validité, une tolérance connue.',
      'Il n\'existe pas de « règle de 100 » : la constante vient de 100 · ln 2 ≈ 69,3, arrondie à 72 pour la divisibilité — 12,5 ans à 8 % serait faux de presque 40 %.',
      'Confondre le taux et la durée n\'a aucun fondement : à 8 %, le capital ne fait que × 1,85 en 8 ans — il faut 9 ans pour doubler.',
      'La règle de 72 est une APPROXIMATION, pas une identité : elle surestime aux taux bas (36 ans annoncés à 2 % contre 35,0 exacts) et sous-estime aux taux élevés. La croire exacte, c\'est ignorer son domaine de validité — précisément ce que le jury sonde.',
    ],
    questionEn: 'The panel asks: "your portfolio earns 8% a year — how long until it doubles?". Which answer scores?',
    optionsEn: [
      '"About 9 years — rule of 72, 72/8; the exact value is 9.006468 years, a −0.07% error, undetectable in an oral"',
      '"12.5 years: you divide 100 by the rate"',
      '"8 years: the rate directly gives the number of years"',
      '"Exactly 9 years: the rule of 72 is a mathematical identity, not an approximation"',
    ],
    explicationsEn: [
      'The rule of 72 gives 72/8 = 9 years; the exact computation ln 2 / ln(1.08) = 9.006468 years shows a −0.07% error — the rule is near-exact around 8%, where it was calibrated. Stating the figure WITH its error is the chapter\'s meta-reflex: a tool, a validity domain, a known tolerance.',
      'There is no "rule of 100": the constant comes from 100 · ln 2 ≈ 69.3, rounded to 72 for divisibility — 12.5 years at 8% would be off by almost 40%.',
      'Confusing the rate with the duration has no basis: at 8%, the capital only grows × 1.85 in 8 years — doubling takes 9.',
      'The rule of 72 is an APPROXIMATION, not an identity: it overestimates at low rates (36 years quoted at 2% versus 35.0 exact) and underestimates at high rates. Believing it exact means ignoring its validity domain — precisely what the panel probes.',
    ],
  },
  {
    id: 'm13-qcm-02', moduleId: M13, theme: T1, themeEn: T1_EN, difficulte: 2,
    question: 'Pourquoi la règle de doublement utilise-t-elle 72, alors que la constante « naturelle » serait 100 · ln 2 ≈ 69,3 ?',
    options: [
      'C\'est un accident historique : les banquiers médiévaux ne connaissaient pas les logarithmes',
      'Parce que 72 se divise par 2, 3, 4, 6, 8, 9 et 12, et que l\'écart avec 69,3 compense justement la discrétisation annuelle autour de 8 %, là où la règle a été calibrée',
      'Parce que 72 = 6 × 12 : six pour les jours ouvrés, douze pour les mois de l\'année',
      'Parce qu\'avec 72 la règle devient exacte à tous les taux, ce que 69,3 ne permet pas',
    ],
    bonneReponse: 1,
    explications: [
      'L\'origine est parfaitement documentée : 100 · ln 2 vient de la composition continue, et le passage à 72 est un choix de calcul mental délibéré, pas une ignorance.',
      'Les deux raisons du chapitre : 69,3 est infernal à diviser de tête, tandis que 72 a une divisibilité exceptionnelle — et l\'excès de 72 sur 69,3 compense la discrétisation annuelle vers 8 %, si bien que la zone douce de la règle coïncide avec l\'ordre de grandeur des rendements actions de long terme.',
      'La décomposition 6 × 12 est réelle mais n\'explique rien : jours ouvrés et mois n\'ont aucun rôle dans un doublement composé — c\'est une justification inventée après coup.',
      'Aucune constante ne rend la règle exacte partout : elle surestime aux taux bas, sous-estime aux taux élevés, et l\'erreur reste sous 2 % entre 4 et 12 % environ — le contrat de toute approximation du cours.',
    ],
    questionEn: 'Why does the doubling rule use 72, when the "natural" constant would be 100 · ln 2 ≈ 69.3?',
    optionsEn: [
      'It is a historical accident: medieval bankers did not know logarithms',
      'Because 72 divides by 2, 3, 4, 6, 8, 9 and 12, and the gap with 69.3 precisely offsets the annual discretisation around 8%, where the rule was calibrated',
      'Because 72 = 6 × 12: six for business days, twelve for the months of the year',
      'Because with 72 the rule becomes exact at every rate, which 69.3 does not allow',
    ],
    explicationsEn: [
      'The origin is perfectly documented: 100 · ln 2 comes from continuous compounding, and the move to 72 is a deliberate mental-arithmetic choice, not ignorance.',
      'The chapter\'s two reasons: 69.3 is hellish to divide in your head, whereas 72 has exceptional divisibility — and the excess of 72 over 69.3 offsets annual discretisation around 8%, so the rule\'s sweet spot coincides with the order of magnitude of long-run equity returns.',
      'The 6 × 12 decomposition is real but explains nothing: business days and months play no role in compound doubling — a justification invented after the fact.',
      'No constant makes the rule exact everywhere: it overestimates at low rates, underestimates at high rates, and the error stays under 2% between roughly 4 and 12% — the contract of every approximation in this course.',
    ],
  },
  {
    id: 'm13-qcm-03', moduleId: M13, theme: T1, themeEn: T1_EN, difficulte: 1,
    question: 'De tête, sans hésiter : combien font 8 % de 25 ?',
    options: [
      '0,32 : on divise 8 par 25',
      '4 : on divise 25 par 8 et on arrondit',
      '2 : par commutativité, 8 % de 25 = 25 % de 8, c\'est-à-dire le quart de 8',
      'Le calcul demande de poser 25 × 0,08, donc du papier ou une calculatrice',
    ],
    bonneReponse: 2,
    explications: [
      'Diviser 8 par 25 donne 0,32 — c\'est 32 % de 1, pas 8 % de 25 : une confusion d\'opération qui trahit l\'absence du réflexe de retournement.',
      'Diviser 25 par 8 (≈ 3,1) ne correspond à aucune définition du pourcentage : c\'est un geste au hasard, exactement ce que le jury sanctionne.',
      'x % de y = y % de x, toujours, puisque les deux s\'écrivent x·y/100. « 8 % de 25 » fige ; « 25 % de 8 » — le quart de 8 — donne 2 instantanément. Le réflexe : retourner systématiquement le calcul dans le sens où l\'un des nombres devient une fraction simple (25 % = quart, 50 % = moitié, 10 % = dixième).',
      'Réclamer la calculatrice sur un quart de 8 est la pire réponse possible en entretien de marchés : la question teste précisément le réflexe de calcul mental que le desk exige.',
    ],
    questionEn: 'In your head, without hesitating: what is 8% of 25?',
    optionsEn: [
      '0.32: you divide 8 by 25',
      '4: you divide 25 by 8 and round',
      '2: by commutativity, 8% of 25 = 25% of 8, that is a quarter of 8',
      'The computation requires writing out 25 × 0.08, hence paper or a calculator',
    ],
    explicationsEn: [
      'Dividing 8 by 25 gives 0.32 — that is 32% of 1, not 8% of 25: an operation mix-up that betrays the missing flip reflex.',
      'Dividing 25 by 8 (≈ 3.1) matches no definition of a percentage: it is a random move, exactly what the panel punishes.',
      'x% of y = y% of x, always, since both read x·y/100. "8% of 25" freezes people; "25% of 8" — a quarter of 8 — yields 2 instantly. The reflex: systematically flip the computation so one number becomes a simple fraction (25% = quarter, 50% = half, 10% = tenth).',
      'Asking for a calculator on a quarter of 8 is the worst possible answer in a markets interview: the question tests precisely the mental-arithmetic reflex the desk demands.',
    ],
  },
  {
    id: 'm13-qcm-04', moduleId: M13, theme: T1, themeEn: T1_EN, difficulte: 2,
    question: 'Un actif gagne 10 % puis perd 10 %. Où en est-il par rapport à son point de départ ?',
    options: [
      'Exactement au point de départ : +10 − 10 = 0',
      'À +1 % : la hausse s\'applique d\'abord, donc elle domine',
      'Impossible à dire sans connaître le niveau initial de l\'actif',
      'À −1 % : 1,1 × 0,9 = 0,99 — les variations successives se multiplient, elles ne s\'additionnent pas',
    ],
    bonneReponse: 3,
    explications: [
      'L\'addition des variations est LE piège : les rendements successifs se composent (se multiplient), et +10 % puis −10 % laisse 1,1 × 0,9 = 0,99 du capital — il manque 1 %.',
      'L\'ordre des variations ne change rien à un produit : 0,9 × 1,1 = 1,1 × 0,9 = 0,99 — et le résultat est une perte, pas un gain.',
      'Le niveau initial est sans importance : le résultat est un RATIO (0,99), valable pour 100 € comme pour 100 M€ — croire qu\'il faut le niveau confond variation relative et variation absolue.',
      'C\'est l\'asymétrie des variations : 1,1 × 0,9 = 0,99, soit −1 %. La version douce d\'une leçon payée au prix fort au module 11 : après −50 %, il faut +100 % pour revenir ; après le −78 % du Nasdaq, +354,5 % et quinze ans.',
    ],
    questionEn: 'An asset gains 10% then loses 10%. Where does it stand versus its starting point?',
    optionsEn: [
      'Exactly at the starting point: +10 − 10 = 0',
      'At +1%: the rise applies first, so it dominates',
      'Impossible to say without knowing the asset\'s initial level',
      'At −1%: 1.1 × 0.9 = 0.99 — successive changes multiply, they do not add',
    ],
    explicationsEn: [
      'Adding the changes is THE trap: successive returns compound (multiply), and +10% then −10% leaves 1.1 × 0.9 = 0.99 of the capital — 1% is missing.',
      'The order of the changes does not affect a product: 0.9 × 1.1 = 1.1 × 0.9 = 0.99 — and the outcome is a loss, not a gain.',
      'The initial level is irrelevant: the result is a RATIO (0.99), as valid for €100 as for €100m — thinking you need the level confuses relative and absolute changes.',
      'This is the asymmetry of returns: 1.1 × 0.9 = 0.99, i.e. −1%. The gentle version of a lesson module 11 paid dearly for: after −50%, you need +100% to get back; after the Nasdaq\'s −78%, +354.5% and fifteen years.',
    ],
  },
  {
    id: 'm13-qcm-05', moduleId: M13, theme: T1, themeEn: T1_EN, difficulte: 2,
    question: 'Après une décote de 20 %, un titre vaut 100. Que valait-il avant la décote — et par quel réflexe de calcul mental ?',
    options: [
      '120 : on rajoute les 20 % perdus',
      '125 : diviser par 0,8, c\'est multiplier par 1,25 (car 1/0,8 = 5/4) — la division déguisée en multiplication amicale',
      '80 : on applique la décote au prix affiché',
      '105 : la décote de 20 % ne porte que sur le quart du nominal',
    ],
    bonneReponse: 1,
    explications: [
      'Rajouter 20 % à 100 donne 120, mais 120 × 0,8 = 96, pas 100 : c\'est l\'asymétrie des variations — le pourcentage de remontée se calcule sur une base plus petite, donc il doit être plus grand.',
      'Le réflexe de la division déguisée : retrouver la base avant une baisse de 20 %, c\'est diviser par 0,8, donc multiplier par 5/4 = 1,25 — d\'où 100 × 1,25 = 125, et l\'on vérifie : 125 × 0,8 = 100. Même famille : diviser par 0,5 = × 2, par 0,25 = × 4.',
      'Appliquer la décote à 100 répond à une autre question (« que vaudra-t-il après une NOUVELLE décote ? ») : 80 est un contresens sur le sens du calcul demandé.',
      'La décote porte sur la totalité du nominal, pas sur un quart : 105 ne correspond à aucune arithmétique défendable.',
    ],
    questionEn: 'After a 20% haircut, a security is worth 100. What was it worth before — and by which mental-arithmetic reflex?',
    optionsEn: [
      '120: you add back the 20% lost',
      '125: dividing by 0.8 is multiplying by 1.25 (since 1/0.8 = 5/4) — the division disguised as a friendly multiplication',
      '80: you apply the haircut to the quoted price',
      '105: the 20% haircut only applies to a quarter of the notional',
    ],
    explicationsEn: [
      'Adding 20% to 100 gives 120, but 120 × 0.8 = 96, not 100: that is the asymmetry of returns — the recovery percentage is computed on a smaller base, so it must be larger.',
      'The disguised-division reflex: recovering the base before a 20% cut means dividing by 0.8, hence multiplying by 5/4 = 1.25 — so 100 × 1.25 = 125, and the check works: 125 × 0.8 = 100. Same family: dividing by 0.5 = × 2, by 0.25 = × 4.',
      'Applying the haircut to 100 answers a different question ("what will it be worth after ANOTHER haircut?"): 80 misreads the direction of the computation.',
      'The haircut applies to the whole notional, not a quarter of it: 105 matches no defensible arithmetic.',
    ],
  },
  {
    id: 'm13-qcm-06', moduleId: M13, theme: T1, themeEn: T1_EN, difficulte: 2,
    question: 'Le jury lance « 17 × 24 ». Quelle est la séquence « façon desk » ?',
    options: [
      'Borner d\'abord — entre 10 × 20 = 200 et 20 × 25 = 500 — puis décomposer vers un voisin ami : 17 × 25 − 17 = 425 − 17 = 408',
      'Poser mentalement la multiplication en colonnes, chiffre par chiffre, comme à l\'école',
      'Arrondir à 20 × 25 = 500 et annoncer 500 : en entretien, l\'ordre de grandeur suffit toujours',
      'Calculer 17 × 20 = 340 et s\'arrêter : l\'erreur restante est négligeable',
    ],
    bonneReponse: 0,
    explications: [
      'Les deux gestes dans l\'ordre : l\'encadrement (3 secondes) rend toute énormité impossible, puis la décomposition fait l\'exact — 25 est l\'ami de 24 parce que × 25 = × 100 ÷ 4, d\'où 425 − 17 = 408. Autre chemin équivalent : 17 × 4 × 6 = 68 × 6 = 408 — il n\'y a pas UN bon chemin, seulement des briques qu\'on assemble.',
      'La colonne mentale est lente, muette et fragile — trois défauts que le jury voit : l\'exercice évalue une méthode verbalisable, pas une prouesse scolaire.',
      'Annoncer 500 tout court jette la précision disponible pour trois secondes de plus : la borne est un garde-fou, pas une réponse finale.',
      'S\'arrêter à 340 laisse une erreur de 17 % — tout sauf négligeable : les 17 × 4 restants se calculent en une seconde.',
    ],
    questionEn: 'The panel throws "17 × 24" at you. What is the desk-style sequence?',
    optionsEn: [
      'Bound first — between 10 × 20 = 200 and 20 × 25 = 500 — then decompose towards a friendly neighbour: 17 × 25 − 17 = 425 − 17 = 408',
      'Mentally set up the long multiplication in columns, digit by digit, as in school',
      'Round to 20 × 25 = 500 and announce 500: in interviews, the order of magnitude is always enough',
      'Compute 17 × 20 = 340 and stop there: the remaining error is negligible',
    ],
    explicationsEn: [
      'The two moves in order: the bracket (3 seconds) makes any blunder impossible, then the decomposition delivers the exact value — 25 is 24\'s friend because × 25 = × 100 ÷ 4, hence 425 − 17 = 408. An equivalent path: 17 × 4 × 6 = 68 × 6 = 408 — there is no ONE right path, only bricks you assemble.',
      'The mental column method is slow, silent and fragile — three flaws the panel sees: the exercise assesses a verbalisable method, not a school feat.',
      'Announcing a bare 500 throws away precision available for three more seconds: the bound is a guardrail, not a final answer.',
      'Stopping at 340 leaves a 17% error — anything but negligible: the remaining 17 × 4 takes one second.',
    ],
  },
  {
    id: 'm13-qcm-07', moduleId: M13, theme: T1, themeEn: T1_EN, difficulte: 2,
    question: 'De tête, avec l\'identité des carrés proches de 50 : combien font 47² ?',
    options: [
      '2 191 : (50 − 3)² = 2 500 − 300 − 9',
      '2 350 : (50 − 3)² = 2 500 − 3 × 50',
      '2 209 : (50 − a)² = 2 500 − 100a + a², soit « 25 − 3 = 22 centaines, plus 3² = 9 »',
      '2 500 : on arrondit 47 à 50 et on s\'arrête là',
    ],
    bonneReponse: 2,
    explications: [
      'Le terme a² s\'AJOUTE toujours : (50 − a)² = 2 500 − 100a + a², et soustraire le 9 au lieu de l\'ajouter donne 2 191 — l\'erreur de signe classique sur le carré du binôme.',
      'Il manque le facteur 2 du double produit : le terme croisé vaut 2 × 50 × 3 = 300, pas 150 — d\'où le faux 2 350.',
      'L\'identité du chapitre : (50 ± a)² = 2 500 ± 100a + a². Pour 47 : 25 − 3 = 22 centaines, plus 9, soit 2 209 — trois secondes, et un effet sur le jury disproportionné par rapport à l\'effort d\'apprentissage. Même famille : 53² = 2 809, et près de 100, 96² = 9 216.',
      'Arrondir à 2 500 laisse une erreur de 13 % alors que l\'exact est disponible en trois secondes : la borne sert à contrôler, pas à conclure.',
    ],
    questionEn: 'In your head, using the near-50 squares identity: what is 47²?',
    optionsEn: [
      '2,191: (50 − 3)² = 2,500 − 300 − 9',
      '2,350: (50 − 3)² = 2,500 − 3 × 50',
      '2,209: (50 − a)² = 2,500 − 100a + a², read as "25 − 3 = 22 hundreds, plus 3² = 9"',
      '2,500: round 47 to 50 and stop there',
    ],
    explicationsEn: [
      'The a² term is always ADDED: (50 − a)² = 2,500 − 100a + a², and subtracting the 9 instead of adding it gives 2,191 — the classic sign error on the binomial square.',
      'The factor 2 of the cross term is missing: it equals 2 × 50 × 3 = 300, not 150 — hence the wrong 2,350.',
      'The chapter\'s identity: (50 ± a)² = 2,500 ± 100a + a². For 47: 25 − 3 = 22 hundreds, plus 9, i.e. 2,209 — three seconds, and an effect on the panel out of all proportion to the learning effort. Same family: 53² = 2,809, and near 100, 96² = 9,216.',
      'Rounding to 2,500 leaves a 13% error when the exact value is three seconds away: the bound is for control, not for concluding.',
    ],
  },
  {
    id: 'm13-qcm-08', moduleId: M13, theme: T1, themeEn: T1_EN, difficulte: 2,
    question: 'Enchaînement complet du chapitre 1 : une obligation cote 300 pb de spread, recouvrement 40 %. Quelle PD annuelle implicite le marché price-t-il, de tête ?',
    options: [
      '3 % : le spread EST la probabilité de défaut',
      '7,5 % : on divise le spread par le taux de recouvrement, 3/0,4',
      '1,8 % : on multiplie le spread par la LGD, 3 × 0,6',
      '5 % : PD ≈ spread/LGD = 3 %/0,6, et diviser par 0,6 c\'est multiplier par 5/3',
    ],
    bonneReponse: 3,
    explications: [
      'Le piège conceptuel n° 1 hérité du module 5 : le spread rémunère la perte attendue PD × LGD, il n\'est pas la PD — l\'assimiler à 3 % oublie qu\'on ne perd que 60 % du nominal au défaut.',
      'Diviser par R au lieu de LGD inverse le complément : la perte en cas de défaut est 100 − R = 60 %, pas 40 % — l\'erreur donne 7,5 % au lieu de 5 %.',
      'Multiplier au lieu de diviser renverse la formule : EL = PD × LGD, donc PD = spread/LGD — le sens de l\'équation ne se devine pas, il se comprend.',
      'Le déroulé de tête attendu : 300 pb = 3 % (conversion) ; LGD = 100 − 40 = 60 % (ancre du m5) ; diviser par 0,6 = multiplier par 5/3 (division déguisée) : 3 × 5/3 = 5 %. Trois réflexes du chapitre, une ancre de cours, dix secondes.',
    ],
    questionEn: 'Chapter 1\'s full chain: a bond trades at a 300 bp spread, recovery 40%. What implied annual PD is the market pricing, in your head?',
    optionsEn: [
      '3%: the spread IS the probability of default',
      '7.5%: you divide the spread by the recovery rate, 3/0.4',
      '1.8%: you multiply the spread by the LGD, 3 × 0.6',
      '5%: PD ≈ spread/LGD = 3%/0.6, and dividing by 0.6 is multiplying by 5/3',
    ],
    explicationsEn: [
      'Conceptual trap number one inherited from module 5: the spread compensates the expected loss PD × LGD, it is not the PD — equating it to 3% forgets you only lose 60% of par at default.',
      'Dividing by R instead of LGD flips the complement: loss given default is 100 − R = 60%, not 40% — the error yields 7.5% instead of 5%.',
      'Multiplying instead of dividing reverses the formula: EL = PD × LGD, so PD = spread/LGD — the direction of the equation is understood, not guessed.',
      'The expected mental run: 300 bp = 3% (conversion); LGD = 100 − 40 = 60% (module 5 anchor); dividing by 0.6 = multiplying by 5/3 (disguised division): 3 × 5/3 = 5%. Three chapter reflexes, one course anchor, ten seconds.',
    ],
  },
  {
    id: 'm13-qcm-09', moduleId: M13, theme: T1, themeEn: T1_EN, difficulte: 1,
    question: 'Face à toute demande d\'estimation chiffrée, quel est le méta-réflexe en trois temps que le chapitre installe ?',
    options: [
      'Chercher d\'abord la décimale exacte : la précision est la seule preuve de compétence',
      'Annoncer l\'estimation, PUIS son erreur ou son domaine de validité, PUIS raffiner si — et seulement si — le jury le demande',
      'Donner une fourchette très large et ne jamais la resserrer, pour ne jamais avoir tort',
      'Demander systématiquement plus de données avant de se prononcer',
    ],
    bonneReponse: 1,
    explications: [
      'Chercher la décimale d\'abord est l\'erreur du premier de la classe : elle coûte du temps et du silence, et prouve seulement qu\'on ne hiérarchise pas.',
      '« Environ 9 ans — règle de 72, quasi exacte à ce niveau de taux — 9,006 si vous voulez la décimale » : trois temps, dix secondes, et le jury a entendu un outil maîtrisé, une lucidité sur ses limites, une précision disponible mais jamais imposée. C\'est le contrat de toutes les approximations du cours : duration, delta, VaR paramétrique.',
      'La fourchette jamais resserrée est l\'excès inverse : une estimation qui ne s\'engage sur rien — le desk demande un chiffre utilisable maintenant, avec une barre d\'erreur.',
      'Réclamer plus de données sur une question d\'estimation, c\'est refuser l\'exercice : produire un chiffre avec de l\'information incomplète est précisément le métier testé.',
    ],
    questionEn: 'Facing any request for a numerical estimate, what is the three-step meta-reflex the chapter installs?',
    optionsEn: [
      'Hunt for the exact decimal first: precision is the only proof of competence',
      'Announce the estimate, THEN its error or validity domain, THEN refine if — and only if — the panel asks',
      'Give a very wide range and never tighten it, so as never to be wrong',
      'Systematically ask for more data before committing',
    ],
    explicationsEn: [
      'Hunting for the decimal first is the star pupil\'s mistake: it costs time and silence, and only proves you do not prioritise.',
      '"About 9 years — rule of 72, near-exact at this rate level — 9.006 if you want the decimal": three steps, ten seconds, and the panel has heard a mastered tool, lucidity about its limits, and precision available on demand but never imposed. It is the contract of every approximation in the course: duration, delta, parametric VaR.',
      'The never-tightened range is the opposite excess: an estimate that commits to nothing — the desk wants a usable number now, with an error bar.',
      'Demanding more data on an estimation question is refusing the exercise: producing a figure from incomplete information is precisely the job being tested.',
    ],
  },

  // ──────────────── les estimations de Fermi (8) ────────────────
  {
    id: 'm13-qcm-10', moduleId: M13, theme: T2, themeEn: T2_EN, difficulte: 1,
    question: 'Vous êtes sûr qu\'une quantité vaut au moins 1 000 et au plus 1 000 000. Quelle estimation ponctuelle en tirez-vous ?',
    options: [
      '500 500 : la moyenne arithmétique des deux bornes',
      '1 000 : la borne basse, par prudence',
      'Environ 30 000 : la moyenne géométrique √(1 000 × 1 000 000) = 31 622 — le milieu multiplicatif, seul cohérent sur des ordres de grandeur',
      '100 000 : le dixième de la borne haute, par convention',
    ],
    bonneReponse: 2,
    explications: [
      'La moyenne arithmétique écrase la borne basse : 500 500 est à un facteur 500 de 1 000 mais à un facteur 2 seulement de 1 000 000 — sur des ordres de grandeur, elle se trompe d\'un facteur 15.',
      'Prendre la borne basse « par prudence » n\'est pas une estimation : c\'est un refus d\'estimer, et le jury le lit comme tel.',
      'L\'incertitude d\'ordre de grandeur est multiplicative : « entre mille et un million » signifie « à un facteur ~32 du milieu », et le seul milieu au même facteur des deux bornes est le milieu géométrique √(1 000 × 1 000 000) = 31 622 ≈ 30 000.',
      'Le « dixième de la borne haute » est une convention inventée : aucune structure d\'incertitude ne la justifie.',
    ],
    questionEn: 'You are sure a quantity is at least 1,000 and at most 1,000,000. What point estimate do you draw?',
    optionsEn: [
      '500,500: the arithmetic mean of the two bounds',
      '1,000: the lower bound, out of caution',
      'About 30,000: the geometric mean √(1,000 × 1,000,000) = 31,622 — the multiplicative midpoint, the only coherent one on orders of magnitude',
      '100,000: a tenth of the upper bound, by convention',
    ],
    explicationsEn: [
      'The arithmetic mean crushes the lower bound: 500,500 sits at a factor 500 from 1,000 but only a factor 2 from 1,000,000 — on orders of magnitude, it is off by a factor 15.',
      'Taking the lower bound "out of caution" is not an estimate: it is a refusal to estimate, and the panel reads it as such.',
      'Order-of-magnitude uncertainty is multiplicative: "between a thousand and a million" means "within a factor ~32 of the middle", and the only midpoint at the same factor from both bounds is the geometric middle √(1,000 × 1,000,000) = 31,622 ≈ 30,000.',
      'The "tenth of the upper bound" is an invented convention: no uncertainty structure justifies it.',
    ],
  },
  {
    id: 'm13-qcm-11', moduleId: M13, theme: T2, themeEn: T2_EN, difficulte: 3,
    question: 'Quelle est la justification profonde de la moyenne géométrique dans une estimation de Fermi ?',
    options: [
      'En log, l\'incertitude multiplicative devient un écart additif symétrique, et la moyenne arithmétique des logs, repassée à l\'exponentielle, est exactement la moyenne géométrique — la même mathématique qui rend lognormal un produit de facteurs aléatoires',
      'La géométrique est simplement plus rapide à calculer de tête que l\'arithmétique',
      'La moyenne arithmétique sous-estime systématiquement le résultat, la géométrique corrige ce biais vers le haut',
      'C\'est une convention de la profession, sans fondement mathématique particulier',
    ],
    bonneReponse: 0,
    explications: [
      'Le cœur de l\'argument : « je peux me tromper d\'un facteur 10 dans les deux sens » devient ±1 en log₁₀ — le milieu naturel se prend en log, et exp((log b + log h)/2) = √(b × h). C\'est aussi pourquoi les erreurs de Fermi se compensent : en log, les produits deviennent des sommes, le TCL s\'en empare, et le produit tend vers une lognormale — celle-là même qui modélise les prix au module 8.',
      'La vitesse n\'est pas l\'argument — et √(b × h) est d\'ailleurs souvent PLUS difficile à calculer que (b + h)/2 : on la prend malgré son coût, parce qu\'elle est juste.',
      'C\'est l\'inverse : l\'arithmétique SURestime (500 500 contre 31 622 entre 10³ et 10⁶), aimantée par la borne haute — elle n\'a pas de « biais vers le bas » à corriger.',
      'Le fondement est parfaitement mathématique : symétrie en log, lognormalité des produits — tout sauf une convention arbitraire.',
    ],
    questionEn: 'What is the deep justification for the geometric mean in a Fermi estimate?',
    optionsEn: [
      'In logs, multiplicative uncertainty becomes a symmetric additive gap, and the arithmetic mean of the logs, exponentiated back, is exactly the geometric mean — the same mathematics that makes a product of random factors lognormal',
      'The geometric mean is simply faster to compute mentally than the arithmetic one',
      'The arithmetic mean systematically underestimates the result; the geometric one corrects that bias upwards',
      'It is a professional convention, with no particular mathematical grounding',
    ],
    explicationsEn: [
      'The heart of the argument: "I could be off by a factor 10 either way" becomes ±1 in log₁₀ — the natural midpoint is taken in logs, and exp((log b + log h)/2) = √(b × h). It is also why Fermi errors offset: in logs, products become sums, the CLT takes over, and the product tends to a lognormal — the very one that models prices in module 8.',
      'Speed is not the argument — √(b × h) is often HARDER to compute than (b + h)/2: you take it despite its cost, because it is right.',
      'It is the reverse: the arithmetic mean OVERestimates (500,500 versus 31,622 between 10³ and 10⁶), magnetised by the upper bound — there is no "downward bias" to fix.',
      'The grounding is thoroughly mathematical: symmetry in logs, lognormality of products — anything but an arbitrary convention.',
    ],
  },
  {
    id: 'm13-qcm-12', moduleId: M13, theme: T2, themeEn: T2_EN, difficulte: 2,
    question: 'Combien d\'accordeurs de pianos à Paris, et par quelle chaîne de facteurs ?',
    options: [
      'Quelques milliers : Paris est une capitale culturelle, les pianos y abondent',
      'Exactement 34 217 : une bonne estimation de Fermi va jusqu\'à la précision unitaire',
      '2 ou 3 : le métier a pratiquement disparu',
      'Quelques dizaines (~30) : ~1 million de foyers × ~3 % équipés × 1 accord/an ÷ ~1 000 accords par an et par accordeur',
    ],
    bonneReponse: 3,
    explications: [
      '« Quelques milliers » sort d\'une intuition non décomposée — précisément ce que la méthode remplace : la chaîne de facteurs atterrit deux ordres de grandeur plus bas.',
      'La fausse précision est l\'une des quatre façons de rater un Fermi : chaque décimale au-delà de l\'ordre de grandeur avoue qu\'on n\'a pas compris ce que la méthode peut livrer.',
      'L\'excès inverse : 30 000 accords par an ne se servent pas avec 2 ou 3 professionnels à ~1 000 accords chacun — la décomposition protège aussi contre le pessimisme non chiffré.',
      'Le déroulé canonique de Fermi : 2 M d\'habitants → 1 M de foyers ; taux d\'équipement sûr entre 1 et 10 %, géométrique ≈ 3 % → 30 000 pianos, un accord par an ; un accordeur fait ~4 accords/jour × 250 jours ≈ 1 000/an ; 30 000/1 000 = 30 — « quelques dizaines, à un facteur 2 ou 3 près », ce que confirment les annuaires.',
    ],
    questionEn: 'How many piano tuners in Paris, and through which chain of factors?',
    optionsEn: [
      'A few thousand: Paris is a cultural capital, pianos abound there',
      'Exactly 34,217: a good Fermi estimate goes all the way to unit precision',
      '2 or 3: the trade has practically disappeared',
      'A few dozen (~30): ~1 million households × ~3% equipped × 1 tuning/year ÷ ~1,000 tunings per year per tuner',
    ],
    explicationsEn: [
      '"A few thousand" comes from an undecomposed intuition — precisely what the method replaces: the factor chain lands two orders of magnitude lower.',
      'False precision is one of the four ways to fail a Fermi: every decimal beyond the order of magnitude admits you have not understood what the method can deliver.',
      'The opposite excess: 30,000 tunings a year cannot be served by 2 or 3 professionals doing ~1,000 each — the decomposition also protects against unquantified pessimism.',
      'The canonical Fermi run: 2m inhabitants → 1m households; equipment rate safely between 1 and 10%, geometric ≈ 3% → 30,000 pianos, one tuning a year; a tuner does ~4 tunings/day × 250 days ≈ 1,000/year; 30,000/1,000 = 30 — "a few dozen, within a factor 2 or 3", which directories confirm.',
    ],
  },
  {
    id: 'm13-qcm-13', moduleId: M13, theme: T2, themeEn: T2_EN, difficulte: 2,
    question: 'Reconstruire le volume quotidien du marché des changes à la Fermi : quelle chaîne tient la route ?',
    options: [
      '~120 Md$ par jour : le commerce mondial ramené au jour ouvré, et c\'est tout',
      '~7 500 Md$ : ~120 Md$/jour de flux commerciaux × un multiplicateur financier encadré entre 20 et 200, de milieu géométrique √4 000 ≈ 63',
      '~30 000 Md$ par jour : le commerce mondial annuel, pris tel quel',
      '~13 200 Md$ : 120 Md$ × 110, la moyenne arithmétique des bornes 20 et 200',
    ],
    bonneReponse: 1,
    explications: [
      'S\'arrêter aux flux réels oublie le facteur dominant : couvertures roulées, spéculation, trésorerie, et surtout l\'intermédiation entre teneurs de marché où un même risque change plusieurs fois de mains — le multiplicateur financier fait presque tout le volume.',
      'La chaîne du chapitre : ~30 000 Md$ de commerce mondial par an ÷ 250 jours ≈ 120 Md$/jour de flux réels ; multiplicateur sûr entre 20 et 200, milieu géométrique √(20 × 200) ≈ 63 ; produit ≈ 7 500 Md$/jour — l\'ordre de grandeur de l\'enquête BRI 2022 (module 6), retrouvé en trois lignes.',
      'Croiser les unités — l\'annuel pris pour du quotidien — fausse le point de départ d\'un facteur 250 : c\'est l\'une des quatre façons de rater un Fermi (fixer l\'unité au temps 1 et la tenir).',
      'La moyenne arithmétique des bornes du multiplicateur (110 au lieu de 63) est le mauvais milieu sur une incertitude multiplicative : elle gonfle le résultat vers 13 200 Md$ — presque le double de l\'ancre du module 6.',
    ],
    questionEn: 'Rebuilding the daily FX market volume Fermi-style: which chain holds up?',
    optionsEn: [
      '~$120bn a day: world trade brought down to the business day, and that is all',
      '~$7,500bn: ~$120bn/day of trade flows × a financial multiplier bracketed between 20 and 200, with geometric middle √4,000 ≈ 63',
      '~$30,000bn a day: annual world trade, taken as is',
      '~$13,200bn: $120bn × 110, the arithmetic mean of the 20 and 200 bounds',
    ],
    explicationsEn: [
      'Stopping at real flows misses the dominant factor: rolled hedges, speculation, treasury management, and above all inter-dealer intermediation where the same risk changes hands several times — the financial multiplier makes almost all the volume.',
      'The chapter\'s chain: ~$30,000bn of world trade a year ÷ 250 days ≈ $120bn/day of real flows; multiplier safely between 20 and 200, geometric middle √(20 × 200) ≈ 63; product ≈ $7,500bn/day — the order of magnitude of the 2022 BIS survey (module 6), recovered in three lines.',
      'Crossing units — the annual figure taken as daily — skews the starting point by a factor 250: one of the four ways to fail a Fermi (fix the unit at step 1 and hold it).',
      'The arithmetic mean of the multiplier bounds (110 instead of 63) is the wrong middle on multiplicative uncertainty: it inflates the result towards $13,200bn — nearly double the module 6 anchor.',
    ],
  },
  {
    id: 'm13-qcm-14', moduleId: M13, theme: T2, themeEn: T2_EN, difficulte: 2,
    question: 'Balles de ping-pong dans un A320 : quelle étape les candidats oublient-ils le plus souvent ?',
    options: [
      'Le taux de remplissage : des sphères en vrac n\'occupent que ~60 % du volume — sans lui, l\'estimation gonfle de deux tiers, et le jury le remarque immédiatement',
      'Aucune : 200 m³ divisés par 33,5 cm³ donnent directement la bonne réponse',
      'Le poids des balles, qui limite la charge utile de l\'avion bien avant le volume',
      'La fausse précision : il fallait annoncer 3 641 218 balles, pas « quelques millions »',
    ],
    bonneReponse: 0,
    explications: [
      'Le facteur oublié du déroulé : cabine ~200 m³, balle ≈ 33,5 cm³, remplissage en vrac ~60 % → ~18 000 balles/m³, soit 200 × 18 000 ≈ 3,6 millions. Le réflexe anti-oubli : relire sa chaîne de facteurs en se demandant « quoi d\'autre ? » avant d\'annoncer.',
      'La division brute volume/volume suppose un empilement parfait : elle donne ~6 millions au lieu de ~3,6 — l\'erreur des deux tiers que le jury, qui pose la question dix fois par saison, repère instantanément.',
      'Le poids est hors sujet : la question porte sur le volume rempli, pas sur ce que l\'avion peut soulever — introduire ce facteur, c\'est répondre à une autre question.',
      'C\'est l\'inverse : « quelques millions » est la bonne annonce — chaque décimale au-delà de l\'ordre de grandeur est un aveu qu\'on n\'a pas compris l\'exercice.',
    ],
    questionEn: 'Ping-pong balls in an A320: which step do candidates forget most often?',
    optionsEn: [
      'The packing rate: loosely packed spheres only fill ~60% of the volume — without it, the estimate inflates by two thirds, and the panel notices immediately',
      'None: 200 m³ divided by 33.5 cm³ directly gives the right answer',
      'The weight of the balls, which caps the aircraft\'s payload well before volume does',
      'False precision: you should have announced 3,641,218 balls, not "a few million"',
    ],
    explicationsEn: [
      'The forgotten factor of the walkthrough: cabin ~200 m³, ball ≈ 33.5 cm³, loose packing ~60% → ~18,000 balls/m³, i.e. 200 × 18,000 ≈ 3.6 million. The anti-omission reflex: reread your factor chain asking "what else?" before announcing.',
      'The raw volume/volume division assumes perfect stacking: it gives ~6 million instead of ~3.6 — the two-thirds error a panel that asks this ten times a season spots instantly.',
      'Weight is beside the point: the question is about filled volume, not what the plane can lift — bringing that factor in answers a different question.',
      'It is the reverse: "a few million" is the right announcement — every decimal beyond the order of magnitude admits you have not understood the exercise.',
    ],
  },
  {
    id: 'm13-qcm-15', moduleId: M13, theme: T2, themeEn: T2_EN, difficulte: 1,
    question: 'Quel est le protocole en cinq temps d\'une estimation de Fermi ?',
    options: [
      'Décomposer, réciter le chiffre si on le connaît, conclure sans annoncer d\'incertitude',
      'Encadrer la réponse finale par deux bornes et prendre leur moyenne arithmétique',
      'Reformuler et fixer l\'unité ; décomposer en facteurs ; encadrer chaque facteur par des bornes sûres ; prendre la moyenne géométrique des bornes ; annoncer l\'ordre de grandeur avec son facteur d\'incertitude',
      'Donner d\'abord un chiffre au jugé, puis construire une décomposition qui le justifie',
    ],
    bonneReponse: 2,
    explications: [
      'Réciter un chiffre connu gaspille l\'occasion de montrer la méthode — et conclure sans incertitude retire le cinquième temps, celui qui prouve qu\'on sait ce que le chiffre vaut.',
      'Encadrer la réponse FINALE saute la décomposition (le cœur de la méthode), et l\'arithmétique est le mauvais milieu sur des ordres de grandeur.',
      'Les cinq temps du chapitre : 1) reformuler et fixer l\'unité (par jour ou par an ?) ; 2) décomposer — population × taux × fréquence est le squelette le plus courant ; 3) encadrer chaque facteur par des bornes SÛRES ; 4) moyenne géométrique √(b × h), jamais l\'arithmétique ; 5) annoncer l\'ordre de grandeur « à un facteur k près ».',
      'Le chiffre d\'abord et la justification ensuite, c\'est l\'ancrage sur sa propre intuition : la décomposition doit produire le chiffre, pas l\'habiller.',
    ],
    questionEn: 'What is the five-step protocol of a Fermi estimate?',
    optionsEn: [
      'Decompose, recite the figure if you know it, conclude without stating any uncertainty',
      'Bracket the final answer with two bounds and take their arithmetic mean',
      'Rephrase and fix the unit; decompose into factors; bracket each factor with safe bounds; take the geometric mean of the bounds; announce the order of magnitude with its uncertainty factor',
      'Give a gut figure first, then build a decomposition that justifies it',
    ],
    explicationsEn: [
      'Reciting a known figure wastes the chance to show the method — and concluding without uncertainty drops the fifth step, the one proving you know what the number is worth.',
      'Bracketing the FINAL answer skips the decomposition (the heart of the method), and the arithmetic mean is the wrong middle on orders of magnitude.',
      'The chapter\'s five steps: 1) rephrase and fix the unit (per day or per year?); 2) decompose — population × rate × frequency is the most common skeleton; 3) bracket each factor with SAFE bounds; 4) geometric mean √(b × h), never the arithmetic one; 5) announce the order of magnitude "within a factor k".',
      'Figure first and justification after is anchoring on your own intuition: the decomposition must produce the figure, not dress it up.',
    ],
  },
  {
    id: 'm13-qcm-16', moduleId: M13, theme: T2, themeEn: T2_EN, difficulte: 2,
    question: 'Dans une estimation de Fermi, qu\'est-ce que le jury note en priorité ?',
    options: [
      'La proximité du résultat final avec la vraie valeur — c\'est le seul critère objectif',
      'La vitesse de la réponse : au-delà de trente secondes, le candidat est éliminé',
      'La finesse des bornes : des bornes étroites prouvent l\'expertise',
      'La structure : une décomposition propre, des bornes larges mais assumées, des unités tenues — et la capacité à corriger en route sans paniquer',
    ],
    bonneReponse: 3,
    explications: [
      'Atterrir à un facteur 5 avec une chaîne défendable bat un coup de chance sans structure : la question simule la production d\'un ordre de grandeur avec de l\'information incomplète, pas un concours de précision.',
      'Le silence prolongé est éliminatoire, mais la réflexion structurée à voix haute ne l\'est jamais : c\'est le mutisme qui coûte, pas la durée.',
      'C\'est l\'inverse : des bornes étroites bluffées sont du bluff, et les jurys savent le sonder en une question — « entre 1 % et 10 %, je n\'en sais pas plus, la géométrique dit 3 % » est de la rigueur.',
      'La hiérarchie contre-intuitive pour un bon élève : la structure vaut plus que le résultat. Et l\'erreur corrigée en route à voix haute (« j\'ai oublié les pianos des conservatoires — +20 %, l\'ordre de grandeur tient ») est un point GAGNÉ : elle montre le contrôle permanent que le desk exige.',
    ],
    questionEn: 'In a Fermi estimate, what does the panel grade first?',
    optionsEn: [
      'How close the final result is to the true value — the only objective criterion',
      'Speed: beyond thirty seconds, the candidate is out',
      'The tightness of the bounds: narrow bounds prove expertise',
      'The structure: a clean decomposition, wide but owned bounds, units held throughout — and the ability to correct mid-course without panicking',
    ],
    explicationsEn: [
      'Landing within a factor 5 with a defensible chain beats a lucky hit with no structure: the question simulates producing an order of magnitude from incomplete information, not a precision contest.',
      'Prolonged silence is disqualifying, but structured thinking out loud never is: it is the muteness that costs, not the duration.',
      'It is the reverse: bluffed narrow bounds are bluff, and panels can probe that in one question — "between 1% and 10%, that is all I know, the geometric mean says 3%" is rigour.',
      'The hierarchy that is counter-intuitive for a good student: structure outweighs the result. And the error corrected aloud mid-course ("I forgot conservatory pianos — +20%, the order of magnitude holds") is a point WON: it shows the permanent control the desk demands.',
    ],
  },
  {
    id: 'm13-qcm-17', moduleId: M13, theme: T2, themeEn: T2_EN, difficulte: 2,
    question: 'Quel rôle jouent les ancres chiffrées du cours (BRI, spreads, VaR…) dans une estimation de Fermi ?',
    options: [
      'Aucun : la méthode de Fermi interdit par principe d\'utiliser des connaissances préalables',
      'Elles servent de garde-fous : la décomposition rend le raisonnement visible, l\'ancre mémorisée vérifie l\'atterrissage — le facteur perdu se détecte AVANT le jury',
      'Elles remplacent le calcul : réciter le chiffre de la BRI suffit, la décomposition est du temps perdu',
      'Elles ne servent que si le jury demande explicitement une source',
    ],
    bonneReponse: 1,
    explications: [
      'Confondre « aucune connaissance requise » et « aucune connaissance utilisée » : la question de Fermi n\'exige pas de savoir, mais rien n\'interdit de vérifier avec ce qu\'on sait.',
      'Le candidat idéal fait tourner les deux moteurs : si la chaîne FX était sortie à 500 ou à 80 000 Md$, l\'ancre du module 6 (~7 500 Md$/jour) aurait signalé le facteur perdu avant le jury — et l\'erreur détectée par vous vaut des points, la même détectée par lui en coûte le double.',
      'Réciter le chiffre seul gaspille l\'occasion : c\'est la reconstruction qui impressionne, pas la récitation — le jury teste le raisonnement visible.',
      'Le garde-fou fonctionne en silence et en continu, pas sur demande : il fait partie de VOTRE contrôle qualité, pas du protocole de citation.',
    ],
    questionEn: 'What role do the course\'s numerical anchors (BIS, spreads, VaR…) play in a Fermi estimate?',
    optionsEn: [
      'None: the Fermi method forbids using prior knowledge on principle',
      'They act as guardrails: the decomposition makes the reasoning visible, the memorised anchor checks the landing — the lost factor is caught BEFORE the panel sees it',
      'They replace the computation: reciting the BIS figure is enough, the decomposition is wasted time',
      'They only matter if the panel explicitly asks for a source',
    ],
    explicationsEn: [
      'This confuses "no knowledge required" with "no knowledge used": a Fermi question demands no facts, but nothing forbids checking against what you know.',
      'The ideal candidate runs both engines: had the FX chain landed at $500bn or $80,000bn, the module 6 anchor (~$7,500bn/day) would have flagged the lost factor before the panel — and an error you catch earns points, the same error caught by them costs double.',
      'Reciting the bare figure wastes the opportunity: the reconstruction impresses, not the recitation — the panel tests visible reasoning.',
      'The guardrail works silently and continuously, not on request: it is part of YOUR quality control, not of a citation protocol.',
    ],
  },

  // ──────────────── les probabilités d'entretien (10) ────────────────
  {
    id: 'm13-qcm-18', moduleId: M13, theme: T3, themeEn: T3_EN, difficulte: 1,
    question: 'Quelle est la probabilité d\'obtenir au moins un 6 en quatre lancers d\'un dé équilibré ?',
    options: [
      '66,7 % : quatre lancers à 1/6 chacun, soit 4 × 1/6',
      'Exactement 50 % : quatre essais pour six faces, le pari est équilibré',
      '51,774691 % : on passe par le complémentaire, 1 − (5/6)⁴',
      '0,08 % : les probabilités se multiplient, (1/6)⁴',
    ],
    bonneReponse: 2,
    explications: [
      'LE piège du chapitre : n × p additionne des succès qui ne s\'additionnent pas — à ce compte, six lancers donneraient 100 %, ce qui est absurde. Les succès se composent, même structure que le défaut cumulé du module 5.',
      'Le pari est favorable de JUSTESSE, pas équilibré : 51,8 % contre 48,2 % — c\'est précisément cette marge fine qui faisait gagner le chevalier de Méré.',
      'Les mots « au moins un » déclenchent le réflexe du complémentaire : la probabilité qu\'aucun 6 ne sorte est (5/6)⁴, d\'où P = 1 − (5/6)⁴ = 51,774691 % — un simple produit grâce à l\'indépendance, retranché de 1.',
      '(1/6)⁴ calcule autre chose : la probabilité de QUATRE 6 consécutifs — la confusion entre « au moins un » (on multiplie les échecs) et la série (on multiplie les succès).',
    ],
    questionEn: 'What is the probability of getting at least one 6 in four rolls of a fair die?',
    optionsEn: [
      '66.7%: four rolls at 1/6 each, i.e. 4 × 1/6',
      'Exactly 50%: four tries for six faces, the bet is balanced',
      '51.774691%: you go through the complement, 1 − (5/6)⁴',
      '0.08%: the probabilities multiply, (1/6)⁴',
    ],
    explicationsEn: [
      'THE trap of the chapter: n × p adds successes that do not add — at that rate, six rolls would give 100%, which is absurd. Successes compound, the same structure as cumulative default in module 5.',
      'The bet is favourable by a WHISKER, not balanced: 51.8% versus 48.2% — precisely the thin edge that made the Chevalier de Méré a winner.',
      'The words "at least one" trigger the complement reflex: the probability that no 6 shows is (5/6)⁴, hence P = 1 − (5/6)⁴ = 51.774691% — a simple product thanks to independence, subtracted from 1.',
      '(1/6)⁴ computes something else: the probability of FOUR consecutive 6s — the confusion between "at least one" (multiply the failures) and the streak (multiply the successes).',
    ],
  },
  {
    id: 'm13-qcm-19', moduleId: M13, theme: T3, themeEn: T3_EN, difficulte: 2,
    question: 'Le chevalier de Méré gagnait au pari du 6 en quatre lancers, puis a perdu en pariant sur au moins un double 6 en 24 lancers de deux dés. Pourquoi ?',
    options: [
      'Parce que la règle de trois ne s\'applique pas aux probabilités : 1 − (35/36)²⁴ = 49,1 %, défavorable de justesse — l\'énigme, transmise à Pascal puis Fermat, a fondé le calcul des probabilités en 1654',
      'Parce que les dés des tripots de l\'époque étaient truqués contre les joueurs professionnels',
      'Parce que 24 lancers à 1/36 donnent 24/36 = 66,7 % : le pari était favorable, il a simplement manqué de chance',
      'Parce que les lancers de deux dés ne sont pas indépendants entre eux',
    ],
    bonneReponse: 0,
    explications: [
      'Méré croyait le second pari équivalent au premier par proportionnalité (4/6 « comme » 24/36) — mais les probabilités se composent au lieu de se proportionner : 1 − (35/36)²⁴ = 49,1 % contre 51,8 % pour le premier pari. Intrigué par ses pertes, il soumet l\'énigme à Pascal, dont la correspondance avec Fermat à l\'été 1654 invente la discipline.',
      'Aucune tricherie dans l\'histoire : Méré perdait face à une arithmétique honnête — c\'est justement ce qui rend l\'anecdote racontable en trente secondes à l\'oral.',
      '24/36 est le piège n × p à l\'œuvre : si ce calcul était juste, le pari serait favorable — or il est défavorable de justesse, et c\'est la régularité des pertes qui a mis Méré en alerte.',
      'Les lancers successifs sont bien indépendants — c\'est précisément cette indépendance qui permet le calcul par le complémentaire (35/36 puissance 24).',
    ],
    questionEn: 'The Chevalier de Méré won betting on a 6 in four rolls, then lost betting on at least one double 6 in 24 rolls of two dice. Why?',
    optionsEn: [
      'Because the rule of three does not apply to probabilities: 1 − (35/36)²⁴ = 49.1%, unfavourable by a whisker — the puzzle, passed to Pascal then Fermat, founded probability theory in 1654',
      'Because the dice in the gambling dens of the time were rigged against professional players',
      'Because 24 rolls at 1/36 give 24/36 = 66.7%: the bet was favourable, he was simply unlucky',
      'Because the rolls of two dice are not independent of one another',
    ],
    explicationsEn: [
      'Méré thought the second bet equivalent to the first by proportionality (4/6 "like" 24/36) — but probabilities compound instead of scaling: 1 − (35/36)²⁴ = 49.1% versus 51.8% for the first bet. Puzzled by his losses, he passed the riddle to Pascal, whose summer 1654 correspondence with Fermat invented the discipline.',
      'No cheating in the story: Méré was losing to honest arithmetic — which is exactly what makes the anecdote worth thirty seconds in an oral.',
      '24/36 is the n × p trap at work: were that computation right, the bet would be favourable — yet it is unfavourable by a whisker, and it was the regularity of his losses that alerted Méré.',
      'Successive rolls are indeed independent — that very independence is what allows the complement computation ((35/36) to the 24th).',
    ],
  },
  {
    id: 'm13-qcm-20', moduleId: M13, theme: T3, themeEn: T3_EN, difficulte: 1,
    question: 'Probabilité d\'obtenir au moins un pile en trois lancers d\'une pièce équilibrée ?',
    options: [
      '150 %, donc une certitude : 3 × 50 %',
      '50 % : chaque lancer reste du 50/50',
      '12,5 % : (1/2)³',
      '87,5 % : 1 − (1/2)³ — le complémentaire « aucun pile » vaut 1/8',
    ],
    bonneReponse: 3,
    explications: [
      'Le n × p poussé à l\'absurde : une probabilité ne dépasse jamais 100 %, et « plafonner » le résultat ne répare pas une méthode fausse — les succès se composent, ils ne s\'additionnent pas.',
      '50 % est la probabilité de CHAQUE lancer, pas celle d\'au moins un succès sur trois : confondre les deux, c\'est ignorer que les occasions se cumulent (en se composant).',
      '(1/2)³ = 12,5 % est la probabilité de l\'événement complémentaire — trois faces d\'affilée — ou de trois piles d\'affilée : dans les deux cas, autre chose que « au moins un ».',
      'L\'ancre du chapitre : 1 − (1/2)³ = 1 − 1/8 = 87,5 %. Les mots « au moins un » déclenchent le complémentaire : probabilité que TOUS les essais échouent, retranchée de 1.',
    ],
    questionEn: 'Probability of getting at least one heads in three flips of a fair coin?',
    optionsEn: [
      '150%, hence a certainty: 3 × 50%',
      '50%: each flip remains 50/50',
      '12.5%: (1/2)³',
      '87.5%: 1 − (1/2)³ — the complement "no heads" is worth 1/8',
    ],
    explicationsEn: [
      'The n × p trap pushed to absurdity: a probability never exceeds 100%, and "capping" the result does not fix a wrong method — successes compound, they do not add.',
      '50% is the probability of EACH flip, not of at least one success in three: confusing the two ignores that opportunities accumulate (by compounding).',
      '(1/2)³ = 12.5% is the probability of the complementary event — three tails in a row — or of three heads in a row: either way, something other than "at least one".',
      'The chapter\'s anchor: 1 − (1/2)³ = 1 − 1/8 = 87.5%. The words "at least one" trigger the complement: probability that ALL tries fail, subtracted from 1.',
    ],
  },
  {
    id: 'm13-qcm-21', moduleId: M13, theme: T3, themeEn: T3_EN, difficulte: 2,
    question: 'Pourquoi suffit-il de 23 personnes pour qu\'un anniversaire partagé devienne plus probable qu\'improbable (50,729723 %) ?',
    options: [
      'Parce que les collisions se comptent en PAIRES : C(23, 2) = 253 occasions de coïncidence, un nombre qui croît en n² quand l\'intuition, câblée linéaire, compte les personnes',
      'Parce que les naissances se concentrent sur certains mois de l\'année',
      'C\'est faux : il faut 183 personnes, la moitié de 365',
      'Parce que le calcul inclut le 29 février des années bissextiles',
    ],
    bonneReponse: 0,
    explications: [
      'L\'intuition rate d\'un facteur huit parce qu\'elle compte 23 personnes au lieu de 253 paires — chaque paire est une collision possible à 1/365, et le nombre de paires croît quadratiquement. Le calcul propre passe par le complémentaire : 365/365 × 364/365 × … × 343/365, produit qui passe sous 50 % à 23. Leçon de desk : dès qu\'on compte les paires, le rare devient banal.',
      'Le résultat vaut déjà sous l\'hypothèse de 365 jours ÉQUIPROBABLES : la saisonnalité réelle des naissances ne fait que renforcer légèrement l\'effet, elle ne l\'explique pas.',
      '183 est la réponse de l\'intuition linéaire — et elle est fausse : à 50 personnes on est déjà à 97,0 %, à 70 à 99,9 %.',
      'Le 29 février est ignoré dans le calcul canonique (365 jours) : il n\'a aucun rôle dans le paradoxe.',
    ],
    questionEn: 'Why do 23 people suffice for a shared birthday to become more likely than not (50.729723%)?',
    optionsEn: [
      'Because collisions are counted in PAIRS: C(23, 2) = 253 chances of coincidence, a number growing in n² while intuition, wired linear, counts people',
      'Because births cluster in certain months of the year',
      'It is false: you need 183 people, half of 365',
      'Because the computation includes February 29th of leap years',
    ],
    explicationsEn: [
      'Intuition misses by a factor of eight because it counts 23 people instead of 253 pairs — each pair is a possible collision at 1/365, and the number of pairs grows quadratically. The clean computation goes through the complement: 365/365 × 364/365 × … × 343/365, a product that drops below 50% at 23. Desk lesson: once you count pairs, the rare becomes commonplace.',
      'The result already holds under the assumption of 365 EQUIPROBABLE days: the real seasonality of births only slightly strengthens the effect, it does not explain it.',
      '183 is the linear intuition\'s answer — and it is wrong: at 50 people you are already at 97.0%, at 70 at 99.9%.',
      'February 29th is ignored in the canonical computation (365 days): it plays no role in the paradox.',
    ],
  },
  {
    id: 'm13-qcm-22', moduleId: M13, theme: T3, themeEn: T3_EN, difficulte: 2,
    question: 'Une maladie touche 1 % de la population ; un test la détecte à 99 %, avec 5 % de faux positifs. Votre test est positif : probabilité d\'être malade ?',
    options: [
      '99 % : c\'est la fiabilité affichée du test',
      '95 % : la sensibilité moins les faux positifs',
      'Environ 50 % : le test peut se tromper dans les deux sens',
      '16,666667 % — un sixième : sur 10 000 personnes, 99 vrais positifs contre 495 faux, et 99/594 = 1/6',
    ],
    bonneReponse: 3,
    explications: [
      'Répondre 99 % est le « base rate neglect » : confondre P(test⁺ | malade) avec P(malade | test⁺) — deux conditionnelles différentes, et tout Bayes tient dans l\'art de passer de l\'une à l\'autre en réintroduisant la prévalence.',
      'Soustraire les faux positifs de la sensibilité est une arithmétique inventée : les deux taux portent sur des populations différentes (malades et sains) et ne se soustraient pas.',
      '« Environ 50 % » est un compromis au jugé, sans structure : la vraie réponse dépend crucialement de la prévalence, que cette option ignore autant que le 99 %.',
      'La méthode des 10 000, à réciter : 100 malades dont 99 détectés ; 9 900 sains dont 5 % de faux positifs = 495 ; parmi les 594 positifs, 99 vrais → 99/594 = 16,666667 %. Les faux positifs NOIENT les vrais quand la prévalence est faible — cinq contre un.',
    ],
    questionEn: 'A disease affects 1% of the population; a test detects it 99% of the time, with 5% false positives. Your test is positive: probability you are sick?',
    optionsEn: [
      '99%: that is the test\'s advertised reliability',
      '95%: the sensitivity minus the false positives',
      'About 50%: the test can err in both directions',
      '16.666667% — one sixth: out of 10,000 people, 99 true positives against 495 false ones, and 99/594 = 1/6',
    ],
    explicationsEn: [
      'Answering 99% is base rate neglect: confusing P(test⁺ | sick) with P(sick | test⁺) — two different conditionals, and all of Bayes lies in moving from one to the other by reinstating the prevalence.',
      'Subtracting false positives from sensitivity is invented arithmetic: the two rates apply to different populations (the sick and the healthy) and do not subtract.',
      '"About 50%" is a gut compromise with no structure: the true answer depends crucially on the prevalence, which this option ignores as much as the 99% does.',
      'The method of 10,000, to be recited: 100 sick of whom 99 detected; 9,900 healthy with 5% false positives = 495; among the 594 positives, 99 are true → 99/594 = 16.666667%. False positives DROWN the true ones when prevalence is low — five to one.',
    ],
  },
  {
    id: 'm13-qcm-23', moduleId: M13, theme: T3, themeEn: T3_EN, difficulte: 2,
    question: 'Transposition marché du piège de Bayes : un indicateur de crise « fiable à 99 % » guette un événement qui n\'arrive que 1 % du temps. Que vaut une alerte ?',
    options: [
      'Une quasi-certitude de crise : 99 % de fiabilité, c\'est 99 % de chances',
      'Peu de chose : les faux positifs noient les vrais quand l\'événement cherché est rare — la force d\'un signal dépend de la rareté de ce qu\'il cherche',
      'Rien du tout : un indicateur de crise est par nature inutilisable, il faut le débrancher',
      'Une alerte fiable, à condition que l\'indicateur ait été validé par un grand nombre de backtests',
    ],
    bonneReponse: 1,
    explications: [
      'C\'est exactement le 99 % du test médical : confondre la fiabilité de l\'instrument avec la probabilité a posteriori — la prévalence de 1 % renverse le rapport.',
      'La phrase d\'oral qui résume le chapitre : même structure que le test médical — l\'indicateur produit surtout de fausses alertes (modules 10 et 11), car les 99 % de périodes calmes génèrent un flot de faux positifs qui écrase les vrais signaux.',
      'De « pas fiable seul » à « inutilisable » il y a un monde : l\'alerte met à jour la probabilité (elle la multiplie), elle ne la porte simplement pas à 99 % — c\'est un input, pas un verdict.',
      'Piège inversé du module 2 : un signal rare RECHERCHÉ par mille backtests est probablement lui-même un faux positif — la multiplication des tests aggrave le problème au lieu de le résoudre.',
    ],
    questionEn: 'Market transposition of the Bayes trap: a crisis indicator "99% reliable" watches for an event that only happens 1% of the time. What is an alert worth?',
    optionsEn: [
      'Near-certainty of a crisis: 99% reliability means 99% odds',
      'Not much: false positives drown the true ones when the event sought is rare — the strength of a signal depends on the rarity of what it seeks',
      'Nothing at all: a crisis indicator is unusable by nature and should be unplugged',
      'A reliable alert, provided the indicator was validated by a large number of backtests',
    ],
    explicationsEn: [
      'This is exactly the medical test\'s 99%: confusing the instrument\'s reliability with the posterior probability — the 1% prevalence flips the ratio.',
      'The oral one-liner that sums up the chapter: same structure as the medical test — the indicator mostly produces false alarms (modules 10 and 11), because the 99% of calm periods generate a flood of false positives that swamps the true signals.',
      'From "not reliable alone" to "unusable" is a long way: the alert updates the probability (it multiplies it), it just does not lift it to 99% — it is an input, not a verdict.',
      'The inverted trap from module 2: a rare signal HUNTED by a thousand backtests is probably itself a false positive — multiplying the tests worsens the problem instead of solving it.',
    ],
  },
  {
    id: 'm13-qcm-24', moduleId: M13, theme: T3, themeEn: T3_EN, difficulte: 2,
    question: 'Combien de mains de poker à 5 cartes dans un jeu de 52 — et quel est le réflexe de calcul qui distingue à l\'oral ?',
    options: [
      '311 875 200 : le produit 52 × 51 × 50 × 49 × 48',
      '260 : 52 × 5',
      '2 598 960 : C(52, 5), en SIMPLIFIANT avant de multiplier — 50/5, 48/4, 51/3, 52/2, puis 26 × 17 × 10 × 12 × 49',
      '62 375 040 : le produit des cinq cartes divisé par 5',
    ],
    bonneReponse: 2,
    explications: [
      'Le produit brut compte les ARRANGEMENTS : il ordonne les cinq cartes, alors qu\'une main de poker est un ensemble sans ordre — il faut diviser par 5! = 120.',
      '52 × 5 ne correspond à aucun comptage : ni arrangements, ni combinaisons — un geste au hasard.',
      'L\'ancre universelle : C(52, 5) = 2 598 960. Le réflexe qui marque : simplifier AVANT de multiplier — 50/5 = 10, 48/4 = 12, 51/3 = 17, 52/2 = 26, puis 26 × 17 × 10 × 12 × 49 — sans jamais manipuler un nombre à huit chiffres.',
      'Diviser par 5 au lieu de 5! : l\'ordre se neutralise par les 120 permutations des cinq cartes, pas par leur simple nombre — l\'erreur laisse un facteur 24 de trop.',
    ],
    questionEn: 'How many 5-card poker hands from a 52-card deck — and which computational reflex stands out in an oral?',
    optionsEn: [
      '311,875,200: the product 52 × 51 × 50 × 49 × 48',
      '260: 52 × 5',
      '2,598,960: C(52, 5), SIMPLIFYING before multiplying — 50/5, 48/4, 51/3, 52/2, then 26 × 17 × 10 × 12 × 49',
      '62,375,040: the five-card product divided by 5',
    ],
    explicationsEn: [
      'The raw product counts ARRANGEMENTS: it orders the five cards, whereas a poker hand is an unordered set — you must divide by 5! = 120.',
      '52 × 5 matches no counting scheme: neither arrangements nor combinations — a random move.',
      'The universal anchor: C(52, 5) = 2,598,960. The reflex that scores: simplify BEFORE multiplying — 50/5 = 10, 48/4 = 12, 51/3 = 17, 52/2 = 26, then 26 × 17 × 10 × 12 × 49 — never handling an eight-digit number.',
      'Dividing by 5 instead of 5!: order is neutralised by the 120 permutations of the five cards, not by their mere count — the error leaves a factor of 24 too much.',
    ],
  },
  {
    id: 'm13-qcm-25', moduleId: M13, theme: T3, themeEn: T3_EN, difficulte: 1,
    question: 'Probabilité d\'obtenir cinq piles d\'affilée avec une pièce équilibrée ?',
    options: [
      '3,125 % : (1/2)⁵ — les succès consécutifs se multiplient',
      '50 % : chaque lancer est indépendant, la série ne change rien',
      '6,25 % : (1/2)⁴',
      '96,875 % : 1 − (1/2)⁵',
    ],
    bonneReponse: 0,
    explications: [
      'La série consécutive multiplie les SUCCÈS : (1/2)⁵ = 1/32 = 3,125 % — le miroir exact du « au moins un », où l\'on multipliait les échecs.',
      '50 % est la probabilité du prochain lancer sachant les précédents — pas celle de la série entière annoncée à l\'avance : confondre les deux, c\'est mélanger conditionnel et joint.',
      '(1/2)⁴ compte quatre lancers au lieu de cinq — l\'erreur d\'inattention classique de fin d\'entretien, quand la fatigue monte.',
      '1 − (1/2)⁵ est le complémentaire — « au moins un face en cinq lancers » : appliquer le réflexe du complémentaire là où il ne va pas est la faute symétrique du n × p.',
    ],
    questionEn: 'Probability of five heads in a row with a fair coin?',
    optionsEn: [
      '3.125%: (1/2)⁵ — consecutive successes multiply',
      '50%: each flip is independent, the streak changes nothing',
      '6.25%: (1/2)⁴',
      '96.875%: 1 − (1/2)⁵',
    ],
    explicationsEn: [
      'A consecutive streak multiplies the SUCCESSES: (1/2)⁵ = 1/32 = 3.125% — the exact mirror of "at least one", where you multiplied the failures.',
      '50% is the probability of the next flip given the previous ones — not that of the whole streak called in advance: confusing the two mixes conditional and joint.',
      '(1/2)⁴ counts four flips instead of five — the classic slip of late-interview fatigue.',
      '1 − (1/2)⁵ is the complement — "at least one tails in five flips": applying the complement reflex where it does not belong is the symmetric fault of n × p.',
    ],
  },
  {
    id: 'm13-qcm-26', moduleId: M13, theme: T3, themeEn: T3_EN, difficulte: 2,
    question: 'Monty Hall : vous choisissez une porte sur trois ; l\'animateur, qui SAIT où est la voiture, ouvre une porte perdante parmi les deux autres et propose de changer. Que faites-vous ?',
    options: [
      'Indifférent : il reste deux portes, donc 50/50',
      'Changer : les chances passent de 1/3 à 2/3 — le geste de l\'animateur, contraint par sa connaissance, concentre sur la porte restante toute la probabilité des deux portes non choisies',
      'Rester : la première intuition est statistiquement la meilleure',
      'Changer, mais le gain est marginal : environ 55 % contre 45 %',
    ],
    bonneReponse: 1,
    explications: [
      'Le 50/50 oublie QUI a ouvert la porte : un animateur contraint (il ouvre toujours une perdante) transporte de l\'information — si un ami ignorant avait ouvert au hasard et trouvé une chèvre par chance, là, changer ne servirait à rien.',
      'Votre porte initiale garde 1/3 quoi qu\'il arrive : l\'animateur ouvrira une perdante dans tous les cas, donc son geste n\'apprend rien sur VOTRE porte. Les 2/3 restants se reportent entièrement sur la porte qu\'il n\'a pas ouverte — en Bayes : P(ouvre 3 | voiture en 2) = 1 contre 1/2 si elle est chez vous, d\'où 2/3.',
      '« Rester sur sa première intuition » n\'est pas un argument probabiliste : c\'est un biais de statu quo, et il coûte exactement 1/3 de chances.',
      'Le gain n\'est pas marginal : 2/3 contre 1/3, du simple au double — chiffrer un « petit avantage » à 55/45 est une précision fausse, le péché capital de l\'oral.',
    ],
    questionEn: 'Monty Hall: you pick one door of three; the host, who KNOWS where the car is, opens a losing door among the other two and offers a switch. What do you do?',
    optionsEn: [
      'Indifferent: two doors remain, so 50/50',
      'Switch: your odds go from 1/3 to 2/3 — the host\'s move, constrained by his knowledge, concentrates onto the remaining door all the probability of the two doors you did not pick',
      'Stay: the first intuition is statistically the best',
      'Switch, but the gain is marginal: about 55% versus 45%',
    ],
    explicationsEn: [
      'The 50/50 forgets WHO opened the door: a constrained host (he always opens a loser) carries information — had an ignorant friend opened at random and found a goat by luck, switching would indeed be useless.',
      'Your initial door keeps 1/3 no matter what: the host will open a losing door in every case, so his move teaches nothing about YOUR door. The remaining 2/3 transfers entirely to the door he did not open — in Bayes terms: P(opens 3 | car behind 2) = 1 versus 1/2 if it is behind yours, hence 2/3.',
      '"Sticking with your first intuition" is not a probabilistic argument: it is status quo bias, and it costs exactly 1/3 of your chances.',
      'The gain is not marginal: 2/3 versus 1/3, double or nothing — quantifying a "small edge" at 55/45 is false precision, the cardinal sin of the oral.',
    ],
  },
  {
    id: 'm13-qcm-27', moduleId: M13, theme: T3, themeEn: T3_EN, difficulte: 2,
    question: 'Une pièce équilibrée vient de donner dix piles d\'affilée. Le prochain lancer ?',
    options: [
      'Face est « dû » : la loi des grands nombres doit rééquilibrer la série',
      'Pile à coup sûr : dix piles prouvent que la pièce est truquée',
      '50 % si la pièce est équilibrée — pas de mémoire ; mais l\'étage bayésien existe : dix piles n\'arrivent qu\'à ~0,1 %, un esprit bayésien commence à réviser sa confiance dans la pièce et pencherait plutôt pile',
      'Impossible à dire : après une telle série, les probabilités ne s\'appliquent plus',
    ],
    bonneReponse: 2,
    explications: [
      'Le gambler\'s fallacy dans le texte : la loi des grands nombres DILUE les écarts dans le long terme, elle ne les compense jamais coup par coup — la pièce n\'a pas de mémoire.',
      'L\'excès inverse : dix piles arrivent à une pièce honnête une fois sur 1 024 — c\'est rare, pas impossible ; conclure « à coup sûr » remplace une probabilité par une certitude.',
      'La réponse à deux étages du chapitre : conditionnellement à une pièce équilibrée, 50 % — indépendance. Mais si le jury insiste, l\'étage fin est bayésien : l\'observation (proba ~0,1 % sous l\'hypothèse d\'équilibre) doit réviser la confiance dans la pièce elle-même — les deux erreurs symétriques étant la dépendance inventée (« la pièce est due ») et l\'indépendance défendue contre l\'évidence.',
      'Les probabilités s\'appliquent parfaitement : c\'est même le cas d\'école où elles distinguent le conditionnel (50 %) de la révision d\'hypothèse (la pièce est-elle équilibrée ?).',
    ],
    questionEn: 'A fair coin has just landed heads ten times in a row. The next flip?',
    optionsEn: [
      'Tails is "due": the law of large numbers must rebalance the streak',
      'Heads for sure: ten heads prove the coin is rigged',
      '50% if the coin is fair — no memory; but the Bayesian layer exists: ten heads only happen ~0.1% of the time, so a Bayesian mind starts revising its trust in the coin and would rather lean heads',
      'Impossible to say: after such a streak, probabilities no longer apply',
    ],
    explicationsEn: [
      'The gambler\'s fallacy verbatim: the law of large numbers DILUTES deviations over the long run, it never offsets them flip by flip — the coin has no memory.',
      'The opposite excess: ten heads happen to an honest coin once in 1,024 — rare, not impossible; concluding "for sure" replaces a probability with a certainty.',
      'The chapter\'s two-storey answer: conditional on a fair coin, 50% — independence. But if the panel pushes, the fine layer is Bayesian: the observation (~0.1% probability under the fairness hypothesis) should revise your trust in the coin itself — the two symmetric errors being invented dependence ("the coin is due") and independence defended against the evidence.',
      'Probabilities apply perfectly: this is the textbook case where they separate the conditional (50%) from hypothesis revision (is the coin fair?).',
    ],
  },

  // __SUITE__
];
