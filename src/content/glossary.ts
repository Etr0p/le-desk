import type { GlossaireEntree } from '../engine/types';

const M4 = '04-taux-obligations';
const M2 = '02-methodes-quantitatives';
const M1 = '01-panorama-marches';
const M3 = '03-actions-indices';

export const glossaire: GlossaireEntree[] = [
  {
    terme: '2s10s',
    definition:
      'Spread de courbe le plus suivi : taux 10 ans moins taux 2 ans, exprimé en points de base. Négatif, il signale une courbe inversée — l\'indicateur avancé de récession le plus célèbre de la macroéconomie.',
    definitionEn:
      'The most watched curve spread: the 10-year yield minus the 2-year yield, expressed in basis points. When negative, it signals an inverted curve — the most famous recession leading indicator in macroeconomics.',
    moduleId: M4,
  },
  {
    terme: 'adjudication',
    en: 'auction',
    definition:
      'Mode d\'émission des titres d\'État français : l\'AFT sert les ordres des SVT du prix le plus élevé au plus bas, et chaque ordre servi paie le prix qu\'il a demandé (enchère à prix multiples). BTF chaque semaine, OAT chaque mois.',
    definitionEn:
      'The issuance method for French government securities: the AFT fills primary dealers\' bids from the highest price down, and each filled bid pays its own price (multiple-price auction). BTFs are auctioned weekly, OATs monthly.',
    moduleId: M4,
  },
  {
    terme: 'base Exact/360',
    en: 'Act/360 day count',
    definition:
      'Convention de décompte du marché monétaire euro : jours calendaires réels au numérateur, année forfaitaire de 360 jours au dénominateur. À taux affiché égal, elle verse environ 1,4 % d\'intérêts de plus en relatif qu\'une base 365.',
    definitionEn:
      'The euro money market\'s day-count convention: actual calendar days in the numerator over a standardized 360-day year. At the same quoted rate, it pays roughly 1.4% more interest in relative terms than a 365-day basis.',
    moduleId: M4,
  },
  {
    terme: 'bootstrapping',
    definition:
      'Méthode d\'extraction de proche en proche des taux zéro-coupon à partir des prix d\'obligations couponnées : z₁ donne z₂, qui donne z₃, etc. C\'est la courbe ainsi reconstruite — et non la courbe des YTM — qu\'utilisent les pricers.',
    definitionEn:
      'The step-by-step extraction of zero-coupon rates from coupon-bond prices: z₁ gives z₂, which gives z₃, and so on. Pricing systems use this reconstructed zero curve — not the curve of quoted YTMs.',
    moduleId: M4,
  },
  {
    terme: 'BTF',
    definition:
      'Bon du Trésor à taux fixe et à intérêts précomptés : titre de dette de l\'État français à moins d\'un an, fonctionnant en zéro-coupon, émis chaque semaine par adjudication.',
    definitionEn:
      'A French Treasury bill: a fixed-rate, discount-basis government security with a maturity under one year, working as a zero-coupon and auctioned weekly.',
    moduleId: M4,
  },
  {
    terme: 'Bund',
    definition:
      'Obligation de l\'État fédéral allemand, considérée comme la référence « sans risque » de la zone euro : les autres dettes souveraines en euro se mesurent en spread au-dessus de lui.',
    definitionEn:
      'The German federal government bond, regarded as the euro area\'s risk-free benchmark: other euro-denominated sovereign debts are measured as a spread above it.',
    moduleId: M4,
  },
  {
    terme: 'convexité',
    en: 'convexity',
    definition:
      'Courbure de la relation prix-taux. Le terme correctif en ½C(Δy)² est positif dans les deux sens : la convexité amortit les pertes en cas de hausse des taux et amplifie les gains en cas de baisse — à duration égale, c\'est une qualité qui se paie.',
    definitionEn:
      'The curvature of the price-yield relationship. The ½C(Δy)² correction term is positive in both directions: convexity cushions losses when rates rise and amplifies gains when they fall — at equal duration, a quality the market pays for.',
    moduleId: M4,
  },
  {
    terme: 'coupon',
    definition:
      'Intérêt périodique versé par l\'émetteur d\'une obligation, exprimé en pourcentage du nominal. Sur un titre à taux fixe, il est gravé dans le contrat et ne s\'ajuste jamais aux conditions de marché.',
    definitionEn:
      'The periodic interest paid by a bond\'s issuer, expressed as a percentage of face value. On a fixed-rate bond it is written into the contract and never adjusts to market conditions.',
    moduleId: M4,
  },
  {
    terme: 'coupon couru',
    en: 'accrued interest',
    definition:
      'Fraction du coupon accumulée depuis le dernier détachement, que l\'acheteur règle au vendeur en plus du prix coté. Prix sale = prix propre + coupon couru.',
    definitionEn:
      'The fraction of the coupon accumulated since the last payment date, which the buyer pays the seller on top of the quoted price. Dirty price = clean price + accrued interest.',
    moduleId: M4,
  },
  {
    terme: 'courbe des taux',
    en: 'yield curve',
    definition:
      'Ensemble des rendements actuariels d\'un même émetteur classés par maturité, à un instant donné. La courbe souveraine de chaque devise sert d\'étalon au pricing de tous les autres actifs.',
    definitionEn:
      'The set of one issuer\'s yields to maturity arranged by maturity at a given moment. Each currency\'s sovereign curve serves as the pricing benchmark for all other assets.',
    moduleId: M4,
  },
  {
    terme: 'démembrement',
    en: 'stripping',
    definition:
      'Séparation des coupons et du principal d\'une obligation en autant de zéro-coupons négociables indépendamment (OAT démembrées, ou strips). Permet d\'adosser un engagement à date fixe avec une duration exactement égale à la maturité.',
    definitionEn:
      'Separating a bond\'s coupons and principal into independently tradable zero-coupons (stripped OATs, or strips). It lets investors match a fixed-date liability with a duration exactly equal to maturity.',
    moduleId: M4,
  },
  {
    terme: 'duration de Macaulay',
    en: 'Macaulay duration',
    definition:
      'Moyenne des dates des flux d\'une obligation, chaque date étant pondérée par le poids du flux actualisé dans le prix : le barycentre temporel, exprimé en années. Celle d\'un zéro-coupon égale exactement sa maturité.',
    definitionEn:
      'The average of a bond\'s cash-flow dates, each weighted by the discounted flow\'s share of the price: the time centre of gravity, expressed in years. A zero-coupon\'s Macaulay duration equals its maturity exactly.',
    moduleId: M4,
  },
  {
    terme: 'duration modifiée',
    en: 'modified duration',
    definition:
      'Facteur de sensibilité du prix au taux : D_mod = D_Mac/(1+y), sans unité. Une duration modifiée de 6 signifie environ 6 % de perte de prix pour une hausse de 1 point du taux.',
    definitionEn:
      'The bond\'s price sensitivity factor to yield: D_mod = D_Mac/(1+y), unitless. A modified duration of 6 means roughly a 6% price loss for a 1-point rise in yield.',
    moduleId: M4,
  },
  {
    terme: 'DV01',
    en: 'dollar value of a basis point',
    definition:
      'Variation en monnaie d\'une position pour un mouvement de 1 point de base des taux : DV01 ≈ duration modifiée × valeur de marché × 0,0001. C\'est l\'unité de risque que les desks s\'échangent au quotidien.',
    definitionEn:
      'The money change in a position\'s value for a 1 basis point move in yields: DV01 ≈ modified duration × market value × 0.0001. It is the unit of risk that desks trade in daily.',
    moduleId: M4,
  },
  {
    terme: '€STR',
    en: 'euro short-term rate',
    definition:
      'Taux au jour le jour de la zone euro, calculé chaque jour par la BCE à partir des transactions réelles d\'emprunt en blanc déclarées par les banques. C\'est la référence du taux « sans risque » au jour le jour en euro.',
    definitionEn:
      'The euro area\'s overnight rate, computed daily by the ECB from the actual unsecured borrowing transactions reported by banks. It is the benchmark for the overnight risk-free rate in euros.',
    moduleId: M4,
  },
  {
    terme: 'Euribor',
    definition:
      'Taux interbancaire offert en euro, publié quotidiennement pour des horizons de 1 semaine à 12 mois à partir des contributions d\'un panel de banques. Contrairement à l\'€STR, il incorpore un risque de crédit et de terme.',
    definitionEn:
      'The euro interbank offered rate, published daily for tenors from 1 week to 12 months based on a panel of banks\' contributions. Unlike €STR, it embeds credit and term risk.',
    moduleId: M4,
  },
  {
    terme: 'FRN',
    en: 'floating rate note',
    definition:
      'Obligation à taux variable : le coupon est réindexé à chaque fixing sur un taux monétaire (typiquement Euribor 3 mois plus une marge). Son prix reste proche du pair tant que la qualité de crédit de l\'émetteur est stable.',
    definitionEn:
      'A floating rate note: the coupon resets at each fixing off a money-market rate (typically 3-month Euribor plus a margin). Its price stays close to par as long as the issuer\'s credit quality is stable.',
    moduleId: M4,
  },
  {
    terme: 'GC / spécial',
    en: 'general collateral / special',
    definition:
      'Au repo, un titre est GC quand n\'importe quel titre d\'un panier de qualité convient en garantie : le taux GC suit les taux directeurs. Un titre devient « spécial » quand il est spécifiquement recherché : son taux repo passe sous le GC, et l\'écart mesure l\'intensité de la demande.',
    definitionEn:
      'In the repo market, a security is general collateral (GC) when any bond from a quality basket will do as collateral: the GC rate tracks policy rates. A bond goes "special" when it is specifically sought after: its repo rate falls below GC, and the gap measures the intensity of demand.',
    moduleId: M4,
  },
  {
    terme: 'haircut',
    en: 'haircut',
    definition:
      'Décote appliquée à la valeur des titres mis en pension : avec un haircut de 2 %, 10 M€ de titres ne lèvent que 9,8 M€ de cash. Elle protège le prêteur contre une baisse du collatéral pendant l\'opération.',
    definitionEn:
      'The discount applied to the value of securities pledged in a repo: with a 2% haircut, €10m of securities raises only €9.8m of cash. It protects the lender against a fall in the collateral\'s value during the trade.',
    moduleId: M4,
  },
  {
    terme: 'immunisation',
    en: 'immunization',
    definition:
      'Technique de gestion actif-passif : égaliser la duration de l\'actif et celle du passif (à valeurs actuelles égales) pour neutraliser, au premier ordre, l\'effet d\'un mouvement de taux — effet prix et effet réinvestissement se compensent à l\'horizon de la duration.',
    definitionEn:
      'An asset-liability management technique: matching the duration of assets and liabilities (at equal present values) to neutralize, to first order, the effect of a rate move — the price effect and the reinvestment effect offset at the duration horizon.',
    moduleId: M4,
  },
  {
    terme: 'inversion de courbe',
    en: 'inverted yield curve',
    definition:
      'Configuration où les taux courts dépassent les taux longs : le marché anticipe des baisses de taux directeurs, scénario typique de ralentissement économique. Signal historiquement sérieux (1980, 1990, 2001, 2008), mais pas un oracle.',
    definitionEn:
      'A configuration where short rates exceed long rates: the market expects policy-rate cuts, the typical economic slowdown scenario. A historically serious signal (1980, 1990, 2001, 2008), but not an oracle.',
    moduleId: M4,
  },
  {
    terme: 'maturité',
    en: 'maturity',
    definition:
      'Date de remboursement du nominal d\'une obligation, aussi appelée échéance. Elle date le dernier flux mais ne mesure pas à elle seule la sensibilité aux taux : c\'est le rôle de la duration.',
    definitionEn:
      'The date on which a bond\'s face value is repaid. It dates the final cash flow but does not by itself measure rate sensitivity: that is duration\'s job.',
    moduleId: M4,
  },
  {
    terme: 'nominal',
    en: 'face value',
    definition:
      'Capital unitaire emprunté représenté par le titre, remboursé à maturité. Le coupon s\'exprime en pourcentage du nominal, et le prix cote en pourcentage du nominal.',
    definitionEn:
      'The unit principal borrowed through the security, repaid at maturity. The coupon is expressed as a percentage of face value, and the price is quoted as a percentage of face value.',
    moduleId: M4,
  },
  {
    terme: 'OAT',
    definition:
      'Obligation assimilable du Trésor : titre de dette à moyen-long terme de l\'État français, émis par adjudication mensuelle par l\'Agence France Trésor. La souche 10 ans la plus récente sert de référence au marché français.',
    definitionEn:
      'Obligation assimilable du Trésor: the French government\'s medium- to long-term debt security, auctioned monthly by Agence France Trésor. The most recent 10-year line serves as the French market benchmark.',
    moduleId: M4,
  },
  {
    terme: 'OATi',
    definition:
      'OAT indexée sur l\'inflation française hors tabac : le nominal est multiplié par un coefficient d\'indexation et le coupon, un taux réel fixe, s\'applique à ce nominal indexé. L\'OAT€i suit l\'inflation de la zone euro.',
    definitionEn:
      'An OAT indexed to French ex-tobacco inflation: the principal is multiplied by an index ratio and the coupon — a fixed real rate — applies to that indexed principal. The OAT€i tracks euro-area inflation.',
    moduleId: M4,
  },
  {
    terme: 'obligation',
    en: 'bond',
    definition:
      'Titre de créance négociable : l\'émetteur emprunte un nominal, verse un coupon périodique et rembourse à maturité. À la différence d\'un prêt bancaire, le titre s\'achète et se revend librement sur un marché.',
    definitionEn:
      'A tradable debt security: the issuer borrows a face amount, pays a periodic coupon and repays at maturity. Unlike a bank loan, the security can be freely bought and sold in a market.',
    moduleId: M4,
  },
  {
    terme: 'prix propre',
    en: 'clean price',
    definition:
      'Prix coté sur les écrans, hors coupon couru — dit aussi « pied de coupon ». Cette convention neutralise la mécanique calendaire du couru pour ne refléter que les conditions de marché.',
    definitionEn:
      'The price quoted on screens, excluding accrued interest. This convention strips out the calendar mechanics of accruals so the quote reflects market conditions only.',
    moduleId: M4,
  },
  {
    terme: 'prix sale',
    en: 'dirty price',
    definition:
      'Montant effectivement réglé à l\'achat d\'une obligation — dit aussi « plein coupon » : prix propre plus coupon couru.',
    definitionEn:
      'The amount actually paid when buying a bond: the clean price plus accrued interest.',
    moduleId: M4,
  },
  {
    terme: 'rendement actuariel',
    en: 'yield to maturity',
    definition:
      'Taux unique qui égalise le prix observé d\'une obligation et la somme de ses flux actualisés : le TRI de l\'investissement. C\'est un rendement promis sous conditions — détention jusqu\'à maturité et réinvestissement des coupons au même taux —, pas un rendement garanti.',
    definitionEn:
      'The single rate that equates a bond\'s observed price with the sum of its discounted cash flows: the investment\'s IRR. It is a promised return under conditions — holding to maturity and reinvesting coupons at the same rate — not a guaranteed one.',
    moduleId: M4,
  },
  {
    terme: 'rendement courant',
    en: 'current yield',
    definition:
      'Coupon annuel rapporté au prix payé. Mesure instantanée qui ignore le remboursement et le calendrier des flux : sur un titre en surcote elle surestime le rendement complet, sur un titre décoté elle le sous-estime.',
    definitionEn:
      'The annual coupon divided by the price paid. An instant measure that ignores redemption and cash-flow timing: it overstates the full return on a premium bond and understates it on a discount bond.',
    moduleId: M4,
  },
  {
    terme: 'repo',
    en: 'repurchase agreement',
    definition:
      'Pension livrée : vente de titres assortie de l\'engagement de les racheter à une date et un prix convenus — économiquement, un prêt de cash garanti par des titres. C\'est le mécanisme central de financement des desks obligataires et de formation des taux courts.',
    definitionEn:
      'A repurchase agreement: the sale of securities combined with a commitment to buy them back at an agreed date and price — economically, a cash loan secured by securities. The core mechanism for funding bond desks and for short-rate formation.',
    moduleId: M4,
  },
  {
    terme: 'spread souverain',
    en: 'sovereign spread',
    definition:
      'Écart de rendement actuariel entre deux dettes souveraines de même maturité, exprimé en points de base — OAT-Bund pour la France. Toujours une différence de rendements, jamais de prix, et à décomposer jambe par jambe avant interprétation.',
    definitionEn:
      'The yield-to-maturity gap between two sovereign debts of the same maturity, expressed in basis points — OAT-Bund for France. Always a difference of yields, never of prices, and to be decomposed leg by leg before interpreting.',
    moduleId: M4,
  },
  {
    terme: 'SVT',
    en: 'primary dealer',
    definition:
      'Spécialiste en valeurs du Trésor : banque agréée par l\'AFT qui s\'engage à soumissionner aux adjudications et à coter en continu la dette française au marché secondaire. Ils sont une quinzaine.',
    definitionEn:
      'A French primary dealer (Spécialiste en valeurs du Trésor): a bank approved by the AFT that commits to bidding at auctions and quoting French government debt continuously in the secondary market. There are about fifteen of them.',
    moduleId: M4,
  },
  {
    terme: 'syndication',
    definition:
      'Mode d\'émission où un syndicat de banques sonde les investisseurs, construit le livre d\'ordres, cale le prix et alloue les titres. Voie normale des entreprises — et des États pour les souches nouvelles ou très longues.',
    definitionEn:
      'An issuance method in which a bank syndicate sounds out investors, builds the order book, sets the price and allocates the bonds. The standard route for corporates — and for sovereigns launching new or very long lines.',
    moduleId: M4,
  },
  {
    terme: 'taux forward',
    en: 'forward rate',
    definition:
      'Taux à terme implicite contenu dans la courbe : celui qui rend équivalents un placement long d\'un bloc et un placement court roulé. Un fait arithmétique imposé par l\'absence d\'arbitrage — pas une prévision des taux futurs.',
    definitionEn:
      'The term rate implied by today\'s curve: the rate that makes a single long placement equivalent to rolling shorter ones. An arithmetic fact imposed by no-arbitrage — not a forecast of future rates.',
    moduleId: M4,
  },
  {
    terme: 'Treasury',
    definition:
      'Titre de dette de l\'État fédéral américain : T-bills à moins d\'un an, notes et bonds au-delà. La courbe des Treasuries est la référence mondiale du « sans risque » en dollar.',
    definitionEn:
      'Debt of the US federal government: T-bills under one year, notes and bonds beyond. The Treasury curve is the world\'s risk-free benchmark in dollars.',
    moduleId: M4,
  },
  {
    terme: 'zéro-coupon',
    en: 'zero-coupon bond',
    definition:
      'Obligation sans flux intermédiaire : un seul versement, le nominal, à l\'échéance — vendue sous le pair. Seul titre dont le rendement à maturité est verrouillé à l\'achat et dont la duration égale exactement la maturité.',
    definitionEn:
      'A bond with no intermediate cash flow: a single payment, the face value, at maturity — sold below par. The only bond whose return to maturity is locked in at purchase and whose duration exactly equals its maturity.',
    moduleId: M4,
  },

  // ───────── Module 2 — Méthodes quantitatives & probabilités ─────────
  {
    terme: 'valeur actuelle / valeur future',
    en: 'present value / future value (PV/FV)',
    definition:
      'Les deux faces de la valeur temps de l\'argent : VA = VF/(1+r)ⁿ ramène un flux futur à aujourd\'hui, VF = VA(1+r)ⁿ le projette dans le futur. L\'additivité des valeurs actuelles permet de valoriser n\'importe quel échéancier flux par flux.',
    definitionEn:
      'The two faces of the time value of money: PV = FV/(1+r)ⁿ brings a future flow back to today, FV = PV(1+r)ⁿ projects it forward. The additivity of present values lets you price any cash-flow schedule flow by flow.',
    moduleId: M2,
  },
  {
    terme: 'annuité',
    en: 'annuity',
    definition:
      'Série de flux constants versés à intervalles réguliers pendant n périodes, premier flux dans une période (convention de fin de période). VA = F × (1−(1+r)⁻ⁿ)/r — le motif des mensualités de prêt, des loyers et des coupons.',
    definitionEn:
      'A series of constant cash flows paid at regular intervals over n periods, first flow one period from now (end-of-period convention). PV = F × (1−(1+r)⁻ⁿ)/r — the pattern of loan payments, rents and coupons.',
    moduleId: M2,
  },
  {
    terme: 'perpétuité',
    en: 'perpetuity',
    definition:
      'Annuité sans fin, de valeur pourtant finie : P = F/r. 50 € par an à 4 % valent 1 250 € — le capital qui produit exactement le flux en intérêts, éternellement. Si un flux tombe aussi aujourd\'hui : P = F + F/r.',
    definitionEn:
      'An annuity that never ends, yet with a finite value: P = F/r. €50 a year at 4% is worth €1,250 — the principal that yields exactly the flow in interest, forever. If a flow is also paid today: P = F + F/r.',
    moduleId: M2,
  },
  {
    terme: 'VAN',
    en: 'net present value (NPV)',
    definition:
      'Somme des flux actualisés au coût du capital, investissement initial déduit. Positive on accepte, négative on refuse — et en cas de conflit avec le TRI, c\'est elle qui tranche, car elle compte la création de valeur en euros.',
    definitionEn:
      'The sum of cash flows discounted at the cost of capital, minus the initial outlay. Positive: accept; negative: reject — and when it conflicts with the IRR, NPV decides, because it counts value creation in euros.',
    moduleId: M2,
  },
  {
    terme: 'TRI',
    en: 'internal rate of return (IRR)',
    definition:
      'Le taux d\'actualisation qui annule la VAN : le rendement intrinsèque d\'un projet, à comparer au coût du capital — jamais à zéro. Piégeux : flux non conventionnels → TRI multiples ou absents ; pourcentage aveugle à la taille du projet.',
    definitionEn:
      'The discount rate that sets NPV to zero: a project\'s intrinsic return, to be compared with the cost of capital — never with zero. Treacherous: non-conventional flows → multiple or missing IRRs; a percentage blind to project size.',
    moduleId: M2,
  },
  {
    terme: 'moyenne géométrique',
    en: 'geometric mean',
    definition:
      'Le taux constant composé qui aurait produit la même richesse finale : [Π(1+rᵢ)]^(1/n) − 1. La seule mesure de la performance réellement obtenue sur plusieurs périodes ; toujours inférieure ou égale à la moyenne arithmétique (écart ≈ σ²/2, le volatility drag).',
    definitionEn:
      'The constant compounded rate that would have produced the same final wealth: [Π(1+rᵢ)]^(1/n) − 1. The only measure of performance actually earned over several periods; always at most the arithmetic mean (gap ≈ σ²/2, the volatility drag).',
    moduleId: M2,
  },
  {
    terme: 'volatilité',
    en: 'volatility',
    definition:
      'L\'écart-type des rendements — la mesure standard du risque, calculée avec le dénominateur n−1. Un indice actions calme vit autour de 15 % annualisés ; au-delà de 30 %, le marché est en stress.',
    definitionEn:
      'The standard deviation of returns — the standard risk measure, computed with the n−1 denominator. A calm equity index lives around 15% annualized; above 30%, the market is in stress.',
    moduleId: M2,
  },
  {
    terme: 'annualisation',
    en: 'annualization',
    definition:
      'Conversion d\'une statistique à l\'échelle annuelle. La volatilité croît en racine du temps (×√252 depuis le quotidien, √252 ≈ 16), le rendement moyen en ×252 : confondre les deux règles est l\'erreur d\'unité classique.',
    definitionEn:
      'Converting a statistic to an annual scale. Volatility grows with the square root of time (×√252 from daily, √252 ≈ 16), the mean return by ×252: mixing up the two rules is the classic unit error.',
    moduleId: M2,
  },
  {
    terme: 'covariance',
    en: 'covariance',
    definition:
      'Mesure du co-mouvement de deux séries autour de leurs moyennes : positive si elles s\'écartent du même côté en même temps. Unité illisible (%²) et amplitude dépendante des volatilités — d\'où la corrélation, qui la normalise.',
    definitionEn:
      'A measure of how two series co-move around their means: positive when they deviate on the same side at the same time. An unreadable unit (%²) and a magnitude that depends on volatilities — hence correlation, which normalizes it.',
    moduleId: M2,
  },
  {
    terme: 'corrélation',
    en: 'correlation',
    definition:
      'La covariance normalisée, ρ = s_AB/(s_A·s_B), toujours entre −1 et +1. Ne capte que les liaisons linéaires, n\'implique jamais la causalité — et, estimée par temps calme, s\'envole vers 1 en période de crise.',
    definitionEn:
      'Covariance normalized, ρ = s_AB/(s_A·s_B), always between −1 and +1. It only captures linear relationships, never implies causation — and, estimated in calm times, shoots towards 1 in a crisis.',
    moduleId: M2,
  },
  {
    terme: 'skewness',
    en: 'skewness',
    definition:
      'Le coefficient d\'asymétrie d\'une distribution, nul si elle est symétrique. Le signe se lit du côté de la queue longue : négative = petits gains fréquents et rares pertes massives (vendeur d\'options) ; positive = profil billet de loterie.',
    definitionEn:
      'The asymmetry coefficient of a distribution, zero when symmetric. The sign reads off the long-tail side: negative = frequent small gains and rare massive losses (option seller); positive = lottery-ticket profile.',
    moduleId: M2,
  },
  {
    terme: 'kurtosis',
    en: 'kurtosis',
    definition:
      'Le coefficient d\'aplatissement : le poids des queues d\'une distribution. La normale vaut exactement 3 ; au-delà, la distribution est leptokurtique, à queues épaisses — le cas presque systématique des rendements financiers quotidiens.',
    definitionEn:
      'The tail-weight coefficient of a distribution. The normal scores exactly 3; above that, the distribution is leptokurtic, fat-tailed — almost always the case for daily financial returns.',
    moduleId: M2,
  },
  {
    terme: 'probabilité conditionnelle',
    en: 'conditional probability',
    definition:
      'P(A|B) = P(A∩B)/P(B) : la probabilité de A quand l\'univers est restreint aux cas où B est vrai. Le sens du conditionnement compte : P(A|B) ≠ P(B|A) — la confusion des deux est le sophisme du procureur.',
    definitionEn:
      'P(A|B) = P(A∩B)/P(B): the probability of A when the universe is restricted to cases where B holds. The direction of conditioning matters: P(A|B) ≠ P(B|A) — confusing the two is the prosecutor\'s fallacy.',
    moduleId: M2,
  },
  {
    terme: 'théorème de Bayes',
    en: 'Bayes\' theorem',
    definition:
      'La formule qui retourne le conditionnement : passer de P(B|A) à P(A|B) via les probabilités totales. Le réflexe : penser en effectifs — test fiable à 99 %, maladie à 1 % → seulement 1 chance sur 6 d\'être malade sur test positif.',
    definitionEn:
      'The formula that flips conditioning: going from P(B|A) to P(A|B) through total probabilities. The reflex: think in headcounts — a 99% reliable test, a 1% prevalence → only a 1-in-6 chance of being sick on a positive test.',
    moduleId: M2,
  },
  {
    terme: 'indépendance',
    en: 'independence',
    definition:
      'Deux événements sont indépendants si P(A∩B) = P(A)P(B) : la réalisation de l\'un ne change rien à la probabilité de l\'autre. À ne pas confondre avec incompatibles — et corrélation nulle n\'implique pas indépendance.',
    definitionEn:
      'Two events are independent if P(A∩B) = P(A)P(B): one occurring changes nothing about the other\'s probability. Not to be confused with mutually exclusive — and zero correlation does not imply independence.',
    moduleId: M2,
  },
  {
    terme: 'loi binomiale',
    en: 'binomial distribution',
    definition:
      'La loi du nombre de succès sur n essais indépendants à probabilité p : P(X=k) = C(n,k)·pᵏ(1−p)ⁿ⁻ᵏ, espérance np. C\'est la structure exacte de l\'arbre binomial du pricing d\'options.',
    definitionEn:
      'The law of the number of successes over n independent trials with probability p: P(X=k) = C(n,k)·pᵏ(1−p)ⁿ⁻ᵏ, expectation np. The exact structure of the binomial tree used in option pricing.',
    moduleId: M2,
  },
  {
    terme: 'loi normale',
    en: 'normal distribution',
    definition:
      'La cloche gaussienne, entièrement décrite par μ et σ : 68,3 % de la masse dans ±1σ, 95,4 % dans ±2σ, 99,7 % dans ±3σ. Excellente approximation au centre de la distribution, fausse dans les queues — le péché est de l\'oublier.',
    definitionEn:
      'The Gaussian bell, fully described by μ and σ: 68.3% of the mass within ±1σ, 95.4% within ±2σ, 99.7% within ±3σ. An excellent approximation at the center of the distribution, wrong in the tails — the sin is forgetting it.',
    moduleId: M2,
  },
  {
    terme: 'loi lognormale',
    en: 'lognormal distribution',
    definition:
      'X est lognormale si ln X est normale : support strictement positif, queue étirée à droite. La loi des prix — les rendements composés s\'additionnent en logarithme, le TCL normalise la somme — et l\'hypothèse du modèle de Black-Scholes.',
    definitionEn:
      'X is lognormal if ln X is normal: strictly positive support, tail stretched to the right. The law of prices — compounded returns add in logs, the CLT normalizes the sum — and the assumption behind Black-Scholes.',
    moduleId: M2,
  },
  {
    terme: 'z-score',
    en: 'z-score',
    definition:
      'La distance à la moyenne comptée en écarts-types : z = (x−μ)/σ, le passage à la normale centrée réduite. Valeurs fétiches : Φ(1,96) = 0,9750 (bilatéral 95 %) et 1,645 (unilatéral 95 %).',
    definitionEn:
      'The distance to the mean counted in standard deviations: z = (x−μ)/σ, the bridge to the standard normal. Fetish values: Φ(1.96) = 0.9750 (two-sided 95%) and 1.645 (one-sided 95%).',
    moduleId: M2,
  },
  {
    terme: 'théorème central limite',
    en: 'central limit theorem (CLT)',
    definition:
      'La moyenne d\'échantillon devient approximativement N(μ, σ/√n) quand n grandit, quelle que soit la loi de départ (variance finie). LE théorème de la finance : prix lognormaux, binomiale → normale, intervalles de confiance et Monte-Carlo en découlent.',
    definitionEn:
      'The sample mean becomes approximately N(μ, σ/√n) as n grows, whatever the starting law (finite variance). THE theorem of finance: lognormal prices, binomial → normal, confidence intervals and Monte Carlo all flow from it.',
    moduleId: M2,
  },
  {
    terme: 'erreur standard',
    en: 'standard error',
    definition:
      'L\'écart-type d\'un estimateur — pour la moyenne, σ/√n : de combien le chiffre calculé bougerait d\'un échantillon à l\'autre. Diviser l\'erreur par 2 exige de quadrupler n : la précision coûte quadratiquement cher en données.',
    definitionEn:
      'The standard deviation of an estimator — for the mean, σ/√n: how much the computed figure would move from one sample to the next. Halving the error requires quadrupling n: precision is quadratically expensive in data.',
    moduleId: M2,
  },
  {
    terme: 'intervalle de confiance',
    en: 'confidence interval',
    definition:
      'À 95 % : x̄ ± 1,96·σ/√n. La confiance qualifie la méthode, pas l\'intervalle calculé : en répétant l\'échantillonnage, 95 % des intervalles ainsi construits contiendraient μ — celui qu\'on a calculé le contient ou non, sans probabilité attachée.',
    definitionEn:
      'At 95%: x̄ ± 1.96·σ/√n. The confidence qualifies the method, not the computed interval: repeating the sampling, 95% of intervals built this way would contain μ — the one you computed either does or does not, with no probability attached.',
    moduleId: M2,
  },
  {
    terme: 'hypothèse nulle',
    en: 'null hypothesis',
    definition:
      'L\'hypothèse de l\'absence d\'effet (H₀), présumée vraie tant que les données n\'apportent pas une preuve forte du contraire — la présomption d\'innocence statistique. Ne pas la rejeter ne la prouve jamais : acquitté ne veut pas dire innocent.',
    definitionEn:
      'The no-effect hypothesis (H₀), presumed true until the data provide strong evidence to the contrary — statistical presumption of innocence. Failing to reject it never proves it: acquitted does not mean innocent.',
    moduleId: M2,
  },
  {
    terme: 'p-value',
    en: 'p-value',
    definition:
      'La probabilité, si H₀ est vraie, d\'observer un écart au moins aussi extrême que celui constaté : P(données | H₀), jamais P(H₀ | données). Elle mesure la surprise sous l\'hypothèse du hasard, pas la probabilité du talent.',
    definitionEn:
      'The probability, if H₀ is true, of observing a gap at least as extreme as the one seen: P(data | H₀), never P(H₀ | data). It measures surprise under the chance hypothesis, not the probability of skill.',
    moduleId: M2,
  },
  {
    terme: 'erreurs de type I et II',
    en: 'type I and type II errors',
    definition:
      'Type I : rejeter H₀ vraie — fausse alerte, probabilité α. Type II : rater un effet réel — probabilité β. Le radar : trop sensible, il sonne sur les oiseaux ; trop sourd, il laisse passer les avions. Abaisser α rend mécaniquement le radar plus sourd.',
    definitionEn:
      'Type I: rejecting a true H₀ — false alarm, probability α. Type II: missing a real effect — probability β. The radar: too sensitive, it rings on birds; too deaf, it misses aircraft. Lowering α mechanically makes the radar deafer.',
    moduleId: M2,
  },
  {
    terme: 'puissance',
    en: 'statistical power',
    definition:
      'La probabilité 1−β de détecter un effet qui existe réellement. Durcir le seuil α la fait chuter ; le seul moyen d\'améliorer fausses alertes ET détections ratées à la fois est d\'augmenter n, qui resserre l\'erreur standard σ/√n.',
    definitionEn:
      'The probability 1−β of detecting an effect that really exists. Tightening α makes it fall; the only way to improve both false alarms AND missed detections is to raise n, which shrinks the standard error σ/√n.',
    moduleId: M2,
  },
  {
    terme: 'data snooping',
    en: 'data snooping',
    definition:
      'La fouille de données : tester des dizaines de stratégies et ne montrer que celles qui « marchent ». Sur 100 stratégies nulles testées à 5 %, P(au moins une significative) = 1 − 0,95¹⁰⁰ ≈ 99,4 % — la découverte est garantie d\'avance.',
    definitionEn:
      'Data mining gone wrong: testing dozens of strategies and only showing those that "work". Across 100 worthless strategies tested at 5%, P(at least one significant) = 1 − 0.95¹⁰⁰ ≈ 99.4% — the discovery is guaranteed in advance.',
    moduleId: M2,
  },
  {
    terme: 'biais du survivant',
    en: 'survivorship bias',
    definition:
      'Les fonds morts disparaissent des bases de données : mesurer la performance moyenne des fonds existants revient à moyenner les gagnants en oubliant les disparus — l\'échantillon est truqué avant même le test.',
    definitionEn:
      'Dead funds vanish from databases: measuring the average performance of existing funds means averaging the winners while forgetting the departed — the sample is rigged before the test even starts.',
    moduleId: M2,
  },
  {
    terme: 'régression linéaire',
    en: 'linear regression',
    definition:
      'La droite des moindres carrés y = a + bx, avec b = cov(x,y)/var(x) et passage par le point moyen. Règle absolue du desk : régresser des rendements, jamais des prix — deux séries tendancielles fabriquent un R² fallacieux.',
    definitionEn:
      'The least-squares line y = a + bx, with b = cov(x,y)/var(x), passing through the mean point. The desk\'s absolute rule: regress returns, never prices — two trending series manufacture a spurious R².',
    moduleId: M2,
  },
  {
    terme: 'beta',
    en: 'beta',
    definition:
      'La pente de la régression des rendements d\'un titre sur ceux du marché : sa sensibilité moyenne. β = 1,35, le titre amplifie le marché de 35 % ; β = 0,5, il amortit. L\'ordonnée à l\'origine préfigure l\'alpha.',
    definitionEn:
      'The slope of the regression of a stock\'s returns on the market\'s: its average sensitivity. β = 1.35, the stock amplifies the market by 35%; β = 0.5, it dampens. The intercept prefigures alpha.',
    moduleId: M2,
  },
  {
    terme: 'R²',
    en: 'R-squared',
    definition:
      'Le coefficient de détermination : la part de la variance de y expliquée par la droite — en régression simple, le carré de la corrélation. Un R² écrasant entre deux prix est suspect (régression fallacieuse) ; un R² de 0,3 entre rendements est déjà une information.',
    definitionEn:
      'The coefficient of determination: the share of y\'s variance explained by the line — in simple regression, the square of the correlation. A crushing R² between two prices is suspect (spurious regression); an R² of 0.3 between returns is already information.',
    moduleId: M2,
  },
  {
    terme: 'Monte-Carlo',
    en: 'Monte Carlo method',
    definition:
      'Estimer une grandeur sans formule fermée en simulant N scénarios aléatoires et en moyennant. L\'erreur décroît en 1/√N — une décimale de précision coûte cent fois plus de simulations — et la simulation reproduit le modèle, pas le monde.',
    definitionEn:
      'Estimating a quantity with no closed-form formula by simulating N random scenarios and averaging. The error decays as 1/√N — one extra decimal of precision costs a hundred times more simulations — and the simulation reproduces the model, not the world.',
    moduleId: M2,
  },
  {
    terme: 'marché primaire',
    en: 'primary market',
    definition:
      'Compartiment où des titres neufs s\'échangent contre de l\'argent frais : introduction en bourse, augmentation de capital, émission obligataire. Le seul moment où l\'argent va effectivement à l\'émetteur.',
    definitionEn:
      'The segment where new securities are exchanged for fresh money: IPO, capital increase, bond issue. The only moment when cash actually flows to the issuer.',
    moduleId: M1,
  },
  {
    terme: 'marché secondaire',
    en: 'secondary market',
    definition:
      'Compartiment où les investisseurs s\'échangent entre eux des titres déjà émis, sans un centime pour l\'émetteur. Sa liquidité conditionne le coût du financement au primaire : on ne souscrit que ce qu\'on pourra revendre.',
    definitionEn:
      'The segment where investors trade already-issued securities among themselves, with no money flowing to the issuer. Its liquidity drives the cost of primary funding: investors only subscribe what they can resell.',
    moduleId: M1,
  },
  {
    terme: 'gré à gré (OTC)',
    en: 'over-the-counter (OTC)',
    definition:
      'Mode de négociation bilatéral, hors bourse : des teneurs de marché cotent à la demande, par téléphone ou messagerie. Sur-mesure mais opaque ; y vivent le change, l\'essentiel des obligations et la majorité des dérivés en notionnel.',
    definitionEn:
      'Bilateral, off-exchange trading: market makers quote on demand, by phone or messaging. Bespoke but opaque; home to FX, most bonds and the majority of derivatives by notional.',
    moduleId: M1,
  },
  {
    terme: 'sell-side',
    en: 'sell side',
    definition:
      'Les banques d\'investissement et courtiers qui vendent les services de marché : accès au primaire (DCM/ECM), liquidité au secondaire (tenue de marché), recherche et structuration.',
    definitionEn:
      'Investment banks and brokers selling market services: primary access (DCM/ECM), secondary liquidity (market making), research and structuring.',
    moduleId: M1,
  },
  {
    terme: 'buy-side',
    en: 'buy side',
    definition:
      'Les institutions qui gèrent l\'argent et achètent les services du sell-side : gérants d\'actifs, hedge funds, assureurs et fonds de pension, fonds souverains.',
    definitionEn:
      'The institutions that manage money and buy the sell side\'s services: asset managers, hedge funds, insurers and pension funds, sovereign wealth funds.',
    moduleId: M1,
  },
  {
    terme: 'hedge fund',
    en: 'hedge fund',
    definition:
      'Fonds de gestion alternative réservé aux investisseurs avertis, autorisé à utiliser levier, vente à découvert et dérivés. Grandes familles : long/short equity, global macro, event driven, relative value. ≈ 4 500-5 000 Md$ d\'encours.',
    definitionEn:
      'An alternative investment fund for sophisticated investors, allowed to use leverage, short selling and derivatives. Main families: long/short equity, global macro, event driven, relative value. ≈ $4.5–5tn under management.',
    moduleId: M1,
  },
  {
    terme: 'fonds souverain',
    en: 'sovereign wealth fund',
    definition:
      'Fonds qui place les excédents d\'un État (rente pétrolière, excédents commerciaux) à très long terme. Premier mondial : le fonds norvégien, ≈ 1 700-1 800 Md$ fin 2024.',
    definitionEn:
      'A fund investing a state\'s surpluses (oil rent, trade surpluses) over the very long term. World\'s largest: Norway\'s fund, ≈ $1.7–1.8tn at end-2024.',
    moduleId: M1,
  },
  {
    terme: 'teneur de marché',
    en: 'market maker',
    definition:
      'Intervenant qui affiche en continu un prix acheteur et un prix vendeur et vit de l\'écart multiplié par la rotation. Ses deux risques : l\'inventaire porté entre deux transactions et la sélection adverse face aux mieux informés.',
    definitionEn:
      'A participant continuously displaying a buy and a sell price, living off the gap times turnover. Its two risks: the inventory carried between trades and adverse selection against better-informed counterparties.',
    moduleId: M1,
  },
  {
    terme: 'spread bid-ask',
    en: 'bid-ask spread',
    definition:
      'Écart entre le meilleur prix acheteur (bid) et le meilleur prix vendeur (ask) ; le prix de l\'immédiateté. En points de base : (ask − bid)/milieu × 10 000 — ex. 99,95/100,05 → 10 pb.',
    definitionEn:
      'The gap between the best bid and the best ask; the price of immediacy. In basis points: (ask − bid)/mid × 10,000 — e.g. 99.95/100.05 → 10 bp.',
    moduleId: M1,
  },
  {
    terme: 'carnet d\'ordres',
    en: 'order book',
    definition:
      'Registre central d\'un marché électronique rassemblant tous les ordres à cours limité en attente, bids face aux asks, servis selon la priorité prix-temps : meilleur prix d\'abord, puis premier arrivé.',
    definitionEn:
      'The central register of an electronic market holding all resting limit orders, bids facing asks, filled by price-time priority: best price first, then first come, first served.',
    moduleId: M1,
  },
  {
    terme: 'ordre à cours limité',
    en: 'limit order',
    definition:
      'Ordre exécutable seulement à un prix fixé ou mieux : prix garanti, exécution incertaine — il peut attendre indéfiniment. C\'est la matière première dont le carnet d\'ordres est fait.',
    definitionEn:
      'An order executable only at a set price or better: guaranteed price, uncertain execution — it can wait forever. The raw material the order book is made of.',
    moduleId: M1,
  },
  {
    terme: 'ordre stop',
    en: 'stop order',
    definition:
      'Ordre dormant qui se déclenche quand le marché touche un seuil, et devient alors un ordre au marché : il borne la décision, jamais le prix — en gap, l\'exécution peut être très loin du seuil.',
    definitionEn:
      'A dormant order triggered when the market hits a threshold, then becoming a market order: it bounds the decision, never the price — in a gap, the fill can land far from the trigger.',
    moduleId: M1,
  },
  {
    terme: 'slippage',
    en: 'slippage',
    definition:
      'Écart entre le prix moyen obtenu et le prix affiché au moment de l\'ordre, quand un gros ordre traverse plusieurs niveaux du carnet. Ex. du cours : 800 titres à 100,10625 € de moyenne contre un meilleur ask à 100,05 €.',
    definitionEn:
      'The gap between the average price obtained and the displayed price when the order was sent, as a large order crosses several book levels. Course example: 800 shares averaging €100.10625 against a best ask of €100.05.',
    moduleId: M1,
  },
  {
    terme: 'VWAP',
    en: 'VWAP (volume-weighted average price)',
    definition:
      'Prix moyen pondéré par les volumes ; aussi l\'algorithme d\'exécution qui étale un gros ordre au prorata des volumes habituels de la journée pour limiter l\'impact de marché. Variante temporelle : le TWAP.',
    definitionEn:
      'The volume-weighted average price; also the execution algorithm spreading a large order pro-rata to the day\'s usual volumes to limit market impact. Time-based variant: TWAP.',
    moduleId: M1,
  },
  {
    terme: 'fixing',
    en: 'auction (fixing)',
    definition:
      'Mode d\'enchère à l\'ouverture et à la clôture : les ordres s\'accumulent puis un prix unique maximisant le volume échangeable sert tout le monde. Le fixing de clôture concentre un quart à un tiers des volumes actions européens.',
    definitionEn:
      'The auction mode at the open and close: orders accumulate, then a single price maximising tradable volume fills everyone. The closing auction concentrates a quarter to a third of European equity volumes.',
    moduleId: M1,
  },
  {
    terme: 'dark pool',
    en: 'dark pool',
    definition:
      'Plateforme de négociation sans transparence pré-négociation : les ordres ne sont affichés à personne avant exécution, le plus souvent croisés au prix milieu du marché public. Utile aux gros blocs ; part de marché plafonnée.',
    definitionEn:
      'A trading venue with no pre-trade transparency: orders are shown to no one before execution, usually crossed at the public mid price. Useful for large blocks; market share capped.',
    moduleId: M1,
  },
  {
    terme: 'MTF',
    en: 'multilateral trading facility',
    definition:
      'Système multilatéral de négociation : plateforme alternative aux bourses historiques (Cboe Europe, Aquis), née de la mise en concurrence des lieux d\'exécution par MiFID (2007).',
    definitionEn:
      'A multilateral trading facility: an alternative venue to legacy exchanges (Cboe Europe, Aquis), born of the competition between execution venues opened by MiFID (2007).',
    moduleId: M1,
  },
  {
    terme: 'fragmentation',
    en: 'market fragmentation',
    definition:
      'Dispersion de la négociation d\'un même titre entre bourse historique, MTF, internalisateurs et dark pools. Conséquence : les courtiers routent via des smart order routers, sous obligation de best execution.',
    definitionEn:
      'The dispersion of trading in the same security across the legacy exchange, MTFs, internalisers and dark pools. Consequence: brokers route via smart order routers, under a best execution duty.',
    moduleId: M1,
  },
  {
    terme: 'trading haute fréquence (HFT)',
    en: 'high-frequency trading (HFT)',
    definition:
      'Technologie de décision et d\'exécution en microsecondes — essentiellement du market making électronique et de l\'arbitrage de latence. De l\'ordre de la moitié des volumes actions américains.',
    definitionEn:
      'A technology for deciding and executing in microseconds — mostly electronic market making and latency arbitrage. Around half of US equity volumes.',
    moduleId: M1,
  },
  {
    terme: 'sélection adverse',
    en: 'adverse selection',
    definition:
      'Le risque du teneur de marché face aux mieux informés : on lui achète juste avant la bonne nouvelle, on lui vend juste avant la mauvaise. Le spread est calibré pour que le flux ordinaire finance ces pertes — d\'où son élargissement avant les annonces.',
    definitionEn:
      'The market maker\'s risk against better-informed traders: they buy from him just before good news, sell to him just before bad news. The spread is calibrated so ordinary flow funds those losses — hence its widening before announcements.',
    moduleId: M1,
  },
  {
    terme: 'colocation',
    en: 'co-location',
    definition:
      'Location par les bourses d\'emplacements de serveurs dans leur propre centre de données, au plus près du moteur d\'appariement — câbles de longueur identique pour tous, afin qu\'aucun client ne gagne une nanoseconde sur son voisin.',
    definitionEn:
      'Exchanges renting server space inside their own data centre, next to the matching engine — with identical cable lengths for all, so no client gains a nanosecond on its neighbour.',
    moduleId: M1,
  },
  {
    terme: 'MiFID II',
    en: 'MiFID II',
    definition:
      'Directive européenne applicable depuis 2018 : best execution démontrable ordre par ordre, transparence pré/post-négociation, plafonds sur les dark pools, facturation séparée de la recherche (unbundling), protection renforcée de l\'investisseur.',
    definitionEn:
      'The EU directive applicable since 2018: best execution provable order by order, pre/post-trade transparency, dark pool caps, separate billing of research (unbundling), strengthened investor protection.',
    moduleId: M1,
  },
  {
    terme: 'EMIR',
    en: 'EMIR',
    definition:
      'Règlement européen de 2012, traduction du G20 post-Lehman : compensation centrale obligatoire des dérivés OTC standardisés, déclaration aux référentiels centraux, échanges de marges sur le non-compensé.',
    definitionEn:
      'The 2012 EU regulation translating the post-Lehman G20 commitments: mandatory central clearing of standardised OTC derivatives, reporting to trade repositories, margin exchange on uncleared trades.',
    moduleId: M1,
  },
  {
    terme: 'MAR',
    en: 'Market Abuse Regulation',
    definition:
      'Règlement européen Abus de marché (2014, applicable depuis juillet 2016) : il réprime les opérations d\'initiés (usage, transmission, recommandation) et la manipulation de cours (spoofing, layering).',
    definitionEn:
      'The EU Market Abuse Regulation (2014, applicable since July 2016): it punishes insider dealing (use, disclosure, recommendation) and market manipulation (spoofing, layering).',
    moduleId: M1,
  },
  {
    terme: 'délit d\'initié',
    en: 'insider dealing',
    definition:
      'Usage, transmission ou recommandation sur la base d\'une information privilégiée — précise, non publique, susceptible d\'influencer sensiblement le cours. Constitué par l\'usage au moment de l\'ordre, jamais jugé au résultat du trade.',
    definitionEn:
      'Using, disclosing or recommending on the basis of inside information — precise, non-public, likely to significantly move the price. Constituted by the use at the time of the order, never judged on the trade\'s outcome.',
    moduleId: M1,
  },
  {
    terme: 'spoofing',
    en: 'spoofing',
    definition:
      'Manipulation de cours : afficher de gros ordres sans intention de les exécuter pour pousser les autres à traiter, puis les annuler. Sa variante en couches échelonnées s\'appelle le layering.',
    definitionEn:
      'Market manipulation: posting large orders with no intent to execute, to push others to trade, then cancelling them. Its price-laddered variant is called layering.',
    moduleId: M1,
  },
  {
    terme: 'best execution',
    en: 'best execution',
    definition:
      'Obligation réglementaire (durcie par MiFID II) de se procurer le meilleur résultat possible pour le client — prix, coûts, rapidité, probabilité d\'exécution — et de pouvoir le prouver, ordre par ordre.',
    definitionEn:
      'The regulatory duty (hardened by MiFID II) to obtain the best possible result for the client — price, costs, speed, likelihood of execution — and to be able to prove it, order by order.',
    moduleId: M1,
  },
  {
    terme: 'chambre de compensation (CCP)',
    en: 'central counterparty (CCP)',
    definition:
      'Contrepartie centrale qui s\'interpose dans les transactions par novation : acheteuse de tout vendeur, vendeuse de tout acheteur. Elle se protège par marges initiales, appels de marge quotidiens et cascade de défaut.',
    definitionEn:
      'The central counterparty interposing itself in trades through novation: buyer to every seller, seller to every buyer. It protects itself with initial margins, daily margin calls and a default waterfall.',
    moduleId: M1,
  },
  {
    terme: 'novation',
    en: 'novation',
    definition:
      'Mécanisme juridique de la compensation centrale : le contrat entre A et B est remplacé par deux contrats face à la CCP. Les parties initiales ne sont plus exposées l\'une à l\'autre.',
    definitionEn:
      'Central clearing\'s legal mechanism: the contract between A and B is replaced by two contracts facing the CCP. The original parties are no longer exposed to each other.',
    moduleId: M1,
  },
  {
    terme: 'marge initiale',
    en: 'initial margin',
    definition:
      'Dépôt de garantie exigé par la CCP de chaque membre, calibré pour couvrir la liquidation de sa position en conditions dégradées — quelques jours de mouvement extrême.',
    definitionEn:
      'The guarantee deposit a CCP requires from each member, sized to cover liquidating its position under stressed conditions — a few days of extreme moves.',
    moduleId: M1,
  },
  {
    terme: 'marge de variation',
    en: 'variation margin',
    definition:
      'Règlement au moins quotidien, en cash, des gains et pertes latents d\'une position compensée : les pertes ne s\'accumulent jamais. Un membre qui ne répond pas à l\'appel est déclaré en défaut.',
    definitionEn:
      'The at-least-daily cash settlement of a cleared position\'s unrealised gains and losses: losses never accumulate. A member failing to meet the call is declared in default.',
    moduleId: M1,
  },
  {
    terme: 'dépositaire central (CSD)',
    en: 'central securities depository (CSD)',
    definition:
      'Le notaire du marché : il tient le registre ultime de qui détient quoi et opère le règlement-livraison dans ses livres. Géants européens : Euroclear (≈ 40 000 Md€ conservés) et Clearstream.',
    definitionEn:
      'The market\'s notary: it keeps the ultimate register of who owns what and operates settlement in its books. European giants: Euroclear (≈ €40tn in custody) and Clearstream.',
    moduleId: M1,
  },
  {
    terme: 'DvP',
    en: 'delivery versus payment',
    definition:
      'Livraison contre paiement : titres et cash changent de mains simultanément dans les livres du dépositaire central — aucune des deux jambes ne part sans l\'autre.',
    definitionEn:
      'Delivery versus payment: securities and cash change hands simultaneously in the central depository\'s books — neither leg moves without the other.',
    moduleId: M1,
  },
  {
    terme: 'fail de règlement',
    en: 'settlement fail',
    definition:
      'Non-livraison des titres à la date de règlement prévue. Bénin en temps calme et pénalisé en Europe depuis février 2022 (discipline CSDR), il devient en période de stress un thermomètre des tensions du marché.',
    definitionEn:
      'Failure to deliver securities on the scheduled settlement date. Benign in calm times and fined in Europe since February 2022 (CSDR discipline), it becomes a market-stress thermometer in troubled periods.',
    moduleId: M1,
  },
  {
    terme: 'action ordinaire',
    en: 'common share',
    definition:
      'Titre de propriété sur une fraction du capital social : droit aux bénéfices, droit de vote en AG, droit sur l\'actif net en liquidation. Aucune promesse de revenu ni de remboursement, pas d\'échéance — et dernier rang en cas de faillite.',
    definitionEn:
      'A title of ownership over a fraction of the share capital: a right to profits, a vote at the general meeting, a claim on net assets in liquidation. No promised income or repayment, no maturity — and last rank in bankruptcy.',
    moduleId: M3,
  },
  {
    terme: 'action de préférence',
    en: 'preference share (preferred stock)',
    definition:
      'Action à dividende prioritaire — souvent majoré ou cumulatif — en échange, généralement, de la suppression du droit de vote. À mi-chemin entre l\'action et l\'obligation : du rendement contre du pouvoir.',
    definitionEn:
      'A share with a priority dividend — often enhanced or cumulative — generally in exchange for giving up the vote. Halfway between a share and a bond: yield traded for power.',
    moduleId: M3,
  },
  {
    terme: 'dividende',
    en: 'dividend',
    definition:
      'Part du bénéfice distribuée aux actionnaires, votée chaque année en assemblée générale, jamais garantie. Le reste du bénéfice, mis en réserve, grossit les fonds propres et finance la croissance — il continue de travailler pour l\'actionnaire.',
    definitionEn:
      'The share of profit distributed to shareholders, voted each year at the general meeting, never guaranteed. The rest, kept in reserves, grows equity and funds growth — it keeps working for the shareholder.',
    moduleId: M3,
  },
  {
    terme: 'BPA',
    en: 'earnings per share (EPS)',
    definition:
      'Bénéfice net divisé par le nombre de titres : la brique du PER. Vigilance : il arrive après les choix comptables, et les rachats d\'actions le gonflent mécaniquement en réduisant le dénominateur.',
    definitionEn:
      'Net profit divided by the number of shares: the building block of the P/E. Caution: it comes after accounting choices, and buybacks mechanically inflate it by shrinking the denominator.',
    moduleId: M3,
  },
  {
    terme: 'PER',
    en: 'price-earnings ratio (P/E)',
    definition:
      'Cours divisé par le BPA : un PER de 15 paie quinze années du bénéfice courant. Son inverse, le rendement bénéficiaire, se compare à un taux obligataire. Trois moteurs : croissance attendue, qualité des profits, niveau des taux.',
    definitionEn:
      'Price divided by EPS: a P/E of 15 pays fifteen years of current earnings. Its inverse, the earnings yield, compares to a bond yield. Three drivers: expected growth, profit quality, the level of rates.',
    moduleId: M3,
  },
  {
    terme: 'valeur d\'entreprise',
    en: 'enterprise value (EV)',
    definition:
      'Capitalisation boursière plus dette nette : le prix de l\'outil économique entier, ce que débourse l\'acquéreur qui rachète les actions et reprend la dette. Une trésorerie nette la diminue d\'autant.',
    definitionEn:
      'Market capitalization plus net debt: the price of the entire economic asset, what an acquirer pays to buy the shares and take on the debt. Net cash reduces it accordingly.',
    moduleId: M3,
  },
  {
    terme: 'EBITDA',
    en: 'EBITDA',
    definition:
      'Résultat opérationnel avant amortissements et dépréciations, mesuré avant frais financiers : il rémunère tous les bailleurs de fonds, actionnaires et créanciers — d\'où sa cohérence avec l\'EV. Limite : il ignore les investissements de maintien.',
    definitionEn:
      'Operating profit before depreciation and amortization, measured before financial expenses: it pays all capital providers, shareholders and creditors — hence its coherence with EV. Limit: it ignores maintenance capex.',
    moduleId: M3,
  },
  {
    terme: 'P/B',
    en: 'price-to-book',
    definition:
      'Capitalisation rapportée aux fonds propres comptables. Central pour les banques et assurances, dont le bilan est l\'outil de production : P/B > 1 si le marché attend un ROE durablement supérieur au coût des fonds propres, < 1 sinon.',
    definitionEn:
      'Market cap over book equity. Central for banks and insurers, whose balance sheet is their production tool: P/B > 1 when the market expects ROE durably above the cost of equity, < 1 otherwise.',
    moduleId: M3,
  },
  {
    terme: 'taux de distribution',
    en: 'payout ratio',
    definition:
      'Rapport dividende sur bénéfice : un payout de 45 % distribue 45 centimes par euro de bénéfice. Son complément, le taux de rétention b = 1 − payout, alimente la croissance soutenable g = ROE × b.',
    definitionEn:
      'The dividend-to-earnings ratio: a 45% payout distributes 45 cents per euro of profit. Its complement, the retention rate b = 1 − payout, feeds the sustainable growth g = ROE × b.',
    moduleId: M3,
  },
  {
    terme: 'flottant',
    en: 'free float',
    definition:
      'Part du capital réellement négociable, hors blocs stables (État, familles fondatrices, autocontrôle, participations croisées). C\'est sur le flottant que les indices modernes pondèrent leurs constituants : un ETF ne peut acheter que ce qui flotte.',
    definitionEn:
      'The share of capital actually tradable, excluding stable blocks (state, founding families, treasury shares, cross-holdings). Modern indices weight constituents on the float: an ETF can only buy what floats.',
    moduleId: M3,
  },
  {
    terme: 'capitalisation boursière',
    en: 'market capitalization',
    definition:
      'Cours multiplié par le nombre total de titres émis, blocs verrouillés compris : la valeur de marché des capitaux propres. Un stock, à ne jamais comparer à un volume quotidien — et à ne pas confondre avec la valeur d\'entreprise.',
    definitionEn:
      'Price times the total number of shares issued, locked blocks included: the market value of equity. A stock variable, never to be compared with a daily volume — and not to be confused with enterprise value.',
    moduleId: M3,
  },
  {
    terme: 'DDM',
    en: 'dividend discount model',
    definition:
      'Modèle d\'actualisation des dividendes : la valeur d\'une action est la somme de ses dividendes espérés actualisés au rendement exigé. Gordon-Shapiro en est la version à croissance constante : V₀ = D₁/(r − g), sous condition r > g.',
    definitionEn:
      'The dividend discount model: a share\'s value is the sum of its expected dividends discounted at the required return. Gordon-Shapiro is its constant-growth version: V₀ = D₁/(r − g), under the condition r > g.',
    moduleId: M3,
  },
  {
    terme: 'DCF',
    en: 'discounted cash flows',
    definition:
      'Valorisation par les flux de trésorerie disponibles actualisés au WACC : horizon explicite puis valeur terminale. Le résultat est une valeur d\'entreprise — retrancher la dette nette pour les actions. Une machine à hypothèses, à présenter en matrice de sensibilité.',
    definitionEn:
      'Valuation by free cash flows discounted at the WACC: an explicit horizon then a terminal value. The result is an enterprise value — subtract net debt for the equity. An assumption machine, to be presented as a sensitivity matrix.',
    moduleId: M3,
  },
  {
    terme: 'flux de trésorerie disponible',
    en: 'free cash flow (FCF)',
    definition:
      'Flux généré par l\'entreprise après investissements, qu\'elle le distribue ou non. Il revient aux actionnaires comme aux créanciers — d\'où son actualisation au WACC — et sert à valoriser les sociétés qui versent peu ou pas de dividendes.',
    definitionEn:
      'The flow the company generates after investments, distributed or not. It accrues to shareholders and creditors alike — hence discounting at the WACC — and values companies paying little or no dividend.',
    moduleId: M3,
  },
  {
    terme: 'valeur terminale',
    en: 'terminal value',
    definition:
      'Valeur, en fin d\'horizon explicite, de tous les flux au-delà — généralement un Gordon sur le premier flux de la phase stable. Elle pèse couramment 60 à 80 % d\'un DCF et s\'exprime en euros de l\'année N : il faut encore l\'actualiser.',
    definitionEn:
      'The value, at the end of the explicit horizon, of all flows beyond — usually a Gordon on the first stable-phase flow. It commonly weighs 60 to 80% of a DCF and is expressed in year-N euros: it still must be discounted.',
    moduleId: M3,
  },
  {
    terme: 'WACC',
    en: 'weighted average cost of capital',
    definition:
      'Coût moyen pondéré du capital : la moyenne du coût des fonds propres et du coût de la dette, pondérée par leur poids au bilan. C\'est le taux d\'actualisation du DCF, puisque les FCF reviennent aux deux financeurs à la fois.',
    definitionEn:
      'The weighted average cost of capital: the average of the cost of equity and the cost of debt, weighted by their balance-sheet shares. It is the DCF\'s discount rate, since FCF accrues to both financiers at once.',
    moduleId: M3,
  },
  {
    terme: 'comparables',
    en: 'comparable companies (comps)',
    definition:
      'Valorisation relative : appliquer à la cible le multiple médian d\'un échantillon de 6 à 10 sociétés proches, puis ajuster (décote d\'illiquidité, prime de contrôle). Limites : le comparable parfait n\'existe pas, et les multiples mesurent des prix, pas des valeurs.',
    definitionEn:
      'Relative valuation: applying to the target the median multiple of a sample of 6 to 10 similar companies, then adjusting (illiquidity discount, control premium). Limits: the perfect comparable does not exist, and multiples measure prices, not values.',
    moduleId: M3,
  },
  {
    terme: 'indice de prix',
    en: 'price index',
    definition:
      'Indice qui n\'intègre pas les dividendes : au détachement, il encaisse la baisse mécanique du cours sans jamais créditer le montant. Le CAC 40 cité par la presse en est un — d\'où l\'écart spectaculaire avec sa version rendement total.',
    definitionEn:
      'An index that excludes dividends: at detachment, it absorbs the mechanical price drop without ever crediting the amount. The CAC 40 quoted in the press is one — hence the spectacular gap with its total return version.',
    moduleId: M3,
  },
  {
    terme: 'indice de rendement total',
    en: 'total return index',
    definition:
      'Indice qui réinvestit les dividendes : GR (gross return) en brut, NR (net return) net de retenue à la source — la référence contractuelle de la plupart des ETF. Le DAX est TR par défaut, exception notable ; le CAC 40 GR dépasse 25 000 quand le CAC prix vaut ~8 000.',
    definitionEn:
      'An index that reinvests dividends: GR (gross return) gross, NR (net return) net of withholding — the contractual benchmark of most ETFs. The DAX is TR by default, a notable exception; the CAC 40 GR exceeds 25,000 while the price CAC sits near 8,000.',
    moduleId: M3,
  },
  {
    terme: 'diviseur',
    en: 'index divisor',
    definition:
      'Nombre qui transforme la capitalisation du panier en niveau d\'indice. Il fixe la base (CAC 40 : 1 000 fin 1987) puis absorbe tout ce qui n\'est pas une variation de prix, via D\' = D × capi après/capi avant — le principe de continuité.',
    definitionEn:
      'The number that turns the basket\'s capitalization into an index level. It sets the base (CAC 40: 1,000 at end-1987) then absorbs everything that is not a price move, via D\' = D × cap after/cap before — the continuity principle.',
    moduleId: M3,
  },
  {
    terme: 'date de détachement',
    en: 'ex-date',
    definition:
      'Jour à partir duquel acheter l\'action ne donne plus droit au dividende : le cours s\'ajuste mécaniquement du montant détaché (100 − 2,50 = 97,50 €). La date qui compte économiquement dans le calendrier du dividende.',
    definitionEn:
      'The day from which buying the share no longer carries the dividend: the price mechanically adjusts by the detached amount (100 − 2.50 = €97.50). The date that matters economically in the dividend calendar.',
    moduleId: M3,
  },
  {
    terme: 'record date',
    en: 'record date',
    definition:
      'Date à laquelle l\'émetteur photographie la liste des actionnaires qui seront payés. Sous règlement T+2, elle suit l\'ex-date d\'un jour ouvré ; sous le T+1 américain en vigueur depuis mai 2024, les deux dates coïncident.',
    definitionEn:
      'The date on which the issuer snapshots the list of shareholders to be paid. Under T+2 settlement it follows the ex-date by one business day; under the US T+1 in force since May 2024, the two dates coincide.',
    moduleId: M3,
  },
  {
    terme: 'division d\'action',
    en: 'stock split',
    definition:
      'Division du nominal : N fois plus de titres, cours divisé par N, capitalisation inchangée — aucune valeur créée. Motifs pratiques et psychologiques : liquidité, accessibilité, signal. Le regroupement (reverse split) signale souvent la détresse.',
    definitionEn:
      'Dividing the par value: N times more shares, price divided by N, capitalization unchanged — no value created. Practical and psychological motives: liquidity, accessibility, signalling. The reverse split often signals distress.',
    moduleId: M3,
  },
  {
    terme: 'DPS',
    en: 'subscription right (rights)',
    definition:
      'Droit préférentiel de souscription, attaché à chaque action ancienne lors d\'une augmentation de capital : il matérialise la dilution et la rend négociable. Valeur théorique : (cours − prix d\'émission)/(n + 1). Il s\'exerce ou se vend — jamais ne s\'oublie.',
    definitionEn:
      'The preferential subscription right attached to each old share in a rights issue: it materializes the dilution and makes it tradable. Theoretical value: (price − issue price)/(n + 1). It is exercised or sold — never forgotten.',
    moduleId: M3,
  },
  {
    terme: 'TERP',
    en: 'theoretical ex-rights price (TERP)',
    definition:
      'Cours théorique ex-droit après une augmentation de capital : la moyenne pondérée des actions anciennes et nouvelles, (n × cours + prix d\'émission)/(n + 1). La décote du cours au détachement des droits égale la valeur du DPS.',
    definitionEn:
      'The theoretical ex-rights price after a rights issue: the weighted average of old and new shares, (n × price + issue price)/(n + 1). The price markdown when rights detach equals the right\'s value.',
    moduleId: M3,
  },
  {
    terme: 'rachat d\'actions',
    en: 'share buyback',
    definition:
      'La société rachète ses propres actions — le plus souvent annulées : effet relutif sur le BPA, même bénéfice réparti sur moins de titres. Plus flexible qu\'un dividende, signal de titre « bon marché » ; S&P 500 : souvent plus de 800 Md$ par an.',
    definitionEn:
      'The company buys back its own shares — usually cancelled: an accretive effect on EPS, the same profit spread over fewer shares. More flexible than a dividend, a "cheap stock" signal; S&P 500: often over $800bn a year.',
    moduleId: M3,
  },
  {
    terme: 'introduction en bourse',
    en: 'initial public offering (IPO)',
    definition:
      'Première vente d\'actions au public — l\'archétype du marché primaire. Motifs : lever du capital, offrir une sortie, une monnaie d\'acquisition, la notoriété. Coûts : commission de 3 à 7 %, transparence imposée, court-termisme du trimestre.',
    definitionEn:
      'The first sale of shares to the public — the primary market\'s archetype. Motives: raising capital, providing an exit, an acquisition currency, visibility. Costs: a 3 to 7% fee, mandatory transparency, quarterly short-termism.',
    moduleId: M3,
  },
  {
    terme: 'book-building',
    en: 'book building',
    definition:
      'Construction du livre d\'ordres d\'une IPO : le syndicat recueille les intentions des institutionnels — quantité, sensibilité au prix — sur une fourchette indicative, puis fixe le prix final au vu de la demande, souvent la veille de la cotation.',
    definitionEn:
      'Building an IPO\'s order book: the syndicate collects institutional intentions — quantity, price sensitivity — over an indicative range, then sets the final price based on demand, often the night before listing.',
    moduleId: M3,
  },
  {
    terme: 'greenshoe',
    en: 'greenshoe (over-allotment option)',
    definition:
      'Option de surallocation : le syndicat place 115 % des titres, short de 15 %, avec une option d\'achat à 30 jours au prix d\'IPO. Cours faible : rachat en marché qui soutient le cours ; cours fort : exercice de l\'option. La banque est couverte dans les deux cas — c\'est voulu.',
    definitionEn:
      'The over-allotment option: the syndicate places 115% of the shares, short 15%, with a 30-day call at the IPO price. Weak price: market buy-backs that support the price; strong price: option exercise. The bank is covered either way — by design.',
    moduleId: M3,
  },
  {
    terme: 'lock-up',
    en: 'lock-up',
    definition:
      'Engagement des dirigeants et actionnaires historiques de ne pas vendre pendant 90 à 180 jours après l\'IPO. Son expiration, connue de tous, libère d\'un coup une offre potentielle massive : le cours est fréquemment sous pression à l\'approche.',
    definitionEn:
      'The commitment by executives and historical shareholders not to sell for 90 to 180 days after the IPO. Its expiry, known to all, frees a massive potential supply at once: the price is frequently under pressure as it nears.',
    moduleId: M3,
  },
  {
    terme: 'vente à découvert',
    en: 'short selling',
    definition:
      'Vendre un titre qu\'on ne possède pas : emprunter (contre collatéral et commission), vendre, racheter, rendre. Gain plafonné, perte illimitée — l\'asymétrie qui rend les squeezes possibles. Services rendus : liquidité, découverte des prix, chasse aux fraudes.',
    definitionEn:
      'Selling a share you do not own: borrow (against collateral and a fee), sell, buy back, return. Capped gain, unlimited loss — the asymmetry that makes squeezes possible. Services rendered: liquidity, price discovery, fraud hunting.',
    moduleId: M3,
  },
  {
    terme: 'short interest',
    en: 'short interest',
    definition:
      'Encours des positions vendeuses sur un titre, lu en pourcentage du flottant. Il peut dépasser 100 % : un titre emprunté, vendu, peut être réemprunté et revendu — la chaîne compte double. GameStop en janvier 2021 : ≈ 140 %.',
    definitionEn:
      'The outstanding stock of short positions in a share, read as a percentage of the float. It can exceed 100%: a share borrowed and sold can be re-borrowed and sold again — the chain counts twice. GameStop in January 2021: ≈ 140%.',
    moduleId: M3,
  },
  {
    terme: 'short squeeze',
    en: 'short squeeze',
    definition:
      'Spirale d\'essorage des vendeurs à découvert : la hausse inflige des pertes, les appels de marge forcent des rachats, qui font monter le cours et aggravent les pertes des autres. GameStop 2021 : d\'environ 20 $ à près de 500 $ en séance.',
    definitionEn:
      'The wringing-out spiral of short sellers: the rise inflicts losses, margin calls force buy-backs, which push the price higher and worsen the others\' losses. GameStop 2021: from about $20 to nearly $500 intraday.',
    moduleId: M3,
  },
  {
    terme: 'efficience des marchés',
    en: 'efficient market hypothesis (EMH)',
    definition:
      'Hypothèse de Fama : les prix intègrent l\'information — forme faible (cours passés), semi-forte (information publique), forte (information privée, rejetée). Synthèse d\'oral : efficients la plupart du temps, pas tout le temps — SPIVA d\'un côté, bulles et anomalies de l\'autre.',
    definitionEn:
      'Fama\'s hypothesis: prices incorporate information — weak form (past prices), semi-strong (public information), strong (private information, rejected). Oral synthesis: efficient most of the time, not all the time — SPIVA on one side, bubbles and anomalies on the other.',
    moduleId: M3,
  },
];
