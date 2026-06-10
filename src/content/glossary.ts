import type { GlossaireEntree } from '../engine/types';

const M4 = '04-taux-obligations';

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
];
