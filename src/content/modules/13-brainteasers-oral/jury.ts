import type { JuryQuestion } from '../../../engine/types';

const M13 = '13-brainteasers-oral';

export const jury: JuryQuestion[] = [
  {
    id: 'm13-j-01',
    moduleId: M13,
    theme: 'le calcul mental du desk',
    themeEn: 'desk mental arithmetic',
    difficulte: 1,
    question: 'Votre portefeuille rapporte 6 % par an : il double en combien de temps ?',
    questionEn: 'Your portfolio returns 6% a year: how long until it doubles?',
    plan: [
      'Reformuler en cinq secondes : composition annuelle à 6 %, on cherche le temps de doublement — et annoncer l\'outil : la règle de 72',
      'Calculer à voix haute : 72/6 = 12 ans, immédiat',
      'Annoncer l\'erreur sans attendre qu\'on la demande : la valeur exacte est ln 2/ln(1,06) = 11,895661 ans — la règle surestime d\'environ 0,9 % à ce niveau, indétectable à l\'oral',
      'Conclure en une phrase et se taire : « environ 12 ans — 11,9 si vous voulez la décimale »',
    ],
    planEn: [
      'Reformulate in five seconds: annual compounding at 6%, we want the doubling time — and name the tool: the rule of 72',
      'Compute out loud: 72/6 = 12 years, immediate',
      'Announce the error before being asked: the exact value is ln 2/ln(1.06) = 11.895661 years — the rule overstates by about 0.9% at this level, undetectable orally',
      'Close in one sentence and stop talking: "about 12 years — 11.9 if you want the decimal"',
    ],
    pointsAttendus: [
      'Le trois-temps du chapitre : annoncer l\'estimation, PUIS son erreur ou son domaine de validité, PUIS raffiner si le jury le demande — jamais la décimale d\'abord',
      'Le calcul sec : 72/6 = 12 ans, sans respiration — la règle de 72 est l\'outil de calcul mental le plus rentable de tout l\'entretien',
      'Le domaine de validité récité : quasi exacte vers 8 % (9 ans annoncés contre 9,006468 exacts, erreur −0,07 %), surestime aux taux bas (36 ans annoncés à 2 % contre 35,0 exacts), erreur jamais au-dessus de 3,5 % sur la plage 1-15 %',
      'Le pourquoi de 72 : la constante « exacte » serait 100 × ln 2 ≈ 69,3, mais 72 se divise par 2, 3, 4, 6, 8, 9 et 12 — le confort de division vaut le léger biais',
      'L\'erreur à écarter d\'un mot : 100/6 ≈ 17 ans supposerait des intérêts simples — c\'est la composition qui accélère le doublement',
    ],
    pointsAttendusEn: [
      'The chapter\'s three-step: announce the estimate, THEN its error or validity range, THEN refine only if the jury asks — never the decimal first',
      'The dry calculation: 72/6 = 12 years, without a breath — the rule of 72 is the highest-yielding mental tool of the whole interview',
      'The validity range recited: nearly exact around 8% (9 years announced against 9.006468 exact, a −0.07% error), overstates at low rates (36 years announced at 2% against 35.0 exact), error never above 3.5% over the 1-15% range',
      'The why of 72: the "exact" constant would be 100 × ln 2 ≈ 69.3, but 72 divides by 2, 3, 4, 6, 8, 9 and 12 — the division comfort is worth the slight bias',
      'The error to dismiss in one word: 100/6 ≈ 17 years would assume simple interest — compounding is what accelerates the doubling',
    ],
    bonus: [
      'Le pont avec le m10 : à 2 % d\'inflation, les prix doublent « tous les 35 ans environ » — la même règle lue côté pouvoir d\'achat',
      'La phrase qui montre qu\'on possède l\'outil ET sa limite : « la règle est calibrée vers 8 % ; à 6 %, elle surestime d\'un souffle — moins de 1 % »',
    ],
    bonusEn: [
      'The m10 bridge: at 2% inflation, prices double "roughly every 35 years" — the same rule read from the purchasing-power side',
      'The sentence that shows you own the tool AND its limit: "the rule is calibrated around 8%; at 6% it overstates by a whisker — under 1%"',
    ],
    reponseModele: `La performance attendue tient en trois temps, dix secondes. **Reformuler** d'abord : « 6 % composés chaque année, vous me demandez le temps de doublement ». **Annoncer** ensuite : « règle de 72 : 72/6 = **12 ans** ». **Borner** enfin, sans qu'on le demande : « la valeur exacte est ln 2/ln(1,06) = 11,9 ans — la règle surestime d'environ 0,9 % à ce niveau, indétectable à l'oral ». Puis se taire.

Pourquoi cette forme marque-t-elle ? Parce que le jury ne teste pas l'arithmétique — il teste le réflexe du desk : produire un chiffre utilisable *maintenant*, avec sa barre d'erreur. Le candidat qui connaît aussi le domaine de validité gagne le point suivant avant la question suivante : la règle est quasi exacte vers 8 % (9 ans annoncés contre 9,006468 exacts, erreur −0,07 %), elle surestime d'environ un an aux taux bas (36 contre 35,0 à 2 %), et ne dévie jamais de plus de 3,5 % entre 1 et 15 %. Et pourquoi 72 plutôt que 100 × ln 2 ≈ 69,3 ? Parce que 72 se divise par 2, 3, 4, 6, 8, 9 et 12 — l'outil est choisi pour la tête, pas pour la théorie.

L'erreur qui disqualifie : 100/6 ≈ 17 ans — des intérêts simples. Les intérêts se composent, et c'est précisément la composition qui raccourcit l'attente. Conclusion d'une ligne : « environ 12 ans — 11,9 si vous voulez la décimale ».`,
    reponseModeleEn: `The expected performance takes three steps, ten seconds. **Reformulate** first: "6% compounded annually, you are asking for the doubling time". **Announce** next: "rule of 72: 72/6 = **12 years**". **Bound** last, unprompted: "the exact value is ln 2/ln(1.06) = 11.9 years — the rule overstates by about 0.9% at this level, undetectable orally". Then stop talking.

Why does this form score? Because the jury is not testing arithmetic — it is testing the desk reflex: produce a usable number *now*, with its error bar. The candidate who also knows the validity range wins the next point before the next question: the rule is nearly exact around 8% (9 years announced against 9.006468 exact, a −0.07% error), it overstates by about a year at low rates (36 against 35.0 at 2%), and never drifts by more than 3.5% between 1 and 15%. And why 72 rather than 100 × ln 2 ≈ 69.3? Because 72 divides by 2, 3, 4, 6, 8, 9 and 12 — the tool is chosen for the head, not for the theory.

The disqualifying error: 100/6 ≈ 17 years — simple interest. Interest compounds, and compounding is precisely what shortens the wait. One-line close: "about 12 years — 11.9 if you want the decimal".`,
  },
  {
    id: 'm13-j-02',
    moduleId: M13,
    theme: 'le calcul mental du desk',
    themeEn: 'desk mental arithmetic',
    difficulte: 2,
    question: '17 × 24, de tête — et expliquez-moi comment vous faites.',
    questionEn: '17 × 24, in your head — and talk me through it.',
    plan: [
      'Borner d\'abord, à voix haute : entre 10 × 20 = 200 et 20 × 25 = 500 — trois secondes, plus aucune énormité possible',
      'Décomposer vers le voisin ami : 17 × 24 = 17 × 25 − 17 = 425 − 17 = 408 — ×25, c\'est ×100 puis ÷4',
      'Offrir le chemin de contrôle : 17 × 4 × 6 = 68 × 6 = 408 — deux routes, même résultat, le calcul est verrouillé',
      'Conclure : « 408, et il vit bien entre mes bornes » — puis se taire',
    ],
    planEn: [
      'Bound first, out loud: between 10 × 20 = 200 and 20 × 25 = 500 — three seconds, no absurdity possible anymore',
      'Decompose towards the friendly neighbour: 17 × 24 = 17 × 25 − 17 = 425 − 17 = 408 — ×25 is ×100 then ÷4',
      'Offer the control route: 17 × 4 × 6 = 68 × 6 = 408 — two roads, same result, the calculation is locked',
      'Close: "408, and it sits comfortably between my bounds" — then stop talking',
    ],
    pointsAttendus: [
      'L\'ordre des gestes : borner AVANT de calculer — l\'encadrement est l\'assurance anti-énormité, et le jury vérifie qu\'il vient en premier',
      'Le voisin ami verbalisé : 24 est à un pas de 25, et ×25 = ×100 ÷ 4 — d\'où 425, puis on rend les 17 de trop : 408',
      'La verbalisation continue : le jury n\'évalue que ce qu\'il entend — un calcul muet de dix secondes vaut moins qu\'un calcul parlé de quinze',
      'La conscience qu\'il n\'y a pas UN bon chemin : 17 × 25 − 17, ou 17 × 4 × 6, ou 17 × 20 + 17 × 4 = 340 + 68 — des briques (×25, ×4, doublements) qu\'on assemble',
      'Ce qui est réellement noté : la méthode, pas le résultat — personne ne recrute un trader pour battre une machine à calculer',
    ],
    pointsAttendusEn: [
      'The order of moves: bound BEFORE computing — the bracket is the anti-absurdity insurance, and the jury checks that it comes first',
      'The friendly neighbour verbalised: 24 is one step from 25, and ×25 = ×100 ÷ 4 — hence 425, then give back the 17 too many: 408',
      'Continuous verbalisation: the jury only grades what it hears — ten silent seconds are worth less than fifteen spoken ones',
      'The awareness that there is no ONE right road: 17 × 25 − 17, or 17 × 4 × 6, or 17 × 20 + 17 × 4 = 340 + 68 — bricks (×25, ×4, doublings) that you assemble',
      'What is actually graded: the method, not the result — nobody hires a trader to beat a calculator',
    ],
    bonus: [
      'Les identités voisines à dégainer si le jury enchaîne : près de 50, (50 ± a)² = 2 500 ± 100a + a² — 47² = 2 209 en trois secondes ; près de 100, 96² = 9 216',
      'La phrase de conclusion qui sonne desk : « 408 — et si je m\'étais trompé, mes bornes 200-500 m\'auraient arrêté avant vous »',
    ],
    bonusEn: [
      'The neighbouring identities to draw if the jury follows up: near 50, (50 ± a)² = 2,500 ± 100a + a² — 47² = 2,209 in three seconds; near 100, 96² = 9,216',
      'The closing sentence that sounds like a desk: "408 — and had I slipped, my 200-500 bounds would have caught me before you did"',
    ],
    reponseModele: `À voix haute, dans l'ordre. **Borner** : « avant de calculer, le résultat vit entre 10 × 20 = 200 et 20 × 25 = 500 ». Trois secondes, et plus aucune énormité ne peut sortir. **Décomposer** : « 24 est à un pas de 25, et multiplier par 25, c'est multiplier par 100 puis diviser par 4 : 17 × 25 = 425 ; je rends les 17 comptés en trop : 425 − 17 = **408** ». **Vérifier** par une autre route si le temps le permet : « 17 × 4 × 6 = 68 × 6 = 408 — deux chemins, même chiffre ». Conclure : « 408, bien entre mes bornes », et se taire.

Ce que cette forme donne à voir, c'est exactement ce que le jury est venu chercher : le réflexe d'encadrer avant de calculer (l'assurance anti-énormité du desk), le choix d'un voisin ami plutôt que la multiplication posée en colonnes — lente, muette, fragile —, et la parole continue, parce qu'un raisonnement inaudible n'existe pas pour un jury.

Le point souvent manqué : il n'y a pas UN bon chemin. 17 × 25 − 17, 17 × 4 × 6, ou 17 × 20 + 17 × 4 = 340 + 68 — des briques qu'on assemble selon le terrain. Le jury ne note pas 408 : il note que vous avez produit 408 *avec un filet*, en montrant chaque geste. C'est la différence entre savoir calculer et pouvoir se voir confier un book.`,
    reponseModeleEn: `Out loud, in order. **Bound**: "before computing, the result lives between 10 × 20 = 200 and 20 × 25 = 500". Three seconds, and no absurdity can escape anymore. **Decompose**: "24 is one step from 25, and multiplying by 25 is multiplying by 100 then dividing by 4: 17 × 25 = 425; I give back the 17 counted in excess: 425 − 17 = **408**". **Check** by another road if time allows: "17 × 4 × 6 = 68 × 6 = 408 — two roads, same number". Close: "408, comfortably between my bounds", and stop talking.

What this form displays is exactly what the jury came for: the reflex of bracketing before computing (the desk\'s anti-absurdity insurance), the choice of a friendly neighbour over the school-style column multiplication — slow, silent, brittle — and continuous speech, because an inaudible reasoning does not exist for a jury.

The often-missed point: there is no ONE right road. 17 × 25 − 17, or 17 × 4 × 6, or 17 × 20 + 17 × 4 = 340 + 68 — bricks assembled to fit the terrain. The jury does not grade 408: it grades that you produced 408 *with a safety net*, showing every move. That is the difference between knowing how to compute and being trusted with a book.`,
  },
  {
    id: 'm13-j-03',
    moduleId: M13,
    theme: 'le calcul mental du desk',
    themeEn: 'desk mental arithmetic',
    difficulte: 1,
    question: 'De tête, tout de suite : 8 % de 25 ?',
    questionEn: 'In your head, right now: 8% of 25?',
    plan: [
      'Retourner le calcul par commutativité : 8 % de 25 = 25 % de 8, puisque les deux s\'écrivent 8 × 25/100',
      'Lire le sens facile : 25 % = un quart, et le quart de 8 vaut 2',
      'Annoncer : « 2 » — puis justifier en une phrase : « j\'ai retourné le pourcentage dans le sens commode »',
      'Montrer que le réflexe est général : 4 % de 75 = 75 % de 4 = 3 ; 50 pb = 0,5 % sans temps de réflexion',
    ],
    planEn: [
      'Flip the calculation by commutativity: 8% of 25 = 25% of 8, since both read 8 × 25/100',
      'Read the easy direction: 25% = a quarter, and a quarter of 8 is 2',
      'Announce: "2" — then justify in one sentence: "I flipped the percentage into the convenient direction"',
      'Show the reflex is general: 4% of 75 = 75% of 4 = 3; 50 bp = 0.5% with no thinking time',
    ],
    pointsAttendus: [
      'La réponse immédiate : 2 — la question est un test de réflexe, pas de virtuosité, et l\'hésitation est la seule mauvaise réponse',
      'La justification en une phrase : x % de y = y % de x, toujours, car les deux valent x × y/100 — la commutativité de la multiplication',
      'Le sens de lecture : « 8 % de 25 » demande une multiplication décimale hostile ; « 25 % de 8 » demande le quart de 8 — retourner systématiquement vers la fraction simple (25 % = quart, 50 % = moitié, 10 % = dixième)',
      'La famille de réflexes voisins : 4 % de 75 = 3 ; diviser par 0,8 = multiplier par 1,25 ; 100 pb = 1 %',
      'La brièveté : réponse, justification, silence — ne pas transformer un test de trois secondes en exposé de trois minutes',
    ],
    pointsAttendusEn: [
      'The immediate answer: 2 — the question tests a reflex, not virtuosity, and hesitation is the only wrong answer',
      'The one-sentence justification: x% of y = y% of x, always, since both equal x × y/100 — the commutativity of multiplication',
      'The reading direction: "8% of 25" asks for a hostile decimal multiplication; "25% of 8" asks for a quarter of 8 — always flip towards the simple fraction (25% = quarter, 50% = half, 10% = tenth)',
      'The family of neighbouring reflexes: 4% of 75 = 3; dividing by 0.8 = multiplying by 1.25; 100 bp = 1%',
      'Brevity: answer, justification, silence — do not turn a three-second test into a three-minute lecture',
    ],
    bonus: [
      'La version desk du même retournement : retrouver un notionnel avant une décote de 20 % — 100/0,8 = 125, parce que 1/0,8 = 5/4',
      'Le mot qui montre la structure : « c\'est le même nombre écrit dans deux ordres — x·y/100 — je choisis l\'ordre qui parle »',
    ],
    bonusEn: [
      'The desk version of the same flip: recovering a notional before a 20% haircut — 100/0.8 = 125, because 1/0.8 = 5/4',
      'The word that shows the structure: "it is the same number written in two orders — x·y/100 — I pick the order that speaks"',
    ],
    reponseModele: `« **2**. » D'abord le chiffre — la question est un chronomètre déguisé, et toute hésitation est la vraie erreur. Puis la justification, une phrase : « x % de y vaut toujours y % de x, puisque les deux s'écrivent x × y/100 ; j'ai donc retourné : 8 % de 25 = 25 % de 8 = le quart de 8 = 2. »

Le piège de la question est purement psychologique : « 8 % de 25 » déclenche chez la plupart des candidats une multiplication décimale hostile — 25 × 0,08, avec sa virgule à placer sous pression. Le même nombre lu dans l'autre sens — « 25 % de 8 » — ne fige personne : un quart de 8. Le réflexe à installer est donc systématique : retourner tout pourcentage vers le sens où l'un des deux nombres devient une fraction amicale — 25 % un quart, 50 % une moitié, 10 % un dixième. Même famille : 4 % de 75 = 75 % de 4 = 3.

Si le jury laisse une seconde de plus, montrer que la brique s'insère dans un jeu complet : 100 pb = 1 % sans respirer, diviser par 0,8 = multiplier par 1,25 — retrouver un notionnel avant décote de 20 % devient 100 × 5/4 = 125. Et se taire : la réponse tenait en un mot, la justification en une phrase — tout ajout au-delà rend des points.`,
    reponseModeleEn: `"**2**." The number first — the question is a stopwatch in disguise, and any hesitation is the real mistake. Then the justification, one sentence: "x% of y always equals y% of x, since both read x × y/100; so I flipped: 8% of 25 = 25% of 8 = a quarter of 8 = 2."

The trap is purely psychological: "8% of 25" triggers a hostile decimal multiplication in most candidates — 25 × 0.08, with a decimal point to place under pressure. The same number read the other way — "25% of 8" — freezes nobody: a quarter of 8. The reflex to install is systematic: flip every percentage towards the direction where one of the two numbers becomes a friendly fraction — 25% a quarter, 50% a half, 10% a tenth. Same family: 4% of 75 = 75% of 4 = 3.

If the jury leaves one more second, show that the brick belongs to a full kit: 100 bp = 1% without breathing, dividing by 0.8 = multiplying by 1.25 — recovering a notional before a 20% haircut becomes 100 × 5/4 = 125. And stop talking: the answer took one word, the justification one sentence — anything beyond gives points back.`,
  },
  {
    id: 'm13-j-04',
    moduleId: M13,
    theme: 'le calcul mental du desk',
    themeEn: 'desk mental arithmetic',
    difficulte: 2,
    question: 'Un actif fait +10 % puis −10 %. Où en êtes-vous ?',
    questionEn: 'An asset gains 10%, then loses 10%. Where do you stand?',
    plan: [
      'Refuser le zéro instinctif : les variations successives se multiplient, elles ne s\'additionnent pas',
      'Calculer : 1,1 × 0,9 = 0,99 — vous avez perdu 1 %',
      'Généraliser : ±x % en aller-retour laisse 1 − x², toujours SOUS le point de départ — et l\'ordre des deux jambes ne change rien',
      'Pousser à l\'extrême pour montrer l\'enjeu : après −50 %, il faut +100 % pour revenir ; après le −78 % du Nasdaq, +354,5 % et quinze ans',
    ],
    planEn: [
      'Refuse the instinctive zero: successive returns multiply, they do not add',
      'Compute: 1.1 × 0.9 = 0.99 — you have lost 1%',
      'Generalise: a ±x% round trip leaves 1 − x², always BELOW the start — and the order of the two legs changes nothing',
      'Push to the extreme to show the stakes: after −50%, you need +100% to get back; after the Nasdaq\'s −78%, +354.5% and fifteen years',
    ],
    pointsAttendus: [
      'Le chiffre net : 1,1 × 0,9 = 0,99, soit −1 % — pas zéro',
      'La raison structurelle : les rendements se composent — le −10 % s\'applique à une base plus haute que le +10 %, donc il détruit plus qu\'il n\'a été construit',
      'La symétrie de l\'ordre : −10 % puis +10 % donne le même 0,99 — la multiplication commute, l\'asymétrie n\'est pas une question d\'ordre mais de composition',
      'La forme générale : (1 + x)(1 − x) = 1 − x² — l\'aller-retour coûte toujours x², le « frottement de volatilité »',
      'L\'extrapolation qui montre l\'enjeu : après −50 %, il faut +100 % ; la récupération croît beaucoup plus vite que la perte',
    ],
    pointsAttendusEn: [
      'The clean number: 1.1 × 0.9 = 0.99, i.e. −1% — not zero',
      'The structural reason: returns compound — the −10% applies to a higher base than the +10%, so it destroys more than was built',
      'The order symmetry: −10% then +10% gives the same 0.99 — multiplication commutes; the asymmetry is not about order but about compounding',
      'The general form: (1 + x)(1 − x) = 1 − x² — the round trip always costs x², the "volatility drag"',
      'The extrapolation that shows the stakes: after −50%, you need +100%; the required recovery grows much faster than the loss',
    ],
    bonus: [
      'La version log qui remet tout droit : les log-rendements, eux, s\'additionnent — ln(1,1) + ln(0,9) = −1,005 % ≈ −x² pour x petit',
      'Le pont m11 : après le −78 % du Nasdaq en 2000-2002, il fallait +354,5 % — quinze ans d\'attente ; l\'asymétrie des rendements composés est une leçon de survie, pas une curiosité',
    ],
    bonusEn: [
      'The log version that straightens everything: log returns do add — ln(1.1) + ln(0.9) = −1.005% ≈ −x² for small x',
      'The m11 bridge: after the Nasdaq\'s −78% in 2000-2002, it took +354.5% — a fifteen-year wait; the asymmetry of compounded returns is a survival lesson, not a curiosity',
    ],
    reponseModele: `« En dessous de mon point de départ : **−1 %**. » Le chiffre d'abord, puis la mécanique : les variations successives se *multiplient* — 1,1 × 0,9 = **0,99**. Le zéro instinctif vient de l'addition (+10 − 10 = 0), et l'addition est le mauvais outil : le −10 % s'applique à une base de 110, plus haute que celle sur laquelle le +10 % avait construit — il détruit donc 11 quand la hausse n'avait apporté que 10.

Puis la forme générale, une ligne : (1 + x)(1 − x) = 1 − x². Tout aller-retour de ±x % coûte x², quel que soit l'ordre des jambes — −10 % puis +10 % rend exactement le même 0,99, car la multiplication commute. C'est le « frottement » que la volatilité inflige à un capital, même quand la moyenne des variations est nulle.

Et l'extrapolation qui montre que ce n'est pas une coquetterie : à ±10 %, on perd 1 % ; à ±50 %, on perd 25 % — et après un −50 % sec, il faut **+100 %** pour revenir. Le module 11 l'a payé en vraie monnaie : après le −78 % du Nasdaq, +354,5 % et quinze ans d'attente. Conclusion d'une phrase : « les rendements se composent — c'est pour ça qu'on protège le capital avant de chercher la performance ». Et se taire.`,
    reponseModeleEn: `"Below my starting point: **−1%**." The number first, then the mechanics: successive returns *multiply* — 1.1 × 0.9 = **0.99**. The instinctive zero comes from addition (+10 − 10 = 0), and addition is the wrong tool: the −10% applies to a base of 110, higher than the one the +10% built on — so it destroys 11 where the rise had only added 10.

Then the general form, one line: (1 + x)(1 − x) = 1 − x². Any ±x% round trip costs x², whatever the order of the legs — −10% then +10% returns exactly the same 0.99, since multiplication commutes. This is the "drag" volatility inflicts on capital even when the average move is zero.

And the extrapolation that shows it is no nicety: at ±10% you lose 1%; at ±50% you lose 25% — and after a clean −50%, you need **+100%** to get back. Module 11 paid for this in real money: after the Nasdaq\'s −78%, it took +354.5% and a fifteen-year wait. One-sentence close: "returns compound — which is why you protect the capital before chasing the performance". And stop talking.`,
  },
  {
    id: 'm13-j-05',
    moduleId: M13,
    theme: 'les estimations de Fermi',
    themeEn: 'Fermi estimates',
    difficulte: 2,
    question: 'Combien y a-t-il d\'accordeurs de pianos à Paris ?',
    questionEn: 'How many piano tuners are there in Paris?',
    plan: [
      'Reformuler et fixer la cible : un nombre de professionnels — attendre des dizaines, pas des milliers',
      'Décomposer : population → foyers → taux d\'équipement → accords par an, puis diviser par la charge annuelle d\'un accordeur',
      'Encadrer chaque facteur par des bornes sûres et prendre la moyenne GÉOMÉTRIQUE : équipement entre 1 et 10 %, √(1 × 10) ≈ 3 %',
      'Annoncer avec l\'incertitude : « une trentaine, à un facteur 2 ou 3 près » — et se taire',
    ],
    planEn: [
      'Reformulate and set the target: a number of professionals — expect tens, not thousands',
      'Decompose: population → households → ownership rate → tunings per year, then divide by one tuner\'s annual workload',
      'Bracket each factor with safe bounds and take the GEOMETRIC mean: ownership between 1 and 10%, √(1 × 10) ≈ 3%',
      'Announce with the uncertainty: "around thirty, to within a factor of 2 or 3" — and stop talking',
    ],
    pointsAttendus: [
      'La chaîne complète, chaque borne assumée à voix haute : Paris ~2 millions d\'habitants → ~1 million de foyers à 2 personnes par foyer',
      'Le taux d\'équipement par moyenne géométrique : sûrement plus de 1 %, sûrement moins de 10 % — √(1 × 10) ≈ 3 %, soit 30 000 pianos',
      'La fréquence et la charge : un accord par an et par piano → 30 000 accords à servir ; ~2 heures par accord déplacement compris, 4 par jour, 250 jours → ~1 000 accords par an et par accordeur',
      'La division finale : 30 000/1 000 = 30 — annoncé comme un ordre de grandeur (« quelques dizaines »), jamais comme un chiffre exact',
      'Le méta-message : aucun des facteurs n\'exigeait de connaître les pianos — six estimations médiocres mais bornées battent une devinette héroïque, car les erreurs se compensent partiellement',
      'La faute inverse à éviter : la fausse précision — « 34 accordeurs » est un aveu qu\'on n\'a pas compris ce que la méthode peut livrer',
    ],
    pointsAttendusEn: [
      'The full chain, every bound owned out loud: Paris ~2 million inhabitants → ~1 million households at 2 people per household',
      'The ownership rate by geometric mean: surely above 1%, surely below 10% — √(1 × 10) ≈ 3%, i.e. 30,000 pianos',
      'Frequency and workload: one tuning per piano per year → 30,000 tunings to serve; ~2 hours per tuning travel included, 4 a day, 250 days → ~1,000 tunings per year per tuner',
      'The final division: 30,000/1,000 = 30 — announced as an order of magnitude ("a few dozen"), never as an exact figure',
      'The meta-message: none of the factors required knowing anything about pianos — six mediocre but bounded estimates beat one heroic guess, because the errors partially cancel',
      'The opposite fault to avoid: false precision — "34 tuners" is an admission that you did not understand what the method can deliver',
    ],
    bonus: [
      'La correction en route qui marque : « j\'oublie les conservatoires et les studios — peut-être +20 %, l\'ordre de grandeur tient » — l\'erreur absorbée à voix haute est un point gagné',
      'La justification du milieu géométrique : l\'incertitude d\'ordre de grandeur est multiplicative — en log, elle devient symétrique, et la moyenne arithmétique des logs EST la moyenne géométrique',
    ],
    bonusEn: [
      'The in-flight correction that scores: "I am forgetting conservatories and studios — maybe +20%, the order of magnitude holds" — an error absorbed out loud is a point won',
      'The justification of the geometric middle: order-of-magnitude uncertainty is multiplicative — in log space it becomes symmetric, and the arithmetic mean of the logs IS the geometric mean',
    ],
    reponseModele: `« Je cherche un nombre de professionnels — je m'attends à des dizaines. Je décompose : population × équipement × fréquence, divisé par la charge d'un accordeur. » Puis la chaîne, chaque borne annoncée : Paris intra-muros, **~2 millions** d'habitants ; à 2 personnes par foyer, **~1 million de foyers**. Quelle part a un piano ? « Sûrement plus de 1 %, sûrement moins de 10 % — je prends le milieu **géométrique**, √(1 × 10) ≈ 3 % » : **30 000 pianos**. Un piano entretenu s'accorde environ une fois par an : 30 000 accords à servir. Côté offre : ~2 heures par accord, déplacement compris, soit 4 par jour, 250 jours ouvrés — **~1 000 accords par an** et par professionnel. Division finale : 30 000/1 000 = **30**.

L'annonce, calibrée : « quelques dizaines — disons 30, à un facteur 2 ou 3 près ». Pas « 34 » : chaque décimale au-delà de l'ordre de grandeur avouerait que la méthode m'échappe. Et si je repère un trou en route — les conservatoires, les studios — je le dis : « peut-être +20 %, l'ordre tient ».

Ce que le jury note : aucun facteur n'exigeait de connaître les pianos — chacun se laissait encadrer par du bon sens, et les erreurs se compensent partiellement en chemin. La structure vaut plus que le résultat : six bornes assumées battent une devinette héroïque.`,
    reponseModeleEn: `"I am looking for a number of professionals — I expect tens. I decompose: population × ownership × frequency, divided by one tuner\'s workload." Then the chain, every bound announced: Paris proper, **~2 million** inhabitants; at 2 people per household, **~1 million households**. What share owns a piano? "Surely above 1%, surely below 10% — I take the **geometric** middle, √(1 × 10) ≈ 3%": **30,000 pianos**. A maintained piano gets tuned about once a year: 30,000 tunings to serve. Supply side: ~2 hours per tuning, travel included, so 4 a day over 250 working days — **~1,000 tunings a year** per professional. Final division: 30,000/1,000 = **30**.

The announcement, calibrated: "a few dozen — say 30, to within a factor of 2 or 3". Not "34": every decimal beyond the order of magnitude would confess that the method escapes me. And if I spot a hole on the way — conservatories, studios — I say it: "maybe +20%, the order holds".

What the jury grades: no factor required knowing anything about pianos — each could be bracketed by common sense, and the errors partially cancel along the way. Structure beats result: six owned bounds beat one heroic guess.`,
  },
  {
    id: 'm13-j-06',
    moduleId: M13,
    theme: 'les estimations de Fermi',
    themeEn: 'Fermi estimates',
    difficulte: 3,
    question: 'Quel est le volume quotidien du marché des changes ? Ne me récitez pas le chiffre : reconstruisez-le.',
    questionEn: 'What is the daily volume of the FX market? Do not recite the figure: rebuild it.',
    plan: [
      'Partir du réel : le commerce mondial de biens et services, ~30 000 Md$ par an — sur 250 jours ouvrés, ~120 Md$ par jour de flux qui exigent du change',
      'Poser le facteur financier : couvertures roulées, spéculation, trésorerie, et surtout l\'intermédiation entre teneurs de marché — un même risque change plusieurs fois de mains',
      'Encadrer ce multiplicateur : sûrement plus de 20, sûrement moins de 200 — moyenne géométrique √(20 × 200) ≈ 63',
      'Multiplier et valider : 120 × 63 ≈ 7 500 Md$ par jour — l\'ordre de grandeur de l\'enquête BRI 2022, retrouvé en trois lignes',
    ],
    planEn: [
      'Start from the real economy: world trade in goods and services, ~30,000bn$ a year — over 250 working days, ~120bn$ a day of flows that require FX',
      'State the financial factor: rolled hedges, speculation, treasury management, and above all inter-dealer intermediation — the same risk changes hands several times',
      'Bracket that multiplier: surely above 20, surely below 200 — geometric mean √(20 × 200) ≈ 63',
      'Multiply and validate: 120 × 63 ≈ 7,500bn$ a day — the order of magnitude of the 2022 BIS survey, rebuilt in three lines',
    ],
    pointsAttendus: [
      'La distinction fondatrice : flux réels contre flux financiers — le commerce mondial ne fait que ~120 Md$ par jour, une goutte du volume total',
      'Le point de départ chiffré et daté : ~30 000 Md$ de commerce mondial par an ÷ 250 jours ouvrés ≈ 120 Md$ par jour',
      'Le multiplicateur expliqué avant d\'être chiffré : chaque flux réel déclenche couvertures, spéculation, gestion de trésorerie et intermédiation entre dealers — la patate chaude qui gonfle les volumes',
      'Les bornes assumées et le bon milieu : entre 20 et 200, géométrique √4 000 ≈ 63 — jamais la moyenne arithmétique sur des ordres de grandeur',
      'L\'atterrissage validé par l\'ancre : ~7 500 Md$ par jour, l\'enquête BRI 2022 — l\'ancre du m6 sert de garde-fou, pas de récitation',
      'L\'honnêteté qui désarme : reconnaître que les bornes ont été choisies en connaissant l\'arrivée — et que c\'est précisément le rôle des ancres : vérifier la chaîne, signaler le facteur perdu avant le jury',
    ],
    pointsAttendusEn: [
      'The founding distinction: real flows versus financial flows — world trade only makes ~120bn$ a day, a drop in the total volume',
      'The dated, numbered starting point: ~30,000bn$ of world trade a year ÷ 250 working days ≈ 120bn$ a day',
      'The multiplier explained before being numbered: each real flow triggers hedges, speculation, treasury management and inter-dealer intermediation — the hot potato that inflates volumes',
      'Owned bounds and the right middle: between 20 and 200, geometric √4,000 ≈ 63 — never the arithmetic mean on orders of magnitude',
      'The landing validated by the anchor: ~7,500bn$ a day, the 2022 BIS survey — the m6 anchor is a guardrail, not a recitation',
      'The disarming honesty: admitting the bounds were chosen knowing the destination — and that this is precisely what anchors are for: checking the chain, flagging the lost factor before the jury does',
    ],
    bonus: [
      'Le test de cohérence à verbaliser : si la chaîne était sortie à 500 ou à 80 000 Md$, l\'ancre aurait signalé un facteur perdu — l\'erreur détectée par vous vaut des points, la même détectée par le jury en coûte le double',
      'La phrase d\'annonce complète : « environ 7 500 milliards de dollars par jour — retenez l\'ordre de grandeur : plus de cinquante fois les flux du commerce mondial »',
    ],
    bonusEn: [
      'The consistency check to verbalise: had the chain landed at 500 or 80,000bn$, the anchor would have flagged a lost factor — an error you catch scores points, the same error caught by the jury costs double',
      'The full announcement sentence: "about 7,500 billion dollars a day — keep the order of magnitude: more than fifty times world trade flows"',
    ],
    reponseModele: `« Je reconstruis en deux étages : les flux réels, puis le multiplicateur financier. » **Étage réel** : le commerce mondial de biens et services pèse environ **30 000 Md$ par an** ; sur ~250 jours ouvrés, cela fait **~120 Md$ par jour** de flux qui exigent réellement une conversion. **Étage financier** : chaque flux réel déclenche bien plus que sa propre conversion — des couvertures qui se roulent, de la spéculation, de la gestion de trésorerie, et surtout l'intermédiation entre teneurs de marché, où un même risque change plusieurs fois de mains avant de trouver preneur final. Ce multiplicateur, je l'encadre : « sûrement plus de 20, sûrement moins de 200 — milieu **géométrique**, √(20 × 200) ≈ 63 ». Produit : 120 × 63 ≈ **7 500 Md$ par jour**.

Validation par l'ancre du cours : c'est l'ordre de grandeur de l'enquête **BRI 2022**. Et l'honnêteté qui fait la différence : « mes bornes ont été choisies par quelqu'un qui connaissait l'arrivée — c'est exactement le rôle des ancres : si ma chaîne était sortie à 500 ou à 80 000, l'ancre m'aurait signalé le facteur perdu avant vous. »

Conclusion d'une ligne : « environ 7 500 milliards par jour — plus de cinquante fois les flux du commerce mondial : le marché des changes est un marché financier qui héberge accessoirement du commerce, pas l'inverse. »`,
    reponseModeleEn: `"I rebuild in two storeys: real flows, then the financial multiplier." **Real storey**: world trade in goods and services weighs about **30,000bn$ a year**; over ~250 working days, that is **~120bn$ a day** of flows that genuinely require conversion. **Financial storey**: each real flow triggers far more than its own conversion — hedges being rolled, speculation, treasury management, and above all inter-dealer intermediation, where the same risk changes hands several times before finding its final taker. I bracket that multiplier: "surely above 20, surely below 200 — **geometric** middle, √(20 × 200) ≈ 63". Product: 120 × 63 ≈ **7,500bn$ a day**.

Validation against the course anchor: that is the order of magnitude of the **2022 BIS survey**. And the honesty that makes the difference: "my bounds were chosen by someone who knew the destination — which is exactly what anchors are for: had my chain landed at 500 or 80,000, the anchor would have flagged the lost factor before you did."

One-line close: "about 7,500 billion a day — more than fifty times world trade flows: FX is a financial market that incidentally hosts trade, not the other way round."`,
  },
  {
    id: 'm13-j-07',
    moduleId: M13,
    theme: 'les estimations de Fermi',
    themeEn: 'Fermi estimates',
    difficulte: 2,
    question: 'Combien de balles de ping-pong tiennent dans un Airbus A320 ?',
    questionEn: 'How many ping-pong balls fit inside an Airbus A320?',
    plan: [
      'Fixer l\'unité et la cible : un volume divisé par un volume — attendre des millions',
      'Estimer la cabine : ~30 m de long, section utile ~7 m², soit ~200 m³',
      'Estimer la balle : 4 cm de diamètre ⇒ (4/3)π × 2³ ≈ 33,5 cm³ — et NE PAS oublier le taux de remplissage : des sphères en vrac ne remplissent que ~60 % du volume',
      'Conclure : ~18 000 balles par m³, × 200 m³ ≈ 3,6 millions — annonce : « quelques millions »',
    ],
    planEn: [
      'Set the unit and the target: a volume divided by a volume — expect millions',
      'Estimate the cabin: ~30 m long, ~7 m² of usable cross-section, i.e. ~200 m³',
      'Estimate the ball: 4 cm diameter ⇒ (4/3)π × 2³ ≈ 33.5 cm³ — and do NOT forget the packing rate: loose spheres only fill ~60% of the volume',
      'Conclude: ~18,000 balls per m³, × 200 m³ ≈ 3.6 million — announcement: "a few million"',
    ],
    pointsAttendus: [
      'Le squelette en trente secondes : volume de cabine ÷ volume utile d\'une balle — c\'est l\'exemple express, il se déroule vite ou pas du tout',
      'La cabine bornée proprement : ~30 m × ~7 m² ≈ 200 m³ — des bornes de bon sens, pas des specs d\'ingénieur',
      'La balle calculée, pas devinée : diamètre 4 cm, rayon 2 cm, (4/3)π × 8 ≈ 33,5 cm³',
      'LE facteur que tout le monde oublie : le taux de remplissage — des sphères en vrac n\'occupent que ~60 % de l\'espace ; sans lui, l\'estimation gonfle de deux tiers, et le jury qui pose la question dix fois par saison le voit immédiatement',
      'Le calcul final tenu en unités : 0,6/0,0000335 ≈ 18 000 balles par m³ ; × 200 ≈ 3,6 millions — annoncé « quelques millions », sans fausse précision',
    ],
    pointsAttendusEn: [
      'The thirty-second skeleton: cabin volume ÷ useful volume of one ball — this is the express classic, it unrolls fast or not at all',
      'The cabin bracketed cleanly: ~30 m × ~7 m² ≈ 200 m³ — common-sense bounds, not engineering specs',
      'The ball computed, not guessed: 4 cm diameter, 2 cm radius, (4/3)π × 8 ≈ 33.5 cm³',
      'THE factor everyone forgets: the packing rate — loose spheres only occupy ~60% of space; without it the estimate inflates by two thirds, and a jury that asks this ten times a season spots it instantly',
      'The final calculation held in units: 0.6/0.0000335 ≈ 18,000 balls per m³; × 200 ≈ 3.6 million — announced as "a few million", no false precision',
    ],
    bonus: [
      'La variante qui teste la souplesse : « et les sièges ? » — les retirer ou pas change le volume utile de ~20 %, l\'ordre de grandeur tient ; le dire calmement absorbe la relance',
      'Le garde-fou d\'unités : garder tout en m³ ou tout en cm³ — l\'erreur d\'un facteur 10⁶ vient toujours d\'unités croisées, et se détecte en bornant (« des millions, pas des milliards »)',
    ],
    bonusEn: [
      'The flexibility-testing variant: "what about the seats?" — removing them or not changes the usable volume by ~20%, the order of magnitude holds; saying so calmly absorbs the follow-up',
      'The unit guardrail: keep everything in m³ or everything in cm³ — factor-10⁶ errors always come from crossed units, and are caught by bounding ("millions, not billions")',
    ],
    reponseModele: `« Un volume divisé par un volume — je m'attends à des millions. » Puis les trois briques, à voix haute. **La cabine** : ~30 m de long, section utile ~7 m² — « je suis sûr que c'est entre 150 et 250 m³ » : **~200 m³**. **La balle** : 4 cm de diamètre, rayon 2 cm, (4/3)π × 2³ ≈ **33,5 cm³**. **Le facteur que tout le monde oublie** : des sphères en vrac ne remplissent pas l'espace — le taux de remplissage est d'environ **60 %**. Un mètre cube contient donc 0,6/0,0000335 ≈ **18 000 balles**, et la cabine : 200 × 18 000 ≈ **3,6 millions**.

L'annonce : « **quelques millions** — 3 ou 4, à un facteur 2 près ». Pas « 3 581 000 » : la fausse précision est un aveu.

Deux points font la différence sur cette question précise. D'abord le taux de remplissage : sans lui, l'estimation gonfle de deux tiers, et un jury qui pose la question dix fois par saison le remarque immédiatement — c'est SON critère de tri. Ensuite la discipline d'unités : tout en cm³ ou tout en m³, jamais les deux — les erreurs d'un facteur million viennent toujours d'unités croisées, et ma borne d'entrée (« des millions, pas des milliards ») est le filet qui les attrape. Si le jury relance sur les sièges : « ~20 % de volume en moins, l'ordre tient. »`,
    reponseModeleEn: `"A volume divided by a volume — I expect millions." Then the three bricks, out loud. **The cabin**: ~30 m long, ~7 m² of usable cross-section — "I am sure it is between 150 and 250 m³": **~200 m³**. **The ball**: 4 cm diameter, 2 cm radius, (4/3)π × 2³ ≈ **33.5 cm³**. **The factor everyone forgets**: loose spheres do not fill space — the packing rate is about **60%**. One cubic metre therefore holds 0.6/0.0000335 ≈ **18,000 balls**, and the cabin: 200 × 18,000 ≈ **3.6 million**.

The announcement: "**a few million** — 3 or 4, to within a factor of 2". Not "3,581,000": false precision is a confession.

Two points make the difference on this specific question. First the packing rate: without it the estimate inflates by two thirds, and a jury that asks this ten times a season notices instantly — it is THEIR sorting criterion. Second, unit discipline: everything in cm³ or everything in m³, never both — factor-of-a-million errors always come from crossed units, and my entry bound ("millions, not billions") is the net that catches them. If the jury pushes on the seats: "~20% less volume, the order holds."`,
  },
  {
    id: 'm13-j-08',
    moduleId: M13,
    theme: 'les probabilités d\'entretien',
    themeEn: 'interview probabilities',
    difficulte: 2,
    question: 'J\'ai deux enfants, dont au moins un garçon. Quelle est la probabilité que les deux soient des garçons ?',
    questionEn: 'I have two children, at least one of whom is a boy. What is the probability that both are boys?',
    plan: [
      'Refuser le ½ instinctif et poser l\'espace des cas : deux enfants donnent quatre configurations équiprobables — GG, GF, FG, FF',
      'Conditionner : « au moins un garçon » élimine FF — il reste trois cas équiprobables : GG, GF, FG',
      'Compter : un seul favorable sur trois — la réponse est 1/3',
      'Montrer la sensibilité à la formulation : « l\'aîné est un garçon » élimine FF ET FG — il reste GG et GF, et la réponse devient ½',
    ],
    planEn: [
      'Refuse the instinctive ½ and lay out the case space: two children give four equally likely configurations — BB, BG, GB, GG',
      'Condition: "at least one boy" removes GG (two girls) — three equally likely cases remain: BB, BG, GB',
      'Count: one favourable out of three — the answer is 1/3',
      'Show the sensitivity to wording: "the eldest is a boy" removes two cases — BB and BG remain, and the answer becomes ½',
    ],
    pointsAttendus: [
      'Le geste fondateur : ÉCRIRE l\'espace des cas avant de répondre — GG, GF, FG, FF, quatre configurations équiprobables en distinguant l\'ordre (aîné, cadet)',
      'Le conditionnement propre : l\'information « au moins un garçon » ne désigne aucun enfant — elle retire seulement FF de l\'univers, laissant trois cas',
      'Le décompte : GG est un cas sur trois — 1/3, pas ½',
      'Le diagnostic du piège : répondre ½, c\'est confondre « au moins un garçon » avec « cet enfant-ci est un garçon » — une information qui désigne change l\'espace',
      'La variante témoin à offrir : « l\'aîné est un garçon » → il reste GG et GF → ½ ; la MÊME famille, deux informations différentes, deux réponses différentes',
      'La leçon générale d\'oral : en probabilités conditionnelles, la formulation exacte de l\'information EST la donnée — la paraphraser, c\'est déjà se tromper',
    ],
    pointsAttendusEn: [
      'The founding move: WRITE the case space before answering — BB, BG, GB, GG, four equally likely configurations, distinguishing order (elder, younger)',
      'The clean conditioning: the information "at least one boy" designates no particular child — it only removes the two-girls case from the universe, leaving three',
      'The count: BB is one case out of three — 1/3, not ½',
      'The trap diagnosis: answering ½ confuses "at least one boy" with "this particular child is a boy" — information that designates changes the space',
      'The witness variant to offer: "the eldest is a boy" → BB and BG remain → ½; the SAME family, two different pieces of information, two different answers',
      'The general oral lesson: in conditional probability, the exact wording of the information IS the data — paraphrasing it is already getting it wrong',
    ],
    bonus: [
      'La version rencontre : « je croise le père avec un garçon » — l\'enfant est désigné, la réponse redevient ½ ; qui est désigné décide de tout',
      'La variante culte en survol : « au moins un garçon né un mardi » donne 13/27 — l\'information la plus anodine déforme l\'espace des cas ; la citer montre qu\'on a compris le mécanisme, pas mémorisé une réponse',
    ],
    bonusEn: [
      'The street version: "I meet the father with a boy" — the child is designated, the answer returns to ½; who is designated decides everything',
      'The cult variant in passing: "at least one boy born on a Tuesday" gives 13/27 — the most innocuous information distorts the case space; citing it shows you understood the mechanism rather than memorised an answer',
    ],
    reponseModele: `« Je pose l'espace des cas avant de répondre. » Deux enfants, en distinguant l'aîné du cadet : **GG, GF, FG, FF** — quatre configurations équiprobables. L'information « au moins un garçon » ne désigne aucun enfant en particulier : elle retire seulement FF de l'univers. Restent trois cas équiprobables — GG, GF, FG — dont un seul favorable. Réponse : **1/3**.

Puis nommer le piège, car c'est lui que le jury teste : le ½ instinctif vient d'une paraphrase — on lit « au moins un garçon » comme « cet enfant-ci est un garçon ». Or une information qui *désigne* un enfant change l'espace : « l'aîné est un garçon » élimine FF *et* FG, il reste GG et GF, et la réponse devient **½**. Même famille, deux formulations, deux réponses — en probabilités conditionnelles, la formulation exacte de l'information EST la donnée.

Si le jury creuse, offrir la version rencontre : « je croise le père avec un garçon » — l'enfant est désigné par la rencontre, on retombe sur ½. Et en une phrase, la variante culte : « au moins un garçon né un mardi » donne 13/27 — preuve que l'information la plus anodine déforme l'espace des cas. Conclusion : « 1/3 — et la réponse changerait si votre phrase désignait un enfant. » Se taire.`,
    reponseModeleEn: `"I lay out the case space before answering." Two children, distinguishing elder from younger: **BB, BG, GB, GG** — four equally likely configurations. The information "at least one boy" designates no particular child: it only removes the two-girls case from the universe. Three equally likely cases remain — BB, BG, GB — of which one is favourable. Answer: **1/3**.

Then name the trap, because that is what the jury is testing: the instinctive ½ comes from a paraphrase — reading "at least one boy" as "this particular child is a boy". Yet information that *designates* a child changes the space: "the eldest is a boy" removes two cases, BB and BG remain, and the answer becomes **½**. Same family, two wordings, two answers — in conditional probability, the exact wording of the information IS the data.

If the jury digs, offer the street version: "I meet the father with a boy" — the child is designated by the encounter, and we are back to ½. And in one sentence, the cult variant: "at least one boy born on a Tuesday" gives 13/27 — proof that the most innocuous information distorts the case space. Close: "1/3 — and the answer would change if your sentence designated a child." Stop talking.`,
  },
  {
    id: 'm13-j-09',
    moduleId: M13,
    theme: 'les probabilités d\'entretien',
    themeEn: 'interview probabilities',
    difficulte: 2,
    question: 'Combien faut-il de personnes dans une salle pour que deux d\'entre elles partagent un anniversaire avec au moins 50 % de chances ?',
    questionEn: 'How many people must be in a room for two of them to share a birthday with at least 50% probability?',
    plan: [
      'Donner le chiffre net d\'abord : 23 — la probabilité exacte vaut 50,729723 %',
      'Expliquer pourquoi l\'intuition rate d\'un facteur huit : elle compte les personnes (23) quand les collisions se produisent entre PAIRES — C(23, 2) = 253 occasions de coïncidence',
      'Montrer le calcul propre, par le complémentaire : P(tous distincts) = 365/365 × 364/365 × … × 343/365, un produit qui s\'érode sous 50 %',
      'Donner les jalons qui frappent : 50 personnes ⇒ 97,0 % ; 70 ⇒ 99,9 % — la quasi-certitude bien avant la centaine',
    ],
    planEn: [
      'Give the clean number first: 23 — the exact probability is 50.729723%',
      'Explain why intuition misses by a factor of eight: it counts people (23) when collisions happen between PAIRS — C(23, 2) = 253 opportunities for a coincidence',
      'Show the clean calculation, via the complement: P(all distinct) = 365/365 × 364/365 × … × 343/365, a product that erodes below 50%',
      'Give the striking milestones: 50 people ⇒ 97.0%; 70 ⇒ 99.9% — near-certainty well before a hundred',
    ],
    pointsAttendus: [
      'Le chiffre récité sans hésiter : 23 personnes, probabilité 50,729723 % — et l\'intuition fausse nommée : 183, la moitié de 365',
      'L\'argument des paires : 23 personnes forment C(23, 2) = 253 paires, chacune une occasion de collision à 1/365 — le nombre de paires croît en n², pas en n, et le cerveau câblé linéaire ne le voit pas',
      'Le calcul par le complémentaire : la probabilité que tous les anniversaires soient distincts est le produit 365/365 × 364/365 × … × 343/365 — chaque nouvel arrivant doit éviter tous les jours déjà pris',
      'Les jalons de la croissance : à 50 personnes 97,0 %, à 70 personnes 99,9 %',
      'La transposition desk attendue : les événements joints sont toujours plus probables qu\'on ne le sent — deux défauts « indépendants » dans un portefeuille de cent noms, deux pannes le même jour : dès qu\'on compte les paires, le rare devient banal',
    ],
    pointsAttendusEn: [
      'The number recited without hesitation: 23 people, probability 50.729723% — and the false intuition named: 183, half of 365',
      'The pairs argument: 23 people form C(23, 2) = 253 pairs, each an opportunity for a collision at 1/365 — the number of pairs grows in n², not n, and the linearly-wired brain does not see it',
      'The complement calculation: the probability that all birthdays are distinct is the product 365/365 × 364/365 × … × 343/365 — each newcomer must avoid every day already taken',
      'The growth milestones: at 50 people 97.0%, at 70 people 99.9%',
      'The expected desk transposition: joint events are always more likely than they feel — two "independent" defaults in a hundred-name portfolio, two failures the same day: as soon as you count pairs, the rare becomes routine',
    ],
    bonus: [
      'L\'approximation élégante si le jury creuse : P(collision) ≈ 1 − e^(−n²/730) — la croissance quadratique rendue visible dans la formule',
      'Le lien avec les tests multiples du m2 : mille backtests sur les mêmes données, c\'est un paradoxe des anniversaires entre stratégies — la coïncidence rare devient garantie',
    ],
    bonusEn: [
      'The elegant approximation if the jury digs: P(collision) ≈ 1 − e^(−n²/730) — the quadratic growth made visible in the formula',
      'The link with m2 multiple testing: a thousand backtests on the same data is a birthday paradox between strategies — the rare coincidence becomes guaranteed',
    ],
    reponseModele: `« **23** — et la probabilité exacte à 23 personnes vaut 50,7 %. » Le chiffre d'abord, puis le pourquoi, car c'est lui qui est noté.

L'intuition répond 183 — la moitié de 365 — parce qu'elle compte les *personnes*. Or les collisions se produisent entre **paires** : 23 personnes forment C(23, 2) = **253 paires**, soit 253 occasions distinctes de coïncidence, chacune à 1/365. Le nombre de paires croît en n², pas en n — c'est cette croissance quadratique que le cerveau, câblé linéaire, ne voit pas, et c'est pour cela que l'intuition rate d'un facteur huit.

Le calcul propre passe par le complémentaire : la probabilité que *tous* les anniversaires soient distincts est le produit 365/365 × 364/365 × … × 343/365 — chaque nouvel arrivant doit éviter tous les jours déjà pris, et le produit s'érode sous 50 % au 23ᵉ. Les jalons qui frappent : à 50 personnes, **97,0 %** ; à 70, **99,9 %** — la quasi-certitude bien avant la centaine.

Et la transposition que le jury attend d'un futur desk : les événements joints sont toujours plus probables qu'on ne le sent. Deux défauts « indépendants » dans un portefeuille de cent noms, deux pannes le même jour, deux traders sur la même erreur — dès qu'on compte les paires, le rare devient banal.`,
    reponseModeleEn: `"**23** — and the exact probability at 23 people is 50.7%." The number first, then the why, because the why is what gets graded.

Intuition answers 183 — half of 365 — because it counts *people*. Yet collisions happen between **pairs**: 23 people form C(23, 2) = **253 pairs**, i.e. 253 distinct opportunities for a coincidence, each at 1/365. The number of pairs grows in n², not n — that quadratic growth is what the linearly-wired brain fails to see, and that is why intuition misses by a factor of eight.

The clean calculation goes through the complement: the probability that *all* birthdays are distinct is the product 365/365 × 364/365 × … × 343/365 — each newcomer must avoid every day already taken, and the product erodes below 50% at the 23rd person. The striking milestones: at 50 people, **97.0%**; at 70, **99.9%** — near-certainty well before a hundred.

And the transposition the jury expects from a future desk: joint events are always more likely than they feel. Two "independent" defaults in a hundred-name portfolio, two system failures the same day, two traders making the same mistake — as soon as you count pairs, the rare becomes routine.`,
  },
  {
    id: 'm13-j-10',
    moduleId: M13,
    theme: 'les probabilités d\'entretien',
    themeEn: 'interview probabilities',
    difficulte: 3,
    question: 'Une maladie touche 1 % de la population. Un test la détecte dans 99 % des cas, avec 5 % de faux positifs. Votre test est positif : êtes-vous malade ?',
    questionEn: 'A disease affects 1% of the population. A test detects it in 99% of cases, with 5% false positives. Your test comes back positive: are you sick?',
    plan: [
      'Refuser le 99 % instinctif et annoncer la méthode : « je fais tourner 10 000 personnes »',
      'Compter les vrais positifs : 1 % de 10 000 = 100 malades, dont 99 détectés',
      'Compter les faux positifs : 9 900 sains × 5 % = 495 positifs à tort',
      'Conclure : 99/(99 + 495) = 99/594 = 1/6 ≈ 16,7 % — probablement PAS malade, et nommer l\'erreur évitée : le base rate neglect',
    ],
    planEn: [
      'Refuse the instinctive 99% and announce the method: "I run 10,000 people through it"',
      'Count the true positives: 1% of 10,000 = 100 sick, of whom 99 are detected',
      'Count the false positives: 9,900 healthy × 5% = 495 wrongly positive',
      'Conclude: 99/(99 + 495) = 99/594 = 1/6 ≈ 16.7% — probably NOT sick, and name the avoided error: base rate neglect',
    ],
    pointsAttendus: [
      'Le résultat net : 16,666667 % — un sixième, pas 99 %',
      'La méthode des 10 000 déroulée en trois lignes : 100 malades dont 99 détectés ; 9 900 sains dont 495 faux positifs ; 99/594 = 1/6 — elle vaut la formule de Bayes parce qu\'elle se récite de tête',
      'Le mécanisme nommé : les faux positifs NOIENT les vrais quand la prévalence est faible — 495 contre 99, cinq contre un',
      'L\'erreur d\'intuition diagnostiquée : le base rate neglect — confondre P(test positif | malade) = 99 % avec P(malade | test positif), deux conditionnelles différentes que seule la prévalence relie',
      'La transposition marché attendue : un indicateur de crise « fiable à 99 % » qui guette un événement à 1 % produit surtout de fausses alertes (m10, m11) ; un signal rare trouvé par mille backtests est probablement un faux positif (m2)',
      'La phrase de synthèse : la force d\'un signal dépend de la rareté de ce qu\'il cherche',
    ],
    pointsAttendusEn: [
      'The clean result: 16.666667% — one sixth, not 99%',
      'The method of 10,000 unrolled in three lines: 100 sick of whom 99 detected; 9,900 healthy of whom 495 false positives; 99/594 = 1/6 — it beats the Bayes formula because it can be recited from memory',
      'The mechanism named: false positives DROWN the true ones when prevalence is low — 495 against 99, five to one',
      'The intuition error diagnosed: base rate neglect — confusing P(positive test | sick) = 99% with P(sick | positive test), two different conditionals that only the prevalence connects',
      'The expected market transposition: a "99% reliable" crisis indicator watching for a 1% event mostly produces false alarms (m10, m11); a rare signal found by a thousand backtests is probably a false positive (m2)',
      'The summary sentence: the strength of a signal depends on the rarity of what it seeks',
    ],
    bonus: [
      'Le témoin qui prouve la compréhension : refaire le calcul à prévalence 20 % — 1 980 vrais contre 400 faux, soit 83,2 % — le même test devient crédible quand ce qu\'il cherche est fréquent',
      'Le réflexe du second test : un deuxième test indépendant positif fait passer la probabilité de 16,7 % à environ 80 % — l\'information se compose, exactement comme les survies du m5',
    ],
    bonusEn: [
      'The witness that proves understanding: redo the calculation at 20% prevalence — 1,980 true against 400 false, i.e. 83.2% — the same test becomes credible when what it seeks is frequent',
      'The second-test reflex: a second independent positive test lifts the probability from 16.7% to about 80% — information compounds, exactly like m5 survivals',
    ],
    reponseModele: `« Probablement pas — la réponse est **un sixième**, environ 16,7 %. Je le montre avec la méthode des 10 000. » Puis les trois lignes, à voix haute : sur **10 000 personnes**, 1 % sont malades, soit **100 malades** — le test en détecte 99. Les **9 900 sains** subissent 5 % de faux positifs : **495** tests positifs à tort. Parmi les 99 + 495 = **594 positifs**, seuls 99 sont vrais : 99/594 = **1/6 = 16,666667 %**.

Nommer ensuite le mécanisme : les faux positifs **noient** les vrais quand la prévalence est faible — 495 contre 99, cinq contre un. Et l'erreur d'intuition : le *base rate neglect* — on lit « fiable à 99 % » et on confond P(test positif | malade) avec P(malade | test positif), deux conditionnelles différentes que seule la prévalence relie ; tout Bayes tient dans ce passage.

Puis la transposition, car c'est elle qui recrute : un indicateur de crise « fiable à 99 % » qui guette un événement à 1 % de fréquence produit surtout de fausses alertes ; un signal de trading rare exhumé par mille backtests est probablement un faux positif. La phrase de synthèse : « **la force d'un signal dépend de la rareté de ce qu'il cherche** ». Et si le jury creuse : à prévalence 20 %, le même test donnerait 83 % — le calcul témoin qui prouve qu'on a compris le mécanisme, pas mémorisé le 16,7.`,
    reponseModeleEn: `"Probably not — the answer is **one sixth**, about 16.7%. Let me show it with the method of 10,000." Then the three lines, out loud: out of **10,000 people**, 1% are sick, i.e. **100 sick** — the test detects 99 of them. The **9,900 healthy** suffer 5% false positives: **495** wrongly positive tests. Among the 99 + 495 = **594 positives**, only 99 are true: 99/594 = **1/6 = 16.666667%**.

Then name the mechanism: false positives **drown** the true ones when prevalence is low — 495 against 99, five to one. And the intuition error: *base rate neglect* — you read "99% reliable" and confuse P(positive test | sick) with P(sick | positive test), two different conditionals that only the prevalence connects; all of Bayes lives in that crossing.

Then the transposition, because that is what gets you hired: a "99% reliable" crisis indicator watching for a 1%-frequency event mostly produces false alarms; a rare trading signal unearthed by a thousand backtests is probably a false positive. The summary sentence: "**the strength of a signal depends on the rarity of what it seeks**". And if the jury digs: at 20% prevalence the same test would give 83% — the witness calculation that proves you understood the mechanism rather than memorised the 16.7.`,
  },
  {
    id: 'm13-j-11',
    moduleId: M13,
    theme: 'les probabilités d\'entretien',
    themeEn: 'interview probabilities',
    difficulte: 4,
    question: 'Monty Hall : trois portes, une voiture ; vous en choisissez une, l\'animateur — qui sait tout — ouvre une porte perdante et vous propose de changer. Que faites-vous ? Et convainquez-moi.',
    questionEn: 'Monty Hall: three doors, one car; you pick one, the host — who knows everything — opens a losing door and offers you a switch. What do you do? And convince me.',
    plan: [
      'Répondre net : je change — mes chances passent de 1/3 à 2/3, pas à 50/50',
      'Premier argument, l\'invariant : ma porte initiale avait 1/3, et rien de ce que fait l\'animateur ne change ce fait — il ouvrira une porte perdante quoi qu\'il arrive ; les 2/3 restants se concentrent sur la porte qu\'il n\'a PAS ouverte',
      'Deuxième argument, la variante ignorante : si un ami ouvrait une porte au hasard et trouvait une chèvre par chance, changer ne servirait à rien (50/50) — toute la différence tient dans QUI SAIT QUOI',
      'Troisième argument, Bayes chiffré : P(il ouvre la 3 | voiture en 1) = ½ mais P(il ouvre la 3 | voiture en 2) = 1 — le geste contraint est deux fois plus vraisemblable quand la voiture est derrière l\'autre porte : 2/3',
    ],
    planEn: [
      'Answer squarely: I switch — my chances go from 1/3 to 2/3, not to 50/50',
      'First argument, the invariant: my initial door had 1/3, and nothing the host does changes that fact — he will open a losing door no matter what; the remaining 2/3 concentrate on the door he did NOT open',
      'Second argument, the ignorant variant: if a friend opened a door at random and found a goat by luck, switching would gain nothing (50/50) — the whole difference lies in WHO KNOWS WHAT',
      'Third argument, Bayes with numbers: P(he opens 3 | car behind 1) = ½ but P(he opens 3 | car behind 2) = 1 — the forced move is twice as likely when the car is behind the other door: 2/3',
    ],
    pointsAttendus: [
      'La réponse ferme avant les arguments : changer, 2/3 contre 1/3 — le 50/50 est LE piège, et l\'hésitation initiale coûte autant que l\'erreur',
      'L\'argument de l\'invariant : la probabilité de ma porte initiale ne peut pas être modifiée par un geste que l\'animateur ferait dans TOUS les cas — son ouverture n\'apporte aucune information sur MA porte, donc tout le reste se concentre ailleurs',
      'Le test de compréhension décisif : la variante de l\'animateur ignorant — s\'il ouvre au hasard et tombe sur une chèvre par chance, changer ne sert à rien ; c\'est la connaissance de l\'animateur qui transporte l\'information',
      'Le Bayes chiffré pour le jury qui pousse : vraisemblances ½ contre 1, d\'où P(voiture derrière l\'autre porte | il ouvre la 3) = (1 × 1/3)/(1 × 1/3 + ½ × 1/3) = 2/3',
      'L\'escalade pédagogique comme performance : trois arguments de force croissante, déroulés calmement — convaincre un sceptique fait partie de l\'énoncé, c\'est un test de communication autant que de probabilités',
      'L\'amplificateur des 100 portes : vous choisissez 1 porte sur 100, l\'animateur en ouvre 98 perdantes — garder sa porte, c\'est parier qu\'on avait raison à 1/100',
    ],
    pointsAttendusEn: [
      'The firm answer before the arguments: switch, 2/3 against 1/3 — 50/50 is THE trap, and initial hesitation costs as much as the error',
      'The invariant argument: my initial door\'s probability cannot be changed by a move the host would make in ALL cases — his opening carries no information about MY door, so everything else concentrates elsewhere',
      'The decisive comprehension test: the ignorant-host variant — if he opens at random and happens upon a goat by luck, switching gains nothing; it is the host\'s knowledge that transports the information',
      'The numbered Bayes for a pushing jury: likelihoods ½ against 1, hence P(car behind the other door | he opens 3) = (1 × 1/3)/(1 × 1/3 + ½ × 1/3) = 2/3',
      'The pedagogical escalation as performance: three arguments of increasing force, unrolled calmly — convincing a sceptic is part of the brief, a test of communication as much as of probability',
      'The 100-door amplifier: you pick 1 door out of 100, the host opens 98 losing ones — keeping your door means betting you were right at 1/100',
    ],
    bonus: [
      'La preuve fréquentiste en une phrase : sur 300 parties, la voiture est 100 fois derrière ma porte initiale — rester gagne ces 100-là, changer gagne les 200 autres',
      'Le pont de desk : un geste contraint par l\'information ne renseigne que si ses vraisemblances diffèrent selon les états du monde — un market maker qui requote APRÈS avoir été traité fait exactement cette lecture (m1, sélection adverse)',
      'L\'histoire qui détend : quand Marilyn vos Savant publia la solution en 1990, des milliers de lettres — dont des mathématiciens — lui donnèrent tort ; l\'intuition 50/50 est robuste, d\'où l\'intérêt de la variante ignorante qui la désarme',
    ],
    bonusEn: [
      'The frequentist proof in one sentence: over 300 games, the car is behind my initial door 100 times — staying wins those 100, switching wins the other 200',
      'The desk bridge: a move constrained by information is only informative if its likelihoods differ across states of the world — a market maker requoting AFTER being traded makes exactly that reading (m1, adverse selection)',
      'The story that relaxes the room: when Marilyn vos Savant published the solution in 1990, thousands of letters — including from mathematicians — told her she was wrong; the 50/50 intuition is robust, hence the value of the ignorant variant that disarms it',
    ],
    reponseModele: `« Je change — mes chances passent de **1/3 à 2/3**, pas à 50/50. Et je vous le montre de trois façons. »

**L'invariant** : ma porte initiale avait 1/3 de chances, et rien de ce que fait l'animateur ne peut changer ce fait — il ouvrira une porte perdante *quoi qu'il arrive*, donc son geste n'apporte aucune information sur ma porte. Les 2/3 restants, d'abord répartis sur deux portes, se concentrent entièrement sur celle qu'il n'a **pas** ouverte.

**La variante ignorante** — le vrai test de compréhension : si un ami qui ne sait rien avait ouvert une porte au hasard et trouvé une chèvre *par chance*, changer ne servirait à rien : 50/50. Toute la différence tient dans **qui sait quoi** : c'est la connaissance de l'animateur, contrainte par la voiture, qui transporte l'information.

**Bayes chiffré**, pour verrouiller : je choisis la 1, il ouvre la 3. Si la voiture est en 1, il ouvrait 2 ou 3 au hasard : vraisemblance ½. Si elle est en 2, il était *forcé* d'ouvrir la 3 : vraisemblance 1. D'où P(voiture en 2) = (1 × 1/3)/(1 × 1/3 + ½ × 1/3) = **2/3** — le geste forcé est deux fois plus probable quand la voiture est ailleurs.

Et si le scepticisme résiste, l'amplificateur : 100 portes, j'en choisis une, il en ouvre 98 perdantes — garder, c'est parier que j'avais raison à 1/100. « Je change. »`,
    reponseModeleEn: `"I switch — my chances go from **1/3 to 2/3**, not to 50/50. And I will show you three ways."

**The invariant**: my initial door had a 1/3 chance, and nothing the host does can change that fact — he will open a losing door *no matter what*, so his move carries no information about my door. The remaining 2/3, initially spread over two doors, concentrate entirely on the one he did **not** open.

**The ignorant variant** — the real comprehension test: if a friend who knows nothing had opened a door at random and found a goat *by luck*, switching would gain nothing: 50/50. The whole difference lies in **who knows what**: it is the host\'s knowledge, constrained by the car, that transports the information.

**Bayes with numbers**, to lock it in: I pick door 1, he opens door 3. If the car is behind 1, he opened 2 or 3 at random: likelihood ½. If it is behind 2, he was *forced* to open 3: likelihood 1. Hence P(car behind 2) = (1 × 1/3)/(1 × 1/3 + ½ × 1/3) = **2/3** — the forced move is twice as likely when the car is elsewhere.

And if scepticism holds out, the amplifier: 100 doors, I pick one, he opens 98 losers — keeping means betting I was right at 1/100. "I switch."`,
  },
  {
    id: 'm13-j-12',
    moduleId: M13,
    theme: 'les probabilités d\'entretien',
    themeEn: 'interview probabilities',
    difficulte: 2,
    question: 'Quelle est la probabilité d\'obtenir au moins un 6 en quatre lancers de dé ?',
    questionEn: 'What is the probability of rolling at least one 6 in four throws of a die?',
    plan: [
      'Refuser le piège additif à voix haute : 4 × 1/6 = 66,7 % est faux — à ce compte, six lancers donneraient une certitude, absurde',
      'Déclencher le réflexe : « au moins un » ⇒ passer par le complémentaire — la probabilité qu\'AUCUN 6 ne sorte',
      'Calculer : 1 − (5/6)⁴ = 51,774691 % — favorable de justesse',
      'Ancrer par l\'histoire : c\'est le pari du chevalier de Méré, dont l\'énigme transmise à Pascal et Fermat a fondé le calcul des probabilités en 1654',
    ],
    planEn: [
      'Refuse the additive trap out loud: 4 × 1/6 = 66.7% is wrong — at that rate, six throws would give certainty, absurd',
      'Trigger the reflex: "at least one" ⇒ go through the complement — the probability that NO 6 comes up',
      'Compute: 1 − (5/6)⁴ = 51.774691% — favourable by a whisker',
      'Anchor with the history: this is the Chevalier de Méré\'s bet, whose riddle passed to Pascal and Fermat founded probability theory in 1654',
    ],
    pointsAttendus: [
      'Le réflexe verbalisé : les mots « au moins un » déclenchent le complémentaire — calculer la probabilité que tous les essais échouent, un simple produit grâce à l\'indépendance, et la retrancher de 1',
      'Le calcul propre : (5/6)⁴ = 625/1 296 ≈ 48,2 % d\'aucun 6, donc 51,8 % d\'au moins un — favorable de justesse',
      'Le piège additif réfuté par l\'absurde : n × p donnerait 100 % en six lancers et 200 % en douze — les succès se composent, ils ne s\'additionnent pas',
      'Le pont m5 explicite : même structure que le défaut cumulé — les survies se multiplient, il faut être vivant pour mourir',
      'L\'ancre jumelle : au moins un pile en 3 lancers = 1 − (1/2)³ = 87,5 %',
    ],
    pointsAttendusEn: [
      'The verbalised reflex: the words "at least one" trigger the complement — compute the probability that all trials fail, a simple product thanks to independence, and subtract it from 1',
      'The clean calculation: (5/6)⁴ = 625/1,296 ≈ 48.2% of no 6, hence 51.8% of at least one — favourable by a whisker',
      'The additive trap refuted by absurdity: n × p would give 100% in six throws and 200% in twelve — successes compound, they do not add',
      'The explicit m5 bridge: same structure as cumulative default — survivals multiply, you must be alive to die',
      'The twin anchor: at least one heads in 3 flips = 1 − (1/2)³ = 87.5%',
    ],
    bonus: [
      'La suite de l\'histoire qui prouve la maîtrise : Méré étend le pari à « au moins un double 6 en 24 lancers » par règle de trois… et perd — 1 − (35/36)²⁴ = 49,1 %, défavorable de justesse ; l\'énigme soumise à Pascal ouvre la correspondance de 1654 avec Fermat',
      'La morale d\'oral : même un joueur professionnel se fait piéger par l\'intuition additive — l\'anecdote se raconte en trente secondes et montre qu\'on sait POURQUOI la règle de trois échoue',
    ],
    bonusEn: [
      'The sequel that proves mastery: Méré extended the bet to "at least one double six in 24 throws" by rule of three… and lost — 1 − (35/36)²⁴ = 49.1%, unfavourable by a whisker; the riddle submitted to Pascal opened the 1654 correspondence with Fermat',
      'The oral moral: even a professional gambler gets caught by additive intuition — the anecdote takes thirty seconds and shows you know WHY the rule of three fails',
    ],
    reponseModele: `« Les mots "au moins un" déclenchent chez moi un réflexe : passer par le **complémentaire**. » D'abord écarter le piège, à voix haute : l'intuition additive dit 4 × 1/6 = 66,7 % — et elle est fausse, car à ce compte six lancers donneraient une certitude, ce qui est absurde : les succès se *composent*, ils ne s'additionnent pas.

Le calcul propre : la probabilité qu'aucun 6 ne sorte en quatre lancers indépendants est (5/6)⁴ ≈ 48,2 % ; donc P(au moins un 6) = 1 − (5/6)⁴ = **51,774691 %** — favorable, mais de justesse. L'ancre jumelle à garder en poche : au moins un pile en trois lancers = 1 − (1/2)³ = 87,5 %.

Puis le pont qui fait la réponse de desk : c'est exactement la structure du défaut cumulé du module 5 — les survies se multiplient, « il faut être vivant pour mourir » — et l'erreur n × p y coûte les mêmes points.

Enfin, si le jury laisse trente secondes, l'anecdote fondatrice : le chevalier de **Méré** gagnait sa vie sur ce pari à 51,8 % ; il l'a étendu à « un double 6 en 24 lancers » par règle de trois… et a perdu — 1 − (35/36)²⁴ = 49,1 %. Intrigué, il soumet l'énigme à Pascal, qui ouvre avec Fermat la correspondance de 1654 : le calcul des probabilités est né d'un joueur piégé par l'intuition additive.`,
    reponseModeleEn: `"The words 'at least one' trigger a reflex in me: go through the **complement**." First dismiss the trap, out loud: additive intuition says 4 × 1/6 = 66.7% — and it is wrong, because at that rate six throws would give certainty, which is absurd: successes *compound*, they do not add.

The clean calculation: the probability that no 6 appears in four independent throws is (5/6)⁴ ≈ 48.2%; hence P(at least one 6) = 1 − (5/6)⁴ = **51.774691%** — favourable, but by a whisker. The twin anchor to keep at hand: at least one heads in three flips = 1 − (1/2)³ = 87.5%.

Then the bridge that makes it a desk answer: this is exactly the structure of module 5\'s cumulative default — survivals multiply, "you must be alive to die" — and the n × p error costs the same points there.

Finally, if the jury allows thirty seconds, the founding anecdote: the Chevalier de **Méré** made a living on this 51.8% bet; he extended it to "a double six in 24 throws" by rule of three… and lost — 1 − (35/36)²⁴ = 49.1%. Puzzled, he submitted the riddle to Pascal, who opened the 1654 correspondence with Fermat: probability theory was born from a gambler caught by additive intuition.`,
  },
// __SUITE__
];
