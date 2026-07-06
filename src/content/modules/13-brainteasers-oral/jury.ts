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
  {
    id: 'm13-j-13',
    moduleId: M13,
    theme: 'les brainteasers classiques',
    themeEn: 'classic brainteasers',
    difficulte: 2,
    question: 'Neuf boules identiques, une seule est plus lourde. Une balance à deux plateaux : combien de pesées pour la trouver à coup sûr ?',
    questionEn: 'Nine identical balls, exactly one heavier. A two-pan balance: how many weighings to find it with certainty?',
    plan: [
      'Reformuler et borner : le réflexe binaire suggère log₂(9) ⇒ 4 pesées — l\'annoncer comme stratégie bête avant de chercher mieux',
      'Compter l\'information : une pesée n\'a pas deux issues mais TROIS — penche à gauche, penche à droite, équilibre — donc chaque pesée peut séparer trois groupes',
      'Dérouler le protocole : 3 contre 3, l\'équilibre désignant les 3 boules restées sur la table ; puis 1 contre 1 dans le groupe désigné — 2 pesées',
      'Verrouiller par l\'optimalité : deux pesées ternaires distinguent 3² = 9 cas, exactement le nombre de boules — impossible de faire mieux',
    ],
    planEn: [
      'Reformulate and bound: the binary reflex suggests log₂(9) ⇒ 4 weighings — announce it as the dumb strategy before looking for better',
      'Count the information: a weighing has not two outcomes but THREE — tips left, tips right, balances — so each weighing can separate three groups',
      'Unroll the protocol: 3 against 3, balance designating the 3 balls left on the table; then 1 against 1 within the designated group — 2 weighings',
      'Lock with optimality: two ternary weighings distinguish 3² = 9 cases, exactly the number of balls — impossible to do better',
    ],
    pointsAttendus: [
      'Le chiffre : 2 pesées garanties, sans aucune chance — 3 contre 3, puis 1 contre 1 dans le groupe désigné',
      'L\'idée qui débloque, verbalisée : l\'équilibre est une issue à part entière — le réflexe binaire (couper en deux) oublie que la balance parle aussi quand elle ne penche pas',
      'Le protocole complet dans les trois cas : penche à gauche ⇒ la lourde est dans le plateau gauche ; à droite ⇒ plateau droit ; équilibre ⇒ les trois boules restées sur la table',
      'L\'argument informationnel : chaque pesée discrimine au mieux 3 groupes, donc n pesées couvrent 3ⁿ cas — 3² = 9, la solution est optimale et le problème est calibré pour',
      'La lecture desk attendue : élargir l\'espace des issues d\'un instrument, c\'est la même compétence que lire dans un prix de marché l\'information qu\'il contient en creux',
    ],
    pointsAttendusEn: [
      'The number: 2 guaranteed weighings, no luck involved — 3 against 3, then 1 against 1 within the designated group',
      'The unlocking idea, verbalised: balance is a fully-fledged outcome — the binary reflex (cut in half) forgets that the scale also speaks when it does not tip',
      'The complete protocol across the three cases: tips left ⇒ the heavy ball is in the left pan; right ⇒ right pan; balance ⇒ the three balls left on the table',
      'The informational argument: each weighing discriminates at best 3 groups, so n weighings cover 3ⁿ cases — 3² = 9, the solution is optimal and the problem is calibrated for it',
      'The expected desk reading: widening the outcome space of an instrument is the same skill as reading in a market price the information it contains in relief',
    ],
    bonus: [
      'La généralisation immédiate : 27 boules ⇒ 3 pesées, 3ⁿ boules ⇒ n pesées — la donner spontanément prouve qu\'on a compris le mécanisme, pas mémorisé la réponse',
      'La variante qui teste vraiment : 12 boules dont une différente SANS savoir si elle est plus lourde ou plus légère — 3 pesées, protocole nettement plus délicat ; dire « le principe ternaire tient, le protocole demande plus de soin » suffit à l\'oral',
    ],
    bonusEn: [
      'The immediate generalisation: 27 balls ⇒ 3 weighings, 3ⁿ balls ⇒ n weighings — offering it unprompted proves you understood the mechanism rather than memorised the answer',
      'The variant that really tests: 12 balls, one different WITHOUT knowing whether heavier or lighter — 3 weighings, a markedly trickier protocol; saying "the ternary principle holds, the protocol needs more care" is enough orally',
    ],
    reponseModele: `« Je borne d'abord : en coupant en deux, log₂(9) suggère 4 pesées — c'est ma stratégie bête, cherchons mieux. » Puis l'idée qui débloque, à voix haute : une pesée n'a pas deux issues mais **trois** — penche à gauche, penche à droite, **équilibre**. La balance parle aussi quand elle ne penche pas : chaque pesée peut donc séparer trois groupes, pas deux.

Le protocole suit tout seul : je pose **3 boules contre 3**, les 3 dernières restent sur la table. Penche à gauche : la lourde est à gauche ; à droite : à droite ; équilibre : elle est sur la table. Dans tous les cas, un groupe de trois est désigné. Deuxième pesée : **1 contre 1** dans ce groupe — penche : c'est elle ; équilibre : c'est la troisième. **2 pesées**, garanties, sans aucune chance.

Et le verrou d'optimalité, qui fait la différence : n pesées ternaires distinguent au mieux 3ⁿ cas — 3² = 9, exactement le nombre de boules ; on ne peut pas faire mieux, et le problème est calibré pour. La transposition qui sonne desk : élargir l'espace des issues d'un instrument — l'équilibre d'une balance, la chaleur d'une ampoule — c'est la même compétence que lire dans un prix l'information qu'il contient en creux. Si le jury pousse : 27 boules, 3 pesées — 3ⁿ boules, n pesées.`,
    reponseModeleEn: `"I bound first: cutting in half, log₂(9) suggests 4 weighings — that is my dumb strategy, let us find better." Then the unlocking idea, out loud: a weighing has not two outcomes but **three** — tips left, tips right, **balances**. The scale also speaks when it does not tip: each weighing can therefore separate three groups, not two.

The protocol follows by itself: I put **3 balls against 3**, the last 3 stay on the table. Tips left: the heavy one is on the left; right: on the right; balance: it is on the table. In every case, a group of three is designated. Second weighing: **1 against 1** within that group — tips: that is the one; balances: it is the third. **2 weighings**, guaranteed, no luck involved.

And the optimality lock, which makes the difference: n ternary weighings distinguish at best 3ⁿ cases — 3² = 9, exactly the number of balls; you cannot do better, and the problem is calibrated for it. The transposition that sounds like a desk: widening the outcome space of an instrument — a scale's balance, a bulb's heat — is the same skill as reading in a price the information it contains in relief. If the jury pushes: 27 balls, 3 weighings — 3ⁿ balls, n weighings.`,
  },
  {
    id: 'm13-j-14',
    moduleId: M13,
    theme: 'les brainteasers classiques',
    themeEn: 'classic brainteasers',
    difficulte: 4,
    question: 'Un immeuble de 100 étages, deux œufs identiques. Il existe un étage critique à partir duquel un œuf lâché se casse. Combien de lâchers, au pire, pour le trouver à coup sûr ?',
    questionEn: 'A 100-storey building, two identical eggs. There is a critical floor from which a dropped egg breaks. How many drops, in the worst case, to find it with certainty?',
    plan: [
      'Borner à voix haute : avec un seul œuf, 100 essais (étage par étage) ; la dichotomie naïve casse le budget — si l\'œuf casse au 50e, il reste 49 étages à balayer un par un : 50 au pire',
      'Nommer l\'idée : minimax — égaliser le pire cas de toutes les branches, en décrémentant le pas à chaque palier tenu',
      'Poser l\'inéquation : k + (k−1) + … + 1 ≥ 100 ⇒ k(k+1)/2 ≥ 100 ⇒ k = 14 (105 ≥ 100)',
      'Dérouler la stratégie : premier lâcher au 14e, puis 27e, 39e, 50e… — 14 essais au pire — et conclure par la lecture risque',
    ],
    planEn: [
      'Bound out loud: with a single egg, 100 trials (floor by floor); naive dichotomy breaks the budget — if the egg breaks at the 50th, 49 floors remain to sweep one by one: 50 in the worst case',
      'Name the idea: minimax — equalise the worst case of every branch, decrementing the step at each surviving drop',
      'State the inequality: k + (k−1) + … + 1 ≥ 100 ⇒ k(k+1)/2 ≥ 100 ⇒ k = 14 (105 ≥ 100)',
      'Unroll the strategy: first drop at the 14th, then 27th, 39th, 50th… — 14 trials in the worst case — and close with the risk reading',
    ],
    pointsAttendus: [
      'Les bornes annoncées avant tout : 100 avec un œuf, et l\'échec chiffré de la dichotomie — 50 au pire, très déséquilibré, car le second œuf impose le balayage un par un',
      'Le diagnostic du déséquilibre : la branche « casse » et la branche « tient » n\'ont pas le même coût — c\'est ce déséquilibre que la bonne stratégie égalise',
      'Le pas décroissant expliqué : si le premier lâcher est à k et tient, le suivant est k − 1 étages plus haut, car un essai est consommé — chaque branche du pire cas retombe sur le même total',
      'L\'inéquation propre : k(k+1)/2 ≥ 100, d\'où k = 14 avec 105 ≥ 100 — et la séquence 14, 27, 39, 50, 60, 69, 77, 84, 90, 95, 99, 100',
      'Le témoin intermédiaire qui montre la maîtrise : le pas fixe de 10 donne 19 au pire — mieux que 50, moins bien que 14',
      'La lecture desk : c\'est un raisonnement d\'allocation de budget de risque — le chemin (bornes, déséquilibre, correction) vaut plus que le chiffre 14',
    ],
    pointsAttendusEn: [
      'The bounds announced before anything: 100 with one egg, and the numbered failure of dichotomy — 50 in the worst case, badly unbalanced, since the second egg forces a one-by-one sweep',
      'The imbalance diagnosis: the "breaks" branch and the "survives" branch do not cost the same — that imbalance is what the right strategy equalises',
      'The decreasing step explained: if the first drop is at k and survives, the next is k − 1 floors higher, since one trial is spent — every worst-case branch lands on the same total',
      'The clean inequality: k(k+1)/2 ≥ 100, hence k = 14 with 105 ≥ 100 — and the sequence 14, 27, 39, 50, 60, 69, 77, 84, 90, 95, 99, 100',
      'The intermediate witness that shows mastery: the fixed step of 10 gives 19 in the worst case — better than 50, worse than 14',
      'The desk reading: this is risk-budget allocation reasoning — the path (bounds, imbalance, correction) is worth more than the number 14',
    ],
    bonus: [
      'La généralisation en récurrence : f(e, k) = f(e−1, k−1) + f(e−1, k) + 1 — avec deux œufs, elle se referme sur f(e, 2) = e(e+1)/2, notre 105 pour e = 14',
      'Les deux limites éclairantes : à un œuf, f(e, 1) = e (la prudence linéaire) ; à budget d\'œufs illimité, f(e, k) → 2ᵉ − 1 (la dichotomie pure) — toute la famille interpole entre prudence et audace, indexée par le budget de casse',
    ],
    bonusEn: [
      'The recurrence generalisation: f(e, k) = f(e−1, k−1) + f(e−1, k) + 1 — with two eggs it closes on f(e, 2) = e(e+1)/2, our 105 for e = 14',
      'The two illuminating limits: with one egg, f(e, 1) = e (linear caution); with an unlimited egg budget, f(e, k) → 2ᵉ − 1 (pure dichotomy) — the whole family interpolates between caution and boldness, indexed by the breakage budget',
    ],
    reponseModele: `« Je borne d'abord. Avec un seul œuf : étage par étage, **100 essais** au pire. Avec une dichotomie naïve : je lâche au 50e — s'il casse, il ne me reste qu'un œuf et 49 étages à balayer un par un, **50 au pire**. La dichotomie est interdite par le budget : mes deux branches sont très déséquilibrées. » Le diagnostic est posé, l'idée suit : **égaliser le pire cas de toutes les branches** — le minimax.

Si mon premier lâcher est à l'étage k et casse, j'ai k − 1 essais à faire en dessous ; s'il tient, le deuxième lâcher doit être k − 1 étages plus haut — j'ai consommé un essai — puis k − 2, et ainsi de suite. Il faut donc k + (k−1) + … + 1 ≥ 100, soit **k(k+1)/2 ≥ 100** : k = 14, avec 105 ≥ 100. Stratégie : premier lâcher au **14e**, puis 27, 39, 50, 60, 69, 77, 84, 90, 95, 99, 100 — **14 essais au pire**, toutes les branches retombant sur le même total.

Le témoin qui montre la maîtrise : le pas fixe de 10 donnerait 19 au pire — mieux que 50, moins bien que 14. Et la conclusion qui recrute : « c'est un problème d'allocation de budget de risque — deux œufs, c'est un budget de casse, et la stratégie optimale interpole entre la prudence linéaire du budget nul et la dichotomie du budget illimité ». Le chemin vaut plus que le chiffre.`,
    reponseModeleEn: `"I bound first. With a single egg: floor by floor, **100 trials** in the worst case. With naive dichotomy: I drop at the 50th — if it breaks, I have one egg left and 49 floors to sweep one by one, **50 in the worst case**. Dichotomy is forbidden by the budget: my two branches are badly unbalanced." The diagnosis is set, the idea follows: **equalise the worst case of every branch** — minimax.

If my first drop is at floor k and breaks, I have k − 1 trials to run below; if it survives, the second drop must be k − 1 floors higher — one trial is spent — then k − 2, and so on. So I need k + (k−1) + … + 1 ≥ 100, i.e. **k(k+1)/2 ≥ 100**: k = 14, with 105 ≥ 100. Strategy: first drop at the **14th**, then 27, 39, 50, 60, 69, 77, 84, 90, 95, 99, 100 — **14 trials in the worst case**, every branch landing on the same total.

The witness that shows mastery: a fixed step of 10 would give 19 in the worst case — better than 50, worse than 14. And the closing line that hires: "this is a risk-budget allocation problem — two eggs are a breakage budget, and the optimal strategy interpolates between the linear caution of a zero budget and the dichotomy of an unlimited one". The path is worth more than the number.`,
  },
  {
    id: 'm13-j-15',
    moduleId: M13,
    theme: 'les brainteasers classiques',
    themeEn: 'classic brainteasers',
    difficulte: 2,
    question: 'Deux trains distants de 60 km foncent l\'un vers l\'autre à 30 km/h chacun. Une mouche part du premier à 60 km/h, vole jusqu\'au second, fait demi-tour, et recommence jusqu\'à la collision. Quelle distance parcourt-elle ?',
    questionEn: 'Two trains 60 km apart race towards each other at 30 km/h each. A fly leaves the first at 60 km/h, flies to the second, turns around, and repeats until the collision. What distance does it cover?',
    plan: [
      'Identifier le piège tendu : sommer la série infinie des allers-retours — faisable, mais long et périlleux sous pression',
      'Changer de point de vue : la bonne question n\'est pas « quelle trajectoire ? » mais « combien de TEMPS la mouche vole-t-elle ? »',
      'Calculer : les trains se rapprochent à 30 + 30 = 60 km/h avec 60 km à couvrir ⇒ collision dans 1 h',
      'Conclure : la mouche vole 1 h à 60 km/h ⇒ 60 km — et se taire',
    ],
    planEn: [
      'Spot the trap laid: summing the infinite series of back-and-forths — doable, but long and perilous under pressure',
      'Change viewpoint: the right question is not "what trajectory?" but "how much TIME does the fly spend flying?"',
      'Compute: the trains close at 30 + 30 = 60 km/h with 60 km to cover ⇒ collision in 1 h',
      'Close: the fly flies 1 h at 60 km/h ⇒ 60 km — and stop talking',
    ],
    pointsAttendus: [
      'Le réflexe noté : trente secondes de recherche d\'une reformulation AVANT de foncer dans le calcul lourd — sur un desk, cette différence s\'appelle des heures',
      'La vitesse de fermeture verbalisée : deux mobiles qui se rapprochent se traitent en vitesse relative — 60 km/h pour 60 km, une heure',
      'La distance découplée de la trajectoire : peu importe le nombre — infini — d\'allers-retours, seul compte le temps de vol total : distance = vitesse × temps',
      'La réponse sèche : 60 km, en deux lignes — la série infinie converge vers le même résultat mais coûte dix minutes et trois occasions de se tromper',
      'Le méta-message du chapitre : le jury connaît la réponse ; il note si votre premier geste est la reformulation ou le calcul',
    ],
    pointsAttendusEn: [
      'The graded reflex: thirty seconds spent looking for a reformulation BEFORE diving into heavy calculation — on a desk, that difference is called hours',
      'The closing speed verbalised: two objects approaching each other are handled in relative speed — 60 km/h for 60 km, one hour',
      'Distance decoupled from trajectory: no matter the — infinite — number of back-and-forths, only total flight time counts: distance = speed × time',
      'The dry answer: 60 km, in two lines — the infinite series converges to the same result but costs ten minutes and three chances to slip',
      'The chapter\'s meta-message: the jury knows the answer; it grades whether your first move is the reformulation or the calculation',
    ],
    bonus: [
      'L\'anecdote von Neumann à raconter en quinze secondes : à qui lui dit « ah, vous connaissez le truc », il répond « quel truc ? j\'ai sommé la série » — elle détend la salle et montre qu\'on connaît les deux voies',
      'Savoir esquisser la voie longue si le jury la demande : la série géométrique des allers-retours se somme et redonne 60 km — la voie simple n\'est pas une esquive, c\'est un choix',
    ],
    bonusEn: [
      'The von Neumann anecdote told in fifteen seconds: to "ah, you knew the trick", he replied "what trick? I summed the series" — it relaxes the room and shows you know both roads',
      'Being able to sketch the long road if the jury asks: the geometric series of back-and-forths sums up and returns 60 km — the simple road is not an evasion, it is a choice',
    ],
    reponseModele: `Le piège est dans l'énoncé même : il raconte des allers-retours, et invite à sommer la série infinie — faisable, mais dix minutes de calcul périlleux sous pression. Le geste noté est de refuser cette pente et de poser la question simple d'abord : « je ne cherche pas la trajectoire de la mouche, je cherche **combien de temps** elle vole. »

Le calcul tient alors en deux lignes, à voix haute : les trains se rapprochent à 30 + 30 = **60 km/h** et ont 60 km à couvrir — collision dans **1 heure**. La mouche vole donc une heure, à 60 km/h : **60 km**. La distance est découplée de la trajectoire : peu importe le nombre — infini — de demi-tours, distance = vitesse × temps de vol. Conclure, et se taire.

Si le jury laisse quinze secondes, l'anecdote canonique : on pose l'énigme à John von Neumann, il répond instantanément ; « ah, vous connaissez le truc » — « quel truc ? j'ai sommé la série ». Elle détend, et elle dit l'essentiel : la voie longue existe et converge vers le même 60, mais choisir la voie simple en trente secondes est exactement ce que le desk paie — chercher la reformulation qui rend le calcul lourd inutile avant de s'y jeter.`,
    reponseModeleEn: `The trap is in the wording itself: it narrates back-and-forths and invites you to sum the infinite series — doable, but ten minutes of perilous calculation under pressure. The graded move is to refuse that slope and ask the simple question first: "I am not looking for the fly's trajectory, I am looking for **how much time** it spends flying."

The calculation then takes two lines, out loud: the trains close at 30 + 30 = **60 km/h** with 60 km to cover — collision in **1 hour**. The fly therefore flies one hour, at 60 km/h: **60 km**. Distance is decoupled from trajectory: no matter the — infinite — number of turnarounds, distance = speed × flight time. Close, and stop talking.

If the jury allows fifteen seconds, the canonical anecdote: the riddle was put to John von Neumann, who answered instantly; "ah, you knew the trick" — "what trick? I summed the series". It relaxes the room, and it says the essential: the long road exists and converges to the same 60, but choosing the simple road in thirty seconds is exactly what the desk pays for — looking for the reformulation that makes the heavy calculation unnecessary before diving into it.`,
  },
  {
    id: 'm13-j-16',
    moduleId: M13,
    theme: 'les jeux de marché',
    themeEn: 'market games',
    difficulte: 3,
    question: 'Je lance un dé à six faces : cotez-moi un marché sur le résultat.',
    questionEn: 'I am about to roll a six-sided die: make me a market on the outcome.',
    plan: [
      'Calculer AVANT de parler : E = (6 + 1)/2 = 3,5 — coter sans espérance, c\'est coter au hasard',
      'Afficher deux prix symétriques autour de 3,5 : bid 3,3 / ask 3,7 — le bid dessous, l\'ask au-dessus',
      'Justifier la largeur : la fourchette rémunère le risque — l\'écart-type d\'un lancer vaut ≈ 1,71, la marge de 0,2 ne devient un revenu que répétée',
      'Faire vivre la cote : si le jury lève l\'ask deux fois, requoter plus haut — le flux est une information (sélection adverse)',
    ],
    planEn: [
      'Compute BEFORE speaking: E = (6 + 1)/2 = 3.5 — quoting without the expectation is quoting at random',
      'Show two prices symmetric around 3.5: bid 3.3 / ask 3.7 — the bid below, the ask above',
      'Justify the width: the spread pays for the risk — one roll\'s standard deviation is ≈ 1.71, the 0.2 margin only becomes revenue when repeated',
      'Keep the quote alive: if the jury lifts the ask twice, requote higher — the flow is information (adverse selection)',
    ],
    pointsAttendus: [
      'La séquence non négociable : l\'espérance d\'abord — (6 + 1)/2 = 3,5 — en écartant le piège du « milieu des faces » lu trop vite comme 3',
      'La cotation symétrique : 3,3/3,7 — une fourchette décentrée annonce un avis directionnel, absurde sur un dé',
      'La largeur défendue : σ ≈ 1,71 sur UN lancer — la marge de 0,2 par trade est minuscule face à ce bruit ; le métier du teneur de marché est une loi des grands nombres (m1)',
      'Les deux cotations qui disqualifient : 1/6 (refuser de coter en faisant semblant — personne ne traite) et 3,5/3,5 (travailler gratuitement en portant le risque)',
      'Le moment de vérité : « je vous lève l\'ask » — vendu à 3,7 un flux qui vaut 3,5, +0,2 d\'espérance ; mais s\'il traite encore, requoter 3,5/3,9 — celui qui traite contre vous est peut-être mieux informé',
      'Ce qui est réellement testé : moins le premier prix que le deuxième',
    ],
    pointsAttendusEn: [
      'The non-negotiable sequence: expectation first — (6 + 1)/2 = 3.5 — dismissing the "middle of the faces" trap read too fast as 3',
      'The symmetric quote: 3.3/3.7 — an off-centre spread announces a directional view, absurd on a die',
      'The width defended: σ ≈ 1.71 on ONE roll — the 0.2 margin per trade is tiny against that noise; the market maker\'s trade is a law of large numbers (m1)',
      'The two disqualifying quotes: 1/6 (refusing to quote while pretending — nobody trades) and 3.5/3.5 (working for free while carrying the risk)',
      'The moment of truth: "I lift your ask" — sold at 3.7 a flow worth 3.5, +0.2 of expectation; but if he trades again, requote 3.5/3.9 — whoever trades against you may be better informed',
      'What is actually tested: less your first price than your second',
    ],
    bonus: [
      'Le chiffre de la largeur si le jury creuse : σ = √(35/12) ≈ 1,71 — la variance d\'un d6 se calcule en trois lignes, et la citer de tête impressionne',
      'Le pont m1 explicite : requoter après avoir été traité, c\'est la sélection adverse en germe — le market maker vit de la fourchette et meurt de l\'ignorer',
    ],
    bonusEn: [
      'The width number if the jury digs: σ = √(35/12) ≈ 1.71 — a d6\'s variance takes three lines, and quoting it from memory impresses',
      'The explicit m1 bridge: requoting after being traded is adverse selection in embryo — the market maker lives off the spread and dies of ignoring it',
    ],
    reponseModele: `Le premier geste est silencieux : **calculer l'espérance avant d'ouvrir la bouche** — E = (6 + 1)/2 = **3,5**, en évitant le piège du « milieu des faces » lu trop vite comme 3. Un prix annoncé avant ce calcul est un prix au hasard, et aucun desk ne le pardonne.

Puis la cotation : « **3,3 à l'achat, 3,7 à la vente** ». Symétrique autour de 3,5 — une fourchette décentrée annoncerait un avis directionnel, absurde sur un dé — et de largeur défendable : sur un lancer, l'écart-type vaut environ 1,71 ; ma marge de 0,2 par trade est minuscule face à ce bruit et ne devient un revenu que répétée — le teneur de marché est une loi des grands nombres. Les deux cotations qui disqualifient : 1/6, qui refuse de coter en faisant semblant, et 3,5/3,5, qui travaille gratuitement en portant le risque.

Vient le moment de vérité : « je vous lève l'ask ». Vendu à 3,7 un flux qui vaut 3,5 : +0,2, très bien — mais la vraie réponse est la suivante : *pourquoi* a-t-il acheté ? S'il traite encore, je requote **3,5/3,9** : le flux est une information, et celui qui traite contre moi est peut-être mieux informé — la sélection adverse du module 1. Le jury teste moins mon premier prix que mon deuxième.`,
    reponseModeleEn: `The first move is silent: **compute the expectation before opening your mouth** — E = (6 + 1)/2 = **3.5**, avoiding the "middle of the faces" trap read too fast as 3. A price announced before that calculation is a random price, and no desk forgives it.

Then the quote: "**3.3 bid, 3.7 offered**". Symmetric around 3.5 — an off-centre spread would announce a directional view, absurd on a die — and of defensible width: on one roll, the standard deviation is about 1.71; my 0.2 margin per trade is tiny against that noise and only becomes revenue when repeated — the market maker is a law of large numbers. The two disqualifying quotes: 1/6, which refuses to quote while pretending, and 3.5/3.5, which works for free while carrying the risk.

Then comes the moment of truth: "I lift your ask". Sold at 3.7 a flow worth 3.5: +0.2, very good — but the real answer is next: *why* did he buy? If he trades again, I requote **3.5/3.9**: the flow is information, and whoever trades against me may be better informed — module 1\'s adverse selection. The jury tests my second price more than my first.`,
  },
  {
    id: 'm13-j-17',
    moduleId: M13,
    theme: 'les jeux de marché',
    themeEn: 'market games',
    difficulte: 3,
    question: 'Vous lancez un dé ; vous pouvez garder le résultat ou relancer une fois — le second lancer est définitif. Combien vaut ce jeu ?',
    questionEn: 'You roll a die; you may keep the result or reroll once — the second roll is final. How much is this game worth?',
    plan: [
      'Raisonner à rebours, comme pour toute option : le second lancer, seul, vaut E = 3,5',
      'En déduire le seuil : au premier lancer, garder tout ce qui bat 3,5 — c\'est-à-dire 4, 5 ou 6 (moyenne 5) — et relancer 1, 2 ou 3',
      'Calculer : E = ½ × 5 + ½ × 3,5 = 4,25',
      'Énoncer la leçon : le droit de relancer vaut 0,75 — une option a toujours une valeur positive — et anticiper la relance « et avec deux relances ? »',
    ],
    planEn: [
      'Reason backwards, as for any option: the second roll, alone, is worth E = 3.5',
      'Deduce the threshold: on the first roll, keep anything that beats 3.5 — i.e. 4, 5 or 6 (average 5) — and reroll 1, 2 or 3',
      'Compute: E = ½ × 5 + ½ × 3.5 = 4.25',
      'State the lesson: the right to reroll is worth 0.75 — an option always has positive value — and anticipate the follow-up "and with two rerolls?"',
    ],
    pointsAttendus: [
      'Le raisonnement à rebours verbalisé : la valeur de continuation d\'abord (3,5), le seuil de conservation ensuite',
      'Le calcul sec : E = ½ × 5 + ½ × 3,5 = 4,25',
      'La leçon d\'option énoncée explicitement : le droit — sans obligation — de relancer vaut 4,25 − 3,5 = 0,75 (module 8)',
      'La relance quasi systématique du jury anticipée : avec deux relances, la valeur de continuation passe à 4,25 — on ne garde plus que 5 ou 6, et E = 1/3 × 5,5 + 2/3 × 4,25 = 4,666667',
      'Le piège du calcul naïf à deux relances : ½ × 5 + ½ × 4,25 = 4,625 — il oublie que le seuil de conservation MONTE avec la richesse de l\'option',
      'La généralisation en une phrase : plus votre option est riche, plus vous êtes exigeant',
    ],
    pointsAttendusEn: [
      'The backwards reasoning verbalised: the continuation value first (3.5), the keeping threshold next',
      'The dry calculation: E = ½ × 5 + ½ × 3.5 = 4.25',
      'The option lesson stated explicitly: the right — without obligation — to reroll is worth 4.25 − 3.5 = 0.75 (module 8)',
      'The jury\'s near-systematic follow-up anticipated: with two rerolls, the continuation value rises to 4.25 — you only keep 5 or 6, and E = 1/3 × 5.5 + 2/3 × 4.25 = 4.666667',
      'The naive two-reroll trap: ½ × 5 + ½ × 4.25 = 4.625 — it forgets that the keeping threshold RISES with the option\'s richness',
      'The one-sentence generalisation: the richer your option, the more demanding you are',
    ],
    bonus: [
      'Repérer seul le changement de stratégie à deux relances est, selon le chapitre, « la différence entre une bonne réponse et une embauche »',
      'Le pont desk : c\'est la valeur temps d\'une option américaine en miniature — exercer tôt, c\'est renoncer à la continuation ; on ne le fait que si le sous-jacent bat la valeur d\'attente',
    ],
    bonusEn: [
      'Spotting the strategy change at two rerolls on your own is, per the chapter, "the difference between a good answer and a hire"',
      'The desk bridge: this is an American option\'s time value in miniature — exercising early means giving up the continuation; you only do it if the underlying beats the waiting value',
    ],
    reponseModele: `« Je raisonne à rebours, comme pour toute option. » Le second lancer, seul, vaut E = **3,5** — c'est ma valeur de continuation. Au premier lancer, je garde donc tout résultat qui la bat : **4, 5 ou 6**, de moyenne 5, et je relance 1, 2 ou 3. D'où, à voix haute : E = ½ × 5 + ½ × 3,5 = **4,25**.

Puis la leçon, car c'est elle que le jury attend : le droit de relancer vaut 4,25 − 3,5 = **0,75**. Une option — le droit sans l'obligation — a toujours une valeur positive, même si elle n'est jamais exercée à perte : c'est le module 8 sur une table de jeu.

Et j'anticipe la relance quasi systématique : « et avec *deux* relances ? » Le calcul naïf enchaîne ½ × 5 + ½ × 4,25 = 4,625 — et il est faux : avec deux relances en poche, ma valeur de continuation au premier lancer est 4,25, je ne garde donc plus que **5 ou 6** (moyenne 5,5, probabilité 1/3) : E = 1/3 × 5,5 + 2/3 × 4,25 = **4,666667**. Le seuil de conservation *monte* avec le nombre de relances restantes — plus mon option est riche, plus je suis exigeant. Repérer seul ce changement de stratégie est la différence entre une bonne réponse et une embauche.`,
    reponseModeleEn: `"I reason backwards, as for any option." The second roll, alone, is worth E = **3.5** — that is my continuation value. On the first roll, I therefore keep any result that beats it: **4, 5 or 6**, averaging 5, and I reroll 1, 2 or 3. Hence, out loud: E = ½ × 5 + ½ × 3.5 = **4.25**.

Then the lesson, because that is what the jury is waiting for: the right to reroll is worth 4.25 − 3.5 = **0.75**. An option — the right without the obligation — always has positive value, even if it is never exercised at a loss: module 8 on a game table.

And I anticipate the near-systematic follow-up: "and with *two* rerolls?" The naive calculation chains ½ × 5 + ½ × 4.25 = 4.625 — and it is wrong: with two rerolls in hand, my continuation value at the first roll is 4.25, so I only keep **5 or 6** (average 5.5, probability 1/3): E = 1/3 × 5.5 + 2/3 × 4.25 = **4.666667**. The keeping threshold *rises* with the number of rerolls left — the richer my option, the more demanding I am. Spotting that strategy change on your own is the difference between a good answer and a hire.`,
  },
  {
    id: 'm13-j-18',
    moduleId: M13,
    theme: 'les jeux de marché',
    themeEn: 'market games',
    difficulte: 4,
    question: 'Je vous offre une cote de 5 pour 1 sur un événement dont nous savons tous les deux qu\'il a 25 % de chances. Vous misez combien ?',
    questionEn: 'I offer you odds of 5 for 1 on an event we both know has a 25% chance. How much do you bet?',
    plan: [
      'Annoncer la convention et extraire la probabilité implicite : « pour 1 », donc 1/cote = 1/5 = 20 % — sous mes 25 % : le pari a un edge',
      'Chiffrer l\'edge : 0,25 × 5 = 1,25 par euro misé, soit +25 % d\'espérance',
      'Refuser le tout-mise : une séquence perdante — certaine à force de répéter — sort du jeu avant que la loi des grands nombres ne paie',
      'Dimensionner : Kelly f* = (bp − q)/b avec b = 4 (gain net) ⇒ (4 × 0,25 − 0,75)/4 = 6,25 % du capital — en pratique demi-Kelly, ~3 %, car l\'edge est estimé',
    ],
    planEn: [
      'State the convention and extract the implied probability: "for 1", so 1/odds = 1/5 = 20% — below my 25%: the bet has an edge',
      'Number the edge: 0.25 × 5 = 1.25 per euro staked, i.e. +25% of expectation',
      'Refuse the all-in: a losing streak — certain given enough repetition — knocks you out before the law of large numbers pays',
      'Size it: Kelly f* = (bp − q)/b with b = 4 (net gain) ⇒ (4 × 0.25 − 0.75)/4 = 6.25% of capital — in practice half-Kelly, ~3%, because the edge is estimated',
    ],
    pointsAttendus: [
      'La convention énoncée avant tout calcul : cote « pour 1 » (toucher 5, mise comprise, pour 1 misé) — la confondre avec « contre 1 » fausse tout',
      'La probabilité implicite : 1/5 = 20 %, contre 25 % de probabilité réelle — le prix contient une probabilité, il suffit de l\'inverser, exactement la PD implicite d\'un spread au m5',
      'L\'edge chiffré : espérance 0,25 × 5 = 1,25 par euro, soit +0,25 — et le dire : identifier l\'edge n\'est que la moitié de la réponse',
      'Le refus argumenté du tout-mise : l\'espérance positive ne protège pas de la ruine — perdre 50 % exige +100 % pour revenir, l\'asymétrie des rendements composés',
      'Kelly déroulé proprement : b = 4 (la cote pour 1 moins la mise), f* = (bp − q)/b = (1 − 0,75)/4 = 6,25 % du capital',
      'L\'humilité finale : demi-Kelly en pratique (~3 %), car l\'edge est estimé, pas connu — surestimer son edge avec du plein Kelly est fatal',
    ],
    pointsAttendusEn: [
      'The convention stated before any calculation: odds "for 1" (receive 5, stake included, per 1 staked) — confusing it with "to 1" wrecks everything',
      'The implied probability: 1/5 = 20%, against a true 25% — the price contains a probability, you just invert it, exactly the implied PD of a spread in m5',
      'The edge numbered: expectation 0.25 × 5 = 1.25 per euro, i.e. +0.25 — and saying it: spotting the edge is only half the answer',
      'The argued refusal of the all-in: positive expectation does not protect from ruin — losing 50% requires +100% to recover, the asymmetry of compounded returns',
      'Kelly unrolled cleanly: b = 4 (the for-1 odds minus the stake), f* = (bp − q)/b = (1 − 0.75)/4 = 6.25% of capital',
      'The final humility: half-Kelly in practice (~3%), because the edge is estimated, not known — overestimating your edge on full Kelly is fatal',
    ],
    bonus: [
      'La phrase qui sonne desk : « je mise petit, et je répète » — la taille de la position est une décision distincte de son sens, et souvent la plus importante des deux (m12)',
      'Le mécanisme de l\'over-Kelly si le jury creuse : au-delà de f*, l\'espérance par coup monte encore mais la croissance composée du capital chute, jusqu\'à devenir négative — trop miser transforme un jeu gagnant en ruine quasi certaine',
    ],
    bonusEn: [
      'The sentence that sounds like a desk: "I bet small, and I repeat" — position size is a decision distinct from direction, and often the more important of the two (m12)',
      'The over-Kelly mechanism if the jury digs: beyond f*, the per-bet expectation keeps rising but the compounded growth of capital falls, eventually turning negative — overbetting turns a winning game into near-certain ruin',
    ],
    reponseModele: `D'abord la convention, à voix haute : « cote 5 **pour 1** — je touche 5, mise comprise, pour 1 misé ». La probabilité implicite de ce prix est 1/5 = **20 %** ; l'événement est à 25 % : le pari a un **edge**. Chiffré : 0,25 × 5 = 1,25 par euro misé, soit **+25 % d'espérance** — c'est la PD implicite du module 5 appliquée à une table de jeu : le prix contient une probabilité, je l'inverse et je la compare à la mienne.

Mais l'edge n'est que la moitié de la réponse — la question est « combien ». Sûrement pas tout : l'espérance positive ne protège pas de la ruine — une séquence perdante, certaine à force de répéter, me sort du jeu avant que la loi des grands nombres ne paie, et perdre 50 % exige +100 % pour revenir. Le dimensionnement a un nom : **Kelly**. Avec b = 4 — le gain net, la cote moins la mise — : f* = (bp − q)/b = (4 × 0,25 − 0,75)/4 = **6,25 % du capital**.

Et l'humilité finale, qui fait la réponse de desk : en pratique **demi-Kelly**, autour de 3 %, parce que l'edge est estimé, pas connu — surestimer son edge avec du plein Kelly est fatal ; au-delà de f*, la croissance composée du capital chute jusqu'à devenir négative. « Je mise petit, et je répète » : la taille est une décision distincte du sens, et souvent la plus importante des deux.`,
    reponseModeleEn: `The convention first, out loud: "odds of 5 **for 1** — I receive 5, stake included, per 1 staked". The implied probability of that price is 1/5 = **20%**; the event sits at 25%: the bet has an **edge**. Numbered: 0.25 × 5 = 1.25 per euro staked, i.e. **+25% of expectation** — module 5\'s implied PD applied to a game table: the price contains a probability, I invert it and compare it to mine.

But the edge is only half the answer — the question is "how much". Certainly not everything: positive expectation does not protect from ruin — a losing streak, certain given enough repetition, knocks me out before the law of large numbers pays, and losing 50% requires +100% to recover. The sizing has a name: **Kelly**. With b = 4 — the net gain, the odds minus the stake —: f* = (bp − q)/b = (4 × 0.25 − 0.75)/4 = **6.25% of capital**.

And the final humility, which makes it a desk answer: in practice **half-Kelly**, around 3%, because the edge is estimated, not known — overestimating your edge on full Kelly is fatal; beyond f*, the compounded growth of capital falls until it turns negative. "I bet small, and I repeat": size is a decision distinct from direction, and often the more important of the two.`,
  },
  {
    id: 'm13-j-19',
    moduleId: M13,
    theme: 'défendre son parcours',
    themeEn: 'defending your background',
    difficulte: 2,
    question: 'Présentez-vous en 90 secondes.',
    questionEn: 'Introduce yourself in 90 seconds.',
    plan: [
      'Dérouler les quatre blocs canoniques : d\'où je viens (une phrase — le jury a le CV), le déclic (le moment précis), ce que j\'ai construit (les preuves), pourquoi ici (le spécifique)',
      'Tenir la règle d\'écriture : un fait vérifiable par phrase, jamais un adjectif — « j\'ai backtesté une stratégie momentum sur dix ans de données », pas « je suis passionné »',
      'Calibrer le métrage : 90 secondes, chronométrées en préparation — et savoir couper si le langage corporel du jury le demande',
      'Conclure sur le « pourquoi ici » et se taire : un bon pitch écrit les cinq premières questions du jury à votre place',
    ],
    planEn: [
      'Unroll the four canonical blocks: where I come from (one sentence — the jury has the CV), the trigger (the precise moment), what I have built (the proofs), why here (the specific)',
      'Hold the writing rule: one verifiable fact per sentence, never an adjective — "I backtested a momentum strategy on ten years of data", not "I am passionate"',
      'Calibrate the length: 90 seconds, timed in preparation — and know how to cut short if the jury\'s body language asks for it',
      'Close on the "why here" and stop talking: a good pitch writes the jury\'s first five questions for you',
    ],
    pointsAttendus: [
      'La structure en quatre blocs, reconnaissable et tenue — le jury doit pouvoir suivre la progression',
      'La règle du fait vérifiable : l\'adjectif (« passionné », « rigoureux ») est ce que diront les quarante candidats du jour — il glisse sans laisser de trace ; le fait se date, se discute, et appelle des questions',
      'Ne pas lire le CV : le jury l\'a sous les yeux — la chronologie récitée est du temps mort',
      'Le pitch comme piège à questions : chaque fait cité appelle les questions que VOUS avez préparées — quelles données, quel biais de survivance, quel Sharpe (m12)',
      'Les trois métrages du même pitch : 30 secondes, 90 secondes, 3 minutes — mêmes blocs, mêmes faits, seule la profondeur change',
      'La répétition à voix haute, debout, chronomètre en main — la différence entre un pitch pensé et un pitch dit est celle qui se voit le jour J',
    ],
    pointsAttendusEn: [
      'The four-block structure, recognisable and held — the jury must be able to follow the progression',
      'The verifiable-fact rule: the adjective ("passionate", "rigorous") is what all forty candidates of the day will say — it slides off without a trace; the fact can be dated, discussed, and calls questions',
      'Not reading the CV: the jury has it in front of them — recited chronology is dead time',
      'The pitch as a question trap: every fact cited calls the questions YOU have prepared — which data, which survivorship bias, which Sharpe (m12)',
      'The three lengths of the same pitch: 30 seconds, 90 seconds, 3 minutes — same blocks, same facts, only the depth changes',
      'Rehearsal out loud, standing, stopwatch in hand — the difference between a pitch thought and a pitch spoken is the one that shows on the day',
    ],
    bonus: [
      'Le crible du brouillon : toute phrase contenant « passionné », « rigoureux » ou « motivé » sans fait derrière se réécrit ou se supprime — l\'adjectif est une conclusion que le jury doit tirer lui-même ; votre travail est de fournir les prémisses',
      'Savoir couper court est déjà un signal de desk : on répond à un trader entre deux cotations, pas à un amphithéâtre',
    ],
    bonusEn: [
      'The draft sieve: any sentence containing "passionate", "rigorous" or "motivated" without a fact behind it gets rewritten or cut — the adjective is a conclusion the jury must draw itself; your job is to supply the premises',
      'Knowing how to cut short is already a desk signal: you answer a trader between two quotes, not a lecture hall',
    ],
    reponseModele: `La performance attendue est un pitch en **quatre blocs**, 90 secondes chronométrées. **D'où je viens** : une phrase — le jury a le CV sous les yeux, le lui lire est du temps mort. **Le déclic** : le moment précis où les marchés sont devenus mon sujet — daté, situé, racontable. **Ce que j'ai construit** : les preuves — stages, projets, travaux. **Pourquoi ici** : ce que cette compétition ou ce desk a de spécifique à mes yeux.

Et une règle d'écriture gouverne chaque phrase : **un fait vérifiable, jamais un adjectif**. « Je suis passionné de finance » est ce que diront les quarante candidats du jour — la phrase glisse sans laisser de trace. « J'ai backtesté une stratégie momentum sur dix ans de données » se date, se discute, et surtout *appelle des questions* : quelles données, quel biais de survivance, quel Sharpe ? C'est exactement le but : un pitch réussi écrit les cinq premières questions du jury à ma place, sur un terrain préparé.

Le reste est de la discipline : trois métrages du même pitch — 30 secondes, 90 secondes, 3 minutes, mêmes blocs, seule la profondeur change — répétés à voix haute, debout, chronomètre en main, car la différence entre un pitch pensé et un pitch dit est celle qui se voit le jour J. Et la clôture nette : le « pourquoi ici », puis le silence — savoir couper court est déjà un signal de desk.`,
    reponseModeleEn: `The expected performance is a pitch in **four blocks**, 90 timed seconds. **Where I come from**: one sentence — the jury has the CV in front of them, reading it to them is dead time. **The trigger**: the precise moment markets became my subject — dated, situated, tellable. **What I have built**: the proofs — internships, projects, work produced. **Why here**: what this competition or this desk specifically means to me.

And one writing rule governs every sentence: **a verifiable fact, never an adjective**. "I am passionate about finance" is what all forty candidates of the day will say — the sentence slides off without a trace. "I backtested a momentum strategy on ten years of data" can be dated, discussed, and above all *calls questions*: which data, which survivorship bias, which Sharpe? That is exactly the goal: a successful pitch writes the jury\'s first five questions for me, on prepared ground.

The rest is discipline: three lengths of the same pitch — 30 seconds, 90 seconds, 3 minutes, same blocks, only the depth changes — rehearsed out loud, standing, stopwatch in hand, because the difference between a pitch thought and a pitch spoken is the one that shows on the day. And the clean close: the "why here", then silence — knowing how to cut short is already a desk signal.`,
  },
  {
    id: 'm13-j-20',
    moduleId: M13,
    theme: 'défendre son parcours',
    themeEn: 'defending your background',
    difficulte: 2,
    question: 'Pourquoi la finance de marché ?',
    questionEn: 'Why financial markets?',
    plan: [
      'Écarter mentalement les trois réponses qui condamnent : l\'argent (annonce un départ au premier chiffre plus gros), le prestige (répond à l\'image, pas au métier), l\'adrénaline (se décrire comme un risque opérationnel)',
      'Donner un moment précis : la situation datée où les marchés sont devenus votre sujet',
      'Enchaîner la preuve par l\'action : ce que vous avez FAIT ensuite — lu, construit, reconstitué, décortiqué',
      'Citer un mécanisme exact qui vous a accroché — un CDS qui sépare le risque de crédit de l\'obligation (m5), la parité couverte des taux (m6) — et conclure en une phrase',
    ],
    planEn: [
      'Mentally rule out the three condemning answers: money (announces a departure at the first bigger number), prestige (answers the image, not the job), adrenaline (describing yourself as an operational risk)',
      'Give one precise moment: the dated situation where markets became your subject',
      'Chain the proof by action: what you DID next — read, built, reconstructed, dissected',
      'Cite one exact mechanism that hooked you — a CDS separating credit risk from the bond that carries it (m5), covered interest parity (m6) — and close in one sentence',
    ],
    pointsAttendus: [
      'Les trois réponses condamnées connues et évitées — l\'adrénaline étant la pire : un desk cherche des gens calmes sous pression, et venir chercher des sensations, c\'est se décrire comme un risque opérationnel (m11)',
      'La mécanique en deux temps : un moment précis, puis la réaction — le moment seul ne suffit pas (tout le monde a « découvert la finance » quelque part), c\'est l\'action qui informe',
      'Le mécanisme cité avec précision : la précision du mécanisme est le meilleur proxy de la réalité de votre curiosité — « les marchés » ou « l\'investissement » ne disent rien',
      'Le fait vérifiable partout : chaque étape de la réponse doit pouvoir être datée et discutée',
      'La réponse comme terrain préparé : le mécanisme cité appelle les questions techniques que vous maîtrisez',
    ],
    pointsAttendusEn: [
      'The three condemned answers known and avoided — adrenaline being the worst: a desk wants people calm under pressure, and coming for thrills is describing yourself as an operational risk (m11)',
      'The two-step mechanics: one precise moment, then the reaction — the moment alone is not enough (everyone "discovered finance" somewhere), the action is what informs',
      'The mechanism cited with precision: the precision of the cited mechanism is the best proxy for the reality of your curiosity — "markets" or "investing" say nothing',
      'The verifiable fact everywhere: every step of the answer must be datable and discussable',
      'The answer as prepared ground: the cited mechanism calls the technical questions you master',
    ],
    bonus: [
      'L\'exemple avant/après du chapitre : le client qui refuse un produit à capital garanti → reconstituer le montage (le zéro-coupon qui porte la garantie, le budget d\'options restant) → comprendre que le niveau des taux fabrique la générosité de la formule (m9, m10) — un moment daté, une action vérifiable, un mécanisme exact',
    ],
    bonusEn: [
      'The chapter\'s before/after example: the client refusing a capital-guaranteed product → reconstructing the assembly (the zero-coupon carrying the guarantee, the remaining options budget) → realising that the level of rates manufactures the formula\'s generosity (m9, m10) — a dated moment, a verifiable action, an exact mechanism',
    ],
    reponseModele: `Trois réponses condamnent d'emblée, et il faut les connaître pour les éviter : **l'argent** — le jury connaît la grille des juniors mieux que moi, et un mobile pécuniaire annonce un départ dès qu'un chiffre plus gros s'affichera ailleurs ; **le prestige** — il avoue qu'on répond à l'image du métier, pas au métier ; **l'adrénaline** — la pire : un desk cherche des gens *calmes* sous pression, et venir chercher des sensations, c'est se décrire comme un risque opérationnel (module 11).

La bonne réponse tient en deux temps : **un moment précis, puis ce que j'ai fait ensuite**. Le moment seul ne suffit pas — tout le monde a « découvert la finance » quelque part ; c'est la réaction qui informe. Exemple calibré : « en stage, j'ai vu un client refuser un produit à capital garanti pour son coupon trop faible ; j'ai voulu comprendre d'où venait ce coupon — le zéro-coupon qui porte la garantie, le budget d'options restant — et j'ai réalisé que le niveau des taux fabriquait la générosité de la formule. Ce lien entre une banque centrale et une vitrine d'épargne m'a décidé. »

Un moment daté, une action vérifiable, un **mécanisme exact** : la précision du mécanisme cité est le meilleur proxy de la réalité de la curiosité — et elle attire les questions suivantes sur un terrain préparé. Conclure en une phrase, et se taire.`,
    reponseModeleEn: `Three answers condemn you outright, and you must know them to avoid them: **money** — the jury knows the junior pay grid better than I do, and a purely pecuniary motive announces a departure as soon as a bigger number shows elsewhere; **prestige** — it confesses you are answering the image of the job, not the job; **adrenaline** — the worst: a desk wants people *calm* under pressure, and coming for thrills is describing yourself as an operational risk (module 11).

The good answer takes two steps: **one precise moment, then what I did next**. The moment alone is not enough — everyone "discovered finance" somewhere; the reaction is what informs. Calibrated example: "during an internship, I watched a client refuse a capital-guaranteed product because the coupon looked too small; I wanted to understand where that coupon came from — the zero-coupon carrying the guarantee, the remaining options budget — and I realised the level of rates was manufacturing the formula\'s generosity. That link between a central bank and a savings-product shop window made up my mind."

A dated moment, a verifiable action, an **exact mechanism**: the precision of the cited mechanism is the best proxy for the reality of your curiosity — and it draws the next questions onto prepared ground. Close in one sentence, and stop talking.`,
  },
  {
    id: 'm13-j-21',
    moduleId: M13,
    theme: 'défendre son parcours',
    themeEn: 'defending your background',
    difficulte: 3,
    question: 'Racontez-moi un échec.',
    questionEn: 'Tell me about a failure.',
    plan: [
      'Le fait : un échec précis, daté, réel — choisi à l\'avance pour tenir trois questions de profondeur',
      'Votre part : ce qui relevait de vous, assumé sans diluer dans le contexte',
      'Le changement : le comportement observable adopté depuis — vérifiable, pas déclaratif',
      'Clore en une phrase, sans excuse prolongée — et se taire',
    ],
    planEn: [
      'The fact: a precise, dated, real failure — chosen in advance to withstand three questions of depth',
      'Your share: what was down to you, owned without diluting into context',
      'The change: the observable behaviour adopted since — verifiable, not declarative',
      'Close in one sentence, without prolonged apology — and stop talking',
    ],
    pointsAttendus: [
      'La structure en trois temps : le fait, votre part, ce que vous avez changé — la seule qui fonctionne',
      'Le piège du faux échec écarté : « je travaille trop », « je suis trop perfectionniste » — le jury le lit comme un refus de répondre, donc comme l\'incapacité à regarder ses erreurs en face',
      'La part assumée sans dilution : reporter l\'échec sur le contexte est la variante molle du même refus',
      'Le changement observable : un comportement concret adopté depuis, pas une intention — « depuis, je fais relire mes chiffres avant toute réunion » se vérifie ; « j\'ai appris à mieux communiquer » ne se vérifie pas',
      'Le pont m11 explicite : les catastrophes naissent des erreurs NON RECONNUES — cette question anodine teste exactement la compétence dont vit un desk',
      'Le calibrage : un vrai échec bien raconté rapporte des points ; un faux échec en coûte',
    ],
    pointsAttendusEn: [
      'The three-step structure: the fact, your share, what you changed — the only one that works',
      'The fake-failure trap dismissed: "I work too hard", "I am too much of a perfectionist" — the jury reads it as a refusal to answer, hence as an inability to look one\'s errors in the face',
      'The share owned without dilution: blaming the context is the soft variant of the same refusal',
      'The observable change: a concrete behaviour adopted since, not an intention — "since then, I have my numbers double-checked before any meeting" can be verified; "I learned to communicate better" cannot',
      'The explicit m11 bridge: catastrophes are born from UNACKNOWLEDGED errors — this innocuous question tests exactly the skill a desk lives on',
      'The calibration: a real failure well told earns points; a fake failure costs them',
    ],
    bonus: [
      'La cohérence avec le jour J : c\'est la même compétence que l\'auto-correction à voix haute après un signe faux (ch7) — le jury recoupe le déclaratif et l\'observé, et les deux doivent raconter le même candidat',
      'Choisir l\'échec comme on choisit une ligne de CV : chaque détail doit tenir trois questions de profondeur, sinon changer d\'exemple',
    ],
    bonusEn: [
      'The consistency with the day itself: it is the same skill as the out-loud self-correction after a wrong sign (ch7) — the jury cross-checks the declared and the observed, and both must tell the same candidate',
      'Choose the failure like a CV line: every detail must withstand three questions of depth, otherwise change examples',
    ],
    reponseModele: `La structure attendue tient en trois temps, et elle est la seule qui fonctionne. **Le fait** : un échec précis, daté, réel — pas une généralité. **Ma part** : ce qui relevait de moi, assumé sans dilution — reporter l'échec sur le contexte est un refus de répondre en version molle. **Le changement** : le comportement observable adopté depuis — pas une intention (« j'ai appris à mieux communiquer » ne se vérifie pas), un geste concret (« depuis, je fais relire mes chiffres avant toute réunion » se vérifie). Puis clore en une phrase, sans excuse prolongée.

Le piège à éviter porte un nom : le **faux échec** — « je travaille trop », « je suis trop perfectionniste ». Le jury le lit instantanément comme un refus de répondre, c'est-à-dire comme l'incapacité à faire ce que le desk fait toute la journée : regarder ses erreurs en face. Le module 11 l'a montré en creux — les catastrophes financières ne naissent pas des erreurs, elles naissent des erreurs *non reconnues*, maintenues, cachées. Cette question anodine teste exactement cette compétence-là.

Le calibrage final : un vrai échec bien raconté *rapporte* des points ; un faux échec en coûte. Et la cohérence compte : le jury recoupera ce récit avec mon comportement en direct — la reprise après une erreur au tableau raconte la même chose que cette réponse, et les deux doivent dire le même candidat.`,
    reponseModeleEn: `The expected structure takes three steps, and it is the only one that works. **The fact**: a precise, dated, real failure — not a generality. **My share**: what was down to me, owned without dilution — blaming the context is a refusal to answer in soft form. **The change**: the observable behaviour adopted since — not an intention ("I learned to communicate better" cannot be verified), a concrete move ("since then, I have my numbers double-checked before any meeting" can). Then close in one sentence, without prolonged apology.

The trap to avoid has a name: the **fake failure** — "I work too hard", "I am too much of a perfectionist". The jury instantly reads it as a refusal to answer, that is, as an inability to do what the desk does all day: look its errors in the face. Module 11 showed it in relief — financial catastrophes are not born from errors, they are born from *unacknowledged* errors, maintained, hidden. This innocuous question tests exactly that skill.

The final calibration: a real failure well told *earns* points; a fake failure costs them. And consistency matters: the jury will cross-check this story against my live behaviour — the recovery after a mistake at the board tells the same story as this answer, and both must describe the same candidate.`,
  },
  {
    id: 'm13-j-22',
    moduleId: M13,
    theme: 'défendre son parcours',
    themeEn: 'defending your background',
    difficulte: 3,
    question: 'Donnez-moi une conviction de marché.',
    questionEn: 'Give me a market view.',
    plan: [
      'La thèse en une phrase — contestable, c\'est très bien : le jury note la méthode, pas la direction',
      'Le mécanisme qui la porte, relié à ce qu\'on sait — transmission monétaire, cycle du crédit, valorisation — avec le niveau actuel de la variable clé',
      'La condition d\'invalidation : le niveau ou l\'événement qui ferait changer d\'avis — sans elle, ce n\'est pas une conviction, c\'est une opinion',
      'Conclure en une ligne et laisser le jury creuser — le terrain est préparé',
    ],
    planEn: [
      'The thesis in one sentence — contestable is perfectly fine: the jury grades the method, not the direction',
      'The mechanism carrying it, tied to what you know — monetary transmission, credit cycle, valuation — with the current level of the key variable',
      'The invalidation condition: the level or event that would change your mind — without it, this is not a conviction, it is an opinion',
      'Close in one line and let the jury dig — the ground is prepared',
    ],
    pointsAttendus: [
      'Les trois étages : thèse, mécanisme, invalidation — le troisième est ce que le jury note réellement',
      'Le chiffre de départ : donner le niveau actuel de la variable clé (la pente, le taux directeur, le spread) — une conviction sans chiffre de départ est une carte sans échelle',
      'Un exemple construit type : « la courbe devrait se repentifier — le cycle de baisse ancre la partie courte, l\'offre longue (déficits, QT) pèse sur la longue (m10) ; j\'invalide si le marché monétaire cesse de pricer des baisses sur douze mois »',
      'La direction secondaire : un jury préfère une thèse contestable et falsifiable à un consensus récité — il ne note pas la vue, il note l\'architecture',
      'Les deux camps connus : pouvoir exposer honnêtement la thèse adverse est le signal de maturité le plus net qu\'un candidat puisse émettre',
    ],
    pointsAttendusEn: [
      'The three storeys: thesis, mechanism, invalidation — the third is what the jury actually grades',
      'The starting number: give the current level of the key variable (the slope, the policy rate, the spread) — a conviction without its starting number is a map without a scale',
      'A typical built example: "the curve should re-steepen — the cutting cycle anchors the short end, long supply (deficits, QT) weighs on the long end (m10); I invalidate if the money market stops pricing cuts over twelve months"',
      'Direction secondary: a jury prefers a contestable, falsifiable thesis to a recited consensus — it does not grade your view, it grades your architecture',
      'Both camps known: being able to expose the opposing thesis honestly is the clearest maturity signal a candidate can send',
    ],
    bonus: [
      'Le pont avec tout le cours : raisonner en mécanismes falsifiables est LA méthode enseignée depuis le module 1 — cette question vérifie qu\'elle a pris',
      'La mise à jour de dernière semaine : la conviction fait partie des trois sujets d\'actualité à rafraîchir avec les derniers chiffres — c\'est la seule partie de la préparation qui périme',
    ],
    bonusEn: [
      'The bridge with the whole course: reasoning in falsifiable mechanisms is THE method taught since module 1 — this question checks that it took',
      'The last-week refresh: the conviction belongs to the three current-affairs topics to update with the latest numbers — the only part of the preparation that expires',
    ],
    reponseModele: `Le format attendu a **trois étages**, et le troisième est celui qui est réellement noté. **La thèse**, une phrase : « la courbe des taux devrait se repentifier d'ici un an ». Seule, elle vaut zéro — un pile ou face. **Le mécanisme** : le cycle de baisse des taux directeurs ancre la partie courte, pendant que l'offre obligataire longue — déficits à financer, banques centrales en QT qui n'absorbent plus le papier (module 10) — maintient la pression sur la partie longue ; et je donne le niveau du jour de la pente 2-10 ans, car une conviction sans chiffre de départ est une carte sans échelle. **L'invalidation** : si l'inflation réaccélère au point de faire repricer des hausses, la partie courte remonte et la thèse casse — je changerais d'avis si le marché monétaire cessait de pricer des baisses sur douze mois.

Sans ce troisième étage, ce n'est pas une conviction : c'est une opinion. Et le point que les candidats ratent : la *direction* importe peu — le jury préfère une thèse contestable et falsifiable à un consensus récité, parce qu'il ne note pas ma vue, il note ma méthode. Le raffinement qui distingue : exposer honnêtement les arguments du camp adverse — le signal de maturité le plus net qu'un candidat puisse émettre. Puis conclure en une ligne, et laisser le jury creuser : le terrain est préparé.`,
    reponseModeleEn: `The expected format has **three storeys**, and the third is the one actually graded. **The thesis**, one sentence: "the yield curve should re-steepen within a year". Alone, it is worth zero — a coin flip. **The mechanism**: the policy-rate cutting cycle anchors the short end, while long-dated bond supply — deficits to finance, central banks in QT no longer absorbing the paper (module 10) — keeps pressure on the long end; and I give today\'s level of the 2-10 slope, because a conviction without its starting number is a map without a scale. **The invalidation**: if inflation re-accelerates to the point of repricing hikes, the short end moves back up and the thesis breaks — I would change my mind if the money market stopped pricing cuts over twelve months.

Without that third storey, this is not a conviction: it is an opinion. And the point candidates miss: the *direction* matters little — the jury prefers a contestable, falsifiable thesis to a recited consensus, because it does not grade my view, it grades my method. The distinguishing refinement: exposing the opposing camp\'s arguments honestly — the clearest maturity signal a candidate can send. Then close in one line, and let the jury dig: the ground is prepared.`,
  },
  {
    id: 'm13-j-23',
    moduleId: M13,
    theme: 'le jour J',
    themeEn: 'the big day',
    difficulte: 2,
    question: 'Le jury vous pose une question dont vous ignorez complètement la réponse. Que faites-vous ?',
    questionEn: 'The jury asks you a question you simply cannot answer. What do you do?',
    plan: [
      'Connaître la hiérarchie avant d\'entrer : l\'invention est la pire issue — la précision fausse se détecte instantanément et contamine rétroactivement tout ce qui a été dit de juste',
      'La forme en deux temps : « je ne connais pas ce point précis ; voici comment je le raisonnerais »',
      'Dérouler les réflexes des chapitres 1 et 2 : borner l\'ordre de grandeur, décomposer en morceaux dont certains sont connus, proposer une démarche de vérification',
      'Conclure et se taire — un je-ne-sais-pas raisonné marque plus de points qu\'une réponse moyenne récitée',
    ],
    planEn: [
      'Know the hierarchy before entering: invention is the worst outcome — false precision is detected instantly and retroactively contaminates everything said correctly',
      'The two-step form: "I do not know this precise point; here is how I would reason it"',
      'Unroll the chapter 1 and 2 reflexes: bound the order of magnitude, decompose into pieces some of which are known, propose a verification approach',
      'Close and stop talking — a reasoned I-don\'t-know scores more than an average recited answer',
    ],
    pointsAttendus: [
      'La hiérarchie explicite : invention < silence sec < « je ne sais pas » nu < « je ne sais pas » suivi d\'un raisonnement de trente secondes',
      'Pourquoi l\'invention ne se pardonne pas : elle répond à la seule question qui intéresse vraiment le jury — « peut-on se fier à ce que dit ce candidat ? »',
      'Le contenu du raisonnement : borner, décomposer, proposer une vérification — exactement les réflexes du calcul mental et de Fermi, mobilisés sous pression',
      'La transposition desk : c\'est ce qu\'on verra de vous le jour où tombera une question à laquelle personne ne vous a préparé — c\'est-à-dire tous les jours',
      'La technique du niveau au-dessus pour les trous partiels : si le détail échappe, le mécanisme reste — retrouver « environ 70 divisé par le taux » en raisonnant vaut mieux que réciter 72 sans savoir d\'où il vient',
      'Le silence assumé : « laissez-moi dix secondes pour poser le raisonnement » vaut toujours mieux que le remplissage, qui signale la panique',
    ],
    pointsAttendusEn: [
      'The explicit hierarchy: invention < dry silence < bare "I don\'t know" < "I don\'t know" followed by thirty seconds of reasoning',
      'Why invention is unforgivable: it answers the only question the jury really cares about — "can we trust what this candidate says?"',
      'The content of the reasoning: bound, decompose, propose a verification — exactly the mental-arithmetic and Fermi reflexes, mobilised under pressure',
      'The desk transposition: this is what they will see of you the day a question falls that nobody prepared you for — that is, every day',
      'The level-above technique for partial gaps: if the detail escapes, the mechanism remains — recovering "about 70 divided by the rate" by reasoning beats reciting 72 without knowing where it comes from',
      'The owned silence: "give me ten seconds to set up the reasoning" always beats filler, which signals panic',
    ],
    bonus: [
      'L\'exemple des deux candidats du chapitre : même trou de mémoire sur la règle de 72 — A lance deux nombres au hasard, B reconstruit ln 2 ≈ 0,69 ⇒ ~70/taux ⇒ environ douze ans à 6 % ; même mémoire, deux notes opposées',
    ],
    bonusEn: [
      'The chapter\'s two-candidate example: same memory gap on the rule of 72 — A throws out two random numbers, B rebuilds ln 2 ≈ 0.69 ⇒ ~70/rate ⇒ about twelve years at 6%; same memory, two opposite grades',
    ],
    reponseModele: `Il y a une hiérarchie des réponses, et il faut la connaître avant d'entrer dans la salle. La pire, de très loin : **inventer**. Un jury de professionnels détecte la précision fausse instantanément — c'est sa matière quotidienne — et ne la pardonne pas, car elle répond à la seule question qui l'intéresse vraiment : « peut-on se fier à ce que dit ce candidat ? » Une invention détectée contamine rétroactivement tout ce que j'ai dit de juste.

La bonne forme tient en deux temps : « **je ne connais pas ce point précis ; voici comment je le raisonnerais** ». Puis dérouler, trente secondes : **borner** l'ordre de grandeur, **décomposer** le problème en morceaux dont certains sont connus, **proposer une démarche** de vérification — exactement les réflexes du calcul mental et des estimations de Fermi, mobilisés sous pression. Si le vide est total, le silence s'annonce : « laissez-moi dix secondes pour poser le raisonnement » — le silence annoncé signale le contrôle, le remplissage signale la panique.

Ce traitement marque *plus* de points qu'une réponse moyenne récitée, parce qu'il montre au jury exactement ce qu'il verra sur le desk le jour où tombera une question à laquelle personne ne m'a préparé — c'est-à-dire tous les jours. Et pour les trous partiels, la variante : remonter d'un niveau — si la constante échappe, le mécanisme reste, et retrouver « environ 70 divisé par le taux » vaut mieux que réciter 72 sans savoir d'où il vient.`,
    reponseModeleEn: `There is a hierarchy of answers, and you must know it before entering the room. The worst, by far: **inventing**. A jury of professionals detects false precision instantly — it is their daily material — and does not forgive it, because it answers the only question they really care about: "can we trust what this candidate says?" A detected invention retroactively contaminates everything I said correctly.

The right form takes two steps: "**I do not know this precise point; here is how I would reason it**". Then unroll, thirty seconds: **bound** the order of magnitude, **decompose** the problem into pieces some of which are known, **propose an approach** for verification — exactly the mental-arithmetic and Fermi reflexes, mobilised under pressure. If the blank is total, the silence gets announced: "give me ten seconds to set up the reasoning" — announced silence signals control, filler signals panic.

This treatment scores *more* than an average recited answer, because it shows the jury exactly what they will see on the desk the day a question falls that nobody prepared me for — that is, every day. And for partial gaps, the variant: climb one level up — if the constant escapes, the mechanism remains, and recovering "about 70 divided by the rate" beats reciting 72 without knowing where it comes from.`,
  },
  {
    id: 'm13-j-24',
    moduleId: M13,
    theme: 'le jour J',
    themeEn: 'the big day',
    difficulte: 3,
    question: 'En plein calcul au tableau, vous réalisez que vous venez de donner un signe faux. Réaction ?',
    questionEn: 'Mid-calculation at the board, you realise you have just given a wrong sign. Your move?',
    plan: [
      'Se corriger soi-même, immédiatement, à voix haute : « non, je me trompe — le signe est inversé : le payeur fixe GAGNE si les taux montent »',
      'Une phrase, sans excuse ni commentaire — puis reprendre le fil exactement où il était',
      'Savoir pourquoi ce geste rapporte : la détection rapide de ses propres erreurs est littéralement la compétence dont vit un desk',
      'Écarter les deux conduites perdantes : maintenir l\'erreur (le jury a vu) et s\'effondrer en excuses (l\'erreur contamine la suite)',
    ],
    planEn: [
      'Correct yourself, immediately, out loud: "no, I am wrong — the sign is flipped: the fixed payer GAINS if rates rise"',
      'One sentence, no apology, no commentary — then pick up the thread exactly where it was',
      'Know why this move scores: fast detection of one\'s own errors is literally the skill a desk lives on',
      'Rule out the two losing behaviours: maintaining the error (the jury saw) and collapsing into apologies (the error contaminates what follows)',
    ],
    pointsAttendus: [
      'La correction à voix haute, d\'une phrase — l\'un des signaux les plus positifs qu\'un candidat puisse émettre',
      'Ce qui est noté n\'est pas l\'erreur : c\'est la suite — le « et on continue »',
      'Les deux conduites perdantes, symétriques : espérer l\'invisibilité (un jury de professionnels a vu) et l\'excuse prolongée qui perd le fil et contamine les questions suivantes',
      'Le pont m11 : les catastrophes financières naissent des erreurs non reconnues — maintenues, moyennées à la baisse, cachées — pas des erreurs elles-mêmes',
      'La forme exacte : correction, pas de commentaire, reprise — le sang-froid est le message, le signe n\'était que l\'occasion',
    ],
    pointsAttendusEn: [
      'The out-loud correction, in one sentence — one of the most positive signals a candidate can send',
      'What is graded is not the error: it is what follows — the "and we continue"',
      'The two losing behaviours, symmetric: hoping for invisibility (a jury of professionals saw) and the prolonged apology that loses the thread and contaminates the next questions',
      'The m11 bridge: financial catastrophes are born from unacknowledged errors — maintained, averaged down, hidden — not from the errors themselves',
      'The exact form: correction, no commentary, resumption — the composure is the message, the sign was only the occasion',
    ],
    bonus: [
      'La cohérence avec la question « un échec ? » : les deux réponses doivent raconter le même candidat — le jury recoupe le déclaratif et l\'observé',
      'La prévention en amont : le brouillon structuré — poser toutes les données avant de calculer — évite la moitié de ces situations',
    ],
    bonusEn: [
      'The consistency with the "a failure?" question: both answers must tell the same candidate — the jury cross-checks the declared and the observed',
      'The upstream prevention: the structured scratchpad — laying out all the data before computing — avoids half of these situations',
    ],
    reponseModele: `Un seul geste : **me corriger moi-même, immédiatement, à voix haute** — « non, je me trompe : le signe est inversé, le payeur fixe *gagne* si les taux montent, puisqu'il paie un fixe devenu bon marché ». Une phrase, sans excuse ni commentaire, et je reprends le fil exactement où il était. C'est le « et on continue » qui est noté.

Pourquoi ce geste rapporte-t-il autant ? Parce que c'est littéralement la compétence dont vit un desk : détecter ses propres erreurs *vite*, avant qu'elles ne grossissent. Le module 11 l'a montré en creux : les catastrophes financières ne naissent pas des erreurs — tout le monde en fait — mais des erreurs **non reconnues** : maintenues, moyennées à la baisse, cachées dans un tiroir. Le jury ne note pas l'erreur de signe ; il note la vitesse et la propreté de la reprise.

Les deux conduites perdantes sont symétriques. Maintenir l'erreur en espérant l'invisibilité : un jury de professionnels a vu, et le silence devient un mensonge. S'effondrer : les excuses prolongées perdent le fil et laissent l'erreur contaminer les questions suivantes. La correction d'une phrase, elle, transforme l'incident en démonstration : sang-froid, honnêteté, poursuite. Et en amont, la prévention existe : le brouillon structuré — toutes les données posées avant de calculer — évite la moitié de ces situations.`,
    reponseModeleEn: `One move only: **correct myself, immediately, out loud** — "no, I am wrong: the sign is flipped, the fixed payer *gains* if rates rise, since he pays a fixed rate that has become cheap". One sentence, no apology, no commentary, and I pick up the thread exactly where it was. The "and we continue" is what gets graded.

Why does this move score so much? Because it is literally the skill a desk lives on: detecting one\'s own errors *fast*, before they grow. Module 11 showed it in relief: financial catastrophes are not born from errors — everyone makes them — but from **unacknowledged** errors: maintained, averaged down, hidden in a drawer. The jury does not grade the sign error; it grades the speed and cleanliness of the recovery.

The two losing behaviours are symmetric. Maintaining the error hoping for invisibility: a jury of professionals saw, and the silence becomes a lie. Collapsing: prolonged apologies lose the thread and let the error contaminate the next questions. The one-sentence correction, by contrast, turns the incident into a demonstration: composure, honesty, resumption. And upstream, prevention exists: the structured scratchpad — all the data laid out before computing — avoids half of these situations.`,
  },
  {
    id: 'm13-j-25',
    moduleId: M13,
    theme: 'le jour J',
    themeEn: 'the big day',
    difficulte: 4,
    question: 'Le jury vous coupe : « c\'est faux ». Vous êtes sûr d\'avoir raison. Que faites-vous ?',
    questionEn: 'The jury cuts you off: "that is wrong". You are sure you are right. What do you do?',
    plan: [
      'Vérifier calmement avant de défendre : reformuler l\'objection, re-dérouler le point contesté à voix haute — le jury a peut-être vu une vraie erreur, ou teste la tenue sous pression',
      'Si le raisonnement tient, défendre par le MÉCANISME, jamais par l\'autorité : redonner la chaîne causale, avec un cas témoin chiffré',
      'Laisser une porte ouverte sans capituler : « je peux me tromper sur la constante ; le mécanisme, lui, me semble solide, et voici pourquoi »',
      'Clore et rendre la main : proposer de vérifier le point précis et passer — ni s\'éterniser, ni s\'effondrer',
    ],
    planEn: [
      'Verify calmly before defending: reformulate the objection, re-unroll the contested point out loud — the jury may have seen a real error, or may be testing composure under pressure',
      'If the reasoning holds, defend through the MECHANISM, never through authority: restate the causal chain, with a numbered witness case',
      'Leave a door open without capitulating: "I may be wrong on the constant; the mechanism itself seems solid to me, and here is why"',
      'Close and hand back: offer to verify the precise point and move on — neither drag it out nor collapse',
    ],
    pointsAttendus: [
      'Le diagnostic de la situation : cette interruption est souvent un stress test délibéré — le jury dit « c\'est faux » sur une réponse juste pour observer la réaction ; la question testée n\'est pas technique, elle est comportementale',
      'Les deux échecs symétriques : capituler immédiatement (la girouette — abandonner une réponse juste, le jury note l\'absence de colonne vertébrale) et l\'arrogance (corriger le jury sèchement — la colonne « en coûte » du chapitre 7)',
      'La vérification à voix haute d\'abord : reformuler l\'objection et re-dérouler le point — elle protège dans les deux cas : si je me trompais, c\'est l\'auto-correction qui rapporte ; si j\'avais raison, elle donne du poids à la défense',
      'La défense par le mécanisme : la chaîne causale plus un cas témoin chiffré — « prenons n = 2, le résultat se vérifie à la main » — jamais « je suis sûr de moi »',
      'La clôture qui rend la main : « je maintiens le raisonnement ; si un point précis vous semble faux, vérifions-le ensemble » — puis passer, sans s\'éterniser',
      'Ce que le jury note : la méthode du désaccord — exactement celle qu\'exige un desk face à un senior qui conteste votre chiffre : ni plier, ni s\'énerver — vérifier, argumenter, clore',
    ],
    pointsAttendusEn: [
      'The situation diagnosis: this interruption is often a deliberate stress test — the jury says "that is wrong" about a correct answer to watch the reaction; the tested question is not technical, it is behavioural',
      'The two symmetric failures: capitulating immediately (the weathervane — abandoning a correct answer, the jury notes the missing backbone) and arrogance (correcting the jury curtly — the "costs points" column of chapter 7)',
      'The out-loud verification first: reformulate the objection and re-unroll the point — it protects in both cases: if I was wrong, the self-correction is what scores; if I was right, it gives weight to the defence',
      'The defence through the mechanism: the causal chain plus a numbered witness case — "take n = 2, the result checks by hand" — never "I am sure of myself"',
      'The close that hands back: "I stand by the reasoning; if a precise point seems wrong to you, let us verify it together" — then move on, without dragging it out',
      'What the jury grades: the method of disagreement — exactly what a desk demands facing a senior who disputes your number: neither fold nor flare up — verify, argue, close',
    ],
    bonus: [
      'Le pont ch4 : c\'est le symétrique de « accepter l\'indice » — intégrer l\'information nouvelle sans orgueil quand elle est bonne, sans panique quand elle est fausse',
      'La phrase qui tient les deux bouts : « vérifions — si je me trompe, je préfère le voir maintenant qu\'après » — l\'humilité de forme au service de la fermeté de fond',
    ],
    bonusEn: [
      'The ch4 bridge: this is the mirror of "accepting the hint" — integrating new information without pride when it is good, without panic when it is wrong',
      'The sentence that holds both ends: "let us verify — if I am wrong, I would rather see it now than later" — humility of form serving firmness of substance',
    ],
    reponseModele: `Le premier réflexe n'est ni de plier ni de contre-attaquer : c'est de **vérifier calmement, à voix haute**. « Laissez-moi re-dérouler le point que vous contestez. » Je reformule l'objection et je refais le passage — parce que deux scénarios existent : le jury a vu une vraie erreur, ou il teste ma tenue sous pression en disant « c'est faux » sur une réponse juste — le stress test classique. Cette vérification me protège dans les deux cas : si je me trompais, l'auto-correction immédiate rapporte ; si j'avais raison, elle donne du poids à la suite.

Si le raisonnement tient, je défends par le **mécanisme**, jamais par l'autorité : la chaîne causale, pas à pas, et un **cas témoin chiffré** — « prenons n = 2 : le résultat se vérifie à la main ». Jamais « je suis sûr de moi » — la certitude ne se déclare pas, elle se démontre. Et je laisse une porte ouverte sans capituler : « je peux me tromper sur une constante ; le mécanisme, lui, me semble solide, et voici pourquoi. »

Puis **clore et rendre la main** : « si un point précis vous semble faux, vérifions-le ensemble — sinon je poursuis. » Ni l'effondrement de la girouette qui abandonne une réponse juste, ni l'arrogance qui corrige le jury sèchement : ce qui est noté est la méthode du désaccord — exactement celle qu'exige un desk face à un senior qui conteste votre chiffre. Vérifier, argumenter par le mécanisme, clore.`,
    reponseModeleEn: `The first reflex is neither to fold nor to counter-attack: it is to **verify calmly, out loud**. "Let me re-unroll the point you are disputing." I reformulate the objection and redo the passage — because two scenarios exist: the jury saw a real error, or it is testing my composure under pressure by saying "that is wrong" about a correct answer — the classic stress test. That verification protects me in both cases: if I was wrong, the immediate self-correction scores; if I was right, it gives weight to what follows.

If the reasoning holds, I defend through the **mechanism**, never through authority: the causal chain, step by step, and a **numbered witness case** — "take n = 2: the result checks by hand". Never "I am sure of myself" — certainty is not declared, it is demonstrated. And I leave a door open without capitulating: "I may be wrong on a constant; the mechanism itself seems solid to me, and here is why."

Then **close and hand back**: "if a precise point seems wrong to you, let us verify it together — otherwise I will continue." Neither the weathervane\'s collapse that abandons a correct answer, nor the arrogance that corrects the jury curtly: what gets graded is the method of disagreement — exactly what a desk demands when a senior disputes your number. Verify, argue through the mechanism, close.`,
  },
];
