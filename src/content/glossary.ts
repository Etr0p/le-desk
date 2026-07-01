import type { GlossaireEntree } from '../engine/types';

const M4 = '04-taux-obligations';
const M2 = '02-methodes-quantitatives';
const M1 = '01-panorama-marches';
const M3 = '03-actions-indices';
const M6 = '06-change-commos-crypto';
const M7 = '07-derives-fermes';
const M8 = '08-options-volatilite';

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
  {
    terme: 'pip',
    en: 'pip',
    definition:
      'Plus petite variation conventionnelle d\'une cotation de change : la 4ᵉ décimale (0,0001) sur les paires cotées à 4 décimales, la 2ᵉ (0,01) sur les paires en yen. De 1,1000 à 1,1025, EUR/USD a pris 25 pips — et les points de terme se cotent dans la même unité.',
    definitionEn:
      'The smallest conventional move of an FX quote: the 4th decimal (0.0001) on pairs quoted to 4 decimals, the 2nd (0.01) on yen pairs. From 1.1000 to 1.1025, EUR/USD gained 25 pips — and forward points are quoted in the same unit.',
    moduleId: M6,
  },
  {
    terme: 'figure',
    en: 'big figure',
    definition:
      'Le « gros » chiffre d\'une cotation de change — 1,10 sur un EUR/USD à 1,1025 —, supposé connu des deux contreparties : entre professionnels, on n\'annonce souvent que les pips, la figure restant implicite.',
    definitionEn:
      'The "big" number of an FX quote — 1.10 on EUR/USD at 1.1025 — assumed known by both counterparties: between professionals, often only the pips are quoted, the big figure staying implicit.',
    moduleId: M6,
  },
  {
    terme: 'paire BASE/COTÉE',
    en: 'base/quote currency pair',
    definition:
      'Convention d\'écriture de tout cours de change : le prix d\'une unité de la devise de base, exprimé en devise cotée. EUR/USD = 1,10 : 1 euro vaut 1,10 dollar — la hausse du cours est toujours une appréciation de la base. La hiérarchie conventionnelle (EUR > GBP > AUD > NZD > USD > le reste) fixe qui cote qui.',
    definitionEn:
      'The writing convention of every FX rate: the price of one unit of the base currency, expressed in the quote currency. EUR/USD = 1.10: 1 euro is worth 1.10 dollars — a rising rate is always an appreciation of the base. The conventional hierarchy (EUR > GBP > AUD > NZD > USD > the rest) sets who quotes whom.',
    moduleId: M6,
  },
  {
    terme: 'cours croisé',
    en: 'cross rate',
    definition:
      'Cours d\'une paire sans dollar — EUR/GBP, EUR/JPY, EUR/CHF —, historiquement déduit des deux paires en dollar (EUR/GBP = EUR/USD ÷ GBP/USD). Les desks arbitrent en continu la cross cotée contre cette valeur implicite.',
    definitionEn:
      'The rate of a non-dollar pair — EUR/GBP, EUR/JPY, EUR/CHF — historically derived from the two dollar pairs (EUR/GBP = EUR/USD ÷ GBP/USD). Desks continuously arbitrage the quoted cross against this implied value.',
    moduleId: M6,
  },
  {
    terme: 'NDF',
    en: 'non-deliverable forward (NDF)',
    definition:
      'Forward non livrable, pour les devises non convertibles ou sous contrôle des capitaux (won, roupie, real) : même engagement de cours qu\'un forward, mais aucun échange de nominal — à l\'échéance, on règle en dollars la seule différence entre cours convenu et fixing du jour.',
    definitionEn:
      'A non-deliverable forward, for non-convertible or capital-controlled currencies (won, rupee, real): the same rate commitment as a forward, but no exchange of principal — at maturity, only the difference between the agreed rate and the day\'s fixing is settled, in dollars.',
    moduleId: M6,
  },
  {
    terme: 'FX swap',
    en: 'FX swap',
    definition:
      'Swap de change : un spot et un forward inversé traités simultanément avec la même contrepartie — économiquement, un prêt d\'une devise gagé sur l\'autre, le cousin cambiste du repo. L\'instrument le plus traité du marché des changes : de l\'ordre de la moitié des volumes quotidiens, devant le spot.',
    definitionEn:
      'A spot and a reverse forward traded simultaneously with the same counterparty — economically, a loan of one currency collateralised by the other, the FX cousin of the repo. The most traded instrument in foreign exchange: about half of daily volumes, ahead of spot itself.',
    moduleId: M6,
  },
  {
    terme: 'fixing WM/Reuters',
    en: 'WM/Reuters fix',
    definition:
      'Cours de référence calculé sur une courte fenêtre d\'échanges à 16 h à Londres, utilisé pour valoriser fonds et indices dans le monde entier. Sa célébrité en a fait une cible : le scandale de manipulation révélé en 2013 a coûté des milliards d\'amendes et élargi la fenêtre de calcul.',
    definitionEn:
      'The reference rate computed over a short trading window at 4 pm London, used to value funds and indices worldwide. Its fame made it a target: the manipulation scandal revealed in 2013 cost billions in fines and widened the calculation window.',
    moduleId: M6,
  },
  {
    terme: 'CLS',
    en: 'CLS',
    definition:
      'Infrastructure de règlement du marché des changes qui dénoue les deux jambes d\'une opération simultanément (paiement contre paiement), neutralisant le risque de règlement — payer sa jambe et ne jamais recevoir l\'autre — pour une large part du marché.',
    definitionEn:
      'The FX settlement infrastructure that settles both legs of a trade simultaneously (payment versus payment), neutralising settlement risk — paying your leg and never receiving the other — for a large share of the market.',
    moduleId: M6,
  },
  {
    terme: 'parité couverte (CIP)',
    en: 'covered interest rate parity (CIP)',
    definition:
      'Relation d\'arbitrage qui fixe le forward de change : F = S × (1 + r_cotée·T)/(1 + r_base·T) — la devise au taux le plus bas se revalorise à terme d\'exactement le différentiel de portage. Vérifiée au pip près avant 2008 ; ses entorses depuis (le cross-currency basis) sont un thermomètre du stress de financement en dollars.',
    definitionEn:
      'The arbitrage relationship that pins down the FX forward: F = S × (1 + r_quote·T)/(1 + r_base·T) — the lower-yielding currency appreciates forward by exactly the carry differential. It held to the pip before 2008; its breaches since (the cross-currency basis) are a thermometer of dollar funding stress.',
    moduleId: M6,
  },
  {
    terme: 'parité non couverte (UIP)',
    en: 'uncovered interest rate parity (UIP)',
    definition:
      'Théorie selon laquelle la devise à haut taux devrait se déprécier, en espérance, d\'environ le différentiel de taux — sinon avantage gratuit. Contrairement à la parité couverte, rien ne la verrouille : c\'est un pari sur le spot futur, et les données à moyen terme la démentent (forward premium puzzle).',
    definitionEn:
      'The theory that the high-yield currency should depreciate, in expectation, by roughly the rate differential — otherwise free lunch. Unlike covered parity, nothing locks it in: it is a bet on the future spot, and medium-term data contradict it (the forward premium puzzle).',
    moduleId: M6,
  },
  {
    terme: 'report/déport',
    en: 'forward premium/discount',
    definition:
      'Position du forward par rapport au spot : la devise de base cote en report (premium) si F > S, en déport (discount) si F < S. La règle qui condense la parité couverte : la devise qui rémunère le moins se revalorise à terme — le forward neutralise le portage, il ne récompense personne.',
    definitionEn:
      'The forward\'s position relative to spot: the base currency trades at a premium if F > S, at a discount if F < S. The rule that condenses covered parity: the lower-yielding currency appreciates forward — the forward neutralises the carry, it rewards no one.',
    moduleId: M6,
  },
  {
    terme: 'points de terme',
    en: 'forward points (swap points)',
    definition:
      'L\'écart entre forward et spot exprimé en pips : (F − S) × 10 000 — ce que cotent réellement les cambistes, à ajouter au spot. Positifs, la base est en report ; négatifs, en déport. Exemple canonique : spot 1,1000, forward 1,1214, points « +213,6 ».',
    definitionEn:
      'The gap between forward and spot expressed in pips: (F − S) × 10,000 — what dealers actually quote, to be added to spot. Positive, the base is at a premium; negative, at a discount. Canonical example: spot 1.1000, forward 1.1214, points "+213.6".',
    moduleId: M6,
  },
  {
    terme: 'forward premium puzzle',
    en: 'forward premium puzzle',
    definition:
      'L\'anomalie la plus documentée du change (Fama, 1984) : les devises à taux élevés ne se déprécient pas du différentiel comme l\'UIP le prédit — elles se déprécient moins, voire s\'apprécient, avec des bêtas de régression souvent négatifs. C\'est le carburant statistique du carry trade.',
    definitionEn:
      'The most documented FX anomaly (Fama, 1984): high-yield currencies do not depreciate by the differential as UIP predicts — they depreciate less, or even appreciate, with regression betas often negative. It is the statistical fuel of the carry trade.',
    moduleId: M6,
  },
  {
    terme: 'carry trade',
    en: 'carry trade',
    definition:
      'Emprunter une devise à taux bas (la devise de financement) pour placer dans une devise à taux élevé et empocher le différentiel tant que le change tient. Profil « pièces devant le rouleau compresseur » : skewness négative, gains réguliers, crashs rares et brutaux — 2008, août 2024.',
    definitionEn:
      'Borrowing a low-yield currency (the funding currency) to invest in a high-yield one and pocketing the differential as long as the exchange rate holds. A "pennies in front of the steamroller" profile: negative skewness, steady gains, rare and brutal crashes — 2008, August 2024.',
    moduleId: M6,
  },
  {
    terme: 'devise refuge',
    en: 'safe-haven currency',
    definition:
      'Devise qui s\'apprécie quand les marchés paniquent : le yen et le franc suisse au premier rang, le dollar souvent avec eux. Le yen doit ce statut, entre autres, à son rôle de devise de financement : en régime risk-off, les carry trades se débouclent et leur rachat massif de yens le fait monter.',
    definitionEn:
      'A currency that appreciates when markets panic: the yen and the Swiss franc first, the dollar often alongside. The yen owes this status, among other things, to its funding-currency role: in risk-off, carry trades unwind and the massive yen buy-back pushes it up.',
    moduleId: M6,
  },
  {
    terme: 'PPA',
    en: 'purchasing power parity (PPP)',
    definition:
      'Parité des pouvoirs d\'achat : la loi du prix unique agrégée à un panier — le taux de change d\'équilibre est celui qui égalise les pouvoirs d\'achat des deux devises. Boussole de très long terme : un écart met de l\'ordre de trois à cinq ans à se résorber de moitié, à peu près muette à l\'horizon d\'un trimestre.',
    definitionEn:
      'Purchasing power parity: the law of one price aggregated to a basket — the equilibrium exchange rate is the one equalising the two currencies\' purchasing powers. A very-long-run compass: a gap takes about three to five years to close by half, and says next to nothing about the next quarter.',
    moduleId: M6,
  },
  {
    terme: 'Big Mac index',
    en: 'Big Mac index',
    definition:
      'L\'illustration la plus célèbre de la PPA, publiée par The Economist depuis 1986 : le même hamburger produit localement sert de panier d\'un seul bien. Big Mac à 5,80 $ et 5,00 € : PPA EUR/USD = 1,16 — un spot à 1,10 signale un euro sous-évalué de 5,17 %.',
    definitionEn:
      'The most famous PPP illustration, published by The Economist since 1986: the same locally produced burger serves as a one-good basket. Big Mac at $5.80 and €5.00: EUR/USD PPP = 1.16 — a 1.10 spot signals a euro undervalued by 5.17%.',
    moduleId: M6,
  },
  {
    terme: 'effet Balassa-Samuelson',
    en: 'Balassa-Samuelson effect',
    definition:
      'Pourquoi les pays riches paraissent durablement « surévalués » au sens de la PPA : la forte productivité de leur secteur exposé tire les salaires de toute l\'économie, services non échangeables compris — la coupe de cheveux ne s\'arbitre pas par conteneur, l\'écart de prix persiste sans correction possible.',
    definitionEn:
      'Why rich countries look durably "overvalued" in PPP terms: high productivity in their tradable sector pulls up wages across the whole economy, non-tradable services included — haircuts cannot be arbitraged by container, so the price gap persists with no possible correction.',
    moduleId: M6,
  },
  {
    terme: 'régime de change',
    en: 'exchange rate regime',
    definition:
      'Cadre institutionnel du cours d\'une devise, du flottement pur à l\'union monétaire en passant par flottement géré, peg ajustable, caisse d\'émission et dollarisation. Le choix arbitre crédibilité contre flexibilité — et le régime déclaré diffère souvent du régime pratiqué (fear of floating).',
    definitionEn:
      'The institutional framework of a currency\'s price, from pure float to monetary union via managed float, adjustable peg, currency board and dollarisation. The choice trades credibility against flexibility — and the declared regime often differs from the practised one (fear of floating).',
    moduleId: M6,
  },
  {
    terme: 'currency board',
    en: 'currency board',
    definition:
      'Caisse d\'émission : le peg dur — la parité est inscrite dans la loi et chaque billet émis est couvert par des réserves en devise d\'ancrage. L\'exemple vivant : Hong Kong, arrimé au dollar depuis 1983 dans la bande 7,75–7,85, au prix d\'une politique monétaire importée de la Fed.',
    definitionEn:
      'The hard peg: the parity is written into law and every note issued is backed by reserves in the anchor currency. The living example: Hong Kong, pegged to the dollar since 1983 in the 7.75–7.85 band, at the price of a monetary policy imported from the Fed.',
    moduleId: M6,
  },
  {
    terme: 'triangle de Mundell',
    en: 'Mundell\'s impossible trinity (trilemma)',
    definition:
      'Le triangle d\'incompatibilité : change fixe, libre circulation des capitaux, politique monétaire autonome — un pays ne peut en obtenir que deux sur trois. Hong Kong abandonne l\'autonomie monétaire, la Chine la liberté des capitaux, les États-Unis et la zone euro le change fixe. L\'outil qui classe toute question de change.',
    definitionEn:
      'The impossible trinity: a fixed exchange rate, free capital movement, autonomous monetary policy — a country can only get two out of three. Hong Kong gives up monetary autonomy, China free capital flows, the US and the euro area the fixed rate. The tool that sorts every FX question.',
    moduleId: M6,
  },
  {
    terme: 'intervention stérilisée',
    en: 'sterilised intervention',
    definition:
      'Intervention de change dont l\'effet sur la masse monétaire est compensé par une opération de signe opposé sur les titres domestiques : la banque centrale agit sur le cours sans modifier ses conditions monétaires internes — ce qui en limite aussi la puissance.',
    definitionEn:
      'An FX intervention whose effect on the money supply is offset by an opposite-signed operation in domestic securities: the central bank acts on the exchange rate without changing its internal monetary conditions — which also limits its power.',
    moduleId: M6,
  },
  {
    terme: 'dévaluation interne',
    en: 'internal devaluation',
    definition:
      'L\'ajustement qui reste quand le change ne peut plus bouger : baisse des prix et des salaires pour restaurer la compétitivité — la voie imposée aux membres d\'une union monétaire, autrement plus lente et douloureuse qu\'une dévaluation de change. La pression se lit alors dans les spreads souverains.',
    definitionEn:
      'The adjustment left when the exchange rate can no longer move: lowering prices and wages to restore competitiveness — the path imposed on monetary union members, far slower and more painful than a currency devaluation. The pressure then shows up in sovereign spreads.',
    moduleId: M6,
  },
  {
    terme: 'crises jumelles',
    en: 'twin crises',
    definition:
      'Crise de change et crise bancaire simultanées, typiques des émergents à peg : quand la parité saute, les agents endettés dans la devise d\'ancrage voient leur dette exploser et le système bancaire suit — Mexique 1994, Asie 1997, Russie 1998, Argentine 2001.',
    definitionEn:
      'Simultaneous currency and banking crises, typical of pegged emerging markets: when the parity breaks, agents indebted in the anchor currency see their debt balloon and the banking system follows — Mexico 1994, Asia 1997, Russia 1998, Argentina 2001.',
    moduleId: M6,
  },
  {
    terme: 'contango',
    en: 'contango',
    definition:
      'Courbe des futures croissante (F > S) : le régime « normal » d\'un marché bien approvisionné, où le terme cote le spot plus le coût de portage net positif. Conséquence pour le long qui roule sa position : un roll yield négatif — l\'érosion structurelle des trackers matières premières.',
    definitionEn:
      'An upward-sloping futures curve (F > S): the "normal" regime of a well-supplied market, where the forward quotes spot plus a positive net cost of carry. Consequence for the long who rolls: a negative roll yield — the structural erosion of commodity trackers.',
    moduleId: M6,
  },
  {
    terme: 'backwardation',
    en: 'backwardation',
    definition:
      'Courbe des futures décroissante (F < S) : la signature d\'une tension physique — stocks bas, convenience yield dominant les coûts de portage, la disponibilité immédiate se paie une prime sur le terme. Le roll y rapporte au lieu de coûter : +3,09 % par an sur l\'exemple canonique 80/77,60.',
    definitionEn:
      'A downward-sloping futures curve (F < S): the signature of physical tightness — low inventories, convenience yield dominating carry costs, immediate availability commanding a premium over the forward. The roll pays instead of costing: +3.09% a year in the canonical 80/77.60 example.',
    moduleId: M6,
  },
  {
    terme: 'convenience yield',
    en: 'convenience yield',
    definition:
      'Rendement de disponibilité : la valeur, pour le détenteur du physique, de l\'avoir sous la main — la raffinerie qui ne s\'arrête jamais faute de brut. Invisible sur tout relevé, il se déduit des prix et réduit le coût de portage net comme un dividende ; dominant, il fait basculer la courbe en backwardation.',
    definitionEn:
      'The availability return: the value, for the holder of the physical, of having it on hand — the refinery that never stops for lack of crude. Invisible on any statement, it is inferred from prices and reduces the net cost of carry like a dividend; when dominant, it tips the curve into backwardation.',
    moduleId: M6,
  },
  {
    terme: 'coût de portage',
    en: 'cost of carry',
    definition:
      'Le coût complet de détenir la matière jusqu\'au terme : financement + stockage − convenience yield. C\'est lui qui sculpte la courbe des futures par l\'arbitrage cash and carry : portage net de +5 % sur un spot à 80 $, et le futures 1 an cote 84 $.',
    definitionEn:
      'The full cost of holding the commodity to maturity: funding + storage − convenience yield. It is what shapes the futures curve through cash-and-carry arbitrage: a +5% net carry on an $80 spot puts the 1-year futures at $84.',
    moduleId: M6,
  },
  {
    terme: 'base',
    en: 'basis',
    definition:
      'Spot moins futures : négative en contango, positive en backwardation — et elle converge mécaniquement vers zéro à l\'échéance, le futures qui expire devenant du spot. Les desks lisent la base courte du brut comme un indicateur de stocks en temps réel.',
    definitionEn:
      'Spot minus futures: negative in contango, positive in backwardation — and it mechanically converges to zero at expiry, the dying futures becoming spot. Desks read the front basis of crude as a real-time inventory gauge.',
    moduleId: M6,
  },
  {
    terme: 'roll yield',
    en: 'roll yield',
    definition:
      'Rendement de roulement : ce que coûte ou rapporte le remplacement du contrat qui expire par le suivant, annualisé — (F_proche/F_lointain − 1)/T. En contango 80/84 : −4,76 % par an à spot inchangé ; en backwardation 80/77,60 : +3,09 %. La composante de performance que les touristes oublient.',
    definitionEn:
      'The rolling return: what replacing the expiring contract with the next one costs or earns, annualised — (F_near/F_far − 1)/T. In 80/84 contango: −4.76% a year with spot unchanged; in 80/77.60 backwardation: +3.09%. The performance component tourists forget.',
    moduleId: M6,
  },
  {
    terme: 'normal backwardation',
    en: 'normal backwardation',
    definition:
      'Théorie de Keynes : les producteurs, vendeurs structurels à terme pour fixer leur prix, tirent le futures sous le spot futur anticipé (F < E[S_T]) — le spéculateur acheteur encaisse l\'écart, prime du service d\'assurance rendu. À ne pas confondre avec la backwardation observée (F < S) : la première est inobservable, la seconde se lit à l\'écran.',
    definitionEn:
      'Keynes\'s theory: producers, structural forward sellers locking in their price, pull the futures below the expected future spot (F < E[S_T]) — the long speculator earns the gap, the premium for the insurance service rendered. Not to be confused with observed backwardation (F < S): the former is unobservable, the latter reads off the screen.',
    moduleId: M6,
  },
  {
    terme: 'AISC',
    en: 'all-in sustaining cost (AISC)',
    definition:
      'Coût complet de maintien par once des producteurs d\'or — extraction, traitement, maintenance et frais généraux —, norme sectorielle promue par le World Gold Council. Il sert à comparer les mines entre elles et à estimer un plancher économique de l\'offre : sous l\'AISC, produire détruit de la valeur.',
    definitionEn:
      'The all-in sustaining cost per ounce of gold producers — mining, processing, maintenance and overheads — an industry standard promoted by the World Gold Council. It serves to compare mines and to gauge an economic floor for supply: below AISC, producing destroys value.',
    moduleId: M6,
  },
  {
    terme: 'stablecoin',
    en: 'stablecoin',
    definition:
      'Jeton visant la parité fixe avec une devise, presque toujours le dollar. Deux mécaniques : collatéralisé (USDT, USDC — des réserves réelles, fonctionnellement un fonds monétaire qui ne dit pas son nom) ou algorithmique (la confiance seule — TerraUSD, mai 2022 : ~40 Md$ évaporés). Encours de l\'ordre de 300 Md$ début 2026.',
    definitionEn:
      'A token targeting a fixed parity with a currency, almost always the dollar. Two mechanics: collateralised (USDT, USDC — real reserves, functionally a money market fund that does not say its name) or algorithmic (trust alone — TerraUSD, May 2022: ~$40bn evaporated). Outstanding around $300bn in early 2026.',
    moduleId: M6,
  },
  {
    terme: 'halving',
    en: 'halving',
    definition:
      'Division par deux de la récompense par bloc de bitcoin, programmée tous les 210 000 blocs (environ quatre ans) : 50 bitcoins à l\'origine, 3,125 depuis avril 2024. C\'est le mécanisme qui fait converger l\'offre vers le plafond de 21 millions d\'unités — et qui ampute brutalement les revenus des mineurs.',
    definitionEn:
      'The halving of bitcoin\'s block reward, scheduled every 210,000 blocks (about four years): 50 bitcoins originally, 3.125 since April 2024. It is the mechanism that makes supply converge towards the 21 million cap — and that brutally cuts miners\' revenues.',
    moduleId: M6,
  },
  {
    terme: 'tokenisation',
    en: 'tokenisation',
    definition:
      'Inscription de titres traditionnels — fonds monétaires, obligations — sur blockchain. La promesse : le règlement quasi instantané et atomique (T+0), titre et cash changeant de mains dans la même écriture. Les obstacles : cash de banque centrale sur la chaîne, registres interopérables, droit des titres — la transformation avance au rythme des dépositaires et des législateurs.',
    definitionEn:
      'Recording traditional securities — money market funds, bonds — on blockchain. The promise: near-instant, atomic settlement (T+0), security and cash changing hands in the same entry. The obstacles: central bank cash on chain, interoperable ledgers, securities law — the transformation moves at the pace of CSDs and legislators.',
    moduleId: M6,
  },
  {
    terme: 'MiCA',
    en: 'Markets in Crypto-Assets (MiCA)',
    definition:
      'Règlement européen sur les crypto-actifs, adopté en 2023 et entré en application en 2024 : stablecoins encadrés à la mi-2024 (réserves, agrément, convertibilité au pair), prestataires agréés avec passeport européen ensuite. Première grande juridiction au cadre unifié — et le réflexe qui va avec : régulé ≠ recommandé, non régulé ≠ interdit.',
    definitionEn:
      'The European crypto-asset regulation, adopted in 2023 and applicable from 2024: stablecoins framed by mid-2024 (reserves, authorisation, par convertibility), then licensed service providers with a European passport. The first major jurisdiction with a unified framework — and the reflex that goes with it: regulated ≠ recommended, unregulated ≠ forbidden.',
    moduleId: M6,
  },
  {
    terme: 'dérivé ferme',
    en: 'forward commitment',
    definition:
      'Contrat qui oblige les DEUX parties : acheter pour l\'une, vendre pour l\'autre, à une date future et à un prix fixé dès aujourd\'hui — aucune ne peut se dédire. Payoff linéaire et symétrique, valeur nulle à la signature, jeu à somme nulle qui transfère le risque sans le détruire. Tout l\'opposé de l\'option, droit sans obligation payé d\'une prime (module 8).',
    definitionEn:
      'A contract binding BOTH parties: one must buy, the other must sell, at a future date and a price set today — neither can walk away. Linear, symmetric payoff, zero value at signature, a zero-sum game that transfers risk without destroying it. The exact opposite of the option, a right without obligation paid for with a premium (module 8).',
    moduleId: M7,
  },
  {
    terme: 'forward',
    en: 'forward',
    definition:
      'L\'engagement ferme en habit de gré à gré : bilatéral, sur mesure (montant, date, qualité libres), dénoué en un seul règlement à l\'échéance, livraison fréquente. Le défaut de la contrepartie est votre problème, le collatéral se négocie — et la sortie passe par une renégociation, pas par un carnet d\'ordres.',
    definitionEn:
      'The forward commitment in its OTC clothes: bilateral, tailor-made (free amount, date, quality), settled once at maturity, often with delivery. Your counterparty\'s default is your problem, collateral is negotiated — and exiting means renegotiating, not hitting an order book.',
    moduleId: M7,
  },
  {
    terme: 'futures',
    en: 'futures',
    definition:
      'L\'engagement ferme standardisé et coté en bourse : taille, échéances et tick imposés, chambre de compensation interposée, marges réglées chaque soir, livraison rare. Économiquement le même animal que le forward — institutionnellement le compromis inverse : la liquidité et la sécurité contre le sur-mesure.',
    definitionEn:
      'The standardised, exchange-traded forward commitment: contract size, maturities and tick imposed, a clearing house interposed, margins settled every evening, delivery rare. Economically the same animal as the forward — institutionally the opposite trade-off: liquidity and safety instead of tailoring.',
    moduleId: M7,
  },
  {
    terme: 'sous-jacent',
    en: 'underlying',
    definition:
      'L\'actif dont la valeur du dérivé dérive : indice, action, taux, devise, matière première — jusqu\'aux objets les plus immatériels, comme un taux d\'intérêt qui n\'existe pas encore (le FRA) ou l\'inflation future (le swap d\'inflation). Le dérivé en réplique les variations sans qu\'on le détienne.',
    definitionEn:
      'The asset from which the derivative\'s value derives: index, stock, rate, currency, commodity — down to the most immaterial objects, like an interest rate that does not yet exist (the FRA) or future inflation (the inflation swap). The derivative replicates its moves without owning it.',
    moduleId: M7,
  },
  {
    terme: 'notionnel',
    en: 'notional',
    definition:
      'Montant de référence servant d\'assiette au calcul des flux d\'un dérivé — et, sur l\'essentiel des contrats, jamais échangé (l\'exception : le cross-currency swap). Les centaines de billions de dollars d\'encours OTC mesurent l\'échelle de l\'activité, pas la perte possible : la valeur de marché n\'en est que quelques pourcents.',
    definitionEn:
      'The reference amount on which a derivative\'s flows are computed — and, on most contracts, never exchanged (the exception: the cross-currency swap). The hundreds of trillions of dollars of OTC outstandings measure the scale of activity, not the possible loss: market value is only a few percent of it.',
    moduleId: M7,
  },
  {
    terme: 'effet de levier',
    en: 'leverage',
    definition:
      'Démultiplication des variations du sous-jacent sur la mise : Δmise = Δsous-jacent/marge. À 10 % de marge, levier ×10 : +2 % de spot fait +20 % — et −12 % fait −120 % : la mise est effacée et il faut remettre au pot. On est engagé sur le notionnel entier, pas sur son dépôt : le levier dilate les deux queues de la distribution.',
    definitionEn:
      'The multiplication of the underlying\'s moves on your stake: Δstake = Δunderlying/margin. At 10% margin, ×10 leverage: +2% of spot makes +20% — and −12% makes −120%: the stake is wiped out and fresh cash is owed. You are committed on the full notional, not on your deposit: leverage dilates both tails of the distribution.',
    moduleId: M7,
  },
  {
    terme: 'multiplicateur',
    en: 'contract multiplier',
    definition:
      'Valeur en monnaie d\'un point de cotation d\'un futures, fixée par le contrat : 50 $ par point d\'indice sur l\'E-mini S&P 500, 10 € sur l\'Euro Stoxx 50. Notionnel = cours × multiplicateur : un E-mini avec l\'indice à 5 000 « pèse » 250 000 $ — pour quelques pourcents de marge.',
    definitionEn:
      'The currency value of one quotation point of a futures, set by the contract: $50 per index point on the E-mini S&P 500, €10 on the Euro Stoxx 50. Notional = price × multiplier: one E-mini with the index at 5,000 "weighs" $250,000 — for a few percent of margin.',
    moduleId: M7,
  },
  {
    terme: 'tick',
    en: 'tick size',
    definition:
      'Échelon minimal de cotation d\'un contrat, avec sa valeur en monnaie : 0,25 point soit 12,50 $ sur l\'E-mini S&P 500, 0,005 soit 12,50 € sur l\'Euribor 3 mois. C\'est l\'unité dans laquelle un desk compte ses gains et pertes en séance.',
    definitionEn:
      'The minimum price increment of a contract, with its currency value: 0.25 point i.e. $12.50 on the E-mini S&P 500, 0.005 i.e. €12.50 on the 3-month Euribor. It is the unit in which a desk counts its intraday gains and losses.',
    moduleId: M7,
  },
  {
    terme: 'marge de maintenance',
    en: 'maintenance margin',
    definition:
      'Seuil plancher du compte de marge, fixé sous la marge initiale : tant que le solde reste dessus, rien ne se passe ; passer STRICTEMENT dessous déclenche l\'appel de marge. Retenez le triplet de la convention futures américaine : la maintenance est le déclencheur, l\'initiale est la cible du versement.',
    definitionEn:
      'The floor of the margin account, set below the initial margin: as long as the balance stays above it, nothing happens; falling STRICTLY below triggers the margin call. Remember the US futures convention triplet: maintenance is the trigger, initial margin is the target of the payment.',
    moduleId: M7,
  },
  {
    terme: 'appel de marge',
    en: 'margin call',
    definition:
      'Versement exigé quand le solde passe sous la marge de maintenance : versement = marge initiale − solde — on recomplète le coussin entier, pas seulement le seuil (8 400 € de solde, maintenance 9 000, initiale 12 000 : verser 3 600 €, pas 600). Non honoré dans le délai, le courtier liquide d\'office — au pire moment par construction.',
    definitionEn:
      'The payment demanded when the balance falls below maintenance margin: payment = initial margin − balance — the full cushion is restored, not just the threshold (balance 8,400, maintenance 9,000, initial 12,000: pay €3,600, not €600). Unmet within the deadline, the broker liquidates the position — at the worst moment by construction.',
    moduleId: M7,
  },
  {
    terme: 'mark-to-market',
    en: 'marking to market',
    definition:
      'Réévaluation quotidienne de la position au cours de compensation : gains crédités, pertes débitées en cash via la marge de variation, chaque soir. La somme des flux redonne exactement le P&L total : le mark-to-market ne change pas ce qu\'on gagne, il en change le calendrier — et la trésorerie exigée en chemin peut tuer avant l\'échéance.',
    definitionEn:
      'The daily revaluation of the position at the settlement price: gains credited, losses debited in cash through variation margin, every evening. The flows sum exactly to the total P&L: marking to market does not change what you make, it changes its timing — and the cash demanded along the way can kill before maturity.',
    moduleId: M7,
  },
  {
    terme: 'netting multilatéral',
    en: 'multilateral netting',
    definition:
      'Compensation des positions face à la chambre : acheté à 5 010 le matin, vendu à 5 025 l\'après-midi, les deux contrats face à la même CCP s\'annulent — on est sorti du marché sans jamais retrouver sa contrepartie d\'origine. Impossible en bilatéral pur : c\'est l\'un des grands dividendes de la novation.',
    definitionEn:
      'The offsetting of positions against the clearing house: bought at 5,010 in the morning, sold at 5,025 in the afternoon, the two contracts facing the same CCP cancel out — you have left the market without ever finding your original counterparty. Impossible in pure bilateral trading: one of novation\'s great dividends.',
    moduleId: M7,
  },
  {
    terme: 'cascade de défaut',
    en: 'default waterfall',
    definition:
      'Ordre de mobilisation des ressources d\'une CCP quand un membre fait défaut : d\'abord les marges du défaillant (suffisantes dans l\'immense majorité des cas, Lehman compris), puis sa contribution au fonds de garantie, puis une tranche du capital de la chambre — le skin in the game —, enfin les contributions des membres survivants.',
    definitionEn:
      'The order in which a CCP\'s resources are mobilised when a member defaults: first the defaulter\'s margins (sufficient in the vast majority of cases, Lehman included), then its default fund contribution, then a slice of the clearing house\'s own capital — the skin in the game — and finally the surviving members\' contributions.',
    moduleId: M7,
  },
  {
    terme: 'fonds de garantie',
    en: 'default fund',
    definition:
      'Fonds pré-financé par tous les membres d\'une chambre de compensation, deuxième étage de la cascade de défaut : si les marges du défaillant ne suffisent pas, sa contribution est consommée, puis celles des autres. C\'est la mutualisation du risque extrême — le prix d\'appartenance à la forteresse.',
    definitionEn:
      'The pre-funded pool contributed by all members of a clearing house, the second layer of the default waterfall: if the defaulter\'s margins fall short, its contribution is consumed, then the others\'. It is the mutualisation of tail risk — the price of belonging to the fortress.',
    moduleId: M7,
  },
  {
    terme: 'cash and carry',
    en: 'cash and carry',
    definition:
      'Acheter le sous-jacent comptant, le financer et le porter jusqu\'à l\'échéance pour honorer une vente à terme : l\'arbitrage qui fixe le prix des forwards — F = S × (1 + (r − q)·T), q étant le revenu de l\'actif (dividendes, taux étranger, convenience yield). Le reverse cash and carry referme l\'écart dans l\'autre sens ; le prix vit dans une étroite bande de non-arbitrage.',
    definitionEn:
      'Buying the underlying spot, funding it and carrying it to maturity to honour a forward sale: the arbitrage that pins down forward prices — F = S × (1 + (r − q)·T), q being the asset\'s income (dividends, foreign rate, convenience yield). The reverse cash and carry closes the gap the other way; the price lives inside a narrow no-arbitrage band.',
    moduleId: M7,
  },
  {
    terme: 'FRA',
    en: 'forward rate agreement (FRA)',
    definition:
      'Contrat de gré à gré fixant aujourd\'hui le taux d\'un emprunt ou placement futur ; la notation compte en mois : 6×12 = période commençant dans 6 mois, finissant dans 12. Aucun capital ne circule — au fixing, on règle le différentiel actualisé. Le long (payeur du fixe) gagne quand les taux montent : c\'est l\'emprunteur qui se couvre.',
    definitionEn:
      'An OTC contract fixing today the rate of a future loan or deposit; the notation counts in months: 6×12 = a period starting in 6 months and ending in 12. No principal moves — at fixing, only the discounted differential is settled. The long (fixed-rate payer) wins when rates rise: it is the borrower\'s hedge.',
    moduleId: M7,
  },
  {
    terme: 'taux forward implicite',
    en: 'implied forward rate',
    definition:
      'Le taux entre t₁ et t₂ déduit de la courbe par absence d\'arbitrage — une fabrication, pas une prévision : placer d\'un bloc ou placer puis rouler au forward doivent rapporter pareil. En linéaire monétaire : f = [(1 + r₂t₂)/(1 + r₁t₁) − 1]/(t₂ − t₁) ; 3 % à 6 mois et 3,5 % à 1 an donnent 3,9409 %.',
    definitionEn:
      'The rate between t₁ and t₂ derived from the curve by absence of arbitrage — a fabrication, not a forecast: investing in one block or investing then rolling at the forward must pay the same. In money-market linear terms: f = [(1 + r₂t₂)/(1 + r₁t₁) − 1]/(t₂ − t₁); 3% at 6 months and 3.5% at 1 year give 3.9409%.',
    moduleId: M7,
  },
  {
    terme: 'futures de taux courts (STIR)',
    en: 'short-term interest rate futures (STIR)',
    definition:
      'La version standardisée et cotée du FRA : SOFR 3 mois à Chicago, Euribor 3 mois sur ICE — parmi les contrats les plus traités du monde. Convention prix = 100 − taux : le prix baisse quand les taux montent, et l\'emprunteur se couvre en VENDANT des contrats. Le point de base vaut 25 € sur l\'Euribor 3 mois.',
    definitionEn:
      'The standardised, exchange-traded version of the FRA: 3-month SOFR in Chicago, 3-month Euribor on ICE — among the most traded contracts in the world. Price = 100 − rate convention: the price falls when rates rise, and the borrower hedges by SELLING contracts. A basis point is worth €25 on the 3-month Euribor.',
    moduleId: M7,
  },
  {
    terme: 'strip',
    en: 'futures strip',
    definition:
      'La bande des échéances trimestrielles successives d\'un futures de taux : lus en creux, ces prix dessinent la trajectoire des taux courts pricée par le marché — l\'écran que toutes les salles regardent les soirs de banque centrale, et la source des fameuses « probabilités de hausse » des Fed funds futures (une convention de calcul, pas un sondage).',
    definitionEn:
      'The band of successive quarterly maturities of a rate futures: read in reverse, those prices draw the short-rate path the market is pricing — the screen every trading floor watches on central bank evenings, and the source of the famous Fed funds futures "hike probabilities" (a computational convention, not a poll).',
    moduleId: M7,
  },
  {
    terme: 'SOFR',
    en: 'SOFR',
    definition:
      'Le taux au jour le jour américain calculé sur les transactions réelles du marché du repo — successeur du Libor, mort du scandale des déclarations biaisées (transition achevée pour l\'essentiel entre 2021 et juin 2023). Backward-looking : composé au fil de l\'eau, connu en fin de période — contrairement au Libor, connu d\'avance comme un fixing de FRA.',
    definitionEn:
      'The US overnight rate computed from actual repo market transactions — the successor of Libor, which died of the rigged-submissions scandal (transition essentially completed between 2021 and June 2023). Backward-looking: compounded along the way, known at the end of the period — unlike Libor, known in advance like an FRA fixing.',
    moduleId: M7,
  },
  {
    terme: 'swap de taux',
    en: 'interest rate swap (IRS)',
    definition:
      'Échange, à dates régulières et sur une durée convenue, de flux d\'intérêts fixes contre variables calculés sur un notionnel jamais échangé — économiquement une chaîne de FRA mis bout à bout, en pratique l\'instrument de taux le plus traité au monde. Usages : figer le coût d\'une dette variable, piloter une duration sans acheter un titre, prendre une vue sur les taux.',
    definitionEn:
      'The exchange, at regular dates over an agreed term, of fixed against floating interest flows computed on a notional that is never exchanged — economically a chain of FRAs laid end to end, in practice the most traded rates instrument in the world. Uses: locking the cost of floating debt, steering a duration without buying a single bond, taking a view on rates.',
    moduleId: M7,
  },
  {
    terme: 'jambe fixe / jambe variable',
    en: 'fixed leg / floating leg',
    definition:
      'Les deux séries de flux d\'un swap : la jambe fixe verse le même coupon à chaque date (notionnel × taux fixe), la jambe variable le taux constaté à chaque fixing (Euribor, €STR, SOFR). La clé du pricing : « jambe variable + notionnel » vaut le pair à chaque fixing — valoriser un swap ne demande aucune prévision de taux.',
    definitionEn:
      'The two flow streams of a swap: the fixed leg pays the same coupon at every date (notional × fixed rate), the floating leg pays the rate observed at each fixing (Euribor, €STR, SOFR). The pricing key: "floating leg + notional" is worth par at every fixing — valuing a swap requires no rate forecast at all.',
    moduleId: M7,
  },
  {
    terme: 'payeur fixe / receveur fixe',
    en: 'payer / receiver',
    definition:
      'Le payeur fixe paie le fixe et reçoit le variable — duration négative : il gagne quand les taux montent, comme un vendeur d\'obligations ; le receveur fixe fait l\'inverse — duration longue, l\'outil de l\'assureur qui allonge son bilan. Convention de salle : « payer le swap », comme « acheter » le swap, c\'est payer le fixe.',
    definitionEn:
      'The payer pays fixed and receives floating — negative duration: he wins when rates rise, like a bond seller; the receiver does the opposite — long duration, the insurer\'s tool for extending its balance sheet. Floor convention: "paying the swap", like "buying" it, means paying fixed.',
    moduleId: M7,
  },
  {
    terme: 'taux de swap paritaire',
    en: 'par swap rate',
    definition:
      'Le taux fixe qui annule la valeur du swap à la signature : C* = (1 − df_n)/Σ df — le coupon qui amortit exactement la décote du notionnel actualisé, moyenne pondérée de la courbe zéro (courbe plate à r ⇒ paritaire = r). Coté en continu sur toutes les maturités, il forme la courbe de référence du marché des taux.',
    definitionEn:
      'The fixed rate that makes the swap worth zero at signature: C* = (1 − df_n)/Σ df — the coupon that exactly amortises the discounted notional\'s haircut, a weighted average of the zero curve (flat curve at r ⇒ par rate = r). Quoted continuously across maturities, it forms the rates market\'s reference curve.',
    moduleId: M7,
  },
  {
    terme: 'compression',
    en: 'portfolio compression',
    definition:
      'Résiliation périodique des contrats redondants entre membres d\'une chambre, remplacés par un jeu réduit de swaps portant le même risque net : les notionnels bruts dégonflent, les expositions ne changent pas. C\'est l\'une des raisons pour lesquelles les encours notionnels, déjà trompeurs, surestiment encore l\'activité réelle.',
    definitionEn:
      'The periodic tearing-up of redundant contracts between clearing members, replaced by a reduced set of swaps carrying the same net risk: gross notionals deflate, exposures do not change. One more reason why notional outstandings, already misleading, overstate real activity.',
    moduleId: M7,
  },
  {
    terme: 'cross-currency swap',
    en: 'cross-currency swap',
    definition:
      'Swap échangeant des flux d\'intérêts dans deux devises ET les notionnels — au départ au spot du jour, à l\'échéance au même cours : c\'est lui qui transforme réellement une dette d\'une devise dans une autre (l\'émetteur en dollars aux revenus en euros). Risque de contrepartie bien supérieur au swap de taux : un capital entier doit revenir. C\'est aussi le marché où se cote le cross-currency basis sur les maturités longues.',
    definitionEn:
      'A swap exchanging interest flows in two currencies AND the notionals — at inception at the day\'s spot, at maturity at the same rate: it is what genuinely turns debt from one currency into another (the dollar issuer with euro revenues). Counterparty risk far above an interest rate swap\'s: a full principal must come back. It is also the market where the cross-currency basis is quoted at long maturities.',
    moduleId: M7,
  },
  {
    terme: 'point mort d\'inflation',
    en: 'breakeven inflation',
    definition:
      'Le taux fixe d\'équilibre d\'un swap d\'inflation zéro-coupon : par construction, le niveau d\'inflation moyen qui rendrait les deux jambes équivalentes — la mesure de marché des anticipations d\'inflation, cotée en continu, maturité par maturité. « Le marché anticipe 2,1 % à 5 ans » vient très souvent de ce marché-là.',
    definitionEn:
      'The equilibrium fixed rate of a zero-coupon inflation swap: by construction, the average inflation level that would make both legs equivalent — the market measure of inflation expectations, quoted continuously, maturity by maturity. "The market expects 2.1% over 5 years" very often comes from this market.',
    moduleId: M7,
  },
  {
    terme: 'total return swap (TRS)',
    en: 'total return swap (TRS)',
    definition:
      'Échange de la performance totale d\'un actif — revenus plus plus-values, moins-values indemnisées — contre un taux de financement : l\'exposition économique sans la détention juridique, pour un simple dépôt de garantie. Machine à levier invisible : Archegos (mars 2021) y avait logé des positions massives qu\'aucun marché ne voyait — environ 10 Md$ de pertes bancaires, dont ~5,5 pour Credit Suisse.',
    definitionEn:
      'The exchange of an asset\'s total return — income plus gains, losses indemnified — against a funding rate: economic exposure without legal ownership, for a mere guarantee deposit. An invisible leverage machine: Archegos (March 2021) had parked massive positions there that no market could see — about $10bn of bank losses, ~5.5 of them for Credit Suisse.',
    moduleId: M7,
  },
  {
    terme: 'contrat-cadre ISDA',
    en: 'ISDA Master Agreement',
    definition:
      'Le contrat unique sous lequel vivent toutes les transactions de dérivés entre deux contreparties : juridiquement un tout. Il permet le netting de clôture (close-out netting) : en cas de défaut, toutes les valeurs, positives et négatives, se compensent en un solde net unique — un liquidateur ne peut pas encaisser les contrats gagnants et répudier les perdants.',
    definitionEn:
      'The single agreement under which all derivative transactions between two counterparties live: legally one whole. It enables close-out netting: upon default, all values, positive and negative, are offset into a single net balance — a liquidator cannot cherry-pick the winning contracts and repudiate the losers.',
    moduleId: M7,
  },
  {
    terme: 'CSA',
    en: 'Credit Support Annex (CSA)',
    definition:
      'L\'annexe du contrat-cadre ISDA qui organise le collatéral : la partie dont le portefeuille net est perdant verse régulièrement des garanties, le plus souvent en cash, à hauteur de la valeur de marché. Exposition nettée puis collatéralisée : voilà comment des notionnels vertigineux coexistent avec des risques bilatéraux contenus.',
    definitionEn:
      'The annex to the ISDA Master Agreement that organises collateral: the party whose net portfolio is losing regularly posts guarantees, most often in cash, up to the market value. Exposure netted then collateralised: that is how dizzying notionals coexist with contained bilateral risks.',
    moduleId: M7,
  },
  {
    terme: 'compensation centrale obligatoire',
    en: 'mandatory central clearing',
    definition:
      'Pilier des réformes post-2008 (EMIR en Europe, Dodd-Frank aux États-Unis) : les swaps standardisés passent obligatoirement en chambre de compensation, marges quotidiennes à l\'appui — la discipline des futures imposée au gré à gré, complétée par des marges bilatérales sur le non-compensé et la déclaration aux référentiels centraux. Le risque n\'est pas supprimé : il est déplacé vers quelques CCP devenues systémiques, mieux surveillées.',
    definitionEn:
      'A pillar of the post-2008 reforms (EMIR in Europe, Dodd-Frank in the US): standardised swaps must be cleared through a CCP, daily margins attached — futures discipline imposed on OTC markets, completed by bilateral margins on uncleared trades and reporting to trade repositories. The risk is not removed: it is moved into a few systemic, better-supervised CCPs.',
    moduleId: M7,
  },
  {
    terme: 'risque de base',
    en: 'basis risk',
    definition:
      'Le risque résiduel d\'une couverture faite avec un instrument imparfaitement corrélé à l\'exposition réelle : couvrir le kérosène avec du brut neutralise le brut, l\'écart kérosène-brut reste à charge. Ordre de grandeur : 1 % de base qui bouge sur 25 M€ couverts, c\'est 250 000 € de dérapage. Une couverture troque le risque de prix contre le risque de base — elle ne supprime rien.',
    definitionEn:
      'The residual risk of a hedge built with an instrument imperfectly correlated with the true exposure: hedging jet fuel with crude neutralises crude, the jet-crude gap stays with you. Order of magnitude: a 1% basis move on a €25m hedge is a €250,000 slip. A hedge trades price risk for basis risk — it removes nothing.',
    moduleId: M7,
  },
  {
    terme: 'stack and roll',
    en: 'stack and roll',
    definition:
      'Couvrir un engagement de long terme en empilant la couverture sur le contrat futures court — le seul vraiment liquide — et en la faisant rouler d\'échéance en échéance. Le cas d\'école : Metallgesellschaft (1993) — pertes cash immédiates sur les futures (appels de marge) contre gains latents sur les contrats clients, asphyxie de trésorerie, débouclage forcé, environ 1,3 Md$ de pertes.',
    definitionEn:
      'Hedging a long-term commitment by stacking the hedge on the short-dated futures — the only truly liquid one — and rolling it from maturity to maturity. The textbook case: Metallgesellschaft (1993) — immediate cash losses on the futures (margin calls) against latent gains on the client contracts, cash asphyxiation, forced unwind, about $1.3bn of losses.',
    moduleId: M7,
  },
  {
    terme: 'option',
    en: 'option',
    definition:
      'Contrat qui donne à son acheteur le droit, SANS l\'obligation, d\'acheter (call) ou de vendre (put) un sous-jacent à un prix fixé d\'avance (le strike), à — ou jusqu\'à — une échéance donnée, contre le paiement d\'une prime. Là où le dérivé ferme du module 7 vaut zéro à la signature — deux obligations qui se compensent —, un droit sans obligation en face ne peut pas être gratuit.',
    definitionEn:
      'A contract giving its buyer the right, WITHOUT the obligation, to buy (call) or sell (put) an underlying at a price fixed in advance (the strike), at — or up to — a given expiry, against payment of a premium. Where module 7\'s forward commitment is worth zero at signature — two offsetting obligations —, a right with no obligation facing it cannot be free.',
    moduleId: M8,
  },
  {
    terme: 'call',
    en: 'call',
    definition:
      'Option d\'achat : le droit d\'acheter le sous-jacent au strike. Payoff à l\'échéance max(S_T − K, 0) — la « crosse de hockey » coudée au strike. L\'acheteur risque au plus la prime et garde un gain illimité ; le vendeur encaisse au plus la prime et porte une perte illimitée s\'il ne détient pas le titre.',
    definitionEn:
      'The option to buy: the right to purchase the underlying at the strike. Payoff at expiry max(S_T − K, 0) — the "hockey stick" kinked at the strike. The buyer risks at most the premium and keeps an unlimited upside; the seller pockets at most the premium and carries an unlimited loss if he does not own the stock.',
    moduleId: M8,
  },
  {
    terme: 'put',
    en: 'put',
    definition:
      'Option de vente : le droit de vendre le sous-jacent au strike. Payoff à l\'échéance max(K − S_T, 0) : il paie la chute. Gain massif mais borné — au plus le strike moins la prime, l\'action ne descendant pas sous zéro. Acheté contre un portefeuille, c\'est l\'assurance anti-baisse au sens propre.',
    definitionEn:
      'The option to sell: the right to sell the underlying at the strike. Payoff at expiry max(K − S_T, 0): it pays on the fall. A large but bounded gain — at most the strike minus the premium, since the stock cannot go below zero. Bought against a portfolio, it is downside insurance in the literal sense.',
    moduleId: M8,
  },
  {
    terme: 'prime',
    en: 'premium',
    definition:
      'Le prix du droit, payé comptant par l\'acheteur au vendeur. Elle se découpe toujours en deux : valeur intrinsèque (ce que rapporterait l\'exercice immédiat) plus valeur temps (le prix de ce qui peut encore arriver). C\'est la perte maximale de l\'acheteur et le gain maximal du vendeur — l\'asymétrie fondatrice du marché des options.',
    definitionEn:
      'The price of the right, paid upfront by the buyer to the seller. It always splits in two: intrinsic value (what immediate exercise would earn) plus time value (the price of what can still happen). It is the buyer\'s maximum loss and the seller\'s maximum gain — the founding asymmetry of the options market.',
    moduleId: M8,
  },
  {
    terme: 'strike',
    en: 'strike (exercise price)',
    definition:
      'Le prix d\'exercice, noté K, fixé d\'avance dans le contrat : le prix auquel le call permet d\'acheter et le put de vendre. C\'est le coude du payoff — et il ne faut pas le confondre avec le seuil de profit : le point mort, strike plus ou moins la prime.',
    definitionEn:
      'The exercise price, written K, fixed in advance in the contract: the price at which the call lets you buy and the put lets you sell. It is the kink of the payoff — not to be confused with the profit threshold: the break-even, strike plus or minus the premium.',
    moduleId: M8,
  },
  {
    terme: 'échéance',
    en: 'expiry (maturity)',
    definition:
      'La date à laquelle le droit meurt. À l\'échéance, le temps est épuisé : la valeur temps tombe à zéro et la prime rejoint la valeur intrinsèque — c\'est le sens même du payoff. Avant elle, chaque jour qui passe ronge la valeur temps : c\'est le theta.',
    definitionEn:
      'The date on which the right dies. At expiry, time is used up: time value falls to zero and the premium collapses onto intrinsic value — the very meaning of the payoff. Before it, each passing day gnaws at time value: that is theta.',
    moduleId: M8,
  },
  {
    terme: 'exercice',
    en: 'exercise',
    definition:
      'Utiliser son droit : acheter au strike (call) ou vendre au strike (put). L\'acheteur n\'exerce que si cela l\'arrange — sinon il abandonne, et sa perte s\'arrête à la prime. Réflexe d\'oral : exercer n\'est pas gagner — entre le strike et le point mort, on exerce pour réduire la perte, pas pour faire un profit.',
    definitionEn:
      'Using one\'s right: buying at the strike (call) or selling at the strike (put). The buyer only exercises if it pays — otherwise he abandons, and his loss stops at the premium. Oral reflex: exercising is not winning — between the strike and the break-even, you exercise to reduce the loss, not to make a profit.',
    moduleId: M8,
  },
  {
    terme: 'option européenne / américaine',
    en: 'European / American option',
    definition:
      'L\'européenne ne s\'exerce qu\'à l\'échéance ; l\'américaine à tout moment jusqu\'à l\'échéance — la géographie n\'y est pour rien. À droits supplémentaires, prix supérieur ou égal : l\'américaine vaut toujours au moins autant. Black-Scholes price l\'européenne en formule fermée ; l\'américaine se traite par arbre binomial, en comparant à chaque nœud continuation et exercice immédiat.',
    definitionEn:
      'The European style can only be exercised at expiry; the American style at any time up to expiry — geography has nothing to do with it. More rights, higher or equal price: the American is always worth at least as much. Black-Scholes prices the European in closed form; the American is handled with a binomial tree, comparing continuation and immediate exercise at each node.',
    moduleId: M8,
  },
  {
    terme: 'dans / à / hors de la monnaie',
    en: 'in / at / out of the money',
    definition:
      'La moneyness : position du spot par rapport au strike. Dans la monnaie (ITM), exercer rapporterait — S > K pour un call, S < K pour un put ; hors de la monnaie (OTM), exercer n\'aurait aucun sens ; à la monnaie (ATM), S ≈ K. Attention : OTM ne veut pas dire sans valeur — la prime y est entièrement de la valeur temps. Et c\'est ATM que l\'incertitude, donc l\'optionnalité — valeur temps, gamma, vega — culmine.',
    definitionEn:
      'Moneyness: the spot\'s position relative to the strike. In the money (ITM), exercising would pay — S > K for a call, S < K for a put; out of the money (OTM), exercising would make no sense; at the money (ATM), S ≈ K. Careful: OTM does not mean worthless — there, the premium is pure time value. And it is ATM that uncertainty, hence optionality — time value, gamma, vega — peaks.',
    moduleId: M8,
  },
  {
    terme: 'valeur intrinsèque',
    en: 'intrinsic value',
    definition:
      'Ce que rapporterait l\'exercice immédiat : max(S − K, 0) pour un call, max(K − S, 0) pour un put — nulle pour toute option à la monnaie ou hors de la monnaie. Le réflexe propre devant une prime : la découper en valeur intrinsèque plus valeur temps.',
    definitionEn:
      'What immediate exercise would earn: max(S − K, 0) for a call, max(K − S, 0) for a put — zero for any at-the-money or out-of-the-money option. The clean reflex in front of any premium: split it into intrinsic value plus time value.',
    moduleId: M8,
  },
  {
    terme: 'valeur temps',
    en: 'time value',
    definition:
      'L\'écart entre la prime et la valeur intrinsèque : le prix de ce qui peut encore arriver — le droit de choisir APRÈS avoir vu vaut de l\'argent tant qu\'il reste du temps et de la volatilité. Maximale à la monnaie (le call canonique ATM à 10,45 est de la valeur temps à l\'état pur), elle fond avec le temps et s\'éteint à l\'échéance.',
    definitionEn:
      'The gap between the premium and intrinsic value: the price of what can still happen — the right to choose AFTER seeing is worth money as long as time and volatility remain. Greatest at the money (the canonical ATM call at 10.45 is pure time value), it melts away with time and dies at expiry.',
    moduleId: M8,
  },
  {
    terme: 'quotité',
    en: 'contract size',
    definition:
      'Le nombre d\'unités de sous-jacent par contrat d\'option listé — typiquement 100 actions : une prime cotée 4 € se paie 400 € par contrat, et le delta-hedge se calcule en multipliant par elle. Héritière directe du multiplicateur des futures du module 7.',
    definitionEn:
      'The number of underlying units per listed option contract — typically 100 shares: a premium quoted at €4 costs €400 per contract, and the delta hedge is computed by multiplying by it. The direct heir of the futures multiplier from module 7.',
    moduleId: M8,
  },
  {
    terme: 'point mort',
    en: 'break-even',
    definition:
      'Le seuil de profit d\'une position optionnelle : strike PLUS prime pour un call (100 + 4 = 104), strike MOINS prime pour un put, strike ± coût total pour un straddle. Ce n\'est pas le strike : entre les deux, on exerce pour réduire la perte sans gagner d\'argent — la confusion la plus fréquente des diagrammes de P&L.',
    definitionEn:
      'The profit threshold of an option position: strike PLUS premium for a call (100 + 4 = 104), strike MINUS premium for a put, strike ± total cost for a straddle. It is not the strike: between the two, you exercise to reduce the loss without making money — the most common confusion on P&L diagrams.',
    moduleId: M8,
  },
  {
    terme: 'straddle',
    en: 'straddle',
    definition:
      'Call et put achetés au même strike : un pari sur l\'amplitude du mouvement, pas sur sa direction. Points morts au strike ± coût total (100 ± 10 → 90 et 110) ; pile au strike, les deux jambes meurent ensemble — le calme plat est la perte maximale. L\'acheter, c\'est acheter du mouvement ; le vendre, c\'est vendre du calme — assureur des deux côtés à la fois.',
    definitionEn:
      'A call and a put bought at the same strike: a bet on the size of the move, not its direction. Break-evens at strike ± total cost (100 ± 10 → 90 and 110); exactly at the strike, both legs die together — a flat market is the maximum loss. Buying it is buying movement; selling it is selling calm — an insurer on both sides at once.',
    moduleId: M8,
  },
  {
    terme: 'strangle',
    en: 'strangle',
    definition:
      'Le straddle aux strikes écartés : put sous le spot plus call au-dessus (put 90 + call 110, par exemple). Moins cher que le straddle — les deux jambes sont hors de la monnaie — mais le mouvement requis pour gagner est plus grand : on paie moins pour exiger plus.',
    definitionEn:
      'The straddle with strikes pulled apart: a put below the spot plus a call above (put 90 + call 110, say). Cheaper than the straddle — both legs are out of the money — but the move needed to win is larger: you pay less to demand more.',
    moduleId: M8,
  },
  {
    terme: 'spread vertical (bull/bear)',
    en: 'vertical spread (bull/bear)',
    definition:
      'Une jambe achetée financée par une jambe vendue à un autre strike. Bull call spread : call 100 acheté 4, call 110 vendu 1,50 — débit 2,50, gain plafonné à 7,50, point mort abaissé à 102,50 : la signature d\'une vue haussière modérée. Le bear put spread est son miroir baissier. La grammaire à retenir : toute jambe vendue réduit le coût et abandonne un morceau du profil.',
    definitionEn:
      'A bought leg financed by a leg sold at another strike. Bull call spread: 100 call bought at 4, 110 call sold at 1.50 — net debit 2.50, gain capped at 7.50, break-even lowered to 102.50: the signature of a moderately bullish view. The bear put spread is its bearish mirror. The grammar to remember: every sold leg cuts the cost and gives up a piece of the profile.',
    moduleId: M8,
  },
  {
    terme: 'covered call',
    en: 'covered call',
    definition:
      'Détenir l\'action et vendre un call dessus : la prime tombe — un « revenu » —, mais au-delà du strike les titres sont livrés et la hausse ne vous appartient plus. La parité requalifie la position : action + call vendu = put vendu — gains plafonnés, baisse presque entière à charge. La prime n\'est pas un cadeau : c\'est le prix de la hausse que vous venez de vendre.',
    definitionEn:
      'Owning the stock and selling a call on it: the premium comes in — an "income" —, but beyond the strike the shares are called away and the upside is no longer yours. Parity requalifies the position: stock + short call = short put — capped gains, nearly the whole downside kept. The premium is not a gift: it is the price of the upside you just sold.',
    moduleId: M8,
  },
  {
    terme: 'put protecteur',
    en: 'protective put',
    definition:
      'Action plus put acheté : l\'assurance de portefeuille au sens propre — plancher garanti au strike (moins la prime), hausse conservée (moins la prime). Le choix du strike est un choix de franchise : plus OTM, moins cher, moins protecteur. Le coût réel est la valeur temps qui fond : s\'assurer en permanence, en roulant les puts, ampute durablement la performance.',
    definitionEn:
      'Stock plus a bought put: portfolio insurance in the literal sense — a guaranteed floor at the strike (minus the premium), upside kept (minus the premium). Choosing the strike is choosing a deductible: further OTM, cheaper, less protective. The true cost is the melting time value: staying permanently insured, rolling the puts, durably eats into performance.',
    moduleId: M8,
  },
  {
    terme: 'collar',
    en: 'collar',
    definition:
      'Un put protecteur financé par un covered call : put acheté, call OTM vendu, la prime encaissée payant tout ou partie de la prime versée. Résultat : protégé sous le strike du put, plafonné au strike du call, pour un coût net proche de zéro — l\'habit classique du dirigeant qui doit garder ses titres sans pouvoir en porter tout le risque.',
    definitionEn:
      'A protective put financed by a covered call: put bought, OTM call sold, the premium received paying all or part of the premium paid. Result: protected below the put strike, capped at the call strike, for a net cost close to zero — the classic outfit of the executive who must keep his shares but cannot carry all their risk.',
    moduleId: M8,
  },
  {
    terme: 'parité call-put',
    en: 'put-call parity',
    definition:
      'C − P = S − K·e^{−rT} : call + placement et put + action paient max(S_T, K) dans tous les états du monde, donc cotent le même prix — arbitrage pur, aucun modèle, seulement des options européennes sans dividende. Elle livre le put depuis le call en une ligne, fabrique les synthétiques (call − put = forward), et impose Δcall − Δput = 1, gammas et vegas identiques.',
    definitionEn:
      'C − P = S − K·e^{−rT}: call + deposit and put + stock pay max(S_T, K) in every state of the world, so they trade at the same price — pure arbitrage, no model, only European options without dividends. It delivers the put from the call in one line, builds the synthetics (call − put = forward), and forces Δcall − Δput = 1, identical gammas and vegas.',
    moduleId: M8,
  },
  {
    terme: 'arbre binomial',
    en: 'binomial tree',
    definition:
      'Le modèle de pricing minimal : une période, deux états — et le geste fondateur, répliquer l\'option avec Δ actions et un emprunt : le prix est le coût de fabrication, la probabilité réelle de hausse ne figure nulle part. En multipliant les pas, la binomiale converge vers la lognormale et l\'arbre vers Black-Scholes. Il survit à sa propre limite : c\'est l\'outil de production des options américaines.',
    definitionEn:
      'The minimal pricing model: one period, two states — and the founding move, replicating the option with Δ shares and a loan: the price is the manufacturing cost, the real probability of a rise appears nowhere. Multiplying the steps, the binomial converges to the lognormal and the tree to Black-Scholes. It outlives its own limit: it is the production tool for American options.',
    moduleId: M8,
  },
  {
    terme: 'probabilité risque-neutre',
    en: 'risk-neutral probability',
    definition:
      'Le poids q = ((1 + rT) − d)/(u − d) sous lequel le sous-jacent actualisé devient un jeu équitable — une martingale : sous q, l\'action rapporte exactement le taux sans risque. Ce n\'est PAS une prévision : q se déduit de trois nombres d\'arbitrage, l\'aversion au risque étant déjà dans les prix. La valeur d\'un dérivé est l\'espérance risque-neutre de son payoff, actualisée — pas son espérance tout court.',
    definitionEn:
      'The weight q = ((1 + rT) − d)/(u − d) under which the discounted underlying becomes a fair game — a martingale: under q, the stock earns exactly the risk-free rate. It is NOT a forecast: q is derived from three arbitrage numbers, risk aversion being already in the prices. A derivative\'s value is the risk-neutral expectation of its payoff, discounted — not its plain expectation.',
    moduleId: M8,
  },
  {
    terme: 'Black-Scholes',
    en: 'Black-Scholes',
    definition:
      'La formule de 1973 pour le call européen sans dividende : C = S·N(d1) − K·e^{−rT}·N(d2) — cinq ingrédients (spot, strike, taux, volatilité, échéance) et la cloche du module 2 en moteur. Ses hypothèses sont fausses — volatilité constante, queues lognormales — et le marché le sait depuis 1987 : faux comme modèle, indispensable comme langue de cotation — le convertisseur universel prix ↔ vol.',
    definitionEn:
      'The 1973 formula for the European call without dividends: C = S·N(d1) − K·e^{−rT}·N(d2) — five ingredients (spot, strike, rate, volatility, expiry) with module 2\'s bell curve as the engine. Its assumptions are wrong — constant volatility, lognormal tails — and the market has known it since 1987: wrong as a model, indispensable as a quoting language — the universal price ↔ vol converter.',
    moduleId: M8,
  },
  {
    terme: 'd₁ et d₂',
    en: 'd1 and d2',
    definition:
      'Les deux arguments de la formule : d₁ = [ln(S/K) + (r + σ²/2)T]/(σ√T) et d₂ = d₁ − σ√T. N(d₂) est la probabilité risque-neutre d\'exercice — le poids q de l\'arbre devenu aire sous la cloche ; N(d₁), légèrement au-dessus, est le delta du call : il pondère aussi par la valeur de l\'action dans les états d\'exercice. Les confondre est LE piège classique. Sur le canonique : 0,35 et 0,15.',
    definitionEn:
      'The formula\'s two arguments: d1 = [ln(S/K) + (r + σ²/2)T]/(σ√T) and d2 = d1 − σ√T. N(d2) is the risk-neutral probability of exercise — the tree\'s weight q turned into an area under the bell curve; N(d1), slightly above, is the call\'s delta: it also weights by the stock\'s value in the exercise states. Confusing them is THE classic trap. On the canonical example: 0.35 and 0.15.',
    moduleId: M8,
  },
  {
    terme: 'delta',
    en: 'delta',
    definition:
      'La sensibilité de la prime au sous-jacent : N(d1) pour un call — 0,6368 sur le canonique —, N(d1) − 1 pour un put, négatif. Trois lectures : une pente (l\'action prend 1, le call prend 0,64), un ratio de couverture (0,6368 action par call vendu), et à peu près une probabilité d\'exercice — approximative : la vraie est N(d2), que N(d1) surestime. Bornes : 0 très OTM, ±1 très ITM.',
    definitionEn:
      'The premium\'s sensitivity to the underlying: N(d1) for a call — 0.6368 on the canonical example —, N(d1) − 1 for a put, negative. Three readings: a slope (the stock gains 1, the call gains 0.64), a hedge ratio (0.6368 shares per call sold), and roughly a probability of exercise — approximate: the true one is N(d2), which N(d1) overstates. Bounds: 0 deep OTM, ±1 deep ITM.',
    moduleId: M8,
  },
  {
    terme: 'gamma',
    en: 'gamma',
    definition:
      'La dérivée seconde du prix — la convexité : de combien bouge le delta quand l\'action bouge de 1 (0,0188 sur le canonique). Identique pour le call et le put, positif pour le détenteur de l\'option, maximal à la monnaie et explosif près de l\'échéance. Le vendeur gamma-négatif réajuste à contre-pied — achète après la hausse, vend après la baisse — et paie ≈ ½Γ(ΔS)² par trajet.',
    definitionEn:
      'The price\'s second derivative — convexity: how much the delta moves when the stock moves by 1 (0.0188 on the canonical example). Identical for call and put, positive for the option holder, greatest at the money and explosive near expiry. The gamma-negative seller readjusts wrong-footed — buying after the rise, selling after the fall — and pays ≈ ½Γ(ΔS)² per move.',
    moduleId: M8,
  },
  {
    terme: 'thêta',
    en: 'theta',
    definition:
      'La sensibilité au temps qui passe : négatif pour le détenteur d\'une option à la monnaie — chaque jour sans mouvement ronge la valeur temps, de plus en plus vite près de l\'échéance. Le loyer du gamma : celui qui détient la convexité paie un loyer quotidien, celui qui la subit est payé pour attendre — P&L d\'un book delta-hedgé ≈ ½Γ(ΔS)² + ΘΔt.',
    definitionEn:
      'The sensitivity to passing time: negative for the holder of an at-the-money option — each day without movement gnaws at time value, faster and faster near expiry. The rent of gamma: whoever holds the convexity pays a daily rent, whoever suffers it is paid to wait — a delta-hedged book\'s P&L ≈ ½Γ(ΔS)² + ΘΔt.',
    moduleId: M8,
  },
  {
    terme: 'vega',
    en: 'vega',
    definition:
      'La sensibilité du prix à la volatilité, cotée PAR POINT de vol : 0,3752 sur le canonique — σ passe de 20 % à 21 %, le call prend 0,38. Identique call/put, maximal à la monnaie, croissant avec la maturité — les options longues sont des instruments à vega, les courtes à gamma. Le paradoxe d\'oral : mesurer la sensibilité à un paramètre que le modèle suppose constant est l\'aveu chiffré que Black-Scholes se sait faux.',
    definitionEn:
      'The price\'s sensitivity to volatility, quoted PER vol POINT: 0.3752 on the canonical example — σ moves from 20% to 21%, the call gains 0.38. Identical for call and put, greatest at the money, increasing with maturity — long-dated options are vega instruments, short-dated ones gamma instruments. The oral paradox: measuring sensitivity to a parameter the model assumes constant is the quantified confession that Black-Scholes knows itself wrong.',
    moduleId: M8,
  },
  {
    terme: 'rho',
    en: 'rho',
    definition:
      'La sensibilité au taux sans risque : positive pour le call — le strike actualisé pèse moins quand les taux montent —, négative pour le put. De second ordre sur les horizons courts du module, surveillée sur les options longues, citée à l\'oral en une phrase.',
    definitionEn:
      'The sensitivity to the risk-free rate: positive for the call — the discounted strike weighs less when rates rise —, negative for the put. Second-order on the module\'s short horizons, watched on long-dated options, cited at the oral in one sentence.',
    moduleId: M8,
  },
  {
    terme: 'delta-hedging',
    en: 'delta hedging',
    definition:
      'Neutraliser la direction d\'un book d\'options en détenant |delta| × contrats × quotité actions (637 pour 10 calls canoniques vendus). La neutralité ne dure pas : le delta bouge avec le marché — c\'est le gamma qui décide de la fréquence — et le vendeur court après le marché, chaque aller-retour se payant. Acheter une option et la delta-hedger, ce n\'est pas parier sur la hausse : c\'est acheter de la volatilité.',
    definitionEn:
      'Neutralising an option book\'s direction by holding |delta| × contracts × contract-size shares (637 for 10 canonical calls sold). Neutrality does not last: the delta moves with the market — gamma dictates the rebalancing frequency — and the seller chases the market, each round trip costing money. Buying an option and delta-hedging it is not betting on a rise: it is buying volatility.',
    moduleId: M8,
  },
  {
    terme: 'volatilité réalisée (historique)',
    en: 'realized (historical) volatility',
    definition:
      'L\'écart-type des rendements constatés, annualisé en √252 : 1,2 % par jour ≈ 19 % par an (règle de tête : √252 ≈ 16). Objective — des prix, une formule, aucune opinion — mais elle regarde en arrière : l\'option paie sur l\'agitation des 252 prochains jours. Brancher l\'historique dans Black-Scholes, c\'est conduire en fixant le rétroviseur.',
    definitionEn:
      'The standard deviation of observed returns, annualised by √252: 1.2% per day ≈ 19% per year (rule of thumb: √252 ≈ 16). Objective — prices, a formula, no opinion — but it looks backward: the option pays on the agitation of the next 252 days. Plugging historical vol into Black-Scholes is driving while staring into the rear-view mirror.',
    moduleId: M8,
  },
  {
    terme: 'volatilité implicite',
    en: 'implied volatility',
    definition:
      'L\'unique σ qui, entré dans Black-Scholes, redonne exactement la prime cotée — unique car le prix croît strictement avec σ (vega > 0). Le retournement fondateur : le prix s\'observe, la vol s\'en extrait. Les desks cotent en vol comme les obligations se cotent en rendement (« je paie le 100 à 20 ») — et l\'implicite dépasse en moyenne la réalisée ultérieure : la prime de risque de volatilité, le surcoût de l\'assurance.',
    definitionEn:
      'The unique σ that, fed into Black-Scholes, returns exactly the quoted premium — unique because the price is strictly increasing in σ (vega > 0). The founding inversion: the price is observed, the vol is extracted from it. Desks quote in vol the way bonds are quoted in yield ("I pay the 100 strike at 20") — and implied exceeds subsequently realised on average: the volatility risk premium, the mark-up of insurance.',
    moduleId: M8,
  },
  {
    terme: 'smile / skew',
    en: 'smile / skew',
    definition:
      'Tracée strike par strike, la vol implicite n\'est pas plate : sur les actions, les puts hors de la monnaie cotent durablement plus cher en vol que l\'ATM — une pente (skew) ou un sourire asymétrique (smile), gravés dans les prix depuis le 19 octobre 1987 (Dow −22,6 %). Deux lectures : la crash-o-phobie — le marché facture la queue gauche que la lognormale ignore — et l\'effet de levier. Le smile ne réfute pas Black-Scholes : il le rétrograde de description du monde à langue de cotation.',
    definitionEn:
      'Plotted strike by strike, implied vol is not flat: on equities, out-of-the-money puts durably trade richer in vol than the ATM — a slope (skew) or an asymmetric smile, etched into prices since 19 October 1987 (Dow −22.6%). Two readings: crash-o-phobia — the market charges for the left tail the lognormal ignores — and the leverage effect. The smile does not refute Black-Scholes: it demotes it from description of the world to quoting language.',
    moduleId: M8,
  },
  {
    terme: 'surface de volatilité',
    en: 'volatility surface',
    definition:
      'Une vol implicite pour chaque couple (strike, maturité) : le vrai objet du desk d\'options. La coupe à strike fixé est la structure par terme — croissante en temps calme, l\'incertitude longue se payant plus cher, inversée en crise quand la panique propulse les vols courtes au-dessus des longues. Le desk ne gère pas un prix : il gère cette nappe entière, qui ondule en continu.',
    definitionEn:
      'One implied vol for each (strike, maturity) pair: the true object an options desk contemplates. The cut at a fixed strike is the term structure — upward-sloping in calm times, long uncertainty costing more, inverted in a crisis when panic pushes short vols above long ones. The desk does not manage a price: it manages this whole sheet, rippling continuously.',
    moduleId: M8,
  },
  {
    terme: 'VIX',
    en: 'VIX',
    definition:
      'Le thermomètre mondial de la vol implicite, calculé par le CBOE : intuitivement, la vol implicite à environ 30 jours des options sur le S&P 500, agrégée sur tout un panier de strikes — la recette du variance swap. « L\'indice de la peur » : il monte quand les marchés chutent. Repères : 12 marché endormi, 20 moyenne de long terme, 40 crise ouverte, 80 les sommets de 2008 et mars 2020. Il se traite lui-même — à la fois indicateur et actif.',
    definitionEn:
      'The world thermometer of implied vol, computed by the CBOE: intuitively, the ~30-day implied vol of S&P 500 options, aggregated over a whole basket of strikes — the variance-swap recipe. "The fear index": it rises when markets fall. Landmarks: 12 sleepy market, 20 long-run average, 40 open crisis, 80 the peaks of 2008 and March 2020. It is itself traded — both an indicator and an asset.',
    moduleId: M8,
  },
  {
    terme: 'vente de volatilité (short vol)',
    en: 'short volatility',
    definition:
      'Encaisser la prime de risque de volatilité — vendre l\'assurance que l\'implicite surpaie en moyenne. Signature de P&L : une longue série de petits gains réguliers, puis une perte rare et massive — « ramasser des pièces devant un rouleau compresseur ». Cas d\'école : le tracker XIV, gagnant pendant des années, perd 96 % le 5 février 2018 quand le VIX bondit de 115 % en une séance, et est liquidé.',
    definitionEn:
      'Harvesting the volatility risk premium — selling the insurance that implied vol overprices on average. P&L signature: a long streak of small regular gains, then a rare, massive loss — "picking up pennies in front of a steamroller". Textbook case: the XIV tracker, profitable for years, loses 96% on 5 February 2018 when the VIX jumps 115% in one session, and is liquidated.',
    moduleId: M8,
  },
  {
    terme: 'market maker d\'options',
    en: 'options market maker',
    definition:
      'Le teneur de marché qui cote en permanence achat et vente sur les options — et qui ne spécule pas sur la direction : chaque option vendue est aussitôt delta-hedgée par un achat ou une vente d\'actions, réajusté au rythme que le gamma impose. Sa couverture est le flux des autres : c\'est elle qui devient le carburant du gamma squeeze quand les calls vendus se rapprochent de la monnaie.',
    definitionEn:
      'The market maker continuously quoting bids and offers on options — and not betting on direction: every option sold is immediately delta-hedged with a stock purchase or sale, readjusted at the pace gamma dictates. His hedge is everyone else\'s flow: it is what fuels the gamma squeeze when the calls he sold drift toward the money.',
    moduleId: M8,
  },
  {
    terme: 'gamma squeeze',
    en: 'gamma squeeze',
    definition:
      'La boucle réflexive où la couverture des vendeurs d\'options pilote le sous-jacent : achats massifs de calls courts hors de la monnaie → les market makers vendeurs achètent l\'action en delta-hedge → le titre monte → les calls se rapprochent de la monnaie, zone où le gamma est maximal près de l\'échéance → leur delta bondit → nouveaux achats forcés. GameStop, janvier 2021 : le marché dérivé cesse de refléter le sous-jacent pour le fabriquer.',
    definitionEn:
      'The reflexive loop where option sellers\' hedging drives the underlying: massive buying of short-dated out-of-the-money calls → the market makers who sold them buy the stock as a delta hedge → the stock rises → the calls drift toward the money, where gamma peaks near expiry → their delta jumps → further forced buying. GameStop, January 2021: the derivatives market stops reflecting the underlying and starts manufacturing it.',
    moduleId: M8,
  },
];
