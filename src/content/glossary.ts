import type { GlossaireEntree } from '../engine/types';

const M4 = '04-taux-obligations';
const M2 = '02-methodes-quantitatives';
const M1 = '01-panorama-marches';
const M3 = '03-actions-indices';
const M6 = '06-change-commos-crypto';
const M7 = '07-derives-fermes';
const M8 = '08-options-volatilite';
const M9 = '09-produits-structures';
const M10 = '10-macro-banques-centrales';
const M11 = '11-histoire-crises';

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
  {
    terme: 'produit structuré',
    en: 'structured product',
    definition:
      'Titre de DETTE émis par une banque, dont le remboursement à l\'échéance suit une formule écrite d\'avance sur un ou plusieurs sous-jacents — « 100 % du capital plus 50 % de la hausse du CAC 40 ». Sous le capot, deux familles de briques : du taux (un zéro-coupon pour la partie ferme) et de l\'optionnel (des options pour tous les « si »). Acheter un structuré, c\'est prêter 100 à la banque : la formule ne vaut que sa signature.',
    definitionEn:
      'A DEBT security issued by a bank, whose redemption at maturity follows a formula written in advance on one or more underlyings — "100% of capital plus 50% of the CAC 40\'s upside". Under the hood, two families of bricks: rates (a zero-coupon for the firm part) and optionality (options for all the "ifs"). Buying a structured product is lending the bank 100: the formula is only worth its signature.',
    moduleId: M9,
  },
  {
    terme: 'structureur',
    en: 'structurer',
    definition:
      'La banque qui conçoit la formule, assemble les briques (zéro-coupon plus options), émet le titre et couvre le risque de marché. Sa rémunération est la marge de structuration, verrouillée le jour 1 : correctement couvert, l\'émetteur est indifférent au scénario de marché — il ne parie pas contre le client, il fabrique. Le vrai conflit d\'intérêts est ailleurs : la marge suit les volumes, l\'incitation est de vendre des formules attrayantes en vitrine.',
    definitionEn:
      'The bank that designs the formula, assembles the bricks (zero-coupon plus options), issues the security and hedges the market risk. Its pay is the structuring margin, locked in on day 1: properly hedged, the issuer is indifferent to the market scenario — it does not bet against the client, it manufactures. The real conflict of interest lies elsewhere: the margin follows volumes, the incentive is to sell formulas that look good in the shop window.',
    moduleId: M9,
  },
  {
    terme: 'distributeur',
    en: 'distributor',
    definition:
      'Le maillon qui place le produit auprès du client final — banque privée, conseiller, assureur-vie, courtier en ligne. Il touche une rétrocession logée dans le prix d\'émission, souvent la plus grosse part de la marge totale : sur 100 versés par le client, seuls 97 à 99 « travaillent » réellement pour lui.',
    definitionEn:
      'The link that places the product with the end client — private bank, adviser, life insurer, online broker. It receives a retrocession embedded in the issue price, often the biggest share of the total margin: of the client\'s 100, only 97 to 99 actually "work" for him.',
    moduleId: M9,
  },
  {
    terme: 'rétrocession',
    en: 'retrocession',
    definition:
      'La part de la marge d\'émission reversée au distributeur pour placer le produit. Invisible sur le relevé — elle est à l\'intérieur du prix, pas sur une ligne de frais —, encadrée par MiFID II (transparence, gouvernance produit) et publiée dans les coûts du KID. Chaque euro de rétrocession est un euro de budget d\'options en moins pour la formule.',
    definitionEn:
      'The share of the issuance margin passed on to the distributor for placing the product. Invisible on the statement — it sits inside the price, not on a fee line —, framed by MiFID II (transparency, product governance) and published in the KID\'s costs. Every euro of retrocession is one euro less of options budget for the formula.',
    moduleId: M9,
  },
  {
    terme: 'zéro-coupon de funding',
    en: 'funding zero-coupon',
    definition:
      'La brique qui garantit le capital : 100·e^{−rT} placés aujourd\'hui redonnent 100 à l\'échéance (86,07 à r = 3 %, 5 ans). La banque ne l\'achète pas, elle l\'EST : le client lui prête 100, c\'est du funding — et plus sa signature est fragile, plus son funding est cher, plus le zéro-coupon interne est bon marché, plus il reste d\'argent pour la formule. Paradoxe à retenir : à formule égale, le produit le plus généreux est souvent celui de l\'émetteur le moins sûr.',
    definitionEn:
      'The brick that guarantees the capital: 100·e^{−rT} invested today returns 100 at maturity (86.07 at r = 3%, 5 years). The bank does not buy it, it IS it: the client lends it 100, that is funding — and the weaker its signature, the dearer its funding, the cheaper the internal zero-coupon, the more money is left for the formula. Paradox to remember: for the same formula, the most generous product is often the one from the least safe issuer.',
    moduleId: M9,
  },
  {
    terme: 'budget d\'options',
    en: 'options budget',
    definition:
      'Ce qui reste du nominal une fois la garantie financée et la marge servie : 100 − ZC − marge = 12,93 à r = 3 %, 5 ans, marge 1. La matière première du structureur et une fonction croissante des taux : taux hauts, formules généreuses ; taux nuls, budget squelettique — l\'explication d\'une décennie de disparition des capitals garantis, et de leur retour en 2022-2023.',
    definitionEn:
      'What remains of the notional once the guarantee is funded and the margin served: 100 − ZC − margin = 12.93 at r = 3%, 5 years, margin 1. The structurer\'s raw material and an increasing function of rates: high rates, generous formulas; zero rates, skeletal budget — the explanation for a decade-long disappearance of capital-guaranteed products, and their return in 2022-2023.',
    moduleId: M9,
  },
  {
    terme: 'participation',
    en: 'participation rate',
    definition:
      'La fraction de la hausse du sous-jacent versée au client d\'un capital garanti : p = budget / prix du call ATM = 12,93/24,33 = 53,1 % sur l\'exemple du cours. Pas un choix commercial, le résultat d\'une division — et un thermomètre : des taux longs (72,5 % à r = 5 %) et de la volatilité implicite, que le client de capital garanti achète au prix fort quand elle est chère.',
    definitionEn:
      'The fraction of the underlying\'s upside paid to the client of a capital-guaranteed product: p = budget / ATM call price = 12.93/24.33 = 53.1% in the course example. Not a commercial choice, the result of a division — and a thermometer: of long rates (72.5% at r = 5%) and of implied volatility, which the capital-guaranteed client buys at full price when it is dear.',
    moduleId: M9,
  },
  {
    terme: 'capital garanti',
    en: 'capital-guaranteed product',
    definition:
      'Zéro-coupon plus achat de calls : le nominal remboursé à l\'échéance, plus une participation à la hausse. Deux astérisques obligatoires : la garantie ne vit qu\'À MATURITÉ (en cours de vie, le produit cote la somme de ses briques et baisse si les taux montent) et ne vaut que la SIGNATURE de l\'émetteur — les porteurs de notes Lehman « 100 % protégées » l\'ont appris en une nuit. Le pire scénario est un coût d\'opportunité, pas une perte de capital.',
    definitionEn:
      'Zero-coupon plus bought calls: the notional repaid at maturity, plus a participation in the upside. Two mandatory asterisks: the guarantee only lives AT MATURITY (during its life, the product trades at the sum of its bricks and falls when rates rise) and is only worth the issuer\'s SIGNATURE — holders of Lehman "100% protected" notes learned it overnight. The worst case is an opportunity cost, not a capital loss.',
    moduleId: M9,
  },
  {
    terme: 'cap (plafond)',
    en: 'cap',
    definition:
      'La rustine du structureur pour afficher une participation flatteuse : remplacer le call ATM par un call spread — acheter le call 100, revendre le call 130. Le spread coûte 10,95 au lieu de 24,33, et le budget de 12,93 paie « 118 % de la hausse »... plafonnée à +30 %. Grammaire du module 8 : toute jambe vendue réduit le coût et abandonne un morceau du profil.',
    definitionEn:
      'The structurer\'s patch for displaying a flattering participation: replace the ATM call with a call spread — buy the 100 call, sell the 130 call. The spread costs 10.95 instead of 24.33, and the 12.93 budget pays "118% of the upside"... capped at +30%. Module 8\'s grammar: every sold leg cuts the cost and gives up a piece of the profile.',
    moduleId: M9,
  },
  {
    terme: 'moyenne asiatique (averaging)',
    en: 'Asian averaging',
    definition:
      'Remplacer le niveau final S_T par la moyenne des relevés (mensuels ou annuels) de la dernière période. Une moyenne fluctue moins qu\'un point d\'arrivée : le call « asiatique » est moins cher, et la participation affichée grimpe. Le prix caché : dans un marché qui monte régulièrement, la moyenne des relevés reste EN DESSOUS du niveau final — un pourcentage plus élevé d\'une performance plus petite.',
    definitionEn:
      'Replacing the final level S_T with the average of (monthly or yearly) readings over the last period. An average fluctuates less than an end point: the "Asian" call is cheaper, and the displayed participation climbs. The hidden price: in a steadily rising market, the average of the readings stays BELOW the final level — a higher percentage of a smaller performance.',
    moduleId: M9,
  },
  {
    terme: 'garantie partielle',
    en: 'partial protection',
    definition:
      'Garantir 90 au lieu de 100 : le zéro-coupon ne coûte plus que 77,46 (contre 86,07), le budget passe à 21,54 et la participation à 88,5 %. Dix points de garantie abandonnés achètent trente-cinq points de participation — arbitrage souvent raisonnable, à condition que le client ait vu qu\'il n\'est plus « garanti » mais « protégé à 90 % » : la différence entre les deux mots vaut des points à l\'oral, et valait des milliards dans les prétoires (Bénéfic, Doubl\'ô).',
    definitionEn:
      'Guaranteeing 90 instead of 100: the zero-coupon now only costs 77.46 (versus 86.07), the budget rises to 21.54 and the participation to 88.5%. Ten points of guarantee given up buy thirty-five points of participation — an often reasonable trade-off, provided the client saw he is no longer "guaranteed" but "protected at 90%": the difference between the two words earns points at the oral, and was worth billions in courtrooms (Bénéfic, Doubl\'ô).',
    moduleId: M9,
  },
  {
    terme: 'reverse convertible',
    en: 'reverse convertible',
    definition:
      'Note courte à gros coupon « versé dans tous les cas » : le client prête 100 (zéro-coupon) et VEND un put sans le savoir — coupon = (100 − ZC + prime)/(e^{−rT}·T) = 10,99 % sur le canonique, dont 5,13 de taux sans risque capitalisé et 5,86 de prime de put. « Convertible à l\'envers » : dans une convertible classique, l\'investisseur choisit de convertir quand ça l\'arrange ; ici la conversion en titres se produit précisément quand ça l\'arrange le moins.',
    definitionEn:
      'A short-dated note with a big coupon "paid in all cases": the client lends 100 (zero-coupon) and SELLS a put without knowing it — coupon = (100 − ZC + premium)/(e^{−rT}·T) = 10.99% on the canonical example, of which 5.13 is compounded risk-free rate and 5.86 is put premium. "Convertible in reverse": in a classic convertible, the investor chooses to convert when it suits him; here the conversion into shares happens precisely when it suits him least.',
    moduleId: M9,
  },
  {
    terme: 'remise en titres',
    en: 'physical settlement',
    definition:
      'Le règlement du reverse convertible sous le strike : le client reçoit 100/K actions par 100 de nominal — il « achète » à 100 un titre qui vaut S_T, exactement le payoff du vendeur de put. Économiquement identique au règlement en cash (100 − (K − S_T)), psychologiquement très différent : recevoir des titres entretient l\'illusion qu\'« il suffit d\'attendre que ça remonte ».',
    definitionEn:
      'The reverse convertible\'s settlement below the strike: the client receives 100/K shares per 100 of notional — he "buys" at 100 a share worth S_T, exactly the put seller\'s payoff. Economically identical to cash settlement (100 − (K − S_T)), psychologically very different: receiving shares feeds the illusion that "you just have to wait for it to come back".',
    moduleId: M9,
  },
  {
    terme: 'option à barrière',
    en: 'barrier option',
    definition:
      'Option dont l\'existence dépend du franchissement d\'un niveau : activante (knock-in, elle naît si la barrière est touchée) ou désactivante (knock-out, elle meurt). À strike et barrière identiques, in + out = vanille : chaque trajectoire active exactement l\'une des deux — une parité d\'arbitrage de plus. Et une barrière n\'est jamais un simple niveau : c\'est un niveau PLUS une fréquence d\'observation, écrite en petites lettres dans la term sheet.',
    definitionEn:
      'An option whose existence depends on a level being crossed: knock-in (it is born if the barrier is touched) or knock-out (it dies). With identical strike and barrier, in + out = vanilla: each path activates exactly one of the two — one more arbitrage parity. And a barrier is never just a level: it is a level PLUS an observation frequency, written in small print in the term sheet.',
    moduleId: M9,
  },
  {
    terme: 'down-and-in put',
    en: 'down-and-in put',
    definition:
      'Le put qui doit naître : payoff max(K − S_T, 0) SEULEMENT si le minimum de la trajectoire a touché la barrière B — toujours inférieur ou égal au put vanille (0,24 à barrière 60 contre 5,57 pour la vanille canonique), et exactement égal quand B ≥ K. C\'est LUI que vend implicitement l\'acheteur d\'autocall ou de reverse convertible à barrière : l\'assurance catastrophe — sinistre rare, sinistre énorme — dont la prime finance le coupon.',
    definitionEn:
      'The put that must be born: payoff max(K − S_T, 0) ONLY if the path\'s minimum has touched the barrier B — always less than or equal to the vanilla put (0.24 at barrier 60 versus 5.57 for the canonical vanilla), and exactly equal when B ≥ K. It is the option the buyer of an autocall or barrier reverse convertible implicitly sells: catastrophe insurance — rare claim, enormous claim — whose premium funds the coupon.',
    moduleId: M9,
  },
  {
    terme: 'knock-in',
    en: 'knock-in',
    definition:
      'L\'activation d\'une option à barrière : l\'instant où le sous-jacent touche le niveau qui fait naître l\'option. Une barrière touchée puis quittée compte : l\'option est née, elle ne se rendort pas. Sur un autocall, le knock-in transforme un « placement à coupon » en perte actions sèche — les cascades de knock-ins des ELS coréens sur le HSCEI en 2015-2016 en ont fait la démonstration à l\'échelle d\'un pays.',
    definitionEn:
      'The activation of a barrier option: the instant the underlying touches the level that brings the option to life. A barrier touched then left behind still counts: the option is born, it does not go back to sleep. On an autocall, the knock-in turns a "coupon investment" into an outright equity loss — the knock-in cascades of Korean ELS on the HSCEI in 2015-2016 demonstrated it on a national scale.',
    moduleId: M9,
  },
  {
    terme: 'observation de barrière (continue/discrète)',
    en: 'barrier monitoring (continuous/discrete)',
    definition:
      'La fréquence à laquelle la barrière est testée : à l\'échéance seule (barrière « européenne »), en clôture quotidienne, ou en continu. Chaque date ajoutée est une occasion de plus de surprendre le sous-jacent sous la barrière : le DIP barrière 60 du cours vaut 0,136 observé à l\'échéance, 0,236 en quotidien (+73 %), davantage en continu. Réflexe de term sheet : à coupon égal, une barrière continue fait vendre au client un put plus cher — donc porte plus de risque.',
    definitionEn:
      'The frequency at which the barrier is tested: at maturity only ("European" barrier), at daily closes, or continuously. Each added date is one more chance to catch the underlying below the barrier: the course\'s barrier-60 DIP is worth 0.136 observed at maturity, 0.236 daily (+73%), more still continuously. Term-sheet reflex: for the same coupon, a continuous barrier makes the client sell a dearer put — hence carry more risk.',
    moduleId: M9,
  },
  {
    terme: 'effet falaise',
    en: 'cliff effect',
    definition:
      'La discontinuité du payoff à barrière : à 60,01 le client touche 100, à 59,99 il touche 59,99 — deux euros de spot, quarante points de nominal. À l\'approche conjointe de la barrière et de l\'échéance, delta et gamma explosent : couvrir exige de traiter des quantités énormes de sous-jacent précisément là où le marché est nerveux — le cauchemar du delta-hedging du module 8 porté à l\'incandescence.',
    definitionEn:
      'The discontinuity of the barrier payoff: at 60.01 the client gets 100, at 59.99 he gets 59.99 — two euros of spot, forty points of notional. As barrier and expiry approach together, delta and gamma explode: hedging requires trading enormous quantities of underlying precisely where the market is jittery — module 8\'s delta-hedging nightmare turned incandescent.',
    moduleId: M9,
  },
  {
    terme: 'barrier shift (barrière décalée)',
    en: 'barrier shift',
    definition:
      'La protection du desk contre la falaise : pricer et couvrir avec une barrière décalée de quelques pourcents par rapport à la barrière contractuelle, pour ne pas se faire hacher par des grecques explosives au niveau exact. Cousin des corrections analytiques (Broadie-Glasserman-Kou) qui compensent le biais du suivi discret d\'une barrière contractuellement continue — un Monte-Carlo à pas discrets sous-estime le vrai minimum, donc le prix du DIP.',
    definitionEn:
      'The desk\'s protection against the cliff: pricing and hedging with a barrier shifted a few percent from the contractual one, so as not to be shredded by explosive Greeks at the exact level. A cousin of the analytical corrections (Broadie-Glasserman-Kou) that offset the bias of discretely monitoring a contractually continuous barrier — a discrete-step Monte Carlo underestimates the true minimum, hence the DIP\'s price.',
    moduleId: M9,
  },
  {
    terme: 'autocall',
    en: 'autocallable',
    definition:
      'LE best-seller mondial de la structuration : coupons conditionnels à effet mémoire, rappel automatique dès que le sous-jacent repasse son niveau initial à une date d\'observation, barrière de protection observée à maturité. Décomposition : zéro-coupon + digitales + put down-and-in VENDU par le client. Le coupon n\'est pas choisi, il est RÉSOLU pour que prix + marge = 100 : une cote de marché déguisée en promesse commerciale — quand il monte, c\'est le risque vendu qui vaut plus cher.',
    definitionEn:
      'THE global best-seller of structuring: conditional coupons with a memory effect, automatic redemption as soon as the underlying is back at its initial level on an observation date, protection barrier observed at maturity. Decomposition: zero-coupon + digitals + a down-and-in put SOLD by the client. The coupon is not chosen, it is SOLVED so that price + margin = 100: a market quote disguised as a commercial promise — when it rises, it is the risk being sold that has become dearer.',
    moduleId: M9,
  },
  {
    terme: 'Athena',
    en: 'Athena',
    definition:
      'La variante de référence de l\'autocall (le marketing structuré aime les déesses grecques) : pas de coupon sans rappel, mais un effet mémoire qui rattrape tout l\'arriéré au rappel — 100 + 7 × 3 = 121 pour un rappel à la troisième observation après deux années blanches. Jamais rappelé : 100 au-dessus de la barrière de protection (sans coupon), remboursement dégradé S_N/S_0 × 100 en dessous.',
    definitionEn:
      'The reference variant of the autocall (structured marketing loves Greek goddesses): no coupon without a call, but a memory effect that catches up all the arrears at the call — 100 + 7 × 3 = 121 for a call at the third observation after two blank years. Never called: 100 above the protection barrier (no coupon), degraded redemption S_N/S_0 × 100 below it.',
    moduleId: M9,
  },
  {
    terme: 'date d\'observation',
    en: 'observation date',
    definition:
      'Les seuls jours où il se passe quelque chose dans la vie d\'un autocall — typiquement une par an sur 5 à 10 ans : on y teste la barrière de rappel, et à la dernière la barrière de protection. Entre deux observations, le produit dort : passer sous la barrière de rappel en cours de vie n\'annule rien, et un plongeon rattrapé avant la date suivante ne laisse aucune trace (observation discrète).',
    definitionEn:
      'The only days when anything happens in an autocall\'s life — typically one per year over 5 to 10 years: the call barrier is tested there, and the protection barrier at the last one. Between two observations the product sleeps: dipping below the call barrier mid-life cancels nothing, and a plunge recovered before the next date leaves no trace (discrete observation).',
    moduleId: M9,
  },
  {
    terme: 'barrière de rappel',
    en: 'autocall trigger',
    definition:
      'Le seuil — typiquement 100 % du niveau initial — qui déclenche le remboursement anticipé automatique à une date d\'observation : S_i ≥ barrière ⇒ flux unique 100 + coupon × i, et le produit disparaît. Sur les 200 000 trajectoires risque-neutres du cours : 52 % de rappels dès la première observation, 22 % de produits allant à maturité, vie moyenne 2,4 ans pour un produit affiché « 5 ans ».',
    definitionEn:
      'The threshold — typically 100% of the initial level — that triggers automatic early redemption on an observation date: S_i ≥ barrier ⇒ single cash flow 100 + coupon × i, and the product disappears. On the course\'s 200,000 risk-neutral paths: 52% called at the first observation, 22% of products reaching maturity, average life 2.4 years for a product labelled "5 years".',
    moduleId: M9,
  },
  {
    terme: 'coupon mémoire',
    en: 'memory coupon',
    definition:
      'La clause qui rattrape les années blanches : pas de rappel, pas de coupon — mais au rappel à la date i, le client touche le coupon de l\'année ET tous ceux des années passées, 100 + c × i (121 pour un rappel à l\'an 3 avec c = 7). L\'effet mémoire ne rend pas le produit plus généreux : le coupon annualisé du meilleur scénario reste c par an quelle que soit la date de sortie — il ne fait que rattraper.',
    definitionEn:
      'The clause that catches up the blank years: no call, no coupon — but at the call on date i, the client receives the current year\'s coupon AND all the past ones, 100 + c × i (121 for a call in year 3 with c = 7). The memory effect does not make the product more generous: the best-scenario annualised coupon stays c per year whatever the exit date — it only catches up.',
    moduleId: M9,
  },
  {
    terme: 'barrière de protection',
    en: 'protection barrier',
    definition:
      'Le seuil — typiquement 60 % du niveau initial — observé À MATURITÉ SEULEMENT si le produit n\'a jamais été rappelé : au-dessus, capital remboursé (100, sans coupon) ; en dessous, remboursement dégradé S_N/S_0 × 100, la perte entière depuis l\'origine. Pas un amortisseur, une falaise : à 60,01 le client touche 100, à 59,99 il touche 59,99 — et conditionnellement au franchissement, la perte moyenne avoisine 40 % du nominal.',
    definitionEn:
      'The threshold — typically 60% of the initial level — observed AT MATURITY ONLY if the product was never called: above it, capital repaid (100, no coupon); below it, degraded redemption S_N/S_0 × 100, the full loss from inception. Not a shock absorber, a cliff: at 60.01 the client gets 100, at 59.99 he gets 59.99 — and conditional on the breach, the average loss is around 40% of notional.',
    moduleId: M9,
  },
  {
    terme: 'duration incertaine',
    en: 'uncertain duration',
    definition:
      'La durée de vie d\'un autocall n\'est connue de personne, pas même de la banque : courte si le marché monte (rappelé, le client doit se replacer plus haut — la machine à re-souscription), longue s\'il baisse (collé sans coupon). Ni durée probable (vie moyenne 2,4 ans, plus d\'un sur deux meurt à un an), ni durée garantie (22 % vont au bout) : « un placement à 5 ans » décrit la queue de la distribution, pas son centre.',
    definitionEn:
      'Nobody knows an autocall\'s lifespan, not even the bank: short if the market rises (called, the client must reinvest higher — the re-subscription machine), long if it falls (stuck without coupons). Neither a probable duration (average life 2.4 years, more than one in two dies at one year) nor a guaranteed one (22% go the distance): "a 5-year investment" describes the tail of the distribution, not its centre.',
    moduleId: M9,
  },
  {
    terme: 'worst-of',
    en: 'worst-of',
    definition:
      'Indexer le produit sur la PIRE performance d\'un panier de deux ou trois sous-jacents : pour que le worst-of monte, il faut que tous montent ; pour qu\'il déçoive, il suffit qu\'un seul trébuche. Le call worst-of coûte trois fois moins que la vanille à corrélation nulle (3,31 contre 10,43 sur les jumeaux du cours) et le DIP worst-of vendu par le client vaut le double du mono sous-jacent — c\'est de là que sortent les coupons à deux chiffres.',
    definitionEn:
      'Indexing the product on the WORST performance of a basket of two or three underlyings: for the worst-of to rise, all must rise; for it to disappoint, one stumble suffices. The worst-of call costs three times less than the vanilla at zero correlation (3.31 versus 10.43 on the course\'s twins) and the worst-of DIP sold by the client is worth double the single-underlying one — that is where double-digit coupons come from.',
    moduleId: M9,
  },
  {
    terme: 'dispersion',
    en: 'dispersion',
    definition:
      'L\'écart des trajectoires d\'un panier entre elles : plus les sous-jacents vivent chacun leur vie (corrélation basse), plus le minimum s\'enfonce — l\'espérance du minimum est toujours sous le minimum des espérances. Le supplément de coupon d\'un worst-of est la prime du risque de dispersion : la diversification profite à qui touche la moyenne du panier, jamais à qui n\'en touche que le pire.',
    definitionEn:
      'How far a basket\'s paths spread from one another: the more the underlyings live their own lives (low correlation), the deeper the minimum sinks — the expectation of the minimum is always below the minimum of the expectations. A worst-of\'s extra coupon is the dispersion risk premium: diversification benefits whoever receives the basket\'s average, never whoever receives only its worst.',
    moduleId: M9,
  },
  {
    terme: 'corrélation implicite',
    en: 'implied correlation',
    definition:
      'Le paramètre caché du pricing worst-of, que le client ne voit jamais : corrélation basse ⇒ vitrine embellie (call worst-of moins cher, DIP vendu plus cher). Le book de l\'émetteur, long des puts worst-of de ses clients, PERD quand la corrélation monte — or c\'est en crise qu\'elle bondit vers 1 : les desks d\'autocalls sont structurellement COURTS de corrélation et se couvrent en en achetant, devenus les grands acheteurs de corrélation du marché actions.',
    definitionEn:
      'The hidden parameter of worst-of pricing, which the client never sees: low correlation ⇒ prettier shop window (cheaper worst-of call, dearer DIP sold). The issuer\'s book, long the worst-of puts its clients sell it, LOSES when correlation rises — and it is in crises that it jumps toward 1: autocall desks are structurally SHORT correlation and hedge by buying it, having become the equity market\'s great correlation buyers.',
    moduleId: M9,
  },
  {
    terme: 'risque de dividendes',
    en: 'dividend risk',
    definition:
      'Le risque que le desk garde : le produit est écrit sur un indice de PRIX, mais la couverture — le forward, F = S·e^{(r−q)T} — encaisse les dividendes ; le desk est structurellement long dividendes sur des années, les banques françaises plus que toutes. Mars 2020 : les annulations européennes vaporisent environ la moitié des futures de dividendes 2020-2021 — de l\'ordre de 200 millions d\'euros de pertes par grande maison au premier trimestre.',
    definitionEn:
      'The risk the desk keeps: the product is written on a PRICE index, but the hedge — the forward, F = S·e^{(r−q)T} — collects the dividends; the desk is structurally long dividends over years, French banks more than any. March 2020: European cancellations vaporised about half the value of 2020-2021 dividend futures — on the order of 200 million euros of losses per major house in the first quarter.',
    moduleId: M9,
  },
  {
    terme: 'Monte-Carlo',
    en: 'Monte Carlo',
    definition:
      'La machine du desk quand la formule fermée meurt — payoff dépendant du chemin, de plusieurs sous-jacents, de dates multiples : simuler des milliers de trajectoires risque-neutres, calculer le payoff de chacune, moyenner, actualiser. Convergence par la loi des grands nombres, erreur en σ/√n. On ne lui fait confiance sur l\'incalculable que parce qu\'elle est juste sur le calculable : retrouver Black-Scholes sur la vanille est le rite de validation de tout pricer.',
    definitionEn:
      'The desk\'s machine when the closed formula dies — payoff depending on the path, on several underlyings, on multiple dates: simulate thousands of risk-neutral paths, compute each payoff, average, discount. Convergence by the law of large numbers, error in σ/√n. We only trust it on the incomputable because it is right on the computable: recovering Black-Scholes on the vanilla is every pricer\'s validation rite.',
    moduleId: M9,
  },
  {
    terme: 'trajectoire risque-neutre',
    en: 'risk-neutral path',
    definition:
      'Une trajectoire simulée sous le monde du pricing : pas lognormaux S·exp[(r − σ²/2)Δt + σ√Δt·z], drift au taux sans risque r — pas le rendement espéré réel, la prévision n\'entre nulle part — amputé de la correction de convexité σ²/2, pour que E[S_T] = S₀·e^{rT}, le forward (condition de martingale du module 8). Testé sur le moteur du cours : moyenne simulée à un an 105,13 = 100·e^{0,05}.',
    definitionEn:
      'A path simulated under the pricing world: lognormal steps S·exp[(r − σ²/2)Δt + σ√Δt·z], drift at the risk-free rate r — not the real expected return, no forecast enters anywhere — docked by the convexity correction σ²/2, so that E[S_T] = S₀·e^{rT}, the forward (module 8\'s martingale condition). Tested on the course\'s engine: one-year simulated mean 105.13 = 100·e^{0.05}.',
    moduleId: M9,
  },
  {
    terme: 'graine (seed)',
    en: 'seed',
    definition:
      'La valeur initiale du générateur pseudo-aléatoire : même graine, mêmes tirages, mêmes trajectoires, même prix — au bit près. Pas une tricherie, une exigence professionnelle : pricing auditable (recalculable des mois plus tard), comparaisons propres (mêmes aléas, la différence observée est l\'effet cherché, pas du bruit), tests possibles (le pricer du cours vérifie des valeurs exactes avec la graine 42). Le hasard de production est un hasard en conserve.',
    definitionEn:
      'The initial value of the pseudo-random generator: same seed, same draws, same paths, same price — to the bit. Not a cheat, a professional requirement: auditable pricing (recomputable months later), clean comparisons (same randomness, the observed difference is the effect sought, not noise), testable code (the course\'s pricer checks exact values with seed 42). Production randomness is canned randomness.',
    moduleId: M9,
  },
  {
    terme: 'grecques par bump',
    en: 'bump-and-reprice Greeks',
    definition:
      'La méthode universelle quand Monte-Carlo n\'a pas de N(d₁) à offrir : re-simuler avec un paramètre décalé et prendre la pente, Δ ≈ [V(S₀ + h) − V(S₀)]/h. Le piège le plus instructif du module : à graines indépendantes, la différence cumule les variances et le delta ressort entre 0,33 et 0,83 pour un vrai 0,64 — du bruit inutilisable pour couvrir. La règle du desk : on bumpe le paramètre, jamais le hasard.',
    definitionEn:
      'The universal method when Monte Carlo has no N(d₁) to offer: re-simulate with a shifted parameter and take the slope, Δ ≈ [V(S₀ + h) − V(S₀)]/h. The module\'s most instructive trap: with independent seeds, the difference compounds the variances and the delta comes out between 0.33 and 0.83 for a true 0.64 — noise, unusable for hedging. The desk rule: bump the parameter, never the randomness.',
    moduleId: M9,
  },
  {
    terme: 'common random numbers',
    en: 'common random numbers',
    definition:
      'Les variables aléatoires communes : rejouer les MÊMES aléas dans les deux mondes comparés (spot de base et spot bumpé). Chaque trajectoire bumpée est la jumelle de sa trajectoire de base : le bruit commun s\'annule dans la soustraction, il ne reste que l\'effet du bump — delta à 0,644 pour un vrai 0,637, là où des graines indépendantes rendaient du bruit pur. La deuxième raison, après l\'audit, de ne jamais comparer deux pricings sans figer les graines.',
    definitionEn:
      'Replaying the SAME randomness in the two worlds being compared (base spot and bumped spot). Each bumped path is the twin of its base path: the shared noise cancels in the subtraction, leaving only the bump\'s effect — a delta of 0.644 for a true 0.637, where independent seeds returned pure noise. The second reason, after auditability, never to compare two pricings without freezing the seeds.',
    moduleId: M9,
  },
  {
    terme: 'term sheet',
    en: 'term sheet',
    definition:
      'La fiche technique du produit : quelques pages juridiques que le desk lit dans un tout autre ordre que le client — l\'émetteur d\'abord (une dette senior non sécurisée), les sous-jacents (« la moins bonne performance de » = worst-of), les barrières ET leur fréquence d\'observation, la mécanique de rappel, la formule de remboursement, les frais. Les deux questions auxquelles la lecture répond : qu\'est-ce que le client vend sans le savoir, et combien la banque se paie au passage ?',
    definitionEn:
      'The product\'s technical sheet: a few legal pages the desk reads in a completely different order from the client — the issuer first (senior unsecured debt), the underlyings ("the worst performance of" = worst-of), the barriers AND their observation frequency, the call mechanics, the redemption formula, the fees. The two questions the reading answers: what is the client selling without knowing it, and how much does the bank pay itself along the way?',
    moduleId: M9,
  },
  {
    terme: 'valeur à l\'émission',
    en: 'issue value',
    definition:
      'Ce que vaut économiquement le produit le jour où le client le paie 100 : la somme de ses briques, typiquement 97 à 99 (97,5 sur l\'Athéna du cours). L\'écart est la marge totale, encaissée le jour 1 — c\'est pourquoi la valeur de revente des premières semaines « déçoit » : le client ne perd pas, il découvre la marge. Publiée depuis 2018 dans le KID imposé par le règlement PRIIPs.',
    definitionEn:
      'What the product is economically worth on the day the client pays 100 for it: the sum of its bricks, typically 97 to 99 (97.5 on the course\'s Athena). The gap is the total margin, pocketed on day 1 — which is why the resale value in the first weeks "disappoints": the client is not losing, he is discovering the margin. Published since 2018 in the KID mandated by the PRIIPs regulation.',
    moduleId: M9,
  },
  {
    terme: 'marge de structuration',
    en: 'structuring margin',
    definition:
      'La rémunération de l\'émetteur, prélevée une fois pour toutes DANS le prix d\'émission : 100 = ZC + options + marge, chaque euro de marge étant un euro de budget en moins. Ordres de grandeur : 0,5 à 1 % par an sur la durée faciale, rétrocessions du distributeur comprises — davantage sur la vie effective d\'un autocall rappelé en 2,2 ans. Verrouillée à l\'émission et indifférente au scénario de marché, comme la fourchette d\'un market maker.',
    definitionEn:
      'The issuer\'s pay, taken once and for all INSIDE the issue price: 100 = ZC + options + margin, each euro of margin being one euro less of budget. Orders of magnitude: 0.5 to 1% per year over the stated life, distributor retrocessions included — more over the effective life of an autocall called after 2.2 years. Locked in at issuance and indifferent to the market scenario, like a market maker\'s spread.',
    moduleId: M9,
  },
  {
    terme: 'PRIIPs / KID',
    en: 'PRIIPs / KID',
    definition:
      'Le règlement européen (2018) né des scandales de 2008 et son document d\'informations clés : quelques pages standardisées publiant l\'identité de l\'émetteur — et ce qui arrive s\'il fait défaut —, des scénarios de performance dont le défavorable, les coûts et la valeur à l\'émission (les 97,5 % de l\'Athéna du cours y figurent). Avec MiFID II (gouvernance produit, transparence des rétrocessions, adéquation au client), l\'encadrement complet de la vente.',
    definitionEn:
      'The European regulation (2018) born of the 2008 scandals and its key information document: a few standardised pages disclosing the issuer\'s identity — and what happens if it defaults —, performance scenarios including the unfavourable one, the costs and the issue value (the course Athena\'s 97.5% appears there). Together with MiFID II (product governance, retrocession transparency, client suitability), the full framing of the sale.',
    moduleId: M9,
  },
  {
    terme: 'risque émetteur',
    en: 'issuer risk',
    definition:
      'Le risque que la formule ne soit jamais payée : un structuré est une créance sur la banque émettrice, et « capital garanti » est une propriété de l\'ÉMETTEUR, pas du produit. Lehman, 15 septembre 2008 : formules intactes, émetteur disparu — des dizaines de milliers de porteurs remboursés à quelques dizaines de cents par dollar au fil d\'une décennie de procédures. À l\'oral, une décomposition qui oublie cette ligne est une décomposition fausse.',
    definitionEn:
      'The risk that the formula is never paid: a structured product is a claim on the issuing bank, and "capital guaranteed" is a property of the ISSUER, not of the product. Lehman, 15 September 2008: formulas intact, issuer gone — tens of thousands of holders repaid a few tens of cents on the dollar over a decade of proceedings. At the oral, a decomposition that forgets this line is a wrong decomposition.',
    moduleId: M9,
  },
  {
    terme: 'senior non sécurisée',
    en: 'senior unsecured',
    definition:
      'Le rang de la dette qu\'achète le porteur d\'un structuré : senior (servie avant les dettes subordonnées) mais sans aucun collatéral — en cas de faillite, une créance chirographaire dans la file de la liquidation. Le zéro-coupon qui « garantit » le capital est exactement cela : une obligation portant tout le risque de crédit du module 5, pas un coffre-fort.',
    definitionEn:
      'The rank of the debt a structured-product holder buys: senior (served before subordinated debt) but with no collateral at all — in a bankruptcy, an unsecured claim in the liquidation queue. The zero-coupon that "guarantees" the capital is exactly that: a bond carrying all of module 5\'s credit risk, not a safe-deposit box.',
    moduleId: M9,
  },
  {
    terme: 'minibonds',
    en: 'minibonds',
    definition:
      'Les notes adossées à Lehman vendues aux particuliers de Hong Kong et Singapour comme des quasi-obligations — plus de 40 000 porteurs à Hong Kong, de l\'ordre de 2 milliards de dollars. La faillite de 2008 en fit des créances sur un failli ; le régulateur de Hong Kong contraignit les banques distributrices à racheter les titres, et la plupart des porteurs récupérèrent l\'essentiel de leur mise — l\'exception qui souligne la règle du risque émetteur.',
    definitionEn:
      'The Lehman-backed notes sold to retail investors in Hong Kong and Singapore as quasi-bonds — over 40,000 holders in Hong Kong, on the order of 2 billion dollars. The 2008 bankruptcy turned them into claims on a bankrupt; Hong Kong\'s regulator forced the distributing banks to buy the notes back, and most holders recovered the bulk of their stake — the exception that underlines the issuer-risk rule.',
    moduleId: M9,
  },
  {
    terme: 'banque centrale',
    en: 'central bank',
    definition:
      'L\'institution qui détient le monopole de la monnaie de base — billets et réserves, les comptes des banques commerciales chez elle. Ce monopole lui donne trois pouvoirs : fixer le prix de cette monnaie au jour le jour (le taux directeur), en créer sans limite en crise (prêteur en dernier ressort), et ancrer la valeur future de la monnaie elle-même (la stabilité des prix). Dans sa propre devise, elle est le seul acteur qui n\'est jamais à court — c\'est ce qui rend ses promesses crédibles.',
    definitionEn:
      'The institution holding the monopoly on base money — banknotes and reserves, the accounts commercial banks hold with it. That monopoly gives it three powers: setting the overnight price of that money (the policy rate), creating it without limit in a crisis (lender of last resort), and anchoring the future value of money itself (price stability). In its own currency, it is the only player never short of funds — which is what makes its promises credible.',
    moduleId: M10,
  },
  {
    terme: 'prêteur en dernier ressort',
    en: 'lender of last resort',
    definition:
      'Le rôle des mauvais jours : quand la confiance s\'évapore et que toutes les banques veulent du cash en même temps, une seule institution peut en fournir à volonté. La doctrine tient dans la phrase de Bagehot (1873), récitée dans toutes les crises depuis : prêter LARGEMENT, à un taux DE PÉNALITÉ, contre du BON collatéral — sauver la liquidité du système sans subventionner l\'insolvabilité. À l\'œuvre de Lehman (2008) aux banques régionales américaines (2023).',
    definitionEn:
      'The bad-days role: when confidence evaporates and every bank wants cash at once, only one institution can supply it at will. The doctrine fits in Bagehot\'s sentence (1873), recited in every crisis since: lend FREELY, at a PENALTY rate, against GOOD collateral — save the system\'s liquidity without subsidising insolvency. At work from Lehman (2008) to the American regional banks (2023).',
    moduleId: M10,
  },
  {
    terme: 'mandat dual',
    en: 'dual mandate',
    definition:
      'La feuille de route de la Fed depuis 1977 : emploi maximum ET stabilité des prix (2 % sur l\'indice PCE, chiffré en 2012), sur un pied d\'égalité — elle arbitre en permanence entre ses deux jambes. Contraste avec le mandat HIÉRARCHIQUE de la BCE : la stabilité des prix d\'abord, le soutien à l\'économie « sans préjudice » du premier objectif. Conséquence de marché : le rapport sur l\'emploi américain est un événement au même titre que le CPI.',
    definitionEn:
      'The Fed\'s road map since 1977: maximum employment AND price stability (2% on the PCE index, quantified in 2012), on an equal footing — it permanently arbitrates between its two legs. Contrast with the ECB\'s HIERARCHICAL mandate: price stability first, support for the economy "without prejudice" to that objective. Market consequence: the US employment report is an event on a par with the CPI.',
    moduleId: M10,
  },
  {
    terme: 'stabilité des prix',
    en: 'price stability',
    definition:
      'Le cœur du mandat moderne — et un faux ami : à la cible de 2 %, les prix ne sont PAS stables, ils doublent tous les 35 ans environ (composition discrète annuelle). La promesse est une érosion lente, faible et surtout PRÉVISIBLE : assez douce pour être ignorée dans les décisions quotidiennes, assez positive pour tenir la déflation à distance. « Stabilité » signifie : une inflation qui ne fait plus partie de la conversation.',
    definitionEn:
      'The heart of the modern mandate — and a false friend: at the 2% target, prices are NOT stable, they double roughly every 35 years (discrete annual compounding). The promise is a slow, mild and above all PREDICTABLE erosion: gentle enough to be ignored in daily decisions, positive enough to keep deflation at bay. "Stability" means: inflation that is no longer part of the conversation.',
    moduleId: M10,
  },
  {
    terme: 'cible d\'inflation de 2 %',
    en: '2% inflation target',
    definition:
      'Pas une prévision, une PROMESSE — un point d\'ancrage pour les anticipations : si chacun fixe prix, salaires et taux longs en supposant 2 %, la promesse s\'auto-réalise. Pourquoi 2 et pas 0 : une marge contre la déflation (partir de plus haut donne du room de baisse), un biais de mesure (Boskin 1996 : le CPI surestimait d\'environ 1,1 point par an), et les rigidités nominales (l\'inflation permet de baisser les salaires réels par simple gel). Symétrique à la BCE depuis la revue de 2021, contre l\'ancien « inférieure à, mais proche de, 2 % ».',
    definitionEn:
      'Not a forecast, a PROMISE — an anchor for expectations: if everyone sets prices, wages and long rates assuming 2%, the promise self-fulfils. Why 2 and not 0: a margin against deflation (starting higher leaves room to cut), a measurement bias (Boskin 1996: the CPI overstated by about 1.1 points a year), and nominal rigidities (inflation allows real wage cuts through a simple freeze). Symmetric at the ECB since the 2021 review, against the old "below, but close to, 2%".',
    moduleId: M10,
  },
  {
    terme: 'indépendance de la banque centrale',
    en: 'central bank independence',
    definition:
      'Un dispositif d\'engagement — la version institutionnelle d\'Ulysse s\'attachant au mât : le gouvernement a structurellement intérêt à l\'inflation surprise (activité avant élection, dette allégée), donc une promesse de 2 % n\'est crue que si le levier est hors de sa portée — mandat écrit, dirigeants à mandat long, révocation quasi impossible. La démonstration : Burns cède à Nixon en 1972 et l\'inflation s\'installe une décennie (13,5 % en 1980) ; Volcker fait l\'inverse et rebâtit la crédibilité pour quarante ans.',
    definitionEn:
      'A commitment device — the institutional version of Ulysses tying himself to the mast: governments structurally benefit from surprise inflation (activity before an election, lighter debt), so a 2% promise is only believed if the lever is out of their reach — a written mandate, long terms, near-impossible dismissal. The demonstration: Burns yields to Nixon in 1972 and inflation settles in for a decade (13.5% in 1980); Volcker does the opposite and rebuilds credibility for forty years.',
    moduleId: M10,
  },
  {
    terme: 'incohérence temporelle',
    en: 'time inconsistency',
    definition:
      'Le problème que l\'indépendance résout : la promesse optimale aujourd\'hui (2 %) est celle que le décideur aura intérêt à trahir demain — une inflation surprise dope l\'activité à court terme et allège la dette. Mais tout le monde le sait : si la main qui tient les taux est celle qui se présente aux élections, personne ne croit la promesse, les anticipations désancrent, et l\'inflation monte SANS même le bénéfice de la surprise. La solution : retirer le levier des mains de ceux qui seraient tentés.',
    definitionEn:
      'The problem independence solves: the optimal promise today (2%) is the one the decision-maker will benefit from betraying tomorrow — surprise inflation boosts short-term activity and lightens the debt. But everyone knows it: if the hand on the rates is the one running for election, nobody believes the promise, expectations de-anchor, and inflation rises WITHOUT even the benefit of the surprise. The solution: take the lever away from those who would be tempted.',
    moduleId: M10,
  },
  {
    terme: 'dominance budgétaire',
    en: 'fiscal dominance',
    definition:
      'L\'ennemi discret de l\'indépendance : quand la dette publique devient si lourde que toute hausse des taux menace la solvabilité de l\'État, la banque centrale perd sa liberté sans qu\'aucune loi ne change — elle ne monte pas les taux, et l\'inflation rogne la dette à la place du contribuable. Cas d\'école : la Fed plafonnant les taux longs à 2,5 % de 1942 à l\'Accord de 1951 ; la Turquie 2021-2023, baisses de taux imposées en pleine flambée, inflation au-delà de 85 %. Le QE ravive la question : une banque centrale qui détient un tiers de la dette de son État peut-elle encore l\'ignorer ?',
    definitionEn:
      'Independence\'s quiet enemy: when public debt becomes so heavy that any rate hike threatens the State\'s solvency, the central bank loses its freedom without a single law changing — it does not hike, and inflation gnaws the debt in the taxpayer\'s place. Textbook cases: the Fed capping long rates at 2.5% from 1942 to the 1951 Accord; Turkey 2021-2023, rate cuts imposed amid a price surge, inflation beyond 85%. QE revives the question: can a central bank holding a third of its government\'s debt still ignore it?',
    moduleId: M10,
  },
  {
    terme: 'taux directeur',
    en: 'policy rate',
    definition:
      'Le seul prix que fixe la banque centrale : celui de l\'argent AU JOUR LE JOUR, entre banques, sur son propre guichet — un taux que ni vous ni aucune entreprise n\'emprunterez jamais directement. Tout l\'art de la politique monétaire est de le faire voyager : du guichet au marché monétaire (mécanique, quelques points de base), du marché monétaire à la courbe (par les anticipations), de la courbe à l\'économie. Propagé, il devient le r de tous les pricers du cours.',
    definitionEn:
      'The only price the central bank sets: that of OVERNIGHT money, between banks, at its own window — a rate neither you nor any company will ever borrow at directly. The whole art of monetary policy is making it travel: from the window to the money market (mechanical, a few basis points), from the money market to the curve (through expectations), from the curve to the economy. Propagated, it becomes the r of every pricer in this course.',
    moduleId: M10,
  },
  {
    terme: 'corridor',
    en: 'corridor',
    definition:
      'Les trois taux directeurs de la BCE, qui encadrent le prix de l\'argent au jour le jour : le taux de DÉPÔT (ce que rapportent les liquidités laissées à la BCE — le plancher), le taux de REFINANCEMENT (les opérations hebdomadaires contre collatéral — le taux « officiel » historique), le taux de PRÊT MARGINAL (l\'emprunt d\'urgence — le plafond). Le taux interbancaire ne peut vivre qu\'à l\'intérieur. Automne 2023, sommet du cycle : 4,00 / 4,50 / 4,75 % ; écart refi−dépôt resserré à 15 pb en 2024.',
    definitionEn:
      'The ECB\'s three policy rates, which frame the overnight price of money: the DEPOSIT rate (what liquidity parked at the ECB earns — the floor), the REFINANCING rate (the weekly operations against collateral — the historical "official" rate), the MARGINAL LENDING rate (emergency borrowing — the ceiling). The interbank rate can only live inside. Autumn 2023, cycle peak: 4.00 / 4.50 / 4.75%; the refi−deposit gap narrowed to 15 bps in 2024.',
    moduleId: M10,
  },
  {
    terme: 'taux de dépôt',
    en: 'deposit facility rate',
    definition:
      'Le plancher du corridor — et, depuis les politiques d\'achats d\'actifs, LE taux directeur qui compte : en liquidité excédentaire, presque personne n\'emprunte au refi, tout le monde cherche à placer, et le taux de marché (€STR) colle au plancher, quelques points de base dessous. C\'est lui que la presse cite et que les marchés pricent. Réflexe d\'oral à « quel est le taux de la BCE ? » : « lequel ? — celui qui pilote le marché, c\'est le dépôt ».',
    definitionEn:
      'The corridor\'s floor — and, since the asset purchase programmes, THE policy rate that matters: with excess liquidity, almost nobody borrows at the refi, everybody looks to place, and the market rate (€STR) sticks to the floor, a few basis points below. It is the one the press quotes and the markets price. Oral reflex to "what is the ECB\'s rate?": "which one? — the one steering the market: the deposit rate".',
    moduleId: M10,
  },
  {
    terme: 'IORB',
    en: 'IORB (interest on reserve balances)',
    definition:
      'La rémunération que la Fed verse sur les réserves des banques — l\'équivalent américain du taux de dépôt européen, et le premier outil qui TIENT la fourchette cible des fed funds : pourquoi prêter à un confrère sous le taux que la Fed vous paie sans risque ? En régime de réserves abondantes, on ne pilote plus le taux en rationnant la monnaie : on fixe le prix auquel la banque centrale elle-même rémunère et prête.',
    definitionEn:
      'The interest the Fed pays on banks\' reserves — the American counterpart of the European deposit rate, and the first tool that HOLDS the fed funds target range: why lend to a peer below the rate the Fed pays you risk-free? In a regime of abundant reserves, you no longer steer the rate by rationing money: you set the price at which the central bank itself remunerates and lends.',
    moduleId: M10,
  },
  {
    terme: 'ON RRP',
    en: 'ON RRP (overnight reverse repo)',
    definition:
      'La rustine du floor system : les fonds monétaires, énormes prêteurs au jour le jour, n\'ont pas de compte de réserves et ne touchent pas l\'IORB — ils auraient pu prêter SOUS le plancher. Via l\'ON RRP, la Fed leur emprunte du cash au jour le jour contre ses Treasuries, à un taux administré qui étend le plancher au-delà des banques. Au pic de 2022-2023, la facilité absorbait plus de 2 000 milliards de dollars par nuit — le thermomètre du cash qui ne trouve pas d\'emploi.',
    definitionEn:
      'The floor system\'s patch: money market funds, huge overnight lenders, have no reserve account and do not earn IORB — they could have lent BELOW the floor. Through the ON RRP, the Fed borrows cash from them overnight against its Treasuries, at an administered rate that extends the floor beyond banks. At the 2022-2023 peak, the facility absorbed over 2,000 billion dollars a night — the thermometer of cash that cannot find a job.',
    moduleId: M10,
  },
  {
    terme: 'floor system',
    en: 'floor system',
    definition:
      'Le régime de pilotage né du QE : avec des milliers de milliards de réserves excédentaires, ajuster les quantités pour tenir un prix (l\'ancien monde d\'avant 2008) ne fonctionne plus — le prix de la réserve tomberait à zéro. On pilote donc par le plancher : l\'IORB pour les banques, l\'ON RRP pour les fonds monétaires — la fourchette est la CIBLE, ces taux administrés sont les OUTILS qui l\'imposent, et le taux de marché qui en résulte se lit chaque matin.',
    definitionEn:
      'The steering regime born of QE: with thousands of billions of excess reserves, adjusting quantities to hold a price (the pre-2008 world) no longer works — the price of reserves would fall to zero. So you steer by the floor: IORB for banks, ON RRP for money funds — the range is the TARGET, these administered rates are the TOOLS that enforce it, and the resulting market rate is read every morning.',
    moduleId: M10,
  },
  {
    terme: '€STR',
    en: '€STR',
    definition:
      'Le taux moyen constaté des emprunts au jour le jour NON sécurisés entre grandes banques de la zone euro — le taux effectif qui vérifie que le levier fonctionne : il vit en permanence quelques points de base sous le taux de dépôt, sa laisse est courte. Successeur des IBOR déclaratifs, c\'est un taux calculé sur transactions réelles, et le taux sans risque de référence sur lequel se construisent swaps, courbes d\'actualisation et produits indexés — le r du module 4 a un prénom.',
    definitionEn:
      'The observed average rate on UNSECURED overnight borrowing between large euro area banks — the effective rate that checks the lever is working: it permanently lives a few basis points below the deposit rate, on a short leash. Successor to the declarative IBORs, it is computed from real transactions, and the reference risk-free rate on which swaps, discount curves and indexed products are built — module 4\'s r has a first name.',
    moduleId: M10,
  },
  {
    terme: 'SOFR',
    en: 'SOFR',
    definition:
      'Le taux au jour le jour américain SÉCURISÉ par du collatéral Treasuries (repo), qui a remplacé le LIBOR — taux « déclaré » et non transigé, mort du scandale de sa manipulation, éteint en 2023. Référence des swaps et courbes en dollars. Son heure de gloire involontaire : le 17 septembre 2019, en pleine panne de plomberie du QT, il imprime 5,25 % quand la Fed vise 2-2,25 % — le jour où le marché a trouvé le plancher de réserves.',
    definitionEn:
      'The US overnight rate SECURED by Treasury collateral (repo), which replaced LIBOR — a "declared", untraded rate, dead of its manipulation scandal, extinguished in 2023. The reference for dollar swaps and curves. Its involuntary hour of fame: on 17 September 2019, in the middle of QT\'s plumbing failure, it printed 5.25% while the Fed targeted 2-2.25% — the day the market found the reserve floor.',
    moduleId: M10,
  },
  {
    terme: 'taux neutre (r*)',
    en: 'neutral rate (r*)',
    definition:
      'Le taux réel qui ne stimule ni ne freine — l\'équilibre de l\'économie, le point zéro de la règle de Taylor (r* + π est le taux nominal neutre). Tout se juge par rapport à lui : une politique est restrictive quand le taux réel dépasse r*, accommodante en dessous. Le problème : il est INOBSERVABLE — estimé avec des barres d\'erreur d\'un point, et une erreur sur r* se transporte intégralement dans la prescription de taux.',
    definitionEn:
      'The real rate that neither stimulates nor restrains — the economy\'s equilibrium, the zero point of the Taylor rule (r* + π is the neutral nominal rate). Everything is judged against it: policy is restrictive when the real rate exceeds r*, accommodative below. The problem: it is UNOBSERVABLE — estimated with one-point error bars, and an error on r* carries straight through into the rate prescription.',
    moduleId: M10,
  },
  {
    terme: 'règle de Taylor',
    en: 'Taylor rule',
    definition:
      'i = r* + π + a(π − π*) + b·gap, coefficients 0,5 (Taylor 1993) : taux neutre, plus inflation courante, plus pénalité d\'écart à la cible, plus correction conjoncturelle. L\'exemple du cours : (2, 4, 2, −1) prescrit 6,5 %. Volcker 1980 : prescription 19,5 %, taux réalisé 20. Ni pilote automatique (r* inobservable, gap massivement révisé) ni décoration : un étalon de conversation — « la Fed est 300 pb sous sa Taylor » est une phrase de desk. Quand elle prescrit un taux négatif (2009 : −1,25 %), il faut d\'autres outils — la motivation historique du QE.',
    definitionEn:
      'i = r* + π + a(π − π*) + b·gap, coefficients 0.5 (Taylor 1993): neutral rate, plus current inflation, plus the target-deviation penalty, plus the cyclical correction. The course example: (2, 4, 2, −1) prescribes 6.5%. Volcker 1980: prescription 19.5%, realised rate 20. Neither an autopilot (r* unobservable, the gap heavily revised) nor decoration: a conversation benchmark — "the Fed is 300 bps below its Taylor" is a desk sentence. When it prescribes a negative rate (2009: −1.25%), other tools are needed — QE\'s historical motivation.',
    moduleId: M10,
  },
  {
    terme: 'principe de Taylor',
    en: 'Taylor principle',
    definition:
      'Le vrai contenu de la règle : avec a > 0, un point d\'inflation en plus relève le taux prescrit de PLUS d\'un point (1 + a). La raison est le taux réel : bouger exactement d\'un pour un le laisserait inchangé — de l\'agitation sans effet ; bouger moins le ferait BAISSER en pleine flambée — la politique devient plus accommodante à mesure que l\'inflation monte, la recette exacte des années 70. Le critère qui sépare une banque centrale qui court derrière l\'inflation d\'une banque centrale qui la rattrape.',
    definitionEn:
      'The rule\'s real content: with a > 0, one more point of inflation raises the prescribed rate by MORE than one point (1 + a). The reason is the real rate: moving exactly one-for-one would leave it unchanged — motion without effect; moving less would make it FALL amid the surge — policy getting more accommodative as inflation rises, the exact recipe of the 1970s. The criterion separating a central bank chasing inflation from one catching it.',
    moduleId: M10,
  },
  {
    terme: 'effet Fisher',
    en: 'Fisher effect',
    definition:
      'La relation d\'Irving Fisher entre nominal, réel et inflation : 1 + r = (1 + i)/(1 + π) — ce qu\'un placement rapporte vraiment, c\'est son taux réel. L\'approximation de tête r ≈ i − π néglige le terme croisé et SURESTIME toujours le réel, d\'autant plus que les niveaux sont élevés : 6 pb d\'écart à (5 %, 2 %) — 2,94 % exact contre 3 % —, 15 pb à (10 %, 8 %) — 1,85 % contre 2 %. Le réflexe d\'entretien : donner l\'approximation, puis signaler l\'écart et son signe.',
    definitionEn:
      'Irving Fisher\'s relation between nominal, real and inflation: 1 + r = (1 + i)/(1 + π) — what an investment truly returns is its real rate. The mental approximation r ≈ i − π neglects the cross term and always OVERSTATES the real rate, all the more as levels are high: 6 bps of gap at (5%, 2%) — 2.94% exact versus 3% —, 15 bps at (10%, 8%) — 1.85% versus 2%. The interview reflex: give the approximation, then flag the gap and its sign.',
    moduleId: M10,
  },
  {
    terme: 'taux réel',
    en: 'real rate',
    definition:
      'Ce qui reste du taux nominal une fois l\'inflation déduite — LA variable qui compte : elle dit si une politique est restrictive (réel au-dessus du neutre r*), pilote les décisions d\'épargne, et sert de thermomètre à l\'or (zéro flux : son coût d\'opportunité est tout entier le réel auquel on renonce). Peut être négatif — répression financière : à l\'été 2022, un nominal de 2,5 % sous 8 % d\'inflation faisait un réel de −5,09 % — quatre hausses plus tard, la politique était encore massivement accommodante. Restrictif ou pas ne se lit jamais sur le nominal.',
    definitionEn:
      'What remains of the nominal rate once inflation is deducted — THE variable that matters: it says whether policy is restrictive (real above the neutral r*), drives saving decisions, and serves as gold\'s thermometer (zero cash flow: its opportunity cost is entirely the real rate forgone). Can be negative — financial repression: in summer 2022, a 2.5% nominal under 8% inflation made a −5.09% real — four hikes in, policy was still massively accommodative. Restrictive or not is never read off the nominal.',
    moduleId: M10,
  },
  {
    terme: 'transmission de la politique monétaire',
    en: 'monetary policy transmission',
    definition:
      'Le trajet entre la décision d\'un comité et le panier de courses — long, indirect, incertain, par CINQ canaux simultanés : taux (le crédit renchérit — la mensualité +32 %), crédit (les banques durcissent l\'offre, les spreads s\'écartent), change (la devise s\'apprécie, désinflation importée), prix d\'actifs (actualisation plus chère, effet richesse négatif), anticipations (le canal gratuit, réservé aux banques crédibles). Délais « longs et variables » : 12 à 18 mois — la banque centrale pilote dans le rétroviseur. Et asymétrique : freiner marche toujours, relancer non — pushing on a string.',
    definitionEn:
      'The journey from a committee\'s decision to the shopping basket — long, indirect, uncertain, through FIVE simultaneous channels: rates (credit gets dearer — the +32% mortgage payment), credit (banks tighten supply, spreads widen), exchange rate (the currency appreciates, imported disinflation), asset prices (dearer discounting, negative wealth effect), expectations (the free channel, reserved for credible banks). "Long and variable lags": 12 to 18 months — the central bank steers by the rearview mirror. And asymmetric: braking always works, reflating does not — pushing on a string.',
    moduleId: M10,
  },
  {
    terme: 'canal du crédit',
    en: 'credit channel',
    definition:
      'La couche que le canal des taux ignore : la QUANTITÉ de crédit bouge aussi. Quand les taux montent, le coût de financement du prêteur grimpe, ses collatéraux valent moins, ses emprunteurs deviennent plus risqués — la banque durcit ses critères : apports exigés, dossiers refusés, lignes non renouvelées ; certains agents ne trouvent plus de financement à AUCUN prix (credit crunch dans la version brutale). Thermomètre : les spreads de crédit, qui s\'écartent et AMPLIFIENT le resserrement. Le canal des taux touche tout le monde un peu ; celui du crédit touche les plus fragiles beaucoup.',
    definitionEn:
      'The layer the rate channel ignores: the QUANTITY of credit moves too. When rates rise, the lender\'s funding cost climbs, its collateral is worth less, its borrowers get riskier — the bank tightens its standards: higher down payments, rejected files, unrenewed lines; some agents find no funding at ANY price (a credit crunch in the brutal version). Thermometer: credit spreads, which widen and AMPLIFY the tightening. The rate channel touches everyone a little; the credit channel hits the most fragile a lot.',
    moduleId: M10,
  },
  {
    terme: 'effet richesse',
    en: 'wealth effect',
    definition:
      'Le second étage du canal des prix d\'actifs : des ménages qui se sentent plus riches — portefeuille qui monte, logement qui se valorise — consomment plus, même sans revenu supplémentaire ; plus pauvres, ils épargnent. En serrant les taux, la banque centrale dégonfle les patrimoines et refroidit la consommation par ce détour psychologique. Puissant aux États-Unis (l\'épargne vit en actions, 401k), plus faible en Europe (livrets, assurance-vie en euros) : l\'anatomie financière d\'un pays détermine sa sensibilité.',
    definitionEn:
      'The second storey of the asset-price channel: households that feel richer — rising portfolio, appreciating home — consume more, even without extra income; poorer, they save. By tightening, the central bank deflates wealth and cools consumption through this psychological detour. Powerful in the United States (savings live in equities, 401k), weaker in Europe (savings accounts, euro-denominated life insurance): a country\'s financial anatomy determines its households\' sensitivity.',
    moduleId: M10,
  },
  {
    terme: 'forward guidance',
    en: 'forward guidance',
    definition:
      'S\'engager sur la trajectoire FUTURE des taux (« les taux resteront bas aussi longtemps que… ») pour écraser les taux longs quand le taux court est déjà à zéro — puisque les taux longs sont faits d\'anticipations de taux courts, piloter les anticipations, c\'est piloter la courbe sans acheter un titre. Deux saveurs : calendaire (simple mais rigide) et conditionnelle (auto-ajustable mais exigeante). Ne vaut que ce que vaut la parole — et la sortie est un champ de mines : le taper tantrum de 2013 est né d\'une simple évocation de ralentir les achats.',
    definitionEn:
      'Committing to the FUTURE path of rates ("rates will stay low at least as long as…") to crush long yields when the short rate is already at zero — since long rates are made of expected short rates, steering expectations means steering the curve without buying a single bond. Two flavours: calendar-based (simple but rigid) and state-contingent (self-adjusting but demanding). Worth only what the word is worth — and the exit is a minefield: the 2013 taper tantrum was born of a mere mention of slowing purchases.',
    moduleId: M10,
  },
  {
    terme: 'borne zéro (ZLB)',
    en: 'zero lower bound (ZLB)',
    definition:
      'Le plancher du taux directeur, imposé par un actif qui rapporte toujours exactement 0 % : le billet de banque — descendez franchement sous zéro et tout déposant rationnel vide son compte pour remplir un coffre. En 2009, la règle de Taylor prescrivait environ −1,25 % : quand la règle prescrit l\'impossible, il faut d\'autres outils — QE, forward guidance, taux légèrement négatifs. Le plancher s\'est révélé un peu poreux (stocker des milliards de billets coûte) : −0,50 % à la BCE, −0,75 % en Suisse — mais avec un plancher effectif proche, le reversal rate.',
    definitionEn:
      'The policy rate\'s floor, imposed by an asset that always returns exactly 0%: the banknote — go decisively below zero and every rational depositor empties his account to fill a vault. In 2009 the Taylor rule prescribed about −1.25%: when the rule prescribes the impossible, other tools are needed — QE, forward guidance, mildly negative rates. The floor proved slightly porous (storing billions in banknotes costs money): −0.50% at the ECB, −0.75% in Switzerland — but with a nearby effective floor, the reversal rate.',
    moduleId: M10,
  },
  {
    terme: 'QE (assouplissement quantitatif)',
    en: 'QE (quantitative easing)',
    definition:
      'La banque centrale achète des obligations et les paie en créditant les réserves de la banque vendeuse — elle ne prélève cet argent nulle part, elle l\'inscrit. Double canal sur les taux longs : le SIGNAL (les achats rendent crédibles des taux bas durables) et la RARETÉ DE LA DURATION (la prime de terme se comprime, les évincés migrent vers crédit et actions). Effet estimé de QE1 : 50 à 100 pb sur le 10 ans — les suivants moins, car anticipés. Bilans : Fed de ~6 % à ~35 % du PIB, Eurosystème ~65 %, BoJ plus de 120 %. Critiques : inégalités (le mécanisme EST la hausse des prix d\'actifs), zombification, dominance budgétaire.',
    definitionEn:
      'The central bank buys bonds and pays by crediting the selling bank\'s reserves — it takes that money from nowhere, it writes it. A double channel on long rates: the SIGNAL (purchases make durably low rates credible) and DURATION SCARCITY (the term premium compresses, the crowded-out migrate to credit and equities). Estimated QE1 effect: 50 to 100 bps on the 10-year — less for the sequels, being anticipated. Balance sheets: Fed from ~6% to ~35% of GDP, Eurosystem ~65%, BoJ over 120%. Critiques: inequality (the mechanism IS rising asset prices), zombification, fiscal dominance.',
    moduleId: M10,
  },
  {
    terme: 'QT (resserrement quantitatif)',
    en: 'QT (quantitative tightening)',
    definition:
      'Le film du QE à l\'envers, en beaucoup plus lent : plutôt que vendre (presque jamais — ce serait provoquer le choc de taux qu\'on veut éviter), laisser courir les tombées sans réinvestir, avec des plafonds mensuels (Fed 2022 : 60 Md$ de Treasuries + 35 de MBS). La prudence vient d\'une asymétrie : en QE on ajoute des réserves à un système qui absorbe ; en QT on en retire SANS connaître le plancher — on ne le découvre qu\'en le touchant, comme le 17 septembre 2019, repo intraday vers 10 %, réinjection d\'urgence dès le lendemain.',
    definitionEn:
      'The QE film in reverse, much slower: rather than selling (almost never — that would cause the very rate shock you want to avoid), let maturities run off without reinvesting, with monthly caps (Fed 2022: $60bn Treasuries + 35 MBS). The caution comes from an asymmetry: in QE you add reserves to a system that absorbs them; in QT you withdraw them WITHOUT knowing the floor — you only find it by hitting it, as on 17 September 2019, intraday repo near 10%, emergency reinjection the very next day.',
    moduleId: M10,
  },
  {
    terme: 'prime de terme',
    en: 'term premium',
    definition:
      'Le supplément qu\'un taux long paie au-dessus de la moyenne des taux courts anticipés sur la période (décomposition du module 4 : y₁₀ = anticipations + TP₁₀). C\'est la cible du canal de rareté du QE : en retirant du marché des centaines de milliards de duration, la banque centrale assèche l\'offre de risque de taux et comprime la prime. Effet secondaire durable : des primes comprimées déforment les vieux thermomètres — l\'inversion de courbe 2022-2024, la plus profonde en quarante ans, n\'a pas livré sa récession dans les délais.',
    definitionEn:
      'The supplement a long rate pays above the average of expected short rates over the period (module 4\'s decomposition: y₁₀ = expectations + TP₁₀). It is the target of QE\'s scarcity channel: by pulling hundreds of billions of duration from the market, the central bank drains the supply of rate risk and compresses the premium. A lasting side effect: compressed premia distort the old thermometers — the 2022-2024 curve inversion, the deepest in forty years, did not deliver its recession on schedule.',
    moduleId: M10,
  },
  {
    terme: 'taux négatifs',
    en: 'negative rates',
    definition:
      'Passer sous le plancher zéro, à petites doses — possible parce que stocker physiquement des milliards de billets coûte (coffres, assurance, transport) : BCE à −0,10 % en 2014 puis −0,50 % de 2019 à 2022, Suisse à −0,75 %. Le mécanisme : les réserves excédentaires COÛTENT au lieu de rapporter — une taxe à détenir du cash, censée pousser à prêter. Le problème est au bilan des banques : les dépôts des ménages restent à 0 % (ils partiraient en billets) pendant que l\'actif rapporte de moins en moins — la marge d\'intérêt se comprime.',
    definitionEn:
      'Going below the zero floor, in small doses — possible because physically storing billions in banknotes costs money (vaults, insurance, transport): ECB at −0.10% in 2014 then −0.50% from 2019 to 2022, Switzerland at −0.75%. The mechanism: excess reserves COST instead of earning — a tax on holding cash, meant to push lending. The problem sits on bank balance sheets: household deposits stay at 0% (they would flee into banknotes) while assets earn less and less — the interest margin compresses.',
    moduleId: M10,
  },
  {
    terme: 'tiering',
    en: 'tiering',
    definition:
      'L\'amortisseur bricolé par la BCE en 2019 pour rendre les taux négatifs soutenables : une partie des réserves excédentaires est EXONÉRÉE du taux négatif — la taxe devient supportable pour les banques sans en annuler le signal sur le taux marginal. La reconnaissance implicite que l\'arme des taux négatifs blesse aussi la main qui la tient : la marge d\'intérêt des banques, donc leur capacité à prêter.',
    definitionEn:
      'The shock absorber the ECB rigged up in 2019 to make negative rates sustainable: part of excess reserves is EXEMPTED from the negative rate — the tax becomes bearable for banks without cancelling the signal on the marginal rate. The implicit admission that the negative-rate weapon also wounds the hand that holds it: banks\' interest margins, hence their capacity to lend.',
    moduleId: M10,
  },
  {
    terme: 'reversal rate',
    en: 'reversal rate',
    definition:
      'Le seuil en dessous duquel baisser le taux devient CONTRACTIONNISTE — l\'arme se retourne : les dépôts restant à 0 %, chaque baisse supplémentaire comprime la marge d\'intérêt des banques, et une banque dont la marge fond prête moins. Le vrai plancher de la politique monétaire n\'est donc pas zéro, ni même le coût de stockage du cash : c\'est le point où l\'assouplissement détruit plus de crédit qu\'il n\'en crée.',
    definitionEn:
      'The threshold below which cutting rates becomes CONTRACTIONARY — the weapon turns on its wielder: with deposits stuck at 0%, each further cut squeezes banks\' interest margins, and a bank whose margin melts lends less. Monetary policy\'s true floor is therefore neither zero nor even the cost of storing cash: it is the point where easing destroys more credit than it creates.',
    moduleId: M10,
  },
  {
    terme: 'YCC (contrôle de la courbe des taux)',
    en: 'YCC (yield curve control)',
    definition:
      'Le dernier cran, franchi par la BoJ en 2016 : cibler non plus une quantité mais un PRIX — le 10 ans japonais « autour de 0 % », dans une bande. Élégance théorique : une cible parfaitement crédible s\'auto-réalise, personne ne vend contre une banque centrale à munitions infinies, donc elle achète peu. Revers découvert en 2022 : quand tout le monde doute, il faut acheter massivement pour défendre la bande — plus de la moitié des JGB, un marché par moments sans transaction. Sortie par élargissements successifs, abandon en mars 2024. Un prix administré est facile à tenir tant que personne ne le teste.',
    definitionEn:
      'The final notch, crossed by the BoJ in 2016: targeting not a quantity but a PRICE — the Japanese 10-year "around 0%", within a band. Theoretical elegance: a perfectly credible price target self-fulfils, nobody sells against a central bank with infinite ammunition, so it buys little. The flip side surfaced in 2022: when everyone doubts, you must buy massively to defend the band — over half of all JGBs, a market at times with literally no trades. Exit by successive widenings, abandoned in March 2024. An administered price is easy to hold as long as nobody tests it.',
    moduleId: M10,
  },
  {
    terme: 'TLTRO',
    en: 'TLTRO',
    definition:
      'Les opérations ciblées de refinancement de long terme de la BCE : des prêts aux banques dont le taux S\'AMÉLIORE si elles prêtent à l\'économie réelle — pendant la pandémie, une banque atteignant ses objectifs de crédit empruntait à la BCE à −1 %. De la subvention conditionnelle au crédit : le non-conventionnel ne passe pas que par les marchés de titres, il peut viser directement le canal du crédit.',
    definitionEn:
      'The ECB\'s targeted longer-term refinancing operations: loans to banks whose rate IMPROVES if they lend to the real economy — during the pandemic, a bank hitting its credit targets borrowed from the ECB at −1%. Conditional subsidy to credit: the unconventional toolkit does not only work through securities markets, it can aim straight at the credit channel.',
    moduleId: M10,
  },
  {
    terme: 'OMT / « whatever it takes »',
    en: 'OMT / "whatever it takes"',
    definition:
      'Été 2012 : la zone euro se désagrège par ses spreads (10 ans espagnol au-delà de 7,5 %), le marché pricant un risque de redénomination auto-réalisateur — doute → taux plus hauts → insolvabilité → doute. Le 26 juillet, trois phrases de Draghi à Londres ; en septembre, le véhicule : l\'OMT, achats ILLIMITÉS de dette d\'un État sous programme d\'ajustement. Jamais activé, pas un euro dépensé — et les spreads se dégonflent de centaines de points de base : plus personne ne vend contre un acheteur sans limite. L\'outil le plus efficace de la décennie n\'a rien coûté : la monnaie de réserve d\'une banque centrale est sa parole.',
    definitionEn:
      'Summer 2012: the euro area is coming apart through its spreads (Spanish 10-year beyond 7.5%), the market pricing a self-fulfilling redenomination risk — doubt → higher rates → insolvency → doubt. On 26 July, three sentences from Draghi in London; in September, the vehicle: OMT, UNLIMITED purchases of the debt of a State under an adjustment programme. Never activated, not one euro spent — and spreads deflate by hundreds of basis points: nobody sells against a limitless buyer. The decade\'s most effective tool cost nothing: a central bank\'s reserve currency is its word.',
    moduleId: M10,
  },
  {
    terme: 'headline / core',
    en: 'headline / core inflation',
    definition:
      'Les deux paires de lunettes sur le même indice : le headline (indice global) contre le core — HORS énergie et alimentation. Double logique de l\'amputation : ces composantes sont les plus volatiles (chocs pétroliers, récoltes, géopolitique — des embardées sans contenu sur la tendance), et surtout hors de portée des taux — monter le directeur ne fait pas pousser le blé ni rouvrir un gazoduc ; le core estime l\'inflation domestique et de demande, celle sur laquelle la politique a prise. Règle de lecture : le headline fait les titres de presse, le core fait les décisions.',
    definitionEn:
      'Two pairs of glasses on the same index: headline (the full index) versus core — EXCLUDING energy and food. The amputation\'s double logic: those components are the most volatile (oil shocks, harvests, geopolitics — lurches with no signal about the trend), and above all beyond the reach of rates — hiking the policy rate does not grow wheat or reopen a pipeline; core estimates domestic, demand-driven inflation, the kind policy can grip. Reading rule: headline makes the press headlines, core makes the decisions.',
    moduleId: M10,
  },
  {
    terme: 'effet de base',
    en: 'base effect',
    definition:
      'Le piège du glissement annuel : l\'indice de ce mois comparé au même mois de l\'an dernier — le chiffre dépend autant du passé que du présent. Un choc unique de +3 % en mars 2022 puis +0,2 % par mois : le glissement affiche ≈ 5,29 % en mars 2023, puis ≈ 2,43 % un mois plus tard quand le choc SORT de la fenêtre — 2,9 points de « désinflation » sans que le rythme courant change d\'un iota. Joué en grandeur réelle au printemps 2023. Réflexe : devant tout chiffre en glissement annuel, demander ce qui entre et ce qui sort de la fenêtre.',
    definitionEn:
      'The year-on-year trap: this month\'s index compared to the same month last year — the print depends as much on the past as on the present. A one-off +3% shock in March 2022 then +0.2% a month: the year-on-year shows ≈ 5.29% in March 2023, then ≈ 2.43% a month later when the shock EXITS the window — 2.9 points of "disinflation" while the current pace has not changed one iota. Played out for real in spring 2023. Reflex: before any year-on-year figure, ask what enters and what leaves the window.',
    moduleId: M10,
  },
  {
    terme: 'désancrage des anticipations',
    en: 'de-anchoring of expectations',
    definition:
      'Le scénario que tout banquier central redoute : quand « l\'inflation, c\'est reparti pour dix ans » devient la croyance commune, l\'inflation s\'installe dans les contrats, les baux, les grilles salariales — elle devient inertielle, et il faudra une récession pour l\'en déloger. La ligne de partage entre les années 1970 (anticipations perdues, Volcker en facture finale) et 2021-2023 (anticipations tenues, désinflation rapide). D\'où la surréaction en parole au moindre frémissement des anticipations de long terme : on ne combat pas l\'inflation du mois, on défend l\'ancrage.',
    definitionEn:
      'The scenario every central banker dreads: when "inflation is back for ten years" becomes the common belief, inflation settles into contracts, leases and pay scales — it turns inertial, and it will take a recession to dislodge it. The dividing line between the 1970s (expectations lost, Volcker as the final bill) and 2021-2023 (expectations held, rapid disinflation). Hence the verbal overreaction to the slightest quiver in long-term expectations: you are not fighting this month\'s inflation, you are defending the anchor.',
    moduleId: M10,
  },
  {
    terme: 'spirale prix-salaires',
    en: 'wage-price spiral',
    definition:
      'L\'accélérateur transversal aux trois moteurs de l\'inflation : les prix montent, les salariés obtiennent des hausses pour compenser, les entreprises répercutent ces coûts dans leurs prix, qui justifient de nouvelles hausses — la boucle s\'auto-entretient, et un choc devient un régime. Son carburant : les anticipations — on ne négocie une indexation que contre une inflation qu\'on croit permanente. Elle a fait les années 70 ; elle n\'a PAS pris en 2021-2023, l\'ancrage ayant tenu.',
    definitionEn:
      'The accelerator cutting across inflation\'s three engines: prices rise, workers win compensating pay rises, firms pass those costs into their prices, which justify new pay rises — the loop feeds itself, and a shock becomes a regime. Its fuel: expectations — you only negotiate indexation against an inflation you believe permanent. It made the 1970s; it did NOT catch in 2021-2023, the anchor having held.',
    moduleId: M10,
  },
  {
    terme: 'ratio de sacrifice',
    en: 'sacrifice ratio',
    definition:
      'La facture de la désinflation : |écarts de production cumulés|/désinflation — les points de PIB perdus par point d\'inflation éradiqué. Volcker : environ dix points de désinflation (13 % → 3-4 %) contre une quinzaine de points de production, ratio ≈ 1,5, deux récessions, chômage à 10,8 %. 2023 : ratio quasi nul — la « désinflation immaculée », choc d\'offre résorbé et anticipations ancrées. Pas une constante de la nature : le prix de la désinflation POUR UN STOCK DE CRÉDIBILITÉ DONNÉ — une banque crédible l\'obtient par la conviction, une banque décrédibilisée l\'achète en récession.',
    definitionEn:
      'Disinflation\'s bill: |cumulative output gaps|/disinflation — the GDP points lost per point of inflation eradicated. Volcker: about ten points of disinflation (13% → 3-4%) against some fifteen points of output, ratio ≈ 1.5, two recessions, 10.8% unemployment. 2023: a near-zero ratio — the "immaculate disinflation", supply shock unwound and expectations anchored. Not a constant of nature: the price of disinflation FOR A GIVEN STOCK OF CREDIBILITY — a credible bank gets it through conviction, a discredited one buys it with a recession.',
    moduleId: M10,
  },
  {
    terme: 'désinflation',
    en: 'disinflation',
    definition:
      'Le RYTHME qui ralentit — de 10 % à 2 % — pendant que l\'indice continue de monter : les prix de 2021 ne reviendront jamais, le niveau est acquis pour toujours. À ne jamais confondre avec la DÉFLATION, rythme négatif — une tout autre pathologie, plus redoutée encore : reports d\'achats, poids réel des dettes qui gonfle, spirale japonaise. « L\'inflation baisse mais tout reste cher » énonce exactement la différence entre la dérivée (revenue à 2 %) et le niveau (jamais redescendu) — la distinction la plus rentable à l\'oral.',
    definitionEn:
      'The PACE slowing — from 10% to 2% — while the index keeps rising: 2021 prices are never coming back, the level is locked in forever. Never to be confused with DEFLATION, a negative pace — an altogether different pathology, feared even more: postponed purchases, the real weight of debts swelling, the Japanese spiral. "Inflation is falling but everything stays expensive" states exactly the difference between the derivative (back to 2%) and the level (never come down) — the most profitable distinction at the oral.',
    moduleId: M10,
  },
  {
    terme: 'NFP (non-farm payrolls)',
    en: 'NFP (non-farm payrolls)',
    definition:
      'Les créations nettes d\'emplois non agricoles américaines — premier vendredi du mois, 8 h 30 à New York, flanquées du taux de chômage et des salaires horaires. Régime de croisière d\'une économie saine : environ 150 000 à 200 000 par mois. Piège de lecture : chaque publication RÉVISE les deux mois précédents, parfois de plus de 100 000 — un beau chiffre assorti de révisions massives à la baisse se lit comme une mauvaise nouvelle. Événement de marché au même titre que le CPI, mandat dual oblige.',
    definitionEn:
      'US net non-farm job creation — first Friday of the month, 8:30 in New York, flanked by the unemployment rate and hourly wages. Cruising speed of a healthy economy: roughly 150,000 to 200,000 a month. Reading trap: each release REVISES the two previous months, sometimes by over 100,000 — a fine print paired with massive downward revisions reads as bad news. A market event on a par with the CPI, dual mandate oblige.',
    moduleId: M10,
  },
  {
    terme: 'CPI / IPCH',
    en: 'CPI / HICP',
    definition:
      'Les indices des prix à la consommation : le CPI américain (publié vers le 13 du mois) et l\'IPCH — l\'indice harmonisé de la zone euro, pour que vingt économies parlent la même langue statistique (la cible BCE le vise ; la Fed, elle, cible le PCE). Toujours une CONVENTION : un panier pondéré que personne ne vit exactement. Deux paires de lunettes obligatoires : headline vs core, et MoM vs YoY — le glissement annuel traîne un an d\'histoire, le mensuel est l\'information fraîche, à annualiser en composant.',
    definitionEn:
      'The consumer price indices: the US CPI (released around the 13th) and the HICP — the euro area\'s harmonised index, so twenty economies speak the same statistical language (the ECB targets it; the Fed targets the PCE). Always a CONVENTION: a weighted basket nobody lives exactly. Two mandatory pairs of glasses: headline vs core, and MoM vs YoY — the year-on-year drags a year of history, the monthly is the fresh information, to be annualised by compounding.',
    moduleId: M10,
  },
  {
    terme: 'PMI',
    en: 'PMI',
    definition:
      'Les enquêtes de diffusion auprès des directeurs d\'achats (dont l\'ISM américain) : commandes, production, emploi, délais. La lecture tient en un nombre : 50 = frontière entre expansion et contraction — 55 dit que l\'activité accélère franchement, 45 qu\'elle se contracte. Leur valeur n\'est pas la précision mais l\'AVANCE : publiés dès la fin du mois qu\'ils décrivent, ils précèdent les données dures d\'un à deux mois — les phares de la voiture.',
    definitionEn:
      'The diffusion surveys of purchasing managers (including the US ISM): orders, output, employment, delivery times. The reading fits in one number: 50 = the frontier between expansion and contraction — 55 says activity is accelerating decisively, 45 that it is shrinking. Their value is not precision but LEAD: published as soon as the month they describe ends, they precede hard data by one to two months — the car\'s headlights.',
    moduleId: M10,
  },
  {
    terme: 'consensus',
    en: 'consensus',
    definition:
      'La médiane des prévisions soumises par les économistes des banques avant chaque publication — et la clé de toute la lecture des indicateurs : au moment de la publication, le consensus est DÉJÀ dans les prix (l\'efficience du module 1 au travail). Un chiffre conforme, même spectaculaire dans l\'absolu, est un non-événement ; un chiffre banal mais inattendu est une bombe. D\'où le paradoxe du stagiaire : « 200 000 emplois créés et les taux n\'ont pas bougé » — c\'était le consensus.',
    definitionEn:
      'The median of the forecasts bank economists submit before each release — and the key to all indicator reading: at publication time, the consensus is ALREADY in the prices (module 1\'s efficiency at work). A print in line, however spectacular in absolute terms, is a non-event; an ordinary but unexpected print is a bomb. Hence the intern\'s paradox: "200,000 jobs created and rates did not move" — that was the consensus.',
    moduleId: M10,
  },
  {
    terme: 'surprise économique',
    en: 'economic surprise',
    definition:
      'L\'écart entre publié et consensus, STANDARDISÉ par l\'écart-type historique des surprises : (publié − consensus)/σ, sans unité, « en sigmas ». Le NFP du cours : 300 000 contre 180 000 attendus, σ = 60 000 ⇒ +2σ, rare donc violent — quand ±0,5σ n\'est que du bruit. La normalisation rend les indicateurs comparables entre eux. Et le SIGNE de la traduction en prix dépend du régime : en 2022, bon chiffre d\'emploi = plus de hausses de taux = actions en baisse — good news is bad news.',
    definitionEn:
      'The gap between print and consensus, STANDARDISED by the historical standard deviation of surprises: (print − consensus)/σ, unitless, "in sigmas". The course\'s NFP: 300,000 versus 180,000 expected, σ = 60,000 ⇒ +2σ, rare hence violent — while ±0.5σ is mere noise. The normalisation makes indicators comparable with each other. And the SIGN of the translation into prices depends on the regime: in 2022, a good jobs print = more hikes = falling equities — good news is bad news.',
    moduleId: M10,
  },
  {
    terme: 'nowcasting',
    en: 'nowcasting',
    definition:
      'Estimer le trimestre EN COURS, en continu — parce que le PIB décrit un trimestre fini depuis un mois. Le plus suivi : GDPNow (Fed d\'Atlanta), un modèle purement mécanique qui agrège chaque publication en une estimation du PIB annualisé, mise à jour six à sept fois par mois, sans jugement humain. Mode d\'emploi honnête : imprécis en début de trimestre (le −2 % d\'avril qui finit à +2 % en juin est un classique), à lire pour ses RÉVISIONS plus que pour son niveau — un GDPNow qui décroche dit que le trimestre se dégrade en temps réel.',
    definitionEn:
      'Estimating the CURRENT quarter, continuously — because GDP describes a quarter finished a month ago. The most followed: GDPNow (Atlanta Fed), a purely mechanical model aggregating each release into an annualised GDP estimate, updated six to seven times a month, with no human judgement. Honest user manual: imprecise early in the quarter (April\'s −2% ending at +2% in June is a classic), to be read for its REVISIONS more than its level — a GDPNow breaking lower says the quarter is deteriorating in real time.',
    moduleId: M10,
  },
  {
    terme: 'taux terminal',
    en: 'terminal rate',
    definition:
      'Le sommet (ou le plancher) que le marché anticipe pour le cycle en cours : taux actuel + n × pas en pb / 100 — depuis 2,50 %, quatre hausses de 50 pb mènent à 4,50 %. L\'arithmétique est triviale ; la sophistication est dans ce que le marché met dans n et dans le pas, coté en continu par les futures fed funds et les swaps €STR, réunion par réunion, et comparé aux dot plots. L\'échelle des cycles 2022-2023 : BCE +450 pb en quatorze mois, Fed +525 pb en seize.',
    definitionEn:
      'The peak (or floor) the market anticipates for the current cycle: current rate + n × step in bps / 100 — from 2.50%, four 50 bp hikes lead to 4.50%. The arithmetic is trivial; the sophistication lies in what the market puts into n and the step, quoted continuously by fed funds futures and €STR swaps, meeting by meeting, and compared to the dot plots. The 2022-2023 scale: ECB +450 bps in fourteen months, Fed +525 bps in sixteen.',
    moduleId: M10,
  },
  {
    terme: 'dot plots',
    en: 'dot plots',
    definition:
      'Chaque trimestre, chaque membre du FOMC pose un point sur le niveau de taux qu\'il juge approprié à un, deux, trois ans — et le marché lit la MÉDIANE comme une trajectoire officieuse. Un instrument de communication à part entière : un dot qui migre entre deux réunions recalibre les probabilités implicites sans qu\'aucune décision ait été prise. Se confronte en continu à la trajectoire pricée par les futures — l\'écart entre les deux est une position de marché.',
    definitionEn:
      'Each quarter, every FOMC member places a dot at the rate level he deems appropriate one, two, three years out — and the market reads the MEDIAN as an unofficial trajectory. A communication instrument in its own right: a dot migrating between two meetings recalibrates implied probabilities without any decision being taken. Continuously confronted with the futures-priced path — the gap between the two is a market position.',
    moduleId: M10,
  },
  {
    terme: 'taper tantrum',
    en: 'taper tantrum',
    definition:
      'Mai 2013 : Bernanke évoque prudemment la possibilité de RALENTIR les achats d\'actifs — ni hausse, ni vente, ni date. Le marché entend « la sortie commence » : le 10 ans américain passe d\'environ 1,6 % à 3 % en quatre mois (+130 pb — environ −10 % sur une duration de 8), et les capitaux refluent des émergents (les « Fragile Five » dévissent). L\'ironie : la réduction effective, en décembre, est absorbée sans broncher — elle était dans les prix. Le choc n\'était pas la politique menée, mais une anticipation brutalement recalée : quand la banque centrale pilote les anticipations, chaque mot est un instrument.',
    definitionEn:
      'May 2013: Bernanke cautiously mentions the possibility of SLOWING asset purchases — no hike, no sale, no date. The market hears "the exit begins": the US 10-year goes from about 1.6% to 3% in four months (+130 bps — roughly −10% on a duration of 8), and capital floods out of emerging markets (the "Fragile Five" crater). The irony: the actual tapering, in December, is absorbed without a flinch — it was in the prices. The shock was not the policy conducted but an expectation brutally reset: when the central bank steers expectations, every word is an instrument.',
    moduleId: M10,
  },
  {
    terme: 'LDI',
    en: 'LDI (liability-driven investment)',
    definition:
      'Les stratégies des fonds de pension britanniques : swaps de taux et gilts en repo, AVEC du levier, pour répliquer la duration de leurs passifs. Septembre 2022 : le mini-budget Truss envoie le 30 ans de +130 pb en trois séances (duration 20 : −26 %) ; les couvertures appellent de la marge, les fonds vendent leur actif le plus liquide — des gilts —, les ventes font monter les taux qui appellent de nouvelles marges : la spirale de ventes forcées, cassée par treize jours ouvrés d\'achats de la BoE en plein QT. La leçon : des fonds SOLVABLES (la hausse des taux les arrangeait) presque tués par la liquidité — la couverture devenue source du risque.',
    definitionEn:
      'The British pension funds\' strategies: rate swaps and gilts on repo, WITH leverage, to replicate the duration of their liabilities. September 2022: the Truss mini-budget sends the 30-year up +130 bps in three sessions (duration 20: −26%); the hedges call for margin, the funds sell their most liquid asset — gilts —, the sales push yields up which call new margin: the forced-selling spiral, broken by thirteen business days of BoE purchases in the middle of QT. The lesson: SOLVENT funds (higher rates actually suited them) nearly killed by liquidity — the hedge become the source of the risk.',
    moduleId: M10,
  },
  {
    terme: 'duration mismatch',
    en: 'duration mismatch',
    definition:
      'Un passif exigible à vue (duration zéro) finançant un actif long — le diagnostic en deux mots de Silicon Valley Bank : des dépôts de startups ayant triplé, investis en obligations longues achetées au sommet (rendements ~1,5 %, duration proche de 6, l\'essentiel en held-to-maturity que la comptabilité ne reprice pas). La hausse de 2022 crée de l\'ordre de 15 milliards de dollars de moins-values latentes — à peu près les fonds propres ; le 9 mars 2023, 42 milliards de retraits demandés en une journée, fermeture le lendemain. 48 heures : la panique du XIXᵉ siècle à la vitesse de la fibre. Le risque de taux se MESURE par la duration, il se MATÉRIALISE par la liquidité.',
    definitionEn:
      'A liability payable on demand (zero duration) funding a long asset — Silicon Valley Bank\'s two-word diagnosis: startup deposits that had tripled, invested in long bonds bought at the top (~1.5% yields, duration near 6, mostly held-to-maturity which accounting does not reprice). The 2022 hikes create on the order of 15 billion dollars of unrealised losses — roughly the equity; on 9 March 2023, 42 billion of withdrawals requested in one day, closure the next morning. 48 hours: the 19th-century bank run at fibre-optic speed. Rate risk is MEASURED by duration; it MATERIALISES through liquidity.',
    moduleId: M10,
  },
  {
    terme: 'bulle',
    en: 'bubble',
    definition:
      'Une hausse de prix qui décolle de toute valorisation par les flux actualisés et ne se nourrit plus que d\'elle-même : on achète parce que ça monte, et ça monte parce qu\'on achète. Elle naît toujours d\'un noyau de vérité — un déplacement réel (chemin de fer, Internet, titrisation) — c\'est ce qui la rend crédible. Le critère de gravité n\'est pas sa taille mais son financement : une bulle sans dette fait des déçus (dot-com, −5 000 Md$ sans crise bancaire), une bulle à crédit logée dans les banques fait des faillites (1929, 2008).',
    definitionEn:
      'A price rise that detaches from any discounted-cash-flow valuation and feeds only on itself: people buy because it rises, and it rises because they buy. It is always born from a kernel of truth — a real displacement (railways, the Internet, securitisation) — which is what makes it credible. The severity criterion is not its size but its funding: a debt-free bubble makes disappointed savers (dot-com, −$5tn with no banking crisis), a credit-fuelled bubble lodged in banks makes bankruptcies (1929, 2008).',
    moduleId: M11,
  },
  {
    terme: 'cycle de Minsky-Kindleberger',
    en: 'Minsky-Kindleberger cycle',
    definition:
      'Le schéma canonique d\'une bulle en cinq phases, formalisé par Hyman Minsky et raconté par Charles Kindleberger (Manias, Panics, and Crashes, 1978) : déplacement (une innovation réelle), boom alimenté par le crédit, euphorie (« this time is different »), prise de profit des initiés, panique — suivie de la révulsion, le dégoût durable qui explique les décennies de purgatoire. Trois siècles de crises — tulipes 1637, Mississippi 1720, dot-com 2000 — rejouent la même partition : le vocabulaire change, jamais la grammaire.',
    definitionEn:
      'The canonical five-phase anatomy of a bubble, formalised by Hyman Minsky and told by Charles Kindleberger (Manias, Panics, and Crashes, 1978): displacement (a real innovation), credit-fuelled boom, euphoria ("this time is different"), insiders taking profits, panic — followed by revulsion, the lasting disgust that explains the decades of purgatory. Three centuries of crises — tulips 1637, Mississippi 1720, dot-com 2000 — replay the same score: the vocabulary changes, never the grammar.',
    moduleId: M11,
  },
  {
    terme: 'hypothèse d\'instabilité financière',
    en: 'financial instability hypothesis',
    definition:
      'La thèse centrale de Minsky, résumable en cinq mots : la stabilité engendre l\'instabilité. Chaque année de calme « prouve » que l\'on pouvait prendre un peu plus de risque, donc on le prend : les emprunteurs glissent insensiblement de la finance couverte (les revenus paient intérêts et principal) à la finance spéculative (le principal sera refinancé) puis Ponzi (seule la hausse du prix de l\'actif sauve l\'emprunteur). Les années sans crise ne sont pas la preuve que le système est sûr — elles sont le mécanisme par lequel il cesse de l\'être.',
    definitionEn:
      'Minsky\'s central thesis, summarisable in four words: stability breeds instability. Each calm year "proves" that a little more risk could be taken, so it is taken: borrowers slide imperceptibly from hedge finance (income covers interest and principal) to speculative finance (principal will be refinanced) and then Ponzi finance (only the asset\'s price rise saves the borrower). Crisis-free years are not proof the system is safe — they are the mechanism by which it stops being so.',
    moduleId: M11,
  },
  {
    terme: 'finance Ponzi',
    en: 'Ponzi finance',
    definition:
      'Le troisième et dernier régime de financement de Minsky : les revenus de l\'emprunteur ne couvrent même plus les intérêts — seule la hausse continue du prix de l\'actif peut le sauver, par revente ou refinancement sur la valeur accrue. Le prêt subprime 2/28 (deux ans de taux d\'appel, vingt-huit ans de taux insupportable) en est l\'exemple industriel : tant que l\'immobilier montait, l\'emprunteur étranglé refinançait ; le jour où les prix ont stagné, tout l\'édifice était insolvable par construction.',
    definitionEn:
      'Minsky\'s third and final financing regime: the borrower\'s income no longer even covers interest — only the continuous rise of the asset\'s price can save them, through resale or refinancing against the increased value. The 2/28 subprime loan (two years of teaser rate, twenty-eight years of unbearable rate) is its industrial example: as long as housing rose, the strangled borrower refinanced; the day prices stalled, the whole edifice was insolvent by construction.',
    moduleId: M11,
  },
  {
    terme: 'déplacement',
    en: 'displacement',
    definition:
      'La première phase du cycle de Minsky-Kindleberger : une innovation réelle qui change légitimement les perspectives — le chemin de fer, l\'électricité et la radio (1920), Internet (1995), la titrisation (2000). C\'est le noyau de vérité de toute bulle, et sa force : chaque histoire, prise seule, est plausible. Le piège n\'est pas que le récit soit faux — c\'est qu\'il soit vrai et ne change rien à l\'arithmétique : les révolutions technologiques sont réelles, les suspensions de l\'actualisation, jamais.',
    definitionEn:
      'The first phase of the Minsky-Kindleberger cycle: a real innovation that legitimately changes the outlook — railways, electricity and radio (1920s), the Internet (1995), securitisation (2000s). It is every bubble\'s kernel of truth, and its strength: each story, taken alone, is plausible. The trap is not that the narrative is false — it is that it is true and changes nothing about the arithmetic: technological revolutions are real, suspensions of discounting never are.',
    moduleId: M11,
  },
  {
    terme: 'call loan',
    en: 'call loan',
    definition:
      'Le prêt au jour le jour, titres en garantie, qui finançait la spéculation boursière de 1929 : 100 $ de mise, 900 $ empruntés au courtier — marge de 10 %, levier 10, mort à −10 %. L\'encours des broker loans dépasse 8,5 Md$ en 1929 et le taux du call money dépasse par moments 15 % : des entreprises industrielles trouvaient plus rentable de prêter aux spéculateurs que d\'investir dans leurs usines — le stade terminal de la finance de Minsky.',
    definitionEn:
      'The overnight loan, securities as collateral, that funded the 1929 stock speculation: $100 down, $900 borrowed from the broker — 10% margin, leverage 10, death at −10%. Broker loans outstanding exceed $8.5bn in 1929 and the call money rate at times tops 15%: industrial companies found it more profitable to lend to speculators than to invest in their factories — the terminal stage of Minsky finance.',
    moduleId: M11,
  },
  {
    terme: 'jeudi noir',
    en: 'Black Thursday',
    definition:
      'Le 24 octobre 1929 : la vague de ventes submerge le NYSE — 12,9 millions de titres échangés, record absolu, et un ticker jusqu\'à quatre heures de retard : des millions de porteurs ignorent toute la journée le prix de ce qu\'ils possèdent, et dans le noir, on vend. À midi, les banquiers réunis chez Morgan envoient Richard Whitney acheter ostensiblement US Steel — le geste théâtral copié sur 1907 stabilise la séance, mais pas la suite : le lundi 28 (−12,8 %) et le mardi 29 (−11,7 %) fauchent tous les comptes à levier 10.',
    definitionEn:
      'October 24th, 1929: the selling wave overwhelms the NYSE — 12.9 million shares traded, an all-time record, and a ticker running up to four hours late: millions of holders spend the day not knowing the price of what they own, and in the dark, they sell. At noon, the bankers gathered at Morgan\'s send Richard Whitney to conspicuously buy US Steel — the theatrical gesture copied from 1907 stabilises the session, but not what follows: Monday 28th (−12.8%) and Tuesday 29th (−11.7%) mow down every leverage-10 account.',
    moduleId: M11,
  },
  {
    terme: 'lundi noir',
    en: 'Black Monday',
    definition:
      'Le 19 octobre 1987 : −508 points, −22,6 % en une seule séance sur le Dow — le pire jour de l\'histoire des indices américains, près de deux fois le pire jour de 1929, sans aucune nouvelle fondamentale ce jour-là. Le moteur : les ventes mécaniques de l\'assurance de portefeuille, amplifiées par l\'arbitrage cash-futures. Le paradoxe à réciter : aucune dépression n\'a suivi — le communiqué Greenspan du lendemain a maintenu le crédit, et le Dow a revu son pic dès août 1989. On ne juge jamais un krach à sa violence boursière, toujours à sa transmission au crédit.',
    definitionEn:
      'October 19th, 1987: −508 points, −22.6% in a single session on the Dow — the worst day in US index history, nearly twice 1929\'s worst day, with no fundamental news that day. The engine: portfolio insurance\'s mechanical selling, amplified by cash-futures arbitrage. The paradox to recite: no depression followed — the next morning\'s Greenspan statement kept credit flowing, and the Dow saw its peak again by August 1989. Never judge a crash by its market violence, always by its transmission to credit.',
    moduleId: M11,
  },
  {
    terme: 'debt-deflation',
    en: 'debt-deflation',
    definition:
      'La théorie d\'Irving Fisher (1933), écrite après sa propre ruine : les dettes sont fixées en dollars nominaux — quand les prix baissent de 10 % par an, le dollar dû vaut chaque année 10 % de plus en biens et en heures de travail : la dette réelle s\'alourdit alors même qu\'on la rembourse. Les débiteurs vendent et compriment leurs dépenses pour se désendetter, ce qui fait baisser les prix davantage : plus ils remboursent, plus ils doivent. C\'est le fondement historique de la cible de 2 % du module 10 — une marge de sécurité contre cet engrenage.',
    definitionEn:
      'Irving Fisher\'s theory (1933), written after his own ruin: debts are fixed in nominal dollars — when prices fall 10% a year, each owed dollar is worth 10% more each year in goods and hours of work: real debt grows heavier even as it is repaid. Debtors sell assets and squeeze spending to deleverage, which pushes prices down further: the more they repay, the more they owe. It is the historical foundation of module 10\'s 2% target — a safety margin against this ratchet.',
    moduleId: M11,
  },
  {
    terme: 'Glass-Steagall',
    en: 'Glass-Steagall',
    definition:
      'Le Banking Act de 1933 : la muraille qui sépare la banque commerciale (dépôts, crédit) de la banque d\'investissement (titres, spéculation), pour que l\'épargne des ménages ne finance plus les positions de marché — et qui crée la FDIC. Fissurée par dérogations à partir des années 1980, abrogée en 1999 par le Gramm-Leach-Bliley Act, neuf ans avant 2008 — le débat renaît à chaque crise, et la règle Volcker de 2010 en est un fantôme miniature. Les cicatrices institutionnelles se rouvrent et se referment.',
    definitionEn:
      'The Banking Act of 1933: the wall separating commercial banking (deposits, credit) from investment banking (securities, speculation), so that household savings no longer fund market positions — and which creates the FDIC. Chipped away by waivers from the 1980s, repealed in 1999 by the Gramm-Leach-Bliley Act, nine years before 2008 — the debate is reborn with every crisis, and 2010\'s Volcker rule is its miniature ghost. Institutional scars reopen and close again.',
    moduleId: M11,
  },
  {
    terme: 'FDIC',
    en: 'FDIC',
    definition:
      'L\'assurance fédérale des dépôts américaine, créée par le Banking Act de 1933 après la mort d\'environ 9 000 banques : si l\'État garantit votre dépôt, courir au guichet ne sert plus à rien — la ruée, de rationnelle, devient irrationnelle, donc elle ne se déclenche plus. L\'exemple le plus pur d\'une institution qui supprime un équilibre de panique sans dépenser un dollar en temps normal. Sa limite, jouée en 2023 : au-dessus du plafond de 250 k$, la ruée redevient rationnelle — plus de 90 % des dépôts de SVB étaient non assurés, et ils ont couru les premiers.',
    definitionEn:
      'The US federal deposit insurance, created by the 1933 Banking Act after some 9,000 banks died: if the State guarantees your deposit, running to the counter is pointless — the run, once rational, becomes irrational, so it no longer starts. The purest example of an institution that removes a panic equilibrium without spending a dollar in normal times. Its limit, played out in 2023: above the $250k cap the run becomes rational again — over 90% of SVB\'s deposits were uninsured, and they ran first.',
    moduleId: M11,
  },
  {
    terme: 'étalon-or',
    en: 'gold standard',
    definition:
      'Le régime monétaire où la monnaie est convertible en or à parité fixe : un ancrage externe qui retire à la banque centrale sa liberté d\'agir. En 1931, la Fed REMONTE ses taux en pleine contraction pour défendre la parité du dollar après la sortie de la livre sterling — la règle de l\'or passait avant l\'économie. En avril 1933, Roosevelt suspend la convertibilité : les prix cessent de chuter presque immédiatement — la démonstration en temps réel que la déflation était un choix de régime monétaire.',
    definitionEn:
      'The monetary regime where currency is convertible into gold at a fixed parity: an external anchor that strips the central bank of its freedom to act. In 1931, the Fed RAISES rates in the middle of the contraction to defend the dollar\'s parity after sterling leaves gold — the rules of the gold game came before the economy. In April 1933, Roosevelt suspends convertibility: prices stop falling almost immediately — the real-time demonstration that deflation was a monetary-regime choice.',
    moduleId: M11,
  },
  {
    terme: 'Smoot-Hawley',
    en: 'Smoot-Hawley',
    definition:
      'Le tarif douanier américain de juin 1930, qui relève les droits sur des milliers de produits en pleine récession : les partenaires ripostent, et le commerce mondial s\'effondre d\'environ deux tiers entre 1929 et 1933 — la contagion internationale organisée par la loi. L\'une des trois erreurs de politique qui ont transformé un krach en dépression, avec la passivité de la Fed et l\'austérité budgétaire — le manuel de ce qu\'il ne faut pas faire, relu par tous les décideurs de 2008 et 2020.',
    definitionEn:
      'The American tariff of June 1930, raising duties on thousands of products in the middle of a recession: partners retaliate, and world trade collapses by about two thirds between 1929 and 1933 — international contagion organised by law. One of the three policy errors that turned a crash into a depression, along with the Fed\'s passivity and fiscal austerity — the manual of what not to do, reread by every decision-maker in 2008 and 2020.',
    moduleId: M11,
  },
  {
    terme: 'assurance de portefeuille',
    en: 'portfolio insurance',
    definition:
      'La stratégie de Leland-O\'Brien-Rubinstein des années 1980 : répliquer synthétiquement un put par delta-hedging — vendre des futures S&P 500 quand le marché baisse, racheter quand il monte, mécaniquement. À l\'automne 1987, 60 à 90 Md$ de portefeuilles sont « assurés » ainsi. Le modèle était correct pour un acteur isolé ; suivi par des dizaines de milliards, il fabriquait le scénario contre lequel il assurait : les ventes du 19 octobre 1987 (−22,6 %) sont ses ordres à lui. L\'hypothèse qui casse : la liquidité continue de Black-Scholes.',
    definitionEn:
      'The Leland-O\'Brien-Rubinstein strategy of the 1980s: synthetically replicating a put through delta-hedging — selling S&P 500 futures when the market falls, buying back when it rises, mechanically. By autumn 1987, $60-90bn of portfolios are "insured" this way. The model was correct for an isolated player; followed by tens of billions, it manufactured the very scenario it insured against: the sell orders of 19 October 1987 (−22.6%) were its own. The assumption that breaks: Black-Scholes\'s continuous liquidity.',
    moduleId: M11,
  },
  {
    terme: 'circuit breaker',
    en: 'circuit breaker',
    definition:
      'Les coupe-circuits : des seuils de baisse d\'indice (−7 % pour le niveau 1 américain) qui suspendent automatiquement la cotation, pour casser les boucles de ventes programmées et laisser aux humains le temps de reprendre la main. Cicatrice directe du 19 octobre 1987 — une réponse de microstructure à un problème de microstructure. Baptême du feu en mars 2020 : quatre déclenchements en huit séances (les 9, 12, 16 et 18 mars), pendant le krach le plus rapide de l\'histoire.',
    definitionEn:
      'Automatic trading halts triggered by index-decline thresholds (−7% for the US level 1), designed to break programmed selling loops and give humans time to regain control. A direct scar of 19 October 1987 — a microstructure answer to a microstructure problem. Baptism of fire in March 2020: four triggers in eight sessions (March 9, 12, 16 and 18), during the fastest crash in history.',
    moduleId: M11,
  },
  {
    terme: 'sophisme de composition',
    en: 'fallacy of composition',
    definition:
      'L\'erreur de croire que ce qui vaut pour un acteur vaut pour tous en même temps : une sortie de secours dimensionnée pour un individu ne l\'est jamais pour la salle entière. Votre stop-loss n\'est une protection que si les autres n\'ont pas le même ; l\'assurance de portefeuille de 1987 supposait qu\'il y aurait toujours quelqu\'un en face — pour 90 Md$ suivant la même règle, il n\'y avait personne. C\'est la définition du risque endogène : le danger n\'était pas dans la stratégie, mais dans son succès.',
    definitionEn:
      'The error of believing that what holds for one player holds for all at once: an emergency exit sized for an individual is never sized for the whole room. Your stop-loss only protects you if others do not have the same one; 1987\'s portfolio insurance assumed there would always be someone on the other side — for $90bn following the same rule, there was no one. That is the definition of endogenous risk: the danger was not in the strategy, but in its success.',
    moduleId: M11,
  },
  {
    terme: 'trade de convergence',
    en: 'convergence trade',
    definition:
      'Acheter un actif décoté, vendre à découvert son jumeau surcoté, attendre que l\'écart se referme — le gain ne dépend pas de la direction du marché, seulement de la convergence. L\'exemple canonique de LTCM : Treasury off-the-run contre on-the-run, quelques points de base d\'écart pour un risque de crédit identique, démultipliés par un levier massif. Le point faible est dans la définition : « attendre » suppose de pouvoir tenir, et l\'écart peut s\'élargir longtemps avant de se refermer — les trades de LTCM ont presque tous convergé… en 1999, après la mort du fonds.',
    definitionEn:
      'Buy the cheap asset, short its expensive twin, wait for the gap to close — the gain does not depend on market direction, only on convergence. LTCM\'s canonical example: off-the-run versus on-the-run Treasuries, a few basis points of spread for identical credit risk, multiplied through massive leverage. The weakness is in the definition itself: "waiting" assumes you can hold on, and the gap can widen for a long time before closing — LTCM\'s trades almost all converged… in 1999, after the fund\'s death.',
    moduleId: M11,
  },
  {
    terme: 'crowded trade',
    en: 'crowded trade',
    definition:
      'Une position portée par trop d\'acteurs en même temps : le risque n\'est plus dans les flux de l\'actif, il est dans la liste de ceux qui portent la même — car ce sont leurs ventes forcées qui feront votre prix de sortie. La leçon commune de 1987 et de LTCM : des positions construites comme indépendantes se révèlent être le même pari répété cent fois — le pari que le calme continue. Cette liste ne figure dans aucun modèle, et sa mesure reste un problème ouvert de la gestion des risques.',
    definitionEn:
      'A position held by too many players at once: the risk is no longer in the asset\'s cash flows, it is in the list of those holding the same one — because their forced sales will set your exit price. The shared lesson of 1987 and LTCM: positions built as independent turn out to be the same bet repeated a hundred times — the bet that calm continues. That list appears in no model, and measuring it remains an open problem of risk management.',
    moduleId: M11,
  },
  {
    terme: 'LTCM',
    en: 'LTCM',
    definition:
      'Long-Term Capital Management, fondé en 1994 par John Meriwether avec Merton et Scholes (Nobel 1997) au conseil : plus de 40 % de rendement en 1995 et 1996, puis la chute la plus instructive de l\'histoire des hedge funds. Début 1998 : 125 Md$ d\'actifs sur 4,7 Md$ de capital (levier ≈ 27, mort à −3,7 %), plus de 1 000 Md$ de notionnels, financés par des haircuts repo quasi nuls. Le défaut russe d\'août 1998 écarte tous les spreads à la fois : −44 % sur le mois, levier au-delà de 250 fin septembre. Sauvetage le 23 septembre : consortium PRIVÉ de quatorze banques, 3,625 Md$ — pas un dollar public.',
    definitionEn:
      'Long-Term Capital Management, founded in 1994 by John Meriwether with Merton and Scholes (1997 Nobel) on the board: over 40% returns in 1995 and 1996, then the most instructive collapse in hedge fund history. Early 1998: $125bn of assets on $4.7bn of capital (leverage ≈ 27, death at −3.7%), over $1tn of derivative notionals, funded through near-zero repo haircuts. The August 1998 Russian default widens every spread at once: −44% on the month, leverage beyond 250 by late September. The rescue on 23 September: a PRIVATE consortium of fourteen banks, $3.625bn — not one public dollar.',
    moduleId: M11,
  },
  {
    terme: 'fuite vers la qualité',
    en: 'flight to quality',
    definition:
      'Le réflexe de crise : tout le monde veut en même temps du sûr et du liquide — Treasuries on-the-run, Bund, dollar — et vend tout le reste, quels que soient les fondamentaux. C\'est elle qui a tué LTCM en août 1998 : chaque trade de convergence était en substance « vendre la qualité, acheter l\'écart » — tous les spreads se sont écartés ensemble, les corrélations montant vers 1 le jour où la diversification devait sauver. Sa forme extrême, le dash for cash de mars 2020, vend même les Treasuries.',
    definitionEn:
      'The crisis reflex: everyone wants the safe and the liquid at the same time — on-the-run Treasuries, Bunds, dollars — and sells everything else, whatever the fundamentals. It is what killed LTCM in August 1998: every convergence trade was in essence "sell quality, buy the spread" — all spreads widened together, correlations rising towards 1 on the very day diversification was supposed to save. Its extreme form, March 2020\'s dash for cash, sells even the Treasuries.',
    moduleId: M11,
  },
  {
    terme: 'originate-to-distribute',
    en: 'originate-to-distribute',
    definition:
      'Le modèle industriel du crédit des années 2000 : le courtier qui origine le prêt le revend immédiatement à un arrangeur qui le titrise — payé à la commission, au volume, il ne porte aucun risque de défaut. Chaque maillon (courtier, arrangeur, agence de notation) est rémunéré au flux, et le risque final atterrit chez un investisseur qui n\'a jamais vu l\'emprunteur. Quand plus personne dans la chaîne n\'est exposé, plus personne ne vérifie : la qualité du crédit devient l\'affaire de tout le monde, c\'est-à-dire de personne.',
    definitionEn:
      'The 2000s\' industrial credit model: the broker who originates the loan immediately sells it to an arranger who securitises it — paid by commission, on volume, he carries no default risk. Every link in the chain (broker, arranger, rating agency) is paid on flow, and the final risk lands with an investor who never saw the borrower. When no one in the chain is exposed anymore, no one checks: credit quality becomes everyone\'s business, that is to say no one\'s.',
    moduleId: M11,
  },
  {
    terme: 'subprime',
    en: 'subprime',
    definition:
      'Le crédit immobilier américain aux emprunteurs fragiles — revenus faibles ou irréguliers, historique abîmé — devenu environ 20 % de la production 2005-2006, via des structures 2/28 (deux ans de taux d\'appel, vingt-huit de taux plein) jusqu\'aux prêts NINJA (no income, no job, no assets). Viable tant que les prix montent (on refinance sur la valeur accrue), insolvable par construction dès qu\'ils stagnent. Les pertes finales, ~500 Md$, sont dix fois plus petites que la dot-com — mais logées dans des bilans à levier 30 financés au jour le jour : c\'est le financement, pas la perte, qui a fait le systémique.',
    definitionEn:
      'US mortgage credit to fragile borrowers — low or irregular income, damaged credit history — grown to about 20% of 2005-2006 production, via 2/28 structures (two years of teaser rate, twenty-eight at full rate) up to NINJA loans (no income, no job, no assets). Viable as long as prices rise (you refinance against the increased value), insolvent by construction once they stall. Final losses, ~$500bn, are ten times smaller than the dot-com — but lodged in leverage-30 balance sheets funded overnight: the funding, not the loss, is what made it systemic.',
    moduleId: M11,
  },
  {
    terme: 'MBS',
    en: 'MBS (mortgage-backed security)',
    definition:
      'Titre adossé à un pool de quelques milliers de prêts immobiliers, dont les flux sont découpés en tranches hiérarchisées par la subordination. Premier étage de la titrisation de 2008, et instrument encore central aujourd\'hui — c\'est en MBS d\'agences (avec les Treasuries) que SVB avait investi ses dépôts, duration proche de 5,7 : aucun défaut dans le portefeuille, et pourtant les fonds propres détruits par la seule hausse des taux. Le risque de taux n\'est pas un risque de crédit.',
    definitionEn:
      'A security backed by a pool of a few thousand mortgage loans, whose cash flows are carved into tranches ranked by subordination. The first floor of 2008\'s securitisation, and still a central instrument today — it was in agency MBS (with Treasuries) that SVB invested its deposits, duration near 5.7: no default in the portfolio, and yet the equity destroyed by the rate rise alone. Rate risk is not credit risk.',
    moduleId: M11,
  },
  {
    terme: 'CDO',
    en: 'CDO (collateralized debt obligation)',
    definition:
      'Le deuxième étage des poupées russes de 2008 : les tranches mezzanine de MBS qui se vendaient mal sont elles-mêmes mises en pool et retranchées — la subordination refabrique du AAA à partir des invendus de l\'étage inférieur, et le CDO² recommence sur des CDO. À chaque étage, la sensibilité à l\'hypothèse de corrélation est démultipliée : calibrée sur des données où l\'immobilier ne baissait jamais partout à la fois, elle saute vers 1 dans le retournement national de 2007 — et le AAA est en première ligne. La leçon du worst-of du module 9, trois ordres de grandeur au-dessus.',
    definitionEn:
      'The second floor of 2008\'s Russian dolls: the MBS mezzanine tranches that sold poorly are themselves pooled and re-tranched — subordination remanufactures AAA out of the lower floor\'s unsold paper, and the CDO² does it again on CDOs. At each floor, sensitivity to the correlation assumption is multiplied: calibrated on data where housing never fell everywhere at once, it jumps towards 1 in the 2007 national downturn — and the AAA is in the front line. Module 9\'s worst-of lesson, three orders of magnitude bigger.',
    moduleId: M11,
  },
  {
    terme: 'tranche / subordination',
    en: 'tranche / subordination',
    definition:
      'La subordination est un ordre de passage devant les pertes : sur un pool de 100 découpé en equity 5 / mezzanine 15 / senior 80, les défauts frappent l\'equity d\'abord, la mezzanine au-delà de 5 de pertes, le senior au-delà de 20. Si les défauts sont peu corrélés, la probabilité de traverser 20 est infime : le senior peut être noté AAA au-dessus d\'un pool BBB. Toute la magie repose sur ce « si » — la subordination protège contre des défauts isolés, jamais contre un choc commun.',
    definitionEn:
      'Subordination is an order of passage before losses: on a pool of 100 carved into equity 5 / mezzanine 15 / senior 80, defaults hit the equity first, the mezzanine beyond 5 of losses, the senior beyond 20. If defaults are weakly correlated, the probability of piercing 20 is tiny: the senior can be rated AAA on top of a BBB pool. All the magic rests on that "if" — subordination protects against isolated defaults, never against a common shock.',
    moduleId: M11,
  },
  {
    terme: 'agence de notation',
    en: 'rating agency',
    definition:
      'Les noteurs du crédit (Moody\'s, S&P, Fitch), payés par l\'émetteur qu\'ils notent — le conflit émetteur-payeur : refuser le AAA, c\'est perdre le client au profit de l\'agence d\'à côté. En 2006, elles notent AAA des tranches senior de CDO calibrées sur une corrélation d\'avant-retournement. La confusion à dissiper en entretien : un AAA structuré n\'est pas un AAA corporate — le second survit à presque tous les scénarios, le premier survit à tous les scénarios sauf un, précisément celui qui s\'est produit.',
    definitionEn:
      'The credit raters (Moody\'s, S&P, Fitch), paid by the issuer they rate — the issuer-pays conflict: refusing the AAA means losing the client to the agency next door. In 2006 they rate AAA senior CDO tranches calibrated on pre-downturn correlation. The confusion to dispel in an interview: a structured AAA is not a corporate AAA — the latter survives almost every scenario, the former survives every scenario but one, precisely the one that happened.',
    moduleId: M11,
  },
  {
    terme: 'SIV',
    en: 'SIV (structured investment vehicle)',
    definition:
      'Véhicule hors bilan emblématique du shadow banking de 2007 : il loge des actifs titrisés à 30 ans hors du bilan des banques et les finance en papier court à renouveler sans cesse. Une banque sans le statut de banque : ni dépôts assurés, ni accès au prêteur en dernier ressort — le jour où le papier commercial ne se renouvelle pas, il n\'y a pas de guichet d\'urgence, et les actifs reviennent d\'un coup sur le bilan de la banque sponsor. Le levier caché qui rendait le levier officiel de 2007 illusoire.',
    definitionEn:
      'The emblematic off-balance-sheet vehicle of 2007\'s shadow banking: it houses 30-year securitised assets off banks\' balance sheets and funds them with short paper to be rolled endlessly. A bank without bank status: no insured deposits, no access to the lender of last resort — the day the commercial paper does not roll, there is no emergency window, and the assets land back at once on the sponsoring bank\'s balance sheet. The hidden leverage that made 2007\'s official leverage illusory.',
    moduleId: M11,
  },
  {
    terme: 'ABCP',
    en: 'ABCP (asset-backed commercial paper)',
    definition:
      'Le papier commercial adossé à des actifs : la dette à ~30 jours par laquelle les SIV et conduits finançaient des actifs titrisés à 30 ans — la transformation de maturité d\'une banque, sans l\'assurance des dépôts ni le guichet. À l\'été 2007, les fonds monétaires cessent de le renouveler : le financement s\'évapore en silence, les actifs refluent vers les banques sponsors, et le marché monétaire se fige — le 9 août 2007, BNP Paribas gèle trois fonds faute de pouvoir valoriser.',
    definitionEn:
      'Commercial paper backed by assets: the ~30-day debt with which SIVs and conduits funded 30-year securitised assets — a bank\'s maturity transformation, without deposit insurance or the discount window. In summer 2007, money market funds stop rolling it: funding evaporates silently, assets flow back to sponsoring banks, and the money market freezes — on 9 August 2007, BNP Paribas gates three funds for want of a valuation.',
    moduleId: M11,
  },
  {
    terme: 'shadow banking',
    en: 'shadow banking',
    definition:
      'Le système bancaire parallèle : l\'ensemble des structures qui font le métier d\'une banque — transformer du financement court en actifs longs — sans en avoir le statut : ni dépôts assurés, ni prêteur en dernier ressort, ni supervision bancaire. Ses véhicules de 2007 : SIV, conduits ABCP, et le marché du repo où les broker-dealers se finançaient au jour le jour. Le diagnostic de Gorton : le système parallèle avait reconstruit la banque d\'avant 1934, avec la même inflammabilité et sans l\'extincteur.',
    definitionEn:
      'The parallel banking system: all the structures doing a bank\'s job — transforming short funding into long assets — without bank status: no insured deposits, no lender of last resort, no banking supervision. Its 2007 vehicles: SIVs, ABCP conduits, and the repo market where broker-dealers funded themselves overnight. Gorton\'s diagnosis: the parallel system had rebuilt pre-1934 banking, with the same flammability and without the extinguisher.',
    moduleId: M11,
  },
  {
    terme: 'run sur le repo',
    en: 'run on repo',
    definition:
      'La forme moderne de la ruée bancaire, théorisée par Gary Gorton : le run de 2008 ne fut pas une file de déposants mais une ruée sur les haircuts — le prêteur de repo ne dit pas « non », il dit « 25 % de haircut ». Le même portefeuille qui levait 98 n\'en finance plus que 75 : 23 à trouver le jour même, en vendant dans un marché qui baisse — et les ventes élargissent les haircuts des autres. Invisible car jouée entre institutions, dans des chiffres que seuls les trésoriers voyaient : un run sans une seule photo de guichet.',
    definitionEn:
      'The modern form of the bank run, theorised by Gary Gorton: the 2008 run was not a queue of depositors but a run on haircuts — the repo lender does not say "no", he says "25% haircut". The same portfolio that raised 98 now funds only 75: 23 to find the same day, by selling into a falling market — and the sales widen everyone else\'s haircuts. Invisible because played out between institutions, in numbers only treasurers saw: a run without a single photo of a counter.',
    moduleId: M11,
  },
  {
    terme: 'breaking the buck',
    en: 'breaking the buck',
    definition:
      'Le moment où la valeur liquidative d\'un fonds monétaire passe sous 1 \$ — l\'impensable, car ces fonds étaient réputés aussi sûrs qu\'un dépôt. Le 16 septembre 2008, le Reserve Primary Fund, chargé en papier Lehman, casse le dollar : la ruée gagne instantanément tous les fonds monétaires, qui sont les premiers acheteurs de papier commercial — le financement court des entreprises se ferme, et la crise bancaire devient l\'affaire de l\'économie entière.',
    definitionEn:
      'The moment a money market fund\'s net asset value falls below \$1 — the unthinkable, since these funds were deemed as safe as a deposit. On 16 September 2008, the Reserve Primary Fund, loaded with Lehman paper, breaks the buck: the run instantly spreads to all money market funds, which are the primary buyers of commercial paper — corporate short-term funding shuts down, and the banking crisis becomes the whole economy\'s business.',
    moduleId: M11,
  },
  {
    terme: 'TARP',
    en: 'TARP',
    definition:
      'Le Troubled Asset Relief Program : 700 Md$ votés en octobre 2008 pour recapitaliser les banques américaines — le backstop public qui a mis un plancher sous le système. Le rappel de démocratie de marché : le 29 septembre 2008, la Chambre des représentants le REJETTE — le S&P 500 perd 8,8 % dans la journée, et le plan est voté le 3 octobre. Sans backstop public crédible, pas de plancher : la leçon que l\'Europe réapprendra avec le FESF, le MES puis l\'OMT.',
    definitionEn:
      'The Troubled Asset Relief Program: $700bn voted in October 2008 to recapitalise American banks — the public backstop that put a floor under the system. The market-democracy reminder: on 29 September 2008, the House of Representatives REJECTS it — the S&P 500 loses 8.8% that day, and the plan passes on 3 October. Without a credible public backstop, no floor: the lesson Europe would relearn with the EFSF, the ESM and then the OMT.',
    moduleId: M11,
  },
  {
    terme: 'doom loop',
    en: 'doom loop',
    definition:
      'L\'étreinte mortelle entre un État et ses banques, nouée par deux liens : les banques nationales détiennent massivement la dette de leur propre État (biais domestique) — si elle décote, leurs fonds propres fondent ; et l\'État est le garant en dernier ressort de ses banques — si elles vacillent, sa dette gonfle. Deux portes d\'entrée, une seule pièce : l\'Irlande entre par la jambe bancaire (sauvetage à ~64 Md€, ~40 % du PIB), la Grèce par la jambe souveraine. Le LTRO de 2011-2012 l\'a resserrée en croyant la soulager ; l\'union bancaire de 2014 vise à la couper.',
    definitionEn:
      'The deadly embrace between a State and its banks, tied by two links: domestic banks massively hold their own sovereign\'s debt (home bias) — if it sells off, their equity melts; and the State is the last-resort guarantor of its banks — if they wobble, its debt balloons. Two entrance doors, one room: Ireland enters through the banking leg (a rescue of ~€64bn, ~40% of GDP), Greece through the sovereign leg. The 2011-2012 LTRO tightened it while meaning to relieve it; the 2014 banking union aims to cut it.',
    moduleId: M11,
  },
  {
    terme: 'troïka',
    en: 'troika',
    definition:
      'Le trio Commission européenne, BCE et FMI qui surveillait les plans de sauvetage de la zone euro — Grèce (110 Md€ en mai 2010), Irlande, Portugal — en échange d\'ajustements budgétaires drastiques. Le bilan est lourd : le PIB grec chute d\'environ 25 % entre 2008 et 2013, le chômage dépasse 27 % — et le FMI reconnaîtra en 2013 avoir sous-estimé les multiplicateurs budgétaires : couper 1 de dépense dans une économie en chute retire nettement plus que 1 d\'activité. Un plan peut être arithmétiquement cohérent et économiquement auto-défaisant.',
    definitionEn:
      'The trio of European Commission, ECB and IMF that supervised the euro area\'s rescue programmes — Greece (€110bn in May 2010), Ireland, Portugal — in exchange for drastic fiscal adjustment. The toll is heavy: Greek GDP falls about 25% between 2008 and 2013, unemployment exceeds 27% — and the IMF would admit in 2013 that it had underestimated fiscal multipliers: cutting 1 of spending in a collapsing economy removes distinctly more than 1 of activity. A plan can be arithmetically coherent and economically self-defeating.',
    moduleId: M11,
  },
  {
    terme: 'FESF / MES',
    en: 'EFSF / ESM',
    definition:
      'Les fonds de secours de la zone euro : le FESF, véhicule temporaire né en mai 2010 dans la foulée du premier plan grec, pérennisé en 2012 par le MES (Mécanisme européen de stabilité), le pare-feu permanent doté d\'environ 500 Md€ de capacité. Leur limite structurelle, révélée à l\'été 2011 : on peut secourir la Grèce, pas l\'Italie — trop grosse pour le fonds. C\'est ce constat qui a rendu l\'OMT nécessaire : contre un marché qui teste les limites, seul un backstop sans limite est crédible.',
    definitionEn:
      'The euro area\'s rescue funds: the EFSF, a temporary vehicle born in May 2010 on the heels of the first Greek programme, made permanent in 2012 by the ESM (European Stability Mechanism), the standing firewall with about €500bn of capacity. Their structural limit, revealed in summer 2011: you can rescue Greece, not Italy — too big for the fund. That realisation is what made the OMT necessary: against a market that tests limits, only a limitless backstop is credible.',
    moduleId: M11,
  },
  {
    terme: 'PSI',
    en: 'PSI (private sector involvement)',
    definition:
      'L\'euphémisme officiel du plus gros défaut souverain de l\'histoire, mars 2012 : un échange « volontaire » de titres grecs, sous la menace explicite qu\'il n\'y aurait pas de plan B. Sur environ 200 Md€ de dette détenue par le privé, décote nominale de 53,5 % — et environ 75 % de perte en valeur actuelle en comptant les nouveaux taux et maturités. Les CDS souverains sont déclenchés, l\'assurance fonctionne, et le tabou tombe : la dette d\'un État de la zone euro peut ne pas être remboursée.',
    definitionEn:
      'The official euphemism for the biggest sovereign default in history, March 2012: a "voluntary" exchange of Greek bonds, under the explicit threat that there was no plan B. On roughly €200bn of privately-held debt, a 53.5% nominal haircut — and about 75% loss in present value counting the new rates and maturities. Sovereign CDS are triggered, the insurance works, and the taboo falls: a euro area sovereign\'s debt can go unpaid.',
    moduleId: M11,
  },
  {
    terme: 'dash for cash',
    en: 'dash for cash',
    definition:
      'Le paroxysme de mars 2020 : même les Treasuries et l\'or baissent avec les actions — non que leurs fondamentaux plongent, mais tout le monde vend ce qui est liquide pour lever du cash (rachats de fonds, appels de marge sur basis trades, rapatriements de dollars). La signature à connaître : quand la couverture baisse AVEC l\'actif risqué, on n\'est plus dans une crise de valorisation mais dans une crise de liquidité — et le plancher n\'est pas une valorisation, c\'est le bilan de l\'acheteur illimité (le 23 mars 2020, jour du QE illimité, fut le creux exact).',
    definitionEn:
      'March 2020\'s paroxysm: even Treasuries and gold fall alongside equities — not because their fundamentals plunge, but because everyone sells whatever is liquid to raise cash (fund redemptions, margin calls on basis trades, dollar repatriation). The signature to know: when the hedge falls WITH the risky asset, you are no longer in a valuation crisis but in a liquidity crisis — and the floor is not a valuation, it is the unlimited buyer\'s balance sheet (23 March 2020, the day of unlimited QE, was the exact trough).',
    moduleId: M11,
  },
  {
    terme: 'BTFP',
    en: 'BTFP (Bank Term Funding Program)',
    definition:
      'La facilité créée par la Fed le 12 mars 2023, au lendemain de SVB : prêter aux banques AU PAIR contre du collatéral (Treasuries, MBS) qui cote sous le pair. Un Bagehot tordu, taillé sur mesure pour une crise de duration : prêter largement contre du bon collatéral, oui — mais valorisé généreusement, en fermant les yeux sur la moins-value latente que la hausse des taux a creusée. Avec la garantie de tous les dépôts de SVB (« systemic risk exception »), le backstop qui a arrêté la contagion des banques régionales.',
    definitionEn:
      'The facility created by the Fed on 12 March 2023, the day after SVB: lending to banks AT PAR against collateral (Treasuries, MBS) trading below par. A twisted Bagehot, tailor-made for a duration crisis: lend freely against good collateral, yes — but generously valued, eyes closed to the unrealised loss the rate rise had dug. Together with the guarantee of all SVB deposits (the "systemic risk exception"), the backstop that stopped the regional-bank contagion.',
    moduleId: M11,
  },
  {
    terme: 'AT1',
    en: 'AT1 (Additional Tier 1)',
    definition:
      'Obligations de fonds propres additionnels créées par Bâle III, conçues pour absorber les pertes AVANT le contribuable — convertibles ou effaçables sur décision du régulateur. Le cas d\'école de mars 2023 : au rachat de Credit Suisse par UBS, les 17 Md CHF d\'AT1 sont effacés intégralement alors que les actionnaires reçoivent 3 Md — hiérarchie apparemment violée, mais prévue noir sur blanc dans les prospectus suisses. La leçon de desk : le rang de subordination effectif est contractuel, pas théorique — lisez la documentation.',
    definitionEn:
      'Additional Tier 1 capital bonds created by Basel III, designed to absorb losses BEFORE the taxpayer — convertible or writable-down at the regulator\'s decision. The March 2023 case study: in UBS\'s takeover of Credit Suisse, the CHF 17bn of AT1s are written down entirely while shareholders receive 3bn — a hierarchy apparently violated, but spelled out in black and white in the Swiss prospectuses. The desk lesson: the effective subordination rank is contractual, not theoretical — read the documentation.',
    moduleId: M11,
  },
  {
    terme: 'aléa moral',
    en: 'moral hazard',
    definition:
      'L\'effet pervers de tout sauvetage réussi : assuré contre la perte extrême, l\'acteur prend plus de risque — chaque intervention du pompier enseigne au marché à porter plus de levier. Le fil du module : le communiqué Greenspan de 1987 devient le « Fed put », qui devient le QE illimité de mars 2020, qui devient la garantie de tous les dépôts de mars 2023. Chaque sauvetage fut, isolément, la bonne décision — et la question non résolue de la décennie : le système est-il plus sûr, ou seulement assuré par un assureur de plus en plus chargé ?',
    definitionEn:
      'The perverse effect of every successful rescue: insured against extreme loss, players take more risk — each firefighter intervention teaches the market to carry more leverage. The module\'s thread: the 1987 Greenspan statement becomes the "Fed put", which becomes March 2020\'s unlimited QE, which becomes March 2023\'s guarantee of all deposits. Each rescue was, in isolation, the right decision — and the decade\'s unresolved question: is the system safer, or merely insured by an ever more loaded insurer?',
    moduleId: M11,
  },
  {
    terme: 'Fed put',
    en: 'Fed put',
    definition:
      'La conviction de marché que la Fed interviendra pour amortir toute baisse sévère — comme si les investisseurs détenaient un put gratuit signé de la banque centrale. Héritier direct du communiqué Greenspan du 20 octobre 1987, renforcé par chaque sauvetage réussi jusqu\'au QE illimité du 23 mars 2020. Ses limites, à citer : 2022 (−25 % sans secours, car l\'inflation était l\'ennemie) — le put existe, mais son prix d\'exercice dépend du régime d\'inflation.',
    definitionEn:
      'The market conviction that the Fed will step in to cushion any severe fall — as if investors held a free put written by the central bank. Direct heir of the Greenspan statement of 20 October 1987, reinforced by every successful rescue up to the unlimited QE of 23 March 2020. Its limits, worth citing: 2022 (−25% with no rescue, because inflation was the enemy) — the put exists, but its strike depends on the inflation regime.',
    moduleId: M11,
  },
  {
    terme: 'spirale de liquidité',
    en: 'liquidity spiral',
    definition:
      'La mécanique motrice de 1929, 1987, 1998, 2008 et 2022 : un bilan levié encaisse un choc, les fonds propres fondent plus vite que les actifs, le levier monte au pire moment, le prêteur exige de revenir à la cible — il faut vendre, sous décote, ce qui déprime les prix du book restant et force une nouvelle vente : choc → fonds propres → vente forcée → re-valorisation → re-choc. Elle converge ou elle tue : si λ·d ≥ 1 (levier fois décote), vendre ne désendette plus — c\'est la zone de mort, et il ne reste que le sauvetage ou la faillite.',
    definitionEn:
      'The driving mechanism of 1929, 1987, 1998, 2008 and 2022: a levered balance sheet takes a shock, equity melts faster than assets, leverage rises at the worst moment, the lender demands a return to target — you must sell, at a discount, which depresses the remaining book\'s prices and forces another sale: shock → equity → forced sale → re-marking → re-shock. It converges or it kills: if λ·d ≥ 1 (leverage times discount), selling no longer deleverages — that is the death zone, and only rescue or bankruptcy remain.',
    moduleId: M11,
  },
  {
    terme: 'vente forcée',
    en: 'fire sale',
    definition:
      'Vendre parce qu\'on ne peut pas faire autrement — appel de marge, haircut relevé, rachats, ratio à respecter — donc vendre sous décote, au prix qu\'offre le marché stressé. L\'arithmétique : lever 95 de cash sous 5 % de décote oblige à vendre 100. C\'est le maillon qui transforme la moins-value latente en perte réelle (SVB : 21 Md$ vendus le 8 mars 2023, 1,8 Md$ de perte actée, run le lendemain) et le carburant de toutes les spirales — et c\'est pourquoi le pompier efficace n\'achète pas tout : il écrase la décote pour rouvrir la sortie.',
    definitionEn:
      'Selling because you have no choice — margin call, raised haircut, redemptions, a ratio to respect — hence selling at a discount, at whatever the stressed market offers. The arithmetic: raising 95 of cash under a 5% discount forces you to sell 100. It is the link that turns the unrealised loss into a real one (SVB: $21bn sold on 8 March 2023, $1.8bn loss booked, run the next day) and the fuel of every spiral — which is why the effective firefighter does not buy everything: he crushes the discount to reopen the exit.',
    moduleId: M11,
  },
  {
    terme: 'drawdown',
    en: 'drawdown',
    definition:
      'La perte pic-à-creux d\'un actif ou d\'un portefeuille, en % signé : (creux/pic − 1) × 100 — la carte d\'identité chiffrée de chaque krach. Le musée du module : −89,2 % (Dow 1929-1932), −36,1 % (1987, dont −22,6 % en une séance), −77,9 % (Nasdaq 2000-2002), −56,8 % (S&P 2007-2009), −33,9 % en 23 séances (COVID 2020). Toujours l\'accompagner du gain requis pour récupérer — 100/(100 − p) − 1, convexe : après −89 %, il faut +809 %.',
    definitionEn:
      'An asset\'s or portfolio\'s peak-to-trough loss, in signed %: (trough/peak − 1) × 100 — each crash\'s numbered identity card. The module\'s museum: −89.2% (Dow 1929-1932), −36.1% (1987, including −22.6% in one session), −77.9% (Nasdaq 2000-2002), −56.8% (S&P 2007-2009), −33.9% in 23 sessions (COVID 2020). Always pair it with the required recovery gain — 100/(100 − p) − 1, convex: after −89%, you need +809%.',
    moduleId: M11,
  },
];
