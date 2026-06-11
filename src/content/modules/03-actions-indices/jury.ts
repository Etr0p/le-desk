import type { JuryQuestion } from '../../../engine/types';

const M3 = '03-actions-indices';

export const jury: JuryQuestion[] = [
  {
    id: 'm3-jury-01',
    moduleId: M3,
    theme: "l'action",
    themeEn: 'the share',
    difficulte: 1,
    question: "Qu'est-ce qu'une action, au fond ?",
    questionEn: 'What is a share, fundamentally?',
    plan: [
      'Définir : un titre de propriété, une fraction du capital social',
      'Les trois droits : bénéfices, vote, boni de liquidation',
      "Ce que l'action ne promet pas : ni revenu, ni échéance, ni rang",
      'Conclure : tout le risque et tout le potentiel découlent du statut de propriétaire',
    ],
    planEn: [
      'Define it: a title of ownership, a fraction of the share capital',
      'The three rights: earnings, voting, liquidation surplus',
      'What a share does not promise: no income, no maturity, no seniority',
      'Conclude: all the risk and all the upside flow from the owner status',
    ],
    pointsAttendus: [
      "Une action est une fraction du capital social : l'actionnaire ne prête pas, il possède",
      "Droit aux bénéfices — pas seulement au dividende : les bénéfices mis en réserve restent dans l'entreprise, grossissent les fonds propres et la valeur du titre ; le payout mesure la part distribuée",
      'Droit de vote : une action, une voix en assemblée générale — élire le conseil, approuver les comptes ; 50 % des voix plus une, c\'est le contrôle',
      "Droit au boni de liquidation, mais en dernier rang : après tous les créanciers, l'actionnaire ne récupère le plus souvent rien",
      "Aucune promesse : dividende décidé chaque année, pas d'échéance — en contrepartie, potentiel illimité à la hausse et perte bornée à la mise",
    ],
    pointsAttendusEn: [
      'A share is a fraction of the share capital: the shareholder does not lend, he owns',
      'A right to the earnings — not just to the dividend: retained earnings stay in the company, grow the equity and the value of each share; the payout ratio measures the distributed portion',
      'Voting rights: one share, one vote at the general meeting — electing the board, approving the accounts; 50% of the votes plus one is control',
      'A right to the liquidation surplus, but last in line: after every creditor, the shareholder most often recovers nothing',
      'No promise at all: a dividend decided each year, no maturity — in exchange, unlimited upside and a loss capped at the stake',
    ],
    bonus: [
      "Citer la galerie des variétés : action de préférence (dividende prioritaire contre droit de vote), vote double de la loi Florange, classes A/B/C américaines — 10 voix par titre chez Meta",
      "Glisser le piège capitalisation ≠ valeur d'entreprise : la capitalisation valorise les capitaux propres, l'EV ajoute la dette nette",
    ],
    bonusEn: [
      'Mention the gallery of variants: preference shares (priority dividend in exchange for the vote), French double voting rights under the Florange Act, US A/B/C share classes — 10 votes per share at Meta',
      'Slip in the trap: market cap ≠ enterprise value — the cap prices the equity, EV adds net debt',
    ],
    reponseModele: `Au fond, une action est une **part de propriété** : une fraction du capital social d'une société. L'obligataire prête et détient une promesse — coupon, échéance, rang de créancier. L'actionnaire, lui, possède, et ce simple statut emporte trois droits.

Le premier est le plus mal compris : un droit sur **les bénéfices**, pas seulement sur le dividende. Chaque année, l'assemblée générale partage le résultat — le taux de distribution mesure la part versée — et ce qui est mis en réserve n'est pas perdu : il reste dans l'entreprise, grossit les fonds propres, finance la croissance. Une société qui ne verse aucun dividende peut parfaitement enrichir ses actionnaires : elle réinvestit pour eux.

Le deuxième droit est politique : une action, une voix. L'actionnaire élit le conseil d'administration, approuve les comptes, vote les fusions et augmentations de capital — détenir 50 % des voix plus une, c'est contrôler la société. Le réel est plus inventif que la règle : actions de préférence, vote double, classes d'actions à voix multiples.

Le troisième ne s'exerce qu'à la mort de l'entreprise : le boni de liquidation, ce qui reste une fois tous les créanciers servis. Et l'actionnaire passe **en dernier** : en cas de faillite, le plus souvent, rien.

La contrepartie de cette absence totale de promesse — revenu incertain, pas d'échéance, dernier rang — c'est le profil de gain : perte bornée à la mise, potentiel illimité à la hausse. Tout tient en une ligne : l'obligataire détient une promesse, l'actionnaire une espérance.`,
    reponseModeleEn: `Fundamentally, a share is a **piece of ownership**: a fraction of a company's share capital. The bondholder lends and holds a promise — coupon, maturity, creditor ranking. The shareholder owns, and that simple status carries three rights.

The first is the most misunderstood: a right to **the earnings**, not just to the dividend. Each year the general meeting splits the result — the payout ratio measures the distributed share — and what is retained is not lost: it stays inside the company, grows the equity, funds the growth. A company that pays no dividend at all can perfectly well enrich its shareholders: it reinvests on their behalf.

The second right is political: one share, one vote. The shareholder elects the board, approves the accounts, votes on mergers and capital increases — holding 50% of the votes plus one means controlling the company. Reality is more inventive than the rule: preference shares, double voting rights, multi-vote share classes.

The third is only exercised when the company dies: the liquidation surplus, whatever remains once every creditor has been served. And the shareholder comes **last**: in a bankruptcy, most often, nothing.

The counterpart of this total absence of promise — uncertain income, no maturity, last in line — is the payoff profile: loss capped at the stake, unlimited upside. It fits in one line: the bondholder holds a promise, the shareholder holds an expectation.`,
  },
  {
    id: 'm3-jury-02',
    moduleId: M3,
    theme: "l'action",
    themeEn: 'the share',
    difficulte: 2,
    question: 'Pourquoi les actions rapportent-elles plus que les obligations ?',
    questionEn: 'Why do equities return more than bonds?',
    plan: [
      'Comparer méthodiquement les deux titres : promesse contre espérance',
      "Inventorier les risques que l'actionnaire encaisse seul",
      'En déduire la prime de risque actions exigée',
      'Chiffrer : 4 à 6 points par an sur longue période, avec prudence',
    ],
    planEn: [
      'Compare the two securities methodically: a promise versus an expectation',
      'List the risks the shareholder bears alone',
      'Derive the required equity risk premium',
      'Put a number on it: 4 to 6 points a year over the long run, quoted with caution',
    ],
    pointsAttendus: [
      "L'obligation : coupon contractuel, maturité fixée, rang de créancier ; l'action : dividende jamais garanti, aucune échéance, dernier rang en cas de faillite",
      "Un investisseur rationnel n'échange des flux certains contre des flux incertains, perpétuels et de dernier rang que contre une espérance de rendement supérieure",
      "Ce supplément exigé est la prime de risque actions : de l'ordre de 4 à 6 points au-dessus du sans-risque par an, sur longue période, dans les grands marchés développés",
      'Préciser que c\'est un ordre de grandeur historique, variable selon les périodes et les méthodes de mesure — à citer avec prudence, jamais comme une garantie',
      'Capitalisés sur des décennies, 4 à 6 points par an creusent des écarts de patrimoine considérables : c\'est la rémunération de celui qui accepte d\'être payé en dernier',
    ],
    pointsAttendusEn: [
      'The bond: contractual coupon, fixed maturity, creditor ranking; the share: a dividend never guaranteed, no maturity, last in line in a bankruptcy',
      'A rational investor only swaps certain cash flows for uncertain, perpetual, last-ranking ones in exchange for a higher expected return',
      'That required extra is the equity risk premium: roughly 4 to 6 points a year above the risk-free rate, over long periods, in the major developed markets',
      'Make clear it is a historical order of magnitude, varying with periods and measurement methods — to be quoted with caution, never as a guarantee',
      'Compounded over decades, 4 to 6 points a year open up enormous wealth gaps: it is the pay of the one who agrees to be paid last',
    ],
    bonus: [
      'Boucler sur la valorisation : ce supplément est précisément le r de Gordon et du DCF — taux sans risque plus prime de risque, que le CAPM calibrera titre par titre',
      "Souligner le mot « espérance » : l'actionnaire encaisse tout l'aléa dans les deux sens — la prime rémunère un risque réellement porté, pas un droit acquis",
    ],
    bonusEn: [
      'Loop back to valuation: that extra is precisely the r in Gordon and in the DCF — risk-free rate plus risk premium, which the CAPM will calibrate stock by stock',
      'Stress the word expectation: the shareholder absorbs the whole hazard in both directions — the premium pays for a risk genuinely borne, not for an entitlement',
    ],
    reponseModele: `Parce que personne n'accepterait, sinon, d'en porter le risque. Comparons méthodiquement. L'obligataire détient une **promesse** : un coupon contractuel connu d'avance, une maturité fixée, un rang de créancier en cas de faillite. L'actionnaire détient une **espérance** : un dividende décidé chaque année et jamais garanti, aucune échéance — la durée de vie de l'entreprise —, et le dernier rang de la hiérarchie, après la dette senior sécurisée, la senior, la subordonnée et les hybrides. En cas de faillite, le plus souvent : rien.

Pour qu'un investisseur rationnel troque des flux certains contre des flux incertains, perpétuels et de dernier rang, il exige un supplément d'espérance de rendement. Ce supplément est la **prime de risque actions** : sur longue période, dans les grands marchés développés, de l'ordre de 4 à 6 points par an au-dessus des placements sans risque. Je cite ce chiffre avec prudence — c'est un ordre de grandeur historique, variable selon les périodes et les méthodes de mesure, pas une garantie.

Mais l'ordre de grandeur suffit à mesurer l'enjeu : 4 à 6 points par an, capitalisés sur des décennies, font des écarts de patrimoine considérables. C'est la rémunération de celui qui accepte d'être payé en dernier — il encaisse tout l'aléa, dans les deux sens.

Et ce supplément n'est pas qu'une statistique : c'est exactement le taux d'actualisation des modèles de valorisation. Le r de Gordon ou du DCF, c'est le taux sans risque plus cette prime — la boucle est bouclée.`,
    reponseModeleEn: `Because otherwise nobody would agree to carry their risk. Compare the two methodically. The bondholder owns a **promise**: a contractual coupon known in advance, a fixed maturity, a creditor's rank in bankruptcy. The shareholder owns an **expectation**: a dividend decided each year and never guaranteed, no maturity — the lifetime of the company — and the very last rank in the hierarchy, behind senior secured, senior, subordinated and hybrid debt. In a bankruptcy, most often: nothing.

For a rational investor to swap certain cash flows for uncertain, perpetual, last-ranking ones, he demands an extra expected return. That extra is the **equity risk premium**: over long periods, in the major developed markets, on the order of 4 to 6 points a year above risk-free investments. I quote that figure with caution — it is a historical order of magnitude, varying across periods and measurement methods, not a guarantee.

But the order of magnitude is enough to grasp the stakes: 4 to 6 points a year, compounded over decades, produce enormous wealth gaps. It is the pay of the one who agrees to be paid last — he absorbs the entire hazard, in both directions.

And that extra is not just a statistic: it is exactly the discount rate of the valuation models. The r in Gordon or in a DCF is the risk-free rate plus this premium — the loop closes.`,
  },
  {
    id: 'm3-jury-03',
    moduleId: M3,
    theme: 'valorisation par les flux',
    themeEn: 'cash-flow valuation',
    difficulte: 2,
    question: 'Valorisez-moi une société en deux minutes : la méthode.',
    questionEn: 'Value a company for me in two minutes: the method.',
    plan: [
      'Annoncer la carte : deux familles, valeur intrinsèque et valeur relative',
      'Dérouler le DCF en trois blocs : flux explicites, valeur terminale, actualisation au WACC',
      "Contrôler par les multiples : PER, EV/EBITDA sur un échantillon de comparables",
      'Conclure en fourchette, jamais en chiffre unique',
    ],
    planEn: [
      'Announce the map: two families, intrinsic value and relative value',
      'Run the DCF in three blocks: explicit flows, terminal value, discounting at the WACC',
      'Cross-check with multiples: P/E, EV/EBITDA on a sample of comparables',
      'Conclude with a range, never a single number',
    ],
    pointsAttendus: [
      "Le principe unique : un actif vaut la somme de ses flux futurs actualisés — pour une action, dividendes ou free cash flows",
      "DCF : projeter les FCF sur un horizon explicite de 3 à 10 ans, fermer par une valeur terminale (Gordon sur le flux suivant l'horizon), tout actualiser au WACC — la sortie est une valeur d'entreprise, retrancher la dette nette pour les actions",
      "Multiples : six à dix comparables, mêmes agrégats et mêmes retraitements, synthèse par la médiane, application au BPA ou à l'EBITDA de la cible — avec ajustements : décote d'illiquidité, prime de contrôle",
      "Les deux ne répondent pas à la même question : le DCF dit ce que l'actif devrait valoir dans vos hypothèses, les multiples ce que le marché paie aujourd'hui pour ses semblables",
      'Un professionnel produit les deux : le DCF porte la thèse, les multiples le contrôle de cohérence',
      'Présentation finale : une fourchette avec analyse de sensibilité, pas un chiffre au centime',
    ],
    pointsAttendusEn: [
      'The single principle: an asset is worth the sum of its discounted future cash flows — for a share, dividends or free cash flows',
      'DCF: project the FCF over an explicit 3-to-10-year horizon, close with a terminal value (Gordon on the first flow beyond the horizon), discount everything at the WACC — the output is an enterprise value, subtract net debt to get to the equity',
      'Multiples: six to ten comparables, same aggregates and same restatements, summarised by the median, applied to the target EPS or EBITDA — with adjustments: illiquidity discount, control premium',
      'The two answer different questions: the DCF says what the asset should be worth under your assumptions, multiples say what the market pays today for its peers',
      'A professional produces both: the DCF carries the thesis, the multiples provide the sanity check',
      'Final presentation: a range with a sensitivity analysis, not a number to the cent',
    ],
    bonus: [
      'La passerelle qui impressionne : un multiple est un DCF compressé dont on a caché les hypothèses — PER théorique = d(1+g)/(r−g)',
      "Savoir quand le DCF est inapplicable : sociétés sans flux positifs prévisibles — start-up brûlant du cash, cycliques en bas de cycle",
    ],
    bonusEn: [
      'The bridge that impresses: a multiple is a compressed DCF with its assumptions hidden — theoretical P/E = d(1+g)/(r−g)',
      'Know when the DCF cannot apply: companies with no predictable positive flows — cash-burning start-ups, cyclicals at the bottom of the cycle',
    ],
    reponseModele: `Deux minutes, deux familles, un verdict en fourchette. Première famille : la valeur **intrinsèque**. Le principe tient en une ligne — un actif vaut la somme de ses flux futurs actualisés. Je projette les flux de trésorerie disponibles sur un horizon explicite de trois à dix ans, je ferme la somme infinie par une valeur terminale — Gordon, appliqué au premier flux au-delà de l'horizon —, et j'actualise le tout au WACC, le coût moyen pondéré du capital, puisque les FCF reviennent aux actionnaires et aux créanciers à la fois. Attention à la sortie : c'est une valeur d'entreprise — je retranche la dette nette pour obtenir la valeur des actions.

Deuxième famille : la valeur **relative**. Je constitue un échantillon de six à dix comparables — métier, taille, croissance, géographie —, je calcule leurs multiples proprement, PER et EV/EBITDA, je synthétise par la médiane, plus robuste que la moyenne, et je l'applique au BPA ou à l'EBITDA de ma cible, avec les ajustements d'usage : décote d'illiquidité pour une société non cotée, prime de contrôle dans une acquisition.

Les deux méthodes ne répondent pas à la même question : le DCF dit ce que l'actif *devrait* valoir dans mes hypothèses, les multiples ce que le marché paie *aujourd'hui* pour ses semblables. Le DCF porte la thèse, les multiples la confrontent au marché.

Et je conclus toujours pareil : une fourchette, avec tableau de sensibilité — jamais un chiffre au centime, qui signalerait que je récite mon outil au lieu de le maîtriser.`,
    reponseModeleEn: `Two minutes, two families, a verdict given as a range. First family: **intrinsic** value. The principle fits in one line — an asset is worth the sum of its discounted future cash flows. I project free cash flows over an explicit three-to-ten-year horizon, I close the infinite sum with a terminal value — Gordon, applied to the first flow beyond the horizon — and I discount everything at the WACC, the weighted average cost of capital, since FCF accrues to shareholders and creditors alike. Mind the output: it is an enterprise value — I subtract net debt to get the equity value.

Second family: **relative** value. I build a sample of six to ten comparables — business, size, growth, geography — I compute their multiples cleanly, P/E and EV/EBITDA, I summarise with the median, more robust than the mean, and I apply it to my target's EPS or EBITDA, with the usual adjustments: an illiquidity discount for a private company, a control premium in an acquisition.

The two methods answer different questions: the DCF says what the asset *should* be worth under my assumptions, the multiples say what the market pays *today* for its peers. The DCF carries the thesis; the multiples confront it with the market.

And I always conclude the same way: a range, with a sensitivity table — never a number to the cent, which would signal that I recite my tool instead of mastering it.`,
  },
  {
    id: 'm3-jury-04',
    moduleId: M3,
    theme: 'valorisation par les flux',
    themeEn: 'cash-flow valuation',
    difficulte: 2,
    question: "Gordon-Shapiro : forces, faiblesses, et quand l'utiliser ?",
    questionEn: 'The Gordon growth model: strengths, weaknesses, and when to use it?',
    plan: [
      'Poser la formule et ses deux conditions : D₁ et r > g',
      "L'exemple canonique : 5 €, 8 %, 3 % → 100 €",
      'Les forces : simplicité, discipline, lien explicite valeur-paramètres',
      "Les faiblesses et l'habitat naturel : sociétés mûres au dividende prévisible",
    ],
    planEn: [
      'State the formula and its two conditions: D₁ and r > g',
      'The canonical example: €5, 8%, 3% → €100',
      'The strengths: simplicity, discipline, an explicit value-to-parameters link',
      'The weaknesses and the natural habitat: mature companies with predictable dividends',
    ],
    pointsAttendus: [
      'V₀ = D₁/(r − g), avec D₁ le dividende attendu dans un an — pas le dernier versé — et r > g, condition de convergence de la série',
      "L'exemple de référence : 5/(0,08 − 0,03) = 100 € — on paie 20 fois le dividende, le multiple 1/(r−g) ; à g = 0, on retombe sur la perpétuité simple : 62,50 €",
      'Force : trois paramètres seulement, chacun discutable — le modèle discipline le raisonnement et révèle ce que le prix suppose',
      'Faiblesse : sensibilité explosive au dénominateur — passer g de 3 à 4 % fait bondir la valeur de 100 à 125 €, +25 % pour un seul point',
      "Quand l'utiliser : société mûre au dividende stable et prévisible — l'utility type ; jamais pour l'hypercroissance, qui n'est pas perpétuelle — le modèle en deux étapes prend le relais",
    ],
    pointsAttendusEn: [
      'V₀ = D₁/(r − g), with D₁ the dividend expected in one year — not the last one paid — and r > g, the convergence condition of the series',
      'The reference example: 5/(0.08 − 0.03) = €100 — you pay 20 times the dividend, the 1/(r−g) multiple; at g = 0 it collapses back to the simple perpetuity: €62.50',
      'Strength: only three parameters, each one debatable — the model disciplines the reasoning and reveals what the price assumes',
      'Weakness: explosive sensitivity to the denominator — moving g from 3% to 4% jumps the value from €100 to €125, +25% for a single point',
      'When to use it: a mature company with a stable, predictable dividend — the typical utility; never for hypergrowth, which is not perpetual — the two-stage model takes over',
    ],
    bonus: [
      'La dérivation en une ligne : série géométrique de raison (1+g)/(1+r), convergente si r > g — Gordon n\'est que la perpétuité croissante',
      "g lui-même se discipline : g = ROE × b, la croissance soutenable — un g supérieur à ce que le couple ROE-payout soutient doit alerter",
    ],
    bonusEn: [
      'The one-line derivation: a geometric series with ratio (1+g)/(1+r), convergent if r > g — Gordon is just the growing perpetuity',
      'g itself can be disciplined: g = ROE × b, sustainable growth — a g above what the ROE-payout pair can sustain should raise a flag',
    ],
    reponseModele: `La formule d'abord : $V_0 = D_1/(r - g)$, avec deux pièges dans les symboles. $D_1$ est le dividende attendu **dans un an**, pas le dernier versé — l'erreur classique quand l'énoncé donne D₀. Et $r > g$ n'est pas décoratif : c'est la condition de convergence de la série géométrique ; si la croissance rattrapait le taux, la valeur serait infinie.

L'exemple canonique : 5 € de dividende attendu, rendement exigé 8 %, croissance perpétuelle 3 % — soit 5/0,05 = **100 €**, vingt fois le dividende. Et si g tombe à zéro, on retrouve la perpétuité simple : 62,50 €. La croissance de 3 % « vaut » 37,50 € à elle seule.

Les forces : trois paramètres, pas un de plus, et chacun discutable. Le modèle oblige à expliciter ce que le prix suppose — il discipline le raisonnement, et c'est sa vraie vertu. La faiblesse symétrique : toute la valeur tient dans un dénominateur minuscule. Passez g de 3 à 4 % : la valeur bondit de 100 à 125 €, +25 % pour un point. Personne n'estime g ou r à un point près — d'où la présentation en fourchette, jamais en chiffre unique.

Quand l'utiliser ? Dans son habitat naturel : la société mûre au dividende stable et prévisible — l'utility type, D₁ = 5 €, r = 7 %, g = 1,5 %, 90,91 €. Jamais pour l'hypercroissance : g = 7,5 % pour r = 8 % affiche 200 € pour 1 € de dividende, un chiffre qui ne signifie rien — une hypercroissance n'est jamais perpétuelle. C'est précisément ce que résout le modèle en deux étapes.`,
    reponseModeleEn: `The formula first: $V_0 = D_1/(r - g)$, with two traps hidden in the symbols. $D_1$ is the dividend expected **in one year**, not the last one paid — the classic mistake when the problem gives D₀. And $r > g$ is not decorative: it is the convergence condition of the geometric series; if growth caught up with the discount rate, the value would be infinite.

The canonical example: a €5 expected dividend, an 8% required return, 3% perpetual growth — 5/0.05 = **€100**, twenty times the dividend. And if g drops to zero, you recover the simple perpetuity: €62.50. The 3% growth alone is "worth" €37.50.

The strengths: three parameters, not one more, and each debatable. The model forces you to spell out what the price assumes — it disciplines the reasoning, and that is its true virtue. The symmetric weakness: the whole value sits in a tiny denominator. Move g from 3% to 4%: the value jumps from €100 to €125, +25% for one point. Nobody estimates g or r to within a point — hence the presentation as a range, never a single figure.

When to use it? In its natural habitat: the mature company with a stable, predictable dividend — the typical utility, D₁ = €5, r = 7%, g = 1.5%, €90.91. Never for hypergrowth: g = 7.5% against r = 8% prints €200 for €1 of dividend, a number that means nothing — hypergrowth is never perpetual. That is exactly what the two-stage model solves.`,
  },
  {
    id: 'm3-jury-05',
    moduleId: M3,
    theme: 'valorisation par les flux',
    themeEn: 'cash-flow valuation',
    difficulte: 3,
    question: "D'où vient le g de Gordon ? Donnez-moi autre chose qu'un vœu.",
    questionEn: 'Where does the g in Gordon come from? Give me something better than wishful thinking.',
    plan: [
      "Le principe : g n'est pas un vœu, c'est du réinvestissement",
      'La formule de la croissance soutenable : g = ROE × b',
      "L'exemple chiffré : ROE 12 %, payout 60 % → g = 4,8 %",
      "L'usage : tester la cohérence de tout g annoncé",
    ],
    planEn: [
      'The principle: g is not a wish, it is reinvestment',
      'The sustainable growth formula: g = ROE × b',
      'The worked example: ROE 12%, payout 60% → g = 4.8%',
      'The use: stress-testing any quoted g for consistency',
    ],
    pointsAttendus: [
      "Une entreprise ne peut croître durablement qu'au rythme de ce qu'elle réinvestit : les bénéfices mis en réserve grossissent les fonds propres, qui produisent du bénéfice au taux ROE",
      'b est le taux de rétention, 1 − payout : la part du bénéfice non distribuée',
      'Le ROE mesure ce que rapporte chaque euro réinvesti : le bénéfice — donc le dividende — croît de ROE × b',
      'Exemple : ROE de 12 %, payout de 60 %, donc b = 40 % et g = 12 % × 0,40 = 4,8 %',
      "Le réflexe d'oral : un g annoncé supérieur à ce que le couple ROE-payout peut soutenir doit mettre en alerte — c'est le test de cohérence de toute valorisation Gordon",
    ],
    pointsAttendusEn: [
      'A company can only grow durably at the pace of what it reinvests: retained earnings grow the equity, which produces earnings at the ROE rate',
      'b is the retention rate, 1 − payout: the share of earnings not distributed',
      'ROE measures what each reinvested euro yields: earnings — hence the dividend — grow at ROE × b',
      'Example: ROE of 12%, payout of 60%, so b = 40% and g = 12% × 0.40 = 4.8%',
      'The oral reflex: a quoted g above what the ROE-payout pair can sustain should raise a flag — it is the consistency test of any Gordon valuation',
    ],
    bonus: [
      "La boucle avec le droit aux bénéfices : c'est parce que les réserves appartiennent à l'actionnaire que la rétention crée de la croissance pour lui",
      "Le corollaire à ROE donné : payout élevé = croissance faible — tout dividende d'aujourd'hui se paie en dividende de demain",
    ],
    bonusEn: [
      'The loop back to the right to earnings: it is because the reserves belong to the shareholder that retention creates growth for him',
      'The corollary at a given ROE: high payout = low growth — every dividend today is paid for in tomorrow’s dividend',
    ],
    reponseModele: `Le g n'est pas un paramètre libre : une entreprise ne peut croître durablement qu'au rythme de ce qu'elle **réinvestit**. D'où la formule de la croissance soutenable : $g = ROE \\times b$.

Décomposons la mécanique. Chaque année, une part b du bénéfice — le taux de rétention, soit 1 moins le payout — est mise en réserve. Ces bénéfices non distribués ne disparaissent pas : ils grossissent les fonds propres. Et chaque euro de fonds propres supplémentaire produit du bénéfice au taux ROE, la rentabilité des fonds propres. Le bénéfice de l'an prochain est donc celui de cette année, plus le rendement des sommes réinvesties : il croît de ROE × b — et le dividende avec lui, à payout constant.

L'exemple du cours : ROE de 12 %, payout de 60 %, donc rétention de 40 % — g = 12 % × 0,40 = **4,8 %**. C'est la croissance que cette entreprise peut s'offrir sans lever de capital ni changer de modèle.

L'usage pratique est un test de cohérence. Face à une valorisation Gordon, je confronte toujours le g retenu au couple ROE-payout : un g de 6 % pour une société qui distribue 80 % de son bénéfice avec un ROE de 10 % est arithmétiquement insoutenable — 10 % × 0,20 ne fait que 2 %. Un g supérieur à la croissance soutenable doit immédiatement mettre en alerte : soit l'analyste suppose une amélioration du ROE qu'il doit justifier, soit il a pris un vœu pour une hypothèse.

Et la boucle est élégante : c'est parce que l'actionnaire a droit aux bénéfices — pas seulement au dividende — que la rétention travaille pour lui.`,
    reponseModeleEn: `g is not a free parameter: a company can only grow durably at the pace of what it **reinvests**. Hence the sustainable growth formula: $g = ROE \\times b$.

Break down the mechanics. Each year, a fraction b of earnings — the retention rate, 1 minus the payout — is put into reserves. Those retained earnings do not vanish: they grow the equity. And every additional euro of equity produces earnings at the ROE, the return on equity. Next year's earnings are this year's plus the return on the reinvested sums: they grow at ROE × b — and so does the dividend, at constant payout.

The course example: ROE of 12%, payout of 60%, hence 40% retention — g = 12% × 0.40 = **4.8%**. That is the growth this company can afford without raising capital or changing its model.

The practical use is a consistency test. Facing a Gordon valuation, I always confront the chosen g with the ROE-payout pair: a 6% g for a company that pays out 80% of its earnings with a 10% ROE is arithmetically unsustainable — 10% × 0.20 only makes 2%. A g above sustainable growth should immediately raise a flag: either the analyst assumes an ROE improvement he must justify, or he has mistaken a wish for an assumption.

And the loop is elegant: it is because the shareholder is entitled to the earnings — not merely to the dividend — that retention works on his behalf.`,
  },
  {
    id: 'm3-jury-06',
    moduleId: M3,
    theme: 'valorisation par les flux',
    themeEn: 'cash-flow valuation',
    difficulte: 3,
    question: 'Pourquoi la valeur explose-t-elle quand r − g se resserre ?',
    questionEn: 'Why does the value explode when r − g narrows?',
    plan: [
      'Localiser la valeur : tout est dans le dénominateur r − g',
      'Chiffrer la sensibilité : +25 % pour un point de g, −17 % pour un point de r',
      "Expliquer l'asymétrie : la convexité",
      'En tirer la pratique professionnelle : fourchette et tableau de sensibilité',
    ],
    planEn: [
      'Locate the value: everything sits in the r − g denominator',
      'Quantify the sensitivity: +25% for one point of g, −17% for one point of r',
      'Explain the asymmetry: convexity',
      'Draw the professional practice: a range and a sensitivity table',
    ],
    pointsAttendus: [
      "V₀ = D₁/(r − g) : la valeur est l'inverse d'un petit nombre — toute variation du dénominateur est démultipliée",
      "Sur l'exemple canonique : g de 3 à 4 % → 5/0,04 = 125 €, soit +25 % ; r de 8 à 9 % → 5/0,06 = 83,33 €, soit −17 % environ",
      "L'asymétrie +25 %/−17 % est la convexité : la fonction 1/(r−g) monte plus vite qu'elle ne descend",
      "Quand r − g passe sous un point, le modèle sort du cadre : g = 7,5 % pour r = 8 % donne 200 € pour 1 € de dividende — un chiffre qui ne signifie rien, une hypercroissance n'est jamais perpétuelle",
      'Conséquence : personne n\'estime r ou g à un point près — toute valorisation se présente en fourchette avec tableau de sensibilité ; annoncer « 103,27 € » au centime, c\'est réciter son outil',
    ],
    pointsAttendusEn: [
      'V₀ = D₁/(r − g): the value is the inverse of a small number — any move in the denominator is magnified',
      'On the canonical example: g from 3% to 4% → 5/0.04 = €125, i.e. +25%; r from 8% to 9% → 5/0.06 = €83.33, i.e. roughly −17%',
      'The +25%/−17% asymmetry is convexity: the 1/(r−g) function rises faster than it falls',
      'When r − g drops below one point, the model leaves its frame: g = 7.5% against r = 8% gives €200 for €1 of dividend — a meaningless number, hypergrowth is never perpetual',
      'Consequence: nobody estimates r or g to within a point — every valuation is presented as a range with a sensitivity table; quoting €103.27 to the cent means reciting the tool',
    ],
    bonus: [
      "Relier aux taux : c'est la même mécanique qui dilate les PER quand les taux baissent — les valeurs de croissance sont les « obligations longues » de la cote",
      "La condition r > g n'est pas décorative : c'est la convergence de la série géométrique — à g ≥ r, la somme diverge et la valeur serait infinie",
    ],
    bonusEn: [
      'Link it to rates: the same mechanics dilate P/E ratios when rates fall — growth stocks are the long bonds of the equity market',
      'The r > g condition is not decorative: it is the convergence condition of the geometric series — at g ≥ r the sum diverges and the value would be infinite',
    ],
    reponseModele: `Parce que toute la valeur tient dans un dénominateur minuscule. Gordon écrit $V_0 = D_1/(r - g)$ : la valeur est l'inverse d'un écart qui se compte en points de pourcentage. Quand cet écart se resserre, son inverse s'emballe — c'est de l'arithmétique, pas de la finance.

Chiffrons sur l'exemple canonique : D₁ = 5 €, r = 8 %, g = 3 %, soit 100 €. Montez g d'un seul point : 5/0,04 = **125 €**, +25 % de valeur. Montez r d'un point au lieu de g : 5/0,06 = **83,33 €**, près de −17 %. Notez l'asymétrie : +25 % dans un sens, −17 % dans l'autre — c'est la convexité, la fonction 1/(r−g) monte plus vite qu'elle ne descend.

Et plus l'écart est petit, plus l'explosion est violente. Sous un point d'écart, le modèle sort littéralement du cadre : g = 7,5 % pour r = 8 % affiche 200 € pour 1 € de dividende. Ce chiffre ne signifie rien — il dit seulement qu'on a supposé perpétuelle une hypercroissance qui ne l'est jamais. À la limite g = r, la série diverge : la condition r > g est la condition de convergence, pas une coquetterie.

La conséquence professionnelle : personne ne sait estimer r ou g à un point près, alors que la valeur, elle, réagit à plusieurs dizaines de pour cent par point. Toute valorisation Gordon ou DCF se présente donc en fourchette, avec un tableau de sensibilité croisant les deux paramètres. Un évaluateur qui annonce 103,27 € au centime ne maîtrise pas son outil — il le récite.`,
    reponseModeleEn: `Because the entire value sits in a tiny denominator. Gordon writes $V_0 = D_1/(r - g)$: the value is the inverse of a gap measured in percentage points. When that gap narrows, its inverse races away — that is arithmetic, not finance.

Put numbers on the canonical example: D₁ = €5, r = 8%, g = 3%, so €100. Raise g by a single point: 5/0.04 = **€125**, +25% of value. Raise r by one point instead: 5/0.06 = **€83.33**, close to −17%. Note the asymmetry: +25% one way, −17% the other — that is convexity, the 1/(r−g) function rises faster than it falls.

And the smaller the gap, the more violent the explosion. Below one point of spread, the model literally leaves its frame: g = 7.5% against r = 8% prints €200 for €1 of dividend. That figure means nothing — it only says that hypergrowth, which is never perpetual, has been assumed perpetual. At the limit g = r, the series diverges: the r > g condition is the convergence condition, not a nicety.

The professional consequence: nobody can estimate r or g to within a point, while the value reacts by tens of percent per point. Any Gordon or DCF valuation is therefore presented as a range, with a sensitivity table crossing the two parameters. An appraiser who announces €103.27 to the cent does not master his tool — he recites it.`,
  },
  {
    id: 'm3-jury-07',
    moduleId: M3,
    theme: 'valorisation par les flux',
    themeEn: 'cash-flow valuation',
    difficulte: 3,
    question: 'La valeur terminale pèse 80 % de votre DCF : est-ce un problème ?',
    questionEn: 'The terminal value accounts for 80% of your DCF: is that a problem?',
    plan: [
      "Dédramatiser : 60 à 80 %, c'est la norme d'un DCF réel",
      "Chiffrer sur l'exemple du cours : 1 126,97 sur 1 399,70, soit 80,5 %",
      'Identifier le vrai problème : deux hypothèses perpétuelles invérifiables',
      'La réponse professionnelle : matrice de sensibilité, pas un chiffre unique',
    ],
    planEn: [
      'Defuse first: 60 to 80% is the norm in a real DCF',
      'Quantify on the course example: 1,126.97 out of 1,399.70, i.e. 80.5%',
      'Identify the real problem: two unverifiable perpetual assumptions',
      'The professional answer: a sensitivity matrix, not a single number',
    ],
    pointsAttendus: [
      "L'exemple : FCF de 100, 110, 121, WACC 10 %, VT de 1 500 en année 3 → total 1 399,70, dont VA(VT) = 1 500/1,1³ = 1 126,97, soit 80,5 %",
      "Un poids de 60 à 80 % est courant : la VT capture toute la queue infinie des flux — c'est mathématiquement normal, pas une erreur de calcul",
      'Le vrai problème : la VT se résume à une croissance perpétuelle et un taux, invérifiables, auxquels la valeur réagit de façon explosive — la sensibilité de Gordon',
      "Les deux fautes techniques à vérifier : la VT se construit sur le flux suivant la date d'évaluation (D₄, pas D₃) et doit être actualisée — elle est exprimée en euros de l'année 3",
      "La présentation honnête : un DCF n'est jamais « la » valeur, c'est une transformation d'hypothèses en prix — matrice de sensibilité croisant WACC et croissance terminale",
    ],
    pointsAttendusEn: [
      'The example: FCF of 100, 110, 121, 10% WACC, a TV of 1,500 in year 3 → total 1,399.70, of which PV(TV) = 1,500/1.1³ = 1,126.97, i.e. 80.5%',
      'A 60-to-80% weight is common: the TV captures the entire infinite tail of flows — mathematically normal, not a computation error',
      'The real problem: the TV boils down to a perpetual growth rate and a discount rate, unverifiable, to which the value reacts explosively — Gordon’s sensitivity',
      'The two technical faults to check: the TV is built on the flow following the valuation date (D₄, not D₃) and must be discounted — it is expressed in year-3 euros',
      'The honest presentation: a DCF is never “the” value, it is a transformation of assumptions into a price — a sensitivity matrix crossing WACC and terminal growth',
    ],
    bonus: [
      'Le même déséquilibre dans le DDM deux étapes du cours : 35,92 sur 42,15, soit 85 % — les trois dividendes explicites ne pèsent que 6,22 €',
      "Allonger l'horizon explicite ne résout rien sur le fond : on déplace les mêmes hypothèses invérifiables dans des flux « explicites » tout aussi projetés",
    ],
    bonusEn: [
      'The same imbalance in the course two-stage DDM: 35.92 out of 42.15, i.e. 85% — the three explicit dividends weigh only €6.22',
      'Lengthening the explicit horizon solves nothing fundamental: it shifts the same unverifiable assumptions into “explicit” flows that are just as projected',
    ],
    reponseModele: `Ma première réponse est de dédramatiser : dans un DCF réel, la valeur terminale pèse couramment **60 à 80 %** de la valeur totale. L'exemple du cours le montre : FCF de 100, 110 et 121, WACC de 10 %, valeur terminale de 1 500 en année 3 — total 1 399,70, dont 1 126,97 pour la VT actualisée, soit 80,5 %. Et dans le DDM en deux étapes, c'est pire : 35,92 sur 42,15, 85 %. Ce déséquilibre est mathématiquement normal : la VT capture toute la queue infinie des flux. Ce n'est pas une erreur de calcul.

Le vrai problème est ailleurs : ces 80 % reposent sur **deux paramètres invérifiables** — une croissance perpétuelle et un taux d'actualisation — auxquels la valeur réagit de façon explosive, exactement comme dans Gordon. Autrement dit, l'essentiel de mon chiffre dépend des hypothèses que je connais le moins bien.

Avant de discuter philosophie, je vérifie la technique, car deux fautes coûtent l'exercice : la VT doit être construite sur le flux *suivant* la date d'évaluation — D₄, pas D₃ — et elle doit être actualisée, puisqu'elle est exprimée en euros de l'année 3.

La réponse professionnelle, ensuite : un DCF n'est jamais « la » valeur, c'est une transformation d'hypothèses en prix. Sa sortie vaut ce que valent ses entrées. Je le présente donc en matrice de sensibilité croisant WACC et croissance terminale, jamais en chiffre unique. Et j'ajoute qu'allonger l'horizon explicite ne résout rien : on déplace les mêmes hypothèses invérifiables un peu plus loin dans le tableau.`,
    reponseModeleEn: `My first answer is to defuse: in a real DCF, the terminal value routinely accounts for **60 to 80%** of total value. The course example shows it: FCF of 100, 110 and 121, a 10% WACC, a terminal value of 1,500 in year 3 — total 1,399.70, of which 1,126.97 for the discounted TV, i.e. 80.5%. And in the two-stage DDM it is worse: 35.92 out of 42.15, 85%. That imbalance is mathematically normal: the TV captures the entire infinite tail of the flows. It is not a computation error.

The real problem lies elsewhere: those 80% rest on **two unverifiable parameters** — a perpetual growth rate and a discount rate — to which the value reacts explosively, exactly as in Gordon. In other words, the bulk of my figure depends on the assumptions I know least well.

Before any philosophy, I check the technique, because two faults fail the exercise: the TV must be built on the flow *following* the valuation date — D₄, not D₃ — and it must be discounted, since it is expressed in year-3 euros.

Then the professional answer: a DCF is never “the” value, it is a transformation of assumptions into a price. Its output is worth what its inputs are worth. So I present it as a sensitivity matrix crossing WACC and terminal growth, never as a single number. And I add that lengthening the explicit horizon solves nothing: it merely pushes the same unverifiable assumptions a little further down the table.`,
  },
  {
    id: 'm3-jury-08',
    moduleId: M3,
    theme: 'multiples',
    themeEn: 'multiples',
    difficulte: 2,
    question: 'PER de 12 contre PER de 25 : que comparez-vous vraiment ?',
    questionEn: 'A P/E of 12 versus a P/E of 25: what are you really comparing?',
    plan: [
      'Définir : PER = cours/BPA, des années de bénéfice',
      'Les trois moteurs : croissance, qualité des profits, niveau des taux',
      'La passerelle : PER = d(1+g)/(r−g), un DCF compressé',
      'Conclure : on compare des hypothèses implicites, pas des étiquettes de prix',
    ],
    planEn: [
      'Define: P/E = price/EPS, years of earnings',
      'The three drivers: growth, quality of profits, level of rates',
      'The bridge: P/E = d(1+g)/(r−g), a compressed DCF',
      'Conclude: you compare implicit assumptions, not price tags',
    ],
    pointsAttendus: [
      "PER = cours/BPA : à 12, on paie douze années du bénéfice courant ; à 25, vingt-cinq — l'inverse, le rendement bénéficiaire (8,3 % contre 4 %), se compare directement à un taux obligataire",
      "Moteur 1, la croissance attendue : payer 30 fois un bénéfice qui doublera en cinq ans peut revenir moins cher que payer 10 fois un bénéfice qui s'érode",
      'Moteur 2, la qualité et la visibilité : des revenus récurrents et des marges défendues méritent un multiple supérieur à des profits volatils et concurrencés',
      "Moteur 3, les taux : quand ils baissent, les flux lointains gagnent de la valeur actuelle et les PER se dilatent — un PER de 25 ne se lit pas pareil à 1 % ou à 5 % de taux sans risque",
      "La formule qui distingue : PER théorique = d(1+g)/(r−g) — 0,60 × 1,03/0,05 = 12,36 ; à r = 7 %, 15,45 — payer 25 fois les bénéfices, c'est acheter implicitement un couple (r, g)",
      "Donc PER 12 contre 25 : on ne compare pas un titre « cher » à un « bon marché », on compare deux jeux d'hypothèses de croissance, de risque et de taux",
    ],
    pointsAttendusEn: [
      'P/E = price/EPS: at 12 you pay twelve years of current earnings; at 25, twenty-five — the inverse, the earnings yield (8.3% versus 4%), compares directly with a bond yield',
      'Driver 1, expected growth: paying 30 times earnings that will double in five years can be cheaper than paying 10 times earnings that are eroding',
      'Driver 2, quality and visibility: recurring revenues and defended margins deserve a higher multiple than volatile, contested profits',
      'Driver 3, rates: when they fall, distant flows gain present value and P/E ratios dilate — a P/E of 25 does not read the same at a 1% or a 5% risk-free rate',
      'The distinguishing formula: theoretical P/E = d(1+g)/(r−g) — 0.60 × 1.03/0.05 = 12.36; at r = 7%, 15.45 — paying 25 times earnings means implicitly buying an (r, g) pair',
      'So P/E 12 versus 25: you are not comparing an “expensive” stock with a “cheap” one, you are comparing two sets of growth, risk and rate assumptions',
    ],
    bonus: [
      "Les deux limites d'usage : le BPA est manipulable — choix comptables, rachats d'actions qui gonflent le BPA sans que l'activité change — et le PER n'existe pas pour une société en perte",
      'La décennie 2010 à taux quasi nuls a dilaté les multiples ; la remontée brutale de 2022 les a comprimés, technologie en première ligne',
    ],
    bonusEn: [
      'The two usage limits: EPS is manipulable — accounting choices, share buybacks that inflate EPS without any change in the business — and the P/E does not exist for a loss-making company',
      'The near-zero-rate 2010s dilated multiples; the brutal 2022 rate rise compressed them, technology first in line',
    ],
    reponseModele: `Le PER divise le cours par le bénéfice par action : à 12, je paie douze années du bénéfice courant ; à 25, vingt-cinq. Son inverse, le rendement bénéficiaire — 8,3 % contre 4 % —, se compare directement à un taux obligataire. Mais conclure « 12 est bon marché, 25 est cher » serait le contresens même : un PER ne se juge jamais dans l'absolu.

Trois moteurs le font varier. La **croissance attendue** : payer 30 fois un bénéfice qui doublera en cinq ans peut revenir moins cher que payer 10 fois un bénéfice qui s'érode. La **qualité et la visibilité des profits** : des revenus récurrents et des marges défendues méritent plus que des profits volatils. Le **niveau des taux**, enfin : une action est une somme de bénéfices futurs actualisés — quand les taux baissent, les flux lointains gagnent de la valeur actuelle et les PER se dilatent, à commencer par ceux des valeurs de croissance, les « obligations longues » de la cote. Un PER de 25 ne se lit pas pareil à 1 % ou à 5 % de taux sans risque.

La passerelle avec Gordon rend tout cela explicite : PER théorique = d(1+g)/(r−g). Avec d = 60 %, g = 3 %, r = 8 % : 12,36. Baissez r à 7 % : 15,45 — un quart de multiple pour cent points de base.

Donc, quand je compare un PER de 12 à un PER de 25, je ne compare pas deux étiquettes de prix : je compare deux couples (r, g) implicites — deux jeux d'hypothèses de croissance, de risque et de taux. Un multiple est un DCF compressé dont on a caché les hypothèses ; savoir les expliciter, c'est toute la différence.`,
    reponseModeleEn: `The P/E divides the price by earnings per share: at 12, I pay twelve years of current earnings; at 25, twenty-five. Its inverse, the earnings yield — 8.3% versus 4% — compares directly with a bond yield. But concluding “12 is cheap, 25 is expensive” would be the very misreading to avoid: a P/E is never judged in isolation.

Three drivers move it. **Expected growth**: paying 30 times earnings that will double in five years can be cheaper than paying 10 times earnings that are eroding. **Quality and visibility of profits**: recurring revenues and defended margins deserve more than volatile profits. **The level of rates**, finally: a share is a sum of discounted future earnings — when rates fall, distant flows gain present value and P/E ratios dilate, starting with growth stocks, the long bonds of the equity market. A P/E of 25 does not read the same at a 1% or a 5% risk-free rate.

The bridge with Gordon makes all this explicit: theoretical P/E = d(1+g)/(r−g). With d = 60%, g = 3%, r = 8%: 12.36. Lower r to 7%: 15.45 — a quarter of a multiple for a hundred basis points.

So when I compare a P/E of 12 with a P/E of 25, I am not comparing two price tags: I am comparing two implicit (r, g) pairs — two sets of growth, risk and rate assumptions. A multiple is a compressed DCF with its assumptions hidden; knowing how to spell them out makes all the difference.`,
  },
  {
    id: 'm3-jury-09',
    moduleId: M3,
    theme: 'multiples',
    themeEn: 'multiples',
    difficulte: 2,
    question: 'Pourquoi préférer EV/EBITDA au PER ?',
    questionEn: 'Why prefer EV/EBITDA to the P/E?',
    plan: [
      'Le défaut de construction du PER : un résultat mesuré après la structure financière',
      "La cohérence d'EV/EBITDA : prix de tous les capitaux sur profit de tous les bailleurs",
      "L'exemple chiffré : (900 + 300)/200 = 6",
      'Les trois usages, et le garde-fou',
    ],
    planEn: [
      'The P/E construction flaw: a result measured after the financing structure',
      'The EV/EBITDA coherence: the price of all capital over the profit that pays all providers',
      'The worked example: (900 + 300)/200 = 6',
      'The three use cases, and the safeguard',
    ],
    pointsAttendus: [
      'Le bénéfice net se mesure après frais financiers : deux jumelles industrielles à leviers différents affichent des PER non comparables',
      "EV = capitalisation + dette nette : le prix de la totalité de l'outil économique — racheter les actions et reprendre la dette ; une trésorerie nette diminue l'EV",
      "L'EBITDA se mesure avant frais financiers : il revient à l'ensemble des bailleurs de fonds, actionnaires comme créanciers — d'où la cohérence numérateur/dénominateur",
      "Exemple : 900 M€ de capitalisation, 300 M€ de dette nette, 200 M€ d'EBITDA → EV/EBITDA = 1 200/200 = 6 fois",
      'Trois usages privilégiés : secteurs capitalistiques aux amortissements massifs, comparaisons internationales (normes et fiscalité), LBO et private equity',
      "Le garde-fou : l'EBITDA ignore les investissements de maintien — un bel EV/EBITDA peut décorer une machine à consommer du capital",
    ],
    pointsAttendusEn: [
      'Net income is measured after financial expenses: two operational twins with different leverage show non-comparable P/Es',
      'EV = market cap + net debt: the price of the entire economic tool — buying all the shares and taking over the debt; net cash reduces the EV',
      'EBITDA is measured before financial expenses: it accrues to all capital providers, shareholders and creditors alike — hence the numerator/denominator coherence',
      'Example: €900m market cap, €300m net debt, €200m EBITDA → EV/EBITDA = 1,200/200 = 6 times',
      'Three preferred uses: capital-intensive sectors with massive depreciation, cross-border comparisons (accounting standards and tax), LBOs and private equity',
      'The safeguard: EBITDA ignores maintenance capex — a flattering EV/EBITDA can decorate a capital-eating machine',
    ],
    bonus: [
      "Les deux erreurs types au calcul : diviser la seule capitalisation par l'EBITDA (4,5) ou retrancher la dette au lieu de l'ajouter (3,0)",
      'Le réflexe hérité du chapitre 1 : au mot « capitalisation », toujours demander où est passée la dette',
    ],
    bonusEn: [
      'The two standard calculation errors: dividing the market cap alone by EBITDA (4.5) or subtracting the debt instead of adding it (3.0)',
      'The reflex inherited from chapter 1: at the word “market cap”, always ask where the debt went',
    ],
    reponseModele: `Parce que le PER a un défaut de construction : le bénéfice net arrive **après** les frais financiers, donc après la structure d'endettement. Prenez deux jumelles industrielles — mêmes usines, mêmes marges opérationnelles —, l'une sans dette, l'autre lourdement endettée. La seconde paie des intérêts : son résultat net est plus faible et plus risqué, et leurs PER ne sont plus comparables. Pour comparer leurs outils économiques, il faut monter d'un étage : valoriser l'entreprise entière, pas seulement la part des actionnaires.

C'est exactement ce que fait EV/EBITDA, et sa cohérence est sa force. Au numérateur, la **valeur d'entreprise** : capitalisation plus dette nette — le prix que débourserait un acquéreur qui rachète toutes les actions et reprend la dette ; une trésorerie nette la diminue d'autant. Au dénominateur, l'**EBITDA**, mesuré avant les frais financiers : il revient à l'ensemble des bailleurs de fonds, actionnaires comme créanciers. Le prix de tous les capitaux, sur le profit qui les rémunère tous.

L'exemple chiffré : 900 M€ de capitalisation, 300 M€ de dette nette, 200 M€ d'EBITDA — EV de 1 200 M€, soit **6 fois** l'EBITDA, quelle que soit la façon dont la société se finance. Les deux erreurs types : oublier la dette (4,5) ou la soustraire (3,0).

Quand le préférer ? Trois situations : les secteurs capitalistiques, où des amortissements massifs écrasent le résultat net ; les comparaisons internationales, l'EBITDA étant moins déformé par les normes et la fiscalité ; et le private equity — les LBO se négocient en multiples d'EBITDA. Un garde-fou pour finir : l'EBITDA ignore les investissements de maintien — un beau multiple peut décorer une machine à consommer du capital.`,
    reponseModeleEn: `Because the P/E has a construction flaw: net income comes **after** financial expenses, hence after the debt structure. Take two industrial twins — same plants, same operating margins — one debt-free, the other heavily levered. The second pays interest: its net income is lower and riskier, and their P/Es are no longer comparable. To compare their economic tools, you must move one floor up: value the whole enterprise, not just the shareholders' slice.

That is exactly what EV/EBITDA does, and its coherence is its strength. In the numerator, **enterprise value**: market cap plus net debt — the price an acquirer would pay to buy all the shares and take over the debt; net cash reduces it accordingly. In the denominator, **EBITDA**, measured before financial expenses: it accrues to all providers of capital, shareholders and creditors alike. The price of all the capital, over the profit that pays all of it.

The worked example: €900m of market cap, €300m of net debt, €200m of EBITDA — an EV of €1,200m, i.e. **6 times** EBITDA, however the company chooses to finance itself. The two standard errors: forgetting the debt (4.5) or subtracting it (3.0).

When to prefer it? Three situations: capital-intensive sectors, where massive depreciation crushes net income; cross-border comparisons, EBITDA being less distorted by accounting standards and tax; and private equity — LBOs are negotiated in EBITDA multiples. One safeguard to close: EBITDA ignores maintenance capex — a flattering multiple can decorate a capital-eating machine.`,
  },
  {
    id: 'm3-jury-10',
    moduleId: M3,
    theme: 'multiples',
    themeEn: 'multiples',
    difficulte: 3,
    question: 'Un armateur affiche un PER de 4 au pic du cycle : une affaire ?',
    questionEn: 'A shipping company shows a P/E of 4 at the peak of the cycle: a bargain?',
    plan: [
      'Le constat : un PER de 4 ou 5 au pic paraît un cadeau',
      "L'explication : le marché anticipe la retombée des bénéfices",
      'Le retournement : le dénominateur fond, le PER explose',
      "L'adage du gérant et la règle de lecture générale",
    ],
    planEn: [
      'The observation: a P/E of 4 or 5 at the peak looks like a gift',
      'The explanation: the market is pricing in the earnings decline',
      'The turn: the denominator melts, the P/E explodes',
      'The sector manager’s adage and the general reading rule',
    ],
    pointsAttendus: [
      'Les secteurs concernés : sidérurgie, transport maritime, semi-conducteurs, matières premières — partout où les bénéfices suivent un cycle',
      'Au sommet du cycle, les bénéfices sont gonflés : le PER paraît dérisoire précisément parce que le marché refuse de payer cher des profits jugés insoutenables',
      "Quand le cycle se retourne, le dénominateur fond : le PER recalculé explose et l'action « pas chère » a perdu 40 %",
      "L'adage des gérants sectoriels : un cyclique s'achète quand son PER est élevé (bénéfices au creux) et se vend quand son PER est bas (bénéfices au pic)",
      "La règle générale : lire le PER d'un cyclique sans situer la position dans le cycle est le contresens classique en entretien — le multiple suppose un bénéfice représentatif",
    ],
    pointsAttendusEn: [
      'The sectors concerned: steel, shipping, semiconductors, commodities — wherever earnings follow a cycle',
      'At the top of the cycle, earnings are inflated: the P/E looks derisory precisely because the market refuses to pay up for profits it deems unsustainable',
      'When the cycle turns, the denominator melts: the recomputed P/E explodes and the “cheap” stock has lost 40%',
      'The sector managers’ adage: a cyclical is bought when its P/E is high (earnings at the trough) and sold when its P/E is low (earnings at the peak)',
      'The general rule: reading a cyclical’s P/E without locating the position in the cycle is the classic interview misreading — a multiple assumes a representative earnings figure',
    ],
    bonus: [
      'Le symétrique sur le rendement du dividende : un rendement très supérieur au secteur signale rarement une aubaine — le cours a déjà chuté parce que le marché juge le dividende condamné',
      "L'autre bout du même problème : au creux, la société est souvent en perte et le PER n'existe plus — le dénominateur cyclique rend le multiple muet ou menteur",
    ],
    bonusEn: [
      'The dividend-yield mirror image: a yield far above the sector rarely signals a bargain — the price has already fallen because the market deems the dividend doomed',
      'The other end of the same problem: at the trough the company is often loss-making and the P/E no longer exists — a cyclical denominator makes the multiple mute or mendacious',
    ],
    reponseModele: `Presque jamais — et c'est précisément le piège. Dans les secteurs cycliques — sidérurgie, transport maritime, semi-conducteurs, matières premières —, le PER se lit **à l'envers**.

Au sommet d'un cycle de fret exceptionnel, les bénéfices de mon armateur sont gonflés : le dénominateur du PER est au plus haut, donc le ratio paraît dérisoire — 4 fois des profits records. Mais ce n'est pas un cadeau du marché : c'est un message. Si le marché acceptait de payer ces bénéfices au multiple habituel, le titre coterait deux ou trois fois plus haut. S'il refuse, c'est qu'il anticipe la retombée : des profits records dans un secteur cyclique ne sont pas soutenables, et il les paie en conséquence.

La suite est mécanique : le cycle se retourne, les bénéfices fondent, et le PER recalculé sur les nouveaux profits explose — pendant que l'action « pas chère » a perdu 40 %. D'où l'adage des gérants sectoriels, volontairement provocateur : un cyclique s'**achète** quand son PER est élevé — bénéfices au creux — et se **vend** quand son PER est bas — bénéfices au pic.

La leçon dépasse le cas d'espèce : un multiple n'a de sens que si son dénominateur est représentatif. Lire le PER d'un cyclique sans situer la position dans le cycle est le contresens classique en entretien. Et le symétrique existe côté rendement : un dividende très supérieur à celui du secteur signale rarement une aubaine — le plus souvent, le cours a déjà chuté parce que le marché juge ce dividende condamné, et le rendement affiché vit ses derniers mois.`,
    reponseModeleEn: `Almost never — and that is precisely the trap. In cyclical sectors — steel, shipping, semiconductors, commodities — the P/E reads **backwards**.

At the top of an exceptional freight cycle, my shipowner's earnings are inflated: the P/E denominator is at its highest, so the ratio looks derisory — 4 times record profits. But that is not a gift from the market: it is a message. If the market were willing to pay those earnings at the usual multiple, the stock would trade two or three times higher. If it refuses, it is because it anticipates the comedown: record profits in a cyclical sector are unsustainable, and it prices them accordingly.

What follows is mechanical: the cycle turns, earnings melt, and the P/E recomputed on the new profits explodes — while the “cheap” stock has lost 40%. Hence the sector managers' deliberately provocative adage: a cyclical is **bought** when its P/E is high — earnings at the trough — and **sold** when its P/E is low — earnings at the peak.

The lesson goes beyond the example: a multiple only makes sense if its denominator is representative. Reading a cyclical's P/E without locating the position in the cycle is the classic interview misreading. And the mirror image exists on the yield side: a dividend yield far above the sector's rarely signals a bargain — most often, the price has already fallen because the market deems that dividend doomed, and the displayed yield is living its final months.`,
  },
  {
    id: 'm3-jury-11',
    moduleId: M3,
    theme: 'indices',
    themeEn: 'indices',
    difficulte: 2,
    question: 'Dow Jones contre S&P 500 : la différence qui change tout ?',
    questionEn: 'Dow Jones versus S&P 500: the difference that changes everything?',
    plan: [
      'Deux univers proches, deux règles de pondération opposées',
      'Le Dow : pondéré par les prix, le fossile de 1896',
      'Le S&P 500 : capi flottante, la référence mondiale',
      'Pourquoi ça change tout : poids, splits, représentativité',
    ],
    planEn: [
      'Two similar universes, two opposite weighting rules',
      'The Dow: price-weighted, the fossil of 1896',
      'The S&P 500: float-adjusted cap, the global benchmark',
      'Why it changes everything: weights, splits, representativeness',
    ],
    pointsAttendus: [
      "Dow Jones : 30 grandes valeurs américaines pondérées par les prix — poids = cours/somme des cours, l'héritage de Charles Dow qui additionnait douze cours à la main en 1896",
      "Le vice : le niveau facial d'une action ne dit rien de la taille — une société de 16 Md€ dont l'action cote 800 € pèse seize fois plus qu'une de 100 Md€ à 50 €",
      "Un split redistribue les poids sans événement économique : dans l'exemple du cours, le poids du titre passe de 55,6 % à 38,5 % — et le diviseur du Dow, rapiécé depuis plus d'un siècle, est très inférieur à 1",
      "S&P 500 : environ 500 grandes capitalisations pondérées par la capi flottante, sélection par comité, de l'ordre de 80 % de la capitalisation boursière américaine",
      'Verdict : le S&P mesure le poids boursier réellement négociable ; le Dow survit par habitude médiatique — la quasi-totalité des indices modernes pondèrent par la capi flottante',
    ],
    pointsAttendusEn: [
      'Dow Jones: 30 large US names, price-weighted — weight = price/sum of prices, the legacy of Charles Dow adding up twelve prices by hand in 1896',
      'The flaw: a share’s face price says nothing about size — a €16bn company whose share trades at €800 weighs sixteen times more than a €100bn one at €50',
      'A split redistributes the weights with no economic event: in the course example, the stock’s weight drops from 55.6% to 38.5% — and the Dow’s divisor, patched for over a century, is now well below 1',
      'S&P 500: about 500 large caps weighted by float-adjusted capitalisation, committee selection, on the order of 80% of US market capitalisation',
      'Verdict: the S&P measures the genuinely tradable market weight; the Dow survives by media habit — virtually all modern indices weight by float-adjusted cap',
    ],
    bonus: [
      'Dans un indice capi-pondéré, un split ne demande aucun ajustement : cours divisé, titres multipliés, capitalisation inchangée',
      "Le principe de continuité du diviseur : D' = D × capi après/avant — l'indice ne doit bouger que quand les prix bougent, jamais parce que sa composition change",
    ],
    bonusEn: [
      'In a cap-weighted index a split requires no adjustment: price divided, share count multiplied, capitalisation unchanged',
      'The divisor continuity principle: D′ = D × cap after/before — the index must only move when prices move, never because its composition changes',
    ],
    reponseModele: `La différence n'est pas la liste des valeurs, c'est la **règle de pondération** — et elle change tout.

Le Dow Jones est pondéré par les prix : le poids de chaque valeur est son cours divisé par la somme des cours. C'est l'héritage direct de Charles Dow qui, en 1896, additionnait à la main les cours de douze sociétés et divisait par douze. Le vice est structurel : le niveau facial d'une action ne dit **rien** de la taille de l'entreprise. Une société de 16 milliards dont l'action cote 800 € pèse seize fois plus qu'un géant de 100 milliards dont l'action cote 50 €. Pire : un simple split — un non-événement économique — redistribue les poids ; dans l'exemple du cours, le titre passe de 55,6 % à 38,5 % de l'indice parce qu'il a divisé son nominal. Le diviseur du Dow, rapiécé opération après opération depuis plus d'un siècle, est aujourd'hui très inférieur à 1. C'est un fossile méthodologique, maintenu par la force de l'habitude médiatique.

Le S&P 500, lui, pondère ses quelque 500 valeurs par la **capitalisation flottante** : cours × nombre de titres × flottant. Le poids reflète la taille boursière réellement négociable — ce qu'un ETF peut effectivement acheter. Sélection par comité, environ 80 % de la capitalisation boursière américaine : c'est la référence mondiale, et la règle de la quasi-totalité des indices modernes. Un split n'y change rien : cours divisé, titres multipliés, capitalisation inchangée.

Verdict : le Dow, on le cite au journal télévisé ; le S&P 500, on le réplique avec des milliers de milliards. Quand on me demande ce qu'a fait le marché américain, ma réponse se lit sur le second.`,
    reponseModeleEn: `The difference is not the list of names, it is the **weighting rule** — and it changes everything.

The Dow Jones is price-weighted: each stock's weight is its price divided by the sum of prices. That is the direct legacy of Charles Dow who, in 1896, added up twelve prices by hand and divided by twelve. The flaw is structural: a share's face price says **nothing** about company size. A €16bn company whose share trades at €800 weighs sixteen times more than a €100bn giant trading at €50. Worse: a mere split — an economic non-event — redistributes the weights; in the course example, the stock drops from 55.6% to 38.5% of the index simply for splitting its shares. The Dow's divisor, patched deal after deal for over a century, is now well below 1. It is a methodological fossil, kept alive by media habit.

The S&P 500 weights its roughly 500 names by **float-adjusted capitalisation**: price × share count × free float. The weight reflects the genuinely tradable market size — what an ETF can actually buy. Committee selection, around 80% of US market capitalisation: it is the global benchmark, and the rule of virtually every modern index. A split changes nothing there: price divided, share count multiplied, capitalisation unchanged.

Verdict: the Dow gets quoted on the evening news; the S&P 500 gets replicated with trillions. When asked what the US market did, my answer reads off the second one.`,
  },
  {
    id: 'm3-jury-12',
    moduleId: M3,
    theme: 'indices',
    themeEn: 'indices',
    difficulte: 2,
    question: 'Pourquoi les indices pondèrent-ils par le flottant et non par la capitalisation totale ?',
    questionEn: 'Why do indices weight by free float rather than by total capitalisation?',
    plan: [
      'Définir le flottant : la part du capital réellement négociable',
      'Pourquoi exclure les blocs stables',
      "L'exemple emblématique : Hermès",
      'La boucle avec la réplication : un ETF achète du flottant',
    ],
    planEn: [
      'Define the free float: the genuinely tradable share of the capital',
      'Why stable blocks are excluded',
      'The emblematic example: Hermès',
      'The loop with replication: an ETF buys float',
    ],
    pointsAttendus: [
      "Le flottant exclut les blocs qui ne se négocient pas : participation de l'État, familles fondatrices, autocontrôle, participations croisées",
      'Pondérer par la capitalisation totale donnerait des poids sans rapport avec ce que les flux indiciels peuvent réellement acheter',
      "Un ETF qui réplique l'indice achète des titres sur le marché : il ne peut acheter que ce qui flotte — pondérer hors flottant forcerait les flux sur une fraction étroite du capital",
      'Le cas emblématique : Hermès, contrôlée aux environs des deux tiers par la famille fondatrice — son poids dans le CAC 40 est très inférieur à ce que sa capitalisation totale suggérerait',
      'Bien distinguer les deux usages : la capitalisation boursière se calcule sur la totalité des titres émis ; le flottant sert à pondérer les indices',
    ],
    pointsAttendusEn: [
      'The float excludes blocks that do not trade: state holdings, founding families, treasury shares, cross-shareholdings',
      'Weighting by total capitalisation would give weights unrelated to what index flows can actually buy',
      'An ETF replicating the index buys shares in the market: it can only buy what floats — weighting beyond the float would force the flows onto a narrow fraction of the capital',
      'The emblematic case: Hermès, roughly two-thirds controlled by the founding family — its CAC 40 weight is far below what its total capitalisation would suggest',
      'Distinguish the two uses clearly: market capitalisation is computed on all shares issued; the float is what weights the indices',
    ],
    bonus: [
      "Chiffrer d'instinct : une société de 60 Md€ dont 55 % flottent ne compte que pour 33 Md€ dans l'indice",
      'La capi flottante est la règle du CAC 40, du S&P 500 et de la quasi-totalité des indices modernes',
    ],
    bonusEn: [
      'Quantify instinctively: a €60bn company with a 55% float only counts for €33bn in the index',
      'Float-adjusted cap is the rule for the CAC 40, the S&P 500 and virtually every modern index',
    ],
    reponseModele: `Parce qu'un indice moderne n'est pas seulement un thermomètre : c'est le sous-jacent de produits qui doivent **acheter** ce qu'il contient. Et l'on ne peut acheter que ce qui se vend.

Le flottant, c'est la part du capital réellement en circulation. En face, les blocs stables — participation de l'État, familles fondatrices, autocontrôle, participations croisées — ne se négocient pas : ils sont verrouillés dans des pactes et des stratégies de contrôle. Une capitalisation se calcule sur la **totalité** des titres émis ; mais seule la fraction flottante s'échange au quotidien.

Pondérer par la capitalisation totale donnerait donc des poids sans rapport avec la réalité négociable. Le cas d'école : un ETF qui réplique l'indice. Il achète des titres sur le marché — il ne peut acheter que du flottant. Si l'indice donnait à une société verrouillée un poids calculé sur sa capitalisation totale, les flux indiciels se précipiteraient sur une fraction étroite du capital, avec des effets de prix sans rapport avec l'économie.

L'exemple emblématique est Hermès : la famille fondatrice contrôle environ les deux tiers du capital, et son poids dans le CAC 40 est très inférieur à ce que sa capitalisation suggérerait. L'arithmétique se fait de tête : une société de 60 milliards dont 55 % flottent ne compte que pour 33 milliards dans l'indice.

C'est pourquoi le CAC 40, le S&P 500 et la quasi-totalité des indices modernes pondèrent par la capitalisation **flottante** : le poids doit refléter ce que les milliers de milliards qui suivent mécaniquement ces formules peuvent effectivement détenir.`,
    reponseModeleEn: `Because a modern index is not just a thermometer: it is the underlying of products that must **buy** what it contains. And you can only buy what is for sale.

The free float is the share of the capital genuinely in circulation. On the other side, the stable blocks — state holdings, founding families, treasury shares, cross-shareholdings — do not trade: they are locked into pacts and control strategies. A market capitalisation is computed on **all** the shares issued; but only the floating fraction changes hands daily.

Weighting by total capitalisation would therefore produce weights unrelated to tradable reality. The textbook case: an ETF replicating the index. It buys shares in the market — it can only buy float. If the index gave a locked-up company a weight computed on its total capitalisation, index flows would pile onto a narrow fraction of the capital, with price effects unrelated to the economics.

The emblematic example is Hermès: the founding family controls roughly two-thirds of the capital, and its weight in the CAC 40 is far below what its capitalisation would suggest. The arithmetic can be done in your head: a €60bn company with a 55% float only counts for €33bn in the index.

That is why the CAC 40, the S&P 500 and virtually every modern index weight by **float-adjusted** capitalisation: the weight must reflect what the trillions that mechanically track these formulas can actually hold.`,
  },
  {
    id: 'm3-jury-13',
    moduleId: M3,
    theme: 'indices',
    themeEn: 'indices',
    difficulte: 1,
    question: 'CAC 40 ou CAC 40 GR : lequel faut-il regarder ?',
    questionEn: 'CAC 40 or CAC 40 GR: which one should you look at?',
    plan: [
      'La distinction : indice prix contre indice de rendement total',
      'La mécanique : le détachement du dividende ampute l\'indice prix',
      "L'écart chiffré : environ 8 000 contre plus de 25 000, depuis la même base 1 000",
      "Lequel regarder selon l'usage",
    ],
    planEn: [
      'The distinction: price index versus total return index',
      'The mechanics: dividend detachment cuts into the price index',
      'The quantified gap: about 8,000 versus over 25,000, from the same base of 1,000',
      'Which one to watch, depending on the use',
    ],
    pointsAttendus: [
      "Le CAC 40 cité par la presse est un indice prix : au détachement d'un dividende, le cours baisse mécaniquement et l'indice encaisse la baisse sans jamais créditer le dividende",
      'Le CAC 40 GR (gross return) réinvestit chaque dividende brut ; la version NR (net return, dividendes nets de retenue à la source) est la référence contractuelle de la plupart des ETF',
      'Même base 1 000 fin 1987 : début 2026, environ 8 000 points pour le CAC 40 prix, plus de 25 000 pour le GR — plus de trois fois plus haut',
      "L'ordre de grandeur de tête : un rendement du dividende moyen d'environ 3 % par an, capitalisé sur près de quarante ans, multiplie la mise par plus de trois à lui seul",
      "Pour mesurer l'expérience réelle d'un épargnant, le GR ou le NR : sur longue période, les dividendes réinvestis représentent de l'ordre de la moitié du rendement total des actions",
    ],
    pointsAttendusEn: [
      'The CAC 40 quoted in the press is a price index: when a dividend is detached, the share price drops mechanically and the index takes the hit without ever crediting the dividend',
      'The CAC 40 GR (gross return) reinvests every gross dividend; the NR version (net return, dividends net of withholding tax) is the contractual benchmark of most ETFs',
      'Same base of 1,000 at the end of 1987: in early 2026, around 8,000 points for the price CAC 40, over 25,000 for the GR — more than three times higher',
      'The mental order of magnitude: an average dividend yield of about 3% a year, compounded over nearly forty years, multiplies the stake by more than three on its own',
      'To measure a saver’s actual experience, the GR or the NR: over the long run, reinvested dividends account for roughly half of the total return on equities',
    ],
    bonus: [
      'Le piège classique : « le DAX écrase le CAC » — le DAX est un indice de rendement total, l\'exception notable parmi les grands indices ; la comparaison honnête est CAC 40 GR contre DAX, ou prix contre prix',
      'Réflexe général : tout graphique, backtest ou plaquette qui compare des indices sans préciser prix ou TR doit immédiatement éveiller le soupçon',
    ],
    bonusEn: [
      'The classic trap: “the DAX crushes the CAC” — the DAX is a total return index, the notable exception among major indices; the honest comparison is CAC 40 GR versus DAX, or price versus price',
      'General reflex: any chart, backtest or sales brochure comparing indices without specifying price or TR should immediately raise suspicion',
    ],
    reponseModele: `Cela dépend de la question posée — mais pour juger un placement, c'est le GR, et l'écart est spectaculaire.

Le CAC 40 que cite la presse est un indice **prix** : quand une société détache son dividende, son cours baisse mécaniquement du montant détaché, et l'indice encaisse la baisse sans jamais créditer le dividende en face. Année après année, il « perd » donc le rendement du dividende. Sa version **rendement total**, le CAC 40 GR, réinvestit chaque dividende brut dans l'indice — il existe aussi en version NR, dividendes nets de retenue à la source, qui est la référence contractuelle de la plupart des ETF.

L'écart se mesure : les deux indices partent de la même base, 1 000 points fin 1987. Début 2026, le CAC 40 prix évolue autour de 8 000 points ; le CAC 40 GR en dépasse 25 000 — plus de trois fois plus haut. Et l'ordre de grandeur se comprend de tête : un rendement du dividende moyen d'environ 3 % par an, capitalisé sur près de quarante ans, multiplie à lui seul la mise par plus de trois. Sur longue période, les dividendes réinvestis représentent de l'ordre de la moitié du rendement total des actions — la moitié que le journal télévisé ne montre jamais.

Donc : pour commenter la séance du jour, le CAC 40 prix suffit. Pour mesurer ce qu'a réellement gagné un épargnant, ou pour évaluer un fonds, il faut le GR ou le NR. Et le réflexe associé : toute comparaison d'indices qui ne précise pas « prix ou rendement total » est suspecte — comparer le CAC au DAX, qui réinvestit ses dividendes par défaut, est le piège de débutant le plus rentable à détecter.`,
    reponseModeleEn: `It depends on the question asked — but to judge an investment, it is the GR, and the gap is spectacular.

The CAC 40 quoted in the press is a **price** index: when a company detaches its dividend, its share price mechanically drops by the detached amount, and the index takes the hit without ever crediting the dividend on the other side. Year after year, it therefore "loses" the dividend yield. Its **total return** version, the CAC 40 GR, reinvests every gross dividend into the index — there is also an NR version, dividends net of withholding tax, which is the contractual benchmark of most ETFs.

The gap can be measured: both indices start from the same base, 1,000 points at the end of 1987. In early 2026, the price CAC 40 hovers around 8,000 points; the CAC 40 GR exceeds 25,000 — more than three times higher. And the order of magnitude can be grasped mentally: an average dividend yield of about 3% a year, compounded over nearly forty years, multiplies the stake by more than three on its own. Over the long run, reinvested dividends account for roughly half of the total return on equities — the half the evening news never shows.

So: to comment on today's session, the price CAC 40 will do. To measure what a saver actually earned, or to evaluate a fund, you need the GR or the NR. And the associated reflex: any index comparison that does not specify price or total return is suspect — comparing the CAC with the DAX, which reinvests its dividends by default, is the most profitable beginner's mistake to catch.`,
  },
  {
    id: 'm3-jury-14',
    moduleId: M3,
    theme: 'indices',
    themeEn: 'indices',
    difficulte: 3,
    question: 'La concentration des indices est-elle un problème ?',
    questionEn: 'Is index concentration a problem?',
    plan: [
      'Le constat chiffré : le top 10 du S&P 500 à 35-40 % début 2026',
      'Le mécanisme : la capi-pondération suit le momentum des poids',
      'Ce que « diversifié » exige vraiment : des positions nombreuses ET peu corrélées',
      "Les correctifs, et la leçon : aucune pondération n'est neutre",
    ],
    planEn: [
      'The quantified observation: the S&P 500 top 10 at 35-40% in early 2026',
      'The mechanism: cap-weighting rides the momentum of weights',
      'What “diversified” really requires: positions that are numerous AND lowly correlated',
      'The fixes, and the lesson: no weighting scheme is neutral',
    ],
    pointsAttendus: [
      "Début 2026, les dix premières capitalisations du S&P 500 pèsent de l'ordre de 35 à 40 % de l'indice, contre environ 20 % au milieu des années 2010 — portées par les méga-capitalisations technologiques et le thème de l'IA",
      "La capi-pondération surpondère mécaniquement ce qui a déjà monté : plus un titre performe, plus son poids grossit, plus l'indice dépend de lui",
      "Un tracker S&P 500 « détient 500 sociétés », mais plus d'un tiers du portefeuille tient en dix lignes largement exposées au même facteur",
      'La diversification réduit le risque spécifique à condition que les positions soient nombreuses ET faiblement corrélées — le nombre de lignes ne suffit pas',
      "Les correctifs : plafond de 15 % par valeur au CAC 40, plafonnements périodiques du Nasdaq-100, versions équipondérées du S&P 500 — mais le fond demeure : aucune pondération n'est neutre, choisir un indice, c'est déjà choisir une stratégie",
    ],
    pointsAttendusEn: [
      'In early 2026, the ten largest S&P 500 capitalisations weigh on the order of 35 to 40% of the index, versus about 20% in the mid-2010s — driven by tech mega-caps and the AI theme',
      'Cap-weighting mechanically overweights what has already risen: the more a stock performs, the bigger its weight, the more the index depends on it',
      'An S&P 500 tracker “holds 500 companies”, but more than a third of the portfolio sits in ten lines largely exposed to the same factor',
      'Diversification reduces specific risk only if positions are numerous AND lowly correlated — the number of lines is not enough',
      'The fixes: a 15% per-stock cap in the CAC 40, periodic Nasdaq-100 cappings, equal-weighted versions of the S&P 500 — but the core remains: no weighting is neutral, choosing an index is already choosing a strategy',
    ],
    bonus: [
      "Compléter le triptyque : capi-pondérer, c'est suivre le momentum des poids ; équipondérer, c'est rééquilibrer en vendant les gagnants — simple mais coûteux en transactions ; pondérer par les prix, c'est ne rien mesurer du tout",
      "L'argument se retourne en entretien : la concentration n'est pas une anomalie de calcul, elle reflète la hiérarchie réelle des capitalisations — le problème est le risque factoriel, pas la formule",
    ],
    bonusEn: [
      'Complete the triptych: cap-weighting rides the momentum of weights; equal-weighting rebalances by selling the winners — simple but costly in transactions; price-weighting measures nothing at all',
      'The argument can be turned around in an interview: concentration is not a calculation anomaly, it reflects the actual hierarchy of capitalisations — the problem is the factor risk, not the formula',
    ],
    reponseModele: `Le constat d'abord : début 2026, les dix premières capitalisations du S&P 500 pèsent de l'ordre de **35 à 40 %** de l'indice, contre environ 20 % au milieu des années 2010 — une concentration portée par les méga-capitalisations technologiques et le thème de l'intelligence artificielle.

Est-ce un problème ? Oui, pour ce que le mot « diversifié » fait croire. Un épargnant qui détient un tracker S&P 500 « possède 500 sociétés » — mais plus d'un tiers de son portefeuille tient en dix lignes largement exposées au même facteur. Or la diversification réduit le risque spécifique à une double condition : des positions nombreuses **et** faiblement corrélées. Le nombre de lignes ne suffit pas ; dix méga-capitalisations sur le même thème ne remplissent pas la seconde condition.

Le mécanisme est structurel, pas accidentel : la capi-pondération surpondère ce qui a déjà monté. Plus un titre performe, plus son poids grossit, plus l'indice dépend de lui — capi-pondérer, c'est suivre le momentum des poids. Les constructeurs le savent et corrigent à la marge : plafond de 15 % par valeur dans le CAC 40, plafonnements périodiques du Nasdaq-100, versions équipondérées du S&P 500 — lesquelles rééquilibrent en vendant les gagnants, au prix de transactions répétées.

Ma conclusion tient en une phrase du cours : **aucune pondération n'est neutre**. Capi-pondérer suit le momentum, équipondérer vend les gagnants, pondérer par les prix ne mesure rien. La concentration n'est donc pas un bug à réparer, c'est une propriété à connaître : choisir un indice, c'est déjà choisir une stratégie — et l'épargnant doit savoir laquelle il a choisie.`,
    reponseModeleEn: `The observation first: in early 2026, the ten largest capitalisations in the S&P 500 weigh on the order of **35 to 40%** of the index, versus about 20% in the mid-2010s — a concentration driven by tech mega-caps and the artificial intelligence theme.

Is it a problem? Yes, for what the word "diversified" leads people to believe. A saver holding an S&P 500 tracker "owns 500 companies" — but more than a third of the portfolio sits in ten lines largely exposed to the same factor. Diversification reduces specific risk under a double condition: positions that are numerous **and** lowly correlated. The number of lines is not enough; ten mega-caps on the same theme fail the second condition.

The mechanism is structural, not accidental: cap-weighting overweights what has already risen. The more a stock performs, the bigger its weight, the more the index depends on it — cap-weighting means riding the momentum of weights. Index providers know it and correct at the margin: a 15% per-stock cap in the CAC 40, periodic cappings of the Nasdaq-100, equal-weighted versions of the S&P 500 — which rebalance by selling the winners, at the cost of repeated transactions.

My conclusion fits in one line from the course: **no weighting scheme is neutral**. Cap-weighting rides momentum, equal-weighting sells the winners, price-weighting measures nothing. Concentration is therefore not a bug to fix but a property to know: choosing an index is already choosing a strategy — and the saver should know which one he has chosen.`,
  },
  {
    id: 'm3-jury-15',
    moduleId: M3,
    theme: 'vie du titre',
    themeEn: 'corporate actions',
    difficulte: 2,
    question: "Le dividende enrichit-il l'actionnaire le jour du détachement ?",
    questionEn: 'Does the dividend make the shareholder richer on the ex-date?',
    plan: [
      "Le calendrier en quatre dates, et celle qui compte : l'ex-date",
      "La mécanique de l'ajustement : P ex = P − D",
      'La neutralité : un transfert de poche, pas un enrichissement',
      'Le dividend capture, et pourquoi il détruit de la valeur',
    ],
    planEn: [
      'The four-date calendar, and the one that matters: the ex-date',
      'The adjustment mechanics: P ex = P − D',
      'Neutrality: a pocket-to-pocket transfer, not an enrichment',
      'Dividend capture, and why it destroys value',
    ],
    pointsAttendus: [
      "Quatre dates : annonce, détachement (ex-date), enregistrement (record date), paiement — la date économique est l'ex-date",
      "Au détachement, le cours s'ajuste mécaniquement : une action à 100 € qui détache 2,50 € vaut théoriquement 97,50 € — l'acheteur du jour n'a plus droit au dividende",
      "Le jour du détachement, l'actionnaire ne s'enrichit pas : il reçoit 2,50 € de cash et son titre vaut 2,50 € de moins — transfert de la poche « titre » vers la poche « espèces »",
      'Le dividend capture — acheter la veille, encaisser, revendre — ne crée rien sur le papier et détruit en pratique : frais de transaction et fiscalité du dividende s\'ajoutent à un gain théoriquement nul',
      "L'argument d'efficience : si une stratégie aussi simple rapportait, elle serait arbitrée depuis longtemps",
    ],
    pointsAttendusEn: [
      'Four dates: announcement, ex-date, record date, payment — the economic date is the ex-date',
      'On detachment the price adjusts mechanically: a €100 share detaching €2.50 is theoretically worth €97.50 — the day’s buyer no longer has a right to the dividend',
      'On the ex-date the shareholder is not richer: he receives €2.50 in cash and his share is worth €2.50 less — a transfer from the “share” pocket to the “cash” pocket',
      'Dividend capture — buying the day before, collecting, reselling — creates nothing on paper and destroys in practice: transaction costs and dividend taxation add to a theoretically nil gain',
      'The efficiency argument: if such a simple strategy paid, it would have been arbitraged away long ago',
    ],
    bonus: [
      "En pratique, le cours d'ouverture du jour ex s'écarte du niveau théorique — les flux du jour se superposent — mais c'est cette mécanique que chambres de compensation et fournisseurs d'indices appliquent",
      "La boucle avec les indices : c'est ce détachement jamais recrédité qui creuse l'écart entre CAC 40 prix et CAC 40 GR",
    ],
    bonusEn: [
      'In practice the ex-day opening price strays from the theoretical level — the day’s flows overlap — but that mechanic is what clearing houses and index providers apply',
      'The loop with indices: it is this never-recredited detachment that digs the gap between the price CAC 40 and the CAC 40 GR',
    ],
    reponseModele: `Non — et c'est l'un des contresens les plus répandus chez les particuliers. Posons d'abord le calendrier : un dividende suit quatre dates — l'annonce, le **détachement** (l'ex-date), l'enregistrement, le paiement. La date qui compte économiquement est l'ex-date : à partir de ce jour, acheter l'action ne donne plus droit au dividende.

La mécanique est implacable : le détenteur de la veille garde le droit au dividende, l'acheteur du jour ne l'a plus — le titre vaut donc, toutes choses égales par ailleurs, le dividende de moins. Une action à 100 € qui détache 2,50 € cote théoriquement 97,50 € : $P_{ex} = 100 - 2{,}50$. En pratique, le cours d'ouverture s'écarte un peu de ce niveau — les flux du jour se superposent —, mais c'est cette mécanique que les chambres de compensation et les fournisseurs d'indices appliquent.

Le bilan de l'actionnaire est donc **neutre** : il reçoit 2,50 € d'espèces, son titre vaut 2,50 € de moins. Le dividende ne l'enrichit pas le jour du détachement : c'est un transfert de la poche « titre » vers la poche « espèces ». L'enrichissement réel s'est joué ailleurs — dans les bénéfices que l'entreprise a dégagés.

D'où l'aberration du *dividend capture* : acheter la veille, encaisser le dividende, revendre aussitôt. Sur le papier, l'opération ne crée rien ; en pratique, elle détruit — les frais de transaction et la fiscalité du dividende s'ajoutent à un gain théoriquement nul. Et l'argument de fond : si une stratégie aussi simple rapportait, elle serait arbitrée depuis longtemps — c'est l'efficience en action.`,
    reponseModeleEn: `No — and it is one of the most widespread misconceptions among retail investors. Set the calendar first: a dividend follows four dates — announcement, **detachment** (the ex-date), record date, payment. The economically relevant date is the ex-date: from that day on, buying the share no longer entitles you to the dividend.

The mechanics are implacable: the previous day's holder keeps the right to the dividend, the day's buyer does not — so the share is worth, all else equal, the dividend less. A €100 share detaching €2.50 theoretically trades at €97.50: P ex = 100 − 2.50. In practice the opening price strays a little from that level — the day's flows overlap — but that mechanic is what clearing houses and index providers apply.

The shareholder's balance is therefore **neutral**: he receives €2.50 in cash, his share is worth €2.50 less. The dividend does not enrich him on the ex-date: it is a transfer from the "share" pocket to the "cash" pocket. The real enrichment happened elsewhere — in the earnings the company generated.

Hence the absurdity of dividend capture: buying the day before, collecting the dividend, reselling at once. On paper the operation creates nothing; in practice it destroys — transaction costs and dividend taxation pile onto a theoretically nil gain. And the deeper argument: if such a simple strategy paid, it would have been arbitraged away long ago — that is efficiency at work.`,
  },
  {
    id: 'm3-jury-16',
    moduleId: M3,
    theme: 'vie du titre',
    themeEn: 'corporate actions',
    difficulte: 1,
    question: 'Un split ne change rien économiquement : pourquoi le faire, alors ?',
    questionEn: 'A stock split changes nothing economically: why do it, then?',
    plan: [
      'La mécanique neutre : plus de parts, même gâteau',
      'Les trois vraies raisons : accès, psychologie, signal',
      'Le regroupement, message inverse',
      "La subtilité d'indice",
    ],
    planEn: [
      'The neutral mechanics: more slices, same cake',
      'The three real reasons: access, psychology, signal',
      'The reverse split, the opposite message',
      'The index subtlety',
    ],
    pointsAttendus: [
      'Un titre à 750 € divisé par 5 : cours à 150 €, cinq fois plus de titres, capitalisation strictement inchangée (7,5 Md€) — et le BPA divisé par 5 aussi',
      "Liquidité et accès : un cours maniable facilite les petits ordres — aux États-Unis, les options se traitent par lots de 100 actions, un cours à quatre chiffres ferme ce marché aux particuliers",
      'Psychologie : 150 € « paraît » plus abordable que 750 €, aussi irrationnel que ce soit ; signal : on ne divise que ce qui a beaucoup monté',
      'Les rituels récents : Apple divisée par 4 en 2020, Tesla par 5 puis par 3, Nvidia par 10 en 2024 — sans qu\'un euro de valeur soit créé',
      'Le regroupement (reverse split) porte le message inverse : échapper au statut de penny stock ou aux seuils de radiation — le split signale le succès, le regroupement souvent la détresse',
    ],
    pointsAttendusEn: [
      'A €750 share split 5-for-1: price at €150, five times more shares, capitalisation strictly unchanged (€7.5bn) — and EPS divided by 5 too',
      'Liquidity and access: a manageable price eases small orders — in the US, options trade in lots of 100 shares, a four-digit price shuts retail out of that market',
      'Psychology: €150 “feels” more affordable than €750, however irrational; signal: you only split what has risen a lot',
      'The recent rituals: Apple split 4-for-1 in 2020, Tesla 5-for-1 then 3-for-1, Nvidia 10-for-1 in 2024 — without one euro of value created',
      'The reverse split carries the opposite message: escaping penny-stock status or delisting thresholds — the split signals success, the reverse split often distress',
    ],
    bonus: [
      "Subtilité d'indice : neutre dans un indice capi-pondéré, mais un split réduit mécaniquement le poids du titre dans un indice pondéré par les prix comme le Dow",
      'Le piège de débutant à désamorcer : « 4 actions gratuites » — personne ne gagne rien, mêmes parts du même gâteau découpées plus fin',
    ],
    bonusEn: [
      'Index subtlety: neutral in a cap-weighted index, but a split mechanically reduces the stock’s weight in a price-weighted index like the Dow',
      'The beginner’s trap to defuse: “4 free shares” — nobody gains anything, the same slices of the same cake cut thinner',
    ],
    reponseModele: `D'abord, vérifions que rien ne change : un titre à 750 € qui se divise par cinq cote 150 €, le nombre d'actions est multiplié par cinq, la capitalisation reste à 7,5 milliards — et le BPA est divisé par cinq lui aussi, puisque le même bénéfice se répartit sur cinq fois plus de titres. Mêmes parts du même gâteau, découpées plus fin. L'actionnaire qui croit avoir reçu « quatre actions gratuites » n'a rien gagné du tout.

Pourquoi le faire, alors ? Trois raisons, toutes pratiques ou psychologiques — jamais économiques. La **liquidité et l'accès** : un cours maniable facilite les petits ordres ; et aux États-Unis, où les options se traitent par lots de 100 actions, un cours à quatre chiffres ferme ce marché aux particuliers. La **psychologie** : un titre à 150 € « paraît » plus abordable qu'à 750 €, aussi irrationnel que ce soit. Le **signal**, enfin : on ne divise que ce qui a beaucoup monté — annoncer un split, c'est rappeler la trajectoire. Les méga-capitalisations américaines en ont fait un rituel : Apple divisée par 4 en 2020, Tesla par 5 puis par 3, Nvidia par 10 en 2024.

Le **regroupement** — dix titres à 0,80 € deviennent un titre à 8 € — porte le message inverse : échapper au statut de penny stock ou aux seuils de radiation. Le split signale le succès ; le regroupement, souvent la détresse.

Et la subtilité qui montre la maîtrise : dans un indice capi-pondéré, un split ne demande aucun ajustement ; dans un indice pondéré par les prix comme le Dow Jones, il réduit mécaniquement le poids du titre — l'une des bizarreries de cette pondération archaïque.`,
    reponseModeleEn: `First, check that nothing changes: a €750 share split five-for-one trades at €150, the share count is multiplied by five, the capitalisation stays at €7.5bn — and EPS is divided by five as well, since the same earnings spread over five times more shares. Same slices of the same cake, cut thinner. The shareholder who believes he received "four free shares" has gained nothing at all.

Why do it, then? Three reasons, all practical or psychological — never economic. **Liquidity and access**: a manageable price eases small orders; and in the United States, where options trade in lots of 100 shares, a four-digit price shuts retail investors out of that market. **Psychology**: a €150 share "feels" more affordable than at €750, however irrational that is. **Signal**, finally: you only split what has risen a lot — announcing a split is a reminder of the trajectory. The US mega-caps have made it a ritual: Apple split 4-for-1 in 2020, Tesla 5-for-1 then 3-for-1, Nvidia 10-for-1 in 2024.

The **reverse split** — ten shares at €0.80 become one share at €8 — carries the opposite message: escaping penny-stock status or delisting thresholds. The split signals success; the reverse split, often distress.

And the subtlety that shows mastery: in a cap-weighted index, a split requires no adjustment; in a price-weighted index like the Dow Jones, it mechanically reduces the stock's weight — one of the quirks of that archaic weighting.`,
  },
  {
    id: 'm3-jury-17',
    moduleId: M3,
    theme: 'vie du titre',
    themeEn: 'corporate actions',
    difficulte: 3,
    question: 'Expliquez une augmentation de capital avec DPS à un particulier qui détient 400 actions.',
    questionEn: 'Explain a rights issue to a retail investor holding 400 shares.',
    plan: [
      'Poser le problème en langage simple : du papier neuf émis sous le cours dilue les anciens',
      'Le droit comme compensation : la mécanique du cours ex-droit',
      'Les trois options chiffrées : souscrire, vendre, ne rien faire',
      "La morale : un DPS s'exerce ou se vend, jamais ne s'oublie",
    ],
    planEn: [
      'State the problem in plain language: new paper issued below the price dilutes existing holders',
      'The right as compensation: the ex-rights price mechanics',
      'The three options with numbers: subscribe, sell, do nothing',
      'The moral: a right gets exercised or sold, never forgotten',
    ],
    pointsAttendus: [
      "L'exemple de référence : le titre cote 50 €, émission à 40 € à raison d'une action nouvelle pour quatre anciennes — le cours théorique ex-droit mélange 4 × 50 et 1 × 40 : 240/5 = 48 €",
      'Le DPS vaut la décote subie par le cours : (50 − 40)/(4 + 1) = 2 € — il matérialise la dilution et la rend négociable',
      'Option 1, souscrire : 400 droits donnent 100 actions nouvelles à 40 € (4 000 €) ; la ligne vaut 500 × 48 = 24 000 € — la mise initiale plus l\'apport, opération neutre',
      'Option 2, vendre les droits : 400 × 2 = 800 € encaissés, ligne à 400 × 48 = 19 200 € — total 20 000 €, neutre aussi',
      "Option 3, l'inertie : les droits expirent sans valeur, la ligne vaut 19 200 € — 800 € évaporés ; le seul perdant est celui qui ne fait rien",
    ],
    pointsAttendusEn: [
      'The reference example: the share trades at €50, issue at €40, one new share for four old ones — the theoretical ex-rights price mixes 4 × 50 and 1 × 40: 240/5 = €48',
      'The right is worth the discount the price suffers: (50 − 40)/(4 + 1) = €2 — it materialises the dilution and makes it tradable',
      'Option 1, subscribe: 400 rights buy 100 new shares at €40 (€4,000); the line is worth 500 × 48 = €24,000 — initial stake plus the contribution, a neutral operation',
      'Option 2, sell the rights: 400 × 2 = €800 cashed in, line at 400 × 48 = €19,200 — total €20,000, neutral as well',
      'Option 3, inertia: the rights expire worthless, the line is worth €19,200 — €800 evaporated; the only loser is the one who does nothing',
    ],
    bonus: [
      "Le contraste qui éclaire : le placement accéléré (ABB) sans droits — dans l'exemple du cours, environ 39 M€ transférés des anciens actionnaires vers les nouveaux entrants servis à 46 € un titre qui en vaut 49,61",
      "Certains intermédiaires vendent d'office les droits non exercés en fin de période — un filet de sécurité, pas une raison de ne pas comprendre la mécanique",
    ],
    bonusEn: [
      'The illuminating contrast: the accelerated bookbuilding (ABB) without rights — in the course example, about €39m transferred from existing shareholders to newcomers served at €46 a share worth €49.61',
      'Some brokers sell unexercised rights automatically at the end of the period — a safety net, not a reason to skip understanding the mechanics',
    ],
    reponseModele: `Je lui dirais ceci. « Votre société a besoin d'argent frais : elle émet des actions nouvelles à 40 €, alors que le titre cote 50 €. Ce rabais est nécessaire pour attirer les souscripteurs — mais si on ne vous donnait rien en échange, les nouveaux entrants achèteraient à prix cassé une part de *votre* entreprise. C'est pour cela qu'on vous remet un **droit préférentiel de souscription** par action détenue. »

Puis je chiffre. Une nouvelle pour quatre anciennes : après l'opération, le cours mélange quatre actions à 50 € et une à 40 € — soit 240/5 = **48 €**. Le cours va donc baisser de 2 €, et c'est exactement la valeur du droit : (50 − 40)/(4 + 1) = 2 €.

« Vous détenez 400 actions, soit 20 000 €. Trois options. **Souscrire** : vos 400 droits vous donnent 100 actions nouvelles à 40 €, vous versez 4 000 € ; vous voilà avec 500 actions à 48 € = 24 000 € — vos 20 000 € plus votre apport, rien de perdu. **Vendre vos droits** : 400 × 2 = 800 € encaissés ; votre ligne vaut 19 200 €, plus le cash : 20 000 € — neutre aussi. **Ne rien faire** : vos droits expirent sans valeur, votre ligne vaut 19 200 €, et 800 € se sont évaporés. »

La morale tient en une phrase : un DPS, ça s'exerce ou ça se vend — jamais ça ne s'oublie. Certains intermédiaires vendent d'office les droits non exercés, mais c'est un filet de sécurité, pas une stratégie. Et le contraste éclaire le dispositif : dans un placement accéléré sans droits, la décote est un cadeau aux entrants, payé par les présents — le DPS est précisément ce qui neutralise ce transfert.`,
    reponseModeleEn: `I would tell him this. "Your company needs fresh money: it is issuing new shares at €40 while the stock trades at €50. That discount is needed to attract subscribers — but if you were given nothing in exchange, the newcomers would be buying a piece of *your* company on the cheap. That is why you receive one **subscription right** per share held."

Then I put numbers on it. One new share for four old ones: after the deal, the price mixes four shares at €50 and one at €40 — 240/5 = **€48**. The price will therefore drop by €2, and that is exactly the value of the right: (50 − 40)/(4 + 1) = €2.

"You hold 400 shares, worth €20,000. Three options. **Subscribe**: your 400 rights buy you 100 new shares at €40, you pay €4,000; you now hold 500 shares at €48 = €24,000 — your €20,000 plus your contribution, nothing lost. **Sell your rights**: 400 × 2 = €800 cashed in; your line is worth €19,200, plus the cash: €20,000 — neutral too. **Do nothing**: your rights expire worthless, your line is worth €19,200, and €800 have evaporated."

The moral fits in one sentence: a right gets exercised or sold — never forgotten. Some brokers sell unexercised rights automatically at the end of the period, but that is a safety net, not a strategy. And the contrast illuminates the design: in an accelerated placement without rights, the discount is a gift to the newcomers, paid by the incumbents — the subscription right is precisely what neutralises that transfer.`,
  },
  {
    id: 'm3-jury-18',
    moduleId: M3,
    theme: 'vie du titre',
    themeEn: 'corporate actions',
    difficulte: 3,
    question: 'Buyback ou dividende : que préférez-vous, et pourquoi ?',
    questionEn: 'Buyback or dividend: which do you prefer, and why?',
    plan: [
      "La mécanique du rachat : l'effet relutif chiffré",
      'Le dossier du rachat : flexibilité, signal, fiscalité',
      'Le dossier du dividende : discipline et clientèle',
      "Trancher en candidat : nuance, ordres de grandeur et réflexe d'analyste",
    ],
    planEn: [
      'The buyback mechanics: the accretive effect with numbers',
      'The case for the buyback: flexibility, signal, tax',
      'The case for the dividend: discipline and clientele',
      'Decide like a candidate: nuance, orders of magnitude and the analyst reflex',
    ],
    pointsAttendus: [
      'Le rachat-annulation est relutif : 100 M€ de bénéfice sur 10 millions d\'actions = BPA de 10 € ; rachetez et annulez 1 million de titres, le BPA passe à 100/9 ≈ 11,11 €, soit +11 % sans qu\'un seul client de plus ait été facturé',
      "Pour le rachat — la flexibilité : un dividende est un quasi-engagement dont la coupe est brutalement sanctionnée ; un programme de rachat se suspend sans drame",
      'Pour le rachat — le signal (la direction juge son titre bon marché, du moins l\'affirme-t-elle) et, selon les juridictions, un traitement fiscal de la plus-value souvent plus favorable — à mentionner avec prudence',
      "Pour le dividende : la discipline du rendez-vous régulier, et une clientèle d'investisseurs qui vit de ce revenu",
      'Les ordres de grandeur : les sociétés du S&P 500 ont consacré aux rachats des montants souvent supérieurs à 800 Md$ par an ces dernières années — généralement davantage que leurs dividendes versés',
      'La critique récurrente à citer sans réquisitoire : racheter au plus haut du cycle, doper cosmétiquement le BPA plutôt qu\'investir — d\'où le réflexe : décomposer toute croissance du BPA entre bénéfice et dénominateur',
    ],
    pointsAttendusEn: [
      'The buy-and-cancel is accretive: €100m of earnings over 10 million shares = €10 EPS; buy back and cancel 1 million shares and EPS moves to 100/9 ≈ €11.11, i.e. +11% without a single additional customer billed',
      'For the buyback — flexibility: a dividend is a quasi-commitment whose cut is brutally punished; a buyback programme can be suspended without drama',
      'For the buyback — the signal (management deems its stock cheap, or so it claims) and, depending on the jurisdiction, often more favourable capital-gains tax treatment — to be mentioned with caution',
      'For the dividend: the discipline of the regular appointment, and a clientele of investors who live off that income',
      'The orders of magnitude: S&P 500 companies have devoted amounts often above $800bn a year to buybacks in recent years — generally more than their dividends paid',
      'The recurring criticism to quote without turning prosecutor: buying back at the top of the cycle, cosmetically boosting EPS rather than investing — hence the reflex: decompose any EPS growth between earnings and denominator',
    ],
    bonus: [
      'La formulation qui marque : le BPA peut croître de 11 % « sans qu\'un seul client de plus ait été facturé » — toujours isoler l\'effet dénominateur avant de parler de performance',
      'Rapprocher du détachement : ni le dividende ni le rachat ne créent par eux-mêmes de la valeur opérationnelle — la question est celle du meilleur canal de restitution du cash, pas celle de la création de richesse',
    ],
    bonusEn: [
      'The phrasing that sticks: EPS can grow 11% “without a single additional customer billed” — always isolate the denominator effect before talking performance',
      'Connect to the ex-date logic: neither the dividend nor the buyback creates operating value by itself — the question is the best channel for returning cash, not wealth creation',
    ],
    reponseModele: `Je commencerais par désamorcer l'illusion d'optique. Le rachat-annulation est **relutif** : une société qui gagne 100 M€ avec 10 millions d'actions affiche un BPA de 10 € ; qu'elle rachète et annule 1 million de titres, et le BPA passe à 100/9 ≈ 11,11 € — une hausse de 11 % sans qu'un seul client de plus ait été facturé. Devant toute belle croissance du BPA, mon réflexe d'analyste : décomposer ce qui vient du bénéfice et ce qui vient du dénominateur.

Le dossier du rachat tient en trois arguments. La **flexibilité**, d'abord, le plus solide : un dividende est un quasi-engagement — le couper est sanctionné brutalement —, tandis qu'un programme de rachat se suspend sans drame. Le **signal** : la direction juge son titre bon marché, du moins l'affirme-t-elle. La **fiscalité**, enfin, avec prudence : selon les juridictions, la plus-value est souvent mieux traitée que le revenu distribué.

Le dossier du dividende : la discipline du rendez-vous régulier, qui contraint le management, et une clientèle d'investisseurs qui vit de ce revenu. Les ordres de grandeur disent où penche l'Amérique : les sociétés du S&P 500 ont consacré aux rachats des montants souvent supérieurs à 800 Md$ par an — généralement davantage que leurs dividendes.

Ma réponse de candidat : je préfère le rachat **quand le titre est effectivement sous-évalué et le cash excédentaire** — c'est la flexibilité qui me convainc —, mais je cite la critique récurrente sans en faire un réquisitoire : racheter au plus haut du cycle, doper cosmétiquement le BPA plutôt qu'investir. Au fond, aucun des deux ne crée de valeur opérationnelle : la vraie question est le meilleur canal de restitution du cash, pas la création de richesse.`,
    reponseModeleEn: `I would start by defusing the optical illusion. The buy-and-cancel is **accretive**: a company earning €100m with 10 million shares shows an EPS of €10; let it buy back and cancel 1 million shares and EPS moves to 100/9 ≈ €11.11 — an 11% rise without a single additional customer billed. Faced with any handsome EPS growth, my analyst reflex: decompose what comes from earnings and what comes from the denominator.

The case for the buyback rests on three arguments. **Flexibility** first, the strongest: a dividend is a quasi-commitment — cutting it is brutally punished — whereas a buyback programme can be suspended without drama. The **signal**: management deems its stock cheap, or so it claims. **Tax**, finally, with caution: depending on the jurisdiction, capital gains are often treated better than distributed income.

The case for the dividend: the discipline of the regular appointment, which constrains management, and a clientele of investors who live off that income. The orders of magnitude show where America leans: S&P 500 companies have devoted amounts often above $800bn a year to buybacks — generally more than their dividends.

My candidate's answer: I prefer the buyback **when the stock is genuinely undervalued and the cash is surplus** — flexibility is what convinces me — but I quote the recurring criticism without turning prosecutor: buying back at the top of the cycle, cosmetically boosting EPS rather than investing. Deep down, neither creates operating value: the real question is the best channel for returning cash, not wealth creation.`,
  },
  {
    id: 'm3-jury-19',
    moduleId: M3,
    theme: 'IPO et marché primaire',
    themeEn: 'IPOs and the primary market',
    difficulte: 3,
    question: 'Pourquoi les IPO sont-elles systématiquement sous-évaluées ?',
    questionEn: 'Why are IPOs systematically underpriced?',
    plan: [
      'Le fait stylisé : un « pop » moyen de 10 à 20 % le premier jour',
      "Qui paie ce cadeau : l'émetteur — l'argent laissé sur la table",
      'Les trois explications qui se cumulent : asymétrie, assurance, incitations',
      'Le revers pour le souscripteur : la malédiction du gagnant',
    ],
    planEn: [
      'The stylised fact: an average first-day "pop" of 10 to 20%',
      'Who pays for the gift: the issuer — the money left on the table',
      'The three compounding explanations: asymmetry, insurance, incentives',
      "The flip side for the subscriber: the winner's curse",
    ],
    pointsAttendus: [
      "Le fait stylisé le plus célèbre de la littérature financière : le premier cours coté dépasse en moyenne le prix d'introduction de 10 à 20 % selon les marchés et les époques — avec des excès comme la bulle internet de 1999-2000, où le pop a ponctuellement dépassé 50 % en moyenne aux États-Unis",
      "Qui paie : l'émetteur et les actionnaires vendeurs — chaque euro de hausse du premier jour est un euro qu'ils auraient pu encaisser ; une IPO de 1 Md€ qui « pope » de 15 %, ce sont 150 M€ de money left on the table",
      "L'asymétrie d'information : les investisseurs les mieux informés ne souscrivent que les bonnes opérations — la décote moyenne dédommage les autres pour qu'ils restent au jeu malgré ce désavantage",
      "L'assurance contre l'échec : une IPO qui casse son prix d'introduction dès le premier jour entame durablement la confiance — mieux vaut partir un peu bas que rater l'entrée",
      "Les incitations des banques : sous-pricer réduit leur risque de placement et fait plaisir à leurs clients investisseurs récurrents — alors que l'émetteur, lui, ne fait une IPO qu'une fois",
      "La malédiction du gagnant côté souscripteur : les allocations sont rationnées sur les bonnes opérations et généreuses sur les mauvaises — être servi largement est une information défavorable en soi",
    ],
    pointsAttendusEn: [
      'The most famous stylised fact in the finance literature: the first traded price exceeds the offer price by 10 to 20% on average, depending on markets and eras — with excesses like the 1999-2000 internet bubble, when the pop episodically topped 50% on average in the US',
      'Who pays: the issuer and the selling shareholders — every euro of first-day rise is a euro they could have pocketed; a €1bn IPO popping 15% means €150m of money left on the table',
      'Information asymmetry: the best-informed investors only subscribe to the good deals — the average discount compensates the others for staying in the game despite that disadvantage',
      'Insurance against failure: an IPO breaking its offer price on day one durably damages confidence — better to start a little low than to botch the entrance',
      "The banks' incentives: underpricing reduces their placement risk and pleases their recurring investor clients — whereas the issuer only does an IPO once",
      "The winner's curse on the subscriber side: allocations are rationed on the good deals and generous on the bad ones — being served in full is unfavourable information in itself",
    ],
    bonus: [
      'Ajouter la facture complète : la commission du syndicat représente de l\'ordre de 3 à 7 % du montant levé — la décote s\'ajoute aux frais directs',
      'La contre-épreuve du direct listing : Spotify en 2018, Slack en 2019 — pas de book-building, pas de décote d\'IPO ni de frais de placement, mais pas de levée de fonds non plus',
      "La prudence qui classe : le débat sur le poids respectif des trois moteurs n'est pas tranché — ce qui est sûr, c'est qu'ils tirent tous dans le même sens",
    ],
    bonusEn: [
      'Add the full bill: the syndicate fee runs at around 3 to 7% of the amount raised — the discount comes on top of the direct costs',
      'The direct-listing counter-test: Spotify in 2018, Slack in 2019 — no book-building, no IPO discount and no placement fees, but no fundraising either',
      'The caution that ranks you: the debate over the respective weight of the three drivers is unsettled — what is certain is that they all pull in the same direction',
    ],
    reponseModele: `Le « pop » du premier jour est le fait stylisé le plus célèbre de la littérature financière : en moyenne, le premier cours coté dépasse le prix d'introduction de **10 à 20 %** selon les marchés et les époques — avec des excès spectaculaires, comme la bulle internet de 1999-2000 où il a ponctuellement dépassé 50 % en moyenne aux États-Unis.

Première question : qui paie ce cadeau ? L'émetteur et les actionnaires vendeurs. Chaque euro de hausse du premier jour est un euro qu'ils auraient pu encaisser en vendant plus cher — l'argent laissé sur la table. Une IPO de 1 Md€ qui « pope » de 15 %, ce sont 150 M€ offerts aux investisseurs servis à l'introduction — qui s'ajoutent aux 3 à 7 % de commission du syndicat.

Pourquoi cette décote persiste-t-elle alors depuis des décennies, sur tous les marchés ? Trois explications se cumulent. L'**asymétrie d'information** : les investisseurs les mieux informés ne souscrivent que les bonnes opérations ; pour que les autres restent au jeu malgré ce désavantage, il faut une décote moyenne qui les dédommage. L'**assurance contre l'échec** : une IPO qui casse son prix dès le premier jour entame durablement la confiance — mieux vaut partir un peu bas que rater l'entrée. Les **incitations des banques**, enfin : sous-pricer réduit leur risque de placement et fait plaisir à leurs clients investisseurs récurrents — l'émetteur, lui, ne fait une IPO qu'une fois. Le débat sur leur poids respectif n'est pas tranché ; ce qui est sûr, c'est qu'ils tirent tous dans le même sens.

Et le revers pour le souscripteur tenté de « tout souscrire » : il ne reçoit pas la moyenne. Rationné sur les bonnes opérations, servi à plein sur les mauvaises — la malédiction du gagnant. Une allocation généreuse est une information en soi, et elle est défavorable.`,
    reponseModeleEn: `The first-day "pop" is the most famous stylised fact in the finance literature: on average, the first traded price exceeds the offer price by **10 to 20%** depending on markets and eras — with spectacular excesses, like the 1999-2000 internet bubble when it episodically topped 50% on average in the United States.

First question: who pays for the gift? The issuer and the selling shareholders. Every euro of first-day rise is a euro they could have pocketed by selling higher — the money left on the table. A €1bn IPO popping 15% means €150m handed to the investors served at the offering — on top of the syndicate's 3 to 7% fee.

Why, then, has the discount persisted for decades, on every market? Three explanations compound. **Information asymmetry**: the best-informed investors only subscribe to the good deals; for the others to stay in the game despite that disadvantage, an average discount must compensate them. **Insurance against failure**: an IPO breaking its price on day one durably damages confidence — better to start a little low than to botch the entrance. **The banks' incentives**, finally: underpricing reduces their placement risk and pleases their recurring investor clients — the issuer only does an IPO once. The debate over their respective weight is unsettled; what is certain is that they all pull in the same direction.

And the flip side for the subscriber tempted to "subscribe to everything": he does not receive the average. Rationed on the good deals, served in full on the bad ones — the winner's curse. A generous allocation is information in itself, and it is unfavourable.`,
  },
  {
    id: 'm3-jury-20',
    moduleId: M3,
    theme: 'IPO et marché primaire',
    themeEn: 'IPOs and the primary market',
    difficulte: 2,
    question: 'La greenshoe en soixante secondes : à vous.',
    questionEn: 'The greenshoe in sixty seconds: go.',
    plan: [
      "Le montage : placer 115 % des titres, être short de 15 %, une option à prix d'IPO en poche",
      'Scénario baisse : racheter en marché — stabiliser et solder le short avec profit',
      "Scénario hausse : exercer l'option auprès de l'émetteur",
      "Le génie : la banque ne peut pas perdre — et c'est voulu",
    ],
    planEn: [
      'The set-up: place 115% of the shares, be short 15%, with an option at the IPO price in hand',
      'Downside scenario: buy back in the market — stabilise and close the short at a profit',
      'Upside scenario: exercise the option with the issuer',
      'The genius: the bank cannot lose — by design',
    ],
    pointsAttendus: [
      "Le syndicat place 115 % des titres prévus — sur une IPO de 10 millions d'actions à 20 €, il en alloue 11,5 millions — et se retrouve vendeur à découvert de 1,5 million de titres, avec une option d'achat à 20 € consentie par l'émetteur, exerçable 30 jours",
      "Scénario 1, le titre faiblit à 19 € : le syndicat rachète 1,5 million de titres dans le marché — cette demande amortit la baisse, c'est l'effet stabilisateur — et solde son short avec un gain de l'ordre de 1,5 M€ ; l'option expire, 10 millions de titres restent en circulation",
      "Scénario 2, le titre monte à 24 € : racheter en marché serait perdant — le syndicat exerce la greenshoe, l'émetteur crée 1,5 million d'actions à 20 € qui couvrent le short à l'identique ; l'émetteur lève 15 % de plus, 11,5 millions de titres circulent",
      "Le génie du montage : un short qui protège à la baisse, une option qui couvre à la hausse — la banque ne peut pas perdre, et c'est voulu : on la paie ainsi pour stabiliser le marché sans risque",
      "L'un des rares soutiens de cours organisés et parfaitement légaux : encadré par la réglementation et annoncé dans le prospectus",
    ],
    pointsAttendusEn: [
      'The syndicate places 115% of the planned shares — on a 10-million-share IPO at €20, it allocates 11.5 million — and ends up short 1.5 million shares, with a call option at €20 granted by the issuer, exercisable for 30 days',
      'Scenario 1, the stock weakens to €19: the syndicate buys back 1.5 million shares in the market — that demand cushions the fall, the intended stabilising effect — and closes its short with a gain of around €1.5m; the option expires, 10 million shares remain outstanding',
      'Scenario 2, the stock rises to €24: buying back in the market would lose money — the syndicate exercises the greenshoe, the issuer creates 1.5 million shares at €20 that cover the short exactly; the issuer raises 15% more, 11.5 million shares are outstanding',
      'The genius of the set-up: a short that protects on the downside, an option that covers the upside — the bank cannot lose, and that is by design: it is how you pay it to stabilise the market risk-free',
      'One of the rare organised and perfectly legal forms of price support: framed by regulation and disclosed in the prospectus',
    ],
    bonus: [
      "L'origine du nom : la Green Shoe Manufacturing Company, première à l'utiliser en 1963",
      'Ne pas confondre les horloges : la greenshoe se joue dans les 30 premiers jours ; le lock-up court sur 90 à 180 jours',
    ],
    bonusEn: [
      'The origin of the name: the Green Shoe Manufacturing Company, the first to use it in 1963',
      'Do not mix up the clocks: the greenshoe plays out within the first 30 days; the lock-up runs for 90 to 180 days',
    ],
    reponseModele: `Le principe en quatre lignes, puis les deux scénarios. Lors de l'IPO — disons 10 millions d'actions à 20 € —, le syndicat en place **115 %** : 11,5 millions de titres alloués, le voilà vendeur à découvert de 1,5 million. En face, l'émetteur lui a consenti une **option d'achat** de 1,5 million d'actions à 20 €, exerçable trente jours : c'est la greenshoe, du nom de la Green Shoe Manufacturing Company, première à l'utiliser en 1963.

**Scénario 1 — le titre faiblit**, 19 € la première semaine. Le syndicat rachète 1,5 million de titres dans le marché : cette demande amortit la baisse — c'est l'effet stabilisateur recherché. Son short est soldé avec profit : vendu à 20 €, racheté autour de 19 €, de l'ordre de 1,5 M€ au passage. L'option expire sans être exercée ; 10 millions de titres restent en circulation.

**Scénario 2 — le titre monte**, 24 €. Racheter à 24 € ce qu'on a vendu 20 € : hors de question. Le syndicat exerce l'option : l'émetteur crée 1,5 million d'actions supplémentaires à 20 €, qui couvrent le short à l'identique. L'émetteur lève 15 % de plus que prévu, et 11,5 millions de titres circulent.

Le génie du montage : un short qui protège à la baisse, une option qui couvre à la hausse — la banque **ne peut pas perdre**, et c'est voulu : on la paie ainsi pour stabiliser le marché sans risque, aux frais mesurés de l'émetteur. C'est l'un des rares soutiens de cours organisés et parfaitement légaux, car encadré par la réglementation et annoncé dans le prospectus. Et ne pas confondre les horloges : la greenshoe se joue sur 30 jours, le lock-up sur 90 à 180.`,
    reponseModeleEn: `The principle in four lines, then the two scenarios. At the IPO — say 10 million shares at €20 — the syndicate places **115%**: 11.5 million shares allocated, so it is short 1.5 million. In exchange, the issuer has granted it a **call option** on 1.5 million shares at €20, exercisable for thirty days: that is the greenshoe, named after the Green Shoe Manufacturing Company, the first to use it in 1963.

**Scenario 1 — the stock weakens**, €19 in the first week. The syndicate buys back 1.5 million shares in the market: that demand cushions the fall — the intended stabilising effect. Its short is closed at a profit: sold at €20, bought back around €19, roughly €1.5m along the way. The option expires unexercised; 10 million shares remain outstanding.

**Scenario 2 — the stock rises**, €24. Buying back at €24 what was sold at €20: out of the question. The syndicate exercises the option: the issuer creates 1.5 million additional shares at €20, which cover the short exactly. The issuer raises 15% more than planned, and 11.5 million shares are outstanding.

The genius of the set-up: a short that protects on the downside, an option that covers the upside — the bank **cannot lose**, and that is by design: it is how you pay it to stabilise the market risk-free, at the issuer's measured expense. It is one of the rare organised and perfectly legal forms of price support, framed by regulation and disclosed in the prospectus. And do not mix up the clocks: the greenshoe plays out over 30 days, the lock-up over 90 to 180.`,
  },
  {
    id: 'm3-jury-21',
    moduleId: M3,
    theme: 'vente à découvert',
    themeEn: 'short selling',
    difficulte: 3,
    question: 'À quoi servent les vendeurs à découvert ?',
    questionEn: 'What purpose do short sellers serve?',
    plan: [
      'La mécanique en quatre temps : emprunter, vendre, racheter, rendre',
      'Les trois services : liquidité, découverte des prix, chasse aux fraudes',
      'Le cas Wirecard : les shorts avaient raison contre le régulateur',
      'Les interdictions dans les paniques : un bilan embarrassant',
    ],
    planEn: [
      'The mechanics in four steps: borrow, sell, buy back, return',
      'The three services: liquidity, price discovery, fraud hunting',
      'The Wirecard case: the shorts were right against the regulator',
      'The bans during panics: an embarrassing record',
    ],
    pointsAttendus: [
      "La mécanique : emprunter les titres à un investisseur de long terme contre collatéral et commission, vendre, racheter, rendre — l'exemple de référence : 1 000 titres vendus à 100 €, rachetés à 90 € après 90 jours, frais de 100 000 × 2 % × 90/360 = 500 €, soit 9 500 € nets",
      'La liquidité : les teneurs de marché ne peuvent coter à la vente sans détenir chaque titre que parce que le short leur permet de livrer — sans lui, plus de cotation continue',
      "La découverte des prix : sans vente à découvert, seuls les optimistes votent — ceux qui jugent un titre surévalué sans le détenir n'ont aucun moyen de peser sur le cours, qui penche structurellement vers le haut",
      "La chasse aux fraudes : Wirecard — dès 2015, vendeurs à découvert et journalistes du Financial Times documentent les incohérences ; en 2019, la BaFin interdit le short sur le titre et porte plainte contre les journalistes ; juin 2020, 1,9 Md€ de trésorerie inexistants, effondrement",
      "Le débat réglementaire : les interdictions des paniques — 2008, mars 2020 — laissent dans les études une liquidité dégradée et des fourchettes élargies, sans effet clair de soutien des cours ; l'efficacité reste débattue, formulation prudente",
    ],
    pointsAttendusEn: [
      'The mechanics: borrow the shares from a long-term investor against collateral and a fee, sell, buy back, return — the reference example: 1,000 shares sold at €100, bought back at €90 after 90 days, fees of 100,000 × 2% × 90/360 = €500, i.e. €9,500 net',
      'Liquidity: market makers can only quote on the sell side without holding every stock because the short lets them deliver — without it, no continuous quotation',
      'Price discovery: without short selling, only the optimists vote — those who deem a stock overvalued without holding it have no way to weigh on the price, which structurally leans upward',
      'Fraud hunting: Wirecard — from 2015, short sellers and Financial Times journalists document the inconsistencies; in 2019 BaFin bans shorting the stock and files a complaint against the journalists; June 2020, €1.9bn of cash does not exist, collapse',
      'The regulatory debate: the panic bans — 2008, March 2020 — leave in the studies degraded liquidity and wider spreads, with no clear price-support effect; effectiveness remains debated, the cautious phrasing',
    ],
    bonus: [
      "Les frais sont dus quoi qu'il arrive : si le titre remonte à 110 €, la perte brute de 10 000 € devient 10 500 € nets",
      "Le titre hard to borrow : commission à des dizaines de pour cent annualisés — l'exact équivalent du titre qui traite « spécial » au repo obligataire ; la rareté à l'emprunt est un signal",
    ],
    bonusEn: [
      'The fees are owed no matter what: if the stock climbs back to €110, the €10,000 gross loss becomes €10,500 net',
      'The hard-to-borrow stock: fees at tens of percent annualised — the exact equivalent of the bond trading "special" in the repo market; scarcity in the borrow is a signal',
    ],
    reponseModele: `Trois services — à dérouler calmement, car le personnage est plus utile que sa réputation. Mais d'abord la mécanique, en quatre temps : **emprunter** les titres à un investisseur de long terme, contre collatéral et commission ; **vendre** ; **racheter**, si possible plus bas ; **rendre**. L'exemple de référence : 1 000 titres vendus à 100 €, rachetés 90 jours plus tard à 90 € — gain brut 10 000 €, moins les frais d'emprunt, 100 000 × 2 % × 90/360 = 500 €, soit **9 500 € nets**. Frais dus quoi qu'il arrive : si le titre remonte à 110 €, la perte atteint 10 500 €.

Premier service : la **liquidité**. Les teneurs de marché ne peuvent coter à la vente sans détenir chaque titre que parce que le short leur permet de livrer — sans lui, plus de cotation continue. Deuxième : la **découverte des prix**. Sans vente à découvert, seuls les optimistes votent ; ceux qui jugent un titre surévalué sans le détenir n'ont aucun moyen de peser sur le cours, qui penche structurellement vers le haut. Troisième, le plus spectaculaire : la **chasse aux fraudes**. Les vendeurs activistes sont les seuls acteurs du marché financièrement incités à découvrir ce qui ne va pas. Le cas d'école est Wirecard : dès 2015, des shorts et le Financial Times documentent les incohérences ; en 2019, la BaFin interdit la vente à découvert sur le titre et porte plainte contre les journalistes ; en juin 2020, 1,9 Md€ de trésorerie se révèlent inexistants.

Reste le débat des interdictions dans les paniques — 2008, mars 2020. Les études convergent vers un constat embarrassant : liquidité dégradée, fourchettes élargies, sans effet clair de soutien des cours. L'efficacité de ces interdictions reste débattue — c'est la formulation prudente que je retiens.`,
    reponseModeleEn: `Three services — to be laid out calmly, because the character is more useful than his reputation. But the mechanics first, in four steps: **borrow** the shares from a long-term investor, against collateral and a fee; **sell**; **buy back**, lower if possible; **return**. The reference example: 1,000 shares sold at €100, bought back 90 days later at €90 — €10,000 gross gain, minus the borrowing fees, 100,000 × 2% × 90/360 = €500, i.e. **€9,500 net**. Fees owed no matter what: if the stock climbs back to €110, the loss reaches €10,500.

First service: **liquidity**. Market makers can only quote on the sell side without holding every stock because the short lets them deliver — without it, no continuous quotation. Second: **price discovery**. Without short selling, only the optimists vote; those who deem a stock overvalued without holding it have no way to weigh on the price, which structurally leans upward. Third, the most spectacular: **fraud hunting**. Activist short sellers are the only market players financially incentivised to discover what is wrong. The textbook case is Wirecard: from 2015, shorts and the Financial Times document the inconsistencies; in 2019, BaFin bans short selling on the stock and files a complaint against the journalists; in June 2020, €1.9bn of cash turns out not to exist.

There remains the debate over bans during panics — 2008, March 2020. The studies converge on an embarrassing finding: degraded liquidity, wider spreads, with no clear price-support effect. The effectiveness of these bans remains debated — that is the cautious phrasing I keep.`,
  },
  {
    id: 'm3-jury-22',
    moduleId: M3,
    theme: 'vente à découvert',
    themeEn: 'short selling',
    difficulte: 4,
    question: 'GameStop, janvier 2021 : racontez-le côté marché — mécanique, chiffres, et le contresens à éviter.',
    questionEn: 'GameStop, January 2021: tell it from the market side — mechanics, numbers, and the misreading to avoid.',
    plan: [
      'Le terreau : un profil de risque asymétrique — gain plafonné, perte illimitée',
      "Le carburant : un short interest d'environ 140 % du flottant",
      'La spirale : pertes, appels de marge, rachats forcés — le squeeze',
      'Le contresens : la suspension des achats, mécanique de chambre, pas complot',
    ],
    planEn: [
      'The breeding ground: an asymmetric risk profile — capped gain, unlimited loss',
      'The fuel: short interest at about 140% of the float',
      'The spiral: losses, margin calls, forced buy-backs — the squeeze',
      'The misreading: the buying halt, clearing-house mechanics, not conspiracy',
    ],
    pointsAttendus: [
      "L'asymétrie du short : gain plafonné au prix de vente — au mieux le titre vaut zéro —, perte illimitée à la hausse ; aggravée par le recall du prêteur et les appels de marge quotidiens — le vendeur ne choisit pas toujours son horizon",
      "Plus de 100 % du flottant vendu à découvert n'a rien d'impossible : un titre emprunté, vendu, peut être réemprunté à son nouveau détenteur et revendu — la chaîne compte double ; chez GameStop, le short interest était de l'ordre de 140 % du flottant selon les données de l'époque",
      "La spirale auto-entretenue : des acheteurs coordonnés sur les réseaux sociaux font monter le cours ; la hausse inflige des pertes aux vendeurs ; les appels de marge en forcent certains à racheter ; ces rachats font monter le cours — le short squeeze, littéralement l'essorage des vendeurs",
      "Les chiffres : le titre passe d'environ 20 dollars à près de 500 en séance ; Melvin Capital, le fonds le plus exposé, perd plusieurs milliards et ferme l'année suivante",
      "Le contresens à corriger : la suspension des achats chez plusieurs courtiers au sommet de la fièvre relève des appels de marge de la chambre de compensation — la tuyauterie du module 1 —, pas d'un complot",
    ],
    pointsAttendusEn: [
      "The short's asymmetry: gain capped at the sale price — at best the stock goes to zero — unlimited loss on the upside; worsened by the lender's recall and daily margin calls — the seller does not always choose his horizon",
      'More than 100% of the float sold short is perfectly possible: a share borrowed and sold can be re-borrowed from its new holder and sold again — the chain counts twice; at GameStop, short interest was around 140% of the float according to data at the time',
      'The self-feeding spiral: buyers coordinated on social media push the price up; the rise inflicts losses on the sellers; margin calls force some to buy back; those buy-backs push the price up — the short squeeze, literally the wringing-out of the sellers',
      'The numbers: the stock goes from about 20 dollars to nearly 500 intraday; Melvin Capital, the most exposed fund, loses several billion and shuts the following year',
      'The misreading to correct: the buying halt at several brokers at the peak of the fever stems from the clearing house\'s margin calls — the module 1 plumbing — not from a conspiracy',
    ],
    bonus: [
      'La leçon générale : le squeeze ne condamne pas le short, il illustre les limites de l\'arbitrage — avoir raison ne suffit pas, encore faut-il pouvoir tenir la position',
      "Le signal de tension en amont : un titre hard to borrow dont la commission d'emprunt s'envole à des dizaines de pour cent annualisés — la rareté à l'emprunt a un prix, et ce prix est une alerte",
    ],
    bonusEn: [
      'The general lesson: the squeeze does not condemn shorting, it illustrates the limits of arbitrage — being right is not enough, you must also be able to hold the position',
      'The upstream tension signal: a hard-to-borrow stock whose borrowing fee soars to tens of percent annualised — scarcity in the borrow has a price, and that price is a warning',
    ],
    reponseModele: `Tout part d'un profil de risque asymétrique : l'acheteur risque sa mise, pas davantage ; le vendeur à découvert a un gain **plafonné** — au mieux, le titre vaut zéro — et une perte **illimitée**, car rien ne borne la hausse. S'y ajoutent le recall — le prêteur peut rappeler ses titres à tout moment — et les appels de marge quotidiens : le vendeur ne choisit pas toujours son horizon. C'est cette asymétrie qui rend les squeezes possibles.

Le carburant, en janvier 2021 : un short interest d'environ **140 % du flottant**. Plus de 100 % n'a rien d'impossible — un titre emprunté, vendu, peut être réemprunté à son nouveau détenteur et revendu : la chaîne compte double.

La spirale, ensuite. Des acheteurs coordonnés sur les réseaux sociaux font monter le cours ; la hausse inflige des pertes aux vendeurs ; les appels de marge en forcent certains à racheter ; ces rachats font monter le cours, ce qui aggrave les pertes des autres — le short squeeze, littéralement l'essorage des vendeurs. Le titre passe d'environ 20 dollars à près de 500 en séance ; Melvin Capital, le fonds le plus exposé, perd plusieurs milliards et fermera l'année suivante.

Le contresens à éviter, enfin — la partie que tout le monde raconte de travers : la suspension des achats chez plusieurs courtiers au sommet de la fièvre. La tuyauterie qui a bloqué les achats, ce sont les appels de marge de la chambre de compensation — pas un complot.

Et la leçon dépasse l'anecdote : le squeeze ne condamne pas la vente à découvert, il illustre les limites de l'arbitrage. Sur un marché, avoir raison ne suffit pas — encore faut-il pouvoir tenir la position pendant que le marché a tort.`,
    reponseModeleEn: `It all starts from an asymmetric risk profile: the buyer risks his stake, no more; the short seller has a **capped** gain — at best, the stock goes to zero — and an **unlimited** loss, because nothing bounds the upside. Add the recall — the lender can call his shares back at any moment — and daily margin calls: the seller does not always choose his horizon. That asymmetry is what makes squeezes possible.

The fuel, in January 2021: short interest at about **140% of the float**. More than 100% is perfectly possible — a share borrowed and sold can be re-borrowed from its new holder and sold again: the chain counts twice.

Then the spiral. Buyers coordinated on social media push the price up; the rise inflicts losses on the sellers; margin calls force some to buy back; those buy-backs push the price up, worsening the others' losses — the short squeeze, literally the wringing-out of the sellers. The stock goes from about 20 dollars to nearly 500 intraday; Melvin Capital, the most exposed fund, loses several billion and will shut the following year.

The misreading to avoid, finally — the part everyone tells wrong: the buying halt at several brokers at the peak of the fever. The plumbing that blocked the purchases was the clearing house's margin calls — not a conspiracy.

And the lesson goes beyond the anecdote: the squeeze does not condemn short selling, it illustrates the limits of arbitrage. In a market, being right is not enough — you must also be able to hold the position while the market is wrong.`,
  },
  {
    id: 'm3-jury-23',
    moduleId: M3,
    theme: 'efficience',
    themeEn: 'market efficiency',
    difficulte: 4,
    question: "L'efficience des marchés : défendez-la, puis attaquez-la. Vous avez les deux rôles.",
    questionEn: 'Market efficiency: defend it, then attack it. You play both sides.',
    plan: [
      'Poser le cadre : les trois formes de Fama — faible, semi-forte, forte',
      'Défendre : SPIVA, 80 à 90 % des gérants sous leur indice à dix ans',
      "Attaquer : anomalies documentées et limites de l'arbitrage — 3Com/Palm",
      'Synthèse tenable : efficients la plupart du temps, pas tout le temps',
    ],
    planEn: [
      'Set the frame: Fama\'s three forms — weak, semi-strong, strong',
      'Defend: SPIVA, 80 to 90% of managers below their index over ten years',
      'Attack: documented anomalies and the limits of arbitrage — 3Com/Palm',
      'The tenable synthesis: efficient most of the time, not all the time',
    ],
    pointsAttendus: [
      "Les trois formes emboîtées : faible — les cours passés ne prédisent rien d'exploitable ; semi-forte — l'information publique est dans le cours quelques instants après publication ; forte — l'information privée aussi, rejetée par à peu près tout le monde : si le délit d'initié n'était pas rentable, il n'y aurait pas besoin de l'interdire",
      "La défense : selon les décomptes SPIVA, de l'ordre de 80 à 90 % des gérants actions font moins bien que leur indice sur dix ans, et la surperformance passée ne persiste guère — exactement ce que prédit la forme semi-forte",
      "L'attaque par les anomalies : le momentum — contraire à la forme faible —, la value, les petites capitalisations ; avec la loi du genre : une anomalie publiée s'érode",
      "L'attaque par les limites de l'arbitrage : 3Com/Palm, mars 2000 — le marché valorise le reste de 3Com environ −60 $ par action (Lamont et Thaler) ; l'arbitrage crevait les yeux et restait impraticable, faute de titres Palm empruntables à coût raisonnable",
      "La formule qui résume : « le marché peut rester irrationnel plus longtemps que vous ne pouvez rester solvable » — attribuée à Keynes, attribution incertaine, sagesse certaine",
      'La synthèse : les marchés sont efficients la plupart du temps, pas tout le temps — assez pour que battre l\'indice soit exceptionnellement difficile, pas assez pour empêcher les bulles de se reproduire ; le candidat crédible tient les deux',
    ],
    pointsAttendusEn: [
      'The three nested forms: weak — past prices predict nothing exploitable; semi-strong — public information is in the price moments after publication; strong — private information too, rejected by just about everyone: if insider trading were not profitable, there would be no need to ban it',
      'The defence: according to the SPIVA scorecards, on the order of 80 to 90% of equity managers do worse than their index over ten years, and past outperformance barely persists — exactly what the semi-strong form predicts',
      'The attack via anomalies: momentum — contrary to the weak form — value, small caps; with the law of the genre: a published anomaly erodes',
      'The attack via the limits of arbitrage: 3Com/Palm, March 2000 — the market values the rest of 3Com at about −$60 per share (Lamont and Thaler); the arbitrage was glaring yet impracticable, for lack of Palm shares borrowable at reasonable cost',
      'The summarising line: "the market can stay irrational longer than you can stay solvent" — attributed to Keynes, attribution uncertain, wisdom certain',
      'The synthesis: markets are efficient most of the time, not all the time — enough to make beating the index exceptionally hard, not enough to prevent bubbles from recurring; the credible candidate holds both',
    ],
    bonus: [
      "L'efficience ne descend pas du ciel : elle est fabriquée par des arbitragistes qui ont besoin de la tuyauterie du prêt-emprunt — quand la tuyauterie manque, l'absurde peut rester coté des mois",
      "L'implication pratique : si l'alpha est rare, incertain et cher, répliquer l'indice à coût minimal devient le choix par défaut — la montée de la gestion passive",
    ],
    bonusEn: [
      'Efficiency does not fall from the sky: it is manufactured by arbitrageurs who need the securities-lending plumbing — when the plumbing is missing, the absurd can stay listed for months',
      'The practical implication: if alpha is rare, uncertain and expensive, replicating the index at minimal cost becomes the default choice — the rise of passive management',
    ],
    reponseModele: `Le cadre d'abord : l'hypothèse d'efficience, formalisée par Fama, en trois formes emboîtées. **Faible** : les cours passés ne prédisent rien d'exploitable. **Semi-forte** : toute l'information publique est dans le cours quelques instants après sa publication. **Forte** : même l'information privée — rejetée par à peu près tout le monde : si le délit d'initié n'était pas rentable, il n'y aurait pas besoin de l'interdire.

La défense, maintenant. La preuve la plus parlante tient en un chiffre : selon les décomptes SPIVA, de l'ordre de **80 à 90 %** des gérants actions font moins bien que leur indice sur dix ans — et la surperformance passée ne persiste guère. Si l'information publique laissait des billets par terre, des milliers de professionnels suréquipés les ramasseraient ; qu'ils n'y parviennent pas, en moyenne et après frais, est exactement ce que prédit la forme semi-forte.

L'attaque, à présent. Les **anomalies** documentées existent : le momentum — ce qui a monté sur six à douze mois continue en moyenne de surperformer, directement contraire à la forme faible —, la value, les petites capitalisations, avec la loi du genre : une anomalie publiée s'érode. Et surtout, les **limites de l'arbitrage** : en mars 2000, le marché valorisait le reste de 3Com à environ −60 dollars par action une fois sa participation dans Palm décomptée — l'inefficience la plus flagrante jamais cotée, et pourtant l'arbitrage était impraticable, faute de titres Palm empruntables à coût raisonnable. « Le marché peut rester irrationnel plus longtemps que vous ne pouvez rester solvable » — l'attribution à Keynes est incertaine, la sagesse ne l'est pas.

Ma synthèse tient les deux bouts : les marchés sont efficients **la plupart du temps, pas tout le temps**. Assez pour que battre l'indice soit exceptionnellement difficile ; pas assez pour empêcher les bulles de se reproduire siècle après siècle.`,
    reponseModeleEn: `The frame first: the efficiency hypothesis, formalised by Fama, in three nested forms. **Weak**: past prices predict nothing exploitable. **Semi-strong**: all public information is in the price moments after its publication. **Strong**: even private information — rejected by just about everyone: if insider trading were not profitable, there would be no need to ban it.

Now the defence. The most telling evidence fits in one number: according to the SPIVA scorecards, on the order of **80 to 90%** of equity managers do worse than their index over ten years — and past outperformance barely persists. If public information left banknotes lying on the ground, thousands of over-equipped professionals would pick them up; that they fail to, on average and after fees, is exactly what the semi-strong form predicts.

Now the attack. Documented **anomalies** exist: momentum — what has risen over six to twelve months keeps outperforming on average, directly contrary to the weak form — value, small caps, with the law of the genre: a published anomaly erodes. And above all, the **limits of arbitrage**: in March 2000, the market valued the rest of 3Com at about −60 dollars per share once its Palm stake was counted out — the most glaring inefficiency ever listed, and yet the arbitrage was impracticable, for lack of Palm shares borrowable at reasonable cost. "The market can stay irrational longer than you can stay solvent" — the attribution to Keynes is uncertain, the wisdom is not.

My synthesis holds both ends: markets are efficient **most of the time, not all the time**. Enough to make beating the index exceptionally hard; not enough to prevent bubbles from recurring century after century.`,
  },
  {
    id: 'm3-jury-24',
    moduleId: M3,
    theme: 'synthèse',
    themeEn: 'capstone',
    difficulte: 4,
    question: "DCF d'entretien : déroulez-le proprement, puis dites-nous pourquoi il ne faut pas y croire.",
    questionEn: 'Interview DCF: walk it through cleanly, then tell us why not to take it at face value.',
    plan: [
      'Dérouler : flux explicites, valeur terminale, actualisation au WACC',
      'Chiffrer : FCF 100/110/121, WACC 10 %, VT 1 500 → 1 399,70',
      'Critiquer : 80,5 % du total dans la VT, deux hypothèses invérifiables',
      'Conclure en professionnel : dette nette, fourchette, matrice de sensibilité',
    ],
    planEn: [
      'Walk through: explicit flows, terminal value, discounting at the WACC',
      'Put numbers on it: FCF 100/110/121, 10% WACC, TV 1,500 → 1,399.70',
      'Criticise: 80.5% of the total in the TV, two unverifiable assumptions',
      'Conclude like a professional: net debt, a range, a sensitivity matrix',
    ],
    pointsAttendus: [
      'Le déroulé : actualiser chaque FCF au WACC — 100/1,1 + 110/1,1² + 121/1,1³ = 272,73 — puis la valeur terminale : 1 500/1,1³ = 1 126,97 ; total 1 399,70',
      "Les deux fautes éliminatoires à éviter en déroulant : construire la VT sur le dernier flux explicite au lieu du flux suivant l'horizon, et oublier de l'actualiser — elle est exprimée en euros de l'année 3",
      "La sortie est une valeur d'entreprise : les FCF reviennent aux actionnaires et aux créanciers — retrancher la dette nette pour obtenir la valeur des actions",
      'La critique : la VT pèse 80,5 % du total — un poids de 60 à 80 % est la norme, mais il repose sur deux hypothèses perpétuelles invérifiables auxquelles la valeur réagit de façon explosive : +25 % pour un point de croissance, −17 % pour un point de taux, sur l\'exemple de Gordon',
      'Le même déséquilibre côté dividendes : dans le DDM deux étapes du cours, la VT actualisée pèse 35,92 sur 42,15, soit 85 %',
      "La conclusion professionnelle : un DCF est une transformation d'hypothèses en prix — présentation en fourchette avec matrice de sensibilité croisant WACC et croissance terminale, et contrôle croisé par les multiples",
    ],
    pointsAttendusEn: [
      'The walk-through: discount each FCF at the WACC — 100/1.1 + 110/1.1² + 121/1.1³ = 272.73 — then the terminal value: 1,500/1.1³ = 1,126.97; total 1,399.70',
      'The two eliminatory faults to avoid while walking through: building the TV on the last explicit flow instead of the flow following the horizon, and forgetting to discount it — it is expressed in year-3 euros',
      'The output is an enterprise value: FCF accrues to shareholders and creditors — subtract net debt to get the equity value',
      'The critique: the TV weighs 80.5% of the total — a 60-to-80% weight is the norm, but it rests on two unverifiable perpetual assumptions to which the value reacts explosively: +25% for one point of growth, −17% for one point of rate, on the Gordon example',
      'The same imbalance on the dividend side: in the course two-stage DDM, the discounted TV weighs 35.92 out of 42.15, i.e. 85%',
      'The professional conclusion: a DCF is a transformation of assumptions into a price — presented as a range with a sensitivity matrix crossing WACC and terminal growth, and cross-checked with multiples',
    ],
    bonus: [
      "Allonger l'horizon explicite ne résout rien : on déplace les mêmes hypothèses invérifiables dans des flux « explicites » tout aussi projetés",
      "La passerelle qui boucle le module : un multiple est un DCF compressé dont on a caché les hypothèses — PER théorique = d(1+g)/(r−g)",
    ],
    bonusEn: [
      'Lengthening the explicit horizon solves nothing: it shifts the same unverifiable assumptions into "explicit" flows that are just as projected',
      'The bridge that closes the module: a multiple is a compressed DCF with its assumptions hidden — theoretical P/E = d(1+g)/(r−g)',
    ],
    reponseModele: `Je déroule, puis je critique — les deux font partie de l'exercice.

Le déroulé. Un actif vaut la somme de ses flux futurs actualisés. Trois FCF explicites — 100, 110, 121 —, un WACC de 10 %, une valeur terminale de 1 500 en année 3. Chaque flux actualisé vaut 90,91 ; les trois ensemble, 272,73. La valeur terminale, exprimée en euros de l'année 3, doit encore être actualisée : 1 500/1,1³ = 1 126,97. Total : **1 399,70**. Deux fautes coûtent l'exercice à cette étape : construire la VT sur le dernier flux explicite au lieu du flux *suivant* l'horizon, et oublier de l'actualiser. Et je n'oublie pas la nature de la sortie : les FCF reviennent aux actionnaires et aux créanciers — c'est une valeur d'entreprise, je retranche la dette nette pour obtenir la valeur des actions.

La critique, maintenant. La VT pèse 1 126,97 sur 1 399,70 : **80,5 %**. Le poids en soi est normal — 60 à 80 % est la norme, la VT capture toute la queue infinie des flux ; le DDM en deux étapes du cours fait pire, 35,92 sur 42,15, soit 85 %. Le vrai problème : ces 80 % reposent sur deux hypothèses perpétuelles invérifiables — une croissance et un taux — auxquelles la valeur réagit de façon explosive : sur l'exemple de Gordon, +25 % pour un point de croissance, −17 % pour un point de taux. L'essentiel de mon chiffre dépend des hypothèses que je connais le moins bien. Et allonger l'horizon ne résout rien : on déplace les mêmes hypothèses dans des flux tout aussi projetés.

D'où ma conclusion : un DCF n'est jamais « la » valeur, c'est une transformation d'hypothèses en prix. Je le présente en fourchette, avec une matrice de sensibilité croisant WACC et croissance terminale — et je le confronte aux multiples, le contrôle de cohérence du marché.`,
    reponseModeleEn: `I walk it through, then I criticise it — both are part of the exercise.

The walk-through. An asset is worth the sum of its discounted future cash flows. Three explicit FCF — 100, 110, 121 — a 10% WACC, a terminal value of 1,500 in year 3. Each discounted flow is worth 90.91; the three together, 272.73. The terminal value, expressed in year-3 euros, still has to be discounted: 1,500/1.1³ = 1,126.97. Total: **1,399.70**. Two faults fail the exercise at this stage: building the TV on the last explicit flow instead of the flow *following* the horizon, and forgetting to discount it. And I do not forget the nature of the output: FCF accrues to shareholders and creditors alike — it is an enterprise value, I subtract net debt to get the equity value.

Now the critique. The TV weighs 1,126.97 out of 1,399.70: **80.5%**. The weight itself is normal — 60 to 80% is the norm, the TV captures the entire infinite tail of the flows; the course two-stage DDM does worse, 35.92 out of 42.15, i.e. 85%. The real problem: those 80% rest on two unverifiable perpetual assumptions — a growth rate and a discount rate — to which the value reacts explosively: on the Gordon example, +25% for one point of growth, −17% for one point of rate. The bulk of my figure depends on the assumptions I know least well. And lengthening the horizon solves nothing: it shifts the same assumptions into flows that are just as projected.

Hence my conclusion: a DCF is never "the" value, it is a transformation of assumptions into a price. I present it as a range, with a sensitivity matrix crossing WACC and terminal growth — and I confront it with multiples, the market's sanity check.`,
  },
  {
    id: 'm3-jury-25',
    moduleId: M3,
    theme: 'synthèse',
    themeEn: 'capstone',
    difficulte: 4,
    question: 'Jeu de rôle : votre client veut un fonds actif « qui bat le marché ». Convainquez-le de passer en indiciel — puis faites l\'avocat du diable.',
    questionEn: 'Role play: your client wants an active fund "that beats the market". Convince him to go passive — then play devil\'s advocate.',
    plan: [
      "Le dossier indiciel : SPIVA, persistance, frais — l'alpha est rare, incertain et cher",
      "La logique sous-jacente : la forme semi-forte de l'efficience",
      "L'avocat du diable : concentration des indices, efficience fabriquée, anomalies",
      'Le verdict du candidat : indiciel par défaut, mais en connaissance de cause',
    ],
    planEn: [
      'The case for indexing: SPIVA, persistence, fees — alpha is rare, uncertain and expensive',
      'The underlying logic: the semi-strong form of efficiency',
      "The devil's advocate: index concentration, manufactured efficiency, anomalies",
      "The candidate's verdict: passive by default, but with eyes open",
    ],
    pointsAttendus: [
      "L'argument massue : selon les décomptes SPIVA, de l'ordre de 80 à 90 % des gérants actions font moins bien que leur indice sur dix ans — et la surperformance passée ne persiste guère : le palmarès d'hier n'est pas une boussole",
      "La logique : si l'information publique laissait des billets par terre, des milliers de professionnels suréquipés les ramasseraient — qu'ils n'y parviennent pas, en moyenne et après frais, est ce que prédit la forme semi-forte",
      "La conclusion pratique : si l'alpha est rare, incertain et cher, répliquer l'indice à coût minimal devient le choix par défaut — le raisonnement qui a porté fonds indiciels et ETF",
      "Avocat du diable, premier coup : « diversifié » est à vérifier — début 2026, le top 10 du S&P 500 pèse 35 à 40 % de l'indice ; choisir un indice, c'est déjà choisir une stratégie, la capi-pondération suit le momentum des poids",
      "Avocat du diable, second coup : l'efficience est fabriquée par la gestion active et les arbitragistes — l'indiciel en vit en passager clandestin ; et les marchés ne sont efficients que la plupart du temps : momentum, value, bulles récurrentes",
      "Le verdict : pour ce client, l'indiciel reste le choix par défaut rationnel — à condition de savoir quel indice, quelle pondération, quelle concentration il achète, et de juger toute alternative contre le bon indice, en rendement total",
    ],
    pointsAttendusEn: [
      'The knock-out argument: according to the SPIVA scorecards, on the order of 80 to 90% of equity managers do worse than their index over ten years — and past outperformance barely persists: yesterday\'s ranking is not a compass',
      'The logic: if public information left banknotes on the ground, thousands of over-equipped professionals would pick them up — that they fail to, on average and after fees, is what the semi-strong form predicts',
      'The practical conclusion: if alpha is rare, uncertain and expensive, replicating the index at minimal cost becomes the default choice — the reasoning that carried index funds and ETFs',
      "Devil's advocate, first strike: \"diversified\" must be checked — in early 2026, the S&P 500 top 10 weighs 35 to 40% of the index; choosing an index is already choosing a strategy, cap-weighting rides the momentum of weights",
      "Devil's advocate, second strike: efficiency is manufactured by active management and arbitrageurs — indexing free-rides on it; and markets are only efficient most of the time: momentum, value, recurring bubbles",
      'The verdict: for this client, indexing remains the rational default — provided he knows which index, which weighting, which concentration he is buying, and judges any alternative against the right index, in total return',
    ],
    bonus: [
      "La précision qui classe : un fonds se juge contre l'indice de rendement total — NR ou GR —, jamais contre l'indice prix ; la comparaison flatteuse au CAC 40 prix est le piège commercial classique",
      "Les limites de l'arbitrage en renfort : même une anomalie réelle ne se ramasse pas gratuitement — il faut du capital, des titres empruntables, et tenir pendant qu'elle s'aggrave",
    ],
    bonusEn: [
      'The precision that ranks you: a fund is judged against the total return index — NR or GR — never against the price index; the flattering comparison with the price CAC 40 is the classic sales trap',
      'The limits of arbitrage as backup: even a real anomaly cannot be picked up for free — you need capital, borrowable shares, and the ability to hold while it worsens',
    ],
    reponseModele: `Face au client, d'abord. « Vous cherchez un fonds qui bat le marché. Voici le chiffre qui doit guider votre décision : selon les décomptes SPIVA, de l'ordre de **80 à 90 %** des gérants actions font moins bien que leur indice sur dix ans — et la surperformance passée ne persiste guère : le palmarès d'hier ne prédit pas celui de demain. Ce n'est pas que les gérants soient mauvais, c'est que le jeu est dur : l'information publique est intégrée aux cours quelques instants après sa publication. Si des billets traînaient par terre, des milliers de professionnels suréquipés les auraient ramassés. L'alpha est rare, incertain et cher — répliquer l'indice à coût minimal est donc le choix par défaut rationnel. »

Puis l'avocat du diable, car le jury l'attend. Premier coup : « diversifié » est à vérifier. Début 2026, les dix premières capitalisations du S&P 500 pèsent 35 à 40 % de l'indice — plus d'un tiers du portefeuille en dix lignes exposées au même facteur. La capi-pondération suit le momentum des poids : choisir un indice, c'est déjà choisir une stratégie. Deuxième coup : l'efficience ne descend pas du ciel — elle est fabriquée par la gestion active et les arbitragistes ; l'indiciel en vit en passager clandestin. Et les marchés ne sont efficients que la plupart du temps : momentum, value et bulles récurrentes le rappellent.

Mon verdict de candidat : pour ce client, l'indiciel reste le bon conseil — mais en connaissance de cause. Savoir quel indice il achète, quelle pondération, quelle concentration ; et juger toute alternative contre le bon étalon : l'indice de rendement total, NR ou GR, jamais l'indice prix — la comparaison flatteuse au CAC 40 prix est le piège commercial classique.`,
    reponseModeleEn: `Facing the client, first. "You are looking for a fund that beats the market. Here is the number that should guide your decision: according to the SPIVA scorecards, on the order of **80 to 90%** of equity managers do worse than their index over ten years — and past outperformance barely persists: yesterday's ranking does not predict tomorrow's. It is not that managers are bad, it is that the game is hard: public information is built into prices moments after publication. If banknotes were lying on the ground, thousands of over-equipped professionals would have picked them up. Alpha is rare, uncertain and expensive — replicating the index at minimal cost is therefore the rational default choice."

Then the devil's advocate, because the panel expects it. First strike: "diversified" must be checked. In early 2026, the ten largest capitalisations of the S&P 500 weigh 35 to 40% of the index — more than a third of the portfolio in ten lines exposed to the same factor. Cap-weighting rides the momentum of weights: choosing an index is already choosing a strategy. Second strike: efficiency does not fall from the sky — it is manufactured by active management and arbitrageurs; indexing free-rides on it. And markets are only efficient most of the time: momentum, value and recurring bubbles are the reminders.

My candidate's verdict: for this client, indexing remains the right advice — but with eyes open. Knowing which index he is buying, which weighting, which concentration; and judging any alternative against the right yardstick: the total return index, NR or GR, never the price index — the flattering comparison with the price CAC 40 is the classic sales trap.`,
  },
];
