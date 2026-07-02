import type { JuryQuestion } from '../../../engine/types';

const M10 = '10-macro-banques-centrales';

export const jury: JuryQuestion[] = [
  {
    id: 'm10-j-01',
    moduleId: M10,
    theme: 'le mandat et la promesse des 2 %',
    themeEn: 'the mandate and the 2% promise',
    difficulte: 1,
    question: 'Fed, BCE : même cible de 2 % — mêmes mandats ?',
    questionEn: 'Fed, ECB: same 2% target — same mandates?',
    plan: [
      'Poser le chiffre commun : 2 % d\'inflation par an — mais un chiffre partagé n\'est pas un mandat partagé',
      'La Fed : double mandat depuis 1977 — emploi maximum ET stabilité des prix sur un pied d\'égalité, cible de 2 % sur le PCE chiffrée en 2012',
      'La BCE : mandat hiérarchique — stabilité des prix d\'abord (IPCH à 2 %, symétrique depuis 2021), soutien à l\'économie « sans préjudice »',
      'Conclure sur la conséquence de marché : la hiérarchie du mandat fait la hiérarchie des indicateurs — les NFP sont un événement Fed au même titre que le CPI',
    ],
    planEn: [
      'State the common number: 2% inflation per year — but a shared number is not a shared mandate',
      'The Fed: dual mandate since 1977 — maximum employment AND price stability on an equal footing, the 2% target (on PCE) only quantified in 2012',
      'The ECB: hierarchical mandate — price stability first (HICP at 2%, symmetric since 2021), support to the economy "without prejudice"',
      'Conclude with the market consequence: the mandate\'s hierarchy makes the indicators\' hierarchy — NFP is a Fed event on a par with CPI',
    ],
    pointsAttendus: [
      'La Fed porte depuis 1977 un double mandat — emploi maximum et prix stables, à égalité : elle arbitre en permanence entre ses deux jambes',
      'La cible Fed : 2 % mesurés sur l\'indice PCE (pas le CPI), chiffrée officiellement seulement en 2012',
      'La BCE : hiérarchique — IPCH à 2 % à moyen terme d\'abord, le soutien à l\'économie ensuite, « sans préjudice » du premier objectif',
      'La symétrie de 2021 : avant la revue stratégique, la formule était « inférieure à, mais proche de, 2 % » — une asymétrie héritée de la Bundesbank, tombée après dix ans d\'inflation trop basse',
      'Le mandat est une promesse, pas une prévision : un point d\'ancrage pour les anticipations — si tout le monde fixe prix, salaires et taux longs en supposant 2 %, la promesse s\'auto-réalise',
      'Conséquence de marché : le rapport sur l\'emploi américain est un événement au même titre que le CPI, précisément parce que l\'emploi est une jambe du mandat de la Fed',
    ],
    pointsAttendusEn: [
      'The Fed has carried a dual mandate since 1977 — maximum employment and stable prices, on an equal footing: it permanently arbitrates between its two legs',
      'The Fed target: 2% measured on the PCE index (not CPI), officially quantified only in 2012',
      'The ECB: hierarchical — HICP at 2% over the medium term first, support to the economy second, "without prejudice" to the first objective',
      'The 2021 symmetry: before the strategy review, the wording was "below, but close to, 2%" — an asymmetry inherited from the Bundesbank, felled by ten years of too-low inflation',
      'The mandate is a promise, not a forecast: an anchor for expectations — if everyone sets prices, wages and long rates assuming 2%, the promise self-fulfils',
      'Market consequence: the US employment report is a market event on a par with CPI, precisely because employment is one leg of the Fed\'s mandate',
    ],
    bonus: [
      'Le panorama : BoE (2 % sur le CPI fixés par le Trésor — plus d\'un point d\'écart et le gouverneur doit une lettre ouverte au Chancelier), BoJ (2 % depuis 2013 seulement, après des décennies passées à combattre la déflation), BNS (0-2 % avec un œil permanent sur le franc)',
      'La gouvernance derrière le mandat : FOMC à douze votants, dissensions nominatives publiques ; Conseil des gouverneurs de la BCE au consensus, sans votes publiés — la lecture des rapports de force s\'y fait entre les lignes, faucons contre colombes',
    ],
    bonusEn: [
      'The panorama: BoE (2% on CPI set by the Treasury — more than one point away and the governor owes an open letter to the Chancellor), BoJ (2% only since 2013, after decades fighting deflation), SNB (0-2% with a permanent eye on the franc)',
      'The governance behind the mandate: a twelve-voter FOMC with public, named dissents; the ECB Governing Council by consensus, no published votes — the balance of power is read between the lines, hawks versus doves',
    ],
    reponseModele: `Presque toutes les grandes banques centrales visent aujourd'hui le même chiffre — **2 % d'inflation par an** — mais elles n'y sont pas arrivées par le même chemin, et la hiérarchie de leurs objectifs diffère profondément.

**La Fed** porte depuis 1977 un **double mandat** : emploi maximum ET stabilité des prix, *sur un pied d'égalité*. Sa cible de 2 % — mesurée sur l'indice PCE, pas sur le CPI — n'a été chiffrée officiellement qu'en 2012. Conséquence pratique : la Fed arbitre en permanence entre ses deux jambes — elle peut tolérer un peu d'inflation si l'emploi souffre, et inversement. C'est pourquoi le rapport sur l'emploi américain, les NFP, est un événement de marché au même titre que le CPI : l'emploi n'est pas un indicateur parmi d'autres, c'est la moitié du mandat.

**La BCE**, elle, a un mandat **hiérarchique** : la stabilité des prix *d'abord* ; le soutien à l'économie ensuite, « sans préjudice » du premier objectif. La cible : une inflation de l'IPCH de 2 % à moyen terme, **symétrique** depuis la revue stratégique de 2021 — un écart en dessous est aussi indésirable qu'un écart au-dessus. Avant 2021, la formule officielle était « inférieure à, mais proche de, 2 % » : une asymétrie assumée, héritée de la Bundesbank, que dix ans d'inflation trop *basse* ont fini par faire tomber.

Le point qui fait la bonne copie : le mandat n'est pas une *prévision*, c'est une **promesse** — un point d'ancrage pour les anticipations de tout le monde. Si les entreprises fixent leurs prix, les syndicats leurs salaires et les marchés leurs taux longs en supposant 2 %, l'inflation a une force de rappel vers 2 % : la promesse s'auto-réalise. Des anticipations **ancrées** sont l'actif le plus précieux d'une banque centrale — long à construire, rapide à perdre. La chute : même chiffre, deux philosophies — et pour le desk, deux calendriers : côté Fed, on tremble sur l'emploi autant que sur les prix ; côté BCE, les prix commandent, le reste suit.`,
    reponseModeleEn: `Nearly all major central banks now aim at the same number — **2% inflation per year** — but they did not get there the same way, and the hierarchy of their objectives differs deeply.

**The Fed** has carried a **dual mandate** since 1977: maximum employment AND price stability, *on an equal footing*. Its 2% target — measured on the PCE index, not the CPI — was only officially quantified in 2012. Practical consequence: the Fed permanently arbitrates between its two legs — it can tolerate some inflation if employment suffers, and vice versa. That is why the US employment report, the NFP, is a market event on a par with the CPI: employment is not one indicator among many, it is half the mandate.

**The ECB**, by contrast, has a **hierarchical** mandate: price stability *first*; support to the economy second, "without prejudice" to the first objective. The target: HICP inflation of 2% over the medium term, **symmetric** since the 2021 strategy review — an undershoot is as undesirable as an overshoot. Before 2021, the official wording was "below, but close to, 2%": a deliberate asymmetry, inherited from the Bundesbank, that ten years of too-*low* inflation eventually brought down.

The point that makes a good answer: the mandate is not a *forecast*, it is a **promise** — an anchor for everyone's expectations. If firms set prices, unions set wages and markets set long rates assuming 2%, inflation has a restoring force towards 2%: the promise self-fulfils. **Anchored** expectations are a central bank's most precious asset — slow to build, quick to lose. The closing line: same number, two philosophies — and for the desk, two calendars: on the Fed side you tremble over employment as much as prices; on the ECB side prices command, the rest follows.`,
  },
  {
    id: 'm10-j-02',
    moduleId: M10,
    theme: 'le mandat et la promesse des 2 %',
    themeEn: 'the mandate and the 2% promise',
    difficulte: 2,
    question: 'Si la mission est la « stabilité des prix », pourquoi viser 2 % de hausse par an — et pas zéro ?',
    questionEn: 'If the mission is "price stability", why target 2% annual increases — and not zero?',
    plan: [
      'Première raison, la dominante : une marge de sécurité contre la déflation — partir de plus haut donne plus de marge de baisse des taux quand la récession frappe',
      'Deuxième raison : le biais de mesure — les indices surestiment l\'inflation vécue, un 0 % mesuré serait probablement une déflation réelle',
      'Troisième raison : les rigidités nominales — les salaires ne baissent pas en nominal, 2 % d\'inflation huile les ajustements de salaires réels',
      'Refermer sur le piège de vocabulaire : à 2 %, les prix ne sont pas stables — ils doublent en 35 ans ; la promesse est une érosion lente, faible et surtout prévisible',
    ],
    planEn: [
      'First and dominant reason: a safety margin against deflation — starting higher gives more room to cut rates when recession strikes',
      'Second reason: measurement bias — price indices overstate lived inflation, a measured 0% would probably be actual deflation',
      'Third reason: nominal rigidities — wages do not fall in nominal terms, 2% inflation greases real-wage adjustments',
      'Close on the vocabulary trap: at 2%, prices are not stable — they double every 35 years; the promise is a slow, small and above all predictable erosion',
    ],
    pointsAttendus: [
      'La déflation n\'est pas une bonne nouvelle symétrique : achats reportés, dettes fixées en euros d\'hier qui s\'alourdissent en termes réels, spirale difficile à enrayer car on ne baisse guère les taux sous zéro',
      'Viser 2 %, c\'est s\'éloigner du bord de la falaise : un taux nominal de départ plus haut donne plus de marge de baisse en récession',
      'Le biais de mesure : les indices captent mal les améliorations de qualité et les substitutions — une inflation mesurée à 0 % serait probablement une déflation réelle',
      'Les rigidités nominales : personne n\'accepte un chèque réduit — avec 2 % d\'inflation, geler les salaires suffit à baisser les salaires réels d\'une entreprise en difficulté',
      'Le piège : « stabilité des prix » ne veut pas dire prix stables — à 2 %, les prix doublent tous les 35 ans environ ; un pouvoir d\'achat de 100 ne vaut plus que 82,03 après dix ans (100/(1,02)^10)',
      'La stabilité signifie : une inflation qui ne fait plus partie de la conversation — assez douce pour être ignorée, assez positive pour tenir la déflation à distance',
    ],
    pointsAttendusEn: [
      'Deflation is not a symmetric piece of good news: postponed purchases, debts fixed in yesterday\'s euros growing heavier in real terms, a spiral hard to stop because rates can barely go below zero',
      'Targeting 2% means stepping back from the cliff edge: a higher starting nominal rate gives more room to cut in a recession',
      'The measurement bias: indices capture quality improvements and consumer substitutions poorly — inflation measured at 0% would probably be actual deflation',
      'Nominal rigidities: nobody accepts a smaller paycheck — with 2% inflation, freezing wages is enough for a struggling firm to cut real wages',
      'The trap: "price stability" does not mean stable prices — at 2%, prices double roughly every 35 years; 100 of purchasing power is worth only 82.03 after ten years (100/(1.02)^10)',
      'Stability means: inflation that is no longer part of the conversation — gentle enough to be ignored, positive enough to keep deflation at bay',
    ],
    bonus: [
      'Le chiffrage du biais : la commission Boskin (1996) estimait que le CPI américain surestimait l\'inflation d\'environ 1,1 point par an — à 2 % mesurés, on n\'est pas loin du « vrai » zéro',
      'La question inverse, posée par Blanchard en 2010 : pourquoi pas 4 %, pour doubler la marge ? Réponse des banquiers centraux : la cible vaut par sa crédibilité accumulée — la changer une fois, c\'est avouer qu\'on peut la changer encore ; le chiffre 2 n\'a rien de magique, le fait qu\'il n\'ait pas bougé, si',
    ],
    bonusEn: [
      'Quantifying the bias: the Boskin commission (1996) estimated the US CPI overstated inflation by about 1.1 points per year — at a measured 2%, you are not far from "true" zero',
      'The reverse question, asked by Blanchard in 2010: why not 4%, to double the margin? The central bankers\' answer: the target\'s value lies in its accumulated credibility — change it once and you admit it can change again; there is nothing magic about the number 2, but the fact it has never moved is',
    ],
    reponseModele: `Question faussement naïve — la réponse tient en trois raisons, par ordre d'importance.

**Une marge de sécurité contre la déflation**, d'abord. La baisse des prix n'est pas une bonne nouvelle symétrique : quand tout baissera demain, chacun reporte ses achats ; les dettes, fixées en euros d'hier, s'alourdissent en termes réels ; et l'économie s'enfonce dans une spirale que la politique monétaire peine à enrayer, car on ne peut guère baisser les taux sous zéro — le Japon en a fait la démonstration pendant deux décennies. Viser 2 % plutôt que 0, c'est s'éloigner du bord de la falaise : partir d'un taux nominal plus haut donne plus de marge de baisse quand la récession frappe.

**Un biais de mesure**, ensuite : les indices de prix surestiment l'inflation vécue — ils captent mal les améliorations de qualité et les substitutions des consommateurs. La commission Boskin l'a chiffré en 1996 à environ 1,1 point par an pour le CPI américain : une inflation *mesurée* à 0 % serait probablement une déflation *réelle*. **Les rigidités nominales**, enfin : les salaires baissent très difficilement en termes nominaux — personne n'accepte un chèque réduit. Avec 2 % d'inflation, une entreprise en difficulté peut baisser les salaires *réels* en les gelant simplement : l'inflation huile les ajustements que la psychologie interdit.

Reste le piège de vocabulaire, à désamorcer soi-même : à la cible, les prix ne sont **pas** stables — ils doublent tous les 35 ans environ, et un pouvoir d'achat de 100 ne vaut plus que 100/(1,02)^10 = 82,03 après dix ans. La promesse des 2 % est une érosion *lente, faible et surtout prévisible* : assez douce pour être ignorée dans les décisions quotidiennes, assez positive pour tenir la déflation à distance. « Stabilité des prix » signifie : une inflation qui ne fait plus partie de la conversation. Et si le jury pousse — « pourquoi pas 4 %, alors, pour doubler la marge ? » (Blanchard, 2010) — la réponse est institutionnelle : la cible vaut par sa crédibilité accumulée ; la changer une fois, c'est avouer qu'on peut la changer encore, et désancrer précisément ce qu'on voulait ancrer.`,
    reponseModeleEn: `A deceptively naive question — the answer holds in three reasons, in order of importance.

**A safety margin against deflation**, first. Falling prices are not a symmetric piece of good news: when everything will be cheaper tomorrow, everyone postpones purchases; debts, fixed in yesterday's money, grow heavier in real terms; and the economy sinks into a spiral that monetary policy struggles to stop, because rates can barely go below zero — Japan demonstrated it for two decades. Targeting 2% rather than 0 means stepping back from the cliff edge: starting from a higher nominal rate gives more room to cut when recession strikes.

**A measurement bias**, second: price indices overstate lived inflation — they capture quality improvements and consumer substitutions poorly. The Boskin commission put a number on it in 1996: about 1.1 points per year for the US CPI — inflation *measured* at 0% would probably be actual *deflation*. **Nominal rigidities**, third: wages fall very reluctantly in nominal terms — nobody accepts a smaller paycheck. With 2% inflation, a struggling firm can cut *real* wages by simply freezing them: inflation greases the adjustments psychology forbids.

There remains the vocabulary trap, best defused unprompted: at target, prices are **not** stable — they double roughly every 35 years, and 100 of purchasing power is worth only 100/(1.02)^10 = 82.03 after ten years. The 2% promise is a *slow, small and above all predictable* erosion: gentle enough to be ignored in daily decisions, positive enough to keep deflation at bay. "Price stability" means: inflation that is no longer part of the conversation. And if the jury pushes — "why not 4%, then, to double the margin?" (Blanchard, 2010) — the answer is institutional: the target's value lies in its accumulated credibility; change it once and you admit it can change again, unanchoring precisely what you meant to anchor.`,
  },
  {
    id: 'm10-j-03',
    moduleId: M10,
    theme: 'le mandat et la promesse des 2 %',
    themeEn: 'the mandate and the 2% promise',
    difficulte: 2,
    question: 'Pourquoi confier la monnaie à des banquiers non élus plutôt qu\'au gouvernement ?',
    questionEn: 'Why entrust money to unelected bankers rather than to the government?',
    plan: [
      'Poser le problème d\'incitation : le gouvernement a structurellement intérêt à une inflation surprise — doper l\'activité avant une élection, alléger la dette publique',
      'Dérouler le paradoxe : tout le monde le sait — donc personne ne croit la promesse des 2 %, les anticipations se désancrent, et l\'inflation monte sans même le bénéfice de la surprise',
      'La solution institutionnelle : un dispositif d\'engagement — mandat écrit, dirigeants à mandat long, révocation quasi impossible ; Ulysse s\'attachant au mât',
      'La preuve par l\'histoire : Burns 1972 contre Volcker 1979 — la complaisance coûte une décennie, la crédibilité se paie comptant et se rembourse pendant quarante ans',
    ],
    planEn: [
      'State the incentive problem: the government structurally benefits from surprise inflation — boosting activity before an election, lightening public debt',
      'Unfold the paradox: everyone knows it — so nobody believes the 2% promise, expectations unanchor, and inflation rises without even the benefit of a surprise',
      'The institutional solution: a commitment device — written mandate, long terms of office, near-impossible dismissal; Ulysses tying himself to the mast',
      'The proof by history: Burns 1972 versus Volcker 1979 — complacency costs a decade, credibility is paid for in cash and repays for forty years',
    ],
    pointsAttendus: [
      'L\'incitation structurelle : l\'inflation surprise dope l\'activité à court terme — avant une élection — et allège la dette publique fixée en euros d\'hier',
      'L\'incohérence temporelle : puisque tout le monde connaît cette incitation, une promesse de 2 % tenue par la main qui se présente aux élections n\'est pas crue — les anticipations montent, et l\'inflation avec, sans bénéfice réel',
      'L\'indépendance comme dispositif d\'engagement : mandat écrit, mandats longs, révocation quasi impossible — retirer le levier des mains de ceux qui seraient tentés',
      'Burns, 1972 : Nixon veut sa réélection et le fait savoir (les enregistrements de la Maison-Blanche l\'attestent) ; la politique reste accommodante, l\'inflation s\'installe et finira à 13,5 % en 1980 — le coût d\'une complaisance : une décennie',
      'Volcker, 1979 : taux portés jusqu\'à 20 %, deux récessions assumées, chômage à 10,8 % fin 1982 — l\'inflation retombe à 3,2 % en 1983 et la Fed gagne l\'actif dont elle vit encore : la certitude qu\'elle fera « ce qu\'il faut »',
      'La leçon : la crédibilité se paie comptant et se rembourse pendant quarante ans — l\'indépendance n\'est pas un privilège de technocrates, c\'est la version institutionnelle d\'Ulysse s\'attachant au mât',
    ],
    pointsAttendusEn: [
      'The structural incentive: surprise inflation boosts activity in the short run — before an election — and lightens public debt fixed in yesterday\'s money',
      'Time inconsistency: since everyone knows this incentive, a 2% promise held by the hand that runs for election is not believed — expectations rise, and inflation with them, with no real benefit',
      'Independence as a commitment device: written mandate, long terms, near-impossible dismissal — taking the lever out of the hands of those who would be tempted',
      'Burns, 1972: Nixon wants re-election and lets it be known (the White House tapes attest to it); policy stays accommodative, inflation settles in and will end at 13.5% in 1980 — the cost of complacency: a decade',
      'Volcker, 1979: rates pushed to 20%, two recessions accepted, unemployment at 10.8% in late 1982 — inflation falls back to 3.2% in 1983 and the Fed earns the asset it still lives on: the certainty it will do "what it takes"',
      'The lesson: credibility is paid in cash and repays over forty years — independence is not a technocrats\' privilege, it is the institutional version of Ulysses tying himself to the mast',
    ],
    bonus: [
      'L\'ennemi discret de l\'indépendance : la dominance budgétaire — quand la dette publique est si lourde que monter les taux menace la solvabilité de l\'État, la banque centrale perd sa liberté sans qu\'aucune loi ne change ; cas d\'école : la Fed qui plafonne les taux longs à 2,5 % de 1942 à 1951 (jusqu\'à l\'Accord avec le Trésor), et la Turquie 2021-2023 — baisses de taux imposées en pleine flambée, inflation au-delà de 85 %',
      'Le réflexe de marché : toute attaque politique contre une banque centrale se lit immédiatement dans la devise et les taux longs — les investisseurs re-pricent la promesse des 2 % à la baisse et exigent une prime de risque d\'inflation',
    ],
    bonusEn: [
      'Independence\'s quieter enemy: fiscal dominance — when public debt is so heavy that raising rates threatens the state\'s solvency, the central bank loses its freedom without any law changing; textbook cases: the Fed capping long rates at 2.5% from 1942 to 1951 (until the Treasury Accord), and Turkey 2021-2023 — rate cuts imposed amid surging prices, inflation beyond 85%',
      'The market reflex: any political attack on a central bank reads immediately in the currency and in long rates — investors re-price the 2% promise downward and demand an inflation risk premium',
    ],
    reponseModele: `Parce que le gouvernement a structurellement *intérêt* à une inflation surprise : elle dope l'activité à court terme — avant une élection, par exemple — et allège la dette publique, fixée en euros d'hier. Le problème n'est pas que le gouvernement soit malhonnête : c'est que **tout le monde connaît cette incitation**. Si la main qui tient les taux est celle qui se présente aux élections, personne ne croit la promesse des 2 % ; les anticipations se désancrent ; et l'inflation monte *sans même que le gouvernement en tire le bénéfice d'une surprise*. C'est le cœur de l'argument d'incohérence temporelle : une promesse que l'on a intérêt à trahir ne vaut rien, même prononcée sincèrement.

La solution est institutionnelle : retirer le levier des mains de ceux qui seraient tentés, et le confier à une institution dont le mandat est écrit, les dirigeants nommés pour longtemps, et la révocation quasi impossible. L'indépendance n'est pas un privilège de technocrates : c'est un **dispositif d'engagement** — la version institutionnelle d'Ulysse s'attachant au mât.

La preuve tient en deux présidents de la Fed. **Arthur Burns, 1972** : Nixon veut sa réélection et le fait savoir — les enregistrements de la Maison-Blanche l'attestent. Burns garde la politique accommodante pendant que l'économie surchauffe ; Nixon est réélu ; l'inflation, elle, s'installe et finira à **13,5 % en 1980**. Le coût d'une complaisance : une décennie. **Paul Volcker, 1979** : nommé pour éteindre l'incendie, il fait l'inverse de tout ce qu'un élu aurait choisi — taux jusqu'à **20 %**, deux récessions assumées, chômage à 10,8 % fin 1982, les concessionnaires qui lui envoient par la poste les clés des voitures invendues. L'inflation retombe à 3,2 % en 1983 — et la Fed gagne l'actif dont elle vit encore : la certitude, dans toutes les têtes, qu'elle fera « ce qu'il faut ».

La chute : la crédibilité se paie comptant et se rembourse pendant quarante ans. Et l'indépendance a un ennemi plus discret que le coup de téléphone présidentiel — la **dominance budgétaire** : quand la dette publique devient si lourde que toute hausse de taux menace la solvabilité de l'État, la banque centrale perd sa liberté sans qu'aucune loi ne change. La Turquie de 2021-2023 — baisses de taux imposées en pleine flambée, inflation au-delà de 85 %, livre au tapis — en est la démonstration en temps réel : une banque centrale dont personne ne croit l'indépendance ne vaut pas plus que la promesse d'un débiteur aux abois.`,
    reponseModeleEn: `Because the government structurally *benefits* from surprise inflation: it boosts activity in the short run — before an election, say — and lightens public debt, fixed in yesterday's money. The problem is not that governments are dishonest: it is that **everyone knows this incentive**. If the hand holding the rates is the one running for election, nobody believes the 2% promise; expectations unanchor; and inflation rises *without the government even reaping the benefit of a surprise*. That is the heart of the time-inconsistency argument: a promise you have an interest in breaking is worth nothing, even when sincerely made.

The solution is institutional: take the lever out of the hands of those who would be tempted, and entrust it to an institution with a written mandate, long-serving officials, and near-impossible dismissal. Independence is not a technocrats' privilege: it is a **commitment device** — the institutional version of Ulysses tying himself to the mast.

The proof holds in two Fed chairmen. **Arthur Burns, 1972**: Nixon wants his re-election and lets it be known — the White House tapes attest to it. Burns keeps policy accommodative while the economy overheats; Nixon is re-elected; inflation settles in and will end at **13.5% in 1980**. The cost of complacency: a decade. **Paul Volcker, 1979**: appointed to put out that fire, he does the opposite of everything an elected official would choose — rates up to **20%**, two recessions accepted, unemployment at 10.8% in late 1982, car dealers mailing him the keys of unsold cars. Inflation falls back to 3.2% in 1983 — and the Fed earns the asset it still lives on: the certainty, in every head, that it will do "what it takes".

The closing line: credibility is paid for in cash and repays over forty years. And independence has a quieter enemy than the presidential phone call — **fiscal dominance**: when public debt grows so heavy that any rate hike threatens the state's solvency, the central bank loses its freedom without any law changing. Turkey in 2021-2023 — rate cuts imposed amid surging prices, inflation beyond 85%, the lira floored — is the real-time demonstration: a central bank whose independence nobody believes is worth no more than the promise of a desperate debtor.`,
  },
  {
    id: 'm10-j-04',
    moduleId: M10,
    theme: 'les taux directeurs et leur règle',
    themeEn: 'policy rates and their rule',
    difficulte: 2,
    question: 'La BCE annonce « ses taux ». Comment fait-elle, concrètement, pour que le taux du marché monétaire soit celui qu\'elle a décidé ?',
    questionEn: 'The ECB announces "its rates". How, concretely, does it make the money-market rate the one it decided?',
    plan: [
      'Poser les trois taux : dépôt (plancher), refinancement (le taux « officiel » historique), prêt marginal (plafond) — l\'espace entre les deux bornes est le corridor',
      'Expliquer l\'arbitrage qui tient les bornes : personne ne prête à un confrère moins que ce que paie la BCE sans risque, personne n\'emprunte plus cher que son guichet',
      'La subtilité de praticien : en liquidité excédentaire, plus personne n\'emprunte au refi — le marché colle au plancher, LE taux qui compte est le dépôt',
      'Vérifier au thermomètre : l\'€STR vit quelques points de base sous le taux de dépôt — premier maillon de la transmission, verrouillé et quasi instantané',
    ],
    planEn: [
      'Lay out the three rates: deposit (floor), refinancing (the historical "official" rate), marginal lending (ceiling) — the space between the two bounds is the corridor',
      'Explain the arbitrage that holds the bounds: nobody lends to a peer for less than what the ECB pays risk-free, nobody borrows dearer than its window',
      'The practitioner\'s subtlety: with excess liquidity, hardly anyone borrows at the refi — the market sticks to the floor, THE rate that matters is the deposit rate',
      'Check the thermometer: €STR lives a few basis points below the deposit rate — first link of the transmission, locked and near-instantaneous',
    ],
    pointsAttendus: [
      'Les trois taux et leurs rôles : taux de dépôt (ce que rapportent les liquidités laissées à la BCE — le plancher), taux de refinancement (opérations hebdomadaires contre collatéral), taux de prêt marginal (emprunt d\'urgence — le plafond)',
      'L\'ordre de grandeur d\'un sommet de cycle : automne 2023 — dépôt 4,00 %, refi 4,50 %, prêt marginal 4,75 %',
      'Le mécanisme d\'arbitrage : le taux interbancaire ne peut vivre qu\'à l\'intérieur du corridor',
      'La liquidité excédentaire héritée des achats d\'actifs : presque personne n\'a besoin d\'emprunter au refi, tout le monde cherche à placer — le marché colle au plancher, et le taux que la presse cite et que les marchés pricent est le dépôt (corridor resserré à 15 pb d\'écart refi−dépôt en 2024)',
      'Le taux effectif : l\'€STR, constaté sur transactions réelles, vit en permanence quelques points de base sous le taux de dépôt',
      'Le parallèle Fed : une fourchette cible de 25 pb sur les fed funds (5,25-5,50 % au sommet de 2023), tenue par des taux administrés — l\'IORB au premier rang, même logique de plancher : on ne pilote plus le taux en rationnant la monnaie, on fixe le prix auquel la banque centrale elle-même rémunère et prête',
    ],
    pointsAttendusEn: [
      'The three rates and their roles: deposit rate (what liquidity parked at the ECB earns — the floor), refinancing rate (weekly operations against collateral), marginal lending rate (emergency borrowing — the ceiling)',
      'The order of magnitude at a cycle peak: autumn 2023 — deposit 4.00%, refi 4.50%, marginal lending 4.75%',
      'The arbitrage mechanism: the interbank rate can only live inside the corridor',
      'Excess liquidity inherited from asset purchases: hardly anyone needs to borrow at the refi, everyone is looking to place — the market sticks to the floor, and the rate the press quotes and markets price is the deposit rate (corridor narrowed to a 15 bp refi−deposit gap in 2024)',
      'The effective rate: €STR, computed on real transactions, permanently lives a few basis points below the deposit rate',
      'The Fed parallel: a 25 bp target range on fed funds (5.25-5.50% at the 2023 peak), held by administered rates — IORB first among them, same floor logic: you no longer steer the rate by rationing money, you set the price at which the central bank itself remunerates and lends',
    ],
    bonus: [
      'La plomberie américaine complète : l\'ON RRP étend le plancher aux fonds monétaires qui n\'ont pas de compte de réserves — au pic 2022-2023, plus de 2 000 milliards de dollars absorbés par nuit, le thermomètre du cash sans emploi',
      'Le pont avec le module 4 : €STR et SOFR ont remplacé les IBOR déclaratifs (le LIBOR est mort du scandale de sa manipulation, remplacé en 2023) — ce sont les taux sans risque de référence des swaps et des courbes d\'actualisation : le r de vos modèles a un prénom, et il obéit au taux directeur à quelques points de base près',
    ],
    bonusEn: [
      'The full American plumbing: the ON RRP extends the floor to money-market funds that have no reserve account — at the 2022-2023 peak, more than 2,000 billion dollars absorbed per night, the thermometer of idle cash',
      'The bridge to module 4: €STR and SOFR replaced the declarative IBORs (LIBOR died of its manipulation scandal, replaced in 2023) — they are the reference risk-free rates of swaps and discount curves: the r of your models has a first name, and it obeys the policy rate to within a few basis points',
    ],
    reponseModele: `La BCE ne fixe pas un taux mais **trois**, qui encadrent le prix de l'argent au jour le jour. Le **taux de dépôt** : ce que rapportent les liquidités que les banques laissent à la BCE du jour au lendemain — c'est le **plancher** du marché, car personne ne prête à un confrère moins que ce que paie la BCE sans risque. Le **taux de refinancement** : celui des opérations hebdomadaires par lesquelles les banques empruntent contre collatéral — le taux « officiel » historique. Le **taux de prêt marginal** : l'emprunt d'urgence au jour le jour — le **plafond**, car personne n'emprunte à un confrère plus cher que le guichet de la BCE. L'espace entre plancher et plafond est le **corridor** : le taux interbancaire ne peut vivre qu'à l'intérieur. Au sommet du cycle, à l'automne 2023 : dépôt 4,00 %, refi 4,50 %, prêt marginal 4,75 %.

La subtilité qui fait la réponse de praticien : depuis les politiques d'achats d'actifs, les banques de la zone euro nagent dans la **liquidité excédentaire** — collectivement, elles ont plus de réserves qu'il ne leur en faut. Presque personne n'a besoin d'emprunter au refi ; tout le monde cherche à *placer*. Résultat : le taux de marché colle au **plancher**, et LE taux directeur qui compte aujourd'hui est le taux de **dépôt** — c'est lui que la presse cite, lui que les marchés pricent. La BCE en a tiré les conséquences en 2024 en resserrant l'écart refi−dépôt à 15 points de base. À la question « quel est le taux de la BCE ? », la bonne réponse commence par : « lequel ? — celui qui pilote le marché, c'est le dépôt ».

La vérification se lit chaque matin sur le taux effectif : l'**€STR**, moyenne constatée des emprunts au jour le jour entre grandes banques, vit en permanence quelques points de base *sous* le taux de dépôt — sa laisse est courte. Premier maillon de la transmission : verrouillé, mécanique, quasi instantané.

Et la Fed ? Même logique, autre habillage : une **fourchette cible** de 25 points de base sur les fed funds (5,25-5,50 % au sommet de 2023), tenue non par décret mais par des taux administrés — au premier rang l'**IORB**, la rémunération des réserves, qui joue exactement le rôle du taux de dépôt européen. Le mécanisme profond est le même des deux côtés de l'Atlantique : en régime de réserves abondantes, on ne pilote plus le taux en rationnant la monnaie — on le pilote en fixant le prix auquel la banque centrale elle-même rémunère et prête.`,
    reponseModeleEn: `The ECB does not set one rate but **three**, which frame the overnight price of money. The **deposit rate**: what the liquidity banks leave at the ECB overnight earns — the market's **floor**, since nobody lends to a peer for less than what the ECB pays risk-free. The **refinancing rate**: that of the weekly operations through which banks borrow against collateral — the historical "official" rate. The **marginal lending rate**: overnight emergency borrowing — the **ceiling**, since nobody borrows from a peer dearer than the ECB's window. The space between floor and ceiling is the **corridor**: the interbank rate can only live inside it. At the cycle peak, autumn 2023: deposit 4.00%, refi 4.50%, marginal lending 4.75%.

The subtlety that makes a practitioner's answer: since the asset-purchase programmes, euro-area banks have been swimming in **excess liquidity** — collectively they hold more reserves than they need. Hardly anyone needs to borrow at the refi; everyone is looking to *place*. Result: the market rate sticks to the **floor**, and THE policy rate that matters today is the **deposit** rate — the one the press quotes, the one markets price. The ECB drew the consequence in 2024 by narrowing the refi−deposit gap to 15 basis points. To "what is the ECB's rate?", the right answer starts with: "which one? — the one steering the market is the deposit rate".

The check reads every morning on the effective rate: **€STR**, the observed average of overnight borrowing between large banks, permanently lives a few basis points *below* the deposit rate — its leash is short. First link of the transmission: locked, mechanical, near-instantaneous.

And the Fed? Same logic, different clothing: a 25 basis point **target range** on fed funds (5.25-5.50% at the 2023 peak), held not by decree but by administered rates — first among them **IORB**, the remuneration of reserves, which plays exactly the role of the European deposit rate. The deep mechanism is the same on both sides of the Atlantic: in a regime of abundant reserves, you no longer steer the rate by rationing money — you steer it by setting the price at which the central bank itself remunerates and lends.`,
  },
  {
    id: 'm10-j-05',
    moduleId: M10,
    theme: 'les taux directeurs et leur règle',
    themeEn: 'policy rates and their rule',
    difficulte: 2,
    question: 'Expliquez la règle de Taylor — et dites-moi pourquoi aucune banque centrale ne la suit mécaniquement.',
    questionEn: 'Explain the Taylor rule — and tell me why no central bank follows it mechanically.',
    plan: [
      'Poser la formule et réciter les termes : i = r* + π + a×(π − π*) + b×gap, avec a = b = 0,5 chez Taylor (1993)',
      'Chiffrer un cas : taux neutre 2 %, inflation 4 %, cible 2 %, gap −1 % — prescription 2 + 4 + 0,5×2 − 0,5×1 = 6,5 %',
      'Extraire le vrai contenu : le principe de Taylor — bouger PLUS qu\'un pour un, pour que le taux réel monte et que la politique morde',
      'Donner les limites : r* inobservable, gap massivement révisé, rien sur la stabilité financière — un étalon de conversation, pas un pilote automatique',
    ],
    planEn: [
      'State the formula and recite the terms: i = r* + π + a×(π − π*) + b×gap, with a = b = 0.5 in Taylor (1993)',
      'Run a case: neutral rate 2%, inflation 4%, target 2%, gap −1% — prescription 2 + 4 + 0.5×2 − 0.5×1 = 6.5%',
      'Extract the real content: the Taylor principle — move MORE than one-for-one, so the real rate rises and policy bites',
      'Give the limits: r* unobservable, the gap massively revised, nothing on financial stability — a conversation benchmark, not an autopilot',
    ],
    pointsAttendus: [
      'La décomposition terme à terme : r* le taux neutre réel (qui ne stimule ni ne freine), π l\'inflation courante (r* + π est le taux nominal neutre, le point zéro), a×(π − π*) la pénalité d\'écart à la cible, b×gap la correction conjoncturelle',
      'Le calcul canonique : 2 + 4 + 0,5×2 − 0,5×1 = 6,5 %',
      'Le principe de Taylor : avec a > 0, un point d\'inflation en plus relève la prescription de (1 + a) points — passer l\'inflation de 2 à 4 % fait sauter la prescription de 4 à 7 % ; bouger d\'un pour un laisserait le réel inchangé, bouger moins le ferait BAISSER en pleine flambée — la recette des années 70',
      'Les limites : r* est inobservable (barres d\'erreur d\'un point, l\'erreur se transporte intégralement) ; le gap de production est massivement révisé après coup — une partie de la dérive des années 70 vient de gaps que l\'on croyait très creusés et qui ne l\'étaient pas',
      'La règle ignore la stabilité financière, le change, le QE — aucune banque centrale ne la suit mécaniquement, toutes s\'y comparent',
      'Les validations historiques : Volcker 1980 — la règle prescrit 19,5 % (2 + 13 + 0,5×11 − 0,5×2), il est allé à 20 % : la brutalité était la prescription ; 2022 — prescription vers 12 % pendant que la Fed était à 0,25 % au printemps : l\'écart mesure le « behind the curve »',
    ],
    pointsAttendusEn: [
      'The term-by-term decomposition: r* the real neutral rate (neither stimulating nor braking), π current inflation (r* + π is the neutral nominal rate, policy\'s zero point), a×(π − π*) the penalty for missing the target, b×gap the cyclical correction',
      'The canonical calculation: 2 + 4 + 0.5×2 − 0.5×1 = 6.5%',
      'The Taylor principle: with a > 0, one extra point of inflation raises the prescription by (1 + a) points — taking inflation from 2 to 4% jumps the prescription from 4 to 7%; moving one-for-one would leave the real rate unchanged, moving less would make it FALL amid surging prices — the 1970s recipe',
      'The limits: r* is unobservable (error bars of a full point, and the error carries straight into the prescription); the output gap is massively revised after the fact — part of the 1970s drift came from gaps believed deeply negative that were not',
      'The rule ignores financial stability, the exchange rate, QE — no central bank follows it mechanically, all compare themselves to it',
      'Historical validations: Volcker 1980 — the rule prescribes 19.5% (2 + 13 + 0.5×11 − 0.5×2), he went to 20%: the brutality was the prescription; 2022 — prescription around 12% while the Fed was still at 0.25% in the spring: the gap measures "behind the curve"',
    ],
    bonus: [
      'La borne zéro comme limite ultime : zone euro 2015 — inflation 0,2 %, neutre vers 0,5 %, gap −2 % : prescription −1,2 %, impossible à imposer au marché (le cash rapporte toujours 0) ; quand la règle prescrit l\'impossible, il faut d\'autres outils — taux légèrement négatifs, forward guidance, QE',
      'La phrase de desk : « la Fed est 300 points de base sous sa Taylor » — la règle sert d\'étalon aux conversations et aux notes de recherche, chaque desk a sa version maison',
    ],
    bonusEn: [
      'The zero bound as the ultimate limit: euro area 2015 — inflation 0.2%, neutral around 0.5%, gap −2%: prescription −1.2%, impossible to impose on the market (cash always yields 0); when the rule prescribes the impossible, other tools are needed — slightly negative rates, forward guidance, QE',
      'The desk phrase: "the Fed is 300 basis points below its Taylor" — the rule serves as the benchmark of conversations and research notes, every desk has its house version',
    ],
    reponseModele: `En 1993, John Taylor remarque qu'une formule à une ligne décrit remarquablement bien la Fed des années Greenspan : **i = r* + π + a×(π − π*) + b×gap**, avec a = b = 0,5. Terme à terme : **r*** est le taux neutre réel — celui qui ne stimule ni ne freine ; **π** l'inflation courante — car c'est un taux *nominal* qu'on fixe, et r* + π est le point zéro de la politique ; **a×(π − π*)** la pénalité d'écart à la cible — l'inflation dépasse, on serre ; **b×gap** la correction conjoncturelle — le gap est négatif en récession et tire la prescription vers le bas. Application : taux neutre 2 %, inflation 4 %, cible 2 %, gap −1 % — la règle prescrit 2 + 4 + 0,5×2 − 0,5×1 = **6,5 %**.

Le vrai contenu de la règle n'est pas le chiffre, c'est le coefficient : c'est le **principe de Taylor**. Avec a > 0, un point d'inflation en plus relève la prescription de 1 + a points — **plus qu'un pour un**. Passez l'inflation de 2 à 4 % (cible 2, neutre 2, gap nul) : la prescription saute de 4 % à 7 %. Pourquoi c'est vital : ce qui freine l'économie, c'est le taux **réel**. Monter d'exactement un pour un laisserait le réel inchangé — l'air d'agir sans rien serrer ; monter *moins* que l'inflation ferait baisser le réel pendant que les prix flambent — la politique deviendrait plus accommodante à mesure que l'inflation monte, la recette exacte des années 70. Le principe de Taylor sépare la banque centrale qui court derrière l'inflation de celle qui la rattrape.

Pourquoi personne ne la suit mécaniquement, alors ? Parce qu'elle n'est opérationnelle qu'à moitié. **r*** est inobservable — on l'estime avec des barres d'erreur d'un point, et l'erreur se transporte intégralement dans la prescription. Le **gap de production** est pire : mesuré en temps réel, il est massivement révisé après coup — une partie de la dérive des années 70 s'explique par des gaps que l'on croyait très creusés et qui ne l'étaient pas. Et la règle ignore tout de la stabilité financière, du change, du QE. Enfin, elle peut prescrire l'impossible : zone euro 2015, la prescription ressort à −1,2 % — sous la borne zéro, il faut d'autres outils.

Elle n'en reste pas moins l'étalon de toutes les conversations. Volcker 1980 : inflation 13 %, gap −2 % — prescription 19,5 %, et Volcker est allé à 20 % : la brutalité historique était, à un demi-point près, la prescription. 2022 : prescription vers 12 % pendant que la Fed était encore à 0,25 % au printemps — l'écart mesurait le retard au départ, et les 525 points de base de hausses en seize mois furent la course pour le combler. « La Fed est 300 points de base sous sa Taylor » est une phrase qui se dit sur un desk : un étalon de conversation, pas un pilote automatique.`,
    reponseModeleEn: `In 1993, John Taylor noticed that a one-line formula described the Greenspan-era Fed remarkably well: **i = r* + π + a×(π − π*) + b×gap**, with a = b = 0.5. Term by term: **r*** is the real neutral rate — the one that neither stimulates nor brakes; **π** current inflation — because what you set is a *nominal* rate, and r* + π is policy's zero point; **a×(π − π*)** the penalty for missing the target — inflation overshoots, you tighten; **b×gap** the cyclical correction — the gap is negative in recession and pulls the prescription down. Application: neutral rate 2%, inflation 4%, target 2%, gap −1% — the rule prescribes 2 + 4 + 0.5×2 − 0.5×1 = **6.5%**.

The rule's real content is not the number, it is the coefficient: the **Taylor principle**. With a > 0, one extra point of inflation raises the prescription by 1 + a points — **more than one-for-one**. Take inflation from 2 to 4% (target 2, neutral 2, zero gap): the prescription jumps from 4% to 7%. Why it is vital: what brakes the economy is the **real** rate. Moving exactly one-for-one would leave the real rate unchanged — looking busy while tightening nothing; moving *less* than inflation would make the real rate fall while prices surge — policy becoming more accommodative as inflation climbs, the exact recipe of the 1970s. The Taylor principle separates the central bank chasing inflation from the one catching it.

Why does nobody follow it mechanically, then? Because it is only half operational. **r*** is unobservable — estimated with error bars of a full point, and the error carries straight into the prescription. The **output gap** is worse: measured in real time, it is massively revised after the fact — part of the 1970s drift is explained by gaps believed deeply negative that were not. And the rule knows nothing of financial stability, the exchange rate, QE. Finally, it can prescribe the impossible: euro area 2015, the prescription comes out at −1.2% — below the zero bound, other tools are needed.

It remains the benchmark of every conversation nonetheless. Volcker 1980: inflation 13%, gap −2% — prescription 19.5%, and Volcker went to 20%: the historic brutality was, to within half a point, the prescription. 2022: prescription around 12% while the Fed was still at 0.25% in the spring — the gap measured the late start, and the 525 basis points of hikes in sixteen months were the race to close it. "The Fed is 300 basis points below its Taylor" is a sentence said on desks: a conversation benchmark, not an autopilot.`,
  },
  {
    id: 'm10-j-06',
    moduleId: M10,
    theme: 'les taux directeurs et leur règle',
    themeEn: 'policy rates and their rule',
    difficulte: 2,
    question: 'Taux nominal 10 %, inflation 8 % : combien rapporte vraiment ce placement ? Et pourquoi cette question décide-t-elle si une politique monétaire est restrictive ?',
    questionEn: 'Nominal rate 10%, inflation 8%: what does this investment really earn? And why does this question decide whether a monetary policy is restrictive?',
    plan: [
      'Donner l\'approximation de tête : r ≈ i − π = 2 % — puis annoncer qu\'elle est fausse par excès',
      'Poser Fisher exact : r = (1 + i)/(1 + π) − 1 = 1,10/1,08 − 1 = 1,85 % — quinze points de base d\'écart',
      'Généraliser : l\'approximation néglige le terme croisé et surestime TOUJOURS le réel, d\'autant plus que les niveaux sont élevés',
      'Conclure sur l\'enjeu : restrictif ou pas ne se lit jamais sur le nominal — c\'est le réel, comparé à r*, qui mord ; été 2022 : 2,5 % de nominal sous 8 % d\'inflation = réel −5,09 %, politique encore massivement accommodante',
    ],
    planEn: [
      'Give the mental approximation: r ≈ i − π = 2% — then announce it errs on the high side',
      'State exact Fisher: r = (1 + i)/(1 + π) − 1 = 1.10/1.08 − 1 = 1.85% — fifteen basis points of gap',
      'Generalise: the approximation neglects the cross term and ALWAYS overstates the real rate, the more so the higher the levels',
      'Conclude on the stake: restrictive or not never reads on the nominal — it is the real rate, compared to r*, that bites; summer 2022: 2.5% nominal under 8% inflation = real −5.09%, still massively accommodative policy',
    ],
    pointsAttendus: [
      'L\'équation de Fisher exacte : 1 + r = (1 + i)/(1 + π), soit r = (1 + i)/(1 + π) − 1 ; à (10 %, 8 %) : 1,85 %',
      'L\'approximation des salles de marché r ≈ i − π donne 2 % : elle néglige le terme croisé i×π et surestime toujours le réel',
      'L\'écart grandit avec les niveaux : 6 points de base à (5 %, 2 %) — 2,94 % exact contre 3 % —, 15 points de base à (10 %, 8 %) : l\'approximation se dégrade précisément dans les régimes où l\'on en a besoin',
      'Le réflexe d\'entretien : donner l\'approximation, PUIS signaler l\'écart et son sens',
      'Le réel peut être négatif : un livret à 3 % sous 5 % d\'inflation rapporte 1,03/1,05 − 1 = −1,90 % — l\'épargnant paie pour prêter ; ce régime a un nom : la répression financière',
      'L\'enjeu de politique monétaire : une politique est restrictive quand le taux réel dépasse le neutre r*, accommodante en dessous — été 2022 : 2,5 % de nominal face à 8 % d\'inflation = réel de −5,09 %, quatre hausses plus tard la politique était encore massivement accommodante',
    ],
    pointsAttendusEn: [
      'The exact Fisher equation: 1 + r = (1 + i)/(1 + π), i.e. r = (1 + i)/(1 + π) − 1; at (10%, 8%): 1.85%',
      'The trading-floor approximation r ≈ i − π gives 2%: it neglects the cross term i×π and always overstates the real rate',
      'The gap grows with the levels: 6 basis points at (5%, 2%) — 2.94% exact versus 3% —, 15 basis points at (10%, 8%): the approximation degrades precisely in the regimes where you need it',
      'The interview reflex: give the approximation, THEN flag the gap and its sign',
      'The real rate can be negative: a savings account at 3% under 5% inflation earns 1.03/1.05 − 1 = −1.90% — the saver pays to lend; that regime has a name: financial repression',
      'The monetary-policy stake: a policy is restrictive when the real rate exceeds the neutral r*, accommodative below — summer 2022: 2.5% nominal against 8% inflation = a real rate of −5.09%; four hikes in, policy was still massively accommodative',
    ],
    bonus: [
      'Le lien avec le principe de Taylor : bouger PLUS que l\'inflation est précisément ce qui fait monter le réel — bouger d\'un pour un est de l\'agitation sans effet',
      'Le coût pour l\'épargnant, en composé : 100 € sur un compte non rémunéré sous 5 % d\'inflation ne valent plus que 100/1,05^10 = 61,39 € de pouvoir d\'achat après dix ans — la taxe d\'inflation, prélevée sans vote sur les créances non indexées',
    ],
    bonusEn: [
      'The link with the Taylor principle: moving MORE than inflation is precisely what pushes the real rate up — moving one-for-one is motion without effect',
      'The compounded cost to the saver: 100 on a non-interest-bearing account under 5% inflation is worth only 100/1.05^10 = 61.39 of purchasing power after ten years — the inflation tax, levied without a vote on unindexed claims',
    ],
    reponseModele: `L'arithmétique de tête des salles de marché répond d'abord : r ≈ i − π = 10 − 8 = **2 %**. Puis elle se corrige, car cette approximation est fausse par excès. La relation exacte est l'équation de **Fisher** : 1 + r = (1 + i)/(1 + π), soit r = 1,10/1,08 − 1 = **1,85 %** — quinze points de base de moins. L'approximation néglige le terme croisé i×π et **surestime toujours** le réel, d'autant plus que taux et inflation sont élevés : à (5 %, 2 %), l'écart n'était que de six points de base (2,94 % exact contre 3 %) ; à (10 %, 8 %), quinze. Elle se dégrade précisément dans les régimes où l'on en a besoin. Le réflexe d'entretien : donner l'approximation, *puis* signaler l'écart et son sens.

Le réel peut être négatif, et c'est là que la question devient politique : un livret à 3 % sous 5 % d'inflation rapporte 1,03/1,05 − 1 = **−1,90 %** — l'épargnant *paie* pour prêter, en pouvoir d'achat. Ce régime a un nom : la **répression financière**.

Pourquoi cette équation décide-t-elle du caractère restrictif d'une politique ? Parce que le taux qui compte pour les décisions économiques — emprunter, investir, épargner — n'est jamais le taux affiché mais ce qui reste une fois l'inflation déduite. Une politique est **restrictive** quand le taux réel dépasse le taux neutre r*, **accommodante** en dessous. Le cas qui fait mal : à l'été 2022, une banque centrale à 2,5 % de taux nominal face à 8 % d'inflation affichait un réel de 1,025/1,08 − 1 = **−5,09 %** — quatre hausses de taux plus tard, la politique était encore *massivement accommodante*. Quatre points de « hausses » n'avaient pas suffi à sortir du négatif.

C'est aussi la clé du principe de Taylor : si la banque centrale montait son taux exactement d'un pour un avec l'inflation, le réel ne bougerait pas — elle aurait l'air d'agir sans rien serrer du tout. La chute : restrictif ou pas ne se lit jamais sur le nominal ; ça se lit sur le réel, comparé à r* — et l'illusion nominale est le premier piège que ce module apprend à désamorcer.`,
    reponseModeleEn: `The trading floor's mental arithmetic answers first: r ≈ i − π = 10 − 8 = **2%**. Then it corrects itself, because that approximation errs on the high side. The exact relation is the **Fisher** equation: 1 + r = (1 + i)/(1 + π), i.e. r = 1.10/1.08 − 1 = **1.85%** — fifteen basis points less. The approximation neglects the cross term i×π and **always overstates** the real rate, the more so the higher rates and inflation are: at (5%, 2%), the gap was only six basis points (2.94% exact versus 3%); at (10%, 8%), fifteen. It degrades precisely in the regimes where you need it. The interview reflex: give the approximation, *then* flag the gap and its sign.

The real rate can be negative, and that is where the question turns political: a savings account at 3% under 5% inflation earns 1.03/1.05 − 1 = **−1.90%** — the saver *pays* to lend, in purchasing power. That regime has a name: **financial repression**.

Why does this equation decide whether a policy is restrictive? Because the rate that matters for economic decisions — borrowing, investing, saving — is never the displayed rate but what remains once inflation is deducted. A policy is **restrictive** when the real rate exceeds the neutral rate r*, **accommodative** below. The case that hurts: in the summer of 2022, a central bank at a 2.5% nominal rate facing 8% inflation showed a real rate of 1.025/1.08 − 1 = **−5.09%** — four rate hikes in, policy was still *massively accommodative*. Four points of "hikes" had not even lifted it out of negative territory.

It is also the key to the Taylor principle: if the central bank raised its rate exactly one-for-one with inflation, the real rate would not move — it would look busy while tightening nothing at all. The closing line: restrictive or not never reads on the nominal; it reads on the real rate, compared to r* — and nominal illusion is the first trap this module teaches you to defuse.`,
  },
  {
    id: 'm10-j-07',
    moduleId: M10,
    theme: 'la transmission',
    themeEn: 'the transmission',
    difficulte: 2,
    question: 'Concrètement, comment une hausse du taux directeur fait-elle baisser l\'inflation ? Déroulez les canaux.',
    questionEn: 'Concretely, how does a policy-rate hike bring inflation down? Walk me through the channels.',
    plan: [
      'Cadrer : la banque centrale ne fixe qu\'un prix — l\'argent au jour le jour entre banques ; le reste est un trajet en cinq canaux simultanés',
      'Les deux canaux du financement : le canal des taux (le crédit renchérit — la mensualité qui bondit) et le canal du crédit (les banques durcissent l\'offre, les spreads s\'écartent)',
      'Les deux canaux de marché : le change (devise plus forte, désinflation importée) et les prix d\'actifs (actualisation plus chère, effet richesse négatif)',
      'Le canal maître : les anticipations — l\'inflation est partiellement autoréalisatrice, et ce canal ne coûte rien à condition d\'être crédible',
    ],
    planEn: [
      'Frame it: the central bank sets only one price — overnight money between banks; the rest is a journey through five simultaneous channels',
      'The two financing channels: the interest-rate channel (credit gets dearer — the mortgage payment that jumps) and the credit channel (banks tighten supply, spreads widen)',
      'The two market channels: the exchange rate (stronger currency, imported disinflation) and asset prices (dearer discounting, negative wealth effect)',
      'The master channel: expectations — inflation is partially self-fulfilling, and this channel costs nothing provided you are credible',
    ],
    pointsAttendus: [
      'Le canal des taux, chiffré : 250 000 € sur 20 ans — mensualité de 1 150 € à 1 % contre 1 515 € à 4 % (+32 %) ; à mensualité constante, la capacité d\'emprunt tombe vers 190 000 € (−24 %) ; côté entreprises, 100 dans dix ans vaut 90,53 actualisé à 1 % mais 67,56 à 4 % — des projets rentables deviennent destructeurs de valeur',
      'Le canal du crédit : les bilans bancaires respirent avec les taux — coût de financement, collatéraux, risque de défaut — et la banque durcit ses critères : la quantité de crédit bouge, pas seulement son prix ; thermomètre : les spreads, qui amplifient la politique monétaire sur les plus fragiles',
      'Le canal du change : taux plus hauts, capitaux qui affluent, devise qui s\'apprécie — importations moins chères (désinflation importée), exports freinées ; 2022 : la Fed plus rapide que la BCE, l\'euro sous la parité, inflation européenne en partie importée par ce canal',
      'Le canal des prix d\'actifs : ΔP/P ≈ −Dmod×Δy pour les obligations, actualisation plus chère pour les actions et l\'immobilier — puis l\'effet richesse : des ménages plus pauvres consomment moins (fort aux États-Unis via les 401k, faible en Europe des livrets)',
      'Le canal des anticipations : si les agents croient au retour à 2 %, ils fixent prix et salaires en conséquence — la prophétie s\'autoréalise ; la communication EST de la politique monétaire, et « whatever it takes » a détendu les spreads de centaines de points de base sans un euro dépensé',
      'La fiche d\'oral : cinq canaux en une ligne chacun — taux, crédit, change, prix d\'actifs, anticipations — le dernier étant le plus puissant et le seul gratuit, réservé aux banques crédibles',
    ],
    pointsAttendusEn: [
      'The interest-rate channel, with numbers: 250,000 over 20 years — payment of 1,150 at 1% versus 1,515 at 4% (+32%); at constant payment, borrowing capacity falls to about 190,000 (−24%); on the corporate side, 100 in ten years is worth 90.53 discounted at 1% but 67.56 at 4% — profitable projects turn value-destroying',
      'The credit channel: bank balance sheets breathe with rates — funding cost, collateral values, default risk — and banks tighten their standards: the quantity of credit moves, not just its price; thermometer: credit spreads, which amplify monetary policy onto the most fragile',
      'The exchange-rate channel: higher rates, capital inflows, appreciating currency — cheaper imports (imported disinflation), curbed exports; 2022: the Fed faster than the ECB, the euro below parity, part of European inflation literally imported through this channel',
      'The asset-price channel: ΔP/P ≈ −Dmod×Δy for bonds, dearer discounting for equities and property — then the wealth effect: poorer households consume less (strong in the US via 401k, weak in savings-account Europe)',
      'The expectations channel: if agents believe in the return to 2%, they set prices and wages accordingly — the prophecy self-fulfils; communication IS monetary policy, and "whatever it takes" eased spreads by hundreds of basis points without a euro spent',
      'The oral cheat-sheet: five channels in one line each — rates, credit, exchange rate, asset prices, expectations — the last being the most powerful and the only free one, reserved for credible banks',
    ],
    bonus: [
      'L\'asymétrie structurelle : freiner marche toujours (personne n\'échappe à une mensualité), relancer non — on ne force personne à emprunter : pushing on a string, l\'explication de la décennie 2010',
      'La transmission dépend de l\'anatomie financière du pays : taux fixes ou variables, ménages endettés ou non, épargne en actions ou en livrets — même politique, effets différents ; c\'est le « variable » des long and variable lags',
    ],
    bonusEn: [
      'The structural asymmetry: braking always works (nobody escapes a mortgage payment), stimulating does not — you cannot force anyone to borrow: pushing on a string, the explanation of the 2010s',
      'Transmission depends on a country\'s financial anatomy: fixed or floating rates, indebted households or not, savings in equities or in deposit accounts — same policy, different effects; that is the "variable" in long and variable lags',
    ],
    reponseModele: `La banque centrale ne fixe qu'un seul prix — l'argent au jour le jour, entre banques. Ni le taux de votre crédit, ni le cours de l'euro, ni le prix des actions. Et pourtant tout finit par bouger : le trajet s'appelle la **transmission**, et il emprunte **cinq canaux** simultanément.

**Le canal des taux**, le plus direct : le taux directeur ancre le taux interbancaire, qui se propage à toute la courbe des financements. La démonstration tient dans une mensualité : 250 000 € sur 20 ans, c'est 1 150 € par mois à 1 % mais 1 515 € à 4 % — **+32 %** pour le même appartement ; lu à l'envers, à mensualité constante, la capacité d'emprunt tombe vers 190 000 € — un quart de pouvoir d'achat immobilier évaporé. Côté entreprises, même mécanique : 100 dans dix ans vaut 90,53 actualisé à 1 %, 67,56 à 4 % — des projets rentables deviennent destructeurs de valeur et sont abandonnés. **Le canal du crédit** ajoute la quantité au prix : les bilans bancaires respirent avec les taux — coût de financement en hausse, collatéraux en baisse, emprunteurs plus risqués — et la banque durcit ses critères ; les spreads s'écartent, et les plus fragiles ne trouvent plus de financement à aucun prix.

**Le canal du change** : des taux plus rémunérateurs attirent les capitaux, la devise s'apprécie — les importations coûtent moins cher (désinflation importée), les exportations freinent la demande. 2022 en direct : la Fed montant plus vite que la BCE, l'euro est passé sous la parité — une partie de l'inflation européenne était littéralement importée. **Le canal des prix d'actifs** : les taux sont le dénominateur de tous les prix — ΔP/P ≈ −Dmod×Δy pour les obligations, actualisation plus chère pour les actions et l'immobilier — puis l'**effet richesse** : des ménages appauvris consomment moins ; l'effet est puissant aux États-Unis (épargne en 401k), faible dans l'Europe des livrets.

Reste **le canal des anticipations**, le plus puissant et le seul gratuit : si entreprises et salariés croient au retour à 2 %, ils fixent prix et salaires en conséquence — et l'inflation revient à 2 % en partie *parce qu'ils y ont cru*. La communication n'est pas un commentaire de la politique monétaire : elle EST de la politique monétaire — « whatever it takes » a détendu les spreads de centaines de points de base sans un euro dépensé. La chute : quatre canaux coûtent de la croissance, le cinquième ne coûte que de la crédibilité — une banque crédible obtient la désinflation en parlant, une banque décrédibilisée doit l'acheter en récession.`,
    reponseModeleEn: `The central bank sets only one price — overnight money, between banks. Not your mortgage rate, not the euro, not equity prices. And yet everything ends up moving: the journey is called **transmission**, and it takes **five channels** simultaneously.

**The interest-rate channel**, the most direct: the policy rate anchors the interbank rate, which propagates along the whole financing curve. The demonstration fits in a mortgage payment: 250,000 over 20 years is 1,150 a month at 1% but 1,515 at 4% — **+32%** for the same flat; read backwards, at constant payment, borrowing capacity falls to about 190,000 — a quarter of housing purchasing power gone. On the corporate side, same mechanics: 100 in ten years is worth 90.53 discounted at 1%, 67.56 at 4% — profitable projects turn value-destroying and get shelved. **The credit channel** adds quantity to price: bank balance sheets breathe with rates — funding costs up, collateral down, riskier borrowers — and banks tighten standards; spreads widen, and the most fragile find no financing at any price.

**The exchange-rate channel**: better-paying rates attract capital, the currency appreciates — imports get cheaper (imported disinflation), exports cool demand. 2022 live: with the Fed moving faster than the ECB, the euro fell below parity — part of European inflation was literally imported. **The asset-price channel**: rates are the denominator of all prices — ΔP/P ≈ −Dmod×Δy for bonds, dearer discounting for equities and property — then the **wealth effect**: poorer households consume less; powerful in the US (401k savings), weak in deposit-account Europe.

That leaves **the expectations channel**, the most powerful and the only free one: if firms and workers believe in the return to 2%, they set prices and wages accordingly — and inflation returns to 2% partly *because they believed it*. Communication is not commentary on monetary policy: it IS monetary policy — "whatever it takes" eased spreads by hundreds of basis points without a euro spent. The closing line: four channels cost growth, the fifth costs only credibility — a credible bank obtains disinflation by talking, a discredited one must buy it with a recession.`,
  },
  {
    id: 'm10-j-08',
    moduleId: M10,
    theme: 'la transmission',
    themeEn: 'the transmission',
    difficulte: 2,
    question: 'Pourquoi l\'effet d\'une hausse de taux met-il 12 à 18 mois à se matérialiser — et qu\'est-ce que cela change au pilotage ?',
    questionEn: 'Why does the effect of a rate hike take 12 to 18 months to materialise — and what does that change about steering?',
    plan: [
      'Expliquer pourquoi c\'est long : le crédit signé hier court vingt ans, l\'entreprise achève le projet lancé, les salaires se renégocient une fois l\'an',
      'Nommer la doctrine : les long and variable lags de Friedman — longs (12 à 18 mois pour l\'essentiel de l\'effet sur l\'inflation) et variables (selon la structure de financement)',
      'En tirer la conséquence de pilotage : la banque centrale conduit en regardant dans le rétroviseur — l\'inflation du jour est le produit des décisions d\'il y a un an et demi',
      'Illustrer par le débat de 2023 : la « pause » — cesser de monter AVANT le retour à 2 %, parce que le resserrement déjà décidé n\'avait pas fini d\'agir',
    ],
    planEn: [
      'Explain why it is long: yesterday\'s mortgage runs twenty years, firms finish projects already launched, wages renegotiate once a year',
      'Name the doctrine: Friedman\'s long and variable lags — long (12 to 18 months for the bulk of the effect on inflation) and variable (depending on the financing structure)',
      'Draw the steering consequence: the central bank drives looking in the rear-view mirror — today\'s inflation is the product of decisions taken a year and a half ago',
      'Illustrate with the 2023 debate: the "pause" — stop hiking BEFORE the return to 2%, because the tightening already decided had not finished working',
    ],
    pointsAttendus: [
      'La raison physique des délais : les crédits déjà signés courent, les projets déjà lancés s\'achèvent, les salaires se renégocient une fois l\'an — les canaux mettent du temps à mordre',
      'La formule de Friedman : long and variable lags — l\'essentiel de l\'effet sur l\'inflation met 12 à 18 mois à se matérialiser',
      'Le « variable » : le délai dépend de la structure de financement de l\'économie — taux fixes ou variables, ménages endettés ou non, banques solides ou fragiles',
      'Le pilotage dans le rétroviseur : l\'inflation publiée ce mois-ci reflète les décisions d\'il y a un an et demi ; la hausse décidée aujourd\'hui ne mordra pleinement qu\'à la fin de l\'année prochaine',
      'L\'image à donner : freiner jusqu\'à sentir la décélération, quand la voiture répond avec dix-huit mois de retard, garantit le coup de frein de trop',
      'Le débat de 2023 : arrêter de monter avant le retour à 2 %, parce que le resserrement déjà décidé n\'avait pas fini de produire ses effets — la politique monétaire ne se juge pas sur l\'inflation du jour mais sur celle que les décisions d\'aujourd\'hui produiront dans dix-huit mois',
    ],
    pointsAttendusEn: [
      'The physical reason for the lags: signed mortgages keep running, launched projects get finished, wages renegotiate once a year — the channels take time to bite',
      'Friedman\'s phrase: long and variable lags — the bulk of the effect on inflation takes 12 to 18 months to materialise',
      'The "variable": the lag depends on the economy\'s financing structure — fixed or floating rates, indebted households or not, sound or fragile banks',
      'Steering in the rear-view mirror: this month\'s published inflation reflects decisions taken a year and a half ago; today\'s hike will only fully bite by the end of next year',
      'The image to give: braking until you feel the deceleration, when the car responds with an eighteen-month delay, guarantees braking too hard',
      'The 2023 debate: stop hiking before the return to 2%, because the tightening already decided had not finished working — monetary policy is judged not on today\'s inflation but on the inflation today\'s decisions will produce in eighteen months',
    ],
    bonus: [
      'L\'asymétrie jumelle : freiner marche mieux que relancer — on peut rendre l\'argent gratuit, on ne force personne à emprunter (pushing on a string) ; la boîte à outils est profonde côté freinage, étroite côté relance',
      'Le lien avec la courbe : le marché, lui, ne subit aucun délai — il price la trajectoire anticipée immédiatement ; c\'est l\'économie réelle qui répond avec 18 mois de retard, pas les prix d\'actifs',
    ],
    bonusEn: [
      'The twin asymmetry: braking works better than stimulating — you can make money free, you cannot force anyone to borrow (pushing on a string); the toolbox is deep on the braking side, narrow on the stimulus side',
      'The link with the curve: the market suffers no lag — it prices the anticipated path immediately; it is the real economy that responds with an 18-month delay, not asset prices',
    ],
    reponseModele: `Tous les canaux de transmission ont un point commun : ils prennent du **temps** — et pour des raisons physiques, pas mystérieuses. Le crédit immobilier signé hier court vingt ans : la hausse ne touche que les nouveaux emprunteurs. L'entreprise achève le projet déjà lancé : l'investissement ne se coupe qu'au projet suivant. Les salaires se renégocient une fois l'an : la boucle salariale ne réagit qu'à la prochaine négociation. La littérature — et Milton Friedman avant elle — parle de *long and variable lags* : les délais sont **longs** — l'essentiel de l'effet sur l'inflation met **12 à 18 mois** à se matérialiser — et **variables**, selon la structure de financement de l'économie : taux fixes ou variables, ménages endettés ou non, banques solides ou fragiles.

La conséquence de pilotage est redoutable : la banque centrale conduit **en regardant dans le rétroviseur**. L'inflation publiée ce mois-ci est le produit des décisions d'il y a un an et demi ; la hausse décidée aujourd'hui ne mordra pleinement qu'à la fin de l'année prochaine. Monter les taux « jusqu'à ce que l'inflation baisse », c'est freiner jusqu'à sentir la décélération alors que la voiture répond avec dix-huit mois de retard : quand l'effet arrive, on a déjà trop freiné.

C'est exactement l'argument central des débats de 2023 sur la « pause » : arrêter de monter **avant** le retour à 2 %, parce que le resserrement déjà décidé — 450 à 525 points de base selon la rive de l'Atlantique — n'avait pas fini de produire ses effets. Ne pas confondre cette prudence avec du renoncement : c'est la prise en compte du délai, pas l'abandon de la cible.

La chute, celle qui sépare les candidats : la politique monétaire ne se juge jamais sur l'inflation du jour, mais sur l'inflation que les décisions d'aujourd'hui produiront dans dix-huit mois. Et une nuance en bonus : le *marché*, lui, ne subit aucun délai — la courbe price la trajectoire anticipée immédiatement ; c'est l'économie réelle qui répond en retard, pas les prix d'actifs.`,
    reponseModeleEn: `All the transmission channels share one trait: they take **time** — for physical, not mysterious, reasons. Yesterday's signed mortgage runs twenty years: the hike only touches new borrowers. The firm finishes the project already launched: investment only gets cut at the next project. Wages renegotiate once a year: the wage loop only reacts at the next round. The literature — and Milton Friedman before it — speaks of *long and variable lags*: the lags are **long** — the bulk of the effect on inflation takes **12 to 18 months** to materialise — and **variable**, depending on the economy's financing structure: fixed or floating rates, indebted households or not, sound or fragile banks.

The steering consequence is formidable: the central bank drives **looking in the rear-view mirror**. This month's published inflation is the product of decisions taken a year and a half ago; the hike decided today will only fully bite by the end of next year. Raising rates "until inflation comes down" is braking until you feel the deceleration while the car responds with an eighteen-month delay: by the time the effect arrives, you have already braked too hard.

That is exactly the central argument of the 2023 "pause" debates: stop hiking **before** the return to 2%, because the tightening already decided — 450 to 525 basis points depending on the side of the Atlantic — had not finished working. Do not mistake that caution for surrender: it is the lag being priced in, not the target being abandoned.

The closing line, the one that separates candidates: monetary policy is never judged on today's inflation, but on the inflation that today's decisions will produce in eighteen months. And one nuance as a bonus: the *market* suffers no lag — the curve prices the anticipated path immediately; it is the real economy that answers late, not asset prices.`,
  },
  {
    id: 'm10-j-09',
    moduleId: M10,
    theme: 'la transmission',
    themeEn: 'the transmission',
    difficulte: 3,
    question: 'La courbe des taux s\'inverse : le 2 ans dépasse le 10 ans. Récession garantie ?',
    questionEn: 'The yield curve inverts: the 2-year exceeds the 10-year. Guaranteed recession?',
    plan: [
      'Poser la mécanique : un taux long est la moyenne des taux courts anticipés plus une prime de terme — l\'inversion signifie que le marché price des taux futurs PLUS BAS que les taux présents',
      'Traduire : « vous avez assez serré ; vous devrez baisser » — en creux, une anticipation de fort ralentissement',
      'Créditer le track record : l\'inversion (10 ans − 2 ans) a précédé toutes les récessions américaines depuis les années 1960, avec très peu de faux positifs',
      'Puis instruire les limites : délai imprévisible de 6 à 24 mois, et l\'épisode 2022-2024 — l\'inversion la plus profonde en quarante ans sans récession américaine dans la fenêtre habituelle',
    ],
    planEn: [
      'State the mechanics: a long rate is the average of expected short rates plus a term premium — inversion means the market prices future rates LOWER than present ones',
      'Translate: "you have tightened enough; you will have to cut" — implicitly, an expectation of a sharp slowdown',
      'Credit the track record: the inversion (10-year minus 2-year) has preceded every US recession since the 1960s, with very few false positives',
      'Then prosecute the limits: an unpredictable 6-to-24-month lag, and the 2022-2024 episode — the deepest inversion in forty years without a US recession in the usual window',
    ],
    pointsAttendus: [
      'La mécanique du module 4 : taux long = moyenne des taux courts anticipés + prime de terme ; si les longs passent SOUS les courts, le marché price des baisses de taux à venir',
      'La traduction économique : des baisses de taux futures signifient un ralentissement assez sérieux pour forcer la main de la banque centrale — l\'inversion est une anticipation de récession, pas une cause',
      'Le track record : lue sur l\'écart 10 ans − 2 ans, l\'inversion a précédé toutes les récessions américaines depuis les années 1960, avec très peu de faux positifs — le signal de récession le plus célèbre de la finance',
      'Première limite : le délai entre inversion et récession varie de 6 à 24 mois — le signal dit « une récession approche », jamais quand',
      'Deuxième limite : 2022-2024 — inversion la plus profonde en quarante ans, sans récession américaine dans la fenêtre habituelle ; le vieil indicateur peut crier au loup',
      'La lecture honnête : l\'inversion mesure ce que le marché ANTICIPE du cycle, pas le cycle lui-même — et quand la structure change (excès d\'épargne mondiale, primes de terme comprimées par le QE), le thermomètre se déforme',
    ],
    pointsAttendusEn: [
      'The module 4 mechanics: long rate = average of expected short rates + term premium; if longs fall BELOW shorts, the market is pricing rate cuts ahead',
      'The economic translation: future rate cuts mean a slowdown serious enough to force the central bank\'s hand — the inversion is an expectation of recession, not a cause',
      'The track record: read on the 10-year minus 2-year spread, the inversion has preceded every US recession since the 1960s, with very few false positives — the most famous recession signal in finance',
      'First limit: the lag between inversion and recession ranges from 6 to 24 months — the signal says "a recession is coming", never when',
      'Second limit: 2022-2024 — the deepest inversion in forty years, without a US recession in the usual window; the old indicator can cry wolf',
      'The honest reading: the inversion measures what the market EXPECTS of the cycle, not the cycle itself — and when the structure changes (global savings glut, term premiums compressed by QE), the thermometer warps',
    ],
    bonus: [
      'La grammaire complète de la courbe : pentification (le marché anticipe croissance et inflation — ou s\'inquiète de la relance budgétaire), aplatissement (le resserrement est en cours), inversion (le marché dit « vous devrez baisser ») — la courbe est le tableau de bord de la transmission',
      'Le lien QE : en comprimant les primes de terme, quinze ans d\'achats d\'actifs ont abaissé le niveau auquel la courbe s\'inverse — comparer les inversions d\'aujourd\'hui à celles de 1980 sans cette correction est un anachronisme',
    ],
    bonusEn: [
      'The curve\'s full grammar: steepening (the market expects growth and inflation — or worries about fiscal stimulus), flattening (tightening under way), inversion (the market says "you will have to cut") — the curve is the transmission\'s dashboard',
      'The QE link: by compressing term premiums, fifteen years of asset purchases lowered the level at which the curve inverts — comparing today\'s inversions to 1980\'s without that correction is an anachronism',
    ],
    reponseModele: `Commencer par la mécanique, héritée du module 4 : un taux long, c'est d'abord la **moyenne des taux courts anticipés** sur la période, plus une prime de terme. Si le 2 ans dépasse le 10 ans, c'est que le marché price des taux futurs **plus bas** que les taux présents — autrement dit, il dit à la banque centrale : « vous avez assez serré ; vous devrez baisser ». Et l'on ne baisse les taux que contre un ralentissement sérieux : l'inversion est, en creux, une **anticipation de récession**. Pas une cause — une opinion agrégée, cotée en continu.

Le track record force le respect : lue sur l'écart 10 ans − 2 ans, l'inversion a précédé **toutes les récessions américaines depuis les années 1960**, avec très peu de faux positifs — le signal de récession le plus célèbre de la finance.

Mais la seconde moitié de la réponse, celle qui fait la différence, instruit les limites. **Le délai d'abord** : entre l'inversion et la récession, il s'écoule de 6 à 24 mois — le signal dit « une récession approche », jamais quand ; inutilisable pour timer quoi que ce soit. **L'épisode 2022-2024 ensuite** : l'inversion la plus profonde en quarante ans n'a pas été suivie de récession américaine dans la fenêtre habituelle — le vieil indicateur peut crier au loup. La lecture honnête : l'inversion mesure ce que le marché *anticipe* du cycle, pas le cycle lui-même. Et quand la structure de l'économie change — excès d'épargne mondiale, primes de terme comprimées par quinze ans de QE —, le thermomètre se déforme : une courbe dont la prime de terme est artificiellement écrasée s'inverse plus facilement, à pessimisme égal.

Donc : récession garantie, non. Signal à prendre au sérieux, oui — à condition de le lire pour ce qu'il est : un sondage permanent du marché sur la trajectoire future des taux courts, avec un excellent historique, un timing inconnu, et un biais récent que tout candidat honnête signale de lui-même.`,
    reponseModeleEn: `Start with the mechanics, inherited from module 4: a long rate is first the **average of expected short rates** over the period, plus a term premium. If the 2-year exceeds the 10-year, the market is pricing future rates **lower** than present ones — in other words, it is telling the central bank: "you have tightened enough; you will have to cut". And rates only get cut against a serious slowdown: the inversion is, implicitly, an **expectation of recession**. Not a cause — an aggregated opinion, quoted continuously.

The track record commands respect: read on the 10-year minus 2-year spread, the inversion has preceded **every US recession since the 1960s**, with very few false positives — the most famous recession signal in finance.

But the second half of the answer, the one that makes the difference, prosecutes the limits. **The lag first**: between inversion and recession, 6 to 24 months elapse — the signal says "a recession is coming", never when; useless for timing anything. **The 2022-2024 episode next**: the deepest inversion in forty years was not followed by a US recession in the usual window — the old indicator can cry wolf. The honest reading: the inversion measures what the market *expects* of the cycle, not the cycle itself. And when the economy's structure changes — global savings glut, term premiums compressed by fifteen years of QE — the thermometer warps: a curve whose term premium is artificially crushed inverts more easily, for the same amount of pessimism.

So: guaranteed recession, no. A signal to take seriously, yes — provided you read it for what it is: a permanent market poll on the future path of short rates, with an excellent record, unknown timing, and a recent bias any honest candidate flags unprompted.`,
  },
  {
    id: 'm10-j-10',
    moduleId: M10,
    theme: 'l\'inflation',
    themeEn: 'inflation',
    difficulte: 2,
    question: 'Headline, core : lequel guide la banque centrale — et pourquoi ampute-t-on l\'indice de ce que le ménage sent le plus ?',
    questionEn: 'Headline, core: which one guides the central bank — and why amputate the index of what households feel most?',
    plan: [
      'Définir : headline = l\'indice complet ; core = hors énergie et alimentation — une amputation étrange en apparence, puisqu\'on retire le plein et le caddie',
      'Première logique, statistique : énergie et alimentation sont les composantes les plus volatiles — chocs pétroliers, récoltes, géopolitique — et brouillent la tendance de fond',
      'Deuxième logique, la vraie : la banque centrale ne raisonne qu\'en termes de ce que ses taux peuvent atteindre — monter le taux directeur ne fait pas pousser le blé ni ne rouvre un gazoduc',
      'Conclure sur la règle de lecture : le headline fait les titres, le core fait les décisions — headline 8 % avec core 3 % et headline 8 % avec core 6 % appellent deux politiques très différentes',
    ],
    planEn: [
      'Define: headline = the full index; core = excluding energy and food — a seemingly strange amputation, since you remove the fuel tank and the shopping trolley',
      'First logic, statistical: energy and food are the most volatile components — oil shocks, harvests, geopolitics — and blur the underlying trend',
      'Second logic, the real one: the central bank only reasons in terms of what its rates can reach — raising the policy rate does not grow wheat or reopen a pipeline',
      'Conclude with the reading rule: headline makes the headlines, core makes the decisions — headline 8% with core 3% and headline 8% with core 6% call for two very different policies',
    ],
    pointsAttendus: [
      'Les définitions : CPI américain, HICP/IPCH européen — un panier pondéré par la consommation des ménages ; le core est l\'indice hors énergie et alimentation',
      'Toute mesure d\'inflation est une convention : le panier d\'un étudiant locataire n\'est pas celui d\'un retraité propriétaire — « l\'inflation à 5 % » est une moyenne que personne ne vit exactement',
      'La logique statistique : énergie et alimentation subissent des chocs exogènes qui font faire au headline des embardées sans contenu sur la tendance',
      'La logique de politique monétaire : resserrer contre un choc pétrolier, c\'est ajouter une récession à un appauvrissement — le core estime l\'inflation d\'origine domestique et de demande, celle sur laquelle les taux ont prise',
      'La règle de lecture : headline 8 % / core 3 % (choc externe, qui passera) et headline 8 % / core 6 % (inflation installée) appellent deux politiques très différentes',
      'La précision qui évite le piège : le core n\'est pas toujours plus bas que le headline — quand l\'énergie chute, il lui est supérieur',
    ],
    pointsAttendusEn: [
      'The definitions: US CPI, European HICP — a basket weighted by household consumption; core is the index excluding energy and food',
      'Every inflation measure is a convention: a renting student\'s basket is not a home-owning retiree\'s — "5% inflation" is an average nobody lives exactly',
      'The statistical logic: energy and food suffer exogenous shocks that send headline on swings carrying no information about the trend',
      'The monetary-policy logic: tightening against an oil shock adds a recession to an impoverishment — core estimates domestically generated, demand-driven inflation, the kind rates can reach',
      'The reading rule: headline 8% / core 3% (external shock, which will pass) and headline 8% / core 6% (entrenched inflation) call for two very different policies',
      'The precision that avoids the trap: core is not always below headline — when energy falls, it sits above it',
    ],
    bonus: [
      'Les effets de base : le glissement annuel dépend autant du passé que du présent — un choc de +3 % qui sort de la fenêtre de douze mois fait chuter l\'inflation affichée de 2,9 points en un mois sans que le rythme courant ait changé ; devant tout chiffre en glissement, demander ce qui entre et ce qui sort de la fenêtre',
      'Le piège d\'annualisation jumeau : +0,5 % sur le mois n\'est pas « 6 % en rythme annuel » mais (1,005)^12 − 1 = 6,17 % — on ne multiplie jamais des taux, on les compose',
    ],
    bonusEn: [
      'Base effects: the year-on-year figure depends as much on the past as on the present — a +3% shock dropping out of the twelve-month window cuts displayed inflation by 2.9 points in one month with the current pace unchanged; before any year-on-year figure, ask what enters and what leaves the window',
      'The twin annualisation trap: +0.5% on the month is not "6% annualised" but (1.005)^12 − 1 = 6.17% — you never multiply rates, you compound them',
    ],
    reponseModele: `Le **core** — hors énergie et alimentation — guide les décisions ; le **headline** fait les titres. L'amputation semble absurde : on retire précisément ce que le ménage sent le plus au quotidien, le plein et le caddie. La logique est double, et la seconde est la vraie.

**Logique statistique** d'abord : énergie et alimentation sont les composantes les plus **volatiles** de l'indice — chocs pétroliers, récoltes, géopolitique. Elles font faire au chiffre headline des embardées qui ne disent rien de la tendance de fond ; le core les filtre pour lire le signal sous le bruit.

**Logique de politique monétaire** ensuite, et surtout : la banque centrale ne raisonne qu'en termes de **ce que ses taux peuvent atteindre**. Monter le taux directeur ne fait pas pousser le blé et ne rouvre pas un gazoduc — resserrer contre un choc pétrolier, c'est comprimer la demande pour compenser un choc d'offre : ajouter une récession à un appauvrissement. Le core estime l'inflation **d'origine domestique et de demande** — celle sur laquelle la politique monétaire a réellement prise. D'où la règle de lecture : un headline à 8 % avec un core à 3 % raconte un choc externe qui passera de lui-même ; le même headline avec un core à 6 % raconte une inflation installée dans les services et les salaires — deux mondes, deux politiques.

Deux précisions pour finir. Le core n'est pas un artifice pour embellir : quand l'énergie chute, il est *supérieur* au headline — l'amputation joue dans les deux sens. Et toute mesure d'inflation reste une **convention** : un panier moyen que personne ne consomme exactement — le panier de l'étudiant locataire n'est pas celui du retraité propriétaire. La chute : le ménage a raison de sentir le headline, la banque centrale a raison de piloter sur le core — ils ne mesurent pas la même chose, et c'est voulu.`,
    reponseModeleEn: `**Core** — excluding energy and food — guides the decisions; **headline** makes the headlines. The amputation looks absurd: you remove precisely what households feel most daily, the fuel tank and the shopping trolley. The logic is twofold, and the second is the real one.

**Statistical logic** first: energy and food are the index's most **volatile** components — oil shocks, harvests, geopolitics. They send the headline figure on swings that say nothing about the underlying trend; core filters them out to read the signal beneath the noise.

**Monetary-policy logic** second, and above all: the central bank only reasons in terms of **what its rates can reach**. Raising the policy rate does not grow wheat and does not reopen a gas pipeline — tightening against an oil shock means squeezing demand to offset a supply shock: adding a recession to an impoverishment. Core estimates **domestically generated, demand-driven** inflation — the kind monetary policy actually has a grip on. Hence the reading rule: a headline at 8% with core at 3% tells of an external shock that will pass on its own; the same headline with core at 6% tells of inflation entrenched in services and wages — two worlds, two policies.

Two final precisions. Core is no beautifying artifice: when energy falls, it sits *above* headline — the amputation cuts both ways. And any inflation measure remains a **convention**: an average basket nobody consumes exactly — the renting student's basket is not the home-owning retiree's. The closing line: households are right to feel the headline, the central bank is right to steer on the core — they do not measure the same thing, and that is by design.`,
  },
  {
    id: 'm10-j-11',
    moduleId: M10,
    theme: 'l\'inflation',
    themeEn: 'inflation',
    difficulte: 3,
    question: 'D\'où venait l\'inflation de 2021-2023 — et pourquoi est-elle repartie sans récession majeure ?',
    questionEn: 'Where did the 2021-2023 inflation come from — and why did it leave without a major recession?',
    plan: [
      'Le choc (2021) : tout arrive en même temps — demande dopée (relance + épargne forcée), coûts (chaînes cassées, fret hors de prix), puis février 2022, la guerre et l\'explosion du gaz',
      'L\'erreur de diagnostic : « transitoire » — taux laissés à zéro toute l\'année 2021 pendant que l\'inflation triple ; Powell enterre le mot devant le Congrès fin novembre 2021',
      'La riposte (2022-2023) : le resserrement le plus rapide de l\'histoire moderne — Fed +525 pb en seize mois, BCE +450 pb — contre des pics à 9,1 % (États-Unis) et 10,6 % (zone euro)',
      'L\'énigme finale : la désinflation sans récession majeure — part d\'offre du choc qui s\'est résorbée d\'elle-même, et surtout anticipations jamais désancrées : un ratio de sacrifice quasi nul, payé d\'avance par quarante ans de crédibilité',
    ],
    planEn: [
      'The shock (2021): everything at once — boosted demand (stimulus + forced savings), costs (broken supply chains, sky-high freight), then February 2022, the war and exploding gas prices',
      'The diagnostic error: "transitory" — rates left at zero all through 2021 while inflation tripled; Powell buries the word before Congress in late November 2021',
      'The response (2022-2023): the fastest tightening of the modern era — Fed +525 bp in sixteen months, ECB +450 bp — against peaks of 9.1% (US) and 10.6% (euro area)',
      'The final enigma: disinflation without a major recession — the supply share of the shock unwound by itself, and above all expectations never unanchored: a near-zero sacrifice ratio, paid in advance by forty years of credibility',
    ],
    pointsAttendus: [
      'Les trois moteurs simultanés : demande (plans de relance, épargne forcée des confinements qui se déverse), coûts (chaînes d\'approvisionnement cassées, conteneurs hors de prix), puis choc d\'offre pur (guerre en Ukraine, gaz et électricité en Europe, février 2022)',
      'Le rôle monétaire, bien posé : contrairement aux QE des années 2010, 2020-2021 combine création monétaire ET distribution directe (chèques, transferts) — M2 bondit de ~26 % en un an, la monnaie atteint la dépense sur une offre contrainte',
      'L\'épisode « transitory » : diagnostic de goulots appelés à se résorber, taux à zéro toute l\'année 2021 — Powell enterre officiellement le mot fin novembre 2021, quand l\'inflation s\'élargit aux services et aux salaires',
      'La riposte chiffrée : Fed de 0-0,25 % à 5,25-5,50 % en seize mois (+525 pb), BCE de −0,50 % à 4,00 % (+450 pb) — elle qui n\'avait pas monté ses taux depuis onze ans ; pics à 9,1 % (juin 2022, États-Unis) et 10,6 % (octobre 2022, zone euro)',
      'La désinflation en deux temps : effets de base énergétiques d\'abord (printemps 2023), core ensuite, plus lent, tiré par les services',
      'L\'explication de la « désinflation immaculée » : une part du choc était d\'offre (le gaz rebaisse, les chaînes rouvrent — l\'inflation retombe sans détruire de demande) et surtout les anticipations n\'ont jamais désancré — pas de spirale prix-salaires : la conviction a remplacé la force, le ratio de sacrifice a été payé d\'avance par quarante ans de cible tenue',
    ],
    pointsAttendusEn: [
      'The three simultaneous engines: demand (stimulus plans, lockdown forced savings pouring out), costs (broken supply chains, sky-high container rates), then a pure supply shock (war in Ukraine, gas and electricity in Europe, February 2022)',
      'The monetary role, properly framed: unlike the 2010s QE, 2020-2021 combines money creation AND direct distribution (checks, transfers) — M2 jumps ~26% in a year, money reaches spending against constrained supply',
      'The "transitory" episode: a diagnosis of bottlenecks bound to clear, rates at zero all through 2021 — Powell officially buries the word in late November 2021, as inflation broadens to services and wages',
      'The response in numbers: Fed from 0-0.25% to 5.25-5.50% in sixteen months (+525 bp), ECB from −0.50% to 4.00% (+450 bp) — having not raised rates for eleven years; peaks at 9.1% (June 2022, US) and 10.6% (October 2022, euro area)',
      'The two-stage disinflation: energy base effects first (spring 2023), core second, slower, driven by services',
      'The explanation of "immaculate disinflation": part of the shock was supply (gas falls back, chains reopen — inflation recedes without destroying demand) and above all expectations never unanchored — no wage-price spiral: conviction replaced force, the sacrifice ratio was paid in advance by forty years of a target held',
    ],
    bonus: [
      'La lecture MV = PY qui réconcilie tout : les QE des années 2010 ont gonflé M0 sans inflation parce que la monnaie restait en réserves (V s\'effondre) ; 2020-2021, les transferts budgétaires mettent la monnaie dans la dépense — la QTM n\'est ni une loi ni une relique : elle devient dangereuse quand la monnaie créée atteint l\'économie réelle',
      'La comparaison Volcker en une phrase : lui n\'avait ni le vent d\'offre favorable (le pétrole ne rebaissait pas), ni l\'ancrage (dix ans de promesses non tenues) — même désinflation d\'ampleur, facture opposée',
    ],
    bonusEn: [
      'The MV = PY reading that reconciles everything: the 2010s QEs inflated M0 without inflation because money stayed in reserves (V collapsed); in 2020-2021, fiscal transfers put money into spending — the QTM is neither a law nor a relic: it turns dangerous when created money reaches the real economy',
      'The Volcker comparison in one sentence: he had neither the favourable supply wind (oil was not falling back) nor the anchoring (ten years of broken promises) — a disinflation of similar size, an opposite bill',
    ],
    reponseModele: `**Le choc, 2021.** À la réouverture post-COVID, tout arrive en même temps. Côté **demande** : des plans de relance massifs et l'épargne forcée des confinements qui se déverse — et, différence décisive avec les QE des années 2010, la monnaie atteint cette fois la dépense : chèques et transferts budgétaires font bondir M2 d'environ 26 % en un an. Côté **coûts** : des chaînes d'approvisionnement cassées et un fret hors de prix. Puis, février 2022, la guerre en Ukraine — l'explosion du gaz et de l'électricité en Europe, un choc d'offre pur. Trois moteurs simultanés sur une offre contrainte : le manuel au grand complet.

**L'erreur, puis la riposte.** Les banques centrales diagnostiquent d'abord un phénomène « **transitoire** » — des goulots appelés à se résorber — et laissent les taux à zéro toute l'année 2021 pendant que l'inflation triple. Fin novembre 2021, Powell enterre officiellement le mot devant le Congrès : l'inflation s'élargissait aux services et aux salaires. Suit le resserrement le plus rapide de l'histoire moderne : Fed de 0-0,25 % à 5,25-5,50 % en seize mois (+525 points de base), BCE de −0,50 % à 4,00 % (+450) — elle qui n'avait pas monté ses taux depuis onze ans. Les pics : **9,1 %** aux États-Unis (juin 2022), **10,6 %** en zone euro (octobre 2022). Puis le reflux, en deux temps : effets de base énergétiques d'abord, désinflation du core ensuite, plus lente, tirée par les services.

**L'énigme finale** : cette désinflation s'est faite **sans récession majeure** — pas de récession américaine, une stagnation européenne sans effondrement, un chômage historiquement bas. Un ratio de sacrifice quasi nul : la « désinflation immaculée » que la théorie jugeait improbable. L'explication tient en deux morceaux. D'abord, une part du choc était **d'offre** : quand le gaz rebaisse et que les chaînes rouvrent, l'inflation retombe *sans* qu'il faille détruire de la demande — chose que Volcker n'a jamais eue de son côté. Ensuite et surtout, les anticipations **n'ont jamais désancré** : quarante ans de crédibilité accumulée depuis 1982 ont fait que personne n'a vraiment cru à l'inflation permanente — la boucle prix-salaires n'a pas pris, la conviction a remplacé la force.

La chute, la meilleure réponse d'oral du module : le ratio de sacrifice n'a pas été aboli, il a été **payé d'avance** — par quarante ans de cible tenue. La crédibilité est un actif qui se constitue en décennies et se consomme en crises ; 2021-2023 est le jour où l'on a vu le rendement de cet actif.`,
    reponseModeleEn: `**The shock, 2021.** At the post-COVID reopening, everything arrives at once. On the **demand** side: massive stimulus plans and lockdown forced savings pouring out — and, the decisive difference with the 2010s QEs, money this time reaches spending: checks and fiscal transfers send M2 up about 26% in a year. On the **cost** side: broken supply chains and sky-high freight. Then, February 2022, the war in Ukraine — exploding gas and electricity prices in Europe, a pure supply shock. Three simultaneous engines against constrained supply: the full textbook.

**The error, then the response.** Central banks first diagnose a "**transitory**" phenomenon — bottlenecks bound to clear — and leave rates at zero all through 2021 while inflation triples. In late November 2021, Powell officially buries the word before Congress: inflation was broadening to services and wages. Then comes the fastest tightening of the modern era: Fed from 0-0.25% to 5.25-5.50% in sixteen months (+525 basis points), ECB from −0.50% to 4.00% (+450) — a bank that had not raised rates in eleven years. The peaks: **9.1%** in the US (June 2022), **10.6%** in the euro area (October 2022). Then the ebb, in two stages: energy base effects first, core disinflation second, slower, driven by services.

**The final enigma**: this disinflation happened **without a major recession** — no US recession, European stagnation without collapse, historically low unemployment. A near-zero sacrifice ratio: the "immaculate disinflation" theory deemed improbable. The explanation holds in two pieces. First, part of the shock was **supply**: when gas falls back and chains reopen, inflation recedes *without* demand having to be destroyed — something Volcker never had on his side. Second and above all, expectations **never unanchored**: forty years of credibility accumulated since 1982 meant nobody truly believed in permanent inflation — the wage-price loop never caught, conviction replaced force.

The closing line, the module's best oral answer: the sacrifice ratio was not abolished, it was **paid in advance** — by forty years of a target held. Credibility is an asset built over decades and consumed in crises; 2021-2023 is the day the return on that asset was seen.`,
  },
  {
    id: 'm10-j-12',
    moduleId: M10,
    theme: 'l\'inflation',
    themeEn: 'inflation',
    difficulte: 3,
    question: 'Qu\'est-ce que le ratio de sacrifice — et pourquoi n\'est-il pas une constante de la nature ?',
    questionEn: 'What is the sacrifice ratio — and why is it not a constant of nature?',
    plan: [
      'Définir : les points de production cumulés perdus par point de désinflation obtenu — ratio = |écarts de production cumulés| / désinflation',
      'Chiffrer l\'étalon Volcker : dix points de désinflation (13,5 % en 1980 → 3,2 % en 1983) contre deux récessions et un chômage à 10,8 % — quinze points de PIB pour dix points d\'inflation donnent un ratio de 1,5',
      'Expliquer le mécanisme : la désinflation casse la boucle prix-salaires — par la conviction (les agents croient la banque centrale) ou par la force (assez de chômage pour que personne ne négocie)',
      'Conclure : le ratio est le prix de la désinflation POUR UN STOCK DE CRÉDIBILITÉ DONNÉ — Volcker a payé le tarif fort, 2021-2023 un tarif quasi nul, payé d\'avance',
    ],
    planEn: [
      'Define: the cumulative points of output lost per point of disinflation obtained — ratio = |cumulative output gaps| / disinflation',
      'Quantify the Volcker benchmark: ten points of disinflation (13.5% in 1980 → 3.2% in 1983) against two recessions and 10.8% unemployment — fifteen points of GDP for ten points of inflation gives a ratio of 1.5',
      'Explain the mechanism: disinflation breaks the wage-price loop — by conviction (agents believe the central bank) or by force (enough unemployment that nobody can negotiate)',
      'Conclude: the ratio is the price of disinflation FOR A GIVEN STOCK OF CREDIBILITY — Volcker paid full fare, 2021-2023 a near-zero fare, paid in advance',
    ],
    pointsAttendus: [
      'La définition et la formule : ratio de sacrifice = |écarts de production cumulés| / désinflation — les points de PIB perdus par point d\'inflation éradiqué',
      'L\'application numérique type : dix points de désinflation contre quinze points de production cumulés perdus donnent 15/10 = 1,5 — chaque point d\'inflation éradiqué a coûté un point et demi de PIB',
      'L\'étalon historique : Volcker — taux vers 20 % en 1981, inflation de 13,5 % (1980) à 3,2 % (1983), au prix de deux récessions enchaînées (1980, 1981-82) et d\'un chômage à 10,8 %, record d\'après-guerre',
      'Le mécanisme : il y a deux façons de casser la boucle prix-salaires — la conviction (les agents cessent d\'indexer parce qu\'ils croient la banque centrale) ou la force (assez de chômage pour que plus personne ne négocie de hausse)',
      'Pourquoi Volcker a payé le tarif fort : dix ans de promesses non tenues avaient détruit la parole de la Fed — il ne restait que la force ; mais la crédibilité reconquise est devenue le capital des quarante années suivantes',
      'Le contrepoint 2021-2023 : désinflation d\'ampleur comparable, ratio quasi nul — anticipations restées ancrées et part d\'offre du choc ; conclusion : le ratio n\'est pas une constante, c\'est le prix de la désinflation pour un stock de crédibilité donné',
    ],
    pointsAttendusEn: [
      'The definition and formula: sacrifice ratio = |cumulative output gaps| / disinflation — the points of GDP lost per point of inflation eradicated',
      'The standard numerical application: ten points of disinflation against fifteen cumulative points of output lost gives 15/10 = 1.5 — each point of inflation eradicated cost a point and a half of GDP',
      'The historical benchmark: Volcker — rates near 20% in 1981, inflation from 13.5% (1980) to 3.2% (1983), at the cost of two back-to-back recessions (1980, 1981-82) and 10.8% unemployment, the post-war record',
      'The mechanism: there are two ways to break the wage-price loop — conviction (agents stop indexing because they believe the central bank) or force (enough unemployment that nobody can negotiate a raise)',
      'Why Volcker paid full fare: ten years of broken promises had destroyed the Fed\'s word — only force remained; but the reconquered credibility became the capital of the following forty years',
      'The 2021-2023 counterpoint: a disinflation of comparable size, near-zero ratio — expectations stayed anchored and the shock had a supply component; conclusion: the ratio is not a constant, it is the price of disinflation for a given stock of credibility',
    ],
    bonus: [
      'Le lien avec le désancrage : tant que les anticipations sont ancrées, un choc reste un épisode — personne n\'indexe, la boucle ne prend pas ; désancrées, l\'inflation s\'installe dans les contrats et les baux, devient inertielle, et il faut une récession pour l\'en déloger — le ratio de sacrifice mesure exactement ce qu\'il en coûte',
      'La formule qui résume : les banques centrales des décennies 1990-2010 ont piloté l\'inflation à coups de communiqués là où Volcker avait eu besoin de 20 % de taux — la crédibilité se paie comptant et se rembourse pendant quarante ans',
    ],
    bonusEn: [
      'The link with unanchoring: as long as expectations are anchored, a shock remains an episode — nobody indexes, the loop never catches; unanchored, inflation settles into contracts and leases, turns inertial, and it takes a recession to dislodge it — the sacrifice ratio measures exactly what that costs',
      'The summarising line: central banks of the 1990s-2010s steered inflation with press releases where Volcker had needed 20% rates — credibility is paid in cash and repays over forty years',
    ],
    reponseModele: `Une fois l'inflation installée, l'en déloger coûte — et ce coût a une unité de mesure : le **ratio de sacrifice**, les points de production cumulés perdus par point de désinflation obtenu : ratio = |écarts de production cumulés| / désinflation. Ordre de grandeur à manipuler : dix points de désinflation contre quinze points de production cumulés perdus donnent 15/10 = **1,5** — chaque point d'inflation éradiqué a coûté un point et demi de PIB.

L'étalon historique s'appelle **Volcker**. Nommé en 1979 face à une inflation installée depuis dix ans et des anticipations désancrées, il monte les taux jusqu'à environ 20 % : l'inflation tombe de 13,5 % (1980) à 3,2 % (1983) — dix points de désinflation — au prix de **deux récessions** enchaînées (1980, puis 1981-82) et d'un chômage porté à 10,8 %, son record d'après-guerre. C'est la facture qu'une banque centrale décrédibilisée doit payer : elle **achète** la désinflation en récession.

Car c'est la crédibilité qui fixe le prix. La désinflation opère en cassant la boucle prix-salaires, et il y a deux façons de la casser : par la **conviction** — les agents croient la banque centrale, cessent d'indexer, l'inflation retombe presque seule — ou par la **force** — assez de chômage pour que plus personne ne puisse négocier une hausse. Volcker a payé le tarif fort précisément parce que dix ans de promesses non tenues avaient détruit la parole de la Fed : il ne restait que la force. Mais l'épisode a un second versant : la crédibilité reconquise en 1982 est devenue le capital des quarante années suivantes — ses successeurs ont piloté l'inflation à coups de communiqués là où lui avait eu besoin de 20 % de taux.

D'où la réponse à la seconde partie de la question : le ratio de sacrifice n'est pas une constante de la nature, c'est **le prix de la désinflation pour un stock de crédibilité donné**. La démonstration par les extrêmes : Volcker, anticipations perdues, ratio largement positif ; 2021-2023, anticipations tenues et part d'offre du choc, ratio quasi nul — la « désinflation immaculée ». Même ampleur de désinflation, factures opposées : entre les deux, quarante ans de cible tenue.`,
    reponseModeleEn: `Once inflation is entrenched, dislodging it costs — and that cost has a unit of measurement: the **sacrifice ratio**, the cumulative points of output lost per point of disinflation obtained: ratio = |cumulative output gaps| / disinflation. An order of magnitude to handle: ten points of disinflation against fifteen cumulative points of output lost gives 15/10 = **1.5** — each point of inflation eradicated cost a point and a half of GDP.

The historical benchmark is called **Volcker**. Appointed in 1979 against inflation entrenched for a decade and unanchored expectations, he raises rates to about 20%: inflation falls from 13.5% (1980) to 3.2% (1983) — ten points of disinflation — at the cost of **two back-to-back recessions** (1980, then 1981-82) and unemployment pushed to 10.8%, its post-war record. That is the bill a discredited central bank must pay: it **buys** disinflation with a recession.

Because it is credibility that sets the price. Disinflation works by breaking the wage-price loop, and there are two ways to break it: by **conviction** — agents believe the central bank, stop indexing, inflation subsides almost on its own — or by **force** — enough unemployment that nobody can negotiate a raise anymore. Volcker paid full fare precisely because ten years of broken promises had destroyed the Fed's word: only force remained. But the episode has a second side: the credibility reconquered in 1982 became the capital of the next forty years — his successors steered inflation with press releases where he had needed 20% rates.

Hence the answer to the question's second half: the sacrifice ratio is not a constant of nature, it is **the price of disinflation for a given stock of credibility**. The proof by extremes: Volcker, expectations lost, a clearly positive ratio; 2021-2023, expectations held plus a supply component to the shock, a near-zero ratio — the "immaculate disinflation". Same size of disinflation, opposite bills: between the two, forty years of a target held.`,
  },
  {
    id: 'm10-j-13',
    moduleId: M10,
    theme: 'l\'arsenal non conventionnel',
    themeEn: 'the unconventional arsenal',
    difficulte: 3,
    question: '« Le QE, c\'est la planche à billets — donc l\'inflation finira par exploser. » Démontez cet argument.',
    questionEn: '"QE is money printing — so inflation will eventually explode." Take this argument apart.',
    plan: [
      'Décrire l\'opération réelle : la banque centrale achète des titres et les paie en créditant les réserves de la banque vendeuse — la banque commerciale ne fait qu\'échanger un actif contre un autre',
      'Distinguer les deux monnaies : M0 (billets + réserves — la monnaie DES banques) et M2 (dépôts du public — la monnaie qui circule) ; le QE gonfle M0 mécaniquement, M2 seulement si le crédit repart',
      'Produire la preuve empirique : 2008-2014, M0 multipliée par presque cinq, M2 à son rythme d\'avant-crise (~6 % par an), inflation SOUS la cible',
      'Le contre-exemple qui confirme : 2020-2021, transferts budgétaires directs — M2 +26 % en un an, et l\'inflation suit ; conclusion : ce n\'est pas la taille du bilan qui fait l\'inflation, c\'est la monnaie qui atteint l\'économie réelle',
    ],
    planEn: [
      'Describe the actual operation: the central bank buys securities and pays by crediting the selling bank\'s reserves — the commercial bank merely swaps one asset for another',
      'Distinguish the two monies: M0 (banknotes + reserves — the banks\' money) and M2 (public deposits — the money that circulates); QE inflates M0 mechanically, M2 only if credit picks up',
      'Produce the empirical proof: 2008-2014, M0 multiplied by nearly five, M2 at its pre-crisis pace (~6% per year), inflation BELOW target',
      'The confirming counter-example: 2020-2021, direct fiscal transfers — M2 +26% in a year, and inflation follows; conclusion: it is not the balance-sheet size that makes inflation, it is the money that reaches the real economy',
    ],
    pointsAttendus: [
      'La mécanique comptable : achat de titres payé en créditant le compte de réserves de la banque vendeuse — la banque centrale grossit des deux côtés, la banque commerciale échange un titre à 10 ans contre un dépôt à vue chez elle ; aucun euro n\'atterrit sur le compte d\'un ménage',
      'La distinction M0/M2 : les réserves sont la monnaie des banques, elles ne circulent qu\'entre elles et la banque centrale — M2, la monnaie du public, n\'est créée que par le crédit bancaire, que rien n\'oblige à repartir',
      'Les chiffres 2008-2014 : base monétaire multipliée par presque cinq (d\'environ 850 à ~4 000 milliards de dollars), M2 à ~6 % par an, inflation sous-jacente SOUS la cible de 2 % — le multiplicateur monétaire s\'est effondré',
      'Le contre-exemple 2020-2021 : création monétaire PLUS distribution directe (chèques, prêts garantis) — M2 bondit de ~26 % en un an sur une offre contrainte, et l\'inflation suit en 2021-2022',
      'Ce que le QE fait vraiment : baisser les taux longs par deux canaux — le signal (les achats rendent crédible la promesse de taux bas durables) et la rareté de la duration (la prime de terme se comprime) ; effet estimé pour QE1 : 50 à 100 pb sur le 10 ans, moins ensuite',
      'La leçon d\'une phrase : ce n\'est pas la taille du bilan de la banque centrale qui fait l\'inflation, c\'est la monnaie qui atteint la dépense — les hyperinflations (Weimar, Zimbabwe, Venezuela) sont des cas où la planche finançait directement l\'État',
    ],
    pointsAttendusEn: [
      'The accounting mechanics: securities purchased and paid for by crediting the selling bank\'s reserve account — the central bank grows on both sides, the commercial bank swaps a 10-year security for a sight deposit at the central bank; not a euro lands in a household account',
      'The M0/M2 distinction: reserves are the banks\' money, circulating only between them and the central bank — M2, the public\'s money, is created only by bank credit, which nothing forces to pick up',
      'The 2008-2014 numbers: the monetary base multiplied by nearly five (from about 850 to ~4,000 billion dollars), M2 at ~6% per year, core inflation BELOW the 2% target — the money multiplier collapsed',
      'The 2020-2021 counter-example: money creation PLUS direct distribution (checks, guaranteed loans) — M2 jumps ~26% in a year against constrained supply, and inflation follows in 2021-2022',
      'What QE actually does: lower long rates through two channels — the signal (purchases make the promise of durably low rates credible) and duration scarcity (the term premium compresses); estimated effect for QE1: 50 to 100 bp on the 10-year, less afterwards',
      'The one-sentence lesson: it is not the central bank\'s balance-sheet size that makes inflation, it is the money that reaches spending — hyperinflations (Weimar, Zimbabwe, Venezuela) are cases where the printing press financed the state directly',
    ],
    bonus: [
      'Les ordres de grandeur des bilans : Fed ~9 000 milliards de dollars au printemps 2022 (~35 % du PIB), Eurosystème ~65 % du PIB, Banque du Japon plus de 120 % — en quinze ans, les grands bilans sont passés d\'un étiage de 5-15 % du PIB à 30-60 % et au-delà',
      'Les vraies critiques du QE, plus solides que la planche à billets : les inégalités (l\'effet richesse EST le mécanisme), la zombification (BRI), et la dominance budgétaire — quand la banque centrale détient un tiers de la dette de son État, la frontière avec le financement monétaire devient une question de foi',
    ],
    bonusEn: [
      'The balance-sheet orders of magnitude: Fed ~9,000 billion dollars in spring 2022 (~35% of GDP), Eurosystem ~65% of GDP, Bank of Japan over 120% — in fifteen years, the big balance sheets went from a 5-15% of GDP low-water mark to 30-60% and beyond',
      'The real critiques of QE, sounder than money printing: inequality (the wealth effect IS the mechanism), zombification (BIS), and fiscal dominance — when the central bank holds a third of its state\'s debt, the border with monetary financing becomes a matter of faith',
    ],
    reponseModele: `L'argument confond deux monnaies. Regardons d'abord l'opération réelle : le QE, c'est la banque centrale qui achète des obligations et les paie en **créditant le compte de réserves** de la banque vendeuse chez elle. Deux bilans bougent : la banque centrale grossit des deux côtés ; la banque commerciale, elle, ne fait qu'**échanger un actif contre un autre** — un titre à 10 ans contre un dépôt à vue à la banque centrale. Aucun euro n'atterrit sur le compte d'un ménage : les réserves sont la monnaie *des banques*, elles ne circulent qu'entre elles et la banque centrale.

D'où la distinction que les agrégats font pour nous : **M0** (billets + réserves), la monnaie de la banque centrale, et **M2** (dépôts du public), la monnaie qui circule dans l'économie — créée par le **crédit bancaire**, que rien n'oblige à repartir. Le QE gonfle M0 mécaniquement ; il ne gonfle M2 que si les banques prêtent davantage. Les chiffres américains sont éloquents : de 2008 à 2014, la base monétaire est multipliée par presque cinq (d'environ 850 à 4 000 milliards de dollars), pendant que M2 continue de croître à son rythme d'avant-crise, environ 6 % par an — et l'inflation sous-jacente végète *sous* la cible de 2 %. Le multiplicateur monétaire s'est effondré, voilà tout. L'hyperinflation annoncée n'a pas eu lieu parce que la monnaie créée n'a jamais quitté le circuit interbancaire.

Le contre-exemple qui confirme la règle : **2020-2021**. Cette fois, création monétaire ET distribution directe — chèques américains, transferts, prêts garantis : M2 bondit d'environ 26 % en un an, sur une offre contrainte — et l'inflation suit en 2021-2022. Même « planche », destinations opposées, résultats opposés. Quant aux hyperinflations qui hantent l'argument — Weimar, Zimbabwe, Venezuela —, ce sont des cas où la planche finançait directement les dépenses de l'État : la monnaie atteignait la dépense dès le premier jour.

Ce que le QE fait vraiment, c'est autre chose : baisser les taux **longs** quand le taux court est au plancher — par le signal (les achats rendent crédible la promesse de taux bas durables) et par la rareté de la duration (la prime de terme se comprime) ; de l'ordre de 50 à 100 points de base pour QE1, moins ensuite. La leçon en une phrase : ce n'est pas la taille du bilan de la banque centrale qui fait l'inflation — c'est la monnaie qui atteint l'économie réelle. Et les vraies critiques du QE sont ailleurs : inégalités, zombification, dominance budgétaire — elles ne mordent pas à trois mois, mais à dix ans.`,
    reponseModeleEn: `The argument confuses two monies. Look first at the actual operation: QE is the central bank buying bonds and paying for them by **crediting the reserve account** of the selling bank. Two balance sheets move: the central bank grows on both sides; the commercial bank merely **swaps one asset for another** — a 10-year security for a sight deposit at the central bank. Not a euro lands in a household's account: reserves are the *banks'* money, circulating only between them and the central bank.

Hence the distinction the aggregates draw for us: **M0** (banknotes + reserves), the central bank's money, and **M2** (public deposits), the money circulating in the economy — created by **bank credit**, which nothing forces to pick up. QE inflates M0 mechanically; it only inflates M2 if banks lend more. The American numbers are eloquent: from 2008 to 2014, the monetary base is multiplied by nearly five (from about 850 to 4,000 billion dollars), while M2 keeps growing at its pre-crisis pace, about 6% per year — and core inflation languishes *below* the 2% target. The money multiplier collapsed, that is all. The announced hyperinflation never came because the created money never left the interbank circuit.

The counter-example that proves the rule: **2020-2021**. This time, money creation AND direct distribution — American checks, transfers, guaranteed loans: M2 jumps about 26% in one year, against constrained supply — and inflation follows in 2021-2022. Same "printing press", opposite destinations, opposite results. As for the hyperinflations haunting the argument — Weimar, Zimbabwe, Venezuela — those are cases where the press financed state spending directly: money reached spending from day one.

What QE actually does is something else: lower **long** rates when the short rate is at the floor — through the signal (purchases make the promise of durably low rates credible) and through duration scarcity (the term premium compresses); on the order of 50 to 100 basis points for QE1, less afterwards. The one-sentence lesson: it is not the central bank's balance-sheet size that makes inflation — it is the money that reaches the real economy. And the real critiques of QE lie elsewhere: inequality, zombification, fiscal dominance — they do not bite at three months, but at ten years.`,
  },
  {
    id: 'm10-j-14',
    moduleId: M10,
    theme: 'l\'arsenal non conventionnel',
    themeEn: 'the unconventional arsenal',
    difficulte: 3,
    question: 'Le QT est-il simplement le QE à l\'envers ? Pourquoi tant de prudence pour maigrir, quand on avait grossi à marche forcée ?',
    questionEn: 'Is QT simply QE in reverse? Why so much caution to slim down, when the fattening was done at forced march?',
    plan: [
      'Décrire les deux méthodes : vendre les titres (presque jamais — c\'est provoquer le choc de taux qu\'on veut éviter) ou laisser courir les maturités sans réinvestir, avec des plafonds mensuels',
      'Poser l\'asymétrie fondamentale : en QE on ajoute des réserves à un système qui les absorbe ; en QT on en retire SANS SAVOIR où est le plancher — le niveau en dessous duquel la tuyauterie se grippe',
      'Produire la preuve : 17 septembre 2019 — après deux ans de QT, le taux repo s\'envole vers 10 % en séance, sans aucune insolvabilité nulle part : une pure panne de plomberie',
      'Conclure : le QE se pilote au tableau de bord, le QT au bruit du moteur — d\'où les plafonds, le refus de vendre, et le régime de « réserves amples »',
    ],
    planEn: [
      'Describe the two methods: selling the securities (almost never — that means causing the very rate shock you want to avoid) or letting maturities run off without reinvesting, with monthly caps',
      'State the fundamental asymmetry: in QE you add reserves to a system that absorbs them; in QT you withdraw them WITHOUT KNOWING where the floor is — the level below which the plumbing seizes',
      'Produce the proof: 17 September 2019 — after two years of QT, the repo rate spikes towards 10% intraday, with no insolvency anywhere: a pure plumbing failure',
      'Conclude: QE is flown by the dashboard, QT by the sound of the engine — hence the caps, the refusal to sell, and the "ample reserves" regime',
    ],
    pointsAttendus: [
      'Les deux méthodes : vendre — presque jamais employé (la Banque d\'Angleterre en 2022 fait exception) car vendre de la duration par centaines de milliards provoque exactement le choc qu\'on veut éviter — ou laisser courir (run-off) sans réinvestir les titres arrivant à maturité',
      'Les plafonds mensuels pour lisser : la Fed de 2022 plafonne à 60 milliards de dollars de Treasuries plus 35 de titres hypothécaires par mois — et Yellen promettait un processus « aussi ennuyeux que regarder la peinture sécher »',
      'L\'asymétrie structurelle : ajouter des réserves ne casse rien ; en retirer, c\'est chercher à tâtons un plancher inconnu — le niveau de réserves minimal dont la tuyauterie financière a besoin, qu\'on ne découvre qu\'en le touchant',
      'Le cas d\'école du 17 septembre 2019 : réserves fondues d\'environ 2 800 à 1 400 milliards de dollars après deux ans de QT ; un jour d\'impôts et de règlements du Trésor, le repo s\'envole vers 10 % en séance, le SOFR imprime 5,25 % contre un taux directeur visé de 2-2,25 %',
      'Le diagnostic : rien d\'insolvable nulle part — une panne de plomberie : les réserves étaient devenues juste assez rares pour que les banques refusent de les prêter un soir de tension ; la Fed réinjecte dès le lendemain et se remet à acheter',
      'La moralité : le QT n\'est pas le QE à l\'envers — le QE se pilote au tableau de bord, le QT au bruit du moteur ; le régime de « réserves amples » adopté depuis vise à ne plus jamais chercher le plancher à tâtons',
    ],
    pointsAttendusEn: [
      'The two methods: selling — almost never used (the Bank of England in 2022 is the exception) because selling duration by the hundreds of billions causes exactly the shock you want to avoid — or run-off, not reinvesting maturing securities',
      'Monthly caps to smooth: the 2022 Fed caps at 60 billion dollars of Treasuries plus 35 of mortgage securities per month — and Yellen promised a process "as boring as watching paint dry"',
      'The structural asymmetry: adding reserves breaks nothing; withdrawing them means groping for an unknown floor — the minimum level of reserves the financial plumbing needs, discovered only by touching it',
      'The 17 September 2019 case study: reserves melted from about 2,800 to 1,400 billion dollars after two years of QT; on a corporate tax and Treasury settlement day, repo spikes towards 10% intraday, SOFR prints 5.25% against a targeted policy rate of 2-2.25%',
      'The diagnosis: nothing insolvent anywhere — a plumbing failure: reserves had become just scarce enough for banks to refuse to lend them on a night of tension; the Fed reinjects the next day and resumes buying Treasury bills',
      'The moral: QT is not QE in reverse — QE is flown by the dashboard, QT by the sound of the engine; the "ample reserves" regime adopted since aims at never groping for the floor again',
    ],
    bonus: [
      'Le conflit d\'objectifs illustré par les gilts : septembre 2022, la Banque d\'Angleterre s\'apprêtait à VENDRE des gilts au titre du QT quand la spirale LDI l\'a forcée à en ACHETER en urgence, treize jours ouvrés — stabilité financière et politique monétaire peuvent se contredire un mardi matin',
      'Le rôle de l\'ON RRP dans le cycle 2022-2024 : les plus de 2 000 milliards de dollars garés chaque nuit à la Fed ont servi de réservoir tampon — le QT a d\'abord drainé ce cash inemployé avant de mordre sur les réserves des banques',
    ],
    bonusEn: [
      'The objectives conflict illustrated by gilts: September 2022, the Bank of England was about to SELL gilts under QT when the LDI spiral forced it to BUY them urgently, for thirteen business days — financial stability and monetary policy can contradict each other on a Tuesday morning',
      'The ON RRP\'s role in the 2022-2024 cycle: the 2,000-plus billion dollars parked at the Fed every night served as a buffer tank — QT first drained that idle cash before biting into bank reserves',
    ],
    reponseModele: `Non — et l'asymétrie est structurelle, pas psychologique. Commençons par la méthode. Pour maigrir, deux options : **vendre** les titres — presque jamais employé, la Banque d'Angleterre de 2022 faisant exception, car vendre de la duration par centaines de milliards, c'est provoquer exactement le choc de taux qu'on veut éviter — ou **laisser courir** (*run-off*) : ne pas réinvestir les titres qui arrivent à maturité, avec des **plafonds mensuels** pour lisser — la Fed de 2022 plafonne à 60 milliards de dollars de Treasuries plus 35 de titres hypothécaires par mois. Janet Yellen promettait un processus « aussi ennuyeux que regarder la peinture sécher ».

Pourquoi tant de prudence ? Parce qu'en QE, la banque centrale *ajoute* des réserves à un système qui les absorbe sans broncher ; en QT, elle en *retire* — **sans savoir où se trouve le plancher**, le niveau de réserves en dessous duquel la tuyauterie financière se grippe. Personne ne connaît ce chiffre à l'avance ; on le découvre en le touchant.

On l'a touché une fois, et la date est à retenir : le **17 septembre 2019**. Premier QT de la Fed, les réserves ont fondu d'environ 2 800 à 1 400 milliards de dollars. Un mardi banal — jour de paiement d'impôts des entreprises et de règlement d'adjudications du Trésor — la demande de cash bondit, l'offre ne suit pas : le taux **repo** s'envole en séance jusqu'à environ 10 %, et le SOFR imprime 5,25 % quand le taux directeur vise 2-2,25 %. Rien d'insolvable nulle part : une pure **panne de plomberie** — les réserves, que tout le monde croyait abondantes, étaient devenues juste assez rares pour que les banques refusent de les prêter un soir de tension. La Fed réinjecte des dizaines de milliards dès le lendemain, puis se remet à acheter des bons du Trésor.

La moralité d'oral : le QE se pilote **au tableau de bord**, le QT **au bruit du moteur**. D'où les plafonds, le refus de vendre, et le régime de « réserves amples » adopté depuis — ne plus jamais chercher le plancher à tâtons. Et un raffinement pour finir : le conflit d'objectifs peut devenir spectaculaire — en septembre 2022, la Banque d'Angleterre s'apprêtait à *vendre* des gilts au titre du QT quand la spirale LDI l'a forcée à en *acheter* en urgence. Maigrir est un exercice qui s'interrompt le jour où le marché casse.`,
    reponseModeleEn: `No — and the asymmetry is structural, not psychological. Start with the method. To slim down, two options: **sell** the securities — almost never used, the 2022 Bank of England being the exception, because selling duration by the hundreds of billions causes exactly the rate shock you want to avoid — or **run-off**: stop reinvesting maturing securities, with **monthly caps** to smooth — the 2022 Fed caps at 60 billion dollars of Treasuries plus 35 of mortgage securities per month. Janet Yellen promised a process "as boring as watching paint dry".

Why so much caution? Because in QE, the central bank *adds* reserves to a system that absorbs them without flinching; in QT, it *withdraws* them — **without knowing where the floor is**, the level of reserves below which the financial plumbing seizes. Nobody knows that number in advance; you discover it by touching it.

It was touched once, and the date is worth remembering: **17 September 2019**. First Fed QT, reserves had melted from about 2,800 to 1,400 billion dollars. On an ordinary Tuesday — corporate tax day and Treasury auction settlement day — cash demand jumps, supply does not follow: the **repo** rate spikes intraday to about 10%, and SOFR prints 5.25% while the policy rate targets 2-2.25%. Nothing insolvent anywhere: a pure **plumbing failure** — reserves, which everyone believed abundant, had become just scarce enough for banks to refuse to lend them on a night of tension. The Fed reinjects tens of billions the next day, then resumes buying Treasury bills.

The oral moral: QE is flown **by the dashboard**, QT **by the sound of the engine**. Hence the caps, the refusal to sell, and the "ample reserves" regime adopted since — never grope for the floor again. And one refinement to finish: the objectives conflict can turn spectacular — in September 2022, the Bank of England was about to *sell* gilts under QT when the LDI spiral forced it to *buy* them urgently. Slimming down is an exercise that stops the day the market breaks.`,
  },
  {
    id: 'm10-j-15',
    moduleId: M10,
    theme: 'l\'arsenal non conventionnel',
    themeEn: 'the unconventional arsenal',
    difficulte: 3,
    question: 'Les taux négatifs ont-ils marché ?',
    questionEn: 'Did negative rates work?',
    plan: [
      'Pourquoi c\'est possible : le plancher zéro est moins dur qu\'annoncé — stocker physiquement des milliards de billets coûte (coffres, assurance, transport), ce qui ouvre un peu d\'espace sous zéro',
      'Qui et combien : la BCE ose en juin 2014 (−0,10 %) et descend à −0,50 % de 2019 à 2022 ; la Suisse va à −0,75 % ; Danemark, Suède, Japon suivent',
      'Le mécanisme et son grain de sable : une taxe sur les réserves censée pousser à prêter — mais les banques n\'osent pas répercuter sur les dépôts, leur marge d\'intérêt se comprime, et la capacité à prêter avec',
      'Le verdict nuancé : le reversal rate — sous un seuil, baisser devient contractionniste ; l\'outil a fonctionné à petites doses (tiering en amortisseur), et tout le monde en est sorti entre 2022 et 2024',
    ],
    planEn: [
      'Why it is possible: the zero floor is softer than announced — physically storing billions in banknotes costs money (vaults, insurance, transport), which opens some room below zero',
      'Who and how much: the ECB dares in June 2014 (−0.10%) and goes down to −0.50% from 2019 to 2022; Switzerland goes to −0.75%; Denmark, Sweden, Japan follow',
      'The mechanism and its grain of sand: a tax on reserves meant to push lending — but banks dare not pass it on to deposits, their interest margin compresses, and lending capacity with it',
      'The nuanced verdict: the reversal rate — below a threshold, cutting turns contractionary; the tool worked in small doses (tiering as a shock absorber), and everyone exited between 2022 and 2024',
    ],
    pointsAttendus: [
      'Le fondement : le billet de banque rapporte toujours exactement 0 %, mais le stocker par milliards coûte — coffres, assurance, transport : c\'est ce coût qui ouvre l\'espace sous zéro',
      'La chronologie : BCE à −0,10 % en juin 2014, jusqu\'à −0,50 % de 2019 à 2022 ; Suisse à −0,75 % ; Danemark, Suède et Japon dans le mouvement',
      'Le mécanisme voulu : les réserves excédentaires coûtent au lieu de rapporter — une taxe à détenir du cash, censée pousser les banques à prêter',
      'Le problème au bilan des banques : elles n\'osent pas répercuter le taux négatif sur les dépôts des ménages (qui partiraient en billets) — le passif reste à 0 % pendant que l\'actif rapporte de moins en moins : la marge d\'intérêt se comprime, et avec elle la capacité à prêter',
      'Le concept qui fait la réponse : le reversal rate — en dessous d\'un certain seuil, baisser le taux devient CONTRACTIONNISTE, l\'arme se retourne ; la BCE a bricolé le tiering en 2019 (une partie des réserves exonérée) pour rendre la taxe supportable sans annuler le signal',
      'Le verdict : oui à petites doses — l\'espace sous zéro existe mais il est mince ; la sortie générale (BCE en 2022, BoJ dernière en mars 2024, avec la première hausse japonaise depuis 2007) referme l\'expérience',
    ],
    pointsAttendusEn: [
      'The foundation: the banknote always yields exactly 0%, but storing billions of them costs — vaults, insurance, transport: that cost is what opens the space below zero',
      'The chronology: ECB at −0.10% in June 2014, down to −0.50% from 2019 to 2022; Switzerland at −0.75%; Denmark, Sweden and Japan in the movement',
      'The intended mechanism: excess reserves cost instead of earning — a tax on holding cash, meant to push banks to lend',
      'The problem on bank balance sheets: they dare not pass the negative rate on to household deposits (which would flee into banknotes) — the liability side stays at 0% while the asset side earns less and less: the interest margin compresses, and lending capacity with it',
      'The concept that makes the answer: the reversal rate — below some threshold, cutting the rate turns CONTRACTIONARY, the weapon backfires; the ECB rigged tiering in 2019 (part of reserves exempted) to make the tax bearable without cancelling the signal',
      'The verdict: yes in small doses — the space below zero exists but it is thin; the general exit (ECB in 2022, BoJ last in March 2024, with the first Japanese hike since 2007) closes the experiment',
    ],
    bonus: [
      'La répercussion module 9 : à −0,5 %, le zéro-coupon 5 ans coûtait presque 98 et le budget d\'options était squelettique — les taux négatifs ont tué le capital garanti et fait triompher les autocalls ; la sortie des taux négatifs l\'a ressuscité',
      'Le point de vue de l\'épargnant : un taux réel négatif est une taxe silencieuse — la répression financière ; les taux négatifs nominaux n\'ont fait que rendre visible ce que l\'inflation faisait déjà discrètement',
    ],
    bonusEn: [
      'The module 9 repercussion: at −0.5%, the 5-year zero-coupon cost almost 98 and the option budget was skeletal — negative rates killed capital guarantee and made autocalls triumph; the exit from negative rates resurrected it',
      'The saver\'s viewpoint: a negative real rate is a silent tax — financial repression; negative nominal rates merely made visible what inflation was already doing quietly',
    ],
    reponseModele: `D'abord, pourquoi c'est seulement *possible* : le plancher zéro tient à l'existence d'un actif qui rapporte toujours exactement 0 % — le billet. Mais stocker physiquement des milliards de billets coûte : coffres, assurance, transport. C'est ce coût qui ouvre un peu d'espace sous zéro. La BCE ose en juin 2014 (taux de dépôt à −0,10 %) et descend jusqu'à **−0,50 %** de 2019 à 2022 ; la Suisse va à −0,75 % ; le Danemark, la Suède et le Japon suivent. Le mécanisme voulu : les réserves excédentaires *coûtent* au lieu de rapporter — une taxe à détenir du cash, censée pousser les banques à prêter.

Le grain de sable est au bilan des banques. Elles n'osent pas répercuter le taux négatif sur les dépôts des ménages — qui partiraient en billets — donc leur passif reste à 0 % pendant que leur actif rapporte de moins en moins : la **marge d'intérêt se comprime**, et avec elle la capacité à prêter. D'où le concept qui fait la bonne réponse : le ***reversal rate*** — en dessous d'un certain seuil, baisser le taux devient **contractionniste**, l'arme se retourne contre son porteur. La BCE l'a compris et a bricolé un amortisseur en 2019, le *tiering* : une partie des réserves exonérée du taux négatif, pour rendre la taxe supportable sans en annuler le signal.

Alors, ont-ils marché ? **À petites doses, oui** : l'espace sous zéro existe, les taux courts et le change ont bien réagi, et aucune fuite massive vers le billet n'a eu lieu à −0,5 %. Mais l'espace est mince — personne n'a tenté −2 % —, le coût s'accumule silencieusement dans les marges bancaires, et l'outil n'a jamais suffi seul : il a fallu l'empiler avec la forward guidance et le QE. Le verdict d'usage : un appoint, pas un moteur.

L'épilogue dit le reste : tout le monde en est sorti — la BCE en 2022, la Banque du Japon la dernière, en mars 2024, avec sa première hausse depuis 2007. Et pour relier au module 9 : à −0,5 %, le zéro-coupon 5 ans coûtait presque 98 et le budget d'options était squelettique — les taux négatifs ont tué le capital garanti des vitrines bancaires ; leur mort l'a ressuscité. Une politique monétaire se lit aussi dans les brochures d'agence.`,
    reponseModeleEn: `First, why it is even *possible*: the zero floor rests on the existence of an asset that always yields exactly 0% — the banknote. But physically storing billions in banknotes costs: vaults, insurance, transport. That cost is what opens some room below zero. The ECB dares in June 2014 (deposit rate at −0.10%) and goes down to **−0.50%** from 2019 to 2022; Switzerland goes to −0.75%; Denmark, Sweden and Japan follow. The intended mechanism: excess reserves *cost* instead of earning — a tax on holding cash, meant to push banks to lend.

The grain of sand sits on bank balance sheets. They dare not pass the negative rate on to household deposits — which would flee into banknotes — so their liability side stays at 0% while their asset side earns less and less: the **interest margin compresses**, and lending capacity with it. Hence the concept that makes a good answer: the **reversal rate** — below some threshold, cutting the rate turns **contractionary**, the weapon backfires. The ECB understood it and rigged a shock absorber in 2019, tiering: part of the reserves exempted from the negative rate, making the tax bearable without cancelling the signal.

So, did they work? **In small doses, yes**: the space below zero exists, short rates and the exchange rate did respond, and no massive flight into banknotes occurred at −0.5%. But the space is thin — nobody tried −2% —, the cost accumulates silently in bank margins, and the tool never sufficed alone: it had to be stacked with forward guidance and QE. The working verdict: a booster, not an engine.

The epilogue says the rest: everyone exited — the ECB in 2022, the Bank of Japan last, in March 2024, with its first hike since 2007. And to link back to module 9: at −0.5%, the 5-year zero-coupon cost almost 98 and the option budget was skeletal — negative rates killed the capital guarantee in bank shop windows; their death resurrected it. A monetary policy can also be read in branch brochures.`,
  },
  {
    id: 'm10-j-16',
    moduleId: M10,
    theme: 'l\'arsenal non conventionnel',
    themeEn: 'the unconventional arsenal',
    difficulte: 3,
    question: 'Forward guidance : comment quelques phrases écrasent-elles les taux longs — et où est le piège ?',
    questionEn: 'Forward guidance: how do a few sentences crush long rates — and where is the trap?',
    plan: [
      'Poser le fondement : les taux longs sont faits d\'anticipations de taux courts — piloter les anticipations, c\'est piloter la courbe, sans acheter un seul titre',
      'Distinguer les deux saveurs : calendaire (« au moins jusqu\'à mi-2013 » — simple mais rigide) et conditionnelle (« tant que le chômage dépasse 6,5 % » — auto-ajustable mais exigeante à lire)',
      'Nommer la monnaie de l\'outil : la crédibilité — une banque centrale qui renie sa guidance ne pourra plus l\'utiliser',
      'Montrer le piège à la sortie : le taper tantrum de mai 2013 — Bernanke évoque l\'idée de ralentir les achats, le 10 ans bondit d\'environ 1,6 % à 3 % en quatre mois',
    ],
    planEn: [
      'State the foundation: long rates are made of expected short rates — steering expectations means steering the curve, without buying a single security',
      'Distinguish the two flavours: calendar-based ("at least until mid-2013" — simple but rigid) and conditional ("as long as unemployment exceeds 6.5%" — self-adjusting but demanding to read)',
      'Name the tool\'s currency: credibility — a central bank that reneges on its guidance can no longer use it',
      'Show the trap at the exit: the May 2013 taper tantrum — Bernanke mentions the idea of slowing purchases, the 10-year jumps from about 1.6% to 3% in four months',
    ],
    pointsAttendus: [
      'Le fondement analytique : un taux long est la moyenne des taux courts anticipés plus une prime de terme — s\'engager sur la trajectoire future écrase les taux longs quand le taux court est déjà à zéro',
      'La version calendaire : « les taux resteront bas au moins jusqu\'à mi-2013 » (Fed, 2011) — simple, lisible, mais rigide : si l\'économie repart, la promesse devient un piège',
      'La version conditionnelle : « tant que le chômage dépasse 6,5 % et que l\'inflation anticipée reste sous 2,5 % » (Fed, 2012) — l\'engagement s\'ajuste seul aux données, au prix d\'une lecture plus exigeante',
      'L\'outil ne coûte que sa crédibilité — et c\'est précisément pour cela qu\'il est fragile : renier une guidance, c\'est perdre l\'outil pour le cycle suivant',
      'Le taper tantrum : 22 mai 2013, Bernanke évoque prudemment la possibilité de RALENTIR les achats — ni hausse, ni vente, ni date ; le 10 ans passe d\'environ 1,6 % à 3 % en quatre mois : le marché n\'a pas réagi à un acte, mais à la mort d\'une anticipation',
      'La leçon opérationnelle : la sortie d\'une guidance est un champ de mines — la sortie suivante (2021-2022) sera télégraphiée des mois à l\'avance ; règle d\'or : ne jamais surprendre involontairement',
    ],
    pointsAttendusEn: [
      'The analytical foundation: a long rate is the average of expected short rates plus a term premium — committing on the future path crushes long rates when the short rate is already at zero',
      'The calendar version: "rates will stay low at least until mid-2013" (Fed, 2011) — simple, readable, but rigid: if the economy picks up, the promise becomes a trap',
      'The conditional version: "as long as unemployment exceeds 6.5% and expected inflation stays below 2.5%" (Fed, 2012) — the commitment self-adjusts to the data, at the price of a more demanding read',
      'The tool costs only its credibility — and that is precisely why it is fragile: reneging on guidance means losing the tool for the next cycle',
      'The taper tantrum: 22 May 2013, Bernanke cautiously mentions the possibility of SLOWING purchases — no hike, no sale, no date; the 10-year goes from about 1.6% to 3% in four months: the market did not react to an act, but to the death of an expectation',
      'The operational lesson: exiting guidance is a minefield — the next exit (2021-2022) would be telegraphed months in advance; golden rule: never surprise unintentionally',
    ],
    bonus: [
      'Le cas limite : le YCC japonais — une guidance extrême portant sur un prix (le 10 ans « autour de 0 % ») ; élégant tant que personne ne teste la cible, monstrueux quand tout le monde doute (2022 : la BoJ détient plus de la moitié des JGB) ; sortie par élargissements successifs jusqu\'à l\'abandon en mars 2024',
      'Le miroir : surprendre sciemment est aussi un outil — Jackson Hole, août 2022 : huit minutes de Powell promettant de la « douleur » plutôt qu\'un pivot, pour re-priser toute la courbe d\'un coup',
    ],
    bonusEn: [
      'The limiting case: Japanese YCC — extreme guidance bearing on a price (the 10-year "around 0%"); elegant as long as nobody tests the target, monstrous when everyone doubts (2022: the BoJ holds more than half of all JGBs); exit through successive band widenings until abandonment in March 2024',
      'The mirror image: surprising deliberately is also a tool — Jackson Hole, August 2022: eight minutes of Powell promising "pain" rather than a pivot, to re-price the whole curve at once',
    ],
    reponseModele: `Le fondement tient en une ligne du module 4 : un taux long, c'est la **moyenne des taux courts anticipés** plus une prime de terme. Donc si la banque centrale parvient à déplacer ce que le marché *croit* qu'elle fera pendant trois ans, elle déplace le taux 3 ans — aujourd'hui, sans acheter un seul titre. C'est la *forward guidance* : quand le taux court est déjà à zéro, il reste un levier — promettre l'avenir.

Deux saveurs. **Calendaire** : « les taux resteront bas au moins jusqu'à mi-2013 » (Fed, 2011) — simple, lisible, mais rigide : si l'économie repart plus vite que prévu, la promesse devient un piège — la tenir coûte, la renier coûte plus. **Conditionnelle** : « tant que le chômage dépasse 6,5 % et que l'inflation anticipée reste sous 2,5 % » (Fed, 2012) — l'engagement s'ajuste tout seul aux données, au prix d'une lecture plus exigeante. Dans les deux cas, l'outil a une seule monnaie : la **crédibilité**. Il ne coûte rien à prononcer — et c'est pour cela qu'il ne vaut que ce que vaut la parole : une banque centrale qui renie sa guidance ne pourra plus l'utiliser au cycle suivant.

Le piège est à la sortie, et il a une date : le **22 mai 2013**. Ben Bernanke, devant le Congrès, évoque prudemment la possibilité de *ralentir* le rythme des achats — ni hausse de taux, ni vente de titres, ni date. Le marché entend : *la sortie commence*. Le 10 ans américain passe d'environ 1,6 % à 3 % en quatre mois — de l'ordre de +130 points de base, environ −10 % sur une duration de 8, **pour une phrase**. C'est le *taper tantrum* : le marché n'a pas réagi à un acte — la politique menée n'avait pas changé — mais à la **mort d'une anticipation**. L'ironie achève la démonstration : quand la réduction effective commence, en décembre 2013, les prix l'absorbent sans broncher — elle était déjà dedans.

La chute : la forward guidance est l'outil le moins cher de l'arsenal et le plus dangereux à ranger. D'où la doctrine — ne jamais surprendre *involontairement* — et la pratique depuis : la sortie de 2021-2022 fut télégraphiée des mois à l'avance. Quand un banquier central veut frapper, il le fait sciemment : Jackson Hole 2022, huit minutes de « douleur » promise, toute la courbe re-pricée — la même arme, assumée cette fois.`,
    reponseModeleEn: `The foundation holds in one line from module 4: a long rate is the **average of expected short rates** plus a term premium. So if the central bank manages to move what the market *believes* it will do for three years, it moves the 3-year rate — today, without buying a single security. That is forward guidance: when the short rate is already at zero, one lever remains — promising the future.

Two flavours. **Calendar-based**: "rates will stay low at least until mid-2013" (Fed, 2011) — simple, readable, but rigid: if the economy picks up faster than expected, the promise becomes a trap — keeping it costs, breaking it costs more. **Conditional**: "as long as unemployment exceeds 6.5% and expected inflation stays below 2.5%" (Fed, 2012) — the commitment self-adjusts to the data, at the price of a more demanding read. In both cases, the tool has a single currency: **credibility**. It costs nothing to utter — and that is precisely why it is worth only what the word is worth: a central bank that reneges on its guidance cannot use it in the next cycle.

The trap is at the exit, and it has a date: **22 May 2013**. Ben Bernanke, before Congress, cautiously mentions the possibility of *slowing* the pace of purchases — no rate hike, no sale, no date. The market hears: *the exit begins*. The US 10-year goes from about 1.6% to 3% in four months — on the order of +130 basis points, about −10% on a duration of 8, **for one sentence**. That is the taper tantrum: the market did not react to an act — actual policy had not changed — but to the **death of an expectation**. The irony completes the demonstration: when the actual reduction starts, in December 2013, prices absorb it without flinching — it was already in.

The closing line: forward guidance is the cheapest tool in the arsenal and the most dangerous to put away. Hence the doctrine — never surprise *unintentionally* — and the practice since: the 2021-2022 exit was telegraphed months in advance. When a central banker wants to strike, he does it deliberately: Jackson Hole 2022, eight minutes of promised "pain", the whole curve re-priced — the same weapon, owned this time.`,
  },
  {
    id: 'm10-j-17',
    moduleId: M10,
    theme: 'l\'arsenal non conventionnel',
    themeEn: 'the unconventional arsenal',
    difficulte: 2,
    question: '« Whatever it takes » : pourquoi trois mots ont-ils suffi, là où des centaines de milliards auraient pu ne pas suffire ?',
    questionEn: '"Whatever it takes": why were three words enough, where hundreds of billions might not have been?',
    plan: [
      'Poser le problème de l\'été 2012 : le 10 ans espagnol au-delà de 7,5 %, l\'italien de 6,5 % — le marché price un risque de redénomination, et la peur s\'auto-alimente',
      'Décrire la boucle auto-réalisatrice : doute → taux plus hauts → insolvabilité plus probable → doute — une prophétie qui se nourrit d\'elle-même',
      'La réponse du 26 juillet 2012 et son véhicule : l\'OMT en septembre — des achats ILLIMITÉS, conditionnés à un programme d\'ajustement',
      'Expliquer pourquoi ça marche : contre une boucle auto-réalisatrice, l\'arme n\'est pas la quantité mais la crédibilité illimitée — personne ne vend contre un acheteur sans limite, donc il n\'y a rien à acheter',
    ],
    planEn: [
      'State the summer 2012 problem: the Spanish 10-year beyond 7.5%, the Italian beyond 6.5% — the market is pricing redenomination risk, and the fear feeds itself',
      'Describe the self-fulfilling loop: doubt → higher rates → more probable insolvency → doubt — a prophecy feeding on itself',
      'The 26 July 2012 answer and its vehicle: the OMT in September — UNLIMITED purchases, conditional on an adjustment programme',
      'Explain why it works: against a self-fulfilling loop, the weapon is not quantity but unlimited credibility — nobody sells against a buyer without limits, so there is nothing to buy',
    ],
    pointsAttendus: [
      'Le contexte : été 2012, la zone euro se désagrège par ses spreads — 10 ans espagnol au-delà de 7,5 %, italien de 6,5 %, des niveaux où une dette cesse d\'être refinançable',
      'Le risque pricé : la redénomination — le retour à la peseta et à la lire ; la boucle auto-réalisatrice : plus les taux montent, plus le défaut devient probable, plus les taux montent',
      'La phrase du 26 juillet 2012 à Londres — « whatever it takes to preserve the euro… and believe me, it will be enough » — et son véhicule reçu en septembre : l\'OMT, achats illimités de dette d\'un État sous programme d\'ajustement',
      'Le résultat : l\'OMT n\'a JAMAIS été activé — pas un euro dépensé — et les spreads espagnol et italien se dégonflent de plusieurs centaines de points de base en quelques mois',
      'Le mécanisme : contre une prophétie auto-réalisatrice, une promesse illimitée et crédible tue la boucle — plus personne ne vend contre un acheteur sans limite, donc l\'acheteur n\'a rien à acheter ; le mot décisif est « illimité » : une enveloppe finie se teste, l\'infini non',
      'La hiérarchie contre-intuitive de l\'arsenal : l\'outil le plus puissant de la période 2008-2022 n\'a rien coûté, quand les ~9 000 milliards de dollars de bilan de la Fed s\'estiment en dizaines de points de base — la monnaie de réserve d\'une banque centrale n\'est pas son bilan, c\'est sa parole',
    ],
    pointsAttendusEn: [
      'The context: summer 2012, the euro area is coming apart through its spreads — Spanish 10-year beyond 7.5%, Italian beyond 6.5%, levels at which a debt stops being refinanceable',
      'The priced risk: redenomination — the return to the peseta and the lira; the self-fulfilling loop: the higher rates go, the more probable default becomes, the higher rates go',
      'The sentence of 26 July 2012 in London — "whatever it takes to preserve the euro… and believe me, it will be enough" — and its vehicle received in September: the OMT, unlimited purchases of the debt of a state under an adjustment programme',
      'The result: the OMT was NEVER activated — not one euro spent — and the Spanish and Italian spreads deflate by several hundred basis points within months',
      'The mechanism: against a self-fulfilling prophecy, an unlimited and credible promise kills the loop — nobody sells against a buyer without limits anymore, so the buyer has nothing to buy; the decisive word is "unlimited": a finite envelope gets tested, infinity does not',
      'The arsenal\'s counter-intuitive hierarchy: the most powerful tool of the 2008-2022 period cost nothing, while the Fed\'s ~9,000 billion dollars of balance sheet is estimated in tens of basis points — a central bank\'s reserve currency is not its balance sheet, it is its word',
    ],
    bonus: [
      'La condition cachée : la phrase n\'a marché que parce qu\'elle était crédible — prononcée par une institution dont le marché ne doutait pas qu\'elle ferait ce qu\'elle disait, et adossée à un mandat (« within our mandate ») et à une conditionnalité qui rendaient l\'illimité juridiquement tenable',
      'La descendance : le PEPP de mars 2020, doté d\'une souplesse inédite sur les clés de répartition, reprend la même logique anti-spread — écraser une boucle avant qu\'elle ne prenne',
    ],
    bonusEn: [
      'The hidden condition: the sentence only worked because it was credible — spoken by an institution the market did not doubt would do as it said, and backed by a mandate ("within our mandate") and a conditionality that made the unlimited legally tenable',
      'The lineage: the PEPP of March 2020, endowed with unprecedented flexibility on allocation keys, revives the same anti-spread logic — crushing a loop before it catches',
    ],
    reponseModele: `Été 2012 : la zone euro se désagrège par ses spreads. Le 10 ans espagnol dépasse 7,5 %, l'italien 6,5 % — des niveaux où une dette cesse d'être refinançable. Ce que le marché price n'est pas une mauvaise année budgétaire : c'est un risque de **redénomination** — le retour à la peseta et à la lire. Et ce risque a une propriété diabolique : il **s'auto-alimente**. Le doute fait monter les taux ; les taux plus hauts rendent l'insolvabilité plus probable ; l'insolvabilité plus probable nourrit le doute. Une prophétie auto-réalisatrice : chacun vend parce qu'il craint que les autres vendent.

Le 26 juillet, à Londres, Mario Draghi improvise : « *Within our mandate, the ECB is ready to do whatever it takes to preserve the euro. And believe me, it will be enough.* » En septembre, la promesse reçoit un véhicule : l'**OMT** — des achats **illimités** de dette d'un État qui accepte un programme d'ajustement.

Pourquoi trois mots suffisent-ils ? Parce que contre une boucle auto-réalisatrice, l'arme n'est pas la quantité : c'est la **crédibilité illimitée**. Vendre de la dette italienne à découvert face à un acheteur à munitions infinies est un suicide financier — donc plus personne ne vend ; donc les taux baissent ; donc l'insolvabilité s'éloigne ; donc il n'y a **rien à acheter**. La boucle qui se nourrissait d'elle-même meurt de la même logique, inversée. Le mot décisif de l'OMT est « illimité » : une enveloppe finie se teste — le marché calcule ce qu'il faut vendre pour la vider — l'infini, non. Résultat : l'OMT n'a *jamais* été activé, pas un euro dépensé, et les spreads espagnol et italien se dégonflent de plusieurs centaines de points de base en quelques mois.

La chute, qui fait les bonnes copies : la hiérarchie d'efficacité de tout l'arsenal non conventionnel est contre-intuitive — l'outil le plus puissant de la période 2008-2022 n'a rien coûté (trois mots), et le plus coûteux en bilan (les quelque 9 000 milliards de dollars de la Fed) a des effets estimés en dizaines de points de base. À une condition, jamais gratuite : que la parole soit **crue**. La phrase de Draghi a valu des milliards précisément parce qu'on n'a pas eu à les dépenser — la monnaie de réserve d'une banque centrale n'est pas son bilan, c'est sa parole.`,
    reponseModeleEn: `Summer 2012: the euro area is coming apart through its spreads. The Spanish 10-year exceeds 7.5%, the Italian 6.5% — levels at which a debt stops being refinanceable. What the market is pricing is not a bad fiscal year: it is **redenomination** risk — the return to the peseta and the lira. And that risk has a devilish property: it **feeds itself**. Doubt pushes rates up; higher rates make insolvency more probable; more probable insolvency feeds the doubt. A self-fulfilling prophecy: everyone sells because they fear the others will.

On 26 July, in London, Mario Draghi improvises: "*Within our mandate, the ECB is ready to do whatever it takes to preserve the euro. And believe me, it will be enough.*" In September, the promise receives a vehicle: the **OMT** — **unlimited** purchases of the debt of a state that accepts an adjustment programme.

Why are three words enough? Because against a self-fulfilling loop, the weapon is not quantity: it is **unlimited credibility**. Short-selling Italian debt against a buyer with infinite ammunition is financial suicide — so nobody sells anymore; so rates fall; so insolvency recedes; so there is **nothing to buy**. The loop that fed on itself dies of the same logic, inverted. The OMT's decisive word is "unlimited": a finite envelope gets tested — the market computes how much selling would drain it — infinity does not. Result: the OMT was *never* activated, not one euro spent, and the Spanish and Italian spreads deflate by several hundred basis points within months.

The closing line, the one that makes good answers: the effectiveness hierarchy of the whole unconventional arsenal is counter-intuitive — the most powerful tool of the 2008-2022 period cost nothing (three words), and the costliest in balance-sheet terms (the Fed's some 9,000 billion dollars) has effects estimated in tens of basis points. On one condition, never free: that the word be **believed**. Draghi's sentence was worth billions precisely because they never had to be spent — a central bank's reserve currency is not its balance sheet, it is its word.`,
  },
  {
    id: 'm10-j-18',
    moduleId: M10,
    theme: 'les indicateurs',
    themeEn: 'the indicators',
    difficulte: 2,
    question: 'Le NFP sort excellent et les taux ne bougent pas ; le CPI sort à peine au-dessus des attentes et tout dévisse. Pourquoi la SURPRISE bouge-t-elle les prix, et jamais le niveau ?',
    questionEn: 'NFP comes out excellent and rates do not move; CPI comes out barely above expectations and everything sells off. Why does the SURPRISE move prices, and never the level?',
    plan: [
      'Poser le rituel : calendrier connu à la minute près, prévisions des économistes dont la médiane forme le consensus — et au moment de la publication, le consensus est DÉJÀ dans les prix',
      'En déduire la règle : la publication ne bouge les prix que par son écart au consensus — un chiffre conforme, même spectaculaire dans l\'absolu, est un non-événement',
      'Standardiser : surprise = (publié − consensus) / σ des surprises historiques — un NFP à 300 000 contre 180 000 attendus avec σ = 60 000 est un choc à +2σ, rare donc violent',
      'Dérouler la cascade : la surprise déplace le sentier de taux anticipé, le sentier déplace la courbe, la courbe déplace le dollar et les actions',
    ],
    planEn: [
      'Set the ritual: a calendar known to the minute, economists\' forecasts whose median forms the consensus — and at publication time, the consensus is ALREADY in the prices',
      'Deduce the rule: the release only moves prices through its gap to consensus — an in-line number, however spectacular in absolute terms, is a non-event',
      'Standardise: surprise = (published − consensus) / σ of historical surprises — an NFP at 300,000 against 180,000 expected with σ = 60,000 is a +2σ shock, rare hence violent',
      'Unroll the cascade: the surprise moves the expected rate path, the path moves the whole curve, the curve moves the dollar and equities',
    ],
    pointsAttendus: [
      'Le mécanisme d\'efficience : si le marché attend 180 000 créations d\'emplois, les taux, le dollar et les actions cotent DÉJÀ un monde à 180 000 — la valeur d\'information d\'un chiffre conforme est nulle',
      'La formule de standardisation : surprise = (publié − consensus) / σ des surprises — (300 000 − 180 000)/60 000 = +2σ : rare (quelques pour cent des publications), donc violent',
      'L\'intérêt de la normalisation : comparer les chocs entre indicateurs d\'unités différentes — un CPI à +2σ et un NFP à +2σ sont la même taille de surprise',
      'La transmission chiffrée : la surprise déplace les probabilités implicites des futures et le taux terminal anticipé ; une hausse de 10 pb inflige environ −0,7 % à une obligation de duration 7',
      'Le corollaire : un chiffre catastrophique parfaitement anticipé peut faire MONTER le marché si les positions vendeuses se rachètent — « sell the rumor, buy the fact »',
      'La deuxième ligne : le marché réagit aussi aux révisions (NFP : les deux mois précédents, parfois plus de 100 000) et aux composantes (core du CPI, salaires) — d\'où le whipsaw des premières secondes',
    ],
    pointsAttendusEn: [
      'The efficiency mechanism: if the market expects 180,000 job creations, rates, the dollar and equities ALREADY quote a 180,000 world — the information value of an in-line number is zero',
      'The standardisation formula: surprise = (published − consensus) / σ of surprises — (300,000 − 180,000)/60,000 = +2σ: rare (a few percent of releases), hence violent',
      'The point of normalising: comparing shocks across indicators with different units — a +2σ CPI and a +2σ NFP are the same size of surprise',
      'The transmission with numbers: the surprise moves the futures-implied probabilities and the expected terminal rate; a 10 bp rise inflicts about −0.7% on a duration-7 bond',
      'The corollary: a catastrophic but perfectly anticipated number can make the market RISE if short positions cover — "sell the rumor, buy the fact"',
      'The second line: the market also reacts to revisions (NFP: the two prior months, sometimes by more than 100,000) and to components (CPI core, wages) — hence the whipsaw of the first seconds',
    ],
    bonus: [
      'La scène côté desk : une publication majeure est une asymétrie d\'information programmée — réduire les positions avant l\'heure H, élargir les fourchettes, laisser passer l\'onde ; le P&L d\'un jour de NFP se juge à 15 h, jamais à la première seconde',
      'Le tableau de bord complet : NFP (1er vendredi, ~150-200k en croisière), CPI (vers le 13, core MoM annualisé), PMI/ISM (50 = frontière), PIB (US annualisé vs Europe trimestre brut), claims du jeudi, IFO/ZEW pour l\'Europe',
    ],
    bonusEn: [
      'The desk-side scene: a major release is a scheduled information asymmetry — cut positions before the hour, widen quotes, let the wave pass; the P&L of an NFP day is judged at 3 pm, never at the first second',
      'The full dashboard: NFP (1st Friday, ~150-200k at cruising speed), CPI (around the 13th, core MoM annualised), PMI/ISM (50 = the frontier), GDP (US annualised vs Europe raw quarter), Thursday claims, IFO/ZEW for Europe',
    ],
    reponseModele: `Chaque indicateur vit sur un **calendrier** connu des mois à l'avance, à la minute près. Avant la publication, les économistes des banques soumettent leurs prévisions, dont la médiane forme le **consensus**. Et c'est là que tout se joue : au moment où le chiffre tombe, **le consensus est déjà dans les prix**. Si le marché attend 180 000 créations d'emplois, les taux, le dollar et les actions cotent *déjà* un monde à 180 000 — c'est l'efficience du module 1 au travail. Un chiffre conforme, même spectaculaire dans l'absolu, n'apporte aucune information : non-événement. Un chiffre banal mais inattendu est une bombe. D'où les deux paradoxes de l'énoncé : le NFP « excellent » était attendu excellent ; le CPI « à peine au-dessus » était, lui, une vraie nouvelle.

Encore faut-il étalonner la nouvelle. 40 000 au-dessus du consensus, c'est colossal pour des claims hebdomadaires, négligeable pour un NFP. La lecture professionnelle **standardise** : surprise = (publié − consensus) / σ des surprises historiques. Un NFP à 300 000 contre 180 000 attendus, avec un σ de 60 000, est une surprise à **+2σ** — rare, quelques pour cent des publications, donc violente. La normalisation permet aussi de *comparer* : un CPI à +2σ et un NFP à +2σ sont la même taille de choc, quelles que soient leurs unités.

Puis la cascade : l'indicateur ne bouge pas les prix directement — il bouge **la banque centrale anticipée**, qui bouge tout le reste. La surprise déplace les probabilités implicites des futures et le taux terminal anticipé ; le sentier de taux déplacé se propage par la duration aux obligations (10 points de base × duration 7 ≈ −0,7 %), par l'actualisation aux actions, par le différentiel de taux au change.

Deux raffinements pour finir. Le corollaire du consensus : un chiffre catastrophique *parfaitement anticipé* peut même faire monter le marché, si les positions vendeuses se rachètent — « sell the rumor, buy the fact ». Et la deuxième ligne : le marché réagit aussi aux **révisions** (le NFP révise les deux mois précédents, parfois de plus de 100 000) et aux composantes (le core du CPI, les salaires) — c'est le whipsaw des premières secondes, quand le prix sur-réagit au chiffre brut puis se retourne sur la deuxième ligne. La chute : ce n'est jamais le niveau qui bouge les prix, c'est l'écart entre le monde publié et le monde déjà payé.`,
    reponseModeleEn: `Every indicator lives on a **calendar** known months in advance, to the minute. Before the release, bank economists submit forecasts whose median forms the **consensus**. And that is where everything plays out: the moment the number drops, **the consensus is already in the prices**. If the market expects 180,000 job creations, rates, the dollar and equities *already* quote a 180,000 world — module 1 efficiency at work. An in-line number, however spectacular in absolute terms, carries no information: non-event. An ordinary but unexpected number is a bomb. Hence the two paradoxes in the question: the "excellent" NFP was expected to be excellent; the CPI "barely above" was, in contrast, genuine news.

The news still needs a yardstick. 40,000 above consensus is colossal for weekly claims, negligible for an NFP. The professional read **standardises**: surprise = (published − consensus) / σ of historical surprises. An NFP at 300,000 against 180,000 expected, with a σ of 60,000, is a **+2σ** surprise — rare, a few percent of releases, hence violent. Normalising also allows *comparison*: a +2σ CPI and a +2σ NFP are the same size of shock, whatever their units.

Then the cascade: the indicator does not move prices directly — it moves **the anticipated central bank**, which moves everything else. The surprise shifts the futures-implied probabilities and the expected terminal rate; the shifted rate path propagates through duration to bonds (10 basis points × duration 7 ≈ −0.7%), through discounting to equities, through rate differentials to currencies.

Two refinements to finish. The consensus corollary: a catastrophic but *perfectly anticipated* number can even push the market up, if short positions cover — "sell the rumor, buy the fact". And the second line: the market also reacts to **revisions** (NFP revises the two prior months, sometimes by more than 100,000) and to components (CPI core, wages) — that is the whipsaw of the first seconds, when the price over-reacts to the raw number then reverses on the second line. The closing line: it is never the level that moves prices, it is the gap between the world published and the world already paid for.`,
  },
  {
    id: 'm10-j-19',
    moduleId: M10,
    theme: 'les indicateurs',
    themeEn: 'the indicators',
    difficulte: 3,
    question: '2022 : les créations d\'emplois dépassent le consensus, et la bourse chute. « Good news is bad news » — expliquez le renversement.',
    questionEn: '2022: job creations beat consensus, and the stock market falls. "Good news is bad news" — explain the reversal.',
    plan: [
      'Poser la vraie question du desk : jamais « est-ce bon pour l\'économie ? » mais « qu\'est-ce que cela change à la fonction de réaction de la banque centrale ? »',
      'Le régime normal : inflation sage, banque centrale neutre — un bon NFP signifie croissance et profits : bonne nouvelle actions',
      'Le régime 2022 : inflation à 8-9 %, la Fed en adversaire — chaque bon chiffre d\'emploi signifie plus de hausses de taux, donc des valorisations plus basses',
      'Généraliser : le signe de la réaction dépend du régime — et la hiérarchie des indicateurs n\'est pas fixe : celui que la banque centrale regarde règne',
    ],
    planEn: [
      'State the desk\'s real question: never "is this good for the economy?" but "what does this change about the central bank\'s reaction function?"',
      'The normal regime: tame inflation, neutral central bank — a good NFP means growth and profits: good news for equities',
      'The 2022 regime: inflation at 8-9%, the Fed as an adversary — every good employment number means more rate hikes, hence lower valuations',
      'Generalise: the sign of the reaction depends on the regime — and the hierarchy of indicators is not fixed: the one the central bank watches reigns',
    ],
    pointsAttendus: [
      'La grille : la traduction d\'une surprise en prix d\'actifs passe par la fonction de réaction de la banque centrale — même donnée, signe opposé selon le régime',
      'Le mécanisme 2022 : marché du travail robuste = salaires et demande qui tiennent = plus de hausses de taux = sentier de taux plus haut = actualisation plus chère — le canal banque centrale écrase le canal bénéfices',
      'Les faits documentés : toute l\'année 2022, NFP au-dessus du consensus → actions ET obligations en baisse ; symétriquement, une montée du chômage accueillie par un rally — « bad news is good news »',
      'La hiérarchie mouvante des indicateurs : en 2022, le CPI détrône le NFP — les jours de CPI, le S&P 500 bougeait en moyenne deux à trois fois plus qu\'un jour ordinaire ; c\'est l\'indicateur que la banque centrale regarde qui règne',
      'La conséquence structurelle : la corrélation actions-obligations change de signe avec le régime d\'inflation — quand l\'inflation domine, le taux frappe les deux jambes à la fois, et le 60/40 perd son assurance (2022 : autour de −17 %, pire année depuis 2008)',
      'La précision d\'expert : ce n\'est jamais le chiffre qui bouge le marché, c\'est l\'écart au consensus — le renversement de régime change le SIGNE de la réaction, la surprise en garde la TAILLE',
    ],
    pointsAttendusEn: [
      'The grid: the translation of a surprise into asset prices goes through the central bank\'s reaction function — same data, opposite sign depending on the regime',
      'The 2022 mechanism: robust labour market = wages and demand holding = more rate hikes = higher rate path = dearer discounting — the central-bank channel crushes the earnings channel',
      'The documented facts: all through 2022, NFP above consensus → equities AND bonds down; symmetrically, rising unemployment greeted with a rally — "bad news is good news"',
      'The shifting hierarchy of indicators: in 2022, CPI dethrones NFP — on CPI days, the S&P 500 moved on average two to three times more than on an ordinary day; the indicator the central bank watches is the one that reigns',
      'The structural consequence: the equity-bond correlation changes sign with the inflation regime — when inflation dominates, rates hit both legs at once, and the 60/40 loses its insurance (2022: around −17%, worst year since 2008)',
      'The expert precision: it is never the number that moves the market, it is the gap to consensus — the regime reversal changes the SIGN of the reaction, the surprise keeps its SIZE',
    ],
    bonus: [
      'Le tableau complet des surprises : inflation plus haute (obligations et actions baissent, dollar monte, or ambigu — l\'inflation aide, les réels tuent) contre croissance plus forte (obligations baissent, actions selon le régime) — les cases « selon le régime » sont le cœur du métier',
      'Savoir dans quel régime on est, c\'est la moitié du métier : le signe se renverse dès que l\'inflation redevient secondaire — et le marché peut changer de régime en une publication',
    ],
    bonusEn: [
      'The full surprise table: higher inflation (bonds and equities fall, dollar rises, gold ambiguous — inflation helps, real rates kill) versus stronger growth (bonds fall, equities regime-dependent) — the "regime-dependent" cells are the heart of the trade',
      'Knowing which regime you are in is half the job: the sign flips as soon as inflation becomes secondary again — and the market can switch regimes in a single release',
    ],
    reponseModele: `La question que le desk se pose devant une publication n'est jamais « est-ce bon pour l'économie ? » mais « **qu'est-ce que cela change à la fonction de réaction de la banque centrale ?** ». C'est cette médiation qui donne son signe à la réaction — et qui peut le renverser.

**En régime normal** — inflation sage, banque centrale neutre — un bon chiffre d'emploi est une bonne nouvelle actions : plus de croissance, plus de profits, et rien du côté des taux. **En 2022**, l'inflation à 8-9 % fait de la Fed un adversaire : chaque bon chiffre d'emploi signifie des salaires et une demande qui tiennent, donc *plus de hausses de taux* — un sentier de taux plus haut, une actualisation plus chère, des valorisations plus basses. Le canal banque centrale écrase le canal bénéfices. Résultat documenté toute l'année : NFP au-dessus du consensus → actions en baisse, obligations en baisse ; et symétriquement, une *montée du chômage* accueillie par un rally — « bad news is good news ». Même donnée, signe opposé : **c'est le régime qui donne le signe**.

Deux corollaires font la profondeur de la réponse. D'abord, la hiérarchie des indicateurs n'est pas fixe : en 2022, le CPI a détrôné le NFP comme star absolue du calendrier — les jours de CPI, le S&P 500 bougeait en moyenne deux à trois fois plus qu'un jour ordinaire. La règle : c'est **l'indicateur que la banque centrale regarde** qui règne. Ensuite, la conséquence structurelle : quand l'inflation domine, le taux frappe les *deux* jambes du portefeuille à la fois — la corrélation actions-obligations repasse en positif, l'obligation cesse d'assurer l'action, et le 60/40 signe sa pire année depuis 2008, autour de −17 %.

La précision qui sépare le candidat du commentateur : le renversement de régime change le *signe* de la réaction, pas sa logique — ce n'est toujours pas le chiffre qui bouge le marché, c'est l'écart au consensus. Un bon NFP *attendu* bon ne fait rien, même en 2022. Savoir dans quel régime on est, c'est la moitié du métier ; l'autre moitié, c'est se rappeler que le marché peut changer de régime en une seule publication.`,
    reponseModeleEn: `The question a desk asks before a release is never "is this good for the economy?" but "**what does this change about the central bank's reaction function?**". That mediation is what gives the reaction its sign — and what can reverse it.

**In the normal regime** — tame inflation, neutral central bank — a good employment number is good news for equities: more growth, more profits, and nothing on the rates side. **In 2022**, inflation at 8-9% turns the Fed into an adversary: every good employment number means wages and demand holding up, hence *more rate hikes* — a higher rate path, dearer discounting, lower valuations. The central-bank channel crushes the earnings channel. Documented all year long: NFP above consensus → equities down, bonds down; and symmetrically, *rising unemployment* greeted with a rally — "bad news is good news". Same data, opposite sign: **the regime gives the sign**.

Two corollaries give the answer its depth. First, the hierarchy of indicators is not fixed: in 2022, the CPI dethroned the NFP as the calendar's absolute star — on CPI days, the S&P 500 moved on average two to three times more than on an ordinary day. The rule: **the indicator the central bank watches** is the one that reigns. Second, the structural consequence: when inflation dominates, rates hit *both* legs of the portfolio at once — the equity-bond correlation turns positive again, the bond stops insuring the equity, and the 60/40 posts its worst year since 2008, around −17%.

The precision that separates the candidate from the commentator: the regime reversal changes the *sign* of the reaction, not its logic — it is still not the number that moves the market, it is the gap to consensus. A good NFP *expected* to be good does nothing, even in 2022. Knowing which regime you are in is half the job; the other half is remembering the market can switch regimes in a single release.`,
  },
  {
    id: 'm10-j-20',
    moduleId: M10,
    theme: 'les indicateurs',
    themeEn: 'the indicators',
    difficulte: 2,
    question: 'Le taux effectif est à 4,00 %, une hausse de 25 points de base est en jeu, et le future du mois suivant la réunion cote 95,85. Que price le marché — et comment reconstruit-on tout le cycle ?',
    questionEn: 'The effective rate is at 4.00%, a 25 basis point hike is at stake, and the future for the month after the meeting quotes 95.85. What is the market pricing — and how do you rebuild the whole cycle?',
    plan: [
      'Poser la convention : prix du future = 100 − taux moyen attendu sur le mois — 95,85 implique un taux moyen de 4,15 %',
      'Lire l\'entre-deux : 4,15 % n\'est ni 4,00 (aucune hausse) ni 4,25 (hausse certaine) — c\'est une moyenne pondérée par les probabilités',
      'Extraire la probabilité : P(hausse) = (4,15 − 4,00)/(4,25 − 4,00) = 0,15/0,25 = 60 %',
      'Chaîner : de futures en futures, on reconstruit le sentier anticipé réunion par réunion jusqu\'au taux terminal — l\'arithmétique des dot plots et de FedWatch',
    ],
    planEn: [
      'State the convention: futures price = 100 − expected average rate over the month — 95.85 implies an average rate of 4.15%',
      'Read the in-between: 4.15% is neither 4.00 (no hike) nor 4.25 (certain hike) — it is a probability-weighted average',
      'Extract the probability: P(hike) = (4.15 − 4.00)/(4.25 − 4.00) = 0.15/0.25 = 60%',
      'Chain: from future to future, you rebuild the expected path meeting by meeting up to the terminal rate — the arithmetic of dot plots and FedWatch',
    ],
    pointsAttendus: [
      'La convention de cotation : prix = 100 − taux moyen attendu sur le mois ; 95,85 donne 100 − 95,85 = 4,15 %',
      'La lecture en espérance : p × 4,25 + (1 − p) × 4,00 = 4,15, d\'où p = 0,15/0,25 = 60 % de chances de hausse — trois soustractions, c\'est exactement ce que fait l\'outil FedWatch du CME',
      'Le chaînage : en enchaînant les futures de mois en mois, on reconstruit le sentier anticipé complet jusqu\'au taux terminal — le sommet du cycle',
      'L\'arithmétique du terminal : depuis 2,50 %, quatre hausses de 50 pb pricées mènent à 4,50 % ; un pas négatif décrit un cycle de baisse — depuis 5,25 %, six baisses de 25 pb ramènent à 3,75 %',
      'L\'usage desk : comparer ce sentier de marché aux dot plots et à sa règle de Taylor maison — l\'écart entre les deux est la position',
      'La conséquence de lecture des réunions : la décision elle-même ne bouge rien si elle est pricée — une hausse de 25 pb quand 50 étaient pricés est une DÉTENTE ; ce qui bouge les marchés, c\'est l\'écart entre le communiqué et l\'attendu',
    ],
    pointsAttendusEn: [
      'The quoting convention: price = 100 − expected average rate over the month; 95.85 gives 100 − 95.85 = 4.15%',
      'The expectation reading: p × 4.25 + (1 − p) × 4.00 = 4.15, hence p = 0.15/0.25 = 60% probability of a hike — three subtractions, exactly what the CME FedWatch tool does',
      'The chaining: linking futures month after month rebuilds the full expected path up to the terminal rate — the cycle\'s peak',
      'The terminal arithmetic: from 2.50%, four priced 50 bp hikes lead to 4.50%; a negative step describes a cutting cycle — from 5.25%, six 25 bp cuts bring it back to 3.75%',
      'The desk usage: compare this market path to the dot plots and to one\'s house Taylor rule — the gap between the two is the position',
      'The meeting-reading consequence: the decision itself moves nothing if it is priced — a 25 bp hike when 50 were priced is an EASING; what moves markets is the gap between the statement and the expected',
    ],
    bonus: [
      'La cascade complète d\'une publication : la surprise du CPI déplace les probabilités implicites, le sentier déplace la courbe, la courbe déplace le dollar et les actions — l\'indicateur ne bouge pas les prix directement, il bouge la banque centrale anticipée',
      'L\'échelle des cycles récents pour situer un chiffre : 2022-2023, BCE +450 pb en quatorze mois, Fed +525 pb en seize — les resserrements les plus violents depuis Volcker, entièrement lisibles réunion par réunion dans cette arithmétique de pas',
    ],
    bonusEn: [
      'The full cascade of a release: the CPI surprise moves the implied probabilities, the path moves the curve, the curve moves the dollar and equities — the indicator does not move prices directly, it moves the anticipated central bank',
      'The scale of recent cycles to situate a number: 2022-2023, ECB +450 bp in fourteen months, Fed +525 bp in sixteen — the most violent tightenings since Volcker, entirely readable meeting by meeting in this step arithmetic',
    ],
    reponseModele: `La convention d'abord : un future sur taux court cote **100 moins le taux moyen attendu** sur le mois. À 95,85, le marché attend donc un taux moyen de 100 − 95,85 = **4,15 %** sur le mois qui suit la réunion.

Or 4,15 % n'est ni 4,00 % (aucune hausse) ni 4,25 % (hausse certaine) : c'est une **moyenne pondérée par les probabilités**. Écrivez l'espérance : p × 4,25 + (1 − p) × 4,00 = 4,15, d'où **P(hausse) = (4,15 − 4,00)/(4,25 − 4,00) = 0,15/0,25 = 60 %**. Le marché price 60 % de chances de hausse. Trois soustractions — c'est exactement ainsi que se fabriquent les probabilités « selon les marchés » citées dans la presse : l'outil FedWatch du CME ne fait rien d'autre.

Pour reconstruire le cycle entier, on **chaîne** : les futures de chaque mois donnent le taux moyen attendu de ce mois, et de réunion en réunion se dessine le sentier anticipé complet, jusqu'au **taux terminal** — le sommet du cycle. L'arithmétique est volontairement triviale, en points de base : depuis 2,50 %, quatre hausses de 50 pb mènent à 4,50 % ; un pas négatif décrit un cycle de baisse — depuis 5,25 %, six baisses de 25 pb ramènent à 3,75 %. Le desk compare ce sentier de marché aux dot plots de la Fed et à sa règle de Taylor maison : l'écart entre les deux, c'est la position. L'échelle des cycles récents pour situer : BCE +450 points de base en quatorze mois, Fed +525 en seize — entièrement lisibles, réunion après réunion, dans cette arithmétique de pas.

La conséquence qui fait la chute : le jour de la réunion, **la décision elle-même ne bouge rien si elle est pricée**. Une hausse de 50 pb attendue est un non-événement ; une hausse de 25 pb quand 50 étaient pricés est une *détente*. Ce qui bouge les marchés, c'est l'écart entre le communiqué et l'attendu — le ton, un adjectif, un dot qui migre. Le marché ne commente pas la banque centrale : il la cote en continu, et la réunion ne fait que confirmer ou démentir le prix.`,
    reponseModeleEn: `The convention first: a short-rate future quotes **100 minus the expected average rate** over the month. At 95.85, the market therefore expects an average rate of 100 − 95.85 = **4.15%** over the month following the meeting.

Now 4.15% is neither 4.00% (no hike) nor 4.25% (certain hike): it is a **probability-weighted average**. Write the expectation: p × 4.25 + (1 − p) × 4.00 = 4.15, hence **P(hike) = (4.15 − 4.00)/(4.25 − 4.00) = 0.15/0.25 = 60%**. The market prices a 60% chance of a hike. Three subtractions — that is exactly how the "market-implied" probabilities quoted in the press are made: the CME's FedWatch tool does nothing else.

To rebuild the whole cycle, you **chain**: each month's future gives that month's expected average rate, and meeting after meeting the full anticipated path takes shape, up to the **terminal rate** — the cycle's peak. The arithmetic is deliberately trivial, in basis points: from 2.50%, four 50 bp hikes lead to 4.50%; a negative step describes a cutting cycle — from 5.25%, six 25 bp cuts bring it back to 3.75%. The desk compares this market path to the Fed's dot plots and to its house Taylor rule: the gap between the two is the position. The scale of recent cycles for context: ECB +450 basis points in fourteen months, Fed +525 in sixteen — entirely readable, meeting by meeting, in this step arithmetic.

The consequence that makes the closing line: on meeting day, **the decision itself moves nothing if it is priced**. An expected 50 bp hike is a non-event; a 25 bp hike when 50 were priced is an *easing*. What moves markets is the gap between the statement and the expected — the tone, one adjective, one migrating dot. The market does not comment on the central bank: it quotes it continuously, and the meeting merely confirms or contradicts the price.`,
  },
  {
    id: 'm10-j-21',
    moduleId: M10,
    theme: 'les classes d\'actifs sous le cycle',
    themeEn: 'asset classes under the cycle',
    difficulte: 3,
    question: '2022 : les obligations mondiales perdent de l\'ordre de 17 %, et l\'or, malgré 9 % d\'inflation, finit à plat. Expliquez les deux avec la même grille.',
    questionEn: '2022: global bonds lose about 17%, and gold, despite 9% inflation, ends flat. Explain both with the same grid.',
    plan: [
      'Poser la grille : chaque classe d\'actifs est un flux futur actualisé, et le taux est au dénominateur — quand il bouge, tout se reprice',
      'Les obligations, le canal exact : ΔP/P ≈ −Dmod × Δy — le 10 ans américain passe d\'environ 1,5 % à près de 4 %, et +300 pb sur une duration de 7 donnent −21 %',
      'Aggraver le cas 2022 : partis de taux quasi nuls, duration maximale et coupon nul pour amortir — d\'où la pire année de l\'histoire moderne de « l\'actif sans risque »',
      'L\'or, le cas limite : zéro flux, rien à actualiser — son thermomètre est le taux RÉEL, passé d\'environ −1 % à +1,5 % en 2022 : l\'inflation proposait, le réel a disposé',
    ],
    planEn: [
      'Set the grid: every asset class is a discounted future cash flow, and the rate sits in the denominator — when it moves, everything reprices',
      'Bonds, the exact channel: ΔP/P ≈ −Dmod × Δy — the US 10-year goes from about 1.5% to nearly 4%, and +300 bp on a duration of 7 gives −21%',
      'Aggravate the 2022 case: starting from near-zero yields, maximum duration and no coupon cushion — hence the worst year in the modern history of the "risk-free asset"',
      'Gold, the limiting case: zero cash flow, nothing to discount — its thermometer is the REAL rate, up from about −1% to +1.5% in 2022: inflation proposed, the real rate disposed',
    ],
    pointsAttendus: [
      'La formule et les chiffres obligataires : ΔP/P ≈ −Dmod × Δy ; +300 pb sur une duration de 7 donnent −21 %, sur une duration de 8, −24 % — le Bloomberg Global Aggregate a perdu de l\'ordre de 17 % en 2022',
      'La double aggravation : les taux partaient de presque zéro — duration maximale (aucun coupon ne raccourcit la sensibilité) et coussin de rendement nul pour amortir',
      'La précision de vocabulaire : « sans risque » qualifie le DÉFAUT, jamais le prix — l\'actif sans risque a signé la pire année de son histoire moderne sans un seul défaut',
      'L\'or : zéro flux, rien à actualiser — son coût d\'opportunité est tout entier le rendement auquel on renonce, et le bon thermomètre est le taux réel : détenir de l\'or quand le nominal est à 1,5 % sous 7 % d\'inflation, c\'est renoncer à un réel de −5,1 % — on ne renonce à rien, l\'or brille',
      'L\'année 2022 résolue : malgré une inflation à 8-9 %, le réel à 10 ans américain passe d\'environ −1 % à +1,5 % — le coût d\'opportunité redevient positif, l\'or finit à plat : l\'inflation proposait, le réel a disposé',
      'La synthèse : le même dénominateur explique les deux — et la corrélation actions-obligations passée en positif fait de 2022 la pire année du 60/40 depuis 2008 (autour de −17 %)',
    ],
    pointsAttendusEn: [
      'The bond formula and numbers: ΔP/P ≈ −Dmod × Δy; +300 bp on a duration of 7 gives −21%, on a duration of 8, −24% — the Bloomberg Global Aggregate lost about 17% in 2022',
      'The double aggravation: yields started from nearly zero — maximum duration (no coupon shortening the sensitivity) and zero yield cushion to absorb the shock',
      'The vocabulary precision: "risk-free" qualifies DEFAULT, never price — the risk-free asset posted the worst year of its modern history without a single default',
      'Gold: zero cash flow, nothing to discount — its opportunity cost is entirely the yield you give up, and the right thermometer is the real rate: holding gold when the nominal is at 1.5% under 7% inflation means giving up a real rate of −5.1% — you give up nothing, gold shines',
      'The year 2022 solved: despite 8-9% inflation, the US 10-year real rate goes from about −1% to +1.5% — the opportunity cost turns positive again, gold ends flat: inflation proposed, the real rate disposed',
      'The synthesis: the same denominator explains both — and the equity-bond correlation turning positive makes 2022 the worst 60/40 year since 2008 (around −17%)',
    ],
    bonus: [
      'La déclinaison actions par Gordon : P0 = D1/(r − g) — passer r de 8 % à 9 % coûte −33 % à une valeur de croissance (g = 6 %) contre −14 % à une value (g = 2 %) : le Nasdaq perd un tiers, la rotation growth/value de 2022 est une histoire de duration',
      'Le cas extrême qui confirme : la crypto — l\'or numérique autoproclamé s\'est comporté en duration maximale de la cote : bitcoin de l\'ordre de −65 %, corrélé au Nasdaq ; et le dollar, lui, a monté (DXY +8 % sur l\'année, pic vers +19 %) — le différentiel de taux, encore',
    ],
    bonusEn: [
      'The equity declension via Gordon: P0 = D1/(r − g) — moving r from 8% to 9% costs −33% to a growth stock (g = 6%) versus −14% to a value stock (g = 2%): the Nasdaq loses a third, the 2022 growth/value rotation is a duration story',
      'The extreme case that confirms: crypto — the self-proclaimed digital gold behaved as the maximum duration on the board: bitcoin around −65%, correlated to the Nasdaq; and the dollar rose (DXY +8% on the year, peak near +19%) — rate differentials, again',
    ],
    reponseModele: `La grille tient en une phrase : **chaque classe d'actifs est un flux futur actualisé, et le taux est au dénominateur** — quand il bouge, tout se reprice. 2022 est l'année où le dénominateur a le plus bougé depuis quarante ans : le 10 ans américain passe d'environ 1,5 % à près de 4 %, +300 points de base sur certaines courbes européennes.

**Les obligations d'abord**, seule classe où la transmission est une formule exacte : ΔP/P ≈ −Dmod × Δy. Sur une duration de 7, +300 points de base donnent **−21 %** ; sur une duration de 8, −24 %. Le Bloomberg Global Aggregate, panier obligataire mondial, a perdu de l'ordre de **17 %**. Deux circonstances aggravantes, spécifiques à 2022 : les taux partaient de presque zéro, donc la duration était *maximale* — aucun coupon ne raccourcissait la sensibilité — et le coussin de rendement était *nul* — rien pour amortir. La précision de vocabulaire qui fait la différence : « sans risque » qualifie le **défaut**, jamais le prix — l'actif sans risque a signé la pire année de son histoire moderne sans un seul défaut.

**L'or ensuite**, le cas limite qui éclaire toute la grille : zéro flux, rien à actualiser. Son coût d'opportunité est *tout entier* le rendement auquel on renonce en le détenant — et le bon thermomètre est le **taux réel**. Détenir de l'or quand le nominal est à 1,5 % sous 7 % d'inflation, c'est renoncer à un réel de −5,1 % : on ne renonce à rien, l'or brille. Mais en 2022, malgré une inflation à 8-9 %, le réel à 10 ans américain est passé d'environ −1 % à +1,5 % : le coût d'opportunité est redevenu positif, et l'or a fini à plat. **L'inflation proposait, le réel a disposé.**

La synthèse : le même dénominateur explique les deux énigmes — et il explique le reste de l'année : les actions par l'actualisation (Gordon : passer r de 8 à 9 % coûte −33 % à une valeur de croissance contre −14 % à une value — la rotation growth/value est une histoire de duration), le bitcoin en duration extrême (−65 %, corrélé au Nasdaq), le dollar en gagnant par différentiel de taux. Et la conséquence de portefeuille : le taux frappant les deux jambes à la fois, la corrélation actions-obligations est repassée en positif — le 60/40 a rendu environ 17 %, sa pire année depuis 2008. Un seul chiffre avait bougé : celui du dénominateur.`,
    reponseModeleEn: `The grid holds in one sentence: **every asset class is a discounted future cash flow, and the rate sits in the denominator** — when it moves, everything reprices. 2022 is the year the denominator moved most in forty years: the US 10-year goes from about 1.5% to nearly 4%, +300 basis points on some European curves.

**Bonds first**, the only class where transmission is an exact formula: ΔP/P ≈ −Dmod × Δy. On a duration of 7, +300 basis points gives **−21%**; on a duration of 8, −24%. The Bloomberg Global Aggregate, the world bond basket, lost about **17%**. Two aggravating circumstances, specific to 2022: yields started from nearly zero, so duration was *maximal* — no coupon shortening the sensitivity — and the yield cushion was *nil* — nothing to absorb the shock. The vocabulary precision that makes the difference: "risk-free" qualifies **default**, never price — the risk-free asset posted the worst year of its modern history without a single default.

**Gold next**, the limiting case that illuminates the whole grid: zero cash flow, nothing to discount. Its opportunity cost is *entirely* the yield you forgo by holding it — and the right thermometer is the **real rate**. Holding gold when the nominal is at 1.5% under 7% inflation means forgoing a real rate of −5.1%: you forgo nothing, gold shines. But in 2022, despite 8-9% inflation, the US 10-year real rate went from about −1% to +1.5%: the opportunity cost turned positive again, and gold ended flat. **Inflation proposed, the real rate disposed.**

The synthesis: the same denominator solves both riddles — and it explains the rest of the year: equities through discounting (Gordon: moving r from 8 to 9% costs −33% to a growth stock versus −14% to a value stock — the growth/value rotation is a duration story), bitcoin as extreme duration (−65%, correlated to the Nasdaq), the dollar as winner by rate differential. And the portfolio consequence: with rates hitting both legs at once, the equity-bond correlation turned positive again — the 60/40 gave back about 17%, its worst year since 2008. Only one number had moved: the one in the denominator.`,
  },
  {
    id: 'm10-j-22',
    moduleId: M10,
    theme: 'le mandat et la promesse des 2 %',
    themeEn: 'the mandate and the 2% promise',
    difficulte: 4,
    question: 'Volcker a-t-il eu raison de provoquer deux récessions ?',
    questionEn: 'Was Volcker right to cause two recessions?',
    plan: [
      'Instruire le coût, sans le minimiser : deux récessions enchaînées, chômage à 10,8 % (record d\'après-guerre), crédits hypothécaires au-delà de 18 %, les tracteurs devant la Fed — un ratio de sacrifice de l\'ordre de 1,5',
      'Instruire le gain : l\'inflation de 13,5 % (1980) à 3,2 % (1983), et surtout la crédibilité reconquise — l\'actif dont les successeurs ont dépensé les intérêts pendant quarante ans',
      'Poser le contrefactuel, cœur de la réponse : l\'alternative n\'était pas « pas de récession » mais « l\'inflation continue » — la complaisance de Burns avait déjà coûté une décennie, et chaque année de retard renchérissait la facture finale',
      'Trancher, puis déplacer le procès : oui — mais le vrai coupable est la décennie qui a rendu Volcker nécessaire ; la leçon est de ne jamais avoir à le refaire',
    ],
    planEn: [
      'Prosecute the cost, without minimising it: two back-to-back recessions, 10.8% unemployment (post-war record), mortgage rates beyond 18%, tractors outside the Fed — a sacrifice ratio around 1.5',
      'Prosecute the gain: inflation from 13.5% (1980) to 3.2% (1983), and above all credibility reconquered — the asset whose interest his successors spent for forty years',
      'State the counterfactual, the heart of the answer: the alternative was not "no recession" but "inflation continuing" — Burns\'s complacency had already cost a decade, and every year of delay raised the final bill',
      'Rule, then move the trial: yes — but the true culprit is the decade that made Volcker necessary; the lesson is to never have to do it again',
    ],
    pointsAttendus: [
      'Le contexte de départ : été 1979, inflation au-delà de 11 %, troisième vague en une décennie, anticipations désancrées — chacun demande des hausses de salaires parce que chacun attend des hausses de prix ; le problème n\'est plus le niveau des taux, c\'est que plus personne ne croit la Fed',
      'Le coût chiffré : fed funds vers 20 % en 1980 et 1981, deux récessions (1980 brève, 1981-82 sévère), chômage à 10,8 %, hypothèques au-delà de 18 % — et le ratio de sacrifice comme unité de compte : de l\'ordre de quinze points de PIB cumulés pour dix points de désinflation, ratio 1,5',
      'Le gain chiffré : inflation d\'environ 13,5 % (1980) à 3,2 % (1983) ; le marché obligataire n\'y croit pas tout de suite — le 10 ans monte vers 16 % en septembre 1981 — puis, la crédibilité établie, quatre décennies de baisse des taux commencent',
      'Le contrefactuel décisif : Burns a montré l\'autre branche — la complaisance de 1972 a installé dix ans d\'inflation ; ne pas agir n\'évitait pas le coût, il le reportait en l\'aggravant : les anticipations se désancraient davantage chaque année, et la désinflation devenait toujours plus chère',
      'La nuance qui fait la copie : Volcker a payé le tarif fort PARCE QUE la parole de la Fed était morte — il ne restait que la force ; le vrai réquisitoire ne vise pas Volcker mais la décennie qui l\'a rendu nécessaire',
      'La preuve par 2021-2023 : la désinflation quasi gratuite — ratio proche de zéro — est le rendement différé de l\'actif payé en 1980-82 : anticipations restées ancrées parce que tout le monde savait que la Fed « ferait ce qu\'il faut »',
    ],
    pointsAttendusEn: [
      'The starting context: summer 1979, inflation beyond 11%, third wave in a decade, unanchored expectations — everyone demands wage rises because everyone expects price rises; the problem is no longer the level of rates, it is that nobody believes the Fed anymore',
      'The cost in numbers: fed funds near 20% in 1980 and 1981, two recessions (1980 brief, 1981-82 severe), 10.8% unemployment, mortgages beyond 18% — and the sacrifice ratio as the unit of account: around fifteen cumulative points of GDP for ten points of disinflation, ratio 1.5',
      'The gain in numbers: inflation from about 13.5% (1980) to 3.2% (1983); the bond market does not believe it at first — the 10-year climbs towards 16% in September 1981 — then, credibility established, four decades of falling rates begin',
      'The decisive counterfactual: Burns showed the other branch — the 1972 complacency installed ten years of inflation; not acting did not avoid the cost, it postponed and compounded it: expectations unanchored further every year, and disinflation kept getting dearer',
      'The nuance that makes the answer: Volcker paid full fare BECAUSE the Fed\'s word was dead — only force remained; the true indictment targets not Volcker but the decade that made him necessary',
      'The proof by 2021-2023: the near-free disinflation — ratio close to zero — is the deferred return on the asset paid for in 1980-82: expectations stayed anchored because everyone knew the Fed "would do what it takes"',
    ],
    bonus: [
      'Le geste institutionnel du 6 octobre 1979 : annoncer le ciblage de la masse monétaire — « les taux iront où ils devront aller » — n\'était pas de la technique mais de la communication : changer de régime, pas de niveau, pour rendre la brutalité crédible et impersonnelle',
      'La règle de Taylor rétrospective valide la brutalité : inflation 13 %, gap −2 % — prescription 19,5 %, Volcker est allé à 20 % : la folie apparente était, à un demi-point près, la prescription',
    ],
    bonusEn: [
      'The institutional gesture of 6 October 1979: announcing money-supply targeting — "rates will go where they must" — was not technique but communication: changing regime, not level, to make the brutality credible and impersonal',
      'The retrospective Taylor rule validates the brutality: inflation 13%, gap −2% — prescription 19.5%, Volcker went to 20%: the apparent madness was, to within half a point, the prescription',
    ],
    reponseModele: `Instruisons le procès honnêtement, à charge d'abord. Le coût est immense et il faut le dire sans euphémisme : les fed funds portés vers **20 %** en 1980 puis 1981, deux récessions enchaînées — brève en 1980, sévère en 1981-82 —, un chômage à **10,8 %**, record d'après-guerre, des crédits hypothécaires au-delà de 18 %, des agriculteurs qui bloquent le siège de la Fed avec leurs tracteurs et des concessionnaires qui envoient par la poste les clés des voitures invendues. En unité de compte du chapitre : de l'ordre de quinze points de PIB cumulés pour dix points de désinflation — un **ratio de sacrifice de 1,5**. Des millions de vies réelles derrière chaque dixième.

À décharge, maintenant. D'abord le résultat : l'inflation tombe d'environ 13,5 % (1980) à 3,2 % (1983). Ensuite, et surtout, l'actif : la **crédibilité**. Le marché obligataire n'y a pas cru tout de suite — le 10 ans est monté vers 16 % en septembre 1981, prime d'une désinflation à laquelle il ne croyait pas — puis, la preuve faite, quatre décennies de baisse des taux ont commencé. Les successeurs de Volcker ont piloté l'inflation à coups de communiqués là où lui avait eu besoin de 20 % de taux : ils dépensaient les intérêts de son capital. Et 2021-2023 en est le dividende ultime : une désinflation de grande ampleur à ratio de sacrifice quasi nul, parce que personne n'a cru à l'inflation permanente — personne n'y a cru *parce que* 1980-82 avait eu lieu.

Mais le cœur de la réponse est le **contrefactuel** : l'alternative de Volcker n'était pas « pas de récession », c'était « l'inflation continue ». Burns avait montré cette branche-là : la complaisance de 1972 a installé dix ans d'inflation, et chaque année de retard aggravait la facture — les anticipations se désancraient davantage, l'indexation gagnait les contrats, et la désinflation devenait toujours plus chère. Ne pas payer en 1980, c'était payer plus cher en 1985. La question « fallait-il provoquer deux récessions ? » est mal posée : les récessions n'étaient pas le prix du zèle de Volcker, mais celui des promesses non tenues de la décennie précédente — il ne restait que la force parce que la parole était morte.

Donc oui — et la règle de Taylor, rétrospectivement, le confirme : à 13 % d'inflation, la prescription était 19,5 %, il est allé à 20. Mais le verdict complet tient en deux phrases : Volcker a eu raison de le faire, et la vraie leçon est qu'il n'aurait jamais dû être nécessaire. La crédibilité se paie comptant une fois — le devoir de tous ceux qui ont suivi est de ne jamais laisser la situation exiger un second Volcker.`,
    reponseModeleEn: `Let us try the case honestly, prosecution first. The cost is immense and must be stated without euphemism: fed funds pushed towards **20%** in 1980 and again in 1981, two back-to-back recessions — brief in 1980, severe in 1981-82 —, unemployment at **10.8%**, the post-war record, mortgage rates beyond 18%, farmers blockading the Fed with their tractors and car dealers mailing in the keys of unsold cars. In the chapter's unit of account: around fifteen cumulative points of GDP for ten points of disinflation — a **sacrifice ratio of 1.5**. Millions of real lives behind every tenth.

Now the defence. First the result: inflation falls from about 13.5% (1980) to 3.2% (1983). Then, above all, the asset: **credibility**. The bond market did not believe it at first — the 10-year climbed towards 16% in September 1981, the premium of a disinflation it did not believe in — then, the proof made, four decades of falling rates began. Volcker's successors steered inflation with press releases where he had needed 20% rates: they were spending the interest on his capital. And 2021-2023 is the ultimate dividend: a large disinflation at a near-zero sacrifice ratio, because nobody believed in permanent inflation — nobody believed it *because* 1980-82 had happened.

But the heart of the answer is the **counterfactual**: Volcker's alternative was not "no recession", it was "inflation continuing". Burns had shown that branch: the 1972 complacency installed ten years of inflation, and every year of delay compounded the bill — expectations unanchored further, indexation spread through contracts, and disinflation kept getting dearer. Not paying in 1980 meant paying more in 1985. The question "should he have caused two recessions?" is badly posed: the recessions were not the price of Volcker's zeal, but of the previous decade's broken promises — only force remained because the word was dead.

So yes — and the Taylor rule, retrospectively, confirms it: at 13% inflation, the prescription was 19.5%, he went to 20. But the full verdict holds in two sentences: Volcker was right to do it, and the true lesson is that he should never have been necessary. Credibility is paid for in cash once — the duty of everyone who followed is to never let the situation demand a second Volcker.`,
  },
  {
    id: 'm10-j-23',
    moduleId: M10,
    theme: 'les classes d\'actifs sous le cycle',
    themeEn: 'asset classes under the cycle',
    difficulte: 4,
    question: 'Racontez-moi un accident de marché où la communication a fait plus de dégâts que la décision elle-même.',
    questionEn: 'Tell me about a market accident where the communication did more damage than the decision itself.',
    plan: [
      'Choisir le cas chimiquement pur : le taper tantrum de 2013 — il n\'y a PAS eu de décision, seulement une phrase de Bernanke évoquant l\'idée de ralentir les achats',
      'Chiffrer le dégât : le 10 ans américain d\'environ 1,6 % à 3 % en quatre mois (+130 pb, ≈ −10 % sur une duration de 8), et l\'onde mondiale — les Fragile Five dévissent',
      'Doubler avec 2022 : le mini-budget Truss — 45 milliards de livres non financées annoncées sans chiffrage — déclenche +130 pb en trois séances sur le 30 ans et la spirale LDI ; la BoE pompier en plein QT',
      'Extraire la grammaire commune : les marchés pricent des anticipations — l\'acte télégraphié est indolore (le taper effectif de décembre 2013 n\'a rien bougé), l\'anticipation brutalement recalée est le choc',
    ],
    planEn: [
      'Pick the chemically pure case: the 2013 taper tantrum — there was NO decision, only a Bernanke sentence mentioning the idea of slowing purchases',
      'Quantify the damage: the US 10-year from about 1.6% to 3% in four months (+130 bp, ≈ −10% on a duration of 8), and the global wave — the Fragile Five sell off',
      'Double with 2022: the Truss mini-budget — 45 billion pounds unfunded, announced without independent costing — triggers +130 bp in three sessions on the 30-year and the LDI spiral; the BoE as firefighter in the middle of its own QT',
      'Extract the common grammar: markets price expectations — the telegraphed act is painless (the actual December 2013 taper moved nothing), the brutally recalibrated expectation is the shock',
    ],
    pointsAttendus: [
      'Taper tantrum, les faits : 22 mai 2013, Bernanke évoque prudemment la possibilité de réduire le RYTHME des achats — ni hausse de taux, ni vente de titres, ni date ; le marché entend « la sortie commence »',
      'Le chiffrage : 10 ans américain d\'environ 1,6 % début mai à environ 3 % début septembre — de l\'ordre de +130 pb en quatre mois, soit environ −10 % sur une duration de 8, pour une phrase',
      'L\'onde mondiale : les capitaux partis chercher du rendement dans les émergents refluent vers le dollar — les Fragile Five (Brésil, Inde, Indonésie, Turquie, Afrique du Sud) voient devises et obligations dévisser',
      'L\'ironie qui prouve tout : quand la réduction effective commence en décembre 2013, le marché l\'absorbe sans broncher — elle était dans les prix ; le tantrum n\'a pas été causé par la politique menée mais par une anticipation brutalement recalée',
      'Le second cas, gilts 2022 : 45 milliards de livres de baisses d\'impôts non financées, sans chiffrage indépendant, inflation au-dessus de 10 % — le 30 ans passe d\'environ 3,6 % à plus de 5 % en trois séances (+130 pb, −26 % sur une duration de 20), les appels de marge LDI déclenchent la spirale de ventes forcées, la BoE doit acheter des gilts en plein QT (treize jours ouvrés, bornés pour ne pas ressembler à du financement du budget), Truss démissionne après 44 jours',
      'La grammaire commune : le déclencheur est toujours une anticipation recalée — une phrase (2013), un budget (2022) ; quand la banque centrale pilote les anticipations, chaque mot est un instrument, et un mot mal calibré est un choc de 130 pb — d\'où la doctrine : ne jamais surprendre involontairement, et la sortie de 2021-2022 télégraphiée des mois à l\'avance',
    ],
    pointsAttendusEn: [
      'Taper tantrum, the facts: 22 May 2013, Bernanke cautiously mentions the possibility of reducing the PACE of purchases — no rate hike, no sale, no date; the market hears "the exit begins"',
      'The numbers: US 10-year from about 1.6% in early May to about 3% in early September — around +130 bp in four months, i.e. roughly −10% on a duration of 8, for one sentence',
      'The global wave: capital that had gone hunting for yield in emerging markets flows back to a dollar that pays again — the Fragile Five (Brazil, India, Indonesia, Turkey, South Africa) see currencies and bonds sell off',
      'The irony that proves everything: when the actual reduction starts in December 2013, the market absorbs it without flinching — it was in the prices; the tantrum was not caused by the policy conducted but by an expectation brutally recalibrated',
      'The second case, gilts 2022: 45 billion pounds of unfunded tax cuts, no independent costing, inflation above 10% — the 30-year goes from about 3.6% to over 5% in three sessions (+130 bp, −26% on a duration of 20), LDI margin calls trigger the forced-selling spiral, the BoE must buy gilts in the middle of its own QT (thirteen business days, bounded so as not to look like budget financing), Truss resigns after 44 days',
      'The common grammar: the trigger is always a recalibrated expectation — a sentence (2013), a budget (2022); when the central bank steers expectations, every word is an instrument, and a miscalibrated word is a 130 bp shock — hence the doctrine: never surprise unintentionally, and the 2021-2022 exit telegraphed months in advance',
    ],
    bonus: [
      'Le symétrique positif qui complète la démonstration : « whatever it takes » — la même arme, la communication, a créé des milliards de valeur en 2012 en tuant une boucle auto-réalisatrice sans dépenser un euro ; la parole est un levier à double sens',
      'La leçon de plomberie des gilts : les fonds LDI étaient SOLVABLES — la hausse des taux les arrangeait économiquement — et ont failli mourir de liquidité : la couverture à levier, par ses appels de marge, était devenue la source du risque ; le risque de taux se mesure par la duration, il se matérialise par la liquidité',
    ],
    bonusEn: [
      'The positive mirror image that completes the demonstration: "whatever it takes" — the same weapon, communication, created billions of value in 2012 by killing a self-fulfilling loop without spending a euro; the word is a two-way lever',
      'The gilts plumbing lesson: the LDI funds were SOLVENT — higher rates suited them economically — and nearly died of liquidity: the leveraged hedge, through its margin calls, had become the source of the risk; rate risk is measured by duration, it materialises through liquidity',
    ],
    reponseModele: `Le cas chimiquement pur s'appelle le **taper tantrum**, et sa pureté tient en un fait : il n'y a pas eu de décision du tout. Mai 2013 : la Fed achète 85 milliards de dollars de titres par mois, l'économie va mieux. Le 22 mai, devant le Congrès, Ben Bernanke évoque prudemment la possibilité de **réduire le rythme** des achats dans les réunions à venir. Ni hausse de taux, ni vente de titres, ni date — juste acheter *un peu moins vite*, un jour. Le marché entend : *la sortie commence*. Le 10 ans américain passe d'environ 1,6 % début mai à environ 3 % début septembre — de l'ordre de **+130 points de base en quatre mois**, environ −10 % sur une duration de 8, pour une phrase. Et l'onde traverse la planète : les capitaux partis chercher du rendement dans les émergents refluent vers un dollar qui paie de nouveau — les « Fragile Five » (Brésil, Inde, Indonésie, Turquie, Afrique du Sud) voient devises et obligations dévisser. L'ironie achève la preuve : quand la réduction *effective* commence, en décembre 2013, le marché l'absorbe sans broncher — elle était dans les prix. Le dégât n'est pas venu de la politique menée, mais de la **mort d'une anticipation**.

Le second cas ajoute la plomberie : **les gilts, septembre 2022**. Le mini-budget Truss — environ 45 milliards de livres de baisses d'impôts non financées, annoncées *sans chiffrage indépendant*, dans un pays où l'inflation dépasse 10 % — est autant un accident de communication qu'une décision : c'est la désinvolture de l'annonce qui dit au marché que plus personne ne tient les comptes. Verdict : le 30 ans passe d'environ 3,6 % à plus de 5 % en **trois séances** — sur une duration de 20, −26 %. Puis le mouvement devient spirale : les couvertures LDI des fonds de pension, à levier, appellent de la marge ; pour trouver le collatéral, les fonds vendent des gilts ; les ventes font monter les taux, qui appellent de nouvelles marges. La Banque d'Angleterre — qui s'apprêtait à *vendre* des gilts au titre du QT — doit en acheter en urgence, en bornant son intervention à treize jours ouvrés pour ne pas ressembler à un financement du budget. Truss démissionne après 44 jours.

La grammaire commune : les marchés ne pricent pas des actes, ils pricent des **anticipations** — l'acte télégraphié est indolore, l'anticipation brutalement recalée est le choc. Une phrase (2013), un budget (2022) : dans les deux cas, le déclencheur est un recalage, pas une politique. D'où la doctrine moderne — ne jamais surprendre *involontairement* — et la pratique : la sortie suivante, en 2021-2022, fut télégraphiée des mois à l'avance et n'a pas fait de tantrum.

Et pour boucler devant le jury : la même arme tire dans les deux sens. En juillet 2012, trois mots — « whatever it takes » — ont créé des milliards de valeur sans dépenser un euro. La communication d'une banque centrale n'accompagne pas la politique monétaire : elle **est** la politique monétaire, en bien comme en mal — 130 points de base dans un sens, plusieurs centaines dans l'autre.`,
    reponseModeleEn: `The chemically pure case is called the **taper tantrum**, and its purity rests on one fact: there was no decision at all. May 2013: the Fed is buying 85 billion dollars of securities a month, the economy is improving. On 22 May, before Congress, Ben Bernanke cautiously mentions the possibility of **reducing the pace** of purchases at coming meetings. No rate hike, no sale, no date — just buying *a little less fast*, someday. The market hears: *the exit begins*. The US 10-year goes from about 1.6% in early May to about 3% in early September — around **+130 basis points in four months**, roughly −10% on a duration of 8, for one sentence. And the wave crosses the planet: capital that had gone hunting for yield in emerging markets flows back to a dollar that pays again — the "Fragile Five" (Brazil, India, Indonesia, Turkey, South Africa) see currencies and bonds sell off. The irony completes the proof: when the *actual* reduction begins, in December 2013, the market absorbs it without flinching — it was in the prices. The damage came not from the policy conducted, but from the **death of an expectation**.

The second case adds the plumbing: **gilts, September 2022**. The Truss mini-budget — about 45 billion pounds of unfunded tax cuts, announced *without independent costing*, in a country with inflation above 10% — is as much a communication accident as a decision: it is the offhandedness of the announcement that tells the market nobody is keeping the books anymore. Verdict: the 30-year goes from about 3.6% to over 5% in **three sessions** — on a duration of 20, −26%. Then the move becomes a spiral: pension funds' leveraged LDI hedges call for margin; to find collateral, the funds sell gilts; the sales push rates up, which call new margin. The Bank of England — which was about to *sell* gilts under QT — must buy them urgently, bounding its intervention to thirteen business days so as not to look like budget financing. Truss resigns after 44 days.

The common grammar: markets do not price acts, they price **expectations** — the telegraphed act is painless, the brutally recalibrated expectation is the shock. A sentence (2013), a budget (2022): in both cases, the trigger is a recalibration, not a policy. Hence the modern doctrine — never surprise *unintentionally* — and the practice: the next exit, in 2021-2022, was telegraphed months in advance and produced no tantrum.

And to close before the jury: the same weapon fires both ways. In July 2012, three words — "whatever it takes" — created billions of value without spending a euro. A central bank's communication does not accompany monetary policy: it **is** monetary policy, for better and for worse — 130 basis points one way, several hundred the other.`,
  },
  {
    id: 'm10-j-24',
    moduleId: M10,
    theme: 'les classes d\'actifs sous le cycle',
    themeEn: 'asset classes under the cycle',
    difficulte: 4,
    question: 'SVB, mars 2023 : qui a tué la banque — la Fed, le smartphone ou le risk manager ?',
    questionEn: 'SVB, March 2023: who killed the bank — the Fed, the smartphone or the risk manager?',
    plan: [
      'Instruire la Fed : +400 pb et plus en 2022 — sur une duration proche de 6, la mécanique ΔP/P ≈ −D×Δy crée environ 15 milliards de dollars de moins-values latentes, à peu près les fonds propres',
      'Instruire le smartphone : 42 milliards de dollars de retraits demandés en UNE journée — un quart des dépôts, sans file d\'attente ; la panique du XIXᵉ siècle à la vitesse de la fibre, aggravée par 90 % de dépôts au-dessus du plafond de garantie',
      'Instruire le risk manager : des dépôts triplés investis au sommet du marché obligataire en titres longs à ~1,5 %, classés held-to-maturity, avec un passif exigible à vue — un duration mismatch sans couverture digne de ce nom',
      'Trancher : le risk manager a chargé l\'arme, la Fed a fourni le choc, le smartphone la vitesse — le risque de taux se mesure par la duration, il se matérialise par la liquidité',
    ],
    planEn: [
      'Prosecute the Fed: +400 bp and more in 2022 — on a duration close to 6, the ΔP/P ≈ −D×Δy mechanics creates about 15 billion dollars of unrealised losses, roughly the equity',
      'Prosecute the smartphone: 42 billion dollars of withdrawals requested in ONE day — a quarter of deposits, without a queue; the 19th-century bank run at fibre speed, aggravated by 90% of deposits above the insurance cap',
      'Prosecute the risk manager: tripled deposits invested at the top of the bond market in long securities at ~1.5%, classified held-to-maturity, against sight liabilities — a duration mismatch with no hedge worthy of the name',
      'Rule: the risk manager loaded the gun, the Fed supplied the shock, the smartphone the speed — rate risk is measured by duration, it materialises through liquidity',
    ],
    pointsAttendus: [
      'Le bilan qui condamne : entre 2020 et 2021, les dépôts font plus que tripler vers 190 milliards de dollars ; les startups déposent au lieu d\'emprunter, et SVB investit massivement en obligations d\'État et MBS LONGS, achetés au sommet à des rendements de l\'ordre de 1,5 %, dont environ 90 milliards classés held-to-maturity — au coût d\'achat, invisibles pour la comptabilité',
      'La mécanique Fed : le resserrement de 2022 (plus de 400 pb) inflige à une duration proche de 6 des moins-values latentes de l\'ordre de 15 milliards de dollars fin 2022 — à peu près les fonds propres : la banque est économiquement insolvable AVANT tout retrait ; il suffit que quelqu\'un le dise tout haut',
      'Le détonateur : le 8 mars 2023, SVB vend pour 21 milliards de titres en actant 1,8 milliard de perte et annonce une augmentation de capital — le communiqué qui dit tout haut ce que la comptabilité HTM taisait',
      'La course : le signal traverse les group chats du capital-risque en quelques heures ; le 9 mars, 42 milliards de dollars de retraits demandés en une journée — un quart des dépôts, depuis un smartphone ; le 10 au matin, le régulateur ferme ; 48 heures',
      'L\'accélérateur structurel : plus de 90 % des dépôts au-dessus du plafond de garantie — chacun avait rationnellement intérêt à courir premier ; le smartphone n\'a pas créé la course, il l\'a rendue instantanée',
      'Le verdict : duration mismatch — un passif exigible à vue (duration zéro) finançant un actif de duration 6, sans couverture de taux digne de ce nom ; la Fed n\'a fait qu\'appliquer son mandat, le smartphone n\'a fait qu\'accélérer une course rationnelle — l\'arme était chargée au bilan depuis 2021',
    ],
    pointsAttendusEn: [
      'The balance sheet that convicts: between 2020 and 2021, deposits more than triple towards 190 billion dollars; startups deposit instead of borrowing, and SVB invests massively in LONG government bonds and MBS, bought at the top at yields around 1.5%, of which about 90 billion classified held-to-maturity — at purchase cost, invisible to the accounting',
      'The Fed mechanics: the 2022 tightening (more than 400 bp) inflicts on a duration close to 6 unrealised losses of about 15 billion dollars by end-2022 — roughly the equity: the bank is economically insolvent BEFORE any withdrawal; someone just has to say it out loud',
      'The detonator: on 8 March 2023, SVB sells 21 billion of securities booking a 1.8 billion loss and announces a capital raise — the statement that says out loud what HTM accounting kept quiet',
      'The run: the signal crosses venture-capital group chats within hours; on 9 March, 42 billion dollars of withdrawals requested in one day — a quarter of deposits, from a smartphone; on the morning of the 10th, the regulator closes the bank; 48 hours',
      'The structural accelerant: more than 90% of deposits above the insurance cap — everyone had a rational interest in running first; the smartphone did not create the run, it made it instantaneous',
      'The verdict: duration mismatch — sight liabilities (duration zero) funding a duration-6 asset, with no rate hedge worthy of the name; the Fed merely applied its mandate, the smartphone merely accelerated a rational run — the gun had been loaded on the balance sheet since 2021',
    ],
    bonus: [
      'La leçon comptable : held-to-maturity maintient les titres au coût d\'achat — la comptabilité ne voyait rien, l\'économie voyait tout ; une moins-value latente est une perte réelle dès l\'instant où l\'on peut être forcé de vendre',
      'La suite et les ponts : Signature tombe le surlendemain, Credit Suisse est absorbée la semaine suivante (paniques et contagions : module 11) ; la gestion actif-passif qui aurait tout évité — couvrir la duration, étaler les maturités — est le programme du module 12 ; et la doctrine Bagehot du chapitre 1 éclaire le rôle du prêteur en dernier ressort',
    ],
    bonusEn: [
      'The accounting lesson: held-to-maturity keeps securities at purchase cost — the accounting saw nothing, the economics saw everything; an unrealised loss is a real loss the moment you can be forced to sell',
      'The aftermath and the bridges: Signature falls two days later, Credit Suisse is absorbed the following week (panics and contagion: module 11); the asset-liability management that would have prevented everything — hedging the duration, laddering maturities — is module 12\'s programme; and chapter 1\'s Bagehot doctrine frames the lender-of-last-resort role',
    ],
    reponseModele: `Instruisons les trois suspects — chacun a réellement participé.

**La Fed** a fourni le choc. Son resserrement de 2022 — plus de 400 points de base — applique la formule la plus mécanique du cours : ΔP/P ≈ −D×Δy. Sur le portefeuille de SVB, duration proche de 6, les moins-values latentes atteignent de l'ordre de **15 milliards de dollars fin 2022 — à peu près les fonds propres de la banque**. SVB est économiquement insolvable avant le moindre tweet. Mais la Fed ne faisait qu'appliquer son mandat contre une inflation à 8-9 % — et la règle de Taylor réclamait davantage. Un choc de taux n'est pas un crime : c'est la météo du métier bancaire.

**Le smartphone** a fourni la vitesse. Le 8 mars 2023, contrainte de lever du cash, SVB vend pour 21 milliards de titres en actant 1,8 milliard de perte et annonce une augmentation de capital — le communiqué qui dit tout haut ce que la comptabilité taisait. Le signal traverse en quelques heures les group chats du capital-risque ; le 9 mars, **42 milliards de dollars de retraits demandés en une journée** — un quart des dépôts, sans une file d'attente ; le 10 au matin, le régulateur ferme. 48 heures : la panique bancaire du XIXᵉ siècle à la vitesse de la fibre. Circonstance aggravante structurelle : plus de 90 % des dépôts dépassaient le plafond de garantie — chacun avait *rationnellement* intérêt à courir premier. Mais le smartphone n'a pas créé la course : il l'a rendue instantanée. On ne condamne pas le sprint pour la ligne d'arrivée.

**Le risk manager**, lui, a chargé l'arme. Entre 2020 et 2021, les dépôts font plus que tripler, vers 190 milliards de dollars ; les startups déposent au lieu d'emprunter, et SVB investit massivement en obligations d'État et MBS **longs**, achetés au sommet du marché à des rendements de l'ordre de 1,5 % — dont environ 90 milliards classés *held-to-maturity*, au coût d'achat, invisibles pour la comptabilité. Résultat : un passif exigible à vue — duration zéro — finançant un actif de duration 6, **sans couverture de taux digne de ce nom**. Le diagnostic tient en deux mots du module 4 : *duration mismatch*. Ni exotique, ni imprévisible : le risque le plus classique du métier, non couvert au moment précis où il était le plus gros.

Verdict : **le risk manager a chargé l'arme, la Fed a fourni le choc, le smartphone la vitesse** — et seule la première faute était évitable. La leçon transversale du chapitre : la duration ne vit pas que dans les obligations — elle se loge dans les bilans bancaires — et le risque de taux se *mesure* par la duration mais se *matérialise* par la liquidité. La comptabilité HTM ne voyait rien ; l'économie, si — et l'économie ne lit pas la comptabilité. La suite — Signature le surlendemain, Credit Suisse la semaine suivante — appartient au module 11 ; la gestion actif-passif qui aurait tout évité, au module 12.`,
    reponseModeleEn: `Let us prosecute all three suspects — each genuinely took part.

**The Fed** supplied the shock. Its 2022 tightening — more than 400 basis points — applies the most mechanical formula in the course: ΔP/P ≈ −D×Δy. On SVB's portfolio, duration close to 6, unrealised losses reach about **15 billion dollars by end-2022 — roughly the bank's equity**. SVB is economically insolvent before a single tweet. But the Fed was merely applying its mandate against 8-9% inflation — and the Taylor rule demanded more. A rate shock is not a crime: it is the weather of the banking trade.

**The smartphone** supplied the speed. On 8 March 2023, forced to raise cash, SVB sells 21 billion of securities booking a 1.8 billion loss and announces a capital raise — the statement that says out loud what the accounting kept quiet. The signal crosses venture-capital group chats within hours; on 9 March, **42 billion dollars of withdrawals requested in one day** — a quarter of deposits, without a single queue; on the morning of the 10th, the regulator closes the bank. 48 hours: the 19th-century bank run at fibre speed. A structural aggravating circumstance: more than 90% of deposits exceeded the insurance cap — everyone had a *rational* interest in running first. But the smartphone did not create the run: it made it instantaneous. You do not convict the sprint for the finish line.

**The risk manager**, though, loaded the gun. Between 2020 and 2021, deposits more than triple, towards 190 billion dollars; the startups deposit instead of borrowing, and SVB invests massively in **long** government bonds and MBS, bought at the top of the market at yields around 1.5% — of which about 90 billion classified *held-to-maturity*, at purchase cost, invisible to the accounting. The result: sight liabilities — duration zero — funding a duration-6 asset, **with no rate hedge worthy of the name**. The diagnosis holds in two words from module 4: *duration mismatch*. Neither exotic nor unforeseeable: the most classical risk of the trade, unhedged at the precise moment it was biggest.

Verdict: **the risk manager loaded the gun, the Fed supplied the shock, the smartphone the speed** — and only the first fault was avoidable. The chapter's transversal lesson: duration does not live only in bonds — it lodges in bank balance sheets — and rate risk is *measured* by duration but *materialises* through liquidity. HTM accounting saw nothing; the economics saw everything — and the economics does not read the accounting. The aftermath — Signature two days later, Credit Suisse the following week — belongs to module 11; the asset-liability management that would have prevented it all, to module 12.`,
  },
  {
    id: 'm10-j-25',
    moduleId: M10,
    theme: 'le mandat et la promesse des 2 %',
    themeEn: 'the mandate and the 2% promise',
    difficulte: 4,
    question: 'La banque centrale peut-elle tout ?',
    questionEn: 'Can the central bank do everything?',
    plan: [
      'Poser ce qu\'elle peut : un seul prix fixé — l\'argent au jour le jour — mais propagé à tout : la demande nominale à moyen terme, avec 12-18 mois de délai, et le prêteur en dernier ressort illimité dans sa devise',
      'Première limite : l\'offre — monter les taux ne fait pas pousser le blé ni ne rouvre un gazoduc ; resserrer contre un choc d\'offre, c\'est ajouter une récession à un appauvrissement',
      'Deuxième limite : les bornes et l\'asymétrie — le plancher zéro, le reversal rate, et pushing on a string : on peut rendre l\'argent gratuit, on ne force personne à emprunter (la décennie 2010 en preuve)',
      'Troisième limite, et la condition de tout : la dominance budgétaire (1942-51, la Turquie) et la crédibilité — elle ne peut que ce que sa parole permet ; toute-puissante dans un seul domaine : défendre la valeur de sa promesse',
    ],
    planEn: [
      'State what it can do: a single price set — overnight money — but propagated to everything: nominal demand over the medium term, with a 12-18 month lag, and the unlimited lender of last resort in its own currency',
      'First limit: supply — raising rates does not grow wheat or reopen a pipeline; tightening against a supply shock adds a recession to an impoverishment',
      'Second limit: the bounds and the asymmetry — the zero floor, the reversal rate, and pushing on a string: you can make money free, you cannot force anyone to borrow (the 2010s as proof)',
      'Third limit, and the condition of everything: fiscal dominance (1942-51, Turkey) and credibility — it can only do what its word allows; all-powerful in a single domain: defending the value of its promise',
    ],
    pointsAttendus: [
      'Ce qu\'elle peut vraiment : dans sa propre devise, elle n\'est jamais à court — prêteur en dernier ressort illimité (Bagehot : prêter largement, à taux de pénalité, contre bon collatéral) ; et par la transmission, elle pilote la demande nominale à moyen terme',
      'La limite offre/demande : les taux répriment la demande, ils ne créent pas d\'offre — resserrer contre un choc pétrolier ou un gazoduc fermé comprime la demande pour compenser un choc d\'offre : un remède qui a le goût de la maladie ; c\'est la raison d\'être du core',
      'La limite basse et l\'asymétrie : le plancher zéro (le billet rapporte toujours 0), le reversal rate des taux négatifs, et pushing on a string — la décennie 2010 : taux nuls puis négatifs puis QE, sans ramener l\'inflation à 2 % ; profonde côté freinage, étroite côté relance',
      'La limite budgétaire : la dominance — quand toute hausse de taux menace la solvabilité de l\'État, la banque centrale perd sa liberté sans qu\'aucune loi ne change (Fed 1942-1951 ; Turquie 2021-2023, inflation au-delà de 85 %) ; et le QE, en logeant un tiers de la dette publique au bilan, rapproche cette frontière',
      'Le délai comme limite opérationnelle : 12-18 mois entre la décision et l\'effet — elle ne peut pas piloter l\'inflation du trimestre, seulement celle de l\'an prochain',
      'La synthèse : son outil le plus puissant est gratuit — la parole (whatever it takes : trois mots, zéro euro) — mais il ne vaut que si elle est crue : la banque centrale ne peut pas tout, elle peut exactement ce que sa crédibilité permet',
    ],
    pointsAttendusEn: [
      'What it truly can do: in its own currency, it never runs short — unlimited lender of last resort (Bagehot: lend freely, at a penalty rate, against good collateral); and through transmission, it steers nominal demand over the medium term',
      'The supply/demand limit: rates repress demand, they do not create supply — tightening against an oil shock or a closed pipeline squeezes demand to offset a supply shock: a remedy that tastes like the disease; that is core inflation\'s raison d\'être',
      'The lower bound and the asymmetry: the zero floor (the banknote always yields 0), the reversal rate of negative rates, and pushing on a string — the 2010s: zero then negative rates then QE, without bringing inflation back to 2%; deep on the braking side, narrow on the stimulus side',
      'The fiscal limit: dominance — when any rate hike threatens the state\'s solvency, the central bank loses its freedom without any law changing (Fed 1942-1951; Turkey 2021-2023, inflation beyond 85%); and QE, by lodging a third of the public debt on the balance sheet, brings that border closer',
      'The lag as an operational limit: 12-18 months between decision and effect — it cannot steer this quarter\'s inflation, only next year\'s',
      'The synthesis: its most powerful tool is free — the word (whatever it takes: three words, zero euros) — but it is only worth something if believed: the central bank cannot do everything, it can do exactly what its credibility allows',
    ],
    bonus: [
      'La démonstration par 2021-2023 : face à un choc mixte, la banque centrale n\'a pas fait baisser le prix du gaz — elle a empêché le désancrage ; la désinflation immaculée est le rendement d\'une crédibilité accumulée, pas la preuve d\'une toute-puissance',
      'La tension interne que le jury adore : stabilité des prix et stabilité financière peuvent se contredire un mardi matin — la BoE achetant des gilts en plein QT (septembre 2022) ; la banque centrale peut devoir jouer les pompiers au milieu de son propre resserrement',
    ],
    bonusEn: [
      'The demonstration by 2021-2023: facing a mixed shock, the central bank did not bring gas prices down — it prevented unanchoring; the immaculate disinflation is the return on accumulated credibility, not proof of omnipotence',
      'The internal tension juries love: price stability and financial stability can contradict each other on a Tuesday morning — the BoE buying gilts in the middle of its own QT (September 2022); the central bank may have to play firefighter amid its own tightening',
    ],
    reponseModele: `Commencer par ce qu'elle peut — c'est déjà considérable. Dans sa propre devise, la banque centrale est l'acteur qui **n'est jamais à court** : prêteur en dernier ressort illimité — la doctrine Bagehot, prêter largement, à taux de pénalité, contre bon collatéral — et, on l'a vu avec l'OMT, une promesse illimitée crédible suffit à tuer une panique auto-réalisatrice sans dépenser un euro. Par la transmission, elle pilote la **demande nominale** à moyen terme : elle fixe un seul prix, l'argent au jour le jour, mais ce prix est le dénominateur de tous les autres. Sur ce terrain-là, ne pas la combattre — *don't fight the Fed* — reste la première règle du métier.

Puis les limites, en trois cercles. **L'offre d'abord** : les taux répriment la demande, ils ne créent pas d'offre — monter le taux directeur ne fait pas pousser le blé et ne rouvre pas un gazoduc. Resserrer contre un choc d'offre, c'est comprimer la demande pour compenser un appauvrissement : un remède qui a le goût de la maladie — c'est toute la raison d'être du core. Face au gaz de 2022, la BCE ne pouvait pas faire baisser le prix du gaz ; elle pouvait seulement empêcher que la hausse s'installe dans les anticipations. **Les bornes ensuite** : le plancher zéro (le billet rapporte toujours 0), le reversal rate qui retourne l'arme des taux négatifs, et l'asymétrie fondamentale — *pushing on a string* : on peut rendre l'argent gratuit, on ne force personne à emprunter. La décennie 2010 en est la preuve grandeur nature : taux nuls, puis négatifs, puis QE par milliers de milliards — et une inflation qui refusa obstinément de remonter à 2 %. La boîte à outils est profonde côté freinage, étroite côté relance. **Le budget enfin** : la dominance budgétaire — quand la dette publique est si lourde que toute hausse de taux menace la solvabilité de l'État, la banque centrale perd sa liberté sans qu'aucune loi ne change (la Fed plafonnant les taux de 1942 à 1951 ; la Turquie de 2021-2023 et ses 85 % d'inflation). Et le QE a rapproché cette frontière : détenir un tiers de la dette de son État rend la sortie délicate.

Ajoutez la limite opérationnelle qui traverse tout : les **délais** — 12 à 18 mois entre la décision et l'effet. Elle ne pilote jamais l'inflation du trimestre, seulement celle de l'an prochain, dans le rétroviseur.

La synthèse que le jury attend : la banque centrale ne peut pas tout — elle ne peut ni créer du pétrole, ni forcer un emprunteur, ni ignorer le Trésor indéfiniment. Mais elle peut tout dans **un** domaine : défendre la valeur de sa promesse. Son outil le plus puissant est gratuit — trois mots de Draghi ont fait ce que des milliers de milliards n'auraient peut-être pas fait — à une condition jamais acquise : être crue. La formule finale : la banque centrale peut exactement ce que sa crédibilité permet — 2021-2023 n'a pas prouvé sa toute-puissance, mais le rendement de quarante ans de parole tenue.`,
    reponseModeleEn: `Start with what it can do — which is already considerable. In its own currency, the central bank is the actor that **never runs short**: unlimited lender of last resort — the Bagehot doctrine, lend freely, at a penalty rate, against good collateral — and, as the OMT showed, a credible unlimited promise is enough to kill a self-fulfilling panic without spending a euro. Through transmission, it steers **nominal demand** over the medium term: it sets a single price, overnight money, but that price is the denominator of all the others. On that ground, not fighting it — *don't fight the Fed* — remains the first rule of the trade.

Then the limits, in three circles. **Supply first**: rates repress demand, they do not create supply — raising the policy rate does not grow wheat and does not reopen a gas pipeline. Tightening against a supply shock means squeezing demand to offset an impoverishment: a remedy that tastes like the disease — that is core inflation's whole raison d'être. Facing the gas of 2022, the ECB could not bring the gas price down; it could only prevent the rise from settling into expectations. **The bounds next**: the zero floor (the banknote always yields 0), the reversal rate that turns the negative-rate weapon around, and the fundamental asymmetry — *pushing on a string*: you can make money free, you cannot force anyone to borrow. The 2010s are the life-size proof: zero rates, then negative, then QE by the thousands of billions — and inflation stubbornly refusing to climb back to 2%. The toolbox is deep on the braking side, narrow on the stimulus side. **The budget last**: fiscal dominance — when public debt is so heavy that any rate hike threatens the state's solvency, the central bank loses its freedom without any law changing (the Fed capping rates from 1942 to 1951; Turkey in 2021-2023 and its 85% inflation). And QE brought that border closer: holding a third of your state's debt makes the exit delicate.

Add the operational limit running through everything: the **lags** — 12 to 18 months between decision and effect. It never steers this quarter's inflation, only next year's, in the rear-view mirror.

The synthesis the jury expects: the central bank cannot do everything — it can neither create oil, nor force a borrower, nor ignore the Treasury indefinitely. But it can do everything in **one** domain: defending the value of its promise. Its most powerful tool is free — three words from Draghi did what thousands of billions might not have done — on one condition never granted for good: being believed. The final formula: the central bank can do exactly what its credibility allows — 2021-2023 did not prove its omnipotence, but the return on forty years of a word kept.`,
  },
];
